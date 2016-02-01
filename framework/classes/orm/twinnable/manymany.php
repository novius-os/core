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

use \DB;

class Orm_Twinnable_ManyMany extends \Orm\ManyMany
{
    protected $column_context_from = 'context';
    protected $column_context_common_id_to = false;
    protected $column_context_to = false;
    protected $column_context_is_main_to = false;

    protected $cascade_delete_after_last_twin = true;

    protected $delete_related_called = false;

    protected $force_context_fallback = false;// force using a specific context
    protected $front_context_fallback = false;// try using front context

    /**
     * Initializes the twinnable relation specified by $name on the item $from
     *
     * @param string $from
     * @param string $name
     * @param array $config
     * @throws \FuelException
     */
    public function __construct($from, $name, array $config)
    {
        $to = \Arr::get($config, 'model_to', \Inflector::get_namespace($from).'Model_'.\Inflector::classify($name));
        if (!class_exists($to)) {
            throw new \FuelException(
                'The related model ‘'.$this->model_to.'’ cannot be found by the many_many relation ‘'.$this->name.'’.'
            );
        }
        $to_behaviour = $to::behaviours('Nos\Orm_Behaviour_Twinnable', false);
        if ($to_behaviour && !array_key_exists('key_to', $config)) {
            $config['key_to'] = $to_behaviour['common_id_property'];
        }

        $this->front_context_fallback = \Arr::get($config, 'front_context_fallback', false);

        $this->force_context_fallback = \Arr::get($config, 'force_context_fallback', false);
        $from_behaviour = $from::behaviours('Nos\Orm_Behaviour_Twinnable', array());
        if (!$this->force_context_fallback) {
            if (empty($from_behaviour)) {
                throw new \FuelException(
                    'The model ‘'.$from.'’ has a twinnable_many_many relation '.
                    'but no Twinnable behaviour. Surprising, don’t you think?'
                );
            }
            $config['key_from'] = (array) \Arr::get($config, 'key_from', $from_behaviour['common_id_property']);
        } else {
            if (empty($config['key_from'])) {
                throw new \FuelException(
                    'You must define a ‘key_from‘ on ‘'.$from.'’ twinnable_many_many relation '.'‘'.$name.'’'
                );
            }
            if ($this->force_context_fallback === true) {
                //set default context if not given
                $contexts = Tools_Context::contexts();
                $this->force_context_fallback = key($contexts);
            }
        }

        parent::__construct($from, $name, $config);

        $this->column_context_from = \Arr::get($config, 'column_context_from', \Arr::get($from_behaviour, 'context_property', false));

        $this->column_context_common_id_to = \Arr::get(
            $config,
            'column_context_common_id_to',
            $to_behaviour ? $to_behaviour['common_id_property'] : false
        );
        $this->column_context_to = \Arr::get(
            $config,
            'column_context_to',
            $to_behaviour ? $to_behaviour['context_property'] : false
        );
        $this->column_context_is_main_to = \Arr::get(
            $config,
            'column_context_is_main_to',
            $to_behaviour ? $to_behaviour['is_main_property'] : false
        );

        $this->cascade_delete_after_last_twin =  \Arr::get(
            $config,
            'cascade_delete_after_last_twin',
            $this->cascade_delete_after_last_twin
        );
    }

    /**
     * Gets the related items on the item $from
     *
     * @param \Orm\Model $from
     * @param array $conditions
     * @return array|object
     */
    public function get(\Orm\Model $from, array $conditions = array())
    {
        $result = parent::get($from);

        // If there is a context column then removes results that are not in this context (with a fallback on the main context)
        if ($this->column_context_to) {
            $result_context = array();
            $context_to = $this->get_context_to();
            if (empty($context_to)) {
                // if not front_context_fallback and not force_context_fallback, $from Model context is used
                $context_to = $from->{$this->column_context_from};
            }

            // $resultTwinnable doesn't contain items with same common_id (remove items that are not in the context, with fallback on the main context)
            $resultTwinnable = array();
            foreach ($result as $pk => $model) {
                if (isset($result_context[$model->{$this->column_context_common_id_to}])) {
                    if ($model->{$this->column_context_to} !== $context_to) {
                        continue;
                    } else {
                        unset($resultTwinnable[$result_context[$model->{$this->column_context_common_id_to}]]);
                    }
                }
                $result_context[$model->{$this->column_context_common_id_to}] = $pk;
                $resultTwinnable[$pk] = $model;
            }

            return $resultTwinnable;
        }

        return $result;
    }

