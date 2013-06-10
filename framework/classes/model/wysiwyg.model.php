<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos;

class Model_Wysiwyg extends \Nos\Orm\Model
{
    protected static $_table_name = 'nos_wysiwyg';
    protected static $_primary_key = array('wysiwyg_id');

    protected static $_properties = array(
        'wysiwyg_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
        'wysiwyg_text' => array(
            'default' => null,
            'data_type' => 'text',
            'null' => false,
        ),
        'wysiwyg_join_table' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'wysiwyg_key' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'wysiwyg_foreign_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => true,
        ),
        'wysiwyg_foreign_context_common_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => true,
        ),
    );
}
