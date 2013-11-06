<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */


Nos\I18n::current_dictionary(array('noviusos_media::common'));

return array(
    'data' => array(
        array(
            'id' => 'image',
            'title' => __('Images'),
            'icon' => 'image.png',
        ),
        array(
            'id' => 'document',
            'title' => __('Documents'),
            'icon' => 'document.png',
        ),
        array(
            'id' => 'music',
            'title' => __('Music'),
            'icon' => 'music.png',
        ),
        array(
            'id' => 'video',
            'title' => __('Videos'),
            'icon' => 'video.png',
        ),
        array(
            'id' => 'archive',
            'title' => __('Archives (e.g. ZIP)'),
            'icon' => 'archive.png',
        ),
        array(
            'id' => 'text',
            'title' => __('Text files'),
            'icon' => 'text.png',
        ),
        array(
            'id' => 'other',
            'title' => __('Others'),
            'icon' => 'misc.png',
        ),
    ),
    'input' => array(
        'key' => 'media_extension',
        'query' =>
            function ($value, $query) {
                \Config::load('noviusos_media::icons', true);
                $extensions = \Config::get('noviusos_media::icons.extensions', array());
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
        'vertical' => true,
        'label' => __('Types'),
        'inputName' => 'media_extension[]',
        'grid' => array(
            'columns' => array(
                'title' => array(
                    'headerText' => __('Types'),
                    'dataKey' => 'title',
                ),
                'id' => array(
                    'visible' => false,
                ),
                'icon' => array(
                    'visible' => false,
                ),
            ),
        ),
    ),
);
