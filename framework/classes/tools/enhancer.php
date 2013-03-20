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
        $page_enhanced = \Nos\Config_Data::get('page_enhanced.'.$enhancer_name, array());
        if (empty($page_enhanced)) {
            return array();
        }

        // Check if this enhancer exists
        $enhancer = \Nos\Config_Data::get('enhancers.'.$enhancer_name, array());
        if (empty($enhancer)) {
            logger(\Fuel::L_WARNING, 'The urlEnhancer "'.$enhancer_name.'" don\'t exist anymore.', __METHOD__);
            return array();
        }
        if (empty($enhancer['urlEnhancer'])) {
            throw new \RuntimeException('This enhancer "'.$enhancer_name.'" is not an urlEnhancer.');
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
        $namespace = \Nos\Config_Data::get('app_namespaces.'.$application_name, '');
        if (empty($namespace)) {
            return array();
        }

        // This files contains all the urlPath for the pages containing an URL enhancer
        $url_enhanced = \Nos\Config_Data::get('url_enhanced', array());

        $callback  = array($namespace.'\\'.$controller_name, 'get_url_model');
        $twinnable = $item->behaviours('Nos\Orm_Behaviour_Twinnable', false);
        if ($twinnable) {
            $item_context = $item->get_context();
        }
        $urlItem   = call_user_func($callback, $item, $params);
        // Now fetch all the possible URLS
        $urls = array();
        $urlPath = \Arr::get($params, 'urlPath', false);
        $preview = \Arr::get($params, 'preview', false);
        if ($urlPath === false) {
            foreach ($page_enhanced as $page_id => $params) {
                if ((!$twinnable || $params['context'] == $item_context) && ($preview || $params['published'])) {
                    $page_params = \Arr::get($url_enhanced, $page_id, false);
                    if ($page_params) {
                        $urls[$page_id.'::'.$urlItem] = \Nos\Tools_Url::context($page_params['context']).$page_params['url'].$urlItem;
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
        $page_enhanced = \Nos\Config_Data::get('page_enhanced.'.$enhancer_name, array());
        if (empty($page_enhanced)) {
            return array();
        }

        // @todo: check if this enhancer exists?
        // @todo: check if the application exists?

        // This files contains all the urlPath for the pages containing an URL enhancer
        $url_enhanced = \Nos\Config_Data::get('url_enhanced', array());

        // Now fetch all the possible URLS
        $urls = array();
        $preview = \Arr::get($params, 'preview', false);
        $context    = \Arr::get($params, 'context', false);
        foreach ($page_enhanced as $page_id => $params) {
            if (($context === false || $params['context'] == $context) && ($preview || $params['published'])) {
                $page_params = \Arr::get($url_enhanced, $page_id, false);
                if ($page_params) {
                    $urls[$page_id] = Tools_Url::page($page_id);
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
}
