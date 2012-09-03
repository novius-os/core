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
            'name' => 'Page',
            'url' => 'admin/nos/page/appdesk/index',
            'iconUrl' => 'static/novius-os/admin/novius-os/img/32/page.png',
            'icon64' => 'static/novius-os/admin/novius-os/img/64/page.png',
            'application' => 'nos_page',
        ),
        'nos_media' => array(
            'name' => 'Media centre',
            'url' => 'admin/nos/media/appdesk/index',
            'iconUrl' => 'static/novius-os/admin/novius-os/img/32/media.png',
            'icon64' => 'static/novius-os/admin/novius-os/img/64/media.png',
            'application' => 'nos_media',
        ),
        'nos_user' => array(
            'name' => 'Users',
            'url' => 'admin/nos/user/appdesk/index',
            'iconUrl' => 'static/novius-os/admin/novius-os/img/32/user.png',
            'icon64' => 'static/novius-os/admin/novius-os/img/64/user.png',
            'application' => 'nos_user',
        ),
    ),
    'data_catchers' => array(
        'rss_channel' => array(
            'title' => 'RSS Channel',
            'description'  => '',
            'url' => 'admin/nos/datacatcher/rss_channel',
            'iconUrl' => 'static/novius-os/admin/novius-os/img/16/rss.png',
            'onDemand' => false,
            'specified_models' => true,
            'required_data' => array(
                \Nos\DataCatcher::TYPE_TITLE,
            ),
            'optional_data' => array(
                \Nos\DataCatcher::TYPE_TEXT,
            ),
        ),
        'rss_item' => array(
            'title' => 'RSS Item',
            'description'  => '',
            'url' => 'admin/nos/datacatcher/rss_item',
            'iconUrl' => 'static/novius-os/admin/novius-os/img/16/rss.png',
            'onDemand' => false,
            'specified_models' => true,
            'required_data' => array(
                \Nos\DataCatcher::TYPE_TITLE,
                \Nos\DataCatcher::TYPE_TEXT,
            ),
        ),
    ),
);
