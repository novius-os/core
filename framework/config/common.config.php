<?php
return array(
    'actions' => array(
        'add' => array(
            // Note to translator: Default copy meant to be overwritten by applications (e.g. Add Page > Add a page)
            'label' => __('Add {{model_label}}'),
            'action' => array(
                'action' => 'nosTabs',
                'method' => 'add',
                'tab' => array(
                    'url' => '{{controller_base_url}}insert_update?context={{context}}',
                ),
            ),
            'targets' => array(
                'toolbar-grid' => true,
            ),
        ),
        'edit' => array(
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => "{{controller_base_url}}insert_update/{{_id}}",
                    'label' => '{{_title}}',
                ),
            ),
            // Standard, most frequent actions (Edit, Visualise, Share, etc.)
            'label' => __('Edit'),
            'primary' => true,
            'icon' => 'pencil',
            'targets' => array(
                'grid' => true,
            ),
        ),
        'visualise' => array(
            'label' => __('Visualise'),
            'primary' => true,
            'iconClasses' => 'nos-icon16 nos-icon16-eye',
            'action' => array(
                'action' => 'window.open',
                'url' => '{{preview_url}}?_preview=1',
            ),
            'disabled' =>
            function($item)
            {
                if ($item::behaviours('Nos\Orm_Behaviour_Urlenhancer', false)) {
                    $url = $item->url_canonical(array('preview' => true));
                    return $item->is_new() || !!empty($url);
                }
                return true;
            },
            'targets' => array(
                'grid' => true,
                'toolbar-edit' => true,
            ),
            'visible' =>
            function($params) {
                if (isset($params['item']) && $params['item']::behaviours('Nos\Orm_Behaviour_Urlenhancer', false)) {
                    $url = $params['item']->url_canonical(array('preview' => true));
                    return !$params['item']->is_new() && !empty($url);
                }
                if (isset($params['model']) && $params['model']::behaviours('Nos\Orm_Behaviour_Urlenhancer', false)) {
                    return true;
                }
                return false;
            },
        ),
        'share' => array(
            'label' => __('Share'),
            'iconClasses' => 'nos-icon16 nos-icon16-share',
            'action' => array(
                'action' => 'share',
                'data' => array(
                    'model_id' => '{{_id}}',
                    'model_name' => '{{_model}}',
                ),
            ),
            'targets' => array(
                'toolbar-edit' => true,
            ),
            'visible' =>
            function($params) {
                $model = get_class($params['item']);
                return !$params['item']->is_new() && $model::behaviours('Nos\Orm_Behaviour_Sharable', false);
            },
        ),
        'delete' => array(
            'action' => array(
                'action' => 'confirmationDialog',
                'dialog' => array(
                    'contentUrl' => '{{controller_base_url}}delete/{{_id}}',
                    'title' => 'TO BE REPLACED',
                ),
            ),
            'label' => __('Delete'),
            'primary' => true,
            'icon' => 'trash',
            'red' => true,
            'targets' => array(
                'grid' => true,
                'toolbar-edit' => true,
            ),
            'visible' =>
            function($params) {
                return !isset($params['item']) || !$params['item']->is_new();
            },
        ),
    ),
);