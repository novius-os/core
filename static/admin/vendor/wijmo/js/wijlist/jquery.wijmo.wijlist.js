/*
 *
 * Wijmo Library 3.20133.20
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Dual licensed under the MIT or GPL Version 2 licenses.
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
    /// <reference path="../external/declarations/globalize.d.ts"/>
    /// <reference path="../wijutil/jquery.wijmo.wijutil.ts"/>
    /// <reference path="../Base/jquery.wijmo.widget.ts"/>
    /// <reference path="../wijsuperpanel/jquery.wijmo.wijsuperpanel.ts"/>
    /*globals jQuery,window,document*/
    /*
    * Depends:
    *     jquery.ui.core.js
    *     jquery.ui.widget.js
    *     jquery.wijmo.wijtooltip.js
    */
    (function (list) {
        "use strict";
        var $ = jQuery, widgetName = "wijlist";
        //listCSS = "ui-widget ui-widget-content ui-corner-all wijmo-wijlist",
        var listItemCSS = "wijmo-wijlist-item", //listCSS = "ui-widget ui-widget-content ui-corner-all wijmo-wijlist",
        listItemCSSAlternate = listItemCSS + "-alternate", //listCSS = "ui-widget ui-widget-content ui-corner-all wijmo-wijlist",
        listItemCSSSelected = listItemCSS + "-selected", //listCSS = "ui-widget ui-widget-content ui-corner-all wijmo-wijlist",
        listItemCSSFirst = listItemCSS + "-first", //listCSS = "ui-widget ui-widget-content ui-corner-all wijmo-wijlist",
        listItemCSSLast = listItemCSS + "-last", //listCSS = "ui-widget ui-widget-content ui-corner-all wijmo-wijlist",
        activeItem = //stateHover = "ui-state-hover",
        //uiStateActive = "ui-state-active",
        "wijmo-wijlistitem-active", //listCSS = "ui-widget ui-widget-content ui-corner-all wijmo-wijlist",
        itemKey = //selectedActive = listItemCSSSelected + " " + uiStateActive,
        "item.wijlist";
        /** @widget */
        var wijlist = (function (_super) {
            __extends(wijlist, _super);
            function wijlist() {
                _super.apply(this, arguments);

            }
            wijlist.prototype.removeAll = /** The removeAll method removes all items from the wijlist.*/
            function () {
                var self = this;
                self.items = [];
                self._refresh();
            };
            wijlist.prototype.addItem = /** The addItem method adds the specified item to the list by index.
            * @remarks
            *      If the index is undefined, then the item becomes the last list item.
            * @param {object} item Indicates the listItem to add.
            * @param {number} index Index of the added item.
            */
            function (item, index) {
                var self = this;
                self._checkData();
                if(index === null || index === undefined) {
                    self.items.push(item);
                } else {
                    if(self.items) {
                        self.items.splice(index, 0, item);
                    }
                }
                self._refresh();
                self._trigger("added", null, {
                    item: item,
                    index: index
                });
            };
            wijlist.prototype.removeItem = /** The removeItem method removes the specified item from the wijlist.
            * @param {object} item Indicates the item to be removed.
            */
            function (item) {
                var self = this, index;
                self._checkData();
                index = self.indexOf(item);
                if(index >= 0) {
                    self.removeItemAt(index);
                }
            };
            wijlist.prototype.indexOf = /** The indexOf method returns the index of the specified list item.
            * @param {object} item Indicates the specified item.
            * @returns {number} the index of first matched specified item.
            */
            function (item) {
                var self = this, index = -1, i = 0, oItem;
                self._checkData();
                for(i = 0; i < self.items.length; i++) {
                    oItem = self.items[i];
                    if(oItem.label === item.label && oItem.value === item.value) {
                        index = i;
                        break;
                    }
                }
                return index;
            };
            wijlist.prototype.findIndexByLabel = /** Allows the user to find the index of first matched list item by item's label.
            * @param {string} label Indicates the specified item's label that used to search.
            * @returns {number} the index of first matched list item.
            * @remarks
            *    If there is no matched list item, it will return -1.
            */
            function (label) {
                var self = this, index = -1, i = 0, oItem;
                if(label === null || label === undefined) {
                    return index;
                }
                self._checkData();
                for(i = 0; i < self.items.length; i++) {
                    oItem = self.items[i];
                    if(oItem.label === label) {
                        index = i;
                        break;
                    }
                }
                return index;
            };
            wijlist.prototype.removeItemAt = /** The removeItemAt method removes the specified list item by index from the wijlist widget.
            * @param {number} index The zero-based index of the list item to remove.
            */
            function (index) {
                var self = this;
                self._checkData();
                self.items.splice(index, 1);
                self._refresh();
            };
            wijlist.prototype._checkData = function () {
                var self = this;
                if(!self.items) {
                    self.items = [];
                }
            };
            wijlist.prototype._refresh = function () {
                var self = this;
                self.renderList();
                self.refreshSuperPanel();
            };
            wijlist.prototype._setOption = function (key, value) {
                var self = this, selectedItem, selectedActive = listItemCSSSelected + " " + self.options.wijCSS.stateActive, ulOuterHeight, isBind, renderItems;
                //$.wijmo.widget.prototype._setOption.apply(self, arguments);
                _super.prototype._setOption.call(this, key, value);
                if(key === "disabled") {
                    self._handleDisabledOption(value, self.element);
                } else if(key === "selectionMode") {
                    selectedItem = self.selectedItem;
                    if(selectedItem) {
                        selectedItem.selected = false;
                        if(selectedItem.element) {
                            selectedItem.element.removeClass(selectedActive);
                        }
                        self.selectedItem = undefined;
                    }
                    if(self.selectedItems) {
                        $.each(self.selectedItems, function (index, i) {
                            i.selected = false;
                            i.element.removeClass(selectedActive);
                        });
                    }
                    self.selectedItem = [];
                } else if(key === "listItems") {
                    isBind = self._isBind();
                    if(isBind) {
                        renderItems = self._getRenderItems();
                        self.setItems(renderItems);
                    } else {
                        self.setItems(value);
                    }
                    self.renderList();
                    self.refreshSuperPanel();
                } else if(key === "dataSource") {
                    isBind = self._isBind();
                    if(isBind) {
                        renderItems = self._getRenderItems();
                        self.setItems(renderItems);
                        self.renderList();
                        self.refreshSuperPanel();
                    }
                } else if(key === "autoSize" || key === "maxItemsCount") {
                    if(!self.options.autoSize && self.element.is(":visible")) {
                        if(self._oriHeight !== 0) {
                            self.element.height(self._oriHeight);
                        } else {
                            ulOuterHeight = self.ul.outerHeight();
                            self.element.height(ulOuterHeight);
                            $(".wijmo-wijsuperpanel-statecontainer", self.element).height(ulOuterHeight);
                            $(".wijmo-wijsuperpanel-contentwrapper", self.element).height(ulOuterHeight);
                        }
                    }
                    self.refreshSuperPanel();
                }
            };
            wijlist.prototype._create = function () {
                var self = this, ele = this.element, o = this.options, wijCSS = o.wijCSS, listCSS = wijCSS.widget + " " + wijCSS.content + " " + wijCSS.cornerAll + " wijmo-wijlist", renderItems;
                // enable touch support:
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                self._oriHeight = parseInt(ele.css("height"), 10);
                ele.addClass(listCSS).attr({
                    role: "listbox",
                    "aria-activedescendant": activeItem,
                    "aria-multiselectable": o.selectionMode === "multiple"
                }).bind("click." + self.widgetName, self, self._onListClick);
                if(ele.is("div") && ele.children().is("ul")) {
                    self._isInnerData = true;
                    self._templates = [];
                    $.each($("ul > li", ele), function (idx, liNode) {
                        self._templates.push({
                            templateHtml: liNode.innerHTML
                        });
                    });
                    self._oriChildren = ele.children().hide();
                }
                self.ul = $("<ul class='" + wijCSS.listul + "'></ul>").appendTo(ele);
                if(o.listItems !== null) {
                    renderItems = self._getRenderItems();
                    if(renderItems) {
                        self.setItems(renderItems);
                        self.renderList();
                        self.refreshSuperPanel();
                    }
                }
                //update for visibility change
                if(self.element.is(":hidden") && self.element.wijAddVisibilityObserver) {
                    self.element.wijAddVisibilityObserver(function () {
                        self.refreshSuperPanel();
                        if(self.element.wijRemoveVisibilityObserver) {
                            self.element.wijRemoveVisibilityObserver();
                        }
                    }, "wijlist");
                }
                if(o.disabled) {
                    self.disable();
                    self._handleDisabledOption(true, self.element);
                }
            };
            wijlist.prototype._isBind = function () {
                var o = this.options, listItems = o.listItems;
                if(listItems !== null && listItems.label && listItems.label.bind) {
                    return true;
                }
                return false;
            };
            wijlist.prototype._getRenderItems = function () {
                var o = this.options, listItems = o.listItems;
                if(listItems !== null) {
                    if($.isArray(listItems) && listItems.length > 0 && typeof (listItems[0].label) === "string") {
                        return listItems;
                    } else if(listItems.label && listItems.label.bind) {
                        return this._getMappingItems();
                    } else {
                        return null;
                    }
                }
                return null;
            };
            wijlist.prototype._getMappingItems = function () {
                var o = this.options, dataSource = o.dataSource, listItems = o.listItems, mappingItems, labelKey, valueKey;
                if(!dataSource || !listItems) {
                    return null;
                }
                if(!listItems.label || !listItems.label.bind || !listItems.value || !listItems.value.bind) {
                    return null;
                }
                labelKey = listItems.label.bind;
                valueKey = listItems.value.bind;
                //1.Array
                if(dataSource && dataSource.length !== 0) {
                    mappingItems = [];
                    $.each(dataSource, function (i, item) {
                        mappingItems.push({
                            label: item[labelKey],
                            value: item[valueKey]
                        });
                    });
                    return mappingItems;
                }
                return null;
            };
            wijlist.prototype._handleDisabledOption = function (disabled, ele) {
                var self = this;
                if(disabled) {
                    if(!self.disabledDiv) {
                        self.disabledDiv = self._createDisabledDiv(ele);
                    }
                    self.disabledDiv.appendTo("body");
                } else {
                    if(self.disabledDiv) {
                        self.disabledDiv.remove();
                        self.disabledDiv = null;
                    }
                }
            };
            wijlist.prototype._createDisabledDiv = function (outerEle) {
                var self = this, ele = outerEle || self.element, eleOffset = ele.offset(), disabledWidth = ele.outerWidth(), disabledHeight = ele.outerHeight();
                return $("<div></div>").addClass("ui-disabled").css({
                    "z-index": "99999",
                    position: "absolute",
                    width: disabledWidth,
                    height: disabledHeight,
                    left: eleOffset.left,
                    top: eleOffset.top,
                    "pointer-events": "auto"
                });
            };
            wijlist.prototype.setTemplateItems = /** @ignore */
            function (data) {
                this._setItemsByExtend(data, true);
            };
            wijlist.prototype.setItems = /** The method sets the items for the wijlist to render.
            * @param {array} items Items to be rendered by the wijlist.
            */
            function (items) {
                this._setItemsByExtend(items, false);
            };
            wijlist.prototype._setItemsByExtend = function (_items, isExtend) {
                /// <summary>
                /// Sets Items to be rendered by the wijlist.
                /// </summary>
                /// <param name="items" type="Array">
                /// Items array to be rendered.  The array contains object like
                ///{label: "label", value: "value"}.
                /// </param>
                                var self = this, selectedItems;
                // fixed the issue 39687, because the item is referenced with the data option,
                // when use the same data to init more than one list, when set the item's sub field and store to jQuery data,
                // it will also change the previous stored jQuery data.
                var items = [];
                $.each(_items, function (i, item) {
                    items[i] = $.extend(true, {
                        label: "",
                        value: ""
                    }, item);
                });
                if(isExtend) {
                    //update for 24130 issue at 2012/7/20
                    //first load the items by keydown, the
                    //items.length will not be equal self._templates.length
                    if(self._templates && items && items.length !== self._templates.length) {
                        return;
                    }
                    self.items = items;
                    //end
                    if(!self.items) {
                        self.items = [];
                    }
                    $.each(self._templates, function (idx) {
                        if(self.items[idx]) {
                            self.items[idx].templateHtml = self._templates[idx].templateHtml;
                        } else {
                            self.items.push({
                                templateHtml: self._templates[idx].templateHtml,
                                label: items[idx].label,
                                value: items[idx].value
                            });
                        }
                    });
                } else {
                    self.items = items;
                }
                if(!items) {
                    return null;
                }
                selectedItems = $.grep(items, function (a) {
                    return a.selected;
                }, undefined);
                if(self.options.selectionMode === "single") {
                    self.selectedItems = [];
                    self.selectedItem = selectedItems.length > 0 ? selectedItems[0] : undefined;
                } else {
                    self.selectedItems = selectedItems;
                }
            };
            wijlist.prototype.filterItems = /** @ignore */
            function (searchTerm, autoFilter, needHighlightMatching, hightWord) {
                var self = this, term1 = self._escapeRegex(searchTerm), matcher, selectedActive = listItemCSSSelected + " " + self.options.wijCSS.stateActive, priorityPrimary = self.options.wijCSS.priorityPrimary, priorityPrimaryFilter = "highlight-filter", label, liText = '', itemsChanged = false, topHit = null;
                /// TODO : start with or contains and case sensitive.
                if(!this.items) {
                    return null;
                }
                if($("li[wijhidden]." + listItemCSS, self.element) && $("li[wijhidden]." + listItemCSS, self.element).length > 0) {
                    itemsChanged = true;
                }
                if($("span." + priorityPrimaryFilter, self.element) && $("span." + priorityPrimaryFilter, self.element).length > 0) {
                    itemsChanged = true;
                }
                if(!itemsChanged && (!searchTerm || searchTerm.length === 0)) {
                    $.each(this.items, function (index, item) {
                        if(item.selected) {
                            self.activate(null, item, false);
                            if(item.element) {
                                item.element.addClass(selectedActive);
                            }
                            self.selectedItem = item;
                        } else {
                            if(item.element && item.element.hasAllClasses(selectedActive)) {
                                item.element.removeClass(selectedActive);
                            }
                        }
                    });
                    return;
                }
                matcher = new RegExp(term1, "i");
                $.each(this.items, function (index, item) {
                    label = item.label;
                    // if text is set, text will override label value.
                    if(item.templateHtml) {
                        label = item.templateHtml;
                    } else if(item.text !== undefined) {
                        label = item.text;
                    }
                    /* remove the code the close the dropdown list
                    * when close the dropdown list, all items need to
                    * restore original style, see resetItemsStyle*/
                    if($("span." + priorityPrimaryFilter, item.element).length > 0) {
                        item.element.empty().append(label);
                    }
                    //filter still use the item.label;
                    var matchResult = matcher.exec(item.label);
                    if(matchResult === null && autoFilter) {
                        if(item.element) {
                            item.element.hide();
                            item.element.attr("wijhidden", "wijhidden");
                        }
                    } else {
                        // update for: when using the key to active the item
                        // the active item is incorrect at 2012/8/13
                        if(item.selected) {
                            self.activate(null, item, false);
                            if(item.element) {
                                item.element.addClass(selectedActive);
                            }
                            self.selectedItem = item;
                        } else {
                            if(item.element && item.element.hasAllClasses(selectedActive)) {
                                item.element.removeClass(selectedActive);
                            }
                        }
                        if(needHighlightMatching) {
                            liText = label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term1 + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<span class='" + priorityPrimary + " " + priorityPrimaryFilter + "'>$1</span>");
                            if(item.element) {
                                item.element.html(liText);
                            }
                        }
                        if(item.element && !item.element.is(":visible")) {
                            item.element.show();
                            item.element.removeAttr("wijhidden");
                        }
                        //update for 25224 issue at 2012/8/13
                        if(term1 !== undefined && term1.length !== 0 && topHit === null && matchResult && matchResult.index === 0) {
                            //self.activate(null, item, true);
                            topHit = item;
                        }
                    }
                });
                return topHit;
            };
            wijlist.prototype.popItem = /** The popItem method removes the last item from the wijlist widget.*/
            function () {
                var self = this;
                self._checkData();
                self.items.pop();
                self._refresh();
            };
            wijlist.prototype.getList = /** The method gets the jQuery object reference of the <ul> element of the wijlist widget.
            * @returns {object} the ul JQuery reference.
            */
            function () {
                return this.ul;
            };
            wijlist.prototype._onListClick = function (e) {
                var self = e.data;
                if(self.options.disabled) {
                    return;
                }
                if(!$(e.target).closest("." + listItemCSS).length) {
                    return;
                }
                self.select(e);
            };
            wijlist.prototype.destroy = /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            function () {
                var self = this, ele = this.element, o = this.options, wijCSS = o.wijCSS, listCSS = wijCSS.widget + " " + wijCSS.content + " " + wijCSS.cornerAll + " wijmo-wijlist";
                if(self.superPanel !== undefined) {
                    self.superPanel.destroy();
                }
                ele.removeClass("wijmo-wijobserver-visibility").removeClass(listCSS).removeAttr("role").removeAttr("aria-activedescendant").unbind("." + self.widgetName);
                self.ul.remove();
                if(self.disabledDiv) {
                    self.disabledDiv.remove();
                    self.disabledDiv = null;
                }
                if(self._isInnerData) {
                    self._oriChildren.show();
                }
                // $.wijmo.widget.prototype.destroy.apply(self, arguments);
                _super.prototype.destroy.call(this);
            };
            wijlist.prototype.activate = /** The activate method activates an item in the wijlist and allows the list to scroll to the item.
            * @param {object} event The event object that activates the item.
            * @param {object} item The listItem to activate.
            * @param {boolean} scrollTo Indicates whether to scroll the activated item into view.
            */
            function (event, item, scrollTo) {
                var self = this, active, activeElement;
                self.deactivate();
                if(item === null || item === undefined) {
                    return;
                }
                if(self._trigger("focusing", event, item) === false) {
                    return;
                }
                active = self.active = item;
                activeElement = active && active.element;
                if(activeElement) {
                    if(self.options.addHoverItemClass) {
                        activeElement.addClass(self.options.wijCSS.stateHover);
                    }
                    activeElement.attr("id", activeItem);
                }
                if(scrollTo && self.superPanel !== undefined) {
                    self.superPanel.scrollChildIntoView(activeElement);
                }
                if(self.element.is(":visible")) {
                    self._trigger("focus", event, item);
                }
            };
            wijlist.prototype.deactivate = /** The deactivate method deactivates the activated item in the wijlist widget.*/
            function () {
                var self = this, a = self.active, ele;
                if(!a) {
                    return;
                }
                ele = a.element;
                self._trigger("blur", null, a);
                if(ele) {
                    ele.removeClass(self.options.wijCSS.stateHover).removeAttr("id");
                }
                self.active = undefined;
            };
            wijlist.prototype.next = /** The next method moves focus to the next list item.
            * @param {object} event Event will raise activation.
            */
            function (event) {
                this.move("next", "." + listItemCSS + ":first", event);
            };
            wijlist.prototype.nextPage = /** The nextPage method turns to the next page of the list.*/
            function () {
                this.superPanel.doScrolling("bottom", true);
            };
            wijlist.prototype.previous = /** The previous method moves focus to the previous list item.
            * @param {object} event Event will raise activation.
            */
            function (event) {
                this.move("prev", "." + listItemCSS + ":last", event);
            };
            wijlist.prototype.previousPage = /** The previous method moves focus to the previous list item.
            */
            function () {
                this.superPanel.doScrolling("top", true);
            };
            wijlist.prototype.first = /** The first method tests whether the focus is at the first list item.*/
            function () {
                return this.active && !this.active.element.prev().length;
            };
            wijlist.prototype.last = /** The last method tests whether the last list item has focus.*/
            function () {
                return this.active && !this.active.element.next().length;
            };
            wijlist.prototype.move = /** @ignore */
            function (direction, edge, event) {
                /// <summary>
                /// Move focus between items.
                /// </summary>
                                var self = this, item, next;
                if(!self.active) {
                    item = self.ul.children(":visible" + edge).data(itemKey);
                    self.activate(event, item, true);
                    return;
                }
                next = self.active.element[direction + "All"](":visible." + listItemCSS).eq(0);
                /*
                if (!self._templates) {
                next = self.active.element[direction + "All"]("." + listItemCSS).eq(0);
                } else {
                //add for only visible item will be moved
                next = self.active.element[direction + "All"](":visible." + listItemCSS).eq(0);
                }*/
                if(next.length) {
                    self.activate(event, next.data(itemKey), true);
                } else {
                    self.activate(event, self.element.children(edge).data(itemKey), true);
                }
            };
            wijlist.prototype.select = /** @ignore */
            function (event, data) {
                /// <summary>
                /// Selects active list item.
                /// </summary>
                ///
                                var self = this, ele, selectedIndex, selectedActive = listItemCSSSelected + " " + self.options.wijCSS.stateActive, item, singleMode, previous;
                if(!self.active) {
                    self.active = $($(event.target).closest("." + listItemCSS)).data(itemKey);
                    if(!self.active) {
                        return;
                    }
                }
                ele = self.active.element;
                if(ele === undefined || ele.attr("wijhidden")) {
                    return;
                }
                item = ele.data(itemKey);
                if(!item) {
                    return;
                }
                //end
                singleMode = self.options.selectionMode === "single";
                if(singleMode) {
                    previous = self.selectedItem;
                    ele.addClass(selectedActive).attr("aria-selected", "true");
                    item.selected = true;
                    if(previous !== undefined && item !== previous) {
                        previous.selected = false;
                        if(previous.element) {
                            previous.element.removeClass(selectedActive).removeAttr("aria-selected");
                        }
                    }
                    self.selectedItem = item;
                    selectedIndex = $.inArray(item, self.items);
                    self._trigger("selected", event, {
                        item: item,
                        previousItem: previous,
                        selectedIndex: selectedIndex,
                        data: data
                    });
                } else {
                    item.selected = !item.selected;
                    if(item.selected) {
                        ele.addClass(selectedActive).attr("aria-selected", "true");
                    } else {
                        ele.removeClass(selectedActive).removeClass("wijmo-wijcombobox-selecteditem").removeAttr("aria-selected", "true");
                    }
                    selectedIndex = [];
                    self.selectedItems = $.grep(self.items, function (a, index) {
                        if(a.selected) {
                            selectedIndex.push(index);
                        }
                        return a.selected === true;
                    }, undefined);
                    self._trigger("selected", event, {
                        selectedIndex: selectedIndex,
                        item: item,
                        selectedItems: self.selectedItems
                    });
                }
            };
            wijlist.prototype._findItemsByValues = function (values) {
                var itemFound, found = [];
                found = $.grep(this.items, function (itm, i) {
                    itemFound = false;
                    for(var j = 0; j < values.length; j++) {
                        if(itm.value === values[j]) {
                            itemFound = true;
                        }
                    }
                    return itemFound;
                }, undefined);
                return found;
            };
            wijlist.prototype._findItemsByIndices = function (indices) {
                var self = this, len = this.items.length, found = [];
                $.each(indices, function (index, value) {
                    if(value >= 0 && value < len) {
                        found.push(self.items[value]);
                    }
                });
                return found;
            };
            wijlist.prototype.getItems = /** The getItems method allows the user to find list items by index or by value.
            * @param {array|number|string} indices the indices of the items.
            * @param {boolean} byIndex Indicates the indices parameter is indices or values of items.
            *                   If true, it's used as the index/indices of the item(s) to get.
            *                   If false, it's used as the value/values of the item(s) to get.
            * @returns {object} the item at the specified index or with the specified value.
            */
            function (indices, byIndex) {
                var self = this, isNumber, byArray, searchTerms, foundItems;
                byArray = $.isArray(indices);
                isNumber = (!byArray) && typeof (indices) === "number" || (byArray && typeof (indices[0]) === "number");
                searchTerms = byArray ? indices : [
                    indices
                ];
                if(!byIndex) {
                    foundItems = self._findItemsByValues(searchTerms);
                } else {
                    if(!isNumber) {
                        return null;
                    }
                    foundItems = self._findItemsByIndices(searchTerms);
                }
                return foundItems;
            };
            wijlist.prototype.selectItems = /** Selects item(s) in the list by item index/indices or value(s).
            * @param {array|number|string} indices the indices of the items.
            * @param {boolean} triggerSelected Whether to trigger selected event of list.
            * @param {boolean} byIndex Indicates the indices parameter is indices or values of items.
            *                   If true, it's used as the index/indices of the item(s) to get.
            *                   If false, it's used as the value/values of the item(s) to get.
            */
            function (indices, triggerSelected, byIndex) {
                var self = this, singleMode = this.options.selectionMode === "single", selectedActive = listItemCSSSelected + " " + self.options.wijCSS.stateActive, item, previous, foundItems;
                foundItems = self.getItems(indices, byIndex);
                if(singleMode) {
                    if(foundItems.length > 0) {
                        item = foundItems[0];
                        item.selected = true;
                        item.element.addClass(selectedActive);
                    }
                    previous = self.selectedItem;
                    if(previous) {
                        previous.selected = false;
                        previous.element.removeClass(selectedActive);
                    }
                    self.selectedItem = item;
                    if(triggerSelected) {
                        self._trigger("selected", null, {
                            item: item,
                            previousItem: previous
                        });
                    }
                } else {
                    $.each(foundItems, function (index, itm) {
                        itm.selected = true;
                        itm.element.addClass(selectedActive);
                    });
                    self.selectedItems = $.grep(self.items, function (a) {
                        return a.selected;
                    }, undefined);
                    if(triggerSelected) {
                        self._trigger("selected", null, {
                            selectedItems: self.selectedItems
                        });
                    }
                }
            };
            wijlist.prototype.unselectItems = /** The unselectItems method clears selections from the indicated list items.
            * @param {array} indices The zero-based index numbers of items to clear.
            */
            function (indices) {
                var self = this, mode = this.options.selectionMode, selectedActive = listItemCSSSelected + " " + self.options.wijCSS.stateActive, selectedItem, foundItems;
                if(mode === "single") {
                    selectedItem = self.selectedItem;
                    if(selectedItem) {
                        selectedItem.selected = false;
                        selectedItem.element.removeClass(selectedActive).removeClass(// when autopost back is true, this class can't removed
                        "wijmo-wijcombobox-selecteditem");
                        self.selectedItem = undefined;
                    }
                } else {
                    foundItems = self.getItems(indices, true);
                    if(!foundItems || foundItems.length === 0) {
                        return;
                    }
                    $.each(foundItems, function (index, i) {
                        i.selected = false;
                        i.element.removeClass(selectedActive).removeClass(// when autopost back is true, this class can't removed
                        "wijmo-wijcombobox-selecteditem");
                    });
                    self.selectedItems = $.grep(self.items, function (a) {
                        return a.selected;
                    }, undefined);
                }
            };
            wijlist.prototype.renderList = /** The renderList method renders the wijlist widget on the client browser when list items change. */
            function () {
                var self = this, ul = this.ul, o = this.options, items, count, singleMode, i, item;
                //licollection;
                                ul.empty();
                // returns if no items to render.
                items = self.items;
                if(items === undefined || items === null) {
                    return;
                }
                count = items.length;
                if(count === 0) {
                    return;
                }
                singleMode = o.selectionMode === "single";
                //for performance change
                //licollection = [];
                for(i = 0; i < count; i++) {
                    item = items[i];
                    //for jquery 1.9 change
                    self._renderItem(ul, item, i, singleMode);
                    //licollection.push(self._renderItem(ul, item, i, singleMode));
                                    }
                //for jquery 1.9 change
                //for performance change
                //$(licollection).appendTo(ul);
                if(count > 0) {
                    if(items[0].element) {
                        items[0].element.addClass(listItemCSSFirst);
                    }
                    if(items[count - 1].element) {
                        items[count - 1].element.addClass(listItemCSSLast);
                    }
                }
                self._trigger("listRendered", null, self);
            };
            wijlist.prototype._renderItem = function (ul, item, index, singleMode) {
                var self = this, li = $("<li role='option' class='" + self.options.wijCSS.listItem + " " + listItemCSS + " " + self.options.wijCSS.cornerAll + "'></li>"), selectedActive = listItemCSSSelected + " " + self.options.wijCSS.stateActive, label, url;
                item.element = li;
                item.list = self;
                if(self._trigger("itemRendering", null, item) === false) {
                    return;
                }
                label = item.label;
                if(item.title) {
                    li.attr("title", item.title);
                }
                // if text is set, text will override label value.
                if(item.templateHtml) {
                    label = item.templateHtml;
                } else if(item.text !== undefined) {
                    label = item.text;
                }
                // binds list item event
                li.bind("mouseover", function (event) {
                    if(self.options.disabled) {
                        return;
                    }
                    self.activate(event, item, false);
                }).bind("mouseout", function () {
                    if(self.options.disabled) {
                        return;
                    }
                    if(!self.options.keepHightlightOnMouseLeave) {
                        self.deactivate();
                    }
                }).data(itemKey, item);
                //fixed an issue that when the combobox use template, and it contains the html markup,
                // if use text method, the template will render as string in the li element.
                if(item.templateHtml) {
                    li.append(label);
                } else {
                    li.text(label);
                }
                li.appendTo(ul)//for jquery 1.9
                ;
                // render image
                if(!self._isInnerData) {
                    // render image
                    url = item.imageUrl;
                    if(url !== undefined && url.length > 0) {
                        li.prepend("<img src='" + item.imageUrl + "'>");
                    }
                }
                // add selected items
                if(item.selected) {
                    self.activate(null, item, false);
                    li.addClass(selectedActive);
                }
                if(index % 2 === 1) {
                    li.addClass(listItemCSSAlternate);
                }
                self._trigger("itemRendered", null, item);
                return li;
            };
            wijlist.prototype._escapeRegex = function (value) {
                if(value === undefined) {
                    return value;
                }
                return value.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1");
            };
            wijlist.prototype.adjustOptions = //update for juice
            function () {
                var o = this.options, i;
                if(o.data !== null) {
                    for(i = 0; i < o.listItems.length; i++) {
                        delete o.listItems[i].element;
                        delete o.listItems[i].list;
                    }
                }
                return o;
            };
            wijlist.prototype.refreshSuperPanel = /** The refreshSuperPanel method refreshes the SuperPanel around
            *  the wijlist to reflect a change in the wijlist content.
            */
            function () {
                var self = this, ele = this.element, o = this.options, ul = this.ul, singleItem = ul.children("." + listItemCSS + ":first"), headerHeight, ulOuterHeight, eleInnerWidth, spHeader = ele.find(".wijmo-wijsuperpanel-header"), spFooter = ele.find(".wijmo-wijsuperpanel-footer"), adjustHeight = null, h, percent, small, vScroller, large, spOptions, pt;
                if(!ele.is(":visible")) {
                    return false;
                }
                ulOuterHeight = ul.outerHeight();
                eleInnerWidth = ele.innerWidth();
                if(o.autoSize) {
                    adjustHeight = singleItem.outerHeight(true) * o.maxItemsCount;
                }
                if(adjustHeight !== null) {
                    ele.height(Math.min(adjustHeight, ulOuterHeight));
                }
                h = ele.innerHeight();
                //fix #37228, minus header and footer's height.
                if(spHeader.length) {
                    h -= spHeader.height();
                }
                if(spFooter.length) {
                    h -= spFooter.height();
                }
                //end comments
                percent = h / (ulOuterHeight - h);
                large = (101 * percent) / (1 + percent);
                small = (singleItem.outerHeight() / (ulOuterHeight - h)) * (101 - large);
                if(self.superPanel === undefined) {
                    spOptions = {
                        allowResize: false,
                        keyboardSupport: false,
                        bubbleScrollingEvent: true,
                        hScroller: {
                            scrollBarVisibility: "hidden"
                        },
                        vScroller: {
                            scrollSmallChange: small,
                            scrollLargeChange: large
                        }
                    };
                    $.extend(spOptions, o.superPanelOptions);
                    self.superPanel = ele.wijsuperpanel(spOptions).data("wijmoWijsuperpanel");
                    //update for fixing can't show all dropdown items by wuhao
                    if(self.superPanel && self.superPanel.vNeedScrollBar) {
                        ul.setOutWidth(eleInnerWidth - 18);
                        self.superPanel.refresh();
                    }
                    //end for issue
                                    } else {
                    vScroller = self.superPanel.options.vScroller;
                    vScroller.scrollLargeChange = large;
                    vScroller.scrollSmallChange = small;
                    //update for fixing can't show all dropdown items by wuhao
                    self.superPanel.paintPanel();
                    if(self.superPanel.vNeedScrollBar || ($.support.isTouchEnabled && $.support.isTouchEnabled())) {
                        ul.setOutWidth(eleInnerWidth - 18);
                        self.superPanel.refresh();
                    } else {
                        ul.setOutWidth(ele.outerWidth());
                        headerHeight = ele.children(".wijmo-wijsuperpanel-header").outerHeight();
                        //update for case 24248 at 2012/7/27
                        //Note: not good method for doing this
                        if(headerHeight !== null && headerHeight !== undefined) {
                            ele.height(ulOuterHeight + headerHeight);
                        }
                        //end
                        self.superPanel.refresh();
                    }
                    //end for issue
                                    }
                pt = ul.css("padding-top");
                if(pt.length > 0) {
                    vScroller = self.superPanel.options.vScroller;
                    vScroller.firstStepChangeFix = self.superPanel.scrollPxToValue(parseFloat(pt), "v");
                } else {
                    vScroller.firstStepChangeFix = 0;
                }
                ul.setOutWidth(ul.parent().parent().innerWidth());
                //if list is disabled, adjust disabledDiv's width/height
                if(o.disabled && self.disabledDiv) {
                    self.disabledDiv.css("left", ele.offset().left).css("top", ele.offset().top).css("width", ele.outerWidth()).css("height", ele.outerHeight());
                }
            };
            return wijlist;
        })(wijmo.wijmoWidget);
        list.wijlist = wijlist;        
        var wijlist_options = (function () {
            function wijlist_options() {
                /**
                * @ignore
                */
                this.wijCSS = {
                    listul: "wijmo-wijlist-ul",
                    listItem: "wijmo-wijlist-item"
                };
                /** @ignore */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-c",
                    stateDefault: "ui-btn-up-c",
                    stateHover: "ui-btn-up-b",
                    stateActive: "ui-btn-down-b"
                };
                /** Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijlist')";
                /** This option is the wijdataview to which the wijlist is bound.
                * @type {wijdataview}
                * @remarks
                *      This option is used if this wijlist is bound to a wijdataview.
                *      In that case, you can also specify a mapping option to
                *      select the properties to bind to,
                *      and the listItems option returns an array of objects containing
                *      value and label property values determined by that mapping.
                */
                this.dataSource = null;
                /** An array that specifies the listItem collections of wijlist.*/
                this.listItems = [];
                /** Select event handler of wijlist.
                *  A function will be called when any item in the list is selected.
                * @event
                * @dataKey {objcect} item By data.item to obtain the selected item.
                */
                this.selected = null;
                /** A value indicates the list items can be single-selected or multi-selected
                * @remarks
                *      Options are "single" and "multiple". This option should not be set
                *      again after initialization.
                */
                this.selectionMode = "single";
                /** The autoSize determines whether or not the wijlist will be automatically sized.*/
                this.autoSize = false;
                /** A value specifies the maximum number of items that will be displayed
                * if the autoSize option is also set to true.
                */
                this.maxItemsCount = 5;
                /** The addHoverItemClass option determines whether the "ui-state-hover" class
                *  is applied to a list item on mouse over.
                */
                this.addHoverItemClass = true;
                /** The superPanelOptions option indicates the customized options of wijsuperpanel
                *  when the wijsuperpanel is created.
                * @remarks
                *          superpanel is the list container.For detailed options please refer to the Superpanel widget
                */
                this.superPanelOptions = null;
                /** A value indicates whether wijlist is disabled.*/
                this.disabled = false;
                /** The focusing event is fired when the mouse enters the list item and
                * before the hover event logic is processed.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IItemEventArgs} args The data with this event.
                * @returns {boolean} false to cancel item focusing.
                */
                this.focusing = null;
                /** The focus event is fired when the mouse enters the list item and
                * after the hover event logic is processed.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IItemEventArgs} args The data with this event.
                */
                this.focus = null;
                /** The blur event is fired when the mouse leaves the item.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IItemEventArgs} args The data with this event.
                */
                this.blur = null;
                /** The itemRendering event is fired before a list item is rendered.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IItemEventArgs} args The data with this event.
                */
                this.itemRendering = null;
                /** The itemRendered event is fired after a list item is rendered.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IItemEventArgs} args The data with this event.
                */
                this.itemRendered = null;
                /** The listRendered event is fired after the list is rendered.
                * @event
                * @dataKey {object} list The list to be rendered.
                */
                this.listRendered = null;
                /** The added event is fired after adding item in addItem method.
                * @event
                * @dataKey {object} item By added item and index.
                */
                this.added = null;
                /** A value determines the highlight state when the mouse leaves an item. */
                this.keepHightlightOnMouseLeave = false;
            }
            return wijlist_options;
        })();        
        ;
        wijlist.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijlist_options());
        $.wijmo.registerWidget("wijlist", wijlist.prototype);
    })(wijmo.list || (wijmo.list = {}));
    var list = wijmo.list;
})(wijmo || (wijmo = {}));
