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

class Model_User_Role extends \Nos\Orm\Model
{
    protected static $_table_name = 'nos_role';
    protected static $_primary_key = array('role_id');

    protected static $permissions;
	protected $access;

    public function check_permission($application, $key)
    {
		if ($key == 'access') {
			$this->load_access($application);
			return $this->access->check($this, $application);
		}

		$args = func_get_args();
		$args = array_slice($args, 2);
		array_unshift($args, $this->role_id);
		$driver = $this->get_permission_driver($application, $key);
		return call_user_func_array(array($driver, 'check'), $args);
    }

	public static function get_permission_driver($application, $key)
	{
		static::load_permission_driver($application, $key);
		return static::$permissions[$application][$key];
	}

	public function load_access($application)
	{
		$this->access = Permission::forge('access', '', array(
			'driver' => 'select',
			'title'=> 'Grant access to the application',
			'label' => 'Grant access to the application',
			'driver_config' => array(
				'choices' => array(
					'access' => array(
						'title' => 'Access the application',
					),
				),
			),
		));
	}

    public static function load_permission_driver($application, $key)
    {
		if (isset(static::$permissions[$application][$key])) {
			return;
		}

		//\Config::load('applications', true);
		//$apps = \Config::get('applications', array());
		\Config::load("$application::permissions", true);
		$permissions = \Config::get("$application::permissions", array());

        static::$permissions[$application][$key] = Permission::forge($application, $key, $permissions[$key]);

		return static::$permissions[$application][$key];
    }
}
