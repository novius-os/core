<?php
namespace Nos;

class Config_Common
{
    public static function load($model, $filter_data_mapping)
    {
        list($application_name, $file) = \Config::configFile($model);
        $file = 'common'.substr($file, strrpos($file, '/'));

        $config = \Config::loadConfiguration($application_name, $file);

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

        $config['actions']['list'] = static::process_actions($application_name, $model, $config);

        if (!isset($config['data_mapping'])) {
            $config['data_mapping'] = array();
        }

        $config['data_mapping'] = static::process_data_mapping($model, $config);
        $config['data_mapping'] = static::filter_data_mapping($config['data_mapping'], $filter_data_mapping);

        return $config;
    }

    /**
     * Generates default actions and add them into the common configuration.
     * Default actions are: add, edit, visualise, share and delete.
     *
     * @param  string  $application_name
     * @param  string  $model
     * @param  array   $config
     * @return  array  The default actions
     */
    public static function process_actions($application_name, $model, $config)
    {
        \Nos\I18n::current_dictionary(array('nos::application', 'nos::common'));

        // Which keys contains the URL of the action
        // The controller's base URL will be prepended automatically
        $urls = array(
            'add' => 'action.tab.url',
            'edit' => 'action.tab.url',
            'delete' => 'action.dialog.contentUrl',
        );

        $actions_template = array(
            $model.'.add' => array(
                'label' => __('Add :model_label'),
                'action' => array(
                    'action' => 'nosTabs',
                    'method' => 'add',
                    'tab' => array(
                        'url' => 'insert_update?context={{context}}',
                    ),
                ),
                'targets' => array(
                    'toolbar-grid' => true,
                ),
            ),
            $model.'.edit' => array(
                'action' => array(
                    'action' => 'nosTabs',
                    'tab' => array(
                        'url' => "insert_update/{{_id}}",
                        'label' => __('Edit'),
                    ),
                ),
                'label' => __('Edit'),
                'primary' => true,
                'icon' => 'pencil',
                'targets' => array(
                    'grid' => true,
                ),
            ),
            $model.'.visualise' => array(
                'label' => __('Visualise'),
                'primary' => true,
                'iconClasses' => 'nos-icon16 nos-icon16-eye',
                'action' => array(
                    'action' => 'window.open',
                    'url' => '{{preview_url}}?_preview=1',
                ),
                'disabled' =>
                    function($item)
                    {
                        if ($item::behaviours('Nos\Orm_Behaviour_Urlenhancer', false)) {
                            $url = $item->url_canonical(array('preview' => true));
                            return $item->is_new() || !!empty($url);
                        }
                        return true;
                    },
                'targets' => array(
                    'grid' => true,
                    'toolbar-edit' => true,
                ),
                'visible' =>
                function($params) {
                    if (isset($params['item']) && $params['item']::behaviours('Nos\Orm_Behaviour_Urlenhancer', false)) {
                        $url = $params['item']->url_canonical(array('preview' => true));
                        return !$params['item']->is_new() && !empty($url);
                    }
                    if (isset($params['model']) && $params['model']::behaviours('Nos\Orm_Behaviour_Urlenhancer', false)) {
                        return true;
                    }
                    return false;
                },
            ),
            $model.'.share' => array(
                'label' => __('Share'),
                'iconClasses' => 'nos-icon16 nos-icon16-share',
                'action' => array(
                    'action' => 'share',
                    'data' => array(
                        'model_id' => '{{_id}}',
                        'model_name' => $model,
                    ),
                ),
                'targets' => array(
                    'toolbar-edit' => true,
                ),
                'visible' =>
                function($params) {
                    $model = get_class($params['item']);
                    return !$params['item']->is_new() && $model::behaviours('Nos\Orm_Behaviour_Sharable', false);
                },
            ),
            $model.'.delete' => array(
                'action' => array(
                    'action' => 'confirmationDialog',
                    'dialog' => array(
                        'contentUrl' => 'delete/{{_id}}',
                        'title' => strtr($config['i18n']['delete an item'], array(
                            '{{title}}' => '{{_title}}',
                        )),
                    ),
                ),
                'label' => __('Delete'),
                'primary' => true,
                'icon' => 'trash',
                'red' => true,
                'targets' => array(
                    'grid' => true,
                    'toolbar-edit' => true,
                ),
                'visible' =>
                function($params) {
                    return !isset($params['item']) || !$params['item']->is_new();
                },
            ),
        );

        $model_label = explode('_', $model);
        $model_label = $model_label[count($model_label) - 1];

        if (!isset($config['controller'])) {
            $config['controller'] = strtolower($model_label);
        }

        if ($model::behaviours('Nos\Orm_Behaviour_Urlenhancer', false) === false) {
            unset($actions_template['visualise']);
        }

        foreach ($actions_template as $name => $template) {

            list(, $action_name) = explode('.', $name);

            if (isset($urls[$action_name])) {
                \Arr::set(
                    $actions_template[$name],
                    $urls[$action_name], 'admin/'.$application_name.'/'.$config['controller'].'/'.
                    \Arr::get($actions_template[$name], $urls[$action_name])
                );
            }

            $actions_template[$name]['label'] = \Str::tr(
                $actions_template[$name]['label'],
                array(
                    'model_label' => $model_label,
                )
            );
        }

        $actions = \Arr::merge($actions_template, $config['actions']['list']);

        // Copy the action label into the tab or dialog label when necessary
        foreach ($actions as $name => $action) {
            if (isset($action['action']['tab']) && empty($action['action']['tab']['label'])) {
                $actions[$name]['action']['tab']['label'] = $action['label'];
            }
            if (isset($action['action']['dialog']) && empty($action['action']['dialog']['label'])) {
                $actions[$name]['action']['dialog']['label'] = $action['label'];
            }
        }

        foreach ($actions as $key => $action) {
            if ($action === false) {
                unset($actions[$key]);
            } else {
                $actions[$key]['name'] = $key;
            }
        }

        return $actions;
    }

    /**
     * Transforms a "simplified" data_mappping from a config array into a data_mapping usable by the wijgrid.
     *
     * @param   string  $class
     * @param   array   $config
     * @return  array   The modified data_mapping
     */
    protected static function process_data_mapping($model, $config)
    {
        if (!isset($config['data_mapping'])) {
            return array();
        }
        $data_mapping = array();
        foreach ($config['data_mapping'] as $key => $data) {
            if (is_string($data)) {
                $key = $data;
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
}