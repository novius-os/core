<?php

Nos\I18n::current_dictionary(array('noviusos_page::common', 'nos::application', 'nos::common'));

return array(
    'data_mapping' => array(
        'page_title' => array(
            'title' => __('Title'),
            'sortDirection' => 'ascending',
            'cellFormatters' => array(
                'is_home' => array(
                    'type' => 'iconClasses',
                    'column' => 'iconClasses',
                ),
            ),
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
        'iconClasses' => array(
            'value' => function($page) {
                return $page->page_entrance ? 'ui-icon ui-icon-home' : false;
            }
        ),
    ),
    'i18n' => array(
        // Crud
        'notification item added' => __('And voilà! The page has been added.'),
        'notification item deleted' => __('The page has been deleted.'),

        // General errors
        'notification item does not exist anymore' => __('This page doesn’t exist any more. It has been deleted.'),
        'notification item not found' => __('We cannot find this page.'),

        // Blank slate
        'translate error parent not available in context' => __('We’re afraid this page cannot be added to {{context}} because its <a>parent</a> is not available in this context yet.'),
        'translate error parent not available in language' => __('We’re afraid this page cannot be translated into {{language}} because its <a>parent</a> is not available in this language yet.'),

        // Deletion popup
        'deleting item title' => __('Deleting the page ‘{{title}}’'),

        # Delete action's labels
        'deleting button 1 item' => __('Yes, delete this page'),
        'deleting button N items' => __('Yes, delete these {{count}} pages'),

        '1 item' => __('1 page'),
        'N items' => __('{{count}} pages'),

        # Keep only if the model has the behaviour Contextable
        'deleting with N contexts' => __('This page exists in <strong>{{context_count}} contexts</strong>.'),
        'deleting with N languages' => __('This page exists in <strong>{{language_count}} languages</strong>.'),

        # Keep only if the model has the behaviours Contextable + Tree
        'deleting with N contexts and N children' => __('This page exists in <strong>{{context_count}} contexts</strong> and has <strong>{{children_count}} sub-pages</strong>.'),
        'deleting with N contexts and 1 child' => __('This page exists in <strong>{{context_count}} contexts</strong> and has <strong>one sub-page</strong>.'),
        'deleting with N languages and N children' => __('This page exists in <strong>{{language_count}} languages</strong> and has <strong>{{children_count}} sub-pages</strong>.'),
        'deleting with N languages and 1 child' => __('This page exists in <strong>{{language_count}} languages</strong> and has <strong>one sub-page</strong>.'),

        # Keep only if the model has the behaviour Tree
        'deleting with 1 child' => __('This page has <strong>1 sub-page</strong>.'),
        'deleting with N children' => __('This page has <strong>{{children_count}} sub-pages</strong>.'),
    ),
    'actions' => array(
        'list' => array(
            'delete' => array(
                'primary' => false,
                'disabled' => array(
                    function($page) {
                        return ($page->page_lock == $page::LOCK_DELETION) ? __('You can’t delete this page. It is locked.') : false;
                    }),
            ),
            'add' => array(
                'label' => __('Add a page'),
            ),
            'visualise' => array(
                'label' => __('Visualise'),
                'primary' => true,
                'iconClasses' => 'nos-icon16 nos-icon16-eye',
                'action' => array(
                    'action' => 'window.open',
                    'url' => '{{previewUrl}}',
                ),
                'disabled' => false,
                'targets' => array(
                    'grid' => true,
                    'toolbar-edit' => true,
                ),
                'visible' => array(
                function($params) {
                    return !isset($params['item']) || !$params['item']->is_new();
                })
            ),
            'add_subpage' => array(
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
            'set_homepage' => array(
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
                'disabled' => array(
                    function($page) {
                        return !!$page->page_home ? __('This page is the home page already.') : false;
                    }),
            ),
            'duplicate' => array(
                'action' => array(
                    'action' => 'nosAjax',
                    'params' => array(
                        'url' => '{{controller_base_url}}duplicate/{{_id}}',
                    ),
                ),
                'label' => __('Duplicate'),
                'primary' => false,
                'icon' => 'circle-plus',
                'targets' => array(
                    'grid' => true,
                ),
            ),
            'renew_cache' => array(
                'label' => __('Renew pages’ cache'),
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
        'order' => array(
            'add',
            'edit',
            'visualise',
            'share',
            'delete',
        )
    ),
);