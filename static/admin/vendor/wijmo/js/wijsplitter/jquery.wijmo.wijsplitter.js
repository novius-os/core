/*
 *
 * Wijmo Library 3.20141.34
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 * ----
 * Credits: Wijmo includes some MIT-licensed software, see copyright notices below.
 */
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
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
    (function (splitter) {
        "use strict";
        var $ = jQuery, widgetName = "wijsplitter";
        /** @widget */
        var wijsplitter = (function (_super) {
            __extends(wijsplitter, _super);
            function wijsplitter() {
                _super.apply(this, arguments);

            }
            wijsplitter.prototype._setFullSplit = function (value) {
                var self = this, fields = self._fields, width = value ? "100%" : fields.width, height = value ? "100%" : fields.height;
                self.element.css("width", width).css("height", height);
            };
            wijsplitter.prototype._setOption = function (key, value) {
                var self = this, o = self.options, expander, oldValue = $.extend({
                }, o[key]);
                if(key === "fullSplit") {
                    self._setFullSplit(value);
                } else if($.isPlainObject(o[key])) {
                    if(key === "panel1" && value.collapsed !== undefined) {
                        self._setPanel1Collapsed(value.collapsed);
                    } else if(key === "panel2" && value.collapsed !== undefined) {
                        self._setPanel2Collapsed(value.collapsed);
                    }
                    o[key] = $.extend(true, o[key], value);
                    if(key === "resizeSettings") {
                        self._initResizer();
                    }
                    return;
                }
                $.Widget.prototype._setOption.apply(self, arguments);
                if(oldValue !== value) {
                    if(key === "orientation") {
                        self.refresh();
                    } else if(key === "collapsingPanel") {
                        self.refresh();
                    } else if(key === "fullSplit") {
                        self.refresh(true, false);
                    } else if(key === "splitterDistance") {
                        self.refresh(false, false);
                        self._trigger("sized");
                    } else if(key === "showExpander") {
                        expander = self._fields.expander;
                        if(expander && expander.length) {
                            expander.css("display", value ? "" : "none");
                        }
                    }
                }
                //Add for support disabled option at 2011/7/8
                if(key === "disabled") {
                    self._handleDisabledOption(value, self.element);
                }
                //end for disabled option
                            };
            wijsplitter.prototype._create = function () {
                var self = this, element = self.element, o = self.options, minSize;
                // enable touch support:
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                if(o.splitterDistance == 100) {
                    minSize = this.element.width() - o.panel2.minSize;
                    if(o.panel1.minSize > o.splitterDistance) {
                        o.splitterDistance = o.panel1.minSize;
                    } else if(minSize < o.splitterDistance) {
                        o.splitterDistance = minSize;
                    }
                }
                self._fields = {
                    width: element.width(),
                    height: element.height()
                };
                if(o.fullSplit) {
                    self._setFullSplit(true);
                }
                self._splitterify();
                self._updateElementsCss();
                self._updateElements();
                self._bindEvents();
                self._initResizer();
                //Add for support disabled option at 2011/7/8
                if(o.disabled) {
                    self.disable();
                }
                //end for disabled option
                //fixed bug 28059
                if(self.element.wijAddVisibilityObserver) {
                    self.element.wijAddVisibilityObserver(function () {
                        if(o.fullSplit) {
                            self.refresh();
                            self._updateElements();
                            self._initResizer();
                        }
                    }, "wijsplitter");
                }
                self._trigger("load", null, self);
            };
            wijsplitter.prototype._handleDisabledOption = function (disabled, ele) {
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
            };
            wijsplitter.prototype.destroy = /**
            * Removes the splitter functionality completely.This will return the element back to its pre - init state.
            * @example $("selector").wijsplitter("destroy");
            */
            function () {
                var self = this, o = self.options, element = self.element, fields = self._fields, wrapper = fields.wrapper, expander = fields.expander, bar = fields.bar, panel1 = fields.panel1, panel2 = fields.panel2, originalStyle = fields.originalStyle, widgetName = self.widgetName, oriPnl1Content = fields.oriPnl1Content, oriPnl2Content = fields.oriPnl2Content, oriPnl1ContentStyle = fields.oriPnl1ContentStyle, oriPnl2ContentStyle = fields.oriPnl2ContentStyle, css = o.wijCSS, vSplitterCSS = css.vSplitterCss, vSplitterPre = css.vSplitterCssPrefix, hSplitterCSS = css.hSplitterCss, hSplitterPre = css.hSplitterCssPrefix, panelCss = css.panelCss;
                if($.fn.resizable) {
                    if(panel1 && panel1.n.is(":ui-resizable")) {
                        panel1.n.resizable('destroy');
                    }
                }
                if(oriPnl1Content) {
                    oriPnl1Content.removeClass(vSplitterPre + panel1.contentCss).removeClass(css.hSplitterCssPrefix + panel1.contentCss).removeClass(css.content);
                    if(oriPnl1ContentStyle === undefined) {
                        oriPnl1Content.removeAttr("style");
                    } else {
                        oriPnl1Content.attr("style", oriPnl1ContentStyle);
                    }
                    oriPnl1Content.appendTo(element);
                }
                if(oriPnl2Content) {
                    oriPnl2Content.removeClass(vSplitterPre + panel2.contentCss).removeClass(css.hSplitterCssPrefix + panel2.contentCss).removeClass(css.content);
                    if(oriPnl2ContentStyle === undefined) {
                        oriPnl2Content.removeAttr("style");
                    } else {
                        oriPnl2Content.attr("style", oriPnl2ContentStyle);
                    }
                    oriPnl2Content.appendTo(element);
                }
                panel1.n.unbind('.' + widgetName);
                expander.unbind('.' + widgetName);
                bar.unbind('.' + widgetName);
                $(window).unbind('.' + widgetName);
                wrapper.remove();
                element.removeClass(vSplitterCSS).removeClass(hSplitterCSS);
                if(originalStyle === undefined) {
                    element.removeAttr("style");
                } else {
                    element.attr("style", originalStyle);
                }
                if(self.disabledDiv) {
                    self.disabledDiv.remove();
                    self.disabledDiv = null;
                }
                self._fields = null;
            };
            wijsplitter.prototype.refresh = /**
            * Forces the widget to recreate the splitter.
            * @param {boolean} size A boolean value to indicate whether the refresh is triggered
            * because the size of widget is changed.
            * @param {boolean} state A boolean value to indicate whether the refresh is triggered
            * because the state of expander is changed(expanded/collapsed).
            */
            function (size, state) {
                var self = this, fields = self._fields, panel1 = fields.panel1;
                if(fields._isResizing) {
                    return;
                }
                if(state || state === undefined) {
                    self._updateElementsCss();
                }
                self._updateElements();
                if(size || size === undefined) {
                    if(!$.fn.resizable) {
                        return;
                    }
                    if(panel1 && panel1.n.is(":ui-resizable")) {
                        panel1.n.resizable('destroy');
                    }
                    self._initResizer();
                }
            };
            wijsplitter.prototype._createDisabledDiv = function (outerEle) {
                var self = this, ele = //Change your outerelement here
                outerEle ? outerEle : self.element, eleOffset = ele.offset(), disabledWidth = ele.outerWidth(), disabledHeight = ele.outerHeight(), css = {
                    "z-index": "99999",
                    position: "absolute",
                    width: disabledWidth,
                    height: disabledHeight,
                    left: eleOffset.left,
                    top: eleOffset.top
                };
                if($.browser.msie) {
                    $.extend(css, {
                        "background-color": "#fff",
                        opacity: 0.1
                    });
                }
                return $("<div></div>").addClass(self.options.wijCSS.stateDisabled).css(css);
            };
            wijsplitter.prototype._splitterify = function () {
                var self = this, element = self.element, o = self.options, fields = self._fields, wrapper, bar, expander, icon, pnl1 = {
                    n: undefined,
                    content: element.find(">div:eq(0)")
                }, pnl2 = {
                    n: undefined,
                    content: element.find(">div:eq(1)")
                };
                fields.originalStyle = element.attr("style");
                //create wrapper
                wrapper = $("<div></div>").appendTo(element);
                //create panel1
                pnl1.n = $("<div></div>").appendTo(wrapper);
                //create panel1 content if needed.
                if(pnl1.content.length === 0) {
                    pnl1.content = $("<div></div>");
                } else {
                    fields.oriPnl1Content = pnl1.content;
                    fields.oriPnl1ContentStyle = pnl1.content.attr("style");
                }
                pnl1.content.appendTo(pnl1.n);
                //create bar.
                bar = $("<div></div>").appendTo(wrapper);
                if(o.barZIndex !== -1) {
                    bar.css("z-index", o.barZIndex);
                }
                //create expander.
                expander = $("<div></div>").appendTo(bar).attr("role", "button");
                //create icon.
                icon = $("<span></span>").appendTo(expander);
                //create panel2
                pnl2.n = $("<div></div>").appendTo(wrapper);
                //create panel2 content if needed.
                if(pnl2.content.length === 0) {
                    pnl2.content = $("<div></div>");
                } else {
                    fields.oriPnl2Content = pnl2.content;
                    fields.oriPnl2ContentStyle = pnl2.content.attr("style");
                }
                pnl2.content.appendTo(pnl2.n);
                fields.wrapper = wrapper;
                fields.panel1 = pnl1;
                fields.panel2 = pnl2;
                fields.bar = bar;
                fields.expander = expander;
                fields.icon = icon;
            };
            wijsplitter.prototype._updateElementsCss = function () {
                var self = this, element = self.element, o = self.options, isVertical = o.orientation === "vertical", fields = self._fields, wrapper = fields.wrapper, collapsingPanel = o.collapsingPanel, otherPanel = o.collapsingPanel === 'panel1' ? 'panel2' : 'panel1', bar = fields.bar, expander = fields.expander, icon = fields.icon, css = o.wijCSS, vSplitterCSS = css.vSplitterCss, vSplitterPre = css.vSplitterCssPrefix, hSplitterCSS = css.hSplitterCss, hSplitterPre = css.hSplitterCssPrefix, panelCss = css.panelCss;
                //add class to the outmost markup.
                //add comments by RyanWu@20110817.
                //For fixing the issue#16391.
                //			element.removeClass(vSplitterCss + " " + hSplitterCss +
                //				" " + vSplitterCssPrefix + css.expandedCss +
                //				" " + vSplitterCssPrefix + collapsedCss +
                //				" " + hSplitterCssPrefix + css.expandedCss +
                //				" " + hSplitterCssPrefix + css.collapsedCss)
                //				.addClass(isVertical ? vSplitterCss : hSplitterCss);
                element.removeClass(vSplitterCSS).removeClass(hSplitterCSS).addClass(isVertical ? vSplitterCSS : hSplitterCSS);
                //end by RyanWu@20110817.
                //add class to wrapper
                wrapper.attr("class", css.wrapperCss);
                //add class to panel1
                fields[collapsingPanel].n.removeClass(vSplitterPre + panelCss[collapsingPanel].n).removeClass(hSplitterPre + panelCss[collapsingPanel].n).addClass((isVertical ? vSplitterPre : hSplitterPre) + panelCss[collapsingPanel].n);
                //add class to panel1 content.
                fields[collapsingPanel].content.removeClass(vSplitterPre + panelCss[collapsingPanel].content).removeClass(hSplitterPre + panelCss[collapsingPanel].content).removeClass(css.content).addClass((isVertical ? vSplitterPre : hSplitterPre) + panelCss[collapsingPanel].content).addClass(css.content);
                //add class to bar.
                bar.attr("class", (isVertical ? vSplitterPre : hSplitterPre) + css.barCss + " " + css.header).css("width", "").css("height", "");
                //add class to expander.
                expander.attr("class", css.cornerCssPrefix + (isVertical ? "bl " + vSplitterPre : "tr " + hSplitterPre) + css.expanderCss + " " + css.stateDefault).css("left", "").css("top", "");
                //add class to icon.
                icon.attr("class", css.icon + " " + (isVertical ? css.iconArrowLeft : css.iconArrowUp));
                //add class to panel2
                fields[otherPanel].n.removeClass(vSplitterPre + panelCss[otherPanel].n).removeClass(hSplitterPre + panelCss[otherPanel].n).addClass((isVertical ? vSplitterPre : hSplitterPre) + panelCss[otherPanel].n);
                //add class to panel2 content.
                fields[otherPanel].content.removeClass(vSplitterPre + panelCss[otherPanel].content).removeClass(hSplitterPre + panelCss[otherPanel].content).removeClass(css.content).addClass((isVertical ? vSplitterPre : hSplitterPre) + panelCss[otherPanel].content).addClass(css.content);
                // if panel1.collapsed = true, then we need update
                // the expander icon's css.
                self._updateExpanderCss();
            };
            wijsplitter.prototype._updateExpanderCss = function () {
                var self = this, o = self.options, fields = self._fields, expander = fields.expander, icon = fields.icon, css = o.wijCSS, cornerPre = css.cornerCssPrefix, isVertical = o.orientation === "vertical", panel2IsCollapsing = o.collapsingPanel !== "panel1", cssPrefix = isVertical ? css.vSplitterCssPrefix : css.hSplitterCssPrefix, ovalue = (isVertical ? 1 : 0) * 2 + (panel2IsCollapsing ? 1 : 0), collapsedExpCorner1Css = [
                    "bl", 
                    "tr", 
                    "tr", 
                    "bl"
                ][ovalue], collapsedExpCorner2Css = [
                    "br", 
                    "tl"
                ][+panel2IsCollapsing], collapsedIconCss = [
                    css.iconArrowDown, 
                    css.iconArrowUp, 
                    css.iconArrowRight, 
                    css.iconArrowLeft
                ][ovalue], expandedExpCorner1Css = [
                    "tr", 
                    "bl", 
                    "bl", 
                    "tr"
                ][ovalue], expandedExpCorner2Css = [
                    "tl", 
                    "br"
                ][+panel2IsCollapsing], expandedIconCss = [
                    css.iconArrowUp, 
                    css.iconArrowDown, 
                    css.iconArrowLeft, 
                    css.iconArrowRight
                ][ovalue];
                expander.removeClass(cssPrefix + o.collapsingPanel + "-" + css.expandedCss).removeClass(cssPrefix + o.collapsingPanel + "-" + css.collapsedCss).removeClass(cornerPre + collapsedExpCorner1Css).removeClass(cornerPre + collapsedExpCorner2Css).removeClass(cornerPre + expandedExpCorner1Css).removeClass(cornerPre + expandedExpCorner2Css);
                icon.removeClass(collapsedIconCss).removeClass(expandedIconCss);
                if(o.panel1.collapsed || o.panel2.collapsed) {
                    expander.addClass(cornerPre + collapsedExpCorner1Css).addClass(cornerPre + collapsedExpCorner2Css).addClass(cssPrefix + o.collapsingPanel + "-" + css.collapsedCss);
                    icon.addClass(collapsedIconCss);
                } else {
                    expander.addClass(cornerPre + expandedExpCorner1Css).addClass(cornerPre + expandedExpCorner2Css).addClass(cssPrefix + o.collapsingPanel + "-" + css.expandedCss);
                    icon.addClass(expandedIconCss);
                }
            };
            wijsplitter.prototype._AddVisiblity = function (ele) {
                if(ele.wijTriggerVisibility) {
                    ele.wijTriggerVisibility();
                }
            };
            wijsplitter.prototype._updateElements = function () {
                var self = this, element = self.element, o = self.options, distance = o.splitterDistance, collapsingPanel = o.collapsingPanel, otherPanel = o.collapsingPanel === 'panel1' ? 'panel2' : 'panel1', fields = self._fields, wrapper = fields.wrapper, pnl1 = fields.panel1, pnl2 = fields.panel2, bar = fields.bar, expander = fields.expander, width = element.width(), height = element.height(), barW, barH;
                wrapper.height(height);
                self._setPanelsScrollMode();
                if(o.orientation === "vertical") {
                    barW = bar.outerWidth(true);
                    if(distance > width - barW) {
                        distance = width - barW;
                    }
                    //fixed bug 29981
                    //To prevent panel2 be a new line by the css "float:left"
                    wrapper.width(width * 2);
                    if(o.panel1.collapsed) {
                        if(collapsingPanel === "panel1") {
                            expander.addClass(o.wijCSS.vSplitterCssPrefix + "panel1" + "-" + o.wijCSS.collapsedCss);
                        }
                        fields.panel1.n.css("display", "none");
                        fields.panel2.n.css("display", "");
                        this._AddVisiblity(fields.panel2.n);
                        distance = 0;
                    } else {
                        if(collapsingPanel === "panel1") {
                            expander.addClass(o.wijCSS.vSplitterCssPrefix + "panel1" + "-" + o.wijCSS.expandedCss);
                        }
                        fields.panel1.n.css("display", "");
                        this._AddVisiblity(fields.panel1.n);
                        fields.panel2.n.css("display", o.panel2.collapsed ? "none" : "");
                    }
                    if(o.panel2.collapsed) {
                        if(collapsingPanel === "panel2") {
                            expander.addClass(o.wijCSS.vSplitterCssPrefix + "panel2" + "-" + o.wijCSS.collapsedCss);
                        }
                        fields.panel2.n.css("display", "none");
                        distance = (collapsingPanel === "panel1") ? width - barW : width;
                    } else {
                        if(collapsingPanel === "panel2") {
                            expander.addClass(o.wijCSS.vSplitterCssPrefix + "panel2" + "-" + o.wijCSS.expandedCss);
                        }
                        fields.panel2.n.css("display", "");
                        this._AddVisiblity(fields.panel2.n);
                    }
                    if(!o.panel1.collapsed && !o.panel2.collapsed) {
                        expander.addClass(o.wijCSS.vSplitterCssPrefix + o.collapsingPanel + "-" + o.wijCSS.expandedCss);
                    }
                    if(collapsingPanel === "panel1") {
                        fields.panel1.n.height(height).width(distance);
                        fields.panel2.n.height(height).width(width - distance - barW);
                    } else {
                        fields.panel1.n.height(height).width(distance - barW);
                        fields.panel2.n.height(height).width(width - distance);
                        //fields.panel2.content.width(width - distance);
                                            }
                    fields.panel1.content.outerHeight(height, true);
                    bar.outerHeight(height, true);
                    fields.panel2.content.outerHeight(height, true);
                    expander.css("cursor", "pointer").css("top", height / 2 - expander.outerHeight(true) / 2);
                } else {
                    barH = bar.outerHeight(true);
                    if(distance > height - barH) {
                        distance = height - barH;
                    }
                    if(o.panel1.collapsed) {
                        if(collapsingPanel === "panel1") {
                            expander.addClass(o.wijCSS.hSplitterCssPrefix + "panel1" + "-" + o.wijCSS.collapsedCss);
                        }
                        fields.panel1.n.css("display", "none");
                        fields.panel2.n.css("display", "");
                        this._AddVisiblity(fields.panel2.n);
                        distance = 0;
                    } else {
                        if(collapsingPanel === "panel1") {
                            expander.addClass(o.wijCSS.hSplitterCssPrefix + "panel1" + "-" + o.wijCSS.expandedCss);
                        }
                        fields.panel1.n.css("display", "");
                        this._AddVisiblity(fields.panel1.n);
                        fields.panel2.n.css("display", o.panel2.collapsed ? "none" : "");
                    }
                    if(o.panel2.collapsed) {
                        if(collapsingPanel === "panel2") {
                            expander.addClass(o.wijCSS.hSplitterCssPrefix + "panel2" + "-" + o.wijCSS.collapsedCss);
                        }
                        fields.panel2.n.css("display", "none");
                        distance = (collapsingPanel === "panel1") ? height - barH : height;
                    } else {
                        if(collapsingPanel === "panel2") {
                            expander.addClass(o.wijCSS.hSplitterCssPrefix + "panel2" + "-" + o.wijCSS.expandedCss);
                        }
                        fields.panel2.n.css("display", "");
                        this._AddVisiblity(fields.panel2.n);
                    }
                    if(collapsingPanel === "panel1") {
                        fields.panel1.n.width(width).height(distance);
                        fields.panel2.n.width(width).height(height - distance - barH);
                        fields.panel1.content.outerHeight(distance, true);
                        fields.panel2.content.outerHeight(height - distance - barH, true);
                    } else {
                        fields.panel1.n.width(width).height(distance - barH);
                        fields.panel2.n.width(width).height(height - distance);
                        fields.panel1.content.outerHeight(distance - barH, true);
                        fields.panel2.content.outerHeight(height - distance, true);
                    }
                    expander.css("cursor", "pointer").css("left", width / 2 - expander.outerWidth(true) / 2);
                }
                expander.css("display", o.showExpander ? "" : "none");
            };
            wijsplitter.prototype._bindEvents = function () {
                var self = this, o = self.options, fields = self._fields, bar = fields.bar, expander = fields.expander, widgetName = self.widgetName;
                expander.bind("mouseover." + widgetName, function (e) {
                    if(o.disabled) {
                        return;
                    }
                    expander.addClass(o.wijCSS.stateHover);
                }).bind("mouseout." + widgetName, function (e) {
                    if(o.disabled) {
                        return;
                    }
                    expander.removeClass(o.wijCSS.stateHover).removeClass(o.wijCSS.stateActive);
                }).bind("mousedown." + widgetName, function (e) {
                    if(o.disabled) {
                        return;
                    }
                    expander.addClass(o.wijCSS.stateActive);
                }).bind("mouseup." + widgetName, function (e) {
                    if(o.disabled) {
                        return;
                    }
                    expander.removeClass(o.wijCSS.stateActive);
                    if(o.collapsingPanel === 'panel1') {
                        self._setPanel1Collapsed(!o.panel1.collapsed, e);
                    } else {
                        self._setPanel2Collapsed(!o.panel2.collapsed, e);
                    }
                });
                bar.bind("mouseover." + widgetName, function (e) {
                    if(o.disabled) {
                        return;
                    }
                    bar.addClass(o.wijCSS.stateHover);
                }).bind("mouseout." + widgetName, function (e) {
                    if(o.disabled) {
                        return;
                    }
                    bar.removeClass(o.wijCSS.stateHover);
                });
                fields.panel1.n.bind("animating." + widgetName, function (e) {
                    if(o.disabled) {
                        return;
                    }
                    self._adjustLayout(self);
                    self._trigger("sizing", e, null);
                }).bind("animated." + widgetName, function (e) {
                    if(o.disabled) {
                        return;
                    }
                    self._adjustLayout(self);
                    self._trigger("sized", e, null);
                });
                self.element.on("mouseover." + widgetName, ".ui-resizable-handle", function (e) {
                    if(o.disabled) {
                        return;
                    }
                    bar.addClass(o.wijCSS.stateHover);
                }).on("mouseout." + widgetName, ".ui-resizable-handle", function (e) {
                    if(o.disabled) {
                        return;
                    }
                    bar.removeClass(o.wijCSS.stateHover);
                });
                $(window).bind("resize." + widgetName, function (e) {
                    if(o.disabled) {
                        return;
                    }
                    if(o.fullSplit && self.element.is(":visible")) {
                        //self.refresh();
                        self._updateElements();
                        self._initResizer();
                    }
                });
            };
            wijsplitter.prototype._setPanel1Collapsed = function (collapsed, e) {
                var self = this, o = self.options, oldCollapsed = o.panel1.collapsed, resizableHandle = $(".ui-resizable-handle", self.element);
                if(oldCollapsed === collapsed) {
                    return;
                }
                if(o.collapsingPanel === 'panel1') {
                    if(!self._trigger(oldCollapsed ? "expand" : "collapse", e, null)) {
                        return;
                    }
                }
                o.panel1.collapsed = collapsed;
                if(collapsed) {
                    o.panel2.collapsed = false;
                    if(o.collapsingPanel === 'panel2') {
                        resizableHandle.hide();
                    }
                } else {
                    resizableHandle.show();
                }
                self._updateElements();
                self._updateExpanderCss();
                if(o.collapsingPanel === 'panel1') {
                    self._trigger(collapsed ? "collapsed" : "expanded", e, null);
                }
            };
            wijsplitter.prototype._setPanel2Collapsed = function (collapsed, e) {
                var self = this, o = self.options, oldCollapsed = o.panel2.collapsed, resizableHandle = $(".ui-resizable-handle", self.element);
                if(oldCollapsed === collapsed) {
                    return;
                }
                if(o.collapsingPanel === 'panel2') {
                    if(!self._trigger(oldCollapsed ? "expand" : "collapse", e, null)) {
                        return;
                    }
                }
                o.panel2.collapsed = collapsed;
                if(collapsed) {
                    o.panel1.collapsed = false;
                    if(o.collapsingPanel === 'panel1') {
                        resizableHandle.hide();
                    }
                } else {
                    resizableHandle.show();
                }
                self._updateElements();
                self._updateExpanderCss();
                if(o.collapsingPanel === 'panel2') {
                    self._trigger(collapsed ? "collapsed" : "expanded", e, null);
                }
            };
            wijsplitter.prototype._initResizer = function () {
                var self = this, element = self.element, o = self.options, fields = self._fields, bar = fields.bar, collapsingPanel = o.collapsingPanel, otherPanel = o.collapsingPanel === 'panel1' ? 'panel2' : 'panel1', resizeSettings = o.resizeSettings, animation = resizeSettings.animationOptions, duration = animation.disabled ? 0 : animation.duration, width = element.width(), height = element.height(), barW, maxW, minW, barH, maxH, minH, resizableHandle;
                if(!$.fn.resizable) {
                    return;
                }
                if(o.orientation === "vertical") {
                    barW = bar.outerWidth(true);
                    maxW = width - barW - o[otherPanel].minSize;
                    minW = o[collapsingPanel].minSize;
                    if(minW < 2) {
                        minW = 2;
                    }
                    fields.panel1.n.resizable({
                        zIndex: fields.panel1.n.zIndex() + 100,
                        wijanimate: true,
                        minWidth: minW,
                        maxWidth: maxW,
                        handles: 'e',
                        helper: o.wijCSS.vSplitterCssPrefix + o.wijCSS.resizeHelperCss,
                        animateDuration: duration,
                        animateEasing: animation.easing,
                        disabledAnimate: // strange behavior, maybe the animate option in jQuery ui resizable has an behavior.
                        // use another option instead of it.
                        animation.disabled,
                        ghost: resizeSettings.ghost,
                        start: function () {
                            fields._isResizing = true;
                        },
                        stop: function () {
                            fields._isResizing = false;
                        }
                    });
                } else {
                    barH = bar.outerHeight(true);
                    maxH = height - barH - o[otherPanel].minSize;
                    minH = o[collapsingPanel].minSize;
                    if(minH < 2) {
                        minH = 2;
                    }
                    fields.panel1.n.resizable({
                        zIndex: fields.panel1.n.zIndex() + 100,
                        wijanimate: true,
                        minHeight: minH,
                        maxHeight: maxH,
                        handles: 's',
                        helper: o.wijCSS.hSplitterCssPrefix + o.wijCSS.resizeHelperCss,
                        animateDuration: duration,
                        animateEasing: animation.easing,
                        disabledAnimate: // strange behavior, maybe the animate option in jQuery ui resizable has an behavior.
                        // use another option instead of it.
                        animation.disabled,
                        ghost: resizeSettings.ghost,
                        start: function () {
                            fields._isResizing = true;
                            var iframe1 = fields.panel1.content.find("iframe")[0];
                            if(iframe1) {
                                self._addTransparentDivForIframe(iframe1, fields.panel1);
                            }
                            var iframe2 = fields.panel2.content.find("iframe")[0];
                            if(iframe2) {
                                self._addTransparentDivForIframe(iframe2, fields.panel2);
                            }
                        },
                        stop: function () {
                            fields._isResizing = false;
                            var iframe1 = fields.panel1.content.find("iframe")[0];
                            if(iframe1) {
                                var transDiv1 = $(iframe1).parent().children()[0];
                                $(transDiv1).remove();
                            }
                            var iframe2 = fields.panel2.content.find("iframe")[0];
                            if(iframe2) {
                                var transDiv2 = $(iframe2).parent().children()[0];
                                $(transDiv2).remove();
                            }
                        }
                    });
                }
                resizableHandle = $(".ui-resizable-handle", element);
                if(o[otherPanel].collapsed) {
                    resizableHandle.hide();
                } else {
                    resizableHandle.show();
                }
                if($.browser.msie && (parseInt($.browser.version) < 7)) {
                    if(o.orientation === "vertical") {
                        resizableHandle.height(element.height());
                    }
                }
            };
            wijsplitter.prototype._addTransparentDivForIframe = function (iframe, panel) {
                // Minus the scrollbar width
                var width = panel.content.width() - 20;
                var height = panel.content.height();
                var transDiv = $("<div style='width:" + width + "px; height:" + height + "px; background-color:gray; position:absolute; z-index:1000; filter:alpha(Opacity=0); opacity: 0'>");
                transDiv.prependTo(panel.content);
            };
            wijsplitter.prototype._adjustLayout = function (self) {
                var o = self.options, fields = self._fields, panel1 = fields.panel1, distance = o.orientation === "vertical" ? panel1.n.width() : panel1.n.height();
                if(o.splitterDistance === distance) {
                    return;
                }
                o.splitterDistance = distance;
                self._updateElements();
            };
            wijsplitter.prototype._setPanelsScrollMode = function () {
                var self = this, fields = self._fields, o = self.options, pnlScrollBars = [
                    o.panel1.scrollBars, 
                    o.panel2.scrollBars
                ];
                $.each([
                    fields.panel1, 
                    fields.panel2
                ], function (idx, pnl) {
                    if(pnlScrollBars[idx] === "auto") {
                        pnl.content.css("overflow", "auto");
                    } else if(pnlScrollBars[idx] === "both") {
                        pnl.content.css("overflow", "scroll");
                    } else if(pnlScrollBars[idx] === "none") {
                        pnl.content.css("overflow", "hidden");
                    } else if(pnlScrollBars[idx] === "horizontal") {
                        pnl.content.css("overflow-x", "scroll").css("overflow-y", "hidden");
                    } else if(pnlScrollBars[idx] === "vertical") {
                        pnl.content.css("overflow-x", "hidden").css("overflow-y", "scroll");
                    }
                });
            };
            return wijsplitter;
        })(wijmo.wijmoWidget);
        splitter.wijsplitter = wijsplitter;        
        var wijsplitter_options = (function () {
            function wijsplitter_options() {
                /** @ignore
                * Selector option for auto self initialization.
                * This option is internal.
                */
                this.initSelector = ":jqmData(role='wijsplitter')";
                /** Gets or sets the javascript function name that
                * would be called at the client side when a user is dragging the splitter.
                * @example
                * Supply a callback function to handle the sizing event:
                * $("#element").wijsplitter({ sizing: function () { } });
                * Bind to the event by type:
                * $("#element").bind("wijsplittersizing", function () { });
                * @event
                */
                this.sizing = null;
                /** Gets or sets the javascript function name that
                * would be called at the client side when the user is done dragging the splitter.
                * @example
                * Supply a callback function to handle the sized event:
                * $("#element").wijsplitter({ sized: function () { } });
                * Bind to the event by type:
                * $("#element").bind("wijsplittersized", function () { });
                * @event
                */
                this.sized = null;
                /** Gets or sets the javascript function name to be called before panel1 is expanded.
                * @example
                * Supply a callback function to handle the expand event:
                * $("#element").wijsplitter({ expand: function () { return false; } });
                * Bind to the event by type:
                * $("#element").bind("wijsplitterexpand", function () { return false; });
                * @event
                */
                this.expand = null;
                /** Gets or sets the javascript function name to be called before panel1 is collapsed.
                * @example
                * Supply a callback function to handle the collapse event:
                * $("#element").wijsplitter({ collapse: function () { return false; } });
                * Bind to the event by type:
                * $("#element").bind("wijsplittercollapse", function () { return false; });
                * @event
                */
                this.collapse = null;
                /** Gets or sets the javascript function name to be called when panel1 is expanded by clicking the collapse/expand image.
                * @example
                * Supply a callback function to handle the expanded event:
                * $("#element").wijsplitter({ expanded: function () { } });
                * Bind to the event by type:
                * $("#element").bind("wijsplitterexpanded", function () { });
                * @event
                */
                this.expanded = null;
                /** Gets or sets the javascript function name to be called when panel1 is collapsed by clicking the collapse/expand image.
                * @example
                * Supply a callback function to handle the collapsed event:
                * $("#element").wijsplitter({ collapsed: function () { } });
                * Bind to the event by type:
                * $("#element").bind("wijsplittercollapsed", function () { });
                * @event
                */
                this.collapsed = null;
                /** A value that indicates the z-index (stack order) of the splitter bar.
                * @type {number}
                */
                this.barZIndex = -1;
                /** A Boolean value that determines whether the expander of the wijsplitter widget is shown.
                * is allowed to be shown.
                * @type {boolean}
                */
                this.showExpander = true;
                /** Gets or sets the location of the splitter, in pixels, from the left or top edge of the SplitContainer.
                * @type {number}
                */
                this.splitterDistance = 100;
                /** Gets or sets a value indicating the horizontal or vertical orientation of the SplitContainer panels
                * of the splitter panels.
                * @type {string}
                */
                this.orientation = 'vertical';
                /**	Gets or sets a value that indicates whether the widget fills the whole page.
                * @type {boolean}
                */
                this.fullSplit = false;
                /**	Defines the animation while the bar of the splitter is being dragged.
                * @type {object}
                */
                this.resizeSettings = {
                    animationOptions: {
                        duration: /** Defines how long ( in milliseconds) the sliding animation will run.
                        * @type {number}
                        */
                        100,
                        easing: /**	The easing effect that is applied to the animation.
                        * @type {string}
                        */
                        "swing",
                        disabled: /**	Determines whether use the animation.
                        * @type {boolean}
                        */
                        false
                    },
                    ghost: /**	Gets or sets a value that determines whether an outline of a panel appears while dragging the splitter bar.
                    * the element is sized.
                    * @type {boolean}
                    */
                    false
                };
                /**	Defines the information for the top or left panel of the splitter.
                * @type {object}
                */
                this.panel1 = {
                    minSize: 1,
                    collapsed: false,
                    scrollBars: "auto"
                };
                /**	Defines the information for the bottom or right panel of the splitter.
                * @type {object}
                */
                this.panel2 = {
                    minSize: 1,
                    collapsed: false,
                    scrollBars: "auto"
                };
                /** Specifies which panel should be collapsed after clicking the expander of the splitter. Possible values are "panel1" and "panel2".
                * @example
                * $('.selector' ).wijsplitter({collapsingPanel: "panel1"});
                * @type {string}
                */
                this.collapsingPanel = "panel1";
                /** @ignore
                * All CSS classes used in widgets.
                */
                this.wijCSS = {
                    cornerCssPrefix: "ui-corner-",
                    arrowCssPrefix: "ui-icon-triangle-1-",
                    panelCss: {
                        panel1: {
                            n: "panel1",
                            content: "panel1-content"
                        },
                        panel2: {
                            n: "panel2",
                            content: "panel2-content"
                        }
                    },
                    wrapperCss: "wijmo-wijsplitter-wrapper",
                    hSplitterCss: "wijmo-wijsplitter-horizontal",
                    vSplitterCss: "wijmo-wijsplitter-vertical",
                    hSplitterCssPrefix: "wijmo-wijsplitter-h-",
                    vSplitterCssPrefix: "wijmo-wijsplitter-v-",
                    collapsedCss: "collapsed",
                    expandedCss: "expanded",
                    resizeHelperCss: "resize-helper",
                    barCss: "bar",
                    expanderCss: "expander"
                };
                /** @ignore
                * wijMobileCSS.
                */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body ui-body-b",
                    stateDefault: "ui-btn ui-btn-b"
                };
            }
            return wijsplitter_options;
        })();        
        wijsplitter.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijsplitter_options());
        $.wijmo.registerWidget("wijsplitter", wijsplitter.prototype);
        if(!wijsplitter.prototype._isMobile && $.ui != null && $.ui.plugin != null) {
            $.ui.plugin.add("resizable", "wijanimate", {
                stop: function (event, ui) {
                    var self = $(this).data("uiResizable"), o = self.options, element = self.element, pr = self._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName), soffseth = ista && $.ui.hasScroll(pr[0], 'left') ? 0 : self.sizeDiff.height, soffsetw = ista ? 0 : self.sizeDiff.width, style, left, top;
                    element.css("width", self.originalSize.width).css("height", self.originalSize.height);
                    style = {
                        width: (self.size.width - soffsetw),
                        height: (self.size.height - soffseth)
                    };
                    left = (parseInt(element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null;
                    top = (parseInt(element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;
                    if(!o.disabledAnimate) {
                        element.animate($.extend(style, top && left ? {
                            top: top,
                            left: left
                        } : {
                        }), {
                            duration: o.animateDuration,
                            easing: o.animateEasing,
                            step: function () {
                                var data = {
                                    width: parseInt(element.css('width'), 10),
                                    height: parseInt(element.css('height'), 10),
                                    top: parseInt(element.css('top'), 10),
                                    left: parseInt(element.css('left'), 10)
                                };
                                if(pr && pr.length) {
                                    $(pr[0]).css({
                                        width: data.width,
                                        height: data.height
                                    });
                                }
                                // propagating resize, and updating values for each animation step
                                self._updateCache(data);
                                self._propagate("resize", event);
                                element.trigger("animating");
                            },
                            complete: function () {
                                element.trigger("animated");
                            }
                        });
                    } else {
                        element.css($.extend(style, top && left ? {
                            top: top,
                            left: left
                        } : {
                        }));
                        element.trigger("animated");
                    }
                }
            });
        }
    })(wijmo.splitter || (wijmo.splitter = {}));
    var splitter = wijmo.splitter;
})(wijmo || (wijmo = {}));
