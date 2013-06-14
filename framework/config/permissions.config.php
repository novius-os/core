<?php

/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary('nos::common');

return array(
    'all' => array(
        'view' => 'nos::admin/permissions/core',
        'params' => array(
            'list' => array(
                'contexts' => array(
                    'permission_name' => 'nos::context',
                    'title' => __('Is granted access to the following contexts:'),
                    'view' => 'nos::admin/permissions/list_contexts',
                ),
                'apps' => array(
                    'permission_name' => 'nos::access',
                    'title' => __('Is granted access to the following applications:'),
                    'view' => 'nos::admin/permissions/list_app',
                ),
            ),
        ),
    ),
);
