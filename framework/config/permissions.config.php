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
        'applications' => array(),
        //'contexts' => array('Nos\Tools_Context', 'contexts'),
    ),
    'permissions' => array(
        'categories' => array(
            'applications' => array(
                'nos::access' => array(
                    'title' => __('Can access the following applications:'),
                    'view' => 'nos::admin/permissions/list_app',
                ),
            ),
            /*'contexts' => array(
                'nos::context' => array(
                    'title' => __('Can access the following contexts:'),
                    'view' => 'nos::admin/permissions/list_contexts',
                ),
            ),*/
        ),
    ),
);
