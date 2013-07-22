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

    /**
     * Redirects to another uri/url.  Sets the redirect header,
     * sends the headers and exits.  Can redirect via a Location header
     * or using a refresh header.
     *
     * The refresh header works better on certain servers like IIS.
     *
     * @param   string  $url     The url
     * @param   string  $method  The redirect method
     * @param   int     $code    The redirect status code
     *
     * @return  void
     */
    public static function redirect($url = '', $method = 'location', $code = 302)
    {
        $response = new static;

        $response->set_status($code);

        if (strpos($url, '://') === false) {
            $url = $url !== '' ? \Uri::create($url) : \Uri::base();
        }

        if ($method == 'location') {
            $response->set_header('Location', $url);
        } elseif ($method == 'refresh') {
            $response->set_header('Refresh', '0;url='.$url);
        } else {
            return;
        }

        $response->send(true);
        exit;
    }
}
