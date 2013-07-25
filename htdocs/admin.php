<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

define('NOS_ENTRY_POINT', 'admin');

// Boot the app
require_once __DIR__.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'framework'.DIRECTORY_SEPARATOR.'bootstrap.php';

Fuel::$profiling = false;

// Generate the request, execute it and send the output.
try {
    $response = Request::forge(Input::server('NOS_URL'))->execute()->response();
} catch (HttpNotFoundException $e) {
    $route = array_key_exists('_404_', Router::$routes) ? Router::$routes['_404_']->translation : Config::get('routes._404_');
    if ($route) {
        $response = Request::forge($route)->execute()->response();
    } else {
        throw $e;
    }
}

$response->set_header('X-FRAME-OPTIONS', 'SAMEORIGIN');
$response->send(true);
