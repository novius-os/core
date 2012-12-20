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
            'method' => 'url',
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
        'page_published' => array(
            'title' => __('Status'),
            'method' => 'publication_status',
            'multiContextHide' => true,
        ),
    ),
    'i18n' => array(
        // Crud
        'successfully added' => __('And voilà! The page has been added.'),
        'successfully deleted' => __('The page has been deleted.'),

        // General errors
        'item deleted' => __('This page doesn’t exist any more. It has been deleted.'),
        'not found' => __('We cannot find this page.'),

        // Blank slate
        'error added in context not parent' => __('We’re afraid this page cannot be added in {{context}} because its <a>parent</a> is not available in this context.'), #wtf two strings needed here (this context / this language)

        // Deletion popup
        'delete an item' => __('Deleting the page ‘{{title}}’'),
        'you are about to delete, confim' => __('Last chance, there’s no undo. Do you really want to delete this page?'),
        'exists in multiple context' => __('This page exists in <strong>{{count}} contexts</strong>.'),
        'delete in the following contexts' => __('Delete this page in the following contexts:'),
        'item has 1 sub-item' => __('This page has <strong>1 sub-page</strong>.'),
        'item has multiple sub-items' => __('This page has <strong>{{count}} sub-pages</strong>.'),
        'yes delete sub-items' => __('Yes, I want to delete this page and all of its {{count}} sub-pages.'),
        'confirm deletion wrong_confirmation' => __('We cannot delete this page as the number of sub-items you’ve entered is wrong. Please amend it.'),
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
                    'url' => '{{controller_base_url}}insert_update?environment_id={{_id}}&context={{_context}}',
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
            'disabled' => function() {
                return false;
            },
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
            'label' => __('Set as home page'),
            'primary' => false,
            'icon' => 'home',
            'action' => array(
                'action' => 'nosAjax',
                'params' => array(
                    'url' => '{{controller_base_url}}set_homepage',
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
        'Nos\Page\Model_Page.clone' => array(
            'action' => array(
                'action' => 'nosAjax',
                'params' => array(
                    'url' => '{{controller_base_url}}clone/{{_id}}',
                ),
            ),
            'label' => __('Duplicate'),
            'primary' => false,
            'icon' => 'circle-plus',
            'targets' => array(
                'grid' => true,
            ),
        ),
        'Nos\Page\Model_Page.clone_tree' => array(
            'action' => array(
                'action' => 'nosAjax',
                'params' => array(
                    'url' => '{{controller_base_url}}clone_tree/{{_id}}',
                ),
            ),
            'label' => __('Duplicate including the sub-pages'),
            'primary' => false,
            'icon' => 'circle-plus',
            'targets' => array(
                'grid' => true,
            ),
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
                'toolbar-grid' => true,
            ),
        ),
    ),
);