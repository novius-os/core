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
/// <reference path="../wijchart/jquery.wijmo.wijchartcore.ts"/>
/// <reference path="../external/declarations/globalize.d.ts"/>
/*globals jQuery, Globalize*/
/*
* Depends:
*  raphael.js
*  globalize.js
*  jquery.ui.widget.js
*  jquery.wijmo.wijchartcore.js
*
*/
var wijmo;
(function (wijmo) {
    var maxSize = 10000, bubMax = 0, bubMin = 0, bubDiff = 0;
    var WijBubbleChart = (function (_super) {
        __extends(WijBubbleChart, _super);
        function WijBubbleChart() {
            _super.apply(this, arguments);

        }
        WijBubbleChart.prototype._setOption = function (key, value) {
            var self = this, o = self.options;
            //self.bubbles = [];
            //self.bubbleInfos = [];
            if(key === "minimumSize" || key === "minimumSize") {
                if(isNaN(value) || value < 0) {
                    value = 0;
                } else if(value > maxSize) {
                    value = maxSize;
                }
                o[key] = value;
                self.redraw();
            } else if(key === "chartLabel") {
                $.extend(o.chartLabel, value);
                self.redraw();
            } else {
                if(key === "showChartLabels" || key === "chartLabelStyle") {
                    o[key] = value;
                    self._setLabelOption();
                }
                _super.prototype._setOption.call(this, key, value);
            }
            if(key === "seriesList") {
                self.indexs = null;
                self.bubbleRadius = null;
            }
        };
        WijBubbleChart.prototype._create = function () {
            var self = this, o = self.options, defFill = self._getDefFill();
            this._handleChartStyles();
            //$.each(o.seriesStyles, function (idx, style) {
            //	if (!style.fill) {
            //		style.fill = defFill[idx];
            //	}
            //});
            self._setLabelOption();
            _super.prototype._create.call(this);
            self.chartElement.addClass(o.wijCSS.bubbleChart);
        };
        WijBubbleChart.prototype._setLabelOption = function () {
            var o = this.options;
            if(o.showChartLabels !== true && o.chartLabel.visible === true) {
                o.chartLabel.visible = false;
            }
            if(!$.isPlainObject(o.chartLabel.style) && $.isPlainObject(o.chartLabelStyle)) {
                o.chartLabel.style = o.chartLabelStyle;
            }
        };
        WijBubbleChart.prototype._clearChartElement = function () {
            var self = this, o = self.options, fields = self.chartElement.data("fields");
            _super.prototype._clearChartElement.call(this);
            if(fields && fields.bubbleInfos) {
                $.each(fields.bubbleInfos, function (i, n) {
                    if(n.bubble) {
                        n.bubble.wijRemove();
                    }
                    if(n.dcl) {
                        n.dcl.wijRemove();
                    }
                    if(n.symbol) {
                        n.symbol.wijRemove();
                    }
                });
            }
            if(fields && fields.bubbles) {
                self._destroyRaphaelArray(fields.bubbles);
            }
            self.element.removeData("plotInfos");
            if(!o.seriesTransition.enabled) {
                if(fields && fields.bubblesAnimationInfos) {
                    fields.bubblesAnimationInfos = null;
                }
            }
        };
        WijBubbleChart.prototype.destroy = function () {
            /// <summary>
            /// Remove the functionality completely. This will return the
            /// element back to its pre-init state.
            /// Code example:
            /// $("#bubblechart").wijbubblechart("destroy");
            /// </summary>
            var self = this;
            self.chartElement.removeClass(self.options.wijCSS.bubbleChart + " ui-helper-reset");
            self._destroyEles();
            _super.prototype.destroy.call(this);
        };
        WijBubbleChart.prototype.getBubble = function (index) {
            /// <summary>
            /// Returns the bubble which has a Raphael's object
            /// that represents bubbles for the series data with the given index.
            /// Code example:
            /// $("#bubblechart").wijbubblechart("getBubble", 2)
            /// </summary>
            /// <param name="index" type="Number">
            /// The index of the bubble.
            /// </param>
            /// <returns type="Raphael element">
            /// The bubble object.
            /// </returns>
            return this.chartElement.data("fields").bubbles[index];
        };
        WijBubbleChart.prototype._destroyEles = function () {
            var self = this, ele = self.element, fields = ele.data("fields");
            if(fields.bubbleInfos) {
                $.each(fields.bubbleInfos, function (i, n) {
                    self._removeEle(n.bubble);
                    self._removeEle(n.dcl);
                    self._removeEle(n.symbol);
                    n = null;
                });
                //self.bubbleInfos = [];
                            }
            ele.removeData("fields");
            //self.bubbles = [];
            self.bubbleRadius = [];
            //self.seriesEles = [];
            //self.tooltipbubbles = [];
                    };
        WijBubbleChart.prototype._removeEle = function (ele) {
            if(ele) {
                if(ele.node) {
                    $(ele.node).removeData();
                }
                ele.wijRemove();
                ele = null;
            }
        };
        WijBubbleChart.prototype._paintPlotArea = function () {
            var self = this, element = this.chartElement, o = self.options, seriesList = o.seriesList, nSeries = seriesList.length, seriesStyles = [].concat(o.seriesStyles.slice(0, nSeries)), seriesHoverStyles = [].concat(o.seriesHoverStyles.slice(0, nSeries)), canvasBounds = self.canvasBounds, xaxis = //startLocation = { x: canvasBounds.startX, y: canvasBounds.startY },
            //width = canvasBounds.endX - startLocation.x,
            //height = canvasBounds.endY - startLocation.y,
            self.axisInfo.x, yaxis = //todo need add chartarea
            self.axisInfo.y[0];
            if(nSeries === 0) {
                return;
            }
            //self._paintcircles(seriesList, seriesStyles, seriesHoverStyles,
            //	xaxis, yaxis, width, height, startLocation);
            self._prepBubbleData();
            this.bubbleChartRender = new BubbleChartRender(this.chartElement, {
                seriesList: seriesList,
                seriesStyles: seriesStyles,
                seriesHoverStyles: seriesHoverStyles,
                canvas: self.canvas,
                bounds: canvasBounds,
                xAxisInfo: xaxis,
                yAxisInfo: yaxis,
                chartLabel: o.chartLabel,
                textStyle: o.textStyle,
                chartLabelStyle: o.chartLabelStyle,
                chartLabelFormatString: o.chartLabelFormatString,
                bubbleRadius: self.bubbleRadius,
                animation: o.animation,
                seriesTransition: o.seriesTransition,
                sizingMethod: o.sizingMethod,
                minimumSize: o.minimumSize,
                maximumSize: o.maximumSize,
                mouseDown: $.proxy(self._mouseDown, self),
                mouseUp: $.proxy(self._mouseUp, self),
                mouseOver: $.proxy(self._mouseOver, self),
                mouseOut: $.proxy(self._mouseOut, self),
                mouseMove: $.proxy(self._mouseMove, self),
                click: $.proxy(self._click, self),
                disabled: o.disabled,
                culture: self._getCulture(),
                wijCSS: o.wijCSS,
                widget: this
            });
            this.bubbleChartRender.render();
            self.tooltipbubbles = [];
            $.each(element.data("fields").bubbleInfos, function (idx, bubbleInfo) {
                self.tooltipbubbles.push(bubbleInfo.bubble);
                if(bubbleInfo.dcl) {
                    self.tooltipbubbles.push(bubbleInfo.dcl);
                }
                if(bubbleInfo.symbol) {
                    self.tooltipbubbles.push(bubbleInfo.symbol);
                }
            });
            if(self.tooltip) {
                self.tooltip.setTargets(self.tooltipbubbles);
            }
            //self._playAnimation(self.bubbleInfos);
                    };
        WijBubbleChart.prototype._paintLegendIcon = function (x, y, width, height, style, legendIndex, seriesIndex, legendCss, series, leg) {
            var self = this, r = Math.min(width, height), markerStyle, type, icon;
            markerStyle = series.markerStyle;
            markerStyle = $.extend({
                fill: style.stroke,
                stroke: style.stroke,
                opacity: 1
            }, markerStyle);
            if(series.markers) {
                type = series.markers.type;
            }
            if(!type) {
                type = "circle";
            }
            icon = self.canvas.paintMarker(type, x + width / 2, y + height / 2, r / 2);
            $(icon.node).data("legendIndex", legendIndex).data("index", seriesIndex);
            self.legendIcons.push(icon);
            icon.attr(markerStyle);
            $.wijraphael.addClass($(icon.node), legendCss);
            return icon;
        };
        WijBubbleChart.prototype._getbubbleIndexs = function (width, height) {
            var self = this, o = self.options, xmax = o.axis.x.max, xmin = o.axis.x.min, ymin = o.axis.y.min, ymax = o.axis.y.max, xsub = //width = self.element.width(),
            //height = self.element.height(),
            [], ysub = [], xadd = [], yadd = [], datax = [], datay = [], xminIndex = -1, yminIndex = -1, xmaxIndex = -1, ymaxIndex = -1;
            self.bubbleRadius = [];
            self._prepBubbleData();
            $.each(o.seriesList, function (idx, series) {
                var data = series.data, markers = series.markers || {
                }, markerType = markers.type || "circle";
                if(data.y1 === undefined) {
                    return true;
                }
                $.each(data.y1, function (i, yval) {
                    var r = WijBubbleChart.transform(yval, o.maximumSize, o.minimumSize, self.canvasBounds, bubMin, bubDiff, o.sizingMethod, markerType), x, y;
                    if(self._isDate(data.x[i])) {
                        x = $.toOADate(data.x[i]);
                    } else if(isNaN(data.x[i])) {
                        x = i;
                    } else {
                        x = data.x[i];
                    }
                    y = data.y[i];
                    if(self._isDate(y)) {
                        y = $.toOADate(y);
                    }
                    xsub.push(x - r * (xmax - xmin) / width);
                    ysub.push(y - r * (ymax - ymin) / height);
                    xadd.push(x + r * (xmax - xmin) / width);
                    yadd.push(y + r * (ymax - ymin) / height);
                    datax.push(x);
                    datay.push(y);
                    self.bubbleRadius.push(r);
                });
            });
            xminIndex = self._getMinIndex(xsub);
            yminIndex = self._getMinIndex(ysub);
            xmaxIndex = self._getMaxIndex(xadd);
            ymaxIndex = self._getMaxIndex(yadd);
            self.indexs = {
                xMin: {
                    x: datax[xminIndex],
                    y: datay[xminIndex],
                    r: self.bubbleRadius[xminIndex]
                },
                xMax: {
                    x: datax[xmaxIndex],
                    y: datay[xmaxIndex],
                    r: self.bubbleRadius[xmaxIndex]
                },
                yMin: {
                    x: datax[yminIndex],
                    y: datay[yminIndex],
                    r: self.bubbleRadius[yminIndex]
                },
                yMax: {
                    x: datax[ymaxIndex],
                    y: datay[ymaxIndex],
                    r: self.bubbleRadius[ymaxIndex]
                }
            };
        };
        WijBubbleChart.prototype._calculateParameters = function (axisInfo, options) {
            _super.prototype._calculateParameters.call(this, axisInfo, options);
            var self = this;
            if(!options.autoMax && !options.autoMin) {
                return;
            }
            self._adjust(options, axisInfo);
        };
        WijBubbleChart.prototype._adjust = function (options, axisInfo) {
            var unitMinor = options.unitMinor, self = this, autoMin = options.autoMin, autoMax = options.autoMax, canvasBounds = self.canvasBounds, startLocation = {
                x: canvasBounds.startX,
                y: canvasBounds.startY
            }, width = canvasBounds.endX - startLocation.x, height = canvasBounds.endY - startLocation.y, omax = axisInfo.max, omin = axisInfo.min, origin = options.origin;
            if(!self.indexs) {
                self._getbubbleIndexs(width, height);
            }
            if(axisInfo.id === "x") {
                if(autoMin) {
                    omin = self._getMinTick(self.indexs.xMin.x, self.indexs.xMin.r, omin, omax, width, unitMinor);
                }
                if(autoMax) {
                    omax = self._getMaxTick(self.indexs.xMax.x, self.indexs.xMax.r, omin, omax, width, unitMinor);
                }
            } else {
                if(autoMin) {
                    omin = self._getMinTick(self.indexs.yMin.y, self.indexs.yMin.r, omin, omax, height, unitMinor);
                }
                if(autoMax) {
                    omax = self._getMaxTick(self.indexs.yMax.y, self.indexs.yMax.r, omin, omax, height, unitMinor);
                }
            }
            if(omax !== axisInfo.max || omin !== axisInfo.min) {
                // Fixed an issue that if the origin is less than the min value and more than the max value,
                // the axis will adjust wrong value.
                if(origin !== null && origin !== undefined) {
                    if(origin < omin) {
                        omin = origin;
                    } else if(origin > omax) {
                        omax = origin;
                    }
                }
                axisInfo.min = omin;
                axisInfo.max = omax;
                this._calculateMajorMinor(options, axisInfo);
                self._adjust(options, axisInfo);
            }
        };
        WijBubbleChart.prototype._getMinTick = function (val, r, min, max, length, unitMinor) {
            if((val - min) * length / (max - min) < r) {
                return min - unitMinor;
            } else {
                return min;
            }
        };
        WijBubbleChart.prototype._getMaxTick = function (val, r, min, max, length, unitMinor) {
            if((val - min) * length / (max - min) + r > length) {
                return max + unitMinor;
            } else {
                return max;
            }
        };
        WijBubbleChart.prototype._getMinIndex = function (arr) {
            var index = -1, min = 0;
            $.each(arr, function (i, n) {
                if(i === 0) {
                    min = n;
                } else {
                    if(n < min) {
                        min = n;
                    }
                }
            });
            $.each(arr, function (i, n) {
                if(n === min) {
                    index = i;
                    return false;
                }
            });
            return index;
        };
        WijBubbleChart.prototype._getMaxIndex = function (arr) {
            var index = -1, max = 0;
            $.each(arr, function (i, n) {
                if(i === 0) {
                    max = n;
                } else {
                    if(n > max) {
                        max = n;
                    }
                }
            });
            $.each(arr, function (i, n) {
                if(n === max) {
                    index = i;
                    return false;
                }
            });
            return index;
        };
        WijBubbleChart.prototype._showSerieEles = function (seriesEle) {
            $.each(seriesEle, function (i, bubbleInfo) {
                if(bubbleInfo.bubble) {
                    bubbleInfo.bubble.show();
                    if(bubbleInfo.bubble.tracker) {
                        bubbleInfo.bubble.tracker.show();
                    }
                    if($(bubbleInfo.bubble.node).data("wijchartDataObj")) {
                        $(bubbleInfo.bubble.node).data("wijchartDataObj").visible = true;
                    }
                }
                if(bubbleInfo.dcl) {
                    bubbleInfo.dcl.show();
                }
                if(bubbleInfo.symbol) {
                    bubbleInfo.symbol.show();
                }
            });
        };
        WijBubbleChart.prototype._hideSerieEles = function (seriesEle) {
            $.each(seriesEle, function (i, bubbleInfo) {
                if(bubbleInfo.bubble) {
                    bubbleInfo.bubble.hide();
                    if(bubbleInfo.bubble.tracker) {
                        bubbleInfo.bubble.tracker.hide();
                    }
                    if($(bubbleInfo.bubble.node).data("wijchartDataObj")) {
                        $(bubbleInfo.bubble.node).data("wijchartDataObj").visible = false;
                    }
                }
                if(bubbleInfo.dcl) {
                    bubbleInfo.dcl.hide();
                }
                if(bubbleInfo.symbol) {
                    bubbleInfo.symbol.hide();
                }
            });
        };
        WijBubbleChart.prototype._indicatorLineShowing = function (objs) {
            _super.prototype._indicatorLineShowing.call(this, objs);
            $.each(objs, function (i, obj) {
                if(obj.bubble) {
                    obj.bubble.attr(obj.hoverStyle);
                }
            });
        };
        WijBubbleChart.prototype._removeIndicatorStyles = function (objs) {
            $.each(objs, function (i, obj) {
                if(obj.bubble) {
                    obj.bubble.attr(obj.style);
                }
            });
        };
        WijBubbleChart.prototype._parseTable = function () {
            if(!this.element.is("table")) {
                return;
            }
            var self = this, ele = self.element, o = self.options, captions = //header & footer
            $("caption", ele), theaders = $("thead th", ele), seriesList = [], sList = $("tbody tr", ele), label = null, series = null, xValues = [], yValues = [], y1Values = [], getValue = function (val) {
                var ret = $.trim(val);
                if(!isNaN(val)) {
                    ret = parseFloat(val.toString());
                }
                return ret;
            };
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
            //legend
            o.legend = $.extend({
                visible: true
            }, o.legend);
            label = $.trim(theaders.eq(1).text());
            //seriesList
            sList.each(function (i, tr) {
                var tds = $("td", tr);
                if(tds.length >= 3) {
                    xValues.push(getValue(tds.eq(0).text()));
                    yValues.push(getValue(tds.eq(1).text()));
                    y1Values.push(getValue(tds.eq(2).text()));
                }
                return this;
            });
            series = {
                label: label,
                legendEntry: true,
                data: {
                    x: xValues,
                    y: yValues,
                    y1: y1Values
                }
            };
            seriesList.push(series);
            self.options.seriesList = seriesList;
        };
        WijBubbleChart.prototype._unbindLiveEvents = function () {
            var self = this;
            $("." + self.options.wijCSS.bubbleElement, self.chartElement[0]).off(// for jQuery 1.7.1
            ".wijbubblechart").off("wijbubblechart");
            if(self.tooltip) {
                self.tooltip.destroy();
                self.tooltip = null;
            }
        };
        WijBubbleChart.prototype._paintTooltip = function () {
            var self = this, fields = self.chartElement.data("fields");
            _super.prototype._paintTooltip.call(this);
            if(self.tooltip) {
                if(fields && fields.trackers && fields.trackers.length) {
                    self.tooltip.setTargets(fields.trackers);
                    self.tooltip.setOptions({
                        relatedElement: fields.trackers[0]
                    });
                }
            }
        };
        WijBubbleChart.prototype._getTooltipText = function (fmt, target) {
            var tar = $(target.node), dataObj, obj;
            //value = dataObj.data,
            if(tar.data("owner")) {
                tar = tar.data("owner");
            }
            dataObj = tar.data("wijchartDataObj");
            obj = {
                data: dataObj,
                value: dataObj.value,
                label: dataObj.label,
                total: dataObj.total,
                target: target,
                fmt: fmt,
                x: dataObj.x,
                y: dataObj.y,
                y1: dataObj.y1
            };
            return $.proxy(fmt, obj)();
        };
        WijBubbleChart.prototype._prepBubbleData = function () {
            var self = this, seriesList = self.options.seriesList, ymax = -999999999999, ymin = 9999999999999, data;
            $.each(seriesList, function (i, n) {
                data = n.data;
                if(data && data.y1) {
                    $.each(data.y1, function (j, m) {
                        ymax = Math.max(ymax, m);
                        ymin = Math.min(ymin, m);
                    });
                }
            });
            bubMax = ymax;
            bubMin = ymin;
            bubDiff = ymax - ymin;
        };
        WijBubbleChart.transform = function transform(yval, maxSize, minSize, bounds, bubMin, bubDiff, sizingMethod, markerType) {
            var yscale, val = yval, bubSizeDiff = maxSize - minSize, width = bounds.endX - bounds.startX, height = bounds.endY - bounds.startY;
            // adjust the bubble size calculate.
            //val -= bubMin;
            if(val < 0) {
                val = 0;
            }
            if(bubDiff === 0) {
                val = 1;
            } else {
                val /= bubMax;
            }
            val = WijBubbleChart.transformByArea(val, sizingMethod, markerType);
            val *= bubSizeDiff;
            val += minSize;
            yscale = Math.min(width, height);
            val *= yscale / 200.0;
            //val = $.wijbubble.transformByArea(val,sizingMethod, markerType)
            return val;
            //return Math.round(val);
                    };
        WijBubbleChart.transformByArea = function transformByArea(yval, sizingMethod, markerType) {
            var val = yval;
            if(sizingMethod === "area") {
                switch(markerType) {
                    case "circle":
                        val = Math.sqrt(val / Math.PI);
                        break;
                    case "tri":
                    case "invertedTri":
                        val = Math.sqrt(val / (3 * Math.sin(Math.PI / 6) * Math.cos(Math.PI / 6)));
                        break;
                    case "box":
                        val = Math.sqrt(val / 2);
                        break;
                    case "diamond":
                    case "cross":
                        val = Math.sqrt(val / 2);
                        break;
                    default:
                        val = Math.sqrt(4 * val / Math.PI);
                        break;
                }
            }
            return val;
        };
        return WijBubbleChart;
    })(wijmo.WijChartCore);
    wijmo.WijBubbleChart = WijBubbleChart;    
    WijBubbleChart.prototype.widgetEventPrefix = "wijbubblechart";
    WijBubbleChart.prototype.options = $.extend(true, {
    }, wijmo.WijChartCore.prototype.options, {
        initSelector: ":jqmData(role='wijbubblechart')",
        wijCSS: {
            bubbleChart: "wijmo-wijbubblechart",
            bubbleElement: "wijbubblechart-bubble",
            bubbleTracker: "bubbletracker",
            bubbleLabel: "wijbubblechart-label",
            bubbleSymbol: "wijbubblechart-symbol"
        },
        minimumSize: /// <summary>
        /// The minimum bubble size represents the percentage of the diameter (or area)
        /// of the plot area.
        /// Default: 5
        /// Type: Number
        /// Code example: $("#bubblechart").wijbubblechart("option", "minimumSize", 5)
        /// </summary>
        5,
        maximumSize: /// <summary>
        /// The maximum bubble size represents the percentage of the diameter (or area)
        /// of the plot area.
        /// Default: 20
        /// Type: Number
        /// Code example: $("#bubblechart").wijbubblechart("option", "maximumSize", 5)
        /// </summary>
        20,
        sizingMethod: /// <summary>
        /// A value that indicates how to calculate the bubble size.
        /// Default: "diameter"
        /// Type: "string"
        /// Valid Values: "area" and "diameter"
        ///		area: Render the bubble's area based on the y1 value.
        ///		diameter: Render the bubble's diameter based on the y1 value.
        /// Code example: $("#bubblechart").wijbubblechart("option",
        /// "sizingMethod", "area")
        /// </summary>
        "diameter",
        animation: /// <summary>
        /// The animation option defines the animation effect and controls other aspects
        /// of the widget's animation, such as duration and easing.
        /// Default: {enabled:true, duration:1000, easing: "elastic"}.
        /// Type: Object.
        /// Code example:
        ///  $("#bubblechart").wijbubblechart({
        ///      animation: {
        ///			enabled: true, duration: 1000, easing: "elastic"
        ///		}
        ///  });
        /// </summary>
        {
            enabled: /// <summary>
            /// A value that determines whether to show animation.
            /// Set this option to false in order to disable easing.
            /// Default: true.
            /// Type: Boolean.
            /// </summary>
            true,
            duration: /// <summary>
            /// The duration option defines the length of the animation effect in milliseconds.
            /// Default: 2000.
            /// Type: Number.
            /// </summary>
            1000,
            easing: /// <summary>
            /// Sets the type of animation easing effect that users experience
            /// when they load the wijbubblechart series.
            /// Remark: The easing is defined in Raphael, the documentation is:
            /// http://raphaeljs.com/reference.html#Raphael.easing_formulas
            /// Default: ">".
            /// Type: string.
            /// </summary>
            ">"
        },
        seriesTransition: /// <summary>
        /// The seriesTransition option is used to animate series in the chart
        /// when just their values change. This is helpful for visually showing
        /// changes in data for the same series.
        /// Default: {enabled:true, duration:400, easing: ">"}.
        /// Type: Object.
        /// Code example:
        ///  $("#bubblechart").wijbubblechart({
        ///      animation: {enabled: true, duration: 1000, easing: "<"}
        ///  });
        /// </summary>
        {
            enabled: /// <summary>
            /// A value that determines whether to show animation when reload.
            /// Default: true.
            /// Type: Boolean.
            /// </summary>
            true,
            duration: /// <summary>
            /// A value that indicates the duration for the series transition.
            /// Default: 400.
            /// Type: Number.
            /// </summary>
            400,
            easing: /// <summary>
            /// A value that indicates the easing for the series transition.
            /// Remark: The easing is defined in Raphael, the documentation is:
            /// http://raphaeljs.com/reference.html#Raphael.easing_formulas
            /// Default: ">".
            /// Type: string.
            /// </summary>
            ">"
        },
        seriesList: /// <summary>
        /// Sets the data for the chart to display.
        /// Default: [].
        /// Type: Array.
        /// Code example:
        /// $("#bubblechart").wijbubblechart({
        /// seriesList: [{
        /// label: "Q1",
        /// legendEntry: true,
        /// data: {
        /// x: [1, 2, 3, 4, 5],
        /// y: [12, 21, 9, 29, 30],
        /// y1:[3, 5, 1, 6, 2]
        /// }
        /// }, {
        /// label: "Q2",
        /// legendEntry: true,
        /// data: {
        /// xy: [1, 21, 2, 10, 3, 19, 4, 31, 5, 20],
        /// y1:[3, 5, 1, 6, 2]
        /// }
        /// }]
        /// OR
        /// seriesList: [{
        /// label: "Q1",
        /// legendEntry: true,
        /// data: {
        /// x: ["A", "B", "C", "D", "E"],
        /// y: [12, 21, 9, 29, 30],
        /// y1:[3, 5, 1, 6, 2]
        /// }
        /// }]
        /// OR
        /// seriesList: [{
        /// label: "Q1",
        /// legendEntry: true,
        /// data: {
        /// x: [new Date(1978, 0, 1), new Date(1980, 0, 1),
        /// new Date(1981, 0, 1), new Date(1982, 0, 1),
        /// new Date(1983, 0, 1)],
        /// y: [12, 21, 9, 29, 30],
        /// y1:[3, 5, 1, 6, 2]
        /// }
        /// }]
        /// });
        /// </summary>
        [],
        seriesHoverStyles: /// <summary>
        /// An array collection that contains the style applied to the chart elements.
        /// For more information on the available style parameters,
        /// Default: [{opacity: 1, "stroke-width": 5}, {
        ///				opacity: 1, "stroke-width": 5}, {
        ///				opacity: 1, "stroke-width": 5}, {
        ///				opacity: 1, "stroke-width": 5}, {
        ///				opacity: 1, "stroke-width": 5}, {
        ///				opacity: 1, "stroke-width": 5}, {
        ///				opacity: 1, "stroke-width": 5}, {
        ///				opacity: 1, "stroke-width": 5}, {
        ///				opacity: 1, "stroke-width": 5}, {
        ///				opacity: 1, "stroke-width": 5}, {
        ///				opacity: 1, "stroke-width": 5}, {
        ///				opacity: 1, "stroke-width": 5}].
        /// Type: Array.
        ///	Code example:
        ///	$("#bubblechart").wijbubblechart("option", "seriesHoverStyles", {
        ///				seriesHoverStyles: [
        ///					{fill: "rgb(255,0,0)", stroke:"none"},
        ///					{ fill: "rgb(255,125,0)", stroke: "none" }
        ///				]});
        /// </summary>
        [
            {
                opacity: 1,
                "stroke-width": 5
            }, 
            {
                opacity: 1,
                "stroke-width": 5
            }, 
            {
                opacity: 1,
                "stroke-width": 5
            }, 
            {
                opacity: 1,
                "stroke-width": 5
            }, 
            {
                opacity: 1,
                "stroke-width": 5
            }, 
            {
                opacity: 1,
                "stroke-width": 5
            }, 
            {
                opacity: 1,
                "stroke-width": 5
            }, 
            {
                opacity: 1,
                "stroke-width": 5
            }, 
            {
                opacity: 1,
                "stroke-width": 5
            }, 
            {
                opacity: 1,
                "stroke-width": 5
            }, 
            {
                opacity: 1,
                "stroke-width": 5
            }, 
            {
                opacity: 1,
                "stroke-width": 5
            }
        ],
        chartLabel: /// <summary>
        /// Creates a chartLabel object that defines all of the settings used to draw
        /// a label for each bubble in the chart.
        /// Default: {position: "inside", compass: "north", visible: true,
        /// style: {}, chartLabelFormatString:""}
        /// Type: Object.
        /// Code example:
        /// This code creates a chart with a label outside (and to the south) of each bubble with
        /// the numbers formatted as percentages with no decimal spaces,
        /// in purple size 14 font
        // $(document).ready(function () {
        //	$("#wijbubblechart").wijbubblechart({
        //		axis: {
        //			y: { text: "Number of Products" },
        //			x: { text: "Sales", annoFormatString: "C0" }
        //		},
        //		chartLabel: {
        //			chartLabelFormatString: "P0",
        //			compass: "south",
        //			position: "outside",
        //			style: { fill: "purple", "font-size": 14 }
        //		},
        //		legend: { visible: false },
        //		seriesList: [
        //        {
        //        	label: "Company A Market Share",
        //        	data: { y: [14], x: [12200], y1: [.15] }
        //        }, {
        //        	label: "Company B Market Share",
        //        	data: { y: [20], x: [60000], y1: [.23] }
        //        }, {
        //        	label: "Company C Market Share",
        //        	data: { y: [18], x: [24400], y1: [.1] }
        //        }]
        //	});
        //});
        /// </summary>
        {
            position: /// <summary>
            /// A value that indicates whether to draw a label inside our outside of each bubble
            /// in the chart. If set to "outside," the compass attribute sets where to
            /// draw the label.
            /// Default: "inside"
            /// Type: String
            /// Remark: the value should be "inside" or "outside".
            /// </summary>
            "inside",
            compass: /// <summary>
            /// A value that indicates the compass position at which to draw a chart label next
            /// to each bubble when you set the position option for the label to "outside."
            /// If the position is set to "inside," this attribute is ignored.
            /// Default: "north"
            /// Type: String
            /// Remark: the value should be "north", "east", "west" or "south"
            /// </summary>
            "north",
            visible: /// <summary>
            /// The visible option indicates whether to draw a label on each bubble in the chart.
            /// Default: true
            /// Type: Boolean
            /// </summary>
            true,
            style: /// <summary>
            /// A value that indicates the style parameters to apply to the labels on each bubble in the chart.
            /// Note: If you do not set any value for this style, the fallback style is chartLabelStyle.
            /// the style is defined in Raphael here is the documentation:
            /// http://raphaeljs.com/reference.html#Element.attr.
            /// The style is the “attr” method’s parameters.
            /// Default: {}.
            /// Type: Object.
            /// </summary>
            {
            },
            chartLabelFormatString: /// <summary>
            /// Sets the numeric format of the chart labels that show the value of each bubble.
            /// You can use Standard Numeric Format Strings.
            /// You can also change the style of these labels using chartLabelStyle, or to hide them
            /// Default: "".
            /// Type: String.
            /// </summary>
            ""
        },
        mouseDown: /// <summary>
        /// Fires when the user clicks a mouse button.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        ///  $("#bubblechart").wijbubblechart({mouseDown: function(e, data) { } });
        /// Bind to the event by type: wijbubblechartmousedown
        /// $("#bubblechart").bind("wijbubblechartmousedown", function(e, data) {} );
        /// </summary>
        /// <param name="e" type="eventObj">
        /// jQuery.Event object.
        ///	</param>
        /// <param name="data" type="Object">
        /// An object that contains all the series infos of the mousedown bubble.
        /// data.bubble: the Raphael object of the bubble.
        /// data.data: data of the series of the bubble.
        /// data.hoverStyle: hover style of series of the bubble.
        /// data.index: index of the bubble.
        /// data.label: label of the series of the bubble.
        /// data.legendEntry: legend entry of the series of the bubble.
        /// data.style: style of the series of the bubble.
        /// data.type: "bubble"
        /// data.x: the x value of the bubble.
        /// data.y: The y value of the bubble.
        /// data.y1: The y1 value of the bubble
        ///	</param>
        null,
        mouseUp: /// <summary>
        /// Fires when the user releases a mouse button
        /// while the pointer is over the chart element.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        ///  $("#bubblechart").wijbubblechart({mouseUp: function(e, data) { } });
        /// Bind to the event by type: wijbubblechartmousedown
        /// $("#bubblechart").bind("wijbubblechartmouseup", function(e, data) {} );
        /// </summary>
        /// <param name="e" type="eventObj">
        /// jQuery.Event object.
        ///	</param>
        /// <param name="data" type="Object">
        /// An object that contains all the series infos of the mouseup bubble.
        /// data.bubble: the Raphael object of the bubble.
        /// data.data: data of the series of the bubble.
        /// data.hoverStyle: hover style of series of the bubble.
        /// data.index: index of the bubble.
        /// data.label: label of the series of the bubble.
        /// data.legendEntry: legend entry of the series of the bubble.
        /// data.style: style of the series of the bubble.
        /// data.type: "bubble"
        /// data.x: the x value of the bubble.
        /// data.y: The y value of the bubble.
        /// data.y1: The y1 value of the bubble
        ///	</param>
        null,
        mouseOver: /// <summary>
        /// Fires when the user first places the pointer over the chart element.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        ///  $("#bubblechart").wijbubblechart({mouseOver: function(e, data) { } });
        /// Bind to the event by type: wijbubblechartmouseover
        /// $("#bubblechart").bind("wijbubblechartmouseover", function(e, data) {} );
        /// </summary>
        /// <param name="e" type="eventObj">
        /// jQuery.Event object.
        ///	</param>
        /// <param name="data" type="Object">
        /// An object that contains all the series infos of the mouseover bubble.
        /// data.bubble: the Raphael object of the bubble.
        /// data.data: data of the series of the bubble.
        /// data.hoverStyle: hover style of series of the bubble.
        /// data.index: index of the bubble.
        /// data.label: label of the series of the bubble.
        /// data.legendEntry: legend entry of the series of the bubble.
        /// data.style: style of the series of the bubble.
        /// data.type: "bubble"
        /// data.x: the x value of the bubble.
        /// data.y: The y value of the bubble.
        /// data.y1: The y1 value of the bubble
        ///	</param>
        null,
        mouseOut: /// <summary>
        /// Fires when the user moves the pointer off of the chart element.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        ///  $("#bubblechart").wijbubblechart({mouseOut: function(e, data) { } });
        /// Bind to the event by type: wijbubblechartmouseout
        /// $("#bubblechart").bind("wijbubblechartmouseout", function(e, data) {} );
        /// </summary>
        /// <param name="e" type="eventObj">
        /// jQuery.Event object.
        ///	</param>
        /// <param name="data" type="Object">
        /// An object that contains all the series infos of the mouseout bubble.
        /// data.bubble: the Raphael object of the bubble.
        /// data.data: data of the series of the bubble.
        /// data.hoverStyle: hover style of series of the bubble.
        /// data.index: index of the bubble.
        /// data.label: label of the series of the bubble.
        /// data.legendEntry: legend entry of the series of the bubble.
        /// data.style: style of the series of the bubble.
        /// data.type: "bubble"
        /// data.x: the x value of the bubble.
        /// data.y: The y value of the bubble.
        /// data.y1: The y1 value of the bubble
        ///	</param>
        null,
        mouseMove: /// <summary>
        /// Fires when the user moves the mouse pointer
        /// while it is over a chart element.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        ///  $("#bubblechart").wijbubblechart({mouseMove: function(e, data) { } });
        /// Bind to the event by type: wijbubblechartmousemove
        /// $("#bubblechart").bind("wijbubblechartmousemove", function(e, data) {} );
        /// </summary>
        /// <param name="e" type="eventObj">
        /// jQuery.Event object.
        ///	</param>
        /// <param name="data" type="Object">
        /// An object that contains all the series infos of the mousemove bubble.
        /// data.bubble: the Raphael object of the bubble.
        /// data.data: data of the series of the bubble.
        /// data.hoverStyle: hover style of series of the bubble.
        /// data.index: index of the bubble.
        /// data.label: label of the series of the bubble.
        /// data.legendEntry: legend entry of the series of the bubble.
        /// data.style: style of the series of the bubble.
        /// data.type: "bubble"
        /// data.x: the x value of the bubble.
        /// data.y: The y value of the bubble.
        /// data.y1: The y1 value of the bubble
        ///	</param>
        null,
        click: /// <summary>
        /// Fires when the user clicks the chart element.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        ///  $("#bubblechart").wijbubblechart({click: function(e, data) { } });
        /// Bind to the event by type: wijbubblechartclick
        /// $("#bubblechart").bind("wijbubblechartclick", function(e, data) {} );
        /// </summary>
        /// <param name="e" type="eventObj">
        /// jQuery.Event object.
        ///	</param>
        /// <param name="data" type="Object">
        /// An object that contains all the series infos of the clicked bubble.
        /// data.bubble: the Raphael object of the bubble.
        /// data.data: data of the series of the bubble.
        /// data.hoverStyle: hover style of series of the bubble.
        /// data.index: index of the bubble.
        /// data.label: label of the series of the bubble.
        /// data.legendEntry: legend entry of the series of the bubble.
        /// data.style: style of the series of the bubble.
        /// data.type: "bubble"
        /// data.x: the x value of the bubble.
        /// data.y: The y value of the bubble.
        /// data.y1: The y1 value of the bubble
        ///	</param>
        null
    });
    //$.widget("wijmo.wijbubblechart", WijBubbleChart.prototype);
    $.wijmo.registerWidget("wijbubblechart", WijBubbleChart.prototype);
    var BubbleChartRender = (function () {
        function BubbleChartRender(element, options) {
            this.element = element;
            this.options = options;
            this._init();
        }
        BubbleChartRender.prototype._init = function () {
            var o = this.options, bounds = o.bounds;
            this.fields = this.element.data("fields") || {
            };
            this.canvas = o.canvas;
            this.seriesList = $.arrayClone(o.seriesList);
            this.seriesStyles = o.seriesStyles;
            this.seriesHoverStyles = o.seriesHoverStyles;
            this.startLocation = {
                x: bounds.startX,
                y: bounds.startY
            };
            this.width = bounds.endX - this.startLocation.x;
            this.height = bounds.endY - this.startLocation.y;
            this.seriesEles = [];
            this.bubbles = [];
            this.bubbleInfos = [];
            this.trackers = this.canvas.set();
            this.currentIndex = 0;
        };
        BubbleChartRender.prototype.initAnimationState = function (bubbleInfo, bounds) {
            var bubble = bubbleInfo.bubble, symbol = bubbleInfo.symbol, bbox;
            if(bubble.type === "circle") {
                bubble.attr({
                    r: 0.0001,
                    cx: bounds.startX,
                    cy: bounds.endY
                });
            } else {
                bubble.transform("s0.01");
                bbox = bubble.wijGetBBox();
                bubble.transform("t" + (bounds.startX - bbox.x) + "," + (bounds.endY - bbox.y) + "s0.001");
            }
            if(symbol) {
                symbol.hide();
            }
        };
        BubbleChartRender.prototype.playAnimation = function () {
            var self = this, o = self.options, animation = o.animation, bounds = o.bounds, bubblesAnimationInfos = self.fields.bubblesAnimationInfos, animationInfos = [], bubbleInfos = self.fields.bubbleInfos, seriesTransition = o.seriesTransition, duration, easing, rate;
            if(animation && animation.enabled) {
                duration = animation.duration || 400;
                easing = animation.easing;
                $.each(bubbleInfos, function (idx, bubbleInfo) {
                    var bubble = bubbleInfo.bubble, params, bubblesAnimationInfo, bbox = bubble.wijGetBBox();
                    if(bubble.type === "circle") {
                        params = {
                            r: bubble.attr("r"),
                            cx: bubble.attr("cx"),
                            cy: bubble.attr("cy")
                        };
                    } else {
                        params = {
                            transform: "S1T0,0",
                            "stroke-width": bubble.attr("stroke-width"),
                            width: bbox.width,
                            x: bbox.x,
                            y: bbox.y
                        };
                    }
                    if(bubblesAnimationInfos && seriesTransition.enabled) {
                        bubblesAnimationInfo = bubblesAnimationInfos[idx];
                        if(bubblesAnimationInfo) {
                            if(bubble.type === "circle") {
                                bubble.attr({
                                    cx: bubblesAnimationInfo.cx,
                                    cy: bubblesAnimationInfo.cy,
                                    r: bubblesAnimationInfo.r
                                });
                            } else {
                                bbox = bubble.wijGetBBox();
                                rate = bubblesAnimationInfo.width / bbox.width;
                                bubble.transform("s" + rate);
                                bbox = bubble.wijGetBBox();
                                bubble.transform("t" + (bubblesAnimationInfo.x - bbox.x) + "," + (bubblesAnimationInfo.y - bbox.y) + "");
                            }
                            duration = seriesTransition.duration;
                            easing = seriesTransition.easing;
                        } else {
                            self.initAnimationState(bubbleInfo, bounds);
                        }
                    } else {
                        self.initAnimationState(bubbleInfo, bounds);
                    }
                    animationInfos.push(params);
                    bubble.wijAnimate(params, duration, easing, function () {
                        if($(bubbleInfo.bubble.node).data("wijchartDataObj") && $(bubbleInfo.bubble.node).data("wijchartDataObj").visible) {
                            if(bubbleInfo.dcl) {
                                bubbleInfo.dcl.show();
                            }
                            if(bubbleInfo.symbol) {
                                bubbleInfo.symbol.show();
                            }
                        }
                    });
                });
                self.fields.bubblesAnimationInfos = animationInfos;
            } else {
                $.each(bubbleInfos, function (idx, bubbleInfo) {
                    if($(bubbleInfo.bubble.node).data("wijchartDataObj") && $(bubbleInfo.bubble.node).data("wijchartDataObj").visible) {
                        if(bubbleInfo.dcl) {
                            bubbleInfo.dcl.show();
                        }
                        if(bubbleInfo.symbol) {
                            bubbleInfo.symbol.show();
                        }
                    }
                });
            }
        };
        BubbleChartRender.prototype.getSymbol = function (symbols, index) {
            var symbol;
            $.each(symbols, function (i, n) {
                if(i === index) {
                    symbol = n;
                    return false;
                }
            });
            return symbol;
        };
        BubbleChartRender.prototype.getLabelVisible = function (visibles, index) {
            var visible = true;
            $.each(visibles, function (i, n) {
                if(index === n) {
                    visible = false;
                    return false;
                }
            });
            return visible;
        };
        BubbleChartRender.prototype.paintMarker = function (type, x, y, length) {
            var marker;
            if(this.canvas[type]) {
                marker = this.canvas[type](x, y, length);
            }
            return marker;
        };
        BubbleChartRender.prototype.getLabelBox = function (val) {
            var text = this.canvas.text(0, 0, val), bbox = text.wijGetBBox(), ret;
            ret = {
                width: bbox.width,
                height: bbox.height
            };
            text.remove();
            return ret;
        };
        BubbleChartRender.prototype.applyLabelCompass = function (rf, text) {
            var compass = this.options.chartLabel.compass || "north", labelBox = this.getLabelBox(text), r = rf.r;
            switch(compass) {
                case "north":
                    rf.y -= (r + labelBox.height / 2);
                    break;
                case "south":
                    rf.y += (r + labelBox.height / 2);
                    break;
                case "east":
                    rf.x += (r + labelBox.width / 2);
                    break;
                case "west":
                    rf.x -= (r + labelBox.width / 2);
                    break;
            }
        };
        BubbleChartRender.prototype.paintDefaultChartLabel = function (rf, val) {
            var o = this.options, chartLabel = o.chartLabel, culture = o.culture, textStyle = $.extend(true, {
            }, o.textStyle, o.chartLabelStyle, chartLabel.style), text = $.round(val, 2), chartLabelFormatString = chartLabel.chartLabelFormatString === "" ? o.chartLabelFormatString : chartLabel.chartLabelFormatString, widget = this.options.widget, dcl;
            if(chartLabelFormatString && chartLabelFormatString.length) {
                text = Globalize.format(text, chartLabelFormatString, culture);
            }
            dcl = widget._text.call(widget, rf.x, rf.y, text).attr(textStyle);
            return dcl;
        };
        BubbleChartRender.prototype.paintbubble = function (series, seriesStyle, seriesHoverStyle, xAxisInfo, yAxisInfo, width, height, startLocation) {
            var data = series.data, minX = xAxisInfo.min, minY = yAxisInfo.min, maxX = xAxisInfo.max, maxY = yAxisInfo.max, kx = width / (maxX - minX), ky = height / (maxY - minY), serieEles = [], o = this.options, self = this, bounds = o.bounds, wijCSS = o.wijCSS, widget = o.widget, chartLabel = o.chartLabel, bubbleRadius = o.bubbleRadius, dcl, imgWidth, imgHeight, pointX;
            if(data.y1 === undefined) {
                return;
            }
            $.each(data.y1, function (i, y1) {
                if(data.x === undefined || data.y === undefined) {
                    return true;
                }
                var x = data.x[i], y = data.y[i], markers = series.markers || {
                }, markerType = markers.type || "circle", symbols = markers.symbol, invisibleMarkLabels = series.invisibleMarkLabels || [], rf, bubbleInfo, wijchartDataObj, bubble, sX, sY, symbol, symbolEl, r, tracker;
                if(bubbleRadius) {
                    r = bubbleRadius[self.currentIndex];
                    self.currentIndex++;
                } else {
                    r = WijBubbleChart.transform(y1, o.maximumSize, o.minimumSize, o.bounds, bubMin, bubDiff, o.sizingMethod, markerType);
                }
                if(xAxisInfo.isTime) {
                    x = $.toOADate(x);
                } else if(isNaN(x)) {
                    x = i;
                }
                if(yAxisInfo.isTime) {
                    y = $.toOADate(y);
                }
                sX = bounds.startX + (x - minX) * kx;
                sY = bounds.startY + (maxY - y) * ky;
                if(symbols) {
                    symbol = self.getSymbol(symbols, i);
                }
                bubble = self.paintMarker(markerType, sX, sY, r);
                bubble.attr(seriesStyle);
                if(symbol) {
                    imgWidth = symbol.width || (r * 2);
                    imgHeight = symbol.height || (r * 2);
                    symbolEl = self.canvas.image(symbol.url, sX - r, sY - r, imgWidth, imgHeight);
                }
                $.wijraphael.addClass($(bubble.node), wijCSS.canvasObject + " " + wijCSS.bubbleElement);
                if(symbol) {
                    bubble.attr("opacity", 0.1);
                }
                wijchartDataObj = $.extend(false, {
                    index: i,
                    bubble: bubble,
                    style: seriesStyle,
                    y1: y1,
                    x: x,
                    y: y,
                    type: "bubble",
                    hoverStyle: seriesHoverStyle,
                    visible: true
                }, series);
                if(symbol) {
                    wijchartDataObj.symbol = true;
                    wijchartDataObj.hoverStyle = $.extend({
                    }, seriesHoverStyle, {
                        opacity: 0.1
                    });
                    $(symbolEl.node).data("wijchartDataObj", wijchartDataObj);
                    $.wijraphael.addClass($(symbolEl.node), wijCSS.bubbleSymbol);
                }
                $(bubble.node).data("wijchartDataObj", wijchartDataObj);
                // cache the bar position to show indicator line.
                widget.dataPoints = widget.dataPoints || {
                };
                widget.pointXs = widget.pointXs || [];
                pointX = $.round(sX, 2);
                if(!widget.dataPoints[pointX.toString()]) {
                    widget.dataPoints[pointX.toString()] = [];
                    widget.pointXs.push(pointX);
                }
                widget.dataPoints[pointX.toString()].push(wijchartDataObj);
                tracker = bubble.clone();
                //.attr({ opacity: 0.01, fill: "white", "fill-opacity": 0.01 });
                // in vml, if the tracker has a stroke, the boder is black.
                if($.browser.msie && parseInt($.browser.version) < 9) {
                    tracker.attr({
                        opacity: 0.01,
                        fill: "white",
                        "stroke-width": 0,
                        "fill-opacity": 0.01
                    });
                } else {
                    tracker.attr({
                        opacity: 0.01,
                        fill: "white",
                        "fill-opacity": 0.01
                    });
                }
                $(tracker.node).data("owner", $(bubble.node));
                $.wijraphael.addClass($(tracker.node), wijCSS.canvasObject + " " + wijCSS.bubbleElement + " " + wijCSS.bubbleTracker);
                bubble.tracker = tracker;
                self.trackers.push(tracker);
                self.bubbles.push(bubble);
                self.fields.bubbles = self.bubbles;
                rf = {
                    x: sX,
                    y: sY,
                    r: r
                };
                if(chartLabel.visible && self.getLabelVisible(invisibleMarkLabels, i)) {
                    if(chartLabel.position === "outside") {
                        self.applyLabelCompass(rf, y1);
                    }
                    dcl = self.paintDefaultChartLabel(rf, y1);
                    dcl.hide();
                    $(dcl.node).data("wijchartDataObj", wijchartDataObj);
                    $.wijraphael.addClass($(dcl.node), wijCSS.bubbleLabel);
                }
                bubbleInfo = {
                    bubble: bubble,
                    dcl: dcl,
                    symbol: symbolEl
                };
                self.bubbleInfos.push(bubbleInfo);
                serieEles.push(bubbleInfo);
                if(series.visible === false) {
                    bubble.hide();
                    if(dcl) {
                        dcl.hide();
                    }
                    tracker.hide();
                    if(symbolEl) {
                        symbolEl.hide();
                    }
                }
            });
            self.fields.bubbleInfos = self.bubbleInfos;
            self.seriesEles.push(serieEles);
        };
        BubbleChartRender.prototype.paintBubbles = function () {
            var self = this, o = self.options, xAxisInfo = o.xAxisInfo, yAxisInfo = o.yAxisInfo;
            $.each(self.seriesList, function (i, series) {
                var seriesStyle = self.seriesStyles[i], seriesHoverStyle = self.seriesHoverStyles[i];
                self.paintbubble(series, seriesStyle, seriesHoverStyle, xAxisInfo, yAxisInfo, self.width, self.height, self.startLocation);
            });
        };
        BubbleChartRender.prototype.bindLiveEvents = function (element, mouseDown, mouseUp, mouseOver, mouseOut, mouseMove, click, disabled) {
            var o = this.options, wijCSS = o.wijCSS, proxyObj = {
                mousedown: function (e) {
                    if(disabled) {
                        return;
                    }
                    var target = $(e.target), dataObj;
                    if(target.data("owner")) {
                        target = target.data("owner");
                    }
                    dataObj = target.data("wijchartDataObj");
                    mouseDown.call(element, e, dataObj);
                },
                mouseup: function (e) {
                    if(disabled) {
                        return;
                    }
                    var target = $(e.target), dataObj;
                    if(target.data("owner")) {
                        target = target.data("owner");
                    }
                    dataObj = target.data("wijchartDataObj");
                    mouseUp.call(element, e, dataObj);
                },
                mouseover: function (e) {
                    if(disabled) {
                        return;
                    }
                    var target = $(e.target), dataObj;
                    if(target.data("owner")) {
                        target = target.data("owner");
                    }
                    dataObj = target.data("wijchartDataObj");
                    mouseOver.call(element, e, dataObj);
                },
                mouseout: function (e) {
                    if(disabled) {
                        return;
                    }
                    var target = $(e.target), dataObj, bubble;
                    if(target.data("owner")) {
                        target = target.data("owner");
                    }
                    dataObj = target.data("wijchartDataObj");
                    bubble = dataObj.bubble;
                    if(dataObj.symbol) {
                        return;
                    }
                    if(!dataObj.hoverStyle) {
                        if(bubble) {
                            bubble.attr({
                                opacity: "1"
                            });
                        }
                    } else {
                        if(dataObj.hoverStyle["stroke-width"] && !dataObj.style["stroke-width"]) {
                            bubble.attr("stroke-width", "");
                        }
                        bubble.attr(dataObj.style);
                        if(dataObj.style.opacity) {
                            bubble.attr("opacity", dataObj.style.opacity);
                        }
                    }
                    mouseOut.call(element, e, dataObj);
                },
                mousemove: function (e) {
                    if(disabled) {
                        return;
                    }
                    var target = $(e.target), dataObj, bubble;
                    if(target.data("owner")) {
                        target = target.data("owner");
                    }
                    dataObj = target.data("wijchartDataObj");
                    bubble = dataObj.bubble;
                    if(!dataObj.hoverStyle) {
                        if(bubble) {
                            bubble.attr({
                                opacity: "0.8"
                            });
                        }
                    } else {
                        bubble.attr(dataObj.hoverStyle);
                    }
                    mouseMove.call(element, e, dataObj);
                },
                click: function (e) {
                    if(disabled) {
                        return;
                    }
                    var target = $(e.target), dataObj;
                    if(target.data("owner")) {
                        target = target.data("owner");
                    }
                    dataObj = target.data("wijchartDataObj");
                    click.call(element, e, dataObj);
                }
            };
            $.each([
                "click", 
                "mouseover", 
                "mouseout", 
                "mousemove", 
                "mousedown", 
                "mouseup"
            ], function (i, n) {
                $("." + wijCSS.bubbleTracker, element).on(n + ".wijbubblechart", proxyObj[n]);
            });
        };
        BubbleChartRender.prototype.render = function () {
            var o = this.options, mouseDown = o.mouseDown, mouseUp = o.mouseUp, mouseOver = o.mouseOver, mouseOut = o.mouseOut, mouseMove = o.mouseMove, click = o.click, disabled = o.disabled;
            this.paintBubbles();
            this.fields.seriesEles = this.seriesEles;
            this.playAnimation();
            this.trackers.toFront();
            this.fields.trackers = this.trackers;
            this.bindLiveEvents(this.element, mouseDown, mouseUp, mouseOver, mouseOut, mouseMove, click, disabled);
            this.element.data("fields", this.fields);
        };
        return BubbleChartRender;
    })();
    wijmo.BubbleChartRender = BubbleChartRender;    
})(wijmo || (wijmo = {}));
