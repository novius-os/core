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

class Nos {

    /**
     * Returns the controller instance from the main request
     *
     * @return \Nos\Controller
     */
    public static function main_controller() {
        return \Request::main()->controller_instance;
    }

    /**
     *
     * @param  string   $where   Route for the request
     * @param  array    $args    The method parameters
     * @param  boolean  $inline  true  will execute the controller's action directly
     *                           false will writes the function call and include it
     * @return string
     */
    public static function hmvc($where, $args = null) {

        \Fuel::$profiling && \Profiler::console("HMVC $where");

        if (empty($args['args'])) {
            $args['args'] = array();
        }

        ob_start();
        try {
            $request = \Request::forge($where);

            $response = $request->execute($args['args']);

            echo $response;
        } catch (\Nos\NotFoundException $e) {
            throw $e;
        } catch (\Exception $e) {
            if (\Fuel::$env == \Fuel::DEVELOPMENT) {
                \Debug::dump('Error in enhancer "'.$where.'"');
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
            \Fuel::$profiling && \Console::logError($e, "HMVC request '$where' failed.");
        }
        $content = ob_get_clean();
        return $content;
    }

    /**
     * Parse a wyiswyg
     *
     * @param  string           $content     Wysiwyg content to parse
     * @param  \Nos\Controller  $controller  Context for the execution
     * @return string
     */
    public static function parse_wysiwyg($content, $controller) {

        static::_parse_enhancers($content, $controller);
        static::_parse_medias($content);
        static::_parse_internals($content);

        $content = strtr($content, array(
            'nos://anchor/' => static::main_controller()->getUrl(),
        ));

        foreach(\Event::trigger('front.parse_wysiwyg', null, 'array') as $c) {
            is_callable($c) && call_user_func_array($c, array(&$content));
        }

        return $content;
    }

    protected static function _parse_enhancers(&$content, $controller) {
        // Fetch the available functions
        \Config::load(APPPATH.'data'.DS.'config'.DS.'enhancers.php', 'data::enhancers');

        \Fuel::$profiling && \Profiler::mark('Recherche des fonctions dans la page');

        $callback = array(get_called_class(), 'get_enhancer_content');
        static::parse_enhancers($content, function ($enhancer, $config, $tag) use (&$content, $controller, $callback) {
            $function_content = call_user_func($callback, $enhancer, $config, $controller);
            $content = str_replace($tag, $function_content, $content);
        });
    }

    public static function parse_enhancers($content, $closure) {
        preg_match_all('`<(\w+)\s[^>]+data-enhancer="([^"]+)" data-config="([^"]+)">.*?</\\1>`u', $content, $matches);
        foreach ($matches[2] as $match_id => $enhancer) {
            $closure($enhancer, $matches[3][$match_id], $matches[0][$match_id]);
        }

        preg_match_all('`<(\w+)\s[^>]+data-config="([^"]+)" data-enhancer="([^"]+)">.*?</\\1>`u', $content, $matches);
        foreach ($matches[3] as $match_id => $enhancer) {
            $closure($enhancer, $matches[2][$match_id], $matches[0][$match_id]);
        }
    }

    public static function get_enhancer_content($enhancer, $args, $controller) {
        $args = json_decode(strtr($args, array(
            '&quot;' => '"',
        )), true);

        $config = \Config::get("data::enhancers.$enhancer", false);

        $found  = $config !== false;

        false && \Fuel::$profiling && \Profiler::console(array(
            'enhancer' => $enhancer,
            'controller'    => get_class($controller),
        ));

        if ($found) {
            $function_content = self::hmvc((!empty($config['urlEnhancer']) ? $config['urlEnhancer'] : $config['enhancer']), array(
                'args'        => array($args),
            ));
            if (empty($function_content) && \Fuel::$env == \Fuel::DEVELOPMENT) {
                $function_content = 'Enhancer '.$enhancer.' ('.$config['enhancer'].') returned empty content.';
            }
        } else {
            $function_content = \Fuel::$env == \Fuel::DEVELOPMENT ? 'Enhancer '.$enhancer.' not found in '.get_class($controller).'.' : '';
            \Fuel::$profiling && \Console::logError(new \Exception(), 'Enhancer'.$enhancer.' not found in '.get_class($controller).'.');
        }
        return $function_content;
    }

    protected static function _parse_medias(&$content) {

        static::parse_medias($content, function($media, $width, $height, $tag) use (&$content)
        {
            if (!empty($height))
            {
                $media_url = $media->get_public_path_resized($width, $height);
            }
            else
            {
                $media_url = $media->get_public_path();
            }

            $content = str_replace($tag, $media_url, $content);
        });
    }

    public static function parse_medias(&$content, $closure) {

        // Replace media URL
        preg_match_all('`nos://media/(\d+)(?:/(\d+)/(\d+))?`u', $content, $matches);
        if (!empty($matches[0])) {
            $media_ids = array();
            foreach ($matches[1] as $match_id => $media_id)
            {
                $media_ids[] = $media_id;
            }
            $medias = Model_Media::find('all', array('where' => array(array('media_id', 'IN', $media_ids))));
            foreach ($matches[1] as $match_id => $media_id)
            {
                $closure($medias[$media_id], \Arr::get($matches[2], $match_id, null), \Arr::get($matches[3], $match_id, null), $matches[0][$match_id]);
            }
        }
    }

    protected static function _parse_internals(&$content) {

        // Replace internal links
        preg_match_all('`nos://page/(\d+)`u', $content, $matches);
        if (!empty($matches[0])) {
            $page_ids = array();
            foreach ($matches[1] as $match_id => $page_id)
            {
                $page_ids[] = $page_id;
            }
            $pages = Model_Page::find('all', array('where' => array(array('page_id', 'IN', $page_ids))));
            foreach ($matches[1] as $match_id => $page_id)
            {
                $content = str_replace($matches[0][$match_id], $pages[$page_id]->get_href(), $content);
            }
        }
    }
}
