<?php
return array(
    'actions' => array(
        'Nos\Model_User.edit' => array(
            'action' => array(
                'tab' => array(
                    'url' => "admin/nos/user/user/insert_update/{{id}}",
                ),
            ),
        ),
        'Nos\Model_User.delete' => array(
            'action' => array(
                'dialog' => array(
                    'contentUrl' => 'admin/nos/user/user/delete/{{id}}',
                ),
            ),
        ),
    ),
);