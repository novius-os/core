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

use Asset, Format, Input, Session, View, Uri;

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
    public function before()
    {
        parent::before();
        $this->load_config();
    }

    public function load_config() {
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

        $locales = \Config::get('locales', array());

        $view->set('appdesk', \Format::forge(array_merge(array('locales' => $locales), $this->config))->to_json(), false);

        return $view;
    }

    public static function process_config($application, $config) {
        if (isset($config['model'])) {
            $appdesk_path = static::get_path();
            $inspectors_class_prefix = get_called_class();
            $inspectors_class_prefix = explode('_', $inspectors_class_prefix);
            $inspectors_class_prefix[count($inspectors_class_prefix) - 1] = 'Inspector';
            $inspectors_class_prefix = implode('_', $inspectors_class_prefix).'_';

            $application_config = \Config::application($application);

            $admin_config = $config['model']::admin_config();

            if (!isset($config['query'])) {
                $config['query'] = $admin_config['query'];
            }

            if (!isset($config['search_text'])) {
                $config['search_text'] = $admin_config['search_text'];
            }

            if (!isset($config['dataset'])) {
                $config['dataset'] = $admin_config['dataset'];
                $config['dataset']['id'] = array(
                    'column' => 'id',
                    'visible' => false
                );

                $config['dataset']['actions'] = array();
                $item_actions = \Config::actions($application, array('model' => $config['model'], 'type' => 'list'));
                foreach ($item_actions as $action_key => $action_value) {
                    if (isset($action_value['enabled'])) {
                        $config['dataset']['actions'][$action_key] = $action_value['enabled'];
                    }
                }
            }

            if (!isset($config['selectedView'])) {
                $config['selectedView'] = isset($admin_config['selectedView']) ? $admin_config['selectedView'] : 'default';
            }

            if (!isset($config['views'])) {
                $config['views'] = isset($admin_config['views']) ? $admin_config['views'] : array(
                    'default' => array(
                        'name' => __('Default view'),
                    )
                );
            }

            if (!isset($config['inspectors'])) {
                $config['inspectors'] = array();
            }

            $inspectors = array();
            foreach ($config['inspectors'] as $key => $value) {
                if (is_array($value)) {
                    // @todo: extended inspectors
                } else {
                    $inspector_name = $inspectors_class_prefix.ucfirst($value);
                    list($application, $file_name) = \Config::configFile($inspector_name);
                    $inspector_config = \Config::loadConfiguration($application, $file_name);
                    $inspector_config = $inspector_name::process_config($application, $inspector_config);
                    $inspectors[$value] = $inspector_config;
                }
            }
            $config['inspectors'] = $inspectors;

            if (!isset($config['inputs'])) {
                $config['inputs'] = array();
            }

            foreach ($config['inspectors'] as $key => $inspector_config) {
                if ($inspector_config['input'] && !isset($config['inputs'][$inspector_config['input']['key']])) {
                    $config['inputs'][$inspector_config['input']['key']] = $inspector_config['input']['query'];
                }
            }

            if (!isset($config['appdesk'])) {
                $config['appdesk'] = array();
            }

            if (!isset($config['appdesk']['tab'])) {
                $config['appdesk']['tab'] = array(
                    'label' => $application_config['application']['name'],
                    'iconUrl' => $application_config['application']['icons']['medium'],
                );
            }

            if (!isset($config['appdesk']['reloadEvent'])) {
                $config['appdesk']['reloadEvent'] = isset($admin_config['reloadEvent']) ? $admin_config['reloadEvent'] : $config['model'];
            }

            if (!isset($config['appdesk']['actions'])) {
                $config['appdesk']['actions'] = \Config::actions($application, array('model' => $config['model'], 'type' => 'list'));
            }

            if (!isset($config['appdesk']['appdesk'])) {
                $config['appdesk']['appdesk'] = array();
            }

            if (!isset($config['appdesk']['appdesk']['buttons'])) {
                $config['appdesk']['appdesk']['buttons'] = \Config::actions($application, array('type' => 'appdeskTop'));
            }

            if (!isset($config['appdesk']['appdesk']['splittersVertical'])) {
                if (isset($config['splittersVertical'])) {
                    $config['appdesk']['appdesk']['splittersVertical'] = $config['splittersVertical'];
                } else {
                    $config['appdesk']['appdesk']['splittersVertical'] = 250; //@todo could it be done via javascript
                }
            }

            if (!isset($config['appdesk']['appdesk']['inspectors'])) {
                $config['appdesk']['appdesk']['inspectors'] = $config['inspectors'];
            }

            $new_inspectors = array();
            foreach ($config['appdesk']['appdesk']['inspectors'] as $key => $inspector_config) {
                $new_inspectors[$key] = $inspector_config['appdesk'];
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
                    if ($key == 'lang') {
                        $config['appdesk']['appdesk']['grid']['columns'][$key] = array('lang' => true);
                    } else if ($key == 'published') {
                        $config['appdesk']['appdesk']['grid']['columns']['published'] = array(
                            'headerText' => __('Status'),
                            'dataKey' => 'publication_status'
                        );
                    } else if (!isset($value['visible']) || $value['visible']) {
                        $config['appdesk']['appdesk']['grid']['columns'][$key]['headerText'] = isset($value['headerText']) ? $value['headerText'] : '';
                        $config['appdesk']['appdesk']['grid']['columns'][$key]['dataKey'] = $key;
                    }

                }

                $config['appdesk']['appdesk']['grid']['columns']['actions'] = array('actions' => array());
                foreach ($config['appdesk']['actions'] as $action_key => $action_value) {
                    $config['appdesk']['appdesk']['grid']['columns']['actions']['actions'][] = $action_key;
                }
            }
        }

        return $config;
    }

    public function action_json()
    {
        $config = $this->config;
        $where = function($query) use ($config) {
            foreach (\Arr::get($config, 'inputs', array()) as $input => $condition) {
                $value = Input::get('inspectors.'.$input);
                if (is_callable($condition)) {
                    $query = $condition($value, $query);
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
                $query->and_where_close();
            }

            Filter::apply($query, $config);

            return $query;
        };

        $return = $this->items(array_merge($this->config['query'], array(
            'callback' => array_merge(\Arr::get($this->config['query'], 'callback', array()), array($where)),
            'dataset' => $this->config['dataset'],
            'lang' => Input::get('lang', null),
            'limit' => intval(Input::get('limit', \Arr::get($this->config['query'], 'limit'))),
            'offset' => intval(Input::get('offset', 0)),
        )));

        $json = array(
            'get' => '',
            'query' =>  '',
            'query2' =>  '',
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
        $tree_config['id'] =  $this->config['configuration_id'];

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
