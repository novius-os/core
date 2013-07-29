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
<?= \View::forge($crud['config']['views']['delete'], $view_params, false) ?>
<p><?= $crud['config']['i18n']['deleting confirmation'] ?></p>
<p>
    <?= strtr($crud['config']['i18n']['deleting confirmation button'], array(
        '{{Button}}' => '
                <button type="submit" class="ui-priority-primary ui-state-error" data-texts="'.htmlspecialchars(\Format::forge()->to_json(array(
                    '0' => $crud['config']['i18n']['deleting button 0 items'],
                    '1' => $crud['config']['i18n']['deleting button 1 item'],
                    '+' => $crud['config']['i18n']['deleting button N items'],
                ))).'">'.$crud['config']['i18n']['deleting confirmation item'].'</button>',
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
                    $checkboxes,
                    $confirmButton = $form.find(':submit'),
                    $cancelButton = $form.find('a:last'),
                    $verifications = $form.find('.verification');


                $table.wijgrid({
                    selectionMode: 'none',
                    highlightCurrentCell: false,
                    columns: [
                        {},
                        {},
                        {
                            cellFormatter: function(args) {
                                if (args.row.type & $.wijmo.wijgrid.rowType.data) {
                                    args.$container.css({
                                        textAlign: 'center'
                                    });
                                }
                            }
                        }
                    ],
                    rendered: function(args) {
                        $(args.target).closest('.wijmo-wijgrid').find('thead').hide();
                    }
                });
                $form.nosFormUI();

                $checkboxes = $form.find(':checkbox.count');
                $checkboxes.change(function() {
                        var sum = 0;
                        $checkboxes.filter(':checked').each(function() {
                            sum += parseInt($(this).data('count'));
                        });
                        $confirmButton[sum == 0 ? 'addClass' : 'removeClass']('ui-state-disabled');
                        $confirmButton.find('.ui-button-text').text(
                            $.nosDataReplace($confirmButton.data('texts')[(sum > 1 ? '+' : sum).toString()], {
                                'count': sum.toString()
                            })
                        );
                        $(this).removeClass('ui-state-focus');
                    })
                    .click(function(e) {
                        e.stopPropagation();
                    })
                    .first()
                    .trigger('change');


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
