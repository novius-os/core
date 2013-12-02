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
    'model' => 'Nos\User\Model_User',
    'query' => array(
        'related' => array('roles'),
    ),
    'search_text' => array(
        'user_firstname',
        'user_name',
        'user_email',
    ),
    'inspectors' => \Config::get('novius-os.users.enable_roles', false) ? array('role') : array(),
    'hideContexts' => true,
    'i18n' => array(
        'item' => __('user'),
        'items' => __('users'),
        'NItems' => n__(
            '1 user',
            '{{count}} users'
        ),
        'showNbItems' => n__(
            'Showing 1 user out of {{y}}',
            'Showing {{x}} users out of {{y}}'
        ),
        'showNoItem' => __('No users'),
        // Note to translator: This is the action that clears the 'Search' field
        'showAll' => __('Show all users'),
    ),
);
