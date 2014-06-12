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

$templates = array('' => __('Choose a template'));
foreach (\Nos\Config_Data::get('templates', array()) as $tpl_key => $template) {
    $templates[$tpl_key] = $template['title'];
}

return array(
    'controller_url'  => 'admin/noviusos_template_variation/variation',
    'model' => 'Nos\Template\Variation\Model_Template_Variation',
    'tab' => array(
        'iconUrl' => 'static/apps/noviusos_template_variation/img/16/template-variation.png',
        'labels' => array(
            'insert' => __('Add a template variation'),
        ),
    ),
    'layout' => array(
        'form' => array(
            'view' => 'nos::form/layout_standard',
            'params' => array(
                'title' => 'tpvar_template',
                'large' => true,
                'subtitle' => array('tpvar_title'),
            ),
        ),
        'js' => array(
            'view' => 'noviusos_template_variation::admin/variation_form',
        ),
    ),
    'fields' => array(
        'tpvar_id' => array (
            'label' => 'ID: ',
            'form' => array(
                'type' => 'hidden',
            ),
        ),
        'tpvar_title' => array(
            'label' => __('Variation title'),
            'form' => array(
                'type' => 'text',
                'size' => 50,
            ),
        ),
        'tpvar_template' => array(
            'label' => __('Template:'),
            'form' => array(
                'type' => 'select',
                'options' => $templates,
            ),
        ),
    )
);
