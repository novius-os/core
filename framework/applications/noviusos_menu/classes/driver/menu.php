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

/**
 * The abstract menu driver
 *
 * @package Nos\Menu
 */
class Driver_Menu extends Driver {

    /**
     * Constructor
     *
	 * @param null $menu
	 * @param array $options
	 *
	 * @return Driver_Menu $this
	 */
	public function __construct($menu = null, $options = array()) {
		// Finds the menu if $menu is an ID
		if (is_numeric($menu)) {
			$menu = Model_Menu::find($menu);
			$context = \Arr::get($options, 'context');
			if (!empty($context) && $context != $menu->menu_context) {
				if ($context_menu = $menu->find_context($context)) {
					$menu = $context_menu;
				}
			}
		}
        parent::__construct($menu);
		return $this;
    }

    /**
     * Finds the menus compatible with this driver and returns them as a list of forged menu drivers
     *
	 * @param array $options
	 * @return array
	 */
	public static function getMenus($options = array()) {
        // Finds the published menus
		$query = Model_Menu::query()->where('published', true);
//		array(
//			'where'	=> array(
//				array('published', true),
//			),
//		));

//		$params = \Arr::merge($options, array(
//			'where'	=> array(
//				array('published', true),
//			),
//		));

		// Context
		if ($context = \Arr::get($options, 'context')) {
			$query->and_where('menu_context', '=', $context);
		}

        // Forges them using the current driver
        $menus = array();
        foreach ($query->get() as $model) {
            $menus[] = static::forge($model, $options);
        }

        return $menus;
    }

    /**
     * Returns a tree of menu items forged with their driver (recursive)
     *
     * @param null|int $parent_id
     * @return array
     */
    public function getItems($parent_id = null) {
        // Get items
        $items = $this->menu->items($parent_id);
        // Forge items driver
        foreach ($items as $k => $item) {
            // Forge driver with item
            $items[$k] = Driver_Item::forge($item);
        }
        return $items;
    }

    /**
     * Gets the menu title
     *
     * @return mixed
     */
    public function getTitle() {
        return $this->menu->menu_title;
    }

    /**
     * Gets the menu id
     *
     * @return mixed
     */
    public function getId() {
        return $this->menu->menu_id;
    }

    /**
     * Returned a forged menu
     *
	 * @param null $menu
	 * @param array $options
	 * @return Driver
	 */
	public static function forge($menu = null, $options = array()) {
        // Try to build the appropriate driver (only if called statically on this class)
        if (!empty($menu) && is_object($menu) && !empty($menu->menu_driver) && get_called_class() == get_class()) {
            $driver = $menu->menu_driver;
            if (class_exists($driver)) {
                return new $driver($menu, $options);
            }
        }
        return parent::forge($menu, $options);
    }
}
