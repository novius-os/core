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

class UnknownBehaviourException extends \Exception {};
class UnknownMethodBehaviourException extends \Exception {};

use Arr;
use DB;
use Event;

class Model extends \Orm\Model {

	protected static $_has_many = array();

	/**
	 * @var  array  cached observers
	 */
	protected static $_behaviours_cached = array();

	public $medias;
	public $wysiwygs;

	/**
	 *  @see \Orm\Model::properties()
	 */
	public static function properties() {
		Event::trigger(get_called_class().'.properties', get_called_class());
		return call_user_func_array('parent::properties', func_get_args());
	}

	/**
	 * @see \Orm\Model::relations()
	 */
	public static function relations($specific = false) {

        /*
        $relations = \Event::trigger(get_called_class().'.relations', '', array());
        foreach ($relations as $relation) {
            foreach ($relation as $type => $rels) {
                foreach ($rels as $name => $props) {
                    static::${'_'.$type}[$name] = $props;
                }
            }
        }
        */

        static::$_has_many['linked_wysiwygs'] = array(
			'key_from' => static::$_primary_key[0],
			'model_to' => 'Nos\Model_Wysiwyg',
			'key_to' => 'wysiwyg_foreign_id',
			'cascade_save' => true,
			'cascade_delete' => false,
			'conditions'     => array(
				'where' => array(
					array('wysiwyg_join_table', '=', DB::expr(static::$_table_name) ),
				),
			),
		);

        static::$_has_many['linked_medias'] = array(
			'key_from' => static::$_primary_key[0],
			'model_to' => 'Nos\Model_Media_Link',
			'key_to' => 'medil_foreign_id',
			'cascade_save' => true,
			'cascade_delete' => false,
			'conditions'     => array(
				'where' => array(
					array('medil_from_table', '=', DB::expr(static::$_table_name) ),
				),
			),
		);
		return parent::relations($specific);
	}

	/**
	 * @see \Orm\Model::observers()
	 */
	public static function observers($specific = null, $default = null)
	{
		$class = get_called_class();
		$init = array_key_exists($class, static::$_observers_cached);

		parent::observers($specific, $default);

		if ( !$init)
		{
			static::$_observers_cached[$class] = array_merge(static::$_observers_cached[$class], static::behaviours());
            if (empty(static::$_observers_cached[$class]['\Orm\Observer_Self'])) {
                static::$_observers_cached[$class]['\Orm\Observer_Self'] = array();
            }
            if (empty(static::$_observers_cached[$class]['\Orm\Observer_Self']['events'])) {
                static::$_observers_cached[$class]['\Orm\Observer_Self']['events'] = array();
            }
            if (!in_array('before_save', static::$_observers_cached[$class]['\Orm\Observer_Self']['events'])) {
                static::$_observers_cached[$class]['\Orm\Observer_Self']['events'][] = 'before_save';
            }
		}

		if ($specific)
		{
			return \Arr::get(static::$_observers_cached[$class], $specific, $default);
		}

		return static::$_observers_cached[$class];
	}

	/**
	 * Get the class's behaviours and what they observe
	 *
	 * @param   string  specific behaviour to retrieve info of, allows direct param access by using dot notation
	 * @param   mixed   default return value when specific key wasn't found
	 * @return  array
	 */
	public static function behaviours($specific = null, $default = null)
	{
		$class = get_called_class();

		if ( ! array_key_exists($class, static::$_behaviours_cached))
		{
			$behaviours = array();
			if (property_exists($class, '_behaviours'))
			{
				foreach (static::$_behaviours as $beha_k => $beha_v)
				{
					if (is_int($beha_k))
					{
						$behaviours[$beha_v] = array();
					}
					else
					{
						$behaviours[$beha_k] = $beha_v;
					}
				}
			}
			static::$_behaviours_cached[$class] = $behaviours;
		}

		if ($specific)
		{
			return \Arr::get(static::$_behaviours_cached[$class], $specific, $default);
		}

		return static::$_behaviours_cached[$class];
	}



