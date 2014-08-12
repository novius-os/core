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

class UnknownBehaviourException extends \Exception
{
}

class InvalidProviderException extends \Exception
{
}

use Arr;

class Model extends \Orm\Model
{

    protected static $_valid_relations = array(
        'belongs_to'            => 'Orm\\BelongsTo',
        'has_one'               => 'Orm\\HasOne',
        'has_many'              => 'Orm\\HasMany',
        'many_many'             => 'Orm\\ManyMany',
        'attachment'            => 'Nos\\Orm_Attachment',
        'twinnable_belongs_to'  => 'Nos\\Orm_Twinnable_BelongsTo',
        'twinnable_has_one'     => 'Nos\\Orm_Twinnable_HasOne',
        'twinnable_has_many'    => 'Nos\\Orm_Twinnable_HasMany',
        'twinnable_many_many'   => 'Nos\\Orm_Twinnable_ManyMany',
    );

    protected static $_has_many = array();
    protected static $_belongs_to = array();
    protected static $_has_one = array();
    protected static $_many_many = array();
    protected static $_attachment = array();

    /**
     * @var  array  cached providers
     */
    protected static $_providers_cached = array();

    /**
     * @var  array  cached behaviours
     */
    protected static $_behaviours_cached = array();

    /**
     * @var  array  cached title property
     */
    protected static $_title_property_cached = array();

    protected static $_prefix = null;

    protected $providers = array();

    /**
     * Get the class's title property
     *
     * @return mixed
     */
    public static function title_property()
    {
        $class = get_called_class();

        if (!array_key_exists($class, static::$_title_property_cached)) {
            $_title_property = null;

            if (property_exists($class, '_title_property')) {
                $_title_property = static::$_title_property;
            }

            $config = static::configModel();
            if (!empty($config) && !empty($config['title_property'])) {
                $_title_property = $config['title_property'];
            }

            if (empty($_title_property)) {
                $properties = static::properties();
                foreach ($properties as $column => $props) {
                    if (strpos($column, 'title') !== false || strpos($column, 'label') !== false || strpos($column, 'name') !== false) {
                        $_title_property = $column;
                        break;
                    }
                }
            }

            if (empty($_title_property)) {
                foreach ($properties as $column => $props) {
                    // if data_type is not set then it is considered as varchar
                    if (isset($props['data_type']) && $props['data_type'] === 'varchar') {
                        $_title_property = $column;
                        break;
                    }
                }
            }

            if (empty($_title_property)) {
                $_title_property = \Arr::get(static::primary_key(), 0);
            }

            static::$_title_property_cached[$class] = $_title_property;
        }

        return static::$_title_property_cached[$class];
    }

    /**
     * @see \Orm\Model::table()
     */
    public static function table()
    {
        $class = get_called_class();
        $init = array_key_exists($class, static::$_table_names_cached);

        if (!$init) {
            $config = static::configModel();
            if (!empty($config) && !empty($config['table_name'])) {
                static::$_table_names_cached[$class] = $config['table_name'];
            } else {
                parent::table();
            }
        }

        return static::$_table_names_cached[$class];
    }

    /**
     * @see \Orm\Model::properties()
     */
    public static function properties($from_db = false)
    {
        $class = get_called_class();
        $init = array_key_exists($class, static::$_properties_cached);
        static $from_db_cached = array();
        if ($from_db && isset($from_db_cached[$class])) {
            $from_db = false;
        }

        if (!$init || $from_db) {
            $cache_enabled = \Config::get('novius-os.cache_model_properties', false);
            try {
                if ($from_db || !$cache_enabled) {
                    if ($init) {
                        unset(static::$_properties_cached[$class]);
                    }
                    throw new \CacheNotFoundException();
                }

                static::$_properties_cached[$class] = \Cache::get('model_properties.'.str_replace('\\', '_', $class));
            } catch (\CacheNotFoundException $e) {
                $from_db_cached[$class] = $class;
                parent::properties();

                $config = static::configModel();
                if (!empty($config) && !empty($config['properties'])) {
                    static::$_properties_cached[$class] = \Arr::merge(
                        static::$_properties_cached[$class],
                        $config['properties']
                    );
                }

                if ($cache_enabled) {
                    if (property_exists($class, '_properties')) {
                        try {
                            static::$_properties_cached[$class] = \Arr::merge(
                                \DB::list_columns(static::table(), null, static::connection()),
                                static::$_properties_cached[$class]
                            );
                        } catch (\Exception $e) {
                        }
                    }

                    \Cache::set('model_properties.'.str_replace('\\', '_', $class), static::$_properties_cached[$class]);
                }
            }
        }

        return static::$_properties_cached[$class];
    }

