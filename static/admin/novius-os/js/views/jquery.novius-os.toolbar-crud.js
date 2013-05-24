/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-toolbar-crud',
    ['jquery-nos'],
    function($) {
        "use strict";

        $.fn.extend({
            nosToolbarCrud : function(params) {
                params = params || {
                    actions: [],
                    isNew: false,
                    saveField: '',
                    model: '',
                    itemId: 0,
                    urlActions: '',
                    dataset: {},
                    ajaxData: {}
                };
                return this.each(function() {
                    var $container = $(this),
                        $toolbar = $container.nosToolbar('create'),
                        $buttons = [],
                        addButtons = function(actions) {
                            $.each(actions, function() {
                                var element = this,
                                    openShare = false,
                                    $element;

                                if (element.action && element.action.action === 'share') {
                                    var action = $.extend(true, {}, element.action);
                                    delete element.action;
                                    element.bind = element.bind || {};
                                    element.bind.click = function() {
                                        var $share = $toolbar.nextAll('.nos-datacatchers');

                                        $element.hover(function() {
                                            if (openShare) {
                                                $element.addClass('ui-state-active');
                                            }
                                        });
                                        var open_close = function(state) {
                                            $share[state ? 'show' : 'hide']();
                                            $toolbar.find('.ui-button').not($element).each(function() {
                                                $(this).button(state ? 'disable' : 'enable');
                                            });

                                            $element.blur()[state ? 'addClass' : 'removeClass']('ui-state-active');
                                            openShare = state;

                                        };

                                        if ($share.size()) {
                                            if ($share !== 'load') {
                                                open_close(!openShare);
                                            }
                                        } else {
                                            $share = 'load';
                                            $.ajax({
                                                url : 'admin/nos/datacatcher/form',
                                                data : $.nosDataReplace(action.data, params.dataset),
                                                success : function(data) {
                                                    $share = $(data).insertAfter($container)
                                                        .bind('close', function() {
                                                            open_close(false);
                                                        })
                                                        .addClass('fill-parent nos-fixed-content')
                                                        .css({
                                                            top : $container.css('top'),
                                                            bottom : $container.css('bottom')
                                                        });
                                                    open_close(true);
                                                }
                                            });
                                        }
                                    }
                                }

                                $element = $container.nosToolbar('add', $.nosUIElement(element, params.dataset), true)
                                    .nosOnShow('show');

                                $buttons.push($element);
                            });
                        };


                    $container.add($container.find('form')).filter('form').bind('ajax_success', function(e, data) {
                        if (data.dataset && data.dataset._model == params.dataset._model && data.dataset._id == params.dataset._id) {
                            params.dataset = data.dataset;
                        }
                    });

                    $container.nosToolbar('add', params.saveField)
                        .filter(':submit')
                        .click(function() {
                            var $form;
                            if ($container.is('form')) {
                                $form = $container;
                            } else {
                                $form = $container.find('form:visible');
                            }
                            $form.submit();
                        });

                    if (!params.isNew) {
                        $container.nosListenEvent({
                            name: params.model
                        }, function(event) {
                            if (!$.isArray(event.id)) {
                                event.id = [event.id];
                            }
                            if ($.inArray(params.itemId, event.id) !== -1 && event.action === 'delete') {
                                return false;
                            }
                            $container.nosAjax({
                                url: params.urlActions,
                                type: 'GET',
                                data: params.ajaxData,
                                success: function(json) {
                                    $.each($buttons, function() {
                                        $(this).remove();
                                    });
                                    $buttons = [];
                                    addButtons(json);
                                }
                            });
                        });
                    }

                    addButtons(params.actions);
                });
            }
        });

        return $;
    });
