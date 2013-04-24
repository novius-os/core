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

use Event;

class Controller extends \Fuel\Core\Controller_Hybrid
{
    protected $config = array();
    protected $app_config = array();
    protected static $current_application = null;

    /**
     * @var string page template
     */
    public $template = null;
    public $format = 'json';

    public function before()
    {
        if (!empty($this->template) and is_string($this->template)) {
            // Load the template
            $this->template = \View::forge($this->template);
        }

        if (is_null($this->format) or !array_key_exists($this->format, $this->_supported_formats)) {
            // auto-detect the format
            $this->format = array_key_exists(\Input::extension(), $this->_supported_formats) ? \Input::extension() : 'json';
        }

        list(static::$current_application) = \Config::configFile(get_called_class());

        $this->config = \Arr::merge($this->config, $this->getConfiguration());
        $this->app_config = \Arr::merge($this->app_config, static::getGlobalConfiguration());
        \View::set_global(static::$current_application.'_config', $this->app_config);
        $this->trigger('before', $this, 'boolean');

        parent::before();
    }

    public function after($response)
    {
        if (isset($this->config['assets'])) {
            if (isset($this->config['assets']['paths'])) {
                foreach ($this->config['assets']['paths'] as $path) {
                    \Asset::add_path($path);
                }
            }

            if (isset($this->config['assets']['css'])) {
                foreach ($this->config['assets']['css'] as $css) {

                    \Asset::css($css, array(), 'css');
                }
            }
            if (isset($this->config['assets']['js'])) {
                foreach ($this->config['assets']['js'] as $js) {
                    \Asset::js($js, array(), 'js');
                }
            }
        }
        /*
        // If nothing was returned default to the template
        if (empty($response)) {
            $response = $this->template;
        }

        // If the response isn't a Response object, embed in the available one for BC
        // @deprecated  can be removed when $this->response is removed
        if (! $response instanceof Response) {
            $this->response->body = $response;
            $response = $this->response;
        }*/


        // @todo; this is a quick fix to allow html loading via ajax by returning a view.
        // -->
        if (\Input::is_ajax() && $this->response !== null) {
            // If nothing was returned default to the template
            if (empty($response)) {
                $response = $this->template;
            }


            // If the response isn't a Response object, embed in the available one for BC
            // @deprecated  can be removed when $this->response is removed
            if (!$response instanceof Response && $this->response->body == null) {
                $this->response->body = $response;
                $response = $this->response;
            }
        }

        if (!$response instanceof \Response && $this->response->body !== null) {
            $response = $this->response;
        }

        if ($response instanceof \Response && \Input::is_ajax()) {
            $response->set_header('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
            $response->set_header('Expires', 'Mon, 26 Jul 1997 05:00:00 GMT');
            $response->set_header('Pragma', 'no-cache');
        }

        // <--
        return parent::after($response);
    }

    protected function trigger($event, $data = '', $return_type = 'string')
    {
        list($application, $file_name) = \Config::configFile(get_called_class());
        $file_name = str_replace('/', '_', $file_name);

        return \Event::trigger($application.'.'.$file_name.'.'.$event, $data, $return_type);
    }

    protected static function getConfiguration()
    {
        list($application, $file_name) = \Config::configFile(get_called_class());

        return \Config::loadConfiguration($application, $file_name);
    }

    protected static function getGlobalConfiguration()
    {
        list($application, $file_name) = \Config::configFile(get_called_class());

        return \Config::application($application);
    }

    protected function items(array $config, $only_count = false)
    {
        $config = array_merge(
            array(
                'related' => array(),
                'callback' => array(),
                'context' => null,
                'limit' => null,
                'offset' => null,
                'dataset' => array(),
            ),
            $config
        );

        $items = array();

        $model = $config['model'];

        $query = \Nos\Orm\Query::forge($model, $model::connection());
        foreach ($config['related'] as $related) {
            $query->related($related);
        }

        foreach ($config['callback'] as $callback) {
            if (is_callable($callback)) {
                $query = $callback($query);
            }
        }

        if (!empty($config['order_by'])) {
            $orders_by = $config['order_by'];
            if (!is_array($orders_by)) {
                $orders_by = array($orders_by);
            }
            foreach ($orders_by as $order_by => $direction) {
                if (!is_string($order_by)) {
                    $order_by = $direction;
                    $direction = 'ASC';
                }
                $query->order_by($order_by, $direction);
            }
        }

        $contextable = $model::behaviours('Nos\Orm_Behaviour_Contextable');
        $twinnable = $model::behaviours('Nos\Orm_Behaviour_Twinnable');
        if ($twinnable || $contextable) {
            if (!$contextable) {
                $contextable = $twinnable;
            }
            if (empty($config['context'])) {
                if ($twinnable) {
                    // No inspector, we only search items in their primary context
                    $query->where($twinnable['is_main_property'], 1);
                }
            } elseif (is_array($config['context']) && count($config['context']) > 1) {
                // Multiple contexts
                if ($twinnable) {
                    $query->where($twinnable['is_main_property'], 1);
                    $query->where($twinnable['common_id_property'], 'IN', \DB::select($twinnable['common_id_property'])->from($model::table())->where($twinnable['context_property'], 'IN', $config['context']));
                } else {
                    $query->where($contextable['context_property'], 'IN', $config['context']);
                }
            } else {
                $query->where($contextable['context_property'], '=', is_array($config['context']) ? $config['context'][0] : $config['context']);
            }
            $common_ids = array();
            $keys = array();
        }
        $count = $query->count();
        if ($only_count) {
            return array(
                'query' => (string) $query->get_query(),
                'query2' => '',
                'items' => array(),
                'total' => $count,
            );
        }

        // Copied over and adapted from $query->count()
        $select = \Arr::get($model::primary_key(), 0);
        $select = (mb_strpos($select, '.') === false ? $query->alias().'.'.$select : $select);
        // Get the columns
        $columns = \DB::expr('DISTINCT '.\Database_Connection::instance()->quote_identifier($select).' AS group_by_pk');
        // Remove the current select and
        $new_query = call_user_func('DB::select', $columns);
        // Set from table
        $new_query->from(array($model::table(), $query->alias()));

        $tmp = $query->build_query($new_query, $columns, 'select');
        $new_query = $tmp['query'];
        $new_query->group_by('group_by_pk');
        if ($config['limit']) {
            $new_query->limit($config['limit'] < 0 ? 1 : $config['limit']);
        }
        if ($config['offset']) {
            $new_query->offset($config['offset']);
        }
        $objects = $new_query->execute($query->connection())->as_array('group_by_pk');

        if (!empty($objects)) {
            $query = $model::find()->where(array($select, 'in', array_keys($objects)));
            foreach ($config['related'] as $related) {
                $query->related($related);
            }
            foreach ($config['callback'] as $callback) {
                if (is_callable($callback)) {
                    $query = $callback($query);
                }
            }

            if (!empty($config['order_by'])) {
                $orders_by = $config['order_by'];
                if (!is_array($orders_by)) {
                    $orders_by = array($orders_by);
                }
                foreach ($orders_by as $order_by => $direction) {
                    if (!is_string($order_by)) {
                        $order_by = $direction;
                        $direction = 'ASC';
                    }
                    $query->order_by($order_by, $direction);
                }
            }

            $objects = $query->get();
            foreach ($objects as $object) {
                $item = static::dataset_item($object, $config['dataset']);

                if ($contextable && !$twinnable) {
                    $item['context'] = Tools_Context::contextLabel($object->{$contextable['context_property']}, array('short' => true));
                }
                $items[] = $item;
                if ($twinnable) {
                    $common_id = $object->{$twinnable['common_id_property']};
                    $keys[] = $common_id;
                    $common_ids[$twinnable['common_id_property']][] = $common_id;
                }
            }
            if ($twinnable) {
                $contexts = $model::contexts($common_ids);
                foreach ($contexts as $common_id => $list) {
                    $contexts[$common_id] = explode(',', $list);
                }
                foreach ($keys as $key => $common_id) {
                    $items[$key]['context'] = $contexts[$common_id];
                }

                $sites_count = count(Tools_Context::sites());
                $locales_count = count(Tools_Context::locales());
                $global_contexts = array_keys(Tools_Context::contexts());
                foreach ($items as &$item) {
                    $flags = '';
                    $contexts = $item['context'];

                    $site = false;
                    foreach ($global_contexts as $context) {
                        if (is_array($config['context']) && !in_array($context, $config['context'])) {
                            continue;
                        }
                        $site_params = Tools_Context::site($context);
                        // When the site change
                        if ($sites_count > 1 && $site !== $site_params['alias']) {
                            $site = $site_params['alias'];
                            $in = false;
                            // Check if the any context of the item exists in the site
                            foreach ($contexts as $temp_context) {
                                if (Tools_Context::siteCode($temp_context) === $site_params['code']) {
                                    $in = true;
                                    break;
                                }
                            }
                            $flags .= (empty($flags) ? '' : '&nbsp;&nbsp;&nbsp;').'<span style="'.(!$in ? 'visibility:hidden;' : '').'vertical-align:middle;" title="'.htmlspecialchars($site_params['title']).'">'.$site_params['alias'].'</span> ';

                        }
                        if ($locales_count > 1) {
                            if (in_array($context, $contexts)) {
                                $flags .= ' '.\Nos\Tools_Context::flag($context);
                            } else {
                                $flags .= ' <span style="display:inline-block; width:16px;"></span>';
                            }
                        }
                    }
                    $item['context'] = $flags;
                }
            }
        }

        return array(
            'query' => (string) $query->get_query(),
            'query2' => (string) $new_query->compile(),
            'offset' => $config['offset'],
            'limit' => $config['limit'],
            'items' => $items,
            'total' => $count,
        );
    }

    protected function build_tree($tree)
    {
        $list_models = array();
        foreach ($tree['models'] as $model) {
            if (!is_array($model)) {
                $model = array('model' => $model);
            }
            $class = $model['model'];
            if (!isset($model['pk'])) {
                $model['pk'] = \Arr::get($class::primary_key(), 0);
            }
            if (!isset($model['order_by'])) {
                $model['order_by'] = array($model['pk']);
            } elseif (!is_array($model['order_by'])) {
                $model['order_by'] = array($model['order_by']);
            }
            if (!isset($model['childs'])) {
                $model['childs'] = array();
            }
            $list_models[$model['model']] = $model;
        }

        foreach ($list_models as $model) {
            $childs = array();
            foreach ($model['childs'] as $child) {
                if (!is_array($child)) {
                    if (!isset($list_models[$child])) {
                        continue;
                    }
                    $class = $list_models[$child]['model'];
                    $relations = $class::relations();
                    foreach ($relations as $relation) {
                        if ($relation->model_to == $model['model']) {
                            $foreignkey = $relation->key_from;
                            $childs[] = array(
                                'relation' => $relation->name,
                                'model' => $child,
                                'fk' => $foreignkey[0],
                            );
                            break;
                        }
                    }
                } else {
                    if (isset($child['model']) && isset($child['fk'])) {
                        $childs[] = $child;
                    }
                }
            }
            $list_models[$model['model']]['childs'] = $childs;
        }
        $tree['models'] = $list_models;

        $list_roots = array();
        if (!is_array($tree['roots'])) {
            $tree['roots'] = array($tree['roots']);
        }
        foreach ($tree['roots'] as $root) {
            if (!is_array($root)) {
                $root = array('model' => $root);
            }
            if (!isset($root['where']) || !is_array($root['where'])) {
                $root['where'] = array();
            }
            if (isset($tree['models'][$root['model']])) {
                $list_roots[] = $root;
            }
        }
        $tree['roots'] = $list_roots;

        return $tree;
    }

    protected function tree(array $tree_config)
    {
        $id = \Input::get('id', null);
        $model = \Input::get('model');
        $selected = \Input::get('selected');
        $deep = intval(\Input::get('deep', 1));
        $context = \Input::get('context');

        if (empty($tree_config['id'])) {
            $tree_config['id'] = \Config::getDbName(join('::', \Config::configFile(get_called_class())));
        }

        $tree_config = $this->build_tree($tree_config);

        if ($deep === -1) {
            \Session::set('tree.'.$tree_config['id'].'.'.$model.'|'.$id, false);
            $count = $this->tree_items(
                $tree_config,
                array(
                    'countProcess' => true,
                    'model' => $model,
                    'id' => $id,
                    'context' => $context,
                )
            );

            $json = array(
                'items' => array(),
                'total' => $count,
            );
        } else {
            if (\Input::get('move') === 'true') {
                return $this->tree_move(
                    $tree_config,
                    array(
                        'itemModel' => \Input::get('itemModel'),
                        'itemId' => \Input::get('itemId'),
                        'targetModel' => \Input::get('targetModel'),
                        'targetId' => \Input::get('targetId'),
                        'targetType' => \Input::get('targetType'),
                    )
                );
            }

            if (is_array($selected) && !empty($selected['id']) && !empty($selected['model'])) {
                if (!empty($selected['id']) && !empty($selected['model'])) {
                    $selected = array($selected);
                }
                foreach ($selected as $sel) {
                    if (!empty($sel['id']) && !empty($sel['model'])) {
                        $this->tree_selected(
                            $tree_config,
                            array(
                                'model' => $sel['model'],
                                'id' => $sel['id'],
                            )
                        );
                    }
                }
            }
            if ($id && $model) {
                \Session::set('tree.'.$tree_config['id'].'.'.$model.'|'.$id, true);
            }
            $items = $this->tree_items(
                $tree_config,
                array(
                    'model' => $model,
                    'id' => $id,
                    'deep' => $deep,
                    'context' => $context,
                )
            );

            $json = array(
                'items' => $items,
                'total' => count($items),
            );
        }

        // If we're requesting the root
        if ($id === null && !empty($tree_config['root_node'])) {

            $model = !empty($model) ? $model : \Arr::get($tree_config, 'model', null);
            $actions = array();
            // Sometimes no model is defined (example: the page selector is never shown within an inspector, so has no model/action defined).
            if (!empty($model)) {
                foreach (array_keys(\Config::actions(array(
                    'models' => array(!empty($model) ? $model : $tree_config['model']),
                    'target' => 'grid',
                    'class' => get_class(),
                ))) as $action) {
                    $actions[$action] = false;
                }
            }

            $json['total'] = 0;
            $json['items'] = array(
                $tree_config['root_node'] + array(
                    '_id' => 0,
                    '_model' => $model,
                    'id' => '0',
                    'actions' => $actions,
                    'treeChilds' => $json['items'],
                ),
            );
        }

        return $json;
    }

    protected function tree_move(array $tree_config, array $params)
    {
        $params = array_merge(
            array(
                'itemModel' => null,
                'itemId' => null,
                'targetModel' => null,
                'targetId' => null,
                'targetType' => 'in',
            ),
            $params
        );

        if (empty($params['itemModel']) || empty($params['itemId']) || empty($params['targetModel']) || empty($params['targetId'])) {
            return;
        }

        $model_from = $params['itemModel'];
        $model_from_id = $params['itemId'];

        $model_to = $params['targetModel'];
        $model_to_id = $params['targetId'];

        if (empty($tree_config['models'][$model_from])) {
            return;
        }
        if (empty($tree_config['models'][$model_to])) {
            return;
        }

        $from = $model_from::find($model_from_id);
        if (empty($from)) {
            return;
        }

        $to = $model_to::find($model_to_id);
        if (empty($to)) {
            return;
        }

        try {

            // Change parent for tree relations
            $behaviour_tree = $model_from::behaviours('Nos\Orm_Behaviour_Tree');
            if (!empty($behaviour_tree)) {
                $parent = ($params['targetType'] === 'in' ? $to : $to->get_parent());
                $behaviour_twinnable = $model_from::behaviours('Nos\Orm_Behaviour_Twinnable');
                if (!empty($behaviour_twinnable) && !empty($parent)) {
                    $parent = $parent->find_context($from->get_context());
                }
                $from->set_parent($parent);
            }

            // Change sort order
            $behaviour_sort = $model_from::behaviours('Nos\Orm_Behaviour_Sortable');
            if (!empty($behaviour_sort)) {
                switch ($params['targetType']) {
                    case 'before':
                        $from->move_before($to);
                        break;

                    case 'after':
                        $from->move_after($to);
                        break;

                    case 'in':
                        $from->move_to_last_position();
                        break;
                }
            }
            $from->save();
        } catch (\Exception $e) {
            \Response::json(
                array(
                    'error' => $e->getMessage(),
                )
            );
        }

        \Response::json(
            array(
                'success' => true,
            )
        );
    }

    public function tree_selected(array $tree_config, array $params)
    {
        $params = array_merge(
            array(
                'model' => null,
                'id' => null,
            ),
            $params
        );

        $model = $params['model'];

        if (empty($params['id']) || empty($model) || $tree_config['models'][$model]) {
            return false;
        }

        $item = $model::find($params['id']);
        if (empty($item)) {
            return;
        }

        $parent = $item->get_parent();
        $tree_model_parent = $tree_config['models'][get_class($parent)];
        $pk = $tree_model_parent['pk'];

        \Session::set('tree.'.$tree_config['id'].'.'.$tree_model_parent['model'].'|'.$parent->{$pk}, true);

        return $this->tree_selected(
            $tree_config,
            array(
                'model' => $tree_model_parent['model'],
                'id' => $parent->{$pk},
            )
        );
    }

    public function tree_items(array $tree_config, array $params)
    {
        $params = array_merge(
            array(
                'countProcess' => false,
                'model' => null,
                'id' => null,
                'deep' => 1,
                'context' => null,
            ),
            $params
        );

        $childs = array();
        if (!$params['model'] || empty($params['id'])) {
            $childs = $tree_config['roots'];
        } else {
            $tree_model = $tree_config['models'][$params['model']];
            foreach ($tree_model['childs'] as $child) {
                $model = $child['model'];
                if ((empty($params['context']) || (is_array($params['context']) && count($params['context']) > 1)) && $model::behaviours('Nos\Orm_Behaviour_Twinnable')) {
                    $item = $model::find($params['id']);
                    $contexts = $item->get_all_context(empty($params['context']) ? array() : $params['context']);
                    $child['where'] = array(array($child['fk'], 'IN', array_keys($contexts)));
                } else {
                    $child['where'] = array(array($child['fk'] => $params['id']));
                }
                $childs[] = $child;
            }
        }

        $items = array();
        $count = 0;
        foreach ($childs as $child) {
            $tree_model = $tree_config['models'][$child['model']];
            $pk = $tree_model['pk'];
            $controller = $this;

            $config = array_merge(
                $tree_model,
                array(
                    'context' => $params['context'],
                    'callback' => array(
                        function ($query) use ($child, $tree_model) {
                            foreach ($child['where'] as $where) {
                                $query->where($where);
                            }
                            foreach ($tree_model['order_by'] as $order_by) {
                                $query->order_by(is_array($order_by) ? $order_by : array($order_by));
                            }
                            if (!empty($tree_model['callback'])) {
                                foreach ($tree_model['callback'] as $callback) {
                                    call_user_func($callback, $query);
                                }
                            }

                            return $query;
                        }
                    ),
                    'dataset' => array_merge(
                        $tree_model['dataset'],
                        array(
                            'treeChilds' =>
                                function ($item) use ($controller, $tree_config, $params, $child, $pk) {
                                    $open = \Session::get('tree.'.$tree_config['id'].'.'.$child['model'].'|'.$item->{$pk}, null);
                                    if ($open === true || ($params['deep'] > 1 && $open !== false)) {
                                        $items = $controller->tree_items(
                                            $tree_config,
                                            array(
                                                'model' => $child['model'],
                                                'id' => $item->{$pk},
                                                'deep' => $params['deep'] - 1,
                                                'context' => $params['context'],
                                            )
                                        );

                                        return count($items) ? $items : 0;
                                    } else {
                                        return $controller->tree_items(
                                            $tree_config,
                                            array(
                                                'countProcess' => true,
                                                'model' => $child['model'],
                                                'id' => $item->{$pk},
                                                'context' => $params['context'],
                                            )
                                        );
                                    }
                                },
                        )
                    ),
                )
            );

            if ($params['countProcess']) {
                $return = $this->items($config, true);
                $count += $return['total'];
            } else {
                $return = $this->items($config);
                $items = array_merge($items, $return['items']);
            }
        }

        return $params['countProcess'] ? $count : $items;
    }

    static public function dataset_item(\Nos\Orm\Model $object, array $dataset = array())
    {
        $model = get_class($object);
        $pk = \Arr::get($model::primary_key(), 0);

        if (count($dataset) === 0) {
            $common_config = \Nos\Config_Common::load($model, array());
            $dataset = isset($common_config['data_mapping']) ? $common_config['data_mapping'] : array();
        }

        $item = array();
        $actions = \Arr::get($dataset, 'actions', array());
        unset($dataset['actions']);
        $object->import_dataset_behaviours($dataset);
        foreach ($dataset as $key => $data) {
            // Array with a 'value' key
            if (is_array($data) and !empty($data['value'])) {
                $data = $data['value'];
            }

            if ($data === true) {
                continue;
            }

            if (is_callable($data)) {
                $item[$key] = call_user_func($data, $object);
            } else if (is_array($data)) {
                if (isset($data['method'])) {
                    $item[$key] = $object->{$data['method']}();
                } else if (isset($data['column'])) {
                    $item[$key] = $object->get($data['column']);
                }
            } else {
                $item[$key] = $object->get($data);
            }
        }
        $item['actions'] = array();
        foreach ($actions as $action => $value) {
            $action_disabled = \Config::getActionDisabledState($value, $object);
            $item['actions'][$action] = is_string($action_disabled) ? $action_disabled : !$action_disabled;
        }
        $item['_id'] = $object->{$pk};
        $item['_model'] = $model;
        $item['_title'] = $object->title_item();

        return $item;
    }

    public static function getCurrentApplication()
    {
        return static::$current_application;
    }
}
