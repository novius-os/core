<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Image extends \Fuel\Core\Image
{
    static public function gravatar($email, $options = array())
    {
        $params = \Arr::merge(
            array(
            'gravatar_id'   => md5(strtolower(trim($email))),
            'rating'        => 'G',
            'size'          => 80,
            'default'		=> 'http://www.gravatar.com/avatar/00000000000000000000000000000000' //default image
            ),
            $options
        );

        $url = 'http://gravatar.com/avatar.php?';
        $appended_to_url = array();
        foreach ($params as $key => $value) {
            $appended_to_url[] = urlencode($key).'='.urlencode($value);
        }
        /*\Debug::$js_toggle_open= true;
        \Debug::dump($appended_to_url);*/
        return $url.implode('&', $appended_to_url);
    }
}