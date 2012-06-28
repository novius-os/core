<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos;

class DataCatcher
{
    const TYPE_TITLE = 1;
    const TYPE_URL = 2;
    const TYPE_TEXT = 3;
    const TYPE_IMAGE = 4;
    const TYPE_VIDEO = 5;
    const TYPE_DOCUMENT = 6;
    const TYPE_DATE = 7;
    const TYPE_COLLECTION = 8;

    public static function configRssChanel(array $config) {
        return array_merge(array(
            'title' => 'RSS Chanel',
            'description'  => '',
            'url' => 'admin/nos/data_catcher/rss_chanel',
            'iconUrl' => 'static/novius-os/admin/novius-os/img/16/rss.png',
            'onDemand' => false,
            'specified_models' => true,
            'required_data' => array(
                static::TYPE_TITLE,
            ),
            'optional_data' => array(
                static::TYPE_TEXT,
            ),
        ), $config);
    }

    public static function configRssItem(array $config) {
        return array_merge(array(
            'title' => 'RSS Item',
            'description'  => '',
            'url' => 'admin/nos/data_catcher/rss_item',
            'iconUrl' => 'static/novius-os/admin/novius-os/img/16/rss.png',
            'onDemand' => false,
            'specified_models' => true,
            'required_data' => array(
                static::TYPE_TITLE,
                static::TYPE_TEXT,
            ),
        ), $config);
    }
}