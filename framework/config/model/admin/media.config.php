<?php
return array(
    'crud_controller' => '\Nos\Controller_Admin_Media_Media',
    'search_text' => array(
        'media_title',
        'media_ext',
        'media_file',
    ),
    'actions' => array(
        'Nos\Model_Media.visualise' => array(
            'label' => __('Visualise'),
            'name' => 'visualise',
            'primary' => true,
            'iconClasses' => 'nos-icon16 nos-icon16-eye',
            'action' => array(
                'action' => 'nosMediaVisualise',
            ),
            'enabled' => function($item) {
                return true;
            }
        ),
    )
);