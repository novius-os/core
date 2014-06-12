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
    'controller_url' => 'admin/noviusos_menu/menu/crud',
    'model' => 'Nos\Menu\Model_Menu',
    'layout' => array(
        'large' => true,
        'title' => 'menu_title',
        'content' => array(
            'menu_items' => array(
                'view' => 'nos::form/fields',
                'params' => array(
                    'begin' => '<div>',
                    'end' => '</div>',
                    'fields' => array('items'),
                ),
            ),
        ),
    ),
    'fields' => array(
        'menu_id' => array(
            'label' => 'ID: ',
            'form' => array(
                'type' => 'hidden',
            ),
            'dont_save' => true,
        ),
        'menu_title' => array(
            'label' => __('Title'),
            'form' => array(
                'type' => 'text',
            ),
            'validation' => array(
                'required',
                'min_length' => array(2),
            ),
        ),
        'items' => array(
            'renderer' => 'Nos\Menu\Renderer_Menu_Items',
            'template' => '{field}',
        ),
    ),
    /* UI texts sample */
    'messages' => array(
        'successfully added' => __('Menu successfully added.'),
        'successfully saved' => __('Menu successfully saved.'),
        'successfully deleted' => __('Menu has successfully been deleted!'),
        'you are about to delete, confim' => __('You are about to delete Menu <span style="font-weight: bold;">":title"</span>. Are you sure you want to continue?'),
        'you are about to delete' => __('You are about to delete Menu <span style="font-weight: bold;">":title"</span>.'),
        'exists in multiple context' => __('This Menu exists in <strong>{count} contexts</strong>.'),
        'delete in the following contexts' => __('Delete this menu in the following contexts:'),
        'menu deleted' => __('This menu has been deleted.'),
        'not found' => __('Menu not found'),
        'error added in context' => __('This menu cannot be added {context}.'),
        'menu inexistent in context yet' => __('This menu has not been added in {context} yet.'),
        'add an menu in context' => __('Add a new menu in {context}'),
        'delete an menu' => __('Delete a menu'),
    ),
);
