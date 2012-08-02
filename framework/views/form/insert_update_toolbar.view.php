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
<script type="text/javascript">
    require(['jquery-nos'],
        function ($) {
            $(function () {
                var actions = <?= \Format::forge($actions)->to_json(); ?>,
                    $form = $('#<?= $fieldset->form()->get_attribute('id') ?>').nosToolbar('create');
                $.each(actions, function() {
                    var button = this,
                        $button = $('<button></button>').click(function() {
                                if (button.openTab) {
                                    $form.nosTabs('open', {
                                        url : button.openTab
                                    });
                                } else if (button.openWindow) {
                                    window.open(button.openWindow);
                                } else if (button.confirmationDialog) {
                                    $button.nosConfirmationDialog({
                                        contentUrl: button.confirmationDialog.contentUrl,
                                        title: button.confirmationDialog.title,
                                        confirmed: function($dialog) {
                                            $dialog.nosAjax({
                                                url : button.confirmationDialog.confirmedUrl,
                                                method : 'POST',
                                                data : $dialog.find('form').serialize()
                                            });
                                        }
                                    });
                                }
                            })
                            .text(button.label)
                            .data(button);

                    $form.nosToolbar('add', $button, true);
                });
            });
        });
</script>