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

use Nos\Orm\Model;

class Orm_Behaviour_DataMany extends Orm_Behaviour
{
    protected static $_former_ids = array();

    /**
     * methods below check if some keys won't be used anymore in order to delete them afterward
     */

    public function before_save(Model $item) {
        $relation = $this->_properties['relation'];
        $diff = $item->get_diff();
        if (!empty($diff[0]) && !empty($diff[0][$relation])) {
            $class = get_class($item);
            $pk = implode('.', (array) $item->primary_key());//primary key is an array
            $new_keys = array_keys($item->{$relation});
            static::$_former_ids[$class.'::'.$pk] = array_diff($diff[0][$relation], $new_keys);
        }
    }

    public function after_save(Model $item) {
        $this->to_delete($item);
    }

    public function to_delete(Model $item) {
        $class = get_class($item);
        $pk = implode('.', (array) $item->primary_key());//primary key is an array
        $former_keys = static::$_former_ids[$class.'::'.$pk];
        $delete = !empty($former_keys);
        if ($delete) {
            $relation_name = $this->_properties['relation'];
            $relation = $item->relations($relation_name);
            $model = $relation->model_to;
            $query = \DB::delete($model::table());
            foreach ($former_keys as $key) {
                $ids = explode('][', substr($key, 1, -1));
                $query->or_where_open();
                reset($ids);
                foreach($model::primary_key() as $pkey) {
                    $query->where($pkey, current($ids));
                    next($ids);
                }
                $query->or_where_close();
            }
            $query->execute();
        }
    }

    public function before_delete(Model $item) {
        $class = get_class($item);
        $pk = implode('.', (array) $item->primary_key());//primary key is an array
        $relation = $this->_properties['relation'];
        static::$_former_ids[$class.'::'.$pk] = array_keys($item->{$relation});
        $item->{$relation} = array();
    }

    public function after_delete(Model $item) {
        $this->to_delete($item);
    }
}
