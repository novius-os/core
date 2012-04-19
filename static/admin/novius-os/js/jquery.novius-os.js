/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos', [
    'jquery',
    'log',
    'order!jquery-ui',
    'order!wijmo-open',
    'order!wijmo-complete'
], function($) {
    "use strict";
    var undefined = void(0);

    $.nos = {
        dispatchEvent : function(event) {
            if (window.parent != window && window.parent.$nos) {
                return window.parent.$nos.nos.dispatchEvent(event);
            }
            if ($.nos.$noviusos) {
                $.nos.$noviusos.ostabs('dispatchEvent', event);
            }
        },

        dataStore : {},
        data : function (id, json) {
            if (window.parent != window && window.parent.$nos) {
                return window.parent.$nos.nos.data(id, json);
            }

            if (id) {
                if (json) {
                    this.dataStore[id] = json;
                }
                return this.dataStore[id];
            }
        },

        dialog : function(options) {

            if (options.destroyOnClose) {
                var oldClose = options.close;
                options.close = function() {
                    if ($.isFunction(oldClose)) {
                        oldClose.apply(this, arguments);
                    }
                    $(this).wijdialog('destroy')
                        .remove();
                };
            }

            // Default options
            options = $.extend(true, {}, {
                width: window.innerWidth - 200,
                height: window.innerHeight - 100,
                modal: true,
                captionButtons: {
                    pin: {visible: false},
                    refresh: {visible: options.contentUrl != null && !options.ajax},
                    toggle: {visible: false},
                    minimize: {visible: false},
                    maximize: {visible: false}
                }
            }, options);

            var where   = $.nos.$noviusos.ostabs ? $.nos.$noviusos.ostabs('current').panel : $('body');
            var $dialog = $(document.createElement('div')).appendTo(where);

            $.nos.data('dialog', $dialog);

            if (typeof options['content'] != 'undefined') {
                $dialog.append(options.content);
            }

            var proceed = true;
            if (options.ajax) {
                var contentUrl = options.contentUrl;
                delete options.contentUrl;
                options.autoOpen = false;
                $dialog.wijdialog(options);

                // Request the remote document
                $.ajax({
                    url: contentUrl,
                    type: 'GET',
                    dataType: "html",
                    // Complete callback (responseText is used internally)
                    complete: function( jqXHR, status, responseText ) {
                        // Store the response as specified by the jqXHR object
                        responseText = jqXHR.responseText;
                        // If successful, inject the HTML into all the matched elements
                        if ( jqXHR.isResolved() ) {
                            // #4825: Get the actual response in case
                            // a dataFilter is present in ajaxSettings
                            jqXHR.done(function( r ) {
                                responseText = r;
                            });



                            try {
                                var json = $.parseJSON(responseText);
                                // If the dialog ajax URL returns a valid JSON string, don't show the dialog
                                proceed = false;
                            } catch (e) {}

                            if (proceed) {
                                $dialog.wijdialog('open');
                            } else {
                                $dialog.empty();
                                $dialog.wijdialog('destroy');
                                $dialog.remove();
                                $.nos.ajax.success(json);
                            }

                            // inject the full result
                            $dialog.html( responseText );
                        }
                    }
                });
            } else {
                $dialog.wijdialog(options);
            }
            if (proceed) {
                if ($.isFunction(options['onLoad'])) {
                    options['onLoad']();
                }
                $dialog.bind('wijdialogclose', function(event, ui) {
                    $dialog.closest('.ui-dialog').hide().appendTo(where);
                });
            }

            return $dialog;
        },

        notify : function( options, type ) {

            if (window.parent != window && window.parent.$nos) {
                return window.parent.$nos.nos.notify( options, type );
            }
            if ( !$.isPlainObject( options ) ) {
                options = {title : options};
            }
            if ( type !== undefined ) {
                $.extend(options, $.isPlainObject( type ) ? type : {type : type} );
            }
            if ( $.isPlainObject( options ) ) {
                require([
                    'link!static/novius-os/admin/vendor/jquery/pnotify/jquery.pnotify.default.css',
                    'static/novius-os/admin/vendor/jquery/pnotify/jquery.pnotify.min'
                ], function() {
                    var o = {
                        pnotify_history : false,
                        pnotify_addclass : 'nos-notification'
                    };
                    $.each( options, function(key, val) {
                        if ( key.substr( 0, 8 ) !== 'pnotify_' ) {
                            key = 'pnotify_' + key;
                        }
                        o[key] = val;
                    } );
                    return $.pnotify( o );
                });
            }
            return false;
        },

        /** Execute an ajax request
         *
         * @param url
         * @param data
         */
        ajax : {
            request : function(options) {
                options = $.extend({
                    dataType : 'json',
                    type     : 'POST',
                    data     : {}
                }, options);

                // Internal callbacks for JSON dataType
                if (options.dataType == 'json') {
                    if ($.isFunction(options.success)) {
                        var old_success = options.success;
                        options.success = function(json) {
                            json.user_success = old_success;
                            $.nos.ajax.success(json);
                        }
                    } else {
                        options.success = $.nos.ajax.success;
                    }

                    if ($.isFunction(options.error)) {
                        var old_error = options.error;
                        options.error = function(json) {
                            $.nos.ajax.error(json);
                            old_error.apply(this, arguments);
                        }
                    } else {
                        options.error = $.nos.ajax.error;
                    }
                }

                $.ajax(options);
            },
            success : function(json) {
                if (json.error) {
                    if ($.isArray(json.error)) {
                        $.each(json.error, function() {
                            $.nos.notify(this, 'error');
                        });
                    } else {
                        $.nos.notify(json.error, 'error');
                    }
                }
                if (json.notify) {
                    if ($.isArray(json.notify)) {
                        $.each(json.notify, function() {
                            $.nos.notify(this);
                        });
                    } else {
                        $.nos.notify(json.notify);
                    }
                }
                if (json.dispatchEvent) {
                    if ($.isArray(json.dispatchEvent)) {
                        $.each(json.dispatchEvent, function(i, event) {
                            $.nos.dispatchEvent(event);
                        });
                    } else {
                        $.nos.dispatchEvent(json.dispatchEvent);
                    }
                }
                // Call user callback
                if ($.isFunction(json.user_success)) {
                    json.user_success.apply(this, arguments);
                }

                // Close at the end!
                if (json.redirect) {
                    document.location = json.redirect;
                }
                if (json.closeTab) {
                    $.nos.tabs.close();
                }
                if (json.replaceTab) {
                    $.nos.tabs.replace(json.replaceTab);
                }
            },
            error: function(x, e) {
                // http://www.maheshchari.com/jquery-ajax-error-handling/
                if (x.status != 0) {
                    $.nos.notify('Connection error!', 'error');
                } else if (e == 'parsererror') {
                    $.nos.notify('Request seemed a success, but we could not read the answer.');
                } else if (e == 'timeout') {
                    $.nos.notify('Time out (server is busy?). Please try again.');
                }
            }
        },

        media : function(input, data) {

            var contentUrls = {
                'all'   : '/admin/nos/media/list',
                'image' : '/admin/nos/media/list?view=image_pick'
            };

            var dialog = null;

            var options = $.extend({
                title: input.attr('title') || 'File',
                allowDelete : true,
                choose: function(e) {
                    // Open the dialog to choose the file
                    if (dialog == null) {
                        dialog = $.nos.dialog({
                            contentUrl: contentUrls[data.mode],
                            ajax: true,
                            title: 'Choose a media file'
                        });
                        dialog.bind('select.media', function(e, item) {
                            input.inputFileThumb({
                                file: item.thumbnail
                            });
                            input.val(item.id);
                            dialog.wijdialog('close');
                        });
                    } else {
                        dialog.wijdialog('open');
                    }
                }
            }, data.inputFileThumb);

            require([
                'static/novius-os/admin/vendor/jquery/jquery-ui-input-file-thumb/js/jquery.input-file-thumb',
                'link!static/novius-os/admin/vendor/jquery/jquery-ui-input-file-thumb/css/jquery.input-file-thumb.css'
            ], function() {
                $(function() {
                    input.inputFileThumb(options);
                });
            });
        },

        openTabOrDialog : function(context, tab, dialogOptions) {
            var dialog = $(context).closest('.ui-dialog-content').size();
            if (dialog) {
                dialogOptions = dialogOptions || {};
                $.nos.dialog($.extend({
                    contentUrl: tab.url,
                    ajax : !tab.iframe,
                    title: tab.label
                }, dialogOptions));
            } else {
                $.nos.tabs.add(tab);
            }
        },

        form : {
            ajax : function(context) {
                if (!context) {
                    return;
                }
                var $container = $(context);
                if (!$container.is('form')) {
                    $container = $container.find('form');
                }
                $.nos.ui.validate($container, {});
            }
        },

        ui : {
            form : function(context) {
                context = context || 'body';
                $(function() {
                    var $container = $(context);
                    $container.find(":input[type='text'],:input[type='password'],:input[type='email'],textarea").wijtextbox();
                    $container.find(":input[type='submit'],button").each(function() {
                        var options = {};
                        var icon = $(this).data('icon');
                        if (icon) {
                             options.icons = {
                                 primary: 'ui-icon-' + icon
                             }
                        }
                        $(this).button(options);
                    });
                    $container.find("select").filter(':not(.notransform)').wijdropdown();
                    $container.find(":input[type=checkbox]").wijcheckbox();
                    $container.find('.expander').each(function() {
                        var $this = $(this);
                        $this.wijexpander($.extend({expanded: true}, $this.data('wijexpander-options')));
                    });
                    $container.find('.accordion').wijaccordion({
                        header: "h3",
                        selectedIndexChanged : function(e, args) {
                            $.nos.ui.initOnShow.show($(e.target).find('.ui-accordion-content').eq(args.newIndex));
                        }
                    });
                });
            },

            initOnShow : {
                init : function($el, init) {
                    if (!$.isFunction(init)) {
                        return;
                    }
                    if ($el.is(':visible')) {
                        init();
                    } else {
                        $el.addClass('nos-init-on-show')
                            .data('nos-init-on-show', init);
                    }
                },

                show : function($container) {
                    $container.find('.nos-init-on-show:visible').each(function() {
                        var $el = $(this),
                            init = $el.data('nos-init-on-show');

                        $el.removeClass('nos-init-on-show');
                        init();
                    });
                }
            },

            validate : function(context, params) {
                var submitForm = function(form) {
                    require(['jquery-form'], function() {
                        $(form).ajaxSubmit({
                            dataType: 'json',
                            success: function(json) {
                                $.nos.ajax.success(json);
                                $(form).triggerHandler('ajax_success', [json]);
                            },
                            error: function() {
                                $.nos.notify('An error occured', 'error');
                            }
                        });
                    });
                }
                $(function() {
                    if (!params || $.isEmptyObject(params)) {
                        $(context).submit(function(e) {
                            submitForm(context);
                            e.preventDefault();
                        });
                    } else {
                        require(['jquery-validate'], function() {
                            $(context).validate($.extend({}, params, {
                                errorClass : 'ui-state-error',
                                success : true,
                                ignore: 'input[type=hidden]',
                                submitHandler: submitForm
                            }));
                        });
                    }
                });
            }
        },

        saveUserConfiguration: function(key, configuration) {
            this.ajax.request({
                url: '/admin/nos/noviusos/save_user_configuration',
                data: {
                    key: key,
                    configuration: configuration
                }
            });
        }
    };
    window.$nos = $;

    return $;
});
