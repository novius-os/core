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
        \Config::load(APPPATH.'data'.DS.'config'.DS.'enhancers.php', 'enhancers');

        \Fuel::$profiling && \Profiler::mark('Recherche des fonctions dans la page');

		preg_match_all('`<(\w+)\s[^>]+data-enhancer="([^"]+)" data-config="([^"]+)">.*?</\\1>`u', $content, $matches);
        foreach ($matches[2] as $match_id => $fct_id) {

            $function_content = static::__parse_enhancers($fct_id, $matches[3][$match_id], $controller);
			$content = str_replace($matches[0][$match_id], $function_content, $content);
		}

		preg_match_all('`<(\w+)\s[^>]+data-config="([^"]+)" data-enhancer="([^"]+)">.*?</\\1>`u', $content, $matches);
        foreach ($matches[3] as $match_id => $fct_id) {
            $function_content = static::__parse_enhancers($fct_id, $matches[2][$match_id], $controller);
			$content = str_replace($matches[0][$match_id], $function_content, $content);
		}
	}

    protected static function __parse_enhancers($fct_id, $args, $controller) {
        $args = json_decode(strtr($args, array(
            '&quot;' => '"',
        )), true);

        // Check if the function exists
        $name   = $fct_id;

        $config = \Config::get("enhancers.$name", false);

        $found  = $config !== false;

        false && \Fuel::$profiling && \Profiler::console(array(
            'function_id'   => $fct_id,
            'function_name' => $name,
            'controller'    => get_class($controller),
        ));

        if ($found) {
            $function_content = self::hmvc((!empty($config['urlEnhancer']) ? $config['urlEnhancer'] : $config['enhancer']), array(
                'args'        => array($args),
            ));
            if (empty($function_content) && \Fuel::$env == \Fuel::DEVELOPMENT) {
                $function_content = 'Enhancer '.$name.' ('.$config['enhancer'].') returned empty content.';
            }
        } else {
            $function_content = \Fuel::$env == \Fuel::DEVELOPMENT ? 'Enhancer '.$name.' not found in '.get_class($controller).'.' : '';
            \Fuel::$profiling && \Console::logError(new \Exception(), 'Enhancer'.$name.' not found in '.get_class($controller).'.');
        }
        return $function_content;
    }

	protected static function _parse_medias(&$content) {

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
				if (!empty($matches[3][$match_id])) {
					$media_url = $medias[$media_id]->get_public_path_resized($matches[2][$match_id], $matches[3][$match_id]);
				} else {
					$media_url = $medias[$media_id]->get_public_path();
				}
				$content = str_replace($matches[0][$match_id], $media_url, $content);
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