    public function get_possible_lang() {
        $translatable = static::behaviours('Nos\Orm_Behaviour_Translatable');
        $tree         = static::behaviours('Nos\Orm_Behaviour_Tree');

        if (!$translatable || !$tree) {
            return array_keys(\Config::get('locales'));
        }

        // Return langs from parent if available
        $parent = $this->find_parent();
        if (!empty($parent)) {
            return $parent->get_all_lang();
        }
        return array_keys(\Config::get('locales'));
    }

	/**
	 * @see \Orm\Model::__construct()
	 */
	public function __construct() {
        $this->initProviders();
		call_user_func_array('parent::__construct', func_get_args());
	}

	public function __call($method, $args) {
		try {
			return static::_callBehaviour($this, $method, $args);
		} catch (\Nos\Orm\UnknownBehaviourException $e) {}

		return parent::__call($method, $args);
	}

	public static function __callStatic($method, $args) {
		try {
			return static::_callBehaviour(get_called_class(), $method, $args);
		} catch (\Nos\Orm\UnknownBehaviourException $e) {}

		return parent::__callStatic($method, $args);
	}

	private static function _callBehaviour($context, $method, $args) {
		foreach (static::behaviours() as $behaviour => $settings)
		{
			if ( ! class_exists($behaviour))
			{
                throw new \UnexpectedValueException($behaviour);
			}
            try {
                return call_user_func_array(array($behaviour, 'behaviour'), array($context, $method, $args));
            } catch (\Nos\Orm\UnknownMethodBehaviourException $e) {}
		}
		throw new \Nos\Orm\UnknownBehaviourException();
	}

	public static function _callAllBehaviours($context, $method, $args) {
		foreach (static::behaviours() as $behaviour => $settings)
		{
			if ( ! class_exists($behaviour))
			{
                throw new \UnexpectedValueException($behaviour);
			}

            try {
                call_user_func_array(array($behaviour, 'behaviour'), array($context, $method, $args));
            } catch (\Nos\Orm\UnknownMethodBehaviourException $e) {}
		}
	}

    /**
     * Remove empty wysiwyg and medias
     */
	public function _event_before_save() {
        $w_keys = array_keys($this->linked_wysiwygs);
        for ($j = 0; $j < count($this->linked_wysiwygs); $j++)
        {
            $i = $w_keys[$j];
            // Remove empty wysiwyg
            if ($this->linked_wysiwygs[$i]->wysiwyg_text == '')
            {
                $this->linked_wysiwygs[$i]->delete();
                unset($this->linked_wysiwygs[$i]);
            }
        }

        $w_keys = array_keys($this->linked_medias);
        for ($j = 0; $j < count($this->linked_medias); $j++)
        {
            $i = $w_keys[$j];
            // Remove empty medias
            if ($this->linked_medias[$i]->medil_media_id == '')
            {
                $this->linked_medias[$i]->delete();
                unset($this->linked_medias[$i]);
            }
        }
	}

	public function _update_original_relations($relations = null)
	{
		if (is_null($relations))
		{
			$this->_original_relations = array();
			$relations = $this->_data_relations;
		}
		else
		{
			foreach ($relations as $key => $rel)
			{
				// Unload the just fetched relation from the originals
				unset($this->_original_relations[$rel]);

				// Unset the numeric key and set the data to update by the relation name
				unset($relations[$key]);
				$relations[$rel] = $this->_data_relations[$rel];
			}
		}

		foreach ($relations as $rel => $data)
		{
			if (is_array($data))
			{
				$this->_original_relations[$rel] = array();
				foreach ($data as $obj)
				{
					$this->_original_relations[$rel][] = $obj ? $obj->implode_pk($obj) : null;
				}
			}
			else
			{
				$this->_original_relations[$rel] = $data ? $data->implode_pk($data) : null;
			}
		}
	}

	public static function add_properties($properties) {
		static::$_properties = Arr::merge(static::$_properties, $properties);
	}

