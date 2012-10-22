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
    'model' => 'Nos\Model_Media_Folder',
    'dataset' => array(
        'title' => array(
            'column' => 'medif_title',
            'headerText' => __('Title'),
        ),
    ),
    'input' => array(
        'key' => 'media_folder.id'
    ),
    /*
    'models' => array(
        array(
            'model' => 'Nos\Model_Media_Folder',
            'order_by' => 'medif_title',
            'childs' => array('Nos\Model_Media_Folder'),
            'dataset' => array(
                'id' => 'medif_id',
                'title' => 'medif_title',
                'path' => function($obj) {
                    return $obj->medif_path;
                },
                'actions' => array(
                    'edit' => function($item) {
                        return $item->medif_parent_id != null;
                    },
                    'delete' => function($item) {
                        return $item->medif_parent_id != null;
                    },
                ),
            ),
        ),
    ),
    'roots' => array(
        array(
            'model' => 'Nos\Model_Media_Folder',
            'where' => array(array('medif_parent_id', 'IS', \DB::expr('NULL'))),
            'order_by' => 'medif_title',
        ),
    ),
    */
);
