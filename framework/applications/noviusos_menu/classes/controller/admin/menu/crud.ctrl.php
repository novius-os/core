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

class Controller_Admin_Menu_Crud extends \Nos\Controller_Admin_Crud
{
	/**
	 * Save menu
	 *
	 * @param $menu
	 * @param $data
	 * @return array
	 */
	public function save($menu, $data) {
		// Save menu
		$response = parent::save($menu, $data);
		if (empty($menu->menu_id)) {
			return $response;
		}

		// Save items
		$response = \Arr::merge($response, $this->save_items(\Input::post('update_items'), $menu));

		// Delete items
		$response = \Arr::merge($response, $this->delete_items(\Input::post('delete_items'), $menu));

		return $response;
	}

	/**
	 * Save menu items
	 *
	 * @param $items
	 * @param $menu
	 * @return array
	 * @throws \Exception
	 */
	public function save_items($items, $menu) {
		$return = array();

		if (empty($items)) {
			return $return;
		}

		foreach ($items as $id => $properties) {

			try {
				// New item or existing one ?
				$is_new = (empty($id) || !is_numeric($id));

				// Get or create the item
				$item = $is_new ? Model_Menu_Item::forge() : Model_Menu_Item::find($id);

				if (empty($item)) {
					// Item not found
					throw new \Exception(__('Sorry, can\'t find this item. Perhaps it has already been deleted?'));
				}

				if (!$is_new && $item->mitem_context != $menu->menu_context) {
					// If not the right context, clone the item
                    $item = clone $item;
				}
				$item->mitem_context = $menu->menu_context;

				// Populate the item with the submitted data
				$item->populate(\Arr::merge($properties, array('mitem_menu_id' => $menu->menu_id)));

				// Save item
				$item->save();

				// Dispatch event
				$return['dispatchEvent'][] = array(
					"name" 		=> "Nos\\Menu\\Model_Menu_Item",
					"action" 	=> ($is_new ? 'insert' : 'update'),
					"id" 		=> $id,
					"newid"		=> $item->mitem_id
				);
			}

				// Errors on item
			catch (\Exception $e) {
				$return['errors'][] = $e->getMessage();
			}
		}

		return $return;
	}

	/**
	 * Save menu items
	 *
	 * @param $items
	 * @param $menu
	 * @return array
	 * @throws \Exception
	 */
	public function delete_items($items, $menu) {
		$return = array();

		if (empty($items)) {
			return $return;
		}

		foreach ($items as $id => $value) {

			try {
				// New item or existing one ?
				if (empty($id) || !is_numeric($id)) {
					continue;
				}

				// Get or create the item
				$item = Model_Menu_Item::find($id);
				if (empty($item)) {
					// Item not found
					throw new \Exception(__('Sorry, can\'t find this item. Perhaps it has already been deleted?'));
				}

				// Delete item's children
				$deleted_ids = $this->delete_item_children($menu->items($item->mitem_id));

				// Delete item
				$item->delete();
				$deleted_ids += array($id);

				// Dispatch delete events
				foreach ($deleted_ids as $deleted_id) {
					$return['dispatchEvent'][] = array(
						"name" 		=> "Nos\\Menu\\Model_Menu_Item",
						"action" 	=> 'delete',
						"id" 		=> $deleted_id,
					);
				}
			}

				// Errors on item
			catch (\Exception $e) {
				$return['errors'][] = $e->getMessage();
			}
		}

		return $return;
	}

	public function delete_item($menu, $item) {
	}

	/**
	 * Delete item's children
	 *
	 * @param array $tree Item's children tree
	 * @return array Deleted item ids
	 */
	public function delete_item_children($tree) {
		$ids = array();
		if (empty($tree)) {
			return $ids;
		}
		foreach ($tree as $item) {
			if (count($item->children)) {
				// Delete the item's children
				$ids += $this->delete_item_children($item->children);
			}
			// Delete the itemx
			$item->delete();
		}
		return array_keys($tree) + $ids;
	}
}
