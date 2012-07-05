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
    'base_url'  => 'admin/nos/page/page',
    'item_text' => __('page'),
    'tabInfos' => array(
        'label' => function($page) {
            return $page->is_new() ? __('Add a page') : $page->page_title;
        },
        'iconUrl' => 'static/novius-os/admin/novius-os/img/16/page.png',
    ),
    'tabInfosBlankSlate' => array(
        'label' => __('Translate a page'),
    ),
    'actions' => array(
        'visualise' => function($page) {
            return array(
                'label' => __('Visualise'),
                'action' => array(
                    'openWindow' => $page->get_href() . '?_preview=1',
                ),
                'iconClasses' => 'nos-icon16 nos-icon16-eye',
            );
        }
    ),
);