    /**
     * Returns whether this model can be linked with wysiwygs
     *
     * @return  boolean
     */
    public static function canHaveLinkedWysiwygs()
    {
        $class = get_called_class();

        return !in_array($class, array('Nos\Model_Wysiwyg', 'Nos\Media\Model_Link'));
    }

    /**
     * Returns whether this model can be linked with medias
     *
     * @return  boolean
     */
    public static function canHaveLinkedMedias()
    {
        $class = get_called_class();

        return !in_array($class, array('Nos\Model_Wysiwyg', 'Nos\Media\Model_Link'));
    }

    /**
     * @see \Orm\Model::relations()
     */
    public static function relations($specific = false)
    {
        $class = get_called_class();
        $init = array_key_exists($class, static::$_relations_cached);

        if (!$init) {
            // unset potential's relations stored in Nos\Orm\Model
            unset(static::$_has_many['linked_wysiwygs']);
            unset(static::$_has_many['linked_medias']);
            if (static::canHaveLinkedWysiwygs()) {
                static::$_has_many['linked_wysiwygs'] = array(
                    'key_from' => static::$_primary_key[0],
                    'model_to' => 'Nos\Model_Wysiwyg',
                    'key_to' => 'wysiwyg_foreign_id',
                    'cascade_save' => true,
                    'cascade_delete' => true,
                    'conditions' => array(
                        'where' => array(
                            array('wysiwyg_join_table', '=', \DB::expr(\DB::quote(static::$_table_name))),
                        ),
                    ),
                );
            }

            if (static::canHaveLinkedMedias()) {
                static::$_has_many['linked_medias'] = array(
                    'key_from' => static::$_primary_key[0],
                    'model_to' => 'Nos\Media\Model_Link',
                    'key_to' => 'medil_foreign_id',
                    'cascade_save' => true,
                    'cascade_delete' => true,
                    'conditions' => array(
                        'where' => array(
                            array('medil_from_table', '=', \DB::expr(\DB::quote(static::$_table_name))),
                        ),
                    ),
                );
            }

            $config = static::configModel();
            if (!empty($config)) {
                foreach (static::$_valid_relations as $rel_name => $rel_class) {
                    if (!empty($config[$rel_name])) {
                        if (property_exists($class, '_'.$rel_name)) {
                            static::${'_'.$rel_name} = \Arr::merge(static::${'_'.$rel_name}, $config[$rel_name]);
                        } else {
                            static::${'_'.$rel_name} = $config[$rel_name];
                        }
                    }
                }
            }
        }

        parent::relations($specific);

        if (!$init) {
            static::eventStatic('buildRelations');
        }

        if ($specific !== false) {
            return \Arr::get(static::$_relations_cached[$class], $specific, false);
        }

        return static::$_relations_cached[$class];
    }

    /**
     * Add a relation to model
     *
     * @param string $type A valid relation type
     * @param string $name The relation name
     * @param array $options The relation options
     * @throws \FuelException If $type is not a valid one.
     */
    public static function addRelation($type, $name, array $options = array())
    {
        if (!array_key_exists($type, static::$_valid_relations)) {
            throw new \FuelException('Invalid relation type: '.$type);
        }

        $class = get_called_class();
        if (array_key_exists($class, static::$_relations_cached)) {
            $rel_class = static::$_valid_relations[$type];
            $new_relation = array($name => new $rel_class($class, $name, $options));
            static::$_relations_cached[$class] = static::relations() + $new_relation;
        } elseif (property_exists($class, '_'.$type)) {
            static::${'_'.$type} = static::${'_'.$type} + array($name => $options);
        } else {
            static::${'_'.$type} = array($name => $options);
        }
    }

