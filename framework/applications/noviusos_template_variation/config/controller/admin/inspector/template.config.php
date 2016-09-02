<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('noviusos_template_variation::common'));

$templates = array();
foreach (\Nos\Config_Data::get('templates', array()) as $tpl_key => $template) {
    $templates[] = array(
        'id' => $tpl_key,
        'title' => $template['title'],
    );
}

usort($templates, function($a, $b) {
    return strcmp($a['title'], $b['title']);
});

return array(
    'data' => $templates,
    'input' => array(
        'key' => 'tpvar_template',
        'query' =>
            function ($value, $query) {
                $query->where(array('tpvar_template', '=', $value))->order_by('tpvar_default', 'DESC')->order_by('tpvar_title');
                return $query;
            },
    ),
    'appdesk' => array(
        'vertical' => true,
        'label' => __('Templates'),
        'inputName' => 'tpvar_template',
        'grid' => array(
            'columns' => array(
                'title' => array(
                    'headerText' => __('Templates'),
                    'dataKey' => 'title',
                ),
                'id' => array(
                    'visible' => false,
                ),
            ),
        ),
    ),
);
