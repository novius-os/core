/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-context-common-fields',
    ['jquery-nos'],
    function($) {
        "use strict";

        $.fn.extend({
            nosContextCommonFields : function(params) {
                params = params || {
                    texts : {
                        popin_title: 'This field is common to all contexts/languages/sites',
                        popin_content: 'When you modify the value of this field, the change is also applied to the following contexts/languages/sites:',
                        popin_ok: 'OK, I understand',
                        popin_cancel: 'Cancel, I won\'t modify it'
                    }
                };
                return this.each(function() {
                    var $container = $(this),
                        dialog = function(click) {
                                var $div = $('<div><p></p><ul></ul></div>')
                                    .find('p')
                                    .html(params.texts.popin_content)
                                    .end(),
                                $ul = $div.find('ul'),
                                contexts = this.data('other-contexts');

                                $.each(contexts, function(i, context) {
                                    $('<li></li>').html(context)
                                        .appendTo($ul);
                                });

                                $container.nosDialog({
                                    title: params.texts.popin_title,
                                    content: $div,
                                    width: 500,
                                    height: 130 + contexts.length * 20,
                                    buttons: [
                                        {
                                            text:params.texts.popin_ok,
                                            click: function () {
                                                click();
                                                $(this).wijdialog("close");
                                            }
                                        },
                                        {
                                            text: params.texts.popin_cancel,
                                            click: function () {
                                                $(this).wijdialog("close");
                                            }
                                        }
                                    ]
                                });
                            };

                    $container.find('[context_common_field]').each(function() {
                        var $div,
                            $element = $(this)
                                .data('dialog_context_common_field', dialog)
                                .bind('context_common_field', function(e, click, $el) {
                                    var positioning = function() {
                                            $div.css({
                                                position: 'absolute',
                                                width: $el.outerWidth() + 'px',
                                                height: $el.outerHeight() + 'px'
                                            }).position({
                                                my: 'top left',
                                                at: 'top left',
                                                collision: 'none',
                                                of: $el
                                            });
                                        };
                                    if ($element.is(':checkbox') && $element.is(':checked')) {
                                        $('<input type="hidden" class="js_fake_checkbox_context_common_field" />')
                                            .attr({
                                                name: $element.attr('name'),
                                                value: $element.attr('value')
                                            })
                                            .insertBefore($element);
                                    }
                                    $element.data('click_context_common_field', function() {
                                        $element.prop('disabled', false);
                                        $element.removeAttr('disabled');
                                        if ($element.is(':checkbox')) {
                                            $element.prev('.js_fake_checkbox_context_common_field').remove();
                                        }
                                        if ($.isFunction(click)) {
                                            click();
                                        }
                                        $div.detach();
                                    });
                                    $el = $el || $element;
                                    $div = $('<div class="js_context_common_field"></div>').insertAfter($el)
                                        .click(function() {
                                            if ($element.prop('disabled') || $element.attr('disabled')) {
                                                dialog.call($element, function() {
                                                    var click = $element.data('click_context_common_field');
                                                    if ($.isFunction(click)) {
                                                        click();
                                                    }
                                                });
                                            }
                                        });

                                    if ($element === $el) {
                                        // Repositioning on mousemove of the parent of element
                                        // Mousemove on input disabled are not bind by browser
                                        $el.parent().on('mousemove', positioning).trigger('mousemove');
                                    } else {
                                        // InputFileThumb case, unbind mousemove on parent just positioning
                                        $el.parent().off('mousemove');
                                        positioning();
                                    }
                                });

                        $element.nosOnShow('one', function() {
                            $element.trigger('context_common_field');
                        });

                        $element.one('inputfilethumbenter', function() {
                            $element.trigger('context_common_field', [function() {
                                $element.inputFileThumb('option', 'disabled', false);
                            }, $element.parents('.ui-inputfilethumb')]);
                            return false;
                        });
                        $element.one('inputfilethumbinit', function() {
                            $element.inputFileThumb('option', 'disabled', true);
                            $div && $div.remove();
                        });

                    });
                });
            }
        });

        return $;
    });
