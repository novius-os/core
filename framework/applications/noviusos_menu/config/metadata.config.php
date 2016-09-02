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
    'name' => 'Website menus',
    'namespace' => 'Nos\Menu',
    'version' => '5.0.1 (Elche)',
    'provider' => array(
        'name' => 'Novius OS',
    ),
    'i18n_file' => 'noviusos_menu::metadata',
    'permission' => array(),
    'launchers' => array(
        'noviusos_menu' => array(
            'name' => 'Website menus',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => 'admin/noviusos_menu/menu/appdesk',
                ),
            ),
        ),
    ),
    'enhancers' => array(
        'noviusos_menu' => array(
            'title' => 'Menu',
            'desc'  => '',
            'enhancer' => 'noviusos_menu/front/menu/enhancer/main',
            'previewUrl' => 'admin/noviusos_menu/menu/enhancer/preview',
            'dialog' => array(
                'contentUrl' => 'admin/noviusos_menu/menu/enhancer/popup',
                'width' => 500,
                'height' => 400,
                'ajax' => true,
            ),
        ),
    ),
    'icons' => array(
        64 => 'static/apps/noviusos_menu/img/64/menu.png',
        32 => 'static/apps/noviusos_menu/img/32/menu.png',
        16 => 'static/apps/noviusos_menu/img/16/menu.png',
    ),
);
