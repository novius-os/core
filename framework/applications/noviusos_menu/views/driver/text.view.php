<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

$content = $item_driver->item->mitem_text;
if (empty($content)) {
    $content = $item_driver->title();
}
if (!$item_driver->item->mitem_is_html) {
    $content = e($content);
}
echo html_tag('div', $params, $content);
