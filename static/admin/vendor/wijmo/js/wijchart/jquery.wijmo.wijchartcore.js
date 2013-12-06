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
    /// <reference path="../wijutil/jquery.wijmo.raphael.ts"/>
    /// <reference path="../external/declarations/globalize.d.ts"/>
    /*globals $, Raphael, jQuery, document, window, Globalize, wijmoASPNetParseOptions*/
    /*
    * Depends:
    *  raphael.js
    *  globalize.js
    *  jquery.svgdom.js
    *  jquery.ui.widget.js
    *
    */
    (function (chart) {
        var $ = jQuery;
        /** @ignore */
        var ChartUtil = (function () {
            function ChartUtil() { }
            ChartUtil.getDiffAttrs = function getDiffAttrs(attrs, newAttrs) {
                var result = {
                };
                $.each(newAttrs, function (key, attr) {
                    if(typeof (attrs) === "undefined") {
                        return true;
                    } else if(typeof (attrs[key]) === "undefined") {
                        result[key] = newAttrs[key];
                    } else if(attrs[key] !== newAttrs[key]) {
                        result[key] = newAttrs[key];
                    }
                });
                return result;
            };
            ChartUtil.paintShadow = //To do: make sure what is the type of the element.
            function paintShadow(element, offset, stroke) {
                if(element.removed || $(element.node).parent().length === 0) {
                    return;
                }
                var shadow = element.clone(), newOffset = offset || 1, newStroke = stroke || "#cccccc";
                shadow.insertBefore(element);
                shadow.attr({
                    transform: // translation: newOffset + " " + newOffset,
                    Raphael.format("...T{0},{1}", newOffset, newOffset),
                    stroke: newStroke,
                    fill: // the shadow should not fill an color.
                    "none",
                    "stroke-width": newOffset
                });
                shadow.toBack();
                shadow.offset = newOffset;
                element.shadow = shadow;
            };
            ChartUtil.getScaling = function getScaling(isVertical, max, min, length) {
                var dx = max - min;
                if(dx === 0) {
                    dx = 1;
                }
                if(isVertical) {
                    dx = -dx;
                }
                return length / dx;
            };
            ChartUtil.getTranslation = function getTranslation(isVertical, location, max, min, scaling) {
                var translation = 0;
                if(isVertical) {
                    translation = location.y;
                    translation -= scaling * max;
                } else {
                    translation = location.x;
                    translation -= scaling * min;
                }
                return translation;
            };
            ChartUtil.getXSortedPoints = function getXSortedPoints(series) {
                var seriesX = series.data.x, tempX = [].concat(seriesX), tempY = [].concat(series.data.y), points = [], sortedX = seriesX;
                if(seriesX === undefined || seriesX.length === 0) {
                    return;
                }
                function sortNumber(a, b) {
                    return a - b;
                }
                if(typeof (seriesX[0]) === "number") {
                    sortedX = [].concat(seriesX).sort(sortNumber);
                }
                $.each(sortedX, function (i, nSortedX) {
                    $.each(tempX, function (j, nx) {
                        if(nSortedX === nx) {
                            if(typeof (nx) !== "number") {
                                nx = i;
                            }
                            points.push({
                                x: nx,
                                y: tempY[j]
                            });
                            tempX.splice(j, 1);
                            tempY.splice(j, 1);
                            return false;
                        }
                    });
                });
                return points;
            };
            ChartUtil.sector = function sector(cx, cy, r, startAngle, endAngle) {
                var start = $.wijraphael.getPositionByAngle(cx, cy, r, startAngle), end = $.wijraphael.getPositionByAngle(cx, cy, r, endAngle);
                return [
                    "M", 
                    cx, 
                    cy, 
                    "L", 
                    start.x, 
                    start.y, 
                    "A", 
                    r, 
                    r, 
                    0, 
                    +(endAngle - startAngle > 180), 
                    0, 
                    end.x, 
                    end.y, 
                    "z"
                ];
            };
            ChartUtil.donut = function donut(cx, cy, outerR, innerR, startAngle, endAngle) {
                var outerS = $.wijraphael.getPositionByAngle(cx, cy, outerR, startAngle), outerE = $.wijraphael.getPositionByAngle(cx, cy, outerR, endAngle), innerS = $.wijraphael.getPositionByAngle(cx, cy, innerR, startAngle), innerE = $.wijraphael.getPositionByAngle(cx, cy, innerR, endAngle), largeAngle = endAngle - startAngle > 180;
                return [
                    "M", 
                    outerS.x, 
                    outerS.y, 
                    "A", 
                    outerR, 
                    outerR, 
                    0, 
                    +largeAngle, 
                    0, 
                    outerE.x, 
                    outerE.y, 
                    "L", 
                    innerE.x, 
                    innerE.y, 
                    "A", 
                    innerR, 
                    innerR, 
                    0, 
                    +largeAngle, 
                    1, 
                    innerS.x, 
                    innerS.y, 
                    "L", 
                    outerS.x, 
                    outerS.y, 
                    "z"
                ];
            };
            ChartUtil.getFirstValidListValue = function getFirstValidListValue(values) {
                var val;
                $.each(values, function (idx, value) {
                    if(value === null) {
                        return true;
                    } else if(typeof value === "undefined") {
                        return true;
                    } else if(typeof value === "number" && isNaN(value)) {
                        return true;
                    }
                    val = value;
                    return false;
                });
                return val;
            };
            ChartUtil.getLastValidListValue = function getLastValidListValue(values) {
                var vals = [].concat(values).reverse();
                return ChartUtil.getFirstValidListValue(vals);
            };
            ChartUtil.isHolefunction = function isHolefunction(val, hole) {
                if(val === null) {
                    return true;
                } else if(typeof val === "undefined") {
                    return true;
                } else if(typeof val === "number" && isNaN(val)) {
                    return true;
                }
                if(hole === null) {
                    return false;
                }
                if(typeof val !== "undefined") {
                    // for datetime, if use val === hole it returns false.
                    if(val - hole === 0) {
                        return true;
                    }
                    return false;
                }
                return false;
            };
            return ChartUtil;
        })();
        chart.ChartUtil = ChartUtil;        
        /** @ignore */
        var ChartDataUtil = (function () {
            function ChartDataUtil() { }
            ChartDataUtil.roundTime = function roundTime(timevalue, unit, roundup) {
                var self = this, tunit = // tunit = unit * self._tmInc.day,
                unit, tv = $.fromOADate(timevalue), th, td, tx, tz;
                if(tunit > 0) {
                    th = {
                        year: tv.getFullYear(),
                        month: tv.getMonth(),
                        day: tv.getDate(),
                        hour: tv.getHours(),
                        minute: tv.getMinutes(),
                        second: tv.getSeconds()
                    };
                    if(tunit < self.tmInc.minute) {
                        th.second = self.tround(th.second, tunit, roundup);
                        return self.getTimeAsDouble(th);
                    }
                    th.second = 0;
                    if(tunit < self.tmInc.hour) {
                        tunit /= self.tmInc.minute;
                        th.minute = self.tround(th.minute, tunit, roundup);
                        return self.getTimeAsDouble(th);
                    }
                    th.minute = 0;
                    if(tunit < self.tmInc.day) {
                        tunit /= self.tmInc.hour;
                        th.hour = self.tround(th.hour, tunit, roundup);
                        return self.getTimeAsDouble(th);
                    }
                    th.hour = 0;
                    if(tunit < self.tmInc.month) {
                        tunit /= self.tmInc.day;
                        th.day = self.tround(th.day, tunit, roundup);
                        return self.getTimeAsDouble(th);
                    }
                    th.day = 1;
                    if(tunit < self.tmInc.year) {
                        tunit /= self.tmInc.month;
                        th.month = self.tround(th.month, tunit, roundup);
                        return self.getTimeAsDouble(th);
                    }
                    // th.month = 1;
                    th.month = 0// the month start from 0 in javascript.
                    ;
                    tunit /= self.tmInc.year;
                    th.year = self.tround(th.year, tunit, roundup);
                    return self.getTimeAsDouble(th);
                } else {
                    td = tv;
                    tx = td - tunit;
                    tz = parseInt((tx / unit).toString(), 10) * unit;
                    if(roundup && tz !== tx) {
                        tz += unit;
                    }
                    td = tunit + tz;
                    return td;
                }
            };
            ChartDataUtil.tround = function tround(tval, tunit, roundup) {
                var test = parseInt(((tval / tunit) * tunit).toString(), 10);
                if(roundup && test !== tval) {
                    test += parseInt(tunit, 10);
                }
                return test;
            };
            ChartDataUtil.getTimeAsDouble = function getTimeAsDouble(th) {
                var smon = 0, sday = 0, newDate = null;
                if(th.day < 1) {
                    sday = -1 - th.day;
                    th.day = 1;
                } else if(th.day > 28) {
                    sday = th.day - 28;
                    th.day = 28;
                }
                /*
                * if (th.month < 1) { smon = -1 - th.day; th.month = 1; } else if
                * (th.month > 12) { smon = th.month - 12; th.month = 12; }
                */
                // the month start from 0 & end with 11 in javascript.
                if(th.month < 0) {
                    smon = -1 - th.day;
                    th.month = 0;
                } else if(th.month > 11) {
                    smon = th.month - 11;
                    th.month = 11;
                }
                newDate = new Date(th.year, th.month, th.day, th.hour, th.minute, th.second);
                newDate.setDate(newDate.getDate() + sday);
                newDate.setMonth(newDate.getMonth() + smon);
                return $.toOADate(newDate);
            };
            ChartDataUtil.getTimeDefaultFormat = function getTimeDefaultFormat(max, min) {
                var self = this, range = // range = (max - min) * self._tmInc.day,
                max - min, format = "d";
                // format = "s";
                if(range > 2 * self.tmInc.year) {
                    format = "yyyy";
                } else if(range > self.tmInc.year) {
                    format = "MMM yy";
                } else if(range > 3 * self.tmInc.month) {
                    format = "MMM";
                } else if(range > 2 * self.tmInc.week) {
                    format = "MMM d";
                } else if(range > 2 * self.tmInc.day) {
                    format = "ddd d";
                } else if(range > self.tmInc.day) {
                    format = "ddd H:mm";
                } else if(range > self.tmInc.hour) {
                    format = "H:mm";
                } else if(range >= 1000) {
                    format = "H:mm:ss";
                }
                /*
                * else if (range > 0) { //TODO: return millisecond }
                */
                return format;
            };
            ChartDataUtil.niceTimeUnit = function niceTimeUnit(timeinc, manualFormat) {
                var self = this, tsRange = // tsRange = timeinc * self._tmInc.day;
                timeinc;
                tsRange = self.niceTimeSpan(tsRange, manualFormat);
                // return tsRange / self._tmInc.day;
                return tsRange;
            };
            ChartDataUtil.niceTimeSpan = function niceTimeSpan(range, manualFormat) {
                var self = this, minSpan = self.manualTimeInc(manualFormat), tsinc = 0, tinc = 0;
                /*
                * if (minSpan < this._tmInc.second) { //TODO: calculate when
                * millisecond }
                */
                tsinc = Math.ceil(range);
                if(tsinc === 0) {
                    return self.timeSpanFromTmInc(minSpan);
                }
                tinc = 1;
                if(minSpan < self.tmInc.minute) {
                    if(tsinc < self.tmInc.minute) {
                        tinc = self.getNiceInc([
                            1, 
                            2, 
                            5, 
                            10, 
                            15, 
                            30
                        ], tsinc, minSpan);
                        if(tinc !== 0) {
                            return tinc;
                        }
                    }
                    minSpan = self.tmInc.minute;
                }
                if(minSpan < self.tmInc.hour) {
                    if(tsinc < self.tmInc.hour) {
                        tinc = self.getNiceInc([
                            1, 
                            2, 
                            5, 
                            10, 
                            15, 
                            30
                        ], tsinc, minSpan);
                        if(tinc !== 0) {
                            return tinc;
                        }
                    }
                    minSpan = self.tmInc.hour;
                }
                if(minSpan < self.tmInc.day) {
                    if(tsinc < self.tmInc.day) {
                        tinc = self.getNiceInc([
                            1, 
                            3, 
                            6, 
                            12
                        ], tsinc, minSpan);
                        if(tinc !== 0) {
                            return tinc;
                        }
                    }
                    minSpan = self.tmInc.day;
                }
                if(minSpan < self.tmInc.month) {
                    if(tsinc < self.tmInc.month) {
                        tinc = self.getNiceInc([
                            1, 
                            2, 
                            7, 
                            14
                        ], tsinc, minSpan);
                        if(tinc !== 0) {
                            return tinc;
                        }
                    }
                    minSpan = self.tmInc.month;
                }
                if(minSpan < self.tmInc.year) {
                    if(tsinc < self.tmInc.year) {
                        tinc = self.getNiceInc([
                            1, 
                            2, 
                            3, 
                            4, 
                            6
                        ], tsinc, minSpan);
                        if(tinc !== 0) {
                            return tinc;
                        }
                    }
                    minSpan = self.tmInc.year;
                }
                tinc = 100 * self.tmInc.year;
                if(tsinc < tinc) {
                    tinc = self.getNiceInc([
                        1, 
                        2, 
                        5, 
                        10, 
                        20, 
                        50
                    ], tsinc, minSpan);
                    if(tinc === 0) {
                        tinc = 100 * self.tmInc.year;
                    }
                }
                return tinc;
            };
            ChartDataUtil.getNiceInc = function getNiceInc(tik, ts, mult) {
                var i = 0, tikm = 0, ii = tik.length;
                for(i = 0; i < ii; i++) {
                    tikm = tik[i] * mult;
                    if(ts <= tikm) {
                        return tikm;
                    }
                }
                return 0;
            };
            ChartDataUtil.timeSpanFromTmInc = function timeSpanFromTmInc(ti) {
                var rv = 1000, rti = ti, ticks = 1;
                if(ti !== this.tmInc.maxtime) {
                    if(ti > this.tmInc.tickf1) {
                        rv = ti;
                    } else {
                        ti += 7;
                        while(rti > 0) {
                            ticks *= 10;
                            rti--;
                        }
                        rv = ticks;
                    }
                }
                return rv;
            };
            ChartDataUtil.manualTimeInc = function manualTimeInc(manualFormat) {
                var self = this, minSpan = self.tmInc.second;
                if(!manualFormat || manualFormat.length === 0) {
                    return minSpan;
                }
                // var f = manualFormat.indexOf("f");
                // if (f > 0) {
                // //TODO: when _getTimeDefaultFormat return millisecond
                // }
                // else if (manualFormat.indexOf("s") >= 0) {
                if(manualFormat.indexOf("s") >= 0) {
                    minSpan = self.tmInc.second;
                } else if(manualFormat.indexOf("m") >= 0) {
                    minSpan = self.tmInc.minute;
                } else if(manualFormat.indexOf("h") >= 0 || manualFormat.indexOf("H") >= 0) {
                    minSpan = self.tmInc.hour;
                } else if(manualFormat.indexOf("d") >= 0) {
                    minSpan = self.tmInc.day;
                } else if(manualFormat.indexOf("M") >= 0) {
                    minSpan = self.tmInc.month;
                } else if(manualFormat.indexOf("y") >= 0) {
                    minSpan = self.tmInc.year;
                }
                return minSpan;
            };
            ChartDataUtil.tmInc = {
                tickf7: -7000,
                tickf6: -6000,
                tickf5: -5000,
                tickf4: -4000,
                tickf3: -3000,
                tickf2: -2000,
                tickf1: -1,
                second: 1000,
                minute: 60 * 1000,
                hour: 60 * 60 * 1000,
                day: 24 * 60 * 60 * 1000,
                week: 7 * 24 * 60 * 60 * 1000,
                month: 31 * 24 * 60 * 60 * 1000,
                year: 365 * 24 * 60 * 60 * 1000,
                maxtime: 2147483647
            };
            ChartDataUtil.niceTickNumber = function niceTickNumber(x) {
                if(parseFloat(x) === 0.0) {
                    return x;
                } else if(x < 0) {
                    x = -x;
                }
                var log10 = Math.log(x) / Math.log(10), exp = parseInt(this.signedFloor(log10).toString(), 10), f = x / Math.pow(10.0, exp), nf = 10.0;
                if(f <= 1.0) {
                    nf = 1.0;
                } else if(f <= 2.0) {
                    nf = 2.0;
                } else if(f <= 5.0) {
                    nf = 5.0;
                }
                return (nf * Math.pow(10.0, exp));
            };
            ChartDataUtil.niceNumber = function niceNumber(x, exp, round) {
                if(parseFloat(x) === 0.0) {
                    return x;
                } else if(x < 0) {
                    x = -x;
                }
                var f = x / Math.pow(10.0, exp), nf = 10.0;
                if(round) {
                    if(f < 1.5) {
                        nf = 1.0;
                    } else if(f < 3.0) {
                        nf = 2.0;
                    } else if(f < 7.0) {
                        nf = 5.0;
                    }
                } else {
                    if(f <= 1.0) {
                        nf = 1.0;
                    } else if(f <= 2.0) {
                        nf = 2.0;
                    } else if(f <= 5.0) {
                        nf = 5.0;
                    }
                }
                return (nf * Math.pow(10.0, exp));
            };
            ChartDataUtil.nicePrecision = function nicePrecision(range) {
                if(range <= 0 || typeof (range) !== "number") {
                    return 0;
                }
                var log10 = Math.log(range) / Math.log(10), exp = parseInt(this.signedFloor(log10).toString(), 10), f = range / Math.pow(10.0, exp);
                if(f < 3.0) {
                    exp = -exp + 1;
                }
                return exp;
            };
            ChartDataUtil.precCeil = function precCeil(prec, value) {
                var f = Math.pow(10.0, prec), x = value / f;
                x = Math.ceil(x);
                return x * f;
            };
            ChartDataUtil.precFloor = function precFloor(prec, value) {
                var f = Math.pow(10.0, prec), x = value / f;
                x = Math.floor(x);
                return x * f;
            };
            ChartDataUtil.signedCeiling = function signedCeiling(val) {
                if(val < 0.0) {
                    return Math.floor(val);
                }
                return Math.ceil(val);
            };
            ChartDataUtil.signedFloor = function signedFloor(val) {
                if(val < 0.0) {
                    return Math.ceil(val);
                }
                return Math.floor(val);
            };
            return ChartDataUtil;
        })();
        chart.ChartDataUtil = ChartDataUtil;        
        Raphael.fn.closeBtn = function (x, y, length) {
            var offset = Math.cos(45 * Math.PI / 180) * length, set = this.set(), arrPath = [
                "M", 
                x - offset, 
                y - offset, 
                "L", 
                x + offset, 
                y + offset, 
                "M", 
                x - offset, 
                y + offset, 
                "L", 
                x + offset, 
                y - offset
            ], path = this.path(arrPath.join(" ")), rect = null;
            path.attr({
                cursor: "pointer"
            });
            set.push(path);
            rect = this.rect(x - length, y - length, length * 2, length * 2);
            rect.attr({
                fill: "white",
                "fill-opacity": 0,
                cursor: "pointer",
                stroke: "none"
            });
            set.push(rect);
            return set;
        };
        //export enum ToolTipCompass {
        //	east,
        //	eastnorth,
        //	eastsouth,
        //	west,
        //	westnorth,
        //	westsouth,
        //	north,
        //	northeast,
        //	northwest,
        //	south,
        //	southeast,
        //	southwest
        //}
        /** @ignore */
        var ChartTooltip = (function () {
            function ChartTooltip(paper, targets, options) {
                this.options = {
                    content: "",
                    contentStyle: {
                    },
                    title: "",
                    titleStyle: {
                    },
                    style: {
                        fill: "white",
                        "fill-opacity": 0.5
                    },
                    closeBehavior: "auto",
                    mouseTrailing: true,
                    triggers: "hover",
                    animated: "fade",
                    showAnimated: null,
                    hideAnimated: null,
                    duration: 500,
                    showDuration: 500,
                    hideDuration: 500,
                    easing: null,
                    showEasing: null,
                    hideEasing: null,
                    showDelay: 150,
                    hideDelay: 150,
                    relativeTo: "mouse",
                    compass: "east",
                    offsetX: 0,
                    offsetY: 0,
                    showCallout: true,
                    calloutFilled: false,
                    calloutFilledStyle: {
                        fill: "black"
                    },
                    calloutLength: 12,
                    calloutOffset: 0,
                    calloutAnimation: {
                        easing: null,
                        duration: 500
                    },
                    windowCollisionDetection: "flip",
                    calloutSide: null,
                    width: null,
                    height: null,
                    beforeShowing: null
                };
                this.paper = paper;
                this.targets = targets;
                $.extend(this.options, options);
                this.init();
            }
            ChartTooltip.prototype.init = function () {
                var o = this.options;
                this.calloutOffset = o.calloutOffset;
                this.offsetLength = 0;
                this.gapLength = o.calloutLength / 2;
                this.width = o.width;
                this.height = o.height;
                this.offset = {
                    x: 0,
                    y: 0
                };
                if(this.targets) {
                    this._bindLiveEvent(this.targets);
                }
                if(this.selector) {
                    this._bindLiveEventBySelector(this.selector);
                }
            };
            ChartTooltip.prototype._getShowPoint = function (raphaelObj, compass) {
                var box = raphaelObj.getBBox(), point = {
                    x: 0,
                    y: 0
                };
                switch(compass.toLowerCase()) {
                    case "east":
                        point.x = box.x + box.width;
                        point.y = box.y + box.height / 2;
                        break;
                    case "eastnorth":
                        point.x = box.x + box.width;
                        point.y = box.y;
                        break;
                    case "eastsouth":
                        point.x = box.x + box.width;
                        point.y = box.y + box.height;
                        break;
                    case "west":
                        point.x = box.x;
                        point.y = box.y + box.height / 2;
                        break;
                    case "westnorth":
                        point.x = box.x;
                        point.y = box.y;
                        break;
                    case "westsouth":
                        point.x = box.x;
                        point.y = box.y + box.height;
                        break;
                    case "north":
                        point.x = box.x + box.width / 2;
                        point.y = box.y;
                        break;
                    case "northeast":
                        point.x = box.x + box.width;
                        point.y = box.y;
                        break;
                    case "northwest":
                        point.x = box.x;
                        point.y = box.y;
                        break;
                    case "south":
                        point.x = box.x + box.width / 2;
                        point.y = box.y + box.height;
                        break;
                    case "southeast":
                        point.x = box.x + box.width;
                        point.y = box.y + box.height;
                        break;
                    case "southwest":
                        point.x = box.x;
                        point.y = box.y + box.height;
                        break;
                }
                return point;
            };
            ChartTooltip.prototype._clearIntentTimer = function (timer) {
                if(timer) {
                    window.clearTimeout(timer);
                    timer = null;
                }
            };
            ChartTooltip.prototype._removeTooltip = function (duration) {
                var _this = this;
                var self = this, elements = this.elements, o = self.options, animated, d, op;
                if(elements) {
                    if(o.hideAnimated || o.animated) {
                        animated = o.hideAnimated;
                        if(!animated) {
                            animated = o.animated;
                        }
                        if(animated && ChartTooltip.animations[animated]) {
                            op = {
                                animated: animated,
                                duration: o.hideDuration || o.duration,
                                easing: o.hideEasing || o.easing,
                                context: elements,
                                show: false
                            };
                            ChartTooltip.animations[animated](op);
                        }
                    }
                    d = o.hideDuration || o.duration;
                    if(duration) {
                        d = duration;
                    }
                    window.setTimeout(function () {
                        var i, ii;
                        if(_this.content) {
                            _this.content.wijRemove();
                            _this.content = null;
                        }
                        if(_this.title) {
                            _this.title.wijRemove();
                            _this.title = null;
                        }
                        if(_this.container) {
                            _this.container.wijRemove();
                            _this.container = null;
                        }
                        if(_this.closeBtn) {
                            for(i = 0 , ii = _this.closeBtn.length; i < ii; i++) {
                                _this.closeBtn[i].unclick();
                            }
                            _this.closeBtn.wijRemove();
                            _this.closeBtn = null;
                        }
                        if(_this.callout) {
                            _this.callout.wijRemove();
                            _this.callout = null;
                        }
                        self.lastPoint = null;
                        elements = null;
                    }, d);
                }
            };
            ChartTooltip.prototype._clearTimers = function () {
                if(this.intentShowTimer) {
                    this._clearIntentTimer(this.intentShowTimer);
                }
                if(this.intentHideTimer) {
                    this._clearIntentTimer(this.intentHideTimer);
                }
            };
            ChartTooltip.prototype._hide = function (e) {
                var self = this;
                self._clearTimers();
                if(self.options.hideDelay) {
                    self.intentHideTimer = window.setTimeout(function () {
                        self._removeTooltip();
                    }, self.options.hideDelay);
                } else {
                    self._removeTooltip();
                }
            };
            ChartTooltip.prototype._convertCompassToPosition = function (compass) {
                var position = "", offset = {
                    x: 0,
                    y: 0
                };
                switch(compass.toLowerCase()) {
                    case "east":
                        position = "right-middle";
                        offset.x = 2;
                        offset.y = 0;
                        break;
                    case "eastnorth":
                        position = "right-top";
                        offset.x = 2;
                        offset.y = -2;
                        break;
                    case "eastsouth":
                        position = "right-bottom";
                        offset.x = 2;
                        offset.y = 2;
                        break;
                    case "west":
                        position = "left-middle";
                        offset.x = -2;
                        offset.y = 0;
                        break;
                    case "westnorth":
                        position = "left-top";
                        offset.x = -2;
                        offset.y = -2;
                        break;
                    case "westsouth":
                        position = "left-bottom";
                        offset.x = -2;
                        offset.y = 2;
                        break;
                    case "north":
                        position = "top-middle";
                        offset.x = 0;
                        offset.y = -2;
                        break;
                    case "northeast":
                        position = "top-right";
                        offset.x = 2;
                        offset.y = -2;
                        break;
                    case "northwest":
                        position = "top-left";
                        offset.x = -2;
                        offset.y = -2;
                        break;
                    case "south":
                        position = "bottom-middle";
                        offset.x = 0;
                        offset.y = 2;
                        break;
                    case "southeast":
                        position = "bottom-right";
                        offset.x = 2;
                        offset.y = 2;
                        break;
                    case "southwest":
                        position = "bottom-left";
                        offset.x = -2;
                        offset.y = 2;
                        break;
                }
                this.offset = offset;
                return position;
            };
            ChartTooltip.prototype._getCalloutArr = function (p, offset) {
                var arr = [], o = this.options, compass = o.compass;
                if(o.calloutSide) {
                    compass = o.calloutSide;
                }
                switch(compass.toLowerCase()) {
                    case "east":
                    case "eastsouth":
                    case "eastnorth":
                        arr = [
                            "M", 
                            p.x + offset, 
                            p.y + offset, 
                            "l", 
                            -offset, 
                            -offset, 
                            "l", 
                            offset, 
                            -offset, 
                            "Z"
                        ];
                        break;
                    case "west":
                    case "westsouth":
                    case "westnorth":
                        arr = [
                            "M", 
                            p.x - offset, 
                            p.y - offset, 
                            "l", 
                            offset, 
                            offset, 
                            "l", 
                            -offset, 
                            offset, 
                            "Z"
                        ];
                        break;
                    case "north":
                    case "northeast":
                    case "northwest":
                        arr = [
                            "M", 
                            p.x - offset, 
                            p.y - offset, 
                            "l", 
                            offset, 
                            offset, 
                            "l", 
                            offset, 
                            -offset, 
                            "Z"
                        ];
                        break;
                    case "south":
                    case "southeast":
                    case "southwest":
                        arr = [
                            "M", 
                            p.x - offset, 
                            p.y + offset, 
                            "l", 
                            offset, 
                            -offset, 
                            "l", 
                            offset, 
                            offset, 
                            "Z"
                        ];
                        break;
                }
                return arr;
            };
            ChartTooltip.prototype._getFuncText = function (text, e) {
                if($.isFunction(text)) {
                    var fmt = null, objTar, obj = {
                        target: null,
                        fmt: text
                    }, t;
                    if(e && e.target) {
                        // obj.target = $(e.target).data("raphaelObj");
                        // objTar = $(e.target).data("raphaelObj");
                        // if (!objTar) {
                        // objTar = $(e.target.parentNode).data("raphaelObj");
                        // }
                        // obj.target = objTar;
                        t = e.target;
                        if(!t.raphael || !t.raphaelid) {
                            t = t.parentNode;
                        }
                        if(t.raphael && t.raphaelid) {
                            objTar = this.paper.getById(t.raphaelid);
                            obj.target = objTar;
                        } else {
                            obj.target = e.target;
                        }
                    }
                    fmt = $.proxy(obj.fmt, obj);
                    return fmt().toString();
                }
                return text;
            };
            ChartTooltip.prototype._translateCallout = function (duration) {
                var o = this.options, width = this.width, height = this.height, gapLength = this.gapLength, offsetLength = this.offsetLength, calloutOffset = this.calloutOffset, callout = this.tooltipElements.callout;
                if(o.calloutSide) {
                    var offset = gapLength || offsetLength;
                    switch(o.calloutSide) {
                        case "south":
                        case "north":
                            if(duration) {
                                callout.animate({
                                    "translation": (-width / 2 + offset + calloutOffset) + ",0"
                                }, duration);
                            } else {
                                callout.translate(-width / 2 + offset + calloutOffset, 0);
                            }
                            break;
                        case "east":
                        case "west":
                            if(duration) {
                                callout.animate({
                                    "translation": "0," + (-height / 2 + offset + calloutOffset)
                                }, duration);
                            } else {
                                callout.translate(0, -height / 2 + offset + calloutOffset);
                            }
                            break;
                    }
                }
            };
            ChartTooltip.replacer = function replacer(all, key, obj) {
                var res = obj, objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g;
                key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
                    name = name || quotedName;
                    if(res) {
                        if(res[name] !== typeof ('undefined')) {
                            res = res[name];
                        }
                        if(typeof res === "function" && isFunc) {
                            res = res();
                        }
                    }
                });
                res = (res === null || res === obj ? all : res).toString();
                return res;
            };
            ChartTooltip.fill = function fill(str, obj) {
                var tokenRegex = /\{([^\}]+)\}/g;
                return String(str).replace(tokenRegex, function (all, key) {
                    return ChartTooltip.replacer(all, key, obj);
                });
            };
            ChartTooltip.prototype._createPath = function (point, position, set) {
                var pos = position.split("-"), r = 5, bb = set.getBBox(), o = this.options, p = o.padding, gapLength = this.gapLength, offsetLength = this.offsetLength, padding = p && !isNaN(p) ? parseInt(p) : 0, w = Math.round(bb.width + padding * 2), h = Math.round(bb.height + padding * 2), x = Math.round(bb.x - padding) - r, y = Math.round(bb.y - padding) - r, gap = 0, off = 0, dx = 0, dy = 0, shapes = null, mask = null, out = null;
                if(o.width) {
                    w = w > o.width ? w : o.width;
                }
                if(o.height) {
                    h = h > o.height ? h : o.height;
                }
                this.width = w;
                this.height = h;
                gap = Math.min(h / 4, w / 4, gapLength);
                if(offsetLength) {
                    offsetLength = Math.min(h / 4, w / 4, offsetLength);
                }
                if(offsetLength) {
                    off = offsetLength;
                    shapes = {
                        top: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}" + "v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}l-{right}," + "0-{offset},0,-{left},0a{r},{r},0,0,1-{r}-{r}" + "v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
                        bottom: "M{x},{y}l{left},0,{offset},0,{right},0a{r},{r}," + "0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r}," + "{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}" + "v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
                        right: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}" + "v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}" + "h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}" + "l0-{bottom},0-{offset},0-{top}a{r},{r},0,0,1,{r}-{r}z",
                        left: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}" + "l0,{top},0,{offset},0,{bottom}a{r},{r},0,0,1,-{r}," + "{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}" + "v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z"
                    };
                } else {
                    shapes = {
                        top: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}" + "v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}" + "l-{right},0-{gap},{gap}-{gap}-{gap}-{left},0a{r},{r},0,0,1" + "-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
                        bottom: "M{x},{y}l{left},0,{gap}-{gap},{gap},{gap},{right},0" + "a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1," + "-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0," + "1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
                        right: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}" + "v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}" + "-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}l0-{bottom}-{gap}-{gap}," + "{gap}-{gap},0-{top}a{r},{r},0,0,1,{r}-{r}z",
                        left: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}" + "l0,{top},{gap},{gap}-{gap},{gap},0,{bottom}a{r},{r},0,0,1," + "-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}" + "v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z"
                    };
                }
                mask = [
                    {
                        x: x + r,
                        y: y,
                        w: w,
                        w4: w / 4,
                        h4: h / 4,
                        left: 0,
                        right: w - gap * 2 - off * 2,
                        top: 0,
                        bottom: h - gap * 2 - off * 2,
                        r: r,
                        h: h,
                        gap: gap,
                        offset: off * 2
                    }, 
                    {
                        x: x + r,
                        y: y,
                        w: w,
                        w4: w / 4,
                        h4: h / 4,
                        left: w / 2 - gap - off,
                        right: w / 2 - gap - off,
                        top: h / 2 - gap - off,
                        bottom: h / 2 - gap - off,
                        r: r,
                        h: h,
                        gap: gap,
                        offset: off * 2
                    }, 
                    {
                        x: x + r,
                        y: y,
                        w: w,
                        w4: w / 4,
                        h4: h / 4,
                        right: 0,
                        left: w - gap * 2 - off * 2,
                        bottom: 0,
                        top: h - gap * 2 - off * 2,
                        r: r,
                        h: h,
                        gap: gap,
                        offset: off * 2
                    }
                ][pos[1] === "middle" ? 1 : ((pos[1] === "left" || pos[1] === "top") ? 1 : 0) * 2];
                out = this.paper.path(ChartTooltip.fill(shapes[pos[0]], mask));
                switch(pos[0]) {
                    case "top":
                        dx = point.x - (x + r + mask.left + gap + offsetLength);
                        dy = point.y - (y + r + h + r + gap + offsetLength);
                        break;
                    case "bottom":
                        dx = point.x - (x + r + mask.left + gap + offsetLength);
                        dy = point.y - (y - gap - offsetLength);
                        break;
                    case "left":
                        dx = point.x - (x + r + w + r + gap + offsetLength);
                        dy = point.y - (y + r + mask.top + gap + offsetLength);
                        break;
                    case "right":
                        dx = point.x - (x - gap - off);
                        dy = point.y - (y + r + mask.top + gap + off);
                        break;
                }
                out.translate(dx, dy);
                //set.translate(dx, dy);
                set.transform(Raphael.format("...t{0},{1}", dx, dy));
                return out;
            };
            ChartTooltip.prototype._isWindowCollision = function (container, compass, offsetX, offsetY, ox, oy, windowCollisionDetection) {
                var box = container.getBBox(), counter = 0, cps = compass.toLowerCase(), x = box.x + ox, y = box.y + oy, w = this.paper.width, h = this.paper.height, offX = offsetX, offY = offsetY, strokeWidth = container.attr("stroke-width"), flip = windowCollisionDetection === true || windowCollisionDetection === "flip";
                if(Raphael.vml) {
                    w = $(this.paper.canvas).width();
                    h = $(this.paper.canvas).height();
                }
                if(x - strokeWidth < 0) {
                    // counter++;
                    if(flip) {
                        if(cps.toLowerCase().indexOf("west") === -1) {
                            // check if window collision after change compass.
                            if(x + box.width / 2 + box.width - offsetX <= w) {
                                counter++;
                                cps = cps.toLowerCase() + "east";
                                offX = 0 - offsetX;
                            }
                        } else {
                            if(x + box.width + box.width - offsetX <= w) {
                                counter++;
                                cps = cps.toLowerCase().replace("west", "east");
                                offX = 0 - offsetX;
                            }
                        }
                    } else {
                        //fit
                        counter++;
                        offX = 0 - x + strokeWidth + offsetX;
                    }
                }
                if(y - strokeWidth < 0) {
                    if(flip) {
                        // counter++;
                        if(cps.toLowerCase().indexOf("north") === -1) {
                            // check if window collision after change compass.
                            if(y + box.height / 2 + box.height - offsetY <= h) {
                                counter++;
                                cps = cps.toLowerCase() + "south";
                                offY = 0 - offsetY;
                            }
                        } else {
                            if(y + box.height + box.height - offsetY <= h) {
                                counter++;
                                cps = cps.toLowerCase().replace("north", "south");
                                offY = 0 - offsetY;
                            }
                        }
                    } else {
                        //fit
                        counter++;
                        offY = 0 - y + strokeWidth + offsetY;
                    }
                }
                if(x + box.width + strokeWidth > w) {
                    if(flip) {
                        // counter++;
                        if(cps.toLowerCase().indexOf("east") === -1) {
                            // check if window collision after change compass.
                            if(x - box.width / 2 - offsetX >= 0) {
                                counter++;
                                cps = cps.toLowerCase() + "west";
                                offX = 0 - offsetX;
                            }
                        } else {
                            if(x - box.width - offsetX >= 0) {
                                counter++;
                                cps = cps.toLowerCase().replace("east", "west");
                                offX = 0 - offsetX;
                            }
                        }
                    } else {
                        //fit
                        counter++;
                        offX = w - (x + box.width + strokeWidth) + offsetX;
                    }
                }
                if(y + box.height + strokeWidth > h) {
                    if(flip) {
                        // counter++;
                        if(cps.toLowerCase().indexOf("south") === -1) {
                            // check if window collision after change compass.
                            if(y - box.height / 2 - offsetY >= 0) {
                                counter++;
                                cps = cps.toLowerCase() + "north";
                                offY = 0 - offsetY;
                            }
                        } else {
                            if(y - box.height - offsetY >= 0) {
                                counter++;
                                cps = cps.toLowerCase().replace("south", "north");
                                offY = 0 - offsetY;
                            }
                        }
                    } else {
                        //fit
                        counter++;
                        offY = h - (y + box.height + strokeWidth) + offsetY;
                    }
                }
                if(counter) {
                    return {
                        compass: cps,
                        offsetX: offX,
                        offsetY: offY
                    };
                }
                return false;
            };
            ChartTooltip.prototype._createTooltipEles = function (point, tit, cont, windowCollisionDetection, compass, offsetX, offsetY) {
                var _this = this;
                var titleBox, contentBox, position, set = this.paper.set(), arrPath = null, animated = null, o = this.options, closeBtnLength = this.closeBtnLength, calloutOffset = this.calloutOffset, op = null, ox = 0, oy = 0, duration = 250, idx = 0, len = 0, isWindowCollision, newPoint = {
                    x: point.x,
                    y: point.y
                }, offset = this.offset, anim = null, trans = null;
                $.wijraphael.clearRaphaelCache();
                position = this._convertCompassToPosition(compass);
                newPoint.x += offsetX + offset.x;
                newPoint.y += offsetY + offset.y;
                this.elements = this.paper.set();
                if(this.title) {
                    $.each(this.title, function (i, t) {
                        $(t.node).unbind(".Rtooltip");
                    });
                    this.title.wijRemove();
                }
                if(tit && tit.length > 0) {
                    this.title = this.paper.htmlText(-1000, -1000, tit, o.titleStyle);
                    this.elements.push(this.title);
                    titleBox = this.title.getBBox();
                } else {
                    titleBox = {
                        left: -1000,
                        top: -1000,
                        width: 0,
                        height: 0
                    };
                }
                if(this.content) {
                    $.each(this.content, function (i, c) {
                        $(c.node).unbind(".Rtooltip");
                    });
                    this.content.wijRemove();
                }
                if(cont && cont.length > 0) {
                    this.content = this.paper.htmlText(-1000, -1000, cont, o.contentStyle);
                    this.elements.push(this.content);
                    contentBox = this.content.getBBox();
                } else {
                    contentBox = {
                        left: -1000,
                        top: -1000,
                        width: 0,
                        height: 0
                    };
                }
                if(this.closeBtn) {
                    for(idx = 0 , len = this.closeBtn.length; idx < len; idx++) {
                        this.closeBtn[idx].unclick();
                    }
                    this.closeBtn.wijRemove();
                }
                if(this.content) {
                    // content.translate(0, titleBox.height / 2 +
                    // contentBox.height / 2);
                    this.content.transform(Raphael.format("T0,{0}", titleBox.height / 2 + contentBox.height / 2));
                }
                if(this.title) {
                    // content.translate(0, titleBox.height / 2 +
                    // contentBox.height / 2);
                    this.title.transform(Raphael.format("T0,{0}", 0));
                }
                if(o.closeBehavior === "sticky") {
                    this.closeBtn = this.paper.closeBtn(-1000, -1000, closeBtnLength);
                    this.elements.push(this.closeBtn);
                    if(o.width && o.width > titleBox.width + closeBtnLength * 2 && o.width > contentBox.width + closeBtnLength * 2) {
                        // closeBtn.translate(o.width - closeBtnLength,
                        // closeBtnLength);
                        this.closeBtn.transform(Raphael.format("T{0},{1}", o.width - closeBtnLength, closeBtnLength));
                    } else if(titleBox.width >= contentBox.width - closeBtnLength * 2) {
                        // closeBtn.translate(titleBox.width +
                        // closeBtnLength, closeBtnLength);
                        this.closeBtn.transform(Raphael.format("T{0},{1}", titleBox.width + closeBtnLength, closeBtnLength));
                    } else {
                        // closeBtn.translate(contentBox.width -
                        // closeBtnLength, closeBtnLength);
                        this.closeBtn.transform(Raphael.format("T{0},{1}", contentBox.width - closeBtnLength, closeBtnLength));
                    }
                    // bind click event.
                    $.each(this.closeBtn, function (i, btn) {
                        var self = _this;
                        btn.click(function (e) {
                            self._hide(e);
                        });
                    });
                }
                if(this.title) {
                    set.push(this.title);
                    if(o.relatedElement) {
                        this.title.insertBefore(o.relatedElement);
                    }
                }
                if(this.content) {
                    set.push(this.content);
                    if(o.relatedElement) {
                        this.content.insertBefore(o.relatedElement);
                    }
                }
                if(this.closeBtn) {
                    set.push(this.closeBtn);
                    if(o.relatedElement) {
                        this.closeBtn.insertBefore(o.relatedElement);
                    }
                }
                if(!o.showCallout) {
                    this.gapLength = 0;
                }
                if(o.calloutSide || o.calloutFilled) {
                    this.gapLength = 0;
                    this.offsetLength = o.calloutLength / 2;
                    if(o.calloutSide) {
                        position = this._convertCompassToPosition(o.calloutSide);
                    }
                }
                if(o.calloutSide && set.length === 0) {
                    this.content = this.paper.htmlText(-1000, -1000, " ");
                    set.push(this.content);
                    if(o.relatedElement) {
                        this.content.insertBefore(o.relatedElement);
                    }
                }
                if(this.callout) {
                    $(this.callout.node).unbind(".Rtooltip");
                    this.callout.wijRemove();
                }
                if(this.container) {
                    $(this.container.node).unbind(".Rtooltip");
                    this.container.wijRemove();
                }
                // container = self.path();
                if(this.lastPoint) {
                    if(o.showCallout && (o.calloutSide || o.calloutFilled)) {
                        arrPath = this._getCalloutArr(this.lastPoint, this.offsetLength);
                        this.callout = this.paper.path(arrPath.concat(" "));
                        if(o.relatedElement) {
                            this.callout.insertBefore(o.relatedElement);
                        }
                        if(o.calloutFilled) {
                            this.callout.attr(o.calloutFilledStyle);
                        }
                        if(o.calloutSide) {
                            this._translateCallout(0);
                        }
                    }
                    this.container = this._createPath(this.lastPoint, position, set);
                    if(o.relatedElement) {
                        this.container.insertBefore(o.relatedElement);
                    }
                    if(windowCollisionDetection) {
                        isWindowCollision = this._isWindowCollision(this.container, compass, offsetX, offsetY, newPoint.x - this.lastPoint.x, newPoint.y - this.lastPoint.y, windowCollisionDetection);
                        // TODO: window collision
                        if(isWindowCollision) {
                            this._createTooltipEles(point, tit, cont, false, isWindowCollision.compass, isWindowCollision.offsetX, isWindowCollision.offsetY);
                            return;
                        }
                    }
                    this.elements.push(this.callout);
                    this.elements.push(this.container);
                    ox = newPoint.x - this.lastPoint.x;
                    oy = newPoint.y - this.lastPoint.y;
                    trans = Raphael.format("...T{0},{1}", ox, oy);
                    anim = Raphael.animation({
                        transform: trans
                    }, duration);
                    if(this.container) {
                        // container.animate({ "translation": ox + "," + oy },
                        // duration);
                        if(o.showAnimated || o.animated) {
                            this.container.animate(anim);
                        } else {
                            this.container.attr("transform", trans);
                        }
                    }
                    if(this.title) {
                        // title.animate({ "translation": ox + "," + oy },
                        // duration);
                        if(o.showAnimated || o.animated) {
                            this.title.animate(anim);
                        } else {
                            this.title.attr("transform", trans);
                        }
                    }
                    if(this.content) {
                        // content.animate({ "translation": ox + "," + oy },
                        // duration);
                        if(o.showAnimated || o.animated) {
                            this.content.animate(anim);
                        } else {
                            this.content.attr("transform", trans);
                        }
                    }
                    if(this.closeBtn) {
                        // closeBtn.animate({ "translation": ox + "," + oy },
                        // duration);
                        if(o.showAnimated || o.animated) {
                            this.closeBtn.animate(anim);
                        } else {
                            this.closeBtn.attr("transform", trans);
                        }
                    }
                    if(this.callout) {
                        // callout.animate({ "translation": ox + "," + oy },
                        // duration);
                        if(o.showAnimated || o.animated) {
                            this.callout.animate(anim);
                        } else {
                            this.callout.attr("transform", trans);
                        }
                    }
                } else {
                    if(o.showCallout && (o.calloutSide || o.calloutFilled)) {
                        arrPath = this._getCalloutArr(newPoint, this.offsetLength);
                        this.callout = this.paper.path(arrPath.concat(" "));
                        if(o.relatedElement) {
                            this.callout.insertBefore(o.relatedElement);
                        }
                        if(o.calloutFilled) {
                            this.callout.attr(o.calloutFilledStyle);
                        }
                        if(o.calloutSide) {
                            this._translateCallout(0);
                        }
                    }
                    this.container = this._createPath(newPoint, position, set);
                    if(o.relatedElement) {
                        this.container.insertBefore(o.relatedElement);
                    }
                    if(windowCollisionDetection) {
                        isWindowCollision = this._isWindowCollision(this.container, compass, offsetX, offsetY, 0, 0, windowCollisionDetection);
                        // TODO: window collision
                        if(isWindowCollision) {
                            this._createTooltipEles(point, tit, cont, false, isWindowCollision.compass, isWindowCollision.offsetX, isWindowCollision.offsetY);
                            return;
                        }
                    }
                    this.elements.push(this.callout);
                    this.elements.push(this.container);
                    if(o.showAnimated || o.animated) {
                        animated = o.showAnimated;
                        if(!animated) {
                            animated = o.animated;
                        }
                        if(animated && ChartTooltip.animations[animated]) {
                            op = {
                                animated: animated,
                                duration: o.showDuration || o.duration,
                                easing: o.showEasing || o.easing,
                                context: this.elements,
                                show: true
                            };
                            ChartTooltip.animations[animated](op);
                        }
                    }
                }
                this.lastPoint = newPoint;
                this.container.attr(o.style);
                // container.toFront();
                if(o.relatedElement) {
                    if(this.title) {
                        this.title.insertBefore(o.relatedElement);
                    }
                    if(this.content) {
                        this.content.insertBefore(o.relatedElement);
                    }
                    if(this.closeBtn) {
                        this.closeBtn.insertBefore(o.relatedElement);
                    }
                } else {
                    set.toFront();
                }
                // set.toFront();
                /*
                * if (o.closeBehavior === "auto") {
                * $(container.node).bind("mouseover.Rtooltip", function (e) {
                * _clearTimers(); }).bind("mouseout.Rtooltip", function (e) {
                * _hide(e); }); if (title) { $.each(title, function (i, t) {
                * $(t.node).bind("mouseover.Rtooltip", function (e) {
                * _clearTimers(); }).bind("mouseout.Rtooltip", function (e) {
                * _hide(e); }); }); } if (content) { $.each(content, function
                * (i, c) { $(c.node).bind("mouseover.Rtooltip", function (e) {
                * _clearTimers(); }).bind("mouseout.Rtooltip", function (e) {
                * _hide(e); }); }); } if (callout) {
                * $(callout.node).bind("mouseover.Rtooltip", function (e) {
                * _clearTimers(); }).bind("mouseout.Rtooltip", function (e) {
                * _hide(e); }); } }
                */
                            };
            ChartTooltip.prototype._createTooltip = function (point, e) {
                var tit = null, cont = null, fmt = null, obj = null, o = this.options, objTar, t;
                if($.isFunction(o.beforeShowing)) {
                    fmt = null;
                    obj = {
                        target: null,
                        options: o,
                        fmt: o.beforeShowing
                    };
                    if(e && e.target) {
                        // objTar = $(e.target).data("raphaelObj");
                        // if (!objTar) {
                        // objTar = $(e.target.parentNode).data("raphaelObj");
                        // }
                        // obj.target = objTar;
                        t = e.target;
                        if(!t.raphael || !t.raphaelid) {
                            t = t.parentNode;
                        }
                        if(t.raphael && t.raphaelid) {
                            objTar = this.paper.getById(t.raphaelid);
                            obj.target = objTar;
                        } else {
                            objTar = e.target;
                            obj.target = objTar;
                        }
                    }
                    fmt = $.proxy(obj.fmt, obj);
                    if(fmt() === false) {
                        return;
                    }
                    ;
                }
                tit = o.title;
                cont = o.content;
                tit = this._getFuncText(tit, e);
                cont = this._getFuncText(cont, e);
                if(!tit && !cont) {
                    return;
                }
                this._createTooltipEles(point, tit, cont, o.windowCollisionDetection, o.compass, o.offsetX, o.offsetY);
            };
            ChartTooltip.prototype._showAt = function (point, e) {
                var o = this.options, self = this;
                this._clearTimers();
                if(o.showDelay) {
                    this.intentShowTimer = window.setTimeout(function () {
                        self._createTooltip(point, e);
                    }, o.showDelay);
                } else {
                    this._createTooltip(point, e);
                }
            };
            ChartTooltip.prototype._show = function (e) {
                var position = $(this.paper.canvas.parentNode).offset(), offsetX = position.left, offsetY = position.top, o = this.options, relativeTo = o.relativeTo, point = {
                    x: 0,
                    y: 0
                }, raphaelObj = null, t = e.target;
                switch(relativeTo) {
                    case "mouse":
                        point.x = e.pageX - offsetX;
                        point.y = e.pageY - offsetY;
                        break;
                    case "element":
                        if(!t.raphael || !t.raphaelid) {
                            t = t.parentNode;
                        }
                        if(t.raphael && t.raphaelid) {
                            raphaelObj = this.paper.getById(t.raphaelid);
                            point = this._getShowPoint(raphaelObj, o.compass);
                        }
                        break;
                }
                this._showAt(point, e);
            };
            ChartTooltip.prototype._bindEvent = function (tar) {
                var o = this.options, self = this;
                switch(o.triggers) {
                    case "hover":
                        $(tar.node).bind("mouseover.Rtooltip", function (e) {
                            self._show(e);
                        }).bind("mouseout.Rtooltip", function (e) {
                            if(o.closeBehavior === "auto") {
                                self._hide(e);
                            }
                        });
                        if(o.mouseTrailing && o.relativeTo === "mouse") {
                            $(tar.node).bind("mousemove.Rtooltip", function (e) {
                                self._show(e);
                            });
                        }
                        break;
                    case "click":
                        $(tar.node).bind("click.Rtooltip", function (e) {
                            self._show(e);
                        });
                        break;
                    case "custom":
                        break;
                        /*
                        * case "rightClick": $(tar.node).bind("contextmenu.Rtooltip",
                        * function (e) { _show(e); }); break;
                        */
                                        }
            };
            ChartTooltip.prototype._bindLiveEvent = function (tars) {
                var i, ii;
                if(tars) {
                    if(tars.length) {
                        for(i = 0 , ii = tars.length; i < ii; i++) {
                            this._bindEvent(tars[i]);
                        }
                    } else {
                        this._bindEvent(tars);
                    }
                }
            };
            ChartTooltip.prototype._bindLiveEventBySelector = function (selector) {
                var o = this.options, self = this;
                if(selector) {
                    switch(o.triggers) {
                        case "hover":
                            selector.on("mouseover.Rtooltip", function (e) {
                                self._show(e);
                            }).on("mouseout.Rtooltip", function (e) {
                                if(o.closeBehavior === "auto") {
                                    self._hide(e);
                                }
                            });
                            if(o.mouseTrailing && o.relativeTo === "mouse") {
                                selector.on("mousemove.Rtooltip", function (e) {
                                    self._show(e);
                                });
                            }
                            break;
                        case "click":
                            selector.on("click.Rtooltip", function (e) {
                                self._show(e);
                            });
                            break;
                        case "custom":
                            break;
                    }
                }
            };
            ChartTooltip.prototype._unbindLiveEvent = function (targets, selector) {
                var i, ii;
                if(targets) {
                    if(targets.length) {
                        for(i = 0 , ii = targets.length; i < ii; i++) {
                            $(targets[i].node).unbind(".Rtooltip");
                        }
                    } else {
                        $(targets.node).unbind(".Rtooltip");
                    }
                }
                if(selector) {
                    selector.off("Rtooltip").off(// for jQuery 1.7.1
                    ".Rtooltip");
                }
            };
            ChartTooltip.prototype._destroy = function () {
                this._unbindLiveEvent(this.targets, this.selector);
                this._removeTooltip(0);
            };
            ChartTooltip.prototype.hide = function () {
                this._hide();
            };
            ChartTooltip.prototype.showAt = function (point, e) {
                this._showAt(point, e);
            };
            ChartTooltip.prototype.resetCalloutOffset = function (offset) {
                var o = this.options, currentOffset = o.calloutOffset, side = o.calloutSide, ani = o.calloutAnimation, tooltipElements = this.tooltipElements;
                if(tooltipElements.callout) {
                    if(side === "south" || side === "north") {
                        tooltipElements.callout.animate({
                            "translation": (offset - currentOffset) + ",0"
                        }, ani.duration, ani.easing);
                    } else if(side === "east" || side === "west") {
                        tooltipElements.callout.animate({
                            "translation": "0," + (offset - currentOffset)
                        }, ani.duration, ani.easing);
                    }
                }
                o.calloutOffset = offset;
            };
            ChartTooltip.prototype.destroy = function () {
                this._destroy();
            };
            ChartTooltip.prototype.getOptions = function () {
                return this.options;
            };
            ChartTooltip.prototype.setTargets = function (targets) {
                this.targets = targets;
                this._bindLiveEvent(targets);
            };
            ChartTooltip.prototype.setSelector = function (selector) {
                this.selector = selector;
                this._bindLiveEventBySelector(selector);
            };
            ChartTooltip.prototype.setOptions = function (opts) {
                $.extend(true, this.options, opts);
            };
            ChartTooltip.animations = {
                fade: function (options) {
                    var eles = options.context;
                    if(options.show) {
                        eles.attr({
                            "opacity": 0
                        });
                        eles.wijAnimate({
                            "opacity": 1
                        }, options.duration, options.easing);
                    } else {
                        eles.wijAnimate({
                            "opacity": 0
                        }, options.duration, options.easing);
                    }
                }
            };
            return ChartTooltip;
        })();
        chart.ChartTooltip = ChartTooltip;        
        //for original API
        Raphael.fn.tooltip = {
            animations: ChartTooltip.animations
        };
        /** @ignore */
        var AdjustLabel = (function () {
            function AdjustLabel(bBox) {
                this.labels = [];
                this.crossLabels = {
                };
                this.bBox = bBox;
            }
            AdjustLabel.prototype.push = function (label) {
                var bBox = label.wijGetBBox();
                this.labels.push({
                    ele: label,
                    x: bBox.x,
                    y: bBox.y,
                    width: bBox.width,
                    height: bBox.height,
                    overlaps: [],
                    bakBBox: bBox
                });
            };
            AdjustLabel.prototype.pushCross = function (idx1, idx2) {
                var label1, label2, dx, dy, tmp;
                if(!this.crossLabels[Raphael.format("{0}-{1}", idx1, idx2)] && !this.crossLabels[Raphael.format("{0}-{1}", idx2, idx1)]) {
                    label1 = this.labels[idx1];
                    label2 = this.labels[idx2];
                    this.crossLabels[Raphael.format("{0}-{1}", idx1, idx2)] = {
                        label1: label1,
                        label2: label2,
                        dx: this._getAdjust(label1, label2, "h"),
                        dy: this._getAdjust(label1, label2, "v")
                    };
                }
            };
            AdjustLabel.prototype._detect = function (label1, label2) {
                return ((label1.x + label1.width > label2.x && label1.x < label2.x) || (label2.x + label2.width > label1.x && label2.x < label1.x)) && ((label1.y + label1.height > label2.y && label1.y < label2.y) || (label2.y + label2.height > label1.y && label2.y < label1.y));
            };
            AdjustLabel.prototype._resetOverlaps = function () {
                this.crossLabels = {
                };
            };
            AdjustLabel.prototype._detects = function () {
                var len = this.labels.length, label1, label2;
                for(var i = 0; i < len; i++) {
                    for(var j = i + 1; j < len; j++) {
                        label1 = this.labels[i];
                        label2 = this.labels[j];
                        if(this._detect(label1, label2)) {
                            this.pushCross(i, j);
                        }
                    }
                }
            };
            AdjustLabel.prototype._getAdjust = function (label1, label2, dir) {
                var obj = {
                    dx: 0,
                    needRevert: false
                };
                if(dir === "h") {
                    if(label1.x < label2.x) {
                        obj.dx = label1.x + label1.width - label2.x;
                    } else {
                        obj.dx = label2.x + label2.width - label1.x;
                        obj.needRevert = true;
                    }
                } else {
                    if(label1.y < label2.y) {
                        obj.dx = label1.y + label1.height - label2.y;
                    } else {
                        obj.dx = label2.y + label2.height - label1.y;
                        obj.needRevert = true;
                    }
                }
                return obj;
            };
            AdjustLabel.prototype._adjustlabel = function (label1, label2, dx, dir) {
                if(dir === "h") {
                    label1.x -= dx / 2;
                    label2.x += dx / 2;
                    if(this.bBox) {
                        if(label1.x < this.bBox.x) {
                            label1.x = this.bBox.x;
                            label2.x = label2.x + (this.bBox.x - label1.x);
                        } else if(label2.x > this.bBox.x + this.bBox.width) {
                            label2.x = this.bBox.x + this.bBox.width;
                            label1.x -= label2.x - this.bBox.x + this.bBox.width;
                        }
                    }
                } else {
                    label1.y -= dx / 2;
                    label2.y += dx / 2;
                    if(this.bBox) {
                        if(label1.y < this.bBox.y) {
                            label1.y = this.bBox.y;
                            label2.y = label2.y + (this.bBox.y - label1.y);
                        } else if(label2.y > this.bBox.y + this.bBox.height) {
                            label2.y = this.bBox.y + this.bBox.height;
                            label1.y -= label2.y - this.bBox.y + this.bBox.height;
                        }
                    }
                }
            };
            AdjustLabel.prototype._adjustInternal = function () {
                var _this = this;
                $.each(this.crossLabels, function (i, labelObj) {
                    var label1 = labelObj.label1, label2 = labelObj.label2, dx = labelObj.dx, dy = labelObj.dy;
                    if(dx.dx < dy.dx) {
                        if(dy.needRevert) {
                            _this._adjustlabel(label2, label1, dy.dx, "v");
                        } else {
                            _this._adjustlabel(label1, label2, dy.dx, "v");
                        }
                    } else {
                        if(dx.needRevert) {
                            _this._adjustlabel(label2, label1, dx.dx, "h");
                        } else {
                            _this._adjustlabel(label1, label2, dx.dx, "h");
                        }
                    }
                });
            };
            AdjustLabel.prototype._adjustTheEdge = function () {
                var _this = this;
                if(this.bBox) {
                    $.each(this.labels, function (i, label) {
                        if(label.x < _this.bBox.x) {
                            label.x = _this.bBox.x;
                        } else if(label.x + label.width > _this.bBox.x + _this.bBox.width) {
                            label.x = _this.bBox.x + _this.bBox.width - label.width;
                        }
                        if(label.y < _this.bBox.y) {
                            label.y = _this.bBox.y;
                        } else if(label.y + label.height > _this.bBox.y + _this.bBox.height) {
                            label.y = _this.bBox.y + _this.bBox.height - label.height;
                        }
                    });
                }
            };
            AdjustLabel.prototype._translateLabels = function () {
                $.each(this.labels, function (i, label) {
                    if(label.x !== label.bakBBox.x) {
                        label.ele.attr("x", label.x + label.width / 2);
                        label.bakBBox.x = label.x;
                    }
                    if(label.y !== label.bakBBox.y) {
                        label.ele.attr("y", label.y + label.height / 2);
                        label.bakBBox.y = label.y;
                    }
                });
            };
            AdjustLabel.prototype.adjust = function () {
                var maxCalculate = 1000;
                while(maxCalculate > 0) {
                    this._resetOverlaps();
                    this._adjustTheEdge();
                    this._detects();
                    if($.isEmptyObject(this.crossLabels)) {
                        break;
                    }
                    maxCalculate--;
                    this._adjustInternal();
                }
                this._translateLabels();
            };
            return AdjustLabel;
        })();
        chart.AdjustLabel = AdjustLabel;        
        /** @widget */
        var wijchartcore = (function (_super) {
            __extends(wijchartcore, _super);
            function wijchartcore() {
                _super.apply(this, arguments);

                this.innerState = {
                };
            }
            wijchartcore.prototype._setOption = function (key, value) {
                var self = this, o = self.options, ev = null, len = 0, idx = 0, oldXMajorFactor = o.axis.x.tickMajor.factor, oldXMinorFactor = o.axis.x.tickMinor.factor, oldYMajorFactor, oldYMinorFactor, bakYAxis, newYAxis, hoverStyleLen, baseAxis = //				oldYMajorFactor = o.axis.y.tickMajor.factor,
                //				oldYMinorFactor = o.axis.y.tickMinor.factor,
                wijchartcore.prototype.options.axis, oldYAxis, axisVal;
                /*
                if (key === "dataSource" || key === "data") {
                self.seriesTransition = true;
                o.dataSource = value;
                //restore the binded data
                if (self.seriesList) {
                o.seriesList = $.arrayClone(self.seriesList);
                }
                self._init();
                }
                */
                if(key === "dataSource") {
                    self.seriesTransition = true;
                    o.dataSource = value;
                    //restore the binded data
                    if(self.seriesList) {
                        o.seriesList = $.arrayClone(self.seriesList);
                    }
                    self._init();
                } else if(key === "data") {
                    self.seriesTransition = true;
                    o.data = value;
                    //restore the binded data
                    if(self.seriesList) {
                        o.seriesList = $.arrayClone(self.seriesList);
                    }
                    self._init();
                } else if(key === "seriesList") {
                    if(!value) {
                        value = [];
                    }
                    ev = $.Event("beforeserieschange");
                    if(self._trigger("beforeSeriesChange", ev, {
                        oldSeriesList: o.seriesList,
                        newSeriesList: value
                    }) === false) {
                        return false;
                    }
                    o.seriesList = value;
                    self.seriesList = $.arrayClone(value);
                    self._trigger("seriesChanged", null, value);
                    self.seriesTransition = true;
                    self._init();
                } else {
                    if($.isPlainObject(o[key])) {
                        if(key === "axis") {
                            if($.isArray(o.axis.y)) {
                                bakYAxis = $.arrayClone(o.axis.y);
                            } else {
                                bakYAxis = $.extend(true, {
                                }, o.axis.y);
                            }
                        }
                        //extend the axis from base chartcore.
                        if(key === "axis") {
                            //extend axis value first to prevent modify original data.
                            axisVal = $.extend(true, {
                            }, value);
                            //if min/max value is set, set autoMin and autoMax to false.
                            self._verifyAxisAutoMinMax(axisVal);
                            $.extend(true, o.axis.x, axisVal.x || {
                            });
                            if($.isArray(o.axis.y) || $.isArray(axisVal.y)) {
                                oldYAxis = {
                                };
                            } else {
                                oldYAxis = o.axis.y;
                            }
                            if($.isArray(axisVal.y)) {
                                $.each(axisVal.y, function (i, _yaxis) {
                                    axisVal.y[i] = $.extend(true, {
                                    }, baseAxis.y, oldYAxis, _yaxis);
                                });
                                o.axis.y = axisVal.y;
                            } else {
                                o.axis.y = $.extend(true, {
                                }, baseAxis.y, oldYAxis, axisVal.y);
                            }
                        } else {
                            $.extend(true, o[key], value);
                        }
                        if(key === "indicator") {
                            this._unbindCanvasEvents();
                            this._bindCanvasEvents();
                        }
                        if(key === "axis") {
                            newYAxis = o.axis.y;
                            if(o.axis.x.tickMajor.factor < 0) {
                                o.axis.x.tickMajor.factor = oldXMajorFactor;
                            }
                            if(o.axis.x.tickMinor.factor < 0) {
                                o.axis.x.tickMinor.factor = oldXMinorFactor;
                            }
                            //case origin y is object, now is object
                            if(!$.isArray(newYAxis)) {
                                if($.isArray(bakYAxis)) {
                                    oldYMajorFactor = bakYAxis[0].tickMajor.factor;
                                    oldYMinorFactor = bakYAxis[0].tickMinor.factor;
                                } else {
                                    oldXMajorFactor = bakYAxis.tickMajor.factor;
                                    oldXMinorFactor = bakYAxis.tickMinor.factor;
                                }
                                if(o.axis.y.tickMajor && o.axis.y.tickMajor.factor !== undefined && o.axis.y.tickMajor.factor < 0) {
                                    o.axis.y.tickMajor.factor = oldYMajorFactor;
                                }
                                if(o.axis.y.tickMinor && o.axis.y.tickMinor.factor !== undefined && o.axis.y.tickMinor.factor < 0) {
                                    o.axis.y.tickMinor.factor = oldYMinorFactor;
                                }
                            } else// case newYAxis is array
                             {
                                if(!$.isArray(bakYAxis)) {
                                    bakYAxis = [
                                        bakYAxis
                                    ];
                                }
                                $.each(newYAxis, function (i, yAxis) {
                                    var baky = bakYAxis[i] || {
                                    };
                                    if(baky.tickMajor && baky.tickMajor.factor && yAxis.tickMajor && yAxis.tickMajor.factor) {
                                        if(yAxis.tickMajor.factor < 0) {
                                            yAxis.tickMajor.factor = baky.tickMajor.factor;
                                        }
                                    }
                                    if(baky.tickMinor && baky.tickMinor.factor && yAxis.tickMinor && yAxis.tickMinor.factor) {
                                        if(yAxis.tickMinor.factor < 0) {
                                            yAxis.tickMinor.factor = baky.tickMinor.factor;
                                        }
                                    }
                                });
                            }
                        }
                    } else {
                        _super.prototype._setOption.call(this, key, value);
                        // o[key] = value;
                                            }
                }
                // Add for support disabled option at 2011/7/8
                if(key === "disabled") {
                    self._handleDisabledOption(value, self.chartElement);
                }
                // end for disabled option
                // fixed a issue that when set the disabled option,
                // because the chart is paint by
                // wij***chart plugin, and the disabled set to the plugin
                // as a value, not a refrence,
                // so the plugin's disabled value can't change
                // when set the disabled to charts.
                // now, we just repaint the chart.
                if(key === "seriesTransition" || key === "animation") {
                    //||
                    //	key === "disabled") {
                    return;
                }
                if(key === "hint") {
                    self._resetTooltip();
                    return;
                }
                len = o.seriesList.length;
                if(key === "seriesList" || key === "seriesStyles" || key === "seriesHoverStyles") {
                    //backup the styles. when drawed the charts, restore the styles.
                    if(key !== "seriesList") {
                        self._handleChartStyles();
                    }
                    self.styles = {
                        style: [].concat(o.seriesStyles.slice(0, o.seriesStyles.length)),
                        hoverStyles: [].concat(o.seriesHoverStyles.slice(0, o.seriesHoverStyles.length))
                    };
                    self._initStyles();
                }
                if(key === "seriesList" || key === "seriesHoverStyles") {
                    hoverStyleLen = o.seriesHoverStyles.length;
                    for(idx = hoverStyleLen; idx < len; idx++) {
                        o.seriesHoverStyles[idx] = o.seriesHoverStyles[idx % hoverStyleLen];
                    }
                }
                // fixed an issue that if set height and width option,
                // the chart element's height is not reset.
                if(key === "height" || key === "width") {
                    self.chartElement[key](value);
                }
                self.redraw();
            };
            wijchartcore.prototype._preHandleSeriesData = function () {
            };
            wijchartcore.prototype._initStyles = function () {
                var o = this.options, styles = o.seriesStyles, hoverStyles = o.seriesHoverStyles, stylesLen, seriesLen, hoverStylesLen, i;
                if(o.seriesList) {
                    seriesLen = o.seriesList.length || 0;
                }
                if(o.seriesStyles) {
                    stylesLen = o.seriesStyles.length || 0;
                }
                if(o.seriesHoverStyles) {
                    hoverStylesLen = o.seriesHoverStyles.length || 0;
                }
                if(seriesLen > stylesLen && stylesLen) {
                    for(i = stylesLen; i < seriesLen; i++) {
                        styles[i] = styles[i % stylesLen];
                    }
                }
                if(seriesLen > hoverStylesLen && hoverStylesLen) {
                    for(i = hoverStylesLen; i < seriesLen; i++) {
                        hoverStyles[i] = hoverStyles[i % hoverStylesLen];
                    }
                }
            };
            wijchartcore.prototype._verifyAxisAutoMinMax = function (axis) {
                var isNullOrUndefined = function (value) {
                    return value === null || typeof value === "undefined";
                };
                if(axis.x) {
                    if(!isNullOrUndefined(axis.x.min)) {
                        axis.x.autoMin = false;
                    } else {
                        axis.x.autoMin = true;
                    }
                    if(!isNullOrUndefined(axis.x.max)) {
                        axis.x.autoMax = false;
                    } else {
                        axis.x.autoMax = true;
                    }
                }
                if(axis.y) {
                    if($.isArray(axis.y)) {
                        $.each(axis.y, function (i, yaxis) {
                            if(!isNullOrUndefined(yaxis.min)) {
                                yaxis.autoMin = false;
                            } else {
                                yaxis.autoMin = true;
                            }
                            if(!isNullOrUndefined(yaxis.max)) {
                                yaxis.autoMax = false;
                            } else {
                                yaxis.autoMax = true;
                            }
                        });
                    } else {
                        if(!isNullOrUndefined(axis.y.min)) {
                            axis.y.autoMin = false;
                        } else {
                            axis.y.autoMin = true;
                        }
                        if(!isNullOrUndefined(axis.y.max)) {
                            axis.y.autoMax = false;
                        } else {
                            axis.y.autoMax = true;
                        }
                    }
                }
            };
            wijchartcore.prototype._create = function () {
                var self = this, o = self.options, width = o.width || self.element.width(), height = o.height || self.element.height(), newEle = null, canvas;
                // enable touch support:
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                //if min/max value is set, set autoMin and autoMax to false.
                self._verifyAxisAutoMinMax(o.axis);
                self.updating = 0;
                self.innerState = {
                };
                self.axisCompass = {
                };
                if(self.element.is(":hidden") && self.element.wijAddVisibilityObserver) {
                    self.element.wijAddVisibilityObserver(function () {
                        self.redraw();
                        if(self.element.wijRemoveVisibilityObserver) {
                            self.element.wijRemoveVisibilityObserver();
                        }
                    }, "wijchart");
                }
                // Add for parse date options for jUICE. D.H
                // TO DO
                if($.isFunction(window["wijmoASPNetParseOptions"])) {
                    window["wijmoASPNetParseOptions"](o);
                }
                // backup the styles. when drawed the charts, restore the styles.
                // when postback the styles, if doesn't clone the styles,
                // the serverside will get the extended styles. when the add a series data,
                // the extend style will wrong.
                self.styles = {
                    style: [].concat(o.seriesStyles.slice(0, o.seriesStyles.length)),
                    hoverStyles: [].concat(o.seriesHoverStyles.slice(0, o.seriesHoverStyles.length))
                };
                if(o.hint && typeof o.hint.content === "string" && window[o.hint.content]) {
                    o.hint.content = window[o.hint.content];
                }
                if(o.hint && typeof o.hint.title === "string" && window[o.hint.title]) {
                    o.hint.title = window[o.hint.title];
                }
                self.headerEles = [];
                self.footerEles = [];
                self.legendEles = [];
                self.axisEles = [];
                self.legends = [];
                self.legendIcons = [];
                self.legendDots = [];
                self.chartLabelEles = [];
                self.seriesEles = [];
                if(self.element.length > 0) {
                    if(self.element.is("table")) {
                        self._parseTable();
                        newEle = $("<div></div>");
                        if(width) {
                            newEle.css("width", width);
                        }
                        if(height) {
                            newEle.css("height", height);
                        }
                        self.element.after(newEle);
                        self.chartElement = newEle;
                    } else {
                        self.chartElement = self.element;
                    }
                    // Extend seriesStyle
                    self._initStyles();
                    // end for bug 16039
                    self.chartElement.addClass("ui-widget");
                    // if fail to create canvas, move element to body and recreate it
                    // the issue that creating canvas in ie9 when element is invisible.
                    try  {
                        canvas = Raphael(self.chartElement[0], width, height);
                    } catch (e) {
                        var displayCss = self.chartElement.css("display");
                        newEle = $("<div></div>").insertBefore(self.chartElement).append(self.chartElement);
                        self.chartElement.addClass("ui-helper-hidden-accessible").appendTo($('body'));
                        if(displayCss === "none") {
                            self.chartElement.css("display", "block");
                        }
                        canvas = Raphael(self.chartElement[0], width, height);
                        self.chartElement.appendTo(newEle).unwrap().removeClass("ui-helper-hidden-accessible");
                        if(displayCss === "none") {
                            self.chartElement.css("display", "none");
                        }
                    }
                    self.canvas = canvas;
                    //add comments to fix tfs issue 27816, if element's height is not set,
                    //element's height will be 4px larger than canvas's,
                    //so set height to element is height is 0;
                    if(height === 0 && o.height !== 0) {
                        self.element.height(canvas.height);
                    }
                    // end comments.
                    // add for fixing bug 16039 by wuhao 2011/7/7
                    if(o.disabled) {
                        self.disable();
                    }
                    // add custom attribute to canvas
                    // fixed the issue 20422 by dail on 2012-3-12, If user set
                    // rotation and scale. the transform will only effect on scale.
                    canvas.customAttributes.rotation = function (num) {
                        //return {transform: "...R" + num};
                        this.transform("...R" + num);
                    };
                    canvas.customAttributes.scale = function (num) {
                        //return {transform: "...S" + num};
                        this.transform("...S" + num);
                    };
                    canvas.customAttributes.translation = function (x, y) {
                        //return {transform: Raphael.format("...T{0},{1}", x, y)};
                        this.transform(Raphael.format("...T{0},{1}", x, y));
                    };
                    // end
                    self._bindLiveEvents();
                }
            };
            wijchartcore.prototype._handleChartStyles = function () {
                this._extendArrayFromBase("seriesStyles");
                this._extendArrayFromBase("seriesHoverStyles");
                var o = this.options, defFill = this._getDefFill();
                $.each(o.seriesStyles, function (idx, style) {
                    if(!style.fill) {
                        style.fill = defFill[idx];
                    }
                });
            };
            wijchartcore.prototype._extendArrayFromBase = function (optionName) {
                var result = $.extend(true, {
                }, wijchartcore.prototype.options[optionName], this.options[optionName]), newArr = [];
                $.each(result, function (i, n) {
                    newArr.push(n);
                });
                this.options[optionName] = newArr;
            };
            wijchartcore.prototype._getDefFill = function () {
                var defFill = [
                    "#00cc00", 
                    "#0099cc", 
                    "#0055cc", 
                    "#2200cc", 
                    "#8800cc", 
                    "#d9007e", 
                    "#ff0000", 
                    "#ff6600", 
                    "#ff9900", 
                    "#ffcc00", 
                    "#ffff00", 
                    "#ace600"
                ];
                return defFill;
            };
            wijchartcore.prototype._getCulture = function (name) {
                return Globalize.findClosestCulture(name || this.options.culture);
            };
            wijchartcore.prototype._handleDisabledOption = function (disabled, element) {
                var self = this;
                if(disabled) {
                    if(!self.disabledDiv) {
                        self.disabledDiv = self._createDisabledDiv(element);
                    }
                    self.disabledDiv.appendTo("body");
                } else {
                    if(self.disabledDiv) {
                        self.disabledDiv.remove();
                        self.disabledDiv = null;
                    }
                }
            };
            wijchartcore.prototype._createDisabledDiv = function (outerEle) {
                var self = this, o = self.options, ele = // Change your outerelement here
                outerEle || self.element, eleOffset = ele.offset(), disabledWidth = o.width || ele.outerWidth(), disabledHeight = o.height || ele.outerHeight(), disabledDiv;
                disabledDiv = $("<div></div>").css({
                    "z-index": "99999",
                    position: "absolute",
                    width: disabledWidth,
                    height: disabledHeight,
                    left: eleOffset.left,
                    top: eleOffset.top
                });
                if(Raphael.vml) {
                    disabledDiv.addClass(o.wijCSS.stateDisabled).css("background-color", "#fff");
                }
                return disabledDiv;
            };
            wijchartcore.prototype._bindData = function () {
                var self = this, o = self.options, dataSource = o.dataSource, seriesList = o.seriesList, shareData = o.data, sharedXList;
                $.each(seriesList, function (i, series) {
                    var data = series.data, dataX, dataY, dataY1, ds = series.dataSource || dataSource;
                    if(ds && data) {
                        dataX = data.x;
                        dataY = data.y;
                        dataY1 = data.y1;
                        if(dataX && dataX.bind) {
                            data.x = self._getBindData(ds, dataX.bind);
                        } else if(shareData && shareData.x && shareData.x.bind) {
                            if(sharedXList === undefined) {
                                sharedXList = self._getBindData(ds, shareData.x.bind);
                            }
                            data.x = sharedXList;
                        }
                        if(dataY && dataY.bind) {
                            data.y = self._getBindData(ds, dataY.bind);
                        }
                        if(dataY1 && dataY1.bind) {
                            data.y1 = self._getBindData(ds, dataY1.bind);
                        }
                    }
                });
            };
            wijchartcore.prototype._getBindData = function (dataSource, bind) {
                if($.isArray(dataSource)) {
                    var arr = [];
                    $.each(dataSource, function (i, data) {
                        if(data && data[bind] !== undefined) {
                            arr.push(data[bind]);
                        }
                    });
                    return arr;
                }
                return null;
            };
            wijchartcore.prototype._hanldSharedXData = function () {
                var self = this, o = self.options, seriesList = o.seriesList, data = o.data;
                if(data) {
                    $.each(seriesList, function (i, series) {
                        var d = series.data;
                        if(d.x === undefined || d.x === null && $.isArray(data.x)) {
                            d.x = data.x;
                        }
                    });
                }
            };
            wijchartcore.prototype._init = function () {
                var self = this, o = self.options;
                // back up the seriesList
                if(!self.rendered) {
                    self.seriesList = $.arrayClone(o.seriesList);
                }
                // bind dataSource
                self._bindData();
                self._hanldSharedXData();
                $.each(o.seriesList, function (i, series) {
                    var data = series.data, idx;
                    if(typeof data === 'undefined' || data === null) {
                        idx = $.inArray(series, o.seriesList);
                        o.seriesList.splice(idx, 1);
                    }
                });
                /*
                * o.seriesList = $.grep(o.seriesList, function(series, i) { var
                * data = series.data; if (typeof data === 'undefined' || data ===
                * null) { return false; } return true; });
                */
                if(!self.rendered) {
                    self._paint();
                }
                //super._init();
                            };
            wijchartcore.prototype.destroy = /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            function () {
                var self = this, o = self.options;
                self._unbindLiveEvents();
                self._clearChartElement();
                self.chartElement.removeClass("ui-widget");
                $("." + o.wijCSS.canvasObject, self.chartElement[0]).off(self.widgetName).off(// for jQuery 1.7.1
                "." + self.widgetName);
                if(self.element !== self.chartElement) {
                    self.chartElement.remove();
                }
                self.element.empty();
                if(self.styles) {
                    self.styles = null;
                }
                // Add for fixing bug 16039
                if(self.disabledDiv) {
                    self.disabledDiv.remove();
                    self.disabledDiv = null;
                }
                // end for bug 16039
                _super.prototype.destroy.call(this);
            };
            wijchartcore.prototype.getCanvas = /**
            * Returns a reference to the Raphael canvas object.
            * @returns {Raphael} Reference to raphael canvas object.
            * @example
            * $("#chartcore").wijchartcore("getCanvas")
            */
            function () {
                return this.canvas;
            };
            wijchartcore.prototype.addSeriesPoint = /**
            * Add series point to the series list.
            * @param {number} seriesIndex The index of the series that the point will be inserted to.
            * @param {object} point The point that will be inserted to.
            * @param {Boolean} shift A value that indicates whether to shift the first point.
            */
            function (seriesIndex, point, shift) {
                var seriesList = this.options.seriesList, series = null, data = null;
                if(seriesIndex >= seriesList.length) {
                    return;
                }
                series = seriesList[seriesIndex];
                data = series.data || [];
                data.x.push(point.x);
                data.y.push(point.y);
                if(shift) {
                    data.x.shift();
                    data.y.shift();
                }
                this._setOption("seriesList", seriesList);
            };
            wijchartcore.prototype.beginUpdate = /**
            * Suspend automatic updates to the chart while reseting the options.
            */
            function () {
                var self = this;
                self.updating++;
            };
            wijchartcore.prototype.endUpdate = /**
            * Restore automatic updates to the chart after the options has been reset.
            */
            function () {
                var self = this;
                self.updating--;
                self.redraw();
            };
            wijchartcore.prototype.redraw = /**
            * This method redraws the chart.
            * @param {?Boolean} drawIfNeeded A value that indicates whether to redraw the chart regardless of whether
            * the chart already exists. If true, then the chart is redrawn only if it was not already created. If false,
            * then the chart is redrawn, even if it already exists.
            */
            function (drawIfNeeded) {
                var self = this, o = self.options, width = 0, height = 0;
                if(self.updating > 0) {
                    return;
                }
                if(drawIfNeeded && self.rendered) {
                    return;
                }
                width = o.width || self.element.width();
                height = o.height || self.element.height();
                if(width < 1 || height < 1) {
                    return;
                }
                self.canvas.setSize(width, height);
                self._paint();
            };
            wijchartcore.prototype._parseTable = function () {
                if(!this.element.is("table")) {
                    return;
                }
                var self = this, ele = self.element, o = self.options, captions = // header & footer
                $("caption", ele), theaders = $("thead th", ele), seriesList = [], sList = $("tbody tr", ele);
                if(captions.length) {
                    o.header = $.extend({
                        visible: true,
                        text: $.trim($(captions[0]).text())
                    }, o.header);
                    if(captions.length > 1) {
                        o.footer = $.extend({
                            visibel: true,
                            text: $.trim($(captions[1]).text())
                        }, o.footer);
                    }
                }
                // legend
                o.legend = $.extend({
                    visible: true
                }, o.legend);
                self._getSeriesFromTR(theaders, sList, seriesList);
                self.options.seriesList = seriesList;
            };
            wijchartcore.prototype._getSeriesFromTR = function (theaders, sList, seriesList) {
                var valuesX = [], val = null, series = null;
                // seriesList
                if(theaders.length) {
                    theaders.each(function () {
                        val = $.trim($(this).text());
                        valuesX.push(val);
                    });
                }
                if(sList.length) {
                    sList.each(function () {
                        var th = $("th", $(this)), label = $.trim(th.text()), valuesY = [], tds = $("td", $(this));
                        if(tds.length) {
                            tds.each(function (idx, ele) {
                                var td = $(this);
                                valuesY.push(parseFloat($.trim(td.text())));
                            });
                        }
                        series = {
                            label: label,
                            legendEntry: true,
                            data: {
                                x: valuesX,
                                y: valuesY
                            }
                        };
                        seriesList.push(series);
                    });
                }
            };
            wijchartcore.prototype._destroyRaphaelArray = function (objs) {
                if(!objs) {
                    return;
                }
                var len = objs.length, i = 0, ele, obj;
                for(; len && i < len; i++) {
                    ele = objs[i];
                    if(ele && ele[0]) {
                        obj = $(ele.node);
                        obj.unbind().removeData();
                        ele.wijRemove();
                        obj.remove();
                        obj = null;
                    }
                    objs[i] = null;
                }
            };
            wijchartcore.prototype._clearChartElement = function () {
                var self = this, fields = self.chartElement.data("fields");
                self._destroyRaphaelArray(self.headerEles);
                self._destroyRaphaelArray(self.footerEles);
                self._destroyRaphaelArray(self.legendEles);
                self._destroyRaphaelArray(self.legends);
                self._destroyRaphaelArray(self.legendIcons);
                self._destroyRaphaelArray(self.legendDots);
                self._destroyRaphaelArray(self.axisEles);
                self._destroyRaphaelArray(self.chartLabelEles);
                if(self.tooltip) {
                    self.tooltip.destroy();
                    self.tooltip = null;
                }
                self.dataPoints = null;
                self.pointXs = null;
                if(fields && fields.trackers) {
                    self._destroyRaphaelArray(fields.trackers);
                    fields.trackers = null;
                }
                self.headerEles = [];
                self.footerEles = [];
                self.legendEles = [];
                self.legends = [];
                self.legendIcons = [];
                self.legendDots = [];
                self.axisEles = [];
                self.chartLabelEles = [];
                if(fields && fields.chartElements) {
                    $.each(fields.chartElements, function (key, eles) {
                        self._destroyRaphaelArray(eles);
                    });
                    fields.chartElements = null;
                }
                if(fields && fields.seriesEles) {
                    fields.seriesEles = null;
                }
                if(self.seriesEles) {
                    self.seriesEles = [];
                }
                self.canvas.clear();
                self.innerState = null;
                self.axisInfo = null;
                self.seriesGroup = null;
                self.lastAxisOffset = null;
                self.innerState = {
                };
            };
            wijchartcore.prototype._text = function (x, y, text) {
                var textElement = this.canvas.text(x, y, text);
                if(this.options.disableDefaultTextStyle) {
                    textElement.node["style"].cssText = "";
                }
                return textElement;
            };
            wijchartcore.prototype._paint = function () {
                var self = this, o = self.options, element = self.element, hidden = element.css("display") === "none" || element.css("visibility") === "hidden", oldLeft = {
                }, oldPosition = null;
                // ev = $.Event("beforepaint");
                if(hidden) {
                    oldLeft = element.css("left");
                    oldPosition = element.css("position");
                    element.css("left", "-10000px");
                    element.css("position", "absolute");
                    element.show();
                }
                if(element.is(":hidden")) {
                    if(hidden) {
                        element.css("left", oldLeft);
                        element.css("position", oldPosition);
                        element.hide();
                    }
                    return;
                }
                self._clearChartElement();
                if(self._trigger("beforePaint") === false) {
                    return;
                }
                // self._trigger("beforepaint", ev);
                self._preHandleSeriesData();
                self.canvasBounds = {
                    startX: 0,
                    endX: o.width || element.width(),
                    startY: 0,
                    endY: o.height || element.height()
                };
                self._paintHeader();
                self._paintFooter();
                self._paintLegend();
                self._paintChartArea();
                //self._paintChartLabels();
                if(o.indicator && o.indicator.visible) {
                    if(this.pointXs) {
                        this.pointXs = this.pointXs.sort(function (a, b) {
                            return a - b;
                        });
                    }
                }
                self._paintTooltip();
                self._trigger("painted");
                self.rendered = true;
                // restore the backup options.
                if(self.styles) {
                    o.seriesStyles = self.styles.style;
                    o.seriesHoverStyles = self.styles.hoverStyles;
                }
                //$.wijraphael.clearRaphaelCache();
                if(hidden) {
                    element.css("left", oldLeft);
                    element.css("position", oldPosition);
                    element.hide();
                }
            };
            wijchartcore.prototype._paintIndicater = // indicator tooltip
            function () {
            };
            wijchartcore.prototype._calculatePosition = function (compass, width, height) {
                var point = {
                    x: 0,
                    y: 0
                }, marginX = 5, marginY = 5, canvasBounds = this.canvasBounds;
                switch(compass) {
                    case "north":
                        point.x = (canvasBounds.endX - canvasBounds.startX) / 2;
                        point.y = canvasBounds.startY + height / 2 + marginY;
                        canvasBounds.startY = canvasBounds.startY + marginY * 2 + height;
                        break;
                    case "south":
                        point.x = (canvasBounds.endX - canvasBounds.startX) / 2;
                        point.y = canvasBounds.endY - height / 2 - marginY;
                        canvasBounds.endY = canvasBounds.endY - marginY * 2 - height;
                        break;
                    case "east":
                        point.x = canvasBounds.endX - width / 2 - marginX;
                        point.y = (canvasBounds.endY - canvasBounds.startY) / 2;
                        canvasBounds.endX = canvasBounds.endX - marginX * 2 - width;
                        break;
                    case "west":
                        point.x = canvasBounds.startX + width / 2 + marginX;
                        point.y = (canvasBounds.endY - canvasBounds.startY) / 2;
                        canvasBounds.startX = canvasBounds.startX + marginX * 2 + width;
                        break;
                }
                return point;
            };
            wijchartcore.prototype._paintHeader = function () {
                var headerMargin = 2, self = this, o = self.options, header = o.header, compass = null, headerText = null, textStyle = null, bBox = null, point = null, box = null, rotation = 0, headerContainer = null;
                if(header.text && header.text.length > 0 && header.visible) {
                    compass = header.compass;
                    headerText = self._text(0, 0, header.text);
                    $.wijraphael.addClass($(headerText.node), o.wijCSS.headerText);
                    // update for fixing bug 15884 at 2011/7/5
                    // textStyle = $.extend(true, {}, o.textStyle,
                    // header.textStyle);
                    rotation = self._getRotationByCompass(compass);
                    textStyle = $.extend(true, {
                    }, o.textStyle, header.textStyle);
                    // end for fixing bug 15884.
                    headerText.attr(textStyle);
                    headerText.transform("...R" + rotation);
                    bBox = headerText.wijGetBBox();
                    point = self._calculatePosition(compass, bBox.width, bBox.height);
                    // headerText.translate(point.x, point.y);
                    headerText.transform(Raphael.format("...T{0},{1}", point.x, point.y));
                    box = headerText.wijGetBBox();
                    headerContainer = self.canvas.rect(box.x - headerMargin, box.y - headerMargin, box.width + 2 * headerMargin, box.height + 2 * headerMargin);
                    $.wijraphael.addClass($(headerContainer.node), o.wijCSS.headerContainer);
                    headerContainer.attr(header.style);
                    headerContainer.toBack();
                    self.headerEles.push(headerText);
                    self.headerEles.push(headerContainer);
                }
            };
            wijchartcore.prototype._paintFooter = function () {
                var footerMargin = 2, self = this, o = self.options, footer = o.footer, compass = null, footerText = null, textStyle = null, bBox = null, point = null, box = null, rotation = 0, footerContainer = null;
                if(footer.text && footer.text.length > 0 && footer.visible) {
                    compass = footer.compass;
                    footerText = self._text(0, 0, footer.text);
                    $.wijraphael.addClass($(footerText.node), o.wijCSS.footerText);
                    // update for fixing bug 15884 at 2011/7/5
                    // textStyle = $.extend(true, {}, o.textStyle,
                    // footer.textStyle);
                    rotation = self._getRotationByCompass(compass);
                    textStyle = $.extend(true, {
                    }, o.textStyle, footer.textStyle);
                    // end for fixing bug 15884
                    footerText.attr(textStyle);
                    footerText.transform("...R" + rotation);
                    bBox = footerText.wijGetBBox();
                    point = self._calculatePosition(compass, bBox.width, bBox.height);
                    // footerText.translate(point.x, point.y);
                    footerText.transform(Raphael.format("...T{0},{1}", point.x, point.y));
                    box = footerText.wijGetBBox();
                    footerContainer = self.canvas.rect(box.x - footerMargin, box.y - footerMargin, box.width + 2 * footerMargin, box.height + 2 * footerMargin);
                    $.wijraphael.addClass($(footerContainer.node), o.wijCSS.footerContainer);
                    footerContainer.attr(footer.style);
                    footerContainer.toBack();
                    self.footerEles.push(footerText);
                    self.footerEles.push(footerContainer);
                }
            };
            wijchartcore.prototype._getRotationByCompass = function (compass) {
                var rotation = 0;
                if(compass === "east") {
                    rotation = 90;
                } else if(compass === "west") {
                    rotation = -90;
                }
                return rotation;
            };
            wijchartcore.prototype._paintLegendIcon = function (x, y, width, height, style, legendIndex, seriesIndex, legendCss, series, leg) {
                var self = this, icon = self.canvas.rect(x, y, width, height);
                $(icon.node).data("legendIndex", legendIndex).data("index", seriesIndex);
                self.legendIcons.push(icon);
                if(style) {
                    icon.attr(style);
                }
                $.wijraphael.addClass($(icon.node), legendCss);
                return icon;
            };
            wijchartcore.prototype._paintLegend = function () {
                if(!this.options.legend.visible) {
                    return;
                }
                var self = this, o = self.options, legend = $.extend(true, {
                    size: {
                        width: 22,
                        height: 10
                    }
                }, o.legend), legendMargin = 2, seriesStyles = o.seriesStyles, tempSeriesList = [].concat(o.seriesList), compass = legend.compass, orientation = legend.orientation, legendTitle, textStyle, legendLen, textMargin, canvasBounds = self.canvasBounds, canvasWidth = canvasBounds.endX - canvasBounds.startX, canvasHeight = canvasBounds.endY - canvasBounds.startY, iconWidth = legend.size.width, iconHeight = legend.size.height, titleBox, titleHeight = 0, titleWidth = 0, maxWidth = 0, maxHeight = 0, totalWidth = 0, totalHeight = 0, columnNum = 1, rowNum = 0, width = 0, height = 0, offsetY = 0, index = 0, point, left, top, legendContainer, legendIconStyles = [], idx = 0, legendIndex = 0, totalLengedLength = 0, legendSeries = [];
                if(legend.text && legend.text.length) {
                    legendTitle = self._text(0, 0, legend.text);
                    $.wijraphael.addClass($(legendTitle.node), o.wijCSS.legendTitle);
                    textStyle = $.extend(true, {
                    }, o.textStyle, legend.textStyle, legend.titleStyle);
                    legendTitle.attr(textStyle);
                    self.legendEles.push(legendTitle);
                }
                if(legend.reversed) {
                    tempSeriesList = tempSeriesList.reverse();
                }
                // fixed an issue that if the chart is compositechart, and if it contains piechart,
                // the pie is a single series. so the total legend length is not the seriesList's length.
                totalLengedLength = tempSeriesList.length;
                if(self.widgetName === "wijcompositechart") {
                    totalLengedLength = 0;
                    $.each(tempSeriesList, function (i, series) {
                        if(series.type === "pie") {
                            totalLengedLength += series.data.length;
                        } else {
                            totalLengedLength++;
                        }
                    });
                }
                $.each(tempSeriesList, function (i, series) {
                    // support hole.
                    series = $.extend(true, {
                        legendEntry: true,
                        display: "show"
                    }, series);
                    // series = $.extend(true, { legendEntry: true }, series);
                    // end comments.
                    function drawSeriesLegend(series) {
                        var index = legend.reversed ? totalLengedLength - 1 - idx : idx, seriesStyle = seriesStyles[index], chartStyle = $.extend(true, {
                            fill: "none",
                            opacity: 1,
                            stroke: "black"
                        }, seriesStyle), text, textStyle, chtStyle, isline = false, seriesType = series.type, icon;
                        // if (series.legendEntry) {
                        if(series.legendEntry && series.display !== "exclude") {
                            //text = self._text(0, 0, series.label);
                            //$.wijraphael.addClass($(text.node),
                            //"wijchart-legend-text wijchart-legend");
                            textStyle = $.extend(true, {
                            }, o.textStyle, legend.textStyle);
                            //text.attr(textStyle);
                            if(legend.textWidth) {
                                text = self.canvas.wrapText(0, 0, series.label, legend.textWidth, "far", textStyle);
                            } else {
                                text = self._text(0, 0, series.label);
                                text.attr(textStyle);
                            }
                            $.wijraphael.addClass($(text.node), o.wijCSS.legendText + " " + o.wijCSS.legend);
                            self.legends.push(text);
                            chtStyle = $.extend(chartStyle, {
                                "stroke-width": 1
                            });
                            //icon = self.canvas.rect(0, 0, iconWidth, iconHeight);
                            //$.wijraphael.addClass($(icon.node),
                            //o.wijCSS.legendIcon + " " + o.wijCSS.legend);
                            //icon.attr(chtStyle);
                            //self.legendIcons.push(icon);
                            legendIconStyles.push(chtStyle);
                            legendSeries.push(series);
                            if(self.widgetName === "wijcompositechart") {
                                isline = seriesType === "line" || seriesType === "spline" || seriesType === "bezier" || seriesType === "area";
                            } else {
                                isline = self.widgetName === "wijlinechart";
                            }
                            if(legend.textWidth) {
                                $.each(text, function (i, t) {
                                    if(series.visible === false && (!isline || (isline && !(series.markers && series.markers.visible)))) {
                                        $(t.node).data("hidden", true).data("textOpacity", t.attr("opacity") || 1);
                                        t.attr("opacity", 0.3);
                                    }
                                    $.wijraphael.addClass($(t.node), o.wijCSS.legendText + " " + o.wijCSS.legend);
                                    $(t.node).data("legendIndex", legendIndex).data("index", idx);
                                });
                            } else {
                                if(series.visible === false && (!isline || (isline && !(series.markers && series.markers.visible)))) {
                                    $(text.node).data("hidden", true).data("textOpacity", text.attr("opacity") || 1);
                                    text.attr("opacity", 0.3);
                                }
                                $.wijraphael.addClass($(text.node), o.wijCSS.legendText + " " + o.wijCSS.legend);
                                $(text.node).data("legendIndex", legendIndex).data("index", idx);
                            }
                            //$(text.node).data("legendIndex", legendIndex)
                            //	.data("index", idx);
                            ////$(icon.node).data("legendIndex", legendIndex)
                            ////	.data("index", idx);
                            legendIndex++;
                        }
                        idx++;
                    }
                    if(series.type === "pie" && series.legendEntry) {
                        $.each(series.data, function (j, data) {
                            data = $.extend({
                                legendEntry: series.legendEntry
                            }, data);
                            drawSeriesLegend(data);
                        });
                    } else if(self._isPieChart()) {
                        //fix tfs issue 20705
                        drawSeriesLegend(series);
                    } else if(self._isStockChart() && self._validateSeriesData(series)) {
                        drawSeriesLegend(series);
                    } else {
                        if((series.data.x === undefined && series.data.xy === undefined) || (series.data.xy === undefined && series.data.y === undefined)) {
                            return true;
                        }
                        drawSeriesLegend(series);
                    }
                });
                legendLen = self.legends.length;
                textMargin = legend.textMargin;
                if(legendTitle) {
                    titleBox = legendTitle.wijGetBBox();
                    titleHeight = titleBox.height;
                    titleWidth = titleBox.width;
                }
                $.each(self.legends, function (idx, legend) {
                    var bBox = legend.wijGetBBox();
                    if(bBox.width > maxWidth) {
                        maxWidth = bBox.width;
                    }
                    if(bBox.height > maxHeight) {
                        maxHeight = bBox.height;
                    }
                });
                if(compass === "east" || compass === "west") {
                    if(orientation === "horizontal") {
                        totalWidth = legendLen * (maxWidth + iconWidth + legendMargin) + legendLen * (textMargin.left + textMargin.right);
                        if(totalWidth > canvasWidth / 2) {
                            columnNum = Math.floor(canvasWidth / 2 / maxWidth);
                            if(columnNum < 1) {
                                columnNum = 1;
                            }
                        } else {
                            columnNum = legendLen;
                        }
                    } else if(orientation === "vertical") {
                        totalHeight = maxHeight * legendLen + titleHeight + legendLen * (textMargin.top + textMargin.bottom);
                        if(totalHeight > canvasHeight) {
                            columnNum = Math.ceil(totalHeight / canvasHeight);
                        } else {
                            columnNum = 1;
                        }
                    }
                } else if(compass === "south" || compass === "north") {
                    if(orientation === "horizontal") {
                        totalWidth = (maxWidth + iconWidth + legendMargin) * legendLen + legendLen * (textMargin.left + textMargin.right);
                        if(totalWidth > canvasWidth) {
                            columnNum = Math.floor(legendLen / totalWidth * canvasWidth);
                            if(columnNum < 1) {
                                columnNum = 1;
                            }
                        } else {
                            columnNum = legendLen;
                        }
                    } else if(orientation === "vertical") {
                        totalHeight = maxHeight * legendLen + titleHeight + legendLen * (textMargin.top + textMargin.bottom);
                        if(totalHeight > canvasHeight / 2) {
                            rowNum = Math.floor(canvasHeight - titleHeight) / 2 / maxHeight;
                            columnNum = Math.ceil(legendLen / rowNum);
                        } else {
                            columnNum = 1;
                        }
                    }
                }
                // Fixed issue 20405 by dail. If all series 's legendEntry set to false.
                // and the compass set to south or north, the columnNum is zero.
                if(columnNum === 0) {
                    columnNum = 1;
                }
                width = columnNum * (maxWidth + iconWidth + legendMargin) + columnNum * (textMargin.left + textMargin.right);
                height = maxHeight * Math.ceil(legendLen / columnNum) + titleHeight + Math.ceil(legendLen / columnNum) * (textMargin.top + textMargin.bottom);
                //fix tfs 20705
                width = width > titleWidth ? width : titleWidth;
                //end comments
                point = self._calculatePosition(compass, width, height);
                left = point.x - width / 2;
                top = point.y - height / 2;
                legendContainer = self.canvas.rect(left - legendMargin, top - legendMargin, width + 2 * legendMargin, height + 2 * legendMargin);
                $.wijraphael.addClass($(legendContainer.node), o.wijCSS.legendContainer);
                legendContainer.attr(legend.style);
                legendContainer.toBack();
                self.legendEles.push(legendContainer);
                if(legendTitle) {
                    // legendTitle.translate(left + width / 2, top + titleHeight /
                    // 2);
                    legendTitle.transform(Raphael.format("...T{0},{1}", left + width / 2, top + titleHeight / 2));
                }
                offsetY = titleHeight;
                $.each(self.legends, function (idx, leg) {
                    chtStyle = legendIconStyles[idx];
                    var bBox = leg.wijGetBBox(), icon, strokeWidth = //icon = self.legendIcons[idx],
                    // if the icon has an stroke-width,
                    // the width / height is not the same as the bbox
                    chtStyle["stroke-width"] || 0, x = left + index * (iconWidth + strokeWidth * 2 + maxWidth + legendMargin) + (index + 1) * textMargin.left + index * textMargin.right, y = top + offsetY + bBox.height / 2 + textMargin.top + maxHeight / 2 - bBox.height / 2, iconY = y - iconHeight / 2 - strokeWidth, chtStyle, legCover, leg0 = leg;
                    // icon.translate(x, y - icon.wijGetBBox().height / 2);
                    // icon.transform(Raphael.format("...T{0},{1}", x, y -
                    // icon.wijGetBBox().height / 2));
                    //icon.wijRemove();
                    //icon = null;
                    //icon = self.canvas.rect(x, iconY, iconWidth, iconHeight);
                    if(legend.textWidth) {
                        leg0 = leg[0];
                    }
                    //$(icon.node).data("legendIndex", $(leg0.node).data("legendIndex"))
                    //	.data("index", $(leg0.node).data("index"));
                    //$(icon.node).data("index", seriesIdx);
                    //$.wijraphael.addClass($(icon.node),
                    //o.wijCSS.legendIcon + " " + o.wijCSS.legend);
                    //self.legendIcons[idx] = icon;
                    icon = self._paintLegendIcon(x, iconY, iconWidth, iconHeight, chtStyle, $(leg0.node).data("legendIndex"), $(leg0.node).data("index"), o.wijCSS.legendIcon + " " + o.wijCSS.legend, legendSeries[$(leg0.node).data("legendIndex")], leg0);
                    if($(leg0.node).data("hidden") === true) {
                        $(leg0.node).data("iconOpacity", icon.attr("opacity") || 1);
                        icon.attr("opacity", 0.3);
                    }
                    if(legend.textStyle["text-anchor"] === "start") {
                        x -= bBox.width / 2;
                    }
                    // leg.translate(x + iconWidth + legendMargin + bBox.width / 2,
                    // y);
                    if(legend.textWidth) {
                        leg.transform(Raphael.format("...T{0},{1}", x + iconWidth + legendMargin, y - bBox.height / 2));
                    } else {
                        leg.transform(Raphael.format("...T{0},{1}", x + iconWidth + legendMargin + bBox.width / 2, y));
                    }
                    //It's hard to click the text in vml,
                    // so add a rect to cover it for clicking.
                    if(Raphael.vml) {
                        legCover = self.canvas.rect(x + iconWidth + legendMargin, y - bBox.height / 2, bBox.width, bBox.height).attr({
                            stroke: "none",
                            fill: "#000000",
                            opacity: 0.01
                        });
                        $.wijraphael.addClass($(legCover.node), o.wijCSS.legendTextCover + " " + o.wijCSS.legend);
                        $(legCover.node).data("legendIndex", $(leg0.node).data("legendIndex"));
                        $(legCover.node).data("index", $(leg0.node).data("index"));
                        self.legendEles.push(legCover);
                    }
                    //end
                    leg.toFront();
                    //$(leg.node).data("index", seriesIdx);
                    index++;
                    if(index === columnNum) {
                        index = 0;
                        offsetY += maxHeight + textMargin.top + textMargin.bottom;
                    }
                });
            };
            wijchartcore.prototype._getLegendStyle = function (seriesStyle) {
                return seriesStyle;
            };
            wijchartcore.prototype._hasAxes = function () {
                if(this.widgetName === "wijpiechart") {
                    return false;
                }
                return true;
            };
            wijchartcore.prototype._applyAxisText = function (axisOptions, axisInfo) {
                var self = this, text = axisOptions.text, textBounds = null, tempText = null, textStyle = null, textMarginVer = 0, textMarginHor = 0, canvasBounds = axisInfo.bounds || self.canvasBounds;
                if(text !== null && text !== undefined && text.length > 0) {
                    tempText = self._text(-100, -100, text);
                    textStyle = $.extend(true, {
                    }, self.options.textStyle, axisOptions.textStyle);
                    tempText.attr(textStyle);
                    textBounds = tempText.wijGetBBox();
                    if(textStyle["margin-left"]) {
                        textMarginHor += parseFloat(textStyle["margin-left"]);
                    }
                    if(textStyle["margin-top"]) {
                        textMarginVer += parseFloat(textStyle["margin-top"]);
                    }
                    if(textStyle["margin-right"]) {
                        textMarginHor += parseFloat(textStyle["margin-right"]);
                    }
                    if(textStyle["margin-bottom"]) {
                        textMarginVer += parseFloat(textStyle["margin-bottom"]);
                    }
                    switch(axisOptions.compass) {
                        case "north":
                            canvasBounds.startY += (textBounds.height + textMarginVer);
                            break;
                        case "south":
                            canvasBounds.endY -= (textBounds.height + textMarginVer);
                            break;
                        case "east":
                            canvasBounds.endX -= (textBounds.height + textMarginHor);
                            break;
                        case "west":
                            canvasBounds.startX += (textBounds.height + textMarginHor);
                            break;
                    }
                    tempText.wijRemove();
                    tempText = null;
                }
                return textBounds;
            };
            wijchartcore.prototype._isSeriesDataEmpty = function () {
                var self = this, sl = self.options.seriesList;
                if(!sl || sl.length === 0) {
                    return true;
                }
                $.each(sl, function (idx, s) {
                    if(!s.data || ((!s.data.x || !s.data.y) && !s.data.xy)) {
                        return true;
                    }
                });
                return false;
            };
            wijchartcore.prototype._setTooltipContent = function (obj) {
                var self = this, tooltipObjs, title, content, tooltip = self.tooltip, hintOptions, newOptions = {
                }, hint = self.options.hint, isFunction = $.isFunction;
                if(tooltip) {
                    // if the chart is line chart or compositechart, the data.x value is the marker position.
                    // change the value to the x value.
                    tooltipObjs = [];
                    $.each(obj, function (i, tooltipObj) {
                        var valX = tooltipObj.valX, valY = tooltipObj.valY;
                        if(valX && valY) {
                            tooltipObjs.push($.extend({
                            }, tooltipObj, {
                                x: valX,
                                y: valY
                            }));
                        } else {
                            tooltipObjs.push(tooltipObj);
                        }
                    });
                    hintOptions = tooltip.getOptions();
                    title = hint.title;
                    content = hint.content;
                    if(isFunction(title)) {
                        newOptions.title = function () {
                            return title.call(tooltipObjs);
                        };
                    }
                    if(isFunction(content)) {
                        newOptions.content = function () {
                            return content.call(tooltipObjs);
                        };
                    }
                    tooltip.setOptions(newOptions);
                }
            };
            wijchartcore.prototype._setTooltip = function () {
                var self = this, o = self.options, tooltip = self.tooltip, obj;
                if(tooltip) {
                    obj = {
                        closeBehavior: "none",
                        style: {
                            stroke: o.indicator.style.stroke
                        },
                        animated: false,
                        showDelay: 0,
                        hideDelay: 0,
                        windowCollisionDetection: "fit",
                        beforeShowing: function (e, d) {
                            if(this.target && self.indicatorLine) {
                                return false;
                            }
                        }
                    };
                    if(o.horizontal) {
                        obj.compass = "east";
                    }
                    tooltip.setOptions(obj);
                }
            };
            wijchartcore.prototype._resetTooltip = // when mouse up in plot area, reset the tooltip options.
            function () {
                var self = this, o = self.options, hint = o.hint, title = hint.title, content = hint.content, tooltip = self.tooltip, isFunction = $.isFunction, obj = $.extend(true, {
                }, this.options.hint);
                if(tooltip) {
                    obj.animated = hint.animated;
                    obj.showDelay = hint.showDelay;
                    obj.hideDelay = hint.hideDelay;
                    obj.title = hint.title;
                    obj.content = hint.content;
                    obj.closeBehavior = hint.closeBehavior || "auto";
                    obj.windowCollisionDetection = "fit";
                    if(isFunction(title)) {
                        obj.title = function () {
                            return self._getTooltipText(title, this.target);
                        };
                    }
                    if(isFunction(content)) {
                        obj.content = function () {
                            return self._getTooltipText(content, this.target);
                        };
                    }
                    obj.beforeShowing = function () {
                        self._onBeforeTooltipShowing(this);
                    };
                    tooltip.setOptions(obj);
                }
            };
            wijchartcore.prototype._fotmatTooltip = function (val) {
                var self = this;
                if(self._isDate(val)) {
                    return Globalize.format(val, "f", self._getCulture());
                } else if(!isNaN(val)) {
                    return Globalize.format(parseFloat(val), "n", self._getCulture());
                } else {
                    return val;
                }
            };
            wijchartcore.prototype._paintTooltip = function () {
                var self = this, o = self.options, hint = o.hint, hintEnable = !o.disabled && hint.enable, hintEx = hint, title, content, isFunction = $.isFunction;
                if(hintEnable && !self.tooltip) {
                    hintEx = $.extend(true, {
                    }, hint, {
                    });
                    // closeBehavior: "none",
                    // triggers: "custom"
                    title = hint.title;
                    content = hint.content;
                    // set default hint.
                    if(!content) {
                        content = hint.content = function () {
                            var label;
                            if($.isArray(this)) {
                                var str = "";
                                $.each(this, function (i, data) {
                                    label = data.label;
                                    if(data.lineSeries && data.lineSeries.label) {
                                        label = data.lineSeries.label;
                                    }
                                    str += label + ":" + self._fotmatTooltip(data.y) + "\n";
                                });
                                return str;
                            } else {
                                label = this.label;
                                if(this.lineSeries && this.lineSeries.label) {
                                    label = this.lineSeries.label;
                                }
                                return label + ":" + self._fotmatTooltip(this.y);
                            }
                        };
                    }
                    if(isFunction(title)) {
                        hintEx.title = function () {
                            return self._getTooltipText(title, this.target);
                        };
                    }
                    if(isFunction(content)) {
                        hintEx.content = function () {
                            return self._getTooltipText(content, this.target);
                        };
                    }
                    hintEx.beforeShowing = function () {
                        self._onBeforeTooltipShowing(this);
                    };
                    self.tooltip = new ChartTooltip(self.canvas, null, hintEx);
                }
            };
            wijchartcore.prototype._getTooltipText = function (fmt, target) {
                var dataObj = $(target.node).data("wijchartDataObj"), obj = {
                    data: dataObj,
                    label: dataObj.label,
                    x: dataObj.x,
                    y: dataObj.y,
                    target: target,
                    fmt: fmt
                };
                return $.proxy(fmt, obj)();
            };
            wijchartcore.prototype._onBeforeTooltipShowing = function (tooltip) {
                var target = tooltip.target, hintStyle = this.options.hint.style;
                if(target) {
                    tooltip.options.style.stroke = hintStyle.stroke || target.attrs.stroke || target.attrs.fill;
                }
            };
            wijchartcore.prototype._paintChartArea = function () {
                var self = this, o = self.options, axisOption = o.axis, axisTextOffset = // The value is used to offset the tick major
                // text from the tick rect.
                2, xTextBounds = null, yTextBounds = null, extremeValue = {
                }, maxtries = 5, offsetX = 0, offsetY = 0, isMultiYAxis = $.isArray(axisOption.y), yAxisCount = 0, yIdx, yaxisOpt, key;
                self._applyMargins();
                self.isMultiYAxis = isMultiYAxis;
                if(self._isSeriesDataEmpty()) {
                    return;
                }
                if(isMultiYAxis) {
                    $.each(axisOption.y, function (i, yaxis) {
                        axisOption.y[i] = $.extend(true, {
                            alignment: "center",
                            style: {
                                stroke: "#999999",
                                "stroke-width": 0.5
                            },
                            visible: false,
                            textVisible: true,
                            text: "",
                            textStyle: {
                                fill: "#888",
                                "font-size": 15,
                                "font-weight": "bold"
                            },
                            labels: {
                                style: {
                                    fill: "#333",
                                    "font-size": 11
                                },
                                textAlign: "center",
                                width: null
                            },
                            compass: "west",
                            autoMin: true,
                            autoMax: true,
                            min: null,
                            max: null,
                            origin: null,
                            autoMajor: true,
                            autoMinor: true,
                            unitMajor: null,
                            unitMinor: null,
                            gridMajor: {
                                visible: true,
                                style: {
                                    stroke: "#999999",
                                    "stroke-width": "0.5",
                                    "stroke-dasharray": "none"
                                }
                            },
                            gridMinor: {
                                visible: false,
                                style: {
                                    stroke: "#CACACA",
                                    "stroke-dasharray": "- "
                                }
                            },
                            tickMajor: {
                                position: "none",
                                style: {
                                    fill: "black"
                                },
                                factor: 1
                            },
                            tickMinor: {
                                position: "none",
                                style: {
                                    fill: "black"
                                },
                                factor: 1
                            },
                            annoMethod: "values",
                            annoFormatString: "",
                            valueLabels: []
                        }, yaxis);
                    });
                }
                if(self._hasAxes()) {
                    // Restore from cache.
                    if(self.innerState.axisInfo) {
                        self.axisInfo = self.innerState.axisInfo;
                        self.canvasBounds = self.innerState.canvasBounds;
                    } else {
                        xTextBounds = self._applyAxisText(axisOption.x, {
                        });
                        self.axisInfo = {
                            x: {
                                id: "x",
                                tprec: 0,
                                isTime: false,
                                offset: 0,
                                vOffset: 0,
                                max: 0,
                                min: 0,
                                originalMax: 0,
                                originalMin: 0,
                                majorTickRect: null,
                                minorTickRect: null,
                                annoFormatString: null,
                                textBounds: xTextBounds,
                                axisTextOffset: axisTextOffset,
                                autoMax: true,
                                autoMin: true,
                                autoMajor: true,
                                autoMinor: true,
                                annoMethod: axisOption.x.annoMethod,
                                valueLabels: axisOption.x.valueLabels || []
                            },
                            y: {
                            }
                        };
                        self.axisCompass[axisOption.x.compass] = true;
                        if(isMultiYAxis) {
                            $.each(axisOption.y, function (i, axisY) {
                                yTextBounds = self._applyAxisText(axisY, {
                                });
                                self.axisInfo.y[i.toString()] = {
                                    id: "y" + i,
                                    tprec: 0,
                                    isTime: false,
                                    offset: 0,
                                    vOffset: 0,
                                    max: 0,
                                    min: 0,
                                    majorTickRect: null,
                                    minorTickRect: null,
                                    annoFormatString: null,
                                    textBounds: yTextBounds,
                                    axisTextOffset: axisTextOffset,
                                    autoMax: true,
                                    autoMin: true,
                                    autoMajor: true,
                                    autoMinor: true,
                                    annoMethod: axisY.annoMethod,
                                    valueLabels: axisY.valueLabels || []
                                };
                                if(!self.axisCompass[axisY.compass]) {
                                    self.axisCompass[axisY.compass] = true;
                                }
                            });
                        } else {
                            yTextBounds = self._applyAxisText(axisOption.y, {
                            });
                            self.axisInfo.y["0"] = {
                                id: "y",
                                tprec: 0,
                                isTime: false,
                                offset: 0,
                                vOffset: 0,
                                max: 0,
                                min: 0,
                                majorTickRect: null,
                                minorTickRect: null,
                                annoFormatString: null,
                                textBounds: yTextBounds,
                                axisTextOffset: axisTextOffset,
                                autoMax: true,
                                autoMin: true,
                                autoMajor: true,
                                autoMinor: true,
                                annoMethod: axisOption.y.annoMethod,
                                valueLabels: axisOption.y.valueLabels || []
                            };
                            if(!self.axisCompass[axisOption.y.compass]) {
                                self.axisCompass[axisOption.y.compass] = true;
                            }
                        }
                        self._getSeriesGroup(isMultiYAxis);
                        extremeValue = self._getDataExtreme(isMultiYAxis);
                        self.extremeValue = extremeValue;
                        // handle x axis.
                        if(axisOption.x.autoMin && self.axisInfo.x.autoMin) {
                            axisOption.x.min = extremeValue.txn;
                        } else if(axisOption.x.min && self._isDate(axisOption.x.min)) {
                            // if is date time, convert to number.
                            axisOption.x.min = $.toOADate(axisOption.x.min);
                        }
                        if(axisOption.x.autoMax && self.axisInfo.x.autoMax) {
                            axisOption.x.max = extremeValue.txx;
                        } else if(axisOption.x.max && self._isDate(axisOption.x.max)) {
                            // if is date time, convert to number.
                            axisOption.x.max = $.toOADate(axisOption.x.max);
                        }
                        $.each(extremeValue.y, function (key, exval) {
                            yAxisCount++;
                        });
                        for(yIdx = 0; yIdx < (axisOption.y.length || 1); yIdx++) {
                            yaxisOpt = axisOption.y[yIdx] || axisOption.y;
                            key = yIdx.toString();
                            if(yaxisOpt.autoMin && self.axisInfo.y[key].autoMin && extremeValue.y[key]) {
                                yaxisOpt.min = extremeValue.y[key].tyn;
                            } else if(yaxisOpt.min && self._isDate(yaxisOpt.min)) {
                                // if is date time, convert to number.
                                yaxisOpt.min = $.toOADate(yaxisOpt.min);
                            }
                            if(yaxisOpt.autoMax && self.axisInfo.y[key].autoMax && extremeValue.y[key]) {
                                yaxisOpt.max = extremeValue.y[key].tyx || 0;
                            } else if(yaxisOpt.max && self._isDate(yaxisOpt.max)) {
                                // if is date time, convert to number.
                                yaxisOpt.max = $.toOADate(yaxisOpt.max);
                            }
                            do {
                                offsetY = self._autoPosition(self.axisInfo, axisOption, "y", key);
                                offsetX = self._autoPosition(self.axisInfo, axisOption, "x", key);
                                if(offsetY === self.axisInfo.y[key].offset && offsetX === self.axisInfo.x.offset) {
                                    maxtries = 0;
                                    break;
                                }
                                if(!isNaN(offsetX) && !isNaN(offsetY)) {
                                    if(offsetY !== self.axisInfo.y[key].offset && offsetY !== 0) {
                                        self.axisInfo.y[key].offset = offsetY;
                                        self.axisInfo.y[key].vOffset = offsetX;
                                    }
                                    if(offsetX !== self.axisInfo.x.offset && offsetX !== 0) {
                                        self.axisInfo.x.offset = offsetX;
                                        self.axisInfo.x.vOffset = offsetY;
                                    }
                                }
                                maxtries--;
                            }while(maxtries > 0);
                        }
                        self._adjustPlotArea(axisOption.x, self.axisInfo.x);
                        self._adjustPlotArea(axisOption.y, self.axisInfo.y, true);
                        self.innerState.axisInfo = self.axisInfo;
                        self.innerState.canvasBounds = self.canvasBounds;
                    }
                    self._paintAxes();
                    self._paintPlotArea();
                } else {
                    self._paintPlotArea();
                }
            };
            wijchartcore.prototype._getSeriesGroup = function (isMultiYAxis) {
                var self = this, o = self.options, group = {
                };
                $.each(o.seriesList, function (i, serie) {
                    if(serie.yAxis && isMultiYAxis) {
                        if(group[serie.yAxis.toString()]) {
                            group[serie.yAxis.toString()].push(serie);
                        } else {
                            group[serie.yAxis.toString()] = [
                                serie
                            ];
                        }
                    } else {
                        if(group["0"]) {
                            group["0"].push(serie);
                        } else {
                            group["0"] = [
                                serie
                            ];
                        }
                    }
                });
                self.seriesGroup = group;
            };
            wijchartcore.prototype._adjustPlotArea = function (axisOptions, axisInfo, isYAxis) {
                var canvasBounds = this.canvasBounds, maxKey, maxOffsets = {
                    east: Number.MIN_VALUE,
                    west: Number.MIN_VALUE,
                    south: Number.MIN_VALUE,
                    north: Number.MIN_VALUE
                };
                if(isYAxis) {
                    $.each(axisInfo, function (key, axisInf) {
                        maxKey = key;
                    });
                    $.each(axisInfo, function (key, axisInf) {
                        var opt = axisOptions[key] || axisOptions, compass = opt.compass;
                        opt.max = axisInf.max;
                        opt.min = axisInf.min;
                        switch(compass) {
                            case "north":
                                maxOffsets.north = Math.max(axisInf.offset, maxOffsets.north);
                                break;
                            case "south":
                                maxOffsets.south = Math.max(axisInf.offset, maxOffsets.south);
                                break;
                            case "east":
                                maxOffsets.east = Math.max(axisInf.offset, maxOffsets.east);
                                break;
                            case "west":
                                maxOffsets.west = Math.max(axisInf.offset, maxOffsets.west);
                                break;
                        }
                    });
                    if(maxOffsets.north !== Number.MIN_VALUE) {
                        canvasBounds.startY += maxOffsets.north;
                    }
                    if(maxOffsets.south !== Number.MIN_VALUE) {
                        canvasBounds.endY -= maxOffsets.south;
                    }
                    if(maxOffsets.east !== Number.MIN_VALUE) {
                        canvasBounds.endX -= maxOffsets.east;
                    }
                    if(maxOffsets.west !== Number.MIN_VALUE) {
                        canvasBounds.startX += maxOffsets.west;
                    }
                } else {
                    axisOptions.max = axisInfo.max;
                    axisOptions.min = axisInfo.min;
                    switch(axisOptions.compass) {
                        case "north":
                            canvasBounds.startY += axisInfo.offset;
                            break;
                        case "south":
                            canvasBounds.endY -= axisInfo.offset;
                            break;
                        case "east":
                            canvasBounds.endX -= axisInfo.offset;
                            break;
                        case "west":
                            canvasBounds.startX += axisInfo.offset;
                            break;
                    }
                }
            };
            wijchartcore.prototype._autoPosition = function (axisInfo, axisOptions, dir, key) {
                // this._adjustCartesianCompass();
                // base._autoPosition();
                return this._autoPositionCartesianAxis(axisInfo, axisOptions, dir, key);
            };
            wijchartcore.prototype._autoPositionCartesianAxis = function (axisInfo, axisOptions, dir, key) {
                var self = this, extent = null, innerAxisInfo, innerAxisOptions, oppositeAxisInfo, oppositeAxisOptions, compass, origin, max, min, lastAxisOffset = //bounds = self.canvasBounds,
                //oppositeDir = dir === "x" ? "y" : "x",
                self.lastAxisOffset || {
                }, offset, lastOffset;
                //origin = axisOptions[oppositeDir].origin,
                //max = axisInfo[oppositeDir].max,
                //min = axisInfo[oppositeDir].min,
                //d = 0,
                if(dir === "y") {
                    innerAxisInfo = axisInfo.y[key];
                    innerAxisOptions = axisOptions.y[key] || axisOptions.y;
                    oppositeAxisOptions = axisOptions.x;
                    oppositeAxisInfo = axisInfo.x;
                } else {
                    innerAxisInfo = axisInfo.x;
                    innerAxisOptions = axisOptions.x;
                    oppositeAxisInfo = axisInfo.y[key];
                    oppositeAxisOptions = axisOptions.y[key] || axisOptions.y;
                }
                compass = innerAxisOptions.compass;
                origin = oppositeAxisOptions.origin;
                max = oppositeAxisInfo.max;
                min = oppositeAxisInfo.min;
                if(origin !== null && self._isDate(origin)) {
                    origin = $.toOADate(origin);
                }
                self._calculateParameters(innerAxisInfo, innerAxisOptions);
                extent = self._getMaxExtents(innerAxisInfo, innerAxisOptions);
                switch(compass) {
                    case "north":
                    case "south":
                        offset = extent.height;
                        innerAxisInfo.maxExtent = offset;
                        //
                        //			if (origin !== null && origin >= min && origin <= max) {
                        //				if (compass === "south") {
                        //					d = (origin - min) / (max - min) * (bounds.endY - bounds.startY);
                        //				} else {
                        //					d = (max - origin) / (max - min) * (bounds.endY - bounds.startY);
                        //				}
                        //				offset -= d;
                        //				if (offset < 0) {
                        //					offset = 0;
                        //				}
                        //			}
                        break;
                    case "east":
                    case "west":
                        offset = extent.width;
                        innerAxisInfo.maxExtent = offset;
                        //			if (origin !== null && origin >= min && origin <= max) {
                        //				if (compass === "west") {
                        //				d = (origin - min) / (max - min) * (bounds.endX - bounds.startX);
                        //				} else {
                        //					d = (max - origin) / (max - min) * (bounds.endX - bounds.startX);
                        //				}
                        //				offset -= d;
                        //				if (offset < 0) {
                        //					offset = 0;
                        //				}
                        //			}
                        break;
                }
                if(dir === "y" && lastAxisOffset[compass]) {
                    $.each(lastAxisOffset[compass], function (k, offsetObj) {
                        if(k !== key) {
                            lastOffset = offsetObj;
                        }
                    });
                    if(lastOffset && !innerAxisInfo.isPartAxis) {
                        innerAxisInfo.preStartOffset = lastOffset;
                        offset += (lastOffset);
                    }
                }
                if(dir === "y") {
                    if(lastAxisOffset[compass] === undefined) {
                        lastAxisOffset[compass] = {
                        };
                    }
                    lastAxisOffset[compass][key] = offset + self._getAxisLabelBox(innerAxisOptions).width;
                    self.lastAxisOffset = lastAxisOffset;
                }
                return offset;
            };
            wijchartcore.prototype._getAxisLabelBox = function (axisOption) {
                var self = this, o = self.options, text = axisOption.text, marginTop = 0, marginRight = 0, marginLeft = 0, marginBottom = 0, textElement, bbox, isVertical = self._isVertical(axisOption.compass), textStyle = $.extend(true, {
                }, o.textStyle, axisOption.textStyle);
                if(textStyle["margin-top"]) {
                    marginTop = parseFloat(textStyle["margin-top"]);
                }
                if(textStyle["margin-left"]) {
                    marginLeft = parseFloat(textStyle["margin-left"]);
                }
                if(textStyle["margin-right"]) {
                    marginRight = parseFloat(textStyle["margin-right"]);
                }
                if(textStyle["margin-bottom"]) {
                    marginBottom = parseFloat(textStyle["margin-bottom"]);
                }
                textElement = self._text(0, 0, text);
                textElement.attr(textStyle);
                if(isVertical) {
                    textElement.transform("...R-90");
                }
                bbox = textElement.wijGetBBox();
                textElement.wijRemove();
                textElement = null;
                return {
                    width: bbox.width + marginLeft + marginRight,
                    height: bbox.height + marginBottom + marginTop
                };
            };
            wijchartcore.prototype._getMaxExtents = function (axisInfo, axisOptions, axisRect) {
                var self = this, o = self.options, majorTickValues = null, maxExtent = {
                    width: 0,
                    height: 0
                }, min = axisInfo.min, max = axisInfo.max, isTime = axisInfo.isTime, formatString = axisOptions.annoFormatString, is100pc = o.is100Percent, index = 0, compass = axisOptions.compass, labels = axisOptions.labels, textStyle, hasDefaultRotation = false, canvasBounds = axisInfo.bounds || self.canvasBounds, width, transform;
                axisInfo.majorTickRect = self._getTickRect(axisInfo, axisOptions, true, true, axisRect);
                axisInfo.minorTickRect = self._getTickRect(axisInfo, axisOptions, false, true, axisRect);
                majorTickValues = self._getMajorTickValues(axisInfo, axisOptions);
                if(!axisOptions.textVisible) {
                    return maxExtent;
                }
                if(!formatString || formatString.length === 0) {
                    formatString = axisInfo.annoFormatString;
                }
                textStyle = $.extend(true, {
                }, o.textStyle, axisOptions.textStyle, labels.style);
                transform = textStyle.transform;
                //why use the $.each for check the transform string?
                //maybe in the older Raphael, the transform is an array.
                // now just use update it like this.
                hasDefaultRotation = transform && /r/i.test(transform);
                //if (transform && transform.length) {
                //	$.each(transform, function (i, t) {
                //		if (t[0].toLowerCase() === "r") {
                //			hasDefaultRotation = true;
                //			return false;
                //		}
                //	});
                //}
                // hasDefaultRotation = typeof (textStyle.rotation) !== "undefined";
                textStyle = $.extend(true, textStyle, axisInfo.textStyle);
                width = canvasBounds.endX - canvasBounds.startX - axisInfo.vOffset - axisInfo.axisTextOffset;
                if(majorTickValues && majorTickValues.length) {
                    width = width / (majorTickValues.length - 1);
                    $.each(majorTickValues, function (idx, mtv) {
                        var txt, size, txtClone;
                        if(mtv < min || mtv > max) {
                            return true;
                        }
                        //if (axisOptions.annoMethod === "valueLabels") {
                        if(axisInfo.annoMethod === "valueLabels") {
                            if(mtv < 0) {
                                return true;
                            }
                            //if (index >= axisOptions.valueLabels.length) {
                            if(index >= axisInfo.valueLabels.length) {
                                return false;
                            }
                            //// mtv = axisOptions.valueLabels[index].text;
                            //mtv = axisOptions.valueLabels[index];
                            mtv = axisInfo.valueLabels[index];
                            if(mtv.text) {
                                mtv = mtv.text;
                            } else if(typeof mtv.value !== "undefined") {
                                mtv = mtv.value;
                                if(formatString && formatString.length) {
                                    // mtv = $.format(mtv, formatString);
                                    mtv = Globalize.format(mtv, formatString, self._getCulture());
                                }
                            }
                        } else if(axisInfo.annoMethod === "values") {
                            //} else if (axisOptions.annoMethod === "values") {
                            if(formatString && formatString.length) {
                                if(isTime) {
                                    mtv = $.fromOADate(mtv);
                                }
                                // mtv = $.format(mtv, formatString);
                                mtv = Globalize.format(mtv, formatString, self._getCulture());
                            } else if(is100pc && axisInfo.id === "y") {
                                // mtv = $.format(mtv, "p0");
                                mtv = Globalize.format(mtv, "p0", self._getCulture());
                            }
                        }
                        if(labels.width) {
                            txt = self.canvas.wrapText(-100, -100, mtv, labels.width, labels.textAlign, textStyle);
                        } else {
                            txt = self._text(-100, -100, mtv).attr(textStyle);
                        }
                        size = txt.wijGetBBox();
                        if(!self._isVertical(compass) && !hasDefaultRotation && axisInfo.annoMethod === "valueLabels") {
                            //axisOptions.annoMethod === "valueLabels") {
                            if(size.width > width) {
                                txt.attr({
                                    transform: "r-45"
                                });
                                size = txt.wijGetBBox();
                                /*
                                * if (!txt.attr().rotation) { txt.attr({ rotation:
                                * -45 }); textStyle.rotation = -45;
                                * axisInfo.textStyle = { rotation: -45 }; size =
                                * txt.wijGetBBox(); }
                                */
                                if(idx === 0) {
                                    textStyle.transform = "r-45";
                                    axisInfo.textStyle = {
                                        transform: "r-45"
                                    };
                                    txtClone = txt.clone();
                                    txtClone.attr({
                                        transform: "r0"
                                    });
                                    size = txtClone.wijGetBBox();
                                    if(Math.sqrt(2) * size.height > width) {
                                        txt.attr({
                                            transform: "r-90"
                                        });
                                        // textStyle.transform.push(["r", -90]);
                                        textStyle.transform = "r-90";
                                        axisInfo.textStyle = {
                                            transform: "r-90"
                                        };
                                    }
                                    txtClone.wijRemove();
                                    txtClone = null;
                                    size = txt.wijGetBBox();
                                }
                            }
                            /*
                            * if (idx === 0 && txt.attr().rotation &&
                            * txt.attr().rotation === -45) { txtClone =
                            * txt.clone(); txtClone.attr({ rotation: 0 }); size =
                            * txtClone.wijGetBBox(); if (Math.sqrt(2) * size.height >
                            * width) { txt.attr({ rotation: -90 });
                            * textStyle.rotation = -90; axisInfo.textStyle = {
                            * rotation: -90 }; } txtClone.wijRemove(); size =
                            * txt.wijGetBBox(); }
                            */
                                                    }
                        txt.wijRemove();
                        txt = null;
                        if(size.width > maxExtent.width) {
                            maxExtent.width = size.width;
                        }
                        if(size.height > maxExtent.height) {
                            maxExtent.height = size.height;
                        }
                        index++;
                    });
                }
                if(maxExtent.width < labels.width) {
                    maxExtent.width = labels.width;
                }
                axisInfo.labelWidth = maxExtent.width;
                return maxExtent;
            };
            wijchartcore.prototype._getMajorTickValues = function (axisInfo, axisOptions) {
                var rc = [], autoTick = axisOptions.autoMajor, unitTick = axisOptions.unitMajor, max, min, valueLabels = //valueLabels = axisOptions.valueLabels;
                axisInfo.valueLabels;
                if(valueLabels && valueLabels.length > 0) {
                    $.each(valueLabels, function (idx, valueLabel) {
                        if(typeof valueLabel.text !== "undefined" || typeof valueLabel.value !== "undefined") {
                            return false;
                        }
                        if(typeof valueLabel === "string") {
                            valueLabels[idx] = {
                                text: valueLabel,
                                gridLine: false
                            };
                        } else {
                            valueLabels[idx] = {
                                value: valueLabel,
                                gridLine: false
                            };
                        }
                    });
                }
                //if (axisOptions.annoMethod === "valueLabels" &&
                if(axisInfo.annoMethod === "valueLabels" && valueLabels && valueLabels.length > 0 && typeof valueLabels[0].value !== "undefined") {
                    rc = this._getSortedDataValues(axisInfo, axisOptions);
                    return rc;
                }
                if(axisInfo.id === "x") {
                    max = autoTick ? axisInfo.max : axisInfo.originalMax;
                    min = autoTick ? axisInfo.min : axisInfo.originalMin;
                } else {
                    max = axisInfo.max;
                    min = axisInfo.min;
                }
                rc = this._getTickValues(max, min, unitTick, axisInfo.tprec, !axisInfo.isTime, autoTick);
                return rc;
            };
            wijchartcore.prototype._getSortedDataValues = function (axisInfo, axisOptions) {
                var self = this, rc = [], valueLabels = // isXAxis = (axisInfo.id === "x"),
                axisInfo.valueLabels;
                //valueLabels = axisOptions.valueLabels;
                $.each(valueLabels, function (idx, label) {
                    var val = label.value;
                    if(self._isDate(val)) {
                        rc.push($.toOADate(val));
                    } else if(typeof val === 'number') {
                        rc.push(val);
                    } else {
                        rc.push(idx);
                    }
                    // if (self._isDate(label)) {
                    // rc.push($.toOADate(label));
                    // } else if (typeof label === 'number') {
                    // rc.push(label);
                    // } else {
                    // rc.push(idx);
                    // }
                                    });
                // TODO: ignore blank labels.
                return rc;
            };
            wijchartcore.prototype._getMinorTickValues = function (axisInfo, axisOptions) {
                var rc = [], autoTick = axisOptions.autoMinor, unitTick = axisOptions.unitMinor, max, min;
                if(axisInfo.id === "x") {
                    max = autoTick ? axisInfo.max : axisInfo.originalMax;
                    min = autoTick ? axisInfo.min : axisInfo.originalMin;
                } else {
                    max = axisInfo.max;
                    min = axisInfo.min;
                }
                rc = this._getTickValues(max, min, unitTick, axisInfo.tprec, !axisInfo.isTime, autoTick);
                return rc;
            };
            wijchartcore.prototype._getTickValues = function (smax, smin, unit, tickprec, round, autoTick) {
                var self = this, vals = [], sminOriginal = smin, i = 0, xs = 0, imax = 0, imin = 0, n = 0, smin2 = 0;
                try  {
                    if(unit === 0) {
                        vals = [
                            smax, 
                            smin
                        ];
                    } else {
                        if(autoTick) {
                            if(tickprec + 1 < 0) {
                                tickprec = -1;
                            } else if(tickprec + 1 > 15) {
                                tickprec = 14;
                            }
                            smin2 = $.round(ChartDataUtil.signedCeiling(smin / unit) * unit, tickprec + 1);
                            if(smin2 < smax) {
                                smin = smin2;
                            }
                            imax = parseInt($.round(smax / unit, 5).toString(), 10);
                            imin = parseInt($.round(smin / unit, 5).toString(), 10);
                            n = parseInt((imax - imin + 1).toString(), 10);
                            if(n > 1) {
                                xs = imin * unit;
                                if(xs < smin) {
                                    n--;
                                    smin += unit;
                                }
                                xs = smin + (n - 1) * unit;
                                if(xs > smax) {
                                    n--;
                                }
                            }
                            if(n < 1) {
                                n = 2;
                                smin = sminOriginal;
                                unit = smax - smin;
                            }
                        } else {
                            n = parseInt(((smax - smin) / unit + 1).toString(), 10);
                            if(n > 1) {
                                xs = smin + (n - 1) * unit;
                                if(xs > smax) {
                                    n--;
                                }
                            }
                            if(n < 1) {
                                n = 2;
                                unit = smax - smin;
                            }
                        }
                        for(i = 0; i < n; i++) {
                            if(round) {
                                // vals[i] = $.round(smin + i * unit, tickprec + 1);
                                if(autoTick) {
                                    vals[i] = $.round(smin + i * unit, tickprec + 1);
                                } else {
                                    vals[i] = smin + i * unit;
                                }
                            } else {
                                vals[i] = smin + i * unit;
                            }
                        }
                    }
                } catch (error) {
                }
                return vals;
            };
            wijchartcore.prototype._getTickRect = // to do
            function (axisInfo, axisOptions, isMajor, inAxisRect, axisRect) {
                var compass = axisOptions.compass, sizeFactor = 0, tick = null, majorSizeFactor = 3, minorSizeFactor = 2, thickness = 2, majorFactor = axisOptions.tickMajor.factor, minorFactor = axisOptions.tickMinor.factor, r = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                };
                if(isMajor) {
                    tick = axisOptions.tickMajor.position;
                    majorFactor = majorFactor > 0 ? majorFactor : 1;
                    sizeFactor = (majorSizeFactor * majorFactor);
                } else {
                    tick = axisOptions.tickMinor.position;
                    minorFactor = minorFactor > 0 ? minorFactor : 1;
                    sizeFactor = (minorSizeFactor * minorFactor);
                }
                if(tick === "none" || (tick === "inside" && inAxisRect)) {
                    sizeFactor = 0;
                }
                // if(isVertical) {
                if(compass === "east" || compass === "west") {
                    r = {
                        x: 0,
                        y: -1,
                        width: sizeFactor * thickness,
                        height: thickness
                    };
                    if((compass === "east" && (tick === "outside" || (tick === "cross" && inAxisRect))) || (compass === "west" && tick === "inside")) {
                        // r.x = axisRect.x;
                        // if(inAxisRect) {
                        // r.x += axisRect.width;
                        // }
                        // else {
                        // r.width += axisRect.width;
                        // }
                        r.width += 2// default value of axisRect is 2.
                        ;
                    } else {
                        // r.x = axisRect.x - sizeFactor * thickness;
                        if(!inAxisRect) {
                            if(tick === "cross") {
                                r.width <<= 1;
                            }
                            // r.width += axisRect.width;
                            r.width += 2;
                        }
                    }
                } else {
                    r = {
                        x: -1,
                        y: 0,
                        width: thickness,
                        height: sizeFactor * thickness
                    };
                    if((compass === "south" && (tick === "outside" || (tick === "corss" && inAxisRect))) || (compass === "north" && tick === "inside")) {
                        // r.y = axisRect.y;
                        // if(inAxisRect) {
                        // r.y += axisRect.height;
                        // }
                        // else {
                        // r.height += axisRect.height;
                        // }
                        r.height += 2;
                    } else {
                        // r.y = axisRect.y - sizeFactor * thickness;
                        if(!inAxisRect) {
                            if(tick === "cross") {
                                r.height <<= 1;
                            }
                            // r.height += axisRect.height;
                            r.height += 2;
                        }
                    }
                }
                return r;
            };
            wijchartcore.prototype._applyMargins = function () {
                var self = this, o = self.options, canvasBounds = self.canvasBounds;
                canvasBounds.startX += o.marginLeft;
                canvasBounds.endX -= o.marginRight;
                canvasBounds.startY += o.marginTop;
                canvasBounds.endY -= o.marginBottom;
            };
            wijchartcore.prototype._paintAxes = function () {
                // paint x axis
                                var self = this, axis = self.options.axis, axisInfo = self.axisInfo, ox = axis.x, oy = axis.y, x = axisInfo.x, y = axisInfo.y, axisElements;
                axisElements = self._paintAxis(ox, x);
                $.each(y, function (key, yaxis) {
                    var opt = oy[key] || oy;
                    if(opt.origin !== null) {
                        self._translateAxisIfNeeded(axisElements, ox.compass, opt.origin, opt.compass, yaxis.max, yaxis.min);
                    }
                });
                //			if (oy.origin !== null) {
                //				self._translateAxisIfNeeded(axisElements, ox.compass,
                //					oy.origin, oy.compass, y.max, y.min);
                //			}
                $.each(y, function (key, yaxis) {
                    var opt = oy[key] || oy;
                    axisElements = self._paintAxis(opt, yaxis);
                    if(ox.origin !== null) {
                        self._translateAxisIfNeeded(axisElements, opt.compass, ox.origin, ox.compass, x.max, x.min);
                    }
                });
            };
            wijchartcore.prototype._translateAxisIfNeeded = function (xAxisElements, xCompass, yOrigin, yCompass, yMax, yMin) {
                var self = this, isVertical = yCompass === "west" || yCompass === "east", bounds = self.canvasBounds, origin = yOrigin, offset;
                if(self._isDate(origin)) {
                    origin = $.toOADate(origin);
                }
                if(!isVertical) {
                    if(xCompass === "west") {
                        offset = (origin - yMin) / (yMax - yMin) * (bounds.endX - bounds.startX);
                    } else {
                        offset = (origin - yMax) / (yMax - yMin) * (bounds.endX - bounds.startX);
                    }
                    $.each(xAxisElements, function (idx, element) {
                        // element.translate(offset, 0);
                        element.transform(Raphael.format("...T{0},{1}", offset, 0));
                    });
                } else {
                    if(xCompass === "south") {
                        offset = (yMin - origin) / (yMax - yMin) * (bounds.endY - bounds.startY);
                    } else {
                        offset = (yMax - origin) / (yMax - yMin) * (bounds.endY - bounds.startY);
                    }
                    $.each(xAxisElements, function (idx, element) {
                        // element.translate(0, offset);
                        element.transform(Raphael.format("...T{0},{1}", 0, offset));
                    });
                }
            };
            wijchartcore.prototype._paintAxis = function (axisOptions, axisInfo) {
                var self = this, o = self.options, canvasBounds = // for stock composite chart, get the bounds from axis
                axisInfo.bounds || self.canvasBounds, startPoint = {
                    x: 0,
                    y: 0
                }, endPoint = {
                    x: 0,
                    y: 0
                }, compass = axisOptions.compass, thickness = 2, isVertical = true, ax = null, majorTickValues = // paint tick & ticklabel
                [], tempMinorTickValues = [], minorTickValues = [], max = axisInfo.max, min = axisInfo.min, unitMajor = axisOptions.unitMajor, unitMinor = axisOptions.unitMinor, tickMajor = axisOptions.tickMajor.position, tickMinor = axisOptions.tickMinor.position, axisSize = axisInfo.maxExtent, tickMajorStyle = // axisInfo.offset,
                axisOptions.tickMajor.style, tickMinorStyle = axisOptions.tickMinor.style, tickRectMajor = axisInfo.majorTickRect, tickRectMinor = axisInfo.minorTickRect, axisTextOffset = axisInfo.axisTextOffset, gridMajor = axisOptions.gridMajor, gridMinor = axisOptions.gridMinor, labels = axisOptions.labels, maxLen = 0, textInfos = [], index = 0, formatString = axisOptions.annoFormatString, textStyle = null, axisElements = [];
                tickRectMajor = self._getTickRect(axisInfo, axisOptions, true, false);
                tickRectMinor = self._getTickRect(axisInfo, axisOptions, false, false);
                if(!formatString || formatString.length === 0) {
                    formatString = axisInfo.annoFormatString;
                }
                majorTickValues = self._getMajorTickValues(axisInfo, axisOptions);
                //if (tickMinor !== "none") {
                tempMinorTickValues = self._getMinorTickValues(axisInfo, axisOptions);
                minorTickValues = self._resetMinorTickValues(tempMinorTickValues, majorTickValues);
                //}
                //add comments here to fix tfs issue 20415,paint the axis inside the plotarea.
                switch(compass) {
                    case "south":
                        startPoint.x = canvasBounds.startX;
                        startPoint.y = canvasBounds.endY;
                        endPoint.x = canvasBounds.endX;
                        endPoint.y = canvasBounds.endY;
                        isVertical = false;
                        break;
                    case "north":
                        startPoint.x = canvasBounds.startX;
                        startPoint.y = canvasBounds.startY - thickness;
                        endPoint.x = canvasBounds.endX;
                        endPoint.y = canvasBounds.startY - thickness;
                        isVertical = false;
                        break;
                    case "east":
                        //startPoint.x = canvasBounds.endX;
                        startPoint.x = canvasBounds.endX - thickness;
                        startPoint.y = canvasBounds.endY;
                        //endPoint.x = canvasBounds.endX;
                        endPoint.x = canvasBounds.endX - thickness;
                        endPoint.y = canvasBounds.startY;
                        if(axisInfo.preStartOffset) {
                            startPoint.x += axisInfo.preStartOffset;
                            endPoint.x += axisInfo.preStartOffset;
                        }
                        break;
                    case "west":
                        //startPoint.x = canvasBounds.startX - thickness;
                        startPoint.x = canvasBounds.startX;
                        startPoint.y = canvasBounds.endY;
                        //endPoint.x = canvasBounds.startX - thickness;
                        endPoint.x = canvasBounds.startX;
                        endPoint.y = canvasBounds.startY;
                        if(axisInfo.preStartOffset) {
                            startPoint.x -= axisInfo.preStartOffset;
                            endPoint.x -= axisInfo.preStartOffset;
                        }
                        break;
                }
                if(axisOptions.visible) {
                    ax = self.canvas.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y).attr(axisOptions.style);
                    $.wijraphael.addClass($(ax.node), o.wijCSS.axis);
                    self.axisEles.push(ax);
                    axisElements.push(ax);
                }
                $.each(majorTickValues, function (idx, val) {
                    var text = val, isTime = axisInfo.isTime, is100Percent = o.is100Percent, retInfo, textInfo, vlGridLine = false, vlGridLineStyle = {
                    };
                    if(val < min || val > max) {
                        index++;
                        return true;
                    }
                    if(axisInfo.annoMethod === "valueLabels") {
                        //if (axisOptions.annoMethod === "valueLabels") {
                        // if (val < 0) {
                        // return true;
                        // }
                        //if (index >= axisOptions.valueLabels.length) {
                        if(index >= axisInfo.valueLabels.length) {
                            return false;
                        }
                        //// text = axisOptions.valueLabels[index].text;
                        //text = axisOptions.valueLabels[index];
                        text = axisInfo.valueLabels[index];
                        vlGridLine = text.gridLine;
                        vlGridLineStyle = text.gridLineStyle;
                        if(text.text) {
                            text = text.text;
                        } else if(typeof text.value !== "undefined") {
                            text = text.value;
                            if(formatString && formatString.length) {
                                // text = $.format(text, formatString);
                                text = Globalize.format(text, formatString, self._getCulture());
                            }
                        }
                    } else if(axisInfo.annoMethod === "values") {
                        //} else if (axisOptions.annoMethod === "values") {
                        if(formatString && formatString.length) {
                            if(isTime) {
                                text = $.fromOADate(val);
                            }
                            // text = $.format(text, formatString);
                            text = Globalize.format(text, formatString, self._getCulture());
                        } else if(is100Percent && axisInfo.id === "y") {
                            // text = $.format(val, "p0");
                            text = Globalize.format(val, "p0", self._getCulture());
                        }
                    }
                    /*
                    * //TODO: mixed else { }
                    */
                    textStyle = $.extend(true, {
                    }, o.textStyle, axisOptions.textStyle, labels.style, axisInfo.textStyle);
                    if(axisInfo.id === "x") {
                        text = self._getTickText(text);
                    }
                    retInfo = self._paintMajorMinor(axisOptions.origin, max, min, val, tickMajor, unitMajor, tickRectMajor, compass, startPoint, endPoint, axisSize, axisTextOffset, tickMajorStyle, text, gridMajor, axisOptions.textVisible, textStyle, labels.textAlign, labels.width ? axisInfo.labelWidth : null, vlGridLine, vlGridLineStyle);
                    if(retInfo) {
                        if(retInfo.elements) {
                            axisElements = axisElements.concat(retInfo.elements);
                        }
                        textInfo = retInfo.textInfo;
                    }
                    if(textInfo) {
                        textInfos.push(textInfo);
                        if(maxLen < textInfo.len) {
                            maxLen = textInfo.len;
                        }
                    }
                    index++;
                });
                if(!labels.width) {
                    $.each(textInfos, function (idx, textInfo) {
                        var textElement = textInfo.text, offset = (textInfo.len - maxLen) / 2;
                        offset = labels.textAlign === "near" ? offset * -1 : offset;
                        if(isVertical) {
                            //textElement.translate(offset, 0);
                            textElement.transform(Raphael.format("...T{0},{1}", offset, 0));
                        } else {
                            //textElement.translate(0, offset);
                            textElement.transform(Raphael.format("...T{0},{1}", 0, offset));
                        }
                    });
                }
                $.each(minorTickValues, function (idx, val) {
                    var retInfo;
                    if(val > min && val < max) {
                        retInfo = self._paintMajorMinor(axisOptions.origin, max, min, val, tickMinor, unitMinor, tickRectMinor, compass, startPoint, endPoint, axisSize, axisTextOffset, tickMinorStyle, null, gridMinor, axisOptions.textVisible, textStyle, labels.textAlign, labels.width ? axisInfo.labelWidth : null);
                        if(retInfo && retInfo.elements) {
                            axisElements = axisElements.concat(retInfo.elements);
                        }
                    }
                });
                if(axisOptions.text && axisOptions.text.length > 0) {
                    axisElements.push(self._paintAxisText(axisOptions, axisInfo));
                }
                if(axisInfo.isPartAxis && !axisInfo.isLastAxis) {
                    axisElements.push(self.canvas.path([
                        "M", 
                        startPoint.x.toString(), 
                        startPoint.y.toString() + (axisInfo.vOffset / 2).toString, 
                        "H", 
                        (startPoint.x + axisInfo.maxExtent * 2).toString()
                    ].join()));
                }
                return axisElements;
            };
            wijchartcore.prototype._paintAxisText = function (axisOptions, axisInfo) {
                if(!axisOptions.text || axisOptions.text.length === 0) {
                    return;
                }
                var self = this, o = self.options, text = axisOptions.text, compass = axisOptions.compass, align = axisOptions.alignment, canvasBounds = axisInfo.bounds || self.canvasBounds, startX = canvasBounds.startX, startY = canvasBounds.startY, endX = canvasBounds.endX, endY = canvasBounds.endY, x = startX, y = startY, textBounds = axisInfo.textBounds, isVertical = self._isVertical(compass), axisTextOffset = axisInfo.axisTextOffset, tickRectMajor = axisInfo.majorTickRect, tick = axisOptions.tickMajor.position, tickLength = isVertical ? tickRectMajor.width : tickRectMajor.height, textStyle = null, textElement = null, marginTop = 0, marginLeft = 0, marginRight = 0, marginBottom = 0;
                textStyle = $.extend(true, {
                }, self.options.textStyle, axisOptions.textStyle);
                if(textStyle["margin-top"]) {
                    marginTop = parseFloat(textStyle["margin-top"]);
                }
                if(textStyle["margin-left"]) {
                    marginLeft = parseFloat(textStyle["margin-left"]);
                }
                if(textStyle["margin-right"]) {
                    marginRight = parseFloat(textStyle["margin-right"]);
                }
                if(textStyle["margin-bottom"]) {
                    marginBottom = parseFloat(textStyle["margin-bottom"]);
                }
                if(tick === "cross") {
                    tickLength = tickLength / 2;
                } else if(tick === "inside") {
                    tickLength = 0;
                }
                if(isVertical) {
                    switch(align) {
                        case "near":
                            y = endY - textBounds.width / 2;
                            break;
                        case "center":
                            y = (startY + endY) / 2;
                            break;
                        case "far":
                            y = startY + textBounds.width / 2;
                            break;
                    }
                    if(compass === "west") {
                        x = startX - (axisInfo.offset + axisTextOffset + tickLength + textBounds.height / 2 + marginRight);
                    } else {
                        x = endX + axisInfo.offset + axisTextOffset + tickLength + textBounds.height / 2 + marginLeft;
                    }
                } else {
                    switch(align) {
                        case "near":
                            x = startX + textBounds.width / 2;
                            break;
                        case "center":
                            x = (startX + endX) / 2;
                            break;
                        case "far":
                            x = endX - textBounds.width / 2;
                            break;
                    }
                    if(compass === "north") {
                        y = startY - (axisInfo.offset + axisTextOffset + tickLength + textBounds.height / 2 + marginBottom);
                    } else {
                        y = endY + axisInfo.offset + axisTextOffset + tickLength + textBounds.height / 2 + marginTop;
                    }
                }
                textElement = self._text(x, y, text);
                $.wijraphael.addClass($(textElement.node), o.wijCSS.axisText);
                self.axisEles.push(textElement);
                textElement.attr(textStyle);
                if(isVertical) {
                    // textElement.rotate(-90);
                    textElement.transform("...R-90");
                }
                return textElement;
            };
            wijchartcore.prototype._resetMinorTickValues = function (minorTickValues, majorTickValues) {
                var i = 0, j = 0, minorTickValue = null, majorTickValue = null;
                for(i = minorTickValues.length - 1; i >= 0; i--) {
                    minorTickValue = minorTickValues[i];
                    for(j = majorTickValues.length - 1; j >= 0; j--) {
                        majorTickValue = majorTickValues[j];
                        if(minorTickValue === majorTickValue) {
                            minorTickValues.splice(i, 1);
                        }
                    }
                }
                return minorTickValues;
            };
            wijchartcore.prototype._getTickText = function (txt) {
                return txt;
            };
            wijchartcore.prototype._paintMajorMinor = function (origin, max, min, val, tick, unit, tickRect, compass, startPoint, endPoint, axisSize, axisTextOffset, tickStyle, text, grid, textVisible, textStyle, textAlign, labelWidth, vlGridLine, vlGridLineStyle) {
                var self = this, x = startPoint.x, y = startPoint.y, o = self.options, tickX = -1, tickY = -1, isVertical = true, bs = self.canvasBounds, textInfo = null, tickElement = null, pathArr = [], arrPath = [], p = null, style = {
                    "stroke-width": 2
                }, txt = {
                    text: null,
                    len: 0
                }, textBounds = null, retInfo = {
                }, majorMinorElements = [], axisCompass = self.axisCompass;
                switch(compass) {
                    case "south":
                        if(tick === "inside") {
                            y -= tickRect.height;
                        } else if(tick === "cross") {
                            y -= tickRect.height / 2;
                        }
                        if(labelWidth) {
                            tickY = y + axisTextOffset + tickRect.height;
                        } else {
                            tickY = y + axisTextOffset + tickRect.height + axisSize / 2;
                        }
                        isVertical = false;
                        break;
                    case "west":
                        if(tick === "outside") {
                            x -= tickRect.width;
                        } else if(tick === "cross") {
                            x -= tickRect.width / 2;
                        }
                        if(labelWidth) {
                            tickX = x - (axisTextOffset + axisSize);
                        } else {
                            tickX = x - (axisTextOffset + axisSize / 2);
                        }
                        break;
                    case "north":
                        if(tick === "outside") {
                            y -= tickRect.height;
                        } else if(tick === "cross") {
                            y -= tickRect.height / 2;
                        }
                        if(labelWidth) {
                            tickY = y - (axisTextOffset + axisSize);
                        } else {
                            tickY = y - (axisTextOffset + axisSize / 2);
                        }
                        isVertical = false;
                        break;
                    case "east":
                        if(tick === "inside") {
                            x -= tickRect.width;
                        } else if(tick === "cross") {
                            x -= tickRect.width / 2;
                        }
                        if(labelWidth) {
                            tickX = x + axisTextOffset + tickRect.width;
                        } else {
                            tickX = x + axisTextOffset + tickRect.width + axisSize / 2;
                        }
                        break;
                }
                if(isVertical) {
                    y += (val - min) / (max - min) * (endPoint.y - startPoint.y);
                    arrPath = [
                        "M", 
                        bs.startX, 
                        y, 
                        "H", 
                        bs.endX
                    ];
                    if(grid.visible) {
                        //if ((y !== bs.startY && compass === "east") ||
                        //		(y !== bs.endY && compass === "west")) {
                        if((y !== bs.startY || !axisCompass["north"]) && (y !== bs.endY || !axisCompass["south"]) || origin !== val) {
                            p = self.canvas.path(arrPath.join(" "));
                            $.wijraphael.addClass($(p.node), o.wijCSS.axisGridLine);
                            p.attr(grid.style);
                            self.axisEles.push(p);
                        }
                    }
                    if(vlGridLine) {
                        //if ((y !== bs.startY && compass === "east") ||
                        //		(y !== bs.endY && compass === "west")) {
                        if((y !== bs.startY || !axisCompass["north"]) && (y !== bs.endY || !axisCompass["south"]) || origin !== val) {
                            p = self.canvas.path(arrPath.join(" "));
                            $.wijraphael.addClass($(p.node), o.wijCSS.axisGridLine);
                            p.attr($.extend(true, grid.style, vlGridLineStyle));
                            self.axisEles.push(p);
                        }
                    }
                    tickY = y;
                    if(tick !== "none") {
                        pathArr = [
                            "M", 
                            x, 
                            y, 
                            "h", 
                            tickRect.width
                        ];
                        tickStyle["stroke-width"] = tickRect.height;
                    }
                } else {
                    x += (val - min) / (max - min) * (endPoint.x - startPoint.x);
                    arrPath = [
                        "M", 
                        x, 
                        bs.startY, 
                        "V", 
                        bs.endY
                    ];
                    if(grid.visible) {
                        //if ((x !== bs.startX && compass === "south") ||
                        //		(x !== bs.endX && compass === "north")) {
                        if((x !== bs.startX || !axisCompass["west"]) && (x !== bs.endX || !axisCompass["east"]) || origin !== val) {
                            p = self.canvas.path(arrPath.join(" "));
                            $.wijraphael.addClass($(p.node), o.wijCSS.axisGridLine);
                            p.attr(grid.style);
                            self.axisEles.push(p);
                        }
                    }
                    if(vlGridLine) {
                        //if ((y !== bs.startY && compass === "south") ||
                        //		(y !== bs.endY && compass === "north")) {
                        if((x !== bs.startX || !axisCompass["west"]) && (x !== bs.endX || !axisCompass["east"]) || origin !== val) {
                            p = self.canvas.path(arrPath.join(" "));
                            $.wijraphael.addClass($(p.node), o.wijCSS.axisGridLine);
                            p.attr($.extend(true, {
                            }, grid.style, vlGridLineStyle));
                            self.axisEles.push(p);
                        }
                    }
                    if(labelWidth) {
                        tickX = x - labelWidth / 2;
                    } else {
                        tickX = x;
                    }
                    if(tick !== "none") {
                        pathArr = [
                            "M", 
                            x, 
                            y, 
                            "v", 
                            tickRect.height
                        ];
                        tickStyle["stroke-width"] = tickRect.width;
                    }
                }
                if(tick !== "none") {
                    tickElement = self.canvas.path(pathArr.join(" "));
                    $.wijraphael.addClass($(tickElement.node), o.wijCSS.axisTick);
                    style = $.extend(style, tickStyle);
                    tickElement.attr(style);
                    self.axisEles.push(tickElement);
                    majorMinorElements.push(tickElement);
                }
                if(text !== null && textVisible) {
                    if(labelWidth) {
                        txt = self.canvas.wrapText(tickX, tickY, text.toString(), labelWidth, textAlign, textStyle);
                        $.wijraphael.addClass($(txt.node), o.wijCSS.axisLabel);
                        //if (isVertical) {
                        // txt.translate(0, -txt.getBBox().height / 2);
                        //txt.transform(Raphael.format("...T{0},{1}", 0,
                        //-txt.getBBox().height / 2));
                        //}
                                            } else {
                        txt = self._text(tickX, tickY, text.toString());
                        $.wijraphael.addClass($(txt.node), o.wijCSS.axisLabel);
                        txt.attr(textStyle);
                    }
                    self.axisEles.push(txt);
                    majorMinorElements.push(txt);
                    if(!textVisible) {
                        txt.hide();
                    }
                    if(textAlign !== "center") {
                        textBounds = txt.getBBox();
                        textInfo = {
                            text: txt,
                            len: isVertical ? textBounds.width : textBounds.height
                        };
                    }
                }
                retInfo = {
                    textInfo: textInfo,
                    elements: majorMinorElements
                };
                return retInfo;
            };
            wijchartcore.prototype._paintPlotArea = function () {
            };
            wijchartcore.prototype._paintChartLabels = function () {
                var self = this, chartLabels = self.options.chartLabels;
                if(chartLabels && chartLabels.length) {
                    $.each(chartLabels, function (idx, chartLabel) {
                        var point;
                        chartLabel = $.extend(true, {
                            compass: "east",
                            attachMethod: "coordinate",
                            attachMethodData: {
                                seriesIndex: -1,
                                pointIndex: -1,
                                x: -1,
                                y: -1
                            },
                            offset: 0,
                            visible: false,
                            text: "",
                            connected: false
                        }, chartLabel);
                        if(chartLabel.visible) {
                            point = self._getChartLabelPointPosition(chartLabel);
                            if(typeof (point.x) !== "number" || typeof (point.y) !== "number") {
                                return false;
                            }
                            self._setChartLabel(chartLabel, point);
                        }
                    });
                }
            };
            wijchartcore.prototype._getChartLabelPointPosition = function (chartLabel) {
            };
            wijchartcore.prototype._setChartLabel = function (chartLabel, point, angle, calloutStyle) {
                var self = this, compass = chartLabel.compass, o = self.options, textStyle = $.extend(true, {
                }, o.textStyle, o.chartLabelStyle), text = self._text(0, 0, chartLabel.text).attr(textStyle), offset = chartLabel.offset, transX = 0, transY = 0, position = null, p = null;
                $.wijraphael.addClass($(text.node), o.wijCSS.labelText);
                self.chartLabelEles.push(text);
                position = self._getCompassTextPosition(compass, text.wijGetBBox(), offset, point, angle);
                if(offset && chartLabel.connected) {
                    p = self.canvas.path("M" + point.x + " " + point.y + "L" + position.endPoint.x + " " + position.endPoint.y);
                    $.wijraphael.addClass($(p.node), o.wijCSS.labelConnect);
                    p.attr(calloutStyle);
                    self.chartLabelEles.push(p);
                }
                transX = position.endPoint.x + position.offsetX;
                transY = position.endPoint.y + position.offsetY;
                // text.translate(transX, transY)
                // .toFront();
                text.transform(Raphael.format("...T{0},{1}", transX, transY)).toFront();
            };
            wijchartcore.prototype._getCompassTextPosition = function (compass, box, offset, point, angle) {
                var offsetX = 0, offsetY = 0, endPoint = {
                    x: 0,
                    y: 0
                };
                switch(compass.toLowerCase()) {
                    case "east":
                        angle = 0;
                        break;
                    case "west":
                        angle = 180;
                        break;
                    case "north":
                        angle = 90;
                        break;
                    case "south":
                        angle = 270;
                        break;
                    case "northeast":
                        angle = 45;
                        break;
                    case "northwest":
                        angle = 135;
                        break;
                    case "southeast":
                        angle = 315;
                        break;
                    case "southwest":
                        angle = 225;
                        break;
                }
                if((angle >= 0 && angle < 45 / 2) || (angle > 675 / 2 && angle < 360)) {
                    offsetX = box.width / 2;
                } else if(angle >= 45 / 2 && angle < 135 / 2) {
                    offsetX = box.width / 2;
                    offsetY = -1 * box.height / 2;
                } else if(angle >= 135 / 2 && angle < 225 / 2) {
                    offsetY = -1 * box.height / 2;
                } else if(angle >= 225 / 2 && angle < 315 / 2) {
                    offsetX = -1 * box.width / 2;
                    offsetY = -1 * box.height / 2;
                } else if(angle >= 315 / 2 && angle < 405 / 2) {
                    offsetX = -1 * box.width / 2;
                } else if(angle >= 405 / 2 && angle < 495 / 2) {
                    offsetX = -1 * box.width / 2;
                    offsetY = box.height / 2;
                } else if(angle >= 495 / 2 && angle < 585 / 2) {
                    offsetY = box.height / 2;
                } else {
                    offsetX = box.width / 2;
                    offsetY = box.height / 2;
                }
                endPoint = $.wijraphael.getPositionByAngle(point.x, point.y, offset, angle);
                return {
                    endPoint: endPoint,
                    offsetX: offsetX,
                    offsetY: offsetY
                };
            };
            wijchartcore.prototype._mouseDown = function (e, args) {
                this._trigger("mouseDown", e, args);
            };
            wijchartcore.prototype._mouseUp = function (e, args) {
                this._trigger("mouseUp", e, args);
            };
            wijchartcore.prototype._mouseOver = function (e, args) {
                this._trigger("mouseOver", e, args);
            };
            wijchartcore.prototype._mouseOut = function (e, args) {
                this._trigger("mouseOut", e, args);
            };
            wijchartcore.prototype._mouseMove = function (e, args) {
                this._trigger("mouseMove", e, args);
            };
            wijchartcore.prototype._click = function (e, args) {
                this._trigger("click", e, args);
            };
            wijchartcore.prototype._mouseMoveInsidePlotArea = function (e, mousePos) {
                var self = this, o = self.options, indicator = o.indicator, canvas = self.canvas, point, bounds, path, offset = 0, tooltipObj = [], horizontal = o.horizontal;
                if(indicator && indicator.visible && this.isPlotAreaMouseDown) {
                    if(horizontal) {
                        point = this._calculatePositionByX(mousePos.top);
                    } else {
                        point = this._calculatePositionByX(mousePos.left);
                    }
                    if(point && this.indicatorLine) {
                        if(point.x !== this.lastIndicatorPosition) {
                            $.each(point.data, function (i, obj) {
                                if(obj.visible) {
                                    tooltipObj.push(obj);
                                }
                            });
                            if(tooltipObj.length > 0) {
                                bounds = self.canvasBounds;
                                if(horizontal) {
                                    this.indicatorLine.transform("T0 " + point.x);
                                } else {
                                    this.indicatorLine.transform("T" + point.x + " 0");
                                }
                                //							if (this.tooltip) {
                                //								this.tooltip.destroy();
                                //								this.tooltip = null;
                                //							}
                                //this.tooltip.hide();
                                //this._paintIndicatorTooltip(tooltipObj);
                                this._setTooltipContent(tooltipObj);
                                if(horizontal) {
                                    this.tooltip.showAt({
                                        x: bounds.endX,
                                        y: point.x
                                    });
                                } else {
                                    this.tooltip.showAt({
                                        x: point.x,
                                        y: bounds.startY
                                    });
                                }
                                this.lastIndicatorPosition = point.x;
                                self._indicatorLineShowing(tooltipObj);
                                this.lastIndicatorObjects = tooltipObj;
                            }
                        }
                    }
                }
            };
            wijchartcore.prototype._calculatePositionByX = // return a chart element point which is near the mouse.
            function (x) {
                var self = this, xArr = self.pointXs, position, points = self.dataPoints;
                if(xArr && xArr.length > 0) {
                    position = this._calculatePositionByXInternal(x, xArr);
                }
                if(points) {
                    return {
                        x: position,
                        data: points[position.toString()]
                    };
                }
                return null;
            };
            wijchartcore.prototype._calculatePositionByXInternal = function (x, arr) {
                var len = arr.length, half, subArr;
                if(len === 1) {
                    return arr[0];
                } else if(len === 2) {
                    if(Math.abs(x - arr[0]) > Math.abs(x - arr[1])) {
                        return arr[1];
                    } else {
                        return arr[0];
                    }
                } else {
                    half = parseInt((len / 2).toString());
                    if(x > arr[half]) {
                        subArr = arr.slice(half);
                    } else {
                        subArr = arr.slice(0, half + 1);
                    }
                    return this._calculatePositionByXInternal(x, subArr);
                }
            };
            wijchartcore.prototype._mouseMoveOutsidePlotArea = function (e, mousePos) {
                if(this.indicatorLine) {
                    this.indicatorLine.wijRemove();
                    this.indicatorLine = null;
                    if(this.tooltip) {
                        this.tooltip.hide();
                    }
                    this._resetTooltip();
                }
            };
            wijchartcore.prototype._mouseDownInsidePlotArea = function (e, mousePos) {
                this.isPlotAreaMouseDown = true;
                var self = this, o = self.options, indicator = o.indicator, canvas = self.canvas, point, bounds, path, tooltipObj = [], horizontal = o.horizontal;
                if(indicator && indicator.visible && this.isPlotAreaMouseDown) {
                    self._setTooltip();
                    if(horizontal) {
                        point = this._calculatePositionByX(mousePos.top);
                    } else {
                        point = this._calculatePositionByX(mousePos.left);
                    }
                    if(point) {
                        // for each the points, if the element is not visible,
                        // don't show the indicator.
                        $.each(point.data, function (i, obj) {
                            if(obj.visible) {
                                tooltipObj.push(obj);
                            }
                        });
                        if(tooltipObj.length > 0) {
                            bounds = self.canvasBounds;
                            if(horizontal) {
                                path = [
                                    "M", 
                                    bounds.startX, 
                                    0, 
                                    "H", 
                                    bounds.endX
                                ];
                            } else {
                                path = [
                                    "M", 
                                    0, 
                                    bounds.startY, 
                                    "V", 
                                    bounds.endY
                                ];
                            }
                            if(this.indicatorLine) {
                                this.indicatorLine.wijRemove();
                            }
                            this.indicatorLine = canvas.path(path);
                            this.indicatorLine.attr(indicator.style);
                            if(horizontal) {
                                this.indicatorLine.transform("T0 " + point.x);
                            } else {
                                this.indicatorLine.transform("T" + point.x + " 0");
                            }
                            //						if (this.tooltip) {
                            //							this.tooltip.destroy();
                            //							this.tooltip = null;
                            //						}
                            // show tooltip
                            //this.tooltip.hide();
                            this._setTooltipContent(tooltipObj);
                            //this._paintIndicatorTooltip(tooltipObj);
                            if(horizontal) {
                                this.tooltip.showAt({
                                    x: bounds.endX,
                                    y: point.x
                                });
                            } else {
                                this.tooltip.showAt({
                                    x: point.x,
                                    y: bounds.startY
                                });
                            }
                            this.lastIndicatorPosition = point.x;
                            self._indicatorLineShowing(tooltipObj);
                            this.lastIndicatorObjects = tooltipObj;
                        }
                    }
                    e.preventDefault();
                }
            };
            wijchartcore.prototype._indicatorLineShowing = function (obj) {
                if(this.lastIndicatorObjects) {
                    this._removeIndicatorStyles(this.lastIndicatorObjects);
                }
            };
            wijchartcore.prototype._removeIndicatorStyles = function (lastIndicatorObjects) {
            };
            wijchartcore.prototype._mouseUpInsidePlotArea = function (e, mousePos) {
                this.isPlotAreaMouseDown = false;
                if(this.indicatorLine) {
                    this.indicatorLine.wijRemove();
                    this.indicatorLine = null;
                    if(this.tooltip) {
                        this.tooltip.hide();
                    }
                    this._resetTooltip();
                }
                if(this.lastIndicatorObjects) {
                    this._removeIndicatorStyles(this.lastIndicatorObjects);
                    this.lastIndicatorObjects = null;
                }
            };
            wijchartcore.prototype._bindLiveEvents = function () {
                this._bindLegendEvents();
                this._bindCanvasEvents();
            };
            wijchartcore.prototype._bindCanvasEvents = function () {
                var self = this, element = self.chartElement, touchEventPre = "", namespace = "." + this.widgetName;
                if(window.navigator.msPointerEnabled) {
                    element.css("-ms-touch-action", "none");
                }
                // if support touch.
                if($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    touchEventPre = "wij";
                }
                element.bind(touchEventPre + "mousemove" + namespace, function (e) {
                    var elePos = element.offset(), cBounds = self.canvasBounds, mousePos = {
                        left: e.pageX - elePos.left,
                        top: e.pageY - elePos.top
                    }, disabled = self.options.disabled;
                    if(disabled) {
                        return;
                    }
                    if(mousePos.left >= cBounds.startX && mousePos.left <= cBounds.endX && mousePos.top >= cBounds.startY && mousePos.top <= cBounds.endY) {
                        self._mouseMoveInsidePlotArea(e, mousePos);
                    } else {
                        self._mouseMoveOutsidePlotArea(e, mousePos);
                    }
                });
                if(self.options.indicator && self.options.indicator.visible) {
                    element.bind(touchEventPre + "mousedown" + namespace, function (e) {
                        var elePos = element.offset(), cBounds = self.canvasBounds, mousePos = {
                            left: e.pageX - elePos.left,
                            top: e.pageY - elePos.top
                        }, disabled = self.options.disabled;
                        if(disabled) {
                            return;
                        }
                        if(mousePos.left >= cBounds.startX && mousePos.left <= cBounds.endX && mousePos.top >= cBounds.startY && mousePos.top <= cBounds.endY) {
                            self._mouseDownInsidePlotArea(e, mousePos);
                        }
                    }).bind(touchEventPre + "mouseup" + namespace, function (e) {
                        var elePos = element.offset(), cBounds = self.canvasBounds, mousePos = {
                            left: e.pageX - elePos.left,
                            top: e.pageY - elePos.top
                        }, disabled = self.options.disabled;
                        if(disabled) {
                            return;
                        }
                        if(mousePos.left >= cBounds.startX && mousePos.left <= cBounds.endX && mousePos.top >= cBounds.startY && mousePos.top <= cBounds.endY) {
                            self._mouseUpInsidePlotArea(e, mousePos);
                        }
                    });
                }
            };
            wijchartcore.prototype._unbindCanvasEvents = function () {
                if(window.navigator.msPointerEnabled) {
                    this.element.css("-ms-touch-action", "");
                }
                this.element.unbind("." + this.widgetName);
            };
            wijchartcore.prototype._bindLegendEvents = function () {
                var self = this, element = self.chartElement;
                element.delegate("." + self.options.wijCSS.legend, "click.wijchartcore", function (e) {
                    if(self.options.disabled) {
                        return;
                    }
                    var tar = $(e.target);
                    if(tar[0].tagName && tar[0].tagName === "tspan") {
                        tar = tar.parent();
                    }
                    self._legendClick(tar);
                });
                //$(".wijchart-legend", element[0])
                //	.live("click." + widgetName, function (e) {
                //		if (self.options.disabled) {
                //			return;
                //		}
                //		var tar = $(e.target);
                //		if (tar[0].tagName && tar[0].tagName === "tspan") {
                //			tar = tar.parent();
                //		}
                //		self._legendClick(tar);
                //	});
                            };
            wijchartcore.prototype._legendClick = function (obj) {
                if(typeof obj.data("index") === "undefined") {
                    return;
                }
                var self = this, l = self.options.legend, i = obj.data("index"), legendIndex = obj.data("legendIndex"), fields = self.chartElement.data("fields"), seriesEles = self.seriesEles, seriesEle, legendIcon = self.legendIcons[legendIndex], legend = self.legends[legendIndex], legendNode = l.textWidth ? $(legend[0].node) : $(legend.node), idx = i, legendDot;
                if(fields && fields.seriesEles) {
                    seriesEles = fields.seriesEles;
                }
                if(self.legendDots && self.legendDots.length > i) {
                    legendDot = self.legendDots[i];
                }
                if(l.reversed) {
                    idx = self.legends.length - 1 - i;
                }
                seriesEle = seriesEles[idx];
                if(seriesEle) {
                    if(!legendNode.data("hidden")) {
                        self._hideSerieEles(seriesEle);
                        if(!legendNode.data("textOpacity")) {
                            if(l.textWidth) {
                                legendNode.data("textOpacity", legend[0].attr("opacity") || 1);
                            } else {
                                legendNode.data("textOpacity", legend.attr("opacity") || 1);
                            }
                        }
                        if(!legendNode.data("iconOpacity")) {
                            legendNode.data("iconOpacity", legendIcon.attr("opacity") || 1);
                        }
                        if(legendDot && !legendNode.data("dotOpacity")) {
                            legendNode.data("dotOpacity", legendIcon.attr("opacity") || 1);
                        }
                        legend.attr("opacity", "0.3");
                        legendIcon.attr("opacity", "0.3");
                        if(legendDot) {
                            legendDot.attr("opacity", "0.3");
                        }
                        legendNode.data("hidden", true);
                    } else {
                        self._showSerieEles(seriesEle);
                        legend.attr("opacity", legendNode.data("textOpacity"));
                        legendIcon.attr("opacity", legendNode.data("iconOpacity"));
                        if(legendDot) {
                            legendDot.attr("opacity", legendNode.data("dotOpacity"));
                        }
                        legendNode.data("hidden", false);
                    }
                }
            };
            wijchartcore.prototype._showSerieEles = function (seriesEle) {
            };
            wijchartcore.prototype._hideSerieEles = function (seriesEle) {
            };
            wijchartcore.prototype._unbindLiveEvents = function () {
                var self = this, o = self.options, element = this.chartElement, widgetName = self.widgetName;
                element.undelegate("." + o.wijCSS.legend, ".wijchartcore").undelegate("." + o.wijCSS.legend, "wijchartcore");
                this._unbindCanvasEvents();
            };
            wijchartcore.prototype._isBarChart = function () {
                return false;
            };
            wijchartcore.prototype._isPieChart = function () {
            };
            wijchartcore.prototype._isStockChart = function () {
            };
            wijchartcore.prototype._validateSeriesData = function (series) {
                return false;
            };
            wijchartcore.prototype._calculateParameters = // methods for Axis
            function (axisInfo, axisOptions) {
                var self = this, maxData = axisOptions.max, minData = axisOptions.min, autoMax = axisOptions.autoMax && axisInfo.autoMax, autoMin = axisOptions.autoMin && axisInfo.autoMin, autoMajor = axisOptions.autoMajor && axisInfo.autoMajor, autoMinor = axisOptions.autoMinor && axisInfo.autoMinor, axisAnno = null, prec = null, isVL = axisInfo.annoMethod === "valueLabels", major = //isVL = axisOptions.annoMethod === "valueLabels",
                0, newmax = 0, newmin = 0, dx = 0, tinc = 0, isTime = axisInfo.isTime, adjustMinValue = self.options.adjustMinValue;
                if(autoMax && maxData !== Number.MIN_VALUE) {
                    if(axisInfo.id !== "x" && self._isBarChart()) {
                        if(maxData < 0.0 && (0.5 * (maxData - minData) > -maxData)) {
                            maxData = 0.0;
                        }
                    }
                }
                if(autoMin && minData !== Number.MAX_VALUE) {
                    if(axisInfo.id !== "x" && self._isBarChart()) {
                        if(minData > 0.0 && (0.5 * (maxData - minData) > minData)) {
                            minData = 0.0;
                        }
                    }
                }
                if(maxData === minData) {
                    if(minData !== 0) {
                        minData -= 1;
                    }
                    maxData += 1;
                }
                dx = maxData - minData;
                if(isTime) {
                    axisAnno = axisOptions.annoFormatString;
                    if(!axisAnno || axisAnno.length === 0) {
                        axisAnno = ChartDataUtil.getTimeDefaultFormat(maxData, minData);
                        axisInfo.annoFormatString = axisAnno;
                    }
                    tinc = ChartDataUtil.niceTimeUnit(0.0, axisAnno);
                }
                prec = ChartDataUtil.nicePrecision(dx);
                axisInfo.tprec = prec;
                if(autoMax) {
                    if(isTime) {
                        newmax = ChartDataUtil.roundTime(maxData, tinc, true);
                        if(newmax < maxData) {
                            maxData = newmax + tinc;
                        } else {
                            maxData = newmax;
                        }
                    } else {
                        newmax = ChartDataUtil.precCeil(-prec, maxData);
                        if(typeof (newmax) === "number") {
                            maxData = newmax;
                        }
                    }
                }
                if(autoMin) {
                    if(isTime) {
                        newmin = ChartDataUtil.roundTime(minData, tinc, false);
                        if(newmin > minData) {
                            minData = newmin - tinc;
                        } else {
                            minData = newmin;
                        }
                    } else {
                        newmin = ChartDataUtil.precFloor(-prec, minData);
                        if(typeof (newmin) === "number") {
                            minData = newmin;
                        }
                    }
                }
                axisInfo.max = maxData;
                axisInfo.min = minData;
                axisInfo.originalMax = maxData;
                axisInfo.originalMin = minData;
                axisInfo.annoFormatString = axisAnno;
                axisInfo.tinc = tinc;
                if(autoMajor || autoMinor) {
                    dx = maxData - minData;
                    self._calculateMajorMinor(axisOptions, axisInfo);
                    // var minor = axisOptions.unitMinor;
                    major = axisOptions.unitMajor;
                    if(autoMax && major !== 0 && !isTime && !isVL) {
                        dx = maxData - parseInt((maxData / major).toString(), 10) * major;
                        if(dx !== 0) {
                            maxData += (major - dx);
                            maxData = ChartDataUtil.precCeil(-prec, maxData);
                        }
                    }
                    if(autoMin && major !== 0 && !isTime && !isVL) {
                        dx = minData - parseInt((minData / major).toString(), 10) * major;
                        if(dx !== 0) {
                            if(dx < 0) {
                                dx += major;
                            }
                            minData -= Math.abs(dx)// should always be less.
                            ;
                            minData = ChartDataUtil.precFloor(-prec, minData);
                        }
                    }
                    if(autoMin && major !== 0 && !isVL && (typeof adjustMinValue === "undefined" || adjustMinValue === false) && autoMin && minData === axisOptions.min && minData - major >= 0 && axisInfo.id === "y") {
                        minData -= major;
                    }
                }
                /*
                * //TODO: if (!autoMajor || !autoMinor) { }
                */
                axisInfo.max = maxData;
                axisInfo.min = minData;
                axisInfo.originalMax = maxData;
                axisInfo.originalMin = minData;
            };
            wijchartcore.prototype._supportStacked = function () {
                return false;
            };
            wijchartcore.prototype._getDataExtreme = function (isMultiYAxis) {
                var val = {
                    txx: 0,
                    txn: 0,
                    tyx: 0,
                    tyn: 0
                }, valGroup;
                valGroup = this._getDataExtremes(val, isMultiYAxis);
                if(valGroup) {
                    if(valGroup.txn > valGroup.txx) {
                        valGroup.txn = 0;
                        valGroup.txx = 1;
                    }
                    return valGroup;
                } else {
                    if(val.txn > val.txx) {
                        val.txn = 0;
                        val.txx = 1;
                    }
                    return val;
                }
            };
            wijchartcore.prototype._getDataExtremes = function (val, isMultiYAxis) {
                var self = this, o = self.options, seriesList = o.seriesList, stacked = o.stacked && self._supportStacked(), is100Percent = o.is100Percent, axis = o.axis, axisInfo = self.axisInfo, valuesX = [], lastValuesY = [], valueLabels = [], validValue, valGroup = {
                    y: {
                    }
                }, xValueLabels = axis.x.valueLabels, xAnnoMethod = axisInfo.x.annoMethod, yAnnoMethod = axisInfo.y.annoMethod;
                if(!seriesList || seriesList.length === 0) {
                    return val;
                }
                //handle the seriesList's xy data
                $.each(seriesList, function (i, series) {
                    var data = series.data, vxs = [], vys = [], len, k = 0;
                    if(data.xy && $.isArray(data.xy)) {
                        len = data.xy.length;
                        while(k < len) {
                            vxs.push(data.xy[k]);
                            vys.push(data.xy[k + 1]);
                            k += 2;
                        }
                        data.x = vxs;
                        data.y = vys;
                    }
                });
                if(self.seriesGroup) {
                    $.each(self.seriesGroup, function (key, seriesL) {
                        var valuesY = [], k = parseInt(key, 10);
                        $.each(seriesL, function (i, series) {
                            if(series.type === "pie") {
                                return true;
                            }
                            // support hole.
                            series = $.extend(true, {
                                display: "show"
                            }, series);
                            // end comments
                                                        var data = series.data, index = 0, k = 0, valuesXY = [].concat(data.xy), len = valuesXY.length, xMinMax, yMinMax;
                            // support hole.
                            if(series.display === "exclude") {
                                return true;
                            }
                            // end comments
                            valuesX = [].concat(data.x);
                            valuesY = [].concat(data.y);
                            if(data.xy && len) {
                                valuesX = [];
                                valuesY = [];
                                while(k < len) {
                                    valuesX[index] = valuesXY[k];
                                    valuesY[index] = valuesXY[k + 1];
                                    k += 2;
                                    index++;
                                    data.x = valuesX;
                                    data.y = valuesY;
                                }
                            } else if(!data.x) {
                                valuesX = [];
                                $.each(valuesY, function (i) {
                                    valuesX.push(i);
                                });
                                data.x = valuesX;
                            }
                            if(stacked && i > 0) {
                                $.each(valuesY, function (j) {
                                    // if (j === 0) {
                                    // return true;
                                    // }
                                    // valuesY[j] += valuesY[j - 1];
                                    valuesY[j] += lastValuesY[j];
                                });
                            }
                            lastValuesY = valuesY;
                            xMinMax = self._getMinMaxValue(valuesX);
                            yMinMax = self._getMinMaxValue(valuesY);
                            if(i === 0) {
                                val.txx = xMinMax.max;
                                val.txn = xMinMax.min;
                                val.tyx = yMinMax.max;
                                val.tyn = yMinMax.min;
                            } else {
                                if(val.txx < xMinMax.max) {
                                    val.txx = xMinMax.max;
                                }
                                if(val.txn > xMinMax.min) {
                                    val.txn = xMinMax.min;
                                }
                                if(val.tyx < yMinMax.max) {
                                    val.tyx = yMinMax.max;
                                }
                                if(val.tyn > yMinMax.min) {
                                    val.tyn = yMinMax.min;
                                }
                            }
                            i++;
                        });
                        if(is100Percent) {
                            val.tyx = 1;
                            val.tyn = 0;
                        }
                        valGroup.y[key] = {
                            tyx: val.tyx,
                            tyn: val.tyn
                        };
                        valGroup.txx = val.txx;
                        valGroup.txn = val.txn;
                        val.tyx = 0;
                        val.tyn = 0;
                        //val = {txx: val.txx, txn: val.txn, tyx: 0, tyn: 0 };
                        if(valuesY.length) {
                            validValue = ChartUtil.getFirstValidListValue(valuesY);
                            if(self._isDate(validValue)) {
                                axisInfo.y[key].isTime = true;
                            } else if(typeof (validValue) === "undefined") {
                                return true;
                            } else if(typeof (validValue) !== "number") {
                                $.each(valuesY, function (idx, valueY) {
                                    // valueLabels.push({
                                    // text: valueY,
                                    // value: idx
                                    // });
                                    // Add comments by RyanWu@20110707.
                                    // For fixing the issue#15881.
                                    // valueLabels.push(valueY);
                                                                        var formatString = axis.y.annoFormatString, value = valueY;
                                    if(formatString && formatString.length > 0) {
                                        // value = $.format(value, formatString);
                                        value = Globalize.format(value, formatString, self._getCulture());
                                    } else {
                                        value = value.toString();
                                    }
                                    // valueLabels.push(value);
                                    valueLabels.push({
                                        text: value,
                                        value: valueY,
                                        gridLine: false
                                    });
                                    // end by RyanWu@20110707.
                                                                    });
                                //axis.y[k].annoMethod = "valueLabels";
                                axisInfo.y[key].annoMethod = "valueLabels";
                                if(!axis.y[k].valueLabels && axis.y[k].valueLabels.length === 0) {
                                    //axis.y[k].valueLabels = valueLabels;
                                    axisInfo.y[key].valueLabels = valueLabels;
                                } else {
                                    axisInfo.y[key].valueLabels = axis.y[k].valueLabels;
                                }
                                //axis.y[parseInt(key, 10)].valueLabels = valueLabels;
                                axis.x.max = valuesY.length - 1;
                                axis.x.min = 0;
                                axis.y[k].unitMajor = 1;
                                axis.x.unitMinor = 0.5;
                                axisInfo.y[key].autoMax = false;
                                axisInfo.y[key].autoMin = false;
                                axisInfo.y[key].autoMajor = false;
                                axisInfo.y[key].autoMinor = false;
                            }
                        }
                    });
                }
                if(valuesX.length) {
                    validValue = ChartUtil.getFirstValidListValue(valuesX);
                    if(xAnnoMethod === "valueLabels" && xValueLabels && xValueLabels.length > 0) {
                        axisInfo.x.valueLabels = xValueLabels;
                    }
                    if(self._isDate(validValue)) {
                        axisInfo.x.isTime = true;
                    } else if(typeof (validValue) !== "number") {
                        $.each(valuesX, function (idx, valueX) {
                            var vLabel = {
                            }, xvl, xvlType;
                            if(xAnnoMethod === "valueLabels" && xValueLabels && xValueLabels.length && idx < xValueLabels.length) {
                                xvl = xValueLabels[idx];
                                xvlType = typeof xvl;
                                if(xvlType === "string") {
                                    xvl = {
                                        text: xvl
                                    };
                                } else if(xvlType === "number" || self._isDate(xvl)) {
                                    xvl = {
                                        value: xvl
                                    };
                                }
                            }
                            vLabel = $.extend({
                                text: valueX,
                                value: idx,
                                gridLine: false
                            }, xvl);
                            valueLabels.push(vLabel);
                            // valueLabels.push(valueX);
                                                    });
                        //axis.x.annoMethod = "valueLabels";
                        //axis.x.valueLabels = valueLabels;
                        axis.x.max = valuesX.length - 1;
                        axis.x.min = 0;
                        axis.x.unitMajor = 1;
                        axis.x.unitMinor = 0.5;
                        axisInfo.x.annoMethod = "valueLabels";
                        axisInfo.x.valueLabels = valueLabels;
                        axisInfo.x.autoMax = false;
                        axisInfo.x.autoMin = false;
                        axisInfo.x.autoMajor = false;
                        axisInfo.x.autoMinor = false;
                    }
                }
                return valGroup;
                //return val;
                            };
            wijchartcore.prototype._isVertical = function (compass) {
                return compass === "west" || compass === "east";
            };
            wijchartcore.prototype._isDate = function (obj) {
                if(!obj) {
                    return false;
                }
                return (typeof obj === 'object') && obj.constructor === Date;
            };
            wijchartcore.prototype._getMinMaxValue = function (array) {
                var self = this, val = {
                    min: 0,
                    max: 0
                }, i = 0, validValue;
                if(!array.length) {
                    return val;
                }
                validValue = ChartUtil.getFirstValidListValue(array);
                if(typeof (validValue) !== "number") {
                    if(self._isDate(validValue)) {
                        val.min = validValue;
                        val.max = validValue;
                    } else {
                        val.min = 0;
                        val.max = array.length - 1;
                        return val;
                    }
                } else {
                    val.min = validValue;
                    val.max = validValue;
                }
                for(i = 0; i < array.length; i++) {
                    if(array[i] === null || typeof array[i] === "undefined") {
                        continue;
                    }
                    if(typeof array[i] === "number" && isNaN(array[i])) {
                        continue;
                    }
                    if(array[i] < val.min) {
                        val.min = array[i];
                    } else if(array[i] > val.max) {
                        val.max = array[i];
                    }
                }
                if(self._isDate(val.min)) {
                    val.min = $.toOADate(val.min);
                    val.max = $.toOADate(val.max);
                }
                return val;
            };
            wijchartcore.prototype._calculateMajorMinor = function (axisOptions, axisInfo) {
                var self = this, o = self.options, canvasBounds = axisInfo.bounds || self.canvasBounds, autoMajor = axisOptions.autoMajor, autoMinor = axisOptions.autoMinor, maxData = axisInfo.max, minData = axisInfo.min, isTime = axisInfo.isTime, tinc = axisInfo.tinc, formatString = axisInfo.annoFormatString, maxText = null, minText = null, sizeMax = null, sizeMin = null, mx = null, mn = null, prec = null, _prec = null, textStyle = null, dx = maxData - minData, width = 0, height = 0, nticks = 0, major = 0;
                if(autoMajor) {
                    textStyle = $.extend(true, {
                    }, o.textStyle, axisOptions.textStyle, axisOptions.labels.style);
                    if(isTime) {
                        // maxText = $.format($.fromOADate(maxData), formatString);
                        maxText = Globalize.format($.fromOADate(maxData), formatString, self._getCulture());
                        // minText = $.format($.fromOADate(minData), formatString);
                        minText = Globalize.format($.fromOADate(minData), formatString, self._getCulture());
                        mx = self._text(-1000, -1000, maxText).attr(textStyle);
                        mn = self._text(-1000, -1000, minText).attr(textStyle);
                        sizeMax = mx.wijGetBBox();
                        sizeMin = mn.wijGetBBox();
                        mx.wijRemove();
                        mx = null;
                        mn.wijRemove();
                        mn = null;
                    } else {
                        prec = ChartDataUtil.nicePrecision(dx);
                        _prec = prec + 1;
                        if(_prec < 0 || _prec > 15) {
                            _prec = 0;
                        }
                        mx = self._text(-1000, -1000, $.round(maxData, _prec).toString()).attr(textStyle);
                        mn = self._text(-1000, -1000, $.round(minData, _prec).toString()).attr(textStyle);
                        sizeMax = mx.wijGetBBox();
                        sizeMin = mn.wijGetBBox();
                        mx.wijRemove();
                        mx = null;
                        mn.wijRemove();
                        mn = null;
                    }
                    if(sizeMax.width < sizeMin.width) {
                        sizeMax.width = sizeMin.width;
                    }
                    if(sizeMax.height < sizeMin.height) {
                        sizeMax.height = sizeMin.height;
                    }
                    if(!self._isVertical(axisOptions.compass)) {
                        // Add comments by RyanWu@20100907.
                        // Subtract axisTextOffset because we must left
                        // the space between major text and major rect.
                        width = canvasBounds.endX - canvasBounds.startX - axisInfo.vOffset - axisInfo.axisTextOffset;
                        major = width / sizeMax.width;
                        if(Number.POSITIVE_INFINITY === major) {
                            nticks = 0;
                        } else {
                            nticks = parseInt(major.toString(), 10);
                        }
                    } else {
                        height = canvasBounds.endY - canvasBounds.startY - axisInfo.vOffset - axisInfo.axisTextOffset;
                        major = height / sizeMax.height;
                        if(Number.POSITIVE_INFINITY === major) {
                            nticks = 0;
                        } else {
                            nticks = parseInt(major.toString(), 10);
                        }
                    }
                    major = dx;
                    if(nticks > 0) {
                        dx /= nticks;
                        if(isTime) {
                            if(dx < tinc) {
                                major = tinc;
                            } else {
                                major = ChartDataUtil.niceTimeUnit(dx, axisInfo.annoFormatString);
                            }
                        } else {
                            axisInfo.tprec = ChartDataUtil.nicePrecision(dx);
                            major = ChartDataUtil.niceNumber(2 * dx, -prec, true);
                            if(major < dx) {
                                major = ChartDataUtil.niceNumber(dx, -prec + 1, false);
                            }
                            if(major < dx) {
                                major = ChartDataUtil.niceTickNumber(dx);
                            }
                        }
                    }
                    axisOptions.unitMajor = major;
                }
                if(autoMinor && axisOptions.unitMajor && !isNaN(axisOptions.unitMajor)) {
                    axisOptions.unitMinor = axisOptions.unitMajor / 2;
                }
            };
            return wijchartcore;
        })(wijmo.wijmoWidget);
        chart.wijchartcore = wijchartcore;        
        var wijchartcore_options = (function () {
            function wijchartcore_options() {
                /**
                * Sets the width of the chart in pixels.
                * @remarks
                * Note that this value overrides any value you may set in the <div> element that
                * you use in the body of the HTML page
                * If you specify a width in the <div> element that is different from this value,
                * the chart and its border go out of synch.
                * @type {?number}
                */
                this.width = null;
                /**
                * Sets the height of the barchart in pixels.
                * @remarks
                * Note that this value overrides any value you may set in the <div> element that
                * you use in the body of the HTML page. If you specify a height in the <div> element that
                * is different from this value, the chart and its border go out of synch.
                * @type {?number}
                */
                this.height = null;
                /**
                * this option uses internal
                * @ignore
                */
                this.wijCSS = {
                    headerText: "wijchart-header-text",
                    headerContainer: "wijchart-header-container",
                    footerText: "wijchart-footer-text",
                    footerContainer: "wijchart-footer-container",
                    legendTitle: "wijchart-legend-title",
                    legendText: "wijchart-legend-text",
                    legend: "wijchart-legend",
                    legendDot: "chart-legend-dot",
                    legendIcon: "wijchart-legend-icon",
                    legendContainer: "wijchart-legend-container",
                    legendTextCover: "wijchart-legend-textCover",
                    axis: "wijchart-axis",
                    axisText: "wijchart-axis-text",
                    axisGridLine: "wijchart-axis-gridline",
                    axisTick: "wijchart-axis-tick",
                    axisLabel: "wijchart-axis-label",
                    labelText: "wijchart-label-text",
                    labelConnect: "wijchart-label-connect",
                    canvasObject: "wijchart-canvas-object"
                };
                /** A value that indicator the culture to format the chart text. */
                this.culture = "";
                /**
                * Creates an array of series objects that contain data values and labels to display in the chart.
                */
                this.seriesList = [];
                /**
                * Sets an array of style objects to use in rendering the bars for each series in the chart.
                * @remarks
                * Each style object in the array applies to one series in your seriesList,
                * so you need specify only as many style objects as you have series objects
                * in your seriesList. The style is also used in the legend entry for the series
                * in your seriesList. The style is also used in the legend entry for the series
                */
                this.seriesStyles = [
                    {
                        stroke: "#00cc00",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, 
                    {
                        stroke: "#0099cc",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, 
                    {
                        stroke: "#0055cc",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, 
                    {
                        stroke: "#2200cc",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, 
                    {
                        stroke: "#8800cc",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, 
                    {
                        stroke: "#d9007e",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, 
                    {
                        stroke: "#ff0000",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, 
                    {
                        stroke: "#ff6600",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, 
                    {
                        stroke: "#ff9900",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, 
                    {
                        stroke: "#ffcc00",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, 
                    {
                        stroke: "#ffff00",
                        opacity: 0.9,
                        "stroke-width": 1
                    }, 
                    {
                        stroke: "#ace600",
                        opacity: 0.9,
                        "stroke-width": 1
                    }
                ];
                /**
                * Sets an array of styles to use in rendering bars in the chart when you hover over them.
                * @remarks
                * Each style object in the array applies to a series in your seriesList,so you need
                * specify only as many style objects as you have series objects in your seriesList
                */
                this.seriesHoverStyles = [
                    {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, 
                    {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, 
                    {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, 
                    {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, 
                    {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, 
                    {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, 
                    {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, 
                    {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, 
                    {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, 
                    {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, 
                    {
                        opacity: 1,
                        "stroke-width": 1.5
                    }, 
                    {
                        opacity: 1,
                        "stroke-width": 1.5
                    }
                ];
                /**
                * Sets the amount of space in pixels between the chart area and the top edge of the <div> that defines the widget
                */
                this.marginTop = 25;
                /**
                * Sets the amount of space in pixels between the chart area and the right edge of the <div> that defines the widget
                */
                this.marginRight = 25;
                /**
                *  Sets the amount of space in pixels between the chart area and the bottom edge of the <div> that defines the widget.
                */
                this.marginBottom = 25;
                /**
                * Sets the amount of space in pixels between the chart area and the left edge of the <div> that defines the widget
                */
                this.marginLeft = 25;
                /**
                * Creates an object to use for the fallback style of any chart text that does not
                * have other style options set.
                * @remarks
                * Each type of text in the chart has a different set of styles applied by default, but if those styles are set to null,
                * or if a particular style option is not set by default, the chart falls back on any style options you set in this option.
                * Styles for specific types of chart text that may use this option as a fallback style are set in the following options:
                * axis x labels style
                *		axis x textStyle
                *		axis y labels style
                *		axis y textStyle
                *		chartLabelStyle
                *		footer textStyle
                *		header textStyle
                *		hint contentStyle
                *		hint titleStyle
                *		legend textStyle
                *		legend titleStyle
                * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                * The style is the “attr” method’s parameters.
                */
                this.textStyle = {
                    fill: "#888",
                    "font-size": 10,
                    stroke: "none"
                };
                /** Sets up the object to use as the header of the barchart.*/
                this.header = {
                    text: /**
                    * A value that indicates the text to display in the header.
                    * @remarks
                    * If you leave this as an empty string, no header renders, regardless of any other header attributes.
                    */
                    "",
                    style: /**
                    * A value that indicates all of the style attributes to use in rendering the header.
                    * @remarks
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr
                    * The style is the “attr” method’s parameters.
                    */
                    {
                        fill: "none",
                        stroke: "none"
                    },
                    textStyle: /**
                    * A value that indicates the style of the header text.
                    * @remarks
                    * Note: Any style options set in the fallback textStyle option are used for any
                    * style options that are not set explicitly (or set by default) in this option.
                    */
                    {
                        "font-size": 18,
                        fill: "#666",
                        stroke: "none"
                    },
                    compass: /**
                    * A value that indicates the position of the header in relation to the chart.
                    * @remarks
                    * Valid Values:
                    *		"north" Renders the header above the chart.
                    *		"south" Renders the header below the chart.
                    *		"east" Renders the header to the right of the chart, with the text rotated 90 degrees.
                    *		"west" Renders the header to the left of the chart, with the text rotated 270 degrees.
                    */
                    "north",
                    visible: /**
                    * A value that indicates the visibility of the header.
                    */
                    true
                };
                /**
                * Sets up the object to use as the footer of the barchart.
                */
                this.footer = {
                    text: /**
                    * A value that indicates the text to display in the footer.
                    * @remarks
                    * If you leave this as an empty string, no footer renders, regardless of any other footer attributes.
                    */
                    "",
                    style: /**
                    * A value that indicates all of the style attributes to use in rendering the footer.
                    * @remarks
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the “attr” method’s parameters.
                    */
                    {
                        fill: "#fff",
                        stroke: "none"
                    },
                    textStyle: /**
                    * A value that indicates the style of the footer text.
                    * @remarks
                    * Note: Any style options set in the fallback textStyle option are used for
                    * any style options that are not set explicitly (or set by default) in this option.
                    * The style is defined in Raphael here is the documentation:http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the “attr” method’s parameters.
                    */
                    {
                        fill: "#000",
                        stroke: "none"
                    },
                    compass: /**
                    * A value that indicates the position of the footer in relation to the chart.
                    * @remarks
                    * Valid Values:
                    * 		"north" Renders the footer above the chart.
                    *		"south" Renders the footer below the chart.
                    *		"east" Renders the footer to the right of the chart, with the text rotated 90 degrees.
                    *		"west" Renders the footer to the left of the chart, with the text rotated 270 degrees.
                    */
                    "south",
                    visible: /**
                    * A value that indicates the visibility of the footer.
                    */
                    false
                };
                /**
                * Creates a legend object to display with the chart.
                * @remarks
                * By default, each series that you create in the seriesList is represented by a color in the legend,
                * using the seriesList label that you specify. If you do not specify a label,
                * it is labeled "undefined." If you do not want a series to appear in the legend,
                * you can set the seriesList legendEntry attribute to false.
                * By default, users can click a legend entry to toggle the data series it
                * represents in the chart.See Clickable Legend for code that allows you to disable this function.
                * @example
                * // This code creates a chart with a legend that is positioned below the chart (south),
                * // with series labels and colors in a row (horizontal), a grey outline and lighter
                * // grey fill (style), has a title that reads "Legend" (text), has 5 pixels of
                * // space around the text (textMargin), has series labels in a black 12-point font
                * // (textStyle), and has a 14-point font title (titleStyle)
                *    $(document).ready(function () {
                *        $("#wijbarchart").wijbarchart({
                *			legend: {
                *			compass: "south",
                *			orientation: "horizontal",
                *			style: {fill: "gainsboro", stroke: "grey"},
                *			text: "Legend",
                *			textMargin: {left: 5, top: 5, right: 5, bottom: 5 },
                *			textStyle: {fill: "black", "font-size": 12},
                *			titleStyle: {"font-size": 14}
                *			},
                *			seriesList: [{
                *			label: "US",
                *			data: {
                *			x: ['PS3', 'XBOX360', 'Wii'],
                *			y: [12.35, 21.50, 30.56]
                *			}
                *			},
                *			{
                *			label: "Japan",
                *			data: {
                *			x: ['PS3', 'XBOX360', 'Wii'],
                *			y: [4.58, 1.23, 9.67]
                *			}
                *			},
                *			{
                *			label: "Other",
                *			data: {
                *			x: ['PS3', 'XBOX360', 'Wii'],
                *			y: [31.59, 37.14, 65.32]
                *			}
                *			}],
                *		});
                *	});
                */
                this.legend = {
                    text: // / <summary>
                    /**
                    * A value that indicates the text to use as the title at the top of the legend.
                    * @remarks
                    * Set style properties on this text using the titleStyle attribute.
                    */
                    "",
                    textMargin: /**
                    * A value in pixels that indicates the amount of space to leave around the text inside the legend.
                    */
                    {
                        left: 2,
                        top: 2,
                        right: 2,
                        bottom: 2
                    },
                    style: /**
                    * A value that indicates the background color (fill) and border (stroke) of the legend.
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the 'attr' method's parameters.
                    */
                    {
                        fill: "none",
                        stroke: "none"
                    },
                    textWidth: /**
                    * A value that indicates the width of the legend text.
                    */
                    null,
                    textStyle: /**
                    * A value that indicates the style of the series label text. The text values come from the seriesList labels.
                    * @remarks
                    * Note: Any style options set in the fallback textStyle option are used for
                    * any style options that are not set explicitly (or set by default) in this option.
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the 'attr' method's parameters.
                    */
                    {
                        fill: "#333",
                        stroke: "none"
                    },
                    titleStyle: /**
                    * A value that indicates the style of the legend title. The text for the title is set in the text
                    * attribute of the legend.
                    * @remarks
                    * Note: Any style options set in the fallback textStyle option are used for any
                    * style options that are not set explicitly (or set by default) in this option.
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the 'attr' method's parameters.
                    */
                    {
                        "font-weight": "bold",
                        fill: "#000",
                        stroke: "none"
                    },
                    compass: /**
                    * A value that indicates the compass position of the legend.
                    * @remarks
                    * Valid Values: "north", "south", "east", "west"
                    */
                    "east",
                    orientation: /**
                    * A value that indicates the orientation of the legend.
                    * @remarks
                    * Vertical orientation generally works better with an east or west compass setting for the
                    * legend, while horizontal is more useful with a north or south compass setting and a small
                    * number of series in the seriesList.
                    * Valid Values:
                    *		"horizontal" Displays series labels and colors in a row.
                    *		"vertical" Displays series labels and colors in a column.
                    */
                    "vertical",
                    visible: /**
                    * A value that indicates whether to show the legend. Set this value to false to hide the legend.
                    */
                    true
                };
                /**
                * A value that contains all of the information to create the X and Y axes of the chart
                */
                this.axis = {
                    x: /**
                    * An object containing all of the information to create the X axis of the chart.
                    */
                    {
                        alignment: /**
                        * Sets the alignment of the X axis title text.
                        * @remarks
                        * Options are 'center', 'near', 'far'.
                        */
                        "center",
                        style: /**
                        * A value that indicates the style of the X axis.
                        * @remarks
                        * The style is defined in Raphael here is the documentation:http://raphaeljs.com/reference.html#Element.attr.
                        * The style is the “attr” method’s parameters.
                        */
                        {
                            stroke: "#999999",
                            "stroke-width": 0.5
                        },
                        visible: /**
                        * A value that indicates the visibility of the X axis.
                        */
                        true,
                        textVisible: /**
                        * A value that indicates the visibility of the X axis text.
                        */
                        true,
                        text: /**
                        * Sets the text to use for the X axis title.
                        */
                        "",
                        textStyle: /**
                        * A value that indicates the style of text of the X axis.
                        * @remarks
                        * Note: Any style options set in the fallback textStyle option are used for
                        * any style options that are not set explicitly (or set by default) in this option.
                        * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                        * The style is the “attr” method’s parameters.
                        */
                        {
                            fill: "#888",
                            "font-size": 15,
                            "font-weight": "bold"
                        },
                        labels: /**
                        * A value that provides information for the labels.
                        */
                        {
                            style: /**
                            * A value that indicates the style of major text of the X axis.
                            * @remarks
                            * Note: Any style options set in the fallback textStyle option are used for any style
                            * options that are not set explicitly (or set by default) in this option.
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            {
                                fill: "#333",
                                "font-size": 11
                            },
                            textAlign: /**
                            * A value that indicates the alignment of major text of the X axis.
                            * @remarks
                            * Options are 'near', 'center' and 'far'.
                            */
                            "near",
                            width: /**
                            * A value that indicates the width of major text of the X axis.
                            * @remarks
                            * If the value is null, then the width will be calculated automatically.
                            */
                            null
                        },
                        compass: /**
                        * A value that indicates where to draw the X axis using the four points of a compass.
                        * @remarks
                        *		"north" Draws the axis along the top edge of the chart.
                        *		"south" Draws the axis along the bottom edge of the chart.
                        *		"east" Draws the axis along the right edge of the chart.
                        *		"west" Draws the axis along the left edge of the chart.
                        */
                        "south",
                        autoMin: /**
                        * A value that indicates whether to calculate the axis minimum value automatically.
                        * @remarks
                        * If you set this value to false, in order to show major tick marks on the axis, you must
                        * specify a value for the min option.
                        */
                        true,
                        autoMax: /**
                        * A value that indicates whether to calculate the axis maximum value automatically.
                        * @remarks
                        * If you set this value to false, in order to show major tick marks on the axis, you must specify a
                        * value for the max option.
                        */
                        true,
                        min: /**
                        * A value that indicates the minimum value of the axis.
                        @type {?number}
                        */
                        null,
                        max: /**
                        * A value that indicates the maximum value of the axis.
                        * @type {?number}
                        */
                        null,
                        origin: /**
                        * A value that indicates the origin value of the X axis.
                        * @type {?number}
                        */
                        null,
                        autoMajor: /**
                        * A value that indicates whether to calculate the major tick mark values automatically.
                        * @remarks
                        * If you set this value to false, in order to show major tick marks on the axis, you must
                        * specify a value for the unitMajor option.
                        */
                        true,
                        autoMinor: /**
                        * A value that indicates whether to calculate the minor tick mark values automatically
                        * @remarks
                        * If you set this value to false, in order to show minor tick marks on the axis, you must
                        * specify a value for the unitMinor option.
                        */
                        true,
                        unitMajor: /**
                        * A value that indicates the units between major tick marks.
                        * @type {?number}
                        */
                        null,
                        unitMinor: /**
                        * A value that indicates the units between minor tick marks.
                        * @type {?number}
                        */
                        null,
                        gridMajor: /**
                        * A value that provides information for the major grid line.
                        */
                        {
                            visible: /**
                            * A value that indicates the visibility of the major grid line.
                            */
                            false,
                            style: /**
                            * A value that indicates the style of the major grid line
                            * @remarks
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            {
                                stroke: "#CACACA",
                                "stroke-dasharray": "- "
                            }
                        },
                        gridMinor: /**
                        *  A value that provides information for the minor grid line.
                        */
                        {
                            visible: /**
                            * A value that indicates the visibility of the minor grid line.
                            */
                            false,
                            style: /**
                            * A value that indicates the style of the minor grid line.
                            * @remarks
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            {
                                stroke: "#CACACA",
                                "stroke-dasharray": "- "
                            }
                        },
                        tickMajor: /**
                        * Creates an object with all of the settings to use in drawing tick marks that appear next to the numeric
                        * labels for major values along the X axis.
                        */
                        {
                            position: /**
                            * A value that indicates the position of the major tick mark in relation to the axis.
                            * @remarks
                            * Valid Values: none, inside, outside, cross
                            */
                            "none",
                            style: /**
                            * A value that indicates the style of major tick mark
                            * @remarks
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            {
                                fill: "black"
                            },
                            factor: /**
                            * A value that indicates an integral factor for major tick mark length.
                            */
                            1
                        },
                        tickMinor: /**
                        * A value that provides information for the minor tick.
                        */
                        {
                            position: /**
                            * A value that indicates the type of minor tick mark.
                            * @remarks
                            * Valid Values: none, inside, outside, cross
                            */
                            "none",
                            style: /**
                            * A value that indicates the style of minor tick mark
                            * @remarks
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            {
                                fill: "black"
                            },
                            factor: /**
                            * A value that indicates an integral factor for minor tick mark length.
                            */
                            1
                        },
                        annoMethod: /**
                        * The annoMethod option indicates how to label values along the axis.
                        * @remarks
                        * Valid Values:
                        *		"values" Uses numeric seriesList data values to annotate the axis.
                        *		"valueLabels" Uses the array of string values that you provide in the valueLabels option to
                        *			annotate the axis.
                        */
                        "values",
                        annoFormatString: /**
                        * The annoFormatString option uses Standard Numeric Format Strings to provide formatting for numeric
                        * values in axis labels.
                        */
                        "",
                        valueLabels: /**
                        * The valueLabels option shows a collection of valueLabels for the X axis.
                        * @remarks
                        * If the annoMethod is "values", this option will lost effect, If the annoMethod is "valueLabels",
                        * the axis's label will set to this option's value.
                        */
                        []
                    },
                    y: // todo.
                    // autoOrigin: true,
                    // origin: null,
                    // tickLabel: "nextToAxis",
                    /**
                    * An object containing all of the information to create the Y axis of the chart.
                    */
                    {
                        alignment: /**
                        * A value that indicates the alignment of the Y axis text.
                        * @remarks
                        * Options are 'center', 'near', 'far'.
                        */
                        "center",
                        style: /**
                        * A value that indicates the style of the Y axis.
                        * @remarks
                        * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                        * The style is the “attr” method’s parameters.
                        */
                        {
                            stroke: "#999999",
                            "stroke-width": 0.5
                        },
                        visible: /**
                        * A value that indicates the visibility of the Y axis.
                        */
                        false,
                        textVisible: /**
                        * A value that indicates the visibility of the Y axis text.
                        */
                        true,
                        text: /**
                        * Sets the text to use for the Y axis title.
                        */
                        "",
                        textStyle: /**
                        * A value that indicates the style of text of the Y axis.
                        * @remarks
                        * Note: Any style options set in the fallback textStyle option are used for any style options that are not
                        * set explicitly (or set by default) in this option.
                        * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                        * The style is the “attr” method’s parameters.
                        */
                        {
                            fill: "#888",
                            "font-size": 15,
                            "font-weight": "bold"
                        },
                        labels: /**
                        * A value that provides information for the labels.
                        */
                        {
                            style: /**
                            * A value that indicates the style of major text of the Y axis.
                            * @remarks
                            * Note: Any style options set in the fallback textStyle option are used for any style options
                            * that are not set explicitly (or set by default) in this option.
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            {
                                fill: "#333",
                                "font-size": 11
                            },
                            textAlign: /**
                            * A value that indicates the alignment of major text of the Y axis.
                            * @remarks
                            * Options are 'near', 'center' and 'far'.
                            */
                            "center",
                            width: /**
                            * A value that indicates the width major text of the Y axis.
                            * @remarks
                            * If the value is null, then the width will be calculated automatically.
                            * @type {?number}
                            */
                            null
                        },
                        compass: /**
                        * A value that indicates the compass position of the Y axis.
                        * @remarks
                        * Options are 'north', 'south', 'east' and 'west'.
                        */
                        "west",
                        autoMin: /**
                        * A value that indicates whether the axis minimum value is calculated automatically.
                        */
                        true,
                        autoMax: /**
                        * A value that indicates whether the axis maximum value is calculated automatically.
                        */
                        true,
                        min: /**
                        * A value that indicates the minimum value of the axis.
                        * @type {?number}
                        */
                        null,
                        max: /**
                        * A value that indicates the maximum value of the axis.
                        * @type {?number}
                        */
                        null,
                        origin: /**
                        * A value that indicates the origin value of the Y axis.
                        * @type {?number}
                        */
                        null,
                        autoMajor: /**
                        * A value that indicates whether the major tick mark values are calculated automatically.
                        */
                        true,
                        autoMinor: /**
                        * A value that indicates whether the minor tick mark values are calculated automatically.
                        */
                        true,
                        unitMajor: /**
                        * A value that indicates the units between major tick marks.
                        * @type {?number}
                        */
                        null,
                        unitMinor: /**
                        * A value that indicates the units between minor tick marks.
                        * @type {?number}
                        */
                        null,
                        gridMajor: /**
                        * A value that provides information for the major grid line.
                        */
                        {
                            visible: /**
                            * A value that indicates the visibility of the major grid line.
                            */
                            true,
                            style: /**
                            * A value that indicates the style of the major grid line.
                            * @remarks
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            {
                                stroke: "#999999",
                                "stroke-width": 0.5,
                                "stroke-dasharray": "none"
                            }
                        },
                        gridMinor: /**
                        * A value that provides information for the minor grid line.
                        */
                        {
                            visible: /**
                            * A value that indicates the visibility of the minor grid line.
                            */
                            false,
                            style: /**
                            * A value that indicates the style of the minor grid line.
                            * @remarks
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            {
                                stroke: "#CACACA",
                                "stroke-dasharray": "- "
                            }
                        },
                        tickMajor: /**
                        * A value that provides information for the major tick.
                        */
                        {
                            position: /**
                            * A value that indicates the type of major tick mark.
                            * @remarks
                            * Options are 'none', 'inside', 'outside' and 'cross'.
                            */
                            "none",
                            style: /**
                            * A value that indicates the style of major tick mark.
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            {
                                fill: "black"
                            },
                            factor: /**
                            * A value that indicates an integral factor for major tick mark length.
                            */
                            1
                        },
                        tickMinor: /**
                        * A value that provides information for the minor tick.
                        */
                        {
                            position: /**
                            * A value that indicates the type of minor tick mark.
                            * @remarks
                            * Options are 'none', 'inside', 'outside' and 'cross'.
                            */
                            "none",
                            style: /**
                            * A value that indicates the style of minor tick mark.
                            * @remarks
                            * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                            * The style is the “attr” method’s parameters.
                            */
                            {
                                fill: "black"
                            },
                            factor: /**
                            * A value that indicates an integral factor for minor tick mark length.
                            */
                            1
                        },
                        annoMethod: /**
                        * A value that indicates the method of annotation.
                        * @remarks
                        * Options are 'values', 'valueLabels'. If the value is “values”, when paint axis,
                        * the axis’s label will set to the data value of the series. If the value is “valueLabels”, when paint
                        * the axis, The axis’s label will set to a value which is set in axis’s valueLabels option.
                        */
                        "values",
                        annoFormatString: /**
                        * The annoFormatString option uses Standard Numeric Format Strings to provide formatting for numeric
                        * values in axis labels.
                        */
                        "",
                        valueLabels: /**
                        * The valueLabels option shows a collection of valueLabels for the X axis.
                        * @remarks
                        * If the annoMethod is "values", this option will lost effect, If the annoMethod is "valueLabels",
                        * the axis's label will set to this option's value.
                        */
                        []
                    }
                };// todo.
                // autoOrigin: true,
                // origin: null,
                // tickLabel: "nextToAxis",
                
                /**
                * Creates an object to use as the tooltip, or hint, when the mouse is over a chart element.
                * @remarks
                * By default, it displays the value of the seriesList label and Y data for the chart
                */
                this.hint = {
                    enable: /**
                    * A value that indicates whether to show the tooltip.
                    * @remarks
                    * Set this value to false to hide hints even when the mouse is over a chart element.
                    */
                    true,
                    content: /**
                    * A value that appears in the content part of the tooltip or a function which is
                    * used to get a value for the tooltip shown.
                    * @remarks
                    * If you do not set the content here, the hint displays content in the following order:
                    *  The hint option's title attribute
                    *  The seriesList option's label attribute, which shows "undefined" if you do not provide a label value
                    *  The seriesList option's data y attribute
                    * You can format the numeric Y data in this attribute using a function
                    */
                    null,
                    contentStyle: /**
                    * A value that indicates the style of content text.
                    * @remarks
                    * Note: Any style options set in the fallback textStyle option are used for any style
                    * options that are not set explicitly (or set by default) in this option.
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the 'attr' method's parameters.
                    */
                    {
                        fill: "#d1d1d1",
                        "font-size": 16
                    },
                    title: /**
                    * A text value (or a function returning a text value) to display in the hint on a line
                    * above the content.
                    */
                    null,
                    titleStyle: /**
                    * A value that indicates the style to use for the hint title text.
                    * @remarks
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * he style is the 'attr' method's parameters.
                    */
                    {
                        fill: "#d1d1d1",
                        "font-size": 16
                    },
                    style: /**
                    * A value that indicates the fill color or gradient and outline thickness and color
                    * (stroke) of the rectangle used to display the hint.
                    * @remarks
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the 'attr' method's parameters.
                    */
                    {
                        fill: "#000000",
                        "stroke-width": 2
                    },
                    animated: /**
                    * A value that indicates the effect to use when showing or hiding the hint when showAnimated
                    * or hideAnimated is not specified.
                    * @remarks
                    * The only animation style included is "fade." If you want a different one, you can create a custom animation
                    */
                    "fade",
                    showAnimated: /**
                    * A value that indicates the animation effect to use when the hint appears after you mouse into the chart element.
                    * @remarks
                    * This allows you to use a different effect when you mouse out of a bar than when you mouse in. (See also
                    * hideAnimated.) If you set this value to null, the animated property supplies the animation effect to use.
                    * The only animation style included is "fade." If you want a different one, you can create a custom animation
                    */
                    "fade",
                    hideAnimated: /**
                    * A value that indicates the animation effect to use when the hint goes away after you mouse out of the chart element.
                    * @remarks
                    * This allows you to use a different effect when you mouse into a chart elemrnt than when you mouse out.
                    * (See also showAnimated.) If you set this value to null, the animated property supplies the animation
                    * effect to use. The only animation style included is "fade." If you want a different one, you can create
                    * a custom animation
                    */
                    "fade",
                    duration: /**
                    * A value that indicates the number of milliseconds it takes to show or hide the hint when you mouse over
                    * or mouse out of a bar with the showDuration or hideDuration attribute set to null.
                    */
                    120,
                    showDuration: /**
                    * A value that indicates the number of milliseconds it takes for the indicated animation effect to completely
                    * show the tooltip.
                    * @remarks
                    * This allows you to use a different number of milliseconds when you mouse out of a bar than when you mouse in.
                    */
                    120,
                    hideDuration: /**
                    * A value that indicates the number of milliseconds it takes for the indicated animation effect to completely
                    * hide the tooltip.
                    * @remarks
                    * This allows you to use a different number of milliseconds when you mouse into a bar than when you mouse out.
                    */
                    120,
                    easing: /**
                    * A value that indicates the easing animation used to show or hide the hint when you mouse over or mouse out
                    * of a bar with the showEasing or hideEasing attribute set to null.
                    * @remarks
                    * The easing is defined in Raphael, the documentation is:http://raphaeljs.com/reference.html#Raphael.easing_formulas
                    */
                    "",
                    showEasing: /**
                    * A value that indicates the easing effect to use when the hint appears after you mouse into the chart element.
                    * @remarks
                    * This allows you to use a different effect when you mouse out of a bar than when you mouse in. (See also
                    * hideEasing.) If you set this value to null, the easing property supplies the easing effect to use.
                    */
                    "",
                    hideEasing: /**
                    * A value that indicates the easing effect to use when the hint goes away after you mouse out of the chart element.
                    * @remarks
                    * This allows you to use a different effect when you mouse into a bar than when you mouse out. (See also
                    * showEasing.) If you set this value to null, the easing property supplies the easing effect to use.
                    */
                    "",
                    showDelay: /**
                    * A value that indicates the number of milliseconds to wait before showing the hint after the mouse moves
                    * into the chart element
                    * @remarks
                    * This allows you to use a different number of milliseconds when you mouse out of a bar than when you mouse in.
                    */
                    0,
                    hideDelay: /**
                    * A value that indicates the number of milliseconds to wait before hiding the hint after the mouse leaves
                    * the chart element
                    * @remarks
                    * This allows you to use a different number of milliseconds when you mouse into a bar than when you mouse out.
                    */
                    150,
                    compass: /**
                    * A value that indicates the compass position of the callout (the small triangle that points from the main
                    * hint box to the bar it describes) in relation to the hint box.
                    * @remarks
                    * Valid Values: west, east, south, southeast, southwest, northeast and northwest
                    */
                    "north",
                    offsetX: /**
                    * A value that indicates the horizontal distance in pixels from the mouse pointer to the callout triangle
                    * of the hint.
                    * @remarks
                    * The position of the callout triangle depends on the compass setting of the hint callout.
                    */
                    0,
                    offsetY: /**
                    * A value that indicates the vertical distance in pixels from the mouse pointer to the callout triangle
                    * of the hint.
                    * @remarks
                    * The position of the callout triangle depends on the compass setting of the hint callout.
                    */
                    0,
                    showCallout: /**
                    * Determines whether to show the callout element, the small triangle that points from the main hint box
                    * to the bar it describes.
                    * @remarks
                    * To change the appearance of the callout, see these other hint attributes: calloutFilled,calloutFilledStyle,
                    * and compass.
                    */
                    true,
                    calloutFilled: /**
                    * Determines whether to fill the callout (the small triangle that points from the main hint box to the bar
                    * it describes).
                    * @remarks
                    * If you set it to true, the callout triangle uses the colors you specify in the calloutFilledStyle
                    * attribute. Otherwise, it takes on the colors of the style attribute of the hint.
                    */
                    false,
                    calloutFilledStyle: /**
                    * A value that indicates the style to use in rendering the callout (the small triangle that points from the
                    * main hint box to the bar it describes).
                    * @remarks
                    * In order for this attribute of the callout to take effect, you must also set the calloutFilled attribute
                    * to true. Otherwise, it takes on the colors of the style attribute of the hint.
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the “attr” method’s parameters.
                    */
                    {
                        fill: "#000"
                    }
                };
                /**
                * Sets up an object that can display an indicator line running horizontally/vertically through the center
                * of each chart element in the chart when the user clicks the chart element.
                */
                this.indicator = {
                    visible: /**
                    * A value that indicates whether to show indicator lines when the user clicks a chart element in the chart.
                    */
                    false,
                    style: /**
                    * A value that contains the fill color and outline color (stroke) of the indicator lines.
                    * @remarks
                    * Note that when you set the stroke color of the indicator line, it extends this color to the outline
                    * of the #hint:hint for the duration of the click.
                    */
                    {
                        stroke: "#000000"
                    }
                };
                /**
                * A value that indicates whether to show default chart labels.
                */
                this.showChartLabels = true;
                /**
                * Sets all of the style options of the chart labels that show the value of each chart element.
                * @remarks
                * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                * The style is the “attr” method’s parameters.
                */
                this.chartLabelStyle = {
                };
                /**
                * Sets the numeric format of the chart labels that show the value of each chart element. You can use Standard
                * Numeric Format Strings.
                */
                this.chartLabelFormatString = "";
                /**
                * Sets a value indicating whether you can set the font-family of the text using a class instead of options.
                * @remarks
                * Note: This applies only to the font-family in the current version.
                */
                this.disableDefaultTextStyle = false;
                /**
                * A value that indicates whether to show a shadow around the edge of the chart.
                */
                this.shadow = true;
                /**
                * Sets the array to use as a source for data that you can bind to the axes in your seriesList.
                * @remarks
                * Use the data option, and bind values to your X and Y axes. For more information please see the datasource demo:
                * http://wijmo.com/demo/explore/?widget=BarChartsample=Array%20as%20datasource.
                */
                this.dataSource = null;
                /**
                * Bind a field to each series's data x array
                */
                this.data = null;
                /**
                * This event fires before the series changes. This event can be cancelled. "return false;" to cancel the event.
                * @event
                * @dataKey {array} oldSeriesList The old series list before changes.
                * @dataKey {array} newSeriesList The new series list that will replace the old one.
                */
                this.beforeSeriesChange = null;
                /**
                * This event fires when the series changes.
                * @event
                * @dataKey {object} data An object that contains new series values.
                */
                this.seriesChanged = null;
                /**
                * This event fires before the canvas is painted. This event can be cancelled. "return false;" to cancel the event.
                * @event
                */
                this.beforePaint = null;
                /**
                * This event fires after the canvas is painted.
                * @event
                */
                this.painted = null;
            }
            return wijchartcore_options;
        })();        
        wijchartcore.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijchartcore_options());
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
