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
 * jquery.wijmo.wijinputdateformat.js
 * jquery.wijmo.wijinputdate.js
 * jquery.wijmo.wijinputtextformat.js
 * jquery.wijmo.wijinputtext.js
 * jquery.wijmo.wijinputnumberformat.js
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
    /// <reference path="../../../Base/jquery.wijmo.widget.ts"/>
    /// <reference path="interfaces.ts" />
    /// <reference path="bands_traversing.ts" />
    /// <reference path="misc.ts"/>
    /// <reference path="cellInfo.ts"/>
    /// <reference path="selection.ts"/>
    /// <reference path="cellEditorHelper.ts"/>
    /// <reference path="cellFormatterHelper.ts"/>
    /// <reference path="cellStyleFormatterHelper.ts"/>
    /// <reference path="rowStyleFormatterHelper.ts"/>
    /// <reference path="fixedView.ts"/>
    /// <reference path="flatView.ts"/>
    /// <reference path="dataViewWrapper.ts"/>
    /// <reference path="filterOperators.ts"/>
    /// <reference path="columnsGenerator.ts"/>
    /// <reference path="rowAccessor.ts"/>
    /// <reference path="grouper.ts"/>
    /// <reference path="renderBoundsCollection.ts"/>
    /// <reference path="uiDragndrop.ts"/>
    /// <reference path="uiSelection.ts"/>
    /// <reference path="uiResizer.ts"/>
    /// <reference path="uiFrozener.ts"/>
    /// <reference path="c1field.ts"/>
    /// <reference path="c1band.ts"/>
    /// <reference path="c1buttonfield.ts"/>
    /// <reference path="sketchTable.ts"/>
    /// <reference path="../../../data/src/core.ts"/>
    /// <reference path="../../../data/src/dataView.ts"/>
    /// <reference path="../data/converters.ts"/>
    /// <reference path="../data/koDataView.ts"/> // add reference, otherwise it will be not added to the grunt output.
    /// <reference path="../../../wijpager/jquery.wijmo.wijpager.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /** @ignore */
        function extendWidgetOptions(baseOptions, newOptions) {
            var result = $.extend(true, {
            }, baseOptions, newOptions);
            delete result.constructor// Remove the constructor because the widget.options object is a ts class now (widgetName_options).
            ;
            return result;
        }
        grid.extendWidgetOptions = extendWidgetOptions;
        /** @widget
        * Represents the wijgrid widget.
        */
        var wijgrid = (function (_super) {
            __extends(wijgrid, _super);
            function wijgrid() {
                _super.apply(this, arguments);

                // private fields **
                this._dataOffset = 0;
                // h. pos, v. pos, virtual scroll index
                this.rowOuterHeight = -1;
                this._windowResizeTimer = 0;
                this.mEditSkechRowIndex = -1;
                this.mCurrentCellLocker = false;
            }
            wijgrid.CSS = {
                wijgrid: "wijmo-wijgrid",
                root: "wijmo-wijgrid-root",
                editedCellMarker: "wijmo-wijgrid-cell-edit",
                inputMarker: "wijgridinput",
                table: "wijmo-wijgrid-table",
                TH: "wijgridth",
                TD: "wijgridtd",
                cellContainer: "wijmo-wijgrid-innercell",
                aggregateContainer: "wijmo-wijgrid-aggregate",
                rowHeader: "wijmo-wijgrid-rowheader",
                currentRowHeaderCell: "wijmo-wijgrid-current-rowheadercell",
                currentHeaderCell: "wijmo-wijgrid-current-headercell",
                currentCell: "wijmo-wijgrid-current-cell",
                cellAlignLeft: "wijalign-left",
                cellAlignRight: "wijalign-right",
                cellAlignCenter: "wijalign-center",
                filterList: "wijmo-wijgrid-filterlist",
                filter: "wijmo-wijgrid-filter",
                filterInput: "wijmo-wijgrid-filter-input",
                filterTrigger: "wijmo-wijgrid-filter-trigger",
                filterNativeHtmlEditorWrapper: "wijgrid-input-wrapper",
                headerArea: "wijmo-wijgrid-header",
                footerArea: "wijmo-wijgrid-footer",
                headerRow: "wijmo-wijgrid-headerrow",
                row: "wijmo-wijgrid-row",
                dataRow: "wijmo-wijgrid-datarow",
                altRow: "wijmo-wijgrid-alternatingrow",
                emptyDataRow: "wijmo-wijgrid-emptydatarow",
                filterRow: "wijmo-wijgrid-filterrow",
                groupHeaderRow: "wijmo-wijgrid-groupheaderrow",
                groupFooterRow: "wijmo-wijgrid-groupfooterrow",
                groupHeaderRowCollapsed: "wijmo-wijgrid-groupheaderrow-collapsed",
                groupHeaderRowExpanded: "wijmo-wijgrid-groupheaderrow-expanded",
                footerRow: "wijmo-wijgrid-footerrow",
                loadingOverlay: "wijmo-wijgrid-overlay",
                loadingText: "wijmo-wijgrid-loadingtext",
                groupArea: "wijmo-wijgrid-group-area",
                groupAreaEmpty: "wijmo-wijgrid-group-area-empty",
                groupAreaButton: "wijmo-wijgrid-group-button",
                groupAreaButtonSort: "wijmo-wijgrid-group-button-sort",
                groupAreaButtonClose: "wijmo-wijgrid-group-button-close",
                groupToggleVisibilityButton: "wijmo-wijgrid-grouptogglebtn",
                fixedView: "wijmo-wijgrid-fixedview",
                scroller: "wijmo-wijgrid-scroller",
                dndHelper: "wijmo-wijgrid-dnd-helper",
                dndArrowTopContainer: "wijmo-wijgrid-dnd-arrow-top",
                dndArrowBottomContainer: "wijmo-wijgrid-dnd-arrow-bottom",
                freezingHandleV: "wijmo-wijgrid-freezing-handle-v",
                freezingHandleH: "wijmo-wijgrid-freezing-handle-h",
                freezingHandleContent: "wijmo-wijgrid-freezing-handle-content",
                resizingHandle: "wijmo-wijgrid-resizehandle",
                headerCellSortIcon: "wijmo-wijgrid-sort-icon",
                headerCellText: "wijmo-wijgrid-headertext",
                c1basefield: "wijmo-c1basefield",
                c1band: "wijmo-c1band",
                c1field: "wijmo-c1field"
            };
            wijgrid.prototype._createWidget = // stores the deficient filters (one of the filterOperator\ filterValue values is unknown) during the dataView round trip by the dataKey.
            // * override
            function (options, element) {
                // Late binding, a fix for the case if options.data contains a complex object leading to stack overflow when $.extend is called in the widget factory.
                var data = options && (wijmo).data.util.isClassInstance(options.data) && !((typeof wijdatasource === "function") && (options.data instanceof wijdatasource)) && options.data;
                if(data) {
                    options._lateBindingFlag = true;
                    delete options.data;
                }
                _super.prototype._createWidget.apply(this, arguments);
                if(data) {
                    delete options._lateBindingFlag;
                    options.data = data// restore option value (fixes an issue when a single options object is passed to multiple instances of the wijgrid: $("table").wijgrid({...});
                    ;
                    this.option("data", data);
                }
            };
            wijgrid.prototype._create = function () {
                var self = this;
                if(!this.element.is("table")) {
                    throw "invalid markup";
                }
                this.mCurrentCellLocker = false;
                this._windowResizeTimer = 0;
                this._dataOffset = 0;
                this._scrollingState = {
                    x: null,
                    y: null,
                    index: 0
                };
                this.rowOuterHeight = -1;
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
                this.deficientFilters = {
                };
                // ** jQuery UI 1.9.0 fix
                                var hasData = ("data" in this.options), data = hasData && this.options.data;
                if(hasData) {
                    delete this.options.data;
                }
                this.options = $.extend(true, {
                }, this.options);
                // handle juice objectValue serialize
                if($.isFunction(window["wijmoASPNetParseOptions"])) {
                    window["wijmoASPNetParseOptions"](this.options);
                }
                if(hasData) {
                    this.options.data = data;
                }
                // jQuery UI 1.9.0 fix **
                // enable touch support:
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = (window).wijmoApplyWijTouchUtilEvents($);
                }
                this._initialized = false;
                this._destroyed = false;
                // culture
                this.mClosestCulture = Globalize.findClosestCulture(this.options.culture) || Globalize.findClosestCulture("default");
                // initialize data
                this._dataViewWrapper = new wijmo.grid.dataViewWrapper(this);
                this._originalHtml = this.element.html()// store original html. Will be restored in the destroy() method.
                ;
                this._originalAttr = {
                };
                this._originalCssText = this.element[0].style.cssText;
                this.element.addClass(wijmo.grid.wijgrid.CSS.root);
                this.element.wrap("<div class=\"" + this.options.wijCSS.widget + " " + wijmo.grid.wijgrid.CSS.wijgrid + " " + this.options.wijCSS.wijgrid + " " + this.options.wijCSS.content + " " + this.options.wijCSS.cornerAll + "\"></div>")// outer div
                ;
                this.outerDiv = this.element.parent();
                var styleHeight = this.element[0].style.height, styleWidth = this.element[0].style.width;
                if(styleHeight) {
                    this.outerDiv.css("height", styleHeight);
                }
                this._autoHeight = (styleHeight == "" || styleHeight == "auto");
                if(styleWidth) {
                    this.outerDiv.css("width", this.element[0].style.width);
                }
                this._autoWidth = (styleWidth == "" || styleWidth == "auto");
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
                this._viewPortBounds({
                    start: 0,
                    end: 0
                });
                if(this._allowVirtualScrolling()) {
                    this._viewPortBounds().start = this._scrollingState.index// == 0 by default.
                    ;
                    if(this._serverSideVirtualScrolling()) {
                        this._dataOffset = this._scrollingState.index;
                    }
                }
                // set bounds *
                // wijObservable
                if(this.element.wijAddVisibilityObserver) {
                    this.element.wijAddVisibilityObserver(function (e) {
                        //if (self.element.is(":visible")) {
                        if(self._initialized && !self._destroyed && (e.target !== self.outerDiv[0])) {
                            // ignore notification triggered by baseView,
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
                    if(this._resizerui) {
                        this._resizerui.dispose();
                        this._resizerui = null;
                    }
                    if(this._frozenerui) {
                        this._frozenerui.dispose();
                        this._frozenerui = null;
                    }
                    if(this._selectionui) {
                        this._selectionui.dispose();
                        this._selectionui = null;
                    }
                    if(this._dragndropui) {
                        this._dragndropui.dispose();
                        this._dragndropui = null;
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
                    this.element.removeClass(wijmo.grid.wijgrid.CSS.root);
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
                this._prevHoveredSketchRowIndex = -1;
                // culture
                this.mClosestCulture = Globalize.findClosestCulture(this.options.culture) || Globalize.findClosestCulture("default");
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
                optionChanged = (value !== oldValue) || (key.toLowerCase() === "columns")// same reference, handle a situation when the option.columns array was modifed directly. (TFS issue #41296)
                ;
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
            /** Returns a one-dimensional array of widgets bound to visible column headers.
            * @example
            * var colWidgets = $("#element").wijgrid("columns");
            * @remarks
            * wijgrid columns are represented as widgets. This method returns a one-dimensional array of widgets that are bound to visible column headers.
            *
            * The column widget is initiated with values taken from the corresponding item in the wijgrid.options.columns array. However, the options of a column widget instance reference not the original object but a copy created by the widget factory. Due to that, changes to the wijgrid.options.columns options are not automatically propagated to the column widget options and vice versa.
            * To solve this issue, the wijgrid synchronized the column widget option values with the source items. This synchronization occurs inside the ensureControl() method which is automatically called at each action requiring the wijgrid to enter.
            *
            * Still, there is a drawback. For example, a user may want to filter wijgrid data from user code as in this sample:
            *
            *	$("#element").wijgrid("option", "columns")[0].filterValue = "newValue";
            *	$("#element").wijgrid("ensureControl", true); // make wijgrid re-shape data and re-render.
            *
            * In the sample above, nothing will happen since at synchronization user changes will be ignored.You need to change the filterValue of a column widget. This is what the columns() method is for:
            *
            *	$("#element").wijgrid("columns")[0].options.filterValue = "newValue";
            *	$("#element").wijgrid("ensureControl", true); // make wijgrid re-shape data and re-render.
            *
            * Here's the best way to change the filterValue:
            *
            *	$("#element").wijgrid("columns")[0].option("filterValue", "newValue"); // column widget handles all the needful.
            *
            * @returns {Object[]} A one-dimensional array of widgets bound to visible column headers.
            */
            function () {
                return this._field("columns") || [];
            };
            wijgrid.prototype.currentCell = /** @ignore */
            function (a, b, changeSelection) {
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
                    //currentCell = (arguments.length === 1)
                    //	? (<wijmo.grid.cellInfo>a)._clone()
                    //	: new wijmo.grid.cellInfo(<number>a, <number>b);
                    currentCell = (typeof (a) !== "number") ? (a)._clone() : new wijmo.grid.cellInfo(a, b);
                    if(!currentCell.isEqual(wijmo.grid.cellInfo.outsideValue)) {
                        if(!currentCell._isValid()) {
                            throw "invalid arguments";
                        }
                        currentCell._clip(this._getDataCellsRange(grid.dataRowsRangeMode.sketch));
                        if(currentCell.rowIndex() >= 0) {
                            var rowInfo = view._getRowInfoBySketchRowIndex(currentCell.rowIndex());
                            if(!rowInfo || !(rowInfo.type & wijmo.grid.rowType.data)) {
                                return;
                            }
                        }
                    }
                    currentCell._setGridView(this);
                    this._changeCurrentCell(null, currentCell, {
                        changeSelection: changeSelection || false,
                        setFocus: false
                    });
                    return this._field("currentCell");
                }
            };
            wijgrid.prototype.data = /** Gets an array of underlying data.
            * @example
            * var data = $("#element").wijgrid("data");
            * @returns {object[]} An array of underlying data.
            */
            function () {
                //return this._dataViewWrapper.dataView()();
                return this._dataViewWrapper.dataView().getSource();
            };
            wijgrid.prototype.dataView = /** Gets an underlying wijdataview instance.
            * @example
            * var dataView = $("#element").wijgrid("dataView");
            * @returns {wijmo.data.IDataView} An underlying wijdataview instance.
            */
            function () {
                return this._dataViewWrapper.dataView();
            };
            wijgrid.prototype.doRefresh = /** Re-renders wijgrid.
            * @example
            * $("#element").wijgrid("doRefresh");
            * @param {Object} userData Infrastructure, not intended to be used by user.
            */
            function (userData) {
                var _this = this;
                if(!$.isPlainObject(userData)) {
                    userData = {
                    };
                }
                var leaves, self = this, uid = wijmo.grid.EXPANDO, virtualRefresh = userData && userData.virtualScrollData;
                if(!this._initialized) {
                    try  {
                        this._prepareColumnOptions(this.options.columns, this.options.columnsAutogenerationMode, this._dataViewWrapper.getFieldsInfo(), true, true)// prepare static and dynamic columns
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
                    var dataSlice = grid.lazy(this._dataViewWrapper.data, this._dataViewWrapper);
                    var dataView = this._dataViewWrapper.dataView();
                    var totalsRequest = this._prepareTotalsRequest(true);
                    if(totalsRequest.length) {
                        $.each(this._field("leaves"), function (i, column) {
                            // copy totals
                            column._totalsValue = (dataSlice().totals) ? dataSlice().totals[column.dataKey] : undefined;
                        });
                    }
                    // this._setPageCount(dataSlice);
                    if(dataView.count()) {
                        // process data items
                        leaves = this._field("leaves");
                        var lazyTable = new wijmo.grid.LazySketchTable({
                            count: function () {
                                return dataView.count();
                            },
                            getRange: function (start, count, dest, offset) {
                                for(var i = 0; i < count; i++) {
                                    var index = start + i;
                                    var dataItem = dataView.item(index);
                                    dest[offset + i] = _this._buildSketchRow({
                                        values: dataItem,
                                        originalRowIndex: index
                                    }, leaves);
                                }
                            }
                        });
                        if(this._hasGrouping() || this._hasMerging()) {
                            lazyTable.ensureNotLazy();
                        }
                        this.sketchTable = lazyTable;
                    } else {
                        this.sketchTable = new wijmo.grid.SketchTable();
                        var emptyData = dataSlice().emptyData;
                        if(emptyData) {
                            // process empty data row
                            leaves = this._field("visibleLeaves");
                            $.each(emptyData, function (i, item) {
                                self.sketchTable.add(self._buildSketchRowEmptyDataItem(item, leaves, i === emptyData.length - 1));
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
                if(userData && $.isFunction(userData.beforeOnRendered)) {
                    userData.beforeOnRendered.apply(this, [
                        userData
                    ]);
                }
                var view = this._view();
                if(this.mEditSkechRowIndex >= 0 && (view._isRowRendered(this.mEditSkechRowIndex) >= 0)) {
                    var rowInfo = view._getRowInfoBySketchRowIndex(this.mEditSkechRowIndex);
                    if(rowInfo && (rowInfo.state & wijmo.grid.renderState.editing)) {
                        view._makeRowEditable(rowInfo);
                    }
                }
                this._onRendered(userData);
                if(userData && $.isFunction(userData.afterRefresh)) {
                    userData.afterRefresh.apply(this, [
                        userData
                    ]);
                }
            };
            wijgrid.prototype.beginEdit = /** Puts the current cell into edit mode, as long as the editingMode options is set to "cell".
            * @example
            * $("#element").wijgrid({}
            *		editingMode: "cell",
            *		currentCellChanged: function (e, args) {
            *			if ($(e.target).wijgrid("option", "isLoaded")) {
            *				window.setTimeout(function () {
            *					$(e.target).wijgrid("beginEdit");
            *				}, 100);
            *			}
            *		}
            * });
            * @returns {Boolean} True if the cell is successfully put into edit mode, otherwise false.
            */
            function () {
                if(!this._allowCellEditing()) {
                    throw "Can be used only if the editingMode option is set to \"cell\".";
                }
                return this._beginEditInternal(null);
            };
            wijgrid.prototype.endEdit = /** Finishes editing the current cell.
            * @example
            * // endEdit is being called from within the saveChanges function
            * function saveChanges() {
            *		$("#element").wijgrid("endEdit");
            * }
            * @returns {Boolean} True if the editing was finished successfully, othewise false.
            */
            function () {
                return this._endEditInternal(null);
            };
            wijgrid.prototype.editRow = /** Starts editing of the specified row, can only be used when the editingMode option is set to "row".
            * @example
            * $("#element").wijgrid("editRow", 0);
            * @param {Number} dataItemIndex Determines the data item to edit.
            */
            function (dataItemIndex) {
                if(this.options.editingMode !== "row") {
                    throw "Can be used only if the editingMode option is set to \"row\".";
                }
                if(this.mEditSkechRowIndex >= 0) {
                    this.cancelRowEditing()// only one row can be edited at a time.
                    ;
                }
                if(dataItemIndex >= 0) {
                    var sketchRowIndex = -1, sketchRow;
                    for(var i = 0; i < this.sketchTable.count() && sketchRowIndex < 0; i++) {
                        sketchRow = this.sketchTable.row(i);
                        if(sketchRow.isDataRow() && ((sketchRow.dataItemIndex()) === dataItemIndex)) {
                            sketchRowIndex = i;
                        }
                    }
                    if(sketchRowIndex >= 0) {
                        var view = this._view();
                        this.mEditSkechRowIndex = sketchRowIndex;
                        sketchRow.renderState |= wijmo.grid.renderState.editing;
                        if(view._isRowRendered(this.mEditSkechRowIndex) >= 0) {
                            var rowInfo = view._getRowInfoBySketchRowIndex(this.mEditSkechRowIndex, false);// get a live IRowInfo object.

                            rowInfo.state |= wijmo.grid.renderState.editing// ??
                            ;
                            view._removeBodyRow(rowInfo.sectionRowIndex, false)// delete an exisiting row
                            ;
                            rowInfo = view._insertBodyRow(sketchRow, rowInfo.sectionRowIndex, rowInfo.dataItemIndex, -1)//  create and render a new one
                            ;
                            view._makeRowEditable(rowInfo);
                            this.selection()._ensureSelectionInRow(this.mEditSkechRowIndex);
                        }
                    }
                }
            };
            wijgrid.prototype.updateRow = /** Finishes editing and updates the datasource.
            * @example
            * $("#element").wijgrid("updateRow");
            */
            function () {
                if(this.mEditSkechRowIndex >= 0) {
                    var dataView = wijmo.grid.asEditableDataView(this._dataViewWrapper.dataView()), errorOccurs = false;
                    if(!dataView) {
                        throw "The provided DataView doesn't supports the editing operation.";
                    }
                    try  {
                        var sketchRow = this.sketchTable.row(this.mEditSkechRowIndex), view = this._view();
                        if(!sketchRow || !sketchRow.isDataRow() || !(sketchRow.renderState & wijmo.grid.renderState.editing)) {
                            throw "Invalid row";
                        }
                        if(this._view()._isRowRendered(this.mEditSkechRowIndex) >= 0) {
                            var rowInfo = view._getRowInfoBySketchRowIndex(this.mEditSkechRowIndex, false);// get a live IRowInfo object.

                            // ** get the new values and update an underlying data source
                                                        var leaves = this._field("visibleLeaves"), cells = [], cellEditor = new wijmo.grid.cellEditorHelper();
                            for(var i = 0; i < leaves.length; i++) {
                                var column = leaves[i];
                                if(wijmo.grid.validDataKey(column.dataKey) && !column.readOnly) {
                                    var $cell = rowInfo.$rows.children("td, th").eq(i);
                                    if($cell.length) {
                                        var state = view._changeCellRenderState($cell, wijmo.grid.renderState.none, true);// dont change anything, just get a state.

                                        if(state & wijmo.grid.renderState.editing) {
                                            // make sure that cell is in edit state (the user did not cancel the beforeCellEdit event, for example)
                                                                                        var cellInfo = view.getAbsoluteCellInfo($cell[0], true), updateRes = cellEditor.updateCell(this, cellInfo, null);
                                            if(!(updateRes & grid.updateCellResult.success)) {
                                                errorOccurs = true;
                                                return;
                                            }
                                            if(!(updateRes & grid.updateCellResult.notEdited)) {
                                                cells.push(cellInfo);
                                            }
                                        }
                                    }
                                }
                            }
                            for(var i = 0; i < cells.length; i++) {
                                cellEditor.cellEditEnd(this, cells[i], null);
                            }
                            // collect new values and update underlying data source **
                            // ** no errors, update DOM **
                            sketchRow.renderState &= ~wijmo.grid.renderState.editing;
                            rowInfo.state &= ~wijmo.grid.renderState.editing// ??
                            ;
                            view._removeBodyRow(rowInfo.sectionRowIndex, false)// delete an exisiting row
                            ;
                            rowInfo = view._insertBodyRow(sketchRow, rowInfo.sectionRowIndex, rowInfo.dataItemIndex, -1)//  create and render a new one
                            ;
                            this.selection()._ensureSelectionInRow(this.mEditSkechRowIndex);
                        } else {
                            sketchRow.renderState &= ~wijmo.grid.renderState.editing;
                        }
                    }finally {
                        if(!errorOccurs) {
                            this.mEditSkechRowIndex = -1;
                        }
                    }
                }
            };
            wijgrid.prototype.cancelRowEditing = /** Discards changes and finishes editing of the edited row.
            * @example
            * $("#element").wijgrid("cancelRowEditing");
            */
            function () {
                if(this.mEditSkechRowIndex >= 0) {
                    try  {
                        var sketchRow = this.sketchTable.row(this.mEditSkechRowIndex), view = this._view();
                        if(!sketchRow || !sketchRow.isDataRow() || !(sketchRow.renderState & wijmo.grid.renderState.editing)) {
                            throw "Invalid row.";
                        }
                        sketchRow.renderState &= ~wijmo.grid.renderState.editing;
                        if(this._view()._isRowRendered(this.mEditSkechRowIndex) >= 0) {
                            var rowInfo = view._getRowInfoBySketchRowIndex(this.mEditSkechRowIndex, false);// get a live IRowInfo object.

                            rowInfo.state &= ~wijmo.grid.renderState.editing// ??
                            ;
                            view._removeBodyRow(rowInfo.sectionRowIndex, false)// delete an exisiting row
                            ;
                            rowInfo = view._insertBodyRow(sketchRow, rowInfo.sectionRowIndex, rowInfo.dataItemIndex, -1)//  create and render a new one
                            ;
                            this.selection()._ensureSelectionInRow(this.mEditSkechRowIndex);
                        }
                    }finally {
                        this.mEditSkechRowIndex = -1;
                    }
                }
            };
            wijgrid.prototype.deleteRow = /** Deletes the specified row.
            * @example
            * $("#element").wijgrid("cancelRowEditing");
            * @param {Number} dataItemIndex Determines the data item to edit.
            */
            function (dataItemIndex) {
                if(dataItemIndex >= 0) {
                    var dataView = wijmo.grid.asEditableDataView(this._dataViewWrapper.dataView());
                    if(!dataView || !dataView.canRemove()) {
                        throw "The provided DataView doesn't supports the deleting operation.";
                    }
                    // dataView.remove(dataItemIndex); // the whole wijgrid will be re-rendered.
                    this._dataViewWrapper.ignoreChangeEvent(true);
                    dataView.remove(dataItemIndex);
                    this._dataViewWrapper.ignoreChangeEvent(false);
                    this.ensureControl(true, {
                        forceDataLoad: // forcibly reload a dataView.
                        true
                    });
                }
            };
            wijgrid.prototype.ensureControl = /** Moves the column widget options to the wijgrid options and renders the wijgrid. Use this method when you need to re-render the wijgrid and reload remote data from the datasource.
            * @example
            * // Adds a new row to the viewModel and refreshes the wijgrid
            * var len = viewModel.data().length;
            * viewModel.data.push(new Person({ ID: len, Company: "New Company" + len, Name: "New Name" + len }));
            * $("#element").wijgrid("ensureControl", true);
            * @param {Boolean} loadData Determines if the wijgrid must load data from a linked data source before rendering.
            */
            function (loadData, userData) {
                this._loading();
                if(!$.isPlainObject(userData)) {
                    userData = {
                        data: null,
                        afterRefresh: null,
                        beforeRefresh: null
                    };
                }
                if(this._initialized) {
                    if(!userData || !userData.virtualScrollData) {
                        // performance tweak, processing the expandInfo objects is slow.
                        this._convertWidgetsToOptions();
                    }
                } else {
                    // this._prepareColumnOptions(false); // prepare static columns only (to make a proper sorting or filtering request to remote service)
                    this._prepareColumnOptions(this.options.columns, this.options.columnsAutogenerationMode, this._dataViewWrapper.isDataLoaded() && this._dataViewWrapper.getFieldsInfo(), this._dataViewWrapper.isDataLoaded(), false);
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
                if(!userData || !userData.virtualScrollData) {
                    this.mAllowVirtualScrolling = undefined;
                    this.mEditSkechRowIndex = -1;
                }
                if(loadData === true) {
                    this._dataViewWrapper.load(userData);
                } else {
                    this.doRefresh(userData);
                    this._loaded();
                }
            };
            wijgrid.prototype.getCellInfo = /** Gets an instance of the wijmo.grid.cellInfo class that represents the grid's specified cell.
            * @example
            * var cellInfo = $("#element").wijgrid("getCellInfo", domCell);
            * @param {Object} domCell A HTML DOM Table cell object
            * @returns {wijmo.grid.cellInfo} Object that represents a cell of the grid.
            */
            function (domCell) {
                var cellInfo = null;
                if(domCell && (domCell = this._findUntilOuterDiv(domCell, {
                    td: true,
                    th: true
                }))) {
                    // test affinity
                    cellInfo = this._view().getAbsoluteCellInfo(domCell, false);
                }
                return cellInfo;
            };
            wijgrid.prototype.getFilterOperatorsByDataType = /** Returns a one-dimensional array of filter operators which are applicable to the specified data type.
            * @example
            * var operators = $("#element").wijgrid("getFilterOperatorsByDataType", "string");
            * @param {String} dataType Specifies the type of data to which you apply the filter operators. Possible values are: "string", "number", "datetime", "currency" and "boolean".
            * @returns {wijmo.grid.IFilterOperator[]} A one-dimensional array of filter operators.
            */
            function (dataType) {
                return (new wijmo.grid.filterOperatorsCache(this)).getByDataType(dataType || "string");
            };
            wijgrid.prototype.pageCount = /** Gets the number of pages.
            * @example
            * var pageCount = $("#element").wijgrid("pageCount");
            * @returns {Number} The number of pages.
            */
            function () {
                if(this._customPagingEnabled()) {
                    return Math.ceil(this.options.totalRows / this.options.pageSize) || 1;
                }
                return this.options.allowPaging ? (this._dataViewWrapper.dataView()).pageCount() : 1;
            };
            wijgrid.prototype._closestCulture = function () {
                return this.mClosestCulture;
            };
            wijgrid.prototype._serverShaping = function () {
                // used to support asp.net C1GridView
                return false;
            };
            wijgrid.prototype._pageIndexForDataView = function () {
                /** Infrastructure */
                return this.options.pageIndex;
            };
            wijgrid.prototype.setSize = /** Sets the size of the grid using the width and height parameters.
            * @example
            * $("#element").wijgrid("setSize", 200, 200);
            * @param {String|Number} width Determines the width of the grid.
            * @param {String|Number} height Determines the height of the grid.
            */
            function (width, height) {
                var view = this._view(), scrollValue = null, outerDiv = this.outerDiv, visibleLeaves = this._field("visibleLeaves"), leavesWithFilter = [];
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
                this._setSizeInternal(scrollValue);
                var frozener = this._UIFrozener();
                if(frozener) {
                    frozener.refresh();
                }
            };
            wijgrid.prototype._setSizeInternal = function (scrollValue) {
                this._view().updateSplits(scrollValue);
            };
            wijgrid.prototype.selection = /** Gets an object that manages selection in the grid.
            * @example
            * // Use the row index to add the row to the selection object
            * var selection = $("#element").wijgrid("selection");
            * selection.addRows(2);
            * @remarks
            * See the description of the wijmo.grid.selection class for more details.
            * @returns {wijmo.grid.selection} Object that manages selection in the grid.
            */
            function () {
                var selection = this._field("selection");
                if(!selection) {
                    this._field("selection", selection = new wijmo.grid.selection(this));
                }
                return selection;
            };
            wijgrid.prototype._onDataViewCurrentPositionChanged = // * public
            function (e, args) {
                var cellInfo = this._currentCellFromDataView(this.currentCell().cellIndex());
                // move currentCell to the new position
                cellInfo = this.currentCell(cellInfo, null, true);
            };
            wijgrid.prototype._resetColumns = function () {
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
                this._initialized = false// to generate columns when doRefresh() or ensureControl() methods will be called
                ;
            };
            wijgrid.prototype._resetDataProperties = function () {
                this.options.pageIndex = 0;
            };
            wijgrid.prototype._resetVerticalBounds = function () {
                var bounds = this._viewPortBounds();
                //bounds.start = bounds.end = 0;
                bounds.start = 0// #52058: reset the .start property only. Let wijgrid to update the .end property when the underlying data will be refreshed actually.
                ;
                this._scrollingState.index = 0;
                this._scrollingState.y = 0;
            };
            wijgrid.prototype._onDataViewLoading = function () {
                this._activateSpinner()// if data loading proccess was triggered outside the wijgrid.
                ;
                this._trigger("dataLoading");
            };
            wijgrid.prototype._onDataViewReset = function (userData, resetColumns) {
                if(!this.options._lateBindingFlag) {
                    // ignore dataView reset during initialization (seee wijgrid._createWidget method)
                    (new wijmo.grid.settingsManager(this)).MapDVToWG();
                    this._trigger("dataLoaded");
                    if(resetColumns) {
                        this._resetColumns();
                    }
                    this.doRefresh(userData);
                    this._loaded();
                } else {
                    delete this.options._lateBindingFlag;
                }
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
                var i, len, leaf, cellAttr, value, tmp, expando = wijmo.data.Expando.getFrom(wrappedDataItem.values, false), rowAttributes = expando ? expando[wijmo.grid.EXPANDO] : null, sketchRow = new grid.SketchDataRow(wrappedDataItem.originalRowIndex, wijmo.grid.renderState.rendering, rowAttributes && rowAttributes.rowAttributes), cellAttributes = rowAttributes && rowAttributes.cellsAttributes;
                for(i = 0 , len = leaves.length; i < len; i++) {
                    leaf = leaves[i];
                    if(wijmo.grid.validDataKey(leaf.dataKey)) {
                        cellAttr = cellAttributes ? cellAttributes[leaf.dataKey] : null;
                        value = this._dataViewWrapper.getValue(wrappedDataItem.values, leaf.dataKey);
                        sketchRow.add(new grid.ValueCell(this.parse(leaf, value), cellAttr));
                    }
                }
                return sketchRow;
            };
            wijgrid.prototype._buildSketchRowEmptyDataItem = function (dataItem, leaves, isLastRow) {
                var i, len, sketchRow = new grid.SketchRow(wijmo.grid.rowType.emptyDataRow, wijmo.grid.renderState.rendering, null), leavesLen = leaves.length;
                for(i = 0 , len = dataItem.length; i < len; i++) {
                    sketchRow.add(new grid.HtmlCell(dataItem[i], {
                        colSpan: (leavesLen > 0 && isLastRow) ? leavesLen : 1
                    }));
                }
                return sketchRow;
            };
            wijgrid.prototype._prepareColumnOptions = function (columns, generationMode, fieldsInfo, dataLoaded, finalStage) {
                wijmo.grid.traverse(columns, function (column) {
                    column.isBand = ($.isArray(column.columns) || (column.clientType === "c1band"));
                    if(grid.c1commandbtnfield.test(column) || grid.c1btnfield.test(column)) {
                        column.dataKey = null;
                    }
                    column._originalDataKey = column.dataKey;
                    column._originalHeaderText = column.headerText;
                });
                // set .isLeaf
                new wijmo.grid.bandProcessor().getVisibleHeight(columns, true);
                // prepare leaves
                                var leaves = [], headerRow = this._originalHeaderRowData(), footerRow = this._originalFooterRowData(), autogenerationMode = (generationMode || "").toLowerCase(), self = this;
                if(dataLoaded) {
                    wijmo.grid.columnsGenerator.generate(autogenerationMode, fieldsInfo, columns);
                }
                wijmo.grid.setTraverseIndex(columns)// build indices (linearIdx, travIdx, parentIdx)
                ;
                // * merge options with defaults and build "pure" leaves list.
                wijmo.grid.traverse(columns, function (column) {
                    // merge options **
                    column.isBand = ($.isArray(column.columns) || (column.clientType === "c1band"));
                    wijmo.grid.shallowMerge(column, grid.c1basefield.prototype.options)// merge with the c1basefield default options
                    ;
                    if(!column.isBand) {
                        if(grid.c1commandbtnfield.test(column)) {
                            column.clientType = "c1commandbtnfield";
                            wijmo.grid.shallowMerge(column, grid.c1btnfieldbase.prototype.options);
                            wijmo.grid.shallowMerge(column, grid.c1commandbtnfield.prototype.options);
                            column.editCommand = (column.editCommand || {
                            });
                            wijmo.grid.shallowMerge(column.editCommand, grid.c1commandbtnfield.prototype.options.editCommand);
                            column.cancelCommand = (column.cancelCommand || {
                            });
                            wijmo.grid.shallowMerge(column.cancelCommand, grid.c1commandbtnfield.prototype.options.cancelCommand);
                            column.deleteCommand = (column.deleteCommand || {
                            });
                            wijmo.grid.shallowMerge(column.deleteCommand, grid.c1commandbtnfield.prototype.options.deleteCommand);
                            column.updateCommand = (column.updateCommand || {
                            });
                            wijmo.grid.shallowMerge(column.updateCommand, grid.c1commandbtnfield.prototype.options.updateCommand);
                        } else {
                            if(grid.c1btnfield.test(column)) {
                                column.clientType = "c1btnfield";
                                wijmo.grid.shallowMerge(column, grid.c1btnfieldbase.prototype.options);
                                wijmo.grid.shallowMerge(column, grid.c1btnfield.prototype.options);
                            } else {
                                wijmo.grid.shallowMerge(column, grid.c1field.prototype.options)// merge with the c1field default options
                                ;
                                column.groupInfo = column.groupInfo || {
                                };
                                wijmo.grid.shallowMerge(column.groupInfo, grid.c1field.prototype.options.groupInfo);
                                if(!column.clientType) {
                                    column.clientType = "c1field";
                                }
                            }
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
                                if(self._dataViewWrapper && self._dataViewWrapper.isBoundedToDOM() && headerRow && (thIndex < headerRow.length)) {
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
                        if(self._dataViewWrapper && self._dataViewWrapper.isBoundedToDOM() && footerRow && (thIndex < footerRow.length)) {
                            leaf._footerTextDOM = $.trim(footerRow[thIndex]);
                        }
                    }, this));
                }
            };
            wijgrid.prototype._rebuildLeaves = function () {
                var tmpColumns = [], leaves = [], tmp;
                if(this._showRowHeader()) {
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
                            leaf.dataParser = new (leaf.dataParser)();
                        }
                    }
                    if(leaf.parentVis) {
                        leaf.visLeavesIdx = visLeavesIdx++;
                        return true;
                    }
                    return false;
                }));
            };
            wijgrid.prototype._allowEditing = function () {
                return (this.options.allowEditing === true) || // obsolete
                (this.options.editingMode === "cell") || (this.options.editingMode === "row");
            };
            wijgrid.prototype._allowCellEditing = function () {
                var editingMode = this.options.editingMode;
                if(editingMode === "row") {
                    return false;
                }
                return (this.options.allowEditing === true) || // obsolete
                (editingMode === "cell");
            };
            wijgrid.prototype._allowVirtualScrolling = function () {
                if(this.mAllowVirtualScrolling === undefined) {
                    this.mAllowVirtualScrolling = !this.options.allowPaging && this.options.allowVirtualScrolling && (this.options.staticRowIndex < 0) && (this.options.scrollMode !== "none") && !this._hasMerging();
                }
                return this.mAllowVirtualScrolling;
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
            wijgrid.prototype._KeyDownEventListener = function () {
                if(!this.mKeyDownEventListener) {
                    var view = this._view(), $fe = view && view.focusableElement();
                    if($fe) {
                        this.mKeyDownEventListener = new grid.keyDownEventListener(this, $fe);
                    }
                }
                return this.mKeyDownEventListener;
            };
            wijgrid.prototype._UIDragndrop = function (force) {
                if(!this._dragndropui && force) {
                    this._dragndropui = new wijmo.grid.uiDragndrop(this);
                }
                return this._dragndropui;
            };
            wijgrid.prototype._UIFrozener = function (force) {
                if(!this._frozenerui && force) {
                    this._frozenerui = new wijmo.grid.uiFrozener(this);
                }
                return this._frozenerui;
            };
            wijgrid.prototype._UIResizer = function (force) {
                if(!this._resizerui && force) {
                    this._resizerui = new wijmo.grid.uiResizer(this);
                }
                return this._resizerui;
            };
            wijgrid.prototype._UISelection = function (force) {
                if(!this._selectionui && force) {
                    this._selectionui = new wijmo.grid.uiSelection(this);
                }
                return this._selectionui;
            };
            wijgrid.prototype._postset_allowColMoving = // * propeties (pre-\ post-)
            function (value, oldValue) {
                var self = this;
                $.each(this.columns(), function (idx, wijField) {
                    if(value) {
                        self._UIDragndrop(true).attach(wijField);
                    } else {
                        self._UIDragndrop(true).detach(wijField);
                    }
                });
                var groupedWidgets = this._field("groupedWidgets");
                if(groupedWidgets) {
                    $.each(groupedWidgets, function (idx, wijField) {
                        if(value) {
                            self._UIDragndrop(true).attach(wijField);
                        } else {
                            self._UIDragndrop(true).detach(wijField);
                        }
                    });
                }
            };
            wijgrid.prototype._postset_allowEditing = function (value, oldValue) {
                // deprecated
                this._postset_editingMode(this.options.editingMode, undefined);
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
            wijgrid.prototype._postset_freezingMode = function (value, oldValue) {
                if(this._frozenerui) {
                    this._frozenerui.refresh();
                }
            };
            wijgrid.prototype._postset_culture = function (value, oldValue) {
                this.mClosestCulture = Globalize.findClosestCulture(value) || Globalize.findClosestCulture("default");
                this.ensureControl(false);
            };
            wijgrid.prototype._postset_customFilterOperators = function (value, oldValue) {
                var dataView = this._dataViewWrapper.dataView();
            };
            wijgrid.prototype._postset_data = function (value, oldValue) {
                this._resetColumns();
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
            wijgrid.prototype._postset_editingMode = function (value, oldValue) {
                if(this.mKeyDownEventListener) {
                    this.mKeyDownEventListener.dispose();
                    this.mKeyDownEventListener = null;
                    this._KeyDownEventListener();
                }
            };
            wijgrid.prototype._postset_groupIndent = function (value, oldValue) {
                this.ensureControl(false);
            };
            wijgrid.prototype._postset_groupAreaCaption = function (value, oldValue) {
                var groupedColumns = this._groupedColumns();
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
            wijgrid.prototype._postset_rowHeight = function (value, oldValue) {
                this.rowOuterHeight = -1;
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
                    selection._selectRange(new wijmo.grid.cellInfoRange(currentCell, currentCell), false, false, wijmo.grid.cellRangeExtendMode.none, null);
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
                    var defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this.options.wijCSS, loadingText = this.outerDiv.append("<div class=\"" + defCSS.loadingOverlay + " " + wijCSS.wijgridLoadingOverlay + " " + wijCSS.overlay + "\"></div>" + "<span class=\"" + defCSS.loadingText + " " + wijCSS.wijgridLoadingText + " " + wijCSS.content + " " + wijCSS.cornerAll + "\">" + "<span class=\"" + wijCSS.icon + " " + wijCSS.iconClock + "\"></span>" + this.options.loadingText + "</span>").find("> ." + defCSS.loadingText);
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
                        var defCSS = wijmo.grid.wijgrid.CSS;
                        this.outerDiv.find("> ." + defCSS.loadingOverlay + ", > ." + defCSS.loadingText).remove();
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
                        case //columnWidget = $node[clientType](columnOpt);
                        "c1basefield":
                            columnWidget = $node.c1basefield(columnOpt);
                            break;
                        case "c1band":
                            columnWidget = $node.c1band(columnOpt);
                            break;
                        case "c1btnfield":
                            columnWidget = $node.c1btnfield(columnOpt);
                            break;
                        case "c1commandbtnfield":
                            columnWidget = $node.c1commandbtnfield(columnOpt);
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
            wijgrid.prototype._groupedColumns = function (force) {
                var result;
                force = !(result = this._field("groupedColumns")) || force;
                if(force) {
                    result = [];
                    var leaves = this._field("leaves") || [], rebuildIndexes = false, isGrouped = function (column) {
                        return column.groupInfo && column.groupInfo.position && (column.groupInfo.position !== "none");
                    };
                    $.each(leaves, function (i, column) {
                        if(isGrouped(column)) {
                            rebuildIndexes = rebuildIndexes || (column.groupedIndex === undefined);
                            if(!rebuildIndexes) {
                                result.push(column);
                            }
                        } else {
                            delete column.groupedIndex;
                        }
                    });
                    if(rebuildIndexes) {
                        $.each(leaves, function (i, column) {
                            if(isGrouped(column)) {
                                column.groupedIndex = result.length;
                                result.push(column);
                            }
                        });
                    } else {
                        result.sort(function (a, b) {
                            return a.groupedIndex - b.groupedIndex;
                        });
                        $.each(result, function (i, column) {
                            column.groupedIndex = i;
                        });
                    }
                    this._field("groupedColumns", result);
                }
                return result || [];
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
            wijgrid.prototype._ensureRenderableBounds = function (bounds) {
                return wijmo.grid.ensureBounds(bounds, this._renderableRowsCount() - 1);
            };
            wijgrid.prototype._ensureTotalRowsBounds = function (bounds) {
                return wijmo.grid.ensureBounds(bounds, this._totalRowsCount() - 1);
            };
            wijgrid.prototype._ensureViewPortBoundsVisible = function (bounds) {
                var visibleTotal = this._renderableRowsCount();
                if(bounds.end >= visibleTotal) {
                    bounds.start -= bounds.end - (visibleTotal - 1);
                    bounds.end = visibleTotal - 1;
                    bounds.start = Math.max(0, bounds.start);
                    bounds.end = Math.max(0, bounds.end);
                }
                return bounds;
            };
            wijgrid.prototype._renderableBoundsCollection = function () {
                return this.mRenderableBoundsCollection;
            };
            wijgrid.prototype._rebuildRenderBoundsCollection = function () {
                var start = -1, end = -1, rangeFound = false, total = this._totalRowsCount();
                // <- overrided by c1gridview
                                this.mRenderableBoundsCollection = new wijmo.grid.renderBoundsCollection(total - 1);
                if(this._allowVirtualScrolling() && this._serverSideVirtualScrolling()) {
                    this.mRenderableBoundsCollection.add({
                        start: 0,
                        end: total - 1
                    })// all rows, groping is disabled
                    ;
                } else {
                    if(!this._allowVirtualScrolling() || !this._hasGrouping()) {
                        // assumption: if there is no grouping, then all sketch rows are visible
                        this.mRenderableBoundsCollection.add({
                            start: 0,
                            end: total - 1
                        })// all rows
                        ;
                    } else {
                        // gets only visible rows from the sketchTable
                        for(var i = 0; i < this.sketchTable.count(); i++) {
                            var sketchItem = this.sketchTable.row(i);
                            if(sketchItem.extInfo.state & wijmo.grid.renderStateEx.hidden) {
                                if(start >= 0) {
                                    this.mRenderableBoundsCollection.add({
                                        start: start,
                                        end: end
                                    });
                                    rangeFound = false;
                                }
                                start = end = -1;
                            } else {
                                if(start < 0) {
                                    rangeFound = true;
                                    start = end = i;
                                } else {
                                    end++;
                                }
                            }
                        }
                        if(rangeFound) {
                            this.mRenderableBoundsCollection.add({
                                start: start,
                                end: end
                            });
                        }
                    }
                }
            };
            wijgrid.prototype._refresh = function (userData) {
                // apply grouping
                new wijmo.grid.grouper().group(this, this.sketchTable, this._field("leaves"));
                // apply merging
                new wijmo.grid.merger().merge(this.sketchTable, this._field("visibleLeaves"));
                this._rebuildRenderBoundsCollection();
                //this._ensureViewPortBounds(this._viewPortBounds());
                // view
                if(this.options.scrollMode !== "none") {
                    this.mView = new wijmo.grid.fixedView(this, this._viewPortBounds());
                } else {
                    this.mView = new wijmo.grid.flatView(this, this._viewPortBounds());
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
                var innerDiv = ri.$rows.find("td:first ." + wijmo.grid.wijgrid.CSS.wijgridCellContainer);
                var html = innerDiv.html();

                html = "d:" + ri.dataItemIndex + " s:" + ri.sectionRowIndex + "  ||" + ri.data[0] + "|| " + html;
                innerDiv.html(html);
                }*/
                // debug
                /*if (scrollData.data && scrollData.mode === intersectionMode.reset) {
                this._view().vsUI.scrollToRow(scrollData.newBounds.start, true); // original scrollIndex could change due pageSize alignment, so we need to re-set position of the vertical scrollbar.
                }*/
                            };
            wijgrid.prototype._updateRowInfos = function (scrollData, diffData) {
                var bounds = this._viewPortBounds(), view = this._view(), newBounds = scrollData.newBounds, rows = this._view().bodyRows(), relMatch, i, diff, rowInfo;
                switch(scrollData.mode) {
                    case grid.intersectionMode.reset:
                        break;
                    case grid.intersectionMode.overlapBottom:
                        relMatch = {
                            start: // zero-based
                            newBounds.start - bounds.start,
                            end: bounds.end - bounds.start
                        };
                        diff = newBounds.start - bounds.start;
                        for(i = relMatch.start; i <= relMatch.end; i++) {
                            rowInfo = view._getRowInfo(rows.item(i), false);
                            rowInfo.sectionRowIndex -= diff;
                            if(diffData.top !== 0) {
                                rowInfo.dataItemIndex += diffData.top;
                            }
                            view._setRowInfo(rowInfo.$rows, rowInfo);
                        }
                        break;
                    case grid.intersectionMode.overlapTop:
                        relMatch = {
                            start: // zero-based
                            bounds.start - bounds.start,
                            end: newBounds.end - bounds.start
                        };
                        diff = bounds.start - newBounds.start;
                        for(i = relMatch.start; i <= relMatch.end; i++) {
                            rowInfo = view._getRowInfo(rows.item(i), false);
                            rowInfo.sectionRowIndex += diff;
                            if(diffData.top !== 0) {
                                rowInfo.dataItemIndex += diffData.top;
                            }
                            view._setRowInfo(rowInfo.$rows, rowInfo);
                        }
                        break;
                }
            };
            wijgrid.prototype._renderVirtualIntoView = function (scrollData) {
                var bounds = this._viewPortBounds(), self = this, sketchRow, view = this._view(), match, i, sectionRowIndex;
                switch(scrollData.mode) {
                    case grid.intersectionMode.reset:
                        // remove all rows
                        view._clearBody();
                        // add new rows
                        var count = scrollData.newBounds.end - scrollData.newBounds.start + 1;
                        this._renderableBoundsCollection().forEachIndex(scrollData.newBounds.start, count, function (sketchIndex) {
                            sketchRow = self.sketchTable.row(sketchIndex - self._dataOffset);
                            view._insertBodyRow(sketchRow, -1, sketchRow.dataItemIndex(), sketchIndex);
                        });
                        view._rebuildOffsets();
                        break;
                    case grid.intersectionMode.overlapBottom:
                        match = {
                            start: scrollData.newBounds.start,
                            end: bounds.end
                        };
                        // remove rows from the top
                        for(i = 0; i < match.start - bounds.start; i++) {
                            view._removeBodyRow(0);
                        }
                        // add new rows to the bottom
                        var count = scrollData.newBounds.end - match.end;
                        this._renderableBoundsCollection().forEachIndex(match.end + 1, count, function (sketchIndex) {
                            sketchRow = self.sketchTable.row(sketchIndex - self._dataOffset);
                            view._insertBodyRow(sketchRow, -1, sketchRow.dataItemIndex(), sketchIndex);
                        });
                        break;
                    case grid.intersectionMode.overlapTop:
                        match = {
                            start: bounds.start,
                            end: scrollData.newBounds.end
                        };
                        // remove rows from the bottom
                        for(i = 0; i < bounds.end - scrollData.newBounds.end; i++) {
                            view._removeBodyRow(match.end - match.start + 1)// relative index starting from zero.
                            ;
                        }
                        // add new tows to the top
                        sectionRowIndex = 0;
                        var count = bounds.start - scrollData.newBounds.start;
                        this._renderableBoundsCollection().forEachIndex(scrollData.newBounds.start, count, function (sketchIndex) {
                            sketchRow = self.sketchTable.row(sketchIndex - self._dataOffset);
                            view._insertBodyRow(sketchRow, sectionRowIndex++, sketchRow.dataItemIndex(), sketchIndex);
                        });
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
                    case grid.intersectionMode.reset:
                        this.sketchTable.clear();
                        dvw._unsafeSplice(0, source.length);
                        this._dataOffset = scrollData.request.index;
                        // append
                        for(i = 0; i < scrollData.data.length; i++) {
                            dvw._unsafePush(dataItem = scrollData.data[i])// append rows to a dataStore
                            ;
                            this.sketchTable.add(this._buildSketchRow(dvw._wrapDataItem(dataItem, i), leaves));
                        }
                        break;
                    case grid.intersectionMode.overlapBottom:
                        // append
                        for(i = 0; i < scrollData.data.length; i++) {
                            dvw._unsafePush(dataItem = scrollData.data[i])// append rows to a dataStore
                            ;
                            this.sketchTable.add(this._buildSketchRow(dvw._wrapDataItem(dataItem, source.length - 1), leaves));
                        }
                        dataDiff.bottom = scrollData.data.length;
                        break;
                    case grid.intersectionMode.overlapTop:
                        // prepend
                        for(i = scrollData.data.length - 1; i >= 0; i--) {
                            dvw._unsafeSplice(0, 0, dataItem = scrollData.data[i]);
                            this.sketchTable.insert(0, this._buildSketchRow(dvw._wrapDataItem(dataItem, i), leaves));
                        }
                        this._dataOffset = scrollData.request.index;
                        dataDiff.top = scrollData.data.length;
                        break;
                }
                // extend underlying data *
                // * remove cached items exceeded cached bounds
                // [margin][pageSize = viewBounds][margin]
                alignedViewBounds = this._ensureTotalRowsBounds({
                    start: scrollData.newBounds.start,
                    end: scrollData.newBounds.end
                });
                cachedBounds = {
                    start: this._dataOffset,
                    end: this._dataOffset + source.length - 1
                };
                // remove items from the bottom
                exceeded = (cachedBounds.end - alignedViewBounds.end) - margin;
                if(exceeded > 0) {
                    dataDiff.bottom -= exceeded;
                    dvw._unsafeSplice(source.length - exceeded, exceeded);
                    this.sketchTable.removeLast(exceeded);
                }
                // remove items from the top
                exceeded = (alignedViewBounds.start - cachedBounds.start) - margin;
                if(exceeded > 0) {
                    dataDiff.top -= exceeded;
                    dvw._unsafeSplice(0, exceeded);
                    this.sketchTable.removeFirst(exceeded);
                    this._dataOffset += exceeded;
                }
                // remove data exceeded cached bounds *
                // * update metadata
                this.sketchTable.updateIndexes();
                // update metadata *
                dvw._refreshSilent();
                return dataDiff;
            };
            wijgrid.prototype._needToCreatePagerItem = function () {
                return this.options.allowPaging === true;
            };
            wijgrid.prototype._isMobileEnv = function () {
                return this._isMobile;
            };
            wijgrid.prototype._isTouchEnv = function () {
                return !!($.support.isTouchEnabled && $.support.isTouchEnabled());
            };
            wijgrid.prototype._render = function () {
                var view = this._view(), o = this.options, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this.options.wijCSS, content;
                view.render();
                // YK: for fixing pager is not align to top and bottom when header is fixed.
                content = this.outerDiv;
                if(o.scrollMode !== "none") {
                    // fixed header content
                    content = this.outerDiv.find("div." + defCSS.scroller + ":first");
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
                        this.$superPanelHeader.prepend(this.$topPagerDiv = $("<div class=\"" + defCSS.headerArea + " " + wijCSS.wijgridHeaderArea + " " + wijCSS.header + " " + wijCSS.cornerTop + "\"></div>"));
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
                        content.append(this.$bottomPagerDiv = $("<div class=\"" + defCSS.footerArea + " " + wijCSS.wijgridFooterArea + " wijmo-wijsuperpanel-footer " + wijCSS.stateDefault + " " + wijCSS.cornerBottom + "\"></div>"));
                    }
                }
                // bottom pager **
                            };
            wijgrid.prototype._processGroupArea = function (content) {
                var self = this, groupCollection = this._groupedColumns(), groupWidgetCollection = [], defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this.options.wijCSS;
                this.$groupArea = $("<div class=\"" + wijCSS.content + " " + wijCSS.helperClearFix + " " + defCSS.groupArea + " " + wijCSS.wijgridGroupArea + "\"></div>");
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
                                dataKey: item.dataKey,
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
                    this.$groupArea.addClass(defCSS.groupAreaEmpty).css("padding", 0).html(// disable padding (inherited)
                    this.options.groupAreaCaption || "&nbsp;");
                }
                this._field("groupedWidgets", groupWidgetCollection);
                if(!this.$superPanelHeader) {
                    content.prepend(this.$superPanelHeader = $("<div class=\"wijmo-wijsuperpanel-header\"></div>"));
                }
                this.$superPanelHeader.prepend(this.$groupArea);
                this._UIDragndrop(true).attachGroupArea(this.$groupArea);
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
            wijgrid.prototype._showRowHeader = function () {
                return (this.options.showRowHeader === true) && (this.options.staticColumnsAlignment !== "right");
            };
            wijgrid.prototype._attachEvents = function () {
                var view = this._view(), $fe = view.focusableElement(), self = this;
                $fe.bind("keydown." + this.widgetName, $.proxy(this._onKeyDown, this));
                $fe.bind("focusin." + this.widgetName, $.proxy(this._onFocusIn, this));
                this._KeyDownEventListener();
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
                    $fe.unbind("." + this.widgetName);
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
                        value = this.parse(column.options, rawValue);
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
                            this._resetVerticalBounds();
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
                        this.ensureControl(true, {
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
                var self = this;
                this.ensureControl(this._serverSideVirtualScrolling(), {
                    virtualScrollData: {
                        newBounds: newBounds,
                        request: request,
                        mode: mode,
                        data: data
                    },
                    beforeOnRendered: function (userData) {
                        var bounds = self._viewPortBounds();
                        $.extend(bounds, userData.virtualScrollData.newBounds);
                    },
                    afterRefresh: function (userData) {
                        (self._view())._adjustRowsHeights();
                        if(completeCallback) {
                            completeCallback(scrollIndex);
                        }
                    }
                });
            };
            wijgrid.prototype._handleVirtualScrolling = function (scrollIndex, forceIntersectionMode, completeCallback) {
                if (typeof forceIntersectionMode === "undefined") { forceIntersectionMode = null; }
                var view = this._view(), bounds = this._viewPortBounds(), newBounds = this._ensureRenderableBounds({
                    start: scrollIndex,
                    end: scrollIndex + view.getVirtualPageSize() - 1
                }), cachedDataBounds = this._ensureTotalRowsBounds({
                    start: this._dataOffset,
                    end: this._dataOffset + this._dataViewWrapper.dataView().count() - 1
                }), request = null, mode, virtualPageSize = (this._view()).getVirtualPageSize();
                // check viewBounds
                if(forceIntersectionMode) {
                    mode = forceIntersectionMode;
                } else {
                    if(newBounds.start > bounds.end || newBounds.end < bounds.start) {
                        // mode = "reset"
                        mode = grid.intersectionMode.reset;
                    } else {
                        if(newBounds.start > bounds.start) {
                            mode = grid.intersectionMode.overlapBottom;
                        } else {
                            if(newBounds.start < bounds.start) {
                                mode = grid.intersectionMode.overlapTop;
                            } else {
                                mode = newBounds.start !== bounds.start || newBounds.end !== bounds.end ? grid.intersectionMode.reset : // TODO: enhance handling the case when new range is included in the old one.
                                grid.intersectionMode.none// same range, "none"
                                ;
                            }
                        }
                    }
                }
                // quick fix
                //mode = intersectionMode.reset;
                //
                // check dataBounds
                if(this._serverSideVirtualScrolling()) {
                    switch(mode) {
                        case grid.intersectionMode.reset:
                            // align view bounds by pageSize
                            request = {
                                index: scrollIndex,
                                maxCount: // (scrollIndex == newBounds.start)
                                virtualPageSize
                            };
                            break;
                        case grid.intersectionMode.overlapBottom:
                            if(newBounds.end > cachedDataBounds.end) {
                                request = {
                                    index: cachedDataBounds.end + 1,
                                    maxCount: virtualPageSize
                                };
                            }
                            break;
                        case grid.intersectionMode.overlapTop:
                            if(newBounds.start < cachedDataBounds.start) {
                                request = {
                                    index: Math.max(0, cachedDataBounds.start - virtualPageSize),
                                    maxCount: 0
                                };
                                request.maxCount = cachedDataBounds.start - request.index;
                            }
                            break;
                    }
                }
                if(mode !== grid.intersectionMode.none) {
                    this._onVirtualScrolling(newBounds, request, mode, scrollIndex, completeCallback)// note: scrollIndex could be changed
                    ;
                }
            };
            wijgrid.prototype._serverSideVirtualScrolling = function () {
                return false;
            };
            wijgrid.prototype._serverSideVirtualScrollingMargin = function () {
                var margin = (this._view()).getVirtualPageSize() * 2;
                if(margin < 20) {
                    margin = 20;
                }
                return margin;
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
            wijgrid.prototype._onCurrentCellChanged = function (e, info) {
                var _this = this;
                var o = this.options, currentCell = this.currentCell(), rowInfo = currentCell.row(), completed = // can be null
                function () {
                    var currentCell = _this.currentCell(), dataRange = _this._getDataCellsRange(grid.dataRowsRangeMode.sketch);
                    if(_this.options.highlightCurrentCell) {
                        var oldCell = new wijmo.grid.cellInfo(info.changingEventArgs.oldCellIndex, info.changingEventArgs.oldRowIndex, _this);
                        if(oldCell._isValid && dataRange._containsCellInfo(oldCell)) {
                            _this._highlightCellPosition(oldCell, false)// remove the old one
                            ;
                        }
                        _this._highlightCellPosition(currentCell, true)// highlight the current one
                        ;
                    }
                    var domCell;
                    if(info.setFocus && (domCell = currentCell.tableCell())) {
                        _this._setFocusOnCell(info.hasFocusedChild ? $(e.target) : $(domCell), info.hasFocusedChild, currentCell.column());
                    }
                    _this._trigger("currentCellChanged");
                    var eventType = (e && (e.type || "").toLowerCase()) || "";
                    // ** set selection
                    if(info.changeSelection) {
                        var selection = _this.selection(), selectionMode = _this.options.selectionMode.toLowerCase(), extendMode = info.selectionExtendMode || wijmo.grid.cellRangeExtendMode.none;
                        selection.beginUpdate();
                        if(eventType) {
                            if(currentCell._isValid()) {
                                switch(eventType) {
                                    case "focusin":
                                    case "click":
                                        if(!e.shiftKey || (!selection._multipleRangesAllowed() && selectionMode !== "singlerange")) {
                                            selection._startNewTransaction(currentCell);
                                        }
                                        if(e.shiftKey && e.ctrlKey) {
                                            selection._clearRange(new wijmo.grid.cellInfoRange(currentCell, currentCell), extendMode);
                                        } else {
                                            selection._selectRange(new wijmo.grid.cellInfoRange(selection._anchorCell(), currentCell), e.ctrlKey, e.shiftKey, extendMode, null);
                                        }
                                        break;
                                    case "keydown":
                                        if(!e.shiftKey || (!selection._multipleRangesAllowed() && selectionMode !== "singlerange")) {
                                            selection._startNewTransaction(currentCell);
                                        }
                                        selection._selectRange(new wijmo.grid.cellInfoRange(selection._anchorCell(), currentCell), false, e.shiftKey, wijmo.grid.cellRangeExtendMode.none, null);
                                        break;
                                }
                            }
                        } else {
                            // * move selection to the current position *
                            selection.clear();
                            if(currentCell._isValid()) {
                                // attach selection to the current cell
                                selection._startNewTransaction(currentCell);
                                selection._selectRange(new wijmo.grid.cellInfoRange(currentCell, currentCell), false, false, wijmo.grid.cellRangeExtendMode.none, null);
                            }
                        }
                        selection.endUpdate();
                    }
                    // set selection **
                    // cell editing
                    if(eventType === "click" && _this._editBySingleClick()) {
                        _this._beginEditInternal(e);
                    }
                };
                this.mCurrentCellLocker = true;
                // notify dataView
                this._dataViewWrapper.currentPosition((rowInfo && (rowInfo.type & wijmo.grid.rowType.data)) ? rowInfo.dataItemIndex : -1);
                if(o.scrollMode !== "none" && currentCell && !currentCell.isEqual(wijmo.grid.cellInfo.outsideValue)) {
                    var scrollToCell = currentCell, rowInfo = scrollToCell.row();
                    if(rowInfo && !(rowInfo.type & wijmo.grid.rowType.data) && !scrollToCell.tableCell()) {
                        // test for groupFoooter\ groupHeader
                        scrollToCell = currentCell._clone();
                        scrollToCell.cellIndex(0);
                    }
                    (this._view()).scrollTo(scrollToCell, function () {
                        try  {
                            completed();
                        }finally {
                            _this.mCurrentCellLocker = false;
                        }
                    }, info);
                } else {
                    try  {
                        completed();
                    }finally {
                        this.mCurrentCellLocker = false;
                    }
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
                    //this.selection().clear(); // clear selection
                    //if (this.options.highlightCurrentCell) {
                    //	this._highlightCellPosition(this.currentCell(), false); // remove highlighning
                    //}
                                    } else {
                    var currentCell = this._field("currentCell");
                    this._field("currentCellPrevCycle", currentCell ? {
                        x: currentCell.cellIndex(),
                        y: currentCell.rowIndex(),
                        dataItemIndex: currentCell.row() ? currentCell.row().dataItemIndex : -1
                    } : {
                        x: -1,
                        y: -1,
                        dataItemIndex: -1
                    });
                    this._field("currentCell", null);
                    if(view) {
                        view.dispose();
                    }
                    this._detachEvents(false);
                    this.element.detach();
                    this.element.css({
                        "table-layout": // Chrome issue
                        "",
                        "width": ""
                    });
                    this.element.empty();
                    this.outerDiv.empty();
                    this.outerDiv.append(this.element);
                    if(this._selectionui) {
                        this._selectionui.dispose();
                        this._selectionui = null;
                    }
                    if(this._resizerui) {
                        this._resizerui.dispose();
                        this._resizerui = null;
                    }
                    if(this._frozenerui) {
                        this._frozenerui.dispose();
                        this._frozenerui = null;
                    }
                    if(this.mKeyDownEventListener) {
                        this.mKeyDownEventListener.dispose();
                        this.mKeyDownEventListener = null;
                    }
                }
                this._trigger("rendering");
            };
            wijgrid.prototype._onRendered = function (userData) {
                var view = this._view(), currentCell, hasSelection = this.selection().selectedCells().length() > 0;
                this._rendered = true;
                this._renderCounter++;
                if(!userData.virtualScrollData) {
                    this._field("selection", null)// always recreate selection object
                    ;
                    // attach events
                    this._attachEvents();
                    // ** current cell
                    this._setAttr(view.focusableElement(), "tabIndex", 0)// to handle keyboard\ focus events
                    ;
                    var prevCurrentCell = this._field("currentCellPrevCycle");
                    //if (this._dataViewWrapper.isOwnDataView() && (prevCurrentCell.dataItemIndex >= 0)) { // if own dataView is used then restore dataView.currentPosition() from previous currentCell position.
                    //	var cnt = this._dataViewWrapper.dataView().count();
                    //	if (prevCurrentCell.dataItemIndex >= cnt) {
                    //		prevCurrentCell.dataItemIndex = cnt - 1;
                    //	}
                    //	this._dataViewWrapper.currentPosition(prevCurrentCell.dataItemIndex);
                    //}
                    currentCell = this._currentCellFromDataView(prevCurrentCell.x);
                    if(!currentCell._isValid() && this.options.showSelectionOnRender) {
                        currentCell = this._getFirstDataRowCell(0);
                    }
                    this.currentCell(currentCell, null, true);
                    // current cell *
                    // selection ui
                    this._UISelection(true);
                    // initialize resizer
                    var resizer = new wijmo.grid.uiResizer(this);
                    $.each(this.columns(), function (index, colWidget) {
                        var o = colWidget.options;
                        if(o.visible && o.parentVis && o.isLeaf) {
                            resizer.addElement(colWidget);
                        }
                    });
                    this._resizerui = resizer;
                    this._setSizeInternal(this._scrollingState)// set sizes, create wijsuperpanel, restore scrolling state.
                    ;
                    //frozener
                    if(this.options.scrollMode !== "none") {
                        this._frozenerui = new wijmo.grid.uiFrozener(this);
                    }
                } else {
                    var currentCell = this.currentCell();
                    this.currentCell(currentCell, null, false);
                    if(currentCell._isEdit() && !currentCell.row()) {
                        currentCell._isEdit(false)// reset editing if sketchRow is not available (C1GridView virtual scrolling)
                        ;
                    }
                    this.selection()._ensureSelection();
                }
                this._trigger("rendered");
            };
            wijgrid.prototype._onClick = // note: can be called by the _onFocusIn method!
            function (e) {
                if(!this._canInteract() || !e.target) {
                    return;
                }
                var view = this._view(), clickedCell = this._findUntilOuterDiv(e.target, {
                    td: true,
                    th: true
                }), $row, clickedCellInfo, extendMode = wijmo.grid.cellRangeExtendMode.none, currentCell, selection, clickedCellChanged = false, clickEvent = !!(e && (e.type === "click"));
                // real click event?
                                if(clickedCell) {
                    if(clickEvent && $(e.target).hasClass(wijmo.grid.wijgrid.CSS.groupToggleVisibilityButton)) {
                        this._onGroupBtnClick(e);
                        // #29676: stop event from bubbling up to the parent grid (if available)
                        e.stopPropagation();
                        return false;
                    }
                    $row = $(clickedCell).closest("tr");
                    if(!$row.length) {
                        return;
                    }
                    clickedCellInfo = view.getAbsoluteCellInfo(clickedCell, false);
                    if($row.hasClass(wijmo.grid.wijgrid.CSS.dataRow) || $row.hasClass(wijmo.grid.wijgrid.CSS.headerRow)) {
                        if(clickedCellInfo.cellIndex() < 0 || clickedCellInfo.rowIndex() < 0) {
                            // header cell, rowheader cell or filter cell
                            if(clickedCellInfo.rowIndex() >= 0) {
                                // rowheader cell
                                // move current cell to the first cell of the clicked row
                                clickedCellInfo = new wijmo.grid.cellInfo(0, clickedCellInfo.rowIndex());
                                extendMode = wijmo.grid.cellRangeExtendMode.row;
                                clickedCellChanged = true;
                            } else {
                                // header cell
                                if(clickedCellInfo.cellIndex() >= 0) {
                                    // move current cell to the first data cell of the clicked column
                                    clickedCellInfo = this._getFirstDataRowCell(clickedCellInfo.cellIndex());
                                    extendMode = wijmo.grid.cellRangeExtendMode.column;
                                    clickedCellChanged = true;
                                }
                            }
                        }
                        if(!clickedCellChanged) {
                            clickedCellInfo = view.getAbsoluteCellInfo(clickedCell, true);
                        }
                        // change current cell and set focus to it (if the target element is not already focused)
                        this._changeCurrentCell(e, clickedCellInfo, {
                            changeSelection: true,
                            setFocus: clickEvent,
                            selectionExtendMode: extendMode
                        });
                    }
                    if(clickEvent) {
                        var cellClickedArgs = {
                            cell: clickedCellInfo
                        };
                        this._trigger("cellClicked", null, cellClickedArgs);
                    }
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
                var $row = $(e.target).closest("tr"), gh = wijmo.grid.groupHelper, groupInfo = gh.getGroupInfo($row[0]), column, group, self = this;
                if(groupInfo) {
                    column = gh.getColumnByGroupLevel(this._field("leaves"), groupInfo.level);
                    if(column) {
                        group = column.groupInfo.expandInfo[groupInfo.index];
                        if(group.isExpanded) {
                            group.collapse();
                        } else {
                            group.expand(e.shiftKey);
                        }
                        if(this._allowVirtualScrolling()) {
                            this._rebuildRenderBoundsCollection();
                            (this._view()).vsUI._changeVisibleRowsCount(this._renderableBoundsCollection().capacity());
                            this._ensureViewPortBoundsVisible(this._viewPortBounds());
                            this._handleVirtualScrolling(this._viewPortBounds().start, grid.intersectionMode.reset);
                        }
                        //this._view().ensureHeight(); /*dma*/
                        this.setSize()// recalculate sizes (#39295)
                        ;
                    }
                }
            };
            wijgrid.prototype._onKeyDown = function (e) {
                var isKeyDownListenerElement = this._KeyDownEventListener().isHiddenInput($(e.target));
                if(!this._canInteract() || (isKeyDownListenerElement && this._KeyDownEventListener().canHandle(e))) {
                    // the focus is inside the hidden input and the printable key has been pressed.
                    return true;
                }
                var tag = (e.target).tagName.toLowerCase(), $target = $(e.target), currentCell = this.currentCell(), keyCodeEnum = wijmo.getKeyCodeEnum();
                if(!isKeyDownListenerElement && // && $target.is(":focusable") // "unsupported pseudo: focusable" exception in IE10?
                (tag === "input" || tag === "option" || tag === "select" || tag === "textarea") && ($target.closest("tr.wijmo-wijgrid-datarow").length === 0)) {
                    return true;
                }
                if(this._allowCellEditing()) {
                    // ESC: cancel editing, F2: finish editing
                    if((e.which === keyCodeEnum.ESCAPE || e.which === 113) && (currentCell._isValid() && currentCell._isEdit())) {
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
                if(!this.options.allowKeyboardNavigation) {
                    return true;
                }
                var nextCell;
                switch(e.which) {
                    case keyCodeEnum.DOWN:
                    case keyCodeEnum.PAGE_DOWN:
                    case keyCodeEnum.UP:
                    case keyCodeEnum.PAGE_UP:
                    case keyCodeEnum.LEFT:
                    case keyCodeEnum.RIGHT:
                    case keyCodeEnum.HOME:
                    case keyCodeEnum.END:
                    case keyCodeEnum.TAB:
                        if(e.which === keyCodeEnum.TAB) {
                            var visibleLeaves = this._field("visibleLeaves");
                            // There is no data in the grid, will bubble the keydown event out of the grid.
                            if(!visibleLeaves || !visibleLeaves.length) {
                                return true;
                            }
                        }
                        if(isKeyDownListenerElement || this._canMoveToAnotherCell(e.target, e.which)) {
                            var dataRange = this._getDataCellsRange(grid.dataRowsRangeMode.renderable);
                            nextCell = this._getNextCurrentCell(dataRange, currentCell, e.keyCode, e.shiftKey);
                        }
                        break;
                }
                if(nextCell) {
                    // change current cell and set focus to it (always set focus to change the IME mode).
                    this._changeCurrentCell(e, nextCell, {
                        changeSelection: true,
                        setFocus: true
                    });
                    return false;// stop bubbling

                }
                return true;
            };
            wijgrid.prototype._onFocusIn = function (e) {
                if(this.options.allowKeyboardNavigation && e && e.target && $(e.target).is(":input") && // optimization, test for inputs only
                !this._KeyDownEventListener().isHiddenInput($(e.target))) {
                    // optimization, ignore IME hidden inputs
                    this._onClick(e)// simulate a click
                    ;
                }
            };
            wijgrid.prototype._onMouseMove = function (e) {
                var view = this._view(), frozener = this._frozenerui, hoveredCell, $hoveredRow, hoveredCellInfo, rowObj, rowInfo, $rs = wijmo.grid.renderState;
                if(!this.options.highlightOnHover || !this._canInteract() || (frozener && frozener.inProgress())) {
                    return;
                }
                hoveredCell = this._findUntilOuterDiv(e.target, {
                    td: true,
                    th: true
                });
                if(hoveredCell) {
                    $hoveredRow = $(hoveredCell).closest("tr");
                    if(!$hoveredRow.length || !($hoveredRow.hasClass(wijmo.grid.wijgrid.CSS.dataRow) || $hoveredRow.hasClass(wijmo.grid.wijgrid.CSS.headerRow))) {
                        return;
                    }
                    hoveredCellInfo = view.getAbsoluteCellInfo(hoveredCell, true);
                    var hoveredSketchIndex = hoveredCellInfo.rowIndex();
                    if(hoveredSketchIndex !== this._prevHoveredSketchRowIndex) {
                        // clear previous row
                        if(this._prevHoveredSketchRowIndex !== undefined && (view._isRowRendered(this._prevHoveredSketchRowIndex) >= 0)) {
                            rowInfo = view._getRowInfoBySketchRowIndex(this._prevHoveredSketchRowIndex);
                            if(rowInfo) {
                                view._changeRowRenderState(rowInfo, $rs.hovered, false);
                                this.rowStyleFormatter.format(rowInfo);
                            }
                        }
                        // highlight current row
                        this._prevHoveredSketchRowIndex = hoveredSketchIndex;
                        if(hoveredSketchIndex >= 0) {
                            rowInfo = view._getRowInfoBySketchRowIndex(hoveredSketchIndex);
                            if(rowInfo) {
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
                var firstParentRow = this._findUntilOuterDiv(e.relatedTarget, {
                    tr: true
                });
                if(!firstParentRow || !$(firstParentRow).hasClass(wijmo.grid.wijgrid.CSS.dataRow)) {
                    // remove hovering
                                        var hovRowIndex = this._prevHoveredSketchRowIndex, view = this._view();
                    if(hovRowIndex >= 0) {
                        var rowInfo = view._getRowInfoBySketchRowIndex(hovRowIndex);
                        if(rowInfo && rowInfo.$rows) {
                            view._changeRowRenderState(rowInfo, wijmo.grid.renderState.hovered, false);
                            this.rowStyleFormatter.format(rowInfo);
                        }
                        this._prevHoveredSketchRowIndex = -1;
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
            wijgrid.prototype._setFocusOnCell = // * resizing
            function (element, focusableChild, column) {
                if(focusableChild) {
                    //if (!element.is(":focus")) {
                    //	element.focus(); // ensure that element still has focus.
                    //}
                                    } else {
                    this._KeyDownEventListener().focus(element, column);
                }
            };
            wijgrid.prototype._findFocusedChild = function (parent) {
                var result = parent.find(":focus");
                return result.length ? result : null;
            };
            wijgrid.prototype._changeCurrentCell = // * currentCell
            // returns false when currentCellChanging event was cancelled, otherwise true.
            function (e, cellInfo, info) {
                if(this.mCurrentCellLocker === true) {
                    // skip until the _onCurrentCellChanged will not be completed.
                    return;
                }
                var currentCell = this.currentCell(), dataRange = this._getDataCellsRange(grid.dataRowsRangeMode.sketch);
                // if cellInfo has a valid value
                if((dataRange._isValid() && dataRange._containsCellInfo(cellInfo)) || (cellInfo.isEqual(wijmo.grid.cellInfo.outsideValue))) {
                    var $target = e && e.target && $(e.target), domCell = cellInfo.tableCell(), $container = cellInfo.container(), $focusedChild = null;
                    info.hasFocusedChild = !!(domCell && $target && ($target[0] !== domCell) && ($target[0] !== $container[0]) && !this._KeyDownEventListener().isHiddenInput($target) && /* $target.is(":focus") */ ($focusedChild = this._findFocusedChild($container)))// $focusedChild can differs from $target (#56472)
                    ;
                    // other cell than current cell
                    if(currentCell.cellIndex() !== cellInfo.cellIndex() || currentCell.rowIndex() !== cellInfo.rowIndex()) {
                        var currentCellChangingArgs = {
                            cellIndex: cellInfo.cellIndex(),
                            rowIndex: cellInfo.rowIndex(),
                            oldCellIndex: currentCell.cellIndex(),
                            oldRowIndex: currentCell.rowIndex()
                        };
                        if(this._trigger("currentCellChanging", null, currentCellChangingArgs)) {
                            var cellEditCompleted = false;
                            if(!this._allowCellEditing() || !currentCell._isEdit() || (cellEditCompleted = this._endEditInternal(null))) {
                                info.changingEventArgs = currentCellChangingArgs;
                                currentCell = cellInfo._clone();
                                currentCell._setGridView(this);
                                this._field("currentCell", currentCell)// set currentCell
                                ;
                                this._onCurrentCellChanged(e, info);
                            }
                        } else {
                            return false;
                        }
                    } else {
                        // the same cell
                        if(this.options.highlightCurrentCell) {
                            this._highlightCellPosition(currentCell, true)// ensure
                            ;
                        }
                        if(domCell && !currentCell._isEdit()) {
                            if(e && this._editBySingleClick()) {
                                this._beginEditInternal(e);
                            } else {
                                if(info.setFocus) {
                                    this._setFocusOnCell(info.hasFocusedChild ? $focusedChild : $(domCell), info.hasFocusedChild, currentCell.column());
                                }
                            }
                        }
                    }
                } else {
                    // cellInfo is invalid
                    // do nothing
                    // this._highlightCellPosition(currentCell, false);
                    // this._field("currentCell", currentCell.outsideValue); // set currentCell
                                    }
                return true;
            };
            wijgrid.prototype._highlightCellPosition = function (cellInfo, add) {
                if(cellInfo && cellInfo._isValid()) {
                    var x = cellInfo.cellIndexAbs(), y = cellInfo.rowIndexAbs(), $rs = wijmo.grid.renderState, view = this._view(), rowInfo, obj, state;
                    // * column header cell * - change even if the cell is not rendered.
                    obj = view.getHeaderCell(x);
                    if(obj) {
                        rowInfo = view._getRowInfo(this._headerRows().item(cellInfo.column().thY));
                        obj = $(obj);
                        state = view._changeCellRenderState(obj, $rs.current, add);
                        // highlight column header cell
                        this.cellStyleFormatter.format(obj, x, cellInfo.column(), rowInfo, state);
                    }
                    if(cellInfo._isRendered()) {
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
                }
            };
            wijgrid.prototype._beginEditInternal = // * currentCell
            // * editing
            function (e) {
                if(this._canInteract() && this._allowCellEditing()) {
                    var cell = this.currentCell(), column = cell.column(), res;
                    if(column && !column.readOnly) {
                        res = new wijmo.grid.cellEditorHelper().cellEditStart(this, cell, e);
                        if(res) {
                            // this._view().ensureWidth(undefined, column.visLeavesIdx);
                                                    }
                        return res;
                    }
                }
                return false;
            };
            wijgrid.prototype._endEditInternal = function (e) {
                if(this._canInteract() && this._allowCellEditing()) {
                    var cell = this.currentCell(), cellEditor = new wijmo.grid.cellEditorHelper(), updateRes = cellEditor.updateCell(this, cell, e);
                    if(updateRes & grid.updateCellResult.success) {
                        if(updateRes & grid.updateCellResult.notEdited) {
                            return true;
                        }
                        cellEditor.cellEditEnd(this, cell, e);
                        cell = this.currentCell();
                        // set focus to listen keypress\ keydown event.
                        var domCell = cell.tableCell();
                        if(domCell) {
                            this._KeyDownEventListener().focus($(domCell), cell.column());
                        } else {
                            $(this._view().focusableElement()).focus();
                        }
                        if(!this._allowVirtualScrolling()) {
                            // avoid horizontal scrollbar movement.
                            this._view().ensureHeight(cell.rowIndex());
                        }
                        return true;
                    }
                }
                return false;
            };
            wijgrid.prototype._onViewInsertEmptyRow = // * editing
            // * view handlers
            function (rowType, renderState, sectionRowIndex, dataRowIndex, dataItemIndex, virtualDataItemIndex, groupByValue) {
                return null;// default action

            };
            wijgrid.prototype._onViewCreateEmptyCell = function (rowInfo, dataCellIndex, column) {
                return null;// default action

            };
            wijgrid.prototype._onViewCellRendered = function (rowInfo, $cell, cellIndex, column) {
            };
            wijgrid.prototype._onViewRowRendered = function (rowInfo, rowAttr, rowStyle) {
            };
            wijgrid.prototype._getDataParser = // view handlers *
            // misc
            function (column) {
                return column.dataParser || wijmo.data.defaultParsers[column.dataType] || wijmo.data.defaultParsers.string;
            };
            wijgrid.prototype.parse = /** @ignore */
            function (column, value) {
                //// old behaviour
                //var parser = this._getDataParser(column);
                //return parser.parse(value, this._field("closestCulture"), column.dataFormatString, this.options.nullString, true);
                                var fromType = wijmo.grid.getDataType(column), toType = wijmo.grid.getDataType(column);
                if($.isFunction(value)) {
                    value = value()// observable
                    ;
                }
                value = wijmo.data.convert(value, fromType, toType, {
                    culture: this.mClosestCulture,
                    format: column.dataFormatString || column._underlyingDataFormatString,
                    nullString: this.options.nullString,
                    parser: column.dataParser
                });
                // custom parser
                return value;
            };
            wijgrid.prototype.toStr = /** @ignore */
            function (column, value) {
                //// old behaviour
                //var parser = this._getDataParser(column);
                //return parser.toStr(value, this._field("closestCulture"), column.dataFormatString, this.options.nullString, true);
                                var dataView = this._dataViewWrapper.dataView(), fromType = wijmo.grid.getDataType(column), toType = // column._underlyingDataType || "string",
                "string";
                value = wijmo.data.convert(value, fromType, toType, {
                    culture: this.mClosestCulture,
                    format: column.dataFormatString || column._underlyingDataFormatString,
                    nullString: this.options.nullString,
                    parser: column.dataParser
                });
                // custom parser
                return value;
            };
            wijgrid.prototype.parseFailed = /** @ignore */
            function (column, value, dataItem, cell) {
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
                        if($(domElement).hasClass(wijmo.grid.wijgrid.CSS.inputMarker)) {
                            var input = domElement;
                            if(input.type === "text") {
                                len = input.value.length;
                                selectionRange = new wijmo.grid.domSelection(input).getSelection();
                                kc = wijmo.getKeyCodeEnum();
                                res = ((keyCode === kc.TAB) || (keyCode === kc.UP || keyCode === kc.DOWN || keyCode === kc.PAGE_DOWN || keyCode === kc.PAGE_UP) || (selectionRange.length === 0 && ((selectionRange.start === 0 && (keyCode === kc.LEFT || keyCode === kc.HOME)) || (selectionRange.end >= len && (keyCode === kc.RIGHT || keyCode === kc.END)))));
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
                        value = this._isMobileEnv() ? "click" : "doubleclick";
                        break;
                }
                return value === "click";
            };
            wijgrid.prototype._getDataToAbsOffset = function () {
                var x = 0, y = 0, headerRows = this._headerRows();
                if(this._showRowHeader()) {
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
            wijgrid.prototype._currentCellFromDataView = function (cellIndex) {
                var dataViewRowIndex = this._dataViewWrapper.currentPosition(), cellInfo = new wijmo.grid.cellInfo(cellIndex, this._dataViewDataRowIndexToGrid(dataViewRowIndex), null);
                // normalize
                if(cellInfo.rowIndex() < 0) {
                    cellInfo.cellIndex(-1);
                } else {
                    if(cellInfo.cellIndex() < 0) {
                        cellInfo.cellIndex(0);
                    }
                }
                return cellInfo;
            };
            wijgrid.prototype._dataViewDataRowIndexToGrid = function (rowIndex) {
                if(this.sketchTable) {
                    for(var i = 0; i < this.sketchTable.count(); i++) {
                        var sketchRow = this.sketchTable.row(i);
                        if(sketchRow.isDataRow() && sketchRow.dataItemIndex() === rowIndex) {
                            return i;
                        }
                    }
                }
                return -1;
            };
            wijgrid.prototype._getDataCellsRange = function (mode, lastRowEntirelyVisible) {
                if (typeof lastRowEntirelyVisible === "undefined") { lastRowEntirelyVisible = false; }
                var minCol = 0, minRow = 0, maxCol = this._field("visibleLeaves").length - 1, maxRow;
                switch(mode) {
                    case grid.dataRowsRangeMode.rendered:
                        if(this._rendered) {
                            maxRow = this._rows().length() - 1;
                            break;
                        }
                        // otherwise fallthrough to the .sketch
                                            case grid.dataRowsRangeMode.sketch:
                        maxRow = this._totalRowsCount() - 1;
                        break;
                    case grid.dataRowsRangeMode.renderable:
                        maxRow = this._renderableRowsCount() - 1;
                        break;
                }
                if(this._showRowHeader()) {
                    maxCol--;
                }
                if(lastRowEntirelyVisible && maxRow > 0) {
                    maxRow--;
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
            wijgrid.prototype._getNextCurrentCell = function (dataRange, cellInfo, keyCode, shiftKeyPressed) {
                var cellIndex = cellInfo.cellIndex(), rowIndex = cellInfo.rowIndex(), keyCodeEnum = wijmo.getKeyCodeEnum(), sketchTable = this.sketchTable, renderedRowIndex = this._renderableBoundsCollection().getRenderedIndex(rowIndex), rbc = this._renderableBoundsCollection(), tmp, dataRowsOnly = (keyCode === keyCodeEnum.TAB), self = this, sss = self._serverSideVirtualScrolling(), findNextVisibleRow = function (further, startFrom, maxRowsToTouch, dataRowsOnly) {
                    if (typeof dataRowsOnly === "undefined") { dataRowsOnly = false; }
                    var iterator = further ? rbc.forEachIndex : rbc.forEachIndexBackward, cnt = 0, result = null;
                    iterator.call(rbc, startFrom, -1, function (absIdx) {
                        var sketchIdx = absIdx - self._dataOffset;
                        if(sss && (sketchIdx < 0 || sketchIdx >= sketchTable.count())) {
                            // exceeded sketchTable bounds
                            result = absIdx;
                            return false;
                        }
                        var sketchRow = sketchTable.row(sketchIdx), isDataRow = // this row is rendered, but we doesn't know whether it visible or not.
                        sketchRow.isDataRow();
                        // test dataType and visibility
                        if((!dataRowsOnly || isDataRow) && (!(sketchRow.extInfo.state & wijmo.grid.renderStateEx.hidden))) {
                            result = absIdx;
                            if(++cnt >= maxRowsToTouch) {
                                return false;// stop iteration

                            }
                        }
                    });
                    return result;
                };
                switch(keyCode) {
                    case keyCodeEnum.ENTER:
                    case keyCodeEnum.DOWN:
                        if((tmp = findNextVisibleRow(true, renderedRowIndex + 1, 1)) != null) {
                            rowIndex = tmp;
                        }
                        break;
                    case keyCodeEnum.PAGE_DOWN:
                        if((tmp = findNextVisibleRow(true, renderedRowIndex + 1, this._pageSizeKey)) != null) {
                            rowIndex = tmp;
                        }
                        break;
                    case keyCodeEnum.UP:
                        if((tmp = findNextVisibleRow(false, renderedRowIndex - 1, 1)) != null) {
                            rowIndex = tmp;
                        }
                        break;
                    case keyCodeEnum.PAGE_UP:
                        if((tmp = findNextVisibleRow(false, renderedRowIndex - 1, this._pageSizeKey)) != null) {
                            rowIndex = tmp;
                        }
                        break;
                    case keyCodeEnum.TAB:
                        // note: iterate through data rows only
                        if(shiftKeyPressed) {
                            cellIndex--;
                            if(cellIndex < dataRange.topLeft().cellIndex()) {
                                cellIndex = dataRange.bottomRight().cellIndex();
                                if((tmp = findNextVisibleRow(false, renderedRowIndex - 1, 1, true)) != null) {
                                    rowIndex = tmp;
                                } else {
                                    // reached the top?
                                    if((tmp = findNextVisibleRow(false, rbc.capacity() - 1, 1, true)) != null) {
                                        rowIndex = tmp;
                                    }
                                }
                            }
                        } else {
                            cellIndex++;
                            if(cellIndex > dataRange.bottomRight().cellIndex()) {
                                cellIndex = dataRange.topLeft().cellIndex();
                                if((tmp = findNextVisibleRow(true, renderedRowIndex + 1, 1, true)) != null) {
                                    rowIndex = tmp;
                                } else {
                                    // reached the bottom?
                                    if((tmp = findNextVisibleRow(true, 0, 1, true)) != null) {
                                        rowIndex = tmp;
                                    }
                                }
                            }
                        }
                        break;
                    case keyCodeEnum.END:
                        cellIndex = dataRange.bottomRight().cellIndex();
                        break;
                    case keyCodeEnum.HOME:
                        cellIndex = dataRange.topLeft().cellIndex();
                        break;
                    case keyCodeEnum.LEFT:
                        if(cellIndex > dataRange.topLeft().cellIndex()) {
                            cellIndex--;
                        }
                        break;
                    case keyCodeEnum.RIGHT:
                        if(cellIndex < dataRange.bottomRight().cellIndex()) {
                            cellIndex++;
                        }
                        break;
                }
                return new wijmo.grid.cellInfo(cellIndex, rowIndex, this);
            };
            wijgrid.prototype._findUntilOuterDiv = function (start, tagsToFind) {
                var current = start, outerDiv = this.outerDiv[0], stopper, nodeName, item = null;
                for(; current; current = current.parentNode) {
                    nodeName = current.nodeName && current.nodeName.toLowerCase();
                    if(nodeName) {
                        if(current === outerDiv) {
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
                var result, dataRange = this._getDataCellsRange(grid.dataRowsRangeMode.rendered);
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
                    if(this._showRowHeader()) {
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
                var offsetStaticIndex = this._getStaticOffsetIndex(true), staticColumnIndex = this._getStaticIndex(false), realIndex = staticColumnIndex + offsetStaticIndex;
                if(staticColumnIndex >= 0) {
                    var leaves = this._field("visibleLeaves"), allColumns = wijmo.grid.flatten(this.options.columns), len = leaves.length;
                    if(realIndex < len - 1) {
                        var parent = wijmo.grid.getTompostParent(leaves[realIndex], allColumns);
                        // If child column of some band is fixed then the top and right-most column of the root band contained current column will be fixed.
                        if(parent) {
                            for(realIndex++; realIndex < len; realIndex++) {
                                var nextParent = wijmo.grid.getTompostParent(leaves[realIndex], allColumns);
                                if(nextParent !== parent) {
                                    realIndex--;
                                    break;
                                }
                            }
                        }
                    }
                    if(realIndex >= len) {
                        realIndex = len - 1;
                    }
                }
                return realIndex;
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
                        result = result || (leaf.parentVis && (leaf.rowMerge && (leaf.rowMerge !== "none")))// merged visible column?
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
                return this.mView;
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
                return this.sketchTable.count();
            };
            wijgrid.prototype._renderableRowsCount = function () {
                return this._renderableBoundsCollection().capacity();
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
            wijgrid.prototype._viewPortBounds = function (value) {
                if(arguments.length) {
                    this.mViewPortBounds = value;
                }
                return this.mViewPortBounds;
            };
            wijgrid.prototype._viewPortBoundsOfEntirelyShownRows = function () {
                var bounds = this._viewPortBounds(), isLast = false, count = bounds.end - bounds.start + 1;
                if(this._allowVirtualScrolling()) {
                    var view = this._view();
                    if(count < view.getVirtualPageSize()) {
                        isLast = true;
                    }
                }
                if(!isLast) {
                    bounds = $.extend({
                    }, bounds);
                    bounds.end--;
                }
                return bounds;
            };
            return wijgrid;
        })(wijmo.wijmoWidget);
        grid.wijgrid = wijgrid;
        wijgrid.prototype.widgetEventPrefix = "wijgrid";
        wijgrid.prototype._data$prefix = "wijgrid";
        wijgrid.prototype._customSortOrder = 1000;
        wijgrid.prototype._pageSizeKey = 10;
        wijgrid.prototype._mergeWidgetsWithOptions = true;
        var wijgrid_options = (function () {
            function wijgrid_options() {
                /** @ignore */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-b",
                    stateHover: "ui-btn-down-c",
                    stateActive: "ui-btn-down-c",
                    stateHighlight: "ui-btn-down-e"
                };
                this.wijCSS = {
                    wijgrid: "",
                    wijgridTable: "",
                    wijgridTH: "",
                    wijgridTD: "",
                    wijgridCellContainer: "",
                    wijgridRowHeader: "",
                    wijgridCurrentRowHeaderCell: "",
                    wijgridCurrentHeaderCell: "",
                    wijgridCurrentCell: "",
                    wijgridCellAlignLeft: "",
                    wijgridCellAlignRight: "",
                    wijgridCellAlignCenter: "",
                    wijgridFilterList: "",
                    wijgridFilter: "",
                    wijgridFilterInput: "",
                    wijgridFilterTrigger: "",
                    wijgridFilterNativeHtmlEditorWrapper: "",
                    wijgridHeaderArea: "",
                    wijgridFooterArea: "",
                    wijgridHeaderRow: "",
                    wijgridRow: "",
                    wijgridDataRow: "",
                    wijgridAltRow: "",
                    wijgridEmptyDataRow: "",
                    wijgridFilterRow: "",
                    wijgridGroupHeaderRow: "",
                    wijgridGroupFooterRow: "",
                    wijgridGroupHeaderRowCollapsed: "",
                    wijgridGroupHeaderRowExpanded: "",
                    wijgridFooterRow: "",
                    wijgridLoadingOverlay: "",
                    wijgridLoadingText: "",
                    wijgridGroupArea: "",
                    wijgridGroupAreaButton: "",
                    wijgridGroupAreaButtonSort: "",
                    wijgridGroupAreaButtonClose: "",
                    wijgridGroupToggleVisibilityButton: "",
                    wijgridFixedView: "",
                    wijgridScroller: "",
                    wijgridDndHelper: "",
                    wijgridDndArrowTopContainer: "",
                    wijgridDndArrowBottomContainer: "",
                    wijgridFreezingHandleV: "",
                    wijgridFreezingHandleH: "",
                    wijgridResizingHandle: "",
                    wijgridHeaderCellSortIcon: "",
                    wijgridHeaderCellText: ""
                };
                /** A value indicating whether columns can be moved.
                * @example
                * // Columns cannot be dragged and moved if this option is set to false
                * $("#element").wijgrid({ allowColMoving: false });
                * @remarks
                * This option must be set to true in order to drag column headers to the group area.
                */
                this.allowColMoving = false;
                /** Determines whether the column width can be increased and decreased by dragging the sizing handle, or the edge of the column header, with the mouse.
                * @example
                * // The sizing handle cannot be dragged and column width cannot be changed if this option is set to false
                * $("#element").wijgrid({ allowColSizing: false });
                */
                this.allowColSizing = false;
                /** Determines whether the user can make changes to cell contents in the grid.
                * This option is obsolete. Use the editingMode option instead.
                * @example
                * // Users cannot change cell contents in the grid if this option is set to false
                * $("#element").wijgrid({ allowEditing: false });
                */
                this.allowEditing = false;
                /** Determines whether the user can move the current cell using the arrow keys.
                * @example
                * // Users cannot move the selection using arrow keys if this option is set to false
                * $("#element").wijgrid({ allowKeyboardNavigation: false });
                */
                this.allowKeyboardNavigation = true;
                /** Determines whether the grid should display paging buttons. The number of rows on a page is determined by the pageSize option.
                * @example
                * // Grid displays paging buttons when allowPaging is true. The pageSize here sets 5 rows to a page.
                * $("#element").wijgrid({ allowPaging: false, pageSize: 5 });
                */
                this.allowPaging = false;
                /** Determines whether the widget can be sorted by clicking the column header.
                * @example
                * // Sort a column by clicking its header when allowSorting is set to true
                * $("#element").wijgrid({ allowSorting: false });
                */
                this.allowSorting = false;
                /** A value that indicates whether virtual scrolling is allowed. Set allowVirtualScrolling to true when using large amounts of data to improve efficiency.
                * @example
                * $("#element").wijgrid({ allowVirtualScrolling: false });
                * @remarks
                * This option is ignored if the grid uses paging, columns merging or fixed rows. This option cannot be enabled when using dynamic wijdatasource.
                */
                this.allowVirtualScrolling = false;
                /** This function is called each time wijgrid needs to change cell appearence, for example, when the current cell position is changed or cell is selected.
                * Can be used for customization of cell style depending on its state.
                * @example
                * // Make the text of the current cell italic.
                * $("#element").wijgrid({
                *		highlightCurrentCell: true,
                *		cellStyleFormatter: function(args) {
                *			if ((args.row.type & wijmo.grid.rowType.data)) {
                *				if (args.state & wijmo.grid.renderState.current) {
                *					args.$cell.css("font-style", "italic");
                *				} else {
                *					args.$cell.css("font-style", "normal");
                *				}
                *			}
                *		}
                * });
                * @param {wijmo.grid.ICellStyleFormaterArgs} args The data with this function.
                * @remarks
                * The args.state parameters equal to wijmo.grid.renderState.rendering means that the cell is being created,
                * at this moment you can apply general formatting to it indepentant of any particular state, like "current" or "selected".
                */
                this.cellStyleFormatter = undefined;
                /** An array of column options.
                * @example
                * $("#element").wijgrid({ columns: [ { headerText: "column0", allowSort: false }, { headerText: "column1", dataType: "number" } ] });
                */
                this.columns = [];
                /** Determines behavior for column autogeneration. Possible values are: "none", "append", "merge".
                * @example
                * $("#element").wijgrid({ columnsAutogenerationMode: "merge" });
                * @remarks
                * Possible values are:
                * "none": Column auto-generation is turned off.
                * "append": A column will be generated for each data field and added to the end of the columns collection.
                * "merge": Each column having dataKey option not specified will be automatically bound to the first unreserved data field.For each data field not bound to any column a new column will be generated and added to the end of the columns collection.
                *
                * To prevent automatic binding of a column to a data field set its dataKey option to null.
                *
                * Note: columns autogeneration process affects the options of columns and the columns option itself.
                */
                this.columnsAutogenerationMode = "merge";
                /** Determines the culture ID.
                * @example
                * // This code sets the culture to English.
                * $("#element").wijgrid({ culture: "en" });
                * @remarks
                * Please see the https://github.com/jquery/globalize for more information.
                */
                this.culture = "";
                /** An array of custom user filters. Use this option if you want to extend the default set of filter operators with your own. Custom filters will be shown in the filter dropdown.
                * @example
                * var oddFilterOp = {
                *	name: "customOperator-Odd",
                *	arity: 1,
                *	applicableTo: ["number"],
                *	operator: function(dataVal) { return (dataVal % 2 !== 0); }
                * }
                *
                * $("#element").wijgrid({ customFilterOperators: [oddFilterOp] });
                */
                this.customFilterOperators = [];
                /** Determines the datasource.
                * Possible datasources include:
                *		1. A DOM table. This is the default datasource, used if the data option is null. Table must have no cells with rowSpan and colSpan attributes.
                *		2. A two-dimensional array, such as [[0, "a"], [1, "b"]].
                *		3. An array of objects, such as [{field0: 0, field1: "a"}, {field0: 1, field1: "b'}].
                *		4. A wijdatasource.
                *		5. A wijdataview.
                * @example
                * // DOM table
                * $("#element").wijgrid();
                * // two-dimensional array
                * $("#element").wijgrid({ data: [[0, "a"], [1, "b"]] });
                */
                this.data = null;
                /** Determines an action to bring a cell in the editing mode when the editingMode option is set to "cell". Possible values are: "click", "doubleClick", "auto".
                * @example
                * $("#element").wijgrid({ editingInitOption: "auto" });
                * @remarks
                * Possible values are:
                *	"click": cell is edited via a single click.
                *	"doubleClick": cell is edited via a double click.
                *	"auto": action is determined automatically depending upon user environment. If user has a mobile platform then "click" is used, "doubleClick" otherwise.
                */
                this.editingInitOption = "auto";
                /** Determines the editing mode. Possible values are: "none", "row", "cell",
                * @example
                * $("#element").wijgrid({
                *    editingMode: "row",
                *    columns: [{
                *       showEditButton: true
                *    }]
                * });
                * @remarks
                * Possible values are:
                * "none": the editing ability is disabled.
                *	"cell": a single cell can be edited via a double click.
                *	"row": a whole row can be edited via a command column.
                */
                this.editingMode = "none";
                /** Determines if the exact column width, in pixels, is used.
                * @example
                * $("#element").wijgrid({ ensureColumnsPxWidth: true });
                * @remarks
                * By default, wijgrid emulates the table element behavior when using a number as the width. This means wijgrid may not have the exact width specified. If exact width is needed, please set the ensureColumnsPxWidth option of wijgrid to true. If this option is set to true, wijgrid will not expand itself to fit the available space.Instead, it will use the width option of each column widget.
                */
                this.ensureColumnsPxWidth = false;
                /** Determines the order of items in the filter drop-down list.
                * Possible values are: "none", "alphabetical", "alphabeticalCustomFirst" and "alphabeticalEmbeddedFirst"
                * @example
                * $("#element").wijgrid({ filterOperatorsSortMode: "alphabeticalCustomFirst" });
                * @remarks
                * Possible values are:
                *	"none": Operators follow the order of addition; built-in operators appear before custom ones.
                *	"alphabetical": Operators are sorted alphabetically.
                *	"alphabeticalCustomFirst": Operators are sorted alphabetically with custom operators appearing before built-in ones.
                *	"alphabeticalEmbeddedFirst": Operators are sorted alphabetically with built-in operators appearing before custom operators.
                *
                * "NoFilter" operator is always first.
                */
                this.filterOperatorsSortMode = "alphabeticalCustomFirst";
                /** Determines whether the user can change position of the static column or row by dragging the vertical or horizontal freezing handle with the mouse. Possible values are: "none", "columns", "rows", "both".
                * @example
                * $("#element").wijgrid({ freezingMode: "both" });
                * @remarks
                * Possible values are:
                * "none": The freezing handle cannot be dragged.
                * "columns": The user can drag the vertical freezing handle to change position of the static column.
                * "rows": The user can drag the horizontal freezing handle to change position of the static row.
                * "both": The user can drag both horizontal and vertical freezing handles.
                */
                this.freezingMode = "none";
                /** Determines the caption of the group area.
                * @example
                * // Set the groupAreaCaption to a string and the text appears above the grid
                * $("#element").wijgrid({ groupAreaCaption: "Drag a column here to group by that column." });
                */
                this.groupAreaCaption = "Drag a column here to group by that column.";
                /** Determines the indentation of the groups, in pixels.
                * @example
                * // Set the groupIndent option to the number of pixels to indent data when grouping.
                * $("#element").wijgrid({ groupIndent: 15 });
                */
                this.groupIndent = 10;
                /** Determines whether the position of the current cell is highlighted or not.
                * @example
                * $("#element").wijgrid({ highlightCurrentCell: false });
                */
                this.highlightCurrentCell = false;
                /** Determines whether hovered row is highlighted or not.
                * @example
                * $("#element").wijgrid({ highlightCurrentCell: true });
                */
                this.highlightOnHover = true;
                /** Determines the text to be displayed when the grid is loading.
                * @example
                * $("#element").wijgrid({ loadingText: "Loading..."});
                */
                this.loadingText = "Loading...";
                /** Cell values equal to this property value are considered null values. Use this option if you want to change default representation of null values (empty strings) with something else.
                * @example
                * $("#element").wijgrid({ nullString: "" });
                * @remarks
                * Case-sensitive for built-in parsers.
                */
                this.nullString = "";
                /** Determines the zero-based index of the current page. You can use this to access a specific page, for example, when using the paging feature.
                * @example
                * $("#element").wijgrid({ pageIndex: 0 });
                */
                this.pageIndex = 0;
                /** Number of rows to place on a single page.
                * The default value is 10.
                * @example
                * // The pageSize here sets 10 rows to a page. The allowPaging option is set to true so paging buttons appear.
                * $("#element").wijgrid({ pageSize: 10 });
                */
                this.pageSize = 10;
                /** Determines the pager settings for the grid including the mode (page buttons or next/previous buttons), number of page buttons, and position where the buttons appear.
                * @example
                * // Display the pager at the top of the wijgrid.
                * $("#element").wijgrid({ pagerSettings: { position: "top" } });
                * @remarks
                * See the wijpager documentation for more information on pager settings.
                */
                this.pagerSettings = {
                    mode: "numeric",
                    pageButtonCount: 10,
                    position: "bottom"
                };
                /** A value indicating whether DOM cell attributes can be passed within a data value.
                * @example
                * // Render the style attribute passed within the data.
                * $("#element").wijgrid({
                *		readAttributesFromData: false });
                *		data: [
                *			[ [1, { "style": "color: red" } ], a ]
                *		]
                * });
                * @remarks
                * This option allows binding collection of values to data and automatically converting them as attributes of corresponded DOM table cells during rendering.
                * Values should be passed as an array of two items, where first item is a value of the data field, the second item is a list of values:
                * $("#element").wijgrid({
                *		data: [
                *			[ [1, { "style": "color: red", "class": "myclass" } ], a ]
                *		]
                * });
                *
                * or
                *
                * $("#element").wijgrid({
                *		data: [
                *			{ col0: [1, { "style": "color: red", "class": "myclass" }], col1: "a" }
                *		]
                * });
                *
                * Note: during conversion wijgrid extracts the first item value and makes it data field value, the second item (list of values) is removed:
                * [ { col0: 1, col1: "a" } ]
                *
                * If DOM table is used as a datasource then attributes belonging to the cells in tBody section of the original table will be read and applied to the new cells.
                *
                * rowSpan and colSpan attributes are not allowed.
                */
                this.readAttributesFromData = false;
                /** Determines the height of a rows when virtual scrolling is used.
                * @example
                * $("#element").wijgrid({ rowHeight: 20 });
                * @remarks
                * Can be set only during creation
                */
                this.rowHeight = -1;
                /** Function used for styling rows in wijgrid.
                * @example
                * // Make text of the alternating rows italic.
                * $("#demo").wijgrid({
                *		data: [
                *			[0, "Nancy"], [1, "Susan"], [2, "Alice"], [3, "Kate"]
                *		],
                *		rowStyleFormatter (args) {
                *			if ((args.state & wijmo.grid.renderState.rendering) && (args.type & wijmo.grid.rowType.dataAlt)) {
                *				args.$rows.find("td").css("font-style", "italic");
                *			}
                *		}
                * });
                * @param {wijmo.grid.IRowInfo} args The data with this function.
                */
                this.rowStyleFormatter = undefined;
                /** Determines which scrollbars are active and if they appear automatically based on content size.
                * Possbile values are: "none", "auto", "horizontal", "vertical", "both".
                * @example
                * // The horizontal and vertical scrollbars are active when the scrollMode is set to both.
                * $("#element").wijgrid({ scrollMode: "both" });
                * @remarks
                * Possible values are:
                *	"none": Scrolling is not used; the staticRowIndex and staticColumnIndex values are ignored.
                *	"auto": Scrollbars appear automatically depending upon content size.
                *	"horizontal": The horizontal scrollbar is active.
                *	"vertical": The vertical scrollbar is active.
                *	"both": Both horizontal and vertical scrollbars are active.
                */
                this.scrollMode = "none";
                /** Determines which cells, range of cells, columns, or rows can be selected at one time.
                * Possible values are: "none", "singleCell", "singleColumn", "singleRow", "singleRange", "multiColumn", "multiRow" and "multiRange".
                * @example
                * // Set selectionMode to muliColumn and users can select more than one column using the CTRL or SHIFT keys.
                * $("#element").wijgrid({ selectionMode: "multiColumn" });
                * @remarks
                * Possible values are:
                * "none": Selection is turned off.
                * "singleCell": Only a single cell can be selected at a time.
                * "singleColumn": Only a single column can be selected at a time.
                * "singleRow": Only a single row can be selected at a time.
                * "singleRange": Only a single range of cells can be selected at a time.
                * "multiColumn": It is possible to select more than one row at the same time using the mouse and the CTRL or SHIFT keys.
                * "multiRow": It is possible to select more than one row at the same time using the mouse and the CTRL or SHIFT keys.
                * "multiRange": It is possible to select more than one cells range at the same time using the mouse and the CTRL or SHIFT keys.
                */
                this.selectionMode = "singleRow";
                /** A value indicating whether the filter row is visible.
                * Filter row is used to display column filtering interface.
                * @example
                * // Set showFilter to true to view the filter row.
                * $("#element").wijgrid({ showFilter: true });
                */
                this.showFilter = false;
                /** A value indicating whether the footer row is visible.
                * Footer row is used for displaying of tfoot section of original table, and to show totals.
                * @example
                * // Set showFooter to true to view the footer row.
                * $("#element").wijgrid({ showFooter: true });
                */
                this.showFooter = false;
                /** A value indicating whether group area is visible.
                * Group area is used to display headers of groupped columns. User can drag columns from/to group area by dragging column headers with mouse, if allowColumnMoving option is on.
                * @example
                * // Set showGroupArea to true to display the group area.
                * $("#element").wijgrid({ showGroupArea: true });
                */
                this.showGroupArea = false;
                /** A value indicating whether a selection will be automatically displayed at the current cell position when the wijgrid is rendered.
                * Set this option to false if you want to prevent wijgrid from selecting the currentCell automatically.
                * @example
                * $("#element").wijgrid({ showSelectionOnRender: true });
                */
                this.showSelectionOnRender = true;
                /** A value indicating whether the row header is visible.
                * @example
                * $("#element").wijgrid({ showRowHeader: true });
                */
                this.showRowHeader = false;
                /** Indicates the index of columns that will always be shown on the left when the grid view is scrolled horizontally.
                * Note that all columns before the static column will be automatically marked as static, too.
                * This can only take effect when the scrollMode option is not set to "none".
                * It will be considered "-1" when grouping or row merging is enabled. A "-1" means there is no data column but the row header is static. A zero (0) means one data column and row header are static.
                * @example
                * $("#element").wijgrid({ staticColumnIndex: -1 });
                */
                this.staticColumnIndex = -1;
                /** Gets or sets the alignment of the static columns area. Possible values are "left", "right".
                * @example
                * $("#element").wijgrid({ staticColumnsAlignment: "left" });
                * @remarks
                * The "right" mode has limited functionality:
                *  - The showRowHeader value is ignored.
                *  - Changing staticColumnIndex at run-time by dragging the vertical bar is disabled.
                */
                this.staticColumnsAlignment = "left";
                /** Indicates the index of data rows that will always be shown on the top when the wijgrid is scrolled vertically.
                * Note, that all rows before the static row will be automatically marked as static, too.
                * This can only take effect when the scrollMode option is not set to "none". This will be considered "-1" when grouping or row merging is enabled.
                * A "-1" means there is no data row but the header row is static.A zero (0) means one data row and the row header are static.
                * @example
                * $("#element").wijgrid({ staticRowIndex: -1 });
                */
                this.staticRowIndex = -1;
                /** Gets or sets the virtual number of items in the wijgrid and enables custom paging.
                * Setting option to a positive value activates custom paging, the number of displayed rows and the total number of pages will be determined by the totalRows and pageSize values.
                * @example
                * $("#element").wijgrid({ totalRows: -1 });
                * @remarks
                * In custom paging mode sorting, paging and filtering are not performed automatically.
                * This must be handled manually using the sorted, pageIndexChanged, and filtered events. Load the new portion of data there followed by the ensureControl(true) method call.
                */
                this.totalRows = -1;
                /* --- events */
                /** The afterCellEdit event handler is a function called after cell editing is completed.
                * This function can assist you in completing many tasks, such as in making changes once editing is completed; in tracking changes in cells, columns, or rows; or in integrating custom editing functions on the front end.
                * @event
                * @example
                * // Once cell editing is complete, the function calls the destroy method to destroy the wijcombobox widget and the wijinputnumber widget which are used as the custom editors.
                * $("#element").wijgrid({
                *		afterCellEdit: function(e, args) {
                *			switch (args.cell.column().dataKey) {
                *				case "Position":
                *					args.cell.container().find("input").wijcombobox("destroy");
                *					break;
                *				case "Acquired":
                *					args.cell.container().find("input").wijinputnumber("destroy");
                *					break;
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ afterCellEdit: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridaftercelledit", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IAfterCellEditEventArgs} args The data with this event.
                */
                this.afterCellEdit = null;
                /** The afterCellUpdate event handler is a function that is called after a cell has been updated. Among other functions, this event allows you to track and store the indices of changed rows or columns.
                * @event
                * @example
                * // Once the cell has been updated, the information from the underlying data is dumped into the "#log" element.
                * $("#element").wijgrid({
                *		afterCellUpdate: function(e, args) {
                *			$("#log").html(dump($("#demo").wijgrid("data")));
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ afterCellUpdate: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridaftercellupdate", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IAfterCellUpdateEventArgs} args The data with this event.
                */
                this.afterCellUpdate = null;
                /** The beforeCellEdit event handler is a function that is called before a cell enters edit mode.
                * The beforeCellEdit event handler assists you in appending a widget, data, or other item to a wijgrid's cells before the cells enter edit mode. This event is cancellable if the editigMode options is set to "cell".
                * @event
                * @example
                * // Allow the user to change the price only if the product hasn't been discontinued:
                * $("#element").wijgrid({
                *		beforeCellEdit: function(e, args) {
                *			return !((args.cell.column().dataKey === "Price") && args.cell.row().data.Discontinued);
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ beforeCellEdit: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridbeforecelledit", function (e, args) {
                *		// some code here
                * });
                *
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IBeforeCellEditEventArgs} args The data with this event.
                */
                this.beforeCellEdit = null;
                /** The beforeCellUpdate event handler is a function that is called before the cell is updated with new or user-entered data. This event is cancellable if the editingMode options is set to "cell".
                * There are many instances where this event is helpful, such as when you need to check a cell's value before the update occurs or when you need to apply an alert message based on the cell's value.
                * @event
                * @example
                * // In this sample, you use args.value to check the year that the user enters in the "Acquired" column.
                * // If it's less than 1990 or greater than the current year, then the event handler will return false to cancel updating and show the user an alert message.
                * $("#element").wijgrid({
                *		beforeCellUpdate: function(e, args) {
                *			switch (args.cell.column().dataKey) {
                *				case "Acquired":
                *					var $editor = args.cell.container().find("input"),
                *						value = $editor.wijinputnumber("getValue"),
                *						curYear = new Date().getFullYear();
                *
                *					if (value < 1990 || value > curYear) {
                *						$editor.addClass("ui-state-error");
                *						alert("value must be between 1990 and " + curYear);
                *						$editor.focus();
                *						return false;
                *					}
                *
                *					args.value = value;
                *					break;
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ beforeCellUpdate: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridbeforecellupdate", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IBeforeCellUpdateEventArgs} args The data with this event.
                */
                this.beforeCellUpdate = null;
                /** The cellClicked event handler is a function that is called when a cell is clicked. You can use this event to get the information of a clicked cell using the args parameter.
                * @event
                * @example
                * // The sample uses the cellClicked event to trigger an alert when the cell is clicked.
                * $("#element").wijgrid({
                *		cellClicked: function (e, args) {
                *			alert(args.cell.value());
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ cellClicked: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcellclicked", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.ICellClickedEventArgs} args The data with this event.
                */
                this.cellClicked = null;
                /** The columnDragging event handler is a function that is called when column dragging has been started, but before the wijgrid handles the operation. This event is cancellable.
                * @event
                * @example
                * // Preventing a user from dragging a specific column
                * $("#element").wijgrid({
                *		columnDragging: function (e, args) {
                *			return !(args.drag.dataKey == "ID");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnDragging: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumndragging", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnDraggingEventArgs} args The data with this event.
                */
                this.columnDragging = null;
                /** The columnDragged event handler is a function that is called when column dragging has been started. You can use this event to find the column being dragged or the dragged column's location.
                * @event
                * @example
                * // Supply a callback function to handle the columnDragged event:
                * $("#element").wijgrid({
                *		columnDragged: function (e, args) {
                *			alert("The '" + args.drag.headerText + "' column is being dragged from the '" + args.dragSource + "' location");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnDragged: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumndragged", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnDraggedEventArgs} args The data with this event.
                */
                this.columnDragged = null;
                /** The columnDropping event handler is a function that is called when a column is dropped into the columns area, but before wijgrid handles the operation. This event is cancellable.
                * @event
                * @example
                * // Preventing user from dropping any column before the "ID" column.
                * $("#element").wijgrid({
                *		columnDropping: function (e, args) {
                *			return !(args.drop.dataKey == "ID" && args.at == "left");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnDropping: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumndropping", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnDroppingEventArgs} args The data with this event.
                */
                this.columnDropping = null;
                /** The columnDropped event handler is a function that is called when a column has been dropped into the columns area.
                * @event
                * @example
                * // Supply a callback function to handle the columnDropped event:
                * $("#element").wijgrid({
                *		columnDropped: function (e, args) {
                *			"The '" + args.drag.headerText + "' column has been dropped onto the '" + args.drop.headerText + "' column at the '" + args.at + "' position"
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnDropped: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumndropped", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnDroppedEventArgs} args The data with this event.
                */
                this.columnDropped = null;
                /** The columnGrouping event handler is a function that is called when a column is dropped into the group area, but before the wijgrid handles the operation. This event is cancellable.
                * @event
                * @example
                * // Preventing user from grouping the "UnitPrice" column.
                * $("#element").wijgrid({
                *		columnGrouping: function (e, args) {
                *			return !(args.drag.headerText == "UnitPrice");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnGrouping: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumngrouping", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnGroupingEventArgs} args The data with this event.
                */
                this.columnGrouping = null;
                /** The columnGrouped event handler is a function that is called when a column has been dropped into the group area.
                * @event
                * @example
                * // Supply a callback function to handle the columnGrouped event:
                * $("#element").wijgrid({
                *		columnGrouped: function (e, args) {
                *			alert("The '" + args.drag.headerText "' column has been grouped");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnGrouped: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumngrouped", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnGroupedEventArgs} args The data with this event.
                */
                this.columnGrouped = null;
                /** The columnResizing event handler is called when a user resizes the column but before the wijgrid handles the operation. This event is cancellable.
                * @event
                * @example
                * // Prevent setting the width of "ID" column less than 100 pixels
                * $("#element").wijgrid({
                *		columnResizing: function (e, args) {
                *			if (args.column.dataKey == "ID" && args.newWidth < 100) {
                *				args.newWidth = 100;
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnResizing: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumnresizing", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnResizingEventArgs} args The data with this event.
                */
                this.columnResizing = null;
                /** The columnResized event handler is called when a user has changed a column's size.
                * @event
                * @example
                * // Supply a callback function to handle the columnGrouped event:
                * $("#element").wijgrid({
                *		columnResized: function (e, args) {
                *			alert("The '" + args.column.headerText + "' has been resized");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnResized: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumnresized", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnResizedEventArgs} args The data with this event.
                */
                this.columnResized = null;
                /** The columnUngrouping event handler is called when a column has been removed from the group area but before the wjgrid handles the operation. This event is cancellable.
                * @event
                * @example
                * // Preventing user from ungrouping the "UnitPrice" column.
                * $("#element").wijgrid({
                *		columnUngrouping: function (e, args) {
                *			return !(args.column.headerText == "UnitPrice");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnUngrouping: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumnungrouping", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnUngroupingEventArgs} args The data with this event.
                */
                this.columnUngrouping = null;
                /** The columnUngrouped event handler is called when a column has been removed from the group area.
                * @event
                * @example
                * // Supply a callback function to handle the columnGrouped event:
                * $("#element").wijgrid({
                *		columnUngrouped: function (e, args) {
                *			alert("The '" + args.column.headerText + "' has been ungrouped");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnUngrouped: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumnungrouped", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnUngroupedEventArgs} args The data with this event.
                */
                this.columnUngrouped = null;
                /** The currentCellChanging event handler is called before the cell is changed. You can use this event to get a selected row or column or to get a data row bound to the current cell. This event is cancellable.
                * @event
                * @example
                * // Gets the data row bound to the current cell.
                * $("#element").wijgrid({
                *		currentCellChanging: function (e, args) {
                *			var rowObj = $(e.target).wijgrid("currentCell").row();
                *			if (rowObj) {
                *				var dataItem = rowObj.data; // current data item (before the cell is changed).
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ currentCellChanging: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcurrentcellchanging", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.ICurrentCellChangingEventArgs} args The data with this event.
                */
                this.currentCellChanging = null;
                /** The currentCellChanged event handler is called after the current cell is changed.
                * @event
                * @example
                * // Gets the data row bound to the current cell.
                * $("#element").wijgrid({
                *		currentCellChanged: function (e, args) {
                *			var rowObj = $(e.target).wijgrid("currentCell").row();
                *			if (rowObj) {
                *				var dataItem = rowObj.data; // current data item (after the cell is changed).
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ currentCellChanged: function (e) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcurrentcellchanged", function (e) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                */
                this.currentCellChanged = null;
                /** The filterOperatorsListShowing event handler is a function that is called before the filter drop-down list is shown. You can use this event to customize the list of filter operators for your users.
                * @event
                * @example
                * // Limit the filters that will be shown to the "Equals" filter operator
                * $("#element").wijgrid({
                *		filterOperatorsListShowing: function (e, args) {
                *			args.operators = $.grep(args.operators, function(op) {
                *				return op.name === "Equals" || op.name === "NoFilter";
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ filterOperatorsListShowing: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridfilteroperatorslistshowing", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IFilterOperatorsListShowingEventArgs} args The data with this event.
                */
                this.filterOperatorsListShowing = null;
                /** The filtering event handler is a function that is called before the filtering operation is started. For example, you can use this event to change a filtering condition before a filter will be applied to the data. This event is cancellable.
                * @event
                * @example
                * // Prevents filtering by negative values
                * $("#element").wijgrid({
                *		filtering: function (e, args) {
                *			if (args.column.dataKey == "Price" && args.value < 0) {
                *				args.value = 0;
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ filtering: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridfiltering", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IFilteringEventArgs} args The data with this event.
                */
                this.filtering = null;
                /** The filtered event handler is a function that is called after the wijgrid is filtered.
                * @event
                * @example
                * //
                * $("#element").wijgrid({
                *		filtered: function (e, args) {
                *			alert("The filtered data contains: " + $(this).wijgrid("dataView").count() + " rows");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ filtered: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridfiltered", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IFilteredEventArgs} args The data with this event.
                */
                this.filtered = null;
                /** The groupAggregate event handler is a function that is called when groups are being created and the column object's aggregate option has been set to "custom". This event is useful when you want to calculate custom aggregate values.
                * @event
                * @example
                * // This sample demonstrates using the groupAggregate event handler to calculate an average in a custom aggregate:
                * $("#element").wijgrid({
                *		groupAggregate: function (e, args) {
                *			if (args.column.dataKey == "Price") {
                *				var aggregate = 0;
                *
                *				for (var i = args.groupingStart; i <= args.groupingEnd; i++) {
                *					aggregate += args.data[i].valueCell(args.column.dataIndex).value;
                *				}
                *
                *				aggregate = aggregate/ (args.groupingEnd - args.groupingStart + 1);
                *				args.text = aggregate;
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ groupAggregate: function (e, args) {
                *		// some code here
                * }});
                * Bind to the event by type:
                *
                * $("#element").bind("wijgridgroupaggregate", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IGroupAggregateEventArgs} args The data with this event.
                */
                this.groupAggregate = null;
                /** The groupText event handler is a function that is called when groups are being created and the groupInfo option has the groupInfo.headerText or the groupInfo.footerText options set to "custom". This event can be used to customize group headers and group footers.
                * @event
                * @example
                * // The following sample sets the groupText event handler to avoid empty cells. The custom formatting applied to group headers left certain cells appearing as if they were empty. This code avoids that:
                * $("#element").wijgrid({
                *		groupText: function (e, args) {
                *			if (!args.groupText) {
                *				args.text = "null";
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ groupText: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridgrouptext", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IGroupTextEventArgs} args The data with this event.
                */
                this.groupText = null;
                /** The invalidCellValue event handler is a function called when a cell needs to start updating but the cell value is invalid. So if the value in a wijgrid cell can't be converted to the column target type, the invalidCellValue event will fire.
                * @event
                * @example
                * // Adds a style to the cell if the value entered is invalid
                * $("#element").wijgrid({
                *		invalidCellValue: function (e, args) {
                *			$(args.cell.container()).addClass("ui-state-error");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ invalidCellValue: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridinvalidcellvalue", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IInvalidCellValueEventArgs} args The data with this event.
                */
                this.invalidCellValue = null;
                /** The pageIndexChanging event handler is a function that is called before the page index is changed. This event is cancellable.
                * @event
                * @example
                * // Cancel the event by returning false
                * $("#element").wijgrid({
                *		pageIndexChanging: function (e, args) {
                *			return false;
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ pageIndexChanging: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridpageindexchanging", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IPageIndexChangingEventArgs} args The data with this event.
                */
                this.pageIndexChanging = null;
                /** The pageIndexChanged event handler is a function that is called after the page index is changed, such as when you use the numeric buttons to swtich between pages or assign a new value to the pageIndex option.
                * @event
                * @example
                * // Supply a callback function to handle the pageIndexChanged event:
                * $("#element").wijgrid({
                *		pageIndexChanged: function (e, args) {
                *			alert("The new pageIndex is: " + args.newPageIndex);
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ pageIndexChanged: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridpageindexchanged", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IPageIndexChangedEventArgs} args The data with this event.
                */
                this.pageIndexChanged = null;
                /** The selectionChanged event handler is a function that is called after the selection is changed.
                * @event
                * @example
                * // Get the value of the first cell of the selected row.
                * $("#element").wijgrid({
                *		selectionMode: "singleRow",
                *		selectionChanged: function (e, args) {
                *			alert(args.addedCells.item(0).value());
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ selectionChanged: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridselectionchanged", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.ISelectionChangedEventArgs} args The data with this event.
                */
                this.selectionChanged = null;
                /** The sorting event handler is a function that is called before the sorting operation is started. This event is cancellable.
                * The allowSorting option must be set to "true" for this event to fire.
                * @event
                * @example
                * // Preventing user from sorting the "ID" column.
                * $("#element").wijgrid({
                *		sorting: function (e, args) {
                *			return !(args.column.headerText === "ID");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ sorting: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridsorting", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.ISortingEventArgs} args The data with this event.
                */
                this.sorting = null;
                /** The sorted event handler is a function that is called after the widget is sorted. The allowSorting option must be set to "true" to allow this event to fire.
                * @event
                * @example
                * // The following code handles the sorted event and will give you access to the column and the sort direction
                * $("#element").wijgrid({
                *		sorted: function (e, args) {
                *			alert("Column " + args.column.headerText + " sorted in " + args.sortDirection + " order");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ sorted: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridsorted", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.ISortedEventArgs} args The data with this event.
                */
                this.sorted = null;
                /* events --- */
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
                //			/// <param name="e" type="Object">The jQuery.Event object.</param>
                //			/// <param name="args" type="Object">
                //			/// The data corresponded with this event.
                //			/// args.XMLHttpRequest: the XMLHttpRequest object.
                //			/// args.textStatus: a string describing the error type.
                //			/// args.errorThrown: an exception object.
                //			///
                //			/// Refer to the jQuery.ajax.error event documentation for more details on this arguments.
                //			/// </param>
                //			ajaxError: null,
                /** The dataLoading event handler is a function that is called when the wijgrid loads a portion of data from the underlying datasource. This can be used for modification of data sent to server if using dynamic remote wijdatasource.
                * @event
                * @example
                * // This sample allows you to set the session ID when loading a portion of data from the remote wijdatasource:
                * $("#element").wijgrid({
                *		data: new wijdatasource({
                *			proxy: new wijhttpproxy({
                *				// some code here
                *			})
                *		}),
                *		dataLoading: function (e) {
                *			var dataSource = $(this).wijgrid("option", "data");
                *			dataSource.proxy.options.data.sessionID = getSessionID();
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ dataLoading: function (e) {
                * // some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgriddataloading", function (e) {
                * // some code here
                * });
                * @param {Object} e The jQuery.Event object.
                */
                this.dataLoading = null;
                /** The dataLoaded event handler is a function that is called when data is loaded.
                * @event
                * @example
                * // Display the number of entries found
                * $("#element").wijgrid({
                *		dataLoaded: function (e) {
                *			alert($(this).wijgrid("dataView").count());
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ dataLoaded: function (e) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgriddataloaded", function (e) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                */
                this.dataLoaded = null;
                /** The loading event handler is a function that is called at the beginning of the wijgrid's lifecycle. You can use this event to activate a custom load progress indicator.
                * @event
                * @example
                * // Creating an indeterminate progressbar during loading
                * $("#element").wijgrid({
                *		loading: function (e) {
                *			$("#progressBar").show().progressbar({ value: false });
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ loading: function (e) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridloading", function (e) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                */
                this.loading = null;
                /** The loaded event handler is a function that is called at the end the wijgrid's lifecycle when wijgrid is filled with data and rendered. You can use this event to manipulate the grid html content or to finish a custom load indication.
                * @event
                * @example
                * // The loaded event in the sample below ensures that whatever is selected on load is cleared
                * $("#element").wijgrid({
                *		loaded: function (e) {
                *			$(e.target).wijgrid("selection").clear(); // clear selection
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ loaded: function (e) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridloaded", function (e) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                */
                this.loaded = null;
                /** The rendering event handler is a function that is called when the wijgrid is about to render. Normally you do not need to use this event.
                * @event
                * @example
                * $("#element").wijgrid({
                *		rendering: function (e) {
                *			alert("rendering");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ rendering: function (e) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridrendering", function (e) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                */
                this.rendering = null;
                /** The rendered event handler is a function that is called when the wijgrid is rendered. Normally you do not need to use this event.
                * @event
                * @example
                * $("#element").wijgrid({
                *		rendered: function (e) {
                *			alert("rendered");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ rendered: function (e) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridrendered", function (e) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                */
                this.rendered = null;
            }
            return wijgrid_options;
        })();
        //wijgrid.prototype.options = $.extend(true, {}, wijmoWidget.prototype.options, new wijgrid_options());
        wijgrid.prototype.options = wijmo.grid.extendWidgetOptions(wijmo.wijmoWidget.prototype.options, new wijgrid_options());
        $.wijmo.registerWidget("wijgrid", wijgrid.prototype);
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
    /// <reference path="interfaces.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /** @ignore */
        var SketchObject = (function () {
            function SketchObject(attr) {
                if(attr) {
                    this.__attr = attr;
                }
            }
            SketchObject.prototype.attrs = function () {
                return this.__attr;
            };
            SketchObject.prototype.ensureAttr = function () {
                this.__attr = this.__attr || {
                };
                return this.__attr;
            };
            SketchObject.prototype.attr = function (name, value) {
                if(arguments.length == 0) {
                    return this.__attr;
                }
                if(arguments.length == 1) {
                    return this.__attr ? this.__attr[name] : null;
                } else {
                    this.ensureAttr()[name] = value;
                }
            };
            SketchObject.prototype.style = function (name, newValue) {
                if(arguments.length == 0) {
                    return this.__style;
                } else if(arguments.length == 1) {
                    return this.__style && this.__style[name];
                } else {
                    this.ensureStyle()[name] = newValue;
                }
            };
            SketchObject.prototype.deleteAttr = function (name) {
                if(this.__attr) {
                    delete this.__attr[name];
                }
            };
            SketchObject.prototype.deleteStyle = function (name) {
                if(this.__style) {
                    delete this.__style[name];
                }
            };
            SketchObject.prototype.ensureStyle = /** Creates style object if it does not exist. Then returns it */
            function () {
                this.__style = this.__style || {
                };
                return this.__style;
            };
            return SketchObject;
        })();
        grid.SketchObject = SketchObject;
        /** @ignore */
        var SketchCell = (function (_super) {
            __extends(SketchCell, _super);
            function SketchCell(attr) {
                        _super.call(this, attr);
            }
            SketchCell.prototype.visible = function (newValue) {
                if(arguments.length == 0) {
                    return !(this._visible === false);
                } else {
                    this._visible = newValue;
                }
            };
            return SketchCell;
        })(SketchObject);
        grid.SketchCell = SketchCell;
        /** @ignore */
        /* A sketch cell with a value */
        var ValueCell = (function (_super) {
            __extends(ValueCell, _super);
            function ValueCell(value, attr) {
                        _super.call(this, attr);
                this.value = value;
            }
            return ValueCell;
        })(SketchCell);
        grid.ValueCell = ValueCell;
        /** @ignore */
        /* A sketch cell with raw html */
        var HtmlCell = (function (_super) {
            __extends(HtmlCell, _super);
            function HtmlCell(html, attr) {
                        _super.call(this, attr);
                this.html = html || "";
            }
            HtmlCell.nbsp = function nbsp() {
                return new HtmlCell("&nbsp;", null);
            };
            return HtmlCell;
        })(SketchCell);
        grid.HtmlCell = HtmlCell;
        /** @ignore */
        var SketchRow = (function (_super) {
            __extends(SketchRow, _super);
            function SketchRow(rowType, renderState, attrs) {
                        _super.call(this, attrs);
                this.rowType = rowType;
                this.renderState = renderState;
                this.extInfo = {
                    state: grid.renderStateEx.none
                };
            }
            SketchRow.prototype.isDataRow = /** returns true if this is data row or data alternative row */
            function () {
                return (this.rowType & wijmo.grid.rowType.data) == wijmo.grid.rowType.data;
            };
            SketchRow.prototype.dataItemIndex = function (offset) {
                if (typeof offset === "undefined") { offset = 0; }
                return -1;
            };
            SketchRow.prototype.cellCount = function () {
                return this._cells ? this._cells.length : 0;
            };
            SketchRow.prototype._ensureCells = /** create the cell table if it does not exist yet */
            function () {
                this._cells = this._cells || [];
            };
            SketchRow.prototype.add = /** add a cell to the end */
            function (elem) {
                this._ensureCells();
                this._cells.push(elem);
            };
            SketchRow.prototype.insert = /** insert a cell */
            function (index, elem) {
                this._ensureCells();
                this._cells.splice(index, 0, elem);
            };
            SketchRow.prototype.cell = function (index) {
                return this._cells[index];
            };
            SketchRow.prototype.valueCell = function (index) {
                return this.cell(index);
            };
            SketchRow.prototype.removeAt = /** remove a cell by index */
            function (index) {
                if(!this._cells) {
                    throw "Wrong index";
                }
                this._cells.splice(index, 1);
            };
            SketchRow.prototype.clear = /** remove all cells */
            function () {
            };
            SketchRow.prototype.getRowInfo = function () {
                return {
                    type: this.rowType,
                    state: this.renderState,
                    sectionRowIndex: null,
                    dataRowIndex: null,
                    virtualDataItemIndex: null,
                    dataItemIndex: this.dataItemIndex(),
                    $rows: null,
                    _extInfo: this.extInfo
                };
            };
            return SketchRow;
        })(SketchObject);
        grid.SketchRow = SketchRow;
        /** @ignore */
        var SketchDataRow = (function (_super) {
            __extends(SketchDataRow, _super);
            function SketchDataRow(originalRowIndex, renderState, attrs) {
                        _super.call(this, wijmo.grid.rowType.data | ((originalRowIndex % 2) == 1 ? wijmo.grid.rowType.dataAlt : 0), renderState, attrs);
                this.originalRowIndex = originalRowIndex;
            }
            SketchDataRow.prototype.dataItemIndex = function (offset) {
                if (typeof offset === "undefined") { offset = 0; }
                return offset + this.originalRowIndex;
            };
            SketchDataRow.prototype.isDataRow = function () {
                return true;
            };
            return SketchDataRow;
        })(SketchRow);
        grid.SketchDataRow = SketchDataRow;
        /** @ignore */
        var SketchGroupRow = (function (_super) {
            __extends(SketchGroupRow, _super);
            function SketchGroupRow(header, attrs) {
                var rowType = header ? wijmo.grid.rowType.groupHeader : //"groupHeader"
                wijmo.grid.rowType.groupFooter;// "groupFooter"

                        _super.call(this, rowType, wijmo.grid.renderState.rendering, attrs);
            }
            SketchGroupRow.prototype.getRowInfo = function () {
                var info = _super.prototype.getRowInfo.call(this);
                if(this.groupByValue !== undefined) {
                    info.groupByValue = this.groupByValue;
                }
                return info;
            };
            return SketchGroupRow;
        })(SketchRow);
        grid.SketchGroupRow = SketchGroupRow;
        /** @ignore */
        var SketchTable = (function () {
            function SketchTable() {
                this._table = [];
            }
            SketchTable.prototype.getRawTable = function () {
                return this._table;
            };
            SketchTable.prototype.row = function (index) {
                return this._table[index];
            };
            SketchTable.prototype.valueAt = function (rowIndex, colIndex) {
                return this.row(rowIndex).valueCell(colIndex).value;
            };
            SketchTable.prototype.count = function (newValue) {
                if(typeof newValue === "number") {
                    this._table.length = newValue;
                }
                return this._table.length;
            };
            SketchTable.prototype.add = function (row) {
                this._table.push(row);
            };
            SketchTable.prototype.insert = function (index, row) {
                this._table.splice(index, 0, row);
            };
            SketchTable.prototype.clear = function () {
                this._table.length = 0;
            };
            SketchTable.prototype.removeFirst = function (count) {
                if (typeof count === "undefined") { count = 1; }
                this._table.splice(0, count);
            };
            SketchTable.prototype.removeLast = function (count) {
                if (typeof count === "undefined") { count = 1; }
                this._table.splice(this._table.length - count, count);
            };
            SketchTable.prototype.replace = function (index, row) {
                var oldRows = this._table.splice(index, 1, row);
                if(oldRows && oldRows.length && row) {
                    row.extInfo = oldRows[0].extInfo;
                }
            };
            SketchTable.prototype.updateIndexes = function () {
                for(var i = 0; i < this._table.length; i++) {
                    var sketchRow = this._table[i];
                    if(this._table[i].isDataRow()) {
                        (sketchRow).originalRowIndex = i;
                    }
                }
            };
            SketchTable.prototype.isLazy = function () {
                return false;
            };
            SketchTable.prototype.ensureNotLazy = function () {
            };
            return SketchTable;
        })();
        grid.SketchTable = SketchTable;
        /** @ignore */
        var LazySketchTable = (function (_super) {
            __extends(LazySketchTable, _super);
            function LazySketchTable(source) {
                        _super.call(this);
                this.mIsLazy = true;
                this.pageSize = 30;
                if(source == null) {
                    throw "Row source is null";
                }
                this.mSource = source;
                this._table.length = source.count();
            }
            LazySketchTable.prototype.isLazy = function () {
                return this.mIsLazy;
            };
            LazySketchTable.prototype.ensureNotLazy = /** Convert to not lazy and create rows if they don't exist*/
            function () {
                if(!this.isLazy()) {
                    return;
                }
                this.ensureRange();
                this.mIsLazy = false;
            };
            LazySketchTable.prototype.invalidate = function () {
                this._table = new Array(this.mSource.count());
                if(!this.isLazy()) {
                    this.updateRange();
                }
            };
            LazySketchTable.prototype.row = function (index) {
                if(!_super.prototype.row.call(this, index)) {
                    this.ensureRange(Math.max(0, index - this.pageSize / 2), this.pageSize);
                }
                return _super.prototype.row.call(this, index);
            };
            LazySketchTable.prototype.ensureRange = /** Create sketch rows if the don't exist yet.
            * Cannot create anything other than data rows.
            * Requires source
            */
            function (start, length) {
                if (typeof start === "undefined") { start = 0; }
                if (typeof length === "undefined") { length = this._table.length - start; }
                if(!this.isLazy()) {
                    return;
                }
                if(start < 0) {
                    throw "Wrong range start";
                }
                this._table.length = this.mSource.count();
                if(this._table.length == 0) {
                    if(length > 0) {
                        throw "Wrong range length";
                    }
                    return;
                }
                // skip existing rows in the beginning
                while(start < this._table.length && this._table[start]) {
                    start++;
                }
                // is there anything to create?
                if(start >= this._table.length) {
                    return;
                }
                var last = Math.min(start + length - 1, this._table.length - 1);
                // skip existing rows in the end
                while(last >= start && this._table[last]) {
                    last--;
                }
                length = last - start + 1;
                if(length > 0) {
                    this.updateRange(start, length);
                }
            };
            LazySketchTable.prototype.updateRange = function (start, length) {
                if (typeof start === "undefined") { start = 0; }
                if (typeof length === "undefined") { length = this._table.length - start; }
                if(this.mSource == null) {
                    throw "Cannot create sketch row because source is null";
                }
                this.mSource.getRange(start, length, this._table, start);
            };
            return LazySketchTable;
        })(SketchTable);
        grid.LazySketchTable = LazySketchTable;
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
    /// <reference path="../../../Base/jquery.wijmo.widget.ts"/>
    /// <reference path="interfaces.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /** @widget */
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
                this.element.addClass(wijgrid.options.wijCSS.widget + " " + wijmo.grid.wijgrid.CSS.c1basefield + " " + wijgrid.options.wijCSS.stateDefault);
                if(this.options.disabled) {
                    this.disable();
                }
                if(wijgrid.options.allowColMoving) {
                    wijgrid._UIDragndrop(true).attach(this);
                }
            };
            c1basefield.prototype._init = function () {
                this.element.wrapInner("<div class='" + wijmo.grid.wijgrid.CSS.cellContainer + " " + this._owner().options.wijCSS.wijgridCellContainer + "'></div>");
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
                if(wijgrid && wijgrid._UIDragndrop()) {
                    wijgrid._UIDragndrop().detach(this);
                }
                wijmo.grid.remove$dataByPrefix(this.element, this._data$prefix);
                var defCSS = wijmo.grid.wijgrid.CSS, wijCSS = wijgrid.options.wijCSS;
                this.element.removeClass(wijCSS.widget + " " + defCSS.c1basefield + " " + wijCSS.c1basefield + " " + wijCSS.stateDefault).html(this.element.find("." + defCSS.headerCellText).html())// restore initial cell content
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
                return $container.html(this.options.headerText || "&nbsp;");// html(value) returns "" if value is undefined

            };
            c1basefield.prototype._decorateHeaderContent = function ($container) {
                return $container.wrapInner("<span class=\"" + wijmo.grid.wijgrid.CSS.headerCellText + " " + this._owner().options.wijCSS.wijgridHeaderCellText + "\" />");
            };
            c1basefield.prototype._refreshHeaderCell = function () {
                var $container = this.element.children("." + wijmo.grid.wijgrid.CSS.cellContainer).empty();
                this._createHeaderContent($container);
                this._decorateHeaderContent($container);
            };
            c1basefield.prototype._isDestroyed = function () {
                return this._destroyed;
            };
            return c1basefield;
        })(wijmo.wijmoWidget);
        grid.c1basefield = c1basefield;
        c1basefield.prototype._data$prefix = "c1basefield";
        var c1basefield_options = (function () {
            function c1basefield_options() {
                /** A value indicating whether the column can be moved.
                * @example
                * $("#element").wijgrid({ columns: [ { allowMoving: true } ] });
                */
                this.allowMoving = true;
                /** A value indicating whether the column can be sized.
                * @example
                * $("#element").wijgrid({ columns: [ { allowSizing: true } ] });
                */
                this.allowSizing = true;
                /** This function is called each time wijgrid needs to create cell content.
                * This occurs when rows are being rendered or cell editing is about to finish.
                * You can use it to customize cell content.
                * @example
                * // Add an image which URL is obtained from the "Url" data field to the column cells.
                * $("#demo").wijgrid({
                *		data: [
                *			{ ID: 0, Url: "/images/0.jpg" },
                *			{ ID: 1, Url: "/images/1.jpg" }
                *		],
                *		columns: [
                *			{},
                *			{
                *				cellFormatter: function (args) {
                *					if (args.row.type & wijmo.grid.rowType.data) {
                *						args.$container
                *							.empty()
                *							.append($("<img />")
                *								.attr("src", args.row.data.Url));
                *
                *						return true;
                *					}
                *				}
                *			}
                *		]
                * });
                * @type {Function}
                * @param {wijmo.grid.IC1BaseFieldCellFormatterArgs} args The data with this function.
                * @returns {Boolean} True if container content has been changed and wijgrid should not apply the default formatting to the cell.
                * @remarks
                * Important: cellFormatter should not alter content of header and filter row cells container.
                */
                this.cellFormatter = undefined;
                /** A value indicating the key of the data field associated with a column.
                * If an array of objects is used as a datasource for wijgrid, this should be string value,
                * otherwise this should be an integer determining an index of the field in the datasource.
                * @type {String|Number}
                * @example
                * $("#element").wijgrid({ columns: [{ dataKey: "ProductID" }]});
                */
                this.dataKey = undefined;
                /** Determines whether to use number type column width as the real width of the column.
                * @example
                * $("#element").wijgrid({ columns: [{ ensurePxWidth: true }]});
                * @remarks
                * If this option is set to true, wijgrid will use the width option of the column widget.
                * If this option is undefined, wijgrid will refer to the ensureColumnsPxWidth option.
                */
                this.ensurePxWidth = undefined;
                /** Gets or sets the footer text.
                * The text may include a placeholder: "{0}" is replaced with the aggregate.
                * @example
                * $("#element").wijgrid({ columns: [{ footerText: "footer" }]});
                * @remarks
                * If the value is undefined the footer text will be determined automatically depending on the type of the datasource:
                * DOM table - text in the footer cell.
                */
                this.footerText = undefined;
                /** Gets or sets the header text.
                * @example
                * $("#element").wijgrid({ columns: [ { headerText: "column0" } ] });
                * @remarks
                * If the value is undefined the header text will be determined automatically depending on the type of the datasource:
                * DOM table - text in the header cell.
                * Array of objects - dataKey (name of the field associated with column).
                * Two-dimensional array - dataKey (index of the field associated with column).
                */
                this.headerText = undefined;
                /** Gets or sets the text alignment of data cells. Possible values are "left", "right", "center".
                * @example
                * $("#element").wijgrid({ columns: [{ textAligment: "right" }]});
                */
                this.textAlignment = undefined;
                /** A value indicating whether column is visible.
                * @example
                * $("#element").wijgrid({ columns: [{ visible: true }]});
                */
                this.visible = true;
                /** Determines the width of the column.
                * @type {String|Number}
                * @example
                * $("#element").wijgrid({ columns: [ { width: 150 } ] });
                * $("#element").wijgrid({ columns: [ { width: "10%" } ]});
                * @remarks
                * The option could either be a number of string.
                * Use number to specify width in pixel, use string to specify width in percentage.
                * By default, wijgrid emulates the table element behavior when using number as width. This means wijgrid may not have the exact width specified. If exact width is needed, please set ensureColumnsPxWidth option of wijgrid to true.
                */
                this.width = undefined;
            }
            return c1basefield_options;
        })();
        grid.c1basefield_options = c1basefield_options;
        ;
        //c1basefield.prototype.options = $.extend(true, {}, wijmoWidget.prototype.options, new c1basefield_options());
        c1basefield.prototype.options = wijmo.grid.extendWidgetOptions(wijmo.wijmoWidget.prototype.options, new c1basefield_options());
        $.wijmo.registerWidget("c1basefield", c1basefield.prototype);
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
    /// <reference path="c1basefield.ts"/>
    /// <reference path="interfaces.ts"/>
    /// <reference path="../../../wijinput/jquery.wijmo.wijinputdate.ts"/>
    /// <reference path="../../../wijinput/jquery.wijmo.wijinputtext.ts"/>
    /// <reference path="../../../wijinput/jquery.wijmo.wijinputnumber.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /** @widget */
        var c1field = (function (_super) {
            __extends(c1field, _super);
            function c1field() {
                _super.apply(this, arguments);

            }
            c1field.prototype._create = function () {
                _super.prototype._create.apply(this, arguments);
                var wijgrid = this._owner();
                this.element.addClass(wijgrid.options.wijCSS.widget + " " + wijmo.grid.wijgrid.CSS.c1field);
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
                        case "text":
                            if(this.$filterEditor.data("wijmo-wijinputtext")) {
                                this.$filterEditor.wijinputtext("destroy");
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
                this.element.removeClass(wijgrid.options.wijCSS.widget + " " + wijmo.grid.wijgrid.CSS.c1field);
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
            c1field.prototype._postset_disabled = function (value, oldValue) {
                if(this.$filterEditor) {
                    $.each(this.$filterEditor.data(), function (key, widget) {
                        // update the disabled option of the filter editor
                        if(widget && widget.widgetName && widget.option) {
                            widget.option("disabled", value);
                        }
                    });
                }
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
            c1field.prototype._isSortable = function () {
                return wijmo.grid.validDataKey(this.options.dataKey);//return this.options.dataIndex >= 0;

            };
            c1field.prototype._isSortableUI = function () {
                var grid = this._owner();
                return grid && grid.options.allowSorting && this.options.allowSort && this._isSortable();
            };
            c1field.prototype._decorateHeaderContent = function ($container) {
                var wijgrid = this._owner(), defCSS = wijmo.grid.wijgrid.CSS, wijCSS = wijgrid.options.wijCSS;
                if(!this._isSortable()) {
                    _super.prototype._decorateHeaderContent.apply(this, arguments)// plain text
                    ;
                } else {
                    if(this._isSortableUI()) {
                        $container.wrapInner(// clickable text
                        "<a class=\"" + defCSS.headerCellText + " " + wijCSS.wijgridHeaderCellText + "\" href=\"#\" role=\"button\" />").children("a").bind("click." + this.widgetName, this, $.proxy(this._onHrefClick, this));
                    } else {
                        _super.prototype._decorateHeaderContent.apply(this, arguments)// plain text
                        ;
                    }
                    // icons
                    var baseSortCSS = defCSS.headerCellSortIcon + " " + wijCSS.wijgridHeaderCellSortIcon + " " + wijCSS.icon;
                    switch(this.options.sortDirection) {
                        case // sorting icon
                        "ascending":
                            $container.append($("<span class=\"" + baseSortCSS + " " + wijCSS.iconArrowUp + "\"></span>"));
                            break;
                        case "descending":
                            $container.append($("<span class=\"" + baseSortCSS + " " + wijCSS.iconArrowDown + "\"></span>"));
                            break;
                    }
                }
            };
            c1field.prototype._prepareFilterCell = function () {
                var filterCellIndex = this.options.visLeavesIdx, wijgrid = this._owner(), filterCell = null, dataValue, editorOptions, self = this, editorType, inputType = wijmo.grid.HTML5InputSupport.getDefaultInputType(wijgrid._isMobileEnv(), this.options), wijCSS = wijgrid.options.wijCSS, defCSS = wijmo.grid.wijgrid.CSS;
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
                    dataValue = wijgrid.parse(this.options, wijmo.grid.filterHelper.getSingleValue(this.options.filterValue));
                    // set default value
                    if(dataValue === null || dataValue === "undefined") {
                        switch(wijmo.grid.getDataType(this.options)) {
                            case "boolean":
                                dataValue = false;
                                break;
                            case "number":
                            case "currency":
                                dataValue = 0;
                                break;
                            case "datetime":
                                dataValue = new Date()// current date
                                ;
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
                            if(test && test[2]) {
                                return parseInt(test[2], 10);
                            }
                            test = /^(d){1}(\d*)$/.exec(pattern);
                            if(test) {
                                return 0;// left padding is not supported by wijinputnumber

                            }
                            return 2;
                        })(this.options.dataFormatString),
                        imeMode: this.options.imeMode,
                        triggerMouseUp: function (e) {
                            if(wijgrid) {
                                $.each(wijgrid.columns(), function (index, wijInstance) {
                                    if(wijInstance.$dropDownFilterList) {
                                        // close the dropdown list
                                        wijInstance._removeDropDownFilterList();
                                    }
                                });
                            }
                        }
                    };
                    this.$filterEditor.bind("keypress." + this.widgetName, $.proxy(this._onFilterEditorKeyPress, this));
                    // create editor
                    switch(editorType = this._getInputEditorType(this.options)) {
                        case "date":
                            if(inputType === "text") {
                                this.$filterEditor.wijinputdate($.extend(editorOptions, {
                                    date: dataValue,
                                    dateFormat: this.options.dataFormatString || undefined,
                                    showTrigger: true
                                }));
                            } else {
                                // html5 editor
                                this._createHtmlEditor(this.$filterEditor, inputType, wijmo.grid.HTML5InputSupport.toStr(dataValue, inputType));
                            }
                            break;
                        case "text":
                            this.$filterEditor.wijinputtext($.extend(editorOptions, {
                                text: dataValue + ""
                            }));
                            break;
                        case "numberCurrency":
                            this.$filterEditor.wijinputnumber($.extend(editorOptions, {
                                type: "currency",
                                value: dataValue
                            }));
                            break;
                        case "numberNumber":
                            if(inputType === "text") {
                                this.$filterEditor.wijinputnumber($.extend(editorOptions, {
                                    value: dataValue
                                }));
                            } else {
                                // html5 editor
                                this._createHtmlEditor(this.$filterEditor, inputType, wijmo.grid.HTML5InputSupport.toStr(dataValue, inputType));
                            }
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
                    filterCell.find("." + defCSS.filterTrigger).attr(// filter button
                    {
                        "role": "button",
                        "aria-haspopup": "true"
                    }).bind("mouseenter." + this.widgetName, function (e) {
                        if(!self.options.disabled) {
                            $(this).addClass(wijCSS.stateDefault + " " + wijCSS.stateHover);
                        }
                    }).bind("mouseleave." + this.widgetName, function (e) {
                        if(!self.options.disabled) {
                            $(this).removeClass(wijCSS.stateDefault + " " + wijCSS.stateHover + " " + wijCSS.stateActive);
                        }
                    }).bind("mouseup." + this.widgetName, this, function (e) {
                        if(!self.options.disabled) {
                            $(this).removeClass(wijCSS.stateDefault + " " + wijCSS.stateActive);
                        }
                    }).bind("mousedown." + this.widgetName, {
                        column: this
                    }, $.proxy(this._onFilterBtnClick, this)).bind("click." + this.widgetName, function (e) {
                        e.preventDefault();
                    })// prevent # being added to url.
                    ;
                }
            };
            c1field.prototype._createHtmlEditor = function (input, inputType, value) {
                var defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._owner().options.wijCSS;
                (input[0]).type = inputType// use it instead of .attr("type", inputType) to avoid the "'type' property/attribute cannot be changed." exception.
                ;
                return input.addClass(wijCSS.stateDefault).wrap("<span class=\"" + defCSS.filterNativeHtmlEditorWrapper + " " + wijCSS.wijgridFilterNativeHtmlEditorWrapper + "\"></span").val(value);
            };
            c1field.prototype._onFilterBtnClick = function (e) {
                var _this = this;
                var column = e.data.column, maxItemsCount = 8, wijgrid = column._owner(), filterOpLowerCase, applicableFilters, args, items, width, eventUID;
                if(column.options.disabled) {
                    return false;
                }
                if(column.$dropDownFilterList) {
                    // close the dropdown list
                    column._removeDropDownFilterList();
                    return false;
                }
                (e.target).focus()//TFS #24253: In IE9, wijgrid is distorted on opening filter drop-down in a scrollable grid
                ;
                filterOpLowerCase = wijmo.grid.filterHelper.getSingleOperatorName(column.options.filterOperator).toLowerCase();
                applicableFilters = wijgrid.getFilterOperatorsByDataType(wijmo.grid.getDataType(column.options));
                args = {
                    operators: $.extend(true, [], applicableFilters),
                    column: // make a copy, so user can localize operators without affecting other controls
                    column.options
                };
                wijgrid._onFilterOperatorsListShowing(args);
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
                column.$dropDownFilterList = $("<div />").addClass(wijmo.grid.wijgrid.CSS.filterList + " " + wijgrid.options.wijCSS.wijgridFilterList).appendTo(document.body).wijlist({
                    autoSize: true,
                    maxItemsCount: maxItemsCount,
                    selected: function (e, data) {
                        var filterValue = _this._getFilterValueFromEditor(column);
                        column._removeDropDownFilterList();
                        wijgrid._handleFilter(column, data.item.value, filterValue);
                    }
                });
                // ** zIndex
                column.$dropDownFilterList.css("z-index", wijmo.grid.getZIndex(wijgrid.outerDiv, 9999))// 9999 is the default value
                ;
                // zIndex **
                column.$dropDownFilterList.wijlist("setItems", items).wijlist("renderList");
                width = column.$dropDownFilterList.width() | 150;
                column.$dropDownFilterList.width(items.length > maxItemsCount ? width + 20 : width).wijlist("refreshSuperPanel").position({
                    of: $(e.currentTarget),
                    my: "left top",
                    at: "left bottom"
                });
                (column.$dropDownFilterList).$button = $(e.currentTarget);
                eventUID = (column.$dropDownFilterList).eventUID = wijmo.grid.getUID();
                $(document).bind("mousedown." + column.widgetName + "." + eventUID, {
                    column: column
                }, column._onDocMouseDown);
            };
            c1field.prototype._onFilterEditorKeyPress = function (e) {
                if(e && (e.which === 13)) {
                    //if (e && (e.which === wijmo.getKeyCodeEnum().ENTER))
                                        var wijgrid = this._owner(), filterValue = this._getFilterValueFromEditor(this), filterOperator = (this.options.filterOperator || "").toLowerCase();
                    if(!filterValue) {
                        // empty value - reset filtering
                        filterValue = undefined;
                        filterOperator = "nofilter";
                    } else {
                        if(!filterOperator || (filterOperator === "nofilter")) {
                            // no filter operator - use default
                            filterOperator = (wijmo.grid.getDataType(this.options) === "string") ? "contains" : "equals";
                        }
                    }
                    this._removeDropDownFilterList();
                    wijgrid._handleFilter(this, filterOperator, filterValue);
                }
            };
            c1field.prototype._onDocMouseDown = function (e) {
                var $target = $(e.target), defCSS = wijmo.grid.wijgrid.CSS, $filterList = $target.parents("." + defCSS.filterList + ":first"), $filterButton = $target.is("." + defCSS.filterTrigger) ? $target : $target.parents("." + defCSS.filterTrigger + ":first");
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
                    var wijgrid = args.data._owner();
                    wijgrid._handleSort(args.data.options, args.ctrlKey);
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
            c1field.prototype._getInputEditorType = // "text", "date", "numberNumber", "numberPercent", "numberCurrency"
            function (column) {
                switch(wijmo.grid.getDataType(column)) {
                    case "number":
                        return (column.dataFormatString && column.dataFormatString.indexOf("p") === 0) ? "numberPercent" : "numberNumber";
                    case "currency":
                        return "numberCurrency";
                    case "datetime":
                        return "date";
                    default:
                        return "text";
                }
            };
            c1field.prototype._getFilterValueFromEditor = function (column) {
                var wijgrid = column._owner(), inputType = wijmo.grid.HTML5InputSupport.getDefaultInputType(wijgrid._isMobileEnv(), column.options), filterValue;
                switch(column._getInputEditorType(column.options)) {
                    case "date":
                        if(inputType === "text") {
                            filterValue = column.$filterEditor.wijinputdate("option", "date") || new Date()// current date
                            ;
                        } else {
                            filterValue = wijmo.grid.HTML5InputSupport.parse(column.$filterEditor.val(), inputType) || new Date();
                        }
                        break;
                    case "text":
                        filterValue = column.$filterEditor.wijinputtext("option", "text");
                        break;
                    case "numberNumber":
                        if(inputType !== "text") {
                            filterValue = wijmo.grid.HTML5InputSupport.parse(column.$filterEditor.val(), inputType) || 0;
                            break;
                        }
                        // fall through
                                            case "numberCurrency":
                        filterValue = column.$filterEditor.wijinputnumber("option", "value");
                        break;
                    case "numberPercent":
                        filterValue = column.$filterEditor.wijinputnumber("option", "value") / 100;
                        break;
                }
                return filterValue;
            };
            return c1field;
        })(grid.c1basefield);
        grid.c1field = c1field;
        var c1field_options = (function (_super) {
            __extends(c1field_options, _super);
            function c1field_options() {
                _super.apply(this, arguments);

                /** Causes the grid to calculate aggregate values on the column and place them in the column footer cell or group header and footer rows.
                * Possible values are: "none", "count", "sum", "average", "min", "max", "std", "stdPop", "var", "varPop" and "custom".
                * @example
                * $("#element").wijgrid({ columns: [{ aggregate: "count" }]});
                * @remarks
                * Possible values are:
                * "none": no aggregate is calculated or displayed.
                * "count": count of non-empty values.
                * "sum": sum of numerical values.
                * "average": average of the numerical values.
                * "min": minimum value (numerical, string, or date).
                * "max": maximum value (numerical, string, or date).
                * "std": standard deviation (using formula for Sample, n-1).
                * "stdPop": standard deviation (using formula for Population, n).
                * "var": variance (using formula for Sample, n-1).
                * "varPop": variance (using formula for Population, n).
                * "custom": custom value (causing grid to throw groupAggregate event).
                *
                * If the showFooter option is off or grid does not contain any groups, setting the "aggregate" option has no effect.
                */
                this.aggregate = "none";
                /** A value indicating whether column can be sorted.
                * @example
                * $("#element").wijgrid({ columns: [{ allowSort: true }] });
                */
                this.allowSort = true;
                /** Column data type. Used to determine the rules for sorting, grouping, aggregate calculation, and so on.
                * Possible values are: "string", "number", "datetime", "currency" and "boolean".
                * @example
                * $("#element").wijgrid({ columns: [{ dataType: "string" }]});
                * @remarks
                * Possible values are:
                * "string": if using built-in parser any values are acceptable; "&nbsp;" considered as an empty string, nullString as null.
                * "number": if using built-in parser only numeric values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
                * "datetime": if using built-in parser only date-time values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
                * "currency": if using built-in parser only numeric and currency values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
                * "boolean": if using built-in parser only "true" and "false" (case-insensitive) values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
                */
                this.dataType = undefined;
                /** Data converter that is able to translate values from a string representation to column data type and back.
                * @example
                * var myBoolParser = {
                *		parseDOM: function (value, culture, format, nullString) {
                *			return this.parse(value.innerHTML, culture, format, nullString);
                *		},
                *		parse: function (value, culture, format, nullString) {
                *			if (typeof (value) === "boolean")  return value;
                *
                *			if (!value || (value === "&nbsp;") || (value === nullString)) {
                *				return null;
                *			}
                *
                *			switch (value.toLowerCase()) {
                *				case "on": return true;
                *				case "off": return false;
                *			}
                *
                *			return NaN;
                *		},
                *		toStr: function (value, culture, format, nullString) {
                *			if (value === null)  return nullString;
                *				return (value) ? "on" : "off";
                *			}
                *		}
                * }
                *
                * $("#element").wijgrid({ columns: [ { dataType: "boolean", dataParser: myBoolParser } ] });
                * @remarks
                * If undefined, than the built-in parser for supported datatypes will be used.
                */
                this.dataParser = undefined;
                /** A pattern used for formatting and parsing column values.
                * @example
                * $("#element").wijgrid({
                *		columns: [
                *			{ dataType: "currency" },
                *			{ dataType: "number" },
                *			{ dataType: "number", dataFormatString: "p0" }
                *		]
                * });
                * @remarks
                * The default value is undefined ("n" pattern will be used for "number" dataType, "d" for "datetime", "c" for "currency").
                * Please see the https://github.com/jquery/globalize for a full explanation and additional values.
                */
                this.dataFormatString = undefined;
                /** A value indicating whether data values are HTML-encoded before they are displayed in a cell.
                * @example
                * $("#element").wijgrid({
                *		data: [
                *			[0, "<b>value</b>"],
                *			[1, "&amp;"],
                *		],
                *		columns: [
                *			{ headerText: "ID" },
                *			{ headerText: "Value", encodeHtml: true }
                *		]
                * });
                */
                this.encodeHtml = false;
                /** An operations set for filtering. Must be either one of the embedded operators or custom filter operator.
                * Operator names are case insensitive.
                *
                * @example
                * $("#element").wijgrid({ columns: [{ dataType: "number", filterOperator: "Equals", filterValue: 0 }]});
                * @remarks
                * Embedded filter operators include:
                * "NoFilter": no filter.
                * "Contains": applicable to "string" data type.
                * "NotContain": applicable to "string" data type.
                * "BeginsWith": applicable to "string" data type.
                * "EndsWith": applicable to "string" data type.
                * "Equals": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                * "NotEqual": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                * "Greater": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                * "Less": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                * "GreaterOrEqual": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                * "LessOrEqual": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                * "IsEmpty": applicable to "string".
                * "NotIsEmpty": applicable to "string".
                * "IsNull": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                * "NotIsNull": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                *
                * Full option value is:
                *		[filterOperartor1, ..., filterOperatorN]
                * where each filter item is an object of the following kind:
                *		{ name: <operatorName>, condition: "or"|"and" }
                * where:
                *		name: filter operator name.
                *		condition: logical condition to other operators, "or" is by default.
                * Example:
                *		filterOperator: [ { name: "Equals" }, { name: "NotEqual", condition: "and" } ]
                * It is possible to use shorthand notation, the following statements are equivalent:
                *		filterOperator: [ { name: "Equals" }, { name: "BeginsWith" } ]
                *		filterOperator: [ "Equals", "BeginsWith" ]
                * In the case of a single operator option name may contain only filter operator name, the following statements are equivalent:
                *		filterOperator: [ { name: "Equals" } ]
                *		filterOperator: [ "Equals" ]
                *		filterOperator: "Equals"
                *
                * Note: wijgrid built-in filter editors do not support multiple filter operators.
                *
                */
                this.filterOperator = "nofilter";
                /** A value set for filtering.
                * @example
                * $("#element").wijgrid({ columns: [{ dataType: "number", filterOperator: "Equals", filterValue: 0 }]});
                * @remarks
                * Full option value is:
                *		[filterValue1, ..., filterValueN]
                * where each item is a filter value for the corresponding filter operator. Example:
                *		filterValue: [0, "a", "b"]
                *
                * Built-in filter operators support array of values as an argument. Example:
                *		filterOperator: ["Equals", "BeginsWith"]
                *		filterValue: [[0, 1, 2], "a"]
                * As a result of filtering all the records having 0, 1, 2, or starting with "a" will be fetched.
                *
                * Shorthand notation allows omitting square brackets, the following statements are equivalent:
                *		filterValue: ["a"]
                *		filterValue: [["a"]]
                *		filterValue: "a"
                *
                * Note: wijgrid built-in filter editors do not support multiple filter values.
                */
                this.filterValue = undefined;
                /** Used to customize the appearance and position of groups.
                * @example
                * $("#element").wijgrid({ columns: [{ groupInfo: { position: "header" }}]});
                */
                this.groupInfo = {
                    expandInfo: /** @ignore */
                    [],
                    level: // infrastructure
                    /** @ignore */
                    undefined,
                    groupSingleRow: // infrastructure
                    true,
                    collapsedImageClass: undefined,
                    expandedImageClass: /*$.wijmo.wijCSS.iconArrowRight*/
                    undefined,
                    position: /*$.wijmo.wijCSS.iconArrowRightDown*/
                    "none",
                    outlineMode: "startExpanded",
                    headerText: undefined,
                    footerText: undefined
                };
                /**
                * Controls the state of the input method editor for text fields.
                * Possible values are: "auto", "active", "inactive", "disabled".
                * Please refer to https://developer.mozilla.org/en-US/docs/Web/CSS/ime-mode for more info.
                * @example
                * $("#element").wijgrid({ columns: [{ imeMode: "auto" }]});
                */
                this.imeMode = "auto";
                /**
                * Determines the type of html editor for filter and cells.
                * Possible values are: "number", "date", "datetime", "datetime-local", "month", "time", "text".
                * @example
                * $("#element").wijgrid({ columns: [{ inputType: "text" }]});
                * @remarks
                * If the value is set then input type element is used with "type" attribute set to the value. If the value is not set then:
                *  - in desktop environment a "text" input element is used as the editor.
                *  - in mobile environment a "number" input element is used for columns having "number" and "currency" dataType; for columns where dataType = "datetime" a "datetime" input element is used, otherwise a "text" input element is shown.
                */
                this.inputType = undefined;
                /** A value indicating whether the cells in the column can be edited.
                * @example
                * $("#element").wijgrid({ columns: [ { readOnly: false } ] });
                */
                this.readOnly = false;
                /** Determines whether rows are merged. Possible values are: "none", "free" and "restricted".
                * @example
                * $("#element").wijgrid({ columns: [{ rowMerge: "none" }]});
                * @remarks
                * Possible values are:
                * "none": no row merging.
                * "free": allows row with identical text to merge.
                * "restricted": keeps rows with identical text from merging if rows in the previous column are merged.
                */
                this.rowMerge = "none";
                /** A value indicating whether filter editor will be shown in the filter row.
                * @example
                * $("#element").wijgrid({ columns: [{ showFilter: true }]});
                */
                this.showFilter = true;
                /** Determines the sort direction. Possible values are: "none", "ascending" and "descending".
                * @example
                * $("#element").wijgrid({ columns: [{ sortDirection: "none" }]});
                * @remarks
                * Possible values are:
                * "none": no sorting.
                * "ascending": sort from smallest to largest.
                * "descending": sort from largest to smallest.
                */
                this.sortDirection = "none";
                /** A value indicating whether null value is allowed during editing.
                * @example
                * $("#element").wijgrid({ columns: [{ valueRequired: false }]});
                */
                this.valueRequired = false;
            }
            return c1field_options;
        })(grid.c1basefield_options);
        grid.c1field_options = c1field_options;
        ;
        //c1field.prototype.options = $.extend(true, {}, c1basefield.prototype.options, new c1field_options());
        c1field.prototype.options = wijmo.grid.extendWidgetOptions(grid.c1basefield.prototype.options, new c1field_options());
        $.wijmo.registerWidget("c1field", $.wijmo.c1basefield, c1field.prototype);
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
    /// <reference path="c1field.ts"/>
    /// <reference path="c1basefield.ts"/>
    /// <reference path="interfaces.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /** @widget */
        var c1band = (function (_super) {
            __extends(c1band, _super);
            function c1band() {
                _super.apply(this, arguments);

            }
            c1band.prototype._create = function () {
                _super.prototype._create.apply(this, arguments);
                var wijgrid = this._owner();
                this.element.addClass(wijgrid.options.wijCSS.widget + " " + wijmo.grid.wijgrid.CSS.c1band);
            };
            c1band.prototype._canDropTo = function (wijField) {
                if(_super.prototype._canDropTo.apply(this, arguments)) {
                    //band can't be dropped into group area
                    return !(wijField instanceof $.wijmo.c1groupedfield);
                }
                return false;
            };
            return c1band;
        })(grid.c1basefield);
        grid.c1band = c1band;
        var c1band_options = (function (_super) {
            __extends(c1band_options, _super);
            function c1band_options() {
                _super.apply(this, arguments);

                /**
                * Gets a array of objects representing the band columns.
                * @example
                * $("#element").wijgrid({
                *   columns: [{
                *      headerText: "Band",
                *      columns: [
                *         { headerText: "ID" },
                *         { headerText: "Name" }
                *      ]
                *   }]
                * });
                */
                this.columns = [];
            }
            return c1band_options;
        })(grid.c1field_options);
        ;
        //c1band.prototype.options = $.extend(true, {}, c1basefield.prototype.options, new c1band_options());
        c1band.prototype.options = wijmo.grid.extendWidgetOptions(grid.c1basefield.prototype.options, new c1band_options());
        $.wijmo.registerWidget("c1band", $.wijmo.c1basefield, c1band.prototype);
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
    /// <reference path="c1basefield.ts"/>
    /// <reference path="interfaces.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /** @ignore */
        var c1groupedfield = (function (_super) {
            __extends(c1groupedfield, _super);
            function c1groupedfield() {
                _super.apply(this, arguments);

            }
            c1groupedfield.prototype._create = function () {
                var wijgrid = $.data(this.element[0], "wijgridowner"), defCSS = wijmo.grid.wijgrid.CSS, wijCSS = wijgrid.options.wijCSS;
                this._field("owner", wijgrid);
                wijmo.grid.widgetName(this.element[0], this.widgetFullName);
                this._destroyed = false;
                this.element.addClass(defCSS.groupAreaButton + " " + wijCSS.wijgridGroupAreaButton + " " + wijCSS.stateDefault + " " + wijCSS.cornerAll);
                if(this.options.disabled) {
                    this.disable();
                }
                if(wijgrid.options.allowColMoving) {
                    wijgrid._UIDragndrop(true).attach(this);
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
            c1groupedfield.prototype._isSortable = function () {
                return wijmo.grid.validDataKey(this.options.dataKey);//return this.options.dataIndex >= 0;

            };
            c1groupedfield.prototype._isSortableUI = function () {
                var grid = this._owner();
                return grid && grid.options.allowSorting && this.options.allowSort && this._isSortable();
            };
            c1groupedfield.prototype._refreshHeaderCell = function () {
                var defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._owner().options.wijCSS, $closeButton = $("<span class=\"" + defCSS.groupAreaButtonClose + " " + wijCSS.wijgridGroupAreaButtonClose + " " + wijCSS.stateDefault + " " + wijCSS.cornerAll + "\"><span class=\"" + wijCSS.icon + " " + wijCSS.iconClose + "\"></span></span>").bind(//.css("cursor", "pointer") // always show pointer
                "click." + this.widgetName, this, this._onCloseClick);
                this.element.html(this.options.headerText || "").prepend(// html(value) returns "" if value is undefined
                $closeButton);
                if(this._isSortableUI()) {
                    this.element.bind("click." + this.widgetName, this, $.proxy(this._onHrefClick, this));
                } else {
                    //this.element.css("cursor", "default");
                                    }
                if(this._isSortable()) {
                    // sorting icon
                    var generalSortClass = defCSS.groupAreaButtonSort + " " + wijCSS.wijgridGroupAreaButtonSort + " " + wijCSS.icon;
                    switch(this.options.sortDirection) {
                        case "ascending":
                            this.element.append($("<span class=\"" + generalSortClass + " " + wijCSS.iconArrowUp + "\"></span>"));
                            break;
                        case "descending":
                            this.element.append($("<span class=\"" + generalSortClass + " " + wijCSS.iconArrowDown + "\"></span>"));
                            break;
                    }
                }
            };
            c1groupedfield.prototype._onCloseClick = function (args) {
                var options = args.data.options;
                if(!options.disabled) {
                    (args.data._owner())._handleUngroup(args.data.options.travIdx);
                }
                return false;
            };
            c1groupedfield.prototype._onHrefClick = function (args) {
                var wijgrid = args.data._owner(), options = args.data.options, column;
                if(!(options).disabled && options.allowSort) {
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
        grid.c1groupedfield = c1groupedfield;
        c1groupedfield.prototype._data$prefix = "c1groupedfield";
        c1groupedfield.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, {
            wijMobileCSS: {
                header: "ui-header ui-bar-a",
                content: "ui-body-c",
                stateDefault: "ui-btn ui-btn-b",
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
    /// <reference path="../../../Base/jquery.wijmo.widget.ts"/>
    /// <reference path="interfaces.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /** @ignore */
        var wijgridcommandbuttonbase = (function (_super) {
            __extends(wijgridcommandbuttonbase, _super);
            function wijgridcommandbuttonbase() {
                _super.apply(this, arguments);

            }
            wijgridcommandbuttonbase.prototype._create = function () {
                wijmo.grid.widgetName(this.element[0], this.widgetFullName);
                this.element.css("display", "inline").addClass((this.options).wijCSS.widget);
            };
            wijgridcommandbuttonbase.prototype._destroy = function () {
                this.mBtnElement = null;
            };
            wijgridcommandbuttonbase.prototype._init = function () {
                var _this = this;
                this.mBtnElement = this._createElement(this.options).addClass("wijmo-wijgrid-commandbutton").click(function (e) {
                    if(!_this.options.disabled && $.isFunction(_this.options.click)) {
                        _this.options.click.call(self, e);
                    }
                });
                this.element.append(this.mBtnElement);
                this._attachWidget(this.mBtnElement, this.options);
            };
            wijgridcommandbuttonbase.prototype._setOption = function (key, value) {
                var oldValue = this.options[key];
                _super.prototype._setOption.apply(this, [
                    key,
                    value
                ]);
                if((oldValue !== value) && (key === "disabled")) {
                    this._onDisabledChanged(value === true);
                }
            };
            wijgridcommandbuttonbase.prototype._createElement = function (settings) {
                throw "not implemented";
            };
            wijgridcommandbuttonbase.prototype._attachWidget = function (element, settings) {
                throw "not implemented";
            };
            wijgridcommandbuttonbase.prototype._btnElement = function () {
                return this.mBtnElement;
            };
            wijgridcommandbuttonbase.prototype._onDisabledChanged = function (value) {
            };
            return wijgridcommandbuttonbase;
        })(wijmo.wijmoWidget);
        grid.wijgridcommandbuttonbase = wijgridcommandbuttonbase;
        /** @ignore */
        var wijgridcommandbuttonbase_options = (function () {
            function wijgridcommandbuttonbase_options() {
                this.text = undefined;
                this.click = undefined;
                this.iconClass = undefined;
                this.disabled = false;
            }
            return wijgridcommandbuttonbase_options;
        })();
        grid.wijgridcommandbuttonbase_options = wijgridcommandbuttonbase_options;
        wijgridcommandbuttonbase.prototype.options = wijmo.grid.extendWidgetOptions(wijmo.wijmoWidget.prototype.options, new wijgridcommandbuttonbase_options());
        $.wijmo.registerWidget("wijgridcommandbuttonbase", wijgridcommandbuttonbase.prototype);
        /** @ignore */
        var wijgridcommandlink = (function (_super) {
            __extends(wijgridcommandlink, _super);
            function wijgridcommandlink() {
                _super.apply(this, arguments);

            }
            wijgridcommandlink.prototype._createElement = function (settings) {
                var anchor = $("<a href=\"#\" />").text(settings.text || "");
                if(settings.disabled) {
                    anchor.prop("disabled", "disabled");
                }
                return anchor;
            };
            wijgridcommandlink.prototype._attachWidget = function (element, settings) {
            };
            wijgridcommandlink.prototype._onDisabledChanged = function (value) {
                var btn = this._btnElement();
                if(btn) {
                    btn.prop("disabled", value);
                }
            };
            return wijgridcommandlink;
        })(wijgridcommandbuttonbase);
        grid.wijgridcommandlink = wijgridcommandlink;
        $.wijmo.registerWidget("wijgridcommandlink", $.wijmo.wijgridcommandbuttonbase, wijgridcommandlink.prototype);
        /** @ignore */
        var wijgridcommandbutton = (function (_super) {
            __extends(wijgridcommandbutton, _super);
            function wijgridcommandbutton() {
                _super.apply(this, arguments);

            }
            wijgridcommandbutton.prototype._createElement = function (settings) {
                return $("<input type=\"button\" />").val(settings.text);
            };
            wijgridcommandbutton.prototype._attachWidget = function (element, settings) {
                element.button({
                    disabled: settings.disabled
                });
            };
            wijgridcommandbutton.prototype._onDisabledChanged = function (value) {
                var btn = this._btnElement();
                if(btn) {
                    btn.button({
                        disabled: value
                    });
                }
            };
            return wijgridcommandbutton;
        })(wijgridcommandbuttonbase);
        grid.wijgridcommandbutton = wijgridcommandbutton;
        $.wijmo.registerWidget("wijgridcommandbutton", $.wijmo.wijgridcommandbuttonbase, wijgridcommandbutton.prototype);
        /** @ignore */
        var wijgridcommandimagebutton = (function (_super) {
            __extends(wijgridcommandimagebutton, _super);
            function wijgridcommandimagebutton() {
                _super.apply(this, arguments);

            }
            wijgridcommandimagebutton.prototype._createElement = function (settings) {
                var button = $("<button />"), hasText = !!settings.text;
                if(hasText) {
                    button.text(settings.text);
                } else {
                    button.html("&nbsp;");
                }
                return button;
            };
            wijgridcommandimagebutton.prototype._attachWidget = function (element, settings) {
                var hasText = !!settings.text;
                element.button({
                    disabled: settings.disabled,
                    icons: {
                        primary: settings.iconClass
                    },
                    text: hasText
                });
            };
            wijgridcommandimagebutton.prototype._onDisabledChanged = function (value) {
                var btn = this._btnElement();
                if(btn) {
                    btn.button({
                        disabled: value
                    });
                }
            };
            return wijgridcommandimagebutton;
        })(wijgridcommandbuttonbase);
        grid.wijgridcommandimagebutton = wijgridcommandimagebutton;
        $.wijmo.registerWidget("wijgridcommandimagebutton", $.wijmo.wijgridcommandbuttonbase, wijgridcommandimagebutton.prototype);
        /** @ignore */
        var wijgridcommandimage = (function (_super) {
            __extends(wijgridcommandimage, _super);
            function wijgridcommandimage() {
                _super.apply(this, arguments);

            }
            wijgridcommandimage.prototype._createElement = function (settings) {
                var button = $("<button />").html("&nbsp;");
                return button;
            };
            wijgridcommandimage.prototype._attachWidget = function (element, settings) {
                element.button({
                    disabled: settings.disabled,
                    icons: {
                        primary: settings.iconClass
                    },
                    text: false
                });
            };
            wijgridcommandimage.prototype._onDisabledChanged = function (value) {
                var btn = this._btnElement();
                if(btn) {
                    btn.button({
                        disabled: value
                    });
                }
            };
            return wijgridcommandimage;
        })(wijgridcommandbuttonbase);
        grid.wijgridcommandimage = wijgridcommandimage;
        $.wijmo.registerWidget("wijgridcommandimage", $.wijmo.wijgridcommandbuttonbase, wijgridcommandimage.prototype);
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
    /// <reference path="interfaces.ts"/>
    /// <reference path="c1basefield.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /*-- c1btnfieldbase --*/
        /** @widget */
        var c1btnfieldbase = (function (_super) {
            __extends(c1btnfieldbase, _super);
            function c1btnfieldbase() {
                _super.apply(this, arguments);

            }
            c1btnfieldbase.testC1GridViewCommandField = function testC1GridViewCommandField(options) {
                return options && options.innerState && (options.innerState.clientType || "").toLowerCase() === "c1commandfield";
            };
            c1btnfieldbase.testC1GridViewButtonField = function testC1GridViewButtonField(options) {
                return options && options.innerState && (options.innerState.clientType || "").toLowerCase() === "c1buttonfield";
            };
            c1btnfieldbase.test = function test(options) {
                return (options && options.buttonType) && !c1btnfieldbase.testC1GridViewCommandField(options) && !c1btnfieldbase.testC1GridViewButtonField(options);
            };
            return c1btnfieldbase;
        })(grid.c1basefield);
        grid.c1btnfieldbase = c1btnfieldbase;
        var c1btnfieldbase_options = (function (_super) {
            __extends(c1btnfieldbase_options, _super);
            function c1btnfieldbase_options() {
                _super.apply(this, arguments);

                /** Gets or sets the type of the button in the column. Possible values are "link", "button", "imageButton", "image".
                * @example
                * $("#element").wijgrid({ columns: [{ buttonType: "button" }]});
                */
                this.buttonType = "button";
            }
            return c1btnfieldbase_options;
        })(grid.c1basefield_options);
        grid.c1btnfieldbase_options = c1btnfieldbase_options;
        ;
        c1btnfieldbase.prototype.options = wijmo.grid.extendWidgetOptions(grid.c1basefield.prototype.options, new c1btnfieldbase_options());
        //$.wijmo.registerWidget("c1basefield", c1basefield.prototype);
        /*-- c1btnfield --*/
        // Important: The "c1buttonfield" name and appropriate clientType value are reserved by C1GridView.
        /** @widget */
        var c1btnfield = (function (_super) {
            __extends(c1btnfield, _super);
            function c1btnfield() {
                _super.apply(this, arguments);

            }
            c1btnfield.test = function test(options) {
                return c1btnfieldbase.test(options) || options.command;
            };
            return c1btnfield;
        })(c1btnfieldbase);
        grid.c1btnfield = c1btnfield;
        var c1btnfield_options = (function (_super) {
            __extends(c1btnfield_options, _super);
            function c1btnfield_options() {
                _super.apply(this, arguments);

                /** Represents options of a command button.
                * @example
                * $("#element").wijgrid({
                *    columns: [{
                *       buttonType: "link",
                *       command: {
                *          text: "myCommand",
                *          click: function (e, args) {
                *             alert("clicked!");
                *          }
                *       }
                *    }]
                * });
                */
                this.command = undefined;
            }
            return c1btnfield_options;
        })(c1btnfieldbase_options);
        grid.c1btnfield_options = c1btnfield_options;
        ;
        c1btnfield.prototype.options = wijmo.grid.extendWidgetOptions(c1btnfieldbase.prototype.options, new c1btnfield_options());
        $.wijmo.registerWidget("c1btnfield", c1btnfield.prototype);
        /*-- c1commandbtnfield --*/
        // Important: The "c1commandfield" name and appropriate clientType value are reserved by C1GridView.
        /** @widget */
        var c1commandbtnfield = (function (_super) {
            __extends(c1commandbtnfield, _super);
            function c1commandbtnfield() {
                _super.apply(this, arguments);

            }
            c1commandbtnfield.test = function test(options) {
                if(c1btnfieldbase.testC1GridViewCommandField(options) || c1btnfieldbase.testC1GridViewButtonField(options)) {
                    return false;
                }
                return ((options.showDeleteButton && options.showDeleteButton !== false) || // its better to use a ("propName" in options) statement here, but there is will be no static type checking.
                (options.showEditButton && options.showEditButton !== false) || options.cancelCommand || options.deleteCommand || options.editCommand || options.updateCommand);
            };
            return c1commandbtnfield;
        })(c1btnfieldbase);
        grid.c1commandbtnfield = c1commandbtnfield;
        var c1commandbtnfield_options = (function (_super) {
            __extends(c1commandbtnfield_options, _super);
            function c1commandbtnfield_options() {
                _super.apply(this, arguments);

                /** Gets or sets a value indicating whether a Delete button is displayed in a command column.
                * @example
                * $("#element").wijgrid({
                *    columns: [{
                *       showDeleteButton: true
                *    }]
                * });
                */
                this.showDeleteButton = false;
                /** Gets or sets a value indicating whether an Edit button is displayed in a command column.
                * @example
                * $("#element").wijgrid({
                *    columns: [{
                *       showEditButton: true
                *    }]
                * });
                */
                this.showEditButton = false;
                /** Represents options of a Cancel command button.
                * @example
                * $("#element").wijgrid({
                *    columns: [{
                *       cancelCommand: {
                *          text: "Cancel!"
                *       }
                *    }]
                * });
                */
                this.cancelCommand = {
                    text: "Cancel",
                    iconClass: "ui-icon-close",
                    click: undefined
                };
                /** Represents options of a Delete command button.
                * @example
                * $("#element").wijgrid({
                *    columns: [{
                *       deleteCommand: {
                *          text: "Delete!"
                *       }
                *    }]
                * });
                */
                this.deleteCommand = {
                    text: "Delete",
                    iconClass: "ui-icon-trash",
                    click: undefined
                };
                /** Represents options of a Delete command button.
                * @example
                * $("#element").wijgrid({
                *    columns: [{
                *       deleteCommand: {
                *          text: "Edit!"
                *       }
                *    }]
                * });
                */
                this.editCommand = {
                    text: "Edit",
                    iconClass: "ui-icon-pencil",
                    click: undefined
                };
                /** Represents options of a Delete command button.
                * @example
                * $("#element").wijgrid({
                *    columns: [{
                *       deleteCommand: {
                *          text: "Update!"
                *       }
                *    }]
                * });
                */
                this.updateCommand = {
                    text: "Update",
                    iconClass: "ui-icon-disk",
                    click: undefined
                };
            }
            return c1commandbtnfield_options;
        })(c1btnfieldbase_options);
        grid.c1commandbtnfield_options = c1commandbtnfield_options;
        ;
        c1commandbtnfield.prototype.options = wijmo.grid.extendWidgetOptions(c1btnfieldbase.prototype.options, new c1commandbtnfield_options());
        $.wijmo.registerWidget("c1commandbtnfield", c1commandbtnfield.prototype);
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /** @ignore */
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
        /** @ignore */
        function flatten(columns) {
            var result = [];
            wijmo.grid.traverse(columns, function (column) {
                result.push(column);
            });
            return result;
        }
        grid.flatten = flatten;
        // returns both visible and invisible leaves.
        /** @ignore */
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
        /** @ignore */
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
        /** @ignore */
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
        /** @ignore */
        function getTompostParent(column, allColumnsTraverseList) {
            if(!column || !allColumnsTraverseList || (column.parentIdx === -1)) {
                return null;
            }
            var parent = allColumnsTraverseList[column.parentIdx];
            if(parent.parentIdx === -1) {
                return parent;
            }
            return wijmo.grid.getTompostParent(parent, allColumnsTraverseList);
        }
        grid.getTompostParent = getTompostParent;
        /** @ignore */
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
        /** @ignore */
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
                        /** @ignore */
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
    /// <reference path="misc.ts"/>
    /// <reference path="../../../data/src/dataView.ts"/>
    /// <reference path="../../../data/src/filtering.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /** @ignore */
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
                                    name: item.originalOperator || // unwrap proxy operator
                                    item.operator,
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
                                normalizedItem.filterOperator = item.originalOperator || // unwrap proxy operator
                                item.operator || "Equals";
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
                                        owner: leaf,
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
                    var sortDictionary = {
                    }, sortArray = [], groupedColumns = this._wijgrid._groupedColumns(true), leaves = // grouped columns ordered by the groupedIndex
                    this._wijgrid._field("leaves") || [], canSort = function (column) {
                        return (!column.isBand && wijmo.grid.validDataKey(column.dataKey));
                    }, sortOrder = 0;
                    // fill the sortedDictionary with the grouped columns first
                    $.each(groupedColumns, function (i, leaf) {
                        if(canSort(leaf)) {
                            if(leaf.sortDirection === "none") {
                                leaf.sortDirection = "ascending"// use "ascending" for grouped columns by default
                                ;
                            }
                            sortDictionary[leaf.dataKey] = {
                                dataKey: leaf.dataKey,
                                sortDirection: leaf.sortDirection,
                                sortOrder: sortOrder++
                            };
                        }
                    });
                    sortOrder++;
                    // add other columns
                    $.each(leaves, function (i, leaf) {
                        if(canSort(leaf)) {
                            if(leaf.sortDirection === "ascending" || leaf.sortDirection === "descending") {
                                if(!sortDictionary[leaf.dataKey]) {
                                    // skip grouped columns or columns with the same dataKey
                                    sortDictionary[leaf.dataKey] = {
                                        dataKey: leaf.dataKey,
                                        sortDirection: leaf.sortDirection,
                                        sortOrder: (leaf.sortOrder || 0) + sortOrder
                                    };
                                }
                            }
                        }
                    });
                    // convert {} to []
                    $.each(sortDictionary, function (key, value) {
                        sortArray.push(value);
                    });
                    // sort by sortOrder
                    sortArray.sort(function (a, b) {
                        return a.sortOrder - b.sortOrder;
                    });
                    $.each(sortArray, function (i, item) {
                        delete item.sortOrder;
                    });
                    this._wgSortingSettings = (sortArray.length) ? sortArray : null;
                }
                return this._wgSortingSettings;
            };
            settingsManager.prototype.MapWGToDV = function () {
                var _this = this;
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
                this._wijgrid.deficientFilters = {
                };
                // ** filtering
                if(this._mapFilteringParams()) {
                    // fill the deficientFilters
                    $.each(this._wijgrid._field("leaves"), function (key, leaf) {
                        if(wijmo.grid.validDataKey(leaf.dataKey) && ((leaf.filterOperator === undefined) ^ (leaf.filterValue === undefined))) {
                            _this._wijgrid.deficientFilters[leaf.dataKey] = {
                                filterOperator: leaf.filterOperator,
                                filterValue: leaf.filterValue
                            };
                        }
                    });
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
                }, mapSortingParams = this._mapSortingParams(), mapPagingParams = this._mapPagingParams(), mapFilteringParams = this._mapFilteringParams(), pagedDataView = wijmo.grid.asPagedDataView(this._dataView), self = this;
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
                if(mapFilteringParams) {
                    if(foo = this.DVFilteringSettings()) {
                        $.each(foo, function (key, o) {
                            var leaf;
                            if((leaf = leavesByDataKey[o.dataKey])) {
                                leaf.filterValue = o.filterValue;
                                leaf.filterOperator = o.filterOperator;
                                if($.isPlainObject(leaf.filterOperator)) {
                                    // custom operator, convert operator object to operator name.
                                    leaf.filterOperator = leaf.filterOperator.name;
                                }
                                delete self._wijgrid.deficientFilters[leaf.dataKey]// unary operator?
                                ;
                            }
                        });
                    }
                    $.each(this._wijgrid.deficientFilters, function (dataKey, defFilter) {
                        leavesByDataKey[dataKey].filterOperator = defFilter.filterOperator;
                        leavesByDataKey[dataKey].filterValue = defFilter.filterValue;
                    });
                }
            };
            settingsManager.prototype._mapPagingParams = function () {
                return this._wijgrid.options.allowPaging && !this._wijgrid._customPagingEnabled() && !this._wijgrid._serverShaping();// used by c1gridview. Disable client paging because source data are paged already and contains items of the current page only.

            };
            settingsManager.prototype._mapSortingParams = function () {
                return !this._wijgrid._serverShaping();// used by c1gridview. Disable client sorting because source data are sorted already.

            };
            settingsManager.prototype._mapFilteringParams = function () {
                return !this._wijgrid._serverShaping();// used by c1gridview. Disable client filtering because source data are filtered already.

            };
            settingsManager.prototype.makeProxyFilter = function (owner, prop, name, value) {
                name = name.toLowerCase();
                var self = this, isDateColumn = (owner.dataType === "datetime"), result = {
                    originalOperator: undefined,
                    property: prop,
                    operator: name,
                    value: // name or filter object
                    value
                };
                var internalOp = this._filterCache.getByNameInt(name);
                var builtinOp = wijmo.data.filtering.ops[name];
                if((name !== "nofilter") && (internalOp.isCustom || isDateColumn)) {
                    // need to create a proxy filter
                    result.originalOperator = result.operator;
                    if(internalOp.isCustom) {
                        result.operator = $.extend(true, {
                        }, internalOp.op);
                        result.operator.apply = result.operator.operator// wijdata requires apply() function instead of operator().
                        ;
                    } else {
                        // date column
                        result.operator = $.extend(true, {
                        }, builtinOp);
                        var filterRequirements = owner.inputType ? wijmo.grid.TimeUnitConverter.convertInputType(owner.inputType) : // inputType takes precedence
                        wijmo.grid.TimeUnitConverter.convertFormatString(owner.dataFormatString || "d");
                        result.operator.apply = function (a, b) {
                            if(!(a instanceof Date)) {
                                a = self._wijgrid.parse(owner, a);
                            }
                            if(!(b instanceof Date)) {
                                b = self._wijgrid.parse(owner, b);
                            }
                            wijmo.grid.TimeUnitConverter.cutDate(a, filterRequirements);
                            wijmo.grid.TimeUnitConverter.cutDate(b, filterRequirements);
                            // compare formatted values
                            //a = self._wijgrid.toStr(owner, a);
                            //b = self._wijgrid.toStr(owner, b);
                            return builtinOp.apply(a, b);
                        };
                    }
                }
                return result;
            };
            settingsManager.prototype._convertFilterToDV = // conversion from wijgrid format
            function (normalizedFilter) {
                var result = {
                }, manager = this;
                $.each(normalizedFilter, function (i, group) {
                    var prop = group.dataKey, currConds = [], currConn = "and", conn, operators, values, conds;
                    if(!$.isPlainObject(group)) {
                        return;
                    }
                    operators = group.filterOperator;
                    values = group.filterValue;
                    if(operators == null) {
                        return;
                    }
                    if(!$.isArray(operators)) {
                        operators = [
                            operators
                        ];
                    }
                    if(!$.isArray(values)) {
                        values = [
                            values
                        ];
                    }
                    if(operators.length != values.length) {
                        throw "The number of filter operators must match the number of filter values";
                    }
                    if(operators.length == 0) {
                        return;
                    }
                    $.each(operators, function (i, operator) {
                        var value;
                        if(typeof operator === "string") {
                            operator = {
                                name: operator
                            };
                        }
                        if(!$.isPlainObject(operator) || !operator.name) {
                            throw "Invalid filter operator";
                        }
                        value = values[i];
                        if(!$.isArray(value)) {
                            value = [
                                value
                            ];
                        }
                        conds = $.map(value, function (operand) {
                            return manager.makeProxyFilter(group.owner, prop, operator.name, operand);
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
                        conn = operator.condition || "or";
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
    /// <reference path="../data/koDataView.ts"/>
    /// <reference path="interfaces.ts"/>
    /// <reference path="misc.ts"/>
    /// <reference path="wijgrid.ts"/>
    /// <reference path="settingsManager.ts"/>
    /// <reference path="htmlTableAccessor.ts"/>
    /// <reference path="tally.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /** @ignore */
        var dataViewWrapper = (function () {
            function dataViewWrapper(wijgrid) {
                this._domSource = null;
                this._ignoreAllEvents = false;
                this._ignoreChangeEvent = false;
                this._ignoreCurrentChangedEvent = false;
                this._sharedDataItems = null;
                this._userData = null;
                this._totals = null;
                this._changeTimer = 0;
                this._toDispose = [];
                this._isOwnDataView = false;
                this._isWijdatasource = false;
                this._isKODataView = false;
                this._isDynamicWijdatasource = false;
                this._wijgrid = wijgrid;
                this._createDataViewWrapper()// set _dataView
                ;
            }
            dataViewWrapper.prototype.data = function () {
                var dataView = this._getDataViewInst(), pagedDataView = wijmo.grid.asPagedDataView(dataView);
                return {
                    data: this._getSharedDataItems(),
                    totalRows: // totalRows: dataView().length,
                    pagedDataView != null ? pagedDataView.totalItemCount() : (dataView.getSource() || []).length,
                    totals: this._getTotals(),
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
                var dataView = this._getDataViewInst();
                return this._propDescriptorsToFieldsInfo(dataView.getProperties());
            };
            dataViewWrapper.prototype._propDescriptorsToFieldsInfo = function (propDescriptors) {
                var result = {
                };
                if(propDescriptors) {
                    $.each(propDescriptors, function (_, prop) {
                        if(prop.name === "$$hash" || prop.name === "$$hashKey") {
                            // exclude $$hash property (Angular).
                            return;
                        }
                        result[prop.name] = {
                            name: prop.name,
                            type: prop.type || "string"
                        };
                    });
                }
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
                if((userData && userData.forceDataLoad) || this._needToLoad(sm)) {
                    var loadParams = sm.MapWGToDV(), local = false;
                    if(this._isWijdatasource && !this._isDynamicWijdatasource && dataView.isLoaded()) {
                        local = true;
                    }
                    // ** ensure pageIndex
                                        var pagedDataView = wijmo.grid.asPagedDataView(dataView), totalItems = -1;
                    // if paging is enabled and dataView provides totalItemCount then ensure that pageIndex is within[0; pageCount) range.
                    if(pagedDataView && (loadParams.pageSize >= 0) && ((totalItems = pagedDataView.totalItemCount()) >= 0)) {
                        // ** 47731: handle situation when underlying array was changed directly by user.
                        if(this._isOwnDataView && !this._isKODataView && (pagedDataView.pageSize() > 0)) {
                            // test if dataView is paged already
                            var source = pagedDataView.getSource();
                            if(source && (source.length < /*!==*/ totalItems)) {
                                totalItems = source.length;
                            }
                        }
                        // 47731 **
                                                var pageCount = Math.ceil(totalItems / loadParams.pageSize) || 1, pageIndex = loadParams.pageIndex;
                        if(pageIndex >= pageCount) {
                            pageIndex = Math.max(0, pageCount - 1);
                        }
                        loadParams.pageIndex = pageIndex;
                    }
                    // ensure pageIndex **
                    this.ignoreCurrentChangedEvent(true)// The currentPositionChanged event fires before the change event, stop listening. Listening will  be restored in the _onDataViewReset method.
                    ;
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
            dataViewWrapper.prototype.makeDirty = function () {
                this._propChangeListener.removeAll()// remove old subscriptions
                ;
                this._totals = null;
                this._sharedDataItems = null;
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
                this._isKODataView = data instanceof wijmo.grid.koDataView;
                this._isOwnDataView = ($.isArray(data) || isWijdatasource || this._isKODataView);
                this._isWijdatasource = !!(this._isOwnDataView && isWijdatasource);
                //this._isRemoteWijdatasource = !!(this._isOwnDataView && isWijdatasource && data.proxy);
                this._isDynamicWijdatasource = !!(this._isOwnDataView && isWijdatasource && data.dynamic);
                if(this._isOwnDataView && !this._isKODataView) {
                    if(!this._domSource && this._wijgrid.options.readAttributesFromData) {
                        this._moveAttributesToExpando(data);
                    }
                    var tBody = this.isBoundedToDOM() && wijmo.grid.getTableSection(this._wijgrid.element, wijmo.grid.rowScope.body);
                    dataView = wijmo.grid.GridDataView.create(wijmo.data.asDataView(this._parseOwnData(data, tBody)));
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
            dataViewWrapper.prototype._parseOwnData = function (data, tbody) {
                var self = this;
                if(data && data.length) {
                    var columns = $.extend(true, [], this._wijgrid.options.columns), props = wijmo.data.ArrayDataViewBase._getProps(data[0]) || [], fieldsInfo = this._propDescriptorsToFieldsInfo(props), dataLeaves = [];
                    this._wijgrid._prepareColumnOptions(columns, "merge", fieldsInfo, true, true);
                    wijmo.grid.traverse(columns, function (column) {
                        if(wijmo.grid.getDataType(column) !== "string" && wijmo.grid.validDataKey(column.dataKey)) {
                            dataLeaves.push(column);
                        }
                    });
                    if(dataLeaves.length && tbody) {
                        $.each(data, function (i, dataItem) {
                            wijmo.grid.dataViewWrapper._parseDataItem(self._wijgrid, dataItem, (tbody && tbody.rows[i]), dataLeaves);
                        });
                    }
                }
                return data;
            };
            dataViewWrapper._parseDataItem = function _parseDataItem(parseHandler, dataItem, domRow, leaves) {
                $.each(leaves, function (i, leaf) {
                    var value = dataItem[leaf.dataKey], newValue = parseHandler.parse(leaf, value);
                    if(isNaN(newValue)) {
                        // failed
                        var domCell = null;
                        if(domRow) {
                            domCell = domRow.cells[leaf.dataKey];
                        }
                        newValue = parseHandler.parseFailed(leaf, value, dataItem, domCell);
                    }
                    dataItem[leaf.dataKey] = newValue;
                });
                return dataItem;
            };
            dataViewWrapper.prototype._getDataViewInst = function () {
                return this._wijgrid._wijDataView;
            };
            dataViewWrapper.prototype._needToLoad = function (settingsManager) {
                var dataView = this._getDataViewInst();
                if(this._isDynamicWijdatasource || (this._isWijdatasource && !dataView.isLoaded())) {
                    return true;
                }
                if(this._isOwnDataView && !this._isWijdatasource && this.isDataLoaded()) {
                    // TFS Issue #36277
                    return true;
                }
                if(this.isDataLoaded() || dataView.isLoading()) {
                    // data is loaded already or loading, check reshaping settings
                    return !settingsManager.compareSettings();
                }
                return true;// data is not loaded yet or user want to load them manually

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
                try  {
                    this.ignoreCurrentChangedEvent(false)// restore listening (see the load() method).
                    ;
                    this.makeDirty()// force to recreate  the _totals and _sharedDataItems fields when the this.data() method will be called.
                    ;
                    this._wijgrid._onDataViewReset(this._userData, this._isKODataView)// 47851: recreate columns each time if koDataView is used to handle situation when observable array value was changed completely: viewModel.property([]) -> viewModel.property([a, b, c]).
                    ;
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
            dataViewWrapper.prototype._getSharedDataItems = // event handlers **
            function () {
                if(!this._sharedDataItems) {
                    var dataView = this._getDataViewInst(), len = dataView.count();
                    this._sharedDataItems = [];
                    var firstWiredSuccessfully = true;
                    for(var i = 0; i < len; i++) {
                        var dataItem = dataView.item(i);
                        // optimization: listen only if it is the first attempt or the first attempt was successful
                        if(firstWiredSuccessfully) {
                            if(!this._propChangeListener.insert(i, dataItem) && i === 0) {
                                firstWiredSuccessfully = false;
                            }
                        }
                        this._sharedDataItems.push(this._wrapDataItem(dataItem, i));
                    }
                }
                if(!this._sharedDataItems) {
                    this._sharedDataItems = [];
                }
                return this._sharedDataItems;
            };
            dataViewWrapper.prototype._getTotals = function () {
                if(!this._totals) {
                    var dataView = this._getDataViewInst();
                    this._totals = this._prepareTotals(dataView, this._wijgrid._prepareTotalsRequest(true));
                }
                if(!this._totals) {
                    this._totals = {
                    };
                }
                return this._totals;
            };
            dataViewWrapper.prototype._prepareTotals = function (dataView, request) {
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
                        tallies[j].add(this._wijgrid.parse(request[j].column, this.getValue(i, request[j].column.dataKey)));
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
                if(wijmo.grid.getTableSectionLength($obj, 2) === 1 && $(wijmo.grid.getTableSectionRow($obj, 2, 0)).hasClass(wijmo.grid.wijgrid.CSS.emptyDataRow)) {
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
        /** @ignore */
        function asPagedDataView(dataView) {
            return dataView && ("pageCount" in dataView) ? dataView : null;
        }
        grid.asPagedDataView = asPagedDataView;
        /** @ignore */
        function asEditableDataView(dataView) {
            return dataView && ("commitEdit" in dataView) ? dataView : null;
        }
        grid.asEditableDataView = asEditableDataView;
        /** @ignore */
        var propChangeListener = (function () {
            function propChangeListener(callback) {
                this._subscriptions = [];
                this._callback = callback;
            }
            propChangeListener.prototype.insert = function (index, dataViewItem) {
                var itemSubscrArray = null, self = this;
                $.each(dataViewItem, function (key, value) {
                    if(self._isValidPropName(key) && value && $.isFunction(value.subscribe)) {
                        itemSubscrArray = itemSubscrArray || [];
                        itemSubscrArray.push(value.subscribe(self._callback));
                    }
                });
                if(!itemSubscrArray) {
                    // we didn't subscribe in fact
                    return false;
                }
                if(this._subscriptions.length < index) {
                    // inflate the array before inserting
                    this._subscriptions.length = index;
                }
                this._subscriptions.splice(index, 0, itemSubscrArray);
                return true;
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
                    return name.match(/^entityState|jQuery/) === null;
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
    /// <reference path="../../../wijutil/jquery.wijmo.wijutil.ts" />
    /// <reference path="interfaces.ts"/>
    /// <reference path="merger.ts"/>
    /// <reference path="wijgrid.ts"/>
    /// <reference path="groupHelper.ts"/>
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /** @ignore */
        var groupRange = (function () {
            function groupRange(expanded, range, sum, position, hasHeaderOrFooter) {
                this.cr = new wijmo.grid.cellRange(-1, -1);
                this.isExpanded = false;
                this.position = "none";
                this._sum = -1;
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
                    this.position = position;
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
            groupRange.prototype.collapse = function () {
                var groupInfo, column, grid, leaves, groupedColumnsCnt;
                if((groupInfo = this.owner) && (column = groupInfo.owner) && (grid = column.owner)) {
                    leaves = grid._field("leaves");
                    if(wijmo.grid.groupHelper.isParentExpanded(leaves, this.cr, groupInfo.level)) {
                        if((groupInfo.position !== "footer") && (groupInfo.outlineMode !== "none")) {
                            // do not collapse groups with .position == "footer"
                            groupedColumnsCnt = wijmo.grid.groupHelper.getGroupedColumnsCount(leaves);
                            this._collapse(grid, grid._rows(), leaves, this, groupedColumnsCnt, grid._allowVirtualScrolling());
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
                        this._expand(grid, grid._rows(), leaves, this, groupedColumnsCnt, expandChildren, true, grid._allowVirtualScrolling());
                    }
                }
            };
            groupRange.prototype._collapse = function (grid, rowAccessor, leaves, groupRange, groupedColumnsCnt, virtualScrollingEnabled) {
                var groupInfo = groupRange.owner, dataStart = groupRange.cr.r1, dataEnd = groupRange.cr.r2, i, len, childRanges, childRange, j;
                switch(groupInfo.position) {
                    case "header":
                    case "headerAndFooter":
                        this._toggleSketchRowVisibility(grid.sketchTable.row(groupRange.cr.r1), undefined, false);
                        if(!virtualScrollingEnabled) {
                            this._toggleRowVisibility(grid, rowAccessor.item(groupRange.cr.r1), undefined, false);
                        }
                        dataStart++;
                        break;
                }
                // hide child rows
                for(i = dataStart; i <= dataEnd; i++) {
                    this._toggleSketchRowVisibility(grid.sketchTable.row(i), false, undefined);
                    if(!virtualScrollingEnabled) {
                        this._toggleRowVisibility(grid, rowAccessor.item(i), false, undefined);
                    }
                }
                // update isExpanded property
                groupRange.isExpanded = false;
                for(i = groupInfo.level + 1; i <= groupedColumnsCnt; i++) {
                    childRanges = wijmo.grid.groupHelper.getChildGroupRanges(leaves, groupRange.cr, /*groupRange.owner.level*/ i - 1);
                    for(j = 0 , len = childRanges.length; j < len; j++) {
                        childRange = childRanges[j];
                        childRange.isExpanded = false;
                        // update groupHeader
                        switch(childRange.owner.position) {
                            case "header":
                            case "headerAndFooter":
                                this._toggleSketchRowVisibility(grid.sketchTable.row(childRange.cr.r1), false, false);
                                if(!virtualScrollingEnabled) {
                                    this._toggleRowVisibility(grid, rowAccessor.item(childRange.cr.r1), false, false);
                                }
                                break;
                        }
                    }
                }
            };
            groupRange.prototype._expand = function (grid, rowAccessor, leaves, groupRange, groupedColumnsCnt, expandChildren, isRoot, virtualScrollingEnabled) {
                var groupInfo = groupRange.owner, dataStart = groupRange.cr.r1, dataEnd = groupRange.cr.r2, i, len, childRanges, childRange, childIsRoot;
                switch(groupInfo.position) {
                    case "header":
                        this._toggleSketchRowVisibility(grid.sketchTable.row(dataStart), true, isRoot || expandChildren);
                        if(!virtualScrollingEnabled) {
                            this._toggleRowVisibility(grid, rowAccessor.item(dataStart), true, isRoot || expandChildren);
                        }
                        dataStart++;
                        break;
                    case "footer":
                        this._toggleSketchRowVisibility(grid.sketchTable.row(dataEnd), true, undefined);
                        if(!virtualScrollingEnabled) {
                            this._toggleRowVisibility(grid, rowAccessor.item(dataEnd), true, undefined);
                        }
                        dataEnd--;
                        break;
                    case "headerAndFooter":
                        this._toggleSketchRowVisibility(grid.sketchTable.row(dataStart), true, isRoot || expandChildren);
                        if(!virtualScrollingEnabled) {
                            this._toggleRowVisibility(grid, rowAccessor.item(dataStart), true, isRoot || expandChildren);
                        }
                        if(isRoot) {
                            this._toggleSketchRowVisibility(grid.sketchTable.row(dataEnd), true, undefined);
                            if(!virtualScrollingEnabled) {
                                this._toggleRowVisibility(grid, rowAccessor.item(dataEnd), true, undefined);
                            }
                        }
                        dataStart++;
                        dataEnd--;
                        break;
                }
                if(isRoot) {
                    groupRange.isExpanded = true;
                } else {
                    return;
                }
                if(groupRange.owner.level === groupedColumnsCnt) {
                    // show data rows
                    for(i = dataStart; i <= dataEnd; i++) {
                        this._toggleSketchRowVisibility(grid.sketchTable.row(i), true, undefined);
                        if(!virtualScrollingEnabled) {
                            this._toggleRowVisibility(grid, rowAccessor.item(i), true, undefined);
                        }
                    }
                } else {
                    childRanges = wijmo.grid.groupHelper.getChildGroupRanges(leaves, groupRange.cr, groupRange.owner.level);
                    if(childRanges.length && (dataStart !== childRanges[0].cr.r1)) {
                        //
                        // a space between parent groupHeader and first child range - show single rows (groupSingleRow = false)
                        for(i = dataStart; i < childRanges[0].cr.r1; i++) {
                            this._toggleSketchRowVisibility(grid.sketchTable.row(i), true, undefined);
                            if(!virtualScrollingEnabled) {
                                this._toggleRowVisibility(grid, rowAccessor.item(i), true, undefined);
                            }
                        }
                    }
                    if(expandChildren) {
                        // throw action deeper
                        for(i = 0 , len = childRanges.length; i < len; i++) {
                            childRange = childRanges[i];
                            this._expand(grid, rowAccessor, leaves, childRange, groupedColumnsCnt, expandChildren, true, virtualScrollingEnabled);
                        }
                    } else {
                        // show only headers of the child groups or fully expand child groups with .position == "footer"\ .outlineMode == "none"
                        for(i = 0 , len = childRanges.length; i < len; i++) {
                            childRange = childRanges[i];
                            childIsRoot = (childRange.owner.position === "footer" || childRange.owner.outlineMode === "none") ? true : false;
                            this._expand(grid, rowAccessor, leaves, childRange, groupedColumnsCnt, false, childIsRoot, virtualScrollingEnabled);
                        }
                    }
                }
            };
            groupRange.prototype._toggleRowVisibility = function (grid, rowObj, visible, expanded) {
                if(rowObj) {
                    var rse = wijmo.grid.renderStateEx, view = grid._view(), rowInfo = view._getRowInfo(rowObj, false);
                    if(visible !== undefined) {
                        if(visible) {
                            rowInfo._extInfo.state &= ~rse.hidden;
                        } else {
                            rowInfo._extInfo.state |= rse.hidden;
                        }
                    }
                    if(expanded !== undefined) {
                        if(expanded) {
                            rowInfo._extInfo.state &= ~rse.collapsed;
                        } else {
                            rowInfo._extInfo.state |= rse.collapsed;
                        }
                    }
                    view._setRowInfo(rowInfo.$rows, rowInfo);
                    grid.rowStyleFormatter._groupFormatter(rowInfo);
                }
            };
            groupRange.prototype._toggleSketchRowVisibility = function (sketchRow, visible, expanded) {
                if(sketchRow) {
                    var rse = wijmo.grid.renderStateEx;
                    if(visible !== undefined) {
                        if(visible) {
                            sketchRow.extInfo.state &= ~rse.hidden;
                        } else {
                            sketchRow.extInfo.state |= rse.hidden;
                        }
                    }
                    if(expanded !== undefined) {
                        if(expanded) {
                            sketchRow.extInfo.state &= ~rse.collapsed;
                        } else {
                            sketchRow.extInfo.state |= rse.collapsed;
                        }
                    }
                }
            };
            return groupRange;
        })();
        grid.groupRange = groupRange;
        /** @ignore */
        var grouper = (function () {
            function grouper() {
                this._groupRowIdx = 0;
            }
            grouper.prototype.group = function (grid, data, leaves) {
                this._grid = grid;
                this._sketchTable = data;
                this._leaves = leaves;
                this._groupRowIdx = 0;
                try  {
                    this._group();
                }finally {
                    delete this._grid;
                    delete this._sketchTable;
                    delete this._leaves;
                }
            };
            grouper.prototype._group = function () {
                var _this = this;
                $.each(this._leaves, function (i, column) {
                    if(column.groupInfo) {
                        delete column.groupInfo.level;
                        delete column.groupInfo.expandInfo;
                    }
                });
                var groupedColumns = this._grid._groupedColumns(true), level = 1;
                if(groupedColumns.length == 0) {
                    return;
                }
                // make sure all rows are created
                this._sketchTable.ensureNotLazy();
                $.each(groupedColumns, function (i, column) {
                    _this._groupRowIdx = 0;
                    if(/*(leaf.dynamic !== true) && */ column.groupInfo && (column.groupInfo.position && (column.groupInfo.position !== "none")) && (column.dataIndex >= 0)) {
                        column.groupInfo.level = level;
                        column.groupInfo.expandInfo = [];
                        _this._processRowGroup(column, level++);
                    }
                });
            };
            grouper.prototype._processRowGroup = function (leaf, level) {
                var firstVisibleLeafIdx = 0, hasHeaderOrFooter = true, rse = wijmo.grid.renderStateEx;
                $.each(this._leaves, function (i, leaf) {
                    if(leaf.parentVis) {
                        firstVisibleLeafIdx = i;
                        return false;
                    }
                });
                for(var rowIndex = 0; rowIndex < this._sketchTable.count(); rowIndex++) {
                    var row = this._sketchTable.row(rowIndex);
                    if(!row.isDataRow()) {
                        continue;
                    }
                    var cellRange = this._getGroupCellRange(rowIndex, leaf, level), isExpanded = true, startCollapsed = (leaf.groupInfo.outlineMode === "startCollapsed"), header, footer, groupRange, isParentCollapsed;
                    if(startCollapsed || wijmo.grid.groupHelper.isParentCollapsed(this._leaves, cellRange, level)) {
                        if((leaf.groupInfo.groupSingleRow === false) && (cellRange.r1 === cellRange.r2)) {
                            continue;
                        }
                        isExpanded = false;
                    }
                    // indent
                    if(level && this._grid.options.groupIndent) {
                        for(var indentRow = cellRange.r1; indentRow <= cellRange.r2; indentRow++) {
                            this._addIndent(this._sketchTable.row(indentRow).cell(firstVisibleLeafIdx), level);
                        }
                    }
                    hasHeaderOrFooter = !(leaf.groupInfo.groupSingleRow === false && (cellRange.r1 === cellRange.r2));
                    // insert group header/ group footer
                    switch(leaf.groupInfo.position) {
                        case "header":
                            groupRange = this._addGroupRange(leaf.groupInfo, cellRange, isExpanded, hasHeaderOrFooter);
                            for(var i = cellRange.r1; i <= cellRange.r2; i++) {
                                row = this._sketchTable.row(i);
                                row.extInfo.groupLevel = level + 1;
                                if(!isExpanded) {
                                    row.extInfo.state |= rse.hidden;
                                }
                            }
                            if(!hasHeaderOrFooter) {
                                break;
                            }
                            this._updateByGroupRange(groupRange, level);
                            isParentCollapsed = wijmo.grid.groupHelper.isParentCollapsed(this._leaves, groupRange.cr, level);
                            header = this._buildGroupRow(groupRange, cellRange, true, isParentCollapsed);
                            this._sketchTable.insert(cellRange.r1, header)// insert group header
                            ;
                            header.extInfo.groupLevel = level;
                            if(!isExpanded) {
                                header.extInfo.state |= rse.collapsed;
                            }
                            if(isParentCollapsed) {
                                header.extInfo.state |= rse.hidden;
                            }
                            rowIndex = cellRange.r2 + 1;
                            break;
                        case "footer":
                            groupRange = this._addGroupRange(leaf.groupInfo, cellRange, true, hasHeaderOrFooter);
                            if(!hasHeaderOrFooter) {
                                break;
                            }
                            this._updateByGroupRange(groupRange, level);
                            footer = this._buildGroupRow(groupRange, cellRange, false, false);
                            footer.extInfo.groupLevel = level;
                            this._sketchTable.insert(cellRange.r2 + 1, footer);
                            rowIndex = cellRange.r2 + 1;
                            isParentCollapsed = wijmo.grid.groupHelper.isParentCollapsed(this._leaves, groupRange.cr, level);
                            if(isParentCollapsed) {
                                footer.extInfo.state |= rse.hidden;
                            }
                            break;
                        case "headerAndFooter":
                            groupRange = this._addGroupRange(leaf.groupInfo, cellRange, isExpanded, hasHeaderOrFooter);
                            for(i = cellRange.r1; i <= cellRange.r2; i++) {
                                row = this._sketchTable.row(i);
                                row.extInfo.groupLevel = level + 1;
                                if(!isExpanded) {
                                    row.extInfo.state |= rse.hidden;
                                }
                            }
                            if(!hasHeaderOrFooter) {
                                break;
                            }
                            this._updateByGroupRange(groupRange, level);
                            isParentCollapsed = wijmo.grid.groupHelper.isParentCollapsed(this._leaves, groupRange.cr, level);
                            header = this._buildGroupRow(groupRange, cellRange, true, isParentCollapsed);
                            footer = this._buildGroupRow(groupRange, cellRange, false, false);
                            this._sketchTable.insert(cellRange.r2 + 1, footer);
                            footer.extInfo.groupLevel = level;
                            if(isParentCollapsed || !isExpanded) {
                                footer.extInfo.state |= rse.hidden;
                            }
                            this._sketchTable.insert(cellRange.r1, header);
                            header.extInfo.groupLevel = level;
                            if(!isExpanded) {
                                header.extInfo.state |= rse.collapsed;
                            }
                            if(isParentCollapsed) {
                                header.extInfo.state |= rse.hidden;
                            }
                            rowIndex = cellRange.r2 + 2;
                            break;
                        default:
                            throw wijmo.grid.stringFormat("Unknown Position value: \"{0}\"", leaf.groupInfo.position);
                    }
                    this._groupRowIdx++;
                }
            };
            grouper.prototype._buildGroupRow = function (groupRange, cellRange, isHeader, isParentCollapsed) {
                //when some column is hidden, the group row is not correct.
                                var groupInfo = groupRange.owner, leaf = groupInfo.owner, gridView = leaf.owner, sketchRow = new grid.SketchGroupRow(isHeader, null), groupByValue = undefined, groupByText = "", aggregate = "", cell, tmp, cell, caption, args, span, col, bFirst, agg, defCSS = wijmo.grid.wijgrid.CSS;
                sketchRow.extInfo.groupIndex = this._groupRowIdx// to make a row ID.
                ;
                if((leaf.dataIndex >= 0) && ((groupByValue = this._sketchTable.valueAt(cellRange.r1, leaf.dataIndex)) !== null)) {
                    groupByText = gridView.toStr(leaf, groupByValue);
                }
                sketchRow.groupByValue = groupByValue;
                if(this._grid._showRowHeader()) {
                    sketchRow.add(grid.HtmlCell.nbsp());
                }
                // create the summary cell
                cell = new grid.HtmlCell("", null);
                sketchRow.add(cell);
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
                        data: this._sketchTable.getRawTable(),
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
                    caption = wijmo.grid.stringFormat(caption, leaf && leaf.encodeHtml ? wijmo.htmlEncode(groupByText) : groupByText, // wijmo.htmlEncode is dangerious
                    leaf && leaf.headerText ? leaf.headerText : "", this._wrapAggregateValue(aggregate));
                }
                if(!caption) {
                    caption = "&nbsp;";
                }
                cell.html += "<span>" + caption + "</span>";
                this._addIndent(cell, groupInfo.level - 1);
                // summary cells span until the end of the row or the first aggregate
                //span = headerOffset;
                span = 1;
                col = (this._grid._showRowHeader()) ? 1 : 0;
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
                        sketchRow.add(new grid.HtmlCell(this._wrapAggregateValue(agg), {
                            groupInfo: {
                                leafIndex: // will be passed into the cellStyleFormatter
                                tmp.leavesIdx,
                                purpose: wijmo.grid.groupRowCellPurpose.aggregateCell
                            }
                        }));
                    }
                }
                cell.ensureAttr().colSpan = span;
                cell.ensureAttr().groupInfo = {
                    leafIndex: leaf.leavesIdx,
                    purpose: wijmo.grid.groupRowCellPurpose.groupCell
                }// will be passed into the cellStyleFormatter
                ;
                return sketchRow;
            };
            grouper.prototype._getAggregate = function (cellRange, column, groupByColumn, isGroupHeader, groupByText) {
                var aggregate = "", args, tally, row;
                if(!column.aggregate || (column.aggregate === "none")) {
                    return aggregate;
                }
                if(column.aggregate === "custom") {
                    args = {
                        data: this._sketchTable.getRawTable(),
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
                        tally.add(this._sketchTable.valueAt(row, column.dataIndex));
                    }
                    aggregate = tally.getValueString(column);
                }
                return aggregate;
            };
            grouper.prototype._getGroupCellRange = function (rowIndex, leaf, level) {
                var idx = leaf.leavesIdx, row, range = // $.inArray(leaf, this._leaves);
                new wijmo.grid.cellRange(rowIndex, idx), parentRange = wijmo.grid.groupHelper.getParentGroupRange(this._leaves, range, level), value, nextValue, count;
                //if (this._sketchTable[row].rowType === "data") {
                row = this._sketchTable.row(rowIndex);
                if(row.isDataRow()) {
                    value = row.valueCell(leaf.dataIndex).value;
                    if(value instanceof Date) {
                        value = value.getTime();
                    }
                    for(range.r2 = rowIndex , count = this._sketchTable.count() - 1; range.r2 < count; range.r2++) {
                        //if ((this._sketchTable[range.r2 + 1].rowType !== "data") || (parentRange && (range.r2 + 1 > parentRange.r2))) {
                        if(!this._sketchTable.row(range.r2 + 1).isDataRow() || (parentRange && (range.r2 + 1 > parentRange.cr.r2))) {
                            break;
                        }
                        nextValue = this._sketchTable.valueAt(range.r2 + 1, leaf.dataIndex);
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
                    cellObj.ensureStyle().paddingLeft = (indent * level) + "px";
                }
            };
            grouper.prototype._wrapAggregateValue = function (value) {
                return "<span class='" + wijmo.grid.wijgrid.CSS.aggregateContainer + "'>" + value.toString() + "</span>";
                //return value.toString();
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
        /** @ignore */
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
                var result = [], childGroupedColumn = wijmo.grid.groupHelper.getColumnByGroupLevel(leaves, level + 1);
                if(childGroupedColumn) {
                    var childRanges = childGroupedColumn.groupInfo.expandInfo, firstChildIdx = wijmo.grid.groupHelper.getChildGroupIndex(cellRange, childRanges);
                    for(var i = firstChildIdx, len = childRanges.length; i < len; i++) {
                        var childRange = childRanges[i];
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
                if(level === undefined) {
                    level = 0xFFFF;
                }
                if(cellRange && (level - 2 >= 0)) {
                    for(var i = leaves.length - 1; i >= 0; i--) {
                        var groupInfo = leaves[i].groupInfo;
                        if(!groupInfo || !groupInfo.expandInfo || (groupInfo.level < 0) || (groupInfo.level !== level - 1)) {
                            continue;
                        }
                        var idx = wijmo.grid.groupHelper.getParentGroupIndex(cellRange, groupInfo.expandInfo);
                        if(idx >= 0) {
                            return groupInfo.expandInfo[idx];
                        }
                    }
                }
                return null;
            };
            groupHelper.isParentCollapsed = // level: 1-based level of the cellRange.
            function isParentCollapsed(leaves, cellRange, level) {
                if(level === 1) {
                    return false;
                }
                for(var i = level; i > 1; i--) {
                    var parentGroupRange = wijmo.grid.groupHelper.getParentGroupRange(leaves, cellRange, i);
                    if(!parentGroupRange) {
                        return false;
                    }
                    if(!parentGroupRange.isExpanded) {
                        return true;
                    }
                    cellRange = parentGroupRange.cr;
                }
                return false;
            };
            groupHelper.isParentExpanded = // level: 1-based level of the cellRange.
            function isParentExpanded(leaves, cellRange, level) {
                if(level === 1) {
                    return true;
                }
                for(var i = level; i > 1; i--) {
                    var parentGroupRange = wijmo.grid.groupHelper.getParentGroupRange(leaves, cellRange, i);
                    if(!parentGroupRange || (parentGroupRange && parentGroupRange.isExpanded)) {
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
        /** @ignore */
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
        /** @ignore */
        var merger = (function () {
            function merger() {
            }
            merger.prototype.merge = function (data, visibleLeaves) {
                this._leaves = visibleLeaves;
                this._data = data;
                try  {
                    this._merge();
                }finally {
                    delete this._data;
                    delete this._leaves;
                }
            };
            merger.prototype._merge = function () {
                var i, len, leaf, firstLeaf = true;
                for(i = 0 , len = this._leaves.length; i < len; i++) {
                    leaf = this._leaves[i];
                    if((leaf.dataIndex >= 0) && !leaf.isBand && (leaf.rowMerge === "free" || leaf.rowMerge === "restricted")) {
                        if(firstLeaf) {
                            this._data.ensureNotLazy();
                            firstLeaf = false;
                        }
                        this._mergeColumn(leaf);
                    }
                }
            };
            merger.prototype._mergeColumn = function (column) {
                var dataIdx = column.dataIndex, row, i, len, range, span, spannedRow;
                for(i = 0 , len = this._data.count(); i < len; i++) {
                    row = this._data.row(i);
                    if(!row.isDataRow()) {
                        continue;
                    }
                    range = this._getCellRange(i, column);
                    if(range.r1 !== range.r2) {
                        span = range.r2 - range.r1 + 1;
                        //this.data[range.r1][dataIdx].rowSpan = span;
                        this._data.row(range.r1).cell(dataIdx).ensureAttr().rowSpan = span;
                        for(spannedRow = range.r1 + 1; spannedRow <= range.r2; spannedRow++) {
                            //this.data[spannedRow][dataIdx] = null;
                            this._data.row(spannedRow).cell(dataIdx).visible(false);
                        }
                    }
                    i = range.r2;
                }
            };
            merger.prototype._getCellRange = function (rowIdx, column) {
                var columnIdx = column.dataIndex, row, range = new wijmo.grid.cellRange(rowIdx, columnIdx), str = (this._data.valueAt(rowIdx, columnIdx) || "").toString(), dataLen = this._data.count(), leafIdx, prevLeaf, range2;
                for(range.r2 = rowIdx; range.r2 < dataLen - 1; range.r2++) {
                    row = this._data.row(range.r2 + 1);
                    //if ((dataItem.rowType !== "data") || (dataItem[columnIdx].value !== str)) {
                    if(!row.isDataRow() || ((row.valueCell(columnIdx).value || "").toString() !== str)) {
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
    /// <reference path="../../../wijutil/jquery.wijmo.wijutil.ts" />
    (function (grid) {
        "use strict";
        var $ = jQuery;
        grid.EXPANDO = "__wijgrid";
        /**
        * Specifies the type of a row in the grid.
        */
        (function (rowType) {
            rowType._map = [];
            /** The header row. */
            rowType.header = 1;
            /** Data row. */
            rowType.data = 2;
            /** Alternating data row (used only as modifier of the rowType.data, not as an independent value). */
            rowType.dataAlt = 4;
            /** Filter row. */
            rowType.filter = 8;
            /** Group header row. */
            rowType.groupHeader = 16;
            /** Group footer row. */
            rowType.groupFooter = 32;
            /** Footer row. */
            rowType.footer = 64;
            /** Infrastructure. */
            rowType.emptyDataRow = 128;
        })(grid.rowType || (grid.rowType = {}));
        var rowType = grid.rowType;
        /**
        * Determines an object render state. This enumeration can be used with the cellStyleFormatter and rowStyleFormatter options to get a formatted object state.
        */
        (function (renderState) {
            renderState._map = [];
            /** This is the normal state. The object is rendered and not hovered, selected, or one of the elements determining the current position of the wijgrid. */
            renderState.none = 0;
            /** The object is being rendered. In the cellStyleFormatter, the rendered object is a table cell. In the rowStyleFormatter, the object is a table row. */
            renderState.rendering = 1;
            /** The object is one of the elements determining the current position of the wijgrid. */
            renderState.current = 2;
            /** The object is hovered over. */
            renderState.hovered = 4;
            /** The object is selected. */
            renderState.selected = 8;
            /** @ignore. */
            renderState.editing = 16;
        })(grid.renderState || (grid.renderState = {}));
        var renderState = grid.renderState;
        /**
        * Infrastructure.
        * @ignore
        */
        (function (renderStateEx) {
            renderStateEx._map = [];
            renderStateEx.none = 0;
            renderStateEx.hidden = 1;// row is hidden

            renderStateEx.collapsed = 2;
        })(grid.renderStateEx || (grid.renderStateEx = {}));
        var renderStateEx = grid.renderStateEx;
        // row is collapsed (groupHeaders only)
        /**
        * Infrastructure.
        * @ignore
        */
        (function (rowScope) {
            rowScope._map = [];
            rowScope.table = 0;
            rowScope.head = 1;
            rowScope.body = 2;
            rowScope.foot = 3;
        })(grid.rowScope || (grid.rowScope = {}));
        var rowScope = grid.rowScope;
        /**
        * Infrastructure.
        * @ignore
        */
        (function (cellRangeExtendMode) {
            cellRangeExtendMode._map = [];
            cellRangeExtendMode.none = 0;
            cellRangeExtendMode.column = 1;
            cellRangeExtendMode.row = 2;
        })(grid.cellRangeExtendMode || (grid.cellRangeExtendMode = {}));
        var cellRangeExtendMode = grid.cellRangeExtendMode;
        /**
        * Infrastructure.
        * @ignore
        */
        (function (objectMode) {
            objectMode._map = [];
            objectMode.createIfNull = 0;
            objectMode.createAlways = 1;
            objectMode.dispose = 2;
        })(grid.objectMode || (grid.objectMode = {}));
        var objectMode = grid.objectMode;
        /**
        * Determines purpose of the group row cells.
        * @ignore
        */
        (function (groupRowCellPurpose) {
            groupRowCellPurpose._map = [];
            groupRowCellPurpose.groupCell = 0;
            groupRowCellPurpose.aggregateCell = 1;
        })(grid.groupRowCellPurpose || (grid.groupRowCellPurpose = {}));
        var groupRowCellPurpose = grid.groupRowCellPurpose;
        /**
        * Infrastructure.
        * @ignore
        */
        (function (dataRowsRangeMode) {
            dataRowsRangeMode._map = [];
            dataRowsRangeMode.sketch = 0;
            dataRowsRangeMode.rendered = 1;
            dataRowsRangeMode.renderable = 2;
        })(grid.dataRowsRangeMode || (grid.dataRowsRangeMode = {}));
        var dataRowsRangeMode = grid.dataRowsRangeMode;
        /**
        * Infrastructure.
        * @ignore
        */
        (function (intersectionMode) {
            intersectionMode._map = [];
            intersectionMode.none = 0;
            intersectionMode.overlapTop = 1;
            intersectionMode.overlapBottom = 2;
            intersectionMode.reset = 3;
        })(grid.intersectionMode || (grid.intersectionMode = {}));
        var intersectionMode = grid.intersectionMode;
        /** @ignore */
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
        /** @ignore */
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
        /** @ignore */
        function validDataKey(dataKey) {
            return (dataKey && !(dataKey < 0)) || (dataKey === 0);
        }
        grid.validDataKey = validDataKey;
        /** @ignore */
        function validDate(date) {
            if(date && (date instanceof Date)) {
                return !isNaN(date.getTime());
            }
            return false;
        }
        grid.validDate = validDate;
        /** @ignore */
        function getDataType(column) {
            return column.dataType || column._underlyingDataType || "string";
        }
        grid.getDataType = getDataType;
        /** @ignore */
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
        /** @ignore */
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
        /** @ignore */
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
        /** @ignore */
        function createDynamicField(options) {
            return $.extend(true, {
            }, grid.c1basefield.prototype.options, grid.c1field.prototype.options, {
                dynamic: true,
                isLeaf: true,
                isBand: false,
                parentIdx: -1
            }, options);
        }
        grid.createDynamicField = createDynamicField;
        /** @ignore */
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
        /** @ignore */
        function ensureBounds(bounds, max) {
            if(bounds) {
                if(bounds.start < 0) {
                    bounds.start = 0;
                }
                if(bounds.end < 0) {
                    bounds.end = 0;
                }
                bounds.start = Math.min(bounds.start, max);
                bounds.end = Math.min(bounds.end, max);
            }
            return bounds;
        }
        grid.ensureBounds = ensureBounds;
        // maxDepth = -1 --  iterate through all child elements
        // default value = 3
        /** @ignore */
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
        /** @ignore */
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
        /** @ignore */
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
        /** @ignore */
        function isCustomObject(value) {
            return (value && (typeof (value) === "object") && !(value instanceof Date));
        }
        grid.isCustomObject = isCustomObject;
        /** @ignore */
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
        /** @ignore */
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
        /** @ignore */
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
                        /** @ignore */
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
        /** @ignore */
        var HTML5InputSupport = (function () {
            function HTML5InputSupport() { }
            HTML5InputSupport._requiresExtendedSupport = {
                "date": "",
                "datetime": "",
                "datetime-local": "",
                "month": "",
                "time": ""
            };
            HTML5InputSupport._supportedInputTypesCache = {
            };
            HTML5InputSupport.isExtendSupportRequired = function isExtendSupportRequired(inputType) {
                inputType = (inputType || "").toLowerCase();
                return (inputType in wijmo.grid.HTML5InputSupport._requiresExtendedSupport);
            };
            HTML5InputSupport.getDefaultInputType = function getDefaultInputType(mobileEnvironment, column) {
                var inputType = (column.inputType || "").toLowerCase();
                if(!inputType && mobileEnvironment) {
                    // provide input type automatically
                    switch(wijmo.grid.getDataType(column)) {
                        case "number":
                        case "currency":
                            inputType = "number";
                            break;
                        case "datetime":
                            inputType = "datetime";
                            break;
                    }
                }
                if(!inputType || ((inputType !== "text") && !HTML5InputSupport._isSupportedByBrowser(inputType))) {
                    inputType = "text"// fallback to "text"
                    ;
                }
                return inputType;
            };
            HTML5InputSupport.toStr = function toStr(value, inputType) {
                var result = value;
                inputType = (inputType || "").toLowerCase();
                if(wijmo.grid.HTML5InputSupport.isExtendSupportRequired(inputType)) {
                    switch(inputType) {
                        case "datetime":
                            result = (value) ? result = Globalize.format(value, "yyyy-MM-ddTHH:mm:ssZ") : "";
                            break;
                        case "datetime-local":
                            result = (value) ? result = Globalize.format(value, "yyyy-MM-ddTHH:mm:ss") : "";
                            break;
                        case "date":
                            result = (value) ? result = Globalize.format(value, "yyyy-MM-dd") : "";
                            break;
                        case "month":
                            result = (value) ? result = Globalize.format(value, "yyyy-MM") : "";
                            break;
                        case "time":
                            result = (value) ? result = Globalize.format(value, "HH:mm:ss") : "";
                            break;
                    }
                } else {
                    result = value + "";
                }
                return result;
            };
            HTML5InputSupport.parse = function parse(value, inputType) {
                var result, fallback = function (date) {
                    date = new Date(date);
                    if(!wijmo.grid.validDate(date)) {
                        date = null;
                    }
                    return date;
                };
                inputType = (inputType || "").toLowerCase();
                if(wijmo.grid.HTML5InputSupport.isExtendSupportRequired(inputType)) {
                    switch(inputType) {
                        case "datetime":
                            result = Globalize.parseDate(value, "yyyy-MM-ddTHH:mm:ssZ") || Globalize.parseDate(value, "yyyy-MM-ddTHH:mmZ") || fallback(value);
                            break;
                        case "datetime-local":
                            result = Globalize.parseDate(value, "yyyy-MM-ddTHH:mm:ss") || Globalize.parseDate(value, "yyyy-MM-ddTHH:mm") || fallback(value);
                            break;
                        case "date":
                            result = Globalize.parseDate(value, "yyyy-MM-dd") || fallback(value);
                            break;
                        case "month":
                            result = Globalize.parseDate(value, "yyyy-MM");
                            break;
                        case "time":
                            result = Globalize.parseDate(value, "HH:mm:ss") || Globalize.parseDate(value, "HH:mm");
                            ;
                            break;
                        case "number":
                            result = parseFloat(value);
                    }
                } else {
                    result = value;
                }
                return result;
            };
            HTML5InputSupport.extend = function extend(value, extendWith, inputType) {
                if(!value) {
                    value = extendWith;
                } else {
                    inputType = (inputType || "").toLowerCase();
                    switch(inputType) {
                        case "date":
                            value.setFullYear(extendWith.getFullYear(), extendWith.getMonth(), extendWith.getDate());
                            break;
                        case "month":
                            value.setFullYear(extendWith.getFullYear(), extendWith.getMonth());
                            break;
                        case "time":
                            value.setHours(extendWith.getHours());
                            value.setMinutes(extendWith.getMinutes());
                            value.setSeconds(extendWith.getSeconds());
                            break;
                        default:
                            value = extendWith;
                    }
                }
                return value;
            };
            HTML5InputSupport._isSupportedByBrowser = function _isSupportedByBrowser(inputType) {
                if(inputType) {
                    if(this._supportedInputTypesCache[inputType] === undefined) {
                        // value is not tested yet
                        var success;
                        try  {
                            var $element = $("<input type='" + inputType + "' style='display:none' />");
                            success = true;
                        } catch (e) {
                            success = false;
                        }
                        this._supportedInputTypesCache[inputType] = success && (($element[0]).type === inputType);
                    }
                    return this._supportedInputTypesCache[inputType];
                }
                return false;
            };
            return HTML5InputSupport;
        })();
        grid.HTML5InputSupport = HTML5InputSupport;
        /** @ignore */
        function getZIndex(element, minValue) {
            if (typeof minValue === "undefined") { minValue = 99; }
            var zIndex = 0;
            if(element && $.ui && $.fn.zIndex) {
                zIndex = element.zIndex()// try to get zIndex of the first z-indexed ancestor.
                ;
                if(zIndex) {
                    zIndex++// get next value
                    ;
                }
            }
            return Math.max(zIndex, minValue);
        }
        grid.getZIndex = getZIndex;
        // * taken from jQuery UI
        /** @ignore */
        function isOverAxis(x, reference, size) {
            // Determines when x coordinate is over "b" element axis
            return (x > reference) && (x < (reference + size));
        }
        grid.isOverAxis = isOverAxis;
        /** @ignore */
        function isOver(y, x, top, left, height, width) {
            // Determines when x, y coordinates is over "b" element
            return wijmo.grid.isOverAxis(y, top, height) && wijmo.grid.isOverAxis(x, left, width);
        }
        grid.isOver = isOver;
        // taken from jQuery UI *
        // ** uid
        var __uid = 0;
        /** @ignore */
        function getUID() {
            return "uid" + __uid++;
        }
        grid.getUID = getUID;
        // uid **
        /** @ignore */
        function isMobileSafari() {
            return !!(navigator && navigator.userAgent && (navigator.userAgent.match(/Mobile.*Safari/)) !== null);
        }
        grid.isMobileSafari = isMobileSafari;
        var __scrollBarSize = 0;
        /** @ignore */
        function getSuperPanelScrollBarSize() {
            if(!(__scrollBarSize > 0)) {
                if(document && document.body && $.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    // test for native wijsuperpanel mode
                    var $div;
                    try  {
                        $div = $("<div></div>").css({
                            overflow: "scroll",
                            width: 30,
                            height: 30,
                            position: "absolute",
                            visibility: "hidden"
                        }).append($("<div></div>").css({
                            width: 100,
                            height: 100
                        })).appendTo(// append a child
                        document.body);
                        __scrollBarSize = $div[0].offsetWidth - $div[0].clientWidth// measure
                        ;
                    } catch (ex) {
                    }finally {
                        if($div) {
                            $div.remove();
                        }
                    }
                }
                if(!(__scrollBarSize > 0)) {
                    __scrollBarSize = 18// use the default size of the wijsuperpanel' scrollbars
                    ;
                }
            }
            return __scrollBarSize;
        }
        grid.getSuperPanelScrollBarSize = getSuperPanelScrollBarSize;
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
    (function (grid) {
        /** @ignore */
        (function (TimeUnit) {
            TimeUnit._map = [];
            TimeUnit.Millisecond = 1;
            TimeUnit.Second = 2;
            TimeUnit.Minute = 4;
            TimeUnit.Hour = 8;
            TimeUnit.Day = 16;
            TimeUnit.Month = 32;
            TimeUnit.Year = 64;
            TimeUnit.DATE = TimeUnit.Year | TimeUnit.Month | TimeUnit.Day;
            TimeUnit.TIME = TimeUnit.Hour | TimeUnit.Minute | TimeUnit.Second | TimeUnit.Millisecond;
            TimeUnit.ALL = TimeUnit.DATE | TimeUnit.TIME;
        })(grid.TimeUnit || (grid.TimeUnit = {}));
        var TimeUnit = grid.TimeUnit;
        ;
        /** @ignore */
        var TimeUnitConverter = (function () {
            function TimeUnitConverter() { }
            TimeUnitConverter.convertInputType = /**
            * @param inputType One of the HTML input type values (date-time).
            */
            function convertInputType(inputType) {
                var formatString = wijmo.grid.TimeUnitConverter.convertInputTypeToFormatString(inputType), result = wijmo.grid.TimeUnitConverter.convertFormatString(formatString);
                return result;
            };
            TimeUnitConverter.convertInputTypeToFormatString = function convertInputTypeToFormatString(inputType) {
                // specific format values are not important here.
                switch((inputType || "").toLowerCase()) {
                    case "datetime":
                    case "datetime-local":
                        return "f";// long date, short time

                    case "date":
                        return "d";// short date

                    case "month":
                        return "Y";// year-and-month

                    case "time":
                        return "t";// short time

                }
                return "";
            };
            TimeUnitConverter.convertFormatString = /**
            * @param dateFormatString
            */
            function convertFormatString(dateFormatString) {
                var result = 0;
                if(dateFormatString) {
                    // ** check one-char standard formats **
                    if(dateFormatString.length === 1) {
                        switch(dateFormatString[0]) {
                            case "t":
                                // short Time
                                return TimeUnit.Hour | TimeUnit.Minute;
                            case "T":
                                // long Time
                                return TimeUnit.TIME;
                            case "d":
                                // short Date
                                                            case "D":
                                // long Date
                                return TimeUnit.DATE;
                            case "Y":
                                // month/year
                                return TimeUnit.Month | TimeUnit.Year;
                            case "M":
                                // month/day
                                return TimeUnit.Month | TimeUnit.Day;
                            case "f" , "F" , "S":
                                return TimeUnit.ALL;
                        }
                    }
                    // ** check custom tokens **
                                        var quoteFirst, quoteLast;
                    // remove quoted text
                    if(((quoteFirst = dateFormatString.indexOf("'")) >= 0) && ((quoteLast = dateFormatString.lastIndexOf("'")) >= 0) && (quoteFirst !== quoteLast)) {
                        dateFormatString = dateFormatString.substr(0, quoteFirst) + dateFormatString.substring(quoteLast + 1, dateFormatString.length - 1);
                    }
                    // the validness of the string is not a subject to check
                    for(var i = 0, len = dateFormatString.length; i < len; i++) {
                        switch(dateFormatString[i]) {
                            case "d":
                                // day: d, dd, ddd, dddd
                                result |= TimeUnit.Day;
                                break;
                            case "M":
                                // month: M, MM, MMM, MMMM
                                result |= TimeUnit.Month;
                                break;
                            case "y":
                                // year: yy, yyyy
                                result |= TimeUnit.Year;
                                break;
                            case "m":
                                // minute: m, mm
                                result |= TimeUnit.Minute;
                                break;
                            case "h":
                                // hour: h, hh
                                                            case "H":
                                // hour: H, HH
                                result |= TimeUnit.Hour;
                                break;
                            case "s":
                                // second: s, ss
                                result |= TimeUnit.Second;
                                break;
                            case "f":
                                // milliseconds: f, ff, fff
                                result |= TimeUnit.Millisecond;
                                break;
                        }
                    }
                }
                return result || TimeUnit.ALL;
            };
            TimeUnitConverter.cutDate = function cutDate(date, timeUnit) {
                if(date) {
                    timeUnit = ~timeUnit;
                    if(timeUnit & TimeUnit.Millisecond) {
                        date.setMilliseconds(0);
                    }
                    if(timeUnit & TimeUnit.Second) {
                        date.setSeconds(0);
                    }
                    if(timeUnit & TimeUnit.Minute) {
                        date.setMinutes(0);
                    }
                    if(timeUnit & TimeUnit.Hour) {
                        date.setHours(0);
                    }
                    if(timeUnit & TimeUnit.Day) {
                        date.setDate(1);
                    }
                    if(timeUnit & TimeUnit.Month) {
                        date.setMonth(0);
                    }
                    if(timeUnit & TimeUnit.Year) {
                        date.setFullYear(0);
                    }
                }
                return date;
            };
            return TimeUnitConverter;
        })();
        grid.TimeUnitConverter = TimeUnitConverter;
        /** @ignore */
        function lazy(eval, context) {
            var hasValue = false, value;
            return function () {
                if(!hasValue) {
                    value = context ? eval.call(context) : eval();
                    hasValue = true;
                }
                return value;
            };
        }
        grid.lazy = lazy;
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
        /** @ignore */
        var builtInFilterOperators = (function () {
            function builtInFilterOperators() { }
            builtInFilterOperators.NoFilterOp = {
                applicableTo: null,
                name: // any type
                "NoFilter",
                displayName: "No filter",
                arity: 1,
                operator: function () {
                    return true;
                }
            };
            return builtInFilterOperators;
        })();
        /** @ignore */
        var filterOperatorsCache = (function () {
            function filterOperatorsCache(wijgrid) {
                this._cache = {
                };
                var self = this;
                this._wijgrid = wijgrid;
                this._addOperator(null, builtInFilterOperators.NoFilterOp);
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
        /** @ignore */
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
                        /** @ignore */
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
                        /** @ignore */
        function getTableSectionLength(table, scope) {
            var section;
            if(table && !table.nodeType) {
                table = table[0]// jQuery
                ;
            }
            return (table && (section = this.getTableSection(table, scope))) ? section.rows.length : 0;
        }
        grid.getTableSectionLength = getTableSectionLength;
                        /** @ignore */
        function getTableSectionRow(table, scope, rowIndex) {
            var section;
            if(table && !table.nodeType) {
                table = table[0]// jQuery
                ;
            }
            return (table && (section = this.getTableSection(table, scope))) ? (section.rows[rowIndex] || null) : null;
        }
        grid.getTableSectionRow = getTableSectionRow;
                        /** @ignore */
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
                        var value = $.trim((domRow.cells[ci]).innerHTML);
                        if(value == "&nbsp;") {
                            value = "";
                        }
                        row[ci] = value;
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
        /** @ignore */
        function determineSection(cell) {
            var element = cell.parentNode.parentNode;
            switch(element.tagName.toLowerCase()) {
                case "thead":
                    return wijmo.grid.rowScope.head;
                case "tbody":
                    return wijmo.grid.rowScope.body;
                case "tfoot":
                    return wijmo.grid.rowScope.foot;
            }
            return null;
        }
        grid.determineSection = determineSection;
        /** @ignore */
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
                return (colIdx < this._width && rowIdx >= 0 && rowIdx < this._offsets.length) ? this._offsets[rowIdx][colIdx].cellIdx : -1;
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
        /** An object that represents a single cell. */
        var cellInfo = (function () {
            /** Creates an object that represents a single cell. Normally you do not need to use this method.
            * @example
            * var cell = new wijmo.grid.cellInfo(0, 0, $("#demo").data("wijmo-wijgrid"));
            * @param {Number} cellIndex The zero-based index of the required cell inside the corresponding row.
            * @param {Number} rowIndex The zero-based index of the row that contains required cell.
            * @param {Object} wijgrid The wijgrid instance.
            * @returns {wijmo.grid.cellInfo} Object that represents a single cell.
            */
            function cellInfo(cellIndex, rowIndex, wijgrid, absolute, virtualize) {
                if (typeof wijgrid === "undefined") { wijgrid = null; }
                if (typeof absolute === "undefined") { absolute = false; }
                if (typeof virtualize === "undefined") { virtualize = true; }
                this.__isEdit = false;
                this._wijgrid = wijgrid;
                this._virtualize = virtualize;
                if(absolute) {
                    this._ci = cellIndex - this._wijgrid._getDataToAbsOffset().x;
                    this._ri = rowIndex - this._wijgrid._getDataToAbsOffset().y;
                    if(this._virtualize) {
                        this._ri = this._wijgrid._renderableBoundsCollection().getAbsIndex(this._ri + this._wijgrid._viewPortBounds().start);
                    }
                } else {
                    this._ci = cellIndex;
                    this._ri = rowIndex;
                }
            }
            cellInfo.outsideValue = new cellInfo(-1, -1, null);
            cellInfo.prototype.cellIndexAbs = // public
            /** @ignore */
            function () {
                return this._ci + this._wijgrid._getDataToAbsOffset().x;
            };
            cellInfo.prototype.rowIndexAbs = /** @ignore */
            function () {
                var value = this._virtualize ? this._wijgrid._renderableBoundsCollection().getRenderedIndex(this._ri) - this._wijgrid._viewPortBounds().start : this._ri;
                value += this._wijgrid._getDataToAbsOffset().y;
                return value;
            };
            cellInfo.prototype.cellIndex = /** @ignore */
            function (value) {
                if(!arguments.length) {
                    return this._ci;
                }
                this._ci = value;
            };
            cellInfo.prototype.column = /** Gets the associated column object.
            * @example
            * var column = cellInfoObj.column();
            * @returns {wijmo.grid.IColumn} The associated column object.
            */
            function () {
                if(this._wijgrid && this._isValid()) {
                    return this._wijgrid._field("visibleLeaves")[this.cellIndexAbs()];
                }
                return null;
            };
            cellInfo.prototype.container = /** Returns the jQuery object containing a cell content.
            * @example
            * var $container = cellInfoObj.container();
            * @returns {Object} The jQuery object containing a cell content.
            */
            function () {
                var tableCell = this.tableCell(), $innerDiv;
                if(tableCell) {
                    $innerDiv = $(tableCell).children("div." + wijmo.grid.wijgrid.CSS.cellContainer);
                    if($innerDiv) {
                        return $innerDiv;
                    }
                }
                return null;
            };
            cellInfo.prototype.isEqual = /** Compares the current object with an object you have specified and indicates whether they are identical
            * @example
            * var isEqual = cellInfoObj1.isEqual(cellInfoObj2);
            * @param {wijmo.grid.cellInfo} value The object to compare
            * @returns {Boolean} True if the objects are identical, otherwise false.
            */
            function (value) {
                return (value && (value.rowIndex() === this.rowIndex()) && (value.cellIndex() === this.cellIndex()));
            };
            cellInfo.prototype.row = /** Gets the accociated row's information.
            * @example
            * var row = cellInfoObj.row();
            * @returns {wijmo.grid.IRowInfo} Information about associated row.
            */
            function () {
                var rowObj = null, result = null;
                if(this._wijgrid) {
                    if(this._virtualize) {
                        result = this._wijgrid._view()._getRowInfoBySketchRowIndex(this.rowIndex());
                    } else {
                        rowObj = this._wijgrid._view().rows().item(this.rowIndexAbs());
                        if(rowObj && rowObj.length) {
                            result = this._wijgrid._view()._getRowInfo(rowObj);
                        }
                    }
                }
                return result;
            };
            cellInfo.prototype.rowIndex = /** @ignore */
            function (value) {
                if(!arguments.length) {
                    return this._ri;
                }
                this._ri = value;
            };
            cellInfo.prototype.tableCell = /** Returns the table cell element corresponding to this object.
            * @example
            * var domCell = cellInfoObj.tableCell();
            * @returns {HTMLTableCellElement} The table cell element corresponding to this object.
            */
            function () {
                if(this._wijgrid && this._isValid()) {
                    if(!this._virtualize || this._isRendered()) {
                        return this._wijgrid._view().getCell(this.cellIndexAbs(), this.rowIndexAbs());
                    }
                }
                return null;
            };
            cellInfo.prototype.value = /** @ignore */
            function (value/*opt*/ ) {
                var column, rowInfo, colVal;
                if(this._wijgrid && this._isValid()) {
                    rowInfo = this.row();
                    if(rowInfo.type & wijmo.grid.rowType.data) {
                        column = this.column();
                        if(arguments.length === 0) {
                            // getter
                            colVal = this._wijgrid._dataViewWrapper.getValue(rowInfo.data, column.dataKey);
                            return this._wijgrid.parse(column, colVal);
                        } else {
                            // setter
                            // validation
                            value = this._wijgrid.parse(column, value);
                            if((value === null && column.valueRequired) || ((wijmo.grid.getDataType(column) !== "string") && isNaN(value))) {
                                throw "invalid value";
                            }
                            // update dataView
                            this._wijgrid._dataViewWrapper.setValue(rowInfo.dataItemIndex, column.dataKey, value);
                            // keep sketchTable values in sync (to avoid issues during virtual scrolling)
                            var sketchRow = this._wijgrid.sketchTable.row(this.rowIndex());
                            var sketchCell = sketchRow.cell(column.dataIndex);
                            sketchCell.value = value;
                        }
                    }
                }
            };
            cellInfo.prototype.toString = /** @ignore */
            function () {
                return this.cellIndex() + ":" + this.rowIndex();
            };
            cellInfo.prototype._clip = // internal
            function (range, absolute) {
                if (typeof absolute === "undefined") { absolute = false; }
                var flag = false, val;
                if(absolute) {
                    if(this.cellIndexAbs() < (val = range.topLeft().cellIndexAbs())) {
                        flag = true;
                        this._ci = range.topLeft().cellIndex();
                    }
                    if(this.cellIndexAbs() > (val = range.bottomRight().cellIndexAbs())) {
                        flag = true;
                        this._ci = range.bottomRight().cellIndex();
                    }
                    if(this.rowIndexAbs() < (val = range.topLeft().rowIndexAbs())) {
                        flag = true;
                        this._ri = range.topLeft().rowIndex();
                    }
                    if(this.rowIndexAbs() > (val = range.bottomRight().rowIndexAbs())) {
                        flag = true;
                        this._ri = range.bottomRight().rowIndex();
                    }
                } else {
                    if(this.cellIndex() < (val = range.topLeft().cellIndex())) {
                        flag = true;
                        this._ci = val;
                    }
                    if(this.cellIndex() > (val = range.bottomRight().cellIndex())) {
                        flag = true;
                        this._ci = val;
                    }
                    if(this.rowIndex() < (val = range.topLeft().rowIndex())) {
                        flag = true;
                        this._ri = val;
                    }
                    if(this.rowIndex() > (val = range.bottomRight().rowIndex())) {
                        flag = true;
                        this._ri = val;
                    }
                }
                return flag;
            };
            cellInfo.prototype._clone = function () {
                return new wijmo.grid.cellInfo(this.cellIndex(), this.rowIndex(), this._wijgrid, false, this._virtualize);
            };
            cellInfo.prototype._isValid = function () {
                return this.cellIndex() >= 0 && this.rowIndex() >= 0;
            };
            cellInfo.prototype._isRendered = function () {
                var view;
                if(this._wijgrid && (view = this._wijgrid._view()) && this._isValid()) {
                    var bodyIndex = view._isRowRendered(this.rowIndex());
                    return bodyIndex >= 0;
                }
                return false;
            };
            cellInfo.prototype._isEdit = function (value) {
                var tableCell = null, marker = wijmo.grid.wijgrid.CSS.editedCellMarker;
                if(this._isValid()) {
                    try  {
                        tableCell = this.tableCell();
                    } catch (e) {
                    }
                }
                if(!arguments.length) {
                    if(tableCell) {
                        return $(tableCell).hasClass(marker);
                    }
                    return this.__isEdit;
                } else {
                    if(tableCell) {
                        $(tableCell)[value ? "addClass" : "removeClass"](marker);
                    }
                    this.__isEdit = value;
                }
            };
            cellInfo.prototype._setGridView = function (value) {
                this._wijgrid = value;
            };
            return cellInfo;
        })();
        grid.cellInfo = cellInfo;
        // internal *
        // * private
        // private *
        /** An object that specifies a range of cells determined by two cells. */
        var cellInfoRange = (function () {
            /** Creates an object that specifies a range of cells determined by two cells. Normally you do not need to use this method.
            * @example
            * var range = wijmo.grid.cellInfoRange(new wijmo.grid.cellInfo(0, 0), new wijmo.grid.cellInfo(0, 0));
            * @param {wijmo.grid.cellInfo} topLeft Object that represents the top left cell of the range.
            * @param {wijmo.grid.cellInfo} bottomRight Object that represents the bottom right cell of the range.
            * @returns {wijmo.grid.cellInfoRange} Object that specifies a range of cells determined by two cells.
            */
            function cellInfoRange(topLeft, bottomRight) {
                if(!topLeft || !bottomRight) {
                    throw "invalid arguments";
                }
                this._topLeft = topLeft._clone();
                this._bottomRight = bottomRight._clone();
            }
            cellInfoRange.prototype.bottomRight = /** Gets the object that represents the bottom right cell of the range.
            * @example
            * var cellInfoObj = range.bottomRight();
            * @returns {wijmo.grid.cellInfo} The object that represents the bottom right cell of the range.
            */
            function () {
                return this._bottomRight;
            };
            cellInfoRange.prototype.isEqual = /** Compares the current range with a specified range and indicates whether they are identical.
            * @example
            * var isEqual = range1.isEqual(range2);
            * @param {wijmo.grid.cellInfoRange} range Range to compare.
            * @returns True if the ranges are identical, otherwise false.
            */
            function (range) {
                return (range && this._topLeft.isEqual(range.topLeft()) && this._bottomRight.isEqual(range.bottomRight()));
            };
            cellInfoRange.prototype.topLeft = /** Gets the object that represents the top left cell of the range.
            * @example
            * var cellInfoObj = range.topLeft();
            * @returns {wijmo.grid.cellInfo} The object that represents the top left cell of the range.
            */
            function () {
                return this._topLeft;
            };
            cellInfoRange.prototype.toString = /** @ignore */
            function () {
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
                var a = this._topLeft._clip(clipBy, absolute);
                var b = this._bottomRight._clip(clipBy, absolute);
                return a || b;
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
                if(mode === wijmo.grid.cellRangeExtendMode.column) {
                    this._topLeft.rowIndex(borders.topLeft().rowIndex());
                    this._bottomRight.rowIndex(borders.bottomRight().rowIndex());
                } else {
                    if(mode === wijmo.grid.cellRangeExtendMode.row) {
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
            cellInfoRange.prototype._height = function () {
                return this._bottomRight.rowIndex() - this._topLeft.rowIndex();
            };
            cellInfoRange.prototype._width = function () {
                return this._bottomRight.cellIndex() - this._topLeft.cellIndex();
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
    /// <reference path="htmlTableAccessor.ts" />
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /** @ignore */
        var baseView = (function () {
            function baseView(wijgrid, renderBounds) {
                this._rowHeaderSize = 22;
                this.mIsRendered = false;
                this._sizesAdjCache = {
                    th: 0,
                    col: 0,
                    subTable: 0
                };
                if(!wijgrid) {
                    throw "'wijgrid' must be specified";
                }
                this._wijgrid = wijgrid;
                this._bounds = renderBounds;
                this._wijgrid.element.addClass(wijmo.grid.wijgrid.CSS.table).addClass(this._wijgrid.options.wijCSS.wijgridTable);
            }
            baseView.prototype.dispose = function () {
                this.toggleDOMSelection(true);
                this._wijgrid.element.removeClass(wijmo.grid.wijgrid.CSS.table).removeClass(this._wijgrid.options.wijCSS.wijgridTable);
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
            baseView.prototype.getVisibleAreaBounds = function (client) {
                throw "not implemented";
            };
            baseView.prototype.getVisibleContentAreaBounds = function () {
                throw "not implemented";
            };
            baseView.prototype.getFixedAreaVisibleBounds = function () {
                throw "not implemented";
            };
            baseView.prototype.isRendered = function () {
                return this.mIsRendered;
            };
            baseView.prototype.render = function () {
                this._ensureRenderBounds();
                this._preRender();
                //var display = this._wijgrid.outerDiv.css("display"); // hide outer element to improve performance.
                //this._wijgrid.outerDiv.css("display", "none");
                this._renderContent();
                //this._wijgrid.outerDiv.css("display", display);
                this._postRender();
                //if (this._wijgrid.outerDiv.is(":visible")) {
                //	this._wijgrid.outerDiv.wijTriggerVisibility(); // notify children widgets
                //}
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
            baseView.prototype.getInlineTotalWidth = function () {
                throw "not implemented";
            };
            baseView.prototype.bodyRows = // public **
            // ** DOMTable abstraction
            // ** rows accessors
            function () {
                if(!this._bodyRowsAccessor) {
                    if(!this.isRendered()) {
                        throw "not rendered yet";
                    }
                    this._bodyRowsAccessor = new wijmo.grid.rowAccessor(this, wijmo.grid.rowScope.body, 0, 0);
                }
                return this._bodyRowsAccessor;
            };
            baseView.prototype.filterRow = function () {
                if(this._wijgrid.options.showFilter) {
                    if(!this.isRendered()) {
                        throw "not rendered yet";
                    }
                    var accessor = new wijmo.grid.rowAccessor(this, wijmo.grid.rowScope.head, 0, 0);
                    return accessor.item(accessor.length() - 1);// filter is the last row in the tHead section

                }
                return null;
            };
            baseView.prototype.footerRow = function () {
                if(this._wijgrid.options.showFooter) {
                    if(!this.isRendered()) {
                        throw "not rendered yet";
                    }
                    var accessor = new wijmo.grid.rowAccessor(this, wijmo.grid.rowScope.foot, 0, 0);
                    return accessor.item(0);
                }
            };
            baseView.prototype.headerRows = function () {
                var bottomOffset;
                if(!this._headerRowsAccessor) {
                    if(!this.isRendered()) {
                        throw "not rendered yet";
                    }
                    bottomOffset = this._wijgrid.options.showFilter ? 1 : 0;
                    this._headerRowsAccessor = new wijmo.grid.rowAccessor(this, wijmo.grid.rowScope.head, 0, bottomOffset);
                }
                return this._headerRowsAccessor;
            };
            baseView.prototype.rows = function () {
                if(!this._rowsAccessor) {
                    if(!this.isRendered()) {
                        throw "not rendered yet";
                    }
                    this._rowsAccessor = new wijmo.grid.rowAccessor(this, wijmo.grid.rowScope.table, 0, 0);
                }
                return this._rowsAccessor;
            };
            baseView.prototype.focusableElement = // rows accessors **
            function () {
                return this._wijgrid.outerDiv;
            };
            baseView.prototype.forEachColumnCell = function (columnIndex, callback, param) {
                throw "not implemented";
            };
            baseView.prototype.forEachRowCell = function (rowIndex, callback, param) {
                throw "not implemented";
            };
            baseView.prototype.getAbsoluteCellInfo = // important: only body cells can be virtualized
            function (domCell, virtualize) {
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

                this.mIsRendered = true;
                this.ensureDisabledState();
                // ** cache some values to speedup sizes manipulation (using IE especially) **
                // reset
                this._sizesAdjCache.col = 0;
                this._sizesAdjCache.th = 0;
                this._sizesAdjCache.subTable = 0;
                // set a new values
                var leaves = this._wijgrid._field("visibleLeaves");
                if(leaves.length > 0) {
                    // note: we assume that the margins, paddings and borders are common to all of the th\ col elements.
                                        var th = this.getHeaderCell(0), cols = this.getJoinedCols(0);
                    if(th) {
                        this._sizesAdjCache.th = $(th).leftBorderWidth() + $(th).rightBorderWidth();
                    }
                    if(cols && cols.length) {
                        this._sizesAdjCache.col = $(cols[0]).leftBorderWidth() + $(cols[0]).rightBorderWidth();
                    }
                }
                var subTable = this.subTables()[0];
                this._sizesAdjCache.subTable = $(subTable.element()).leftBorderWidth() + $(subTable.element()).rightBorderWidth();
            };
            baseView.prototype._preRender = function () {
                this.mIsRendered = false;
            };
            baseView.prototype._ensureRenderBounds = function () {
                var dataRange = this._wijgrid._getDataCellsRange(grid.dataRowsRangeMode.sketch);
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
                var rt = wijmo.grid.rowType, rs = wijmo.grid.renderState, cht = this._wijgrid._columnsHeadersTable(), i, height, rowInfo;
                if(cht && (height = cht.length)) {
                    for(i = 0; i < height; i++) {
                        rowInfo = this._insertEmptyRow(rt.header, rs.rendering, i, -1, -1, -1, undefined, {
                        });
                        this._renderRow(rowInfo, null, cht[i]);
                    }
                }
            };
            baseView.prototype._renderFilter = function () {
                var rowInfo = this._insertEmptyRow(wijmo.grid.rowType.filter, wijmo.grid.renderState.rendering, -1, -1, -1, -1, undefined, {
                });
                this._renderRow(rowInfo, this._wijgrid._field("visibleLeaves"), null);
            };
            baseView.prototype._renderBody = function () {
                var rs = wijmo.grid.renderState, visibleLeaves = this._wijgrid._field("visibleLeaves"), sketch = this._wijgrid.sketchTable, dataRowIndex = -1, virtualDataItemIndexBase = 0, cnt = 0, dataOffset = this._wijgrid._dataOffset;
                // >= 0 when server-side virtual scrolling is used.
                                // render rows
                var self = this;
                if(this._bounds.start >= 0 && this._bounds.end >= 0) {
                    this._wijgrid._renderableBoundsCollection().forEachIndex(this._bounds.start, this._bounds.end - this._bounds.start + 1, function (idx) {
                        var sketchRow = sketch.row(idx - dataOffset), isDataRow = sketchRow.isDataRow(), groupKey = (sketchRow).groupByValue, rowInfo = self._insertEmptyRow(sketchRow.rowType, rs.rendering, cnt++, // sectionRowIndex
                        isDataRow ? ++dataRowIndex : -1, sketchRow.dataItemIndex(), sketchRow.dataItemIndex(virtualDataItemIndexBase), groupKey, sketchRow.extInfo);
                        self._renderRow(rowInfo, visibleLeaves, sketchRow);
                    });
                }
            };
            baseView.prototype._renderFooter = function () {
                var rowInfo = this._insertEmptyRow(wijmo.grid.rowType.footer, wijmo.grid.renderState.rendering, -1, -1, -1, -1, undefined, {
                });
                this._renderRow(rowInfo, this._wijgrid._field("visibleLeaves"), null);
            };
            baseView.prototype._insertEmptyRow = function (rowType, renderState, sectionRowIndex, dataRowIndex, dataItemIndex, virtualDataItemIndex, groupByValue, extInfo) {
                var domRow = this._wijgrid._onViewInsertEmptyRow.apply(this._wijgrid, arguments), domRowArr = this._insertRow(rowType, sectionRowIndex, domRow);
                if(renderState === undefined) {
                    renderState = wijmo.grid.renderState.rendering;
                }
                return this._createRowInfo(domRowArr, rowType, renderState, sectionRowIndex, dataRowIndex, dataItemIndex, virtualDataItemIndex, groupByValue, extInfo);
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
                    innerContainer.className = wijmo.grid.wijgrid.CSS.cellContainer + " " + this._wijgrid.options.wijCSS.wijgridCellContainer;
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
            baseView.prototype._renderRow = // item is a sketchRow or IColumnHeaderInfo[] if row is the header row.
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
                        rowAttr = item.attr();
                        rowStyle = item.style();
                        break;
                    case $rt.emptyDataRow:
                    case $rt.groupHeader:
                    case $rt.groupFooter:
                        this._renderSpannedRow(rowInfo, visibleLeaves, item);
                        rowAttr = item.attr();
                        rowStyle = item.style();
                        break;
                    default:
                        throw "unknown rowType";
                }
                this._rowRendered(rowInfo, rowAttr, rowStyle);
            };
            baseView.prototype._renderCell = function (rowInfo, cellIndex, value, useHtml, leaf, state, attr, style) {
                var $cell = this._createEmptyCell(rowInfo, leaf.dataIndex, leaf);
                var $container = (rowInfo.type === wijmo.grid.rowType.filter) ? $cell : $($cell[0].firstChild);// $cell.children("div"); -- slow

                this._appendCell(rowInfo, cellIndex, $cell);
                if(useHtml) {
                    $container.html(value);
                } else {
                    this._wijgrid.cellFormatter.format($cell, $container, leaf, value, rowInfo);
                }
                this._cellRendered(rowInfo, $cell, cellIndex, leaf, state, attr, style);
            };
            baseView.prototype._renderDataRow = function (rowInfo, visibleLeaves, sketchRow) {
                var i, len, column, dataIndex, cellValue, cellAttr, cellStyle, cellState;
                for(i = 0 , len = visibleLeaves.length; i < len; i++) {
                    column = visibleLeaves[i];
                    dataIndex = column.dataIndex;
                    if(dataIndex < 0) {
                        // unbound column
                        cellAttr = null;
                        cellStyle = null;
                        cellValue = null;
                    } else {
                        var cell = sketchRow.cell(dataIndex);
                        if(!cell || !cell.visible()) {
                            continue;
                        }
                        cellValue = this._wijgrid.toStr(column, cell.value);
                        cellAttr = cell.attr();
                        cellStyle = cell.style();
                    }
                    cellState = rowInfo.state;
                    if(column.readOnly) {
                        cellState &= ~wijmo.grid.renderState.editing;
                    }
                    this._renderCell(rowInfo, i, cellValue, false, column, cellState, cellAttr, cellStyle);
                }
            };
            baseView.prototype._renderFilterRow = function (rowInfo, visibleLeaves) {
                var i, len, leaf;
                for(i = 0 , len = visibleLeaves.length; i < len; i++) {
                    leaf = visibleLeaves[i];
                    this._renderCell(rowInfo, i, wijmo.grid.filterHelper.getSingleValue(leaf.filterValue), false, leaf, rowInfo.state);
                }
            };
            baseView.prototype._renderFooterRow = function (rowInfo, visibleLeaves) {
                var i, len;
                for(i = 0 , len = visibleLeaves.length; i < len; i++) {
                    this._renderCell(rowInfo, i, "", false, visibleLeaves[i], rowInfo.state);
                }
            };
            baseView.prototype._renderHeaderRow = function (rowInfo, item) {
                var i, len, thX = 0, headerInfo;
                for(i = 0 , len = item.length; i < len; i++) {
                    headerInfo = item[i];
                    if(headerInfo.column && headerInfo.column.parentVis) {
                        headerInfo.column.thX = thX++;
                        headerInfo.column.thY = rowInfo.sectionRowIndex;
                        this._renderCell(rowInfo, i, headerInfo.column.headerText, false, headerInfo.column, rowInfo.state, {
                            colSpan: headerInfo.colSpan,
                            rowSpan: headerInfo.rowSpan
                        });
                    }
                }
            };
            baseView.prototype._renderSpannedRow = function (rowInfo, visibleLeaves, sketchRow) {
                var i, leaf, len = Math.min(visibleLeaves.length, sketchRow.cellCount());
                for(i = 0; i < len; i++) {
                    var useHTML = rowInfo.type === wijmo.grid.rowType.emptyDataRow;// ignore cellFormatter and set content directly

                    var cell = sketchRow.cell(i);
                    this._renderCell(rowInfo, i, cell.html, useHTML, visibleLeaves[i], rowInfo.state, cell.attr(), cell.style());
                }
            };
            baseView.prototype._cellRendered = function (rowInfo, $cell, cellIndex, leaf, cellState, attr, style) {
                this._wijgrid.cellStyleFormatter.format($cell, cellIndex, leaf, rowInfo, cellState, attr, style);
                this._changeCellRenderState($cell, cellState, false);
                this._wijgrid._onViewCellRendered(rowInfo, $cell, cellIndex, leaf);
            };
            baseView.prototype._rowRendered = function (rowInfo, rowAttr, rowStyle) {
                this._wijgrid.rowStyleFormatter.format(rowInfo, rowAttr, rowStyle);
                // change renderState AND associate rowInfo object with DOMRow
                //this._changeRowRenderState(rowInfo, $.wijmo.wijgrid.renderState.rendering, false);
                rowInfo.state &= ~wijmo.grid.renderState.rendering;
                this._setRowInfo(rowInfo.$rows, rowInfo);
                this._wijgrid._onViewRowRendered(rowInfo, rowAttr, rowStyle);
            };
            baseView.prototype._makeRowEditable = function (rowInfo) {
                var leaves = this._wijgrid._field("visibleLeaves"), cellEditor = new wijmo.grid.cellEditorHelper();
                if(leaves) {
                    for(var i = 0; i < leaves.length; i++) {
                        var column = leaves[i];
                        if(!column.readOnly && wijmo.grid.validDataKey(column.dataKey)) {
                            var $cell = rowInfo.$rows.children("td, th").eq(i);
                            if($cell.length) {
                                var cellInfo = this.getAbsoluteCellInfo($cell[0], true);
                                this._changeCellRenderState($cell, wijmo.grid.renderState.editing, cellEditor.cellEditStart(this._wijgrid, cellInfo, null))// add or remove editing state depends on cellEditStart result.
                                ;
                            }
                        }
                    }
                }
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
            function (maxWidthArray, minWidthArray, expectedWidth, ensureColumnsPxWidth) {
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
            baseView.prototype._getColumnWidth = function (index) {
                var result, leaf = this._wijgrid._field("visibleLeaves")[index];
                if(leaf._realWidth !== undefined) {
                    result = {
                        width: leaf._realWidth,
                        real: true
                    };
                } else if(leaf.isRowHeader) {
                    result = {
                        width: this._rowHeaderSize,
                        real: true
                    };
                } else {
                    var maxW = 0, joinedTables = this.getJoinedTables(true, index), relIdx = joinedTables[2];
                    for(var i = 0; i < 2; i++) {
                        var table = joinedTables[i];
                        if(table !== null) {
                            var rows = table.element().rows, row, len = rows.length;
                            if(len > 0) {
                                // try to find a row which doesn't contains a spanned cells
                                for(var j = len - 1, row = null; j >= 0; j--) {
                                    if((rows[j]).cells.length === table.width()) {
                                        row = rows[j];
                                        if(row.style.display !== "none") {
                                            break;// break on first visible row, skip invisible rows

                                        }
                                    }
                                }
                                if(row) {
                                    // can be invisible
                                    var cell = row.cells[relIdx];
                                    maxW = Math.max(maxW, $(cell).outerWidth());
                                }
                            }
                        }
                    }
                    result = {
                        width: maxW,
                        real: false
                    };
                }
                return result;
            };
            baseView.prototype._setColumnWidth = function (index, px) {
                var th = this.getHeaderCell(index), cols = this.getJoinedCols(index), value;
                if(px) {
                    var self = this;
                    // $(th).setOutWidth(px); // very slow in IE9
                    if(th) {
                        value = px - this._sizesAdjCache.th;
                        if(value < 0) {
                            value = 0;
                        }
                        th.style.width = value + "px";
                    }
                    $.each(cols, function (i, col) {
                        if(col) {
                            // $(col).setOutWidth(px); // very slow in IE9
                            value = px - self._sizesAdjCache.col;
                            if(value < 0) {
                                value = 0;
                            }
                            col.style.width = value + "px";
                        }
                    });
                }
            };
            baseView.prototype._setTableWidth = function (subTables, expectedWidth, expandColumnWidth, expandIndex) {
                var after, diff, self = this;
                $.each(subTables, function (index, table) {
                    //table.css("table-layout", "fixed").setOutWidth(expectedWidth); // very slow in IE9
                    table[0].style.tableLayout = "fixed";
                    table[0].style.width = (expectedWidth - self._sizesAdjCache.subTable) + "px";
                });
                after = subTables[0].outerWidth();
                diff = after - expectedWidth;
                if(diff !== 0) {
                    this._setColumnWidth(expandIndex, expandColumnWidth - diff);
                }
            };
            baseView.prototype._sumWidthArray = function (widthArray, startIndex, endIndex) {
                var result = 0;
                $.each(widthArray, function (index, colWidth) {
                    if(startIndex !== undefined && endIndex !== undefined && (index < startIndex || index > endIndex)) {
                        return true;
                    }
                    result += colWidth.width;
                });
                return result;
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
            baseView.prototype._removeBodyRow = function (sectionRowIndex, changeOffsets) {
                if (typeof changeOffsets === "undefined") { changeOffsets = true; }
                var $rt = wijmo.grid.rowType, rows = this._wijgrid._rows(), i, len, rowInfo, absRowIdx;
                if((sectionRowIndex >= 0) && (sectionRowIndex < (len = rows.length()))) {
                    // remove DOMRows
                    rowInfo = this._getRowInfo(rows.item(sectionRowIndex), false);
                    absRowIdx = this.getAbsoluteRowIndex(rowInfo.$rows[0]);
                    rowInfo.$rows.remove();
                    // ** update offsets
                    if(changeOffsets) {
                        var joinedTables = this.getJoinedTables(false, absRowIdx), ta;
                        if(ta = joinedTables[0]) {
                            ta.removeOffset(joinedTables[2]);
                        }
                        if(ta = joinedTables[1]) {
                            ta.removeOffset(joinedTables[2]);
                        }
                    }
                    // update offsets **
                                    }
            };
            baseView.prototype._insertBodyRow = function (sketchRow, sectionRowIndex, dataItemIndex, virtualDataItemIndex) {
                var visibleLeaves = this._wijgrid._field("visibleLeaves"), $rt = wijmo.grid.rowType, view = this._wijgrid._view(), rows = this._wijgrid._rows(), len = rows.length(), isDataRow = sketchRow.isDataRow(), rowInfo, absRowIdx;
                if(sectionRowIndex < 0 || sectionRowIndex >= len || (!sectionRowIndex && sectionRowIndex !== 0)) {
                    sectionRowIndex = len// append
                    ;
                }
                rowInfo = this._insertEmptyRow(sketchRow.rowType, sketchRow.renderState, sectionRowIndex, -1, // TODO: dataRowIndex
                dataItemIndex, virtualDataItemIndex, (sketchRow).groupByValue, sketchRow.extInfo);
                this._renderRow(rowInfo, visibleLeaves, sketchRow);
                // ** update offsets
                absRowIdx = this.getAbsoluteRowIndex(rowInfo.$rows[0]);
                var joinedTables = this.getJoinedTables(false, absRowIdx), ta;
                if(ta = joinedTables[0]) {
                    ta.insertOffset(absRowIdx);
                }
                if(ta = joinedTables[1]) {
                    ta.insertOffset(absRowIdx);
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
            baseView.prototype._getRowInfo = function (rowObj, retrieveDataItem) {
                if (typeof retrieveDataItem === "undefined") { retrieveDataItem = true; }
                var wijgrid = this._wijgrid, $rows = rowObj[1] ? $(rowObj) : $(rowObj[0]), rowInfo = wijmo.grid.dataPrefix($rows, wijgrid._data$prefix, "rowInfo"), tmp;
                // add $rows property
                rowInfo.$rows = $rows;
                // set data property
                if(retrieveDataItem && (rowInfo.dataItemIndex >= 0) && (rowInfo.type & wijmo.grid.rowType.data)) {
                    try  {
                        rowInfo.data = wijgrid._getDataItem(rowInfo.dataItemIndex);
                    } catch (ex) {
                        rowInfo.data = null// underlying data item was removed?
                        ;
                    }
                }
                return rowInfo;
            };
            baseView.prototype._getRowInfoBySketchRowIndex = function (sketchIndex, retrieveDataItem) {
                if (typeof retrieveDataItem === "undefined") { retrieveDataItem = true; }
                if(sketchIndex >= 0) {
                    var renderedRowIndex = this._isRowRendered(sketchIndex);
                    if(renderedRowIndex >= 0) {
                        var rowObj = this.bodyRows().item(renderedRowIndex);
                        if(rowObj) {
                            return this._getRowInfo(rowObj, retrieveDataItem);
                        }
                    } else {
                        // detached row
                                                var sketchRow = this._wijgrid.sketchTable.row(sketchIndex), rowInfo = null;
                        if(sketchRow) {
                            rowInfo = sketchRow.getRowInfo();
                            // set data property
                            if(retrieveDataItem && (rowInfo.dataItemIndex >= 0) && sketchRow.isDataRow()) {
                                try  {
                                    rowInfo.data = this._wijgrid._getDataItem(rowInfo.dataItemIndex);
                                } catch (ex) {
                                    rowInfo.data = null// underlying data item was removed?
                                    ;
                                }
                            }
                        }
                        return rowInfo;
                    }
                }
                return null;
            };
            baseView.prototype._createRowInfo = function (row, type, state, sectionRowIndex, dataRowIndex, dataItemIndex, virtualDataItemIndex, groupByValue, extInfo) {
                var tmp, rowInfo = {
                    type: type,
                    state: state,
                    sectionRowIndex: sectionRowIndex,
                    dataRowIndex: dataRowIndex,
                    dataItemIndex: dataItemIndex,
                    virtualDataItemIndex: virtualDataItemIndex,
                    $rows: row ? $(row) : null,
                    _extInfo: extInfo
                };
                if(groupByValue !== undefined) {
                    rowInfo.groupByValue = groupByValue;
                }
                // set data property
                if((dataItemIndex >= 0) && (type & wijmo.grid.rowType.data)) {
                    rowInfo.data = this._wijgrid._getDataItem(dataItemIndex);
                }
                return rowInfo;
            };
            baseView.prototype._isRowRendered = // returns tbody row index or -1
            function (sketchRowIndex) {
                var visibleIndex = this._wijgrid._renderableBoundsCollection().getRenderedIndex(sketchRowIndex);
                if(visibleIndex >= 0) {
                    if(visibleIndex >= this._bounds.start && visibleIndex <= this._bounds.end) {
                        return visibleIndex - this._bounds.start;
                    }
                }
                return -1;
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
        /** @ignore */
        var flatView = (function (_super) {
            __extends(flatView, _super);
            function flatView(wijgrid, renderBounds) {
                        _super.call(this, wijgrid, renderBounds);
                this._dataTable = null;
                this._contentArea = null;
            }
            flatView.prototype.ensureWidth = function (index, value, oldValue) {
                var $table = $(this._dataTable.element()), tableWidth = $table.width() + value - oldValue;
                _super.prototype.ensureWidth.call(this, index, value, oldValue);
                this._setTableWidth([
                    $table
                ], tableWidth, value, index);
            };
            flatView.prototype.getVisibleAreaBounds = function (client) {
                var bounds = wijmo.grid.bounds(this._dataTable.element(), client);
                return bounds;
            };
            flatView.prototype.getVisibleContentAreaBounds = function () {
                return this.getVisibleAreaBounds();
            };
            flatView.prototype.updateSplits = function (scrollValue) {
                var self = this, wijgrid = this._wijgrid, o = wijgrid.options, gridElement = wijgrid.element, maxWidthArray = [], minWidthArray = [], resultWidthArray = [], visibleLeaves = wijgrid._field("visibleLeaves"), outerDiv = wijgrid.outerDiv, outerWidth, expandIndex;
                gridElement.css({
                    "table-layout": "",
                    "width": "auto"
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
                    maxWidthArray.push(self._getColumnWidth(index));
                });
                gridElement.css("width", "1px");
                $.each(visibleLeaves, function (index, leaf) {
                    minWidthArray.push(self._getColumnWidth(index));
                });
                outerWidth = outerDiv.width()// using width() instead of innerWidth() to exclude padding.
                ;
                resultWidthArray = this._adjustWidthArray(maxWidthArray, minWidthArray, outerWidth, o.ensureColumnsPxWidth);
                $.each(resultWidthArray, function (index, colWidth) {
                    var leaf = visibleLeaves[index];
                    if(leaf._realWidth !== undefined) {
                        delete leaf._realWidth;
                        return;
                    }
                    self._setColumnWidth(index, colWidth.width);
                });
                gridElement.css("table-layout", "fixed")// <-- The outerDiv width can change after that
                ;
                expandIndex = resultWidthArray.length - 1;
                if(expandIndex !== -1) {
                    var delta = outerDiv.width() - outerWidth;// test changes

                    resultWidthArray[expandIndex].width += delta;
                    this._setTableWidth([
                        gridElement
                    ], this._sumWidthArray(resultWidthArray, 0, expandIndex), resultWidthArray[expandIndex].width, expandIndex);
                }
            };
            flatView.prototype.getInlineTotalWidth = function () {
                var table = this._dataTable.element(), width = table.style.width;
                if(width && (width !== "auto")) {
                    return width;
                }
                return "";
            };
            flatView.prototype.forEachColumnCell = // public **
            // ** DOMTable abstraction
            function (columnIndex, callback, param) {
                return this._dataTable.forEachColumnCell(columnIndex, callback, param);
            };
            flatView.prototype.forEachRowCell = function (rowIndex, callback, param) {
                return this._dataTable.forEachRowCell(rowIndex, callback, param);
            };
            flatView.prototype.getAbsoluteCellInfo = function (domCell, virtualize) {
                return new wijmo.grid.cellInfo(this.getColumnIndex(domCell), (domCell.parentNode).rowIndex, this._wijgrid, true, virtualize);
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
                _super.prototype._preRender.call(this);
                this._dataTable = new wijmo.grid.htmlTableAccessor(this._wijgrid.element[0], true, true, true)// skip offsets, ensure tbody + colgroup
                ;
            };
            flatView.prototype._postRender = function () {
                this._wijgrid.element.find("> tbody").addClass(this._wijgrid.options.wijCSS.content);
                this._dataTable = new wijmo.grid.htmlTableAccessor(this._wijgrid.element[0])// create with offsets
                ;
                this._wijgrid._setAttr(this._wijgrid.element, {
                    role: "grid",
                    cellpadding: "0",
                    border: "0",
                    cellspacing: "0"
                });
                this._wijgrid.element.css("border-collapse", "separate");
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
            return flatView;
        })(grid.baseView);
        grid.flatView = flatView;
        // render **
        // private abstract **
        // ** private specific
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
        /** @ignore */
        var fixedView = (function (_super) {
            __extends(fixedView, _super);
            function fixedView(wijgrid, renderBounds) {
                        _super.call(this, wijgrid, renderBounds);
                this._verScrollBarSize = wijmo.grid.getSuperPanelScrollBarSize();
                this._viewTables = {
                };
                // rendered DOM tables
                this._splitAreas = {
                };
                // scrolling div
                this._superPanelElementsCache = {
                };
                this.element = wijgrid.element// table element
                ;
                this._staticDataRowIndex = wijgrid._getStaticIndex(true);
                this._staticRowIndex = wijgrid._getRealStaticRowIndex();
                this._staticColumnIndex = wijgrid._getRealStaticColumnIndex();
                this._staticAllColumnIndex = (this._staticColumnIndex === -1) ? -1 : wijgrid._field("visibleLeaves")[this._staticColumnIndex].leavesIdx;
                this._mouseWheelHandler = $.proxy(this._onMouseWheel, this);
            }
            fixedView.DEFAULT_ROW_HEIGHT_VIRTUAL = 19;
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
                ], tableWidth = (bWest ? $tableNW.width() : $tableNE.width()) + value - oldValue, scrollValue = this.getScrollValue();
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
                var frozener = wijgrid._UIFrozener();
                if(frozener) {
                    frozener.refresh();
                }
            };
            fixedView.prototype.ensureHeight = function (rowIndex) {
                var rowObjsArray, wijgrid = this._wijgrid, o = wijgrid.options, $tableNW = $(this._viewTables.nw.element()), $tableNE = $(this._viewTables.ne.element()), $tableSW = $(this._viewTables.sw.element()), $tableSE = $(this._viewTables.se.element()), scrollValue = this.getScrollValue(), maxHeight;
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
                var frozener = wijgrid._UIFrozener();
                if(frozener) {
                    frozener.refresh();
                }
            };
            fixedView.prototype.getScrollValue = // {x, y} or null
            function () {
                var superPanelObj = this._getSuperPanel();
                return superPanelObj ? {
                    x: superPanelObj.options.hScroller.scrollValue,
                    y: superPanelObj.options.vScroller.scrollValue
                } : null;
            };
            fixedView.prototype.getVisibleAreaBounds = function (client) {
                var bounds = this._isNativeSuperPanel() ? wijmo.grid.bounds(this._getSuperPanelStateContainer(), client) : wijmo.grid.bounds(this._getSuperPanelContentWrapper(), client);
                if(!bounds) {
                    // .wijmo-wijsuperpanel-contentwrapper is not available -- grid is invisible.
                    bounds = wijmo.grid.bounds(this._wijgrid.outerDiv, client);
                }
                return bounds;
            };
            fixedView.prototype.getVisibleContentAreaBounds = function () {
                var visibleBounds = this.getVisibleAreaBounds(true), b00 = // scrollable area
                wijmo.grid.bounds(this._viewTables.nw.element()) || {
                }, b01 = wijmo.grid.bounds(this._viewTables.ne.element()) || {
                }, b10 = wijmo.grid.bounds(this._viewTables.sw.element()) || {
                }, b11 = wijmo.grid.bounds(this._viewTables.se.element()) || {
                }, contentBounds = {
                    top: // tables area
                    visibleBounds.top,
                    left: visibleBounds.left,
                    width: Math.max(b00.width + b01.width, b10.width + b11.width),
                    height: Math.max(b00.height + b10.height, b01.height + b11.height)
                };
                // truncate
                contentBounds.width = Math.min(visibleBounds.width, contentBounds.width);
                contentBounds.height = Math.min(visibleBounds.height, contentBounds.height);
                return contentBounds;
            };
            fixedView.prototype.getRowAreaHeight = function () {
                var container = this._getSuperPanelContentWrapper();
                if(container.length == 0) {
                    container = this._wijgrid.outerDiv;
                }
                var height = container.height();
                // subtract top fixed area
                var topFixedAreaHeight = this._wijgrid.options.splitDistanceY;
                if(topFixedAreaHeight) {
                    height -= topFixedAreaHeight;
                }
                // subtract footer height
                if(this._wijgrid.options.showFooter) {
                    var footer, footerHeight = (this.isRendered() && (footer = this.footerRow())) ? $(footer).height() : this.getDefaultRowHeight();
                    // An assumption. Or we really need to link the footer height with the wijgrid.rowHeight?
                                        height -= footerHeight;
                }
                return height;
            };
            fixedView.prototype.getVirtualPageSize = function (upper) {
                if (typeof upper === "undefined") { upper = true; }
                var rowHeight = this._wijgrid.rowOuterHeight && (this._wijgrid.rowOuterHeight > 0) ? this._wijgrid.rowOuterHeight : this.getDefaultRowHeight();
                var vPageSize = this.getRowAreaHeight() / rowHeight;
                return upper ? Math.ceil(vPageSize) : Math.floor(vPageSize);
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
                        left: //left: bounds.left,
                        nwBounds.left,
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
            fixedView.prototype.getDefaultRowHeight = function () {
                return (this._wijgrid.options.rowHeight >= 0) ? this._wijgrid.options.rowHeight : fixedView.DEFAULT_ROW_HEIGHT_VIRTUAL;
            };
            fixedView.prototype.refreshPanel = function (scrollValue) {
                var self = this, wijgrid = this._wijgrid, options = wijgrid.options, panelModes = this._getMappedScrollMode(), hScrollValue = scrollValue ? scrollValue.x : null, vScrollValue = scrollValue ? scrollValue.y : null, firstRow = wijgrid._rows().item(0), recreateSuperPanel = false;
                wijgrid.rowOuterHeight = firstRow && firstRow[0] ? $(firstRow[0]).outerHeight() : // use a real height
                this.getDefaultRowHeight();
                if(!this._scroller.data("wijmo-wijsuperpanel")) {
                    recreateSuperPanel = true;
                    if(this._wijgrid._allowVirtualScrolling()) {
                        this.vsUI = new wijmo.grid.uiVirtualScroller(wijgrid, this._splitAreas.se, // content to scroll
                        options.splitDistanceY, // fixed area height
                        wijgrid.rowOuterHeight);
                    }
                    this._scroller.wijsuperpanel({
                        disabled: wijgrid.options.disabled,
                        scroll: $.proxy(this._onScroll, this),
                        bubbleScrollingEvent: true,
                        customScrolling: this._wijgrid._allowVirtualScrolling(),
                        vScroller: {
                            scrollBarVisibility: panelModes.vScrollBarVisibility,
                            "scrollValue": scrollValue ? scrollValue.y : null
                        },
                        hScroller: {
                            scrollBarVisibility: panelModes.hScrollBarVisibility,
                            "scrollValue": scrollValue ? scrollValue.x : null
                        },
                        hScrollerActivating: $.proxy(this._onHScrollerActivating, this)
                    });
                    // wijsuperpanel.hScrollerActivating event is not raised if touch environment is used, simulate it.
                    if(this._isNativeSuperPanel()) {
                        var container = this._getSuperPanelStateContainer();
                        if(container.length && (container[0].offsetHeight !== container[0].clientHeight)) {
                            this._onHScrollerActivating(null, {
                                contentLength: container[0].clientHeight
                            });
                        }
                    }
                    if(!this._isNativeSuperPanel()) {
                        this._getSuperPanelContentWrapper().bind("scroll", function (e) {
                            // #50496: when a overflowing div contains focusable elements it will be scrolled automatically to fit the focused element into view.
                            // Prevent native scrolling to avoid disalignment of the fixed and unfixed areas in IE\ Chrome when partially visible cell gets focus.
                            (e.target).scrollLeft = 0;
                            (e.target).scrollTop = 0;
                            e.preventDefault();
                        });
                    }
                    if(this._wijgrid._allowVirtualScrolling()) {
                        this.vsUI.attach(this._scroller);
                    }
                } else {
                    this._scroller.wijsuperpanel("paintPanel");
                }
                var needVBar = this._testNeedVBar(wijgrid.outerDiv, wijgrid.element, $(this._viewTables.ne.element()), options.scrollMode, wijgrid._autoHeight), excludeVBarWidth = needVBar && !this._testAutohiddenScrollbars();
                var contentWidth = this.getVisibleContentAreaBounds().width;
                this._splitAreas.ne.width(contentWidth - options.splitDistanceX);
                if(recreateSuperPanel && (scrollValue && scrollValue.x)) {
                    // synchronize unfixed areas: NE and SE (#47277)
                    var hPxValue = this._scroller.wijsuperpanel("scrollValueToPx", scrollValue.x, "h");
                    this._setFixedAreaPosition(this._splitAreas.ne, "h", hPxValue, null, true);
                }
                if(options.staticColumnsAlignment === "right") {
                    this._splitAreas.nw.css({
                        "left": "",
                        "right": excludeVBarWidth ? this._verScrollBarSize : 0
                    });
                    this._splitAreas.sw.css({
                        "left": "",
                        "right": excludeVBarWidth ? this._verScrollBarSize : 0
                    });
                }
                this._scroller.find(".wijmo-wijsuperpanel-hbarcontainer, .wijmo-wijsuperpanel-vbarcontainer").css("zIndex", 5);
                if(this._wijgrid._allowVirtualScrolling()) {
                    // re-render
                    this._wijgrid._handleVirtualScrolling(this._bounds.start);
                }
            };
            fixedView.prototype.scrollTo = function (cell, callback, info) {
                var grid = this._wijgrid, virtualScrollToIndex = null;
                if(grid._allowVirtualScrolling()) {
                    var rowIndex = grid._renderableBoundsCollection().getRenderedIndex(cell.rowIndex());
                    var vab, rowsLen = grid._rows().length(), $rows, handleLastRow = (rowIndex - grid._viewPortBounds().start >= rowsLen - 1);
                    // the last row in the current view port
                                        // determine whether virtual scrolling is needed or not
                    if(!cell._isRendered() || (handleLastRow && (vab = this.getVisibleAreaBounds(true)) && ($rows = cell.row().$rows) && ($rows.offset().top + $rows.outerHeight() > vab.top + vab.height))) {
                        // exceeded wijgrid bounds
                        virtualScrollToIndex = rowIndex;
                        if(cell.rowIndex() > info.changingEventArgs.oldRowIndex) {
                            virtualScrollToIndex -= rowsLen - 1;
                            virtualScrollToIndex += 1;
                        }
                    }
                }
                var superPanelObj = this._getSuperPanel();
                if(virtualScrollToIndex !== null) {
                    info.setFocus = true// to listen key events
                    ;
                    info.hasFocusedChild = false;
                    if(superPanelObj) {
                        (this).vsUI.scrollTo(virtualScrollToIndex, function () {
                            callback();
                        });
                    } else {
                        callback();
                    }
                } else {
                    var o = grid.options, $tableCell = $(cell.tableCell()), resultLeft = null, resultTop = null;
                    if(superPanelObj && $tableCell.is(":visible")) {
                        var contentElement = (superPanelObj).getContentElement(), wrapperElement = contentElement.parent(), visibleLeft = parseInt((contentElement.css("left") + "").replace("px", ""), 10) * -1, visibleTop = parseInt((contentElement.css("top") + "").replace("px", ""), 10) * -1, visibleWidth = wrapperElement.outerWidth() - o.splitDistanceX, visibleHeight = wrapperElement.outerHeight() - o.splitDistanceY, elementPosition = $tableCell.position(), elementLeft = elementPosition.left, elementTop = elementPosition.top, elementWidth = $tableCell.outerWidth(), elementHeight = $tableCell.outerHeight(), staticRowIndex = grid._getStaticIndex(true), staticColumnIndex = grid._getStaticIndex(false), currentRowIndex = cell.rowIndex(), currentCellIndex = cell.cellIndex();
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
                                // elementTop += visibleTop;
                                elementTop += this._splitAreas.sw.scrollTop();
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
                            (superPanelObj).vScrollTo(resultTop);
                        }
                    }
                    callback();
                }
            };
            fixedView.prototype.updateSplits = function (scrollValue) {
                var wijgrid = this._wijgrid, o = wijgrid.options, headerWidth, self = this, resultWidthArray = [], minWidthArray = [], maxWidthArray = [], staticColumnIndex = // set width to top table th and bottom table td in first row.
                this._staticColumnIndex, expandIndex, mode = o.scrollMode, visibleLeaves = wijgrid._field("visibleLeaves"), $tableSE = $(this._viewTables.se.element()), $tableNE = $(this._viewTables.ne.element()), $tableSW = $(this._viewTables.sw.element()), $tableNW = $(this._viewTables.nw.element()), outerDiv = wijgrid.outerDiv, tmp, i, hasDataRows;
                this._destroySuperPanel();
                outerDiv.unbind("mousewheel", this._mouseWheelHandler);
                // * if there is no data in a table, we must enlarge the table to prevent the width from being 0
                if((tmp = self._viewTables.se.element().tBodies) && (tmp = tmp[0])) {
                    // tmp = tBodies[0]
                    hasDataRows = false;
                    for(i = 0; i < tmp.rows.length; i++) {
                        if(!$(tmp.rows[i]).hasClass(wijmo.grid.wijgrid.CSS.groupHeaderRow)) {
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
                    maxWidthArray.push(self._getColumnWidth(index));
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
                    minWidthArray.push(self._getColumnWidth(index));
                });
                headerWidth = outerDiv.width()// using width() instead of innerWidth() to exclude padding.
                ;
                resultWidthArray = this._adjustWidthArray(maxWidthArray, minWidthArray, headerWidth, o.ensureColumnsPxWidth);
                $.each(resultWidthArray, function (index, colWidth) {
                    var leaf = visibleLeaves[index];
                    if(leaf._realWidth !== undefined) {
                        delete leaf._realWidth;
                        return;
                    }
                    self._setColumnWidth(index, colWidth.width);
                });
                //$.each([$tableSE, $tableNE, $tableSW, $tableNW], function (index, table) { // <-- The outerDiv width can change after that
                //	table.css({
                //		"table-layout": "fixed"
                //	});
                //});
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
                        resultWidthArray = this._adjustWidthArray(maxWidthArray, minWidthArray, headerWidth, o.ensureColumnsPxWidth);
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
            fixedView.prototype.getInlineTotalWidth = function () {
                if(this._scroller) {
                    var stateContainer = this._getSuperPanelStateContainer();
                    if(stateContainer.length) {
                        var width = stateContainer[0].style.width;
                        if(width && (width !== "auto")) {
                            return width;
                        }
                    }
                }
                return "";
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
                return true;
            };
            fixedView.prototype.getAbsoluteCellInfo = function (domCell, virtualize) {
                return new wijmo.grid.cellInfo(this.getColumnIndex(domCell), this.getAbsoluteRowIndex(domCell.parentNode), this._wijgrid, true, virtualize);
            };
            fixedView.prototype.getAbsoluteRowIndex = function (domRow) {
                var index = domRow.rowIndex, table = domRow.parentNode;
                while(table && table.tagName && table.tagName.toLowerCase() !== "table") {
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
                            return (table.element().rows[relRowIdx]).cells[cellIdx];
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
            fixedView.prototype._getSuperPanel = // DOMTable abstraction **
            // ** private abstract
            function () {
                return this._scroller ? this._scroller.data("wijmo-wijsuperpanel") : null;
            };
            fixedView.prototype._ensureRenderBounds = // ** render
            function () {
                if(this._wijgrid._allowVirtualScrolling()) {
                    var virtualPageSize = this.getVirtualPageSize();
                    this._wijgrid._ensureRenderableBounds(this._bounds);
                    this._bounds.end = this._bounds.start + virtualPageSize - 1;
                    if(this._wijgrid._serverSideVirtualScrolling()) {
                        var delta = (this._bounds.end - this._bounds.start + 1) - this._wijgrid.sketchTable.count();
                        if(delta > 0) {
                            this._bounds.end -= delta;
                        }
                    }
                    this._wijgrid._ensureRenderableBounds(this._bounds);
                    if((this._bounds.start > 0) && (this._bounds.end === this._wijgrid.sketchTable.count() - 1)) {
                        // the very last items will be rendered
                        virtualPageSize = this.getVirtualPageSize(false)// use floor, don't overlap a visible area
                        ;
                        var itemsToRender = this._bounds.end - this._bounds.start + 1;
                        if(itemsToRender < virtualPageSize) {
                            // can render more items?
                            this._bounds.start = this._bounds.end - virtualPageSize + 1// adjust the start position to stick the items to the bottom
                            ;
                        }
                        this._wijgrid._ensureRenderableBounds(this._bounds);
                        if(this._bounds.start !== this._wijgrid._scrollingState.index) {
                            // the bounds.start was changed, synchronize with the scrollingState
                            this._wijgrid._scrollingState.index = this._wijgrid._scrollingState.y = this._bounds.start//
                            ;
                        }
                    }
                } else {
                    _super.prototype._ensureRenderBounds.call(this)// render all items
                    ;
                }
            };
            fixedView.prototype._renderContent = function () {
                _super.prototype._renderContent.call(this);
            };
            fixedView.prototype._preRender = function () {
                _super.prototype._preRender.call(this);
                var docFragment = document.createDocumentFragment(), HTA = wijmo.grid.htmlTableAccessor, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS;
                this._wijgrid.outerDiv.wrapInner("<div class=\"" + defCSS.fixedView + " " + wijCSS.wijgridFixedView + "\"><div class=\"" + defCSS.scroller + " " + wijCSS.wijgridScroller + "\"><div class=\"wijmo-wijgrid-split-area-se wijmo-wijgrid-content-area\"></div></div></div>");
                this._scroller = this._wijgrid.outerDiv.find("." + defCSS.scroller);
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
                    $element.addClass(wijmo.grid.wijgrid.CSS.table).addClass(self._wijgrid.options.wijCSS.wijgridTable).css("border-collapse", "separate").find(// use separate instead of collapse to avoid a disalignment issue in chrome.
                    "> tbody").addClass(self._wijgrid.options.wijCSS.content);
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
                    this._superPanelElementsCache = {
                    };
                    this._scroller.wijsuperpanel("destroy");
                }
            };
            fixedView.prototype._onScroll = function (e, data) {
                var spInstance = this._getSuperPanel();
                if(this._wijgrid._allowVirtualScrolling()) {
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
            fixedView.prototype._onHScrollerActivating = function (e, args) {
                // auto adjusting height with hscrollbar shown
                if(this._wijgrid._autoHeight) {
                    var diff = this._wijgrid.element.height() + this._wijgrid.options.splitDistanceY - args.contentLength;
                    if(diff > 0) {
                        this._scroller.height(this._scroller.height() + diff);
                        this._scroller.wijsuperpanel("paintPanel");
                        return false;
                    }
                }
                this._splitAreas.sw.height(args.contentLength - this._wijgrid.options.splitDistanceY);
            };
            fixedView.prototype._onMouseWheel = function (e, delta) {
                // force superpanel to do scrolling when cursor is placed over then non-scrollable (fixed) areas of the wijgrid.
                                var bounds, dir = (delta > 0) ? "top" : "bottom", isOverFixedArea = false, vPos;
                if(this._wijgrid._canInteract()) {
                    bounds = this.getFixedAreaVisibleBounds()// an array (horizonta area, verticalw area)
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
                var excludeVBarWidth = false, wijgrid = this._wijgrid, gridWidth = tableNE.width() + wijgrid.options.splitDistanceX, gridHeight = gridElement.height() + wijgrid.options.splitDistanceY, outerWidth = outerDiv.width(), outerHeight = outerDiv.height(), contentHeight, topHeight = 0, bottomHeight = 0;
                if(wijgrid.$superPanelHeader !== null) {
                    topHeight = wijgrid.$superPanelHeader.outerHeight(true);
                }
                if(wijgrid.$bottomPagerDiv !== null) {
                    bottomHeight = wijgrid.$bottomPagerDiv.outerHeight(true);
                }
                contentHeight = outerHeight - topHeight - bottomHeight;
                switch(mode) {
                    case "both":
                    case "vertical":
                        excludeVBarWidth = true;
                        break;
                    case "auto":
                        // When the height needs to be auto adjusted, the vertical scrollbar should not be shown
                        excludeVBarWidth = (gridHeight > contentHeight) || (!autoHeight && gridWidth > outerWidth && gridHeight > contentHeight - this._verScrollBarSize);
                        if(!excludeVBarWidth && this._wijgrid._allowVirtualScrolling()) {
                            // test virtual scrolling bounds (#45894)
                            var itemsToRender = (wijgrid._view()).getVirtualPageSize();
                            //itemsToRender = this._bounds.end - this._bounds.start;
                            excludeVBarWidth = (itemsToRender > 0 && itemsToRender < wijgrid._totalRowsCount());
                        }
                        break;
                }
                return excludeVBarWidth;
            };
            fixedView.prototype._updateSplitAreaBounds = //bSet: 0-width, 1-height, 2-all
            function (bSet) {
                var wijgrid = this._wijgrid, o = wijgrid.options, controlHeight, contentHeight, topHeight = 0, bottomHeight = 0;
                if(bSet === 0 || bSet === 2) {
                    this._splitAreas.nw.width(o.splitDistanceX);
                    this._splitAreas.sw.width(o.splitDistanceX);
                    if(wijgrid.options.staticColumnsAlignment === "right") {
                        this._splitAreas.se.css("marginRight", o.splitDistanceX);
                        this._splitAreas.ne.css("marginRight", o.splitDistanceX);
                    } else {
                        this._splitAreas.se.css("marginLeft", o.splitDistanceX);
                        this._splitAreas.ne.css("marginLeft", o.splitDistanceX);
                    }
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
            fixedView.prototype._getSuperPanelContentWrapper = // private specific **
            // ** wijsuperpanel specific
            function () {
                if(!this._superPanelElementsCache.contentWrapper || !this._superPanelElementsCache.contentWrapper.length) {
                    this._superPanelElementsCache.contentWrapper = this._wijgrid.outerDiv.find(".wijmo-wijsuperpanel-contentwrapper:first")// not available in native mode?
                    ;
                }
                return this._superPanelElementsCache.contentWrapper;
            };
            fixedView.prototype._getSuperPanelStateContainer = function () {
                if(!this._superPanelElementsCache.stateContainer || !this._superPanelElementsCache.stateContainer.length) {
                    this._superPanelElementsCache.stateContainer = this._wijgrid.outerDiv.find(".wijmo-wijsuperpanel-statecontainer:first");
                }
                return this._superPanelElementsCache.stateContainer;
            };
            fixedView.prototype._isNativeSuperPanel = function () {
                return this._wijgrid._isTouchEnv();
            };
            fixedView.prototype._testAutohiddenScrollbars = function () {
                if(this._isNativeSuperPanel()) {
                    var container = this._getSuperPanelStateContainer();
                    if(container.length) {
                        return container[0].offsetWidth === container[0].clientWidth;// no scrollbar or scrollbar is hidden (-ms-autohiding-scrollbar)

                    }
                }
                return false;
            };
            return fixedView;
        })(grid.baseView);
        grid.fixedView = fixedView;
        // wijsuperpanel specific **
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
        /** An object that represents selection in the grid. You do not need to create instances of this class. */
        var selection = (function () {
            /** Creates an object that represents selection in the grid. Normally you do not need to use this method.
            * @example
            * var selection = new wijmo.grid.selection(wijgrid);
            * @param {wijmo.wijgrid} wijgrid wijgrid
            * @returns {wijmo.grid.selection} Object that represents selection in the grid
            */
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
            selection.prototype.selectedCells = /** Gets a read-only collection of the selected cells.
            * @example
            * var selectedCells = selectionObj.selectedCells();
            * for (var i = 0, len = selectedCells.length(); i < len; i++) {
            *	alert(selectedCells.item(i).value().toString());
            * }
            * @returns {wijmo.grid.cellInfoOrderedCollection} A read-only collection of the selected cells.
            */
            function () {
                return this._selectedCells;
            };
            selection.prototype.addColumns = /** Adds a column range to the current selection.
            * Usage:
            * 1. addColumns(0)
            * 2. addColumns(0, 2)
            * @example
            * // Add the first column to the current selection.
            * selectionObj.addColumns(0);
            * @remarks
            * The result depends upon the chosen selection mode in the grid. For example, if current selection mode does not allow multiple selection the previous selection will be removed.
            * @param {Number} start The index of the first column to select.
            * @param {Number} end The index of the last column to select.
            */
            function (start, end/* opt */ ) {
                if(!end && end !== 0) {
                    end = start;
                }
                this.addRange(start, 0, end, 0xFFFFFF);
            };
            selection.prototype.addRange = /** @ignore */
            function (cellRange/* x0 */ , y0/* opt */ , x1/* opt */ , y1/* opt */ ) {
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
                this._selectRange(range, false, true, wijmo.grid.cellRangeExtendMode.none, null);
                this.endUpdate();
            };
            selection.prototype.addRows = /** Adds a row range to the current selection.
            * Usage:
            * 1. addRows(0)
            * 2. addRows(0, 2)
            * @example
            * // Add the first row to the selection.
            * selectionObj.addRows(0);
            * @remarks
            * The result depends upon the chosen selection mode in the grid. For example, if current selection mode does not allow multiple selection the previous selection will be removed.
            * @param {Number} start The index of the first row to select.
            * @param {Number} end The index of the last row to select.
            */
            function (start, end/* opt */ ) {
                if(!end && end !== 0) {
                    end = start;
                }
                this.addRange(0, start, 0xFFFFFF, end);
            };
            selection.prototype.removeRange = /** @ignore */
            function (cellRange/* x0 */ , y0/* opt */ , x1/* opt */ , y1/* opt */ ) {
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
                this._clearRange(range, wijmo.grid.cellRangeExtendMode.none);
                this.endUpdate();
            };
            selection.prototype.removeColumns = /**
            * Removes a range of columns from the current selection.
            * Usage:
            * 1. removeColumns(0)
            * 2. removeColumns(0, 2)
            * @example
            * // Remove the first columm from the selection.
            * selectionObj.removeColumns(0);
            * @remarks
            * The result depends upon the chosen selection mode in the grid.
            * @param {Number} start The index of the first column to remove.
            * @param {Number} end The index of the last column to remove.
            */
            function (start, end/* opt */ ) {
                if(!end && end !== 0) {
                    end = start;
                }
                this.removeRange(start, 0, end, 0xFFFFFF);
            };
            selection.prototype.removeRows = /** Removes a range of rows from the current selection.
            * Usage:
            * 1. removeRows(0)
            * 2. removeRows(0, 2)
            * @example
            * // Remove the first row from the selection.
            * selectionObj.removeRows(0);
            * @remarks
            * The result depends upon the chosen selection mode in the grid.
            * @param {Number} start The index of the first row to remove.
            * @param {Number} end The index of the last row to remove.
            */
            function (start, end/* opt */ ) {
                if(!end && end !== 0) {
                    end = start;
                }
                this.removeRange(0, start, 0xFFFFFF, end);
            };
            selection.prototype.clear = /**
            * Clears the selection.
            * @example
            * // Clear the selection.
            * selectionObj.clear();
            */
            function () {
                this.beginUpdate();
                this._removedCells._clear();
                this._removedCells._addFrom(this._selectedCells);
                this.endUpdate();
            };
            selection.prototype.selectAll = /**
            * Selects all the cells in a grid.
            * @example
            * selectionObj.selectAll();
            * @remarks
            * The result depends upon the chosen selection mode in the grid. For example, if the selection mode is set to "singleCell", then only the top left cell will be selected.
            */
            function () {
                this.beginUpdate();
                this._selectRange(this._wijgrid._getDataCellsRange(grid.dataRowsRangeMode.sketch), false, false, wijmo.grid.cellRangeExtendMode.none, null);
                this.endUpdate();
            };
            selection.prototype.beginUpdate = /**
            * Begins the update. Any changes won't take effect until endUpdate() is called.
            * @example
            * selectionObj.beginUpdate();
            */
            function () {
                this._updates++;
            };
            selection.prototype.endUpdate = /**
            * Ends the update. The pending changes are executed and the selectionChanged event is raised.
            * @example
            * selectionObj.endUpdate();
            */
            function () {
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
                var selectionMode = this._wijgrid.options.selectionMode.toLowerCase(), rangeToClear, rowsLen, cellsLen, flag, row, cell, i, len, cellInfo, dataRange = this._wijgrid._getDataCellsRange(grid.dataRowsRangeMode.sketch);
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
                var selectionMode = this._wijgrid.options.selectionMode.toLowerCase(), rangeToSelect, dataRange = this._wijgrid._getDataCellsRange(grid.dataRowsRangeMode.sketch);
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
            selection.prototype._ensureSelection = function () {
                var view = this._wijgrid._view(), prevRowIndex = -2, rowInfo;
                for(var i = 0; i < this._selectedCells.length(); i++) {
                    var cellInfo = this._selectedCells.item(i);
                    if(cellInfo._isRendered()) {
                        if(prevRowIndex !== cellInfo.rowIndex()) {
                            rowInfo = cellInfo.row();
                            prevRowIndex = cellInfo.rowIndex();
                        }
                        this.selectCell(cellInfo, rowInfo, view, true);
                    }
                }
            };
            selection.prototype._ensureSelectionInRow = function (sketchRowIndex) {
                var _this = this;
                var view = this._wijgrid._view();
                if(view._isRowRendered(sketchRowIndex) >= 0) {
                    var rowInfo = view._getRowInfoBySketchRowIndex(sketchRowIndex, false), selectedCells = this.selectedCells();
                    if(rowInfo && selectedCells && (selectedCells.length() > 0)) {
                        rowInfo.$rows.children("td, th").each(function (i, cell) {
                            var idx = selectedCells.indexOf(i, sketchRowIndex);
                            if(idx >= 0) {
                                _this.selectCell(selectedCells.item(idx), rowInfo, view, true);
                            }
                        });
                    }
                }
            };
            selection.prototype.doSelection = // * internal
            // * private
            function () {
                var view = this._wijgrid._view(), i, len, cellInfo, cell, $cell, index, $rs = wijmo.grid.renderState, rowInfo, state, prevRowIndex = -1;
                for(i = 0 , len = this._removedCells.length(); i < len; i++) {
                    cellInfo = this._removedCells.item(i);
                    if(this._addedCells.indexOf(cellInfo) < 0) {
                        if(prevRowIndex !== cellInfo.rowIndex()) {
                            rowInfo = cellInfo.row();
                            prevRowIndex = cellInfo.rowIndex();
                        }
                        this.selectCell(cellInfo, rowInfo, view, false);
                        this._selectedCells._remove(cellInfo);
                        this._addedDuringCurTransactionCells._remove(cellInfo);
                    } else {
                        this._removedCells._removeAt(i);
                        i--;
                        len--;
                    }
                }
                prevRowIndex = -1;
                for(i = 0 , len = this._addedCells.length(); i < len; i++) {
                    cellInfo = this._addedCells.item(i);
                    index = this._selectedCells.indexOf(cellInfo);
                    if(index < 0) {
                        if(prevRowIndex !== cellInfo.rowIndex()) {
                            rowInfo = cellInfo.row();
                            prevRowIndex = cellInfo.rowIndex();
                        }
                        this.selectCell(cellInfo, rowInfo, view, true);
                        this._selectedCells._insertUnsafe(cellInfo, ~index);
                        this._addedDuringCurTransactionCells._add(cellInfo);
                    } else {
                        this._addedCells._removeAt(i);
                        i--;
                        len--;
                    }
                }
            };
            selection.prototype.selectCell = function (cellInfo, rowInfo, view, select) {
                if(cellInfo._isRendered()) {
                    var bounds = this._wijgrid._viewPortBounds();
                    var cell = view.getCell(cellInfo.cellIndexAbs(), cellInfo.rowIndexAbs());
                    if(cell) {
                        var $cell = $(cell), state = view._changeCellRenderState($cell, wijmo.grid.renderState.selected, select === true);
                        this._wijgrid.cellStyleFormatter.format($cell, cellInfo.cellIndex(), cellInfo.column(), rowInfo, state);
                    }
                }
            };
            selection.prototype.doRange = function (range, add) {
                var x0 = range.topLeft().cellIndex(), y0 = range.topLeft().rowIndex(), x1 = range.bottomRight().cellIndex(), y1 = range.bottomRight().rowIndex(), cnt, row, col, cell, view = this._wijgrid._view(), rowInfo, rows, renderBounds = this._wijgrid._viewPortBounds();
                if(add) {
                    cnt = this._addedCells.length();
                    rows = this._wijgrid._rows();
                    for(row = y0; row <= y1; row++) {
                        rowInfo = view._getRowInfoBySketchRowIndex(row);
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
        /** An ordered read-only collection of wijmo.grid.cellInfo objects */
        var cellInfoOrderedCollection = (function () {
            /**
            * Creates an ordered read-only collection of wijmo.grid.cellInfo objects. Normally you do not need to use this method.
            * @example
            * var collection = new wijmo.grid.cellInfoOrderedCollection(wijgrid);
            * @param {wijmo.wijgrid} wijgrid wijgrid
            * @returns {wijmo.grid.cellInfoOrderedCollection}  An ordered read-only collection of wijmo.grid.cellInfo objects
            */
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
            /** Gets an item at the specified index.
            * @example
            * var cellInfoObj = collection.item(0);
            * @param {Number} index The zero-based index of the item to get.
            * @returns {wijmo.grid.cellInfo} The wijmo.grid.cellInfo object at the specified index.
            */
            function (index) {
                return this._list[index];
            };
            cellInfoOrderedCollection.prototype.length = /** Gets the total number of the items in the collection.
            * @example
            * var len = collection.length();
            * @returns {Number} The total number of the items in the collection.
            */
            function () {
                return this._list.length;
            };
            cellInfoOrderedCollection.prototype.indexOf = /** @ignore */
            function (cellIndex, rowIndex) {
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
            cellInfoOrderedCollection.prototype.toString = /** @ignore */
            function () {
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
        /** @ignore */
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
                var visibleBounds = this._view.getVisibleContentAreaBounds(), mouse = //.getVisibleAreaBounds(),
                {
                    x: args.pageX,
                    y: args.pageY
                }, tag = ((args.target && (args.target).tagName !== undefined) ? (args.target).tagName.toLowerCase() : undefined), $target = $(args.target), defCSS = wijmo.grid.wijgrid.CSS;
                if((!tag || $target.is("td." + defCSS.TD + ", th." + defCSS.TD + ", div." + defCSS.cellContainer)) && (mouse.x > visibleBounds.left && mouse.x < visibleBounds.left + visibleBounds.width) && (mouse.y > visibleBounds.top && mouse.y < visibleBounds.top + visibleBounds.height)) {
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
                }, tmp, cellInfo, range, desiredCells, rowsLen, cellsLen, row, cell, i, len, $cell, rowInfo, prevRowIndex, state, view = this._wijgrid._view(), rows = this._wijgrid._rows(), $rs = wijmo.grid.renderState;
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
                    range._clip(this._wijgrid._getDataCellsRange(grid.dataRowsRangeMode.sketch));
                    if(range._isValid() && !range.isEqual(this._prevMouseMoveRange)) {
                        this._prevMouseMoveRange = range;
                        desiredCells = new wijmo.grid.cellInfoOrderedCollection(this._wijgrid);
                        rowsLen = range.bottomRight().rowIndex();
                        cellsLen = range.bottomRight().cellIndex();
                        for(row = range.topLeft().rowIndex(); row <= rowsLen; row++) {
                            rowInfo = view._getRowInfoBySketchRowIndex(row);
                            if(rowInfo.type & wijmo.grid.rowType.data) {
                                for(cell = range.topLeft().cellIndex(); cell <= cellsLen; cell++) {
                                    desiredCells._appendUnsafe(new wijmo.grid.cellInfo(cell, row));
                                }
                            }
                        }
                        prevRowIndex = -1;
                        for(i = 0 , len = this._addedCells.length(); i < len; i++) {
                            cellInfo = this._addedCells.item(i);
                            if(desiredCells.indexOf(cellInfo) < 0)// remove css
                             {
                                if(this._wijgrid.selection().selectedCells().indexOf(cellInfo) < 0) {
                                    cell = this._view.getCell(cellInfo.cellIndexAbs(), cellInfo.rowIndexAbs());
                                    if(cell) {
                                        if(prevRowIndex !== cellInfo.rowIndex()) {
                                            rowInfo = cellInfo.row();
                                            prevRowIndex = cellInfo.rowIndex();
                                        }
                                        $cell = $(cell);
                                        state = view._changeCellRenderState($cell, $rs.selected, false);
                                        this._wijgrid.cellStyleFormatter.format($cell, cellInfo.cellIndex(), cellInfo.column(), rowInfo, state);
                                    }
                                }
                                this._addedCells._removeAt(i);
                                i--;
                                len--;
                            }
                        }
                        prevRowIndex = -1;
                        for(i = 0 , len = desiredCells.length(); i < len; i++) {
                            cellInfo = desiredCells.item(i);
                            if(this._addedCells.indexOf(cellInfo) < 0 && this._wijgrid.selection().selectedCells().indexOf(cellInfo) < 0) {
                                if(this._addedCells._add(cellInfo)) {
                                    cell = this._view.getCell(cellInfo.cellIndexAbs(), cellInfo.rowIndexAbs());
                                    if(cell) {
                                        if(prevRowIndex !== cellInfo.rowIndex()) {
                                            rowInfo = cellInfo.row();
                                            prevRowIndex = cellInfo.rowIndex();
                                        }
                                        $cell = $(cell);
                                        state = view._changeCellRenderState($cell, $rs.selected, true);
                                        this._wijgrid.cellStyleFormatter.format($cell, cellInfo.cellIndex(), cellInfo.column(), rowInfo, state);
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
                        this._wijgrid._changeCurrentCell(args, this._endCellInfo, {
                            changeSelection: false,
                            setFocus: false
                        });
                        if(!args.shiftKey || (!this._wijgrid.selection()._multipleRangesAllowed() && this._wijgrid.options.selectionMode.toLowerCase() !== "singleRange")) {
                            this._wijgrid.selection()._startNewTransaction(this._startCellInfo);
                        }
                        this._wijgrid.selection().beginUpdate();
                        this._wijgrid.selection()._selectRange(this._prevMouseMoveRange, args.shiftKey, args.ctrlKey, wijmo.grid.cellRangeExtendMode.none, this._endCellInfo);
                        this._wijgrid.selection().endUpdate();
                        var view = this._wijgrid._view(), prevRowIndex = -1, rowInfo, $rs = wijmo.grid.renderState;
                        // clear remained cells
                        for(var i = 0, len = this._addedCells.length(); i < len; i++) {
                            var cellInfo = this._addedCells.item(i);
                            if(this._wijgrid.selection().selectedCells().indexOf(cellInfo) < 0) {
                                var cell = view.getCell(cellInfo.cellIndexAbs(), cellInfo.rowIndexAbs());
                                if(cell !== null) {
                                    if(prevRowIndex !== cellInfo.rowIndex()) {
                                        rowInfo = cellInfo.row();
                                        prevRowIndex = cellInfo.rowIndex();
                                    }
                                    var $cell = $(cell), state = view._changeCellRenderState($cell, $rs.selected, false);
                                    this._wijgrid.cellStyleFormatter.format($cell, cellInfo.cellIndex(), cellInfo.column(), rowInfo, state);
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
                result = new wijmo.grid.cellInfo(cellIdx, rowIdx, this._wijgrid, true);
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
        /**
        * Class for convenient access to rows of a wijgrid.
        * @ignore
        */
        var rowAccessor = (function () {
            function rowAccessor(view, scope, offsetTop, offsetBottom) {
                this._view = view;
                this._scope = scope;
                this._offsetBottom = offsetBottom;
                this._offsetTop = offsetTop;
            }
            rowAccessor.prototype.item = /** Gets an array of the table row elements that represents a wijgrid widget row at the specified index.
            * size of returning array is always two.
            * @param {Number} index The zero-based index of the row to retrieve.
            * @returns {Object[]} The array of the table row elements at the specified index.
            * @remarks
            */
            function (index) {
                var len = this.length();
                return (index >= 0 && index < len) ? this._view.getJoinedRows(index + this._offsetTop, this._scope) : null;
            };
            rowAccessor.prototype.length = /**
            * Gets the total number of elements.
            * @returns {Number} The total number of elements.
            */
            function () {
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
            rowAccessor.iterateCells = /** Sequentially iterates the cells in a rowObj argument.
            * @param {Array} rowObj Array of rows to be iterated.
            * @param {Function} callback Function that will be called each time a new cell is reached.
            * @param {Object} param Parameter that can be handled within the callback function.
            */
            function iterateCells(rowObj, callback, param) {
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
            rowAccessor.getCell = /** Gets a cell by its global index in a row's array passed in rowObj.
            * @example:
            * Suppose rows is an array containing the following data: [ ["a", "b"], ["c", "d", "e"] ]
            * "a" symbol has a global index 0.
            * "c" symbol has a global index 2.
            * @param {Array} rowObj Array of table row elements.
            * @param {Number} index Zero-based global index of a cell.
            * @returns {HTMLTableCellElement} A cell or null if a cell with provided index is not found.
            */
            function getCell(rowObj, globCellIndex) {
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
            rowAccessor.getCell$ = /** @ignore */
            function getCell$(row, globCellIndex) {
                var domCell = wijmo.grid.rowAccessor.getCell(row, globCellIndex);
                return (domCell) ? $(domCell) : $([]);// an empty set

            };
            rowAccessor.cellsCount = /** Gets the number of cells in a array of table row elements.
            * @param {Array} rowObj Array of table row elements.
            * @returns {Number} The number of cells in a array of table row elements.
            */
            function cellsCount(rowObj) {
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
        /** @ignore */
        (function (updateCellResult) {
            updateCellResult._map = [];
            updateCellResult.error = 0;
            updateCellResult.continueEditing = 1;
            updateCellResult.success = 2;
            // ESC key is pressed or cell in not rendered.
            updateCellResult.cancel = 4;// used only as modifier of the success value, not as an independent value).

            updateCellResult.notEdited = 8;
        })(grid.updateCellResult || (grid.updateCellResult = {}));
        var updateCellResult = grid.updateCellResult;
        ;
        /** @ignore */
        var cellEditorHelper = (function () {
            function cellEditorHelper() {
                this._timeout = 25;
            }
            cellEditorHelper.prototype.cellEditStart = function (grid, cell, e) {
                var result = false, view = grid._view(), rowInfo, args, $innerDiv, rowType;
                if(cell._isValid() && !cell._isEdit() && (cell.column().dataIndex >= 0)) {
                    rowInfo = cell.row();
                    if(rowInfo) {
                        rowType = rowInfo.type;
                        if(rowType & wijmo.grid.rowType.data) {
                            args = {
                                cell: cell,
                                event: e,
                                handled: false
                            };
                            if(result = (grid._trigger("beforeCellEdit", null, args) || (grid.options.editingMode === "row"))) {
                                // cancellable only if editingMode is "cell"
                                if(!args.handled) {
                                    result = this._defaultBeforeCellEdit(grid, args);
                                }
                            }
                            if(result) {
                                cell._isEdit(true);
                                if(grid._showRowHeader()) {
                                    $innerDiv = $((rowInfo.$rows[0]).cells[0]).children("div." + wijmo.grid.wijgrid.CSS.cellContainer);
                                    if($innerDiv.length) {
                                        $innerDiv.empty();
                                        $innerDiv.append($("<div>&nbsp;</div>").addClass(grid.options.wijCSS.icon + " " + grid.options.wijCSS.iconPencil));
                                    }
                                }
                            }
                        }
                    }
                }
                return result;
            };
            cellEditorHelper.prototype.updateCell = function (grid, cell, e) {
                var row;
                if(cell && !cell._isEdit()) {
                    return updateCellResult.success | updateCellResult.notEdited;
                }
                if(!cell || !cell._isValid() || !(row = cell.row()) || !(row.type & wijmo.grid.rowType.data)) {
                    return updateCellResult.error;
                }
                if((e && (e.which === wijmo.getKeyCodeEnum().ESCAPE)) || (!cell._isRendered())) {
                    return updateCellResult.success | updateCellResult.cancel;
                }
                var result = updateCellResult.success, column = cell.column();
                var bcuArgs = {
                    cell: cell,
                    value: undefined
                };
                if(grid._trigger("beforeCellUpdate", null, bcuArgs) || (grid.options.editingMode === "row")) {
                    // cancellable only if editingMode is "cell"
                    if(bcuArgs.value === undefined) {
                        // user doesn't provide a new value
                        bcuArgs.value = this._getCellValue(grid, cell)// get raw value from editor using  default implementation
                        ;
                    }
                    var a = bcuArgs.value, b = // new value
                    cell.value();
                    // old value
                                        try  {
                        var inputType = this._getHTMLInputElementType(cell);
                        if(wijmo.grid.HTML5InputSupport.isExtendSupportRequired(inputType)) {
                            bcuArgs.value = wijmo.grid.HTML5InputSupport.parse(bcuArgs.value, inputType);
                            bcuArgs.value = wijmo.grid.HTML5InputSupport.extend(b, bcuArgs.value, inputType);
                        } else {
                            bcuArgs.value = grid.parse(cell.column(), bcuArgs.value)// try to parse raw value
                            ;
                        }
                        a = bcuArgs.value;
                    } catch (ex) {
                        bcuArgs.value = a// restore raw value
                        ;
                    }
                    if(wijmo.grid.getDataType(column) === "datetime") {
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
                            cell.value(bcuArgs.value);
                        } catch (ex) {
                            var icvArgs = {
                                cell: cell,
                                value: bcuArgs.value
                            };
                            result = updateCellResult.error;
                            grid._trigger("invalidCellValue", null, icvArgs);
                        }
                        if(result & updateCellResult.success) {
                            var acuArgs = {
                                cell: cell
                            };
                            grid._trigger("afterCellUpdate", null, acuArgs);
                        }
                    }
                } else {
                    return updateCellResult.continueEditing;
                }
                return result;
            };
            cellEditorHelper.prototype.cellEditEnd = // must be called only after the updateCell().
            function (grid, cell, e) {
                var rowInfo = cell.row(), aceArgs = {
                    cell: cell,
                    event: e,
                    handled: false
                };
                cell._isEdit(false);
                if(cell._isRendered()) {
                    grid._trigger("afterCellEdit", null, aceArgs);
                    if(!aceArgs.handled) {
                        this._defaultAfterCellEdit(grid, aceArgs);
                    }
                    if(grid._showRowHeader()) {
                        $((rowInfo.$rows[0]).cells[0]).children("div." + wijmo.grid.wijgrid.CSS.cellContainer).html("&nbsp;")// remove icon-pencil
                        ;
                    }
                }
            };
            cellEditorHelper.prototype._defaultBeforeCellEdit = // private
            function (grid, args) {
                var column = args.cell.column(), result = false, $container, $input;
                if(column.dataIndex >= 0) {
                    var value = args.cell.value(), keyCodeEnum = wijmo.getKeyCodeEnum(), inputType = wijmo.grid.HTML5InputSupport.getDefaultInputType(grid._isMobileEnv(), column), allowCellEditing = grid._allowCellEditing(), serverSideCheckbox = false;
                    result = true;
                    try  {
                        $container = args.cell.container();
                        if(wijmo.grid.getDataType(column) === "boolean") {
                            var $span = $container.children("span");
                            if(serverSideCheckbox = !!($span.length && $span.prop("disabled"))) {
                                // C1GridView support
                                $.data($span[0], "serverSideCheckbox", true);
                                $span.prop("disabled", false);
                            }
                            $input = $container.find(":checkbox");
                            if(serverSideCheckbox || !allowCellEditing) {
                                // c1gridview or editingMode="row"
                                $input.prop("disabled", false);
                            }
                            if(args.event && args.event.type === "keypress") {
                                $input.one("keyup", function (e) {
                                    if(e.which === keyCodeEnum.SPACE) {
                                        e.preventDefault();
                                        ($input[0]).checked = !value;
                                    }
                                });
                            }
                        } else {
                            $input = $("<input type='" + inputType + "' />").css("ime-mode", column.imeMode || "auto").addClass(wijmo.grid.wijgrid.CSS.inputMarker).addClass("wijmo-wijinput " + grid.options.wijCSS.stateFocus).bind("keydown", grid, $.proxy(this._checkBoxOrInputKeyDown, this));
                            //the problem of inputing
                            $input.bind((($.support).selectstart ? "selectstart" : "mousedown"), function (event) {
                                event.stopPropagation();
                            });
                            if(args.event && (args.event.type === "keydown") && (args.event.which !== 113)) {
                                // 113 = F2
                                // "edit on keypress", leave the editor empty.
                                                            } else {
                                switch(wijmo.grid.getDataType(column)) {
                                    case "currency":
                                    case "number":
                                        if(value !== null) {
                                            $input.val(value)// ignore formatting
                                            ;
                                            break;
                                        }
                                    case "datetime":
                                        if(wijmo.grid.HTML5InputSupport.isExtendSupportRequired(inputType)) {
                                            $input.val(wijmo.grid.HTML5InputSupport.toStr(value, inputType));
                                            break;
                                        }
                                        // fall through
                                                                            default:
                                        $input.val(grid.toStr(column, value));
                                        break;
                                }
                            }
                            $container.empty().append($input);
                            if(allowCellEditing) {
                                // don't change the focus on row editing.
                                var len = $input.val().length;
                                if(inputType === "text") {
                                    // move caret to the end of the text
                                    new wijmo.grid.domSelection($input[0]).setSelection({
                                        start: len,
                                        end: len
                                    });
                                }
                            }
                        }
                        if(allowCellEditing) {
                            // don't change the focus on row editing.
                            $input.focus();
                            setTimeout(function () {
                                // IE fix
                                $input.focus();
                            }, this._timeout * 2);
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
                        cellValue = grid.toStr(leafOpt, args.cell.value());
                        rowInfo = view._getRowInfoBySketchRowIndex(args.cell.rowIndex());
                        if(wijmo.grid.getDataType(leafOpt) === "boolean") {
                            var $span = $container.children("span"), disable = $span.length && $.data($span[0], "serverSideCheckbox");
                            $input = $container.find(":checkbox");
                            $input.prop("checked", cellValue === "true");
                            /*if (cellValue === "true") {
                            $input.attr("checked", "checked");
                            }
                            else {
                            $input.removeAttr("checked");
                            }*/
                            if(disable) {
                                $span.prop("disabled", true);
                                $input.prop("disabled", true);
                            }
                        } else {
                            grid.cellFormatter.format($(args.cell.tableCell()), $container, leafOpt, cellValue, rowInfo);
                        }
                    } catch (ex) {
                        alert("defaultAfterCellEdit: " + ex.message);
                        result = false;
                    }
                }
                return result;
            };
            cellEditorHelper.prototype._checkBoxOrInputKeyDown = function (args) {
                var keyCodeEnum = wijmo.getKeyCodeEnum();
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
            cellEditorHelper.prototype._getHTMLInputElementType = function (currentCell) {
                return currentCell.container().find(":input:first").attr("type");
            };
            return cellEditorHelper;
        })();
        grid.cellEditorHelper = cellEditorHelper;
        // private *
        // IME support.
        /** @ignore */
        var keyDownEventListener = (function () {
            function keyDownEventListener(grid, container) {
                this.mGrid = grid;
                this.mWrapper = $("<div />");
                if(this.mGrid._allowCellEditing()) {
                    this.mHiddenElement = $("<input type=\"text\" />").keydown($.proxy(this._onKeyDown, this));
                } else {
                    this.mHiddenElement = $("<input type=\"button\" />")// use any focusable element other than textbox (to avoid keyboard popup in mobile).
                    ;
                }
                this.mHiddenElement.css({
                    position: "relative",
                    border: 0,
                    padding: 0,
                    margin: 0,
                    width: 1,
                    height: // if zero-dimension element is used then 1) a ghost caret will be displayed after editing in IE9. 2) IME is disabled in Chrome.
                    1,
                    "font-size": wijmo.grid.isMobileSafari() ? "0em" : // hide caret in MobileSafari.
                    "1px"
                });
                // don't use zero value otherwise the IME will be disabled in Chrome.
                this.mFakeFocusable = $("<input type=\"button\" />").css(// special element to resolve an issue with changing the IME in IE11 .
                {
                    position: "relative",
                    width: 1,
                    height: 1,
                    border: 0,
                    padding: 0,
                    margin: 0
                });
                this.mWrapper.append(this.mHiddenElement).append(this.mFakeFocusable).css({
                    position: "absolute",
                    width: "0px",
                    height: "0px",
                    overflow: "hidden",
                    "z-index": 999999
                });
                // TFS issue #45934 (an element with absolute positioning affects the superpanel layout in IE).
                container.append(this.mWrapper);
            }
            keyDownEventListener.prototype.dispose = function () {
                if(this.mWrapper) {
                    try  {
                        this.mWrapper.remove();
                    } catch (ex) {
                    }finally {
                        this.mWrapper = null;
                        this.mHiddenElement = null;
                        this.mGrid = null;
                    }
                }
            };
            keyDownEventListener.prototype.focus = function (coord, column) {
                if(coord && coord.length) {
                    var offset = coord.offset();
                    this.mWrapper.offset({
                        top: offset.top,
                        left: offset.left
                    });
                    this.mFakeFocusable.focus()// move focus out of the mHiddenElement first to resolve an issue with changing the IME in IE11
                    ;
                    this.mHiddenElement.css("ime-mode", (column && column.imeMode) || "auto").focus();
                }
            };
            keyDownEventListener.prototype.isHiddenInput = function (element) {
                return element && ((element[0] === this.mHiddenElement[0]) || (element[0] === this.mFakeFocusable[0]));
            };
            keyDownEventListener.prototype.canHandle = function (e) {
                return (this.mGrid._allowCellEditing() && this.isPrintableKeyCode(e));
            };
            keyDownEventListener.prototype.isPrintableKeyCode = function (e) {
                var k = e.keyCode;
                /* ported from the SpeadJS */
                return !e.ctrlKey && !e.altKey && ((k >= 65 && k <= 90) || // A~Z a~z
                ((k >= 48 && k <= 57) || (k >= 96 && k <= 105)) || // 0~9
                (k >= 186 && k <= 192) || // Key for ; = , - . / `
                (k >= 220 && k <= 222 || k === 219) || // Key for \ ] ' [
                (k >= 106 && k <= 111) || // Num keyboard for * + KP_Separator - . /
                (k === 32) || // space
                (k === 61) || // "=" key (Firefox and Opera)
                (k === 173) || // "-" key (Firefox)
                (k === 229 || e.keyCode === 0));// IME key. 229 for IE and Chrome, 0 for Firefox.

            };
            keyDownEventListener.prototype._onKeyDown = function (e) {
                if(this.canHandle(e)) {
                    //if (targetOuterDiv.length && (targetOuterDiv[0] === this.outerDiv[0])) {
                    this.mGrid._beginEditInternal(e)// pass input (onKeyUp event) to the editor.
                    ;
                } else {
                    var keyCodeEnum = wijmo.getKeyCodeEnum();
                    // #47873. IE workaround: if input element is inside form element then after double pressing the Esc key the whole form will be cleared.
                    if(e.keyCode === keyCodeEnum.ESCAPE) {
                        e.preventDefault();
                    }
                }
            };
            return keyDownEventListener;
        })();
        grid.keyDownEventListener = keyDownEventListener;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts" />
    /// <reference path="c1commandbutton.ts" />
    /// <reference path="wijgrid.ts" />
    /// <reference path="misc.ts" />
    (function (grid) {
        "use strict";
        var $ = jQuery;
        /** @ignore */
        var cellFormatterHelper = (function () {
            function cellFormatterHelper() { }
            cellFormatterHelper._div = document.createElement("div");
            cellFormatterHelper.prototype.format = function ($cell, $container, column, formattedValue, rowInfo) {
                var grid = column.owner, rt = wijmo.grid.rowType, rse = wijmo.grid.renderStateEx;
                if(rowInfo.type & rt.footer) {
                    if(column.aggregate && (column.aggregate !== "none")) {
                        formattedValue = wijmo.grid.stringFormat(column.footerText || "{0}", column._totalsValue || "");
                    } else {
                        formattedValue = column.footerText || column._footerTextDOM || "";
                    }
                }
                // provide a toggle icon for the first cell of the groupHeader row
                if((rowInfo.type & rt.groupHeader) && (column.visLeavesIdx == (grid.options.showRowHeader ? 1 : 0))) {
                    // Provide a toggle icon
                    // if grouped column is hidden then groupedColumn != column.
                                        var groupedColumn = grid._groupedColumns()[rowInfo._extInfo.groupLevel - 1], gi;
                    // groupLevel is 1-based
                    if(groupedColumn && (gi = groupedColumn.groupInfo) && (gi.outlineMode !== "none")) {
                        var defCSS = wijmo.grid.wijgrid.CSS, wijCSS = grid.options.wijCSS, icon = (rowInfo._extInfo.state & rse.collapsed) ? gi.collapsedImageClass || wijCSS.iconArrowRight : // collapsed
                        gi.expandedImageClass || wijCSS.iconArrowRightDown;
                        // expanded
                                                formattedValue = "<div class=\"" + wijCSS.icon + " " + icon + " " + defCSS.groupToggleVisibilityButton + " " + wijCSS.wijgridGroupToggleVisibilityButton + "\">&nbsp;</div>" + formattedValue;
                    }
                }
                var useDefault = true, defaultFormatter = null, args = {
                    $cell: $cell,
                    $container: $container,
                    column: column,
                    formattedValue: formattedValue,
                    row: rowInfo,
                    afterDefaultCallback: null
                }, result = true;
                // apply rowHeight option to all tbody rows if virtual scrolling is used.
                if(((rowInfo.type & rt.data) || (rowInfo.type === rt.groupFooter || rowInfo.type === rt.groupHeader)) && grid._allowVirtualScrolling()) {
                    var height = (grid._view()).getDefaultRowHeight();
                    $container.css({
                        "overflow": "hidden",
                        "height": height
                    });
                    // apply default height if the rowHeight is not set.
                                    }
                if($.isFunction(column.cellFormatter)) {
                    useDefault = !column.cellFormatter(args);
                }
                if(useDefault) {
                    switch(rowInfo.type & ~rt.dataAlt) {
                        case rt.filter:
                            defaultFormatter = this._formatFilterRowCell;
                            break;
                        case rt.data:
                            defaultFormatter = this._formatDataRowCell;
                            break;
                        default:
                            // groupHeader, groupFooter, footer
                            defaultFormatter = this._formatDefRowCell;
                    }
                    if(defaultFormatter) {
                        result = defaultFormatter.call(this, args);
                        if($.isFunction(args.afterDefaultCallback)) {
                            args.afterDefaultCallback(args);
                        }
                    }
                }
                return (result === false) ? // translate the result value (which can be undefined) to bool
                false : true;
            };
            cellFormatterHelper.prototype._formatFilterRowCell = // * private
            // ** row formatters
            function (args) {
                var grid = args.column.owner, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = grid.options.wijCSS;
                args.$container.addClass(wijCSS.widget + " " + wijCSS.stateDefault);
                if((args.column.dataIndex >= 0) && !args.column.isBand && args.column.showFilter) {
                    args.$container.html("<table cellPadding=\"0\" cellSpacing=\"0\" class=\"" + defCSS.filter + " " + wijCSS.wijgridFilter + " " + wijCSS.cornerAll + "\">" + "<tr>" + "<td style=\"width:100%\">" + "<input type=\"text\" class=\"" + defCSS.filterInput + " " + wijCSS.wijgridFilterInput + "\" style=\"width:100%\" />" + "</td>" + "<td class=\"" + defCSS.filterTrigger + " " + wijCSS.wijgridFilterTrigger + " " + wijCSS.cornerRight + " " + wijCSS.stateDefault + "\">" + "<span class=\"" + wijCSS.icon + " " + wijCSS.iconArrowDown + "\"></span>" + "</td>" + "</tr>" + "</table>");
                } else {
                    args.$container.html("&nbsp;");
                }
            };
            cellFormatterHelper.prototype._formatDataRowCell = function (args) {
                var column = args.column, grid = column.owner, dataType = wijmo.grid.getDataType(column), result = true;
                if(column.clientType === "c1btnfield") {
                    this._c1btnFieldCellFormatter(args);
                } else {
                    if(column.clientType === "c1commandbtnfield") {
                        this._c1commandBtnFieldCellFormatter(args);
                    } else {
                        this._defFieldCellFormatter(args);
                    }
                }
                return result;
            };
            cellFormatterHelper.prototype._formatDefRowCell = function (args) {
                this._updateHTML(args);
            };
            cellFormatterHelper.prototype._defFieldCellFormatter = // row formatters **
            // ** column formatters
            function (args) {
                if(wijmo.grid.getDataType(args.column) === "boolean") {
                    this._boolCellFormatter(args);
                } else {
                    this._dataCellFormatter(args);
                }
            };
            cellFormatterHelper.prototype._boolCellFormatter = function (args) {
                var grid = args.column.owner, allowClickEditing = grid._allowCellEditing() && (args.column.readOnly !== true), targetElement, currentCell, $rt = wijmo.grid.rowType, keyCodeEnum = wijmo.getKeyCodeEnum(), $input = $("<input class=\"" + wijmo.grid.wijgrid.CSS.inputMarker + "\" type=\"checkbox\" />");
                if(!allowClickEditing) {
                    $input.prop("disabled", true);
                }
                if(grid.parse(args.column, grid._dataViewWrapper.getValue(args.row.data, args.column.dataKey)) === true) {
                    $input.prop("checked", "checked");
                }
                args.$container.empty().append($input);
                if(allowClickEditing) {
                    args.$container.children("input").bind("mousedown", function (e) {
                        targetElement = args.$container.parent()[0] , currentCell = grid.currentCell();
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
            };
            cellFormatterHelper.prototype._dataCellFormatter = function (args) {
                this._updateHTML(args);
            };
            cellFormatterHelper.prototype._c1btnFieldCellFormatter = function (args) {
                var column = args.column, cmdArgs = {
                    column: args.column,
                    row: args.row
                };
                this._buttonFactory(args.$container, column.command, cmdArgs, null);
            };
            cellFormatterHelper.prototype._c1commandBtnFieldCellFormatter = function (args) {
                var column = args.column, grid = column.owner, cmdArgs = {
                    column: args.column,
                    row: args.row
                }, self = this;
                if(args.row.state & wijmo.grid.renderState.editing) {
                    if(column.showEditButton) {
                        this._buttonFactory(args.$container, column.updateCommand, cmdArgs, function (e, args) {
                            grid.updateRow();
                        });
                        args.$container.append(document.createTextNode("\u00A0"));
                        this._buttonFactory(args.$container, column.cancelCommand, cmdArgs, function (e, args) {
                            grid.cancelRowEditing();
                        });
                    }
                } else {
                    if(column.showEditButton) {
                        this._buttonFactory(args.$container, column.editCommand, cmdArgs, function (e, args) {
                            grid.editRow(cmdArgs.row.dataItemIndex);
                        });
                    }
                    if(column.showDeleteButton) {
                        if(column.showEditButton) {
                            args.$container.append(document.createTextNode("\u00A0"));
                        }
                        this._buttonFactory(args.$container, column.deleteCommand, cmdArgs, function (e, args) {
                            grid.deleteRow(cmdArgs.row.dataItemIndex);
                        });
                    }
                }
                args.$container.addClass("wijmo-wijgrid-innercell-command");
            };
            cellFormatterHelper.prototype._updateHTML = // column formatters **
            function (args) {
                // args.$container.html(args.formattedValue || "&nbsp;"); // -- very slow in IE when table content is recreated more than once (after paging, sorting etc, especially in flat mode).
                var domContainer = args.$container[0];
                // reset content
                if(domContainer.firstChild) {
                    while(domContainer.firstChild) {
                        domContainer.removeChild(domContainer.firstChild);
                    }
                }
                if(args.column.encodeHtml) {
                    if(wijmo.grid.cellFormatterHelper._div.textContent != undefined) {
                        wijmo.grid.cellFormatterHelper._div.textContent = args.formattedValue || "";
                    } else {
                        wijmo.grid.cellFormatterHelper._div.innerText = args.formattedValue || ""// IE <= 8
                        ;
                    }
                } else {
                    wijmo.grid.cellFormatterHelper._div.innerHTML = args.formattedValue || "&nbsp;";
                }
                while(wijmo.grid.cellFormatterHelper._div.firstChild) {
                    domContainer.appendChild(wijmo.grid.cellFormatterHelper._div.firstChild);
                }
            };
            cellFormatterHelper.prototype._buttonFactory = function (container, cmd, args, clickCallback) {
                var btnOptions = $.extend({
                }, {
                    text: cmd.text,
                    iconClass: cmd.iconClass,
                    disabled: args.column.owner.options.disabled,
                    click: function (e) {
                        var processDefault = true;
                        if($.isFunction(cmd.click)) {
                            var res = cmd.click.apply(this, [
                                e,
                                args
                            ]);
                            processDefault = (res !== false) && !e.isDefaultPrevented()// let user to cancel the action
                            ;
                        }
                        if(processDefault && clickCallback) {
                            clickCallback.apply(this, [
                                e,
                                args
                            ]);
                        }
                        e.preventDefault()// prevent # beging added to url.
                        ;
                    }
                });
                var btnContainer = $("<div />");
                container.append(btnContainer);
                switch(args.column.buttonType) {
                    case "link":
                        btnContainer.wijgridcommandlink(btnOptions);
                        break;
                    case "imageButton":
                        btnContainer.wijgridcommandimagebutton(btnOptions);
                        break;
                    case "button":
                        btnContainer.wijgridcommandbutton(btnOptions);
                        break;
                    case "image":
                        btnContainer.wijgridcommandimage(btnOptions);
                        break;
                    default:
                        throw "Unknown buttonType";
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
        /** @ignore */
        var uiResizer = (function () {
            function uiResizer(wijgrid) {
                this.MIN_WIDTH = 5;
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
                var _this = this;
                $.each(this._elements, function (index, c1basefield) {
                    c1basefield.element.unbind(_this._eventKey("mousemove"), _this._onMouseMove).unbind(_this._eventKey("mousedown"), _this._onMouseDown).unbind(_this._eventKey("mouseout"), _this._onMouseOut);
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
                        var wijCSS = this._wijgrid.options.wijCSS, defCSS = wijmo.grid.wijgrid.CSS;
                        this._hoveredField.element.css("cursor", "");
                        // _hoveredField.element.find("> a").css("cursor", "");
                        this._docCursor = document.body.style.cursor;
                        document.body.style.cursor = "e-resize";
                        this._startLocation = this._lastLocation = wijmo.grid.bounds(this._hoveredField.element);
                        this._proxy = $("<div class=\"" + defCSS.resizingHandle + " " + wijCSS.wijgridResizingHandle + " " + wijCSS.stateHighlight + "\">&nbsp;</div>");
                        var visibleAreaBounds = this._wijgrid._view().getVisibleAreaBounds(true);
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
                        this._wijgrid._fieldResized(this._hoveredField, this._startLocation.width, Math.max(this._lastLocation.left - this._startLocation.left, this.MIN_WIDTH));
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
                var prefix = (this._wijgrid._isTouchEnv()) ? "wij" : // 48214 [Win8.1, IE11] Column moving is performed instead of column sizing when resize a column.
                "";
                return prefix + wijmo.grid.stringFormat(this._evntFormat, eventType);
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
        /** @ignore */
        var uiDragndrop = (function () {
            function uiDragndrop(wijgrid) {
                this._scope_guid = "scope_" + wijmo.grid.getUID();
                // to use inside the draggable.drag event.
                this._dragEnd = false;
                this.mZIndex = 1000;
                var defCSS = wijmo.grid.wijgrid.CSS;
                this._wijgrid = wijgrid;
                this._wijCSS = this._wijgrid.options.wijCSS;
                this._wrapHtml = "<div class=\"" + this._wijCSS.widget + " " + defCSS.wijgrid + " " + this._wijCSS.wijgrid + " " + this._wijCSS.content + " " + this._wijCSS.cornerAll + "\">" + "<table class=\"" + defCSS.root + " " + defCSS.table + " " + this._wijCSS.wijgridTable + "\">" + "<tr class=\"" + defCSS.headerRow + " " + this._wijCSS.wijgridHeaderRow + "\">" + "</tr>" + "</table>" + "</div>";
            }
            uiDragndrop.prototype.attachGroupArea = function (element) {
                var draggedWijField, self = this;
                if(!$.ui || !($.ui).droppable || !($.ui).draggable) {
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
                                if((draggedWijField instanceof $.wijmo.c1groupedfield) && (draggedWijField.options.groupedIndex === self._wijgrid._groupedColumns().length - 1)) {
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
                var element, draggedWijField, defCSS = wijmo.grid.wijgrid.CSS, self = this;
                if(!($.ui).droppable || !($.ui).draggable) {
                    return;
                }
                if(!wijField || !(element = wijField.element)) {
                    return;
                }
                element.draggable({
                    helper: function (e) {
                        var result;
                        if(wijField instanceof $.wijmo.c1groupedfield) {
                            result = element.clone();
                        } else {
                            result = element.clone().wrap(self._wrapHtml).width(element.width()).height(element.height()).closest("." + defCSS.wijgrid);
                        }
                        result.addClass(defCSS.dndHelper + " " + self._wijCSS.wijgridDndHelper).css("z-index", self.mZIndex = wijmo.grid.getZIndex(self._wijgrid.outerDiv, 1000))// Update the z-index property. wijdialog increases its z-index property every time when the dialog position is changed.
                        ;
                        return result;
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
                        if(self._wijgrid._canInteract() && self._wijgrid.options.allowColMoving && (self._wijgrid._UIResizer() == null || !self._wijgrid._UIResizer().inProgress())) {
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
                this._topArrow().css("z-index", this.mZIndex).show().position({
                    my: "center",
                    at: position + " top",
                    of: element,
                    collision: "none"
                });
                this._bottomArrow().css("z-index", this.mZIndex).show().position({
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
                    this._$topArrow = $("<div />").addClass(wijmo.grid.wijgrid.CSS.dndArrowTopContainer + " " + this._wijCSS.wijgridDndArrowTopContainer).append($("<span />").addClass(this._wijCSS.icon + " " + this._wijCSS.iconArrowThickDown)).hide().appendTo(document.body);
                }
                return this._$topArrow;
            };
            uiDragndrop.prototype._bottomArrow = function () {
                if(!this._$bottomArrow) {
                    this._$bottomArrow = $("<div />").addClass(wijmo.grid.wijgrid.CSS.dndArrowBottomContainer + " " + this._wijCSS.wijgridDndArrowBottomContainer).append($("<span />").addClass(this._wijCSS.icon + " " + this._wijCSS.iconArrowThickUp)).hide().appendTo(document.body);
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
        /** @ignore */
        var cellStyleFormatterHelper = (function () {
            function cellStyleFormatterHelper(wijgrid) {
                if(!wijgrid) {
                    throw "invalid arguments";
                }
                this._wijgrid = wijgrid;
            }
            cellStyleFormatterHelper.prototype.format = function ($cell, cellIndex, column, rowInfo, state, cellAttr, cellStyle) {
                var $rs = wijmo.grid.renderState, $rt = wijmo.grid.rowType, rowType = rowInfo.type, args, groupRowCellInfo = null;
                if(cellIndex === 0 && this._wijgrid._showRowHeader()) {
                    column = null;
                }
                if(rowType === $rt.groupHeader || rowType === $rt.groupFooter) {
                    column = null;
                    if(cellAttr && (groupRowCellInfo = cellAttr.groupInfo)) {
                        column = this._wijgrid._field("leaves")[groupRowCellInfo.leafIndex]// replace "column" with the one associated with the $cell's content
                        ;
                        //delete cellAttr.groupInfo;
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
                if(state & $rs.rendering) {
                    this._renderingStateFormatter(args, cellAttr, cellStyle);
                } else {
                    this._currentStateFormatter(args, state & $rs.current);
                    //hoveredStateFormatter(args, state & $rs.hovered);
                    this._selectedStateFormatter(args, state & $rs.selected);
                    if(rowType !== $rt.header) {
                        if((state & $rs.current) || (state & $rs.selected)) {
                            args.$cell.addClass(this._wijgrid.options.wijCSS.stateDefault)// make bootstrap happy
                            ;
                        } else {
                            args.$cell.removeClass(this._wijgrid.options.wijCSS.stateDefault);
                        }
                    }
                }
                if($.isFunction(this._wijgrid.options.cellStyleFormatter)) {
                    this._wijgrid.options.cellStyleFormatter(args);
                }
            };
            cellStyleFormatterHelper.prototype._renderingStateFormatter = // private ---
            function (args, cellAttr, cellStyles) {
                var $rt = wijmo.grid.rowType, key, value, leaf = args.column, rowType = args.row.type, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS;
                switch(rowType) {
                    case $rt.header:
                        args.$cell.addClass(defCSS.TH + " " + wijCSS.wijgridTH);
                        break;
                    default:
                        args.$cell.addClass(defCSS.TD + " " + wijCSS.wijgridTD);
                }
                if((rowType & $rt.data) && leaf && leaf.textAlignment) {
                    // set text alignment
                    switch(leaf.textAlignment.toLowerCase()) {
                        case "left":
                            args.$cell.addClass(defCSS.cellAlignLeft + " " + wijCSS.wijgridCellAlignLeft);
                            break;
                        case "right":
                            args.$cell.addClass(defCSS.cellAlignRight + " " + wijCSS.wijgridCellAlignRight);
                            break;
                        case "center":
                            args.$cell.addClass(defCSS.cellAlignCenter + " " + wijCSS.wijgridCellAlignCenter);
                            break;
                    }
                }
                // copy attributes
                if(cellAttr) {
                    for(key in cellAttr) {
                        if(cellAttr.hasOwnProperty(key)) {
                            value = cellAttr[key];
                            if((key === "groupInfo" || key === "colSpan" || key === "rowSpan") && !(value > 1)) {
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
                                args.$cell.children("." + defCSS.cellContainer).css(key, cellStyles[key]);
                                continue;
                            }
                            args.$cell.css(key, cellStyles[key]);
                        }
                    }
                }
                if(args._cellIndex === 0 && this._wijgrid._showRowHeader()) {
                    args.$cell.attr({
                        "role": "rowheader",
                        "scope": "row"
                    }).addClass(wijCSS.stateDefault + " " + wijCSS.content + " " + defCSS.rowHeader + " " + wijCSS.wijgridRowHeader);
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
                var $rt = wijmo.grid.rowType, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS;
                if(add) {
                    args.$cell.addClass(wijCSS.stateActive);
                    if(args.row.type === $rt.header) {
                        args.$cell.addClass(defCSS.currentHeaderCell + " " + wijCSS.wijgridCurrentHeaderCell);
                    } else {
                        args.$cell.addClass(defCSS.currentCell + " " + wijCSS.wijgridCurrentCell);
                    }
                } else {
                    args.$cell.removeClass(wijCSS.stateActive);
                    if(args.row.type === $rt.header) {
                        args.$cell.removeClass(defCSS.currentHeaderCell + " " + wijCSS.wijgridCurrentHeaderCell);
                    } else {
                        args.$cell.removeClass(defCSS.currentCell + " " + wijCSS.wijgridCurrentCell);
                    }
                }
            };
            cellStyleFormatterHelper.prototype._hoveredStateFormatter = function (args, add) {
                if(add) {
                } else {
                }
            };
            cellStyleFormatterHelper.prototype._selectedStateFormatter = function (args, add) {
                var wijCSS = this._wijgrid.options.wijCSS;
                if(add) {
                    args.$cell.addClass(wijCSS.stateHighlight).attr("aria-selected", "true");
                } else {
                    args.$cell.removeClass(wijCSS.stateHighlight).removeAttr("aria-selected");
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
        /** @ignore */
        var rowStyleFormatterHelper = (function () {
            function rowStyleFormatterHelper(wijgrid) {
                if(!wijgrid) {
                    throw "invalid arguments";
                }
                this._wijgrid = wijgrid;
            }
            rowStyleFormatterHelper.prototype.format = function (rowInfo, rowAttr, rowStyle) {
                var $rs = wijmo.grid.renderState, $rt = wijmo.grid.rowType, state = rowInfo.state, args = rowInfo;
                if(state & $rs.rendering) {
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
            rowStyleFormatterHelper.prototype._groupFormatter = function (rowInfo) {
                var rse = wijmo.grid.renderStateEx, extInfo = rowInfo._extInfo, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS;
                if(extInfo.state & rse.hidden) {
                    rowInfo.$rows.css("display", "none");
                    //rowInfo.$rows.attr("aria-hidden", true);
                                    } else {
                    rowInfo.$rows.css("display", "");
                    //rowInfo.$rows.removeAttr("aria-hidden");
                                    }
                if(rowInfo.type & wijmo.grid.rowType.groupHeader) {
                    var gi = this._wijgrid._groupedColumns()[rowInfo._extInfo.groupLevel - 1].groupInfo, expandedIcon = //1-based
                    gi.expandedImageClass || wijCSS.iconArrowRightDown, collapsedIcon = gi.collapsedImageClass || wijCSS.iconArrowRight, toggleBtn = //toggleBtn = rowInfo.$rows.children("td, th").eq(this._wijgrid.options.showRowHeader ? 1 : 0).find("." + defCSS.groupToggleVisibilityButton);
                    wijmo.grid.rowAccessor.getCell$(rowInfo.$rows, this._wijgrid.options.showRowHeader ? 1 : 0).find("." + defCSS.groupToggleVisibilityButton);
                    if(extInfo.state & rse.collapsed) {
                        rowInfo.$rows.attr("aria-expanded", false);
                        rowInfo.$rows.removeClass(defCSS.groupHeaderRowExpanded + " " + wijCSS.wijgridGroupHeaderRowExpanded).addClass(defCSS.groupHeaderRowCollapsed + " " + wijCSS.wijgridGroupHeaderRowCollapsed);
                        toggleBtn.removeClass(expandedIcon).addClass(collapsedIcon);
                    } else {
                        rowInfo.$rows.attr("aria-expanded", true);
                        rowInfo.$rows.removeClass(defCSS.groupHeaderRowCollapsed + " " + wijCSS.wijgridGroupHeaderRowCollapsed).addClass(defCSS.groupHeaderRowExpanded + " " + wijCSS.wijgridGroupHeaderRowExpanded);
                        toggleBtn.removeClass(collapsedIcon).addClass(expandedIcon);
                    }
                }
            };
            rowStyleFormatterHelper.prototype._renderingStateFormatter = // * private
            function (args, rowAttr, rowStyle) {
                var defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS, className, contentClass = defCSS.row + " " + wijCSS.wijgridRow + " " + wijCSS.content, $rt = wijmo.grid.rowType, rse = wijmo.grid.renderStateEx, key;
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
                if(args._extInfo.groupLevel) {
                    args.$rows.attr("aria-level", args._extInfo.groupLevel);
                }
                // hide collapsed row
                if(args._extInfo.state & rse.hidden) {
                    args.$rows.css("display", "none");
                    // args.$rows.attr("aria-hidden", true);
                                    }
                switch(args.type & ~$rt.dataAlt) {
                    case // clear dataAlt modifier
                    ($rt.header):
                        className = defCSS.headerRow + " " + wijCSS.wijgridHeaderRow;
                        break;
                    case ($rt.data):
                        className = contentClass + " " + defCSS.dataRow + " " + wijCSS.wijgridDataRow;
                        if(args.type & $rt.dataAlt) {
                            className += " " + defCSS.altRow + " " + wijCSS.wijgridAltRow;
                        }
                        break;
                    case ($rt.emptyDataRow):
                        className = contentClass + " " + defCSS.emptyDataRow + " " + wijCSS.wijgridEmptyDataRow;
                        break;
                    case ($rt.filter):
                        className = defCSS.filterRow + " " + wijCSS.wijgridFilterRow;
                        break;
                    case ($rt.groupHeader):
                        args.$rows.attr({
                            "id": "GH" + args._extInfo.groupIndex + "-" + args._extInfo.groupLevel,
                            "aria-expanded": ((args._extInfo.state & rse.collapsed) === 0)
                        });
                        className = contentClass + " " + defCSS.groupHeaderRow + " " + wijCSS.wijgridGroupHeaderRow + " ";
                        className += (args._extInfo.state & rse.collapsed) ? defCSS.groupHeaderRowCollapsed + " " + wijCSS.wijgridGroupHeaderRowCollapsed : defCSS.groupHeaderRowExpanded + " " + wijCSS.wijgridGroupHeaderRowExpanded;
                        break;
                    case ($rt.groupFooter):
                        args.$rows.attr("id", "GF" + args._extInfo.groupIndex + "-" + args._extInfo.groupLevel);
                        className = contentClass + " " + defCSS.groupFooterRow + " " + wijCSS.wijgridGroupFooterRow;
                        break;
                    case ($rt.footer):
                        className = defCSS.footerRow + " " + wijCSS.wijgridFooterRow + " " + wijCSS.stateDefault + " " + wijCSS.stateHighlight;
                        break;
                    default:
                        throw wijmo.grid.stringFormat("unknown rowType: {0}", args.type);
                }
                args.$rows.addClass(className);
            };
            rowStyleFormatterHelper.prototype._currentStateFormatter = function (args, flag) {
                if(this._wijgrid._showRowHeader()) {
                    var wijCSS = this._wijgrid.options.wijCSS, defCSS = wijmo.grid.wijgrid.CSS;
                    // make deal with the row header cell
                    if(flag) {
                        // add formatting
                        $((args.$rows[0]).cells[0]).addClass(wijCSS.stateActive + " " + defCSS.currentRowHeaderCell + " " + wijCSS.wijgridCurrentRowHeaderCell);
                    } else {
                        // remove formatting
                        $((args.$rows[0]).cells[0]).removeClass(wijCSS.stateActive + " " + defCSS.currentRowHeaderCell + " " + wijCSS.wijgridCurrentRowHeaderCell);
                    }
                }
            };
            rowStyleFormatterHelper.prototype._hoveredStateFormatter = function (args, flag) {
                var wijCSS = this._wijgrid.options.wijCSS;
                if(flag) {
                    // add formatting
                    args.$rows.addClass(wijCSS.stateDefault + " " + wijCSS.stateHover);
                } else {
                    // remove formatting
                    args.$rows.removeClass(wijCSS.stateDefault + " " + wijCSS.stateHover);
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
        /** @ignore */
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
                    return wijgrid.toStr(column, value);
                }
                // we only support max/min and count for dates
                if(this._cntDates && (column.dataType === "datetime")) {
                    // we only support max/min and count for dates
                    switch(column.aggregate) {
                        case "max":
                            return wijgrid.toStr(column, new Date(this._maxDate));
                        case "min":
                            return wijgrid.toStr(column, new Date(this._minDate));
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
        /** @ignore */
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
                var freezingMode = this._wijgrid.options.freezingMode;
                if(freezingMode !== "none") {
                    this._$outerDiv = this._wijgrid.outerDiv.find("." + wijmo.grid.wijgrid.CSS.fixedView);
                    this._superPanel = (this._wijgrid._view())._getSuperPanel();
                    this._staticOffsetH = this._wijgrid._getStaticOffsetIndex(false);
                    this._staticOffsetV = this._wijgrid._getStaticOffsetIndex(true);
                    this._staticColumnIndex = this._wijgrid._getStaticIndex(false);
                    this._staticRowIndex = this._wijgrid._getStaticIndex(true);
                    this._visibleBounds = this._wijgrid._view().getVisibleContentAreaBounds()//.getVisibleAreaBounds();
                    ;
                    var allFixedAreaBounds = wijmo.grid.bounds(this._$outerDiv.find(".wijmo-wijgrid-split-area-nw")), containerBounds = wijmo.grid.bounds(this._$outerDiv);
                    // if staticColumnsAlignment is "right" then create vbar only when staticColumnIndex is set (vbar dragging ability is disabled in this case)
                    if((freezingMode === "both" || freezingMode === "columns") && (this._wijgrid.options.staticColumnsAlignment !== "right" || this._staticColumnIndex >= 0)) {
                        this._createVBar(this._visibleBounds, allFixedAreaBounds, containerBounds);
                    }
                    if((freezingMode === "both" || freezingMode === "rows") && !this._wijgrid._serverSideVirtualScrolling()) {
                        this._createHBar(this._visibleBounds, allFixedAreaBounds, containerBounds);
                    }
                }
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
                var lAlign = (this._wijgrid.options.staticColumnsAlignment !== "right"), leftPos = lAlign ? allFixedAreaBounds.width + allFixedAreaBounds.left : allFixedAreaBounds.left - 2, self = this, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS;
                if(leftPos <= visibleBounds.left + visibleBounds.width) {
                    this._$vBar = $("<div><div></div></div>").addClass(defCSS.freezingHandleV + " " + wijCSS.wijgridFreezingHandleV).addClass(lAlign ? "" : "not-allowed").css(// remove "pointer" cursor (vbar dragging ability is disabled when staticColumnsAlignment == "right" is used)
                    {
                        left: leftPos - containerBounds.left,
                        top: allFixedAreaBounds.top - containerBounds.top,
                        height: visibleBounds.height + visibleBounds.top - allFixedAreaBounds.top
                    }).bind("mousedown", function (e) {
                        e.data = true// vertical bar
                        ;
                        self._onBarMouseDown.apply(self, arguments);
                    }).appendTo(this._$outerDiv);
                    // content
                    this._$vBar.find("div").addClass(defCSS.freezingHandleContent + " " + wijCSS.header);
                }
            };
            uiFrozener.prototype._createHBar = function (visibleBounds, allFixedAreaBounds, containerBounds) {
                var topPos = allFixedAreaBounds.top + allFixedAreaBounds.height, lAlign = (this._wijgrid.options.staticColumnsAlignment !== "right"), self = this, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS;
                if(topPos <= visibleBounds.top + visibleBounds.height) {
                    this._$hBar = $("<div><div></div></div>").addClass(defCSS.freezingHandleH + " " + wijCSS.wijgridFreezingHandleH).css({
                        left: lAlign ? allFixedAreaBounds.left - containerBounds.left : // 0?
                        0,
                        top: topPos - containerBounds.top,
                        width: lAlign ? visibleBounds.width + visibleBounds.left - allFixedAreaBounds.left : // visibleBounds.width?
                        visibleBounds.width
                    }).bind("mousedown", function (e) {
                        e.data = false// horizontal bar
                        ;
                        self._onBarMouseDown.apply(self, arguments);
                    }).appendTo(this._$outerDiv);
                    // content
                    this._$hBar.find("div").addClass(defCSS.freezingHandleContent + " " + wijCSS.header);
                }
            };
            uiFrozener.prototype._onBarMouseDown = // e.data: true = vertical, false = horizontal
            function (e) {
                if(this._wijgrid.options.disabled || (this._wijgrid.options.staticColumnsAlignment === "right" && e.data)) {
                    return false;
                }
                var defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS;
                this._visibleBounds = this._wijgrid._view().getVisibleContentAreaBounds()//.getVisibleAreaBounds();
                ;
                this._newStaticIndex = e.data ? this._staticColumnIndex : this._staticRowIndex;
                this._$proxy = $("<div class=\"" + defCSS.resizingHandle + " " + wijCSS.wijgridResizingHandle + " " + wijCSS.header + "\"></div>").appendTo(document.body);
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
                var element, elementBounds, centerXOrY, currentIdx, prevIdx, leftOrTop, position, barBounds, lAlign = (this._wijgrid.options.staticColumnsAlignment !== "right");
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
                            left: lAlign ? elementBounds.left : // this._visibleBounds.left?
                            this._visibleBounds.left,
                            top: position,
                            width: lAlign ? this._visibleBounds.width + this._visibleBounds.left - elementBounds.left : // this._visibleBounds.width?
                            this._visibleBounds.width,
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
        /** @ignore */
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
        /** @ignore */
        var uiVirtualScroller = (function () {
            function uiVirtualScroller(wijgrid, $content, fixedAreaHeight, rowOuterHeight) {
                //private _fixedAreaHeight: number;
                this._timer = 0;
                this._timeout = 50;
                // msec
                this._ignoreScrollEvents = false;
                this._debounceScrolledEvent = true;
                this._wijgrid = wijgrid;
                //this._fixedAreaHeight = fixedAreaHeight;
                this._$content = $content;
                this._view = this._wijgrid._view();
                this._N = this._wijgrid._renderableRowsCount();
                this._rowOuterHeight = rowOuterHeight;
                this._updateContentHeight();
                var height = this._wijgrid.outerDiv.height() + this._N * this._rowOuterHeight;// total height

                this._view._splitAreas.sw.height(height);
            }
            uiVirtualScroller.prototype.scrollTo = function (rowIndex, callback) {
                this._debounceScrolledEvent = false// otherwise sequential method calls will be blocked by timer
                ;
                this._completeListener = callback;
                (this._panelInst).vScrollTo(rowIndex * (this._panelInst).options.vScroller.scrollSmallChange, true);
            };
            uiVirtualScroller.prototype._updateContentHeight = /** calculate content height from row number, row height and fixed area */
            function () {
                // subtract _fixedAreaHeight, otherwise dummy rows will be hanging "under" the grid
                this._$content.height(this._rowOuterHeight * this._N/*- this._fixedAreaHeight*/ );
            };
            uiVirtualScroller.prototype.attach = function ($scroller) {
                this._$scroller = $scroller;
                this._panelInst = $scroller.data("wijmo-wijsuperpanel");
                this._updateContentHeight();
                this._updateVerticalScroller();
                $scroller.bind("wijsuperpanelscrolled.wijgrid", $.proxy(this._onSuperpanelScrolled, this));
                $scroller.bind("wijsuperpanelscrolling.wijgrid", $.proxy(this._onSuperpanelScrolling, this));
                $scroller.bind("wijsuperpanelscrolled.wijgrid", $.proxy(this._onSuperpanelPostScrolled, this))// manipulate with the _ignoreScrollEvents property.
                ;
            };
            uiVirtualScroller.prototype._updateVerticalScroller = function () {
                // if vScroll.scrollValue was an y-offset of the content, rather than a percentage of the offset,
                // smallChange and max would be in pixels
                var max = Math.max(0, this._N - (this._view.getVirtualPageSize() - 1));
                // scrollValue is the index of the first row to show
                this._setVerticalScrollerOptions(1, max);
            };
            uiVirtualScroller.prototype._setVerticalScrollerOptions = function (smallChange, max) {
                var vScroller = this._panelInst.options.vScroller;
                vScroller.scrollSmallChange = smallChange;
                vScroller.scrollLargeChange = smallChange * 4;
                // temporary workaround for superpanel bug
                max += vScroller.scrollLargeChange - 1;
                vScroller.scrollMax = max;
                this._panelInst.option("vScroller", vScroller);
                // TODO: rewrite!!
                if(!this._view._isNativeSuperPanel() && ((this._panelInst)._scrollDrag != undefined)) {
                    var f = (this._panelInst)._fields(), vbarContainer = f.vbarContainer, vbarDrag = f.vbarDrag;
                    (this._panelInst)._scrollDrag("v", vbarContainer, vbarDrag, false);
                }
            };
            uiVirtualScroller.prototype._changeVisibleRowsCount = function (visibleRowsCount) {
                this._N = visibleRowsCount;
                this._updateContentHeight();
                this._updateVerticalScroller();
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
                        var scrollToIndex = Math.floor(args.newValue / self._panelInst.options.vScroller.scrollSmallChange), oldScrollIndex = self._view._bounds.start;
                        if(scrollToIndex < 0) {
                            scrollToIndex = 0;
                        }
                        if(scrollToIndex >= self._N) {
                            scrollToIndex = self._N - 1;
                        }
                        if(scrollToIndex !== oldScrollIndex) {
                            self._debounceScrolledEvent = true;
                            self._wijgrid._handleVirtualScrolling(scrollToIndex, null, $.proxy(self._scrollingCompleted, self));
                        } else {
                            self._debounceScrolledEvent = true;
                            self._log();
                            self._clearTimer()// unlock
                            ;
                        }
                    }, this._debounceScrolledEvent ? this._timeout : 0);
                }
            };
            uiVirtualScroller.prototype._scrollingCompleted = function (scrollIndex) {
                this._wijgrid._trackScrollingIndex(scrollIndex);
                this._log();
                if(this._completeListener) {
                    this._completeListener();
                    this._completeListener = null;
                }
                this._clearTimer()// unlock
                ;
            };
            uiVirtualScroller.prototype._onSuperpanelPostScrolled = function () {
                if($.isFunction(this._postScrolled)) {
                    this._postScrolled.apply(this, arguments);
                }
            };
            uiVirtualScroller.prototype._log = function () {
                //if (window.console) {
                //	var bounds = this._wijgrid._view()._bounds;
                //	window.console.log("bounds: [" + bounds.start + ", " + bounds.end + "], scrollTo: " + bounds.start);
                //}
                            };
            return uiVirtualScroller;
        })();
        grid.uiVirtualScroller = uiVirtualScroller;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts" />
    (function (grid) {
        /** @ignore */
        var renderBoundsCollection = (function () {
            function renderBoundsCollection(maxRowIndex) {
                this._items = [];
                this._capacity = null;
                this._maxRowIndex = maxRowIndex;
            }
            renderBoundsCollection.prototype.add = function (bounds) {
                this._capacity = null;
                var len = this._items.length, last;
                if(!len || (last = this._items[len - 1]).end < bounds.start) {
                    if(len && (bounds.start - last.end === 1)) {
                        last.end = bounds.end;
                    } else {
                        this._items.push(bounds);
                    }
                } else {
                    // todo: merge adjacent bounds
                                        var idxS = this._binSearchByStartVal(bounds.start), idxE = this._binSearchByEndVal(bounds.end), idxSn = idxS < 0 ? ~idxS : idxS, idxEn = idxE < 0 ? ~idxE : idxE, pinL = (idxS >= 0) || (idxSn > 0 && bounds.start <= this._items[idxSn - 1].end), pinR = (idxE >= 0) || (idxEn < len && bounds.end <= this._items[idxEn].end && bounds.end >= this._items[idxEn].start), cnt;
                    if(pinL) {
                        if(pinR) {
                            // 1 1
                            if(idxS >= 0) {
                                this._items[idxEn].start = this._items[idxSn].start;
                                if(cnt = (idxEn - idxSn)) {
                                    this._items.splice(idxSn, cnt);
                                }
                            } else {
                                this._items[idxEn].start = this._items[idxSn - 1].start;
                                if(cnt = idxEn - idxSn + 1) {
                                    this._items.splice(idxSn - 1, cnt);
                                }
                            }
                        } else {
                            // 1 0
                            if(idxS >= 0) {
                                this._items[idxSn].end = bounds.end;
                                if(cnt = (idxEn - idxSn - 1)) {
                                    this._items.splice(idxSn, cnt);
                                }
                            } else {
                                this._items[idxSn - 1].end = bounds.end;
                                if(cnt = (idxEn - idxSn)) {
                                    this._items.splice(idxSn, cnt);
                                }
                            }
                        }
                    } else {
                        // !pinL
                        if(pinR) {
                            // 0 1
                            this._items[idxEn].start = bounds.start;
                            if(cnt = (idxEn - idxSn)) {
                                this._items.splice(idxSn, cnt);
                            }
                        } else {
                            // 0 0
                            this._items.splice(idxSn, idxEn - idxSn, bounds);
                        }
                    }
                }
            };
            renderBoundsCollection.prototype.remove = function (bounds) {
                this._capacity = null;
                var len = this._items.length;
                if(len) {
                    var idxS = this._binSearchByStartVal(bounds.start), idxE = this._binSearchByEndVal(bounds.end), idxSn = idxS < 0 ? ~idxS : idxS, idxEn = idxE < 0 ? ~idxE : idxE, pinL = (idxS >= 0) || (idxSn > 0 && bounds.start <= this._items[idxSn - 1].end), pinR = (idxE >= 0) || (idxEn < len && bounds.end <= this._items[idxEn].end && bounds.end >= this._items[idxEn].start);
                    if(pinL) {
                        if(pinR) {
                            var boundIdxL = (idxS >= 0) ? idxS : idxSn - 1, boundIdxR = (idxE >= 0) ? idxE : idxEn;
                            if(idxS >= 0 && idxE >= 0) {
                                this._items.splice(idxSn, idxEn - idxSn + 1);
                            } else {
                                if(idxS >= 0) {
                                    this._items[idxEn].start = bounds.end + 1;
                                    this._items.splice(idxSn, idxEn - idxSn);
                                } else {
                                    if(idxE >= 0) {
                                        if(boundIdxL === boundIdxR) {
                                            // same bound
                                            this._items[idxSn - 1].end = bounds.start - 1;
                                        } else {
                                            this._items[idxSn].end = bounds.start - 1;
                                            this._items.splice(idxSn, idxEn - idxSn + 1);
                                        }
                                    } else {
                                        if(boundIdxL === boundIdxR) {
                                            // same bound, split single bound.
                                            var tEnd = this._items[idxSn - 1].end;
                                            this._items[idxSn - 1].end = bounds.start - 1;
                                            this._items.splice(idxSn, 0, {
                                                start: bounds.end + 1,
                                                end: tEnd
                                            });
                                        } else {
                                            this._items[idxSn - 1].end = bounds.start - 1;
                                            this._items[idxEn].start = bounds.end + 1;
                                            this._items.splice(idxSn, idxEn - idxSn);
                                        }
                                    }
                                }
                            }
                        } else {
                            if(idxS >= 0) {
                                this._items.splice(idxSn, idxEn - idxSn);
                            } else {
                                this._items[idxSn].end = bounds.start - 1;
                                this._items.splice(idxSn, idxEn - idxSn - 1);
                            }
                        }
                    } else {
                        if(pinR) {
                            if(idxE >= 0) {
                                this._items.splice(idxSn, idxEn - idxSn + 1);
                            } else {
                                // !!
                                this._items[idxEn].start = bounds.end + 1;
                                this._items.splice(idxSn, idxEn - idxSn);
                            }
                        } else {
                            this._items.splice(idxSn, idxEn - idxSn);
                        }
                    }
                }
            };
            renderBoundsCollection.prototype.clear = function () {
                this._capacity = 0;
                this._items = [];
            };
            renderBoundsCollection.prototype.item = function (index) {
                return this._items[index];
            };
            renderBoundsCollection.prototype.forEachIndex = //public forEachIndex(callback: (idx: number) => void ) {
            //	if (callback) {
            //		for (var i = 0, len = this._items.length; i < len; i++) {
            //			var bound = this._items[i];
            //			for (var start = bound.start, end = bound.end; start <= end; start++) {
            //				callback(start);
            //			}
            //		}
            //	}
            //}
            function (start, count, callback) {
                if(start < 0) {
                    return;
                }
                var len = this._items.length, state = this._getIteratorStateFor(start), cnt = 0, flag = true, abort = false;
                if(state) {
                    var j = state.j;
                    for(var i = state.i; i < len && !abort; i++) {
                        var item = this._items[i];
                        if(!flag) {
                            j = item.start;
                        }
                        for(j; j <= item.end && !abort; j++) {
                            if((++cnt > count) && (count !== -1)) {
                                return;
                            }
                            abort = (callback(j) === false);
                        }
                        flag = false;
                    }
                }
            };
            renderBoundsCollection.prototype.forEachIndexBackward = function (start, count, callback) {
                if(start < 0) {
                    return;
                }
                var len = this._items.length, state = this._getIteratorStateFor(start), cnt = 0, flag = true, abort = false;
                if(state) {
                    var j = state.j;
                    for(var i = state.i; i >= 0 && !abort; i--) {
                        var item = this._items[i];
                        if(!flag) {
                            j = item.end;
                        }
                        for(j; j >= item.start && !abort; j--) {
                            if((++cnt > count) && (count !== -1)) {
                                return;
                            }
                            abort = (callback(j) === false);
                        }
                        flag = false;
                    }
                }
            };
            renderBoundsCollection.prototype._getIteratorStateFor = function (visIndex) {
                var len = this._items.length, cap = 0;
                for(var i = 0; i < len; i++) {
                    var item = this._items[i];
                    cap += item.end - item.start + 1;
                    var delta = cap - visIndex;
                    if(delta >= 0) {
                        return {
                            i: i,
                            j: item.end - delta + 1
                        };
                    }
                }
                return null;
            };
            renderBoundsCollection.prototype.getAbsIndex = // [0-5],[10-15]
            // f(6) -> 10
            // Maps visible row index to absolute row (sketch)  index
            function (renderedIndex) {
                for(var i = 0, len = this._items.length; i < len; i++) {
                    var bound = this._items[i], relEndIdx = bound.end - bound.start;
                    if(renderedIndex <= relEndIdx) {
                        return bound.start + renderedIndex;
                    } else {
                        renderedIndex -= relEndIdx + 1// -= bound length
                        ;
                    }
                }
                return -1;
            };
            renderBoundsCollection.prototype.getRenderedIndex = // Maps absolute row (sketch) index to rendered row index
            function (absIndex) {
                var boundIndex = this.hasAbsIndex(absIndex);
                if(boundIndex >= 0) {
                    var capacity = 0;
                    for(var i = 0; i < boundIndex; i++) {
                        var bound = this._items[i];
                        capacity += bound.end - bound.start + 1;
                    }
                    return capacity + (absIndex - this._items[boundIndex].start);
                }
                return -1;
            };
            renderBoundsCollection.prototype.hasAbsIndex = // returns index of the IRenderBound item in the _items array or -1.
            function (absIndex) {
                if(this._items.length) {
                    var idx = this._binSearchByStartVal(absIndex);
                    if(idx >= 0) {
                        return idx;
                    } else {
                        idx = ~idx;
                        if(idx > 0 && absIndex <= this._items[idx - 1].end) {
                            return idx - 1;
                        }
                    }
                }
                return -1;
            };
            renderBoundsCollection.prototype.length = function () {
                return this._items.length;
            };
            renderBoundsCollection.prototype.capacity = function () {
                if(this._capacity === null) {
                    var result = 0;
                    for(var i = 0, len = this._items.length; i < len; i++) {
                        var bound = this._items[i];
                        result += (bound.end - bound.start) + 1;
                    }
                    this._capacity = result;
                }
                return this._capacity;
            };
            renderBoundsCollection.prototype.truncate = function (start, end) {
                this.truncateByStart(start);
                this.truncateByStart(end);
            };
            renderBoundsCollection.prototype.truncateByCount = function (value) {
                var count = 0;
                if(value === 0) {
                    this._items = [];
                } else {
                    for(var i = 0, len = this._items.length; i < len; i++) {
                        var bound = this._items[i];
                        count += (bound.end - bound.start) + 1;
                        if(count >= value) {
                            if(count > value) {
                                bound.end -= count - value;
                            }
                            this._items.splice(i + 1, this._items.length - (i + 1));
                            break;
                        }
                    }
                }
            };
            renderBoundsCollection.prototype.truncateByStart = function (value, pinFirstRemainingBoundToValue) {
                var idx = this._binSearchByStartVal(value), len = this._items.length;
                if(idx < 0) {
                    idx = ~idx;
                    if(idx < len) {
                        if(idx > 0 && this._items[idx - 1].end >= value) {
                            this._items[idx - 1].start = value;
                            this._items.splice(0, idx - 1);
                        } else {
                            if(pinFirstRemainingBoundToValue) {
                                this._items[idx].start = value;
                            }
                            this._items.splice(0, idx);
                        }
                    } else {
                        this._items = [];
                    }
                } else {
                    this._items.splice(0, idx);
                }
            };
            renderBoundsCollection.prototype.truncateByEnd = function (value, pinLastRemainingBoundToValue) {
                // todo
                                var idx = this._binSearchByEndVal(value), len = this._items.length;
                if(idx < 0) {
                    idx = ~idx;
                    if(idx < len) {
                        this._items[idx].end = value;
                        this._items.splice(idx + 1, this._items.length - idx + 1);
                    } else {
                        this._items = [];
                    }
                } else {
                    this._items.splice(idx + 1, this._items.length - idx + 1);
                }
            };
            renderBoundsCollection.prototype.deleteFromTop = function (count) {
                var i = 0, cap = 0;
                for(i = 0; i < this._items.length; i++) {
                    var item = this._items[i];
                    cap += item.end - item.start + 1;
                    if(cap >= count) {
                        break;
                    }
                }
                if(cap >= count) {
                    this._items[i].start = cap - count + 1;
                }
                this._items.splice(0, i);
            };
            renderBoundsCollection.prototype.deleteFromBottom = function (count) {
                // todo: check
                                var i = 0, cap = 0;
                for(i = this._items.length - 1; i >= 0; i--) {
                    var item = this._items[i];
                    cap += item.end - item.start + 1;
                    if(cap >= count) {
                        break;
                    }
                }
                if(cap >= count) {
                    this._items[i].start = cap - count + 1;
                }
                this._items.splice(i, this._items.length - i);
            };
            renderBoundsCollection.prototype._binSearchByStartVal = function (value) {
                var l = 0, u = this._items.length - 1;
                while(l <= u) {
                    var m = (u + l) >> 1, cmp = this._items[m].start - value;
                    if(cmp === 0) {
                        return m;
                    }
                    if(cmp < 0) {
                        l = m + 1;
                    } else {
                        u = m - 1;
                    }
                }
                return ~l;
            };
            renderBoundsCollection.prototype._binSearchByEndVal = function (value) {
                var l = 0, u = this._items.length - 1;
                while(l <= u) {
                    var m = (u + l) >> 1, cmp = this._items[m].end - value;
                    if(cmp < 0) {
                        l = m + 1;
                    } else {
                        if(cmp) {
                            u = m - 1;
                        } else {
                            return m;
                        }
                    }
                }
                return ~l;
            };
            return renderBoundsCollection;
        })();
        grid.renderBoundsCollection = renderBoundsCollection;
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
        /** @ignore */
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
        /** @ignore */
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
                    return glob.format(value, format || "n", culture.name);
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
                    return glob.format(value, format || "c", culture.name);
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
                    return glob.format(value, format || "d", culture.name);
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
            /** @ignore */
            (function (extended) {
                /** @ignore */
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
                        isEmpty: true,
                        original: extendedFilter,
                        normalized: normalizeFilter(extendedFilter),
                        func: null
                    };
                    if(result.normalized == null) {
                        result.func = function (x) {
                            return true;
                        };
                    } else {
                        result.isEmpty = false;
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
                /** @ignore */
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
        /** @ignore */
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

var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (grid) {
        /** @ignore */
        var koDataView = (function (_super) {
            __extends(koDataView, _super);
            function koDataView(observableArray) {
                this.mObservableArray = observableArray;
                var sourceArray = ko.utils.unwrapObservable(this.mObservableArray);
                        _super.call(this, sourceArray, null);
            }
            koDataView.validSource = function validSource(source) {
                return !!(ko && ko.isObservable(source) && $.isFunction(source.slice));// is there is a better way to detect?

            };
            koDataView.prototype.refresh = function (shape, local) {
                if (typeof local === "undefined") { local = false; }
                this.sourceArray = ko.utils.unwrapObservable(this.mObservableArray);
                this.mPlainArray = ko.toJS(this.sourceArray);
                // ** #53562: ensure that pageIndex is within [0; pageCount) range
                var pageSize = shape && shape.pageSize !== undefined ? shape.pageSize : this.pageSize();
                var pageIndex = shape && shape.pageIndex !== undefined ? shape.pageIndex : this.pageIndex();
                if(pageSize > 0 && pageIndex > 0) {
                    var pageCount = wijmo.data.util.pageCount(this.sourceArray.length, pageSize);
                    if(pageIndex >= pageCount) {
                        pageIndex = Math.max(0, pageCount - 1);
                        if(!shape) {
                            shape = {
                            };
                        }
                        shape.pageIndex = pageIndex;
                    }
                }
                // ** #53562: ensure that pageIndex is within[0; pageCount) range
                return _super.prototype.refresh.apply(this, [
                    shape,
                    local
                ]);
            };
            koDataView.prototype.getPlainSource = function () {
                return this.mPlainArray;
            };
            koDataView.prototype.dispose = function () {
                this.mObservableArray = null;
                this.mPlainArray = null;
                _super.prototype.dispose.apply(this, arguments);
            };
            return koDataView;
        })(wijmo.data.ArrayDataView);
        grid.koDataView = koDataView;
        //wijmo.data.registerDataViewFactory(observableArray => {
        //	if (wijmo.grid.koDataView.validSource(observableArray)) {
        //		return new koDataView(observableArray);
        //	}
        //});
            })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
