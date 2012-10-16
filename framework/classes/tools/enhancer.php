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

class Tools_Enhancer
{
    public static function url_item($enhancer_name, $item, $params = array())
    {
        // Check if any page contains this enhancer
        \Config::load(APPPATH.'data'.DS.'config'.DS.'page_enhanced.php', 'data::page_enhanced');
        $page_enhanced = \Config::get('data::page_enhanced.'.$enhancer_name, array());
        if (empty($page_enhanced)) {
            return array();
        }

        // Check if this enhancer exists
        \Config::load(APPPATH.'metadata'.DS.'enhancers.php', 'data::enhancers');
        $enhancer = \Config::get('data::enhancers.'.$enhancer_name, array());
        if (empty($enhancer)) {
            return array();
        }

        $urlEnhancer = $enhancer['urlEnhancer'];

        // Calculate the classname of the enhancer's Controller
        // eg. noviusos_blog would match to Nos\Blog\Controller_Front
        $parts = explode('/', $urlEnhancer);
        $application_name = $parts[0];
        // Replace the application name with 'controller'
        $parts[0] = 'controller';
        // Remove the action
        array_pop($parts);
        // We're left with the fuel Controller classname!
        $controller_name = implode('_', $parts);
        $controller_name = \Inflector::words_to_upper($controller_name);

        // Check if the application exists
        \Config::load(APPPATH.'metadata'.DS.'app_namespaces.php', 'data::app_namespaces');
        $namespace = \Config::get('data::app_namespaces.'.$application_name, '');
        if (empty($namespace)) {
            return array();
        }

        // This files contains all the urlPath for the pages containing an URL enhancer
        \Config::load(APPPATH.'data'.DS.'config'.DS.'url_enhanced.php', 'data::url_enhanced');
        $url_enhanced = \Config::get('data::url_enhanced', array());

        $callback  = array($namespace.'\\'.$controller_name, 'get_url_model');
        $contextable = $item->behaviours('Nos\Orm_Behaviour_Contextable', false);
        if ($contextable) {
            $item_context = $item->get_context();
        }
        $urlItem   = call_user_func($callback, $item, $params);
        // Now fetch all the possible URLS
        $urls = array();
        $urlPath = \Arr::get($params, 'urlPath', false);
        $preview = \Arr::get($params, 'preview', false);
        if ($urlPath === false) {
            foreach ($page_enhanced as $page_id => $params) {
                if ((!$contextable || $params['context'] == $item_context) && ($preview || $params['published'])) {
                    $matches = array_filter($url_enhanced, function ($v) use ($page_id, $item_context) {
                            return $v['page_id'] === $page_id && $v['context'] === $item_context;
                        });

                    if (count($matches) > 0) {
                        list($urlPath) = $matches;
                        $urls[$page_id.'::'.$urlItem] = $urlPath.$urlItem;
                    }
                }
            }
        } else {
            $urls[] = $params['urlPath'].$urlItem;
        }

        return $urls;
    }

    public static function urls($enhancer_name, $params = array())
    {
        // Check if any page contains this enhancer
        \Config::load(APPPATH.'data'.DS.'config'.DS.'page_enhanced.php', 'data::page_enhanced');
        $page_enhanced = \Config::get('data::page_enhanced.'.$enhancer_name, array());
        if (empty($page_enhanced)) {
            return array();
        }

        // @todo: check if this enhancer exists?
        // @todo: check if the application exists?

        // This files contains all the urlPath for the pages containing an URL enhancer
        \Config::load(APPPATH.'data'.DS.'config'.DS.'url_enhanced.php', 'data::url_enhanced');
        $url_enhanced = \Config::get('data::url_enhanced', array());
        $url_enhanced_flipped = array_flip($url_enhanced);

        // Now fetch all the possible URLS
        $urls = array();
        $preview = \Arr::get($params, 'preview', false);
        $context    = \Arr::get($params, 'context', false);
        foreach ($page_enhanced as $page_id => $params) {
            if (($context === false || $params['context'] == $context) && ($preview || $params['published'])) {
                $matches = array_filter($url_enhanced, function ($v) use ($page_id, $context) {
                        return $v['page_id'] === $page_id && $v['context'] === $context;
                    });

                if (count($matches) > 0) {
                    list($urlPath) = $matches;
                    $urls[$page_id] = $urlPath;
                }
            }
        }

        return $urls;
    }

    public static function url($enhancer_name, $params = array())
    {
        $urls = static::urls($enhancer_name, $params);
        return reset($urls) ?: null;
    }

    public static function url_page($page_id)
    {
        \Config::load(APPPATH.'data'.DS.'config'.DS.'url_enhanced.php', 'data::url_enhanced');
        $url_enhanced = \Config::get('data::url_enhanced', array());
        $matches = array_filter($url_enhanced, function ($v) use ($page_id) {
                return $v['page_id'] === $page_id;
            });
        if (count($matches) > 0) {
            list($url) = $matches;
            return $url;
        } else {
            return false;
        }
    }

}
