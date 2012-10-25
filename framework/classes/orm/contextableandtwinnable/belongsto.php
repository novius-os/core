<?php
/**
 * Fuel is a fast, lightweight, community driven PHP5 framework.
 *
 * @package        Fuel
 * @version        1.0
 * @author        Fuel Development Team
 * @license        MIT License
 * @copyright    2010 - 2012 Fuel Development Team
 * @link        http://fuelphp.com
 */

namespace Nos;

class Orm_ContextableAndTwinnable_BelongsTo extends \Orm\BelongsTo
{
    protected $column_context_from = 'context';

    protected $column_context_to = 'context';

    protected $column_context_is_main_to = 'context_is_main';

    public function __construct($from, $name, array $config)
    {
        $to = array_key_exists('model_to', $config) ? $config['model_to'] : \Inflector::get_namespace($from).'Model_'.\Inflector::classify($name);
        if (!class_exists($to)) {
            throw new \FuelException('Related model not found by Belongs_To relation "'.$name.'": '.$to);
        }
        $to_behaviour = $to::behaviours('Nos\Orm_Behaviour_ContextableAndTwinnable', false);
        if (!$to_behaviour) {
            throw new \FuelException('Related model not have ContextableAndTwinnable behaviour "'.$name.'"');
        }
        $from_behaviour = $from::behaviours('Nos\Orm_Behaviour_ContextableAndTwinnable', false);
        if (!$from_behaviour) {
            throw new \FuelException('Model not have ContextableAndTwinnable behaviour');
        }

        parent::__construct($from, $name, $config);

        $this->column_context_from = array_key_exists('column_context_from', $config) ? $config['column_context_from'] : $from_behaviour['context_property'];
        $this->column_context_to = array_key_exists('column_context_to', $config) ? $config['column_context_to'] : $to_behaviour['context_property'];
        $this->column_context_is_main_to = array_key_exists('column_context_from', $config) ? $config['column_context_from'] : $to_behaviour['is_main_property'];
    }

    public function join($alias_from, $rel_name, $alias_to_nr, $conditions = array())
    {
        $alias_to = 't'.$alias_to_nr;

        $props_pks = $this->select_fallback($alias_to, $alias_to.'_fallback');

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
        $models[$rel_name]['where'][] = array($alias_to.'.'.$this->column_context_is_main_to, 1);
        $models[$rel_name.'_fallback']['join_on'][] = array($alias_from.'.'.$this->column_context_from, '=', $alias_to.'_fallback'.'.'.$this->column_context_to);
        foreach (\Arr::get($this->conditions, 'where', array()) as $key => $condition) {
            !is_array($condition) and $condition = array($key, '=', $condition);
            if (!$condition[0] instanceof \Fuel\Core\Database_Expression and strpos($condition[0], '.') === false) {
                $condition[0] = $alias_to.'.'.$condition[0];
            }
            is_string($condition[2]) and $condition[2] = \Db::quote($condition[2], $models[$rel_name]['connection']);

            $models[$rel_name]['join_on'][] = $condition;
            $models[$rel_name.'_fallback']['join_on'][] = $condition;
        }

        return $models;
    }

    public function select_fallback($table, $table_fallback)
    {
        $pks = call_user_func(array($this->model_to, 'primary_key'));

        $props = call_user_func(array($this->model_to, 'properties'));
        $i = 0;
        $properties = array();
        $primary_key = array();
        foreach ($props as $pk => $pv) {
            $properties[] = array(\Fuel\Core\DB::expr('COALESCE('.$table_fallback.'.'.$pk.','.$table.'.'.$pk.')'), $table.'_c'.$i);
            if (in_array($pk, $pks)) {
                $primary_key[$table.'_c'.$i] = $pk;
            }
            $i++;
        }

        return array(
            'columns' => $properties,
            'primary_key' => $primary_key,
        );
    }
}
