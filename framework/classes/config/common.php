<?php
namespace Nos;

class Config_Common
{
    public static function load($model, $filter_data_mapping = array())
    {
        list($application_name, $file) = \Config::configFile($model);
        $file = 'common'.substr($file, strrpos($file, DS));

        $config = \Config::loadConfiguration($application_name, $file);

        $config = static::process_placeholders($model, $config);
        $config = static::process_callable_keys($config);

        $i18n_default = \Config::load('nos::i18n_common', true);
        $config['i18n'] = array_merge($i18n_default, \Arr::get($config, 'i18n', array()));

        if (!isset($config['actions'])) {
            $config['actions'] = array();
        }

        if (!isset($config['actions']['list'])) {
            $config['actions']['list'] = count($config['actions']) == 1 && isset($config['actions']['order']) ? array() : $config['actions'];
        }

        if (!isset($config['actions']['order'])) {
            $config['actions']['order'] = array();
        }

        $model::eventStatic('commonConfig', array(&$config));

        static::process_actions($application_name, $model, $config);

        if (!isset($config['data_mapping'])) {
            $config['data_mapping'] = array();
        }

        $config['data_mapping'] = static::process_data_mapping($config);
        $config['data_mapping'] = static::filter_data_mapping($config['data_mapping'], $filter_data_mapping);
        $config['icons']        = static::process_icons($application_name, $config);
        $config['tab']          = static::process_tab($application_name, $config);

        return $config;
    }

    public static function process_callable_keys($config)
    {
        $common_config = \Config::load('common', true);

        if (!isset($config['callable_keys'])) {
            $config['callable_keys'] = array();
        }

        $config['callable_keys'] = \Arr::merge($config['callable_keys'], $common_config['callable_keys']);

        return $config;
    }

    public static function process_placeholders($model, $config)
    {
        list($application_name, $file) = \Config::configFile($model);

        $model_label = explode('_', $model);
        $model_label = $model_label[count($model_label) - 1];

        if (!isset($config['controller'])) {
            $config['controller'] = strtolower($model_label);
        }

        if (!isset($config['placeholders'])) {
            $config['placeholders'] = array();
        }

        if (!isset($config['placeholders']['controller_base_url'])) {
            $config['placeholders']['controller_base_url'] = 'admin/'.$application_name.'/'.$config['controller'].'/';
        }

        if (!isset($config['placeholders']['model_label'])) {
            $config['placeholders']['model_label'] = $model_label;
        }

        return $config;
    }

    public static function process_icons($application_name, $config)
    {
        $application_icons = \Nos\Config_Data::get('app_installed.'.$application_name.'.icons', array());
        if (!isset($config['icons'])) {
            $config['icons'] = array();
        }

        foreach ($application_icons as $key => $value) {
            if (!isset($config['icons'][$key])) {
                $config['icons'][$key] = $application_icons[$key];
            }
        }

        return $config['icons'];
    }

    public static function process_tab($application_name, $config)
    {
        $application_config = \Nos\Config_Data::get('app_installed.'.$application_name);
        if (!isset($config['tab'])) {
            $config['tab'] = array();
        }

        if (!isset($config['tab']['label'])) {
            $config['tab']['label'] = $application_config['name'];
        }

        return $config['tab'];
    }

    /**
     * Generates default actions and add them into the common configuration.
     * Default actions are: add, edit, visualise and delete.
     *
     * @param  string  $application_name
     * @param  string  $model
     * @param  array   $config
     * @return  array  The default actions
     */
    public static function process_actions($application_name, $model, &$config)
    {
        \Nos\I18n::current_dictionary(array('nos::application', 'nos::common'));

        $common_config = \Config::load('common', true);

        $actions_template = $common_config['actions'];

        \Arr::set(
            $actions_template,
            'delete.action.dialog.title',
            strtr($config['i18n']['deleting item title'], array(
                '{{title}}' => '{{htmlspecialchars:_title}}',
            ))
        );

        $actions_template = static::prefixActions($actions_template, $model);
        $list_actions = static::prefixActions($config['actions']['list'], $model);

        $orders = array();
        $original_orders = $config['actions']['order'];
        foreach ($original_orders as $original_order) {
            $order = $original_order;
            if (strpos($order, '\\') === false) {
                $order = $model.'.'.$original_order;
            }
            $orders[] = $order;
        }

        $config['actions']['order'] = $orders;

        $actions = \Arr::merge($actions_template, $list_actions);

        $actions = \Config::placeholderReplace($actions, $config['placeholders'], false);

        // Copy the action label into the tab or dialog label when necessary
        foreach ($actions as $name => $action) {
            if (isset($action['action']['tab']) && empty($action['action']['tab']['label'])) {
                $actions[$name]['action']['tab']['label'] = $action['label'];
            }
            if (isset($action['action']['dialog']) && empty($action['action']['dialog']['title'])) {
                $actions[$name]['action']['dialog']['title'] = $action['label'];
            }
        }

        foreach ($actions as $key => $action) {
            if ($action === false) {
                unset($actions[$key]);
            } else {
                $actions[$key]['name'] = $key;
            }
        }

        $config['actions']['list'] = $actions;

        return $actions;
    }

