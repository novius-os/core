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

class Orm_Twinnable_HasMany extends \Orm\HasMany
{
    protected $column_context_from = 'context';

    protected $column_context_to = false;

    protected $column_context_is_main_to = false;

    protected $cascade_delete_after_last_twin = true;
    
    protected $force_context = false;

    public function __construct($from, $name, array $config)
    {
        $to = \Arr::get($config, 'model_to', \Inflector::get_namespace($from).'Model_'.\Inflector::classify($name));
        if (!class_exists($to)) {
            throw new \FuelException(
                'The related model ‘'.$this->model_to.'’ cannot be found by the has_many relation ‘'.$this->name.'’.'
            );
        }
        $to_behaviour = $to::behaviours('Nos\Orm_Behaviour_Twinnable', false);

        //force_context will allow to use the twinnable relation on a non-twinnable model :
        //it will be infered from the page context
        $this->force_context = \Arr::get($config, 'force_context', false);
        if (empty($this->force_context)) {
            $from_behaviour = $from::behaviours('Nos\Orm_Behaviour_Twinnable', false);
            if (!$from_behaviour) {
                throw new \FuelException(
                    'The model ‘'.$from.'’ has a twinnable_has_many relation but no Twinnable behaviour. Unusual, isn’t it?'
                );
            }
            $config['key_from'] = (array) \Arr::get($config, 'key_from', $from_behaviour['common_id_property']);
        } else {
            if (empty($config['key_from'])) {
                throw new \FuelException(
                    'You must define a ‘key_from‘ on ‘'.$from.'’ twinnable_has_many relation '.'‘'.$name.'’'
                );
            }
        }

        parent::__construct($from, $name, $config);

        $this->column_context_from = \Arr::get($config, 'column_context_from', !empty($from_behaviour['context_property']) ? $from_behaviour['context_property'] : false);

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

        $class = $this->model_to;

        $conditions = $this->conditions;
        $where = \Arr::get($conditions, 'where', array());
        reset($this->key_to);
        foreach ($this->key_from as $key) {
            // no point running a query when a key value is null
            if ($from->{$key} === null) {
                return array();
            }
            $where[] = array(current($this->key_to) => $from->{$key});
            next($this->key_to);
        }
        $conditions['where'] = $where;

        if (empty($this->force_context)) {
            //preserve context thanks to the current context of the model
            $context_to = $from->{$this->column_context_from};
        } else {
            //try to use page context for the related model, else pick a default one
            if (NOS_ENTRY_POINT == Nos::ENTRY_POINT_FRONT) {
                $context_to = Nos::main_controller()->getContext();
            } elseif ($this->force_context === true) {
                $contexts = Tools_Context::contexts();
                $context_to = key(reset($contexts));
            } else {
                $context_to = $this->force_context;
            }
        }

        return $class::findMainOrContext($context_to, $conditions);
    }

    public function join($alias_from, $rel_name, $alias_to_nr, $conditions = array())
    {
        if (!$this->column_context_to) {
            return parent::join($alias_from, $rel_name, $alias_to_nr, $conditions);
        }

        $alias_to = 't'.$alias_to_nr;

        $props_pks = $this->_selectFallback($alias_to, $alias_to.'_fallback');

        $models = array(
            $rel_name => array(
                'model' => $this->model_to,
                'connection' => call_user_func(array($this->model_to, 'connection')),
                'table' => array(call_user_func(array($this->model_to, 'table')), $alias_to),
                'primary_key' => $props_pks['primary_key'],
                'join_type' => \Arr::get($conditions, 'join_type') ? : \Arr::get($this->conditions, 'join_type', 'left'),
                'join_on' => array(),
                'columns' => $props_pks['columns'],
                'rel_name' => strpos($rel_name, '.') ? substr($rel_name, strrpos($rel_name, '.') + 1) : $rel_name,
                'relation' => $this,
                'where' => \Arr::get($conditions, 'where', array()),
                'order_by' => \Arr::get($conditions, 'order_by') ? : \Arr::get($this->conditions, 'order_by', array()),
            ),
            $rel_name.'_fallback' => array(
                'model' => null,
                'connection' => call_user_func(array($this->model_to, 'connection')),
                'table' => array(call_user_func(array($this->model_to, 'table')), $alias_to.'_fallback'),
                'primary_key' => null,
                'join_type' => \Arr::get($conditions, 'join_type') ? : \Arr::get($this->conditions, 'join_type', 'left'),
                'join_on' => array(),
                'columns' => array(),
                'rel_name' => (strpos($rel_name, '.') ? substr($rel_name, strrpos($rel_name, '.') + 1) : $rel_name).'_fallback',
                'relation' => $this,
                'where' => \Arr::get($conditions, 'where', array()),
                'order_by' => \Arr::get($conditions, 'order_by') ? : \Arr::get($this->conditions, 'order_by', array()),
            ),
        );

        reset($this->key_to);
        foreach ($this->key_from as $key) {
            $models[$rel_name]['join_on'][] = array($alias_from.'.'.$key, '=', $alias_to.'.'.current($this->key_to));
            $models[$rel_name.'_fallback']['join_on'][] = array($alias_from.'.'.$key, '=', $alias_to.'_fallback'.'.'.current($this->key_to));
            next($this->key_to);
        }


        if (empty($this->force_context)) {
            //preserve context thanks to the current context of the model
            $context_to = $alias_from.'.'.$this->column_context_from;
        } else {
            //try to use page context for the related model, else pick a default one
            if (NOS_ENTRY_POINT == Nos::ENTRY_POINT_FRONT) {
                $context_to = Nos::main_controller()->getContext();
            } elseif ($this->force_context === true) {
                $contexts = Tools_Context::contexts();
                $context_to = key(reset($contexts));
            } else {
                $context_to = $this->force_context;
            }
            $context_to = \DB::expr(\DB::quote($context_to));
        }

        $models[$rel_name]['join_on'][] = array($alias_to.'.'.$this->column_context_is_main_to, '=', DB::expr(1));
        $models[$rel_name.'_fallback']['join_on'][] = array($alias_to.'_fallback'.'.'.$this->column_context_to, '=', $context_to);

        foreach (array(\Arr::get($this->conditions, 'where', array()), \Arr::get($conditions, 'join_on', array())) as $c) {
            foreach ($c as $key => $condition) {
                !is_array($condition) and $condition = array($key, '=', $condition);
                if (!$condition[0] instanceof \Fuel\Core\Database_Expression and strpos($condition[0], '.') === false) {
                    $condition[0] = $alias_to.'.'.$condition[0];
                }
                is_string($condition[2]) and $condition[2] = \Db::quote($condition[2], $models[$rel_name]['connection']);

                $models[$rel_name]['join_on'][] = $condition;
                $models[$rel_name.'_fallback']['join_on'][] = $condition;
            }
        }

        return $models;
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

    public function delete($model_from, $models_to, $parent_deleted, $cascade)
    {
        // If not cascade, others twins use the relation
        // see \Nos\Orm\Model->should_cascade_delete()
        // prevent parent delete() to set the foreign key to null
        if ((bool) $cascade) {
            return parent::delete($model_from, $models_to, $parent_deleted, $cascade);
        }
    }
}
