<?php

/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary('noviusos_user::common');

return array(
    'categories' => array(
        'applications' => function() {
            $apps = array();
            foreach (\Nos\Config_Data::get('app_installed') as $app_name => $app) {
                $apps[$app_name] = array(
                    'title' => $app['name'],
                    'icon' => \Config::icon($app_name, 16),
                );
            }
            return $apps;
        },
    ),
    'permissions' => array(
        'categories' => array(
            'applications' => array(
                'nos::access' => array(
                    'title' => __('Can access the following applications:'),
                ),
            ),
        ),
    ),
);
