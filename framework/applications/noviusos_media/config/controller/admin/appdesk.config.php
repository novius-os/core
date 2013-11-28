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
    'model' => 'Nos\\Media\\Model_Media',
    'query' => array(
        'limit' => 10,
        'callback' => array(
            'permissions' => function ($query) {
                $restricted_folders = \Nos\Media\Permission::getRestrictedFolders();
                if (empty($restricted_folders)) {
                    return $query;
                }

                $query->related('folder');
                $query->where_open();
                $query->or_where(array('folder.medif_path', '=', '/'));
                foreach ($restricted_folders as $restricted_folder) {
                    $query->or_where(array('folder.medif_path', 'LIKE', $restricted_folder->medif_path.'%'));
                }
                $query->where_close();
                return $query;
            },
        ),
        'order_by' => array('media_id' => 'DESC'),
    ),
    'search_text' => 'media_title',
    'inspectors' => array(
        'folder',
        'extension',
        'preview' => array(
            'appdesk' => array(
                'vertical' => true,
                'reloadEvent' => 'Nos\Media\Model_Media',
                'preview' => true,
                'options' => array(
                    'meta' => array(
                        'fileName' => array(
                            'label' => __('File name:'),
                        ),
                        'filesize' => array(
                            'label' => __('File size:'),
                        ),
                        'dimensions' => array(
                            'label' => __('Dimensions:'),
                        ),
                    ),
                    'actions' => array('Nos\Media\Model_Media.edit', 'Nos\Media\Model_Media.delete', 'Nos\Media\Model_Media.visualise'),
                    'actionThumbnail' => 'Nos\Media\Model_Media.visualise',
                    'texts' => array(
                        // Note to translator: 'Preview' here is a label, not an action
                        'headerDefault' => __('Preview'),
                        'selectItem' => __('Click on a media file to preview it.'),
                    ),
                ),
            )
        )
    ),
    'views' => array(
        'default' => array(
            'name' => __('Default view'),
            'json' => array(
                'static/apps/noviusos_media/config/common.js',
            ),
        ),
        'flick_through' => array(
            'name' => __('Flick through view'),
            'json' => array(
                'static/apps/noviusos_media/config/common.js',
                'static/apps/noviusos_media/config/flick_through.js'
            ),
        ),
        'image_pick' => array(
            'virtual' => true,
            'json' => array(
                'static/apps/noviusos_media/config/common.js',
                'static/apps/noviusos_media/config/image_pick.js'
            ),
        ),
        'media_pick' => array(
            'virtual' => true,
            'json' => array(
                'static/apps/noviusos_media/config/common.js',
                'static/apps/noviusos_media/config/media_pick.js'
            ),
        )
    ),
    'i18n' => array(
        'item' => __('media file'),
        'items' => __('media files'),
        'showNbItems' => __('Showing {{x}} media files out of {{y}}'),
        'showOneItem' => __('Showing 1 media file'),
        'showNoItem' => __('No media files'),
        // Note to translator: This is the action that clears the 'Search' field
        'showAll' => __('Show all media files'),

        'Pick' => __('Pick'),
    ),
    'thumbnails' => true,
    'appdesk' => array(
        'reloadEvent' => array(
            'Nos\\Media\\Model_Media',
            array(
                'name' => 'Nos\\Media\\Model_Folder',
                'action' => 'delete',
            ),
        ),
        'appdesk' => array(
            'defaultView' => 'thumbnails',
        ),
    ),
    'toolbar' => array(
        'actions' => array(
            'mass_upload' => array(
                'label' => __('Add many files at once'),
                'action' => array(
                    'action' => 'nosTabs',
                    'method' => 'add',
                    'tab' => array(
                        'url' => 'admin/noviusos_media/upload',
                    ),
                ),
                'targets' => array(
                    'toolbar-grid' => true,
                ),
            ),
            'renew_cache' => array(
                'label' => __('Renew media cache'),
                'action' => array(
                    'action' => 'nosAjax',
                    'params' => array(
                        'url' => 'admin/noviusos_media/appdesk/clear_cache',
                    ),
                ),
                'targets' => array(
                    'toolbar-grid' => true,
                ),
                'visible' => array(
                    'check_expert' => function () {
                        return \Session::user()->user_expert;
                    }
                ),
            ),
        ),
    ),
);
