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
