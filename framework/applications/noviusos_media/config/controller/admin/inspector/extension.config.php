<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

return array(
    'data' => array(
        array(
            'id' => 'image',
            'title' => 'Images',
            'icon' => 'image.png',
        ),
        array(
            'id' => 'document',
            'title' => 'Documents',
            'icon' => 'document-office.png',
        ),
        array(
            'id' => 'music',
            'title' => 'Music',
            'icon' => 'music-beam.png',
        ),
        array(
            'id' => 'video',
            'title' => 'Videos',
            'icon' => 'film.png',
        ),
        array(
            'id' => 'archive',
            'title' => 'Compressed archive',
            'icon' => 'folder-zipper.png',
        ),
        array(
            'id' => 'text',
            'title' => 'Textual content',
            'icon' => 'document-text.png',
        ),
        array(
            'id' => 'other',
            'title' => 'Other',
            'icon' => 'book-question.png',
        ),
    ),
    'input' => array(
        'key' => 'media_extension',
        'query' =>
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
        'vertical' => true,
        'label' => __('Type of file'),
        'url' => 'admin/noviusos_media/inspector/extension/list',
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
);
