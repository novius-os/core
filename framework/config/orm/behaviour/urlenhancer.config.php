<?php
return array(
    'actions' => array(
        'visualise' => array(
            'label' => __('Visualise'),
            'primary' => true,
            'iconClasses' => 'nos-icon16 nos-icon16-eye',
            'action' => array(
                'action' => 'window.open',
                'url' => '{{preview_url}}',
            ),
            'disabled' => array(
                function($item, $params)
                {
                    if ($item::behaviours('Nos\Orm_Behaviour_Urlenhancer', false)) {
                        $url = $item->url_canonical(array('preview' => true));
                        if ($item->is_new()) {
                            return true;
                        }
                        if (!!empty($url)) {
                            return $params['config']['i18n']['visualising no url'];
                        }

                        return false;
                    }
                    return true;
                }),
            'targets' => array(
                'grid' => true,
                'toolbar-edit' => true,
            ),
            'visible' => array(
                function($params) {
                    if (isset($params['item']) && $params['item']::behaviours('Nos\Orm_Behaviour_Urlenhancer', false)) {
                        $url = $params['item']->url_canonical(array('preview' => true));
                        return !$params['item']->is_new() && !empty($url);
                    }
                    if (isset($params['model']) && $params['model']::behaviours('Nos\Orm_Behaviour_Urlenhancer', false)) {
                        return true;
                    }
                    return false;
                }
            ),
        ),
    ),
);