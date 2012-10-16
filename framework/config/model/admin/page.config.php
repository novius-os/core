<?php
return array(
    'actions' => array(
        'Nos\Model_Page.edit' => array(
            'action' => array(
                'tab' => array(
                    'url' => "admin/nos/page/page/insert_update/{{id}}",
                ),
            ),
        ),
        'Nos\Model_Page.delete' => array(
            'action' => array(
                'dialog' => array(
                    'contentUrl' => 'admin/nos/page/page/delete/{{id}}',
                ),
            ),
        ),
    ),
);