    /**
     * @see \Orm\Model::observers()
     */
    public static function observers($specific = null, $default = null)
    {
        $class = get_called_class();
        $init = array_key_exists($class, static::$_observers_cached);

        parent::observers($specific, $default);

        if (!$init) {
            $config = static::configModel();
            if (!empty($config) && !empty($config['observers'])) {
                static::$_observers_cached[$class] = \Arr::merge(static::$_observers_cached[$class], $config['observers']);
            }

            static::$_observers_cached[$class] = array_merge(static::$_observers_cached[$class], static::behaviours());
            // Add Observer_Self, always
            if (empty(static::$_observers_cached[$class]['Orm\Observer_Self'])) {
                static::$_observers_cached[$class]['Orm\Observer_Self'] = array(
                    'events' => array(),
                );
            }
            // If events is empty, don't populate it, because empty === ALL observers will be called.
            // If we add only 'before_save', the other observers won't called anymore
            if (!empty(static::$_observers_cached[$class]['Orm\Observer_Self']['events'])) {
                if (!in_array('before_save', static::$_observers_cached[$class]['Orm\Observer_Self']['events'])) {
                    static::$_observers_cached[$class]['Orm\Observer_Self']['events'][] = 'before_save';
                }
            }
        }

        if ($specific) {
            return \Arr::get(static::$_observers_cached[$class], $specific, $default);
        }

        return static::$_observers_cached[$class];
    }

    /**
     * Get the class's behaviours and what they observe
     *
     * @param string $specific Behaviour to retrieve info of, allows direct param access by using dot notation
     * @param mixed $default Return value when specific key wasn't found
     * @throws UnknownBehaviourException
     * @return array The specific behaviour if it exist and is requested or the defaut value. Else, array of all behaviours.
     */
    public static function behaviours($specific = null, $default = null)
    {
        $class = get_called_class();

        if (!array_key_exists($class, static::$_behaviours_cached)) {
            $behaviours = array();
            $_behaviours = array();

            if (property_exists($class, '_behaviours')) {
                $_behaviours = static::$_behaviours;
            }

            $config = static::configModel();
            if (!empty($config) && !empty($config['behaviours'])) {
                $_behaviours = \Arr::merge($_behaviours, $config['behaviours']);
            }

            foreach ($_behaviours as $beha_k => $beha_v) {
                if (!class_exists($beha_k)) {
                    throw new UnknownBehaviourException('Unknown behaviour '.$beha_k.' for class '.$class);
                }
                if (is_int($beha_k)) {
                    $behaviours[$beha_v] = array();
                } else {
                    $behaviours[$beha_k] = $beha_v;
                }
            }

            static::$_behaviours_cached[$class] = $behaviours;
        }

        if ($specific) {
            return \Arr::get(static::$_behaviours_cached[$class], $specific, $default);
        }

        return static::$_behaviours_cached[$class];
    }

