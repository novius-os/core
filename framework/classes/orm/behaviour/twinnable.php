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

class Orm_Behaviour_Twinnable extends Orm_Behaviour_Contextable
{
    public static function _init()
    {
        I18n::current_dictionary('nos::orm');
    }

    /**
     * common_id_property
     * is_main_property
     * invariant_fields
     */
    protected $_properties = array();

    /**
     * Fill in the context_common_id and context properties when creating the object
     *
     * @param Orm\Model $item
     * @internal param \Nos\The $Model object
     * @return void
     */
    public function before_insert(\Nos\Orm\Model $item)
    {
        $common_id_property = $this->_properties['common_id_property'];

        if (empty($item->{$common_id_property})) {
            $item->set($common_id_property, 0);
        }
    }

    /**
     * Updates the context_common_id property
     *
     * @param \Nos\Orm\Model $item
     * @return void
     */
    public function after_insert(\Nos\Orm\Model $item)
    {
        $common_id_property = $this->_properties['common_id_property'];
        $is_main_property = $this->_properties['is_main_property'];

        // It's a new main context
        if ($item->get($common_id_property) == 0) {
            // __get() magic method will retrieve $_primary_key[0]
            $item->set($common_id_property, $item->id);
            $item->set($is_main_property, true);

            $update = \DB::update($item->table())->set(array(
                $common_id_property => $item->id,
                $is_main_property => true,
            ));
            foreach ($item->primary_key() as $pk) {
                $update->where($pk, $item->get($pk));
            }
            $update->execute();

            // Database was updated using DB directly, because save() triggers all the observers, and we don't need that
            // $item->save();
        }
    }

    /**
     * Copies all invariant fields from the main context
     *
     * @param \Nos\Orm\Model $item
     */
    public function before_save(\Nos\Orm\Model $item)
    {
        if ($this->is_main_context($item) || $item->is_new()) {
            return;
        }
        $obj_main = $this->find_main_context($item);

        // No main context found => we just created a new main item :)
        if (empty($obj_main)) {
            $item->set($this->_properties['is_main_property'], true);
        } else {
            // The main context exists => update the common properties
            foreach ($this->_properties['invariant_fields'] as $invariant) {
                $item->set($invariant, $obj_main->get($invariant));
            }
        }
    }

    public function after_delete(\Nos\Orm\Model $item)
    {
        if (!$this->is_main_context($item)) {
            return;
        }

        $available_contexts = $item->get_all_context();

        // Set the is_main property for one of the context
        foreach (Tools_Context::contexts() as $code => $name) {
            if (in_array($code, $available_contexts)) {
                $new_main_item = $this->find_context($item, $code);
                $new_main_item->set($this->_properties['is_main_property'], true);
                $new_main_item->save();
                break;
            }
        }
    }

    /**
     * Check if the parent exists in all the contexts of the child
     * @param \Nos\Orm\Model $item
     * @throws \Exception
     */
    public function change_parent(\Nos\Orm\Model $item)
    {
        // This event has been sent from the tree behaviour, so we don't need to check the method exists
        $new_parent = $item->get_parent();

        if (!empty($new_parent)) {
            $contexts_parent = $new_parent->get_all_context();

            if ($item->is_new()) {
                $context_self = $item->get_context();
                if (!in_array($context_self, $contexts_parent)) {
                    throw new \Exception(strtr(__('We’re afraid it cannot be added to {{context}} because its parent is not available in this context yet.'), array(
                        '{{context}}' => \Nos\Tools_Context::contextLabel($context_self),
                    )));
                }
            } else {
                $contexts_self = $this->get_all_context($item);

                $missing_contexts = array_diff($contexts_self, $contexts_parent);
                if (!empty($missing_contexts)) {
                    throw new \Exception(strtr(__('We’re afraid it cannot be moved here because the parent is not available in the following contexts: {{contexts}}'), array(
                        '{{contexts}}' => implode(', ', array_map(function($context) {
                                return \Nos\Tools_Context::contextLabel($context);

                        }, $missing_contexts)),
                    )));
                }
            }
        }

        $item->observe('check_change_parent');

        static $in_progress_check = array();

        // Prevents looping in the observer
        $items = $this->find_other_context($item);
        if (!in_array($item->id, $in_progress_check)) {
            $in_progress_check = array_keys($items);

            foreach ($items as $it) {
                $parent = $new_parent === null ? null : $new_parent->find_context($it->get_context());
                $it->set_parent($parent);
                $it->observe('check_change_parent');
            }
            $in_progress_check = array();
        }

        foreach ($items as $it) {
            $it->save();
        }
    }

    /**
     * Optimised operation for deleting all contexts
     *
     * @param \Nos\Orm\Model $item
     */
    public function delete_all_context(\Nos\Orm\Model $item)
    {
        foreach ($item->find_context('all') as $item) {
            // This is to trick the is_main_context() method
            // This way, the 'after_delete' observer won't reassign is_main
            $item->set($this->_properties['is_main_property'], false);
            $item->delete();
        }
    }

