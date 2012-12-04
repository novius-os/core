<?php

Nos\I18n::current_dictionary(array('noviusos_user::common', 'nos::common'));

return array(
    'data_mapping' => array(
        'fullname' => array(
            'headerText' => __('Name'),
            'value' => function($item) {
                return $item->fullname();
            },
        ),
        'user_email' => array(
            'headerText' => __('Email'),
        ),
        'id_permission' => array(
            'visible' => false,
            'value' => function($item) {
                return $item->roles && reset($item->roles)->role_id ?: $item->user_id;
            },
        ),
    )
);