    public static function prefixActions($original_list_actions, $model)
    {
        $list_actions = array();
        foreach ($original_list_actions as $original_name => $action) {
            $name = static::prefixActionName($original_name, $model);
            $list_actions[$name] = $original_list_actions[$original_name];
        }
        return $list_actions;
    }

    public static function prefixActionName($action_name, $model)
    {
        if (strpos($action_name, '\\') === false) {
            return $model.'.'.$action_name;
        }
        return $action_name;
    }

    /**
     * Transforms a "simplified" data_mappping from a config array into a data_mapping usable by the wijgrid.
     *
     * @param   string  $class
     * @param   array   $config
     * @return  array   The modified data_mapping
     */
    public static function process_data_mapping($config)
    {
        if (!isset($config['data_mapping'])) {
            return array();
        }
        $data_mapping = array();
        foreach ($config['data_mapping'] as $key => $data) {
            if (is_string($data)) {
                $key = is_int($key) ? $data : $key;
                $data = array();
            }
            if ($key === 'context') {
                $data_mapping[$key] = $data;
            }
            if (is_array($data)) {
                // @todo two keys to process : appdesk and fieldset
                if (!isset($data['headerText']) && isset($data['title'])) {
                    $data['headerText'] = $data['title'];
                    unset($data['title']);
                }
                if (!isset($data['column']) && !isset($data['value'])) {
                    $data['column'] = str_replace('->', '.', $key);
                }
                if (!isset($data['search_column']) && isset($data['column'])) {
                    $data['search_column'] = $data['column'];
                }
                $relations = explode('->', $key);
                if (!isset($data['search_relation']) && count($relations) > 1) {
                    // @todo: support multilevel relations ?
                    $data['search_relation'] = $relations[0];
                }
                if (!isset($data['cellFormatters'])) {
                    $data['cellFormatters'] = array();
                }
                $data_mapping[$key] = $data;
            }
        }

        return $data_mapping;
    }

    /**
     * Filter a data_mapping to keep only keys / columns defined by the $filter argument
     * Used by inspectors to hide most columns.
     *
     * @param  array  $initial_data_mapping  Data mapping from the config file
     * @param  array  $filter                Keys to be filtered (can be column a name)
     * @return array  A new data mapping containing only they keys to be filtered.
     */
    protected static function filter_data_mapping($initial_data_mapping, $filter)
    {
        if ($filter != null) {
            $filter = static::process_data_mapping(array('data_mapping' => $filter));
            $data_mapping = array();
            foreach ($filter as $key => $value) {
                $data_mapping_key = null;
                $data_mapping_extend = null;
                if (is_array($value)) {
                    $data_mapping_key = $key;
                    $data_mapping_extend = $value;
                } else {
                    $data_mapping_key = $value;
                }

                if (!is_array($initial_data_mapping[$data_mapping_key])) {
                    $data_mapping[$data_mapping_key] = $data_mapping_extend === null ?
                        $initial_data_mapping[$data_mapping_key] : $data_mapping_extend;
                } else {
                    if ($data_mapping_extend === null) {
                        $data_mapping_extend = array();
                    }
                    $data_mapping[$data_mapping_key] = \Arr::merge(
                        $initial_data_mapping[$data_mapping_key],
                        $data_mapping_extend
                    );
                }
            }
            return $data_mapping;
        } else {
            return $initial_data_mapping;
        }
    }

    /**
     * @param   $action  string      Name of an action from the common config
     * @param   $item    \Orm\Model  Model instance
     * @return  bool|string          false when enabled, true or a string when disabled (when it's a string, it's the reason why it's disabled)
     */
    public static function checkActionDisabled($action, $item, $params = array())
    {
        $model = get_class($item);
        $action_name = \Nos\Config_Common::prefixActionName($action, $model);
        $actions = \Config::actions(array(
            'models' => array($model),
            'item' => $item,
            'all_targets' => true,
        ) + $params);
        return \Arr::get($actions[$action_name], 'disabled', false);
    }
}
