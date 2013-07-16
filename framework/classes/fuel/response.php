<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Response extends \Fuel\Core\Response
{
    public static function json($status, $data = null)
    {
        if ($data === null) {
            $data = $status;
            $status = 200;
        }
        static::forge(\Format::forge()->to_json($data), $status, array(
            'Content-Type' => \Input::is_ajax() ? 'application/json' : 'text/plain',
            'Cache-Control' => 'no-cache, no-store, max-age=0, must-revalidate',
            'Expires' => 'Mon, 26 Jul 1997 05:00:00 GMT',
            'Pragma' => 'no-cache',
        ))->send(true);
        Event::shutdown();
        exit();
    }
}

/* End of file date.php */