    /**
     * Get the class's providers and what they provide
     *
     * @param string $specific Provider to retrieve info of, allows direct param access by using dot notation
     * @param mixed $default Return value when specific key wasn't found
     * @throws UnknownProviderException
     * @return array The specific provider if it exist and is requested or the defaut value. Else, array of all providers.
     */
    public static function providers($specific = null, $default = null)
    {
        $class = get_called_class();

        if (!array_key_exists($class, static::$_providers_cached)) {
            $providers = array();
            $_providers = array();

            if (property_exists($class, '_providers')) {
                $_providers = static::$_providers;
            }

            if (static::canHaveLinkedWysiwygs()) {
                $_providers['wysiwygs'] = array(
                    'relation' => 'linked_wysiwygs',
                    'key_property' => 'wysiwyg_key',
                    'value_property' => 'wysiwyg_text',
                    'table_name_property' => 'wysiwyg_join_table',
                );
            }

            if (static::canHaveLinkedMedias()) {
                $_providers['medias'] = array(
                    'relation' => 'linked_medias',
                    'key_property' => 'medil_key',
                    'value_property' => 'medil_media_id',
                    'value_relation' => 'media',
                    'table_name_property' => 'medil_from_table',
                );
            }

            $config = static::configModel();
            if (!empty($config) && !empty($config['providers'])) {
                $_providers = \Arr::merge($_providers, $config['providers']);
            }

            foreach ($_providers as $provider_name => $provider_v) {
                $providers[$provider_name] = static::parseProvider($provider_name, $provider_v);
            }

            static::$_providers_cached[$class] = $providers;

            static::eventStatic('buildProviders');
        }

        if ($specific) {
            return \Arr::get(static::$_providers_cached[$class], $specific, $default);
        }

        return static::$_providers_cached[$class];
    }

    /**
     * Add a provider to model
     *
     * @param string $name The provider name
     * @param array $properties The provider properties
     * @throws \UnknownProviderException If provider is not valid.
     */
    public static function addProvider($name, array $properties)
    {
        $properties = static::parseProvider($name, $properties);

        $class = get_called_class();
        if (array_key_exists($class, static::$_providers_cached)) {
            static::$_providers_cached[$class] = static::providers() + array($name => $properties);
        } elseif (property_exists($class, '_providers')) {
            static::$_providers = static::$_providers + array($name => $properties);
        } else {
            static::$_providers = array($name => $properties);
        }
    }

    protected static function parseProvider($name, array $properties)
    {
        if (empty($properties['relation'])) {
            throw new InvalidProviderException('The provider '.$name.' have no relation');
        }
        $relation = static::relations($properties['relation'], false);
        if (!$relation) {
            throw new InvalidProviderException(
                'The relation '.$properties['relation'].' of provider '.$name.' does not exist'
            );
        }
        if ($relation->singular) {
            throw new InvalidProviderException(
                'The relation '.$properties['relation'].' of provider '.$name.' is not a multiple relation'
            );
        }
        if (!$relation->cascade_save) {
            throw new InvalidProviderException(
                'The relation '.$properties['relation'].' of provider '.$name.' must use cascade save'
            );
        }
        if (!empty($properties['value_relation'])) {
            $model_to = $relation->model_to;
            $relation = $model_to::relations($properties['value_relation'], false);
            if (!$relation) {
                throw new InvalidProviderException(
                    'The value relation '.$properties['value_relation'].' of provider '.$name.' does not exist'
                );
            }
            if (!$relation->singular) {
                throw new InvalidProviderException(
                    'The value relation '.$properties['value_relation'].' of provider '.
                    $name.' is not a singular relation'
                );
            }
        }

        $properties['name'] = $name;
        if (empty($properties['value_property'])) {
            $properties['value_property'] = 'value';
        }
        if (empty($properties['key_property'])) {
            $properties['key_property'] = 'key';
        }

        return $properties;
    }

    protected static $_configs = array();

    /**
     * @return array Configurations of the model
     */
    public static function configModel()
    {
        $class = get_called_class();
        if (!isset(static::$_configs[$class])) {
            $application = static::getApplication();
            $file_name = mb_strtolower(str_replace('_', DS, \Inflector::denamespace($class)));

            static::$_configs[$class] = \Config::load($application.'::'.$file_name, true);
        }

        return static::$_configs[$class];
    }

    public static function getApplication()
    {
        $class = get_called_class();
        $namespace = trim(\Inflector::get_namespace($class), '\\');
        $application = mb_strtolower($namespace);

        if ($application !== 'nos') {
            $namespaces = \Nos\Config_Data::get('app_namespaces', array());
            $application = array_search($namespace, $namespaces);
        }

        return $application;
    }

