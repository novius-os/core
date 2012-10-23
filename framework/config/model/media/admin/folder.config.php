<?php
return array(
    'crud_controller' => '\Nos\Controller_Admin_Media_Folder',
    'actions' => array(
        'Nos\Model_Media_Folder.add_media' => array(
            'name' => 'add_media',
            'label' => __('Add a media in this folder'),
            'icon' => 'plus',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => 'admin/nos/media/media/insert_update?environment_id={{id}}',
                    'label' => 'Add a media in the "{{title}}" folder'
                ),
            ),
            'context' => array(
                'list' => true,
                'item' => true,
            ),
        ),
        'Nos\Model_Media_Folder.add_folder' => array(
            'name' => 'add_folder',
            'label' => __('Add a sub-folder to this folder'),
            'icon' => 'folder-open',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => 'admin/nos/media/folder/insert_update?environment_id={{id}}',
                    'label' => 'Add a sub-folder in "{{title}}"',
                ),
                'dialog' => array(
                    'width' => 600,
                    'height' => 250
                ),
            ),
            'context' => array(
                'list' => true,
                'item' => true,
            ),
        ),
        'Nos\Model_Media_Folder.edit' => array(
            'label' => __('Edit this folder'),
            'enabled' => function($item) {
                return !$item->is_new() && $item->medif_parent_id != null;
            },

        ),
        'Nos\Model_Media_Folder.delete' => array(
            'label' => __('Delete this folder'),
            'enabled' => function($item) {
                return !$item->is_new() && $item->medif_parent_id != null;
            },
        ),
    )
);