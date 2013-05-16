/*
 *
 * Wijmo Library 3.20131.4
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
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery;
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
            var o = this.options;
            // first button
            if(addFirstLast && o.pageIndex) {
                this.$ul.append(this._createPagerItem(false, o.firstPageText, 1, o.firstPageClass));
            }
            // previous button
            if(o.pageIndex) {
                this.$ul.append(this._createPagerItem(false, o.previousPageText, o.pageIndex, o.previousPageClass));
            }
            // next button
            if(o.pageIndex + 1 < o.pageCount) {
                this.$ul.append(this._createPagerItem(false, o.nextPageText, o.pageIndex + 2, o.nextPageClass));
            }
            // last button
            if(addFirstLast && (o.pageIndex + 1 < o.pageCount)) {
                this.$ul.append(this._createPagerItem(false, o.lastPageText, o.pageCount, o.lastPageClass));
            }
        };
        wijpager.prototype._createNumeric = function (addFirstLast) {
            var o = this.options, currentPage = o.pageIndex + 1, startPageNumber = 1, endPageNumber = Math.min(o.pageCount, o.pageButtonCount), i;
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
                    this.$ul.append(this._createPagerItem(false, o.firstPageText, 1, o.firstPageClass));
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
                    this.$ul.append(this._createPagerItem(false, o.lastPageText, o.pageCount, o.lastPageClass));
                }
            }
        };
        wijpager.prototype._createPagerItem = function (active, title, pageIndex, btnClass) {
            var btnContent, wijCSS = this.options.wijCSS, self = this, $li = $("<li />").addClass("wijmo-wijpager-button " + wijCSS.cornerAll).attr({
                "role": "tab",
                "aria-label": title,
                "title": title
            });
            if(active) {
                $li.addClass(wijCSS.stateActive).attr("aria-selected", "true");
            } else {
                $li.addClass(wijCSS.stateDefault).hover(function () {
                    if(!self.options.disabled) {
                        $(this).removeClass(wijCSS.stateDefault).addClass(wijCSS.stateHover);
                    }
                }, function () {
                    if(!self.options.disabled) {
                        $(this).removeClass(wijCSS.stateHover).addClass(wijCSS.stateDefault);
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
            var eventArg = {
                newPageIndex: arg.data.newPageIndex,
                handled: false
            };
            if(this._trigger("pageIndexChanging", null, eventArg) !== false) {
                if(this.options.pageIndex !== eventArg.newPageIndex) {
                    this.options.pageIndex = eventArg.newPageIndex;
                    if(!eventArg.handled) {
                        this._refresh();
                    }
                    this._trigger("pageIndexChanged", null, {
                        newPageIndex: eventArg.newPageIndex
                    });
                }
            }
            return false;
        };
        return wijpager;
    })(wijmo.wijmoWidget);
    wijmo.wijpager = wijpager;    
    wijpager.prototype.widgetEventPrefix = "wijpager";
    wijpager.prototype.options = $.extend(true, {
    }, wijmo.wijmoWidget.prototype.options, {
        wijMobileCSS: {
            header: "ui-header ui-bar-a",
            content: "ui-body-c",
            stateDefault: "ui-btn-up-c",
            stateHover: "ui-btn-down-b",
            stateActive: "ui-btn-down-c"
        },
        firstPageClass: /// <summary>
        /// The class of the first-page button.
        /// Default: ui-icon-seek-first.
        /// Type: String
        /// Code example: $("#element").wijpager( { firstButtonClass: "ui-icon-seek-first" } );
        /// </summary>
        $.wijmo.widget.prototype.options.wijCSS.iconSeekFirst,
        firstPageText: /// <summary>
        /// The text to display for the first-page button.
        /// Default: "First".
        /// Type: String
        /// Code example: $("#element").wijpager( { firstPageText: "First" } );
        /// </summary>
        "First",
        lastPageClass: /// <summary>
        /// The class of the last-page button.
        /// Default: ui-icon-seek-end.
        /// Type: String
        /// Code example: $("#element").wijpager( { lastPageClass: "ui-icon-seek-end" } );
        /// </summary>
        $.wijmo.widget.prototype.options.wijCSS.iconSeekEnd,
        lastPageText: /// <summary>
        /// The text to display for the last-page button.
        /// Default: "Last".
        /// Type: String
        /// Code example: $("#element").wijpager( { lastPageText: "Last" } );
        /// </summary>
        "Last",
        mode: /// <summary>
        /// Determines the pager mode. Possible values are: "nextPrevious", "nextPreviousFirstLast", "numeric", "numericFirstLast".
        ///
        /// "nextPrevious" - a set of pagination controls consisting of Previous and Next buttons.
        /// "nextPreviousFirstLast" - a set of pagination controls consisting of Previous, Next, First, and Last buttons.
        /// "numeric" - a set of pagination controls consisting of numbered link buttons to access pages directly.
        /// "numericFirstLast" - a set of pagination controls consisting of numbered and First and Last link buttons.
        ///
        /// Default: "numeric".
        /// Type: String
        /// Code example: $("#element").wijpager( { mode: "numeric" } );
        /// </summary>
        "numeric",
        nextPageClass: /// <summary>
        /// The class of the next-page button.
        /// Default: ui-icon-seek-next.
        /// Type: String
        /// Code example: $("#element").wijpager( { nextPageClass: "ui-icon-seek-next" } );
        /// </summary>
        $.wijmo.widget.prototype.options.wijCSS.iconSeekNext,
        nextPageText: /// <summary>
        /// The text to display for the next-page button.
        /// Default: "Next".
        /// Type: String
        /// Code example: $("#element").wijpager( { nextPageText: "Next" } );
        /// </summary>
        "Next",
        pageButtonCount: /// <summary>
        /// The number of page buttons to display in the pager.
        /// Default: 10.
        /// Type: Number.
        /// Code example: $("#element").wijpager( { pageButtonCount: 10 } );
        /// </summary>
        10,
        previousPageClass: /// <summary>
        /// The class of the previous-page button.
        /// Default: ui-icon-seek-prev.
        /// Type: String
        /// Code example: $("#element").wijpager( { previousPageClass: "ui-icon-seek-prev" } );
        /// </summary>
        $.wijmo.widget.prototype.options.wijCSS.iconSeekPrev,
        previousPageText: /// <summary>
        /// The text to display for the previous-page button.
        /// Default: "Previous".
        /// Type: String
        /// Code example: $("#element").wijpager( { previousPageText: "Previous" } );
        /// </summary>
        "Previous",
        pageCount: /// <summary>
        /// Total number of pages.
        /// Default: 1.
        /// Type: Number.
        /// Code example: $("#element").wijpager( { pageCount: 1 } );
        /// </summary>
        1,
        pageIndex: /// <summary>
        /// The zero-based index of the current page.
        /// Default: 0.
        /// Type: Number.
        /// Code example: $("#element").wijpager( { pageIndex: 0 } );
        /// </summary>
        0,
        pageIndexChanging: /// <summary>
        /// pageIndexChanging event handler. A function called when page index is changing. Cancellable.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the pageIndexChanging event:
        /// $("#element").wijpager({ pageIndexChanging: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijpagerpageindexchanging", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data whith this event.
        /// args.newPageIndex - new page index.
        /// </param>
        null,
        pageIndexChanged: /// <summary>
        /// pageIndexChanged event handler. A function called when the page index is changed.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the pageIndexChanged event:
        /// $("#element").wijpager({ pageIndexChanged: function (e) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijpagerpageindexchanged", function (e) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        null
    });
    $.wijmo.registerWidget("wijpager", wijpager.prototype);
})(wijmo || (wijmo = {}));
