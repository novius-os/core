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
    'name' => __('Link to a page'),
    'texts' => array(
        'add' => __('Add a link to a page'),
        'new' => __('New link to a page'),
    ),
    'icon' => 'static/apps/noviusos_menu/img/16/page.png',

    // Allowed EAV attributes
    'attributes' => array(
        'page_id',
    ),

    'view' => 'noviusos_menu::driver/page',

    'admin' => array(
        'layout' => array(
            'standard' => array(
                'view'   => 'nos::form/accordion',
                'params' => array(
                    'accordions' => array(
                        'main' => array(
                            'fields' => array(
                                'mitem_page_id',
                            ),
                        ),
                    ),
                ),
            ),
            array(
                'view'   => 'noviusos_menu::admin/driver/page',
            ),
        ),
        'fields' => array(
            'mitem_page_id' => array(
                'label' => __('Page:'),
                'form' => array(
                    'type' => 'hidden',
                    'class' => 'menu_item_page_id',
                ),
                'renderer' => 'Nos\Renderer_Item_Picker',
                'renderer_options' => array(
                    'model' => 'Nos\Page\Model_Page',
                    'appdesk' => 'admin/noviusos_page/appdesk',
                    'defaultThumbnail' => 'static/apps/noviusos_page/img/64/page.png',
                    'texts' => array(
                        'empty' => __('No page selected'),
                        'add' => __('Pick a page'),
                        'edit' => __('Pick another page'),
                        'delete' => __('Un-select this page'),
                    ),
                ),
            ),
        ),
    ),
);
