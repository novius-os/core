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
    'name' => __('Rich text'),
    'texts' => array(
        'add' => __('Add a rich text block'),
        'new' => __('New rich text block'),
    ),
    'icon' => 'static/apps/noviusos_menu/img/16/html.png',

    'view' => 'noviusos_menu::driver/html',

    'admin' => array(
        'layout' => array(
            'standard' => array(
                'view'   => 'nos::form/accordion',
                'params' => array(
                    'accordions' => array(
                        'main' => array(
                            'fields' => array(
                                'wysiwygs->content->wysiwyg_text',
                            ),
                        ),
                    ),
                ),
            ),
        ),
        'fields' => array(
            'wysiwygs->content->wysiwyg_text' => array(
                'label' => __('Content'),
                'renderer' => 'Nos\Renderer_Wysiwyg',
                'form' => array(
                    'style' => 'width: 100%; height: 300px;',
                ),
            ),
        ),
    ),
);
