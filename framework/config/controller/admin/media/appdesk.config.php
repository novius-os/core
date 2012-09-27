<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
use Nos\I18n;

I18n::load('media', 'nos_media');

return array(
    'query' => array(
        'model' => 'Nos\Model_Media',
        'related' => array(),
        'limit' => 10,
    ),
    'search_text' => array(
        'media_title',
        'media_ext',
        'media_file',
    ),
    'hideContexts' => true,
    'selectedView' => 'default',
    'views' => array(
        'default' => array(
            'name' => __('Default view'),
            'json' => array(
                'static/novius-os/admin/config/media/common.js',
                'static/novius-os/admin/config/media/media.js'
            ),
        ),
        'flick_through' => array(
            'name' => __('Flick through view'),
            'json' => array(
                'static/novius-os/admin/config/media/common.js',
                'static/novius-os/admin/config/media/flick_through.js'
            ),
        ),
        'image_pick' => array(
            'name' => __('Image'),
            'virtual' => true,
            'json' => array(
                'static/novius-os/admin/config/media/common.js',
                'static/novius-os/admin/config/media/media.js',
                'static/novius-os/admin/config/media/image_pick.js'
            ),
        ),
        'media_pick' => array(
            'name' => __('Media'),
            'virtual' => true,
            'json' => array(
                'static/novius-os/admin/config/media/common.js',
                'static/novius-os/admin/config/media/media.js',
                'static/novius-os/admin/config/media/media_pick.js'
            ),
        )
    ),
    'i18n' => array(
        'Pick' => __('Pick'),
        'addDropDown' => __('Select an action'),
        'columns' => __('Columns'),
        'showFiltersColumns' => __('Filters column header'),
        'visibility' => __('Visibility'),
        'settings' => __('Settings'),
        'vertical' => __('Vertical'),
        'horizontal' => __('Horizontal'),
        'hidden' => __('Hidden'),
        'item' => __('media'),
        'items' => __('medias'),
        'showNbItems' => __('Showing {{x}} medias out of {{y}}'),
        'showOneItem' => __('Show 1 media'),
        'showNoItem' => __('No media'),
        'showAll' => __('Show all medias'),
        'views' => __('Views'),
        'viewGrid' => __('Grid'),
        'viewThumbnails' => __('Thumbnails'),
        'preview' => __('Preview'),
        'loading' => __('Loading...'),
    ),
    'dataset' => array(
        'id' => 'media_id',
        'title' => 'media_title',
        'extension' => 'media_ext',
        'file_name' => 'media_file',
        'path' => function ($item) {
            return $item->get_public_path();
        },
        'path_folder' => function ($item) {
            return dirname($item->get_public_path());
        },
        'image' => function ($item) {
            return $item->is_image();
        },
        'thumbnail' => function ($item) {
            return $item->is_image() ? $item->get_public_path_resized(64, 64) : '';
        },
        'height' => 'media_height',
        'width' => 'media_width',
        'thumbnailAlternate' => function ($item) {
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
    'inputs' => array(
        'folder_id' =>
            function ($value, $query)
            {
                if ($value) {
                    $query->where(array('media_folder_id', '=', $value));
                }
                return $query;
            },
        'media_extension' =>
            function ($value, $query)
            {
                static $extensions = array(
                    'image' => 'gif,png,jpg,jpeg,bmp',
                    'document' => 'doc,xls,ppt,docx,xlsx,pptx,odt,odf,odp,pdf',
                    'music' => 'mp3,wav',
                    'video' => 'avi,mkv,mpg,mpeg,mov',
                    'archive' => 'zip,rar,tar,gz,7z',
                    'text' => 'txt,xml,htm,html',
                );
                $ext = array();
                $other = array();
                $value = (array) $value;
                foreach ($extensions as $extension => $extension_list) {
                    $extension_list = explode(',', $extension_list);
                    if (in_array($extension, $value)) {
                        $ext = array_merge($ext, $extension_list);
                    } else {
                        $other = array_merge($other, $extension_list);
                    }
                }
                $opened = false;
                if (!empty($ext)) {
                    $opened or $query->and_where_open();
                    $opened = true;
                    $query->or_where(array('media_ext', 'IN', $ext));
                }
                if (in_array('other', $value)) {
                    $opened or $query->and_where_open();
                    $opened = true;
                    $query->or_where(array('media_ext', 'NOT IN', $other));
                }
                $opened and $query->and_where_close();

                return $query;
            },
    ),
    'appdesk' => array(
        'actions' => array(
            'edit' => array(
                'name' => 'edit',
                'primary' => true,
                'icon' => 'pencil',
                'label' => __('Edit'),
                'action' => array(
                    'action' => 'nosTabs',
                    'tab' => array(
                        'url' => 'admin/nos/media/media/insert_update/{{id}}',
                        'label' => __('Edit a media'),
                    ),
                ),
            ),
            'delete' => array(
                'name' => 'delete',
                'primary' => true,
                'icon' => 'trash',
                'label' => __('Delete'),
                'action' => array(
                    'action' => 'confirmationDialog',
                    'dialog' => array(
                        'contentUrl' => 'admin/nos/media/media/delete/{{id}}',
                        'title' => __('Delete a media')
                    ),
                ),
            ),
            'visualise' => array(
                'name' => 'visualise',
                'iconClasses' => 'nos-icon16 nos-icon16-eye',
                'label' => __('Visualise'),
                'action' => array(
                    'action' => 'nosMediaVisualise',
                ),
            ),
        ),
        'tab' => array(
            'label' => __('Media center'),
            'iconUrl' => 'static/novius-os/admin/novius-os/img/32/media.png',
        ),
        'reloadEvent' => array(
            'Nos\\Model_Media',
            array(
                'name' => 'Nos\\Model_Media_Folder',
                'action' => 'delete',
            ),
        ),
        'appdesk' => array(
            'splittersVertical' => 300,
            'buttons' => array(
                'media' => array(
                    'label' => __('Add a media'),
                    'action' => array(
                        'action' => 'nosTabs',
                        'method' => 'add',
                        'tab' => array(
                            'url' => 'admin/nos/media/media/insert_update',
                            'label' => __('Add a media'),
                        ),
                    ),
                ),
                'folder' => array(
                    'label' => __('Add a folder'),
                    'action' => array(
                        'action' => 'nosTabs',
                        'method' => 'add',
                        'tab' => array(
                            'url' => 'admin/nos/media/folder/insert_update',
                            'label' => 'Add a folder',
                        ),
                        'dialog' => array(
                            'width' => 600,
                            'height' => 250,
                        ),
                    ),
                ),
            ),
            'grid' => array(
                'id' => 'nos_media_grid',
                'urlJson' => 'admin/nos/media/appdesk/json',
                'columns' => array(
                    'extension' => array(
                        'headerText' => __('Ext.'),
                        'dataKey' => 'extension',
                        'width' => 60,
                        'ensurePxWidth' => true,
                        'allowSizing' => false
                    ),
                    'title' => array(
                        'headerText' => __('Title'),
                        'dataKey' => 'title',
                        'sortDirection' => 'ascending'
                    ),
                    'actions' => array(
                        'actions' => array('edit', 'delete', 'visualise'),
                    ),
                ),
            ),
            'thumbnails' => array(
                'actions' => array('edit', 'delete', 'visualise'),
                'thumbnailSize' => 64,
            ),
            'defaultView' => 'thumbnails',
            'inspectorsOrder' => 'preview,folders,extensions',
            'inspectors' => array(
                'folders' => array(
                    'vertical' => true,
                    'label' => __('Folders'),
                    'url' => 'admin/nos/media/inspector/folder/list',
                    'inputName' => 'folder_id',
                    'reloadEvent' => 'Nos\\Model_Media_Folder',
                    'treeGrid' => array(
                        'treeUrl' => 'admin/nos/media/inspector/folder/json',
                        'sortable' => false,
                        'columns' => array(
                            'title' => array(
                                'headerText' => __('Folder'),
                                'dataKey' => 'title',
                            ),
                            'actions' => array(
                                'showOnlyArrow' => true,
                                'actions' => array(
                                    array(
                                        'name' => 'add_media',
                                        'label' => __('Add a media in this folder'),
                                        'icon' => 'plus',
                                        'action' => array(
                                            'action' => 'nosTabs',
                                            'tab' => array(
                                                'url' => 'admin/nos/media/media/insert_update?context_id={{id}}',
                                                'label' => 'Add a media in the "{{title}}" folder'
                                            ),
                                        ),
                                    ),
                                    array(
                                        'name' => 'add_folder',
                                        'label' => __('Add a sub-folder to this folder'),
                                        'icon' => 'folder-open',
                                        'action' => array(
                                            'action' => 'nosTabs',
                                            'tab' => array(
                                                'url' => 'admin/nos/media/folder/insert_update?context_id={{id}}',
                                                'label' => 'Add a sub-folder in "{{title}}"',
                                            ),
                                            'dialog' => array(
                                                'width' => 600,
                                                'height' => 250
                                            ),
                                        ),
                                    ),
                                    array(
                                        'name' => 'edit',
                                        'label' => __('Edit this folder'),
                                        'icon' => 'pencil',
                                        'action' => array(
                                            'action' => 'nosTabs',
                                            'tab' => array(
                                                'url' => 'admin/nos/media/folder/insert_update/{{id}}',
                                                'label' => 'Edit the "{{title}}" folder',
                                            ),
                                            'dialog' => array(
                                                'width' => 600,
                                                'height' => 250,
                                            ),
                                        ),
                                    ),
                                    array(
                                        'name' => 'delete',
                                        'label' => __('Delete this folder'),
                                        'icon' => 'trash',
                                        'action' => array(
                                            'action' => 'confirmationDialog',
                                            'dialog' => array(
                                                'contentUrl' => 'admin/nos/media/folder/delete/{{id}}',
                                                'title' => __('Delete a folder')
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
                'extensions' => array(
                    'vertical' => true,
                    'label' => __('Type of file'),
                    'url' => 'admin/nos/media/inspector/extension/list',
                    'inputName' => 'media_extension[]',
                    'grid' => array(
                        'columns' => array(
                            'title' => array(
                                'headerText' => __('Type of file'),
                                'dataKey' => 'title',
                            ),
                            'hide' => array(
                                'visible' => false,
                            ),
                            'hide2' => array(
                                'visible' => false,
                            ),
                        ),
                    ),
                ),
                'preview' => array(
                    'vertical' => true,
                    'reloadEvent' => 'Nos\\Model_Media',
                    'label' => __('Preview'),
                    'preview' => true,
                    'options' => array(
                        'meta' => array(
                            'fileName' => array(
                                'label' => __('File name:'),
                            ),
                            'pathFolder' => array(
                                'label' => __('Path:')
                            ),
                        ),
                        'actions' => array('edit', 'delete', 'visualise'),
                        'actionThumbnail' => 'visualise',
                    ),
                ),
            ),
        ),
    ),
);
