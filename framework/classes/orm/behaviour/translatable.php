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

class Orm_Behaviour_Translatable extends Orm_Behaviour
{
    /**
     * site_property
     * common_id_property
     * is_main_property
     * invariant_fields
     * default_site
     */
    protected $_properties = array();

    /**
     * Fill in the site_common_id and site properties when creating the object
     *
     * @param   Model  The object
     * @return void
     */
    public function before_insert(\Nos\Orm\Model $item)
    {
        $common_id_property = $this->_properties['common_id_property'];
        $site_property      = $this->_properties['site_property'];

        if (empty($item->{$common_id_property})) {
            $item->set($common_id_property, 0);
        }
        if (empty($item->{$site_property})) {
            // @todo: decide whether we force a site or we use NULL instead
            $item->set($site_property, \Arr::get($this->_properties, 'default_site', \Config::get('default_site', 'en_GB')));
        }
    }
    /**
     * Updates the site_common_id property
     * @param  Model $item
     * @return void
     */
    public function after_insert(\Nos\Orm\Model $item)
    {
        $common_id_property = $this->_properties['common_id_property'];
        $is_main_property = $this->_properties['is_main_property'];

        // It's a new main site
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
     * Copies all invariant fields from the main site
     *
     * @param Model $item
     */
    public function before_save(\Nos\Orm\Model $item)
    {
        if ($this->is_main_site($item) || $item->is_new()) {
            return;
        }
        $obj_main = $this->find_main_site($item);

        // No main site found => we just created a new main item :)
        if (empty($obj_main)) {
            $item->set($this->_properties['is_main_property'], true);
        } else {
            // The main site exists => update the common properties
            foreach ($this->_properties['invariant_fields'] as $invariant) {
                $item->set($invariant, $obj_main->get($invariant));
            }
        }
    }

    public function after_delete(\Nos\Orm\Model $item)
    {
        if (!$this->is_main_site($item)) {
            return;
        }

        $available_sites = $item->get_all_site();

        // Set the is_main property for one of the site
        foreach (\Config::get('sites') as $code => $name) {
            if (in_array($code, $available_sites)) {
                $new_main_item = $this->find_site($item, $code);
                $new_main_item->set($this->_properties['is_main_property'], true);
                $new_main_item->save();
                break;
            }
        }
    }

    /**
     * Check if the parent exists in all the siteages of the child
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

        $sites_parent = $new_parent->get_all_site();

        if ($item->is_new()) {
            $site_self = $item->get_site();
            if (!in_array($site_self, $sites_parent)) {
                throw new \Exception(strtr(__('Cannot create this element here because the parent does not exists in {site}.'), array(
                    '{site}' => $site_self,
                )));
            }
        } else {
            $sites_self= $this->get_all_site($item);

            $missing_sites = array_diff($sites_self, $sites_parent);
            if (!empty($missing_sites)) {
                throw new \Exception(strtr(__('Cannot move this element here because the parent does not exists in the following sites: {sites}'), array(
                    '{sites}' => implode(', ', $missing_sites),
                )));
            }
        }

        static $in_progress = array();

        // Prevents looping in the observer
        $items = $this->find_site($item, 'all');
        if (in_array($item->id, $in_progress)) {
            return;
        }
        $in_progress = array_keys($items);

        // This event has been sent from the tree behaviour, so we don't need to check it exists
        $new_parent = $item->get_parent();

        foreach ($items as $item) {
            $parent = $new_parent === null ? null : $new_parent->find_site($item->get_site());
            $item->set_parent($parent);

            $item->save();
        }
        $in_progress = array();
    }

    /**
     * Optimised operation for deleting all sites
     *
     * @param \Nos\Orm\Model $item
     */
    public function delete_all_site($item)
    {
        foreach ($item->find_site('all') as $item) {
            // This is to trick the is_main_site() method
            // This way, the 'after_delete' observer won't reassign is_main
            $item->set($this->_properties['is_main_property'], false);
            $item->delete();
        }
    }

    /**
     * Returns null if the Model is not translatable. Returns true or false whether the object is in the main site.
     *
     * @return bool
     */
    public function is_main_site($item)
    {
        // use !! for cast to boolean
        return !!$item->get($this->_properties['is_main_property']);
    }

    /**
     * Find the object in the main site
     *
     * @return \Nos\Model
     */
    public function find_main_site($item)
    {
        return $item->find_site('main');
    }

    /**
     * Find the object in the specified locale. Won't create it when it doesn't exists
     *
     * @param string | true $site Which locale to retrieve.
     *  - 'main' will return the main site
     *  - 'all'  will return all the available objects
     *  - any valid locale
     */
    public function find_site($item, $site = null)
    {
        $common_id_property = $this->_properties['common_id_property'];
        $common_id          = $item->get($common_id_property);

        if ($site == 'all') {
            return $item->find('all', array(
                'where' => array(
                    array($common_id_property, $common_id),
                ),
            ));
        }

        return $item->find('first', array(
            'where' => array(
                array($common_id_property, $common_id),
                $site === 'main' ? array($this->_properties['is_main_property'], true) : array($this->_properties['site_property'], $site),
            )));
    }

    /**
     * Returns all other available locale for this object
     *
     * @return array
     */
    public function get_all_site($item)
    {
        $all = array();
        foreach ($item->find_site('all') as $item) {
            $all[$item->id] = $item->get($this->_properties['site_property']);
        }

        return $all;
    }

    /**
     * Returns the locale of the current object
     *
     * @return string
     */
    public function get_site($item)
    {
        return $item->get($this->_properties['site_property']);
    }

    /**
     * Returns all other available locale for this object
     *
     * @return array
     */
    public function get_other_site($item)
    {
        $current_site = $item->get_site();
        $all = $this->get_all_site($item);
        foreach ($all as $k => $site) {
            if ($site == $current_site) {
                unset($all[$k]);
            }
        }

        return $all;
    }

    public function form_fieldset_fields($item, &$fieldset)
    {
        $site_property = $this->_properties['site_property'];
        // Empty array just so the data are retrieved from the input
        if (isset($fieldset[$site_property])) {
            $fieldset[$site_property]['dont_populate'] = true;
        }
    }

    /**
     * Returns all available sites for the requested items
     *
     * @param  array $where
     * @return array List of available sites for each is_main
     */
    public function sites($where)
    {
        $common_id_property = $this->_properties['common_id_property'];
        $site_property = $this->_properties['site_property'];
        $properties = array(
            array($common_id_property, $common_id_property),
            array(\Db::expr('GROUP_CONCAT('.$site_property.')'), 'list_site'),
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
            $data[$row[$common_id_property]] = $row['list_site'];
        }

        return $data;
    }

    public function before_query(&$options)
    {
        if (array_key_exists('where', $options)) {
            $where = $options['where'];
            foreach ($where as $k => $w) {
                if ($w[0] == 'site_main') {
                    if ($w[1] == true) {
                        $where[$k] = array($this->_properties['is_main_property'], true);
                    } elseif ($w[1] == false) {
                        $where[$k] = array($this->_properties['is_main_property'], false);
                    }
                }
                if ($w[0] == 'site') {
                    if (! is_array($w[1])) {
                        $where[$k] = array($this->_properties['site_property'], '=', $w[1]);
                    } elseif (count($w[1])) {
                        $where[$k] = array($this->_properties['site_property'], 'IN', $w[1]);
                    }
                }
            }
            $options['where'] = $where;
        }
    }
}
