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
     * lang_property
     * common_id_property
     * single_id_property
     * invariant_fields
     * default_lang
     */
    protected $_properties = array();

    /**
     * Fill in the lang_common_id and lang properties when creating the object
     *
     * @param   Model  The object
     * @return  void
     */
    public function before_insert(\Nos\Orm\Model $item)
    {
        $common_id_property = $this->_properties['common_id_property'];
        $lang_property      = $this->_properties['lang_property'];

        if (empty($item->{$common_id_property})) {
            $item->set($common_id_property, 0);
        }
        if (empty($item->{$lang_property})) {
            // @todo: decide whether we force a lang or we use NULL instead
            $item->set($lang_property, \Arr::get($this->_properties, 'default_lang', \Config::get('default_lang', 'en_GB')));
        }
    }
    /**
     * Updates the lang_common_id property
     * @param Model $item
     * @return  void
     */
    public function after_insert(\Nos\Orm\Model $item)
    {
        $common_id_property = $this->_properties['common_id_property'];
        $single_id_property = $this->_properties['single_id_property'];

        // It's a new main language
        if ($item->get($common_id_property) == 0) {
            // __get() magic method will retrieve $_primary_key[0]
            $item->set($common_id_property, $item->id);
            $item->set($single_id_property, $item->id);

            $update = \DB::update($item->table())->set(array(
                $common_id_property => $item->id,
                $single_id_property => $item->id,
            ));
            foreach ($item->primary_key() as $pk) {
                $update->where($pk, $item->get($pk));
            }
            $update->execute();

            // Database were updated using DB directly, because save() triggers all the observers, and we don't need that
            // $item->update() would be better here, because save() triggers all the observers, and we don't need that
            // $item->save();
        }
    }

    /**
     * Copies all invariant fields from the main language
     *
     * @param Model $item
     */
    public function before_save(\Nos\Orm\Model $item)
    {
        if ($this->is_main_lang($item) || $item->is_new()) {
            return;
        }
        $obj_main = $this->find_main_lang($item);

        // No main language found => we just created a new main item :)
        if (empty($obj_main)) {
            $single_property = $this->_properties['single_id_property'];
            $item->set($single_property, $item->id);
        } else {
            // The main language exists => update the common properties
            foreach ($this->_properties['invariant_fields'] as $invariant) {
                $item->set($invariant, $obj_main->get($invariant));
            }
        }
    }

    public function after_delete(\Nos\Orm\Model $item)
    {
        if (!$this->is_main_lang($item)) {
            return;
        }

        $common_property = $this->_properties['common_id_property'];
        $single_property = $this->_properties['single_id_property'];

        $new_common_id = null;
        // Reassign common_id & single_id for other languages
        foreach ($this->find_lang($item, 'all') as $item) {
            if (empty($new_common_id)) {
                $new_common_id = $item->id;
                // This item becomes the new main language
                $item->set($common_property, $new_common_id);
                $item->set($single_property, $new_common_id);
                $item->save();
            } else {
                // This item still is a secondary langauge, but the common_id has been changed
                $item->set($common_property, $new_common_id);
                // single_id is already null
                $item->save();
            }
        }
    }

    /**
     * Check if the parent exists in all the langages of the child
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

        $langs_parent = $new_parent->get_all_lang();

        if ($item->is_new()) {
            $lang_self = $item->get_lang();
            if (!in_array($lang_self, $langs_parent)) {
                throw new \Exception(strtr(__('Cannot create this element here because the parent does not exists in {lang}.'), array(
                    '{lang}' => $lang_self,
                )));
            }
        } else {
            $langs_self= $this->get_all_lang($item);

            $missing_langs = array_diff($langs_self, $langs_parent);
            if (!empty($missing_langs)) {
                throw new \Exception(strtr(__('Cannot move this element here because the parent does not exists in the following langages: {langs}'), array(
                    '{langs}' => implode(', ', $missing_langs),
                )));
            }
        }

        static $in_progress = array();

        // Prevents looping in the observer
        $items = $this->find_lang($item, 'all');
        if (in_array($item->id, $in_progress)) {
            return;
        }
        $in_progress = array_keys($items);

        // This event has been sent from the tree behaviour, so we don't need to check it exists
        $new_parent = $item->get_parent();

        foreach ($items as $item) {
            $parent = $new_parent === null ? null : $new_parent->find_lang($item->get_lang());
            $item->set_parent($parent);

            $item->save();
        }
        $in_progress = array();
    }

    /**
     * Optimised operation for deleting all languages
     *
     * @param  \Nos\Orm\Model  $item
     */
    public function delete_all_lang($item)
    {
        $single_id_property = $this->_properties['common_id_property'];
        foreach ($item->find_lang('all') as $item) {
            // This is to trick the is_main_lang() method
            // This way, the 'after_delete' observer won't reassign single_id & common_id
            $item->set($single_id_property, $item->id);
            $item->delete();
        }
    }

    /**
     * Returns null if the Model is not translatable. Returns true or false whether the object is in the main language.
     *
     * @return  bool
     */
    public function is_main_lang($item)
    {
        return $item->get($this->_properties['single_id_property']) !== null;
    }

    /**
     * Find the object in the main language
     *
     * @return  \Nos\Model
     */
    public function find_main_lang($item)
    {
        return $item->find_lang('main');
    }

    /**
     * Find the object in the specified locale. Won't create it when it doesn't exists
     *
     * @param string | true $lang Which locale to retrieve.
     *  - 'main' will return the main language
     *  - 'all'  will return all the available objects
     *  - any valid locale
     */
    public function find_lang($item, $lang = null)
    {
        $common_id_property = $this->_properties['common_id_property'];
        $common_id          = $item->get($common_id_property);

        if ($lang == 'all') {
            return $item->find('all', array(
                'where' => array(
                    array($common_id_property, $common_id),
                ),
            ));
        }

        return $item->find('first', array(
            'where' => array(
                array($common_id_property, $common_id),
                $lang === 'main' ? array($this->_properties['single_id_property'], $common_id) : array($this->_properties['lang_property'], $lang),
            )));
    }

    /**
     * Returns all other available locale for this object
     *
     * @return array
     */
    public function get_all_lang($item)
    {
        $all = array();
        foreach ($item->find_lang('all') as $item) {
            $all[$item->id] = $item->get($this->_properties['lang_property']);
        }

        return $all;
    }

    /**
     * Returns the locale of the current object
     *
     * @return string
     */
    public function get_lang($item)
    {
        return $item->get($this->_properties['lang_property']);
    }

    /**
     * Returns all other available locale for this object
     *
     * @return array
     */
    public function get_other_lang($item)
    {
        $current_lang = $item->get_lang();
        $all = $this->get_all_lang($item);
        foreach ($all as $k => $lang) {
            if ($lang == $current_lang) {
                unset($all[$k]);
            }
        }

        return $all;
    }

    public function form_fieldset_fields($item, &$fieldset)
    {
        $lang_property = $this->_properties['lang_property'];
        // Empty array just so the data are retrieved from the input
        if (isset($fieldset[$lang_property])) {
            $fieldset[$lang_property]['dont_populate'] = true;
        }
    }

    /**
     * Returns all available languages for the requested items
     *
     * @param  array  $where
     * @return array  List of available languages for each single_id
     */
    public function languages($where)
    {
        $common_id_property = $this->_properties['common_id_property'];
        $lang_property = $this->_properties['lang_property'];
        $properties = array(
            array($common_id_property, $common_id_property),
            array(\Db::expr('GROUP_CONCAT('.$lang_property.')'), 'list_lang'),
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
            $data[$row[$common_id_property]] = $row['list_lang'];
        }

        return $data;
    }

	public function before_query(&$options)
	{
		if (array_key_exists('where', $options)) {
			$where = $options['where'];
			foreach ($where as $k => $w) {
				if ($w[0] == 'lang_main') {
					if ($w[1] == true) {
						$where[$k] = array($this->_properties['single_id_property'], 'IS NOT', null);
					} else if ($w[1] == false) {
						$where[$k] = array($this->_properties['single_id_property'], 'IS', null);
					}
				}
                if ($w[0] == 'lang') {
                    if (! is_array($w[1])) {
                        $where[$k] = array($this->_properties['lang_property'], '=', $w[1]);
                    } else if (count($w[1])) {
                        $where[$k] = array($this->_properties['lang_property'], 'IN', $w[1]);
                    }
                }
            }
			$options['where'] = $where;
		}
	}
}