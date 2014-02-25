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
    protected static $_rel_from_name = '';

    protected static $_has_one = array(
        //has one works the same way as a belongs to, it will be used to determine properties
    );

    protected static $_belongs_to = array(
    );

    /**
     * get on the model or on the related model
     * => when trying to have access to a related model, there's no need to use two linked relation, just one is needed
     * @param $name string : a property
     * @return mixed|Orm\Model|null : the value of the corresponding property
     */
    public function & __get($name)
    {
        if (empty(static::$_rel_to_name)) {
            static::$_rel_to_name = reset(array_keys(static::$_has_one));//get the first "has_one" relation and assume it's the right one
        }
        $relation_to = static::$_has_one[static::$_rel_to_name];
        if (empty($relation_to)) {
            throw new \FuelException('A related model is needed in a has_one relation for '.get_called_class());
        }
        $model_to = $relation_to['model_to'];

        if (empty(static::$_rel_from_name)) {
            static::$_rel_from_name = reset(array_keys(static::$_belongs_to));//get the first "belongs_to" relation and assume it's the right one
        }
        $relation_from = static::$_belongs_to[static::$_rel_from_name];
        if (empty($relation_from)) {
            throw new \FuelException('A related model is needed in a belongs_to relation for '.get_called_class());
        }
        $model_from = $relation_from['model_to'];


        if ((array_key_exists($name, $model_to::properties())
                || array_key_exists($name, $model_to::relations()))
            && !empty($this->{static::$_rel_to_name})) {
            return $this->{static::$_rel_to_name}->get($name);
        } elseif ((array_key_exists($name, $model_from::properties())
                || array_key_exists($name, $model_from::relations()))
            && !empty($this->{static::$_rel_from_name})) {
            return $this->{static::$_rel_from_name}->get($name);
        }
        return parent::__get($name);
    }
}
