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

class Orm_Behaviour_Virtualpath extends Orm_Behaviour_Virtualname
{
    public static function _init()
    {
        I18n::current_dictionary('nos::orm');
    }

    protected $_parent_relation = null;

    protected $_properties = array();
    protected $_data_diff = array();

    public function __construct($class)
    {
        parent::__construct($class);
        $this->_properties['unique_path'] = $this->_properties['unique'];
        $this->_properties['unique'] = false;
        if (is_array($this->_properties['extension_property'])) {
            $this->_properties['extension_property'] = array_merge(array(
                'before' => '.',
                'after' => '',
            ), $this->_properties['extension_property']);

            if (empty($this->_properties['extension_property']['property'])) {
                throw new \Exception('Extension property not found by virtualname behaviour: '.$this->_class);
            }
        }

        $tree = $class::behaviours('Nos\Orm_Behaviour_Tree', false);
        if (!empty($tree)) {
            $this->_properties['level_property'] = \Arr::get($tree, 'level_property', false);
        }

        if (!empty($tree) && empty($this->_properties['parent_relation'])) {
            $this->_properties['parent_relation'] = \Arr::get($tree, 'parent_relation', false);
        }

        if (!empty($this->_properties['parent_relation'])) {
            $this->_parent_relation = $class::relations($this->_properties['parent_relation']);
        }

        if (empty($this->_parent_relation)) {
            throw new \Exception('Relation "parent" not found by virtualname behaviour: '.$this->_class);
        }
    }

    public function check_uniqueness(\Nos\Orm\Model $item)
    {
        if ($this->_properties['unique_path']) {
            $where = array(
                array($this->_properties['virtual_path_property'], $item->{$this->_properties['virtual_path_property']})
            );
            if (is_array($this->_properties['unique_path']) && !empty($this->_properties['unique_path']['context_property'])) {
                $where[] = array($this->_properties['unique_path']['context_property'], '=', $item->{$this->_properties['unique_path']['context_property']});
            }
            if (!$item->is_new()) {
                $pk = \Arr::get($item::primary_key(), 0);
                $where[] = array($pk, '!=', $item->{$pk});
            }

            $duplicate = $item::find('all', (array('where' => $where)));
            if (!empty($duplicate)) {
                throw new BehaviourDuplicateException(__('This URL is already used. Since an URL must be unique, you’ll have to choose another one. Sorry about that.'));
            }
        }
    }

    public function check_change_parent(\Nos\Orm\Model $item)
    {
        $new_parent = $item->get_parent();

        $parent_path = $new_parent !== null ? $new_parent->{$this->_properties['virtual_path_property']} : '';
        if (!empty($this->_properties['extension_property']) && !empty($parent_path)) {
            $parent_path = preg_replace('`'.$this->extension($item).'$`iUu', '', $parent_path).'/';
        }
        $item->{$this->_properties['virtual_path_property']} = $parent_path;
        $item->{$this->_properties['virtual_path_property']} .= $item->{$this->_properties['virtual_name_property']};
        if (!empty($this->_properties['extension_property'])) {
            $item->{$this->_properties['virtual_path_property']} .= $this->extension($item);
        }

        $this->check_uniqueness($item);
    }

