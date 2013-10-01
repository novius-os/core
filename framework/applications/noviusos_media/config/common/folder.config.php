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
            'title' => __('Folder'),
        ),
        'path' => array(
            'value' => function ($obj) {
                return $obj->medif_path;
            },
        ),
    ),
    'i18n' => array(
        // Crud
        'notification item added' => __('Right, your new folder is ready.'),
        'notification item deleted' => __('The folder has been deleted.'),

        // General errors
        'notification item does not exist anymore' => __('This folder doesn’t exist any more. It has been deleted.'),
        'notification item not found' => __('We cannot find this folder.'),

        // Deletion popup
        'deleting item title' => __('Deleting the folder ‘{{title}}’'),

        # Delete action's labels
        'deleting button 1 item' => __('Yes, delete this folder'),
    ),
    'actions' => array(
        'add' => array(
            'label' => __('Add a folder'),
            'visible' => array(
                'check_permission' => array('Nos\Media\Permission', 'checkFolderVisible'),
            ),
            'disabled' => array(
                'check_permission' => array('Nos\Media\Permission', 'checkFolderDisabled'),
            ),
        ),
        'edit' => array(
            'disabled' => array(
                'check_root' => function ($item) {
                    return empty($item->medif_parent_id) ? __('You can’t edit the root folder.') : false;
                },
                'check_permission' => array('Nos\Media\Permission', 'checkFolderDisabled'),
                'check_folder_restriction' => array('Nos\Media\Permission', 'isFolderRestricted'),
            ),
        ),
        'delete' => array(
            'disabled' => array(
                'check_root' => function ($item) {
                    return empty($item->medif_parent_id) ? __('You can’t delete the root folder.') : false;
                },
                'check_permission' => array('Nos\Media\Permission', 'checkFolderDisabled'),
                'check_folder_restriction' => array('Nos\Media\Permission', 'isFolderRestricted'),
            ),
        ),
        'add_media' => array(
            'label' => __('Add a media file in this folder'),
            'icon' => 'plus',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => 'admin/noviusos_media/media/insert_update?environment_id={{id}}',
                ),
            ),
            'targets' => array(
                'grid' => true,
            ),
            'disabled' => array(
                'check_permission' => array(
                    array('Nos\Media\Permission', 'checkFolderDisabled'),
                    array('Nos\Media\Permission', 'checkPermissionDraft'),
                ),
            ),
        ),
        'add_subfolder' => array(
            'label' => __('Add a sub-folder to this folder'),
            'icon' => 'folder-open',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => '{{controller_base_url}}insert_update?environment_id={{id}}',
                ),
                'dialog' => array(
                    'width' => 800,
                    'height' => 400
                ),
            ),
            'targets' => array(
                'grid' => true,
            ),
            'disabled' => array(
                'check_permission' => array('Nos\Media\Permission', 'checkFolderDisabled'),
            ),
        ),
    ),
);
