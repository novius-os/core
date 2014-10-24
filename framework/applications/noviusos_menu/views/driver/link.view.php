<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

if (isset($item_driver->item) && isset($item_driver->item->mitem_url_blank) && $item_driver->item->mitem_url_blank) {
    $params['target'] = '_blank';
}
if (isset($item_driver->item) && isset($item_driver->item->mitem_url)) {
    echo \Html::anchor($item_driver->item->mitem_url, e($item_driver->title()), $params);
}
