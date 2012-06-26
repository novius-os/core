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

class Auth {

    static $default_cookie_lasting = 2592000; //60 * 60 * 24 * 30;

	public static function login($login, $password, $remember_me = true) {

		$user = Model_User::find('all', array(
			'where' => array(
				'user_email' => $login,
			),
		));
		if (empty($user)) {
			return false;
		}
		$user = current($user);
		if ($user->check_password($password)) {
			\Session::set('logged_user_id', $user->id);
            \Cookie::set('remember_me', $remember_me, static::$default_cookie_lasting);
            if ($remember_me) {
                \Cookie::set('logged_user_id', $user->id, static::$default_cookie_lasting);
            }
			return true;
		}
		return false;
	}

	public static function check() {

        // Might be great to add some additional verifications here !
		$logged_user_id = \Session::get('logged_user_id', false);
        $remember_me = \Cookie::get('remember_me', false);

        if (empty($logged_user_id) && $remember_me) {
            $logged_user_id = \Cookie::get('logged_user_id', false);
        }

		if (empty($logged_user_id)) {
			return false;
		} else {
            $logged_user = Model_User::find_by_user_id($logged_user_id); // We reload the user
            if (!$logged_user) {
                return false;
            }
            \Session::setUser($logged_user);
            \Session::set('logged_user_id', $logged_user_id);
            \Cookie::set('remember_me', $remember_me, static::$default_cookie_lasting);
            if ($remember_me) {
                \Cookie::set('logged_user_id', $logged_user_id, static::$default_cookie_lasting);
            }
			return true;
        }
	}

    public static function disconnect() {
        \Session::destroy();
        \Cookie::set('logged_user_id', false);
    }
}
