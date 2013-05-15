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
/*
 * Depends:
 * jquery-1.9.1.js
 * jquery.ui.core.js
 * jquery.ui.widget.js
 * globalize.js
 * jquery.wijmo.widget.js
 * jquery.wijmo.wijutil.js
 * wijmo.data.js
 *
 * Optional dependencies for paging feature:
 * jquery.wijmo.wijpager.js
 *
 * Optional dependencies for scrolling feature:
 * jquery.wijmo.wijsuperpanel.js
 *
 * Optional dependencies for filtering feature:
 * jquery.ui.position.js
 * jquery.wijmo.wijinputdate.js
 * jquery.wijmo.wijinputmask.js
 * jquery.wijmo.wijinputnumber.js
 * jquery.wijmo.wijlist.js
 *
 * Optional dependencies for column moving feature:
 * jquery.ui.draggable.js
 * jquery.ui.droppable.js
 * jquery.ui.position.js
 *
 */

var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery;
    var wijgrid = (function (_super) {
        __extends(wijgrid, _super);
        function wijgrid() {
            _super.apply(this, arguments);

            // private fields **
            this._dataOffset = 0;
            this._scrollingState = {
                x: null,
                y: // h. pos
                null,
                index: // v. pos
                0
            };// scroll index (virtual scrolling)

            this._windowResizeTimer = 0;
        }
        wijgrid.prototype._createWidget = // * override
        function (options, element) {
            // Late binding, a fix for the case if options.data contains a complex object leading to stack overflow when $.extend is called in the widget factory.
            var data = options && (wijmo).data.util.isClassInstance(options.data) && !((typeof wijdatasource === "function") && (options.data instanceof wijdatasource)) && options.data;
            if(data) {
                delete options.data;
            }
            _super.prototype._createWidget.apply(this, arguments);
            if(data) {
                this.option("data", data);
            }
        };
        wijgrid.prototype._create = function () {
            var self = this;
            if(!this.element.is("table")) {
                throw "invalid markup";
            }
            this._windowResizeTimer = 0;
            this._dataOffset = 0;
            this._scrollingState = {
                x: null,
                y: null,
                index: 0
            };
            this._initialized = false;
            this._destroyed = false;
            this._rendered = false;
            this._eventUID = undefined;
            ;
            this._dataViewWrapper = undefined;
            this._originalHtml = undefined;
            this._originalAttr = undefined;
            this._originalCssText = undefined;
            this._autoHeight = undefined;
            this._autoWidth = undefined;
            this._renderCounter = 0;
            this.$superPanelHeader = undefined;
            this.$topPagerDiv = undefined;
            this.$bottomPagerDiv = undefined;
            this.$groupArea = undefined;
            this.__uid = undefined;
            this._wijDataView = undefined;
            this.outerDiv = undefined;
            this.sketchTable = undefined;
            this.cellFormatter = undefined;
            this.rowStyleFormatter = undefined;
            this.cellStyleFormatter = undefined;
            this._eventUID = wijmo.grid.getUID();
            this._spinnerIsActivated = false;
            // ** jQuery UI 1.9.0 fix
            this.options = $.extend(true, {
            }, this.options);
            // jQuery UI 1.9.0 fix **
            // enable touch support:
            if(window.wijmoApplyWijTouchUtilEvents) {
                $ = window.wijmoApplyWijTouchUtilEvents($);
            }
            // handle juice objectValue serialize
            if($.isFunction(window["wijmoASPNetParseOptions"])) {
                window["wijmoASPNetParseOptions"](this.options);
            }
            this._initialized = false;
            this._destroyed = false;
            var styleHeight = this.element[0].style.height, styleWidth = this.element[0].style.width;
            // initialize data
            this._dataViewWrapper = new wijmo.grid.dataViewWrapper(this);
            this._originalHtml = this.element.html()// store original html. Will be restored in the destroy() method.
            ;
            this._originalAttr = {
            };
            this._originalCssText = this.element[0].style.cssText;
            this.element.addClass("wijmo-wijgrid-root");
            this.element.wrap("<div class=\"" + this.options.wijCSS.widget + " wijmo-wijgrid " + this.options.wijCSS.content + " " + this.options.wijCSS.cornerAll + "\"></div>")// outer div
            ;
            this.outerDiv = this.element.parent();
            // -
            //this.outerDiv.css({ "height": this.element.css("height"), "width": this.element.css("width") });
            if(styleHeight) {
                this.outerDiv.css("height", this.element[0].style.height);
            }
            if(styleHeight !== "" && styleHeight !== "auto") {
                this._autoHeight = false;
            } else {
                this._autoHeight = true;
            }
            if(styleWidth) {
                this.outerDiv.css("width", this.element[0].style.width);
            }
            if(styleWidth !== "" && styleWidth !== "auto") {
                this._autoWidth = false;
            } else {
                this._autoWidth = true;
            }
            this.element.css({
                "height": "",
                "width": ""
            });
            if(this.options.disabled) {
                this.disable();
            }
            // formatters
            this.cellFormatter = new wijmo.grid.cellFormatterHelper();
            this.rowStyleFormatter = new wijmo.grid.rowStyleFormatterHelper(this);
            this.cellStyleFormatter = new wijmo.grid.cellStyleFormatterHelper(this);
            // * set bounds
            this._field("viewRenderBounds", {
                start: 0,
                end: 0
            });
            if(this._allowVirtualScrolling()) {
                this._field("viewRenderBounds").start = this._scrollingState.index// == 0 by default.
                ;
                if(this._serverSideVirtualScrolling()) {
                    this._dataOffset = this._scrollingState.index;
                }
            }
            // set bounds *
            // wijObservable
            if(this.element.wijAddVisibilityObserver) {
                this.element.wijAddVisibilityObserver(function () {
                    //if (self.element.is(":visible")) {
                    if(self._initialized && !self._destroyed) {
                        self.setSize();
                    }
                    //}
                                    }, "wijgrid");
            }
            this._renderCounter = 0;
        };
        wijgrid.prototype._destroy = function () {
            var tmp, self = this;
            try  {
                this._view().dispose();
                this._detachEvents(true);
                if(tmp = this._field("resizer")) {
                    tmp.dispose();
                }
                if(tmp = this._field("frozener")) {
                    tmp.dispose();
                }
                if(tmp = this._field("selectionui")) {
                    tmp.dispose();
                }
                if(tmp = this._field("dragndrop")) {
                    tmp.dispose();
                }
                this._dataViewWrapper.dispose();
                // cleanup $data
                wijmo.grid.remove$dataByPrefix(this.element, this._data$prefix);
                if(this.element.wijRemoveVisibilityObserver) {
                    this.element.wijRemoveVisibilityObserver();
                }
                // ** restore original content
                // restore content and destroy children widgets + data.
                this.element.insertBefore(this.outerDiv);
                this.outerDiv.remove();
                this.element.html(this._originalHtml);
                // restore attributes
                $.each(this._originalAttr, function (key, value) {
                    if(value === undefined) {
                        self.element.removeAttr(key);
                    } else {
                        self.element.attr(key, value);
                    }
                });
                this.element.removeClass("wijmo-wijgrid-root");
                this.element[0].style.cssText = this._originalCssText// restore style properties
                ;
                // restore original content **
                            }finally {
                this._destroyed = true;
            }
        };
        wijgrid.prototype._init = function () {
            this.$superPanelHeader = null;
            this.$topPagerDiv = null;
            this.$bottomPagerDiv = null;
            this.$groupArea = null;
            // culture
            this._field("closestCulture", Globalize.findClosestCulture(this.options.culture) || Globalize.findClosestCulture("default"));
            if(!this.options.data) {
                // dataSource is a domTable
                if(!this._field("thead")) {
                    // read tHead section
                    this._field("thead", wijmo.grid.readTableSection(this.element, 1));
                }
                if(!this._field("tfoot")) {
                    // read tFoot section
                    this._field("tfoot", wijmo.grid.readTableSection(this.element, 3));
                }
            }
            /*if (this._serverSideVirtualScrolling()) {
            this._dataOffset = this.options.pageIndex * this.options.pageSize;
            }*/
            this._initialized = this._initialized || false// to avoid reinitialization.
            ;
            this.ensureControl(true);
        };
        wijgrid.prototype._setOption = function (key, value) {
            var presetFunc = this["_preset_" + key], oldValue = this.options[key], optionChanged, postsetFunc;
            if(presetFunc !== undefined) {
                value = presetFunc.apply(this, [
                    value,
                    oldValue
                ]);
            }
            optionChanged = (value !== oldValue);
            //$.Widget.prototype._setOption.apply(this, arguments); note: there is no dynamic linkage between the arguments and the formal parameter values when strict mode is used
            _super.prototype._setOption.apply(this, [
                key,
                value
            ])// update this.options
            ;
            if(optionChanged) {
                postsetFunc = this["_postset_" + key];
                if(postsetFunc !== undefined) {
                    postsetFunc.apply(this, [
                        value,
                        oldValue
                    ]);
                }
            }
        };
        wijgrid.prototype.columns = // * override
        // * public
        function () {
            /// <summary>
            /// Returns a one-dimensional array of widgets bound to visible column headers.
            /// Code example: var colWidgets = $("#element").wijgrid("columns");
            /// </summary>
            /// <returns type="Array" elementType="$.wijmo.c1basefield">A one-dimensional array of widgets bound to visible column headers.</returns>
            return this._field("columns") || [];
        };
        wijgrid.prototype.currentCell = // setter 2
        function (a, b) {
            /// <summary>
            /// Gets or sets the current cell for the grid.
            /// Note: Use (-1, -1) value to hide the current cell.
            /// Code example:
            /// -) Getter:
            ///   var current = $("#element).wijgrid("currentCell");
            /// -) Setter:
            ///   $("#element).wijgrid("currentCell", new $.wijmo.wijgrid.cellInfo(0, 0));
            ///   or
            ///   $("#element).wijgrid("currentCell", 0, 0);
            /// </summary>
            /// <param name="cellInfo" type="$.wijmo.wijgrid.cellInfo">Object that represents a single cell.</param>
            /// <param name="cellIndex" type="Number" integer="true" optional="true">Zero-based index of the required cell inside the corresponding row.</param>
            /// <param name="rowIndex" type="Number" integer="true" optional="true">Zero-based index of the row that contains required cell.</param>
            /// <returns type="$.wijmo.wijgrid.cellInfo">Object that represents current cell of the grid.</returns>
                        var currentCell, view = this._view(), rows = this._rows();
            if(arguments.length === 0) {
                // getter
                currentCell = this._field("currentCell");
                if(!currentCell) {
                    this._field("currentCell", currentCell = wijmo.grid.cellInfo.outsideValue);
                }
                return currentCell;
            } else {
                // setter
                currentCell = (arguments.length === 1) ? (a)._clone() : new wijmo.grid.cellInfo(a, b);
                if(!currentCell.isEqual(wijmo.grid.cellInfo.outsideValue)) {
                    if(!currentCell._isValid()) {
                        throw "invalid arguments";
                    }
                    currentCell._clip(this._getDataCellsRange());
                    if(currentCell.rowIndex() >= 0) {
                        if(!(view._getRowInfo(rows.item(currentCell.rowIndex())).type & wijmo.grid.rowType.data)) {
                            return;
                        }
                    }
                }
                currentCell._setGridView(this);
                this._changeCurrentCell(null, currentCell);
                return this._field("currentCell");
            }
        };
        wijgrid.prototype.data = function () {
            /// <summary>
            /// Gets a array of the underlying data.
            /// Code example: var data = $("#element").wijgrid("data");
            /// </summary>
            /// <returns type="Array"></returns>
            //return this._dataViewWrapper.dataView()();
            return this._dataViewWrapper.dataView().getSource();
        };
        wijgrid.prototype.dataView = function () {
            /// <summary>
            /// Gets an underlying wijdataview instance.
            /// Code example: var dataView = $("#element").wijgrid("dataView");
            /// </summary>
            /// <returns type="Object"></returns>
            return this._dataViewWrapper.dataView();
        };
        wijgrid.prototype.doRefresh = function (userData) {
            /// <summary>
            /// Re-renders wijgrid.
            /// Code example: $("#element").wijgrid("doRefresh");
            /// </summary>
            if(!$.isPlainObject(userData)) {
                userData = {
                };
            }
            var leaves, self = this, uid = wijmo.grid.EXPANDO, virtualRefresh = userData && userData.virtualScrollData;
            if(!this._initialized) {
                try  {
                    this._prepareColumnOptions(true, true)// prepare static and dynamic columns
                    ;
                } catch (e) {
                    throw e;
                }finally {
                    //ownerise the column for bug 16936, 17079
                    this._ownerise(true);
                    this._initialized = true;
                }
            } else {
                //				if (userData && $.isFunction(userData.beforeRefresh)) {
                //					userData.beforeRefresh.apply(this);
                //				}
                            }
            if(!virtualRefresh) {
                // do not rebuild leaves during virtual scrolling callback
                this._rebuildLeaves()// build leaves, visible leaves, set dataIndex etc
                ;
                var dataSlice = this._dataViewWrapper.data();
                var dataView = this._dataViewWrapper.dataView();
                $.each(this._field("leaves"), function () {
                    // copy totals
                    this._totalsValue = (dataSlice.totals) ? dataSlice.totals[this.dataKey] : undefined;
                });
                // this._setPageCount(dataSlice);
                this.sketchTable = [];
                if(dataSlice.data && dataSlice.data.length) {
                    // process data items
                    leaves = this._field("leaves");
                    $.each(dataSlice.data, function (i, item) {
                        self.sketchTable.push(self._buildSketchRow(item, leaves));
                    });
                } else {
                    if(dataSlice.emptyData) {
                        // process empty data row
                        leaves = this._field("visibleLeaves");
                        $.each(dataSlice.emptyData, function (i, item) {
                            self.sketchTable.push(self._buildSketchRowEmptyDataItem(item, leaves, i === dataSlice.emptyData.length - 1));
                        });
                    }
                }
            }
            this._onRendering(userData);
            if(!virtualRefresh) {
                this._refresh(userData);
            } else {
                this._refreshVirtual(userData);
            }
            this._onRendered(userData);
            if(userData && $.isFunction(userData.afterRefresh)) {
                userData.afterRefresh.apply(this, [
                    userData
                ]);
            }
        };
        wijgrid.prototype.beginEdit = function () {
            /// <summary>
            /// Puts the current cell in editing mode.
            /// Note: works only if the allowEditing option is set to true.
            /// Code example: $("#element").wijgrid("beginEdit");
            /// </summary>
            /// <returns type="Boolean">True if the cell is successfully put in edit mode, otherwise false.</returns>
            return this._beginEditInternal(null);
        };
        wijgrid.prototype.endEdit = function () {
            /// <summary>
            /// Finishes editing the current cell.
            /// Code example: $("#element").wijgrid("endEdit");
            /// </summary>
            return this._endEditInternal(null);
        };
        wijgrid.prototype.ensureControl = function (loadData, userData) {
            /// <summary>
            /// Moves column widgets options to wijgrid options and renders wijgrid
            /// Code example: $("#element").wijgrid("ensureControl", true);
            /// </summary>
            /// <param name="loadData" type="Boolean">Determines if wijgrid must load data from linked data source before rendering.</param>
            this._loading();
            if(!$.isPlainObject(userData)) {
                userData = {
                    data: null,
                    afterRefresh: null,
                    beforeRefresh: null
                };
            }
            userData._wijgridMarker = true;
            if(this._initialized) {
                this._convertWidgetsToOptions();
            } else {
                // this._prepareColumnOptions(false); // prepare static columns only
                this._prepareColumnOptions(this._dataViewWrapper.isDataLoaded(), false);
                if(!this._dataViewWrapper.isOwnDataView()) {
                    // map sorting\ filtering\ paging settings from external dataView to the grid's options during initialization stage
                    (new wijmo.grid.settingsManager(this)).MapDVToWG();
                }
            }
            this._ownerise(true);
            // * TODO: move to the doRefresh?
            if(this._initialized) {
                if(userData && $.isFunction(userData.beforeRefresh)) {
                    userData.beforeRefresh.apply(this);
                }
            }
            // *
            this._field("allowVirtualScrolling", null);
            if(loadData === true) {
                this._dataViewWrapper.load(userData);
            } else {
                this.doRefresh(userData);
                this._loaded();
            }
        };
        wijgrid.prototype.getCellInfo = function (domCell) {
            /// <summary>
            /// Gets an instance of the $.wijmo.wijgrid.cellInfo class that represents the specified cell of the grid.
            /// Code example: var cellInfo = $("#element").wijgrid("getCellInfo", domCell);
            /// <param name="domCell" type="Object">A HTML DOM Table cell object.</param>
            /// </summary>
            /// <returns type="$.wijmo.wijgrid.cellInfo">Object that represents a cell of the grid.</returns>
            var cellInfo = null;
            if(domCell && (domCell = this._findUntilOuterDiv(domCell, {
                td: true,
                th: true
            }))) {
                // test affinity
                cellInfo = this._view().getAbsoluteCellInfo(domCell);
            }
            return cellInfo;
        };
        wijgrid.prototype.getFilterOperatorsByDataType = function (dataType) {
            /// <summary>
            /// Returns a one-dimensional array of filter operators which are applicable to the specified data type.
            /// Code example: var operators = $("#element").wijgrid("getFilterOperatorsByDataType", "string");
            /// <param name="dataType" type="String">Data type. Possible values are: "string", "number", "datetime", "currency" and "boolean".</param>
            /// </summary>
            /// <returns type="Array">A one-dimensional array of filter operators.</returns>
            return (new wijmo.grid.filterOperatorsCache(this)).getByDataType(dataType || "string");
        };
        wijgrid.prototype.pageCount = function () {
            /// <summary>
            /// Gets the number of pages.
            /// Code example:
            /// var pageCount = $("#element").wijgrid("pageCount");
            /// </summary>
            /// <returns type="Number" integer="true"></returns>
            if(this._customPagingEnabled()) {
                return Math.ceil(this.options.totalRows / this.options.pageSize) || 1;
            }
            return this.options.allowPaging ? (this._dataViewWrapper.dataView()).pageCount() : 1;
        };
        wijgrid.prototype._serverShaping = function () {
            // used to support asp.net C1GridView
            return false;
        };
        wijgrid.prototype._pageIndexForDataView = function () {
            /// <summary>
            /// Infrastructure
            /// </summary>
            return this.options.pageIndex;
        };
        wijgrid.prototype.setSize = function (width, height) {
            /// <summary>
            /// Set the size of grid.
            /// Code example: $("#element").wijgrid("setSize", 200, 200);
            /// <param name="width" type="Object" optional="true">Determines the width of the grid.</param>
            /// <param name="height" type="Object" optional="true">Determines the height of the grid.</param>
            /// </summary>
                        var view = this._view(), scrollValue = {
                type: "",
                hScrollValue: null,
                vScrollValue: null
            }, outerDiv = this.outerDiv, frozener = this._field("frozener"), visibleLeaves = this._field("visibleLeaves"), leavesWithFilter = [];
            if(view && view.getScrollValue) {
                scrollValue = view.getScrollValue();
            }
            if(width || (width === 0)) {
                this._autoWidth = false;
                outerDiv.width(width);
            }
            if(height || (height === 0)) {
                this._autoHeight = false;
                outerDiv.height(height);
            }
            $.each(visibleLeaves, function (index, leaf) {
                var th = view.getHeaderCell(index), cols = view.getJoinedCols(index);
                $(th).css("width", "");
                $.each(cols, function (index, col) {
                    $(col).css("width", "");
                });
            });
            // recalculate sizes
            this._view().updateSplits(scrollValue);
            if(frozener) {
                frozener.refresh();
            }
        };
        wijgrid.prototype.selection = function () {
            /// <summary>
            /// Gets an object that manages selection in the grid.
            /// Code example:
            ///   var selection = $("#element").wijgrid("selection");
            /// </summary>
            /// <returns type="$.wijmo.wijgrid.selection">Object that manages selection in the grid.</returns>
            var selection = this._field("selection");
            if(!selection) {
                this._field("selection", selection = new wijmo.grid.selection(this));
            }
            return selection;
        };
        wijgrid.prototype._onDataViewCurrentPositionChanged = // * public
        function (e, args) {
            var dataViewRowIndex = this._dataViewWrapper.currentPosition(), cc = new wijmo.grid.cellInfo(this.currentCell().cellIndex(), this._dataViewDataRowIndexToGrid(dataViewRowIndex), null), selection = this.selection();
            // normalize
            if(cc.rowIndex() < 0) {
                cc.cellIndex(-1);
            } else {
                if(cc.cellIndex() < 0) {
                    cc.cellIndex(0);
                }
            }
            // move currentCell to the new position
            cc = this.currentCell(cc);
            // * move selection to the current position *
            selection.beginUpdate();
            selection.clear();
            if(cc && cc._isValid()) {
                selection._selectRange(new wijmo.grid.cellInfoRange(cc, cc), false, false, 0/* none */ , null);
            }
            selection.endUpdate();
        };
        wijgrid.prototype._resetDataProperties = function () {
            this.options.pageIndex = 0;
            var bounds = this._field("viewRenderBounds");
            bounds.start = bounds.end = 0;
        };
        wijgrid.prototype._onDataViewLoading = function () {
            this._activateSpinner()// if data loading proccess was triggered outside the wijgrid.
            ;
            this._trigger("dataLoading");
        };
        wijgrid.prototype._onDataViewReset = function (userData) {
            (new wijmo.grid.settingsManager(this)).MapDVToWG();
            this._trigger("dataLoaded");
            this.doRefresh(userData);
            this._loaded();
        };
        wijgrid.prototype._onDataViewLoaded = function () {
        };
        wijgrid.prototype._loading = function () {
            this._activateSpinner();
            this._trigger("loading");
        };
        wijgrid.prototype._loaded = function () {
            this._deactivateSpinner();
            this._trigger("loaded");
        };
        wijgrid.prototype._buildSketchRow = function (wrappedDataItem, leaves) {
            var i, len, leaf, cellAttr, value, tmp, sketchRow = [], expando = wijmo.data.Expando.getFrom(wrappedDataItem.values, false), rowAttributes = expando ? expando[wijmo.grid.EXPANDO] : null;
            for(i = 0 , len = leaves.length; i < len; i++) {
                leaf = leaves[i];
                if(wijmo.grid.validDataKey(leaf.dataKey)) {
                    cellAttr = (rowAttributes && rowAttributes.cellsAttributes) ? rowAttributes.cellsAttributes[leaf.dataKey] : {
                    };
                    value = this._dataViewWrapper.getValue(wrappedDataItem.values, leaf.dataKey);
                    sketchRow.push({
                        value: this._parse(leaf, value),
                        __attr: cellAttr || {
                        },
                        __style: {
                        }
                    });
                }
            }
            (sketchRow).originalRowIndex = wrappedDataItem.originalRowIndex;
            (sketchRow).rowType = wijmo.grid.rowType.data;
            if(wrappedDataItem.originalRowIndex % 2 !== 0) {
                (sketchRow).rowType |= wijmo.grid.rowType.dataAlt;
            }
            (sketchRow).__style = {
            };
            (sketchRow).__attr = (rowAttributes && rowAttributes.rowAttributes) ? rowAttributes.rowAttributes : {
            };
            return sketchRow;
        };
        wijgrid.prototype._buildSketchRowEmptyDataItem = function (dataItem, leaves, isLastRow) {
            var i, len, sketchRow = [], leavesLen = leaves.length;
            for(i = 0 , len = dataItem.length; i < len; i++) {
                sketchRow.push({
                    html: dataItem[i],
                    __attr: {
                        colSpan: (leavesLen > 0 && isLastRow) ? leavesLen : 1
                    },
                    __style: {
                    }
                });
            }
            (sketchRow).rowType = wijmo.grid.rowType.emptyDataRow;
            (sketchRow).__style = {
            };
            (sketchRow).__attr = {
            };
            return sketchRow;
        };
        wijgrid.prototype._prepareColumnOptions = function (dataLoaded, finalStage) {
            wijmo.grid.traverse(this.options.columns, function (column) {
                column.isBand = ($.isArray(column.columns) || (column.clientType === "c1band"));
                column._originalDataKey = column.dataKey;
                column._originalHeaderText = column.headerText;
            });
            // set .isLeaf
            new wijmo.grid.bandProcessor().getVisibleHeight(this.options.columns, true);
            // prepare leaves
                        var leaves = [], headerRow = this._originalHeaderRowData(), footerRow = this._originalFooterRowData(), autogenerationMode = (this.options.columnsAutogenerationMode || "").toLowerCase();
            if(dataLoaded) {
                wijmo.grid.columnsGenerator.generate(autogenerationMode, this._dataViewWrapper.getFieldsInfo(), this.options.columns);
            }
            wijmo.grid.setTraverseIndex(this.options.columns)// build indices (linearIdx, travIdx, parentIdx)
            ;
            // * merge options with defaults and build "pure" leaves list.
            wijmo.grid.traverse(this.options.columns, function (column) {
                // merge options **
                column.isBand = ($.isArray(column.columns) || (column.clientType === "c1band"));
                wijmo.grid.shallowMerge(column, wijmo.c1basefield.prototype.options)// merge with the c1basefield default options
                ;
                if(!column.isBand) {
                    wijmo.grid.shallowMerge(column, wijmo.c1field.prototype.options)// merge with the c1field default options
                    ;
                    column.groupInfo = column.groupInfo || {
                    };
                    wijmo.grid.shallowMerge(column.groupInfo, wijmo.c1field.prototype.options.groupInfo);
                    if(!column.clientType) {
                        column.clientType = "c1field";
                    }
                } else {
                    column.clientType = "c1band";
                }
                // ** merge options
                if(column.isLeaf && !column.isBand) {
                    leaves.push(column);
                }
            });
            this._field("leaves", leaves)// contains static columns only when dataLoaded == false, used by the "dynamic data load" feature during request initialization.
            ;
            if(dataLoaded) {
                // assume headerText and footerText
                $.each(leaves, $.proxy(function (i, leaf) {
                    var thIndex = (typeof (leaf.dataKey) === "number") ? leaf.dataKey : i;
                    if(autogenerationMode === "merge" || leaf.dynamic === true) {
                        // assume headerText options of the static columns only when using "merge" mode.
                        if(leaf.headerText === undefined) {
                            if(this._dataViewWrapper.isBoundedToDOM() && headerRow && (thIndex < headerRow.length)) {
                                leaf.headerText = $.trim(headerRow[thIndex])// copy th
                                ;
                            } else {
                                if(wijmo.grid.validDataKey(leaf.dataKey)) {
                                    leaf.headerText = "" + leaf.dataKey// copy dataKey
                                    ;
                                }
                            }
                        }
                    }
                    if(this._dataViewWrapper.isBoundedToDOM() && footerRow && (thIndex < footerRow.length)) {
                        leaf._footerTextDOM = $.trim(footerRow[thIndex]);
                    }
                }, this));
            }
        };
        wijgrid.prototype._rebuildLeaves = function () {
            var tmpColumns = [], leaves = [], tmp;
            if(this.options.showRowHeader) {
                // append rowHeader
                tmp = wijmo.grid.createDynamicField({
                    clientType: "c1basefield",
                    dataIndex: -1,
                    travIdx: -1,
                    parentVis: true,
                    allowMoving: false,
                    allowSizing: false,
                    allowSort: false,
                    isRowHeader: true
                });
                tmp.owner = this;
                tmpColumns.push(tmp);
            }
            $.each(this.options.columns, function (index, item) {
                tmpColumns.push(item)// append columns
                ;
            });
            // generate span table and build leaves
            this._columnsHeadersTable(new wijmo.grid.bandProcessor().generateSpanTable(tmpColumns, leaves));
            this._field("leaves", leaves);
            this._onLeavesCreated();
        };
        wijgrid.prototype._onLeavesCreated = function () {
            var leaves = this._field("leaves"), fieldsInfo = this._dataViewWrapper.getFieldsInfo(), meta, dataIndex = 0, visLeavesIdx = 0, self = this;
            // build visible leaves list, set dataParsers, dataIndices
            this._field("visibleLeaves", $.grep(leaves, function (leaf, index) {
                leaf.leavesIdx = index;
                if(wijmo.grid.validDataKey(leaf.dataKey)) {
                    leaf.dataIndex = dataIndex++;
                } else {
                    leaf.dataIndex = -1;
                }
                if(!leaf.isBand) {
                    meta = fieldsInfo[leaf.dataKey];
                    if(meta) {
                        leaf._underlyingDataType = meta.type;
                        leaf._underlyingDataFormatString = meta.format;
                    }
                    if($.isFunction(leaf.dataParser)) {
                        leaf.dataParser = new leaf.dataParser();
                    }
                }
                if(leaf.parentVis) {
                    leaf.visLeavesIdx = visLeavesIdx++;
                    return true;
                }
                return false;
            }));
        };
        wijgrid.prototype._allowVirtualScrolling = function () {
            var val = this._field("allowVirtualScrolling");
            if(!val) {
                val = this._field("allowVirtualScrolling", !this.options.allowPaging && this.options.allowVirtualScrolling && (this.options.staticRowIndex < 0) && (this.options.scrollMode !== "none") && !this._hasMerging());
            }
            return val;
        };
        wijgrid.prototype._dragndrop = function (force) {
            if (typeof force === "undefined") { force = false; }
            var dnd = this._field("dragndrop");
            if(!dnd && force) {
                this._field("dragndrop", dnd = new wijmo.grid.uiDragndrop(this));
            }
            return dnd;
        };
        wijgrid.prototype._headerRows = function () {
            return this._view().headerRows();
        };
        wijgrid.prototype._filterRow = function () {
            return this._view().filterRow();
        };
        wijgrid.prototype._rows = function () {
            return this._view().bodyRows();
        };
        wijgrid.prototype._localizeFilterOperators = function (locArray) {
            var self = this, helper = new wijmo.grid.filterOperatorsCache(this);
            $.each(locArray, function (i, o) {
                if(o.name) {
                    var fop = helper.getByName(o.name);
                    if(fop) {
                        fop.displayName = o.displayName;
                    }
                }
            });
        };
        wijgrid.prototype._selectionui = function (force) {
            var selectionui = this._field("selectionui");
            if(!selectionui && force) {
                this._field("selectionui", selectionui = new wijmo.grid.uiSelection(this));
            }
            return selectionui;
        };
        wijgrid.prototype._postset_allowColMoving = /*_setPageCount (dataSlice) {
        this._field("pageCount", Math.ceil(dataSlice.totalRows / this.options.pageSize) || 1);
        },*/
        // * propeties (pre-\ post-)
        function (value, oldValue) {
            var self = this;
            $.each(this.columns(), function (idx, wijField) {
                if(value) {
                    self._dragndrop(true).attach(wijField);
                } else {
                    self._dragndrop(true).detach(wijField);
                }
            });
            $.each(this._field("groupedWidgets"), function (idx, wijField) {
                if(value) {
                    self._dragndrop(true).attach(wijField);
                } else {
                    self._dragndrop(true).detach(wijField);
                }
            });
        };
        wijgrid.prototype._postset_allowSorting = function (value, oldValue) {
            this.ensureControl(false);
        };
        wijgrid.prototype._postset_columns = function (value, oldValue) {
            this._initialized = false;
            this.ensureControl(true);
        };
        wijgrid.prototype._postset_allowPaging = function (value, oldValue) {
            this.ensureControl(true);
        };
        wijgrid.prototype._postset_culture = function (value, oldValue) {
            //this._field("closestCulture", Globalize.findClosestCulture(this.options.culture));
            throw "read-only";
        };
        wijgrid.prototype._postset_customFilterOperators = function (value, oldValue) {
            var dataView = this._dataViewWrapper.dataView();
        };
        wijgrid.prototype._postset_data = function (value, oldValue) {
            this._ownerise(false);
            wijmo.grid.traverse(this.options.columns, function (column, columns) {
                if(column.dynamic) {
                    // remove autogenerated columns
                    var idx = $.inArray(column, columns);
                    if(idx >= 0) {
                        columns.splice(idx, 1);
                    }
                } else {
                    // restore original values
                    column.dataKey = column._originalDataKey;
                    column.headerText = column._originalHeaderText;
                }
            });
            this._initialized = false;
            // this._resetDataProperties();
            if(this._dataViewWrapper) {
                this._dataViewWrapper.dispose();
            }
            this._dataViewWrapper = new wijmo.grid.dataViewWrapper(this);
            this.ensureControl(true);
        };
        wijgrid.prototype._postset_disabled = function (value, oldValue) {
            // update children widgets
                        var self = this, view = this._view();
            wijmo.grid.iterateChildrenWidgets(this.outerDiv, function (index, widget) {
                if(widget !== self) {
                    widget.option("disabled", value);
                }
            });
            if(view) {
                view.ensureDisabledState();
            }
        };
        wijgrid.prototype._postset_groupIndent = function (value, oldValue) {
            this.ensureControl(false);
        };
        wijgrid.prototype._postset_groupAreaCaption = function (value, oldValue) {
            var groupedColumns = this._field("groupedColumns");
            if(this.$groupArea && (!groupedColumns || !groupedColumns.length)) {
                // update html when the group area is empty only.
                this.$groupArea.html(value || "&nbsp;");
            }
        };
        wijgrid.prototype._postset_highlightCurrentCell = function (value, oldValue) {
            var currentCell = this.currentCell();
            if(currentCell && currentCell._isValid()) {
                this._highlightCellPosition(currentCell, value);
            }
        };
        wijgrid.prototype._preset_pageIndex = function (value, oldValue) {
            if(isNaN(value)) {
                throw "out of range";
            }
            var pageCount = this.pageCount(), fn = function (val) {
                if(val > pageCount - 1) {
                    val = pageCount - 1;
                }
                if(val < 0) {
                    val = 0;
                }
                return val;
            }, args;
            value = fn(value);
            if(this.options.allowPaging && value !== oldValue) {
                args = {
                    newPageIndex: value
                };
                if(!this._onPageIndexChanging(args)) {
                    value = oldValue;
                } else {
                    value = fn(args.newPageIndex);
                }
            }
            return value;
        };
        wijgrid.prototype._postset_pageIndex = function (value, oldValue) {
            if(this.options.allowPaging) {
                var args = {
                    newPageIndex: value
                };
                if(this._customPagingEnabled()) {
                    this._convertWidgetsToOptions();
                    this._onPageIndexChanged(args)// Allow user the ability to load a new data and refresh the grid.
                    ;
                } else {
                    this.ensureControl(true, {
                        afterRefresh: function () {
                            this._onPageIndexChanged(args);
                        }
                    });
                }
            }
        };
        wijgrid.prototype._preset_pageSize = function (value, oldValue) {
            if(isNaN(value)) {
                throw "out of range";
            }
            if(value <= 0) {
                value = 1;
            }
            return value;
        };
        wijgrid.prototype._postset_pageSize = function (value, oldValue) {
            this._resetDataProperties();
            if(this.options.allowPaging && !this._customPagingEnabled()) {
                this.ensureControl(true);
            }
        };
        wijgrid.prototype._postset_pagerSettings = function (value, oldValue) {
            this.ensureControl(false);
        };
        wijgrid.prototype._postset_scrollMode = function (value, oldValue) {
            this.ensureControl(false);
        };
        wijgrid.prototype._postset_selectionMode = function (value, oldValue) {
            var selection = this.selection(), currentCell = this.currentCell(), hasSelection = this.selection().selectedCells().length();
            selection.beginUpdate();
            selection.clear();
            if(currentCell && currentCell._isValid() && hasSelection) {
                selection._selectRange(new wijmo.grid.cellInfoRange(currentCell, currentCell), false, false, 0/* none */ , null);
            }
            selection.endUpdate();
            this._view().toggleDOMSelection(value === "none")// disable or enable DOM selection
            ;
        };
        wijgrid.prototype._postset_showFilter = function (value, oldValue) {
            this.ensureControl(false);
        };
        wijgrid.prototype._postset_showGroupArea = function (value, oldValue) {
            this.ensureControl(false);
        };
        wijgrid.prototype._postset_showRowHeader = function (value, oldValue) {
            this.ensureControl(false);
        };
        wijgrid.prototype._postset_staticRowIndex = function () {
            if(this.options.scrollMode !== "none") {
                // staticRowIndex is ignored when scrolling is turned off.
                this.ensureControl(false);
            }
        };
        wijgrid.prototype._postset_staticColumnIndex = function () {
            if(this.options.scrollMode !== "none") {
                this.ensureControl(false);
            }
        };
        wijgrid.prototype._postset_allowVirtualScrolling = function (value, oldValue) {
            this.ensureControl(false);
        };
        wijgrid.prototype._preset_allowVirtualScrolling = function (value, oldValue) {
            if(isNaN(value) || value < 0) {
                throw "out of range";
            }
            return value;
        };
        wijgrid.prototype._activateSpinner = // * propeties (pre-\ post-)
        // * private
        function () {
            if(!this._spinnerIsActivated) {
                var wijCSS = this.options.wijCSS, loadingText = this.outerDiv.append("<div class=\"wijmo-wijgrid-overlay " + wijCSS.overlay + "\"></div>" + "<span class=\"wijmo-wijgrid-loadingtext " + wijCSS.content + " " + wijCSS.cornerAll + "\">" + "<span class=\"" + wijCSS.icon + " ui-icon-clock\"></span>" + this.options.loadingText + "</span>").find("> .wijmo-wijgrid-loadingtext");
                loadingText.position({
                    my: "center",
                    at: "center center",
                    of: this.outerDiv,
                    collision: "none"
                });
                this._spinnerIsActivated = true;
            }
        };
        wijgrid.prototype._customPagingEnabled = function () {
            return this.options.allowPaging && this.options.totalRows >= 0;
        };
        wijgrid.prototype._deactivateSpinner = function () {
            if(this._spinnerIsActivated) {
                try  {
                    this.outerDiv.find("> .wijmo-wijgrid-overlay, > .wijmo-wijgrid-loadingtext").remove();
                }finally {
                    this._spinnerIsActivated = false;
                }
            }
        };
        wijgrid.prototype._columnWidgetsFactory = function ($node, columnOpt) {
            var columnWidget, clientType = columnOpt.clientType;
            if(!clientType && columnOpt.isBand) {
                clientType = "c1band";
            }
            columnOpt = $.extend({
            }, columnOpt, {
                disabled: this.options.disabled
            });
            try  {
                $.data($node[0], "wijgridowner", this)// pass owner to the widget constructor
                ;
                switch(clientType) {
                    case "c1basefield":
                        columnWidget = $node.c1basefield(columnOpt);
                        break;
                    case "c1band":
                        columnWidget = $node.c1band(columnOpt);
                        break;
                    default:
                        columnWidget = $node.c1field(columnOpt);
                }
            }finally {
                $.removeData($node[0], "wijgridowner");
            }
            return columnWidget;
        };
        wijgrid.prototype._convertWidgetsToOptions = function () {
            if(this._initialized && this._mergeWidgetsWithOptions) {
                this._ownerise(false);
                this._widgetsToOptions();
                this._ownerise(true);
            }
        };
        wijgrid.prototype._field = function (name, value) {
            return wijmo.grid.dataPrefix(this.element, this._data$prefix, name, value);
        };
        wijgrid.prototype._removeField = function (name) {
            var internalDataName = this._data$prefix + name;
            this.element.removeData(internalDataName);
        };
        wijgrid.prototype._prepareTotalsRequest = function (isLocal) {
            var leaves = this._field("leaves"), result, test;
            if(!leaves || !this.options.showFooter) {
                return [];
            }
            result = $.map((leaves), function (element, index) {
                if(!element.isBand && wijmo.grid.validDataKey(element.dataKey) && element.aggregate && element.aggregate !== "none") {
                    if(isLocal) {
                        return [
                            {
                                column: element,
                                aggregate: element.aggregate
                            }
                        ];
                    } else {
                        return [
                            {
                                dataKey: element.dataKey,
                                aggregate: element.aggregate
                            }
                        ];
                    }
                }
                return null;
            });
            return result;
        };
        wijgrid.prototype._widgetsToOptions = function () {
            var colOptionsList = wijmo.grid.flatten(this.options.columns);
            $.each(this.columns(), function (index, colWidget) {
                delete colWidget.options.columns// only options of the column itself will be merged at the next step.
                ;
                var congruentColOption = colOptionsList[colWidget.options.travIdx];
                $.extend(true, congruentColOption, colWidget.options);
                congruentColOption.filterValue = colWidget.options.filterValue;
                congruentColOption.filterOperator = colWidget.options.filterOperator;
            });
        };
        wijgrid.prototype._recreateColumnWidgets = function () {
            $.each(this.columns(), function (index, item) {
                item.destroy();
            });
            var columns = [], headerRows = this._headerRows(), visibleColumns, i, len, column, headerRowObj, th, columnWidget;
            if(/* tHead.length*/ headerRows && headerRows.length()) {
                visibleColumns = []// visible bands and leaves
                ;
                wijmo.grid.traverse(this.options.columns, function (column) {
                    if(column.parentVis) {
                        visibleColumns.push(column);
                    }
                });
                for(i = 0 , len = visibleColumns.length; i < len; i++) {
                    column = visibleColumns[i];
                    headerRowObj = headerRows.item(column.thY);
                    th = wijmo.grid.rowAccessor.getCell(headerRowObj, column.thX);
                    columnWidget = this._columnWidgetsFactory($(th), column);
                    columns.push(columnWidget.data(wijmo.grid.widgetName(columnWidget)))// store actual widget instance
                    ;
                }
            }
            this._field("columns", columns);
        };
        wijgrid.prototype._ownerise = function (flag) {
            if(flag) {
                var self = this;
                wijmo.grid.traverse(this.options.columns, function (column) {
                    column.owner = self;
                    var tmp, i, len;
                    if((tmp = column.groupInfo)) {
                        tmp.owner = column;
                        if(tmp.expandInfo) {
                            for(i = 0 , len = tmp.expandInfo.length; i < len; i++) {
                                tmp.expandInfo[i].owner = tmp;
                            }
                        }
                    }
                });
            } else {
                wijmo.grid.traverse(this.options.columns, function (column) {
                    delete column.owner;
                    var tmp, i, len;
                    if((tmp = column.groupInfo)) {
                        delete tmp.owner;
                        if(tmp.expandInfo) {
                            for(i = 0 , len = tmp.expandInfo.length; i < len; i++) {
                                delete tmp.expandInfo[i].owner;
                            }
                        }
                    }
                });
            }
        };
        wijgrid.prototype._ensureRenderBounds = function (bounds) {
            var total = this._totalRowsCount();// sketchTable.length or totalRows -- depends on data mode.

            if(bounds.start < 0) {
                bounds.start = 0;
            }
            bounds.start = Math.min(bounds.start, total - 1);
            if(bounds.end < 0) {
                bounds.end = 0;
            }
            bounds.end = Math.min(bounds.end, total - 1);
            return bounds;
        };
        wijgrid.prototype._refresh = function (userData) {
            // apply grouping
            new wijmo.grid.grouper().group(this, this.sketchTable, this._field("leaves"));
            // apply merging
            new wijmo.grid.merger().merge(this.sketchTable, this._field("visibleLeaves"));
            var bounds = this._field("viewRenderBounds");
            this._ensureRenderBounds(bounds);
            // view
            if(this.options.scrollMode !== "none") {
                this._field("view", new wijmo.grid.fixedView(this, this._field("viewRenderBounds")));
            } else {
                this._field("view", new wijmo.grid.flatView(this, this._field("viewRenderBounds")));
            }
            this._render();
            // (re)create iternal widgets
            this._ownerise(false);
            this._recreateColumnWidgets();
            this._ownerise(true);
            // pager
            if(this.options.allowPaging) {
                // top pager
                if(this.$topPagerDiv) {
                    this.$topPagerDiv.wijpager(this._pagerSettings2PagerWidgetSettings()).css("zIndex", 5);
                }
                // bottom pager
                if(this.$bottomPagerDiv) {
                    this.$bottomPagerDiv.wijpager(this._pagerSettings2PagerWidgetSettings()).css("zIndex", 5);
                }
            }
            // (re)create iternal widgets
                    };
        wijgrid.prototype._refreshVirtual = function (userData) {
            var scrollData = userData.virtualScrollData, diffData = {
                top: 0,
                bottom: 0
            };
            if(scrollData.data) {
                diffData = this._processVirtualData(scrollData);
            }
            this._updateRowInfos(scrollData, diffData);
            this._renderVirtualIntoView(scrollData);
            // debug
            /*var rows = this._view().bodyRows();
            for (var i = 0; i < rows.length(); i++) {
            var ri = this._view()._getRowInfo(rows.item(i));
            var innerDiv = ri.$rows.find("td:first .wijmo-wijgrid-innercell");
            var html = innerDiv.html();

            html = "d:" + ri.dataItemIndex + " s:" + ri.sectionRowIndex + "  ||" + ri.data[0];
            innerDiv.html(html);
            }*/
            // debug
            /*if (scrollData.data && scrollData.mode === "reset") {
            this._view().vsUI.scrollToRow(scrollData.newBounds.start, true); // original scrollIndex could change due pageSize alignment, so we need to re-set position of the vertical scrollbar.
            }*/
                    };
        wijgrid.prototype._updateRowInfos = function (scrollData, diffData) {
            var bounds = this._field("viewRenderBounds"), view = this._view(), newBounds = scrollData.newBounds, rows = this._view().bodyRows(), relMatch, i, diff, rowInfo;
            switch(scrollData.mode) {
                case "reset":
                    break;
                case "overlapBottom":
                    relMatch = {
                        start: // zero-based
                        newBounds.start - bounds.start,
                        end: bounds.end - bounds.start
                    };
                    diff = newBounds.start - bounds.start;
                    for(i = relMatch.start; i <= relMatch.end; i++) {
                        rowInfo = view._getRowInfo(rows.item(i));
                        rowInfo.sectionRowIndex -= diff;
                        rowInfo.dataItemIndex += diffData.top;
                        view._setRowInfo(rowInfo.$rows, rowInfo);
                    }
                    break;
                case "overlapTop":
                    relMatch = {
                        start: // zero-based
                        bounds.start - bounds.start,
                        end: newBounds.end - bounds.start
                    };
                    diff = bounds.start - newBounds.start;
                    for(i = relMatch.start; i <= relMatch.end; i++) {
                        rowInfo = view._getRowInfo(rows.item(i));
                        rowInfo.sectionRowIndex += diff;
                        rowInfo.dataItemIndex += diffData.top;
                        view._setRowInfo(rowInfo.$rows, rowInfo);
                    }
                    break;
            }
        };
        wijgrid.prototype._renderVirtualIntoView = function (scrollData) {
            var bounds = this._field("viewRenderBounds"), view = this._view(), fnDataItemIndex = function (sketchRow) {
                return (sketchRow.rowType & wijmo.grid.rowType.data) ? sketchRow.originalRowIndex : -1;
            }, match, i, sketchRow, sectionRowIndex;
            switch(scrollData.mode) {
                case "reset":
                    // remove all rows
                    view._clearBody();
                    // add new rows
                    for(i = scrollData.newBounds.start; i <= scrollData.newBounds.end; i++) {
                        sketchRow = this.sketchTable[i - this._dataOffset];
                        view._insertBodyRow(sketchRow, -1, fnDataItemIndex(sketchRow), i);
                    }
                    view._rebuildOffsets();
                    break;
                case "overlapBottom":
                    match = {
                        start: scrollData.newBounds.start,
                        end: bounds.end
                    };
                    // remove rows from the top
                    for(i = 0; i < match.start - bounds.start; i++) {
                        view._removeBodyRow(0, false);
                    }
                    // add new rows to the bottom
                    for(i = match.end + 1; i <= scrollData.newBounds.end; i++) {
                        sketchRow = this.sketchTable[i - this._dataOffset];
                        view._insertBodyRow(sketchRow, -1, fnDataItemIndex(sketchRow), i);
                    }
                    break;
                case "overlapTop":
                    match = {
                        start: bounds.start,
                        end: scrollData.newBounds.end
                    };
                    // remove rows from the bottom
                    for(i = 0; i < bounds.end - scrollData.newBounds.end; i++) {
                        view._removeBodyRow(match.end - match.start + 1, false)// relative index starting from zero.
                        ;
                    }
                    // add new tows to the top
                    sectionRowIndex = 0;
                    for(i = scrollData.newBounds.start; i < bounds.start; i++) {
                        sketchRow = this.sketchTable[i - this._dataOffset];
                        view._insertBodyRow(sketchRow, sectionRowIndex++, fnDataItemIndex(sketchRow), i);
                    }
                    break;
                default:
                    // "none", same range
                    break;
            }
        };
        wijgrid.prototype._processVirtualData = function (scrollData) {
            var dvw = this._dataViewWrapper, source = dvw.dataView().getSource(), dataItem, leaves = this._field("leaves"), i, alignedViewBounds, cachedBounds, exceeded = 0, dataDiff = {
                top: 0,
                bottom: 0
            }, rowAttributes, margin = this._serverSideVirtualScrollingMargin();
            //  * extend underlying data
            switch(scrollData.mode) {
                case "reset":
                    // clear
                    this.sketchTable.splice(0, this.sketchTable.length);
                    dvw._unsafeSplice(0, source.length);
                    //this._dataOffset = scrollData.newPageIndex * this.options.pageSize; //
                    this._dataOffset = scrollData.request.index;
                    // append
                    for(i = 0; i < scrollData.data.length; i++) {
                        dvw._unsafePush(dataItem = scrollData.data[i])// append rows to a dataStore
                        ;
                        this.sketchTable.push(this._buildSketchRow(dvw._wrapDataItem(dataItem, i), leaves));
                    }
                    break;
                case "overlapBottom":
                    // append
                    for(i = 0; i < scrollData.data.length; i++) {
                        dvw._unsafePush(dataItem = scrollData.data[i])// append rows to a dataStore
                        ;
                        this.sketchTable.push(this._buildSketchRow(dvw._wrapDataItem(dataItem, source.length - 1), leaves));
                    }
                    dataDiff.bottom = scrollData.data.length;
                    break;
                case "overlapTop":
                    // prepend
                    for(i = scrollData.data.length - 1; i >= 0; i--) {
                        dvw._unsafeSplice(0, 0, dataItem = scrollData.data[i]);
                        this.sketchTable.splice(0, 0, this._buildSketchRow(dvw._wrapDataItem(dataItem, i), leaves));
                    }
                    //this._dataOffset = scrollData.newPageIndex * this.options.pageSize;
                    this._dataOffset = scrollData.request.index;
                    dataDiff.top = scrollData.data.length;
                    break;
            }
            // extend underlying data *
            // * remove cached items exceeded cached bounds
            // [margin][pageSize = viewBounds][margin]
            alignedViewBounds = this._ensureRenderBounds({
                start: scrollData.newBounds.start,
                end: scrollData.newBounds.end
            });
            //start: Math.floor(scrollData.newBounds.start / this.options.pageSize) * this.options.pageSize,
            //end: Math.floor(scrollData.newBounds.start / this.options.pageSize) * this.options.pageSize + this.options.pageSize - 1
            cachedBounds = {
                start: this._dataOffset,
                end: this._dataOffset + source.length - 1
            };
            // remove items from the bottom
            exceeded = (cachedBounds.end - alignedViewBounds.end) - margin;
            if(exceeded > 0) {
                dataDiff.bottom -= exceeded;
                dvw._unsafeSplice(source.length - exceeded, exceeded);
                this.sketchTable.splice(this.sketchTable.length - exceeded, exceeded);
            }
            // remove items from the top
            exceeded = (alignedViewBounds.start - cachedBounds.start) - margin;
            if(exceeded > 0) {
                dataDiff.top -= exceeded;
                dvw._unsafeSplice(0, exceeded);
                this.sketchTable.splice(0, exceeded);
                this._dataOffset += exceeded;
            }
            // remove data exceeded cached bounds *
            // * update metadata
            for(i = 0; i < this.sketchTable.length; i++) {
                this.sketchTable[i].originalRowIndex = i;
            }
            // update metadata *
            dvw._refreshSilent();
            return dataDiff;
        };
        wijgrid.prototype._needToCreatePagerItem = function () {
            return this.options.allowPaging === true;
        };
        wijgrid.prototype._render = function () {
            var view = this._view(), o = this.options, wijCSS = this.options.wijCSS, content;
            view.render();
            // YK: for fixing pager is not align to top and bottom when header is fixed.
            content = this.outerDiv;
            if(o.scrollMode !== "none") {
                // fixed header content
                content = this.outerDiv.find("div.wijmo-wijgrid-scroller:first");
            }
            this.$superPanelHeader = null;
            // ** top pager (top div)
            if(this.$topPagerDiv) {
                if(this.$topPagerDiv.data("wijmo-wijpager")) {
                    this.$topPagerDiv.wijpager("destroy");
                }
                this.$topPagerDiv.remove();
            }
            this.$topPagerDiv = null;
            if(this._needToCreatePagerItem() && ((o.pagerSettings.position === "top") || (o.pagerSettings.position === "topAndBottom"))) {
                if(!this.$topPagerDiv) {
                    content.prepend(this.$superPanelHeader = $("<div class=\"wijmo-wijsuperpanel-header\"></div>"));
                    this.$superPanelHeader.prepend(this.$topPagerDiv = $("<div class=\"wijmo-wijgrid-header " + wijCSS.header + " " + wijCSS.cornerTop + "\"></div>"));
                }
            }
            // top pager **
            if(o.showGroupArea) {
                this._processGroupArea(content);
            } else {
                this.$groupArea = null;
            }
            // ** bottom pager (bottom div)
            if(this.$bottomPagerDiv) {
                if(this.$bottomPagerDiv.data("wijmo-wijpager")) {
                    this.$bottomPagerDiv.wijpager("destroy");
                }
                this.$bottomPagerDiv.remove();
            }
            this.$bottomPagerDiv = null;
            if(this._needToCreatePagerItem() && ((o.pagerSettings.position === "bottom") || (o.pagerSettings.position === "topAndBottom"))) {
                if(!this.$bottomPagerDiv) {
                    content.append(this.$bottomPagerDiv = $("<div class=\"wijmo-wijgrid-footer wijmo-wijsuperpanel-footer " + wijCSS.stateDefault + " " + wijCSS.cornerBottom + "\"></div>"));
                }
            }
            // bottom pager **
                    };
        wijgrid.prototype._processGroupArea = function (content) {
            var self = this, groupCollection = this._field("groupedColumns"), groupWidgetCollection = [];
            this.$groupArea = $("<div class=\"" + this.options.wijCSS.content + " " + this.options.wijCSS.helperClearFix + "\"></div>");
            if(groupCollection.length > 0) {
                $.each(groupCollection, function (index, item) {
                    var groupElement = $("<a href=\"#\"></a>").appendTo(self.$groupArea);
                    try  {
                        $.data(groupElement[0], "wijgridowner", self)// pass owner to the constructor
                        ;
                        groupElement.c1groupedfield($.extend({
                        }, {
                            allowMoving: item.allowMoving,
                            allowSort: item.allowSort,
                            dataIndex: item.dataIndex,
                            headerText: item.headerText,
                            isBand: item.isBand,
                            isLeaf: item.isLeaf,
                            linearIdx: item.linearIdx,
                            parentIdx: item.parentIdx,
                            sortDirection: item.sortDirection,
                            travIdx: item.travIdx,
                            groupedIndex: item.groupedIndex
                        }, {
                            disabled: self.options.disabled
                        }));
                    }finally {
                        $.removeData(groupElement[0], "wijgridowner");
                    }
                    groupWidgetCollection.push(groupElement.data("wijmo-c1groupedfield"));
                });
            } else {
                this.$groupArea.addClass("wijmo-wijgrid-group-area").css("padding", 0).html(// disable padding (inherited)
                this.options.groupAreaCaption || "&nbsp;");
            }
            this._field("groupedWidgets", groupWidgetCollection);
            if(!this.$superPanelHeader) {
                content.prepend(this.$superPanelHeader = $("<div class=\"wijmo-wijsuperpanel-header\"></div>"));
            }
            this.$superPanelHeader.prepend(this.$groupArea);
            this._dragndrop(true).attachGroupArea(this.$groupArea);
        };
        wijgrid.prototype._attachEvents = function () {
            var view = this._view(), $fe = view.focusableElement(), self = this;
            $fe.bind("keydown." + this.widgetName, $.proxy(this._onKeyDown, this));
            $fe.bind("keypress." + this.widgetName, $.proxy(this._onKeyPress, this));
            $.each(view.subTables(), function (index, element) {
                var domTable = element.element();
                if(domTable) {
                    if(domTable.tHead) {
                        $(domTable.tHead).bind("click." + self.widgetName, $.proxy(self._onClick, self));
                    }
                    if(domTable.tBodies.length) {
                        $(domTable.tBodies[0]).bind("click." + self.widgetName, $.proxy(self._onClick, self)).bind("dblclick." + self.widgetName, $.proxy(self._onDblClick, self)).bind("mousemove." + self.widgetName, $.proxy(self._onMouseMove, self)).bind("mouseout." + self.widgetName, $.proxy(self._onMouseOut, self));
                    }
                }
            });
            $(window).bind("resize." + this.widgetName + "." + this._eventUID, $.proxy(this._onWindowResize, this));
        };
        wijgrid.prototype._detachEvents = function (destroy) {
            var view = this._view(), self = this, $fe;
            this._windowResizeTimer = 0;
            $(window).unbind("resize." + this.widgetName + "." + this._eventUID);
            if(view) {
                $fe = view.focusableElement();
                $fe.unbind("keydown." + this.widgetName);
                $fe.unbind("keypress." + this.widgetName);
                $.each(view.subTables(), function () {
                    var domTable = this.element();// item (this) is a htmlTableAccessor instance

                    if(domTable) {
                        if(domTable.tHead) {
                            $(domTable.tHead).unbind("." + self.widgetName);
                        }
                        if(domTable.tBodies.length) {
                            $(domTable.tBodies[0]).unbind("." + self.widgetName);
                        }
                    }
                });
            }
        };
        wijgrid.prototype._handleSort = function (column, multiSort) {
            var columns = this.options.columns, travIdx = column.travIdx, newSortDirection, args;
            //if (this.options.allowSorting && ($.inArray(columnWidget, columns) >= 0)) {
            if(column && this.options.allowSorting) {
                newSortDirection = ((column.sortDirection === "none") ? "ascending" : ((column.sortDirection === "ascending") ? "descending" : "ascending"));
                args = {
                    column: column,
                    sortDirection: newSortDirection,
                    sortCommand: column.dataKey + " " + (newSortDirection === "ascending" ? "asc" : "desc")
                };
                if(this._onColumnSorting(args)) {
                    column.sortDirection = args.sortDirection;
                    if(multiSort) {
                        column.sortOrder = this._customSortOrder++;
                    } else {
                        this._customSortOrder = 1000// reset to default
                        ;
                        // reset sortDirection for all column widgets except sorting one and grouped columns
                        $.each(this.columns(), function (index, item) {
                            item.options.sortOrder = 0;
                            if(item.options.travIdx !== travIdx && !(item.options.groupInfo && item.options.groupInfo.position !== "none")) {
                                item.options.sortDirection = "none";
                            }
                        });
                        // ensure invisible columns.
                        wijmo.grid.traverse(columns, function (item) {
                            item.sortOrder = 0;
                            if(item.travIdx !== travIdx && !(item.groupInfo && item.groupInfo.position !== "none")) {
                                item.sortDirection = "none";
                            }
                        });
                    }
                    args = {
                        column: column,
                        sortDirection: column.sortDirection,
                        sortCommand: column.dataKey + " " + (column.sortDirection === "ascending" ? "asc" : "desc")
                    };
                    if(this._customPagingEnabled()) {
                        this._convertWidgetsToOptions();
                        this._onColumnSorted(args)// Allow user the ability to load a new data and refresh the grid.
                        ;
                    } else {
                        this.ensureControl(true, {
                            afterRefresh: function () {
                                this._onColumnSorted(args);
                            }
                        });
                    }
                }
            }
        };
        wijgrid.prototype._pagerSettings2PagerWidgetSettings = function () {
            return $.extend({
            }, this.options.pagerSettings, {
                disabled: this.options.disabled,
                pageCount: this.pageCount(),
                pageIndex: this.options.pageIndex,
                pageIndexChanging: $.proxy(this._onPagerWidgetPageIndexChanging, this),
                pageIndexChanged: $.proxy(this._onPagerWidgetPageIndexChanged, this)
            });
        };
        wijgrid.prototype._handleDragnDrop = function (dragTravIdx, dropTravIdx, at, dragInGroup, dropInGroup) {
            var drag = wijmo.grid.getColumnByTravIdx(this.options.columns, dragTravIdx), drop = wijmo.grid.getColumnByTravIdx(this.options.columns, dropTravIdx), dragSource = dragInGroup ? "groupArea" : "columns", dropSource = dropInGroup ? "groupArea" : "columns";
            if(dropInGroup) {
                // drag is dropped into the group area
                if(this._onColumnGrouping({
                    drag: drag.found,
                    drop: drop ? drop.found : null,
                    dragSource: dragSource,
                    dropSource: dropSource,
                    at: at
                })) {
                    this.ensureControl(true, {
                        beforeRefresh: function () {
                            if(!drop) {
                                // drag is dropped into the empty group area.
                                drag.found.groupedIndex = 0;
                            } else {
                                switch(at) {
                                    case "left":
                                        drag.found.groupedIndex = drop.found.groupedIndex - 0.5;
                                        break;
                                    case "right":
                                        drag.found.groupedIndex = drop.found.groupedIndex + 0.5;
                                        break;
                                }
                            }
                            if(!dragInGroup) {
                                $.extend(true, drag.found, {
                                    groupInfo: {
                                        position: "header"
                                    }
                                });
                            }
                        },
                        afterRefresh: function () {
                            this._onColumnGrouped({
                                drag: drag.found,
                                drop: drop ? drop.found : null,
                                dragSource: dragSource,
                                dropSource: dropSource,
                                at: at
                            });
                        }
                    });
                }
            } else {
                if(this._onColumnDropping({
                    drag: drag.found,
                    drop: drop.found,
                    at: at
                })) {
                    this.ensureControl(false, {
                        beforeRefresh: function () {
                            /* modifying the wijgrid.options.columns option */
                            drag.at.splice(drag.found.linearIdx, 1);
                            //because when drag is before drop, the index of drop is affected.
                            switch(at) {
                                case "left":
                                    if(drag.at === drop.at && drag.found.linearIdx < drop.found.linearIdx) {
                                        drop.at.splice(drop.found.linearIdx - 1, 0, drag.found);
                                    } else {
                                        drop.at.splice(drop.found.linearIdx, 0, drag.found);
                                    }
                                    break;
                                case "right":
                                    if(drag.at === drop.at && drag.found.linearIdx < drop.found.linearIdx) {
                                        drop.at.splice(drop.found.linearIdx, 0, drag.found);
                                    } else {
                                        drop.at.splice(drop.found.linearIdx + 1, 0, drag.found);
                                    }
                                    break;
                                case "center":
                                    // drop is a band
                                    drop.found.columns.push(drag.found);
                                    break;
                            }
                            // rebuild indices (linearIdx, travIdx, parentIdx)
                            wijmo.grid.setTraverseIndex(this.options.columns);
                        },
                        afterRefresh: function () {
                            this._onColumnDropped({
                                drag: drag.found,
                                drop: drop.found,
                                at: at
                            });
                        }
                    });
                }
            }
        };
        wijgrid.prototype._handleFilter = function (column, rawOperator, rawValue) {
            var operator = (new wijmo.grid.filterOperatorsCache(this)).getByName(rawOperator), value, ok, args;
            if(operator) {
                if(operator.arity > 1) {
                    // check value
                    value = this._parse(column.options, rawValue);
                    ok = (value !== null && (wijmo.grid.getDataType(column.options) === "string" || !isNaN(value)));
                } else {
                    ok = true;
                }
                if(ok) {
                    args = {
                        column: column.options,
                        operator: operator.name,
                        value: value
                    };
                    if(this._onColumnFiltering(args)) {
                        column.options.filterValue = args.value;
                        column.options.filterOperator = args.operator;
                        this._resetDataProperties();
                        if(this._customPagingEnabled()) {
                            this._convertWidgetsToOptions();
                            this._onColumnFiltered({
                                column: column.options
                            })// Allow user the ability to load a new data and refresh the grid.
                            ;
                        } else {
                            this.ensureControl(true, {
                                afterRefresh: function () {
                                    this._onColumnFiltered({
                                        column: column.options
                                    });
                                }
                            });
                        }
                    }
                }
            }
        };
        wijgrid.prototype._handleUngroup = function (columnTravIdx) {
            var column = wijmo.grid.getColumnByTravIdx(this.options.columns, columnTravIdx), result;
            if(column && column.found) {
                result = column.found;
                if(this._onColumnUngrouping({
                    column: result
                })) {
                    this.ensureControl(false, {
                        beforeRefresh: function () {
                            delete result.groupedIndex;
                            $.extend(true, result, {
                                groupInfo: {
                                    position: "none"
                                }
                            });
                        },
                        afterRefresh: function () {
                            this._onColumnUngrouped({
                                column: result
                            });
                        }
                    });
                }
            }
        };
        wijgrid.prototype._onVirtualScrolling = function (newBounds, request, mode, scrollIndex, completeCallback, data/* opt*/ ) {
            this.ensureControl(true, {
                virtualScrollData: {
                    newBounds: newBounds,
                    request: request,
                    mode: mode,
                    data: data
                },
                afterRefresh: function (userData) {
                    var bounds = this._field("viewRenderBounds");
                    // set new bounds
                    $.extend(bounds, userData.virtualScrollData.newBounds);
                    this._view()._adjustRowsHeights();
                    completeCallback(scrollIndex);
                }
            });
        };
        wijgrid.prototype._handleVirtualScrolling = function (scrollIndex, completeCallback) {
            var bounds = this._field("viewRenderBounds"), newBounds = this._ensureRenderBounds({
                start: scrollIndex,
                end: scrollIndex + this.options.pageSize - 1
            }), cachedDataBounds = this._ensureRenderBounds({
                start: this._dataOffset,
                end: this._dataOffset + this._dataViewWrapper.dataView().count() - 1
            }), request = null, mode;
            // check viewBounds
            if(newBounds.start > bounds.end || newBounds.end < bounds.start) {
                // mode = "reset"
                mode = "reset";
            } else {
                if(newBounds.start > bounds.start) {
                    mode = "overlapBottom";
                } else {
                    if(newBounds.start < bounds.start) {
                        mode = "overlapTop";
                    } else {
                        // same range, "none"
                                            }
                }
            }
            // check dataBounds
            if(this._serverSideVirtualScrolling()) {
                switch(mode) {
                    case "reset":
                        // align view bounds by pageSize
                        request = {
                            index: scrollIndex,
                            maxCount: // (scrollIndex == newBounds.start)
                            this.options.pageSize
                        };
                        /*newPageIndex = Math.floor(scrollIndex / this.options.pageSize);

                        scrollIndex = newPageIndex * this.options.pageSize; // note: scrollIndex can change

                        newBounds = this._ensureRenderBounds({
                        start: scrollIndex,
                        end: scrollIndex + this.options.pageSize - 1
                        });*/
                        break;
                    case "overlapBottom":
                        if(newBounds.end > cachedDataBounds.end) {
                            request = {
                                index: cachedDataBounds.end + 1,
                                maxCount: this.options.pageSize
                            };
                        }
                        /*newPageIndex = Math.floor(newBounds.end / this.options.pageSize);
                        alignIndex = newPageIndex * this.options.pageSize;

                        if (alignIndex <= cachedDataBounds.end) {
                        newPageIndex = null;
                        }*/
                        break;
                    case "overlapTop":
                        if(newBounds.start < cachedDataBounds.start) {
                            request = {
                                index: Math.max(0, cachedDataBounds.start - this.options.pageSize),
                                maxCount: 0
                            };
                            request.maxCount = cachedDataBounds.start - request.index;
                        }
                        /*newPageIndex = Math.floor(newBounds.start / this.options.pageSize);
                        alignIndex = newPageIndex * this.options.pageSize;

                        if (alignIndex >= cachedDataBounds.start) {
                        newPageIndex = null;
                        }*/
                        break;
                }
            }
            if(mode !== "none") {
                //this._onVirtualScrolling(newBounds, newPageIndex, mode, scrollIndex, completeCallback); // note: scrollIndex could be changed
                this._onVirtualScrolling(newBounds, request, mode, scrollIndex, completeCallback)// note: scrollIndex could be changed
                ;
            }
        };
        wijgrid.prototype._serverSideVirtualScrolling = function () {
            return false;
        };
        wijgrid.prototype._serverSideVirtualScrollingMargin = function () {
            return this.options.pageSize * 2;
        };
        wijgrid.prototype._onColumnDropping = // * event handlers
        function (args) {
            return this._trigger("columnDropping", null, args);
        };
        wijgrid.prototype._onColumnDropped = function (args) {
            this._trigger("columnDropped", null, args);
        };
        wijgrid.prototype._onColumnGrouping = function (args) {
            return this._trigger("columnGrouping", null, args);
        };
        wijgrid.prototype._onColumnGrouped = function (args) {
            this._trigger("columnGrouped", null, args);
        };
        wijgrid.prototype._onColumnUngrouping = function (args) {
            return this._trigger("columnUngrouping", null, args);
        };
        wijgrid.prototype._onColumnUngrouped = function (args) {
            this._trigger("columnUngrouped", null, args);
        };
        wijgrid.prototype._onColumnFiltering = function (args) {
            return this._trigger("filtering", null, args);
        };
        wijgrid.prototype._onColumnFiltered = function (args) {
            this._trigger("filtered", null, args);
        };
        wijgrid.prototype._onFilterOperatorsListShowing = function (args) {
            this._trigger("filterOperatorsListShowing", null, args);
        };
        wijgrid.prototype._onColumnSorting = function (args) {
            return this._trigger("sorting", null, args);
        };
        wijgrid.prototype._onColumnSorted = function (args) {
            this._trigger("sorted", null, args);
        };
        wijgrid.prototype._onCurrentCellChanged = function (e) {
            var o = this.options, currentCell = this._field("currentCell");
            // notify dataView
            this._dataViewWrapper.currentPosition(this._gridDataRowIndexToDataView(currentCell.rowIndex()));
            //if (o.allowKeyboardNavigation) {
            if(o.scrollMode !== "none" && currentCell && !currentCell.isEqual(wijmo.grid.cellInfo.outsideValue)) {
                (this._view()).scrollTo(currentCell);
            }
            //}
            this._trigger("currentCellChanged");
            if(e && ((e.type || "").toLowerCase() === "click") && this._editBySingleClick()) {
                this._beginEditInternal(e);
            }
        };
        wijgrid.prototype._onPageIndexChanging = function (args) {
            return this._trigger("pageIndexChanging", null, args);
        };
        wijgrid.prototype._onPageIndexChanged = function (args) {
            this._trigger("pageIndexChanged", null, args);
        };
        wijgrid.prototype._onPagerWidgetPageIndexChanging = function (sender, args) {
            args.handled = true;
        };
        wijgrid.prototype._onPagerWidgetPageIndexChanged = function (sender, args) {
            this._setOption("pageIndex", args.newPageIndex);
        };
        wijgrid.prototype._onRendering = function (userData) {
            var view = this._view();
            this._rendered = false;
            if(userData.virtualScrollData) {
                this.selection().clear()// clear selection
                ;
                if(this.options.highlightCurrentCell) {
                    this._highlightCellPosition(this.currentCell(), false)// remove highlighning
                    ;
                }
            } else {
                if(view) {
                    view.dispose();
                }
                this._detachEvents(false);
                this.element.detach();
                this.element.empty();
                this.outerDiv.empty();
                this.outerDiv.append(this.element);
                if(this._field("selectionui")) {
                    this._field("selectionui").dispose();
                    this._field("selectionui", null);
                }
                if(this._field("resizer")) {
                    this._field("resizer").dispose();
                    this._field("resizer", null);
                }
                if(this._field("frozener")) {
                    this._field("frozener").dispose();
                    this._field("frozener", null);
                }
            }
            this._trigger("rendering");
        };
        wijgrid.prototype._onRendered = function (userData) {
            var view = this._view(), currentCell, resizer, hasSelection = this.selection().selectedCells().length() > 0;
            this._rendered = true;
            // ** current cell
            this._setAttr(view.focusableElement(), "tabIndex", 0)// to handle keyboard\ focus events
            ;
            currentCell = this.currentCell();
            if(currentCell._isValid() && (currentCell = this.currentCell(currentCell))) {
                currentCell._isEdit(false);
            } else {
                currentCell = this.currentCell(this._getFirstDataRowCell(0));
            }
            // current cell **
            // ** selection
            this._field("selection", null)// always recreate selection object
            ;
            currentCell = this.currentCell();
            if(currentCell._isValid() && (hasSelection || this.options.showSelectionOnRender)) {
                // attach selection to the current cell
                this.selection()._startNewTransaction(currentCell);
                this.selection()._selectRange(new wijmo.grid.cellInfoRange(currentCell, currentCell), false, false, 0/* none */ , null);
            }
            // selection **
            if(!userData.virtualScrollData) {
                // attach events
                this._attachEvents();
                // selection ui
                this._selectionui(true);
                // initialize resizer
                resizer = new wijmo.grid.uiResizer(this);
                $.each(this.columns(), function (index, colWidget) {
                    var o = colWidget.options;
                    if(o.visible && o.parentVis && o.isLeaf) {
                        resizer.addElement(colWidget);
                    }
                });
                this._field("resizer", resizer);
                view.updateSplits(this._scrollingState)// restore value
                ;
                //frozener
                if(this.options.scrollMode !== "none") {
                    this._field("frozener", new wijmo.grid.uiFrozener(this));
                }
            }
            this._renderCounter++;
            this._trigger("rendered");
        };
        wijgrid.prototype._onClick = function (e) {
            if(!this._canInteract() || !e.target) {
                return;
            }
            var view = this._view(), clickedCell = this._findUntilOuterDiv(e.target, {
                td: true,
                th: true
            }), $row, clickedCellInfo, extendMode = 0, currentCell, selection;
            // none
            if(clickedCell) {
                if($(e.target).hasClass("wijmo-wijgrid-grouptogglebtn")) {
                    this._onGroupBtnClick(e);
                    // #29676: stop event from bubbling up to the parent grid (if available)
                    e.stopPropagation();
                    return false;
                }
                $row = $(clickedCell).closest("tr");
                if(!$row.length) {
                    return;
                }
                clickedCellInfo = view.getAbsoluteCellInfo(clickedCell);
                if($row.hasClass("wijmo-wijgrid-datarow") || $row.hasClass("wijmo-wijgrid-headerrow")) {
                    if(clickedCellInfo.cellIndex() < 0 || clickedCellInfo.rowIndex() < 0) {
                        // header cell, rowheader cell or filter cell
                        if(clickedCellInfo.rowIndex() >= 0) {
                            // rowheader cell
                            // move current cell to the first cell of the clicked row
                            clickedCellInfo = new wijmo.grid.cellInfo(0, clickedCellInfo.rowIndex());
                            extendMode = 2// extend to row
                            ;
                        } else {
                            // header cell
                            // move current cell to the first data cell of the clicked column
                            clickedCellInfo = this._getFirstDataRowCell(clickedCellInfo.cellIndex());
                            extendMode = 1// extend to column
                            ;
                        }
                    }
                    this._changeCurrentCell(e, clickedCellInfo, !$(e.target).is(":focus"))// change current cell and set focus to it (if the target element is not already focused)
                    ;
                    currentCell = this.currentCell();
                    selection = this.selection();
                    if(!e.shiftKey || (!selection._multipleRangesAllowed() && this.options.selectionMode.toLowerCase() !== "singlerange")) {
                        selection._startNewTransaction(currentCell);
                    }
                    selection.beginUpdate();
                    if(e.shiftKey && e.ctrlKey) {
                        selection._clearRange(new wijmo.grid.cellInfoRange(currentCell, currentCell), extendMode);
                    } else {
                        selection._selectRange(new wijmo.grid.cellInfoRange(selection._anchorCell(), currentCell), e.ctrlKey, e.shiftKey, extendMode, null);
                    }
                    selection.endUpdate();
                }
                var cellClickedArgs = {
                    cell: clickedCellInfo
                };
                this._trigger("cellClicked", null, cellClickedArgs);
            }
        };
        wijgrid.prototype._onDblClick = function (e) {
            if(!this._editBySingleClick()) {
                this._beginEditInternal(e);
            }
        };
        wijgrid.prototype._onGroupBtnClick = function (e) {
            if(!this._canInteract()) {
                return;
            }
            var $row = $(e.target).closest("tr"), gh = wijmo.grid.groupHelper, groupInfo = gh.getGroupInfo($row[0]), column, group;
            if(groupInfo) {
                column = gh.getColumnByGroupLevel(this._field("leaves"), groupInfo.level);
                if(column) {
                    group = column.groupInfo.expandInfo[groupInfo.index];
                    if(group.isExpanded) {
                        group.collapse();
                    } else {
                        group.expand(e.shiftKey);
                    }
                    this._view().ensureHeight()/*dma*/
                    ;
                    // this.setSize(); // recalculate sizes
                                    }
            }
        };
        wijgrid.prototype._onKeyDown = function (e) {
            if(!this._canInteract()) {
                return true;
            }
            var tag = (e.target).tagName.toLowerCase(), canChangePos = false, curPos, currentCell, selection, keyCodeEnum = wijmo.grid.getKeyCodeEnum();
            if((tag === "input" || tag === "option" || tag === "select" || tag === "textarea") && ($(e.target).closest("tr.wijmo-wijgrid-datarow").length === 0)) {
                // not a datarow ?
                return true;
            }
            if(this.options.allowEditing) {
                // ESC: cancel editing, F2: finish editing
                if((e.which === keyCodeEnum.ESCAPE || e.which === 113) && (this.currentCell()._isValid() && this.currentCell()._isEdit())) {
                    this._endEditInternal(e);
                    return false;
                } else {
                    if(e.which === 113) {
                        // F2: start editing
                        this._beginEditInternal(e);
                        return false;
                    }
                }
            }
            if(!this.options.allowKeyboardNavigation || (e.which === keyCodeEnum.TAB)) {
                return true;
            }
            //switch (args.keyCode) {
            switch(e.which) {
                case keyCodeEnum.LEFT:
                case keyCodeEnum.RIGHT:
                case keyCodeEnum.DOWN:
                case keyCodeEnum.UP:
                case keyCodeEnum.PAGE_DOWN:
                case keyCodeEnum.PAGE_UP:
                case keyCodeEnum.HOME:
                case keyCodeEnum.END:
                case keyCodeEnum.TAB:
                    curPos = this._getNextCurrencyPos(this._getDataCellsRange(), this.currentCell(), e.keyCode, e.shiftKey);
                    canChangePos = this._canMoveToAnotherCell(e.target, e.which)// TODO: add tab navigation
                    ;
                    break;
            }
            if(canChangePos) {
                this._changeCurrentCell(e, new wijmo.grid.cellInfo(curPos.cellIndex, curPos.rowIndex), true)// change current cell and set focus to it
                ;
                currentCell = this.currentCell();
                // cell = currentCell.tableCell();
                selection = this.selection();
                if(!e.shiftKey || (!selection._multipleRangesAllowed() && this.options.selectionMode.toLowerCase() !== "singlerange")) {
                    selection._startNewTransaction(currentCell);
                }
                selection.beginUpdate();
                selection._selectRange(new wijmo.grid.cellInfoRange(selection._anchorCell(), currentCell), false, e.shiftKey, 0/* none */ , null);
                selection.endUpdate();
                // TODO: tab navigation
                return false;// stop bubbling

            }
            return true;
        };
        wijgrid.prototype._onKeyPress = function (e) {
            if(this._canInteract() && this.options.allowEditing) {
                var charCode = e.which, currentCell = this.currentCell(), tag, table, domSubTables;
                if(charCode && currentCell._isValid() && !currentCell._isEdit()) {
                    tag = (e.target).tagName.toLowerCase();
                    if(tag !== "input" && tag !== "option" && tag !== "select" && tag !== "textarea") {
                        table = $(e.target).closest(".wijmo-wijgrid-table");
                        // if (table.length && (table[0] === this.$table[0])) {
                        if(table.length) {
                            domSubTables = $.map(this._view().subTables(), function (item, index) {
                                return item.element();
                            });
                            if($.inArray(table[0], domSubTables) >= 0) {
                                if($.wij.charValidator.isPrintableChar(String.fromCharCode(charCode))) {
                                    //new wijmo.grid.cellEditorHelper().currentCellEditStart(this, args);
                                    this._beginEditInternal(e);
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        };
        wijgrid.prototype._onMouseMove = function (e) {
            var view = this._view(), frozener = this._field("frozener"), hoveredCell, $hoveredRow, hoveredCellInfo, rowIndex, rowObj, rowInfo, $rs = wijmo.grid.renderState;
            if(!this.options.highlightOnHover || !this._canInteract() || (frozener && frozener.inProgress())) {
                return;
            }
            hoveredCell = this._findUntilOuterDiv(e.target, {
                td: true,
                th: true
            });
            if(hoveredCell) {
                $hoveredRow = $(hoveredCell).closest("tr");
                if(!$hoveredRow.length || !($hoveredRow.hasClass("wijmo-wijgrid-datarow") || $hoveredRow.hasClass("wijmo-wijgrid-headerrow"))) {
                    return;
                }
                hoveredCellInfo = view.getAbsoluteCellInfo(hoveredCell);
                rowIndex = this._field("hoveredRow")// previous row index
                ;
                if(hoveredCellInfo.rowIndex() !== rowIndex) {
                    // clear previous row
                    if(rowIndex !== undefined) {
                        rowObj = this._rows().item(rowIndex);
                        if(rowObj) {
                            rowInfo = view._getRowInfo(rowObj);
                            view._changeRowRenderState(rowInfo, $rs.hovered, false);
                            this.rowStyleFormatter.format(rowInfo);
                        }
                    }
                    // highlight current row
                    rowIndex = hoveredCellInfo.rowIndex();
                    this._field("hoveredRow", rowIndex);
                    if(rowIndex >= 0) {
                        rowObj = this._rows().item(rowIndex);
                        if(rowObj) {
                            rowInfo = view._getRowInfo(rowObj);
                            view._changeRowRenderState(rowInfo, $rs.hovered, true);
                            this.rowStyleFormatter.format(rowInfo);
                        }
                    }
                }
            }
        };
        wijgrid.prototype._onMouseOut = function (e) {
            if(!this._canInteract()) {
                return;
            }
            if($(e.relatedTarget).closest(".wijmo-wijgrid-data").length === 0) {
                // remove hovering
                                var hovRowIndex = this._field("hoveredRow"), rowObj, rowInfo, view = this._view();
                if(hovRowIndex >= 0) {
                    rowObj = this._rows().item(hovRowIndex);
                    if(rowObj) {
                        rowInfo = view._getRowInfo(rowObj);
                        view._changeRowRenderState(rowInfo, wijmo.grid.renderState.hovered, false);
                        this.rowStyleFormatter.format(rowInfo);
                    }
                }
            }
        };
        wijgrid.prototype._onWindowResize = function (e) {
            var self = this;
            // reset timer
            if(this._windowResizeTimer > 0) {
                window.clearTimeout(this._windowResizeTimer);
                this._windowResizeTimer = 0;
            }
            if(this._windowResizeTimer !== -1) {
                this._windowResizeTimer = window.setTimeout(function () {
                    self._windowResizeTimer = -1// lock
                    ;
                    try  {
                        if(!self._destroyed && self._initialized && self.element.parent().length) {
                            self.setSize();
                        }
                    }finally {
                        self._windowResizeTimer = 0// unlock
                        ;
                    }
                }, 50);
            }
        };
        wijgrid.prototype._fieldResized = // * event handlers
        // * resizing
        function (fieldWidget, oldWidth, newWidth) {
            if(oldWidth < 0) {
                oldWidth = 0;
            }
            if(newWidth <= 0) {
                newWidth = 1;
            }
            var resizingArgs = {
                column: fieldWidget.options,
                oldWidth: oldWidth,
                newWidth: newWidth
            };
            if(this._trigger("columnResizing", null, resizingArgs) !== false) {
                if(isNaN(resizingArgs.newWidth) || resizingArgs.newWidth < 0) {
                    resizingArgs.newWidth = 1;
                }
                fieldWidget.option("width", resizingArgs.newWidth)// update widget option first (tfs issue 32108)
                ;
                var resizedArgs = {
                    column: fieldWidget.options
                };
                this._trigger("columnResized", null, resizedArgs);
            }
        };
        wijgrid.prototype._changeCurrentCell = // * resizing
        // * currentCell
        function (eventArgs, cellInfo, setFocus) {
            var currentCell = this.currentCell(), dataRange = this._getDataCellsRange(), currentCellChangingArgs, cellEditCompleted, highlight = this.options.highlightCurrentCell, domCell;
            // if cellInfo has a valid value
            if((dataRange._isValid() && dataRange._containsCellInfo(cellInfo)) || (cellInfo.isEqual(wijmo.grid.cellInfo.outsideValue))) {
                // other cell than current cell
                if(currentCell.cellIndex() !== cellInfo.cellIndex() || currentCell.rowIndex() !== cellInfo.rowIndex()) {
                    currentCellChangingArgs = {
                        cellIndex: cellInfo.cellIndex(),
                        rowIndex: cellInfo.rowIndex(),
                        oldCellIndex: currentCell.cellIndex(),
                        oldRowIndex: currentCell.rowIndex()
                    };
                    if(this._trigger("currentCellChanging", null, currentCellChangingArgs)) {
                        cellEditCompleted = false;
                        if(!this.options.allowEditing || !currentCell._isEdit() || (cellEditCompleted = this._endEditInternal(null))) {
                            if(dataRange._containsCellInfo(currentCell)) {
                                if(highlight) {
                                    this._highlightCellPosition(currentCell, false)// remove the current one
                                    ;
                                }
                                if(domCell = currentCell.tableCell()) {
                                    $(domCell).removeAttr("tabIndex");
                                }
                            }
                            currentCell = cellInfo._clone();
                            currentCell._setGridView(this);
                            if(highlight) {
                                this._highlightCellPosition(currentCell, true);
                            }
                            if(domCell = currentCell.tableCell()) {
                                $(domCell).attr("tabIndex", 0)// make cell focusable to pass correct target (table cell) into the keyPress event handler.
                                ;
                                if(setFocus && !currentCell._isEdit()) {
                                    // prevent moving focus from child editor
                                    $(domCell).focus();
                                }
                            }
                            this._field("currentCell", currentCell)// set currentCell
                            ;
                            this._onCurrentCellChanged(eventArgs);
                        }
                    }
                } else {
                    // the same cell
                    if(highlight) {
                        this._highlightCellPosition(currentCell, true)// ensure
                        ;
                    }
                    if(domCell = currentCell.tableCell()) {
                        $(domCell).attr("tabIndex", 0);
                    }
                }
            } else {
                // cellInfo is invalid
                // do nothing
                // this._highlightCellPosition(currentCell, false);
                // this._field("currentCell", currentCell.outsideValue); // set currentCell
                            }
        };
        wijgrid.prototype._highlightCellPosition = function (cellInfo, add) {
            if(cellInfo && cellInfo._isValid()) {
                var x = cellInfo.cellIndexAbs(), y = cellInfo.rowIndexAbs(), $rs = wijmo.grid.renderState, view = this._view(), rowInfo, obj, state;
                // * column header cell *
                obj = view.getHeaderCell(x);
                if(obj) {
                    rowInfo = view._getRowInfo(this._headerRows().item(cellInfo.column().thY));
                    obj = $(obj);
                    state = view._changeCellRenderState(obj, $rs.current, add);
                    // highlight column header cell
                    this.cellStyleFormatter.format(obj, x, cellInfo.column(), rowInfo, state);
                }
                // * row header cell *
                obj = view.getJoinedRows(y, 0);
                if(obj) {
                    // change row state
                    rowInfo = view._getRowInfo(obj);
                    view._changeRowRenderState(rowInfo, $rs.current, add);
                    // highlight row header cell
                    this.rowStyleFormatter.format(rowInfo);
                }
                // * data cell *
                obj = view.getCell(x, y);
                if(obj) {
                    obj = $(obj);
                    state = view._changeCellRenderState(obj, $rs.current, add);
                    // highlight data cell
                    this.cellStyleFormatter.format(obj, x, cellInfo.column(), rowInfo, state)// rowInfo is taken from the previous step
                    ;
                }
            }
        };
        wijgrid.prototype._beginEditInternal = // * currentCell
        // * editing
        function (e) {
            if(this._canInteract() && this.options.allowEditing) {
                var column = this.currentCell().column(), res;
                if(column && !column.readOnly) {
                    res = new wijmo.grid.cellEditorHelper().currentCellEditStart(this, e);
                    if(res) {
                        // this._view().ensureWidth(undefined, column.visLeavesIdx);
                                            }
                    return res;
                }
            }
            return false;
        };
        wijgrid.prototype._endEditInternal = function (e) {
            if(this._canInteract() && this.options.allowEditing) {
                //var column = this.currentCell().column(),
                var res = new wijmo.grid.cellEditorHelper().currentCellEditEnd(this, e);
                if(res && !this._allowVirtualScrolling()) {
                    // avoid horizontal scrollbar movement.
                    this._view().ensureHeight(this.currentCell().rowIndex());
                }
                return res;
            }
            return false;
        };
        wijgrid.prototype._onViewInsertEmptyRow = // * editing
        // * view handlers
        function (rowType, sectionRowIndex, dataRowIndex, dataItemIndex, virtualDataItemIndex) {
            return null;// default action

        };
        wijgrid.prototype._onViewCreateEmptyCell = function (rowInfo, dataCellIndex, column) {
            return null;// default action

        };
        wijgrid.prototype._onViewCellRendered = function (rowInfo, $cell, cellIndex, column) {
        };
        wijgrid.prototype._onViewRowRendered = function (rowInfo) {
        };
        wijgrid.prototype._getDataParser = // view handlers *
        // misc
        function (column) {
            return column.dataParser || wijmo.data.defaultParsers[column.dataType] || wijmo.data.defaultParsers.string;
        };
        wijgrid.prototype._parse = function (column, value) {
            //// old behaviour
            //var parser = this._getDataParser(column);
            //return parser.parse(value, this._field("closestCulture"), column.dataFormatString, this.options.nullString, true);
                        var dataView = this._dataViewWrapper.dataView(), fromType = wijmo.grid.getDataType(column), toType = wijmo.grid.getDataType(column);
            if($.isFunction(value)) {
                value = value()// observable
                ;
            }
            value = wijmo.data.convert(value, fromType, toType, {
                culture: this._field("closestCulture"),
                format: column.dataFormatString || column._underlyingDataFormatString,
                nullString: this.options.nullString,
                parser: column.dataParser
            });
            // custom parser
            return value;
        };
        wijgrid.prototype._toStr = function (column, value) {
            //// old behaviour
            //var parser = this._getDataParser(column);
            //return parser.toStr(value, this._field("closestCulture"), column.dataFormatString, this.options.nullString, true);
                        var dataView = this._dataViewWrapper.dataView(), fromType = wijmo.grid.getDataType(column), toType = // column._underlyingDataType || "string",
            "string";
            value = wijmo.data.convert(value, fromType, toType, {
                culture: this._field("closestCulture"),
                format: column.dataFormatString || column._underlyingDataFormatString,
                nullString: this.options.nullString,
                parser: column.dataParser
            });
            // custom parser
            return value;
        };
        wijgrid.prototype._funcOptions = function () {
            return [
                "cellStyleFormatter",
                "rowStyleFormatter",
                "afterCellEdit",
                "afterCellUpdate",
                "beforeCellEdit",
                "beforeCellUpdate",
                "cellClicked",
                "columnDragging",
                "columnDragged",
                "columnDropping",
                "columnDropped",
                "columnResizing",
                "columnResized",
                "columnGrouping",
                "columnGrouped",
                "columnUngrouping",
                "columnUngrouped",
                "currentCellChanging",
                "currentCellChanged",
                "filtering",
                "filtered",
                "filterOperatorsListShowing",
                "groupAggregate",
                "groupText",
                "invalidCellValue",
                "pageIndexChanging",
                "pageIndexChanged",
                "selectionChanged",
                "sorting",
                "sorted",
                /*"ajaxError",*/ "dataLoading",
                "dataLoaded",
                "loading",
                "loaded",
                "rendering",
                "rendered"
            ];
        };
        wijgrid.prototype._canInteract = function () {
            return !this.options.disabled;/* && this._dataViewWrapper.isLoaded();*/

        };
        wijgrid.prototype._canMoveToAnotherCell = function (domElement, keyCode) {
            var tag = domElement.tagName.toLowerCase(), len, selectionRange, kc, res;
            switch(tag) {
                case "input":
                    if($(domElement).hasClass("wijgridinput")) {
                        var input = domElement;
                        if(input.type === "text") {
                            len = input.value.length;
                            selectionRange = new wijmo.grid.domSelection(input).getSelection();
                            kc = wijmo.grid.getKeyCodeEnum();
                            res = ((keyCode === kc.UP || keyCode === kc.DOWN || keyCode === kc.PAGE_DOWN || keyCode === kc.PAGE_UP) || (selectionRange.length === 0 && ((selectionRange.start === 0 && (keyCode === kc.LEFT || keyCode === kc.HOME)) || (selectionRange.end >= len && (keyCode === kc.RIGHT || keyCode === kc.END)))));
                            return res;
                        }
                        return true;
                    }
                    return false;
                case "textarea":
                case "select":
                    return false;
            }
            return true;
        };
        wijgrid.prototype._editBySingleClick = function () {
            var value = (this.options.editingInitOption || "").toLowerCase();
            switch(value) {
                case "click":
                case "doubleclick":
                    break;
                case "auto":
                default:
                    value = this._isMobile ? "click" : "doubleclick";
                    break;
            }
            return value === "click";
        };
        wijgrid.prototype._getDataToAbsOffset = function () {
            var x = 0, y = 0, headerRows = this._headerRows();
            if(this.options.showRowHeader) {
                x++;
            }
            if(headerRows) {
                y += headerRows.length();
            }
            if(this._filterRow()) {
                y++;
            }
            return {
                x: x,
                y: y
            };
        };
        wijgrid.prototype._gridDataRowIndexToDataView = function (value) {
            var res = -1, $rt = wijmo.grid.rowType, rowInfo;
            if(value < 0) {
                return res;
            }
            rowInfo = this._view()._getRowInfo(this._rows().item(value));
            return (rowInfo.type & wijmo.grid.rowType.data) ? rowInfo.dataItemIndex : -1;
        };
        wijgrid.prototype._dataViewDataRowIndexToGrid = function (value) {
            var $rt = wijmo.grid.rowType, view = this._view(), rows = this._rows(), i, len, rowInfo;
            if(value < 0) {
                return -1;
            }
            for(i = 0 , len = rows.length(); i < len; i++) {
                rowInfo = view._getRowInfo(rows.item(i));
                if((rowInfo.type & $rt.data) && (rowInfo.dataItemIndex === value)) {
                    return rowInfo.sectionRowIndex;
                }
            }
            return -1;
        };
        wijgrid.prototype._getDataCellsRange = function () {
            var minCol = 0, minRow = 0, maxCol = this._field("visibleLeaves").length - 1, maxRow = // = this._field("dataCache").<maxWidth>
            (this._rendered) ? this._rows().length() - 1 : this.sketchTable.length - 1;
            if(this.options.showRowHeader) {
                maxCol--;
            }
            if(maxCol < 0 || maxRow < 0) {
                minCol = minRow = maxCol = maxRow = -1;
            }
            return new wijmo.grid.cellInfoRange(new wijmo.grid.cellInfo(minCol, minRow, null), new wijmo.grid.cellInfo(maxCol, maxRow, null));
        };
        wijgrid.prototype._getDataItem = function (dataItemIndex) {
            return this.dataView().item(dataItemIndex);
        };
        wijgrid.prototype._getFirstDataRowCell = function (absCellIndex) {
            var rowIndex, len, rowInfo, view = this._view(), rows = this._rows(), $rt = wijmo.grid.rowType;
            for(rowIndex = 0 , len = rows.length(); rowIndex < len; rowIndex++) {
                rowInfo = view._getRowInfo(rows.item(rowIndex));
                if(rowInfo.type & $rt.data) {
                    return new wijmo.grid.cellInfo(absCellIndex, rowIndex);
                }
            }
            return wijmo.grid.cellInfo.outsideValue;
        };
        wijgrid.prototype._getNextCurrencyPos = function (dataRange, cellInfo, keyCode, shiftKeyPressed) {
            var cellIndex = cellInfo.cellIndex(), rowIndex = cellInfo.rowIndex(), tmp, keyCodeEnum = wijmo.grid.getKeyCodeEnum();
            switch(keyCode) {
                case keyCodeEnum.PAGE_UP:
                    if(this._reverseKey && rowIndex === dataRange.topLeft().rowIndex()) {
                        rowIndex = dataRange.bottomRight().rowIndex();
                    } else {
                        rowIndex -= this._pageSizeKey;
                        if(rowIndex < (tmp = dataRange.topLeft().rowIndex())) {
                            rowIndex = tmp;
                        }
                    }
                    break;
                case keyCodeEnum.PAGE_DOWN:
                    if(this._reverseKey && rowIndex === dataRange.bottomRight().rowIndex()) {
                        rowIndex = dataRange.topLeft().rowIndex();
                    } else {
                        rowIndex += this._pageSizeKey;
                        if(rowIndex > (tmp = dataRange.bottomRight().rowIndex())) {
                            rowIndex = tmp;
                        }
                    }
                    break;
                case keyCodeEnum.END:
                    cellIndex = (this._reverseKey && cellIndex === dataRange.bottomRight().cellIndex()) ? dataRange.topLeft().cellIndex() : dataRange.bottomRight().cellIndex();
                    break;
                case keyCodeEnum.HOME:
                    cellIndex = (this._reverseKey && cellIndex === dataRange.topLeft().cellIndex()) ? dataRange.bottomRight().cellIndex() : dataRange.topLeft().cellIndex();
                    break;
                case keyCodeEnum.LEFT:
                    if(cellIndex > dataRange.topLeft().cellIndex()) {
                        cellIndex--;
                    } else if(this._reverseKey) {
                        cellIndex = dataRange.bottomRight().cellIndex();
                    }
                    break;
                case keyCodeEnum.UP:
                    if(rowIndex > dataRange.topLeft().rowIndex()) {
                        rowIndex--;
                    } else if(this._reverseKey) {
                        rowIndex = dataRange.bottomRight().rowIndex();
                    }
                    break;
                case keyCodeEnum.RIGHT:
                    if(cellIndex < dataRange.bottomRight().cellIndex()) {
                        cellIndex++;
                    } else if(this._reverseKey) {
                        cellIndex = dataRange.topLeft().cellIndex();
                    }
                    break;
                case keyCodeEnum.ENTER:
                case keyCodeEnum.DOWN:
                    if(rowIndex < dataRange.bottomRight().rowIndex()) {
                        rowIndex++;
                    } else {
                        if(this._reverseKey) {
                            rowIndex = dataRange.topLeft().rowIndex();
                        }
                    }
                    break;
                case keyCodeEnum.TAB:
                    if(false/* TODO - tab navigation */ ) {
                        if(shiftKeyPressed) {
                            cellIndex--;
                            if(cellIndex < dataRange.topLeft().cellIndex()) {
                                cellIndex = dataRange.bottomRight().cellIndex();
                                rowIndex--;
                                if(rowIndex < dataRange.topLeft().rowIndex()) {
                                    rowIndex = dataRange.bottomRight().rowIndex();
                                }
                            }
                        } else {
                            cellIndex++;
                            if(cellIndex > dataRange.bottomRight().cellIndex()) {
                                cellIndex = dataRange.topLeft().cellIndex();
                                rowIndex++;
                                if(rowIndex > dataRange.bottomRight().rowIndex()) {
                                    rowIndex = dataRange.topLeft().rowIndex();
                                }
                            }
                        }
                    }
                    break;
            }
            return {
                cellIndex: cellIndex,
                rowIndex: rowIndex
            };
        };
        wijgrid.prototype._findUntilOuterDiv = function (start, tagsToFind) {
            var current = start, stopper, nodeName, item = null;
            for(; current; current = current.parentNode) {
                nodeName = current.nodeName.toLowerCase();
                if(nodeName) {
                    if(current === this.outerDiv[0]) {
                        stopper = current;
                        break;
                    }
                    if(tagsToFind[nodeName]) {
                        item = current;
                    }
                }
            }
            return stopper ? item : null;
        };
        wijgrid.prototype._getStaticIndex = function (bRow) {
            var result, dataRange = this._getDataCellsRange();
            if(this._hasSpannedCells()) {
                return -1;// can't use static columns\ rows

            }
            if(bRow) {
                result = Math.min(this.options.staticRowIndex, dataRange.bottomRight().rowIndex());
            } else {
                result = Math.min(this.options.staticColumnIndex, dataRange.bottomRight().cellIndex());
            }
            if(result < -1) {
                result = -1;
            }
            return result;
        };
        wijgrid.prototype._getStaticOffsetIndex = function (isColumn) {
            var index = 0;
            if(isColumn) {
                if(this.options.showRowHeader === true) {
                    // row header is always fixed
                    index++;
                }
            } else {
                index = this._columnsHeadersTable().length//the whole header is fixed in case of staticRowIndex >= 0.
                ;
                if(this.options.showFilter) {
                    index++// filter row is placed inside the header, so it is fixed too.
                    ;
                }
            }
            return index;
        };
        wijgrid.prototype._getRealStaticColumnIndex = // index of the fixed leaf inside the visibleLeaves collection.
        function () {
            var leaves, len, offsetStaticIndex = this._getStaticOffsetIndex(true), staticColumnIndex = this._getStaticIndex(false), resultIndex, tmp;
            resultIndex = staticColumnIndex + offsetStaticIndex;
            if(staticColumnIndex >= 0) {
                leaves = this._field("visibleLeaves");
                len = leaves.length;
                // If child column of some band is fixed then the top and right-most column of the root band contained current column will be fixed.
                tmp = resultIndex;
                for(; resultIndex < len; resultIndex++) {
                    if(leaves[resultIndex].parentIdx === -1) {
                        // resultIndex is the index of the first leaf which is not contained inside a band.
                        if(resultIndex > tmp) {
                            resultIndex--;
                        }
                        break;
                    }
                }
                if(resultIndex >= len) {
                    resultIndex = len - 1;
                }
            }
            return resultIndex;
        };
        wijgrid.prototype._getRealStaticRowIndex = function () {
            var offsetStaticIndex = this._getStaticOffsetIndex(false);
            return this._getStaticIndex(true) + offsetStaticIndex;
        };
        wijgrid.prototype._hasMerging = function () {
            var leaves = this._field("leaves"), i, len, leaf, result = false;
            if(leaves) {
                for(i = 0 , len = leaves.length; (i < len) && !result; i++) {
                    leaf = leaves[i];
                    result = result || (leaf.parentVis && (leaf.rowMerge !== "none"))// merged visible column?
                    ;
                }
            }
            return result;
        };
        wijgrid.prototype._hasGrouping = function () {
            var leaves = this._field("leaves"), i, len, leaf, result = false;
            for(i = 0 , len = leaves.length; (i < len) && !result; i++) {
                leaf = leaves[i];
                result = leaf.groupInfo && (leaf.groupInfo.position !== "none")// grouped column?
                ;
            }
            return result;
        };
        wijgrid.prototype._hasSpannedCells = function () {
            return this._hasGrouping() || this._hasMerging();
        };
        wijgrid.prototype._columnsHeadersTable = function (value) {
            if(arguments.length) {
                this._field("columnsHeadersTable", value);
            }
            return this._field("columnsHeadersTable");
        };
        wijgrid.prototype._view = function () {
            return this._field("view");
        };
        wijgrid.prototype._originalFooterRowData = function () {
            var footer = this._field("tfoot");
            return (footer && footer.length) ? footer[0] : // first row only
            null;
        };
        wijgrid.prototype._originalHeaderRowData = function () {
            var header = this._field("thead");
            return (header && header.length) ? header[0] : // first row only
            null;
        };
        wijgrid.prototype._setAttr = // set one or more attribute and store original values in the this._originalAttr object if $element == this.element.
        // (key, value), (map)
        function ($element, key, value) {
            var self = this;
            if($element === this.element) {
                // store original values
                if(arguments.length === 2) {
                    // map
                    $.each(key, function (k, v) {
                        if(!(k in self._originalAttr)) {
                            self._originalAttr[k] = $element.attr(k);
                        }
                    });
                    return $element.attr(key);
                } else {
                    // key, value
                    if(!(key in this._originalAttr)) {
                        this._originalAttr[key] = $element.attr(key);
                    }
                    return $element.attr(key, value);
                }
            } else {
                return (arguments.length === 3) ? $element.attr(key, value) : $element.attr(key);// .attr(map)

            }
            return this;
        };
        wijgrid.prototype._totalRowsCount = // used by virtual scrolling
        function () {
            /*if (this._dataStore.isDynamic()) {
            return this._dataStore.totalCount();
            }*/
            return this.sketchTable.length;
        };
        wijgrid.prototype._trackScrollingPosition = function (x, y) {
            this._scrollingState.x = x;
            this._scrollingState.y = y;
        };
        wijgrid.prototype._trackScrollingIndex = function (index) {
            this._scrollingState.index = index;
        };
        wijgrid.prototype._uid = function () {
            if(this.__uid === undefined) {
                this.__uid = wijmo.grid.getUID();
            }
            return "wijgrid" + this.__uid;
        };
        return wijgrid;
    })(wijmo.wijmoWidget);
    wijmo.wijgrid = wijgrid;
    wijgrid.prototype.widgetEventPrefix = "wijgrid";
    wijgrid.prototype._data$prefix = "wijgrid";
    wijgrid.prototype._customSortOrder = 1000;
    wijgrid.prototype._reverseKey = false;
    wijgrid.prototype._pageSizeKey = 10;
    wijgrid.prototype._mergeWidgetsWithOptions = true;
    wijgrid.prototype.options = $.extend(true, {
    }, wijmo.wijmoWidget.prototype.options, {
        wijMobileCSS: {
            header: "ui-header ui-bar-a",
            content: "ui-body-c",
            stateHover: "ui-btn-down-c",
            stateActive: "ui-btn-down-c"
        },
        allowColMoving: /// <summary>
        /// A value indicating whether columns can be moved.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ allowColMoving: false });
        /// </summary>
        false,
        allowColSizing: /// <summary>
        /// A value indicating whether columns can be sized.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ allowColSizing: false });
        /// </summary>
        false,
        allowEditing: /// <summary>
        /// A value indicating whether editing is enabled.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ allowEditing: false });
        /// </summary>
        false,
        allowKeyboardNavigation: /// <summary>
        /// A value indicating whether keyboard navigation is allowed.
        /// Default: true.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ allowKeyboardNavigation: false });
        /// </summary>
        true,
        allowPaging: /// <summary>
        /// A value indicating whether the widget can be paged.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ allowPaging: false });
        /// </summary>
        false,
        allowSorting: /// <summary>
        /// A value indicating whether the widget can be sorted.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ allowSorting: false });
        /// </summary>
        false,
        allowVirtualScrolling: /// <summary>
        /// A value indicates whether virtual scrolling is allowed.
        /// The pageSize option determines the limit of simultaneously rendered rows when virtual scrolling is used.
        /// This feature improves rendering efficiency of large data amounts.
        ///
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ allowVirtualScrolling: false });
        /// </summary>
        /// <remarks>
        /// Option is ignored if grid uses paging, columns merging or fixed rows.
        /// Option can not be enabled when using dynamic wijdatasource.
        /// </remarks>
        false,
        alwaysParseData: /// <summary>
        /// Determines whether wijgrid should parse underlying data at each operation requiring data re-fetching, like calling the ensureControl(true) method, paging, sorting, and so on.
        /// If the option is disabled, wijgrid parses data only at the first fetch.
        /// The option is ignored if dynamic data load feature is used, in this case data are always parsed.
        ///
        /// Default: true
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ alwaysParseData: true });
        /// </summary>
        ///
        /// <remarks>
        /// Turning off the option enhance wijgrid performance but if underlying data are changed by a developer it is necessary
        /// that changes match column datatype.
        /// </remarks>
        true,
        cellStyleFormatter: /// <summary>
        /// Function used for styling the cells in wijgrid.
        /// Default: undefined,
        /// Type: Function.
        /// Code example:
        ///
        /// Make the text of the current cell italic.
        ///
        /// $("#element").wijgrid({
        ///     highlightCurrentCell: true,
        ///     cellStyleFormatter: function(args) {
        ///        if ((args.row.type & $.wijmo.wijgrid.rowType.data)) {
        ///           if (args.state & $.wijmo.wijgrid.renderState.current) {
        ///              args.$cell.css("font-style", "italic");
        ///           } else {
        ///              args.$cell.css("font-style", "normal");
        ///           }
        ///        }
        ///     }
        /// });
        /// </summary>
        /// <param name="args" type="Object">
        /// args.$cell: jQuery object that represents cell to format.
        /// args.column: Options of the column to which the cell belongs.
        /// args.state: state of a cell to format, the following $.wijmo.wijgrid.renderState values or their combination can be applied to the cell: rendering, current, selected.
        /// args.row: information about associated row.
        /// args.row.$rows: jQuery object that represents rows to format.
        /// args.row.data: associated data.
        /// args.row.dataRowIndex: data row index.
        /// args.row.dataItemIndex: data item index.
        /// args.row.virtualDataItemIndex: virtual data item index.
        /// args.row.type: type of the row, one of the $.wijmo.wijgrid.rowType values.
        /// </param>
        undefined,
        columns: /// <summary>
        /// An array of column options.
        /// Default: [].
        /// Type: Array.
        /// Code example: $("#element").wijgrid({ columns: [ { headerText: "column0", allowSort: false }, { headerText: "column1", dataType: "number" } ] });
        /// </summary>
        [],
        columnsAutogenerationMode: /// <summary>
        /// Determines behavior for column autogeneration.
        ///
        /// Possible values are: "none", "append", "merge".
        ///
        /// "none": column auto-generation is turned off.
        /// "append": a column will be generated for each data field and added to the end of the columns collection.
        /// "merge": each column having dataKey option not specified will be automatically bound to the first unreserved data field.
        /// For each data field not bound to any column a new column will be generated and added to the end of the columns collection.
        /// To prevent automatic binding of a column to a data field set its dataKey option to null.
        ///
        /// Default: "merge".
        /// Type: String.
        /// Code example: $("#element").wijgrid({ columnsAutogenerationMode: "merge" });
        /// </summary>
        ///
        /// <remarks>
        /// Note: columns autogeneration process affects the options of columns and the columns option itself.
        /// </remarks>
        "merge",
        culture: /// <summary>
        /// Determines the culture ID.
        /// Default: "".
        /// Type: String.
        /// Code example: $("#element").wijgrid({ culture: "en" });
        /// </summary>
        "",
        customFilterOperators: /// <summary>
        /// An array of custom user filters.
        ///
        /// Custom user filter is an object which contains the following properties:
        ///   name - operator name.
        ///   arity - the number of filter operands. Can be either 1 or 2.
        ///   applicableTo - an array of datatypes to which the filter can be applied. Possible values for elements of the array are "string", "number", "datetime", "currency" and "boolean".
        ///   operator - comparison operator, the number of accepted parameters depends upon the arity. The first parameter is a data value, the second parameter is a filter value.
        ///
        /// Default: [].
        /// Type: Array.
        /// Code example:
        ///
        ///   var oddFilterOp = {
        ///     name: "customOperator-Odd",
        ///     arity: 1,
        ///     applicableTo: ["number"],
        ///     operator: function(dataVal) { return (dataVal % 2 !== 0); }
        ///  }
        ///
        ///  $("#element").wijgrid({ customFilterOperators: [oddFilterOp] });
        /// </summary>
        [],
        data: /// <summary>
        /// Determines the datasource.
        /// Possible datasources include:
        ///
        ///   1. A DOM table. This is the default datasource, used if the data option is null.
        ///     Table must have no cells with rowSpan and colSpan attributes.
        ///   2. A two-dimensional array, such as [[0, "a"], [1, "b"]].
        ///   3. An array of objects, such as [{field0: 0, field1: "a"}, {field0: 1, field1: "b'}].
        ///
        /// Type: Object.
        /// Default: null
        /// Code example:
        /// /* DOM table */
        /// $("#element").wijgrid();
        ///
        /// /* two-dimensional array */
        /// $("#element").wijgrid({ data: [[0, "a"], [1, "b"]] });
        /// </summary>
        null,
        editingInitOption: /// <summary>
        /// Determines an action to bring a cell in the editing mode.
        /// Possible values are: "click", "doubleClick", "auto".
        ///
        /// "click" - cell is edited via a single click.
        /// "doubleClick" - cell is edited via a double click.
        /// "auto" - action is determined automatically depending upon user environment. If user has a mobile platform then "click" is used, "doubleClick" otherwise.
        ///
        /// Type: string
        /// Default: "auto"
        /// Code example:
        ///
        /// $("#element").wijgrid({ editingInitOption: "auto" });
        /// </summary>
        "auto",
        ensureColumnsPxWidth: /// <summary>
        /// Determines whether to use number type column width as the real width of the column.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ ensureColumnsPxWidth: true });
        /// </summary>
        /// <remarks>
        /// If this option is set to true, wijgrid will not expand itself to expand the available space.
        /// Instead, it will use the width option of each column widget.
        /// </remarks>
        false,
        filterOperatorsSortMode: /// <summary>
        /// Determines the order of items in the filter dropdown list.
        /// Possible values are: "none", "alphabetical", "alphabeticalCustomFirst" and "alphabeticalEmbeddedFirst"
        ///
        /// "none" - operators follow the order of addition, built-in operators goes before custom ones.
        /// "alphabetical" - operators are sorted alphabetically.
        /// "alphabeticalCustomFirst" - operators are sorted alphabetically with custom operators going before built-in ones.
        /// "alphabeticalEmbeddedFirst" - operators are sorted alphabetically with built-in operators going before custom operators.
        ///
        /// Note: "NoFilter" operator is always first.
        ///
        /// Type: String.
        /// Default: "alphabeticalCustomFirst"
        /// Code example: $("#element").wijgrid({ filterOperatorsSortMode: "alphabeticalCustomFirst" });
        /// </summary>
        "alphabeticalCustomFirst",
        groupAreaCaption: /// <summary>
        /// Determines the caption of the group area.
        /// Default: "Drag a column here to group by that column.".
        /// Type: String.
        /// Code example: $("#element").wijgrid({ groupAreaCaption: "Drag a column here to group by that column." });
        /// </summary>
        "Drag a column here to group by that column.",
        groupIndent: /// <summary>
        /// Determines the indentation of the groups.
        /// Default: 10.
        /// Type: Number.
        /// Code example: $("#element").wijgrid({ groupIndent: 10 });
        /// </summary>
        10,
        highlightCurrentCell: /// <summary>
        /// Determines whether position of the current cell is highlighted or not.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ highlightCurrentCell: false });
        /// </summary>
        false,
        highlightOnHover: /// <summary>
        /// Determines whether hovered row is highlighted or not.
        /// Default: true.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ highlightCurrentCell: true });
        /// </summary>
        true,
        loadingText: ///<summary>
        /// Determines the text to be displayed when the grid is loading.
        /// Default: "Loading...".
        /// Code example: $("#element").wijgrid({ loadingText: "Loading..."});
        ///</summary>
        "Loading...",
        nullString: /// <summary>
        /// Cell values equal to this property value are considered as null value.
        /// Case-sensitive for built-in parsers.
        /// Default: "".
        /// Type: String.
        /// Code example: $("#element").wijgrid({ nullString: "" });
        /// </summary>
        "",
        pageIndex: /// <summary>
        /// Determines the zero-based index of the current page.
        /// The default value is 0.
        /// Type: Number.
        /// Code example: $("#element").wijgrid({ pageIndex: 0 });
        /// </summary>
        0,
        pageSize: /// <summary>
        /// Number of rows to place on a single page.
        /// The default value is 10.
        /// Type: Number.
        /// Code example: $("#element").wijgrid({ pageSize: 10 });
        /// </summary>
        10,
        pagerSettings: /// <summary>
        /// Pager settings.
        /// Note: See jquery.wijmo.wijpager.js for more information.
        /// Type: Object.
        /// Default: { mode: "numeric", pageButtonCount: 10, position: "bottom" }.
        /// Code example: $("#element").wijgrid({ pagerSettings: { position: "bottom" } });
        /// </summary>
        {
            mode: "numeric",
            pageButtonCount: 10,
            position: "bottom"
        },
        readAttributesFromData: /// A value indicating whether DOM cell attributes can be passed within a data values.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ readAttributesFromData: false });
        /// </summary>
        /// <remarks>
        /// This option allows binding collection of values to data and automatically converting them as attributes of corresponded DOM table cells during rendering.
        ///
        /// Values should be passed as an array of two items, where first item is a value of the data field, the second item is a list of values:
        ///
        /// $("#element").wijgrid({
        ///   data: [
        ///     [ [1, { "style": "color: red", "class": "myclass" } ], a ]
        ///   ]
        /// });
        ///
        /// or
        ///
        /// $("#element").wijgrid({
        ///   data: [
        ///     { col0: [1, { "style": "color: red", "class": "myclass" }], col1: "a" }
        ///   ]
        /// });
        ///
        /// Note: during conversion wijgrid extracts the first item value and makes it data field value, the second item (list of values) is removed:
        ///  [ { col0: 1, col1: "a" } ]
        ///
        /// If DOM table is used as a datasource then attributes belonging to the cells in tBody section of the original table will be read and applied to the new cells.
        ///
        /// rowSpan and colSpan attributes are not allowed.
        /// </remarks>
        false,
        rowStyleFormatter: /// <summary>
        /// Function used for styling the rows in wijgrid.
        /// Default: undefined,
        /// Type: Function.
        /// Code example:
        ///
        /// Make text of the alternating rows italic.
        ///
        /// $("#demo").wijgrid({
        ///    data: [
        ///       [0, "a"], [1, "b"], [2, "c"], [3, "d"]
        ///    ],
        ///    rowStyleFormatter (args) {
        ///       if ((args.state === $.wijmo.wijgrid.renderState.rendering) && (args.type & $.wijmo.wijgrid.rowType.dataAlt)) {
        /// 			args.$rows.find("td").css("font-style", "italic");
        /// 	   }
        ///    }
        /// });
        /// </summary>
        /// <param name="args" type="Object">
        /// args.state: state of a row to format, the following $.wijmo.wijgrid.renderState values or their combination can be applied to the row: rendering, current, hovered.
        /// args.$rows: jQuery object that represents rows to format.
        /// args.data: associated data.
        /// args.dataRowIndex: data row index.
        /// args.dataItemIndex: data item index.
        /// args.virtualDataItemIndex: virtual data item index.
        /// args.type: type of the row, one of the $.wijmo.wijgrid.rowType values.
        /// </param>
        undefined,
        scrollMode: /// <summary>
        /// Determines the scrolling mode.
        ///
        /// Possible values are:
        /// "none": scrolling is not used, staticRowIndex and staticColumnIndex are ignored.
        /// "auto": scrollbars appear automatically depending upon content size.
        /// "horizontal": horizontal scrollbar is active.
        /// "vertical": vertical scrollbar is active.
        /// "both": both horizontal and vertical scrollbars are active.
        ///
        /// Default: "none".
        /// Type: String.
        /// Code example: $("#element").wijgrid({ scrollMode: "none" });
        /// </summary>
        "none",
        selectionMode: /// <summary>
        /// Represents selection behavior.
        /// Possible values are: "none", "singleCell", "singleColumn", "singleRow", "singleRange", "multiColumn", "multiRow" and "multiRange".
        ///
        /// "none": selection is turned off.
        /// "singleCell": only a single cell can be selected at the same time.
        /// "singleColumn": only a single column can be selected at the same time.
        /// "singleRow": only a single row can be selected at the same time.
        /// "singleRange": only a single range of cells can be selected at the same time.
        /// "multiColumn": it is possible to select more than one row at the same time using the mouse and the CTRL or SHIFT keys.
        /// "multiRow": it is possible to select more than one row at the same time using the mouse and the CTRL or SHIFT keys.
        /// "multiRange": it is possible to select more than one cells range at the same time using the mouse and the CTRL or SHIFT keys.
        ///
        /// Default: "singleRow".
        /// Type: String.
        /// Code example: $("#element").wijgrid({ selectionMode: "singleRow" });
        /// </summary>
        "singleRow",
        showFilter: /// <summary>
        /// A value indicating whether filter row is visible.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ showFilter: false });
        /// </summary>
        false,
        showFooter: /// <summary>
        /// A value indicating whether footer row is visible.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ showFooter: false });
        /// </summary>
        false,
        showGroupArea: /// <summary>
        /// A value indicating whether group area is visible.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ showGroupArea: false });
        /// </summary>
        false,
        showSelectionOnRender: /// <summary>
        /// A value indicating whether selection will be automatically displayed at the current cell position when wijgrid is rendered.
        /// Default: true.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ showSelectionOnRender: true });
        /// </summary>
        true,
        showRowHeader: /// <summary>
        /// A value indicating whether the row header is visible.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ showRowHeader: false });
        /// </summary>
        false,
        staticColumnIndex: /*dma> Commented by YK for removing unsupported options.
        /// <summary>
        /// A value indicating whether the grid view should split content into several views with the ability to resize and scroll each view independently.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ splits: false });
        /// </summary>
        splits: false,

        /// <summary>
        /// Determines the distance in pixels for the vertical splitter. Applicable when the splits option is true.
        /// Default: 50.
        /// Type: Number.
        /// Code example: $("#element").wijgrid({ splitDistanceX: 50 });
        /// </summary>
        splitDistanceX: 50,

        /// <summary>
        /// Determines the distance in pixels for the horizontal splitter. Applicable when the splits option is true.
        /// Default: 50.
        /// Type: Number.
        /// Code example: $("#element").wijgrid({ splitDistanceY: 50 });
        /// </summary>
        splitDistanceY: 50,*/
        /// <summary>
        /// Indicates the index of columns that will always be shown on the left when the grid view scrolled horizontally.
        /// Note, that all columns before the static column will be automatically marked as static, too.
        /// It can only take effect when scrollMode is not "none".
        /// It will be considered as -1 when grouping or row merging is enabled.
        /// -1 means no data column but row header is static.
        /// 0 means one data column and row header are static.
        ///
        /// Default: -1.
        /// Type: Number.
        /// Code example: $("#element").wijgrid({ staticColumnIndex: -1 });
        /// </summary>
        -1,
        staticRowIndex: /// <summary>
        /// Indicates the index of data rows that will always be shown on the
        /// top when the wijgrid is scrolled vertically.
        /// Note, that all rows before the static row
        /// will be automatically marked as static, too.
        /// It can only take effect when scrollMode is not "none".
        /// It will be considered as -1 when grouping or row merging is enabled.
        /// -1 means no data row but header row is static.
        /// 0 means one data row and header row are static.
        ///
        /// Default: -1.
        /// Type: Number.
        /// Code example: $("#element").wijgrid({ staticRowIndex: -1 });
        /// </summary>
        -1,
        totalRows: /*<dma*/
        /// <summary>
        /// Gets or sets the virtual number of items in the wijgrid and enables custom paging.
        /// Setting option to a positive value activates custom paging, the number of displayed
        /// rows and the total number of pages will be determined upon the totalRows and pageSize values.
        ///
        /// Default: -1.
        /// Type: Number.
        /// Code example: $("#element").wijgrid({ totalRows: -1 });
        /// </summary>
        /// <remarks>
        /// In custom paging mode sorting, paging and filtering are not performed automatically.
        /// It is needed to manually handle sorted, pageIndexChanged, filtered events, load new
        /// portion of data there followed by ensureControl(true) method call.
        /// </remarks>
        -1,
        afterCellEdit: /* --- events */
        /// <summary>
        /// The afterCellEdit event handler. A function called after editing is completed.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the afterCellEdit event:
        /// $("#element").wijgrid({ afterCellEdit: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridaftercelledit", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.cell: gets the edited cell's information.
        /// args.event: event that initiated the cell updating.
        /// args.handled: gets or sets value determining whether the developer finalizes editing of the cell manually.
        ///   The default value is false which means that the widget will try to finalize editing of the cell automatically.
        ///   If the developer provides a custom editing front end then this property must be set to true.
        /// </param>
        null,
        afterCellUpdate: /// <summary>
        /// The afterCellUpdate event handler. A function called after a cell has been updated.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the afterCellUpdate event:
        /// $("#element").wijgrid({ afterCellUpdate: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridaftercellupdate", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.cell: gets the edited cell's information.
        /// </param>
        null,
        beforeCellEdit: /// <summary>
        /// The beforeCellEdit event handler. A function called before a cell enters edit mode. Cancellable.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the beforeCellEdit event:
        /// $("#element").wijgrid({ beforeCellEdit: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridbeforecelledit", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.cell: information about the cell to be edited.
        /// args.event: event initiated cell editing.
        /// args.handled: gets or sets a value determining whether developer initiates cell editor(s) manually.
        ///   The default value is false which means that widget will trying to provide editing control automatically.
        ///   If cells contain custom controls or if developer wants to provide a custom editing front end then he
        ///   must set this property to true.
        ///</param>
        null,
        beforeCellUpdate: /// <summary>
        /// The beforeCellUpdate event handler. A function called before a cell is updated.
        /// Default: null.
        /// Type: Function.
        ///
        /// Code example:
        /// Supply a callback function to handle the beforeCellUpdate event:
        /// $("#element").wijgrid({ beforeCellUpdate: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridbeforecellupdate", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.cell: gets information of the edited cell.
        /// args.value: returns the new cell value. If the property value is not changed the widget will try to
        ///   extract the new cell value automatically. If the developer provides custom editing front end then
        ///   the new cell value must be returned within this property.
        /// </param>
        null,
        cellClicked: /// <summary>
        /// The cellClicked event handler. A function called when a cell is clicked.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the cellClicked event:
        /// $("#element").wijgrid({ cellClicked: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridcellclicked", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.cell: an instance of the $.wijmo.wijgrid.cellInfo class that represents the clicked cell.
        /// </param>
        null,
        columnDragging: /// <summary>
        /// The columnDragging event handler. A function called when column dragging is started, but before wijgrid handles the operation. Cancellable.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the columnDragging event:
        /// $("#element").wijgrid({ columnDragging: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridcolumndragging", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.drag: drag source, column being dragged.
        /// args.dragSource: the place where the dragged column widget is located, possible value: "groupArea", "columns".
        /// </param>
        null,
        columnDragged: /// <summary>
        /// The columnDragged event handler. A function called when column dragging has been started.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the columnDragged event:
        /// $("#element").wijgrid({ columnDragged: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridcolumndragged", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.drag: drag source, column being dragged.
        /// args.dragSource: the place where the dragged column widget is located, possible value: "groupArea", "columns".
        /// </param>
        null,
        columnDropping: /// <summary>
        /// The columnDropping event handler. A function called when column is dropped into the columns area, but before wijgrid handles the operation. Cancellable.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the columnDropping event:
        /// $("#element").wijgrid({ columnDropping: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridcolumndropping", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.drag: drag source, column being dragged.
        /// args.drop: drop target, column on which drag source is dropped.
        /// args.at: position to drop (one of the "left", "right" and "center" values) relative to drop target.
        /// </param>
        null,
        columnDropped: /// <summary>
        /// The columnDropped event handler. A function called when column has been dropped into the columns area.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the columnDropped event:
        /// $("#element").wijgrid({ columnDropped: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridcolumndropped", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.drag: drag source, column being dragged.
        /// args.drop: drop target, column on which drag source is dropped.
        /// args.at: position to drop (one of the "left", "right" and "center" values) relative to drop target.
        /// </param>
        null,
        columnGrouping: /// <summary>
        /// The columnGrouping event handler. A function called when column is dropped into the group area, but before wijgrid handles the operation. Cancellable.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the columnGrouping event:
        /// $("#element").wijgrid({ columnGrouping: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridcolumngrouping", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.drag: drag source, column being dragged.
        /// args.drop: drop target, column on which drag source is dropped (be null if dropping a column into empty group area).
        /// args.dragSource: the place where the dragged column widget is located, possible value: "groupArea", "columns".
        /// args.dropSource: the place where the dropped column widget is located, possible value: "groupArea", "columns".
        /// args.at: position to drop (one of the "left", "right" and "center" values) relative to drop target ("left" if dropping a column into empty group area).
        /// </param>
        null,
        columnGrouped: /// <summary>
        /// The columnGrouped event handler. A function called when column has been dropped into the group area.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the columnGrouped event:
        /// $("#element").wijgrid({ columnGrouped: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridcolumngrouped", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.drag: drag source, column being dragged.
        /// args.drop: drop target, column on which drag source is dropped (null if dropping a column into empty group area).
        /// args.dragSource: the place where the dragged column is located, possible values: "groupArea", "columns".
        /// args.dropSource: the place where the dropped column is located, possible values: "groupArea", "columns".
        /// args.at: position to drop (one of the "left", "right" and "center" values) relative to drop target ("left" if dropping a column into empty group area).
        /// </param>
        null,
        columnResizing: /// <summary>
        /// The columnResizing event handler. A function called when column is resized, but before wijgrid handles the operation. Cancellable.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the columnResizing event:
        /// $("#element").wijgrid({ columnResizing: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridcolumnresizing", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.column: column that is being resized.
        /// args.oldWidth: the old width of the column before resized.
        /// args.newWidth: the new width being set to the column.
        /// </param>
        null,
        columnResized: /// <summary>
        /// The columnResized event handler. A function called when column has been resized.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the columnResized event:
        /// $("#element").wijgrid({ columnResized: function (e) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridcolumnresized", function (e) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.column: column that is being resized.
        /// </param>
        null,
        columnUngrouping: /// <summary>
        /// The columnUngrouping event handler. A function called when column is removed from the group area, but before wijgrid handles the operation. Cancellable.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the columnUngrouping event:
        /// $("#element").wijgrid({ columnUngrouping: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridcolumnungrouping", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.column: column being removed.
        /// </param>
        null,
        columnUngrouped: /// <summary>
        /// The columnUngrouped event handler. A function called when column has been removed from the group area.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the columnUngrouped event:
        /// $("#element").wijgrid({ columnUngrouped: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridcolumnungrouped", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.column: column being removed.
        /// </param>
        null,
        currentCellChanging: /// <summary>
        /// The currentCellChanging event handler. A function called before the current cell is changed. Cancellable.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the currentCellChanging event:
        /// $("#element").wijgrid({ currentCellChanging: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridcurrentcellchanging", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.cellIndex: new cell index.
        /// args.rowIndex: new row index.
        /// args.oldCellIndex: old cell index.
        /// args.oldRowIndex: old row index.
        /// </param>
        null,
        currentCellChanged: /// <summary>
        /// The currentCellChanged event handler. A function called after the current cell is changed.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the currentCellChanged event:
        /// $("#element").wijgrid({ currentCellChanged: function (e) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridcurrentcellchanged", function (e) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        null,
        filterOperatorsListShowing: /// <summary>
        /// The filterOperatorsListShowing event handler. A function called before the filter drop-down list is shown.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the filterOperatorsListShowing event:
        /// $("#element").wijgrid({ filterOperatorsListShowing: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridfilteroperatorslistshowing", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.column: associated column.
        /// args.operators: An array of filter operators.
        /// </param>
        null,
        filtering: /// <summary>
        /// The filtering event handler. A function called before the filtering operation is started. Cancellable.
        /// Type: Function.
        /// Default: null.
        /// Code example:
        /// Supply a callback function to handle the filtering event:
        /// $("#element").wijgrid({ filtering: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridfiltering", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.column: column that is being filtered.
        /// args.operator: new filter operator name.
        /// args.value: new filter value.
        /// </param>
        null,
        filtered: /// <summary>
        /// The filtered event handler. A function called after the wijgrid is filtered.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the filtered event:
        /// $("#element").wijgrid({ filtered: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridfiltered", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.column: column that is being filtered.
        /// </param>
        null,
        groupAggregate: /// <summary>
        /// The groupAggregate event handler. A function called when groups are being created and the "aggregate" option of the column object has been set to "custom".
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the groupAggregate event:
        /// $("#element").wijgrid({ groupAggregate: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridgroupaggregate", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.data: data object.
        /// args.column: column that is being grouped.
        /// args.groupByColumn: column initiated grouping.
        /// args.groupText: text that is being grouped.
        /// args.text: text that will be displayed in the group header or group footer.
        /// args.groupingStart: first index for the data being grouped.
        /// args.groupingEnd: last index for the data being grouped.
        /// args.isGroupHeader: indicates whether row that is being grouped is a group header or not.
        /// </param>
        null,
        groupText: /// <summary>
        /// The groupText event handler. A function called when groups are being created and the groupInfo.headerText or groupInfo.footerText of the groupInfo option has been set to "custom".
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the groupText event:
        /// $("#element").wijgrid({ groupText: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridgrouptext", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.data: data object.
        /// args.column: column that is being grouped.
        /// args.groupByColumn: column initiated grouping.
        /// args.groupText: text that is being grouped.
        /// args.text: text that will be displayed in the group header or group footer.
        /// args.groupingStart: first index for the data being grouped.
        /// args.groupingEnd: last index for the data being grouped.
        /// args.isGroupHeader: indicates whether the row that is being grouped is a group header or not.
        /// args.aggregate: aggregate value.
        /// </param>
        null,
        invalidCellValue: /// <summary>
        /// The invalidCellValue event handler. A function called when a cell needs to start updating but the cell value is invalid.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the invalidCellValue event:
        /// $("#element").wijgrid({ invalidCellValue: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridinvalidcellvalue", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.cell: gets the information of edited cell.
        /// args.value: current value.
        /// </param>
        null,
        pageIndexChanging: /// <summary>
        /// The pageIndexChanging event handler. A function called before page index is changed. Cancellable.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the pageIndexChanging event:
        /// $("#element").wijgrid({ pageIndexChanging: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridpageindexchanging", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.newPageIndex: new page index.
        /// </param>
        null,
        pageIndexChanged: /// <summary>
        /// The pageIndexChanged event handler. A function called after page index is changed.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the pageIndexChanged event:
        /// $("#element").wijgrid({ pageIndexChanged: function (e) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridpageindexchanged", function (e) { });
        /// </summary>
        ///
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.newPageIndex: new page index.
        /// </param>
        null,
        selectionChanged: /// <summary>
        /// The selectionChanged event handler. A function called after the selection is changed.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the selectionChanged event:
        /// $("#element").wijgrid({ selectionChanged: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridselectionchanged", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.addedCells: cells added to the selection.
        /// args.removedCells: cells removed from the selection.
        /// </param>
        null,
        sorting: /// <summary>
        /// The sorting event handler. A function called before the sorting operation is started. Cancellable.
        /// Type: Function.
        /// Default: null.
        /// Code example:
        /// Supply a callback function to handle the sorting event:
        /// $("#element").wijgrid({ sorting: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridsorting", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.column: column that is being sorted.
        /// args.sortDirection: new sort direction.
        /// args.sortCommand: reprerents a sorting command as a string combining args.column.dataKey and args.sortDirection in a shorthand notation: "<dataKey> <asc|desc>".
        /// </param>
        null,
        sorted: /// <summary>
        /// The sorted event handler. A function called after the widget is sorted.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the sorted event:
        /// $("#element").wijgrid({ sorted: function (e, args) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridsorted", function (e, args) { });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.column: column that is being sorted.
        /// args.sortDirection: new sort direction.
        /// args.sortCommand: reprerents a sorting command as a string combining args.column.dataKey and args.sortDirection in a shorthand notation: "<dataKey> <asc|desc>".
        /// </param>
        null,
        dataLoading: /* events --- */
        /* --- life-cycle events */
        //			/// <summary>
        //			/// The ajaxError event handler. A function called when wijgrid is bound to remote data and
        //			/// the ajax request fails.
        //			/// Default: null.
        //			/// Type: Function.
        //			/// Code example:
        //			/// Supply a callback function to handle the ajaxError event:
        //			/// $("#element").wijgrid({ ajaxError: function (e, args) { } });
        //			/// Bind to the event by type:
        //			/// $("#element").bind("wijgridajaxerror", function (e, args) { });
        //			/// </summary>
        //			/// <param name="e" type="Object">jQuery.Event object.</param>
        //			/// <param name="args" type="Object">
        //			/// The data corresponded with this event.
        //			/// args.XMLHttpRequest: the XMLHttpRequest object.
        //			/// args.textStatus: a string describing the error type.
        //			/// args.errorThrown: an exception object.
        //			///
        //			/// Refer to the jQuery.ajax.error event documentation for more details on this arguments.
        //			/// </param>
        //			ajaxError: null,
        /// <summary>
        /// The dataLoading event handler. A function called when wijgrid loads a portion of data from the underlying datasource.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the dataLoading event:
        /// $("#element").wijgrid({ dataLoading: function (e) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgriddataloading", function (e) { });
        /// </summary>
        /// <param name="e" type="Object">jQuery.Event object.</param>
        null,
        dataLoaded: /// <summary>
        /// The dataLoaded event handler. A function called when data are loaded.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the dataLoaded event:
        /// $("#element").wijgrid({ dataLoaded: function (e) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgriddataloaded", function (e) { });
        /// </summary>
        /// <param name="e" type="Object">jQuery.Event object.</param>
        null,
        loading: /// <summary>
        /// The loading event handler. A function called at the beginning of the wijgrid's lifecycle.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the loading event:
        /// $("#element").wijgrid({ loading: function (e) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridloading", function (e) { });
        /// </summary>
        /// <param name="e" type="Object">jQuery.Event object.</param>
        null,
        loaded: /// <summary>
        /// The loaded event handler. A function called at the end the wijgrid's lifecycle when wijgrid is
        /// filled with data and rendered.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the loaded event:
        /// $("#element").wijgrid({ loaded: function (e) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridloaded", function (e) { });
        /// </summary>
        /// <param name="e" type="Object">jQuery.Event object.</param>
        null,
        rendering: /// <summary>
        /// The rendering event handler. A function called when wijgrid is about to render.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the rendering event:
        /// $("#element").wijgrid({ rendering: function (e) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridrendering", function (e) { });
        /// </summary>
        /// <param name="e" type="Object">jQuery.Event object.</param>
        null,
        rendered: /// <summary>
        /// The rendered event handler. A function called when wijgrid is rendered.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the rendered event:
        /// $("#element").wijgrid({ rendered: function (e) { } });
        /// Bind to the event by type:
        /// $("#element").bind("wijgridrendered", function (e) { });
        /// </summary>
        /// <param name="e" type="Object">jQuery.Event object.</param>
        null
    });
    $.wijmo.registerWidget("wijgrid", wijgrid.prototype);
})(wijmo || (wijmo = {}));

var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../Base/jquery.wijmo.widget.ts"/>
/// <reference path="interfaces.ts"/>
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery;
    var c1basefield = (function (_super) {
        __extends(c1basefield, _super);
        function c1basefield() {
            _super.apply(this, arguments);

        }
        c1basefield.prototype._create = function () {
            var wijgrid = $.data(this.element[0], "wijgridowner");
            this._field("owner", wijgrid);
            wijmo.grid.widgetName(this.element[0], this.widgetFullName);
            this._destroyed = false;
            this.element.addClass(wijgrid.options.wijCSS.widget + " wijmo-c1basefield " + wijgrid.options.wijCSS.stateDefault);
            if(this.options.disabled) {
                this.disable();
            }
            if(wijgrid.options.allowColMoving) {
                wijgrid._dragndrop(true).attach(this);
            }
        };
        c1basefield.prototype._init = function () {
            this.element.wrapInner("<div class='wijmo-wijgrid-innercell'></div>");
            this._refreshHeaderCell();
        };
        c1basefield.prototype.destroy = function () {
            try  {
                _super.prototype.destroy.apply(this, arguments);
            }finally {
                this._destroyed = true;
            }
        };
        c1basefield.prototype._destroy = function () {
            if(this._isDestroyed()) {
                return;
            }
            var wijgrid = this._owner();
            if(wijgrid && wijgrid._dragndrop(false)) {
                wijgrid._dragndrop(false).detach(this);
            }
            wijmo.grid.remove$dataByPrefix(this.element, this._data$prefix);
            this.element.removeClass(wijgrid.options.wijCSS.widget + " wijmo-c1basefield " + wijgrid.options.wijCSS.stateDefault).html(this.element.find(".wijmo-wijgrid-headertext").html())// restore initial cell content
            ;
        };
        c1basefield.prototype._field = function (name, value) {
            return wijmo.grid.dataPrefix(this.element, this._data$prefix, name, value);
        };
        c1basefield.prototype._removeField = function (name) {
            var internalDataName = this._data$prefix + name;
            this.element.removeData(internalDataName);
        };
        c1basefield.prototype._setOption = //isInvokedOutside stands for whether setOption is invoked by related widget
        function (key, value) {
            var presetFunc = this["_preset_" + key], oldValue = this.options[key], optionChanged, postsetFunc;
            if(presetFunc !== undefined) {
                value = presetFunc.apply(this, [
                    value,
                    oldValue
                ]);
            }
            optionChanged = (value !== oldValue);
            //$.Widget.prototype._setOption.apply(this, arguments);  note: there is no dynamic linkage between the arguments and the formal parameter values when strict mode is used
            _super.prototype._setOption.apply(this, [
                key,
                value
            ]);
            if(optionChanged) {
                if(this.options.groupedIndex !== undefined) {
                    var groupedWidget = this._owner()._field("groupedWidgets")[this.options.groupedIndex];
                    if(groupedWidget && (key in groupedWidget.options)) {
                        groupedWidget._setOption(key, value)// update linked grouped column widget
                        ;
                    }
                }
                postsetFunc = this["_postset_" + key];
                if(postsetFunc !== undefined) {
                    postsetFunc.apply(this, [
                        value,
                        oldValue
                    ]);
                }
            }
        };
        c1basefield.prototype._postset_allowMoving = function (value, oldValue) {
            //no need to detach because there is allowMoving judgment in draganddrop
            /*
            if (value) {
            if (this._owner().options.allowColMoving) {
            this._owner()._dragndrop(true).attach(this);
            }
            } else {
            this._owner()._dragndrop(true).detach(this);
            }
            */
                    };
        c1basefield.prototype._preset_clientType = function (value, oldValue) {
            throw "read-only";
        };
        c1basefield.prototype._postset_headerText = function (value, oldValue) {
            this._refreshHeaderCell();
        };
        c1basefield.prototype._postset_visible = function (value, oldValue) {
            this._owner().ensureControl(false);
        };
        c1basefield.prototype._postset_width = function (value, oldValue) {
            var wijgrid = this._owner();
            if(wijgrid) {
                this.options.ensurePxWidth = true// prevent auto expanding
                ;
                var found = wijmo.grid.getColumnByTravIdx(wijgrid.options.columns, this.options.travIdx);
                if(found) {
                    // *update options *
                    found.found.width = value;
                    found.found.ensurePxWidth = true// prevent auto expanding
                    ;
                }
                wijgrid.setSize()// recalculate sizes and auto expand other columns if possible.
                ;
            }
            /*// change width of column.
            var view = this._owner()._view(),
            index = this.options.visLeavesIdx,
            oldRealValue = $(view.getHeaderCell(index)).outerWidth();
            view.ensureWidth(index, value, oldRealValue);*/
                    };
        c1basefield.prototype._owner = function () {
            return this._field("owner");
        };
        c1basefield.prototype._canSize = function () {
            return this.options.allowSizing && this._owner().options.allowColSizing;
        };
        c1basefield.prototype._canDrag = // drag-n-drop
        function () {
            return this.options.allowMoving === true;
        };
        c1basefield.prototype._canDropTo = function (wijField) {
            // parent can't be dropped into a child
            if(wijmo.grid.isChildOf(this._owner().options.columns, wijField, this)) {
                return false;
            }
            return true;
        };
        c1basefield.prototype._createHeaderContent = function ($container) {
            return $container.html(this.options.headerText || "");// html(value) returns "" if value is undefined

        };
        c1basefield.prototype._decorateHeaderContent = function ($container) {
            return $container.wrapInner("<span class=\"wijmo-wijgrid-headertext\" />");
        };
        c1basefield.prototype._refreshHeaderCell = function () {
            var $container = this.element.children(".wijmo-wijgrid-innercell").empty();
            this._createHeaderContent($container);
            this._decorateHeaderContent($container);
        };
        c1basefield.prototype._isDestroyed = function () {
            return this._destroyed;
        };
        return c1basefield;
    })(wijmo.wijmoWidget);
    wijmo.c1basefield = c1basefield;
    c1basefield.prototype._data$prefix = "c1basefield";
    c1basefield.prototype.options = $.extend(true, {
    }, wijmo.JQueryUIWidget.prototype.options, {
        allowMoving: /// <summary>
        /// A value indicating whether the column can be moved.
        /// Default: true.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ columns: [ { allowMoving: true } ] });
        /// </summary>
        true,
        allowSizing: /// <summary>
        /// A value indicating whether the column can be sized.
        /// Default: true.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ columns: [ { allowSizing: true } ] });
        /// </summary>
        true,
        cellFormatter: /// <summary>
        /// Function used for changing content, style and attributes of the column cells.
        /// Default: undefined.
        /// Type: Function.
        /// Code example:
        ///
        /// Add an image which URL is obtained from the "Url" data field to the column cells.
        ///
        /// $("#demo").wijgrid({
        ///   data: [
        ///      { ID: 0, Url: "/images/0.jpg" },
        ///      { ID: 1, Url: "/images/1.jpg" }
        ///   ],
        ///   columns: [
        ///      {},
        ///      {
        ///         cellFormatter: function (args) {
        ///            if (args.row.type & $.wijmo.wijgrid.rowType.data) {
        ///               args.$container
        ///                  .empty()
        ///                  .append($("<img />")
        ///                     .attr("src", args.row.data.Url));
        ///
        ///               return true;
        ///            }
        ///         }
        ///      }
        ///   ]
        /// });
        /// </summary>
        /// <remarks>
        /// Important: cellFormatter should not alter content of header and filter row cells container.
        /// </remarks>
        /// <param name="args" type="Object">
        /// args.$container: jQuery object that represents cell container to format.
        /// args.afterDefaultCallback: callback function which is invoked after applying default formatting.
        /// args.column: Options of the formatted column.
        /// args.formattedValue: Formatted value of the cell.
        /// args.row: information about associated row.
        /// args.row.$rows: jQuery object that represents rows to format.
        /// args.row.data: associated data.
        /// args.row.dataRowIndex: data row index.
        /// args.row.dataItemIndex: data item index.
        /// args.row.virtualDataItemIndex: virtual data item index.
        /// args.row.type: type of the row, one of the $.wijmo.wijgrid.rowType values.
        /// </param>
        /// <returns type="Boolean">True if container content has been changed and wijgrid should not apply the default formatting to the cell.</returns>
        undefined,
        dataKey: /// <summary>
        /// A value indicating the key of the data field associated with a column.
        /// If an array of hashes is used as a datasource for wijgrid, this should be string value,
        /// otherwise this should be an integer determining an index of the field in the datasource.
        /// Default: undefined
        /// Type: String or Number.
        /// Code example: $("#element").wijgrid({ columns: [ { dataKey: "ProductID" } ] });
        /// </summary>
        undefined,
        ensurePxWidth: /// <summary>
        /// Determines whether to use number type column width as the real width of the column.
        /// Default: undefined.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ columns: [ { ensurePxWidth: true } ] });
        /// </summary>
        /// <remarks>
        /// If this option is set to true, wijgrid will use the width option of the column widget.
        /// If this option is undefined, wijgrid will refer to the ensureColumnsPxWidth option.
        /// </remarks>
        undefined,
        footerText: /// <summary>
        /// Gets or sets the footer text.
        /// The text may include a placeholder: "{0}" is replaced with the aggregate.
        /// Default: undefined.
        /// Type: String.
        /// Code example: $("#element").wijgrid({ columns: [ { footerText: "footer" } ] });
        /// </summary>
        /// <remarks>
        /// If the value is undefined the footer text will be determined automatically depending on the type of the datasource:
        ///  DOM table - text in the footer cell.
        /// </remarks>
        undefined,
        headerText: /// <summary>
        /// Gets or sets the header text.
        /// Default: undefined.
        /// Type: String.
        /// Code example: $("#element").wijgrid({ columns: [ { headerText: "column0" } ] });
        /// </summary>
        /// <remarks>
        /// If the value is undefined the header text will be determined automatically depending on the type of the datasource:
        ///  DOM table - text in the header cell.
        ///  Array of hashes - dataKey (name of the field associated with column).
        ///  Two-dimensional array - dataKey (index of the field associated with column).
        /// </remarks>
        undefined,
        textAlignment: /// <summary>
        /// Gets or sets the text alignment of data cells.
        ///
        /// Possible values are:
        /// "left": aligns the text to the left.
        /// "right": aligns the text to the right.
        /// "center": centers the text.
        ///
        /// Default: undefined.
        /// Type: string.
        /// Code example: $("#element").wijgrid({ columns: [ { textAligment: "right" } ] });
        /// </summary>
        /// <remarks>
        /// If the value is undefined the text alignment will be defined by the column data type.
        /// </remarks>
        undefined,
        visible: /// <summary>
        /// A value indicating whether column is visible.
        /// Default: true.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ columns: [ { visible: true } ] });
        /// </summary>
        true,
        width: /// <summary>
        /// Determines the width of the column.
        /// Default: undefined.
        /// Type: Number or String.
        /// Code example:
        /// $("#element").wijgrid({ columns: [ { width: 150 } ] });
        /// $("#element").wijgrid({ columns: [ { width: "10%" } ]});
        /// </summary>
        /// <remarks>
        /// The option could either be a number of string.
        /// Use number to specify width in pixel.
        /// Use string to specify width in percentage.
        /// By default, wijgrid emulates the table element behavior when using number as width.
        /// This means wijgrid may not have the exact width specified.
        /// If exact width is needed, please set ensureColumnsPxWidth option of wijgrid to true.
        /// </remarks>
        undefined
    });
    $.wijmo.registerWidget("c1basefield", c1basefield.prototype);
})(wijmo || (wijmo = {}));

var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="c1basefield.ts"/>
/// <reference path="interfaces.ts"/>
/// <reference path="../../../wijinput/jquery.wijmo.wijinputdate.ts"/>
/// <reference path="../../../wijinput/jquery.wijmo.wijinputmask.ts"/>
/// <reference path="../../../wijinput/jquery.wijmo.wijinputnumber.ts"/>
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery;
    var c1field = (function (_super) {
        __extends(c1field, _super);
        function c1field() {
            _super.apply(this, arguments);

        }
        c1field.prototype._create = function () {
            _super.prototype._create.apply(this, arguments);
            var wijgrid = this._owner();
            this.element.addClass(wijgrid.options.wijCSS.widget + " wijmo-c1field");
        };
        c1field.prototype._destroy = function () {
            if(this._isDestroyed()) {
                return;
            }
            var wijgrid = this._owner();
            this.element.find("*").unbind("." + this.widgetName);
            if(this.$filterEditor) {
                this.$filterEditor.closest("td").find(// column filter cell
                "*").unbind("." + this.widgetName);
                switch(this._getInputEditorType(this.options)) {
                    case "date":
                        if(this.$filterEditor.data("wijmo-wijinputdate")) {
                            this.$filterEditor.wijinputdate("destroy");
                        }
                        break;
                    case "mask":
                        if(this.$filterEditor.data("wijmo-wijinputmask")) {
                            this.$filterEditor.wijinputmask("destroy");
                        }
                        break;
                    case "numberCurrency":
                    case "numberNumber":
                    case "numberPercent":
                        if(this.$filterEditor.data("wijmo-wijinputnumber")) {
                            this.$filterEditor.wijinputnumber("destroy");
                        }
                        break;
                }
                this.$filterEditor = null;
            }
            this.element.removeClass(wijgrid.options.wijCSS.widget + " wijmo-c1field").find(".wijmo-wijgrid-headertext > span." + wijgrid.options.wijCSS.icon).remove()// remove ascending/ descending icon
            ;
            this._removeDropDownFilterList();
            _super.prototype._destroy.apply(this, arguments);
        };
        c1field.prototype._init = function () {
            _super.prototype._init.apply(this, arguments);
            this.$filterEditor = null;
            var wijgrid = this._owner();
            this.filterRow = wijgrid._filterRow();
            if(wijgrid.options.showFilter && this.options.showFilter && (this.options.dataIndex >= 0)) {
                this._prepareFilterCell();
            }
        };
        c1field.prototype._postset_aggregate = function (value, oldValue) {
            this._owner().ensureControl(false);
        };
        c1field.prototype._postset_allowSort = function (value, oldValue) {
            //this.element.find("#contentCell").empty();
            //this._headerTextDOM(this.options.headerText);
            this._refreshHeaderCell();
        };
        c1field.prototype._postset_dataType = function (value, oldValue) {
            throw "read-only";
        };
        c1field.prototype._postset_dataParser = function (value, oldValue) {
            this._owner().ensureControl(false);
        };
        c1field.prototype._postset_dataFormatString = function (value, oldValue) {
            this._owner().ensureControl(false);
        };
        c1field.prototype._postset_filterOperator = function (value, oldValue) {
            this._owner().ensureControl(true);
        };
        c1field.prototype._postset_filterValue = function (value, oldValue) {
            this._owner().ensureControl(true);
        };
        c1field.prototype._postset_groupInfo = function (value, oldValue) {
            this._owner().ensureControl(true);
        };
        c1field.prototype._postset_rowMerge = function (value, oldValue) {
            this._owner().ensureControl(false);
        };
        c1field.prototype._postset_showFilter = function (value, oldValue) {
            this._owner().ensureControl(false);
        };
        c1field.prototype._postset_sortDirection = function (value, oldValue) {
            this.options.sortOrder = 0;
            this._owner().ensureControl(true);
        };
        c1field.prototype._postset_width = function (value, oldValue) {
            _super.prototype._postset_width.apply(this, arguments);
        };
        c1field.prototype._canDropTo = function (wijField) {
            if(_super.prototype._canDropTo.apply(this, arguments)) {
                //the grouped column can't be dropped into group area
                if(this.options.groupedIndex !== undefined && (wijField instanceof $.wijmo.c1groupedfield)) {
                    return false;
                }
                return true;
            }
            return false;
        };
        c1field.prototype._canSort = function () {
            var grid = this._owner();
            return (grid && grid.options.allowSorting && this.options.allowSort && (this.options.dataIndex >= 0));
        };
        c1field.prototype._decorateHeaderContent = function ($container) {
            if(this._canSort()) {
                var wijgrid = this._owner(), $anchor = $container.wrapInner("<a class=\"wijmo-wijgrid-headertext\" href=\"#\" role=\"button\" />").children("a");
                $anchor.bind("click." + this.widgetName, this, $.proxy(this._onHrefClick, this));
                switch(this.options.sortDirection) {
                    case // sorting icon
                    "ascending":
                        $anchor.append($("<span class=\"" + wijgrid.options.wijCSS.icon + " " + wijgrid.options.wijCSS.iconArrowUp + "\">ascending</span>"));
                        break;
                    case "descending":
                        $anchor.append($("<span class=\"" + wijgrid.options.wijCSS.icon + " " + wijgrid.options.wijCSS.iconArrowDown + "\">descending</span>"));
                        break;
                }
            } else {
                _super.prototype._decorateHeaderContent.apply(this, arguments);
            }
        };
        c1field.prototype._prepareFilterCell = function () {
            var filterCellIndex = this.options.visLeavesIdx, wijgrid = null, filterCell = null, dataValue, editorOptions, self = this, editorType;
            if(filterCellIndex >= 0) {
                wijgrid = this._owner();
                if(this.filterRow) {
                    filterCell = $(wijmo.grid.rowAccessor.getCell(this.filterRow, filterCellIndex));
                } else {
                    throw "exception";
                }
                this.$filterEditor = filterCell.find("input");
                //the problem of inputing in the filter textbox
                filterCell.bind((($.support).selectstart ? "selectstart" : "mousedown"), function (event) {
                    event.stopPropagation();
                });
                dataValue = wijgrid._parse(this.options, wijmo.grid.filterHelper.getSingleValue(this.options.filterValue));
                // set default value
                if(dataValue === null || dataValue === "undefined") {
                    switch(wijmo.grid.getDataType(this.options)) {
                        case "boolean":
                            dataValue = false;
                            break;
                        case "number":
                        case "currency":
                        case "datetime":
                            dataValue = 0;
                            break;
                        default:
                            dataValue = "";
                    }
                }
                editorOptions = {
                    culture: wijgrid.options.culture,
                    disabled: wijgrid.options.disabled,
                    decimalPlaces: (function (pattern) {
                        // map decimal places specified within the dataFormatString option into the decimalPlaces option of the wijinputnumber.
                        var test = /^(n|p|c){1}(\d*)$/.exec(pattern);
                        if(test) {
                            if(test[2]) {
                                return parseInt(test[2], 10);
                            }
                        }
                        return 2;
                    })(this.options.dataFormatString)
                };
                // create editor
                switch(editorType = this._getInputEditorType(this.options)) {
                    case "date":
                        this.$filterEditor.wijinputdate($.extend(editorOptions, {
                            date: dataValue,
                            dateFormat: this.options.dataFormatString || undefined
                        }));
                        break;
                    case "mask":
                        this.$filterEditor.wijinputmask({
                            text: dataValue + ""
                        });
                        break;
                    case "numberCurrency":
                        this.$filterEditor.wijinputnumber($.extend(editorOptions, {
                            type: "currency",
                            value: dataValue
                        }));
                        break;
                    case "numberNumber":
                        this.$filterEditor.wijinputnumber($.extend(editorOptions, {
                            value: dataValue
                        }));
                        break;
                    case "numberPercent":
                        this.$filterEditor.wijinputnumber($.extend(editorOptions, {
                            type: "percent",
                            value: dataValue * 100
                        }));
                        break;
                    default:
                        throw wijmo.grid.stringFormat("Unsupported editor type: \"{0}\"", editorType);
                }
                // create button
                //var filterButton = filterCell.find(".filterBtn");
                filterCell.find(".wijmo-wijgrid-filter-trigger").attr(// filter button
                {
                    "role": "button",
                    "aria-haspopup": "true"
                }).bind("mouseenter." + this.widgetName, function (e) {
                    if(!self.options.disabled) {
                        $(this).addClass(wijgrid.options.wijCSS.stateHover);
                    }
                }).bind("mouseleave." + this.widgetName, function (e) {
                    if(!self.options.disabled) {
                        $(this).removeClass(wijgrid.options.wijCSS.stateHover + " " + wijgrid.options.wijCSS.stateActive);
                    }
                }).bind("mouseup." + this.widgetName, this, function (e) {
                    if(!self.options.disabled) {
                        $(this).removeClass(wijgrid.options.wijCSS.stateActive);
                    }
                }).bind("mousedown." + this.widgetName, {
                    column: this
                }, this._onFilterBtnClick).bind("click." + this.widgetName, function (e) {
                    e.preventDefault();
                })// prevent # being added to url.
                ;
            }
        };
        c1field.prototype._onFilterBtnClick = function (e) {
            var column = e.data.column, maxItemsCount = 8, wijgrid, filterOpLowerCase, applicableFilters, args, items, key, operator, width, eventUID, zIndex;
            if(column.options.disabled) {
                return false;
            }
            if(column.$dropDownFilterList) {
                // close the dropdown list
                column._removeDropDownFilterList();
                return false;
            }
            e.target.focus()//TFS #24253: In IE9, wijgrid is distorted on opening filter drop-down in a scrollable grid
            ;
            wijgrid = column._owner();
            filterOpLowerCase = wijmo.grid.filterHelper.getSingleOperatorName(column.options.filterOperator).toLowerCase();
            applicableFilters = wijgrid.getFilterOperatorsByDataType(wijmo.grid.getDataType(column.options));
            args = {
                operators: applicableFilters,
                column: column.options
            };
            wijgrid._onFilterOperatorsListShowing($.extend(true, {
            }, args));
            items = [];
            if(args.operators) {
                $.each(args.operators, function (key, operator) {
                    items.push({
                        label: operator.displayName || operator.name,
                        value: operator.name,
                        selected: operator.name.toLowerCase() === filterOpLowerCase
                    });
                });
            }
            column.$dropDownFilterList = $("<div class=\"wijmo-wijgrid-filterlist\"></div").appendTo(document.body).wijlist({
                autoSize: true,
                maxItemsCount: maxItemsCount,
                selected: function (data, arg) {
                    var filterValue, editorType;
                    switch(editorType = column._getInputEditorType(column.options)) {
                        case "date":
                            filterValue = column.$filterEditor.wijinputdate("option", "date") || new Date()// current date
                            ;
                            break;
                        case "mask":
                            filterValue = column.$filterEditor.wijinputmask("option", "text");
                            break;
                        case "numberCurrency":
                        case "numberNumber":
                        case "numberPercent":
                            filterValue = column.$filterEditor.wijinputnumber("option", "value");
                            if(editorType === "numberPercent") {
                                filterValue /= 100;
                            }
                            break;
                    }
                    column._removeDropDownFilterList();
                    wijgrid._handleFilter(column, arg.item.value, filterValue);
                }
            });
            // ** zIndex
            if($.ui && $.fn.zIndex) {
                zIndex = wijgrid.outerDiv.zIndex()// try to get zIndex of the first z-indexed element in order to display drop down list over it.
                ;
                if(zIndex) {
                    zIndex++;
                }
            }
            column.$dropDownFilterList.css("z-index", Math.max(zIndex || 0, 100))// 100 is the default value
            ;
            // zIndex **
            column.$dropDownFilterList.wijlist("setItems", items).wijlist("renderList");
            width = column.$dropDownFilterList.width() | 150;
            column.$dropDownFilterList.width(items.length > maxItemsCount ? width + 20 : width).wijlist("refreshSuperPanel").position({
                of: $(this),
                my: "left top",
                at: "left bottom"
            });
            (column.$dropDownFilterList).$button = $(this);
            eventUID = (column.$dropDownFilterList).eventUID = wijmo.grid.getUID();
            $(document).bind("mousedown." + column.widgetName + "." + eventUID, {
                column: column
            }, column._onDocMouseDown);
        };
        c1field.prototype._onDocMouseDown = function (e) {
            var $target = $(e.target), $filterList = $target.parents(".wijmo-wijgrid-filterlist:first"), $filterButton = $target.is(".wijmo-wijgrid-filter-trigger") ? $target : $target.parents(".wijmo-wijgrid-filter-trigger:first");
            if(($filterButton.length && ($filterButton[0] === e.data.column.$dropDownFilterList.$button[0])) || ($filterList.length && ($filterList[0] === e.data.column.$dropDownFilterList[0]))) {
                // do nothing
                            } else {
                e.data.column._removeDropDownFilterList();
            }
        };
        c1field.prototype._onHrefClick = function (args) {
            if(args.data.options.disabled) {
                return false;
            }
            if(args.data.options.allowSort) {
                args.data._owner()._handleSort(args.data.options, args.ctrlKey);
            }
            return false;
        };
        c1field.prototype._removeDropDownFilterList = function () {
            if(this.$dropDownFilterList) {
                var eventUID = (this.$dropDownFilterList).eventUID;
                this.$dropDownFilterList.remove();
                this.$dropDownFilterList = null;
                $(document).unbind("mousedown." + this.widgetName + "." + eventUID, this._onDocMouseDown);
            }
        };
        c1field.prototype._getInputEditorType = // "mask", "date", "numberNumber", "numberPercent", "numberCurrency"
        function (column) {
            switch(wijmo.grid.getDataType(column)) {
                case "number":
                    return (column.dataFormatString && column.dataFormatString.indexOf("p") === 0) ? "numberPercent" : "numberNumber";
                case "currency":
                    return "numberCurrency";
                case "datetime":
                    return "date";
                default:
                    return "mask";
            }
        };
        return c1field;
    })(wijmo.c1basefield);
    wijmo.c1field = c1field;
    c1field.prototype.options = $.extend(true, {
    }, wijmo.c1basefield.prototype.options, {
        aggregate: /// <summary>
        /// Causes the grid to calculate aggregate values on the column and place them in the column footer cell or group header and footer rows.
        /// If the <see cref="showFooter"/> option is disabled or grid does not contain any groups, setting the "aggregate" option has no effect.
        ///
        /// Possible values are: "none", "count", "sum", "average", "min", "max", "std", "stdPop", "var", "varPop" and "custom".
        ///
        /// "none": no aggregate is calculated or displayed.
        /// "count": count of non-empty values.
        /// "sum": sum of numerical values.
        /// "average": average of the numerical values.
        /// "min": minimum value (numerical, string, or date).
        /// "max": maximum value (numerical, string, or date).
        /// "std": standard deviation (using formula for Sample, n-1).
        /// "stdPop": standard deviation (using formula for Population, n).
        /// "var": variance (using formula for Sample, n-1).
        /// "varPop": variance (using formula for Population, n).
        /// "custom": custom value (causing grid to throw groupAggregate event).
        ///
        /// Default: "none".
        /// Type: String.
        /// Code example: $("#element").wijgrid({ columns: [{ aggregate: "none" }] });
        /// </summary>
        "none",
        allowSort: /// <summary>
        /// A value indicating whether column can be sorted.
        /// Default: true.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ columns: [{ allowSort: true }] });
        /// </summary>
        true,
        dataType: /// <summary>
        /// Column data type. Used to determine the rules for sorting, grouping, aggregate calculation, and so on.
        /// Possible values are: "string", "number", "datetime", "currency" and "boolean".
        ///
        /// "string": if using built-in parser any values are acceptable; "&nbsp;" considered as an empty string, nullString as null.
        /// "number": if using built-in parser only numeric values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
        /// "datetime": if using built-in parser only date-time values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
        /// "currency": if using built-in parser only numeric and currency values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
        /// "boolean": if using built-in parser only "true" and "false" (case-insensitive) values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
        ///
        /// Default: undefined.
        /// Type: String.
        /// Code example: $("#element").wijgrid({ columns: [{ dataType: "string" }] });
        /// </summary>
        undefined,
        dataParser: /// <summary>
        /// Data converter that is able to translate values from a string representation to column data type and back.
        ///
        /// The dataParser is an object which must contains the following methods:
        ///   parseDOM(value, culture, format, nullString): converts given DOM element into the typed value.
        ///   parse(value, culture, format, nullString): converts the value into typed value.
        ///   toStr(value, culture, format, nullString): converts the value into its string representation.
        ///
        /// Default: undefined (widget built-in parser for supported datatypes will be used).
        /// Type: Object.
        ///
        /// Code example:
        ///   var myBoolParser = {
        ///     parseDOM: function (value, culture, format, nullString) {
        ///       return this.parse(value.innerHTML, culture, format, nullString);
        ///     },
        ///
        ///     parse: function (value, culture, format, nullString) {
        ///       if (typeof (value) === "boolean")  return value;
        ///
        ///       if (!value || (value === "&nbsp;") || (value === nullString)) {
        ///         return null;
        ///       }
        ///
        ///       switch (value.toLowerCase()) {
        ///         case "on": return true;
        ///         case "off": return false;
        ///       }
        ///
        ///       return NaN;
        ///     },
        ///
        ///     toStr: function (value, culture, format, nullString) {
        ///       if (value === null)  return nullString;
        ///       return (value) ? "on" : "off";
        ///     }
        ///   }
        ///
        ///   $("#element").wijgrid({ columns: [ { dataType: "boolean", dataParser: myBoolParser } ] });
        /// </summary>
        undefined,
        dataFormatString: /// <summary>
        /// A pattern used for formatting and parsing column values. See globalize.js for possible values.
        /// The default value is undefined ("n" pattern will be used for "number" dataType, "d" for "datetime", "c" for "currency").
        /// Default: undefined.
        /// Type: String.
        /// Code example: $("#element").wijgrid({ columns: [ { dataType: "number", dataFormatString: "n" } ] });
        /// </summary>
        undefined,
        filterOperator: /// <summary>
        /// An operations set for filtering. Must be either one of the embedded operators or custom filter operator.
        /// Operator names are case insensitive.
        ///
        /// Embedded filter operators include:
        ///   "NoFilter": no filter.
        ///   "Contains": applicable to "string" data type.
        ///   "NotContain": applicable to "string" data type.
        ///   "BeginsWith": applicable to "string" data type.
        ///   "EndsWith": applicable to "string" data type.
        ///   "Equals": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
        ///   "NotEqual": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
        ///   "Greater": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
        ///   "Less": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
        ///   "GreaterOrEqual": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
        ///   "LessOrEqual": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
        ///   "IsEmpty": applicable to "string".
        ///   "NotIsEmpty": applicable to "string".
        ///   "IsNull": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
        ///   "NotIsNull": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
        ///
        /// Full option value is:
        ///   [filterOperartor1, ..., filterOperatorN]
        ///
        /// where each filter item is an object of the following kind:
        ///   { name: <operatorName>, condition: "or"|"and" }
        ///
        /// where:
        ///   name: filter operator name.
        ///   condition: logical condition to other operators, "or" is by default.
        ///
        /// Example:
        ///   filterOperator: [ { name: "Equals" }, { name: "NotEqual", condition: "and" } ]
        ///
        /// It is possible to use shorthand notation, the following statements are equivalent:
        ///   filterOperator: [ { name: "Equals" }, { name: "BeginsWith" } ]
        ///   filterOperator: [ "Equals", "BeginsWith" ]
        ///
        /// In the case of a single operator option name may contain only filter operator name, the following statements are equivalent:
        ///   filterOperator: [ { name: "Equals" } ]
        ///   filterOperator: [ "Equals" ]
        ///   filterOperator: "Equals"
        ///
        /// Note: wijgrid built-in filter editors do not support multiple filter operators.
        ///
        /// Default: "nofilter".
        /// Type: Object.
        /// Code example: $("#element").wijgrid({ columns: [ { filterOperator: "nofilter" } ] });
        /// </summary>
        "nofilter",
        filterValue: /// <summary>
        /// A value set for filtering.
        ///
        /// Full option value is:
        ///   [filterValue1, ..., filterValueN]
        ///
        /// where each item is a filter value for the corresponding filter operator.
        ///
        /// Example:
        ///  filterValue: [0, "a", "b"]
        ///
        /// Built-in filter operators support array of values as an argument.
        ///
        /// Example:
        ///   filterOperator: ["Equals", "BeginsWith"]
        ///   filterValue: [[0, 1, 2], "a"]
        ///
        ///   As a result of filtering all the records having 0, 1, 2, or starting with "a" will be fetched.
        ///
        /// Shorthand notation allows omitting square brackets, the following statements are equivalent:
        ///    filterValue: ["a"]
        ///    filterValue: [["a"]]
        ///    filterValue: "a"
        ///
        /// Note: wijgrid built-in filter editors do not support multiple filter values.
        ///
        /// Default: undefined.
        /// Type: Depends on column data type.
        /// Code example: $("#element").wijgrid({ columns: [ { filterValue: "abc" } ] });
        /// </summary>
        undefined,
        groupInfo: /// <summary>
        /// Using to customize the appearance and position of groups.
        /// Default: {
        ///   groupSingleRow: true,
        ///   collapsedImageClass: "ui-icon-triangle-1-e",
        ///   expandedImageClass: "ui-icon-triangle-1-se",
        ///   position: "none",
        ///   outlineMode: "startExpanded",
        ///   headerText: undefined,
        ///   footerText: undefined
        /// }
        /// Type: Object.
        /// Code example: $("#element").wijgrid({ columns: [{ groupInfo: { position: "header" }}] });
        /// </summary>
        {
            expandInfo: [],
            groupSingleRow: // infrastructure
            /// <summary>
            /// A value indicating whether groupings containing a single row are grouped.
            /// The default value is true.
            /// Type: Boolean.
            /// </summary>
            true,
            collapsedImageClass: /// <summary>
            /// Determines the css used to show collapsed nodes on the grid.
            /// The default value is "ui-icon-triangle-1-e".
            /// Type: String.
            /// </summary>
            $.wijmo.wijCSS.iconArrowRight,
            expandedImageClass: /// <summary>
            /// Determines the css used to show expanded nodes on the grid.
            /// The default value is "ui-icon-triangle-1-se".
            /// Type: String.
            /// </summary>
            $.wijmo.wijCSS.iconArrowRightDown,
            position: /// <summary>
            /// Determines whether the grid should insert group header and/or group footer rows for this column.
            ///
            /// Possible values are: "none", "header", "footer", "headerAndFooter".
            ///  "none" -  disables grouping for the column.
            ///  "header" - inserts header rows.
            ///  "footer" - inserts footer rows.
            ///  "headerAndFooter" - inserts header and footer rows.
            ///
            /// The default value is "none".
            /// Type: String.
            /// </summary>
            "none",
            outlineMode: /// <summary>
            /// Determines whether the user will be able to collapse and expand the groups by clicking on the group headers,
            /// and also determines whether groups will be initially collapsed or expanded.
            ///
            /// Possible values are: "none", "startCollapsed", "startExpanded".
            ///  "none" -  disables collapsing and expanding.
            ///  "startCollapsed" - groups are initially collapsed.
            ///  "startExpanded" - groups are initially expanded.
            ///
            /// The default value is "startExpanded".
            /// Type: String.
            /// </summary>
            "startExpanded",
            headerText: /// <summary>
            /// Determines the text that is displayed in the group header rows.
            ///
            /// The text may include up to three placeholders:
            /// "{0}" is replaced with the value being grouped on.
            /// "{1}" is replaced with the group's column header.
            /// "{2}" is replaced with the aggregate
            ///
            /// The text may be set to "custom". Doing so causes the grid groupText event to be raised when
            /// processing a grouped header.
            ///
            /// The default value is undefined.
            /// Type: String.
            /// </summary>
            undefined,
            footerText: /// <summary>
            /// Determines the text that is displayed in the group footer rows.
            ///
            /// The text may include up to three placeholders:
            /// "{0}" is replaced with the value being grouped on.
            /// "{1}" is replaced with the group's column header.
            /// "{2}" is replaced with the aggregate
            ///
            /// The text may be set to "custom". Doing so causes the grid groupText event to be raised when
            /// processing a grouped footer.
            ///
            /// The default value is undefined.
            /// Type: String.
            /// </summary>
            undefined
        },
        readOnly: /// <summary>
        /// A value indicating whether the cells in the column can be edited.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ columns: [ { readOnly: false } ] });
        /// </summary>
        false,
        rowMerge: /// <summary>
        /// Determines whether rows are merged.
        /// Possible values are: "none", "free" and "restricted".
        ///
        /// "none": no row merging.
        /// "free": allows row with identical text to merge.
        /// "restricted": keeps rows with identical text from merging if rows in the previous column are merged.
        ///
        /// Default: "none".
        /// Type: String.
        /// Code example: $("#element").wijgrid({ columns: [{ rowMerge: "none" }] });
        /// </summary>
        "none",
        showFilter: /// <summary>
        /// A value indicating whether filter editor will be shown in the filter row.
        /// Default: true.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ columns: [ { showFilter: true } ] });
        /// </summary>
        true,
        sortDirection: /// <summary>
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
        "none",
        valueRequired: /// <summary>
        /// A value indicating whether null value is allowed during editing.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ columns: [ { valueRequired: false } ] });
        /// </summary>
        false
    });
    $.wijmo.registerWidget("c1field", $.wijmo.c1basefield, c1field.prototype);
})(wijmo || (wijmo = {}));

var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="c1basefield.ts"/>
/// <reference path="interfaces.ts"/>
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery;
    var c1band = (function (_super) {
        __extends(c1band, _super);
        function c1band() {
            _super.apply(this, arguments);

        }
        c1band.prototype._create = function () {
            _super.prototype._create.apply(this, arguments);
            var wijgrid = this._owner();
            this.element.addClass(wijgrid.options.wijCSS.widget + " wijmo-c1band");
        };
        c1band.prototype._canDropTo = function (wijField) {
            if(_super.prototype._canDropTo.apply(this, arguments)) {
                //band can't be dropped into group area
                return !(wijField instanceof $.wijmo.c1groupedfield);
            }
            return false;
        };
        return c1band;
    })(wijmo.c1basefield);
    wijmo.c1band = c1band;
    c1band.prototype.options = $.extend(true, {
    }, wijmo.c1basefield.prototype.options, {
        columns: /// <summary>
        /// Gets a array of objects representing the columns of the band.
        /// The default value is an empty array.
        /// Type: Array.
        /// </summary>
        []
    });
    $.wijmo.registerWidget("c1band", $.wijmo.c1basefield, c1band.prototype);
})(wijmo || (wijmo = {}));

var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="c1basefield.ts"/>
/// <reference path="interfaces.ts"/>
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery;
    var c1groupedfield = (function (_super) {
        __extends(c1groupedfield, _super);
        function c1groupedfield() {
            _super.apply(this, arguments);

        }
        c1groupedfield.prototype._create = function () {
            var wijgrid = $.data(this.element[0], "wijgridowner");
            this._field("owner", wijgrid);
            wijmo.grid.widgetName(this.element[0], this.widgetFullName);
            this._destroyed = false;
            this.element.addClass("wijmo-wijgrid-group-button " + wijgrid.options.wijCSS.stateDefault + " " + wijgrid.options.wijCSS.cornerAll);
            if(this.options.disabled) {
                this.disable();
            }
            if(wijgrid.options.allowColMoving) {
                wijgrid._dragndrop(true).attach(this);
            }
        };
        c1groupedfield.prototype._init = function () {
            this._refreshHeaderCell();
        };
        c1groupedfield.prototype.destroy = function () {
            try  {
                _super.prototype.destroy.apply(this, arguments);
            }finally {
                this._destroyed = true;
            }
        };
        c1groupedfield.prototype._destroy = function () {
            if(this._isDestroyed()) {
                return;
            }
            this.element.find("*").unbind("." + this.widgetName);
            var wijgrid = this._owner();
            if(wijgrid && wijgrid._dragndrop(false)) {
                wijgrid._dragndrop(false).detach(this);
            }
            wijmo.grid.remove$dataByPrefix(this.element, this._data$prefix);
        };
        c1groupedfield.prototype._field = function (name, value) {
            return wijmo.grid.dataPrefix(this.element, this._data$prefix, name, value);
        };
        c1groupedfield.prototype._removeField = function (name) {
            var internalDataName = this._data$prefix + name;
            this.element.removeData(internalDataName);
        };
        c1groupedfield.prototype._setOption = function (key, value) {
            var presetFunc = this["_preset_" + key], oldValue = this.options[key], optionChanged, postsetFunc;
            if(presetFunc !== undefined) {
                value = presetFunc.apply(this, [
                    value,
                    oldValue
                ]);
            }
            optionChanged = (value !== oldValue);
            //$.Widget.prototype._setOption.apply(this, arguments);  note: there is no dynamic linkage between the arguments and the formal parameter values when strict mode is used
            _super.prototype._setOption.apply(this, [
                key,
                value
            ]);
            if(optionChanged) {
                postsetFunc = this["_postset_" + key];
                if(postsetFunc !== undefined) {
                    postsetFunc.apply(this, [
                        value,
                        oldValue
                    ]);
                }
            }
        };
        c1groupedfield.prototype._postset_headerText = function (value, oldValue, isInvokedOutside) {
            this._refreshHeaderCell();
        };
        c1groupedfield.prototype._postset_allowSort = function (value, oldValue, isInvokedOutside) {
            this._refreshHeaderCell();
        };
        c1groupedfield.prototype._owner = function () {
            return this._field("owner");
        };
        c1groupedfield.prototype._canSize = function () {
            return this.options.allowSizing && this._owner().options.allowColSizing;
        };
        c1groupedfield.prototype._canDrag = // drag-n-drop
        function () {
            return this.options.allowMoving === true;
        };
        c1groupedfield.prototype._canDropTo = function (wijField) {
            //band can't be dropped into group area
            if(!(wijField instanceof $.wijmo.c1groupedfield)) {
                return false;
            }
            // parent can't be dropped into a child
            if(wijmo.grid.isChildOf(this._owner().options.columns, wijField, this)) {
                return false;
            }
            return true;
        };
        c1groupedfield.prototype._canSort = function () {
            var grid = this._owner();
            return (grid && grid.options.allowSorting && this.options.allowSort && (this.options.dataIndex >= 0));
        };
        c1groupedfield.prototype._refreshHeaderCell = function () {
            var wijCSS = this._owner().options.wijCSS, $closeButton = $("<span class=\"wijmo-wijgrid-group-button-close " + wijCSS.stateDefault + " " + wijCSS.cornerAll + "\"><span class=\"" + wijCSS.icon + " " + wijCSS.iconClose + "\"></span></span>").bind("click." + this.widgetName, this, this._onCloseClick);
            this.element.html(this.options.headerText || "").prepend(// html(value) returns "" if value is undefined
            $closeButton).bind("click." + this.widgetName, this, $.proxy(this._onHrefClick, this));
            if(this._canSort()) {
                switch(this.options.sortDirection) {
                    case // sorting icon
                    "ascending":
                        this.element.append($("<span class=\"wijmo-wijgrid-group-button-sort " + wijCSS.icon + " " + wijCSS.iconArrowUp + "\"></span>"));
                        break;
                    case "descending":
                        this.element.append($("<span class=\"wijmo-wijgrid-group-button-sort " + wijCSS.icon + " " + wijCSS.iconArrowDown + "\"></span>"));
                        break;
                }
            }
        };
        c1groupedfield.prototype._onCloseClick = function (args) {
            var options = args.data.options;
            if(!options.disabled) {
                args.data._owner()._handleUngroup(args.data.options.travIdx);
            }
            return false;
        };
        c1groupedfield.prototype._onHrefClick = function (args) {
            var wijgrid = args.data._owner(), options = args.data.options, column;
            if(!options.disabled && options.allowSort) {
                //find the column according to the c1groupedfield widget
                column = wijmo.grid.search(wijgrid.columns(), function (test) {
                    return test.options.travIdx === options.travIdx;
                });
                column = (!column.found) ? // grouped column is invisible?
                wijmo.grid.getColumnByTravIdx(wijgrid.options.columns, options.travIdx).found : column.found.options;
                if(column) {
                    wijgrid._handleSort(column, args.ctrlKey);
                }
            }
            return false;
        };
        c1groupedfield.prototype._isDestroyed = function () {
            return this._destroyed;
        };
        return c1groupedfield;
    })(wijmo.wijmoWidget);
    wijmo.c1groupedfield = c1groupedfield;
    c1groupedfield.prototype._data$prefix = "c1groupedfield";
    c1groupedfield.prototype.options = $.extend(true, {
    }, wijmo.JQueryUIWidget.prototype.options, {
        wijMobileCSS: {
            header: "ui-header ui-bar-a",
            content: "ui-body-c",
            stateDefault: "ui-btn-up-c",
            stateHover: "ui-btn-down-c",
            stateActive: "ui-btn-down-c"
        },
        allowMoving: /// <summary>
        /// A value indicating whether the column can be moved.
        /// Default: true.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ columns: [ { allowMoving: true } ] });
        /// </summary>
        true,
        allowSort: /// <summary>
        /// A value indicating whether column can be sorted.
        /// Default: true.
        /// Type: Boolean.
        /// Code example: $("#element").wijgrid({ columns: [{ allowSort: true }] });
        /// </summary>
        true,
        headerText: /// <summary>
        /// Gets or sets the header text.
        /// Default: undefined.
        /// Type: String.
        /// Code example: $("#element").wijgrid({ columns: [ { headerText: "column0" } ] });
        /// </summary>
        /// <remarks>
        /// If the value is undefined the header text will be determined automatically depending on the type of the datasource:
        ///  DOM table - text in the header cell.
        ///  Array of hashes - dataKey (name of the field associated with column).
        ///  Two-dimensional array - dataKey (index of the field associated with column).
        /// </remarks>
        undefined,
        sortDirection: /// <summary>
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
        "none"
    });
    $.wijmo.registerWidget("c1groupedfield", c1groupedfield.prototype);
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var bandProcessor = (function () {
            function bandProcessor() { }
            bandProcessor.prototype.generateSpanTable = function (root, leaves) {
                this._height = this._width = this._inc = this._shift = 0;
                this._table = [];
                this._traverseList = [];
                this._savedXPos = [];
                var spanTable = this._generateSpanTable(root, leaves, true);
                return spanTable;
            };
            bandProcessor.prototype._generateSpanTable = function (root, leaves, parentVisibility) {
                var i, j, self = this;
                this._height = this.getVisibleHeight(root, parentVisibility);
                leaves = leaves || [];
                wijmo.grid.traverse(root, function (column) {
                    if(column.isLeaf) {
                        leaves.push(column);
                    }
                    self._traverseList.push(column);
                });
                this._width = leaves.length;
                for(i = 0; i < this._height; i++) {
                    this._table[i] = [];
                    for(j = 0; j < this._width; j++) {
                        this._table[i][j] = {
                            column: null,
                            colSpan: 0,
                            rowSpan: 0
                        };
                    }
                }
                this._setTableValues(root, 0, 0);
                return this._table;
            };
            bandProcessor.prototype.getVisibleHeight = function (root, parentVisibility) {
                var i, len, colVis, tmp, result = 0;
                if($.isArray(root)) {
                    // columns
                    for(i = 0 , len = root.length; i < len; i++) {
                        tmp = this.getVisibleHeight(root[i], parentVisibility);
                        result = Math.max(result, tmp);
                    }
                } else {
                    // column
                    colVis = (root.visible === undefined) ? true : root.visible;
                    root.parentVis = colVis && parentVisibility;
                    if(root.isBand) {
                        // band
                        for(i = 0 , len = root.columns.length; i < len; i++) {
                            tmp = this.getVisibleHeight(root.columns[i], root.parentVis);
                            result = Math.max(result, tmp);
                        }
                        if(!root.parentVis) {
                            return result;
                        }
                        root.isLeaf = (result === 0);
                        result++;
                    } else {
                        // general column
                        root.isLeaf = true;
                        if(root.parentVis) {
                            result = 1;
                        }
                    }
                }
                return result;
            };
            bandProcessor.prototype._getVisibleParent = function (column) {
                while(column) {
                    column = this._traverseList[column.parentIdx];
                    if(column && (column.parentVis || column.parentVis === undefined)) {
                        return column;
                    }
                }
                return null;
            };
            bandProcessor.prototype._setTableValues = function (root, y, x) {
                var i, len, tx, posX, parentIsLeaf, visibleParent;
                if($.isArray(root)) {
                    //
                    for(i = 0 , len = root.length; i < len; i++) {
                        this._setTableValues(root[i], y, x);
                    }
                } else {
                    // column
                    if(root.travIdx === undefined) {
                        throw "undefined travIdx";
                    }
                    tx = x + this._shift;
                    if(root.parentVis) {
                        posX = tx + this._inc;
                        this._table[y][posX].column = root;
                        this._savedXPos[root.travIdx] = posX;
                    }
                    if(root.isBand) {
                        // band
                        for(i = 0 , len = root.columns.length; i < len; i++) {
                            this._setTableValues(root.columns[i], y + 1, x);
                        }
                    }
                    if(root.parentVis) {
                        if(this._shift - tx === 0) {
                            //root is column or band without visible nodes
                            this._table[y][this._savedXPos[root.travIdx]].rowSpan = this._height - y;
                            this._shift++;
                        } else {
                            // band with visible nodes
                            this._table[y][this._savedXPos[root.travIdx]].colSpan = this._shift - tx;
                        }
                    } else {
                        if(!root.isBand && this._height > 0) {
                            visibleParent = this._getVisibleParent(root);
                            parentIsLeaf = (visibleParent) ? visibleParent.isLeaf : false;
                            if(parentIsLeaf) {
                                this._inc++;
                            }
                            if(y >= this._height) {
                                y = this._height - 1;
                            }
                            posX = x + this._shift + this._inc;
                            this._table[y][posX].column = root;
                            if(!parentIsLeaf) {
                                if(visibleParent && (this._savedXPos[visibleParent.travIdx] === posX)) {
                                    this._shiftTableElements(posX, y);
                                }
                                this._inc++;
                            }
                        }
                    }
                }
            };
            bandProcessor.prototype._shiftTableElements = function (x, untilY) {
                var i;
                for(i = 0; i < untilY; i++) {
                    this._table[i][x + 1] = this._table[i][x];
                    this._table[i][x] = {
                        column: null,
                        colSpan: 0,
                        rowSpan: 0
                    };
                    if(this._table[i][x + 1].column) {
                        this._savedXPos[this._table[i][x + 1].column.travIdx]++;
                    }
                }
            };
            return bandProcessor;
        })();
        grid.bandProcessor = bandProcessor;
        /// returns both visible and invisible leaves.
        function getAllLeaves(columns) {
            var leaves = [];
            _getAllLeaves(columns, leaves);
            return leaves;
        }
        grid.getAllLeaves = getAllLeaves;
        function _getAllLeaves(columns, leaves) {
            var i, len, column, subColumns;
            if(columns) {
                for(i = 0 , len = columns.length; i < len; i++) {
                    column = columns[i];
                    if(column.options) {
                        // widget
                        column = column.options;
                    }
                    subColumns = column.columns;
                    if(subColumns && subColumns.length) {
                        _getAllLeaves(subColumns, leaves);
                    } else {
                        leaves.push(column);
                    }
                }
            }
        }
        // returns null or { found (object), at (array) } object.
        function getColumnByTravIdx(columns, travIdx) {
            var i, len, column, result = null;
            if(columns && travIdx >= 0) {
                for(i = 0 , len = columns.length; i < len && !result; i++) {
                    column = columns[i];
                    if(column.options) {
                        // widget
                        column = column.options;
                    }
                    if(column.travIdx === travIdx) {
                        return {
                            found: column,
                            at: columns
                        };
                    }
                    if(column.columns) {
                        result = this.getColumnByTravIdx(column.columns, travIdx);
                    }
                }
            }
            return result;
        }
        grid.getColumnByTravIdx = getColumnByTravIdx;
        function isChildOf(columns, child, parent) {
            if(child.options) {
                child = child.options;
            }
            if(parent.options) {
                parent = parent.options;
            }
            if(parent.isBand && child.parentIdx >= 0) {
                if(child.parentIdx === parent.travIdx) {
                    return true;
                }
                if(child.parentIdx > parent.travIdx) {
                    var traverse = this.flatten(columns);
                    while(true) {
                        child = traverse[child.parentIdx];
                        if(child.travIdx === parent.travIdx) {
                            return true;
                        }
                        if(child.parentIdx === -1) {
                            break;
                        }
                    }
                }
            }
            return false;
        }
        grid.isChildOf = isChildOf;
        function getLeaves(columns) {
            var leaves = [];
            _getLeaves(columns, leaves);
            return leaves;
        }
        grid.getLeaves = getLeaves;
        function _getLeaves(columns, leaves) {
            var i, len, column;
            if(columns) {
                for(i = 0 , len = columns.length; i < len; i++) {
                    column = columns[i];
                    if(column.isLeaf) {
                        leaves.push(column);
                    }
                    if(column.columns) {
                        _getLeaves(column.columns, leaves);
                    }
                }
            }
        }
        function setTraverseIndex(columns) {
            return _setTraverseIndex(columns, 0, -1);// -> columns length

        }
        grid.setTraverseIndex = setTraverseIndex;
        function _setTraverseIndex(columns, idx, parentIdx) {
            var i, len, column;
            if(columns) {
                for(i = 0 , len = columns.length; i < len; i++) {
                    column = columns[i];
                    if(column.options) {
                        // widget
                        column = column.options;
                    }
                    column.linearIdx = i;
                    column.travIdx = idx++;
                    column.parentIdx = parentIdx;
                    if(column.columns) {
                        idx = _setTraverseIndex(column.columns, idx, idx - 1);
                    }
                }
            }
            return idx;
        }
        function flatten(columns) {
            var result = [];
            wijmo.grid.traverse(columns, function (column) {
                result.push(column);
            });
            return result;
        }
        grid.flatten = flatten;
                        function traverse(columns, callback) {
            var i, len, column;
            if(columns && ($.isFunction(callback))) {
                for(i = 0; i < columns.length; i++) {
                    column = columns[i];
                    if(column.options) {
                        // widget
                        column = column.options;
                    }
                    len = columns.length;
                    callback(column, columns);
                    if(columns.length !== len) {
                        // backoff
                        i--;
                        continue;
                    }
                    if(column.columns) {
                        // go deeper
                        wijmo.grid.traverse(column.columns, callback);
                    }
                }
            }
        }
        grid.traverse = traverse;
        //export function getAriaHeaders(visibleLeaves: wijmo.grid.IColumn[], traverseList): string[] {
        //	var i, len, leaf, value, result = [];
        //	for (i = 0, len = visibleLeaves.length; i < len; i++) {
        //		leaf = visibleLeaves[i];
        //		value = "";
        //		do {
        //			value += (<any>window).escape(leaf.headerText) + " ";
        //		} while ((leaf = traverseList[leaf.parentIdx])/*&& leaf.parentVis*/);
        //		result[i] = $.trim(value);
        //	}
        //	return result;
        //}
            })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    /// <reference path="filterOperators.ts"/>
    /// <reference path="../../../data/src/dataView.ts"/>
    /// <reference path="../../../data/src/filtering.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var settingsManager = (function () {
            function settingsManager(wijgrid) {
                this._dvFilteringSettings = undefined;
                this._dvPagingSettings = undefined;
                this._dvSortingSettings = undefined;
                this._wgFilteringSettings = undefined;
                this._wgPagingSettings = undefined;
                this._wgSortingSettings = undefined;
                if(!wijgrid) {
                    throw "exception";
                }
                this._wijgrid = wijgrid;
                this._dataView = wijgrid._dataViewWrapper.dataView();
                this._filterCache = new wijmo.grid.filterOperatorsCache(wijgrid);
            }
            settingsManager.prototype.compareSettings = function () {
                var result = true, a, b, i, len;
                // paging
                result = ((a = this.DVPagingSettings()) === (b = this.WGPagingSettings()));
                if(!result && a && b) {
                    result = (a.pageSize === b.pageSize && a.pageIndex === b.pageIndex);
                }
                // sorting
                if(result) {
                    result = ((a = this.DVSortingSettings()) === (b = this.WGSortingSettings()));
                    if(!result && a && b && ((len = a.length) === b.length)) {
                        result = true;
                        for(i = 0; i < len && result; i++) {
                            result = ((a[i].dataKey === b[i].dataKey) && (a[i].sortDirection === b[i].sortDirection));
                        }
                    }
                }
                // filtering
                if(result) {
                    a = this.DVFilteringSettings();
                    b = this.WGFilteringSettings();
                    result = wijmo.grid.compareObj(a, b);
                }
                return result;
            };
            settingsManager.prototype.DVFilteringSettings = function () {
                function traverse(filter, normalizedItem) {
                    var condition;
                    $.each(filter, function (i, item) {
                        if(typeof (item) === "string") {
                            // "or"\ "and"
                            condition = item;
                        } else {
                            if($.isArray(item)) {
                                traverse(item, normalizedItem);
                            } else {
                                // single filter object - { property, operator, value }
                                normalizedItem.filterValue.push(item.value);
                                normalizedItem.filterOperator.push({
                                    name: item.operator,
                                    condition: condition
                                });
                            }
                        }
                    });
                }
                if(this._dvFilteringSettings === undefined) {
                    var foo = [], filter = this._dataView.filter();
                    if(filter) {
                        $.each(filter, function (dataKey, item) {
                            var normalizedItem = {
                                dataKey: dataKey
                            };
                            if($.isArray(item)) {
                                normalizedItem.filterValue = [];
                                normalizedItem.filterOperator = [];
                                traverse(item, normalizedItem);
                            } else if($.isPlainObject(item)) {
                                normalizedItem.filterValue = item.value;
                                normalizedItem.filterOperator = item.operator || "Equals";
                            } else {
                                normalizedItem.filterValue = item;
                                normalizedItem.filterOperator = "Equals";
                            }
                            foo.push(normalizedItem);
                        });
                    }
                    this._dvFilteringSettings = (foo.length) ? foo : null;
                }
                return this._dvFilteringSettings;
            };
            settingsManager.prototype.DVPagingSettings = function () {
                if(this._dvPagingSettings === undefined) {
                    var pageableDataView = wijmo.grid.asPagedDataView(this._dataView);
                    if(pageableDataView) {
                        var pageSize = pageableDataView.pageSize();
                        this._dvPagingSettings = (pageSize > 0) ? {
                            pageSize: pageableDataView.pageSize(),
                            pageIndex: pageableDataView.pageIndex()
                        } : null;
                    }
                }
                return this._dvPagingSettings;
            };
            settingsManager.prototype.DVSortingSettings = function () {
                if(this._dvSortingSettings === undefined) {
                    var foo = [];
                    if(true/*this._dataView.canSort()*/ ) {
                        var sortDescription = wijmo.data.sorting.compile(this._dataView.sort()).normalized;
                        if(sortDescription) {
                            $.each(sortDescription, function (key, prop) {
                                if(prop !== null) {
                                    foo.push({
                                        dataKey: (typeof (prop) === "string") ? prop : prop.property,
                                        sortDirection: prop.asc || prop.asc === undefined ? "ascending" : "descending"
                                    });
                                }
                            });
                        }
                    }
                    this._dvSortingSettings = (foo.length) ? foo : null;
                }
                return this._dvSortingSettings;
            };
            settingsManager.prototype.WGFilteringSettings = function () {
                if(this._wgFilteringSettings === undefined) {
                    var foo = [], leaves = this._wijgrid._field("leaves"), self = this;
                    if(leaves) {
                        $.each(leaves, function (key, leaf) {
                            if(wijmo.grid.validDataKey(leaf.dataKey) && leaf.filterOperator) {
                                var fvToVerify = (wijmo.grid.deepExtend({
                                }, {
                                    foo: leaf.filterValue
                                })).foo, fopToVerify = // to avoid string values reconstruction ("abc" -> ["a", "b", "c"])
                                (wijmo.grid.deepExtend({
                                }, {
                                    foo: leaf.filterOperator
                                })).foo, verifiedFop = wijmo.grid.filterHelper.verify(fopToVerify, fvToVerify, leaf.dataType, self._filterCache);
                                if(verifiedFop) {
                                    foo.push({
                                        dataKey: leaf.dataKey,
                                        filterValue: verifiedFop.filterValue,
                                        filterOperator: verifiedFop.filterOperator
                                    });
                                }
                            }
                        });
                    }
                    this._wgFilteringSettings = (foo.length) ? foo : null;
                }
                return this._wgFilteringSettings;
            };
            settingsManager.prototype.WGPagingSettings = function () {
                if(this._wgPagingSettings === undefined) {
                    this._wgPagingSettings = this._wijgrid.options.allowPaging ? {
                        pageSize: this._wijgrid.options.pageSize,
                        pageIndex: this._wijgrid.options.pageIndex
                    } : null;
                }
                return this._wgPagingSettings;
            };
            settingsManager.prototype.WGSortingSettings = function () {
                if(this._wgSortingSettings === undefined) {
                    var foo = [], leaves = this._wijgrid._field("leaves");
                    if(this._wijgrid.options.allowSorting) {
                        if(leaves) {
                            $.each(leaves, function (key, leaf) {
                                if(!leaf.isBand && leaf.allowSort && wijmo.grid.validDataKey(leaf.dataKey)) {
                                    if(leaf.groupInfo && (leaf.groupInfo.position !== "none") && (leaf.sortDirection === "none")) {
                                        leaf.sortDirection = "ascending"// use "ascending" for grouped columns by default
                                        ;
                                    }
                                    if(leaf.sortDirection === "ascending" || leaf.sortDirection === "descending") {
                                        foo.push({
                                            dataKey: leaf.dataKey,
                                            sortDirection: leaf.sortDirection,
                                            sortOrder: leaf.sortOrder || 0
                                        });
                                    }
                                }
                            });
                        }
                        if(foo.length) {
                            foo.sort(function (a, b) {
                                return a.sortOrder - b.sortOrder;
                            });
                            $.each(foo, function (idx, item) {
                                delete item.sortOrder;
                            });
                        }
                    }
                    this._wgSortingSettings = (foo.length) ? foo : null;
                }
                return this._wgSortingSettings;
            };
            settingsManager.prototype.MapWGToDV = function () {
                var result = {
                }, foo, newDVFilterOption;
                // * paging *
                if(this._mapPagingParams() && (foo = this.WGPagingSettings())) {
                    result.pageIndex = foo.pageIndex;
                    result.pageSize = foo.pageSize;
                } else {
                    result.pageSize = -1// cancel paging
                    ;
                }
                // ** sorting
                if(this._mapSortingParams()) {
                    result.sort = []// clear sorting
                    ;
                    if(foo = this.WGSortingSettings()) {
                        result.sort = [];
                        $.each(foo, function (key, o) {
                            result.sort.push({
                                property: o.dataKey,
                                asc: o.sortDirection === "ascending"
                            });
                        });
                    }
                }
                // sorting **
                // ** filtering
                if(this._mapFilteringParams()) {
                    result.filter = {
                    };
                    // set filtering
                    if(foo = this.WGFilteringSettings()) {
                        result.filter = this._convertFilterToDV(foo);
                    }
                    if($.isEmptyObject(result.filter)) {
                        result.filter = null// must be null to clear filtering.
                        ;
                    }
                }
                // filtering **
                return result;
            };
            settingsManager.prototype.MapDVToWG = function () {
                var foo, leavesByDataKey = {
                }, mapSortingParams = this._mapSortingParams(), mapPagingParams = this._mapPagingParams(), mapFilteringParams = this._mapFilteringParams(), pagedDataView = wijmo.grid.asPagedDataView(this._dataView);
                $.each(this._wijgrid._field("leaves"), function (key, leaf) {
                    // clear sorting
                    if(mapSortingParams) {
                        leaf.sortOrder = 0;
                        leaf.sortDirection = "none";
                    }
                    // clear filtering
                    if(mapFilteringParams) {
                        leaf.filterOperator = "nofilter";
                        leaf.filterValue = undefined;
                    }
                    leavesByDataKey[leaf.dataKey] = leaf;
                });
                if(mapPagingParams && pagedDataView) {
                    this._wijgrid.options.pageSize = pagedDataView.pageSize();
                    this._wijgrid.options.pageIndex = pagedDataView.pageIndex();
                }
                if(mapSortingParams && (foo = this.DVSortingSettings())) {
                    $.each(foo, function (idx, o) {
                        var leaf;
                        if((leaf = leavesByDataKey[o.dataKey])) {
                            leaf.sortDirection = o.sortDirection;
                            leaf.sortOrder = idx// restore sort order
                            ;
                        }
                    });
                }
                if(mapFilteringParams && (foo = this.DVFilteringSettings())) {
                    $.each(foo, function (key, o) {
                        var leaf;
                        if((leaf = leavesByDataKey[o.dataKey])) {
                            leaf.filterValue = o.filterValue;
                            leaf.filterOperator = o.filterOperator;
                            if($.isPlainObject(leaf.filterOperator)) {
                                // custom operator, convert operator object to operator name.
                                leaf.filterOperator = leaf.filterOperator.name;
                            }
                        }
                    });
                }
            };
            settingsManager.prototype._mapPagingParams = function () {
                return this._wijgrid.options.allowPaging && !this._wijgrid._customPagingEnabled() && !this._wijgrid._serverShaping();// used by c1gridview. Disable client paging because source data are paged already and contains items of the current page only.

            };
            settingsManager.prototype._mapSortingParams = function () {
                return this._wijgrid.options.allowSorting && !this._wijgrid._serverShaping();// used by c1gridview. Disable client sorting because source data are sorted already.

            };
            settingsManager.prototype._mapFilteringParams = function () {
                return !this._wijgrid._serverShaping();// used by c1gridview. Disable client filtering because source data are filtered already.

            };
            settingsManager.prototype._convertFilterToDV = // conversion from wijgrid format
            function (normalizedFilter) {
                var result = {
                }, manager = this;
                $.each(normalizedFilter, function (i, group) {
                    var prop = group.dataKey, currConds = [], currConn = "and", conn, fos, fvs, fv, conds;
                    if(!$.isPlainObject(group)) {
                        return;
                    }
                    fos = group.filterOperator;
                    fvs = group.filterValue;
                    if(fos == null) {
                        return;
                    }
                    if(!$.isArray(fos)) {
                        fos = [
                            fos
                        ];
                    }
                    if(!$.isArray(fvs)) {
                        fvs = [
                            fvs
                        ];
                    }
                    if(fos.length != fvs.length) {
                        throw "The number of filter operators must match the number of filter values";
                    }
                    if(fos.length == 0) {
                        return;
                    }
                    $.each(fos, function (i, fo) {
                        if(typeof (fo) === "string") {
                            fo = {
                                name: fo
                            };
                        }
                        if(!$.isPlainObject(fo) || !fo.name) {
                            throw "Invalid filter operator";
                        }
                        fv = fvs[i];
                        if(!$.isArray(fv)) {
                            fv = [
                                fv
                            ];
                        }
                        conds = $.map(fv, function (operand) {
                            var cond = {
                                property: prop,
                                operator: fo.name,
                                value: operand
                            };
                            var internalFop = manager._filterCache.getByNameInt(fo.name);
                            if(internalFop.isCustom) {
                                // replace operator name with the operator object
                                var customOp = $.extend(true, {
                                }, internalFop.op);
                                if($.isFunction(customOp.operator)) {
                                    (customOp).apply = customOp.operator// wijmo.data requires "apply" function instead of "operator"// wijmo.data requires "apply" function instead of "operator"
                                    ;
                                }
                                cond.operator = customOp;
                            }
                            //normalizePerPropCondition(prop, cond);
                            return cond;
                        });
                        function adjustConds() {
                            if(conds.length > 1) {
                                conds.splice(0, 0, "or");
                            } else {
                                conds = conds[0];
                            }
                        }
                        function adjustCurrConds() {
                            if(currConn == null) {
                                currConn = conn;
                                currConds.splice(0, 0, conn);
                            }
                        }
                        currConn = null;
                        conn = fo.condition || "or";
                        if(currConds.length <= 1 || currConn == conn) {
                            if(conds.length == 1 || currConds.length <= 1 || currConn == "or") {
                                currConds = currConds.concat(conds);
                                adjustCurrConds();
                            } else {
                                adjustConds();
                                currConds.push(conds);
                                adjustCurrConds();
                            }
                        } else {
                            adjustConds();
                            currConds = [
                                currConds,
                                conds
                            ];
                            adjustCurrConds();
                        }
                    });
                    $.each(currConds, function (j, cond) {
                        if($.isArray(cond) && cond.length == 2) {
                            currConds[j] = cond[1];
                        }
                    });
                    if(currConds.length == 2 && typeof (currConds[0] === "string")) {
                        currConds.shift();
                    }
                    if(currConds.length == 1) {
                        currConds = currConds[0]// unwrap single filter
                        ;
                    }
                    result[prop] = currConds;
                })// $.each(normalizedFilter)
                ;
                return result;
            };
            return settingsManager;
        })();
        grid.settingsManager = settingsManager;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="../../../data/src/dataView.ts"/>
    /// <reference path="../data/dataViewAdapter.ts"/>
    /// <reference path="interfaces.ts"/>
    /// <reference path="misc.ts"/>
    /// <reference path="wijgrid.ts"/>
    /// <reference path="settingsManager.ts"/>
    /// <reference path="htmlTableAccessor.ts"/>
    /// <reference path="tally.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var dataViewWrapper = (function () {
            function dataViewWrapper(wijgrid) {
                this._domSource = null;
                this._ignoreAllEvents = false;
                this._ignoreChangeEvent = false;
                this._ignoreCurrentChangedEvent = false;
                this._sharedDataItems = [];
                this._userData = null;
                this._totals = {
                };
                this._changeTimer = 0;
                this._toDispose = [];
                this._isOwnDataView = false;
                this._isWijdatasource = false;
                this._isDynamicWijdatasource = false;
                this._wijgrid = wijgrid;
                this._createDataViewWrapper()// set _dataView
                ;
            }
            dataViewWrapper.prototype.data = function () {
                var dataView = this._getDataViewInst(), pagedDataView = wijmo.grid.asPagedDataView(dataView);
                return {
                    data: this._sharedDataItems,
                    totalRows: // totalRows: dataView().length,
                    pagedDataView != null ? pagedDataView.totalItemCount() : (dataView.getSource() || []).length,
                    totals: this._totals,
                    emptyData: this.isBoundedToDOM() ? this._domSource.emptyData : null
                };
            };
            dataViewWrapper.prototype.dataView = function () {
                return this._getDataViewInst();
            };
            dataViewWrapper.prototype.dispose = function () {
                var dataView = this._getDataViewInst();
                this._propChangeListener.dispose();
                $.each(this._toDispose, function (_, disposable) {
                    disposable.dispose();
                });
                if(dataView && this._isOwnDataView) {
                    dataView.dispose();
                }
                this._wijgrid._wijDataView = null;
            };
            dataViewWrapper.prototype.ignoreChangeEvent = function (value) {
                if(arguments.length) {
                    this._ignoreChangeEvent = (value === true);
                } else {
                    return this._ignoreChangeEvent;
                }
            };
            dataViewWrapper.prototype.ignoreCurrentChangedEvent = function (value) {
                if(arguments.length) {
                    this._ignoreCurrentChangedEvent = (value === true);
                } else {
                    return this._ignoreCurrentChangedEvent;
                }
            };
            dataViewWrapper.prototype.isDataLoaded = function () {
                var dataView = this._getDataViewInst();
                return dataView.isLoaded();
            };
            dataViewWrapper.prototype.isOwnDataView = function () {
                return this._isOwnDataView;
            };
            dataViewWrapper.prototype.getFieldsInfo = function () {
                var dataView = this._getDataViewInst(), props = dataView.getProperties(), result = {
                };
                $.each(props, function (_, prop) {
                    result[prop.name] = {
                        name: prop.name,
                        type: //readonly: "readOnly" in prop ? col.readOnly : false,
                        prop.type || "string"
                    };
                    //format: col && col.format || ""
                                    });
                return result;
            };
            dataViewWrapper.prototype.isBoundedToDOM = function () {
                return this._domSource !== null;
            };
            dataViewWrapper.prototype.load = function (userData) {
                this._userData = userData;
                var dataView = this._getDataViewInst();
                if(!dataView) {
                    this._createDataViewWrapper();
                    dataView = this._getDataViewInst();
                }
                this._onDataViewLoading();
                var sm = new wijmo.grid.settingsManager(this._wijgrid);
                if(this._needToLoad(sm)) {
                    var loadParams = sm.MapWGToDV(), local = false;
                    if(this._isWijdatasource && !this._isDynamicWijdatasource && dataView.isLoaded()) {
                        local = true;
                    }
                    dataView.refresh(loadParams, local);
                } else {
                    if(this.isDataLoaded()) {
                        this._onDataViewLoaded();
                        this._onDataViewReset()// suppose that data is loaded, send notification to wijgrid.
                        ;
                    }
                }
            };
            dataViewWrapper.prototype.currentPosition = function (rowIndex) {
                var dataView = this._getDataViewInst();
                if(!arguments.length) {
                    return dataView.currentPosition();
                }
                this.ignoreCurrentChangedEvent(true);
                try  {
                    dataView.currentPosition(rowIndex);
                }finally {
                    this.ignoreCurrentChangedEvent(false);
                }
            };
            dataViewWrapper.prototype.getValue = function (indexOrItem, key) {
                var dataView = this._getDataViewInst();
                if(typeof (key) === "number") {
                    key = key + "";
                }
                return dataView.getProperty(indexOrItem, key);
            };
            dataViewWrapper.prototype.setValue = function (indexOrItem, key, value) {
                var dataView = this._getDataViewInst();
                this.ignoreChangeEvent(true);
                try  {
                    if(typeof (key) === "number") {
                        key = key + "";
                    }
                    dataView.setProperty(indexOrItem, key, value);
                }finally {
                    this.ignoreChangeEvent(false);
                }
            };
            dataViewWrapper.prototype._createDataViewWrapper = function () {
                var dataItemToGetProperties, data = this._wijgrid.options.data, dataView = this._getDataViewInst(), isWijdatasource = false;
                if(dataView) {
                    return;
                }
                if(!data) {
                    // DOM
                    this._domSource = this._processDOM(this._wijgrid.element, this._wijgrid.options.readAttributesFromData);
                    data = this._domSource.items;
                }
                isWijdatasource = (typeof (wijdatasource) !== "undefined" && (data instanceof wijdatasource));
                this._isOwnDataView = ($.isArray(data) || isWijdatasource);
                this._isWijdatasource = !!(this._isOwnDataView && isWijdatasource);
                //this._isRemoteWijdatasource = !!(this._isOwnDataView && isWijdatasource && data.proxy);
                this._isDynamicWijdatasource = !!(this._isOwnDataView && isWijdatasource && data.dynamic);
                if(this._isOwnDataView) {
                    if(!this._domSource && this._wijgrid.options.readAttributesFromData) {
                        this._moveAttributesToExpando(data);
                    }
                    dataView = wijmo.grid.GridDataView.create(wijmo.data.asDataView(data));
                } else {
                    dataView = data;
                }
                this._wijgrid._wijDataView = dataView;
                this._toDispose.push(dataView.isLoading.subscribe($.proxy(this._onDataViewLoadingInternal, this)));
                this._toDispose.push(dataView.isLoaded.subscribe($.proxy(this._onDataViewLoadedInternal, this)));
                this._toDispose.push(dataView.subscribe($.proxy(this._onDataViewChangeInternal, this)));
                this._toDispose.push(dataView.currentPosition.subscribe($.proxy(this._onDataViewCurrentChangedInternal, this)));
                this._propChangeListener = new wijmo.grid.propChangeListener($.proxy(this._onPropertyChanged, this));
            };
            dataViewWrapper.prototype._getDataViewInst = function () {
                return this._wijgrid._wijDataView;
            };
            dataViewWrapper.prototype._needToLoad = function (settingsManager) {
                var dataView = this._getDataViewInst();
                if(this._isDynamicWijdatasource || (this._isWijdatasource && !dataView.isLoaded())) {
                    return true;
                }
                if(this.isDataLoaded() || dataView.isLoading()) {
                    // data is loaded already or loading, check reshaping settings
                    return !settingsManager.compareSettings();
                }
                return false;// data is not loaded yet or user want to load them manually

            };
            dataViewWrapper.prototype._validateSettings = function (settingsManager) {
                if(!this._isOwnDataView && this._wijgrid.options.allowPaging && ((settingsManager.DVPagingSettings() || {
                }).pageSize !== (settingsManager.WGPagingSettings() || {
                }).pageSize)) {
                    throw "The pageSize option of the external dataView can't be changed.";
                }
            };
            dataViewWrapper.prototype._onDataViewLoadingInternal = // ** dataView events handlers
            function (isLoading) {
                if(this._ignoreAllEvents) {
                    return;
                }
                if(isLoading) {
                    if(!this._userData) {
                        // triggered outside
                        this._onDataViewLoading();
                    }
                }
            };
            dataViewWrapper.prototype._onDataViewLoadedInternal = function (isLoaded) {
                if(this._ignoreAllEvents) {
                    return;
                }
                if(isLoaded) {
                    this._onDataViewLoaded();
                }
            };
            dataViewWrapper.prototype._onDataViewChangeInternal = function (args) {
                var self = this;
                if(this._ignoreAllEvents || this._ignoreChangeEvent) {
                    return;
                }
                if(args.changes) {
                    if(args.length && args[0].entityState() === "detached")// check first item only, suppose that other items have the same entityState.
                     {
                        return;// do not handle the detached items

                    }
                    $.each(args.changes, function (_, change) {
                        switch(change.changeType) {
                            case "remove":
                                self._propChangeListener.remove(change.index);
                                break;
                            case "add":
                                self._propChangeListener.insert(change.index, change.element);
                                break;
                        }
                    });
                }
                this._onDataViewChange.apply(this, arguments);
            };
            dataViewWrapper.prototype._onDataViewCurrentChangedInternal = function () {
                if(this._ignoreAllEvents || this._ignoreCurrentChangedEvent) {
                    return;
                }
                this._onDataViewCurrentChanged.apply(this, arguments);
            };
            dataViewWrapper.prototype._onDataViewReset = // dataView events handlers **
            // ** event handlers
            function () {
                this._sharedDataItems = [];
                this._totals = {
                };
                var i, dataView = this._getDataViewInst(), len = dataView.count(), dataItem;
                try  {
                    this._propChangeListener.removeAll()// remove old subscriptions
                    ;
                    for(i = 0; i < len; i++) {
                        dataItem = dataView.item(i);
                        this._propChangeListener.insert(i, dataItem);
                        this._sharedDataItems.push(this._wrapDataItem(dataItem, i));
                    }
                    this._totals = this._getTotals(dataView, this._wijgrid._prepareTotalsRequest(true));
                    this._wijgrid._onDataViewReset(this._userData);
                }finally {
                    this._userData = null;
                }
            };
            dataViewWrapper.prototype._onPropertyChanged = function (newValue) {
                var self = this;
                if(this._changeTimer > 0) {
                    window.clearTimeout(this._changeTimer);
                    this._changeTimer = 0;
                }
                if(this._changeTimer != -1) {
                    this._changeTimer = window.setTimeout(function () {
                        self._changeTimer = -1;
                        if(!self._wijgrid._destroyed) {
                            self._onDataViewChange();
                        }
                        self._changeTimer = 0;
                    }, 100);
                }
            };
            dataViewWrapper.prototype._onDataViewChange = // args can be empty
            function (args) {
                this._onDataViewReset()// force re-rendering. TODO: handle "add", "remove", "modify" etc.
                ;
            };
            dataViewWrapper.prototype._onDataViewCurrentChanged = function (e, args) {
                this._wijgrid._onDataViewCurrentPositionChanged(e, args);
            };
            dataViewWrapper.prototype._onDataViewLoading = function () {
                this._wijgrid._onDataViewLoading();
            };
            dataViewWrapper.prototype._onDataViewLoaded = function () {
                this._wijgrid._onDataViewLoaded();
            };
            dataViewWrapper.prototype._getTotals = // event handlers **
            function (dataView, request) {
                if(!request || request.length === 0) {
                    return {
                    };
                }
                var i, len, j, len2, tallies = [], result = {
                };
                for(i = 0 , len = request.length; i < len; i++) {
                    tallies.push(new wijmo.grid.tally());
                }
                for(i = 0 , len = dataView.count(); i < len; i++) {
                    for(j = 0 , len2 = tallies.length; j < len2; j++) {
                        tallies[j].add(this._wijgrid._parse(request[j].column, this.getValue(i, request[j].column.dataKey)));
                    }
                }
                for(i = 0 , len = tallies.length; i < len; i++) {
                    result[request[i].column.dataKey] = tallies[i].getValueString(request[i].column);
                }
                return result;
            };
            dataViewWrapper.prototype._processDOM = // ** DOM
            function ($obj, readAttributes) {
                var result = {
                    items: [],
                    emptyData: [],
                    header: wijmo.grid.readTableSection($obj, wijmo.grid.rowScope.head)
                };
                if(wijmo.grid.getTableSectionLength($obj, 2) === 1 && $(wijmo.grid.getTableSectionRow($obj, 2, 0)).hasClass("wijmo-wijgrid-emptydatarow")) {
                    // special case - empty data row
                    result.emptyData = wijmo.grid.readTableSection($obj, wijmo.grid.rowScope.body);
                } else {
                    // read data rows
                    result.items = wijmo.grid.readTableSection($obj, wijmo.grid.rowScope.body, readAttributes);
                }
                return result;
            };
            dataViewWrapper.prototype._moveAttributesToExpando = // DOM **
            function (rawData) {
                $.each(rawData, function (i, item) {
                    var expando = (wijmo).data.Expando.getFrom(item, true), rowMeta;
                    rowMeta = expando[wijmo.grid.EXPANDO] = {
                        cellsAttributes: {
                        },
                        rowAttributes: {
                        }
                    }// store attributes within the original item using Expando
                    ;
                    if(item.rowAttributes) {
                        rowMeta.rowAttributes = item.rowAttributes;
                        delete item.rowAttributes;
                    }
                    ;
                    $.each(item, function (dataKey, dataValue) {
                        if($.isArray(dataValue)) {
                            rowMeta.cellsAttributes[dataKey] = dataValue[1];
                            item[dataKey] = dataValue[0];
                        }
                    });
                });
            };
            dataViewWrapper.prototype._wrapDataItem = function (dataItem, dataItemIndex) {
                return {
                    values: dataItem,
                    originalRowIndex: dataItemIndex
                };
            };
            dataViewWrapper.prototype._refreshSilent = // ** used by c1gridview to update underlying data during callbacks.
            function () {
                // used by c1gridview to refresh underlying data during callbacks.
                var dataView = this._getDataViewInst();
                if(dataView) {
                    try  {
                        this._ignoreAllEvents = true;
                        dataView.refresh();
                    }finally {
                        this._ignoreAllEvents = false;
                    }
                }
            };
            dataViewWrapper.prototype._unsafeReplace = function (index, newItem) {
                var dataView = this._getDataViewInst();
                if(!(dataView instanceof wijmo.grid.GridDataView)) {
                    "operation is not supported";
                }
                dataView._unsafeReplace(index, newItem);
            };
            dataViewWrapper.prototype._unsafeSplice = function (index, count, item) {
                var dataView = this._getDataViewInst();
                if(!(dataView instanceof wijmo.grid.GridDataView)) {
                    "operation is not supported";
                }
                if(arguments.length === 2) {
                    dataView._unsafeSplice(index, count);
                } else {
                    dataView._unsafeSplice(index, count, item);
                }
            };
            dataViewWrapper.prototype._unsafePush = function (item) {
                var dataView = this._getDataViewInst();
                if(!(dataView instanceof wijmo.grid.GridDataView)) {
                    "operation is not supported";
                }
                dataView._unsafePush(item);
            };
            return dataViewWrapper;
        })();
        grid.dataViewWrapper = dataViewWrapper;
        // used by c1gridview to refresh underlying data during callbacks **
        function asPagedDataView(dataView) {
            return dataView && ("pageCount" in dataView) ? dataView : null;
        }
        grid.asPagedDataView = asPagedDataView;
        function asEditableDataView(dataView) {
            return dataView && ("commitEdit" in dataView) ? dataView : null;
        }
        grid.asEditableDataView = asEditableDataView;
        var propChangeListener = (function () {
            function propChangeListener(callback) {
                this._subscriptions = [];
                this._callback = callback;
            }
            propChangeListener.prototype.insert = function (index, dataViewItem) {
                var itemSubscrArray = [], self = this;
                this._subscriptions.splice(index, 0, itemSubscrArray);
                $.each(dataViewItem, function (key, value) {
                    if(self._isValidPropName(key) && value && $.isFunction(value.subscribe)) {
                        itemSubscrArray.push(value.subscribe(self._callback));
                    }
                });
            };
            propChangeListener.prototype.remove = function (index) {
                var subscrArray = this._subscriptions[index];
                if(subscrArray) {
                    $.each(subscrArray, function (key, propSubscr) {
                        propSubscr.dispose();
                        subscrArray[key] = null;
                    });
                }
                this._subscriptions[index] = null;
                this._subscriptions.splice(index, 1);
            };
            propChangeListener.prototype.removeAll = function () {
                var len, subscr;
                while(len = this._subscriptions.length) {
                    this.remove(len - 1);
                }
                this._subscriptions = [];
            };
            propChangeListener.prototype.dispose = function () {
                this.removeAll();
            };
            propChangeListener.prototype._isValidPropName = function (name) {
                if(name && (typeof (name) === "string")) {
                    return name.match("^entityState|jQuery") === null;
                }
                return true;
            };
            return propChangeListener;
        })();
        grid.propChangeListener = propChangeListener;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    /// <reference path="merger.ts"/>
    /// <reference path="wijgrid.ts"/>
    /// <reference path="groupHelper.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var groupRange = (function () {
            function groupRange(expanded, range, sum, position, hasHeaderOrFooter) {
                this.cr = new wijmo.grid.cellRange(-1, -1);
                this.isExpanded = false;
                this._value = -1;
                this._sum = -1;
                this._position = "none";
                this._hasHeaderOrFooter = true;
                if(expanded !== undefined) {
                    this.isExpanded = expanded;
                }
                if(range !== undefined) {
                    this.cr = range;
                }
                if(sum !== undefined) {
                    this._sum = sum;
                }
                if(position !== undefined) {
                    this._position = position;
                }
                if(hasHeaderOrFooter !== undefined) {
                    this._hasHeaderOrFooter = hasHeaderOrFooter;
                }
            }
            groupRange.prototype.isSubRange = function (groupRange) {
                return ((this.cr.r1 >= groupRange.cr.r1) && (this.cr.r2 <= groupRange.cr.r2));
            };
            groupRange.prototype.toString = function () {
                return this.cr.r1 + "-" + this.cr.r2;
            };
            groupRange.prototype.getHeaderImageClass = function (expanded) {
                var groupInfo = this.owner;
                if(groupInfo) {
                    return expanded ? groupInfo.expandedImageClass || wijmo.c1field.prototype.options.groupInfo.expandedImageClass : groupInfo.collapsedImageClass || wijmo.c1field.prototype.options.groupInfo.collapsedImageClass;
                }
                return null;
            };
            groupRange.prototype.collapse = function () {
                var groupInfo, column, grid, leaves, groupedColumnsCnt;
                if((groupInfo = this.owner) && (column = groupInfo.owner) && (grid = column.owner)) {
                    leaves = grid._field("leaves");
                    if(wijmo.grid.groupHelper.isParentExpanded(leaves, this.cr, groupInfo.level)) {
                        if((groupInfo.position !== "footer") && (groupInfo.outlineMode !== "none")) {
                            // do not collapse groups with .position == "footer"
                            groupedColumnsCnt = wijmo.grid.groupHelper.getGroupedColumnsCount(leaves);
                            this._collapse(grid._rows(), leaves, this, groupedColumnsCnt, grid._field("viewRenderBounds").start);
                        }
                    }
                }
            };
            groupRange.prototype.expand = function (expandChildren) {
                var groupInfo, column, grid, leaves, groupedColumnsCnt;
                if((groupInfo = this.owner) && (column = groupInfo.owner) && (grid = column.owner)) {
                    leaves = grid._field("leaves");
                    if(wijmo.grid.groupHelper.isParentExpanded(leaves, this.cr, groupInfo.level)) {
                        groupedColumnsCnt = wijmo.grid.groupHelper.getGroupedColumnsCount(leaves);
                        /*var tbody = grid.$table.find("> tbody")[0];*/
                        this._expand(grid._rows(), leaves, this, groupedColumnsCnt, expandChildren, true, grid._field("viewRenderBounds").start);
                    }
                }
            };
            groupRange.prototype._collapse = function (rowAccessor, leaves, groupRange, groupedColumnsCnt, virtualOffset) {
                var groupInfo = groupRange.owner, dataStart = groupRange.cr.r1, dataEnd = groupRange.cr.r2, i, len, childRanges, childRange, j;
                switch(groupInfo.position) {
                    case "header":
                    case "headerAndFooter":
                        this._toggleRowVisibility(rowAccessor.item(groupRange.cr.r1 - virtualOffset), undefined, false);
                        dataStart++;
                        break;
                }
                // hide child rows
                for(i = dataStart; i <= dataEnd; i++) {
                    this._toggleRowVisibility(rowAccessor.item(i - virtualOffset), false);
                }
                // update isExpanded property
                groupRange.isExpanded = false;
                this._updateHeaderIcon(rowAccessor, groupRange, virtualOffset);
                for(i = groupInfo.level + 1; i <= groupedColumnsCnt; i++) {
                    childRanges = wijmo.grid.groupHelper.getChildGroupRanges(leaves, groupRange.cr, /*groupRange.owner.level*/ i - 1);
                    for(j = 0 , len = childRanges.length; j < len; j++) {
                        childRange = childRanges[j];
                        childRange.isExpanded = false;
                        switch(childRange.owner.position) {
                            case "header":
                            case "headerAndFooter":
                                this._toggleRowVisibility(rowAccessor.item(childRange.cr.r1 - virtualOffset), undefined, false);
                                break;
                        }
                        this._updateHeaderIcon(rowAccessor, childRange, virtualOffset);
                    }
                }
            };
            groupRange.prototype._expand = function (rowAccessor, leaves, groupRange, groupedColumnsCnt, expandChildren, isRoot, virtualOffset) {
                var groupInfo = groupRange.owner, dataStart = groupRange.cr.r1, dataEnd = groupRange.cr.r2, i, len, childRanges, childRange, childIsRoot;
                switch(groupInfo.position) {
                    case "header":
                        this._toggleRowVisibility(rowAccessor.item(dataStart - virtualOffset), true, isRoot || expandChildren);
                        dataStart++;
                        break;
                    case "footer":
                        this._toggleRowVisibility(rowAccessor.item(dataEnd - virtualOffset), true);
                        dataEnd--;
                        break;
                    case "headerAndFooter":
                        this._toggleRowVisibility(rowAccessor.item(dataStart - virtualOffset), true, isRoot || expandChildren);
                        if(isRoot) {
                            this._toggleRowVisibility(rowAccessor.item(dataEnd - virtualOffset), true);
                        }
                        dataStart++;
                        dataEnd--;
                        break;
                }
                if(isRoot) {
                    groupRange.isExpanded = true;
                    this._updateHeaderIcon(rowAccessor, groupRange, virtualOffset);
                } else {
                    return;
                }
                if(groupRange.owner.level === groupedColumnsCnt) {
                    // show data rows
                    for(i = dataStart; i <= dataEnd; i++) {
                        this._toggleRowVisibility(rowAccessor.item(i - virtualOffset), true);
                    }
                } else {
                    childRanges = wijmo.grid.groupHelper.getChildGroupRanges(leaves, groupRange.cr, groupRange.owner.level);
                    if(childRanges.length && (dataStart !== childRanges[0].cr.r1)) {
                        //
                        // a space between parent groupHeader and first child range - show single rows (groupSingleRow = false)
                        for(i = dataStart; i < childRanges[0].cr.r1; i++) {
                            this._toggleRowVisibility(rowAccessor.item(i - virtualOffset), true);
                        }
                    }
                    if(expandChildren) {
                        // throw action deeper
                        for(i = 0 , len = childRanges.length; i < len; i++) {
                            childRange = childRanges[i];
                            this._expand(rowAccessor, leaves, childRange, groupedColumnsCnt, expandChildren, true, virtualOffset);
                        }
                    } else {
                        // show only headers of the child groups or fully expand child groups with .position == "footer"\ .outlineMode == "none"
                        for(i = 0 , len = childRanges.length; i < len; i++) {
                            childRange = childRanges[i];
                            childIsRoot = (childRange.owner.position === "footer" || childRange.owner.outlineMode === "none") ? true : false;
                            this._expand(rowAccessor, leaves, childRange, groupedColumnsCnt, false, childIsRoot, virtualOffset);
                        }
                    }
                }
            };
            groupRange.prototype._toggleRowVisibility = function (rowObj, visible, expanded) {
                if(rowObj) {
                    if(rowObj[0]) {
                        if(visible !== undefined) {
                            rowObj[0].style.display = visible ? "" : "none";
                            rowObj[0]["aria-hidden"] = visible ? "false" : "true";
                        }
                        if(expanded !== undefined) {
                            rowObj[0]["aria-expanded"] = expanded ? "true" : "false";
                        }
                    }
                    if(rowObj[1]) {
                        if(visible !== undefined) {
                            rowObj[1].style.display = visible ? "" : "none";
                            rowObj[1]["aria-hidden"] = visible ? "false" : "true";
                        }
                        if(expanded !== undefined) {
                            rowObj[1]["aria-expanded"] = expanded ? "true" : "false";
                        }
                    }
                }
            };
            groupRange.prototype._updateHeaderIcon = function (rowAccessor, groupRange, virtualOffset) {
                if(groupRange.owner.position !== "footer") {
                    var imageDiv, rowObj = rowAccessor.item(groupRange.cr.r1 - virtualOffset);
                    if(rowObj) {
                        if(rowObj[0]) {
                            imageDiv = $(rowObj[0]).find("div.wijmo-wijgrid-grouptogglebtn:first-child");
                        }
                    }
                    if(imageDiv && imageDiv.length) {
                        imageDiv.toggleClass(groupRange.getHeaderImageClass(!groupRange.isExpanded), false);
                        imageDiv.toggleClass(groupRange.getHeaderImageClass(groupRange.isExpanded), true);
                    }
                }
            };
            return groupRange;
        })();
        grid.groupRange = groupRange;
        var grouper = (function () {
            function grouper() {
                this._groupRowIdx = 0;
            }
            grouper.prototype.group = function (grid, data, leaves) {
                this._grid = grid;
                this._data = data;
                this._leaves = leaves;
                this._groupRowIdx = 0;
                var level = 1, i, len, leaf, groupCollection = [], needReset = false, groupLength = 0;
                //get the grouped columns
                for(i = 0 , len = leaves.length; i < len; i++) {
                    leaf = leaves[i];
                    if(leaf.groupInfo) {
                        delete leaf.groupInfo.level;
                        delete leaf.groupInfo.expandInfo;
                    }
                    if(/*(leaf.dynamic !== true) && */ leaf.groupInfo && (leaf.groupInfo.position && (leaf.groupInfo.position !== "none")) && (leaf.dataIndex >= 0)) {
                        if(leaf.groupedIndex === undefined) {
                            needReset = true;
                        }
                    } else {
                        if(leaf.groupedIndex !== undefined) {
                            delete leaf.groupedIndex;
                        }
                    }
                }
                if(needReset) {
                    for(i = 0 , len = leaves.length; i < len; i++) {
                        leaf = leaves[i];
                        if(/*(leaf.dynamic !== true) && */ leaf.groupInfo && (leaf.groupInfo.position && (leaf.groupInfo.position !== "none")) && (leaf.dataIndex >= 0)) {
                            leaf.groupedIndex = groupLength++;
                            groupCollection.push(leaf);
                        }
                    }
                } else {
                    groupCollection = $.map(leaves, function (element) {
                        return element.groupedIndex !== undefined ? element : null;
                    });
                    groupCollection.sort(function (a, b) {
                        return a.groupedIndex - b.groupedIndex;
                    });
                    $.each(groupCollection, function (index, item) {
                        item.groupedIndex = index;
                    });
                }
                grid._field("groupedColumns", groupCollection);
                for(i = 0 , len = groupCollection.length; i < len; i++) {
                    leaf = groupCollection[i];
                    this._groupRowIdx = 0;
                    if(/*(leaf.dynamic !== true) && */ leaf.groupInfo && (leaf.groupInfo.position && (leaf.groupInfo.position !== "none")) && (leaf.dataIndex >= 0)) {
                        leaf.groupInfo.level = level;
                        leaf.groupInfo.expandInfo = [];
                        this._processRowGroup(leaf, level++);
                    }
                }
                delete this._grid;
                delete this._data;
                delete this._leaves;
            };
            grouper.prototype._processRowGroup = function (leaf, level) {
                var row, cellRange, isExpanded, startCollapsed, indentRow, groupRange, isParentCollapsed, header, footer, i, firstVisibleLeafIdx = 0, hasHeaderOrFooter = true;
                $.each(this._leaves, function (i, leaf) {
                    if(leaf.parentVis) {
                        firstVisibleLeafIdx = i;
                        return false;
                    }
                });
                for(row = 0; row < this._data.length; row++) {
                    // if (this._data[row].rowType !== "data") {
                    if(!(this._data[row].rowType & wijmo.grid.rowType.data)) {
                        continue;
                    }
                    cellRange = this._getGroupCellRange(row, leaf, level);
                    isExpanded = true;
                    startCollapsed = (leaf.groupInfo.outlineMode === "startCollapsed");
                    if(startCollapsed || wijmo.grid.groupHelper.isParentCollapsed(this._leaves, cellRange, level)) {
                        if((leaf.groupInfo.groupSingleRow === false) && (cellRange.r1 === cellRange.r2)) {
                            continue;
                        }
                        isExpanded = false;
                    }
                    // indent
                    if(level && this._grid.options.groupIndent) {
                        for(indentRow = cellRange.r1; indentRow <= cellRange.r2; indentRow++) {
                            this._addIndent(this._data[indentRow][firstVisibleLeafIdx], level);
                        }
                    }
                    hasHeaderOrFooter = !(leaf.groupInfo.groupSingleRow === false && (cellRange.r1 === cellRange.r2));
                    // insert group header/ group footer
                    switch(leaf.groupInfo.position) {
                        case "header":
                            groupRange = this._addGroupRange(leaf.groupInfo, cellRange, isExpanded, hasHeaderOrFooter);
                            for(i = cellRange.r1; i <= cellRange.r2; i++) {
                                this._data[i].__attr["aria-level"] = level + 1;
                                if(!isExpanded) {
                                    this._data[i].__style.display = "none";
                                    this._data[i].__attr["aria-hidden"] = true;
                                }
                            }
                            if(!hasHeaderOrFooter) {
                                break;
                            }
                            this._updateByGroupRange(groupRange, level);
                            isParentCollapsed = wijmo.grid.groupHelper.isParentCollapsed(this._leaves, groupRange.cr, level);
                            header = this._buildGroupRow(groupRange, cellRange, true, isParentCollapsed);
                            this._data.splice(cellRange.r1, 0, header)// insert group header
                            ;
                            header.__attr["arial-level"] = level;
                            header.__attr["aria-expanded"] = isExpanded;
                            if(isParentCollapsed) {
                                header.__style.display = "none";
                                header.__attr["aria-hidden"] = true;
                            }
                            row = cellRange.r2 + 1;
                            break;
                        case "footer":
                            groupRange = this._addGroupRange(leaf.groupInfo, cellRange, true, hasHeaderOrFooter);
                            if(!hasHeaderOrFooter) {
                                break;
                            }
                            this._updateByGroupRange(groupRange, level);
                            footer = this._buildGroupRow(groupRange, cellRange, false, false);
                            footer.__attr["aria-level"] = level;
                            this._data.splice(cellRange.r2 + 1, 0, footer);
                            row = cellRange.r2 + 1;
                            isParentCollapsed = wijmo.grid.groupHelper.isParentCollapsed(this._leaves, groupRange.cr, level);
                            if(isParentCollapsed) {
                                footer.__style.display = "none";
                                footer.__attr["aria-hidden"] = true;
                            }
                            break;
                        case "headerAndFooter":
                            groupRange = this._addGroupRange(leaf.groupInfo, cellRange, isExpanded, hasHeaderOrFooter);
                            for(i = cellRange.r1; i <= cellRange.r2; i++) {
                                this._data[i].__attr["aria-level"] = level + 1;
                                if(!isExpanded) {
                                    this._data[i].__style.display = "none";
                                    this._data[i].__attr["aria-hidden"] = true;
                                }
                            }
                            if(!hasHeaderOrFooter) {
                                break;
                            }
                            this._updateByGroupRange(groupRange, level);
                            isParentCollapsed = wijmo.grid.groupHelper.isParentCollapsed(this._leaves, groupRange.cr, level);
                            header = this._buildGroupRow(groupRange, cellRange, true, isParentCollapsed);
                            footer = this._buildGroupRow(groupRange, cellRange, false, false);
                            this._data.splice(cellRange.r2 + 1, 0, footer);
                            footer.__attr["aria-level"] = level;
                            if(isParentCollapsed || !isExpanded) {
                                footer.__style.display = "none";
                                footer.__attr["aria-hidden"] = true;
                            }
                            this._data.splice(cellRange.r1, 0, header);
                            header.__attr["aria-level"] = level;
                            header.__attr["aria-expanded"] = isExpanded;
                            if(isParentCollapsed) {
                                header.__style.display = "none";
                                header.__attr["aria-hidden"] = true;
                            }
                            row = cellRange.r2 + 2;
                            break;
                        default:
                            throw wijmo.grid.stringFormat("Unknown Position value: \"{0}\"", leaf.groupInfo.position);
                    }
                    this._groupRowIdx++;
                }
            };
            grouper.prototype._buildGroupRow = function (groupRange, cellRange, isHeader, isParentCollapsed) {
                //when some column is hidden, the group row is not correct.
                                var groupInfo = groupRange.owner, leaf = groupInfo.owner, gridView = leaf.owner, row = [], groupByText = "", aggregate = //headerOffset = 0,
                "", tmp, cell, caption, args, span, col, bFirst, agg;
                (row).__style = {
                };
                (row).__attr = {
                };
                (row).__attr.id = ((isHeader) ? "GH" : "GF") + this._groupRowIdx + "-" + groupInfo.level;
                (row).rowType = (isHeader) ? wijmo.grid.rowType.groupHeader : //"groupHeader"
                wijmo.grid.rowType.groupFooter// "groupFooter";
                ;
                //if (cellRange.c1 > -1 && ((tmp = this._data[cellRange.r1][cellRange.c1].value) !== null)) {
                if((leaf.dataIndex >= 0) && ((tmp = this._data[cellRange.r1][leaf.dataIndex].value) !== null)) {
                    groupByText = gridView._toStr(leaf, tmp);
                }
                if(this._grid.options.showRowHeader) {
                    row.push({
                        html: "&nbsp;"
                    });
                }
                // create the summary cell
                cell = {
                    html: "",
                    __attr: {
                    },
                    __style: {
                    }
                };
                if(isHeader && groupInfo.outlineMode !== "none") {
                    if(groupRange.isExpanded) {
                        cell.html = "<div class=\"" + gridView.options.wijCSS.icon + " " + groupRange.getHeaderImageClass(true) + " wijmo-wijgrid-grouptogglebtn\">&nbsp;</div>";
                    } else {
                        cell.html = "<div class=\"" + gridView.options.wijCSS.icon + " " + groupRange.getHeaderImageClass(false) + " wijmo-wijgrid-grouptogglebtn\">&nbsp;</div>";
                    }
                }
                row.push(cell);
                // add group header text
                if(leaf.aggregate && (leaf.aggregate !== "none")) {
                    //aggregate = this._getAggregate(cellRange, leaf, groupInfo.owner, isHeader, groupByText);
                    aggregate = this._getAggregate(cellRange, leaf, leaf, isHeader, groupByText);
                    //if (leaf.parentVis) {
                    //	headerOffset = 1;
                    //}
                                    }
                caption = (isHeader) ? groupInfo.headerText : groupInfo.footerText;
                // format caption
                // The text may include up to three placeholders:
                // "{0}" is replaced with the value being grouped on and
                // "{1}" is replaced with the group's column header
                // "{2}" is replaced with the aggregate
                if(caption === "custom") {
                    args = {
                        data: this._data,
                        column: // data object.
                        leaf,
                        groupByColumn: // column that is being grouped.
                        groupInfo.owner,
                        groupText: // column initiated grouping.
                        groupByText,
                        text: // text that is being grouped.
                        "",
                        groupingStart: // text that will be displayed in the groupHeader or Footer.
                        cellRange.r1,
                        groupingEnd: // first index for the data being grouped.
                        cellRange.r2,
                        isGroupHeader: // last index for the data being grouped.
                        isHeader,
                        aggregate: aggregate
                    };
                    if(this._grid._trigger("groupText", null, args)) {
                        caption = args.text;
                    }
                } else {
                    if((caption === undefined) || (caption === null)) {
                        // use default formatting
                        if(isHeader) {
                            caption = "{1}: {0}";
                        }
                        if(aggregate || (aggregate === 0)) {
                            caption = caption ? caption + " {2}" : "{2}";
                        }
                    }
                    caption = wijmo.grid.stringFormat(caption, groupByText, leaf && leaf.headerText ? leaf.headerText : "", aggregate.toString());
                }
                if(!caption) {
                    caption = "&nbsp;";
                }
                cell.html += "<span>" + caption + "</span>";
                this._addIndent(cell, groupInfo.level - 1);
                // summary cells span until the end of the row or the first aggregate
                //span = headerOffset;
                span = 1;
                col = (this._grid.options.showRowHeader) ? 1 : 0;
                //for (; col < cellRange.c1; col++) { // c1 is an index of the leaf inside the this._leaves
                //	if (this._leaves[col].parentVis) {
                //		span++;
                //	}
                //}
                //col = cellRange.c1 + headerOffset;
                bFirst = true;
                for(; col < this._leaves.length; col++) {
                    tmp = this._leaves[col];
                    if(tmp.parentVis) {
                        if(bFirst) {
                            bFirst = false;
                            continue;
                        }
                        if((tmp.dynamic !== true) && tmp.aggregate && (tmp.aggregate !== "none")) {
                            break;
                        }
                        span++;
                    }
                }
                // add aggregates (or blanks) until the end of the row
                for(; col < this._leaves.length; col++) {
                    tmp = this._leaves[col];
                    if(tmp.parentVis) {
                        agg = this._getAggregate(cellRange, tmp, groupInfo.owner, isHeader, groupByText);
                        if(!agg && (agg !== 0)) {
                            agg = "&nbsp;";
                        }
                        row.push({
                            html: agg.toString(),
                            __attr: {
                                groupInfo: {
                                    leafIndex: tmp.leavesIdx,
                                    purpose: wijmo.grid.groupRowCellPurpose.aggregateCell
                                }
                            }
                        });
                        // will be passed into the cellStyleFormatter
                                            }
                }
                cell.__attr.colSpan = span;
                cell.__attr.groupInfo = {
                    leafIndex: leaf.leavesIdx,
                    purpose: wijmo.grid.groupRowCellPurpose.groupCell
                }// will be passed into the cellStyleFormatter
                ;
                return row;
            };
            grouper.prototype._getAggregate = function (cellRange, column, groupByColumn, isGroupHeader, groupByText) {
                var aggregate = "", args, tally, row;
                if(!column.aggregate || (column.aggregate === "none")) {
                    return aggregate;
                }
                if(column.aggregate === "custom") {
                    args = {
                        data: this._data,
                        column: // data object
                        column,
                        groupByColumn: // column that is being grouped.
                        groupByColumn,
                        groupText: // column initiated grouping.
                        groupByText,
                        text: // text that is being grouped.
                        "",
                        groupingStart: // text that will be displayed in the groupHeader or groupFooter.
                        cellRange.r1,
                        groupingEnd: // first index for the data being grouped.
                        cellRange.r2,
                        isGroupHeader: // last index for the data being grouped.
                        isGroupHeader
                    };
                    if(this._grid._trigger("groupAggregate", null, args)) {
                        aggregate = args.text;
                    }
                } else {
                    tally = new wijmo.grid.tally();
                    for(row = cellRange.r1; row <= cellRange.r2; row++) {
                        tally.add(this._data[row][column.dataIndex].value);
                    }
                    aggregate = tally.getValueString(column);
                }
                return aggregate;
            };
            grouper.prototype._getGroupCellRange = function (row, leaf, level) {
                //var range = new $.wijmo.wijgrid.cellRange(row, leaf.dataIndex);
                                var idx = leaf.leavesIdx, range = // $.inArray(leaf, this._leaves);
                new wijmo.grid.cellRange(row, idx), parentRange = wijmo.grid.groupHelper.getParentGroupRange(this._leaves, range, level), value, nextValue, count;
                //if (this._data[row].rowType === "data") {
                if(this._data[row].rowType & wijmo.grid.rowType.data) {
                    value = this._data[row][leaf.dataIndex].value;
                    if(value instanceof Date) {
                        value = value.getTime();
                    }
                    for(range.r2 = row , count = this._data.length - 1; range.r2 < count; range.r2++) {
                        //if ((this._data[range.r2 + 1].rowType !== "data") || (parentRange && (range.r2 + 1 > parentRange.r2))) {
                        if(!(this._data[range.r2 + 1].rowType & wijmo.grid.rowType.data) || (parentRange && (range.r2 + 1 > parentRange.cr.r2))) {
                            break;
                        }
                        nextValue = this._data[range.r2 + 1][leaf.dataIndex].value;
                        if(nextValue instanceof Date) {
                            nextValue = nextValue.getTime();
                        }
                        if(value !== nextValue) {
                            break;
                        }
                    }
                }
                return range;
            };
            grouper.prototype._addGroupRange = function (groupInfo, cellRange, isExpanded, hasHeaderOrFooter) {
                var result = null, idx = wijmo.grid.groupHelper.getChildGroupIndex(cellRange, groupInfo.expandInfo), range, expandState, r1, r2;
                if(idx >= 0 && idx < groupInfo.expandInfo.length) {
                    result = groupInfo.expandInfo[idx];
                } else {
                    range = new wijmo.grid.cellRange(cellRange.r1, cellRange.r1, cellRange.r2, cellRange.r2)// clone
                    ;
                    expandState = (groupInfo.position === "footer" || !hasHeaderOrFooter) ? true : isExpanded && (groupInfo.outlineMode !== "startCollapsed");
                    result = new wijmo.grid.groupRange(expandState, range, -1, groupInfo.position, hasHeaderOrFooter);
                    result.owner = groupInfo;
                    groupInfo.expandInfo.push(result);
                }
                if(result && hasHeaderOrFooter) {
                    r1 = cellRange.r1;
                    r2 = cellRange.r2;
                    if(groupInfo.position === "headerAndFooter") {
                        r2 += 2;
                    }
                    if(groupInfo.position !== "headerAndFooter") {
                        r2++;
                    }
                    result.cr.r2 = r2;
                }
                return result;
            };
            grouper.prototype._updateByGroupRange = function (groupRange, level) {
                var i, len, groupInfo, len2, j, cur, delta;
                for(i = 0 , len = this._leaves.length; i < len; i++) {
                    groupInfo = this._leaves[i].groupInfo;
                    if(groupInfo && (groupInfo.level < level)) {
                        len2 = (groupInfo.expandInfo) ? groupInfo.expandInfo.length : 0;
                        for(j = 0; j < len2; j++) {
                            cur = groupInfo.expandInfo[j];
                            delta = (groupRange.position === "headerAndFooter") ? 2 : 1;
                            if(cur.cr.r1 >= groupRange.cr.r1 && !((cur.cr.r1 === groupRange.cr.r1) && (cur.position === "footer"))) {
                                cur.cr.r1 += delta;
                            }
                            if(cur.cr.r2 >= groupRange.cr.r1) {
                                cur.cr.r2 += delta;
                            }
                        }
                    }
                }
            };
            grouper.prototype._addIndent = function (cellObj, level) {
                var indent;
                if(level > 0 && (indent = this._grid.options.groupIndent)) {
                    cellObj.__style.paddingLeft = (indent * level) + "px";
                }
            };
            return grouper;
        })();
        grid.grouper = grouper;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    /// <reference path="merger.ts"/>
    /// <reference path="grouper.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var groupHelper = (function () {
            function groupHelper() { }
            groupHelper._getGroupInfoRegExp = new RegExp(".*G([HF]){1}(\\d+)-(\\d+)$");
            groupHelper.getGroupInfo = function getGroupInfo(row) {
                if(row) {
                    var info = wijmo.grid.groupHelper._getGroupInfoRegExp.exec(row.id), level, index, isHeader;
                    if(info) {
                        level = parseInt(info[3], 10);
                        index = parseInt(info[2], 10);
                        isHeader = (info[1] === "H");
                        return {
                            level: level,
                            index: index,
                            isHeader: isHeader,
                            toString: function () {
                                return (isHeader ? "GH" : "GF") + index + "-" + level;
                            }
                        };
                    }
                }
                return null;
            };
            groupHelper.getColumnByGroupLevel = function getColumnByGroupLevel(leaves, level) {
                var i, len, leaf;
                for(i = 0 , len = leaves.length; i < len; i++) {
                    leaf = leaves[i];
                    if(leaf.groupInfo && (leaf.groupInfo.level === level)) {
                        return leaf;
                    }
                }
                return null;
            };
            groupHelper.getGroupedColumnsCount = function getGroupedColumnsCount(leaves) {
                var result = 0, i, len, groupInfo;
                for(i = 0 , len = leaves.length; i < len; i++) {
                    groupInfo = leaves[i].groupInfo;
                    if(groupInfo && (groupInfo.position === "header" || groupInfo.position === "headerAndFooter" || groupInfo.position === "footer")) {
                        result++;
                    }
                }
                return result;
            };
            groupHelper.getChildGroupIndex = // cellRange cellRange
            // groupRange[] childExpandInfo
            function getChildGroupIndex(cellRange, childExpandInfo) {
                var left = 0, right = childExpandInfo.length - 1, median, cmp;
                while(left <= right) {
                    median = ((right - left) >> 1) + left;
                    cmp = childExpandInfo[median].cr.r1 - cellRange.r1;
                    if(cmp === 0) {
                        return median;
                    }
                    if(cmp < 0) {
                        left = median + 1;
                    } else {
                        right = median - 1;
                    }
                }
                return left;
                //return ~left;
                            };
            groupHelper.getParentGroupIndex = function getParentGroupIndex(cellRange, parentExpandInfo) {
                var idx = wijmo.grid.groupHelper.getChildGroupIndex(cellRange, parentExpandInfo);
                if(idx > 0) {
                    idx--;
                }
                return (idx < parentExpandInfo.length) ? idx : -1;
            };
            groupHelper.getChildGroupRanges = // level: 1-based level of the cellRange;
            function getChildGroupRanges(leaves, cellRange, level) {
                var result = [], childRanges, childRange, i, len, firstChildIdx, childGroupedColumn = wijmo.grid.groupHelper.getColumnByGroupLevel(leaves, level + 1);
                if(childGroupedColumn) {
                    childRanges = childGroupedColumn.groupInfo.expandInfo;
                    firstChildIdx = wijmo.grid.groupHelper.getChildGroupIndex(cellRange, childRanges);
                    for(i = firstChildIdx , len = childRanges.length; i < len; i++) {
                        childRange = childRanges[i];
                        if(childRange.cr.r2 <= cellRange.r2) {
                            result.push(childRange);
                        } else {
                            break;
                        }
                    }
                }
                return result;
            };
            groupHelper.getParentGroupRange = // level: 1-based level of the cellRange; optional.
            function getParentGroupRange(leaves, cellRange, level) {
                var i, groupInfo, idx;
                if(level === undefined) {
                    level = 0xFFFF;
                }
                if(level - 2 >= 0) {
                    for(i = leaves.length - 1; i >= 0; i--) {
                        groupInfo = leaves[i].groupInfo;
                        if(!groupInfo || !groupInfo.expandInfo || (groupInfo.level < 0) || (groupInfo.level !== level - 1)) {
                            continue;
                        }
                        idx = wijmo.grid.groupHelper.getParentGroupIndex(cellRange, groupInfo.expandInfo);
                        if(idx >= 0) {
                            return groupInfo.expandInfo[idx];
                        }
                    }
                }
                return null;
            };
            groupHelper.isParentCollapsed = // level: 1-based level of the cellRange.
            function isParentCollapsed(leaves, cellRange, level) {
                var i, parentGroupRange;
                if(level === 1) {
                    return false;
                }
                for(i = level; i > 1; i--) {
                    parentGroupRange = wijmo.grid.groupHelper.getParentGroupRange(leaves, cellRange, i);
                    if(parentGroupRange && !parentGroupRange.isExpanded) {
                        return true;
                    }
                    cellRange = parentGroupRange.cr;
                }
                return false;
            };
            groupHelper.isParentExpanded = // level: 1-based level of the cellRange.
            function isParentExpanded(leaves, cellRange, level) {
                var i, parentGroupRange;
                if(level === 1) {
                    return true;
                }
                for(i = level; i > 1; i--) {
                    parentGroupRange = wijmo.grid.groupHelper.getParentGroupRange(leaves, cellRange, i);
                    if(parentGroupRange && parentGroupRange.isExpanded) {
                        return true;
                    }
                    cellRange = parentGroupRange.cr;
                }
                return false;
            };
            return groupHelper;
        })();
        grid.groupHelper = groupHelper;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var cellRange = (function () {
            function cellRange(row1, col1, row2, col2) {
                switch(arguments.length) {
                    case 2:
                        this.r1 = this.r2 = row1;
                        this.c1 = this.c2 = col1;
                        break;
                    case 4:
                        this.r1 = row1;
                        this.r2 = row2;
                        this.c1 = col1;
                        this.c2 = col2;
                        break;
                    default:
                        this.r1 = 0;
                        this.r2 = 0;
                        this.c1 = 0;
                        this.c2 = 0;
                }
            }
            cellRange.prototype.isSingleCell = function () {
                return ((this.r1 === this.r2) && (this.c1 === this.c2));
            };
            return cellRange;
        })();
        grid.cellRange = cellRange;
        var merger = (function () {
            function merger() {
            }
            merger.prototype.merge = function (data, visibleLeaves) {
                this._leaves = visibleLeaves;
                this._data = data;
                var i, len, leaf;
                for(i = 0 , len = this._leaves.length; i < len; i++) {
                    leaf = this._leaves[i];
                    if((leaf.dataIndex >= 0) && !leaf.isBand && (leaf.rowMerge === "free" || leaf.rowMerge === "restricted")) {
                        this._mergeColumn(leaf);
                    }
                }
                delete this._data;
                delete this._leaves;
            };
            merger.prototype._mergeColumn = function (column) {
                var dataIdx = column.dataIndex, i, len, range, span, spannedRow;
                for(i = 0 , len = this._data.length; i < len; i++) {
                    //if (this.data[i].rowType !== "data") {
                    if(!(this._data[i].rowType & wijmo.grid.rowType.data)) {
                        continue;
                    }
                    range = this._getCellRange(i, column);
                    if(range.r1 !== range.r2) {
                        span = range.r2 - range.r1 + 1;
                        //this.data[range.r1][dataIdx].rowSpan = span;
                        this._data[range.r1][dataIdx].__attr.rowSpan = span;
                        for(spannedRow = range.r1 + 1; spannedRow <= range.r2; spannedRow++) {
                            //this.data[spannedRow][dataIdx] = null;
                            this._data[spannedRow][dataIdx].visible = false;
                        }
                    }
                    i = range.r2;
                }
            };
            merger.prototype._getCellRange = function (rowIdx, column) {
                var columnIdx = column.dataIndex, range = new wijmo.grid.cellRange(rowIdx, columnIdx), str = (this._data[rowIdx][columnIdx].value || "").toString(), dataLen = this._data.length, dataItem, leafIdx, prevLeaf, range2;
                for(range.r2 = rowIdx; range.r2 < dataLen - 1; range.r2++) {
                    dataItem = this._data[range.r2 + 1];
                    //if ((dataItem.rowType !== "data") || (dataItem[columnIdx].value !== str)) {
                    if(!(dataItem.rowType & wijmo.grid.rowType.data) || ((dataItem[columnIdx].value || "").toString() !== str)) {
                        break;
                    }
                }
                leafIdx = column.leavesIdx// $.inArray(column, this.leaves);
                ;
                if(leafIdx > 0 && column.rowMerge === "restricted") {
                    prevLeaf = this._leaves[leafIdx - 1];
                    if(prevLeaf.dataIndex >= 0) {
                        range2 = this._getCellRange(rowIdx, prevLeaf);
                        range.r1 = Math.max(range.r1, range2.r1);
                        range.r2 = Math.min(range.r2, range2.r2);
                    }
                }
                return range;
            };
            return merger;
        })();
        grid.merger = merger;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        grid.EXPANDO = "__wijgrid";
        /// <summary>
        /// Row type.
        /// </summary>
        (function (rowType) {
            rowType._map = [];
            /// <summary>
            /// Header row.
            /// </summary>
            rowType.header = 1;
            /// <summary>
            /// Data row.
            /// </summary>
            rowType.data = 2;
            /// <summary>
            /// Data alternating row (used only as modifier of the rowType.data, not as independent value).
            /// </summary>
            rowType.dataAlt = 4;
            /// <summary>
            /// Filter row.
            /// </summary>
            rowType.filter = 8;
            /// <summary>
            /// Group header row.
            /// </summary>
            rowType.groupHeader = 16;
            /// <summary>
            /// Group footer row.
            /// </summary>
            rowType.groupFooter = 32;
            /// <summary>
            /// Footer row.
            /// </summary>
            rowType.footer = 64;
            /// <summary>
            /// Empty data row
            /// </summary>
            rowType.emptyDataRow = 128;
            /// <summary>
            /// Infrastructure
            /// </summary>
            rowType.fooRow = 65536;
        })(grid.rowType || (grid.rowType = {}));
        var rowType = grid.rowType;
        /// <summary>
        /// Determines an object render state.
        /// </summary>
        (function (renderState) {
            renderState._map = [];
            /// <summary>
            /// Normal state.
            /// </summary>
            renderState.none = 0;
            /// <summary>
            /// Object is being rendered.
            /// </summary>
            renderState.rendering = 1;
            /// <summary>
            /// Object is one of the elements determining the current position of the wijgrid.
            /// </summary>
            renderState.current = 2;
            /// <summary>
            /// Object is hovered.
            /// </summary>
            renderState.hovered = 4;
            /// <summary>
            /// Object is selected.
            /// </summary>
            renderState.selected = 8;
        })(grid.renderState || (grid.renderState = {}));
        var renderState = grid.renderState;
        /// <summary>
        /// Infrastructure.
        /// </summary>
        (function (rowScope) {
            rowScope._map = [];
            rowScope.table = 0;
            rowScope.head = 1;
            rowScope.body = 2;
            rowScope.foot = 3;
        })(grid.rowScope || (grid.rowScope = {}));
        var rowScope = grid.rowScope;
        /// <summary>
        /// Infrastructure.
        /// </summary>
        (function (cellRangeExtendMode) {
            cellRangeExtendMode._map = [];
            cellRangeExtendMode.none = 0;
            cellRangeExtendMode.toColumn = 1;
            cellRangeExtendMode.toRow = 2;
        })(grid.cellRangeExtendMode || (grid.cellRangeExtendMode = {}));
        var cellRangeExtendMode = grid.cellRangeExtendMode;
        (function (objectMode) {
            objectMode._map = [];
            objectMode.createIfNull = 0;
            objectMode.createAlways = 1;
            objectMode.dispose = 2;
        })(grid.objectMode || (grid.objectMode = {}));
        var objectMode = grid.objectMode;
        /// <summary>
        /// Determines purpose of the group row cells.
        /// </summary>
        (function (groupRowCellPurpose) {
            groupRowCellPurpose._map = [];
            groupRowCellPurpose.groupCell = 0;
            groupRowCellPurpose.aggregateCell = 1;
        })(grid.groupRowCellPurpose || (grid.groupRowCellPurpose = {}));
        var groupRowCellPurpose = grid.groupRowCellPurpose;
        function compareObj(a, b) {
            var i, len, flag;
            if($.isArray(a) && $.isArray(b)) {
                if(a.length === b.length) {
                    flag = true;
                    for(i = 0 , len = a.length; i < len && flag; i++) {
                        flag = wijmo.grid.compareObj(a[i], b[i]);
                    }
                    return flag;
                }
            } else {
                if($.isPlainObject(a) && $.isPlainObject(b)) {
                    for(i in a) {
                        if(a.hasOwnProperty(i)) {
                            if(!wijmo.grid.compareObj(a[i], b[i])) {
                                return false;
                            }
                        }
                    }
                    for(i in b) {
                        if(b.hasOwnProperty(i)) {
                            if(!wijmo.grid.compareObj(a[i], b[i])) {
                                return false;
                            }
                        }
                    }
                    return true;
                } else {
                    if(a instanceof Date) {
                        a = a.getTime();
                    }
                    if(b instanceof Date) {
                        b = b.getTime();
                    }
                }
            }
            return a === b;
        }
        grid.compareObj = compareObj;
        function stringFormat(pattern) {
            var params = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                params[_i] = arguments[_i + 1];
            }
            var i, len;
            if(!pattern) {
                return "";
            }
            for(i = 0 , len = params.length; i < len; i++) {
                pattern = pattern.replace(new RegExp("\\{" + i + "\\}", "gm"), params[i]);
            }
            return pattern;
        }
        grid.stringFormat = stringFormat;
        function validDataKey(dataKey) {
            return (dataKey && !(dataKey < 0)) || (dataKey === 0);
        }
        grid.validDataKey = validDataKey;
        function getDataType(column) {
            return column.dataType || column._underlyingDataType || "string";
        }
        grid.getDataType = getDataType;
        function iterateChildrenWidgets(item, callback) {
            if(item && callback) {
                item.find(".ui-widget").each(function (index, dom) {
                    $.each($(dom).data(), function (dataKey, dataValue) {
                        if(dataValue.widgetName) {
                            callback(index, dataValue);
                        }
                    });
                    return true;
                });
            }
        }
        grid.iterateChildrenWidgets = iterateChildrenWidgets;
        function remove$dataByPrefix(element, prefix) {
            var data$keys = [];
            $.each(element.data(), function (key) {
                if(key.indexOf(prefix) === 0) {
                    data$keys.push(key);
                }
            });
            $.each(data$keys, function (idx, key) {
                element.removeData(key);
            });
        }
        grid.remove$dataByPrefix = remove$dataByPrefix;
        var domSelection = (function () {
            function domSelection(dom) {
                this._dom = dom;
            }
            domSelection.prototype.getSelection = // The 'dom' must be an input element
            function () {
                var start = 0, end = 0, textRange;
                if(this._dom.selectionStart !== undefined) {
                    // DOM3
                    start = this._dom.selectionStart;
                    end = this._dom.selectionEnd;
                } else {
                    if(document.selection) {
                        // IE
                        textRange = document.selection.createRange().duplicate();
                        end = textRange.text.length// selection length
                        ;
                        start = Math.abs(textRange.moveStart("character", -this._dom.value.length))// move selection to the beginning
                        ;
                        end += start;
                    }
                }
                return {
                    start: start,
                    end: end,
                    length: end - start
                };
            };
            domSelection.prototype.setSelection = // The 'dom' must be an input element
            function (range) {
                if(this._dom.selectionStart !== undefined) {
                    // DOM3
                    this._dom.setSelectionRange(range.start, range.end);
                } else {
                    // IE
                    var textRange = this._dom.createTextRange();
                    textRange.collapse(true);
                    textRange.moveStart("character", range.start);
                    textRange.moveEnd("character", range.end);
                    textRange.select();
                }
            };
            domSelection.prototype.toggleSelection = function (enable) {
                var $dom = $(this._dom), useSelectStart = "onselectstart" in this._dom;
                if(enable) {
                    if(useSelectStart) {
                        $dom.unbind(".wijgrid-disableSelection");
                    } else {
                        $dom.css({
                            "MozUserSelect": "",
                            "WebkitUserSelect": ""
                        });
                    }
                } else {
                    if(useSelectStart) {
                        $dom.bind("selectstart.wijgrid-disableSelection", function (e) {
                            e.preventDefault();
                        });
                    } else {
                        $dom.css({
                            "MozUserSelect": "-moz-none",
                            "WebkitUserSelect": "none"
                        });
                    }
                }
            };
            return domSelection;
        })();
        grid.domSelection = domSelection;
        function createDynamicField(options) {
            return $.extend(true, {
            }, wijmo.c1basefield.prototype.options, wijmo.c1field.prototype.options, {
                dynamic: true,
                isLeaf: true,
                isBand: false,
                parentIdx: -1
            }, options);
        }
        grid.createDynamicField = createDynamicField;
        function bounds(element, client) {
            if(element) {
                var $dom = element.nodeType ? $(element) : element, offset = $dom.offset();
                if(offset) {
                    if(client) {
                        return {
                            top: offset.top,
                            left: offset.left,
                            width: $dom[0].clientWidth || 0,
                            height: $dom[0].clientHeight || 0
                        };
                    }
                    return {
                        top: offset.top,
                        left: offset.left,
                        width: $dom.outerWidth(),
                        height: $dom.outerHeight()
                    };
                }
            }
            return null;
        }
        grid.bounds = bounds;
        // maxDepth = -1 --  iterate through all child elements
        // default value = 3
        function _getDOMText(dom, maxDepth, ignoreTextNodes) {
            if(maxDepth === undefined) {
                maxDepth = 3// default value
                ;
            }
            if(dom && maxDepth !== 0) {
                if(!ignoreTextNodes && dom.nodeType === 3) {
                    // text node
                    return dom.nodeValue;
                }
                if(dom.nodeType === 1) {
                    // element
                    switch((dom).type) {
                        case "button":
                        case "text":
                        case "textarea":
                        case "select-one":
                            return (dom).value;
                        case "checkbox":
                            return (dom).checked.toString();
                    }
                    // go deeper
                                        var result = "", i = 0, child;
                    while(child = dom.childNodes[i++]) {
                        result += wijmo.grid._getDOMText(child, maxDepth - 1);
                    }
                    return result;
                }
            }
            return "";
        }
        grid._getDOMText = _getDOMText;
        // obj, prefix, name (opt), value (opt)
        function dataPrefix(obj, prefix, name, value) {
            var treatAsArray = (obj.jquery || $.isArray(obj)), i, len, tmp, internalName = // arrays of jQuery objects is not supported
            prefix + name;
            if(arguments.length === 3) {
                // getter
                if(treatAsArray) {
                    return $.data(obj[0], internalName);// first item only

                }
                return $.data(obj, internalName);
            } else {
                // setter
                if(treatAsArray) {
                    for(i = 0 , len = obj.length; i < len; i++) {
                        tmp = $.data(obj[i], internalName, value);
                    }
                    return tmp;
                }
                return $.data(obj, internalName, value);
            }
        }
        grid.dataPrefix = dataPrefix;
        function shallowMerge(target, src) {
            if(src && target) {
                var name, value, typeOf;
                for(name in src) {
                    if(src.hasOwnProperty(name)) {
                        value = src[name];
                        typeOf = typeof (value);
                        if((typeOf === "string" || typeOf === "boolean" || typeOf === "number") && (target[name] === undefined)) {
                            target[name] = value;
                        }
                    }
                }
            }
        }
        grid.shallowMerge = shallowMerge;
        function isCustomObject(value) {
            return (value && (typeof (value) === "object") && !(value instanceof Date));
        }
        grid.isCustomObject = isCustomObject;
        function search(value, test) {
            var key, foo, isFunc = $.isFunction(test);
            for(key in value) {
                if(value.hasOwnProperty(key)) {
                    foo = isFunc ? test(value[key]) : (value[key] === test);
                    if(foo === true) {
                        return {
                            at: key,
                            found: value[key]
                        };
                    }
                }
            }
            return {
                at: null,
                found: null
            };
        }
        grid.search = search;
        function getAttributes(dom, prevent) {
            if(dom) {
                var i, len, cnt = 0, result = {
                }, attrValue, attrName;
                for(i = 0 , len = dom.attributes.length; i < len; i++) {
                    attrName = dom.attributes[i].name;
                    if(attrName && (!prevent || !prevent(attrName))) {
                        attrValue = dom.getAttribute(attrName);
                        if(attrName === "style") {
                            attrValue = (typeof (attrValue) === "object") ? attrValue.cssText : attrValue;
                        }
                        if(!attrValue && attrName === "class") {
                            attrValue = dom.getAttribute("className");
                        }
                        if(attrValue && (typeof (attrValue) !== "function")) {
                            result[attrName] = attrValue;
                            cnt++;
                        }
                    }
                }
                if(cnt) {
                    return result;
                }
            }
            return null;
        }
        grid.getAttributes = getAttributes;
        // unlike the jQuery.extend(true) function the deepExtend() function doesn't skips undefined values.
        function deepExtend(source, target) {
            var key, src, dst, isArray, clone;
            if(source) {
                if(typeof (target) !== "object" && !$.isFunction(target)) {
                    target = {
                    };
                }
                for(key in source) {
                    src = source[key];
                    dst = target[dst];
                    if(src === target) {
                        continue;
                    }
                    if(src && ($.isPlainObject(src) || (isArray = $.isArray(src)))) {
                        if(isArray) {
                            isArray = false;
                            clone = dst && $.isArray(dst) ? dst : [];
                        } else {
                            clone = dst && $.isPlainObject(dst) ? dst : {
                            };
                        }
                        target[key] = wijmo.grid.deepExtend(src, clone);
                    } else {
                        target[key] = src;
                    }
                }
            }
            return target;
        }
        grid.deepExtend = deepExtend;
        function getKeyCodeEnum() {
            if($.ui && $.ui.keyCode) {
                return $.ui.keyCode;
            }
            if($.mobile && $.mobile.keyCode) {
                return $.mobile.keyCode;
            }
            throw "keyCode object is not found";
        }
        grid.getKeyCodeEnum = getKeyCodeEnum;
                        function widgetName(element, name) {
            if(element && element.jquery) {
                element = element[0];
            }
            if(element) {
                return (arguments.length === 1) ? $.data(element, "wijgridwidgetName") : $.data(element, "wijgridwidgetName", name);
            }
            return undefined;
        }
        grid.widgetName = widgetName;
        // ** taken from jQuery UI
        function isOverAxis(x, reference, size) {
            // Determines when x coordinate is over "b" element axis
            return (x > reference) && (x < (reference + size));
        }
        grid.isOverAxis = isOverAxis;
        function isOver(y, x, top, left, height, width) {
            // Determines when x, y coordinates is over "b" element
            return wijmo.grid.isOverAxis(y, top, height) && wijmo.grid.isOverAxis(x, left, width);
        }
        grid.isOver = isOver;
        // taken from jQuery UI **
        // ** uid
        var __uid = 0;
        function getUID() {
            return "uid" + __uid++;
        }
        grid.getUID = getUID;
        // uid **
        // * compatibility: export members to the $.wijmo.wijgrid "namespace" *
        $.extend($.wijmo.wijgrid, {
            rowType: wijmo.grid.rowType,
            renderState: wijmo.grid.renderState,
            bounds: wijmo.grid.bounds
        });
        // used by unit tests. TODO: remove
            })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="wijgrid.ts"/>
    /// <reference path="interfaces.ts"/>
    /// <reference path="../../../data/src/dataView.ts"/>
    /// <reference path="../../../data/src/filtering.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var filterOperatorsCache = (function () {
            function filterOperatorsCache(wijgrid) {
                this._cache = {
                };
                var self = this;
                this._wijgrid = wijgrid;
                this._addOperator(null, {
                    applicableTo: null,
                    name: // any type
                    "NoFilter",
                    arity: 1,
                    operator: function () {
                        return true;
                    }
                });
                $.each(wijmo.data.filtering.ops, function (name, op) {
                    self._addOperator(name, op);
                });
                $.each(wijgrid.options.customFilterOperators, function (key, fop) {
                    self._addOperator(null, fop, true);
                });
            }
            filterOperatorsCache.prototype.getByName = function (name) {
                var fop = this.getByNameInt(name);
                return (fop) ? fop.op : null;
            };
            filterOperatorsCache.prototype.getByNameInt = function (name) {
                return this._cache[(name || "").toLowerCase()];
            };
            filterOperatorsCache.prototype.getByDataType = function (dataType) {
                var intResult = [], result;
                $.each(this._cache, function (key, val) {
                    var fop = val.op;
                    if(!fop.applicableTo/* NoFilter*/  || $.inArray(dataType, fop.applicableTo) >= 0) {
                        intResult.push(val);
                    }
                });
                switch(this._wijgrid.options.filterOperatorsSortMode.toLowerCase()) {
                    case "alphabetical":
                        intResult.sort(this._sortAlpha);
                        break;
                    case "alphabeticalcustomfirst":
                        intResult.sort(this._sortAlphaCustomFirst);
                        break;
                    case "alphabeticalembeddedFirst":
                        intResult.sort(this._sortAlphaEmbeddedFirst);
                        break;
                    case "none":
                        // do nothing
                        break;
                    default:
                        break;
                }
                result = $.map(intResult, function (val, key) {
                    return val.op;
                });
                return result;
            };
            filterOperatorsCache.prototype._addOperator = function (name, fop, isCustom) {
                if (typeof isCustom === "undefined") { isCustom = false; }
                if(name && !fop.name) {
                    fop.name = name;
                }
                name = (name || fop.name).toLowerCase();
                if(!this._cache[name]) {
                    this._cache[name] = {
                        op: fop,
                        isCustom: (isCustom === true)
                    };
                }
            };
            filterOperatorsCache.prototype._sortAlpha = function (a, b) {
                var n1 = a.op.name.toLowerCase(), n2 = b.op.name.toLowerCase();
                if(n1 !== n2) {
                    if(n1 === "nofilter") {
                        return -1;
                    }
                    if(n2 === "nofilter") {
                        return 1;
                    }
                }
                if(n1 === n2) {
                    return 0;
                }
                return (n1 < n2) ? -1 : 1;
            };
            filterOperatorsCache.prototype._sortAlphaEmbeddedFirst = function (a, b) {
                var n1 = a.op.name.toLowerCase(), n2 = b.op.name.toLowerCase();
                if(n1 !== n2) {
                    if(n1 === "nofilter") {
                        return -1;
                    }
                    if(n2 === "nofilter") {
                        return 1;
                    }
                }
                if(a.isCustom !== b.isCustom) {
                    if(a.isCustom) {
                        return 1;
                    }
                    if(b.isCustom) {
                        return -1;
                    }
                }
                if(n1 === n2) {
                    return 0;
                }
                return (n1 < n2) ? -1 : 1;
            };
            filterOperatorsCache.prototype._sortAlphaCustomFirst = function (a, b) {
                var n1 = a.op.name.toLowerCase(), n2 = b.op.name.toLowerCase();
                if(n1 !== n2) {
                    if(n1 === "nofilter") {
                        return -1;
                    }
                    if(n2 === "nofilter") {
                        return 1;
                    }
                }
                if(a.isCustom !== b.isCustom) {
                    if(a.isCustom) {
                        return -1;
                    }
                    if(b.isCustom) {
                        return 1;
                    }
                }
                if(n1 === n2) {
                    return 0;
                }
                return (n1 < n2) ? -1 : 1;
            };
            return filterOperatorsCache;
        })();
        grid.filterOperatorsCache = filterOperatorsCache;
        var filterHelper = (function () {
            function filterHelper() { }
            filterHelper.marker = "_wijgrid";
            filterHelper.getSingleValue = // filterValue
            // [filterValue, ..., filterValue]
            // [[filterValue, ..., filterValue], ..., [filterValue, ..., filterValue]]
            function getSingleValue(filterValue) {
                if($.isArray(filterValue)) {
                    filterValue = filterValue[0];
                    if($.isArray(filterValue)) {
                        filterValue = filterValue[0];
                    }
                }
                return filterValue;
            };
            filterHelper.getSingleOperatorName = // filterOperator -> name | { name, condition }
            // filterOperator -> filterOperator | [ filterOperator, ..., filterOperator]
            function getSingleOperatorName(filterOperator) {
                if($.isArray(filterOperator)) {
                    filterOperator = filterOperator[0];
                }
                return filterOperator.name || filterOperator || "";
            };
            filterHelper.verify = // filterOperator: opName | [opName, ..., opName] | [ { name, condition }, ..., { name, condition } ]
            // filterValue: filterValue | [filterValue, ... , filterValue] | [[], ..., []]
            function verify(filterOperator, filterValue, dataType, cache) {
                if(filterOperator) {
                    if($.isArray(filterOperator)) {
                        var i, len, fop = [], fval = [];
                        if(!$.isArray(filterValue)) {
                            filterValue = [
                                filterValue
                            ];
                        }
                        for(i = 0 , len = filterOperator.length; i < len; i++) {
                            if(wijmo.grid.filterHelper._verifySingleOp(filterOperator[i], filterValue[i], dataType, cache)) {
                                fop.push({
                                    name: filterOperator[i].name || filterOperator[i],
                                    condition: filterOperator[i].condition || "or"
                                });
                                fval.push(filterValue ? filterValue[i] : undefined);
                            }
                        }
                        if(fop.length) {
                            return {
                                filterOperator: fop,
                                filterValue: fval
                            };
                        }
                    } else {
                        if(wijmo.grid.filterHelper._verifySingleOp(filterOperator, filterValue, dataType, cache)) {
                            return {
                                filterOperator: // compatibility with old model
                                filterOperator,
                                filterValue: filterValue
                            };
                        }
                    }
                }
                return null;
            };
            filterHelper._verifySingleOp = // filterOpeator: name | { name, condition }
            function _verifySingleOp(filterOperator, filterValue, dataType, cache) {
                if(filterOperator && (filterOperator = (filterOperator.name || filterOperator))) {
                    var fop;
                    filterOperator = (filterOperator || "").toLowerCase();
                    if((filterOperator !== "nofilter" || filterValue !== undefined) && (fop = cache.getByName(filterOperator))) {
                        if(fop.applicableTo === null/*NoFilter*/  || $.inArray(dataType || "string", fop.applicableTo) >= 0) {
                            if(fop.arity === 1 || (fop.arity > 1 && wijmo.grid.filterHelper.getSingleValue(filterValue) !== undefined)) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            };
            return filterHelper;
        })();
        grid.filterHelper = filterHelper;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    /// <reference path="misc.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
                        function getTableSection(table, scope) {
            if(table && !table.nodeType) {
                table = table[0];
            }
            if(table) {
                switch(scope) {
                    case wijmo.grid.rowScope.head:
                        return table.tHead;
                    case wijmo.grid.rowScope.body:
                        if(table.tBodies) {
                            return table.tBodies[0] || null;
                        }
                        break;
                    case wijmo.grid.rowScope.foot:
                        return table.tFoot;
                    default:
                        return table;
                }
            }
            return null;
        }
        grid.getTableSection = getTableSection;
                        function getTableSectionLength(table, scope) {
            var section;
            if(table && !table.nodeType) {
                table = table[0]// jQuery
                ;
            }
            return (table && (section = this.getTableSection(table, scope))) ? section.rows.length : 0;
        }
        grid.getTableSectionLength = getTableSectionLength;
                        function getTableSectionRow(table, scope, rowIndex) {
            var section;
            if(table && !table.nodeType) {
                table = table[0]// jQuery
                ;
            }
            return (table && (section = this.getTableSection(table, scope))) ? (section.rows[rowIndex] || null) : null;
        }
        grid.getTableSectionRow = getTableSectionRow;
                        function readTableSection(table, scope, readAttributes) {
            var ri, rowLen, ci, celLen, domRow, row, expando, rowAttributes, result = [], prevent = function (attrName) {
                attrName = attrName.toLowerCase();
                return attrName === "rowspan" || attrName === "colspan";
            }, section;
            if(table && !table.nodeType) {
                table = table[0]// jQuery
                ;
            }
            if(table && (section = this.getTableSection(table, scope))) {
                for(ri = 0 , rowLen = section.rows.length; ri < rowLen; ri++) {
                    domRow = section.rows[ri];
                    row = [];
                    if(readAttributes) {
                        expando = (wijmo).data.Expando.getFrom(row, true);
                        rowAttributes = expando[wijmo.grid.EXPANDO] = {
                            cellsAttributes: {
                            },
                            rowAttributes: wijmo.grid.getAttributes(domRow) || {
                            }
                        };
                    }
                    for(ci = 0 , celLen = domRow.cells.length; ci < celLen; ci++) {
                        row[ci] = $.trim((domRow.cells[ci]).innerHTML);
                        if(readAttributes) {
                            rowAttributes.cellsAttributes[ci] = wijmo.grid.getAttributes(domRow.cells[ci], prevent) || {
                            };
                        }
                    }
                    result[ri] = row;
                }
            }
            return result;
        }
        grid.readTableSection = readTableSection;
        var htmlTableAccessor = (function () {
            function htmlTableAccessor(domTable, skipOffsets, ensureTBody, ensureColgroup) {
                this._width = 0;
                this._table = domTable;
                this._offsets = [];
                if(ensureColgroup) {
                    // important: colGroup must preceed tBody in a table
                    this.ensureColGroup();
                }
                if(ensureTBody) {
                    this.ensureTBody();
                }
                if(!skipOffsets) {
                    this._buildOffsets();
                }
            }
            htmlTableAccessor.prototype.element = function () {
                return this._table;
            };
            htmlTableAccessor.prototype.width = function () {
                return this._width;
            };
            htmlTableAccessor.prototype.getCellIdx = function (colIdx, rowIdx) {
                return (colIdx < this._width) ? this._offsets[rowIdx][colIdx].cellIdx : -1;
            };
            htmlTableAccessor.prototype.getColumnIdx = function (cellIdx, rowIdx) {
                if(typeof (cellIdx) !== "number") {
                    // domCell
                    var domCell = cellIdx;
                    cellIdx = domCell.cellIndex;
                    rowIdx = domCell.parentNode.rowIndex;
                }
                return (cellIdx < this._width) ? this._offsets[rowIdx][cellIdx].colIdx : -1;
            };
            htmlTableAccessor.prototype.clearSection = function (scope) {
                var start, end, section = wijmo.grid.getTableSection(this._table, scope);
                switch(scope) {
                    case wijmo.grid.rowScope.body:
                        start = this.getSectionLength(wijmo.grid.rowScope.table);
                        end = start + this.getSectionLength(scope) - 1;
                        break;
                    case wijmo.grid.rowScope.foot:
                        start = this.getSectionLength(wijmo.grid.rowScope.table) + this.getSectionLength(wijmo.grid.rowScope.head);
                        end = start + this.getSectionLength(scope) - 1;
                        break;
                    default:
                        // header or whole table
                        start = 0;
                        end = this.getSectionLength(scope) - 1;
                }
                // update DOM
                while(section.rows.length) {
                    section.deleteRow(0);
                }
                // update offsets
                this._offsets.splice(start, end - start + 1);
            };
            htmlTableAccessor.prototype.getSectionLength = function (scope) {
                return wijmo.grid.getTableSectionLength(this._table, scope);
            };
            htmlTableAccessor.prototype.getSectionRow = function (rowIndex, scope) {
                return wijmo.grid.getTableSectionRow(this._table, scope, rowIndex);
            };
            htmlTableAccessor.prototype.forEachColumnCellNatural = // iterates through the table rows using natural cells order
            function (columnIdx, callback, param) {
                var i, rowLen, row, result;
                for(i = 0 , rowLen = this._table.rows.length; i < rowLen; i++) {
                    row = this._table.rows[i];
                    if(columnIdx < row.cells.length) {
                        result = callback(row.cells[columnIdx], i, param);
                        if(result !== true) {
                            return result;
                        }
                    }
                }
                return true;
            };
            htmlTableAccessor.prototype.forEachColumnCell = // iterates through the table rows using colSpan\rowSpan offsets
            function (columnIdx, callback, param) {
                var i, rowLen, row, offsetCellIdx, result;
                for(i = 0 , rowLen = this._offsets.length; i < rowLen; i++) {
                    row = this._table.rows[i];
                    offsetCellIdx = this.getCellIdx(columnIdx, i);
                    if(offsetCellIdx >= 0) {
                        result = callback(row.cells[offsetCellIdx], i, param);
                        if(result !== true) {
                            return result;
                        }
                    }
                }
                return true;
            };
            htmlTableAccessor.prototype.forEachRowCell = // iterates throw the cells of a table row
            function (rowIndex, callback, param) {
                var row = this._table.rows[rowIndex], i, celLen, result;
                for(i = 0 , celLen = row.cells.length; i < celLen; i++) {
                    result = callback(row.cells[i], i, param);
                    if(result !== true) {
                        return result;
                    }
                }
                return true;
            };
            htmlTableAccessor.prototype.colGroupTag = function () {
                var cgs = this._table.getElementsByTagName("colgroup");
                return ((cgs && cgs[0])) || null;
            };
            htmlTableAccessor.prototype.colTags = function () {
                var colGroup = this.colGroupTag();
                return (colGroup && colGroup.getElementsByTagName("col")) || [];
            };
            htmlTableAccessor.prototype.ensureTBody = function () {
                return ((this._table.tBodies && this._table.tBodies[0]) || this._table.appendChild(document.createElement("tbody")));
            };
            htmlTableAccessor.prototype.ensureTHead = function () {
                return (this._table.tHead && this._table.tHead[0]) || this._table.createTHead();
            };
            htmlTableAccessor.prototype.ensureTFoot = function () {
                return (this._table.tFoot && this._table.tFoot[0]) || this._table.createTFoot();
            };
            htmlTableAccessor.prototype.ensureColGroup = function () {
                var colGroup = this._table.getElementsByTagName("colgroup");
                return ((colGroup && colGroup[0]) || this._table.appendChild(document.createElement("colgroup")));
            };
            htmlTableAccessor.prototype.appendCol = function (domCol/*opt*/ ) {
                var colGroup = this.ensureColGroup();
                return ((domCol && colGroup.appendChild(domCol)) || colGroup.appendChild(document.createElement("col")));
            };
            htmlTableAccessor.prototype.removeOffset = function (idx) {
                if(idx >= 0 && idx < this._offsets.length) {
                    if(idx < 0 || (!idx && idx !== 0)) {
                        idx = this._offsets.length - 1// last row
                        ;
                    }
                    this._offsets.splice(idx, 1);
                }
            };
            htmlTableAccessor.prototype.insertOffset = function (idx) {
                var row, i;
                if(this._width > 0) {
                    row = [];
                    for(i = 0; i < this._width; i++) {
                        row.push({
                            cellIdx: i,
                            colIdx: i
                        });
                    }
                    if(idx < 0 || (!idx && idx !== 0)) {
                        idx = this._offsets.length// append row
                        ;
                    }
                    this._offsets.splice(idx, 0, row);
                }
            };
            htmlTableAccessor.prototype.rebuildOffsets = function () {
                this._offsets = [];
                this._width = 0;
                this._buildOffsets();
            };
            htmlTableAccessor.prototype._buildOffsets = function () {
                var rowSpan = [], rowOffsets, i, rowLen, row, j, jOffset, celLen, cell, cs, rowSpanLen;
                for(i = 0 , rowLen = this._table.rows.length; i < rowLen; i++) {
                    rowOffsets = [];
                    this._offsets[i] = rowOffsets;
                    row = this._table.rows[i];
                    for(j = 0 , jOffset = 0 , celLen = row.cells.length; j < celLen; j++ , jOffset++) {
                        cell = row.cells[j];
                        // process rowspan
                        for(; rowSpan[jOffset] > 1; jOffset++) {
                            rowSpan[jOffset]--;
                            rowOffsets[jOffset] = {
                                cellIdx: -1,
                                colIdx: -1
                            };
                        }
                        if(!(rowSpan[jOffset] > 1)) {
                            rowSpan[jOffset] = cell.rowSpan;
                        }
                        rowOffsets[jOffset] = {
                            cellIdx: j,
                            colIdx: -1
                        };
                        rowOffsets[j].colIdx = jOffset;
                        // process colspan
                        cs = cell.colSpan;
                        for(; cs > 1; cs--) {
                            rowOffsets[++jOffset] = {
                                cellIdx: -1,
                                colIdx: -1
                            };
                        }
                    }
                    rowSpanLen = rowSpan.length;
                    for(; jOffset < rowSpanLen; jOffset++) {
                        rowSpan[jOffset]--;
                        rowOffsets[jOffset] = {
                            cellIdx: -1,
                            colIdx: -1
                        };
                    }
                    this._width = Math.max(this._width, rowSpanLen);
                }
            };
            return htmlTableAccessor;
        })();
        grid.htmlTableAccessor = htmlTableAccessor;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts" />
    /// <reference path="wijgrid.ts" />
    /// <reference path="misc.ts" />
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /// <summary>
        /// An object that represents a single cell.
        /// </summary>
        var cellInfo = (function () {
            function cellInfo(cellIndex, rowIndex, wijgrid, absolute) {
                if (typeof wijgrid === "undefined") { wijgrid = null; }
                if (typeof absolute === "undefined") { absolute = false; }
                this.__isEdit = false;
                /// <summary>
                /// Creates an object that represents a single cell.
                /// Code example: var cell = new $.wijmo.wijgrid.cellInfo(0, 0, $("#demo").data("wijmo-wijgrid"));
                /// </summary>
                /// <param name="cellIndex">Zero-based index of the required cell inside the corresponding row.</param>
                /// <param name="rowIndex">Zero-based index of the row that contains required cell.</param>
                /// <param name="wijgrid">The wijgrid instance.</param>
                /// <returns type="$.wijmo.wijgrid.cellInfo">Object that represents a single cell.</returns>
                this._wijgrid = wijgrid;
                if(absolute) {
                    this._cia = cellIndex;
                    this._ria = rowIndex;
                } else {
                    this._ci = cellIndex;
                    this._ri = rowIndex;
                }
            }
            cellInfo.outsideValue = new cellInfo(-1, -1, null, true);
            cellInfo.prototype.cellIndexAbs = // public
            function (value) {
                if(arguments.length === 0) {
                    this._ensureCia();
                    return this._cia;
                }
                this._ci = undefined;
                this._cia = value;
            };
            cellInfo.prototype.rowIndexAbs = function (value) {
                if(arguments.length === 0) {
                    this._ensureRia();
                    return this._ria;
                }
                this._ri = undefined;
                this._ria = value;
            };
            cellInfo.prototype.cellIndex = function (value) {
                /// <summary>
                /// Gets the zero-based index of the cell in the row which it corresponds to.
                /// Code example: var index = cellInfoObj.cellIndex();
                /// </summary>
                /// <returns type="Number" integer="true"></returns>
                if(arguments.length === 0) {
                    this._ensureCi();
                    return this._ci;
                }
                this._cia = undefined;
                this._ci = value;
            };
            cellInfo.prototype.column = function () {
                /// <summary>
                /// Gets the associated column object.
                /// Code example: var column = cellInfoObj.column();
                /// </summary>
                /// <returns type="Object"></returns>
                if(this._wijgrid && this._isValid()) {
                    return this._wijgrid._field("visibleLeaves")[this.cellIndexAbs()];
                }
                return null;
            };
            cellInfo.prototype.container = function () {
                /// <summary>
                /// Returns the jQuery object containing a cell content.
                /// Code example: var $container = cellInfoObj.container();
                /// </summary>
                /// <returns type="jQuery" />
                                var tableCell = this.tableCell(), $innerDiv;
                if(tableCell) {
                    $innerDiv = $(tableCell).children("div.wijmo-wijgrid-innercell");
                    if($innerDiv) {
                        return $innerDiv;
                    }
                }
                return null;
            };
            cellInfo.prototype.isEqual = function (value) {
                /// <summary>
                /// Compares the current object with a specified one and indicates whether they are identical.
                /// Code example: var isEqual = cellInfoObj1.isEqual(cellInfoObj2);
                /// </summary
                /// <param name="value" type="$.wijmo.wijgrid.cellInfo">The object to compare</param>
                /// <returns type="Boolean">True if the objects are identical, otherwise false.</returns>
                return (value && (value.rowIndex() === this.rowIndex()) && (value.cellIndex() === this.cellIndex()));
            };
            cellInfo.prototype.row = function () {
                /// <summary>
                /// Gets the accociated row's information.
                /// Code example: var row = cellInfoObj.row();
                /// </summary>
                /// <returns type="object">
                /// Information about associated row.
                ///
                /// The return value has the following properties:
                /// $rows: jQuery object that represents associated rows.
                /// data: associated data.
                /// dataRowIndex: data row index.
                /// dataItemIndex: data item index.
                /// virtualDataItemIndex: virtual data item index.
                /// type: type of the row, one of the $.wijmo.wijgrid.rowType values.
                /// </returns>
                                var rowObj = null, result = null;
                if(this._wijgrid) {
                    rowObj = this._wijgrid._view().rows().item(this.rowIndexAbs());
                    if(rowObj && rowObj.length) {
                        result = this._wijgrid._view()._getRowInfo(rowObj);
                    }
                }
                return result;
            };
            cellInfo.prototype.rowIndex = function (value) {
                /// <summary>
                /// Gets the zero-based index of the row containing the cell.
                /// Code example: var index = cellInfoObj.rowIndex();
                /// </summary>
                /// <returns type="Number" integer="true"></returns>
                if(arguments.length === 0) {
                    this._ensureRi();
                    return this._ri;
                }
                this._ria = undefined;
                this._ri = value;
            };
            cellInfo.prototype.tableCell = function () {
                /// <summary>
                /// Returns the table cell element corresponding to this object.
                /// Code example: var domCell = cellInfoObj.tableCell();
                /// </summary>
                /// <returns type="Object" domElement="true" />
                if(this._wijgrid && this._isValid()) {
                    return this._wijgrid._view().getCell(this.cellIndexAbs(), this.rowIndexAbs());
                }
                return null;
            };
            cellInfo.prototype.value = function (value/*opt*/ ) {
                /// <summary>
                /// Gets or sets underlying cell data.
                /// Code example:
                /// -) Getter:
                ///   var value = cellInfoObj.value();
                /// -) Setter:
                ///   cellInfoObj.value("value");
                /// </summary>
                /// <param name="value" type="Object">Value to set.</param>
                /// <returns type="Object" />
                /// <remarks>
                /// "invalid value" exception will be thrown by the setter if the value does not correspond to associated column.
                /// </remarks>
                                var column, rowInfo, colVal;
                if(this._wijgrid && this._isValid()) {
                    rowInfo = this._wijgrid._view()._getRowInfo(this._wijgrid._rows().item(this.rowIndex()));
                    if(rowInfo.type & wijmo.grid.rowType.data) {
                        column = this.column();
                        if(arguments.length === 0) {
                            // getter
                            colVal = this._wijgrid._dataViewWrapper.getValue(rowInfo.data, column.dataKey);
                            return this._wijgrid._parse(column, colVal);
                        } else {
                            // setter
                            // validation
                            value = this._wijgrid._parse(column, value);
                            if((value === null && column.valueRequired) || ((wijmo.grid.getDataType(column) !== "string") && isNaN(value))) {
                                throw "invalid value";
                            }
                            this._wijgrid._dataViewWrapper.setValue(rowInfo.dataItemIndex, column.dataKey, value);
                        }
                    }
                }
            };
            cellInfo.prototype.toString = function () {
                return this.cellIndex() + ":" + this.rowIndex();
            };
            cellInfo.prototype._clip = // internal
            function (range, absolute) {
                if (typeof absolute === "undefined") { absolute = false; }
                var flag = false, val;
                if(absolute) {
                    if(this.cellIndexAbs() < (val = range.topLeft().cellIndexAbs())) {
                        flag = true;
                        this._cia = val;
                        this._ci = undefined;
                    }
                    if(this.cellIndexAbs() > (val = range.bottomRight().cellIndexAbs())) {
                        flag = true;
                        this._cia = val;
                        this._ci = undefined;
                    }
                    if(this.rowIndexAbs() < (val = range.topLeft().rowIndexAbs())) {
                        flag = true;
                        this._ria = val;
                        this._ri = undefined;
                    }
                    if(this.rowIndexAbs() > (val = range.bottomRight().rowIndexAbs())) {
                        flag = true;
                        this._ria = val;
                        this._ri = undefined;
                    }
                } else {
                    if(this.cellIndex() < (val = range.topLeft().cellIndex())) {
                        flag = true;
                        this._ci = val;
                        this._cia = undefined;
                    }
                    if(this.cellIndex() > (val = range.bottomRight().cellIndex())) {
                        flag = true;
                        this._ci = val;
                        this._cia = undefined;
                    }
                    if(this.rowIndex() < (val = range.topLeft().rowIndex())) {
                        flag = true;
                        this._ri = val;
                        this._ria = undefined;
                    }
                    if(this.rowIndex() > (val = range.bottomRight().rowIndex())) {
                        flag = true;
                        this._ri = val;
                        this._ria = undefined;
                    }
                }
                return flag;
            };
            cellInfo.prototype._clone = function () {
                return new wijmo.grid.cellInfo(this.cellIndex(), this.rowIndex(), this._wijgrid);
            };
            cellInfo.prototype._isValid = function () {
                return this.cellIndex() >= 0 && this.rowIndex() >= 0;
            };
            cellInfo.prototype._isEdit = function (value) {
                if(!arguments.length) {
                    return this.__isEdit;
                }
                this.__isEdit = value;
            };
            cellInfo.prototype._setGridView = function (value) {
                this._wijgrid = value;
            };
            cellInfo.prototype._ensureCia = // internal *
            // * private
            function () {
                if(this._cia === undefined) {
                    if(this._ci === null) {
                        throw "relative index value is undefined";
                    }
                    if(this._ci >= 0) {
                        if(!this._wijgrid) {
                            throw "wijgrid is null";
                        }
                        this._cia = this._ci + this._wijgrid._getDataToAbsOffset().x;
                    } else {
                        this._cia = this._ci;
                    }
                    if(this._cia < 0) {
                        this._cia = -1;
                    }
                }
            };
            cellInfo.prototype._ensureRia = function () {
                if(this._ria === undefined) {
                    if(this._ri === undefined) {
                        throw "relative index value is undefined";
                    }
                    if(this._ri >= 0) {
                        if(!this._wijgrid) {
                            throw "wijgrid is null";
                        }
                        this._ria = this._ri + this._wijgrid._getDataToAbsOffset().y;
                    } else {
                        this._ria = this._ri;
                    }
                    if(this._ria < 0) {
                        this._ria = -1;
                    }
                }
            };
            cellInfo.prototype._ensureCi = function () {
                if(this._ci === undefined) {
                    if(this._cia === undefined) {
                        throw "absolute index value is undefined";
                    }
                    if(this._cia >= 0) {
                        if(!this._wijgrid) {
                            throw "wijgrid is null";
                        }
                        this._ci = this._cia - this._wijgrid._getDataToAbsOffset().x;
                    } else {
                        this._ci = this._cia;
                    }
                    if(this._ci < 0) {
                        this._ci = -1;
                    }
                }
            };
            cellInfo.prototype._ensureRi = function () {
                if(this._ri === undefined) {
                    if(this._ria === undefined) {
                        throw "relative index value is undefined";
                    }
                    if(this._ria >= 0) {
                        if(!this._wijgrid) {
                            throw "wijgrid is null";
                        }
                        this._ri = this._ria - this._wijgrid._getDataToAbsOffset().y;
                    } else {
                        this._ri = this._ria;
                    }
                    if(this._ri < 0) {
                        this._ri = -1;
                    }
                }
            };
            return cellInfo;
        })();
        grid.cellInfo = cellInfo;
        // private *
        var cellInfoRange = (function () {
            function cellInfoRange(topLeft, bottomRight) {
                if(!topLeft || !bottomRight) {
                    throw "invalid arguments";
                }
                this._topLeft = topLeft._clone();
                this._bottomRight = bottomRight._clone();
            }
            cellInfoRange.prototype.bottomRight = function () {
                /// <summary>
                /// Gets the object that represents the bottom right cell of the range.
                /// Code example: var cellInfoObj = range.bottomRight();
                /// </summary>
                /// <returns type="$.wijmo.wijgrid.cellInfo" />
                return this._bottomRight;
            };
            cellInfoRange.prototype.isEqual = function (range) {
                /// <summary>
                /// Compares the current range with a specified range and indicates whether they are identical.
                /// Code example: var isEqual = range1.isEqual(range2);
                /// </summary>
                /// <param name="range" type="$.wijmo.wijgrid.cellInfoRange">Range to compare.</param>
                /// <returns type="Boolean">True if the ranges are identical, otherwise false.</returns>
                return (range && this._topLeft.isEqual(range.topLeft()) && this._bottomRight.isEqual(range.bottomRight()));
            };
            cellInfoRange.prototype.topLeft = function () {
                /// <summary>
                /// Gets the object that represents the top left cell of the range.
                /// Code example: var cellInfoObj = range.topLeft();
                /// </summary>
                /// <returns type="$.wijmo.wijgrid.cellInfo" />
                return this._topLeft;
            };
            cellInfoRange.prototype.toString = function () {
                return this._topLeft.toString() + " - " + this._bottomRight.toString();
            };
            cellInfoRange.prototype._isIntersect = // public *
            // internal
            function (range) {
                var rangeH, thisH, rangeW, thisW;
                if(range) {
                    rangeH = range.bottomRight().rowIndex() - range.topLeft().rowIndex() + 1;
                    thisH = this._bottomRight.rowIndex() - this._topLeft.rowIndex() + 1;
                    if((range.topLeft().rowIndex() + rangeH) - this._topLeft.rowIndex() < rangeH + thisH) {
                        rangeW = range.bottomRight().cellIndex() - range.topLeft().cellIndex() + 1;
                        thisW = this._bottomRight.cellIndex() - this._topLeft.cellIndex() + 1;
                        return ((range.topLeft().cellIndex() + rangeW) - this._topLeft.cellIndex() < rangeW + thisW);
                    }
                }
                return false;
            };
            cellInfoRange.prototype._isValid = function () {
                return this._topLeft._isValid() && this._bottomRight._isValid();
            };
            cellInfoRange.prototype._clip = function (clipBy, absolute) {
                if (typeof absolute === "undefined") { absolute = false; }
                return this._topLeft._clip(clipBy, absolute) || this._bottomRight._clip(clipBy, absolute);
            };
            cellInfoRange.prototype._clone = function () {
                return new cellInfoRange(this._topLeft._clone(), this._bottomRight._clone());
            };
            cellInfoRange.prototype._containsCellInfo = function (info) {
                return (info && info.cellIndex() >= this._topLeft.cellIndex() && info.cellIndex() <= this._bottomRight.cellIndex() && info.rowIndex() >= this._topLeft.rowIndex() && info.rowIndex() <= this._bottomRight.rowIndex());
            };
            cellInfoRange.prototype._containsCellRange = function (range) {
                return (range && this._containsCellInfo(range.topLeft()) && this._containsCellInfo(range.bottomRight()));
            };
            cellInfoRange.prototype._extend = function (mode, borders) {
                if(mode === wijmo.grid.cellRangeExtendMode.toColumn) {
                    this._topLeft.rowIndex(borders.topLeft().rowIndex());
                    this._bottomRight.rowIndex(borders.bottomRight().rowIndex());
                } else {
                    if(mode === wijmo.grid.cellRangeExtendMode.toRow) {
                        this._topLeft.cellIndex(borders.topLeft().cellIndex());
                        this._bottomRight.cellIndex(borders.bottomRight().cellIndex());
                    }
                }
                return this;
            };
            cellInfoRange.prototype._normalize = function () {
                var x0 = this._topLeft.cellIndex(), y0 = this._topLeft.rowIndex(), x1 = this._bottomRight.cellIndex(), y1 = this._bottomRight.rowIndex();
                this._topLeft.cellIndex(Math.min(x0, x1));
                this._topLeft.rowIndex(Math.min(y0, y1));
                this._bottomRight.cellIndex(Math.max(x0, x1));
                this._bottomRight.rowIndex(Math.max(y0, y1));
            };
            return cellInfoRange;
        })();
        grid.cellInfoRange = cellInfoRange;
        // internal *
        // * compatibility: export members to the $.wijmo.wijgrid "namespace" *
        $.extend($.wijmo.wijgrid, {
            cellInfo: wijmo.grid.cellInfo,
            cellInfoRange: wijmo.grid.cellInfoRange
        });
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts" />
    /// <reference path="wijgrid.ts" />
    /// <reference path="misc.ts" />
    /// <reference path="rowAccessor.ts" />
    /// <reference path="filterOperators.ts" />
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var baseView = (function () {
            function baseView(wijgrid, renderBounds) {
                this._rowHeaderSize = 22;
                if(!wijgrid) {
                    throw "'wijgrid' must be specified";
                }
                this._wijgrid = wijgrid;
                this._bounds = renderBounds;
                this._wijgrid.element.addClass("wijmo-wijgrid-table");
            }
            baseView.prototype.dispose = function () {
                this.toggleDOMSelection(true);
                this._wijgrid.element.removeClass("wijmo-wijgrid-table");
            };
            baseView.prototype.ensureDisabledState = function () {
                var disabledClass = "wijmo-wijgrid" + "-disabled " + this._wijgrid.options.wijCSS.stateDisabled, disabled = this._wijgrid.options.disabled, self = this;
                $.each(this.subTables(), function (key, table) {
                    if(table) {
                        var $table = $(table.element());
                        if(disabled) {
                            $table.addClass(disabledClass);
                            self._wijgrid._setAttr($table, "aria-disabled", true);
                        } else {
                            $table.removeClass(disabledClass);
                            self._wijgrid._setAttr($table, "aria-disabled", false);
                        }
                    }
                });
            };
            baseView.prototype.ensureWidth = function (index, value, oldValue) {
                this._setColumnWidth(index, value);
            };
            baseView.prototype.ensureHeight = function (rowIndex) {
            };
            baseView.prototype.getScrollValue = function () {
                return null;
            };
            baseView.prototype.getVisibleAreaBounds = function () {
                throw "not implemented";
            };
            baseView.prototype.getFixedAreaVisibleBounds = function () {
                throw "not implemented";
            };
            baseView.prototype.render = function () {
                this._ensureRenderBounds();
                this._preRender();
                this._renderContent();
                this._postRender();
            };
            baseView.prototype.toggleDOMSelection = function (enable) {
                $.each(this.subTables(), function (index, htmlTableAccessor) {
                    (new wijmo.grid.domSelection(htmlTableAccessor.element())).toggleSelection(enable);
                });
                (new wijmo.grid.domSelection(this._wijgrid.outerDiv)).toggleSelection(enable);
            };
            baseView.prototype.updateSplits = function (scrollValue) {
                throw "not implemented";
            };
            baseView.prototype.bodyRows = // public **
            // ** DOMTable abstraction
            // ** rows accessors
            function () {
                if(!this._bodyRowsAccessor) {
                    this._bodyRowsAccessor = new wijmo.grid.rowAccessor(this, wijmo.grid.rowScope.body, 0, 0);
                }
                return this._bodyRowsAccessor;
            };
            baseView.prototype.filterRow = function () {
                if(this._wijgrid.options.showFilter) {
                    var accessor = new wijmo.grid.rowAccessor(this, wijmo.grid.rowScope.head, 0, 0);
                    return accessor.item(accessor.length() - 1);// filter is the last row in the tHead section

                }
                return null;
            };
            baseView.prototype.headerRows = function () {
                var bottomOffset;
                if(!this._headerRowsAccessor) {
                    bottomOffset = this._wijgrid.options.showFilter ? 1 : 0;
                    this._headerRowsAccessor = new wijmo.grid.rowAccessor(this, wijmo.grid.rowScope.head, 0, bottomOffset);
                }
                return this._headerRowsAccessor;
            };
            baseView.prototype.rows = function () {
                if(!this._rowsAccessor) {
                    this._rowsAccessor = new wijmo.grid.rowAccessor(this, wijmo.grid.rowScope.table, 0, 0);
                }
                return this._rowsAccessor;
            };
            baseView.prototype.focusableElement = // rows accessors **
            function () {
                throw "not implemented";
            };
            baseView.prototype.forEachColumnCell = function (columnIndex, callback, param) {
                throw "not implemented";
            };
            baseView.prototype.forEachRowCell = function (rowIndex, callback, param) {
                throw "not implemented";
            };
            baseView.prototype.getAbsoluteCellInfo = function (domCell) {
                throw "not implemented";
            };
            baseView.prototype.getAbsoluteRowIndex = function (domRow) {
                throw "not implemented";
            };
            baseView.prototype.getCell = function (absColIdx, absRowIdx) {
                throw "not implemented";
            };
            baseView.prototype.getColumnIndex = function (domCell) {
                throw "not implemented";
            };
            baseView.prototype.getHeaderCell = function (absColIdx) {
                throw "not implemented";
            };
            baseView.prototype.getJoinedCols = // [col, col]
            function (columnIndex) {
                throw "not implemented";
            };
            baseView.prototype.getJoinedRows = // [row, row]
            function (rowIndex, rowScope) {
                throw "not implemented";
            };
            baseView.prototype.getJoinedTables = // [table, table, offset:number]
            function (byColumn, index) {
                throw "not implemented";
            };
            baseView.prototype.subTables = function () {
                throw "not implemented";
            };
            baseView.prototype._getMappedScrollMode = // DOMTable abstraction **
            // ** private abstract
            function () {
                var scrollMode = this._wijgrid.options.scrollMode, vScrollBarVisibility = "auto", hScrollBarVisibility = "auto";
                switch(scrollMode) {
                    case "horizontal":
                        vScrollBarVisibility = "hidden";
                        hScrollBarVisibility = "visible";
                        break;
                    case "vertical":
                        vScrollBarVisibility = "visible";
                        hScrollBarVisibility = "hidden";
                        break;
                    case "both":
                        vScrollBarVisibility = "visible";
                        hScrollBarVisibility = "visible";
                        break;
                }
                return {
                    vScrollBarVisibility: vScrollBarVisibility,
                    hScrollBarVisibility: hScrollBarVisibility
                };
            };
            baseView.prototype._postRender = // ** rendering
            function () {
                // Novius OS Fixed : this 2 lines was remove in v2.0.8 but whitout treeGrid drag & drop fail
                // disable or enable DOM selection
                this.toggleDOMSelection(this._wijgrid.options.selectionMode === "none");

                this.ensureDisabledState();
            };
            baseView.prototype._preRender = function () {
                throw "not implemented";
            };
            baseView.prototype._ensureRenderBounds = function () {
                var dataRange = this._wijgrid._getDataCellsRange();
                // render all items of the sketchTable
                this._bounds.start = 0;
                this._bounds.end = dataRange.bottomRight().rowIndex();
            };
            baseView.prototype._renderContent = function () {
                this._renderCOLS();
                this._renderHeader();
                if(this._wijgrid.options.showFilter) {
                    this._renderFilter();
                }
                this._renderBody();
                if(this._wijgrid.options.showFooter) {
                    this._renderFooter();
                }
            };
            baseView.prototype._renderCOLS = function () {
                var visibleLeaves = this._wijgrid._field("visibleLeaves"), leaf, domCol, i, len;
                for(i = 0 , len = visibleLeaves.length; i < len; i++) {
                    leaf = visibleLeaves[i];
                    domCol = this._createCol(leaf, i);
                    this._appendCol(domCol, leaf, i);
                }
            };
            baseView.prototype._renderHeader = function () {
                var $rt = wijmo.grid.rowType, cht = this._wijgrid._columnsHeadersTable(), i, height, rowInfo;
                if(cht && (height = cht.length)) {
                    for(i = 0; i < height; i++) {
                        rowInfo = this._insertEmptyRow($rt.header, i, -1, -1, -1);
                        this._renderRow(rowInfo, null, cht[i]);
                    }
                }
            };
            baseView.prototype._renderFilter = function () {
                var rowInfo = this._insertEmptyRow(wijmo.grid.rowType.filter, -1, -1, -1, -1);
                this._renderRow(rowInfo, this._wijgrid._field("visibleLeaves"), null);
            };
            baseView.prototype._renderBody = function () {
                var $rt = wijmo.grid.rowType, visibleLeaves = this._wijgrid._field("visibleLeaves"), sketch = this._wijgrid.sketchTable, dataRowIndex = -1, virtualDataItemIndexBase = 0, cnt = 0, i, rowInfo, sketchRow, isDataRow, dataOffset = this._wijgrid._dataOffset;
                // >= 0 when server-side virtual scrolling is used.
                                /*if (this._wijgrid._dataStore.dataMode() === $.wijmo.wijgrid.dataMode.dynamical) {
                virtualDataItemIndexBase = this._wijgrid.options.pageIndex * this._wijgrid.options.pageSize;
                }*/
                // render rows
                if(this._bounds.start >= 0) {
                    for(i = this._bounds.start; i <= this._bounds.end; i++) {
                        sketchRow = sketch[i - dataOffset];
                        isDataRow = (sketchRow.rowType & $rt.data) !== 0;
                        rowInfo = this._insertEmptyRow(sketchRow.rowType, cnt++, // sectionRowIndex
                        isDataRow ? ++dataRowIndex : -1, isDataRow ? sketchRow.originalRowIndex : -1, isDataRow ? virtualDataItemIndexBase + sketchRow.originalRowIndex : -1);
                        this._renderRow(rowInfo, visibleLeaves, sketchRow);
                    }
                }
            };
            baseView.prototype._renderFooter = function () {
                var rowInfo = this._insertEmptyRow(wijmo.grid.rowType.footer, -1, -1, -1, -1);
                this._renderRow(rowInfo, this._wijgrid._field("visibleLeaves"), null);
            };
            baseView.prototype._insertEmptyRow = function (rowType, sectionRowIndex, dataRowIndex, dataItemIndex, virtualDataItemIndex) {
                var domRow = this._wijgrid._onViewInsertEmptyRow.apply(this._wijgrid, arguments), domRowArr = this._insertRow(rowType, sectionRowIndex, domRow);
                return this._createRowInfo(domRowArr, rowType, wijmo.grid.renderState.rendering, sectionRowIndex, dataRowIndex, dataItemIndex, virtualDataItemIndex);
            };
            baseView.prototype._createEmptyCell = function (rowInfo, dataCellIndex, column) {
                var rt = wijmo.grid.rowType, domCell = this._wijgrid._onViewCreateEmptyCell.apply(this._wijgrid, arguments);
                return this._createCell(rowInfo.type, domCell);
            };
            baseView.prototype._insertRow = // override
            function (rowType, sectionRowIndex, domRow/* optional, used by c1gridview to clone rows of the original table */ ) {
                throw "not implemented";
            };
            baseView.prototype._createCell = function (rowType, domCell/* optional, used by c1gridview to clone cells of the original table */ ) {
                var rt = wijmo.grid.rowType, innerContainer;
                if(!domCell) {
                    if(rowType === rt.header) {
                        domCell = document.createElement("th");
                    } else {
                        domCell = document.createElement("td");
                    }
                }
                if(rowType !== rt.filter) {
                    // * analogue of domCell.wrapInner("<div class=\"wijmo-wijgrid-innercell\"></div>")
                    innerContainer = document.createElement("div");
                    innerContainer.className = "wijmo-wijgrid-innercell";
                    if(domCell.firstChild) {
                        // move nodes from domCell to innerContainer
                        while(domCell.firstChild) {
                            innerContainer.appendChild(domCell.firstChild);
                        }
                    }
                    domCell.appendChild(innerContainer);
                }
                return $(domCell);
            };
            baseView.prototype._appendCell = function (rowInfo, cellIndex, $cell) {
                throw "not implemented";
            };
            baseView.prototype._createCol = function (column, visibleIdx) {
                throw "not implemented";
            };
            baseView.prototype._appendCol = function (domCol, column, visibleIdx) {
                throw "not implemented";
            };
            baseView.prototype._renderRow = // item is a sketchRow
            function (rowInfo, visibleLeaves, item) {
                var $rt = wijmo.grid.rowType, rowAttr, rowStyle;
                switch(rowInfo.type) {
                    case $rt.filter:
                        this._renderFilterRow(rowInfo, visibleLeaves);
                        break;
                    case $rt.footer:
                        this._renderFooterRow(rowInfo, visibleLeaves);
                        break;
                    case $rt.header:
                        this._renderHeaderRow(rowInfo, item);
                        break;
                    case $rt.data:
                    case $rt.data | $rt.dataAlt:
                        this._renderDataRow(rowInfo, visibleLeaves, item);
                        rowAttr = item.__attr;
                        rowStyle = item.__style;
                        break;
                    case $rt.emptyDataRow:
                    case $rt.groupHeader:
                    case $rt.groupFooter:
                        this._renderSpannedRow(rowInfo, visibleLeaves, item);
                        rowAttr = item.__attr;
                        rowStyle = item.__style;
                        break;
                    default:
                        throw "unknown rowType";
                }
                this._rowRendered(rowInfo, rowAttr, rowStyle);
            };
            baseView.prototype._renderCell = function (rowInfo, cellIndex, value, useHtml, leaf, attr, style) {
                var $cell = this._createEmptyCell(rowInfo, leaf.dataIndex, leaf);
                var $container = (rowInfo.type === wijmo.grid.rowType.filter) ? $cell : $($cell[0].firstChild);// $cell.children("div"); -- slow

                this._appendCell(rowInfo, cellIndex, $cell);
                if(useHtml) {
                    $container.html(value);
                } else {
                    this._wijgrid.cellFormatter.format($container, leaf, value, rowInfo);
                }
                this._cellRendered(rowInfo, $cell, cellIndex, leaf, attr, style);
            };
            baseView.prototype._renderDataRow = function (rowInfo, visibleLeaves, sketchRow) {
                var i, len, leaf, dataIndex, cellValue, cellAttr, cellStyle, useHtml = false;
                for(i = 0 , len = visibleLeaves.length; i < len; i++) {
                    leaf = visibleLeaves[i];
                    dataIndex = leaf.dataIndex;
                    cellValue = null;
                    if(dataIndex >= 0 && (!sketchRow[dataIndex] || (sketchRow[dataIndex].visible === false))) {
                        continue;// spanned cell?

                    }
                    cellValue = (dataIndex >= 0) ? this._wijgrid._toStr(leaf, sketchRow[dataIndex].value) : null// unbounded column
                    ;
                    cellAttr = (dataIndex >= 0) ? sketchRow[dataIndex].__attr : null;
                    cellStyle = (dataIndex >= 0) ? sketchRow[dataIndex].__style : null;
                    this._renderCell(rowInfo, i, cellValue, useHtml, leaf, cellAttr, cellStyle);
                }
            };
            baseView.prototype._renderFilterRow = function (rowInfo, visibleLeaves) {
                var i, len, leaf;
                for(i = 0 , len = visibleLeaves.length; i < len; i++) {
                    leaf = visibleLeaves[i];
                    this._renderCell(rowInfo, i, wijmo.grid.filterHelper.getSingleValue(leaf.filterValue), false, leaf);
                }
            };
            baseView.prototype._renderFooterRow = function (rowInfo, visibleLeaves) {
                var i, len;
                for(i = 0 , len = visibleLeaves.length; i < len; i++) {
                    this._renderCell(rowInfo, i, "", false, visibleLeaves[i]);
                }
            };
            baseView.prototype._renderHeaderRow = function (rowInfo, item) {
                var i, len, thX = 0, headerInfo;
                for(i = 0 , len = item.length; i < len; i++) {
                    headerInfo = item[i];
                    if(headerInfo.column && headerInfo.column.parentVis) {
                        headerInfo.column.thX = thX++;
                        headerInfo.column.thY = rowInfo.sectionRowIndex;
                        this._renderCell(rowInfo, i, headerInfo.column.headerText, false, headerInfo.column, {
                            colSpan: headerInfo.colSpan,
                            rowSpan: headerInfo.rowSpan
                        });
                    }
                }
            };
            baseView.prototype._renderSpannedRow = function (rowInfo, visibleLeaves, sketchRow) {
                var i, leaf, len = Math.min(visibleLeaves.length, sketchRow.length);
                for(i = 0; i < len; i++) {
                    this._renderCell(rowInfo, i, sketchRow[i].html, true, visibleLeaves[i], sketchRow[i].__attr, sketchRow[i].__style);
                }
            };
            baseView.prototype._cellRendered = function (rowInfo, $cell, cellIndex, leaf, attr, style) {
                this._wijgrid.cellStyleFormatter.format($cell, cellIndex, leaf, rowInfo, wijmo.grid.renderState.rendering, attr, style);
                this._changeCellRenderState($cell, wijmo.grid.renderState.rendering, false);
                this._wijgrid._onViewCellRendered(rowInfo, $cell, cellIndex, leaf);
            };
            baseView.prototype._rowRendered = function (rowInfo, rowAttr, rowStyle) {
                this._wijgrid.rowStyleFormatter.format(rowInfo, rowAttr, rowStyle);
                // change renderState AND associate rowInfo object with DOMRow
                //this._changeRowRenderState(rowInfo, $.wijmo.wijgrid.renderState.rendering, false);
                rowInfo.state &= ~wijmo.grid.renderState.rendering;
                this._setRowInfo(rowInfo.$rows, rowInfo);
                this._wijgrid._onViewRowRendered(rowInfo);
            };
            baseView.prototype._isBodyRow = function (rowInfo) {
                var $rt = wijmo.grid.rowType, type = rowInfo.type;
                return ((type & $rt.data) || (type === $rt.groupHeader) || (type === $rt.groupFooter) || (type === $rt.emptyDataRow));
            };
            baseView.prototype._changeRowRenderState = function (rowInfo, state, combine) {
                if(combine) {
                    // combine
                    rowInfo.state |= state;
                } else {
                    // clear
                    rowInfo.state &= ~state;
                }
                this._setRowInfo(rowInfo.$rows, rowInfo);
            };
            baseView.prototype._changeCellRenderState = function ($obj, state, combine) {
                var $dp = wijmo.grid.dataPrefix, prefix = this._wijgrid._data$prefix, prevState = $dp($obj, prefix, "renderState");
                if(combine) {
                    // combine
                    state = prevState | state;
                    $dp($obj, prefix, "renderState", state);
                } else {
                    // clear
                    state = prevState & ~state;
                    $dp($obj, prefix, "renderState", state);
                }
                return state;
            };
            baseView.prototype._adjustWidthArray = // rendering **
            // ** sizing
            function (maxWidthArray, minWidthArray, expectedWidth, ensureColumnsPxWidth, autoExpandColumnIndex) {
                var maxWidth = this._sumWidthArray(maxWidthArray), minWidth = this._sumWidthArray(minWidthArray), widthArray = [], adjustWidth, expandCount = 0, expandWidth, remainingWidth, bFirst = true;
                if(maxWidth <= expectedWidth) {
                    $.extend(true, widthArray, maxWidthArray);
                    if(maxWidth === expectedWidth || ensureColumnsPxWidth) {
                        return widthArray;
                    } else {
                        adjustWidth = expectedWidth - maxWidth;
                    }
                } else {
                    $.extend(true, widthArray, minWidthArray);
                    if(minWidth >= expectedWidth) {
                        return widthArray;
                    } else {
                        adjustWidth = expectedWidth - minWidth;
                    }
                }
                $.each(widthArray, function (index, colWidth) {
                    if(!colWidth.real) {
                        expandCount++;
                    }
                });
                if(expandCount !== 0) {
                    if(autoExpandColumnIndex !== undefined && (autoExpandColumnIndex > -1 && autoExpandColumnIndex < widthArray.length) && !widthArray[autoExpandColumnIndex].real) {
                        widthArray[autoExpandColumnIndex].width += adjustWidth;
                        return widthArray;
                    }
                    expandWidth = Math.floor(adjustWidth / expandCount);
                    remainingWidth = adjustWidth - expandWidth * expandCount;
                    $.each(widthArray, function (index, colWidth) {
                        if(!colWidth.real) {
                            colWidth.width += expandWidth;
                            if(bFirst) {
                                colWidth.width += remainingWidth;
                                bFirst = false;
                            }
                        }
                    });
                }
                return widthArray;
            };
            baseView.prototype._getColumnWidth = function (index, widthArray) {
                var leaf, colWidth, maxW, joinedTables, relIdx, i, table, rows, cell, row, j, len;
                if(widthArray) {
                    leaf = this._wijgrid._field("visibleLeaves")[index];
                    if(leaf._realWidth !== undefined) {
                        colWidth = {
                            width: leaf._realWidth,
                            real: true
                        };
                    } else if(leaf.isRowHeader) {
                        colWidth = {
                            width: this._rowHeaderSize,
                            real: true
                        };
                    } else {
                        maxW = 0;
                        joinedTables = this.getJoinedTables(true, index);
                        relIdx = joinedTables[2];
                        for(i = 0; i < 2; i++) {
                            table = joinedTables[i];
                            if(table !== null) {
                                rows = table.element().rows;
                                if(len = rows.length) {
                                    // try to find row which doesn't contains a spanned cells
                                    for(j = len - 1 , row = null; j >= 0; j--) {
                                        if(rows[j].cells.length === table.width()) {
                                            row = rows[j];
                                            break;
                                        }
                                    }
                                    if(row) {
                                        cell = row.cells[relIdx];
                                        maxW = Math.max(maxW, $(cell).outerWidth());
                                    }
                                }
                            }
                        }
                        colWidth = {
                            width: maxW,
                            real: false
                        };
                    }
                    widthArray.push(colWidth);
                }
            };
            baseView.prototype._setColumnWidth = function (index, px) {
                var th = this.getHeaderCell(index), cols = this.getJoinedCols(index);
                if(px) {
                    $(th).setOutWidth(px);
                    $.each(cols, function (idx, col) {
                        $(col).setOutWidth(px);
                    });
                }
            };
            baseView.prototype._setTableWidth = function (tableArray, expectedWidth, expandColumnWidth, expandIndex) {
                var after, diff;
                $.each(tableArray, function (index, table) {
                    table.css("table-layout", "fixed").setOutWidth(expectedWidth);
                });
                after = tableArray[0].outerWidth();
                diff = after - expectedWidth;
                if(diff !== 0) {
                    this._setColumnWidth(expandIndex, expandColumnWidth - diff);
                }
            };
            baseView.prototype._sumWidthArray = function (widthArray, startIndex, endIndex) {
                var minWidth = 0;
                $.each(widthArray, function (index, colWidth) {
                    if(startIndex !== undefined && endIndex !== undefined && (index < startIndex || index > endIndex)) {
                        return true;
                    }
                    minWidth += colWidth.width;
                });
                return minWidth;
            };
            baseView.prototype._clearBody = // sizing **
            // private abstract **
            function () {
                $.each(this.subTables(), function (key, table) {
                    table.clearSection(2);
                });
            };
            baseView.prototype._rebuildOffsets = function () {
                $.each(this.subTables(), function (key, table) {
                    table.rebuildOffsets();
                });
            };
            baseView.prototype._removeBodyRow = function (sectionRowIndex, affectMetadata) {
                var $rt = wijmo.grid.rowType, rows = this._wijgrid._rows(), i, len, rowInfo, ex, cmp, absRowIdx, joinedTables;
                if((sectionRowIndex >= 0) && (sectionRowIndex < (len = rows.length()))) {
                    if(affectMetadata) {
                        for(i = 0; i < len; i++) {
                            rowInfo = this._getRowInfo(rows.item(i));
                            cmp = rowInfo.sectionRowIndex - sectionRowIndex;
                            if(rowInfo.sectionRowIndex > sectionRowIndex) {
                                rowInfo.sectionRowIndex--;
                                if(rowInfo.type & $rt.data) {
                                    if(rowInfo.type & $rt.dataAlt) {
                                        rowInfo.type &= ~$rt.dataAlt;
                                    } else {
                                        rowInfo.type |= $rt.dataAlt;
                                    }
                                    rowInfo.dataItemIndex--;
                                    rowInfo.dataRowIndex--;
                                    rowInfo.virtualDataItemIndex--;
                                }
                                // this._wijgrid.rowStyleFormatter.format(rowInfo); ??
                                this._setRowInfo(rowInfo.$rows, rowInfo);
                            }
                        }// for

                    }// if (affectMetadata)

                    // remove DOMRows
                    rowInfo = this._getRowInfo(rows.item(sectionRowIndex));
                    absRowIdx = this.getAbsoluteRowIndex(rowInfo.$rows[0]);
                    rowInfo.$rows.remove();
                    // ** update offsets
                    joinedTables = this.getJoinedTables(false, absRowIdx);
                    if(joinedTables[0]) {
                        joinedTables[0].removeOffset(joinedTables[2]);
                    }
                    if(joinedTables[1]) {
                        joinedTables[1].removeOffset(joinedTables[2]);
                    }
                    // update offsets **
                                    }
            };
            baseView.prototype._insertBodyRow = function (sketchRow, sectionRowIndex, dataItemIndex, virtualDataItemIndex) {
                var visibleLeaves = this._wijgrid._field("visibleLeaves"), $rt = wijmo.grid.rowType, view = this._wijgrid._view(), rows = this._wijgrid._rows(), len = rows.length(), isDataRow = ((sketchRow.rowType & $rt.data) !== 0), rowInfo, absRowIdx, joinedTables;
                if(sectionRowIndex < 0 || sectionRowIndex >= len || (!sectionRowIndex && sectionRowIndex !== 0)) {
                    sectionRowIndex = len// append
                    ;
                }
                rowInfo = this._insertEmptyRow(sketchRow.rowType, sectionRowIndex, -1, // TODO: dataRowIndex
                dataItemIndex, virtualDataItemIndex);
                this._renderRow(rowInfo, visibleLeaves, sketchRow);
                // ** update offsets
                absRowIdx = this.getAbsoluteRowIndex(rowInfo.$rows[0]);
                joinedTables = this.getJoinedTables(false, absRowIdx);
                if(joinedTables[0]) {
                    joinedTables[0].insertOffset(absRowIdx);
                }
                if(joinedTables[1]) {
                    joinedTables[1].insertOffset(absRowIdx);
                }
                // update offsets **
                return rowInfo;
            };
            baseView.prototype._findRowInfo = function (callback) {
                var rowsAccessor = this.bodyRows(), i = 0, len = rowsAccessor.length(), rowInfo;
                if($.isFunction(callback)) {
                    for(i = 0; i < len; i++) {
                        rowInfo = this._getRowInfo(rowsAccessor.item(i));
                        if(callback(rowInfo) === true) {
                            return rowInfo;
                        }
                    }
                }
                return null;
            };
            baseView.prototype._setRowInfo = function (obj, rowInfo) {
                var hasRows = "$rows" in rowInfo, hasData = "data" in rowInfo, tmpRows, tmpData;
                if(hasRows) {
                    tmpRows = rowInfo.$rows;
                    delete rowInfo.$rows;
                }
                if(hasData) {
                    tmpData = rowInfo.data;
                    delete rowInfo.data;
                }
                wijmo.grid.dataPrefix(obj, this._wijgrid._data$prefix, "rowInfo", rowInfo);
                if(hasRows) {
                    rowInfo.$rows = tmpRows;
                }
                if(hasData) {
                    rowInfo.data = tmpData;
                }
            };
            baseView.prototype._getRowInfo = function (rowObj) {
                var wijgrid = this._wijgrid, $rows = rowObj[1] ? $(rowObj) : $(rowObj[0]), rowInfo = wijmo.grid.dataPrefix($rows, wijgrid._data$prefix, "rowInfo"), tmp;
                // add $rows property
                rowInfo.$rows = $rows;
                // set data property
                if((rowInfo.dataItemIndex >= 0) && (rowInfo.type & wijmo.grid.rowType.data)) {
                    rowInfo.data = wijgrid._getDataItem(rowInfo.dataItemIndex);
                }
                return rowInfo;
            };
            baseView.prototype._createRowInfo = function (row, type, state, sectionRowIndex, dataRowIndex, dataItemIndex, virtualDataItemIndex) {
                var tmp, rowInfo = {
                    type: type,
                    state: state,
                    sectionRowIndex: sectionRowIndex,
                    dataRowIndex: dataRowIndex,
                    dataItemIndex: dataItemIndex,
                    virtualDataItemIndex: virtualDataItemIndex,
                    $rows: $(row)
                };
                // set data property
                if((dataItemIndex >= 0) && (type & wijmo.grid.rowType.data)) {
                    rowInfo.data = this._wijgrid._getDataItem(dataItemIndex);
                }
                return rowInfo;
            };
            return baseView;
        })();
        grid.baseView = baseView;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts" />
    /// <reference path="wijgrid.ts" />
    /// <reference path="misc.ts" />
    /// <reference path="baseView.ts" />
    /// <reference path="htmlTableAccessor.ts" />
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var flatView = (function (_super) {
            __extends(flatView, _super);
            function flatView(wijgrid, renderBounds) {
                        _super.call(this, wijgrid, renderBounds);
                this._dataTable = null;
                this._contentArea = null;
            }
            flatView.prototype.dispose = function () {
                this._wijgrid.outerDiv.unbind("scroll", this._onScroll);
                _super.prototype.dispose.call(this);
            };
            flatView.prototype.ensureWidth = function (index, value, oldValue) {
                var $table = $(this._dataTable.element()), tableWidth = $table.width() + value - oldValue;
                _super.prototype.ensureWidth.call(this, index, value, oldValue);
                this._setTableWidth([
                    $table
                ], tableWidth, value, index);
            };
            flatView.prototype.getVisibleAreaBounds = function () {
                var dataTableBounds = wijmo.grid.bounds(this._dataTable.element()), splitSEBounds;
                if(this._wijgrid.options.scrollMode === "none") {
                    return dataTableBounds;
                } else {
                    splitSEBounds = wijmo.grid.bounds(this._wijgrid.outerDiv.find(".wijmo-wijgrid-split-area-se:first")[0]);
                    return {
                        top: dataTableBounds.top,
                        left: dataTableBounds.left,
                        width: Math.min(splitSEBounds.width, dataTableBounds.width),
                        height: Math.min(splitSEBounds.height, dataTableBounds.height)
                    };
                }
            };
            flatView.prototype.updateSplits = function (scrollValue) {
                var self = this, wijgrid = this._wijgrid, o = wijgrid.options, gridElement = wijgrid.element, maxWidthArray = [], minWidthArray = [], resultWidthArray = [], visibleLeaves = wijgrid._field("visibleLeaves"), outerDiv = wijgrid.outerDiv, headerWidth, expandIndex;
                gridElement.css({
                    "table-layout": "",
                    "width": ""
                });
                $.each(visibleLeaves, function (index, leaf) {
                    var isPercentage, w = leaf.width;
                    if(w || (w === 0)) {
                        isPercentage = ((typeof (w) === "string") && (w.length > 1) && (w[w.length - 1] === "%"));
                        //convert percent to value
                        if(isPercentage) {
                            w = outerDiv.width() * parseFloat(w) / 100;
                        } else {
                            w = parseFloat(w);
                        }
                        if(leaf.ensurePxWidth || (leaf.ensurePxWidth === undefined && o.ensureColumnsPxWidth)) {
                            leaf._realWidth = w;
                        }
                        self._setColumnWidth(index, w);
                    }
                });
                // read column widths.
                $.each(visibleLeaves, function (index, leaf) {
                    self._getColumnWidth(index, maxWidthArray);
                });
                gridElement.css("width", "1px");
                $.each(visibleLeaves, function (index, leaf) {
                    self._getColumnWidth(index, minWidthArray);
                });
                // headerWidth = outerDiv.innerWidth();
                headerWidth = outerDiv.width()// using width() instead of innerWidth() to exclude padding.
                ;
                resultWidthArray = this._adjustWidthArray(maxWidthArray, minWidthArray, headerWidth, o.ensureColumnsPxWidth, o.autoExpandColumnIndex);
                $.each(resultWidthArray, function (index, colWidth) {
                    var leaf = visibleLeaves[index];
                    if(leaf._realWidth !== undefined) {
                        delete leaf._realWidth;
                        return;
                    }
                    self._setColumnWidth(index, colWidth.width);
                });
                expandIndex = resultWidthArray.length - 1;
                if(expandIndex !== -1) {
                    this._setTableWidth([
                        gridElement
                    ], this._sumWidthArray(resultWidthArray, 0, expandIndex), resultWidthArray[expandIndex].width, expandIndex);
                }
            };
            flatView.prototype.focusableElement = // public **
            // ** DOMTable abstraction
            function () {
                return $(this._dataTable.element());
            };
            flatView.prototype.forEachColumnCell = function (columnIndex, callback, param) {
                return this._dataTable.forEachColumnCell(columnIndex, callback, param);
            };
            flatView.prototype.forEachRowCell = function (rowIndex, callback, param) {
                return this._dataTable.forEachRowCell(rowIndex, callback, param);
            };
            flatView.prototype.getAbsoluteCellInfo = function (domCell) {
                return new wijmo.grid.cellInfo(this.getColumnIndex(domCell), (domCell.parentNode).rowIndex, this._wijgrid, true);
            };
            flatView.prototype.getAbsoluteRowIndex = function (domRow) {
                return domRow.rowIndex;
            };
            flatView.prototype.getCell = function (absColIdx, absRowIdx) {
                var cellIdx = this._dataTable.getCellIdx(absColIdx, absRowIdx), rowObj;
                if(cellIdx >= 0) {
                    rowObj = this.getJoinedRows(absRowIdx, 0);
                    if(rowObj[0]) {
                        return rowObj[0].cells[cellIdx];
                    }
                }
                return null;
            };
            flatView.prototype.getColumnIndex = function (domCell) {
                return this._dataTable.getColumnIdx(domCell);
            };
            flatView.prototype.getHeaderCell = function (absColIdx) {
                var leaf = this._wijgrid._field("visibleLeaves")[absColIdx], headerRow;
                if(leaf && (headerRow = this._wijgrid._headerRows())) {
                    return wijmo.grid.rowAccessor.getCell(headerRow.item(leaf.thY), leaf.thX);
                }
                return null;
            };
            flatView.prototype.getJoinedCols = function (columnIndex) {
                var $colGroup = $(this._dataTable.element()).find("> colgroup");
                if($colGroup.length) {
                    if(columnIndex < $colGroup[0].childNodes.length) {
                        return [
                            $colGroup[0].childNodes[columnIndex],
                            null
                        ];
                    }
                }
                return [
                    null,
                    null
                ];
            };
            flatView.prototype.getJoinedRows = function (rowIndex, rowScope) {
                return [
                    this._dataTable.getSectionRow(rowIndex, rowScope),
                    null
                ];
            };
            flatView.prototype.getJoinedTables = function (byColumn, index) {
                return [
                    this._dataTable,
                    null,
                    index
                ];
            };
            flatView.prototype.subTables = function () {
                return [
                    this._dataTable
                ];
            };
            flatView.prototype._preRender = // DOMTable abstraction **
            // ** private abstract
            //  ** render
            function () {
                this._dataTable = new wijmo.grid.htmlTableAccessor(this._wijgrid.element[0], true, true, true)// skip offsets, ensure tbody + colgroup
                ;
            };
            flatView.prototype._postRender = function () {
                this._wijgrid.element.find("> tbody").addClass(this._wijgrid.options.wijCSS.content + " wijmo-wijgrid-data");
                this._dataTable = new wijmo.grid.htmlTableAccessor(this._wijgrid.element[0])// create with offsets
                ;
                this._wijgrid._setAttr(this._wijgrid.element, {
                    role: "grid",
                    cellpadding: "0",
                    border: "0",
                    cellspacing: "0"
                });
                this._wijgrid.element.css("border-collapse", "separate");
                // Synchronize footer and header elements. The outerDiv element (overflow: hidden) can be scrolled when current cell position is changed.
                this._wijgrid.outerDiv.bind("scroll", {
                    wijgrid: this._wijgrid
                }, $.proxy(this._onScroll, this));
                _super.prototype._postRender.call(this);
            };
            flatView.prototype._insertRow = function (rowType, sectionRowIndex, domRow/* optional, used by c1gridview to clone rows of the original table */ ) {
                var $rt = wijmo.grid.rowType, tableSection;
                switch(rowType) {
                    case $rt.header:
                    case $rt.filter:
                        tableSection = this._dataTable.ensureTHead();
                        break;
                    case $rt.footer:
                        tableSection = this._dataTable.ensureTFoot();
                        break;
                    default:
                        // tbody
                        tableSection = this._dataTable.ensureTBody();
                }
                if(domRow) {
                    // append only
                    return [
                        tableSection.appendChild(domRow)
                    ];
                } else {
                    if(sectionRowIndex > tableSection.rows.length) {
                        sectionRowIndex = -1;
                    }
                    return [
                        tableSection.insertRow(sectionRowIndex)
                    ];
                }
            };
            flatView.prototype._rowRendered = function (rowInfo, rowAttr, rowStyle) {
                var domRow = rowInfo.$rows[0];
                if(!domRow.cells.length && this._isBodyRow(rowInfo)) {
                    domRow.parentNode.removeChild(domRow);
                } else {
                    _super.prototype._rowRendered.call(this, rowInfo, rowAttr, rowStyle);
                }
            };
            flatView.prototype._appendCell = function (rowInfo, cellIndex, $cell) {
                rowInfo.$rows[0].appendChild($cell[0]);
                //rowInfo.$rows.append($cell);
                            };
            flatView.prototype._createCol = function (column, visibleIdx) {
                return [
                    document.createElement("col")
                ];
            };
            flatView.prototype._appendCol = function (domCol, column, visibleIdx) {
                this._dataTable.appendCol(domCol[0]);
            };
            flatView.prototype._onScroll = // render **
            // private abstract **
            // ** private specific
            function (e) {
                if(e.data.wijgrid.$superPanelHeader) {
                    e.data.wijgrid.$superPanelHeader.css("left", e.target.scrollLeft);
                }
                if(e.data.wijgrid.$bottomPagerDiv) {
                    e.data.wijgrid.$bottomPagerDiv.css("left", e.target.scrollLeft);
                }
            };
            return flatView;
        })(grid.baseView);
        grid.flatView = flatView;
        // private specific **
            })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="../../../wijsuperpanel/jquery.wijmo.wijsuperpanel.ts" />
    /// <reference path="../../../wijlist/jquery.wijmo.wijlist.ts" />
    /// <reference path="interfaces.ts" />
    /// <reference path="wijgrid.ts" />
    /// <reference path="misc.ts" />
    /// <reference path="baseView.ts" />
    /// <reference path="uiVirtualScroller.ts" />
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var fixedView = (function (_super) {
            __extends(fixedView, _super);
            function fixedView(wijgrid, renderBounds) {
                        _super.call(this, wijgrid, renderBounds);
                this._verScrollBarSize = 18;
                this._viewTables = {
                };
                // rendered DOM tables
                this._splitAreas = {
                };
                this.element = wijgrid.element// table element
                ;
                this._allowVirtualScrolling = wijgrid._allowVirtualScrolling() , this._staticDataRowIndex = wijgrid._getStaticIndex(true);
                this._staticRowIndex = wijgrid._getRealStaticRowIndex();
                this._staticColumnIndex = wijgrid._getRealStaticColumnIndex();
                this._staticAllColumnIndex = (this._staticColumnIndex === -1) ? -1 : wijgrid._field("visibleLeaves")[this._staticColumnIndex].leavesIdx;
                this._mouseWheelHandler = $.proxy(this._onMouseWheel, this);
            }
            fixedView.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                this._wijgrid.outerDiv.unbind("mousewheel", this._mouseWheelHandler);
            };
            fixedView.prototype.ensureWidth = function (index, value, oldValue) {
                var wijgrid = this._wijgrid, o = wijgrid.options, staticColumnIndex = this._staticColumnIndex, bWest = index <= staticColumnIndex, $tableNW = $(this._viewTables.nw.element()), $tableNE = $(this._viewTables.ne.element()), $tableSW = $(this._viewTables.sw.element()), $tableSE = $(this._viewTables.se.element()), tableArray = bWest ? [
                    $tableNW,
                    $tableSW
                ] : [
                    $tableNE,
                    $tableSE
                ], tableWidth = (bWest ? $tableNW.width() : $tableNE.width()) + value - oldValue, frozener = wijgrid._field("frozener"), scrollValue = this.getScrollValue();
                this._destroySuperPanel();
                _super.prototype.ensureWidth.call(this, index, value, oldValue);
                this._setTableWidth(tableArray, tableWidth, value, index);
                try  {
                    if(staticColumnIndex >= 0) {
                        o.splitDistanceX = $tableNW[0].offsetWidth;
                    } else {
                        o.splitDistanceX = 0;
                    }
                } catch (ex) {
                }
                this._updateSplitAreaBounds(0);
                this._adjustRowsHeights();
                try  {
                    if(this._staticRowIndex >= 0) {
                        o.splitDistanceY = Math.max($tableNW[0].offsetHeight, $tableNE[0].offsetHeight);
                    } else {
                        o.splitDistanceY = 0;
                    }
                } catch (ex) {
                }
                this._updateSplitAreaBounds(1);
                this.refreshPanel(scrollValue);
                frozener.refresh();
            };
            fixedView.prototype.ensureHeight = function (rowIndex) {
                var rowObjsArray, wijgrid = this._wijgrid, o = wijgrid.options, $tableNW = $(this._viewTables.nw.element()), $tableNE = $(this._viewTables.ne.element()), $tableSW = $(this._viewTables.sw.element()), $tableSE = $(this._viewTables.se.element()), frozener = wijgrid._field("frozener"), scrollValue = this.getScrollValue(), maxHeight;
                this._destroySuperPanel();
                if(arguments.length > 0) {
                    rowObjsArray = this.getJoinedRows(rowIndex, 2);
                    this._setRowHeight(rowObjsArray, this._getRowHeight(rowObjsArray));
                }
                $tableSE.css("height", "");
                $tableSW.css("height", "");
                maxHeight = Math.max($tableSE.height(), $tableSW.height());
                $tableSE.height(maxHeight);
                $tableSW.height(maxHeight);
                try  {
                    if(this._staticRowIndex >= 0) {
                        o.splitDistanceY = Math.max($tableNW[0].offsetHeight, $tableNE[0].offsetHeight);
                    } else {
                        o.splitDistanceY = 0;
                    }
                } catch (ex) {
                }
                this._updateSplitAreaBounds(1);
                this.refreshPanel(scrollValue);
                frozener.refresh();
            };
            fixedView.prototype.getScrollValue = // {x, y} or null
            function () {
                var superPanelObj = this._getSuperPanel();
                return superPanelObj ? {
                    x: superPanelObj.options.hScroller.scrollValue,
                    y: superPanelObj.options.vScroller.scrollValue
                } : null;
            };
            fixedView.prototype.getVisibleAreaBounds = function () {
                var bounds = wijmo.grid.bounds(this._wijgrid.outerDiv.find(".wijmo-wijsuperpanel-contentwrapper:first"));
                if(!bounds) {
                    // .wijmo-wijsuperpanel-contentwrapper is not available -- grid is invisible.
                    bounds = wijmo.grid.bounds(this._wijgrid.outerDiv);
                }
                return bounds;
            };
            fixedView.prototype.getFixedAreaVisibleBounds = function () {
                var bounds = this.getVisibleAreaBounds(), neBounds = wijmo.grid.bounds(this._splitAreas.ne), nwBounds = wijmo.grid.bounds(this._splitAreas.nw), horBounds = null, verBounds = null;
                if(neBounds.height || nwBounds.height) {
                    horBounds = {
                        left: bounds.left,
                        top: bounds.top,
                        width: bounds.width,
                        height: Math.min(neBounds.height || nwBounds.height, bounds.height)
                    };
                }
                if(nwBounds.width) {
                    verBounds = {
                        left: bounds.left,
                        top: bounds.top,
                        width: Math.min(nwBounds.width, bounds.width),
                        height: bounds.height
                    };
                }
                return [
                    horBounds,
                    verBounds
                ];
            };
            fixedView.prototype.refreshPanel = function (scrollValue) {
                var self = this, wijgrid = this._wijgrid, options = wijgrid.options, gridWidth = this._getGridWidth(options.scrollMode), panelModes = this._getMappedScrollMode(), needVBar = this._testNeedVBar(wijgrid.outerDiv, wijgrid.element, $(this._viewTables.ne.element()), options.scrollMode, wijgrid._autoHeight), hScrollValue = scrollValue ? scrollValue.x : null, vScrollValue = scrollValue ? scrollValue.y : null;
                this._scroller.width(gridWidth);
                this._splitAreas.ne.width(gridWidth - options.splitDistanceX - (needVBar ? this._verScrollBarSize : 0));
                if(!this._scroller.data("wijmo-wijsuperpanel")) {
                    if(this._allowVirtualScrolling) {
                        this.vsUI = new wijmo.grid.uiVirtualScroller(wijgrid, this._splitAreas.se, // content to scroll
                        options.splitDistanceY)// fixed area height
                        ;
                    }
                    this._scroller.wijsuperpanel({
                        disabled: wijgrid.options.disabled,
                        scroll: $.proxy(this._onScroll, this),
                        bubbleScrollingEvent: true,
                        customScrolling: this._allowVirtualScrolling,
                        vScroller: {
                            scrollBarVisibility: panelModes.vScrollBarVisibility,
                            "scrollValue": scrollValue ? scrollValue.y : null
                        },
                        hScroller: {
                            scrollBarVisibility: panelModes.hScrollBarVisibility,
                            "scrollValue": scrollValue ? scrollValue.x : null
                        },
                        hScrollerActivating: function (e, data) {
                            // auto adjusting height with hscrollbar shown
                            var diff;
                            if(wijgrid._autoHeight) {
                                diff = wijgrid.element.height() + options.splitDistanceY - data.contentLength;
                                if(diff > 0) {
                                    self._scroller.height(self._scroller.height() + diff);
                                    self._scroller.wijsuperpanel("paintPanel");
                                    return false;
                                }
                            }
                            self._splitAreas.sw.height(data.contentLength - options.splitDistanceY);
                        }
                    });
                    this._scroller.find(".wijmo-wijsuperpanel-contentwrapper:first").scroll(function (e) {
                        // * prevent native scrolling to avoid disalignment of the fixed and unfixed areas in IE\ Chrome when partially visible cell gets focus *
                        if((e.target).scrollLeft) {
                            (e.target).scrollLeft = 0;
                        }
                        if((e.target).scrollTop) {
                            (e.target).scrollTop = 0;
                        }
                        e.preventDefault();
                    });
                    if(this._allowVirtualScrolling) {
                        this.vsUI.attach(this._scroller);
                    }
                } else {
                    this._scroller.wijsuperpanel("paintPanel");
                }
                this._scroller.find(".wijmo-wijsuperpanel-hbarcontainer, .wijmo-wijsuperpanel-vbarcontainer").css("zIndex", 5);
            };
            fixedView.prototype.scrollTo = function (currentCell) {
                if(!currentCell.tableCell()) {
                    return;
                }
                var wijgrid = this._wijgrid, o = wijgrid.options, superPanelObj = this._getSuperPanel(), element = currentCell.tableCell(), $dom = element.nodeType ? $(element) : element, contentElement, wrapperElement, visibleLeft, visibleTop, visibleWidth, visibleHeight, elementPosition, elementLeft, elementTop, elementWidth, elementHeight, resultLeft = null, resultTop = null, staticRowIndex, staticColumnIndex, currentRowIndex, currentCellIndex;
                if(superPanelObj && $dom.is(":visible")) {
                    contentElement = (superPanelObj).getContentElement();
                    wrapperElement = contentElement.parent();
                    visibleLeft = parseInt((contentElement.css("left") + "").replace("px", ""), 10) * -1;
                    visibleTop = parseInt((contentElement.css("top") + "").replace("px", ""), 10) * -1;
                    visibleWidth = wrapperElement.outerWidth() - o.splitDistanceX;
                    visibleHeight = wrapperElement.outerHeight() - o.splitDistanceY;
                    elementPosition = $dom.position();
                    elementLeft = elementPosition.left;
                    elementTop = elementPosition.top;
                    elementWidth = $dom.outerWidth();
                    elementHeight = $dom.outerHeight();
                    staticRowIndex = wijgrid._getStaticIndex(true);
                    staticColumnIndex = wijgrid._getStaticIndex(false);
                    currentRowIndex = currentCell.rowIndex();
                    currentCellIndex = currentCell.cellIndex();
                    if(currentRowIndex <= staticRowIndex) {
                        if(currentCellIndex <= staticColumnIndex) {
                            resultLeft = 0;
                            resultTop = 0;
                        } else {
                            elementLeft += visibleLeft;
                            if(elementLeft + elementWidth > visibleLeft + visibleWidth) {
                                visibleLeft = resultLeft = elementLeft + elementWidth - visibleWidth;
                            }
                            if(elementLeft < visibleLeft) {
                                resultLeft = elementLeft;
                            }
                            resultTop = 0;
                        }
                    } else {
                        if(currentCellIndex <= staticColumnIndex) {
                            elementTop += visibleTop;
                            if(elementTop + elementHeight > visibleTop + visibleHeight) {
                                visibleTop = resultTop = elementTop + elementHeight - visibleHeight;
                            }
                            if(elementTop < visibleTop) {
                                resultTop = elementTop;
                            }
                            resultLeft = 0;
                        } else {
                            elementLeft -= o.splitDistanceX;
                            if(elementTop + elementHeight > visibleTop + visibleHeight) {
                                visibleTop = resultTop = elementTop + elementHeight - visibleHeight;
                            }
                            if(elementLeft + elementWidth > visibleLeft + visibleWidth) {
                                visibleLeft = resultLeft = elementLeft + elementWidth - visibleWidth;
                            }
                            if(elementTop < visibleTop) {
                                resultTop = elementTop;
                            }
                            if(elementLeft < visibleLeft) {
                                resultLeft = elementLeft;
                            }
                        }
                    }
                    if(resultLeft !== null) {
                        (superPanelObj).hScrollTo(resultLeft);
                    }
                    if(resultTop !== null) {
                        if(this._allowVirtualScrolling) {
                            //TODO: this.vsUI.scrollToRow(currentCell.row().virtualDataItemIndex);
                                                    } else {
                            (superPanelObj).vScrollTo(resultTop);
                        }
                    }
                }
            };
            fixedView.prototype.updateSplits = function (scrollValue) {
                var wijgrid = this._wijgrid, o = wijgrid.options, headerWidth, self = this, resultWidthArray = [], minWidthArray = [], maxWidthArray = [], staticColumnIndex = // set width to top table th and bottom table td in first row.
                this._staticColumnIndex, expandIndex, mode = o.scrollMode, visibleLeaves = wijgrid._field("visibleLeaves"), $tableSE = $(this._viewTables.se.element()), $tableNE = $(this._viewTables.ne.element()), $tableSW = $(this._viewTables.sw.element()), $tableNW = $(this._viewTables.nw.element()), outerDiv = wijgrid.outerDiv, tmp, i, hasDataRows;
                this._destroySuperPanel();
                outerDiv.unbind("mousewheel", this._mouseWheelHandler);
                /*if (!$tableSE.find("tbody .wijmo-wijgrid-row:not(.wijmo-wijgrid-groupheaderrow):first").length) {
                wijgrid.element.css("width", "100%");
                }*/
                // * if there is no data in table, we must enlarge the table to prevent the width from being 0
                if((tmp = self._viewTables.se.element().tBodies) && (tmp = tmp[0])) {
                    // tmp = tBodies[0]
                    hasDataRows = false;
                    for(i = 0; i < tmp.rows.length; i++) {
                        if(!$(tmp.rows[i]).hasClass("wijmo-wijgrid-groupheaderrow")) {
                            hasDataRows = true;
                            break;
                        }
                    }
                    if(!hasDataRows) {
                        wijgrid.element.css("width", "100%");
                    }
                }
                $.each([
                    $tableSE,
                    $tableNE,
                    $tableSW,
                    $tableNW
                ], function (index, table) {
                    table.css({
                        "table-layout": "",
                        "width": ""
                    });
                });
                // if any column has width option, we will set the width for inner cells.
                $.each(visibleLeaves, function (index, leaf) {
                    var isPercentage, w = leaf.width;
                    if(w || (w === 0)) {
                        isPercentage = ((typeof (w) === "string") && (w.length > 1) && (w[w.length - 1] === "%"));
                        //convert percent to value
                        if(isPercentage) {
                            w = outerDiv.width() * parseFloat(w) / 100;
                        } else {
                            w = parseFloat(w);
                        }
                        if(leaf.ensurePxWidth || (leaf.ensurePxWidth === undefined && o.ensureColumnsPxWidth)) {
                            leaf._realWidth = w;
                        }
                        self._setColumnWidth(index, w);
                    }
                });
                $.each(visibleLeaves, function (index, leaf) {
                    self._getColumnWidth(index, maxWidthArray);
                });
                $.each([
                    $tableNW,
                    $tableNE,
                    $tableSW,
                    $tableSE
                ], function (index, table) {
                    table.css({
                        "width": "1px"
                    });
                });
                $.each(visibleLeaves, function (index, leaf) {
                    self._getColumnWidth(index, minWidthArray);
                });
                //headerWidth = outerDiv.innerWidth();
                headerWidth = outerDiv.width()// using width() instead of innerWidth() to exclude padding.
                ;
                resultWidthArray = this._adjustWidthArray(maxWidthArray, minWidthArray, headerWidth, o.ensureColumnsPxWidth, o.autoExpandColumnIndex);
                $.each(resultWidthArray, function (index, colWidth) {
                    var leaf = visibleLeaves[index];
                    if(leaf._realWidth !== undefined) {
                        delete leaf._realWidth;
                        return;
                    }
                    self._setColumnWidth(index, colWidth.width);
                });
                if(staticColumnIndex >= 0) {
                    expandIndex = staticColumnIndex;
                    this._setTableWidth([
                        $tableNW,
                        $tableSW
                    ], this._sumWidthArray(resultWidthArray, 0, expandIndex), resultWidthArray[expandIndex].width, expandIndex);
                }
                //set the size of area after setting the width of column
                try  {
                    if(staticColumnIndex >= 0) {
                        o.splitDistanceX = $tableNW[0].offsetWidth;
                    } else {
                        o.splitDistanceX = 0;
                    }
                } catch (ex) {
                }
                this._updateSplitAreaBounds(0)//width
                ;
                if(!o.ensureColumnsPxWidth) {
                    $tableNE.parent().width(headerWidth - o.splitDistanceX);
                }
                expandIndex = resultWidthArray.length - 1;
                if(expandIndex !== -1) {
                    this._setTableWidth([
                        $tableNE,
                        $tableSE
                    ], this._sumWidthArray(resultWidthArray, staticColumnIndex + 1, expandIndex), resultWidthArray[expandIndex].width, expandIndex);
                }
                this._adjustRowsHeights();
                //set the size of area after setting the width of column
                try  {
                    if(this._staticRowIndex >= 0) {
                        o.splitDistanceY = Math.max($tableNW[0].offsetHeight, $tableNE[0].offsetHeight);
                    } else {
                        o.splitDistanceY = 0;
                    }
                } catch (ex) {
                }
                this._updateSplitAreaBounds(1)//height
                ;
                //adjust width if showing vertical scrollbar
                if(!o.ensureColumnsPxWidth) {
                    if(this._testNeedVBar(wijgrid.outerDiv, $tableSE, $tableNE, mode, wijgrid._autoHeight)) {
                        headerWidth -= this._verScrollBarSize;
                        resultWidthArray = this._adjustWidthArray(maxWidthArray, minWidthArray, headerWidth, o.ensureColumnsPxWidth, o.autoExpandColumnIndex);
                        $.each(resultWidthArray, function (index, colWidth) {
                            if(!colWidth.real) {
                                self._setColumnWidth(index, colWidth.width);
                            }
                        });
                        if(staticColumnIndex >= 0) {
                            expandIndex = staticColumnIndex;
                            this._setTableWidth([
                                $tableNW,
                                $tableSW
                            ], this._sumWidthArray(resultWidthArray, 0, expandIndex), resultWidthArray[expandIndex].width, expandIndex);
                        }
                        //set the size of area after setting the width of column
                        try  {
                            if(staticColumnIndex >= 0) {
                                o.splitDistanceX = $tableNW[0].offsetWidth;
                            } else {
                                o.splitDistanceX = 0;
                            }
                        } catch (ex) {
                        }
                        this._updateSplitAreaBounds(0)//width
                        ;
                        $tableNE.parent().width(headerWidth - o.splitDistanceX);
                        expandIndex = resultWidthArray.length - 1;
                        if(expandIndex !== -1) {
                            this._setTableWidth([
                                $tableNE,
                                $tableSE
                            ], this._sumWidthArray(resultWidthArray, staticColumnIndex + 1, expandIndex), resultWidthArray[expandIndex].width, expandIndex);
                        }
                        this._adjustRowsHeights();
                        //set the size of area after setting the width of column
                        try  {
                            if(this._staticRowIndex >= 0) {
                                o.splitDistanceY = Math.max($tableNW[0].offsetHeight, $tableNE[0].offsetHeight);
                            } else {
                                o.splitDistanceY = 0;
                            }
                        } catch (ex) {
                        }
                        this._updateSplitAreaBounds(1)//height
                        ;
                    }
                }
                this.refreshPanel(scrollValue)// refresh super panel after width is set.
                ;
                outerDiv.bind("mousewheel", $.proxy(this._mouseWheelHandler, this));
            };
            fixedView.prototype._clearBody = // public **
            // ** DOMTable abstraction
            function () {
                _super.prototype._clearBody.call(this);
            };
            fixedView.prototype.bodyRows = function () {
                var accessor = _super.prototype.bodyRows.call(this);
                return accessor;
            };
            fixedView.prototype.focusableElement = function () {
                return this._wijgrid.outerDiv;
            };
            fixedView.prototype.forEachColumnCell = function (columnIndex, callback, param) {
                var joinedTables = this.getJoinedTables(true, columnIndex), relIdx, callbackRes;
                if(joinedTables[0] !== null) {
                    relIdx = joinedTables[2];
                    callbackRes = joinedTables[0].forEachColumnCell(relIdx, callback, param);
                    if(callbackRes !== true) {
                        return callbackRes;
                    }
                    if(joinedTables[1] !== null) {
                        callbackRes = joinedTables[1].forEachColumnCell(relIdx, callback, param);
                        if(callbackRes !== true) {
                            return callbackRes;
                        }
                    }
                }
                return true;
            };
            fixedView.prototype.forEachRowCell = function (rowIndex, callback, param) {
                var joinedTables = this.getJoinedTables(false, rowIndex), table0 = joinedTables[0], table1 = joinedTables[1], relIdx, callbackResult;
                if(table0 !== null) {
                    relIdx = joinedTables[2];
                    if(relIdx < table0.element().rows.length) {
                        callbackResult = table0.forEachRowCell(relIdx, callback, param);
                        if(callbackResult !== true) {
                            return callbackResult;
                        }
                    }
                    if((table1 !== null) && (relIdx < table1.element().rows.length)) {
                        callbackResult = table1.forEachRowCell(relIdx, callback, param);
                        if(callbackResult !== true) {
                            return callbackResult;
                        }
                    }
                }
                HTMLTableCellElement;
                return true;
            };
            fixedView.prototype.getAbsoluteCellInfo = function (domCell) {
                return new wijmo.grid.cellInfo(this.getColumnIndex(domCell), this.getAbsoluteRowIndex(domCell.parentNode), this._wijgrid, true);
            };
            fixedView.prototype.getAbsoluteRowIndex = function (domRow) {
                var index = domRow.rowIndex, table = domRow.parentNode;
                while(table.tagName.toLowerCase() !== "table") {
                    table = table.parentNode;
                }
                return (table === this._viewTables.nw.element() || table === this._viewTables.ne.element()) ? index : index + this._staticRowIndex + 1;
            };
            fixedView.prototype.getCell = function (absColIdx, absRowIdx) {
                var joinedTablesRow = this.getJoinedTables(false, absRowIdx), joinedTablesCol, relRowIdx, relColIdx, table, cellIdx;
                if(joinedTablesRow[0] !== null) {
                    joinedTablesCol = this.getJoinedTables(true, absColIdx);
                    if(joinedTablesCol[0] !== null) {
                        relRowIdx = joinedTablesRow[2];
                        relColIdx = joinedTablesCol[2];
                        table = null;
                        if(joinedTablesRow[1] !== null) {
                            table = (absColIdx === relColIdx) ? joinedTablesRow[0] : joinedTablesRow[1];
                        } else {
                            table = joinedTablesRow[0];
                        }
                        cellIdx = table.getCellIdx(relColIdx, relRowIdx);
                        if(cellIdx >= 0) {
                            return table.element().rows[relRowIdx].cells[cellIdx];
                        }
                    }
                }
                return null;
            };
            fixedView.prototype.getColumnIndex = function (domCell) {
                var owner = null, htmlTable = null, flag = false, colIdx;
                for(owner = domCell.parentNode; owner.tagName.toLowerCase() !== "table"; owner = owner.parentNode) {
                }
                if(owner !== null) {
                    if(owner === this._viewTables.nw.element()) {
                        htmlTable = this._viewTables.nw;
                    } else {
                        if(owner === this._viewTables.ne.element()) {
                            htmlTable = this._viewTables.ne;
                            flag = true;
                        } else {
                            if(owner === this._viewTables.sw.element()) {
                                htmlTable = this._viewTables.sw;
                            } else {
                                if(owner === this._viewTables.se.element()) {
                                    htmlTable = this._viewTables.se;
                                    flag = true;
                                }
                            }
                        }
                    }
                    if(htmlTable !== null) {
                        colIdx = htmlTable.getColumnIdx(domCell);
                        if(flag) {
                            colIdx += this._staticColumnIndex + 1;
                        }
                        return colIdx;
                    }
                }
                return -1;
            };
            fixedView.prototype.getHeaderCell = function (absColIdx) {
                var leaf = this._wijgrid._field("visibleLeaves")[absColIdx], headerRow;
                if(leaf && (headerRow = this._wijgrid._headerRows())) {
                    return wijmo.grid.rowAccessor.getCell(headerRow.item(leaf.thY), leaf.thX);
                }
                return null;
            };
            fixedView.prototype.getJoinedCols = function (columnIndex) {
                var result = [], joinedTables = this.getJoinedTables(true, columnIndex), relIndex = joinedTables[2];
                joinedTables.splice(joinedTables.length - 1, 1);
                $.each(joinedTables, function (index, table) {
                    result.push(table ? $(table.element()).find("col")[relIndex] : null);
                });
                return result;
            };
            fixedView.prototype.getJoinedRows = function (rowIndex, rowScope) {
                var row0 = null, row1 = null, table0 = null, table1 = null, fixedRowIdx = this._staticRowIndex, fixedColIdx = this._staticColumnIndex, lastColIdx = this._wijgrid._field("visibleLeaves").length - 1, lastRowIdx = this._rowsCountRaw() - 1, allRowsFixed = (fixedRowIdx === lastRowIdx), allsRowUnfixed = (fixedRowIdx < 0), rowsFixedSlice = !allRowsFixed && !allsRowUnfixed, sectionLength = 0;
                if(allRowsFixed || rowsFixedSlice) {
                    if(fixedColIdx >= 0 && fixedColIdx < lastColIdx) {
                        table0 = this._viewTables.nw;
                        table1 = this._viewTables.ne;
                    } else {
                        table0 = (fixedColIdx < 0) ? this._viewTables.ne : this._viewTables.nw;
                    }
                    sectionLength = table0.getSectionLength(rowScope);
                    if(rowIndex < sectionLength) {
                        row0 = table0.getSectionRow(rowIndex, rowScope);
                        if(table1 !== null) {
                            row1 = table1.getSectionRow(rowIndex, rowScope);
                        }
                    }
                }
                if(allsRowUnfixed || (rowsFixedSlice && (row0 === null))) {
                    if(!allsRowUnfixed) {
                        rowIndex -= sectionLength;
                    }
                    if(fixedColIdx >= 0 && fixedColIdx < lastColIdx) {
                        table0 = this._viewTables.sw;
                        table1 = this._viewTables.se;
                    } else {
                        table0 = (fixedColIdx < 0) ? this._viewTables.se : this._viewTables.sw;
                    }
                    row0 = table0.getSectionRow(rowIndex, rowScope);
                    if(table1 !== null) {
                        row1 = table1.getSectionRow(rowIndex, rowScope);
                    }
                }
                return (row0 === null && row1 === null) ? null : [
                    row0,
                    row1
                ];
            };
            fixedView.prototype.getJoinedTables = function (byColumn, index) {
                var t0 = null, t1 = null, idx = index, wijgrid = this._wijgrid, fixedRowIdx = this._staticRowIndex, fixedColIdx = this._staticColumnIndex;
                if(byColumn) {
                    if(index <= fixedColIdx) {
                        t0 = this._viewTables.nw;
                        t1 = this._viewTables.sw;
                    } else {
                        t0 = this._viewTables.ne;
                        t1 = this._viewTables.se;
                        idx = idx - (fixedColIdx + 1);
                    }
                    if(fixedRowIdx < 0) {
                        t0 = null;
                    }
                    if(fixedRowIdx === this._rowsCountRaw() - 1)// fixed row is the last row
                     {
                        t1 = null;
                    }
                } else {
                    if(index <= fixedRowIdx) {
                        t0 = this._viewTables.nw;
                        t1 = this._viewTables.ne;
                    } else {
                        t0 = this._viewTables.sw;
                        t1 = this._viewTables.se;
                        idx = idx - (fixedRowIdx + 1);
                    }
                    if(fixedColIdx < 0) {
                        t0 = null;
                    }
                    if(fixedColIdx === wijgrid._field("leaves").length - 1) {
                        t1 = null;
                    }
                }
                if(t0 === null) {
                    t0 = t1;
                    t1 = null;
                }
                return [
                    t0,
                    t1,
                    idx
                ];
            };
            fixedView.prototype.subTables = function () {
                return [
                    this._viewTables.nw,
                    this._viewTables.ne,
                    this._viewTables.sw,
                    this._viewTables.se
                ];
            };
            fixedView.prototype._getGridWidth = // DOMTable abstraction **
            // ** private abstract
            function (mode) {
                var wijgrid = this._wijgrid, tableWidth = wijgrid.element.outerWidth(true) + wijgrid.options.splitDistanceX, outWidth = wijgrid.outerDiv.innerWidth();
                if(this._testNeedVBar(wijgrid.outerDiv, wijgrid.element, $(this._viewTables.ne.element()), mode, wijgrid._autoHeight)) {
                    tableWidth += this._verScrollBarSize;
                }
                if(tableWidth > outWidth) {
                    tableWidth = outWidth;
                }
                return tableWidth;
            };
            fixedView.prototype._getSuperPanel = function () {
                return this._scroller ? this._scroller.data("wijmo-wijsuperpanel") : null;
            };
            fixedView.prototype._ensureRenderBounds = // ** render
            function () {
                if(this._wijgrid._allowVirtualScrolling()) {
                    this._wijgrid._ensureRenderBounds(this._bounds);
                    if(this._wijgrid._serverSideVirtualScrolling()) {
                        //this._bounds.start = this._wijgrid.options.pageIndex * this._wijgrid.options.pageSize;
                                            }
                    this._bounds.end = this._bounds.start + this._wijgrid.options.pageSize - 1;
                    this._wijgrid._ensureRenderBounds(this._bounds);
                } else {
                    _super.prototype._ensureRenderBounds.call(this)// render all items
                    ;
                }
            };
            fixedView.prototype._renderContent = function () {
                _super.prototype._renderContent.call(this);
            };
            fixedView.prototype._preRender = function () {
                var docFragment = document.createDocumentFragment(), HTA = wijmo.grid.htmlTableAccessor;
                this._wijgrid.outerDiv.wrapInner("<div class=\"wijmo-wijgrid-fixedview\"><div class=\"wijmo-wijgrid-scroller\"><div class=\"wijmo-wijgrid-split-area-se wijmo-wijgrid-content-area\"></div></div></div>");
                this._scroller = this._wijgrid.outerDiv.find(".wijmo-wijgrid-scroller");
                this._scroller.css("padding", 0)// disable padding (inherited)
                ;
                this._scroller.after(this._splitAreas.nw = $("<div class=\"wijmo-wijgrid-split-area wijmo-wijgrid-split-area-nw\" style=\"overflow:hidden;position:absolute;z-index:4;top:0px;left:0px;\"></div>"));
                this._scroller.after(this._splitAreas.ne = $("<div class=\"wijmo-wijgrid-split-area wijmo-wijgrid-split-area-ne\" style=\"overflow:hidden;position:absolute;z-index:4;top:0px;left:0px;\"></div>"));
                this._scroller.after(this._splitAreas.sw = $("<div class=\"wijmo-wijgrid-split-area wijmo-wijgrid-split-area-sw\" style=\"overflow:hidden;position:absolute;z-index:4;top:0px;left:0px;\"></div>"));
                this._splitAreas.se = this._scroller.find(".wijmo-wijgrid-split-area-se:first");
                this._viewTables = {
                    nw: // skip offsets, ensure tbody + colgroup
                    new HTA(docFragment.appendChild(document.createElement("table")), true, true, true),
                    ne: new HTA(docFragment.appendChild(document.createElement("table")), true, true, true),
                    sw: new HTA(docFragment.appendChild(document.createElement("table")), true, true, true),
                    se: new HTA(docFragment.appendChild(this._wijgrid.element[0]), true, true, true)
                };
            };
            fixedView.prototype._postRender = function () {
                var t00, t01, t10, t11, HTA = wijmo.grid.htmlTableAccessor, self = this;
                this._viewTables = {
                    nw: // rebuild with offsets
                    new HTA(t00 = this._viewTables.nw.element()),
                    ne: new HTA(t01 = this._viewTables.ne.element()),
                    sw: new HTA(t10 = this._viewTables.sw.element()),
                    se: new HTA(t11 = this._viewTables.se.element())
                };
                this._splitAreas.nw.empty().append(t00);
                this._splitAreas.ne.empty().append(t01);
                this._splitAreas.sw.empty().append(t10);
                this._splitAreas.se.empty().append(t11);
                $.each(this._viewTables, function (idx, hta) {
                    var $element = $(hta.element());
                    self._wijgrid._setAttr($element, {
                        role: "grid",
                        border: "0",
                        cellpadding: "0",
                        cellspacing: "0"
                    });
                    $element.addClass("wijmo-wijgrid-table").css("border-collapse", "separate").find(// use separate instead of collapse to avoid a disalignment issue in chrome.
                    "> tbody").addClass(self._wijgrid.options.wijCSS.content + " wijmo-wijgrid-data");
                });
                _super.prototype._postRender.call(this);
            };
            fixedView.prototype._rowsCountRaw = function () {
                var t00 = this._viewTables.nw.element(), t01 = this._viewTables.ne.element(), t10 = this._viewTables.sw.element(), t11 = this._viewTables.se.element(), res;
                res = Math.max(t00.rows.length, t01.rows.length) + Math.max(t10.rows.length, t11.rows.length);
                return res;
            };
            fixedView.prototype._createCol = function (column, visibleIdx) {
                return [
                    document.createElement("col"),
                    document.createElement("col")
                ];
            };
            fixedView.prototype._appendCol = function (domCol, column, visibleIdx) {
                if(visibleIdx <= this._staticColumnIndex) {
                    this._viewTables.nw.appendCol(domCol[0]);
                    this._viewTables.sw.appendCol(domCol[1]);
                } else {
                    this._viewTables.ne.appendCol(domCol[0]);
                    this._viewTables.se.appendCol(domCol[1]);
                }
            };
            fixedView.prototype._insertRow = function (rowType, sectionRowIndex, domRow/* optional, used by c1gridview to clone rows of the original table */ ) {
                var $rt = wijmo.grid.rowType, leftSection, rightSection, vt = this._viewTables;
                switch(rowType) {
                    case $rt.header:
                    case $rt.filter:
                        leftSection = vt.nw.ensureTHead();
                        rightSection = vt.ne.ensureTHead();
                        break;
                    case $rt.footer:
                        leftSection = vt.sw.ensureTFoot();
                        rightSection = vt.se.ensureTFoot();
                        break;
                    default:
                        // tbody
                        if(sectionRowIndex <= this._staticDataRowIndex) {
                            leftSection = vt.nw.ensureTBody();
                            rightSection = vt.ne.ensureTBody();
                        } else {
                            sectionRowIndex -= this._staticDataRowIndex + 1// subtracts fixed offset
                            ;
                            leftSection = vt.sw.ensureTBody();
                            rightSection = vt.se.ensureTBody();
                        }
                }
                if(domRow) {
                    // append only
                    return [
                        leftSection.appendChild(domRow),
                        rightSection.appendChild(domRow.cloneNode(false))
                    ];
                } else {
                    return [
                        leftSection.insertRow(sectionRowIndex > leftSection.rows.length ? -1 : sectionRowIndex),
                        rightSection.insertRow(sectionRowIndex > rightSection.rows.length ? -1 : sectionRowIndex)
                    ];
                }
            };
            fixedView.prototype._rowRendered = function (rowInfo, rowAttr, rowStyle) {
                var leftRow = rowInfo.$rows[0], rightRow = rowInfo.$rows[1];
                // Do not remove empty rows from header. The number of header rows in the fixed and unfixed tables should be empty to handle unbanded columns headers correctly when the staticSolumnIndex option is used:
                //
                // row0 |   band  | |  col2  | (rowSpan = 2)
                //      |---------| |--------|
                // row1 |col0|col1| |        | <- empty row
                if(!leftRow.cells.length && this._isBodyRow(rowInfo)) {
                    leftRow.parentNode.removeChild(leftRow);
                    leftRow = null;
                }
                if(!rightRow.cells.length && this._isBodyRow(rowInfo)) {
                    rightRow.parentNode.removeChild(rightRow);
                    rightRow = null;
                }
                if(leftRow || rightRow) {
                    if(!leftRow || !rightRow) {
                        // handle changes
                        rowInfo.$rows = leftRow ? $(leftRow) : $(rightRow);
                    }
                    _super.prototype._rowRendered.call(this, rowInfo, rowAttr, rowStyle);
                }
            };
            fixedView.prototype._appendCell = function (rowInfo, cellIndex, $cell) {
                var staticColIndex = (rowInfo.type !== wijmo.grid.rowType.header) ? this._staticColumnIndex : this._staticAllColumnIndex;
                if(cellIndex <= staticColIndex) {
                    rowInfo.$rows[0].appendChild($cell[0]);
                } else {
                    rowInfo.$rows[1].appendChild($cell[0]);
                }
            };
            fixedView.prototype._getRowHeight = // render **
            function (rowObj, ignoreSpannedCells) {
                if(rowObj[0] && rowObj[1]) {
                    // static columns are used
                                        var lRow = rowObj[0], rRow = rowObj[1], $lRow = $(lRow), $rRow = $(rRow), lRowH, rRowH, customHeight, getRowHeightUsingUnspannedCells = function ($row) {
                        var i, domRow = $row[0], domCell;
                        for(i = 0; i < domRow.cells.length; i++) {
                            domCell = domRow.cells[i];
                            if(!domCell.rowSpan || domCell.rowSpan === 1) {
                                return $(domCell).outerHeight();
                            }
                        }
                        ;
                        return $row.height();
                    };
                    if(customHeight = $.data(lRow, "customHeight")) {
                        // user-defined (inline) height
                        lRowH = rRowH = parseInt(customHeight);
                    } else {
                        $lRow.css("height", "");
                        $rRow.css("height", "");
                        if(ignoreSpannedCells) {
                            // used for header rows
                            lRowH = getRowHeightUsingUnspannedCells($lRow);
                            rRowH = getRowHeightUsingUnspannedCells($rRow);
                        } else {
                            lRowH = $lRow.height();
                            rRowH = $rRow.height();
                        }
                    }
                    return Math.max(lRowH, rRowH);
                }
                return null;
            };
            fixedView.prototype._setRowHeight = function (rowObj, maxHeight) {
                if(rowObj[0] && rowObj[1]) {
                    var $rowObj = [
                        $(rowObj[0]),
                        $(rowObj[1])
                    ], dif;
                    if(maxHeight === null) {
                        return;
                    }
                    maxHeight += 1;
                    $.each($rowObj, function (index, $el) {
                        $el.height(maxHeight);
                        dif = maxHeight - $el.height();
                        if(dif) {
                            $el.height(maxHeight + dif);
                        }
                    });
                }
            };
            fixedView.prototype._adjustRowHeight = function () {
                /// <summary>
                /// Set row height.
                /// </summary>
                /// <param name="index" type="Number">
                /// The index of the column. Start with 0.
                /// </param>
                                var wijgrid = this._wijgrid, fixedColIdx = this._staticColumnIndex, lastColIdx = wijgrid._field("visibleLeaves").length - 1, fixedRowIdx, lastRowIdx, tables, tableNE, tableNEParent, tableNW, tableNWParent, tableSE, tableSEParent, tableSW, tableSWParent, rowCount, i, j, leftRows, rightRows, heightArray = [];
                // setting row height only if grid is divided into leftern and rightern parts
                if(fixedColIdx > -1 && fixedColIdx < lastColIdx) {
                    fixedRowIdx = this._staticRowIndex;
                    lastRowIdx = this._rowsCountRaw() - 1;
                    tables = this._viewTables;
                    // getting the height of northern tables
                    if(fixedRowIdx > -1 && fixedRowIdx <= lastRowIdx) {
                        tableNE = tables.ne.element();
                        tableNEParent = tableNE.parentNode;
                        tableNW = tables.nw.element();
                        tableNWParent = tableNW.parentNode;
                        leftRows = tableNW.rows;
                        rightRows = tableNE.rows;
                        rowCount = leftRows.length;
                        for(i = 0; i < rowCount; i++) {
                            heightArray.push(this._getRowHeight([
                                leftRows[i],
                                rightRows[i]
                            ], true))// row height will be calculated using unspanned cells (TFS issue #33399).
                            ;
                        }
                    }
                    // getting the height of southern tables
                    if(fixedRowIdx >= -1 && fixedRowIdx < lastRowIdx) {
                        tableSE = tables.se.element();
                        tableSEParent = tableSE.parentNode;
                        tableSW = tables.sw.element();
                        tableSWParent = tableSW.parentNode;
                        leftRows = tableSW.rows;
                        rightRows = tableSE.rows;
                        rowCount = leftRows.length;
                        for(i = 0; i < rowCount; i++) {
                            heightArray.push(this._getRowHeight([
                                leftRows[i],
                                rightRows[i]
                            ]));
                        }
                    }
                    // removing elments from dom to improve performance
                    if(fixedRowIdx > -1 && fixedRowIdx <= lastRowIdx) {
                        tableNWParent.removeChild(tableNW);
                        tableNEParent.removeChild(tableNE);
                    }
                    if(fixedRowIdx >= -1 && fixedRowIdx < lastRowIdx) {
                        tableSWParent.removeChild(tableSW);
                        tableSEParent.removeChild(tableSE);
                    }
                    // setting the height of northern tables
                    if(fixedRowIdx > -1 && fixedRowIdx <= lastRowIdx) {
                        leftRows = tableNW.rows;
                        rightRows = tableNE.rows;
                        rowCount = leftRows.length;
                        for(i = 0 , j = 0; i < rowCount; i++) {
                            this._setRowHeight([
                                leftRows[i],
                                rightRows[i]
                            ], heightArray[j++]);
                        }
                    }
                    // setting the height of southern tables
                    if(fixedRowIdx >= -1 && fixedRowIdx < lastRowIdx) {
                        leftRows = tableSW.rows;
                        rightRows = tableSE.rows;
                        rowCount = leftRows.length;
                        for(i = 0; i < rowCount; i++) {
                            this._setRowHeight([
                                leftRows[i],
                                rightRows[i]
                            ], heightArray[j++]);
                        }
                    }
                    // adding elments back to dom to improve performance
                    if(fixedRowIdx > -1 && fixedRowIdx <= lastRowIdx) {
                        tableNWParent.appendChild(tableNW);
                        tableNEParent.appendChild(tableNE);
                    }
                    if(fixedRowIdx >= -1 && fixedRowIdx < lastRowIdx) {
                        tableSWParent.appendChild(tableSW);
                        tableSEParent.appendChild(tableSE);
                    }
                }
            };
            fixedView.prototype._adjustRowsHeights = // private abstract **
            // ** private specific
            function () {
                var $tableSW = $(this._viewTables.sw.element()), $tableSE = $(this._viewTables.se.element()), height;
                $tableSE.css("height", "");
                $tableSW.css("height", "");
                this._adjustRowHeight();
                height = Math.max($tableSE.height(), $tableSW.height());
                $tableSW.height(height);
                $tableSE.height(height);
            };
            fixedView.prototype._destroySuperPanel = function () {
                if(this._scroller.data("wijmo-wijsuperpanel")) {
                    if(this.vsUI) {
                        this.vsUI.dispose();
                    }
                    this._scroller.wijsuperpanel("destroy");
                }
            };
            fixedView.prototype._onScroll = function (event, data) {
                var spInstance = this._getSuperPanel();
                if(this._allowVirtualScrolling) {
                    if(data.dir === "h") {
                        // do horizontal scrolling
                        this._setFixedAreaPosition((spInstance).getContentElement(), data.dir, data.position, data.animationOptions, false);
                        this._setFixedAreaPosition(this._splitAreas.ne, data.dir, data.position, data.animationOptions, true);
                    }
                } else {
                    this._setFixedAreaPosition(data.dir === "h" ? this._splitAreas.ne : this._splitAreas.sw, data.dir, data.position, data.animationOptions, true);
                }
                this._wijgrid._trackScrollingPosition(spInstance.options.hScroller.scrollValue, spInstance.options.vScroller.scrollValue);
            };
            fixedView.prototype._onMouseWheel = function (e, delta) {
                // force superpanel to do scrolling when cursor is placed over then non-scrollable (fixed) areas of the wijgrid.
                                var bounds, dir = (delta > 0) ? "top" : "bottom", isOverFixedArea = false, vPos;
                if(this._wijgrid._canInteract()) {
                    bounds = this.getFixedAreaVisibleBounds()// an array
                    ;
                    $.each(bounds, function (i, o) {
                        if(o && wijmo.grid.isOver(e.pageY, e.pageX, o.top, o.left, o.height, o.width)) {
                            isOverFixedArea = true;
                            return false;// break

                        }
                    });
                    if(isOverFixedArea && this._scroller.data("wijmo-wijsuperpanel")) {
                        vPos = this._scroller.wijsuperpanel("option", "vScroller").scrollValue;
                        this._scroller.wijsuperpanel("doScrolling", dir);
                        // simulate wijsuperpanel behaviour: prevent window scrolling until superpanel is not scrolled to the end.
                        if(vPos !== this._scroller.wijsuperpanel("option", "vScroller").scrollValue) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                    }
                }
            };
            fixedView.prototype._setFixedAreaPosition = function (element, direction, position, animation, useScrollProp) {
                var prop = {
                }, key;
                if(direction === "h") {
                    key = useScrollProp ? "scrollLeft" : "left";
                } else {
                    key = useScrollProp ? "scrollTop" : "top";
                }
                if(!useScrollProp) {
                    position = -position// invert
                    ;
                }
                if(animation) {
                    prop[key] = position;
                    element.animate(prop, animation);
                } else {
                    if(useScrollProp) {
                        element[0][key] = position;
                    } else {
                        element.css(key, position);
                    }
                }
            };
            fixedView.prototype._testNeedVBar = function (outerDiv, gridElement, tableNE, mode, autoHeight) {
                var excludeVBarWidth, wijgrid = this._wijgrid, gridWidth = tableNE.width() + wijgrid.options.splitDistanceX, gridHeight = gridElement.height() + wijgrid.options.splitDistanceY, outerWidth = outerDiv.width(), outerHeight = outerDiv.height(), contentHeight, topHeight = 0, bottomHeight = 0;
                if(this._allowVirtualScrolling && wijgrid._totalRowsCount() > 1) {
                    // special case -- always display vbar is wijgrid contains more than 1 row.
                    return true;
                }
                if(wijgrid.$superPanelHeader !== null) {
                    topHeight = wijgrid.$superPanelHeader.outerHeight(true);
                }
                if(wijgrid.$bottomPagerDiv !== null) {
                    bottomHeight = wijgrid.$bottomPagerDiv.outerHeight(true);
                }
                contentHeight = outerHeight - topHeight - bottomHeight;
                if(mode === "both" || mode === "vertical") {
                    excludeVBarWidth = true;
                } else {
                    excludeVBarWidth = (mode === "auto") && ((gridHeight > contentHeight) || (!autoHeight && gridWidth > outerWidth && gridHeight > contentHeight - this._verScrollBarSize))// When the height needs to be auto adjusted, the vertical scrollbar should not be shown
                    ;
                }
                return excludeVBarWidth;
            };
            fixedView.prototype._updateSplitAreaBounds = //bSet: 0-width, 1-height, 2-all
            function (bSet) {
                var wijgrid = this._wijgrid, o = wijgrid.options, controlHeight, contentHeight, topHeight = 0, bottomHeight = 0;
                if(bSet === 0 || bSet === 2) {
                    this._splitAreas.nw.width(o.splitDistanceX);
                    this._splitAreas.sw.width(o.splitDistanceX);
                    this._splitAreas.se.css("marginLeft", o.splitDistanceX);
                    this._splitAreas.ne.css("marginLeft", o.splitDistanceX);
                }
                if(bSet === 1 || bSet === 2) {
                    this._scroller.css("height", "");
                    this._splitAreas.se.css("marginTop", 0);
                    controlHeight = wijgrid.outerDiv.height();
                    if(!wijgrid._autoHeight) {
                        this._scroller.height(controlHeight);
                    } else {
                        // no height is set for outer div, we need to expand the grid.
                        this._scroller.height(controlHeight + o.splitDistanceY);
                        //this._noHeight = true;
                                            }
                    this._splitAreas.nw.height(o.splitDistanceY);
                    this._splitAreas.ne.height(o.splitDistanceY);
                    if(wijgrid.$superPanelHeader !== null) {
                        topHeight = wijgrid.$superPanelHeader.outerHeight(true);
                    }
                    if(wijgrid.$bottomPagerDiv !== null) {
                        bottomHeight = wijgrid.$bottomPagerDiv.outerHeight(true);
                    }
                    contentHeight = controlHeight - topHeight - bottomHeight;
                    if(wijgrid.$superPanelHeader !== null) {
                        this._splitAreas.nw.css("top", topHeight + "px");
                        this._splitAreas.ne.css("top", topHeight + "px");
                    }
                    if(!wijgrid._autoHeight) {
                        this._splitAreas.sw.height(contentHeight - o.splitDistanceY);
                    } else {
                        this._splitAreas.sw.height(contentHeight);
                    }
                    this._splitAreas.sw.css("top", o.splitDistanceY + topHeight);
                    this._splitAreas.se.css("marginTop", o.splitDistanceY);
                }
            };
            return fixedView;
        })(grid.baseView);
        grid.fixedView = fixedView;
        // private specific **
            })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts" />
    /// <reference path="wijgrid.ts" />
    /// <reference path="misc.ts" />
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /// <summary>
        /// Object that represents selection in the grid.
        /// Code example: var selection = new $.wijmo.wijgrid.selection(gridView);
        /// </summary>
        /// <param name="gridview" type="$.wijmo.wijgrid" mayBeNull="false">gridView</param>
        /// <returns type="$.wijmo.wijgrid.selection">Object that represents selection in the grid</returns>
        var selection = (function () {
            function selection(wijgrid) {
                this._updates = 0;
                this._selectedColumns = null;
                // ?
                this._selectedRows = null;
                // ?
                // n: none (0), c: extendToColumn (1), r: extendToRow (2)
                //
                //              extendMode
                // selectionMode| n | c | r
                // ------------------------
                // singlecell   | n | n | n
                // singlecolumn | c | c | c
                // singlerow    | r | r | r
                // singlerange  | n | c | r
                // multicolumn  | c | c | c
                // multirow     | r | r | r
                // multirange   | n | c | r
                this._extend_rules = {
                    "singlecell": [
                        0,
                        0,
                        0
                    ],
                    "singlecolumn": [
                        1,
                        1,
                        1
                    ],
                    "singlerow": [
                        2,
                        2,
                        2
                    ],
                    "singlerange": [
                        0,
                        1,
                        2
                    ],
                    "multicolumn": [
                        1,
                        1,
                        1
                    ],
                    "multirow": [
                        2,
                        2,
                        2
                    ],
                    "multirange": [
                        0,
                        1,
                        2
                    ]
                };
                if(!wijgrid) {
                    throw "invalid arguments";
                }
                this._wijgrid = wijgrid;
                this._addedCells = new cellInfoOrderedCollection(wijgrid);
                this._removedCells = new cellInfoOrderedCollection(wijgrid);
                this._selectedCells = new cellInfoOrderedCollection(wijgrid);
                this._addedDuringCurTransactionCells = new cellInfoOrderedCollection(wijgrid);
            }
            selection.prototype.selectedCells = function () {
                /// <summary>
                /// Gets a read-only collection of the selected cells.
                /// Code example: var selectedCells = selectionObj.selectedCells();
                /// </summary>
                /// <returns type="$.wijmo.wijgrid.cellInfoOrderedCollection"/>
                return this._selectedCells;
            };
            selection.prototype.addColumns = function (start, end/* opt */ ) {
                /// <summary>
                /// Adds a column range to the current selection.
                ///
                /// Usage:
                /// 1. addColumns(0)
                /// 2. addColumns(0, 2)
                ///
                /// The result depends upon the chosen selection mode in the grid. For example, if current selection mode
                /// does not allow multiple selection the previous selection will be removed.
                ///
                /// Code example: selectionObj.addColumns(0);
                /// </summary>
                /// <param name="start" type="Number" integer="true">The index of the first column to select.</param>
                /// <param name="end" type="Number" integer="true">The index of the last column to select. Optional.</param>
                if(!end && end !== 0) {
                    end = start;
                }
                this.addRange(start, 0, end, 0xFFFFFF);
            };
            selection.prototype.addRange = function (cellRange/* x0 */ , y0/* opt */ , x1/* opt */ , y1/* opt */ ) {
                /// <summary>
                /// Adds a cell range to the current selection.
                ///
                /// Usage:
                /// 1. addRange(cellRange)
                /// 2. addRange(x0, y0, x1, y1)
                ///
                /// The result depends upon the chosen selection mode in the grid. For example, if current selection mode
                /// does not allow multiple selection the previous selection will be removed.
                ///
                /// Code example: selectionObj.addRange(0, 0, 1, 1);
                /// </summary>
                /// <param name="cellRange" type="$.wijmo.wijgrid.cellInfoRange">Cell range to select.</param>
                /// <param name="x0" type="Number" integer="true">The x-coordinate that represents the top left cell of the range.</number>
                /// <param name="y0" type="Number" integer="true">The y-coordinate that represents the top left cell of the range.</number>
                /// <param name="x1" type="Number" integer="true">The x-coordinate that represents the bottom right cell of the range.</number>
                /// <param name="y1" type="Number" integer="true">The y-coordinate that represents the bottom right cell of the range.</number>
                if(!cellRange && (arguments.length === 1)) {
                    throw "invalid argument";
                }
                var range = (arguments.length === 4) ? new wijmo.grid.cellInfoRange(new wijmo.grid.cellInfo(cellRange/* ie x0 */ , y0), new wijmo.grid.cellInfo(x1, y1)) : cellRange._clone();
                range._normalize();
                if(!range._isValid()) {
                    throw "invalid argument";
                }
                this.beginUpdate();
                this._startNewTransaction(this._wijgrid._field("currentCell"));
                this._selectRange(range, false, true, 0/* none*/ , null);
                this.endUpdate();
            };
            selection.prototype.addRows = function (start, end/* opt */ ) {
                /// <summary>
                /// Adds a row range to the current selection.
                ///
                /// Usage:
                /// 1. addRows(0)
                /// 2. addRows(0, 2)
                ///
                /// The result depends upon the chosen selection mode in the grid. For example, if current selection mode
                /// does not allow multiple selection the previous selection will be removed.
                ///
                /// Code example: selectionObj.addRows(0);
                /// </summary>
                /// <param name="start" type="Number" integer="true">The index of the first row to select.</param>
                /// <param name="end" type="Number" integer="true">The index of the last row to select. Optional.</param>
                if(!end && end !== 0) {
                    end = start;
                }
                this.addRange(0, start, 0xFFFFFF, end);
            };
            selection.prototype.removeRange = function (cellRange/* x0 */ , y0/* opt */ , x1/* opt */ , y1/* opt */ ) {
                /// <summary>
                /// Removes a cell range from the current selection.
                ///
                /// Usage:
                /// 1. removeRange(cellRange)
                /// 2. removeRange(x0, y0, x1, y1)
                ///
                /// The result depends upon the chosen selection mode in the grid.
                ///
                /// Code example: selectionObj.removeRange(0, 0, 1, 1);
                /// </summary>
                /// <param name="cellRange" type="$.wijmo.wijgrid.cellInfoRange">Cell range to remove.</param>
                /// <param name="x0" type="Number" integer="true">The x-coordinate that represents the top left cell of the range.</number>
                /// <param name="y0" type="Number" integer="true">The y-coordinate that represents the top left cell of the range.</number>
                /// <param name="x1" type="Number" integer="true">The x-coordinate that represents the bottom right cell of the range.</number>
                /// <param name="y1" type="Number" integer="true">The y-coordinate that represents the bottom right cell of the range.</number>
                if(!cellRange && (arguments.length === 1)) {
                    throw "invalid argument";
                }
                var range = (arguments.length === 4) ? new wijmo.grid.cellInfoRange(new wijmo.grid.cellInfo(cellRange, y0), new wijmo.grid.cellInfo(x1, y1)) : cellRange._clone();
                range._normalize();
                if(!range._isValid()) {
                    throw "invalid argument";
                }
                this.beginUpdate();
                this._startNewTransaction(this._wijgrid._field("currentCell"));
                this._clearRange(range, 0/* none */ );
                this.endUpdate();
            };
            selection.prototype.removeColumns = function (start, end/* opt */ ) {
                /// <summary>
                /// Removes a column range from the current selection.
                ///
                /// Usage:
                /// 1. removeColumns(0)
                /// 2. removeColumns(0, 2)
                ///
                /// The result depends upon the chosen selection mode in the grid.
                ///
                /// Code example: selectionObj.removeColumns(0);
                /// </summary>
                /// <param name="start" type="Number" integer="true">The index of the first column to remove.</param>
                /// <param name="end" type="Number" integer="true">The index of the last column to remove. Optional.</param>
                if(!end && end !== 0) {
                    end = start;
                }
                this.removeRange(start, 0, end, 0xFFFFFF);
            };
            selection.prototype.removeRows = function (start, end/* opt */ ) {
                /// <summary>
                /// Removes a row range from the current selection.
                ///
                /// Usage:
                /// 1. removeRows(0)
                /// 2. removeRows(0, 2)
                ///
                /// The result depends upon the chosen selection mode in the grid.
                ///
                /// Code example: selectionObj.removeRows(0);
                /// </summary>
                /// <param name="start" type="Number" integer="true">The index of the first row to remove.</param>
                /// <param name="end" type="Number" integer="true">The index of the last row to remove. Optional.</param>
                if(!end && end !== 0) {
                    end = start;
                }
                this.removeRange(0, start, 0xFFFFFF, end);
            };
            selection.prototype.clear = function () {
                /// <summary>
                /// Clears the selection.
                /// Code example: selectionObj.clear();
                /// </summary>
                this.beginUpdate();
                this._removedCells._clear();
                this._removedCells._addFrom(this._selectedCells);
                this.endUpdate();
            };
            selection.prototype.selectAll = function () {
                /// <summary>
                /// Selects all the cells in a grid.
                ///
                /// The result depends upon the chosen selection mode in the grid.
                /// For example, if the selection mode is "singleCell", only the top left cell will be selected.
                ///
                /// Code example: selectionObj.selectAll();
                /// </summary>
                this.beginUpdate();
                this._selectRange(this._wijgrid._getDataCellsRange(), false, false, 0/* none */ , null);
                this.endUpdate();
            };
            selection.prototype.beginUpdate = function () {
                /// <summary>
                /// Begins the update.
                /// The changes won't have effect until endUpdate() is called.
                /// Code example: selectionObj.beginUpdate();
                /// </summary>
                this._updates++;
            };
            selection.prototype.endUpdate = function () {
                /// <summary>
                /// Ends the update.
                /// The pending changes are executed and the corresponding events are raised.
                /// Code example: selectionObj.endUpdate();
                /// </summary>
                if(this._updates > 0) {
                    this._updates--;
                    if(this._updates === 0) {
                        this.doSelection()// values must be clipped before this step
                        ;
                        if(this._addedCells.length() || this._removedCells.length()) {
                            if(this._selectedColumns !== null) {
                                this._selectedColumns.UnderlyingDataChanged()// notify
                                ;
                            }
                            if(this._selectedRows !== null) {
                                this._selectedRows.UnderlyingDataChanged()// notify
                                ;
                            }
                            this._wijgrid._trigger("selectionChanged", null, {
                                addedCells: this._addedCells,
                                removedCells: this._removedCells
                            });
                        }
                        this._addedCells = new wijmo.grid.cellInfoOrderedCollection(this._wijgrid);
                        this._removedCells._clear();
                    }
                }
            };
            selection.prototype._multipleRangesAllowed = // * internal
            function () {
                var mode = this._wijgrid.options.selectionMode;
                return (mode && ((mode = mode.toLowerCase()) === "multicolumn" || mode === "multirow" || mode === "multirange"));
            };
            selection.prototype._anchorCell = function () {
                return this.__anchorCell;
            };
            selection.prototype._startNewTransaction = function (dataCellInfo) {
                if(dataCellInfo) {
                    this.__anchorCell = dataCellInfo._clone();
                    this._addedDuringCurTransactionCells = new wijmo.grid.cellInfoOrderedCollection(this._wijgrid);
                }
            };
            selection.prototype._clearRange = function (range, extendMode) {
                var selectionMode = this._wijgrid.options.selectionMode.toLowerCase(), rangeToClear, rowsLen, cellsLen, flag, row, cell, i, len, cellInfo, dataRange = this._wijgrid._getDataCellsRange();
                if(range._isValid() && (selectionMode !== "none") && (this._selectedCells.length() > 0)) {
                    rangeToClear = range._clone();
                    rangeToClear._normalize();
                    rangeToClear._clip(dataRange);
                    if(!range._isValid()) {
                        return;
                    }
                    // extend
                    rangeToClear._extend(this._extend_rules[selectionMode][extendMode], dataRange);
                    this.beginUpdate();
                    // remove selected cells only, do not use doRange(rangeToClear, false) here.
                    for(i = 0 , len = this._selectedCells.length(); i < len; i++) {
                        cellInfo = this._selectedCells.item(i);
                        if(rangeToClear._containsCellInfo(cellInfo)) {
                            this._removedCells._add(cellInfo);
                        }
                    }
                    this.endUpdate();
                }
            };
            selection.prototype._selectRange = function (range, ctrlKey, shiftKey, extendMode, endPoint) {
                var selectionMode = this._wijgrid.options.selectionMode.toLowerCase(), rangeToSelect, dataRange = this._wijgrid._getDataCellsRange();
                if((selectionMode !== "none") && range._isValid()) {
                    rangeToSelect = range._clone();
                    rangeToSelect._normalize();
                    rangeToSelect._clip(dataRange);
                    if(!rangeToSelect._isValid()) {
                        return;
                    }
                    this.beginUpdate();
                    if(!this._multipleRangesAllowed()) {
                        this.clear();
                    } else {
                        if(ctrlKey || shiftKey) {
                            if(shiftKey) {
                                this._removedCells._clear();
                                this._removedCells._addFrom(this._addedDuringCurTransactionCells);
                            }
                        } else {
                            this.clear();
                        }
                    }
                    // truncate range by selectionMode
                    switch(selectionMode) {
                        case "singlecell":
                        case "singlecolumn":
                        case "singlerow":
                            rangeToSelect = (endPoint === null) ? new wijmo.grid.cellInfoRange(rangeToSelect.topLeft(), rangeToSelect.topLeft()) : // top-left cell only is taken into consideration.
                            new wijmo.grid.cellInfoRange(endPoint, endPoint);
                            break;
                    }
                    // extend
                    rangeToSelect._extend(this._extend_rules[selectionMode][extendMode], dataRange);
                    // do selection
                    this.doRange(rangeToSelect, true);
                    this.endUpdate();
                }
            };
            selection.prototype.doSelection = // * internal
            // * private
            function () {
                var offsets = this._wijgrid._getDataToAbsOffset(), cellOffset = offsets.x, rowOffset = offsets.y, view = this._wijgrid._view(), i, len, info, cell, $cell, index, $rs = wijmo.grid.renderState, rowInfo, state, prevRowIndex = -1;
                for(i = 0 , len = this._removedCells.length(); i < len; i++) {
                    info = this._removedCells.item(i);
                    if(this._addedCells.indexOf(info) < 0) {
                        cell = view.getCell(info.cellIndex() + cellOffset, info.rowIndex() + rowOffset);
                        if(cell) {
                            if(prevRowIndex !== info.rowIndex()) {
                                rowInfo = info.row();
                                prevRowIndex = info.rowIndex();
                            }
                            $cell = $(cell);
                            state = view._changeCellRenderState($cell, $rs.selected, false);
                            this._wijgrid.cellStyleFormatter.format($cell, info.cellIndex(), info.column(), rowInfo, state);
                        }
                        this._selectedCells._remove(info);
                        this._addedDuringCurTransactionCells._remove(info);
                    } else {
                        this._removedCells._removeAt(i);
                        i--;
                        len--;
                    }
                }
                prevRowIndex = -1;
                for(i = 0 , len = this._addedCells.length(); i < len; i++) {
                    info = this._addedCells.item(i);
                    index = this._selectedCells.indexOf(info);
                    if(index < 0) {
                        cell = view.getCell(info.cellIndex() + cellOffset, info.rowIndex() + rowOffset);
                        if(cell) {
                            if(prevRowIndex !== info.rowIndex()) {
                                rowInfo = info.row();
                                prevRowIndex = info.rowIndex();
                            }
                            $cell = $(cell);
                            state = view._changeCellRenderState($cell, $rs.selected, true);
                            this._wijgrid.cellStyleFormatter.format($cell, info.cellIndex(), info.column(), rowInfo, state);
                        }
                        this._selectedCells._insertUnsafe(info, ~index);
                        this._addedDuringCurTransactionCells._add(info);
                    } else {
                        this._addedCells._removeAt(i);
                        i--;
                        len--;
                    }
                }
            };
            selection.prototype.doRange = function (range, add) {
                var x0 = range.topLeft().cellIndex(), y0 = range.topLeft().rowIndex(), x1 = range.bottomRight().cellIndex(), y1 = range.bottomRight().rowIndex(), cnt, row, col, cell, view = this._wijgrid._view(), rowInfo, rows;
                if(add) {
                    cnt = this._addedCells.length();
                    rows = this._wijgrid._rows();
                    for(row = y0; row <= y1; row++) {
                        rowInfo = view._getRowInfo(rows.item(row));
                        if(rowInfo.type & wijmo.grid.rowType.data) {
                            for(col = x0; col <= x1; col++) {
                                cell = new wijmo.grid.cellInfo(col, row);
                                if(cnt === 0) {
                                    this._addedCells._appendUnsafe(cell);
                                } else {
                                    this._addedCells._add(cell);
                                }
                            }
                        }
                    }
                } else {
                    cnt = this._removedCells.length();
                    for(row = y0; row <= y1; row++) {
                        for(col = x0; col <= x1; col++) {
                            cell = new wijmo.grid.cellInfo(col, row);
                            if(cnt === 0) {
                                this._removedCells._appendUnsafe(cell);
                            } else {
                                this._removedCells._add(cell);
                            }
                        }
                    }
                }
            };
            return selection;
        })();
        grid.selection = selection;
        // * private
        /// <summary>
        /// Creates an ordered read-only collection of $.wijmo.wijgrid.cellInfo objects.
        /// Code example: var collection = new $.wijmo.wijgrid.cellInfoOrderedCollection(gridView);
        /// </summary>
        /// <param name="gridView" type="$.wijmo.wijgrid" mayBeNull="false">gridView</param>
        /// <returns type="$.wijmo.wijgrid.cellInfoOrderedCollection" />
        var cellInfoOrderedCollection = (function () {
            function cellInfoOrderedCollection(wijgrid) {
                this._clear = function () {
                    this._list.length = 0;
                };
                if(!wijgrid) {
                    throw "invalid arguments";
                }
                this._wijgrid = wijgrid;
                this._list = [];
            }
            cellInfoOrderedCollection.prototype.item = // public
            function (index) {
                /// <summary>
                /// Gets an item at the specified index.
                /// Code example: var cellInfoObj = collection.item(0);
                /// </summary>
                /// <param name="index" type="Number" integer="true">The zero-based index of the item to get.</param>
                /// <returns type="$.wijmo.wijgrid.cellInfo">The $.wijmo.wijgrid.cellInfo object at the specified index.</returns>
                return this._list[index];
            };
            cellInfoOrderedCollection.prototype.length = function () {
                /// <summary>
                /// Gets the total number of the items in the collection.
                /// Code example: var len = collection.length();
                /// </summary>
                /// <returns type="Number" integet="true">The total number of the items in the collection.</returns>
                return this._list.length;
            };
            cellInfoOrderedCollection.prototype.indexOf = // (cellInfo)
            // (cellIndex, rowIndex)
            function (cellIndex, rowIndex) {
                /// <summary>
                /// Returns the zero-based index of specified collection item.
                ///
                /// Usage:
                /// 1. indexOf(cellInfo) (note: search is done by value, not by reference).
                /// 2. indexOf(cellIndex, rowIndex)
                ///
                /// Code example: var index = collection.indexOf(0, 0);
                /// </summary>
                ///
                /// <param name="cellInfo" type="$.wijmo.wijgrid.cellInfo">A cellInfo object to return the index of.</param>
                /// <param name="cellIndex" type="Number" integer="true">A zero-based cellIndex component of the cellInfo object to return the index of.</param>
                /// <param name="rowIndex" type="Number" integer="true">A zero-based rowIndex component of the cellInfo object to return the index of.</param>
                /// <returns type="Number" integer="true">The zero-based index of the specified object, or -1 if the specified object is not a member of the collection.</returns>
                if(arguments.length === 1) {
                    rowIndex = cellIndex.rowIndex();
                    cellIndex = cellIndex.cellIndex();
                }
                var lo = 0, hi = this._list.length - 1, med, current, cmp;
                while(lo <= hi) {
                    med = lo + ((hi - lo) >> 1);
                    current = this._list[med];
                    cmp = current.rowIndex() - rowIndex;
                    if(cmp === 0) {
                        cmp = current.cellIndex() - cellIndex;
                    }
                    if(cmp < 0) {
                        lo = med + 1;
                    } else {
                        if(cmp > 0) {
                            hi = med - 1;
                        } else {
                            return med;
                        }
                    }
                }
                return ~lo;
            };
            cellInfoOrderedCollection.prototype.toString = function () {
                var val = "", i, len;
                for(i = 0 , len = this._list.length; i < len; i++) {
                    val += this._list[i].toString() + "\n";
                }
                return val;
            };
            cellInfoOrderedCollection.prototype._add = // public *
            // internal
            function (value) {
                var idx = this.indexOf(value);
                if(idx < 0) {
                    this._list.splice(~idx, 0, value);
                    value._setGridView(this._wijgrid);
                    return true;
                }
                return false;
            };
            cellInfoOrderedCollection.prototype._addFrom = function (addFrom) {
                if(addFrom) {
                    var fromLen = addFrom.length(), thisLen = this._list.length, i;
                    if(thisLen === 0) {
                        this._list.length = fromLen;
                        for(i = 0; i < fromLen; i++) {
                            this._list[i] = addFrom.item(i);
                            this._list[i]._setGridView(this._wijgrid);
                        }
                    } else {
                        for(i = 0; i < fromLen; i++) {
                            this._add(addFrom.item(i));
                        }
                    }
                }
            };
            cellInfoOrderedCollection.prototype._appendUnsafe = function (value) {
                this._list[this._list.length] = value;
                value._setGridView(this._wijgrid);
            };
            cellInfoOrderedCollection.prototype._insertUnsafe = function (value, index) {
                this._list.splice(index, 0, value);
            };
            cellInfoOrderedCollection.prototype._remove = function (value) {
                var idx = this.indexOf(value);
                if(idx >= 0) {
                    this._list.splice(idx, 1);
                    return true;
                }
                return false;
            };
            cellInfoOrderedCollection.prototype._removeAt = function (index) {
                this._list.splice(index, 1);
            };
            cellInfoOrderedCollection.prototype._getColumnsIndicies = function () {
                var columns = [], len = this._list.length, tmpColumns, i, len2;
                if(len) {
                    tmpColumns = [];
                    for(i = 0; i < len; i++) {
                        tmpColumns[this._list[i].cellIndex()] = 1;
                    }
                    len = tmpColumns.length;
                    len2 = 0;
                    for(i = 0; i < len; i++) {
                        if(tmpColumns[i]) {
                            columns[len2++] = i;
                        }
                    }
                }
                return columns;
            };
            cellInfoOrderedCollection.prototype._getSelectedRowsIndicies = function () {
                var rows = [], len = this._list.length, tmpRows, i, len2;
                if(len) {
                    tmpRows = [];
                    for(i = 0; i < len; i++) {
                        tmpRows[this._list[i].rowIndex()] = 1;
                    }
                    len = tmpRows.length;
                    len2 = 0;
                    for(i = 0; i < len; i++) {
                        if(tmpRows[i]) {
                            rows[len2++] = i;
                        }
                    }
                }
                return rows;
            };
            cellInfoOrderedCollection.prototype._rectangulate = function () {
                var len = this._list.length, x0 = 0xFFFFFFFF, y0 = 0xFFFFFFFF, x1 = 0, y1 = 0, i, cellInfo;
                if(len) {
                    for(i = 0; i < len; i++) {
                        cellInfo = this._list[i];
                        x0 = Math.min(x0, cellInfo.cellIndex());
                        y0 = Math.min(y0, cellInfo.rowIndex());
                        x1 = Math.max(x1, cellInfo.cellIndex());
                        y1 = Math.max(y1, cellInfo.rowIndex());
                    }
                    return new wijmo.grid.cellInfoRange(new wijmo.grid.cellInfo(x0, y0), new wijmo.grid.cellInfo(x1, y1));
                }
                return null;
            };
            return cellInfoOrderedCollection;
        })();
        grid.cellInfoOrderedCollection = cellInfoOrderedCollection;
        // internal *
            })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    /// <reference path="wijgrid.ts"/>
    /// <reference path="cellInfo.ts"/>
    /// <reference path="rowAccessor.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var uiSelection = (function () {
            function uiSelection(wijgrid) {
                this._gap_to_start = 10;
                this._inProgress = false;
                this._additionalEventsAttached = false;
                this._wijgrid = wijgrid;
                this._evntFormat = "{0}." + this._wijgrid.widgetName + ".selectionui";
                this._addedCells = new wijmo.grid.cellInfoOrderedCollection(this._wijgrid);
                this._view = this._wijgrid._view();
                this._rootElement = this._view.focusableElement();
                this._visLeavesLen = this._wijgrid._field("visibleLeaves").length;
                this._rootElement.bind(this._eventKey("mousedown"), $.proxy(this._onGridMouseDown, this));
            }
            uiSelection.prototype.dispose = function () {
                this._rootElement.unbind(this._eventKey("mousedown"), this._onGridMouseDown);
                this._detachAdditionalEvents();
            };
            uiSelection.prototype._onGridMouseDown = function (args) {
                if(!this._wijgrid._canInteract() || this._wijgrid.options.selectionMode.toLowerCase() === "none") {
                    return;
                }
                var visibleBounds = this._view.getVisibleAreaBounds(), mouse = {
                    x: args.pageX,
                    y: args.pageY
                }, tag = ((args.target && (args.target).tagName !== undefined) ? (args.target).tagName.toLowerCase() : undefined), $target = $(args.target);
                if((!tag || $target.is("td.wijgridtd, th.wijgridtd, div.wijmo-wijgrid-innercell")) && (mouse.x > visibleBounds.left && mouse.x < visibleBounds.left + visibleBounds.width) && (mouse.y > visibleBounds.top && mouse.y < visibleBounds.top + visibleBounds.height)) {
                    this._attachAdditionalEvents();
                    this._startPos = mouse;
                    this._startCellInfo = this._coordToDataCellInfo(this._startPos);
                }
            };
            uiSelection.prototype._onDocumentMouseMove = function (args) {
                if(!this._startCellInfo || !this._startCellInfo._isValid()) {
                    return;
                }
                var mouse = {
                    x: args.pageX,
                    y: args.pageY
                }, tmp, info, range, dataOffset, desiredCells, rowsLen, cellsLen, row, cell, i, len, $cell, rowInfo, prevRowIndex, state, view = this._wijgrid._view(), rows = this._wijgrid._rows(), $rs = wijmo.grid.renderState;
                if(!this._inProgress) {
                    this._inProgress = (Math.abs(this._startPos.x - mouse.x) > this._gap_to_start) || (Math.abs(this._startPos.y - mouse.y) > this._gap_to_start);
                }
                if(this._inProgress) {
                    tmp = this._coordToDataCellInfo(mouse);
                    if(!tmp._isValid()) {
                        return;
                    }
                    this._endCellInfo = tmp;
                    range = new wijmo.grid.cellInfoRange(this._startCellInfo, this._endCellInfo);
                    range._normalize();
                    range._clip(this._wijgrid._getDataCellsRange());
                    if(range._isValid() && !range.isEqual(this._prevMouseMoveRange)) {
                        dataOffset = this._wijgrid._getDataToAbsOffset();
                        this._prevMouseMoveRange = range;
                        desiredCells = new wijmo.grid.cellInfoOrderedCollection(this._wijgrid);
                        rowsLen = range.bottomRight().rowIndex();
                        cellsLen = range.bottomRight().cellIndex();
                        for(row = range.topLeft().rowIndex(); row <= rowsLen; row++) {
                            rowInfo = view._getRowInfo(rows.item(row));
                            if(rowInfo.type & wijmo.grid.rowType.data) {
                                for(cell = range.topLeft().cellIndex(); cell <= cellsLen; cell++) {
                                    desiredCells._appendUnsafe(new wijmo.grid.cellInfo(cell, row));
                                }
                            }
                        }
                        prevRowIndex = -1;
                        for(i = 0 , len = this._addedCells.length(); i < len; i++) {
                            info = this._addedCells.item(i);
                            if(desiredCells.indexOf(info) < 0)// remove css
                             {
                                if(this._wijgrid.selection().selectedCells().indexOf(info) < 0) {
                                    cell = this._view.getCell(info.cellIndex() + dataOffset.x, info.rowIndex() + dataOffset.y);
                                    if(cell) {
                                        if(prevRowIndex !== info.rowIndex()) {
                                            rowInfo = info.row();
                                            prevRowIndex = info.rowIndex();
                                        }
                                        $cell = $(cell);
                                        state = view._changeCellRenderState($cell, $rs.selected, false);
                                        this._wijgrid.cellStyleFormatter.format($cell, info.cellIndex(), info.column(), rowInfo, state);
                                    }
                                }
                                this._addedCells._removeAt(i);
                                i--;
                                len--;
                            }
                        }
                        prevRowIndex = -1;
                        for(i = 0 , len = desiredCells.length(); i < len; i++) {
                            info = desiredCells.item(i);
                            if(this._addedCells.indexOf(info) < 0 && this._wijgrid.selection().selectedCells().indexOf(info) < 0) {
                                if(this._addedCells._add(info)) {
                                    cell = this._view.getCell(info.cellIndex() + dataOffset.x, info.rowIndex() + dataOffset.y);
                                    if(cell) {
                                        if(prevRowIndex !== info.rowIndex()) {
                                            rowInfo = info.row();
                                            prevRowIndex = info.rowIndex();
                                        }
                                        $cell = $(cell);
                                        state = view._changeCellRenderState($cell, $rs.selected, true);
                                        this._wijgrid.cellStyleFormatter.format($cell, info.cellIndex(), info.column(), rowInfo, state);
                                    }
                                }
                            }
                        }
                    }// end if

                }
            };
            uiSelection.prototype._onDocumentMouseUp = function (args) {
                this._detachAdditionalEvents();
                if(this._inProgress) {
                    this._inProgress = false;
                    if(this._prevMouseMoveRange && this._prevMouseMoveRange._isValid()) {
                        this._wijgrid._changeCurrentCell(args, this._endCellInfo);
                        if(!args.shiftKey || (!this._wijgrid.selection()._multipleRangesAllowed() && this._wijgrid.options.selectionMode.toLowerCase() !== "singleRange")) {
                            this._wijgrid.selection()._startNewTransaction(this._startCellInfo);
                        }
                        this._wijgrid.selection().beginUpdate();
                        this._wijgrid.selection()._selectRange(this._prevMouseMoveRange, args.shiftKey, args.ctrlKey, 0/* none */ , this._endCellInfo);
                        this._wijgrid.selection().endUpdate();
                        var view = this._wijgrid._view(), dataOffset = this._wijgrid._getDataToAbsOffset(), i, len, info, cell, $cell, prevRowIndex = -1, rowInfo, state, $rs = wijmo.grid.renderState;
                        // clear remained cells
                        for(i = 0 , len = this._addedCells.length(); i < len; i++) {
                            info = this._addedCells.item(i);
                            if(this._wijgrid.selection().selectedCells().indexOf(info) < 0) {
                                cell = view.getCell(info.cellIndex() + dataOffset.x, info.rowIndex() + dataOffset.y);
                                if(cell !== null) {
                                    if(prevRowIndex !== info.rowIndex()) {
                                        rowInfo = info.row();
                                        prevRowIndex = info.rowIndex();
                                    }
                                    $cell = $(cell);
                                    state = view._changeCellRenderState($cell, $rs.selected, false);
                                    this._wijgrid.cellStyleFormatter.format($cell, info.cellIndex(), info.column(), rowInfo, state);
                                }
                            }
                        }
                        this._addedCells._clear();
                        this._startCellInfo = this._endCellInfo = this._prevMouseMoveRange = null;
                        return false;// cancel bubbling

                    }
                }
            };
            uiSelection.prototype._attachAdditionalEvents = function () {
                if(!this._additionalEventsAttached) {
                    try  {
                        this._view.toggleDOMSelection(false)// disable selection
                        ;
                        $(document).bind(this._eventKey("mousemove"), $.proxy(this._onDocumentMouseMove, this)).bind(this._eventKey("mouseup"), $.proxy(this._onDocumentMouseUp, this));
                    }finally {
                        this._additionalEventsAttached = true;
                    }
                }
            };
            uiSelection.prototype._detachAdditionalEvents = function () {
                if(this._additionalEventsAttached) {
                    try  {
                        this._view.toggleDOMSelection(true)// enable selection
                        ;
                        $(document).unbind(this._eventKey("mousemove"), this._onDocumentMouseMove).unbind(this._eventKey("mouseup"), this._onDocumentMouseUp);
                    }finally {
                        this._additionalEventsAttached = false;
                    }
                }
            };
            uiSelection.prototype._eventKey = function (eventType) {
                return wijmo.grid.stringFormat(this._evntFormat, eventType);
            };
            uiSelection.prototype._coordToDataCellInfo = function (pnt) {
                var left = 0, right = this._visLeavesLen - 1, median = 0, cellIdx = -1, bounds, gridRowsAccessor = new wijmo.grid.rowAccessor(this._view, 2/* tbody */ , 0, 0), rowIdx, rowObj, dataOffset, result;
                // get cell index
                while(left <= right) {
                    median = ((right - left) >> 1) + left;
                    bounds = wijmo.grid.bounds(this._view.getHeaderCell(median))// get header cell
                    ;
                    if(!bounds) {
                        // no header?
                        rowObj = gridRowsAccessor.item(0);
                        bounds = wijmo.grid.bounds(wijmo.grid.rowAccessor.getCell(rowObj, median))// get data cell
                        ;
                    }
                    if(!bounds) {
                        break;
                    }
                    if(pnt.x < bounds.left) {
                        // -1
                        right = median - 1;
                    } else if(pnt.x > bounds.left + bounds.width) {
                        // 1
                        left = median + 1;
                    } else {
                        // 0
                        cellIdx = median;
                        break;
                    }
                }
                if(cellIdx === -1) {
                    return wijmo.grid.cellInfo.outsideValue;
                }
                gridRowsAccessor = new wijmo.grid.rowAccessor(this._view, 0/* all */ , 0, 0);
                rowIdx = -1;
                left = 0;
                right = gridRowsAccessor.length() - 1;
                median = 0;
                // get row index
                while(left <= right) {
                    median = ((right - left) >> 1) + left;
                    rowObj = gridRowsAccessor.item(median);
                    bounds = wijmo.grid.bounds(wijmo.grid.rowAccessor.getCell(rowObj, 0));
                    if(pnt.y < bounds.top) {
                        // -1
                        right = median - 1;
                    } else if(pnt.y > bounds.top + bounds.height) {
                        // 1
                        left = median + 1;
                    } else {
                        // 0
                        rowIdx = median;
                        break;
                    }
                }// end while { }

                if(rowIdx === -1) {
                    return wijmo.grid.cellInfo.outsideValue;
                }
                dataOffset = this._wijgrid._getDataToAbsOffset();
                result = new wijmo.grid.cellInfo(cellIdx - dataOffset.x, rowIdx - dataOffset.y);
                result._clip(this._wijgrid._getDataCellsRange());
                return result;
            };
            return uiSelection;
        })();
        grid.uiSelection = uiSelection;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    /// <reference path="baseView.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var rowAccessor = (function () {
            function rowAccessor(view, scope, offsetTop, offsetBottom) {
                this._view = view;
                this._scope = scope;
                this._offsetBottom = offsetBottom;
                this._offsetTop = offsetTop;
            }
            rowAccessor.prototype.item = function (index) {
                /// <summary>
                /// Gets an array of the table row elements that represents a wijgrid widget row at the specified index.
                /// remark: size of returning array is always two.
                /// </summary>
                /// <param name="index" type="Number" integer="true">
                /// The zero-based index of the row to retrieve.
                /// </param>
                /// <returns type="Array" elementType="object" elementDomElement="true">
                /// The array of the table row elements at the specified index.
                /// </returns>
                var len = this.length();
                return (index < len) ? this._view.getJoinedRows(index + this._offsetTop, this._scope) : null;
            };
            rowAccessor.prototype.length = function () {
                /// <summary>
                /// Gets the total number of elements.
                /// </summary>
                                var joinedTables = this._view.getJoinedTables(true, 0), len = 0, htmlAccessor;
                if(htmlAccessor = joinedTables[0]) {
                    len = htmlAccessor.getSectionLength(this._scope);
                }
                if(htmlAccessor = joinedTables[1]) {
                    len += htmlAccessor.getSectionLength(this._scope);
                }
                len -= this._offsetTop + this._offsetBottom;
                if(len < 0) {
                    len = 0;
                }
                return len;
            };
            rowAccessor.iterateCells = function iterateCells(rowObj, callback, param) {
                /// <summary>
                /// Sequentially iterates the cells in a <paramref name="rows"/> array.
                ///
                /// example:
                /// Suppose rows is an array containing the following data:
                /// [ ["a", "b"], ["c", "d", "e"] ]
                ///
                /// When it is iterated it will sequentially return:
                /// "a", "b", "c", "d", "e"
                /// </summary>
                /// <param name="rowObj" type="Array" elementType="Object" elementDomElement="true">Array of rows to be iterated.</param>
                /// <param name="callback" type="Function">Function that will be called each time a new cell is reached.</param>
                /// <param name="param" type="Object" optional="true">Parameter that can be handled within the callback function.</param>
                if(rowObj && callback) {
                    var globCellIdx = 0, i, len, domRow, j, cellLen, result;
                    for(i = 0 , len = rowObj.length; i < len; i++) {
                        domRow = rowObj[i];
                        if(domRow) {
                            for(j = 0 , cellLen = domRow.cells.length; j < cellLen; j++) {
                                result = callback(domRow.cells[j], globCellIdx++, param);
                                if(result !== true) {
                                    return;
                                }
                            }
                        }
                    }
                }
            };
            rowAccessor.getCell = function getCell(rowObj, globCellIndex) {
                /// <summary>
                /// Gets a cell by its global index in a row's array passed in rowObj.
                ///
                /// example:
                /// Suppose rows is an array containing the following data:
                /// [ ["a", "b"], ["c", "d", "e"] ]
                ///
                /// "a" symbol has a global index 0.
                /// "c" symbol has a global index 2.
                /// </summary>
                /// <param name="rowObj" type="Array" elementType="Object" elementDomElement="true">Array of table row elements.</param>
                /// <param name="index" type="Number" integer="true">Zero-based global index of a cell.</param>
                /// <returns type="Object" domElement="true" elementMayBeNull="true">
                /// A cell or null if a cell with provided index is not found.
                /// </returns>
                                var domRow, cellLen;
                if(rowObj && (domRow = rowObj[0])) {
                    cellLen = domRow.cells.length;
                    if(globCellIndex < cellLen) {
                        return domRow.cells[globCellIndex];
                    }
                    globCellIndex -= cellLen;
                    if(domRow = rowObj[1]) {
                        cellLen = domRow.cells.length;
                        if(globCellIndex < cellLen) {
                            return domRow.cells[globCellIndex];
                        }
                    }
                }
                return null;
            };
            rowAccessor.cellsCount = function cellsCount(rowObj) {
                /// <summary>
                /// Gets the number of cells in a array of table row elements.
                /// </summary>
                /// <param name="rowObj" type="Array" elementType="Object" elementDomElement="true">Array of table row elements.</param>
                /// <returns type="Number" integer="true">The number of cells in a array of table row elements.</returns>
                                var res = 0, domRow;
                if(rowObj && (domRow = rowObj[0])) {
                    res = domRow.cells.length;
                    if(domRow = rowObj[1]) {
                        res += domRow.cells.length;
                    }
                }
                return res;
            };
            return rowAccessor;
        })();
        grid.rowAccessor = rowAccessor;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts" />
    /// <reference path="wijgrid.ts" />
    /// <reference path="misc.ts" />
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var cellEditorHelper = (function () {
            function cellEditorHelper() {
                this._timeout = 25;
            }
            cellEditorHelper.prototype.currentCellEditStart = function (grid, e) {
                var result = false, currentCell = grid.currentCell(), view = grid._view(), rowInfo, args, $innerDiv, rowType;
                if(currentCell._isValid() && !currentCell._isEdit() && (currentCell.column().dataIndex >= 0)) {
                    rowInfo = currentCell.row();
                    if(rowInfo) {
                        rowType = rowInfo.type;
                        if(rowType & wijmo.grid.rowType.data) {
                            args = {
                                cell: currentCell,
                                event: e,
                                handled: false
                            };
                            if(result = grid._trigger("beforeCellEdit", null, args)) {
                                // todo
                                if(!args.handled) {
                                    result = this._defaultBeforeCellEdit(grid, args);
                                }
                            }
                            if(result) {
                                currentCell._isEdit(true);
                                if(grid.options.showRowHeader) {
                                    $innerDiv = $((rowInfo.$rows[0]).cells[0]).children("div.wijmo-wijgrid-innercell");
                                    if($innerDiv.length) {
                                        $innerDiv.empty();
                                        $innerDiv.append($("<div>&nbsp;</div>").addClass(grid.options.wijCSS.icon + " ui-icon-pencil"));
                                    }
                                }
                            }
                        }
                    }
                }
                return result;
            };
            cellEditorHelper.prototype.currentCellEditEnd = function (grid, e) {
                var currentCell = grid.currentCell(), result = false, view = grid._view(), rowInfo, rowType, escPressed, a, b, domCell, keyCodeEnum = wijmo.grid.getKeyCodeEnum();
                if(!currentCell._isValid() || !currentCell._isEdit()) {
                    return;
                }
                rowInfo = currentCell.row();
                if(rowInfo) {
                    rowType = rowInfo.type;
                    if(!(rowType & wijmo.grid.rowType.data)) {
                        return result;
                    }
                    escPressed = (e && e.which === keyCodeEnum.ESCAPE);
                    if(!e || (!escPressed)) {
                        var bcuArgs = {
                            cell: currentCell,
                            value: undefined
                        };
                        if(result = grid._trigger("beforeCellUpdate", null, bcuArgs)) {
                            if(bcuArgs.value === undefined) {
                                bcuArgs.value = this._getCellValue(grid, currentCell)// get raw value from editor using the default implementation.
                                ;
                            }
                            a = bcuArgs.value// new value
                            ;
                            try  {
                                bcuArgs.value = grid._parse(currentCell.column(), bcuArgs.value)// try to parse raw value
                                ;
                                a = bcuArgs.value;
                            } catch (ex) {
                                bcuArgs.value = a// restore raw value
                                ;
                            }
                            b = currentCell.value()// old value
                            ;
                            if(wijmo.grid.getDataType(bcuArgs.cell.column()) === "datetime") {
                                if(a instanceof Date) {
                                    a = a.getTime();
                                }
                                if(b instanceof Date) {
                                    b = b.getTime();
                                }
                            }
                            if(a !== b) {
                                // value is changed
                                // update datasource
                                try  {
                                    currentCell.value(bcuArgs.value);
                                } catch (ex) {
                                    var icvArgs = {
                                        cell: currentCell,
                                        value: bcuArgs.value
                                    };
                                    result = false;
                                    grid._trigger("invalidCellValue", null, icvArgs);
                                }
                                if(result) {
                                    var acuArgs = {
                                        cell: currentCell
                                    };
                                    grid._trigger("afterCellUpdate", null, acuArgs);
                                }
                            }
                        }
                    } else {
                        // ESC key
                        result = true;
                    }
                    if(result) {
                        var aceArgs = {
                            cell: currentCell,
                            event: e,
                            handled: false
                        };
                        grid._trigger("afterCellEdit", null, aceArgs);
                        if(!aceArgs.handled) {
                            result = this._defaultAfterCellEdit(grid, aceArgs);
                        }
                        if(result) {
                            currentCell._isEdit(false);
                        }
                        if(grid.options.showRowHeader) {
                            $((rowInfo.$rows[0]).cells[0]).children("div.wijmo-wijgrid-innercell").html("&nbsp;")// remove ui-icon-pencil
                            ;
                        }
                        window.setTimeout(function () {
                            // using the setTimeout here to workaround IE issue.
                            if(!grid._destroyed) {
                                currentCell = grid.currentCell();
                                if(domCell = currentCell.tableCell()) {
                                    $(domCell).attr("tabIndex", 0).focus()// ensure focus on current cell
                                    ;
                                } else {
                                    $(grid._view().focusableElement()).focus()// to listen keypress\ keydown events
                                    ;
                                }
                            }
                        }, this._timeout);
                    }
                }
                return result;
            };
            cellEditorHelper.prototype._defaultBeforeCellEdit = // private
            function (grid, args) {
                var leafOpt = args.cell.column(), result = false, value, $container, $input, len, kbEvent, keyCodeEnum = wijmo.grid.getKeyCodeEnum();
                if(leafOpt.dataIndex >= 0) {
                    value = args.cell.value();
                    result = true;
                    try  {
                        $container = args.cell.container();
                        if(wijmo.grid.getDataType(leafOpt) === "boolean") {
                            $input = $container.children("input");
                            $input.focus();
                            if(args.event && args.event.type === "keypress") {
                                $input.one("keyup", function (e) {
                                    if(e.which === keyCodeEnum.SPACE) {
                                        e.preventDefault();
                                        ($input[0]).checked = !value;
                                    }
                                });
                            }
                        } else {
                            $input = $("<input />").attr("type", "text").addClass("wijgridinput wijmo-wijinput " + grid.options.wijCSS.stateFocus).bind("keydown", grid, $.proxy(this._checkBoxOrInputKeyDown, this));
                            //the problem of inputing
                            $input.bind((($.support).selectstart ? "selectstart" : "mousedown"), function (event) {
                                event.stopPropagation();
                            });
                            if(args.event && args.event.type === "keypress" && args.event.which) {
                                $input.val(String.fromCharCode(args.event.which));
                            } else {
                                switch(wijmo.grid.getDataType(args.cell.column())) {
                                    case "currency":
                                    case "number":
                                        if(value !== null) {
                                            $input.val(value)// ignore formatting
                                            ;
                                            break;
                                        }
                                        // fall through
                                                                            default:
                                        $input.val(grid._toStr(args.cell.column(), value));
                                        break;
                                }
                            }
                            $container.empty().append($input);
                            // move caret to the end of the text
                            len = $input.val().length;
                            new wijmo.grid.domSelection($input[0]).setSelection({
                                start: len,
                                end: len
                            });
                            $input.focus();
                            setTimeout(function () {
                                // IE fix
                                $input.focus();
                            }, this._timeout * 2);
                            // issue seems to be fixed
                            //							// FF issue: text does not track to the new position of the caret
                            //							if ($.browser.mozilla && document.createEvent && $input[0].dispatchEvent) {
                            //								kbEvent = document.createEvent("KeyboardEvent");
                            //								kbEvent.initKeyEvent("keypress", false, true, null, false, false, false, false, 0, keyCodeEnum.SPACE);
                            //								$input[0].dispatchEvent(kbEvent);
                            //								kbEvent = document.createEvent("KeyboardEvent");
                            //								kbEvent.initKeyEvent("keypress", false, true, null, false, false, false, false, keyCodeEnum.BACKSPACE, 0);
                            //								$input[0].dispatchEvent(kbEvent);
                            //							}
                                                    }
                    } catch (ex) {
                        alert(ex.message);
                        result = false;
                    }
                }
                return result;
            };
            cellEditorHelper.prototype._defaultAfterCellEdit = function (grid, args) {
                var leafOpt = args.cell.column(), result = false, $container, cellValue, $input, rowInfo, view;
                if(leafOpt.dataIndex >= 0) {
                    result = true;
                    view = grid._view();
                    try  {
                        $container = args.cell.container();
                        cellValue = grid._toStr(leafOpt, args.cell.value());
                        rowInfo = view._getRowInfo(grid._rows().item(args.cell.rowIndex()));
                        if(wijmo.grid.getDataType(leafOpt) === "boolean") {
                            $input = $container.children("input");
                            if(cellValue === "true") {
                                $input.attr("checked", "checked");
                            } else {
                                $input.removeAttr("checked");
                            }
                        } else {
                            grid.cellFormatter.format($container, leafOpt, cellValue, rowInfo);
                        }
                    } catch (ex) {
                        alert("defaultAfterCellEdit: " + ex.message);
                        result = false;
                    }
                }
                return result;
            };
            cellEditorHelper.prototype._checkBoxOrInputKeyDown = function (args) {
                var keyCodeEnum = wijmo.grid.getKeyCodeEnum();
                if(args.which === keyCodeEnum.ENTER) {
                    // stop editing when Enter key is pressed
                    var grid = args.data;
                    if(grid) {
                        grid._endEditInternal(args);
                        return false;// prevent submit behaviour.

                    }
                }
            };
            cellEditorHelper.prototype._getCellValue = function (grid, currentCell) {
                var $input = currentCell.container().find(":input:first"), result = null;
                if($input.length) {
                    result = ($input.attr("type") === "checkbox") ? ($input[0]).checked : $input.val();
                }
                return result;
            };
            return cellEditorHelper;
        })();
        grid.cellEditorHelper = cellEditorHelper;
        // private *
            })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts" />
    /// <reference path="wijgrid.ts" />
    /// <reference path="misc.ts" />
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var cellFormatterHelper = (function () {
            function cellFormatterHelper() { }
            cellFormatterHelper._div = document.createElement("div");
            cellFormatterHelper.prototype.format = function ($container, column, formattedValue, rowInfo) {
                if(rowInfo.type & wijmo.grid.rowType.footer) {
                    if(column.aggregate && (column.aggregate !== "none")) {
                        formattedValue = wijmo.grid.stringFormat(column.footerText || "{0}", column._totalsValue || "");
                    } else {
                        formattedValue = column.footerText || column._footerTextDOM || "";
                    }
                }
                var useDefault = true, defaultFormatter = null, args = {
                    $container: $container,
                    column: column,
                    formattedValue: formattedValue,
                    row: rowInfo,
                    afterDefaultCallback: null
                }, temp;
                if($.isFunction(column.cellFormatter)) {
                    useDefault = !column.cellFormatter(args);
                }
                if(useDefault) {
                    switch(wijmo.grid.getDataType(column)) {
                        case "boolean":
                            defaultFormatter = this._boolFormatter;
                            break;
                        default:
                            defaultFormatter = this._textFormatter;
                    }
                    if(defaultFormatter) {
                        defaultFormatter.call(this, args);
                        if($.isFunction(temp = args.afterDefaultCallback)) {
                            // args.afterDefaultCallback(args); // compile error: value of type "any" is not callable
                            temp(args);
                        }
                    }
                }
            };
            cellFormatterHelper.prototype._textFormatter = // * private
            function (args) {
                var domContainer;
                switch(args.row.type) {
                    case wijmo.grid.rowType.filter:
                        this._defFormatFilterCell(args);
                        break;
                    default:
                        // args.$container.html(args.formattedValue || "&nbsp;"); // -- very slow in IE when table content is recreated more than once (after paging, sorting etc, especially in flat mode).
                        domContainer = args.$container[0];
                        // reset content
                        if(domContainer.firstChild) {
                            while(domContainer.firstChild) {
                                domContainer.removeChild(domContainer.firstChild);
                            }
                        }
                        wijmo.grid.cellFormatterHelper._div.innerHTML = args.formattedValue || "&nbsp;";
                        while(wijmo.grid.cellFormatterHelper._div.firstChild) {
                            domContainer.appendChild(wijmo.grid.cellFormatterHelper._div.firstChild);
                        }
                }
            };
            cellFormatterHelper.prototype._boolFormatter = function (args) {
                var grid, allowEditing, disableStr = "disabled='disabled'", targetElement, currentCell, $rt = wijmo.grid.rowType, keyCodeEnum = wijmo.grid.getKeyCodeEnum();
                switch(args.row.type) {
                    case $rt.data:
                    case $rt.data | $rt.dataAlt:
                        grid = args.column.owner;
                        allowEditing = grid.options.allowEditing && (args.column.readOnly !== true);
                        if(allowEditing) {
                            disableStr = "";
                        }
                        if(grid._parse(args.column, grid._dataViewWrapper.getValue(args.row.data, args.column.dataKey)) === true) {
                            args.$container.html("<input class='wijgridinput' type='checkbox' checked='checked' " + disableStr + " />");
                        } else {
                            args.$container.html("<input class='wijgridinput' type='checkbox' " + disableStr + " />");
                        }
                        if(allowEditing) {
                            args.$container.children("input").bind("mousedown", function (e) {
                                targetElement = args.$container.parent()[0];
                                currentCell = grid.currentCell();
                                if(currentCell.tableCell() !== targetElement) {
                                    grid._onClick({
                                        target: targetElement
                                    });
                                }
                                if(!currentCell._isEdit()) {
                                    grid.beginEdit();
                                }
                            }).bind("keydown", function (e) {
                                if(e.which === keyCodeEnum.ENTER) {
                                    grid._endEditInternal(e);
                                    return false;
                                }
                            });
                        }
                        break;
                    default:
                        this._textFormatter(args);
                }
            };
            cellFormatterHelper.prototype._defFormatFilterCell = function (args) {
                var grid = args.column.owner, wijCSS = grid.options.wijCSS;
                args.$container.addClass(wijCSS.widget + " " + wijCSS.stateDefault);
                if((args.column.dataIndex >= 0) && !args.column.isBand && args.column.showFilter) {
                    args.$container.html("<div class=\"wijmo-wijgrid-filter " + wijCSS.cornerAll + "\"><input type=\"text\" class=\"wijmo-wijgrid-filter-input\" style=\"width:100%\" /><a class=\"wijmo-wijgrid-filter-trigger " + wijCSS.cornerRight + " " + wijCSS.stateDefault + "\" href=\"#\"><span class=\"" + wijCSS.icon + " " + wijCSS.iconArrowDown + "\"></span></a></div>");
                } else {
                    args.$container.html("&nbsp;");
                }
            };
            return cellFormatterHelper;
        })();
        grid.cellFormatterHelper = cellFormatterHelper;
        // * private
            })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    /// <reference path="wijgrid.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var uiResizer = (function () {
            function uiResizer(wijgrid) {
                this._elements = [];
                this._gap = 10;
                this._step = 1;
                this._inProgress = false;
                this._hoveredField = null;
                this._startLocation = null;
                this._lastLocation = null;
                this._proxy = null;
                this._wijgrid = wijgrid;
                this._evntFormat = "{0}." + this._wijgrid.widgetName + ".resizer";
            }
            uiResizer.prototype.addElement = function (c1basefield) {
                if(c1basefield && c1basefield.element) {
                    c1basefield.element.bind(this._eventKey("mousemove"), $.proxy(this._onMouseMove, this)).bind(this._eventKey("mousedown"), $.proxy(this._onMouseDown, this)).bind(this._eventKey("mouseout"), $.proxy(this._onMouseOut, this));
                    this._elements.push(c1basefield);
                }
            };
            uiResizer.prototype.dispose = function () {
                var self = this;
                $.each(this._elements, function (index, c1basefield) {
                    c1basefield.element.unbind(self._eventKey("mousemove"), self._onMouseMove).unbind(self._eventKey("mousedown"), self._onMouseDown).unbind(self._eventKey("mouseout"), self._onMouseOut);
                });
                this._detachDocEvents();
            };
            uiResizer.prototype.inProgress = function () {
                return this._inProgress;
            };
            uiResizer.prototype._onMouseMove = function (e) {
                if(!this._inProgress) {
                    var hoveredField = this._getFieldByPos({
                        x: e.pageX,
                        y: e.pageY
                    });
                    if(hoveredField && hoveredField._canSize() && this._wijgrid._canInteract()) {
                        hoveredField.element.css("cursor", "e-resize");
                        //hoveredField.element.find("> a").css("cursor", "e-resize");
                        this._hoveredField = hoveredField;
                        // prevent frozener from taking effect
                        e.stopPropagation();
                    } else {
                        this._onMouseOut(e);
                    }
                }
            };
            uiResizer.prototype._onMouseOut = function (e) {
                if(!this._inProgress) {
                    if(this._hoveredField) {
                        this._hoveredField.element.css("cursor", "");
                        //_hoveredField.element.find("> a").css("cursor", "");
                        this._hoveredField = null;
                    }
                }
            };
            uiResizer.prototype._onMouseDown = function (e) {
                this._hoveredField = this._getFieldByPos({
                    x: e.pageX,
                    y: e.pageY
                });
                if(this._hoveredField && (this._hoveredField)._canSize() && this._wijgrid._canInteract()) {
                    try  {
                        this._hoveredField.element.css("cursor", "");
                        // _hoveredField.element.find("> a").css("cursor", "");
                        this._docCursor = document.body.style.cursor;
                        document.body.style.cursor = "e-resize";
                        this._startLocation = this._lastLocation = wijmo.grid.bounds(this._hoveredField.element);
                        this._proxy = $("<div class=\"wijmo-wijgrid-resizehandle " + this._wijgrid.options.wijCSS.stateHightlight + "\">&nbsp;</div>");
                        var visibleAreaBounds = this._wijgrid._view().getVisibleAreaBounds();
                        this._proxy.css({
                            "left": e.pageX,
                            "top": this._startLocation.top,
                            "height": visibleAreaBounds.height + visibleAreaBounds.top - this._startLocation.top
                        });
                        $(document.body).append(this._proxy);
                    }finally {
                        this._attachDocEvents();
                        this._inProgress = true;
                        // prevent frozener from taking effect
                        e.stopPropagation();
                    }
                }
            };
            uiResizer.prototype._onDocumentMouseMove = function (e) {
                var deltaX = this._step * Math.round((e.pageX - this._lastLocation.left) / this._step);
                this._lastLocation = {
                    left: this._lastLocation.left + deltaX,
                    top: e.pageY,
                    width: undefined,
                    height: undefined
                };
                this._proxy.css("left", this._lastLocation.left);
            };
            uiResizer.prototype._onDocumentMouseUp = function (e) {
                try  {
                    document.body.style.cursor = this._docCursor;
                    // destroy proxy object
                    this._proxy.remove();
                    if(this._startLocation !== this._lastLocation) {
                        this._wijgrid._fieldResized(this._hoveredField, this._startLocation.width, this._lastLocation.left - this._startLocation.left);
                    }
                }finally {
                    this._hoveredField = null;
                    this._proxy = null;
                    this._detachDocEvents();
                    this._inProgress = false;
                }
            };
            uiResizer.prototype._onSelectStart = function (e) {
                e.preventDefault();
            };
            uiResizer.prototype._attachDocEvents = function () {
                if(!this._inProgress) {
                    $(document).bind(this._eventKey("mousemove"), $.proxy(this._onDocumentMouseMove, this)).bind(this._eventKey("mouseup"), $.proxy(this._onDocumentMouseUp, this));
                    if($.fn.disableSelection) {
                        $(document.body).disableSelection();
                    }
                    if("onselectstart" in document) {
                        // $.support.selectstart ?
                        $(document.body).bind("selectstart", this._onSelectStart);
                    }
                }
            };
            uiResizer.prototype._detachDocEvents = function () {
                if(this._inProgress) {
                    $(document).unbind(this._eventKey("mousemove"), this._onDocumentMouseMove).unbind(this._eventKey("mouseup"), this._onDocumentMouseUp);
                    if($.fn.enableSelection) {
                        $(document.body).enableSelection();
                    }
                    if("onselectstart" in document) {
                        // $.support.selectstart ?
                        $(document.body).unbind("selectstart", this._onSelectStart);
                    }
                }
            };
            uiResizer.prototype._getFieldByPos = function (mouse) {
                var i, len, c1basefield, bounds, res;
                for(i = 0 , len = this._elements.length; i < len; i++) {
                    c1basefield = this._elements[i];
                    bounds = wijmo.grid.bounds(c1basefield.element);
                    res = wijmo.grid.isOver(mouse.y, mouse.x, bounds.top, bounds.left + bounds.width - this._gap, bounds.height, this._gap);
                    if(res) {
                        return c1basefield;
                    }
                }
                return null;
            };
            uiResizer.prototype._eventKey = function (eventType) {
                return wijmo.grid.stringFormat(this._evntFormat, eventType);
            };
            return uiResizer;
        })();
        grid.uiResizer = uiResizer;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    /// <reference path="wijgrid.ts" />
    /// <reference path="c1groupedfield.ts" />
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var uiDragndrop = (function () {
            function uiDragndrop(wijgrid) {
                this._scope_guid = "scope_" + wijmo.grid.getUID();
                // to use inside the draggable.drag event.
                this._dragEnd = false;
                this._wijgrid = wijgrid;
                this._wijCSS = this._wijgrid.options.wijCSS;
                this._wrapHtml = "<div class=\"" + this._wijCSS.widget + " wijmo-wijgrid " + this._wijCSS.content + " " + this._wijCSS.cornerAll + "\">" + "<table class=\"wijmo-wijgrid-root wijmo-wijgrid-table\">" + "<tr class=\"wijmo-wijgrid-headerrow\">" + "</tr>" + "</table>" + "</div>";
            }
            uiDragndrop.prototype.attachGroupArea = function (element) {
                var draggedWijField, self = this;
                if(!($.ui).droppable || !($.ui).draggable) {
                    return;
                }
                element.droppable({
                    scope: this._scope_guid,
                    tolerance: "pointer",
                    greedy: true,
                    accept: function (draggable) {
                        if(self._wijgrid.options.allowColMoving) {
                            draggedWijField = self._getWijFieldInstance(draggable);
                            if(draggedWijField) {
                                // The rightmost column header in the the group area can't be dragged to the end of the group area again.
                                if((draggedWijField instanceof $.wijmo.c1groupedfield) && (draggedWijField.options.groupedIndex === self._wijgrid._field("groupedColumns").length - 1)) {
                                    return false;
                                }
                                return !draggedWijField.options.isBand && (draggedWijField.options.groupedIndex === undefined || (draggedWijField instanceof $.wijmo.c1groupedfield));
                            }
                        }
                        return false;
                    },
                    drop: function (e, ui) {
                        if(!self._isInElement(e, ui.draggable) && (draggedWijField = self._getWijFieldInstance(ui.draggable))) {
                            self._dragEnd = true;
                        }
                    },
                    over: function (e, ui) {
                        var cnt = self._wijgrid._field("groupedWidgets").length;
                        self._dropTargetRedirected = (cnt > 0);
                        self._droppableWijField = (cnt > 0) ? self._wijgrid._field("groupedWidgets")[cnt - 1] : // use the rightmost header as a drop target
                        element// special case, the drop target is the group area itself
                        ;
                        element.data("thisDroppableWijField", self._droppableWijField);
                    },
                    out: function (e, ui) {
                        if(self._droppableWijField === element.data("thisDroppableWijField")) {
                            self._droppableWijField = null;
                        }
                        //if (draggedWijField = _getWijFieldInstance(ui.draggable)) {
                        //	_hideArrows();
                        //}
                                            }
                });
            };
            uiDragndrop.prototype.attach = function (wijField) {
                var element, draggedWijField, self = this;
                if(!($.ui).droppable || !($.ui).draggable) {
                    return;
                }
                if(!wijField || !(element = wijField.element)) {
                    return;
                }
                element.draggable({
                    helper: function (e) {
                        if(wijField instanceof $.wijmo.c1groupedfield) {
                            return element.clone().addClass("wijmo-wijgrid-dnd-helper");
                        } else {
                            return element.clone().wrap(self._wrapHtml).width(element.width()).height(element.height()).closest(".wijmo-wijgrid").addClass("wijmo-wijgrid-dnd-helper");
                            /*return element
                            .clone()
                            .width(element.width())
                            .height(element.height())
                            .addClass("wijmo-wijgrid-dnd-helper");*/
                                                    }
                    },
                    appendTo: "body",
                    scope: //cursor: "pointer",
                    self._scope_guid,
                    drag: function (e, ui) {
                        self._hideArrows();
                        if(self._droppableWijField && !self._isInElement(e, element)) {
                            // indicate insertion position
                            var $arrowsTarget = self._droppableWijField.element;
                            if(!$arrowsTarget) {
                                // _droppableWijField is the group area element
                                $arrowsTarget = (self._droppableWijField);
                            }
                            self._showArrows($arrowsTarget, self._getPosition(wijField, self._droppableWijField, e, ui));
                        }
                    },
                    start: function (e, ui) {
                        if(self._wijgrid._canInteract() && self._wijgrid.options.allowColMoving && !self._wijgrid._field("resizer").inProgress()) {
                            //return (wijField._canDrag() === true);
                                                        var column = wijField.options, travIdx = wijField.options.travIdx, dragInGroup = (wijField instanceof $.wijmo.c1groupedfield), dragSource = dragInGroup ? "groupArea" : "columns";
                            if(dragInGroup) {
                                column = wijmo.grid.search(self._wijgrid.columns(), function (test) {
                                    return test.options.travIdx === travIdx;
                                });
                                column = (!column.found) ? // grouped column is invisible?
                                wijmo.grid.getColumnByTravIdx(self._wijgrid.options.columns, travIdx).found : column.found.options;
                            }
                            if(wijField._canDrag() && self._wijgrid._trigger("columnDragging", null, {
                                drag: column,
                                dragSource: dragSource
                            })) {
                                self._wijgrid._trigger("columnDragged", null, {
                                    drag: column,
                                    dragSource: dragSource
                                });
                                return true;
                            }
                        }
                        return false;
                    },
                    stop: function (e, ui) {
                        self._hideArrows();
                        try  {
                            if(self._dragEnd) {
                                if(!self._droppableWijField.element) {
                                    // _droppableWijField is the group area element
                                    self._wijgrid._handleDragnDrop(wijField.options.travIdx, -1, "left", wijField instanceof $.wijmo.c1groupedfield, true);
                                } else {
                                    self._wijgrid._handleDragnDrop(wijField.options.travIdx, self._droppableWijField.options.travIdx, self._getPosition(wijField, self._droppableWijField, e, ui), wijField instanceof $.wijmo.c1groupedfield, self._droppableWijField instanceof $.wijmo.c1groupedfield);
                                }
                            }
                        }finally {
                            self._droppableWijField = null;
                            self._dragEnd = false;
                        }
                    }
                }).droppable(// ~draggable
                {
                    hoverClass: self._wijCSS.stateHover,
                    scope: self._scope_guid,
                    tolerance: "pointer",
                    greedy: true,
                    accept: function (draggable) {
                        if(self._wijgrid.options.allowColMoving) {
                            if(element[0] !== draggable[0]) {
                                // different DOM elements
                                draggedWijField = self._getWijFieldInstance(draggable)// dragged column
                                ;
                                if(draggedWijField) {
                                    return draggedWijField._canDropTo(wijField);
                                }
                            }
                        }
                        return false;
                    },
                    drop: function (e, ui) {
                        if(draggedWijField = self._getWijFieldInstance(ui.draggable)) {
                            // As droppable.drop fires before draggable.stop, let draggable to finish action.
                            // Otherwise exception is thrown as during re-rendering element bound to draggable will be already deleted.
                            self._dragEnd = true;
                            // an alternative:
                            //window.setTimeout(function () {
                            //wijgrid._handleDragnDrop(draggedWijField, wijField, _getPosition(draggedWijField, wijField, e, ui));
                            //}, 100);
                                                    }
                    },
                    over: function (e, ui) {
                        self._dropTargetRedirected = false;
                        self._droppableWijField = wijField;
                        // to track when droppable.over event of other element fires before droppable.out of that element.
                        element.data("thisDroppableWijField", self._droppableWijField);
                    },
                    out: function (e, ui) {
                        if(self._droppableWijField === wijField.element.data("thisDroppableWijField")) {
                            self._droppableWijField = null;
                        }
                        //if (draggedWijField = _getWijFieldInstance(ui.draggable)) {
                        //	_hideArrows();
                        //}
                                            }
                })// ~droppable
                ;
            };
            uiDragndrop.prototype.detach = function (wijField) {
                var element;
                if(wijField && (element = wijField.element)) {
                    if(element.data("ui-draggable")) {
                        element.draggable("destroy");
                    }
                    if(element.data("ui-droppable")) {
                        element.droppable("destroy");
                    }
                }
            };
            uiDragndrop.prototype.dispose = function () {
                if(this._$topArrow) {
                    this._$topArrow.remove();
                    this._$topArrow = null;
                }
                if(this._$bottomArrow) {
                    this._$bottomArrow.remove();
                    this._$bottomArrow = null;
                }
            };
            uiDragndrop.prototype._getWijFieldInstance = // private
            function (draggable) {
                var widgetName = wijmo.grid.widgetName(draggable);
                if(!widgetName) {
                    throw "widgetName is undedined";
                }
                return draggable.data(widgetName);
            };
            uiDragndrop.prototype._showArrows = // position: "left", "right", "center"
            function (element, position) {
                this._topArrow().show().position({
                    my: "center",
                    at: position + " top",
                    of: element,
                    collision: "none"
                });
                this._bottomArrow().show().position({
                    my: "center",
                    at: position + " bottom",
                    of: element,
                    collision: "none"
                });
            };
            uiDragndrop.prototype._hideArrows = function () {
                this._topArrow().hide();
                this._bottomArrow().hide();
            };
            uiDragndrop.prototype._topArrow = function () {
                if(!this._$topArrow) {
                    this._$topArrow = $("<div />").addClass("wijmo-wijgrid-dnd-arrow-top").append($("<span />").addClass(this._wijCSS.icon + " ui-icon-arrowthick-1-s")).hide().appendTo(document.body);
                }
                return this._$topArrow;
            };
            uiDragndrop.prototype._bottomArrow = function () {
                if(!this._$bottomArrow) {
                    this._$bottomArrow = $("<div />").addClass("wijmo-wijgrid-dnd-arrow-bottom").append($("<span />").addClass(this._wijCSS.icon + " ui-icon-arrowthick-1-n")).hide().appendTo(document.body);
                }
                return this._$bottomArrow;
            };
            uiDragndrop.prototype._isInElement = function (e, element) {
                var bounds = wijmo.grid.bounds(element, false);
                return ((e.pageX > bounds.left && e.pageX < bounds.left + bounds.width) && (e.pageY > bounds.top && e.pageY < bounds.top + bounds.height));
            };
            uiDragndrop.prototype._getPosition = function (drag, drop, e, dragui) {
                if(!drop.element) {
                    // drop is the group area element
                    return "left";
                }
                if(this._dropTargetRedirected) {
                    return "right";
                }
                var bounds = wijmo.grid.bounds(drop.element, false), sixth = bounds.width / 6, centerX = bounds.left + (bounds.width / 2), result = "right", distance;
                if(e.pageX < centerX) {
                    result = "left";
                }
                if(drop instanceof $.wijmo.c1groupedfield) {
                    // drag is moved over a grouped column
                    if(drag instanceof $.wijmo.c1groupedfield) {
                        // drag is a grouped column too
                        distance = drop.options.groupedIndex - drag.options.groupedIndex;
                        if(Math.abs(distance) === 1) {
                            result = (distance < 0) ? "left" : "right";
                        }
                    }
                    return result;
                }
                // both drag and drop are non-grouped columns
                distance = drop.options.linearIdx - drag.options.linearIdx;
                if(drop.options.isBand && (drag.options.parentIdx !== drop.options.travIdx) && // drag is not an immediate child of drop
                (Math.abs(e.pageX - centerX) < sixth)) {
                    return "center";
                }
                // drag and drop are contiguous items of the same level
                if(drag.options.parentIdx === drop.options.parentIdx && Math.abs(distance) === 1) {
                    result = (distance < 0) ? "left" : "right";
                }
                return result;
            };
            return uiDragndrop;
        })();
        grid.uiDragndrop = uiDragndrop;
        // ~private
            })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts" />
    /// <reference path="wijgrid.ts" />
    /// <reference path="misc.ts" />
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var cellStyleFormatterHelper = (function () {
            function cellStyleFormatterHelper(wijgrid) {
                if(!wijgrid) {
                    throw "invalid arguments";
                }
                this._wijgrid = wijgrid;
            }
            cellStyleFormatterHelper.prototype.format = function ($cell, cellIndex, column, rowInfo, state, cellAttr, cellStyle) {
                var $rs = wijmo.grid.renderState, $rt = wijmo.grid.rowType, rowType = rowInfo.type, args, groupRowCellInfo = null;
                if(cellIndex === 0 && this._wijgrid.options.showRowHeader) {
                    column = null;
                }
                if(rowType === $rt.groupHeader || rowType === $rt.groupFooter) {
                    column = null;
                    if(cellAttr && (groupRowCellInfo = cellAttr.groupInfo)) {
                        column = this._wijgrid._field("leaves")[groupRowCellInfo.leafIndex]// replace "column" with the one associated with the $cell's content
                        ;
                        delete cellAttr.groupInfo;
                    }
                }
                args = {
                    $cell: $cell,
                    state: state,
                    row: rowInfo,
                    column: column,
                    _cellIndex: cellIndex,
                    _purpose: groupRowCellInfo ? groupRowCellInfo.purpose : undefined
                };
                if(state === $rs.rendering) {
                    this._renderingStateFormatter(args, cellAttr, cellStyle);
                } else {
                    this._currentStateFormatter(args, state & $rs.current);
                    //hoveredStateFormatter(args, state & $rs.hovered);
                    this._selectedStateFormatter(args, state & $rs.selected);
                }
                if($.isFunction(this._wijgrid.options.cellStyleFormatter)) {
                    this._wijgrid.options.cellStyleFormatter(args);
                }
            };
            cellStyleFormatterHelper.prototype._renderingStateFormatter = // private ---
            function (args, cellAttr, cellStyles) {
                var $rt = wijmo.grid.rowType, key, value, leaf = args.column, rowType = args.row.type;
                switch(rowType) {
                    case $rt.header:
                        args.$cell.addClass("wijgridth");
                        break;
                    default:
                        args.$cell.addClass("wijgridtd");
                }
                if((rowType & $rt.data) && leaf && leaf.textAlignment) {
                    // set text alignment
                    switch(leaf.textAlignment.toLowerCase()) {
                        case "left":
                            args.$cell.addClass("wijalign-left");
                            break;
                        case "right":
                            args.$cell.addClass("wijalign-right");
                            break;
                        case "center":
                            args.$cell.addClass("wijalign-center");
                            break;
                    }
                }
                // copy attributes
                if(cellAttr) {
                    for(key in cellAttr) {
                        if(cellAttr.hasOwnProperty(key)) {
                            value = cellAttr[key];
                            if((key === "colSpan" || key === "rowSpan") && !(value > 1)) {
                                continue;
                            }
                            if(key === "class") {
                                args.$cell.addClass(value);
                            } else {
                                args.$cell.attr(key, value);
                            }
                        }
                    }
                }
                // copy inline css
                if(cellStyles) {
                    for(key in cellStyles) {
                        if(cellStyles.hasOwnProperty(key)) {
                            if(key === "paddingLeft") {
                                // groupIndent
                                args.$cell.children(".wijmo-wijgrid-innercell").css(key, cellStyles[key]);
                                continue;
                            }
                            args.$cell.css(key, cellStyles[key]);
                        }
                    }
                }
                if(args._cellIndex === 0 && this._wijgrid.options.showRowHeader) {
                    args.$cell.attr({
                        "role": "rowheader",
                        "scope": "row"
                    }).addClass(this._wijgrid.options.wijCSS.stateDefault + " " + this._wijgrid.options.wijCSS.content + " wijmo-wijgrid-rowheader");
                } else {
                    switch(rowType) {
                        case ($rt.header):
                            args.$cell.attr({
                                "role": "columnheader",
                                "scope": "col"
                            });
                            break;
                        case ($rt.footer):
                            args.$cell.attr({
                                "role": "columnfooter",
                                "scope": "col"
                            });
                            break;
                        default:
                            args.$cell.attr("role", "gridcell");
                    }
                }
                //if ((rowType & $rt.data) === $rt.data) {
                if(rowType & $rt.data) {
                    if(args._cellIndex >= 0 && leaf/* && leaf.dataParser*/ ) {
                        args.$cell.attr("headers", (window).escape(leaf.headerText));
                        if(leaf.readOnly) {
                            args.$cell.attr("aria-readonly", true);
                        }
                        if(leaf.dataIndex >= 0) {
                            args.$cell.addClass("wijdata-type-" + wijmo.grid.getDataType(leaf));
                        }
                    }
                }
                if(rowType === $rt.groupHeader || rowType === $rt.groupFooter) {
                    // append wijdata-type class only to the aggregate cells of the group row, not grouped cells.
                    if(leaf && args._purpose === wijmo.grid.groupRowCellPurpose.aggregateCell) {
                        args.$cell.addClass("wijdata-type-" + wijmo.grid.getDataType(leaf));
                    }
                }
            };
            cellStyleFormatterHelper.prototype._currentStateFormatter = function (args, add) {
                var $rt = wijmo.grid.rowType;
                if(add) {
                    args.$cell.addClass(this._wijgrid.options.wijCSS.stateActive);
                    if(args.row.type === $rt.header) {
                        args.$cell.addClass("wijmo-wijgrid-current-headercell");
                    } else {
                        args.$cell.addClass("wijmo-wijgrid-current-cell");
                    }
                } else {
                    args.$cell.removeClass(this._wijgrid.options.wijCSS.stateActive);
                    if(args.row.type === $rt.header) {
                        args.$cell.removeClass("wijmo-wijgrid-current-headercell");
                    } else {
                        args.$cell.removeClass("wijmo-wijgrid-current-cell");
                    }
                }
            };
            cellStyleFormatterHelper.prototype._hoveredStateFormatter = function (args, add) {
                if(add) {
                } else {
                }
            };
            cellStyleFormatterHelper.prototype._selectedStateFormatter = function (args, add) {
                if(add) {
                    args.$cell.addClass(this._wijgrid.options.wijCSS.stateHightlight).attr("aria-selected", "true");
                } else {
                    args.$cell.removeClass(this._wijgrid.options.wijCSS.stateHightlight).removeAttr("aria-selected");
                }
            };
            return cellStyleFormatterHelper;
        })();
        grid.cellStyleFormatterHelper = cellStyleFormatterHelper;
        // --- private
            })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts" />
    /// <reference path="wijgrid.ts" />
    /// <reference path="misc.ts" />
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var rowStyleFormatterHelper = (function () {
            function rowStyleFormatterHelper(wijgrid) {
                if(!wijgrid) {
                    throw "invalid arguments";
                }
                this._wijgrid = wijgrid;
            }
            rowStyleFormatterHelper.prototype.format = function (rowInfo, rowAttr, rowStyle) {
                var $rs = wijmo.grid.renderState, $rt = wijmo.grid.rowType, state = rowInfo.state, args = rowInfo;
                if(state === $rs.rendering) {
                    this._renderingStateFormatter(args, rowAttr, rowStyle);
                } else {
                    this._currentStateFormatter(args, (state & $rs.current) !== 0);
                    this._hoveredStateFormatter(args, (state & $rs.hovered) !== 0);
                    this._selectedStateFormatter(args, (state & $rs.selected) !== 0);
                }
                if($.isFunction(this._wijgrid.options.rowStyleFormatter)) {
                    this._wijgrid.options.rowStyleFormatter(args);
                }
            };
            rowStyleFormatterHelper.prototype._renderingStateFormatter = // * private
            function (args, rowAttr, rowStyle) {
                var className = "wijmo-wijgrid-row " + this._wijgrid.options.wijCSS.content, contentClass = "wijmo-wijgrid-row " + this._wijgrid.options.wijCSS.content, $rt = wijmo.grid.rowType, key;
                args.$rows.attr("role", "row");
                // copy attributes
                if(rowAttr) {
                    for(key in rowAttr) {
                        if(rowAttr.hasOwnProperty(key)) {
                            if(key === "class") {
                                args.$rows.addClass(rowAttr[key]);
                            } else {
                                args.$rows.attr(key, rowAttr[key]);
                                if(args.$rows[0].style.height) {
                                    args.$rows.each(function () {
                                        $.data(this, "customHeight", this.style.height);
                                        return true;
                                    });
                                }
                            }
                        }
                    }
                }
                // copy inline css
                if(rowStyle) {
                    for(key in rowStyle) {
                        if(rowStyle.hasOwnProperty(key)) {
                            args.$rows.css(key, rowStyle[key]);
                        }
                    }
                }
                switch(args.type & ~$rt.dataAlt) {
                    case // clear dataAlt modifier
                    ($rt.header):
                        className = "wijmo-wijgrid-headerrow";
                        break;
                    case ($rt.data):
                        className = contentClass + " wijmo-wijgrid-datarow";
                        if(args.type & $rt.dataAlt) {
                            className += " wijmo-wijgrid-alternatingrow";
                        }
                        break;
                    case ($rt.emptyDataRow):
                        className = contentClass + " wijmo-wijgrid-emptydatarow";
                        break;
                    case ($rt.filter):
                        className = "wijmo-wijgrid-filterrow";
                        break;
                    case ($rt.groupHeader):
                        className = contentClass + " wijmo-wijgrid-groupheaderrow";
                        break;
                    case ($rt.groupFooter):
                        className = contentClass + " wijmo-wijgrid-groupfooterrow";
                        break;
                    case ($rt.footer):
                        className = "wijmo-wijgrid-footerrow " + this._wijgrid.options.wijCSS.stateHightlight;
                        break;
                    default:
                        throw wijmo.grid.stringFormat("unknown rowType: {0}", args.type);
                }
                args.$rows.addClass(className);
            };
            rowStyleFormatterHelper.prototype._currentStateFormatter = function (args, flag) {
                if(this._wijgrid.options.showRowHeader) {
                    // make deal with the row header cell
                    if(flag) {
                        // add formatting
                        $((args.$rows[0]).cells[0]).addClass(this._wijgrid.options.wijCSS.stateActive + " wijmo-wijgrid-current-rowheadercell");
                    } else {
                        // remove formatting
                        $((args.$rows[0]).cells[0]).removeClass(this._wijgrid.options.wijCSS.stateActive + " wijmo-wijgrid-current-rowheadercell");
                    }
                }
            };
            rowStyleFormatterHelper.prototype._hoveredStateFormatter = function (args, flag) {
                if(flag) {
                    // add formatting
                    args.$rows.addClass(this._wijgrid.options.wijCSS.stateHover);
                } else {
                    // remove formatting
                    args.$rows.removeClass(this._wijgrid.options.wijCSS.stateHover);
                }
            };
            rowStyleFormatterHelper.prototype._selectedStateFormatter = function (args, flag) {
                if(flag) {
                    // add formatting
                                    } else {
                    // remove formatting
                                    }
            };
            return rowStyleFormatterHelper;
        })();
        grid.rowStyleFormatterHelper = rowStyleFormatterHelper;
        // private *
            })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var tally = (function () {
            function tally() {
                this._sum = 0;
                this._sum2 = 0;
                this._cntNumbers = 0;
                this._cntStrings = 0;
                this._cntDates = 0;
                this._max = 0;
                this._min = 0;
                this._minDate = 0;
                this._maxDate = 0;
            }
            tally.prototype.add = function (value) {
                if(value === null || value === "") {
                    return;
                }
                var foo, typeOf = (value instanceof Date) ? "datetime" : typeof (value);
                // * count strings *
                foo = value.toString()// value = _parseValue(value);
                ;
                if(this._cntStrings++ === 0) {
                    this._minString = this._maxString = foo;
                }
                if(foo < this._minString) {
                    this._minString = foo;
                }
                if(foo > this._maxString) {
                    this._maxString = foo;
                }
                // * count numbers *
                if(typeOf === "number") {
                    if(this._cntNumbers++ === 0) {
                        this._min = this._max = value;
                    }
                    this._sum += value;
                    this._sum2 += value * value;
                    if(value < this._min) {
                        this._min = value;
                    }
                    if(value > this._max) {
                        this._max = value;
                    }
                } else {
                    // * count dates *
                    if(typeOf === "datetime") {
                        foo = value.getTime();
                        if(this._cntDates++ === 0) {
                            this._minDate = this._maxDate = foo;
                        }
                        if(foo < this._minDate) {
                            this._minDate = foo;
                        }
                        if(foo > this._maxDate) {
                            this._maxDate = foo;
                        }
                    }
                }
            };
            tally.prototype.getValueString = function (column) {
                var wijgrid = column.owner;
                if(this._cntNumbers && (column.dataType === "number" || column.dataType === "currency")) {
                    var value = this._getValue(column.aggregate);
                    return wijgrid._toStr(column, value);
                }
                // we only support max/min and count for dates
                if(this._cntDates && (column.dataType === "datetime")) {
                    // we only support max/min and count for dates
                    switch(column.aggregate) {
                        case "max":
                            return wijgrid._toStr(column, new Date(this._maxDate));
                        case "min":
                            return wijgrid._toStr(column, new Date(this._minDate));
                        case "count":
                            return this._cntStrings + "";
                    }
                }
                // we only support max/min and count for strings
                if(this._cntStrings) {
                    switch(column.aggregate) {
                        case "max":
                            return this._maxString;
                        case "min":
                            return this._minString;
                        case "count":
                            return this._cntStrings + "";
                    }
                }
                return "";
            };
            tally.prototype._getValue = function (aggregate) {
                switch(aggregate) {
                    case "average":
                        return (this._cntNumbers === 0) ? 0 : this._sum / this._cntNumbers;
                    case "count":
                        return this._cntStrings;
                    case "max":
                        return this._max;
                    case "min":
                        return this._min;
                    case "sum":
                        return this._sum;
                    case "std":
                        if(this._cntNumbers <= 1) {
                            return 0;
                        }
                        return Math.sqrt(this._getValue("var"));
                    case "stdPop":
                        if(this._cntNumbers <= 1) {
                            return 0;
                        }
                        return Math.sqrt(this._getValue("varPop"));
                    case "var":
                        if(this._cntNumbers <= 1) {
                            return 0;
                        }
                        return this._getValue("varPop") * this._cntNumbers / (this._cntNumbers - 1);
                    case "vapPop":
                        if(this._cntNumbers <= 1) {
                            return 0;
                        }
                        var tmp = this._sum / this._cntNumbers;
                        return this._sum2 / this._cntNumbers - tmp * tmp;
                }
                return 0;
            };
            return tally;
        })();
        grid.tally = tally;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    /// <reference path="wijgrid.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var uiFrozener = (function () {
            function uiFrozener(wijgrid) {
                this._docEventsUID = "wijgridfrozener" + wijmo.grid.getUID();
                this._docEventsAttached = false;
                this._newStaticIndex = -1;
                // depends on e.data value (staticRowIndex or staticColumnIndex)
                this._staticColumnIndex = -1;
                this._staticRowIndex = -1;
                this._staticOffsetH = 0;
                this._staticOffsetV = 0;
                this._inProgress = false;
                this._wijgrid = wijgrid;
                this.refresh();
            }
            uiFrozener.prototype.inProgress = function () {
                return this._inProgress;
            };
            uiFrozener.prototype.refresh = function () {
                this.dispose();
                this._$outerDiv = this._wijgrid.outerDiv.find(".wijmo-wijgrid-fixedview");
                this._superPanel = (this._wijgrid._view())._getSuperPanel();
                this._staticOffsetH = this._wijgrid._getStaticOffsetIndex(false);
                this._staticOffsetV = this._wijgrid._getStaticOffsetIndex(true);
                this._staticColumnIndex = this._wijgrid._getStaticIndex(false);
                this._staticRowIndex = this._wijgrid._getStaticIndex(true);
                this._visibleBounds = this._wijgrid._view().getVisibleAreaBounds();
                var allFixedAreaBounds = wijmo.grid.bounds(this._$outerDiv.find(".wijmo-wijgrid-split-area-nw")), containerBounds = wijmo.grid.bounds(this._$outerDiv);
                this._createVBar(this._visibleBounds, allFixedAreaBounds, containerBounds);
                this._createHBar(this._visibleBounds, allFixedAreaBounds, containerBounds);
            };
            uiFrozener.prototype.dispose = function () {
                if(this._$hBar) {
                    this._$hBar.remove();
                    this._$hBar = null;
                }
                if(this._$vBar) {
                    this._$vBar.remove();
                    this._$vBar = null;
                }
                if(this._$proxy) {
                    this._$proxy.remove();
                    this._$proxy = null;
                }
                this._$outerDiv = null;
                this._superPanel = null;
                this._detachDocEvents();
            };
            uiFrozener.prototype._createVBar = function (visibleBounds, allFixedAreaBounds, containerBounds) {
                var leftPos = allFixedAreaBounds.width + allFixedAreaBounds.left, self = this;
                if(leftPos <= visibleBounds.left + visibleBounds.width) {
                    this._$vBar = $("<div><div></div></div>").addClass("wijmo-wijgrid-frozener-v").css({
                        left: leftPos - containerBounds.left,
                        top: allFixedAreaBounds.top - containerBounds.top,
                        height: visibleBounds.height + visibleBounds.top - allFixedAreaBounds.top
                    }).bind("mousedown", function (e) {
                        e.data = true// vertical bar
                        ;
                        self._onBarMouseDown.apply(self, arguments);
                    }).appendTo(this._$outerDiv);
                    // content
                    this._$vBar.find("div").addClass(this._wijgrid.options.wijCSS.header).css({
                        width: 0,
                        height: "100%"
                    });
                }
            };
            uiFrozener.prototype._createHBar = function (visibleBounds, allFixedAreaBounds, containerBounds) {
                var topPos = allFixedAreaBounds.top + allFixedAreaBounds.height, self = this;
                if(topPos <= visibleBounds.top + visibleBounds.height) {
                    this._$hBar = $("<div><div></div></div>").addClass("wijmo-wijgrid-frozener-h").css({
                        left: allFixedAreaBounds.left - containerBounds.left,
                        top: topPos - containerBounds.top,
                        width: visibleBounds.width + visibleBounds.left - allFixedAreaBounds.left
                    }).bind("mousedown", function (e) {
                        e.data = false// horizontal bar
                        ;
                        self._onBarMouseDown.apply(self, arguments);
                    }).appendTo(this._$outerDiv);
                    // content
                    this._$hBar.find("div").addClass(this._wijgrid.options.wijCSS.header).css({
                        width: "100%",
                        height: 0
                    });
                }
            };
            uiFrozener.prototype._onBarMouseDown = // e.data.vertical
            function (e) {
                this._visibleBounds = this._wijgrid._view().getVisibleAreaBounds();
                this._newStaticIndex = e.data ? this._staticColumnIndex : this._staticRowIndex;
                this._$proxy = $("<div class=\"wijmo-wijgrid-resizehandle " + this._wijgrid.options.wijCSS.header + "\"></div>").appendTo(document.body);
                this._attachDocEvents(e.data);
                this._inProgress = true;
                // prevent selectionUI from taking effect
                e.stopPropagation();
            };
            uiFrozener.prototype._onDocumentMouseMove = function (e) {
                if(e.data && this._superPanel.options.hScroller.scrollValue) {
                    (this._superPanel).hScrollTo(0);
                } else if(!e.data && this._superPanel.options.vScroller.scrollValue) {
                    (this._superPanel).vScrollTo(0);
                }
                this._showPosition(e);
            };
            uiFrozener.prototype._onDocumentMouseUp = function (e) {
                try  {
                    if(this._$proxy) {
                        this._$proxy.remove();
                    }
                    this._detachDocEvents();
                    if(e.data) {
                        // vertical bar
                        if(this._newStaticIndex !== this._staticColumnIndex) {
                            this._wijgrid.option("staticColumnIndex", this._newStaticIndex);
                        }
                    } else {
                        // horizontal bar
                        if(this._newStaticIndex !== this._staticRowIndex) {
                            this._wijgrid.option("staticRowIndex", this._newStaticIndex);
                        }
                    }
                }finally {
                    this._$proxy = null;
                    this._inProgress = false;
                }
            };
            uiFrozener.prototype._attachDocEvents = function (verticalBarTouched) {
                if(!this._docEventsAttached) {
                    try  {
                        if($.fn.disableSelection) {
                            $(document.body).disableSelection();
                        }
                        this._wijgrid._view().toggleDOMSelection(false);
                        $(document).bind(this._docEventKey("mousemove"), verticalBarTouched, $.proxy(this._onDocumentMouseMove, this)).bind(this._docEventKey("mouseup"), verticalBarTouched, $.proxy(this._onDocumentMouseUp, this));
                    }finally {
                        this._docEventsAttached = true;
                    }
                }
            };
            uiFrozener.prototype._detachDocEvents = function () {
                if(this._docEventsAttached) {
                    try  {
                        if($.fn.enableSelection) {
                            $(document.body).enableSelection();
                        }
                        this._wijgrid._view().toggleDOMSelection(true);
                        $(document).unbind("." + this._docEventsUID);
                    }finally {
                        this._docEventsAttached = false;
                    }
                }
            };
            uiFrozener.prototype._docEventKey = function (eventName) {
                return wijmo.grid.stringFormat("{0}.{1}", eventName, this._docEventsUID);
            };
            uiFrozener.prototype._showPosition = function (e) {
                var element, elementBounds, centerXOrY, currentIdx, prevIdx, leftOrTop, position, barBounds;
                if(e.data) {
                    // vertical
                    barBounds = wijmo.grid.bounds(this._$vBar);
                    if(Math.abs(e.pageX - (barBounds.left + barBounds.width / 2)) < barBounds.width) {
                        this._$proxy.hide();
                        return;
                    }
                    if((element = this._getFieldByPos({
                        x: e.pageX,
                        y: e.pageY
                    }))) {
                        // get column widget
                        elementBounds = wijmo.grid.bounds(element.element);
                        centerXOrY = elementBounds.left + elementBounds.width / 2;
                        currentIdx = element.options.visLeavesIdx - this._staticOffsetV;
                        prevIdx = Math.max(currentIdx - 1, -1);
                        leftOrTop = e.pageX < centerXOrY ? (prevIdx !== this._staticColumnIndex) : (currentIdx === this._staticColumnIndex);
                        position = leftOrTop ? elementBounds.left : elementBounds.left + elementBounds.width;
                        if(!wijmo.grid.isOverAxis(position, this._visibleBounds.left - 1, this._visibleBounds.width + 2)) {
                            return;
                        }
                        this._newStaticIndex = leftOrTop ? prevIdx : currentIdx;
                        this._$proxy.show().css({
                            left: position,
                            top: elementBounds.top,
                            width: 3,
                            height: this._visibleBounds.height + this._visibleBounds.top - elementBounds.top
                        });
                    }
                } else {
                    // horizontal
                    barBounds = wijmo.grid.bounds(this._$hBar);
                    if(Math.abs(e.pageY - (barBounds.top + barBounds.height / 2)) < barBounds.height) {
                        this._$proxy.hide();
                        return;
                    }
                    if((element = this._getRowByPos({
                        x: e.pageX,
                        y: e.pageY
                    }))) {
                        elementBounds = wijmo.grid.bounds(element);
                        centerXOrY = elementBounds.top + elementBounds.height / 2;
                        currentIdx = this._wijgrid._view().getAbsoluteRowIndex(element) - this._staticOffsetH;
                        prevIdx = Math.max(currentIdx - 1, -1);
                        leftOrTop = e.pageY < centerXOrY ? (prevIdx !== this._staticRowIndex) : (currentIdx === this._staticRowIndex);
                        position = leftOrTop ? elementBounds.top : elementBounds.top + elementBounds.height;
                        if(!wijmo.grid.isOverAxis(position, this._visibleBounds.top - 1, this._visibleBounds.height + 2)) {
                            return;
                        }
                        this._newStaticIndex = leftOrTop ? prevIdx : currentIdx;
                        this._$proxy.show().css({
                            left: elementBounds.left,
                            top: position,
                            width: this._visibleBounds.width + this._visibleBounds.left - elementBounds.left,
                            height: 3
                        });
                    }
                }
            };
            uiFrozener.prototype._getFieldByPos = function (pos) {
                var columns = this._wijgrid.columns(), i, len, colWidget, o, bounds;
                for(i = 0 , len = columns.length; i < len; i++) {
                    colWidget = columns[i];
                    o = colWidget.options;
                    if(o.isLeaf) {
                        bounds = wijmo.grid.bounds(colWidget.element);
                        if(wijmo.grid.isOverAxis(pos.x, bounds.left, bounds.width)) {
                            return colWidget;
                        }
                    }
                }
                return null;
            };
            uiFrozener.prototype._getRowByPos = function (pos) {
                var rows = this._wijgrid._rows(), i, len, row, bounds;
                for(i = 0 , len = rows.length(); i < len; i++) {
                    row = rows.item(i)[0];
                    bounds = wijmo.grid.bounds($(row));
                    if(wijmo.grid.isOverAxis(pos.y, bounds.top, bounds.height)) {
                        return row;
                    }
                }
                return null;
            };
            return uiFrozener;
        })();
        grid.uiFrozener = uiFrozener;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    /// <reference path="bands_traversing.ts"/>
    /// <reference path="misc.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var columnsGenerator = (function () {
            function columnsGenerator() { }
            columnsGenerator.generate = function generate(mode, fieldsInfo, columns) {
                switch(mode) {
                    case "append":
                        columnsGenerator._processAppendMode(fieldsInfo, columns);
                        break;
                    case "merge":
                        columnsGenerator._processMergeMode(fieldsInfo, columns);
                        break;
                    case "none":
                        break;
                    default:
                        throw wijmo.grid.stringFormat("Unsupported value: \"{0}\"", mode);
                }
            };
            columnsGenerator._processAppendMode = function _processAppendMode(fieldsInfo, columns) {
                var autoColumns = {
                };
                wijmo.grid.traverse(columns, function (column) {
                    if(column.dynamic && wijmo.grid.validDataKey(column.dataKey)) {
                        autoColumns[column.dataKey] = true;
                    }
                });
                $.each(fieldsInfo, function (key, fieldInfo) {
                    if(("name" in fieldInfo) && !autoColumns[fieldInfo.name]) {
                        var leaf = columnsGenerator._createAutoField(fieldInfo);
                        columns.push(leaf);
                    }
                });
            };
            columnsGenerator._processMergeMode = function _processMergeMode(fieldsInfo, columns) {
                var columnsHasNoDataKey = [], i;
                wijmo.grid.traverse(columns, function (column) {
                    if(column.isLeaf && !column.isBand) {
                        var dataKey = column.dataKey;
                        if(wijmo.grid.validDataKey(dataKey)) {
                            if(fieldsInfo[dataKey] !== undefined) {
                                delete fieldsInfo[dataKey];
                            }
                        } else {
                            if(dataKey !== null) {
                                // don't linkup with any data field if dataKey is null
                                columnsHasNoDataKey.push(column);
                            }
                        }
                    }
                });
                if(columnsHasNoDataKey.length) {
                    i = 0;
                    $.each(fieldsInfo, function (key, info) {
                        var leaf = columnsHasNoDataKey[i++];
                        if(leaf) {
                            leaf.dataKey = info.name;
                            delete fieldsInfo[key];
                        }
                    });
                }
                $.each(fieldsInfo, function (key, info) {
                    var leaf = columnsGenerator._createAutoField(info);
                    columns.push(leaf);
                });
            };
            columnsGenerator._createAutoField = function _createAutoField(fieldInfo) {
                return wijmo.grid.createDynamicField({
                    dataKey: fieldInfo.name
                });
            };
            return columnsGenerator;
        })();
        grid.columnsGenerator = columnsGenerator;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        var uiVirtualScroller = (function () {
            function uiVirtualScroller(wijgrid, $content, fixedAreaHeight) {
                this._timer = 0;
                this._timeout = 50;
                // msec
                this._ignoreScrollEvents = false;
                this._wijgrid = wijgrid;
                this._fixedAreaHeight = fixedAreaHeight;
                this._view = this._wijgrid._view();
                this._N = this._wijgrid._totalRowsCount();
                var rowH = 20, height = // empirically
                this._wijgrid.outerDiv.height() + this._N * rowH;
                // total height
                                $content.height(height - fixedAreaHeight - (this._N > 0 ? rowH : 0))// height of the scrollable content
                ;
                this._view._splitAreas.sw.height(height);
            }
            uiVirtualScroller.prototype.attach = function ($scroller) {
                this._$scroller = $scroller;
                this._panelInst = $scroller.data("wijmo-wijsuperpanel");
                var tmp, $view = $scroller.find(".wijmo-wijsuperpanel-contentwrapper:first"), contentHeight = (this._panelInst).getContentElement().height()/*$content.height()*/ , totalHeight = this._fixedAreaHeight + contentHeight, viewHeight = $view.innerHeight(), smallChange = (101 / (this._N - 1)) * ((totalHeight - viewHeight) / totalHeight);
                // set scrollSmallChange value
                tmp = this._panelInst.options.vScroller;
                tmp.scrollSmallChange = smallChange;
                this._panelInst.option("vScroller", tmp);
                $scroller.bind("wijsuperpanelscrolled.wijgrid", $.proxy(this._onSuperpanelScrolled, this));
                $scroller.bind("wijsuperpanelscrolling.wijgrid", $.proxy(this._onSuperpanelScrolling, this));
                $scroller.bind("wijsuperpanelscrolled.wijgrid", $.proxy(this._onSuperpanelPostScrolled, this))// manipulate with the _ignoreScrollEvents property.
                ;
            };
            uiVirtualScroller.prototype.dispose = function () {
                this._$scroller.unbind(".wijgrid");
                this._clearTimer();
            };
            uiVirtualScroller.prototype._clearTimer = function () {
                window.clearTimeout(this._timer);
                this._timer = 0;
            };
            uiVirtualScroller.prototype._onSuperpanelScrolling = function (e, args) {
                if(this._ignoreScrollEvents || (args.dir !== "v")) {
                    return;
                }
                if(this._timer === -1) {
                    return false;// cancel while scrolling will not be handled.

                }
            };
            uiVirtualScroller.prototype._onSuperpanelScrolled = function (e, args) {
                var self = this;
                if(this._ignoreScrollEvents || (args.dir !== "v")) {
                    return;
                }
                if(this._timer > 0) {
                    this._clearTimer();
                }
                if(this._timer !== -1) {
                    this._timer = window.setTimeout(function () {
                        self._timer = -1// lock
                        ;
                        var scrollToIndex = Math.round(args.newValue / self._panelInst.options.vScroller.scrollSmallChange), oldScrollIndex = self._view._bounds.start;
                        if(scrollToIndex < 0) {
                            scrollToIndex = 0;
                        }
                        if(scrollToIndex >= self._N) {
                            scrollToIndex = self._N - 1;
                        }
                        if(scrollToIndex !== oldScrollIndex) {
                            self._wijgrid._handleVirtualScrolling(scrollToIndex, $.proxy(self._scrollingCompleted, self));
                        } else {
                            self._log();
                            self._clearTimer()// unlock
                            ;
                        }
                    }, this._timeout);
                }
            };
            uiVirtualScroller.prototype._scrollingCompleted = function (scrollIndex) {
                this._wijgrid._trackScrollingIndex(scrollIndex);
                this._log();
                this._clearTimer()// unlock
                ;
            };
            uiVirtualScroller.prototype._onSuperpanelPostScrolled = function () {
                if($.isFunction(this._postScrolled)) {
                    this._postScrolled.apply(this, arguments);
                }
            };
            uiVirtualScroller.prototype._log = function () {
                /*if (window.console) {
                var bounds = wijgrid._view()._bounds;
                window.console.log("bounds: [" + bounds.start + ", " + bounds.end + "], scrollTo: " + bounds.start);
                }*/
                            };
            return uiVirtualScroller;
        })();
        grid.uiVirtualScroller = uiVirtualScroller;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="../../../data/src/core.ts"/>
    /// <reference path="../../../data/src/util.ts"/>
    /// <reference path="../../../data/src/errors.ts"/>
    /// <reference path="../../../external/declarations/globalize.d.ts"/>
    (function (data) {
        var $ = jQuery, glob = Globalize;
        function convert(val, fromType, toType, options) {
            var origValue = val;
            options = $.extend({
                nullString: "",
                format: ""
            }, options);
            function getParser(type) {
                options.parser = options.parser || data.defaultParsers[type];
                if(!options.parser && val != null) {
                    data.errors.noParser(type);
                }
                return options.parser;
            }
            fromType = fromType || val != null && typeof val;
            toType = toType || fromType;
            if(!toType) {
                return val;
            }
            if(toType == "string") {
                getParser(fromType);
                if(!options.parser) {
                    return val;
                }
                return options.parser.toStr(val, options.culture, options.format, options.nullString, true);
            }
            getParser(toType);
            if(!options.parser) {
                return val;
            }
            val = options.parser.parse(val, options.culture, options.format, options.nullString, true);
            if(isNaN(val) && val != null && data.util.isNumeric(val)) {
                if(options.ignoreError) {
                    return origValue;
                }
                data.errors.cantConvert(toType, origValue);
            }
            return val;
        }
        data.convert = convert;
        data.defaultParsers = {
            string: {
                parse: // string -> string
                function (value, culture, format, nullString, convertEmptyStringToNull) {
                    switch(value) {
                        case null:
                            return null;
                        case nullString:
                            if(convertEmptyStringToNull) {
                                return null;
                            }
                        case undefined:
                        case "&nbsp":
                            return "";
                        default:
                            return "" + value;
                    }
                },
                toStr: // string -> string
                function (value, culture, format, nullString, convertEmptyStringToNull) {
                    if(value === null && convertEmptyStringToNull) {
                        return nullString;
                    }
                    return "" + value;
                }
            },
            number: {
                parse: // string/number -> number
                function (value, culture, format, nullString, convertEmptyStringToNull) {
                    var type = typeof (value);
                    if(type === "number") {
                        return isNaN(value) ? NaN : value;
                    }
                    if((!value && value !== 0) || (value === "&nbsp;") || (value === nullString && convertEmptyStringToNull)) {
                        return null;
                    }
                    return glob.parseFloat(value, 10, culture.name);
                },
                toStr: // number -> string
                function (value, culture, format, nullString, convertEmptyStringToNull) {
                    if(value === null && convertEmptyStringToNull) {
                        return nullString;
                    }
                    return glob.format(value, format ? format : "n", culture.name);
                }
            },
            currency: {
                parse: // string/number -> number
                function (value, culture, format, nullString, convertEmptyStringToNull) {
                    var type = typeof (value);
                    if(type === "number") {
                        return isNaN(value) ? NaN : value;
                    }
                    if((!value && value !== 0) || (value === "&nbsp;") || (value === nullString && convertEmptyStringToNull)) {
                        return null;
                    }
                    if(type === "string") {
                        value = value.replace(culture.numberFormat.currency.symbol, "");
                    }
                    return glob.parseFloat(value, 10, culture.name);
                },
                toStr: // number -> string (currency)
                function (value, culture, format, nullString, convertEmptyStringToNull) {
                    if(value === null && convertEmptyStringToNull) {
                        return nullString;
                    }
                    return glob.format(value, format ? format : "c", culture.name);
                }
            },
            datetime: {
                parse: // string/datetime -> datetime
                function (value, culture, format, nullString, convertEmptyStringToNull) {
                    var match;
                    if(value instanceof Date) {
                        return value;
                    }
                    if(!value || (value === "&nbsp;") || (value === nullString && convertEmptyStringToNull)) {
                        return null;
                    }
                    match = /^\/Date\((\d+)\)\/$/.exec(value);
                    if(match) {
                        return new Date(parseInt(match[1], 10));
                    }
                    var date = glob.parseDate(value, format, culture.name);
                    if(date == null || isNaN(date)) {
                        date = Date.parse(value);
                        date = isNaN(date) ? NaN : new Date(date);
                    }
                    return date;
                },
                toStr: // datetime -> string
                function (value, culture, format, nullString, convertEmptyStringToNull) {
                    if(value === null && convertEmptyStringToNull) {
                        return nullString;
                    }
                    return glob.format(value, format ? format : "d", culture.name);
                }
            },
            "boolean": { // Novius OS : Add "" under boolean for yui-compresor
                parse: // string/bool -> bool
                function (value, culture, format, nullString, convertEmptyStringToNull) {
                    var valType = typeof (value);
                    if(valType === "number") {
                        return value != 0;
                    }
                    if(valType === "boolean") {
                        return value;
                    }
                    if(valType === "string") {
                        value = $.trim(value);
                    }
                    if(!value || (value === "&nbsp;") || (value === nullString && convertEmptyStringToNull)) {
                        return null;
                    }
                    switch(value.toLowerCase()) {
                        case "true":
                            return true;
                        case "false":
                            return false;
                    }
                    return NaN;
                },
                toStr: // bool -> string
                function (value, culture, format, nullString, convertEmptyStringToNull) {
                    if(value === null && convertEmptyStringToNull) {
                        return nullString;
                    }
                    return (value) ? "true" : "false";
                }
            }
        };
        function checkGlob(func) {
            return function () {
                if(!glob) {
                    data.util.logError(data.errors.noGlobalize.create().message);
                }
                return func.apply(this, arguments);
            };
        }
        $.each(data.defaultParsers, function (_, parser) {
            parser.parse = parser.parse && checkGlob(parser.parse);
            parser.toStr = parser.toStr && checkGlob(parser.toStr);
        });
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    (function (data) {
        (function (filtering) {
            /// <reference path="../../../data/src/arrayDataView.ts"/>
            /** Provides compilation of the Extended Filtering Format
            *
            * @remarks
            * Some examples of extended filter format:
            *   [{ property: "name", value: "John" }, { property: "age", operator: "<", value: 10 }]
            *   ["or", { property: "name", value: "John" }, { property: "age", operator: "<", value: 10 }]
            *   ["and",
            *      ["or", { property: "name", value: "John" }, { property: "name", operator: "BeginsWith", value: "A" } ],
            *      { property: "age", operator: "<", value: 10 }]
            *   ]
            */
            (function (extended) {
                extended.Connective = {
                    AND: "and",
                    OR: "or"
                };
                function normalizeFilter(filter) {
                    function norm(filter) {
                        var result = [];
                        if(filter.length === 0) {
                            return result;
                        }
                        var connective = extended.Connective.AND;
                        data.util.each(filter, function (i, cond) {
                            if(i == 0 && data.util.isString(cond)) {
                                var lowerConnective = cond.toLowerCase();
                                if(lowerConnective == extended.Connective.AND || lowerConnective == extended.Connective.OR) {
                                    connective = lowerConnective;
                                    return;
                                }
                            }
                            if($.isArray(cond)) {
                                cond = norm(cond);
                                if(!cond) {
                                    return;
                                }
                                if(cond[0] === connective || cond.length == 2) {
                                    cond.shift();
                                    result = result.concat(cond);
                                    return;
                                }
                            } else {
                                var predicate = filtering.normalizeCondition(cond);
                                if(!predicate) {
                                    return;
                                }
                                predicate.property = cond.property;
                                cond = predicate;
                            }
                            result.push(cond);
                        });
                        if(result.length == 0) {
                            return null;
                        } else {
                            result.unshift(connective);
                            return result;
                        }
                    }
                    return norm(filter);
                }
                function compilAsExtended(extendedFilter) {
                    if(!$.isArray(extendedFilter)) {
                        return null;
                    }
                    var result = {
                        original: extendedFilter,
                        normalized: normalizeFilter(extendedFilter),
                        func: null
                    };
                    if(result.normalized == null) {
                        result.func = function (x) {
                            return true;
                        };
                    } else {
                        result.func = function (x) {
                            function check(filter) {
                                var isAnd = filter[0] === extended.Connective.AND, checker = isAnd ? data.util.every : data.util.some;
                                return checker(filter, function (cond, i) {
                                    if(i === 0) {
                                        return isAnd;
                                    }
                                    if($.isArray(cond)) {
                                        return check(cond);
                                    } else {
                                        var value = data.util.getProperty(x, cond.property);
                                        return cond.op.apply(value, cond.value);
                                    }
                                });
                            }
                            return check(result.normalized);
                        };
                    }
                    return result;
                }
                function compile(filter) {
                    return compilAsExtended(filter) || data.filtering.compile(filter);
                }
                extended.compile = compile;
            })(filtering.extended || (filtering.extended = {}));
            var extended = filtering.extended;
        })(data.filtering || (data.filtering = {}));
        var filtering = data.filtering;
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="../../../data/src/arrayDataView.ts"/>
    /// <reference path="wijmo.data.filtering.extended.ts"/>
    (function (grid) {
        var $ = jQuery;
        var wijdata = wijmo.data;
        var filterExt = wijdata.filtering.extended;
        // in fact implements IDataView in run-time, but not at compile-time
        var GridDataView = (function () {
            function GridDataView(real) {
                this.real = real;
                this._updatingFilter = false;
                this._overrideFilter();
                this._makeMemberProxies();
            }
            GridDataView.prototype._overrideFilter = function () {
                var _this = this;
                this.filter = wijdata.observable(this.real.filter());
                this.filter.subscribe(function (newValue) {
                    if(_this.real.filter() !== newValue && !_this._updatingFilter) {
                        _this.refresh({
                            filter: newValue
                        });
                    }
                });
                this.real.filter.subscribe(function (newValue) {
                    // Do not update this.filter if it is the same filter we've assigned to the underlying dataView.
                    // Otherwise we may end up replacing a property filter with a function
                    if(newValue !== _this._lastSetFilter) {
                        _this.filter(newValue);
                    }
                });
            };
            GridDataView.prototype.refresh = function (shape, local) {
                if (typeof local === "undefined") { local = false; }
                shape = $.extend({
                }, shape);
                var origFilter = shape.filter;
                shape.filter = this._coerceFilter(shape.filter);
                this._lastSetFilter = shape.filter;
                this._updatingFilter = true;
                try  {
                    if($.isFunction(shape.filter) && !$.isFunction(origFilter)) {
                        // it became a function. It means that the filter was complex
                        this.filter(origFilter);
                    } else {
                        this.filter(shape.filter);
                    }
                }finally {
                    this._updatingFilter = false;
                }
                return this.real.refresh(shape, local);
            };
            GridDataView.prototype._makeMemberProxies = function () {
                var _this = this;
                // make proxy methods for those that are not defined manually
                wijdata.util.each(this.real, function (key, value) {
                    if(!$.isFunction(value) || _this[key] || key.charAt(0) === "_") {
                        return;
                    }
                    _this[key] = $.isFunction(value.subscribe) ? value : function () {
                        return value.apply(_this.real, arguments);
                    };
                });
            };
            GridDataView.create = function create(dataView) {
                return new GridDataView(dataView);
            };
            GridDataView.prototype._convertComplexPropertyFilterToExtendedFilterFormat = function (filter) {
                var result = [];
                $.each(filter, function (prop, condList) {
                    if(!$.isArray(condList)) {
                        condList = [
                            condList
                        ];
                    } else {
                        var connective = wijdata.util.isString(condList[0]) && condList[0].toLowerCase();
                        if(connective === filterExt.Connective.AND || connective === filterExt.Connective.OR) {
                            result.push(condList);
                            return;
                        }
                    }
                    var normCondList = [];
                    $.each(condList, function (_, cond) {
                        var normCond = wijdata.filtering.normalizeCondition(cond);
                        if(normCond) {
                            normCond.property = prop;
                            normCondList.push(normCond);
                        }
                    });
                    if(normCondList.length > 0) {
                        result.push(normCondList);
                    }
                });
                return result.length > 0 ? result : null;
            };
            GridDataView.prototype._coerceFilter = function (filter) {
                if($.isArray(filter)) {
                    // assume extended
                    return filterExt.compile(filter).func;
                } else if(!$.isPlainObject(filter)) {
                    return filter;
                }
                filter = $.extend(true, {
                }, filter);
                var simpleFilter = {
                };
                $.each(filter, function (prop, cond) {
                    if(!$.isArray(cond)) {
                        cond = [
                            cond
                        ];
                    }
                    if(simpleFilter) {
                        var possibleConnective = wijdata.util.isString(cond[0]) && cond[0].toLowerCase();
                        if(cond.length == 1 || cond.length == 2 && (possibleConnective === "and" || possibleConnective === "or")) {
                            simpleFilter[prop] = cond[cond.length - 1];
                            return;
                        }
                    }
                    filter[prop] = cond;
                    simpleFilter = null;
                });
                if(simpleFilter) {
                    return simpleFilter;
                }
                var extendedFilter = this._convertComplexPropertyFilterToExtendedFilterFormat(filter);
                return filterExt.compile(extendedFilter).func;
            };
            GridDataView.prototype._unsafeReplace = function (index, newItem) {
                (this.real).sourceArray[index] = newItem;
                (this.real).local[index] = newItem;
            };
            GridDataView.prototype._unsafeSplice = function (index, count, item) {
                if(arguments.length === 2) {
                    (this.real).sourceArray.splice(index, count);
                    (this.real).local.splice(index, count);
                } else {
                    (this.real).sourceArray.splice(index, count, item);
                    (this.real).local.splice(index, count, item);
                }
            };
            GridDataView.prototype._unsafePush = function (item) {
                (this.real).sourceArray.push(item);
                (this.real).local.push(item);
            };
            return GridDataView;
        })();
        grid.GridDataView = GridDataView;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
