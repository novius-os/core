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

?>
<?= $fieldset->open('admin/noviusos_user/user/insert_update/'.$user->user_id); ?>
<?= View::forge('form/layout_standard', array(
    'fieldset' => $fieldset,
    // Used by the behaviours (publishable, etc.)
    'item' => $user,
    'medias' => null,
    'title' => array('user_firstname', 'user_name'),
    'id' => 'user_id',

    'subtitle' => array(),

    'content' => array(
        \View::forge('form/expander', array(
            'title'   => __('Details'),
            'nomargin' => false,
            'content' => \View::forge('form/fields', array(
                'fieldset' => $fieldset,
                'fields' => array('user_email', 'user_last_connection', 'user_lang', 'user_expert'),
            ), false)
        ), false),
        // "My account" screen can't edit the roles
        !empty($no_role) || \Config::get('novius-os.users.enable_roles', false) == false ? '' : \View::forge('form/expander', array(
            'title' => __('Roles'),
            'nomargin' => false,
            'content' => \View::forge('noviusos_user::admin/user_roles_edit', array(
                'fieldset' => $fieldset,
                'user' => $user,
            ), false)
        ), false),
        \View::forge('form/expander', array(
            'title'   => __('Set a new password'),
            'nomargin' => false,
            'content' => \View::forge('form/fields', array(
                'fieldset' => $fieldset,
                'fields' => array('password_reset', 'password_confirmation'),
            ), false)
        ), false),
    ),
), false); ?>
<?= $fieldset->close();
