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
    /// <reference path="../Base/jquery.wijmo.widget.ts"/>
    /// <reference path="../wijcombobox/jquery.wijmo.wijcombobox.ts"/>
    /// <reference path="../wijcheckbox/jquery.wijmo.wijcheckbox.ts"/>
    /// <reference path="../wijdropdown/jquery.wijmo.wijdropdown.ts"/>
    /// <reference path="../wijradio/jquery.wijmo.wijradio.ts"/>
    /// <reference path="../wijtextbox/jquery.wijmo.wijtextbox.ts"/>
    /*
    * Depends:
    *   jquery-1.9.1.js
    *	jquery.ui.core.js
    *	jquery.ui.widget.js
    *   jquery.wijmo.widget.js
    *	jquery.wijmo.wijdropdown.js
    *	jquery.wijmo.wijradio.js
    *	jquery.wijmo.wijtextbox.js
    *	jquery.wijmo.wijcheckbox.js
    *	jquery.wijmo.wijcombobox.js
    */
    (function (filter) {
        "use strict";
        var $ = jQuery;
        /** @widget */
        var wijfilter = (function (_super) {
            __extends(wijfilter, _super);
            function wijfilter() {
                _super.apply(this, arguments);

            }
            wijfilter.prototype._create = function () {
                this._super.apply(this, arguments);
                this._initialized = false;
                this.element.addClass(this.options.wijCSS.widget + " " + "wijmo-wijfilter");
            };
            wijfilter.prototype._init = function () {
                if(!this._initialized) {
                    this._recreate();
                }
            };
            wijfilter.prototype._setOptions = function () {
                this._super.apply(this, arguments);
                try  {
                    this._initialized = false;
                    this._recreate();
                }finally {
                    this._initialized = true;
                }
            };
            wijfilter.prototype._recreate = function () {
                var self = this;
                this._searchTimer = 0;
                this._searchKey = undefined;
                this._ignoreEvents = false;
                this._elements = {
                };
                if(this._dialog) {
                    this._dialog.remove();
                    this._dialog = null;
                }
                this.options.filterValue = $.map(this.options.filterValue, function (o, i) {
                    return ($.isArray(o)) ? [
                        o
                    ] : [
                        [
                            o
                        ]
                    ];
                });
                this._originalOptions = $.extend(true, {
                }, {
                    sortDirection: this.options.sortDirection,
                    filterValue: this.options.filterValue,
                    filterOperator: this.options.filterOperator
                });
                this._distinctDataValues = this._getDistinctDataValues(this.options.data, this.options.dataKey);
                this._distinctDataValuesCI = [];
                $.each(this._distinctDataValues, function (idx, item) {
                    // case insensitive data array
                    self._distinctDataValuesCI.push((typeof (item) === "string") ? item.toLowerCase() : item);
                });
                this.element.append(this._dialog = this._createRoughDialog());
                this._attachElements(this._distinctDataValues, this.options.availableOperators);
                this._fillDialog();
            };
            wijfilter.prototype._destroy = function () {
                if(this._dialog) {
                    this._dialog.remove();
                    this._dialog = null;
                }
                this.element.removeClass(this.options.wijCSS.widget + " " + "wijmo-wijfilter");
            };
            wijfilter.prototype.triggerClose = /**
            * Force wijfilter to raise the close event.
            * @param {Boolean} settingsChanged Indicates whether the wijfilter settings was changed or not. If true, then the values of the sortDirection, filterValue and filterOperator options will be passed to the event handler within the second parameter.
            */
            function (settingsChanged) {
                this._trigger("close", null, settingsChanged ? {
                    sortDirection: this.options.sortDirection,
                    filterValue: this.options.filterValue,
                    filterOperator: this.options.filterOperator
                } : null);
            };
            wijfilter.prototype._getDisplayValue = function (value) {
                return (value === null) ? this.options.nullDisplayText : value;
            };
            wijfilter.prototype._onApplyButtonClick = function (e, args) {
                if(this._isSettingsChanged(this.options, this._originalOptions)) {
                    var condition = this._elements.$radioButtons.eq(0).is(":checked") ? "and" : "or";
                    $.each(this.options.filterOperator, function (_, op) {
                        op.condition = condition;
                    });
                    this.triggerClose(true);
                } else {
                    this.triggerClose(false);
                }
            };
            wijfilter.prototype._onClearButtonClick = function () {
                this._resetFilterOptions();
                this._onApplyButtonClick()// close dialog
                ;
            };
            wijfilter.prototype._onAscendingButtonClick = function (e, args) {
                var $item = $(e.target);
                if($item.is(":checked")) {
                    this.options.sortDirection = "ascending";
                    this._elements.$descendingBtn.prop("checked", false).button("refresh");
                } else {
                    this.options.sortDirection = "none";
                }
            };
            wijfilter.prototype._onDescendingButtonClick = function (e, args) {
                var $item = $(e.target);
                if($item.is(":checked")) {
                    this.options.sortDirection = "descending";
                    this._elements.$ascendingBtn.prop("checked", false).button("refresh");
                } else {
                    this.options.sortDirection = "none";
                }
            };
            wijfilter.prototype._onCheckboxChange = function (e, args) {
                if(this._ignoreEvents) {
                    return;
                }
                var $cbItem = $(e.target), isChecked = $cbItem.is(":checked"), filterValues = [], self = this;
                if($cbItem.is(".wijmo-wijfilter-selectAll")) {
                    this._elements.$checkboxes.each(function (i, item) {
                        if(i) {
                            // skip "select all" item
                            $(item).prop("checked", isChecked).wijcheckbox("refresh");
                        }
                        return true;
                    });
                } else {
                    this._elements.$checkboxes.each(function (i, item) {
                        if(!i) {
                            // "select all" item, reset status
                            $(item).prop("checked", false).wijcheckbox("refresh");
                        } else {
                            if($(item).is(":checked")) {
                                filterValues.push(self._distinctDataValues[i - 1])// zero index is reserved for the "select all" item
                                ;
                            }
                        }
                        return true;
                    });
                }
                if(filterValues.length) {
                    this.options.filterOperator = [
                        {
                            name: "Equals"
                        }
                    ];
                    this.options.filterValue = [
                        filterValues
                    ];
                } else {
                    this._resetFilterOptions();
                }
                this._resetFilterArea();
            };
            wijfilter.prototype._onFilterAreaChanged = function (e, args) {
                if(this._ignoreEvents) {
                    return;
                }
                var self = this;
                this._resetCheckboxes();
                this.options.filterOperator = [
                    {
                        name: this._elements.$filterOperatorsDdl.eq(0).val()
                    }, 
                    {
                        name: this._elements.$filterOperatorsDdl.eq(1).val()
                    }
                ];
                this.options.filterValue = $.map(this._elements.$filterValuesDdl, function (o, i) {
                    var $item = $(o), idx = $item.wijcombobox("option", "selectedIndex");
                    return (idx >= 0) ? [
                        [
                            self._distinctDataValues[idx]
                        ]
                    ] : [
                        [
                            $item.val() || undefined
                        ]
                    ];// treat empty value as undefined.
                    
                });
            };
            wijfilter.prototype._onRadioButtonChanged = function (e, args) {
                if(this._ignoreEvents) {
                    return;
                }
                var condition = this._elements.$radioButtons.eq(0).is(":checked") ? "and" : "or";
                $.each(this.options.filterOperator, function (_, op) {
                    op.condition = condition;
                });
            };
            wijfilter.prototype._onSearchTextboxKeyUp = function (e, args) {
                if(this._ignoreEvents) {
                    return;
                }
                var self = this;
                if(this._searchTimer > 0) {
                    window.clearTimeout(this._searchTimer);
                }
                if(this._searchTimer !== -1) {
                    this._searchTimer = window.setTimeout(function () {
                        self._searchTimer = -1;
                        try  {
                            self._doSearch(e.target.value);
                        }finally {
                            self._searchTimer = 0;
                        }
                    }, 300);
                }
            };
            wijfilter.prototype._doSearch = function (value) {
                if(this._searchKey !== value) {
                    if(!value && value !== 0) {
                        this._elements.$checkboxes.closest("li").show()// show all items
                        ;
                    } else {
                        var indicesToShow = [], idx = 0, self = this;
                        $.each(this._distinctDataValues, function (i, o) {
                            o = (o || o === 0) ? o.toString().toLowerCase() : "";
                            if(o.indexOf(value) >= 0) {
                                // ie contains
                                // if (o.indexOf(value) === 0) { // ie begins with
                                indicesToShow.push(i + 1)// zero index is reserved for the "Select All" item
                                ;
                            }
                        });
                        if(indicesToShow.length) {
                            this._elements.$checkboxes.each(function (i, o) {
                                if(i) {
                                    // skip "select all" item
                                    if(i === indicesToShow[idx]) {
                                        idx++;
                                        $(o).closest("li").show();
                                    } else {
                                        $(o).closest("li").hide();
                                    }
                                }
                                return true;
                            });
                        } else {
                            this._elements.$checkboxes.closest("li").hide()// hide all items
                            ;
                        }
                    }
                }
                this._searchKey = value;
            };
            wijfilter.prototype._resetFilters = function () {
                try  {
                    this._ignoreEvents = true// ignore change\ changed etc events from editors
                    ;
                    this._resetFilterOptions();
                    this._resetFilterArea();
                    this._elements.$searchTb.val("");
                    this._resetCheckboxes();
                }finally {
                    this._ignoreEvents = false;
                }
            };
            wijfilter.prototype._resetFilterArea = function () {
                this._searchKey = undefined;
                // reset operators
                this._elements.$filterOperatorsDdl.prop("selectedIndex", 0).wijdropdown("refresh");
                // reset radios (set "or" item)
                this._elements.$radioButtons.eq(1).prop("checked", true).wijradio("refresh");
                // reset values
                this._elements.$filterValuesDdl.val("").wijcombobox(// reset text area
                "option", "selectedIndex", -1);
            };
            wijfilter.prototype._resetCheckboxes = function () {
                this._elements.$checkboxes.closest("li").show().end().prop(// pop checkboxes back
                "checked", false).wijcheckbox("refresh");
                this._elements.$searchTb.val("");
            };
            wijfilter.prototype._isSettingsChanged = function (a, b) {
                return (a.sortDirection !== b.sortDirection) || this._compareArrays(a.filterValue, b.filterValue) || this._compareArrays(a.filterOperator, b.filterOperator, function (op1, op2) {
                    return (op1.name.toLowerCase() !== op2.name.toLowerCase()) || ((op1.condition || "or") !== (op2.condition || "or"));
                });
            };
            wijfilter.prototype._compareArrays = function (a, b, valueCallback) {
                if($.isArray(a) && $.isArray(b)) {
                    if(a.length !== b.length) {
                        return true;
                    }
                    var flag = false, i, len;
                    for(i = 0 , len = a.length; i < len && !flag; i++) {
                        flag = this._compareArrays(a[i], b[i], valueCallback);
                    }
                    return flag;
                }
                return (valueCallback) ? valueCallback(a, b) : a !== b;
            };
            wijfilter.prototype._getDistinctDataValues = function (data, dataKey) {
                var result = [], hash = {
                };
                if(data) {
                    $.each(data, function (i, row) {
                        var value = row[dataKey];
                        if($.isFunction(value)) {
                            value = value();
                        }
                        if(hash[value] === undefined) {
                            hash[value] = true;
                            result.push(value);
                        }
                    });
                }
                return result.sort(function (a, b) {
                    if(a instanceof Date) {
                        a = a.getTime();
                    }
                    if(b instanceof Date) {
                        b = b.getTime();
                    }
                    if(a === b) {
                        return 0;
                    } else {
                        return (a < b) ? -1 : 1;
                    }
                });
            };
            wijfilter.prototype._createRoughDialog = function () {
                var wijCSS = this.options.wijCSS, html = "<div class=\"wijmo-wijfilter-container\">" + "<div class=\"wijmo-wijfilter-headerContainer " + wijCSS.header + " " + wijCSS.cornerAll + " " + wijCSS.helperClearFix + "\">" + "<span class=\"wijmo-wijfilter-headerText\"></span>" + "<a class=\"wijmo-wijfilter-closeButton\" href=\"#\">Close</a>" + "</div>" + "<h3>Sort</h3>" + "<div class=\"wijmo-wijfilter-sortContainer\">" + "<input type=\"checkbox\" class=\"wijmo-wijfilter-ascendingButton\" id=\"{0}\" /><label for=\"{0}\">Ascending</label>" + "<input type=\"checkbox\" class=\"wijmo-wijfilter-descendingButton\" id=\"{1}\" /><label for=\"{1}\">Descending</label>" + "</div>" + "<h3>Filter</h3>" + "<div class=\"wijmo-wijfilter-filterContainer\">" + "<select class=\"wijmo-wijfilter-dropdown\">" + "</select>" + "<input type=\"text\" class=\"wijmo-wijfilter-combobox\" />" + "</div>" + "<div class=\"wijmo-wijfilter-radioContainer\">" + "<input type=\"radio\" id=\"{2}\" name=\"{4}\" /><label for=\"{2}\">And</label>" + "<input type=\"radio\" id=\"{3}\" name=\"{4}\" checked=\"checked\" /><label for=\"{3}\">Or</label>" + "</div>" + "<div class=\"wijmo-wijfilter-filterContainer\">" + "<select class=\"wijmo-wijfilter-dropdown\">" + "</select>" + "<input type=\"text\" class=\"wijmo-wijfilter-combobox\" />" + "</div>" + "<div class=\"wijmo-wijfilter-searchContainer\">" + "<input class=\"wijmo-wijfilter-text\" type=\"text\" /><span class=\"ui-icon ui-icon-search\"></span>" + "</div>" + "<div class=\"wijmo-wijfilter-checkboxContainer ui-state-default\">" + "<div><input id=\"{5}\" type=\"checkbox\" class=\"wijmo-wijfilter-selectAll\" /><label for=\"{5}\">(Select All)</label></div>" + "</div>" + "<a class=\"wijmo-wijfilter-clearButton\" href=\"#\">Clear Filter</a>" + "<div class=\"wijmo-wijfilter-actionContainer\">" + "<a class=\"wijmo-wijfilter-applyButton\" href=\"#\">Apply</a>" + "<a class=\"wijmo-wijfilter-cancelButton\" href=\"#\">Cancel</a>" + "</div>" + "</div>";
                html = ((function (text/*, pattern0, ..., patternN */ ) {
                    var args = arguments;
                    return text.replace(/{\d+}/g, function (match) {
                        return args[parseInt(match.replace(/[{}]/g, ""), 10) + 1];
                    });
                }))(html, this._guid("ascBtn"), this._guid("descBtn"), this._guid("radioAnd"), this._guid("radioOr"), this._guid("radioGroup"), this._guid("selectAll"));
                return $(html);
            };
            wijfilter.prototype._attachElements = function (dataValues, availableOperators) {
                var dialog = this._dialog, wijCSS = this.options.wijCSS, self = this, foo;
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
                this._elements.$headerCloseBtn.button({
                    text: false,
                    icons: {
                        primary: wijCSS.iconClose
                    }
                }).click(function () {
                    self.triggerClose(false);
                });
                // sort buttons
                this._elements.$ascendingBtn.button({
                    text: true,
                    icons: {
                        primary: 'ui-icon-arrowthickstop-1-n'
                    }
                }).click($.proxy(self._onAscendingButtonClick, this));
                this._elements.$descendingBtn.button({
                    text: true,
                    icons: {
                        primary: 'ui-icon-arrowthickstop-1-s'
                    }
                }).click($.proxy(self._onDescendingButtonClick, this));
                // set filter operators and attach wijdropdown
                this._elements.$filterOperatorsDdl.append($.map(availableOperators || [], function (item, i) {
                    var name = item.name.toLowerCase();
                    var displayName = item.displayName || item.name;
                    //return new Option(displayName || item.name, name); // doesn't work in IE<9
                    return $(new Option(displayName || item.name, name)).html(displayName);
                })).change($.proxy(this._onFilterAreaChanged, this)).wijdropdown();
                // attach wijradio to radio buttons
                this._elements.$radioButtons.change($.proxy(this._onRadioButtonChanged, this)).wijradio();
                // attach wijcombobox to filter values
                foo = $.map(dataValues, function (item, i) {
                    return {
                        label: self._getDisplayValue(item) + "",
                        value: self._getDisplayValue(item)
                    };
                });
                this._elements.$filterValuesDdl.change($.proxy(this._onFilterAreaChanged, this)).wijcombobox({
                    autoComplete: false,
                    data: foo,
                    changed: $.proxy(this._onFilterAreaChanged, this)
                });
                // attach wijtextbox to search text box
                this._elements.$searchTb.keyup($.proxy(this._onSearchTextboxKeyUp, this)).wijtextbox();
                // create checkboxes
                this._elements.$checkboxContainer.append("<ul />").find("> ul").append($.map(dataValues, function (item, i) {
                    var id = self._guid("cb"), $item = $("<li />"), $label;
                    $item.append($("<input type=\"checkbox\" id=\"" + id + "\" dataidx=\"" + i + "\" />"));
                    $item.append($label = $("<label for=\"" + id + "\">" + "</label>"));
                    $label.text(self._getDisplayValue(item) + "");
                    return $item[0];
                }));
                // attach event and wijcheckbox
                this._elements.$checkboxes = this._elements.$checkboxContainer.find("input").change($.proxy(self._onCheckboxChange, this)).wijcheckbox();
                // clear filter button
                this._elements.$clearBtn.button().click(function () {
                    self._onClearButtonClick();
                });
                this._elements.$applyBtn.button().click(function () {
                    self._onApplyButtonClick();
                });
                this._elements.$cancelBtn.button().click(function () {
                    self.triggerClose(false);
                });
            };
            wijfilter.prototype._fillDialog = function () {
                var fop = this.options.filterOperator, fv = this.options.filterValue, self = this, idx;
                // hide header container
                if(!this.options.showHeader) {
                    this._elements.$headerContainer.hide();
                }
                // set title
                this._elements.$headerText.html(this.options.title);
                // activate sort direction button
                this._elements.$sortContainer.find(".wijmo-wijfilter-" + this.options.sortDirection + "Button").prop("checked", true);
                // change disabled status of sorting buttons _AND_ refresh
                (this._elements.$sortContainer.find("input")).button("option", "disabled", !this.options.enableSortButtons).button("refresh");
                var allEquals_Or = true;
                $.each(fop, function (i, op) {
                    return allEquals_Or = allEquals_Or && (((op.name || "").toLowerCase() === "equals") && ((op.condition || "or").toLowerCase() === "or"));
                });
                // fill checkboxes
                if(allEquals_Or && fv.length > 1) {
                    $.each(fv, function (i, value) {
                        if($.isArray(value)) {
                            // normalized form
                            value = value[0];
                        }
                        if(typeof (value) === "string") {
                            value = value.toLowerCase();
                        }
                        if((idx = $.inArray(value, self._distinctDataValuesCI)) >= 0) {
                            $(self._elements.$checkboxes[idx + 1]).prop(// zero index is reserved for the "Select all" item.
                            "checked", true).wijcheckbox("refresh");
                        }
                    });
                } else {
                    // set filter area
                    // set filter operators
                    $.each(fop, function (i, o) {
                        if(i < 2) {
                            // two first operators only
                            self._elements.$filterOperatorsDdl.eq(i).val(o.name.toLowerCase()).wijdropdown("refresh")// update editor
                            ;
                        }
                    });
                    // set filter values
                    $.each(fv, function (i, o) {
                        if(i < 2) {
                            // two first values only
                                                        var singleFilterValue = o[0], $item = self._elements.$filterValuesDdl.eq(i);
                            if(singleFilterValue !== undefined) {
                                var displayValue = self._getDisplayValue(singleFilterValue);
                                $item.wijcombobox("option", "selectedValue", displayValue);
                                if(!$item.val()) {
                                    // no such item?
                                    $item.val(displayValue + "")// update text area
                                    ;
                                }
                            }
                        }
                    });
                    // set condition
                    if(fop.length > 1 && fop[1].condition === "and") {
                        this._elements.$radioButtons.eq(0).prop("checked", true).wijradio("refresh");
                    }
                }
            };
            wijfilter.prototype._guid = function (prefix) {
                return "wijfilter_" + (prefix || "") + (wijfilter.prototype).guidValue++;
            };
            wijfilter.prototype._resetFilterOptions = function () {
                this.options.filterValue = [
                    [
                        undefined
                    ]
                ];
                this.options.filterOperator = [
                    {
                        name: "NoFilter"
                    }
                ];
            };
            return wijfilter;
        })(wijmo.wijmoWidget);
        filter.wijfilter = wijfilter;        
        wijfilter.prototype.widgetEventPrefix = "wijfilter";
        $.extend(wijfilter.prototype, {
            guidValue: 0
        });
        var wijfilter_options = (function () {
            function wijfilter_options() {
                /** @ignore */
                this.wijCSS = undefined;
                /** An array of data to get filtering values from where each element is a one-dimensional array or object:
                * [[ val0, ..., valN ], ..., [ val0, ..., valN ]]
                * or
                * [{ prop0: val0, ..., propN: valN }, ..., { prop0: val0, ..., propN: valN }]
                * @example
                * $("#element").wijfilter({ data: [{ ID: 0, Name: "Name0" }, { ID: 1, Name: "Name1" }] });
                */
                this.data = undefined;
                /** A value used to identify a column in a data array. Can be string if the data option contains an array of objects or an integer if the data option is an array of arrays.
                * @type {String|Number}
                * @example
                * $("#element").wijfilter({ dataKey: "ID" });
                */
                this.dataKey = undefined;
                /** A value used to indicate the text to display for a data item when the value of the data item is null.
                * @example
                * $("#element").wijfilter({ nullDisplayText: "&lt;Null&gt;" });
                */
                this.nullDisplayText = "<null>";
                /** Specifies the title of the dialog.
                * @example
                * $("#element").wijfilter({ title: "" });
                */
                this.title = "";
                /** A value indicating whether sorting buttons are enabled.
                * @example
                * $("#element").wijfilter({ enableSortButtons: false });
                */
                this.enableSortButtons = false;
                /** An array of available filter operators to select.
                * @example
                * $("#element").wijfilter({ availableOperators: [ { name: "lessorequal", displayName: "Less Or Equal" }] });
                */
                this.availableOperators = undefined;
                /** A value indicating whether header is visible.
                * @example
                * $("#element").wijfilter({ showHeader: true });
                */
                this.showHeader = true;
                /** Determines the sort direction.
                * Possible values are: "none", "ascending" and "descending".
                * "none": no sorting.
                * "ascending": sort from smallest to largest.
                * "descending": sort from largest to smallest.
                * @example
                * $("#element").wijgrid({ columns: [{ sortDirection: "none" }] });
                */
                this.sortDirection = undefined;
                /** A value set for filtering.
                * An array where each value is used as the value in the array of filter operators of the filterOperator option.
                * @example
                * $("#element").wijfilter({ filterValue: ["a", "b"] });
                */
                this.filterValue = [];
                /** An array of filter operators.
                * @example
                * $("#element").wijfilter({ filterOperator: [ { name: "lessorequal" } ] });
                * @remarks
                * The widget cannot display more than two operators.
                */
                this.filterOperator = [];
                /** The close event handler. A function called when dialog is closed.
                * @event
                * @example
                * Supply a callback function to handle the close event:
                * $("#element").wijfilter({ close: function (e, args) { } });
                * Bind to the event by type:
                * $("#element").bind("wijfilterclose", function (e, args) { });
                * @param {Object} e jQuery.Event object.
                * @param {wijmo.filter.ICloseEventArgs} args The data with this event.
                */
                this.close = null;
            }
            return wijfilter_options;
        })();        
        wijfilter.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijfilter_options());
        $.wijmo.registerWidget("wijfilter", wijfilter.prototype);
    })(wijmo.filter || (wijmo.filter = {}));
    var filter = wijmo.filter;
})(wijmo || (wijmo = {}));
