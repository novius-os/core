<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('noviusos_template_variation::common', 'nos::common'));

return array(
    'model' => 'Nos\Template\Variation\Model_Template_Variation',
    'search_text' => 'tpvar_title',
    'thumbnails' => true,
    'inspectors' => array(
        'template',
    ),
    'query' => array(
        'callback' => array(
            function ($query) {
                return $query->order_by('tpvar_default', 'DESC')->order_by('tpvar_title');
            }
        )
    ),
    'appdesk' => array(
        'appdesk' => array(
            'defaultView' => 'thumbnails',
        ),
    ),
    'i18n' => array(
        'item' => __('variation'),
        'items' => __('template variations'),
        'NItems' => n__(
            '1 variation',
            '{{count}} variations'
        ),
        'showNbItems' => n__(
            'Showing 1 variation out of {{y}}',
            'Showing {{x}} variations out of {{y}}'
        ),
        'showNoItem' => __('No variation'),
        // Note to translator: This is the action that clears the 'Search' field
        'showAll' => __('Show all variations'),
    ),
);
