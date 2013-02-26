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
    'model' => 'Nos\Media\Model_Folder',
    'order_by' => 'medif_title',
    'input' => array(
        'key' => 'media_folder_id'
    ),
    'appdesk' => array(
        'label'     => __('Folder'),
        'treeGrid' => array(
            'movable'   => false,
            'sortable'  => false,
        ),
    ),
);
