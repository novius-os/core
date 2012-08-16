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

class Controller_Admin_User_User extends Controller_Admin_Crud {

    public function before() {
        if (\Request::active()->action == 'insert_update' && ($user = \Session::user()) && \Request::active()->method_params[0] == $user->user_id) {
            $this->bypass = true;
        }
        parent::before();
    }

    protected function check_permission($action) {
        parent::check_permission($action);
        if ($action === 'delete' && !static::check_permission_action('delete', 'controller/admin/media/appdesk/list', $this->item)) {
            throw new \Exception('Permission denied');
        }
    }

    protected function fields($fields)
    {
        $fields = parent::fields($fields);
        if ($this->is_new)
        {
            $fields['user_password']['validation'][] = 'required';
            $fields['password_confirmation']['validation'][] = 'required';
            $fields['user_last_connection']['dont_populate'] = true;
            $fields['user_last_connection']['dont_save'] = true;
        }
        else
        {
            unset($fields['user_password']);
            $fields['password_confirmation']['validation']['match_field'] = array('password_reset');
        }
        return $fields;
    }

    public function save($item, $data)
    {
        if (!$this->is_new && $item->is_changed('user_password'))
        {
            $this->config['messages']['successfully saved'] = __('New password successfully set.');
        }
        return parent::save($item, $data);
    }

    public function action_save_permissions() {

        $role = Model_User_Role::find(\Input::post('role_id'));

        $applications = \Input::post('applications');
        foreach ($applications as $application) {
            $access = Model_User_Permission::find('first', array('where' => array(
                array('perm_role_id',     $role->role_id),
                array('perm_application', 'access'),
                array('perm_key',          $application),
            )));

            // Grant of remove access to the application
            if (empty($_POST['access'][$application]) && !empty($access)) {
                $access->delete();
            }

            if (!empty($_POST['access'][$application]) && empty($access)) {
                $access = new Model_User_Permission();
                $access->perm_role_id     = $role->role_id;
                $access->perm_application = 'access';
                $access->perm_identifier  = '';
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
}