    public function import_dataset_behaviours(&$dataset) {
		try {
            static::_callAllBehaviours(get_called_class(), 'dataset', array(&$dataset, $this));
        } catch (\Exception $e) {}
    }

    public function form_processing_behaviours($data, &$json_response) {
		try {
            static::_callAllBehaviours($this, 'form_processing', array($data, &$json_response));
        } catch (\Exception $e) {}
    }

    public function form_fieldset_fields(&$fieldset) {
		try {
            static::_callAllBehaviours($this, 'form_fieldset_fields', array(&$fieldset));
        } catch (\Exception $e) {}
    }

	public static function query($options = array()) {

		static::_callAllBehaviours(get_called_class(), 'before_query', array(&$options));

        return Query::forge(get_called_class(), static::connection(), $options);
	}

    public static function  get_prefix() {

        return mb_substr(static::$_primary_key[0], 0, mb_strpos(static::$_primary_key[0], '_') + 1);
    }

	/**
	 * Returns the first non empty field. Will add field prefix when needed.
	 *
	 * @example $object->pick('menu_title', 'title');
	 * @return mixed
	 */
	public function pick() {

        $prefix_length = mb_strlen(static::get_prefix());

		foreach (func_get_args() as $property) {
			//if (mb_substr($property, 0, $prefix_length) != $prefix) {
				$property = static::get_prefix().$property;
			//}
			if (!empty($this->{$property})) {
				return $this->{$property};
			}
		}
		return null;
	}

	public function __set($name, $value)
	{
		$arr_name = explode('->', $name);

		if (count($arr_name) > 1)
		{
            if ($arr_name[0] == 'wysiwygs')
			{
				$key = $arr_name[1];
                $w_keys = array_keys($this->linked_wysiwygs);
                for ($j = 0; $j < count($this->linked_wysiwygs); $j++)
				{
					$i = $w_keys[$j];
                    if ($this->linked_wysiwygs[$i]->wysiwyg_key == $key)
					{
						array_splice ($arr_name, 0, 2);
						if (empty($arr_name))
						{
                            return $this->linked_wysiwygs[$i];
						}
                        return $this->linked_wysiwygs[$i]->{implode('->', $arr_name)} = $value;
					}
				}
				// Create a new relation if it doesn't exist yet
				$wysiwyg                        = new \Nos\Model_Wysiwyg();
				$wysiwyg->wysiwyg_text          = $value;
				$wysiwyg->wysiwyg_join_table    = static::$_table_name;
				$wysiwyg->wysiwyg_key           = $key;
				$wysiwyg->wysiwyg_foreign_id    = $this->id;
				// Don't save the link here, it's done with cascade_save = true
				//$wysiwyg->save();
                $this->linked_wysiwygs[] = $wysiwyg;

				return $value;
			}

            if ($arr_name[0] == 'medias')
			{
				$key = $arr_name[1];
                $w_keys = array_keys($this->linked_medias);
                for ($j = 0; $j < count($this->linked_medias); $j++)
				{
					$i = $w_keys[$j];
                    if ($this->linked_medias[$i]->medil_key == $key)
					{
						array_splice ($arr_name, 0, 2);
						if (empty($arr_name))
						{
                            return $this->linked_medias[$i];
						}
                        return $this->linked_medias[$i]->{implode('->', $arr_name)} = $value;
					}
				}

				// Create a new relation if it doesn't exist yet
				$medil                   = new \Nos\Model_Media_Link();
				$medil->medil_from_table = static::$_table_name;
				$medil->medil_key        = $key;
				$medil->medil_foreign_id = $this->id;
				$medil->medil_media_id   = $value;
				// Don't save the link here, it's done with cascade_save = true
				$this->linked_medias[] = $medil;

				return $value;
			}

			$obj = $this;

			// We need to access the relation and not the final object
            // So we don't want to use the provider but the __get({"medias->key"}) instead
			//$arr_name[0] = $arr_name[0].'->'.$arr_name[1];
			for ($i = 0; $i < count($arr_name); $i++)
			{
				$obj = &$obj->{$arr_name[$i]};
			}
			return $obj = $value;
		}

		// No special setter for ID: immutable

		return parent::__set($name, $value);
	}

