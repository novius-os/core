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
    (function (chart) {
        var maxSize = 10000;
        /* @ignore **/
        var BubbleAxisAdjust = (function () {
            function BubbleAxisAdjust(widget) {
                this.bubMax = 0;
                this.bubMin = 0;
                this.bubDiff = 0;
                this.y1Array = [];
                this.y1ValueGroup = {
                };
                this.bubbleRadius = {
                };
                this.chartDatas = [];
                var o = widget.options;
                this.widget = widget;
                this.seriesList = o.seriesList;
                this.maximumSize = o.maximumSize || 20;
                this.minimumSize = o.minimumSize || 5;
                this.sizingMethod = o.sizingMethod || "diameter";
                this._init();
                this._calculateMaxMin();
            }
            BubbleAxisAdjust.prototype._init = function () {
                var _this = this;
                var data, markers, markerType;
                $.each(this.seriesList, function (i, n) {
                    markers = n.markers || {
                    } , markerType = markers.type || "circle";
                    data = n.data;
                    if(data && data.y1 && data.x && data.y) {
                        $.each(data.y1, function (j, m) {
                            _this.y1Array.push(m);
                            if(!_this.y1ValueGroup[markerType]) {
                                _this.y1ValueGroup[markerType] = [];
                            }
                            _this.y1ValueGroup[markerType].push(m);
                            _this.chartDatas.push({
                                x: data.x[j],
                                y: data.y[j],
                                y1: data.y1[j]
                            });
                        });
                    }
                });
            };
            BubbleAxisAdjust.prototype._calculateMaxMin = function () {
                this.bubMax = Math.max.apply(null, this.y1Array);
                this.bubMin = Math.min.apply(null, this.y1Array);
                this.bubDiff = this.bubMax - this.bubMin;
            };
            BubbleAxisAdjust.prototype._calculateRadius = function (yval, maxSize, minSize, bounds, bubMax, bubDiff, sizingMethod, markerType) {
                var yscale, val = yval, bubSizeDiff = maxSize - minSize, width = bounds.endX - bounds.startX, height = bounds.endY - bounds.startY;
                if(val < 0) {
                    val = 0;
                }
                if(bubDiff === 0) {
                    val = 1;
                } else {
                    val /= bubMax;
                }
                val = this._calculateRadiusByArea(val, sizingMethod, markerType);
                val *= bubSizeDiff;
                val += minSize;
                yscale = Math.min(width, height);
                val *= yscale / 200.0;
                return val;
            };
            BubbleAxisAdjust.prototype._calculateRadiusByArea = function (yval, sizingMethod, markerType) {
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
            BubbleAxisAdjust.prototype.calculateRadius = function () {
                var _this = this;
                var bounds = this.widget.canvasBounds;
                this.bubbleRadius = {
                };
                $.each(this.y1ValueGroup, function (type, values) {
                    $.each(values, function (i, value) {
                        _this.bubbleRadius[value] = _this._calculateRadius(value, _this.maximumSize, _this.minimumSize, bounds, _this.bubMax, _this.bubDiff, _this.sizingMethod, type);
                    });
                });
            };
            BubbleAxisAdjust.prototype.getAdjust = function (axisInfo, options) {
                var _this = this;
                var bounds = this.widget.canvasBounds, max = axisInfo.max, min = axisInfo.min, minPoint = [], maxPoint = [], diff = 0, unitMinor = options.unitMinor, origin = options.origin, width = bounds.endX - bounds.startX, height = bounds.endY - bounds.startY, omax, omin, length, xStrings = [], xHash = {
                };
                this.calculateRadius();
                // if the x value is string. get the string index in seriesList.
                $.each(this.chartDatas, function (i, data) {
                    var x = data.x;
                    if(isNaN(x) && !_this.widget._isDate(x) && $.inArray(x, xStrings) === -1) {
                        xStrings.push(x);
                    }
                });
                $.each(xStrings, function (i, x) {
                    xHash[x] = i;
                });
                $.each(this.chartDatas, function (i, data) {
                    var x = data.x, y = data.y, y1 = data.y1, r = _this.bubbleRadius[y1];
                    if(_this.widget._isDate(x)) {
                        x = $.toOADate(x);
                    } else if(isNaN(x)) {
                        x = xHash[x];
                    }
                    if(_this.widget._isDate(y)) {
                        y = $.toOADate(y);
                    }
                    if(axisInfo.id === "x") {
                        length = width;
                        diff = r * (max - min) / length;
                        minPoint.push(x - diff);
                        maxPoint.push(x + diff);
                    } else {
                        length = height;
                        diff = r * (max - min) / length;
                        minPoint.push(y - diff);
                        maxPoint.push(y + diff);
                    }
                });
                omax = Math.max.apply(null, maxPoint);
                omin = Math.min.apply(null, minPoint);
                if((omax - min) * length / (max - min) > length) {
                    max += Math.ceil((omax - max) / unitMinor) * unitMinor;
                }
                if(omin < min) {
                    min -= Math.ceil((min - omin) / unitMinor) * unitMinor;
                }
                // Fixed an issue that if the origin is less than the min value and more than the max value,
                // the axis will adjust wrong value.
                if(origin !== null && origin !== undefined) {
                    if(origin < min) {
                        min = origin;
                    } else if(origin > max) {
                        max = origin;
                    }
                }
                return {
                    max: max,
                    min: min
                };
            };
            BubbleAxisAdjust.prototype.dispose = function () {
                this.y1Array = [];
                this.bubbleRadius = null;
                this.y1ValueGroup = null;
            };
            return BubbleAxisAdjust;
        })();
        chart.BubbleAxisAdjust = BubbleAxisAdjust;        
        /**
        * @widget
        */
        var wijbubblechart = (function (_super) {
            __extends(wijbubblechart, _super);
            function wijbubblechart() {
                _super.apply(this, arguments);

            }
            wijbubblechart.prototype._setOption = function (key, value) {
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
                }
            };
            wijbubblechart.prototype._create = function () {
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
            wijbubblechart.prototype._paintChartArea = function () {
                if(this.bubbleAxisAdjust) {
                    this.bubbleAxisAdjust.dispose();
                }
                this.bubbleAxisAdjust = new BubbleAxisAdjust(this);
                _super.prototype._paintChartArea.call(this);
            };
            wijbubblechart.prototype._bindSeriesData = function (ds, series, sharedXList) {
                var data = series.data, dataY1 = data.y1;
                _super.prototype._bindSeriesData.call(this, ds, series, sharedXList);
                if(dataY1 && dataY1.bind) {
                    data.y1 = this._getBindData(ds, dataY1.bind);
                }
            };
            wijbubblechart.prototype._checkSeriesDataEmpty = function (series) {
                var data = series.data;
                if(!data || this._checkEmptyData(data.y1)) {
                    return true;
                }
                return _super.prototype._checkSeriesDataEmpty.call(this, series);
            };
            wijbubblechart.prototype._setLabelOption = function () {
                var o = this.options;
                if(o.showChartLabels !== true && o.chartLabel.visible === true) {
                    o.chartLabel.visible = false;
                }
                if(!$.isPlainObject(o.chartLabel.style) && $.isPlainObject(o.chartLabelStyle)) {
                    o.chartLabel.style = o.chartLabelStyle;
                }
            };
            wijbubblechart.prototype._clearChartElement = function () {
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
            wijbubblechart.prototype.destroy = /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            function () {
                var self = this;
                self.chartElement.removeClass(self.options.wijCSS.bubbleChart + " ui-helper-reset");
                self._destroyEles();
                if(this.bubbleAxisAdjust) {
                    this.bubbleAxisAdjust.dispose();
                    this.bubbleAxisAdjust = null;
                }
                _super.prototype.destroy.call(this);
            };
            wijbubblechart.prototype.getBubble = /**
            * Returns the bubble which has a Raphael's object that represents bubbles for the series data with the given index.
            * @param {number} index The index of the bubble.
            * @returns {Raphael Element} The bubble object.
            */
            function (index) {
                return this.chartElement.data("fields").bubbles[index];
            };
            wijbubblechart.prototype.redraw = /** @ignore*/
            function (ifNeed) {
                _super.prototype.redraw.call(this, ifNeed);
            };
            wijbubblechart.prototype._destroyEles = function () {
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
                //self.seriesEles = [];
                //self.tooltipbubbles = [];
                            };
            wijbubblechart.prototype._removeEle = function (ele) {
                if(ele) {
                    if(ele.node) {
                        $(ele.node).removeData();
                    }
                    ele.wijRemove();
                    ele = null;
                }
            };
            wijbubblechart.prototype._paintPlotArea = function () {
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
                // call this method again for if the axis's max and min are set by manual.
                this.bubbleAxisAdjust.calculateRadius();
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
                    bubbleRadius: self.bubbleAxisAdjust.bubbleRadius,
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
                    shadow: o.shadow,
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
            wijbubblechart.prototype._paintLegendIcon = function (x, y, width, height, style, legendIndex, seriesIndex, legendCss, series, leg) {
                var self = this, r = Math.min(width, height), markerStyle, type, icon;
                markerStyle = series.markerStyle;
                markerStyle = $.extend({
                    fill: style.fill,
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
            wijbubblechart.prototype._calculateParameters = function (axisInfo, options) {
                _super.prototype._calculateParameters.call(this, axisInfo, options);
                if(!options.autoMax && !options.autoMin) {
                    return;
                }
                this._adjust(options, axisInfo);
            };
            wijbubblechart.prototype._adjust = function (options, axisInfo) {
                var unitMinor = options.unitMinor, self = this, autoMin = options.autoMin, autoMax = options.autoMax, canvasBounds = self.canvasBounds, startLocation = {
                    x: canvasBounds.startX,
                    y: canvasBounds.startY
                }, width = canvasBounds.endX - startLocation.x, height = canvasBounds.endY - startLocation.y, omax = axisInfo.max, omin = axisInfo.min, origin = options.origin, adjust = this.bubbleAxisAdjust.getAdjust(axisInfo, options);
                omax = adjust.max;
                omin = adjust.min;
                if(omax !== axisInfo.max || omin !== axisInfo.min) {
                    axisInfo.min = omin;
                    axisInfo.max = omax;
                    this._calculateMajorMinor(options, axisInfo);
                }
            };
            wijbubblechart.prototype._showSerieEles = function (seriesEle) {
                $.each(seriesEle, function (i, bubbleInfo) {
                    if(bubbleInfo.bubble) {
                        bubbleInfo.bubble.show();
                        if(bubbleInfo.bubble.shadow) {
                            bubbleInfo.bubble.shadow.show();
                        }
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
            wijbubblechart.prototype._hideSerieEles = function (seriesEle) {
                $.each(seriesEle, function (i, bubbleInfo) {
                    if(bubbleInfo.bubble) {
                        bubbleInfo.bubble.hide();
                        if(bubbleInfo.bubble.shadow) {
                            bubbleInfo.bubble.shadow.hide();
                        }
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
            wijbubblechart.prototype._indicatorLineShowing = function (objs) {
                _super.prototype._indicatorLineShowing.call(this, objs);
                $.each(objs, function (i, obj) {
                    if(obj.bubble) {
                        obj.bubble.attr(obj.hoverStyle);
                    }
                });
            };
            wijbubblechart.prototype._removeIndicatorStyles = function (objs) {
                $.each(objs, function (i, obj) {
                    if(obj.bubble) {
                        obj.bubble.attr(obj.style);
                    }
                });
            };
            wijbubblechart.prototype._parseTable = function () {
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
            wijbubblechart.prototype._unbindLiveEvents = function () {
                var self = this;
                $("." + self.options.wijCSS.bubbleElement, self.chartElement[0]).off(// for jQuery 1.7.1
                ".wijbubblechart").off("wijbubblechart");
                if(self.tooltip) {
                    self.tooltip.destroy();
                    self.tooltip = null;
                }
            };
            wijbubblechart.prototype._paintTooltip = function () {
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
            wijbubblechart.prototype._getTooltipText = function (fmt, target) {
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
            return wijbubblechart;
        })(chart.wijchartcore);
        chart.wijbubblechart = wijbubblechart;        
        wijbubblechart.prototype.widgetEventPrefix = "wijbubblechart";
        var wijbubblechart_options = (function () {
            function wijbubblechart_options() {
                /**
                * Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijbubblechart')";
                /**
                * @ignore
                */
                this.wijCSS = {
                    bubbleChart: "wijmo-wijbubblechart",
                    bubbleElement: "wijbubblechart-bubble",
                    bubbleTracker: "bubbletracker",
                    bubbleLabel: "wijbubblechart-label",
                    bubbleSymbol: "wijbubblechart-symbol"
                };
                /**
                * The minimum bubble size represents the percentage of the diameter (or area) of the plot area.
                */
                this.minimumSize = 5;
                /**
                * The maximum bubble size represents the percentage of the diameter (or area) of the plot area.
                */
                this.maximumSize = 20;
                /**
                * A value that indicates how to calculate the bubble size.
                * @remarks
                * Valid Values: "area" and "diameter"
                *	area: Render the bubble's area based on the y1 value.
                *	diameter: Render the bubble's diameter based on the y1 value.
                */
                this.sizingMethod = "diameter";
                /**
                * The animation option defines the animation effect and controls other aspects of the widget's animation,
                * such as duration and easing.
                */
                this.animation = {
                    enabled: /**
                    * A value that determines whether to show animation. Set this option to false in order to disable animation.
                    */
                    true,
                    duration: /**
                    * The duration option defines the length of the animation effect in milliseconds.
                    */
                    1000,
                    easing: /**
                    * Sets the type of animation easing effect that users experience when they load the wijbubblechart series.
                    * @remarks
                    * The easing is defined in Raphael, the documentation is:http://raphaeljs.com/reference.html#Raphael.easing_formulas
                    */
                    ">"
                };
                /**
                * The seriesTransition option is used to animate series in the chart when just their values change. This is
                * helpful for visually showing changes in data for the same series.
                */
                this.seriesTransition = {
                    enabled: /**
                    * A value that determines whether to show animation when reload.
                    */
                    true,
                    duration: /**
                    * A value that indicates the duration for the series transition.
                    */
                    400,
                    easing: /**
                    * A value that indicates the easing for the series transition.
                    * @remarks
                    * The easing is defined in Raphael, the documentation is:http://raphaeljs.com/reference.html#Raphael.easing_formulas
                    */
                    ">"
                };
                /**
                * Sets the data for the chart to display.
                * @example
                * $("#bubblechart").wijbubblechart({
                * seriesList: [{
                * label: "Q1",
                * legendEntry: true,
                * data: {
                * x: [1, 2, 3, 4, 5],
                * y: [12, 21, 9, 29, 30],
                * y1:[3, 5, 1, 6, 2]
                * }
                * }, {
                * label: "Q2",
                * legendEntry: true,
                * data: {
                * xy: [1, 21, 2, 10, 3, 19, 4, 31, 5, 20],
                * y1:[3, 5, 1, 6, 2]
                * }
                * }]
                * OR
                * seriesList: [{
                * label: "Q1",
                * legendEntry: true,
                * data: {
                * x: ["A", "B", "C", "D", "E"],
                * y: [12, 21, 9, 29, 30],
                * y1:[3, 5, 1, 6, 2]
                * }
                * }]
                * OR
                * seriesList: [{
                * label: "Q1",
                * legendEntry: true,
                * data: {
                * x: [new Date(1978, 0, 1), new Date(1980, 0, 1),
                * new Date(1981, 0, 1), new Date(1982, 0, 1),
                * new Date(1983, 0, 1)],
                * y: [12, 21, 9, 29, 30],
                * y1:[3, 5, 1, 6, 2]
                * }
                * }]
                * });
                */
                this.seriesList = [];
                /**
                * An array collection that contains the style applied to the chart elements. For more information on the available
                * style parameters.
                * @example
                * $("#bubblechart").wijbubblechart("option", "seriesHoverStyles", {
                *	seriesHoverStyles: [
                *		{fill: "rgb(255,0,0)", stroke:"none"},
                *		{ fill: "rgb(255,125,0)", stroke: "none" }
                *	]});
                */
                this.seriesHoverStyles = [
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
                ];
                /**
                * Creates a chartLabel object that defines all of the settings used to draw a label for each bubble in the chart.
                * @example
                * // This code creates a chart with a label outside (and to the south) of each bubble with the numbers formatted
                * // as percentages with no decimal spaces, in purple size 14 font
                * $(document).ready(function () {
                *	$("#wijbubblechart").wijbubblechart({
                *		axis: {
                *			y: { text: "Number of Products" },
                *			x: { text: "Sales", annoFormatString: "C0" }
                *		},
                *		chartLabel: {
                *			chartLabelFormatString: "P0",
                *			compass: "south",
                *			position: "outside",
                *			style: { fill: "purple", "font-size": 14 }
                *		},
                *		legend: { visible: false },
                *		seriesList: [
                *        {
                *        	label: "Company A Market Share",
                *        	data: { y: [14], x: [12200], y1: [.15] }
                *        }, {
                *        	label: "Company B Market Share",
                *        	data: { y: [20], x: [60000], y1: [.23] }
                *        }, {
                *        	label: "Company C Market Share",
                *        	data: { y: [18], x: [24400], y1: [.1] }
                *        }]
                *	});
                *});
                */
                this.chartLabel = {
                    position: /**
                    * A value that indicates whether to draw a label inside our outside of each bubble in the chart.
                    * @remarks
                    * If set to "outside," the compass attribute sets where to draw the label.
                    * The value should be "inside" or "outside".
                    */
                    "inside",
                    compass: /**
                    * A value that indicates the compass position at which to draw a chart label next to each bubble
                    * when you set the position option for the label to "outside." If the position is set to "inside,"
                    * this attribute is ignored.
                    * @remarks
                    * The value should be "north", "east", "west" or "south"
                    */
                    "north",
                    visible: /**
                    * The visible option indicates whether to draw a label on each bubble in the chart.
                    */
                    true,
                    style: /**
                    * A value that indicates the style parameters to apply to the labels on each bubble in the chart.
                    * @remarks
                    * Note: If you do not set any value for this style, the fallback style is chartLabelStyle.
                    * The style is defined in Raphael here is the documentation: http://raphaeljs.com/reference.html#Element.attr.
                    * The style is the “attr” method’s parameters.
                    */
                    {
                    },
                    chartLabelFormatString: /**
                    * Sets the numeric format of the chart labels that show the value of each bubble.
                    * @remarks
                    * You can use Standard Numeric Format Strings. You can also change the style of these labels using
                    * chartLabelStyle, or to hide them
                    */
                    ""
                };
                /**
                * Fires when the user clicks a mouse button.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {IBubbleChartEventArgs} data Information about an event
                */
                this.mouseDown = null;
                /**
                * Fires when the user releases a mouse button while the pointer is over the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {IBubbleChartEventArgs} data Information about an event
                */
                this.mouseUp = null;
                /**
                * Fires when the user first places the pointer over the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {IBubbleChartEventArgs} data Information about an event
                */
                this.mouseOver = null;
                /**
                * Fires when the user moves the pointer off of the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {IBubbleChartEventArgs} data Information about an event
                */
                this.mouseOut = null;
                /**
                * Fires when the user moves the mouse pointer while it is over a chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {IBubbleChartEventArgs} data Information about an event
                */
                this.mouseMove = null;
                /**
                * Fires when the user clicks the chart element.
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {IBubbleChartEventArgs} data Information about an event
                */
                this.click = null;
            }
            return wijbubblechart_options;
        })();        
        wijbubblechart.prototype.options = $.extend(true, {
        }, chart.wijchartcore.prototype.options, new wijbubblechart_options());
        //$.widget("wijmo.wijbubblechart", WijBubbleChart.prototype);
        $.wijmo.registerWidget("wijbubblechart", wijbubblechart.prototype);
        /**
        * @ignore
        */
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
                    bbox = bubble.wijGetBBox();
                    //when play animation, it will added the transform to move and scale the bubble element to start point and small size.
                    // the exists transform string should put behind of the animation transform.
                    bubble.transform("t" + (bounds.startX - bbox.x) + "," + (bounds.endY - bbox.y) + "s0.001...");
                    if(bubble.shadow) {
                        bubble.shadow.transform("t" + (bounds.startX - bbox.x) + "," + (bounds.endY - bbox.y) + "s0.001...");
                    }
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
                                transform: //directly use the transform srtring before playing animation.
                                bubble.matrix.toTransformString(),
                                "stroke-width": bubble.attr("stroke-width"),
                                width: bbox.width,
                                x: bbox.x,
                                y: bbox.y
                            };
                        }
                        if(bubble.shadow) {
                            bubble.shadow.hide();
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
                                    //directly use the transform before playing animatin.
                                    params.transform = bubble.matrix.toTransformString();
                                    bubble.transform(Raphael.format("s{0}t{1}{2}...", rate, bubblesAnimationInfo.x - bbox.x, bubblesAnimationInfo.y - bbox.y));
                                    if(bubble.shadow) {
                                        bubble.shadow.transform(Raphael.format("s{0}t{1}{2}...", rate, bubblesAnimationInfo.x - bbox.x, bubblesAnimationInfo.y - bbox.y));
                                    }
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
                                    bubbleInfo.bubble.wijAttr("opacity", 0.1);
                                }
                                if(bubble.shadow) {
                                    bubble.shadow.show();
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
                    if(n.index === index) {
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
                    }, markerType = markers.type || "circle", symbols = markers.symbol, invisibleMarkLabels = series.invisibleMarkLabels || [], r = bubbleRadius[y1], rf, bubbleInfo, wijchartDataObj, bubble, sX, sY, symbol, symbolEl, tracker;
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
                    if(self.options.shadow) {
                        chart.ChartUtil.paintShadow(bubble, 2, null);
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
                var o = this.options, wijCSS = o.wijCSS, eventPrefix = "", proxyObj = {
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
                            if(bubble.shadow) {
                                bubble.shadow.attr(dataObj.hoverStyle);
                            }
                        }
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
                                if(bubble.shadow) {
                                    bubble.shadow.attr("stroke-width", "");
                                }
                            }
                            bubble.wijAttr({
                                transform: ""
                            });
                            bubble.wijAttr(dataObj.style);
                            if(dataObj.style.opacity) {
                                bubble.attr("opacity", dataObj.style.opacity);
                                if(bubble.shadow) {
                                    bubble.shadow.attr("opacity", dataObj.style.opacity);
                                }
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
                if($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    eventPrefix = "wij";
                }
                $.each([
                    "click", 
                    "mouseover", 
                    "mouseout", 
                    "mousemove", 
                    "mousedown", 
                    "mouseup"
                ], function (i, n) {
                    $("." + wijCSS.bubbleTracker, element).on(eventPrefix + n + ".wijbubblechart", proxyObj[n]);
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
        chart.BubbleChartRender = BubbleChartRender;        
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
