<?php
return array(
    'data' => array(
        'fields' => array(
            'fullname' => array(
                'label' => __('Name'),
                'value' => function($item) {
                    return $item->fullname();
                },
            ),
            'user_email' => array(
                'label' => __('Email'),
            ),
            'id_permission' => array(
                'visible' => false,
                'value' => function($item) {
                    return $item->roles && reset($item->roles)->role_id ?: $item->user_id;
                },
            ),
        ),
        'contexts' => array(
            'appdesk'   => array('fullname', 'user_email', 'id_permission'),
            'inspector' => array(
                'fallback' => 'appdesk',
                'fields' => array('fullname')
            )
        )
    )
);