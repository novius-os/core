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

class Model_Content_Nuggets extends \Nos\Orm\Model
{
    const DEFAULT_CATCHER = 'default';

    protected static $_table_name = 'nos_content_nuggets';
    protected static $_primary_key = array('content_id');

    protected static $_properties = array(
        'content_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
        'content_catcher' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => true,
            'convert_empty_to_null' => true,
            'character_maximum_length' => 25,
        ),
        'content_model_name' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => true,
            'character_maximum_length' => 100,
            'convert_empty_to_null' => true,
        ),
        'content_model_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'content_data' => array(
            'default' => null,
            'data_type' => 'serialize',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
    );

    protected static $_has_one = array();
    protected static $_belongs_to  = array();
    protected static $_has_many  = array();
    protected static $_many_many = array();
    protected static $_twinnable_has_one = array();
    protected static $_twinnable_has_many = array();
    protected static $_twinnable_belongs_to = array();
    protected static $_twinnable_many_many = array();

    protected static $_observers = array('\Orm\Observer_Typing');
}
