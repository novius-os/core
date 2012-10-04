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
    'controller_url'  => 'admin/noviusos_media/folder',
    'model' => 'Nos\\Media\\Model_Folder',
    'messages' => array(
        'successfully added' => __('Folder successfully added.'),
        'successfully saved' => __('Folder successfully saved.'),
        'successfully deleted' => __('The folder has successfully been deleted!'),
        'item deleted' => __('This folder has been deleted.'),
        'not found' => __('Folder not found'),
    ),
    'situation_relation' => 'parent',
    'tab' => array(
        'iconUrl' => 'static/apps/noviusos_media/img/media-16.png',
        'labels' => array(
            'insert' => __('Add a folder'),
        ),
    ),
    'layout' => array(
        array(
            'view' => 'noviusos_media::admin/folder',
        ),
    ),
    'views' => array(
        'delete' => 'noviusos_media::admin/folder_delete',
    ),
    'fields' => array(
        'medif_id' => array(
            'form' => array(
                'type' => 'hidden',
            ),
        ),
        'medif_parent_id' => array(
            'widget' => 'Nos\Media\Widget_Folder',
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
                'value' => 'Save',
                'class' => 'primary',
                'data-icon' => 'check',
            ),
        ),
    ),
);
