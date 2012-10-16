<?php
return array(
    'actions' => array(
        'Nos\Model_Media_Folder.edit' => array(
            'action' => array(
                'tab' => array(
                    'url' => "admin/nos/media/folder/insert_update/{{id}}",
                ),
            ),
        ),
        'Nos\Model_Media_Folder.delete' => array(
            'action' => array(
                'dialog' => array(
                    'contentUrl' => 'admin/nos/media/folder/delete/{{id}}',
                ),
            ),
        ),
    ),
);