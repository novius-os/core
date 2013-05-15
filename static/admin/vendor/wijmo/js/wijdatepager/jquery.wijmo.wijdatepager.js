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
/// <reference path="../external/declarations/globalize.d.ts" />
/// <reference path="../Base/jquery.wijmo.widget.ts" />
/// <reference path="../wijpopup/jquery.wijmo.wijpopup.ts" />
/*globals jQuery,$,window,alert,document,confirm,location,setTimeout, Globalize,
clearTimeout,amplify*/
/*jslint white: false */
/*jslint nomen: false*/
/*
* Depends:
*  jquery.ui.core.js
*  jquery.ui.widget.js
*  globalize.js
*  jquery.wijmo.wijpopup.js
*  jquery.ui.wijutil.js
*
*/
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery, widgetName = "wijdatepager";
    var wijdatepager = (function (_super) {
        __extends(wijdatepager, _super);
        function wijdatepager() {
            _super.apply(this, arguments);

        }
        wijdatepager.prototype._setOption = function (key, value) {
            $.wijmo.widget.prototype._setOption.apply(this, arguments);
            switch(key) {
                case "culture":
                    this.options.culture = value;
                    this._initBackground();
                    break;
                case "selectedDate":
                    this.options.selectedDate = value;
                    this._initBackground();
                    break;
                case "disabled":
                    if(value) {
                        this._disable();
                    } else {
                        this._enable();
                    }
                    break;
                case "viewType":
                    this.options.viewType = value;
                    this._initBackground();
                    break;
                case "nextTooltip":
                    //this.element.find(".wijmo-wijdatepager-increment").text(value).button("refresh");
                    this.element.find(".wijmo-wijdatepager-increment").attr("title", value);
                    break;
                case "prevTooltip":
                    //this.element.find(".wijmo-wijdatepager-decrement").text(value).button("refresh");
                    this.element.find(".wijmo-wijdatepager-decrement").attr("title", value);
                    break;
            }
            return this;
        };
        wijdatepager.prototype._disable = function () {
            this.element.addClass(this.options.wijCSS.stateDisabled);
            this.element.find(".wijmo-wijdatepager-decrement").button("option", "disabled", true);
            this.element.find(".wijmo-wijdatepager-increment").button("option", "disabled", true);
        };
        wijdatepager.prototype._enable = function () {
            this.element.removeClass(this.options.wijCSS.stateDisabled);
            this.element.find(".wijmo-wijdatepager-decrement").button("option", "disabled", false);
            this.element.find(".wijmo-wijdatepager-increment").button("option", "disabled", false);
        };
        wijdatepager.prototype._create = ///	<summary>
        ///	Creates date pager DOM elements and binds interactive events.
        ///	</summary>
        function () {
            var o = this.options, resizeHandler, decBtn, incBtn;
            // enable touch support:
            if(window.wijmoApplyWijTouchUtilEvents) {
                $ = window.wijmoApplyWijTouchUtilEvents($);
            }
            if(!o.selectedDate) {
                o.selectedDate = new Date();
            }
            this._dtpagernamespacekey = "dtpager" + new Date().getTime();
            this.element.addClass("wijmo-wijdatepager " + o.wijCSS.widget + " ui-helper-clearfix");
            resizeHandler = $.proxy(this.invalidate, this);
            $(window).bind("resize." + this._dtpagernamespacekey, resizeHandler);
            if(this.element.disableSelection) {
                this.element.disableSelection();
            }
            this.element.append($("<a class=\"wijmo-wijdatepager-decrement\"><span>" + o.prevTooltip + "</span></a>")).append("<div class=\"wijmo-wijdatepager-container " + o.wijCSS.content + "\">" + "<div class=\"wijmo-wijdatepager-pages\"></div>" + "</div>" + "<a class=\"wijmo-wijdatepager-increment\"><span>" + o.nextTooltip + "</span></a>");
            $.wijmo.widget.prototype._create.apply(this, arguments);
            decBtn = this.element.find(".wijmo-wijdatepager-decrement");
            incBtn = this.element.find(".wijmo-wijdatepager-increment");
            if($.mobile == null) {
                decBtn.button({
                    icons: {
                        primary: "ui-icon-triangle-1-w"
                    },
                    text: false
                });
                incBtn.button({
                    icons: {
                        primary: "ui-icon-triangle-1-e"
                    },
                    text: false
                });
            } else {
                decBtn.html("");
                decBtn.attr("data-icon", "arrow-l");
                decBtn.button({
                    text: false
                });
                incBtn.html("");
                incBtn.attr("data-icon", "arrow-r");
                incBtn.button({
                    text: false
                });
            }
            decBtn.click($.proxy(this.goLeft, this));
            incBtn.click($.proxy(this.goRight, this));
            this._initBackground();
            if(o.disabled) {
                this._disable();
            }
        };
        wijdatepager.prototype.destroy = ///	<summary>
        ///	Destroys the widget and resets the DOM element.
        ///	</summary>
        function () {
            this.element.removeClass("wijmo-wijdatepager");
            $(window).unbind("." + this._dtpagernamespacekey);
        };
        wijdatepager.prototype.refresh = ///	<summary>
        ///	Refreshes the widget layout.
        ///	</summary>
        function () {
            this.invalidate();
        };
        wijdatepager.prototype.invalidate = ///	<summary>
        ///	Redraws the widget layout.
        ///	</summary>
        function () {
            var selectedPage, selectedDate = this.options.selectedDate, newIndex, container = this.element.find(".wijmo-wijdatepager-container"), decBtn = this.element.find(".wijmo-wijdatepager-decrement"), incBtn = this.element.find(".wijmo-wijdatepager-increment"), innerWidth = this.element.innerWidth(), decBtnW = decBtn.is(":visible") ? decBtn.outerWidth(true) : 0, incBtnW = incBtn.is(":visible") ? incBtn.outerWidth(true) : 0, pagesBg, pageLabels, pageWidth;
            selectedPage = this.element.find(".wijmo-wijdatepager-pagelabel." + this._getDateClass(selectedDate));
            if(selectedPage.length !== 1) {
                selectedPage = $(this.element.find(".wijmo-wijdatepager-pagelabel")[this._index]);
            } else {
                newIndex = this.element.find(".wijmo-wijdatepager-pagelabel").index(selectedPage);
                this._index = newIndex;
                /*
                if (this._index !== newIndex) {
                this._index = newIndex;
                }*/
                            }
            this.element.find(".wijmo-wijdatepager-pagelabel." + this.options.wijCSS.stateActive).removeClass(this.options.wijCSS.stateActive);
            selectedPage.addClass(this.options.wijCSS.stateActive);
            container.css("left", decBtnW);
            this.element.removeClass("wijmo-wijdatepager-width-smallest" + " wijmo-wijdatepager-width-small wijmo-wijdatepager-width-medium" + " wijmo-wijdatepager-width-normal");
            if(innerWidth < 300) {
                this.element.addClass("wijmo-wijdatepager-width-smallest");
            } else if(innerWidth < 475) {
                this.element.addClass("wijmo-wijdatepager-width-small");
            } else if(innerWidth < 600) {
                this.element.addClass("wijmo-wijdatepager-width-medium");
            } else {
                this.element.addClass("wijmo-wijdatepager-width-normal");
            }
            container.outerWidth(innerWidth - decBtnW - incBtnW);
            //ie6/7 don't support display: table and display: table-cell,
            //so set width to each page label.
            if($.browser.msie && parseInt($.browser.version, 10) <= 7) {
                pagesBg = this.element.find(".wijmo-wijdatepager-pages");
                pageLabels = pagesBg.find(".wijmo-wijdatepager-pagelabel");
                pageWidth = Math.round(pagesBg.width() / this._datesDef.length) - (pageLabels.outerWidth(true) - pageLabels.width());
                pageLabels.width(pageWidth);
            }
        };
        wijdatepager.prototype.goLeft = ///	<summary>
        ///	Selects the previous date.
        ///	</summary>
        function (ev) {
            var o = this.options;
            if(o.disabled) {
                return;
            }
            this._setSelectedIndex(this._index - 1, true);
            if(ev) {
                ev.preventDefault();
                return false;
            }
        };
        wijdatepager.prototype.goRight = ///	<summary>
        ///	Selects the next date.
        ///	</summary>
        function () {
            var o = this.options;
            if(o.disabled) {
                return;
            }
            this._setSelectedIndex(this._index + 1);
        };
        wijdatepager.prototype._getCulture = // culture:
        function (name) {
            if (typeof name === "undefined") { name = null; }
            return Globalize.findClosestCulture(name || this.options.culture);
        };
        wijdatepager.prototype._isRTL = function () {
            return !!this._getCulture().isRTL;
        };
        wijdatepager.prototype._initBackground = function (animate, isRightToLeft) {
            if (typeof animate === "undefined") { animate = false; }
            if (typeof isRightToLeft === "undefined") { isRightToLeft = false; }
            var s, i, oldBg, newBg, pageLabels, newPageIndPos, self = this, pageWidth;
            if(this._isInAnimate) {
                return;
            }
            this._index = 0;
            this._datesDef = this._getDatesDefinition();
            this._min = 0;
            this._max = this._datesDef.length - 1;
            s = "";
            for(i = 0; i < this._datesDef.length; i += 1) {
                s += "<div class=\"wijmo-wijdatepager-pagelabel" + (i === 0 ? " wijmo-wijdatepager-pagelabel-first" : "") + (this._datesDef[i].range ? " wijmo-wijdatepager-pagerange" : "") + (this._datesDef[i].header ? " wijmo-wijdatepager-pageheader ui-state-highlight" : "") + (i === this._datesDef.length - 1 ? " wijmo-wijdatepager-pagelabel-last" : "") + " " + this._getDateClass(this._datesDef[i].d) + "\">" + this._datesDef[i].l + "</div>";
            }
            newBg = this.element.find(".wijmo-wijdatepager-pages");
            if(animate) {
                this._isInAnimate = true;
                oldBg = newBg.clone(true);
                newBg.html(s);
                pageLabels = newBg.find(".wijmo-wijdatepager-pagelabel");
                if(!isRightToLeft) {
                    oldBg.insertBefore(newBg);
                    newPageIndPos = $(pageLabels[this._index]).offset().left;
                    newBg.css("opacity", 0).css("left", oldBg.outerWidth(true)).stop().animate({
                        left: "0px",
                        opacity: 100
                    });
                    oldBg.stop().animate({
                        left: "-" + oldBg.outerWidth(true) + "px",
                        opacity: 0
                    }, function () {
                        oldBg.remove();
                        self._isInAnimate = false;
                        self.invalidate();
                    });
                } else {
                    oldBg.insertAfter(newBg);
                    newPageIndPos = $(pageLabels[this._index]).offset().left;
                    newBg.css("opacity", 0).css("left", -oldBg.outerWidth(true)).stop().animate({
                        left: "0px",
                        opacity: 100
                    });
                    oldBg.css("left", 0).stop().animate({
                        left: oldBg.outerWidth(true) + "px",
                        opacity: 0
                    }, function () {
                        oldBg.remove();
                        self._isInAnimate = false;
                        self.invalidate();
                    });
                }
            } else {
                newBg.html(s);
                this.invalidate();
            }
            //.stop().animate({ left: "0px" })
            pageLabels = newBg.find(".wijmo-wijdatepager-pagelabel");
            pageLabels.hover($.proxy(this._pagelabelHover, this), $.proxy(this._pagelabelHout, this));
            pageLabels.bind("mousedown", $.proxy(this._pagelabelMouseDown, this));
            pageLabels.click($.proxy(function (e) {
                var target = $(e.target), ind;
                ind = this.element.find(".wijmo-wijdatepager-pagelabel").index(target);
                this._setSelectedIndex(ind);
            }, this));
        };
        wijdatepager.prototype._getDateClass = function (dt) {
            return "c1dt" + dt.getFullYear() + "_" + dt.getMonth() + "_" + dt.getDate();
        };
        wijdatepager.prototype._addDays = function (dt, num) {
            return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + num);
        };
        wijdatepager.prototype._getDatesDefinition = function () {
            var o = this.options, viewType = o.viewType.toLowerCase(), i, dt, curDt, nextDt, endDt, datesDef = [], selectedDate = o.selectedDate;
            switch(viewType) {
                case "week":
                    curDt = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), -6);
                    i = o.firstDayOfWeek - curDt.getDay();
                    if(Math.abs(i) > 6) {
                        i = curDt.getDay() - o.firstDayOfWeek;
                    }
                    curDt = this._addDays(curDt, i);
                    endDt = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 7);
                    i = 0;
                    while(curDt < endDt || curDt.getMonth() === selectedDate.getMonth()) {
                        nextDt = this._addDays(curDt, 7);
                        datesDef.push({
                            l: this._formatString(this.localizeString("weekViewLabelFormat", "{0:MMM dd}-{1:dd}"), curDt, this._addDays(curDt, 6)),
                            d: curDt,
                            d2: this._addDays(curDt, 6)
                        });
                        if(selectedDate >= curDt && selectedDate <= nextDt) {
                            this._index = i;
                        }
                        curDt = nextDt;
                        i += 1;
                    }
                    break;
                case "month":
                    dt = new Date(selectedDate.getFullYear() - 1, 0, 1);
                    datesDef.push({
                        l: dt.getFullYear(),
                        d: dt,
                        range: true
                    });
                    dt = new Date(selectedDate.getFullYear(), 0, 1);
                    datesDef.push({
                        l: dt.getFullYear(),
                        d: dt,
                        header: true
                    });
                    for(i = 0; i < 12; i += 1) {
                        dt = new Date(selectedDate.getFullYear(), i, 1);
                        datesDef.push({
                            l: this._formatString(this.localizeString("monthViewLabelFormat", "{0:MMM}"), dt),
                            d: dt
                        });
                        nextDt = new Date(selectedDate.getFullYear(), i + 1, 1);
                        if(selectedDate >= dt && selectedDate <= nextDt) {
                            this._index = i + 2;
                        }
                    }
                    dt = new Date(selectedDate.getFullYear() + 1, 0, 1);
                    datesDef.push({
                        l: dt.getFullYear(),
                        d: dt,
                        range: true
                    });
                    break;
                default:
                    //case "day":
                    dt = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0);
                    datesDef.push({
                        l: Globalize.format(dt, "MMM", this._getCulture()),
                        d: dt,
                        range: true
                    });
                    dt = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                    datesDef.push({
                        l: Globalize.format(dt, "MMM", this._getCulture()),
                        d: dt,
                        header: true
                    });
                    curDt = dt;
                    i = 2;
                    while(curDt.getMonth() === selectedDate.getMonth()) {
                        nextDt = new Date(curDt.getFullYear(), curDt.getMonth(), curDt.getDate() + 1);
                        datesDef.push({
                            l: this._formatString(this.localizeString("dayViewLabelFormat", "{0:d }"), curDt),
                            d: curDt
                        });
                        if(selectedDate >= curDt && selectedDate <= nextDt) {
                            this._index = i;
                        }
                        curDt = nextDt;
                        i += 1;
                    }
                    dt = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
                    datesDef.push({
                        l: Globalize.format(dt, "MMM", this._getCulture()),
                        d: dt,
                        range: true
                    });
                    break;
            }
            return datesDef;
        };
        wijdatepager.prototype._setSelectedIndex = function (ind, skipHeader) {
            if (typeof skipHeader === "undefined") { skipHeader = false; }
            var o = this.options, pendingSelectedDate;
            if(o.disabled) {
                return;
            }
            if(ind >= this._min && ind <= this._max) {
                if(this._dragActivated) {
                    this._showTooltip(ind);
                }
                if(this._index !== ind) {
                    if(this._datesDef[ind].header) {
                        if(skipHeader) {
                            ind = ind - 1;
                        } else {
                            return;
                        }
                    }
                    this._index = ind;
                    pendingSelectedDate = this._datesDef[ind].d;
                    o.selectedDate = pendingSelectedDate;
                    /*
                    if (this._index === this._max) {
                    if (o.viewType === "week") {
                    o.selectedDate = new Date(o.selectedDate.getFullYear(),
                    o.selectedDate.getMonth(), o.selectedDate.getDate() + 7);
                    }
                    }*/
                    if(this._max > 2 && this._index === 0) {
                        this._initBackground(true, true);
                    } else if(this._index === this._max) {
                        if(o.viewType === "week") {
                            o.selectedDate = new Date(o.selectedDate.getFullYear(), o.selectedDate.getMonth(), o.selectedDate.getDate() + 7);
                        }
                        this._initBackground(true, false);
                        o.selectedDate = pendingSelectedDate;
                    } else {
                        this.invalidate();
                    }
                    this._trigger("selectedDateChanged", null, {
                        selectedDate: o.selectedDate
                    });
                }
            }
        };
        wijdatepager.prototype._pagelabelHover = function (e) {
            var target = $(e.target), o = this.options;
            if(target.hasClass("wijmo-wijdatepager-pageheader")) {
                return;
            }
            target.addClass(o.wijCSS.stateHover);
        };
        wijdatepager.prototype._showTooltip = function (ind) {
            var o = this.options, dateDef = this._datesDef[ind], viewType = o.viewType, s, target = this.element.find(".wijmo-wijdatepager-pagelabel")[ind];
            if(!this._tooltip) {
                this._tooltip = $("<div class=\"wijmo-wijdatepager-tooltip\">" + "<div class=\"wijmo-wijdatepager-tooltip-inner\">" + "</div>" + "<div class=\"wijmo-wijdatepager-triangle\"></div>" + "</div>");
                this.element.append(this._tooltip);
                this._tooltip.wijpopup();
            }
            s = "";
            switch(viewType) {
                case "week":
                    if(dateDef.d.getMonth() !== dateDef.d2.getMonth()) {
                        s = this._formatString(this.localizeString("weekViewTooltip2MonthesFormat", "{0:MMMM d} - {1:MMMM d, yyyy}"), dateDef.d, dateDef.d2);
                    } else {
                        s = this._formatString(this.localizeString("weekViewTooltipFormat", "{0:MMMM d} - {1:d, yyyy}"), dateDef.d, dateDef.d2);
                    }
                    break;
                case "month":
                    s = this._formatString(this.localizeString("monthViewTooltipFormat", "{0:MMMM yyyy}"), dateDef.d);
                    break;
                default:
                    //case "day":
                    s = this._formatString(this.localizeString("dayViewTooltipFormat", "{0:dddd, MMMM d, yyyy}"), dateDef.d);
                    break;
                    break;
            }
            if($.ui) {
                //disable popup for mobile mode
                this._tooltip.wijpopup("show", {
                    of: target,
                    my: "center bottom",
                    at: "center top",
                    offset: "-10 -10"
                });
                this._tooltip.find(".wijmo-wijdatepager-tooltip-inner").html(s);
            }
            //Monday, 31st, 2001
            //
                    };
        wijdatepager.prototype._hideTooltip = function () {
            this._tooltip.wijpopup("hide");
        };
        wijdatepager.prototype._pagelabelHout = function (e) {
            $(e.target).removeClass(this.options.wijCSS.stateHover);
        };
        wijdatepager.prototype._pagelabelMouseDown = function (e) {
            this._dragActivated = false;
            if(this.options.disabled) {
                return;
            }
            e.preventDefault();
            var target = $(e.target), ind;
            if(target.hasClass("wijmo-wijdatepager-pageheader")) {
                return;
            }
            ind = this.element.find(".wijmo-wijdatepager-pagelabel").index(target);
            this._dragActivated = true;
            this._setSelectedIndex(ind);
            this._mouseDownTimeFix20555 = new Date().getTime();
            this._startClientX = e.pageX;
            this._startInd = ind;
            $(document).bind("mousemove." + this._dtpagernamespacekey, $.proxy(this._pageindicatorMouseMove, this));
            $(document).bind("mouseup." + this._dtpagernamespacekey, $.proxy(this._pageindicatorMouseUp, this));
        };
        wijdatepager.prototype._detectLeftButton = function (event) {
            if(event.originalEvent) {
                event = event.originalEvent;
            }
            if("buttons" in event) {
                return event.buttons === 1;
            } else if("which" in event) {
                return event.which === 1;
            } else {
                return event.button === 1;
            }
        };
        wijdatepager.prototype._pageindicatorMouseMove = function (e) {
            if(!this._detectLeftButton(e)) {
                this._pageindicatorMouseUp();
                return;
            }
            e.preventDefault();
            if(this._isInAnimate) {
                return;
            }
            var startPage = this.element.find(".wijmo-wijdatepager-pagelabel")[this._startInd], newPos, ind;
            if(!startPage) {
                return;
            }
            newPos = startPage.offsetLeft + Math.round(startPage.offsetWidth / 2) + (e.pageX - this._startClientX);
            ind = this._findClosesPageIndexByPos(newPos);
            if(this._prevMoveInd === ind) {
                // fix for [20534] case 1:
                return;
            }
            this._prevMoveInd = ind;
            if((this._mouseDownTimeFix20555 + 150) > new Date().getTime()) {
                // fix for [20555]
                return;
            }
            if(ind !== -1 && ind !== this._index) {
                this._setSelectedIndex(ind);
            }
            //this.element.find(".wijmo-wijdatepager-pagelabel").css(left;
                    };
        wijdatepager.prototype._pageindicatorMouseUp = function () {
            this._dragActivated = false;
            $(document).unbind("." + this._dtpagernamespacekey);
            this._hideTooltip();
        };
        wijdatepager.prototype._findClosesPageIndexByPos = function (pos) {
            var pagelabels = this.element.find(".wijmo-wijdatepager-pages").find(".wijmo-wijdatepager-pagelabel"), i;
            for(i = 0; i < pagelabels.length; i += 1) {
                if((pagelabels[i].offsetLeft) < pos && (pagelabels[i].offsetLeft + pagelabels[i].offsetWidth) > pos) {
                    return i;
                }
            }
            return -1;
        };
        wijdatepager.prototype.localizeString = ///
        function (key, defaultValue) {
            var o = this.options;
            if(o.localization && o.localization[key]) {
                return o.localization[key];
            }
            return defaultValue;
            //("buttonToday", "today")
                    };
        wijdatepager.prototype._formatString = function (fmt, arg0, arg1, arg2) {
            var r, args = arguments, i, funcArgs, self = this;
            if(args.length <= 1) {
                return Globalize.format(args);
            }
            if(typeof fmt === "string") {
                /*
                if (fmt === "_formatWeekTitle") {
                fmt = this._formatWeekTitle;
                }
                else if (fmt === "_formatMonthTitle") {
                fmt = this._formatMonthTitle;
                }
                else
                */
                if(typeof window[fmt] === "function") {
                    fmt = window[fmt];
                }
            }
            if(typeof fmt === "function") {
                funcArgs = [];
                for(i = 1; i < args.length; i += 1) {
                    funcArgs[i - 1] = args[i];
                }
                return fmt.apply(this, funcArgs);
            }
            r = new RegExp("\\{(\\d+)(?:,([-+]?\\d+))?(?:\\:" + "([^(^}]+)(?:\\(((?:\\\\\\)|[^)])+)\\)){0,1}){0,1}\\}", "g");
            return fmt.replace(r, function (m, num, len, f, params) {
                m = args[Number(num) + 1];
                if(f) {
                    return Globalize.format(m, f, self._getCulture());
                } else {
                    return m;
                }
            });
        };
        return wijdatepager;
    })(wijmo.wijmoWidget);
    wijmo.wijdatepager = wijdatepager;    
    wijdatepager.prototype.options = $.extend(true, {
    }, wijmo.wijmoWidget.prototype.options, {
        wijMobileCSS: {
            header: "ui-header ui-bar-a",
            content: "ui-body ui-body-c",
            stateDefault: "ui-btn-up-c"
        },
        initSelector: /// <summary>
        /// Selector option for auto self initialization.
        ///	This option is internal.
        /// </summary>
        ":jqmData(role='wijdatepager')",
        culture: ///	<summary>
        ///	Culture name, e.g. "de-DE".
        /// Type:String.
        /// Default:"".
        /// Code Example:
        /// This markup sets the culture to German:
        ///		$("#element").wijdatepager( { culture: "de-DE" } );
        ///	</summary>
        "",
        localization: ///<summary>
        ///	Use the localization option in order to provide custom localization.
        ///	Default: {
        ///	dayViewTooltipFormat: "{0:dddd, MMMM d, yyyy}",
        ///	weekViewTooltipFormat: "{0:MMMM d} - {1:d, yyyy}",
        ///	weekViewTooltip2MonthesFormat: "{0:MMMM d} - {1:MMMM d, yyyy}",
        ///	monthViewTooltipFormat: "{0:MMMM yyyy}",
        ///	dayViewLabelFormat": "{0:d }",
        ///	weekViewLabelFormat: "{0:MMM dd}-{1:dd}",
        ///	monthViewLabelFormat: "{0:MMM}"
        ///	}
        /// Type: Object.
        /// Code example: $("#datepager").wijdatepager(
        ///					{
        ///						localization: {
        ///							weekViewTooltip2MonthesFormat: "{0:MMMM d} - {1:MMMM d}",
        ///							dayViewTooltipFormat: "{0:dddd, MMMM d}"
        ///						}
        ///					});
        ///</summary>
        null,
        firstDayOfWeek: /// <summary>
        /// The first day of the week (from 0 to 6).
        ///	Sunday is 0, Monday is 1, and so on.
        /// Default: 0
        /// Type: Number.
        /// Code example: $("#datepager").wijdatepager(
        ///	{ firstDayOfWeek: 1 });
        /// </summary>
        0,
        selectedDate: /// <summary>
        /// The selected date.
        /// Default: new Date()
        /// Type: Date.
        /// Code example: $("#datepager").wijdatepager(
        ///						{ selectedDate: new Date(2015, 11, 21) });
        /// </summary>
        null,
        viewType: /// <summary>
        /// The active view type. Possible values are: day, week, month.
        /// Default: "day"
        /// Type: String.
        /// Code example: $("#datepager").wijdatepager(
        ///			{ viewType: "month" });
        /// </summary>
        "day",
        nextTooltip: ///	<summary>
        ///	Gets or sets the text for the 'next' button's ToolTip.
        /// Default: "right"
        /// Type: String
        /// Code example:
        ///		$(".selector").wijdatepager({nextTooltip: "Next"});
        ///	</summary>
        "right",
        prevTooltip: ///	<summary>
        ///	Gets or sets the text for the 'previous' button's ToolTip.
        /// Default: "left"
        /// Type: String
        /// Code example:
        ///		$(".selector").wijdatepager({prevTooltip: "Previous"});
        ///	</summary>
        "left"
    });
    /*Available Events:
    /// <summary>
    /// Occurs when the selectedDate option has been changed.
    /// Type: Function
    /// Event type: wijdatepagerselecteddatechanged
    /// Code example:
    /// Supply a callback function to handle the selectedDateChanged event
    ///	as an option.
    /// $("#wijdatepager").wijdatepager(
    ///					{ selectedDateChanged: function (e, args) {
    ///		alert("selected date:" + args.selectedDate);
    ///    }
    ///	});
    /// Bind to the event by type: wijdatepagerselecteddatechanged.
    /// $("#wijdatepager").bind( "wijdatepagerselecteddatechanged",
    ///	function(e, args) {
    ///		alert("selected date:" + args.selectedDate);
    /// });
    /// </summary>
    /// <param name="e" type="Object">The jQuery.Event object.</param>
    /// <param name="args" type="Object">
    ///	args.selectedDate - the new selectedDate option value.</param>
    selectedDateChanged(e, args)
    */
    $.wijmo.registerWidget(widgetName, wijdatepager.prototype);
})(wijmo || (wijmo = {}));
