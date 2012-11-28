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
                    'url' => 'admin/noviusos_page/page/insert_update?environment_id={{id}}',
                    'label' => __('Add a page'),
                    'iconUrl' => 'static/apps/noviusos_page/img/16/page.png',
                ),
            ),
            'context' => array(
                'list' => true,
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
            'context' => array(
                'list' => true,
                'item' => true,
            ),
            'enabled' =>
                function($item) {
                    return !$item->is_new();
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
                        'id' => '{{id}}',
                    ),
                ),
            ),
            'context' => array(
                'list' => true,
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
            'context' => array(
                'appdeskToolbar' => true,
            ),
        ),
    ),
);