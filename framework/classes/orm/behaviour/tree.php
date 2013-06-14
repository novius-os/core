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

class Orm_Behaviour_Tree extends Orm_Behaviour
{
    public static function _init()
    {
        I18n::current_dictionary('nos::orm');
    }

    protected $_parent_relation = null;
    protected $_children_relation = null;

    /**
     * parent_relation
     * children_relation
     */
    protected $_properties = array();

    public function __construct($class)
    {
        parent::__construct($class);
        $this->_parent_relation = call_user_func($class . '::relations', $this->_properties['parent_relation']);
        $this->_children_relation = call_user_func($class . '::relations', $this->_properties['children_relation']);

        if (false === $this->_parent_relation) {
            throw new \Exception('Relation "parent" not found by tree behaviour: '.$this->_class);
        }

        if (false === $this->_children_relation) {
            throw new \Exception('Relation "children" not found by tree behaviour: '.$this->_class);
        }
    }

    public function parent_relation()
    {
        return $this->_parent_relation;
    }

    public function before_query(&$options)
    {
        if (array_key_exists('where', $options)) {
            $where = $options['where'];
            foreach ($where as $k => $w) {
                if (isset($w[0])  && $w[0] == 'parent') {
                    $property = $this->_parent_relation->key_from[0];
                    if ($w[1] === null) {
                        $where[$k] = array($property, 'IS', null);
                    } else {
                        $id = $w[1]->id;
                        if (empty($id)) {
                            unset($where[$k]);
                        } else {
                            $where[$k] = array($property, $id);
                        }
                    }
                }
            }
            $options['where'] = $where;
        }
    }

    /**
     * Deletes all the children of the item (recursively)
     * (will only affect the current context, by design)
     *
     * @param \Nos\Orm\Model $item
     */
    public function before_delete(\Nos\Orm\Model $item)
    {
        foreach ($this->find_children($item) as $child) {
            $child->delete();
        }
        // Reset the relation, since we deleted the children manually
        unset($item->{$this->_properties['children_relation']});
    }
    /**
     * Returns all the direct children of the object
     *
     * @param  \Nos\Orm\Model $item
     * @param  array          $where
     * @param  array          $order_by
     * @param  array          $options
     * @return array(\Nos\Orm\Model)
     */
    public function find_children($item, $where = array(), $order_by = array(), $options = array())
    {
        // Search items whose parent is self
        $where[] = array('parent', $item);
        $options = \Arr::merge($options, array(
            'where'    => $where,
            'order_by' => $order_by,
        ));

        return $item::find('all', $options);
    }

    /**
     * return the parent of the object
     *
     * @param \Nos\Orm\Model $item
     * @return \Nos\Orm\Model The parent object
     */
    public function get_parent($item)
    {
        return $item->get($this->_properties['parent_relation']);
    }

    /**
     * Sets a new parent for the object
     *
     * @param \Nos\Orm\Model $item
     * @param \Nos\Orm\Model The parent object
     * @throws \Exception
     * @return void
     */
    public function set_parent(Orm\Model $item, $parent = null)
    {
        if ($parent !== null) {
            // Check if the object is appropriate
            if (get_class($parent) != $this->_parent_relation->model_to) {
                throw new \Exception(sprintf('Cannot set "parent" to object of type %s in tree behaviour (expected %s): %s',
                        (string) get_class($parent),
                        $this->_parent_relation->model_to,
                        $this->_class
                    ));
            }

            if (!$item->is_new()) {
                $children_ids = $this->get_ids_children($item, true);
                if (in_array($parent->id, $children_ids)) {
                    // Dev details : Cannot move an element inside of its own children
                    throw new \Exception(__('No, it cannot be moved here. Why? Because you cannot put something into itself.'));
                }
            }
        }

        $this->set_parent_no_observers($item, $parent);
        $item->observe('change_parent');
    }

    /**
     * Get the list of all IDs of the children
     *
     * @param  bool  $include_self
     * @return array
     */
    public function get_ids_children($item, $include_self = true)
    {
        $ids = array();
        if ($include_self) {
            $ids[] = $item->get(\Arr::get($item->primary_key(), 0));
        }
        $this->_populate_id_children($item, $this->_properties['children_relation'], $ids);

        return $ids;
    }

    public function find_children_recursive($item, $include_self = true)
    {
        // This is weird, but it doesn't work when called directly...
        $ids = $this->get_ids_children($item, $include_self);
        if (empty($ids)) {
            return array();
        }

        return $item::find('all', array('where' => array(array(\Arr::get($item->primary_key(), 0), 'IN', $ids))));
    }

    protected static function _populate_id_children($current_item, $children_relation, &$array)
    {
        $pk = \Arr::get($current_item->primary_key(), 0);
        foreach ($current_item->get($children_relation) as $child) {
            $array[] = $child->get($pk);
            static::_populate_id_children($child, $children_relation, $array);
        }

    }

    public function find_root($item)
    {
        $parent = $item;
        while (!empty($parent)) {
            $root = $parent;
            $parent = $this->get_parent($parent);
        }

        return $root !== $item ? $root : null;
    }

    public function set_parent_no_observers($item, $parent = null)
    {
        foreach ($this->_parent_relation->key_from as $i => $k) {
            $item->set($k, $parent === null ? null : $parent->get($this->_parent_relation->key_to[$i]));
            $item->set($this->_properties['parent_relation'], $parent);
        }

        if (!empty($this->_properties['level_property'])) {
            $item->{$this->_properties['level_property']} = $parent === null ? 1 : $parent->{$this->_properties['level_property']} + 1;
        }
    }

    public function crudFields(&$fields, $crud)
    {
        if ($crud->behaviours['contextable']) {
            $parent_id = $crud->item->parent_relation()->key_from[0];
            $fields = \Arr::merge(
                $fields,
                array(
                    $parent_id => array(
                        'renderer_options' => array(
                            'context' => $crud->item->{$crud->behaviours['contextable']['context_property']},
                        ),
                    ),
                )
            );
        }
    }
}
