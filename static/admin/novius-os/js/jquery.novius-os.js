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
            login_popup_opened = false,
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
                        callbacks = $dialog.data('callbacks.nosdialog'),
                        index = $.inArray($dialog[0], self.dialogOpened);

                    // Check if dialog not already added, it can be by focus
                    if (index === -1) {
                        self.dialogOpened.push($dialog[0]);
                    }
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
            nosTexts: {
                chooseMediaFile : 'Choose a media file',
                chooseMediaImage : 'Choose a image',
                errorImageNotfind : 'We’re afraid we cannot find this image.'
            },

            nosContext : function(contexts) {
                contexts = $.extend({
                    locales: {},
                    sites: {},
                    contexts: {}
                }, contexts || {});

                return {
                    locales: contexts.locales,
                    sites: contexts.sites,
                    contexts: contexts.contexts,

                    label: function(labels) {
                        if ($.type(labels) === 'string') {
                            labels = {
                                defaultLabel: labels
                            };
                        }
                        labels = $.extend({
                            oneLocale: labels.allContexts,
                            oneSite: labels.allContexts
                        }, labels);

                        if (Object.keys(this.sites).length === 1) {
                            return labels.oneSite;
                        } else if (Object.keys(this.locales).length === 1) {
                            return labels.oneLocale;
                        }
                        return labels.defaultLabel;
                    },

                    siteLabel: function(site, options) {
                        options = $.extend({
                            // Don't remove quote, cause yui-compressor fail minified
                            'short': false
                        }, options || {});

                        if ($.type(site) !== 'object') {
                            site = this.site(site);
                        }
                        site = $.extend({
                            alias: site
                        }, site);

                        if (options['short']) {
                            return '<span title="' + site.title + '">' + site.alias  + '</span>';
                        } else {
                            return site.title;
                        }
                    },

                    localeLabel: function(locale, options) {
                        options = $.extend({
                            // Don't remove quote, cause yui-compressor fail minified
                            'short': false
                        }, options || {});

                        if ($.type(locale) !== 'object') {
                            locale = this.locale(locale);
                        }
                        locale = $.extend({
                            flag: locale.code.substr(0, 2).toLowerCase()
                        }, locale);

                        if (options['short']) {
                            return '<img src="static/novius-os/admin/novius-os/img/flags/' + locale.flag + '.png" title="' + locale.title + '" style="vertical-align:middle;" />';
                        } else {
                            return locale.title + ' <img src="static/novius-os/admin/novius-os/img/flags/' + locale.flag + '.png" title="' + locale.title + '" style="vertical-align:middle;" />';
                        }
                    },

                    contextLabel: function(context, options) {
                        var site = this.site(context),
                            locale = this.locale(context),
                            label;

                        options = $.extend({
                            // Don't remove quote, cause yui-compressor fail minified
                            'short': false,
                            template: '{site} {locale}'
                        }, options || {});

                        if (Object.keys(this.sites).length === 1) {
                            label = this.localeLabel(locale, options);
                        } else if (Object.keys(this.locales).length === 1) {
                            label = this.siteLabel(site, options);
                        } else {
                            label = options.template
                                .replace('{locale}', this.localeLabel(locale, {'short': true}))
                                .replace('{site}', this.siteLabel(site, options));
                        }

                        return label;
                    },

                    localeCode: function(context) {
                        var split = context.split('::', 2);
                        if (!split[1]) {
                            return context;
                        }
                        return split[1];
                    },

                    locale: function(context) {
                        var locale_code = this.localeCode(context);
                        if (!this.locales[locale_code]) {
                            return {
                                code: locale_code,
                                title: locale_code,
                                flag: locale_code.substr(0, 2).toLowerCase()
                            };
                        }
                        return $.extend({
                            code: locale_code
                        }, this.locales[locale_code]);
                    },

                    siteCode: function (context) {
                        var split = context.split('::', 2);
                        return split[0];
                    },

                    site: function (context) {
                        var site_code = this.siteCode(context);
                        if (!this.sites[site_code]) {
                            return {
                                code: site_code,
                                title: site_code,
                                alias: site_code
                            };
                        }
                        return $.extend({
                            code: site_code
                        }, this.sites[site_code]);
                    }
                };
            },

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

                var position = this.offset();
                position = {
                    top: position.top + this.height() / 2 - 16,
                    left: position.left + this.width() / 2
                }

                require([
                    'wijmo.wijlightbox'
                ], function() {
                    var image = new Image();
                    image.onerror = function() {
                        $.nosNotify($.nosTexts.errorImageNotfind, 'error');
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
                                width : 0,
                                height: 0
                            })
                            .css(position)
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
            },

            nosUIElement : function(element, data) {
                var date, id, iconClass, $element;

                element = $.extend({
                    type: 'button',
                    bind: {}
                }, element);

                if (element.action) {
                    element.bind['click'] = $.extend(true, {}, element.action);
                    delete element.action;
                }

                switch (element.type) {
                    case 'button' :
                        $element = $('<button></button>').data(element);
                        if (element.label) {
                            $element.html(element.label);
                        }
                        break;

                    case 'link' :
                        if (element.iconClasses) {
                            iconClass = element.iconClasses;
                        } else if (element.icon) {
                            iconClass = 'nos-inline-icon16 ui-icon ui-icon-' + element.icon;
                        }
                        $element = (iconClass ? '<span class="' + iconClass +'"></span> ' : '');
                        $element += '<span class="ui-button-text">' + element.label + '</span>';
                        $element = $('<a href="#"></a>')
                            .css({display : 'inline-block'})
                            .html($element);

                        if (element.red) {
                            $element.addClass('ui-state-error');
                        }
                        break;
                }
                if (element.disabled && element.disabled !== false) {
                    switch (element.type) {
                        case 'button' :
                            $element.attr('disabled', true);
                            break;

                        case 'link' :
                            $element.addClass('faded');
                            break;
                    }

                    if ($.type(element.disabled) === 'string') {
                        $element.attr('title', element.disabled);
                    }
                }

                if ($element) {
                    $.each(element.bind, function(event, action) {
                        $element.bind(event, function(e) {
                            e.preventDefault();
                            if (!element.disabled) {
                                $element.nosAction(action, data);
                            }
                        });
                    });

                    if (element.menu) {
                        date = new Date();
                        id = date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds() + "_" + date.getMilliseconds();
                        $element.attr('id', id)
                            .nosOnShow('one', function() {
                                var $ul = $('<ul></ul>');
                                $.each(element.menu.menus, function() {
                                    var menu = this,
                                        $a = $('<li><a></a></li>').data('action', menu.action)
                                            .appendTo($ul)
                                            .find('a');

                                    if (menu.content) {
                                        $a.append(menu.content);
                                    } else {
                                        if (menu.icon) {
                                            $('<span></span>').addClass('ui-icon wijmo-wijmenu-icon-left ui-icon-' + menu.icon)
                                                .appendTo($a);
                                        } else if (menu.iconClasses) {
                                            $('<span></span>').addClass('wijmo-wijmenu-icon-left ' + menu.iconClasses)
                                                .appendTo($a);
                                        } else if (menu.iconUrl) {
                                            $('<span></span>').addClass('wijmo-wijmenu-icon-left  nos-icon16')
                                                .css('backgroundImage', 'url(' + menu.iconUrl + ')')
                                                .appendTo($a);
                                        }
                                        if (menu.label) {
                                            $('<span></span>').addClass('wijmo-wijmenu-text')
                                                .html(menu.label)
                                                .appendTo($a);
                                        }
                                    }
                                });

                                $ul.insertAfter($element)
                                    .wijmenu($.extend(true, {
                                            orientation: 'vertical',
                                            animation: {
                                                animated:"slide",
                                                option: {
                                                    direction: "up"
                                                },
                                                duration: 50,
                                                easing: null
                                            },
                                            hideAnimation: {
                                                animated:"slide",
                                                option: {
                                                    direction: "up"
                                                },
                                                duration: 0,
                                                easing: null
                                            }
                                        },
                                        element.menu.options || {},
                                        {
                                            trigger: '#' + id,
                                            select: function(e, data) {
                                                var $li = $(data.item.element);
                                                $li.nosAction($li.data('action'));
                                            }
                                        }
                                    ));
                            });
                    }
                }

                return $element;
            },

            nosDataReplace : function (obj, data) {
                if ($.type(obj) === 'string') {
                    return obj.replace(/{{([\w]+)}}/g, function(str, p1, offset, s) {
                            return data[p1] || '';
                        }).replace(/{{urlencode:([\w]+)}}/g, function(str, p1, offset, s) {
                            return encodeURIComponent(data[p1] || '');
                        });
                } else if ($.isPlainObject(obj)) {
                    $.each(obj, function(key, value) {
                        obj[key] = $.nosDataReplace(value, data);
                    });
                }
                return obj;
            },

            /**
             * Removes &nbsp; entities
             */
            nosCleanupTranslation : function (text) {
                return text.replace(/&nbsp;/g, ' ');
            }
    });

        $.fn.extend({
            nosAction : function(obj, data) {
                var url, params;
                data = data || {};
                try {
                    if ($.isFunction(obj)) {
                        obj($(this), data);
                    } else {
                        switch(obj.action) {
                            case 'nosTabs' :
                                var args = [];
                                params = $.extend(true, {}, obj);

                                params.method && args.push(params.method);
                                args.push($.nosDataReplace(params.tab, data));
                                params.dialog && args.push(params.dialog);
                                $.fn.nosTabs.apply($(this), args);
                                break;

                            case 'confirmationDialog' :
                                params = $.extend(true, {
                                    ajax : true,
                                    width: 500,
                                    height: 'auto',
                                    'class': 'nos-confirmation-dialog'
                                }, $.nosDataReplace($.extend(true, {}, obj.dialog), data));
                                $(this).nosDialog(params);
                                break;

                            case 'nosDialog' :
                                params = $.nosDataReplace($.extend(true, {}, obj.dialog), data);
                                $(this).nosDialog(params);
                                break;

                            case 'nosAjax' :
                                params = $.nosDataReplace($.extend(true, {}, obj.params), data);
                                $(this).nosAjax(params);
                                break;

                            case 'nosMediaVisualise' :
                                $.nosMediaVisualise.call(this, data);
                                break;

                            case 'dialogPick' :
                                $(this).closest('.ui-dialog-content').trigger(obj.event, data);
                                break;

                            case 'window.open' :
                                url = $.nosDataReplace(obj.url, data);
                                window.open(url);
                                break;

                            case 'document.location' :
                                url = $.nosDataReplace(obj.url, data);
                                if (!(url.substr(0, 5) === 'http:' || url.substr(0, 6) === 'https:')) {
                                    var $base = $('base');
                                    if ($base.size()) {
                                        url = $base.attr('href') + url;
                                    }
                                }
                                document.location.href = url;
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
                        cache    : false,
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
                }

                options.error = function(x, e) {
                    self.nosAjaxError(x, e);
                    if ($.isFunction(old_error)) {
                        old_error.call(this, x, e);
                    }
                };

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
                if (json.action) {
                    var self = this;
                    if ($.isArray(json.action)) {
                        $.each(json.action, function() {
                            $(self).nosAction(this);
                        });
                    } else {
                        $(self).nosAction(json.action);
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
                if (x.status == 403) {
                    try {
                        // If it's valid JSON, then we'll open the reconnect popup
                        var json =  $.parseJSON(x.responseText);
                        if (json.login_popup && !login_popup_opened) {
                            json.login_popup['close'] = function() {
                                login_popup_opened = false;
                            };
                            json.login_popup.contentUrl += '?lang=' + $.nosLang;
                            $('body').nosDialog('open', json.login_popup);
                            login_popup_opened = true;
                        }
                        return;
                    } catch(e) {}
                }
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
                    url: 'admin/nos/noviusos/save_user_configuration',
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
                        'all'   : 'admin/noviusos_media/appdesk?view=media_pick',
                        'image' : 'admin/noviusos_media/appdesk?view=image_pick'
                    },
                    titles = {
                        'all'   : $.nosTexts.chooseMediaFile,
                        'image' : $.nosTexts.chooseMediaImage
                    },
                    $input = this;

                var options = $.extend({
                    title: $input.attr('title') || 'File',
                    allowDelete : true,
                    classes: data.mode,
                    choose: function() {
                        var $dialog = $input.nosDialog({
                                destroyOnClose : true,
                                contentUrl: contentUrls[data.mode],
                                ajax: true,
                                title: titles[data.mode]
                            }).bind('select_media', function(e, item) {
                                $input.inputFileThumb({
                                    file: item.image ? item.thumbnail : item.path
                                });
                                $input.val(item.id).trigger('change', {
                                    item : item
                                });
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
                        $input.prependTo($input.closest('.ui-widget-content'));
                    });
                });

                return this;
            },

            nosFormUI : function() {
                var $context = this;

                $context.find(":input[type='text'],:input[type='password'],:input[type='email'],textarea").filter(':not(.notransform)').wijtextbox();
                $context.find(":input[type='submit'],button").filter(':not(.notransform)').each(function() {
                    var data = $(this).data(),
                        options = $.extend(true, {
                            icons : {}
                        }, data || {}),
                        replace = {},
                        $button = $(this);

                    if (data.red) {
                        $button.addClass('ui-state-error');
                    }

                    data.icons = $.extend(true, {
                            primary: null,
                            secondary: null
                        }, data.icons || {});
                    if (data.icon) {
                        data.icons.primary = {icon: data.icon};
                    } else if (data.iconClasses) {
                        data.icons.primary = {iconClasses: data.iconClasses};
                    } else if (data.iconUrl) {
                        data.icons.primary = {iconUrl: data.iconUrl};
                    }
                    $.each(data.icons, function(key, value) {
                        if (!value) {
                            return true;
                        }
                        if ($.type(value) === 'string') {
                            options.icons[key] = 'ui-icon-' + value.replace('ui-icon-', '');
                        } else if (value.icon) {
                            options.icons[key] = 'ui-icon-' + value.icon.replace('ui-icon-', '');
                        } else if (value.iconClasses) {
                            options.icons[key] = value.iconClasses;
                        } else if (value.iconUrl) {
                            replace[key] = value.iconUrl;
                            options.icons[key] = 'nos-icon16';
                        }
                    });

                    $button.button(options);
                    $.each(replace, function(key, url) {
                        $button.find('span.ui-button-icon-' + key)
                            .css({
                                backgroundImage: 'url(' + url + ')'
                            });
                    });
                });
                $context.find("select").filter(':not(.notransform)').nosOnShow('one', function() {
                    var $wijdropdown = $(this).wijdropdown().closest('.wijmo-wijdropdown');
                    // Cross browser compatibility: prevent the dropdown from protruding over 2 lines
                    $wijdropdown.width($wijdropdown.width() + 5);
                });
                $context.find(":input[type=checkbox]").filter(':not(.notransform)').nosOnShow('one', function() {
                    $(this).wijcheckbox();
                });
                $context.find(":input[type=radio]").filter(':not(.notransform)').nosOnShow('one', function() {
                    $(this).wijradio();
                });
                $context.find('.expander').add($context.filter('.expander')).filter(':not(.notransform)').each(function() {
                    var $this = $(this);
                    $this.wijexpander($.extend({
                        expanded: true,
                        afterExpand: function(e) {
                            $(e.target).find('.ui-expander-content').nosOnShow();
                        }
                    }, $this.data('wijexpander-options')));
                });
                $context.find('.accordion').add($context.filter('.accordion')).filter(':not(.notransform)').wijaccordion({
                    header: "h3",
                    selectedIndexChanged : function(e, args) {
                        $(e.target).find('.wijmo-wijaccordion-content').eq(args.newIndex).nosOnShow();
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
                        error: function(x, e) {
                            $context.nosAjaxError(x, e);
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
                            $dialog.nosAjax({
                                url: contentUrl,
                                type: 'GET',
                                dataType: "html",
                                data : options.ajaxData || {},
                                // Complete callback (responseText is used internally)
                                complete: function( jqXHR, status, responseText ) {
                                    // Store the response as specified by the jqXHR object
                                    responseText = jqXHR.responseText;
                                    // If successful, inject the HTML into all the matched elements
                                    if ( jqXHR.state() === 'resolved' ) {
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

            nosListenEvent : function(json_match, callback, caller) {
                var self = this,
                    $dispatcher = this.closest('.nos-dispatcher, body'),
                    listens = $dispatcher.data('noviusos-listens');

                caller = caller || null;

                if (!$.isArray(listens)) {
                    $dispatcher.on('noviusos', function(e) {
                        e.noviusos = e.noviusos || {};

                        $.each($dispatcher.data('noviusos-listens'), function(index_listen, listen) {
                            var json_match = listen.json_match,
                                callback = listen.callback,
                                matched = false;

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
                    });
                }
                listens = $.isArray(listens) ? listens : [];
                listens.push({
                    caller: caller,
                    json_match: $.isArray(json_match) ? json_match : [json_match],
                    callback: callback
                });
                $dispatcher.data('noviusos-listens', listens);

                return self;
            },

            nosUnlistenEvent : function(caller) {
                var self = this,
                    $dispatcher = this.closest('.nos-dispatcher, body'),
                    listens = $dispatcher.data('noviusos-listens');

                if ($.isArray(listens)) {
                    listens = $.extend(true, [], listens);
                    // Loop on original array, remove on clone : not change index inside the loop
                    for (var index_listen = 0; index_listen < listens.length; index_listen++) {
                        if (listens[index_listen].caller === caller) {
                            listens.splice(index_listen, 1);
                            index_listen--;
                        }
                    }
                    $dispatcher.data('noviusos-listens', listens);
                }

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
                                    return noviusos().ostabs('select', sel + 1);
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
                                return window.parent.$nos(window.frameElement).nosTabs('current');
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
                        return (function() {
                            var $toolbar = $('<table><tr><td class="nos-toolbar-left"><table><tr class="nos-toolbar-left"></tr></table></td><td class="nos-toolbar-right"><table><tr class="nos-toolbar-right"></tr></table></td></tr></table>')
                                .addClass('nos-toolbar ui-widget-header')
                                .insertBefore(self);

                            self.addClass('nos-toolbar-target fill-parent nos-fixed-content')
                                .parent()
                                .addClass('nos-toolbar-parent');

                            return $toolbar;
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
