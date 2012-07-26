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
    'model' => 'Nos\\Model_User',
    'messages' => array(
        'successfully deleted' => __('The user has successfully been deleted!'),
        'item deleted' => __('This user has been deleted.'),
        'not found' => __('User not found'),
    ),
    'views' => array(
        'delete' => 'nos::admin/user/delete_popup',
    ),
);