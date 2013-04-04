/*globals Raphael,jQuery, window*/
/*
 *
 * Wijmo Library 2.3.7
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Dual licensed under the Wijmo Commercial or GNU GPL Version 3 licenses.
 * licensing@wijmo.com
 * http://wijmo.com/license
 *
 *
 * * Wijmo PieChart widget.
 *
 * Depends:
 *	jquery.js
 *	raphael.js
 *	globalize.js
 *	jquery.ui.widget.js
 *	jquery.wijmo.raphael.js
 *	jquery.wijmo.wijchartcore.js
 *  
 */

(function ($) {
	"use strict";
	
	$.widget("wijmo.wijpiechart", $.wijmo.wijchartcore, {
		options: {
			/// <summary>
			/// A value that indicates the start angle of a pie chart
			/// when painting sectors.
			/// Default: 0.
			/// Type: Number.
			/// Code example:
			///  $("#piechart").wijpiechart({
			///      startAngle: 90
			///  });
			/// </summary>
			startAngle: 0,
			/// <summary>
			/// A value that indicates the radius used for a pie chart.
			/// Default: null.
			/// Type: Number.
			/// Code example:
			///  $("#piechart").wijpiechart({
			///      radius: 100
			///  });
			/// </summary>
			/// <remarks>
			/// If the value is null, then the radius will be calculated 
			///	by the width/height value of the pie chart.
			/// </remarks>
			radius: null,
			/// <summary>
			/// A value that indicates the inner radius used for doughnut charts.
			/// Default: 0.
			/// Type: Number.
			/// Code example:
			///  $("#piechart").wijpiechart({
			///      innerRadius: 20
			///  });
			/// </summary>
			innerRadius: 0,
			/// <summary>
			/// A value that indicates a function which is used to get a value
			/// for the chart label shown.
			/// Default: null.
			/// Type: Function.
			/// </summary>
			chartLabelFormatter: null,
			/// <summary>
			/// A value that indicates the chart label elements of chart.
			/// DEfault: {style: {}, formatString: "", formatter: null, 
			/// connectorStyle: {}, position: "inside", offsetX: 10}
			/// Type: Object.
			/// </summary>
			labels: {
				/// <summary>
				/// A value that indicates the style of the chart labels.
				/// Default: {}
				/// Type: Object
				/// </summary>
				style: {},
				/// <summary>
				/// A value that indicates the format string of the chart labels.
				/// Default: ""
				/// Type: Object
				/// </summary>
				formatString: "",
				/// <summary>
				/// A value that indicates the formatter of the chart labels.
				/// Default: null
				/// Type: Function
				/// </summary>
				formatter: null,
				/// <summary>
				/// A value that indicates the style of the chart labels' connector.
				/// Default: {}
				/// Type: Object
				/// </summary>
				connectorStyle: {},
				/// <summary>
				/// A value that indicates the style of the chart labels.
				/// Default: "inside"
				/// Type: String
				/// </summary>
				/// <remarks>
				/// Options are 'inside', 'outside'.
				/// </remarks>
				position: "inside",
				/// <summary>
				/// A value that indicates the offset of the chart labels.
				/// Default: {}
				/// Type: Object
				/// </summary>
				offset: 10
			},
			/// <summary>
			/// An option that controls aspects of the widget's animation, 
			/// such as duration and easing.
			/// Default: {enabled:true, duration:400, easing: ">", offset: 10}.
			/// Type: Object.
			/// Code example:
			///  $("#piechart").wijpiechart({
			///      animation: {enabled: true, duration: 1000, offset: 20}
			///  });
			/// </summary>
			animation: {
				/// <summary>
				/// A value that determines whether to show animation.
				/// Default: true.
				/// Type: Boolean.
				/// </summary>
				enabled: true,
				/// <summary>
				/// A value that indicates the duration for the animation.
				/// Default: 400.
				/// Type: Number.
				/// </summary>
				duration: 400,
				/// <summary>
				/// A value that indicates the easing for the animation.
				/// Default: ">".
				/// Type: string.
				/// </summary>
				easing: ">",
				/// <summary>
				/// A value that indicates the offset for an explode animation.
				/// Default: 10.
				/// Type: Number.
				/// </summary>
				offset: 10
			},
			/// <summary>
			/// A value that indicates whether to show animation 
			///	and the duration for the animation when reload data.
			/// Default: {enabled:true, duration:1000, easing: "bounce"}.
			/// Type: Object.
			/// Code example:
			///  $("#piechart").wijpiechart({
			///      animation: {enabled: true, duration: 2000, easing: ">"}
			///  });
			/// </summary>
			seriesTransition: {
				/// <summary>
				/// A value that determines whether to show animation when reload.
				/// Default: true.
				/// Type: Boolean.
				/// </summary>
				enabled: true,
				/// <summary>
				/// A value that indicates the duration for the series transition.
				/// Default: 1000.
				/// Type: Number.
				/// </summary>
				duration: 1000,
				/// <summary>
				/// A value that indicates the easing for the series transition.
				/// Default: "bounce".
				/// Type: string.
				/// </summary>
				easing: "bounce"
			},
			/// <summary>
			/// An array collection that contains the data to be charted.
			/// Default: [].
			/// Type: Array.
			/// Code example:
			/// $("#chartcore").wijchartcore({
			/// seriesList: [{
			/// label: "Q1",
			/// legendEntry: true,
			/// data: 12,
			/// offset: 0
			/// }, {
			/// label: "Q2",
			/// legendEntry: true,
			/// data: 21,
			/// offset: 0
			/// }, {
			/// label: "Q3",
			/// legendEntry: true,
			/// data: 9,
			/// offset: 0
			/// }, {
			/// label: "Q4",
			/// legendEntry: true,
			/// data: 29,
			/// offset: 10
			/// }]
			/// });
			/// </summary>
			seriesList: [],
			/// <summary>
			/// Fires when the user clicks a mouse button.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a function as an option.
			///  $("#piechart").wijpiechart({mouseDown: function(e, data) { } });
			/// Bind to the event by type: wijpiechartmousedown
			/// $("#piechart").bind("wijpiechartmousedown", function(e, data) {} );
			/// <param name="e" type="eventObj">
			/// </summary>
			/// <param name="e" type="eventObj">
			/// jQuery.Event object.
			///	</param>
			/// <param name="data" type="Object">
			/// An object that contains  the series infos of the mousedown sector. 
			/// data.data: value of the sector.
			/// data.index: index of the sector.
			/// data.label: label of the sector.
			/// data.legendEntry: legend entry of the sector.
			/// data.offset: offset of the sector.
			/// data.style: style of the sector.
			/// type: "pie"
			///	</param>
			mouseDown: null,
			/// <summary>
			/// Fires when the user releases a mouse button
			/// while the pointer is over the chart element.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a function as an option.
			///  $("#piechart").wijpiechart({mouseUp: function(e, data) { } });
			/// Bind to the event by type: wijpiechartmouseup
			/// $("#piechart").bind("wijpiechartmouseup", function(e, data) {} );
			/// </summary>
			/// <param name="e" type="eventObj">
			/// jQuery.Event object.
			///	</param>
			/// <param name="data" type="Object">
			/// An object that contains all the series infos of the mouseup sector. 
			/// data.data: value of the sector.
			/// data.index: index of the sector.
			/// data.label: label of the sector.
			/// data.legendEntry: legend entry of the sector.
			/// data.offset: offset of the sector.
			/// data.style: style of the sector.
			/// type: "pie"
			///	</param>
			mouseUp: null,
			/// <summary>
			/// Fires when the user first places the pointer over the chart element.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a function as an option.
			///  $("#piechart").wijpiechart({mouseOver: function(e, data) { } });
			/// Bind to the event by type: wijpiechartmouseover
			/// $("#piechart").bind("wijpiechartmouseover", function(e, data) {} );
			/// </summary>
			/// <param name="e" type="eventObj">
			/// jQuery.Event object.
			///	</param>
			/// <param name="data" type="Object">
			/// An object that contains all the series infos of the mouseover sector. 
			/// data.data: value of the sector.
			/// data.index: index of the sector.
			/// data.label: label of the sector.
			/// data.legendEntry: legend entry of the sector.
			/// data.offset: offset of the sector.
			/// data.style: style of the sector.
			/// type: "pie"
			///	</param>
			mouseOver: null,
			/// <summary>
			/// Fires when the user moves the pointer off of the chart element.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a function as an option.
			///  $("#piechart").wijpiechart({mouseOut: function(e, data) { } });
			/// Bind to the event by type: wijpiechartmouseout
			/// $("#piechart").bind("wijpiechartmouseout", function(e, data) {} );
			/// </summary>
			/// <param name="e" type="eventObj">
			/// jQuery.Event object.
			///	</param>
			/// <param name="data" type="Object">
			/// An object that contains all the series infos of the mouseout sector. 
			/// data.data: value of the sector.
			/// data.index: index of the sector.
			/// data.label: label of the sector.
			/// data.legendEntry: legend entry of the sector.
			/// data.offset: offset of the sector.
			/// data.style: style of the sector.
			/// type: "pie"
			///	</param>
			mouseOut: null,
			/// <summary>
			/// Fires when the user moves the mouse pointer
			/// while it is over a chart element.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a function as an option.
			///  $("#piechart").wijpiechart({mouseMove: function(e, data) { } });
			/// Bind to the event by type: wijpiechartmousemove
			/// $("#piechart").bind("wijpiechartmousemove", function(e, data) {} );
			/// </summary>
			/// <param name="e" type="eventObj">
			/// jQuery.Event object.
			///	</param>
			/// <param name="data" type="Object">
			/// An object that contains all the series infos of the mousemove sector. 
			/// data.data: value of the sector.
			/// data.index: index of the sector.
			/// data.label: label of the sector.
			/// data.legendEntry: legend entry of the sector.
			/// data.offset: offset of the sector.
			/// data.style: style of the sector.
			/// type: "pie"
			///	</param>
			mouseMove: null,
			/// <summary>
			/// Fires when the user clicks the chart element. 
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a function as an option.
			///  $("#piechart").wijpiechart({click: function(e, data) { } });
			/// Bind to the event by type: wijpiechartclick
			/// $("#piechart").bind("wijpiechartclick", function(e, data) {} );
			/// </summary>
			/// <param name="e" type="eventObj">
			/// jQuery.Event object.
			///	</param>
			/// <param name="data" type="Object">
			/// An object that contains all the series infos of the clicked sector. 
			/// data.data: value of the sector.
			/// data.index: index of the sector.
			/// data.label: label of the sector.
			/// data.legendEntry: legend entry of the sector.
			/// data.offset: offset of the sector.
			/// data.style: style of the sector.
			/// type: "pie"
			///	</param>
			click: null
		},
		
		widgetEventPrefix: "wijpiechart",

		// widget creation:    
		_create: function () {
			var self = this,
				defFill = self._getDefFill();
			self._hotFixForJQ1_9();
			// default some fills
			$.each(this.options.seriesStyles, function (idx, style) {
				if (!style.fill) {
					style.fill = defFill[idx];
				}
			});
			$.wijmo.wijchartcore.prototype._create.apply(self, arguments);
			self.chartElement.addClass("wijmo-wijpiechart");
		},

		destroy: function () {
			///Remove the functionality completely. 
			///This will return the element back to its pre-init state. 
			var self = this,
				element = self.chartElement,
				fields = element.data("fields"),
				aniSectors = fields && fields.sectors,
				aniLabels = fields && fields.labels;

			element.removeClass("wijmo-wijpiechart");
			$.wijmo.wijchartcore.prototype.destroy.apply(this, arguments);
			
			if (aniSectors && aniSectors.length) {
				$.each(aniSectors, function (idx, sector) {
					sector = null;
				});
			}
			if (aniLabels && aniLabels.length) {
				$.each(aniLabels, function (idx, label) {
					label = null;
				});
			}

			element.data("fields", null);
		},

		_isPieChart: function () {
			return true;
		},

		/*****************************
		Widget specific implementation
		******************************/
		/** public methods */
		getSector: function (index) {
			/// <summary>
			/// Returns the sector of the pie chart with the given index.
			/// </summary>
			/// <param name="index" type="Number">
			/// The index of the sector.
			/// </param>
			/// <returns type="Raphael element">
			/// Reference to raphael element object.
			/// </returns>
			var fields = this.chartElement.data("fields");

			if (fields && fields.chartElements) {
				return fields.chartElements.sectors[index];
			}

			return null;
		},
		/** end of public methods */

		/** private methods */
		//add binding for pie chart
		_bindData: function () {
			var self = this,
				o = self.options,
				ds = o.dataSource,
				data = o.data,
				seriesList = [], 
				dataLabel, dataValue, dataOffset;
			
			if (ds && data) {
				dataLabel = data.label;
				dataValue = data.value;
				dataOffset = data.offset;
				if (dataLabel && dataLabel.bind) {
					dataLabel = self._getBindData(ds, dataLabel.bind);
				}
				if (dataValue && dataValue.bind) {
					dataValue = self._getBindData(ds, dataValue.bind);
				}
				if (dataOffset && dataOffset.bind) {
					dataOffset = self._getBindData(ds, dataOffset.bind);
				}
				if (dataLabel && $.isArray(dataLabel) && dataLabel.length && 
						dataValue && $.isArray(dataValue) && dataValue.length) {
					$.each(dataValue, function (idx, val) {
						var label,
							offset = 0;
						if (idx >= 0 && idx < dataLabel.length) {
							label = dataLabel[idx];
						}
						if (dataOffset && $.isArray(dataValue) && 
								dataOffset.length &&
								idx >= 0 && idx < dataOffset.length) {
							offset = typeof dataOffset[idx] === 'undefined' ? 
								0 : dataOffset[idx];
						}
						seriesList.push({
							data: val,
							label: label,
							offset: offset,
							legendEntry: true
						});
					});
					o.seriesList = seriesList;
				}
			}
		},

		//Override chartcore's _hanldSharedXData, there's no x/y axis in piechart.
		_hanldSharedXData: function () { },
		
		_getSeriesFromTR: function (theaders, sList, seriesList) {
			var label = null, th = null, tds = null,
				data = null, series = null;
			if (sList.length) {
				sList.each(function () {
					th = $("th", $(this));
					label = $.trim(th.text());
					tds = $("td", $(this));
					if (tds.length) {
						data = parseFloat($.trim($(tds[0]).text()));
					}
					series = {
						label: label,
						legendEntry: true,
						data: data
					};
					seriesList.push(series);
				});
			}
		},

		_showSerieEles: function (seriesEle) {
			var  showLabels = this.options.showChartLabels;
			if (seriesEle.sector) {
				seriesEle.sector.show();
				if (seriesEle.sector.shadow) {
					seriesEle.sector.shadow.show();
				}
				if (seriesEle.sector.tracker) {
					seriesEle.sector.tracker.show();
				}
			}
			if (seriesEle.label && showLabels) {
				$(seriesEle.label.node).data("legendHide", false);
				seriesEle.label.show();
				if (seriesEle.label.connector) {
					seriesEle.label.connector.show();
				}
			}
		},

		_hideSerieEles: function (seriesEle) {
			if (seriesEle.sector) {
				seriesEle.sector.hide();
				if (seriesEle.sector.shadow) {
					seriesEle.sector.shadow.hide();
				}
				if (seriesEle.sector.tracker) {
					seriesEle.sector.tracker.hide();
				}
			}
			if (seriesEle.label) {
				$(seriesEle.label.node).data("legendHide", true);
				seriesEle.label.hide();
				if (seriesEle.label.connector) {
					seriesEle.label.connector.hide();
				}
			}
		},

		_hasAxes: function () {
			return false;
		},

		_mouseMoveInsidePlotArea: function (e, mousePos) {
			$.wijmo.wijchartcore.prototype
				._mouseMoveInsidePlotArea.apply(this, arguments);
			if (this.isTapAndHold) {
				var self = this,
					previousAngle = self.previousAngle,
					rotation = 0,
					element = self.chartElement,
					dataObj = self.tapTarget ? self.tapTarget.data("wijchartDataObj") : {},
					pieId = dataObj.pieID || "",
					sectors = element.data("fields").chartElements["sectors" + pieId],
					cb = self.canvasBounds,
					pieCX = (cb.startX + cb.endX) / 2,
					pieCY = (cb.startY + cb.endY) / 2,
					angle = Raphael.angle(mousePos.left, mousePos.top, 
							pieCX, pieCY);
				if (previousAngle) {
					rotation = Math.round(angle - previousAngle, 10);
					if (Math.abs(angle - previousAngle > 180)) {
						if (angle > previousAngle) {
							rotation = rotation - 360;
						} else {
							rotation = rotation + 360;
						}
					}
					if (rotation) {
						rotation = Raphael.format("...r{0},{1},{2}", 
							rotation, pieCX, pieCY);
						$.each(sectors, function (idx, sector) {
							sector.transform(rotation);
						});
						if (self.tooltip) {
							self._setTouchTooltip();
						}
					}
				}
				self.previousAngle = angle;
			}
		},

		_mouseMoveOutsidePlotArea: function (e, mousePos) {
			var self = this;
			$.wijmo.wijchartcore.prototype
				._mouseMoveOutsidePlotArea.apply(self, arguments);
			if (self.isTapAndHold) {
				self._rotateToSectorCenter();
			}
		},
		
		_rotateToSectorCenter: function (specifiedSector) {
			var self = this,
				animation = self.options.animation,
				element = self.chartElement,
				dataObj = self.tapTarget ? self.tapTarget.data("wijchartDataObj") : {},
				pieId = dataObj.pieID || "",
				sectors = element.data("fields").chartElements["sectors" + pieId],
				labels = element.data("fields").chartElements["labels" + pieId],
				cb = self.canvasBounds,
				pieCX = (cb.startX + cb.endX) / 2,
				pieCY = (cb.startY + cb.endY) / 2,
				animate, touchSector, angle;
			
			self._hideSectorElements(sectors, labels);
			if (self.tooltip) {
				touchSector = self._getTouchttSector(specifiedSector);
			}
			//add targetCenterAngle >=0.01 to prevent the precision issue.
			if (self.touchttSector && self.touchttSector === touchSector &&
				Math.abs(self.targetCenterAngle) >= 0.01) {
				if (self.targetCenterAngle > 180) {
					angle = self.targetCenterAngle - 360;
				} else if (self.targetCenterAngle < -180) {
					angle = self.targetCenterAngle + 360;
				} else {
					angle = self.targetCenterAngle;
				}
				animate = Raphael.animation({
					transform: Raphael.format("...r{0},{1},{2}",
						angle, pieCX, pieCY)
				}, animation.duration, animation.easing, function () {
					self._rotateCallback(this, labels);
				});
				$.each(sectors, function (idx, sector) {
					sector.animate(animate);
				});
			} else {
				$.each(sectors, function (idx, sector) {
					self._rotateCallback(sector, labels);
				});
			}
			self.previousAngle = null;
			self.isTapAndHold = false;
			self.tapTarget = null;
		},

		_rotateCallback: function (sector, labels) {
			var self = this,
				cb = self.canvasBounds,
				pieCX = (cb.startX + cb.endX) / 2,
				pieCY = (cb.startY + cb.endY) / 2,
				idx = sector.index,
				rotation = 0,
				transforms = sector.attr("transform"),
				label;
			$.each(transforms, function (idx, transform) {
				if (transform[0] !== "r") {
					return true;
				}
				if (transform.length >= 4) {
					//rotation += parseFloat(transform[1]);
					rotation += transform[1];
				}
			});
			if (pieCX > 0) {
				rotation = rotation % 360;
				sector.attr("transform", Raphael.format("r{0},{1},{2}",
					rotation, pieCX, pieCY));
			}
			if (sector.tracker) {
				sector.tracker.attr("transform", Raphael.format("r{0},{1},{2}",
					rotation, pieCX, pieCY));
				sector.tracker.show();
			}
			if (sector.shadow) {
				sector.shadow.attr("transform", Raphael.format("r{0},{1},{2}",
					rotation, pieCX, pieCY));
				sector.shadow.show();
			}
			if (labels && labels.length && labels.length > idx) {
				label = labels[idx];
				label.attr("transform", Raphael.format("r{0},{1},{2}r{3}",
					rotation, pieCX, pieCY, 0 - rotation));
				if ($(label.node).data("legendHide")) {
					return;
				}
				label.show();
			}
		},

		_getTouchttSector: function (specifiedSector) {
			var self = this,
				element = self.chartElement,
				dataObj = self.tapTarget ? self.tapTarget.data("wijchartDataObj") : {},
				pieId = dataObj.pieID || "",
				sectors = element.data("fields").chartElements["sectors" + pieId],
				ttOpts = self.tooltip.getOptions(),
				ttCompass = ttOpts.compass,
				targetAngle = 90,
				targetSector;
			switch (ttCompass) {
			case "east":
				targetAngle = 0;
				break;
			case "south":
				targetAngle = 270;
				break;
			case "west":
				targetAngle = 180;
				break;
			case "north":
			default:
				targetAngle = 90;
			}

			$.each(sectors, function (idx, sector) {
				var transforms = sector.attr("transform"),
					rotation = 0,
					angle = sector.angles;
				
				$.each(transforms, function (idx, transform) {
					if (transform[0] !== "r") {
						return true;
					}
					if (transform.length >= 4) {
						//rotation += parseFloat(transform[1]);
						rotation += transform[1];
					}
				});
				rotation = rotation % 360;
				if (rotation < 0) {
					rotation = 360 + rotation;
				}
				rotation = (targetAngle + rotation) % 360;
				if (specifiedSector) {
					if (sector === specifiedSector) {
						self.targetCenterAngle = (angle.start + angle.end) / 2 - rotation;
						targetSector = specifiedSector;
						return false;
					}
				} else {
					if (angle.start <= rotation &&
							angle.end >= rotation) {
						self.targetCenterAngle = (angle.start + angle.end) / 2 - rotation;
						targetSector = sector;
						return false;
					}
				}
			});
			return targetSector;
		},

		_setTouchTooltip: function (specifiedSector) {
			var self = this,
				cb = self.canvasBounds,
				ttOpts = self.tooltip.getOptions(),
				ttCompass = ttOpts.compass,
				sector = self._getTouchttSector(specifiedSector),
				hint = self.options.hint,
				title = hint.title,
				content = hint.content,
				isTitleFunc = $.isFunction(title),
				isContentFunc = $.isFunction(content),
				dataObj, obj;
			if (!sector || (self.touchttSector && self.touchttSector === sector)) {
				return;
			}
			dataObj = $(sector.node).data("wijchartDataObj");
			obj = {
				data: dataObj,
				value: dataObj.value,
				label: dataObj.label,
				total: dataObj.total
			};
			if (isTitleFunc || isContentFunc) {
				if (isTitleFunc) {
					ttOpts.title = function () {
						obj.fmt = title;
						var fmt = $.proxy(obj.fmt, obj),
							tit = fmt();
						return tit;
					};
				}
				if (isContentFunc) {
					ttOpts.content = function () {
						obj.fmt = content;
						var fmt = $.proxy(obj.fmt, obj),
							con = fmt();
						return con;
					};
				}
			}
			self._showTouchTooltip(ttCompass);
			self.touchttSector = sector;
		},

		_showTouchTooltip: function (compass) {
			var self = this,
				element = self.chartElement,
				cb = self.canvasBounds,
				point = { x: 0, y: 0 };
			switch (compass) {
			case "east":
				point = {
					x: element.width(),
					y: (cb.startY + cb.endY) / 2
				};
				break;
			case "south":
				point = {
					x: (cb.startX + cb.endX) / 2,
					y: element.height()
				};
				break;
			case "west":
				point = {
					x: 0,
					y: (cb.startY + cb.endY) / 2
				};
				break;
			case "north":
			default:
				point = {
					x: (cb.startX + cb.endX) / 2,
					y: 0
				};
			}
			self.tooltip.showAt(point);
		},
		
		_mouseDown: function (e, args) {
			var self = this,
				target = $(e.target),
				element = self.chartElement,
				pieId, sectors, labels;
			$.wijmo.wijchartcore.prototype._mouseDown.apply(self, arguments);
			if ($.support.isTouchEnabled) {
				self.isTapAndHold = true;
				if (target.data("owner")) {
					target = target.data("owner");
				}
				self.tapTarget = target;
				pieId = args.pieID || "";
				sectors = element.data("fields").chartElements["sectors" + pieId];
				labels = element.data("fields").chartElements["labels" + pieId];

				self._hideSectorElements(sectors, labels);
			}
		},

		_hideSectorElements: function (sectors, labels) {
			$.each(sectors, function (idx, sector) {
				sector.stop();
				if (sector.tracker) {
					sector.tracker.hide();
				}
				if (sector.shadow) {
					sector.shadow.hide();
				}
				if (labels && labels.length) {
					var label = labels[idx];
					label.hide();
				}
			});
		},
		
		_mouseUp: function (e, args) {
			var self = this;
			$.wijmo.wijchartcore.prototype._mouseUp.apply(self, arguments);
			if ($.support.isTouchEnabled && self.isTapAndHold) {
				self._rotateToSectorCenter();
			}
		},
		
		_mouseOver: function (e, args) {
			$.wijmo.wijchartcore.prototype._mouseOver.apply(this, arguments);
		},
		
		_mouseOut: function (e, args) {
			$.wijmo.wijchartcore.prototype._mouseOut.apply(this, arguments);
		},
		
		_mouseMove: function (e, args) {
			$.wijmo.wijchartcore.prototype._mouseMove.apply(this, arguments);
		},
		
		_click: function (e, args) {
			var self = this,
				element = self.chartElement,
				pieId, sectors, sector;
			$.wijmo.wijchartcore.prototype._click.apply(self, arguments);
			if ($.support.isTouchEnabled && self.tooltip) {
				pieId = args.pieID || "";
				sectors = element.data("fields").chartElements["sectors" + pieId];
				if (sectors.length && sectors.length > args.index) {
					sector = sectors[args.index];
					self._setTouchTooltip(sector);
					self._rotateToSectorCenter(sector);
					//self.tapTarget = target;
				}
			}
		},
		
		_paintTooltip: function () {
			var self = this,
				element = self.chartElement,
				cb = self.canvasBounds,
				fields = element.data("fields");
			
			$.wijmo.wijchartcore.prototype._paintTooltip.apply(this, arguments);
			
			if (self.tooltip && fields) {
				if ($.support.isTouchEnabled) {
					self.tooltip.setOptions({
						closeBehavior: "none",
						mouseTrailing: false,
						animated: null,
						showAnimated: null,
						windowCollisionDetection: "fit"
					});
					self._setTouchTooltip();
					self._rotateToSectorCenter();
				} else {
					if (fields.trackers && fields.trackers.length) {
						//self.tooltip.setTargets(fields.trackers);
						self.tooltip.setSelector($(".wijchart-canvas-object", element[0]));
						self.tooltip.setOptions({relatedElement: fields.trackers[0]});
					}
				}

			}
		},

		_paintPlotArea: function () {
			var self = this,
				o = self.options,
				canvasBounds = self.canvasBounds,
				width = canvasBounds.endX - canvasBounds.startX,
				height = canvasBounds.endY - canvasBounds.startY,
				r = o.radius;

			if (!r) {
				r = Math.min(width, height) / 2;
			} else {
				if (width < 2 * r) {
					r = width / 2;
				}
				if (height < 2 * r) {
					r = height / 2;
				}
			}

			//remove to fix a resize issue.
			//o.radius = r;

			canvasBounds.startX += width / 2 - r;
			canvasBounds.endX = canvasBounds.startX + 2 * r;
			canvasBounds.startY += height / 2 - r;
			canvasBounds.endY = canvasBounds.startY + 2 * r;
			if (self.chartElement.data("fields")) {
				self.chartElement.data("fields").seriesEles = null;
			}
			self.chartElement.wijpie({
				canvas: self.canvas,
				tooltip: self.tooltip,
				bounds: canvasBounds,
				radius: r,
				startAngle: o.startAngle,
				widgetName: self.widgetName,
				innerRadius: o.innerRadius,
				seriesList: o.seriesList,
				seriesStyles: o.seriesStyles,
				seriesHoverStyles: o.seriesHoverStyles,
				seriesTransition: o.seriesTransition,
				showChartLabels: o.showChartLabels,
				disabled: o.disabled,
				textStyle: o.textStyle,
				chartLabelStyle: o.chartLabelStyle,
				chartLabelFormatString: o.chartLabelFormatString,
				chartLabelFormatter: o.chartLabelFormatter,
				labels: o.labels,
				shadow: o.shadow,
				animation: o.animation,
				culture: self._getCulture(),
				mouseDown: $.proxy(self._mouseDown, self),
				mouseUp: $.proxy(self._mouseUp, self),
				mouseOver: $.proxy(self._mouseOver, self),
				mouseOut: $.proxy(self._mouseOut, self),
				mouseMove: $.proxy(self._mouseMove, self),
				click: $.proxy(self._click, self)
			});
		},
		
		_getTooltipText: function (fmt, target) {
			var tar = $(target.node),
				dataObj,
				//value = dataObj.data,
				obj;
			if (tar.data("owner")) {
				tar = tar.data("owner");
			}
			dataObj = tar.data("wijchartDataObj");
			obj = {
				data: dataObj,
				value: dataObj.value,
				label: dataObj.label,
				total: dataObj.total,
				target: target,
				fmt: fmt
			};
			return $.proxy(fmt, obj)();
		}
	});
} (jQuery));

