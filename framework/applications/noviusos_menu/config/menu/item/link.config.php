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
    'name' => __('Link'),
    'texts' => array(
        'add' => __('Add a link'),
        'new' => __('New link'),
    ),
    'icon' => 'static/apps/noviusos_menu/img/16/link.png',

    // Allowed EAV attributes
    'attributes' => array(
        'url', 'url_blank'
    ),

    'view' => 'noviusos_menu::driver/link',

    'admin' => array(
        'layout' => array(
            'standard' => array(
                'view'   => 'nos::form/accordion',
                'params' => array(
                    'accordions' => array(
                        'main' => array(
                            'fields' => array(
                                'mitem_url',
                                'mitem_url_blank',
                            ),
                        ),
                    ),
                ),
            ),
        ),
        'fields' => array(
            'mitem_url' => array(
                'label' => __('URL:'),
                'form' => array(
                    'type' => 'text',
                ),
            ),
            'mitem_url_blank' => array(
                'label' => __('Opens in a new window or tab'),
                'form' => array(
                    'type' => 'checkbox',
                    'value' => '1',
                    'empty' => '0',
                ),
                'expert' => true,
            ),
        ),
    ),
);
