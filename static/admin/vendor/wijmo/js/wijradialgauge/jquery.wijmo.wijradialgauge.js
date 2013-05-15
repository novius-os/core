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
/// <reference path="../wijgauge/jquery.wijmo.wijgauge.ts"/>
/*globals $, Raphael, jQuery, document, window*/
/*
* Depends:
*  jQuery.1.5.1.js
*  jQuery.ui.core.js
*  jQuery.ui.widget.js
*	raphael.js
*	globalize.min.js
*	jquery.wijmo.raphael.js
*/
var wijmo;
(function (wijmo) {
    var _zeroOffset = 180, interpMinPoints = 9, interJump = 5;
    var WijRadialGauge = (function (_super) {
        __extends(WijRadialGauge, _super);
        function WijRadialGauge() {
            _super.apply(this, arguments);

        }
        WijRadialGauge.prototype._create = function () {
            var self = this;
            _super.prototype._create.call(this);
            self.element.addClass(this.options.wijCSS.radialGauge);
        };
        WijRadialGauge.prototype._set_radius = function () {
            var self = this;
            self._redrawMarksAndLabels();
            self.pointer.wijRemove();
            self._paintPointer();
            self._setPointer();
        };
        WijRadialGauge.prototype._set_startAngle = function () {
            var self = this;
            self._redrawMarksAndLabels();
            self._setPointer();
        };
        WijRadialGauge.prototype._set_sweepAngle = function (value) {
            var self = this;
            if(value > 360) {
                self.options.endAngle = 360;
            }
            self._redrawMarksAndLabels();
            self._setPointer();
        };
        WijRadialGauge.prototype._set_width = function () {
            var self = this;
            self._autoCalculate();
            _super.prototype._set_width.call(this);
        };
        WijRadialGauge.prototype._set_height = function () {
            var self = this;
            self._autoCalculate();
            _super.prototype._set_height.call(this);
        };
        WijRadialGauge.prototype._set_origin = function () {
            var self = this;
            self._autoCalculate();
        };
        WijRadialGauge.prototype._set_cap = function () {
            var self = this;
            self.pointer.wijRemove();
            self._paintPointer();
            self._setPointer();
        };
        WijRadialGauge.prototype._clearState = function () {
            _super.prototype._clearState.call(this);
            this.markBbox = null;
        };
        WijRadialGauge.prototype._valueToAngleIncludeOffset = function (value) {
            return wijmo.GaugeUtil.mod360(this._valueToAngle(value) + _zeroOffset);
        };
        WijRadialGauge.prototype._valueToAngle = function (value) {
            var self = this, alpha = self._valueToLogical(value);
            return self._logicalToAngle(alpha);
        };
        WijRadialGauge.prototype._angleToValue = function (angle) {
            var self = this, alpha = self._angleToLogical(angle);
            return self._logicalToValue(alpha);
        };
        WijRadialGauge.prototype._logicalToAngle = function (alpha) {
            var self = this, o = self.options, startAngle = o.startAngle, sweepAngle = o.sweepAngle, isInverted = o.isInverted;
            if(isInverted) {
                return startAngle * alpha + (startAngle + sweepAngle) * (1 - alpha);
            } else {
                return startAngle * (1 - alpha) + (startAngle + sweepAngle) * alpha;
            }
        };
        WijRadialGauge.prototype._angleToLogical = function (angle) {
            var self = this, o = self.options, startAngle = o.startAngle, isInverted = o.isInverted, relativeAngle = wijmo.GaugeUtil.mod360(angle - startAngle), absSweepAngle = o.sweepAngle, overflow, underflow;
            if(absSweepAngle === 0 || relativeAngle === 0) {
                return isInverted ? 1 : 0;
            }
            if(absSweepAngle < 0) {
                relativeAngle = 360 - relativeAngle;
                absSweepAngle = -absSweepAngle;
            }
            overflow = relativeAngle - absSweepAngle;
            if(overflow > 0) {
                underflow = 360 - relativeAngle;
                return overflow < underflow ? 1 : 0;
            }
            if(isInverted) {
                return 1 - relativeAngle / absSweepAngle;
            } else {
                return relativeAngle / absSweepAngle;
            }
        };
        WijRadialGauge.prototype._generatePoints = function (fromAngle, toAngle, fromLength, toLength) {
            var self = this, isInverted = self.options.isInverted, max = parseInt((interpMinPoints + interpMinPoints * (Math.abs(parseInt((toAngle - fromAngle).toString(), 10)) / (interpMinPoints * interJump))).toString(), 10), points = [], alpha, length, value, angle, i;
            for(i = 0; i < max; i++) {
                alpha = i / (max - 1);
                length = fromLength + (toLength - fromLength) * alpha;
                angle = fromAngle + (toAngle - fromAngle) * alpha;
                value = self._angleToValue(angle);
                points.push(self._valueToPoint(value, length));
            }
            return points;
        };
        WijRadialGauge.prototype._valueToPoint = function (value, offset) {
            var self = this, angle = self._valueToAngleIncludeOffset(value) * Math.PI / 180, radius = offset;
            return {
                x: radius * Math.cos(angle),
                y: radius * Math.sin(angle)
            };
        };
        WijRadialGauge.prototype._pointToValue = function (point) {
            var angle = wijmo.GaugeUtil.mod360(Math.atan2(point.x, -point.y) * 180 / Math.PI);
            return this._angleToValue(angle);
        };
        WijRadialGauge.prototype._radiusScreen = function (offset) {
            var self = this, o = self.options;
            return Math.max(o.radius * offset, 0);
        };
        WijRadialGauge.prototype._autoCalculate = function () {
            var self = this, o = self.options, width = o.width, height = o.height, majorMarkWidth, minorMarkWidth, labelWidth, maxText = wijmo.GaugeUtil.formatString(o.max, o.labels.format), offset = 0, faceBorder, innerHeight = height - o.marginTop - o.marginBottom, innerWidth = //add by DH
            width - o.marginLeft - o.marginRight;
            //add by DH
                        //self.centerPoint = { x: width * o.origin.x, y: height * o.origin.y };
            self.centerPoint = {
                x: o.marginLeft + innerWidth * o.origin.x,
                y: o.marginTop + innerHeight * o.origin.y
            };
            self.radius = o.radius;
            if(o.radius === "auto") {
                //self.faceRadius = Math.min(width, height) / 2;
                self.faceRadius = Math.min(innerWidth, innerHeight) / 2//add by DH
                ;
                faceBorder = self._getFaceBorder();
                self.faceRadius -= faceBorder;
                if(o.tickMajor.position === "inside") {
                    self.faceRadius -= self._getMaxRangeWidth();
                }
                majorMarkWidth = self._getMarkerbbox(o.tickMajor).width;
                minorMarkWidth = self._getMarkerbbox(o.tickMinor).width;
                labelWidth = self._getLabelBBox(maxText).width;
                if(o.tickMajor.position === "center") {
                    offset -= majorMarkWidth / 2;
                    offset -= labelWidth;
                } else if(o.tickMajor.position === "outside") {
                    offset -= majorMarkWidth;
                    offset -= labelWidth;
                }
                if(o.tickMinor.position === "center") {
                    offset = Math.min(offset, -minorMarkWidth / 2);
                } else if(o.tickMinor.position === "outside") {
                    offset = Math.min(offset, -minorMarkWidth);
                }
                self.radius = self.faceRadius + offset;
            }
        };
        WijRadialGauge.prototype._getFaceBorder = function () {
            var self = this, face = self._paintFace(), width = face.attr("stroke-width") || 1;
            if(face.type === "set") {
                width = face[0].attr("stroke-width") || 1;
            }
            face.wijRemove();
            return width;
        };
        WijRadialGauge.prototype._getMaxRangeWidth = function () {
            var self = this, o = self.options, maxWidth = 0;
            $.each(o.ranges, function (i, n) {
                maxWidth = Math.max(maxWidth, n.width || 0);
                maxWidth = Math.max(maxWidth, n.startWidth || 0);
                maxWidth = Math.max(maxWidth, n.endWidth || 0);
            });
            return maxWidth;
        };
        WijRadialGauge.prototype._getMarkerbbox = function (opt) {
            var self = this, mark = self._paintMarkEle(opt), bbox = mark.wijGetBBox();
            mark.wijRemove();
            return {
                width: bbox.width,
                height: bbox.height
            };
        };
        WijRadialGauge.prototype._paintMark = function (value, opt, isMajor) {
            var self = this, mark, position = opt.position || "inside", offset = opt.offset || 0;
            mark = self._paintMarkEle(opt);
            mark.attr(opt.style);
            $.wijraphael.addClass($(mark.node), self.options.wijCSS.radialGaugeMarker);
            $(mark.node).data("value", value);
            self._applyAlignment(mark, position, offset);
            self._setMarkValue(value, mark);
            return mark;
        };
        WijRadialGauge.prototype._applyAlignment = function (ele, alignment, offset) {
            if(!ele) {
                return;
            }
            var Bbox = ele.wijGetBBox(), halfWidth = Bbox.width / 2, left = 0;
            switch(alignment) {
                case "outside":
                    left -= (halfWidth + offset);
                    break;
                case "inside":
                    left += (halfWidth + offset);
                    break;
            }
            //ele.attr("translation", left + "," + 0);
            //ele.attr("transform", "t" + left + "," + 0);
            ele.transform("t" + left + "," + 0);
        };
        WijRadialGauge.prototype._paintMarkEle = function (opt) {
            var self = this, o = self.options, startLocation = {
                x: self.centerPoint.x - self.radius,
                y: self.centerPoint.y
            }, marker = opt.marker || "circle", baseLength = marker === "rect" ? 5 : 2, width = 2, length, strokeWidth = opt.style["stroke-width"] || 0;
            if(marker === "tri" || marker === "invertedTri") {
                baseLength = 5;
                width = 3;
            }
            if(marker === "cross") {
                opt.style.fill = opt.style.stroke || opt.style.fill;
            }
            if(isNaN(startLocation.x)) {
                startLocation.x = 0;
            }
            length = baseLength * opt.factor;
            width += strokeWidth * 2;
            length += strokeWidth * 2;
            if($.isFunction(marker)) {
                return marker.call(self, self.canvas, startLocation, o);
            } else {
                return wijmo.GaugeUtil.paintMarker(self.canvas, marker, startLocation.x, startLocation.y, length, width);
                if(marker === "tri") {
                    return self.canvas.isoTri(startLocation.x, startLocation.y, length, width, wijmo.Compass.west);
                } else if(marker === "invertedTri") {
                    return self.canvas.isoTri(startLocation.x, startLocation.y, length, width, wijmo.Compass.east);
                }
                return wijmo.GaugeUtil.paintMarker(self.canvas, marker, startLocation.x, startLocation.y, length, width, true);
            }
        };
        WijRadialGauge.prototype._setMarkValue = function (value, mark) {
            var self = this, angle = self._valueToAngle(value);
            //mark.rotate(angle, self.centerPoint.x, self.centerPoint.y);
            mark.transform(Raphael.format("r{0},{1},{2}...", angle, self.centerPoint.x, self.centerPoint.y));
        };
        WijRadialGauge.prototype._paintLabel = function (value, labelInfo) {
            var self = this, angle = self._valueToAngle(value), format = labelInfo.format, style = labelInfo.style, offset = labelInfo.offset, text = value.toString(), markOption = self.options.tickMajor, position = markOption.position || "inside", point, textEle, markBbox, newRadius, maxLabelBBox;
            if(format !== "") {
                text = wijmo.GaugeUtil.formatString(value, format);
            }
            markBbox = self._getMarkerBbox();
            maxLabelBBox = self._getLabelBBox(text);
            switch(position) {
                case "inside":
                    newRadius = markBbox.x + markBbox.width + maxLabelBBox.width / 2;
                    break;
                case "outside":
                    newRadius = markBbox.x - maxLabelBBox.width / 2;
                    break;
                default:
                    newRadius = markBbox.x - maxLabelBBox.width / 2;
                    break;
            }
            newRadius = self.centerPoint.x - newRadius + offset;
            point = wijmo.GaugeUtil.getPositionByAngle(self.centerPoint.x, self.centerPoint.y, newRadius, angle);
            textEle = self.canvas.text(point.x, point.y, text);
            textEle.attr(style);
            $.wijraphael.addClass($(textEle.node), self.options.wijCSS.radialGaugeLabel);
            return textEle;
        };
        WijRadialGauge.prototype._getLabelBBox = function (value) {
            var self = this, o = self.options, text, bbox;
            text = self.canvas.text(0, 0, value);
            text.attr(o.gaugeLableStyle);
            bbox = text.wijGetBBox();
            text.wijRemove();
            return bbox;
        };
        WijRadialGauge.prototype._getMarkerBbox = function () {
            var self = this, o = self.options, markOption = o.tickMajor, markEle;
            if(!self.markBbox) {
                markEle = self._paintMarkEle(markOption);
                self._applyAlignment(markEle, markOption.position, markOption.offset || 0);
                self.markBbox = markEle.wijGetBBox();
                markEle.wijRemove();
            }
            return self.markBbox;
        };
        WijRadialGauge.prototype._paintFace = function () {
            var self = this, o = self.options, r = Math.min(o.width, o.height) / 2, face, ui;
            if(self.faceRadius) {
                r = self.faceRadius;
            }
            if(o.face && o.face.template && $.isFunction(o.face.template)) {
                ui = {
                    canvas: self.canvas,
                    r: r,
                    origin: {
                        x: self.centerPoint.x,
                        y: self.centerPoint.y
                    }
                };
                return o.face.template.call(self, ui);
            }
            face = self.canvas.circle(self.centerPoint.x, self.centerPoint.y, r);
            if(o.face && o.face.style) {
                face.attr(o.face.style);
            }
            $.wijraphael.addClass($(face.node), o.wijCSS.radialGaugeFace);
            return face;
        };
        WijRadialGauge.prototype._paintPointer = function () {
            var self = this, o = self.options, pointerInfo = o.pointer, length = self.radius * pointerInfo.length, startLocation = {
                x: self.centerPoint.x - length + pointerInfo.offset * self.radius,
                y: self.centerPoint.y - pointerInfo.width / 2
            }, point;
            if(!pointerInfo.visible) {
                return;
            }
            if(o.cap && o.cap.behindPointer && o.cap.visible) {
                self._paintCap();
            }
            if(pointerInfo.template && $.isFunction(pointerInfo.template)) {
                point = pointerInfo.template.call(self.canvas, startLocation, $.extend({
                }, pointerInfo, {
                    length: length
                }));
            } else {
                if(pointerInfo.shape === "rect") {
                    point = self.canvas.rect(startLocation.x - pointerInfo.width / 2, startLocation.y, length, pointerInfo.width);
                } else {
                    point = self.canvas.isoTri(startLocation.x - pointerInfo.width / 2, startLocation.y, length, pointerInfo.width);
                }
                point.attr(pointerInfo.style);
            }
            self.pointer = point;
            $.wijraphael.addClass($(point.node), o.wijCSS.radialGaugePointer);
            if((!o.cap || !o.cap.behindPointer) && o.cap.visible) {
                self._paintCap();
            }
        };
        WijRadialGauge.prototype._paintCap = function () {
            var self = this, o = self.options, capInfo = o.cap, ui;
            if(capInfo && capInfo.template && $.isFunction(capInfo.template)) {
                ui = {
                    canvas: self.canvas,
                    origin: {
                        x: self.centerPoint.x,
                        y: self.centerPoint.y
                    }
                };
                self.cap = capInfo.template.call(self, ui);
                return self.cap;
            }
            self.cap = self.canvas.circle(self.centerPoint.x, self.centerPoint.y, capInfo.radius);
            if(capInfo && capInfo.style) {
                self.cap.attr(capInfo.style);
            }
            $.wijraphael.addClass($(self.cap.node), o.wijCSS.radialGaugeCap);
            return self.cap;
            //
                    };
        WijRadialGauge.prototype._paintRange = function (range) {
            var self = this, o = self.options, calculateFrom = isNaN(range.startValue) ? 0 : range.startValue, calculateTo = isNaN(range.endValue) ? 0 : range.endValue, calculateStartWidth = isNaN(range.startWidth) ? (isNaN(range.width) ? 0 : range.width) : range.startWidth, calculateEndWidth = isNaN(range.endWidth) ? (isNaN(range.width) ? 0 : range.width) : range.endWidth, startDistance = range.startDistance || 1, endDistance = range.endDistance || 1, coercedFrom, coercedTo;
            if(calculateFrom !== calculateTo) {
                if(calculateTo > calculateFrom) {
                    coercedFrom = Math.max(calculateFrom, o.min);
                    coercedTo = Math.min(o.max, calculateTo);
                } else {
                    coercedFrom = Math.max(o.min, calculateTo);
                    coercedTo = Math.min(o.max, calculateFrom);
                }
                startDistance = startDistance * self.radius;
                endDistance = endDistance * self.radius;
                self._drawRange(coercedFrom, coercedTo, startDistance, endDistance, calculateStartWidth, calculateEndWidth, range);
            }
        };
        WijRadialGauge.prototype._drawRange = function (from, to, startDistance, endDistance, startWidth, endWidth, range) {
            var self = this, startAngle = self._valueToAngle(from), endAngle = self._valueToAngle(to), outerPointers = self._generatePoints(startAngle, endAngle, startWidth + startDistance, endWidth + endDistance), innerPointers = self._generatePoints(startAngle, endAngle, startDistance, endDistance), i, rangeEl, path = "";
            $.each(outerPointers, function (i, n) {
                if(i === 0) {
                    path += "M" + Math.round(n.x + self.centerPoint.x) + " " + Math.round(n.y + self.centerPoint.y);
                } else {
                    path += "L" + (n.x + self.centerPoint.x) + " " + Math.round(n.y + self.centerPoint.y);
                }
            });
            for(i = innerPointers.length - 1; i >= 0; i--) {
                path += "L" + Math.round(innerPointers[i].x + self.centerPoint.x) + " " + Math.round(innerPointers[i].y + self.centerPoint.y);
            }
            path += "Z";
            rangeEl = self.canvas.path(path);
            rangeEl.attr(range.style);
            self.ranges.push(rangeEl);
            $.wijraphael.addClass($(rangeEl.node), self.options.wijCSS.radialGaugeRange);
        };
        WijRadialGauge.prototype._setOffPointerValue = function () {
            var self = this, angle = self._valueToAngle(0);
            //self.pointer.rotate(angle, self.centerPoint.x, self.centerPoint.y);
            self.pointer.transform(Raphael.format("r{0},{1},{2}", angle, self.centerPoint.x, self.centerPoint.y));
        };
        WijRadialGauge.prototype._setPointer = function () {
            var self = this, o = self.options, angle = self._valueToAngle(o.value), animation = o.animation;
            if(!self.pointer) {
                return;
            }
            _super.prototype._setPointer.call(this);
            if(animation.enabled) {
                self.pointer.stop().wijAnimate({
                    transform: "r" + angle + "," + self.centerPoint.x + "," + self.centerPoint.y
                }, animation.duration, animation.easing);
            } else {
                //self.pointer.rotate(angle, self.centerPoint.x, self.centerPoint.y);
                self.pointer.transform(Raphael.format("r{0},{1},{2}", angle, self.centerPoint.x, self.centerPoint.y));
            }
        };
        return WijRadialGauge;
    })(wijmo.WijmoGauge);
    wijmo.WijRadialGauge = WijRadialGauge;    
    WijRadialGauge.prototype.widgetEventPrefix = "wijradialgauge";
    WijRadialGauge.prototype.options = $.extend(true, {
    }, wijmo.WijmoGauge.prototype.options, {
        initSelector: ":jqmData(role='wijradialgauge')",
        wijCSS: {
            radialGauge: "wijmo-wijradialgauge",
            radialGaugeLabel: "wijmo-wijradialgauge-label",
            radialGaugeMarker: "wijmo-wijradialgauge-mark",
            radialGaugeFace: "wijmo-wijradialgauge-face",
            radialGaugePointer: "wijmo-wijradialgauge-pointer",
            radialGaugeCap: "wijmo-wijradialgauge-cap",
            radialGaugeRange: "wijmo-wijradialgauge-range"
        },
        radius: /// <summary>
        /// A value that indicates the radius of the radial gauge in pixels, or use "auto" to have
        /// the gauge indicators fill the gauge area. Values between 50 and 200 are most
        /// useful when you use the default size for the gauge area.
        /// Default: "auto".
        /// Type: Number.
        /// Code example: $("#selector").wijradialgauge("option", "radius", 170).
        /// </summary>
        "auto",
        startAngle: /// <summary>
        /// A value that indicates in degrees where to start the lowest number in
        /// the numeric labels and tickMarks around the face of the RadialGauge.
        ///		The default value of 0 degrees renders the lowest number to the left of the origin.
        ///		A value of -90 degrees renders the lowest number below the origin.
        ///		A value of 90 degrees renders the lowest number above the origin.
        ///		A value of 180 degrees renders the lowest number to the right of the origin.
        /// Default: 0
        /// Type: Number
        /// Code Example:
        /// This code example renders the labels and tickmarks starting below the origin
        ///    $(document).ready(function () {
        ///        $("#radialgauge1").wijradialgauge({
        ///			value: 90,
        ///			startAngle: -90
        ///			});
        ///			});
        /// </summary>
        0,
        sweepAngle: /// <summary>
        /// A value that indicates in degrees where to render the highest number in
        /// the numeric labels and tickMarks in relation to the startAngle.
        /// Default: 180.
        /// Type: Number.
        /// Code example:
        /// This code example renders the labels and tickmarks from a starting angle of
        /// -45 degrees to a sweep angle of 270 degrees, so that the numbers render
        /// three quarters of the way around the face
        ///    $(document).ready(function () {
        ///        $("#radialgauge1").wijradialgauge({
        ///			value: 90,
        ///			startAngle: -45,
        ///			sweepAngle: 270
        ///			});
        ///			});
        /// </summary>
        180,
        pointer: /// <summary>
        /// A value that includes all settings of the gauge pointer.
        /// Default: false.
        /// Type: Boolean.
        /// Code example:
        /// The example above renders the pointer as a purple-outlined blue rectangle
        /// of 125% the length of the radius by 10 pixels wide, offset back through
        /// the cap by 50% of the length of the radius, as pictured below:
        ///    $(document).ready(function () {
        ///        $("#radialgauge1").wijradialgauge({
        ///			value: 90,
        ///			cap: {visible: true},
        ///			pointer: {
        ///			length: 1.25,
        ///			offset: 0.5,
        ///			shape: "rect",
        ///			style: { fill: "blue", stroke: "purple"},
        ///			width: 10
        ///			}
        ///			});
        ///			});
        /// </summary>
        {
            length: /// <summary>
            /// Sets the length of the pointer as a percentage of the radius of the gauge.
            /// You can set the length to be greater than the radius.
            /// Default: 0.8
            /// Type：Number
            /// </summary>
            0.8,
            style: /// <summary>
            /// Sets the fill and outline (stroke) colors of the pointer.
            /// Default: {fill: "#1E395B", stroke: "#1E395B"}
            /// Type：Object
            /// </summary>
            {
                fill: "#1E395B",
                stroke: "#1E395B"
            },
            width: /// <summary>
            /// Sets the width of the pointer in pixels.
            /// Default: 8
            /// Type：Number
            /// </summary>
            8,
            offset: /// <summary>
            /// Sets the percentage of the pointer that is shoved backward through the cap.
            /// Default: 0.8
            /// Type：Number
            /// </summary>
            0.15
        },
        origin: /// <summary>
        /// Sets the starting point for the center of the radial gauge.
        /// Default: { x: 0.5, y: 0.5 }.
        /// Type: Object
        /// Code example: $("#selector").wijradialgauge("option",
        /// "origin", { x: 0.5, y: 0.6 }).
        /// </summary>
        {
            x: 0.5,
            y: 0.5
        },
        labels: /// <summary>
        /// The labels option, inherited from the jquery.wijmo.wijgauge.js base class,
        /// sets all of the appearance options of the numeric labels that appear
        /// around the edge of the gauge.
        /// Default: {format: "", style: {fill: "#1E395B", "font-size": "12pt",
        /// "font-weight": "800"}, visible: true, offset: 30}.
        /// Type: Object.
        /// Code Example:
        /// This example sets the color for the labels to purple, and the font to
        /// 14 point, bold, Times New Roman.
        ///    $(document).ready(function () {
        ///        $("#radialgauge1").wijradialgauge({
        ///			value: 90,
        ///			labels: {
        ///			style: {
        ///			fill: "purple",
        ///                    "font-size": "14pt",
        ///                    "font-weight": "bold",
        ///                    "font-family": "Times New Roman"
        ///			}
        ///			}
        ///			});
        ///			});
        /// </summary>
        {
            style: /// <summary>
            /// A value that indicates the color, weight, and size of the numeric labels.
            /// To use a different font, add "font-family" to the style
            /// Default: {fill: "#1E395B", "font-size": 12, "font-weight": "800"}.
            /// Type: Object.
            /// </summary>
            {
                fill: "#1E395B",
                "font-size": 12,
                "font-weight": "800"
            },
            offset: /// <summary>
            /// A value in pixels that indicates the distance of the numeric labels
            /// from the outer reach of the pointer.
            /// Type: Number.
            /// Default: 30.
            /// </summary>
            30
        },
        tickMinor: /// <summary>
        /// Sets appearance options for the minor tick marks that appear between
        /// the numeric labels around the face of the gauge, indicating numeric
        /// values between the major tick marks.
        /// Default: {position: "inside", style: { fill: "#1E395B", stroke:"none"
        /// }, factor: 1, visible: true, marker: "rect", offset: 30, interval: 5}
        /// Type: Object.
        /// Code example:
        /// This example renders the minor tick marks as purple crosses, at an
        /// interval of once every 2 numbers
        ///    $(document).ready(function () {
        ///        $("#radialgauge1").wijradialgauge({
        ///			value: 90,
        ///			tickMinor: {
        ///			position: "inside",
        ///			style: { fill: "#1E395B", stroke: "purple"},
        ///			factor: 2,
        ///			marker: 'cross',
        ///			visible: true,
        ///			offset: 30,
        ///			interval: 2
        ///			}
        ///			});
        ///			});
        /// </summary>
        {
            position: /// <summary>
            /// A value that indicates the position of the minor tick marks in relation to
            /// the edge of the face.
            /// Valid Values:
            ///		"inside" -- Draws the minor tick marks inside the edge of the face.
            ///		"outside" -- Draws the minor tick marks outside the edge of the face.
            ///		"cross" -- Draws the minor tick marks centered on the edge of the face.
            /// Default: "inside".
            /// Type: "String"
            /// </summary>
            "inside",
            offset: /// <summary>
            /// A value that indicates the distance in pixels from the edge of the face
            /// to draw the minor tick marks. By default, they are three pixels in from
            /// the major tick
            /// Default: 30.
            /// Type: Number.
            /// </summary>
            30,
            style: /// <summary>
            /// A value that indicates the fill color and outline (stroke) of the minor tick mark.
            /// Default: {fill: "#1E395B"}.
            /// Type: Object.
            /// </summary>
            {
                fill: "#1E395B"
            },
            visible: /// <summary>
            /// A value that indicates whether to show the minor tick mark.
            /// Default: true.
            /// Type: Boolean.
            /// </summary>
            true
        },
        tickMajor: /// <summary>
        /// Sets appearance options for the major tick marks that appear next to the
        /// numeric labels around the face of the gauge.
        /// Default: {position: "inside", style: { fill: "#1E395B",
        /// stroke: "#1E395B", "stroke-width": "1"
        /// }, factor: 2, visible: true, marker: "rect", offset: 27, interval: 10}.
        /// Type: Object.
        /// code example:
        /// This example renders the major tick marks as slightly larger purple filled
        /// diamonds with blue outlines, at an interval of once every 20 numbers
        //    $(document).ready(function () {
        //        $("#radialgauge1").wijradialgauge({
        //			value: 90,
        //			tickMajor: {
        //			position: "inside",
        //			style: { fill: "purple", stroke: "#1E395B"},
        //			factor: 2.5,
        //			marker: 'diamond',
        //			visible: true,
        //			offset: 27,
        //			interval: 20
        //			}
        //			});
        //			});
        /// </summary>
        {
            position: /// <summary>
            /// A value that indicates the position of the major tick marks in relation
            /// to the edge of the face.
            /// Valid Values:
            ///		"inside" -- Draws the major tick marks inside the edge of the face.
            ///		"outside" -- Draws the major tick marks outside the edge of the face.
            ///		"cross" -- Draws the major tick marks centered on the edge of the face.
            /// Default: "inside".
            /// Type: "String"
            /// remarks: Options are 'inside', 'outside' and 'cross'.
            /// </summary>
            "inside",
            offset: /// <summary>
            /// A value that indicates the distance in pixels from the edge of the face
            /// to draw the major tick marks. The numeric labels are drawn a few pixels
            /// outside of the major tick marks.
            /// Default: 27.
            /// Type: Number.
            /// </summary>
            27,
            style: /// <summary>
            /// A value that indicates the fill color and outline (stroke) of the major
            /// tick mark.
            /// Default: {fill: "#1E395B", stroke: "#1E395B", "stroke-width": 1}.
            /// Type: Object.
            /// </summary>
            {
                fill: "#1E395B",
                stroke: "#1E395B",
                "stroke-width": 1
            },
            visible: /// <summary>
            /// A value that indicates whether to show the major tick mark.
            /// Type: Boolean.
            /// Default: true.
            /// </summary>
            true
        },
        cap: /// <summary>
        /// Sets the size, color, and other properties of the circle at the center
        /// of the gauge that anchors the pointer.
        /// Default: { radius: 15, style: {fill: "#1E395B", stroke: "#1E395B"},
        /// behindPointer: false, visible: true, template: null }.
        /// Type: Object.
        /// Code example:
        /// $(document).ready(function () {
        ///$("#radialgauge1").wijradialgauge({
        ///   	cap: {
        ///   	radius: 25,
        ///   	style: {fill: "purple", stroke: "blue"},
        ///   	behindPointer: true
        ///   	}
        ///   	});
        ///   	});
        /// </summary>
        {
            radius: /// <summary>
            /// A value that indicates the radius of the cap in pixels.
            /// Default: 15
            /// Type: Number
            /// </summary>
            15,
            style: /// <summary>
            /// A value that contains the fill color and outline color (stroke) of the cap.
            /// Default: {fill: "#1E395B", stroke: "#1E395B"}.
            /// Type: Object.
            /// </summary>
            {
                fill: "#1E395B",
                stroke: "#1E395B"
            },
            behindPointer: /// <summary>
            /// A value that indicates whether the cap shows behind the pointer or
            /// in front.
            /// Default: false.
            /// Type: Boolean.
            /// </summary>
            false,
            visible: /// <summary>
            /// A value that indicates whether to show the cap.
            /// Default: true.
            /// Type: Boolean.
            /// </summary>
            true,
            template: /// <summary>
            /// A JavaScript callback value that returns a Raphael element (or set)
            /// that draws the cap for the pointer. If you are only using one shape,
            /// the function returns a Raphael element. If you define multiple shapes,
            /// have the function create a Raphael set object, push all of the Raphael
            /// elements to the set, and return the set to wijradialgauge.
            /// In order to use the template, you must know how to draw Raphael graphics.
            /// For more information, see the Raphael documentation.
            /// Use this option to customize the cap.
            /// The cap template's callback contains one argument with two properties:
            ///		origin -- The starting point from which to draw the center of the cap.
            ///			This argument is defined by x and y coordinates.
            ///		canvas -- A Raphael paper object that you can use to draw the custom
            ///			graphic to use as the cap.
            /// Default: null.
            /// Type: Function
            /// Code example:
            /// This example creates a rectangular cap that begins 10 pixels to the left
            /// of and 10 pixels above the origin, and is 20 pixels wide by 20 pixels
            /// tall. The cap is filled with purple and has no outline (stroke).
            ///		$(document).ready(function () {
            ///			$("#radialgauge1").wijradialgauge({
            ///				value: 180,
            ///				max: 200,
            ///				min: 0,
            ///				cap: {
            ///					template: function (ui) {
            ///						var origin = ui.origin;
            ///						return ui.canvas.rect(origin.x -10, origin.y -10, 20, 20).attr({fill: "purple", stroke: "none"});
            ///					}
            ///				}
            ///			});
            ///		});
            /// </summary>
            null
        },
        face: /// <summary>
        /// Sets or draws the image or shape to use for the face of the gauge and the
        /// background area. The origin is the center of the gauge, but the image
        /// draws from the top left, so we first calculate the starting point of the
        /// top left based on the origin, and we calculate the width and height based
        /// on the radius of the face. The radius of the face is half of the min of
        /// the width and height.
        /// Note: The fill property is defined using the Raphael framework. Please
        /// see the Raphael Element attr method for more information. The face can be
        /// filled with a simple color, or a gradient. The default fill is a radial
        /// gradient, indicated by the r in the fill property.
        /// Default: {fill: ""r(0.9, 0.60)#FFFFFF-#D9E3F0"", stroke: "#7BA0CC",
        /// "stroke-width": "4"}, template: null}.
        /// Type: Object.
        /// Code example:
        /// This example uses a custom image for the face of the gauge. The argument
        /// that we name ui in the example is a JSON object. This object has a canvas,
        /// which is a Raphael paper object, and we use the image method of the
        /// Raphael paper that takes five parameters: source, x, y, width, and height.
        /// See the Raphael documentation for more information.
        ///    $(document).ready(function () {
        ///        $("#radialgauge1").wijradialgauge({
        ///			value: 90,
        ///			radius: 120,
        ///			face: {
        ///			style: {},
        ///			template: function (ui) {
        ///                    var url = "images/customGaugeFace.png";
        ///                    return ui.canvas.image(url, ui.origin.x -ui.r, ui.origin.y -ui.r, ui.r * 2, ui.r * 2);
        ///			}
        ///			}
        ///			});
        ///			});
        /// </summary>
        {
            style: /// <summary>
            /// A value that indicates the fill color (or gradient), and the outline color
            /// and width of the gauge face
            /// Default: {fill: ""r(0.9, 0.60)#FFFFFF-#D9E3F0"",
            /// stroke: "#7BA0CC", "stroke-width": 4}.
            /// Type: Object.
            /// </summary>
            {
                fill: "r(0.9, 0.60)#FFFFFF-#D9E3F0",
                stroke: "#7BA0CC",
                "stroke-width": 4
            }
        }
    });
    //$.widget("wijmo.wijradialgauge", WijRadialGauge.prototype);
    $.wijmo.registerWidget("wijradialgauge", WijRadialGauge.prototype);
})(wijmo || (wijmo = {}));