(function ($) {
	"use strict";

	$.fn.extend({
		wijpie: function (options) {
			var paintShadow = function (element, offset, stroke) {
					if (options.shadow) {
						$.wijchart.paintShadow(element, offset, stroke);
					}
				},
				//startAngle = options.startAngle,
				getDiffAttrs = $.wijchart.getDiffAttrs,
				addClass = $.wijraphael.addClass,
				getPositionByAngle = $.wijraphael.getPositionByAngle,
				element = this,
				bounds = options.bounds,
				widgetName = options.widgetName,
				canvas = options.canvas,
				animation = options.animation,
				seriesList = options.seriesList,
				seriesStyles = options.seriesStyles,
				seriesHoverStyles = options.seriesHoverStyles,
				radius = options.radius,
				innerRadius = options.innerRadius,
				seriesTransition = options.seriesTransition,
				showChartLabels = options.showChartLabels,
				textStyle = options.textStyle,
				labelsOpts = options.labels || {
					style: {},
					formatString: "",
					formatter: null,
					connectorStyle: {},
					position: "inside",
					offset: 10
				},
				chartLabelStyle = $.extend(true, {}, textStyle,
					options.chartLabelStyle, labelsOpts.style),
				chartLabelFormatString = labelsOpts.formatString || 
					options.chartLabelFormatString,
				chartLabelFormatter = labelsOpts.formatter || 
					options.chartLabelFormatter,
				culture = options.culture,
				disabled = options.disabled,
				mouseDown = options.mouseDown,
				mouseUp = options.mouseUp,
				mouseOver = options.mouseOver,
				mouseOut = options.mouseOut,
				mouseMove = options.mouseMove,
				click = options.click,
				tooltip = options.tooltip,
				fields =  element.data("fields") || {},
				chartElements = fields.chartElements || {},
				aniSectorAttrs = fields.aniSectorAttrs,
				aniLabelAttrs = fields.aniLabelAttrs,
				sectorAttrs = [],
				labelAttrs = [],
				sectors = [],
				labels = [],
				tooltipTars = [],
				//angle = 0,
				angle = options.startAngle || 0,
				total = 0,
				startX = bounds.startX,
				startY = bounds.startY,
				seriesEles = [],
				path, attr, pieID,
				trackers = canvas.set(),
				stylesLength = seriesStyles.length,
				maxLabelBounds = {width: 0, height: 0};

//			function getTooltipText(fmt, target) {
//				var dataObj = $(target.node).data("wijchartDataObj"),
//					value = dataObj.data,
//					obj;

//				obj = {
//					value: value,
//					total: total,
//					data: dataObj,
//					target: target,
//					fmt: fmt,
//					type: widgetName
//				};

//				return $.proxy(fmt, obj)();
//			}

			function bindLiveEvents() {
				var //hint = options.hint,
					//hintEnable = hint.enable,
					offset = { x: 0, y: 0 },
					touchEventPre = "",

//					hintEx = hint,
//					title,
//					content,
//					showAnimationTimers = [],
//					hideAnimationTimers = [],
//					explodeAnimationShowings = [],
					isFunction = $.isFunction;

				// if support touch.
				if ($.support.isTouchEnabled) {
					touchEventPre = "wij";
				}

//				if (hintEnable && !tooltip) {
//					hintEx = $.extend(true, {}, hint);
//					hintEx.offsetY = hintEx.offsetY || -2;
//					title = hint.title;
//					content = hint.content;

//					if (isFunction(title)) {
//						hintEx.title = function () {
//							return getTooltipText(title, this.target);
//						};
//					}

//					if (isFunction(content)) {
//						hintEx.content = function () {
//							return getTooltipText(content, this.target);
//						};
//					}
//					hintEx.beforeShowing = function () {
//						if (this.target) {
//							this.options.style.stroke = this.target.attrs.stroke ||
//								this.target.attrs.fill;
//						}
//					};
//					//tooltip = self.canvas.tooltip(self.sectors, hintEx);
//					tooltip = canvas.tooltip(tooltipTars, hintEx);
//				}
				if (tooltip) {
					tooltip.setTargets(tooltipTars);
				}

				$(".wijpiechart", element[0])
					.live(touchEventPre + "mousedown." + widgetName, function (e) {
						if (disabled) {
							return;
						}
						var target = $(e.target),
							dataObj;
						if (target.data("owner")) {
							target = target.data("owner");
						}
						dataObj = target.data("wijchartDataObj");
						if (!dataObj) {
							//dataObj = $(e.target.parentNode).data("wijchartDataObj");
							return;
						}

						if (isFunction(mouseDown)) {
							mouseDown.call(element, e, dataObj);
						}
					})
					//.live("mouseup." + widgetName, function (e) {
					.live(touchEventPre + "mouseup." + widgetName, function (e) {
						if (disabled) {
							return;
						}

						var target = $(e.target),
							dataObj;
						if (target.data("owner")) {
							target = target.data("owner");
						}
						dataObj = target.data("wijchartDataObj");
						if (!dataObj) {
							//dataObj = $(e.target.parentNode).data("wijchartDataObj");
							return;
						}
						if (isFunction(mouseUp)) {
							mouseUp.call(element, e, dataObj);
						}
					})
					.live(touchEventPre + "mouseover." + widgetName, function (e) {
						if (disabled) {
							return;
						}

						var target = $(e.target),
							dataObj,
							id,
							animated = animation && animation.enabled,
							index,
							sector,
							showAnimationTimer,
							hideAnimationTimer,
							explodeAnimationShowing;
						if (target.data("owner")) {
							target = target.data("owner");
						}
						dataObj = target.data("wijchartDataObj");
						if (!dataObj) {
							//dataObj = $(e.target.parentNode).data("wijchartDataObj");
							return;
						}
						id = dataObj.pieID || "";
						index = dataObj.index;
						sector = element.data("fields")
							.chartElements["sectors" + id][index];
						showAnimationTimer = sector.showAnimationTimer;
						//showAnimationTimer = showAnimationTimers[index];
						//hideAnimationTimer = hideAnimationTimers[index];
						hideAnimationTimer = sector.hideAnimationTimer;
						//explodeAnimationShowing = explodeAnimationShowings[index];
						explodeAnimationShowing = sector.explodeAnimationShowing;

						if (isFunction(mouseOver)) {
							mouseOver.call(element, e, dataObj);
						}
						if ($.support.isTouchEnabled) {
							return;
						}
						if (sector.removed) {
							return;
						}
						sector.wijAttr(dataObj.hoverStyle);

						if (animated) {
							if (hideAnimationTimer) {
								window.clearTimeout(hideAnimationTimer);
								hideAnimationTimer = null;
								//hideAnimationTimers[index] = null;
								sector.hideAnimationTimer = hideAnimationTimer;
							}

							if (showAnimationTimer) {
								window.clearTimeout(showAnimationTimer);
								showAnimationTimer = null;
								//showAnimationTimers[index] = null;
								sector.showAnimationTimer = null;
							}

							if (explodeAnimationShowing) {
								return;
							}

							showAnimationTimer = window.setTimeout(function () {
								var duration = animation.duration,
									easing = animation.easing;

								if (sector.removed) {
									return;
								}
								offset = sector.getOffset(animation.offset || 10);
								sector.offset = offset;
								//sector.wijAnimate({
								//	translation: offset.x + " " + offset.y
								//}, duration, easing);
								if (sector.shadow && !sector.shadow.removed) {
									sector.shadow.hide();
								}

								sector.wijAnimate({
									transform: Raphael.format("t{0},{1}", 
										offset.x, offset.y)
								}, duration, easing);
								if (sector.tracker && !sector.tracker.removed) {
									sector.tracker.wijAnimate({
										transform: Raphael.format("t{0},{1}", 
											offset.x, offset.y)
									}, duration, easing);
								}
//								if(sector.shadow && !sector.shadow.removed){
//									sector.shadow.wijAnimate({
//										transform: Raphael.format("t{0},{1}", 
///											offset.x, offset.y)
//									}, duration, easing);
//								}

								explodeAnimationShowing = true;
							//explodeAnimationShowings[index] = explodeAnimationShowing;
								sector.explodeAnimationShowing = explodeAnimationShowing;
							}, 150);
							//showAnimationTimers[index] = showAnimationTimer;
							sector.showAnimationTimer = showAnimationTimer;
						}
					})
					.live(touchEventPre + "mouseout." + widgetName, function (e) {
						if (disabled) {
							return;
						}
						var target = $(e.target),
							dataObj, id,
							animated = animation && animation.enabled,
							index,
							sector,
							showAnimationTimer,
							hideAnimationTimer,
							explodeAnimationShowing;
						if (target.data("owner")) {
							target = target.data("owner");
						}
						dataObj = target.data("wijchartDataObj");
						if (!dataObj) {
							//dataObj = $(e.target.parentNode).data("wijchartDataObj");
							return;
						}
						
						id = dataObj.pieID || "";
						index = dataObj.index;
						sector = element.data("fields")
							.chartElements["sectors" + id][index];
						//showAnimationTimer = showAnimationTimers[index];
						//hideAnimationTimer = hideAnimationTimers[index];
						showAnimationTimer = sector.showAnimationTimer;
						hideAnimationTimer = sector.hideAnimationTimer;
						//explodeAnimationShowing = explodeAnimationShowings[index];
						explodeAnimationShowing = sector.explodeAnimationShowing;
						
						if (isFunction(mouseOut)) {
							mouseOut.call(element, e, dataObj);
						}
						if ($.support.isTouchEnabled) {
							return;
						}
						if (sector.removed) {
							return;
						}

						if (dataObj.style.segment) {
							delete dataObj.style.segment;
						}

						sector.wijAttr(dataObj.style);

						//if (tooltip) {
							//tooltip.hide();
						//}

						if (animated) {
							if (hideAnimationTimer) {
								window.clearTimeout(hideAnimationTimer);
								hideAnimationTimer = null;
								//hideAnimationTimers[index] = null;
								sector.hideAnimationTimer = hideAnimationTimer;
							}

							if (showAnimationTimer) {
								window.clearTimeout(showAnimationTimer);
								showAnimationTimer = null;
								//showAnimationTimers[index] = null;
								sector.showAnimationTimer = showAnimationTimer;
							}

							if (!explodeAnimationShowing) {
								return;
							}

							hideAnimationTimer = window.setTimeout(function () {
								var duration = animation.duration,
									easing = animation.easing;

								offset = sector.offset;
								//sector.wijAnimate({
								//	translation: -offset.x + " " + -offset.y
								//}, duration, easing);
								if (sector.shadow && !sector.shadow.removed) {
									sector.shadow.show();
								}
								if (!sector.removed) {
									sector.wijAnimate({
										//transform: Raphael.format("t0,0", 
										//	-offset.x, -offset.y)
										transform: "t0,0"
									}, duration, easing);
								}
								if (sector.tracker && !sector.tracker.removed) {
									sector.tracker.wijAnimate({
										//transform: Raphael.format("t0,0", 
										//	-offset.x, -offset.y)
										transform: "t0,0"
									}, duration, easing);
								}
								if (sector.shadow && !sector.shadow.removed) {
									sector.shadow.wijAnimate({
										transform: "t0,0"
									}, duration, easing);
								}

								offset = { x: 0, y: 0 };
								explodeAnimationShowing = false;
							//explodeAnimationShowings[index] = explodeAnimationShowing;
								sector.explodeAnimationShowing = explodeAnimationShowing;
							}, 150);
							//hideAnimationTimers[index] = hideAnimationTimer;
							sector.hideAnimationTimer = hideAnimationTimer;
						}
					})
					.live(touchEventPre + "mousemove." + widgetName, function (e) {
						if (disabled) {
							return;
						}
						var target = $(e.target),
							dataObj;
						if (target.data("owner")) {
							target = target.data("owner");
						}
						dataObj = target.data("wijchartDataObj");
						if (!dataObj) {
							//dataObj = $(e.target.parentNode).data("wijchartDataObj");
							return;
						}
						
						if (isFunction(mouseMove)) {
							mouseMove.call(element, e, dataObj);
						}
					})
					.live(touchEventPre + "click." + widgetName, function (e) {
						if (disabled) {
							return;
						}
						var target = $(e.target),
							dataObj;
						if (target.data("owner")) {
							target = target.data("owner");
						}
						dataObj = target.data("wijchartDataObj");
						if (!dataObj) {
							//dataObj = $(e.target.parentNode).data("wijchartDataObj");
							return;
						}
						if (isFunction(click)) {
							click.call(element, e, dataObj);
						}
					});
			}

			function unbindLiveEvents() {
				$(".wijpiechart", element[0]).die(widgetName)
				// for jQuery 1.7.1
				.die("." + widgetName);
			}

			canvas.customAttributes.segment =
				function (x, y, a1, a2, outerR, innerR) {
					var path = null,
						offset = 0.01;
					if (a2 - a1 > 360 - offset) {
						a2 -= offset;
					} else if (a2 - a1 < offset) {
						a2 += offset;
					}
					if (innerR) {
						path = $.wijchart.donut(x, y, outerR, innerR, a1, a2);
					} else {
						path = $.wijchart.sector(x, y, outerR, a1, a2);
					}
					return {
						"path": path
					};
				};

			$.each(seriesList, function (idx, series) {
				if (series && typeof (series.data) === "number") {
					total += series.data;
				}
			});
			
			/*
			//if chartlabel.position is outside, adjust radius
			if (showChartLabels && labelsOpts.position === "outside") {
				$.each(seriesList, function (idx, series) {
					var chartLabel = series.label,
						textStyle = $.extend(true, {}, chartLabelStyle),
						label, b;
					if (series.textStyle) {
						textStyle = $.extend(true, textStyle, series.textStyle);
					}
					if (chartLabelFormatString && chartLabelFormatString.length) {
						chartLabel = Globalize.format(chartLabel, 
							chartLabelFormatString, culture);
					}
					if (chartLabelFormatter && $.isFunction(chartLabelFormatter)) {
						formatter = {
							index: idx,
							value: series.data,
							y: series.data,
							total: total,
							chartLabel: chartLabel,
							chartLabelFormatter: chartLabelFormatter
						};
						chartLabel = $.proxy(chartLabelFormatter, formatter)();
					}
					label = canvas.text(0, 0, chartLabel).attr(textStyle);
					b = label.wijGetBBox();
					if (b.width > maxLabelBounds.width) {
						maxLabelBounds.width = b.width;
					}
					if (b.height > maxLabelBounds.height) {
						maxLabelBounds.height = b.height;
					}
					label.remove();
				});

				bounds.startX += labelsOpts.offset + maxLabelBounds.width;
				bounds.startY += labelsOpts.offset + maxLabelBounds.width;
				bounds.endX -= labelsOpts.offset + maxLabelBounds.width;
				bounds.endY -= labelsOpts.offset + maxLabelBounds.width;
				radius -= labelsOpts.offset + maxLabelBounds.width;
				startX = bounds.startX;
				startY = bounds.startY;
				//bounds = options.bounds,
				//radius
				//startX
				//startY
			}
			*/

			$.each(seriesList, function (idx, series) {
				var seriesStyle = $.extend({
					opacity: 1,
					stroke: "gray",
					"stroke-width": 1
				}, seriesStyles[idx % stylesLength]),
					anglePlus = 360 * series.data / total,
					cx = startX + radius,
					cy = startY + radius,
					center, sector, label,
					pos, textStyle, borderPos,
					tracker, chartLabel, formatter,
					labelPosition = labelsOpts.position,
					labelConnectorStyle = labelsOpts.connectorStyle,
					labelOffset = labelsOpts.offset,
					calculatedAngle, labelBounds,
					labelConnector, animate = false;

				pieID = series.pieID;
				series = $.extend(true, { offset: 0 }, series);
				if (series.offset) {
					center = getPositionByAngle(cx, cy,
									series.offset, angle + anglePlus / 2);
					cx = center.x;
					cy = center.y;
				}

				path = [cx, cy, angle, angle + anglePlus, radius, innerRadius]
					.concat(" ");
				if (aniSectorAttrs && seriesTransition.enabled) {
					seriesStyle.segment = path;
					if (idx < aniSectorAttrs.length) {
						attr = aniSectorAttrs[idx];
					} else {
						attr = $.extend(true, {}, seriesStyle);
						attr.segment = [cx, cy, 0, 360, radius, innerRadius]
							.concat(" ");
					}
					sector = canvas.path().attr(attr);
					seriesStyle = getDiffAttrs(attr, seriesStyle);
					if (!sector.removed) {
						sector.wijAnimate(seriesStyle, seriesTransition.duration,
								seriesTransition.easing, function () {
									paintShadow(sector);
									if (tracker && !tracker.removed && !sector.removed) {
										tracker.attr({"path": sector.attr("path")});
									}
									delete seriesStyle.segment;
								});
					}
				} else {
					sector = canvas.path().attr({ segment: path });
					paintShadow(sector);
					sector.wijAttr(seriesStyle);
				}
				sector.angles = { start: angle, end: angle + anglePlus };
				sector.index = idx;
				sector.getOffset = function (offset) {
					var pos = getPositionByAngle(cx, cy, offset,
									(sector.angles.start + sector.angles.end) / 2);
					return { x: pos.x - cx, y: pos.y - cy };
				};
				sector.center = { x: cx, y: cy };
				sector.radius = radius;
				if (innerRadius) {
					sector.innerRadius = innerRadius;
				}
				tracker = sector.clone();
				// in vml, if the tracker has a stroke, the boder is black.
				if ($.browser.msie && $.browser.version < 9) {
					tracker.attr({
						opacity: 0.01, 
						fill: "white", 
						"stroke-width": 0, 
						"fill-opacity": 0.01
					});
				}
				else {
					tracker.attr({
						opacity: 0.01, 
						fill: "white", 
						"fill-opacity": 0.01
					});
				}
				addClass($(tracker.node), "wijchart-canvas-object wijpiechart" + 
					" pietracker wijchart-tracker" + idx);
				$(tracker.node).data("owner", $(sector.node));
				sector.tracker = tracker;
				trackers.push(tracker);

				// add class "wijmo-wijpiechart-series-n" to fix bug 18590
				addClass($(sector.node), "wijchart-canvas-object wijpiechart" + 
					" wijmo-wijpiechart-series-" + idx);
				//addClass($(sector.node), "wijchart-canvas-object wijpiechart");
				//end comments
				$(sector.node).data("wijchartDataObj", series);

				if (showChartLabels) {
					if (labelPosition === "outside") {
						borderPos = getPositionByAngle(cx, cy, 
							radius, angle + anglePlus / 2);
						pos = getPositionByAngle(cx, cy, 
							radius + labelOffset, angle + anglePlus / 2);
					} else {
						pos = getPositionByAngle(cx, cy,
							series.offset + radius * 2 / 3, angle + anglePlus / 2);
					}
					textStyle = $.extend(true, {}, textStyle, chartLabelStyle);
					if (series.textStyle) {
						textStyle = $.extend(true, textStyle, series.textStyle);
					}

					chartLabel = series.label;
					if (chartLabelFormatString && chartLabelFormatString.length > 0) {
						chartLabel = Globalize.format(chartLabel, 
							chartLabelFormatString, culture);
					}
					if (chartLabelFormatter && $.isFunction(chartLabelFormatter)) {
						formatter = {
							index: idx,
							value: series.data,
							y: series.data,
							total: total,
							chartLabel: chartLabel,
							chartLabelFormatter: chartLabelFormatter
						};
						chartLabel = $.proxy(chartLabelFormatter, formatter)();
					}
					if (aniLabelAttrs && seriesTransition.enabled) {
						if (idx < aniLabelAttrs.length) {
							animate = true;
							attr = aniLabelAttrs[idx];
							attr.text = chartLabel;
							//attr.text = series.label;
							label = canvas.text(0, 0, "").attr(attr);
							textStyle = getDiffAttrs(attr, textStyle);
							textStyle.x = pos.x;
							textStyle.y = pos.y;
							label.wijAnimate(textStyle, seriesTransition.duration,
									seriesTransition.easing, function () {
								if (labelConnector) {
									labelConnector.show();
								}
							});
						} else {
							label = canvas.text(pos.x, pos.y, chartLabel)
								.attr(textStyle);
							//label = canvas.text(pos.x, pos.y, series.label)
							//	.attr(textStyle);
						}
					} else {
						label = canvas.text(pos.x, pos.y, chartLabel)
							.attr(textStyle);
						//label = canvas.text(pos.x, pos.y, series.label)
						//	.attr(textStyle);
					}
					if (labelPosition === "outside") {
						calculatedAngle = (angle + anglePlus / 2) % 360;
						labelBounds = label.wijGetBBox();
						if (calculatedAngle >= 90 && calculatedAngle <= 270) {
							//label.transform(Raphael.format("...T{0},{1}", 
							label.transform(Raphael.format("T{0},{1}", 
								-labelBounds.width / 2, 0))
						} else {
							//label.transform(Raphael.format("...T{0},{1}", 
							label.transform(Raphael.format("T{0},{1}", 
								labelBounds.width / 2, 0))
						}
						//connector
						labelConnector = canvas.path(Raphael.format("M{0} {1}L{2} {3}", 
							borderPos.x, borderPos.y, pos.x, pos.y))
							.attr(labelConnectorStyle);
						if (animate) {
							labelConnector.hide();
						}
						label.connector = labelConnector;
					}
					addClass($(label.node), "wijchart-canvas-object wijpiechart");
					$(label.node).data("wijchartDataObj", series);
					tooltipTars.push(label);
					labels.push(label);
					labelAttrs[idx] = label.attr();					
				}

				seriesEles.push({label: labels[idx], sector: sector});

				if (series.visible === false) {
					sector.hide();
					if (labels[idx]) {
						labels[idx].hide();
					}
					if (labelConnector) {
						labelConnector.hide();
					}
					if (sector.shadow) {
						sector.shadow.hide();
					}
					tracker.hide();
				}

				sectorAttrs[idx] = sector.attr();
				sectors.push(sector);
				tooltipTars.push(sector);
				series.style = seriesStyle;
				series.hoverStyle = seriesHoverStyles[idx];
				series.index = idx;
				series.value = series.data;
				series.y = series.data;
				series.total = total;
				series.type = "pie";
				angle += anglePlus;
			});
			
			//ensuring labels are rendered on top of pie slices.
			if (labels && labels.length) {
				$.each(labels, function (idx, label) {
					label.toFront();
				});
			}
			//end comments.

			chartElements.sectors = sectors;
			if (pieID) {
				chartElements["sectors" + pieID] = sectors;
				chartElements["labels" + pieID] = labels;
			}
			chartElements.labels = labels;

			if (!fields.chartElements) {
				fields.chartElements = {};
			}
			
			trackers.toFront();

			$.extend(true, fields.chartElements, chartElements);
			fields.aniSectorAttrs = sectorAttrs;
			fields.aniLabelAttrs = labelAttrs;
			fields.seriesEles = seriesEles;
			fields.trackers = trackers;
			element.data("fields", fields);

			unbindLiveEvents();
			bindLiveEvents();
		} 
	});
}(jQuery));
