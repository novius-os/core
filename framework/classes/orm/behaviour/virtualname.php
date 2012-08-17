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

    public function before_save(\Nos\Orm\Model $object) {
        $diff = $object->get_diff();

        if (!empty($diff[0][$this->_properties['virtual_name_property']])) {
            $object->{$this->_properties['virtual_name_property']} = static::friendly_slug($object->{$this->_properties['virtual_name_property']});
            if (empty($object->{$this->_properties['virtual_name_property']})) {
                $object->{$this->_properties['virtual_name_property']} = static::friendly_slug($object->{$object->title_property()});
            }
            if (empty($object->{$this->_properties['virtual_name_property']})) {
                throw new \Exception(__('URL (SEO) was empty.'));
            }
        }
    }

    public function virtual_name(\Nos\Orm\Model $object) {
        return $object->{$this->_properties['virtual_name_property']};
    }

    public static function friendly_slug($slug) {

        $slug = preg_replace("` `u", '-', $slug);
        $slug = preg_replace("`[\?|:|\\|\/|\#|\[|\]|@]`u", '-', $slug);
        $slug = preg_replace("`-{2,}`u", '-', $slug);
        $slug = preg_replace("`-$`u", '', $slug);
        $slug = preg_replace("`^-`u", '', $slug);
        $slug = \Str::lower($slug);

        return $slug;
    }
}