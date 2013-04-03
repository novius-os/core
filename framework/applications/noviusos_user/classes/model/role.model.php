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

    protected static $_properties = array(
        'role_id',
        'role_name',
        'role_user_id',
    );

    protected static $permissions;

    /**
     * @param   string  $permission_name  Name of the permission to check against
     * @param   null    $category_key     (optional) If the permission has categories, the category key to check against
     * @return  bool    Has the role the required authorisation?
     */
    public function check_permission($permission_name, $category_key = null)
    {
        // Retrieve application name based on the permission name ('noviusos_page::test' would return 'noviusos_page')
        list($application, ) = explode($permission_name.'::', 2);
        // If this application is loaded, check the user has access to it
        if (\Fuel\Core\Module::loaded($application) && !$this->check_permission('nos::access', $application)) {
            return false;
        }

        // Load permissions from the database
        if (!isset(static::$permissions[$this->role_id])) {
            $query = \Db::query('SELECT * FROM nos_role_permission WHERE perm_role_id = '.\Db::quote($this->role_id));
            foreach ($query->as_object()->execute() as $permission) {
                static::$permissions[$this->role_id][$permission->perm_name][] = $permission->perm_category_key;
            }
        }

        // For permissions without category, just check the existence of the permission
        $isset = isset(static::$permissions[$this->role_id][$permission_name]);
        if ($category_key == null) {
            return $isset;
        }

        // For permission with categories, also check the existence of the category
        return $isset && in_array($category_key, static::$permissions[$this->role_id][$permission_name]);
    }
}
