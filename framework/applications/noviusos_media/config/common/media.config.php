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

$media_icon = function ($size) {
    return function ($item) use($size) {
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
        return isset($extensions[$item->media_ext]) ? 'static/novius-os/admin/novius-os/img/'.$size.'/'.$extensions[$item->media_ext] : '';
    };
};

return array(
    'i18n' => array(
        // Crud
        'notification item added' => __('Done! The media has been added.'),
        'notification item deleted' => __('The media has been deleted.'),

        // General errors
        'notification item does not exist anymore' => __('This media doesn’t exist any more. It has been deleted.'),
        'notification item not found' => __('We cannot find this media.'),

        // Deletion popup
        'deleting item title' => __('Deleting the media ‘{{title}}’'),
        'deleting confirmation' => __('Last chance, there’s no undo. Do you really want to delete this media?'),
    ),
    'data_mapping' => array(
        'ext' => 'media_ext',
        'title' => array(
            'column' => 'media_title',
            'title' => __('Title'),
            'cellFormatters' => array(
                'icon' => array(
                    'type' => 'icon',
                    'column' => 'icon',
                    'size' => 16,
                ),
            ),
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
            'value' => $media_icon(64),
        ),
        'icon' => array(
            'value' => $media_icon(16),
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