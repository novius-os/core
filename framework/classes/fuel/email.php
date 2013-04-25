<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Package::load('email');

class Email extends \Email\Email
{
    public static function hasDefaultFrom()
    {
        return static::$_defaults['from']['email'];
    }
}
