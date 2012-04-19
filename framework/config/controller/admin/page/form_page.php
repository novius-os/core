<?php

Config::load(APPPATH.'data'.DS.'config'.DS.'templates.php', 'templates');
$templates = array();
foreach (Config::get('templates', array()) as $tpl_key => $template) {
    $templates[$tpl_key] = $template['title'];
}

return array(
    'page_id' => array (
        'label' => 'ID: ',
        'form' => array(
            'type' => 'hidden',
        ),
    ),
    'page_title' => array(
        'label' => 'Title',
        'form' => array(
            'type' => 'text',
        ),
        'validation' => array(
            'required',
            'min_length' => array(2),
        ),
    ),
    'page_parent_id' => array(
        'widget' => 'Nos\Widget_Page_Selector',
        'widget_options' => array(
            'width' => '250px',
            'height' => '250px',
        ),
        'label' => __('Location: '),
        'form' => array(
        ),
    ),
    'page_template' => array(
        'label' => 'Template: ',
        'form' => array(
            'type' => 'select',
            'options' => $templates,
        ),
    ),
    'page_virtual_name' => array(
        'label' => 'URL: ',
        'form' => array(
            'type' => 'text',
        ),
        'validation' => array(
            'required',
            'min_length' => array(2),
        ),
    ),
    'page_meta_title' => array(
        'label' => 'SEO title: ',
        'form' => array(
            'type' => 'text',
        ),
    ),
    'page_meta_description' => array(
        'label' => 'Description: ',
        'form' => array(
            'type' => 'textarea',
            'rows' => 6,
        ),
    ),
    'page_meta_keywords' => array(
        'label' => 'Keywords: ',
        'form' => array(
            'type' => 'textarea',
            'rows' => 3,
        ),
    ),
    'page_meta_noindex' => array(
        'label' => "Don't index on search engines",
        'form' => array(
            'type' => 'checkbox',
            'value' => '1',
        ),
    ),
    'page_menu' => array(
        'label' => "Shows in the menu",
        'form' => array(
            'type' => 'checkbox',
            'value' => '1',
        ),
    ),
    'page_menu_title' => array(
        'label' => 'What\'s the page called in the menu: ',
        'form' => array(
            'type' => 'text',
        ),
    ),
    'page_external_link' => array(
        'label' => 'URL: ',
        'form' => array(
            'type' => 'text',
        ),
    ),
    'page_external_link_type' => array(
        'label' => 'Target: ',
        'form' => array(
            'type' => 'select',
            'options' => array(
                Nos\Model_Page_Page::EXTERNAL_TARGET_NEW   => 'New window',
                Nos\Model_Page_Page::EXTERNAL_TARGET_POPUP => 'Popup',
                Nos\Model_Page_Page::EXTERNAL_TARGET_SAME  => 'Same window',
            ),
        ),
    ),
    'page_type' => array(
        'label' => 'Type: ',
        'form' => array(
            'type' => 'select',
            'options' => array(
                Nos\Model_Page_Page::TYPE_CLASSIC => 'Page',
                /*Nos\Model_Page_Page::TYPE_FOLDER => 'Folder / Chapter',
                Nos\Model_Page_Page::TYPE_INTERNAL_LINK => 'Internal link',*/
                Nos\Model_Page_Page::TYPE_EXTERNAL_LINK => 'External link',
            ),
        ),
    ),
    'page_lock' => array(
        'label' => 'Lock status: ',
        'form' => array(
            'type' => 'select',
            'options' => array(
                Nos\Model_Page_Page::LOCK_UNLOCKED => 'Unlocked',
                Nos\Model_Page_Page::LOCK_DELETION => 'Deletion',
                Nos\Model_Page_Page::LOCK_EDITION  => 'Modification',
            ),
        ),
    ),
    'page_cache_duration' => array(
        'label' => 'Regenerate every',
        'form' => array(
            'type' => 'text',
            'size' => 4,
        ),
    ),
    'save' => array(
        'label' => '',
        'form' => array(
            'type' => 'submit',
            'tag' => 'button',
            'value' => 'Save',
            'class' => 'primary',
            'data-icon' => 'check',
        ),
    ),
);