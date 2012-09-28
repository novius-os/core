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

class Orm_Behaviour_Contextable extends Orm_Behaviour
{
    /**
     * context_property
     * common_id_property
     * is_main_property
     * invariant_fields
     * default_context
     */
    protected $_properties = array();

    /**
     * Fill in the context_common_id and context properties when creating the object
     *
     * @param   Model  The object
     * @return void
     */
    public function before_insert(\Nos\Orm\Model $item)
    {
        $common_id_property = $this->_properties['common_id_property'];
        $context_property      = $this->_properties['context_property'];

        if (empty($item->{$common_id_property})) {
            $item->set($common_id_property, 0);
        }
        if (empty($item->{$context_property})) {
            // @todo: decide whether we force a context or we use NULL instead
            $item->set($context_property, \Arr::get($this->_properties, 'default_context', \Config::get('default_context', 'en_GB')));
        }
    }
    /**
     * Updates the context_common_id property
     * @param  Model $item
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

            // Database were updated using DB directly, because save() triggers all the observers, and we don't need that
            // $item->save();
        }
    }

    /**
     * Copies all invariant fields from the main context
     *
     * @param Model $item
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
        foreach (\Config::get('contexts') as $code => $name) {
            if (in_array($code, $available_contexts)) {
                $new_main_item = $this->find_context($item, $code);
                $new_main_item->set($this->_properties['is_main_property'], true);
                $new_main_item->save();
                break;
            }
        }
    }

    /**
     * Check if the parent exists in all the contextages of the child
     * @param \Nos\Orm\Model $item
     */
    public function change_parent(\Nos\Orm\Model $item)
    {
        // This event has been sent from the tree behaviour, so we don't need to check the method exists
        $new_parent = $item->get_parent();

        // Parent was removed, it's ok
        if (null === $new_parent) {
            return;
        }

        $contexts_parent = $new_parent->get_all_context();

        if ($item->is_new()) {
            $context_self = $item->get_context();
            if (!in_array($context_self, $contexts_parent)) {
                throw new \Exception(strtr(__('Cannot create this element here because the parent does not exists in {context}.'), array(
                    '{context}' => $context_self,
                )));
            }
        } else {
            $contexts_self= $this->get_all_context($item);

            $missing_contexts = array_diff($contexts_self, $contexts_parent);
            if (!empty($missing_contexts)) {
                throw new \Exception(strtr(__('Cannot move this element here because the parent does not exists in the following contexts: {contexts}'), array(
                    '{contexts}' => implode(', ', $missing_contexts),
                )));
            }
        }

        static $in_progress = array();

        // Prevents looping in the observer
        $items = $this->find_context($item, 'all');
        if (in_array($item->id, $in_progress)) {
            return;
        }
        $in_progress = array_keys($items);

        // This event has been sent from the tree behaviour, so we don't need to check it exists
        $new_parent = $item->get_parent();

        foreach ($items as $item) {
            $parent = $new_parent === null ? null : $new_parent->find_context($item->get_context());
            $item->set_parent($parent);

            $item->save();
        }
        $in_progress = array();
    }

    /**
     * Optimised operation for deleting all contexts
     *
     * @param \Nos\Orm\Model $item
     */
    public function delete_all_context($item)
    {
        foreach ($item->find_context('all') as $item) {
            // This is to trick the is_main_context() method
            // This way, the 'after_delete' observer won't reassign is_main
            $item->set($this->_properties['is_main_property'], false);
            $item->delete();
        }
    }

    /**
     * Returns null if the Model is not contextable. Returns true or false whether the object is in the main context.
     *
     * @return bool
     */
    public function is_main_context($item)
    {
        // use !! for cast to boolean
        return !!$item->get($this->_properties['is_main_property']);
    }

    /**
     * Find the object in the main context
     *
     * @return \Nos\Model
     */
    public function find_main_context($item)
    {
        return $item->find_context('main');
    }

    /**
     * Find the object in the specified locale. Won't create it when it doesn't exists
     *
     * @param string | true $context Which locale to retrieve.
     *  - 'main' will return the main context
     *  - 'all'  will return all the available objects
     *  - any valid locale
     */
    public function find_context($item, $context = null)
    {
        $common_id_property = $this->_properties['common_id_property'];
        $common_id          = $item->get($common_id_property);

        if ($context == 'all') {
            return $item->find('all', array(
                'where' => array(
                    array($common_id_property, $common_id),
                ),
            ));
        }

        return $item->find('first', array(
            'where' => array(
                array($common_id_property, $common_id),
                $context === 'main' ? array($this->_properties['is_main_property'], true) : array($this->_properties['context_property'], $context),
            )));
    }

    /**
     * Returns all other available locale for this object
     *
     * @return array
     */
    public function get_all_context($item)
    {
        $all = array();
        foreach ($item->find_context('all') as $item) {
            $all[$item->id] = $item->get($this->_properties['context_property']);
        }

        return $all;
    }

    /**
     * Returns the locale of the current object
     *
     * @return string
     */
    public function get_context($item)
    {
        return $item->get($this->_properties['context_property']);
    }

    /**
     * Returns all other available locale for this object
     *
     * @return array
     */
    public function get_other_context($item)
    {
        $current_context = $item->get_context();
        $all = $this->get_all_context($item);
        foreach ($all as $k => $context) {
            if ($context == $current_context) {
                unset($all[$k]);
            }
        }

        return $all;
    }

    public function form_fieldset_fields($item, &$fieldset)
    {
        $context_property = $this->_properties['context_property'];
        // Empty array just so the data are retrieved from the input
        if (isset($fieldset[$context_property])) {
            $fieldset[$context_property]['dont_populate'] = true;
        }
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
            foreach ($where as $k => $w) {
                if ($w[0] == 'context_main') {
                    if ($w[1] == true) {
                        $where[$k] = array($this->_properties['is_main_property'], true);
                    } elseif ($w[1] == false) {
                        $where[$k] = array($this->_properties['is_main_property'], false);
                    }
                }
                if ($w[0] == 'context') {
                    if (! is_array($w[1])) {
                        $where[$k] = array($this->_properties['context_property'], '=', $w[1]);
                    } elseif (count($w[1])) {
                        $where[$k] = array($this->_properties['context_property'], 'IN', $w[1]);
                    }
                }
            }
            $options['where'] = $where;
        }
    }
}