    /**
     * Returns null if the Model is not twinnable. Returns true or false whether the object is in the main context.
     *
     * @param \Nos\Orm\Model $item
     * @return bool
     */
    public function is_main_context(\Nos\Orm\Model $item)
    {
        // use !! for cast to boolean
        return !!$item->get($this->_properties['is_main_property']);
    }

    /**
     * Find the object in the main context
     *
     * @param \Nos\Orm\Model $item
     * @return \Nos\Orm\Model
     */
    public function find_main_context(\Nos\Orm\Model $item)
    {
        return $item->find_context('main');
    }

    /**
     * Find the object in the specified context. Won't create it when it doesn't exists
     *
     * @param \Nos\Orm\Model $item
     * @param string | array $context Which locale to retrieve.
     *  - 'main' will return the main context
     *  - 'all'  will return all the available objects
     *  - any valid locale
     *  - array  if not empty, return only contexts specified
     * @return \Nos\Orm\Model | array(\Nos\Orm\Model)
     */
    public function find_context(\Nos\Orm\Model $item, $context)
    {
        $common_id_property = $this->_properties['common_id_property'];
        $common_id          = $item->get($common_id_property);

        if ($context == 'all' || is_array($context)) {
            $where = array(
                array($common_id_property, $common_id),
            );
            if (is_array($context) && !empty($context)) {
                $where[] = array($this->_properties['context_property'], 'IN', $context);
            }
            return $item->find('all', array('where' => $where));
        }

        return $item->find('first', array(
            'where' => array(
                array($common_id_property, $common_id),
                $context === 'main' ? array($this->_properties['is_main_property'], true) : array($this->_properties['context_property'], $context),
            )));
    }

    /**
     * Find objects in other context that the item
     *
     * @param \Nos\Orm\Model $item
     * @param array $filter if not empty, return only contexts specified
     * @return array(\Nos\Orm\Model)
     */
    public function find_other_context(\Nos\Orm\Model $item, array $filter = array())
    {
        $common_id_property = $this->_properties['common_id_property'];
        $common_id          = $item->get($common_id_property);

        $where = array(
            array($common_id_property, $common_id),
            array($this->_properties['context_property'], '!=', $item->get_context()),
        );
        if (!empty($filter)) {
            $where[] = array($this->_properties['context_property'], 'IN', $filter);
        }
        return $item->find('all', array('where' => $where));
    }

    /**
     * Returns all available context for this object
     *
     * @param \Nos\Orm\Model $item
     * @param array $filter if not empty, return only contexts specified
     * @return array
     */
    public function get_all_context(\Nos\Orm\Model $item, array $filter = array())
    {
        $all = array();
        foreach ($item->find_context($filter) as $item) {
            $context = $item->get($this->_properties['context_property']);
            $all[$item->id] = $context;
        }

        return $all;
    }

    /**
     * Returns all other available context for this object
     *
     * @param \Nos\Orm\Model $item
     * @param array $filter if not empty, return only contexts specified
     * @return array
     */
    public function get_other_context(\Nos\Orm\Model $item, array $filter = array())
    {
        $other = array();
        foreach ($item->find_other_context($filter) as $item) {
            $context = $item->get($this->_properties['context_property']);
            $other[$item->id] = $context;
        }

        return $other;
    }

    /**
     * Returns all available contexts for the requested items
     *
     * @param  array $where
     * @return array List of available contexts for each is_main
     */
    public function contexts($where)
    {
        $common_id_property = $this->_properties['common_id_property'];
        $context_property = $this->_properties['context_property'];
        $properties = array(
            array($common_id_property, $common_id_property),
            array(\Db::expr('GROUP_CONCAT('.$context_property.')'), 'list_context'),
        );

        $query = call_user_func_array('\Db::select', $properties)
                 ->from(call_user_func($this->_class . '::table'))
                 ->group_by($common_id_property);

        foreach ($where as $field_name => $value) {
            if (!empty($value)) {
                if (is_array($value)) {
                    $query->where($field_name, 'in', $value);
                } else {
                    $query->where($field_name, '=', $value);
                }
            }
        }
        $data = array();
        foreach ($query->execute() as $row) {
            $data[$row[$common_id_property]] = $row['list_context'];
        }

        return $data;
    }

    public function before_query(&$options)
    {
        if (array_key_exists('where', $options)) {
            $where = $options['where'];
            if (isset($where['context_main'])) {
                $where[$this->_properties['is_main_property']] = $where['context_main'];
                unset($where['context_main']);
            }

            foreach ($where as $k => $w) {
                if (is_int($k)) {
                    $keys = array_keys($w);
                    if (count($w) == 1 && $keys[0] == 'context_main') {
                        $where[$k] = array($this->_properties['is_main_property'] => $w[$keys[0]]);
                    }

                    if (count($w) > 1 && $w[0] == 'context_main') {
                        $w[0] = $this->_properties['is_main_property'];
                        $where[$k] = $w;
                    }
                }
            }
            $options['where'] = $where;
        }
    }
}
