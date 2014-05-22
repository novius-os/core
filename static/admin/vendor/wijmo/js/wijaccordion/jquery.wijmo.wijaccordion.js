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
    /// <reference path="../Base/jquery.wijmo.widget.ts" />
    /// <reference path="../wijutil/jquery.wijmo.wijutil.ts" />
    /*globals jQuery,$,window,alert,document,confirm,location,setTimeout, Globalize,
    amplify*/
    /*jslint white: false */
    /*jslint nomen: false*/
    /*jslint browser: true*/
    /*jslint continue: true*/
    /*jslint devel: true*/
    /*jslint forin: true*/
    /*jslint maxlen: 110*/
    /*
    * Depends:
    *  jquery.ui.core.js
    *  jquery.ui.widget.js
    *  jquery.wijmo.wijutil.js
    *  jquery.wijmo.wijaccordion.js
    *
    */
    (function (accordion) {
        "use strict";
        var $ = jQuery, widgetName = "wijaccordion", accordionClass = //Classes
        "wijmo-wijaccordion", accordionTopClass = "wijmo-wijaccordion-top", accordionBottomClass = "wijmo-wijaccordion-bottom", accordionLeftClass = "wijmo-wijaccordion-left", accordionRightClass = "wijmo-wijaccordion-right", headerClass = "wijmo-wijaccordion-header", contentClass = "wijmo-wijaccordion-content", contentActiveClass = "wijmo-wijaccordion-content-active", iconsClass = "wijmo-wijaccordion-icons", horizontalClass = "ui-helper-horizontal";
        /** @widget */
        var wijaccordion = (function (_super) {
            __extends(wijaccordion, _super);
            function wijaccordion() {
                _super.apply(this, arguments);

                this.widgetEventPrefix = "wijaccordion";
            }
            wijaccordion.prototype._setOption = function (key, value) {
                var o = this.options;
                if(o[key] !== value) {
                    switch(key) {
                        case "selectedIndex":
                            this.activate(value);
                            break;
                        case "disabled":
                            if(value) {
                                this.element.addClass(o.wijCSS.stateDisabled);
                            } else {
                                this.element.removeClass(o.wijCSS.stateDisabled);
                            }
                            break;
                        case "event":
                            this._unbindLiveEvents();
                            this.options.event = value;
                            this._bindLiveEvents();
                            break;
                        case "header":
                            this._handleHeaderChange(value, o.header);
                            break;
                        case "animated":
                            break;
                        case "expandDirection":
                            this._onDirectionChange(value, true, o.expandDirection);
                            break;
                        default:
                            break;
                    }
                }
                _super.prototype._setOption.call(this, key, value);
            };
            wijaccordion.prototype._handleHeaderChange = function (newHeaderSelector, prevHeaderSelector) {
                var wijCSS = this.options.wijCSS, prevHeaders = this.element.find(prevHeaderSelector);
                prevHeaders.removeClass(wijCSS.wijaccordionHeader).removeClass(headerClass).removeClass(wijCSS.stateActive).removeClass(this._triangleIconOpened);
                prevHeaders.siblings("." + contentClass).removeClass(wijCSS.wijaccordionContent).removeClass(contentClass).removeClass(wijCSS.content).removeClass(wijCSS.wijaccordionContentActive).removeClass(contentActiveClass);
                this._initHeaders(newHeaderSelector);
            };
            wijaccordion.prototype._initHeaders = function (selector) {
                if (typeof selector === "undefined") { selector = null; }
                var o = this.options, selector = selector ? selector : o.header, headers = this.element.find(selector);
                headers.each(jQuery.proxy(this._initHeader, this));
            };
            wijaccordion.prototype._initHeader = function (index, elem) {
                var o = this.options, wijCSS = o.wijCSS, rightToLeft = this.element.data("rightToLeft"), header = $(elem), content = $(header.next()[0]);
                if(rightToLeft) {
                    header.remove();
                    header.insertAfter(content);
                }
                header.addClass(headerClass).addClass(wijCSS.wijaccordionHeader).attr("role", "tab");
                content.attr("role", "tabpanel");
                if(header.find("> a").length === 0) {
                    header.wrapInner('<a href="#"></a>');
                }
                if(header.find("> ." + wijmo.getCSSSelector(wijCSS.icon)).length === 0) {
                    $('<span></span>').addClass(wijCSS.icon).insertBefore($("> a", header)[0]);
                }
                if(index === o.selectedIndex) {
                    header.addClass(wijCSS.stateDefault).addClass(wijCSS.stateActive).addClass(this._headerCornerOpened).attr({
                        "aria-expanded": "true",
                        tabIndex: 0
                    });
                    header.find("> ." + wijmo.getCSSSelector(wijCSS.icon)).addClass(this._triangleIconOpened);
                    content.addClass(contentActiveClass).addClass(wijCSS.wijaccordionContentActive).addClass(this._contentCornerOpened).wijTriggerVisibility();
                } else {
                    header.addClass(wijCSS.stateDefault).addClass(wijCSS.cornerAll).attr({
                        "aria-expanded": "false",
                        tabIndex: -1
                    });
                    header.find("> .ui-icon").addClass(this._triangleIconClosed);
                    content.hide();
                }
                content.addClass(contentClass).addClass(wijCSS.wijaccordionContent).addClass(wijCSS.content);
                //if use the header option and the header's parent wrapped an div element, when the
                // accordion's expandDirection is left/top, the layout is wrong.
                while(true) {
                    if(header.parent().hasClass(accordionClass)) {
                        break;
                    }
                    header.unwrap();
                }
            };
            wijaccordion.prototype._create = function () {
                var o = this.options, self = this;
                // enable touch support:
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                this.element.addClass(accordionClass).addClass(o.wijCSS.wijaccordion).addClass(o.wijCSS.widget).addClass(iconsClass).addClass(o.wijCSS.wijaccordionIcons).addClass(o.wijCSS.helperClearFix);
                if(o.disabled) {
                    this.element.addClass(o.wijCSS.stateDisabled);
                }
                this._onDirectionChange(o.expandDirection, false);
                this._initHeaders();
                this.element.attr("role", "tablist");
                //super._create(this, arguments);
                $(window).on("resize.wijaccordion", function (e) {
                    self._adjustAccordion();
                });
                if(o.expandDirection === 'left' || o.expandDirection === 'right') {
                    self._adjustAccordion();
                }
                this._getDefaultLayoutSetting();
                _super.prototype._create.call(this);
            };
            wijaccordion.prototype._init = function () {
                this._bindLiveEvents();
            };
            wijaccordion.prototype._adjustAccordion = function () {
                if(this.options.expandDirection === 'top' || this.options.expandDirection === 'bottom') {
                    return;
                }
                var headers = this._getHeaders(), contentEle = $('.' + contentClass, this.element), fWidth = contentEle.parent().width(), paddingAndBorderWidth = parseInt(contentEle.css("paddingLeft"), 10) + parseInt(contentEle.css("paddingRight"), 10) + parseInt(contentEle.css("borderRightWidth"), 10) + parseInt(contentEle.css("borderLeftWidth"), 10), headerWidth = $('.' + headerClass, this.element).outerWidth(true), adjustContentWidth = fWidth - headers.length * (headerWidth + 4) - paddingAndBorderWidth, adjustContentWidth = // default width is 36em: 576px == 36em
                adjustContentWidth < 576 ? adjustContentWidth : 576;
                contentEle.width(adjustContentWidth);
            };
            wijaccordion.prototype._getDefaultLayoutSetting = function () {
                var contentEle = $('.' + contentClass, this.element);
                if(this.options.expandDirection === 'top' || this.options.expandDirection === 'bottom') {
                    this._defaultLayoutSetting = {
                        paddingTop: contentEle.css("paddingTop"),
                        paddingBottom: contentEle.css("paddingBottom")
                    };
                } else {
                    this._defaultLayoutSetting = {
                        paddingLeft: contentEle.css("paddingLeft"),
                        paddingRight: contentEle.css("paddingRight"),
                        width: contentEle.width()
                    };
                }
            };
            wijaccordion.prototype.destroy = /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            function () {
                var o = this.options;
                this._unbindLiveEvents();
                this.element.removeClass(o.wijCSS.wijaccordion).removeClass(accordionClass).removeClass(o.wijCSS.widget).removeClass(o.wijCSS.wijaccordionIcons).removeClass(iconsClass).removeAttr("role");
                $(window).off("resize.wijaccordion");
                _super.prototype.destroy.call(this);
            };
            wijaccordion.prototype._getHeaders = function () {
                var o = this.options, rightToLeft = this.element.data("rightToLeft"), headersArr = [], i, hdr;
                var headers = this.element.find(o.header);
                if(headers.length > 0 && !$(headers[0]).hasClass(headerClass) && $(headers[0]).hasClass(contentClass)) {
                    for(i = 0; i < headers.length; i += 1) {
                        // fix for 29695:
                        hdr = rightToLeft ? $(headers[i]).next("." + headerClass) : $(headers[i]).prev("." + headerClass);
                        if(hdr.length > 0) {
                            headersArr.push(hdr[0]);
                        }
                    }
                } else {
                    return headers;
                }
                return $(headersArr);
            };
            wijaccordion.prototype.activate = /**
            * Activates the accordion content pane at the specified index.
            * @remarks
            * You can use code like in the example below inside your document ready function
            * to activate the specified pane using the click event of a button.
            * @param {number} index The zero-based index of the accordion pane to activate.
            */
            function (index) {
                var nextHeader, o = this.options, headers = this._getHeaders(), prevHeader, adjustWidth, rightToLeft = this.element.data("rightToLeft"), newIndex, prevIndex, nextContent, prevContent, animOptions, proxied, proxiedDuration, animations, duration, easing;
                prevHeader = $(jQuery.grep(headers, function (a) {
                    return $(a).hasAllClasses(o.wijCSS.stateActive);
                }));
                if(typeof index === "number") {
                    nextHeader = $(headers[index]);
                } else if(typeof index === "string") {
                    index = parseInt(index, 0);
                    nextHeader = $(headers[index]);
                } else {
                    nextHeader = $(index);
                    index = headers.index(index);
                }
                if(nextHeader.hasAllClasses(o.wijCSS.stateDisabled)) {
                    return false;
                }
                if(nextHeader.hasAllClasses(o.wijCSS.stateActive)) {
                    if(o.requireOpenedPane) {
                        // fix for
                        // [17869] Unable to select the desire panel
                        // after all the panels are open in certain scenarios
                        if(prevHeader.length === nextHeader.length && prevHeader.index() === nextHeader.index()) {
                            return false;
                        }
                    } else {
                        prevHeader = nextHeader;
                        nextHeader = $(null);
                    }
                } else if(!o.requireOpenedPane) {
                    prevHeader = $(null);
                }
                // 29193 (fix for nested accordions):
                newIndex = headers.index(nextHeader);
                prevIndex = headers.index(prevHeader);
                nextContent = rightToLeft ? nextHeader.prev("." + contentClass) : nextHeader.next("." + contentClass);
                prevContent = rightToLeft ? prevHeader.prev("." + contentClass) : prevHeader.next("." + contentClass);
                if(prevHeader.length === 0 && nextHeader.length === 0) {
                    return false;
                }
                if(o.expandDirection === 'left' || o.expandDirection === 'right') {
                    adjustWidth = this._defaultLayoutSetting["width"];
                } else {
                    adjustWidth = nextContent.css("width");
                }
                if(!this._trigger("beforeSelectedIndexChanged", null, {
                    newIndex: newIndex,
                    prevIndex: prevIndex
                })) {
                    return false;
                }
                prevHeader.removeClass(o.wijCSS.stateActive).removeClass(this._headerCornerOpened).addClass(o.wijCSS.stateDefault).addClass(o.wijCSS.cornerAll).attr({
                    "aria-expanded": "false",
                    tabIndex: -1
                }).find("> .ui-icon").removeClass(this._triangleIconOpened).addClass(this._triangleIconClosed);
                nextHeader.removeClass("ui-corner-all").addClass(o.wijCSS.stateActive).addClass(this._headerCornerOpened).attr({
                    "aria-expanded": "true",
                    tabIndex: 0
                }).find("> .ui-icon").removeClass(this._triangleIconClosed).addClass(this._triangleIconOpened);
                if(o.animated) {
                    animOptions = {
                        toShow: nextContent,
                        toHide: prevContent,
                        complete: jQuery.proxy(function () {
                            prevContent.removeClass(o.wijCSS.wijaccordionContentActive).removeClass(contentActiveClass);
                            nextContent.addClass(o.wijCSS.wijaccordionContentActive).addClass(contentActiveClass).wijTriggerVisibility();
                            prevContent.css('display', '');
                            nextContent.css('display', '');
                            this._redrawLineChart(nextContent, prevContent);
                            //prevContent.wijTriggerVisibility();
                            //nextContent.wijTriggerVisibility();
                            if(adjustWidth !== null && adjustWidth !== undefined && (o.expandDirection === 'left' || o.expandDirection === 'right')) {
                                nextContent.width(adjustWidth);
                            }
                            this._trigger("selectedIndexChanged", null, {
                                newIndex: newIndex,
                                prevIndex: prevIndex
                            });
                        }, this),
                        horizontal: this.element.hasClass(horizontalClass),
                        rightToLeft: this.element.data("rightToLeft"),
                        down: (newIndex > prevIndex),
                        autoHeight: o.autoHeight || o.fillSpace,
                        defaultLayoutSetting: this._defaultLayoutSetting
                    };
                    proxied = o.animated;
                    proxiedDuration = o.duration;
                    if($.isFunction(proxied)) {
                        o.animated = proxied(animOptions);
                    }
                    if($.isFunction(proxiedDuration)) {
                        o.duration = proxiedDuration(animOptions);
                    }
                    animations = $.wijmo.wijaccordion.animations;
                    duration = o.duration;
                    easing = o.animated;
                    if(easing && !animations[easing] && !$.easing[easing]) {
                        easing = 'slide';
                    }
                    if(!animations[easing]) {
                        animations[easing] = function (options) {
                            this.slide(options, {
                                easing: easing,
                                duration: duration || 700
                            });
                        };
                    }
                    animations[easing](animOptions);
                } else {
                    if(prevHeader.length > 0) {
                        prevContent.hide().removeClass(o.wijCSS.wijaccordionContentActive).removeClass(contentActiveClass);
                    }
                    if(nextHeader.length > 0) {
                        nextContent.show().addClass(contentActiveClass).addClass(o.wijCSS.wijaccordionContentActive).addClass(this._contentCornerOpened).wijTriggerVisibility();
                    }
                    this._redrawLineChart(nextContent, prevContent);
                    //prevContent.wijTriggerVisibility();
                    //nextContent.wijTriggerVisibility();
                    if(adjustWidth !== null && adjustWidth !== undefined && (o.expandDirection === 'left' || o.expandDirection === 'right')) {
                        nextContent.width(adjustWidth);
                    }
                    this._trigger("selectedIndexChanged", null, {
                        newIndex: newIndex,
                        prevIndex: prevIndex
                    });
                }
                this.options.selectedIndex = newIndex;
            };
            wijaccordion.prototype._redrawLineChart = function (nextContent, prevContent) {
                if($.fn.wijlinechart) {
                    var lineChartInNext = nextContent.find(".wijmo-wijlinechart"), lineChartInPrev = prevContent.find(".wijmo-wijlinechart");
                    lineChartInPrev.wijlinechart("redraw");
                    lineChartInNext.wijlinechart("redraw");
                }
            };
            wijaccordion.prototype._bindLiveEvents = /** Private methods */
            function () {
                var self = this, o = this.options, headerSelector = "." + headerClass;
                this.element.on(o.event + ".wijaccordion", headerSelector, jQuery.proxy(this._onHeaderClick, this)).on("keydown.wijaccordion", headerSelector, jQuery.proxy(this._onHeaderKeyDown, this)).on("mouseenter.wijaccordion", headerSelector, function () {
                    $(this).addClass(o.wijCSS.stateHover);
                }).on("mouseleave.wijaccordion", headerSelector, function () {
                    $(this).removeClass(o.wijCSS.stateHover);
                }).on("focus.wijaccordion", headerSelector, function () {
                    $(this).addClass(o.wijCSS.stateFocus);
                }).on("blur.wijaccordion", headerSelector, function () {
                    $(this).removeClass(o.wijCSS.stateFocus);
                });
            };
            wijaccordion.prototype._unbindLiveEvents = function () {
                this.element.off(".wijaccordion", "." + headerClass);
            };
            wijaccordion.prototype._onHeaderClick = function (e) {
                if(!this.options.disabled) {
                    this.activate(e.currentTarget);
                }
                return false;
            };
            wijaccordion.prototype._onHeaderKeyDown = function (e) {
                if(this.options.disabled || e.altKey || e.ctrlKey) {
                    return;
                }
                if(!$.ui) {
                    return;
                }
                var keyCode = wijmo.getKeyCodeEnum(), focusedHeader = this.element.find("." + headerClass + "." + this.options.wijCSS.stateFocus), focusedInd, headers = this._getHeaders();
                if(focusedHeader.length > 0) {
                    focusedInd = $("." + headerClass, this.element).index(focusedHeader);
                    switch(e.keyCode) {
                        case keyCode.RIGHT:
                        case keyCode.DOWN:
                            if(headers[focusedInd + 1]) {
                                headers[focusedInd + 1].focus();
                                return false;
                            }
                            break;
                        case keyCode.LEFT:
                        case keyCode.UP:
                            if(headers[focusedInd - 1]) {
                                headers[focusedInd - 1].focus();
                                return false;
                            }
                            break;
                        case keyCode.SPACE:
                        case keyCode.ENTER:
                            this.activate(e.currentTarget);
                            e.preventDefault();
                            break;
                    }
                }
                return true;
            };
            wijaccordion.prototype._onDirectionChange = function (newDirection, allowDOMChange, prevDirection) {
                if (typeof prevDirection === "undefined") { prevDirection = null; }
                var rightToLeft, openedHeaders, openedContents, openedTriangles, closedTriangles, prevIsRightToLeft;
                var o = this.options;
                if(allowDOMChange) {
                    openedHeaders = this.element.find("." + headerClass + "." + this._headerCornerOpened);
                    openedHeaders.removeClass(this._headerCornerOpened);
                    openedContents = this.element.find("." + contentClass + "." + this._contentCornerOpened);
                    openedContents.removeClass(this._contentCornerOpened);
                    openedTriangles = this.element.find("." + this._triangleIconOpened);
                    closedTriangles = this.element.find("." + this._triangleIconClosed);
                    openedTriangles.removeClass(this._triangleIconOpened);
                    closedTriangles.removeClass(this._triangleIconClosed);
                }
                if(prevDirection !== null) {
                    this.element.removeClass(accordionClass + "-" + prevDirection);
                }
                switch(newDirection) {
                    case "top":
                        this._headerCornerOpened = o.wijCSS.cornerBottom;
                        this._contentCornerOpened = o.wijCSS.cornerTop;
                        this._triangleIconOpened = o.wijCSS.iconArrowUp;
                        this._triangleIconClosed = o.wijCSS.iconArrowRight;
                        rightToLeft = true;
                        this.element.removeClass(horizontalClass);
                        this.element.addClass(accordionTopClass).addClass(o.wijCSS.wijaccordionTop);
                        break;
                    case "right":
                        this._headerCornerOpened = o.wijCSS.cornerLeft;
                        this._contentCornerOpened = o.wijCSS.cornerRight;
                        this._triangleIconOpened = o.wijCSS.iconArrowRight;
                        this._triangleIconClosed = o.wijCSS.iconArrowDown;
                        rightToLeft = false;
                        this.element.addClass(horizontalClass);
                        this.element.addClass(accordionRightClass).addClass(o.wijCSS.wijaccordionRight);
                        break;
                    case "left":
                        this._headerCornerOpened = o.wijCSS.cornerRight;
                        this._contentCornerOpened = o.wijCSS.cornerLeft;
                        this._triangleIconOpened = o.wijCSS.iconArrowLeft;
                        this._triangleIconClosed = o.wijCSS.iconArrowDown;
                        rightToLeft = true;
                        this.element.addClass(horizontalClass);
                        this.element.addClass(accordionLeftClass).addClass(o.wijCSS.wijaccordionLeft);
                        break;
                    default:
                        //bottom
                        this._headerCornerOpened = o.wijCSS.cornerTop;
                        this._contentCornerOpened = o.wijCSS.cornerBottom;
                        this._triangleIconOpened = o.wijCSS.iconArrowDown;
                        this._triangleIconClosed = o.wijCSS.iconArrowRight;
                        rightToLeft = false;
                        this.element.removeClass(horizontalClass);
                        this.element.addClass(accordionBottomClass).addClass(o.wijCSS.wijaccordionBottom);
                        break;
                }
                prevIsRightToLeft = this.element.data("rightToLeft");
                this.element.data("rightToLeft", rightToLeft);
                if(allowDOMChange) {
                    openedTriangles.addClass(this._triangleIconOpened);
                    closedTriangles.addClass(this._triangleIconClosed);
                    openedHeaders.addClass(this._headerCornerOpened);
                    openedContents.addClass(this._contentCornerOpened);
                }
                if(allowDOMChange && rightToLeft !== prevIsRightToLeft) {
                    this.element.children("." + headerClass).each(function (index, elem) {
                        var header = $(this), content;
                        if(rightToLeft) {
                            content = header.next("." + contentClass);
                            header.remove();
                            header.insertAfter(content);
                        } else {
                            content = header.prev("." + contentClass);
                            header.remove();
                            header.insertBefore(content);
                        }
                    });
                }
            };
            return wijaccordion;
        })(wijmo.wijmoWidget);
        accordion.wijaccordion = wijaccordion;        
        ;
        var wijaccordion_options = (function () {
            function wijaccordion_options() {
                /**  @ignore */
                this.wijCSS = {
                    wijaccordion: "",
                    wijaccordionTop: "",
                    wijaccordionBottom: "",
                    wijaccordionLeft: "",
                    wijaccordionRight: "",
                    wijaccordionHeader: "",
                    wijaccordionContent: "",
                    wijaccordionContentActive: "",
                    wijaccordionIcons: ""
                };
                /**
                * All CSS classes used in widgets that use Mobile theme framework
                * @ignore
                */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body ui-body-b"
                };
                /**
                * Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijaccordion')";
                /**
                * Sets the animation easing effect that users experience when they switch
                * between panes.
                * @remarks
                * Set this option to false in order to disable easing. This results in a plain, abrupt shift
                * from one pane to the next. You can also create custom easing animations using jQuery UI Easings
                * Options available for the animation function include:
                * down - If true, indicates that the index of the pane should be expanded higher than the index
                *	of the pane that must be collapsed.
                * horizontal - If true, indicates that the accordion have a horizontal
                *	orientation (when the expandDirection is left or right).
                * rightToLeft - If true, indicates that the content element is located
                *	before the header element (top and left expand direction).
                * toShow - jQuery object that contains the content element(s) should be shown.
                * toHide - jQuery object that contains the content element(s) should be hidden.
                * @example
                * //Create your own animation:
                * jQuery.wijmo.wijaccordion.animations.custom1 = function (options) {
                *     this.slide(options, {
                *     easing: options.down ? "easeOutBounce" : "swing",
                *     duration: options.down ? 1000 : 200
                *   });
                * }
                *  $("#accordion3").wijaccordion({
                *      expandDirection: "right",
                *      animated: "custom1"
                *  });
                */
                this.animated = 'slide';
                /**
                * The animation duration in milliseconds.
                * @remarks
                * @type {number}
                * By default, the animation duration value depends on an animation effect specified
                * by the animation option.
                */
                this.duration = null;
                /**
                * Determines the event that triggers the accordion to change panes.
                * @remarks
                * To select multiple events, separate them by a space. Supported events include:
                *	focus -- The pane opens when you click its header.
                *	click (default) -- The pane opens when you click its header.
                *	dblclick -- The pane opens when you double-click its header.
                *	mousedown -- The pane opens when you press the mouse button over its header.
                *	mouseup -- The pane opens when you release the mouse button over its header.
                *	mousemove -- The pane opens when you move the mouse pointer into its header.
                *	mouseover -- The pane opens when you hover the mouse pointer over its header.
                *	mouseout -- The pane opens when the mouse pointer leaves its header.
                *	mouseenter -- The pane opens when the mouse pointer enters its header.
                *	mouseleave -- The pane opens when the mouse pointer leaves its header.
                *	select -- The pane opens when you select its header by clicking and then pressing Enter
                *	submit -- The pane opens when you select its header by clicking and then pressing Enter.
                *	keydown -- The pane opens when you select its header by clicking and then pressing any key.
                *	keypress -- The pane opens when you select its header by clicking and then pressing any key.
                *	keyup -- The pane opens when you select its header by clicking and then pressing and releasing any key.
                */
                this.event = "click";
                /**
                * Determines whether the widget behavior is disabled. If set to true, the
                * control appears dimmed and does not respond when clicked.
                */
                this.disabled = false;
                /**
                * Determines the direction in which the content area of the control expands.
                * @remarks
                * Available values include: top, right, bottom, and left.
                */
                this.expandDirection = "bottom";
                /**
                * Determines the selector for the header element.
                * @remarks
                * Set this option to put header and content elements inside the HTML tags of your choice.
                * By default, the header is the first child after an <LI> element, and the content is
                * the second child html markup.
                */
                this.header = "> li > :first-child,> :not(li):even";
                /**
                * Determines whether clicking a header closes the current pane before opening the new one.
                * @remarks
                * Setting this value to false causes the headers to act as toggles for opening and
                * closing the panes, leaving all previously clicked panes open until you click them again.
                */
                this.requireOpenedPane = true;
                /**
                * Gets or sets the zero-based index of the accordion pane to show expanded initially.
                * @remarks
                * By default, the first pane is expanded. A setting of -1 specifies that no pane
                * is expanded initially, if you also set the requireOpenedPane option to false.
                */
                this.selectedIndex = 0;
            }
            return wijaccordion_options;
        })();        
        wijaccordion.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijaccordion_options());
        $.wijmo.registerWidget(widgetName, wijaccordion.prototype);
        $.extend($.wijmo.wijaccordion, {
            animations: {
                _parseWidth: function (width) {
                    var parts = ('' + width).match(/^([\d+-.]+)(.*)$/);
                    return {
                        value: parts ? parts[1] : "0",
                        unit: parts ? (parts[2] || "px") : "px"
                    };
                },
                slide: function (options, additions) {
                    options = $.extend({
                        easing: "swing",
                        duration: 300
                    }, options, additions);
                    var simpleShowOpts, simpleHideOpts;
                    if(options.horizontal) {
                        simpleShowOpts = {
                            width: "show"
                        };
                        simpleHideOpts = {
                            width: "hide"
                        };
                    } else {
                        simpleShowOpts = {
                            height: "show"
                        };
                        simpleHideOpts = {
                            height: "hide"
                        };
                    }
                    if(!options.toHide.size()) {
                        options.toShow.stop(true, true).animate(simpleShowOpts, options);
                        return;
                    }
                    if(!options.toShow.size()) {
                        options.toHide.stop(true, true).animate(simpleHideOpts, options);
                        return;
                    }
                    var overflow = options.toShow.css('overflow'), percentDone = 0, showProps = {
                    }, hideProps = {
                    }, toShowCssProps, fxAttrs = options.horizontal ? [
                        "width", 
                        "paddingLeft", 
                        "paddingRight"
                    ] : [
                        "height", 
                        "paddingTop", 
                        "paddingBottom"
                    ], originalWidth, s = options.toShow;
                    // fix width/height before calculating height/width of hidden element
                    if(options.horizontal) {
                        originalWidth = s[0].style.height;
                        s.height(parseInt(s.parent().height(), 10) - parseInt(s.css("paddingTop"), 10) - parseInt(s.css("paddingBottom"), 10) - (parseInt(s.css("borderTopWidth"), 10) || 0) - (parseInt(s.css("borderBottomWidth"), 10) || 0));
                    } else {
                        originalWidth = s[0].style.width;
                        s.width(parseInt(s.parent().width(), 10) - parseInt(s.css("paddingLeft"), 10) - parseInt(s.css("paddingRight"), 10) - (parseInt(s.css("borderLeftWidth"), 10) || 0) - (parseInt(s.css("borderRightWidth"), 10) || 0));
                    }
                    $.each(fxAttrs, function (i, prop) {
                        hideProps[prop] = "hide";
                        if(!options.horizontal && prop === "height") {
                            showProps[prop] = $.wijmo.wijaccordion.animations._parseWidth($.css(options.toShow[0], prop));
                        } else {
                            showProps[prop] = $.wijmo.wijaccordion.animations._parseWidth(options.defaultLayoutSetting[prop]);
                        }
                    });
                    if(options.horizontal) {
                        toShowCssProps = {
                            width: 0,
                            overflow: "hidden"
                        };
                    } else {
                        toShowCssProps = {
                            height: 0,
                            overflow: "hidden"
                        };
                    }
                    options.toShow.css(toShowCssProps).stop(true, true).show();
                    options.toHide.filter(":hidden").each(options.complete).end().filter(":visible").stop(true, true).animate(hideProps, {
                        step: function (now, settings) {
                            var val;
                            if(settings.prop === options.horizontal ? "width" : "height") {
                                percentDone = (settings.end - settings.start === 0) ? 0 : (settings.now - settings.start) / (settings.end - settings.start);
                            }
                            val = (percentDone * showProps[settings.prop].value);
                            if(val < 0) {
                                //fix for 16943:
                                val = 0;
                            }
                            options.toShow[0].style[settings.prop] = val + showProps[settings.prop].unit;
                        },
                        duration: options.duration,
                        easing: options.easing,
                        complete: function () {
                            if(!options.autoHeight) {
                                options.toShow.css(options.horizontal ? "width" : "height", "");
                            }
                            options.toShow.css(options.horizontal ? "height" : "width", originalWidth);
                            options.toShow.css({
                                overflow: overflow
                            });
                            options.complete();
                        }
                    });
                },
                bounceslide: function (options) {
                    this.slide(options, {
                        easing: options.down ? "easeOutBounce" : "swing",
                        duration: options.down ? 1000 : 200
                    });
                }
            }
        });
    })(wijmo.accordion || (wijmo.accordion = {}));
    var accordion = wijmo.accordion;
})(wijmo || (wijmo = {}));
