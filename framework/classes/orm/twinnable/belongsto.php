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

class Orm_Twinnable_BelongsTo extends \Orm\BelongsTo
{
    protected $column_context_from = 'context';

    protected $column_context_to = false;

    protected $column_context_is_main_to = false;

    protected $cascade_delete_after_last_twin = true;

    protected $force_context_fallback = false;// force using a specific context
    protected $front_context_fallback = false;// try using front context

    public function __construct($from, $name, array $config)
    {
        $to = \Arr::get($config, 'model_to', \Inflector::get_namespace($from).'Model_'.\Inflector::classify($name));
        if (!class_exists($to)) {
            throw new \FuelException(
                'The related model ‘'.$to.'’ cannot be found by the belongs_to relation ‘'.$name.'’.'
            );
        }
        $to_behaviour = $to::behaviours('Nos\Orm_Behaviour_Twinnable', false);
        if ($to_behaviour && !array_key_exists('key_to', $config)) {
            $config['key_to'] = $to_behaviour['common_id_property'];
        }

        $this->front_context_fallback = \Arr::get($config, 'front_context_fallback', false);

        $this->force_context_fallback = \Arr::get($config, 'force_context_fallback', false);
        $from_behaviour = $from::behaviours('Nos\Orm_Behaviour_Twinnable', array());
        if ($this->force_context_fallback === true) {
            //set default context if not given
            $contexts = Tools_Context::contexts();
            $this->force_context_fallback = key($contexts);
        } elseif (!$this->force_context_fallback) {
            if (empty($from_behaviour)) {
                throw new \FuelException(
                    'The model ‘'.$from.'’ has a twinnable_belongs_to relation '.
                    'but no Twinnable behaviour nor "force_context_fallback" option. Surprising, don’t you think?'
                );
            }
        }

        parent::__construct($from, $name, $config);

        foreach ($this->key_from as $key_from) {
            if (!$this->force_context_fallback && !in_array($key_from, $from_behaviour['common_fields'])) {
                throw new \FuelException(
                    'The field ‘'.$key_from.'’ of the model ‘'.$from.
                    '’ must be declared as common in the Twinnable behaviour.'
                );
            }
        }

        $this->column_context_from = \Arr::get($config, 'column_context_from', \Arr::get($from_behaviour, 'context_property', false));

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

        $query = call_user_func(array($this->model_to, 'query'));
        reset($this->key_to);
        foreach ($this->key_from as $key) {
            // no point running a query when a key value is null
            if ($from->{$key} === null) {
                return null;
            }
            $query->where(current($this->key_to), $from->{$key});
            next($this->key_to);
        }

        foreach (\Arr::get($this->conditions, 'where', array()) as $key => $condition) {
            is_array($condition) or $condition = array($key, '=', $condition);
            $query->where($condition);
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
        $context_to = \DB::expr(\DB::quote($context_to));

        $query->order_by(DB::expr($this->column_context_to.' = '.$context_to), 'DESC');
        $query->order_by($this->column_context_is_main_to, 'DESC');

        return $query->get_one();
    }

    public function join($alias_from, $rel_name, $alias_to_nr, $conditions = array())
    {
        if (!$this->column_context_to) {
            return parent::join($alias_from, $rel_name, $alias_to_nr, $conditions);
        }

        $alias_to = 't'.$alias_to_nr;

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
            $rel_name_main => array(
                'model' => $this->model_to,
                'connection' => call_user_func(array($this->model_to, 'connection')),
                'table' => array(call_user_func(array($this->model_to, 'table')), $alias_to_main),
                'primary_key' => null,
                'join_type' => \Arr::get($conditions, 'join_type') ? : \Arr::get($this->conditions, 'join_type', 'left'),
                'join_on' => array(),
                'columns' => array(),
                'rel_name' => strpos($rel_name_main, '.') ? substr($rel_name_main, strrpos($rel_name_main, '.') + 1) : $rel_name_main,
                'relation' => $this,
                'where' => \Arr::get($conditions, 'where', array()),
                'order_by' => \Arr::get($conditions, 'order_by') ? : \Arr::get($this->conditions, 'order_by', array()),
            ),
            $rel_name_context => array(
                'model' => null,
                'connection' => call_user_func(array($this->model_to, 'connection')),
                'table' => array(call_user_func(array($this->model_to, 'table')), $alias_to_context),
                'primary_key' => null,
                'join_type' => \Arr::get($conditions, 'join_type') ? : \Arr::get($this->conditions, 'join_type', 'left'),
                'join_on' => array(),
                'columns' => array(),
                'rel_name' => (strpos($rel_name_context, '.') ? substr($rel_name_context, strrpos($rel_name_context, '.') + 1) : $rel_name_context),
                'relation' => $this,
                'where' => \Arr::get($conditions, 'where', array()),
                'order_by' => \Arr::get($conditions, 'order_by') ? : \Arr::get($this->conditions, 'order_by', array()),
            ),
        );

        reset($this->key_to);
        foreach ($this->key_from as $key) {
            $models[$rel_name_main]['join_on'][] = array($alias_from.'.'.$key, '=', $alias_to_main.'.'.current($this->key_to));
            $models[$rel_name_context]['join_on'][] = array($alias_to_context.'.'.current($this->key_to), '=', $alias_from.'.'.$key);
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
                !is_array($condition) and $condition = array($key, '=', $condition);
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
