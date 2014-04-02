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

class Model_Menu extends \Nos\Orm\Model
{
    protected static $_primary_key = array('menu_id');
    protected static $_table_name = 'nos_menu';

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

    protected static $_title_property = 'menu_title';

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

    protected static $_belongs_to = array();

    protected static $_has_many = array(
        'items' => array(
            'key_from' => 'menu_id',
            'model_to' => '\Nos\Menu\Model_Menu_Item',
            'key_to' => 'mitem_menu_id',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
    );

    protected static $_many_many = array();

    /**
     * Returns items by parent item id
     *
     * @param null $parent_id
     * @return array
     */
    public function items($parent_id = null)
    {
        // Gets the items with $parent_id as parent's item id
        return array_filter($this->buildItemsChildren(), function ($item) use ($parent_id) {
            return $item->mitem_parent_id == $parent_id;
        });
    }

    /**
     * Builds items children recursively (without any sql query)
     *
     * @param null $parent_id
     * @return array|null
     */
    public function buildItemsChildren($parent_id = null)
    {
        // Gets the items with $parent_id as parent's item id
        $items = array_filter($this->items, function ($item) use ($parent_id) {
            return $item->mitem_parent_id == $parent_id;
        });
        // Sort items
        uasort($items, function ($a, $b) {
            return strcmp($a->mitem_sort, $b->mitem_sort);
        });
        // Builds children recursively
        foreach ($items as $item) {
            if (is_null($item->children)) {
                $item->children = $this->buildItemsChildren($item->mitem_id);
            }
        }
        return $items;
    }
}
