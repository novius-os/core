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
    'controller' => 'menu/crud',
    'data_mapping' => array(
        'menu_title' => array(
            'title' => __('Title'),
        ),
    ),
    'i18n' => array(
        // Crud
        'notification item added' => __('Done! The menu has been added.'),
        'notification item deleted' => __('The menu has been deleted.'),

        // General errors
        'notification item does not exist anymore' => __('This menu doesn’t exist any more. It has been deleted.'),
        'notification item not found' => __('We cannot find this menu.'),

        // Deletion popup
        'deleting item title' => __('Deleting the menu ‘{{title}}’'),

        # Delete action's labels
        'deleting button N items' => n__(
            'Yes, delete this menu',
            'Yes, delete these {{count}} menus'
        ),

        'N items' => n__(
            '1 menu',
            '{{count}} menus'
        ),

        # Keep only if the model has the behaviour Contextable
        'deleting with N contexts' => n__(
            'This menu exists in <strong>one context</strong>.',
            'This menu exists in <strong>{{context_count}} contexts</strong>.'
        ),
        'deleting with N languages' => n__(
            'This menu exists in <strong>one language</strong>.',
            'This menu exists in <strong>{{language_count}} languages</strong>.'
        ),

        # Keep only if the model has the behaviour Twinnable
        'translate error impossible context' => __('This menu cannot be added in {{context}}. (How come you get this error message? You’ve hacked your way into here, haven’t you?)'),
    ),
    'actions' => array(
        'add' => array(
            'label' => __('Add a menu'),
        ),
    ),
);
