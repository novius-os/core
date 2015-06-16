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

    public function get(\Orm\Model $from)
    {
        if (!$this->column_context_to) {
            return parent::get($from);
        }

        // Create the query on the model_through
        $query = call_user_func(array($this->model_to, 'query'));

        // set the model_from's keys as where conditions for the model_through
        $join = array(
                'table'      => array($this->table_through, 't0_through'),
                'join_type'  => null,
                'join_on'    => array(),
                'columns'    => $this->select_through('t0_through')
        );

        reset($this->key_from);
        foreach ($this->key_through_from as $key) {
            if ($from->{current($this->key_from)} === null) {
                return array();
            }
            $query->where('t0_through.'.$key, $from->{current($this->key_from)});
            next($this->key_from);
        }

        reset($this->key_to);
        foreach ($this->key_through_to as $key) {
            $join['join_on'][] = array('t0_through.'.$key, '=', 't0.'.current($this->key_to));
            next($this->key_to);
        }

        if ($this->front_context_fallback && (NOS_ENTRY_POINT == Nos::ENTRY_POINT_FRONT)) {
            //front context is used
            $context_to = Nos::main_controller()->getContext();
        } elseif (empty($this->force_context_fallback)) {
            //model context is used
            $context_to = $from->{$this->column_context_from};
        } else {
            //default context is used
            $context_to = $this->force_context_fallback;
        }
        $context_to_db = \DB::expr(\DB::quote($context_to));

        $query->and_where_open();
        $query->where($this->column_context_to, $context_to_db);
        $query->or_where($this->column_context_is_main_to, 1);
        $query->and_where_close();

        foreach (\Arr::get($this->conditions, 'where', array()) as $key => $condition) {
            is_array($condition) or $condition = array($key, '=', $condition);
            $query->where($condition);
        }

        foreach (\Arr::get($this->conditions, 'join_on', array()) as $key => $condition) {
            is_array($condition) or $condition = array($key, '=', $condition);
            reset($condition);
            $condition[key($condition)] = 't0_through.'.current($condition);
            $join['join_on'][] = $condition;
        }

        foreach (\Arr::get($this->conditions, 'order_by', array()) as $field => $direction) {
            if (is_numeric($field)) {
                $query->order_by($direction);
            } else {
                $query->order_by($field, $direction);
            }
        }

        $query->_join($join);

        $result = array();
        $result_context = array();
        foreach ($query->get() as $pk => $model) {
            if (isset($result_context[$model->{$this->column_context_common_id_to}])) {
                if ($model->{$this->column_context_to} !== $context_to) {
                    continue;
                } else {
                    unset($result[$result_context[$model->{$this->column_context_common_id_to}]]);
                }
            }
            $result_context[$model->{$this->column_context_common_id_to}] = $pk;
            $result[$pk] = $model;
        }

        return $result;
    }

    public function join($alias_from, $rel_name, $alias_to_nr, $conditions = array())
    {
        if (!$this->column_context_to) {
            return parent::join($alias_from, $rel_name, $alias_to_nr, $conditions);
        }

        $alias_to = 't'.$alias_to_nr;

        $alias_through = array($this->table_through, $alias_to.'_through');

        $main_context = \Arr::get($conditions, 'main_context', true);
        if ($main_context) {
            $rel_name_main = $rel_name;
            $alias_to_main = $alias_to;
            $rel_name_context = $rel_name.'_context';
            $alias_to_context = $alias_to.'_context';
        } else {
            $rel_name_main = $rel_name.'_main';
            $alias_to_main = $alias_to.'_main';
            $rel_name_context = $rel_name;
            $alias_to_context = $alias_to;
        }

        $models = array(
            $rel_name.'_through' => array(
                'model'        => null,
                'connection'   => call_user_func(array($this->model_to, 'connection')),
                'table'        => $alias_through,
                'primary_key'  => null,
                'join_type'    => \Arr::get($conditions, 'join_type') ?: \Arr::get($this->conditions, 'join_type', 'left'),
                'join_on'      => array(),
                'columns'      => $this->select_through($alias_to.'_through'),
                'rel_name'     => $this->model_through,
                'relation'     => $this
            ),
            $rel_name_main => array(
                'model'        => $this->model_to,
                'connection'   => call_user_func(array($this->model_to, 'connection')),
                'table'        => array(call_user_func(array($this->model_to, 'table')), $alias_to_main),
                'primary_key'  => null,
                'join_type'    => \Arr::get($conditions, 'join_type') ?: \Arr::get($this->conditions, 'join_type', 'left'),
                'join_on'      => array(),
                'columns'      => array(),
                'rel_name'     => strpos($rel_name_main, '.') ? substr($rel_name_main, strrpos($rel_name_main, '.') + 1) : $rel_name_main,
                'relation'     => $this,
                'where'        => \Arr::get($conditions, 'where', array()),
            ),
            $rel_name_context => array(
                'model'       => $main_context ? null : $this->model_to,
                'connection'  => call_user_func(array($this->model_to, 'connection')),
                'table'       => array(call_user_func(array($this->model_to, 'table')), $alias_to_context),
                'primary_key' => null,
                'join_type'   => \Arr::get($conditions, 'join_type') ? : \Arr::get($this->conditions, 'join_type', 'left'),
                'join_on'     => array(),
                'columns'     => array(),
                'rel_name'    => (strpos($rel_name_context, '.') ? substr($rel_name_context, strrpos($rel_name_context, '.') + 1) : $rel_name_context),
                'relation'    => $this,
                'where'       => \Arr::get($conditions, 'where', array()),
            ),
        );

        reset($this->key_from);
        foreach ($this->key_through_from as $key) {
            $models[$rel_name.'_through']['join_on'][] = array($alias_from.'.'.current($this->key_from), '=', $alias_to.'_through.'.$key);
            next($this->key_from);
        }

        reset($this->key_to);
        foreach ($this->key_through_to as $key) {
            $models[$rel_name_main]['join_on'][] = array($alias_to.'_through.'.$key, '=', $alias_to_main.'.'.current($this->key_to));
            $models[$rel_name_context]['join_on'][] = array($alias_to.'_through.'.$key, '=', $alias_to_context.'.'.current($this->key_to));
            next($this->key_to);
        }

        if ($this->front_context_fallback && (NOS_ENTRY_POINT == Nos::ENTRY_POINT_FRONT)) {
            //front context is used
            $context_to = \DB::expr(\DB::quote(Nos::main_controller()->getContext()));
        } elseif (empty($this->force_context_fallback)) {
            //model context is used
            $context_to = $alias_from.'.'.$this->column_context_from;
        } else {
            //default context is used
            $context_to = \DB::expr(\DB::quote($this->force_context));
        }

        $models[$rel_name_main]['join_on'][] = array($alias_to_main.'.'.$this->column_context_is_main_to, '=', DB::expr(1));
        $models[$rel_name_context]['join_on'][] = array($alias_to_context.'.'.$this->column_context_to, '=', $context_to);

        foreach (array(\Arr::get($this->conditions, 'where', array()), \Arr::get($conditions, 'join_on', array())) as $c) {
            foreach ($c as $key => $condition) {
                ! is_array($condition) and $condition = array($key, '=', $condition);
                is_string($condition[2]) and $condition[2] = \Db::quote($condition[2], $models[$rel_name_main]['connection']);
                $condition_context = $condition;
                if (!$condition[0] instanceof \Fuel\Core\Database_Expression and strpos($condition[0], '.') === false) {
                    $condition[0] = $alias_to_main.'.'.$condition[0];
                    $condition_context[0] = $alias_to_context.'.'.$condition_context[0];
                }

                $models[$rel_name_main]['join_on'][] = $condition;
                $models[$rel_name_context]['join_on'][] = $condition_context;
            }
        }

        $alias_to_table = array(call_user_func(array($this->model_to, 'table')), $alias_to);
        $order_by = \Arr::get($conditions, 'order_by') ?: \Arr::get($this->conditions, 'order_by', array());
        foreach ($order_by as $key => $direction) {
            if (!$key instanceof \Fuel\Core\Database_Expression and strpos($key, '.') === false) {
                if ($main_context) {
                    $key = \DB::expr('COALESCE('.$alias_to_context.'.'.$key.','.$alias_to_main.'.'.$key.')');
                } else {
                    $key = $alias_to_context.'.'.$key;
                }
            } else {
                $key = str_replace(
                    array($alias_through[0], $alias_to_table[0]),
                    array($alias_through[1], $alias_to_table[1]),
                    $key
                );
            }
            $models[$rel_name_main]['order_by'][$key] = $direction;
            $models[$rel_name_context]['order_by'][$key] = $direction;
        }

        if ($main_context) {
            $props_pks = $this->_selectFallback($alias_to_main, $alias_to_context);
            $models[$rel_name_main]['primary_key'] = $props_pks['primary_key'];
            $models[$rel_name_main]['columns'] = $props_pks['columns'];
        } else {
            unset($models[$rel_name_main]);
            $models[$rel_name_context]['primary_key'] = call_user_func(array($this->model_to, 'primary_key'));
            $models[$rel_name_context]['columns'] = $this->select($alias_to_context);
        }

        return $models;
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
}
