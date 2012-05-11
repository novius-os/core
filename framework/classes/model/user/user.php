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

use Fuel\Core\Uri;

\Autoloader::add_class('PasswordHash', NOSPATH.'vendor'.DS.'phpass'.DS.'PasswordHash.php');

class Model_User_User extends \Nos\Orm\Model {
    protected static $_table_name = 'os_user';
    protected static $_primary_key = array('user_id');

	protected static $_delete;

    protected static $_many_many = array(
        'roles' => array(
            'key_from' => 'user_id',
            'key_through_from' => 'user_id', // column 1 from the table in between, should match a posts.id
            'table_through' => 'os_user_role', // both models plural without prefix in alphabetical order
            'key_through_to' => 'role_id', // column 2 from the table in between, should match a users.id
            'model_to' => 'Nos\Model_User_Role',
            'key_to' => 'role_id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_observers = array('Orm\\Observer_Self' => array(
		'events' => array('before_save', 'after_save', 'before_delete', 'after_delete'),
	));

    public function check_password($password) {
        $ph = new \PasswordHash(8, false);
        return $ph->CheckPassword($password, $this->user_password);
    }

    public function _event_before_save() {
		// Don't hash twice
        if ($this->is_changed('user_password')) {
            $ph = new \PasswordHash(8, false);
            $this->user_password = $ph->HashPassword($this->user_password);
        }
    }

    public function _event_after_save() {
		// Don't trigger the event in a loop, because we call save() and this will trigger _event_after_save()
		static $already_saved = array();
		if (!empty($already_saved[$this->user_id])) {
			return;
		}
		$already_saved[$this->user_id] = true;

		if (empty($this->roles)) {
            $role = new Model_User_Role();
            $role->role_user_id = $this->user_id;
		} else {
            $role = reset($this->roles);
		}
        $role->role_name = $this->fullname();
		$this->roles[] = $role;
		$this->save(array('roles'));
    }

	public function _event_before_delete() {
		// Load the roles to delete
		static::$_delete['roles'] = $this->roles;
	}
	public function _event_after_delete() {
		foreach (static::$_delete['roles'] as $role) {
            $role->delete();
		}
	}

    public static function hash_password($password) {
        return mb_substr($password, 0, 1).$password.mb_substr($password, -1);
    }

    public function check_permission($app, $key) {
		$args = func_get_args();
        foreach ($this->roles as $g) {
            if (call_user_func_array(array($g, 'check_permission'), $args)) {
                return true;
            }
        }
        return false;
    }

	public function fullname() {
		return $this->user_firstname.(empty($this->user_firstname) ? '' : ' ').$this->user_name;
	}

	/*
    public static function _init() {
        static::$_properties['user_last_connection']['default'] = \DB::expr('NOW()');
    }*/


    public function getConfiguration() {
        if (!$this->user_configuration) {
            return array();
        } else {
            return unserialize($this->user_configuration);
        }
    }
}

