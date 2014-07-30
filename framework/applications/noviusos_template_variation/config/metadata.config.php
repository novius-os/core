<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

return array(
    'name'      => 'Template variation manager',
    'namespace' => 'Nos\Template\Variation',
    'version'   => '5.0.1 (Elche)',
    'provider'  => array(
        'name'  => 'Novius OS',
    ),
    'i18n_file' => 'noviusos_template_variation::metadata',
    'permission' => array(),
    'launchers' => array(
        'noviusos_template_variation' => array(
            'name' => 'Template variations',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => 'admin/noviusos_template_variation/appdesk/index',
                ),
            ),
        ),
    ),
    'icons' => array(
        64 => 'static/apps/noviusos_template_variation/img/64/template-variation.png',
        32 => 'static/apps/noviusos_template_variation/img/32/template-variation.png',
        16 => 'static/apps/noviusos_template_variation/img/16/template-variation.png',
    ),
);
