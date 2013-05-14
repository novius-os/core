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
*  jQuery.wijmo.rahpael.js
*  jquery.wijmo.wijgauge.js
*/
var wijmo;
(function (wijmo) {
    var WijlinearGauge = (function (_super) {
        __extends(WijlinearGauge, _super);
        function WijlinearGauge() {
            _super.apply(this, arguments);

        }
        WijlinearGauge.prototype._setDefaultWidth = function () {
            var o = this.options;
            o.width = o.orientation === "horizontal" ? 310 : 70;
        };
        WijlinearGauge.prototype._setDefaultHeight = function () {
            var o = this.options;
            o.height = o.orientation === "horizontal" ? 70 : 310;
        };
        WijlinearGauge.prototype._set_orientation = function () {
            var self = this;
            self._setDefaultWidth();
            self._setDefaultHeight();
            self.markBbox = null;
            self.redraw();
        };
        WijlinearGauge.prototype._set_xAxisLocation = function () {
            this.redraw();
        };
        WijlinearGauge.prototype._set_xAxisLength = function () {
            this.redraw();
        };
        WijlinearGauge.prototype._set_yAxisLocation = function () {
            this.redraw();
        };
        WijlinearGauge.prototype._clearState = function () {
            _super.prototype._clearState.call(this);
            if(this.markBbox) {
                this.markBbox = null;
            }
        };
        WijlinearGauge.prototype._create = function () {
            _super.prototype._create.call(this);
            this.element.addClass(this.options.wijCSS.linearGauge);
        };
        WijlinearGauge.prototype._paintLabel = function (value, labelInfo) {
            var self = this, o = self.options, format = labelInfo.format, style = labelInfo.style, offset = labelInfo.offset, text = value, markOption = self.options.tickMajor, position = markOption.position || "inside", point, textEle, markBbox, labelBBox;
            if(format !== "") {
                text = wijmo.GaugeUtil.formatString(value, format);
            }
            markBbox = self._getMarkerBbox();
            labelBBox = self._getLabelBBox(text);
            point = self._valueToPoint(value, 0);
            if(o.orientation === "horizontal") {
                if(position === "inside") {
                    point.y = markBbox.y - labelBBox.height;
                } else {
                    point.y = markBbox.y + markBbox.height + labelBBox.height / 2;
                }
                point.y += offset;
            } else {
                if(position === "inside") {
                    point.x = markBbox.x - labelBBox.width / 2;
                } else {
                    point.x = markBbox.x + markBbox.width + labelBBox.width / 2;
                }
                point.x += offset;
            }
            textEle = self.canvas.text(point.x, point.y, text);
            textEle.attr(style);
            $.wijraphael.addClass($(textEle.node), o.wijCSS.linearGaugeLabel);
            return textEle;
        };
        WijlinearGauge.prototype._getLabelBBox = function (value) {
            var self = this, o = self.options, text, bbox;
            text = self.canvas.text(0, 0, value);
            text.attr(o.gaugeLableStyle);
            bbox = text.wijGetBBox();
            text.remove();
            return bbox;
        };
        WijlinearGauge.prototype._getMarkerBbox = function () {
            var self = this, o = self.options, markOption = o.tickMajor, markEle;
            if(!self.markBbox) {
                markEle = self._paintMark(0, markOption);
                self.markBbox = markEle.wijGetBBox();
                markEle.remove();
            }
            return self.markBbox;
        };
        WijlinearGauge.prototype._paintMark = function (value, opt, isMajor) {
            var self = this, o = self.options, marker = opt.marker || "rect", baseLength = marker === "rect" ? 5 : 2, point = self._valueToPoint(value, 0), position = opt.position || "inside", offset = opt.offset || 0, width = isMajor ? 2 : 1, length, markEle, style = $.extend({
            }, opt.style);
            length = baseLength * opt.factor;
            if($.isFunction(marker)) {
                return marker.call(self, self.canvas, point, o);
            } else {
                if(marker === "cross") {
                    style.stroke = style.fill;
                }
                if(o.orientation === "horizontal") {
                    markEle = wijmo.GaugeUtil.paintMarker(self.canvas, marker, point.x, point.y, width, length, true);
                } else {
                    markEle = wijmo.GaugeUtil.paintMarker(self.canvas, marker, point.x, point.y, length, width);
                }
            }
            markEle.attr(style);
            $.wijraphael.addClass($(markEle.node), o.wijCSS.linearGaugeMarker);
            self._applyPosition(markEle, position, offset, value);
            return markEle;
        };
        WijlinearGauge.prototype._applyPosition = function (ele, position, offset, value) {
            var left = 0, top = 0, self = this, isHorizontal = self.options.orientation === "horizontal", bbox = ele.wijGetBBox();
            switch(position) {
                case "inside":
                    if(isHorizontal) {
                        top -= bbox.width / 2 + offset;
                    } else {
                        left -= bbox.width / 2 + offset;
                    }
                    break;
                case "outside":
                    if(isHorizontal) {
                        top += bbox.width / 2 + offset;
                    } else {
                        left += bbox.width / 2 + offset;
                    }
                    break;
                case "center":
                    if(isHorizontal) {
                        top -= offset;
                    } else {
                        left -= offset;
                    }
                    break;
                default:
                    break;
            }
            ele.attr("transform", "t" + left + "," + top);
        };
        WijlinearGauge.prototype._paintFace = function () {
            var self = this, face, o = self.options, width = self._innerBbox.width, height = self._innerBbox.height, left = self._innerBbox.left, top = self._innerBbox.top, ui = {
                width: width,
                height: height,
                x: left,
                y: top,
                canvas: self.canvas
            };
            if(o.face && o.face.template && $.isFunction(o.face.template)) {
                return o.face.template.call(self, ui);
            }
            face = self.canvas.rect(left, top, width, height, 5);
            if(o.face && o.face.style) {
                face.attr(o.face.style);
            }
            $.wijraphael.addClass($(face.node), o.wijCSS.linearGaugeFace);
            return face;
        };
        WijlinearGauge.prototype._paintPointer = function () {
            var self = this, o = self.options, point = self._valueToPoint(o.min, 0), width = self._innerBbox.width, height = self._innerBbox.height, left = self._innerBbox.left, top = self._innerBbox.top, pointerInfo = o.pointer, pointer, length, offset, base;
            if(!pointerInfo.visible) {
                return;
            }
            base = o.orientation === "horizontal" ? height : width;
            offset = base * pointerInfo.offset;
            length = base * pointerInfo.length;
            if(pointerInfo.template && $.isFunction(pointerInfo.template)) {
                pointer = pointerInfo.template.call(self.canvas, point, $.extend({
                }, o.pointer, {
                    offset: offset,
                    length: length,
                    gaugeBBox: self._innerBbox
                }));
            } else {
                if(o.orientation === "horizontal") {
                    if(pointerInfo.shape === "rect") {
                        pointer = self.canvas.rect(point.x - pointerInfo.width / 2, height - length - offset + top, pointerInfo.width, length);
                    } else {
                        pointer = self.canvas.isoTri(point.x, height - length - offset + top, pointerInfo.width, length, wijmo.Compass.north);
                    }
                } else {
                    if(pointerInfo.shape === "rect") {
                        pointer = self.canvas.rect(width - length - offset + left, point.y - pointerInfo.width / 2, length, pointerInfo.width);
                    } else {
                        pointer = self.canvas.isoTri(width - length - offset + left, point.y - pointerInfo.width / 2, length, pointerInfo.width);
                    }
                }
                pointer.attr(pointerInfo.style);
            }
            $.wijraphael.addClass($(pointer.node), o.wijCSS.linearGaugePointer);
            self.pointer = pointer;
        };
        WijlinearGauge.prototype._setPointer = function () {
            var self = this, o = self.options;
            //				orientation = o.orientation,
            //				fromValue = orientation === "horizontal" ?
            //					self._minScreenPoint(0).x : self._minScreenPoint(0).y,
            //				endValue = orientation === "horizontal" ?
            //					self._maxScreenPoint(0).x : self._maxScreenPoint(0).y;
            if(!self.pointer) {
                return;
            }
            _super.prototype._setPointer.call(this);
            self._setLinearPointer(o.value);
        };
        WijlinearGauge.prototype._setLinearPointer = function (value) {
            var self = this, o = self.options, startPoint = self._valueToPoint(o.min, 0), endPoint = self._valueToPoint(value, 0), animation = //				fromBbox = self.pointer.wijGetBBox(),
            o.animation, translation = {
                x: 0,
                y: 0
            };
            // if use the transform("..."), the memeroy may leak.
            // Using the absolute path instead of it.
            if(o.orientation === "horizontal") {
                //translation.x = endPoint.x - fromBbox.x - fromBbox.width / 2;
                translation.x = endPoint.x - startPoint.x;
            } else {
                //translation.y = endPoint.y - fromBbox.y - fromBbox.height / 2;
                translation.y = endPoint.y - startPoint.y;
            }
            if(animation.enabled) {
                self.pointer.stop().wijAnimate({
                    transform: "t" + translation.x + "," + translation.y
                }, animation.duration, animation.easing);
            } else {
                self.pointer.attr("transform", "t" + translation.x + "," + translation.y);
            }
        };
        WijlinearGauge.prototype._minScreenPoint = function (yOffset) {
            var self = this, o = self.options, width = self._innerBbox.width, height = self._innerBbox.height, left = self._innerBbox.left, top = self._innerBbox.top, totalOffset = o.yAxisLocation + yOffset;
            if(o.orientation === "horizontal") {
                return {
                    x: width * o.xAxisLocation + left,
                    y: height * totalOffset + top
                };
            } else {
                return {
                    x: width * totalOffset + left,
                    y: height * (1 - o.xAxisLocation) + top
                };
            }
        };
        WijlinearGauge.prototype._maxScreenPoint = function (yOffset) {
            var self = this, o = self.options, width = self._innerBbox.width, height = self._innerBbox.height, left = self._innerBbox.left, top = self._innerBbox.top, totalOffset = o.yAxisLocation + yOffset, end = o.xAxisLocation + o.xAxisLength;
            if(o.orientation === "horizontal") {
                return {
                    x: width * end + left,
                    y: height * totalOffset + top
                };
            } else {
                return {
                    x: width * totalOffset + left,
                    y: height * (1 - end) + top
                };
            }
        };
        WijlinearGauge.prototype._paintRange = function (range) {
            var self = this, o = self.options, calculateFrom = isNaN(range.startValue) ? 0 : range.startValue, calculateTo = isNaN(range.endValue) ? 0 : range.endValue, calculateStartWidth = isNaN(range.startWidth) ? (isNaN(range.width) ? 0 : range.width) : range.startWidth, calculateEndWidth = isNaN(range.endWidth) ? (isNaN(range.width) ? 0 : range.width) : range.endWidth, startDistance = range.startDistance || 0, endDistance = range.endDistance || 0, coercedFrom, coercedTo;
            if(calculateFrom !== calculateTo) {
                if(calculateTo > calculateFrom) {
                    coercedFrom = Math.max(calculateFrom, o.min);
                    coercedTo = Math.min(o.max, calculateTo);
                } else {
                    coercedFrom = Math.max(o.min, calculateTo);
                    coercedTo = Math.min(o.max, calculateFrom);
                }
                self._drawRange(coercedFrom, coercedTo, startDistance, endDistance, calculateStartWidth, calculateEndWidth, range);
            }
        };
        WijlinearGauge.prototype._drawRange = function (coercedFrom, coercedTo, startDistance, endDistance, calculateStartWidth, calculateEndWidth, range) {
            var self = this, o = self.options, orientation = o.orientation, width = self._innerBbox.width, height = self._innerBbox.height, left = self._innerBbox.left, top = self._innerBbox.top, p1 = self._valueToPoint(coercedFrom, 0), p2 = self._valueToPoint(coercedTo, 0), p3, p4, arrPath, rangeEl, startWidth, endWidth;
            if(orientation === "horizontal") {
                startWidth = calculateStartWidth * height;
                endWidth = calculateEndWidth * height;
                if(startDistance !== 0) {
                    p1.y = startDistance * height + top;
                }
                if(endDistance !== 0) {
                    p2.y = endDistance * height + top;
                }
                p3 = {
                    x: p1.x,
                    y: p1.y - startWidth
                };
                p4 = {
                    x: p2.x,
                    y: p2.y - endWidth
                };
            } else {
                startWidth = calculateStartWidth * width;
                endWidth = calculateEndWidth * width;
                if(startDistance !== 0) {
                    p1.x = startDistance * width + left;
                }
                if(endDistance !== 0) {
                    p2.x = endDistance * width + left;
                }
                p3 = {
                    x: p1.x - startWidth,
                    y: p1.y
                };
                p4 = {
                    x: p2.x - endWidth,
                    y: p2.y
                };
            }
            arrPath = [
                "M", 
                p1.x, 
                p1.y, 
                "L", 
                p2.x, 
                p2.y, 
                "L", 
                p4.x, 
                p4.y, 
                "L", 
                p3.x, 
                p3.y, 
                "Z"
            ];
            rangeEl = self.canvas.path(arrPath.concat(" "));
            rangeEl.attr(range.style);
            $.wijraphael.addClass($(rangeEl.node), o.wijCSS.linearGaugeRange);
            self.ranges.push(rangeEl);
        };
        WijlinearGauge.prototype._valueToPoint = function (value, offset) {
            var self = this, o = self.options, isInverted = o.isInverted, alpha, minPoint, maxPoint;
            if(o.max === o.min) {
                return {
                    x: 0,
                    y: 0
                };
            }
            alpha = self._valueToLogical(value);
            minPoint = self._minScreenPoint(offset);
            maxPoint = self._maxScreenPoint(offset);
            if(isInverted) {
                return {
                    x: minPoint.x * alpha + maxPoint.x * (1 - alpha),
                    y: minPoint.y * alpha + maxPoint.y * (1 - alpha)
                };
            } else {
                return {
                    x: minPoint.x * (1 - alpha) + maxPoint.x * alpha,
                    y: minPoint.y * (1 - alpha) + maxPoint.y * alpha
                };
            }
        };
        return WijlinearGauge;
    })(wijmo.WijmoGauge);
    wijmo.WijlinearGauge = WijlinearGauge;    
    WijlinearGauge.prototype.widgetEventPrefix = "wijlineargauge";
    WijlinearGauge.prototype.options = $.extend(true, {
    }, wijmo.WijmoGauge.prototype.options, {
        initSelector: ":jqmData(role='wijlineargauge')",
        wijCSS: {
            linearGauge: "wijmo-wijlineargauge",
            linearGaugeLabel: "wijmo-wijlineargauge-label",
            linearGaugeMarker: "wijmo-wijlineargauge-mark",
            linearGaugeFace: "wijmo-wijlineargauge-face",
            linearGaugePointer: "wijmo-wijlineargauge-pointer",
            linearGaugeRange: "wijmo-wijlineargauge-range"
        },
        orientation: /// <summary>
        /// Sets the orientation of the gauge, with a setting of horizontal showing values across
        /// the gauge from left to right, and a setting of vertical showing values along the
        /// gauge from top to bottom.
        /// Default: "horizontal".
        /// Type: String.
        /// Code example:
        /// This sample shows how to create vertical linear gauge.
        ///    $(document).ready(function () {
        ///        $("#lineargauge1").wijlineargauge({
        ///			value: 31,
        ///			orientation: "vertical"
        ///			});
        ///			});
        /// </summary>
        "horizontal",
        xAxisLocation: /// <summary>
        /// Sets the starting location of the X axis as a percentage of the width of the
        /// gauge.
        /// Note: By default, the xAxisLength option is set to draw the X axis 80% of the
        /// width the gauge, so if you want to center the axis within the gauge, you must
        /// also adjust that option.
        /// Default: 0.1
        /// Type: Number
        /// Code example:
        ///    $(document).ready(function () {
        ///        $("#lineargauge1").wijlineargauge({
        ///			value: 31,
        ///			xAxisLength: .9,
        ///			xAxisLocation: 0.05
        ///			});
        ///			});
        /// </summary>
        0.1,
        xAxisLength: /// <summary>
        /// Sets the length of the X axis as a percentage of the width of the gauge.
        /// Note: By default, the xAxisLocation option is set to begin the X axis 10% of
        /// the way across from the left edge of the gauge, so if you want to use a higher
        /// ratio for the xAxisLength, you must also adjust that option.
        /// Default: 0.8
        /// Type: Number
        /// Code example:
        ///    $(document).ready(function () {
        ///        $("#lineargauge1").wijlineargauge({
        ///			value: 31,
        ///			xAxisLength: .9,
        ///			xAxisLocation: 0.05
        ///			});
        ///			});
        /// </summary>
        0.8,
        yAxisLocation: /// <summary>
        /// Sets the base vertical location of the pointer, tick marks and labels on the
        /// X axis as a percentage of the height of the gauge. (Note that there is no
        /// actual Y axis in the LinearGauge.) By default, it is centered in the gauge.
        /// A setting of 0.8 moves the pointer, tick marks, and labels toward the bottom
        /// edge of the gauge, as in the image below.
        /// Default: 0.5
        /// Type: Number.
        /// Code example:
        ///    $(document).ready(function () {
        ///        $("#lineargauge1").wijlineargauge({
        ///			value: 31,
        ///			yAxisLocation: 0.8
        ///			});
        ///			});
        /// </summary>
        0.5,
        width: /// <summary>
        /// The width option, inherited from the jquery.wijmo.wijgauge.js base class,
        /// sets the width of the gauge area in pixels.
        /// Default: "auto".
        /// Type: Number.
        /// Code example:
        ///    $(document).ready(function () {
        ///        $("#lineargauge1").wijlineargauge({
        ///			value: 31,
        ///			width: 500
        ///			});
        ///			});
        /// </summary>
        "auto",
        height: /// <summary>
        /// The height option, inherited from the jquery.wijmo.wijgauge.js base class, sets
        /// the height of the gauge area in pixels.
        /// Default: "auto".
        /// Type: Number.
        /// Code example:
        ///    $(document).ready(function () {
        ///        $("#lineargauge1").wijlineargauge({
        ///			value: 31,
        ///			height: 200
        ///			});
        ///			});
        /// </summary>
        "auto",
        pointer: /// <summary>
        /// The pointer option, inherited from the jquery.wijmo.wijgauge.js base class,
        /// creates an object that includes all settings of the gauge pointer.
        /// Default: {length: 0.5, style: { fill: "#1E395B", stroke: "#1E395B"},
        /// width: 4, offset: 0, shape: "tri", visible: true, template: null}.
        /// Type: Object
        /// Code example:
        /// This code yields a gauge with a pointer
        ///    $(document).ready(function () {
        ///        $("#lineargauge1").wijlineargauge({
        ///			value: 31,
        ///			pointer: {
        ///			length: .2,
        ///			offset: .2,
        ///			shape: "tri",
        ///			style: { fill: "red", stroke: "black"},
        ///			width: 10
        ///			}
        ///			});
        ///			});
        /// </summary>
        {
            length: /// <summary>
            /// Sets the length of the pointer as a percentage of the height of the gauge
            /// (or the width, if the orientation is set to vertical). You can set the
            /// length to be greater than the height (or width).
            /// Default: 0.5.
            /// Type：Number.
            /// </summary>
            0.5,
            width: /// <summary>
            /// Sets the width of the pointer in pixels.
            /// Default: 4.
            /// Type: Number.
            /// </summary>
            4,
            offset: /// <summary>
            /// Sets the percentage of the height of the gauge to move the pointer
            /// upward (or of the width if the orientation is vertical) from the
            /// bottom (or right) edge of the gauge.
            /// Default: 0.
            /// Type: Number.
            /// </summary>
            0,
            visible: /// <summary>
            /// A value that indicates whether to show the pointer.
            /// Default: true.
            /// Type: Boolean.
            /// </summary>
            true,
            template: /// <summary>
            /// A JavaScript callback value that returns a Raphael element that draws the
            /// pointer. Use this option to customize the pointer.
            /// In order to use the template, you must know how to draw Raphael graphics.
            /// For more information, see the Raphael documentation.
            /// The pointer template's callback contains two arguments:
            ///		startLocation -- The starting point from which to draw the pointer.
            ///			This argument is defined by x and y coordinates.
            ///		pointerInfo -- A JSON object that extends the gauge's pointer options:
            ///			offset -- Sets the percentage of the pointer that is shoved upward
            ///				from the bottom edge.
            ///			length -- Sets the absolute value in pixels of the length of the pointer.
            ///			gaugeBBox -- An object that sets the bounding box of the gauge,
            /// as defined by x and y coordinates and width and height options.
            /// Default: null.
            /// Type: Funtion.
            /// </summary>
            null
        },
        marginLeft: /// <summary>
        /// The marginLeft option, inherited from the jquery.wijmo.wijgauge.js base class,
        /// is a value in pixels that indicates where to render the left edge of the
        /// gauge face. In order to change the margin settings without compressing the
        /// gauge markers, it may help to also change the width option.
        /// Default: 5.
        /// Type: Number.
        /// Code example:
        ///    $(document).ready(function () {
        ///        $("#lineargauge1").wijlineargauge({
        ///			value: 31,
        ///			marginLeft: 100
        ///			});
        ///			});
        /// </summary>
        5,
        marginTop: /// <summary>
        /// The marginTop option, inherited from the jquery.wijmo.wijgauge.js base class,
        /// is a value in pixels that indicates where to render the top edge of the gauge
        /// face. In order to change the margin settings by more than a few pixels without
        /// clipping the gauge face edges, it may help to also change the height property.
        /// Default: 5.
        /// Type: Number.
        /// Code example:
        ///    $(document).ready(function () {
        ///        $("#lineargauge1").wijlineargauge({
        ///			value: 31,
        ///			marginTop: 20
        ///			});
        ///			});
        /// </summary>
        5,
        marginRight: /// <summary>
        /// The marginRight option, inherited from the jquery.wijmo.wijgauge.js base class,
        /// is a value in pixels that indicates where to render the right edge of the gauge
        /// face. In order to change the margin settings without compressing the gauge
        /// markers, it may help to also change the width option.
        /// Default: 5.
        /// Type: Number.
        /// Code example:
        ///    $(document).ready(function () {
        ///        $("#lineargauge1").wijlineargauge({
        ///			value: 31,
        ///			marginRight: 100
        ///			});
        ///			});
        /// </summary>
        5,
        marginBottom: /// <summary>
        /// The marginBottom option, inherited from the jquery.wijmo.wijgauge.js base class,
        /// is a value in pixels that indicates where to render the bottom edge of the
        /// gauge face. In order to change the margin settings by more than a few pixels
        /// without clipping the gauge face edges, it may help to also change the height
        /// property.
        /// Default: 5.
        /// Type: Number.
        /// Code example:
        ///    $(document).ready(function () {
        ///        $("#lineargauge1").wijlineargauge({
        ///			value: 31,
        ///			marginBottom: 20
        ///			});
        ///			});
        /// </summary>
        5
    });
    //$.widget("wijmo.wijlineargauge", WijlinearGauge.prototype);
    $.wijmo.registerWidget("wijlineargauge", WijlinearGauge.prototype);
})(wijmo || (wijmo = {}));
