<?php

Nos\I18n::current_dictionary(array('noviusos_user::common', 'nos::common'));

return array(
    'data_mapping' => array(
        'role_name' => array(
            'title' => __('Role'),
            'cellFormatters' => array(
                'link' => array(
                    'type' => 'link',
                    'action' => 'Nos\User\Model_User.edit',
                ),
            ),
        ),
    ),
    'i18n' => array(
        // Crud
        'notification item added' => __('All wrapped up! This new role is ready.'),
        'notification item deleted' => __('The role has been deleted.'),

        // General errors
        'notification item does not exist anymore' => __('This role doesn’t exist any more. It has been deleted.'),
        'notification item not found' => __('We cannot find this role.'),

        // Deletion popup
        'deleting item title' => __('Deleting the role ‘{{title}}’'),

        // Delete action's labels
        'deleting button N items' => n__(
            'Yes, delete this role',
            'Yes, delete these {{count}} roles'
        ),
    ),
    'actions' => array(
        'add' => array(
            'label' => __('Add a role'),
        ),
    ),
);
