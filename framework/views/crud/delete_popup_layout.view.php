<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
$id = $uniqid = uniqid('form_');
?>
<form class="fieldset standalone" id="<?= $id ?>">
<?= \View::forge($view_params['config']['views']['delete'], array('view_params' => $view_params), false) ?>
<p>
    <button type="submit" class="primary ui-state-error"><?= $view_params['config']['messages']['confirm deletion ok'] ?></button>
    <span><?= $view_params['config']['messages']['confirm deletion or'] ?></span>
    <a href="#"><?= $view_params['config']['messages']['confirm deletion cancel'] ?></a>
</p>
</form>
<script type="text/javascript">
    require(['jquery-nos'],
        function ($) {
            $(function () {
                var $form = $('#<?= $id ?>').nosFormUI(),
                    $confirmButton = $form.find(':submit'),
                    $cancelButton = $form.find('a:last'),
                    $verifications = $form.find('.verification');

                $confirmButton.click(function(e) {
                    e.preventDefault();

                    var allVerificationPassed = true;
                    $verifications.each(function() {
                        if ($verifications.val().length == 0 || $verifications.val() != $verifications.data('verification')) {
                            allVerificationPassed = false;

                            return false;
                        }
                    });
                    if (allVerificationPassed) {
                        $form.nosAjax({
                            url : <?= \Format::forge($view_params['config']['controller_url'].'/delete')->to_json() ?>,
                            method : 'POST',
                            data : $form.serialize()
                        });
                        $form.nosDialog('close');
                    } else {
                        $.nosNotify(<?= \Format::forge($view_params['config']['messages']['confirm deletion wrong_confirmation'])->to_json() ?>, 'error');
                    }

                });

                $cancelButton.click(function(e) {
                    e.preventDefault();
                    $form.nosDialog('close');
                });
            });
        });
</script>
