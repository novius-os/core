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

$uniqid = uniqid('id_');
?>

<style type="text/css">
/* ? */
/* @todo check this */
.wijmo-wijaccordion-content-active {
    overflow: visible !important;
}
</style>

<div class="page line ui-widget" id="<?= $uniqid ?>">
    <?= View::forge('form/layout_standard', array(
        'fieldset' => $fieldset,
        'medias' => null,
        'title' => array('user_firstname', 'user_name'),
        'id' => 'user_id',

        'published' => null,

        'subtitle' => array(),

        'content' => array(
            \View::forge('form/expander', array(
                'title'   => 'Details',
                'nomargin' => false,
                'content' => \View::forge('form/fields', array(
                    'fieldset' => $fieldset,
                    'fields' => array('user_email', 'user_password', 'password_confirmation', 'user_lang', 'user_expert'),
                ), false)
            ), false),
            \Config::get('novius-os.users.enable_roles', false) == false ? '' : \View::forge('form/expander', array(
                'title' => __('Roles'),
                'nomargin' => false,
                'content' => \View::forge('noviusos_user::admin/user_roles_edit', array(
                    'fieldset' => $fieldset,
                    'user' => $item,
                ), false)
            ), false),
        ),
    ), false); ?>
</div>

<?php
echo \View::forge('noviusos_user::admin/password_strength', array(
    'uniqid' => $uniqid,
    'input_name' => 'user_password',
), false);
