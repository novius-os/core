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
    protected $is_account = false;
    public function prepare_i18n()
    {
        parent::prepare_i18n();
        \Nos\I18n::current_dictionary('noviusos_user::common');
    }

    public function before()
    {
        $this->is_account = \Request::active()->action == 'insert_update' && ($user = \Session::user()) && isset(\Request::active()->route->method_params[0]) && \Request::active()->route->method_params[0] == $user->user_id;
        if ($this->is_account) {
            $this->bypass = true;
        }
        parent::before();
    }

    protected function fields($fields)
    {
        $fields = parent::fields($fields);
        if ($this->is_new) {
            $fields['user_password']['validation'][] = 'required';
            $fields['password_confirmation']['validation']['match_field'] = array('user_password');
            $fields['password_confirmation']['validation'][] = 'required';
            $fields['user_last_connection']['dont_populate'] = true;
            $fields['user_last_connection']['dont_save'] = true;
        } else {
            unset($fields['user_password']);
        }

        return $fields;
    }

    public function save($item, $data)
    {
        if (!$this->is_new) {
            if ($item->is_changed('user_password')) {
                $this->config['messages']['successfully saved'] = __('Done, your password has been changed.');
            }
        }

        $enable_roles = \Config::get('novius-os.users.enable_roles', false);
        if ($enable_roles && !$this->is_account) {
            $roles = \Input::post('roles', array());
            if (!empty($roles)) {
                $roles = Model_Role::find('all', array(
                    'where' => array(
                        array('role_id', 'IN', $roles),
                    ),
                ));
            }
            // Load the roles...
            $item->roles;
            unset($item->roles);
            foreach ($roles as $role) {
                $item->roles[$role->role_id] = $role;
            }

            // When editing, save() is called after. When creating, save() is called before (we know the ID). So re-save it.
            if ($this->is_new) {
                $item->save(array('roles'));
            }
        }

        $return = parent::save($item, $data);
        if ($enable_roles) {
            $return['dispatchEvent'][] = array(
                'name' => 'Nos\Application',
            );
        }
        return $return;
    }
}