    /**
     * @see \Orm\Model::__construct()
     */
    public function __construct()
    {
        $this->initProviders();
        call_user_func_array('parent::__construct', func_get_args());
    }

    public function __call($method, $args)
    {
        $return = static::_behaviours($method, $args, array('this' => $this, 'return' => true));
        if (array_key_exists('return', $return)) {
            return $return['return'];
        }

        return parent::__call($method, $args);
    }

    public static function __callStatic($method, $args)
    {
        $return = static::_behaviours($method, $args, array('return' => true));
        if (isset($return['return'])) {
            return $return['return'];
        }

        return parent::__callStatic($method, $args);
    }

    public function event($method, $args = array())
    {
        static::_behaviours($method, $args, array('this' => $this));
    }

    public static function eventStatic($method, $args = array())
    {
        static::_behaviours($method, $args);
    }

    protected static function _behaviours($method, $args = array(), $params = array())
    {
        $return = isset($params['return']) && $params['return'];
        $class = get_called_class();
        foreach (static::behaviours() as $behaviour => $settings) {
            $methods = isset($settings['methods']) ? $settings['methods'] : array();
            if (empty($methods) or in_array($methods, $method)) {
                $behaviour_instance = $behaviour::instance($class);
                if (method_exists($behaviour_instance, $method)) {
                    if (isset($params['this']) && is_object($params['this'])) {
                        $return_value = call_user_func_array(array($behaviour_instance, $method), array_merge(array($params['this']), $args));
                    } else {
                        $return_value = call_user_func_array(array($behaviour_instance, $method), $args);
                    }
                    if ($return) {
                        return array('return' => $return_value);
                    }
                }
            }
        }
        if ($return) {
            return array();
        }
    }

    /**
     * Allows subclasses to more easily define if a relation can be cascade deleted or not.
     *
     * @param array $rel
     *
     * @return bool False to stop the relation from being deleted. Works the same as the cascade_delete property
     */
    protected function should_cascade_delete($rel)
    {
        $twinnable = $this->behaviours('Nos\Orm_Behaviour_Twinnable');
        if (!empty($twinnable) &&
            property_exists($rel, 'cascade_delete_after_last_twin') && $rel->cascade_delete_after_last_twin) {
            $count = static::count(array(
                'where' => array(
                    array($twinnable['common_id_property'], '=', $this->{$twinnable['common_id_property']}),
                ),
            ));
            return $count === 0;
        }

        return true;
    }

    /**
     * Remove empty providers
     */
    public function _event_before_save()
    {
        $class = get_called_class();

        foreach ($this->providers() as $provider) {
            $relation = $this->relations($provider['relation']);
            if (isset($this->_data_relations[$relation->name])) {
                $w_keys = array_keys($this->{$relation->name});
                foreach ($w_keys as $i) {
                    // Remove empty
                    if (empty($this->{$relation->name}[$i]->{$provider['value_property']})) {
                        $this->{$relation->name}[$i]->delete();
                        unset($this->{$relation->name}[$i]);
                    }
                }
            }
        }
    }

    public function _update_original_relations($relations = null)
    {
        if (is_null($relations)) {
            $this->_original_relations = array();
            $relations = $this->_data_relations;
        } else {
            foreach ($relations as $key => $rel) {
                // Unload the just fetched relation from the originals
                unset($this->_original_relations[$rel]);

                // Unset the numeric key and set the data to update by the relation name
                unset($relations[$key]);
                $relations[$rel] = $this->_data_relations[$rel];
            }
        }

        foreach ($relations as $rel => $data) {
            if (is_array($data)) {
                $this->_original_relations[$rel] = array();
                foreach ($data as $obj) {
                    $this->_original_relations[$rel][] = $obj ? $obj->implode_pk($obj) : null;
                }
            } else {
                $this->_original_relations[$rel] = $data ? $data->implode_pk($data) : null;
            }
        }
    }

    public static function add_properties($properties)
    {
        static::$_properties = Arr::merge(static::$_properties, $properties);
    }

