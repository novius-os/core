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
/// <reference path="../Base/jquery.wijmo.widget.ts" />
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
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery, widgetName = "wijaccordion";
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
            $.wijmo.widget.prototype._setOption.apply(this, arguments);
        };
        wijaccordion.prototype._handleHeaderChange = function (newHeaderSelector, prevHeaderSelector) {
            var prevHeaders = this.element.find(prevHeaderSelector);
            prevHeaders.removeClass("wijmo-wijaccordion-header " + this.options.wijCSS.stateActive + " " + this._triangleIconOpened).siblings(".wijmo-wijaccordion-content").removeClass("wijmo-wijaccordion-content " + this.options.wijCSS.content + " wijmo-wijaccordion-content-active");
            this._initHeaders(newHeaderSelector);
        };
        wijaccordion.prototype._initHeaders = function (selector) {
            if (typeof selector === "undefined") { selector = null; }
            var o = this.options, selector = selector ? selector : o.header, headers = this.element.find(selector);
            headers.each(jQuery.proxy(this._initHeader, this));
        };
        wijaccordion.prototype._initHeader = function (index, elem) {
            var o = this.options, rightToLeft = this.element.data("rightToLeft"), header = $(elem), content = $(header.next()[0]);
            if(rightToLeft) {
                header.remove();
                header.insertAfter(content);
            }
            header.addClass("wijmo-wijaccordion-header").attr("role", "tab");
            content.attr("role", "tabpanel");
            if(header.find("> a").length === 0) {
                header.wrapInner('<a href="#"></a>');
            }
            if(header.find("> .ui-icon").length === 0) {
                $('<span class="ui-icon"></span>').insertBefore($("> a", header)[0]);
            }
            if(index === o.selectedIndex) {
                header.addClass(this.options.wijCSS.stateActive).addClass(this._headerCornerOpened).attr({
                    "aria-expanded": "true",
                    tabIndex: 0
                }).find("> .ui-icon").addClass(this._triangleIconOpened);
                content.addClass("wijmo-wijaccordion-content-active").addClass(this._contentCornerOpened).wijTriggerVisibility();
            } else {
                header.addClass(o.wijCSS.stateDefault + " ui-corner-all").attr({
                    "aria-expanded": "false",
                    tabIndex: -1
                }).find("> .ui-icon").addClass(this._triangleIconClosed);
                content.hide();
            }
            content.addClass("wijmo-wijaccordion-content " + this.options.wijCSS.content);
        };
        wijaccordion.prototype._create = function () {
            var o = this.options;
            // enable touch support:
            if(window.wijmoApplyWijTouchUtilEvents) {
                $ = window.wijmoApplyWijTouchUtilEvents($);
            }
            this.element.addClass("wijmo-wijaccordion " + o.wijCSS.widget + " wijmo-wijaccordion-icons " + "ui-helper-clearfix");
            if(o.disabled) {
                this.element.addClass(o.wijCSS.stateDisabled);
            }
            this._onDirectionChange(o.expandDirection, false);
            this._initHeaders();
            this.element.attr("role", "tablist");
            //super._create(this, arguments);
            $.wijmo.widget.prototype._create.apply(this, arguments);
        };
        wijaccordion.prototype._init = function () {
            this._bindLiveEvents();
        };
        wijaccordion.prototype.destroy = function () {
            var o = this.options;
            this._unbindLiveEvents();
            this.element.removeClass("wijmo-wijaccordion " + o.wijCSS.widget + " wijmo-wijaccordion-icons").removeAttr("role");
            $.wijmo.widget.prototype.destroy.apply(this, arguments);
        };
        wijaccordion.prototype._getHeaders = function () {
            var o = this.options, rightToLeft = this.element.data("rightToLeft"), headersArr = [], i, hdr;
            var headers = this.element.find(o.header);
            if(headers.length > 0 && !$(headers[0]).hasClass("wijmo-wijaccordion-header") && $(headers[0]).hasClass("wijmo-wijaccordion-content")) {
                for(i = 0; i < headers.length; i += 1) {
                    // fix for 29695:
                    hdr = rightToLeft ? $(headers[i]).next(".wijmo-wijaccordion-header") : $(headers[i]).prev(".wijmo-wijaccordion-header");
                    if(hdr.length > 0) {
                        headersArr.push(hdr[0]);
                    }
                }
            } else {
                return headers;
            }
            return $(headersArr);
        };
        wijaccordion.prototype.activate = /// <summary>
        /// Activates the accordion content pane at the specified index.
        ///You can use code like in the example below inside your document ready function
        /// to activate the specified pane using the click event of a button.
        /// </summary>
        /// <param name="index" type="Number">
        ///	The zero-based index of the accordion pane to activate.
        ///	</param>
        function (index) {
            var nextHeader, o = this.options, headers = this._getHeaders(), prevHeader, rightToLeft = this.element.data("rightToLeft"), newIndex, prevIndex, nextContent, prevContent, animOptions, proxied, proxiedDuration, animations, duration, easing;
            prevHeader = $(jQuery.grep(headers, function (a) {
                return $(a).hasClass(o.wijCSS.stateActive);
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
            if(nextHeader.hasClass(o.wijCSS.stateDisabled)) {
                return false;
            }
            if(nextHeader.hasClass(o.wijCSS.stateActive)) {
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
            nextContent = rightToLeft ? nextHeader.prev(".wijmo-wijaccordion-content") : nextHeader.next(".wijmo-wijaccordion-content");
            prevContent = rightToLeft ? prevHeader.prev(".wijmo-wijaccordion-content") : prevHeader.next(".wijmo-wijaccordion-content");
            if(prevHeader.length === 0 && nextHeader.length === 0) {
                return false;
            }
            if(!this._trigger("beforeSelectedIndexChanged", null, {
                newIndex: newIndex,
                prevIndex: prevIndex
            })) {
                return false;
            }
            prevHeader.removeClass(o.wijCSS.stateActive).removeClass(this._headerCornerOpened).addClass(o.wijCSS.stateDefault + " ui-corner-all").attr({
                "aria-expanded": "false",
                tabIndex: -1
            }).find("> .ui-icon").removeClass(this._triangleIconOpened).addClass(this._triangleIconClosed);
            nextHeader.removeClass(o.wijCSS.stateDefault + " ui-corner-all").addClass(o.wijCSS.stateActive).addClass(this._headerCornerOpened).attr({
                "aria-expanded": "true",
                tabIndex: 0
            }).find("> .ui-icon").removeClass(this._triangleIconClosed).addClass(this._triangleIconOpened);
            if(o.animated) {
                animOptions = {
                    toShow: nextContent,
                    toHide: prevContent,
                    complete: jQuery.proxy(function () {
                        prevContent.removeClass("wijmo-wijaccordion-content-active");
                        nextContent.addClass("wijmo-wijaccordion-content-active").wijTriggerVisibility();
                        prevContent.css('display', '');
                        nextContent.css('display', '');
                        if($.fn.wijlinechart) {
                            prevContent.find(".wijmo-wijlinechart").wijlinechart("redraw")//?
                            ;
                            nextContent.find(".wijmo-wijlinechart").wijlinechart("redraw")//?
                            ;
                        }
                        //prevContent.wijTriggerVisibility();
                        //nextContent.wijTriggerVisibility();
                        this._trigger("selectedIndexChanged", null, {
                            newIndex: newIndex,
                            prevIndex: prevIndex
                        });
                    }, this),
                    horizontal: this.element.hasClass("ui-helper-horizontal"),
                    rightToLeft: this.element.data("rightToLeft"),
                    down: (newIndex > prevIndex),
                    autoHeight: o.autoHeight || o.fillSpace
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
                    prevContent.hide().removeClass("wijmo-wijaccordion-content-active");
                }
                if(nextHeader.length > 0) {
                    nextContent.show().addClass("wijmo-wijaccordion-content-active").addClass(this._contentCornerOpened).wijTriggerVisibility();
                }
                if($.fn.wijlinechart) {
                    prevContent.find(".wijmo-wijlinechart").wijlinechart("redraw")//?
                    ;
                    nextContent.find(".wijmo-wijlinechart").wijlinechart("redraw")//?
                    ;
                }
                //prevContent.wijTriggerVisibility();
                //nextContent.wijTriggerVisibility();
                this._trigger("selectedIndexChanged", null, {
                    newIndex: newIndex,
                    prevIndex: prevIndex
                });
            }
            this.options.selectedIndex = newIndex;
        };
        wijaccordion.prototype._bindLiveEvents = /** Private methods */
        function () {
            var self = this;
            this.element.on(this.options.event + ".wijaccordion", ".wijmo-wijaccordion-header", jQuery.proxy(this._onHeaderClick, this)).on("keydown.wijaccordion", ".wijmo-wijaccordion-header", jQuery.proxy(this._onHeaderKeyDown, this)).on("mouseenter.wijaccordion", ".wijmo-wijaccordion-header", function () {
                $(this).addClass('ui-state-hover');
            }).on("mouseleave.wijaccordion", ".wijmo-wijaccordion-header", function () {
                $(this).removeClass('ui-state-hover');
            }).on("focus.wijaccordion", ".wijmo-wijaccordion-header", function () {
                $(this).addClass(self.options.wijCSS.stateFocus);
            }).on("blur.wijaccordion", ".wijmo-wijaccordion-header", function () {
                $(this).removeClass(self.options.wijCSS.stateFocus);
            });
        };
        wijaccordion.prototype._unbindLiveEvents = function () {
            this.element.off(".wijaccordion", ".wijmo-wijaccordion-header");
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
            var keyCode = $.ui.keyCode, focusedHeader = this.element.find(".wijmo-wijaccordion-header." + this.options.wijCSS.stateFocus), focusedInd, headers = this._getHeaders();
            if(focusedHeader.length > 0) {
                focusedInd = $(".wijmo-wijaccordion-header", this.element).index(focusedHeader);
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
                openedHeaders = this.element.find(".wijmo-wijaccordion-header." + this._headerCornerOpened);
                openedHeaders.removeClass(this._headerCornerOpened);
                openedContents = this.element.find(".wijmo-wijaccordion-content." + this._contentCornerOpened);
                openedContents.removeClass(this._contentCornerOpened);
                openedTriangles = this.element.find("." + this._triangleIconOpened);
                closedTriangles = this.element.find("." + this._triangleIconClosed);
                openedTriangles.removeClass(this._triangleIconOpened);
                closedTriangles.removeClass(this._triangleIconClosed);
            }
            if(prevDirection !== null) {
                this.element.removeClass("wijmo-wijaccordion-" + prevDirection);
            }
            switch(newDirection) {
                case "top":
                    this._headerCornerOpened = "ui-corner-bottom";
                    this._contentCornerOpened = "ui-corner-top";
                    this._triangleIconOpened = o.wijCSS.iconArrowUp;
                    this._triangleIconClosed = o.wijCSS.iconArrowRight;
                    rightToLeft = true;
                    this.element.removeClass("ui-helper-horizontal");
                    this.element.addClass("wijmo-wijaccordion-top");
                    break;
                case "right":
                    this._headerCornerOpened = "ui-corner-left";
                    this._contentCornerOpened = "ui-corner-right";
                    this._triangleIconOpened = o.wijCSS.iconArrowRight;
                    this._triangleIconClosed = o.wijCSS.iconArrowDown;
                    rightToLeft = false;
                    this.element.addClass("ui-helper-horizontal");
                    this.element.addClass("wijmo-wijaccordion-right");
                    break;
                case "left":
                    this._headerCornerOpened = "ui-corner-right";
                    this._contentCornerOpened = "ui-corner-left";
                    this._triangleIconOpened = o.wijCSS.iconArrowLeft;
                    this._triangleIconClosed = o.wijCSS.iconArrowDown;
                    rightToLeft = true;
                    this.element.addClass("ui-helper-horizontal");
                    this.element.addClass("wijmo-wijaccordion-left");
                    break;
                default:
                    //bottom
                    this._headerCornerOpened = "ui-corner-top";
                    this._contentCornerOpened = "ui-corner-bottom";
                    this._triangleIconOpened = o.wijCSS.iconArrowDown;
                    this._triangleIconClosed = o.wijCSS.iconArrowRight;
                    rightToLeft = false;
                    this.element.removeClass("ui-helper-horizontal");
                    this.element.addClass("wijmo-wijaccordion-bottom");
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
                this.element.children(".wijmo-wijaccordion-header").each(function (index, elem) {
                    var header = $(this), content;
                    if(rightToLeft) {
                        content = header.next(".wijmo-wijaccordion-content");
                        header.remove();
                        header.insertAfter(content);
                    } else {
                        content = header.prev(".wijmo-wijaccordion-content");
                        header.remove();
                        header.insertBefore(content);
                    }
                });
            }
        };
        return wijaccordion;
    })(wijmo.wijmoWidget);
    wijmo.wijaccordion = wijaccordion;    
    ;
    wijaccordion.prototype.options = $.extend(true, {
    }, wijmo.wijmoWidget.prototype.options, {
        wijMobileCSS: {
            header: "ui-header ui-bar-a",
            content: "ui-body ui-body-c"
        },
        initSelector: /// <summary>
        /// Selector option for auto self initialization.
        ///	This option is internal.
        /// </summary>
        ":jqmData(role='wijaccordion')",
        animated: /// <summary>
        /// Sets the animation easing effect that users experience when they switch
        /// between panes. Set this option to false in order to disable easing. This
        /// results in a plain, abrupt shift from one pane to the next. You can also
        /// create custom easing animations using jQuery UI Easings.
        /// Options available for the animation function include:
        ///  down - If true, indicates that the index of the pane should be expanded
        ///			higher than the index of the pane that must be collapsed.
        ///  horizontal - If true, indicates that the accordion have a horizontal
        ///			orientation (when the expandDirection is left or right).
        ///  rightToLeft - If true, indicates that the content element is located
        ///			before the header element (top and left expand direction).
        ///  toShow - jQuery object that contains the content element(s) should be
        ///			shown.
        ///  toHide - jQuery object that contains the content element(s) should be
        ///			hidden.
        /// Type: String
        /// Default: "slide"
        /// Code example:
        /// Create your own animation:
        /// jQuery.wijmo.wijaccordion.animations.custom1 = function (options) {
        ///     this.slide(options, {
        ///     easing: options.down ? "easeOutBounce" : "swing",
        ///     duration: options.down ? 1000 : 200
        ///   });
        /// }
        ///  $("#accordion3").wijaccordion({
        ///      expandDirection: "right",
        ///      animated: "custom1"
        ///  });
        /// </summary>
        'slide',
        duration: /// <summary>
        /// The animation duration in milliseconds. By default, the animation duration value
        /// depends on an animation effect specified by the animation option.
        /// Type: Number
        /// Default: null
        /// Code example:
        ///  $("#accordion3").wijaccordion({
        ///      duration: 1000
        ///  });
        /// </summary>
        null,
        event: /// <summary>
        /// Determines the event that triggers the accordion to change panes.
        /// To select multiple events, separate them by a space. Supported events include:.
        ///		focus -- The pane opens when you click its header.
        ///		click (default) -- The pane opens when you click its header.
        ///		dblclick -- The pane opens when you double-click its header.
        ///		mousedown -- The pane opens when you press the mouse button over its header.
        ///		mouseup -- The pane opens when you release the mouse button over its header.
        ///		mousemove -- The pane opens when you move the mouse pointer into its header.
        ///		mouseover -- The pane opens when you hover the mouse pointer over its header.
        ///		mouseout -- The pane opens when the mouse pointer leaves its header.
        ///		mouseenter -- The pane opens when the mouse pointer enters its header.
        ///		mouseleave -- The pane opens when the mouse pointer leaves its header.
        ///		select -- The pane opens when you select its header by clicking and then pressing Enter
        ///		submit -- The pane opens when you select its header by clicking and then pressing Enter.
        ///		keydown -- The pane opens when you select its header by clicking and then pressing any key.
        ///		keypress -- The pane opens when you select its header by clicking and then pressing any key.
        ///		keyup -- The pane opens when you select its header by clicking and then pressing and releasing any key.
        /// Type: String
        /// Default: "click"
        /// Code example:
        ///  $("#accordion3").wijaccordion({
        ///      event: "mouseover"
        ///  });
        /// </summary>
        "click",
        disabled: /// <summary>
        /// Determines whether the widget behavior is disabled. If set to true, the
        /// control appears dimmed and does not respond when clicked.
        /// Type: Boolean
        /// Default: false
        /// Code example:
        ///   $(".selector").wijaccordion({ disabled: true });
        /// </summary>
        false,
        expandDirection: /// <summary>
        /// Determines the direction in which the content area of the control expands.
        /// Available values include: top, right, bottom, and left.
        /// Type: String
        /// Default: "bottom"
        /// Code example:
        ///    $("#element").wijaccordion({ expandDirection: "right" });
        /// </summary>
        "bottom",
        header: /// <summary>
        /// Determines the selector for the header element. Set this option to put header and
        /// content elements inside the HTML tags of your choice.By default, the header is
        /// the first child after an <LI> element, and the content is the second child
        ///	html markup.
        /// Type: String
        /// Default: "> li > :first-child,> :not(li):even"
        /// Code example: $("#element").wijaccordion({ header: "h3" });
        /// </summary>
        "> li > :first-child,> :not(li):even",
        requireOpenedPane: /// <summary>
        /// Determines whether clicking a header closes the current pane before opening the new one.
        /// Setting this value to false causes the headers to act as toggles for opening and
        /// closing the panes, leaving all previously clicked panes open until you click them again.
        /// Type: Boolean
        /// Default: true
        /// Code example:
        ///    $("#element").wijaccordion({ requireOpenedPane: false });
        /// </summary>
        true,
        selectedIndex: /// <summary>
        /// Gets or sets the zero-based index of the accordion pane to show expanded initially.
        /// By default, the first pane is expanded. A setting of -1 specifies that no pane
        /// is expanded initially, if you also set the requireOpenedPane option to false.
        /// Type: Number
        /// Default: 0
        /// Code example:
        ///   $("#element").wijaccordion({ selectedIndex: 5 });
        /// </summary>
        0
    });
    /*
    Available Events:
    /// <summary>
    /// Occurs before an active accordion pane change.
    /// Return false or call event.preventDefault() in order to cancel event and
    ///	prevent the selectedIndex change.
    /// Type: Function
    /// Event type: wijaccordionbeforeselectedindexchanged
    /// Code example:
    /// Supply a callback function to handle the beforeSelectedIndexChanged
    ///	event as an option.
    /// $("#accordion").wijaccordion({
    ///		beforeSelectedIndexChanged: function (e, args) {
    ///			alert(args.prevIndex + "->" + args.newIndex);
    ///         ...
    /// }});
    /// Bind to the event by type: wijaccordionbeforeselectedindexchanged.
    /// $( "#accordion" ).bind( "wijaccordionbeforeselectedindexchanged", function(e, args) {
    ///			alert(args.prevIndex + "->" + args.newIndex);
    ///		...
    /// });
    /// </summary>
    /// <param name="e" type="Object">jQuery.Event object.</param>
    /// <param name="args" type="Object">
    /// Event arguments:
    ///	args.newIndex - Index of a pane that will be expanded.
    ///	args.prevIndex - Index of a pane that will be collapsed.
    ///	</param>
    beforeSelectedIndexChanged(e, args)
    
    /// <summary>
    /// Occurs when an active accordion pane changed.
    /// Type: Function
    /// Event type: wijaccordionselectedindexchanged
    /// Code example:
    /// Supply a callback function to handle the selectedIndexChanged
    ///	event as an option.
    /// $("#accordion").wijaccordion({
    ///		selectedIndexChanged: function (e, args) {
    ///			alert(args.prevIndex + "->" + args.newIndex);
    ///         ...
    /// }});
    /// Bind to the event by type: wijaccordionselectedindexchanged.
    /// $( "#accordion" ).bind( "wijaccordionselectedindexchanged", function(e, args) {
    ///			alert(args.prevIndex + "->" + args.newIndex);
    ///		...
    /// });
    /// </summary>
    /// <param name="e" type="Object">jQuery.Event object.</param>
    /// <param name="args" type="Object">
    /// Event arguments:
    ///	args.newIndex - Index of the activated pane.
    /// args.prevIndex - Index of the collapsed pane.
    ///	</param>
    selectedIndexChanged(e, args)
    
    */
    $.wijmo.registerWidget(widgetName, wijaccordion.prototype);
    $.extend($.wijmo.wijaccordion, {
        animations: {
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
                    var parts = ('' + $.css(options.toShow[0], prop)).match(/^([\d+-.]+)(.*)$/);
                    showProps[prop] = {
                        value: parts ? parts[1] : "0",
                        unit: parts ? (parts[2] || "px") : "px"
                    };
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
})(wijmo || (wijmo = {}));
