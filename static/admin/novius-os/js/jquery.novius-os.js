/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos',
    ['jquery', 'jquery-nos-validate', 'jquery-form', 'jquery-ui.button', 'wijmo.wijtextbox', 'wijmo.wijcheckbox', 'wijmo.wijradio', 'wijmo.wijdropdown', 'wijmo.wijexpander', 'wijmo.wijaccordion', 'wijmo.wijdialog'],
    function($) {
        "use strict";
        var undefined = void(0),
            $nos = window.$nos = $,
            $noviusos = undefined,
            noviusos = function() {
                    if ($noviusos === undefined) {
                        $noviusos = $('.nos-ostabs');
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


        $.extend({
            nosDispatchEvent : function(event) {
                if (window.parent != window && window.parent.$nos) {
                    return window.parent.$nos.nosDispatchEvent(event);
                }

                var $noviusos = noviusos(),
                    e = $.Event('noviusos', {noviusos : event});

                $noviusos.ostabs('dispatchEvent', e);
                dialogEvent.dispatchEvent(e);
                return $;
            },

            nosNotify : function( options, type ) {
                if (window.parent != window && window.parent.$nos) {
                    return window.parent.$nos.nosNotify( options, type );
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
                        return $.pnotify( $.extend({
                            styling: "jqueryui",
                            history : false,
                            addclass : 'nos-notification'
                        }, options) );
                    });
                }
                return false;
            },

            nosMediaVisualise : function(media) {
                if (!media.image) {
                    window.open(media.path);
                    return;
                }

                require([
                    'wijmo.wijlightbox'
                ], function() {

                    var image = new Image();
                    image.onerror = function() {
                        $.nosNotify('Image not found', 'error');
                    };
                    image.onload = function() {
                        // Create the lightbox
                        var lightbox = $('<div><a><img /></a></div>')
                            .find('a')
                            .attr({
                                href : media.path,
                                rel : 'wijlightbox'
                            })
                            .find('img')
                            .attr({
                                src : media.path,
                                title : media.title
                            })
                            .css({
                                width : 0,
                                height: 0
                            })
                            .end()
                            .end()
                            .css({
                                position : 'absolute',
                                dislplay : 'none',
                                width : 1,
                                height: 1
                            })
                            .css($(this).offset())
                            .appendTo(document.body)
                            .wijlightbox({
                                zIndex : 1201,
                                textPosition : 'outside',
                                player : 'img',
                                dialogButtons: 'fullsize',
                                modal : true,
                                open : function() {
                                    $('.wijmo-wijlightbox-overlay').css('z-index', 1200);
                                },
                                close : function(e) {
                                    lightbox.wijlightbox('destroy');
                                    lightbox.remove();
                                }
                            });

                        // Open it
                        lightbox.find('a').triggerHandler('click');
                    }
                    image.src = media.path;
                });
            }
        });

        $.fn.extend({
            nosAction : function(obj, data) {
                var params;
                data = data || {};
                try {
                    if ($.isFunction(obj)) {
                        obj($(this), data);
                    } else {
                        var placeholderReplace = function (obj, data) {
                            if ($.type(obj) === 'string') {
                                return obj.replace(/\[\:([\w]+)\]/g, function(str, p1, offset, s) {
                                        return data[p1];
                                    }).replace(/{{([\w]+)}}/g, function(str, p1, offset, s) {
                                        return data[p1];
                                    });
                            } else if ($.isPlainObject(obj)) {
                                $.each(obj, function(key, value) {
                                    obj[key] = placeholderReplace(value, data);
                                });
                            }
                            return obj;
                        };

                        switch(obj.action) {
                            case 'nosTabs' :
                                var args = [];
                                params = $.extend(true, {}, obj);

                                params.method && args.push(params.method);
                                args.push(placeholderReplace(params.tab, data));
                                params.dialog && args.push(params.dialog);
                                $.fn.nosTabs.apply($(this), args);
                                break;

                            case 'confirmationDialog' :
                                params = $.extend(true, {
                                    ajax : true,
                                    width: 500,
                                    height: 'auto',
                                    'class': 'nos-confirmation-dialog'
                                }, placeholderReplace(obj.dialog, data));
                                $(this).nosDialog(params);
                                break;

                            case 'nosAjax' :
                                params = $.extend({}, placeholderReplace(obj.params, data));
                                $(this).nosAjax(params);
                                break;

                            case 'nosMediaVisualise' :
                                $.nosMediaVisualise(data);
                                break;

                            case 'dialogPick' :
                                $(this).closest('.ui-dialog-content').trigger(obj.event, data);
                                break;

                            case 'window.open' :
                                var url = placeholderReplace(obj.url, data);
                                window.open(url);
                                break;
                        }
                    }
                } catch (e) {
                    log('nosAction', e)
                }
                return false;
            },

            nosAjax : function(params) {
                var options = $.extend({
                        dataType : 'json',
                        type     : 'POST',
                        data     : {}
                    }, params || {}),
                    old_success = options.success,
                    old_error = options.error,
                    self = this;

                // Internal callbacks for JSON dataType
                if (options.dataType == 'json') {
                    options.success = function(json) {
                        if ($.isFunction(old_success)) {
                            json.user_success = old_success;
                        }
                        self.nosAjaxSuccess(json);
                    };

                    options.error = function(json) {
                        self.nosAjaxError(json);
                        if ($.isFunction(old_error)) {
                            old_error.call(this, params);
                        }
                    };
                }

                return $.ajax(options);
            },

            nosAjaxSuccess : function(json) {
                if (json.error) {
                    if ($.isArray(json.error)) {
                        $.each(json.error, function() {
                            $.nosNotify(this, 'error');
                        });
                    } else {
                        $.nosNotify(json.error, 'error');
                    }
                }
                if (json.internal_server_error) {
                    var ise = json.internal_server_error;
                    var str = "An internal server error has been detected.\n\n";
                    str +=  ise.type + ' [ ' + ise.severity + ' ]: ' + ise.message + "\n";
                    str += ise.filepath + " @ line " + ise.error_line + "\n\n";
                    str += "Backtrace:\n";
                    for (var i = 0; i < ise.backtrace.length; i++) {
                        str += (i + 1) + ': ' + ise.backtrace[i].file + ' @ line ' + ise.backtrace[i].line + "\n";
                    }
                    if (console) {
                        console.error(str);
                    }
                }
                if (json.notify) {
                    if ($.isArray(json.notify)) {
                        $.each(json.notify, function() {
                            $.nosNotify(this);
                        });
                    } else {
                        $.nosNotify(json.notify);
                    }
                }
                // Call user callback
                if ($.isFunction(json.user_success)) {
                    json.user_success.call(this, json);
                }

                var dialog = this.closest('.ui-dialog-content').size();
                if (dialog) {
                    if (json.closeDialog) {
                        this.nosDialog('close');
                    }
                } else {
                    if (json.closeTab) {
                        this.nosTabs('close');
                    }
                    if (json.redirect) {
                        document.location.href = json.redirect;
                    }
                    if (json.replaceTab) {
                        this.nosTabs('update', {
                            url : json.replaceTab,
                            reload : true
                        });
                    }
                }
                if (json.dispatchEvent) {
                    var events = json.dispatchEvent;
                    if (!$.isArray(events)) {
                        events = [events];
                    }
                    $.each(events, function(i, event) {
                        $.nosDispatchEvent(event);
                    });
                }

                return this;
            },

            nosAjaxError : function(x, e) {
                // http://www.maheshchari.com/jquery-ajax-error-handling/
                if (x.status != 0) {
                    $.nosNotify('Connection error!', 'error');
                } else if (e == 'parsererror') {
                    $.nosNotify('Request seemed a success, but we could not read the answer.');
                } else if (e == 'timeout') {
                    $.nosNotify('Time out (server is busy?). Please try again.');
                }

                return this;
            },

            nosSaveUserConfig : function(key, configuration) {
                this.nosAjax({
                    url: '/admin/nos/noviusos/save_user_configuration',
                    data: {
                        key: key,
                        configuration: configuration
                    }
                });

                return this;
            },

            nosMedia : function(data) {

                data = data || {};
                var contentUrls = {
                        'all'   : '/admin/nos/media/appdesk',
                        'image' : '/admin/nos/media/appdesk?view=image_pick'
                    },
                    $input = this;

                var options = $.extend({
                    title: $input.attr('title') || 'File',
                    allowDelete : true,
                    choose: function() {
                        var $dialog = $input.nosDialog({
                                destroyOnClose : true,
                                contentUrl: contentUrls[data.mode],
                                ajax: true,
                                title: 'Choose a media file'
                            }).bind('select_media', function(e, item) {
                                $input.inputFileThumb({
                                    file: item.thumbnail
                                });
                                $input.val(item.id);
                                $dialog.nosDialog('close');
                            });
                    }
                }, data.inputFileThumb || {});

                require([
                    'static/novius-os/admin/vendor/jquery/jquery-ui-input-file-thumb/js/jquery.input-file-thumb',
                    'link!static/novius-os/admin/vendor/jquery/jquery-ui-input-file-thumb/css/jquery.input-file-thumb.css'
                ], function() {
                    $(function() {
                        $input.inputFileThumb(options);
                        $input.prependTo($input.parents('.ui-widget-content'));
                    });
                });

                return this;
            },

            nosFormUI : function() {
                var $context = this;

                $context.find(":input[type='text'],:input[type='password'],:input[type='email'],textarea").wijtextbox();
                $context.find(":input[type='submit'],button").each(function() {
                    var options = {},
                        data = $(this).data();
                    if (data.icon) {
                        options.icons = {
                            primary: 'ui-icon-' + data.icon
                        }
                    } else if (data.iconClasses) {
                        options.icons = {
                            primary: data.iconClasses
                        }
                    } else if (data.iconUrl) {
                        options.icons = {
                            primary: 'nos-icon16'
                        }
                    }
                    $(this).button(options);
                    if (data.iconUrl) {
                        $(this).find('span:first')
                            .css({
                                backgroundImage: 'url(' + data.iconUrl + ')'
                            });
                    }
                });
                $context.find("select").filter(':not(.notransform)').nosOnShow('one', function() {
                    $(this).wijdropdown();
                });
                $context.find(":input[type=checkbox]").nosOnShow('one', function() {
                    $(this).wijcheckbox();
                });
                $context.find(":input[type=radio]").filter(':not(.notransform)').nosOnShow('one', function() {
                    $(this).wijradio();
                });
                $context.find('.expander').each(function() {
                    var $this = $(this);
                    $this.wijexpander($.extend({expanded: true}, $this.data('wijexpander-options')));
                });
                $context.find('.accordion').wijaccordion({
                    header: "h3",
                    selectedIndexChanged : function(e, args) {
                        $(e.target).find('.ui-accordion-content').eq(args.newIndex).nosOnShow();
                    }
                });
                // @todo Check usefulness of this
                //.find('.ui-accordion-content:first').nosOnShow();

                return $context;
            },

            nosFormValidate : function(params) {
                var $context = this;

                params = params || {};
                if (!$context.is('form')) {
                    $context = $context.find('form');
                }
                require(['jquery-nos-validate'], function() {
                    $context.validate($.extend({}, params, {
                        errorClass : 'ui-state-error',
                        success : true,
                        ignore: 'input[type=hidden]'
                    }));
                });

                return this;
            },

            nosFormAjax : function() {
                var $context = this;

                if (!$context.is('form')) {
                    $context = $context.find('form');
                }
                require(['jquery-form'], function() {
                    $context.ajaxForm({
                        dataType: 'json',
                        success: function(json) {
                            $context.nosAjaxSuccess(json)
                                .triggerHandler('ajax_success', [json]);
                        },
                        error: function() {
                            $.nosNotify('An error occured', 'error');
                        }
                    });
                });

                return this;
            },

            nosOnShow : function() {
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
                            var $el = $(this),
                                nb_bind = $el.data('nos-on-show') || 0;

                            $el.addClass('nos-on-show')
                                .data('nos-on-show', nb_bind + (method === 'bind' ? 1 : 0))
                                [method]('nos-on-show', callback);

                            if ($el.is(':visible')) {
                                $el.nosOnShow();
                            }
                        });
                        break;

                    case 'show' :
                        // If the element has the class .nos-on-show, we display it and trigger the nos-on-show events
                        // If the element does not have the class .nos-on-show, we search for children and triggers the nosOnShow()
                        // Either ways, if the element is hidden, we do nothing, it'll be triggered by a parent when it's shown

                        // Show the element
                        this.not('.nos-on-show-exec').addClass('nos-on-show-exec').each(function() {
                            var $el = $(this),
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
                            $el.find('.nos-on-show').not('.nos-on-show-exec').nosOnShow();
                        }).removeClass('nos-on-show-exec');
                        break;
                }
                return this;
            },

            nosDialog : function() {
                var args = Array.prototype.slice.call(arguments),
                    method = 'open';
                if (args.length > 0 && $.inArray(args[0], ['open', 'close']) !== -1) {
                    method = args.shift();
                }
                switch (method) {
                    case 'open' :
                        if (this.is('.ui-dialog-content')) {
                            // If we call open, then we had options.destroyOnClose = false
                            this.closest('.ui-dialog').show().appendTo('body');
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
                                }
                            });

                        if (options['content'] !== undefined) {
                            $dialog.append(options.content);
                        }

                        if (options['class'] !== undefined) {
                            $dialog.addClass(options['class']);
                        }

                        var proceed = true;
                        if (options.ajax && options.contentUrl) {
                            var contentUrl = options.contentUrl;
                            delete options.contentUrl;
                            options.autoOpen = false;
                            $dialog.wijdialog(options);

                            // Request the remote document
                            $.ajax({
                                url: contentUrl,
                                type: 'GET',
                                dataType: "html",
                                data : options.ajaxData || {},
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
                                            $.isFunction(options['dialogRendered']) && options['dialogRendered']($dialog);
                                        } else {
                                            $dialog.empty()
                                                .wijdialog('destroy')
                                                .remove();
                                            self.nosAjaxSuccess(json);
                                        }
                                    }
                                }
                            });
                        } else {
                            $dialog.wijdialog(options);
                            $.isFunction(options['dialogRendered']) && options['dialogRendered']($dialog);
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

            nosListenEvent : function(json_match, callback) {
                var self = this;
                json_match = $.isArray(json_match) ? json_match : [json_match];

                this.closest('.nos-dispatcher, body').on('noviusos', function(e) {
                    var matched = false;
                    e.noviusos = e.noviusos || {};

                    // Check if one of match_obj matched with event
                    $.each(json_match, function(i, match_obj) {
                        var matched_obj = true;
                        $.each(match_obj, function(key, value) {
                            if (!$.isArray(e.noviusos[key]) && !$.isArray(value)) {
                                matched_obj = e.noviusos[key] === value;
                            } else if ($.isArray(e.noviusos[key]) && !$.isArray(value)) {
                                matched_obj = $.inArray(value, e.noviusos[key]) !== -1;
                            } else if (!$.isArray(e.noviusos[key]) && $.isArray(value)) {
                                matched_obj = $.inArray(e.noviusos[key], value) !== -1;
                            } else if ($.isArray(e.noviusos[key]) && $.isArray(value)) {
                                var matched_temp = false;
                                $.each(value, function(i, val) {
                                    matched_temp = $.inArray(val, e.noviusos[key]) !== -1;
                                    return !matched_temp;
                                });
                                matched_obj = matched_temp;
                            }
                            return matched_obj;
                        });
                        if (matched_obj) {
                            matched = true;
                            return false;
                        }
                    });
                    if (matched) {
                        callback(e.noviusos);
                    }
                });

                return self;
            },

            nosTabs : function() {
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
                if (args.length > 0 && $.inArray(args[0], ['open', 'close', 'add', 'update', 'init', 'current']) !== -1) {
                    method = args.shift();
                }

                switch (method) {
                    case 'open' :
                        (function() {
                            var tab = args[0] || {},
                                dialogOptions = args[1] || {},
                                dialog = self.closest('.ui-dialog-content').size();
                            if (dialog) {
                                self.nosDialog($.extend({
                                    contentUrl: tab.url,
                                    ajax : !tab.iframe,
                                    title: tab.label
                                }, dialogOptions));
                            } else if (window.parent != window && window.parent.$nos) {
                                window.parent.$nos(window.frameElement).nosTabs('open', tab, dialogOptions);
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
                                    self.nosTabs('add', tab);
                                }
                            } else if (tab.url) {
                                window.open(tab.url);
                            }
                        })();
                        break;

                    case 'add' :
                        (function() {
                            var tab = args[0],
                                dialogOptions = args[1] || {},
                                dialog = self.closest('.ui-dialog-content').size(),
                                place = args[2] || 'end';
                            if (dialog) {
                                self.nosDialog($.extend({
                                    contentUrl: tab.url,
                                    ajax : !tab.iframe,
                                    title: tab.label
                                }, dialogOptions));
                            } else if (window.parent != window && window.parent.$nos) {
                                window.parent.$nos(window.frameElement).nosTabs('add', tab, place);
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
                                self.nosDialog('close');
                            } else if (window.parent != window && window.parent.$nos) {
                                window.parent.$nos(window.frameElement).nosTabs('close');
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
                                window.parent.$nos(window.frameElement).nosTabs('update', tab);
                            } else if (self.size() && !self.closest('.ui-dialog-content').size() && noviusos().length) {
                                var index = getIndex(self);
                                noviusos().ostabs('update', index, tab);
                            }
                        })();
                        break;

                    case 'current' :
                        return (function() {
                            if (window.parent != window && window.parent.$nos) {
                                return window.parent.$nos(window.frameElement).tab('current');
                            } else {
                                if (noviusos().length) {
                                    return noviusos().ostabs('current');
                                }
                            }
                            return null;
                        })();
                        break;

                    case 'init' :
                        (function() {
                            var configuration = args[0],
                                saveTimeout = false,
                                fct = function() {
                                    if (noviusos().length) {
                                        if (saveTimeout) {
                                            clearTimeout(saveTimeout);
                                        }
                                        saveTimeout = setTimeout(function() {
                                            noviusos().nosSaveUserConfig('tabs', {selected: noviusos().ostabs('option', 'selected'), tabs: noviusos().ostabs('tabs')});
                                        }, 500);
                                    }
                                };
                            $noviusos = self;
                            $.extend(configuration, {
                                add: fct,
                                remove: fct,
                                select: fct,
                                show: fct,
                                drag: fct,
                                update: fct
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
            },

            nosToolbar : function() {
                var args = Array.prototype.slice.call(arguments),
                    method = 'add',
                    self = this;
                if (args.length > 0 && $.inArray(args[0], ['create', 'add']) !== -1) {
                    method = args.shift();
                }

                switch (method) {
                    case 'create' :
                        (function() {
                            $('<table><tr><td class="nos-toolbar-left"><table><tr class="nos-toolbar-left"></tr></table></td><td class="nos-toolbar-right"><table><tr class="nos-toolbar-right"></tr></table></td></tr></table>')
                                .addClass('nos-toolbar ui-widget-header')
                                .insertBefore(self);

                            self.addClass('nos-toolbar-target fill-parent nos-fixed-content')
                                .parent()
                                .addClass('nos-toolbar-parent');
                        })();
                        break;

                    case 'add' :
                        return (function() {
                            var tool = args[0],
                                right_side = args[1],
                                $target = self.closest('.nos-toolbar-target'),
                                $toolbar,
                                $tool;

                            if (!$target.size()) {
                                self.nosToolbar('create');
                                $target = self;
                            }
                            $toolbar = $target.prev();
                            $tool = $(tool);
                            $('<td></td>').append($tool)
                                .appendTo($toolbar.find('tr.nos-toolbar-' + (right_side ? 'right' : 'left')))
                                .nosFormUI();
                            $target.css({
                                top : $toolbar.outerHeight(),
                                bottom : 0,
                                height : 'auto'
                            });

                            return $tool;
                        })();
                        break;
                }
                return this;
            }
        });

        return $;
    });
