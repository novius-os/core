<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
if (isset($item_driver->item) && isset($item_driver->item->mitem_page_id) && $item_driver->item->mitem_page_id) {
    $page = \Nos\Page\Model_Page::find($item_driver->item->mitem_page_id);
    if (!empty($page)) {
        $params['text'] = e($item_driver->title());
        if (method_exists(\Nos\Nos::main_controller(), 'getUrl') &&
            \Nos\Nos::main_controller()->getUrl() === $page->url()) {
            !isset($params['class']) && $params['class'] = '';
            $params['class'] .= ' '.\Arr::get($params, 'active_class', 'active');
        }
        echo $page->htmlAnchor($params);
        return;
    }
}
echo html_tag('div', $params, e($item_driver->title()));
