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
    /// <reference path="../wijbarchart/jquery.wijmo.wijbarchart.ts"/>
    /// <reference path="../wijbubblechart/jquery.wijmo.wijbubblechart.ts"/>
    /// <reference path="../wijpiechart/jquery.wijmo.wijpiechart.ts"/>
    /// <reference path="../wijlinechart/jquery.wijmo.wijlinechart.ts"/>
    /// <reference path="../wijscatterchart/jquery.wijmo.wijscatterchart.ts"/>
    /// <reference path="../wijcandlestickchart/jquery.wijmo.wijcandlestickchart.ts"/>
    /*globals jQuery, Globalize*/
    /*
    * Depends:
    *  raphael.js
    *  globalize.min.js
    *  jquery.ui.widget.js
    *  jquery.wijmo.wijchartcore.js
    *  jquery.wijmo.wijbarchart.js
    *  jquery.wijmo.wijlinechart.js
    *  jquery.wijmo.wijpiechart.js
    *  jquery.wijmo.wijscatterchart.js
    *
    */
    (function (chart) {
        var wijcandlestickchartFn = $.wijmo.wijcandlestickchart;
        /**
        * @widget
        */
        var wijcompositechart = (function (_super) {
            __extends(wijcompositechart, _super);
            function wijcompositechart() {
                _super.apply(this, arguments);

            }
            wijcompositechart.prototype._create = function () {
                var self = this, o = self.options, defFill = self._getDefFill(), yAxis, yAxes;
                $.each(o.seriesList, function (idx, series) {
                    if(series.type === "bar") {
                        $.extend(true, o.axis, {
                            x: {
                                compass: "west"
                            },
                            y: {
                                compass: "south"
                            }
                        });
                        return true;
                    } else if(series.type === "pie" && series.pieSeriesList) {
                        series.data = series.pieSeriesList;
                    } else if(series.candlestickSeries && series.candlestickSeries.data && $.inArray(series.type, [
                        "hl", 
                        "ohlc", 
                        "candlestick"
                    ]) != -1) {
                        series.data = series.candlestickSeries.data;
                    }
                });
                $.extend(true, {
                    compass: "east"
                }, o.hint);
                // set the is100percent to default value.
                if(o.is100Percent) {
                    o.is100Percent = false;
                }
                //handle the multiple y axis for extender and controls
                if(o.yAxes && $.isArray(o.yAxes) && o.yAxes.length > 0) {
                    // for composite chart, if user set the y axis option, here should get the settings from y axis.
                    yAxes = [];
                    //yAxis = $.extend(true, {}, o.axis.y);
                    //o.axis.y = o.yAxes;
                    $.each(o.yAxes, function (i, axis) {
                        yAxes.push($.extend({
                        }, o.axis.y, axis));
                    });
                    o.axis.y = yAxes;
                }
                self._handleChartStyles();
                self._checkChartType();
                if(self.isContainsCandlestick) {
                    self.bindXData = false;
                    self._handleXDataForCandlestick();
                }
                _super.prototype._create.call(this);
                self.chartElement.addClass(o.wijCSS.compositechart);
            };
            wijcompositechart.prototype._setOption = function (key, value) {
                // ignore the is100Percent option.
                if(key !== "is100Percent") {
                    if(key === "axis" && this.isContainsCandlestick) {
                        if(wijcandlestickchartFn) {
                            wijcandlestickchartFn.prototype._handleMaxMinInAxis.apply(this, [
                                value
                            ]);
                        }
                    }
                    _super.prototype._setOption.call(this, key, value);
                }
            };
            wijcompositechart.prototype._seriesListSeted = function () {
                this._checkChartType();
                if(this.isContainsCandlestick) {
                    this.timeUtil.dispose();
                    this.timeUtil = null;
                    this._handleXDataForCandlestick();
                }
            };
            wijcompositechart.prototype._supportStacked = function () {
                return true;
            };
            wijcompositechart.prototype.destroy = /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            function () {
                var self = this, element = self.chartElement, fields = element.data("fields"), aniBarsAttr = fields && fields.aniBarsAttr;
                element.removeClass(self.options.wijCSS.compositechart);
                if(this.timeUtil) {
                    this.timeUtil.dispose();
                }
                _super.prototype.destroy.call(this);
                self._destroyRaphaelArray(aniBarsAttr);
                self.aniPathsAttr = null;
                element.data("fields", null);
            };
            wijcompositechart.prototype._isBarChart = function () {
                return true;
            };
            wijcompositechart.prototype._clearChartElement = function () {
                var self = this, o = self.options, element = self.chartElement, fields = element.data("fields");
                if(fields && fields.allElements) {
                    $.each(fields.allElements, function (key, eles) {
                        if(key === "scatters") {
                            if(eles.length) {
                                $.each(eles, function (i, ele) {
                                    if(ele.length) {
                                        $.each(ele, function (j, n) {
                                            if(n && n.remove) {
                                                n.remove();
                                            }
                                            ele[j] = null;
                                        });
                                        eles[i] = null;
                                    }
                                });
                            }
                        }
                        self._destroyRaphaelArray(eles);
                    });
                    fields.allElements = null;
                }
                _super.prototype._clearChartElement.call(this);
                if(fields && fields.ctracers) {
                    fields.ctracers = null;
                }
                self.element.removeData("plotInfos");
                if(!o.seriesTransition.enabled) {
                    if(fields && fields.aniBarsAttr) {
                        fields.aniBarsAttr = null;
                    }
                }
            };
            wijcompositechart.prototype._bindSeriesData = // handle data bind
            function (ds, series, sharedXList) {
                var _this = this;
                var data = series.data, type = series.type, dataLabel, dataValue, dataOffset, pieData = [];
                if(type === "pie") {
                    dataLabel = data.label;
                    dataValue = data.value;
                    dataOffset = data.offset;
                    if(dataLabel && dataLabel.bind) {
                        dataLabel = this._getBindData(ds, dataLabel.bind);
                    }
                    if(dataValue && dataValue.bind) {
                        dataValue = this._getBindData(ds, dataValue.bind);
                    }
                    if(dataOffset && dataOffset.bind) {
                        dataOffset = this._getBindData(ds, dataOffset.bind);
                    }
                    if(dataLabel && $.isArray(dataLabel) && dataLabel.length && dataValue && $.isArray(dataValue) && dataValue.length) {
                        $.each(dataValue, function (idx, val) {
                            var label, offset = 0;
                            if(idx >= 0 && idx < dataLabel.length) {
                                label = dataLabel[idx];
                            }
                            if(dataOffset && $.isArray(dataValue) && dataOffset.length && idx >= 0 && idx < dataOffset.length) {
                                offset = typeof dataOffset[idx] === 'undefined' ? 0 : dataOffset[idx];
                            }
                            pieData.push({
                                data: val,
                                label: label,
                                offset: offset,
                                legendEntry: true
                            });
                        });
                        series.data = pieData;
                    }
                } else {
                    _super.prototype._bindSeriesData.call(this, ds, series, sharedXList);
                    if(data.x && $.isArray(data.x)) {
                        this.bindXData = true;
                    }
                    $.each([
                        "high", 
                        "low", 
                        "open", 
                        "close", 
                        "y1"
                    ], function (i, name) {
                        var d = data[name];
                        if(d && d.bind) {
                            data[name] = _this._getBindData(ds, d.bind);
                        }
                    });
                }
            };
            wijcompositechart.prototype.getElement = /**
            * Returns the raphael element with the given type and index.
            * @param {string} type The type of the chart element.
            * @param {number} index The index of the element.
            * @param {number} seriesIndex The index of the series.
            * @returns {Raphael Element} Returns the specified raphael object.
            */
            function (type, index, seriesIndex) {
                var element = this.chartElement, fields = element.data("fields"), chartElements = fields.chartElements;
                switch(type) {
                    case "bar":
                    case "column":
                        return chartElements.bars[index];
                    case "line":
                    case "area":
                        return chartElements.paths[index];
                    case "linemarkers":
                        return chartElements.markersSet[index];
                    case "pie":
                        //return chartElements.sectors[index];
                        return this._getPie(chartElements, index, seriesIndex);
                }
                return null;
            };
            wijcompositechart.prototype._getPie = function (chartElements, index, seriesIndex) {
                if(seriesIndex !== undefined) {
                    if(chartElements["sectors" + seriesIndex]) {
                        return chartElements["sectors" + seriesIndex][index];
                    }
                    return null;
                } else {
                    var sectors = [];
                    $.each(chartElements, function (key, val) {
                        if(/sectors/.test(key) && key !== "sectors") {
                            $.each(val, function (i, n) {
                                sectors.push(n);
                            });
                        }
                    });
                    if(sectors.length === 0) {
                        sectors = chartElements.sectors;
                    }
                    return sectors[index];
                }
            };
            wijcompositechart.prototype._paintLegendIcon = function (x, y, width, height, style, legendIndex, seriesIndex, legendCss, series, leg) {
                var self = this, o = this.options, chartType = series.type, icon, dot, legendHeight = 3, isNewIcon = false, type, markerStyle;
                if(chartType === "line" || chartType === "area" || chartType === "spline" || chartType === "bezier") {
                    icon = self.canvas.path(Raphael.format("M{0},{1}L{2},{3}", x, y + height / 2, x + width, y + height / 2));
                    if(style) {
                        if(o.legend.size && o.legend.size.height) {
                            legendHeight = o.legend.size.height;
                        }
                        icon.attr($.extend(true, {
                        }, style, {
                            "stroke-width": legendHeight
                        }));
                    }
                    isNewIcon = true;
                    if(series.markers && series.markers.visible) {
                        type = series.markers.type;
                        markerStyle = series.markerStyle;
                        markerStyle = $.extend({
                            fill: style.stroke,
                            stroke: style.stroke,
                            opacity: 1
                        }, markerStyle);
                        if(style["stroke-dasharray"]) {
                            icon.attr({
                                "stroke-width": //if stroke-width is bigger than 1,
                                //it doesn't look good.
                                1,
                                "stroke-dasharray": style["stroke-dasharray"]
                            });
                        }
                        if(!type) {
                            type = "circle";
                        }
                        dot = this.canvas.paintMarker(type, x + width / 2, y + height / 2, 3);
                        $.wijraphael.addClass($(dot.node), Raphael.format("{0} {1} {2}", o.wijCSS.legend, o.wijCSS.legendDot, o.wijCSS.canvasObject));
                        dot.attr(markerStyle);
                        $(dot.node).data("index", seriesIndex).data("legendIndex", legendIndex);
                        this.legendDots[legendIndex] = dot;
                    }
                } else if(chartType === "scatter") {
                    markerStyle = series.markerStyle;
                    type = series.markerType , markerStyle = $.extend({
                        fill: style.stroke,
                        stroke: style.stroke,
                        opacity: 1
                    }, markerStyle);
                    if(!type) {
                        type = "circle";
                    }
                    icon = self.canvas.paintMarker(type, x + width / 2, y + height / 2, 3);
                    icon.attr(markerStyle);
                    if(series.visible === false) {
                        $(leg.node).data("dotOpacity", icon.attr("opacity") || 1);
                        icon.attr("opacity", 0.3);
                    }
                    isNewIcon = true;
                } else if(chartType === "bubble") {
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
                    icon = self.canvas.paintMarker(type, x + width / 2, y + height / 2, Math.min(width, height) / 2);
                    icon.attr(markerStyle);
                    isNewIcon = true;
                } else {
                    icon = _super.prototype._paintLegendIcon.call(this, x, y, width, height, style, legendIndex, seriesIndex, legendCss, series, leg);
                }
                if(isNewIcon) {
                    $.wijraphael.addClass($(icon.node), legendCss);
                    $(icon.node).data("legendIndex", legendIndex).data("index", seriesIndex);
                    self.legendIcons.push(icon);
                }
                return icon;
            };
            wijcompositechart.prototype._showHideCandlestickSeries = function (seriesEle, type) {
                if(wijcandlestickchartFn) {
                    wijcandlestickchartFn.prototype._showHideSeries.apply(this, arguments);
                }
            };
            wijcompositechart.prototype._showSerieEles = function (seriesEle) {
                var type = seriesEle.type, eles = seriesEle.eles, showLabels = this.options.showChartLabels, dataObj;
                switch(type) {
                    case "pie":
                        if(eles.sector) {
                            eles.sector.show();
                            if(eles.sector.shadow) {
                                eles.sector.shadow.show();
                            }
                            if(eles.sector.tracker) {
                                eles.sector.tracker.show();
                            }
                        }
                        if(eles.label) {
                            eles.label.show();
                        }
                        break;
                    case "line":
                    case "spline":
                    case "bezier":
                    case "area":
                        if(eles.markers) {
                            $.each(eles.markers, function (i, marker) {
                                dataObj = $(marker.node).data("wijchartDataObj");
                                if(dataObj && dataObj.lineSeries && dataObj.lineSeries.markers) {
                                    if(!dataObj.lineSeries.markers.visible) {
                                        return true;
                                    }
                                }
                                marker.show();
                            });
                        }
                        if(eles.dcl) {
                            $.each(eles.dcl, function (i, dcl) {
                                if(showLabels) {
                                    dcl.show();
                                }
                            });
                        }
                        if(eles.path) {
                            dataObj = $(eles.path.node).data("wijchartDataObj");
                            // if markers are invisible and line path is invisible, when click the legend, show the line path.
                            if(dataObj.visible || !(!dataObj.visible && dataObj.markers && dataObj.markers.visible)) {
                                eles.path.show();
                                if(eles.path.shadow) {
                                    eles.path.shadow.show();
                                }
                                if(eles.path.area) {
                                    eles.path.area.show();
                                }
                                if(eles.path.tracker) {
                                    eles.path.tracker.show();
                                }
                                if($(eles.path.node).data("wijchartDataObj") && $(eles.path.node).data("wijchartDataObj").virtualMarkers) {
                                    $.each($(eles.path.node).data("wijchartDataObj").virtualMarkers, function (i, markerObj) {
                                        markerObj.visible = true;
                                    });
                                }
                            }
                        }
                        break;
                    case "bar":
                    case "column":
                        $.each(eles, function (i, bar) {
                            if(bar.bar) {
                                bar.bar.show();
                                if(bar.bar.shadow) {
                                    bar.bar.shadow.show();
                                }
                                if(bar.bar.tracker) {
                                    bar.bar.tracker.show();
                                }
                                if($(bar.bar.node).data("wijchartDataObj")) {
                                    $(bar.bar.node).data("wijchartDataObj").visible = true;
                                }
                            }
                            if(bar.dcl) {
                                bar.dcl.show();
                            }
                            if(bar.animatedBar && !bar.animatedBar.removed) {
                                bar.animatedBar.show();
                            }
                        });
                        break;
                    case "scatter":
                        $.each(eles, function (i, dot) {
                            dot.show();
                            if(dot.label) {
                                dot.label.show();
                            }
                            if($(dot.element).data("wijchartDataObj")) {
                                $(dot.element).data("wijchartDataObj").visible = true;
                            }
                        });
                        break;
                    case "ohlc":
                    case "hl":
                    case "candlestick":
                        this._showHideCandlestickSeries(eles, "show");
                        break;
                    case "bubble":
                        $.each(eles, function (i, bubbleInfo) {
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
                }
            };
            wijcompositechart.prototype._hideSerieEles = function (seriesEle) {
                var type = seriesEle.type, eles = seriesEle.eles;
                switch(type) {
                    case "pie":
                        if(eles.sector) {
                            eles.sector.hide();
                            if(eles.sector.shadow) {
                                eles.sector.shadow.hide();
                            }
                            if(eles.sector.tracker) {
                                eles.sector.tracker.hide();
                            }
                        }
                        if(eles.label) {
                            eles.label.hide();
                        }
                        break;
                    case "line":
                    case "spline":
                    case "bezier":
                    case "area":
                        if(eles.markers) {
                            $.each(eles.markers, function (i, marker) {
                                marker.hide();
                            });
                        }
                        if(eles.dcl) {
                            $.each(eles.dcl, function (i, dcl) {
                                dcl.hide();
                            });
                        }
                        if(eles.path) {
                            eles.path.hide();
                            if(eles.path.shadow) {
                                eles.path.shadow.hide();
                            }
                            if(eles.path.area) {
                                eles.path.area.hide();
                            }
                            if(eles.path.tracker) {
                                eles.path.tracker.hide();
                            }
                            if($(eles.path.node).data("wijchartDataObj") && $(eles.path.node).data("wijchartDataObj").virtualMarkers) {
                                $.each($(eles.path.node).data("wijchartDataObj").virtualMarkers, function (i, markerObj) {
                                    markerObj.visible = false;
                                });
                            }
                        }
                        break;
                    case "bar":
                    case "column":
                        $.each(eles, function (i, bar) {
                            if(bar.bar) {
                                bar.bar.hide();
                                if(bar.bar.shadow) {
                                    bar.bar.shadow.hide();
                                }
                                if(bar.bar.tracker) {
                                    bar.bar.tracker.hide();
                                }
                                if($(bar.bar.node).data("wijchartDataObj")) {
                                    $(bar.bar.node).data("wijchartDataObj").visible = false;
                                }
                            }
                            if(bar.dcl) {
                                bar.dcl.hide();
                            }
                            if(bar.animatedBar && !bar.animatedBar.removed) {
                                bar.animatedBar.hide();
                            }
                        });
                        break;
                    case "scatter":
                        $.each(eles, function (i, dot) {
                            dot.hide();
                            if(dot.label) {
                                dot.label.hide();
                            }
                            if($(dot.element).data("wijchartDataObj")) {
                                $(dot.element).data("wijchartDataObj").visible = false;
                            }
                        });
                        break;
                    case "ohlc":
                    case "hl":
                    case "candlestick":
                        this._showHideCandlestickSeries(eles, "hide");
                        break;
                    case "bubble":
                        $.each(eles, function (i, bubbleInfo) {
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
                        break;
                }
            };
            wijcompositechart.prototype._indicatorLineShowing = function (objs) {
                var type;
                _super.prototype._indicatorLineShowing.call(this, objs);
                $.each(objs, function (i, obj) {
                    type = obj.type;
                    if(type === "column" || type === "bar") {
                        obj.bar.attr(obj.hoverStyle);
                    } else if(type === "marker") {
                        obj.marker.attr(obj.markerHoverStyle);
                    } else if(type === "scatter") {
                        obj.dot.attr(obj.hoverStyle);
                        obj.dot.scale(1.5, 1.5);
                    }
                });
            };
            wijcompositechart.prototype._removeIndicatorStyles = function (objs) {
                var type;
                $.each(objs, function (i, obj) {
                    type = obj.type;
                    if(type === "column" || type === "bar") {
                        obj.bar.attr(obj.style);
                    } else if(type === "marker") {
                        obj.marker.attr(obj.markerStyle);
                        obj.marker.transform("s1");
                    } else if(type === "scatter") {
                        obj.dot.attr(obj.style);
                        obj.dot.scale(1, 1);
                    }
                });
            };
            wijcompositechart.prototype._paintTooltip = function () {
                var self = this, element = self.chartElement, fields = element.data("fields") || {
                }, ctracers = fields.ctracers || [];
                _super.prototype._paintTooltip.call(this);
                if(self.tooltip) {
                    $.each(ctracers, function (idx, ctracer) {
                        if(ctracer.trackers && ctracer.trackers.length) {
                            if(idx === 0) {
                                self.tooltip.setOptions({
                                    relatedElement: ctracer.trackers[0]
                                });
                            }
                        }
                    });
                }
            };
            wijcompositechart.prototype._setDefaultTooltipText = function (data) {
                if(data.type === "candlestick" && wijcandlestickchartFn) {
                    return wijcandlestickchartFn.prototype._setDefaultTooltipText.apply(this, arguments);
                }
                return _super.prototype._setDefaultTooltipText.call(this, data);
            };
            wijcompositechart.prototype._checkChartType = function () {
                var _this = this;
                this.isContainsBubble = false;
                this.isContainsCandlestick = false;
                $.each(this.options.seriesList, function (i, series) {
                    var type = series.type;
                    if(!_this.isContainsCandlestick && (type === "ohlc" || type === "hl" || type === "candlestick")) {
                        _this.isContainsCandlestick = true;
                    } else if(!_this.isContainsBubble && type === "bubble") {
                        _this.isContainsBubble = true;
                    }
                });
            };
            wijcompositechart.prototype._handleXDataForCandlestick = function () {
                if(wijcandlestickchartFn) {
                    wijcandlestickchartFn.prototype._handleXData.apply(this, arguments);
                }
            };
            wijcompositechart.prototype._isCandlestickSeries = function (series) {
                var type = series.type;
                return type === "ohlc" || type === "hl" || type === "candlestick";
            };
            wijcompositechart.prototype._paintChartArea = function () {
                var self = this, seriesList = self.options.seriesList;
                if(self._isSeriesListDataEmpty()) {
                    return;
                }
                // add the hl to data.y
                $.each(seriesList, function (i, n) {
                    var data = n.data;
                    if(self._isCandlestickSeries(n)) {
                        data.y = [].concat(data.high).concat(data.low);
                    }
                });
                if(this.bubbleAxisAdjust) {
                    this.bubbleAxisAdjust.dispose();
                }
                this.bubbleAxisAdjust = new chart.BubbleAxisAdjust(this);
                _super.prototype._paintChartArea.call(this);
                // delete data.y
                $.each(seriesList, function (i, n) {
                    if(self._isCandlestickSeries(n)) {
                        delete n.data.y;
                    }
                });
            };
            wijcompositechart.prototype._checkSeriesDataEmpty = function (series) {
                var type = series.type, data = series.data, checkEmptyData = this._checkEmptyData;
                if(this._isCandlestickSeries(series)) {
                    if(!data || checkEmptyData(data.x) || checkEmptyData(data.high) || checkEmptyData(data.low)) {
                        return true;
                    }
                    if(type === "ohlc" || type === "candlestick") {
                        if(checkEmptyData(data.open) || checkEmptyData(data.low)) {
                            return true;
                        }
                    }
                    return false;
                } else if(type === "pie") {
                    if(!data || !$.isArray(data)) {
                        return true;
                    }
                    return false;
                } else {
                    if(type === "bubble") {
                        if(!data || checkEmptyData(data.y1)) {
                            return true;
                        }
                    }
                    return _super.prototype._checkSeriesDataEmpty.call(this, series);
                }
            };
            wijcompositechart.prototype._calculateMajorMinor = function (axisOptions, axisInfo) {
                if(this.isContainsCandlestick && axisInfo.id === "x") {
                    wijcandlestickchartFn.prototype._calculateMajorMinor.apply(this, arguments);
                } else {
                    _super.prototype._calculateMajorMinor.call(this, axisOptions, axisInfo);
                }
            };
            wijcompositechart.prototype._getXTickText = function (text) {
                //return text;
                                var self = this, formatString = self.formatString;
                if(self.isContainsCandlestick && wijcandlestickchartFn) {
                    return wijcandlestickchartFn.prototype._getXTickText.apply(this, arguments);
                }
                return text;
            };
            wijcompositechart.prototype._adjustTickValuesForCandlestickChart = function (tickValues) {
                if(this.isContainsCandlestick && wijcandlestickchartFn) {
                    return wijcandlestickchartFn.prototype._adjustTickValuesForCandlestickChart.apply(this, arguments);
                } else {
                    return _super.prototype._adjustTickValuesForCandlestickChart.call(this, tickValues);
                }
            };
            wijcompositechart.prototype._getTickTextForCalculateUnit = function (value, axisInfo, prec) {
                if(axisInfo.id === "x" && this.isContainsCandlestick) {
                    return wijcandlestickchartFn.prototype._getTickTextForCalculateUnit.apply(this, arguments);
                }
                return _super.prototype._getTickTextForCalculateUnit.call(this, value, axisInfo, prec);
            };
            wijcompositechart.prototype._AdjustAxisBounds = function (axisInfo, axisOptions) {
                var self = this, o = self.options, mx, mn, sizeMax, sizeMin, maxData = axisInfo.max, minData = axisInfo.min, dx = maxData - minData, prec = chart.ChartDataUtil.nicePrecision(dx), _prec = prec + 1, bounds = axisInfo.bounds, textStyle = $.extend(true, {
                }, o.textStyle, axisOptions.textStyle, axisOptions.labels.style);
                mx = self._text(-1000, -1000, $.round(maxData, _prec).toString()).attr(textStyle);
                mn = self._text(-1000, -1000, $.round(minData, _prec).toString()).attr(textStyle);
                sizeMax = mx.wijGetBBox();
                sizeMin = mn.wijGetBBox();
                if(!axisInfo.isStartAxis) {
                    bounds.startY += sizeMin.height;
                }
                if(!axisInfo.isLastAxis) {
                    bounds.endY -= (sizeMax.height);
                }
            };
            wijcompositechart.prototype._initYAxisHeight = function () {
                var self = this, o = self.options, axisOpt = o.axis, yaxisOpt = axisOpt.y, bounds = self.canvasBounds, width = bounds.endX - bounds.startX, height = bounds.endY - bounds.startY, axisInfo = self.axisInfo, yAxisInfo = axisInfo.y, othersHeight = 0, autoHeightIndex = -1, totalHeight = 0, lastBounds;
                if($.isArray(yaxisOpt)) {
                    $.each(yaxisOpt, function (i, axisOpt) {
                        if(axisOpt.height && !isNaN(axisOpt.height)) {
                            othersHeight += axisOpt.height;
                        } else if(axisOpt.height === "auto") {
                            autoHeightIndex = i;
                        }
                        yAxisInfo[i].height = axisOpt.height;
                    });
                    if(autoHeightIndex > -1) {
                        yAxisInfo[autoHeightIndex].height = height - othersHeight;
                    }
                    $.each(yAxisInfo, function (i, axis) {
                        var yHeight = axis.height;
                        if(yHeight === undefined) {
                            return true;
                        }
                        if(yHeight > 0) {
                            axis.isPartAxis = true;
                            axis.isLastAxis = (parseInt(i) === yaxisOpt.length - 1);
                            axis.isStartAxis = parseInt(i) === 0;
                        }
                        if(!lastBounds) {
                            axis.bounds = {
                                startY: bounds.startY,
                                endY: bounds.startY + yHeight
                            };
                        } else {
                            axis.bounds = {
                                startY: lastBounds.endY,
                                endY: lastBounds.endY + yHeight
                            };
                        }
                        axis.bounds.startX = bounds.startX;
                        axis.bounds.endX = bounds.endX;
                        self._AdjustAxisBounds(axis, yaxisOpt[i]);
                        if(axis.bounds) {
                            lastBounds = $.extend({
                            }, axis.bounds);
                        }
                    });
                }
            };
            wijcompositechart.prototype._getDataExtreme = function (isMultiYAxis) {
                var self = this;
                self._initYAxisHeight();
                return _super.prototype._getDataExtreme.call(this, isMultiYAxis);
            };
            wijcompositechart.prototype._paintPlotArea = function () {
                var self = this, o = self.options, seriesList = "seriesList", seriesStyles = "seriesStyles", seriesHoverStyles = "seriesHoverStyles", styles = o[seriesStyles], hoverStyles = o[seriesHoverStyles], bounds = self.canvasBounds, charts = {
                }, index = 0, pSIndex = -1, seriesIndexs = [], isMulityYAxis = $.isArray(o.axis.y), options = {
                    canvas: self.canvas,
                    tooltip: self.tooltip,
                    bounds: bounds,
                    widgetName: self.widgetName,
                    seriesTransition: o.seriesTransition,
                    showChartLabels: o.showChartLabels,
                    textStyle: o.textStyle,
                    chartLabelStyle: o.chartLabelStyle,
                    chartLabelFormatString: o.chartLabelFormatString,
                    shadow: o.shadow,
                    hint: o.hint,
                    animation: o.animation,
                    disabled: o.disabled,
                    culture: self._getCulture(),
                    widget: this,
                    wijCSS: o.wijCSS,
                    mouseDown: function (e, args) {
                        self._trigger("mouseDown", e, args);
                    },
                    mouseUp: function (e, args) {
                        self._trigger("mouseUp", e, args);
                    },
                    mouseOver: function (e, args) {
                        self._trigger("mouseOver", e, args);
                    },
                    mouseOut: function (e, args) {
                        self._trigger("mouseOut", e, args);
                    },
                    mouseMove: function (e, args) {
                        self._trigger("mouseMove", e, args);
                    },
                    click: function (e, args) {
                        self._trigger("click", e, args);
                    }
                }, fields = self.chartElement.data("fields"), tmpOptions, chartgroup, _chartRender;
                if(fields) {
                    fields.ctracers = [];
                }
                $.each(o[seriesList], function (i, series) {
                    var type = series.type, chart = {
                    }, chartType = type, pie = {
                    }, style = $.extend({
                    }, styles[index]), hoverStyle = $.extend({
                    }, hoverStyles[index]), yAxis = series.yAxis;
                    if(!type || type.length === 0) {
                        return true;
                    }
                    if(chartType === "spline" || chartType === "bezier") {
                        chartType = "line";
                    }
                    chart = charts[chartType];
                    if(!chart) {
                        if(type === "pie") {
                            chart = [];
                        } else {
                            chart = {
                            };
                        }
                        charts[chartType] = chart;
                        if(series.hint) {
                            chart.hint = series.hint;
                            if(!o.hint.content) {
                                o.hint.content = series.hint.content;
                            }
                            if(!o.hint.title) {
                                o.hint.title = series.hint.title;
                            }
                        }
                    }
                    if(type === "pie") {
                        $.each(series.data, function (j, data) {
                            style = $.extend({
                            }, styles[index]);
                            hoverStyle = $.extend({
                            }, hoverStyles[index]);
                            if(!pie[seriesList]) {
                                pie[seriesList] = [];
                            }
                            if(!pie[seriesStyles]) {
                                pie[seriesStyles] = [];
                            }
                            if(!pie[seriesHoverStyles]) {
                                pie[seriesHoverStyles] = [];
                            }
                            data.pieID = i + 1;
                            pie[seriesList].push(data);
                            pie[seriesStyles].push(style);
                            pie[seriesHoverStyles].push(hoverStyle);
                            // save the index of the seriesIndex for legend click.
                            if(pSIndex === -1) {
                                pSIndex = index;
                            }
                            index++;
                        });
                        pie.sIndex = pSIndex;
                        pie.radius = series.radius;
                        pie.center = series.center;
                        pie.label = series.label;
                        pSIndex = -1;
                        chart.push(pie);
                        return true;
                    } else if(type === "column") {
                        chart.horizontal = false;
                    } else if(type === "bar") {
                        chart.horizontal = true;
                    } else if(type === "spline") {
                        series.fitType = "spline";
                    } else if(type === "bezier") {
                        series.fitType = "bezier";
                    }
                    if(isMulityYAxis) {
                        chart.yAxis = yAxis || 0;
                    }
                    if(type === "line" || type === "spline" || type === "bezier") {
                        delete style.fill;
                        delete hoverStyle.fill;
                    }
                    if(!chart[seriesList]) {
                        chart[seriesList] = [];
                    }
                    if(!chart[seriesStyles]) {
                        chart[seriesStyles] = [];
                    }
                    if(!chart[seriesHoverStyles]) {
                        chart[seriesHoverStyles] = [];
                    }
                    if(type === "scatter") {
                        chart.showChartLabels = o.showChartLabels;
                        if(series.showChartLabels !== undefined) {
                            chart.showChartLabels = series.showChartLabels;
                        }
                    }
                    series.sIndex = index;
                    chart[seriesList].push(series);
                    chart[seriesStyles].push(style);
                    chart[seriesHoverStyles].push(hoverStyle);
                    index++;
                });
                $.each(charts, function (type, chart) {
                    var chartModule = wijmo.chart;
                    var yAxisIndex = chart.yAxis, chartLabel = o.chartLabel;
                    if(yAxisIndex !== undefined && self.axisInfo.y[yAxisIndex].bounds) {
                        options.bounds = self.axisInfo.y[yAxisIndex].bounds;
                    }
                    switch(type) {
                        case "pie":
                            var pSIndex;
                            $.each(chart, function (idx, pie) {
                                var center = pie.center, r = // fixed the issue 39375, if radius is not set, the default value should be 50 as early versions.
                                pie.radius || 50, pieBounds, width = bounds.endX - bounds.startX, height = bounds.endY - bounds.startY;
                                if(width < 2 * r) {
                                    r = width / 2;
                                }
                                if(height < 2 * r) {
                                    r = height / 2;
                                }
                                pie.radius = r;
                                pieBounds = center ? {
                                    startX: center.x - r,
                                    startY: center.y - r,
                                    endX: center.x + r,
                                    endY: center.y + r
                                } : {
                                    startX: bounds.startX + width / 2 - r,
                                    startY: bounds.startY + height / 2 - r,
                                    endX: bounds.startX + 2 * r,
                                    endY: bounds.startY + 2 * r
                                };
                                tmpOptions = $.extend(true, {
                                }, options, {
                                    bounds: pieBounds,
                                    radius: r,
                                    isTouchBehaviorEnable: false
                                }, pie);
                                _chartRender = new chartModule.PieChartRender(self.chartElement, tmpOptions);
                                _chartRender.render();
                                self.chartElement.data("fields").aniSectorAttrs = null;
                                self.chartElement.data("fields").aniLabelAttrs = null;
                                self._savechartData(type, pie.sIndex);
                            });
                            break;
                        case "bar":
                        case "column":
                            tmpOptions = $.extend(true, {
                            }, options, {
                                stacked: o.stacked,
                                axis: o.axis,
                                clusterOverlap: o.clusterOverlap,
                                clusterWidth: o.clusterWidth,
                                clusterSpacing: o.clusterSpacing,
                                is100Percent: o.is100Percent,
                                clusterRadius: o.clusterRadius,
                                isYTime: self.axisInfo.y[0].isTime,
                                isXTime: self.axisInfo.x.isTime,
                                yAxisInfo: self.axisInfo.y,
                                yAxisIndex: yAxisIndex
                            }, chart);
                            _chartRender = new chartModule.BarChartRender(self.chartElement, tmpOptions);
                            _chartRender.render();
                            seriesIndexs = [];
                            $.each(chart.seriesList, function (i, sl) {
                                seriesIndexs.push(sl.sIndex);
                            });
                            self._savechartData(type, seriesIndexs);
                            break;
                        case "line":
                        case "spline":
                        case "bezier":
                        case "area":
                            chartgroup = self._getyAxisGroup(chart);
                            if(!self.aniPathsAttr) {
                                self.aniPathsAttr = {
                                };
                            }
                            $.each(chartgroup, function (ykey, subchart) {
                                if(!self.aniPathsAttr[type]) {
                                    self.aniPathsAttr[type] = [];
                                }
                                tmpOptions = $.extend(true, {
                                }, options, {
                                    axis: o.axis,
                                    isXTime: self.axisInfo.x.isTime,
                                    isYTime: self.axisInfo.y[0].isTime,
                                    type: //aniPathsAttr: self.aniPathsAttr,
                                    //chartLabelEles: self.chartLabelEles,
                                    type === "area" ? "area" : "line",
                                    hole: o.hole
                                }, subchart);
                                tmpOptions.aniPathsAttr = self.aniPathsAttr[type];
                                tmpOptions.chartLabelEles = self.chartLabelEles;
                                tmpOptions.axis.y = o.axis.y[ykey] || o.axis.y;
                                tmpOptions.extremeValue = {
                                    txx: self.extremeValue.txx,
                                    txn: self.extremeValue.txn,
                                    tyx: self.extremeValue.y[ykey].tyx,
                                    tyn: self.extremeValue.y[ykey].tyn
                                };
                                _chartRender = new chartModule.LineChartRender(self.chartElement, tmpOptions);
                                _chartRender.render();
                                seriesIndexs = [];
                                $.each(subchart.seriesList, function (i, sl) {
                                    seriesIndexs.push(sl.sIndex);
                                });
                                self._savechartData(type, seriesIndexs, true);
                            });
                            break;
                        case "scatter":
                            chartgroup = self._getyAxisGroup(chart);
                            $.each(chartgroup, function (ykey, subchart) {
                                tmpOptions = $.extend(true, {
                                }, options, {
                                    axis: o.axis,
                                    isXTime: self.axisInfo.x.isTime,
                                    isYTime: self.axisInfo.y[0].isTime,
                                    zoomOnHover: o.zoomOnHover
                                }, subchart);
                                tmpOptions.axis.y = o.axis.y[ykey] || o.axis.y;
                                _chartRender = new chartModule.ScatterChartRender(self.chartElement, tmpOptions);
                                _chartRender.render();
                                seriesIndexs = [];
                                $.each(subchart.seriesList, function (i, sl) {
                                    seriesIndexs.push(sl.sIndex);
                                });
                                self._savechartData(type, seriesIndexs);
                            });
                            break;
                        case "ohlc":
                        case "hl":
                        case "candlestick":
                            chartgroup = self._getyAxisGroup(chart);
                            $.each(chartgroup, function (ykey, subchart) {
                                tmpOptions = $.extend(true, {
                                }, options, {
                                    axis: o.axis,
                                    timeUtil: self.timeUtil,
                                    type: type
                                }, subchart);
                                tmpOptions.axis.y = o.axis.y[ykey] || o.axis.y;
                                // extend the styles.
                                $.each(tmpOptions.seriesStyles, function (i, seriesStyle) {
                                    wijcandlestickchartFn.prototype._setDefaultFill(type, seriesStyle);
                                });
                                _chartRender = new chartModule.CandlestickChartRender(self.chartElement, tmpOptions);
                                _chartRender.render();
                                seriesIndexs = [];
                                $.each(subchart.seriesList, function (i, sl) {
                                    seriesIndexs.push(sl.sIndex);
                                });
                                self._savechartData(type, seriesIndexs);
                            });
                            break;
                        case "bubble":
                            chartgroup = self._getyAxisGroup(chart);
                            if(!chartLabel) {
                                chartLabel = {
                                    visible: o.showChartLabels,
                                    style: o.chartLabelStyle
                                };
                            }
                            $.each(chartgroup, function (ykey, subchart) {
                                tmpOptions = $.extend(true, {
                                }, options, {
                                    axis: o.axis,
                                    isXTime: self.axisInfo.x.isTime,
                                    isYTime: self.axisInfo.y[0].isTime,
                                    xAxisInfo: self.axisInfo.x,
                                    yAxisInfo: self.axisInfo.y,
                                    chartLabel: chartLabel,
                                    minimumSize: o.minimumSize || 5,
                                    maximumSize: o.maximumSize || 20,
                                    sizingMethod: o.sizingMethod || "diameter",
                                    bubbleRadius: self.bubbleAxisAdjust.bubbleRadius
                                }, subchart);
                                tmpOptions.axis.y = o.axis.y[ykey] || o.axis.y;
                                tmpOptions.yAxisInfo = self.axisInfo.y[ykey] || self.axisInfo.y[0];
                                _chartRender = new chartModule.BubbleChartRender(self.chartElement, tmpOptions);
                                _chartRender.render();
                                seriesIndexs = [];
                                $.each(subchart.seriesList, function (i, sl) {
                                    seriesIndexs.push(sl.sIndex);
                                });
                                self._savechartData(type, seriesIndexs);
                            });
                            break;
                            break;
                    }
                });
                self.chartElement.data("fields").seriesEles = null;
                self._bindtooltip();
            };
            wijcompositechart.prototype._savechartData = function (type, sIndex, notrackers) {
                var self = this, fields = self.chartElement.data("fields"), seriesEles = fields.seriesEles, allElements = fields.allElements || {
                }, ctracers, index = sIndex;
                if($.isArray(index)) {
                    index = 0;
                }
                $.each(seriesEles, function (i, ele) {
                    // fixed the issue for legend click.
                    if($.isArray(sIndex)) {
                        self.seriesEles[sIndex[index]] = {
                            eles: ele,
                            type: type
                        };
                        index++;
                    } else {
                        self.seriesEles[index] = {
                            eles: ele,
                            type: type
                        };
                        index++;
                    }
                    //self.seriesEles.push({ eles: ele, type: type });
                                    });
                if(notrackers) {
                    //fields.ctracers = [];
                                    } else {
                    ctracers = fields.ctracers || [];
                    ctracers.push({
                        trackers: fields.trackers,
                        type: type
                    });
                    fields.ctracers = ctracers;
                }
                if(fields && fields.chartElements) {
                    $.each(fields.chartElements, function (key, eles) {
                        self._copyElements(allElements, key, eles);
                    });
                }
                fields.allElements = allElements;
            };
            wijcompositechart.prototype._copyElements = function (target, key, source) {
                var tar;
                if(source && $.isArray(source)) {
                    tar = target[key] || [];
                    target[key] = tar.concat(source);
                } else if(source) {
                    tar = target[key] || [];
                    tar.concat([
                        source
                    ]);
                }
            };
            wijcompositechart.prototype._getyAxisGroup = function (chart) {
                var group = {
                };
                $.each(chart.seriesList, function (idx, series) {
                    var yAxis = series.yAxis || 0;
                    if(!group[yAxis]) {
                        group[yAxis] = {
                            seriesList: [],
                            seriesStyles: [],
                            seriesHoverStyles: []
                        };
                    }
                    group[yAxis].seriesList.push(series);
                    group[yAxis].seriesStyles.push(chart.seriesStyles[idx]);
                    group[yAxis].seriesHoverStyles.push(chart.seriesHoverStyles[idx]);
                });
                return group;
            };
            wijcompositechart.prototype._bindtooltip = function () {
                var self = this, namespace = self.widgetName, fields = self.chartElement.data("fields");
                if(fields && fields.ctracers) {
                    $.each(fields.ctracers, function (index, ctracer) {
                        var type = ctracer.type;
                        if(ctracer.trackers) {
                            ctracer.trackers.toFront();
                        }
                    });
                }
                self.chartElement.delegate(".linetracker, .wijchart-canvas-marker, .bartracker, .pietracker, .wijscatterchart, .bubbletracker, .candlesticktracker", "mouseover." + namespace, $.proxy(self._tooltipMouseOver, self));
                self.chartElement.delegate(".linetracker, .wijchart-canvas-marker, .bartracker, .pietracker, .wijscatterchart, .bubbletracker, .candlesticktracker", "mouseout." + namespace, $.proxy(self._tooltipMouseOut, self));
                self.chartElement.delegate(".linetracker, .wijchart-canvas-marker, .bartracker, .pietracker, .wijscatterchart, .bubbletracker, .candlesticktracker", "mousemove." + namespace, $.proxy(self._tooltipMouseMove, self));
            };
            wijcompositechart.prototype._tooltipMouseOver = function (e) {
                var target = e.target, self = this, tooltip = self.tooltip, hint = self.options.hint, op = null, title = hint.title, content = hint.content, hintStyle = hint.style, isTitleFunc = $.isFunction(title), isContentFunc = $.isFunction(content), data, bbox, position, raphaelObj;
                position = $(self.canvas.canvas.parentNode).offset();
                if(self.indicatorLine) {
                    return;
                }
                if($(target).data("owner")) {
                    target = $(target).data("owner");
                }
                target = $(target);
                data = target.data("wijchartDataObj");
                if(self.tooltip) {
                    op = tooltip.getOptions();
                    if(isTitleFunc || isContentFunc) {
                        if(isTitleFunc) {
                            op.title = $.proxy(title, data);
                        }
                        if(isContentFunc) {
                            op.content = $.proxy(content, data);
                        }
                    }
                    if(data.type === "line" || data.type === "marker") {
                        if(data.type === "marker") {
                            data = data.lineSeries;
                        }
                        if(data.path.removed) {
                            return;
                        }
                        if(self.hoverLine !== data || self.hoverLine === null) {
                            self.isNewLine = true;
                            if(self.hoverLine) {
                                if(!self.hoverLine.path.removed) {
                                    self.hoverLine.path.wijAttr(self.hoverLine.lineStyle);
                                    if(self.hoverPoint && !self.hoverPoint.isSymbol) {
                                        self.hoverPoint.marker.wijAttr(self.hoverPoint.markerStyle);
                                        self.hoverPoint.marker.transform("s1");
                                    }
                                }
                            }
                            if(data.lineHoverStyle) {
                                data.path.wijAttr(data.lineHoverStyle);
                            }
                            self.hoverLine = data;
                            self.hoverPoint = null;
                            self.hoverVirtualPoint = null;
                        }
                    } else if(data.type === "scatter" || hint.relativeTo === "element") {
                        self._clearHoverState();
                        if(data.type === "scatter") {
                            bbox = data.dot.getBBox();
                        } else // fixed an issue that when the hint's relativeTo is "element",
                        // the tooltip will shows with the mouse.
                        if(target[0] && target[0].raphael && target[0].raphaelid) {
                            raphaelObj = self.canvas.getById(target[0].raphaelid);
                            if(raphaelObj) {
                                bbox = raphaelObj.getBBox();
                            }
                        }
                        op.style.stroke = hintStyle.stroke || target.attr("stroke");
                        if(bbox) {
                            self.tooltip.showAt({
                                x: bbox.x + bbox.width / 2,
                                y: bbox.y
                            }, e);
                        }
                    } else {
                        self._clearHoverState();
                        op.style.stroke = hintStyle.stroke || target.attr("stroke");
                        self.tooltip.showAt({
                            x: e.pageX - position.left,
                            y: e.pageY - position.top
                        }, e);
                    }
                }
            };
            wijcompositechart.prototype._tooltipMouseMove = function (e) {
                var self = this, target = e.target, data, hint = self.options.hint, position = $(self.canvas.canvas.parentNode).offset();
                if($(target).data("owner")) {
                    target = $(target).data("owner");
                }
                target = $(target);
                data = target.data("wijchartDataObj");
                if(self.tooltip && !this.indicatorLine) {
                    if(data.type !== "line" && data.type !== "marker" && data.type !== "scatter" && hint.relativeTo !== "element") {
                        self.tooltip.showAt({
                            x: e.pageX - position.left,
                            y: e.pageY - position.top
                        }, e);
                    }
                }
            };
            wijcompositechart.prototype._tooltipMouseOut = function (e) {
                var self = this, target = e.target, data;
                if($(target).data("owner")) {
                    target = $(target).data("owner");
                }
                target = $(target);
                data = target.data("wijchartDataObj");
                if(data.type !== "line" && data.type !== "marker" && !self.indicatorLine) {
                    if(self.tooltip) {
                        self.tooltip.hide();
                    }
                }
            };
            wijcompositechart.prototype._mouseMoveInsidePlotArea = function (e, mousePos) {
                var self = this, tooltip = self.tooltip, hint = self.options.hint, markers, virtualMarkers, idx = 0, p, point, valueX, valueY, s = null, dataObj = null, op = null, title = hint.title, content = hint.content, isTitleFunc = $.isFunction(title), isContentFunc = $.isFunction(content), distance = 0, hoverLine;
                if(tooltip) {
                    op = tooltip.getOptions();
                }
                if(self.hoverLine && !self.indicatorLine) {
                    hoverLine = self.hoverLine;
                    if(self.isNewLine) {
                        if(hint.enable && tooltip) {
                            tooltip.hide();
                        }
                        self.isNewLine = false;
                    }
                    markers = hoverLine.lineMarkers;
                    virtualMarkers = hoverLine.virtualMarkers;
                    idx = -1;
                    p = {
                        x: 0,
                        y: 0
                    };
                    if(markers && markers.length) {
                        $.each(markers, function (i, marker) {
                            if(marker.removed) {
                                return true;
                            }
                            var box = marker.wijGetBBox(), pos = box.x + box.width / 2, dis = Math.abs(pos - mousePos.left);
                            if(i === 0 || dis < distance) {
                                distance = dis;
                                idx = i;
                                p = {
                                    x: pos,
                                    y: box.y + box.height / 2
                                };
                            }
                        });
                        if(self.hoverPoint && self.hoverPoint.index === idx) {
                            return;
                        }
                        if(idx > -1) {
                            if(markers[idx].removed) {
                                return;
                            }
                            point = $(markers[idx].node).data("wijchartDataObj");
                            if(point) {
                                if(self.hoverPoint && !self.hoverPoint.isSymbol) {
                                    if(!self.hoverPoint.removed) {
                                        self.hoverPoint.marker.wijAttr(self.hoverPoint.markerStyle);
                                        self.hoverPoint.marker.transform("s1");
                                    }
                                }
                                if(!point.isSymbol) {
                                    if(!point.marker.removed) {
                                        point.marker.wijAttr(point.markerHoverStyle);
                                    }
                                }
                            }
                            self.hoverPoint = point;
                            self.hoverVirtualPoint = virtualMarkers[idx];
                        }
                    } else {
                        $.each(virtualMarkers, function (i, marker) {
                            var dis = Math.abs(marker.x - mousePos.left);
                            if(i === 0 || dis < distance) {
                                distance = dis;
                                idx = i;
                                p = {
                                    x: marker.x,
                                    y: marker.y
                                };
                            }
                        });
                        if(self.hoverVirtualPoint && self.hoverVirtualPoint.index === idx) {
                            return;
                        }
                        if(idx > -1) {
                            self.hoverPoint = null;
                            self.hoverVirtualPoint = virtualMarkers[idx];
                        }
                    }
                    if(tooltip) {
                        dataObj = self.hoverVirtualPoint;
                        valueX = dataObj.valX;
                        valueY = dataObj.valY;
                        //dataObj = self.hoverPoint;
                        //valueX = dataObj.valX;
                        //valueY = dataObj.valY;
                        if(isTitleFunc || isContentFunc) {
                            if(isTitleFunc) {
                                op.title = function () {
                                    var obj = {
                                        pointIndex: idx,
                                        lineIndex: //lineIndex: dataObj.lineSeries.index,
                                        hoverLine.index,
                                        x: valueX,
                                        y: valueY,
                                        label: //label: dataObj.lineSeries.label,
                                        hoverLine.label,
                                        data: dataObj,
                                        fmt: title
                                    }, fmt = $.proxy(obj.fmt, obj), tit = fmt();
                                    return tit;
                                };
                            }
                            if(isContentFunc) {
                                op.content = function () {
                                    var obj = {
                                        pointIndex: idx,
                                        lineIndex: //lineIndex: dataObj.lineSeries.index,
                                        hoverLine.index,
                                        x: valueX,
                                        y: valueY,
                                        label: //label: dataObj.lineSeries.label,
                                        hoverLine.label,
                                        data: dataObj,
                                        fmt: content
                                    }, fmt = $.proxy(obj.fmt, obj), con = fmt();
                                    return con;
                                };
                            }
                        }
                        s = $.extend({
                            stroke: hoverLine.path.attr("stroke")
                        }, hint.style);
                        op.style.stroke = s.stroke;
                        tooltip.showAt(p);
                    }
                }
                _super.prototype._mouseMoveInsidePlotArea.call(this, e, mousePos);
            };
            wijcompositechart.prototype._mouseDownInsidePlotArea = function (e, mousePos) {
                _super.prototype._mouseDownInsidePlotArea.call(this, e, mousePos);
                this._clearHoverState(true);
            };
            wijcompositechart.prototype._mouseMoveOutsidePlotArea = function (e, mousePos) {
                var self = this;
                self._clearHoverState();
                _super.prototype._mouseMoveOutsidePlotArea.call(this, e, mousePos);
            };
            wijcompositechart.prototype._clearHoverState = function (keepTooltip) {
                var self = this, tooltip = self.tooltip, hint = self.options.hint;
                if(self.hoverLine) {
                    if(hint.enable && tooltip && !keepTooltip) {
                        tooltip.hide();
                    }
                    if(!self.hoverLine.path.removed) {
                        self.hoverLine.path.wijAttr(self.hoverLine.lineStyle);
                        if(self.hoverPoint && !self.hoverPoint.isSymbol) {
                            self.hoverPoint.marker.wijAttr(self.hoverPoint.markerStyle);
                            //hoverPoint.marker.scale(1, 1);
                            self.hoverPoint.marker.transform("s1");
                        }
                    }
                }
                self.hoverLine = null;
                self.hoverPoint = null;
                self.hoverVirtualPoint = null;
            };
            wijcompositechart.prototype._getTooltipText = function (fmt, target) {
                return "";
            };
            wijcompositechart.prototype._calculateParameters = function (axisInfo, options) {
                var self = this, hasBarType = false, minor, maxAdj = 0, minAdj = 0, bubbleAdj, max = axisInfo.max, min = axisInfo.min;
                _super.prototype._calculateParameters.call(this, axisInfo, options);
                // in chartcore, it will according the number value to calculate value, the value may less than the value which is adjusted in bubble.
                // So here to reset the value.
                axisInfo.max = Math.max(max, axisInfo.max);
                if(min !== 0) {
                    axisInfo.min = Math.min(min, axisInfo.min);
                }
                $.each(self.options.seriesList, function (idx, series) {
                    if(series.type === "column" || series.type === "bar") {
                        hasBarType = true;
                        return false;
                    }
                });
                // check for bar chart and x axis expansion
                if(axisInfo.id === "x") {
                    minor = options.unitMinor;
                    if(hasBarType) {
                        maxAdj = minAdj = Math.max(maxAdj, self._getBarAdjustment(axisInfo, minor));
                    }
                    if(self.isContainsCandlestick && wijcandlestickchartFn) {
                        maxAdj = minAdj = Math.max(maxAdj, wijcandlestickchartFn.prototype._getCandlestickAdjustment.apply(this, [
                            axisInfo, 
                            minor
                        ]));
                    }
                }
                if(self.isContainsBubble && $.wijmo.wijbubblechart) {
                    bubbleAdj = this.bubbleAxisAdjust.getAdjust(axisInfo, options);
                    maxAdj = Math.max(maxAdj, bubbleAdj.max - axisInfo.max);
                    minAdj = Math.max(minAdj, axisInfo.min - bubbleAdj.min);
                }
                if(minAdj) {
                    axisInfo.min -= minAdj;
                }
                if(maxAdj) {
                    axisInfo.max += maxAdj;
                }
                if(maxAdj || minAdj) {
                    self._calculateMajorMinor(options, axisInfo);
                }
            };
            wijcompositechart.prototype._getBarAdjustment = function (axisInfo, minor) {
                var len = 0, o = this.options, max = axisInfo.max, min = axisInfo.min, xLen = 0, adj;
                $.each(o.seriesList, function (idx, series) {
                    if(series.type === "pie") {
                        return true;
                    }
                    if(series.data.x === undefined || series.data.y === undefined) {
                        return true;
                    }
                    xLen = series.data.x.length;
                    if(len < xLen) {
                        len = xLen;
                    }
                });
                if(len > 1) {
                    adj = (max - min) / len * o.clusterWidth * 0.0125;
                } else if(len === 1) {
                    if(min === 0.0 && max === 1.0) {
                        min = -1.0;
                        axisInfo.min = min;
                    }
                    adj = (max - min) * 0.0125;
                } else {
                    adj = 0;
                }
                if(adj === 0) {
                    adj = minor;
                } else {
                    if(minor < adj && minor !== 0) {
                        adj = Math.floor(adj / minor) * minor;
                    }
                }
                return adj;
            };
            return wijcompositechart;
        })(chart.wijchartcore);
        chart.wijcompositechart = wijcompositechart;        
        wijcompositechart.prototype.widgetEventPrefix = "wijcompositechart";
        var wijcompositechart_options = (function () {
            function wijcompositechart_options() {
                /**
                * Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijcompositechart')";
                /**
                * @ignore
                */
                this.wijCSS = {
                    compositechart: "wijmo-wijcompositechart",
                    barLabel: "wijbarchart-label",
                    barElement: "wijbarchart",
                    barTracker: "bartracker",
                    bubbleElement: "wijbubblechart-bubble",
                    bubbleTracker: "bubbletracker",
                    bubbleLabel: "wijbubblechart-label",
                    bubbleSymbol: "wijbubblechart-symbol",
                    scatterElement: "wijscatterchart",
                    pieLabel: "wijpiechart-label",
                    pieElement: "wijpiechart",
                    pieTracker: "pietracker",
                    lineLabel: "wijlinechart-label",
                    lineElement: "wijlinechart",
                    areaElement: "wijlinechart-area",
                    lineTracker: "linetracker",
                    canvasMarker: "wijchart-canvas-marker",
                    wijCandlestickChart: "wijmo-wijcandlestickchart",
                    candlestickChart: "wijcandlestickchart",
                    candlestickChartTracker: "candlesticktracker"
                };
                /**
                * A value that determines whether to show a stacked chart.
                */
                this.stacked = false;
                /**
                * A value that indicates the percentage of bar elements in the same cluster overlap.
                */
                this.clusterOverlap = 0;
                /**
                * A value that indicates the percentage of the plot area that each bar cluster occupies.
                */
                this.clusterWidth = 85;
                /**
                * A value that indicates the corner-radius for the bar.
                */
                this.clusterRadius = 0;
                /**
                * A value that indicates the spacing between the adjacent bars.
                */
                this.clusterSpacing = 0;
                /**
                * An array collection that contains the data that will be displayed by the chart."
                * @example
                *	$("#compositechart").wijcompositechart({
                *				seriesList: [{
                *					type: "bar",
                *					label: "Q1",
                *					legendEntry: true,
                *					data: {
                *						x: [1, 2, 3, 4, 5],
                *						y: [12, 21, 9, 29, 30]
                *					}}, {
                *					type: "bar",
                *					label: "Q2",
                *					legendEntry: true,
                *					data: {
                *						xy: [1, 21, 2, 10, 3, 19, 4, 31, 5, 20]
                *					}}, {
                *					type: "line",
                *					label: "Q3",
                *					legendEntry: true,
                *					data: {
                *						x: [1, 2, 3, 4, 5],
                *						y: [12, 21, 9, 29, 30]
                *					}}, {
                *					type: "pie",
                *					label: "title for pie chart",
                *					legendEntry: false,
                *					data: [{
                *						label: "Q4",
                *						data: 12,
                *						offset: 15
                *					}, {
                *						label: "Q5",
                *						data: 21,
                *						offset: 0
                *					}, {
                *						label: "Q5",
                *						data: 21,
                *						offset: 0
                *					}],
                *					center: {
                *						x: 150,
                *						y: 150
                *					},
                *					radius: 100
                *					}
                *				}]
                *				OR
                *				seriesList: [{
                *					type: "bar"
                *					label: "Q1",
                *					legendEntry: true,
                *					data: {
                *						x: ["A", "B", "C", "D", "E"],
                *						y: [12, 21, 9, 29, 30]
                *					}
                *				}, {
                *					type: "line"
                *					label: "Q1",
                *					legendEntry: true,
                *					data: {
                *						x: ["A", "B", "C", "D", "E"],
                *						y: [12, 21, 9, 29, 30]
                *					}
                *				}
                *				]
                *				OR
                *				seriesList: [{
                *					type: "bar",
                *					label: "Q1",
                *					legendEntry: true,
                *					data: {
                *						x: [new Date(1978, 0, 1), new Date(1980, 0, 1),
                *							new Date(1981, 0, 1), new Date(1982, 0, 1),
                *							new Date(1983, 0, 1)],
                *						y: [12, 21, 9, 29, 30]
                *					}
                *				}, {
                *					type: "bar",
                *					label: "Q2",
                *					legendEntry: true,
                *					data: {
                *						x: [new Date(1978, 0, 1), new Date(1980, 0, 1),
                *							new Date(1981, 0, 1), new Date(1982, 0, 1),
                *							new Date(1983, 0, 1)],
                *						y: [10, 25, 5, 25, 35]
                *					}
                *				}]
                *  });
                */
                this.seriesList = [];
                /**
                * The animation option defines the animation effect and controls other aspects of the widget's animation,
                * such as duration and easing.
                */
                this.animation = {
                    enabled: /**
                    * A value that determines whether to show animation.
                    */
                    true,
                    duration: /**
                    * The duration option defines the length of the animation effect in milliseconds.
                    */
                    400,
                    easing: /**
                    * Sets the type of animation easing effect that users experience when the wijcompositechart series is loaded to the page.
                    * @remarks
                    * The easing is defined in Raphael, the documentation is:http://raphaeljs.com/reference.html#Raphael.easing_formulas
                    */
                    ">"
                };
                /**
                * The seriesTransition option is used to animate series in the chart when just their values change.
                * @remarks
                * This is helpful for visually showing changes in data for the same series.
                * Note: When programmatically updating the seriesList with a different number of series in the array make sure
                * to disable seriesTransition like the following:
                * seriesTransition: { enabled: false}
                */
                this.seriesTransition = {
                    enabled: /**
                    * A value that determines whether to show animation when reloading data.
                    */
                    true,
                    duration: /**
                    * A value that indicates the duration for the series transition.
                    */
                    400,
                    easing: /**
                    * Sets the type of animation easing effect that users experience when the wijcompositechart series is
                    * reloaded after they have changed the data for the seriesList option.
                    */
                    ">"
                };
                /**
                * Occurs when the user clicks a mouse button.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICompositeChartEventArgs} data Information about an event
                */
                this.mouseDown = null;
                /**
                * Occurs when the user releases a mouse button while the pointer is over the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICompositeChartEventArgs} data Information about an event
                */
                this.mouseUp = null;
                /**
                * Occurs when the user first places the pointer over the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICompositeChartEventArgs} data Information about an event
                */
                this.mouseOver = null;
                /**
                * Occurs when the user moves the pointer off of the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICompositeChartEventArgs} data Information about an event
                */
                this.mouseOut = null;
                /**
                * Occurs when the user moves the mouse pointer while it is over a chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICompositeChartEventArgs} data Information about an event
                */
                this.mouseMove = null;
                /**
                * Occurs when the user clicks the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICompositeChartEventArgs} data Information about an event
                */
                this.click = null;
            }
            return wijcompositechart_options;
        })();        
        wijcompositechart.prototype.options = $.extend(true, {
        }, chart.wijchartcore.prototype.options, new wijcompositechart_options());
        $.wijmo.registerWidget("wijcompositechart", wijcompositechart.prototype);
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
