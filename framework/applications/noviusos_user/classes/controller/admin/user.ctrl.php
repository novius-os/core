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

    protected $_password_is_changed = false;

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

    public function before_save($item, $data)
    {
        parent::before_save($item, $data);

        $this->_password_is_changed = $item->is_changed('user_password');

        $enable_roles = \Config::get('novius-os.users.enable_roles', false);
        $roles = \Input::post('roles', array());
        if ($enable_roles && !empty($roles)) {
            $item->roles = Model_Role::find('all', array(
                'where' => array(
                    array('role_id', 'IN', $roles),
                ),
            ));
        }
    }

    public function save($item, $data)
    {
        if (!$this->is_new && $this->_password_is_changed) {
            $this->config['i18n']['notification item saved'] = __('Done, your password has been changed.');
        }

        $return = parent::save($item, $data);

        $enable_roles = \Config::get('novius-os.users.enable_roles', false);
        if ($enable_roles) {
            $return['dispatchEvent'][] = array(
                'name' => 'Nos\Application',
            );
        }
        return $return;
    }
}
