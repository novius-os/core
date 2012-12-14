<?php

Nos\I18n::current_dictionary(array('noviusos_user::common', 'nos::common'));

return array(
    'data_mapping' => array(
        'fullname' => array(
            'title' => __('Name'),
            'value' => function($item) {
                return $item->fullname();
            },
        ),
        'user_email' => array(
            'title' => __('Email'),
        ),
        'id_permission' => array(
            'visible' => false,
            'value' => function($item) {
                return $item->roles && reset($item->roles)->role_id ?: $item->user_id;
            },
        ),
    ),
    'i18n' => array(
        // Crud
        'successfully added' => __('User successfully added.'),
        'successfully saved' => __('User successfully saved.'),
        'successfully deleted' => __('The user has successfully been deleted!'),

        // General errors
        // State deleted
        'item deleted' => __('This user has been deleted.'),
        'not found' => __('User not found'),

        // Deletion popup
        'delete an item' => __('Delete a user'),
        //'you are about to delete' => __('You are about to delete the user <span style="font-weight: bold;">":title"</span>.'),
    ),
    'actions' => array(
        'Nos\User\Model_User.add' => array(
            'label' => __('Add a user'),
        ),
    ),
);