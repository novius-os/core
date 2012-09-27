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

class Orm_Behaviour_Virtualname extends Orm_Behaviour
{
    protected $_properties = array();

    public function __construct($class)
    {
        parent::__construct($class);
        if (!isset($this->_properties['unique'])) {
            $this->_properties['unique'] = 'context';
        }
        if ($this->_properties['unique'] === 'context') {
            $this->_properties['unique'] = $class::behaviours('Nos\Orm_Behaviour_Translatable', true);
        }
    }

    public function before_save(\Nos\Orm\Model $item)
    {
        $diff = $item->get_diff();

        if (!empty($diff[0][$this->_properties['virtual_name_property']])) {
            $item->{$this->_properties['virtual_name_property']} = static::friendly_slug($item->{$this->_properties['virtual_name_property']});
            if (empty($item->{$this->_properties['virtual_name_property']})) {
                $item->{$this->_properties['virtual_name_property']} = static::friendly_slug($item->{$item->title_property()});
            }
            if (empty($item->{$this->_properties['virtual_name_property']})) {
                throw new \Exception(__('URL (SEO) was empty.'));
            }

            if ($this->_properties['unique']) {
                $where = array(
                    array($this->_properties['virtual_name_property'], $item->{$this->_properties['virtual_name_property']})
                );
                if (is_array($this->_properties['unique']) && !empty($this->_properties['unique']['context_property'])) {
                    $where[] = array($this->_properties['unique']['context_property'], '=', $item->{$this->_properties['unique']['context_property']});
                }
                if (!$item->is_new()) {
                    $pk = \Arr::get($item::primary_key(), 0);
                    $where[] = array($pk, '!=', $item->{$pk});
                }

                $duplicate = $item::find('all', (array('where' => $where)));
                if (!empty($duplicate)) {
                    throw new \Exception(__('A item with the same virtual name already exists.'));
                }
            }
        }
    }

    public function virtual_name(\Nos\Orm\Model $item)
    {
        return $item->{$this->_properties['virtual_name_property']};
    }

    public static function friendly_slug($slug)
    {
        $slug = preg_replace("` `u", '-', $slug);
        $slug = preg_replace("`[\?|:|\\|\/|\#|\[|\]|@]`u", '-', $slug);
        $slug = preg_replace("`-{2,}`u", '-', $slug);
        $slug = preg_replace("`-$`u", '', $slug);
        $slug = preg_replace("`^-`u", '', $slug);
        $slug = \Str::lower($slug);

        return $slug;
    }
}
