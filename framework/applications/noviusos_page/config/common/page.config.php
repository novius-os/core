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