<?php

return array(
    'medias' => array(),
    'title' => 'page_title',
    'id' => 'page_id',

    'large' => true,

    'save' => 'save',

    'subtitle' => array('page_type', 'page_template'),

    'content' => array(),

    'menu' => array(
        __('Menu') => array('page_parent_id', 'page_menu', 'page_menu_title'),
        __('URL (page address)') => array('page_virtual_name'),
        __('SEO')                => array('page_meta_noindex', 'page_meta_title', 'page_meta_description', 'page_meta_keywords'),
        __('Admin')              => array(
            'header_class'  => 'faded',
            'content_class' => 'faded',
            'fields'        => array('page_cache_duration', 'page_lock'),
        ),
    ),
);
