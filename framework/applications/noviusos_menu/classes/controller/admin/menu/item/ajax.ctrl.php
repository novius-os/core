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

class Controller_Admin_Menu_Item_Ajax extends \Nos\Controller_Admin_Application {

	/**
	 * Edit an item (generates the form)
	 *
	 * @param $id
	 * @return bool|\View
	 * @throws \Exception
	 */
	public function action_edit($id) {
		try {
			// Get context
			$context = \Input::get('context');

			// New item or existing one ?
			$is_new = (empty($id) || !ctype_digit($id));

			// Build the item
			$item = $is_new ? Model_Menu_Item::forge() : Model_Menu_Item::find($id);
			if (empty($item)) {
				// Item not found
				throw new \Exception(__('Sorry, can\'t find this item. Perhaps it has already been deleted?'));
			}

			// Populate the item
			$item->populate();

			// Build the driver
			$driver = Driver_Item::forge($item);

			// Check if a driver has been found
			if (get_class($driver) == 'Nos\Menu\Driver_Item' && $item->mitem_driver) {
				// Not a known driver
				throw new \Exception(__('This kind of item is not or no more supported.'));
				// Note: this error may occur after you uninstall an extension of this application that added this feature.
			}

			// Builds the popup view
			return \View::forge('noviusos_menu::admin/renderer/menu/popup/item-layout', array(
				'controller_url'	=> 'admin/noviusos_menu/menu/item/ajax/',
				'menu_form_id'		=> \Input::get('form_id'),
				'item'				=> $item,
				'item_id'			=> $id,
				'context'			=> $context,
				'expander_options'	=> array(
					'allowExpand'		=> false,
					'expanded'			=> true,
				),
			), false);
		} catch (\Exception $e) {
			// Block not found
			\Response::json(array(
				'error' => $e->getMessage(),
			));
		}
		return false;
	}

	/**
	 * Save an item (save the datas submited by the form)
	 *
	 * @param $id
	 */
	public function action_save($id = null) {
		try {

//			// Build the item
//			$item = $this->build_item($id);
//
//			// Populate the item with the submitted data
//			$item->driver()->populate();
//
//			dd($item);
//
//			$item->save();
//
//			// Block not found
//			\Response::json(array(
//				'item'	=> $item,
//			));

		} catch (\Exception $e) {
			// Block not found
			\Response::json(array(
				'error' => $e->getMessage(),
			));
		}
	}
}
