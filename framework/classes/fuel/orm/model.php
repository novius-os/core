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



	/**
	 * @see \Orm\Model::__construct()
	 */
	public function __construct() {
        $this->medias   = new Model_Media_Provider($this);
        $this->wysiwygs = new Model_Wysiwyg_Provider($this);
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

	/**
	 * Alias to Model:find('all')
	 *
	 * @param  array  $where
	 * @param  array  $order_by
	 * @param  array  $options   Additional options to pass on to the ::find() method
	 * @return array
	 */
	public static function search($where, $order_by = array(), $options = array()) {

		try {
			static::_callAllBehaviours(get_called_class(), 'before_search', array(&$where, &$order_by, &$options));
		} catch (\Exception $e) {
			if ($e->getMessage() !== 'no behaviour') {
				throw $e;
			}
		}

		$options = \Arr::merge($options, array(
			'where'    => $where,
			'order_by' => $order_by,
		));
		return static::find('all', $options);
	}

	/**
	 * Returns the first non empty field. Will add field prefix when needed.
	 *
	 * @example $object->pick('menu_title', 'title');
	 * @return mixed
	 */
	public function pick() {
		static $prefix = null;
		if (null == $prefix) {
			$prefix = mb_substr(static::$_primary_key[0], 0, mb_strpos(static::$_primary_key[0], '_') + 1);
			$prefix_length = mb_strlen($prefix);
		}
		foreach (func_get_args() as $property) {
			//if (mb_substr($property, 0, $prefix_length) != $prefix) {
				$property = $prefix.$property;
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
				$diff[0][$key] = $this->_original[$key];
				$diff[1][$key] = $val;
			}
		}
		foreach ($this->_data_relations as $key => $val)
		{
			$rel = static::relations($key);
			if ($rel->singular)
			{
                if (isset($val)) {
                    $new_pk = $val->implode_pk($val);
                } else {
                    $new_pk = null;
                }
				if ((! isset($this->_original_relations[$key]))
					or $new_pk != $this->_original_relations[$key])
				{

					$diff[0][$key] = isset($this->_original_relations[$key]) ? $this->_original_relations[$key] : null;
					$diff[1][$key] = $new_pk;
				}
			}
			else
			{
				// $this->_original_relations[$key] can be not set (case of children width page)
				$original_pks = isset($this->_original_relations[$key]) ? $this->_original_relations[$key] : array();
				foreach ($val as $v)
				{
					if ( ! in_array(($new_pk = $v->implode_pk($v)), $original_pks))
					{
						$diff[0][$key] = null;
						$diff[1][$key] = isset($diff[1][$key]) ? $diff[1][$key] + array($new_pk) : array($new_pk);
					}
					else
					{
						$original_pks = array_diff($original_pks, array($new_pk));
					}
				}
				if (count($original_pks)) {
					$diff[0][$key] = $original_pks;
					if (!isset($diff[1][$key])) {
						$diff[1][$key] = null;
					}
				}
			}
		}

		return $diff;
	}
}



class Model_Media_Provider
{
	protected $parent;

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
}



class Model_Wysiwyg_Provider
{
	protected $parent;

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
}

