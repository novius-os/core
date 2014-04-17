<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Menu;

use Nos\Orm\Model;

class Model_Menu extends Model
{
    protected static $_primary_key = array('menu_id');
    protected static $_table_name = 'nos_menu';

    protected static $_title_property = 'menu_title';
    protected static $_properties = array(
        'menu_id' => array(
            'default' => null,
            'data_type' => 'int',
            'null' => false,
        ),
        'menu_context' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'menu_context_common_id' => array(
            'default' => null,
            'data_type' => 'int',
            'null' => false,
        ),
        'menu_context_is_main' => array(
            'default' => 0,
            'data_type' => 'int',
            'null' => false,
        ),
        'menu_title' => array(
            'default' => '',
            'data_type' => 'varchar',
            'null' => false,
        ),
        'menu_created_at' => array(
            'data_type' => 'timestamp',
            'null' => false,
        ),
        'menu_updated_at' => array(
            'data_type' => 'timestamp',
            'null' => false,
        ),
    );

    protected static $_belongs_to = array();
    protected static $_has_one = array();
    protected static $_many_many = array();
    protected static $_twinnable_has_one = array();
    protected static $_twinnable_has_many = array();
    protected static $_twinnable_belongs_to = array();
    protected static $_twinnable_many_many = array();

    protected static $_has_many = array(
        'items' => array(
            'key_from' => 'menu_id',
            'model_to' => '\Nos\Menu\Model_Menu_Item',
            'key_to' => 'mitem_menu_id',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'root_items' => array(
            'key_from' => 'menu_id',
            'model_to' => '\Nos\Menu\Model_Menu_Item',
            'key_to' => 'mitem_menu_id',
            'conditions' => array(
                'where' => array(array('mitem_parent_id', 'IS', null)),
                'order_by' => array(array('mitem_sort' => 'ASC')),
            ),
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_observers = array(
        'Orm\Observer_CreatedAt' => array(
            'events' => array('before_insert'),
            'mysql_timestamp' => true,
            'property' => 'menu_created_at'
        ),
        'Orm\Observer_UpdatedAt' => array(
            'events' => array('before_save'),
            'mysql_timestamp' => true,
            'property' => 'menu_updated_at'
        )
    );

    protected static $_behaviours = array(
        'Nos\Orm_Behaviour_Twinnable' => array(
            'context_property' => 'menu_context',
            'common_id_property' => 'menu_context_common_id',
            'is_main_property' => 'menu_context_is_main',
            'common_fields' => array(),
        ),
    );
}
