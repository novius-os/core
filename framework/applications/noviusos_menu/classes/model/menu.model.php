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
use Nos\Page\Model_Page;

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

    /**
     * @param array $params
     * @return \View
     */
    public function html(array $params = array())
    {
        $view = \Arr::get($params, 'view', 'noviusos_menu::menu');
        \Arr::delete($params, 'view');
        \Arr::set($params, 'menu', $this);

        return \View::forge($view, $params, false);
    }

    /**
     * @param mixed $parent
     * @return array
     */
    public function branch($parent = null)
    {
        if ($parent instanceof Model_Menu_Item) {
            $parent = $parent->mitem_id;
        }
        $tree = array();
        foreach ($this->items as $item) {
            if ($item->mitem_parent_id == $parent) {
                $tree[$item->mitem_sort] = $item;
            }
        }
        ksort($tree);
        return $tree;
    }

    /**
     * @param $context
     * @param null $page_id
     * @param $depth
     * @return Model_Menu
     */
    public static function buildFromPages($context, $page_id = null, $depth = -1)
    {
        if ($page_id instanceof Model_Page) {
            $page_id = $page_id->page_id;
        }
        $menu = static::forge();
        $menu->items = static::addPagesItems($context, $page_id, $depth);
        return $menu;
    }

    /**
     * @param $context
     * @param $idParent
     * @param $depth
     * @return Model_Menu[]
     */
    private static function addPagesItems($context, $idParent, $depth)
    {
        $pages = Model_Page::find('all', array(
            'where'             => array(
                'page_parent_id' => $idParent,
                'published'      => 1,
                'page_menu'      => 1,
                'page_context'   => $context,
            ),
            'order_by'          => array('page_sort' => 'asc')
        ));
        $items = array();
        $i = 0;
        foreach ($pages as $p) {
            $item = Model_Menu_Item::forge();
            $item->mitem_driver = \Input::get('driver', 'Nos\Menu\Menu_Item_Page');
            $item->mitem_id = $p->page_id;
            $item->mitem_page_id = $p->page_id;
            $item->mitem_sort = $i++;
            $items[] = $item;
            if ($depth != 0) {
                $items = $items + static::addPagesItems($context, $p->page_id, $depth - 1);
            }
        }
        return $items;
    }
}
