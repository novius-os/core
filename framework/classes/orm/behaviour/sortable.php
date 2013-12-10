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

class Orm_Behaviour_Sortable extends Orm_Behaviour
{
    /**
     * sort_property
     */
    protected $_properties = array();

    protected $_sort_change = array();

    public function before_query(&$options)
    {
        $options['before_order_by']['default_sort'] = $this->_properties['sort_property'];
    }

    /**
     * Sets a new parent for the object
     *
     * @param \Nos\Orm\Model $item The parent object
     * @param float $before
     */
    public function move_before(Orm\Model $item, $before = null)
    {
        $this->_move($item, $before->get_sort() - 0.5);
    }

    public function move_after($item, $before = null)
    {
        $this->_move($item, $before->get_sort() + 0.5);
    }

    public function move_to_last_position($item)
    {
        $this->_move($item, 10000);
    }

    public function get_sort(\Nos\Orm\Model $item)
    {
        $sort_property = $this->_properties['sort_property'];

        return $item->get($sort_property);
    }

    public function set_sort(\Nos\Orm\Model $item, $sort)
    {
        $sort_property = $this->_properties['sort_property'];
        $item->set($sort_property, $sort);
    }

    protected function _move($item, $sort)
    {
        $this->set_sort($item, $sort);
        $item->save();
    }

    public function before_insert(\Nos\Orm\Model $item)
    {
        $sort_property = $this->_properties['sort_property'];
        if (empty($item->{$sort_property})) {
            $twinnable = $item->behaviours('Nos\Orm_Behaviour_Twinnable');
            if (!empty($twinnable)) {
                if (!empty($item->{$twinnable['common_id_property']})) {
                    $obj_main = $item->find_main_context();
                    $item->{$sort_property} = $obj_main->{$sort_property};
                    return;
                }
            }

            $tree = $item->behaviours('Nos\Orm_Behaviour_Tree');
            $conditions = array();
            if (!empty($tree)) {
                $conditions[] = array('parent', $item->get_parent());
            }
            $last = $item::find('first', array(
                'where' => $conditions,
                'order_by' => array($this->_properties['sort_property'] => 'DESC')
            ));
            if (!empty($last)) {
                $item->{$sort_property} = $last->{$sort_property} + 1;
            } else {
                $item->{$sort_property} = 1;
            }
        }
    }


    public function before_save(\Nos\Orm\Model $item)
    {
        if ($item->is_new()) {
            return;
        }

        $sort_property = $this->_properties['sort_property'];
        if ($item->is_changed($sort_property)) {
            $this->_sort_change[$item::implode_pk($item)] = true;
        }
    }

    public function after_save(\Nos\Orm\Model $item)
    {
        if (isset($this->_sort_change[$item::implode_pk($item)])) {
            unset($this->_sort_change[$item::implode_pk($item)]);
            $sort_property = $this->_properties['sort_property'];
            $twinnable = $item->behaviours('Nos\Orm_Behaviour_Twinnable');
            $contextable = $item->behaviours('Nos\Orm_Behaviour_Contextable');
            if (!empty($twinnable) && !$item->is_main_context()) {
                $obj_main = $item->find_main_context();
                $obj_main->set($sort_property, $item->get($sort_property));
                $obj_main->save();
                return;
            }

            $item->observe('before_sort');

            $tree = $item->behaviours('Nos\Orm_Behaviour_Tree');
            $params = array(
                'order_by' => array($sort_property => 'ASC'),
            );
            if (!empty($tree)) {
                $parent = $item->get_parent();
                if (!empty($twinnable)) {
                    if (!empty($parent)) {
                        $parents = $item::find('all', array(
                            'where' => array(
                                array($twinnable['common_id_property'], $parent->{$twinnable['common_id_property']}),
                            ),
                        ));
                        $parents_id = array_keys($parents);
                        $params['where'] =  array(
                            array($item->parent_relation()->key_from[0], 'IN', $parents_id),
                            array($twinnable['is_main_property'], true),
                        );
                    } else {
                        $params['where'] = array(
                            array('parent', $parent),
                            array($twinnable['is_main_property'], true),
                        );
                    }
                } else {
                    $params['where'] = array(array('parent', $parent));
                    if (!empty($contextable)) {
                        $params['where'][] = array($contextable['context_property'], $item->{$contextable['context_property']});
                    }
                }
            } else {
                if (!empty($twinnable)) {
                    $params['where'] = array(array($twinnable['is_main_property'], true));
                } elseif (!empty($contextable)) {
                    $params['where'] = array(array($contextable['context_property'], $item->{$contextable['context_property']}));
                }
            }
            $unsorted = $item::find('all', $params);
            $i = 1;
            $pk = \Arr::get($item->primary_key(), 0);
            foreach ($unsorted as $u) {
                if (!empty($twinnable)) {
                    $item::query()->set($sort_property, $i)->where($twinnable['common_id_property'], $u->{$twinnable['common_id_property']})->update();
                } else {
                    $item::query()->set($sort_property, $i)->where($pk, $u->{$pk})->update();
                }
                $i++;
            }

            $item->observe('after_sort');
        }
    }
}
