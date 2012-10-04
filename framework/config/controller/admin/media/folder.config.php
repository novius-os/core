<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

return array(
    'controller_url'  => 'admin/nos/media/folder',
    'model' => 'Nos\\Model_Media_Folder',
    'i18n_file' => 'nos::media_folder',
    'situation_relation' => 'parent',
    'tab' => array(
        'iconUrl' => 'static/novius-os/admin/novius-os/img/16/media.png',
        'labels' => array(
            'insert' => __('Add a folder'),
        ),
    ),
    'layout' => array(
        array(
            'view' => 'nos::admin/media/folder',
        ),
    ),
    'views' => array(
        'delete' => 'nos::admin/media/folder_delete',
    ),
    'fields' => array(
        'medif_id' => array(
            'form' => array(
                'type' => 'hidden',
            ),
        ),
        'medif_parent_id' => array(
            'widget' => 'Nos\Widget_Media_Folder',
            'form' => array(
                'type'  => 'hidden',
            ),
            'label' => __('Choose a folder where to put your sub-folder:'),
        ),
        'medif_title' => array(
            'form' => array(
                'type' => 'text',
            ),
            'label' => __('Title: '),
            'validation' => array(
                'required',
                'min_length' => array(2),
            ),
        ),
        'medif_dir_name' => array(
            'form' => array(
                'type' => 'text',
                'size' => 30,
            ),
            'label' => __('SEO, folder URL:'),
            'validation' => array(
                'required',
                'min_length' => array(2),
            ),
        ),
        'save' => array(
            'label' => '',
            'form' => array(
                'type' => 'submit',
                'tag' => 'button',
                'value' => __('Save'),
                'class' => 'primary',
                'data-icon' => 'check',
            ),
        ),
    ),
);
