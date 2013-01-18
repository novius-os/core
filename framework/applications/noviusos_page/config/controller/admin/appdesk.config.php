<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('noviusos_page::common', 'nos::common'));

return array(
    'model' => 'Nos\Page\Model_Page',
    'search_text' => 'page_title',
    'selectedView' => 'default',
    'views' => array(
        'default' => array(
            'name' => __('Default view'),
        ),
        'link_pick' => array(
            'name' => __('Link'),
            'virtual' => true,
            'json' => array(
                'static/apps/noviusos_page/config/link_pick.js'
            ),
        ),
    ),
    'i18n' => array(
        'item' => __('page'),
        'items' => __('pages'),
        'showNbItems' => __('Showing {{x}} pages out of {{y}}'),
        'showOneItem' => __('Showing 1 page'),
        'showNoItem' => __('No pages'),
        'showAll' => __('Showing all pages'),
    ),
    'appdesk' => array(
        'appdesk' => array(
            'defaultView' => 'treeGrid',
        )
    ),
);
