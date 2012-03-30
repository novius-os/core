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
    'nos_page' =>
    array(
        'name' => __('Pages'),
        'url' => 'admin/nos/page/list/index',
        'iconUrl' => 'static/novius-os/admin/novius-os/img/32/page.png',
        'icon64' => 'static/novius-os/admin/novius-os/img/64/page.png',
        'provider' =>
            array(
                'name' => 'Novius OS',
            ),
    ),
    'nos_media' =>
    array(
        'name' => __('Media centre'),
        'url' => 'admin/nos/media/list/index',
        'iconUrl' => 'static/novius-os/admin/novius-os/img/32/media.png',
        'icon64' => 'static/novius-os/admin/novius-os/img/64/media.png',
        'provider' =>
            array(
                'name' => 'Novius OS',
            ),
    ),
    'nos_user' =>
    array(
        'name' => __('Users'),
        'url' => 'admin/nos/user/list/index',
        'iconUrl' => 'static/novius-os/admin/novius-os/img/32/user.png',
        'icon64' => 'static/novius-os/admin/novius-os/img/64/user.png',
        'provider' =>
            array(
                'name' => 'Novius OS',
            ),
    ),
    'nos_tray' =>
    array(
        'name' => __('Applications manager'),
        'url' => 'admin/nos/tray/plugins',
        'iconUrl' => 'static/novius-os/admin/novius-os/img/24/tabs-store.png',
        'icon64' => 'static/novius-os/admin/novius-os/img/64/app-manager.png',
        'provider' =>
            array(
                'name' => 'Novius OS',
            ),
    ),
);
