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
    protected $_parent_relation = null;

    protected $_properties = array();
    protected $_data_diff = array();

    public function __construct($class)
    {
        parent::__construct($class);
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

        if (!empty($this->_properties['parent_relation'])) {
            $this->_parent_relation = $class::relations($this->_properties['parent_relation']);
        }

        if (false === $this->_parent_relation) {
            throw new \Exception('Relation "parent" not found by virtualname behaviour: '.$this->_class);
        }
    }

    public function change_parent(\Nos\Orm\Model $item)
    {
        $parent = $item->get_parent();
        $parent_path = $parent !== null ? $parent->{$this->_properties['virtual_path_property']} : '';
        if (!empty($this->_properties['extension_property']) && !empty($parent_path)) {
            $parent_path = preg_replace('`'.$this->extension($item).'$`iUu', '', $parent_path).'/';
        }
        $item->{$this->_properties['virtual_path_property']} = $parent_path;
        $item->{$this->_properties['virtual_path_property']} .= $item->{$this->_properties['virtual_name_property']};
        if (!empty($this->_properties['extension_property'])) {
            $item->{$this->_properties['virtual_path_property']} .= $this->extension($item);
        }
    }

    public function before_save(\Nos\Orm\Model $item)
    {
        $diff = $item->get_diff();

        if (!$item::behaviours('Nos\Orm_Behaviour_Tree', false) && !empty($this->_parent_relation)) {
            if (array_key_exists($this->_parent_relation->key_from[0], $diff[0])) {
                $class = $this->_parent_relation->model_to;
                $parent = null;
                if (!empty($item->{$this->_parent_relation->key_from[0]})) {
                    $parent = $class::find($item->{$this->_parent_relation->key_from[0]});
                }
                $item->{$this->_properties['virtual_path_property']} = $parent !== null ? $parent->virtual_path(true) : '';
                $item->{$this->_properties['virtual_path_property']} .= $item->{$this->_properties['virtual_name_property']};
                if (!empty($this->_properties['extension_property'])) {
                    $item->{$this->_properties['virtual_path_property']} .= $this->extension($item);
                }
            }
        }

        parent::before_save($item);

        if (!empty($diff[0][$this->_properties['virtual_name_property']])) {
            $diff[0][$this->_properties['virtual_path_property']] = $item->{$this->_properties['virtual_path_property']};
            $old_name = $diff[0][$this->_properties['virtual_name_property']];
            $new_name = $item->{$this->_properties['virtual_name_property']};
            if (!empty($this->_properties['extension_property'])) {
                $old_name .= $this->extension($item, true);
                $new_name .= $this->extension($item);
            }
            $item->{$this->_properties['virtual_path_property']} = preg_replace('`'.$old_name.'$`iUu', $new_name, $item->{$this->_properties['virtual_path_property']});
            $diff[1][$this->_properties['virtual_path_property']] = $item->{$this->_properties['virtual_path_property']};
            $this->_data_diff[$item->{$this->_properties['virtual_path_property']}] = $diff;
        }

        if (!empty($diff[0][$this->_properties['virtual_path_property']])) {
            $where = array(
                array($this->_properties['virtual_path_property'], $item->{$this->_properties['virtual_path_property']})
            );
            if (!$item->is_new()) {
                $pk = \Arr::get($item::primary_key(), 0);
                $where[] = array($pk, '!=', $item->{$pk});
            }

            $duplicate = $item::find('all', (array('where' => $where)));
            if (!empty($duplicate)) {
                throw new \Exception(__('A item with the same path already exists.'));
            }
        }
    }

    public function after_save(\Nos\Orm\Model $item)
    {
        if (isset($this->_data_diff[$item->{$this->_properties['virtual_path_property']}])) {
            $diff = $this->_data_diff[$item->{$this->_properties['virtual_path_property']}];

            $old_virtual_url = $diff[0][$this->_properties['virtual_path_property']];
            if (!empty($this->_properties['extension_property'])) {
                $old_virtual_url = preg_replace('`'.$this->extension($item).'$`iUu', '/', $old_virtual_url);
            }
            $new_virtual_url = preg_replace('`'.$diff[0][$this->_properties['virtual_name_property']].'/$`iUu', $item->{$this->_properties['virtual_name_property']}.'/', $old_virtual_url);
            \DB::update($item->table())
                    ->set(array(
                $this->_properties['virtual_path_property'] => \DB::expr('REPLACE('.$this->_properties['virtual_path_property'].', '.\DB::escape($old_virtual_url).', '.\DB::escape($new_virtual_url).')'),
                ))
                ->where($this->_properties['virtual_path_property'], 'LIKE', $old_virtual_url.'%')
                ->execute();
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
            $path = preg_replace('`'.$this->extension($item).'$`iUu', '', $path).'/';
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
    }
}
