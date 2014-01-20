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

class Auth
{
    public static $default_cookie_lasting = 2592000; //60 * 60 * 24 * 30;

    public static function login($login, $password, $remember_me = true)
    {
        $user = User\Model_User::find(
            'all',
            array(
                'where' => array(
                    'user_email' => $login,
                ),
            )
        );
        if (empty($user)) {
            return false;
        }
        $user = current($user);
        $user->user_last_connection = \Date::forge()->format('mysql');
        $user->save();
        if ($user->check_password($password)) {
            \Session::set('logged_user_id', $user->id);
            \Session::set('logged_user_md5', $user->user_md5);
            \Cookie::set('remember_me', $remember_me, static::$default_cookie_lasting);
            if ($remember_me) {
                \Cookie::set('logged_user_id', $user->id, static::$default_cookie_lasting);
                \Cookie::set('logged_user_md5', $user->id, static::$default_cookie_lasting);
            }
            return true;
        }
        return false;
    }

    public static function check()
    {
        // Might be great to add some additional verifications here !
        $logged_user_id = \Session::get('logged_user_id', false);
        $logged_user_md5 = \Session::get('logged_user_md5', false);
        $remember_me = \Cookie::get('remember_me', false);

        $session_user_id = $logged_user_id;

        if (empty($logged_user_id) && $remember_me) {
            $logged_user_id = \Cookie::get('logged_user_id', false);
            $logged_user_md5 = \Cookie::get('logged_user_md5', false);
        }

        if (empty($logged_user_id)) {
            return false;
        }

        $logged_user = User\Model_User::find_by_user_id($logged_user_id); // We reload the user
        if (!$logged_user || $logged_user->user_md5 != $logged_user_md5) {

            static::disconnect();

            // It's a new session (= auto-login using Cookie)
            if (empty($session_user_id)) {
                \Event::trigger('admin.loginFailWithCookie');
            }

            return false;
        }

        \Session::setUser($logged_user);
        // Only extend the cookie duration for the main request (preventing N 'Set-Cookie' headers if we have N HMVC requests)
        if (!\Request::is_hmvc()) {

            \Session::set('logged_user_id', $logged_user_id);
            \Session::set('logged_user_md5', $logged_user_md5);
            \Cookie::set('remember_me', $remember_me, static::$default_cookie_lasting);
            if ($remember_me) {
                \Cookie::set('logged_user_id', $logged_user_id, static::$default_cookie_lasting);
                \Cookie::set('logged_user_md5', $logged_user_md5, static::$default_cookie_lasting);
            }
        }

        // It's a new session (= auto-login using Cookie)
        if (empty($session_user_id)) {
            \Event::trigger('admin.loginSuccessWithCookie');
        }

        return true;
    }

    public static function set_user_md5($user_md5)
    {
        \Session::set('logged_user_md5', $user_md5);
        if (\Cookie::get('remember_me', false)) {
            \Cookie::set('logged_user_md5', $user_md5, static::$default_cookie_lasting);
        }
    }

    public static function disconnect()
    {
        \Session::destroy();
        \Cookie::set('logged_user_id', false);
    }
}
