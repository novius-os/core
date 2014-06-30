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

$icons = \Config::load('noviusos_media::icons', true);
$extensions = array();
foreach ($icons['icons'] as $size => $images) {
    foreach ($images as $image => $ext_list) {
        foreach (explode(',', $ext_list) as $ext) {
            $extensions[$size][$ext] = $image;
        }
    }
}
$media_icon = function ($size) use ($extensions) {
    return function ($item) use ($size, $extensions) {
        return isset($extensions[$size][$item->media_ext]) ? 'static/apps/noviusos_media/icons/'.$size.'/'.$extensions[$size][$item->media_ext] : '';
    };
};

return array(
    'i18n' => array(
        // Crud
        'notification item added' => __('Spot on! One more media file in your Centre.'),
        'notification item deleted' => __('The media file has been deleted.'),

        // General errors
        'notification item does not exist anymore' => __('This media file doesn’t exist any more. It has been deleted.'),
        'notification item not found' => __('We cannot find this media file.'),

        // Deletion popup
        'deleting item title' => __('Deleting the media ‘{{title}}’'),

        # Delete action's labels
        'deleting button N items' => n__(
            'Yes, delete this media file',
            'Yes, delete these {{count}} media files'
        ),
    ),
    'data_mapping' => array(
        'title' => array(
            'column' => 'media_title',
            'title' => __('Title'),
            '' => '',
            'cellFormatters' => array(
                'icon' => array(
                    'type' => 'icon',
                    'column' => 'icon',
                    'size' => 16,
                ),
            ),
        ),
        'ext' => array(
            'column' => 'media_ext',
            'title' => __('Extension'),
            'cellFormatters' => array(
                'center' => array(
                    'type' => 'css',
                    'css' => array('text-align' => 'center'),
                ),
            ),
            'width' => 100,
            'ensurePxWidth' => true,
            'allowSizing' => false,
        ),
        'file' => array(
            'column' => 'media_file',
         ),
        'path' => array(
            'value' => function ($item) {
                return $item->url();
            },
        ),
        'path_folder' => array(
            'value' => function ($item) {
                return dirname($item->url(false));
            },
        ),
        'media_path' => array(
            'title' => __('Path'),
            'column' => 'media_path',
        ),
        'image' => array(
            'value' => function ($item) {
                return $item->isImage();
            },
        ),
        'thumbnail' => array(
            'value' => function ($item) {
                return $item->isImage() ? $item->urlResized(64, 64) : '';
            },
        ),
        'height' => array(
            'column' => 'media_height',
        ),
        'width' => array(
            'column' => 'media_width',
        ),
        'filesize' => array(
            'value' => function ($item) {
                return empty($item->media_filesize) ? false : \Num::format_bytes($item->media_filesize, 1);
            },
        ),
        'dimensions' => array(
            'value' => function ($item) {
                return empty($item->media_width) ? false : $item->media_width.' × '.$item->media_height;
            },
        ),
        'thumbnailAlternate' => array(
            'value' => $media_icon(64),
        ),
        'icon' => array(
            'value' => $media_icon(16),
        ),
    ),
    'actions' => array(
        'add' => array(
            'label' => __('Add a media file'),
            'visible' => array(
                'check_permission' => array('Nos\Media\Permission', 'checkMediaVisible'),
            ),
            'disabled' => array(
                'check_draft' => array('Nos\Media\Permission', 'checkPermissionDraft'),
            ),
        ),
        'edit' => array(
            'disabled' => array(
                'check_draft' => array('Nos\Media\Permission', 'checkPermissionDraft'),
                'check_folder_restriction' => array('Nos\Media\Permission', 'isMediaInRestrictedFolder'),
            ),
        ),
        'visualise' => array(
            'iconClasses' => 'nos-icon16 nos-icon16-eye',
            'label' => __('Visualise'),
            'action' => array(
                'action' => 'nosMediaVisualise',
            ),
            'targets' => array(
                'grid' => true,
                'toolbar-edit' => true,
            ),
            'visible' => array(function ($params) {
                return !isset($params['item']) || !$params['item']->is_new();
            }),
            'disabled' => false,
        ),
        'delete' => array(
            'disabled' => array(
                'check_draft' => array('Nos\Media\Permission', 'checkPermissionDraft'),
                'check_folder_restriction' => array('Nos\Media\Permission', 'isMediaInRestrictedFolder'),
            ),
        ),
    ),
);
