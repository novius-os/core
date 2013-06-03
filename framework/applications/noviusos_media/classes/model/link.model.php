<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Media;

class Model_Link extends \Nos\Orm\Model
{
    protected static $_table_name = 'nos_media_link';
    protected static $_primary_key = array('medil_id');

    protected static $_properties = array(
        'medil_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
        'medil_from_table' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'medil_foreign_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => true,
        ),
        'medil_foreign_context_common_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => true,
        ),
        'medil_key' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'medil_media_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
    );

    protected static $_has_one = array();
    protected static $_many_many = array();

    protected static $_has_many = array();
    protected static $_belongs_to = array(
        'media' => array(
            'key_from' => 'medil_media_id',
            'model_to' => 'Nos\Media\Model_Media',
            'key_to' => 'media_id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );
}
