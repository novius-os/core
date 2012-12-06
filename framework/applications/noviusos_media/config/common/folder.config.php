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
    'i18n' => array(
        // Crud
        'successfully added' => __('Folder successfully added.'),
        'successfully saved' => __('Folder successfully saved.'),
        'successfully deleted' => __('The folder has successfully been deleted!'),

        // General errors
        'item deleted' => __('This folder has been deleted.'),
        'not found' => __('Folder not found'),

        // Deletion popup
        'delete an item' => __('Delete a folder'),
    ),
    'actions' => array(
        'Nos\Media\Model_Folder.edit' => array(
            'disabled' => function($item) {
                return !!empty($item->medif_parent_id);
            },
        ),
        'Nos\Media\Model_Folder.delete' => array(
            'disabled' => function($item) {
                return !!empty($item->medif_parent_id);
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
                    'url' => 'admin/noviusos_media/folder/insert_update?environment_id={{id}}',
                    'label' => __('Add a sub-folder in "{{title}}"'),
                ),
                'dialog' => array(
                    'width' => 600,
                    'height' => 250
                ),
            ),
            'targets' => array(
                'grid' => true,
                'toolbar-list' => true,
            ),
        ),
    ),
);