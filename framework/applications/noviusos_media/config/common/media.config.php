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
        'successfully added' => __('Media successfully added.'),
        'successfully saved' => __('Media successfully saved.'),
        'successfully deleted' => __('The media has successfully been deleted!'),

        // General errors
        'item deleted' => __('This media has been deleted.'),
        'not found' => __('Media not found'),

        // Deletion popup
        'delete an item' => __('Delete a media'),
    ),
    'data_mapping' => array(
        'ext' => array(
            'title' => __('Ext.'),
            'column' => 'media_ext',
            'width' => 60,
            'ensurePxWidth' => true,
            'allowSizing' => false,
        ),
        'title' => array(
            'column' => 'media_title',
            'title' => __('Title'),
        ),
        'file' => array(
            'column' => 'media_file',
         ),
        'path' => array(
            'value' => function ($item) {
                return $item->get_public_path();
            },
        ),
        'path_folder' => array(
            'value' => function ($item) {
                return dirname($item->get_public_path());
            },
        ),
        'image' => array(
            'value' => function ($item) {
                return $item->is_image();
            },
        ),
        'thumbnail' => array(
            'value' => function ($item) {
                return $item->is_image() ? $item->get_public_path_resized(64, 64) : '';
            },
        ),
        'height' => array(
            'column' => 'media_height',
        ),
        'width' => array(
            'column' => 'media_width',
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
        ),
    ),
    'actions' => array(
        'Nos\Media\Model_Media.add' => array(
            'label' => __('Add a media'),
        ),
        'Nos\Media\Model_Media.visualise' => array(
            'iconClasses' => 'nos-icon16 nos-icon16-eye',
            'label' => __('Visualise'),
            'action' => array(
                'action' => 'nosMediaVisualise',
            ),
            'targets' => array(
                'grid' => true,
                'toolbar-edit' => true,
            ),
            'visible' => function($params) {
                return !isset($params['item']) || !$params['item']->is_new();
            },
            'disabled' => function() {
                return false;
            },
        ),
    ),
);