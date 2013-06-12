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
    /**
     * @alias Use exists() instead
     */
    public static function check($permissionName, $categoryKey = null, $allowEmpty = false)
    {
        return \Session::user()->checkRolesPermission('Exists', $permissionName, $categoryKey, $allowEmpty);
    }

    /**
     * Check whether a permissions exists
     *
     * @param $permissionName Name of the permission
     * @param null $categoryKey (optional) If the permission has categories, the category key to check against
     * @return bool
     */
    public static function exists($permissionName, $categoryKey = null, $allowEmpty = false)
    {
        return \Session::user()->checkRolesPermission('Exists', $permissionName, $categoryKey, $allowEmpty);
    }

    /**
     * Check whether a permissions exists or is not configured
     *
     * @param $permissionName Name of the permission
     * @param null $categoryKey (optional) If the permission has categories, the category key to check against
     * @return bool
     */
    public static function existsOrEmpty($permissionName, $categoryKey = null)
    {
        return \Session::user()->checkRolesPermission('ExistsOrEmpty', $permissionName, $categoryKey);
    }

    /**
     * Check against a binary permission (value is either 0 or 1).
     *
     * @param $permissionName  Name of the permission
     * @param bool $allowEmpty Should we grant access when nothing is configured?
     * @return bool
     */
    public static function isAllowed($permissionName, $allowEmpty = false)
    {
        return  \Session::user()->checkRolesPermission('IsAllowed', $permissionName, $allowEmpty);
    }

    /**
     * Check against a numeric (range) permission.
     *
     * @param $permissionName  Name of the permission
     * @param $threshold Minimum value to grant access
     * @param bool $valueWhenEmpty Default value to compare with when nothing is configured?
     * @return bool
     */
    public static function atLeast($permissionName, $threshold, $valueWhenEmpty = 0)
    {
        return  \Session::user()->checkRolesPermission('AtLeast', $permissionName, (int) $threshold, $valueWhenEmpty);
    }

    /**
     * Check against a numeric (range) permission.
     *
     * @param $permissionName  Name of the permission
     * @param $threshold Maximum value to grant access
     * @param bool $valueWhenEmpty Default value to compare with when nothing is configured?
     * @return bool
     */
    public static function atMost($permissionName, $threshold, $valueWhenEmpty = 0)
    {
        return \Session::user()->checkRolesPermission('AtMost', $permissionName, (int) $threshold, (int) $valueWhenEmpty);
    }

    public function listPermissionCategories($permissionName)
    {
        return \Session::user()->listPermissionCategories($permissionName);
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
