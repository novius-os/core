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
        $originFileName = $file;
        $file = static::convertFileName($file, 'load');
        if ($originFileName == 'db') {
            $group = 'db';
        }
        if (!$reload and is_array($file) and is_string($group)) {
            Event::trigger_function('config|'.$group, array(&$file));
        }

        return parent::load($file, $group, $reload, $overwrite);
    }

    public static function get($item, $default = null)
    {
        $item = static::convertFileName($item, 'get');
        //print_r($item."\n");
        //print_r(parent::get($item, $default));
        return parent::get($item, $default);
    }

    public static function save($file, $config)
    {
        $file = static::convertFileName($file, 'save');

        return parent::save($file, $config);
    }

    public static function convertFileName($file, $from = 'load')
    {
        if (is_string($file) && mb_strpos($file, '::') !== false && mb_substr($file, 0, 4) == 'nos_') {
            list($application, $configuration_path) = explode('::', $file);
            $file = 'nos::admin/'.$application.'/'.$configuration_path;
        }

        return $file;
    }

    public static function getFromUser($item, $default = null)
    {
        return static::mergeWithUser($item, static::get($item, $default));
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
            \Config::load(APPPATH.'metadata/app_namespaces.php', 'data::app_namespaces');
            $namespaces = Config::get('data::app_namespaces', null);
            if ($app = array_search($namespace, $namespaces)) {
                $application = $app;
            }
        }

        return array($application, $file);
    }

    public static function loadConfiguration($app_name, $file_name)
    {
        \Config::load($app_name.'::'.$file_name, true);
        $config = \Config::get($app_name.'::'.$file_name);
        \Config::load(APPPATH.'metadata'.DS.'app_dependencies.php', 'data::app_dependencies');
        $dependencies = \Config::get('data::app_dependencies', array());

        if (!empty($dependencies[$app_name])) {
            foreach ($dependencies[$app_name] as $dependency) {
                \Config::load($dependency.'::'.$file_name, true);
                $config = \Arr::merge($config, \Config::get($dependency.'::'.$file_name));
            }
        }
        $config = \Arr::recursive_filter($config, function($var) { return $var !== null; });

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
        \Config::load($module_name.'::'.$file_name, true);
        $config = \Config::get($module_name.'::'.$file_name);
        \Config::load(APPPATH.'metadata'.DS.'app_dependencies.php', 'data::app_dependencies');
        $dependencies = \Config::get('data::app_dependencies', array());

        if (!empty($dependencies[$module_name])) {
            foreach ($dependencies[$module_name] as $dependency) {
                \Config::load($dependency.'::'.$file_name, true);
                $config = \Arr::merge($config, \Config::get($dependency.'::'.$file_name, array()));
            }
        }
        $config = \Arr::recursive_filter($config, function($var) { return $var !== null; });

        return $config;
    }

    public static function application($application_name)
    {
        return static::extendable_load($application_name, 'config');
    }

    public static function actions($application_name, $filter = array())
    {
        $actions = static::application($application_name);
        $actions = static::process_actions($application_name, $actions['application']['actions']);
        $selected_actions = array();
        foreach ($actions as $key => $action) {
            $select = true;
            if (isset($filter['model'])) {
                $select = false;
                $models = explode('.', $key);
                for ($i = 0; $i < count($models) - 1; $i++) {
                    if ($filter['model'] == $models[$i]) {
                        $select = true;
                        break;
                    }
                }
            }

            if ($select && isset($filter['type'])) {
                $select = $action['type'] == $filter['type'];
            }

            if ($select) {
                $selected_actions[$key] = $action;
            }
        }

        return $selected_actions;
    }

    public static function process_actions($application_name, $actions) {
        $urls = array(
            'add' => 'action.tab.url',
            'edit' => 'action.tab.url',
            'delete' => 'action.dialog.contentUrl',
        );

        $actions_template = array(
            'add' => array(
                'label' => __('Add :model_label'),
                'action' => array(
                    'action' => 'nosTabs',
                    'method' => 'add',
                    'tab' => array(
                        'url' => 'insert_update?lang={{lang}}',
                        'label' => __('Add a new monkey'),
                    ),
                ),

                'type' => 'add'
            ),
            'edit' => array(
                'action' => array(
                    'action' => 'nosTabs',
                    'tab' => array(
                        'url' => "insert_update/{{id}}",
                        'label' => __('Edit'),
                    ),
                ),
                'label' => __('Edit'),
                'primary' => true,
                'icon' => 'pencil',
                'type' => 'item'
            ),
            'delete' => array(
                'action' => array(
                    'action' => 'confirmationDialog',
                    'dialog' => array(
                        'contentUrl' => 'delete/{{id}}',
                        'title' => __('Delete'),
                    ),
                ),
                'label' => __('Delete'),
                'primary' => true,
                'icon' => 'trash',
                'type' => 'item'
            ),
            'visualise' => array(
                'label' => 'Visualise',
                'primary' => true,
                'iconClasses' => 'nos-icon16 nos-icon16-eye',
                'action' => array(
                    'action' => 'window.open',
                    'url' => '{{url}}?_preview=1'
                ),
                'enabled' =>  function($item, $context = array()) {
                    $url = $item->url_canonical(array('preview' => true));

                    return !empty($url);
                },
                'type' => 'item'
            ),
        );



        if (isset($actions['crud'])) {
            foreach ($actions['crud'] as $model => $config) {
                if (!is_array($config)) {
                    $model = $config;
                    $config = array();
                }
                $model_label = explode('/', $model);
                $model_label = $model_label[count($model_label) - 1];
                $model_label = explode('_', $model_label);
                $model_label = $model_label[count($model_label) - 1];

                if (!isset($config['controller'])) {
                    $config['controller'] = strtolower($model_label);
                }

                if (!isset($config['labels'])) {
                    $config['labels'] = array();
                }

                foreach ($actions_template as $name => $template) {
                    if (!isset($actions[$model.'.'.$name])) {
                        $actions[$model.'.'.$name] = $template;

                        if (isset($urls[$name])) {
                            \Arr::set($actions[$model.'.'.$name], $urls[$name], 'admin/'.$application_name.'/'.$config['controller'].'/'.\Arr::get($actions[$model.'.'.$name], $urls[$name]));
                        }

                        if (isset($config['labels'][$name])) {
                            $actions[$model.'.'.$name]['label'] = $config['labels'][$name];
                        }
                        $actions[$model.'.'.$name]['label'] = Str::tr($actions[$model.'.'.$name]['label'], array('model_label' => $model_label));
                    }
                }
            }
        }

        unset($actions['crud']);


        return $actions;
    }

}

/* End of file config.php */
