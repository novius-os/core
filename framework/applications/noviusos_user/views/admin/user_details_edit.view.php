<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
?>
<?= $fieldset->open('admin/noviusos_user/user/insert_update/'.$user->user_id); ?>
<?= View::forge('form/layout_standard', array(
    'fieldset' => $fieldset,
    // Used by the behaviours (publishable, etc.)
    'item' => $user,
    'medias' => null,
    'title' => array('user_firstname', 'user_name'),
    'id' => 'user_id',

    'save' => 'save',

    'subtitle' => array(),

    'content' => array(
        \View::forge('form/expander', array(
            'title'   => 'Details',
            'nomargin' => false,
            'content' => \View::forge('form/fields', array(
                'fieldset' => $fieldset,
                'fields' => array('user_email', 'user_last_connection', 'user_expert'),
            ), false)
        ), false),
        \View::forge('form/expander', array(
            'title'   => 'Set a new password',
            'nomargin' => false,
            'content' => \View::forge('form/fields', array(
                'fieldset' => $fieldset,
                'fields' => array('password_reset', 'password_confirmation'),
            ), false)
        ), false),
    ),
), false); ?>
<?= $fieldset->close();
