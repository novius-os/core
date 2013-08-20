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

use Format, Input, View;

/**
 * The cloud Controller.
 *
 * A basic controller example.  Has examples of how to set the
 * response body and status.
 *
 * @package  app
 * @extends  Controller
 */
class Controller_Admin_Appdesk extends Controller_Admin_Application
{
    protected $dictionary = null;

    public function before()
    {
        parent::before();
        $this->load_config();
    }

    public function load_config()
    {
        list($application, $file_name) = \Config::configFile(get_called_class());
        $this->config = \Config::mergeWithUser($application.'::'.$file_name, static::process_config($application, $this->config));

        return $this->config;
    }

    public function action_index($view = null)
    {
        if (empty($view)) {
            $view = \Input::get('view', $this->config['selectedView']);
        }
        $this->config['selectedView'] = $view;

        if (empty($this->config['custom'])) {
            $this->config['custom'] = array(
                'from' => 'default',
            );
        }

        $view = View::forge('admin/appdesk');

        $contexts = \Nos\User\Permission::contexts();
        $locales = \Nos\User\Permission::locales();
        $sites = \Nos\User\Permission::sites();

        foreach ($contexts as $context => $params) {
            $site = Tools_Context::siteCode($context);
            $locale = Tools_Context::localeCode($context);

            if (!isset($sites[$site]['locales'])) {
                $sites[$site]['locales'] = array();
            }
            $sites[$site]['locales'][] = $locale;

            if (!isset($locales[$locale]['sites'])) {
                $locales[$locale]['sites'] = array();
            }
            $locales[$locale]['sites'][] = $site;
        }

        $params = array_merge(
            array(
                'contexts' => $contexts,
                'locales' => $locales,
                'sites' => $sites,
            ),
            array_diff_key($this->config, array('dataset' => '', 'inputs' => '', 'query' => ''))
        );

        $view->set('appdesk', \Format::forge($params)->to_json(), false);

        list($application) = \Config::configFile(get_called_class());
        $view->set('application', $application);

        $view->set('model', isset($this->config['model']) ? $this->config['model'] : null);

        $view->set('css', isset($this->config['css']) ? $this->config['css'] : null);

        $view->set('notify', isset($this->config['notify']) ? $this->config['notify'] : null);

        return $view;
    }

