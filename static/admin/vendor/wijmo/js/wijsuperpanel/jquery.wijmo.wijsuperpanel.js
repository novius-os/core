/*
 *
 * Wijmo Library 3.20131.4
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
/// <reference path="../Base/jquery.wijmo.widget.ts"/>
/*globals window,document,jQuery*/
/*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.resizable.js
*	jquery.ui.mouse.js
*	jquery.wijmo.wijutil.js
*
*/
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery;
    var wijsuperpanel = (function (_super) {
        __extends(wijsuperpanel, _super);
        function wijsuperpanel() {
            _super.apply(this, arguments);

        }
        return wijsuperpanel;
    })(wijmo.wijmoWidget);
    wijmo.wijsuperpanel = wijsuperpanel;
    if(!$.support.isTouchEnabled || !$.support.isTouchEnabled()) {
        var scrollerHandle = "wijmo-wijsuperpanel-handle", hbarContainerCSS = "wijmo-wijsuperpanel-hbarcontainer", vbarContainerCSS = "wijmo-wijsuperpanel-vbarcontainer", activeCss = "", innerElementHtml = "<div class='wijmo-wijsuperpanel-statecontainer'>" + "<div class='wijmo-wijsuperpanel-contentwrapper'>" + "<div class='wijmo-wijsuperpanel-templateouterwrapper'></div>" + "</div>" + "</div>", hbarHtml = "<div class='wijmo-wijsuperpanel-hbarcontainer {header}'>" + "<div class='wijmo-wijsuperpanel-handle {stateDefault} {cornerAll}'>" + "<span class='{icon} {iconVGripSolid}'></span></div>" + "<div class='wijmo-wijsuperpanel-hbar-buttonleft {stateDefault} {cornerBL}'>" + "<span class='{icon} {iconArrowLeft}'></span></div>" + "<div class='wijmo-wijsuperpanel-hbar-buttonright {stateDefault} {cornerBR}'>" + "<span class='{icon} {iconArrowRight}'></span></div>" + "</div>", vbarHtml = "<div class='wijmo-wijsuperpanel-vbarcontainer {header}'>" + "<div class='wijmo-wijsuperpanel-handle {stateDefault} {cornerAll}'>" + "<span class='{icon} {iconHGripSolid}'></span></div>" + "<div class='wijmo-wijsuperpanel-vbar-buttontop {stateDefault} {cornerTR}'>" + "<span class='{icon} {iconArrowUp}'></span></div>" + "<div class='wijmo-wijsuperpanel-vbar-buttonbottom {stateDefault} {cornerBR}'>" + "<span class='{icon} {iconArrowDown}'></span></div>" + "</div>", hButtons = "<div class='{stateDefault} wijmo-wijsuperpanel-button " + "wijmo-wijsuperpanel-buttonleft'><span class='{icon} {iconCaratLeft}'>" + "</span></div><div class='{stateDefault}" + " wijmo-wijsuperpanel-button wijmo-wijsuperpanel-buttonright'>" + "<span class='{icon} {iconCaratRight}'></span></div>", vButtons = "<div class='{stateDefault} wijmo-wijsuperpanel-button" + " wijmo-wijsuperpanel-buttontop'><span class='{icon} {iconCaratUp}'>" + "</span></div><div class='{stateDefault} wijmo-wijsuperpanel-button" + " wijmo-wijsuperpanel-buttonbottom'><span class='{icon} {iconCaratDown}'>" + " </span></div>";
        wijsuperpanel.prototype = $.extend(true, {
        }, $.Widget.prototype, {
            widgetEventPrefix: "wijsuperpanel",
            _setOption: function (key, value) {
                var self = this, o = self.options, f = self._fields(), hd = f.hbarDrag, vd = f.vbarDrag, r = f.resizer;
                // override existing
                if(key === "animationOptions") {
                    value = $.extend(o.animationOptions, value);
                } else if(key === "hScroller") {
                    if(value.scrollLargeChange !== undefined && value.scrollLargeChange !== null) {
                        self._autoHLarge = false;
                    }
                    value = $.extend(o.hScroller, value);
                    self.refresh();
                } else if(key === "vScroller") {
                    if(value.scrollLargeChange !== undefined && value.scrollLargeChange !== null) {
                        self._autoVLarge = false;
                    }
                    value = $.extend(o.vScroller, value);
                    self.refresh();
                } else if(key === "resizableOptions") {
                    value = $.extend(self.resizableOptions, value);
                }
                $.Widget.prototype._setOption.apply(self, arguments);
                if($.isPlainObject(value)) {
                    self.options[key] = value;
                }
                switch(key) {
                    case "allowResize":
                        self._initResizer();
                        break;
                    case "disabled":
                        if(value) {
                            if(hd !== undefined) {
                                hd.draggable("disable");
                            }
                            if(vd !== undefined) {
                                vd.draggable("disable");
                            }
                            if(r !== undefined) {
                                r.resizable("disable");
                            }
                        } else {
                            if(hd !== undefined) {
                                hd.draggable("enable");
                            }
                            if(vd !== undefined) {
                                vd.draggable("enable");
                            }
                            if(r !== undefined) {
                                r.resizable("enable");
                            }
                        }
                        break;
                    case "mouseWheelSupport":
                    case "keyboardSupport":
                        self._bindElementEvents(self, f, self.element, o);
                        break;
                }
                return self;
            },
            _create: function () {
                var self = this, o = self.options;
                o.vScroller.dir = "v";
                o.hScroller.dir = "h";
                self._initMarkup();
                //Add support for touch
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                self.paintPanel();
                self._initResizer();
                if(self.options.disabled) {
                    self.disable();
                }
                self._detectAutoRefresh();
                if(o.listenContentScroll) {
                    self._listenContentScroll();
                }
                //update for visibility change
                if(self.element.is(":hidden") && self.element.wijAddVisibilityObserver) {
                    self.element.wijAddVisibilityObserver(function () {
                        if(self.element.wijRemoveVisibilityObserver) {
                            self.element.wijRemoveVisibilityObserver();
                        }
                        self.refresh();
                    }, "wijsuperpanel");
                }
            },
            _initMarkup: function () {
                var css = this.options.wijCSS, reg = /\{(\w+?)\}/ig, callback = function (i, g1) {
                    return css[g1];
                };
                activeCss = css.stateActive;
                hbarHtml = hbarHtml.replace(reg, callback);
                vbarHtml = vbarHtml.replace(reg, callback);
                hButtons = hButtons.replace(reg, callback);
                vButtons = vButtons.replace(reg, callback);
            },
            _detectAutoRefresh: function () {
                // register with auto fresh.
                                var self = this, panels = $.wijmo.wijsuperpanel.panels;
                if(panels === undefined) {
                    panels = [];
                    $.wijmo.wijsuperpanel.panels = panels;
                }
                panels.push(self);
                // start timer to monitor content.
                if(self.options.autoRefresh) {
                    if(!$.wijmo.wijsuperpanel.setAutoRefreshInterval) {
                        $.wijmo.wijsuperpanel.setAutoRefreshInterval = self._setAutoRefreshInterval;
                        $.wijmo.wijsuperpanel.setAutoRefreshInterval();
                    }
                }
            },
            _setAutoRefreshInterval: function () {
                var interval = $.wijmo.wijsuperpanel.autoRereshInterval, panels = $.wijmo.wijsuperpanel.panels, intervalID = window.setInterval(function () {
                    window.clearInterval(intervalID);
                    var count = panels.length, toContinue = false, i, panel, mainElement, autoRefresh, ele, mark;
                    for(i = 0; i < count; i++) {
                        panel = panels[i];
                        mainElement = panel.element[0];
                        autoRefresh = panel.options.autoRefresh;
                        if(autoRefresh) {
                            toContinue = true;
                        }
                        ele = panel.getContentElement();
                        mark = panel._paintedMark;
                        if(panel.options.autoRefresh && ele.is(":visible") && (mark === undefined || mark.width !== ele[0].offsetWidth || mark.height !== ele[0].offsetHeight || mark.mainWidth !== mainElement.offsetWidth || mark.mainHeight !== mainElement.offsetHeight)) {
                            panel.paintPanel();
                        }
                    }
                    if(toContinue) {
                        window.setTimeout($.wijmo.wijsuperpanel.setAutoRefreshInterval, 0);
                    }
                }, interval === undefined ? 500 : interval);

            },
            destroy: function () {
                /// <summary>
                /// Destroys wijsuperpanel widget and reset the DOM element.
                /// </summary>
                                var self = this, f = self._fields(), ele = self.element, buttons, templateWrapper, wijCSS = self.options.wijCSS;
                // remove this widget from panels array.
                $.wijmo.wijsuperpanel.panels = $.grep($.wijmo.wijsuperpanel.panels, function (value) {
                    return value !== self;
                }, false);
                if(!f.initialized) {
                    return;
                }
                if(self._radiusKey) {
                    self.element.css(self._radiusKey, "");
                }
                if(f.intervalID !== undefined) {
                    window.clearInterval(f.intervalID);
                    f.intervalID = undefined;
                }
                // destory widgets
                if(f.resizer !== undefined) {
                    f.resizer.resizable("destroy");
                }
                if(f.hbarContainer !== undefined) {
                    f.hbarDrag.remove();
                    f.hbarContainer.unbind("." + self.widgetName);
                }
                if(f.vbarContainer !== undefined) {
                    f.vbarDrag.remove();
                    f.vbarContainer.unbind("." + self.widgetName);
                }
                ele.unbind("." + self.widgetName);
                f.contentWrapper.unbind("." + self.widgetName);
                buttons = f.stateContainer.find(">.wijmo-wijsuperpanel-button");
                buttons.unbind("." + self.widgetName);
                templateWrapper = f.templateWrapper;
                templateWrapper.contents().each(function (index, e) {
                    ele.append(e);
                });
                f.stateContainer.remove();
                if(f.tabindex) {
                    ele.removeAttr("tabindex");
                }
                ele.removeClass([
                    "wijmo-wijsuperpanel",
                    wijCSS.widget,
                    wijCSS.content,
                    wijCSS.cornerAll
                ].join(' '));
                $.Widget.prototype.destroy.apply(self, arguments);
            },
            _fields: function () {
                var self = this, ele = self.element, key = self.widgetName + "-fields", d = self._fieldsStore;
                if(d === undefined) {
                    d = {
                    };
                    ele.data(key, d);
                    self._fieldsStore = d;
                }
                return d;
            },
            _hasMode: function (scroller, mode) {
                var modes = scroller.scrollMode.split(",");
                modes = $.map(modes, function (n) {
                    return $.trim(n).toLowerCase();
                });
                return $.inArray(mode.toLowerCase(), modes) > -1;
            },
            _bindElementEvents: function (self, f, ele, o) {
                // mouse move only edge mode is used.
                                var hEdge = self._hasMode(o.hScroller, "edge"), vEdge = self._hasMode(o.vScroller, "edge"), wn = self.widgetName;
                if(hEdge || vEdge) {
                    if(self._mousemoveBind === undefined) {
                        self._mousemoveBind = true;
                        ele.bind("mousemove." + wn, self, self._contentMouseMove);
                        ele.bind("mouseleave." + wn, null, function () {
                            self._clearInterval();
                        });
                    }
                } else {
                    ele.unbind("mousemove", self._contentMouseMove);
                    self._mousemoveBind = undefined;
                }
                if(o.mouseWheelSupport) {
                    if(self._mouseWheelBind === undefined) {
                        self._mouseWheelBind = true;
                        ele.bind("mousewheel." + wn, self, self._panelMouseWheel);
                    }
                } else {
                    self.element.unbind("mousewheel", self._panelMouseWheel);
                    self._mouseWheelBind = undefined;
                }
                if(o.keyboardSupport) {
                    if(self._keyboardBind === undefined) {
                        self._keyboardBind = true;
                        ele.bind("keydown." + wn, self, self._panelKeyDown);
                    }
                } else {
                    ele.unbind("keydown", self._panelKeyDown);
                    self._keyboardBind = undefined;
                }
            },
            _dragStop: function (e, self, dir) {
                // Handles mouse drag stop event of thumb button.
                var data = {
                    dragHandle: dir
                };
                self._trigger("dragStop", e, data);
            },
            _contentMouseMove: function (e) {
                // Handles mouse move event of content area.
                // Edge hover scrolling is handled in this method.
                                var self = e.data, o = self.options, hScroller, vScroller, contentWrapper, f, hMode, vMode, mousePagePosition, off, left, top, hEdge, vEdge, innerHeight, innerWidth, dir;
                if(o.disabled) {
                    return;
                }
                hScroller = o.hScroller;
                vScroller = o.vScroller;
                contentWrapper = $(e.currentTarget);
                f = self._fields();
                hMode = self._hasMode(hScroller, "edge");
                vMode = self._hasMode(vScroller, "edge");
                self._clearInterval();
                mousePagePosition = {
                    X: e.pageX,
                    Y: e.pageY
                };
                off = contentWrapper.offset();
                left = off.left;
                top = off.top;
                left = mousePagePosition.X - left;
                top = mousePagePosition.Y - top;
                hEdge = hScroller.hoverEdgeSpan;
                vEdge = vScroller.hoverEdgeSpan;
                innerHeight = contentWrapper.innerHeight();
                innerWidth = contentWrapper.innerWidth();
                dir = "";
                if(hMode) {
                    if(left < hEdge) {
                        dir = "left";
                    }
                    if(left > (innerWidth - hEdge)) {
                        dir = "right";
                    }
                }
                if(vMode) {
                    if(top < vEdge) {
                        dir = "top";
                    }
                    if(top > (innerHeight - vEdge)) {
                        dir = "bottom";
                    }
                }
                self._setScrollingInterval(f, dir, self, false);
            },
            _setScrollingInterval: function (f, dir, self, large) {
                var o = self.options;
                if(dir.length > 0) {
                    f.internalFuncID = window.setInterval(function () {
                        self._doScrolling(dir, self, large);
                    }, o.keyDownInterval);
                }
            },
            _scrollButtonMouseOver: function (e) {
                // Scroll buttons mouse over event handler.
                                var self = e.data, o = self.options, button;
                if(o.disabled) {
                    return;
                }
                button = $(e.currentTarget);
                if(!button.hasClass(o.wijCSS.stateDisabled)) {
                    button.bind("mouseout." + self.widgetName, self, self._buttonMouseOut).bind("mousedown." + self.widgetName, self, self._buttonMouseDown).bind("mouseup." + self.widgetName, self, self._buttonMouseUp).addClass(o.wijCSS.stateHover);
                    self._buttonScroll(button, self, "buttonshover");
                }
            },
            _buttonScroll: function (button, self, mode) {
                // Do button scroll.
                                var dir = "", o = self.options, f = self._fields(), hMode = self._hasMode(o.hScroller, mode), vMode = self._hasMode(o.vScroller, mode);
                if(button.hasClass("wijmo-wijsuperpanel-buttonleft") && hMode) {
                    dir = "left";
                } else if(button.hasClass("wijmo-wijsuperpanel-buttonright") && hMode) {
                    dir = "right";
                } else if(button.hasClass("wijmo-wijsuperpanel-buttontop") && vMode) {
                    dir = "top";
                } else if(button.hasClass("wijmo-wijsuperpanel-buttonbottom") && vMode) {
                    dir = "bottom";
                }
                if(dir.length > 0) {
                    self._clearInterval();
                    self._doScrolling(dir, self, true);
                    self._setScrollingInterval(f, dir, self, true);
                }
            },
            _listenContentScroll: function () {
                var self = this, o = self.options, f = self._fields(), hbarContainer = f.hbarContainer, hbarDrag = f.hbarDrag, vbarContainer = f.vbarContainer, vbarDrag = f.vbarDrag, templateWrapper = f.templateWrapper, contentWrapper = f.contentWrapper, w = contentWrapper.width(), h = contentWrapper.height(), offset = templateWrapper && templateWrapper.offset(), ox = offset && offset.left, oy = offset && offset.top, contentWidth = f.contentWidth, contentHeight = f.contentHeight;
                contentWrapper.bind("scroll", function (event) {
                    var pos = templateWrapper.position(), x = pos.left, y = pos.top;
                    contentWrapper.scrollTop(0).scrollLeft(0);
                    templateWrapper.css({
                        left: x,
                        top: y
                    });
                    if(x <= 0 && x > w - contentWidth) {
                        o.hScroller.scrollValue = self.scrollPxToValue(-x, "h");
                        self._scrollDrag("h", hbarContainer, hbarDrag, true);
                    }
                    if(y <= 0 && y > h - contentHeight) {
                        o.vScroller.scrollValue = self.scrollPxToValue(-y, "v");
                        self._scrollDrag("v", vbarContainer, vbarDrag, true);
                    }
                });
            },
            _buttonMouseDown: function (e) {
                var self = e.data, button, wijCSS = self.options.wijCSS;
                if(self.options.disabled) {
                    return;
                }
                button = $(e.currentTarget);
                if(!button.hasClass(wijCSS.stateDisabled)) {
                    button.addClass(wijCSS.stateActive);
                    self._buttonScroll(button, self, "buttons");
                }
            },
            _buttonMouseUp: function (e) {
                var self = e.data, button = $(e.currentTarget);
                button.removeClass(self.options.wijCSS.stateActive);
                self._clearInterval();
            },
            _buttonMouseOut: function (e) {
                var self = e.data, wijCSS = self.options.wijCSS, button = $(e.currentTarget);
                button.unbind("mouseout", self._buttonMouseOut).unbind("mousedown", self._buttonMouseDown).unbind("mouseup", self._buttonMouseUp).removeClass(wijCSS.stateHover).removeClass(wijCSS.stateActive);
                self._clearInterval();
            },
            getKeyCodeEnum: function () {
                if($.ui && $.ui.keyCode) {
                    return $.ui.keyCode;
                }
                if($.mobile && $.mobile.keyCode) {
                    return $.mobile.keyCode;
                }
                throw "keyCode object is not found";
            },
            _panelKeyDown: function (e) {
                // Key down handler.
                                var self = e.data, o = self.options, shift, keycode, kCode = self.getKeyCodeEnum();
                if(!o.keyboardSupport || o.disabled) {
                    return;
                }
                shift = e.shiftKey;
                keycode = e.keyCode;
                if(keycode === kCode.LEFT) {
                    self._doScrolling("left", self, shift);
                } else if(keycode === kCode.RIGHT) {
                    self._doScrolling("right", self, shift);
                } else if(keycode === kCode.UP) {
                    self._doScrolling("top", self, shift);
                } else if(keycode === kCode.DOWN) {
                    self._doScrolling("bottom", self, shift);
                }
                e.stopPropagation();
                e.preventDefault();
            },
            _draggingInternal: function (data, self, scroller, originalElement) {
                var dir = scroller.dir, h = dir === "h", key = h ? "left" : "top", left = //the parameter from draggable widget is supposed to
                //be used instead of the style property of html element
                //left = parseFloat(originalElement[0].style[key].replace("px", "")) -
                data.position[key] - self._getScrollContainerPadding(key), track = self._getTrackLen(dir) - //originalElement[h ? "outerWidth" : "outerHeight"](),
                originalElement[h ? "outerWidth" : "outerHeight"](true), proportion = left / track, topValue = (scroller.scrollMax - scroller.scrollLargeChange + 1), v = proportion * topValue, arg, scrollValue, val;
                if(v < scroller.scrollMin) {
                    v = scroller.scrollMin;
                }
                if(v > topValue) {
                    v = topValue;
                }
                arg = {
                    oldValue: scroller.scrollValue,
                    newValue: v,
                    dir: dir
                };
                if(!self._scrolling(true, self, arg)) {
                    // event is canceled in scrolling.
                    return;
                }
                if(self.customScroll) {
                    val = Math.abs(self.customScroll);
                    scrollValue = self.scrollPxToValue(val, scroller.dir);
                }
                scroller.scrollValue = scrollValue || v;
                self.customScroll = undefined;
                self._setDragAndContentPosition(true, false, dir, "dragging");
            },
            _dragging: function (e, data, self) {
                var o = self.options, originalElement = $(e.target), p = originalElement.parent();
                if(p.hasClass(hbarContainerCSS)) {
                    self._draggingInternal(data, self, o.hScroller, originalElement);
                } else {
                    self._draggingInternal(data, self, o.vScroller, originalElement);
                }
            },
            _panelMouseWheel: function (e, delta) {
                var self = e.data, o = self.options, originalElement, dir, onHbar, hScroller, vScroller, scrollEnd;
                if(!o.mouseWheelSupport || o.disabled) {
                    return;
                }
                //var f = self._fields();
                //var scrollerWrapper = f.stateContainer;
                //var hbarContainer = f.hbarContainer;
                originalElement = $(e.srcElement || e.originalEvent.target);
                dir = "";
                onHbar = originalElement.closest("." + hbarContainerCSS, self.element).size() > 0;
                hScroller = o.hScroller;
                vScroller = o.vScroller;
                if(delta > 0) {
                    dir = onHbar ? "left" : "top";
                } else {
                    dir = onHbar ? "right" : "bottom";
                }
                if(dir.length > 0) {
                    self._doScrolling(dir, self);
                }
                scrollEnd = false;
                if(dir === "left") {
                    scrollEnd = !self.hNeedScrollBar || Math.abs(hScroller.scrollValue - hScroller.scrollMin) < 0.001;
                }
                if(dir === "right") {
                    scrollEnd = !self.hNeedScrollBar || Math.abs(hScroller.scrollValue - (hScroller.scrollMax - self._getHScrollBarLargeChange() + 1)) < 0.001;
                }
                if(dir === "top") {
                    scrollEnd = !self.vNeedScrollBar || Math.abs(vScroller.scrollValue - vScroller.scrollMin) < 0.001;
                }
                if(dir === "bottom") {
                    scrollEnd = !self.vNeedScrollBar || Math.abs(vScroller.scrollValue - (vScroller.scrollMax - self._getVScrollBarLargeChange() + 1)) < 0.001;
                }
                if(!scrollEnd || !o.bubbleScrollingEvent || dir === "left" || dir === "right") {
                    e.stopPropagation();
                    e.preventDefault();
                }
            },
            _documentMouseUp: function (e) {
                var self = e.data.self, o = self.options, ele = e.data.ele;
                ele.removeClass(o.wijCSS.stateActive);
                self._clearInterval();
                $(document).unbind("mouseup", self._documentMouseUp);
            },
            _scrollerMouseOver: function (e) {
                var self = e.data, o = self.options, originalElement, ele, addhover;
                if(o.disabled) {
                    return;
                }
                originalElement = $(e.srcElement || e.originalEvent.target);
                ele = null;
                addhover = false;
                if(originalElement.hasClass(o.wijCSS.stateDefault)) {
                    ele = originalElement;
                    addhover = true;
                } else if(originalElement.parent().hasClass(o.wijCSS.stateDefault)) {
                    ele = originalElement.parent();
                    addhover = true;
                } else if(originalElement.hasClass(vbarContainerCSS) || originalElement.hasClass(hbarContainerCSS)) {
                    ele = originalElement;
                }
                if(ele) {
                    if(addhover) {
                        ele.addClass(o.wijCSS.stateHover);
                    }
                    ele.bind("mouseout." + self.widgetName, self, self._elementMouseOut);
                    ele.bind("mousedown." + self.widgetName, self, self._elementMouseDown);
                    ele.bind("mouseup." + self.widgetName, self, self._elementMouseUp);
                }
            },
            _elementMouseUp: function (e) {
                var ele = $(e.currentTarget);
                //var self = e.data;
                ele.removeClass(activeCss);
            },
            _elementMouseDown: function (e) {
                var ele = $(e.currentTarget), self = e.data, scrollDirection, large, active, hbarDrag, pos, vbarDrag, pos2, f;
                if(self.options.disabled || e.which !== 1) {
                    return;
                }
                scrollDirection = "";
                large = false;
                active = false;
                if(ele.hasClass("wijmo-wijsuperpanel-vbar-buttontop")) {
                    scrollDirection = "top";
                    active = true;
                } else if(ele.hasClass("wijmo-wijsuperpanel-vbar-buttonbottom")) {
                    scrollDirection = "bottom";
                    active = true;
                } else if(ele.hasClass("wijmo-wijsuperpanel-hbar-buttonleft")) {
                    scrollDirection = "left";
                    active = true;
                } else if(ele.hasClass("wijmo-wijsuperpanel-hbar-buttonright")) {
                    scrollDirection = "right";
                    active = true;
                } else if(ele.hasClass(scrollerHandle)) {
                    ele.addClass(activeCss);
                    return;
                } else if(ele.hasClass(hbarContainerCSS)) {
                    hbarDrag = ele.find("." + scrollerHandle);
                    pos = hbarDrag.offset();
                    if(e.pageX < pos.left) {
                        scrollDirection = "left";
                    } else {
                        scrollDirection = "right";
                    }
                    large = true;
                } else if(ele.hasClass(vbarContainerCSS)) {
                    vbarDrag = ele.find("." + scrollerHandle);
                    pos2 = vbarDrag.offset();
                    if(e.pageY < pos2.top) {
                        scrollDirection = "top";
                    } else {
                        scrollDirection = "bottom";
                    }
                    large = true;
                }
                self._clearInterval();
                self._doScrolling(scrollDirection, self, large);
                f = self._fields();
                self._setScrollingInterval(f, scrollDirection, self, large);
                if(active) {
                    ele.addClass(activeCss);
                }
                $(document).bind("mouseup." + self.widgetName, {
                    self: self,
                    ele: ele
                }, self._documentMouseUp);
            },
            doScrolling: function (dir, large) {
                /// <summary>
                /// Do scrolling.
                /// </summary>
                /// <param name="dir" type="string">
                ///   Scrolling direction. Options are: "left", "right", "top" and "bottom".
                /// </param>
                /// <param name="large" type="Boolean">
                /// Whether to scroll a large change.
                /// </param>
                this._doScrolling(dir, this, large);
            },
            _setScrollerValue: function (dir, scroller, smallChange, largeChange, isAdd, isLarge, self) {
                //var o = self.options;
                                var vMin = scroller.scrollMin, change = isLarge ? largeChange : smallChange, value = scroller.scrollValue, t, vTopValue, firstStepChangeFix, data, scrollValue, val;
                if(!value) {
                    value = vMin;
                }
                t = 0;
                if(isAdd) {
                    vTopValue = scroller.scrollMax - largeChange + 1;
                    if(Math.abs(value - vTopValue) < 0.001) {
                        self._clearInterval();
                        return false;
                    }
                    firstStepChangeFix = scroller.firstStepChangeFix;
                    t = value + change;
                    if(!isLarge && Math.abs(value - vMin) < 0.0001 && !isNaN(firstStepChangeFix)) {
                        t += firstStepChangeFix;
                    }
                    if(t > vTopValue) {
                        t = vTopValue;
                    }
                } else {
                    if(Math.abs(value - vMin) < 0.001) {
                        self._clearInterval();
                        return false;
                    }
                    t = value - change;
                    if(t < 0) {
                        t = vMin;
                    }
                }
                data = {
                    oldValue: scroller.scrollValue,
                    newValue: t,
                    direction: dir,
                    dir: scroller.dir
                };
                if(!self._scrolling(true, self, data)) {
                    return false;
                }
                if(self.customScroll) {
                    val = Math.abs(self.customScroll);
                    scrollValue = self.scrollPxToValue(val, scroller.dir);
                }
                scroller.scrollValue = scrollValue || t;
                self.customScroll = undefined;
                return true;
            },
            _doScrolling: function (dir, self, large) {
                // Does wijsuperpanel scrolling.
                // <param name="dir" type="String">
                // Scroll direction.
                // Options are: "left", "right", "top" and "bottom".
                // </param>
                // <param name="self" type="jQuery">
                // Pointer to the wijsuperpanel widget instance.
                // </param>
                // <param name="large" type="Boolean">
                // Whether to scroll a large change.
                // </param>
                                var o = self.options, vScroller = o.vScroller, hScroller = o.hScroller, vSmall = self._getVScrollBarSmallChange(), vLarge = self._getVScrollBarLargeChange(), hLarge = self._getHScrollBarLargeChange(), hSmall = self._getHScrollBarSmallChange();
                if(dir === "top" || dir === "bottom") {
                    if(!self._setScrollerValue(dir, vScroller, vSmall, vLarge, dir === "bottom", large, self)) {
                        return;
                    }
                    dir = "v";
                } else if(dir === "left" || dir === "right") {
                    if(!self._setScrollerValue(dir, hScroller, hSmall, hLarge, dir === "right", large, self)) {
                        return;
                    }
                    dir = "h";
                }
                self._setDragAndContentPosition(true, true, dir);
            },
            _disableButtonIfNeeded: function (self) {
                // Disables scrolling buttons.
                                var f = self._fields(), o, buttonLeft, buttonRight, buttonTop, buttonBottom, hLargeChange, hMax, hValue, hScrollMin, vLargeChange, vMax, vValue, vScrollMin;
                if(f.intervalID > 0) {
                    window.clearInterval(f.intervalID);
                }
                o = self.options;
                buttonLeft = f.buttonLeft;
                buttonRight = f.buttonRight;
                buttonTop = f.buttonTop;
                buttonBottom = f.buttonBottom;
                if(buttonLeft !== undefined) {
                    hLargeChange = self._getHScrollBarLargeChange();
                    hMax = o.hScroller.scrollMax - hLargeChange + 1;
                    hValue = o.hScroller.scrollValue;
                    hScrollMin = o.hScroller.scrollMin;
                    if(hValue === undefined) {
                        hValue = hScrollMin;
                    }
                    if(Math.abs(hValue - hScrollMin) < 0.001 || !f.hScrolling) {
                        buttonLeft.addClass(o.wijCSS.stateDisabled);
                    } else {
                        buttonLeft.removeClass(o.wijCSS.stateDisabled);
                    }
                    if(Math.abs(hValue - hMax) < 0.001 || !f.hScrolling) {
                        buttonRight.addClass(o.wijCSS.stateDisabled);
                    } else {
                        buttonRight.removeClass(o.wijCSS.stateDisabled);
                    }
                }
                if(buttonTop !== undefined) {
                    vLargeChange = self._getVScrollBarLargeChange();
                    vMax = o.vScroller.scrollMax - vLargeChange + 1;
                    vValue = o.vScroller.scrollValue;
                    vScrollMin = o.vScroller.scrollMin;
                    if(vValue === undefined) {
                        vValue = vScrollMin;
                    }
                    if(Math.abs(vValue - vScrollMin) < 0.001 || !f.vScrolling) {
                        buttonTop.addClass(o.wijCSS.stateDisabled);
                    } else {
                        buttonTop.removeClass(o.wijCSS.stateDisabled);
                    }
                    if(Math.abs(vValue - vMax) < 0.001 || !f.vScrolling) {
                        buttonBottom.addClass(o.wijCSS.stateDisabled);
                    } else {
                        buttonBottom.removeClass(o.wijCSS.stateDisabled);
                    }
                }
            },
            _clearInterval: function () {
                var f = this._fields(), intervalID = f.internalFuncID;
                if(intervalID > 0) {
                    window.clearInterval(intervalID);
                    f.internalFuncID = -1;
                }
            },
            _elementMouseOut: function (event) {
                var ele = $(event.currentTarget), self = event.data;
                ele.unbind("mouseout", self._elementMouseOut);
                ele.unbind("mousedown", self._elementMouseDown);
                ele.unbind("mouseup", self._elementMouseUp);
                ele.removeClass(self.options.wijCSS.stateHover);
            },
            _getScrollOffset: function (child1) {
                var child = $(child1), f, cWrapper, tempWrapper, childOffset, templateOffset, cWrapperOffset, tDistance, bDistance, lDistance, rDistance, result = // left, top,
                {
                    left: null,
                    top: null
                };
                if(child.length === 0) {
                    return result;
                }
                f = this._fields();
                cWrapper = f.contentWrapper;
                tempWrapper = f.templateWrapper;
                childOffset = child.offset();
                templateOffset = tempWrapper.offset();
                childOffset.leftWidth = childOffset.left + child.outerWidth();
                childOffset.topHeight = childOffset.top + child.outerHeight();
                cWrapperOffset = cWrapper.offset();
                cWrapperOffset.leftWidth = cWrapperOffset.left + cWrapper.outerWidth();
                cWrapperOffset.topHeight = cWrapperOffset.top + cWrapper.outerHeight();
                lDistance = childOffset.left - templateOffset.left;
                if(childOffset.left < cWrapperOffset.left) {
                    result.left = lDistance;
                } else if(childOffset.leftWidth > cWrapperOffset.leftWidth) {
                    rDistance = childOffset.leftWidth - templateOffset.left - cWrapper.innerWidth();
                    if(lDistance < rDistance) {
                        result.left = lDistance;
                    } else {
                        result.left = rDistance;
                    }
                }
                tDistance = childOffset.top - templateOffset.top;
                if(childOffset.top < cWrapperOffset.top) {
                    result.top = tDistance;
                } else if(childOffset.topHeight > cWrapperOffset.topHeight) {
                    bDistance = childOffset.topHeight - templateOffset.top - cWrapper.innerHeight();
                    if(tDistance < bDistance) {
                        result.top = tDistance;
                    } else {
                        result.top = bDistance;
                    }
                }
                return result;
            },
            _scrollDrag: function (dir, hbarContainer, hbarDrag, fireScrollEvent) {
                var self = this, o = self.options, v = dir === "v", scroller = v ? o.vScroller : o.hScroller, hMin = scroller.scrollMin, hMax = scroller.scrollMax, hValue = scroller.scrollValue === undefined ? hMin : (scroller.scrollValue - hMin), hLargeChange = self._getLargeChange(dir), max = hMax - hMin - hLargeChange + 1, dragleft = -1, track, drag, padding;
                if(hValue > max) {
                    hValue = max;
                }
                if(hbarContainer !== undefined) {
                    track = self._getTrackLen(dir);
                    drag = hbarDrag[v ? "outerHeight" : "outerWidth"]();
                    padding = self._getScrollContainerPadding(v ? "top" : "left");
                    dragleft = (hValue / max) * (track - drag) + padding;
                }
                if(dragleft >= 0) {
                    hbarDrag.css(v ? "top" : "left", dragleft + "px");
                }
                self._scrollEnd(fireScrollEvent, self, dir);
            },
            needToScroll: function (child1) {
                /// <summary>
                /// Determine whether scoll the child DOM element to view
                /// need to scroll the scroll bar
                /// </summary>
                /// <param name="child" type="DOMElement/JQueryObj">
                /// The child to scroll to.
                /// </param>
                var offset = this._getScrollOffset(child1);
                return offset.top !== null || offset.left !== null;
            },
            scrollChildIntoView: function (child1) {
                /// <summary>
                /// Scroll children DOM element to view.
                /// </summary>
                /// <param name="child" type="DOMElement/JQueryObj">
                /// The child to scroll to.
                /// </param>
                                var offset = this._getScrollOffset(child1), left = offset.left, top = offset.top;
                if(left !== null) {
                    this.hScrollTo(left);
                }
                if(top !== null) {
                    this.vScrollTo(top);
                }
            },
            hScrollTo: function (x) {
                /// <summary>
                /// Scroll to horizontal position.
                /// </summary>
                /// <param name="x" type="Number">
                /// The position to scroll to.
                /// </param>
                var o = this.options;
                //var f = this._fields();
                o.hScroller.scrollValue = this.scrollPxToValue(x, "h");
                //this._setDragAndContentPosition(false, true, "h", "nonestop");
                this._setDragAndContentPosition(true, true, "h", "nonestop");
            },
            vScrollTo: function (y) {
                /// <summary>
                /// Scroll to vertical position.
                /// </summary>
                /// <param name="y" type="Number">
                /// The position to scroll to.
                /// </param>
                var o = this.options;
                o.vScroller.scrollValue = this.scrollPxToValue(y, "v");
                //this._setDragAndContentPosition(false, true, "v", "nonestop");
                this._setDragAndContentPosition(true, true, "v", "nonestop");
            },
            scrollPxToValue: function (px, dir) {
                /// <summary>
                /// Convert pixel to scroll value.
                /// For example, wijsuperpanel scrolled 50px
                ///which is value 1 after conversion.
                /// </summary>
                /// <param name="px" type="Number">
                /// Length of scrolling.
                /// </param>
                /// <param name="dir" type="String">
                /// Scrolling direction. Options are: "h" and "v".
                /// </param>
                                var o = this.options, m = (dir === "h" ? "outerWidth" : "outerHeight"), m1 = (dir === "h" ? "contentWidth" : "contentHeight"), scroller = (dir === "h" ? "hScroller" : "vScroller"), f = this._fields(), cWrapper = f.contentWrapper, size = //var tempWrapper = f.templateWrapper;
                f[m1], contentHeight = cWrapper[m](), vMin = o[scroller].scrollMin, vMax = o[scroller].scrollMax, vRange = vMax - vMin, vLargeChange = (dir === "h" ? this._getHScrollBarLargeChange() : this._getVScrollBarLargeChange()), maxv = vRange - vLargeChange + 1, ret = maxv * (px / (size - contentHeight));
                if(ret < vMin) {
                    ret = vMin;
                }
                if(ret > maxv) {
                    ret = maxv;
                }
                return ret;
            },
            scrollTo: function (x, y) {
                /// <summary>
                /// Refreshes wijsuperpanel.
                /// Needs to be called after content being changed.
                /// </summary>
                /// <param name="x" type="Number">
                /// Horizontal position to scroll to.
                /// </param>
                /// <param name="y" type="Number">
                /// Vertical position to scroll to.
                /// </param>
                this.hScrollTo(x);
                this.vScrollTo(y);
            },
            refresh: function () {
                /// <summary>
                /// Refreshes wijsuperpanel.
                /// Needs to be called after content being changed.
                /// </summary>
                /// <returns type="Boolean">
                /// Returns true if it is successful, else returns false.
                /// </returns>
                this.paintPanel();
            },
            paintPanel: function (unfocus) {
                /// <summary>
                /// Refreshes wijsuperpanel.
                /// Needs to be called after content being changed.
                /// </summary>
                /// <returns type="Boolean">
                /// Returns true if painting is successful, else returns false.
                /// </returns>
                                var self = this, ele = self.element, focused, o, f, templateWrapper;
                if(ele.is(":visible")) {
                    focused = typeof document.activeElement != 'unknown' ? document.activeElement : undefined;
                    o = self.options;
                    f = self._fields();
                    if(!f.initialized) {
                        self._initialize(f, ele, self);
                    }
                    self._resetLargeChange(self, f, o);
                    self._bindElementEvents(self, f, ele, o);
                    templateWrapper = f.templateWrapper;
                    templateWrapper.css({
                        "float": "left",
                        left: "0px",
                        top: "0px",
                        width: "auto",
                        height: "auto"
                    });
                    // hide and show wrapper div to force the width to change
                    // for some browser.
                    templateWrapper.hide();
                    templateWrapper.show();
                    f.contentWidth = templateWrapper.width();
                    f.contentHeight = templateWrapper.height();
                    templateWrapper.css("float", "");
                    self._setRounder(self, ele);
                    self._setInnerElementsSize(f, ele);
                    if(self._testScroll(self, f, o) === false) {
                        return false;
                    }
                    self._initScrollBars(self, f, o);
                    self._initScrollButtons(self, f, o);
                    self._trigger("painted");
                    self._paintedMark = {
                        date: new Date(),
                        mainWidth: ele[0].offsetWidth,
                        mainHeight: ele[0].offsetHeight,
                        width: f.contentWidth,
                        height: f.contentWidth
                    };
                    if(focused !== undefined && !unfocus) {
                        $(focused).focus();
                    }
                    return true;
                }
                return false;
            },
            _resetLargeChange: function (self, f, o) {
                var handle;
                if(self._autoVLarge) {
                    o.vScroller.scrollLargeChange = null;
                }
                if(self._autoHLarge) {
                    o.hScroller.scrollLargeChange = null;
                }
                f.vTrackLen = undefined;
                f.hTrackLen = undefined;
                if(f.vbarContainer) {
                    // fixed bug when the original draggable element removed when it's being dragged.
                    // use detach to keep the events to be fired(IE).
                    handle = f.vbarContainer.children("." + scrollerHandle + ":eq(0)");
                    handle.detach();
                    f.vbarContainer.remove();
                    f.vbarContainer = undefined;
                }
                if(f.hbarContainer) {
                    handle = f.hbarContainer.children("." + scrollerHandle + ":eq(0)");
                    handle.detach();
                    f.hbarContainer.remove();
                    f.hbarContainer = undefined;
                }
            },
            _initialize: function (f, ele, self) {
                var wijCSS = self.options.wijCSS;
                f.initialized = true;
                // ensure width and height
                ele.addClass([
                    "wijmo-wijsuperpanel",
                    wijCSS.widget,
                    wijCSS.content
                ].join(' '));
                f.oldHeight = ele.css("height");
                var old = ele.css("overflow");
                ele.css("overflow", "");
                // set height to element
                ele.height(ele.height());
                ele.css("overflow", old);
                self._createAdditionalDom(self, f, ele);
            },
            getContentElement: function () {
                /// <summary>
                /// Gets the content element of wijsuperpanel.
                /// Code Example:
                /// $("selector").wijsuperpanel("getContentElement");
                /// </summary>
                /// <returns type="JQueryObj" />
                return this._fields().templateWrapper;
            },
            _setButtonPosition: function (self, o, scroller, dir, target, f, state) {
                var h = dir === "h", mouseoverkey = "mouseover." + self.widgetName, decKey = h ? "buttonLeft" : "buttonTop", incKey = h ? "buttonRight" : "buttonBottom", decButton = f[decKey], incButton = f[incKey], html, buttons, defaultPosition;
                if(self._hasMode(scroller, "buttons") || self._hasMode(scroller, "buttonshover")) {
                    html = h ? hButtons : vButtons;
                    if(decButton === undefined) {
                        buttons = $(html).appendTo(state);
                        buttons.bind(mouseoverkey, self, self._scrollButtonMouseOver);
                        f[decKey] = decButton = state.children(h ? ".wijmo-wijsuperpanel-buttonleft" : ".wijmo-wijsuperpanel-buttontop");
                        f[incKey] = incButton = state.children(h ? ".wijmo-wijsuperpanel-buttonright" : ".wijmo-wijsuperpanel-buttonbottom");
                    }
                    defaultPosition = {
                        my: h ? "left" : "top",
                        of: target,
                        at: h ? "left" : "top",
                        collision: "none"
                    };
                    $.extend(defaultPosition, scroller.decreaseButtonPosition);
                    decButton.position(defaultPosition);
                    defaultPosition = {
                        my: h ? "right" : "bottom",
                        of: target,
                        at: h ? "right" : "bottom",
                        collision: "none"
                    };
                    $.extend(defaultPosition, scroller.increaseButtonPosition);
                    incButton.position(defaultPosition);
                } else if(decButton !== undefined) {
                    decButton.remove();
                    incButton.remove();
                    f[decKey] = f[incKey] = undefined;
                }
            },
            _initScrollButtons: function (self, f, o) {
                var a = f.contentWrapper, state = f.stateContainer;
                self._setButtonPosition(self, o, o.hScroller, "h", a, f, state);
                self._setButtonPosition(self, o, o.vScroller, "v", a, f, state);
            },
            _getVScrollBarSmallChange: function () {
                var o = this.options, va;
                if(!o.vScroller.scrollSmallChange) {
                    va = this._getVScrollBarLargeChange();
                    o.vScroller.scrollSmallChange = va / 2;
                }
                return o.vScroller.scrollSmallChange;
            },
            _getVScrollBarLargeChange: function () {
                return this._getLargeChange("v");
            },
            _getLargeChange: function (dir) {
                var self = this, o = self.options, f = self._fields(), v = dir === "v", scroller = v ? o.vScroller : o.hScroller, clientKey = //clientKey = v ? "clientHeight" : "clientWidth",
                v ? "innerHeight" : "innerWidth", offsetKey = v ? "contentHeight" : "contentWidth", autoKey = v ? "_autoVLarge" : "_autoHLarge", hMax, hMin, hRange, content, contentWidth, wrapperWidth, percent, large;
                if(scroller.scrollLargeChange) {
                    return scroller.scrollLargeChange;
                }
                // calculate large change if empty
                hMax = scroller.scrollMax;
                hMin = scroller.scrollMin;
                hRange = hMax - hMin;
                content = f.contentWrapper;
                //contentWidth = content[0][clientKey];
                contentWidth = content[clientKey]();
                wrapperWidth = f[offsetKey];
                percent = contentWidth / (wrapperWidth - contentWidth);
                large = ((hRange + 1) * percent) / (1 + percent);
                if(isNaN(large)) {
                    large = 0;
                }
                scroller.scrollLargeChange = large;
                self[autoKey] = true;
                return scroller.scrollLargeChange;
            },
            _getHScrollBarSmallChange: function () {
                var o = this.options, va;
                if(!o.hScroller.scrollSmallChange) {
                    va = this._getHScrollBarLargeChange();
                    o.hScroller.scrollSmallChange = va / 2;
                }
                return o.hScroller.scrollSmallChange;
            },
            _getHScrollBarLargeChange: function () {
                return this._getLargeChange("h");
            },
            _initScrollBars: function (self, f, o) {
                // Set scroll bar initial position.
                                var hScroller = o.hScroller, hMax = hScroller.scrollMax, hMin = hScroller.scrollMin, hRange = hMax - hMin, vScroller = o.vScroller, vMax = vScroller.scrollMax, vMin = vScroller.scrollMin, vRange = vMax - vMin, hbarDrag = f.hbarDrag, vbarDrag = f.vbarDrag, hLargeChange, track, dragLen, difference, icon, vLargeChange, track1, dragLen1, difference1, icon1;
                if(self.hNeedScrollBar && hbarDrag.is(":visible")) {
                    hLargeChange = self._getHScrollBarLargeChange();
                    track = self._getTrackLen("h");
                    dragLen = self._getDragLength(hRange, hLargeChange, track, o.hScroller.scrollMinDragLength);
                    hbarDrag.width(dragLen);
                    //difference = hbarDrag.outerWidth() - hbarDrag.width();
                    difference = hbarDrag.outerWidth(true) - hbarDrag.width();
                    hbarDrag.width(dragLen - difference);
                    icon = hbarDrag.children("span");
                    icon.css("margin-left", (hbarDrag.width() - icon[0].offsetWidth) / 2);
                    //if (track <= hbarDrag.outerWidth()) {
                    if(track <= hbarDrag.outerWidth(true)) {
                        hbarDrag.hide();
                    } else {
                        hbarDrag.show();
                    }
                    //fixed bug the dragger will be reset after refresh
                    if(self._isDragging == true) {
                        $(document).trigger("mouseup");
                        self._isDragging = false;
                    }
                }
                if(self.vNeedScrollBar && vbarDrag.is(":visible")) {
                    vLargeChange = self._getVScrollBarLargeChange();
                    track1 = self._getTrackLen("v");
                    dragLen1 = self._getDragLength(vRange, vLargeChange, track1, o.vScroller.scrollMinDragLength);
                    vbarDrag.height(dragLen1);
                    //difference1 = vbarDrag.outerHeight() - vbarDrag.height();
                    difference1 = vbarDrag.outerHeight(true) - vbarDrag.height();
                    vbarDrag.height(dragLen1 - difference1);
                    icon1 = vbarDrag.children("span");
                    icon1.css("margin-top", (vbarDrag.height() - icon1[0].offsetHeight) / 2);
                    //if (track1 <= vbarDrag.outerHeight()) {
                    if(track1 <= vbarDrag.outerHeight(true)) {
                        vbarDrag.hide();
                    } else {
                        vbarDrag.show();
                    }
                    //fixed bug the dragger will be reset after refresh
                    if(self._isDragging == true) {
                        $(document).trigger("mouseup");
                        self._isDragging = false;
                    }
                }
                self._setDragAndContentPosition(false, false, "both");
            },
            _getTrackLen: function (dir) {
                // Get the length of the track.
                // <param name="dir" type="String">
                // Options are: "v" and "h".
                // "v" - Vertical scroll track.
                // "h" - Horizontal scroll track.
                // </param>
                                var self = this, f = self._fields(), key = //var o = self.options;
                dir + "TrackLen", hbarContainer, vbarContainer, track, padding;
                if(f[key] !== undefined) {
                    return f[key];
                }
                hbarContainer = f.hbarContainer;
                vbarContainer = f.vbarContainer;
                track = 0;
                padding = 0;
                if(dir === "h") {
                    padding = self._getScrollContainerPadding("h");
                    track = hbarContainer.innerWidth();
                }
                if(dir === "v") {
                    padding = self._getScrollContainerPadding("v");
                    track = vbarContainer.innerHeight();
                }
                f[key] = (track - padding);
                return f[key];
            },
            _getScrollContainerPadding: function (paddingType) {
                // Get the padding of the scroll bar container.
                                var self = this, f = self._fields(), padding = 0, container, key;
                if(paddingType === "h") {
                    padding = self._getScrollContainerPadding("left") + self._getScrollContainerPadding("right");
                } else if(paddingType === "v") {
                    padding = self._getScrollContainerPadding("top") + self._getScrollContainerPadding("bottom");
                } else {
                    if(paddingType === "left" || paddingType === "right") {
                        container = f.hbarContainer;
                    } else {
                        container = f.vbarContainer;
                    }
                    key = paddingType + "Padding";
                    if(f[key] !== undefined) {
                        padding = f[key];
                        return padding;
                    }
                    //padding = parseFloat(container.css("padding-" +
                    //paddingType).replace("px", ""));
                    if(container && container.css) {
                        padding = parseFloat(container.css("padding-" + paddingType));
                    }
                    f[key] = padding;
                }
                return padding;
            },
            _triggerScroll: function (contentLeft, dir, contentAnimationOptions) {
                var data = {
                    position: contentLeft,
                    dir: dir,
                    animationOptions: contentAnimationOptions
                };
                this._trigger("scroll", null, data);
            },
            _contentDragAnimate: function (dir, animated, hbarContainer, hbarDrag, stop, fireScrollEvent, dragging) {
                var self = this, o = self.options, v = dir === "v", scroller = v ? o.vScroller : o.hScroller, tempKey = v ? "outerHeight" : "outerWidth", wrapKey = v ? "innerHeight" : "innerWidth", contentKey = v ? "contentHeight" : "contentWidth", paddingKey = v ? "top" : "left", hMin = scroller.scrollMin, hMax = scroller.scrollMax, hRange = hMax - hMin, hValue = scroller.scrollValue === undefined ? hMin : (scroller.scrollValue - hMin), hLargeChange = self._getLargeChange(dir), max = hRange - hLargeChange + 1, f = self._fields(), cWrapper = f.contentWrapper, tempWrapper = f.templateWrapper, contentLeft, dragleft, track, drag, r, padding, dragAnimationOptions, properties, contentAnimationOptions, userComplete, properties1, key;
                if(hValue > max) {
                    hValue = max;
                }
                contentLeft = (f[contentKey] - cWrapper[wrapKey]()) * (hValue / max);
                if(Math.abs(contentLeft) < 0.001) {
                    contentLeft = 0;
                }
                contentLeft = Math.round(contentLeft);
                dragleft = -1;
                if(hbarContainer !== undefined) {
                    if(animated && hbarDrag.is(":animated") && stop !== "nonestop") {
                        hbarDrag.stop(true, false);
                    }
                    track = self._getTrackLen(dir);
                    //drag = hbarDrag[tempKey]();
                    drag = hbarDrag[tempKey](true);
                    r = track - drag;
                    padding = self._getScrollContainerPadding(paddingKey);
                    dragleft = (hValue / max) * r + padding;
                }
                if(animated && o.animationOptions && !o.animationOptions.disabled) {
                    if(dragleft >= 0 && dragging !== "dragging") {
                        dragAnimationOptions = $.extend({
                        }, o.animationOptions);
                        // not trigger scrolled when stop
                        dragAnimationOptions.complete = undefined;
                        if(v) {
                            properties = {
                                top: dragleft
                            };
                        } else {
                            properties = {
                                left: dragleft
                            };
                        }
                        hbarDrag.animate(properties, dragAnimationOptions);
                    }
                    contentAnimationOptions = $.extend({
                    }, o.animationOptions);
                    userComplete = o.animationOptions.complete;
                    contentAnimationOptions.complete = function () {
                        self._scrollEnd(fireScrollEvent, self, dir);
                        if($.isFunction(userComplete)) {
                            userComplete(arguments);
                        }
                    };
                    if(animated && tempWrapper.is(":animated") && stop !== "nonestop") {
                        tempWrapper.stop(true, false);
                    }
                    if(v) {
                        properties1 = {
                            top: -contentLeft
                        };
                    } else {
                        properties1 = {
                            left: -contentLeft
                        };
                    }
                    //console.log("content move1");
                    if(!o.customScrolling) {
                        tempWrapper.animate(properties1, contentAnimationOptions);
                    } else {
                        self._scrollEnd(fireScrollEvent, self, dir, hValue);
                    }
                    self._triggerScroll(contentLeft, dir, contentAnimationOptions);
                // Fix Novius OS : Regression scroll even if scrollBar hidden
                //else if (scroller.scrollBarVisibility !== "hidden") {
                } else {
                    key = v ? "top" : "left";
                    if(dragleft >= 0 && dragging !== "dragging") {
                        hbarDrag[0].style[key] = dragleft + "px";
                    }
                    //console.log("content move2");
                    if(!o.customScrolling) {
                        tempWrapper[0].style[key] = -contentLeft + "px";
                    }
                    self._triggerScroll(contentLeft, dir);
                    self._scrollEnd(fireScrollEvent, self, dir, hValue);
                }
            },
            _setDragAndContentPosition: function (fireScrollEvent, animated, dir, stop, dragging) {
                var self = this, f = self._fields(), hbarContainer = f.hbarContainer, hbarDrag = f.hbarDrag, vbarContainer = f.vbarContainer, vbarDrag = f.vbarDrag;
                if((dir === "both" || dir === "h") && f.hScrolling) {
                    self._contentDragAnimate("h", animated, hbarContainer, hbarDrag, stop, fireScrollEvent, dragging);
                }
                if((dir === "both" || dir === "v") && f.vScrolling) {
                    self._contentDragAnimate("v", animated, vbarContainer, vbarDrag, stop, fireScrollEvent, dragging);
                }
                if(f.intervalID > 0) {
                    window.clearInterval(f.intervalID);
                }
                f.intervalID = window.setInterval(function () {
                    self._disableButtonIfNeeded(self);
                }, 500);
            },
            _scrolling: function (fireEvent, self, d) {
                var r = true;
                if(fireEvent) {
                    d.beforePosition = self.getContentElement().position();
                    self._beforePosition = d.beforePosition;
                    //console.log("scrolling:" + JSON.stringify(d));
                    r = self._trigger("scrolling", null, d);
                    self.customScroll = d.customScroll;
                }
                return r;
            },
            _scrollEnd: function (fireEvent, self, dir, newValue) {
                if(fireEvent) {
                    // use settimeout to return to caller immediately.
                    window.setTimeout(function () {
                        var content = self.getContentElement(), after, d;
                        if(!content.is(":visible")) {
                            return;
                        }
                        after = self.getContentElement().position();
                        d = {
                            dir: dir,
                            beforePosition: self._beforePosition,
                            afterPosition: after
                        };
                        if(!isNaN(newValue)) {
                            d.newValue = newValue;
                        }
                        //console.log("scrolled:" + JSON.stringify(d));
                        self._trigger("scrolled", null, d);
                    }, 0);
                }
            },
            _getDragLength: function (range, largeChange, track, min) {
                var divide = range / largeChange, dragLength = track / divide, minidrag = min;
                if(dragLength < minidrag) {
                    dragLength = minidrag;
                } else if((dragLength + 1) >= track) {
                    dragLength = track - 1;
                }
                return Math.round(dragLength);
            },
            _needScrollbar: function (scroller, needscroll) {
                var scrollbarMode = this._hasMode(scroller, "scrollbar"), barVisibility = scroller.scrollBarVisibility, needScrollBar = scrollbarMode && (barVisibility === "visible" || (barVisibility === "auto" && needscroll));
                return needScrollBar;
            },
            _bindBarEvent: function (barContainer, barDrag, dir) {
                var self = this;
                barContainer.bind("mouseover." + self.widgetName, self, self._scrollerMouseOver);
                if(!$.fn.draggable) {
                    return;
                }
                barDrag.draggable({
                    axis: dir === "h" ? "x" : "y",
                    start: function (e, data) {
                        self._isDragging = true;
                    },
                    drag: function (e, data) {
                        self._dragging(e, data, self);
                    },
                    containment: "parent",
                    stop: function (e) {
                        self._dragStop(e, self, dir);
                        $(e.target).removeClass(activeCss);
                        self._isDragging = false;
                    }
                });
            },
            _createBarIfNeeded: function (hNeedScrollBar, scrollerWrapper, dir, html, content) {
                if(hNeedScrollBar) {
                    var self = this, data, f = self._fields(), strBarContainer = dir + "barContainer", strBarDrag = dir + "barDrag", hbar = dir === "h", contentLength = //contentLength = content[0][hbar ? "clientHeight" : "clientWidth"],
                    content[hbar ? "innerHeight" : "innerWidth"](), c = f[strBarContainer] = $(html), targetBarLen, d;
                    scrollerWrapper.append(c);
                    targetBarLen = c[0][hbar ? "offsetHeight" : "offsetWidth"];
                    contentLength = contentLength - targetBarLen;
                    data = {
                        direction: hbar ? "horizontal" : "vertical",
                        targetBarLen: targetBarLen,
                        contentLength: contentLength
                    };
                    if(self._trigger(hbar ? "hScrollerActivating" : "vScrollerActivating", null, data) === false) {
                        return false;
                    }
                    d = f[strBarDrag] = c.find("." + scrollerHandle);
                    self._bindBarEvent(c, d, dir);
                    content[hbar ? "height" : "width"](contentLength);
                    // fixed bug on forum when set contentlength ,the width or height is changed.
                    //				f[hbar ? "contentWidth" : "contentHeight"] =
                    //                f.templateWrapper[hbar ? "width" : "height"]();
                                    }
            },
            _setScrollbarPosition: function (wrapper, self, content, targetBarContainer, referBarContainer, targetNeedScrollBar, referNeedScrollBar, targetScrollBarPosition, referScrollBarPosition, dir, scrollingNeed) {
                var hbar = dir === "h", targetBarLen, targetPadding, targetBarPosition, barPosition1, contentPosition1, barPosition2, contentPosition2, contentLength2, referBarWidth, css = self.options.wijCSS;
                if(targetNeedScrollBar) {
                    targetBarLen = targetBarContainer[0][hbar ? "offsetHeight" : "offsetWidth"];
                    targetPadding = self._getScrollContainerPadding(dir);
                    targetBarPosition = hbar ? "top" : "left";
                    barPosition1 = hbar ? {
                        top: "0px",
                        bottom: "auto",
                        left: "auto",
                        right: "auto"
                    } : {
                        left: "0px",
                        right: "auto",
                        top: "auto",
                        bottom: "auto"
                    };
                    contentPosition1 = hbar ? {
                        top: targetBarLen + "px",
                        left: null
                    } : {
                        left: targetBarLen + "px"
                    };
                    barPosition2 = hbar ? {
                        top: "auto",
                        right: "auto",
                        left: "auto",
                        bottom: "0px"
                    } : {
                        left: "auto",
                        right: "0px",
                        top: "auto",
                        bottom: "auto"
                    };
                    contentPosition2 = hbar ? {
                        top: "",
                        left: null
                    } : {
                        left: ""
                    };
                    //var contentLength = content[0][hbar? "clientHeight":"clientWidth"];
                    //contentLength2 = content[0][hbar? "clientWidth":"clientHeight"];
                    contentLength2 = content[hbar ? "innerWidth" : "innerHeight"]();
                    if(targetScrollBarPosition === targetBarPosition) {
                        targetBarContainer.css(barPosition1);
                        content.css(contentPosition1);
                        if(hbar) {
                            targetBarContainer.children(".wijmo-wijsuperpanel-hbar-buttonleft").removeClass(css.cornerBL).addClass(css.cornerTL);
                            targetBarContainer.children(".wijmo-wijsuperpanel-hbar-buttonright").removeClass(css.cornerBR).addClass(css.cornerTR);
                            targetBarContainer.removeClass(css.cornerBottom).addClass(css.cornerTop);
                        } else {
                            targetBarContainer.children(".wijmo-wijsuperpanel-vbar-buttontop").removeClass(css.cornerTR).addClass(css.cornerTL);
                            targetBarContainer.children(".wijmo-wijsuperpanel-vbar-buttonbottom").removeClass(css.cornerBR).addClass(css.cornerBL);
                            targetBarContainer.removeClass(css.cornerRight).addClass(css.cornerLeft);
                        }
                    } else {
                        targetBarContainer.css(barPosition2);
                        content.css(contentPosition2);
                        if(hbar) {
                            targetBarContainer.children(".wijmo-wijsuperpanel-hbar-buttonleft").removeClass(css.cornerTL).addClass(css.cornerBL);
                            targetBarContainer.children(".wijmo-wijsuperpanel-hbar-buttonright").removeClass(css.cornerBL).addClass(css.cornerBR);
                            targetBarContainer.removeClass(css.cornerTop).addClass(css.cornerBottom);
                        } else {
                            targetBarContainer.children(".wijmo-wijsuperpanel-vbar-buttontop").removeClass(css.cornerTL).addClass(css.cornerTR);
                            targetBarContainer.children(".wijmo-wijsuperpanel-vbar-buttonbottom").removeClass(css.cornerBL).addClass(css.cornerBR);
                            targetBarContainer.removeClass(css.cornerLeft).addClass(css.cornerRight);
                        }
                    }
                    //content[hbar?"height":"width"](contentLength - targetBarLen);
                    referBarWidth = 0;
                    if(referNeedScrollBar) {
                        referBarWidth = referBarContainer[0][hbar ? "offsetWidth" : "offsetHeight"];
                        if(referScrollBarPosition === "left") {
                            targetBarContainer.css("right", "0px");
                        } else if(referScrollBarPosition === "right") {
                            targetBarContainer.css("left", "0px");
                        } else if(referScrollBarPosition === "top") {
                            targetBarContainer.css("bottom", "0px");
                        } else if(referScrollBarPosition === "bottom") {
                            targetBarContainer.css("top", "0px");
                        }
                    }
                    if(!hbar/*vbar*/  && referNeedScrollBar) {
                        referBarWidth = 0;
                    }
                    targetBarContainer[hbar ? "width" : "height"](contentLength2 - targetPadding);
                    self._enableDisableScrollBar(dir, targetBarContainer, !scrollingNeed);
                } else {
                    wrapper.css(hbar ? "left" : "top", "");
                }
            },
            _testScroll: function (self, f, o) {
                var wrapper = f.templateWrapper, content = f.contentWrapper, scrollerWrapper = f.stateContainer, contentWidth = content.innerWidth(), contentHeight = content.innerHeight(), wrapperWidth = f.contentWidth, wrapperHeight = f.contentHeight, hNeedScrollBar, vNeedScrollBar, hbarContainer, vbarContainer, hbarPosition, vbarPosition;
                f.hScrolling = wrapperWidth > contentWidth;
                f.vScrolling = wrapperHeight > contentHeight;
                hNeedScrollBar = self.hNeedScrollBar = self._needScrollbar(o.hScroller, f.hScrolling);
                if(self._createBarIfNeeded(hNeedScrollBar, scrollerWrapper, "h", hbarHtml, content) === false) {
                    return false;
                }
                // having h scroll bar, but no vscroll bar, we need to test vscrolling again.
                if(hNeedScrollBar && !f.vScrolling) {
                    wrapper.css("float", "left");
                    f.contentHeight = wrapper.height();
                    f.vScrolling = f.contentHeight > (contentHeight - f.hbarContainer[0].offsetHeight);
                    wrapper.css("float", "");
                }
                vNeedScrollBar = self.vNeedScrollBar = self._needScrollbar(o.vScroller, f.vScrolling);
                if(self._createBarIfNeeded(vNeedScrollBar, scrollerWrapper, "v", vbarHtml, content) === false) {
                    return false;
                }
                if(vNeedScrollBar && !f.hScrolling) {
                    wrapper.css("float", "left");
                    f.contentWidth = wrapper.width();
                    //contentWidth =
                    f.hScrolling = f.contentWidth > (contentWidth - f.vbarContainer[0].offsetWidth);
                    wrapper.css("float", "");
                    if(f.hScrolling && !hNeedScrollBar) {
                        hNeedScrollBar = self.hNeedScrollBar = self._needScrollbar(o.hScroller, f.hScrolling);
                        if(self._createBarIfNeeded(hNeedScrollBar, scrollerWrapper, "h", hbarHtml, content) === false) {
                            return false;
                        }
                    }
                }
                hbarContainer = f.hbarContainer;
                vbarContainer = f.vbarContainer;
                hbarPosition = o.hScroller.scrollBarPosition;
                vbarPosition = o.vScroller.scrollBarPosition;
                self._setScrollbarPosition(wrapper, self, content, hbarContainer, vbarContainer, hNeedScrollBar, vNeedScrollBar, hbarPosition, vbarPosition, "h", f.hScrolling);
                self._setScrollbarPosition(wrapper, self, content, vbarContainer, hbarContainer, vNeedScrollBar, hNeedScrollBar, vbarPosition, hbarPosition, "v", f.vScrolling);
            },
            _enableDisableScrollBar: function (bar, barContainer, disable) {
                // Disables scroll bar.
                // <param name="bar" type="String">
                // Scrollbar to disable.
                // Options are: "h" and "v"
                // </param>
                // <param name="barContainer" type="jQuery">
                // The scroll bar container jQuery object.
                // </param>
                // <param name="disable" type="Boolean">
                // Whether to disable scroll bar.
                // </param>
                var o = this.options;
                if(bar === "v") {
                    barContainer[disable ? "addClass" : "removeClass"]("wijmo-wijsuperpanel-vbarcontainer-disabled");
                    barContainer.find("." + o.wijCSS.stateDefault)[disable ? "addClass" : "removeClass"](o.wijCSS.stateDisabled);
                } else if(bar === "h") {
                    barContainer[disable ? "addClass" : "removeClass"]("wijmo-wijsuperpanel-hbarcontainer-disabled");
                    barContainer.find("." + o.wijCSS.stateDefault)[disable ? "addClass" : "removeClass"](o.wijCSS.stateDisabled);
                }
                barContainer.children("." + scrollerHandle)[disable ? "hide" : "show"]();
            },
            _initResizer: function () {
                // Initialize reseizer of wijsuperpanel.
                                var self = this, o = self.options, f = self._fields(), resizer = f.resizer, resizableOptions, oldstop;
                if(!$.fn.resizable) {
                    return;
                }
                if(!resizer && o.allowResize) {
                    resizableOptions = o.resizableOptions;
                    oldstop = resizableOptions.stop;
                    resizableOptions.stop = function (e) {
                        self._resizeStop(e, self);
                        if($.isFunction(oldstop)) {
                            oldstop(e);
                        }
                    };
                    f.resizer = resizer = self.element.resizable(resizableOptions);
                }
                if(!o.allowResize && f.resizer) {
                    resizer.resizable("destroy");
                    f.resizer = null;
                }
            },
            _resizeStop: function (e, self) {
                // give the chance to autoRefresh polling to repaint.
                if(!this.options.autoRefresh) {
                    self.paintPanel(true);
                }
                self._trigger("resized");
            },
            _createAdditionalDom: function (self, f, ele) {
                // make sure the key pressing event work in FireFox.
                if(!ele.attr("tabindex")) {
                    ele.attr("tabindex", "-1");
                    f.tabindex = true;
                }
                var stateContainer = f.stateContainer = $(innerElementHtml), templateW;
                // move child element to content wrapper div of wijsuperpanel.
                f.contentWrapper = stateContainer.children();
                templateW = f.templateWrapper = f.contentWrapper.children();
                ele.contents().each(function (index, el) {
                    var jel = $(el);
                    if(jel.hasClass("wijmo-wijsuperpanel-header")) {
                        f.header = jel;
                        return;
                    }
                    if(jel.hasClass("wijmo-wijsuperpanel-footer")) {
                        f.footer = jel;
                        return;
                    }
                    templateW[0].appendChild(el);
                });
                // apeend header to first element.
                if(f.header !== undefined) {
                    ele.prepend(f.header);
                }
                ele[0].appendChild(stateContainer[0]);
                // apeend footer to first element.
                if(f.footer !== undefined) {
                    f.footer.insertAfter(stateContainer);
                }
            },
            _setRounder: function (self, ele) {
                if(this.options.showRounder) {
                    ele.addClass(this.options.wijCSS.cornerAll);
                    if(self._rounderAdded) {
                        return;
                    }
                    if($.browser.msie) {
                        return;
                    }
                    var key1, key, value, border;
                    key1 = key = "";
                    if($.browser.webkit) {
                        key = "WebkitBorderTopLeftRadius";
                        key1 = "WebkitBorderRadius";
                    } else if($.browser.mozilla) {
                        key = "MozBorderRadiusBottomleft";
                        key1 = "MozBorderRadius";
                    } else {
                        key = "border-top-left-radius";
                        key1 = "border-radius";
                    }
                    value = ele.css(key);
                    border = parseInt(value, 10);
                    // adding 1 extra to out-most radius.
                    ele.css(key1, border + 1);
                    self._rounderAdded = true;
                    self._radiusKey = key1;
                } else {
                    ele.removeClass(this.options.wijCSS.cornerAll);
                }
            },
            _setInnerElementsSize: function (f, ele) {
                var state = f.stateContainer, content = f.contentWrapper, height = 0, style, clientHeight, clientWidth, style2;
                if(f.header !== undefined) {
                    height += f.header.outerHeight();
                }
                if(f.footer !== undefined) {
                    height += f.footer.outerHeight();
                }
                style = state[0].style;
                //clientHeight = ele[0].clientHeight - height;
                //clientWidth = ele[0].clientWidth;
                clientHeight = ele.innerHeight() - height;
                clientWidth = ele.innerWidth();
                // hide element before setting width and height to improve
                //javascript performance in FF3.
                style.display = "none";
                style.height = clientHeight + "px";
                style.width = clientWidth + "px";
                style2 = content[0].style;
                style2.height = clientHeight + "px";
                style2.width = clientWidth + "px";
                style.display = "";
            }
        });
        wijsuperpanel.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, {
            wijMobileCSS: /// <summary>
            /// wijMobileCSS.
            /// </summary>
            {
                header: "ui-header ui-bar-a",
                content: "ui-body-c",
                stateDefault: "ui-btn-up-c",
                stateHover: "ui-btn-down-c",
                stateActive: "ui-btn-down-c"
            },
            initSelector: /// <summary>
            /// Selector option for auto self initialization.
            ///	This option is internal.
            /// </summary>
            ":jqmData(role='wijsuperpanel')",
            allowResize: /// <summary>
            /// The value determines whether the wijsuperpanel can be resized.
            /// Default: false.
            /// Type: Boolean.
            /// </summary>
            false,
            autoRefresh: /// <summary>
            /// This value determines whether wijsuperpanel is automatically refreshed when the content size or wijsuperpanel size are changed.
            /// Set this value to true if you load images in the wijsuperpanel without specifying their sizes.
            /// Default: false.
            /// Type: Boolean.
            /// </summary>
            false,
            animationOptions: /// <summary>
            /// The animationOptions function determines whether or not the animation is shown. If true, it defines the animation effect and controls other aspects of the widget's animation, such as duration, queue, and easing.
            /// Type: Object.
            /// Code Example:
            ///   $('#superPanel').wijsuperpanel({
            ///     animationOptions: {
            ///         disabled: false,
            ///         duration: 1000,
            ///         easing: easeInQuad
            ///     }
            ///   });
            /// </summary>
            /// <remarks>
            /// Set this options to null to disable animation.
            /// </remarks>
            {
                queue: /// <summary>
                /// This value determines whether to queue animation operations.
                /// Default: false.
                /// Type: Boolean.
                /// </summary>
                false,
                disabled: /// <summary>
                /// This value determines whether to disable animation operations.
                /// Default: false.
                /// Type: Boolean.
                /// </summary>
                false,
                duration: /// <summary>
                /// This value sets the animation duration of the scrolling animation.
                /// Default: 250.
                /// Type: Number.
                /// </summary>
                250,
                easing: /// <summary>
                /// Sets the type of animation easing effect that users experience as the panel is scrolled. You can create custom easing animations using jQuery UI Easings.
                /// Default: undefined.
                /// Type: string.
                /// </summary>
                undefined
            },
            hScrollerActivating: /// <summary>
            /// The hScrollerActivating event handler.
            /// A function called when horizontal scrollbar is activating.
            /// Default: null
            /// Type: Function
            /// Code example:
            /// Supply a function as an option.
            /// $("#selector").wijsuperpanel({ hScrollerActivating: function (e, data) { } });
            /// Bind to the event by type: wijtreenodeClick
            /// $("#selector").bind("wijsuperpanelhScrollerActivating", function(e, data) { } );
            /// </summary>
            /// <param name="e" type="Object">
            /// jQuery.Event object.
            /// </param>
            /// <param name="data" type="Object">
            /// The data that relates to this event.
            /// data.direction: The direction of the scrollbar, Possible values are "v"(vertical) and "h"(horizontal)..
            /// data.targetBarLen: The height of the horizontal scrollbar.
            /// data.contentLength: The height of the content.
            /// </param>
            null,
            hScroller: /// <summary>
            /// This option contains horizontal scroller settings.
            /// </summary>
            {
                scrollBarPosition: /// <summary>
                /// This value determines the position of the horizontal scroll bar.
                /// Default: "bottom".
                /// Type: String.
                /// </summary>
                /// <remarks>
                /// Possible options are "bottom" and "top".
                /// "bottom" - The horizontal scroll bar is placed at the bottom of
                /// the content area.
                /// "top" - The horizontal scroll bar is placed at the top of the
                ///content area.
                /// </remarks>
                "bottom",
                scrollBarVisibility: /// <summary>
                /// This value determines the visibility of the horizontal scroll bar.
                /// Default: "auto".
                /// Type: String
                /// </summary>
                /// <remarks>
                /// Possible options are "auto", "visible" and "hidden".
                /// "auto" - Shows the scroll when needed.
                /// "visible" - The Scroll bar is always visible. It is disabled
                /// when not needed.
                /// "hidden" - The Scroll bar is hidden.
                /// </remarks>
                "auto",
                scrollMode: /// <summary>
                /// This value determines the scroll mode of horizontal scrolling.
                /// Default: "scrollbar".
                /// Type: String.
                /// </summary>
                /// <remarks>
                /// Possible options are "scrollBar", "buttons", "buttonsHover"
                /// and "edge".
                /// "scrollBar" - Scroll bars are used for scrolling.
                /// "buttons" - Scroll buttons are used for scrolling.
                /// Scrolling occurs only when scroll buttons are clicked.
                /// "buttonsHover" - Scroll buttons are used for scrolling.
                /// Scrolling occurs only when scroll buttons are hovered.
                /// "edge" - Scrolling occurs when the mouse is moving to the edge
                /// of the content area.
                /// Scroll modes can be combined with each other.
                /// For example, scrollMode: "scrollbar,scrollbuttons" will enable
                /// both a scrollbar and scroll buttons.
                /// </remarks>
                "scrollBar",
                scrollValue: /// <summary>
                /// This value determines the horizontal scrolling position of
                /// wijsuperpanel.
                /// Default: null.
                /// Type: Number.
                /// </summary>
                null,
                scrollMax: /// <summary>
                /// This value sets the maximum value of the horizontal scroller.
                /// Default: 100.
                /// Type: Number.
                /// </summary>
                100,
                scrollMin: /// <summary>
                /// This value sets the minimum value of the horizontal scroller.
                /// Default: 0.
                /// Type: Number.
                /// </summary>
                0,
                scrollLargeChange: /// <summary>
                /// This value sets the large change value of the horizontal scroller.
                /// Default: null.
                /// Type: Number.
                /// </summary>
                /// <remarks>
                /// Wijsuperpanel will scroll a large change when a user clicks on the
                /// tracks of scroll bars or presses left or right arrow keys on the
                /// keyboard with the shift key down.
                /// When scrollLargeChange is null, wijsuperpanel will scroll
                /// the width of content.
                /// </remarks>
                null,
                scrollSmallChange: /// <summary>
                /// This value sets the small change value of the horizontal scroller.
                /// Default: null.
                /// Type: Number.
                /// </summary>
                /// <remarks>
                /// Wijsuperpanel will scroll a small change when a user clicks on
                /// the arrows of scroll bars, clicks or hovers scroll buttons,
                /// presses left or right arrow keys on keyboard,
                /// and hovers on the edge of wijsuperpanel.
                /// When scrollSmallChange is null, wijsuperpanel will scroll half of
                /// the width of content.
                /// </remarks>
                null,
                scrollMinDragLength: /// <summary>
                /// This value sets the minimum length, in pixel, of the horizontal
                /// scroll bar thumb button.
                /// Default: 6.
                /// Type: Number.
                /// </summary>
                6,
                increaseButtonPosition: /// <summary>
                /// This is an object that determines the increase button position.
                /// Default: null.
                /// Type: Object.
                /// </summary>
                /// <remarks>
                /// Please look at the options for jquery.ui.position.js for more info.
                /// </remarks>
                null,
                decreaseButtonPosition: /// <summary>
                /// This is an object that determines the decrease button position.
                /// Default: 0.
                /// Type: Object.
                /// </summary>
                null,
                hoverEdgeSpan: /// <summary>
                /// This value sets the width, in pixels, of the horizontal hovering edge which will trigger the horizontal scrolling.
                /// Default: 20.
                /// Type: Number.
                /// </summary>
                20,
                firstStepChangeFix: /// <summary>
                /// This number specifies the value to add to smallchange or largechange when scrolling the first step (scrolling from scrollMin).
                /// Default: 0.
                /// Type: Number.
                /// </summary>
                0
            },
            keyboardSupport: /// <summary>
            /// This value determines whether wijsuperpanel provides keyboard scrolling support.
            /// Default: false.
            /// Type: Boolean.
            /// </summary>
            false,
            keyDownInterval: /// <summary>
            /// This value determines the time interval to call the scrolling function when doing continuous scrolling.
            /// Default: 100.
            /// Type: Number.
            /// </summary>
            100,
            mouseWheelSupport: /// <summary>
            /// This value determines whether wijsuperpanel has mouse wheel support.
            /// Default: true.
            /// Type: Boolean.
            /// </summary>
            /// <remarks>
            /// Mouse wheel plugin is needed to support this feature.
            /// </remarks>
            true,
            bubbleScrollingEvent: /// <summary>
            /// This value determines whether to fire the mouse wheel event when wijsuperpanel is scrolled to the end.
            /// Default: true.
            /// Type: Boolean.
            /// </summary>
            true,
            resizableOptions: /// <summary>
            /// This option determines the behavior of the resizable widget. See the JQuery UI resizable options document for more information.
            /// Type: Object.
            /// </summary>
            {
                handles: "all",
                helper: "ui-widget-content wijmo-wijsuperpanel-helper"
            },
            resized: /// <summary>
            /// Resized event handler. This function gets called when the resized event is fired.
            /// Default: null.
            /// Type: Function.
            /// code example:
            /// Supply a callback function to handle the resized event:
            /// $("#element").wijsuperpanel({ resized: funtion() { dosometing } });
            /// Bind to the event by type:
            /// $("#element").bind("wijsuperpanelresized", funtion() { dosometing });
            /// </summary>
            null,
            dragStop: /// <summary>
            /// This function gets called when the user stops dragging the thumb buttons of the scrollbars.
            /// Default: null.
            /// Type: Function.
            /// code example:
            /// Supply a callback function to handle the dragstop event:
            /// $("#element").wijsuperpanel({ dragStop: funtion(e, data) { dosometing } });
            /// Bind to the event by type:
            /// $("#element").bind("wijsuperpaneldragstop", funtion(e, data) { dosometing });
            /// <param name="e" type="EventObj">
            /// EventObj relates to this event.
            /// </param>
            /// <param name="data" type="Object">
            /// The data with this event.
            /// data.dir: data.draghandle is the direction of the scrolling action.
            /// Possible values: "v"(vertical) and "h"(horizontal).
            /// </param>
            /// </summary>
            null,
            painted: /// <summary>
            /// This function gets called after panel is painted.
            /// Default: null.
            /// Type: Function.
            /// code example:
            /// Supply a callback function to handle the painted event:
            /// $("#element").wijsuperpanel({ painted: funtion() { dosometing } });
            /// Bind to the event by type:
            /// $("#element").bind("wijsuperpanelpainted", funtion() { dosometing });
            /// </summary>
            null,
            scrolling: /// <summary>
            /// Scrolling event handler. A function called before scrolling occurs.
            /// Default: null.
            /// Type: Function.
            /// code example:
            /// Supply a callback function to handle the scrolling event:
            /// $("#element").wijsuperpanel({ scrolling: funtion(e, data) { dosometing } });
            /// Bind to the event by type:
            /// $("#element").bind("wijsuperpanelscrolling", funtion(e, data) { dosometing });
            /// </summary>
            /// <param name="e" type="Object">
            /// jQuery.Event object.
            /// </param>
            /// <param name="data" type="Object">
            /// The data with this event.
            /// data.oldValue: The scrollValue before scrolling occurs.
            /// data.newValue: The scrollValue after scrolling occurs.
            /// data.dir: The direction of the scrolling action.
            /// Possible values: "v"(vertical) and "h"(horizontal).
            /// data.beforePosition: The position of content before scrolling occurs.
            /// </param>
            null,
            scroll: /// <summary>
            /// Scroll event handler. This function is called before scrolling occurs.
            /// Default: null.
            /// Type: Function.
            /// code example:
            /// Supply a callback function to handle the scroll event:
            /// $("#element").wijsuperpanel({ scroll: funtion(e, data) { dosometing } });
            /// Bind to the event by type:
            /// $("#element").bind("wijsuperpanelscroll", funtion(e, data) { dosometing });
            /// </summary>
            /// <param name="e" type="Object">
            /// jQuery.Event object.
            /// </param>
            /// <param name="data" type="Object">
            /// The data with this event.
            /// data.animationOptions: The options of the animation which scrolling uses
            /// data.dir: The direction of the scrolling action.
            /// Possible values: "v"(vertical) and "h"(horizontal).
            /// data.position: The position of content after scrolling occurs.
            /// </param>
            null,
            scrolled: /// <summary>
            /// Scrolled event handler. This function gets called after scrolling occurs.
            /// Default: null.
            /// Type: Function.
            /// code example:
            /// Supply a callback function to handle the scrolled event:
            /// $("#element").wijsuperpanel({ scrolled: funtion(e, data) { dosometing } });
            /// Bind to the event by type:
            /// $("#element").bind("wijsuperpanelscrolled", funtion(e, data) { dosometing });
            /// </summary>
            /// <param name="e" type="Object">
            /// jQuery.Event object.
            /// </param>
            /// <param name="data" type="Object">
            /// The data with this event.
            /// data.dir: The direction of the scrolling action.
            /// Possible values: "v"(vertical) and "h"(horizontal).
            /// data.beforePosition: The position of content before scrolling occurs.
            /// data.afterPosition: The position of content after scrolling occurs.
            /// </param>
            null,
            showRounder: /// <summary>
            /// This value determines whether to show the rounded corner of wijsuperpanel.
            /// Default: true.
            /// Type: Boolean.
            /// </summary>
            true,
            vScrollerActivating: /// <summary>
            /// A function called when the vertical scrollbar is activating.
            /// Default: null
            /// Type: Function
            /// Code example:
            /// Supply a function as an option.
            /// $("#selector").wijsuperpanel({ vScrollerActivating: function (e, data) { } });
            /// Bind to the event by type: wijtreenodeClick
            /// $("#selector").bind("wijsuperpanelvScrollerActivating", function(e, data) { } );
            /// </summary>
            /// <param name="e" type="Object">
            /// jQuery.Event object.
            /// </param>
            /// <param name="data" type="Object">
            /// The data that relates to this event.
            /// data.direction: the direction of the scrollbar("horizontal" or "vertical").
            /// data.targetBarLen: the width of the vertical scrollbar.
            /// data.contentLength: the width of the content.
            /// </param>
            null,
            vScroller: /// <summary>
            /// This option contains vertical scroller settings.
            /// </summary>
            {
                scrollBarPosition: /// <summary>
                /// This value determines the position of the vertical scroll bar.
                /// Default: "right".
                /// Type: String.
                /// </summary>
                /// <remarks>
                /// Possible options are: "left", "right".
                /// "left" - The vertical scroll bar is placed at the
                /// left side of the content area.
                /// "right" - The vertical scroll bar is placed at the
                /// right side of the content area.
                /// </remarks>
                "right",
                scrollBarVisibility: /// <summary>
                /// This value determines the visibility of the vertical scroll bar.
                /// Default.: "auto".
                /// Type: String.
                /// </summary>
                /// <remarks>
                /// Possible options are "auto", "visible" and "hidden".
                /// "auto" - Shows the scroll bar when needed.
                /// "visible" - Scroll bar will always be visible.
                /// It"s disabled when not needed.
                /// "hidden" - Scroll bar will be shown.
                /// </remarks>
                "auto",
                scrollMode: /// <summary>
                /// This value determines the scroll mode of vertical scrolling.
                /// Default: "scrollbar".
                /// Type: String.
                /// </summary>
                /// <remarks>
                /// Possible options are: "scrollBar", "buttons",
                /// "buttonsHover" and "edge".
                /// "scrollBar" - Scroll bars are used for scrolling.
                /// "buttons" - Scroll buttons are used for scrolling.
                /// Scrolling occurs only when scroll buttons are clicked.
                /// "buttonsHover" - Scroll buttons are used for scrolling.
                /// Scrolling occurs only when scroll buttons are hovered.
                /// "edge" - Scrolling occurs when the mouse is moving to
                /// the edge of the content area.
                /// Scroll modes can be combined with each other.
                /// For example, vScrollMode: "scrollbar,scrollbuttons" will enable
                /// both a scrollbar and scroll buttons.
                /// </remarks>
                "scrollBar",
                scrollValue: /// <summary>
                /// This number determines the vertical scrolling position of
                /// wijsuperpanel.
                /// Default: null.
                /// Type: Number.
                /// </summary>
                null,
                scrollMax: /// <summary>
                /// This number sets the maximum value of the vertical scroller.
                /// Default: 100.
                /// Type: Number.
                /// </summary>
                100,
                scrollMin: /// <summary>
                /// This number sets the minimum value of the vertical scroller.
                /// Default: 0.
                /// Type: Number.
                /// </summary>
                0,
                scrollLargeChange: /// <summary>
                /// This value sets the large change value of the vertical scroller.
                /// Default: null.
                /// Type: Number.
                /// </summary>
                /// <remarks>
                /// wijsuperpanel will scroll a large change when a user clicks
                /// on the tracks of scroll bars or presses left or right arrow keys
                /// on the keyboard with the shift key down.
                /// When scrollLargeChange is null, wijsuperpanel
                /// will scroll the height of content.
                /// </remarks>
                null,
                scrollSmallChange: /// <summary>
                /// This value sets the small change value of the vertical scroller.
                /// Default: null.
                /// Type: Number.
                /// </summary>
                /// <remarks>
                /// wijsuperpanel will scroll a small change when a user clicks on the
                /// arrows of scroll bars, clicks or hovers scroll buttons, presses left
                /// or right arrow keys on keyboard, and hovers on the edge of
                /// wijsuperpanel.
                /// When scrollSmallChange is null, wijsuperpanel will scroll half of
                /// the height of content.
                /// </remarks>
                null,
                scrollMinDragLength: /// <summary>
                /// This value sets the minimum length, in pixel, of the vertical
                /// scroll bar thumb button.
                /// Default: 6.
                /// Type: Number
                /// </summary>
                6,
                increaseButtonPosition: /// <summary>
                /// This object determines the increase button position.
                /// Default: null.
                /// Type: Object.
                /// </summary>
                /// <remarks>
                /// Please look at the options for jquery.ui.position.js for more info.
                /// </remarks>
                null,
                decreaseButtonPosition: /// <summary>
                /// This object determines the decrease button position.
                /// Default: 0.
                /// Type: Object.
                /// </summary>
                /// <remarks>
                /// Please look at the options for jquery.ui.position.js for more info.
                /// </remarks>
                null,
                hoverEdgeSpan: /// <summary>
                /// This value sets the width of the horizontal hovering edge which will trigger the vertical scrolling.
                /// Default: 20.
                /// Type: Number.
                /// </summary>
                20,
                firstStepChangeFix: /// <summary>
                /// This number specifies the value to add to smallchange or largechange when scrolling the first step (scrolling from scrollMin).
                /// Default: 0.
                /// Type: Number.
                /// </summary>
                0
            },
            customScrolling: /// <summary>
            /// Determines if use custom scrolling.
            /// Default: false.
            /// Type: Boolean.
            /// </summary>
            false,
            listenContentScroll: /// <summary>
            /// Determines if the native scroll events should be listened.
            /// Default: false.
            /// Type: Boolean.
            /// </summary>
            false
        });
        $.wijmo.registerWidget("wijsuperpanel", wijsuperpanel.prototype);
    } else {
        var scrollerHandle = "wijmo-wijsuperpanel-handle", innerElementHtml = "<div class='wijmo-wijsuperpanel-statecontainer'>" + "<div class='wijmo-wijsuperpanel-contentwrapper-touch'>" + "</div></div>";
        wijsuperpanel.prototype = $.extend(true, {
        }, $.Widget.prototype, {
            widgetEventPrefix: "wijsuperpanel",
            _setOption: function (key, value) {
                var self = this, o = self.options, f = self._fields();
                if(key === "animationOptions" || key === "resizableOptions") {
                    value = $.extend(o[key], value);
                } else if(key === "hScroller" || key === "vScroller") {
                    value = $.extend(o[key], value);
                    self.refresh();
                }
                $.Widget.prototype._setOption.apply(self, arguments);
                switch(key) {
                    case "allowResize":
                        self._initResizer();
                        break;
                    case "disabled":
                        self._handleDisabledOption(value, self.element);
                        break;
                    case "mouseWheelSupport":
                    case "keyboardSupport":
                        self._bindElementEvents(self, f, self.element, o);
                        break;
                }
            },
            _create: function () {
                var self = this, o = self.options;
                o.vScroller.dir = "v";
                o.hScroller.dir = "h";
                self._createDom();
                if(self.options.disabled) {
                    self.disable();
                }
                //update for visibility change
                if(self.element.is(":hidden") && self.element.wijAddVisibilityObserver) {
                    self.element.wijAddVisibilityObserver(function () {
                        self.refresh();
                        if(self.element.wijRemoveVisibilityObserver) {
                            self.element.wijRemoveVisibilityObserver();
                        }
                    }, "wijsuperpanel");
                }
            },
            _handleDisabledOption: function (disabled, ele) {
                var self = this;
                if(disabled) {
                    if(!self.disabledDiv) {
                        self.disabledDiv = self._createDisabledDiv(ele);
                    }
                    self.disabledDiv.appendTo("body");
                } else {
                    if(self.disabledDiv) {
                        self.disabledDiv.remove();
                        self.disabledDiv = null;
                    }
                }
            },
            _createDisabledDiv: function (outerEle) {
                var self = this, ele = outerEle ? outerEle : self.element, eleOffset = ele.offset(), disabledWidth = ele.outerWidth(), disabledHeight = ele.outerHeight();
                return $("<div></div>").addClass("ui-disabled").css({
                    "z-index": "99999",
                    position: "absolute",
                    width: disabledWidth,
                    height: disabledHeight,
                    left: eleOffset.left,
                    top: eleOffset.top
                });
            },
            _createDom: function () {
                var self = this, el = self.element;
                self.paintPanel();
                self._initResizer();
                self._bindElementEvents();
            },
            _applyOverflow: function (stateContainer) {
                var css = {
                }, o = this.options, hs = o.hScroller.scrollBarVisibility, vs = o.vScroller.scrollBarVisibility;
                css["overflow-x"] = hs;
                css["overflow-y"] = vs;
                stateContainer.css(css);
            },
            _createAdditionalDom: function (self, f, ele) {
                if(!ele.attr("tabindex")) {
                    ele.attr("tabindex", "-1");
                    f.tabindex = true;
                }
                var stateContainer = f.stateContainer = $(innerElementHtml), templateW;
                self._applyOverflow(f.stateContainer);
                // move child element to content wrapper div of wijsuperpanel.
                f.contentWrapper = stateContainer.children();
                ele.contents().each(function (index, el) {
                    var jel = $(el);
                    if(jel.hasClass("wijmo-wijsuperpanel-header")) {
                        f.header = jel;
                        return;
                    }
                    if(jel.hasClass("wijmo-wijsuperpanel-footer")) {
                        f.footer = jel;
                        return;
                    }
                    f.contentWrapper[0].appendChild(el);
                });
                // append header to first element.
                if(f.header !== undefined) {
                    ele.prepend(f.header);
                }
                ele[0].appendChild(stateContainer[0]);
                // append footer to first element.
                if(f.footer !== undefined) {
                    f.footer.insertAfter(stateContainer);
                }
                self._resetDom();
            },
            _bindElementEvents: function () {
                var self = this, ele = self.element, o = self.options, wn = self.widgetName;
                ele.bind("scroll", function (event) {
                    self._triggerScroll();
                });
                if(o.keyboardSupport) {
                    if(self._keyboardBind === undefined) {
                        self._keyboardBind = true;
                        ele.bind("keydown." + wn, self, self._panelKeyDown);
                    }
                } else {
                    ele.unbind("keydown." + wn, self._panelKeyDown);
                    self._keyboardBind = undefined;
                }
                if(!o.mouseWheelSupport) {
                    ele.bind("mousewheel", function (event) {
                        event.stopPropagation();
                        return false;
                    });
                }
            },
            _setScrollingInterval: function (f, dir, self, large) {
                var o = self.options;
                if(dir.length > 0) {
                    f.internalFuncID = window.setInterval(function () {
                        self._doScrolling(dir, self, large);
                    }, o.keyDownInterval);
                }
            },
            _triggerScroll: function (contentLeft, dir) {
                var data = {
                    position: contentLeft,
                    dir: dir
                };
                this._trigger("scroll", null, data);
            },
            _panelKeyDown: function (e) {
                // Key down handler.
                                var self = e.data, o = self.options, shift, keycode, kCode = self.getKeyCodeEnum();
                if(!o.keyboardSupport || o.disabled) {
                    return;
                }
                shift = e.shiftKey;
                keycode = e.keyCode;
                if(keycode === kCode.LEFT) {
                    self._doScrolling("left", self, shift);
                } else if(keycode === kCode.RIGHT) {
                    self._doScrolling("right", self, shift);
                } else if(keycode === kCode.UP) {
                    self._doScrolling("top", self, shift);
                } else if(keycode === kCode.DOWN) {
                    self._doScrolling("bottom", self, shift);
                }
                e.stopPropagation();
                e.preventDefault();
            },
            _doScrolling: function (dir, self, large) {
                var value, orient, func, f = self._fields(), ele = f.stateContainer[0], animateOpt = {
                }, scrollVal;
                if(dir === "top" || dir === "bottom") {
                    orient = "v";
                    func = "scrollTop";
                } else if(dir === "left" || dir === "right") {
                    orient = "h";
                    func = "scrollLeft";
                }
                if(large) {
                    value = self._getLargeChange(orient);
                } else {
                    value = self._getSmallChange(orient);
                }
                scrollVal = ele[func];
                if(dir === "top" || dir === "left") {
                    animateOpt[func] = scrollVal - value;
                } else {
                    animateOpt[func] = scrollVal + value;
                }
                self._animateTo(animateOpt);
            },
            _getLargeChange: function (div) {
                var self = this, f = self._fields(), largeChange, length = div == "h" ? f.clientWidth : f.clientHeight;
                if(length) {
                    largeChange = length;
                } else {
                    largeChange = f.stateContainer[div == "h" ? "width" : "height"]();
                }
                return largeChange;
            },
            _getSmallChange: function () {
                return this._getLargeChange() / 2;
            },
            _setRounder: function (self, ele) {
                var cornerCSS = this.options.wijCSS.cornerAll;
                if(this.options.showRounder) {
                    ele.addClass(cornerCSS);
                    if(self._rounderAdded) {
                        return;
                    }
                    if($.browser.msie) {
                        return;
                    }
                    var key1, key, value, border;
                    key1 = key = "";
                    if($.browser.webkit) {
                        key = "WebkitBorderTopLeftRadius";
                        key1 = "WebkitBorderRadius";
                    } else if($.browser.mozilla) {
                        key = "MozBorderRadiusBottomleft";
                        key1 = "MozBorderRadius";
                    } else {
                        key = "border-top-left-radius";
                        key1 = "border-radius";
                    }
                    value = ele.css(key);
                    border = parseInt(value, 10);
                    ele.css(key1, border + 1);
                    self._rounderAdded = true;
                    self._radiusKey = key1;
                } else {
                    ele.removeClass(cornerCSS);
                }
            },
            _initResizer: function () {
                // Initialize reseizer of wijsuperpanel.
                                var self = this, o = self.options, f = self._fields(), resizer = f.resizer, resizableOptions, oldstop;
                if(!$.fn.resizable) {
                    return;
                }
                if(!resizer && o.allowResize) {
                    resizableOptions = o.resizableOptions;
                    oldstop = resizableOptions.stop;
                    resizableOptions.stop = function (e) {
                        self._resetDom();
                        self._trigger("resized");
                        if($.isFunction(oldstop)) {
                            oldstop(e);
                        }
                    };
                    f.resizer = resizer = self.element.resizable(resizableOptions);
                }
                if(!o.allowResize && f.resizer) {
                    resizer.resizable("destroy");
                    f.resizer = null;
                }
            },
            _resetDom: function () {
                var self = this, o = self.options, ele = self.element, f = self._fields(), width = ele.width(), height = ele.height();
                if(f.stateContainer.length) {
                    f.stateContainer.css({
                        width: width,
                        height: height
                    });
                    f.clientWidth = f.stateContainer[0].clientWidth;
                    f.clientHeight = f.stateContainer[0].clientHeight;
                }
            },
            _fields: function () {
                var self = this, ele = self.element, key = self.widgetName + "-fields", d = self._fieldsStore;
                if(d === undefined) {
                    d = {
                    };
                    ele.data(key, d);
                    self._fieldsStore = d;
                }
                return d;
            },
            _getScrollOffset: function (child1) {
                var child = $(child1), f, cWrapper, childOffset, templateOffset, cWrapperOffset, tDistance, bDistance, lDistance, rDistance, result = {
                    left: null,
                    top: null
                };
                if(child.length === 0) {
                    return result;
                }
                f = this._fields();
                cWrapper = f.contentWrapper;
                //cWrapper = f.stateContainer;
                childOffset = child.offset();
                childOffset.leftWidth = childOffset.left + child.outerWidth();
                childOffset.topHeight = childOffset.top + child.outerHeight();
                cWrapperOffset = cWrapper.offset();
                cWrapperOffset.leftWidth = cWrapperOffset.left + f.clientWidth;
                cWrapperOffset.topHeight = cWrapperOffset.top + f.clientHeight;
                lDistance = childOffset.left - cWrapperOffset.left;
                if(childOffset.left < cWrapperOffset.left) {
                    result.left = lDistance;
                } else if(childOffset.leftWidth > cWrapperOffset.leftWidth) {
                    rDistance = childOffset.leftWidth - cWrapperOffset.left - f.clientWidth;
                    if(lDistance < rDistance) {
                        result.left = lDistance;
                    } else {
                        result.left = rDistance;
                    }
                }
                tDistance = childOffset.top - cWrapperOffset.top;
                if(childOffset.top < cWrapperOffset.top) {
                    result.top = tDistance;
                } else if(childOffset.topHeight > cWrapperOffset.topHeight) {
                    bDistance = childOffset.topHeight - cWrapperOffset.top - f.clientHeight;
                    if(tDistance < bDistance) {
                        result.top = tDistance;
                    } else {
                        result.top = bDistance;
                    }
                }
                return result;
            },
            _initialize: function (f, ele, self) {
                var wijCSS = self.options.wijCSS;
                f.initialized = true;
                ele.addClass([
                    "wijmo-wijsuperpanel",
                    wijCSS.widget,
                    wijCSS.content
                ].join(' '));
                self._setRounder(self, ele);
                self._createAdditionalDom(self, f, ele);
                self._trigger("painted");
            },
            _animateTo: function (to) {
                var self = this, ele = self.element, o = self.options, ao = o.animationOptions, f = self._fields();
                f.stateContainer.animate(to, ao);
            },
            destroy: function () {
                var self = this, ele = self.element, o = self.options, f = self._fields(), cWrapper, wijCSS = o.wijCSS;
                if(self.disabledDiv) {
                    self.disabledDiv.remove();
                    self.disabledDiv = null;
                }
                if(f.resizer !== undefined) {
                    f.resizer.resizable("destroy");
                }
                ele.unbind("." + self.widgetName);
                ele.removeClass([
                    "wijmo-wijsuperpanel",
                    wijCSS.widget,
                    wijCSS.content,
                    wijCSS.cornerAll
                ].join(' '));
                cWrapper = f.contentWrapper;
                cWrapper.contents().each(function (index, e) {
                    ele.append(e);
                });
                f.stateContainer.remove();
                $.Widget.prototype.destroy.apply(self, arguments);
            },
            doScrolling: function (dir, large) {
                /// <summary>
                /// Do scrolling.
                /// </summary>
                /// <param name="dir" type="string">
                ///   Scrolling direction. Options are: "left", "right", "top" and "bottom".
                /// </param>
                /// <param name="large" type="Boolean">
                /// Whether to scroll a large change.
                /// </param>
                this._doScrolling(dir, large);
            },
            paintPanel: function (unfocus) {
                var self = this, ele = self.element, f = self._fields();
                if(!f.initialized) {
                    this._initialize(f, ele, self);
                }
            },
            needToScroll: function (child1) {
                /// <summary>
                /// Determine whether scoll the child DOM element to view
                /// need to scroll the scroll bar
                /// </summary>
                /// <param name="child" type="DOMElement/JQueryObj">
                /// The child to scroll to.
                /// </param>
                var offset = this._getScrollOffset(child1);
                return offset.top !== null || offset.left !== null;
            },
            scrollChildIntoView: function (child1) {
                /// <summary>
                /// Scroll child DOM element into view.
                /// Code Example:
                /// $("selector").wijsuperpanel("scrollChildIntoView", $("li#reditem"));
                /// </summary>
                /// <param name="child" type="DOMElement/JQueryObj">
                /// The child to scroll to.
                /// </param>
                                var offset = this._getScrollOffset(child1), left = offset.left, top = offset.top;
                this.scrollTo(left, top);
            },
            getContentElement: function () {
                /// <summary>
                /// Gets the content element of wijsuperpanel.
                /// Code Example:
                /// $("selector").wijsuperpanel("getContentElement");
                /// </summary>
                /// <returns type="JQueryObj" />
                return this._fields().contentWrapper;
            },
            hScrollTo: function (x) {
                /// <summary>
                /// Scrolls to the indicated horizontal position.
                /// Code Example:
                /// $("selector").wijsuperpanel("hScrollTo", 100);
                /// </summary>
                /// <param name="x" type="Number">
                /// The position to scroll to.
                /// </param>
                this._animateTo({
                    "scrollLeft": x
                });
            },
            vScrollTo: function (y) {
                /// <summary>
                /// Scrolls to the indicated vertical position.
                /// Code Example:
                /// $("selector").wijsuperpanel("vScrollTo", 100);
                /// </summary>
                /// <param name="y" type="Number">
                /// The position to scroll to.
                /// </param>
                this._animateTo({
                    "scrollTop": y
                });
            },
            refresh: function () {
                /// <summary>
                /// Refreshes the wijsuperpanel.
                /// Needs to be called after content being changed.
                /// Code Example:
                /// $("selector").wijsuperpanel("refresh");
                /// </summary>
                /// <returns type="Boolean">
                /// Returns true if it is successful, else returns false.
                /// </returns>
                                var self = this, f = self._fields();
                self._applyOverflow(f.stateContainer);
                self._resetDom();
            },
            scrollTo: function (x, y) {
                /// <summary>
                /// Scroll to specified position.
                /// Code Example:
                /// $("selector").wijsuperpanel("scrollTo", 100, 100);
                /// </summary>
                /// <param name="x" type="Number">
                /// Horizontal position to scroll to.
                /// </param>
                /// <param name="y" type="Number">
                /// Vertical position to scroll to.
                /// </param>
                this._animateTo({
                    "scrollTop": y,
                    "scrollLeft": x
                });
            },
            scrollPxToValue: function (px, dir) {
                /// <summary>
                /// Convert pixel to scroll value.
                /// For example, wijsuperpanel scrolled 50px
                ///which is value 1 after conversion.
                /// </summary>
                /// <param name="px" type="Number">
                /// Length of scrolling.
                /// </param>
                /// <param name="dir" type="String">
                /// Scrolling direction. Options are: "h" and "v".
                /// </param>
                return px;
            }
        });
        wijsuperpanel.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, {
            wijMobileCSS: {
                header: "ui-header ui-bar-a",
                content: "ui-body-c",
                stateDefault: "ui-btn-up-c",
                stateHover: "ui-btn-down-c",
                stateActive: "ui-btn-down-c"
            },
            initSelector: /// <summary>
            /// Selector option for auto self initialization.
            ///	This option is internal.
            /// </summary>
            ":jqmData(role='wijsuperpanel')",
            allowResize: false,
            animationOptions: {
                queue: false,
                disabled: false,
                duration: 250,
                easing: undefined
            },
            hScroller: {
                scrollBarVisibility: "auto",
                scrollValue: null,
                scrollMax: 100,
                firstStepChangeFix: 0,
                scrollMin: 0,
                hoverEdgeSpan: 20
            },
            keyboardSupport: false,
            keyDownInterval: 100,
            mouseWheelSupport: true,
            resizableOptions: {
                handles: "all",
                helper: "ui-widget-content wijmo-wijsuperpanel-helper"
            },
            resized: null,
            painted: null,
            scroll: null,
            showRounder: true,
            vScroller: {
                scrollBarVisibility: "auto",
                scrollValue: null,
                scrollMax: 100,
                scrollMin: 0,
                firstStepChangeFix: 0,
                hoverEdgeSpan: 20
            }
        });
        $.wijmo.registerWidget("wijsuperpanel", wijsuperpanel.prototype);
    }
})(wijmo || (wijmo = {}));
