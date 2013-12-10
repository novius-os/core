<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Orm;

\Package::load('orm');

class Query extends \Orm\Query
{
    protected $before_where = array();

    protected $before_order_by = array();

    /**
     * Create a new instance of the Query class.
     *
     * @param	string  $model        Name of the model this instance has to operate on
     * @param	mixed   $connection   DB connection to use to run the query
     * @param	array   $options      Any options to pass on to the query
     * @param	mixed   $table_alias  Optionally, the alias to use for the models table
     */
    protected function __construct($model, $connection, $options, $table_alias = null)
    {
        foreach ($options as $opt => $val) {
            switch ($opt) {
                case 'before_where':
                    $val = (array) $val;
                    $this->before_where = $val;
                    break;

                case 'before_order_by':
                    $val = (array) $val;
                    $this->before_order_by = $val;
                    break;
            }
        }

        parent::__construct($model, $connection, $options, $table_alias);
    }

    /**
     * Does the work for where() and or_where()
     *
     * @param   array   $condition
     * @param   string  $type
     *
     * @throws \FuelException
     *
     * @return  $this
     */
    public function _where($condition, $type = 'and_where')
    {
        // Only check before_where if $condition is a single condition
        if (!is_array(reset($condition)) && !is_string(key($condition))) {
            if (is_string($condition[0]) && $replace = \Arr::get($this->before_where, $condition[0], false)) {
                if (is_callable($replace)) {
                    $condition = $replace($condition);
                    if (empty($condition)) {
                        return $this;
                    }
                    if (\Arr::is_assoc($condition) || is_array(reset($condition))) {
                        $this->_parse_where_array($condition);
                        return $this;
                    }
                } else {
                    $condition[0] = $replace;
                }
            }
        }

        return parent::_where($condition, $type);
    }

    /**
     * Set the order_by
     *
     * @param   string|array  $property
     * @param   string        $direction
     *
     * @return  $this
     */
    public function order_by($property, $direction = 'ASC')
    {
        if (!is_array($property)) {
            if (is_string($property) && $replace = \Arr::get($this->before_order_by, $property, false)) {
                if (is_callable($replace)) {
                    $property = $replace($property);
                    if (empty($property)) {
                        return $this;
                    }
                } else {
                    $property = $replace;
                }
            }
        }

        return parent::order_by($property, $direction);
    }

    public function _join_relation($relation_name, &$infos)
    {
        static $count = 99;
        $relation = call_user_func($this->model.'::relations', $relation_name);
        // Ask the relation to generate the join for us
        $joins = (array) $relation->join($this->alias, $relation_name, $count);
        // Keep only the relevant part
        foreach ($joins as $join) {
            $join = array_intersect_key($join, array(
                'table' => true,
                'join_type' => true,
                'join_on' => true,
            ));
            $this->_join($join);
        }

        $infos = array(
            'alias_from' => $this->alias,
            'alias_to'   => $join['table'][1],
        );
        $count--;
        return $this;
    }

    public function alias()
    {
        return $this->alias;
    }

    public function connection()
    {
        return $this->connection;
    }

    public function model()
    {
        return $this->model;
    }

    public function hydrate(&$row, $models, &$result, $model = null, $select = null, $primary_key = null)
    {
        $alias = false;
        foreach ($primary_key as $alias => $pk) {
            if (!is_int($alias)) {
                $alias = true;
                break;
            }
        }
        if ($alias) {
            foreach ($select as $i => $s) {
                if ($s[0] instanceof \Database_Expression) {
                    $f = substr($s[1], 0, strpos($s[1], '_')).'.'.substr($s[1], strpos($s[1], '_') + 1);
                    $select[$i][0] = $f;
                }
            }
        }

        return parent::hydrate($row, $models, $result, $model, $select, $primary_key);
    }
}
