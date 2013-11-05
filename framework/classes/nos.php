<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos;

class Nos
{
    /**
     * @var  string  constant used for when entry point is back-office
     */
    const ENTRY_POINT_ADMIN = 'admin';
    /**
     * @var  string  constant used for when entry point is front-office
     */
    const ENTRY_POINT_FRONT = 'front';
    /**
     * @var  string  constant used for when entry point is 404
     */
    const ENTRY_POINT_404 = '404';
    /**
     * @var  string  constant used for when entry point is install
     */
    const ENTRY_POINT_INSTALL = 'install';

    /**
     * @var  string  The Novius OS entry point
     */
    public static $entry_point = NOS_ENTRY_POINT;

    /**
     * Returns the controller instance from the main request
     *
     * @return \Nos\Controller
     */
    public static function main_controller()
    {
        return \Request::main()->controller_instance;
    }

    /**
     *
     * @param string  $where  Route for the request
     * @param array   $args   The method parameters
     * @param boolean $inline true  will execute the controller's action directly
     *                           false will writes the function call and include it
     * @return string
     */
    public static function hmvc($where, $args = null)
    {
        \Fuel::$profiling && \Profiler::console("HMVC $where");

        if (empty($args['args'])) {
            $args['args'] = array();
        }

        ob_start();
        try {
            $request = \Request::forge($where);

            $response = $request->execute($args['args']);

            echo $response;
        } catch (\Nos\FrontIgnoreTemplateException $e) {
            throw $e;
        } catch (\Nos\NotFoundException $e) {
            throw $e;
        } catch (\Exception $e) {
            if (\Fuel::$env == \Fuel::DEVELOPMENT) {
                \Debug::dump('Error when executing HMVC request "'.$where.'"');
                $old_continue_on = \Config::get('errors.continue_on', array());
                $continue_on = $old_continue_on;
                $continue_on[] = $e->getCode();
                \Config::set('errors.continue_on', $continue_on);
                \Error::show_php_error($e);
                $backtrace = \Debug::local_backtrace(true);
                $profiled = array();
                for ($i = 0; $i < count($backtrace); $i++) {
                    $profiled[] = $backtrace[$i]['file'].'@'.$backtrace[$i]['line'];
                }
                \Debug::dump($profiled);

                \Config::set('errors.continue_on', $old_continue_on);
            }
            \Log::logException($e, 'HMVC - ');
            \Fuel::$profiling && \Console::logError($e, "HMVC request '$where' failed.");
        }
        $content = ob_get_clean();

        return $content;
    }

    /**
     * Parse a wyiswyg
     *
     * @param  string          $content    Wysiwyg content to parse
     * @param  \Nos\Controller $controller Context for the execution
     * @return string
     */
    public static function parse_wysiwyg($content)
    {
        static::_parse_enhancers($content);
        static::_parse_medias($content);
        static::_parse_internals($content);

        if (NOS_ENTRY_POINT === Nos::ENTRY_POINT_FRONT) {
            $content = preg_replace(
                '`href="#([^#"])`iUu',
                'href="'.\Nos\Tools_Url::encodePath(static::main_controller()->getUrl()).(!empty($_SERVER['QUERY_STRING']) ? '?'.$_SERVER['QUERY_STRING'] : '').'#\\1',
                $content
            );
        }

        $content = str_replace(
            'href="##',
            'href="#',
            $content
        );

        \Event::trigger_function('front.parse_wysiwyg', array(&$content));

        return $content;
    }

    protected static function _parse_enhancers(&$content)
    {
        // Fetch the available functions
        \Nos\Config_Data::load('enhancers');

        \Fuel::$profiling && \Profiler::mark('Recherche des fonctions dans la page');

        $callback = array(get_called_class(), 'get_enhancer_content');
        static::parse_enhancers(
            $content,
            function ($enhancer, $config, $tag) use (&$content, $callback) {
                $function_content = call_user_func($callback, $enhancer, $config);
                $content = str_replace($tag, $function_content, $content);
            }
        );
    }

