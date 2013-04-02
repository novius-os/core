<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

/**
 * Extended Config class to allow callback on the loaded config
 */
class Config extends \Fuel\Core\Config
{
    public static function load($file, $group = null, $reload = false, $overwrite = false)
    {
        if ($file == 'db') {
            $group = 'db';
        }
        if (!$reload and is_array($file) and is_string($group)) {
            Event::trigger_function('config|'.$group, array(&$file));
        }

        return parent::load($file, $group, $reload, $overwrite);
    }

    public static function mergeWithUser($item, $config)
    {
        $user = Session::user();

        Arr::set($config, 'configuration_id', static::getDbName($item));

        return \Arr::merge($config, \Arr::get($user->getConfiguration(), static::getDbName($item), array()));
    }

    public static function configFile($class)
    {
        $namespace = trim(\Inflector::get_namespace($class), '\\');

        $application = mb_strtolower($namespace);
        $file = mb_strtolower(str_replace('_', DS, \Inflector::denamespace($class)));

        if ($application !== 'nos') {
            $namespaces = \Nos\Config_Data::get('app_namespaces', null);
            if ($app = array_search($namespace, $namespaces)) {
                $application = $app;
            }
        }

        return array($application, $file);
    }

    public static function loadConfiguration($app_name, $file_name)
    {
        $config = \Config::load($app_name.'::'.$file_name, true);
        $dependencies = \Nos\Config_Data::get('app_dependencies', array());

        if (!empty($dependencies[$app_name])) {
            foreach ($dependencies[$app_name] as $application => $dependency) {
                if ($dependency['extend_configuration']) {
                    $config = \Arr::merge($config, \Config::load($application.'::'.$file_name, true));
                }
            }
        }
        $config = \Arr::recursive_filter(
            $config,
            function($var) {
                return $var !== null;
            }
        );

        return $config;
    }

    public static function getDbName($item)
    {
        $item = str_replace('::', '/config/', $item);
        $item = str_replace('/', '.', $item);

        return $item;
    }

    public static function extendable_load($module_name, $file_name)
    {
        logger(\Fuel::L_WARNING, '\Config::extendable_load is deprecated. Please rename to \Config::loadConfiguration.');
        return static::loadConfiguration($module_name, $file_name);
    }

    public static function metadata($application_name)
    {
        $metadata = \Config::load($application_name.'::metadata', true);

        // More treatment for launchers
        // Small fix relative to permissions
        // We MUST have the key "application" in order to know if a launcher has or has not to be displayed...
        foreach (array('launchers', 'enhancers', 'templates') as $section) {
            if (!isset($metadata[$section])) {
                continue;
            }
            foreach ($metadata[$section] as &$item) {
                $item['i18n_application'] = $application_name;
                if (!isset($item['application'])) {
                    $item['application'] = $application_name;
                }
            }
        }

        return $metadata;
    }

    public static function application($application_name)
    {
        return static::loadConfiguration($application_name, 'config');
    }

    public static function actions($params = array())
    {
        if (!isset($params['models'])) {
            return array();
        }

        if (!isset($params['all_targets'])) {
            $params['all_targets'] = false;
        }

        $selected_actions = array();
        foreach ($params['models'] as $model) {
            $common_config = \Nos\Config_Common::load($model, array());
            $actions = $common_config['actions']['list'];
            $actions_order = $common_config['actions']['order'];

            $params['model'] = $model;

            foreach ($actions_order as $key) {
                if (!isset($actions[$key])) {
                    throw new \Exception('You are trying to order an action which key would be "'.$key.'" but such an action doesn\'t seem to exist.');
                }
                $action = $actions[$key];
                if (static::can_add_action($action, $params)) {
                    $selected_actions[$key] = $action;
                }
                unset($actions[$key]);
            }

            foreach ($actions as $key => $action) {
                if (static::can_add_action($action, $params)) {
                    $selected_actions[$key] = $action;
                }
            }

            foreach ($selected_actions as $key => $action) {
                if (!empty($params['item']) && isset($action['disabled'])) {
                    $selected_actions[$key]['disabled'] = static::getActionDisabledState($action['disabled'], $params['item']);
                }
            }
        }

        return $selected_actions;
    }

    static public function getActionDisabledState($disabled, $item)
    {
        $common_config = \Nos\Config_Common::load(get_class($item), array());
        if (is_callable($disabled)) {
            $disabled = $disabled($item, array('config' => $common_config));
        }
        if (is_array($disabled)) {
            foreach ($disabled as $disabled_item) {
                $disabled_state = static::getActionDisabledState($disabled_item, $item);
                if ($disabled_state !== false) {
                    return $disabled_state;
                }
            }
            return false;
        }
        return $disabled;
    }

    protected static function can_add_action($action, $params)
    {
        if ($params['all_targets']) {
            return true;
        }

        if (isset($action['targets']) && (!isset($action['targets'][$params['target']]) || !$action['targets'][$params['target']])) {
            return false;
        }

        return !isset($action['visible']) || $action['visible']($params);
    }

    /**
     * Replace placeholders recursively in an array
     *
     * @param  array  $array  Array to look placeholders inside
     * @param  mixed  $data   Array or object used to fetch placeholders
     * @param  bool   $remove_unset  Should placeholders not found in data be removed?
     * @return array  A new array with replacement done
     */
    public static function placeholderReplace($array, $data, $remove_unset = true)
    {
        if (is_string($array)) {
            $retrieveFromData = function($placeholder, $fallback) use ($data) {
                if (is_array($data) && isset($data[$placeholder])) {
                    return $data[$placeholder];
                }
                if (is_object($data)) {
                    if (isset($data->{$placeholder})) {
                        return $data->{$placeholder};
                    }
                    try {
                        return $data->{$placeholder}();
                    } catch (\Exception $e) {
                    }
                }
                return $fallback;
            };

            $array = preg_replace_callback('/{{([\w]+)}}/', function($matches) use($retrieveFromData, $remove_unset) {
                return $retrieveFromData($matches[1], $remove_unset ? '' : $matches[0]);
            }, $array);
            $array = preg_replace_callback('/{{urlencode:([\w]+)}}/', function($matches) use($retrieveFromData, $remove_unset) {
                return urlencode($retrieveFromData($matches[1], $remove_unset ? '' : $matches[0]));
            }, $array);
        } else if (is_array($array)) {
            foreach ($array as $key => $value) {
                $new_key = static::placeholderReplace($key, $data, $remove_unset);
                $array[$new_key] = static::placeholderReplace($value, $data, $remove_unset);
                if ($new_key !== $key) {
                    unset($array[$key]);
                }
            }
        }
        return $array;
    }

    public static function icon($application_or_model_name, $icon_key)
    {
        if (strpos($application_or_model_name, '\\') === false) {
            $metadata = \Nos\Config_Data::get('app_installed.'.$application_or_model_name);
        } else {
            $metadata = \Nos\Config_Common::load($application_or_model_name);
        }

        if (!empty($metadata['icons'][$icon_key])) {
            return $metadata['icons'][$icon_key];
        }
        return '';
    }

}

/* End of file config.php */
