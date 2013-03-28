<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

$role = reset($user->roles);
?>

<div class="permissions fill-parent" id="<?= $uniqid = uniqid('id_') ?>" style="overflow:auto;">

    <form action="admin/noviusos_user/role/save_permissions" method="POST">

        <input type="hidden" name="role_id" value="<?= $role->role_id ?>" />

        <?php
        echo \View::forge('noviusos_user::admin/permission', array(
            'role' => $role,
        ), false);
        ?>

    </form>
</div>

<script type="text/javascript">
    require(
        ['jquery-nos'],
        function($) {
            $(function() {
                var $form = $('#<?= $uniqid ?>').nosFormUI().nosFormAjax();
            });
        });
</script>
