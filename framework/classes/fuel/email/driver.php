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

abstract class Email_Driver extends \Email\Email_Driver
{
    public function send($validate = null)
    {
        \Event::trigger('email.before_send', $this);

        try {
            $return = parent::send($validate);
        } catch (\Exception $e) {
            \Event::trigger('email.error', array('email' => $this, 'exception' => $e));
            throw $e;
        }

        \Event::trigger('email.after_send', $this);

        return $return;
    }

    public function __get($property)
    {
        return $this->$property;
    }
}
