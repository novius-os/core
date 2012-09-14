<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::load('nos::admin/page/appdesk');

$dataset = array(
    'id' => 'page_id',
    'title' => 'page_title',
    'url' => function($page) {
        return $page->get_href();
    },
    'previewUrl' => function($page) {
        return $page->get_href(array(
            'preview'  => true,
            'absolute' => true,
        ));
    },
    'is_home' => function($page) {
        return (bool) (int) $page->page_home;
    },
    'actions' => array(
        'delete' => function($page) {
            return $page->page_lock != $page::LOCK_DELETION;
        },
        'set_homepage' => function($page) {
            return !$page->page_home;
        },
    ),
);

return array(
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
    'search_text' => 'page_title',
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
    'i18n_file' => 'nos::admin/page/appdesk',
    'dataset' => $dataset,
    'appdesk' => array(
        'tab' => array(
            'label' => __('Pages'),
            'iconUrl' => 'static/novius-os/admin/novius-os/img/32/page.png',
        ),
        'actions' => array(
            'edit' => array(
                'label' => ___('nos::admin/appdesk', 'Edit'),
                'name' => 'edit',
                'primary' => true,
                'icon' => 'pencil',
                'action' => array(
                    'action' => 'nosTabs',
                    'tab' => array(
                        'url' => 'admin/nos/page/page/insert_update/{{id}}',
                        'label' => '{{title}}',
                        'iconUrl' => 'static/novius-os/admin/novius-os/img/16/page.png',
                    ),
                ),
            ),
            'add_subpage' => array(
                'name' => 'add_page',
                'label' => __('Add a sub-page to this page'),
                'icon' => 'plus',
                'action' => array(
                    'action' => 'nosTabs',
                    'tab' => array(
                        'url' => 'admin/nos/page/page/insert_update?context_id={{id}}',
                        'label' => __('Add a page'),
                        'iconUrl' => 'static/novius-os/admin/novius-os/img/16/page.png',
                    ),
                ),
            ),
            'delete' => array(
                'label' => ___('nos::admin/appdesk', 'Delete'),
                'name' => 'delete',
                'primary' => false,
                'icon' => 'trash',
                'action' => array(
                    'action' => 'confirmationDialog',
                    'dialog' => array(
                        'contentUrl' => 'admin/nos/page/page/delete/{{id}}',
                        'title' => __('Delete a page')
                    ),
                ),
            ),
            'visualise' => array(
                'label' => ___('nos::admin/appdesk', 'Visualise'),
                'name' => 'visualise',
                'primary' => true,
                'iconClasses' => 'nos-icon16 nos-icon16-eye',
                'action' => array(
                    'action' => 'window.open',
                    'url' => '{{previewUrl}}',
                ),
            ),
            'set_homepage' => array(
                'label' => __('Set as homepage'),
                'name' => 'set_homepage',
                'primary' => false,
                'icon' => 'home',
                'action' => array(
                    'action' => 'nosAjax',
                    'params' => array(
                        'url' => 'admin/nos/page/page/set_homepage',
                        'method' => 'POST',
                        'data' => array(
                            'id' => '{{id}}',
                        ),
                    ),
                ),
            ),
        ),
        'reloadEvent' => 'Nos\\Model_Page',
        'appdesk' => array(
            'buttons' => array(
                'page' => array(
                    'label' => __('Add a page'),
                    'action' => array(
                        'action' => 'nosTabs',
                        'method' => 'add',
                        'tab' => array(
                            'url' => 'admin/nos/page/page/insert_update?lang={{lang}}',
                            'label' => __('Add a page'),
                            'iconUrl' => 'static/novius-os/admin/novius-os/img/16/page.png',
                        ),
                    ),
                ),
                'renew_cache' => array(
                    'label' => __('Renew pages\' cache'),
                    'action' => array(
                        'action' => 'nosAjax',
                        'params' => array(
                            'url' => 'admin/nos/page/appdesk/clear_cache',
                        ),
                    ),
                ),
            ),
            'grid' => array(
                'urlJson' => 'admin/nos/page/appdesk/json',
                'columns' => array(
                    'title' => array(
                        'headerText' => __('Title'),
                        'sortDirection' => 'ascending',
                    ),
                    'lang' => array(
                        'lang' => true
                    ),
                    'url' => array(
                        'headerText' => __('Virtual url'),
                        'visible' => false,
                        'dataKey' => 'url'
                    ),
                    'published' => array(
                        'headerText' => __('Status'),
                        'dataKey' => 'publication_status',
                    ),
                    'actions' => array(
                        'actions' => array('edit', 'add_subpage', 'visualise', 'delete', 'set_homepage'),
                    ),
                ),
            ),
            'treeGrid' => array(
                'urlJson' => 'admin/nos/page/appdesk/tree_json',
            ),
            'defaultView' => 'treeGrid',
        ),
    ),
);
