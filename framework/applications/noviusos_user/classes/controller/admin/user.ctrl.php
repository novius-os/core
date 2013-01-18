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

class Controller_Admin_User extends \Nos\Controller_Admin_Crud
{
    public function before()
    {
        if (\Request::active()->action == 'insert_update' && ($user = \Session::user()) && \Request::active()->method_params[0] == $user->user_id) {
            $this->bypass = true;
        }
        parent::before();
    }

    protected function fields($fields)
    {
        $fields = parent::fields($fields);
        if ($this->is_new) {
            $fields['user_password']['validation'][] = 'required';
            $fields['password_confirmation']['validation'][] = 'required';
            $fields['user_last_connection']['dont_populate'] = true;
            $fields['user_last_connection']['dont_save'] = true;
        } else {
            unset($fields['user_password']);
            $fields['password_confirmation']['validation']['match_field'] = array('password_reset');
        }

        return $fields;
    }

    public function save($item, $data)
    {
        if (!$this->is_new && $item->is_changed('user_password')) {
            $this->config['messages']['successfully saved'] = __('Done, your password has been changed.');
        }

        return parent::save($item, $data);
    }

    public function action_save_permissions()
    {
        $role = Model_Role::find(\Input::post('role_id'));

        $applications = \Input::post('applications');
        foreach ($applications as $application) {
            $access = Model_Permission::find('first', array('where' => array(
                array('perm_role_id',       $role->role_id),
                array('perm_key',           'access'),
                array('perm_application',   $application),
            )));

            // Grant of remove access to the application
            if (empty($_POST['access'][$application]) && !empty($access)) {
                $access->delete();
            }

            if (!empty($_POST['access'][$application]) && empty($access)) {
                $access = new Model_Permission();
                $access->perm_role_id     = $role->role_id;
                $access->perm_key           = 'access';
                $access->perm_identifier    = '';
                $access->perm_application   = $application;
                $access->save();
            }
        }
        \Response::json(array(
            'notify' => __('OK, permissions saved.'),
        ));

    }
}
