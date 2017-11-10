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

use Nos\Controller_Admin_Crud;
use Nos\User\Permission;
use Nos\Nos;

class Controller_Admin_Menu_Crud extends Controller_Admin_Crud
{

    protected $menu_items = array();

    public function before()
    {
        parent::before();
        \Nos\I18n::current_dictionary('noviusos_menu::common', 'nos::common');
    }

    public function before_save($menu, $data)
    {
        $items_data = \Input::post('item', array());

        $menu->items = array();

        foreach ($items_data as $mitem_id => $item_data) {
            if (\Str::sub($mitem_id, 0, 1) === 't') {
                $item = Model_Menu_Item::forge();
                $item->mitem_driver = \Arr::get($item_data, 'mitem_driver', 'Nos\Menu\Menu_Item_Link');
            } else {
                $item = Model_Menu_Item::find($mitem_id);
            }
            $this->menu_items[$mitem_id] = $item;
            $config = $item->driver()->config();
            $fields = \Arr::get($config, 'admin.fields', array());

            $fieldset = \Fieldset::build_from_config($fields, array('save' => false));
            $fieldset->validation()->run($item_data);
            $fieldset->triggerComplete($item, $fieldset->validated());
            $menu->items[] = $item;
        }
    }

    public function save($item, $data)
    {
        $return = parent::save($item, $data);

        $hierarchy = \Input::post('hierarchy', '');
        $hierarchy = (array) json_decode($hierarchy);
        $this->hierarchy($hierarchy);

        return $return;
    }

    protected function hierarchy($nodes, $parent = null)
    {
        foreach ($nodes as $i => $node) {
            $node = (array) $node;
            $id = \Arr::get($node, 'id', 0);
            $children = \Arr::get($node, 'children', array());
            $item = $this->menu_items[$id];
            $item->mitem_parent_id = $parent;
            $item->mitem_sort = $i;
            $item->save();

            $this->hierarchy($children, $item->mitem_id);
        }
    }

    public function action_menu_item($item = null)
    {
        if (empty($item)) {
            $item = Model_Menu_Item::forge();
            $item->mitem_driver = \Input::get('driver', 'Nos\Menu\Menu_Item_Link');
            $item->mitem_id = \Input::get('id');
            $item->mitem_title = \Input::get('title');
            $item->mitem_dom_id = \Input::get('dom_id');
            $item->mitem_css_class = \Input::get('css_class');
        }

        $config = $item->driver()->config();
        $fields = \Arr::get($config, 'admin.fields', array());
        if (empty($item->mitem_title) || $item->mitem_title === \Arr::get($config, 'texts.new', '')) {
            $item->mitem_title = '';
            \Arr::set($fields, 'mitem_title.form.placeholder', $item->driver()->title());
        }
        \Arr::set($fields, 'mitem_driver.form.options', array_map(
            function ($val) {
                return $val['name'];
            },
            Menu_Item::drivers()
        ));

        $fieldset = \Fieldset::build_from_config($fields, $item, array('save' => false, 'auto_id' => false));

        $image_view_params = array(
            'fieldset' => $fieldset,
            'layout' => \Arr::get($config, 'admin.layout', array()),
        );
        $image_view_params['view_params'] = &$image_view_params;


        // Replace name with item[12345][name]
        $replaces = array();
        foreach ($fields as $name => $field_config) {
            $replaces['name="'.$name.'"'] = 'name="item['.$item->mitem_id.']['.$name.']"';
            $replaces['name="'.$name.'[]"'] = 'name="item['.$item->mitem_id.']['.$name.'][]"';
        }
        $return = (string) \View::forge('noviusos_menu::admin/renderer/menu/item', $image_view_params, false)
                ->render().$fieldset->build_append();

        return strtr($return, $replaces);
    }

    public function action_duplicate($id)
    {
        try {
            /**
             * @var $menu Model_Menu
             */
            $menu = $this->crud_item($id);
            $contexts = Permission::contexts();
            $duplicateContext = (string) \Input::post('duplicate_context');
            // Check context permission with selected context target
            if (!empty($duplicateContext) && !array_key_exists($duplicateContext, $contexts)) {
                throw new \Exception(__('Invalid context selected.'));
            }
            // If only one context is active popup will not be shown
            if (count($contexts) === 1 || !empty($duplicateContext)) {
                $context = !empty($duplicateContext) ? $duplicateContext : Nos::main_controller()->getContext();
                $menu->duplicate($context);
                // Send response
                \Response::json(array(
                    'dispatchEvent' => array(
                        'name' => 'Nos\Menu\Model_Menu',
                        'action' => 'insert',
                        'context' => $context,
                    ),
                    'notify' => __('Here you are! The menu has just been duplicated.'),
                ));
            } else {
                \Response::json(array(
                    'action' => array(
                        'action' => 'nosDialog',
                        'dialog' => array(
                            'ajax' => true,
                            'contentUrl' => 'admin/noviusos_menu/menu/crud/popup_duplicate/'.$id,
                            'title' => strtr(__('Duplicating the menu "{{title}}"'), array(
                                '{{title}}' => \Str::truncate($menu->title_item(), 40),
                            )),
                            'width' => 500,
                            'height' => 200,
                        ),
                    ),
                ));
            }
        } catch (\Exception $e) {
            $this->send_error($e);
        }
    }

    /**
     * Return popup content to ask the target context of duplication
     *
     * @param null $id : the ID of Model_Form to duplicate
     * @return \Fuel\Core\View
     */
    public function action_popup_duplicate($id = null)
    {
        /**
         * @var $menu Model_Menu
         */
        $menu = $this->crud_item($id);
        $contexts_list = array_keys(Permission::contexts());

        return \View::forge('noviusos_menu::admin/popup_duplicate', array(
            'item' => $menu,
            'action' => 'admin/noviusos_menu/menu/crud/duplicate/'.$id,
            'contexts_list' => $contexts_list,
        ), false);
    }
}
