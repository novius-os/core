/*globals jQuery,$,document*/
/*jslint white: false*/
/*
*
* Wijmo Library 1.1.2
* http://wijmo.com/
*
* Copyright(c) GrapeCity, Inc.  All rights reserved.
* 
* Dual licensed under the Wijmo Commercial or GNU GPL Version 3 licenses.
* licensing@wijmo.com
* http://wijmo.com/license
*
*
* * Wijmo Filter widget.
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.wijmo.wijdropdown.js
*	jquery.wijmo.wijradio.js
*	jquery.wijmo.wijtextbox.js
*	jquery.wijmo.wijcheckbox.js
*	jquery.wijmo.wijcombobox.js
*/

(function ($) {
	"use strict";
	$.widget("wijmo.wijfilter", {
		widgetEventPrefix: "wijfilter",

		options: {
			/// <summary>
			/// An array of data to get filtering values from where each element is a one-dimensional array or object:
			///    [[ val0, ..., valN ], ..., [ val0, ..., valN ]]
			///    [{ prop0: val0, ..., propN: valN }, ..., { prop0: val0, ..., propN: valN }]
			/// Default: undefined.
			/// Type: Array.
			/// Code example: $("#element").wijfilter({ data: [{ ID: 0, Name: "Name0" }, { ID: 1, Name: "Name1" }] });
			/// </summary>
			data: undefined,

			/// <summary>
			/// A value used to identify a column in a data array. Can be string if the data option contains an array of objects or an integer if the data option is an array of arrays.
			/// Default: undefined.
			/// Type: Object.
			/// Code example: $("#element").wijfilter({ dataKey: "ID" });
			/// </summary>
			dataKey: undefined,

			/// <summary>
			/// Specifies the title of the dialog.
			/// Default: ""
			/// Type: String.
			/// Code example: $("#element").wijfilter({ title: "" });
			/// </summary>
			title: "",

			/// <summary>
			/// A value indicating whether sorting buttons are enabled.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijfilter({ enableSortButtons: false });
			/// </summary>
			enableSortButtons: false,

			/// <summary>
			/// An array of available filter operators to select, each element is of the followin kind { name, displayName }, where:
			///    name: a filter name.
			///    displayName: a name of the filter in the dropdown list (optional).
			///
			/// Default: undefined.
			/// Type: Array.
			/// Code example: $("#element").wijfilter({ availableOperators: [ { name: "lessorequal", displayName: "Less Or Equal" }] });
			/// </summary>
			availableOperators: undefined,

			/// <summary>
			/// A value indicating whether header is visible.
			/// Default: true.
			/// Type: Boolean.
			/// Code example: $("#element").wijfilter({ showHeader: true });
			/// </summary>
			showHeader: true,

			/// <summary>
			/// Determines the sort direction.
			/// Possible values are: "none", "ascending" and "descending".
			///
			/// "none": no sorting.
			/// "ascending": sort from smallest to largest.
			/// "descending": sort from largest to smallest.
			///
			/// Default: "none".
			/// Type: String.
			/// Code example: $("#element").wijgrid({ columns: [{ sortDirection: "none" }] });
			/// </summary>
			sortDirection: undefined,

			/// <summary>
			/// A value set for filtering.
			/// An array where each value is used as the value in the array of filter operators of the filterOperator option.
			///
			/// Default: undefined.
			/// Type: Array.
			/// Code example: $("#element").wijfilter({ filterValue: ["a", "b"] });
			/// </summary>
			filterValue: undefined,

			/// <summary>
			/// An array of filter operators where each item is an object of the following kind:
			///    { name: <operatorName>, condition: "or"|"and" }
			///
			/// where:
			///   name: filter operator name.
			///   condition: logical condition to other operators, "or" is by default.
			///
			/// Default: undefined.
			/// Type: Object.
			/// Code example: $("#element").wijfilter({ filterOperator: [ { name: "lessorequal" } ] });
			/// </summary>
			/// <remarks>
			/// The widget cannot display more than two operators.
			/// </remarks>
			filterOperator: undefined,

			/// <summary>
			/// The close event handler. A function called when dialog is closed.
			/// Default: null.
			/// Type: Function.
			///
			/// Code example:
			/// Supply a callback function to handle the close event:
			/// $("#element").wijfilter({ close: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijfilterclose", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.sortDirection: a new sort direction value.
			/// args.filterValue: a new filter value.
			/// args.filterOperator: a new filter operator value.
			/// </param>
			close: null
		},

		_create: function () {
			$.Widget.prototype._create.apply(this, arguments);
			this._initialized = false;
			this.element.addClass("ui-widget wijmo-wijfilter");
		},

		_init: function () {
			if (!this._initialized) {
				this._recreate();
			}
		},

		_setOptions: function () {
			$.Widget.prototype._setOptions.apply(this, arguments);

			try {
				this._initialized = false;
				this._recreate();
			} finally {
				this._initialized = true;
			}
		},

		_recreate: function () {
			this._searchTimer = 0;
			this._searchKey = undefined;

			this._ignoreEvents = false;

			this._elements = {};

			if (this._dialog) {
				this._dialog.remove();
				this._dialog = null;
			}

			if (!$.isArray(this.options.filterValue)) {
				this.options.filterValue = [this.options.filterValue];
			}

			this.options.filterValue = $.map(this.options.filterValue, function (o, i) {
				return ($.isArray(o)) ? [o] : [[o]];
			});

			if (!$.isArray(this.options.filterOperator)) {
				this.options.filterOperator = [this.options.filterOperator];
			}

			this.options.filterOperator = $.map(this.options.filterOperator, function (o, i) {
				return (typeof (o) === "string") ? { name: o} : o;
			});

			this._originalOptions = $.extend(true, {}, { sortDirection: this.options.sortDirection, filterValue: this.options.filterValue, filterOperator: this.options.filterOperator });

			this._distinctDataValues = this._getDistinctDataValues(this.options.data, this.options.dataKey);

			this._distinctDataValuesCI = $.map(this._distinctDataValues, function (o, i) { // case insensitive data array
				return (typeof (o) === "string") ? o.toLowerCase() : o;
			});

			this.element.append(this._dialog = this._createRoughDialog());

			this._attachElements(this._distinctDataValues, this.options.availableOperators);
			this._fillDialog();
		},

		_destroy: function () {
			if (this._dialog) {
				this._dialog.remove();
				this._dialog = null;
			}

			this.element.removeClass("ui-widget wijmo-wijfilter");
		},

 		/// <summary>
 		/// Force wijfilter to raise the close event.
 		/// </summary>
		triggerClose: function (settingsChanged) {
			this._trigger("close", null, settingsChanged
				? { sortDirection: this.options.sortDirection, filterValue: this.options.filterValue, filterOperator: this.options.filterOperator }
				: null);
		},

		_onApplyButtonClick: function (e, args) {
			if (this._isSettingsChanged(this.options, this._originalOptions)) {
				if (this.options.filterOperator.length > 1) {
					this.options.filterOperator[1].condition = this._elements.$radioButtons.eq(0).is(":checked") ? "and" : "or";
				}

				this.triggerClose(true);
			} else {
				this.triggerClose(false);
			}
		},

		_onClearButtonClick: function () {
			// this._resetFilters();

			// clear
			this.options.filterValue = [[undefined]];
			this.options.filterOperator = [{ name: "NoFilter"}];

			this._onApplyButtonClick();  // close dialog
		},

		_onAscendingButtonClick: function (e, args) {
			var $item = $(e.target);

			if ($item.is(":checked")) {
				this.options.sortDirection = "ascending";

				this._elements.$descendingBtn
					.prop("checked", false)
					.button("refresh");
			} else {
				this.options.sortDirection = "none";
			}
		},

		_onDescendingButtonClick: function (e, args) {
			var $item = $(e.target);

			if ($item.is(":checked")) {
				this.options.sortDirection = "descending";

				this._elements.$ascendingBtn
					.prop("checked", false)
					.button("refresh");
			} else {
				this.options.sortDirection = "none";
			}
		},

		_onCheckboxChange: function (e, args) {
			if (this._ignoreEvents) {
				return;
			}

			var $cbItem = $(e.target),
				isChecked = $cbItem.is(":checked"),
				filterValues = [],
				self = this;

			this._resetFilterArea();

			if ($cbItem.is(".wijmo-wijfilter-selectAll")) {
				this._elements.$checkboxes
					.each(function (i, item) {
						if (i) { // skip "select all" item
							$(item)
								.prop("checked", isChecked)
								.wijcheckbox("refresh");
						}
					});
			} else {
				this._elements.$checkboxes
					.each(function (i, item) {
						if (!i) { // "select all" item, reset status
							$(item)
								.prop("checked", false)
								.wijcheckbox("refresh");
						} else {
							if ($(item).is(":checked")) {
								filterValues.push(self._distinctDataValues[i - 1]); // zero index is reserved for the "select all" item
							}
						}
					});
			}

			if (filterValues.length) {
				this.options.filterOperator = [{ name: "Equals"}];
				this.options.filterValue = [filterValues];
			} else {
				this.options.filterOperator = [{ name: "NoFilter"}];
				this.options.filterValue = undefined;
			}
		},

		_onFilterAreaChanged: function (e, args) {
			if (this._ignoreEvents) {
				return;
			}

			var self = this;

			this._resetCheckboxes();

			this.options.filterOperator = [
				{ name: this._elements.$filterOperatorsDdl.eq(0).val() },
				{ name: this._elements.$filterOperatorsDdl.eq(1).val() }
			];

			this.options.filterValue = $.map(this._elements.$filterValuesDdl, function (o, i) {
				var $item = $(o),
					idx = $item.wijcombobox("option", "selectedIndex");

				return (idx >= 0)
					? [[self._distinctDataValues[idx]]]
					: [[$item.val()]];

			});
		},

		_onRadioButtonChanged: function (e, args) {
			if (this._ignoreEvents) {
				return;
			}

			if (this.options.filterOperator.length > 1) {
				this.options.filterOperator[1].condition = this._elements.$radioButtons.eq(0).is(":checked") ? "and" : "or";
			}
		},


		_onSearchTextboxKeyUp: function (e, args) {
			if (this._ignoreEvents) {
				return;
			}

			var self = this;

			if (this._searchTimer > 0) {
				window.clearTimeout(this._searchTimer);
			}

			if (this._searchTimer !== -1) {
				this._searchTimer = window.setTimeout(function () {
					self._searchTimer = -1;
					try {
						self._doSearch(e.target.value);
					} finally {
						self._searchTimer = 0;
					}
				}, 300);
			}
		},

		_doSearch: function (value) {
			if (this._searchKey !== value) {
				if (!value && value !== 0) {
					this._elements.$checkboxes.closest("li").show(); // show all items
				} else {
					var indicesToShow = [],
						idx = 0,
						self = this;

					$.each(this._distinctDataValues, function (i, o) {
						o = (o || o === 0) ? o.toString().toLowerCase() : "";
						if (o.indexOf(value) >= 0) { // ie contains
							// if (o.indexOf(value) === 0) { // ie begins with
							indicesToShow.push(i + 1); // zero index is reserved for the "Select All" item
						}
					});

					if (indicesToShow.length) {
						this._elements.$checkboxes.each(function (i, o) {
							if (i) { // skip "select all" item
								if (i === indicesToShow[idx]) {
									idx++;
									$(o).closest("li").show();
								} else {
									$(o).closest("li").hide();
								}
							}
						});
					} else {
						this._elements.$checkboxes.closest("li").hide(); // hide all items
					}
				}
			}

			this._searchKey = value;
		},

		_resetFilters: function () {
			try {
				this._ignoreEvents = true; // ignore change\ changed etc events from editors

				this.options.filterValue = [[undefined]];
				this.options.filterOperator = [{ name: "NoFilter"}];

				this._resetFilterArea();
				this._elements.$searchTb.val("");
				this._resetCheckboxes();
			}
			finally {
				this._ignoreEvents = false;
			}
		},

		_resetFilterArea: function () {
			this._searchKey = undefined;

			// reset operators
			this._elements.$filterOperatorsDdl
				.prop("selectedIndex", 0)
				.wijdropdown("refresh");

			// reset radios (set "or" item)
			this._elements.$radioButtons
				.eq(1)
				.prop("checked", true)
				.wijradio("refresh");

			// reset values
			this._elements.$filterValuesDdl
				.val("") // reset text area
				.wijcombobox("option", "selectedIndex", -1);
		},

		_resetCheckboxes: function () {
			this._elements.$checkboxes
				.closest("li")
					.show()
					.end() // pop checkboxes back
				.prop("checked", false)
				.wijcheckbox("refresh");

			this._elements.$searchTb.val("");
		},

		_isSettingsChanged: function (a, b) {
			return (a.sortDirection !== b.sortDirection) ||
				this._compareArrays(a.filterValue, b.filterValue) ||
				this._compareArrays(a.filterOperator, b.filterOperator, function (op1, op2) {
					return (op1.name.toLowerCase() !== op2.name.toLowerCase()) ||
						((op1.condition || "or") !== (op2.condition || "or"));
				});
		},

		_compareArrays: function (a, b, valueCallback) {
			if ($.isArray(a) && $.isArray(b)) {
				if (a.length !== b.length) {
					return true;
				}

				var flag = false,
					i, len;

				for (i = 0, len = a.length; i < len && !flag; i++) {
					flag = this._compareArrays(a[i], b[i], valueCallback);
				}

				return flag;
			}

			return (valueCallback)
				? valueCallback(a, b)
				: a !== b;
		},

		_getDistinctDataValues: function (data, dataKey) {
			var result = [],
				hash = {};

			if (data) {
				$.each(data, function (i, row) {
					var value = row[dataKey];

					if (hash[value] === undefined) {
						hash[value] = true;
						result.push(value);
					}
				});
			}

			return result.sort(function (a, b) {
				if (a instanceof Date) {
					a = a.getTime();
				}

				if (b instanceof Date) {
					b = b.getTime();
				}

				if (a === b) {
					return 0;
				} else {
					return (a < b)
						? -1
						: 1;
				}
			});
		},

		_createRoughDialog: function () {
			var id,
				guid = $.wijmo.wijfilter.guid,
				html = "<div class=\"wijmo-wijfilter-container\">" +

						"<div class=\"wijmo-wijfilter-headerContainer ui-widget-header ui-corner-all ui-helper-clearfix\">" +
							"<span class=\"wijmo-wijfilter-headerText\"></span>" +
							"<a class=\"wijmo-wijfilter-closeButton\" href=\"#\">Close</a>" +
						"</div>" +

						"<h3>Sort</h3>" +
						"<div class=\"wijmo-wijfilter-sortContainer\">" +
							"<input type=\"checkBox\" class=\"wijmo-wijfilter-ascendingButton\" id=\"{0}\" /><label for=\"{0}\">Ascending</label>" +
							"<input type=\"checkBox\" class=\"wijmo-wijfilter-descendingButton\" id=\"{1}\" /><label for=\"{1}\">Descending</label>" +
						"</div>" +

						"<h3>Filter</h3>" +

						"<div class=\"wijmo-wijfilter-filterContainer\">" +
							"<select class=\"wijmo-wijfilter-dropdown\">" +
							"</select>" +
							"<input type=\"text\" class=\"wijmo-wijfilter-combobox\" />" +
						"</div>" +

						"<div class=\"wijmo-wijfilter-radioContainer\">" +
							"<input type=\"radio\" id=\"{2}\" name=\"{4}\" /><label for=\"{2}\">And</label>" +
							"<input type=\"radio\" id=\"{3}\" name=\"{4}\" checked=\"checked\" /><label for=\"{3}\">Or</label>" +
						"</div>" +

						"<div class=\"wijmo-wijfilter-filterContainer\">" +
							"<select class=\"wijmo-wijfilter-dropdown\">" +
							"</select>" +
							"<input type=\"text\" class=\"wijmo-wijfilter-combobox\" />" +
						"</div>" +

						"<div class=\"wijmo-wijfilter-searchContainer\">" +
							"<input class=\"wijmo-wijfilter-text\" type=\"text\" /><span class=\"ui-icon ui-icon-search\"></span>" +
						"</div>" +

						"<div class=\"wijmo-wijfilter-checkboxContainer ui-state-default\">" +
							"<div><input id=\"{5}\" type=\"checkbox\" class=\"wijmo-wijfilter-selectAll\" /><label for=\"{5}\">(Select All)</label></div>" +
						"</div>" +

						"<a class=\"wijmo-wijfilter-clearButton\" href=\"#\">Clear Filter</a>" +

						"<div class=\"wijmo-wijfilter-actionContainer\">" +
							"<a class=\"wijmo-wijfilter-applyButton\" href=\"#\">Apply</a>" +
							"<a class=\"wijmo-wijfilter-cancelButton\" href=\"#\">Cancel</a>" +
						"</div>" +
						"</div>";

			html = (function (text /*, pattern0, ..., patternN */) {
				var args = arguments;
				return text.replace(/{\d+}/g, function (match) {
					return args[parseInt(match.replace(/[{}]/g, ""), 10) + 1];
				});
			})(html, guid("ascBtn"), guid("descBtn"), guid("radioAnd"), guid("radioOr"), guid("radioGroup"), guid("selectAll"));

			return $(html);
		},

		_attachElements: function (dataValues, availableOperators) {
			var dialog = this._dialog,
				self = this,
				foo;

			// -- get elements --
			foo = this._elements.$headerContainer = dialog.find(".wijmo-wijfilter-headerContainer");
			this._elements.$headerText = foo.find(".wijmo-wijfilter-headerText");
			this._elements.$headerCloseBtn = foo.find(".wijmo-wijfilter-closeButton");

			foo = this._elements.$sortContainer = dialog.find(".wijmo-wijfilter-sortContainer");
			this._elements.$ascendingBtn = foo.find(".wijmo-wijfilter-ascendingButton");
			this._elements.$descendingBtn = foo.find(".wijmo-wijfilter-descendingButton");

			foo = this._elements.$filterContainer = dialog.find(".wijmo-wijfilter-filterContainer");
			this._elements.$filterOperatorsDdl = foo.find(".wijmo-wijfilter-dropdown");
			this._elements.$filterValuesDdl = foo.find(".wijmo-wijfilter-combobox");

			this._elements.$radioButtons = dialog.find(".wijmo-wijfilter-radioContainer input");

			this._elements.$searchTb = dialog.find(".wijmo-wijfilter-searchContainer input");

			this._elements.$checkboxContainer = dialog.find(".wijmo-wijfilter-checkboxContainer");

			this._elements.$clearBtn = dialog.find(".wijmo-wijfilter-clearButton");

			foo = dialog.find(".wijmo-wijfilter-actionContainer");
			this._elements.$applyBtn = foo.find(".wijmo-wijfilter-applyButton");
			this._elements.$cancelBtn = foo.find(".wijmo-wijfilter-cancelButton");

			// -- create widgets --

			this._elements.$headerCloseBtn
				.button({ text: false, icons: { primary: 'ui-icon-close'} })
				.click(function () { self.triggerClose(false); });

			// sort buttons

			this._elements.$ascendingBtn
				.button({ text: true, icons: { primary: 'ui-icon-arrowthickstop-1-n'} })
				.click($.proxy(self._onAscendingButtonClick, this));

			this._elements.$descendingBtn
				.button({ text: true, icons: { primary: 'ui-icon-arrowthickstop-1-s'} })
				.click($.proxy(self._onDescendingButtonClick, this));

			// set filter operators and attach wijdropdown
			this._elements.$filterOperatorsDdl
				.append($.map(availableOperators || [], function (item, i) {
					var name = item.name.toLowerCase();
					return new Option(item.displayName || item.name, name);
				}))
				.change($.proxy(this._onFilterAreaChanged, this))
				.wijdropdown();

			// attach wijradio to radio buttons
			this._elements.$radioButtons
				.change($.proxy(this._onRadioButtonChanged, this))
				.wijradio();

			// attach wijcombobox to filter values
			foo = $.map(dataValues, function (item, i) {
				return { label: item + "", value: item };
			});

			this._elements.$filterValuesDdl
			.change($.proxy(this._onFilterAreaChanged, this))
			.wijcombobox({
				autoComplete: false,
				data: foo,
				changed: $.proxy(this._onFilterAreaChanged, this)
			});

			// attach wijtextbox to search text box
			this._elements.$searchTb
				.keyup($.proxy(this._onSearchTextboxKeyUp, this))
				.wijtextbox();

			// create checkboxes
			this._elements.$checkboxContainer
				.append("<ul />")
				.find("> ul")
				.append(
					$.map(dataValues, function (item, i) {
						var id = $.wijmo.wijfilter.guid("cb"),
							$item = $("<li />");

						$item.append($("<input type=\"checkbox\" id=\"" + id + "\" dataidx=\"" + i + "\" /><label for=\"" + id + "\">" + item + "</label>"));
						return $item[0];
					})
				);

			// attach event and wijcheckbox
			this._elements.$checkboxes = this._elements.$checkboxContainer
				.find("input")
				.change($.proxy(self._onCheckboxChange, this))
				.wijcheckbox();

			// clear filter button
			this._elements.$clearBtn
				.button()
				.click(function () { self._onClearButtonClick(); });

			this._elements.$applyBtn
				.button()
				.click(function () { self._onApplyButtonClick(); });

			this._elements.$cancelBtn
				.button()
				.click(function () { self.triggerClose(false); });
		},

		_fillDialog: function () {
			var fop = this.options.filterOperator,
				fv = this.options.filterValue,
				self = this,
				idx, foo;

			// hide header container
			if (!this.options.showHeader) {
				this._elements.$headerContainer.hide();
			}

			// set title
			this._elements.$headerText.html(this.options.title);

			// activate sort direction button
			this._elements.$sortContainer.find(".wijmo-wijfilter-" + this.options.sortDirection + "Button")
				.prop("checked", true);

			// change disabled status of sorting buttons _AND_ refresh
			this._elements.$sortContainer.find("input")
				.button("option", "disabled", !this.options.enableSortButtons)
				.button("refresh");

			// fill checkboxes
			if ((fop.length === 1) && ((fop[0].name || "").toLowerCase() === "equals") && (fv[0].length > 1)) {

				$.each(fv[0], function (i, o) {
					if (typeof (o) === "string") {
						o = o.toLowerCase();
					}

					if ((idx = $.inArray(o, self._distinctDataValuesCI)) >= 0) {
						$(self._elements.$checkboxes[idx + 1]) // zero index is reserved for the "Select all" item.
							.prop("checked", true)
							.wijcheckbox("refresh");
					}
				});
			} else { // set filter area
				// set filter operators
				$.each(fop, function (i, o) {
					if (i < 2) {
						self._elements.$filterOperatorsDdl
							.eq(i)
							.val(o.name.toLowerCase())
							.wijdropdown("refresh");
					}
				});

				// set filter values
				$.each(fv, function (i, o) {
					if (i < 2) { // two first values only
						var $item = self._elements.$filterValuesDdl.eq(i);

						$item.wijcombobox("option", "selectedValue", o[0]);
						if (!$item.val()) { // no such item?
							$item.val(o[0]); // update text area
						}
					}
				});

				// set condition
				if (fop.length > 1 && fop[1].condition === "and") {
					this._elements.$radioButtons
						.eq(0)
						.prop("checked", true)
						.wijradio("refresh");
				}
			}
		}
	});

	$.extend($.wijmo.wijfilter, {
		guidValue: 0,
		guid: function (prefix) {
			return "wijfilter_" + (prefix || "") + $.wijmo.wijfilter.guidValue++;
		}
	});
})(jQuery);
