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
    'name' => 'Text',
    'texts' => array(
        'add' => 'Add a text',
        'new' => 'New text',
    ),
    'icon' => 'static/apps/noviusos_menu/img/16/text.png',

    // Allowed EAV attributes
    'attributes' => array(
        'text', 'is_html'
    ),

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
