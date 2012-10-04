<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

return array(
    'name'      => 'Users',
    'namespace' => 'Nos\User',
    'version'   => '0.1',
    'provider'  => array(
        'name'  => 'Novius OS',
    ),
    'permission' => array(
        'icon64'  => 'static/apps/noviusos_user/img/user-64.png',
    ),
    'launchers' => array(
        'noviusos_user' => array(
            'name'    => 'Users',
            'url'     => 'admin/noviusos_user/appdesk',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => 'admin/noviusos_user/appdesk',
                ),
            ),
        ),
    ),
    'icons' => array(
        64 => 'static/apps/noviusos_user/img/user-64.png',
        32 => 'static/apps/noviusos_user/img/user-32.png',
        16 => 'static/apps/noviusos_user/img/user-16.png',
    ),
);
