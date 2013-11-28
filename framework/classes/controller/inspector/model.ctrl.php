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
    protected static $default_view = 'inspector/model';

    protected $config = array(
        'model' => '',
        'limit' => 20,
        'order_by' => null,
    );

    public function action_json()
    {
        $config = $this->config;
        $where = function ($query) use ($config) {
            Filter::apply($query, $config);

            return $query;
        };

        $callback = array($where);
        if (isset($this->config['query']['callback'])) {
            $custom_callback = $this->config['query']['callback'];
            if (!is_array($custom_callback)) {
                $custom_callback = array($custom_callback);
            }
            $callback = array_merge($callback, $custom_callback);
        }

        $return = $this->items(array_merge($this->config['query'], array(
            'callback' => $callback,
            'dataset' => $this->config['dataset'],
            'context' => Input::get('context', null),
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

    public static function process_config($application, $config, $item_actions = array(), $gridKey = 'grid')
    {
        if (!empty($config['model'])) {
            if (!isset($config['data_mapping'])) {
                $config['data_mapping'] = null;
            }

            $common_config = \Nos\Config_Common::load($config['model'], $config['data_mapping']);
            $data_mapping = isset($common_config['data_mapping']) ? $common_config['data_mapping'] : array(); //@todo: allow customization

            if (!isset($config['query'])) {
                $config['query'] = $common_config['query'];
            }

            if (!isset($config['query']['model'])) {
                $config['query']['model'] = $config['model'];
            }

            if (!isset($config['dataset'])) {
                $config['dataset']  = $data_mapping;
            }
            $config['dataset']['id']       = array(
                'column' => 'id',
                'visible' => false
            );

            $item_actions = \Config::actions(array('models' => array($config['model']), 'target' => 'grid', 'inspector' => 'model', 'class' => get_called_class()));

            if (!isset($config['dataset']['actions'])) {
                $config['dataset']['actions'] = array();
                foreach ($item_actions as $action_key => $action_value) {
                    if (isset($action_value['disabled'])) {
                        $config['dataset']['actions'][$action_key] = $action_value['disabled'];
                    }
                }
            }

            $config = static::_configInputQuery($config);
        }

        return parent::process_config($application, $config, $item_actions, $gridKey);
    }
}
