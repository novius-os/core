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

class Model_Content_Nuggets extends \Nos\Orm\Model {
    const DEFAULT_CATCHER = 'default';

    protected static $_table_name = 'nos_content_nuggets';
    protected static $_primary_key = array('content_id');

    protected static $_properties = array(
        'content_id' => array(
            'data_type' => 'int',
            'null' => false,
        ),
        'content_catcher' => array(
            'data_type' => 'varchar',
            'null' => false,
            'character_maximum_length' => 25,
        ),
        'content_model_name' => array(
            'data_type' => 'varchar',
            'null' => false,
            'character_maximum_length' => 100,
        ),
        'content_model_id' => array(
            'data_type' => 'int',
            'null' => false,
        ),
        'content_data' => array(
            'data_type' => 'serialize',
            'null' => false,
        ),
    );

    protected static $_observers = array('\Orm\Observer_Typing');
}
