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
/*globals $, Raphael, jQuery, document, window, navigator*/
/*
* Depends:
*  jquery.js
*	raphael.js
*  jquery.wijmo.raphael.js
*	globalize.min.js
*	jquery.ui.widget.js
*	jquery.wijmo.wijchartcore.js
*
*/
var wijmo;
(function (wijmo) {
    var WijScatterChart = (function (_super) {
        __extends(WijScatterChart, _super);
        function WijScatterChart() {
            _super.apply(this, arguments);

        }
        WijScatterChart.prototype._create = function () {
            var self = this;
            self._handleChartStyles();
            _super.prototype._create.call(this);
            self.chartElement.addClass(self.options.wijCSS.scatter);
        };
        WijScatterChart.prototype.destroy = function () {
            /// <summary>
            /// Remove the functionality completely.
            /// This will return the element back to its pre-init state
            /// Code example:
            /// $(“#scatterchart”).wijscatterchart(“destroy”);
            /// </summary>
            var self = this;
            self.chartElement.removeClass(self.options.wijCSS.scatter);
            _super.prototype.destroy.call(this);
        };
        WijScatterChart.prototype.getScatter = function (seriesIndex, scatterIndex) {
            /// <summary>
            /// Returns the scatter element with the given series index and
            /// scatter index.
            /// Code Example:
            /// $("wijscatterchart").wijscatterchart("getScatter", "0", 1);
            /// </summary>
            /// <param name="seriesIndex" type="Number">
            /// The index of the series
            /// </param>
            /// <param name="scatterIndex" type="Number">
            /// The index of the scatter element
            /// </param>
            /// <returns type="Element">
            /// if scatterIndex is not specified, return a list of scatters of
            /// specified seriesIndex, else return the specified scatter element
            /// </returns>
                        var self = this, fields = self.chartElement.data("fields"), und, len, scatters, scatter;
            if(fields && fields.chartElements) {
                scatters = fields.chartElements.scatters;
                if(scatters && scatters.length) {
                    len = scatters.length;
                    if(seriesIndex < 0 || seriesIndex >= len) {
                        return und;
                    }
                    scatter = scatters[seriesIndex];
                    if(typeof scatterIndex === "undefined") {
                        return scatter;
                    }
                    len = scatter.length;
                    if(scatter && len) {
                        if(scatterIndex < 0 || scatterIndex >= len) {
                            return und;
                        }
                        return scatter[scatterIndex];
                    }
                }
                return und;
            }
        };
        WijScatterChart.prototype._paintLegendIcon = function (x, y, width, height, style, legendIndex, seriesIndex, legendCss, series, leg) {
            var self = this, r = Math.min(width, height), markerStyle, type = series.markerType, icon;
            markerStyle = series.markerStyle;
            markerStyle = $.extend({
                fill: style.stroke,
                stroke: style.stroke,
                opacity: 1
            }, markerStyle);
            if(!type) {
                type = "circle";
            }
            icon = self.canvas.paintMarker(type, x + width / 2, y + height / 2, 3);
            $(icon.node).data("legendIndex", legendIndex).data("index", seriesIndex);
            self.legendIcons.push(icon);
            icon.attr(markerStyle);
            $.wijraphael.addClass($(icon.node), legendCss);
            if(series.visible === false) {
                $(leg.node).data("dotOpacity", icon.attr("opacity") || 1);
                icon.attr("opacity", 0.3);
            }
            return icon;
        };
        WijScatterChart.prototype._paintLegend = function () {
            var self = this, o = self.options, chartsSeries = [].concat(o.seriesList), chartsSeriesStyle = o.seriesStyles, idx = 0;
            $.extend(true, o, {
                legend: {
                    size: {
                        width: 20,
                        height: 10
                    }
                }
            });
            _super.prototype._paintLegend.call(this);
            //if (o.legend.visible) {
            //	//hide legendIcons
            //	if (self.legends.length && self.legendIcons.length) {
            //		$.each(self.legendIcons, function (idx, icon) {
            //			icon.hide();
            //		});
            //	}
            //	//add marker to legendIcons
            //	if (o.legend.reversed) {
            //		chartsSeries.reverse();
            //	}
            //	$.each(chartsSeries, function (i, chartSeries) {
            //		var type = chartSeries.markerType,
            //			legendIcon,
            //			box,
            //			x,
            //			y,
            //			seriesStyle = o.legend.reversed ?
            //				chartsSeriesStyle[chartsSeries.length - 1 - i] :
            //				chartsSeriesStyle[i],
            //			style:any = $.extend(true, {}, seriesStyle),
            //			leg = o.legend.textWidth ?
            //				self.legends[idx][0] : self.legends[idx],
            //			dot;
            //		if (style.stroke && !style.fill) {
            //			style.fill = style.stroke;
            //		}
            //		if (chartSeries.legendEntry &&
            //				chartSeries.display !== "exclude") {
            //			if ((chartSeries.data.x === undefined &&
            //			chartSeries.data.xy === undefined) ||
            //			chartSeries.data.y === undefined &&
            //			chartSeries.data.xy === undefined
            //				) {
            //				return true;
            //			}
            //			legendIcon = self.legendIcons[idx];
            //			box = legendIcon.wijGetBBox();
            //			x = box.x + box.width / 2;
            //			y = box.y + box.height / 2;
            //			if (!type) {
            //				type = "circle";
            //			}
            //			dot = self.canvas.paintMarker(type, x, y, 3);
            //			$.wijraphael.addClass($(dot.node),
            //			o.wijCSS.legendDot + " " + o.wijCSS.canvasObject + " " + o.wijCSS.legend);
            //			dot.attr(style);
            //			self.legendDots.push(dot);
            //			$(dot.node).data("legendIndex",
            //				$(leg.node).data("legendIndex"))
            //				.data("index", $(leg.node).data("index"));
            //			self.legendEles.push(dot);
            //			if (chartSeries.visible === false) {
            //				$(leg.node).data("dotOpacity",
            //						dot.attr("opacity") || 1);
            //				dot.attr("opacity", 0.3);
            //			}
            //			idx++;
            //		}
            //	});
            //}
                    };
        WijScatterChart.prototype._showSerieEles = function (seriesEle) {
            $.each(seriesEle, function (i, dot) {
                dot.show();
                if(dot.label) {
                    dot.label.show();
                }
                if($(dot.element).data("wijchartDataObj")) {
                    $(dot.element).data("wijchartDataObj").visible = true;
                }
            });
        };
        WijScatterChart.prototype._hideSerieEles = function (seriesEle) {
            $.each(seriesEle, function (i, dot) {
                dot.hide();
                if(dot.label) {
                    dot.label.hide();
                }
                if($(dot.element).data("wijchartDataObj")) {
                    $(dot.element).data("wijchartDataObj").visible = false;
                }
            });
        };
        WijScatterChart.prototype._indicatorLineShowing = function (objs) {
            _super.prototype._indicatorLineShowing.call(this, objs);
            $.each(objs, function (i, obj) {
                if(obj.dot) {
                    obj.dot.attr(obj.hoverStyle);
                    obj.dot.scale(1.5, 1.5);
                }
            });
        };
        WijScatterChart.prototype._removeIndicatorStyles = function (objs) {
            $.each(objs, function (i, obj) {
                if(obj.dot) {
                    obj.dot.attr(obj.style);
                    obj.dot.scale(1, 1);
                }
            });
        };
        WijScatterChart.prototype._paintTooltip = function () {
            var self = this, element = self.chartElement, fields = element.data("fields");
            _super.prototype._paintTooltip.call(this);
            if(self.tooltip) {
                if(fields && fields.chartElements && fields.chartElements.tooltipTars) {
                    self.tooltip.setTargets(fields.chartElements.tooltipTars);
                    self.tooltip.setOptions({
                        mouseTrailing: false
                    });
                }
            }
        };
        WijScatterChart.prototype._getTooltipText = function (fmt, target) {
            var dataObj = $(target).data("wijchartDataObj"), obj = {
                data: dataObj,
                label: dataObj.label,
                x: dataObj.x,
                y: dataObj.y,
                type: dataObj.markerType,
                target: target,
                fmt: fmt
            };
            return $.proxy(fmt, obj)();
        };
        WijScatterChart.prototype._onBeforeTooltipShowing = function (tooltip) {
            var self = this, o = tooltip.options, hintStyle = self.options.hint.style, target = tooltip.target, obj, dotStyle;
            if(target) {
                if($.browser.msie && parseInt($.browser.version) < 9) {
                    obj = $(target).data().wijchartDataObj;
                    dotStyle = obj.style;
                    o.style.stroke = hintStyle.stroke || dotStyle.stroke || dotStyle.fill || "#ffffff";
                } else {
                    o.style.stroke = hintStyle.stroke || target.getAttribute("stroke") || target.getAttribute("fill") || "#ffffff";
                }
                target.attrs = {
                    stroke: o.style.stroke
                };
            }
            _super.prototype._onBeforeTooltipShowing.call(this, tooltip);
        };
        WijScatterChart.prototype._clearChartElement = function () {
            var self = this, fields = self.chartElement.data("fields");
            if(self.headerEles.length) {
                $.each(self.headerEles, function (idx, headerEle) {
                    headerEle.wijRemove();
                    headerEle = null;
                });
                self.headerEles = [];
            }
            if(self.footerEles.length) {
                $.each(self.footerEles, function (idx, footerEle) {
                    footerEle.wijRemove();
                    footerEle = null;
                });
                self.footerEles = [];
            }
            if(self.legendEles.length) {
                $.each(self.legendEles, function (idx, legendEle) {
                    legendEle.wijRemove();
                    legendEle = null;
                });
                self.legendEles = [];
            }
            if(self.legends.length) {
                $.each(self.legends, function (idx, legend) {
                    legend.wijRemove();
                    legend = null;
                });
                self.legends = [];
            }
            if(self.legendIcons.length) {
                $.each(self.legendIcons, function (idx, legendIcon) {
                    legendIcon.wijRemove();
                    legendIcon = null;
                });
                self.legendIcons = [];
            }
            if(self.legendDots.length) {
                $.each(self.legendDots, function (idx, legendDot) {
                    legendDot = null;
                });
                self.legendDots = [];
            }
            if(self.axisEles.length) {
                $.each(self.axisEles, function (idx, axisEle) {
                    axisEle.wijRemove();
                    axisEle = null;
                });
                self.axisEles = [];
            }
            if(self.chartLabelEles.length) {
                $.each(self.chartLabelEles, function (idx, chartLabelEle) {
                    chartLabelEle.wijRemove();
                    chartLabelEle = null;
                });
                self.chartLabelEles = [];
            }
            if(fields && fields.chartElements) {
                $.each(fields.chartElements, function (key, eles) {
                    if(eles.length) {
                        $.each(eles, function (i, ele) {
                            if(ele[0] !== null) {
                                if(ele.remove) {
                                    ele.remove();
                                }
                                eles[i] = null;
                            }
                        });
                    }
                    fields.chartElements[key] = null;
                });
                fields.chartElements = {
                };
                $(fields.clipRect.element).stop().remove();
                fields.render.destroy();
                fields.clipRect.destroy();
            }
            self.dataPoints = null;
            self.pointXs = null;
            self.canvas.clear();
            self.innerState = {
            };
        };
        WijScatterChart.prototype._paintPlotArea = function () {
            var self = this, o = self.options, scatterRender;
            scatterRender = new ScatterChartRender(this.chartElement, {
                bounds: self.canvasBounds,
                widgetName: self.widgetName,
                canvas: self.canvas,
                tooltip: self.tooltip,
                axis: o.axis,
                animation: o.animation,
                seriesTransition: o.seriesTransition,
                seriesList: o.seriesList,
                seriesStyles: o.seriesStyles,
                seriesHoverStyles: o.seriesHoverStyles,
                hint: o.hint,
                disabled: o.disabled,
                isXTime: //plotInfo: plotInfo,
                self.axisInfo.x.isTime,
                isYTime: self.axisInfo.y[0].isTime,
                zoomOnHover: o.zoomOnHover,
                mouseDown: $.proxy(self._mouseDown, self),
                mouseUp: $.proxy(self._mouseUp, self),
                mouseOver: $.proxy(self._mouseOver, self),
                mouseOut: $.proxy(self._mouseOut, self),
                mouseMove: $.proxy(self._mouseMove, self),
                click: $.proxy(self._click, self),
                showChartLabels: o.showChartLabels,
                chartLabelStyle: o.chartLabelStyle,
                chartLabelFormatString: o.chartLabelFormatString,
                culture: self._getCulture(),
                wijCSS: o.wijCSS,
                widget: this
            });
            scatterRender.render();
        };
        return WijScatterChart;
    })(wijmo.WijChartCore);
    wijmo.WijScatterChart = WijScatterChart;    
    WijScatterChart.prototype.widgetEventPrefix = "wijscatterchart";
    WijScatterChart.prototype.options = $.extend(true, {
    }, wijmo.WijChartCore.prototype.options, {
        initSelector: /// <summary>
        /// Selector option for auto self initialization.
        ///	This option is internal.
        /// </summary>
        ":jqmData(role='wijscatterchart')",
        wijCSS: {
            scatter: "wijmo-wijscatterchart",
            scatterElement: "wijscatterchart"
        },
        animation: /// <summary>
        /// An option that controls aspects of the widget's animation, such as duration and easing.
        /// Default: {direction: "horizontal",enabled:true,
        /// duration:2000, easing: ">"}.
        /// Type: Object.
        /// Code example:
        /// $("#scatter").wijscatterchart({
        ///		animation: {
        ///			enabled: true,
        ///			duration: 1000
        ///		}
        /// })
        /// </summary>
        {
            enabled: /// <summary>
            /// A value that determines whether to show animation.
            /// Default: false.
            /// Type: Boolean.
            /// </summary>
            true,
            duration: /// <summary>
            /// A value that indicates the duration for the animation.
            /// Default: 2000.
            /// Type: Number.
            /// </summary>
            2000,
            easing: /// <summary>
            /// Sets the type of animation easing effect that users experience when the wijscatterchart
            /// series is loaded to the page. For example, a user can have the wijscatterchart series
            /// bounce several times as it loads.
            /// Remark: The easing is defined in Raphael, the documentation is:
            /// http://raphaeljs.com/reference.html#Raphael.easing_formulas
            /// Default: ">".
            /// Type: string.
            /// </summary>
            ">"
        },
        showChartLabels: // / <summary>
        // / A value that indicates whether to show default chart labels.
        // / Default: false.
        // / Type: Boolean.
        // / Code example:
        // / $("#scatterchart").wijscatterchart({
        // / showChartLabels:false
        // / });
        // / </summary>
        false,
        seriesTransition: /// <summary>
        /// The seriesTransition option is used to animate series in the chart when just their
        /// values change. This is helpful for visually showing changes in data for the same series.
        /// Default: {enabled:true, duration:2000, easing: ">"}.
        /// Type: Object.
        /// Code example:
        ///  $("#scatterchart").wijscatterchart({
        ///      animation: {enabled: true, duration: 1000, easing: "<"}
        ///  });
        /// </summary>
        {
            enabled: /// <summary>
            /// A value that determines whether to show animation when reloading data.
            /// Default: false.
            /// Type: Boolean.
            /// </summary>
            true,
            duration: /// <summary>
            /// A value that indicates the duration for the series transition.
            /// Default: 2000.
            /// Type: Number.
            /// </summary>
            2000,
            easing: /// <summary>
            /// A value that indicates the easing for the series transition.
            /// Remark: The easing is defined in Raphael, the documentation is:
            /// http://raphaeljs.com/reference.html#Raphael.easing_formulas
            /// Default: ">".
            /// Type: string.
            /// </summary>
            ">"
        },
        zoomOnHover: /// <summary>
        /// A value that indicates whether to zoom in on the marker on hover.
        /// Default: true.
        /// Type: Boolean.
        /// Code example:
        /// $("#scatterchart").wijscatterchart("option", "zoomOnHover", false);
        /// </summary>
        true,
        mouseDown: /// <summary>
        /// Occurs when the user clicks a mouse button.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        ///  $("#scatterchart").wijscatterchart({mouseDown: function(e, data) { } });
        /// Bind to the event by type: wijscattercharttmousedown
        /// $("#scatterchart").bind("wijscatterchartmousedown",function(e, data){});
        /// </summary>
        /// <param name="e" type="eventObj">
        /// jQuery.Event object.
        ///	</param>
        /// <param name="data" type="Object">
        /// An object that contains all the series infos of the mousedown scatter.
        /// data.marker: The Raphael object of the marker.
        /// data.data: The data of the series of the marker.
        /// data.hoverStyle: The hover style of the series of the marker.
        /// data.type: "scatter".
        /// data.label: The label of the series of the marker.
        /// data.index: index of the marker.
        /// data.legendEntry: The legend entry of the series of the marker.
        /// data.style: The style of the series of the marker.
        /// data.x: value x of the marker.
        /// data.y: value y of the marker.
        ///	</param>
        null,
        mouseUp: /// <summary>
        /// Fires when the user releases a mouse button
        /// while the pointer is over the chart element.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        ///  $("#scatterchart").wijscatterchart({mouseUp: function(e, data) { } });
        /// Bind to the event by type: wijscatterchartmouseup
        /// $("#scatterchart").bind("wijscatterchartmouseup", function(e, data) {} );
        /// </summary>
        /// <param name="e" type="eventObj">
        /// jQuery.Event object.
        ///	</param>
        /// <param name="data" type="Object">
        /// An object that contains all the series infos of the mouseup marker.
        /// data.marker: The Raphael object of the marker.
        /// data.data: The data of the series of the marker.
        /// data.hoverStyle: The hover style of the series of the marker.
        /// data.type: "scatter".
        /// data.label: The label of the series of the marker.
        /// data.index: index of the marker.
        /// data.legendEntry: The legend entry of the series of the marker.
        /// data.style: The style of the series of the marker.
        /// data.x: value x of the marker.
        /// data.y: value y of the marker.
        ///	</param>
        null,
        mouseOver: /// <summary>
        /// Fires when the user first places the pointer over the chart element.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        ///  $("#scatterchart").wijscatterchart({mouseOver: function(e, data) { } });
        /// Bind to the event by type: wijscatterchartmouseover
        /// $("#scatterchart").bind("wijscatterchartmouseover",function(e, data){});
        /// </summary>
        /// <param name="e" type="eventObj">
        /// jQuery.Event object.
        ///	</param>
        /// <param name="data" type="Object">
        /// An object that contains all the series infos of the mouseover marker.
        /// data.marker: The Raphael object of the marker.
        /// data.data: The data of the series of the marker.
        /// data.hoverStyle: The hover style of the series of the marker.
        /// data.type: "scatter".
        /// data.label: The label of the series of the marker.
        /// data.index: index of the marker.
        /// data.legendEntry: The legend entry of the series of the marker.
        /// data.style: The style of the series of the marker.
        /// data.x: value x of the marker.
        /// data.y: value y of the marker.
        ///	</param>
        null,
        mouseOut: /// <summary>
        /// Fires when the user moves the pointer off of the chart element.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        ///  $("#scatterchart").wijscatterchart({mouseOut: function(e, data) { } });
        /// Bind to the event by type: wijscatterchartmouseout
        /// $("#scatterchart").bind("wijscatterchartmouseout", function(e, data) {} );
        /// </summary>
        /// <param name="e" type="eventObj">
        /// jQuery.Event object.
        ///	</param>
        /// <param name="data" type="Object">
        /// An object that contains all the series infos of the mouseout marker.
        /// data.marker: The Raphael object of the marker.
        /// data.data: The data of the series of the marker.
        /// data.hoverStyle: The hover style of the series of the marker.
        /// data.type: "scatter".
        /// data.label: The label of the series of the marker.
        /// data.index: index of the marker.
        /// data.legendEntry: The legend entry of the series of the marker.
        /// data.style: The style of the series of the marker.
        /// data.x: value x of the marker.
        /// data.y: value y of the marker.
        ///	</param>
        null,
        mouseMove: /// <summary>
        /// Fires when the user moves the mouse pointer
        /// while it is over a chart element.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        ///  $("#scatterchart").wijscatterchart({mouseMove: function(e, data) { } });
        /// Bind to the event by type: wijscatterchartmousemove
        /// $("#scatterchart").bind("wijscatterchartmousemove",function(e, data){});
        /// </summary>
        /// <param name="e" type="eventObj">
        /// jQuery.Event object.
        ///	</param>
        /// <param name="data" type="Object">
        /// An object that contains all the series infos of the mousemove marker.
        /// data.marker: The Raphael object of the marker.
        /// data.data: The data of the series of the marker.
        /// data.hoverStyle: The hover style of the series of the marker.
        /// data.type: "scatter".
        /// data.label: The label of the series of the marker.
        /// data.index: index of the marker.
        /// data.legendEntry: The legend entry of the series of the marker.
        /// data.style: The style of the series of the marker.
        /// data.x: value x of the marker.
        /// data.y: value y of the marker.
        ///	</param>
        null,
        click: /// <summary>
        /// Fires when the user clicks the chart element.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        ///  $("#scatterchart").wijscatterchart({click: function(e, data) { } });
        /// Bind to the event by type: wijscatterchartclick
        /// $("#scatterchart").bind("wijscatterchartclick", function(e, data) {} );
        /// </summary>
        /// <param name="e" type="eventObj">
        /// jQuery.Event object.
        ///	</param>
        /// <param name="data" type="Object">
        /// An object that contains all the series infos of the clicked marker.
        /// data.marker: The Raphael object of the marker.
        /// data.data: The data of the series of the marker.
        /// data.hoverStyle: The hover style of the series of the marker.
        /// data.type: "scatter".
        /// data.label: The label of the series of the marker.
        /// data.index: index of the marker.
        /// data.legendEntry: The legend entry of the series of the marker.
        /// data.style: The style of the series of the marker.
        /// data.x: value x of the marker.
        /// data.y: value y of the marker.
        ///	</param>
        null
    });
    $.wijmo.registerWidget("wijscatterchart", WijScatterChart.prototype);
    var ScatterChartRender = (function () {
        function ScatterChartRender(element, options) {
            this.scatters = [];
            this.chartLabels = [];
            this.tooltipTars = [];
            this.seriesEles = [];
            this.element = element;
            this.options = options;
            this._init();
        }
        ScatterChartRender.prototype._init = function () {
            var element = this.element, o = this.options, bounds = o.bounds, minX = o.axis.x.min, minY = o.axis.y.min, maxX = o.axis.x.max, maxY = o.axis.y.max;
            this.width = bounds.endX - bounds.startX;
            this.height = bounds.endY - bounds.startY;
            this.plotInfo = {
                minX: minX,
                minY: minY,
                maxX: maxX,
                maxY: maxY,
                width: this.width,
                height: this.height,
                kx: this.width / (maxX - minX),
                ky: this.height / (maxY - minY)
            };
            this.fields = element.data("fields") || {
            };
            if(element.find("svg").length > 0) {
                this.chartRender = chartRender.createRender(element.find("svg").get(0), element.width(), element.height());
            } else {
                this.chartRender = chartRender.createRender(element.children(":first").addClass("vmlcontainer").get(0), element.width(), element.height());
            }
            this.clipRect = this.chartRender.clipRect(0, 0, 0, element.height());
            this.g = this.chartRender.g();
            this.g.clip(this.clipRect);
            this.g.add();
            this.fields.render = this.chartRender;
            this.fields.clipRect = this.clipRect;
        };
        ScatterChartRender.prototype.bindLiveEvents = function () {
            var isFunction = $.isFunction, o = this.options, wijCSS = o.wijCSS, element = this.element, widgetName = o.widgetName, mouseDown = o.mouseDown, mouseUp = o.mouseUp, mouseOver = o.mouseOver, mouseOut = o.mouseOut, mouseMove = o.mouseMove, click = o.click, zoomOnHover = o.zoomOnHover, seriesHoverStyles = o.seriesHoverStyles, seriesStyles = o.seriesStyles, disabled = o.disabled;
            $("." + wijCSS.scatterElement, element[0]).on("mousedown." + widgetName, function (e) {
                if(disabled) {
                    return;
                }
                if(isFunction(mouseDown)) {
                    var dataObj = $(e.target).data("wijchartDataObj");
                    if(!dataObj) {
                        dataObj = $(e.target.parentNode).data("wijchartDataObj");
                    }
                    mouseDown.call(element, e, dataObj);
                }
            }).on("mouseup." + widgetName, function (e) {
                if(disabled) {
                    return;
                }
                if(isFunction(mouseUp)) {
                    var dataObj = $(e.target).data("wijchartDataObj");
                    if(!dataObj) {
                        dataObj = $(e.target.parentNode).data("wijchartDataObj");
                    }
                    mouseUp.call(element, e, dataObj);
                }
            }).on("mouseover." + widgetName, function (e) {
                if(disabled) {
                    return;
                }
                var dataObj = $(e.target).data("wijchartDataObj"), seriesIndex, style, dot;
                if(!dataObj) {
                    dataObj = $(e.target.parentNode).data("wijchartDataObj");
                }
                dot = dataObj.dot;
                if(zoomOnHover) {
                    seriesIndex = dataObj.seriesIndex;
                    if(dot.attr) {
                        //								style = $.extend(true, dot.attr(),
                        //									seriesHoverStyles[seriesIndex]);
                        style = $.extend(true, {
                        }, seriesHoverStyles[seriesIndex]);
                        dot.attr(style);
                    }
                    if(document.createElementNS) {
                        dot.scale(1.5, 1.5);
                    } else {
                        dot.attr("stroke-width", 5);
                    }
                }
                if(isFunction(mouseOver)) {
                    mouseOver.call(element, e, dataObj);
                }
            }).on("mouseout." + widgetName, function (e) {
                if(disabled) {
                    return;
                }
                var dataObj = $(e.target).data("wijchartDataObj"), seriesIndex, dot;
                if(!dataObj) {
                    dataObj = $(e.target.parentNode).data("wijchartDataObj");
                }
                dot = dataObj.dot;
                if(zoomOnHover) {
                    seriesIndex = dataObj.seriesIndex;
                    if(dot.attr) {
                        dot.attr($.extend(true, {
                        }, seriesStyles[seriesIndex]));
                    }
                }
                if(document.createElementNS) {
                    dot.scale(1, 1);
                }
                if(isFunction(mouseOut)) {
                    mouseOut.call(element, e, dataObj);
                }
            }).on("mousemove." + widgetName, function (e) {
                if(disabled) {
                    return;
                }
                if(isFunction(mouseMove)) {
                    var dataObj = $(e.target).data("wijchartDataObj");
                    if(!dataObj) {
                        dataObj = $(e.target.parentNode).data("wijchartDataObj");
                    }
                    mouseMove.call(element, e, dataObj);
                }
            }).on("click." + widgetName, function (e) {
                if(disabled) {
                    return;
                }
                if(isFunction(click)) {
                    var dataObj = $(e.target).data("wijchartDataObj");
                    if(!dataObj) {
                        dataObj = $(e.target.parentNode).data("wijchartDataObj");
                    }
                    click.call(element, e, dataObj);
                }
            });
        };
        ScatterChartRender.prototype.unbindLiveEvents = function () {
            var o = this.options, widgetName = o.widgetName, wijCSS = o.wijCSS;
            $("." + wijCSS.scatterElement, this.element).off(widgetName).off(// for jQuery 1.7.1
            "." + widgetName);
        };
        ScatterChartRender.prototype.paintDefaultChartLabel = function (x, y, val) {
            var o = this.options, textStyle = $.extend(true, {
            }, o.textStyle, o.chartLabelStyle), text, chartLabelFormatString = o.chartLabelFormatString, dcl;
            if(o.isYTime) {
                text = Globalize.format(val, "f", o.culture);
            } else {
                text = $.round(val, 2);
            }
            if(chartLabelFormatString && chartLabelFormatString.length) {
                text = Globalize.format(text, chartLabelFormatString, o.culture);
            }
            dcl = this.chartRender.text(x, y, text);
            return dcl;
        };
        ScatterChartRender.prototype.paintScatters = function () {
            var self = this, o = self.options, seriesList = o.seriesList, seriesStyles = o.seriesStyles, seriesHoverStyles = o.seriesHoverStyles, isXTime = o.isXTime, isYTime = o.isYTime, bounds = o.bounds, plotInfo = this.plotInfo, wijCSS = o.wijCSS, showChartLabels = o.showChartLabels, labelStyle = o.chartLabelStyle, widget = o.widget;
            $.each(seriesList, function (i, series) {
                var data = series.data, type, markerWidth = series.markerWidth || 5, style = seriesStyles[i], hoverStyle = seriesHoverStyles[i], valuesX = data.x, valuesY = data.y, scatter = [], seriesEle = [], pointX;
                series = $.extend(true, {
                    visible: true,
                    markerType: "circle"
                }, series);
                type = series.markerType;
                if(series.display === "exclude") {
                    return true;
                }
                if(!style.fill && style.stroke) {
                    style.fill = style.stroke;
                }
                if(valuesX === undefined) {
                    return true;
                }
                $.each(valuesY, function (j, valY) {
                    var valX = valuesX[j], X = 0, Y = 0, val, dot, chartLabel, dotData = {
                    };
                    if(isXTime) {
                        valX = $.toOADate(valX);
                    }
                    if(isYTime) {
                        valY = $.toOADate(valY);
                    }
                    if(typeof (valX) === "undefined") {
                        return false;
                    }
                    if(isNaN(valX) || typeof valX === "string") {
                        val = j;
                    } else {
                        val = valX;
                    }
                    X = bounds.startX + (val - plotInfo.minX) * plotInfo.kx;
                    Y = bounds.endY - (valY - plotInfo.minY) * plotInfo.ky;
                    if(style.opacity) {
                        style["fill-opacity"] = style.opacity;
                        style["stroke-opacity"] = style.opacity;
                        delete (style.opacity);
                    }
                    if(type === "cross" && style["stroke-width"] !== undefined && style["stroke-width"] === 0) {
                        style["stroke-width"] = 1;
                    }
                    //handle gradient fill.
                    //fill = style.fill;
                    //fill = fill.replace(/[\(\)\s,\xb0#]/g, "_");
                    dot = self.chartRender.symbol(type, X, Y, markerWidth);
                    dot.attr(style);
                    dot.add(self.g);
                    dot.attr({
                        "class": wijCSS.canvasObject + " " + wijCSS.scatterElement
                    });
                    dotData = $.extend(false, {
                        dot: dot,
                        x: valuesX[j],
                        y: valuesY[j],
                        seriesIndex: i,
                        index: j,
                        markerType: type,
                        type: "scatter",
                        style: style,
                        hoverStyle: hoverStyle,
                        visible: true
                    }, series);
                    // paint label
                    if(showChartLabels) {
                        chartLabel = self.paintDefaultChartLabel(X, Y - 6, valuesY[j]);
                        chartLabel.add(self.g);
                        //self.chartRender.text(X, Y - 6, valuesY[j]).add(self.g);
                        labelStyle = $.extend({
                            "font-size": "10px",
                            fill: "#888",
                            "font-family": "Arial"
                        }, labelStyle);
                        chartLabel.attr(labelStyle);
                        dot.label = chartLabel;
                        self.chartLabels.push(chartLabel);
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
                    widget.dataPoints[pointX.toString()].push(dotData);
                    $(dot.element).data("wijchartDataObj", dotData);
                    scatter.push(dot);
                    self.tooltipTars.push($.extend({
                    }, dot, {
                        node: dot.element
                    }));
                    seriesEle.push(dot);
                    if(series.visible === false) {
                        dot.hide();
                    }
                });
                self.scatters.push(scatter);
                self.seriesEles.push(seriesEle);
            });
        };
        ScatterChartRender.prototype.playAnimation = function () {
            var self = this, o = self.options, ani = o.animation, element = self.element, bgColor = element.css("background-color");
            if(ani.enabled) {
                if(bgColor === "transparent") {
                    bgColor = "white";
                }
                if(self.clipRect.getCSS) {
                    $(self.clipRect.members[0].element).animate({
                        width: element.width()
                    }, {
                        duration: ani.duration,
                        step: function (val) {
                            self.clipRect.width = val;
                            var clipcss = self.clipRect.getCSS();
                            $(this).css(clipcss);
                        }
                    });
                } else {
                    $(self.clipRect.element).animate({
                        width: element.width()
                    }, {
                        duration: ani.duration,
                        step: function (val) {
                            self.clipRect.attr("width", val);
                        }
                    });
                }
            } else {
                if(self.clipRect.getCSS) {
                    $(self.clipRect.members[0].element).css({
                        width: element.width()
                    });
                    self.clipRect.width = element.width();
                    $(self.clipRect.members[0].element).css(self.clipRect.getCSS());
                } else {
                    $(self.clipRect.element).css({
                        width: element.width()
                    });
                    self.clipRect.attr("width", element.width());
                }
            }
        };
        ScatterChartRender.prototype.render = function () {
            this.paintScatters();
            this.playAnimation();
            this.unbindLiveEvents();
            this.bindLiveEvents();
            this.chartEles = {
                animationSet: this.animationSet,
                tooltipTars: this.tooltipTars,
                scatters: this.scatters,
                labels: this.chartLabels
            };
            if(!this.fields.chartElements) {
                this.fields.chartElements = {
                };
            }
            this.fields.seriesEles = this.seriesEles;
            $.extend(true, this.fields.chartElements, this.chartEles);
            this.element.data("fields", this.fields);
        };
        return ScatterChartRender;
    })();
    wijmo.ScatterChartRender = ScatterChartRender;    
})(wijmo || (wijmo = {}));
var chartRender;
(function (chartRender) {
    var doc = document, each = $.each, isIE = $.browser.msie, docMode8 = doc.documentMode === 8, SVG_NS = 'http://www.w3.org/2000/svg', hasSVG = !!doc.createElementNS && !!doc.createElementNS(SVG_NS, 'svg')["createSVGRect"], _counter = 0, DIV = 'div', ABSOLUTE = 'absolute', HIDDEN = 'hidden', PREFIX = 'scatterchart-', VISIBLE = 'visible', VISIBILITY = "visibility", PX = 'px', NONE = 'none', M = 'M', L = 'L', regRadialGradient = /^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/, regLinearGradient = /^(\d{1,3})\-(?:((?:[a-zA-Z]+)|(?:\#[0-9a-fA-F]{6})|(?:\#[0-9a-fA-F]{3}))\-)(?:(?:((?:(?:[a-zA-Z]+)|(?:\#[0-9a-fA-F]{6})|(?:\#[0-9a-fA-F]{3}))(?:\:\d{1,3})?)\-)?)*((?:[a-zA-Z]+)|(?:\#[0-9a-fA-F]{6})|(?:\#[0-9a-fA-F]{3}))$/;
    function isString(s) {
        return typeof s === 'string';
    }
    function isNumber(n) {
        return typeof n === 'number';
    }
    function defined(obj) {
        return obj !== undefined && obj !== null;
    }
    function attr(elem, prop, value) {
        var setAttr = 'setAttribute', ret;
        if(isString(prop)) {
            if(defined(value)) {
                elem[setAttr](prop, value);
            } else if(elem && elem.getAttribute) {
                ret = elem.getAttribute(prop);
            }
        } else if(defined(prop) && $.isPlainObject(prop)) {
            $.each(prop, function (key, val) {
                elem[setAttr](key, val);
            });
        }
        return ret;
    }
    function css(el, styles) {
        if(isIE) {
            if(styles && styles.opacity !== undefined) {
                styles.filter = 'alpha(opacity=' + (styles.opacity * 100) + ')';
            }
        }
        $.extend(el.style, styles);
    }
    function createElement(tag, attribs, styles) {
        var el = doc.createElement(tag);
        if(attribs) {
            $.extend(el, attribs);
        }
        if(styles) {
            css(el, styles);
        }
        return el;
    }
    function destroyObjectProperties(obj) {
        $.each(obj, function (key, node) {
            if(obj[key] && obj[key].destroy) {
                obj[key].destroy();
            }
            delete obj[key];
        });
    }
    var ChartElement = (function () {
        function ChartElement() { }
        ChartElement.prototype.attr = function (hash, val) {
        };
        ChartElement.prototype.scale = function (x, y) {
        };
        ChartElement.prototype.symbolAttr = function (hash) {
        };
        ChartElement.prototype.clip = function (clipRect) {
        };
        ChartElement.prototype.crisp = function (strokeWidth, x, y, width, height) {
        };
        ChartElement.prototype.css = function (styles) {
        };
        ChartElement.prototype.getBBox = function () {
        };
        ChartElement.prototype.show = function () {
        };
        ChartElement.prototype.hide = function () {
        };
        ChartElement.prototype.add = function (parent) {
        };
        ChartElement.prototype.destroy = function () {
        };
        ChartElement.prototype.empty = function () {
        };
        ChartElement.prototype.remove = function () {
        };
        return ChartElement;
    })();
    chartRender.ChartElement = ChartElement;    
    var ChartRender = (function () {
        function ChartRender(container, width, height) {
        }
        ChartRender.prototype.destroy = function () {
        };
        ChartRender.prototype.createElement = function (nodeName) {
        };
        ChartRender.prototype.path = function (path) {
            return this._element;
        };
        ChartRender.prototype.circle = function (x, y, r) {
            return this._element;
        };
        ChartRender.prototype.rect = function (x, y, width, height, r, strokeWidth) {
            return this._element;
        };
        ChartRender.prototype.setSize = function (width, height) {
        };
        ChartRender.prototype.g = function (name) {
            return this._element;
        };
        ChartRender.prototype.text = function (x, y, text) {
            return this._element;
        };
        ChartRender.prototype.symbol = function (_symbol, x, y, radius, options) {
            return this._element;
        };
        ChartRender.prototype.clipRect = function (x, y, width, height) {
            return this._element;
        };
        return ChartRender;
    })();
    chartRender.ChartRender = ChartRender;    
    var SVGElement = (function (_super) {
        __extends(SVGElement, _super);
        function SVGElement() {
            _super.apply(this, arguments);

        }
        SVGElement.prototype.init = function (renderer, nodeName) {
            this.element = doc.createElementNS(SVG_NS, nodeName);
            this.renderer = renderer;
        };
        SVGElement.prototype.attr = function (hash, val) {
            var key, value, element = this.element, renderer = this.renderer, nodeName = element.nodeName, skipAttr, ret = this;
            if(hash === undefined) {
                return;
            }
            if(isString(hash) && defined(val)) {
                key = hash;
                hash = {
                };
                hash[key] = val;
            }
            if(isString(hash)) {
                key = hash;
                if(nodeName === 'circle') {
                    key = {
                        x: 'cx',
                        y: 'cy'
                    }[key] || key;
                }
                ret = attr(element, key) || this[key] || 0;
                if(key !== 'd' && key !== VISIBILITY) {
                    ret = parseFloat(ret);
                }
            } else if(hash) {
                $.each(hash, function (key, v) {
                    skipAttr = false;
                    value = hash[key];
                    if(key === 'd') {
                        if(value && value.join) {
                            value = value.join(' ');
                        }
                        if(/(NaN| {2}|^$)/.test(value)) {
                            value = 'M 0 0';
                        }
                        this.d = value;
                        // apply gradients
                                            } else if(key === 'fill') {
                        value = renderer._color(value, element, key);
                    } else if(nodeName === 'circle' && (key === 'x' || key === 'y')) {
                        key = {
                            x: 'cx',
                            y: 'cy'
                        }[key] || key;
                    }
                    if(jQuery.browser.safari && key === 'stroke-width' && value === 0) {
                        value = 0.000001;
                    }
                    if(!skipAttr) {
                        attr(element, key, value);
                    }
                    // Fixed an issue that in composite chart, when show the tooltip, the chart will throw javascript exception
                    // save the attribute to attrs
                    element.attrs = element.attrs || {
                    };
                    element.attrs[key] = value;
                });
            }
            return ret;
        };
        SVGElement.prototype.scale = function (x, y) {
            var self = this, bbox = self.getBBox(), cx = -(bbox.x + bbox.width / 2) / 2, cy = -(bbox.y + bbox.height / 2) / 2;
            if(x === 1) {
                cx = 0;
            }
            if(y === 1) {
                cy = 0;
            }
            self.attr("transform", "matrix(" + x + ",0,0, " + y + "," + cx + "," + cy + ")");
        };
        SVGElement.prototype.symbolAttr = function (hash) {
            var self = this;
            each([
                'x', 
                'y', 
                'r', 
                'start', 
                'end', 
                'width', 
                'height', 
                'innerR'
            ], function (i, key) {
                if(hash[key]) {
                    self[key] = hash[key];
                } else {
                    self[key] = self[key];
                }
            });
            self.attr({
                d: self.renderer.symbols[self.symbolName](Math.round(self.x * 2) / 2, Math.round(self.y * 2) / 2, self.r, {
                    start: self.start,
                    end: self.end,
                    width: self.width,
                    height: self.height,
                    innerR: self.innerR
                })
            });
        };
        SVGElement.prototype.clip = function (clipRect) {
            return this.attr('clip-path', 'url(' + this.renderer.url + '#' + clipRect.id + ')');
        };
        SVGElement.prototype.crisp = function (strokeWidth, x, y, width, height) {
            var self = this, key, attr = {
            }, values = {
            }, normalizer;
            strokeWidth = strokeWidth || self.strokeWidth || 0;
            normalizer = strokeWidth % 2 / 2;
            values.x = Math.floor(x || self.x || 0) + normalizer;
            values.y = Math.floor(y || self.y || 0) + normalizer;
            values.width = Math.floor((width || self.width || 0) - 2 * normalizer);
            values.height = Math.floor((height || self.height || 0) - 2 * normalizer);
            values.strokeWidth = strokeWidth;
            for(key in values) {
                if(self[key] !== values[key]) {
                    // only set attribute if changed
                    self[key] = attr[key] = values[key];
                }
            }
            return attr;
        };
        SVGElement.prototype.css = function (styles) {
            var self = this, elem = self.element, textWidth = styles && styles.width && elem.nodeName === 'text', serializedCss = '', hyphenate = function (a, b) {
                return '-' + b.toLowerCase();
            };
            if(styles && styles.color) {
                styles.fill = styles.color;
            }
            styles = $.extend(self.styles, styles);
            self.styles = styles;
            if(isIE && !hasSVG) {
                if(textWidth) {
                    delete styles.width;
                }
                css(self.element, styles);
            } else {
                $.each(styles, function (i, n) {
                    serializedCss += n.replace(/([A-Z])/g, hyphenate) + ':' + styles[n] + ';';
                });
                self.attr({
                    style: serializedCss
                });
            }
            return self;
        };
        SVGElement.prototype.getBBox = function () {
            var bBox, width, height, rotation = this.rotation, rad = rotation * Math.PI * 2 / 360;
            try  {
                bBox = $.extend({
                }, this.element.getBBox());
            } catch (e) {
                bBox = {
                    width: 0,
                    height: 0
                };
            }
            width = bBox.width;
            height = bBox.height;
            if(rotation) {
                bBox.width = Math.abs(height * Math.sin(rad)) + Math.abs(width * Math.cos(rad));
                bBox.height = Math.abs(height * Math.cos(rad)) + Math.abs(width * Math.sin(rad));
            }
            return bBox;
        };
        SVGElement.prototype.show = function () {
            return this.attr({
                visibility: VISIBLE
            });
        };
        SVGElement.prototype.hide = function () {
            return this.attr({
                visibility: HIDDEN
            });
        };
        SVGElement.prototype.add = function (parent) {
            var self = this, renderer = self.renderer, parentWrapper = parent || renderer, parentNode = parentWrapper.element || renderer.box, childNodes = parentNode.childNodes, element = self.element, zIndex = attr(element, 'zIndex'), otherElement, otherZIndex, i;
            if(parent && self.htmlNode) {
                if(!parent.htmlNode) {
                    parent.htmlNode = [];
                }
                parent.htmlNode.push(self);
            }
            if(zIndex) {
                parentWrapper.handleZ = true;
                zIndex = parseInt(zIndex, 10);
            }
            if(parentWrapper.handleZ) {
                for(i = 0; i < childNodes.length; i++) {
                    otherElement = childNodes[i];
                    otherZIndex = attr(otherElement, 'zIndex');
                    if(otherElement !== element && (parseInt(otherZIndex, 10) > zIndex || (!defined(zIndex) && defined(otherZIndex)))) {
                        parentNode.insertBefore(element, otherElement);
                        return self;
                    }
                }
            }
            parentNode.appendChild(element);
            self.added = true;
            return self;
        };
        SVGElement.prototype._safeRemoveChild = function (element) {
            var parentNode = element.parentNode;
            if(parentNode) {
                parentNode.removeChild(element);
            }
        };
        SVGElement.prototype.destroy = function () {
            var wrapper = this, element = wrapper.element || {
            }, shadows = wrapper.shadows, box = wrapper.box, i;
            // remove events
            element.onclick = element.onmouseout = element.onmouseover = element.onmousemove = null;
            if(wrapper.clipPath) {
                wrapper.clipPath = wrapper.clipPath.destroy();
            }
            // Destroy stops in case this is a gradient object
            if(wrapper.stops) {
                for(i = 0; i < wrapper.stops.length; i++) {
                    wrapper.stops[i] = wrapper.stops[i].destroy();
                }
                wrapper.stops = null;
            }
            // remove element
            wrapper._safeRemoveChild(element);
            // destroy shadows
            if(shadows) {
                each(shadows, function (shadow) {
                    wrapper._safeRemoveChild(shadow);
                });
            }
            // destroy label box
            if(box) {
                box.destroy();
            }
            $.each(wrapper, function (key, obj) {
                delete wrapper[key];
            });
            return null;
        };
        SVGElement.prototype.empty = function () {
            var element = this.element, childNodes = element.childNodes, i = childNodes.length;
            while(i--) {
                element.removeChild(childNodes[i]);
                $(childNodes[i]).remove();
            }
        };
        SVGElement.prototype.remove = function () {
            var ele = this.element, parentNode = ele.parentNode;
            parentNode.removeChild(ele);
            $(ele).remove();
        };
        return SVGElement;
    })(ChartElement);    
    var SVGRender = (function (_super) {
        __extends(SVGRender, _super);
        function SVGRender(container, width, height) {
                _super.call(this, container, width, height);
            this.gradientCache = {
            };
            this.symbols = {
                'box': function (x, y, radius) {
                    var len = 0.707 * radius;
                    return [
                        M, 
                        x - len, 
                        y - len, 
                        L, 
                        x + len, 
                        y - len, 
                        x + len, 
                        y + len, 
                        x - len, 
                        y + len, 
                        'Z'
                    ];
                },
                'tri': function (x, y, radius) {
                    return [
                        M, 
                        x, 
                        y - 1.33 * radius, 
                        L, 
                        x + radius, 
                        y + 0.67 * radius, 
                        x - radius, 
                        y + 0.67 * radius, 
                        'Z'
                    ];
                },
                'invertedTri': function (x, y, radius) {
                    return [
                        M, 
                        x, 
                        y + 1.33 * radius, 
                        L, 
                        x - radius, 
                        y - 0.67 * radius, 
                        x + radius, 
                        y - 0.67 * radius, 
                        'Z'
                    ];
                },
                'diamond': function (x, y, radius) {
                    return [
                        M, 
                        x, 
                        y - radius, 
                        L, 
                        x + radius, 
                        y, 
                        x, 
                        y + radius, 
                        x - radius, 
                        y, 
                        'Z'
                    ];
                },
                'cross': function (x, y, radius) {
                    var offset = 0.707 * radius;
                    return [
                        M, 
                        x - offset, 
                        y - offset, 
                        L, 
                        x + offset, 
                        y + offset, 
                        M, 
                        x - offset, 
                        y + offset, 
                        L, 
                        x + offset, 
                        y - offset
                    ];
                },
                'arc': function (x, y, radius, options) {
                    var start = options.start, end = options.end - 0.000001, innerRadius = options.innerR, cosStart = Math.cos(start), sinStart = Math.sin(start), cosEnd = Math.cos(end), sinEnd = Math.sin(end), longArc = options.end - start < Math.PI ? 0 : 1;
                    return [
                        M, 
                        x + radius * cosStart, 
                        y + radius * sinStart, 
                        'A', 
                        radius, 
                        radius, 
                        0, 
                        longArc, 
                        1, 
                        x + radius * cosEnd, 
                        y + radius * sinEnd, 
                        L, 
                        x + innerRadius * cosEnd, 
                        y + innerRadius * sinEnd, 
                        'A', 
                        innerRadius, 
                        innerRadius, 
                        0, 
                        longArc, 
                        0, 
                        x + innerRadius * cosStart, 
                        y + innerRadius * sinStart, 
                        'Z'
                    ];
                }
            };
            this.init(container, width, height);
        }
        SVGRender.prototype.init = function (container, width, height) {
            var self = this, loc = doc.location, boxWrapper;
            this.Element = SVGElement;
            if($(container).is("svg")) {
                self.box = container;
                boxWrapper = new self.Element();
                boxWrapper.element = container;
                boxWrapper.render = self;
                self.defs = $("defs", container).get(0);
                self.gradients = {
                };
            } else {
                boxWrapper = self.createElement('svg').attr({
                    xmlns: SVG_NS,
                    version: '1.1'
                });
                container.appendChild(boxWrapper.element);
                self.box = boxWrapper.element;
                self.boxWrapper = boxWrapper;
                self.defs = this.createElement('defs').add();
                self.gradients = {
                };
                self.setSize(width, height);
            }
            self.url = isIE ? '' : loc.href.replace(/#.*?$/, '');
        };
        SVGRender.prototype.destroy = function () {
            var self = this;
            self.box = null;
            destroyObjectProperties(self.gradients || {
            });
            self.gradients = null;
            return null;
        };
        SVGRender.prototype.createElement = function (nodeName) {
            var wrapper = new this.Element();
            wrapper.init(this, nodeName);
            return wrapper;
        };
        SVGRender.prototype.path = function (path) {
            var ret = this.createElement('path');
            ret.attr({
                d: path,
                fill: NONE
            });
            return ret;
        };
        SVGRender.prototype.circle = function (x, y, r) {
            var attr = $.isPlainObject(x) ? x : {
                x: x,
                y: y,
                r: r
            }, ret = this.createElement('circle');
            ret.attr(attr);
            return ret;
        };
        SVGRender.prototype.rect = function (x, y, width, height, r, strokeWidth) {
            if($.isPlainObject(x)) {
                y = x.y;
                width = x.width;
                height = x.height;
                r = x.r;
                strokeWidth = x.strokeWidth;
                x = x.x;
            }
            var wrapper = this.createElement('rect');
            wrapper.attr({
                rx: r,
                ry: r,
                fill: NONE
            });
            wrapper.attr(wrapper.crisp(strokeWidth, x, y, Math.max(width, 0), Math.max(height, 0)));
            return wrapper;
        };
        SVGRender.prototype.setSize = function (width, height) {
            var self = this;
            self.width = width;
            self.height = height;
            self.boxWrapper.attr({
                width: width,
                height: height
            });
        };
        SVGRender.prototype.g = function (name) {
            var elem = this.createElement('g');
            if(defined(name)) {
                elem.attr({
                    'class': PREFIX + name
                });
            }
            return elem;
        };
        SVGRender.prototype.text = function (x, y, text) {
            if($.isPlainObject(x)) {
                y = x.y;
                text = x.text;
                x = x.x;
            }
            var wrapper = this.createElement('text');
            wrapper.attr({
                x: x,
                y: y,
                "text-anchor": "middle"
            });
            wrapper.element.textContent = text;
            return wrapper;
        };
        SVGRender.prototype.symbol = function (symbol, x, y, radius, options) {
            var obj, self = this, symbolFn = self.symbols[symbol], path = symbolFn && symbolFn(Math.round(x), Math.round(y), radius, options);
            if(path) {
                obj = self.path(path);
                $.extend(obj, {
                    symbolName: symbol,
                    x: x,
                    y: y,
                    r: radius
                });
                if(options) {
                    $.extend(obj, options);
                }
            } else {
                obj = self.circle(x, y, radius);
            }
            return obj;
        };
        SVGRender.prototype.clipRect = function (x, y, width, height) {
            var wrapper, id = PREFIX + _counter++, clipPath = this.createElement('clipPath');
            clipPath.attr({
                id: id
            });
            $(this.defs).append(clipPath.element);
            wrapper = this.rect(x, y, width, height, 0).add(clipPath);
            wrapper.id = id;
            wrapper.clipPath = clipPath;
            return wrapper;
        };
        SVGRender.prototype._parsegradientcolor = function (gradient) {
            var self = this, dots = [], dot, par, i, start, end, ii, j, d;
            if(self.gradientCache[gradient]) {
                return self.gradientCache[gradient];
            }
            for(i = 0 , ii = gradient.length; i < ii; i++) {
                dot = {
                };
                par = gradient[i].match(/^([^:]*):?([\d\.]*)/);
                dot.color = Raphael.getRGB(par[1]);
                if(dot.color.error) {
                    return null;
                }
                dot.color = dot.color.hex;
                if(par[2]) {
                    dot.offset = par[2] + "%";
                }
                dots.push(dot);
            }
            for(i = 1 , ii = dots.length - 1; i < ii; i++) {
                if(!dots[i].offset) {
                    start = parseFloat(dots[i - 1].offset || 0);
                    end = 0;
                    for(j = i + 1; j < ii; j++) {
                        if(dots[j].offset) {
                            end = dots[j].offset;
                            break;
                        }
                    }
                    if(!end) {
                        end = 100;
                        j = ii;
                    }
                    end = parseFloat(end);
                    d = (end - start) / (j - i + 1);
                    for(; i < j; i++) {
                        start += d;
                        dots[i].offset = start + "%";
                    }
                }
            }
            self.gradientCache[gradient] = dots;
            return dots;
        };
        SVGRender.prototype._color = function (color, elem, prop) {
            var self = this, type = "color", fx = 0.5, fy = 0.5, gradients = self.gradients, gradientObject, gradient, x1, y1, x2, y2, stopColor, vector, max, stopOpacity, key = color, id, angle, stops;
            if(regLinearGradient.test(color)) {
                type = "linear";
            } else {
                color = color.replace(regRadialGradient, function (all, _fx, _fy) {
                    type = "radial";
                    if(_fx && _fy) {
                        fx = parseFloat(_fx);
                        fy = parseFloat(_fy);
                        var dir = ((fy > 0.5) ? 1 : 0 * 2 - 1);
                        if(Math.pow(fx - 0.5, 2) + Math.pow(fy - 0.5, 2) > 0.25 && (fy = Math.sqrt(0.25 - Math.pow(fx - 0.5, 2)) * dir + 0.5) && fy !== 0.5) {
                            fy = parseFloat(fy.toFixed(5)) - 1e-5 * dir;
                        }
                    }
                    return "";
                });
            }
            if(type === "linear" || type === "radial") {
                gradient = color.split(/\s*\-\s*/);
                if(type === "linear") {
                    angle = gradient.shift();
                    angle = -parseFloat(angle);
                    if(isNaN(angle)) {
                        return color;
                    }
                    vector = [
                        0, 
                        0, 
                        Math.cos(Raphael.rad(angle)), 
                        Math.sin(Raphael.rad(angle))
                    ];
                    max = 1 / (Math.max(Math.abs(vector[2]), Math.abs(vector[3])) || 1);
                    vector[2] *= max;
                    vector[3] *= max;
                    if(vector[2] < 0) {
                        vector[0] = -vector[2];
                        vector[2] = 0;
                    }
                    if(vector[3] < 0) {
                        vector[1] = -vector[3];
                        vector[3] = 0;
                    }
                    x1 = vector[0];
                    y1 = vector[1];
                    x2 = vector[2];
                    y2 = vector[3];
                }
                // If the gradient with the same setup is already created, reuse it
                if(gradients[key]) {
                    id = attr(gradients[key].element, 'id');
                    // If not, create a new one and keep the reference.
                                    } else {
                    stops = this._parsegradientcolor(gradient);
                    $.each(stops, function (i, stop) {
                        stop.offset = stop.offset ? stop.offset : i ? "100%" : "0%";
                    });
                    id = PREFIX + _counter++;
                    gradientObject = self.createElement(type + "Gradient");
                    if(type === "radial") {
                        gradientObject.attr({
                            id: id,
                            fx: fx,
                            fy: fy
                        });
                    } else {
                        gradientObject.attr({
                            id: id,
                            x1: x1,
                            y1: y1,
                            x2: x2,
                            y2: y2
                        });
                    }
                    $(this.defs).append(gradientObject.element);
                    // The gradient needs to keep a list of stops
                    // to be able to destroy them
                    gradientObject.stops = [];
                    $.each(stops, function (i, stop) {
                        var stopObject;
                        stopColor = stop.color;
                        stopOpacity = 1;
                        stopObject = self.createElement('stop');
                        stopObject.attr({
                            offset: stop.offset,
                            'stop-color': stopColor,
                            'stop-opacity': stopOpacity
                        }).add(gradientObject);
                        // Add the stop element to the gradient
                        gradientObject.stops.push(stopObject);
                    });
                    // Keep a reference to the gradient object so it is
                    // possible to reuse it and destroy it later
                    gradients[key] = gradientObject;
                }
                return 'url(#' + id + ')';
            } else {
                // Remove the opacity attribute added above.
                // Does not throw if the attribute is not there.
                elem.removeAttribute(prop + '-opacity');
                return color;
            }
        };
        return SVGRender;
    })(ChartRender);    
    var VMLElement = (function (_super) {
        __extends(VMLElement, _super);
        function VMLElement() {
            _super.apply(this, arguments);

        }
        VMLElement.prototype.init = function (renderer, nodeName) {
            var markup = [
                '<', 
                nodeName, 
                ' filled="f" stroked="f"'
            ], style = [
                'position: ', 
                ABSOLUTE, 
                ';'
            ];
            if(nodeName === 'shape' || nodeName === DIV) {
                style.push('left:0;top:0;width:10px;height:10px;');
            }
            if(docMode8) {
                style.push('visibility: ', nodeName === DIV ? HIDDEN : VISIBLE);
            }
            markup.push(' style="', style.join(''), '"/>');
            if(nodeName) {
                markup = nodeName === DIV || nodeName === 'span' || nodeName === 'img' ? markup.join('') : renderer.prepVML(markup);
                this.element = createElement(markup);
            }
            this.renderer = renderer;
        };
        VMLElement.prototype.add = function (parent) {
            var self = this, renderer = self.renderer, element = self.element, box = renderer.box, inverted = parent && parent.inverted, parentNode = parent ? parent.element || parent : box;
            if(inverted) {
                // to do this method?
                //renderer.invertChild(element, parentNode);
                            }
            if(docMode8 && parentNode.gVis === HIDDEN) {
                css(element, {
                    visibility: HIDDEN
                });
            }
            parentNode.appendChild(element);
            self.added = true;
            return self;
        };
        VMLElement.prototype.attr = function (hash, val) {
            var key, value, i, self = this, element = self.element || {
            }, elemStyle = element.style, nodeName = element.nodeName, symbolName = self.symbolName, renderer = self.renderer, childNodes, hasSetSymbolSize, shadows = self.shadows, skipAttr, convertedPath, ret = self;
            if(hash === undefined) {
                return ret;
            }
            if(isString(hash) && defined(val)) {
                key = hash;
                hash = {
                };
                hash[key] = val;
            }
            if(isString(hash)) {
                key = hash;
                if(key === 'strokeWidth' || key === 'stroke-width') {
                    ret = self.strokeweight;
                } else {
                    ret = self[key];
                }
            } else if(hash) {
                $.each(hash, function (key, v) {
                    value = v;
                    skipAttr = false;
                    if(symbolName && /^(x|y|r|start|end|width|height|innerR)/.test(key)) {
                        if(!hasSetSymbolSize) {
                            self.symbolAttr(hash);
                            hasSetSymbolSize = true;
                        }
                        skipAttr = true;
                    } else if(key === 'd') {
                        value = value || [];
                        self.d = value.join(' ');
                        i = value.length;
                        convertedPath = [];
                        while(i--) {
                            if(isNumber(value[i])) {
                                convertedPath[i] = Math.round(value[i] * 10) - 5;
                            } else if(value[i] === 'Z') {
                                convertedPath[i] = 'x';
                            } else {
                                convertedPath[i] = value[i];
                            }
                        }
                        value = convertedPath.join(' ') || 'x';
                        element.path = value;
                        if(shadows) {
                            i = shadows.length;
                            while(i--) {
                                shadows[i].path = value;
                            }
                        }
                        skipAttr = true;
                    } else if(key === 'zIndex' || key === VISIBILITY) {
                        if(docMode8 && key === VISIBILITY && nodeName === DIV) {
                            element.gVis = value;
                            childNodes = element.childNodes;
                            i = childNodes.length;
                            while(i--) {
                                css(childNodes[i], {
                                    visibility: value
                                });
                            }
                            if(value === VISIBLE) {
                                value = null;
                            }
                        }
                        if(value) {
                            elemStyle[key] = value;
                        }
                        skipAttr = true;
                    } else if(key === 'class') {
                        element.className = value;
                    } else if(key === 'stroke') {
                        key = 'strokecolor';
                    } else if(key === 'stroke-width' || key === 'strokeWidth') {
                        element.stroked = value ? true : false;
                        key = 'strokeweight';
                        self[key] = value;
                        if(isNumber(value)) {
                            value += PX;
                        }
                    } else if(key === 'fill') {
                        if(nodeName === 'SPAN') {
                            elemStyle.color = value;
                        } else {
                            element.filled = value !== NONE ? true : false;
                            value = renderer.color(value, element, key);
                            key = 'fillcolor';
                        }
                    }
                    if(!skipAttr) {
                        if(key === "opacity") {
                            key = "fill-opacity";
                        }
                        if(docMode8) {
                            element[key] = value;
                        } else {
                            attr(element, key, value);
                        }
                    }
                    //save the attribute to attrs
                    element.attrs = element.attrs || {
                    };
                    element.attrs[key] = value;
                });
            }
            return ret;
        };
        VMLElement.prototype.scale = function (x, y) {
            var self = this, strokeWidth = self.attr("stroke-width") || 0;
            self.css({
                filter: "progid:DXImageTransform.Microsoft.Matrix(M11=" + x + "," + ", M12=0, M21=0, M22=" + y + ", Dx=0, Dy=0, sizingmethod='auto expand')"
            }).attr("stroke-width", strokeWidth);
        };
        VMLElement.prototype.clip = function (clipRect) {
            var self = this, clipMembers = clipRect.members;
            clipMembers.push(self);
            return self.css(clipRect.getCSS(self.inverted));
        };
        VMLElement.prototype.css = function (styles) {
            var self = this, element = self.element, textWidth = styles && element.tagName === 'SPAN' && styles.width;
            if(textWidth) {
                delete styles.width;
                self.textWidth = textWidth;
            }
            self.styles = $.extend(self.styles, styles);
            css(self.element, styles);
            return self;
        };
        VMLElement.prototype.destroy = function () {
            var self = this;
            if(self["destroyClip"]) {
                self["destroyClip"]();
            }
            return SVGElement.prototype.destroy.apply(self);
        };
        VMLElement.prototype.empty = function () {
            var element = this.element, childNodes = element.childNodes, i = childNodes.length, node;
            while(i--) {
                node = childNodes[i];
                node.parentNode.removeChild(node);
                $(node).remove();
            }
        };
        VMLElement.prototype.getBBox = function () {
            var self = this, element = self.element, bBox = self.bBox;
            if(!bBox) {
                if(element.nodeName === 'text') {
                    element.style.position = ABSOLUTE;
                }
                bBox = self.bBox = {
                    x: element.offsetLeft,
                    y: element.offsetTop,
                    width: element.offsetWidth,
                    height: element.offsetHeight
                };
            }
            return bBox;
        };
        return VMLElement;
    })(SVGElement);    
    var VMLRender = (function (_super) {
        __extends(VMLRender, _super);
        function VMLRender() {
            _super.apply(this, arguments);

            this.isIE8 = $.browser.msie && parseInt($.browser.version) === 8;
            this.symbols = {
                arc: function (x, y, radius, options) {
                    var start = options.start, end = options.end, cosStart = Math.cos(start), sinStart = Math.sin(start), cosEnd = Math.cos(end), sinEnd = Math.sin(end), innerRadius = options.innerR, circleCorrection = 0.07 / radius, innerCorrection = (innerRadius && 0.1 / innerRadius) || 0;
                    if(end - start === 0) {
                        return [
                            'x'
                        ];
                    } else if(2 * Math.PI - end + start < circleCorrection) {
                        cosEnd = -circleCorrection;
                    } else if(end - start < innerCorrection) {
                        cosEnd = Math.cos(start + innerCorrection);
                    }
                    return [
                        'wa', 
                        x - radius, 
                        // left
                        y - radius, 
                        // top
                        x + radius, 
                        // right
                        y + radius, 
                        // bottom
                        x + radius * cosStart, 
                        // start x
                        y + radius * sinStart, 
                        // start y
                        x + radius * cosEnd, 
                        // end x
                        y + radius * sinEnd, 
                        // end y
                        'at', 
                        x - innerRadius, 
                        // left
                        y - innerRadius, 
                        // top
                        x + innerRadius, 
                        // right
                        y + innerRadius, 
                        // bottom
                        x + innerRadius * cosEnd, 
                        // start x
                        y + innerRadius * sinEnd, 
                        // start y
                        x + innerRadius * cosStart, 
                        // end x
                        y + innerRadius * sinStart, 
                        // end y
                        'x', 
                        // finish path
                        'e'
                    ];
                    // close
                                    },
                circle: function (x, y, r) {
                    return [
                        'wa', 
                        // clockwisearcto
                        x - r, 
                        // left
                        y - r, 
                        // top
                        x + r, 
                        // right
                        y + r, 
                        // bottom
                        x + r, 
                        // start x
                        y, 
                        // start y
                        x + r, 
                        // end x
                        y, 
                        // end y
                        //'x', // finish path
                        'e'
                    ];
                    // close
                                    },
                rect: function (left, top, r, options) {
                    if(!defined(options)) {
                        return [];
                    }
                    var width = options.width, height = options.height, right = left + width, bottom = top + height;
                    r = Math.min(r, width, height);
                    return [
                        M, 
                        left + r, 
                        top, 
                        L, 
                        right - r, 
                        top, 
                        'wa', 
                        right - 2 * r, 
                        top, 
                        right, 
                        top + 2 * r, 
                        right - r, 
                        top, 
                        right, 
                        top + r, 
                        L, 
                        right, 
                        bottom - r, 
                        'wa', 
                        right - 2 * r, 
                        bottom - 2 * r, 
                        right, 
                        bottom, 
                        right, 
                        bottom - r, 
                        right - r, 
                        bottom, 
                        L, 
                        left + r, 
                        bottom, 
                        'wa', 
                        left, 
                        bottom - 2 * r, 
                        left + 2 * r, 
                        bottom, 
                        left + r, 
                        bottom, 
                        left, 
                        bottom - r, 
                        L, 
                        left, 
                        top + r, 
                        'wa', 
                        left, 
                        top, 
                        left + 2 * r, 
                        top + 2 * r, 
                        left, 
                        top + r, 
                        left + r, 
                        top, 
                        'x', 
                        'e'
                    ];
                }
            };
        }
        VMLRender.prototype.init = function (container, width, height) {
            var self = this, boxWrapper;
            this.Element = VMLElement;
            if($(container).hasClass("vmlcontainer")) {
                self.box = container;
                boxWrapper = new this.Element();
                boxWrapper.element = container;
                boxWrapper.render = this;
                self.boxWrapper = boxWrapper;
            } else {
                boxWrapper = self.createElement(DIV);
                container.appendChild(boxWrapper.element);
                self.box = boxWrapper.element;
                self.boxWrapper = boxWrapper;
                self.setSize(width, height);
            }
            if(!doc.namespaces["v"]) {
                doc.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
                doc.createStyleSheet().cssText = 'v\\:fill, v\\:path, v\\:shape, v\\:stroke' + '{ behavior:url(#default#VML); display: inline-block; } ';
            }
        };
        VMLRender.prototype.clipRect = function (x, y, width, height) {
            var clipRect = this.createElement();
            $.extend(clipRect, {
                members: [],
                left: x,
                top: y,
                width: width,
                height: height,
                getCSS: function (inverted) {
                    var rect = this, top = rect.top, left = rect.left, right = left + rect.width, bottom = top + rect.height, ret = {
                        clip: 'rect(' + Math.round(inverted ? left : top) + 'px,' + Math.round(inverted ? bottom : right) + 'px,' + Math.round(inverted ? right : bottom) + 'px,' + Math.round(inverted ? top : left) + 'px)'
                    };
                    if(!inverted && docMode8) {
                        $.extend(ret, {
                            width: right + PX,
                            height: bottom + PX
                        });
                    }
                    return ret;
                },
                updateClipping: function () {
                    each(clipRect.members, function (i, member) {
                        member.css(clipRect.getCSS(member.inverted));
                    });
                }
            });
            return clipRect;
        };
        VMLRender.prototype.color = function (color, elem, prop) {
            var markup, self = this, type = "color", gradient, stopColor, color1, color2, colors = [], ele, strokeNodes, fxfy, stops, angle = 0;
            if(regLinearGradient.test(color)) {
                type = "linear";
            } else {
                color = color.replace(regRadialGradient, function (all, fx, fy) {
                    type = "radial";
                    if(fx && fy) {
                        fx = parseFloat(fx);
                        fy = parseFloat(fy);
                        if(Math.pow(fx - 0.5, 2) + Math.pow(fy - 0.5, 2) > 0.25) {
                            fy = Math.sqrt(0.25 - Math.pow(fx - 0.5, 2)) * ((fy > 0.5 ? 1 : 0) * 2 - 1) + 0.5;
                        }
                        fxfy = fx + " " + fy;
                    }
                    return "";
                });
                type = "radial";
            }
            if(type === "linear" || type === "radial") {
                gradient = color.split(/\s*\-\s*/);
                if(type === "linear") {
                    angle = gradient.shift();
                    angle = -parseFloat(angle.toString());
                }
                stops = self._parsegradientcolor(gradient);
                $.each(stops, function (i, stop) {
                    stop.offset = stop.offset ? stop.offset : i ? "100%" : "0%";
                    colors.push(stop.offset + " " + stop.color);
                    stopColor = stop.color;
                    if(!i) {
                        // first
                        color1 = stopColor;
                    } else {
                        color2 = stopColor;
                    }
                });
                if(type === "radial") {
                    markup = [
                        '<fill colors="', 
                        colors.join(), 
                        '" angle="0"', 
                        '" focusposition="', 
                        fxfy, 
                        '" color="', 
                        color1, 
                        '" color2="', 
                        color2, 
                        '" focussize="0 0"', 
                        ' type="gradientTitle" focus="100%" method="none" />'
                    ];
                } else {
                    markup = [
                        '<fill colors="', 
                        colors.join(), 
                        '" angle="', 
                        angle.toString(), 
                        '" type="gradient" focus="100%" method="sigma" />'
                    ];
                }
                ele = createElement(self.prepVML(markup));
                $(elem).append(ele);
            } else {
                strokeNodes = elem.getElementsByTagName(prop);
                if(strokeNodes.length) {
                    strokeNodes[0].opacity = 1;
                }
                return color;
            }
        };
        VMLRender.prototype.prepVML = function (markup) {
            var vmlStyle = 'display:inline-block;behavior:url(#default#VML);', isIE8 = this.isIE8;
            markup = markup.join('');
            if(isIE8) {
                markup = markup.replace('/>', ' xmlns="urn:schemas-microsoft-com:vml" />');
                if(markup.indexOf('style="') === -1) {
                    markup = markup.replace('/>', ' style="' + vmlStyle + '" />');
                } else {
                    markup = markup.replace('style="', 'style="' + vmlStyle);
                }
            } else {
                markup = markup.replace('<', '<v:');
            }
            return markup;
        };
        VMLRender.prototype.path = function (path) {
            var ret = this.createElement('shape');
            ret.attr({
                coordsize: '100 100',
                d: path
            });
            return ret;
        };
        VMLRender.prototype.g = function (name) {
            var wrapper, attribs;
            if(name) {
                attribs = {
                    'className': PREFIX + name,
                    'class': PREFIX + name
                };
            }
            wrapper = this.createElement(DIV).attr(attribs);
            return wrapper;
        };
        VMLRender.prototype.text = function (x, y, text) {
            var wrapper = this.createElement("span"), ele = wrapper.element, width, height;
            ele.innerHTML = text;
            $(ele).appendTo("body");
            width = $(ele).width();
            height = $(ele).height();
            x -= width / 2;
            y -= height / 2;
            wrapper.x = x;
            wrapper.y = y;
            $(ele).css({
                position: "absolute",
                "white-space": "nowrap",
                "font-family": "Arial",
                "font-size": "10",
                left: x + "px",
                top: y + "px"
            });
            return wrapper;
        };
        return VMLRender;
    })(SVGRender);    
    function createRender(container, width, height) {
        if(hasSVG) {
            return new SVGRender(container, width, height);
        } else {
            return new VMLRender(container, width, height);
        }
    }
    chartRender.createRender = createRender;
})(chartRender || (chartRender = {}));
