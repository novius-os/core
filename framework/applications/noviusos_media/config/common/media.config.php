<?php
return array(
    'data_mapping' => array(
        'media_ext' => array(
            'title' => __('Ext.'),
            'width' => 60,
        ),
        'media_title' => array(
            'title' => __('Title'),
        ),
        'media_file',
        'path' => array(
            'value' => function ($item) {
                return $item->get_public_path();
            },
        ),
        'path_folder' => array(
            'value' => function ($item) {
                return dirname($item->get_public_path());
            },
        ),
        'image' => array(
            'value' => function ($item) {
                return $item->is_image();
            },
        ),
        'thumbnail' => array(
            'value' => function ($item) {
                return $item->is_image() ? $item->get_public_path_resized(64, 64) : '';
            },
        ),
        'media_height',
        'media_width',
        'thumbnailAlternate' => array(
            'value' => function ($item) {
                $extensions = array(
                    'gif' => 'image.png',
                    'png' => 'image.png',
                    'jpg' => 'image.png',
                    'jpeg' => 'image.png',
                    'bmp' => 'image.png',
                    'doc' => 'document.png',
                    'xls' => 'document.png',
                    'ppt' => 'document.png',
                    'docx' => 'document.png',
                    'xlsx' => 'document.png',
                    'pptx' => 'document.png',
                    'odt' => 'document.png',
                    'odf' => 'document.png',
                    'odp' => 'document.png',
                    'pdf' => 'document.png',
                    'mp3' => 'music.png',
                    'wav' => 'music.png',
                    'avi' => 'video.png',
                    'mkv' => 'video.png',
                    'mpg' => 'video.png',
                    'mpeg' => 'video.png',
                    'mov' => 'video.png',
                    'zip' => 'archive.png',
                    'rar' => 'archive.png',
                    'tar' => 'archive.png',
                    'gz' => 'archive.png',
                    '7z' => 'archive.png',
                    'txt' => 'text.png',
                    'xml' => 'text.png',
                    'htm' => 'text.png',
                    'html' => 'text.png',
                );
                return isset($extensions[$item->media_ext]) ? 'static/novius-os/admin/novius-os/img/64/'.$extensions[$item->media_ext] : '';
            },
        ),
    ),
    'actions' => array(
        'visualise' => array(
            'name' => 'visualise',
            'iconClasses' => 'nos-icon16 nos-icon16-eye',
            'label' => __('Visualise'),
            'action' => array(
                'action' => 'nosMediaVisualise',
            ),
            'context' => array(
                'list' => true
            )
        ),
    )
);