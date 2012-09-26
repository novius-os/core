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

class Controller_Inspector_Model extends Controller_Inspector
{
    protected $config = array(
        'model' => '',
        'limit' => 20,
        'order_by' => null,
    );

    public function action_list()
    {
        $view = View::forge('inspector/model');

        return $view;
    }

    public function action_json()
    {
        $config = $this->config;
        $where = function($query) use ($config) {
            Filter::apply($query, $config);

            return $query;
        };

        $return = $this->items(array_merge($this->config['query'], array(
            'callback' => array($where),
            'dataset' => $this->config['dataset'],
            'lang' => Input::get('lang', null),
            'limit' => intval(Input::get('limit', $this->config['limit'])),
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

    public static function process_config($application, $config, $item_actions = array(), $gridKey = 'grid') {
        if (isset($config['model'])) {
            $admin_config = $config['model']::admin_config();

            if (!isset($config['query'])) {
                $config['query'] = $admin_config['query'];
            }

            if (!isset($config['dataset'])) {
                $config['dataset']  = $admin_config['dataset'];
            }
            $config['dataset']['id']       = array(
                'column' => 'id',
                'visible' => false
            );

            $item_actions = \Config::actions($application, array('model' => $config['model'], 'type' => 'list'));

            if (!isset($config['dataset']['actions'])) {
                $config['dataset']['actions'] = array();
                foreach ($item_actions as $action_key => $action_value) {
                    if (isset($action_value['enabled'])) {
                        $config['dataset']['actions'][$action_key] = $action_value['enabled'];
                    }
                }
            }

            if (!isset($config['input']['query'])) {
                $input_key = $config['input']['key'];
                $config['input']['query'] = function($value, $query) use ($input_key) {
                    if (is_array($value) && count($value) && $value[0]) {
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
