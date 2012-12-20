<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('noviusos_media::common', 'nos::application', 'nos::common'));

return array(
    'data_mapping' => array(
        'title' => array(
            'column' => 'medif_title',
            'title' => __('Title'),
        ),
        'path' => array(
            'value' => function($obj) {
                return $obj->medif_path;
            },
        ),
    ),
    'i18n' => array(
        // Crud
        'successfully added' => __('Done, the folder has been added.'),
        'successfully saved' => __('OK, all changes are saved.'),
        'successfully deleted' => __('The folder has been deleted.'),

        // General errors
        'item deleted' => __('This folder doesn’t exist any more. It has been deleted.'),
        'not found' => __('We cannot find this folder.'),

        // Deletion popup
        'delete an item' => __('Deleting the folder ‘{{title}}’'),
    ),
    'actions' => array(
        'Nos\Media\Model_Folder.add' => array(
            'label' => __('Add a folder'),
        ),
        'Nos\Media\Model_Folder.edit' => array(
            'disabled' => function($item) {
                return empty($item->medif_parent_id);
            },
        ),
        'Nos\Media\Model_Folder.delete' => array(
            'disabled' => function($item) {
                return empty($item->medif_parent_id);
            },
        ),
        'Nos\Media\Model_Folder.add_media' => array(
            'label' => __('Add a media in this folder'),
            'icon' => 'plus',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => 'admin/noviusos_media/media/insert_update?environment_id={{id}}',
                    'label' => __('Add a media in the "{{title}}" folder'),
                ),
            ),
            'targets' => array(
                'grid' => true,
            ),
        ),
        'Nos\Media\Model_Folder.add_subfolder' => array(
            'label' => __('Add a sub-folder to this folder'),
            'icon' => 'folder-open',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => '{{controller_base_url}}insert_update?environment_id={{id}}',
                    'label' => __('Add a sub-folder in "{{title}}"'),
                ),
                'dialog' => array(
                    'width' => 800,
                    'height' => 400
                ),
            ),
            'targets' => array(
                'grid' => true,
            ),
        ),
    ),
);