<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
use Nos\I18n;

I18n::load('user', 'nos_user');

return array(
    'model' => 'Nos\Model_User',
    'query' => array(
        'related' => array('roles'),
    ),
    'search_text' => array(
        'user_firstname',
        'user_name',
        'user_email',
    ),
    'hideLocales' => true,
    'dataset' => array(
        'fullname' => array(
            'headerText' => __('Name'),
            //'search_column' => \DB::expr('CONCAT(user_firstname, user_name)'),
            'value' => function($item) {
                return $item->fullname();
            },
        ),
        'email' => array(
            'headerText' => __('Email'),
            'column' => 'user_email',
        ),
        'id_permission' => array(
            'visible' => false,
            'value' => function($item) {
                return $item->roles && reset($item->roles)->role_id ?: $item->user_id;
            },
        ),
    ),
    'appdesk' => array(
        'tab' => array(
            'label' => __('Users'),
            'iconUrl' => 'static/novius-os/admin/novius-os/img/32/user.png'
        ),
    ),
);
