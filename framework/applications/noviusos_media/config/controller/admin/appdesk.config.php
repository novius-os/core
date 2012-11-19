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
    'model' => 'Nos\\Media\\Model_Media',
    'query' => array(
        'model' => 'Nos\Media\Model_Media',
        'related' => array(),
        'limit' => 10,
    ),
    'inspectors' => array(
        'folder',
        'extension',
        'preview' => array(
            'appdesk' => array(
                'vertical' => true,
                'reloadEvent' => 'Nos\\Media\\Model_Media',
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
            )
        )
    ),
    'views' => array(
        'default' => array(
            'name' => __('Default view'),
            'json' => array(
                'static/apps/noviusos_media/config/common.js',
                'static/apps/noviusos_media/config/media.js'
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
            'name' => __('Image'),
            'virtual' => true,
            'json' => array(
                'static/apps/noviusos_media/config/common.js',
                'static/apps/noviusos_media/config/media.js',
                'static/apps/noviusos_media/config/image_pick.js'
            ),
        ),
        'media_pick' => array(
            'name' => __('Media'),
            'virtual' => true,
            'json' => array(
                'static/apps/noviusos_media/config/common.js',
                'static/apps/noviusos_media/config/media.js',
                'static/apps/noviusos_media/config/media_pick.js'
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
        'extension' => array(
            'headerText' => __('Ext.'),
            'column' => 'media_ext',
            'width' => 60,
        ),
        'title' => array(
            'headerText' => __('Title'),
            'column' => 'media_title'
        ),
        'file_name' => array(
            'column' => 'media_file',
            'visible' => false
        ),
        'path' => array(
            'value' => function ($item) {
                return $item->get_public_path();
            },
            'visible' => false
        ),
        'path_folder' => array(
            'value' => function ($item) {
                return dirname($item->get_public_path());
            },
            'visible' => false
        ),
        'image' => array(
            'value' => function ($item) {
                return $item->is_image();
            },
            'visible' => false
        ),
        'thumbnail' => array(
            'value' => function ($item) {
                return $item->is_image() ? $item->get_public_path_resized(64, 64) : '';
            },
            'visible' => false
        ),
        'height' => array(
            'column' => 'media_height',
            'visible' => false
        ),
        'width' => array(
            'column' => 'media_width',
            'visible' => false
        ),
        'thumbnailAlternate' => array(
            'value' => function ($item) {
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
            'visible' => false
        ),
    ),
    'appdesk' => array(
        'reloadEvent' => array(
            'Nos\\Media\\Model_Media',
            array(
                'name' => 'Nos\\Media\\Model_Folder',
                'action' => 'delete',
            ),
        ),
    ),

);
