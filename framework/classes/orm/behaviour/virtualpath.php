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
        if (is_array($this->_properties['extension_property']))
        {
            $this->_properties['extension_property'] = array_merge(array(
                'before' => '.',
                'after' => '',
            ), $this->_properties['extension_property']);

            if (empty($this->_properties['extension_property']['property']))
            {
                throw new \Exception('Extension property not found by virtualname behaviour: '.$this->_class);
            }
        }

        if (!empty($this->_properties['parent_relation']))
        {
            $this->_parent_relation = $class::relations($this->_properties['parent_relation']);
        }

        if (false === $this->_parent_relation)
        {
            throw new \Exception('Relation "parent" not found by virtualname behaviour: '.$this->_class);
        }
    }

    public function change_parent(\Nos\Orm\Model $object) {
        $parent = $object->get_parent();
        $parent_path = $parent !== null ? $parent->{$this->_properties['virtual_path_property']} : '';
        if (!empty($this->_properties['extension_property']) && !empty($parent_path)) {
            $parent_path = preg_replace('`'.$this->extension($object).'$`iUu', '', $parent_path).'/';
        }
        $object->{$this->_properties['virtual_path_property']} = $parent_path;
        $object->{$this->_properties['virtual_path_property']} .= $object->{$this->_properties['virtual_name_property']};
        if (!empty($this->_properties['extension_property'])) {
            $object->{$this->_properties['virtual_path_property']} .= $this->extension($object);
        }
    }

    public function before_save(\Nos\Orm\Model $object) {
        $diff = $object->get_diff();

        if (!$object::behaviours('Nos\Orm_Behaviour_Tree', false) && !empty($this->_parent_relation))
        {
            if (array_key_exists($this->_parent_relation->key_from[0], $diff[0]))
            {
                $class = $this->_parent_relation->model_to;
                $parent = null;
                if (!empty($object->{$this->_parent_relation->key_from[0]})) {
                    $parent = $class::find($object->{$this->_parent_relation->key_from[0]});
                }
                $object->{$this->_properties['virtual_path_property']} = $parent !== null ? $parent->virtual_path(true) : '';
                $object->{$this->_properties['virtual_path_property']} .= $object->{$this->_properties['virtual_name_property']};
                if (!empty($this->_properties['extension_property'])) {
                    $object->{$this->_properties['virtual_path_property']} .= $this->extension($object);
                }
            }
        }

        parent::before_save($object);

        if (!empty($diff[0][$this->_properties['virtual_name_property']])) {
            $diff[0][$this->_properties['virtual_path_property']] = $object->{$this->_properties['virtual_path_property']};
            $old_name = $diff[0][$this->_properties['virtual_name_property']];
            $new_name = $object->{$this->_properties['virtual_name_property']};
            if (!empty($this->_properties['extension_property'])) {
                $old_name .= $this->extension($object, true);
                $new_name .= $this->extension($object);
            }
            $object->{$this->_properties['virtual_path_property']} = preg_replace('`'.$old_name.'$`iUu', $new_name, $object->{$this->_properties['virtual_path_property']});
            $diff[1][$this->_properties['virtual_path_property']] = $object->{$this->_properties['virtual_path_property']};
            $this->_data_diff[$object->{$this->_properties['virtual_path_property']}] = $diff;
        }

        if (!empty($diff[0][$this->_properties['virtual_path_property']])) {
            $where = array(
                array($this->_properties['virtual_path_property'], $object->{$this->_properties['virtual_path_property']})
            );
            if (!$object->is_new()) {
                $pk = \Arr::get($object::primary_key(), 0);
                $where[] = array($pk, '!=', $object->{$pk});
            }

            $duplicate = $object::find('all', (array('where' => $where)));
            if (!empty($duplicate)) {
                throw new \Exception(__('A item with the same path already exists.'));
            }
        }
    }

    public function after_save(\Nos\Orm\Model $object) {
        if (isset($this->_data_diff[$object->{$this->_properties['virtual_path_property']}])) {
            $diff = $this->_data_diff[$object->{$this->_properties['virtual_path_property']}];

            $old_virtual_url = $diff[0][$this->_properties['virtual_path_property']];
            if (!empty($this->_properties['extension_property'])) {
                $old_virtual_url = preg_replace('`'.$this->extension($object).'$`iUu', '/', $old_virtual_url);
            }
            $new_virtual_url = preg_replace('`'.$diff[0][$this->_properties['virtual_name_property']].'/$`iUu', $object->{$this->_properties['virtual_name_property']}.'/', $old_virtual_url);
            \DB::update($object->table())
                    ->set(array(
                $this->_properties['virtual_path_property'] => \DB::expr('REPLACE('.$this->_properties['virtual_path_property'].', '.\DB::escape($old_virtual_url).', '.\DB::escape($new_virtual_url).')'),
                ))
                ->where($this->_properties['virtual_path_property'], 'LIKE', $old_virtual_url.'%')
                ->execute();
        }
    }

    public function virtual_path(\Nos\Orm\Model $object, $dir = false) {
        if (!empty($this->_properties['virtual_path_property']))
        {
            $path = $object->{$this->_properties['virtual_path_property']};
        }
        else
        {
            $path = '';
        }
        if ($dir)
        {
            $path = preg_replace('`'.$this->extension($object).'$`iUu', '', $path).'/';
        }
        return $path;
    }

    public function extension(\Nos\Orm\Model $object, $old = false) {
        if (!empty($this->_properties['extension_property']))
        {
            if (is_array($this->_properties['extension_property']))
            {
                $ext = $object->{$this->_properties['extension_property']['property']};
                if ($old)
                {
                    $diff = $object->get_diff();
                    if (!empty($diff[0][$this->_properties['extension_property']['property']]))
                    {
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