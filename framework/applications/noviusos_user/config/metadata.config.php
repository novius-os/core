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
        'icon64'  => 'static/apps/noviusos_user/img/64/user.png',
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
        'noviusos_account' => array(
            'name' => 'My account',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'label' => __('Account'),
                    'url' => 'admin/noviusos_user/account',
                    'iconUrl' => 'static/apps/noviusos_user/img/32/myaccount.png',
                ),
            ),
            'iconUrl' => 'static/apps/noviusos_user/img/32/myaccount.png',
            'icon64' => 'static/apps/noviusos_user/img/64/myaccount.png',
        ),
    ),
    'icons' => array(
        64 => 'static/apps/noviusos_user/img/64/user.png',
        32 => 'static/apps/noviusos_user/img/32/user.png',
        16 => 'static/apps/noviusos_user/img/13/user.png',
    ),
);
