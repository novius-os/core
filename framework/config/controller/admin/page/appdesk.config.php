<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

use Nos\I18n;

/*
 * 'dataset' => array(
        'fullname' => array(
            'headerText' => __('Name'),
            //'search_column' => \DB::expr('CONCAT(user_firstname, user_name)'),
            'value' => function($item) {
                return $item->fullname();
            },
        ),
        'email' => array(
            'headerText' => __('Email'),
            'column' => 'user_email',
        ),
        'id_permission' => array(
            'visible' => false,
            'value' => function($item) {
                return $item->roles && reset($item->roles)->role_id ?: $item->user_id;
            },
        ),
    ),
 */

$dataset = array(
    'title' => array(
        'headerText' => __('Title'),
        'column' => 'page_title',
        'sortDirection' => 'ascending'
    ),
    'url' => array(
        'value' => function($page) {
            return $page->url();
        },
        'visible' => false
    ),
    'is_home' => array(
        'value' => function($page) {
            return (bool) (int) $page->page_entrance;
        },
        'visible' => false
    ),
    /*
    'actions' => array(
        'delete' => function($page) {
            return $page->page_lock != $page::LOCK_DELETION;
        },
        'set_homepage' => function($page) {
            return !$page->page_entrance;
        },
    ),
    */
);

return array(
    'model' => '\Nos\Model_Page',
    'tree' => array(
        'models' => array(
            array(
                'model' => 'Nos\Model_Page',
                'order_by' => 'page_sort',
                'childs' => array('Nos\Model_Page'),
                'dataset' => $dataset,
            ),
        ),
        'roots' => array(
            array(
                'model' => 'Nos\Model_Page',
                'where' => array(array('page_parent_id', 'IS', \DB::expr('NULL'))),
                'order_by' => 'page_sort',
            ),
        ),
    ),
    'query' => array(
        'model' => 'Nos\Model_Page',
        'related' => array(),
    ),
    'selectedView' => 'default',
    'views' => array(
        'default' => array(
            'name' => __('Default view'),
            'json' => array('static/novius-os/admin/config/page/page.js'),
        ),
        'link_pick' => array(
            'name' => __('Link'),
            'virtual' => true,
            'json' => array(
                'static/novius-os/admin/config/page/page.js',
                'static/novius-os/admin/config/page/link_pick.js'
            ),
        ),
    ),
    'i18n' => array(
        'addDropDown' => __('Select an action'),
        'columns' => __('Columns'),
        'showFiltersColumns' => __('Filters column header'),
        'visibility' => __('Visibility'),
        'settings' => __('Settings'),
        'vertical' => __('Vertical'),
        'horizontal' => __('Horizontal'),
        'hidden' => __('Hidden'),
        'item' => __('page'),
        'items' => __('pages'),
        'showNbItems' => __('Showing {{x}} pages out of {{y}}'),
        'showOneItem' => __('Show 1 page'),
        'showNoItem' => __('No page'),
        'showAll' => __('Show all pages'),
        'views' => __('Views'),
        'viewGrid' => __('Grid'),
        'viewTreeGrid' => __('Tree grid'),
        'viewThumbnails' => __('Thumbnails'),
        'preview' => __('Preview'),
        'loading' => __('Loading...'),
        'contexts' => __('Contexts'),
    ),
    'dataset' => $dataset,
    'appdesk' => array(
        /* @todo remove when on native apps */
        'tab' => array(
            'label' => __('Pages'),
            'iconUrl' => 'static/novius-os/admin/novius-os/img/32/page.png',
        ),
        'reloadEvent' => 'Nos\\Model_Page', /* @todo: should not need this */
        'appdesk' => array( /* @todo: auto tree grid */
            'treeGrid' => array(
                'urlJson' => 'admin/nos/page/appdesk/tree_json',
            ),
            'defaultView' => 'treeGrid',
        )
    ),
);
