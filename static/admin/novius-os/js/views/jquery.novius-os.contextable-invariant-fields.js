/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-contextable-invariant-fields',
    ['jquery-nos'],
    function($) {
        "use strict";

        $.fn.extend({
            nosContextableinvariantFields : function(params) {
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
                                    .text(params.texts.popin_content)
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

                    $container.find('[context_invariant_field]').each(function() {
                            var $element = $(this);
                            var $div = $('<div></div>').css({
                                        position: 'absolute',
                                        width: $element.outerWidth() + 'px',
                                        height: $element.outerHeight() + 'px'
                                    })
                                    .insertAfter($element)
                                    .click(function() {
                                        if ($element.is(':disabled')) {
                                            dialog.call($element, function() {
                                                $element.attr('disabled', false);
                                                $div.detach();
                                            });
                                        }
                                    })
                                    .position({
                                        my: 'top left',
                                        at: 'top left',
                                        collision: 'none',
                                        of: $element
                                    });
                    });
                });
            }
        });

        return $;
    });
