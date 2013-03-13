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

class Permission
{
    public static function check($permission_name, $category_key)
    {
        $user = \Session::user();
        $role = reset($user->roles);

        return $role->check_permission($permission_name, $category_key);
    }

    public static function add($app_name, $perm_name)
    {
        $user = \Session::user();
        if (empty($user)) {
            return false;
        }
        $role = reset($user->roles);
        try {
            $access = new User\Model_Permission();
            $access->perm_role_id      = $role->role_id;
            $access->perm_name         = $perm_name;
            $access->perm_category_key = $app_name;
            $access->save();
        } catch (\Exception $e) {

        }

        return true;
    }
}