    public static function query($options = array())
    {
        $options = array_merge(array(
            'before_where' => array(),
            'before_order_by' => array(),
        ), (array) $options);

        static::eventStatic('before_query', array(&$options));

        return Query::forge(get_called_class(), array(static::connection(), static::connection(true)), $options);
    }

    public static function prefix()
    {
        return mb_substr(static::$_primary_key[0], 0, mb_strpos(static::$_primary_key[0], '_') + 1);
    }

    /**
     * Returns the item's title
     *
     * @return string
     */
    public function title_item()
    {
        $title_property = static::title_property();
        if (is_callable($title_property)) {
            return $title_property($this);
        } elseif (is_string($title_property)) {
            return $this->{$title_property};
        }

        return null;
    }

    /**
     * Returns the first non empty field. Will add field prefix when needed.
     *
     * @example $item->pick('menu_title', 'title');
     * @return mixed
     */
    public function pick()
    {
        $prefix_length = mb_strlen(static::prefix());

        foreach (func_get_args() as $property) {
            //if (mb_substr($property, 0, $prefix_length) != $prefix) {

            $property = static::prefix().$property;

            //}
            if (!empty($this->{$property})) {
                return $this->{$property};
            }
        }
        return null;
    }

    public function set($property, $value = null)
    {
        if (is_array($property)) {
            return parent::set($property, $value);
        }

        if (isset(static::$_properties_cached[get_called_class()][static::prefix().$property])) {
            $property = static::prefix().$property;
        }

        $properties_reload = !isset($this->_custom_data[$property]);

        $arr_name = explode('->', $property);

        if (count($arr_name) > 1) {
            $class = get_called_class();
            if ($provider = static::providers($arr_name[0])) {
                $key = $arr_name[1];
                $relation = $this->relations($provider['relation']);
                foreach ($this->get($relation->name) as $linked_item) {
                    if ($linked_item->get($provider['key_property']) == $key) {
                        array_splice($arr_name, 0, 2);
                        if (empty($arr_name)) {
                            return $linked_item;
                        }

                        return $linked_item->set(implode('->', $arr_name), $value);
                    }
                }

                // Create a new relation if it doesn't exist yet
                if (!empty($value)) {
                    $model = $relation->model_to;
                    $item = new $model();
                    $item->set($provider['value_property'], $value);
                    $item->set($provider['key_property'], $key);
                    if (!empty($provider['table_name_property'])) {
                        $item->set($provider['table_name_property'], static::$_table_name);
                    }
                    $key_to = $relation->key_to;
                    reset($key_to);
                    foreach ($relation->key_from as $pk) {
                        $item->{current($key_to)} = $this->{$pk};
                        next($key_to);
                    }
                    // Don't save the link here, it's done with cascade_save = true
                    //$wysiwyg->save();
                    $this->{$relation->name}[] = $item;
                }

                return $this;
            }

            // We need to access the relation and not the final object
            // So we don't want to use the provider but the __get({"medias->key"}) instead
            //$arr_name[0] = $arr_name[0].'->'.$arr_name[1];
            $this->setOrCreateRelation($property, $value);
            return $this;
        }

        $return = parent::set($property, $value);

        $class = get_called_class();
        $cache_model_properties = \Config::get('novius-os.cache_model_properties', false);
        if ($cache_model_properties !== false) {
            $check = true;
            if (is_array($cache_model_properties) &&
                is_callable(\Arr::get($cache_model_properties, 'check_property_callback'))) {
                $callback = \Arr::get($cache_model_properties, 'check_property_callback');
                $check = call_user_func($callback, $class, $property);
            }
            if ($properties_reload && isset($this->_custom_data[$property]) && $check) {
                static::properties(true);
                unset($this->_custom_data[$property]);
                $return = parent::set($property, $value);
            }
        }

        if ($value === '' && array_key_exists($property, static::$_properties_cached[$class]) &&
            isset(static::$_properties_cached[$class][$property]['convert_empty_to_null']) &&
            static::$_properties_cached[$class][$property]['convert_empty_to_null']) {
            $return = parent::set($property, null);
        }

        return $return;
    }

