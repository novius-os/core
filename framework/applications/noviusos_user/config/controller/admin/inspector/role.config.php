<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('noviusos_user::common'));

return array(
    'model' => 'Nos\User\Model_Role',
    'query' => array(
        'order_by' => 'role_name',
    ),
    'input' => array(
        'key' => 'roles.role_id',
    ),
    'appdesk' => array(
        'label' => __('Role'),
    ),
);
