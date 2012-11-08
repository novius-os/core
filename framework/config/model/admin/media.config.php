<?php
return array(
    'actions' => array(
        'Nos\Model_Media.edit' => array(
            'action' => array(
                'tab' => array(
                    'url' => "admin/nos/media/media/insert_update/{{id}}",
                ),
            ),
        ),
        'Nos\Model_Media.delete' => array(
            'action' => array(
                'dialog' => array(
                    'contentUrl' => 'admin/nos/media/media/delete/{{id}}',
                ),
            ),
        ),
    ),
);