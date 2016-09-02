<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

return array(
    // Available drivers
    'drivers' => array(
        'Nos\Menu\Menu_Item_Link',
        'Nos\Menu\Menu_Item_Page',
        'Nos\Menu\Menu_Item_Media',
        'Nos\Menu\Menu_Item_Text',
        'Nos\Menu\Menu_Item_Html',
    ),

    // Available templates for the enhancer
    'views' => array(
        'default' => array(
            'title' => __('List'),
            'view' => 'noviusos_menu::menu',
        ),
    ),
);
