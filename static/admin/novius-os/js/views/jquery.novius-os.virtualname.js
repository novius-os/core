/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-virtualname',
    ['jquery-nos'],
    function($) {
        "use strict";

        /**
         * Throttle request helper
         *
         * @param updateThreshold
         * @constructor
         */
        function ThrottleRequest(updateThreshold) {
            var running, queuedRequest, lastTime;
            if (typeof updateThreshold !== 'number') {
                updateThreshold = 1000;
            }
            var throttle = function(request) {
                running = true;
                var doneCallback = function triggerRequestEnd() {
                    running = false;
                    lastTime = +new Date;
                    // Executes the next request with a delay
                    if (queuedRequest) {
                        queuedRequest();
                        queuedRequest = null;
                    }
                };
                if (lastTime) {
                    var diff = (+new Date) - lastTime;
                    if (diff < updateThreshold) {
                        setTimeout(function () {
                            request(doneCallback);
                        }, updateThreshold - diff);
                        return;
                    }
                }
                request(doneCallback);
            };

            /**
             * Runs a throttled request
             *
             * @param request
             */
            this.request = function(request) {
                if (running) {
                    queuedRequest = function() { throttle(request); };
                } else {
                    throttle(request);
                }
            };
        }

        /**
         * Virtual Name module
         */
        $.fn.extend({
            nosVirtualName : function(options, config) {
                var lastValue;
                config = typeof config === 'object' ? config : {};

                // Updates the virtual name (debounced)

                return this.each(function() {

                    var throttle = new ThrottleRequest(800);

                    var $virtual_name = $(this).bind('context_common_field', function() {
                            var $div,
                                $el = $(this),
                                click = $el.data('click_context_common_field');

                            $el.data('click_context_common_field', function() {
                                click();
                                $use_title_checkbox.prop('disabled', false);
                            });
                            $use_title_checkbox.prop('disabled', true);
                            $div = $('<div class="js_context_common_field"></div>')
                                .insertAfter($use_title_checkbox)
                                .click(function() {
                                    var dialog = $el.data('dialog_context_common_field');
                                    if ($el.is(':disabled')) {
                                        dialog.call($el, function() {
                                            click();
                                            $use_title_checkbox.prop('disabled', false);
                                            $div.detach();
                                        });
                                    }
                                });
                            $use_title_checkbox.parent().on('mousemove', function() {
                                $div.css({
                                    position: 'absolute',
                                    width: $use_title_checkbox.outerWidth() + 'px',
                                    height: $use_title_checkbox.outerHeight() + 'px'
                                }).position({
                                    my: 'top left',
                                    at: 'top left',
                                    collision: 'none',
                                    of: $use_title_checkbox
                                });
                            }).trigger('mousemove');
                        }),
                        id = $virtual_name.attr('id'),
                        $use_title_checkbox = $('#' + id + '__use_title_checkbox'),
                        $title = $virtual_name.closest('form').find('input.ui-priority-primary');


                    var useTitle = $virtual_name.data('usetitle');

                    if (typeof useTitle !== 'undefined' && useTitle == 1) {
                        $use_title_checkbox.prop('checked', true);
                    }

                    $use_title_checkbox.change(function() {
                        if ($(this).is(':checked')) {
                            $virtual_name.attr('readonly', true).addClass('ui-state-disabled');
                            $title.triggerHandler('refresh');
                        } else {
                            $virtual_name.removeAttr('readonly').removeClass('ui-state-disabled');
                        }
                    }).triggerHandler('change');

                    lastValue = $title.val();
                    $title
                        .bind('change keyup', function() {
                            if ($use_title_checkbox.is(':checked')) {
                                if (lastValue !== $title.val()) {
                                    $title.triggerHandler('refresh');
                                }
                            }
                        })
                        .bind('refresh', function() {
                            refreshVirtualName($virtual_name);
                        });

                    /**
                     * Refresh the virtual name
                     *
                     * @param $virtual_name
                     */
                    function refreshVirtualName($virtual_name)
                    {
                        $virtual_name.addClass('regenerating');
                        requestVirtualName($virtual_name).done(function(data) {
                            if (data.error) {
                                console.log(data.error);
                            }
                            if (data.virtual_name) {
                                // Updates the virtual name with the new value
                                $virtual_name.val(data.virtual_name);
                                $virtual_name.removeClass('regenerating');
                                lastValue = $title.val();
                            }
                        });
                    }

                    /**
                     * Requests the server to generate the virtual name
                     *
                     * @param $virtual_name
                     */
                    function requestVirtualName($virtual_name) {
                        var url = config.controller_url+'/'+(config.item_id || '');

                        // Gets the form
                        var $form = $virtual_name.closest('form');

                        // Gets the form data
                        var data = $form.serialize();

                        // Builds the request params
                        var requestParams = {
                            url : url,
                            method : 'POST',
                            data : data
                        };

                        return $.Deferred(function(defer) {
                            throttle.request(function(done) {
                                $form.nosAjax(requestParams).then(defer.resolve, defer.reject)
                                    .always(function () {
                                        done();
                                    });
                            });
                        }).promise();
                    }
                });
            }
        });

        return $;
    });
