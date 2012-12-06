<?php

Nos\I18n::current_dictionary(array('noviusos_page::common', 'nos::application', 'nos::common'));

return array(
    'data_mapping' => array(
        'page_title' => array(
            'title' => __('Title'),
            'sortDirection' => 'ascending',
        ),
        'context' => true,
        'url' => array(
            'value' => function($page) {
                return $page->url();
            },
        ),
        'previewUrl' => array(
            'value' => function($page) {
                return $page->url(array('preview'  => true));
            },
        ),
        'is_home' => array(
            'value' => function($page) {
                return (bool) (int) $page->page_entrance;
            }
        ),
        'published' => array(
            'title' => __('Status'),
            'dataKey' => 'publication_status',
            'multiContextHide' => true,
        ),
    ),
    'i18n' => array(
        // Crud
        'successfully added' => __('Page successfully added.'),
        'successfully saved' => __('Page successfully saved.'),
        'successfully deleted' => __('The page has successfully been deleted!'),

        // General errors
        'item deleted' => __('This page has been deleted.'),
        'not found' => __('Page not found'),

        // Blank slate
        'error added in lang not parent' => __('This page cannot be added {lang} because its {parent} is not available in this language yet.'),
        'error added in lang' => __('This page cannot be added {lang}.'),
        'item inexistent in lang yet' => __('This page has not been added in {lang} yet.'),
        'add an item in lang' => __('Add a new page in {lang}'),

        // Deletion popup
        'delete an item' => __('Delete a page'),
        'you are about to delete, confim' => __('You are about to delete the page <span style="font-weight: bold;">":title"</span>. Are you sure you want to continue?'),
        'you are about to delete' => __('You are about to delete the page <span style="font-weight: bold;">":title"</span>.'),
        'exists in multiple context' => __('This page exists in <strong>{count} contexts</strong>.'),
        'delete in the following contexts' => __('Delete this page in the following contexts:'),
        'item has 1 sub-item' => __('This page has <strong>1 sub-page</strong>.'),
        'item has multiple sub-items' => __('This page has <strong>{count} sub-pages</strong>.'),
        'yes delete sub-items' => __('Yes, I want to delete this page and all of its {count} sub-pages.'),
    ),
    'actions' => array(
        'Nos\Page\Model_Page.delete' => array(
            'primary' => false,
            'disabled' =>
                function($page) {
                    return $page->page_lock == $page::LOCK_DELETION;
                },
        ),
        'Nos\Page\Model_Page.add' => array(
            'label' => __('Add a page'),
        ),
        'Nos\Page\Model_Page.add_subpage' => array(
            'label' => __('Add a sub-page to this page'),
            'icon' => 'plus',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => 'admin/noviusos_page/page/insert_update?environment_id={{_id}}',
                    'label' => __('Add a page'),
                    'iconUrl' => 'static/apps/noviusos_page/img/16/page.png',
                ),
            ),
            'targets' => array(
                'grid' => true,
            ),
        ),
        'Nos\Page\Model_Page.visualise' => array(
            'label' => __('Visualise'),
            'primary' => true,
            'iconClasses' => 'nos-icon16 nos-icon16-eye',
            'action' => array(
                'action' => 'window.open',
                'url' => '{{previewUrl}}',
            ),
            'targets' => array(
                'grid' => true,
                'toolbar-edit' => true,
            ),
            'visible' =>
                function($params) {
                    return !isset($params['item']) || !$params['item']->is_new();
                }
        ),
        'Nos\Page\Model_Page.set_homepage' => array(
            'label' => __('Set as homepage'),
            'primary' => false,
            'icon' => 'home',
            'action' => array(
                'action' => 'nosAjax',
                'params' => array(
                    'url' => 'admin/noviusos_page/page/set_homepage',
                    'method' => 'POST',
                    'data' => array(
                        'id' => '{{_id}}',
                    ),
                ),
            ),
            'targets' => array(
                'grid' => true,
            ),
            'disabled' =>
                function($page) {
                    return !!$page->page_home;
                },
        ),
        'Nos\Page\Model_Page.renew_cache' => array(
            'label' => __('Renew pages\' cache'),
            'action' => array(
                'action' => 'nosAjax',
                'params' => array(
                    'url' => 'admin/noviusos_page/appdesk/clear_cache',
                ),
            ),
            'targets' => array(
                'toolbar-list' => true,
            ),
        ),
    ),
);