    /**
     * Builds the where conditions for the get() query
     *
     * @param $query
     * @param $conditions
     * @param $alias_to
     * @param $from
     * @return bool
     */
    protected function _build_query_where($query, $conditions, $alias_to, $from)
    {
        if ($this->column_context_to) {
            // Filters the query to get the items in the context and the items in the main context
            $context_to = $this->get_context_to() ?: $from->{$this->column_context_from};
            $query->and_where_open();
            $query->where($this->column_context_to, \DB::expr(\DB::quote($context_to)));
            $query->or_where($this->column_context_is_main_to, 1);
            $query->and_where_close();
        }
        return parent::_build_query_where($query, $conditions, $alias_to, $from);
    }

    /**
     * Gets the properties to join the related items on a query
     *
     * @param $alias_from
     * @param $rel_name
     * @param $alias_to_nr
     * @param array $conditions
     * @return array
     */
    public function join($alias_from, $rel_name, $alias_to_nr, $conditions = array())
    {
	// Consider as a classical many_many relation if no column context defined
        if (!$this->column_context_to) {
            // @todo throw an exception in a future major release ?
            return parent::join($alias_from, $rel_name, $alias_to_nr, $conditions);
        }

        $this->alias_to = 't'.$alias_to_nr;
        $this->alias_from = $alias_from;
        $this->alias_through = $this->alias_to.'_through';

        // Merges the conditions of the relation with the specific conditions
        $conditions = \Arr::merge($this->conditions, $conditions);

        $main_context = \Arr::get($conditions, 'main_context', true);

        // Get the relations properties (name, alias...)
        $relations = $this->getRelationsProperties($rel_name, $this->alias_to, $conditions);

        // Gets the context in which to search the related items
        $context_to = $this->get_context_to();
        $context_to = !empty($context_to) ? \DB::expr(\DB::quote($context_to)) : $alias_from.'.'.$this->column_context_from;

        $joins = array(
            $rel_name.'_through' => array(
                'model'        => null,
                'connection'   => call_user_func(array($this->model_to, 'connection')),
                'table'        => array($this->table_through, $this->alias_through),
                'primary_key'  => null,
                'join_type'    => \Arr::get($conditions, 'join_type', 'left'),
                'join_on'      => array(),
                'columns'      => $this->select_through($this->alias_through),
                'rel_name'     => $this->model_through,
                'relation'     => $this
            ),
            $relations['main']['name'] => array(
                'model'        => $this->model_to,
                'connection'   => call_user_func(array($this->model_to, 'connection')),
                'table'        => array(call_user_func(array($this->model_to, 'table')), $relations['main']['alias']),
                'primary_key'  => null,
                'join_type'    => \Arr::get($conditions, 'join_type', 'left'),
                'join_on'      => array(
                    array($relations['main']['alias'].'.'.$this->column_context_is_main_to, '=', DB::expr(1))
                ),
                'columns'      => array(),
                'rel_name'     => $this->getRelationName($relations['main']['name']),
                'relation'     => $this,
                'where'        => array(),
            ),
            $relations['context']['name'] => array(
                'model'       => $main_context ? null : $this->model_to,
                'connection'  => call_user_func(array($this->model_to, 'connection')),
                'table'       => array(call_user_func(array($this->model_to, 'table')), $relations['context']['alias']),
                'primary_key' => null,
                'join_type'   => \Arr::get($conditions, 'join_type', 'left'),
                'join_on'     => array(
                    array($relations['context']['alias'].'.'.$this->column_context_to, '=', $context_to)
                ),
                'columns'     => array(),
                'rel_name'    => $this->getRelationName($relations['context']['name']),
                'relation'    => $this,
                'where'       => array(),
            ),
        );

        // Builds the join conditions on the table_through
        if (!$this->_build_join_through($joins, $rel_name, $this->alias_through, $this->alias_from, $conditions)) {
            return array();
        }

        // Builds the join conditions on the model_to
        if (!$this->_build_join_to($joins, $rel_name, $this->alias_to, $this->alias_through, $conditions)) {
            return array();
        }

        // Builds the where conditions on the table_through
        if (!$this->_build_join_where_through($joins, $rel_name, $this->alias_to, $this->alias_from, $conditions)) {
            return array();
        }

        // Builds the where conditions on the model_to
        if (!$this->_build_join_where_to($joins, $rel_name, $this->alias_to, $this->alias_from, $conditions)) {
            return array();
        }

        // Builds the order_by conditions
        if (!$this->_build_join_orderby($joins, $rel_name, $this->alias_to, $this->alias_from, $conditions)) {
            return array();
        }

        if ($main_context) {
            $props_pks = $this->_selectFallback($relations['main']['alias'], $relations['context']['alias']);
            $joins[$relations['main']['name']]['primary_key'] = $props_pks['primary_key'];
            $joins[$relations['main']['name']]['columns'] = $props_pks['columns'];
        } else {
            unset($joins[$relations['main']['name']]);
            $joins[$relations['context']['name']]['primary_key'] = call_user_func(array($this->model_to, 'primary_key'));
            $joins[$relations['context']['name']]['columns'] = $this->select($relations['context']['alias']);
        }

        return $joins;
    }

