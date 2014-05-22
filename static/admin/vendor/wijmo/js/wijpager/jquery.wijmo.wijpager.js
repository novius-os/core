/*
 *
 * Wijmo Library 3.20141.34
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
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
    /*globals jQuery*/
    /*jslint white: false */
    /*
    * Depends:
    *  jquery-1.9.1.js
    *  jquery.ui.core.js
    *  jquery.ui.widget.js
    *  jquery.wijmo.widget.js
    */
    (function (pager) {
        "use strict";
        var $ = jQuery;
        /** @widget */
        var wijpager = (function (_super) {
            __extends(wijpager, _super);
            function wijpager() {
                _super.apply(this, arguments);

            }
            wijpager.prototype._create = function () {
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                this.element.addClass(this.options.wijCSS.widget + " wijmo-wijpager " + this.options.wijCSS.helperClearFix);
                if(this.options.disabled) {
                    this.disable();
                }
                this._refresh();
            };
            wijpager.prototype._destroy = function () {
                this.element.removeClass(this.options.wijCSS.widget + " wijmo-wijpager " + this.options.wijCSS.helperClearFix);
                this.$ul.remove();
            };
            wijpager.prototype._setOption = function (key, value) {
                this._super(key, value);
                this._refresh();
            };
            wijpager.prototype._refresh = function () {
                this._validate();
                if(this.$ul) {
                    this.$ul.remove();
                }
                this.element.append(this.$ul = $("<ul class=\"ui-list " + this.options.wijCSS.cornerAll + " " + this.options.wijCSS.content + " " + this.options.wijCSS.helperClearFix + "\" role=\"tablist\"></ul>"));
                switch((this.options.mode || "").toLowerCase()) {
                    case "nextprevious":
                        this._createNextPrev(false);
                        break;
                    case "nextpreviousfirstlast":
                        this._createNextPrev(true);
                        break;
                    case "numeric":
                        this._createNumeric(false);
                        break;
                    case "numericfirstlast":
                        this._createNumeric(true);
                        break;
                }
            };
            wijpager.prototype._validate = function () {
                var o = this.options;
                if(isNaN(o.pageCount) || o.pageCount < 1) {
                    o.pageCount = 1;
                }
                if(isNaN(o.pageIndex) || o.pageIndex < 0) {
                    o.pageIndex = 0;
                } else {
                    if(o.pageIndex >= o.pageCount) {
                        o.pageIndex = o.pageCount - 1;
                    }
                }
                if(isNaN(o.pageButtonCount) || o.pageButtonCount < 1) {
                    o.pageButtonCount = 1;
                }
            };
            wijpager.prototype._createNextPrev = function (addFirstLast) {
                var o = this.options, firstPageClass = !!o.firstPageClass ? o.firstPageClass + " " + o.wijCSS.iconSeekFirst : "", previousPageClass = !!o.previousPageClass ? o.previousPageClass + " " + o.wijCSS.iconSeekPrev : "", nextPageClass = !!o.nextPageClass ? o.nextPageClass + " " + o.wijCSS.iconSeekNext : "", lastPageClass = !!o.lastPageClass ? o.lastPageClass + " " + o.wijCSS.iconSeekEnd : "";
                // first button
                if(addFirstLast && o.pageIndex) {
                    this.$ul.append(this._createPagerItem(false, o.firstPageText, 1, firstPageClass));
                }
                // previous button
                if(o.pageIndex) {
                    this.$ul.append(this._createPagerItem(false, o.previousPageText, o.pageIndex, previousPageClass));
                }
                // next button
                if(o.pageIndex + 1 < o.pageCount) {
                    this.$ul.append(this._createPagerItem(false, o.nextPageText, o.pageIndex + 2, nextPageClass));
                }
                // last button
                if(addFirstLast && (o.pageIndex + 1 < o.pageCount)) {
                    this.$ul.append(this._createPagerItem(false, o.lastPageText, o.pageCount, lastPageClass));
                }
            };
            wijpager.prototype._createNumeric = function (addFirstLast) {
                var o = this.options, currentPage = o.pageIndex + 1, startPageNumber = 1, endPageNumber = Math.min(o.pageCount, o.pageButtonCount), i, firstPageClass = !!o.firstPageClass ? o.firstPageClass + " " + o.wijCSS.iconSeekFirst : "", lastPageClass = !!o.lastPageClass ? o.lastPageClass + " " + o.wijCSS.iconSeekEnd : "";
                if(currentPage > endPageNumber) {
                    startPageNumber = (Math.floor(o.pageIndex / o.pageButtonCount)) * o.pageButtonCount + 1;
                    endPageNumber = startPageNumber + o.pageButtonCount - 1;
                    endPageNumber = Math.min(endPageNumber, o.pageCount);
                    if(endPageNumber - startPageNumber + 1 < o.pageButtonCount) {
                        startPageNumber = Math.max(1, endPageNumber - o.pageButtonCount + 1);
                    }
                }
                // first + "..." buttons
                if(startPageNumber !== 1) {
                    // first button
                    if(addFirstLast) {
                        this.$ul.append(this._createPagerItem(false, o.firstPageText, 1, firstPageClass));
                    }
                    // "..." button
                    this.$ul.append(this._createPagerItem(false, "...", startPageNumber - 1, ""));
                }
                // page numbers buttons
                for(i = startPageNumber; i <= endPageNumber; i++) {
                    this.$ul.append(this._createPagerItem(i === currentPage, i.toString(), i, ""));
                }
                // "..." + last buttons
                if(o.pageCount > endPageNumber) {
                    this.$ul.append(this._createPagerItem(false, "...", endPageNumber + 1, ""));
                    // last button
                    if(addFirstLast) {
                        this.$ul.append(this._createPagerItem(false, o.lastPageText, o.pageCount, lastPageClass));
                    }
                }
            };
            wijpager.prototype._createPagerItem = function (active, title, pageIndex, btnClass) {
                var btnContent, wijCSS = this.options.wijCSS, self = this, $li = $("<li />").addClass(wijCSS.pagerButton + " " + wijCSS.cornerAll).attr({
                    "role": "tab",
                    "aria-label": title,
                    "title": title
                });
                if(active) {
                    $li.addClass(wijCSS.stateActive).attr("aria-selected", "true");
                } else {
                    $li.addClass(wijCSS.stateDefault).hover(function () {
                        if(!self.options.disabled) {
                            $(this).addClass(wijCSS.stateHover);
                        }
                    }, function () {
                        if(!self.options.disabled) {
                            $(this).removeClass(wijCSS.stateHover);
                        }
                    }).bind("click." + this.widgetName, {
                        newPageIndex: pageIndex - 1
                    }, $.proxy(this._onClick, this))// pageIndex is 1-based.
                    ;
                }
                if(active) {
                    btnContent = $("<span />");
                } else {
                    btnContent = btnClass ? $("<span />").addClass(wijCSS.icon + " " + btnClass) : $("<a/>").attr("href", "#");
                }
                btnContent.text(title);
                $li.append(btnContent);
                return $li;
            };
            wijpager.prototype._onClick = function (arg) {
                if(this.options.disabled) {
                    return false;
                }
                var pagingArgs = {
                    newPageIndex: arg.data.newPageIndex,
                    handled: false
                };
                if(this._trigger("pageIndexChanging", null, pagingArgs) !== false) {
                    if(this.options.pageIndex !== pagingArgs.newPageIndex) {
                        this.options.pageIndex = pagingArgs.newPageIndex;
                        if(!pagingArgs.handled) {
                            this._refresh();
                        }
                        var pagedArgs = {
                            newPageIndex: pagingArgs.newPageIndex
                        };
                        this._trigger("pageIndexChanged", null, pagedArgs);
                    }
                }
                return false;
            };
            return wijpager;
        })(wijmo.wijmoWidget);
        pager.wijpager = wijpager;        
        wijpager.prototype.widgetEventPrefix = "wijpager";
        var wijpager_options = (function () {
            function wijpager_options() {
                /** @ignore */
                this.wijCSS = {
                    pagerButton: "wijmo-wijpager-button"
                };
                /** @ignore */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-b",
                    stateDefault: "ui-btn ui-btn-b",
                    stateHover: "ui-btn-down-b",
                    stateActive: "ui-btn-down-c"
                };
                /**
                * An option that indicates the class of the first-page button. You can set this option with any of the jQuery UI CSS Framework icons.
                * @default "ui-icon-seek-first"
                * @example
                * // Here's the general way you'll set the option:
                * $("#element").wijpager({
                *    firstPageClass: "ui-icon-seek-first"
                * });
                */
                this.firstPageClass = $.wijmo.widget.prototype.options.wijCSS.iconSeekFirst;
                /**
                * An option that indicates the text to display for the first-page button. The text will display like a tooltip when a user hovers over the first-page button.
                * @example
                * // Here's the general way you'll set the option:
                * $("#element").wijpager({
                *    firstPageText: "Go To First"
                * });
                */
                this.firstPageText = "First";
                /**
                * An option that indicates the class of the last-page button. You can set this option with any of the jQuery UI CSS Framework icons.
                * @default "ui-icon-seek-end"
                * @example
                * // Here's the general way you'll set the option:
                * $("#element").wijpager({
                *    lastPageClass: "ui-icon-seek-end"
                * });
                */
                this.lastPageClass = $.wijmo.widget.prototype.options.wijCSS.iconSeekEnd;
                /**
                * An option that indicates the text to display for the last-page button. The text will display like a tooltip when a user hovers over the last-page button.
                * @example
                * // Here's the general way you'll set the option:
                * $("#element").wijpager({
                *   lastPageText: "Go To Last"
                * });
                */
                this.lastPageText = "Last";
                /**
                * This option determines the pager mode. The possible values for this option are: "nextPrevious", "nextPreviousFirstLast", "numeric", "numericFirstLast".
                * @remarks
                * Possible values are: "nextPrevious", "nextPreviousFirstLast", "numeric", "numericFirstLast".
                * "nextPrevious": a set of pagination controls consisting of Previous and Next buttons.
                * "nextPreviousFirstLast": a set of pagination controls consisting of Previous, Next, First, and Last buttons.
                * "numeric": a set of pagination controls consisting of numbered link buttons to access pages directly.
                * "numericFirstLast": a set of pagination controls consisting of numbered and First and Last link buttons.
                * @example
                * // Here's the general way you'll set the option:
                * $("#element").wijpager({
                *    mode: "nextPrevious"
                * });
                */
                this.mode = "numeric";
                /**
                * An option that indicates the class of the next-page button. You can set this option with any of the jQuery UI CSS Framework Icons.
                * @default "ui-icon-seek-next"
                * @example
                * // Here's the general way you'll set the option:
                * $("#element").wijpager({
                *    nextPageClass: "ui-icon-seek-next"
                * });
                */
                this.nextPageClass = $.wijmo.widget.prototype.options.wijCSS.iconSeekNext;
                /**
                * An option that indicates the text to display for the next-page button. The text appears like a tooltip when a user hovers over the next-page button.
                * @example
                * // Here's the general way you'll set the option:
                * $("#element").wijpager({
                *    nextPageText: "Go To Next"
                * });
                */
                this.nextPageText = "Next";
                /**
                * An option that indicates the number of page buttons to display in the pager. You can customize how many page buttons are available for your users to use to page through content.
                * You can use this option in conjunction with the pageCount to customize the pager display.
                * @example
                * // Here's the general way you'll set the option:
                * $("#element").wijpager({
                *    pageButtonCount: 15
                * });
                */
                this.pageButtonCount = 10;
                /**
                * An option that indicates the class of the previous-page button. You can set this option with any of the jQuery UI CSS Framework Icons.
                * @type {string}
                * @default "ui-icon-seek-prev"
                * @example
                * // Here's the general way you'll set the option:
                * $("#element").wijpager({
                *    previousPageClass: "ui-icon-seek-prev"
                * });
                */
                this.previousPageClass = $.wijmo.widget.prototype.options.wijCSS.iconSeekPrev;
                /**
                * An option that indicates the text to display for the previous-page button. The text appears like a tooltip when a user hovers over the previous-page button.
                * @example
                * // Here's the general way you'll set the option:
                * $("#element").wijpager({
                *    previousPageText: "Go To Previous"
                * });
                */
                this.previousPageText = "Previous";
                /**
                * An option that indicates the total number of pages. This option allows you to customize the total number of pages that your users will be able to page through. You can use this option in conjunction with the pageButtonCount to customize the pager display.
                * @example
                * // Here's the general way you'll set the option:
                * $("#element").wijpager({
                *    pageCount: 10
                * });
                */
                this.pageCount = 1;
                /**
                * An option that indicates the zero-based index of the current page. By default, your pager will display with the first pager button highlighted since its index is 0.
                * @example
                * // Here's the general way you'll set the option. This will allow your pager widget to display with the 3rd page button highlighted:
                * $("#element").wijpager({
                *    pageIndex: 2
                * });
                */
                this.pageIndex = 0;
                /**
                * The pageIndexChanging event handler is a function called when page index is changing. This item is cancellable if you return false.
                * @event
                * @param {object} e The jQuery.Event object.
                * @param {wijmo.grid.IPageIndexChangingEventArgs} args The data associated with this event.
                * @example
                * // Supply a callback function to handle the event:
                * $("#element").wijpager({
                *    pageIndexChanging: function (e, args) {
                *       // Handle the event here.
                *    }
                * });
                
                * // Bind to the event by type:
                * $("#element").bind("wijpagerpageindexchanging", function (e, args) {
                *    // Handle the event here.
                * });
                *
                * // You can cancel this event be returning false:
                * $("#element").wijpager({
                *    pageIndexChanging: function(e, args) {
                *       return false;
                *    }
                * });
                */
                this.pageIndexChanging = null;
                /**
                * The pageIndexChanged event handler is a function called when the page index is changed.
                * @event
                * @param {object} e The jQuery.Event object.
                * @param {wijmo.grid.IPageIndexChangedEventArgs} args The data associated with this event.
                * @example
                * // Supply a callback function to handle the event:
                * $("#element").wijpager({
                *    pageIndexChanged: function (e, args) {
                *       // Handle the event here.
                *    }
                * });
                
                * // Bind to the event by type:
                * $("#element").bind("wijpagerpageindexchanged", function (e, args) {
                *    // Handle the event here.
                * });
                *
                * // You can also use this event to get the selected page by using the args.newPageIndex parameter:
                * $("#element").wijpager({
                *    pageIndexChanged: function(e, args) {
                *       var selectedPageIndex = args.newPageIndex;
                *    }
                * });
                */
                this.pageIndexChanged = null;
            }
            return wijpager_options;
        })();        
        ;
        wijpager.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijpager_options());
        $.wijmo.registerWidget("wijpager", wijpager.prototype);
        ;
    })(wijmo.pager || (wijmo.pager = {}));
    var pager = wijmo.pager;
})(wijmo || (wijmo = {}));
