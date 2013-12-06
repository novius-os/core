/*
 *
 * Wijmo Library 3.20133.20
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 *
 *
 */
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="../Base/jquery.wijmo.widget.ts" />
    /// <reference path="../External/declarations/swfobject.d.ts" />
    /// <reference path="../External/declarations/jquery.bgiframe.d.ts" />
    /// <reference path="../External/declarations/jquery.cookie.d.ts" />
    /// <reference path="../wijvideo/jquery.wijmo.wijvideo.ts" />
    /*globals jQuery, window, XMLHttpRequest*/
    /*
    * Depends:
    *     jquery.ui.core.js
    *     jquery.ui.widget.js
    */
    (function (lightbox) {
        "use strict";
        var $ = jQuery, widgetName = "wijlightbox";
        if(!window["S"] && window["swfobject"]) {
            window["S"] = {
                flash: window["swfobject"]
            };
        }
        /** @widget */
        var wijlightbox = (function (_super) {
            __extends(wijlightbox, _super);
            function wijlightbox() {
                _super.apply(this, arguments);

            }
            wijlightbox.prototype._keyDownHandler = function (event) {
                var o = this.options, self = this, kCode = wijmo.getKeyCodeEnum();
                if(event.keyCode && event.keyCode === kCode.ESCAPE) {
                    if(self._isFullSize()) {
                        self._toggleFullSize();
                    } else {
                        if(o.closeOnEscape) {
                            self._close();
                        }
                    }
                    event.preventDefault();
                    return;
                }
                if(o.keyNav) {
                    if(event.keyCode) {
                        switch(event.keyCode) {
                            case kCode.LEFT:
                            case kCode.DOWN:
                                self.back();
                                event.preventDefault();
                                break;
                            case kCode.RIGHT:
                            case kCode.UP:
                                self.next();
                                event.preventDefault();
                                break;
                            case kCode.HOME:
                                if(o.groupItems.length > 0) {
                                    self.show(0);
                                }
                                event.preventDefault();
                                break;
                            case kCode.END:
                                if(o.groupItems.length > 0) {
                                    self.show(o.groupItems.length - 1);
                                }
                                event.preventDefault();
                                break;
                        }
                    }
                }
            };
            wijlightbox.prototype._create = function () {
                var o = this.options, self = this;
                // enable touch support:
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                if(!o.groupItems) {
                    o.groupItems = [];
                }
                this._defaults = {
                    transAnimation: {
                        animated: 'fade',
                        duration: 400,
                        easing: 'linear'
                    },
                    resizeAnimation: {
                        animated: 'sync',
                        duration: 400
                    },
                    textShowOption: {
                        duration: 300,
                        easing: 'linear'
                    },
                    textHideOption: {
                        duration: 300,
                        easing: 'linear'
                    }
                };
                this._parse();
                this.container = $('<div/>').addClass('wijmo-wijlightbox ' + o.wijCSS.widget + ' wijmo-wijlightbox-controls-' + o.controlsPosition).css('z-index', o.zIndex).attr({
                    'tabIndex': -1,
                    'role': 'dialog'
                }).bind('keydown.wijlightbox', $.proxy(self, '_keyDownHandler')).appendTo(document.body).hide();
                this.frame = $('<div></div>').addClass([
                    'wijmo-wijlightbox-frame', 
                    o.wijCSS.content, 
                    o.wijCSS.cornerAll, 
                    o.wijCSS.helperClearFix
                ].join(' ')).appendTo(this.container);
                this.content = $('<div></div>').addClass('wijmo-wijlightbox-content').appendTo(this.frame);
                // Active a panel
                // use "activeIndex" option or try to retrieve:
                // 1. from cookie
                // 2. from actived class attribute on panel
                if(o.activeIndex === undefined) {
                    if(typeof o.activeIndex !== 'number' && o.cookie) {
                        o.activeIndex = parseInt(self._cookie(), 10);
                    }
                    o.activeIndex = o.activeIndex || (o.groupItems.length ? 0 : -1);
                } else if(o.activeIndex === null) {
                    // usage of null is deprecated, TODO remove in next release
                    o.activeIndex = -1;
                }
                // sanity check - default to first page...
                o.activeIndex = ((o.activeIndex >= 0 && o.groupItems[o.activeIndex]) || o.activeIndex < 0) ? o.activeIndex : 0;
                this._initClickBehavior();
                this._createTimerBar();
                this._createDialogButtons();
                this._createCtrlButtons();
                this._createText();
                this._createCounter();
                this._refreshCounter();
                if(this.toolBox) {
                    this.toolBox.find('.wijmo-wijlightbox-toolbox-button').bind({
                        'mouseover': function () {
                            self._addState('hover', $(this));
                        },
                        'mouseout': function () {
                            self._removeState('hover', $(this));
                        },
                        'mousedown': function () {
                            self._addState('active', $(this));
                        },
                        'mouseup': function () {
                            self._removeState('active', $(this));
                        }
                    });
                }
                if(this._groupMode()) {
                    this._createNavButtons();
                }
                this._initHoverBehavior();
                this.container.width(this.frame.outerWidth());
            };
            wijlightbox.prototype.destroy = /**
            * Destroys wijlightbox widget and reset the DOM element.
            */
            function () {
                var o = this.options, self = this;
                this._hideWaiting();
                this._hideOverlay();
                if(o.cookie) {
                    this._cookie(null, o.cookie);
                }
                this.container.remove();
                $.Widget.prototype.destroy.apply(self, arguments);
                return self;
            };
            wijlightbox.prototype._setOption = function (key, value) {
                var oldValue = this.options[key];
                $.Widget.prototype._setOption.apply(this, arguments);
                switch(key) {
                    case 'groupItems':
                        if(this.options.activeIndex >= value.length) {
                            this.show(value.length - 1);
                        } else {
                            if(this.options.activeIndex < 0 && value.length) {
                                this.show(0);
                            } else {
                                this.show(this.options.activeIndex);
                            }
                        }
                        break;
                    case 'activeIndex':
                        this.show(value);
                        break;
                    case 'textPosition':
                        this._resetText();
                        break;
                    case 'clickPause':
                        this._initClickBehavior();
                        break;
                    case 'showNavButtons':
                        this._createNavButtons();
                        break;
                    case 'showControlsOnHover':
                        this._initHoverBehavior();
                        break;
                    case "controlsPosition":
                        this._set_controlsPosition(oldValue, value);
                        break;
                }
            };
            wijlightbox.prototype._set_controlsPosition = function (oldValue, value) {
                //recreate the controls.
                if(oldValue !== value) {
                    this._removeCounter();
                    this._removeNavButtons();
                    this.container.removeClass("wijmo-wijlightbox-controls-outside wijmo-wijlightbox-controls-inside").addClass("wijmo-wijlightbox-controls-" + value);
                    this._createCounter();
                    this._createNavButtons();
                }
            };
            wijlightbox.prototype._initClickBehavior = function () {
                var o = this.options, self = this;
                this.content.unbind('click');
                if(o.clickPause) {
                    if(this._groupMode()) {
                        this.content.click(function () {
                            self[!self.isPlaying() ? 'play' : 'stop']();
                        });
                    }
                } else {
                    if(this._groupMode()) {
                        this.content.click(function (e) {
                            if(self.isPlaying()) {
                                return false;
                            }
                            var rect = $.extend({
                            }, $(this).offset(), {
                                width: $(this).outerWidth(true),
                                height: $(this).outerHeight(true)
                            });
                            if(e.pageX >= rect.left && e.pageX < (rect.left + rect.width / 2)) {
                                if(!self.backBtn.hasAllClasses(o.wijCSS.stateDisabled)) {
                                    self.back();
                                }
                            } else {
                                if(!self.nextBtn.hasAllClasses(o.wijCSS.stateDisabled)) {
                                    self.next();
                                }
                            }
                        });
                    }
                }
            };
            wijlightbox.prototype._initHoverBehavior = function () {
                var o = this.options, self = this;
                this.frame.unbind('.wijlightbox');
                if(o.showControlsOnHover) {
                    this.frame.bind({
                        'mouseenter.wijlightbox': function () {
                            if(self.container.data('moving.wijlightbox')) {
                                return false;
                            }
                            self._showAccessories(true);
                        },
                        'mouseleave.wijlightbox': function () {
                            if(self.container.data('moving.wijlightbox')) {
                                return false;
                            }
                            self._hideAccessories(true);
                        },
                        'mousemove.wijlightbox': function () {
                            if(self.container.data('moving.wijlightbox') === false && self.container.data('accessvisible.wijlightbox') === false) {
                                self.frame.trigger('mouseenter');
                            }
                        }
                    });
                }
            };
            wijlightbox.prototype._getPlugins = function () {
                var plugins = this.container.data('plugins.wijlightbox'), names, detectPlugin, f4m;
                if(!plugins) {
                    plugins = {
                    };
                    if(window.navigator.plugins && window.navigator.plugins.length) {
                        names = [];
                        $.each(window.navigator.plugins, function (i, p) {
                            names.push(p.name);
                        });
                        names = names.join(",");
                        f4m = names.indexOf("Flip4Mac") > -1;
                        plugins = {
                            fla: names.indexOf("Shockwave Flash") > -1,
                            qt: names.indexOf("QuickTime") > -1,
                            wmp: !f4m && names.indexOf("Windows Media") > -1,
                            f4m: f4m
                        };
                    } else {
                        detectPlugin = function (name) {
                            var axo;
                            try  {
                                axo = new ActiveXObject(name);
                            } catch (e) {
                            }
                            return !!axo;
                        };
                        plugins = {
                            fla: detectPlugin("ShockwaveFlash.ShockwaveFlash"),
                            qt: detectPlugin("QuickTime.QuickTime"),
                            wmp: detectPlugin("wmplayer.ocx"),
                            f4m: false
                        };
                    }
                    this.container.data('plugins.wijlightbox', plugins);
                }
                return plugins;
            };
            wijlightbox.prototype._sanitizeSelector = function (hash) {
                // we need this because an id may contain a ":"
                return hash.replace(/:/g, '\\:');
            };
            wijlightbox.prototype._getFragmentId = function (a) {
                var fragmentId = /^#.+/, href = // Safari 2 reports '#' for an empty hash
                $(a).attr('href') || "", hrefBase = href.split('#')[0], baseEl = $('base')[0];
                if(hrefBase && (hrefBase === window.location.toString().split('#')[0] || (baseEl && hrefBase === baseEl.attributes["href"]))) {
                    href = a.hash;
                    a.href = href;
                }
                // inline links
                return fragmentId.test(href) ? this._sanitizeSelector(href) : "";
            };
            wijlightbox.prototype._parseLink = function (a) {
                var self = this, o = this.options, $a = $(a), opt = {
                    href: undefined,
                    player: undefined,
                    img: undefined,
                    gallery: undefined
                }, rel, $img, gallery, index, props = [
                    'href', 
                    'player', 
                    'title', 
                    'alt', 
                    'height', 
                    'width', 
                    'gallery', 
                    'wijvideosrc'
                ];
                if($a.length > 0 && $a[0].tagName.toLowerCase() === 'a') {
                    rel = $a.attr('rel');
                    $.each(props, function (i, o) {
                        opt[o] = $a.attr(o) || '';
                    });
                    if(!opt.href) {
                        return;
                    }
                    if(!opt.player) {
                        opt.player = o.player || self._getPlayerName(opt.href);
                    }
                    $img = $a.find('img');
                    if($img && $img.length === 0) {
                        $img = $a;
                    }
                    if($img && $img.length >= 1) {
                        $.each([
                            'title', 
                            'alt'
                        ], function (i, o) {
                            opt[o] = $img.attr(o) || opt[o];
                        });
                        opt.img = $img;
                    }
                    if(rel) {
                        gallery = rel.match(/\[(.*?)\]/);
                        if(gallery) {
                            opt.gallery = gallery[1] || opt.gallery;
                        }
                        $.each(rel.split(";"), function (i, p) {
                            var match = p.match(/\s*([a-z_]*?)\s*=\s*(.+)\s*/);
                            if(match) {
                                opt[match[1]] = match[2];
                            }
                        });
                    }
                    if(opt.player === 'inline') {
                        opt.href = self._getFragmentId(a);
                    }
                    if(!opt.gallery) {
                        $a.bind({
                            'click': function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                                if(!o.disabled) {
                                    self._open($img, opt);
                                }
                                return false;
                            }
                        });
                    } else {
                        index = o.groupItems.length;
                        o.groupItems[index] = opt;
                        $a.bind({
                            'click': function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                                if(!o.disabled) {
                                    self._open($img, index);
                                }
                                return false;
                            }
                        });
                    }
                }
            };
            wijlightbox.prototype._parse = function () {
                var self = this;
                this._parseLink(this.element);
                this.element.find('a[rel^="wijlightbox"], a[rel^="lightbox"]').each(function (index, element) {
                    self._parseLink(element);
                });
            };
            wijlightbox.prototype._showAccessories = function (fade) {
                this.container.data('accessvisible.wijlightbox', true);
                this._showNavButtons(fade);
                this._showToolboxButtons(fade);
                this._showCounter(fade);
            };
            wijlightbox.prototype._hideAccessories = function (fade) {
                this.container.data('accessvisible.wijlightbox', false);
                this._hideNavButtons(fade);
                this._hideToolboxButtons(fade);
                this._hideCounter(fade);
            };
            wijlightbox.prototype._groupMode = function () {
                var o = this.options;
                return (o.groupItems && o.groupItems.length > 1);
            };
            wijlightbox.prototype._resetText = function () {
                this._removeText();
                this._createText();
            };
            wijlightbox.prototype._createText = function (updateOnly) {
                var self = this, o = self.options, cs, $text, $mask, $title, $detail;
                if(o.textPosition === 'none') {
                    return;
                }
                if(this.container.find('.wijmo-wijlightbox-text').length) {
                    return;
                }
                cs = o.textPosition.toLowerCase();
                $text = $('<div></div>').addClass('wijmo-wijlightbox-text wijmo-wijlightbox-text-' + cs + ' ' + o.wijCSS.content + ' ' + o.wijCSS.helperClearFix);
                $title = $('<h3></h3>').addClass('wijmo-wijlightbox-title wijmo-wijlightbox-title-' + cs + ' ' + o.wijCSS.helperClearFix).appendTo($text);
                $detail = $('<p></p>').addClass('wijmo-wijlightbox-detail wijmo-wijlightbox-detail-' + cs + ' ' + o.wijCSS.helperClearFix).appendTo($text);
                if(o.textPosition === 'inside') {
                    $text.addClass(o.wijCSS.content + ' ' + o.wijCSS.helperClearFix).width(this.frame.width()).appendTo(this.frame);
                } else if(o.textPosition === 'outside') {
                    $text.addClass([
                        o.wijCSS.content, 
                        o.wijCSS.cornerAll, 
                        o.wijCSS.helperClearFix
                    ].join(' ')).width(this.frame.width()).appendTo(this.container);
                } else if(o.textPosition === 'overlay' || o.textPosition === 'titleOverlay') {
                    $mask = $('<div></div>').addClass('wijmo-wijlightbox-mask wijmo-wijlightbox-mask-' + cs + ' ' + o.wijCSS.helperClearFix).width(this.frame.width()).appendTo(this.frame);
                    $text.width(this.frame.width()).appendTo(this.frame);
                    if(o.textPosition === 'titleOverlay') {
                        $text.bind({
                            'mouseenter': function () {
                                $mask.stop();
                                $text.stop();
                                var totalHeight = $title.outerHeight(true) + $detail.outerHeight(true), animOption = $.extend({
                                }, self._defaults.textShowOption, o.textShowOption, {
                                    queue: false
                                });
                                $mask.animate({
                                    height: totalHeight
                                }, animOption);
                                $text.animate({
                                    height: totalHeight
                                }, animOption);
                            },
                            'mouseleave': function () {
                                $mask.stop();
                                $text.stop();
                                var titleHeight = $title.height(), animOption = $.extend({
                                }, self._defaults.textHideOption, o.textHideOption, {
                                    queue: false
                                });
                                $mask.animate({
                                    height: titleHeight
                                }, animOption);
                                $text.animate({
                                    height: titleHeight
                                }, animOption);
                            }
                        });
                    }
                }
                this._refreshText(updateOnly);
            };
            wijlightbox.prototype._removeText = function () {
                this.container.find(".wijmo-wijlightbox-text," + ".wijmo-wijlightbox-mask").remove();
            };
            wijlightbox.prototype._getActiveItem = function () {
                var o = this.options;
                if(o.groupItems && o.groupItems.length && o.activeIndex >= 0 && o.activeIndex < o.groupItems.length) {
                    return o.groupItems[o.activeIndex];
                }
                return null;
            };
            wijlightbox.prototype._refreshText = function (updateOnly) {
                var self = this, o = this.options, item, $text, $title, $detail, $mask;
                if(o.textPosition === 'none') {
                    return;
                }
                item = this.container.data('item.wijlightbox') || this._getActiveItem();
                if(!item) {
                    return;
                }
                $text = this.container.find('.wijmo-wijlightbox-text');
                $title = this.container.find('.wijmo-wijlightbox-title');
                $detail = this.container.find('.wijmo-wijlightbox-detail');
                $mask = this.container.find('.wijmo-wijlightbox-mask');
                $mask.stop();
                $text.stop();
                $title.html(item.title);
                $detail.html(item.alt);
                if(o.textPosition === 'outside') {
                    $text.width(this.frame.width());
                }
                var titleHeight = $title.outerHeight(true), detailHeight = $detail.outerHeight(true);
                //			var toHeight = o.textPosition === 'titleOverlay' ?
                //			titleHeight :
                //			$text.height();
                var animOption = $.extend({
                }, self._defaults.textShowOption, o.textShowOption, {
                    queue: false
                });
                if(o.textPosition === 'overlay' || o.textPosition === 'titleOverlay') {
                    var toHeitht = titleHeight + (o.textPosition === 'overlay' ? detailHeight : 0);
                    $text.height(0);
                    $mask.height(0);
                    $text.animate({
                        height: toHeitht
                    }, animOption);
                    $mask.animate({
                        height: toHeitht
                    }, animOption);
                } else {
                    if(!!updateOnly) {
                        $text.height(titleHeight + detailHeight);
                    } else {
                        $text.height(0);
                        $text.animate({
                            height: titleHeight + detailHeight
                        }, animOption);
                    }
                }
            };
            wijlightbox.prototype._addState = function (state, el) {
                if(el.is(':not(.' + this.options.wijCSS.stateDisabled + ')')) {
                    el.addClass('ui-state-' + state);
                }
            };
            wijlightbox.prototype._removeState = function (state, el) {
                el.removeClass('ui-state-' + state);
            };
            wijlightbox.prototype._createNavButtons = function () {
                var self = this, o = this.options;
                if(!o.showNavButtons || !this._groupMode()) {
                    this._removeNavButtons();
                    return;
                }
                if(!this.backBtn) {
                    this.backBtn = $("<a href='#'/>").addClass('wijmo-wijlightbox-button ' + 'wijmo-wijlightbox-button-prev ' + o.wijCSS.stateDefault + ' ' + (o.controlsPosition === 'inside' ? o.wijCSS.cornerRight : o.wijCSS.cornerLeft)).append("<span class='" + o.wijCSS.icon + " " + o.wijCSS.iconArrowLeft + "'></span>").hide().appendTo(this.frame).bind({
                        'click': function () {
                            if(!$(this).hasAllClasses(o.wijCSS.stateDisabled)) {
                                self.back();
                            }
                            return false;
                        },
                        'mouseover': function () {
                            self._addState('hover', $(this));
                        },
                        'mouseout': function () {
                            self._removeState('hover', $(this));
                        },
                        'mousedown': function () {
                            self._addState('active', $(this));
                        },
                        'mouseup': function () {
                            self._removeState('active', $(this));
                        }
                    });
                }
                if(!this.nextBtn) {
                    this.nextBtn = $("<a href='#'/>").addClass('wijmo-wijlightbox-button ' + 'wijmo-wijlightbox-button-next ' + o.wijCSS.stateDefault + ' ' + (o.controlsPosition === 'inside' ? o.wijCSS.cornerLeft : o.wijCSS.cornerRight)).append("<span class='" + o.wijCSS.icon + " " + o.wijCSS.iconArrowRight + "'></span>").hide().appendTo(this.frame).bind({
                        'click': function () {
                            if(!$(this).hasAllClasses(o.wijCSS.stateDisabled)) {
                                self.next();
                            }
                            return false;
                        },
                        'mouseover': function () {
                            self._addState('hover', $(this));
                        },
                        'mouseout': function () {
                            self._removeState('hover', $(this));
                        },
                        'mousedown': function () {
                            self._addState('active', $(this));
                        },
                        'mouseup': function () {
                            self._removeState('active', $(this));
                        }
                    });
                }
            };
            wijlightbox.prototype._removeNavButtons = function () {
                if(this.backBtn) {
                    this.backBtn.remove();
                    this.backBtn = undefined;
                }
                if(this.nextBtn) {
                    this.nextBtn.remove();
                    this.nextBtn = undefined;
                }
            };
            wijlightbox.prototype._refreshNavButtons = function () {
                var o = this.options, operation;
                if(this.backBtn) {
                    operation = o.activeIndex === 0 ? 'addClass' : 'removeClass';
                    this.backBtn[operation](o.wijCSS.stateDisabled);
                }
                if(this.nextBtn) {
                    operation = o.activeIndex >= o.groupItems.length - 1 ? 'addClass' : 'removeClass';
                    this.nextBtn[operation](o.wijCSS.stateDisabled);
                }
            };
            wijlightbox.prototype._showNavButtons = function (anim) {
                if(this.isPlaying()) {
                    return;
                }
                this.container.find('.wijmo-wijlightbox-button').stop(true, true).fadeIn(anim ? 600 : 0, function () {
                    $(this).css('opacity', '');
                });
            };
            wijlightbox.prototype._hideNavButtons = function (anim) {
                this.container.find('.wijmo-wijlightbox-button').stop(true, true).fadeOut(anim ? 600 : 0);
            };
            wijlightbox.prototype._createToolbox = function () {
                if(!this.toolBox) {
                    this.toolBox = $("<div></div>").addClass('wijmo-wijlightbox-toolbox').appendTo(this.frame);
                }
            };
            wijlightbox.prototype._showToolboxButtons = function (anim) {
                this.container.find('.wijmo-wijlightbox-toolbox-button').stop(true, true).fadeIn(anim ? 600 : 0, function () {
                    $(this).css('opacity', '');
                });
            };
            wijlightbox.prototype._hideToolboxButtons = function (anim) {
                this.container.find('.wijmo-wijlightbox-toolbox-button').stop(true, true).fadeOut(anim ? 600 : 0);
            };
            wijlightbox.prototype._createCtrlButtons = function () {
                var self = this, o = this.options, wijCSS = o.wijCSS;
                if(!o.ctrlButtons || o.ctrlButtons.length === 0 || !this._groupMode()) {
                    this._removeCtrlButtons();
                    return;
                }
                this._createToolbox();
                var buttons = o.ctrlButtons.split('|');
                if(buttons.length === 1 && buttons[0] === o.ctrlButtons) {
                    buttons = o.ctrlButtons.split(',');
                }
                $.each(buttons, function (index, name) {
                    name = $.trim(name);
                    if(name === 'play' && !this.playBtn) {
                        self.playBtn = $("<a href='#'/>").addClass([
                            'wijmo-wijlightbox-toolbox-button', 
                            ' wijmo-wijlightbox-toolbox-button-play ', 
                            wijCSS.stateDefault, 
                            wijCSS.cornerAll
                        ].join(' ')).append("<span class='" + wijCSS.icon + " " + wijCSS.iconPlay + "'></span>").hide().click(function () {
                            if(self.isPlaying()) {
                                self.stop();
                            } else {
                                if(o.activeIndex >= o.groupItems.length - 1) {
                                    self.show(0);
                                }
                                self.play();
                            }
                            return false;
                        });
                    } else if(name === 'stop' && !this.stopBtn) {
                        self.stopBtn = $("<a href='#'/>").addClass([
                            'wijmo-wijlightbox-toolbox-button', 
                            'wijmo-wijlightbox-toolbox-button-stop', 
                            wijCSS.stateDefault, 
                            wijCSS.stateDisabled, 
                            wijCSS.cornerAll
                        ].join(' ')).append("<span class='" + wijCSS.icon + " " + wijCSS.iconStop + "'></span>").hide().click(function () {
                            if(self.isPlaying()) {
                                self.stop();
                                self.show(0);
                            }
                            return false;
                        });
                    }
                });
                if(this.stopBtn) {
                    this.stopBtn.appendTo(this.toolBox);
                }
                if(this.playBtn) {
                    this.playBtn.appendTo(this.toolBox);
                }
            };
            wijlightbox.prototype._removeCtrlButtons = function () {
                if(this.playBtn) {
                    this.playBtn.remove();
                    this.playBtn = undefined;
                }
                if(this.stopBtn) {
                    this.stopBtn.remove();
                    this.stopBtn = undefined;
                }
            };
            wijlightbox.prototype._refreshCtrlButtons = function () {
                var css = this.options.wijCSS;
                if(this.playBtn) {
                    var icon = this.playBtn.find('.' + css.icon);
                    if(icon) {
                        icon.removeClass(css.iconPause + ' ' + css.iconPlay);
                        icon.addClass(this.isPlaying() ? css.iconPause : css.iconPlay);
                    }
                }
                if(this.stopBtn) {
                    this.stopBtn[!this.isPlaying() ? 'addClass' : 'removeClass'](css.stateDisabled);
                }
            };
            wijlightbox.prototype._createDialogButtons = function () {
                var self = this, o = this.options, buttons;
                if(!o.dialogButtons || o.dialogButtons.length === 0) {
                    this._removeDialogButtons();
                    return;
                }
                this._createToolbox();
                buttons = o.dialogButtons.split('|');
                if(buttons.length === 1 && buttons[0] === o.dialogButtons) {
                    buttons = o.dialogButtons.split(',');
                }
                $.each(buttons, function (index, name) {
                    name = $.trim(name);
                    if(name === 'close' && !this.closeBtn) {
                        self.closeBtn = $("<a href='#'/>").addClass('wijmo-wijlightbox-toolbox-button ' + 'wijmo-wijlightbox-toolbox-button-close ' + o.wijCSS.stateDefault + ' ' + o.wijCSS.cornerAll).append("<span class='" + o.wijCSS.icon + " " + o.wijCSS.iconClose + "'></span>").hide().click(function () {
                            self._close();
                            return false;
                        });
                    } else if(name === 'fullSize' && !this.fullBtn) {
                        self.fullBtn = $("<a href='#'/>").addClass('wijmo-wijlightbox-toolbox-button ' + 'wijmo-wijlightbox-toolbox-button-fullsize ' + o.wijCSS.stateDefault + ' ' + o.wijCSS.cornerAll).append("<span class='" + o.wijCSS.icon + " " + o.wijCSS.iconArrow4Diag + "'></span>").hide().click(function () {
                            self._toggleFullSize();
                            return false;
                        });
                    }
                });
                if(this.closeBtn) {
                    this.closeBtn.appendTo(this.toolBox);
                }
                if(this.fullBtn) {
                    this.fullBtn.appendTo(this.toolBox);
                }
                if(!this.btnSep) {
                    this.btnSep = $("<a href='#'/>").addClass('wijmo-wijlightbox-toolbox-separator').appendTo(this.toolBox);
                }
            };
            wijlightbox.prototype._removeDialogButtons = function () {
                if(this.closeBtn) {
                    this.closeBtn.remove();
                    this.closeBtn = undefined;
                }
                if(this.fullBtn) {
                    this.fullBtn.remove();
                    this.fullBtn = undefined;
                }
            };
            wijlightbox.prototype._refreshDialogButtons = function () {
                var css = this.options.wijCSS;
                if(this.fullBtn) {
                    var icon = this.fullBtn.find('.' + css.icon);
                    if(icon) {
                        icon.removeClass(css.iconArrow4Diag + ' ' + css.iconNewWin);
                        icon.addClass(this._isFullSize() ? css.iconNewWin : css.iconArrow4Diag);
                    }
                }
            };
            wijlightbox.prototype._createTimerBar = function () {
                var self = this, o = self.options;
                if(!o.showTimer || !self._groupMode()) {
                    self._removeTimerBar();
                    return;
                }
                self._createToolbox();
                if(!self.timerBar) {
                    self.timerBar = $("<div></div>").addClass('wijmo-wijlightbox-timerbar ' + o.wijCSS.content + ' ui-priority-secondary ' + o.wijCSS.cornerAll).appendTo(self.toolBox);
                    self.timerMeter = $("<div></div>").addClass('wijmo-wijlightbox-timermeter ui-progressbar-value ' + o.wijCSS.content + ' ' + o.wijCSS.cornerAll).appendTo(self.toolBox);
                }
            };
            wijlightbox.prototype._removeTimerBar = function () {
                if(this.timerMeter) {
                    this.timerMeter.remove();
                    this.timerMeter = undefined;
                }
                if(this.timerBar) {
                    this.timerBar.remove();
                    this.timerBar = undefined;
                }
            };
            wijlightbox.prototype._createCounter = function () {
                var self = this, o = self.options;
                if(!o.showCounter || !self._groupMode()) {
                    self._removeCounter();
                    return;
                }
                if(!self.counter) {
                    self.counter = $("<div></div>").addClass('wijmo-wijlightbox-counter ' + o.wijCSS.stateDefault + ' ' + (o.controlsPosition === 'inside' ? o.wijCSS.cornerTL : o.wijCSS.cornerAll)).hide().appendTo(self.frame);
                }
            };
            wijlightbox.prototype._removeCounter = function () {
                if(this.counter) {
                    this.counter.remove();
                    this.counter = undefined;
                }
            };
            wijlightbox.prototype._refreshCounter = function (index) {
                var self = this, o = this.options, counter = "";
                if(!this.counter || !this._groupMode()) {
                    return;
                }
                this.counter.empty();
                if(o.showCounter && o.groupItems.length > 1 && this.counter) {
                    if(index === undefined) {
                        index = o.activeIndex;
                    }
                    var len = o.groupItems.length;
                    if(o.counterType === "sequence") {
                        var start = 0, end = len, limit = parseInt(o.counterLimit, 10) || 0;
                        if(limit >= 2 && limit < len) {
                            var h = Math.floor(limit / 2);
                            start = Math.min(end - limit, Math.max(start, index - h));
                            end = Math.min(end, start + limit);
                        }
                        while(start !== end) {
                            $("<a></a>").addClass('wijmo-wijlightbox-counter-item ' + o.wijCSS.content + ' ' + o.wijCSS.stateDefault + (start === index ? ' wijmo-wijlightbox-counter-active ' + o.wijCSS.stateActive : '')).text((++start).toString()).appendTo(this.counter);
                        }
                        this.counter.find('a').click(function (event, data) {
                            if($(this).hasClass('wijmo-wijlightbox-counter-active')) {
                                return false;
                            }
                            self.show(parseInt($(this).text(), 10) - 1);
                            return false;
                        });
                    } else {
                        var fmt = o.counterFormat || "[i] of [n]";
                        counter = fmt.replace('[i]', index + 1);
                        counter = counter.replace('[n]', len);
                        $("<span></span>").text(counter).appendTo(this.counter);
                    }
                }
            };
            wijlightbox.prototype._showCounter = function (anim) {
                this.container.find('.wijmo-wijlightbox-counter').stop(true, true).fadeIn(anim ? 600 : 0, function () {
                    $(this).css('opacity', '');
                });
            };
            wijlightbox.prototype._hideCounter = function (anim) {
                this.container.find('.wijmo-wijlightbox-counter').stop(true, true).fadeOut(anim ? 600 : 0);
            };
            wijlightbox.prototype._cookie = function (name, value) {
                var cookie = this.cookie || (this.cookie = this.options.cookie.name);
                return $.cookie.apply(null, [
                    cookie
                ].concat($.makeArray(arguments)));
            };
            wijlightbox.prototype._showOverlay = function () {
                if(this.container.data('overlay.wijlightbox')) {
                    return;
                }
                this.container.data('overlay.wijlightbox', new $.wijmo.wijlightbox.overlay(this));
            };
            wijlightbox.prototype._hideOverlay = function () {
                var $overlay = this.container.data('overlay.wijlightbox');
                if(!$overlay) {
                    return;
                }
                $overlay.close();
                this.container.removeData('overlay.wijlightbox');
            };
            wijlightbox.prototype._hasOverlay = function () {
                return this.container.hasData('overlay.wijlightbox');
            };
            wijlightbox.prototype._showWaiting = function () {
                if(this.container.data('waiting.wijlightbox')) {
                    return;
                }
                this.container.data('waiting.wijlightbox', new $.wijmo.wijlightbox.overlay(this, true));
            };
            wijlightbox.prototype._hideWaiting = function () {
                var $overlay = this.container.data('waiting.wijlightbox');
                if(!$overlay) {
                    return;
                }
                $overlay.close();
                this.container.removeData('waiting.wijlightbox');
            };
            wijlightbox.prototype._hasWaiting = function () {
                return this.container.hasData('waiting.wijlightbox');
            };
            wijlightbox.prototype._getUrl = function (item) {
                var o = this.options, url = (typeof item === 'string') ? item : item.href, rootUrl = o.rootUrl;
                if(rootUrl && rootUrl.length > 0) {
                    if(rootUrl.indexOf('//') === -1) {
                        rootUrl = window.location.protocol + '//' + window.location.host + (rootUrl.startsWith('/') ? '' : '/') + rootUrl;
                    }
                    if(rootUrl.substr(rootUrl.length - 1, 1) !== '/') {
                        rootUrl += '/';
                    }
                    url = rootUrl + (url.substr(0, 1) === '/' ? url.substr(1) : url);
                }
                return url;
            };
            wijlightbox.prototype._preload = function () {
                var o = this.options, i;
                for(i = Math.max(0, o.activeIndex); i < Math.min(o.activeIndex + 5, o.groupItems.length); i++) {
                    if(!o.groupItems[i].image) {
                        o.groupItems[i].image = new Image();
                        o.groupItems[i].image.src = this._getUrl(o.groupItems[i]);
                    }
                }
            };
            wijlightbox.prototype._slideAnimate = function (o, el, done) {
                var props = [
                    "position", 
                    "top", 
                    "bottom", 
                    "left", 
                    "right", 
                    "width", 
                    "height"
                ], mode = $.setMode(el, o.mode || "show"), show = mode === "show", direction = o.direction || "left", ref = (direction === "up" || direction === "down") ? "top" : "left", positiveMotion = (direction === "up" || direction === "left"), distance, animation = {
                };
                // Adjust
                $.save(el, props);
                el.show();
                distance = o.distance || el[ref === "top" ? "outerHeight" : "outerWidth"](true);
                $.createWrapper(el).css({
                    overflow: "hidden"
                });
                if(show) {
                    el.css(ref, positiveMotion ? (isNaN(distance) ? parseInt("-" + distance) : -distance) : distance);
                }
                // Animation
                animation[ref] = (show ? (positiveMotion ? "+=" : "-=") : (positiveMotion ? "-=" : "+=")) + distance;
                el.animate(animation, {
                    queue: false,
                    duration: o.duration,
                    easing: o.easing,
                    complete: function () {
                        if(mode === "hide") {
                            el.hide();
                        }
                        $.restore(el, props);
                        $.removeWrapper(el);
                        done();
                    }
                });
            };
            wijlightbox.prototype._slideTo = function (prevPlayer, player, animation, next, complete) {
                var o = this.options, self = this, curImage = prevPlayer.getElement(), wrapper, slideContainer, direction, w, h, $img, slideCallback, slideOpts;
                if(curImage.parent().is('.wijmo-wijlightbox-aniwrapper')) {
                    wrapper = curImage.parent();
                } else {
                    wrapper = $.createWrapper(curImage).css({
                        overflow: 'hidden'
                    });
                    wrapper.removeClass('ui-effects-wrapper');
                    wrapper.addClass('wijmo-wijlightbox-aniwrapper');
                }
                if(wrapper.parent().is('.wijmo-wijlightbox-aniwrapper')) {
                    slideContainer = wrapper.parent();
                } else {
                    slideContainer = $.createWrapper(wrapper).css({
                        overflow: 'hidden'
                    });
                    slideContainer.removeClass('ui-effects-wrapper');
                    slideContainer.addClass('wijmo-wijlightbox-aniwrapper');
                }
                direction = o.slideDirection || 'horizontal';
                w = curImage.outerWidth();
                h = curImage.outerHeight();
                if(direction === 'horizontal') {
                    curImage.width(w).css('float', next ? 'left' : 'right');
                    wrapper.width(2 * w).css({
                        left: (next ? 0 : -1 * w),
                        position: 'absolute'
                    });
                } else {
                    curImage.height(h);
                    wrapper.width(w).css({
                        top: (next ? 0 : -1 * h),
                        position: 'absolute'
                    }).height(2 * h);
                }
                player.appendTo(wrapper);
                $img = player.getElement();
                if(direction === 'horizontal') {
                    $img.width(w).css('float', next ? 'left' : 'right');
                } else {
                    $img.height(h);
                }
                this.container.data('animating.wijlightbox', true);
                slideCallback = function () {
                    curImage = wrapper.children(':last');
                    while(curImage.parent().is('.wijmo-wijlightbox-aniwrapper')) {
                        curImage.parent().replaceWith(curImage);
                    }
                    curImage.css({
                        float: '',
                        width: '',
                        height: ''
                    });
                    if(o.autoSize && !self._isFullSize()) {
                        self._resize(complete);
                    } else {
                        if($.isFunction(complete)) {
                            complete.apply(self);
                        }
                        self._refreshText();
                    }
                };
                slideOpts = {
                    mode: 'hide',
                    direction: direction === 'horizontal' ? (next ? 'left' : 'right') : (next ? 'up' : 'down'),
                    easing: animation.easing,
                    distance: direction === 'horizontal' ? w : h,
                    duration: animation.duration
                };
                if($.effects) {
                    wrapper.effect('slide', slideOpts, slideCallback);
                } else {
                    self._slideAnimate(slideOpts, wrapper, slideCallback);
                }
            };
            wijlightbox.prototype._moveFrom = function (rect, animation, complete) {
                var self = this, o = this.options, toRect;
                if($.isFunction(animation)) {
                    complete = animation;
                    animation = $.extend({
                    }, self._defaults.resizeAnimation, o.resizeAnimation);
                } else {
                    animation = $.extend({
                    }, self._defaults.resizeAnimation, o.resizeAnimation, animation);
                }
                self._removeText();
                if(animation.animated === 'none' || animation.duration <= 0) {
                    self._createText();
                    if($.isFunction(complete)) {
                        complete.apply(self);
                    }
                    this.container.data('moving.wijlightbox', false);
                    return;
                }
                toRect = $.extend({
                    width: self.frame.width(),
                    height: self.frame.height()
                }, self.container.offset());
                self.frame.width(rect.width).height(rect.height);
                self.container.css({
                    left: rect.left,
                    top: rect.top,
                    width: self.frame.outerWidth(),
                    position: 'absolute',
                    opacity: ''
                });
                self._moveTo(toRect, animation, function () {
                    self.frame.width(toRect.width);
                    self.container.width(self.frame.outerWidth());
                    self._createText();
                    self.container.data('moving.wijlightbox', false);
                    if($.isFunction(complete)) {
                        complete.apply(self);
                    }
                });
            };
            wijlightbox.prototype._moveTo = function (rect, animation, complete) {
                var self = this, o = this.options;
                if($.isFunction(animation)) {
                    complete = animation;
                    animation = $.extend({
                    }, self._defaults.resizeAnimation, o.resizeAnimation);
                } else {
                    animation = $.extend({
                    }, self._defaults.resizeAnimation, o.resizeAnimation, animation);
                }
                var hd = animation.duration / 2, animated = animation.animated, movePos = self._isOpen(), pos1 = animated === 'wh' ? {
                    left: rect.left,
                    top: undefined
                } : {
                    top: rect.top
                }, pos2 = animated === 'wh' ? {
                    top: rect.top,
                    left: undefined
                } : {
                    left: rect.left
                }, size1 = animated === 'wh' ? {
                    width: rect.width,
                    height: undefined
                } : {
                    height: rect.height
                }, size2 = animated === 'wh' ? {
                    height: rect.height,
                    width: undefined
                } : {
                    width: rect.width
                };
                if(animated === 'wh' || animated === 'hw') {
                    if(movePos) {
                        self.container.animate(pos1, {
                            duration: hd,
                            easing: animation.easing,
                            queue: true
                        });
                    }
                    self.frame.animate(size1, {
                        duration: hd,
                        easing: animation.easing,
                        complete: function () {
                            if(movePos) {
                                self.container.animate(pos2, {
                                    duration: hd,
                                    easing: animation.easing,
                                    queue: true
                                });
                            }
                            self.frame.animate(size2, {
                                duration: hd,
                                easing: animation.easing,
                                complete: function () {
                                    self.container.data('moving.wijlightbox', false);
                                    if($.isFunction(complete)) {
                                        complete.apply(self);
                                    }
                                }
                            });
                        }
                    });
                    return;
                }
                if(movePos) {
                    self.container.animate({
                        left: rect.left,
                        top: rect.top
                    }, {
                        duration: animation.duration,
                        easing: animation.easing,
                        queue: true
                    });
                }
                self.frame.animate({
                    width: rect.width,
                    height: rect.height,
                    opacity: 1
                }, {
                    duration: animation.duration,
                    easing: animation.easing,
                    complete: function () {
                        self.container.data('moving.wijlightbox', false);
                        if($.isFunction(complete)) {
                            complete.apply(self);
                        }
                    }
                });
            };
            wijlightbox.prototype.show = /** Shows the content in specified index.
            * @example $("#id").wijlightbox('show');
            * @param {number} index The zero-based index of the picture to show.
            */
            function (index) {
                this._show(index);
                return this;
            };
            wijlightbox.prototype._resize = function (complete) {
                var self = this, rect = $.extend({
                }, self.container.offset(), {
                    width: self.frame.width(),
                    height: self.frame.height()
                });
                self._size();
                if(self._isOpen()) {
                    self._position();
                }
                self._moveFrom(rect, complete);
            };
            wijlightbox.prototype._onAfterShow = function () {
                var self = this, o = this.options, data;
                self._refreshNavButtons();
                self.container.data('animating.wijlightbox', false);
                if(!o.modal) {
                    self._hideOverlay();
                }
                data = {
                    index: o.activeIndex,
                    item: o.groupItems[o.activeIndex]
                };
                self._trigger('show', null, data);
                self._startTimer();
            };
            wijlightbox.prototype._show = function (item, next, complete) {
                var self = this, o = this.options, sq, index;
                if(this.container.data('showing.wijlightbox')) {
                    sq = [
                        function () {
                            self._show(item, next, complete);
                        }                    ];
                    this.container.queue('showqueue', sq);
                    return this;
                }
                index = o.activeIndex;
                if(!$.isPlainObject(item)) {
                    index = item;
                    if(index < 0 || index >= o.groupItems.length) {
                        return this;
                    }
                    item = o.groupItems[index];
                }
                if(item) {
                    this.container.data('item.wijlightbox', item);
                }
                if(this._groupMode()) {
                    this._preload();
                }
                if($.isFunction(next)) {
                    complete = next;
                    next = undefined;
                }
                if(!complete) {
                    complete = self._onAfterShow;
                }
                var data = {
                    index: index,
                    item: item
                };
                if(self._trigger('beforeShow', null, data) === false) {
                    return this;
                }
                this.container.data('showing.wijlightbox', true);
                var cleanup = function () {
                    if($.isFunction(complete)) {
                        complete.apply(self);
                    }
                    self.container.data('showing.wijlightbox', false);
                    self.container.dequeue('showqueue');
                    self.container.clearQueue('showqueue');
                };
                self._refreshCounter(index);
                var prevPlayer = this.container.data('player.wijlightbox'), player, onload = function () {
                    self.container.data('playerwidth.wijlightbox', player.width);
                    self.container.data('playerheight.wijlightbox', player.height);
                    var animation = $.extend({
                    }, self._defaults.transAnimation, o.transAnimation);
                    if(o.activeIndex === index || animation.animated === 'none' || animation.duration <= 0 || !self._isOpen()) {
                        o.activeIndex = index;
                        if(prevPlayer) {
                            prevPlayer.remove();
                        }
                        player.appendTo(self.content);
                        self._refreshText();
                        cleanup();
                        return;
                    }
                    if(o.cookie) {
                        self._cookie(o.activeIndex, o.cookie);
                    }
                    if(animation.animated === 'slide') {
                        next = (next === undefined) ? (index > o.activeIndex) : next;
                        self._slideTo(prevPlayer, player, animation, next, cleanup);
                        o.activeIndex = index;
                    } else {
                        o.activeIndex = index;
                        var fadeIn = function () {
                            if(player) {
                                player.appendTo(self.content, true);
                                player.fadeIn(animation.duration, cleanup);
                            }
                        };
                        if($.browser.msie) {
                            self.frame.trigger('mouseleave');
                        }
                        var onFadeOut = function () {
                            if(prevPlayer) {
                                prevPlayer.remove();
                            }
                            if(o.autoSize && !self._isFullSize()) {
                                self._resize(fadeIn);
                            } else {
                                fadeIn();
                                self._refreshText();
                            }
                        };
                        if(prevPlayer) {
                            prevPlayer.fadeOut(animation.duration * 0.4, onFadeOut);
                        } else {
                            onFadeOut();
                        }
                    }
                };
                player = this._createPlayer(item, onload);
                return this;
            };
            wijlightbox.prototype.next = /** Moves to the next panel.*/
            function () {
                var o = this.options;
                if(!this._groupMode()) {
                    return false;
                }
                var index = o.activeIndex + 1;
                if(o.loop) {
                    index = index % o.groupItems.length;
                }
                if(index < o.groupItems.length) {
                    this._show(index, true);
                    return true;
                }
                return false;
            };
            wijlightbox.prototype.back = /** Moves to the previous panel.*/
            function () {
                var o = this.options;
                if(!this._groupMode()) {
                    return false;
                }
                var index = o.activeIndex - 1;
                if(o.loop) {
                    index = index < 0 ? o.groupItems.length - 1 : index;
                }
                if(index >= 0) {
                    this._show(index, false);
                    return true;
                }
                return false;
            };
            wijlightbox.prototype.adjustPosition = /**
            * Adjust the position of lightbox according to the "position" option set it originally to a new location. .
            * It is usually called after window resized.
            */
            function () {
                this._position();
            };
            wijlightbox.prototype.isPlaying = /**
            * Determines whether the lightbox is currently displaying images automatically.See the play method for more information.
            * @returns {boolean} A value that indicate whether it is playing.
            */
            function () {
                return !!this.container.data('playing.wijlightbox');
            };
            wijlightbox.prototype._startTimer = function () {
                if(!this.isPlaying() || !this._groupMode()) {
                    return;
                }
                var o = this.options, self = this, width;
                if(o.showTimer === true) {
                    if(!this.timerMeter) {
                        this._createTimerBar();
                    }
                    width = this.timerBar.width();
                    self.timerMeter.width('0');
                    self.timerMeter.animate({
                        width: width
                    }, o.delay, null, function () {
                        if(self.isPlaying() && !self.next()) {
                            self.stop();
                        }
                    });
                } else {
                    window.setTimeout(function () {
                        if(self.isPlaying() && !self.next()) {
                            self.stop();
                        }
                    }, o.delay);
                }
            };
            wijlightbox.prototype.play = /** Starts displaying the images in order automatically.*/
            function () {
                if(!this._groupMode()) {
                    return false;
                }
                if(!this.container.data('playing.wijlightbox')) {
                    this.container.data('playing.wijlightbox', true);
                }
                this._refreshCtrlButtons();
                this._hideNavButtons();
                this._startTimer();
            };
            wijlightbox.prototype.stop = /** Stops the slide playing mode.*/
            function () {
                this.container.removeData('playing.wijlightbox');
                this._refreshCtrlButtons();
                this._removeTimerBar();
            };
            wijlightbox.prototype._size = function (size, calcOnly) {
                var o = this.options, width = o.width, height = o.height, playerWidth = o.autoSize ? (this.container.data('playerwidth.wijlightbox') || width) : width, playerHeight = o.autoSize ? (this.container.data('playerheight.wijlightbox') || height) : height, player, ratio = playerHeight / playerWidth;
                if(typeof size === 'boolean') {
                    calcOnly = size;
                } else if($.isPlainObject(size) && ('width' in size) && ('height' in size)) {
                    width = size.width;
                    height = size.height;
                } else {
                    player = this.container.data('player.wijlightbox');
                    if(o.autoSize && (player && player.name === 'img')) {
                        if(playerWidth > width) {
                            playerWidth = width;
                            playerHeight = Math.round(width * ratio);
                        }
                        if(playerHeight > height) {
                            playerHeight = height;
                            playerWidth = Math.round(height / ratio);
                        }
                    }
                    width = playerWidth;
                    height = playerHeight;
                    if(calcOnly) {
                        return {
                            width: width,
                            height: height
                        };
                    }
                }
                this.frame.width(width).height(height);
                this.container.width(this.frame.outerWidth(true));
            };
            wijlightbox.prototype._position = function () {
                var o = this.options, myAt = [], offset = [
                    0, 
                    0
                ], isVisible, pos = o.position;
                if(pos) {
                    // deep extending converts arrays to objects in jQuery <= 1.3.2 :-(
                    if(typeof pos === 'string' || (typeof pos === 'object' && '0' in pos)) {
                        myAt = pos.split ? pos.split(' ') : [
                            pos[0], 
                            pos[1]
                        ];
                        if(myAt.length === 1) {
                            myAt[1] = myAt[0];
                        }
                        $.each([
                            'left', 
                            'top'
                        ], function (i, offsetPosition) {
                            if(+myAt[i] === myAt[i]) {
                                offset[i] = myAt[i];
                                myAt[i] = offsetPosition;
                            }
                        });
                        pos = {
                            my: myAt.join(" "),
                            at: myAt.join(" "),
                            offset: offset.join(" ")
                        };
                    }
                    pos = $.extend({
                    }, o.position, pos);
                }
                // need to show the dialog to get the actual offset in the position plugin
                isVisible = this.container.is(':visible');
                if(!isVisible) {
                    this.container.show();
                }
                this.container.css(// workaround for jQuery bug #5781 http://dev.jquery.com/ticket/5781
                {
                    top: 0,
                    left: 0
                }).position(pos);
                if(!isVisible) {
                    this.container.hide();
                }
            };
            wijlightbox.prototype._getRelRect = function (rel) {
                var rect;
                if(rel) {
                    if($.isPlainObject(rel) && ('left' in rel) && ('top' in rel) && ('width' in rel) && ('height' in rel)) {
                        rect = $.merge({
                        }, rel);
                    } else {
                        rel = $(rel);
                    }
                    if(rel.jquery && rel.length) {
                        rect = $.extend({
                        }, rel.offset(), {
                            width: rel.width(),
                            height: rel.height()
                        });
                    }
                }
                return rect;
            };
            wijlightbox.prototype._close = function (rel) {
                var o = this.options, self = this, rect, data, complete;
                if(!this._isOpen()) {
                    return;
                }
                data = {
                    rel: rel
                };
                if(false === this._trigger('beforeClose', null, data)) {
                    return;
                }
                rel = data.rel;
                if(!rel && this._groupMode()) {
                    rel = o.groupItems[o.activeIndex].img;
                }
                this.container.data('moving.wijlightbox', true);
                this._hideAccessories(false);
                this._hideWaiting();
                this._hideOverlay();
                this.stop();
                complete = function () {
                    self._removePlayer();
                    self.container.hide();
                    self._trigger('close');
                    self.container.unbind('keypress.wijlightbox');
                    self.container.removeData('open.wijlightbox').removeData('rect.wijlightbox').removeData('moving.wijlightbox').removeData('fullsize.wijlightbox');
                    $(document).unbind('keydown.wijlightbox').unbind('click.wijlightbox');
                };
                rect = this._getRelRect(rel);
                if(!rect) {
                    if(this.container.data('rect.wijlightbox')) {
                        rect = this.container.data('rect.wijlightbox');
                    }
                }
                this._removeText();
                if(rect) {
                    this._moveTo(rect, {
                        animated: 'sync',
                        duration: 200
                    }, complete);
                    return;
                }
                complete.call();
                return this;
            };
            wijlightbox.prototype._isOpen = function () {
                return !!this.container.data('open.wijlightbox');
            };
            wijlightbox.prototype._open = function (rel, item) {
                if(this._isOpen()) {
                    return;
                }
                var o = this.options, self = this;
                if(this.toolBox) {
                    if(this._isFullSize()) {
                        this.toolBox.css({
                            top: '2px',
                            right: '4px'
                        });
                    } else {
                        this.toolBox.css({
                            top: '',
                            right: ''
                        });
                    }
                }
                var complete = function () {
                    if(o.modal) {
                        self._showOverlay();
                    }
                    if(o.showControlsOnHover) {
                        this._hideAccessories(false);
                    } else {
                        this._showAccessories(false);
                    }
                    var rect = self._getRelRect(rel);
                    self.container.css('opacity', 0);
                    self.container.show();
                    self._size();
                    self._createText(true);
                    self._refreshText(true);
                    self._position();
                    self.container.data('open.wijlightbox', true);
                    if(rel && rect) {
                        self.container.data('rect.wijlightbox', rect);
                        self._moveFrom(rect, {
                            animated: 'sync'
                        });
                    } else {
                        var animation = $.extend({
                        }, self._defaults.transAnimation, o.transAnimation);
                        if(animation.animated === 'fade') {
                            self.container.hide();
                            self.container.fadeIn(animation.duration, function () {
                                self._createText();
                            });
                        } else {
                            self._createText();
                        }
                        this.container.data('moving.wijlightbox', false);
                    }
                    $(document).bind('keydown.wijlightbox', $.proxy(self, '_keyDownHandler')).bind('click.wijlightbox', function (e) {
                        var srcElement = e.target || e.srcElement;
                        if(self._isOpen() && !!o.closeOnOuterClick) {
                            if(srcElement !== self.container.get(0) && $(srcElement).parents().index(self.container) < 0) {
                                self._close();
                            }
                        }
                    });
                    if(o.autoPlay) {
                        this.play();
                    }
                    self._refreshNavButtons();
                    self._refreshDialogButtons();
                    var data = {
                        index: o.activeIndex,
                        item: o.groupItems[o.activeIndex]
                    };
                    self._trigger('show', null, data);
                    self._trigger('open');
                };
                this.container.data('moving.wijlightbox', true);
                this._show(item, true, complete);
                return this;
            };
            wijlightbox.prototype._getWinRect = function () {
                var $win = $(window);
                return $.extend({
                    width: $win.width(),
                    height: $win.height()
                }, $win.offset() || {
                    left: 2,
                    top: 2
                });
            };
            wijlightbox.prototype._resizeHandler = function () {
                var self = this;
                self._removeText();
                self._size(self._getWinRect());
                self._createText();
            };
            wijlightbox.prototype._isFullSize = function () {
                return !!this.container.data('fullsize.wijlightbox');
            };
            wijlightbox.prototype._toggleFullSize = function () {
                var self = this, $win = $(window);
                if(!self._isOpen()) {
                    return;
                }
                if(this._isFullSize()) {
                    if(self.toolBox) {
                        self.toolBox.css({
                            top: '',
                            right: ''
                        });
                    }
                    this.container.data('fullsize.wijlightbox', false);
                    $win.unbind('resize.wijlightbox', $.proxy(this, '_resizeHandler'));
                    self._resize(function () {
                        self._adjustPlayerSize(self.content.innerWidth(), self.content.innerHeight());
                    });
                } else {
                    this.container.data('fullsize.wijlightbox', true);
                    $win.bind('resize.wijlightbox', $.proxy(this, '_resizeHandler'));
                    var toRect = self._getWinRect(), bd = this.frame.borderSize();
                    toRect.width -= bd.width;
                    toRect.height -= bd.height;
                    self._removeText();
                    self._moveTo(toRect, {
                        animated: 'sync'
                    }, function () {
                        if(self.toolBox) {
                            self.toolBox.css({
                                top: '2px',
                                right: '4px'
                            });
                        }
                        self.frame.width(toRect.width);
                        self.container.width(self.frame.outerWidth());
                        self._createText();
                        self._adjustPlayerSize(self.content.innerWidth(), self.content.innerHeight());
                    });
                }
                this._refreshDialogButtons();
            };
            wijlightbox.prototype._getExt = function (url) {
                var ext, m, regExt = /[0-9a-z]+$/i, q = url.indexOf("?");
                if(q > -1) {
                    url = url.substring(0, q);
                }
                m = url.match(regExt);
                if(m) {
                    ext = m[0].toLowerCase();
                }
                return ext;
            };
            wijlightbox.prototype._getPlayerName = function (url) {
                if(url.indexOf("#") === 0 || (url.indexOf("#") > 0 && url.indexOf(document.location.href) === 0)) {
                    return "inline";
                }
                var imgExt = [
                    "bmp", 
                    "gif", 
                    "jpg", 
                    "jpeg", 
                    "png"
                ], swfExt = [
                    "swf"
                ], flvExt = [
                    "flv", 
                    "m4v"
                ], qtExt = [
                    "dv", 
                    "mov", 
                    "moov", 
                    "movie", 
                    "mp4", 
                    "avi", 
                    "mpg", 
                    "mpeg"
                ], wmpExt = [
                    "asf", 
                    "avi", 
                    "mpg", 
                    "mpeg", 
                    "wm", 
                    "wmv"
                ], html5Video = [
                    "mp4", 
                    "mpg", 
                    "mpeg", 
                    "ogg", 
                    "ogv"
                ], ext = this._getExt(url);
                if(ext) {
                    if($.inArray(ext, imgExt) >= 0) {
                        return "img";
                    }
                    if($.inArray(ext, swfExt) >= 0) {
                        return "swf";
                    }
                    if($.inArray(ext, flvExt) >= 0) {
                        return "flv";
                    }
                    if($.inArray(ext, wmpExt) >= 0) {
                        return "wmp";
                    }
                    if($.inArray(ext, qtExt) >= 0) {
                        return "qt";
                    }
                    if($.inArray(ext, html5Video) >= 0) {
                        return "wijvideo";
                    }
                }
                return "iframe";
            };
            wijlightbox.prototype._adjustPlayerSize = function (width, height) {
                var player = this.container.data('player.wijlightbox');
                if(player && player.adjustSize) {
                    player.adjustSize(width, height);
                }
            };
            wijlightbox.prototype._removePlayer = function () {
                var player = this.container.data('player.wijlightbox');
                if(player) {
                    player.remove();
                    this.container.data('player.wijlightbox', null);
                }
            };
            wijlightbox.prototype._createPlayer = function (item, onload, onerror) {
                var playerName = item.player;
                if(!$.isFunction($.wijmo.wijlightbox[playerName])) {
                    throw "unknown player " + playerName;
                }
                var self = this, cached = false, player, handleLoad = function () {
                    cached = true;
                    this._hideWaiting();
                    if($.isFunction(onload)) {
                        window.setTimeout(function () {
                            onload.apply(self);
                        }, 1);
                    }
                }, handlerError = function () {
                    this._hideWaiting();
                    if($.isFunction(onerror)) {
                        onerror.apply(self);
                    }
                };
                player = new $.wijmo.wijlightbox[playerName](this, item, handleLoad, handlerError);
                this.container.data('player.wijlightbox', player);
                window.setTimeout(function () {
                    if(cached === false) {
                        self._showWaiting();
                    }
                }, 200);
                return player;
            };
            return wijlightbox;
        })(wijmo.wijmoWidget);
        lightbox.wijlightbox = wijlightbox;        
        var wijlightbox_options = (function () {
            function wijlightbox_options() {
                /** wijMobileCSS
                * @ignore
                */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-c",
                    stateDefault: "ui-btn-up-a",
                    stateHover: "ui-btn-down-a",
                    stateActive: "ui-btn-down-a",
                    iconPlay: "ui-icon-arrow-r",
                    iconPause: "ui-icon-grid"
                };
                /** Selector option for auto self initialization.
                *	This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijlightbox')";
                /**	Determines the position of text description.
                * Possible values are:
                * 'inside', 'outside', 'overlay', 'titleOverlay' and 'none'
                * @type {string}
                * @example
                *  $("#id").wijlightbox({
                *      textPosition: 'titleOverlay'
                *  });
                */
                this.textPosition = 'overlay';
                /**	Determines the maximum width of the content.
                * @example
                *  $("#id").wijlightbox({
                *      width: 800
                *  });
                */
                this.width = 600;
                /**	Determines the maximum height of the content.
                * @example
                *  $("#id").wijlightbox({
                *      height: 500
                *  });
                */
                this.height = 400;
                /**	A value determines whether to auto-size to
                * keep the original width/height ratio of content.
                * @example
                *  $("#id").wijlightbox({
                *      autoSize: false
                *  });
                */
                this.autoSize = true;
                /**	Determines the name of player to host the content.
                * Possible values are:
                * 'inline', 'iframe', 'img', 'swf', 'flv', 'wmp', 'qt', 'wijvideo'
                * @example
                *  $("#id").wijlightbox({
                *      player: 'img'
                *  });
                */
                this.player = '';
                /**	Determines the array of data items.
                * @example
                *  $("#id").wijlightbox({
                *      groupItems: []
                *  });
                */
                this.groupItems = null;
                /**	Determines the root url for each item.
                */
                this.rootUrl = '';
                /**	Determines the visibility of the control buttons.
                * Possible values are: 'play', 'stop' separated by '|'.
                * @example
                *  $("#id").wijlightbox({
                *      ctrlButtons: 'play|stop'
                *  });
                */
                this.ctrlButtons = '';
                /**	Determines the visibility of the dialog buttons.
                * Possible values are: 'close', 'fullSize' separated by '|'.
                * @example
                *  $("#id").wijlightbox({
                *      dialogButtons: 'close|fullSize'
                *  });
                */
                this.dialogButtons = 'close';
                /**	Determines the type counter style.
                * Possible values are: 'default', 'sequence'
                * @example
                *  $("#id").wijlightbox({
                *      counterType: 'sequence'
                *  });
                */
                this.counterType = 'default';
                /**	Determines the text format of counter.
                * '[i]' and '[n]' are built-in parameters represents
                * the current page index and the number of pages.
                * @example
                *  $("#id").wijlightbox({
                *      counterFormat: '[i]/[n]'
                *  });
                */
                this.counterFormat = '[i] of [n]';
                /**	Determines the maximum number of
                * digit buttons in sequence counter type.
                * @example
                *  $("#id").wijlightbox({
                *      counterLimit: 5
                *  });
                */
                this.counterLimit = 10;
                /**	Determines whether to display the counter.
                * @example
                *  $("#id").wijlightbox({
                *      showCounter: false
                *  });
                */
                this.showCounter = true;
                /**	Determines whether to display the navigation buttons.
                * @example
                *  $("#id").wijlightbox({
                *      showNavButtons: false
                *  });
                */
                this.showNavButtons = true;
                /**	Determines whether to display the time bar.
                * @example
                *  $("#id").wijlightbox({
                *      showTimer: true
                *  });
                */
                this.showTimer = false;
                /**	Determines the position of control buttons.
                * @remark Possible values are: 'inside', 'outside'
                * @example
                *  $("#id").wijlightbox({
                *      controlsPosition: 'outside'
                *  });
                */
                this.controlsPosition = 'inside';
                /**	Determines whether to display the control buttons only when hovering the mouse over the content.
                * @example
                *  $("#id").wijlightbox({
                *      showControlsOnHover: false
                *  });
                */
                this.showControlsOnHover = true;
                /**	Determines whether to pause the auto-play when clicking the content.
                * @example
                *  $("#id").wijlightbox({
                *      clickPause: true
                *  });
                */
                this.clickPause = false;
                /**	Determines whether to allow keyboard navigation.
                * @example
                *  $("#id").wijlightbox({
                *      keyNav: true
                *  });
                */
                this.keyNav = false;
                /**	Determines whether the window is modal.
                */
                this.modal = false;
                /**	Determines the pop-up position of content window.
                * Please see jquery.ui.position for possible options.
                * @type {object}
                */
                this.position = {
                    my: 'center',
                    at: 'center',
                    of: window,
                    collision: 'fit',
                    using: // ensure that the titlebar is never outside the document
                    function (pos) {
                        var topOffset = $(this).css(pos).offset().top;
                        if(topOffset < 0) {
                            $(this).css('top', pos.top - topOffset);
                        }
                    }
                };
                /**	Determines the z-index of popup container.
                */
                this.zIndex = 1000;
                /**	Determines whether to close the pop-up window
                * when a user presses the ESC key.
                */
                this.closeOnEscape = true;
                /**	Determines whether to close the pop-up window
                * when user clicks on the outside of content.
                */
                this.closeOnOuterClick = true;
                /**	Determines whether pages are automatically displayed in order.
                */
                this.autoPlay = false;
                /**	Determines the time span in milliseconds
                * between panels in autoplay mode.
                */
                this.delay = 2000;
                /**	Determines whether start from the first page
                * when reaching the end in autoplay mode.
                */
                this.loop = true;
                /**	Store the latest active index in a cookie.
                *	The cookie is then used to determine the initially active index
                * @type {object}
                * @remarks
                * if the activeIndex option is not defined.
                *	This requires cookie plugin.
                * The object needs to have key/value pairs of
                * the form the cookie plugin expects as options.
                * e.g. { expires: 7, path: '/', domain: 'jquery.com', secure: true }
                */
                this.cookie = null;
                /**	Determines the animation style when switching between pages.
                * Possible values are 'slide', 'fade', 'none'
                * @type {object}
                * @example
                *  $("#id").wijlightbox({
                *      transAnimation: {
                *         animated: slide
                *     }
                *  });
                */
                this.transAnimation = {
                    animated: "fade",
                    duration: 400,
                    easing: 'linear'
                };
                /**	Determines the slide direction.
                * Possible values are: 'horizontal', 'vertical'
                * @example
                *  $("#id").wijlightbox({
                *      slideDirection: 'vertical'
                *  });
                */
                this.slideDirection = 'horizontal';
                /**	Determines the animation style when resizing.
                * @type {object}
                * @example
                *  $("#id").wijlightbox({
                *      resizeAnimation: { animated: 'wh'}
                *  });
                */
                this.resizeAnimation = {
                    animated: 'sync',
                    duration: 400
                };
                /**	Determines the animation style when showing the text.
                
                * @type {object}
                * @example
                *  $("#id").wijlightbox({
                *      textShowOption: {
                *         duration: 500,
                *         easing: 'linear'
                *     }
                *  });
                */
                this.textShowOption = {
                    duration: 300,
                    easing: 'linear'
                };
                /**	Determines the animation style when hidding the text.
                * @type {object}
                * @example
                *  $("#id").wijlightbox({
                *      textHideOption: {
                *         duration: 500,
                *         easing: 'linear'
                *     }
                *  });
                */
                this.textHideOption = {
                    duration: 300,
                    easing: 'linear'
                };
                /**	Determines whether to turn on the movie controls in movie player.
                */
                this.showMovieControls = true;
                /**	Determines whether to turn on the autoplay option in movie player.
                */
                this.autoPlayMovies = true;
                /**	Determines a hash object that contains parameters for a flash object.
                * @type {object}
                * @example
                *  $("#id").wijlightbox({
                *      flashParams: {
                *         autostart: true,
                *		    allowscriptaccess: 'always'
                *     }
                *  });
                */
                this.flashParams = {
                    bgcolor: "#000000",
                    allowfullscreen: true
                };
                /**	Determines a hash object that contains variants for a flash object.
                * @type {object}
                * @example
                *  $("#id").wijlightbox({
                *      flashVars: {
                *         backcolor: "0x000000",
                *         frontcolor: "0xCCCCCC"
                *     }
                *  });
                */
                this.flashVars = {
                };
                /**	Version of Flash object.
                * @type {string}
                * @example
                *  $("#id").wijlightbox({
                *      flashVersion: "9.0.115"
                *  });
                */
                this.flashVersion = "9.0.115";
                /**	Determines the relative path and name of the flash vedio player.
                * @example
                *  $("#id").wijlightbox({
                *      flvPlayer: "player\\myplayer.swf"
                *  });
                */
                this.flvPlayer = 'player\\player.swf';
                /**	Determines the relative path and name of the flash installation guide.
                * @example
                *  $("#id").wijlightbox({
                *      flashInstall: "player\\installFlash.swf"
                *  });
                */
                this.flashInstall = 'player\\expressInstall.swf';
                /** The beforeShow event handler.
                * A function called before a page's content is shown.
                * @event
                */
                this.beforeShow = null;
                /** The show event handler.
                * A function called after a page's content is shown.
                * @event
                */
                this.show = null;
                /** The open event handler.
                * A function called after the popped up container is opened.
                * @event
                */
                this.open = null;
                /** The showbeforeClose event handler.
                * A function called before the popped up container is closed.
                * @event
                */
                this.beforeClose = null;
                /** The close event handler.
                * A function called after the popped up container is closed.
                * @event
                */
                this.close = null;
            }
            return wijlightbox_options;
        })();        
        wijlightbox.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijlightbox_options());
        $.wijmo.registerWidget("wijlightbox", wijlightbox.prototype);
        $.extend($.wijmo.wijlightbox, {
            img: function (lightbox, item, onload, onerror) {
                this.name = 'img';
                this.lightbox = lightbox;
                this.item = item;
                this.url = this.lightbox._getUrl(item);
                var self = this;
                $('<img></img>').css({
                    width: 'auto',
                    height: 'auto',
                    display: 'none'
                }).appendTo(document.body).bind({
                    'load': function () {
                        var img = $(this);
                        self.width = item.width ? parseInt(item.width, 10) : img.width();
                        self.height = item.height ? parseInt(item.height, 10) : img.height();
                        img.remove();
                        if(onload && $.isFunction(onload)) {
                            onload.apply(lightbox);
                        }
                    },
                    'error': function () {
                        $(this).remove();
                        if(onerror && $.isFunction(onerror)) {
                            onerror.apply(lightbox);
                        }
                    }
                }).attr('src', this.url);
            },
            swf: function (lightbox, item, onload, onerror) {
                this.name = 'swf';
                var lo = lightbox.options;
                this.id = 'flashhost';
                this.lightbox = lightbox;
                this.item = item;
                this.url = this.lightbox._getUrl(item);
                this.width = item.width ? parseInt(item.width, 10) : lo.width;
                this.height = item.height ? parseInt(item.height, 10) : lo.height;
                if(onload && $.isFunction(onload)) {
                    onload.apply(lightbox);
                }
            },
            iframe: function (lightbox, item, onload, onerror) {
                this.name = 'swf';
                this.lightbox = lightbox;
                this.item = item;
                this.url = this.lightbox._getUrl(item);
                if(item.width) {
                    this.width = parseInt(item.width, 10);
                }
                if(item.height) {
                    this.height = parseInt(item.height, 10);
                }
                this.$iframe = $('<iframe></iframe>').addClass('wijmo-wijlightbox-iframe').attr({
                    frameborder: '0',
                    marginwidth: '0',
                    marginheight: '0',
                    scrolling: 'auto',
                    allowtransparency: 'true'
                }).hide().appendTo(lightbox.content).bind('load', function () {
                    if(onload && $.isFunction(onload)) {
                        onload.apply(lightbox);
                    }
                }).attr('src', this.url);
            },
            inline: function (lightbox, item, onload, onerror) {
                this.name = 'inline';
                var lo = lightbox.options, css = lo.wijCSS, frameCSS = "wijmo-wijlightbox-frame " + css.content;
                " " + css.cornerAll + " " + css.helperClearFix;
                this.lightbox = lightbox;
                this.item = item;
                this.width = item.width ? parseInt(item.width, 10) : lo.width;
                if(item.height) {
                    this.height = parseInt(item.height, 10);
                } else {
                    var $temp = $(this.item.href).clone().show().append('<br clear="all" />').wrap('<div class="wijmo-wijlightbox ' + css.widget + '">' + '<div class="' + frameCSS + '">' + '<div class="' + frameCSS + '">' + '<div class="wijmo-wijlightbox-content"> ' + '</div></div></div></div>').appendTo(document.body).width(this.width);
                    this.height = $temp.outerHeight(true) + 10;
                    $temp.unwrap();
                    $temp.remove();
                }
                if(onload && $.isFunction(onload)) {
                    onload.apply(lightbox);
                }
            },
            flv: function (lightbox, item, onload, onerror) {
                this.name = 'flv';
                var lo = lightbox.options;
                this.id = 'flvhost';
                this.lightbox = lightbox;
                this.item = item;
                this.url = this.lightbox._getUrl(item);
                var jwControllerHeight = 20;
                this.width = item.width ? parseInt(item.width, 10) : lo.width;
                this.height = item.height ? parseInt(item.height, 10) : lo.height;
                if(lo.showMovieControls) {
                    this.height += jwControllerHeight;
                }
                if(onload && $.isFunction(onload)) {
                    onload.apply(lightbox);
                }
            },
            wmp: function (lightbox, item, onload, onerror) {
                var lo = lightbox.options, wmpControllerHeight;
                this.name = 'wmp';
                this.id = 'wmphost';
                this.lightbox = lightbox;
                this.item = item;
                this.url = this.lightbox._getUrl(item);
                wmpControllerHeight = ($.browser.msie ? 70 : 45);
                this.width = item.width ? parseInt(item.width, 10) : lo.width;
                this.height = item.height ? parseInt(item.height, 10) : lo.height;
                if(lo.showMovieControls) {
                    this.height += wmpControllerHeight;
                }
                if(onload && $.isFunction(onload)) {
                    onload.apply(lightbox);
                }
            },
            qt: function (lightbox, item, onload, onerror) {
                var lo = lightbox.options, qtControllerHeight = 16;
                this.name = 'qt';
                this.id = 'qthost';
                this.lightbox = lightbox;
                this.item = item;
                this.url = this.lightbox._getUrl(item);
                this.width = item.width ? parseInt(item.width, 10) : lo.width;
                this.height = item.height ? parseInt(item.height, 10) : lo.height;
                if(lo.showMovieControls) {
                    this.height += qtControllerHeight;
                }
                if(onload && $.isFunction(onload)) {
                    onload.apply(lightbox);
                }
            },
            wijvideo: function (lightbox, item, onload, onerror) {
                var lo = lightbox.options;
                this.name = 'wijvideo';
                this.id = 'wijvideohost';
                this.lightbox = lightbox;
                this.item = item;
                this.url = this.lightbox._getUrl(item);
                this.wijvideosrc = (!!item.wijvideosrc && item.wijvideosrc !== "") ? this.lightbox._getUrl(item.wijvideosrc) : null;
                this.width = item.width ? parseInt(item.width, 10) : lo.width;
                this.height = item.height ? parseInt(item.height, 10) : lo.height;
                if(onload && $.isFunction(onload)) {
                    onload.apply(lightbox);
                }
            }
        });
        $.extend($.wijmo.wijlightbox.img.prototype, {
            appendTo: function ($content, hidden) {
                this.$element = $('<img></img>').addClass('wijmo-wijlightbox-image').attr('src', this.url);
                if(hidden) {
                    this.$element.hide();
                }
                if(this.lightbox.options.transAnimation && this.lightbox.options.transAnimation.animated == "fade") {
                    //fixed bug 20925
                    //"fade" animation will not clean the prev element sometimes.
                    if($content.children().length) {
                        $content.empty();
                    }
                    this.$element.prependTo($content);
                } else {
                    this.$element.appendTo($content);
                }
            },
            remove: function () {
                if(this.$element) {
                    this.$element.remove();
                }
            },
            fadeOut: function (duration, complete) {
                if(this.$element) {
                    this.$element.fadeOut(duration, complete);
                }
            },
            fadeIn: function (duration, complete) {
                if(this.$element) {
                    this.$element.fadeIn(duration, complete);
                }
            },
            getElement: function () {
                return this.$element;
            }
        });
        $.extend($.wijmo.wijlightbox.swf.prototype, {
            appendTo: function ($content) {
                this.$container = $('<div/>').css({
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                }).attr('id', this.id).appendTo($content);
                var lo = this.lightbox.options, express = lo.flashInstall, version = lo.flashVersion, flashvars = lo.flashVars, params = lo.flashParams;
                S.flash.embedSWF(this.item.href, this.id, '100%', '100%', version, express, flashvars, params);
            },
            remove: function () {
                S.flash.expressInstallCallback();
                S.flash.removeSWF(this.id);
                this.$container.remove();
            },
            fadeOut: function (duration, complete) {
                if(this.$container) {
                    this.$container.fadeOut(duration, complete);
                }
            },
            fadeIn: function (duration, complete) {
                if(this.$container) {
                    this.$container.fadeIn(duration, complete);
                }
            },
            getElement: function () {
                return this.$container;
            }
        });
        $.extend($.wijmo.wijlightbox.iframe.prototype, {
            appendTo: function ($content, hidden) {
                if(!hidden) {
                    this.$iframe.show();
                }
            },
            remove: function () {
                if(this.$iframe) {
                    this.$iframe.remove();
                }
            },
            fadeOut: function (duration, complete) {
                if(this.$iframe) {
                    this.$iframe.fadeOut(duration, complete);
                }
            },
            fadeIn: function (duration, complete) {
                if(this.$iframe) {
                    this.$iframe.fadeIn(duration, complete);
                }
            },
            getElement: function () {
                return this.$iframe;
            }
        });
        $.extend($.wijmo.wijlightbox.inline.prototype, {
            appendTo: function ($content, hidden) {
                this.$element = $(this.item.href).clone().appendTo($content);
                if(!hidden) {
                    this.$element.show();
                }
            },
            remove: function () {
                if(this.$element) {
                    this.$element.remove();
                }
            },
            fadeOut: function (duration, complete) {
                if(this.$element) {
                    this.$element.fadeOut(duration, complete);
                }
            },
            fadeIn: function (duration, complete) {
                if(this.$element) {
                    this.$element.fadeIn(duration, complete);
                }
            },
            getElement: function () {
                return this.$element;
            }
        });
        $.extend($.wijmo.wijlightbox.flv.prototype, {
            appendTo: function ($content) {
                this.$container = $('<div/>').css({
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                }).attr('id', this.id).appendTo($content);
                var lo = this.lightbox.options, width = '100%', height = '100%', swf = lo.flvPlayer, express = lo.flashInstall, version = lo.flashVersion, flashvars = $.extend({
                    file: this.url,
                    width: width,
                    height: height,
                    autostart: (lo.autoPlayMovies ? 'true' : 'false'),
                    controlbar: (lo.showMovieControls ? 'bottom' : "none"),
                    backcolor: "0x000000",
                    frontcolor: "0xCCCCCC",
                    lightcolor: "0x557722"
                }, lo.flashVars), params = $.extend({
                    autostart: (lo.autoPlayMovies ? 'true' : 'false'),
                    allowscriptaccess: 'always'
                }, lo.flashParams);
                S.flash.embedSWF(swf, this.id, width, height, version, express, flashvars, params);
            },
            remove: function () {
                S.flash.expressInstallCallback();
                S.flash.removeSWF(this.id);
                this.$container.remove();
            },
            fadeOut: function (duration, complete) {
                if(this.$container) {
                    this.$container.fadeOut(duration, complete);
                }
            },
            fadeIn: function (duration, complete) {
                if(this.$container) {
                    this.$container.fadeIn(duration, complete);
                }
            },
            getElement: function () {
                return this.$container;
            }
        });
        $.extend($.wijmo.wijlightbox.wmp.prototype, {
            appendTo: function ($content) {
                this.$container = $('<div/>').css({
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                }).appendTo($content);
                var lo = this.lightbox.options, movie = '<object id="' + this.id + '" name="' + this.id + '" height="' + this.height + '" width="' + this.width + '"', params = {
                    autostart: lo.autoPlayMovies ? 1 : 0,
                    url: undefined,
                    uimode: undefined,
                    showcontrols: undefined
                }, p;
                if($.browser.msie) {
                    movie += ' classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6"';
                    params.url = this.url;
                    params.uimode = lo.showMovieControls ? "full" : "none";
                } else {
                    movie += ' type="video/x-ms-wmv"';
                    movie += ' data="' + this.url + '"';
                    params.showcontrols = lo.showMovieControls ? 1 : 0;
                }
                movie += ">";
                for(p in params) {
                    movie += '<param name="' + p + '" value="' + params[p] + '">';
                }
                movie += "</object>";
                this.$container.html(movie);
            },
            remove: function () {
                if($.browser.msie) {
                    try  {
                        window[this.id].controls.stop();
                        window[this.id].URL = "movie" + now() + ".wmv";
                        window[this.id] = function () {
                        };
                    } catch (e) {
                    }
                }
                this.$container.remove();
            },
            fadeOut: function (duration, complete) {
                if(this.$container) {
                    this.$container.fadeOut(duration, complete);
                }
            },
            fadeIn: function (duration, complete) {
                if(this.$container) {
                    this.$container.fadeIn(duration, complete);
                }
            },
            getElement: function () {
                return this.$container;
            }
        });
        $.extend($.wijmo.wijlightbox.qt.prototype, {
            appendTo: function ($content, first) {
                this.$container = $('<div/>').css({
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                }).appendTo($content);
                var lo = this.lightbox.options, autoplay = lo.autoPlayMovies ? 'true' : 'false', controls = lo.showMovieControls ? 'true' : 'false', movie = $.browser.msie ? "<object" : "<embed", attrs = {
                    id: this.id,
                    name: this.id,
                    width: this.width,
                    height: this.height,
                    kioskmode: "true",
                    classid: undefined,
                    codebase: undefined,
                    type: undefined,
                    src: undefined,
                    autoplay: undefined,
                    controller: undefined
                }, m, p;
                if($.browser.msie) {
                    attrs.classid = "clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B";
                    attrs.codebase = "http://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0";
                } else {
                    attrs.type = "video/quicktime";
                    attrs.src = this.url;
                    attrs.autoplay = autoplay;
                    attrs.controller = controls;
                }
                for(m in attrs) {
                    if(attrs[m]) {
                        movie += " " + m + '="' + attrs[m] + '"';
                    }
                }
                movie += ">";
                if($.browser.msie) {
                    var params = {
                        src: this.url,
                        scale: "aspect",
                        controller: controls,
                        autoplay: autoplay
                    };
                    for(p in params) {
                        movie += '<param name="' + p + '" value="' + params[p] + '">';
                    }
                }
                movie += $.browser.msie ? "</object>" : "</embed>";
                if(first) {
                    //fixed bug 20988
                    $content.hide();
                }
                this.$container.html(movie);
                if(first) {
                    //fixed bug 20988
                    $content.show();
                }
            },
            remove: function () {
                try  {
                    document[this.id].Stop();
                    document[this.id] = null;
                } catch (e) {
                }
                this.$container.remove();
            },
            fadeOut: function (duration, complete) {
                complete.call();
                return;//?
                
                //			if (this.$container) {
                //				this.$container.fadeOut(duration, complete);
                //			}
                            },
            fadeIn: function (duration, complete) {
                complete.call();
                return;//?
                
                //			if (this.$container) {
                //				this.$container.fadeIn(duration, complete);
                //			}
                            },
            getElement: function () {
                return this.$container;
            }
        });
        $.extend($.wijmo.wijlightbox.wijvideo.prototype, {
            appendTo: function ($content) {
                var lo = this.lightbox.options;
                this.$container = $('<video/>').css({
                    overflow: 'hidden'
                }).attr({
                    width: this.width,
                    height: this.height,
                    autoPlay: (lo.autoPlayMovies ? 'true' : 'false'),
                    controls: (lo.showMovieControls ? 'controls' : '')
                }).appendTo($content);
                if(!!this.url) {
                    $('<source/>').attr({
                        src: this.url
                    }).appendTo(this.$container);
                }
                if(!!this.wijvideosrc) {
                    $('<source/>').attr({
                        src: this.wijvideosrc
                    }).appendTo(this.$container);
                }
                this.$container.wijvideo({
                    fullScreenButtonVisible: false
                });
            },
            remove: function () {
                this.$container.remove();
            },
            fadeOut: function (duration, complete) {
                if(this.$container) {
                    this.$container.fadeOut(duration, complete);
                }
            },
            fadeIn: function (duration, complete) {
                if(this.$container) {
                    this.$container.fadeIn(duration, complete);
                }
            },
            getElement: function () {
                return this.$container;
            },
            adjustSize: function (width, height) {
                this.$container.wijvideo('setWidth', width);
                this.$container.wijvideo('setHeight', height);
            }
        });
        $.extend($.wijmo.wijlightbox, {
            overlay: function (lightbox, waiting) {
                this.mask = $('<div></div>').addClass(lightbox.options.wijCSS.overlay + ' wijmo-wijlightbox-overlay' + (waiting ? " wijmo-wijlightbox-waitingoverlay" : "")).appendTo(document.body).css({
                    width: this.width(),
                    height: this.height()
                }).bind("click", function () {
                    if(lightbox.options.closeOnOuterClick) {
                        lightbox._close();
                    }
                    return false;
                });
                if($.fn.bgiframe) {
                    this.mask.bgiframe();
                }
                if(waiting) {
                    this.mask.css('z-index', this.zIndex);
                    var $sandglass = $('<div></div>').addClass('wijmo-wijlightbox-waiting').css('z-index', this.zIndex + 1).appendTo(this.mask);
                    $sandglass.css({
                        left: (this.mask.width() - $sandglass.width()) / 2,
                        top: (this.mask.height() - $sandglass.height()) / 2
                    });
                }
                // handle window resize
                $(window).bind('resize.wijlightbox-overlay', $.proxy(this, 'resize'));
                window.setTimeout(function () {
                    var lay;
                    if(this.mask) {
                        lay = $.wijmo.wijlightbox.overlay;
                        $(document).bind(lay.events, function (event) {
                            if($(event.target).zIndex() < lay.zIndex) {
                                return false;
                            }
                        });
                    }
                }, 1);
            }
        });
        $.extend($.wijmo.wijlightbox.overlay.prototype, {
            mask: null,
            zIndex: 1000,
            events: $.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','), function (event) {
                return event + '.wijlightbox-overlay';
            }).join(' '),
            close: function () {
                $(document).unbind('.wijlightbox-overlay');
                $(window).unbind('.wijlightbox-overlay');
                this.mask.remove();
                this.mask = undefined;
            },
            height: function () {
                var scrollHeight, offsetHeight;
                // handle IE 6
                if($.browser.msie && parseInt($.browser.version) < 7) {
                    scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
                    offsetHeight = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight);
                    if(scrollHeight < offsetHeight) {
                        return $(window).height();
                    } else {
                        return scrollHeight;
                    }
                    // handle "good" browsers
                                    } else {
                    return $(document).height();
                }
            },
            width: function () {
                var scrollWidth, offsetWidth;
                // handle IE 6
                if($.browser.msie && parseInt($.browser.version) < 7) {
                    scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
                    offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);
                    if(scrollWidth < offsetWidth) {
                        return $(window).width();
                    } else {
                        return scrollWidth;
                    }
                    // handle "good" browsers
                                    } else {
                    return $(document).width();
                }
            },
            resize: function () {
                if(this.mask) {
                    this.mask.css({
                        width: this.width(),
                        height: this.height()
                    });
                }
            }
        });
    })(wijmo.lightbox || (wijmo.lightbox = {}));
    var lightbox = wijmo.lightbox;
})(wijmo || (wijmo = {}));
