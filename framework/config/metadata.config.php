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
    'launchers' => array(
        'nos_page' => array(
            'name' => 'Pages',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => 'admin/nos/page/appdesk/index',
                    'iconUrl' => 'static/novius-os/admin/novius-os/img/32/page.png',
                ),
            ),
            'iconUrl' => 'static/novius-os/admin/novius-os/img/32/page.png',
            'icon64' => 'static/novius-os/admin/novius-os/img/64/page.png',
            'application' => 'nos_page',
        ),
        'nos_media' => array(
            'name' => 'Media centre',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => 'admin/nos/media/appdesk/index',
                    'iconUrl' => 'static/novius-os/admin/novius-os/img/32/media.png',
                ),
            ),
            'icon64' => 'static/novius-os/admin/novius-os/img/64/media.png',
            'application' => 'nos_media',
        ),
        'nos_user' => array(
            'name' => 'Users',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => 'admin/nos/user/appdesk/index',
                    'iconUrl' => 'static/novius-os/admin/novius-os/img/32/user.png',
                ),
            ),
            'icon64' => 'static/novius-os/admin/novius-os/img/64/user.png',
            'application' => 'nos_user',
        ),
        'nos_help' => array(
            'name' => 'Help',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'label' => __('Help'),
                    'url' => 'admin/nos/tray/help',
                    'iconUrl' => 'static/novius-os/admin/novius-os/img/32/help.png',
                ),
            ),
            'iconUrl' => 'static/novius-os/admin/novius-os/img/32/help.png',
            'icon64' => 'static/novius-os/admin/novius-os/img/64/help.png',
            'application' => 'nos_tray',
        ),
        'nos_account' => array(
            'name' => 'My account',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'label' => __('Account'),
                    'url' => 'admin/nos/tray/account',
                    'iconUrl' => 'static/novius-os/admin/novius-os/img/32/myaccount.png',
                ),
            ),
            'iconUrl' => 'static/novius-os/admin/novius-os/img/32/myaccount.png',
            'icon64' => 'static/novius-os/admin/novius-os/img/64/myaccount.png',
            'application' => 'nos_tray',
        ),
        'nos_appmanager' => array(
            'name' => 'Application manager',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'label' => __('Application manager'),
                    'url' => 'admin/nos/tray/appmanager',
                    'iconUrl' => 'static/novius-os/admin/novius-os/img/32/app-manager.png',
                ),
            ),
            'iconUrl' => 'static/novius-os/admin/novius-os/img/32/app-manager.png',
            'icon64' => 'static/novius-os/admin/novius-os/img/64/app-manager.png',
            'application' => 'nos_tray',
        ),
    ),
);
