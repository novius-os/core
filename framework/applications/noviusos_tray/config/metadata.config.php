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
    'name'      => 'Tray',
    'namespace' => 'Nos\Tray',
    'version'   => '0.1',
    'provider'  => array(
        'name'  => 'Novius OS',
    ),
    'permission' => array(
        'icon64'  => 'static/apps/noviusos_media/img/media-64.png',
    ),
    'launchers' => array(
        'nos_help' => array(
            'name' => 'Help',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'label' => __('Help'),
                    'url' => 'admin/noviusos_tray/help',
                    'iconUrl' => 'static/apps/noviusos_tray/img/32/help.png',
                ),
            ),
            'iconUrl' => 'static/apps/noviusos_tray/img/32/help.png',
            'icon64' => 'static/apps/noviusos_tray/img/64/help.png',
            'application' => 'nos_tray',
        ),
        'nos_account' => array(
            'name' => 'My account',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'label' => __('Account'),
                    'url' => 'admin/noviusos_tray/account',
                    'iconUrl' => 'static/apps/noviusos_tray/img/32/myaccount.png',
                ),
            ),
            'iconUrl' => 'static/apps/noviusos_tray/img/32/myaccount.png',
            'icon64' => 'static/apps/noviusos_tray/img/64/myaccount.png',
            'application' => 'nos_tray',
        ),
        'nos_appmanager' => array(
            'name' => 'Application manager',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'label' => __('Application manager'),
                    'url' => 'admin/noviusos_tray/appmanager',
                    'iconUrl' => 'static/apps/noviusos_tray/img/32/app-manager.png',
                ),
            ),
            'iconUrl' => 'static/apps/noviusos_tray/img/32/app-manager.png',
            'icon64' => 'static/apps/noviusos_tray/img/64/app-manager.png',
            'application' => 'nos_tray',
        ),
    ),
    'icons' => array(
        64 => 'static/apps/noviusos_tray/img/64/app-manager.png',
        32 => 'static/apps/noviusos_tray/img/32/app-manager.png',
        16 => 'static/apps/noviusos_tray/img/16/app-manager.png',
    ),
);