    public static function process_config($application, $config)
    {
        $valid_keys = array('model', 'css', 'notify', 'query', 'search_text', 'dataset', 'selectedView', 'views', 'appdesk', 'tree', 'configuration_id', 'inputs', 'hideContexts', 'i18n', 'custom');
        if (isset($config['model'])) {
            $config['model'] = ltrim($config['model'], '\\');
            $namespace_model = \Inflector::get_namespace($config['model']);

            $appdesk_path = static::get_path();
            $inspectors_class_prefix = explode('_', get_called_class());
            $inspectors_class_prefix[count($inspectors_class_prefix) - 1] = 'Inspector';
            $inspectors_class_prefix = implode('_', $inspectors_class_prefix).'_';

            $application_config = \Nos\Config_Data::get('app_installed.'.$application);

            $behaviours = array(
                'contextable' => $config['model']::behaviours('Nos\Orm_Behaviour_Contextable', false),
                'twinnable' => $config['model']::behaviours('Nos\Orm_Behaviour_Twinnable', false),
                'sharable' => $config['model']::behaviours('Nos\Orm_Behaviour_Sharable', false),
                'tree' => $config['model']::behaviours('Nos\Orm_Behaviour_Tree', false),
                'url' => $config['model']::behaviours('Nos\Orm_Behaviour_Urlenhancer', false),
                'sortable' => $config['model']::behaviours('Nos\Orm_Behaviour_Sortable', false),
            );

            if (!isset($config['data_mapping'])) {
                $config['data_mapping'] = null;
            }

            $common_config = \Nos\Config_Common::load($config['model'], $config['data_mapping']);
            $data_mapping = isset($common_config['data_mapping']) ? $common_config['data_mapping'] : array();

            if (!isset($config['query'])) {
                $config['query'] = isset($common_config['query']) ? $common_config['query'] : array();
            }

            if (!isset($config['query']['model'])) {
                $config['query']['model'] = $config['model'];
            }

            if (!isset($config['search_text'])) {
                $config['search_text'] = isset($common_config['search_text']) ? $common_config['search_text'] : array();
            }

            if (!isset($config['dataset'])) {
                $config['dataset'] = $data_mapping;
            }
            $config['dataset']['id'] = array(
                'column' => 'id',
                'visible' => false
            );

            if (!isset($config['dataset']['actions'])) {
                $item_actions = \Config::actions(array('models' => array($config['model']), 'target' => 'grid', 'class' => get_called_class()));
                foreach ($item_actions as $action_key => $action_value) {
                    if (isset($action_value['disabled'])) {
                        $config['dataset']['actions'][$action_key] = $action_value['disabled'];
                    }
                }
            }


            if (!isset($config['selectedView'])) {
                $config['selectedView'] = isset($common_config['selectedView']) ? $common_config['selectedView'] : 'default';
            }

            if (!isset($config['views'])) {
                $config['views'] = isset($common_config['views']) ? $common_config['views'] : array(
                    'default' => array(
                        'name' => __('Default view'),
                    )
                );
            }

            if (!isset($config['inspectors'])) {
                $config['inspectors'] = array();
            }

            if (!isset($config['toolbar'])) {
                $config['toolbar'] = array();
            }

            $wasToolbarModelsSet = isset($config['toolbar']['models']);
            if (!isset($config['toolbar']['models'])) {
                $config['toolbar']['models'] = array($config['model']);
            }

            if (!isset($config['toolbar']['actions'])) {
                $config['toolbar']['actions'] = array();
            }

            if (!isset($config['tree'])) {
                if ($behaviours['tree']) {
                    $config['tree'] = array();
                }
            }

            if (isset($config['tree']) && $config['tree'] !== false) {

                if (!isset($config['tree']['models'])) {
                    $config['tree']['models'] = array();
                }

                if (count($config['tree']['models']) == 0) {
                    $config['tree']['models'][] = array();
                }

                foreach ($config['tree']['models'] as &$model) {
                    if (!isset($model['model'])) {
                        $model['model'] = $config['model'];
                    }

                    $sortable_behaviour = $model['model']::behaviours('Nos\Orm_Behaviour_Sortable', false);
                    if (!isset($model['order_by']) && $sortable_behaviour) {
                        $model['order_by'] = $sortable_behaviour['sort_property'];
                    }

                    if (!isset($model['childs'])) {
                        $model['childs'] = array($model['model']);
                    }

                    if (!isset($model['dataset'])) {
                        $model['dataset'] = $config['dataset'];
                    }
                }


                if (!isset($config['tree']['roots'])) {
                    $config['tree']['roots'] = array();
                }

                if (count($config['tree']['roots']) == 0) {
                    $config['tree']['roots'][] = array();
                }

                foreach ($config['tree']['roots'] as &$root) {
                    if (!isset($root['model'])) {
                        $root['model'] = $config['model'];
                    }

                    if (!isset($root['where'])) {
                        $tree_behaviour = $root['model']::behaviours('Nos\Orm_Behaviour_Tree', false);
                        $relation = $root['model']::relations($tree_behaviour['parent_relation']);
                        $root['where'] = array(array($relation->key_from[0], 'IS', \DB::expr('NULL')));
                    }

                    $sortable_behaviour = $root['model']::behaviours('Nos\Orm_Behaviour_Sortable', false);
                    if (!isset($root['order_by']) && $sortable_behaviour) {
                        $root['order_by'] = $sortable_behaviour['sort_property'];
                    }
                }
            }

            $models = array($config['model']);
            $inspectors = array();
            foreach ($config['inspectors'] as $key => $value) {
                $inspector_key = is_array($value) ? $key : $value;
                $inspector_name = $inspectors_class_prefix.ucfirst($inspector_key);
                if (strpos($inspector_key, '\\') !== false) {
                    $inspector_name = $inspector_key;
                }
                if (!class_exists($inspector_name) && is_array($value)) {
                    $inspectors[$inspector_key] = $value;
                    continue;
                }
                list($application, $file_name) = \Config::configFile($inspector_name);
                $inspector_config = \Config::loadConfiguration($application, $file_name);
                if (is_array($value)) {
                    $inspector_config = \Arr::merge($inspector_config, $value);
                }
                $inspector_config = $inspector_name::process_config($application, $inspector_config);
                $inspectors[$inspector_key] = $inspector_config;
                if (isset($inspector_config['model']) && !$wasToolbarModelsSet) {
                    $inspector_model_namespace = \Inflector::get_namespace($inspector_config['model']);
                    $models[] = $inspector_config['model'];
                    if ($inspector_model_namespace == $namespace_model) {
                        $config['toolbar']['models'][] = $inspector_config['model'];
                    }
                }
            }

            $has_context = false;
            for ($i = 0; $i < count($models); $i++) {
                if ($models[$i]::behaviours('Nos\Orm_Behaviour_Contextable', false) || $models[$i]::behaviours('Nos\Orm_Behaviour_Twinnable', false)) {
                    $has_context = true;
                }
            }
            if (!$has_context) {
                $config['hideContexts'] = true;
            }

            $config['inspectors'] = $inspectors;

            if (!isset($config['inputs'])) {
                $config['inputs'] = array();
            }

            foreach ($config['inspectors'] as $inspector_config) {
                if (isset($inspector_config['input']) && !isset($config['inputs'][$inspector_config['input']['key']])) {
                    $config['inputs'][$inspector_config['input']['key']] = $inspector_config['input']['query'];
                }
            }

            if (!isset($config['appdesk'])) {
                $config['appdesk'] = array();
            }

            if (!isset($config['appdesk']['tab'])) {
                $config['appdesk']['tab'] = array();
            }

            if (!isset($config['appdesk']['tab']['label'])) {
                $config['appdesk']['tab']['label'] = isset($common_config['tab']['label']) ? $common_config['tab']['label'] : $application_config['name'];
            }

            if (!isset($config['appdesk']['tab']['iconUrl'])) {
                $config['appdesk']['tab']['iconUrl'] = \Config::icon($config['model'], 32);
            }

            if (!isset($config['appdesk']['tab']['iconSize'])) {
                $config['appdesk']['tab']['iconSize'] = '32';
            }

            if (!isset($config['appdesk']['tab']['labelDisplay'])) {
                $config['appdesk']['tab']['labelDisplay'] = false;
            }

            if (!isset($config['appdesk']['reloadEvent'])) {
                $config['appdesk']['reloadEvent'] = isset($common_config['reloadEvent']) ? $common_config['reloadEvent'] : $config['model'];
            }

            if (!isset($config['appdesk']['actions'])) {
                $config['appdesk']['actions'] = \Config::actions(array('models' => array($config['model']), 'target' => 'grid', 'class' => get_called_class()));
            }

            if (!isset($config['appdesk']['appdesk'])) {
                $config['appdesk']['appdesk'] = array();
            }

            if (isset($config['thumbnails']) && ($config['thumbnails'] === true || is_array($config['thumbnails']))) {
                if (!isset($config['appdesk']['appdesk']['thumbnails'])) {
                    $config['appdesk']['appdesk']['thumbnails'] = $config['thumbnails'] === true ? array() : $config['thumbnails'];
                }

                if (!isset($config['appdesk']['appdesk']['thumbnails']['actions'])) {
                    $config['appdesk']['appdesk']['thumbnails']['actions'] = array();
                    foreach ($config['appdesk']['actions'] as $key => $action) {
                        $config['appdesk']['appdesk']['thumbnails']['actions'][] = $key;
                    }
                }

                if (!isset($config['appdesk']['appdesk']['thumbnails']['thumbnailSize'])) {
                    $config['appdesk']['appdesk']['thumbnails']['thumbnailSize'] = 64;
                }
            }

            if (!isset($config['appdesk']['appdesk']['buttons'])) {
                $config['appdesk']['appdesk']['buttons'] = array();

                $config_toolbar_actions = array();
                foreach ($config['toolbar']['actions'] as $key => $action) {
                    if (\Config::canAddAction($action, array(
                            'all_targets' => false,
                            'target' => 'toolbar-grid',
                            'class' => get_called_class()
                        ))) {
                        $config_toolbar_actions[$key] = $action;
                    }
                }

                $actions = \Arr::merge(
                    \Config::actions(
                        array(
                            'models' => $config['toolbar']['models'],
                            'target' => 'toolbar-grid',
                            'class' => get_called_class()
                        )
                    ),
                    $config_toolbar_actions
                );

                $primary = false;
                foreach ($actions as $key => $action) {
                    if ($action !== false) {
                        if (!empty($action['primary']) && $action['primary']) {
                            $primary = true;
                        }
                        $config['appdesk']['appdesk']['buttons'][$key] = $action;
                    }
                }
                if (!$primary && !empty($config['appdesk']['appdesk']['buttons'][$config['model'].'.add'])) {
                    $config['appdesk']['appdesk']['buttons'][$config['model'].'.add']['primary'] = true;
                }
            }

            if (!isset($config['appdesk']['appdesk']['splittersVertical'])) {
                if (isset($config['splittersVertical'])) {
                    $config['appdesk']['appdesk']['splittersVertical'] = $config['splittersVertical'];
                } else {
                    $config['appdesk']['appdesk']['splittersVertical'] = 250; // @todo could it be done via javascript
                }
            }

            if (!isset($config['appdesk']['appdesk']['inspectors'])) {
                $config['appdesk']['appdesk']['inspectors'] = $config['inspectors'];
            }

            $new_inspectors = array();
            foreach ($config['appdesk']['appdesk']['inspectors'] as $key => $inspector_config) {
                $new_inspectors[$key] = \Arr::get($inspector_config, 'appdesk', $inspector_config);
            }
            $config['appdesk']['appdesk']['inspectors'] = $new_inspectors;


            if (!isset($config['appdesk']['appdesk']['grid'])) {
                $config['appdesk']['appdesk']['grid'] = array();
            }

            if (!isset($config['appdesk']['appdesk']['grid']['urlJson'])) {
                $config['appdesk']['appdesk']['grid']['urlJson'] = $appdesk_path.'/json';
            }

            if (!isset($config['appdesk']['appdesk']['grid']['columns'])) {
                $config['appdesk']['appdesk']['grid']['columns'] = array();
                foreach ($config['dataset'] as $key => $value) {
                    if ($key == 'context') {
                        $config['appdesk']['appdesk']['grid']['columns'][$key] = array('context' => true);
                    } else if (isset($value['headerText'])) {
                        $config['appdesk']['appdesk']['grid']['columns'][$key] = $value;
                        $config['appdesk']['appdesk']['grid']['columns'][$key]['dataKey'] = $key;
                    }
                }
            }
            if ($has_context && !isset($config['appdesk']['appdesk']['grid']['columns']['context'])) {
                $config['appdesk']['appdesk']['grid']['columns']['context'] = array('context' => true);
            }

            if (!isset($config['appdesk']['appdesk']['grid']['columns']['actions']['actions'])) {
                $config['appdesk']['appdesk']['grid']['columns']['actions']['actions'] = array();
                foreach ($config['appdesk']['actions'] as $action_key => $action_value) {
                    $config['appdesk']['appdesk']['grid']['columns']['actions']['actions'][] = $action_key;
                }
            }

            foreach ($config['appdesk']['appdesk']['grid']['columns'] as $key => $column) {
                if (
                    (empty($column['column']) && $key === $config['model']::title_property()) ||
                    (!empty($column['column']) && $column['column'] == $config['model']::title_property())
                ) {
                    if (!is_array($column['cellFormatters']) || !isset($column['cellFormatters']['link'])) {
                        $config['appdesk']['appdesk']['grid']['columns'][$key]['cellFormatters']['link'] = array(
                            'type' => 'link',
                            'action' => 'default',
                        );
                    }
                }
            }

            if (isset($config['tree']) && $config['tree'] !== false) {
                if (!isset($config['appdesk']['appdesk']['treeGrid'])) {
                    $config['appdesk']['appdesk']['treeGrid'] = array();
                }

                if (!isset($config['appdesk']['appdesk']['treeGrid']['urlJson'])) {
                    $config['appdesk']['appdesk']['treeGrid']['urlJson'] = $appdesk_path.'/tree_json';
                }
            }
        }

        $i18n_default = \Config::load('nos::i18n_common', true);
        $config['i18n'] = array_merge($i18n_default, \Arr::get($config, 'i18n', array()));

        foreach ($config as $key => $idc) {
            if (!in_array($key, $valid_keys)) {
                unset($config[$key]);
            }
        }

        return $config;
    }

