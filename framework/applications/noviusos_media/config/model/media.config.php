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
    'behaviours'  => array(
        'Nos\Orm_Behaviour_Virtualpath' => array(
            'virtual_name_property' => 'media_file',
            'virtual_path_property' => 'media_path',
            'parent_relation' => 'folder',
            'extension_property' => array(
                'property' => 'media_ext',
                'before' => '.',
            ),
        ),
    ),
);
