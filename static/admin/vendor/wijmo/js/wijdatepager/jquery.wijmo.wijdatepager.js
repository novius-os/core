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
    (function (datepager) {
        "use strict";
        var $ = jQuery, widgetName = "wijdatepager", datePagerClass = //Classes
        "wijmo-wijdatepager", incButtonClass = "wijmo-wijdatepager-increment", decButtonClass = "wijmo-wijdatepager-decrement", containerClass = "wijmo-wijdatepager-container", pagesClass = "wijmo-wijdatepager-pages", pageLabelClass = "wijmo-wijdatepager-pagelabel", pageLabelFirstClass = "wijmo-wijdatepager-pagelabel-first", pageLabelLastClass = "wijmo-wijdatepager-pagelabel-last", pageHeaderClass = "wijmo-wijdatepager-pageheader", pageRangeClass = "wijmo-wijdatepager-pagerange", tooltipClass = "wijmo-wijdatepager-tooltip", tooltipInnerClass = "wijmo-wijdatepager-tooltip-inner", triangleClass = "wijmo-wijdatepager-triangle", widthSmallestClass = "wijmo-wijdatepager-width-smallest", widthSmallClass = "wijmo-wijdatepager-width-small", widthMediumClass = "wijmo-wijdatepager-width-medium", widthNormalClass = "wijmo-wijdatepager-width-normal";
        /** @widget */
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
                        this.element.find("." + incButtonClass).attr("title", value);
                        break;
                    case "prevTooltip":
                        this.element.find("." + decButtonClass).attr("title", value);
                        break;
                    case "firstDayOfWeek":
                        this.options.firstDayOfWeek = value;
                        if(this.options.viewType === "week") {
                            this._initBackground();
                        }
                        break;
                }
                return this;
            };
            wijdatepager.prototype._disable = function () {
                this.element.addClass(this.options.wijCSS.stateDisabled);
                if($.mobile == null) {
                    this.element.find("." + decButtonClass).button("option", "disabled", true);
                    this.element.find("." + incButtonClass).button("option", "disabled", true);
                } else {
                    this.element.find("." + decButtonClass).addClass(this.options.wijCSS.stateDisabled);
                    this.element.find("." + incButtonClass).addClass(this.options.wijCSS.stateDisabled);
                }
            };
            wijdatepager.prototype._enable = function () {
                this.element.removeClass(this.options.wijCSS.stateDisabled);
                if($.mobile == null) {
                    this.element.find("." + decButtonClass).button("option", "disabled", false);
                    this.element.find("." + incButtonClass).button("option", "disabled", false);
                } else {
                    this.element.find("." + decButtonClass).removeClass(this.options.wijCSS.stateDisabled);
                    this.element.find("." + incButtonClass).removeClass(this.options.wijCSS.stateDisabled);
                }
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
                this.element.addClass(datePagerClass).addClass(o.wijCSS.wijdatepager).addClass(o.wijCSS.widget).addClass(o.wijCSS.helperClearFix);
                resizeHandler = $.proxy(this.invalidate, this);
                $(window).bind("resize." + this._dtpagernamespacekey, resizeHandler);
                if(this.element.disableSelection) {
                    this.element.disableSelection();
                }
                this.element.append($("<a></a>").addClass(decButtonClass).addClass(o.wijCSS.wijdatepagerDecButton).append($("<span>" + o.prevTooltip + "</span>"))).append($("<div></div>").addClass(containerClass).addClass(o.wijCSS.wijdatepagerContainer).addClass(o.wijCSS.content).append($("<div></div>").addClass(pagesClass).addClass(o.wijCSS.wijdatepagerPages))).append($("<a></a>").addClass(incButtonClass).addClass(o.wijCSS.wijdatepagerIncButton).append($("<span>" + o.nextTooltip + "</span>")));
                $.wijmo.widget.prototype._create.apply(this, arguments);
                decBtn = this.element.find("." + decButtonClass);
                incBtn = this.element.find("." + incButtonClass);
                if($.mobile == null) {
                    decBtn.button({
                        icons: {
                            primary: o.wijCSS.iconArrowLeft
                        },
                        text: false
                    });
                    incBtn.button({
                        icons: {
                            primary: o.wijCSS.iconArrowRight
                        },
                        text: false
                    });
                } else {
                    decBtn.html("");
                    decBtn.addClass(o.wijCSS.iconArrowLeft + " " + o.wijCSS.icon + " ui-btn");
                    incBtn.html("");
                    incBtn.addClass(o.wijCSS.iconArrowRight + " " + o.wijCSS.icon + " ui-btn");
                }
                decBtn.click($.proxy(this.goLeft, this));
                incBtn.click($.proxy(this.goRight, this));
                this._initBackground();
                if(o.disabled) {
                    this._disable();
                }
            };
            wijdatepager.prototype.destroy = /** Destroys the widget and resets the DOM element.*/
            function () {
                this.element.removeClass(datePagerClass).removeClass(this.options.wijCSS.wijdatepager);
                $(window).unbind("." + this._dtpagernamespacekey);
            };
            wijdatepager.prototype.refresh = /** Refreshes the widget layout.*/
            function () {
                this.invalidate();
            };
            wijdatepager.prototype.invalidate = /** Redraws the widget layout.*/
            function () {
                var selectedPage, o = this.options, selectedDate = o.selectedDate, newIndex, container = this.element.find("." + containerClass), decBtn = this.element.find("." + decButtonClass), incBtn = this.element.find("." + incButtonClass), innerWidth = this.element.innerWidth(), decBtnW = decBtn.is(":visible") ? decBtn.outerWidth(true) : 0, incBtnW = incBtn.is(":visible") ? incBtn.outerWidth(true) : 0, pagesBg, pageLabels, pageWidth, activeStates, activeLabelSelector;
                selectedPage = this.element.find("." + pageLabelClass + "." + this._getDateClass(selectedDate));
                if(selectedPage.length !== 1) {
                    selectedPage = $(this.element.find("." + pageLabelClass)[this._index]);
                } else {
                    newIndex = this.element.find("." + pageLabelClass).index(selectedPage);
                    this._index = newIndex;
                }
                activeLabelSelector = "." + pageLabelClass;
                activeStates = o.wijCSS.stateActive.split(" ");
                $.each(activeStates, function (i) {
                    activeLabelSelector += "." + activeStates[i];
                });
                this.element.find(activeLabelSelector).removeClass(o.wijCSS.stateActive);
                selectedPage.addClass(this.options.wijCSS.stateActive);
                container.css("left", decBtnW);
                this.element.removeClass(widthSmallestClass).removeClass(o.wijCSS.wijdatepagerWidthSmallest).removeClass(widthSmallClass).removeClass(o.wijCSS.wijdatepagerWidthSmall).removeClass(widthMediumClass).removeClass(o.wijCSS.wijdatepagerWidthMedium).removeClass(widthNormalClass).removeClass(o.wijCSS.wijdatepagerWidthNormal);
                if(innerWidth < 300) {
                    this.element.addClass(widthSmallestClass).addClass(o.wijCSS.wijdatepagerWidthSmallest);
                } else if(innerWidth < 475) {
                    this.element.addClass(widthSmallClass).addClass(o.wijCSS.wijdatepagerWidthSmall);
                } else if(innerWidth < 600) {
                    this.element.addClass(widthMediumClass).addClass(o.wijCSS.wijdatepagerWidthMedium);
                } else {
                    this.element.addClass(widthNormalClass).addClass(o.wijCSS.wijdatepagerWidthNormal);
                }
                container.outerWidth(innerWidth - decBtnW - incBtnW);
                //ie6/7 don't support display: table and display: table-cell,
                //so set width to each page label.
                if($.browser.msie && parseInt($.browser.version, 10) <= 7) {
                    pagesBg = this.element.find("." + pagesClass);
                    pageLabels = pagesBg.find("." + pageLabelClass);
                    pageWidth = Math.round(pagesBg.width() / this._datesDef.length) - (pageLabels.outerWidth(true) - pageLabels.width());
                    pageLabels.width(pageWidth);
                }
            };
            wijdatepager.prototype.goLeft = /** Selects the previous date.
            * @param {Object} ev The event of firing the select previous date.
            */
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
            wijdatepager.prototype.goRight = /** Selects the next date.*/
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
                var _this = this;
                var s, oldBg, newBg, pageLabels, newPageIndPos, self = this, o = self.options, pageWidth, pages = $("<div></div>");
                if(this._isInAnimate) {
                    return;
                }
                this._index = 0;
                this._datesDef = this._getDatesDefinition();
                this._min = 0;
                this._max = this._datesDef.length - 1;
                $.each(this._datesDef, function (i, dateDef) {
                    var page = $("<div>" + _this._datesDef[i].l + "</div>").addClass(pageLabelClass).addClass(o.wijCSS.wijdatepagerPageLabel).addClass(_this._getDateClass(dateDef.d));
                    if(i === 0) {
                        page.addClass(pageLabelFirstClass).addClass(o.wijCSS.wijdatepagerPageLabelFirst);
                    }
                    if(dateDef.range) {
                        page.addClass(pageRangeClass).addClass(o.wijCSS.wijdatepagerPageRange);
                    }
                    if(dateDef.header) {
                        page.addClass(pageHeaderClass).addClass(o.wijCSS.wijdatepagerPageHeader).addClass(o.wijCSS.stateHighlight);
                    }
                    if(i === _this._max) {
                        page.addClass(pageLabelLastClass).addClass(o.wijCSS.wijdatepagerPageLabelLast);
                    }
                    pages.append(page);
                });
                s = pages.html();
                newBg = this.element.find("." + pagesClass);
                if(animate) {
                    this._isInAnimate = true;
                    oldBg = newBg.clone(true);
                    newBg.html(s);
                    pageLabels = newBg.find("." + pageLabelClass);
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
                pageLabels = newBg.find("." + pageLabelClass);
                pageLabels.hover($.proxy(this._pagelabelHover, this), $.proxy(this._pagelabelHout, this));
                pageLabels.bind("mousedown", $.proxy(this._pagelabelMouseDown, this));
                pageLabels.click($.proxy(function (e) {
                    var target = $(e.target), ind;
                    ind = this.element.find("." + pageLabelClass).index(target);
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
                if(target.hasClass(pageHeaderClass)) {
                    return;
                }
                target.addClass(o.wijCSS.stateHover);
            };
            wijdatepager.prototype._showTooltip = function (ind) {
                var o = this.options, dateDef = this._datesDef[ind], viewType = o.viewType, s, target = this.element.find("." + pageLabelClass)[ind];
                if(!this._tooltip) {
                    this._tooltip = $("<div></div>").addClass(tooltipClass).addClass(o.wijCSS.wijdatepagerTooltip).append($("<div></div>").addClass(tooltipInnerClass).addClass(o.wijCSS.wijdatepagerTooltipInner)).append($("<div></div>").addClass(triangleClass).addClass(o.wijCSS.wijdatepagerTriangle));
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
                    this._tooltip.find("." + tooltipInnerClass).html(s);
                }
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
                if(target.hasClass(pageHeaderClass)) {
                    return;
                }
                ind = this.element.find("." + pageLabelClass).index(target);
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
                var startPage = this.element.find("." + pageLabelClass)[this._startInd], newPos, ind;
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
            };
            wijdatepager.prototype._pageindicatorMouseUp = function () {
                this._dragActivated = false;
                $(document).unbind("." + this._dtpagernamespacekey);
                this._hideTooltip();
            };
            wijdatepager.prototype._findClosesPageIndexByPos = function (pos) {
                var pagelabels = this.element.find("." + pagesClass).find("." + pageLabelClass), i;
                for(i = 0; i < pagelabels.length; i += 1) {
                    if((pagelabels[i].offsetLeft) < pos && (pagelabels[i].offsetLeft + pagelabels[i].offsetWidth) > pos) {
                        return i;
                    }
                }
                return -1;
            };
            wijdatepager.prototype.localizeString = /** @ignore */
            function (key, defaultValue) {
                var o = this.options;
                if(o.localization && o.localization[key]) {
                    return o.localization[key];
                }
                return defaultValue;
            };
            wijdatepager.prototype._formatString = function (fmt, arg0, arg1, arg2) {
                var r, args = arguments, i, funcArgs, self = this;
                if(args.length <= 1) {
                    return Globalize.format(args);
                }
                if(typeof fmt === "string") {
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
        datepager.wijdatepager = wijdatepager;        
        var wijdatepager_options = (function () {
            function wijdatepager_options() {
                this.wijCSS = {
                    wijdatepager: "",
                    wijdatepagerIncButton: "",
                    wijdatepagerDecButton: "",
                    wijdatepagerContainer: "",
                    wijdatepagerPages: "",
                    wijdatepagerPageLabel: "",
                    wijdatepagerPageLabelFirst: "",
                    wijdatepagerPageLabelLast: "",
                    wijdatepagerPageHeader: "",
                    wijdatepagerPageRange: "",
                    wijdatepagerTooltip: "",
                    wijdatepagerTooltipInner: "",
                    wijdatepagerTriangle: "",
                    wijdatepagerWidthSmallest: "",
                    wijdatepagerWidthSmall: "",
                    wijdatepagerWidthMedium: "",
                    wijdatepagerWidthNormal: ""
                };
                /** @ignore */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body ui-body-b",
                    stateDefault: "ui-btn ui-btn-b"
                };
                /** @ignore */
                this.initSelector = ":jqmData(role='wijdatepager')";
                /** Culture name, e.g. "de-DE".
                * @example
                * // This markup sets the culture to German:
                * $("#element").wijdatepager( { culture: "de-DE" } );
                */
                this.culture = "";
                /** Use the localization option in order to provide custom localization.
                * @remarks Default:
                *	 {
                *	dayViewTooltipFormat: "{0:dddd, MMMM d, yyyy}",
                *	weekViewTooltipFormat: "{0:MMMM d} - {1:d, yyyy}",
                *	weekViewTooltip2MonthesFormat: "{0:MMMM d} - {1:MMMM d, yyyy}",
                *	monthViewTooltipFormat: "{0:MMMM yyyy}",
                *	dayViewLabelFormat": "{0:d }",
                *	weekViewLabelFormat: "{0:MMM dd}-{1:dd}",
                *	monthViewLabelFormat: "{0:MMM}"
                *	}
                * @example
                * $("#datepager").wijdatepager(
                *					{
                *						localization: {
                *							weekViewTooltip2MonthesFormat: "{0:MMMM d} - {1:MMMM d}",
                *							dayViewTooltipFormat: "{0:dddd, MMMM d}"
                *						}
                *					});
                */
                this.localization = null;
                /** The first day of the week (from 0 to 6).  Sunday is 0, Monday is 1, and so on.*/
                this.firstDayOfWeek = 0;
                /** The selected date.
                * @type {Date}
                */
                this.selectedDate = null;
                /** The active view type.
                * @remarks Possible values are: day, week, month.
                */
                this.viewType = "day";
                /** Gets or sets the text for the 'next' button's ToolTip.
                */
                this.nextTooltip = "right";
                /** Gets or sets the text for the 'previous' button's ToolTip.
                */
                this.prevTooltip = "left";
                /** Occurs when the selectedDate option has been changed.
                * @event
                * @dataKey selectedDate The new selectedDate option value.
                */
                this.selectedDateChanged = null;
            }
            return wijdatepager_options;
        })();        
        ;
        wijdatepager.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijdatepager_options());
        $.wijmo.registerWidget(widgetName, wijdatepager.prototype);
    })(wijmo.datepager || (wijmo.datepager = {}));
    var datepager = wijmo.datepager;
})(wijmo || (wijmo = {}));