    protected function &setOrCreateRelation($name, $value)
    {
        $arr_name = explode('->', $name);
        $obj = $this;
        foreach ($arr_name as $val_name) {
            $rel = $obj->relations($val_name);
            if (!empty($rel)) {
                $obj = &$obj->get($val_name);
                if (empty($obj)) {
                    $model_to = $rel->model_to;
                    $related = $model_to::forge();
                    if ($rel->singular) {
                        $obj->{$val_name} = $related;
                    } else {
                        $obj->{$val_name}[] = $related;
                    }
                    $obj = $related;
                }
            } else if (array_key_exists($val_name, $obj::properties())) {
                $obj->set($val_name, $value);
            }
        }
        return $obj;
    }

    public function & get($property, array $conditions = array())
    {
        if (isset(static::$_properties_cached[get_called_class()][static::prefix().$property])) {
            $property = static::prefix().$property;
        }

        $cache_model_properties = \Config::get('novius-os.cache_model_properties', false);
        if ($cache_model_properties !== false) {
            $check = true;
            if (is_array($cache_model_properties)
                && is_callable(\Arr::get($cache_model_properties, 'check_property_callback'))) {
                $class = get_called_class();
                $callback = \Arr::get($cache_model_properties, 'check_property_callback');
                $check = call_user_func($callback, $class, $property);
            }
            if ($check) {
                try {
                    return parent::get($property);
                } catch (\OutOfBoundsException $e) {
                    if ($provider = static::providers($property)) {
                        return $this->providers[$property];
                    }
                    static::properties(true);
                }
            }
        }

        try {
            return parent::get($property, $conditions);
        } catch (\OutOfBoundsException $e) {
            if (static::providers($property)) {
                return $this->providers[$property];
            }
            throw $e;
        }
    }

    public function & __get($name)
    {
        $arr_name = explode('->', $name);
        if (count($arr_name) > 1) {
            $class = get_called_class();

            if ($provider = static::providers($arr_name[0])) {
                $key = $arr_name[1];
                $relation = $this->relations($provider['relation']);
                foreach ($this->get($relation->name) as $linked_item) {
                    if ($linked_item->get($provider['key_property']) == $key) {
                        array_splice($arr_name, 0, 2);
                        if (empty($arr_name)) {
                            return $linked_item;
                        }

                        return $linked_item->__get(implode('->', $arr_name));
                    }
                }
                $ref = null;
                return $ref;
            }

            $obj = $this;
            for ($i = 0; $i < count($arr_name); $i++) {
                $obj = $obj->{$arr_name[$i]};
                if (empty($obj)) {
                    return $obj;
                }
            }
            return $obj;
        }

        return parent::__get($name);
    }

    public function __toString()
    {
        return get_class($this);
    }

