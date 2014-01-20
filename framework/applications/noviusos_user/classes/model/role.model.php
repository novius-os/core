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

    protected static $_has_one = array();
    protected static $_belongs_to  = array();
    protected static $_twinnable_has_one = array();
    protected static $_twinnable_has_many = array();
    protected static $_twinnable_belongs_to = array();
    protected static $_twinnable_many_many = array();

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

    protected static $_observers = array(
        'Orm\\Observer_Self',
    );

    public function _event_before_delete()
    {
        // @todo change upon FuelPHP feedback, only loaded relations will get deleted
        // Load the relation
        $this->permissions;
    }

    public function _event_after_save()
    {
        \Cache::delete('role_permissions.'.$this->role_id);
    }

    /**
     * @deprecated
     */
    public function check_permission($application, $key)
    {
        \Log::deprecated('->check_permission($application, $key) is deprecated, use ->checkPermission($permission_name, $category_key) instead.', 'Chiba.2');

        return $this->checkPermission($application, $key);
    }

    /**
     * @param   string       $permissionName  Name of the permission to check against
     * @param   null|string  $categoryKey     (optional) If the permission has categories, the category key to check against
     * @param   bool         $allowEmpty       (optional) If the permission has categories, authorise the chosen category if it's not configured (useful for default value)
     * @return  bool  Has the role the required authorisation?
     */
    public function checkPermission($permissionName, $categoryKey = null, $allowEmpty = false)
    {
        if (!$this->_authorised($permissionName)) {
            return false;
        }

        // For permissions without category, just check the existence of the permission
        $isset = isset(static::$permissions[$this->role_id][$permissionName]);
        if ($categoryKey == null) {
            return $isset;
        }

        // For permission with categories, also check the existence of the category
        if ($allowEmpty && !$isset) {
            return true;
        }
        return $isset && in_array($categoryKey, static::$permissions[$this->role_id][$permissionName]);
    }

    /**
     * List all the categories of a given permission name. Returns an array of string or false when the role has not
     * access, or the permission name does not exists.
     *
     * @param   string  $permission_name  The name of the permission to retrieve categories from
     * @return  array|false   An array containing the list of categories (values) for the requested permission name
     */
    public function listPermissionCategories($permission_name)
    {
        if (!$this->_authorised($permission_name)) {
            return false;
        }
        return isset(static::$permissions[$this->role_id][$permission_name]) ? static::$permissions[$this->role_id][$permission_name] : false;
    }

    public function checkPermissionOrEmpty($permissionName, $categoryKey)
    {
        return $this->checkPermission($permissionName, $categoryKey, true);
    }

    public function checkPermissionExists($permissionName, $categoryKey, $allowEmpty = false)
    {
        return $this->checkPermission($permissionName, $categoryKey, $allowEmpty);
    }

    public function checkPermissionExistsOrEmpty($permissionName, $categoryKey)
    {
        return $this->checkPermission($permissionName, $categoryKey, true);
    }

    public function checkPermissionAtLeast($permissionName, $threshold, $valueWhenEmpty = 0)
    {
        if (!$this->_authorised($permissionName)) {
            return false;
        }
        return  $this->getPermissionValue($permissionName, $valueWhenEmpty) >= $threshold;
    }

    public function checkPermissionAtMost($permissionName, $threshold, $valueWhenEmpty = 0)
    {
        if (!$this->_authorised($permissionName)) {
            return false;
        }
        return $this->getPermissionValue($permissionName, $valueWhenEmpty) <= $threshold;
    }

    public function checkPermissionIsAllowed($permissionName, $valueWhenEmpty = false)
    {
        if (!$this->_authorised($permissionName)) {
            return false;
        }
        return  isset(static::$permissions[$this->role_id][$permissionName]) ? true : $valueWhenEmpty;
    }

    public function getPermissionValue($permissionName, $default = null)
    {
        if (!$this->_authorised($permissionName)) {
            return $default;
        }
        if (isset(static::$permissions[$this->role_id][$permissionName])) {
            return static::$permissions[$this->role_id][$permissionName][0];
        }
        return $default;
    }

    protected function _authorised($permission_name)
    {
        // Retrieve application name based on the permission name ('noviusos_page::test' would return 'noviusos_page')
        list($application, ) = explode('::', $permission_name.'::', 2);
        // If this application is loaded, check the user has access to it
        if ($application != 'nos' && !$this->checkPermission('nos::access', $application)) {
            return false;
        }

        // Load permissions from the database
        if (!isset(static::$permissions[$this->role_id])) {
            try {
                static::$permissions[$this->role_id] = \Cache::get('role_permissions.'.$this->role_id);
            } catch (\CacheNotFoundException $e) {
                static::$permissions[$this->role_id] = array();
                $query = \Db::query('SELECT * FROM nos_role_permission WHERE perm_role_id = '.\Db::quote($this->role_id));
                foreach ($query->as_object()->execute() as $permission) {
                    static::$permissions[$this->role_id][$permission->perm_name][] = $permission->perm_category_key;
                }
                \Cache::set('role_permissions.'.$this->role_id, static::$permissions[$this->role_id]);
            }
        }
        return true;
    }
}
