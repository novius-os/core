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
    /// <reference path="../wijchart/jquery.wijmo.wijchartcore.ts"/>
    /*globals $, Raphael, jQuery, document, window, Globalize*/
    /*
    * Depends:
    *	jquery.js
    *	jquery.ui.widget.js
    *	raphael.js
    *	globalize.js
    *	jquery.wijmo.raphael.js
    *	jquery.wijmo.wijchartcore.js
    *
    */
    (function (chart) {
        /**
        * @widget
        */
        var wijlinechart = (function (_super) {
            __extends(wijlinechart, _super);
            function wijlinechart() {
                _super.apply(this, arguments);

            }
            wijlinechart.prototype._create = function () {
                var o = this.options;
                this._handleChartStyles();
                _super.prototype._create.call(this);
                this.chartElement.addClass(o.wijCSS.lineChart);
                if(o.type === "area") {
                    this.chartElement.addClass(o.wijCSS.areaChart);
                }
            };
            wijlinechart.prototype.destroy = /** Remove the functionality completely.
            *This will return the element back to its pre-init state.
            */
            function () {
                var o = this.options;
                this.chartElement.removeClass(o.wijCSS.lineChart);
                if(o.type === "area") {
                    this.chartElement.removeClass(o.wijCSS.areaChart);
                }
                _super.prototype.destroy.call(this);
                if(this.aniPathsAttr && this.aniPathsAttr.length) {
                    $.each(this.aniPathsAttr, function (idx, pathAttr) {
                        pathAttr = null;
                    });
                    this.aniPathsAttr = null;
                }
            };
            wijlinechart.prototype.getLinePath = /** Returns reference to raphael's path object for the line data with given index.
            * @param {number} lineIndex The index of the series data for which to return lines.
            * @returns {Raphael Element} Reference to raphael element object.
            * @example
            * //Get the first line.
            * $("#linechart").wijlinechart("getLinePath", 0);
            */
            function (lineIndex) {
                var fields = this.chartElement.data("fields"), chartEles, und;
                if(fields && fields.chartElements) {
                    chartEles = fields.chartElements;
                    if(chartEles.paths && chartEles.paths.length) {
                        return chartEles.paths[lineIndex];
                    }
                }
                return und;
            };
            wijlinechart.prototype.getLineMarkers = /** Returns reference to set of the raphael's objects
            * what represents markers for the line data with given index.
            * @param {number} lineIndex The index of the series data for which to return markers.
            * @returns {Raphael Element} Reference to raphael element object.
            * @example
            * //Get the markers of the first line.
            * $("#linechart").wijlinechart("getLineMarkers", 0);
            */
            function (lineIndex) {
                var o = this.options, fields = this.chartElement.data("fields"), chartEles, und;
                if(o.seriesList && o.seriesList[lineIndex].markers && o.seriesList[lineIndex].markers.visible) {
                    if(fields && fields.chartElements) {
                        chartEles = fields.chartElements;
                        if(chartEles.markersSet && chartEles.markersSet.length) {
                            return chartEles.markersSet[lineIndex];
                        }
                    }
                }
                return und;
            };
            wijlinechart.prototype._showSerieEles = function (seriesEle) {
                var o = this.options, obj;
                if(seriesEle.markers) {
                    $.each(seriesEle.markers, function (i, marker) {
                        var dataObj = $(marker.node).data("wijchartDataObj");
                        if(dataObj && dataObj.lineSeries && dataObj.lineSeries.markers) {
                            if(!dataObj.lineSeries.markers.visible) {
                                return true;
                            }
                        }
                        marker.show();
                    });
                }
                if(seriesEle.dcl) {
                    $.each(seriesEle.dcl, function (i, dcl) {
                        if(o.showChartLabels) {
                            dcl.show();
                        }
                    });
                }
                if(seriesEle.path) {
                    obj = $(seriesEle.path.node).data("wijchartDataObj");
                    // If line is invisible and markers are visible, in this case, do not show the line. Otherwise, show the line.
                    if(!(!obj.visible && obj.markers && obj.markers.visible)) {
                        seriesEle.path.show();
                        if(seriesEle.path.shadow) {
                            seriesEle.path.shadow.show();
                        }
                        if(seriesEle.path.area) {
                            seriesEle.path.area.show();
                        }
                        if(seriesEle.path.tracker) {
                            seriesEle.path.tracker.show();
                        }
                    }
                    // mark the mark is not visible
                    if($(seriesEle.path.node).data("wijchartDataObj") && $(seriesEle.path.node).data("wijchartDataObj").virtualMarkers) {
                        $.each($(seriesEle.path.node).data("wijchartDataObj").virtualMarkers, function (i, markerObj) {
                            markerObj.visible = true;
                        });
                    }
                }
            };
            wijlinechart.prototype._hideSerieEles = function (seriesEle) {
                if(seriesEle.markers) {
                    $.each(seriesEle.markers, function (i, marker) {
                        marker.hide();
                    });
                }
                if(seriesEle.dcl) {
                    $.each(seriesEle.dcl, function (i, dcl) {
                        dcl.hide();
                    });
                }
                if(seriesEle.path) {
                    seriesEle.path.hide();
                    if(seriesEle.path.shadow) {
                        seriesEle.path.shadow.hide();
                    }
                    if(seriesEle.path.area) {
                        seriesEle.path.area.hide();
                    }
                    if(seriesEle.path.tracker) {
                        seriesEle.path.tracker.hide();
                    }
                    if($(seriesEle.path.node).data("wijchartDataObj") && $(seriesEle.path.node).data("wijchartDataObj").virtualMarkers) {
                        $.each($(seriesEle.path.node).data("wijchartDataObj").virtualMarkers, function (i, markerObj) {
                            markerObj.visible = false;
                        });
                    }
                }
            };
            wijlinechart.prototype._supportStacked = function () {
                return true;
            };
            wijlinechart.prototype._indicatorLineShowing = // when showing the indicator line, hover the line marker.
            function (objs) {
                _super.prototype._indicatorLineShowing.call(this, objs);
                $.each(objs, function (i, obj) {
                    if(obj.marker) {
                        obj.marker.attr(obj.markerHoverStyle);
                    }
                });
            };
            wijlinechart.prototype._removeIndicatorStyles = function (objs) {
                $.each(objs, function (i, obj) {
                    if(obj.marker) {
                        obj.marker.attr(obj.markerStyle);
                        obj.marker.transform("s1");
                    }
                });
            };
            wijlinechart.prototype._mouseDownInsidePlotArea = function (e, mousePos) {
                _super.prototype._mouseDownInsidePlotArea.call(this, e, mousePos);
                this._clearHoverState(true);
            };
            wijlinechart.prototype._mouseDown = function (e, args) {
                _super.prototype._mouseDown.call(this, e, args);
            };
            wijlinechart.prototype._mouseUp = function (e, args) {
                _super.prototype._mouseUp.call(this, e, args);
            };
            wijlinechart.prototype._mouseOver = function (e, lineSeries) {
                if(!lineSeries || !(lineSeries.type === "line" || lineSeries.type === "marker")) {
                    return;
                }
                if(this.indicatorLine) {
                    return;
                }
                _super.prototype._mouseOver.call(this, e, lineSeries);
                if(lineSeries.type === "marker") {
                    lineSeries = lineSeries.lineSeries;
                }
                if(lineSeries.path.removed) {
                    return;
                }
                if(this.hoverLine !== lineSeries || this.hoverLine === null) {
                    this.isNewLine = true;
                    if(this.hoverLine) {
                        if(!this.hoverLine.path.removed) {
                            // fixed the issue jQuery 1.9.
                            // the options will set on the prototype,
                            // so the seriesStyles will effect by other chart.
                            // if the chart type is not area, remove the style's fill.
                            if(this.options.type === "line" && this.hoverLine.lineStyle.fill) {
                                delete this.hoverLine.lineStyle.fill;
                            }
                            this.hoverLine.path.wijAttr(this.hoverLine.lineStyle);
                            if(this.hoverPoint && !this.hoverPoint.isSymbol) {
                                this.hoverPoint.marker.wijAttr(this.hoverPoint.markerStyle);
                                this.hoverPoint.marker.transform("s1");
                            }
                        }
                    }
                    if(lineSeries.lineHoverStyle) {
                        lineSeries.path.wijAttr(lineSeries.lineHoverStyle);
                    }
                    this.hoverLine = lineSeries;
                    this.hoverPoint = null;
                    this.hoverVirtualPoint = null;
                }
            };
            wijlinechart.prototype._mouseOut = function (e, args) {
                _super.prototype._mouseOut.call(this, e, args);
            };
            wijlinechart.prototype._mouseMove = function (e, args) {
                _super.prototype._mouseMove.call(this, e, args);
            };
            wijlinechart.prototype._click = function (e, args) {
                _super.prototype._click.call(this, e, args);
            };
            wijlinechart.prototype._mouseMoveInsidePlotArea = function (e, mousePos) {
                var _this = this;
                var tooltip = this.tooltip, hint = this.options.hint, markers, virtualMarkers, idx = 0, p, point, valueX, valueY, s = null, dataObj = null, op = null, title = hint.title, content = hint.content, isTitleFunc = $.isFunction(title), isContentFunc = $.isFunction(content), distance = 0;
                if(tooltip) {
                    op = tooltip.getOptions();
                }
                if(this.hoverLine && !this.indicatorLine) {
                    if(this.isNewLine) {
                        if(hint.enable && tooltip) {
                            tooltip.hide();
                        }
                        this.isNewLine = false;
                    }
                    markers = this.hoverLine.lineMarkers;
                    virtualMarkers = this.hoverLine.virtualMarkers;
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
                        if(this.hoverPoint && this.hoverPoint.index === idx) {
                            return;
                        }
                        if(idx > -1) {
                            if(markers[idx].removed) {
                                return;
                            }
                            point = $(markers[idx].node).data("wijchartDataObj");
                            if(point) {
                                if(this.hoverPoint && !this.hoverPoint.isSymbol) {
                                    if(!this.hoverPoint.removed) {
                                        this.hoverPoint.marker.wijAttr(this.hoverPoint.markerStyle);
                                        this.hoverPoint.marker.transform("s1");
                                    }
                                }
                                if(!point.isSymbol) {
                                    if(!point.marker.removed) {
                                        point.marker.wijAttr(point.markerHoverStyle);
                                    }
                                }
                            }
                            this.hoverPoint = point;
                            this.hoverVirtualPoint = virtualMarkers[idx];
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
                        if(this.hoverVirtualPoint && this.hoverVirtualPoint.index === idx) {
                            return;
                        }
                        if(idx > -1) {
                            this.hoverPoint = null;
                            this.hoverVirtualPoint = virtualMarkers[idx];
                        }
                    }
                    if(tooltip) {
                        dataObj = this.hoverVirtualPoint;
                        valueX = dataObj.valX;
                        valueY = dataObj.valY;
                        if(isTitleFunc || isContentFunc) {
                            if(isTitleFunc) {
                                op.title = function () {
                                    var obj = {
                                        pointIndex: idx,
                                        lineIndex: _this.hoverLine.index,
                                        x: valueX,
                                        y: valueY,
                                        label: _this.hoverLine.label,
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
                                        lineIndex: _this.hoverLine.index,
                                        x: valueX,
                                        y: valueY,
                                        label: _this.hoverLine.label,
                                        data: dataObj,
                                        fmt: content
                                    }, fmt = $.proxy(obj.fmt, obj), con = fmt();
                                    return con;
                                };
                            }
                        }
                        s = $.extend({
                            stroke: this.hoverLine.path.attr("stroke")
                        }, hint.style);
                        op.style.stroke = s.stroke;
                        tooltip.showAt(p);
                    }
                }
                _super.prototype._mouseMoveInsidePlotArea.call(this, e, mousePos);
            };
            wijlinechart.prototype._mouseMoveOutsidePlotArea = function (e, mousePos) {
                this._clearHoverState(false);
                _super.prototype._mouseMoveOutsidePlotArea.call(this, e, mousePos);
            };
            wijlinechart.prototype._clearHoverState = function (keepTooltip) {
                var tooltip = this.tooltip, hint = this.options.hint;
                if(hint.enable && tooltip && !keepTooltip) {
                    tooltip.hide();
                }
                if(this.hoverLine) {
                    if(!this.hoverLine.path.removed) {
                        // fixed the issue jQuery 1.9.
                        // the options will set on the prototype,
                        // so the seriesStyles will effect by other chart.
                        // if the chart type is not area, remove the style's fill.
                        if(this.options.type === "line" && this.hoverLine.lineStyle.fill) {
                            delete this.hoverLine.lineStyle.fill;
                        }
                        this.hoverLine.path.wijAttr(this.hoverLine.lineStyle);
                        if(this.hoverPoint && !this.hoverPoint.isSymbol) {
                            this.hoverPoint.marker.wijAttr(this.hoverPoint.markerStyle);
                            this.hoverPoint.marker.transform("s1");
                        }
                    }
                }
                this.hoverLine = null;
                this.hoverPoint = null;
                this.hoverVirtualPoint = null;
            };
            wijlinechart.prototype._paintLegendIcon = function (x, y, width, height, style, legendIndex, seriesIndex, legendCss, series, leg) {
                var self = this, o = this.options, icon = self.canvas.path(Raphael.format("M{0},{1}L{2},{3}", x, y + height / 2, x + width, y + height / 2)), dot;
                $(icon.node).data("legendIndex", legendIndex).data("index", seriesIndex);
                self.legendIcons.push(icon);
                if(style) {
                    icon.attr($.extend(true, {
                    }, style, {
                        "stroke-width": o.legend.size.height
                    }));
                }
                $.wijraphael.addClass($(icon.node), legendCss);
                var markerStyle = series.markerStyle;
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
                if(series.markers && series.markers.visible) {
                    var type = series.markers.type;
                    if(!type) {
                        type = "circle";
                    }
                    dot = this.canvas.paintMarker(type, x + width / 2, y + height / 2, 3);
                    $.wijraphael.addClass($(dot.node), Raphael.format("{0} {1} {2}", o.wijCSS.legend, o.wijCSS.legendDot, o.wijCSS.canvasObject));
                    dot.attr(markerStyle);
                    $(dot.node).data("index", seriesIndex).data("legendIndex", legendIndex);
                    this.legendDots.push(dot);
                }
                return icon;
            };
            wijlinechart.prototype._paintLegend = function () {
                var o = this.options, i = 0, ii = 0, idx = 0, legendIcon = null, chartsSeries = o.seriesList, chartsSeriesStyles = o.seriesStyles, chartSeries = null, chartSeriesStyle = null, box = null, x = 0, y = 0, markerStyle = null, type = null, dot = null;
                $.extend(true, o, {
                    legend: {
                        size: {
                            width: 30,
                            height: 3
                        }
                    }
                });
                _super.prototype._paintLegend.call(this);
                //if (o.legend.visible) {
                //	//set fill attr to legendIcons
                //	if (this.legends.length && this.legendIcons.length) {
                //		$.each(this.legendIcons, (i, icon) => {
                //			var b = icon.getBBox(),
                //				canvas = this.canvas,
                //				newIcon;
                //			newIcon = canvas.path(Raphael.format("M{0},{1}L{2},{3}",
                //				b.x, b.y + b.height / 2, b.x + b.width,
                //				b.y + b.height / 2)).attr($.extend(true, {}, icon.attr(), {
                //					stroke: icon.attr("stroke"),
                //					"stroke-width": o.legend.size.height
                //				}));
                //			$(newIcon.node)
                //				.data("legendIndex", $(icon.node).data("legendIndex"))
                //				.data("index", $(icon.node).data("index"));
                //			$.wijraphael.addClass($(newIcon.node), Raphael.format("{0} {1}",
                //				o.wijCSS.legend, o.wijCSS.legendIcon));
                //			icon.remove();
                //			icon = null;
                //			this.legendIcons[i] = newIcon;
                //		});
                //	}
                //	//add marker to legendIcons
                //	if (!o.legend.reversed) {
                //		for (i = 0, ii = chartsSeries.length; i < ii; i++) {
                //			chartSeries = chartsSeries[i];
                //			chartSeriesStyle = chartsSeriesStyles[i];
                //			if (chartSeries.legendEntry &&
                //					chartSeries.display !== "exclude") {
                //				if (chartSeries.markers && chartSeries.markers.visible) {
                //					legendIcon = this.legendIcons[idx];
                //					if (chartSeriesStyle["stroke-dasharray"]) {
                //						legendIcon.attr({
                //							//if stroke-width is bigger than 1,
                //							//it doesn't look good.
                //							"stroke-width": 1,
                //							"stroke-dasharray":
                //								chartSeriesStyle["stroke-dasharray"]
                //						});
                //					}
                //					box = legendIcon.wijGetBBox();
                //					x = box.x + box.width / 2;
                //					y = box.y + box.height / 2;
                //					markerStyle = chartSeries.markerStyle;
                //					markerStyle = $.extend({
                //						fill: chartSeriesStyle.stroke,
                //						stroke: chartSeriesStyle.stroke,
                //						opacity: 1
                //					}, markerStyle);
                //					type = chartSeries.markers.type;
                //					if (!type) {
                //						type = "circle";
                //					}
                //					dot = this.canvas.paintMarker(type, x, y, 3);
                //					$.wijraphael.addClass($(dot.node),
                //						Raphael.format("{0} {1} {2}",
                //							o.wijCSS.legend, o.wijCSS.legendDot,
                //							o.wijCSS.canvasObject));
                //					dot.attr(markerStyle);
                //					$(dot.node).data("index", i)
                //						.data("legendIndex", idx);
                //					this.legendDots.push(dot);
                //				}
                //				idx++;
                //			}
                //		}
                //	} else {
                //		for (i = chartsSeries.length - 1; i >= 0; i--) {
                //			chartSeries = chartsSeries[i];
                //			chartSeriesStyle = chartsSeriesStyles[i];
                //			if (chartSeries.legendEntry &&
                //					chartSeries.display !== "exclude") {
                //				if (chartSeries.markers && chartSeries.markers.visible) {
                //					legendIcon = this.legendIcons[idx];
                //					if (chartSeriesStyle["stroke-dasharray"]) {
                //						legendIcon.attr({
                //							//if stroke-width is bigger than 1,
                //							//it doesn't look good.
                //							"stroke-width": 1,
                //							"stroke-dasharray":
                //								chartSeriesStyle["stroke-dasharray"]
                //						});
                //					}
                //					box = legendIcon.wijGetBBox();
                //					x = box.x + box.width / 2;
                //					y = box.y + box.height / 2;
                //					markerStyle = chartSeries.markerStyle;
                //					markerStyle = $.extend({
                //						fill: chartSeriesStyle.stroke,
                //						stroke: chartSeriesStyle.stroke,
                //						opacity: 1
                //					}, markerStyle);
                //					type = chartSeries.markers.type;
                //					if (!type) {
                //						type = "circle";
                //					}
                //					dot = this.canvas.paintMarker(type, x, y, 3);
                //					$.wijraphael.addClass($(dot.node),
                //						Raphael.format("{0} {1} {2}",
                //							o.wijCSS.legend, o.wijCSS.legendDot,
                //							o.wijCSS.canvasObject));
                //					dot.attr(markerStyle);
                //					$(dot.node).data("index", i)
                //						.data("legendIndex", idx);
                //					this.legendDots.push(dot);
                //				}
                //				idx++;
                //			}
                //		}
                //	}
                //}
                            };
            wijlinechart.prototype._paintPlotArea = function () {
                var o = this.options, opt;
                if(!this.aniPathsAttr) {
                    this.aniPathsAttr = [];
                }
                this.linechartRender = new LineChartRender(this.chartElement, {
                    bounds: this.canvasBounds,
                    widgetName: this.widgetName,
                    canvas: this.canvas,
                    tooltip: this.tooltip,
                    wijCSS: o.wijCSS,
                    stacked: o.stacked,
                    hole: o.hole,
                    type: o.type,
                    axis: o.axis,
                    animation: o.animation,
                    seriesTransition: o.seriesTransition,
                    seriesList: o.seriesList,
                    seriesStyles: o.seriesStyles,
                    seriesHoverStyles: o.seriesHoverStyles,
                    showChartLabels: o.showChartLabels,
                    chartLabelStyle: o.chartLabelStyle,
                    chartLabelFormatString: o.chartLabelFormatString,
                    isXTime: this.axisInfo.x.isTime,
                    isYTime: this.axisInfo.y.isTime || this.axisInfo.y[0].isTime,
                    disabled: o.disabled,
                    culture: this._getCulture(),
                    hint: o.hint,
                    aniPathsAttr: this.aniPathsAttr,
                    chartLabelEles: this.chartLabelEles,
                    mouseDown: $.proxy(this._mouseDown, this),
                    mouseUp: $.proxy(this._mouseUp, this),
                    mouseOver: $.proxy(this._mouseOver, this),
                    mouseOut: $.proxy(this._mouseOut, this),
                    mouseMove: $.proxy(this._mouseMove, this),
                    click: $.proxy(this._click, this),
                    widget: this,
                    extremeValue: {
                        txx: this.extremeValue.txx,
                        txn: this.extremeValue.txn,
                        tyx: this.extremeValue.y[0].tyx,
                        tyn: this.extremeValue.y[0].tyn
                    }
                });
                this.linechartRender.render();
            };
            wijlinechart.prototype._clearChartElement = function () {
                _super.prototype._clearChartElement.call(this);
                this.hoverLine = null;
                this.hoverPoint = null;
                this.hoverVirtualPoint = null;
            };
            return wijlinechart;
        })(chart.wijchartcore);
        chart.wijlinechart = wijlinechart;        
        var wijlinechart_options = (function () {
            function wijlinechart_options() {
                /**
                * Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijlinechart')";
                /**
                * All CSS classes used in widgets.
                * @ignore
                */
                this.wijCSS = {
                    lineChart: "wijmo-wijlinechart",
                    areaChart: "wijmo-wijareachart",
                    lineLabel: "wijlinechart-label",
                    lineElement: "wijlinechart",
                    areaElement: "wijlinechart-area",
                    lineTracker: "linetracker",
                    canvasMarker: "wijchart-canvas-marker"
                };
                /** A value that determines whether to show a stacked chart.*/
                this.stacked = false;
                /** Gets or sets the data hole value.
                * @type {number}
                * @remarks Data holes are used as placeholders for data points
                * that indicate data is normally present but not in this case.
                */
                this.hole = null;
                /** An option that indicates the type of chart to be displayed.
                * @remarks Options are 'line' and 'area'.
                */
                this.type = "line";
                /** The animation option defines the animation effect and controls other aspects of the widget's animation,
                * such as duration and easing.
                */
                this.animation = {
                    enabled: /** A value that determines whether to show the animation.
                    * Set this option to false in order to disable easing.
                    */
                    true,
                    direction: /** A value that determines the effect for the animation.
                    * @remarks Options are 'horizontal' and 'vertical'.
                    */
                    "horizontal",
                    duration: /** A value that indicates the duration for the animation.*/
                    2000,
                    easing: /** Sets the type of animation easing effect that users experience
                    * when the wijlinechart series is loaded to the page.
                    * For example, a user can have the wijlinechart series bounce several times as it loads.
                    * @remarks Values available for the animation easing effect include the following:
                    * easeInCubic ¨C Cubic easing in. Begins at zero velocity and then accelerates.
                    * easeOutCubic ¨C Cubic easing in and out. Begins at full velocity and then decelerates to zero.
                    * easeInOutCubic ¨C Begins at zero velocity, accelerates until halfway, and then decelerates to zero velocity again.
                    * easeInBack ¨C Begins slowly and then accelerates.
                    * easeOutBack ¨C Begins quickly and then decelerates.
                    * easeOutElastic ¨C Begins at full velocity and then decelerates to zero.
                    * easeOutBounce ¨C Begins quickly and then decelerates. The number of bounces is related to the duration, longer durations produce more bounces.
                    */
                    "easeInCubic"
                };
                /** The seriesTransition option is used to animate series in the chart when just their values change.
                * This is helpful for visually showing changes in data for the same series.
                */
                this.seriesTransition = {
                    enabled: /** A value that determines whether to show animation when reload.*/
                    true,
                    duration: /** A value that indicates the duration for the series transition.*/
                    2000,
                    easing: /** A value that indicates the easing for the series transition.*/
                    "easeInCubic"
                };
                /** This event fires when the user clicks a mouse button.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijLineChartEventArgs} args The data with this event.
                */
                this.mouseDown = null;
                /** This event fires when the user releases a mouse button while the pointer is over the chart element.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijLineChartEventArgs} args The data with this event.
                */
                this.mouseUp = null;
                /** This event fires when the user first places the pointer over the chart element.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijLineChartEventArgs} args The data with this event.
                */
                this.mouseOver = null;
                /** This event fires when the user moves the pointer off of the chart element.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijLineChartEventArgs} args The data with this event.
                */
                this.mouseOut = null;
                /** This event fires when the user moves the mouse pointer while it is over a chart element.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijLineChartEventArgs} args The data with this event.
                */
                this.mouseMove = null;
                /** This event fires when the user clicks the chart element.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijLineChartEventArgs} args The data with this event.
                */
                this.click = null;
            }
            return wijlinechart_options;
        })();        
        ;
        wijlinechart.prototype.options = $.extend(true, {
        }, chart.wijchartcore.prototype.options, new wijlinechart_options());
        $.wijmo.registerWidget("wijlinechart", wijlinechart.prototype);
        ;
        /** @ignore*/
        var LineChartRender = (function () {
            function LineChartRender(element, options) {
                this.options = options;
                this.element = element;
            }
            LineChartRender.prototype.render = function () {
                var element = this.element, options = this.options, wijCSS = options.wijCSS, cBounds = options.bounds, widgetName = options.widgetName, canvas = options.canvas, ani = options.animation, seTrans = options.seriesTransition, hint = options.hint, tooltip = options.tooltip, mouseDown = options.mouseDown, mouseUp = options.mouseUp, mouseOver = options.mouseOver, mouseOut = options.mouseOut, mouseMove = options.mouseMove, click = options.click, markersSet = [], symbols = [], linesStyle = [], paths = [], shadowPaths = [], disabled = options.disabled, animationSet = canvas.set(), fieldsAniPathAttr = options.aniPathsAttr, aniPathsAttr = [], chartEles, fields = element.data("fields") || {
                }, seriesEles = [], culture = options.culture, widget = options.widget, exVal = options.extremeValue, clipRect = {
                    enable: false,
                    left: -10,
                    top: -10,
                    right: 10,
                    bottom: 10
                };
                this.widget = widget;
                this.renderLineChart(options, aniPathsAttr, fieldsAniPathAttr, paths, shadowPaths, markersSet, animationSet, symbols, linesStyle, seriesEles, culture);
                //fix #35743, #30015
                if(!options.axis.x.autoMax && options.axis.x.max < exVal.txx) {
                    clipRect.enable = true;
                    clipRect.right = 0;
                }
                if(!options.axis.x.autoMin && options.axis.x.min > exVal.txn) {
                    clipRect.enable = true;
                    clipRect.left = 0;
                }
                if(!options.axis.y.autoMax && options.axis.y.max < exVal.tyx) {
                    clipRect.enable = true;
                    clipRect.top = 0;
                }
                if(!options.axis.y.autoMin && options.axis.y.min > exVal.tyn) {
                    clipRect.enable = true;
                    clipRect.bottom = 0;
                }
                if(ani.enabled || seTrans.enabled) {
                    this.playAnimation(ani, seTrans, animationSet, cBounds, paths, fieldsAniPathAttr, clipRect);
                } else if(clipRect.enable) {
                    this.setClipRect(clipRect, animationSet, cBounds);
                }
                fieldsAniPathAttr.length = 0;
                $.each(aniPathsAttr, function (idx, aniPathAttr) {
                    fieldsAniPathAttr.push(aniPathAttr);
                });
                this.unbindLiveEvents(element, widgetName, wijCSS);
                this.bindLiveEvents(element, canvas, cBounds, widgetName, mouseDown, mouseUp, mouseOver, mouseOut, mouseMove, click, disabled, hint, linesStyle, tooltip, wijCSS);
                chartEles = {
                    paths: paths,
                    shadowPaths: shadowPaths,
                    markersSet: markersSet,
                    animationSet: animationSet,
                    symbols: symbols
                };
                if(!fields.chartElements) {
                    fields.chartElements = {
                    };
                }
                fields.seriesEles = seriesEles;
                $.extend(true, fields.chartElements, chartEles);
                element.data("fields", fields);
            };
            LineChartRender.prototype.setClipRect = function (clipRect, animationSet, cBounds) {
                var width = cBounds.endX - cBounds.startX - clipRect.left + clipRect.right, height = cBounds.endY - cBounds.startY - clipRect.top + clipRect.bottom;
                animationSet.wijAttr("clip-rect", Raphael.format("{0} {1} {2} {3}", (cBounds.startX + clipRect.left), (cBounds.startY + clipRect.top), width, height));
            };
            LineChartRender.prototype.playAnimation = function (ani, seTrans, animationSet, cBounds, paths, fieldsAniPathAttr, clipRect) {
                var _this = this;
                var duration = ani.duration, easing = ani.easing;
                if(ani.direction === "horizontal") {
                    if(fieldsAniPathAttr && fieldsAniPathAttr.length && seTrans.enabled) {
                        duration = seTrans.duration;
                        easing = seTrans.easing;
                    }
                    this.playHAnimation(duration, easing, animationSet, cBounds, paths, clipRect);
                } else {
                    if(clipRect.enable) {
                        this.setClipRect(clipRect, animationSet, cBounds);
                    }
                    $.each(paths, function (idx, path) {
                        if(typeof path === "undefined" || path === null) {
                            return true;
                        }
                        if(fieldsAniPathAttr && fieldsAniPathAttr.length > idx && seTrans.enabled) {
                            duration = seTrans.duration;
                            easing = seTrans.easing;
                            _this.playVAnimation(path, fieldsAniPathAttr, idx, duration, easing);
                        } else {
                            if(path.straight) {
                                _this.playVStraightAnimation(path, duration, easing);
                            }
                        }
                    });
                }
            };
            LineChartRender.prototype.playVAnimation = function (path, fieldsAniPathAttr, idx, duration, easing) {
                var aniPathAttr, diffAttr;
                if(path.shadow) {
                    path.shadow.hide();
                }
                if(path.tracker) {
                    path.tracker.hide();
                }
                aniPathAttr = fieldsAniPathAttr[idx];
                if(aniPathAttr && aniPathAttr.path) {
                    diffAttr = chart.ChartUtil.getDiffAttrs(aniPathAttr.path, path.attr());
                }
                if(!$.isEmptyObject(diffAttr)) {
                    path.attr(aniPathAttr.path);
                    path.wijAnimate(diffAttr, duration, easing, function () {
                        if(path.shadow && path.visible !== false) {
                            path.shadow.show();
                        }
                        // If the path is not visible, not show the tracker.
                        if(path.tracker && path.visible !== false) {
                            path.tracker.show();
                        }
                    });
                }
                $.each(path.markers, function (i, marker) {
                    var diffMarkerAttr = chart.ChartUtil.getDiffAttrs(aniPathAttr.markers[i], marker.attr());
                    if(!$.isEmptyObject(diffMarkerAttr)) {
                        marker.attr(aniPathAttr.markers[i]);
                        marker.wijAnimate(diffMarkerAttr, duration, easing);
                    }
                });
                if(path.labels) {
                    $.each(path.labels, function (i, label) {
                        var diffLabelAttr = chart.ChartUtil.getDiffAttrs(aniPathAttr.labels[i], label.attr()), labelAttr = aniPathAttr.labels[i];
                        if(labelAttr && labelAttr.text) {
                            delete labelAttr.text;
                        }
                        if(!$.isEmptyObject(diffLabelAttr)) {
                            label.attr(labelAttr);
                            label.wijAnimate(diffLabelAttr, duration, easing);
                        }
                    });
                }
                if(path.area) {
                    diffAttr = chart.ChartUtil.getDiffAttrs(aniPathAttr.area, path.area.attr());
                    if(!$.isEmptyObject(diffAttr)) {
                        path.area.attr(aniPathAttr.area);
                        path.area.wijAnimate(diffAttr, duration, easing);
                    }
                }
            };
            LineChartRender.prototype.playVStraightAnimation = function (path, duration, easing) {
                var aniPathAttr, diffPath, area;
                if(path.shadow) {
                    path.shadow.hide();
                }
                if(path.tracker) {
                    path.tracker.hide();
                }
                aniPathAttr = path.straight;
                diffPath = path.attr().path;
                path.attr({
                    path: aniPathAttr
                });
                path.wijAnimate({
                    path: diffPath
                }, duration, easing, function () {
                    if(path.shadow && path.visible !== false) {
                        path.shadow.show();
                    }
                    // If the path is invisible. not show the trackers.
                    if(path.tracker && path.visible !== false) {
                        path.tracker.show();
                    }
                });
                $.each(path.markers, function (i, marker) {
                    if(marker.straight) {
                        var cy = marker.attr().cy;
                        marker.attr({
                            cy: marker.straight
                        });
                        marker.wijAnimate({
                            cy: cy
                        }, duration, easing);
                    }
                });
                if(path.area) {
                    area = path.area;
                    aniPathAttr = area.straight;
                    diffPath = area.attr().path;
                    area.attr({
                        path: aniPathAttr
                    });
                    area.wijAnimate({
                        path: diffPath
                    }, duration, easing);
                }
            };
            LineChartRender.prototype.playHAnimation = function (duration, easing, animationSet, cBounds, paths, clipRect) {
                $.each(paths, function (idx, path) {
                    if(path.tracker) {
                        path.tracker.hide();
                    }
                });
                var clipRectEnable = clipRect.enable, width = cBounds.endX - cBounds.startX - clipRect.left + clipRect.right, height = cBounds.endY - cBounds.startY - clipRect.top + clipRect.bottom;
                animationSet.wijAttr("clip-rect", Raphael.format("{0} {1} 0 {2}", (cBounds.startX + clipRect.left), (cBounds.startY + clipRect.top), height));
                animationSet.wijAnimate({
                    "clip-rect": Raphael.format("{0} {1} {2} {3}", (cBounds.startX + clipRect.left), (cBounds.startY + clipRect.top), width, height)
                }, duration, easing, function () {
                    // If the path is invisible not show the tracker.
                    if(this.tracker && this.visible !== false) {
                        this.tracker.show();
                    }
                    if(Raphael.vml && !clipRectEnable) {
                        //delete clip-rect's div in vml
                                                var attrs = null, clipRect = //group = null,
                        null, node = this.node;
                        if(node && node.clipRect) {
                            attrs = this.attrs;
                            delete attrs["clip-rect"];
                            node.clipRect = null;
                            clipRect = $(node).parent();
                            clipRect.before(node);
                            clipRect.remove();
                            this.attr(attrs);
                            //Add comments to fix tfs issue 19385
                            if(attrs.src && attrs.src.length) {
                                this.attr({
                                    "src": attrs.src
                                });
                            }
                            //end comments.
                            // fixed the issue 42963, I have checked the issue and found when play animation, the gradient color will disapear.
                            // according to the issue 19385 fixing, reset the gradient fill.
                            if(attrs.gradient && attrs.gradient.length && attrs.fill === "none") {
                                this.attr({
                                    "fill": attrs.gradient
                                });
                            }
                        }
                    }
                });
            };
            LineChartRender.prototype.renderLineChart = function (options, aniPathsAttr, fieldsAniPathAttr, paths, shadowPaths, markersSet, animationSet, symbols, linesStyle, seriesEles, culture) {
                var _this = this;
                var wijCSS = options.wijCSS, cBounds = options.bounds, canvas = options.canvas, stacked = options.stacked, hole = options.hole, type = options.type, axis = options.axis, ani = options.animation, seTrans = options.seriesTransition, needAnimated = false, linesSeries = options.seriesList, linesSeriesStyles = options.seriesStyles, linesHoverStyles = options.seriesHoverStyles, showChartLabels = options.showChartLabels, chartLabelStyle = options.chartLabelStyle, chartLabelFormatString = options.chartLabelFormatString, isXTime = options.isXTime, isYTime = options.isYTime, chartLabelEles = options.chartLabelEles, defaultChartLabels, firstYPoint, lastYPoint, fitType, valuesX, valuesY, lastValuesY = [], lastPathAttr = [], valX, pathArr, markers, paintSymbol, valsY;
                $.each(linesSeries, function (k, lineSeries) {
                    var aniMarkersAttr = [], aniLabelsAttr = [], initAniPath = [], lineData, lineStyle, lineHoverStyle, lineMarkerStyle, lineMarkerHoverStyle, lineSeriesStyle, virtualMarkers = [];
                    if(lineSeries.display === "exclude") {
                        return true;
                    }
                    lineSeriesStyle = linesSeriesStyles[k];
                    //set default value of line series
                    lineSeries = $.extend(true, {
                        display: "show",
                        fitType: "line",
                        markers: {
                            visible: false,
                            type: "circle"
                        },
                        visible: true
                    }, lineSeries);
                    lineData = lineSeries.data;
                    lineStyle = $.extend({
                        stroke: "black",
                        opacity: 1,
                        fill: "none",
                        "stroke-linejoin": "round",
                        "stroke-linecap": "round"
                    }, lineSeriesStyle);
                    lineMarkerStyle = lineSeries.markerStyle;
                    lineMarkerStyle = $.extend({
                        fill: lineStyle.stroke,
                        stroke: lineStyle.stroke,
                        opacity: //Add comments by RyanWu@20110706.
                        //I can't add transform: "s1" here, because if so,
                        //The marker will be disapperaed after animation played
                        //in browsers which support vml(ie6/7/8).  I don't know
                        //why.  So I use the transform("s1") method to recover the
                        //original state of the marker after mouse out.
                        //transform: "s1",
                        //end by RyanWu@20110706.
                        1,
                        width: 3
                    }, lineMarkerStyle);
                    lineHoverStyle = linesHoverStyles[k];
                    lineMarkerHoverStyle = $.extend(true, {
                    }, lineHoverStyle, {
                        transform: "s1.5",
                        "stroke-width": 1
                    }, linesSeries.markerHoverStyle);
                    valuesX = [].concat(lineData.x);
                    valuesY = [].concat(lineData.y);
                    // Lines and markers:
                    markers = canvas.set();
                    pathArr = [];
                    fitType = lineSeries.fitType;
                    paintSymbol = false;
                    if(lineSeries.markers.symbol && lineSeries.markers.symbol.length) {
                        paintSymbol = true;
                    }
                    defaultChartLabels = canvas.set();
                    if(!fieldsAniPathAttr || fieldsAniPathAttr.length <= k || (ani.enabled && !seTrans.enabled)) {
                        needAnimated = true;
                    }
                    if(needAnimated) {
                        if(valuesY.length > 0) {
                            firstYPoint = chart.ChartUtil.getFirstValidListValue(valuesY);
                            if(isYTime) {
                                firstYPoint = $.toOADate(firstYPoint);
                            }
                            lastYPoint = chart.ChartUtil.getLastValidListValue(valuesY);
                            if(isYTime) {
                                lastYPoint = $.toOADate(lastYPoint);
                            }
                        }
                    }
                    valsY = _this.processYValues(valuesY, lineSeries.display, hole, stacked, lastValuesY);
                    $.each(valuesY, function (j, valY) {
                        valX = valuesX[j];
                        if(isXTime) {
                            valX = $.toOADate(valX);
                        }
                        valY = valuesY[j];
                        if(valsY[j].isHole) {
                            if(lineSeries.display === "excludeHole") {
                                return true;
                            }
                            if(!valsY[j].isValue) {
                                return true;
                            }
                        }
                        if(isYTime) {
                            valY = $.toOADate(valY);
                        }
                        if(valX === undefined) {
                            return false;
                        }
                        pathArr = _this.renderPoint(cBounds, canvas, initAniPath, pathArr, markers, aniMarkersAttr, animationSet, defaultChartLabels, aniLabelsAttr, chartLabelEles, chartLabelFormatString, needAnimated, firstYPoint, lastYPoint, valX, valY, lineData.y[j], axis, fitType, isXTime, isYTime, j, lineMarkerStyle, lineMarkerHoverStyle, lineSeries, paintSymbol, showChartLabels, symbols, valuesX, valuesY, valsY, lineSeries.display, stacked, virtualMarkers, culture, wijCSS);
                    });
                    _this.renderPath(canvas, cBounds, lineSeries, paths, shadowPaths, linesStyle, lineHoverStyle, lineMarkerStyle, lineMarkerHoverStyle, markers, markersSet, animationSet, pathArr, aniPathsAttr, initAniPath, lineStyle, chartLabelStyle, aniMarkersAttr, aniLabelsAttr, defaultChartLabels, k, type, lastPathAttr, stacked, virtualMarkers, wijCSS);
                    seriesEles.push({
                        markers: markers,
                        path: paths[paths.length - 1],
                        shadowPath: shadowPaths[shadowPaths.length - 1],
                        dcl: defaultChartLabels
                    });
                });
                //fix #35792
                $.each($.merge([], paths).reverse(), function (idx, path) {
                    path.toFront();
                    if(path.area) {
                        path.area.toFront();
                    }
                });
                //end #35792
                $.each(paths, function (idx, path) {
                    if(path.tracker) {
                        path.tracker.toFront();
                    }
                });
                //markers should always be in front of trackers.
                $.each(paths, function (idx, path) {
                    if(path.markers) {
                        path.markers.toFront();
                    }
                });
            };
            LineChartRender.prototype.renderPath = function (canvas, bounds, lineSeries, paths, shadowPaths, linesStyle, lineHoverStyle, lineMarkerStyle, lineMarkerHoverStyle, markers, markersSet, animationSet, pathArr, aniPathsAttr, initAniPath, lineStyle, chartLabelStyle, aniMarkersAttr, aniLabelsAttr, defaultChartLabels, pathIdx, type, lastPathAttr, stacked, virtualMarkers, wijCSS) {
                var path, fill, fillOpacity, opacity, area, startX, endX, tracker, trackerWidth, labelStyle, prevPathArr, prevPath, currentPathArr, idx, noFillStyle;
                path = canvas.path(pathArr.join(" "));
                path.straight = initAniPath.join(" ");
                //shadow
                chart.ChartUtil.paintShadow(path, 1, "#cccccc");
                if(pathIdx === 0) {
                    lastPathAttr.length = 0;
                    if(pathArr.length > 1) {
                        startX = pathArr[1];
                        endX = pathArr[pathArr.length - 2];
                    } else {
                        startX = bounds.startX;
                        endX = bounds.endX;
                    }
                    $.merge(lastPathAttr, [
                        "L", 
                        startX, 
                        bounds.endY, 
                        "L", 
                        endX, 
                        bounds.endY
                    ]);
                }
                tracker = canvas.path(pathArr.join(" "));
                path.tracker = tracker;
                if(lineStyle["stroke-width"]) {
                    trackerWidth = 10 + parseFloat(lineStyle["stroke-width"]);
                } else {
                    trackerWidth = 10;
                }
                tracker.attr({
                    "stroke-width": trackerWidth,
                    stroke: "#C0C0C0",
                    opacity: 0.01
                });
                $.wijraphael.addClass($(tracker.node), Raphael.format("{0} {1} {2}", wijCSS.canvasObject, wijCSS.lineElement, wijCSS.lineTracker));
                $(tracker.node).data("owner", $(path.node));
                if(type === "area") {
                    if(lineStyle.fill && lineStyle.fill !== "none") {
                        fill = lineStyle.fill;
                        delete lineStyle.fill;
                    } else {
                        fill = lineStyle.stroke;
                    }
                    fillOpacity = 0.5;
                    opacity = 1;
                    if(lineStyle["fill-opacity"] && lineStyle["fill-opacity"] !== "none") {
                        fillOpacity = lineStyle["fill-opacity"];
                    }
                    if(lineStyle["opacity"] && lineStyle["opacity"] !== "none") {
                        opacity = lineStyle["opacity"];
                    }
                    path.wijAttr(lineStyle);
                    if(pathArr.length > 1) {
                        startX = pathArr[1];
                    } else {
                        startX = bounds.startX;
                    }
                    if(stacked) {
                        //fix #35792
                        /*
                        if (pathIdx > 0) {
                        prevPathArr = Raphael.parsePathString(
                        paths[pathIdx - 1].attr("path"));
                        if (prevPathArr && prevPathArr.length > 0) {
                        for (idx = prevPathArr.length - 1; idx >= 0; idx--) {
                        prevPath = prevPathArr[idx];
                        if (prevPath.length === 3) {
                        pathArr.push("L");
                        pathArr.push(prevPath[1]);
                        pathArr.push(prevPath[2]);
                        }
                        }
                        pathArr.push("Z");
                        }
                        }
                        else {
                        */
                        pathArr.push("V");
                        pathArr.push(bounds.endY);
                        pathArr.push("H");
                        pathArr.push(startX);
                        pathArr.push("Z");
                        //}
                        //end
                                            } else {
                        currentPathArr = Raphael.parsePathString(path.attr("path"));
                        if(currentPathArr && currentPathArr.length > 0) {
                            pathArr = [];
                            $.each(currentPathArr, function (i, currentPath) {
                                $.each(currentPath, function (j, val) {
                                    pathArr.push(val);
                                });
                                if(currentPath[0] === "M") {
                                    startX = currentPath[1];
                                }
                                if(i < currentPathArr.length - 1 && currentPathArr[i + 1][0] === "M") {
                                    pathArr.push("V");
                                    pathArr.push(bounds.endY);
                                    pathArr.push("H");
                                    pathArr.push(startX);
                                    pathArr.push("Z");
                                }
                                if(i === currentPathArr.length - 1) {
                                    pathArr.push("V");
                                    pathArr.push(bounds.endY);
                                    pathArr.push("H");
                                    pathArr.push(startX);
                                    pathArr.push("Z");
                                }
                            });
                        }
                    }
                    area = canvas.path(pathArr.join(" "));
                    $.wijraphael.addClass($(area.node), wijCSS.areaElement);
                    area.wijAttr({
                        fill: fill,
                        opacity: opacity,
                        "fill-opacity": fillOpacity,
                        stroke: "none"
                    });
                    initAniPath.push("V");
                    initAniPath.push(bounds.endY);
                    initAniPath.push("H");
                    initAniPath.push(startX);
                    initAniPath.push("Z");
                    area.straight = initAniPath.join(" ");
                    //area.toBack();
                    path.area = area;
                    animationSet.push(area);
                    aniPathsAttr.push({
                        path: $.extend(true, {
                        }, path.attr()),
                        area: $.extend(true, {
                        }, area.attr()),
                        markers: aniMarkersAttr,
                        labels: aniLabelsAttr
                    });
                } else {
                    //remove fill attribute when painting line.
                    //path.wijAttr(lineStyle);
                    noFillStyle = $.extend(true, {
                    }, lineStyle);
                    if(noFillStyle.fill) {
                        delete noFillStyle.fill;
                    }
                    path.wijAttr(noFillStyle);
                    //end comments.
                    aniPathsAttr.push({
                        path: $.extend(true, {
                        }, path.attr()),
                        markers: aniMarkersAttr,
                        labels: aniLabelsAttr
                    });
                }
                path.markers = markers;
                paths.push(path);
                if(path.shadow) {
                    shadowPaths[pathIdx] = path.shadow;
                }
                animationSet.push(path);
                linesStyle[pathIdx] = {
                    lineStyle: lineStyle,
                    lineHoverStyle: lineHoverStyle,
                    markerStyle: lineMarkerStyle,
                    markerHoverStyle: lineMarkerHoverStyle
                };
                if(!lineSeries.markers.visible || lineSeries.display === "hide") {
                    markers.hide();
                }
                if(!lineSeries.visible || lineSeries.display === "hide") {
                    path.hide();
                    if(path.tracker) {
                        path.tracker.hide();
                    }
                    if(path.shadow) {
                        path.shadow.hide();
                    }
                    if(path.area) {
                        path.area.hide();
                    }
                    path.visible = false;
                }
                if(lineSeries.markers.style) {
                    markers.attr(lineSeries.markers.style);
                }
                markers.toFront();
                if(defaultChartLabels.length) {
                    labelStyle = $.extend(true, {
                    }, chartLabelStyle);
                    if(lineSeries.textStyle) {
                        labelStyle = $.extend(true, labelStyle, lineSeries.textStyle);
                    }
                    defaultChartLabels.attr(labelStyle);
                    defaultChartLabels.toFront();
                    path.labels = defaultChartLabels;
                }
                markersSet[pathIdx] = markers;
                lineSeries.index = pathIdx;
                lineSeries.type = "line";
                lineSeries.path = path;
                lineSeries.lineMarkers = markers;
                lineSeries.lineStyle = lineStyle;
                lineSeries.lineHoverStyle = lineHoverStyle;
                lineSeries.virtualMarkers = virtualMarkers;
                $.wijraphael.addClass($(path.node), Raphael.format("{0} {1}", wijCSS.canvasObject, wijCSS.lineElement));
                $(path.node).data("wijchartDataObj", lineSeries);
            };
            LineChartRender.prototype.renderPoint = function (cBounds, canvas, initAniPath, pathArr, markers, aniMarkersAttr, animationSet, defaultChartLabels, aniLabelsAttr, chartLabelEles, chartLabelFormatString, needAnimated, firstYPoint, lastYPoint, valX, valY, dataY, axis, fitType, isXTime, isYTime, pointIdx, lineMarkerStyle, lineMarkerHoverStyle, lineSeries, paintSymbol, showChartLabels, symbols, valuesX, valuesY, valsY, display, stacked, virtualMarkers, culture, wijCSS) {
                var width = cBounds.endX - cBounds.startX, height = cBounds.endY - cBounds.startY, minX = axis.x.min, minY = axis.y.min, maxX = axis.x.max, maxY = axis.y.max, kx = width / (maxX - minX), ky = height / (maxY - minY), marker, dot, val, X = 0, Y, initAniY, markerData, defaultChartLabel, markerVisible = lineSeries.markers.visible, widget = this.widget, pointX;
                if(isNaN(valX) || typeof valX === "string") {
                    val = pointIdx;
                } else {
                    val = valX;
                }
                X = cBounds.startX + (val - minX) * kx;
                Y = cBounds.endY - (valY - minY) * ky;
                valsY[pointIdx].x = X;
                valsY[pointIdx].y = Y;
                if(needAnimated) {
                    initAniY = firstYPoint + (lastYPoint - firstYPoint) / (maxX - minX) * (val - minX);
                    initAniY = cBounds.endY - (initAniY - minY) * ky;
                    initAniPath.push(valsY[pointIdx].idx ? "L" : "M");
                    initAniPath.push(X);
                    initAniPath.push(initAniY);
                }
                if(!valsY[pointIdx].isHole) {
                    pathArr = this.getPathArrByFitType(pathArr, fitType, pointIdx, valuesY.length, cBounds, valuesX, valuesY, X, Y, isXTime, isYTime, valX, valY, kx, ky, minX, minY, valsY, display, stacked);
                } else {
                    return pathArr;
                }
                if(showChartLabels) {
                    defaultChartLabel = this.renderChartLabel(canvas, isYTime, valY, chartLabelFormatString, X, Y, culture, wijCSS);
                    chartLabelEles.push(defaultChartLabel);
                    defaultChartLabels.push(defaultChartLabel);
                    aniLabelsAttr.push($.extend(true, {
                    }, defaultChartLabel.attr()));
                }
                if(markerVisible) {
                    marker = this.renderMarker(canvas, symbols, paintSymbol, lineSeries.markers, pointIdx, X, Y, lineMarkerStyle, wijCSS);
                    dot = marker.dot;
                    if(needAnimated) {
                        dot.straight = initAniY;
                    }
                }
                markerData = {
                };
                markerData.valX = valuesX[pointIdx];
                markerData.valY = dataY;
                markerData.index = pointIdx;
                markerData.type = "marker";
                markerData.lineSeries = lineSeries;
                markerData.x = X;
                markerData.y = Y;
                markerData.markerStyle = lineMarkerStyle;
                markerData.markerHoverStyle = lineMarkerHoverStyle;
                markerData.visible = true;
                if(markerVisible) {
                    markerData.marker = dot;
                    markerData.isSymbol = marker.isSymbol;
                    $(dot.node).data("wijchartDataObj", markerData);
                    markers.push(dot);
                    aniMarkersAttr.push($.extend(true, {
                    }, dot.attr()));
                    animationSet.push(dot);
                }
                // cache the bar position to show indicator line.
                widget.dataPoints = widget.dataPoints || {
                };
                widget.pointXs = widget.pointXs || [];
                pointX = $.round(X, 2);
                if(!widget.dataPoints[pointX.toString()]) {
                    widget.dataPoints[pointX.toString()] = [];
                    widget.pointXs.push(pointX);
                }
                widget.dataPoints[pointX.toString()].push(markerData);
                virtualMarkers.push(markerData);
                return pathArr;
            };
            LineChartRender.prototype.processYValues = function (values, display, hole, stacked, lastValues) {
                var vals = [], idx = 0, firstYIdx = 0;
                $.each(values, function (i, value) {
                    if(!idx) {
                        firstYIdx = i;
                    }
                    var val = {
                        isHole: false,
                        isValue: true,
                        idx: idx,
                        firstYIdx: firstYIdx,
                        x: 0,
                        y: 0
                    };
                    idx++;
                    if(chart.ChartUtil.isHolefunction(value, hole)) {
                        if(stacked) {
                            values[i] = 0;
                        } else {
                            val.isHole = true;
                            if(display === "excludeHole") {
                                idx--;
                                val.idx = 0;
                            } else {
                                idx = 0;
                                val.idx = 0;
                            }
                            if(!chart.ChartUtil.isHolefunction(hole, undefined) && value === hole) {
                                val.isValue = true;
                            } else {
                                val.isValue = false;
                            }
                        }
                    }
                    vals.push(val);
                    if(stacked && i < lastValues.length) {
                        values[i] += lastValues[i];
                    }
                });
                lastValues.length = 0;
                $.merge(lastValues, values);
                return vals;
            };
            LineChartRender.prototype.renderMarker = function (canvas, symbols, paintSymbol, markers, markerIdx, X, Y, lineMarkerStyle, wijCSS) {
                var symbs, dot = null, isSymbol = false, markerType, markerWidth;
                if(paintSymbol) {
                    symbs = markers.symbol;
                    $.each(symbs, function (idx, symbol) {
                        if(symbol.index === markerIdx) {
                            dot = canvas.image(symbol.url, X - symbol.width / 2, Y - symbol.height / 2, symbol.width, symbol.height);
                            symbols.push(dot);
                            isSymbol = true;
                            return false;
                        }
                    });
                }
                if(dot === null) {
                    markerType = markers.type;
                    markerWidth = lineMarkerStyle.width;
                    dot = canvas.paintMarker(markerType, X, Y, markerWidth);
                    if(markers.visible) {
                        dot.attr(lineMarkerStyle);
                    }
                }
                $.wijraphael.addClass($(dot.node), Raphael.format("{0} {1} {2}", wijCSS.canvasObject, wijCSS.lineElement, wijCSS.canvasMarker));
                return {
                    dot: dot,
                    isSymbol: isSymbol
                };
            };
            LineChartRender.prototype.renderChartLabel = function (canvas, isYTime, valY, chartLabelFormatString, X, Y, culture, wijCSS) {
                var labelText, defaultChartLabel, dclBox, widget = this.options.widget;
                //Add comments by RyanWu@20110707.
                //For supporting date time value on y axi.
                //labelText = valY;
                labelText = isYTime ? $.fromOADate(valY) : valY;
                //end by RyanWu@20110707.
                if(chartLabelFormatString && chartLabelFormatString.length) {
                    labelText = Globalize.format(labelText, chartLabelFormatString, culture);
                }
                defaultChartLabel = widget._text.call(widget, X, Y, labelText);
                $.wijraphael.addClass($(defaultChartLabel.node), wijCSS.lineLabel);
                dclBox = defaultChartLabel.wijGetBBox();
                defaultChartLabel.transform(Raphael.format("...T{0},{1}", 0, -dclBox.height));
                return defaultChartLabel;
            };
            LineChartRender.prototype.getAnchors = function (p1x, p1y, p2x, p2y, p3x, p3y) {
                var l1 = (p2x - p1x) / 2, l2 = (p3x - p2x) / 2, a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)), b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y)), alpha = 0, dx1 = 0, dy1 = 0, dx2 = 0, dy2 = 0;
                a = p1y < p2y ? Math.PI - a : a;
                b = p3y < p2y ? Math.PI - b : b;
                alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2;
                dx1 = l1 * Math.sin(alpha + a);
                dy1 = l1 * Math.cos(alpha + a);
                dx2 = l2 * Math.sin(alpha + b);
                dy2 = l2 * Math.cos(alpha + b);
                return {
                    x1: p2x - dx1,
                    y1: p2y + dy1,
                    x2: p2x + dx2,
                    y2: p2y + dy2
                };
            };
            LineChartRender.prototype.getPathArrByFitType = function (pathArr, fitType, idx, len, cBounds, valuesX, valuesY, X, Y, isXTime, isYTime, valX, valY, kx, ky, minX, minY, valsY, display, stacked) {
                var valY2 = null, Y0 = 0, Y2 = 0, X0 = 0, X2 = 0, valX2 = null, a = null, valueY = valsY[idx], isNextPointHole = false, index = valueY.idx, i, prevIdx = idx - 1, nextIdx = idx + 1;
                if(display === "excludeHole" && !stacked) {
                    if(idx > 0 && idx < len - 1) {
                        nextIdx = -1;
                        prevIdx = -1;
                        for(i = idx + 1; i < len; i++) {
                            isNextPointHole = true;
                            if(valsY[i].isHole) {
                                continue;
                            }
                            nextIdx = i;
                            isNextPointHole = false;
                            break;
                        }
                        for(i = idx - 1; i >= 0; i--) {
                            if(valsY[i].isHole) {
                                continue;
                            }
                            prevIdx = i;
                            break;
                        }
                        if(prevIdx > -1) {
                            X0 = valsY[prevIdx].x;
                            Y0 = valsY[prevIdx].y;
                        }
                    }
                } else {
                    if(idx < len - 1) {
                        isNextPointHole = valsY[nextIdx].isHole;
                    }
                    if(idx > 0 && idx < len - 1) {
                        X0 = valsY[prevIdx].x;
                        Y0 = valsY[prevIdx].y;
                    }
                }
                if(stacked) {
                    fitType = "line";
                }
                if(fitType === "line") {
                    pathArr = pathArr.concat([
                        index ? "L" : "M", 
                        X, 
                        Y
                    ]);
                } else if(fitType === "spline") {
                    if(!index) {
                        if(idx === len - 1) {
                            pathArr = pathArr.concat([
                                "M", 
                                X, 
                                Y
                            ]);
                        } else if(isNextPointHole) {
                            pathArr = pathArr.concat([
                                "M", 
                                X, 
                                Y
                            ]);
                        } else {
                            pathArr = pathArr.concat([
                                "M", 
                                X, 
                                Y, 
                                "C", 
                                X, 
                                Y
                            ]);
                        }
                    } else if(index && idx < len - 1 && !isNextPointHole) {
                        valY2 = valuesY[nextIdx];
                        if(isYTime) {
                            valY2 = $.toOADate(valY2);
                        }
                        Y2 = cBounds.endY - (valY2 - minY) * ky;
                        if(isNaN(valX) || typeof valX === "string") {
                            X2 = cBounds.startX + (nextIdx - minX) * kx;
                        } else {
                            valX2 = valuesX[nextIdx];
                            if(isXTime) {
                                valX2 = $.toOADate(valX2);
                            }
                            X2 = cBounds.startX + (valX2 - minX) * kx;
                        }
                        a = this.getAnchors(X0, Y0, X, Y, X2, Y2);
                        pathArr = pathArr.concat([
                            a.x1, 
                            a.y1, 
                            X, 
                            Y, 
                            a.x2, 
                            a.y2
                        ]);
                    } else {
                        pathArr = pathArr.concat([
                            X, 
                            Y, 
                            X, 
                            Y
                        ]);
                    }
                } else if(fitType === "bezier") {
                    if(!index) {
                        pathArr = pathArr.concat([
                            "M", 
                            X, 
                            Y
                        ]);
                    } else if((idx < len - 1 && valsY[idx + 1].isHole && index % 2 === 1) || (idx === len - 1 && index % 2 === 1)) {
                        pathArr = pathArr.concat([
                            "Q", 
                            X, 
                            Y, 
                            X, 
                            Y
                        ]);
                    } else {
                        if(index % 2 === 0) {
                            pathArr = pathArr.concat([
                                X, 
                                Y
                            ]);
                        } else {
                            pathArr = pathArr.concat([
                                "Q", 
                                X, 
                                Y
                            ]);
                        }
                    }
                }
                return pathArr;
            };
            LineChartRender.prototype.bindLiveEvents = function (element, canvas, cBounds, widgetName, mouseDown, mouseUp, mouseOver, mouseOut, mouseMove, click, disabled, hint, linesStyle, tooltip, wijCSS) {
                var touchEventPre = "", proxyObj = {
                    element: element,
                    mousedown: function (e) {
                        if(disabled) {
                            return;
                        }
                        var tar = $(e.target), data, lineSeries = null;
                        if(tar.data("owner")) {
                            tar = tar.data("owner");
                        }
                        data = tar.data("wijchartDataObj");
                        if(tar.hasClass(wijCSS.canvasMarker)) {
                            lineSeries = data.lineSeries;
                            if(!lineSeries.markers.visible) {
                                mouseDown.call(element, e, lineSeries);
                            } else {
                                mouseDown.call(element, e, data);
                            }
                        } else {
                            mouseDown.call(element, e, data);
                        }
                    },
                    mouseup: function (e) {
                        if(disabled) {
                            return;
                        }
                        var tar = $(e.target), data, lineSeries = null;
                        if(tar.data("owner")) {
                            tar = tar.data("owner");
                        }
                        data = tar.data("wijchartDataObj");
                        if(tar.hasClass(wijCSS.canvasMarker)) {
                            lineSeries = data.lineSeries;
                            if(!lineSeries.markers.visible) {
                                mouseUp.call(element, e, lineSeries);
                            } else {
                                mouseUp.call(element, e, data);
                            }
                        } else {
                            mouseUp.call(element, e, data);
                        }
                    },
                    mouseover: function (e) {
                        if(disabled) {
                            return;
                        }
                        var tar = $(e.target), data, lineSeries = null;
                        if(tar.data("owner")) {
                            tar = tar.data("owner");
                        }
                        data = tar.data("wijchartDataObj");
                        if(tar.hasClass(wijCSS.canvasMarker)) {
                            lineSeries = data.lineSeries;
                            if(!lineSeries.markers.visible) {
                                mouseOver.call(element, e, lineSeries);
                            } else {
                                mouseOver.call(element, e, data);
                            }
                        } else {
                            mouseOver.call(element, e, data);
                        }
                    },
                    mouseout: function (e) {
                        if(disabled) {
                            return;
                        }
                        var tar = $(e.target), data, lineSeries = null;
                        if(tar.data("owner")) {
                            tar = tar.data("owner");
                        }
                        data = tar.data("wijchartDataObj");
                        if(tar.hasClass(wijCSS.canvasMarker)) {
                            lineSeries = data.lineSeries;
                            if(!lineSeries.markers.visible) {
                                mouseOut.call(element, e, lineSeries);
                            } else {
                                mouseOut.call(element, e, data);
                            }
                        } else {
                            mouseOut.call(element, e, data);
                        }
                    },
                    mousemove: function (e) {
                        if(disabled) {
                            return;
                        }
                        var tar = $(e.target), data, lineSeries = null;
                        if(tar.data("owner")) {
                            tar = tar.data("owner");
                        }
                        data = tar.data("wijchartDataObj");
                        if(tar.hasClass(wijCSS.canvasMarker)) {
                            lineSeries = data.lineSeries;
                            if(!lineSeries.markers.visible) {
                                mouseMove.call(element, e, lineSeries);
                            } else {
                                mouseMove.call(element, e, data);
                            }
                        } else {
                            mouseMove.call(element, e, data);
                        }
                    },
                    click: function (e) {
                        if(disabled) {
                            return;
                        }
                        var tar = $(e.target), data, lineSeries = null;
                        if(tar.data("owner")) {
                            tar = tar.data("owner");
                        }
                        data = tar.data("wijchartDataObj");
                        if(tar.hasClass(wijCSS.canvasMarker)) {
                            lineSeries = data.lineSeries;
                            if(!lineSeries.markers.visible) {
                                click.call(element, e, lineSeries);
                            } else {
                                click.call(element, e, data);
                            }
                        } else {
                            click.call(element, e, data);
                        }
                    }
                };
                if($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    touchEventPre = "wij";
                }
                element.on(touchEventPre + "mousedown." + widgetName, "." + wijCSS.lineElement, $.proxy(proxyObj.mousedown, proxyObj)).on(touchEventPre + "mouseup." + widgetName, "." + wijCSS.lineElement, $.proxy(proxyObj.mouseup, proxyObj)).on(touchEventPre + "mouseover." + widgetName, "." + wijCSS.lineElement, $.proxy(proxyObj.mouseover, proxyObj)).on(touchEventPre + "mouseout." + widgetName, "." + wijCSS.lineElement, $.proxy(proxyObj.mouseout, proxyObj)).on(touchEventPre + "mousemove." + widgetName, "." + wijCSS.lineElement, $.proxy(proxyObj.mousemove, proxyObj)).on(touchEventPre + "click." + widgetName, "." + wijCSS.lineElement, $.proxy(proxyObj.click, proxyObj));
            };
            LineChartRender.prototype.unbindLiveEvents = function (element, widgetName, wijCSS) {
                element.off("." + widgetName, "." + wijCSS.lineElement);
            };
            return LineChartRender;
        })();
        chart.LineChartRender = LineChartRender;        
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
