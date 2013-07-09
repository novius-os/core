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

\Autoloader::add_class('PasswordHash', NOSPATH.'vendor'.DS.'phpass'.DS.'PasswordHash.php');

class Model_User extends \Nos\Orm\Model
{
    protected static $_table_name = 'nos_user';
    protected static $_primary_key = array('user_id');

    protected static $_properties = array(
        'user_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
        'user_md5' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'user_name' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'user_firstname' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'user_email' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'user_password' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'user_lang' => array(
            'default' => 'en_GB',
            'data_type' => 'varchar',
            'null' => false,
        ),
        'user_last_connection' => array(
            'default' => null,
            'data_type' => 'datetime',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'user_configuration' => array(
            'default' => null,
            'data_type' => 'text',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'user_expert' => array(
            'default' => 0,
            'data_type' => 'tinyint',
            'null' => false,
        ),
        'user_created_at' => array(
            'data_type' => 'timestamp',
            'null' => false,
        ),
        'user_updated_at' => array(
            'data_type' => 'timestamp',
            'null' => false,
        ),
    );

    protected static $_delete = array(
        'roles' => array(),
    );

    protected static $_belongs_to = array();
    protected static $_has_many = array();
    protected static $_has_one = array();
    protected static $_many_many = array(
        'roles' => array(
            'key_from' => 'user_id',
            'key_through_from' => 'user_id',
            'table_through' => 'nos_user_role',
            'key_through_to' => 'role_id',
            'model_to' => 'Nos\User\Model_Role',
            'key_to' => 'role_id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_observers = array(
        'Orm\\Observer_Self' => array(
        ),
        'Orm\Observer_CreatedAt' => array(
            'mysql_timestamp' => true,
            'property'=>'user_created_at'
        ),
        'Orm\Observer_UpdatedAt' => array(
            'mysql_timestamp' => true,
            'property'=>'user_updated_at'
        ),
    );

    public function check_password($password)
    {
        $ph = new \PasswordHash(8, false);

        return $ph->CheckPassword($password, $this->user_password);
    }

    public function generate_md5()
    {
        $this->user_md5 = md5(uniqid(rand(), true));
    }

    public function _event_before_save()
    {
        parent::_event_before_save();
        // Don't hash twice
        if ($this->is_changed('user_password')) {
            $ph = new \PasswordHash(8, false);
            $this->user_password = $ph->HashPassword($this->user_password);
        }
        if (empty($this->user_md5) || $this->is_changed('user_password') || $this->is_new()) {
            $this->generate_md5();
            if (\Session::user() !== null && $this->user_id == \Session::user()->user_id) {
                \Nos\Auth::set_user_md5($this->user_md5);
            }
        }
    }

    public function _event_after_save()
    {
        // Don't trigger the event in a loop, because we call save() and this will trigger _event_after_save()
        static $already_saved = array();
        if (!empty($already_saved[$this->user_id])) {
            return;
        }
        $already_saved[$this->user_id] = true;

        // If roles are not enabled, we create one internally to store its permissions
        if (empty($this->roles) && \Config::get('novius-os.users.enable_roles', false) === false) {
            $role = new Model_Role();
            $role->role_name = $this->fullname();
            $role->role_user_id = $this->user_id;
            $this->roles[] = $role;
            $this->save(array('roles'));
        }
        $already_saved[$this->user_id] = false;
    }

    public function _event_before_delete()
    {
        // If roles are not enabled, we need to delete the internal one (used to store the permissions)
        if (\Config::get('novius-os.users.enable_roles', false) === false) {
            static::$_delete['roles'] = $this->roles;
        }
    }
    public function _event_after_delete()
    {
        foreach (static::$_delete['roles'] as $role) {
            $role->delete();
        }
    }

    public static function hash_password($password)
    {
        return mb_substr($password, 0, 1).$password.mb_substr($password, -1);
    }


    /**
     * @deprecated
     */
    public function check_permission($app, $key)
    {
        \Log::deprecated('->check_permission($app, $key) is deprecated, use ->checkPermission($permission_name, $category_key) instead.', 'Chiba.2');

        return $this->checkPermission($app, $key);
    }

    /**
     * @param   string       $permission_name  Name of the permission to check against
     * @param   null|string  $category_key     (optional) If the permission has categories, the category key to check against
     * @return  bool  Has the user the required authorisation?
     */
    public function checkPermission($permission_name, $category_key = null, $allowEmpty = false)
    {
        return $this->checkRolesPermissions('exists', func_get_args());
    }

    /**
     * @param $method Method to check: isAllowed, exists, atLeast, atMost
     * @param string $args
     * @return bool
     */
    public function checkRolesPermission()
    {
        $args = func_get_args();
        $method = array_shift($args);
        foreach ($this->roles as $role) {
            if (call_user_func_array(array($role, 'checkPermission'.$method), $args)) {
                return true;
            }
        }
        return false;
    }

    public function listPermissionCategories($permissionName)
    {
        $categories = array();
        foreach ($this->roles as $role) {
            $roleCategories = $role->listPermissionCategories($permissionName);
            if (!empty($roleCategories)) {
                $categories = $categories + $roleCategories;
            }
        }
        return $categories;
    }

    public function fullname()
    {
        return $this->user_firstname.(empty($this->user_firstname) ? '' : ' ').$this->user_name;
    }

    /*
    public static function _init()
    {
        static::$_properties['user_last_connection']['default'] = \DB::expr('NOW()');
    }*/

    public function getConfiguration()
    {
        if (!$this->user_configuration) {
            return array();
        } else {
            return unserialize($this->user_configuration);
        }
    }
}