    public static function parse_enhancers($content, $closure)
    {
        preg_match_all('`<(\w+)\s[^>]*data-enhancer=[^>]*>.*?</\\1>`u', $content, $matches);
        foreach ($matches[0] as $enhancer_content) {
            if (preg_match_all('`data-enhancer="([^"]+)"`u', $enhancer_content, $matches2)) {
                $enhancer = $matches2[1][0];
            } elseif (preg_match_all('`data-enhancer=\'([^\']+)\'`u', $enhancer_content, $matches2)) {
                $enhancer = $matches2[1][0];
            }
            if (preg_match_all('`data-config="([^"]+)"`u', $enhancer_content, $matches2)) {
                $config = $matches2[1][0];
            } elseif (preg_match_all('`data-config=\'([^\']+)\'`u', $enhancer_content, $matches2)) {
                $config = $matches2[1][0];
            }

            if (!empty($enhancer) && !empty($config)) {
                $closure($enhancer, $config, $enhancer_content);
            }
        }
    }

    public static function get_enhancer_content($enhancer, $args)
    {
        $args = json_decode(
            htmlspecialchars_decode(
                $args
            ),
            true
        );

        $config = \Nos\Config_Data::get('enhancers.'.$enhancer, false);

        $found = $config !== false;

        false && \Fuel::$profiling && \Profiler::console(
            array(
                'enhancer' => $enhancer,
            )
        );

        if ($found) {
            $function_content = self::hmvc(
                (!empty($config['urlEnhancer']) ? $config['urlEnhancer'] : $config['enhancer']),
                array(
                    'args' => array($args),
                )
            );
            if (empty($function_content) && \Fuel::$env == \Fuel::DEVELOPMENT) {
                $function_content = 'Enhancer '.$enhancer.' ('.$config['enhancer'].') returned empty content.';
            }
        } else {
            $function_content = \Fuel::$env == \Fuel::DEVELOPMENT ? 'Enhancer '.$enhancer.' not found.' : '';
            \Fuel::$profiling && \Console::logError(new \Exception(), 'Enhancer'.$enhancer.' not found.');
        }

        return $function_content;
    }

    protected static function _parse_medias(&$content)
    {
        Tools_Wysiwyg::parse_medias(
            $content,
            function ($media, $params) use (&$content) {
                if (empty($media)) {
                    if ($params['tag'] == 'img') {
                        // Remove dead images
                        $content = str_replace($params['content'], '', $content);
                    } elseif ($params['tag'] == 'a') {
                        // Remove href for links (they become anchor)?
                        // http://stackoverflow.com/questions/11144653/a-script-links-without-href
                        //$content = str_replace('href="'.$params['url'].'"', '', $content);
                    }
                } else {
                    if (!empty($params['height'])) {
                        $media_url = $media->urlResized($params['width'], $params['height']);
                    } else {
                        $media_url = $media->url();
                    }
                    $new_content = preg_replace('`'.preg_quote($params['url'], '`').'(?!\d)`u', Tools_Url::encodePath($media_url), $params['content']);
                    $content = str_replace($params['content'], $new_content, $content);
                }
            }
        );
    }

    protected static function _parse_internals(&$content)
    {
        // Replace internal links
        preg_match_all('`nos://page/(\d+)`u', $content, $matches);
        if (!empty($matches[0])) {
            $page_ids = array();
            foreach ($matches[1] as $match_id => $page_id) {
                $page_ids[] = $page_id;
            }
            $pages = \Nos\Page\Model_Page::find('all', array('where' => array(array('page_id', 'IN', $page_ids))));
            foreach ($matches[1] as $match_id => $page_id) {
                if (isset($pages[$page_id])) {
                    $content = preg_replace('`'.preg_quote($matches[0][$match_id], '`').'(?!\d)`u', Tools_Url::encodePath($pages[$page_id]->url()), $content);
                } else {
                    $content = str_replace('href="'.$matches[0][$match_id].'"', '', $content);
                }
            }
        }
    }
}