    public function before_save(\Nos\Orm\Model $item)
    {
        parent::before_save($item);
        $diff = $item->get_diff();

        $virtual_path_property = $this->_properties['virtual_path_property'];
        $virtual_name_property = $this->_properties['virtual_name_property'];

        // If the parent changes, then the virtual path changes
        $key_from = $this->_parent_relation->key_from[0];
        // Compare $diff[0] and $diff[1] because the former can be (string) and latter (int), even if it's the same value
        $parent_has_changed = array_key_exists($key_from, $diff[0]) && $diff[0][$key_from] != $diff[1][$key_from];

        $dir_name_virtual_path = false;
        $old_extension = $this->extension($item, true);
        $new_extension = $this->extension($item);
        if ($item->is_new() || $parent_has_changed) {
            // Item is new or its parent has changed : retrieve virtual path dir name
            $class = $this->_parent_relation->model_to;
            $parent = null;
            if (!empty($item->{$this->_parent_relation->key_from[0]})) {
                $parent = $class::find($item->{$this->_parent_relation->key_from[0]});
            }
            $dir_name_virtual_path = ($parent !== null ? $parent->virtual_path(true) : '');
        } else if (!empty($diff[1][$virtual_name_property]) || $old_extension != $new_extension) {
            // Item's virtual name has changed : set virtual path dir name
            $old_virtual_name = empty($diff[0][$virtual_name_property]) ? $this->virtual_name($item) : $diff[0][$virtual_name_property];
            $old_virtual_path = empty($diff[0][$virtual_path_property]) ? $item->{$virtual_path_property} : $diff[0][$virtual_path_property];
            $dir_name_virtual_path = mb_substr($old_virtual_path, 0, - mb_strlen($old_virtual_name.$old_extension));
        }
        // Item's virtual path has changed : set is new virtual path, update and save diff array, check uniqueness
        if ($dir_name_virtual_path !== false) {
            if (!isset($diff[0][$virtual_path_property])) {
                $diff[0][$virtual_path_property] = $item->{$virtual_path_property};
            }
            $item->observe('before_change_virtual_path');
            $item->{$virtual_path_property} = $dir_name_virtual_path.$this->virtual_name($item).$new_extension;
            $diff[1][$virtual_path_property] = $item->{$virtual_path_property};
            $this->_data_diff[$item::implode_pk($item)] = $diff;

            $this->check_uniqueness($item);
        }
    }

    public function after_save(\Nos\Orm\Model $item)
    {
        $tree = $item::behaviours('Nos\Orm_Behaviour_Tree', false);
        // Class not have tree behaviour, don't have children to update
        if (empty($tree)) {
            return;
        }

        $virtual_path_property = $this->_properties['virtual_path_property'];
        if (isset($this->_data_diff[$item::implode_pk($item)])) {
            $diff = $this->_data_diff[$item::implode_pk($item)];

            $old_virtual_path = $diff[0][$virtual_path_property];
            if (!empty($this->_properties['extension_property'])) {
                $old_virtual_path = preg_replace('`'.preg_quote($this->extension($item, true)).'$`iUu', '/', $old_virtual_path);
            }
            $new_virtual_path = $this->virtual_path($item, true);

            // Change the virtual path for all items
            $replaces = array(
                $virtual_path_property => \DB::expr('REPLACE('.$virtual_path_property.', '.\DB::escape($old_virtual_path).', '.\DB::escape($new_virtual_path).')'),
            );

            // Level property also could have to be updated
            $level_property = \Arr::get($this->_properties, 'level_property', null);
            if (!empty($level_property)) {
                $diff_level = \Arr::get($diff[0], $level_property, $item->{$level_property}) - $item->{$level_property};
                if ($diff_level != 0) {
                    $replaces[$level_property] = \DB::expr($level_property.' '.($diff_level > 0 ? '-' : '+').' '.abs($diff_level));
                }
            }

            $update = \DB::update($item->table())
                ->set($replaces)
                ->where($virtual_path_property, 'LIKE', $old_virtual_path.'%');
                
            if (is_array($this->_properties['unique_path']) && !empty($this->_properties['unique_path']['context_property'])) {
                $update->where($this->_properties['unique_path']['context_property'], '=', $item->{$this->_properties['unique_path']['context_property']});
            }
            
            $update->execute();

            $item->observe('after_change_virtual_path');
        }
    }

    public function virtual_path(\Nos\Orm\Model $item, $dir = false)
    {
        if (!empty($this->_properties['virtual_path_property'])) {
            $path = $item->{$this->_properties['virtual_path_property']};
        } else {
            $path = '';
        }
        if ($dir) {
            $path = preg_replace('`'.preg_quote($this->extension($item)).'$`iUu', '', $path).'/';
        }

        return $path;
    }

    public function extension(\Nos\Orm\Model $item, $old = false)
    {
        if (!empty($this->_properties['extension_property'])) {
            if (is_array($this->_properties['extension_property'])) {
                $ext = $item->{$this->_properties['extension_property']['property']};
                if ($old) {
                    $diff = $item->get_diff();
                    if (!empty($diff[0][$this->_properties['extension_property']['property']])) {
                        $ext = $diff[0][$this->_properties['extension_property']['property']];
                    }
                }

                return $this->_properties['extension_property']['before'].$ext.$this->_properties['extension_property']['after'];
            } else {
                return $this->_properties['extension_property'];
            }
        }
        return '';
    }
}
