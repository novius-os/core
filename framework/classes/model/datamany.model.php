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

abstract class Model_DataMany extends \Nos\Orm\Model
{
    protected static $_table_name = '';
    protected static $_primary_key = array();//two keys refering to two models
    protected static $_properties = array(
        //the two keys above and data added to the simulated relation
    );
    
    //relation names used to create the link with data between two models
    protected static $_rel_to_name = '';

    protected static $_has_one = array(
    );

    protected static $_belongs_to = array(
    );

    //related model (optional)
    protected static $_model_to = '';


    public static function _init() {
        //First set the name of the has_one relation if needed
        if (empty(static::$_rel_to_name)) {
            static::$_rel_to_name = reset(array_keys(static::$_has_one));//get the first "has_one" relation and assume it's the right one
        }
        //Then set the related model
        if (empty(static::$_model_to)) {
            $relation_to = static::$_has_one[static::$_rel_to_name];
            if (empty($relation_to)) {
                throw new \FuelException('A related model is needed in a has_one relation for '.get_called_class());
            }
            static::$_model_to = $relation_to['model_to'];
        }
    }


    /**
     * get on the model or on the related model
     * => when trying to have access to a related model, there's no need to use two linked relation, just one is needed
     * @param $name string : a property
     * @return mixed|Orm\Model|null : the value of the corresponding property
     */
    public function & __get($name)
    {
        try {
            return parent::__get($name);
        } catch (\OutOfBoundsException $e) {
            //if the Model_DataMany does not have such a property, try to retrieve it from the related model
            $model_to = static::$_model_to;
            if ((array_key_exists($name, $model_to::properties())
                    || array_key_exists($name, $model_to::relations()))
                && !empty($this->{static::$_rel_to_name})) {
                return $this->{static::$_rel_to_name}->get($name);
            }
            throw new \OutOfBoundsException('Property "'.$name.'" not found for '.get_class($this).' or its related model.');
        }
    }
}
