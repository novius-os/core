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
<div id="<?= $uniqid = uniqid('id_') ?>" class="fieldset standalone">

    <p><?= __('Deleting a user is permanent, there is no undo.') ?></p>
    <p><?= __('Please confirm the deletion:'); ?></p>
    <p>
        <button class="primary ui-state-error" data-icon="trash" data-id="confirmation"><?= __('Confirm the deletion') ?></button>
        &nbsp; <?= __('or') ?> &nbsp;
        <a href="#" data-id="cancel"><?= __('Cancel') ?></a>
    </p>
</div>

<script type="text/javascript">
require(
    ['jquery-nos'],
    function($) {
        $(function() {
            var $container    = $('#<?= $uniqid ?>').nosFormUI();

            $container.find('button[data-id=confirmation]').click(function(e) {
                e.preventDefault();
                $container.nosAjax({
                    url : 'admin/nos/user/user/delete_user_confirm',
                    method : 'POST',
                    data : {
                        id : <?= $user->user_id ?>
                    },
                    success : function(json) {
                        $container.nosDialog('close');
                    }
                });
            });

            $container.find('a[data-id=cancel]').click(function(e) {
                e.preventDefault();
                $container.nosDialog('close');
            });

        });
    });
</script>