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
