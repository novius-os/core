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
require(
    ['jquery-nos'],
    function($) {
        $(function() {
            var $container = $('#<?= isset($container_id) ? $container_id : $fieldset->form()->get_attribute('id') ?>'),
                dialog = function(click) {
                    var $div = $('<div><p></p><ul></ul></div>')
                            .find('p')
                            .text(<?= \Format::forge(__('When you modify the value of this field, the change is also applied to the following contexts/languages/sites:'))->to_json() ?>)
                            .end(),
                        $ul = $div.find('ul'),
                        contexts = this.data('other-contexts');

                    $.each(contexts, function(i, context) {
                        $('<li></li>').html(context)
                                .appendTo($ul);
                    });

                    $container.nosDialog({
                        title: <?= \Format::forge(__('This field is common to all contexts/languages/sites'))->to_json() ?>,
                        content: $div,
                        width: 500,
                        height: 130 + contexts.length * 20,
                        buttons: [
                            {
                                text: <?= \Format::forge(__('OK, I understand'))->to_json() ?>,
                                click: function () {
                                    click();
                                    $(this).wijdialog("close");
                                }
                            },
                            {
                                text: <?= \Format::forge(__('Cancel, I won\'t modify it'))->to_json() ?>,
                                click: function () {
                                    $(this).wijdialog("close");
                                }
                            }
                        ]
                    });
                };

            $container.find('[context_invariant_field]').each(function() {
                var $element = $(this),
                    $elementUI = $element;
                if ($element.is(':radio')) {
                    $elementUI = $element.closest('.wijmo-radio');
                } else if ($element.is(':checkbox')) {
                    $elementUI = $element.closest('.wijmo-checkbox');
                } else if ($element.is('select')) {
                    $elementUI = $element.closest('.wijmo-wijdropdown');
                }
                if ($elementUI.size() === 0) {
                    $elementUI = $element;
                }
                var $div = $('<div></div>').css({
                            position: 'absolute',
                            width: $elementUI.outerWidth() + 'px',
                            height: $elementUI.outerHeight() + 'px'
                        })
                        .insertAfter($elementUI)
                        .click(function() {
                            if ($element.is(':disabled')) {
                                dialog.call($element, function() {
                                    if ($element !== $elementUI) {
                                        if ($element.is(':text')) {
                                            $element.wijtextbox('option', 'disabled', false);
                                        } else if ($element.is(':radio')) {
                                            $element.wijradio('option', 'disabled', false);
                                        } else if ($element.is(':checkbox')) {
                                            $element.wijcheckbox('option', 'disabled', false);
                                        } else if ($element.is('select')) {
                                            $element.wijdropdown('option', 'disabled', false);
                                        }
                                    } else {
                                        $element.attr('disabled', false);
                                    }
                                    $div.detach();
                                });
                            }
                        })
                        .position({
                            my: 'top left',
                            at: 'top left',
                            collision: 'none',
                            of: $elementUI
                        });

            });

        });
    });
</script>
