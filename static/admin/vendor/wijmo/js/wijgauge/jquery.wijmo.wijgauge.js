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
    /*
    * Depends:
    *	raphael.js
    *	globalize.min.js
    *	jquery.ui.widget.js
    *	jquery.wijmo.raphael.js
    */
    (function (gauge) {
        var $ = jQuery;
        /** @ignore */
        (function (Compass) {
            Compass._map = [];
            Compass._map[0] = "east";
            Compass.east = 0;
            Compass._map[1] = "west";
            Compass.west = 1;
            Compass._map[2] = "south";
            Compass.south = 2;
            Compass._map[3] = "north";
            Compass.north = 3;
        })(gauge.Compass || (gauge.Compass = {}));
        var Compass = gauge.Compass;
        /** @ignore */
        var GaugeUtil = (function () {
            function GaugeUtil() { }
            GaugeUtil.mod360 = function mod360(value) {
                var result = value % 360;
                if(value < 0) {
                    result += 360;
                }
                return result;
            };
            GaugeUtil.getAngle = function getAngle(p1, pivot, p2) {
                var self = this, a = self.distance(pivot, p2), b = self.distance(pivot, p1), c = self.distance(p2, p1), a2 = a * a, b2 = b * b, c2 = c * c, angleRadians = Math.acos((c2 - b2 - a2) / (-2 * b * a));
                return Math.round(180 / Math.PI * angleRadians);
            };
            GaugeUtil.distance = function distance(a, b) {
                return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
            };
            GaugeUtil.log = function log(val, base) {
                if(val <= 0) {
                    return NaN;
                }
                if(base === 1 || base < 0) {
                    return NaN;
                }
                return Math.log(val) / Math.log(base);
            };
            GaugeUtil.generateValues = function generateValues(from, to, interval) {
                var list = [], qty, i;
                if(to > from && interval > 0) {
                    qty = parseInt(((to - from) / interval + 1).toString(), 10);
                    for(i = 0; i < qty; i++) {
                        list.push(from + i * interval);
                    }
                } else if(interval === 0) {
                    list.push(from);
                }
                return list;
            };
            GaugeUtil.isInRange = function isInRange(value, min, max) {
                return (value >= min && value <= max) || (value <= min && value >= max);
            };
            GaugeUtil.paintMarker = function paintMarker(canvas, marker, x, y, length, width, isHorizontal) {
                var ele;
                if(marker === "rect") {
                    return canvas.rect(x - length / 2, y - width / 2, length, width);
                } else {
                    if(isHorizontal) {
                        if(marker === "tri") {
                            ele = canvas.isoTri(x, y, length, width);
                        } else {
                            ele = canvas.paintMarker(marker, x, y, width);
                        }
                    } else {
                        ele = canvas.paintMarker(marker, x, y, length);
                    }
                    return ele;
                }
            };
            GaugeUtil.formatString = function formatString(str, format) {
                if($.isFunction(format)) {
                    return format.call(this, str);
                } else if(format !== "") {
                    var reg = /\{0(?::((?:n|d|p|c)\d?))?\}/gi, match, formater;
                    if(reg.test(format)) {
                        match = format.match(reg);
                        formater = "$1";
                        return format.replace(/\{0(?::(?:(?:n|d|p|c)\d?))?\}/gi, Globalize.format(str, formater));
                    }
                }
                return str;
            };
            GaugeUtil.getPositionByAngle = function getPositionByAngle(cx, cy, r, angle) {
                var point = {
                    x: 0,
                    y: 0
                }, rad = Raphael.rad(angle);
                point.x = cx - r * Math.cos(rad);
                point.y = cy - r * Math.sin(rad);
                return point;
            };
            GaugeUtil.donut = function donut(canvas, cx, cy, outerR, innerR, startAngle, endAngle) {
                var getPosByAngle = this.getPositionByAngle, outerS = getPosByAngle(cx, cy, outerR, startAngle), outerE = getPosByAngle(cx, cy, outerR, endAngle), innerS = getPosByAngle(cx, cy, innerR, startAngle), innerE = getPosByAngle(cx, cy, innerR, endAngle), largeAngle = endAngle - startAngle > 180, path;
                if((endAngle - startAngle) % 360 !== 0) {
                    path = [
                        "M", 
                        outerS.x, 
                        outerS.y, 
                        "A", 
                        outerR, 
                        outerR, 
                        0, 
                        +largeAngle, 
                        1, 
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
                    canvas.path(path);
                } else {
                    canvas.circle(cx, cy, outerR);
                }
            };
            return GaugeUtil;
        })();
        gauge.GaugeUtil = GaugeUtil;        
        Raphael.fn.isoTri = function (x, y, width, height, compass) {
            var x1 = x, y1 = y + height / 2, x2 = x + width, y2 = y, x3 = x + width, y3 = y + height, arrPath;
            if(compass == Compass.north) {
                x1 = x;
                y1 = y;
                x2 = x - width / 2;
                y2 = y + height;
                x3 = x + width / 2;
                y3 = y + height;
            } else if(compass === Compass.east) {
                x1 = x - width / 2;
                y1 = y - height / 2;
                x2 = x - width / 2;
                y2 = y + height / 2;
                x3 = x + width / 2;
                y3 = y;
            } else if(compass === Compass.west) {
                x1 = x - width / 2;
                y1 = y;
                x2 = x + width / 2;
                y2 = y - height / 2;
                x3 = x + width / 2;
                y3 = y + height / 2;
            }
            arrPath = [
                "M", 
                x1, 
                y1, 
                "L", 
                x2, 
                y2, 
                "L", 
                x3, 
                y3, 
                "z"
            ];
            return this.path(arrPath.join(" "));
        };
        /**
        * @widget
        */
        var wijgauge = (function (_super) {
            __extends(wijgauge, _super);
            function wijgauge() {
                _super.apply(this, arguments);

            }
            wijgauge.prototype._create = function () {
                var self = this, o = self.options, newEle;
                // enable touch support:
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                if(self.element.is(":hidden") && self.element.wijAddVisibilityObserver) {
                    self.element.wijAddVisibilityObserver(function () {
                        self.redraw();
                        if(self.element.wijRemoveVisibilityObserver) {
                            self.element.wijRemoveVisibilityObserver();
                        }
                    }, "wijgauge");
                }
                if(isNaN(o.width)) {
                    self._setDefaultWidth();
                }
                if(isNaN(o.height)) {
                    self._setDefaultHeight();
                }
                self._setDefaultWidthHeight();
                if(o.disabled) {
                    self.disable();
                }
                // handle the juice's function type
                if(o.face && o.face.template && typeof o.face.template === "string" && window[o.face.template]) {
                    o.face.template = window[o.face.template];
                }
                if(o.pointer && o.pointer.template && typeof o.pointer.template === "string" && window[o.pointer.template]) {
                    o.pointer.template = window[o.pointer.template];
                }
                if(o.cap && o.cap.template && typeof o.cap.template === "string" && window[o.cap.template]) {
                    o.cap.template = window[o.cap.template];
                }
                self.element.addClass(o.wijCSS.widget).toggleClass(o.wijCSS.stateDisabled, o.disabled);
                // if fail to create canvas, move element to body and recreate it
                // the issue that creating canvas in ie9 when element is invisible.
                try  {
                    self.canvas = Raphael(self.element[0], o.width, o.height);
                } catch (e) {
                    var displayCss = self.element.css("display");
                    newEle = $("<div></div>").insertBefore(self.element).append(self.element);
                    self.element.addClass("ui-helper-hidden-accessible").appendTo($('body'));
                    if(displayCss === "none") {
                        self.element.css("display", "block");
                    }
                    self.canvas = Raphael(self.element[0], o.width, o.height);
                    self.element.appendTo(newEle).unwrap().removeClass("ui-helper-hidden-accessible");
                    if(displayCss === "none") {
                        self.element.css("display", "none");
                    }
                }
                self._autoCalculate();
                self._draw();
            };
            wijgauge.prototype._setDefaultWidth = function () {
            };
            wijgauge.prototype._setDefaultHeight = function () {
            };
            wijgauge.prototype._setDefaultWidthHeight = function () {
                var self = this, ele = self.element, o = self.options, style = ele.get(0).style, width = style.width, height = style.height;
                if(width !== "") {
                    o.width = ele.width();
                }
                if(height !== "") {
                    o.height = ele.height();
                }
            };
            wijgauge.prototype._autoCalculate = function () {
            };
            wijgauge.prototype._setOption = function (key, value) {
                var self = this, o = self.options, oldValue = o[key];
                if(key === "disabled") {
                    self._handleDisabledOption(value, self.element);
                    _super.prototype._setOption.call(this, key, value);
                } else if(key === "value") {
                    if(self._trigger("beforeValueChanged", null, {
                        newValue: value,
                        oldValue: oldValue
                    })) {
                        _super.prototype._setOption.call(this, key, value);
                        self._set_value(value, oldValue);
                    }
                    self._trigger("valueChanged", null, {
                        newValue: value,
                        oldValue: oldValue
                    });
                } else {
                    _super.prototype._setOption.call(this, key, value);
                    if($.isPlainObject(value)) {
                        o[key] = $.extend({
                        }, oldValue, value);
                    }
                    if(o.radius === "auto") {
                        self._autoCalculate();
                        self.redraw();
                        return;
                    }
                    if(self["_set_" + key]) {
                        self["_set_" + key](value, oldValue);
                    }
                }
            };
            wijgauge.prototype._set_value = function (value, oldValue) {
                this._setPointer();
            };
            wijgauge.prototype._set_max = function () {
                this._redrawMarksAndLabels();
                this._set_ranges();
                this._setPointer();
            };
            wijgauge.prototype._set_min = function () {
                this._redrawMarksAndLabels();
                this._set_ranges();
                this._setPointer();
            };
            wijgauge.prototype._set_width = function () {
                this.redraw();
            };
            wijgauge.prototype._set_height = function () {
                this.redraw();
            };
            wijgauge.prototype._set_isInverted = function () {
                this.redraw();
            };
            wijgauge.prototype._set_tickMajor = function () {
                this._redrawMarksAndLabels();
            };
            wijgauge.prototype._set_tickMinor = function () {
                this._redrawMarksAndLabels();
            };
            wijgauge.prototype._set_pointer = function () {
                var self = this;
                if(self.pointer) {
                    self.pointer.wijRemove();
                    self.pointer = null;
                }
                self._paintPointer();
                self._setPointer();
            };
            wijgauge.prototype._set_islogarithmic = function () {
                var self = this;
                self._redrawMarksAndLabels();
                self._setPointer();
            };
            wijgauge.prototype._set_logarithmicBase = function () {
                var self = this;
                self._redrawMarksAndLabels();
                self._setPointer();
            };
            wijgauge.prototype._set_labels = function () {
                this._redrawMarksAndLabels();
            };
            wijgauge.prototype._set_margin = function (value, oldValue) {
                if(value !== oldValue) {
                    this.redraw();
                }
            };
            wijgauge.prototype._set_marginTop = function (value, oldValue) {
                this._set_margin(value, oldValue);
            };
            wijgauge.prototype._set_marginBottom = function (value, oldValue) {
                this._set_margin(value, oldValue);
            };
            wijgauge.prototype._set_marginLeft = function (value, oldValue) {
                this._set_margin(value, oldValue);
            };
            wijgauge.prototype._set_marginRight = function (value, oldValue) {
                this._set_margin(value, oldValue);
            };
            wijgauge.prototype._set_ranges = function () {
                var self = this;
                self._removeRanges();
                self._paintRanges();
                self._resetElementPosition();
            };
            wijgauge.prototype._set_face = function () {
                var self = this;
                if(self.face) {
                    self.face.wijRemove();
                    self.face = null;
                    self._paintFace();
                    self._resetElementPosition(true);
                }
            };
            wijgauge.prototype._clearState = function () {
                var self = this;
                self.labels = [];
                self.majorMarks = [];
                self.minorMarks = [];
                self.face = null;
                self.pointer = null;
            };
            wijgauge.prototype._resetElementPosition = //when redraw the range or face or pointer, reset the z-index of the elements.
            function (resetRangePosition) {
                var self = this;
                if(resetRangePosition && self.ranges) {
                    $.each(self.ranges, function (i, n) {
                        n.toFront();
                    });
                }
                if(self.majorMarks) {
                    $.each(self.majorMarks, function (i, mark) {
                        mark.toFront();
                    });
                }
                if(self.minorMarks) {
                    $.each(self.minorMarks, function (i, mark) {
                        mark.toFront();
                    });
                }
                if(self.labels) {
                    $.each(self.labels, function (i, label) {
                        label.toFront();
                    });
                }
                if(self.pointer) {
                    self.pointer.toFront();
                }
                if(self.cap) {
                    self.cap.toFront();
                }
            };
            wijgauge.prototype._redrawMarksAndLabels = function () {
                var self = this;
                self._removeMarksAndLabels();
                self._drawMarksAndLabels();
            };
            wijgauge.prototype._removeMarksAndLabels = function () {
                var self = this;
                $.each(self.labels, function (i, n) {
                    n.wijRemove();
                    self.labels[i] = null;
                });
                $.each(self.majorMarks, function (i, n) {
                    n.wijRemove();
                    self.majorMarks[i] = null;
                });
                $.each(self.minorMarks, function (i, n) {
                    n.wijRemove();
                    self.minorMarks[i] = null;
                });
            };
            wijgauge.prototype._drawMarksAndLabels = function () {
                var self = this;
                self.labels = [];
                self.majorMarks = [];
                self.minorMarks = [];
                self._paintMarks();
            };
            wijgauge.prototype._handleDisabledOption = function (disabled, ele) {
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
            wijgauge.prototype._createDisabledDiv = function (outerEle) {
                var self = this, o = self.options, ele = //Change your outerelement here
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
                    disabledDiv.addClass(o.stateDisabled).css("background-color", "#fff");
                }
                return disabledDiv;
            };
            wijgauge.prototype._triggerPainted = function () {
                return this._trigger("painted");
            };
            wijgauge.prototype._draw = function () {
                var self = this, o = self.options;
                self.pointer = null;
                self._innerBbox = {
                    width: o.width - o.marginLeft - o.marginRight,
                    height: o.height - o.marginTop - o.marginBottom,
                    left: o.marginLeft,
                    top: o.marginTop
                };
                self.face = self._paintFace();
                if(self.ranges) {
                    self._removeRanges();
                }
                self._paintRanges();
                self._drawMarksAndLabels();
                self._paintPointer();
                if(self.pointer) {
                    self._setOffPointerValue();
                    self._setPointer();
                }
                $.wijraphael.clearRaphaelCache();
                self._triggerPainted();
            };
            wijgauge.prototype.redraw = /**
            * Redraw the gauge.
            */
            function () {
                var self = this, o = self.options;
                self.element.empty();
                this._clearState();
                self.canvas = Raphael(self.element[0], o.width, o.height);
                self._draw();
            };
            wijgauge.prototype.destroy = /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            function () {
                var self = this;
                self._unbindEvents(self.majorMarks);
                self._unbindEvents(self.minorMarks);
                self._unbindEvents(self.labels);
                self.element.removeClass("ui-widget").empty();
                //Add for fixing bug 16039
                if(self.disabledDiv) {
                    self.disabledDiv.remove();
                    self.disabledDiv = null;
                }
                //end for bug 16039
                _super.prototype.destroy.call(this);
            };
            wijgauge.prototype.getCanvas = /**
            * Returns a reference to the Raphael canvas object.
            * @returns {Raphael Element} Reference to raphael canvas object.
            */
            function () {
                /// <summary>
                /// Returns a reference to the Raphael canvas object.
                /// Code example:
                /// $("gauge").wijgauge("getCanvas");
                /// </summary>
                /// <returns type="Raphael">
                /// Reference to raphael canvas object.
                /// </returns>
                return this.canvas;
            };
            wijgauge.prototype._percentage = function () {
                var self = this, o = self.options, max = o.max, min = o.min, value = o.value;
                if(isNaN(value)) {
                    return 0;
                }
                if(max === min) {
                    return 1;
                }
                return (value - min) / (max - min);
            };
            wijgauge.prototype._valueToLogical = function (value) {
                var self = this, o = self.options, min = o.min, max = o.max, logarithmicBase = o.logarithmicBase, linerValue, alpha;
                if(value < min) {
                    return 0;
                }
                if(max < value) {
                    return 1;
                }
                linerValue = (value - min) / (max - min);
                if(!o.islogarithmic) {
                    alpha = linerValue;
                } else {
                    alpha = GaugeUtil.log(1 + (logarithmicBase - 1) * linerValue, o.logarithmicBase);
                }
                return alpha;
            };
            wijgauge.prototype._logicalToValue = function (alpha) {
                var self = this, o = self.options, max = o.max, min = o.min, linearValue;
                if(alpha < 0) {
                    return min;
                }
                if(1 <= alpha) {
                    return max;
                }
                if(!o.islogarithmic) {
                    linearValue = alpha;
                } else {
                    if(o.logarithmicBase <= 1) {
                        return o.min;
                    }
                    linearValue = (Math.pow(o.logarithmicBase, alpha) - 1) / (o.logarithmicBase - 1);
                    //linearValue = Math.pow(alpha, o.logarithmicBase);
                                    }
                return min + (max - min) * linearValue;
            };
            wijgauge.prototype._bindClickEvents = function (eles) {
                var self = this;
                $.each(eles, function (i, n) {
                    $(n.node).bind("click." + self.widgetName, function (e) {
                        self._trigger("click", e, {
                            ele: n
                        });
                    });
                });
            };
            wijgauge.prototype._unbindEvents = function (eles) {
                var self = this;
                $.each(eles, function (i, n) {
                    $(n.node).unbind("." + self.widgetName);
                });
            };
            wijgauge.prototype._setOffPointerValue = function () {
            };
            wijgauge.prototype._setPointer = function () {
                //$.wijraphael.clearRaphaelCache();
                            };
            wijgauge.prototype._paintPointer = function () {
            };
            wijgauge.prototype._paintFace = function () {
            };
            wijgauge.prototype._paintRanges = function () {
                var self = this, o = self.options, ranges = o.ranges || [];
                self.ranges = [];
                $.each(ranges, function (i, n) {
                    self._paintRange(n);
                });
            };
            wijgauge.prototype._paintRange = function (range) {
            };
            wijgauge.prototype._removeRanges = function () {
                var self = this;
                $.each(self.ranges, function (i, n) {
                    n.wijRemove();
                    self.ranges[i] = null;
                });
            };
            wijgauge.prototype._paintMarks = function () {
                var self = this, o = self.options, generateValues = GaugeUtil.generateValues, majorMarks = generateValues(o.min, o.max, o.tickMajor.interval), minorMarks = generateValues(o.min, o.max, o.tickMinor.interval), labelInfo = o.labels, showLabels = labelInfo.visible;
                if(o.tickMajor.visible) {
                    $.each(majorMarks, function (i, n) {
                        self.majorMarks.push(self._paintMark(n, o.tickMajor, true));
                        if(showLabels) {
                            self.labels.push(self._paintLabel(n, labelInfo));
                        }
                    });
                }
                if(o.tickMinor.visible) {
                    $.each(minorMarks, function (i, n) {
                        var IsInMajor = false;
                        $.each(majorMarks, function (k, m) {
                            if(n === m) {
                                IsInMajor = true;
                                return false;
                            }
                        });
                        if(!IsInMajor) {
                            self.minorMarks.push(self._paintMark(n, o.tickMinor, false));
                        }
                    });
                }
                self._bindClickEvents(self.majorMarks);
                self._bindClickEvents(self.minorMarks);
                self._bindClickEvents(self.labels);
            };
            wijgauge.prototype._paintMark = function (n, tickMajor, tag) {
            };
            wijgauge.prototype._paintLabel = function (n, labelInfo) {
            };
            return wijgauge;
        })(wijmo.wijmoWidget);
        gauge.wijgauge = wijgauge;        
        var wijgauge_options = (function () {
            function wijgauge_options() {
                /**
                * Sets the value of the gauge, indicated by the pointer.
                * @remarks
                * This value must fall between the min and max values that you set.
                */
                this.value = 0;
                /**
                * Sets the maximum value of the gauge.
                * @remarks
                * Use this option along with min to set the numeric scale of values that are shown on the gauge. This setting limits
                * your valid values for other options, such as value and ranges.
                */
                this.max = 100;
                /**
                * Sets the minimum value of the gauge.
                * @remarks
                * Use this option along with min to set the numeric scale of values that are shown on the gauge. This setting limits
                * your valid values for other options, such as value and ranges.
                */
                this.min = 0;
                /**
                * Sets the width of the gauge area in pixels.
                */
                this.width = 600;
                /**
                * Sets the height of the gauge area in pixels.
                */
                this.height = 400;
                /**
                * Sets appearance options for the major tick marks that appear next to the numeric labels around the face of the gauge.
                * @example
                *    $(document).ready(function () {
                *        $("#radialgauge1").wijradialgauge({
                * 		value: 90,
                * 		tickMajor: {
                * 		position: "inside",
                * 		style: { fill: "purple", stroke: "#1E395B"},
                * 		factor: 2.5,
                * 		marker: 'diamond',
                * 		visible: true,
                * 		offset: 27,
                * 		interval: 20
                * 		}
                * 	});
                * });
                */
                this.tickMajor = {
                    position: /**
                    * A value that indicates the position of the major tick marks in relation to the edge of the face
                    * @remarks
                    * Valid Values:
                    *		"inside" -- Draws the major tick marks inside the edge of the face.
                    *		"outside" -- Draws the major tick marks outside the edge of the face.
                    *		"cross" -- Draws the major tick marks centered on the edge of the face.
                    */
                    "inside",
                    style: /**
                    * A value that indicates the fill color and outline (stroke) of the major tick mark.
                    */
                    {
                        fill: "#1E395B",
                        stroke: "none"
                    },
                    factor: /**
                    * A value that indicates how long to draw the major tick marks as a factor of the default length of the minor tick marks.
                    */
                    2,
                    visible: /**
                    * A value that indicates whether to show the major tick mark.
                    */
                    true,
                    marker: /**
                    * A value that indicates the shape to use in drawing major tick marks.
                    * @remarks
                    * Options are 'rect', 'tri', 'circle', 'invertedTri', 'box', 'cross', 'diamond'.
                    */
                    "rect",
                    offset: /**
                    * A value that indicates the distance in pixels from the edge of the face to draw the major tick marks.
                    * The numeric labels are drawn a few pixels
                    */
                    0,
                    interval: /**
                    * A value that indicates the frequency of the major tick marks and their numeric labels.
                    * @remarks
                    * A setting of 1 renders a major tick mark for every number between the min and max.This setting is useful when
                    * the spread between min and max is small. The default setting of 10 renders a major tick mark once every 10 numbers
                    * between the min and the max. A setting of 100 renders a major tick mark once every 100 numbers between the min
                    * and max. This setting is useful when the spread between min and max is very large.
                    */
                    10
                };
                /**
                * A value that provides information for the minor tick.
                * @example
                * //This example renders the minor tick marks as purple crosses, at an interval of once every 2 numbers
                *    $(document).ready(function () {
                *        $("#radialgauge1").wijradialgauge({
                *		value: 90,
                *		tickMinor: {
                *		position: "inside",
                *		style: { fill: "#1E395B", stroke: "purple"},
                *		factor: 2,
                *		marker: 'cross',
                *		visible: true,
                *		offset: 30,
                *		interval: 2
                *		}
                *		});
                *		});
                */
                this.tickMinor = {
                    position: /**
                    * A value that indicates the position of the minor tick marks in relation to the edge of the face.
                    * @remarks
                    * Valid Values:
                    *		"inside" -- Draws the minor tick marks inside the edge of the face.
                    *		"outside" -- Draws the minor tick marks outside the edge of the face.
                    *		"cross" -- Draws the minor tick marks centered on the edge of the face.
                    */
                    "inside",
                    style: /**
                    * A value that indicates the fill color and outline (stroke) of the minor tick mark.
                    */
                    {
                        fill: "#1E395B",
                        "stroke": "none"
                    },
                    factor: /**
                    * A value that indicates how long to draw the minor tick marks as a factor of the default length of the minor
                    * tick marks, which is half the default length of the major tick marks.
                    */
                    1,
                    visible: /**
                    * A value that indicates whether to show the minor tick mark.
                    */
                    false,
                    marker: /**
                    * A value that indicates the shape to use in drawing minor tick marks.
                    * @remarks
                    * In order to use the 'cross' marker shape, you must specify a color for the stroke setting of the style option.
                    * The other shapes use the fill setting, but since the cross is not a closed shape, fill has no effect, and
                    * we must use the outline (stroke) color.
                    * Options are 'rect', 'tri', 'circle', 'invertedTri', 'box', 'cross', 'diamond'.
                    */
                    "rect",
                    offset: /**
                    * A value that indicates the distance in pixels from the edge of the face to draw the minor tick marks.
                    * @remarks
                    * By default, they are three pixels in from the major tick marks.
                    */
                    0,
                    interval: /**
                    * A value that indicates the frequency of the minor tick marks.
                    */
                    5
                };
                /**
                * A value that includes all settings of the gauge pointer.
                * @example
                * // The example above renders the pointer as a purple-outlined blue rectangle of 125% the length of the radius
                * // by 10 pixels wide, offset back through the cap by 50% of the length of the radius
                *    $(document).ready(function () {
                *        $("#radialgauge1").wijradialgauge({
                *		value: 90,
                *		cap: {visible: true},
                *		pointer: {
                *		length: 1.25,
                *		offset: 0.5,
                *		shape: "rect",
                *		style: { fill: "blue", stroke: "purple"},
                *		width: 10
                *		}
                *		});
                *		});
                */
                this.pointer = {
                    length: /**
                    * Sets the length of the pointer as a percentage of the radius(or width/height in lineargauge) of the gauge.
                    * You can set the length to be greater than the radius(or width/height).
                    */
                    1,
                    style: /**
                    * Sets the fill and outline (stroke) colors of the pointer.
                    */
                    {
                        fill: "#1E395B",
                        stroke: "#1E395B"
                    },
                    width: /**
                    * Sets the width of the pointer in pixels.
                    */
                    8,
                    offset: /**
                    * Sets the percentage of the pointer that is shoved backward through the cap.
                    */
                    0,
                    shape: /**
                    * Sets the shape in which to render the pointer: triangular or rectangular.
                    * @remarks
                    * Options are 'rect', 'tri'.
                    */
                    "tri",
                    visible: /**
                    * A value that indicates whether to show the pointer.
                    */
                    true,
                    template: /**
                    * A JavaScript callback value that returns a Raphael element that draws the pointer.
                    * @remarks
                    * Use this option to customize the pointer. In order to use the template, you must know how to draw Raphael
                    * graphics For more information,see the Raphael documentation.
                    * In radial gauge：
                    * The pointer template's callback contains two arguments:
                    *		startLocation -- The starting point from which to draw the pointer. This argument is defined by x and y coordinates.
                    *		pointerInfo -- A JSON object that extends the gauge's pointer options:
                    *			offset -- Sets the percentage of the pointer that is shoved backward through the origin.
                    *			length -- Sets the absolute value in pixels of the length of the pointer.
                    *			gaugeBBox -- An object that sets the bounding box of the gauge, as defined by x and y coordinates and width and height options.
                    */
                    null
                };
                /**
                * The islogarithmic option, inherited from the jquery.wijmo.wijgauge.js base class, indicates whether to use logarithmic
                * scaling for gauge label numeric values.
                * @remarks
                * This adds space between tick marks that corresponds to the percentage of change between those numbers rather than
                * absolute arithmetic values. You would want to use logarithmic scaling if you were displaying really high numbers,
                * because it goes higher much more quickly. A linear scale is more difficult to use if you are displaying really high
                * numbers. Note: By default, Wijmo uses a logarithmic base of 10, the common logarithm. See logarithmicBase for
                * information on changing this value.
                * @example
                * // The following code creates a gauge with the number labels and tick marks arranged as in the following image.
                *    $(document).ready(function () {
                *        $("#radialgauge1").wijradialgauge({
                *		value: 90,
                *		islogarithmic: true
                *		});
                *		});
                */
                this.islogarithmic = false;
                /**
                * The logarithmicBase option, inherited from the jquery.wijmo.wijgauge.js base class, indicates the logarithmic
                * base to use if the islogarithmic option is set to true. The logarithmic base is the number to raise to produce the exponent.
                * @remarks
                * For example, with the default base 10, a logarithm of 3 produces 1000, or 10 to the power of 3, or 10³ = 10 x 10 x 10 = 1000.
                * If you change the base to 2, a logarithm of 3 produces 8, or 2³ = 2 x 2 x 2 = 8. You can use the natural
                * logarithm (using a base of ≈ 2.718) by specifying the value Math.e.
                */
                this.logarithmicBase = 10;
                /**
                * Sets all of the appearance options of the numeric labels that appear around the edge of the gauge.
                * @example
                * // This example sets the color for the labels to purple, and the font to 14 point, bold, Times New Roman.
                * $(document).ready(function () {
                *    $("#radialgauge1").wijradialgauge({
                *		value: 90,
                *		labels: {
                *		style: {
                *			fill: "purple",
                *				"font-size": "14pt",
                *				"font-weight": "bold",
                *				"font-family": "Times New Roman"
                *			}
                *		}
                *	});
                *});
                */
                this.labels = {
                    format: /**
                    * A value that indicates the globalized format to use for the labels.
                    * @remarks
                    * For more information on using jQuery globalize with Wijmo
                    * Note: If the value is a function rather than a string, the function formats the value and returns it to the gauge.
                    */
                    "",
                    style: /**
                    * A value that indicates the color, weight, and size of the numeric labels.
                    */
                    {
                        fill: "#1E395B",
                        "font-size": 12,
                        "font-weight": "800"
                    },
                    visible: /**
                    * A value that indicates whether to show the numeric labels.
                    */
                    true,
                    offset: /**
                    * A value in pixels that indicates the distance of the numeric labels from the outer reach of the pointer.
                    * @remarks
                    * A value of 50 pixels renders the labels outside the circular gauge area, cutting off the numbers along
                    * the top. A value of 0 pixels renders the labels just inside the tick marks.
                    */
                    0
                };
                /**
                * Defines the animation effect, controlling aspects such as duration and easing.
                */
                this.animation = {
                    enabled: /**
                    * A value that determines whether to show animation.
                    */
                    true,
                    duration: /**
                    * The duration option defines the length of the animation effect in milliseconds.
                    */
                    2000,
                    easing: /**
                    * The easing option uses Raphael easing formulas to add effects to the animation, such as allowing an item to
                    * bounce realistically.
                    * @remarks
                    * Valid Values (see http://raphaeljs.com/easing.html for easing demos):
                    */
                    ">"
                };
                /**
                * Sets or draws the image or shape to use for the face of the gauge and the background area.
                * @remarks
                * The origin is the center of the gauge, but the image draws from the top left, so we first calculate the starting point
                * of the top left based on the origin, and we calculate the width and height based on the radius of the face. The radius
                * of the face is half of the min of the width and height.
                * Note: The fill property is defined using the Raphael framework. Please see the Raphael Element attr method for more
                * information. The face can be filled with a simple color, or a gradient. The default fill is a radial gradient,
                * indicated by the r in the fill property.
                * @example
                * // This example uses a custom image for the face of the gauge. The argument that we name ui in the example is a JSON
                * // object. This object has a canvas, which is a Raphael paper object, and we use the image method of the Raphael
                * // paper that takes five parameters: source, x, y, width, and height. See the Raphael documentation for more information.
                * // We also set the radius to 120 pixels to render it inside the white area of the image.
                *$(document).ready(function () {
                *	$("#radialgauge1").wijradialgauge({
                *		value: 90,
                *		radius: 120,
                *		face: {
                *			style: {},
                *			template: function (ui) {
                *				var url = "images/customGaugeFace.png";
                *				return ui.canvas.image(url, ui.origin.x -ui.r, ui.origin.y -ui.r, ui.r * 2, ui.r * 2);
                *			}
                *		}
                *	});
                *});
                */
                this.face = {
                    style: /**
                    * A value that indicates the fill color (or gradient), and the outline color and width of the gauge face.
                    */
                    {
                        fill: "270-#FFFFFF-#D9E3F0",
                        stroke: "#7BA0CC",
                        "stroke-width": 4
                    },
                    template: /**
                    * A JavaScript callback value that returns a Raphael element (or set) that draws the gauge face.
                    * @remarks
                    * If you are only using one shape, the function returns a Raphael element. If you define multiple shapes,
                    * have the function create a Raphael set object, push all of the Raphael elements to the set, and return the
                    * set to wijgauge. In order to use the template, you must know how to draw Raphael graphics.
                    * For more information, see the Raphael documentation.
                    * In radial gauge
                    * The face template's callback contains one argument with the following parameters:
                    *		origin -- The starting point from which to draw the center of the face.This argument is defined by x and y coordinates.
                    *		canvas -- A Raphael paper object that you can use to draw the custom graphic to use as the face.
                    */
                    null
                };
                /**
                * Sets a value in pixels that indicates where to render the top edge of the gauge face.
                * @remarks
                * Note: If the radius of the gauge is too large to fit within the rectangle defined by the width and height less the
                * specified margins, and the radius is set to the default value of "auto," Wijmo automatically resizes the gauge to fit.
                */
                this.marginTop = 0;
                /**
                * Sets a value in pixels that indicates where to render the right edge of the gauge face.
                * @remarks
                * Note: If the radius of the gauge is too large to fit within the rectangle defined by the width and height less
                * the specified margins, and the radius is set to the default value of "auto," Wijmo automatically resizes the gauge to fit.
                */
                this.marginRight = 0;
                /**
                * Sets a value in pixels that indicates where to render the bottom edge of the gauge face.
                * @remarks
                * Note: If the radius of the gauge is too large to fit within the rectangle defined by the width and height less the
                * specified margins, and the radius is set to the default value of "auto," Wijmo automatically resizes the gauge to fit.
                */
                this.marginBottom = 0;
                /**
                * Sets a value in pixels that indicates where to render the left edge of the gauge face.
                * @remarks
                * Note: If the radius of the gauge is too large to fit within the rectangle defined by the width and height less the
                * specified margins, and the radius is set to the default value of "auto," Wijmo automatically resizes the gauge to fit.
                */
                this.marginLeft = 0;
                /**
                * Allows you to create an array of ranges to highlight where values fall within the gauge.
                *@remarks
                * For example, a red range, a yellow range, and a green range. Each range is drawn in the form of a curved bar.
                * You can control every aspect of each range with the settings detailed below.
                * Options available for each range include:
                *		startWidth – Sets the thickness of the left side of the range bar in pixels.
                *		endWidth – Sets the thickness of the right side of the range bar in pixels.
                *		startValue – Sets the value at which to begin drawing the range bar.This value must fall between the max and min values you set for the gauge.
                *		endValue – Sets the value at which to end the range bar.This value must fall between the max and min values you set for the gauge.
                *		startDistance – Sets the distance from the center of the gauge to draw the left side of the range bar.
                *		endDistance – Sets the distance from the center of the gauge to draw the right side of the range bar.
                *		style – Sets the colors to use in drawing the range bar with the following options:
                */
                this.ranges = [];
                /**
                * Determines whether to render the gauge in reverse order, with the numbering going from highest to lowest.
                */
                this.isInverted = false;
                /**
                * Fires before the value changes, this event can be called.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {IGaugeEventArgs} data Information about an event
                */
                this.beforeValueChanged = null;
                /**
                * Fires before the value changes, this event can be called.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {IGaugeEventArgs} data Information about an event
                */
                this.valueChanged = null;
                /**
                * Fires before the canvas is painted. This event can be cancelled. "return false;" to cancel the event.
                * @event
                */
                this.painted = null;
            }
            return wijgauge_options;
        })();        
        wijgauge.prototype.options = $.extend({
        }, wijmo.wijmoWidget.prototype.options, new wijgauge_options());
    })(wijmo.gauge || (wijmo.gauge = {}));
    var gauge = wijmo.gauge;
})(wijmo || (wijmo = {}));
