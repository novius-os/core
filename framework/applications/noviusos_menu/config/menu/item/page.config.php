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
    'name' => 'Page',
    'texts' => array(
        'add' => 'Add a new page link',
        'new' => 'New page link',
    ),
    'icon' => 'static/apps/noviusos_menu/img/16/page.png',

    // Allowed EAV attributes
    'attributes' => array(
        'page_id',
    ),

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
                'view'   => 'noviusos_menu::driver/page',
            ),
        ),
        'fields' => array(
            'mitem_page_id' => array(
                'label' => __('Page:'),
                'renderer' => 'Nos\Page\Renderer_Selector',
            ),
        ),
    ),
);
