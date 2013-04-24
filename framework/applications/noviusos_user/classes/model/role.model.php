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

class Model_Role extends \Nos\Orm\Model
{
    protected static $_table_name = 'nos_role';
    protected static $_primary_key = array('role_id');

    protected static $_title_property = 'role_name';
    protected static $_properties = array(
        'role_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
        'role_name' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'role_user_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
    );

    protected static $permissions;

    protected static $_belongs_to = array();
    protected static $_has_one = array();

    protected static $_many_many = array(
        'users' => array(
            'key_from' => 'role_id',
            'key_through_from' => 'role_id',
            'table_through' => 'nos_user_role',
            'key_through_to' => 'user_id',
            'model_to' => 'Nos\User\Model_User',
            'key_to' => 'user_id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_has_many = array(
        'permissions' => array(
            'key_from' => 'role_id',
            'model_to' => 'Nos\User\Model_Permission',
            'key_to' => 'perm_role_id',
            'cascade_save' => false,
            'cascade_delete' => true, // Won't be used until ORM 1.6, @see _event_before_delete()
        ),
    );

    public function _event_before_delete()
    {
        // @todo delete this method when upgrading the ORM to 1.6
        // The FK on permission is part of the primary key so it doesn't work in 1.5
        // https://github.com/fuel/orm/commit/a17324bf1912b36f9413306d017a39db1003b978
        foreach ($this->permissions as $permission) {
            $permission->delete();
        }
        unset($this->permissions);
    }

    /**
     * @deprecated
     */
    public function check_permission($application, $key)
    {
        logger(\Fuel::L_WARNING, '\Nos\User\Model_Role->check_permission($application, $key) is deprecated. Please use \Nos\User\Model_Role->checkPermission($permission_name, $category_key).');

        return $this->checkPermission($application, $key);
    }

    /**
     * @param   string       $permission_name  Name of the permission to check against
     * @param   null|string  $category_key     (optional) If the permission has categories, the category key to check against
     * @return  bool  Has the role the required authorisation?
     */
    public function checkPermission($permission_name, $category_key = null)
    {
        if (!$this->_authorised($permission_name)) {
            return false;
        }

        // For permissions without category, just check the existence of the permission
        $isset = isset(static::$permissions[$this->role_id][$permission_name]);
        if ($category_key == null) {
            return $isset;
        }

        // For permission with categories, also check the existence of the category
        return $isset && in_array($category_key, static::$permissions[$this->role_id][$permission_name]);
    }

    /**
     * List all the categories of a given permission name. Returns an array of string or false when the role has not
     * access, or the permission name does not exists.
     *
     * @param   string  $permission_name  The name of the permission to retrieve categories from
     * @return  array|false   An array containing the list of categories (values) for the request permission name
     */
    public function listPermissionCategories($permission_name)
    {
        if (!$this->_authorised($permission_name)) {
            return false;
        }
        return isset(static::$permissions[$this->role_id][$permission_name]) ? static::$permissions[$this->role_id][$permission_name] : false;
    }

    protected function _authorised($permission_name)
    {
        // Retrieve application name based on the permission name ('noviusos_page::test' would return 'noviusos_page')
        list($application, ) = explode($permission_name.'::', 2);
        // If this application is loaded, check the user has access to it
        if (\Module::loaded($application) && !$this->checkPermission('nos::access', $application)) {
            return false;
        }

        // Load permissions from the database
        if (!isset(static::$permissions[$this->role_id])) {
            $query = \Db::query('SELECT * FROM nos_role_permission WHERE perm_role_id = '.\Db::quote($this->role_id));
            foreach ($query->as_object()->execute() as $permission) {
                static::$permissions[$this->role_id][$permission->perm_name][] = $permission->perm_category_key;
            }
        }
        return true;
    }
}
