<?php
    /**
     * NOVIUS OS - Web OS for digital communication
     *
     * @copyright  2011 Novius
     * @license    GNU Affero General Public License v3 or (at your option) any later version
     *             http://www.gnu.org/licenses/agpl-3.0.html
     * @link http://www.novius-os.org
     */

class Session extends \Fuel\Core\Session
{
    public static $user = null;

    /**
     * Returns the current logged user
     * @return Nos\User\Model_User
     */
    public static function user()
    {
        if (static::$user === null) {
            \Nos\Auth::check();
        }

        return static::$user;
    }

    public static function setUser($user)
    {
        static::$user = $user;
    }
}
