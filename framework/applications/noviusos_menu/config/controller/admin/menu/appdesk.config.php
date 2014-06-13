<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('noviusos_menu::common', 'nos::common'));

return array(
    'model' => 'Nos\Menu\Model_Menu',
    'search_text' => 'menu_title',
    'i18n' => array(
        'item' => __('menu'),
        'items' => __('Website menus'),
        'NItems' => n__(
            '1 menu',
            '{{count}} menus'
        ),
        'showNbItems' => n__(
            'Showing 1 menu out of {{y}}',
            'Showing {{x}} menus out of {{y}}'
        ),
        'showNoItem' => __('No menu'),
        // Note to translator: This is the action that clears the 'Search' field
        'showAll' => __('Show all menus'),
    ),
);
