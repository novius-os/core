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
    var undefined = void(0),
        $nos = window.$nos = $.sub(),
        $noviusos = undefined,
        noviusos = function() {
                if ($noviusos === undefined) {
                    $noviusos = $nos('.nos-ostabs');
                }
                return $noviusos;
            },
        dialogEvent = {
            dialogOpened : [],
            dialogFocused : -1,
            open : function($dialog) {
                var self = this,
                    callbacks = $dialog.data('callbacks.nosdialog');
                self.dialogOpened.push($dialog[0]);
                if (!$.isPlainObject(callbacks)) {
                    $dialog.data('callbacks.nosdialog', {});
                }
            },
            focus : function($dialog) {
                var self = this,
                    callbacks = $dialog.data('callbacks.nosdialog'),
                    index = $.inArray($dialog[0], self.dialogOpened);

                if (index !== -1) {
                    self.dialogOpened.splice(index, 1);
                }
                self.dialogOpened.push($dialog[0]);
                self.dialogFocused = $dialog[0];

                if ($.isPlainObject(callbacks)) {
                    $.each(callbacks, function(i, event) {
                        self.fireDialogEvent($dialog, event);
                    });
                    $dialog.data('callbacks.nosdialog', {});
                }
            },
            close : function($dialog) {
                var self = this,
                    index = $.inArray($dialog[0], self.dialogOpened);

                if (index !== -1) {
                    self.dialogOpened.splice(index, 1);
                }
                if (index > 0) {
                    self.focus($(self.dialogOpened[index - 1]));
                }
            },
            fireDialogEvent : function($dialog, event) {
                var $iframe = $dialog.find('> iframe');

                if ($iframe.size()) {
                    if ($iframe[0].contentDocument.$) {
                        $iframe[0].contentDocument.$('body').trigger(event);
                    }
                } else {
                    // @todo Figure out why we need this try catch.
                    // Adding a media throws an TypeError exception : unknown method 'trigger' on DOMWindow
                    try {
                        $dialog.trigger(event);
                    } catch (e) {
                        log('fireDialogEvent error', e, event);
                    }
                }
            },
            dispatchEvent : function(event) {
                var self = this;

                $.each(self.dialogOpened, function() {
                    var $dialog = $(this);
                    if (this === self.dialogFocused) {
                        self.fireDialogEvent($dialog, event);
                    } else {
                        var callbacks = $dialog.data('callbacks.nosdialog');
                        if ($.isPlainObject(callbacks)) {
                            callbacks[event.type + (event.namespace ? '.' + event.namespace : '')] = event;
                        }
                    }
                });
            }

        };


    $nos.extend({
        dispatchEvent : function(event) {
            if (window.parent != window && window.parent.$nos) {
                return window.parent.$nos.dispatchEvent(event);
            }

            var $noviusos = noviusos();
            if (!$.isArray(event)) {
                event = [event];
            }
            $.each(event, function() {
                var e = this;
                if ( !(e instanceof jQuery.Event) ) {
                    e = $.Event(e);
                }

                $noviusos.ostabs('dispatchEvent', e);
                dialogEvent.dispatchEvent(e);
            });
            return $nos;
        },

        notify : function( options, type ) {
            if (window.parent != window && window.parent.$nos) {
                return window.parent.$nos.notify( options, type );
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
                    'static/novius-os/admin/vendor/jquery/pnotify/jquery.pnotify'
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
        }
    });

    $nos.fn.extend({
        xhr : function() {
            var args = Array.prototype.slice.call(arguments),
                method = 'request';
            if (args.length > 0 && $.inArray(args[0], ['request', 'success', 'error', 'saveUserConfig']) !== -1) {
                method = args.shift();
            }
            switch (method) {
                case 'request' :
                    var options = $.extend({
                                dataType : 'json',
                                type     : 'POST',
                                data     : {}
                            }, args[0] || {}),
                        old_success = options.success,
                        old_error = options.error,
                        self = this;

                    // Internal callbacks for JSON dataType
                    if (options.dataType == 'json') {
                        options.success = function(json) {
                            if ($.isFunction(old_success)) {
                                json.user_success = old_success;
                            }
                            self.xhr('success', json);
                        };

                        options.error = function(json) {
                            self.xhr('error', json);
                            if ($.isFunction(old_error)) {
                                old_error.apply(this, args);
                            }
                        };
                    }

                    return $.ajax(options);
                    break;

                case 'success' :
                    var json = args[0];
                    if (json.error) {
                        if ($.isArray(json.error)) {
                            $.each(json.error, function() {
                                $nos.notify(this, 'error');
                            });
                        } else {
                            $nos.notify(json.error, 'error');
                        }
                    }
                    if (json.notify) {
                        if ($.isArray(json.notify)) {
                            $.each(json.notify, function() {
                                $nos.notify(this);
                            });
                        } else {
                            $nos.notify(json.notify);
                        }
                    }
                    // Call user callback
                    if ($.isFunction(json.user_success)) {
                        json.user_success.apply(this, args);
                    }

                    var dialog = this.closest('.ui-dialog-content').size();
                    if (dialog) {
                        if (json.closeTab) {
                            this.tab('close');
                        }
                    } else {
                        if (json.redirect) {
                            document.location.href = json.redirect;
                        }
                        if (json.replaceTab) {
                            this.tab('update', {
                                url : json.replaceTab,
                                reload : true
                            });
                        }
                    }
                    if (json.dispatchEvent) {
                        if ($.isArray(json.dispatchEvent)) {
                            $.each(json.dispatchEvent, function(i, event) {
                                $nos.dispatchEvent(event);
                            });
                        } else {
                            $nos.dispatchEvent(json.dispatchEvent);
                        }
                    }
                    break;

                case 'error' :
                    var x = args[0],
                        e = args[1];
                    // http://www.maheshchari.com/jquery-ajax-error-handling/
                    if (x.status != 0) {
                        $nos.notify('Connection error!', 'error');
                    } else if (e == 'parsererror') {
                        $nos.notify('Request seemed a success, but we could not read the answer.');
                    } else if (e == 'timeout') {
                        $nos.notify('Time out (server is busy?). Please try again.');
                    }
                    break;

                case 'saveUserConfig' :
                    var key = args[0],
                        configuration = args[1];
                    this.xhr({
                        url: '/admin/nos/noviusos/save_user_configuration',
                        data: {
                            key: key,
                            configuration: configuration
                        }
                    });
                    break;
            }
            return this;
        },

        media : function(data) {

            data = data || {};
            var contentUrls = {
                    'all'   : '/admin/nos/media/list',
                    'image' : '/admin/nos/media/list?view=image_pick'
                },
                $input = this;

            var $dialog = null;

            var options = $.extend({
                title: $input.attr('title') || 'File',
                allowDelete : true,
                choose: function() {
                    // Open the dialog to choose the file
                    if ($dialog === null) {
                        $dialog = $input.dialog({
                            destroyOnClose : false,
                            contentUrl: contentUrls[data.mode],
                            ajax: true,
                            title: 'Choose a media file'
                        });
                        $dialog.bind('select.media', function(e, item) {
                            $input.inputFileThumb({
                                file: item.thumbnail
                            });
                            $input.val(item.id);
                            $dialog.dialog('close');
                        });
                    } else {
                        $dialog.dialog('open');
                    }
                }
            }, data.inputFileThumb || {});

            require([
                'static/novius-os/admin/vendor/jquery/jquery-ui-input-file-thumb/js/jquery.input-file-thumb',
                'link!static/novius-os/admin/vendor/jquery/jquery-ui-input-file-thumb/css/jquery.input-file-thumb.css'
            ], function() {
                $(function() {
                    $input.inputFileThumb(options);
                });
            });
        },

        form : function() {
            var args = Array.prototype.slice.call(arguments),
                method = 'ui',
                $context = this;
            if (args.length > 0 && $.inArray(args[0], ['ui', 'validate', 'ajax']) !== -1) {
                method = args.shift();
            }
            switch (method) {
                case 'ui' :
                    $context.find(":input[type='text'],:input[type='password'],:input[type='email'],textarea").wijtextbox();
                    $context.find(":input[type='submit'],button").each(function() {
                            var options = {};
                            var icon = $(this).data('icon');
                            if (icon) {
                                options.icons = {
                                    primary: 'ui-icon-' + icon
                                }
                            }
                            $(this).button(options);
                        });
                    $context.find("select").filter(':not(.notransform)').nos().onShow('one', function() {
                            $(this).wijdropdown();
                        });
                    $context.find(":input[type=checkbox]").nos().onShow('one', function() {
                        $(this).wijcheckbox();
                    });
                    $context.find('.expander').each(function() {
                            var $this = $(this);
                            $this.wijexpander($.extend({expanded: true}, $this.data('wijexpander-options')));
                        });
                    $context.find('.accordion').wijaccordion({
                            header: "h3",
                            selectedIndexChanged : function(e, args) {
                                $(e.target).find('.ui-accordion-content').eq(args.newIndex).nos().onShow();
                            }
                        });
                        // @todo Check usefulness of this
                        //.find('.ui-accordion-content:first').onShow();
                    break;

                case 'validate' :
                    var params = args[0] || {};
                    if (!$context.is('form')) {
                        $context = $context.find('form');
                    }
                    require(['jquery-validate'], function() {
                        $context.validate($.extend({}, params, {
                            errorClass : 'ui-state-error',
                            success : true,
                            ignore: 'input[type=hidden]'
                        }));
                    });
                    break;

                case 'ajax' :
                    if (!$context.is('form')) {
                        $context = $context.find('form');
                    }
                    require(['jquery-form'], function() {
                        $context.ajaxForm({
                            dataType: 'json',
                            success: function(json) {
                                $context.xhr('success', json)
                                    .triggerHandler('ajax_success', [json]);
                            },
                            error: function() {
                                $nos.notify('An error occured', 'error');
                            }
                        });
                    });
                    break;
            }
            return this;
        },

        onShow : function() {
            var args = Array.prototype.slice.call(arguments),
                method = 'show';
            if (args.length > 0 && $.inArray(args[0], ['one', 'bind', 'show']) !== -1) {
                method = args.shift();
            }
            switch (method) {
                case 'one' :
                case 'bind' :
                    var callback = args[0];
                    if (!$.isFunction(callback)) {
                        return;
                    }
                    this.each(function() {
                        var $el = $nos(this),
                            nb_bind = $el.data('nos-on-show') || 0;

                        $el.addClass('nos-on-show')
                            .data('nos-on-show', nb_bind + (method === 'bind' ? 1 : 0))
                            [method]('nos-on-show', callback);

                        if ($el.is(':visible')) {
                            $el.onShow();
                        }
                    });
                    break;

                case 'show' :
                    // If the element has the class .nos-on-show, we display it and trigger the nos-on-show events
                    // If the element does not have the class .nos-on-show, we search for children and triggers the onShow()
                    // Either ways, if the element is hidden, we do nothing, it'll be triggered by a parent when it's shown

                    // Show the element
                    this.not('.nos-on-show-exec').addClass('nos-on-show-exec').each(function() {
                        var $el = $nos(this),
                            nb_bind = $el.data('nos-on-show') || 0;

                        if ($el.is('.nos-on-show')) {
                            $el.css('display', 'block');
                        }

                        // Cancel if it's not visible
                        if (!$el.is(':visible')) {
                            return true;
                        }

                        // Trigger the events
                        if ($el.is('.nos-on-show')) {
                            if (!nb_bind) {
                                $el.removeClass('nos-on-show');
                            }
                            $el.trigger('nos-on-show');
                        }

                        // Cascade on the children
                        $el.find('.nos-on-show').not('.nos-on-show-exec').onShow();
                    }).removeClass('nos-on-show-exec');
                    break;
            }
            return this;
        },

        dialog : function() {
            var args = Array.prototype.slice.call(arguments),
                method = 'open';
            if (args.length > 0 && $.inArray(args[0], ['open', 'close']) !== -1) {
                method = args.shift();
            }
            switch (method) {
                case 'open' :
                    if (this.is('.ui-dialog')) {
                        this.wijdialog('open');
                        return this;
                    }

                    var arg = args[0] || {},
                        options = $.extend(true, {}, {
                            destroyOnClose : true,
                            width: window.innerWidth - 200,
                            height: window.innerHeight - 100,
                            modal: true,
                            captionButtons: {
                                pin: {visible: false},
                                refresh: {visible: arg.contentUrl != null && !arg.ajax},
                                toggle: {visible: false},
                                minimize: {visible: false},
                                maximize: {visible: false}
                            }
                        }, arg),
                        oldCallbacks = {
                            open : options.open,
                            close : options.close,
                            focus : options.focus
                        },
                        $container = this.closest('.nos-dispatcher, body'),
                        self = this,
                        $dialog = $('<div></div>').addClass('nos-dispatcher')
                            .appendTo($container);

                    $.extend(options, {
                            close : function(e, ui) {
                                dialogEvent.close($dialog);
                                if ($.isFunction(oldCallbacks.close)) {
                                    oldCallbacks.close.apply($dialog, arguments);
                                }
                                if (options.destroyOnClose) {
                                    $dialog.wijdialog('destroy')
                                        .remove();
                                } else {
                                    $dialog.closest('.ui-dialog').hide().appendTo($container);
                                }
                            },
                            focus : function(e, ui) {
                                dialogEvent.focus($dialog);
                                if ($.isFunction(oldCallbacks.focus)) {
                                    oldCallbacks.focus.apply($dialog, arguments);
                                }
                            },
                            open : function(e, ui) {
                                dialogEvent.open($dialog);
                                if ($.isFunction(oldCallbacks.open)) {
                                    oldCallbacks.open.apply($dialog, arguments);
                                }
                                if (!options.destroyOnClose) {
                                    $dialog.closest('.ui-dialog').appendTo('body');
                                }
                            }
                        });

                    if (options['content'] !== undefined) {
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
                                        $dialog.wijdialog('open')
                                            .html( responseText );
                                    } else {
                                        $dialog.empty()
                                            .wijdialog('destroy')
                                            .remove();
                                        self.xhr('success', json);
                                    }
                                }
                            }
                        });
                    } else {
                        $dialog.wijdialog(options);
                    }
                    if (proceed && $.isFunction(options.onLoad)) {
                        options.onLoad();
                    }

                    return $dialog;
                    break;

                case 'close' :
                    this.closest(':wijmo-wijdialog')
                        .wijdialog('close');
                    break;
            }
            return this;
        },

        listenEvent : function(event, callback) {
            this.closest('.nos-dispatcher, body').on(event, callback);
        },

        tab : function() {
            var args = Array.prototype.slice.call(arguments),
                method = 'open',
                getIndex = function(context) {
                        if (window.parent != window && window.parent.$nos) {
                            return window.parent.$nos(window.frameElement).data('nos-ostabs-index');
                        }
                        var $panel = $(context).parents('.nos-ostabs-panel-content');
                        if ($panel.size()) {
                            return $panel.data('nos-ostabs-index');
                        }
                        return false;
                    },
                self = this;
            if (args.length > 0 && $.inArray(args[0], ['open', 'close', 'add', 'update', 'init']) !== -1) {
                method = args.shift();
            }

            switch (method) {
                case 'open' :
                    (function() {
                        var tab = args[0] || {},
                            dialogOptions = args[1] || {},
                            dialog = self.closest('.ui-dialog-content').size();
                        if (dialog) {
                            self.dialog($.extend({
                                contentUrl: tab.url,
                                ajax : !tab.iframe,
                                title: tab.label
                            }, dialogOptions));
                        } else if (window.parent != window && window.parent.$nos) {
                            window.parent.$nos(window.frameElement).tab('open', tab, dialogOptions);
                        } else if (noviusos().length) {
                            var tabs = noviusos().ostabs('tabs'),
                                sel = false;
                            $.each(tabs, function(i, t) {
                                if (t.url === tab.url) {
                                    sel = i;
                                    return false;
                                }
                            });
                            if (sel !== false) {
                                return noviusos().ostabs('select', sel + 4); // Add 4 because appstab and tray are before and not return by tabs
                            } else {
                                self.tab('add', tab);
                            }
                        } else if (tab.url) {
                            window.open(tab.url);
                        }
                    })();
                    break;

                case 'add' :
                    (function() {
                        var tab = args[0],
                            place = args[1] || 'end';
                        if (window.parent != window && window.parent.$nos) {
                            window.parent.$nos(window.frameElement).tab('add', tab, place);
                        } else {
                            var index;
                            if ($.inArray(place, ['before', 'after']) !== -1) {
                                index = getIndex(self) + (place === 'before' ? -1 : 1);
                            }
                            if (noviusos().length) {
                                index = noviusos().ostabs('add', tab, index);
                                noviusos().ostabs('select', index);
                            } else if (tab.url) {
                                window.open(tab.url);
                            }
                        }
                    })();
                    break;

                case 'close' :
                    (function() {
                        var $dialog = self.closest(':wijmo-wijdialog');
                        if ($dialog.size()) {
                            self.dialog('close');
                        } else if (window.parent != window && window.parent.$nos) {
                            window.parent.$nos(window.frameElement).tab('close');
                        } else {
                            var index = getIndex(self);
                            if (noviusos().length) {
                                noviusos().ostabs('remove', index);
                            }
                        }
                    })();
                    break;

                case 'update' :
                    (function() {
                        var tab = args[0];
                        if (window.parent != window && window.parent.$nos) {
                            window.parent.$nos(window.frameElement).tab('update', tab);
                        } else if (self.size() && !self.closest('.ui-dialog-content').size() && noviusos().length) {
                            var index = getIndex(self);
                            noviusos().ostabs('update', index, tab)
                                .xhr('saveUserConfig', 'tabs', {selected: noviusos().ostabs('option', 'selected'), tabs: noviusos().ostabs('tabs')});
                        }
                    })();
                    break;

                case 'init' :
                    (function() {
                        var configuration = args[0],
                            fct = function() {
                                if (noviusos().length) {
                                    noviusos().xhr('saveUserConfig', 'tabs', {selected: noviusos().ostabs('option', 'selected'), tabs: noviusos().ostabs('tabs')});
                                }
                            };
                        $noviusos = self;
                        $.extend(configuration, {
                            add: fct,
                            remove: fct,
                            select: fct,
                            show: fct,
                            drag: fct
                        });

                        if (configuration['user_configuration']['tabs']) {
                            if (!configuration['options']) {
                                configuration['options'] = {};
                            }
                            configuration['initTabs'] = configuration['user_configuration']['tabs']['tabs'];
                            configuration['selected'] = configuration['user_configuration']['tabs']['selected'];
                        }
                        $noviusos.ostabs(configuration);
                    })();
                    break;
            }
            return this;
        }
    });

    $.fn.nos = function() {
        return $nos(this);
    };

    return $nos;
});
