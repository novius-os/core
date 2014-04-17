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

class Menu_Item
{
    /**
     * Creates a new instance of the menu item driver
     *
     * @param   string|int|Model_Menu_Item $item
     * @throws \FuelException
     * @return  Menu_Item_Driver
     */
    public static function forge($item)
    {
        if (is_numeric($item)) {
            $item = Model_Menu_Item::find($item);
        } elseif (is_string($item)) {
            $driver = $item;
            $item = Model_Menu_Item::forge();
            $item->mitem_driver = $driver;
        }
        $driver = $item->mitem_driver;

        if (!class_exists($driver)) {
            throw new \FuelException('Driver '.$driver.' is not a valid driver for menu item manipulation.');
        }
        return new $driver($item);
    }

    public static function drivers()
    {
        $drivers = array();

        $config = \Config::load('noviusos_menu::config', true);
        $available_drivers = \Arr::get($config, 'drivers', array());
        foreach ($available_drivers as $driver_class) {
            if (!class_exists($driver_class)) {
                continue;
            }
            $drivers[$driver_class] = $driver_class::config();
        }

        return $drivers;
    }
}