    public function __isset($name)
    {
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
        foreach ($this->_data as $key => $val) {
            if ($this->is_changed($key)) {
                $diff[0][$key] = array_key_exists($key, $this->_original) ? $this->_original[$key] : null;
                $diff[1][$key] = $val;
            }
        }
        foreach ($this->_data_relations as $key => $val) {
            $rel = static::relations($key);
            if ($rel->singular) {
                // fix coming from the latest version of 1.6/master orm (unable to merge at the moment)
                $new_pk = null;
                if (empty($this->_original_relations[$key]) !== empty($val)
                    or ( ! empty($this->_original_relations[$key]) and ! empty($val)
                        and $this->_original_relations[$key] !== $new_pk = $val->implode_pk($val)
                    )) {
                    $diff[0][$key] = isset($this->_original_relations[$key]) ? $this->_original_relations[$key] : null;
                    $diff[1][$key] = isset($val) ? $new_pk : null;
                }
            } else {
                $original_pks = empty($this->_original_relations[$key]) ? array() : $this->_original_relations[$key];
                $new_pks = array();
                if ($val) {
                    foreach ($val as $v) {
                        if (!in_array(($new_pk = $v->implode_pk($v)), $original_pks)) {
                            $new_pks[] = $new_pk;
                        } else {
                            $original_pks = array_diff($original_pks, array($new_pk));
                        }
                    }
                }
                if (!empty($original_pks) or ! empty($new_pks)) {
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
    public function __clone()
    {
        parent::__clone();
        $providers = array();

        foreach ($this->providers() as $name => $provider) {
            $providers[$name] = array();
            foreach ($this->{$name} as $key => $item) {
                if (!empty($item)) {
                    $providers[$name][$key] = $item;
                }
            }
        }
        $this->initProviders();

        foreach ($providers as $name => $provider) {
            foreach ($provider as $key => $item) {
                $this->{$name}->{$key} = $item;
            }
        }

        $this->event('afterClone');
    }

    protected function initProviders()
    {
        foreach ($this->providers() as $name => $provider) {
            $this->providers[$name] = new Model_Provider($this, $provider);
        }
    }

    public function __sleep()
    {
        return array('_data', '_is_new');
    }

    public function __wakeup()
    {
        $this->initProviders();
    }
}

class Model_Provider implements \Iterator
{
    protected $parent;
    protected $provider;
    protected $iterator = array();

    public function __construct($parent, $provider)
    {
        $this->parent = $parent;
        $this->provider = $provider;
    }

    public function & __get($value)
    {
        // Reuse the getter and fetch the provider directly
        $item = $this->parent->{$this->provider['name'].'->'.$value};
        if ($item === null) {
            // Don't return null, we need a reference here
            return $item;
        }

        if (!empty($this->provider['value_relation'])) {
            return $item->get($this->provider['value_relation']);
        }
        return $item->get($this->provider['value_property']);
    }

    public function __set($property, $value)
    {
        $relation = $this->parent->relations($this->provider['relation']);
        $model_to = $relation->model_to;

        if (!empty($this->provider['value_relation'])) {
            $value_relation = $model_to::relations($this->provider['value_relation']);
            $value_model_to = $value_relation->model_to;

            $value = (string) ($value instanceof $value_model_to ? $value->{$value_relation->key_to[0]} : $value);

            // Check existence of the item, the ORM will throw an exception anyway upon save if it doesn't exists
            if (!empty($value)) {
                $item = $value_model_to::find($value);
                if (is_null($item)) {
                    $pk = $this->parent->primary_key();
                    throw new \Exception(
                        'The '.$this->provider['name'].' with ID '.$value.' doesn\'t exists, cannot assign it as "'.
                        $property.'" for '.\Inflector::denamespace(
                            get_class($this->parent)
                        ).'('.$this->parent->{$pk[0]}.')'
                    );
                }
            }
        } else {
            $value = (string) ($value instanceof $model_to ? $value->{$this->provider['value_property']} : $value);
        }

        // Reuse the getter
        $item_link = $this->parent->{$this->provider['name'].'->'.$property};

        // Create the new relation if it doesn't exists yet
        if (is_null($item_link)) {
            $this->parent->{$this->provider['name'].'->'.$property} = $value;
            return;
        }

        // Update an existing relation
        $item_link->set($this->provider['value_property'], $value);

        // Don't save the link here, it's done with cascade_save = true
    }

    public function __isset($value)
    {
        $value = $this->__get($value);
        return (!empty($value));
    }

    public function __unset($name)
    {
        $this->__set($name, null);
    }

    public function rewind()
    {
        $keys = array();
        foreach ($this->parent->{$this->provider['relation']} as $item) {
            if ($this->__get($item->{$this->provider['key_property']}) !== null) {
                $keys[] = $item->{$this->provider['key_property']};
            }
        }
        $this->iterator = $keys;
        reset($keys);
    }

    public function current()
    {
        return $this->__get(current($this->iterator));
    }

    public function key()
    {
        return current($this->iterator);
    }

    public function next()
    {
        next($this->iterator);
    }

    public function valid()
    {
        return false !== current($this->iterator);
    }

    public function setParent($obj)
    {
        $this->parent = $obj;
    }
}
