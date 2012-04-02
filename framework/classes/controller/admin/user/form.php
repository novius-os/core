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

class Controller_Admin_User_Form extends \Nos\Controller_Generic_Admin {

    public function before($response = null) {
        if (\Request::active()->action == 'edit' &&\Request::active()->method_params[0] == \Session::user()->user_id) {
            $this->bypass = true;
        }
        $ret = parent::before($response);

        return $ret;
    }

    public function action_add() {

        $user = Model_User_User::forge();

        return \View::forge('nos::admin/user/user_add', array(
            'fieldset' => static::fieldset_add($user)->set_config('field_template', '<tr><th>{label}{required}</th><td class="{error_class}">{field} {error_msg}</td></tr>'),
        ), false);
    }

    public function action_edit($id = false) {
        if ($id === false) {
            $user = null;
        } else {
            $user = Model_User_User::find($id);
        }
        $role = reset($user->roles);


        \Config::load('nos::admin/native_apps', 'natives_apps');
        $natives_apps = \Config::get('natives_apps', array());

        \Config::load(APPPATH.'data'.DS.'config'.DS.'app_installed.php', 'app_installed');
        $apps = \Config::get('app_installed', array());

        $apps = array_merge($natives_apps, $apps);

        return \View::forge('nos::admin/user/user_edit', array(
            'user'   => $user,
            'fieldset' => static::fieldset_edit($user)->set_config('field_template', '<tr><th>{label}{required}</th><td class="{error_class}">{field} {error_msg}</td></tr>'),
            'permissions' => \View::forge('nos::admin/user/permission', array(
                'user' => $user,
                'role' => $role,
                'apps' => $apps,
            ), false),
        ), false);
    }

    public function action_save_permissions() {

        $role = Model_User_Role::find(\Input::post('role_id'));

		$applications = \Input::post('applications');
        foreach ($applications as $application) {
            $access = Model_User_Permission::find('first', array('where' => array(
                array('perm_role_id', $role->role_id),
                array('perm_application', 'access'),
                array('perm_key',         $application),
            )));

            // Grant of remove access to the application
            if (empty($_POST['access'][$application]) && !empty($access)) {
                $access->delete();
            }

            if (!empty($_POST['access'][$application]) && empty($access)) {
                $access = new Model_User_Permission();
                $access->perm_role_id   = $role->role_id;
                $access->perm_module     = 'access';
                $access->perm_identifier = '';
                $access->perm_key         = $application;
                $access->save();
            }

            \Config::load('applications', true);
            $apps = \Config::get('applications', array());

            \Config::load("$application::permissions", true);
            $permissions = \Config::get("$application::permissions", array());
/*
            foreach ($permissions as $identifier => $whatever) {
                $driver = $role->get_permission_driver($application, $identifier);
                $driver->save($role, (array) $_POST['permission'][$application][$identifier]);
            }
            */
        }
		\Response::json(array(
            'notify' => 'Permissions successfully saved.',
        ));

    }

    public static function fieldset_add($user) {

        $fields = array(
            'user_id' => array (
                'label' => __('ID: '),
                'widget' => 'text',
            ),
            'user_name' => array (
                'label' => __('Family name'),
                'widget' => '',
                'validation' => array(
                    'required',
                ),
            ),
            'user_firstname' => array (
                'label' => __('First name'),
                'widget' => '',
                'validation' => array(
                    'required',
                ),
            ),
            'user_email' => array(
                'label' => __('Email: '),
                'widget' => '',
                'validation' => array(
                    'required',
                    'valid_email',
                ),
            ),
            'user_last_connection' => array (
                'label' => __('Last login: '),
                'add' => false,
                'widget' => 'date_select',
                'form' => array(
                    'readonly' => true,
                    'date_format' => 'eu_full',
                ),
            ),
            'user_password' => array (
                'label' => __('Password: '),
                'form' => array(
                    'type' => 'password',
                    'value' => '',
                ),
                'validation' => array(
                    'required',
                    'min_length' => array(6),
                ),
            ),
            'password_confirmation' => array (
                'label' => __('Password (confirmation): '),
                'form' => array(
                    'type' => 'password',
                ),
                'validation' => array(
                    'required', // To show the little star
                    'match_field' => array('user_password'),
                ),
            ),
            'save' => array(
                'form' => array(
                    'type' => 'submit',
                    'tag'  => 'button',
                    'class' => 'primary',
                    'value' => __('Save'),
                    'data-icon' => 'check',
                ),
            ),
        );

        $fieldset = \Fieldset::build_from_config($fields, $user, array(
            'success' => function() use ($user) {
                return array(
                    'notify' => 'User successfully created.',
                    'replaceTab' => 'admin/nos/user/form/edit/'.$user->user_id,
                );
            }
        ));

        $fieldset->js_validation();
        return $fieldset;
    }

    public static function fieldset_edit($user) {

        $fields = array(
            'user_id' => array (
                'label' => __('ID: '),
                'widget' => 'text',
            ),
            'user_name' => array (
                'label' => __('Family name'),
                'widget' => '',
                'validation' => array(
                    'required',
                ),
            ),
            'user_firstname' => array (
                'label' => __('First name'),
                'widget' => '',
                'validation' => array(
                    'required',
                ),
            ),
            'user_email' => array(
                'label' => __('Email: '),
                'widget' => '',
                'validation' => array(
                    'required',
                    'valid_email',
                ),
            ),
            'user_last_connection' => array (
                'label' => __('Last login: '),
                'add' => false,
                'widget' => 'date_select',
                'form' => array(
                    'readonly' => true,
                    'date_format' => 'eu_full',
                ),
            ),
            'password_reset' => array (
                'label' => __('Password: '),
                'form' => array(
                    'type' => 'password',
                    'value' => '',
                ),
                'validation' => array(
                    'min_length' => array(6),
                ),
            ),
            'password_confirmation' => array (
                'label' => __('Password (confirmation): '),
                'form' => array(
                    'type' => 'password',
                ),
                'validation' => array(
                    'match_field' => array('password_reset'),
                ),
            ),
            'save' => array(
                'form' => array(
                    'type' => 'submit',
                    'tag'  => 'button',
                    'class' => 'primary',
                    'value' => __('Save'),
                    'data-icon' => 'check',
                ),
            ),
        );

        $fieldset = \Fieldset::build_from_config($fields, $user, array(
            'before_save' => function($user, $data) {
                if (!empty($data['password_reset'])) {
                    $user->user_password = $data['password_reset'];
                    $notify = 'Password successfully changed.';
                }
            },
            'success' => function($user, $data) {
                return array(
                     'notify' => $user->is_changed('user_password') ? 'New password successfully set.' : 'User successfully saved.',
                );
            }
        ));

        $fieldset->js_validation();
        return $fieldset;
    }
}