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


if (!is_array($crud['config']['i18n']['deleting button N items'])) {
    \Log::deprecated(
        'The "deleting button N items" key '.
        'of CRUD '.$crud['config']['model'].' config\'s i18n array must contain an array of different plurals '.
        'translation, and not the translated text. '.
        'In this case, the key "deleting button 1 item" and "deleting button 0 items" is unnecessary.',
        'Dubrovka'
    );
    $crud['config']['i18n']['deleting button N items'] = array(
        0 => $crud['config']['i18n']['deleting button 1 item'],
        1 => $crud['config']['i18n']['deleting button N items'],
    );
}
?>
<form class="fieldset standalone" id="<?= $id ?>">
<?= \View::forge($crud['config']['views']['delete'], $view_params, false) ?>
<p><?= $crud['config']['i18n']['deleting confirmation'] ?></p>
<p>
    <?= strtr($crud['config']['i18n']['deleting confirmation button'], array(
        '{{Button}}' => '
                <button type="submit" class="ui-priority-primary ui-state-error" data-texts="'.
                    htmlspecialchars(\Format::forge()->to_json($crud['config']['i18n']['deleting button N items'])).
                    '">'.$crud['config']['i18n']['deleting confirmation item'].'</button>',
        '<a>' => '<a href="#">',
    )) ?>
</p>
</form>
<script type="text/javascript">
    require(['jquery-nos', 'wijmo.wijgrid'],
        function ($) {
            $(function () {
                var $form = $('#<?= $id ?>'),
                    $table = $form.find('table'),
                    $checkboxes, $checkall,
                    $confirmButton = $form.find(':submit'),
                    $cancelButton = $form.find('a:last'),
                    $verifications = $form.find('.verification'),
                    checkboxes_sum = function() {
                        var sum = 0;
                        $checkboxes.filter(':checked').each(function() {
                            sum += parseInt($(this).data('count'));
                        });
                        $confirmButton[sum == 0 ? 'addClass' : 'removeClass']('ui-state-disabled');
                        console.log((sum > 1 ? '+' : sum).toString());
                        $confirmButton.find('.ui-button-text').text(
                            $.nosDataReplace(
                                $.nosI18nPlural($confirmButton.data('texts'), sum),
                                {'count': sum.toString()}
                            )
                        );
                    };


                $table.wijgrid({
                    selectionMode: 'none',
                    highlightCurrentCell: false,
                    columns: [
                        {},
                        {},
                        {
                            cellFormatter: function(args) {
                                args.$container.parent().css({
                                        textAlign: 'center'
                                });
                            }
                        }
                    ]
                });
                $form.nosFormUI();

                $checkboxes = $form.find(':checkbox.count');
                $checkboxes.change(function() {
                        checkboxes_sum();
                        $(this).removeClass('ui-state-focus');
                    })
                    .click(function(e) {
                        e.stopPropagation();
                    })
                    .first()
                    .trigger('change');

                $checkall = $table.find(':checkbox[name=check_all]').change(function() {
                    $checkboxes.each(function() {
                        this.checked = $checkall[0].checked;
                    });
                    checkboxes_sum();
                }).click(function(e) {
                    e.stopPropagation();
                });

                $table.find('tr').css({cursor: 'pointer'}).click(function() {
                    $(this).find(':checkbox').click();
                });

                $confirmButton.click(function(e) {
                    e.preventDefault();
                    if ($(this).hasClass('ui-state-disabled')) {
                        return;
                    }

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
                            data : $form.serialize(),
                            success: function() {
                                $form.nosDialog('close');
                            }
                        });
                    } else {
                        $.nosNotify(<?= \Format::forge($crud['config']['i18n']['deleting wrong confirmation'])->to_json() ?>, 'error');
                    }
                });

                $cancelButton.click(function(e) {
                    e.preventDefault();
                    $form.nosDialog('close');
                });
            });
        });
</script>
