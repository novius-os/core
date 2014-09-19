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
    'name' => __('Text'),
    'texts' => array(
        'add' => __('Add a text block'),
        'new' => __('New text block'),
    ),
    'icon' => 'static/apps/noviusos_menu/img/16/text.png',

    // Allowed EAV attributes
    'attributes' => array(
        'text', 'is_html'
    ),

    'view' => 'noviusos_menu::driver/text',

    'admin' => array(
        'layout' => array(
            'standard' => array(
                'view'   => 'nos::form/accordion',
                'params' => array(
                    'accordions' => array(
                        'main' => array(
                            'fields' => array(
                                'mitem_text',
                                'mitem_is_html',
                            ),
                        ),
                    ),
                ),
            ),
        ),
        'fields' => array(
            'mitem_text' => array(
                'label' => __('Text:'),
                'form' => array(
                    'type' => 'textarea',
                    'rows' => '6',
                    //'style' => 'display:block;'
                ),
            ),
            'mitem_is_html' => array(
                'label' => __('Interpret as HTML code'),
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
