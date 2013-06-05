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

class Permission
{
    public static function check($permission_name, $category_key = null, $allowEmpty = false)
    {
        $user = \Session::user();
        return $user->checkPermission($permission_name, $category_key, $allowEmpty);
    }

    public static function checkOrEmpty($permission_name, $category_key = null)
    {
        return static::check($permission_name, $category_key, true);
    }

    public static function add($permission_name, $category_key)
    {
        // Can't tell on which role to add the permission, skip
        if (\Config::get('novius-os.users.enable_roles', false)) {
            return true;
        }

        $user = \Session::user();
        // If no user is connected, can't do
        if (empty($user)) {
            return false;
        }

        $role = reset($user->roles);
        try {
            $access = new Model_Permission();
            $access->perm_role_id      = $role->role_id;
            $access->perm_name         = $permission_name;
            $access->perm_category_key = $category_key;
            $access->save();
        } catch (\Exception $e) {
        }

        return true;
    }
}
