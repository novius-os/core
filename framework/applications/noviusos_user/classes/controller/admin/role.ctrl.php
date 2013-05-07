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

class Controller_Admin_Role extends \Nos\Controller_Admin_Crud
{
    public function save($item, $data)
    {
        $this->savePermissions($item->role_id);
        $return = parent::save($item, $data);
        $return['dispatchEvent'][] = array(
            'name' => 'Nos\Application',
        );
        return $return;
    }

    public function action_save_permissions()
    {
        $this->savePermissions(\Input::post('role_id'));
        \Response::json(array(
            'notify' => __('OK, permissions saved.'),
            'dispatchEvent' => array(
                'name' => 'Nos\Application',
            ),
        ));
    }

    protected function savePermissions($role_id)
    {
        $role = $this->crud_item($role_id);
        if (empty($role)) {
            $this->send_error(new \Exception($this->config['i18n']['notification item not found']));
        }

        $db = $role->permissions;

        $olds = array();
        foreach ($db as $old) {
            $olds[$old->perm_name][$old->perm_category_key] = $old;
        }

        $permissions = \Input::post('perm', array());
        $nos_access = \Arr::get($permissions, 'nos::access', array());
        foreach ($permissions as $perm_name => $allowed) {
            $existing = array();
            list($app_name, ) = explode('::', $perm_name.'::', 2);
            $app_removed = $app_name != 'nos' && !in_array($app_name, $nos_access);

            // Delete old authorisations
            if (!empty($olds[$perm_name])) {
                foreach ($olds[$perm_name] as $old) {
                    // If the role has no longer access to the application, remove old authorisations related to this application
                    if ($app_removed) {
                        $old->delete();
                    } else if (!in_array($old->perm_category_key, $allowed)) {
                        $old->delete();
                    } else {
                        $existing[] = $old->perm_category_key;
                    }
                }
                unset($olds[$perm_name]);
            }

            // Add new authorisations
            foreach ($allowed as $category_key) {
                if (!$app_removed && !in_array($category_key, $existing)) {
                    $new = new Model_Permission();
                    $new->perm_role_id      = $role->role_id;
                    $new->perm_name         = $perm_name;
                    $new->perm_category_key = $category_key;
                    $new->save();
                }
            }
        }

        // None checked for perm_name
        foreach ($olds as $perm_name => $old) {
            foreach ($old as $delete) {
                $delete->delete();
            }
        }
    }
}
