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

use \Input;
use \View;
use \Config;

class Controller_Inspector_Modeltree extends Controller_Inspector
{
    protected static $default_view = 'inspector/modeltree';

    protected $config = array();

    public function action_list($view = null, $view_data = array())
    {
        if (empty($view)) {
            $view = 'inspector/modeltree';
        }
        $view = View::forge(str_replace('\\', '/', $view));
        foreach ($view_data as $k => $v) {
            $view->set($k, $v, false);
        }

        return $view;
    }

    public function action_json()
    {
        $json = $this->tree($this->config);

        if (\Fuel::$env === \Fuel::DEVELOPMENT) {
            $json['get'] = Input::get();
        }
        if (\Input::get('debug') !== null) {
            \Debug::dump($json);
            exit();
        }

        \Response::json($json);
    }

    public static function process_config($application, $config, $item_actions = array(), $gridKey = 'treeGrid')
    {
        if (!empty($config['model'])) {
            if (!isset($config['data_mapping'])) {
                $config['data_mapping'] = null;
            }

            $common_config = \Nos\Config_Common::load($config['model'], $config['data_mapping']);
            $data_mapping = isset($common_config['data_mapping']) ? $common_config['data_mapping'] : array();

            if (!isset($config['dataset'])) {
                $config['dataset']  = $data_mapping;
            }
            $config['dataset']['id']       = array(
                'column' => 'id',
                'visible' => false
            );

            $item_actions = \Config::actions(array('models' => array($config['model']), 'target' => 'grid', 'inspector' => 'modeltree', 'class' => get_called_class()));

            if (!isset($config['dataset']['actions'])) {
                $config['dataset']['actions'] = array();
                foreach ($item_actions as $action_key => $action_value) {
                    if (isset($action_value['disabled'])) {
                        $config['dataset']['actions'][$action_key] = $action_value['disabled'];
                    }
                }
            }

            if (!isset($config['order_by']) && !!$config['model']::behaviours('Nos\Orm_Behaviour_Sortable', false)) {
                $sortable_behaviours = $config['model']::behaviours('Nos\Orm_Behaviour_Sortable', false);
                $config['order_by'] = $sortable_behaviours['sort_property'];
            }

            if (!isset($config['models'])) {
                $config['models'] = array(array());
            }

            if (!isset($config['models'][0]['model'])) {
                $config['models'][0]['model'] = $config['model'];
            }

            if (!isset($config['models'][0]['order_by']) && isset($config['order_by'])) {
                $config['models'][0]['order_by'] = $config['order_by'];
            }

            if (!isset($config['models'][0]['childs'])) {
                $config['models'][0]['childs'] = array($config['model']);
            }

            if (!isset($config['models'][0]['dataset'])) {
                $config['models'][0]['dataset'] = $config['dataset'];
            }

            if (!isset($config['roots'])) {
                $config['roots'] = array(array());
            }

            if (!isset($config['roots'][0]['model'])) {
                $config['roots'][0]['model'] = $config['model'];
            }

            if (!isset($config['roots'][0]['where'])) {
                $config['roots'][0]['where'] = array(array($config['model']::prefix().'parent_id', 'IS', \DB::expr('NULL')));
            }

            if (!isset($config['roots'][0]['order_by']) && isset($config['order_by'])) {
                $config['roots'][0]['order_by'] = $config['order_by'];
            }

            if (!isset($config['input']['query'])) {
                $input_key = $config['input']['key'];
                $config['input']['query'] = function($value, $query) use ($input_key) {
                    //\Debug::dump(isset($_REQUEST['inspectors'][$input_key]) ? $_REQUEST['inspectors'][$input_key] : false, $input_key, $value);
                    if (is_array($value) && count($value) && $value[0]) {
                        //\Debug::dump('here');
                        $table = explode('.', $input_key);
                        if (count($table) == 1) {
                            $query->where(array($input_key, 'in', $value));
                        } else {
                            $query->related(
                                $table[0],
                                array(
                                    'where' => array(
                                        array($input_key, 'in', $value),
                                    ),
                                )
                            );
                        }
                    }

                    return $query;
                };
            }
        }
        return parent::process_config($application, $config, $item_actions, $gridKey);
    }
}
