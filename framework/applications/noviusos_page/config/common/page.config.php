<?php

Nos\I18n::current_dictionary(array('noviusos_page::common', 'nos::application', 'nos::common'));

$check_draft = function ($page) {
    // Not published => don't disable
    if ($page->planificationStatus() == 0) {
        return false;
    }
    // Published or scheduled => disable
    return \Nos\User\Permission::atMost('noviusos_page::page', '1_draft_only', '2_full_access');
};

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
            'value' => function ($page) {
                return \Nos\Tools_Url::encodePath($page->url(array('preview'  => true)));
            },
        ),
        'is_home' => array(
            'value' => function ($page) {
                return (bool) (int) $page->page_entrance;
            }
        ),
        'iconClasses' => array(
            'value' => function ($page) {
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
        'deleting button N items' => n__(
            'Yes, delete this page',
            'Yes, delete these {{count}} pages'
        ),

        'N items' => n__(
            '1 page',
            '{{count}} pages'
        ),

        # Keep only if the model has the behaviour Contextable
        'deleting with N contexts' => n__(
            'This page exists in <strong>one context</strong>.',
            'This page exists in <strong>{{context_count}} contexts</strong>.'
        ),
        'deleting with N languages' => n__(
            'This page exists in <strong>one language</strong>.',
            'This page exists in <strong>{{language_count}} languages</strong>.'
        ),

        # Keep only if the model has the behaviour Tree
        'deleting with N children' => n__(
            'This page has <strong>one sub-page</strong>.',
            'This page has <strong>{{children_count}} sub-pages</strong>.'
        ),
    ),
    'actions' => array(
        'list' => array(
            'delete' => array(
                'primary' => false,
                'disabled' => array(
                    'check_home' => function ($page) {
                        return !!$page->page_home ? __('The home page cannot be deleted. To delete this page, set another page as home page first.') : false;
                    },
                    'check_locked' => function ($page) {
                        return ($page->page_lock == $page::LOCK_DELETION) ? __('You can’t delete this page. It is locked.') : false;
                    },
                    'check_draft' => $check_draft,
                    'check_draft_children' => function ($item, $params = array()) {
                        // This will check if any children is published to ensure people with the draft access
                        // cannot delete an unpublished page which contains published children

                        // Only do this in the popup because it could be a bit resource-hungry
                        if (!isset($params['delete_popup'])) {
                            return false;
                        }

                        // If user has full access to the pages application, allow the action
                        if (\Nos\User\Permission::atLeast('noviusos_page::page', '2_full_access', '2_full_access')) {
                            return false;
                        }

                        // If there is no children, allow the action
                        $ids = $item->get_ids_children(false);
                        if (empty($ids)) {
                            return false;
                        }

                        $count_unpublished = $item::query(array(
                            'where' => array(
                                array(\Arr::get($item->primary_key(), 0), 'IN', $ids),
                                array('published', false),
                            ),
                        ))->count();
                        // If any child is published, deny the action
                        return $count_unpublished != count($ids);
                    },
                ),
            ),
            'edit' => array(
                'disabled' => array(
                    'check_draft' => $check_draft,
                ),
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
                    'is_new' => function ($params) {
                        return !isset($params['item']) || !$params['item']->is_new();
                    },
                ),
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
                    'check_monocontext' => function ($page) {
                        $controller = \Nos\Nos::main_controller();
                        static $disabled = null;
                        if ($disabled === null) {
                            $disabled = false;
                            if (is_subclass_of($controller, 'Nos\Controller_Admin_Appdesk')) {
                                $context = Input::get('context', null);
                                if (empty($context) || (is_array($context) && count($context) > 1)) {
                                    $one_site = count(Nos\Tools_Context::sites()) === 1;
                                    if ($one_site) {
                                        $disabled = __('We know it’s frustrating, but you can only set a page as home page when viewing one language. Select a language from the drop-down list in the top-right corner to do so.');
                                    } else {
                                        $disabled = __('We know it’s frustrating, but you can only set a page as home page when viewing one context. Select a context from the drop-down list in the top-right corner to do so.');
                                    }
                                }
                            }
                        }
                        return $disabled;
                    },
                    'check_published' => function ($page) {
                        return !$page->published() ? __('You cannot set this page as home page because it isn’t published. Publish it first.') : false;
                    },
                    'check_home' => function ($page) {
                        return !!$page->page_home ? __('This page is the home page already.') : false;
                    },
                ),
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
                // Don't disable, duplicated pages are always unpublished
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
        ),
    ),
);