    /**
     * Builds the conditions for a join on the model_to
     *
     * @param $joins
     * @param $rel_name
     * @param $alias_to
     * @param $alias_from
     * @param $conditions
     * @return bool
     */
    protected function _build_join_to(&$joins, $rel_name, $alias_to, $alias_from, $conditions)
    {
        if (!$this->column_context_to) {
            return parent::_build_join_to($joins, $rel_name, $alias_to, $alias_from, $conditions);
        }

        // Get the relations properties (name, alias...)
        $relations = $this->getRelationsProperties($rel_name, $alias_to, $conditions);

        // Creates the conditions for the join on the main context and on the specified context
        foreach (\Arr::filter_keys($relations, array('main', 'context')) as $relation) {
            if (!parent::_build_join_to($joins, $relation['name'], $relation['alias'], $alias_from, $conditions)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Builds the where conditions for the join
     *
     * @param $joins
     * @param $rel_name
     * @param $alias_to
     * @param $alias_from
     * @param $conditions
     * @return bool
     */
    protected function _build_join_where_to(&$joins, $rel_name, $alias_to, $alias_from, $conditions)
    {
        if (!$this->column_context_to) {
            return parent::_build_join_where_to($joins, $rel_name, $alias_to, $alias_from, $conditions);
        }

        // Get the relations properties (name, alias...)
        $relations = $this->getRelationsProperties($rel_name, $alias_to, $conditions);

        // Creates the conditions for the join on the main context and on the specified context
        foreach (\Arr::filter_keys($relations, array('main', 'context')) as $relation) {
            if (!parent::_build_join_where_to($joins, $relation['name'], $relation['alias'], $alias_from, $conditions)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Builds the order_by conditions for a join
     *
     * @param $joins
     * @param $rel_name
     * @param $alias_to
     * @param $alias_from
     * @param $conditions
     * @return bool
     */
    protected function _build_join_orderby(&$joins, $rel_name, $alias_to, $alias_from, $conditions)
    {
        if (!$this->column_context_to) {
            return parent::_build_join_orderby($joins, $rel_name, $alias_to, $alias_from, $conditions);
        }

        $main_context = \Arr::get($conditions, 'main_context', true);

        // Get the relations properties (name, alias...)
        $relations = $this->getRelationsProperties($rel_name, $alias_to, $conditions);

        // Builds the order_by conditions
        foreach (\Arr::get($conditions, 'order_by', array()) as $key => $direction) {
            // If the main_context feature is enabled then sort on the context column with a fallback on the main column
            if ($main_context && !$key instanceof \Fuel\Core\Database_Expression and strpos($key, '.') === false) {
                $fields = array();
                foreach ($relations as $relation) {
                    $fields[] = $relation['alias'].'.'.$key;
                }
                $key = \DB::expr('COALESCE('.implode(', ', $fields).')');
            }
            // Otherwise sort on the context column
            else {
                $key = $this->getAliasedField($key, $alias_to);
            }

            foreach ($relations as $relation) {
                $joins[$relation['name']]['order_by'][$key] = $direction;
            }
        }

        return true;
    }

    public function save($model_from, $models_to, $original_model_ids, $parent_saved, $cascade)
    {
        if (!$parent_saved) {
            return;
        }

        if (!is_array($models_to) and ($models_to = is_null($models_to) ? array() : $models_to) !== array()) {
            throw new \FuelException(
                'Assigned relationships must be an array or null, given relationship value for '.
                $this->name.' is invalid.'
            );
        }
        $original_model_ids === null and $original_model_ids = array();
        $original_common_ids = array();

        $common_id_property = reset($this->key_to);
        if ($this->delete_related_called) {
            // If delete_related() has been called before save(), force the call of parent delete_related()
            // static::delete_related() does nothing if others twins exist
            parent::delete_related($model_from);
            $this->delete_related_called = false;
            $original_model_ids = array();
        } else {
            if (!empty($original_model_ids)) {
                $model_to_class = $this->model_to;
                $primary_key = $model_to_class::primary_key();
                $result = \DB::select($common_id_property)->from($model_to_class::table())
                    ->where(reset($primary_key), 'IN', $original_model_ids)
                    ->execute($model_to_class::connection());
                $original_common_ids = \Arr::pluck($result->as_array(), $common_id_property);
            }
        }
        $del_common_ids = $original_common_ids;

        foreach ($models_to as $key => $model_to) {
            if (!$model_to instanceof $this->model_to) {
                throw new \FuelException('Invalid Model instance added to relations in this model.');
            }

            // Save if it's a yet unsaved object
            if ($model_to->is_new()) {
                $model_to->save(false);
            }

            $current_model_id = $model_to ? $model_to->implode_pk($model_to) : null;

            // Check if the model was already assigned, if not INSERT relationships:
            if (!in_array($current_model_id, $original_model_ids)) {
                $ids = array();
                reset($this->key_from);
                foreach ($this->key_through_from as $pk) {
                    $ids[$pk] = $model_from->{current($this->key_from)};
                    next($this->key_from);
                }

                reset($this->key_to);
                foreach ($this->key_through_to as $pk) {
                    $ids[$pk] = $model_to->{current($this->key_to)};
                    next($this->key_to);
                }

                if (!in_array($model_to->{$common_id_property}, $original_common_ids)) {
                    \DB::insert($this->table_through)->set($ids)->execute(call_user_func(array($model_from, 'connection')));
                } else {
                    unset($del_common_ids[array_search($model_to->{$common_id_property}, $original_common_ids)]);
                }
                $original_model_ids[] = $current_model_id; // prevents inserting it a second time
            } else {
                // unset current model from from array of new relations
                unset($del_common_ids[array_search($model_to->{$common_id_property}, $original_common_ids)]);
            }

            // ensure correct pk assignment
            if ($key != $current_model_id) {
                $model_from->unfreeze();
                $rel = $model_from->_relate();
                if (!empty($rel[$this->name][$key]) and $rel[$this->name][$key] === $model_to) {
                    unset($rel[$this->name][$key]);
                }
                $rel[$this->name][$current_model_id] = $model_to;
                $model_from->_relate($rel);
                $model_from->freeze();
            }
        }

        // If any ids are left in $del_rels they are no longer assigned, DELETE the relationships:
        //del_rels is made of ids, contrary to the content of the "table_through", made of common ids
        //these must be replaced before deleting the relationship

        if (!empty($del_common_ids)) {
            //As the context_common_id property can't be an array,
            //it is assumed that each del_rels and is key is a single id
            //(could have been several)
            $query = \DB::delete($this->table_through);
            $query->where(reset($this->key_through_to), 'IN', $del_common_ids);
            $query->where(reset($this->key_through_from), '=', $model_from->{reset($this->key_from)});

            $query->execute(call_user_func(array($model_from, 'connection')));
        }

        $cascade = is_null($cascade) ? $this->cascade_save : (bool) $cascade;
        if ($cascade and ! empty($models_to)) {
            foreach ($models_to as $m) {
                $m->save();
            }
        }
    }

    public function _selectFallback($table, $table_fallback)
    {
        $pks = call_user_func(array($this->model_to, 'primary_key'));

        $props = call_user_func(array($this->model_to, 'properties'));
        $properties = array();
        $primary_key = array();
        foreach ($props as $pk => $pv) {
            $properties[] = array(\DB::expr('COALESCE('.$table_fallback.'.'.$pk.','.$table.'.'.$pk.')'), $table.'_'.$pk);
            if (in_array($pk, $pks)) {
                $primary_key[$table.'_'.$pk] = $pk;
            }
        }

        return array(
            'columns' => $properties,
            'primary_key' => $primary_key,
        );
    }

    public function delete_related($model_from)
    {
        $this->delete_related_called = true;

        //search for twin models
        $query = \DB::select()->from($model_from::table());
        reset($this->key_from);
        foreach ($this->key_from as $key) {
            $query->where($key, '=', $model_from->{current($this->key_from)});
            next($this->key_from);
        }
        $result = $query->execute(call_user_func(array($model_from, 'connection')));
        //if there's one result or more, prevent from deleting relation (still used by twin models)
        if (count($result) === 0) {
            parent::delete_related($model_from);
        }
    }

    /**
     * Gets the context for the model_to
     *
     * @return bool|mixed|string
     */
    public function get_context_to() {
        // Gets the context
        if ($this->front_context_fallback && (NOS_ENTRY_POINT == Nos::ENTRY_POINT_FRONT)) {
            // front context is used
            return Nos::main_controller()->getContext();
        } elseif (!empty($this->force_context_fallback)) {
            // forced context fallback
            return $this->force_context_fallback;
        }
        return false;
    }

    /**
     * Gets the relations properties (name, alias...)
     *
     * @param $rel_name
     * @param $alias_to
     * @param $conditions
     * @return array
     */
    public function getRelationsProperties($rel_name, $alias_to, $conditions) {
        if (\Arr::get($conditions, 'main_context', true)) {
            $relations = array(
                'main' => array(
                    'name' => $rel_name,
                    'alias' => $alias_to,
                ),
                'context' => array(
                    'name' => $rel_name.'_context',
                    'alias' => $alias_to.'_context',
                ),
            );
        } else {
            $relations = array(
                'main' => array(
                    'name' => $rel_name.'_main',
                    'alias' => $alias_to.'_main',
                ),
                'context' => array(
                    'name' => $rel_name,
                    'alias' => $alias_to,
                ),
            );
        }

        return $relations;
    }
}
