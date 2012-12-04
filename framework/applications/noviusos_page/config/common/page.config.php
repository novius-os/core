<?php

Nos\I18n::current_dictionary(array('noviusos_page::common', 'nos::common'));

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
    'actions' => array(
        'Nos\Page\Model_Page.delete' => array(
            'primary' => false
        ),
        'Nos\Page\Model_Page.add' => array(
            'label' => __('Add a page'),
        ),
        'Nos\Page\Model_Page.add_subpage' => array(
            'name' => 'add_page',
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
            'name' => 'visualise',
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
            'name' => 'set_homepage',
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