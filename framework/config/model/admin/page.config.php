<?php
return array(
    'crud_controller' => '\Nos\Controller_Admin_Page_Page',
    'search_text' => 'page_title',
    'actions' => array(
        'Nos\Model_Page.delete' => array(
            'primary' => false
        ),
        'Nos\Model_Page.add_subpage' => array(
            'name' => 'add_page',
            'label' => __('Add a sub-page to this page'),
            'icon' => 'plus',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => 'admin/nos/page/page/insert_update?environment_id={{id}}',
                    'label' => __('Add a page'),
                    'iconUrl' => 'static/novius-os/admin/novius-os/img/16/page.png',
                ),
            ),
            'context' => array(
                'item' => true,
                'list' => true
            ),
            'enabled' => function($item) {
                return !$item->is_new();
            }
        ),
        'Nos\Model_Page.set_homepage' => array(
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
            'context' => array(
                'item' => true,
                'list' => true
            ),
            'enabled' => function($item) {
                return !$item->is_new();
            }
        ),
        'Nos\Model_Page.visualise' => array(
            'label' => __('Visualise'),
            'name' => 'visualise',
            'primary' => true,
            'iconClasses' => 'nos-icon16 nos-icon16-eye',
            'action' => array(
                'action' => 'window.open',
                'url' => '{{previewUrl}}',
            ),
            'context' => array(
                'item' => true,
                'list' => true
            ),
            'enabled' => function($item) {
                return !$item->is_new();
            }
        ),
        'Nos\Model_Page.renew_cache' => array(
            'label' => __('Renew pages\' cache'),
            'action' => array(
                'action' => 'nosAjax',
                'params' => array(
                    'url' => 'admin/nos/page/appdesk/clear_cache',
                ),
            ),
            'context' => array(
                'appdeskToolbar' => true,
            )
        ),
    )
);