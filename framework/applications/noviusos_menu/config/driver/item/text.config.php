<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

return array(
    'name' => 'Text',
    'icon' => 'static/apps/noviusos_menu/img/driver/text/icon.png',
    'form' => array(
        'height' => 480,
    ),
    // Allowed EAV attributes
    'attributes' => array(
        'text', 'is_html'
    ),
);