	public function & __get($name)
	{
		$arr_name = explode('->', $name);
		if (count($arr_name) > 1)
		{
            if ($arr_name[0] == 'wysiwygs')
			{
				$key = $arr_name[1];
                $w_keys = array_keys($this->linked_wysiwygs);
                for ($j = 0; $j < count($this->linked_wysiwygs); $j++)
				{
					$i = $w_keys[$j];
                    if ($this->linked_wysiwygs[$i]->wysiwyg_key == $key)
					{
						array_splice ($arr_name, 0, 2);
						if (empty($arr_name))
						{
                            return $this->linked_wysiwygs[$i];
						}
                        return $this->linked_wysiwygs[$i]->__get(implode('->', $arr_name));
					}
				}
				$ref = null;
				return $ref;
			}

            if ($arr_name[0] == 'medias')
			{
				$key = $arr_name[1];
                $w_keys = array_keys($this->linked_medias);
                for ($j = 0; $j < count($this->linked_medias); $j++) {
					$i = $w_keys[$j];
                    if ($this->linked_medias[$i]->medil_key == $key) {
						array_splice ($arr_name, 0, 2);
						if (empty($arr_name))
						{
                            return $this->linked_medias[$i];
						}
                        return $this->linked_medias[$i]->__get(implode('->', $arr_name));
					}
				}
				$ref = null;
				return $ref;
			}

			$obj = $this;
			for ($i = 0; $i < count($arr_name); $i++)
			{
				$obj = $obj->{$arr_name[$i]};
			}
			return $obj;
		}

		// Special getter for ID without prefix
		if ($name == 'id')
		{
			$name = static::$_primary_key[0];
		}

		return parent::__get($name);
	}

	public function __toString() {
		return get_class($this);
	}

	public function __isset($name) {
		try {
			$this->__get($name);
			return true;
		} catch (\Exception $e) {
			return false;
		}
	}


	/**
	 * Generates an array with keys new & old that contain ONLY the values that differ between the original and
	 * the current unsaved model.
	 * Note: relations are given as single or array of imploded pks
	 *
	 * @return  array
	 */
	public function get_diff()
	{
		$diff = array(0 => array(), 1 => array());
		foreach ($this->_data as $key => $val)
		{
			if ($this->is_changed($key))
			{
				$diff[0][$key] = array_key_exists($key, $this->_original) ? $this->_original[$key] : null;
				$diff[1][$key] = $val;
			}
		}
		foreach ($this->_data_relations as $key => $val)
		{
			$rel = static::relations($key);
			if ($rel->singular)
			{
				if (empty($this->_original_relations[$key]) !== empty($val)
					or ( ! empty($this->_original_relations[$key])
						and $new_pk = $val->implode_pk($val)
						and $this->_original_relations[$key] !== $new_pk))
				{
					$diff[0][$key] = isset($this->_original_relations[$key]) ? $this->_original_relations[$key] : null;
					$diff[1][$key] = isset($val) ? $new_pk : null;
				}
			}
			else
			{
				$original_pks = $this->_original_relations[$key];
				$new_pks = array();
				foreach ($val as $v)
				{
					if ( ! in_array(($new_pk = $v->implode_pk($v)), $original_pks))
					{
						$new_pks[] = $new_pk;
					}
					else
					{
						$original_pks = array_diff($original_pks, array($new_pk));
					}
				}
				if ( ! empty($original_pks) or ! empty($new_pks)) {
					$diff[0][$key] = empty($original_pks) ? null : $original_pks;
					$diff[1][$key] = empty($new_pks) ? null : $new_pks;
				}
			}
		}

		return $diff;
	}

