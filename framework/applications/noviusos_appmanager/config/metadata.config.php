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
    'name'      => 'Applications Manager',
    'namespace' => 'Nos\Appmanager',
    'version'   => '0.2',
    'provider'  => array(
        'name'  => 'Novius OS',
    ),
    'permission' => array(
        'icon64'  => 'static/apps/noviusos_appmanager/img/64/app-manager.png',
    ),
    'launchers' => array(
        'noviusos_appmanager' => array(
            'name' => 'Application manager',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'label' => __('Application manager'),
                    'url' => 'admin/noviusos_appmanager/appmanager',
                    'iconUrl' => 'static/apps/noviusos_appmanager/img/32/app-manager.png',
                ),
            ),
            'iconUrl' => 'static/apps/noviusos_appmanager/img/32/app-manager.png',
            'icon64' => 'static/apps/noviusos_appmanager/img/64/app-manager.png',
        ),
    ),
    'icons' => array(
        64 => 'static/apps/noviusos_appmanager/img/64/app-manager.png',
        32 => 'static/apps/noviusos_appmanager/img/32/app-manager.png',
        16 => 'static/apps/noviusos_appmanager/img/16/app-manager.png',
    ),
);