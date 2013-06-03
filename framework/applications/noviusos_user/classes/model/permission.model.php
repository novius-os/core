<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\User;

class Model_Permission extends \Nos\Orm\Model
{
    protected static $_table_name = 'nos_role_permission';

    protected static $_primary_key = array('perm_role_id', 'perm_name', 'perm_category_key');

    protected static $_has_many = array();
    protected static $_has_one = array();
    protected static $_many_many = array();

    protected static $_title_property = 'perm_name';
    protected static $_properties = array(
        'perm_role_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
        'perm_name' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'perm_category_key' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
    );

    protected static $_observers = array(
        'Orm\\Observer_Self',
    );

    protected static $_belongs_to = array(
        'role' => array(
            'key_from' => 'perm_role_id',
            'model_to' => 'Nos\User\Model_Role',
            'key_to' => 'role_id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    public function _event_before_delete()
    {
        $role = $this->role;
        // If the sibling relation exists, break it
        if (isset($role->permissions)) {
            unset($role->permissions[static::implode_pk($this)]);
        }
        \Cache::delete('role_permissions.'.$this->perm_role_id);
    }

    public function _event_after_save()
    {
        \Cache::delete('role_permissions.'.$this->perm_role_id);
    }
}
