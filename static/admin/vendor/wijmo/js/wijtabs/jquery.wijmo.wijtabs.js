/*
 *
 * Wijmo Library 3.20133.20
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 *
 */
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="../Base/jquery.wijmo.widget.ts"/>
    /// <reference path="../wijsuperpanel/jquery.wijmo.wijsuperpanel.ts"/>
    /// <reference path="../External/declarations/jquery.cookie.d.ts" />
    /*globals $, jQuery, document, window, location, wijmoASPNetParseOptions*/
    /*
    * Depends:
    *	jquery-1.4.2.js
    *	jquery.ui.core.js
    *	jquery.ui.widget.js
    *	jquery.ui.position.js
    *	jquery.effects.core.js
    *	jquery.cookie.js
    *  jquery.wijmo.wijsuperpanel.js
    *	jquery.wijmo.wijutil.js
    */
    (function (tabs) {
        "use strict";
        var $ = jQuery;
        var tabId = 0, listId = 0, effects = $.effects ? $.effects : $, effectsSave = effects.save, effectsRestore = effects.restore, effectsCreateWrapper = effects.createWrapper, effectsRemoveWrapper = effects.removeWrapper, getNextTabId = function () {
            return ++tabId;
        }, getNextListId = function () {
            return ++listId;
        };
        /** @widget*/
        var wijtabs = (function (_super) {
            __extends(wijtabs, _super);
            function wijtabs() {
                _super.apply(this, arguments);

            }
            wijtabs.prototype._setOption = function (key, value) {
                _super.prototype._setOption.call(this, key, value);
                switch(key) {
                    case 'selected':
                        if(this.options.collapsible && value === this.options.selected) {
                            return;
                        }
                        this.select(value);
                        break;
                    case 'alignment':
                        this._innerDestroy(true);
                        this._tabify(true);
                        break;
                    default:
                        this._tabify(false);
                        break;
                }
            };
            wijtabs.prototype._create = function () {
                var _this = this;
                var o = this.options;
                if(this.element.is(":hidden") && this.element.wijAddVisibilityObserver) {
                    this.element.wijAddVisibilityObserver(function () {
                        if(_this.element.wijRemoveVisibilityObserver) {
                            _this.element.wijRemoveVisibilityObserver();
                        }
                        var dataObj = _this.element.data("wijtabs"), wijmoDataObj = _this.element.data("wijmoWijtabs");
                        _this._innerDestroy(true);
                        _this.element.data("wijtabs", dataObj);
                        _this.element.data("wijmoWijtabs", wijmoDataObj);
                        _this._tabify(true);
                    }, "wijtabs");
                }
                this._tabify(true);
                if(o.disabledstate || o.disabled) {
                    this.disable();
                }
                _super.prototype._create.call(this);
            };
            wijtabs.prototype.destroy = /** The destroy() method will remove the wijtabs functionality completely
            * and will return the element to its pre-init state.
            */
            function () {
                this._innerDestroy();
                _super.prototype.destroy.call(this);
            };
            wijtabs.prototype._tabify = function (init) {
                this.list = this.element.children('ol,ul').eq(0);
                this.lis = $('li:has(a)', this.list);
                this.anchors = this.lis.map(function () {
                    return $('a', this)[0];
                });
                this.panels = $([]);
                var self = this, o = self.options, fragmentId = /^#.+/, tabsAlign, panelCorner, content, i, li, addState, removeState, showTab, hideTab;
                // Safari 2 reports '#' for an empty hash
                $.each(self.anchors, function (i, a) {
                    var href = $(a).attr('href') || "", hrefBase = // For dynamically created HTML that contains a hash as href IE < 8
                    // expands such href to the full page url with hash and then
                    // misinterprets tab as ajax.
                    // Same consideration applies for an added tab with a fragment identifier
                    // since a[href=#fragment-identifier] does unexpectedly not match.
                    // Thus normalize href attribute...
                    href.split('#')[0], baseEl, id, $panel;
                    //if (hrefBase && (hrefBase === location.toString().split('#')[0] ||
                    if(hrefBase && (hrefBase === location.toString().split('#')[0] || (baseEl = $('base')[0]) && hrefBase === baseEl.href)) {
                        href = a.hash;
                        a.href = href;
                    }
                    // inline tab
                    if(fragmentId.test(href)) {
                        self.panels = self.panels.add(self._sanitizeSelector(href), self.element);
                    } else // remote tab
                    // prevent loading the page itself if href is just "#"
                    if(href !== '#') {
                        $.data(a, 'href.tabs', href)// required for restore on destroy
                        ;
                        $.data(a, 'load.tabs', href.replace(/#.*$/, ''))// mutable data
                        ;
                        id = self._tabId(a);
                        a.href = '#' + id;
                        $panel = $('#' + id);
                        if(!$panel.length) {
                            $panel = $(o.panelTemplate || self._defaults.panelTemplate).attr('id', id).addClass(o.wijCSS.tabsPanel).addClass(o.wijCSS.content).addClass(o.wijCSS.cornerBottom).insertAfter(self.panels[i - 1] || self.list);
                            $panel.data('destroy.tabs', true);
                        }
                        self.panels = self.panels.add($panel);
                    } else// invalid tab href
                     {
                        o.disabledIndexes.push(i);
                    }
                    //for fixing issue 41786, keep same as jqueryui tabs widget.
                    $(a).prop("tabindex", "-1");
                });
                tabsAlign = this._getAlignment(true);
                panelCorner = this._getAlignment(false);
                // initialization from scratch
                if(init) {
                    // ARIA
                    this.list.attr("role", "tablist");
                    this.lis.attr("role", "tab");
                    this.panels.attr("role", "tabpanel");
                    this.element.addClass(o.wijCSS.tabs).addClass(o.wijCSS.wijtabs).addClass(o.wijCSS.widget).addClass(o.wijCSS.content).addClass(o.wijCSS.cornerAll).addClass(o.wijCSS.helperClearFix).addClass(o.wijCSS.tabsPanel).addClass(o.wijCSS.tabsPanel).addClass(o.wijCSS["tabs" + tabsAlign]);
                    this.list.addClass(o.wijCSS.tabsNav).addClass(o.wijCSS.helperReset).addClass(o.wijCSS.helperClearFix).addClass(o.wijCSS.header).addClass(o.wijCSS.cornerAll);
                    this.lis.addClass(o.wijCSS.stateDefault).addClass(o.wijCSS["corner" + tabsAlign]);
                    this.panels.addClass(o.wijCSS.tabsPanel).addClass(o.wijCSS.content).addClass(o.wijCSS["corner" + panelCorner]);
                    // attach necessary classes for styling
                    switch(tabsAlign) {
                        case 'Bottom':
                            this.list.appendTo(this.element);
                            break;
                        case 'Left':
                            content = $('<div/>').addClass(o.wijCSS.wijtabsContent).appendTo(this.element);
                            this.panels.appendTo(content);
                            break;
                        case 'Right':
                            content = $('<div/>').addClass(o.wijCSS.wijtabsContent).insertBefore(this.list);
                            this.panels.appendTo(content);
                            break;
                        case 'Top':
                            this.list.prependTo(this.element);
                            break;
                    }
                    if(o.sortable && this.list.sortable) {
                        this.list.sortable({
                            axis: (tabsAlign === 'Top' || tabsAlign === 'Bottom') ? "x" : "y"
                        });
                    }
                    // Selected tab
                    // use "selected" option or try to retrieve:
                    // 1. from fragment identifier in url
                    // 2. from cookie
                    // 3. from selected class attribute on <li>
                    if(o.selected === undefined) {
                        if(location.hash) {
                            $.each(this.anchors, function (i, a) {
                                if(a.hash === location.hash) {
                                    o.selected = i;
                                    return false;// break
                                    
                                }
                            });
                        }
                        if(typeof o.selected !== 'number' && o.cookie) {
                            o.selected = parseInt(self._cookie(undefined, undefined), 10);
                        }
                        if(typeof o.selected !== 'number' && this.lis.filter('.' + o.wijCSS.tabsActive).length) {
                            o.selected = this.lis.index(this.lis.filter('.' + o.wijCSS.tabsActive));
                        }
                        o.selected = o.selected || (this.lis.length ? 0 : -1);
                    } else if(o.selected === null) {
                        // usage of null is deprecated, TODO remove in next release
                        o.selected = -1;
                    }
                    // sanity check - default to first tab...
                    o.selected = ((o.selected >= 0 && this.anchors[o.selected]) || o.selected < 0) ? o.selected : 0;
                    // Take disabling tabs via class attribute from HTML
                    // into account and update option properly.
                    // A selected tab cannot become disabled.
                    o.disabledIndexes = $.unique(o.disabledIndexes.concat($.map(this.lis.filter('.' + o.wijCSS.stateDisabled), function (n, i) {
                        return self.lis.index(n);
                    }))).sort();
                    if($.inArray(o.selected, o.disabledIndexes) !== -1) {
                        o.disabledIndexes.splice($.inArray(o.selected, o.disabledIndexes), 1);
                    }
                    // highlight selected tab
                    this.panels.addClass(o.wijCSS.wijtabsHide).attr('aria-hidden', true);
                    this.lis.removeClass(o.wijCSS.tabsActive).removeClass(o.wijCSS.stateActive).attr('aria-selected', false);
                    // check for length avoids error when initializing empty list
                    if(o.selected >= 0 && this.anchors.length) {
                        this.panels.eq(o.selected).removeClass(o.wijCSS.wijtabsHide).attr('aria-hidden', false);
                        this.lis.eq(o.selected).addClass(o.wijCSS.tabsActive).addClass(o.wijCSS.stateActive).attr('aria-selected', true);
                        // seems to be expected behavior that the show callback is fired
                        self.element.queue("tabs", function () {
                            if(self.element.wijTriggerVisibility) {
                                $(self.panels[o.selected]).wijTriggerVisibility();
                            }
                            self._trigger('show', null, self._ui(self.anchors[o.selected], self.panels[o.selected]));
                        });
                        this.load(o.selected);
                    }
                    // clean up to avoid memory leaks in certain versions of IE 6
                    $(window).bind('unload', function () {
                        if(self.lis) {
                            self.lis.add(self.anchors).unbind('.tabs');
                        }
                        self.lis = self.anchors = self.panels = null;
                    });
                } else {
                    // update selected after add/remove
                    o.selected = this.lis.index(this.lis.filter('.' + o.wijCSS.tabsActive));
                }
                // update collapsible
                this.element[o.collapsible ? 'addClass' : 'removeClass'](o.wijCSS.tabsCollapsible);
                // set or update cookie after init and add/remove respectively
                if(o.cookie) {
                    this._cookie(o.selected, o.cookie);
                }
                // disable tabs
                //for (i = 0; (li = this.lis[i]); i++) {
                for(i = 0; i < this.lis.length; i++) {
                    li = this.lis[i];
                    $(li)[$.inArray(i, o.disabledIndexes) !== -1 && !$(li).hasAllClasses(o.wijCSS.tabsActive) ? 'addClass' : 'removeClass'](o.wijCSS.stateDisabled);
                    if($(li).hasAllClasses(o.wijCSS.stateDisabled)) {
                        $(li).attr('aria-disabled', true);
                    }
                }
                // reset cache if switching from cached to not cached
                if(o.cache === false) {
                    this.anchors.removeData('cache.tabs');
                }
                // remove all handlers before, tabify may run on existing tabs
                // after add or option change
                this.lis.add(this.anchors).unbind('.tabs');
                if(!o.disabledState && !o.disabled && o.event !== 'mouseover') {
                    addState = function (state, el) {
                        if(el.is(':not(.' + o.wijCSS.stateDisabled + ')')) {
                            el.addClass(state);
                        }
                    };
                    removeState = function (state, el) {
                        el.removeClass(state);
                    };
                    this.lis.bind('mouseover.tabs', function () {
                        addState(o.wijCSS.stateHover, $(this));
                    });
                    this.lis.bind('mouseout.tabs', function () {
                        removeState(o.wijCSS.stateHover, $(this));
                    });
                    this.anchors.bind('focus.tabs', function () {
                        self.lis.filter("." + o.wijCSS.stateFocus).removeClass(o.wijCSS.stateFocus);
                        addState(o.wijCSS.stateFocus, $(this).closest('li'));
                    });
                    this.anchors.bind('blur.tabs', function () {
                        removeState(o.wijCSS.stateFocus, $(this).closest('li'));
                    });
                }
                if(o.showOption === undefined || o.showOption === null) {
                    o.showOption = {
                    };
                }
                this._normalizeBlindOption(o.showOption);
                if(o.hideOption === undefined || o.hideOption === null) {
                    o.hideOption = {
                    };
                }
                this._normalizeBlindOption(o.hideOption);
                // Show a tab...
                showTab = ((o.showOption.blind || o.showOption.fade) && o.showOption.duration > 0) ? function (clicked, $show) {
                    $(clicked).closest('li').addClass(o.wijCSS.tabsActive).addClass(o.wijCSS.stateActive).attr('aria-selected', true);
                    self._showContent();
                    $show.removeClass(o.wijCSS.wijtabsHide).attr('aria-hidden', false);
                    if(tabsAlign === 'Top' || tabsAlign === 'Bottom') {
                        var props = {
                            duration: o.showOption.duration,
                            height: 'toggle',
                            opacity: 'toggle'
                        };
                        if(!o.showOption.blind) {
                            delete props.height;
                        }
                        if(!o.showOption.fade) {
                            delete props.opacity;
                        }
                        // avoid flicker that way
                        $show.hide().removeClass(o.wijCSS.wijtabsHide).attr('aria-hidden', false).animate(props, o.showOption.duration || 'normal', function () {
                            self._resetStyle($show);
                            if($show.wijTriggerVisibility) {
                                $show.wijTriggerVisibility();
                            }
                            self._trigger('show', null, self._ui(clicked, $show[0]));
                        });
                    } else {
                        self._showContent();
                        self._blindPanel($show, 'show');
                    }
                } : function (clicked, $show) {
                    $(clicked).closest('li').addClass(o.wijCSS.tabsActive).addClass(o.wijCSS.stateActive).attr('aria-selected', true);
                    self._showContent();
                    $show.removeClass(o.wijCSS.wijtabsHide).attr('aria-hidden', false);
                    if($show.wijTriggerVisibility) {
                        $show.wijTriggerVisibility();
                    }
                    self._trigger('show', null, self._ui(clicked, $show[0]));
                };
                // Hide a tab, $show is optional...
                hideTab = ((o.hideOption.blind || o.hideOption.fade) && o.hideOption.duration > 0) ? function (clicked, $hide) {
                    if(tabsAlign === 'Top' || tabsAlign === 'Bottom') {
                        var props = {
                            duration: o.hideOption.duration,
                            height: 'toggle',
                            opacity: 'toggle'
                        };
                        if(!o.hideOption.blind) {
                            delete props.height;
                        }
                        if(!o.hideOption.fade) {
                            delete props.opacity;
                        }
                        $hide.animate(props, o.hideOption.duration || 'normal', function () {
                            self.lis.removeClass(o.wijCSS.tabsActive).removeClass(o.wijCSS.stateActive).attr('aria-selected', false);
                            $hide.addClass(o.wijCSS.wijtabsHide).attr('aria-hidden', true);
                            self._resetStyle($hide);
                            self.element.dequeue("tabs");
                        });
                    } else {
                        self._saveLayout();
                        self._blindPanel($hide, 'hide');
                    }
                } : function (clicked, $hide, $show) {
                    self.lis.removeClass(o.wijCSS.tabsActive).removeClass(o.wijCSS.stateActive).attr('aria-selected', false);
                    self._hideContent();
                    $hide.addClass(o.wijCSS.wijtabsHide).attr('aria-hidden', true);
                    self.element.dequeue("tabs");
                };
                // attach tab event handler, unbind to avoid duplicates from former tabifying
                if(!o.disabledState && !o.disabled) {
                    this.anchors.bind(o.event + '.tabs', function () {
                        var el = this, $li = $(this).closest('li'), $hide = self.panels.filter(':not(.' + o.wijCSS.wijtabsHide + ')'), $show = $(self._sanitizeSelector(this.hash), self.element);
                        // If tab is already selected and not collapsible or tab disabled or
                        // or is already loading or click callback returns false stop here.
                        // Check if click handler returns false last so that it is not
                        // executed for a disabled or loading tab!
                        if(($li.hasAllClasses(o.wijCSS.tabsActive) && !o.collapsible) || $li.hasAllClasses(o.wijCSS.stateDisabled) || $li.hasAllClasses(o.wijCSS.tabsLoading) || self._trigger('select', null, self._ui(this, $show[0])) === false) {
                            this.blur();
                            return false;
                        }
                        o.selected = self.anchors.index(this);
                        self.abort();
                        // if tab may be closed
                        if(o.collapsible) {
                            if($li.hasAllClasses(o.wijCSS.tabsActive)) {
                                o.selected = -1;
                                if(o.cookie) {
                                    self._cookie(o.selected, o.cookie);
                                }
                                self.element.queue("tabs", function () {
                                    hideTab(el, $hide);
                                }).dequeue("tabs");
                                this.blur();
                                return false;
                            } else if(!$hide.length) {
                                if(o.cookie) {
                                    self._cookie(o.selected, o.cookie);
                                }
                                self.element.queue("tabs", function () {
                                    showTab(el, $show);
                                });
                                // TODO make passing in node possible,
                                // see also http://dev.jqueryui.com/ticket/3171
                                self.load(self.anchors.index(this));
                                this.blur();
                                return false;
                            }
                        }
                        if(o.cookie) {
                            self._cookie(o.selected, o.cookie);
                        }
                        // show new tab
                        if($show.length) {
                            if($hide.length) {
                                self.element.queue("tabs", function () {
                                    hideTab(el, $hide);
                                });
                            }
                            self.element.queue("tabs", function () {
                                showTab(el, $show);
                            });
                            self.load(self.anchors.index(this));
                        } else {
                            throw 'jQuery UI Tabs: Mismatching fragment identifier.';
                        }
                        // Prevent IE from keeping other link focussed when using
                        // the back button and remove dotted border from clicked link.
                        // This is controlled via CSS in modern browsers;
                        // blur() removes focus from address bar in Firefox which can
                        // become a usability and annoying problem with tabs('rotate').
                        if($.browser.msie) {
                            this.blur();
                        }
                    });
                }
                this._initScroller();
                // disable click in any case
                this.anchors.bind('click.tabs', function () {
                    return false;
                });
            };
            wijtabs.prototype._blindPanel = function (panel, mode) {
                var self = this, o = self.options, content = panel.parent('.' + o.wijCSS.wijtabsContent), props = [
                    'position', 
                    'top', 
                    'left', 
                    'width'
                ], blindOption = mode === 'show' ? o.showOption : o.hideOption, wrapper, a, listWidth;
                if(!content.length) {
                    return;
                }
                self.list.width(self.list.width());
                //$.effects.save(panel, props);
                if(effectsSave) {
                    effectsSave(panel, props);
                }
                panel.show()// Save & Show
                ;
                if(mode === 'show') {
                    // Show
                    panel.removeClass(o.wijCSS.wijtabsHide).attr('aria-hidden', false);
                    panel.width(self.element.data('panel.width'));
                } else {
                    panel.width(panel.width());
                }
                // Create Wrapper
                //wrapper = $.effects.createWrapper(panel).css({ overflow: 'hidden' });
                if(effectsCreateWrapper) {
                    wrapper = effectsCreateWrapper(panel).css({
                        overflow: 'hidden'
                    });
                } else {
                    wrapper = $('<div></div>');
                }
                if(mode === 'show') {
                    // Shift
                    wrapper.css($.extend({
                        width: 0
                    }, blindOption.fade ? {
                        opacity: 0
                    } : {
                    }));
                }
                // Animation
                a = $.extend({
                    width: mode === 'show' ? self.element.data('panel.outerWidth') : 0
                }, blindOption.fade ? {
                    opacity: mode === 'show' ? 1 : 0
                } : {
                });
                listWidth = self.list.outerWidth(true);
                // Animate
                wrapper.animate(a, {
                    duration: blindOption.duration,
                    step: function () {
                        var ww = wrapper.outerWidth(true);
                        self.element.width(listWidth + ww);
                        content.width(Math.max(0, self.element.innerWidth() - listWidth - 6));
                    },
                    complete: function () {
                        if(mode === 'hide') {
                            self.lis.removeClass(o.wijCSS.tabsActive).removeClass(o.wijCSS.stateActive).attr('aria-selected', false);
                            // Hide
                            panel.addClass(o.wijCSS.wijtabsHide).attr('aria-hidden', true);
                        } else {
                            panel.css('width', '');
                        }
                        ////$.effects.restore(panel, props);
                        //$.effects.removeWrapper(panel); // Restore
                        if(effectsRemoveWrapper) {
                            effectsRemoveWrapper(panel);
                        }
                        if(mode === 'show') {
                            self._restoreLayout();
                        }
                        self._resetStyle(panel);
                        panel.dequeue();
                        self.element.dequeue("tabs");
                    }
                });
            };
            wijtabs.prototype._hideContent = function () {
                var wijCSS = this.options.wijCSS, content = this.element.find('.' + wijCSS.wijtabsContent);
                if(content.length) {
                    this._saveLayout();
                    content.addClass(wijCSS.wijtabsHide).attr('aria-hidden', true);
                    this.element.width(this.list.outerWidth(true));
                }
            };
            wijtabs.prototype._showContent = function () {
                var wijCSS = this.options.wijCSS, content = this.element.find('.' + wijCSS.wijtabsContent);
                if(content.length) {
                    this._restoreLayout();
                    content.removeClass(wijCSS.wijtabsHide).attr('aria-hidden', false);
                }
            };
            wijtabs.prototype._saveLayout = function () {
                var wijCSS = this.options.wijCSS, props = [
                    'width', 
                    'height', 
                    'overflow'
                ], $hide = this.panels.filter(':not(.' + wijCSS.wijtabsHide + ')');
                //$.effects.save(self.element, props);
                //$.effects.save(self.list, props);
                //$.effects.save(self.element.find('.' + wijCSS.wijtabsContent), props);
                if(effectsSave) {
                    effectsSave(this.element, props);
                    effectsSave(this.list, props);
                    effectsSave(this.element.find('.' + wijCSS.wijtabsContent), props);
                }
                this.list.width(this.list.width());
                this.element.data('panel.width', $hide.width());
                this.element.data('panel.outerWidth', $hide.outerWidth(true));
            };
            wijtabs.prototype._restoreLayout = function () {
                var wijCSS = this.options.wijCSS, props = [
                    'width', 
                    'height', 
                    'overflow'
                ];
                //$.effects.restore(self.element, props);
                //$.effects.restore(self.list, props);
                //$.effects.restore(self.element.find('.' + wijCSS.wijtabsContent), props);
                if(effectsRestore) {
                    effectsRestore(this.element, props);
                    effectsRestore(this.list, props);
                    effectsRestore(this.element.find('.' + wijCSS.wijtabsContent), props);
                }
            };
            wijtabs.prototype._resetStyle = // Reset certain styles left over from animation
            // and prevent IE's ClearType bug...
            function ($el) {
                $el.css({
                    display: ''
                });
                if(!$.support.opacity) {
                    $el[0].style.removeAttribute('filter');
                }
            };
            wijtabs.prototype._normalizeBlindOption = function (o) {
                if(o.blind === undefined) {
                    o.blind = false;
                }
                if(o.fade === undefined) {
                    o.fade = false;
                }
                if(o.duration === undefined) {
                    o.duration = 200;
                }
                if(typeof o.duration === 'string') {
                    try  {
                        o.duration = parseInt(o.duration, 10);
                    } catch (e) {
                        o.duration = 200;
                    }
                }
            };
            wijtabs.prototype._initScroller = function () {
                var _this = this;
                var horz = $.inArray(this._getAlignment(true), [
                    'Top', 
                    'Bottom'
                ]) !== -1, width = 0;
                if(!horz) {
                    return;
                }
                $.each(this.lis, function (idx, li) {
                    // In IE, the render width has decimals. but the jQuery get's width doesn't contains decimals.
                                        var item = $(li), link, itemWidth = 0, iefix = 0;
                    if($.browser.msie && !!_this.options.scrollable) {
                        //item.width(item.css("width"));
                        // when the li item contains icon, the a element will contains decimals, the icon will show at the second line.
                        // strange things, the width can't contains decimals in other browsers, but margin can has decimals value, and can use
                        // outerWidth(true) to get it. for this case, the item's width will be sum of the children's outer width.
                        $.each(item.children(), function (i, ele) {
                            var jqEle = $(ele);
                            if(jqEle.is("a")) {
                                jqEle.width(jqEle.width());
                            }
                            itemWidth += jqEle.outerWidth(true);
                        });
                        iefix = itemWidth - item.width();
                        item.width(itemWidth);
                    }
                    width += _this._getLiWidth($(li)) + iefix;
                });
                if(!!this.options.scrollable && this.element.innerWidth() < width) {
                    if(this.scrollWrap === undefined) {
                        this.list.wrap("<div class='scrollWrap'></div>");
                        this.scrollWrap = this.list.parent();
                        //$.effects.save(this.list, ['width', 'height', 'overflow']);
                        if(effectsSave) {
                            effectsSave(this.list, [
                                'width', 
                                'height', 
                                'overflow'
                            ]);
                        }
                    }
                    this.list.width(Math.ceil(width) + 2);
                    this.scrollWrap.height(this.list.outerHeight(true));
                    this.scrollWrap.wijsuperpanel({
                        allowResize: false,
                        hScroller: {
                            scrollMode: 'edge'
                        },
                        vScroller: {
                            scrollBarVisibility: 'hidden'
                        }
                    });
                } else {
                    this._removeScroller();
                }
            };
            wijtabs.prototype._ui = function (tab, panel) {
                return {
                    tab: tab,
                    panel: panel,
                    index: this.anchors.index(tab)
                };
            };
            wijtabs.prototype._tabId = function (a) {
                var $a = $(a), tabId, hrefParams;
                if($a.data && $a.data("tabid")) {
                    return $a.data("tabid");
                }
                if(a.href && a.href.length) {
                    hrefParams = this._getURLParameters(a.href);
                    if(hrefParams.tabId) {
                        tabId = hrefParams.tabId;
                        $a.data("tabid", tabId);
                        return tabId;
                    }
                }
                tabId = a.title && a.title.replace(/\s/g, '_').replace(/[^A-Za-z0-9\-_:\.]/g, '') || this.options.idPrefix + getNextTabId();
                $a.data("tabid", tabId);
                return tabId;
            };
            wijtabs.prototype._getURLParameters = function (url) {
                var params = {
                }, parametersString, parameters;
                if(url.indexOf('?') > -1) {
                    parametersString = url.split('?')[1];
                    parameters = parametersString.split('&');
                    $.each(parameters, function (i, param) {
                        var p = param.split('=');
                        if(p.length > 1) {
                            params[p[0]] = p[1];
                        }
                    });
                }
                return params;
            };
            wijtabs.prototype._getAlignment = function (tabs) {
                var align = this.options.alignment || 'top';
                if(tabs) {
                    return align.charAt(0).toUpperCase() + align.substr(1);
                }
                switch(align) {
                    case 'top':
                        align = 'Bottom';
                        break;
                    case 'bottom':
                        align = 'Top';
                        break;
                    case 'left':
                        align = 'Right';
                        break;
                    case 'right':
                        align = 'Left';
                        break;
                }
                return align;
            };
            wijtabs.prototype._sanitizeSelector = function (hash) {
                // we need this because an id may contain a ":"
                return hash.replace(/:/g, '\\:');
            };
            wijtabs.prototype._innerDestroy = function (keepAddedItems) {
                var o = this.options, content = $('.' + o.wijCSS.wijtabsContent);
                this.abort();
                this._removeScroller();
                this.element.unbind('.tabs').removeClass(o.wijCSS.wijtabs).removeClass(o.wijCSS.tabsTop).removeClass(o.wijCSS.tabsBottom).removeClass(o.wijCSS.tabsLeft).removeClass(o.wijCSS.tabsRight).removeClass(o.wijCSS.tabs).removeClass(o.wijCSS.widget).removeClass(o.wijCSS.content).removeClass(o.wijCSS.cornerAll).removeClass(o.wijCSS.tabsCollapsible).removeClass(o.wijCSS.helperClearFix).removeData('tabs').removeAttr('role');
                this.list.removeClass(o.wijCSS.tabsNav).removeClass(o.wijCSS.helperReset).removeClass(o.wijCSS.helperClearFix).removeClass(o.wijCSS.header).removeClass(o.wijCSS.cornerAll).removeAttr('role');
                $.each(this.anchors, function (idx, a) {
                    var $a = $(a), href = $a.data('href.tabs');
                    if(href) {
                        a.href = href;
                    }
                    $a.unbind('.tabs');
                    $.each([
                        'href', 
                        'load', 
                        'cache'
                    ], function (i, prefix) {
                        $a.removeData(prefix + '.tabs');
                    });
                });
                this.lis.unbind('.tabs').add(this.panels).each(function (idx, li) {
                    var $li = $(li);
                    if($li.data('destroy.tabs') && !keepAddedItems) {
                        $li.remove();
                    } else {
                        $li.removeClass(o.wijCSS.stateDefault).removeClass(o.wijCSS.cornerTop).removeClass(o.wijCSS.cornerBottom).removeClass(o.wijCSS.cornerLeft).removeClass(o.wijCSS.cornerRight).removeClass(o.wijCSS.tabsActive).removeClass(o.wijCSS.stateActive).removeClass(o.wijCSS.stateHover).removeClass(o.wijCSS.stateFocus).removeClass(o.wijCSS.stateDisabled).removeClass(o.wijCSS.tabsPanel).removeClass(o.wijCSS.content).removeClass(o.wijCSS.wijtabsHide).css({
                            position: '',
                            left: '',
                            top: ''
                        }).removeAttr('role').removeAttr('aria-hidden').removeAttr('aria-selected').removeAttr('aria-disabled');
                    }
                });
                if(content.length) {
                    content.replaceWith(content.contents());
                }
                if(o.cookie) {
                    this._cookie(null, o.cookie);
                }
                return this;
            };
            wijtabs.prototype._cleanup = function () {
                // restore all former loading tabs labels
                var wijCSS = this.options.wijCSS;
                this.lis.filter('.' + wijCSS.tabsLoading).removeClass(wijCSS.tabsLoading).find('span:data(label.tabs)').each(function () {
                    var el = $(this);
                    el.html(el.data('label.tabs')).removeData('label.tabs');
                });
            };
            wijtabs.prototype._removeScroller = function () {
                if(!this.scrollWrap) {
                    return;
                }
                this.scrollWrap.wijsuperpanel('destroy').replaceWith(this.scrollWrap.contents());
                this.scrollWrap = undefined;
                if(effectsRestore) {
                    effectsRestore(this.list, [
                        'width', 
                        'height', 
                        'overflow'
                    ]);
                }
            };
            wijtabs.prototype._cookie = function (index, cookie) {
                var c = this.cookie || (this.cookie = this.options.cookie.name || 'ui-tabs-' + getNextListId());
                return $.cookie.apply(null, [
                    c
                ].concat($.makeArray(arguments)));
            };
            wijtabs.prototype._getLiWidth = function (li) {
                return this._parsePxToNumber(li.css('margin-left')) + this._parsePxToNumber(li.css('border-left-width')) + this._parsePxToNumber(li.css('padding-left')) + this._parsePxToNumber(li.css('width')) + this._parsePxToNumber(li.css('margin-right')) + this._parsePxToNumber(li.css('border-right-width')) + this._parsePxToNumber(li.css('padding-right'));
            };
            wijtabs.prototype._parsePxToNumber = /** Parse string setting to number */
            function (px) {
                var pxIndex = px.indexOf("px");
                if(!pxIndex || pxIndex === -1) {
                    return 0;
                } else {
                    return parseFloat(px.substr(0, pxIndex));
                }
            };
            wijtabs.prototype.abort = /** Terminate all running tab ajax requests and animations.*/
            function () {
                this.element.queue([]);
                this.panels.stop(false, true);
                // "tabs" queue must not contain more than two elements,
                // which are the callbacks for the latest clicked tab...
                this.element.queue("tabs", this.element.queue("tabs").splice(-2, 2));
                // terminate pending requests from other tabs
                if(this.xhr) {
                    this.xhr.abort();
                    delete this.xhr;
                }
                // take care of tab labels
                this._cleanup();
                return this;
            };
            wijtabs.prototype.select = /** Selects a tab; for example, a clicked tab.
            * @param {number|string} index The zero-based index of the tab to be selected or
            * the id selector of the panel the tab is associated with.
            * @example
            * //Select the second tab.
            * $("#element").wijtabs('select', 1);
            */
            function (index) {
                if(typeof index === 'string') {
                    index = this.anchors.index(this.anchors.filter('[href$=' + index + ']'));
                } else if(index === null) {
                    // usage of null is deprecated, TODO remove in next release
                    index = -1;
                }
                if(index === -1 && this.options.collapsible) {
                    index = this.options.selected;
                }
                this.anchors.eq(index).trigger(this.options.event + '.tabs');
                return this;
            };
            wijtabs.prototype.load = /** Reload the content of an Ajax tab programmatically.
            * This method always loads the tab content from the remote location,
            * even if cache is set to true.
            * @param {number} index The zero-based index of the tab to be reloaded.
            * @example
            * //Reload the second tab.
            * $("#element").wijtabs('load', 1);
            */
            function (index) {
                var self = this, o = self.options, a = self.anchors.eq(index)[0], url = $.data(a, 'load.tabs'), span = $('span', a);
                self.abort();
                if(false === self._trigger('beforeShow', null, self._ui(self.anchors[index], self.panels[index]))) {
                    self.element.dequeue("tabs");
                    return;
                }
                // not remote or from cache
                if(!url || self.element.queue("tabs").length !== 0 && $.data(a, 'cache.tabs')) {
                    self.element.dequeue("tabs");
                    return;
                }
                // load remote from here on
                self.lis.eq(index).addClass(o.wijCSS.tabsLoading);
                if(o.spinner || self._defaults.spinner) {
                    span.data('label.tabs', span.html()).html(o.spinner || self._defaults.spinner);
                }
                self.xhr = $.ajax($.extend({
                }, o.ajaxOptions, {
                    url: url,
                    success: function (r, s) {
                        $(self._sanitizeSelector(a.hash), self.element).html(r);
                        // take care of tab labels
                        self._cleanup();
                        if(o.cache) {
                            // if loaded once do not load them again
                            $.data(a, 'cache.tabs', true);
                        }
                        // callbacks
                        self._trigger('load', null, self._ui(self.anchors[index], self.panels[index]));
                        try  {
                            o.ajaxOptions.success(r, s);
                        } catch (e1) {
                        }
                    },
                    error: function (xhr, s, e) {
                        // take care of tab labels
                        self._cleanup();
                        // callbacks
                        self._trigger('load', null, self._ui(self.anchors[index], self.panels[index]));
                        try  {
                            // Passing index avoid a race condition when this method is
                            // called after the user has selected another tab.
                            // Pass the anchor that initiated this request allows
                            // loadError to manipulate the tab content panel via $(a.hash)
                            o.ajaxOptions.error(xhr, s, index, a);
                        } catch (e2) {
                        }
                    }
                }));
                // last, so that load event is fired before show...
                self.element.dequeue("tabs");
                return self;
            };
            wijtabs.prototype.add = /** Add a new tab.
            * @param {string} url A URL consisting of a fragment identifier
            * only to create an in-page tab or a full url
            * (relative or absolute, no cross-domain support) to
            * turn the new tab into an Ajax (remote) tab.
            * @param {string} label The tab label.
            * @param {number} index Zero-based position where to insert the new tab.
            * @example
            * //Add a new tab to be a second tab.
            * $("#element").wijtabs('add', "http://wijmo.com/newTab", "NewTab", 1);
            */
            function (url, label, index) {
                if(index === undefined) {
                    index = this.anchors.length// append by default
                    ;
                }
                var self = this, o = self.options, $li = $((o.tabTemplate || self._defaults.tabTemplate).replace(/#\{href\}/g, url).replace(/#\{label\}/g, label)), id = !url.indexOf('#') ? url.replace('#', '') : self._tabId($('a', $li)[0]), tabsAlign = self._getAlignment(true), panelCorner = self._getAlignment(false), $panel = $('#' + id), $content;
                $li.addClass(o.wijCSS.stateDefault).addClass(o.wijCSS["corner" + tabsAlign]).data('destroy.tabs', true).attr('role', 'tab').attr('aria-selected', false);
                // try to find an existing element before creating a new one
                if(!$panel.length) {
                    $panel = $(o.panelTemplate || self._defaults.panelTemplate).attr('id', id).data('destroy.tabs', true).attr('role', 'tabpanel');
                }
                $panel.addClass(o.wijCSS.tabsPanel).addClass(o.wijCSS.content).addClass(o.wijCSS["corner" + panelCorner] + ' ' + o.wijCSS.wijtabsHide).attr('aria-hidden', true);
                if(index >= self.lis.length) {
                    $li.appendTo(self.list);
                    if(self.panels.length > 0) {
                        $panel.insertAfter(self.panels[self.panels.length - 1]);
                    } else {
                        $content = self.element.find('.' + o.wijCSS.wijtabsContent);
                        if($content.length === 0) {
                            $content = self.element;
                        }
                        $panel.appendTo($content);
                    }
                } else {
                    $li.insertBefore(self.lis[index]);
                    $panel.insertBefore(self.panels[index]);
                }
                o.disabledIndexes = $.map(o.disabledIndexes, function (n, i) {
                    return n >= index ? ++n : n;
                });
                self._removeScroller();
                self._tabify(false);
                if(self.anchors.length === 1) {
                    // after tabify
                    o.selected = 0;
                    $li.addClass(o.wijCSS.tabsActive).addClass(o.wijCSS.stateActive).attr('aria-selected', true);
                    $panel.removeClass(o.wijCSS.wijtabsHide).attr('aria-hidden', false);
                    self.element.queue("tabs", function () {
                        if(self.element.wijTriggerVisibility) {
                            $(self.panels[0]).wijTriggerVisibility();
                        }
                        self._trigger('show', null, self._ui(self.anchors[0], self.panels[0]));
                    });
                    self.load(0);
                }
                // callback
                self._trigger('add', null, self._ui(self.anchors[index], self.panels[index]));
                return self;
            };
            wijtabs.prototype.remove = /** Removes a tab.
            * @param {number} index The zero-based index of the tab to be removed.
            * @example
            * //Removes the second tab
            * $("#element").wijtabs('remove', 1);
            */
            function (index) {
                var o = this.options, $li = this.lis.eq(index).remove(), $panel = this.panels.eq(index).remove();
                // If selected tab was removed focus tab to the right or
                // in case the last tab was removed the tab to the left.
                if($li.hasAllClasses(o.wijCSS.tabsActive) && this.anchors.length > 1) {
                    this.select(index + (index + 1 < this.anchors.length ? 1 : -1));
                }
                o.disabledIndexes = $.map($.grep(o.disabledIndexes, function (n, i) {
                    return n !== index;
                }, false), function (n, i) {
                    return n >= index ? --n : n;
                });
                this._removeScroller();
                this._tabify(false);
                // callback
                this._trigger('remove', null, this._ui($li.find('a')[0], $panel[0]));
                return this;
            };
            wijtabs.prototype.enableTab = /** Enable a disabled tab.
            * @param {number} index The zero-based index of the tab to be enabled.
            * @example
            * //Enables the second tab
            * $("#element").wijtabs('enableTab', 1);
            */
            function (index) {
                var o = this.options;
                if($.inArray(index, o.disabledIndexes) === -1) {
                    return;
                }
                this.lis.eq(index).removeClass(o.wijCSS.stateDisabled).removeAttr('aria-disabled');
                o.disabledIndexes = $.grep(o.disabledIndexes, function (n, i) {
                    return n !== index;
                }, false);
                // callback
                this._trigger('enable', null, this._ui(this.anchors[index], this.panels[index]));
                return this;
            };
            wijtabs.prototype.disableTab = /** Disabled a tab.
            * @param {number} index The zero-based index of the tab to be disabled.
            * @example
            * //Disables the second tab
            * $("#element").wijtabs('disableTab', 1);
            */
            function (index) {
                var o = this.options;
                if(index !== o.selected) {
                    // cannot disable already selected tab
                    this.lis.eq(index).addClass(o.wijCSS.stateDisabled).attr('aria-disabled', true);
                    o.disabledIndexes.push(index);
                    o.disabledIndexes.sort();
                    // callback
                    this._trigger('disable', null, this._ui(this.anchors[index], this.panels[index]));
                }
                return this;
            };
            wijtabs.prototype.url = /** Changes the url from which an Ajax (remote) tab will be loaded.
            * @param {number} index The zero-based index of the tab of which its URL is to be updated.
            * @param {string} url A URL the content of the tab is loaded from.
            * @remarks The specified URL will be used for subsequent loads.
            * Note that you can not only change the URL for an existing remote tab
            * with this method, but you can also turn an in-page tab into a remote tab.
            * @example
            * //Changes the second tab to a new tab url.
            * $("#element").wijtabs('url', 1, "http://wijmo.com/newTabUrl")
            */
            function (index, url) {
                this.anchors.eq(index).removeData('cache.tabs').data('load.tabs', url);
                return this;
            };
            wijtabs.prototype.length = /** Retrieve the number of tabs of the first matched tab pane.*/
            function () {
                return this.anchors.length;
            };
            return wijtabs;
        })(wijmo.wijmoWidget);
        tabs.wijtabs = wijtabs;        
        wijtabs.prototype._defaults = {
            panelTemplate: '<div></div>',
            spinner: '<em>Loading&#8230;</em>',
            tabTemplate: '<li><a href="#{href}"><span>#{label}</span></a></li>'
        };
        var wijtabs_options = (function () {
            function wijtabs_options() {
                /** All CSS classes used in widgets.
                * @ignore
                */
                this.wijCSS = {
                    wijtabs: "wijmo-wijtabs",
                    wijtabsContent: "wijmo-wijtabs-content",
                    wijtabsHide: "wijmo-wijtabs-hide"
                };
                /** @ignore */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-c",
                    content: "ui-content ui-body ui-body-c",
                    stateDefault: "ui-btn-up-a",
                    stateActive: "ui-btn-down-b"
                };
                /** Determines the tabs' alignment in respect to the content.
                * @remarks Possible values are: 'top', 'bottom', 'left' and 'right'.
                */
                this.alignment = 'top';
                /** Determines whether the tab can be dragged to a new position.
                * @remarks This option only works when jQuery.ui.sortable is available
                * which means that it doesn't work in mobile mode.
                */
                this.sortable = false;
                /** Determines whether to wrap to the next line or enable scrolling
                * when the number of tabs exceeds the specified width.
                */
                this.scrollable = false;
                /** Additional Ajax options to consider when loading tab content (see $.ajax).
                * @type {object}
                * @remarks Please see following link for more details,
                * http://api.jquery.com/jQuery.ajax/ .
                */
                this.ajaxOptions = null;
                /** Determines whether or not to cache the remote tabs content,
                * for example, to load content only once or with every click.
                * @remarks Note that to prevent the actual Ajax requests from being cached
                * by the browser, you need to provide an extra cache:
                * false flag to ajaxOptions.
                */
                this.cache = false;
                /** Stores the latest selected tab in a cookie.
                * The cookie is then used to determine the initially selected tab
                * if the selected option is not defined.
                * This option requires a cookie plugin. The object needs to have key/value pairs
                * of the form the cookie plugin expects as options.
                * @example
                * //Set cookie to wijtabs.
                * $('.selector').wijtabs({cookie: {
                * expires: 7, path: '/', domain: 'jquery.com', secure: true }});
                */
                this.cookie = null;
                /** Determines whether a tab can be collapsed by a user.
                * When this is set to true, an already selected tab
                * will be collapsed upon reselection.
                */
                this.collapsible = false;
                /** This is an animation option for hiding the tab's panel content.
                * @type {object}
                * @example
                * //Set hide animation to blind/fade and duration to 200.
                * $('.selector').wijtabs({
                * hideOption: { blind: true, fade: true, duration: 200}});
                */
                this.hideOption = null;
                /** This is an animation option for showing the tab's panel content.
                * @type {object}
                * @example
                * //Set show animation to blind/fade and duration to 200.
                * $('.selector').wijtabs({
                * showOption: { blind: true, fade: true, duration: 200}});
                */
                this.showOption = null;
                /** An array containing the position of the tabs (zero-based index)
                * that should be disabled upon initialization.
                */
                this.disabledIndexes = [];
                /** The type of event to be used for selecting a tab. */
                this.event = 'click';
                /** If the remote tab, its anchor element that is, has no title attribute
                * to generate an id from,
                * an id/fragment identifier is created from this prefix and a unique id
                * returned by $.data(el), for example "ui-tabs-54".
                */
                this.idPrefix = 'ui-tabs-';
                /** This is the HTML template from which a new tab panel is created in case
                * a tab is added via the add method or
                * if a panel for a remote tab is created on the fly.
                */
                this.panelTemplate = '';
                /** The HTML content of this string is shown in a tab title
                * while remote content is loading.
                * Pass in an empty string to deactivate that behavior.
                * A span element must be present in the A tag of the title
                * for the spinner content to be visible.
                */
                this.spinner = '';
                /** HTML template from which a new tab is created and added.
                * The placeholders #{href} and #{label} are replaced with the url
                * and tab label that are passed as arguments to the add method.
                */
                this.tabTemplate = '';
                /** The add event handler. A function called when a tab is added.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijTabsEventArgs} args The data with this event.
                */
                this.add = null;
                /** The remove event handler. A function called when a tab is removed.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijTabsEventArgs} args The data with this event.
                */
                this.remove = null;
                /** The select event handler. A function called when clicking a tab.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijTabsEventArgs} args The data with this event.
                */
                this.select = null;
                /** The beforeShow event handler. A function called before a tab is shown.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijTabsEventArgs} args The data with this event.
                */
                this.beforeShow = null;
                /** The show event handler. A function called when a tab is shown.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijTabsEventArgs} args The data with this event.
                */
                this.show = null;
                /** The load event handler.
                * A function called after the content of a remote tab has been loaded.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijTabsEventArgs} args The data with this event.
                */
                this.load = null;
                /** The disable event handler. A function called when a tab is disabled.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijTabsEventArgs} args The data with this event.
                */
                this.disable = null;
                /** The enable event handler. A function called when a tab is enabled.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijTabsEventArgs} args The data with this event.
                */
                this.enable = null;
            }
            return wijtabs_options;
        })();        
        ;
        wijtabs.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijtabs_options());
        $.wijmo.registerWidget("wijtabs", wijtabs.prototype);
        ;
    })(wijmo.tabs || (wijmo.tabs = {}));
    var tabs = wijmo.tabs;
})(wijmo || (wijmo = {}));
