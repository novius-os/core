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
    'name'      => 'Help',
    'namespace' => 'Nos\Help',
    'version'   => '0.2',
    'provider'  => array(
        'name'  => 'Novius OS',
    ),
    'permission' => array(),
    'launchers' => array(
        'noviusos_help' => array(
            'name' => 'Help',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'label' => __('Help'),
                    'url' => 'admin/noviusos_help/help',
                    'iconUrl' => 'static/apps/noviusos_help/img/32/help.png',
                ),
            ),
        ),
    ),
    'icons' => array(
        64 => 'static/apps/noviusos_help/img/64/help.png',
        32 => 'static/apps/noviusos_help/img/32/help.png',
        16 => 'static/apps/noviusos_help/img/16/help.png',
    ),
);
