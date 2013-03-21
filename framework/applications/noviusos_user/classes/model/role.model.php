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

    protected static $permissions;
    protected $access;

    public function check_permission($permission_name, $category_key = null)
    {
        // Load permissions
        if (!isset(static::$permissions[$this->role_id])) {
            $query = \Db::query('SELECT * FROM nos_role_permission WHERE perm_role_id = '.\Db::quote($this->role_id));
            foreach ($query->as_object()->execute() as $permission) {
                static::$permissions[$this->role_id][$permission->perm_name][] = $permission->perm_category_key;
            }
        }

        $isset = isset(static::$permissions[$this->role_id][$permission_name]);
        if ($category_key == null) {
            return $isset;
        }

        // Check authorisation
        return $isset && in_array($category_key, static::$permissions[$this->role_id][$permission_name]);
    }
}