    public function action_json()
    {
        $config = $this->config;
        $where = function ($query) use ($config) {
            foreach (\Arr::get($config, 'inputs', array()) as $input => $condition) {
                $value = Input::get('inspectors');
                if (isset($value[$input])) {
                    $value = $value[$input];
                    if (is_callable($condition)) {
                        $query = $condition($value, $query);
                    }
                }
            }

            $value = Input::get('inspectors.search');
            $condition = $config['search_text'];
            if (!empty($value)) {
                $query->and_where_open();
                foreach ((array) $condition as $field) {
                    if (is_callable($field)) {
                        $query = $field($value, $query);
                    } else {
                        $query->or_where(array($field, 'LIKE', '%'.$value.'%'));
                    }
                }
                $query->or_where(array(\Db::expr('0'), 1));
                $query->and_where_close();
            }

            Filter::apply($query, $config);

            return $query;
        };

        $return = $this->items(
            array_merge(
                $this->config['query'],
                array(
                    'callback' => array_merge(\Arr::get($this->config['query'], 'callback', array()), array($where)),
                    'dataset' => $this->config['dataset'],
                    'context' => Input::get('context', null),
                    'limit' => intval(Input::get('limit', \Arr::get($this->config['query'], 'limit'))),
                    'offset' => intval(Input::get('offset', 0)),
                )
            )
        );

        $json = array(
            'get' => '',
            'query' => '',
            'query2' => '',
            'offset' => $return['offset'],
            'items' => $return['items'],
            'total' => $return['total'],
        );

        if (\Fuel::$env === \Fuel::DEVELOPMENT) {
            $json['get'] = Input::get();
            $json['query'] = $return['query'];
            $json['query2'] = $return['query2'];
        }
        if (\Input::get('debug') !== null) {
            \Debug::dump($json);
            exit();
        }

        \Response::json($json);
    }

    public function action_tree_json()
    {

        $tree_config = $this->config['tree'];
        $tree_config['id'] = $this->config['configuration_id'];

        $json = $this->tree($tree_config);

        if (\Fuel::$env === \Fuel::DEVELOPMENT) {
            $json['get'] = Input::get();
        }
        if (\Input::get('debug') !== null) {
            \Debug::dump($json);
            exit();
        }

        \Response::json($json);
    }
}

/* End of file list.php */
