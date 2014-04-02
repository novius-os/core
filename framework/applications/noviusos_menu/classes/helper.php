<?php

namespace Nos\Menu;

class Helper
{
    /**
     * Returns the installed menu driver list
     *
     * @return array
     * @throws \Exception
     */
    public static function getInstalledDrivers()
    {
        $installed_menus = array();
        // Loops through installed apps
        $app_installed = \Nos\Config_Data::load('app_installed', false);
        foreach ($app_installed as $application_name => $config) {

            // Get the menu config of the application
            $menus_config = \Arr::get($config, 'menus', array());
            if (!empty($menus_config)) {

                // Add each menu config to the list
                foreach ($menus_config as $menu_name => $menu_config) {

                    // Save menu config
                    $installed_menus[$menu_name] = \Arr::merge($menu_config, array('application_name' => $application_name));
                }
            }
        }
        return array_filter($installed_menus);
    }
}
