<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

define('NOS_ENTRY_POINT', 'front');

// Boot the app
require_once __DIR__.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'framework'.DIRECTORY_SEPARATOR.'bootstrap.php';

// Generate the request, execute it and send the output.
$response = Request::forge('nos/front/index', false)->execute()->response();

$response->send(true);
