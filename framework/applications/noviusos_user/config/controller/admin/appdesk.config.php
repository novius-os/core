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
    'model' => 'Nos\User\Model_User',
    'query' => array(
        'related' => array('roles'),
    ),
    'search_text' => array(
        'user_firstname',
        'user_name',
        'user_email',
    ),
    'hideContexts' => true,
    'i18n' => array(
        'item' => __('user'),
        'items' => __('users'),
        'showNbItems' => __('Showing {{x}} users out of {{y}}'),
        'showOneItem' => __('Show 1 user'),
        'showNoItem' => __('No users'),
        'showAll' => __('Show all users'),
    ),
);
