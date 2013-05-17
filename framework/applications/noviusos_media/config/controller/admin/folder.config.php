<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('noviusos_media::common', 'nos::common'));

return array(
    'controller_url'  => 'admin/noviusos_media/folder',
    'model' => 'Nos\\Media\\Model_Folder',
    'environment_relation' => 'parent',
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
            'renderer' => 'Nos\Media\Renderer_Folder',
            'form' => array(
                'type'  => 'hidden',
            ),
            'label' => __('Select a folder where to put your sub-folder:'),
        ),
        'medif_title' => array(
            'form' => array(
                'type' => 'text',
                // Note to translator: This is a placeholder, i.e. a field’s label shown within the field
                'placeholder' => __('Title'),
            ),
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
                // Note to translator: This is a submit button
                'value' => __('Save'),
                'class' => 'ui-priority-primary',
                'data-icon' => 'check',
            ),
        ),
    ),
);