    /**
     * Clone nested objects manually, it's not native
     */
    public function __clone() {
        parent::__clone();
        $wysiwygs = array();
        $medias = array();
        foreach ($this->wysiwygs as $key => $wysiwyg) {
            $wysiwygs[$key] = $wysiwyg;
        }
        foreach ($this->medias as $key => $media) {
            $medias[$key] = $media;
        }
        $this->initProviders();
        foreach ($wysiwygs as $key => $wysiwyg) {
            $this->wysiwygs->{$key} = $wysiwyg;
        }
        foreach ($medias as $key => $media) {
            $this->medias->{$key} = $media;
        }
    }

    protected function initProviders() {
        $this->medias   = new Model_Media_Provider($this);
        $this->wysiwygs = new Model_Wysiwyg_Provider($this);
    }
}



class Model_Media_Provider
{
	protected $parent;
    protected $iterator = array();

	public function __construct($parent)
	{
		$this->parent = $parent;
	}

	public function & __get($value)
	{
		// Reuse the getter and fetch the media directly
        $media = $this->parent->{'medias->'.$value};
        if ($media === null) {
            return $media;
        }
        return $media->get('media');
	}

	public function __set($property, $value)
	{
		// Check existence of the media, the ORM will throw an exception anyway upon save if it doesn't exists
		$media_id = (string) ($value instanceof \Nos\Model_Media ? $value->media_id : $value);
		$media = \Nos\Model_Media::find($media_id);
		if (is_null($media))
		{
			$pk = $this->parent->primary_key();
			throw new \Exception("The media with ID $media_id doesn't exists, cannot assign it as \"$property\" for ".\Inflector::denamespace(get_class($this->parent))."(".$this->parent->{$pk[0]}.")");
		}

		// Reuse the getter
        $media_link = $this->parent->{'medias->'.$property};

		// Create the new relation if it doesn't exists yet
		if (is_null($media_link))
		{
            $this->parent->{'medias->'.$property} = $media_id;
			return;
		}

		// Update an existing relation
		$media_link->medil_media_id = $media_id;

		// Don't save the link here, it's done with cascade_save = true
	}

	public function __isset($value) {
		$value = $this->__get($value);
		return (!empty($value));
	}

    function rewind() {
        $keys = array();
        foreach($this->parent->linked_medias as $wysiwyg) {
            $keys[] = $wysiwyg->medil_key;
        }
        $this->iterator = $keys;
        reset($keys);
    }

    function current() {
        return $this->__get(current($this->iterator));
    }

    function key() {
        return current($this->iterator);
    }

    function next() {
        next($this->iterator);
    }

    function valid() {
        return false !== current($this->iterator);
    }

    function setParent($obj) {
        $this->parent = $obj;
    }
}



class Model_Wysiwyg_Provider implements \Iterator
{
	protected $parent;
    protected $iterator = array();

	public function __construct($parent)
	{
		$this->parent = $parent;
	}

	public function & __get($value)
	{
        $wysiwyg = $this->parent->{'wysiwygs->'.$value};
        if ($wysiwyg === null) {
            return $wysiwyg;
        }
        return $wysiwyg->get('wysiwyg_text');
	}

	public function __set($property, $value)
	{
		$value = (string) ($value instanceof \Nos\Model_Wysiwyg ? $value->wysiwyg_text : $value);

		// Reuse the getter
        $wysiwyg = $this->parent->{'wysiwygs->'.$property};

		// Create the new relation if it doesn't exists yet
		if (is_null($wysiwyg))
		{
            $this->parent->{'wysiwygs->'.$property} = $value;
			return;
		}

		// Update an existing relation
		$wysiwyg->wysiwyg_text = $value;

		// Don't save the link here, it's done with cascade_save = true
	}

	public function __isset($value) {
		$value = $this->__get($value);
		return (!empty($value));
	}

    function rewind() {
        $keys = array();
        foreach($this->parent->linked_wysiwygs as $wysiwyg) {
            $keys[] = $wysiwyg->wysiwyg_key;
        }
        $this->iterator = $keys;
        reset($keys);
    }

    function current() {
        return $this->__get(current($this->iterator));
    }

    function key() {
        return current($this->iterator);
    }

    function next() {
        next($this->iterator);
    }

    function valid() {
        return false !== current($this->iterator);
    }
}

