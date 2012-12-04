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

Nos\I18n::current_dictionary($i18n_files);
?>
<form class="fieldset standalone" id="<?= $id ?>">
<?= \View::forge($crud['config']['views']['delete'], $view_params, false) ?>
<p>
    <button type="submit" class="primary ui-state-error"><?= __('confirm deletion ok') ?></button>
    <span><?= __('confirm deletion or') ?></span>
    <a href="#"><?= __('confirm deletion cancel') ?></a>
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
                            url : <?= \Format::forge($crud['config']['controller_url'].'/delete')->to_json() ?>,
                            method : 'POST',
                            data : $form.serialize()
                        });
                        $form.nosDialog('close');
                    } else {
                        $.nosNotify(<?= \Format::forge(__('confirm deletion wrong_confirmation'))->to_json() ?>, 'error');
                    }

                });

                $cancelButton.click(function(e) {
                    e.preventDefault();
                    $form.nosDialog('close');
                });
            });
        });
</script>
