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

class Model_Menu_Item extends Model
{
    protected static $_table_name = 'nos_menu_item';
    protected static $_primary_key = array('mitem_id');

    protected static $_title_property = 'mitem_title';
    protected static $_properties = array(
        'mitem_id' => array(
            'default' => null,
            'data_type' => 'int',
            'null' => false,
        ),
        'mitem_menu_id' => array(
            'default' => null,
            'data_type' => 'int',
            'null' => false,
        ),
        'mitem_parent_id' => array(
            'default' => null,
            'data_type' => 'int',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'mitem_driver' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'mitem_title' => array(
            'default' => '',
            'data_type' => 'varchar',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'mitem_dom_id' => array(
            'default' => '',
            'data_type' => 'varchar',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'mitem_css_class' => array(
            'default' => '',
            'data_type' => 'varchar',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'mitem_sort' => array(
            'default' => 0,
            'data_type' => 'int',
            'null' => false,
        ),
        'mitem_created_at' => array(
            'data_type' => 'timestamp',
            'null' => false,
        ),
        'mitem_updated_at' => array(
            'data_type' => 'timestamp',
            'null' => false,
        ),
    );

    protected static $_eav = array(
        'attributes' => array( // we use the statistics relation to store the EAV data
            'attribute' => 'miat_key', // the key column in the related table contains the attribute
            'value' => 'miat_value', // the value column in the related table contains the value
        )
    );

    protected static $_has_one = array();
    protected static $_many_many = array();
    protected static $_twinnable_has_one = array();
    protected static $_twinnable_has_many = array();
    protected static $_twinnable_belongs_to = array();
    protected static $_twinnable_many_many = array();

    protected static $_belongs_to = array(
        'parent' => array(
            'key_from' => 'mitem_parent_id',
            'model_to' => '\Nos\Menu\Model_Menu_Item',
            'key_to' => 'mitem_id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'menu' => array(
            'key_from' => 'mitem_menu_id',
            'model_to' => '\Nos\Menu\Model_Menu',
            'key_to' => 'menu_id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_has_many = array(
        'attributes' => array(
            'key_from' => 'mitem_id', // key in this model
            'model_to' => '\Nos\Menu\Model_Menu_Item_Attribute',
            'key_to' => 'miat_mitem_id', // key in the related model
            'cascade_save' => true, // update the related table on save
            'cascade_delete' => true, // delete the related data when deleting the parent
        ),
        'children' => array(
            'key_from' => 'mitem_id',
            'model_to' => '\Nos\Menu\Model_Menu_Item',
            'key_to' => 'mitem_parent_id',
            'conditions' => array(
               'order_by' => array(
                    'mitem_sort' => 'ASC'
                ),
            ),
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_observers = array(
        'Orm\\Observer_Self',
        'Orm\Observer_CreatedAt' => array(
            'events' => array('before_insert'),
            'mysql_timestamp' => true,
            'property' => 'mitem_created_at'
        ),
        'Orm\Observer_UpdatedAt' => array(
            'events' => array('before_save'),
            'mysql_timestamp' => true,
            'property' => 'mitem_updated_at'
        )
    );

    protected $menu_item_driver = null;

    /**
     * Returns the menu item driver
     *
     * @param bool $reload
     * @return Menu_Item_Driver
     */
    public function driver($reload = false)
    {
        if (is_null($this->menu_item_driver) || $reload) {
            $this->menu_item_driver = Menu_Item::forge($this);
        }
        return $this->menu_item_driver;
    }

    public function html(array $params = array())
    {
        return $this->driver()->html($params);
    }

    public function & get($property, array $conditions = array())
    {
        try {
            return parent::get($property, $conditions);
        } catch (\OutOfBoundsException $e) {
            if ($this->is_new()) {
                $attributes = \Arr::get($this->driver()->config(), 'attributes');
                if (in_array($property, $attributes) ||
                    (\Str::starts_with($property, 'mitem_') &&
                        in_array(str_replace('mitem_', '', $property), $attributes))) {
                    $result = null;
                    return $result;
                }
            }
            throw $e;
        }
    }
}
