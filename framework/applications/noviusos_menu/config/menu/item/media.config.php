<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('noviusos_menu::common', 'nos::common'));

return array(
    'name' => __('Link to a media'),
    'texts' => array(
        'add' => __('Add a link to a media'),
        'new' => __('New link to a media'),
    ),
    'icon' => 'static/apps/noviusos_menu/img/16/media.png',

    // Allowed EAV attributes
    'attributes' => array(
        'media_id',
    ),

    'view' => 'noviusos_menu::driver/media',

    'admin' => array(
        'layout' => array(
            'standard' => array(
                'view'   => 'nos::form/accordion',
                'params' => array(
                    'accordions' => array(
                        'main' => array(
                            'fields' => array(
                                'mitem_media_id',
                            ),
                        ),
                    ),
                ),
            ),
            array(
                'view'   => 'noviusos_menu::admin/driver/page',
            ),
        ),
        'fields' => array(
            'mitem_media_id' => array(
                'label' => __('Media file:'),
                'form' => array(
                    'type' => 'hidden',
                    'class' => 'menu_item_media_id',
                ),
                'renderer' => 'Nos\Renderer_Item_Picker',
                'renderer_options' => array(
                    'model' => 'Nos\Media\Model_Media',
                    'appdesk' => 'admin/noviusos_media/appdesk',
                    'defaultThumbnail' => 'static/apps/noviusos_media/img/media-64.png',
                    'texts' => array(
                        'empty' => __('No media file selected'),
                        'add' => __('Pick a media file'),
                        'edit' => __('Pick another media file'),
                        'delete' => __('Un-select this media file'),
                    ),
                ),
            ),
        ),
    ),
);
