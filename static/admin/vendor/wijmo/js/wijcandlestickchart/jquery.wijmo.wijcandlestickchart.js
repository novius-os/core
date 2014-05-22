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
    (function (chart) {
        var widgetName = "wijcandlestickchart", strOHLC = "ohlc", strCandlestick = "candlestick", strHL = "hl", strStrokeWidth = "stroke-width";
        /** @ignore */
        var datetimeUtil = (function () {
            function datetimeUtil(datetimeArr) {
                this.init(datetimeArr);
            }
            datetimeUtil.prototype.init = function (datetimeArr) {
                var times = [], dic = {
                }, length, i;
                $.each(datetimeArr, function (i, n) {
                    var val = $.toOADate(n);
                    if($.inArray(val, times) === -1) {
                        times.push(val);
                    }
                });
                this.count = length = times.length;
                this.times = times = times.sort();
                this.timeDic = dic;
                // when the times contains less than 2 items, set default value.
                if(length < 2) {
                    this.max = times[0] || 0;
                    this.min = times[0] || 0;
                    this.unit = 24 * 60 * 60 * 1000;
                    if(length === 1) {
                        dic[times[0]] = 0;
                    }
                    return;
                }
                for(i = 0; i < length; i++) {
                    dic[times[i]] = i;
                }
                this._calculateUnit();
                this.max = times[this.count - 1];
                this.min = times[0];
            };
            datetimeUtil.prototype._calculateUnit = function () {
                var unit = Number.MAX_VALUE, i = 1;
                for(; i < this.count; i++) {
                    unit = Math.min(unit, this.times[i] - this.times[i - 1]);
                }
                this.unit = unit;
            };
            datetimeUtil.prototype.getOATime = function (index) {
                var count = this.count, times = this.times, num;
                if(index < 0) {
                    return this.min + index * this.unit;
                } else if(index > count - 1) {
                    return this.max + (index - count + 1) * this.unit;
                } else {
                    num = parseInt(index);
                    return times[num] + (index - num) * this.unit;
                }
            };
            datetimeUtil.prototype.getTime = function (index) {
                return $.fromOADate(this.getOATime(index));
            };
            datetimeUtil.prototype.getTimeIndex = function (datetime) {
                var oaDate = $.toOADate(datetime), index;
                // if datetime is larger than the max date of the series's x data. use max and unit to calculate the index.
                if(oaDate > this.max) {
                    return this.count - 1 + (oaDate - this.max) / this.unit;
                    // if the datetime is smaller than the min date of the series's  use min and unit to calculate the index
                                    } else if(oaDate < this.min) {
                    return (oaDate - this.min) / this.unit;
                } else {
                    // if the datetime is in series's x date, just get the index in the series's x data.
                    if(this.timeDic && this.timeDic[oaDate] != null) {
                        return this.timeDic[oaDate];
                    } else {
                        // if the datetime not in series's x data, use the closest date and unit to calculate the index.
                        $.each(this.times, function (i, time) {
                            if(time > oaDate) {
                                index = i - 1;
                                return false;
                            }
                        });
                        return index + (oaDate - this.times[index]) / this.unit;
                    }
                }
            };
            datetimeUtil.prototype.getCount = function () {
                return this.times.length;
            };
            datetimeUtil.prototype.dispose = function () {
                this.times = null;
                this.timeDic = null;
            };
            return datetimeUtil;
        })();
        chart.datetimeUtil = datetimeUtil;        
        /** @widget */
        var wijcandlestickchart = (function (_super) {
            __extends(wijcandlestickchart, _super);
            function wijcandlestickchart() {
                _super.apply(this, arguments);

            }
            wijcandlestickchart.prototype._paintChartArea = function () {
                var o = this.options;
                if(this._isSeriesListDataEmpty()) {
                    return;
                }
                // Add high and low data to data.y for calculate the max and min of y axis.
                $.each(o.seriesList, function (i, series) {
                    var data = series.data;
                    data.y = [].concat(data.high).concat(data.low);
                });
                _super.prototype._paintChartArea.call(this);
                // Delete the added data.y.
                $.each(o.seriesList, function (i, series) {
                    delete series.data.y;
                });
            };
            wijcandlestickchart.prototype._checkSeriesDataEmpty = function (series) {
                var type = this.options.type, data = series.data, checkEmptyData = this._checkEmptyData;
                if(!data || checkEmptyData(data.x) || checkEmptyData(data.high) || checkEmptyData(data.low)) {
                    return true;
                }
                if(type === strOHLC || type === strCandlestick) {
                    if(checkEmptyData(data.open) || checkEmptyData(data.close)) {
                        return true;
                    }
                }
                return false;
            };
            wijcandlestickchart.prototype._getLegendStyle = function (seriesStyle) {
                var style = seriesStyle.highLow;
                if(style) {
                    style = $.extend({
                    }, style);
                    delete style.width;
                    delete style.height;
                    if(!style.stroke) {
                        style.stroke = style.fill;
                    }
                    return style;
                }
                return seriesStyle;
            };
            wijcandlestickchart.prototype._showHideSeries = function (seriesEles, type) {
                var nodeTypes = [
                    "highLow", 
                    "open", 
                    "close", 
                    "path", 
                    "high", 
                    "low", 
                    "openClose"
                ];
                $.each(seriesEles, function (i, candlestickNode) {
                    $.each(nodeTypes, function (idx, nodeType) {
                        if(candlestickNode[nodeType]) {
                            candlestickNode[nodeType][type]();
                        }
                    });
                    if(candlestickNode.path && $(candlestickNode.path.node).data("wijchartDataObj")) {
                        $(candlestickNode.path.node).data("wijchartDataObj").visible = (type === "show");
                    }
                });
            };
            wijcandlestickchart.prototype._showSerieEles = function (seriesEles) {
                this._showHideSeries(seriesEles, "show");
            };
            wijcandlestickchart.prototype._hideSerieEles = function (seriesEles) {
                this._showHideSeries(seriesEles, "hide");
            };
            wijcandlestickchart.prototype._paintPlotArea = function () {
                var o = this.options, render = new CandlestickChartRender(this.chartElement, {
                    canvas: this.canvas,
                    bounds: this.canvasBounds,
                    tooltip: this.tooltip,
                    widgetName: this.widgetName,
                    axis: o.axis,
                    seriesList: o.seriesList,
                    seriesStyles: o.seriesStyles,
                    seriesHoverStyles: o.seriesHoverStyles,
                    seriesTransition: o.seriesTransition,
                    showChartLabels: o.showChartLabels,
                    textStyle: o.textStyle,
                    chartLabelStyle: o.chartLabelStyle,
                    chartLabelFormatString: o.chartLabelFormatString,
                    shadow: o.shadow,
                    disabled: o.disabled,
                    animation: o.animation,
                    culture: this._getCulture(),
                    type: o.type,
                    wijCSS: o.wijCSS,
                    mouseDown: $.proxy(this._mouseDown, this),
                    mouseUp: $.proxy(this._mouseUp, this),
                    mouseOver: $.proxy(this._mouseOver, this),
                    mouseOut: $.proxy(this._mouseOut, this),
                    mouseMove: $.proxy(this._mouseMove, this),
                    click: $.proxy(this._click, this),
                    timeUtil: this.timeUtil,
                    candlestickFormatter: o.candlestickFormatter,
                    widget: this
                });
                render.render();
            };
            wijcandlestickchart.prototype._paintTooltip = function () {
                var fields = this.chartElement.data("fields"), trackers;
                _super.prototype._paintTooltip.call(this);
                // if the series's data is empty, the field will be null.
                if(this.tooltip && fields && fields.trackers) {
                    trackers = fields.trackers;
                    this.tooltip.setTargets(trackers);
                    this.tooltip.setOptions({
                        relatedElement: trackers[0]
                    });
                }
            };
            wijcandlestickchart.prototype._getTooltipText = function (fmt, target) {
                var dataObj = $(target.node).data("wijchartDataObj"), obj = {
                    data: dataObj,
                    label: dataObj.label,
                    x: dataObj.x,
                    high: dataObj.high,
                    low: dataObj.low,
                    open: dataObj.open,
                    close: dataObj.close,
                    target: target,
                    fmt: fmt
                };
                return $.proxy(fmt, obj)();
            };
            wijcandlestickchart.prototype._setDefaultTooltipText = function (data) {
                var type = this.options.type, tooltipText;
                tooltipText = data.label + " - " + Globalize.format(data.x, "d") + '\n High:' + data.high + '\n Low:' + data.low;
                if(type !== strHL) {
                    tooltipText += '\n Open:' + data.open + '\n Close:' + data.close + '';
                }
                return tooltipText;
            };
            wijcandlestickchart.prototype._setDefaultFill = function (type, style) {
                function setDefaultFill(style, prop) {
                    var p = style[prop] || {
                    };
                    if(!p.fill) {
                        p.fill = style.fill;
                    }
                    style[prop] = p;
                }
                function setDefaultFills(style, props) {
                    if($.isArray(props)) {
                        $.each(props, function (i, prop) {
                            setDefaultFill(style, prop);
                        });
                    } else {
                        setDefaultFill(style, props);
                    }
                }
                if(type === strHL) {
                    setDefaultFills(style, "highLow");
                } else if(type === strOHLC) {
                    setDefaultFills(style, [
                        "open", 
                        "close", 
                        "highLow"
                    ]);
                } else {
                    setDefaultFills(style, [
                        "fallingClose", 
                        "risingClose", 
                        "unchangeClose", 
                        "highLow"
                    ]);
                }
            };
            wijcandlestickchart.prototype._setDefaultCandlestickStyle = function () {
                var _this = this;
                var o = this.options, type = o.type, defFill = this._getDefFill();
                $.each(o.seriesStyles, function (idx, style) {
                    if(!style.fill) {
                        style.fill = defFill[idx];
                    }
                    _this._setDefaultFill(type, style);
                });
                defFill = null;
            };
            wijcandlestickchart.prototype._handleChartStyles = function () {
                _super.prototype._handleChartStyles.call(this);
                this._setDefaultCandlestickStyle();
            };
            wijcandlestickchart.prototype._create = function () {
                this._handleChartStyles();
                this.bindXData = false;
                this._handleXData();
                _super.prototype._create.call(this);
                this.chartElement.addClass(this.options.wijCSS.wijCandlestickChart);
            };
            wijcandlestickchart.prototype._setOption = function (key, value) {
                if(key === "axis") {
                    this._handleMaxMinInAxis(value);
                }
                _super.prototype._setOption.call(this, key, value);
            };
            wijcandlestickchart.prototype._seriesListSeted = function () {
                this.timeUtil.dispose();
                this.timeUtil = null;
                this._handleXData();
            };
            wijcandlestickchart.prototype._handleMaxMinInAxis = // if user set max and min for x axis, they should set OADate or datetime, here need to calculate it to index by datetimeUtil.
            // If it is set other values, here will calculate wrong dateUtil.
            function (axis) {
                var _this = this;
                var xAxis, oldAxis = this.options.axis, handleTime = function (val) {
                    if(_this._isDate(val)) {
                        return _this.timeUtil.getTimeIndex(val);
                    } else {
                        return _this.timeUtil.getTimeIndex($.fromOADate(val));
                    }
                };
                if(axis && axis.x) {
                    xAxis = axis.x;
                    $.each([
                        "max", 
                        "min"
                    ], function (i, name) {
                        if(!oldAxis || !oldAxis.x || oldAxis.x[name] !== xAxis[name]) {
                            xAxis[name] = handleTime(xAxis[name]);
                        }
                    });
                }
            };
            wijcandlestickchart.prototype._handleXData = function () {
                var _this = this;
                var o = this.options, seriesList = o.seriesList = $.arrayClone(o.seriesList), xValues = [], isContainsDateTime = false, containsXData = function (series) {
                    return series.data && series.data.x;
                }, restoreXValues = function (series) {
                    var xData = series.data.x;
                    $.each(xData, function (i, x) {
                        if(!_this._isDate(x)) {
                            xData[i] = _this.timeUtil.getTime(x);
                        }
                    });
                };
                if(this.timeUtil && !this.bindXData) {
                    return;
                }
                this.bindXData = false;
                //TODO check the x data is datetime, If it's not datetime, throw an exception.
                $.each(seriesList, function (i, series) {
                    if(containsXData(series) && $.isArray(series.data.x)) {
                        xValues = xValues.concat(series.data.x);
                    }
                });
                // when the timeUtil is init, and the series x data contains date value,
                // Here need to recalculate the dateUtil and new x value.
                if(this.timeUtil) {
                    $.each(xValues, function (i, n) {
                        if(_this._isDate(n)) {
                            isContainsDateTime = true;
                            return false;
                        }
                    });
                    if(isContainsDateTime) {
                        xValues = [];
                        $.each(seriesList, function (i, series) {
                            if(containsXData(series)) {
                                restoreXValues(series);
                                xValues = xValues.concat(series.data.x);
                            }
                        });
                        this.timeUtil.dispose();
                        this.timeUtil = null;
                    }
                }
                if(!this.timeUtil) {
                    this.timeUtil = new datetimeUtil(xValues);
                }
                $.each(seriesList, function (i, series) {
                    if(containsXData(series) && $.isArray(series.data.x)) {
                        series.data.x = $.map(series.data.x, function (n, j) {
                            return _this.timeUtil.getTimeIndex(n);
                        });
                    }
                });
            };
            wijcandlestickchart.prototype._bindData = function () {
                _super.prototype._bindData.call(this);
                this._handleXData();
            };
            wijcandlestickchart.prototype._bindSeriesData = // handle data bind
            function (ds, series, sharedXList) {
                var _this = this;
                var data = series.data;
                _super.prototype._bindSeriesData.call(this, ds, series, sharedXList);
                if(data.x && $.isArray(data.x)) {
                    this.bindXData = true;
                }
                $.each([
                    "high", 
                    "low", 
                    "open", 
                    "close"
                ], function (i, name) {
                    var d = data[name];
                    if(d && d.bind) {
                        data[name] = _this._getBindData(ds, d.bind);
                    }
                });
            };
            wijcandlestickchart.prototype.destroy = /** Remove the functionality completely. This will return the element back to its pre-init state. */
            function () {
                var element = this.chartElement;
                element.removeClass(this.options.wijCSS.wijCandlestickChart);
                _super.prototype.destroy.call(this);
                if(this.timeUtil) {
                    this.timeUtil.dispose();
                }
                element.data("fields", null);
            };
            wijcandlestickchart.prototype.getCandlestick = /**
            * This method returns the candlestick elements, which has a set of Raphaël objects  that represent candlestick elements for the
            * series data, from the specified index.
            * @param {number} index The zero-based index of the candlestick to return.
            * @returns {Object} candlestick object which contains Raphael elements.
            */
            function (index) {
                var fields = this.chartElement.data("fields");
                if(fields && fields.chartElements && fields.chartElements.candlestickEles) {
                    return fields.chartElements.candlestickEles[index] || null;
                }
                return null;
            };
            wijcandlestickchart.prototype._clearChartElement = function () {
                var o = this.options, fields = this.chartElement.data("fields"), chartElements, candlestickEles;
                if(fields && fields.chartElements) {
                    chartElements = fields.chartElements;
                    candlestickEles = chartElements.candlestickEles;
                    $.each(candlestickEles, function (i, candlestickEle) {
                        $.each(candlestickEle, function (key, node) {
                            if(node && node[0]) {
                                node.wijRemove();
                            }
                            candlestickEle[key] = null;
                        });
                        candlestickEles[i] = null;
                    });
                    chartElements.candlestickEles = null;
                    if(chartElements.group) {
                        chartElements.group.wijRemove();
                    }
                    chartElements.group = null;
                    if(fields.trackers) {
                        fields.trackers.wijRemove();
                    }
                    fields.trackers = null;
                }
                _super.prototype._clearChartElement.call(this);
            };
            wijcandlestickchart.prototype._calculateParameters = function (axisInfo, options) {
                _super.prototype._calculateParameters.call(this, axisInfo, options);
                if(axisInfo.id === "x") {
                    var minor = options.unitMinor, autoMin = options.autoMin, autoMax = options.autoMax, adj = this._getCandlestickAdjustment(axisInfo, minor);
                    if(autoMin) {
                        axisInfo.min -= adj;
                    }
                    if(autoMax) {
                        axisInfo.max += adj;
                    }
                    this._calculateMajorMinor(options, axisInfo);
                }
            };
            wijcandlestickchart.prototype._calculateMajorMinor = function (axisOptions, axisInfo) {
                if(axisInfo.id === "x") {
                    if(!axisOptions.annoFormatString || axisOptions.annoFormatString.length === 0) {
                        axisInfo.annoFormatString = chart.ChartDataUtil.getTimeDefaultFormat(this.timeUtil.getOATime(axisInfo.max), this.timeUtil.getOATime(axisInfo.min));
                    } else {
                        axisInfo.annoFormatString = axisOptions.annoFormatString;
                    }
                }
                _super.prototype._calculateMajorMinor.call(this, axisOptions, axisInfo);
            };
            wijcandlestickchart.prototype._getCandlestickAdjustment = function (axisInfo, minor) {
                var length = 0, adj;
                $.each(this.options.seriesList, function (i, s) {
                    if(s.data && s.data.x && $.isArray(s.data.x)) {
                        length = Math.max(s.data.x.length, length);
                    }
                });
                adj = (axisInfo.max - axisInfo.min) / length;
                if(adj === 0) {
                    adj = minor;
                } else {
                    if(minor < adj && minor !== 0) {
                        adj = Math.floor(adj / minor) * minor;
                    }
                }
                return adj;
            };
            wijcandlestickchart.prototype._getXTickText = function (text) {
                if(this.timeUtil.getCount() === 0) {
                    return "";
                }
                return this.timeUtil.getTime(text);
            };
            wijcandlestickchart.prototype._adjustTickValuesForCandlestickChart = function (tickValues) {
                var _this = this;
                var isValueLabels = this.options.axis.x.annoMethod === "valueLabels", values = [];
                if(isValueLabels && tickValues && $.isArray(tickValues)) {
                    $.each(tickValues, function (i, value) {
                        values[i] = _this.timeUtil.getTimeIndex($.fromOADate(value));
                    });
                    return values;
                }
                return _super.prototype._adjustTickValuesForCandlestickChart.call(this, tickValues);
            };
            wijcandlestickchart.prototype._getTickTextForCalculateUnit = function (value, axisInfo, prec) {
                if(axisInfo.id === "x") {
                    return Globalize.format(this._getXTickText(value), axisInfo.annoFormatString, this._getCulture());
                }
                return _super.prototype._getTickTextForCalculateUnit.call(this, value, axisInfo, prec);
            };
            return wijcandlestickchart;
        })(chart.wijchartcore);
        chart.wijcandlestickchart = wijcandlestickchart;        
        /** @ignore */
        var CandlestickChartRender = (function () {
            function CandlestickChartRender(element, options) {
                this.element = element;
                this.options = options;
                this.bounds = options.bounds , this.width = this.bounds.endX - this.bounds.startX;
                this.height = this.bounds.endY - this.bounds.startY;
                this.type = options.type;
                this.timeUtil = options.timeUtil;
                this.trackers = options.canvas.set();
                this.isHover = false;
            }
            CandlestickChartRender.prototype._paintCandlestickElements = function (series, seriesStyle, seriesHoverStyle) {
                var data = series.data, length = Math.min(data.x.length, data.high.length, data.low.length), wijCSS = this.options.wijCSS, commonData = $.extend({
                    candlestickType: this.type,
                    visible: true
                }, series), seriesEles = [], widget = this.options.widget, candlestickWidth, i, candlestickEles, pathNode, dataObj, pointX;
                commonData.type = "candlestick";
                if(data.open && data.close) {
                    length = Math.min(length, data.open.length, data.close.length);
                }
                candlestickWidth = this.width / length;
                for(i = 0; i < length; i++) {
                    candlestickEles = this._paintCandlestickGraphic(data, i, candlestickWidth, seriesStyle, seriesHoverStyle);
                    dataObj = $.extend({
                    }, commonData);
                    if(candlestickEles.path) {
                        pathNode = $(candlestickEles.path.node);
                        $.wijraphael.addClass(pathNode, wijCSS.canvasObject + " " + wijCSS.candlestickChart + " " + wijCSS.candlestickChartTracker);
                        pathNode.css("opacity", 0);
                        if(this.type !== strHL) {
                            $.extend(dataObj, {
                                open: data.open[i],
                                close: data.close[i]
                            });
                        }
                        $.extend(dataObj, {
                            high: data.high[i],
                            low: data.low[i],
                            index: i,
                            x: this.timeUtil.getTime(data.x[i]),
                            candlestickEles: candlestickEles,
                            style: seriesStyle,
                            hoverStyle: seriesHoverStyle
                        });
                        pathNode.data("wijchartDataObj", dataObj);
                    }
                    if(series.visible === false) {
                        $.each(candlestickEles, function (i, ele) {
                            if(ele && ele.hide) {
                                ele.hide();
                            }
                        });
                    }
                    seriesEles.push(candlestickEles);
                    // cache the bar position to show indicator line.
                    widget.dataPoints = widget.dataPoints || {
                    };
                    widget.pointXs = widget.pointXs || [];
                    pointX = candlestickEles.x;
                    if(!widget.dataPoints[pointX.toString()]) {
                        widget.dataPoints[pointX.toString()] = [];
                        widget.pointXs.push(pointX);
                    }
                    widget.dataPoints[pointX.toString()].push(dataObj);
                }
                return seriesEles;
            };
            CandlestickChartRender.prototype._unbindLiveEvents = function () {
                var widgetName = this.options.widgetName;
                this.element.off("." + widgetName, ".wijcandlestickchart");
            };
            CandlestickChartRender.prototype._bindLiveEvents = function () {
                var _this = this;
                var o = this.options, eventPrefix = "", element = this.element;
                if($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    eventPrefix = "wij";
                }
                function getDataFromEventArg(e) {
                    var target = $(e.target);
                    return target.data("wijchartDataObj");
                }
                function fireClientEvent(event, e, dataObj) {
                    var map = {
                        mouseover: o.mouseOver,
                        mouseout: o.mouseOut,
                        mousedown: o.mouseDown,
                        mouseup: o.mouseUp,
                        mousemove: o.mouseMove,
                        click: o.click
                    };
                    if($.isFunction(map[event])) {
                        return map[event].call(element, e, dataObj);
                    }
                }
                $.each([
                    "mouseover", 
                    "mouseout", 
                    "mousedown", 
                    "mouseup", 
                    "mousemove", 
                    "click"
                ], function (i, event) {
                    _this.element.on(eventPrefix + event + "." + o.widgetName, ".wijcandlestickchart", function (e) {
                        if(o.disabled) {
                            return;
                        }
                        var dataObj = getDataFromEventArg(e);
                        if(fireClientEvent(event, e, dataObj) !== false) {
                            if(event === "mouseover" || event === "mouseout") {
                                _this["_" + event](dataObj);
                            }
                        }
                        dataObj = null;
                    });
                });
            };
            CandlestickChartRender.prototype._setCandlestickStyleForHover = function (eles, style, open, close) {
                var setStyle = function (ele, style) {
                    if(ele && style) {
                        ele.attr(style);
                    }
                };
                setStyle(eles.highLow, style.highLow);
                setStyle(eles.open, style.open);
                setStyle(eles.close, style.close);
                setStyle(eles.high, style.highLow);
                setStyle(eles.low, style.highLow);
                if(open !== undefined && close !== undefined) {
                    if(open > close) {
                        setStyle(eles.openClose, style.fallingClose);
                    } else if(open < close) {
                        setStyle(eles.openClose, style.risingClose);
                    } else {
                        setStyle(eles.openClose, style.unchangeClose);
                    }
                }
            };
            CandlestickChartRender.prototype._mouseover = function (obj) {
                if(obj.hoverStyle) {
                    this.isHover = true;
                    this._setCandlestickStyleForHover(obj.candlestickEles, obj.hoverStyle, obj.open, obj.close);
                }
            };
            CandlestickChartRender.prototype._mouseout = function (obj) {
                var style = obj.style;
                if(this.isHover) {
                    this._setCandlestickStyleForHover(obj.candlestickEles, style, obj.open, obj.close);
                    this._formatCandlestick({
                        high: obj.high,
                        low: obj.low,
                        open: obj.open,
                        close: obj.close,
                        hlStyle: style.highLow,
                        oStyle: style.open,
                        cStyle: style.close,
                        index: obj.index,
                        eles: obj.candlestickEles,
                        fallingCloseStyle: style.fallingClose,
                        risingCloseStyle: style.risingClose,
                        unchangeCloseStyle: style.unchangeClose
                    });
                    this.isHover = false;
                }
            };
            CandlestickChartRender.prototype._paintCandlestickGraphic = function (data, index, candlestickWidth, seriesStyle, seriesHoverStyle) {
                var o = this.options, x = data.x[index], high = data.high[index], low = data.low[index], open = data.open ? data.open[index] : 0, close = data.close ? data.close[index] : 0, originX = this.bounds.startX, originY = this.bounds.endY, hasOC = this.type !== strHL, axis = o.axis, xAxis = axis.x, yAxis = axis.y, minX = xAxis.min, minY = yAxis.min, maxX = xAxis.max, maxY = yAxis.max, oWidth = 0, cWidth = 0, kx = this.width / (maxX - minX), ky = this.height / (maxY - minY), hlStyle, cStyle, oStyle, hlWidth, oWidth, cWidth, ox, oy, cx, cy, hx, hy, lx, ly, candlestickEles, halfWidth, fallingCloseStyle, risingCloseStyle, callbackObj, unchangeCloseStyle, extendStyle, closeWidth, candlestickStyle;
                function getstrokeFillStroke(style) {
                    if(style) {
                        return {
                            fill: style.fill,
                            stroke: style.stroke
                        };
                    }
                    return null;
                }
                oStyle = seriesStyle.open;
                cStyle = seriesStyle.close;
                hlStyle = seriesStyle.highLow;
                fallingCloseStyle = seriesStyle.fallingClose;
                risingCloseStyle = seriesStyle.risingClose;
                unchangeCloseStyle = seriesStyle.unchangeClose;
                hlWidth = hlStyle[strStrokeWidth] || 0;
                hx = (x - minX) * kx + this.bounds.startX;
                hy = (originY) - (high - minY) * ky;
                lx = hx;
                ly = originY - (low - minY) * ky;
                if(hasOC) {
                    if(this.type === strOHLC) {
                        oWidth = oStyle[strStrokeWidth] || 0;
                        cWidth = cStyle[strStrokeWidth] || 0;
                    } else {
                        // candlestick
                        if(open > close) {
                            oWidth = cWidth = fallingCloseStyle[strStrokeWidth] || 0;
                            closeWidth = fallingCloseStyle.width || 0;
                            extendStyle = getstrokeFillStroke(fallingCloseStyle);
                            candlestickStyle = fallingCloseStyle;
                        } else if(open === close) {
                            oWidth = cWidth = unchangeCloseStyle[strStrokeWidth] || 0;
                            closeWidth = unchangeCloseStyle.width || 0;
                            extendStyle = getstrokeFillStroke(unchangeCloseStyle);
                            candlestickStyle = unchangeCloseStyle;
                        } else {
                            oWidth = cWidth = risingCloseStyle[strStrokeWidth] || 0;
                            closeWidth = risingCloseStyle.width || 0;
                            extendStyle = getstrokeFillStroke(risingCloseStyle);
                            candlestickStyle = risingCloseStyle;
                        }
                        // if hlStyle sets a style,
                        hlStyle = $.extend({
                        }, extendStyle, hlStyle);
                        candlestickWidth = candlestickWidth - (oWidth + cWidth) / 2;
                        if(candlestickWidth < 2) {
                            candlestickWidth = 2;
                        }
                    }
                    halfWidth = (candlestickWidth / 2) * 0.8;
                    if(this.type === strCandlestick) {
                        halfWidth = Math.min(closeWidth / 2, halfWidth);
                    }
                    if(halfWidth < 1) {
                        halfWidth = 1;
                    }
                    ox = hx - halfWidth;
                    oy = originY - (open - minY) * ky;
                    cx = hx + halfWidth;
                    cy = originY - (close - minY) * ky;
                    oy = Math.max(oy, hy + oWidth / 2);
                    oy = Math.min(oy, ly - oWidth / 2);
                    cy = Math.max(cy, hy + cWidth / 2);
                    cy = Math.min(cy, ly - cWidth / 2);
                }
                if(this.type === strOHLC) {
                    candlestickEles = this._paintOHLC({
                        h: {
                            x: hx,
                            y: hy
                        },
                        l: {
                            x: lx,
                            y: ly
                        },
                        o: {
                            x: ox,
                            y: oy
                        },
                        c: {
                            x: cx,
                            y: cy
                        }
                    });
                    candlestickEles.open.attr(oStyle);
                    candlestickEles.close.attr(cStyle);
                } else if(this.type === strHL) {
                    candlestickEles = this._paintHL({
                        h: {
                            x: hx,
                            y: hy
                        },
                        l: {
                            x: lx,
                            y: ly
                        }
                    });
                } else {
                    candlestickEles = this._paintCandlestick({
                        h: {
                            x: hx,
                            y: hy
                        },
                        l: {
                            x: lx,
                            y: ly
                        },
                        o: {
                            x: ox,
                            y: oy
                        },
                        c: {
                            x: cx,
                            y: cy
                        }
                    });
                    candlestickEles.high.attr(hlStyle);
                    candlestickEles.low.attr(hlStyle);
                    candlestickEles.openClose.attr(candlestickStyle);
                }
                if(candlestickEles.highLow) {
                    candlestickEles.highLow.attr(hlStyle);
                }
                this._formatCandlestick({
                    high: high,
                    low: low,
                    open: open,
                    close: close,
                    hlStyle: hlStyle,
                    oStyle: oStyle,
                    cStyle: cStyle,
                    index: index,
                    eles: candlestickEles,
                    fallingCloseStyle: fallingCloseStyle,
                    risingCloseStyle: risingCloseStyle,
                    unchangeCloseStyle: unchangeCloseStyle
                });
                // add fill for fire the events, because the opacity of this element is 0, set any fill to this element is OK.
                candlestickEles.path.attr({
                    "stroke-width": Math.max(closeWidth || 1, cWidth || 1, hlWidth || 1, oWidth || 1),
                    fill: "#000"
                });
                this.trackers.push(candlestickEles.path);
                // for indicator line.
                candlestickEles.x = $.round(hx);
                // set the extend style to seriesStyle for hover event.
                seriesStyle.highLow = hlStyle;
                return candlestickEles;
            };
            CandlestickChartRender.prototype._formatCandlestick = function (options) {
                var candlestickFormatter = this.options.candlestickFormatter, index = options.index, high = options.high, low = options.low, open = options.open, close = options.close, hlStyle = options.hlStyle, oStyle = options.oStyle, cStyle = options.cStyle, fallingCloseStyle = options.fallingCloseStyle, risingCloseStyle = options.risingCloseStyle, unchangeCloseStyle = options.unchangeCloseStyle, type = this.type, data, styles;
                if(candlestickFormatter) {
                    data = {
                        high: high,
                        low: low
                    };
                    styles = {
                        highLow: hlStyle
                    };
                    if(type === strOHLC) {
                        $.extend(data, {
                            open: open,
                            close: close
                        });
                        $.extend(styles, {
                            open: oStyle,
                            close: cStyle
                        });
                    } else if(type === strCandlestick) {
                        $.extend(data, {
                            open: open,
                            close: close
                        });
                        $.extend(styles, {
                            fallingClose: fallingCloseStyle,
                            risingClose: risingCloseStyle,
                            unchangeClose: unchangeCloseStyle
                        });
                    }
                    candlestickFormatter.call(this, {
                        data: data,
                        eles: options.eles,
                        style: styles
                    });
                }
            };
            CandlestickChartRender.prototype._paintTracker = function (options, canvas) {
                var x = [], y = [], maxX, minX, maxY, minY;
                $.each(options, function (key, point) {
                    x.push(point.x);
                    y.push(point.y);
                });
                maxX = Math.max.apply(null, x);
                minX = Math.min.apply(null, x);
                maxY = Math.max.apply(null, y);
                minY = Math.min.apply(null, y);
                return canvas.rect(minX, minY, maxX - minX, maxY - minY);
            };
            CandlestickChartRender.prototype._paintOHLC = function (options) {
                var h = options.h, l = options.l, o = options.o, c = options.c, canvas = this.options.canvas, hlPath = [
                    "M", 
                    h.x, 
                    ",", 
                    h.y, 
                    "V", 
                    l.y
                ], oPath = [
                    "M", 
                    o.x, 
                    ",", 
                    o.y, 
                    "H", 
                    h.x
                ], cPath = [
                    "M", 
                    h.x, 
                    ",", 
                    c.y, 
                    "H", 
                    c.x
                ], hlEle, oEle, cEle, path;
                hlEle = canvas.path(hlPath.join(""));
                oEle = canvas.path(oPath.join(""));
                cEle = canvas.path(cPath.join(""));
                path = this._paintTracker(options, canvas);
                this._setTrackerForCandlestickEle([
                    hlEle, 
                    oEle, 
                    cEle
                ], path);
                this.group.push(oEle, cEle, hlEle);
                return {
                    highLow: hlEle,
                    open: oEle,
                    close: cEle,
                    path: path
                };
            };
            CandlestickChartRender.prototype._setTrackerForCandlestickEle = function (eles, tracker) {
                $.each(eles, function (i, ele) {
                    ele.node.tracker = tracker;
                });
            };
            CandlestickChartRender.prototype._paintHL = function (options) {
                var h = options.h, l = options.l, canvas = this.options.canvas, hlEle, pathEle;
                hlEle = canvas.path([
                    "M", 
                    h.x, 
                    ",", 
                    h.y, 
                    "V", 
                    l.y
                ].join(""));
                pathEle = hlEle.clone();
                this._setTrackerForCandlestickEle([
                    hlEle
                ], pathEle);
                this.group.push(hlEle);
                return {
                    highLow: hlEle,
                    path: pathEle
                };
            };
            CandlestickChartRender.prototype._paintCandlestick = function (options) {
                var h = options.h, l = options.l, o = options.o, c = options.c, canvas = this.options.canvas, ocEle, hEle, lEle, topY, bottomY, hPath, lPath, ocPath, path;
                if(c.y < o.y) {
                    topY = c.y;
                    bottomY = o.y;
                } else {
                    topY = o.y;
                    bottomY = c.y;
                }
                hPath = [
                    "M", 
                    h.x, 
                    ",", 
                    h.y, 
                    "V", 
                    topY
                ];
                lPath = [
                    "M", 
                    l.x, 
                    ",", 
                    l.y, 
                    "V", 
                    bottomY
                ];
                ocPath = [
                    "M", 
                    o.x, 
                    ",", 
                    topY, 
                    "H", 
                    c.x, 
                    "V", 
                    bottomY, 
                    "H", 
                    o.x, 
                    "V", 
                    topY, 
                    "Z"
                ];
                hEle = canvas.path(hPath.join(""));
                lEle = canvas.path(lPath.join(""));
                ocEle = canvas.path(ocPath.join(""));
                path = this._paintTracker(options, canvas);
                this.group.push(hEle, lEle, ocEle);
                this._setTrackerForCandlestickEle([
                    hEle, 
                    lEle, 
                    ocEle
                ], path);
                return {
                    high: hEle,
                    low: lEle,
                    openClose: ocEle,
                    path: path
                };
            };
            CandlestickChartRender.prototype._handleStyle = function (style, notHandleWidth) {
                if(!style) {
                    return;
                }
                if(!style.stroke) {
                    style.stroke = style.fill;
                }
                if(notHandleWidth !== true) {
                    $.each([
                        "width", 
                        "height"
                    ], function (i, prop) {
                        if(style[prop]) {
                            style["stroke-width"] = style[prop];
                            delete style[prop];
                        }
                    });
                }
                return style;
            };
            CandlestickChartRender.prototype._extendStyles = function (style) {
                var s = $.extend(true, {
                }, style);
                if(s) {
                    s.highLow = this._handleStyle(s.highLow);
                    s.close = this._handleStyle(s.close);
                    s.open = this._handleStyle(s.open);
                    s.fallingClose = this._handleStyle(s.fallingClose, true);
                    s.risingClose = this._handleStyle(s.risingClose, true);
                    s.unchangeClose = this._handleStyle(s.unchangeClose, true);
                }
                return s;
            };
            CandlestickChartRender.prototype._paintCandlesticks = function () {
                var _this = this;
                var seriesEls = [], seriesEl, o = this.options, seriesList = o.seriesList, seriesStyles = o.seriesStyles, seriesHoverStyles = o.seriesHoverStyles, fields = this.element.data("fields") || {
                }, chartElements = fields.chartElements || {
                }, candlestickEles = chartElements.candlestickEles || [];
                $.each(seriesList, function (i, series) {
                    var seriesStyle = _this._extendStyles(seriesStyles[i]), seriesHoverStyle = _this._extendStyles(seriesHoverStyles[i]);
                    seriesEl = _this._paintCandlestickElements(series, seriesStyle, seriesHoverStyle);
                    candlestickEles = candlestickEles.concat(seriesEl);
                    seriesEls.push(seriesEl);
                });
                fields.seriesEles = seriesEls;
                fields.trackers = this.trackers;
                chartElements.candlestickEles = candlestickEles;
                chartElements.group = this.group;
                fields.chartElements = chartElements;
                this.fields = fields;
                this.trackers.toFront();
            };
            CandlestickChartRender.prototype._playAnimation = // Using group to improve clip animation performance.
            function () {
                var animation = this.options.animation, animated = animation && animation.enabled, duration, easing;
                if(animated) {
                    duration = animation.duration || 400;
                    easing = animation.easing;
                    this.group.attr("clip-rect", [
                        this.bounds.startX, 
                        this.bounds.startY, 
                        0, 
                        this.height
                    ].join(","));
                    this.group.wijAnimate({
                        "clip-rect": [
                            this.bounds.startX, 
                            this.bounds.startY, 
                            this.width, 
                            this.height
                        ].join(",")
                    }, duration, easing);
                }
            };
            CandlestickChartRender.prototype.render = function () {
                this.group = this.options.canvas.group();
                this._paintCandlesticks();
                this.element.data("fields", this.fields);
                this._unbindLiveEvents();
                this._bindLiveEvents();
                this._playAnimation();
            };
            return CandlestickChartRender;
        })();
        chart.CandlestickChartRender = CandlestickChartRender;        
        var wijcandlestickchart_options = (function () {
            function wijcandlestickchart_options() {
                /** A value that indicates how to draw the candlestick element. Possible value is ohlc, hl, candlestick*/
                this.type = strCandlestick;
                /*
                * The animation option defines the animation effect and controls other aspects of the widget's animation,
                * such as duration and easing.
                */
                this.animation = {
                    enabled: true,
                    duration: 400,
                    easing: ">"
                };
                /**
                * @ignore
                */
                this.wijCSS = {
                    wijCandlestickChart: "wijmo-wijcandlestickchart",
                    candlestickChart: "wijcandlestickchart",
                    candlestickChartTracker: "candlesticktracker"
                };
                /**
                * A callback to format the candlestick element.
                * @type Function
                */
                this.candlestickFormatter = null;
                /** @ignore*/
                this.showChartLabels = true;
                /** @ignore*/
                this.chartLabelStyle = {
                };
                /** @ignore*/
                this.chartLabelFormatString = "";
                /**
                * Creates an object to use as the tooltip, or hint, when the mouse is over a chart element.
                */
                this.hint = {
                    contentStyle: {
                        "font-size": 12
                    }
                };
                /**
                * This event fires when the user clicks a mouse button.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICandlestickChartEventArgs} data Information about an event
                */
                this.mouseDown = null;
                /**
                * Fires when the user releases a mouse button while the pointer is over the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICandlestickChartEventArgs} data Information about an event
                */
                this.mouseUp = null;
                /**
                * Fires when the user first places the pointer over the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICandlestickChartEventArgs} data Information about an event
                */
                this.mouseOver = null;
                /**
                * Fires when the user moves the pointer off of the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICandlestickChartEventArgs} data Information about an event
                */
                this.mouseOut = null;
                /**
                * Fires when the user moves the mouse pointer while it is over a chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICandlestickChartEventArgs} data Information about an event
                */
                this.mouseMove = null;
                /**
                * Fires when the user clicks the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICandlestickChartEventArgs} data Information about an event
                */
                this.click = null;
            }
            return wijcandlestickchart_options;
        })();        
        wijcandlestickchart.prototype.options = $.extend(true, {
        }, chart.wijchartcore.prototype.options, new wijcandlestickchart_options());
        wijcandlestickchart.prototype.widgetEventPrefix = widgetName;
        $.wijmo.registerWidget(widgetName, wijcandlestickchart.prototype);
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
