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
    /// <reference path="../Base/jquery.wijmo.widget.ts" />
    /// <reference path="../wijsuperpanel/jquery.wijmo.wijsuperpanel.ts" />
    /// <reference path="../wijutil/jquery.wijmo.wijutil.ts" />
    /// <reference path="../External/declarations/jquery.bgiframe.d.ts" />
    /*globals window,document,jQuery,clearTimeout,setTimeout*/
    /*
    * Depends:
    *	jquery.js
    *	jquery.ui.core.js
    *	jquery.ui.widget.js
    *	jquery.wijmo.wijutil.js
    *	jquery.ui.position.js
    *	jquery.ui.effects.core.js
    *	jquery.mousewheel.js
    *	jquery.bgiframe.js
    *	jquery.wijmo.wijsuperpanel.js
    *
    */
    (function (menu) {
        "use strict";
        var $ = jQuery, widgetName = "wijmenu";
        /** @widget*/
        var wijmenu = (function (_super) {
            __extends(wijmenu, _super);
            function wijmenu() {
                _super.apply(this, arguments);

            }
            wijmenu._itemWidgetName = "wijmenuitem";
            wijmenu.prototype._preventEvent = function (event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            };
            wijmenu.prototype._initState = function () {
                var self = this;
                if(!self.options.items) {
                    self.options.items = [];
                }
            };
            wijmenu.prototype._create = function () {
                // Before crete menu items,hide the menu. To avoid show wild uls
                // in the page before init the menu.
                                var self = this, o = self.options, direction = o.direction, mode = o.mode, parentWidget, ele = self.element, sublist, keycode = wijmo.getKeyCodeEnum(), disabled = o.disabled;
                self._initState();
                if(ele.is(":hidden") && ele.wijAddVisibilityObserver) {
                    ele.wijAddVisibilityObserver(function () {
                        self.refresh();
                        if(ele.wijRemoveVisibilityObserver) {
                            ele.wijRemoveVisibilityObserver();
                        }
                    }, "wijmenu");
                }
                //Fix for jQuery UI 1.10
                ele.data("wijmomenu", $.camelCase(self.widgetFullName));
                //ele.data("wijmomenu", self.widgetName);
                //fix for issus 20651 by Chandler.Zheng on 2012/03/19
                self.clickNameSpace = "click.wijmenudoc" + self._newId();
                //end comment
                ele.hide();
                self.cssPre = "wijmo-wijmenu";
                self.nowIndex = 9999;
                self.activeItem = null;
                self.refresh();
                ele.attr("tabIndex", 0);
                //Add for support disabled option at 2011/7/8
                if(self._getDisabled()) {
                    self.disable();
                    if(o.disabledState === true) {
                        o.disabled = disabled;
                    }
                }
                //end for disabled option
                ele.bind("keydown.wijmenuEvent", function (event) {
                    if(self._getDisabled()) {
                        return;
                    }
                    if(mode === "sliding") {
                        self._getSublist().stop(true, true);
                    }
                    var activeItem = self.activeItem, isRoot, link, orientation = o.orientation;
                    if(activeItem) {
                        isRoot = activeItem._isRoot();
                        sublist = activeItem._getSublist();
                    } else {
                        isRoot = true;
                    }
                    switch(event.keyCode) {
                        case keycode.PAGE_UP:
                            self.previousPage(event);
                            self._preventEvent(event);
                            break;
                        case keycode.PAGE_DOWN:
                            self.nextPage(event);
                            self._preventEvent(event);
                            break;
                        case keycode.UP:
                            if(orientation === "vertical" || mode === "sliding" || !isRoot) {
                                self.previous(event);
                                self._preventEvent(event);
                            }
                            break;
                        case keycode.DOWN:
                            if(orientation === "vertical" || mode === "sliding" || !isRoot) {
                                self.next(event);
                                self._preventEvent(event);
                            } else {
                                if(activeItem) {
                                    if(mode === "flyout" && wijmenu._hasVisibleSubMenus(activeItem)) {
                                        if(sublist.is(":hidden")) {
                                            activeItem._showFlyoutSubmenu(event, function () {
                                                self.activate(event, activeItem._getFirstSelectableSubItem());
                                            });
                                        }
                                    }
                                }
                            }
                            break;
                        case keycode.RIGHT:
                            if(orientation === "horizontal" && isRoot && mode === "flyout") {
                                if(direction === "rtl") {
                                    self.previous(event);
                                } else {
                                    self.next(event);
                                }
                                self._preventEvent(event);
                            } else {
                                if(activeItem) {
                                    parentWidget = activeItem.getParent();
                                    if(direction === "rtl") {
                                        self._keyDownToCloseSubmenu(mode, event, parentWidget);
                                    } else {
                                        self._keyDownToOpenSubmenu(activeItem, mode, event, sublist);
                                    }
                                }
                            }
                            break;
                        case keycode.LEFT:
                            if(orientation === "horizontal" && isRoot && mode === "flyout") {
                                if(direction === "rtl") {
                                    self.next(event);
                                } else {
                                    self.previous(event);
                                }
                                self._preventEvent(event);
                            } else {
                                if(activeItem) {
                                    parentWidget = activeItem.getParent();
                                }
                                if(direction === "rtl") {
                                    self._keyDownToOpenSubmenu(activeItem, mode, event, sublist);
                                } else {
                                    self._keyDownToCloseSubmenu(mode, event, parentWidget);
                                }
                            }
                            break;
                        case keycode.ENTER:
                            if(!activeItem) {
                                return;
                            }
                            link = activeItem._getLink();
                            if(mode === "flyout") {
                                break;
                            } else {
                                self.select();
                                if(link.is("a") && link.attr("href") === "#") {
                                    self._preventEvent(event);
                                }
                            }
                            break;
                        case keycode.TAB:
                            self.next(event);
                            self._preventEvent(event);
                            break;
                    }
                });
            };
            wijmenu.prototype._keyDownToOpenSubmenu = function (activeItem, mode, event, sublist) {
                var self = this;
                if(mode === "flyout" && wijmenu._hasVisibleSubMenus(activeItem)) {
                    if(sublist.is(":hidden")) {
                        activeItem._showFlyoutSubmenu(event, function () {
                            self.activate(event, activeItem._getFirstSelectableSubItem());
                        });
                    }
                } else if(mode === "sliding") {
                    if(sublist.length > 0) {
                        activeItem._getLink().trigger("click", activeItem._getFirstSelectableSubItem());
                    }
                }
            };
            wijmenu.prototype._keyDownToCloseSubmenu = function (mode, event, parentWidget) {
                var self = this, o = self.options, breadcrumb;
                if(mode === "flyout") {
                    if(parentWidget) {
                        parentWidget._hideCurrentSubmenu(event);
                        self.activate(event, parentWidget);
                    }
                } else {
                    if(o.backLink && self._backLink && self._backLink.is(":visible")) {
                        self._backLink.trigger("click", function () {
                            if(parentWidget) {
                                self.activate(event, parentWidget);
                            }
                        });
                    }
                    breadcrumb = $("." + o.wijCSS.wijmenuBreadcrumb, self.domObject.menucontainer).find("li a");
                    if(breadcrumb.length > 0) {
                        breadcrumb.eq(breadcrumb.length - 2).trigger("click", function () {
                            if(parentWidget) {
                                self.activate(event, parentWidget);
                            }
                        });
                    }
                }
            };
            wijmenu.prototype._createMenuItems = function () {
                var self = this, items = [], o = self.options, optionItemsLength = self.options.items.length, childMenuCount = self._getSublist().children('li').length, i, w, itemContainer;
                for(i = 0; i < optionItemsLength - childMenuCount; i++) {
                    self._getSublist().append('<li>');
                }
                if(o.ensureSubmenuOnBody && o.mode === "flyout") {
                    self._submenuContainer = $("<div>").addClass(o.wijCSS.helperReset).addClass(o.wijCSS.widget).addClass(o.wijCSS.header).addClass(o.wijCSS.wijmenu).addClass(o.wijCSS.wijmenuSubmenuContainer);
                    if(o.orientation === "horizontal" && o.mode === "flyout") {
                        self._submenuContainer.addClass(o.wijCSS.wijmenuHorizontal);
                    }
                    itemContainer = $("<ul>").addClass(o.wijCSS.wijmenuList).addClass(o.wijCSS.helperReset).data($.camelCase(self.widgetFullName), self).data("wijmomenu", $.camelCase(self.widgetFullName));
                }
                $(">li", self._getSublist()).each(function (i, n) {
                    var $li = $(this), options = wijmenu._getMenuItemOptions(self.options, i), sublistWrapper, sublist;
                    w = self._createItemWidget($li, options);
                    items.push(w);
                    self.options.items[i] = w.options;
                    if(o.ensureSubmenuOnBody && o.mode === "flyout") {
                        sublist = w._getSublist();
                        self._bindMousehoverEvent(sublist);
                        if(sublist.children().length > 0) {
                            sublistWrapper = $("<li>").addClass(o.wijCSS.widget).addClass(o.wijCSS.wijmenuItem).addClass(o.wijCSS.stateDefault).addClass(o.wijCSS.cornerAll).addClass(o.wijCSS.wijmenuParent).addClass(o.wijCSS.header).append(sublist);
                            $(sublistWrapper).appendTo(itemContainer);
                        }
                    }
                    if(o.ensureSubmenuOnBody && o.mode === "flyout") {
                        $(self._submenuContainer).append(itemContainer).appendTo("body");
                    }
                    return this;
                });
                return items;
            };
            wijmenu.prototype._createItemWidget = function ($li, options) {
                //var itemWidgetName = $.wijmo.wijmenu._itemWidgetName;
                var itemWidgetName = wijmenu._itemWidgetName;
                if($.fn[itemWidgetName]) {
                    $li[itemWidgetName](options);
                }
                return wijmenu._getItemWidget($li);
            };
            wijmenu.prototype._handleDisabledOption = function (disabled, ele) {
                var self = this;
                if(disabled) {
                    if(!self.disabledDiv) {
                        self.disabledDiv = self._createDisabledDiv(ele);
                    }
                    //fix for tfs issue 21458
                    //self.disabledDiv.appendTo("body");
                    self.disabledDiv.appendTo(self.domObject.menucontainer);
                } else {
                    if(self.disabledDiv) {
                        self.disabledDiv.remove();
                        self.disabledDiv = null;
                    }
                }
            };
            wijmenu.prototype._getDisabled = function () {
                var self = this, o = self.options;
                return o.disabledState === true || o.disabled === true;
            };
            wijmenu.prototype._createDisabledDiv = function (outerEle) {
                return $("<div></div>").css({
                    "z-index": "99999",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    left: 0,
                    top: 0
                });
            };
            wijmenu.prototype._innerDestroy = function () {
                var self = this, o = self.options;
                self.destroying = true;
                self[o.mode === "flyout" ? "_killFlyout" : "_killDrilldown"]();
                self._killMenuItems();
                self._killtrigger();
                self._killElement();
                if(o.ensureSubmenuOnBody && o.mode === "flyout" && self._submenuContainer) {
                    self._submenuContainer.remove();
                }
                self.destroying = false;
            };
            wijmenu.prototype.destroy = /** The destroy method removes the wijmenu functionality completely
            * and returns the element to its pre-init state.
            */
            function () {
                var self = this;
                this._innerDestroy();
                //Add for support disabled option at 2011/7/8
                if(self.disabledDiv) {
                    self.disabledDiv.remove();
                    self.disabledDiv = null;
                }
                //end for disabled option
                _super.prototype.destroy.call(this);
            };
            wijmenu.prototype.activate = /** This method activates a menu item by deactivating the current item,
            * scrolling the new item into view, and, if necessary,making it the active item,
            * and triggering a focus event.
            * @param {event} event The javascript event.
            * @param item A menu item to activate.
            * @example
            * //Actives a menu item with "sub-item" class.
            * $(".selector").wijmenu("activate", null, $(".sub-item"));
            */
            function (event, item) {
                if(!item) {
                    return;
                }
                var self = this, o = self.options, scrollContainer = self.domObject.scrollcontainer, active, link, needToScroll = false, isInCurrentSublist = true;
                active = (item.jquery ? item : item.element).eq(0);
                if(self.activeItem && self.activeItem.element.get(0) === active.get(0)) {
                    return;
                }
                self.deactivate(event);
                self.activeItem = wijmenu._getItemWidget(active);
                link = active.children(":first");
                self._trigger("focus", event, {
                    item: self.activeItem
                });
                if(self.options.mode === "sliding") {
                    isInCurrentSublist = active.parent().is('.' + o.wijCSS.wijmenuCurrent);
                    needToScroll = isInCurrentSublist && self._hasScroll() && scrollContainer.wijsuperpanel('needToScroll', active);
                    if(needToScroll) {
                        self._linkContainer.link = link;
                        self._linkContainer.needToFocus = true;
                        scrollContainer.wijsuperpanel("scrollChildIntoView", active);
                    }
                }
                link.addClass(o.wijCSS.stateFocus).end();
                self.element.removeAttr("aria-activedescendant");
                self.element.attr("aria-activedescendant", active.attr("id"));
                //fix for issue 20547
                if(isInCurrentSublist && !needToScroll && link.is('a')) {
                    link.focus();
                }
            };
            wijmenu.prototype.deactivate = /** The deactivate method clears the current selection.
            * This method is useful when reopening a menu which you previously selected an item.
            * If you don't call this method then an item which you selected before allowing the menu to close
            * will remain highlighted when the menu is reopened.
            * @param {event} event The javascript event.
            */
            function (event) {
                var self = this, o = self.options, active = self.activeItem;
                if(!active) {
                    return;
                }
                //Fix an issue that the class can't be removed sometimes when
                //playing animation in FF/Webkit.
                setTimeout(function () {
                    active._getLink().removeClass(o.wijCSS.stateFocus).removeAttr("id");
                    self._trigger("blur");
                }, 0);
                self.activeItem = null;
            };
            wijmenu.prototype.next = /** The next method gets the next selectable item.
            * The first item is selected if no item is active or the last one is active.
            * It returns null if none is selectable.
            * @param {event} event The javascript event.
            */
            function (event) {
                this._move("next", function (widget) {
                    return widget._getFirstSelectableSubItem();
                }, event);
            };
            wijmenu.prototype.previous = /** Get the previous selectable item.
            * It selects the last item if no item is active or if the first item is active.
            * It returns null if no previous item is selectable.
            * @param {event} event The javascript event.
            */
            function (event) {
                this._move("previous", function (widget) {
                    return widget._getLastSelectableSubItem();
                }, event);
            };
            wijmenu.prototype.first = /** The first method defines the first menu item as the active item. */
            function () {
                var self = this, active, parent, firstItem;
                if(!self.activeItem) {
                    return false;
                }
                active = self._getActiveItemElement();
                parent = self.activeItem._getParentOrMenu();
                firstItem = parent._getFirstSelectableSubItem();
                return firstItem && active[0] === firstItem.element[0];
            };
            wijmenu.prototype.last = /** The last method defines the last menu item as the active item. */
            function () {
                var self = this, active, parent, lastItem;
                if(!self.activeItem) {
                    return false;
                }
                active = self._getActiveItemElement();
                parent = self.activeItem._getParentOrMenu();
                lastItem = parent._getLastSelectableSubItem();
                return lastItem && active[0] === lastItem.element[0];
            };
            wijmenu.prototype.nextPage = /** This method is similar to the "next" method,
            * but it jumps a whole page to the next page instead of to the next selectable item.
            * You can call this method when you are using an iPod-style menu.
            * @param {event} event The javascript event.
            */
            function (event) {
                var self = this, activeItem = self._getActiveItemElement(), base, height, result, widget, itemToActivate;
                if(activeItem) {
                    widget = self.activeItem._getParentOrMenu();
                } else {
                    widget = self;
                    activeItem = self._getFirstSelectableSubItem();
                }
                if(self.options.mode === "sliding" && self._hasScroll()) {
                    if(!activeItem || self.last()) {
                        self.activate(event, widget._getFirstSelectableSubItem());
                        return;
                    }
                    base = activeItem.offset().top;
                    height = self.options.maxHeight;
                    result = wijmenu._getSelectableSubItems(widget, function (n) {
                        var node = $(n.element), close = height - (node.offset().top - base + node.height()), lineheight = node.height();
                        return close < lineheight && close > -lineheight;
                    });
                    if(!result.length) {
                        result = widget._getLastSelectableSubItem();
                    } else {
                        //get the last of the result;
                        result = result[result.length - 1];
                    }
                    self.activate(event, result);
                } else {
                    if(!activeItem || self.last()) {
                        itemToActivate = widget._getFirstSelectableSubItem();
                    } else {
                        itemToActivate = widget._getLastSelectableSubItem();
                    }
                    self.activate(event, itemToActivate);
                }
            };
            wijmenu.prototype.previousPage = /** This method is similar to the "previous" method,
            * but it jumps a whole page to the previous page.
            * You can call this method when you're using an iPod-style menu.
            * @param {event} event The javascript event.
            */
            function (event) {
                var self = this, activeItem = self._getActiveItemElement(), base, height, result, widget, itemToActivate;
                if(activeItem) {
                    widget = self.activeItem._getParentOrMenu();
                } else {
                    widget = self;
                    activeItem = self._getFirstSelectableSubItem();
                }
                if(self.options.mode === "sliding" && self._hasScroll()) {
                    if(!activeItem || self.first()) {
                        self.activate(event, widget._getLastSelectableSubItem());
                        return;
                    }
                    base = activeItem.offset().top;
                    height = self.options.maxHeight;
                    result = wijmenu._getSelectableSubItems(widget, function (n) {
                        var node = $(n.element), close = node.offset().top - base + height - node.height(), lineheight = node.height();
                        return close < lineheight && close > -lineheight;
                    });
                    if(!result.length) {
                        result = widget._getFirstSelectableSubItem();
                    } else {
                        //get the first of the result;
                        result = result[0];
                    }
                    self.activate(event, result);
                } else {
                    if(!activeItem || self.first()) {
                        itemToActivate = widget._getLastSelectableSubItem();
                    } else {
                        itemToActivate = widget._getFirstSelectableSubItem();
                    }
                    self.activate(event, itemToActivate);
                }
            };
            wijmenu.prototype.select = /** This method selects the active item which triggers the select event for that item.
            * This event is useful for custom keyboard handling.
            * @param {event} event The javascript event.
            */
            function (event) {
                var self = this, activeItem = self.activeItem, selected;
                self._trigger("select", event, {
                    item: activeItem
                });
                //if the checkable is true, toggle the selected value of menuitem
                if(self.options.checkable) {
                    selected = !activeItem.options.selected;
                    activeItem._setOption("selected", selected);
                }
            };
            wijmenu.prototype._getActiveItemElement = function () {
                return this.activeItem ? this.activeItem.element : null;
            };
            wijmenu.prototype.setItemDisabled = /** The setItemDisabled method allows the user to disable a specific menu item.
            * @param selector Indicates the item to be disabled. The parameter's type is jQuery selector.
            * @param {boolean} disabled If the value for this parameter is true,  then the menu item will be disabled. The parameter's type is Boolean.
            * @example
            * //Disables a menuitem with "sub-item" class.
            * $(".selector").wijmenu("setItemDisabled", $(".sub-item"), true);
            */
            function (selector, disabled) {
                var items = $(selector, this.element), o = this.options;
                items.find("." + o.wijCSS.wijmenuItem + ">a").attr("disabled", disabled);
                items.find(">a").toggleClass(o.wijCSS.stateDisabled, disabled);
            };
            wijmenu.prototype._setOption = ///set options
            function (key, value) {
                var self = this;
                if(self.destroying) {
                    return;
                }
                if(self["_set_" + key]) {
                    self["_set_" + key](value);
                }
                self.options[key] = value;
                //Add for support disabled option at 2011/7/8
                if(key === "disabled") {
                    self._handleDisabledOption(value, self.domObject.menucontainer);
                }
                //end for disabled option
                            };
            wijmenu.prototype._set_items = function (value) {
                var self = this;
                //when set items by options, clear the old items at first
                self._getSublist().children().remove();
                self.options.items = value;
                self.refresh();
            };
            wijmenu.prototype._set_mode = function (value) {
                var self = this;
                self._innerDestroy();
                self.options.mode = value;
                self.refresh();
            };
            wijmenu.prototype._set_backLink = function (value) {
                var self = this, o = self.options, breadcrumb;
                this.options.backLink = value;
                if(self.options.mode === 'sliding') {
                    self._killDrilldown();
                    self._drilldown();
                    breadcrumb = $("." + o.wijCSS.wijmenuBreadcrumb, self.domObject.menucontainer);
                    self._resetDrilldownMenu(breadcrumb);
                }
            };
            wijmenu.prototype._set_direction = function (value) {
                var self = this;
                self._innerDestroy();
                self.refresh();
            };
            wijmenu.prototype._set_orientation = function (value) {
                var self = this, menuContainer = self.domObject.menucontainer, direction = self.options.direction, cssPre = "ui-icon-triangle-1-", directionClass = direction === "rtl" ? "w" : "e", oldCss = value === "horizontal" ? directionClass : "s", newCss = value === "horizontal" ? "s" : directionClass;
                menuContainer.removeClass(self.cssPre + "-vertical " + self.cssPre + "-horizontal");
                if(self.options.mode === "flyout") {
                    menuContainer.addClass(self.cssPre + "-" + value);
                    $.each(self.getItems(), function (i, n) {
                        if(n.getItems().length === 0) {
                            return;
                        }
                        n._getLink().find("." + cssPre + oldCss).removeClass(cssPre + oldCss + " " + cssPre + newCss).addClass(cssPre + newCss);
                    });
                } else {
                    menuContainer.addClass(self.cssPre + "-vertical");
                }
            };
            wijmenu.prototype._getTriggerEle = function () {
                return wijmenu._getOuterElement(this.options.trigger, "." + this.options.wijCSS.wijmenu);
            };
            wijmenu.prototype._set_triggerEvent = function (value) {
                var self = this, o = self.options, triggerEle = self._getTriggerEle();
                self._killtrigger();
                o.triggerEvent = value;
                if(triggerEle.length > 0) {
                    self._initTrigger(triggerEle);
                }
                if(o.mode === "flyout") {
                    self._killFlyout();
                    self._flyout();
                }
            };
            wijmenu.prototype._set_trigger = function (value) {
                var self = this, o = self.options, triggerEle;
                self._killtrigger();
                o.trigger = value;
                triggerEle = self._getTriggerEle();
                if(triggerEle.length > 0) {
                    self._initTrigger(triggerEle);
                }
                if(o.mode === "flyout") {
                    self._killFlyout();
                    self._flyout();
                }
            };
            wijmenu.prototype._initTrigger = function (triggerEle) {
                var o = this.options, event = o.triggerEvent, self = this, menuContainer = self.domObject.menucontainer, namespace = ".wijmenuEvent";
                if(triggerEle.is("iframe")) {
                    triggerEle = $(triggerEle.get(0).contentWindow.document);
                }
                switch(event) {
                    case "click":
                        triggerEle.bind(event + namespace, function (e) {
                            if(o.mode !== "popup") {
                                self._displayMenu(e);
                            }
                            e.stopPropagation();
                        });
                        break;
                    case "mouseenter":
                        triggerEle.bind(event + namespace, function (e) {
                            self._displayMenu(e);
                            e.stopPropagation();
                        });
                        break;
                    case "dblclick":
                        triggerEle.bind(event + namespace, function (e) {
                            self._displayMenu(e);
                            e.stopPropagation();
                        });
                        break;
                    case "rtclick":
                        triggerEle.bind("contextmenu" + namespace, function (e) {
                            menuContainer.hide();
                            self._displayMenu(e);
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        break;
                }
            };
            wijmenu.prototype._killtrigger = function () {
                var o = this.options, triggerEle;
                if(o.trigger !== "") {
                    triggerEle = $(o.trigger);
                    if(triggerEle.is("iframe")) {
                        triggerEle = $(triggerEle.get(0).contentWindow.document);
                    }
                    if(triggerEle && triggerEle.length > 0) {
                        triggerEle.unbind(".wijmenuEvent").unbind("wijmenuEvent");
                    }
                }
            };
            wijmenu.prototype._move = function (driection, fnDefault, event) {
                var self = this, active = self._getActiveItemElement(), next, parent, widget;
                if(!active || !active.length) {
                    self.activate(event, fnDefault(self));
                    return;
                }
                widget = wijmenu._getItemWidget(active);
                next = widget[driection]()//next/previuos
                ;
                parent = widget._getParentOrMenu();
                if(next) {
                    self.activate(event, next);
                } else {
                    self.activate(event, fnDefault(parent));
                }
            };
            wijmenu.prototype._bindMousehoverEvent = function (element) {
                var self = this;
                var o = self.options;
                element.delegate("li>." + o.wijCSS.wijmenuLink, "mouseenter.wijmenuEvent", function () {
                    var itemDisabled = $(this).hasAllClasses(o.wijCSS.stateDisabled);
                    if(self._getDisabled() || itemDisabled) {
                        return;
                    }
                    $(this).addClass(o.wijCSS.stateHover).addClass(o.wijCSS.stateDefault);
                }).delegate("li>." + o.wijCSS.wijmenuLink, "mouseleave.wijmenuEvent", function () {
                    var itemDisabled = $(this).hasAllClasses(o.wijCSS.stateDisabled);
                    if(self._getDisabled() || itemDisabled) {
                        return;
                    }
                    $(this).removeClass(o.wijCSS.stateHover).removeClass(o.wijCSS.stateDefault);
                    if($(this).data("subMenuOpened")) {
                        $(this).addClass(o.wijCSS.stateActive);
                    }
                });
            };
            wijmenu.prototype.refresh = /** The method is used to refresh the menu when DOM operations add or replace a menu item.
            * For example, if you add a new menu item through "menu.append,"
            * then you can use the refresh method to make sure that the new menu item appears in the menu.
            * @example
            * //Adds a new item and refresh menu.
            * menu.append("<li><a href='#'>new item</a></li>").wijmenu("refresh");
            */
            function () {
                var self = this, ele = self.element, o = self.options, direction = o.direction, scrollcontainer, menucontainer, domObject, triggerEle, breadcrumb;
                if(self.domObject) {
                    self._innerDestroy();
                }
                if(ele.is("ul")) {
                    self._rootMenu = ele;
                    scrollcontainer = ele.wrap("<div></div>").parent();
                    menucontainer = scrollcontainer.wrap("<div></div>").parent();
                } else if(ele.is("div")) {
                    self._rootMenu = $("ul:first", ele);
                    scrollcontainer = ele;
                    menucontainer = ele.wrap("<div></div>").parent();
                } else {
                    return;
                }
                if(direction === "rtl") {
                    self._rootMenu.addClass(o.wijCSS.wijmenuRtl);
                }
                scrollcontainer.addClass("scrollcontainer checkablesupport");
                menucontainer.addClass(o.wijCSS.widget).addClass(o.wijCSS.header).addClass(o.wijCSS.wijmenu).addClass(o.wijCSS.cornerAll).addClass(o.wijCSS.helperClearFix).attr("aria-activedescendant", o.wijCSS.activeMenuitem);
                if(o.orientation === "horizontal" && o.mode === "flyout") {
                    menucontainer.addClass(o.wijCSS.wijmenuHorizontal);
                }
                domObject = {
                    scrollcontainer: scrollcontainer,
                    menucontainer: menucontainer
                };
                self.domObject = domObject;
                self._getSublist().data("topmenu", true);
                if(!self._getSublist().hasAllClasses(o.wijCSS.wijmenuList)) {
                    self._getSublist().addClass(o.wijCSS.wijmenuList).addClass(o.wijCSS.helperReset);
                }
                self._items = self._createMenuItems();
                ele.show();
                self._bindMousehoverEvent(ele);
                this[o.mode === "flyout" ? "_flyout" : "_drilldown"]();
                if(o.trigger !== "") {
                    triggerEle = self._getTriggerEle();
                    if(triggerEle.length > 0) {
                        menucontainer.hide();
                        self._initTrigger(triggerEle);
                    }
                }
                $(document).bind(self.clickNameSpace, function (e) {
                    ///fixed when click the breadcrumb choose item link to show
                    /// the root menu in sliding menu.
                    var t = o.trigger;
                    if($(e.target).parent().is("." + o.wijCSS.wijmenuAllLists)) {
                        return;
                    }
                    // fix tfs issue 20650  by Chandler.Zheng on 2012-03-19
                    if($(e.target).closest(o.trigger).is(o.trigger)) {
                        return;
                    }
                    //end comments
                    var obj = $(e.target).closest("." + o.wijCSS.wijmenu);
                    if(obj.length === 0) {
                        if(o.mode === "sliding") {
                            breadcrumb = $("." + o.wijCSS.wijmenuBreadcrumb, menucontainer);
                            // fixed a bug, when the trigger is not seted.
                            // when click the document, trigger this method!
                            if(o.trigger === "") {
                                return;
                            }
                            self._resetDrilldownMenu(breadcrumb);
                        } else if(o.mode === "flyout" && o.triggerEvent !== "mouseenter") {
                            self._hideAllMenus(e);
                            return;
                        }
                        if(triggerEle && triggerEle.length > 0) {
                            self._hideMenu(e);
                        }
                    }
                });
            };
            wijmenu.prototype._flyout = function () {
                var container = this.domObject.menucontainer, o = this.options, items = this.getItems();
                container.attr("role", "menu");
                if(o.orientation === "horizontal") {
                    container.attr("role", "menubar");
                }
                $.each(items, function (index, item) {
                    item._flyout();
                });
            };
            wijmenu.prototype._hideAllMenus = function (e) {
                var self = this, container, outerTrigger, fnHideSubmenu = function (menuitem) {
                    if(menuitem.getItems().length > 0) {
                        $.each(menuitem.getItems(), function (i, n) {
                            fnHideSubmenu(n);
                        });
                        menuitem._hideSubmenu(false, e);
                    }
                };
                $.each(self._items, function (i, n) {
                    fnHideSubmenu(n);
                });
                if(self.options.trigger !== "") {
                    container = self.domObject.menucontainer;
                    if(container.data("isAnimated")) {
                        return;
                    }
                    /*if (container.is(":animated")) {
                    return;
                    }*/
                    // if the trigger is outer of the menu,
                    //when hide all menus hide the root menu.
                    outerTrigger = self._getTriggerEle();
                    if(outerTrigger.length === 0) {
                        return;
                    }
                    self._hideMenu(e);
                }
            };
            wijmenu.prototype.hideAllMenus = /** The hideAllMenus method hides all menu items currently showing.*/
            function (e) {
                this._hideAllMenus(e);
            };
            wijmenu.prototype._killFlyout = function () {
                $.each(this.getItems(), function () {
                    this._killFlyout();
                });
            };
            wijmenu.prototype._killElement = function () {
                var self = this, o = self.options, ele = self._getSublist();
                ele.removeClass(o.wijCSS.wijmenuList).removeClass(o.wijCSS.helperReset).removeClass(o.wijCSS.wijmenuContent).removeClass(o.wijCSS.helperClearFix);
                //self.domObject.menucontainer.removeClass("");
                $(document).unbind(self.clickNameSpace);
                //remove warping
                if(self.element.is("ul")) {
                    self.element.unwrap().unwrap();
                } else {
                    self.element.unwrap();
                }
                //For fix the tfs issue id 24830. js error: object is null or undefined
                self.domObject = null;
                self.element.removeData("topmenu").removeData("firstLeftValue").removeData("domObject");
                //self.element.removeData("domObject").removeData("topmenu")
                //.removeData("firstLeftValue");
                ele.undelegate(".wijmenuEvent");
            };
            wijmenu.prototype._killMenuItems = function () {
                var self = this, items = self.getItems(), i;
                //$.each(self.getItems(), function (i, n) {
                //	n.destroy(true);
                //});
                for(i = items.length - 1; i >= 0; i--) {
                    items[i].destroy(true);
                }
                self._items.length = 0;
            };
            wijmenu.prototype._sroll = function () {
                var scroll = this.domObject.scrollcontainer, options = $.extend({
                    hScroller: {
                        scrollBarVisibility: "hidden"
                    }
                }, this.options.superPanelOptions);
                scroll.height(this.options.maxHeight);
                scroll.wijsuperpanel(options);
            };
            wijmenu.prototype._initScrollCallback = function () {
                var self = this, scrollContainer = self.domObject.scrollcontainer;
                self._linkContainer = {
                    link: null,
                    needToFocus: false
                };
                scrollContainer.wijsuperpanel({
                    scrolled: function () {
                        var link = self._linkContainer.link;
                        if(self._linkContainer.needToFocus && link && link.is('a')) {
                            link.focus();
                            self._linkContainer.needToFocus = false;
                        }
                    }
                });
            };
            wijmenu.prototype._resetScroll = function (widget) {
                var self = this, mycontainer = self._rootMenu.parent(), fixPadding = 5, scrollcontainer = self.domObject.scrollcontainer, sublist = widget._getSublist();
                mycontainer.height(sublist.height());
                scrollcontainer.wijsuperpanel("option", "hScroller", {
                    scrollValue: 0
                });
                scrollcontainer.wijsuperpanel("option", "vScroller", {
                    scrollValue: 0
                });
                scrollcontainer.wijsuperpanel("paintPanel");
                if(self._hasScroll()) {
                    if(sublist.prev().length > 0) {
                        fixPadding = sublist.prev().css("padding-left").replace(/px/g, "");
                    }
                    sublist.width(scrollcontainer.find(".wijmo-wijsuperpanel-contentwrapper" + ":first").width() - fixPadding);
                    //because the scroll bar has 16px width, there has a possible
                    //that the height of ul will modified after appending scrollbar
                    //so there should get the height of container again, and repaint panel
                    mycontainer.height(sublist.height());
                    scrollcontainer.wijsuperpanel("paintPanel");
                }
            };
            wijmenu.prototype._hasScroll = function () {
                var scroll = this.domObject.scrollcontainer;
                //Fix for jQuery UI 1.10
                return scroll.data("wijmoWijsuperpanel").vNeedScrollBar;
                //return scroll.data("wijsuperpanel").vNeedScrollBar;
                            };
            wijmenu.prototype._resetDrillChildMenu = function (el) {
                var o = this.options;
                el.removeClass(o.wijCSS.wijmenuScroll).removeClass(o.wijCSS.wijmenuCurrent).height("auto");
            };
            wijmenu.prototype._resetDrilldownMenu = function (breadcrumb, callback) {
                var self = this, o = self.options, ele = self._getSublist(), container = self.domObject.menucontainer, crumbDefaultHeader = $('<li>' + o.crumbDefaultText + '</li>').addClass(o.wijCSS.wijmenuBreadcrumbText), fnResetSublists = function (items) {
                    $.each(items, function (i, n) {
                        var ul = n._getSublist(), childItems = n.getItems();
                        ul.hide();
                        self._resetDrillChildMenu(ul);
                        if(childItems.length > 0) {
                            fnResetSublists(childItems);
                        }
                    });
                };
                $('.' + o.wijCSS.wijmenuCurrent, container).removeClass(o.wijCSS.wijmenuCurrent);
                ele.animate({
                    left: 0
                }, o.showDuration, null, function () {
                    fnResetSublists(self.getItems());
                    ele.addClass(o.wijCSS.wijmenuCurrent);
                    if(callback) {
                        callback();
                    }
                });
                $('.' + o.wijCSS.wijmenuAllLists, container).find('span').remove();
                breadcrumb.empty().append(crumbDefaultHeader);
                $('.' + o.wijCSS.wijmenuFooter, container).empty().hide();
                self._resetScroll(self);
            };
            wijmenu.prototype._drilldown = function () {
                var self = this, ele = self._getSublist(), container = self.domObject.menucontainer.attr("role", "menu"), containerWidth, o = self.options, direction = //fixPadding,
                o.direction, breadcrumb = $('<ul></ul>').addClass(o.wijCSS.wijmenuBreadcrumb).addClass(o.wijCSS.stateDefault).addClass(o.wijCSS.cornerAll).addClass(o.wijCSS.helperClearFix), crumbDefaultHeader = $('<li>' + o.crumbDefaultText + '</li>').addClass(o.wijCSS.wijmenuBreadcrumbText), firstCrumb = $('<li><a href="#">' + o.topLinkText + '</a></li>').addClass(o.wijCSS.wijmenuAllLists);
                //wraping mycontainer
                ele.wrap("<div>").parent().css("position", "relative");
                container.addClass(o.wijCSS.wijmenuIpod).addClass(o.wijCSS.wijmenuContainer);
                if(o.backLink) {
                    breadcrumb.addClass(o.wijCSS.wijmenuFooter).appendTo(container).hide();
                } else {
                    breadcrumb.addClass(o.wijCSS.wijmenuHeader).prependTo(container);
                }
                if(!o.backLink) {
                    breadcrumb.append(crumbDefaultHeader);
                }
                containerWidth = container.width();
                ele.addClass(o.wijCSS.wijmenuContent).addClass(o.wijCSS.wijmenuCurrent).addClass(o.wijCSS.content).addClass(o.wijCSS.helperClearFix).css({
                    width: containerWidth
                });
                $.each(self.getItems(), function (i, n) {
                    n._setDrilldownUlStyle();
                });
                self._sroll();
                self._initScrollCallback();
                self._resetScroll(self);
                self.element.data("firstLeftValue", parseFloat(ele.css('left')));
                ele.delegate("li>." + o.wijCSS.wijmenuLink, "click", function (e, itemWidgetToActive) {
                    var li = $(this).parent(), itemDisabled = li.attr("disabled"), nextList, parentUl, parentLeft, crumbText, newCrumb, nextLeftVal, footer, setPrevMenu, hasVisibleSubMenu, itemWidget = wijmenu._getItemWidget(li), backlinkIcon, backlinkText;
                    if(self._getDisabled() || itemDisabled) {
                        return;
                    }
                    if(self._isSliding) {
                        return;
                    }
                    ele.stop(true, true);
                    hasVisibleSubMenu = wijmenu._hasVisibleSubMenus(itemWidget);
                    if(!hasVisibleSubMenu) {
                        self._leafNodeClick(e, itemWidget, breadcrumb);
                        return;
                    }
                    nextList = itemWidget._getSublist();
                    //prevent dblclick.
                    if(nextList.hasAllClasses(o.wijCSS.wijmenuCurrent)) {
                        return;
                    }
                    //end comments.
                    if(!self._trigger("showing", e, itemWidget)) {
                        return;
                    }
                    self._isSliding = true;
                    parentUl = itemWidget._getParentOrMenu()._getSublist();
                    parentLeft = (parentUl.data("topmenu")) ? 0 : parseFloat(ele.css('left'));
                    if(direction === "rtl") {
                        nextLeftVal = Math.round(parentLeft + parseFloat(container.width().toString()));
                    } else {
                        nextLeftVal = Math.round(parentLeft - parseFloat(container.width().toString()));
                    }
                    footer = $('.' + o.wijCSS.wijmenuFooter, container);
                    setPrevMenu = function (backlink, current) {
                        var b = backlink, c = $('.' + o.wijCSS.wijmenuCurrent, container), prevList, widget;
                        if(c.get(0) === self._getSublist().get(0)) {
                            return;
                        }
                        if(current) {
                            prevList = current._getSublist();
                            widget = current;
                        } else {
                            //prevList = c.parents('ul:eq(0)');
                            prevList = c.parent().closest("ul", container[0]);
                            widget = wijmenu._getItemWidget(c.parent())._getParentOrMenu();
                        }
                        c.hide().attr('aria-expanded', 'false');
                        self._resetDrillChildMenu(c);
                        self._resetScroll(widget);
                        prevList.addClass(o.wijCSS.wijmenuCurrent).attr('aria-expanded', 'true');
                        if(prevList.hasAllClasses(o.wijCSS.wijmenuContent)) {
                            b.remove();
                            footer.hide();
                        }
                    };
                    // show next menu
                    self._resetDrillChildMenu(parentUl);
                    self._resetScroll(itemWidget);
                    self._slidingAnimation(ele, nextLeftVal, function () {
                        self._trigger("shown", e, itemWidget);
                        self.activate(e, itemWidgetToActive || itemWidget);
                        //add comments for tfs issue 18483
                        self.select(e);
                        //end comments.
                        self._isSliding = false;
                    });
                    nextList.show().addClass(o.wijCSS.wijmenuCurrent).attr('aria-expanded', 'true');
                    // initialize "back" link
                    if(o.backLink) {
                        if(footer.find('a').size() === 0) {
                            footer.show();
                            backlinkIcon = $("<span></span>").addClass(o.wijCSS.icon).addClass(o.wijCSS.iconArrowLeft);
                            backlinkText = $('<span></span>').addClass(o.wijCSS.wijmenuBacklinktext);
                            self._backLink = $('<a href="#"></a>').append(backlinkIcon).append(backlinkText).appendTo(footer).click(function (e, callback) {
                                // ----- show the previous menu
                                if(self._getDisabled()) {
                                    return;
                                }
                                var currentItemWidget = self._getCurrentItemInSliding(), b = $(this), prevLeftVal;
                                if(!self._trigger("hidding", e, currentItemWidget)) {
                                    return;
                                }
                                ele.stop(true, true);
                                if(direction === "rtl") {
                                    prevLeftVal = Math.round(ele.css('left').replace("px", "")) - Math.round(container.width());
                                } else {
                                    prevLeftVal = Math.round(ele.css('left').replace("px", "")) + Math.round(container.width());
                                    ///to fix click the back button too quickly.
                                    ///The menu display wrong.
                                    if(prevLeftVal > parentLeft) {
                                        return;
                                    }
                                }
                                self._slidingAnimation(ele, prevLeftVal, function () {
                                    self._trigger("hidden", e, currentItemWidget);
                                    setPrevMenu(b);
                                    if(callback) {
                                        callback();
                                    }
                                });
                                e.preventDefault();
                            });
                            backlinkText.width(footer.width() - backlinkIcon.width());
                            backlinkText.text(o.backLinkText);
                        }
                    } else// or initialize top breadcrumb
                     {
                        if(breadcrumb.find('li').size() === 1) {
                            breadcrumb.empty().append(firstCrumb);
                            firstCrumb.find('a').click(function (e, callback) {
                                var targetCrumb = $(this).parent(), currentItemWidget = self._getCurrentItemInSliding();
                                self._slidingMenu(e, targetCrumb, currentItemWidget, null, function (item) {
                                    if(!item) {
                                        self._resetDrilldownMenu(breadcrumb, callback);
                                    } else {
                                        setPrevMenu(null, item);
                                        if(callback) {
                                            callback();
                                        }
                                    }
                                });
                                e.preventDefault();
                            });
                        }
                        $('.' + o.wijCSS.wijmenuCurrentCrumb, container).removeClass(o.wijCSS.wijmenuCurrentCrumb);
                        crumbText = itemWidget._getLink().text();
                        newCrumb = $("<li></li>").addClass(o.wijCSS.wijmenuCurrentCrumb).append($('<a href="#">' + crumbText + '</a>').addClass(o.wijCSS.wijmenuCrumb));
                        newCrumb.appendTo(breadcrumb).find('a').click(function (e, callback) {
                            if(self._getDisabled()) {
                                return;
                            }
                            var targetCrumb = $(this).parent(), currentItemWidget;
                            if(!targetCrumb.is('.' + o.wijCSS.wijmenuCurrentCrumb)) {
                                currentItemWidget = self._getCurrentItemInSliding();
                                self._slidingMenu(e, targetCrumb, currentItemWidget, itemWidget, function (item) {
                                    setPrevMenu(null, item);
                                    if(callback) {
                                        callback();
                                    }
                                });
                            }
                            e.preventDefault();
                        });
                        newCrumb.prev().append($('<span></span>').addClass(o.wijCSS.icon).addClass(o.wijCSS.iconCaratRight));
                    }
                    if($(this).attr("href") === "#") {
                        e.preventDefault();
                    }
                });
            };
            wijmenu.prototype._slidingMenu = function (e, targetCrumb, currentItem, targetItem, animationCallback) {
                var self = this, ele = self._getSublist(), direction = self.options.direction, container = self.domObject.menucontainer, containerWidth = container.width(), level = targetCrumb.parent().children().length - 1, newLeftVal, _targetItem, crumb, hiddenCallback, fnSlidingAnimation = function (targetItem, level, callback) {
                    newLeftVal = (direction === "rtl" ? 1 : -1) * level * containerWidth;
                    self._slidingAnimation(ele, newLeftVal, function () {
                        if(callback) {
                            callback(targetItem);
                        }
                    });
                }, fnGetTargetItem = function (currentItem, targetItem) {
                    var hidding;
                    if(currentItem !== targetItem) {
                        hidding = self._trigger("hidding", e, currentItem);
                        if(hidding) {
                            level--;
                            if(hiddenCallback) {
                                hiddenCallback();
                            }
                            hiddenCallback = function () {
                                self._trigger("hidden", e, currentItem);
                            };
                            return fnGetTargetItem(currentItem.getParent(), targetItem);
                        }
                    }
                    return currentItem;
                };
                _targetItem = fnGetTargetItem(currentItem, targetItem);
                if(_targetItem !== currentItem) {
                    fnSlidingAnimation(_targetItem, level, function () {
                        if(hiddenCallback) {
                            hiddenCallback();
                        }
                        if(animationCallback) {
                            animationCallback(_targetItem);
                        }
                    });
                    crumb = targetCrumb.parent().children().eq(level);
                    crumb.addClass('wijmo-wijmenu-current-crumb').find('span').remove();
                    crumb.nextAll().remove();
                }
            };
            wijmenu.prototype._getCurrentItemInSliding = function () {
                var self = this, container = self.domObject.menucontainer, c = $('.wijmo-wijmenu-current', container), currentItemWidget = wijmenu._getItemWidget(c.parent());
                return currentItemWidget;
            };
            wijmenu.prototype._leafNodeClick = function (e, itemWidget, breadcrumb) {
                var self = this, o = self.options, triggers;
                self.activate(e, itemWidget);
                self.select(e);
                if(o.trigger) {
                    triggers = self._getTriggerEle();
                    if(triggers.length) {
                        self._hideMenu(e);
                        self._resetDrilldownMenu(breadcrumb);
                    }
                }
                if(itemWidget._getLink().attr("href") === "#") {
                    e.preventDefault();
                }
            };
            wijmenu.prototype._slidingAnimation = function (ele, left, callback) {
                var o = this.options.slidingAnimation;
                if(o && !o.disabled) {
                    ele.stop(true, true).animate({
                        left: left
                    }, o.duration, o.easing, callback);
                } else {
                    ele.css("left", left);
                    callback.call(this);
                }
            };
            wijmenu.prototype._killDrilldown = function () {
                var ele = this._getSublist(), o = this.options, domObject = this.domObject, style = {
                    width: "",
                    height: ""
                };
                ele.css(style).removeClass(o.wijCSS.content);
                //fix bug that set mode as 'sliding' at setOptions stage
                // will remove the self.element from the page
                if(domObject.scrollcontainer && domObject.scrollcontainer.parent().length > 0) {
                    domObject.scrollcontainer.css(style);
                    domObject.scrollcontainer.wijsuperpanel("destroy");
                    domObject.scrollcontainer.removeClass("wijmo-wijsuperpanel").append(ele);
                }
                ele.prevAll().remove();
                domObject.menucontainer.removeClass(o.wijCSS.wijmenuIpod).removeClass(o.wijCSS.wijmenuContainer);
                $('.' + o.wijCSS.wijmenuCurrent, domObject.menucontainer).removeClass(o.wijCSS.wijmenuCurrent);
                $("." + o.wijCSS.wijmenuBreadcrumb, domObject.menucontainer).remove();
                ele.undelegate("li>." + o.wijCSS.wijmenuLink, "click");
                $("ul", ele).css({
                    left: "",
                    width: ""
                });
                ele.css("left", "");
                domObject.scrollcontainer = domObject.menucontainer.children(":first");
            };
            wijmenu.prototype._displayMenu = function (e) {
                var self = this, o = self.options, animationOptions, direction, showAnimation, menucontainer = self.domObject.menucontainer, triggerEle = $(e.target), haveNoVisibleChild = !wijmenu._hasVisibleSubMenus(self);
                if(menucontainer.is(":visible") || haveNoVisibleChild) {
                    return;
                }
                if(!self._trigger("showing", e, self)) {
                    return;
                }
                //self._trigger("showing", e, self);
                menucontainer.show();
                self._setPosition(triggerEle);
                self.nowIndex++;
                self._setZindex(menucontainer, self.nowIndex);
                menucontainer.hide();
                animationOptions = {
                    context: menucontainer,
                    show: true
                };
                direction = o.direction === "rtl" ? "right" : "left";
                showAnimation = $.extend({
                }, {
                    option: {
                        direction: direction
                    }
                }, o.animation, o.showAnimation);
                wijmenu._animateFlyoutMenu(showAnimation, animationOptions, function () {
                    //add the event shown
                    self._trigger("shown", e, self);
                });
                //$.wijmo.wijmenu._animateFlyoutMenu(showAnimation, animationOptions);
                self._isClickToOpen = o.triggerEvent === "click";
                this.element.data("shown", true);
            };
            wijmenu.prototype._hideMenu = function (e) {
                var self = this, o = self.options, sublist = this.domObject.menucontainer, animations = wijmenu.animations, animationOptions, hideAnimation;
                if(!this.element.data("shown")) {
                    return;
                }
                //add event hidding
                if(!self._trigger("hidding", e, self)) {
                    return;
                }
                this.element.data("shown", false);
                if($.fn.wijhide) {
                    animationOptions = {
                        context: sublist,
                        show: false
                    };
                    hideAnimation = $.extend({
                    }, o.animation, o.hideAnimation);
                    sublist.wijhide(hideAnimation, animations, animationOptions, null, function () {
                        self._setZindex(sublist, null);
                        sublist.attr("aria-hidden", true);
                        self._trigger("hidden", e, self);
                    });
                } else {
                    sublist.hide().attr("aria-hidden", true);
                    self._setZindex(sublist, null);
                    self._trigger("hidden", e, self);
                }
            };
            wijmenu.prototype._setZindex = function (ele, value) {
                var domObject = this.domObject, menucontainer;
                if(!domObject) {
                    return;
                }
                menucontainer = domObject.menucontainer;
                //fixed a bug which menu cannot shows up above other elements
                //when set an outer triggerEle
                if(ele.get(0) === menucontainer.get(0)) {
                    if(value) {
                        menucontainer.css("z-index", value);
                    } else {
                        menucontainer.css("z-index", "");
                    }
                    return;
                }
                if(value) {
                    ele.parent().css("z-index", 999);
                    ele.css("z-index", value);
                    if($.browser.msie && parseInt($.browser.version) < 8 && menucontainer.css("z-index") === 0) {
                        menucontainer.css("z-index", 9950);
                    }
                } else {
                    ele.css("z-index", "");
                    ele.parent().css("z-index", "");
                    if($.browser.msie && parseInt($.browser.version) < 8 && $("ul:visible", this._getSublist()).length === 0 && menucontainer.css("z-index") === 9950) {
                        menucontainer.css("z-index", "");
                    }
                }
            };
            wijmenu.prototype._setPosition = function (triggerEle) {
                var pOption = this._getPosition(), obj = {
                    of: triggerEle
                }, menuContainer = this.domObject.menucontainer;
                menuContainer.css({
                    left: '0',
                    top: '0',
                    position: 'absolute'
                });
                //now do not support the equal-height menu.
                /*
                if (tag) {
                var parentUl = item.parent().parent();
                if (!parentUl.is(".wijmo-wijmenu-child")) {
                parentUl = this.element.data("domObject").menucontainer;
                }
                obj = { of: parentUl };
                }
                */
                menuContainer.position($.extend(obj, pOption));
            };
            wijmenu.prototype._getPosition = function () {
                var o = this.options, direction = o.direction, pOption = direction === "rtl" ? {
                    my: 'right top',
                    at: 'right bottom'
                } : {
                    my: 'left top',
                    at: 'left bottom'
                };
                pOption = $.extend(pOption, o.position);
                return pOption;
            };
            wijmenu.prototype._getFirstSelectableSubItem = function () {
                return wijmenu._getFirstSelectableSubItem(this);
            };
            wijmenu.prototype._getLastSelectableSubItem = function () {
                return wijmenu._getLastSelectableSubItem(this);
            };
            wijmenu.prototype.add = /** Adds a child menuItem to the menuItem.
            * @param menuitem The menuItem to be added
            * 1.markup html.such as "<a>menuItem</a>" as a menuItem.
            * 2.object options according to the options of wijmenuItem.
            * @param {number} position the position to insert at
            */
            function (menuItem, position) {
                wijmenu._add(this, menuItem, position);
            };
            wijmenu.prototype._getSublist = function () {
                return this._rootMenu;
            };
            wijmenu.prototype.getItems = /**
            * Gets the collection of child items.
            * @returns {array} the menu items.
            */
            function () {
                return this._items;
            };
            wijmenu.prototype.remove = /** Remove an item from the menu.
            * @param {Number} index The index of menuitem to be removed
            * @example
            * //Removes the second menuitem.
            * $("#menu").wijmenu("remove", 1);
            */
            function (index) {
                wijmenu._remove(this, index);
            };
            wijmenu.prototype._newId = function () {
                var charArray = [
                    'a', 
                    'b', 
                    'c', 
                    'd', 
                    'e', 
                    'f', 
                    'g', 
                    'h', 
                    'i', 
                    'j', 
                    'k', 
                    'l', 
                    'm', 
                    'n', 
                    'o', 
                    'p', 
                    'q', 
                    'r', 
                    's', 
                    't', 
                    'u', 
                    'v', 
                    'w', 
                    'x', 
                    'y', 
                    'z'
                ], id = "", i;
                for(i = 0; i < 16; i++) {
                    id += charArray[Math.round(Math.random() * 25)];
                }
                return id;
            };
            wijmenu.animations = {
                slide: function (options, addtions) {
                    options = $.extend({
                        duration: 400,
                        easing: "swing"
                    }, options, addtions);
                    if(options.show) {
                        options.context.stop(true, true).animate({
                            height: 'show'
                        }, options, function () {
                            options.context.attr("aria-hidden", false);
                        });
                    } else {
                        options.context.stop(true, true).animate({
                            height: 'hide'
                        }, options, function () {
                            options.context.attr("aria-hidden", true);
                        });
                    }
                }
            };
            wijmenu._animateFlyoutMenu = function _animateFlyoutMenu(showAnimation, animationOptions, callback) {
                var sublist = animationOptions.context;
                if($.fn.wijshow) {
                    sublist.data("isAnimated", true);
                    sublist.wijshow(showAnimation, wijmenu.animations, animationOptions, null, function () {
                        sublist.data("isAnimated", false);
                        var browser = $.browser;
                        if(browser.msie && browser.version === "9.0") {
                            sublist.wrap("<div></div>");
                            sublist.unwrap();
                        } else if(browser.msie && browser.version === "6.0") {
                            sublist.css("overflow", "");
                        }
                        sublist.attr("aria-hidden", false);
                        if(callback) {
                            callback();
                        }
                    });
                } else {
                    sublist.show().attr("aria-hidden", false);
                }
            };
            wijmenu._getMenuItemOptions = function _getMenuItemOptions(options, index) {
                if(!options) {
                    return {
                    };
                }
                if(!options.items || !$.isArray(options.items)) {
                    return {
                    };
                }
                if(index >= options.items.length) {
                    return {
                    };
                }
                return options.items[index];
            };
            wijmenu._getOuterElement = function _getOuterElement(selector, isInnerSelector) {
                return $(selector).filter(function () {
                    return $(this).closest(isInnerSelector).length === 0;
                });
            };
            wijmenu._hasVisibleSubMenus = function _hasVisibleSubMenus(widgetElement) {
                var widget, items, i;
                if(widgetElement.jquery) {
                    if(widgetElement.data("wijmomenu")) {
                        widget = widgetElement.data(widgetElement.data("wijmomenu"));
                    } else if(widgetElement.data("wijmomenuitem")) {
                        widget = widgetElement.data(widgetElement.data("wijmomenuitem"));
                    }
                } else {
                    widget = widgetElement;
                }
                if(!widget) {
                    throw "the arugment 'menuItem' must be an wijmenu or wijmenuitem";
                }
                items = widget.getItems();
                if(!items.length) {
                    return false;
                }
                for(i = 0; i < items.length; i++) {
                    //if any of item was set displayVisible as true, just return true;
                    if(items[i].options.displayVisible) {
                        return true;
                    }
                }
                return false;
            };
            wijmenu._getFirstSelectableSubItem = function _getFirstSelectableSubItem(widget) {
                var i, items = widget.getItems(), o;
                for(i = 0; i < items.length; i++) {
                    o = items[i].options;
                    if(o.displayVisible !== false && !o.header && !o.separator) {
                        return items[i];
                    }
                }
                return null;
            };
            wijmenu._getLastSelectableSubItem = function _getLastSelectableSubItem(widget) {
                var i, items = widget.getItems(), o;
                for(i = items.length - 1; i >= 0; i--) {
                    o = items[i].options;
                    if(o.displayVisible !== false && !o.header && !o.separator) {
                        return items[i];
                    }
                }
                return null;
            };
            wijmenu._getSelectableSubItems = function _getSelectableSubItems(widget, filter) {
                return $.grep(widget.getItems(), function (n, i) {
                    var o = n.options;
                    if(o.header || o.separator || o.displayVisible === false) {
                        return false;
                    }
                    return filter(n, i);
                }, false);
            };
            wijmenu._add = /** Adds a child menuItem to the menuItem.  */
            function _add(self, menuItem, position) {
                var menuItemWidget = null, $menuItem = $("<li></li>"), $ul = self._getSublist(), items = self.getItems(), elementToInserBefore, o, hasCreatedUl = false;
                if(typeof menuItem === "string") {
                    //if is h1-h5 or an link
                    if(/<(h[1-5]|a)[\s\S]*>[\s\S]*<\/\1>/.test(menuItem)) {
                        $menuItem.append(menuItem);
                    }
                } else if($.isPlainObject(menuItem)) {
                    o = jQuery.extend(true, {
                    }, menuItem);
                }
                //if the li has no children before, add an new ul
                if(!$ul || $ul.length <= 0) {
                    $ul = $("<ul></ul>");
                    self.element.append($ul);
                    hasCreatedUl = true;
                }
                //if position is 0, '', undefined, null
                //OR not an number,
                //OR was specifed an out of range value
                if(!position || isNaN(position) || position > items.length) {
                    if(position !== 0) {
                        position = items.length;
                    }
                }
                //if the posiotn has been specified, insert it to the appropriate position
                if(items.length > 0 && items.length !== position) {
                    elementToInserBefore = items[position].element;
                    $menuItem.insertBefore(elementToInserBefore);
                } else {
                    $ul.append($menuItem);
                }
                menuItemWidget = self._createItemWidget($menuItem, o);
                if(menuItemWidget === null || menuItemWidget === undefined) {
                    return;
                }
                wijmenu._changeCollection(position, self.getItems(), self.options.items, menuItemWidget);
                if(self._bindModeEvents) {
                    self._bindModeEvents(menuItemWidget, hasCreatedUl);
                } else {
                    menuItemWidget._bindModeEvents(menuItemWidget, hasCreatedUl);
                }
                if(hasCreatedUl) {
                    self._initUlCssClass();
                }
            };
            wijmenu._changeCollection = function _changeCollection(idx, menuItems, items, menuItemWidget) {
                //var indexOfItem;
                if(!menuItemWidget) {
                    menuItems.splice(idx, 1);
                    items.splice(idx, 1);
                    return;
                }
                //if the menuItemWidget has been in the array, remove it at first
                //			indexOfItem = $.inArray(menuItemWidget, menuItems);
                //			if (indexOfItem !== -1) {
                //				menuItems.splice(indexOfItem, 1);
                //			}
                menuItems.splice(idx, 0, menuItemWidget);
                items.splice(idx, 0, menuItemWidget.options);
            };
            wijmenu._remove = function _remove(self, index) {
                var menuItem = self.getItems()[index];
                if(menuItem && menuItem.element) {
                    menuItem.element.remove();
                }
            };
            wijmenu._getItemWidget = function _getItemWidget(li) {
                //return li.data($.wijmo.wijmenu._itemWidgetName);
                return li.data(li.data("wijmomenuitem"));
            };
            return wijmenu;
        })(wijmo.wijmoWidget);
        menu.wijmenu = wijmenu;        
        var wijmenu_options = (function () {
            function wijmenu_options() {
                /** Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijmenu')";
                /** wijmenu css, extend from $.wijmo.wijCSS
                * @ignore
                */
                this.wijCSS = {
                    wijmenu: "wijmo-wijmenu",
                    wijmenuHorizontal: "wijmo-wijmenu-horizontal",
                    wijmenuCurrent: "wijmo-wijmenu-current",
                    wijmenuCurrentCrumb: "wijmo-wijmenu-current-crumb",
                    wijmenuBreadcrumb: "wijmo-wijmenu-breadcrumb",
                    wijmenuBreadcrumbText: "wijmo-wijmenu-breadcrumb-text",
                    wijmenuItem: "wijmo-wijmenu-item",
                    wijmenuLink: "wijmo-wijmenu-link",
                    wijmenuList: "wijmo-wijmenu-list",
                    wijmenuScroll: "wijmo-wijmenu-scroll",
                    wijmenuContent: "wijmo-wijmenu-content",
                    wijmenuFooter: "wijmo-wijmenu-footer",
                    wijmenuHeader: "wijmo-wijmenu-header",
                    wijmenuContainer: "wijmo-wijmenu-container",
                    wijmenuIpod: "wijmo-wijmenu-ipod",
                    wijmenuCrumb: "wijmo-wijmenu-crumb",
                    wijmenuAllLists: "wijmo-wijmenu-all-lists",
                    wijmenuPrevList: "wijmo-wijmenu-prev-list",
                    wijmenuRtl: "wijmo-wijmenu-rtl",
                    wijmenuBacklinktext: "wijmo-wijmenu-backlinktext",
                    wijmenuSubmenuContainer: "wijmo-wijmenu-submenu-container",
                    wijmenuParent: "wijmo-wijmenu-parent"
                };
                /** @ignore*/
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-c",
                    content: "ui-body ui-body-c",
                    stateDefault: "ui-btn-up-c",
                    stateHover: "ui-btn-down-c",
                    stateActive: "ui-btn-down-c"
                };
                /** The trigger option handles the open event for the menu or submenu.
                * This option must be used with the triggerEvent option.
                * @remarks If the trigger is set to a menu item(the <li> element),
                * then the submenu appears when the item is clicked if the triggerEvent
                * is set to click. If the trigger is set to an element outside of the menu,
                * then the menu opens when the element is clicked if the triggerEvent is
                * set to click as a contextmenu.
                * @example
                * //Set trigger to make menu as input's contextmenu.
                * $(".selector").wijmenu("option", "trigger", "input")
                */
                this.trigger = '';
                /** The triggerEvent option specifies the mouse event used to show the menu or submenu.
                * triggerEvent must be used with the trigger option.
                * @remarks The value can be seted to 'click', 'mouseenter', 'dbclick', 'rtclick'
                */
                this.triggerEvent = 'click';
                /** The position option specifies the location and orientation of the menu relative to the button
                * or link used to open it.
                * @remarks Configuration for the Position Utility,Of option
                * is excluded, it is always configured by the widget.
                * Collision also controls collision detection automatically too.
                * It uses jQuery position plugin, see the following link for more details,
                * http://api.jqueryui.com/position/
                */
                this.position = {
                };
                /** The animation option determines the menu animation if the showAnimation
                * and hideAnimation properties are not individually specified.
                * For a description of the animation effects and the easing effects, please see the Animation page.
                * @remarks This option uses the standard animation setting syntax
                * from jQuery.UI.
                */
                this.animation = {
                    animated: "slide",
                    duration: 400,
                    easing: null,
                    option: null
                };
                /** This option determines the animation effect, the duration, and the easing effect used to hide the submenus.
                * You can also use this option to set any animation-specific options, such as direction.
                * @remarks This option uses the standard animation setting syntax from jQuery.UI.
                */
                this.showAnimation = {
                };
                /** Determines the animation used to hide submenus.
                * @remarks This option uses the standard animation setting syntax
                * from jQuery.UI.
                */
                this.hideAnimation = {
                    animated: "fade",
                    duration: 400,
                    easing: null,
                    option: null
                };
                /** This option determines how many milliseconds to delay
                * before showing the submenu in a fly-out menu.
                */
                this.showDelay = 400;
                /** This option determines how many milliseconds to delay
                * before hiding the submenu in a fly-out menu.
                */
                this.hideDelay = 400;
                /** This option defines the animation used to slide a submenu when in sliding mode.*/
                this.slidingAnimation = {
                    duration: 400,
                    easing: null
                };
                /** The mode option defines the behavior of the menu,
                * whether it is a pop-up menu or an iPod-style navigation list.
                * @remarks The possible values are "flyout" or "sliding".
                * If you want to show your submenu in the same container by sliding animation as in an iPod-style menu,
                * use the "sliding" mode.
                */
                this.mode = 'flyout';
                /** This option specifies a hash value that sets to superpanel options
                * when a superpanel is created.  It is used to set appearances and behaviors
                * when a scrollbar is shown in sliding mode.
                * @remarks It uses wijsuperpanel, see the following link for more details,
                * http://wijmo.com/wiki/index.php/Superpanel .
                */
                this.superPanelOptions = null;
                /** When you set the checkable option to true and click on a menu item,
                * the clicked item's state will be selected.
                * A "ui-state-active" class will be added to the item so that the item behavior and the item appearance are different.*/
                this.checkable = false;
                /** This option controls the root menu's orientation. All submenus are vertical
                * regardless of the orientation of the root menu.
                * @remarks Possible values are "horizontal" or "vertical".
                * You can see the horizontal menu in theMarkup and Scripting section.
                */
                this.orientation = 'horizontal';
                /** A value that indicates menu's direction.
                * @remarks The value should be "ltr" or "rtl".
                */
                this.direction = 'ltr';
                /** This option determines the iPod-style menu's maximum height.
                * @remarks This option can only be used in an iPod-style menu.
                * When the menu contains more items than can be displayed within the allowed height,
                * the menu will show a scrollbar.
                */
                this.maxHeight = 200;
                /** This option determines whether the iPod-style menu shows a back link or a breadcrumb header
                * in the menu.
                */
                this.backLink = true;
                /** This option sets the text of the back link.*/
                this.backLinkText = 'Back';
                /** A value that sets the text of the top link. */
                this.topLinkText = 'All';
                /** A value that sets the top breadcrumb's default text.*/
                this.crumbDefaultText = 'Choose an option';
                /** The select event is triggered when a menu item is selected.
                * This event can be triggered by theselect method to allow for custom keyboard handling.
                * @event
                * @dataKey item item.item is the active item of the menu.
                */
                this.select = null;
                /** The focus event is triggered either on mouse hover or
                * when the keyboard cursor keys are used for navigation.
                * In general, an item or element that has focus is highlighted in some way.
                * When an item or element has focus it is the first to receive keyboard-related events.
                * @event
                * @dataKey item item.item is the item which is focused.
                */
                this.focus = null;
                /** The blur event is triggered when a menu item loses focus.
                * You can use this event to track which item has lost focus.
                * An item can lose focus through keyboard commands, such as when the Tab key is pressed,
                * or when a user clicks elsewhere on the page.
                * @event
                * @dataKey item item.item is the item which is blured.
                */
                this.blur = null;
                /** The showing event is triggered before the submenu is shown.
                * showing is a useful event if you want to perform a function before the submenu is shown
                * or if you want to block the submenu from showing by returning false.
                * @event
                * @param event This is the jQuery.Event object.
                * @param item This is the event object that relates to the submenu's parent item.
                */
                this.showing = null;
                /** The shown event is triggered after the menu or submenu is shown.
                * @event
                * @param event This is the jQuery.Event object.
                * @param item The wijmenu widget object when the menu has been displayed,
                * or the wijmenuitem widget when the submenu has been displayed.
                */
                this.shown = null;
                /** The hidding event is triggered before hidding the menu or submenu.
                * This event can be cancelled with "return false";
                * @event
                * @param event This is the jQuery.Event object.
                * @param item This is the wijmenu widget object when hiding the menu
                * or a wijmenuitem when hiding the submenu.
                */
                this.hidding = null;
                /** The hidden event is triggered after the menu or submenu is hidden.
                * @event
                * @param event This is the jQuery.Event object.
                * @param item The wijmenu widget object when a menu is hidden
                * or a wijmenuitem object when the submenu is hidden.
                */
                this.hidden = null;
                /** The options of child items
                * @type {array}
                */
                this.items = null;
                /** A value indicating the submenu element will be append to the body or menu container.
                * @remarks
                *  If the value is true, the submenu will be appended to body element.
                *  else it will append to the menu container.
                */
                this.ensureSubmenuOnBody = false;
            }
            return wijmenu_options;
        })();        
        ;
        //#region menu options
        wijmenu.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijmenu_options());
        ;
        ;
        /** @ignore*/
        (function (MarkupType) {
            MarkupType._map = [];
            MarkupType.link = 0;
            MarkupType.separator = 1;
            MarkupType.header = 2;
            MarkupType.other = 3;
        })(menu.MarkupType || (menu.MarkupType = {}));
        var MarkupType = menu.MarkupType;
        /** @ignore*/
        var wijmenuitem = (function (_super) {
            __extends(wijmenuitem, _super);
            function wijmenuitem() {
                _super.apply(this, arguments);

            }
            wijmenuitem.prototype._initState = function () {
                this._items = [];
                this._resetMarkupValue();
                if(!this.options.items) {
                    this.options.items = [];
                }
            };
            wijmenuitem.prototype._create = function () {
                var self = this;
                if(self._isMobile) {
                    $.extend(true, self.options.wijCSS, self.options.wijMobileCSS);
                }
                //update for jQuery UI 1.10
                self.element.data("wijmomenuitem", $.camelCase(self.widgetFullName));
                //self.element.data("wijmomenuitem", self.widgetName);
                self._initState();
                self._getOrSetOptionsValues();
                self._createChildMenuItems();
                self._initCssClass();
                //invoke base create.
                _super.prototype._create.call(this);
            };
            wijmenuitem.prototype._refresh = function () {
                var self = this, o = self.options;
                self._set_navigateUrl(o.navigateUrl);
                self._set_target(o.target);
                self._set_displayVisible(o.displayVisible);
                self._createChildMenuItems();
                self._initCssClass();
                //self._bindEvents();
                            };
            wijmenuitem.prototype._setOption = function (key, value) {
                var self = this, o = self.options, parent;
                if(key === "items") {
                    _super.prototype._setOption.call(this, key, value);
                    self._set_items(value);
                    return;
                }
                if(value === o[key]) {
                    return;
                }
                _super.prototype._setOption.call(this, key, value);
                if(!$.isFunction(self["_set_" + key])) {
                    return;
                }
                self["_set_" + key](value, true);
                switch(key) {
                    case "header":
                    case "separator":
                        self._refresh();
                        break;
                    case "displayVisible":
                        parent = self.getParent();
                        if(parent) {
                            parent._setSubmenuIcon();
                        }
                        break;
                    default:
                        break;
                }
            };
            wijmenuitem.prototype.index = function () {
                /// <summary>
                /// return index of the item.
                /// </summary>
                return this.element.index();
            };
            wijmenuitem.prototype._set_selected = function (value) {
                var self = this, o = self.options, itemType = self._getMenuItemType();
                if(itemType === MarkupType.link) {
                    self._getLink().toggleClass(o.wijCSS.stateActive, value);
                } else {
                    //if not an link item set selected as false;
                    self.options.selected = false;
                }
            };
            wijmenuitem.prototype._set_items = function (value) {
                var self = this;
                self._getSublist().remove();
                self._items = [];
                if(value.length > 0) {
                    self._createChildMenuItems();
                    self._initUlCssClass();
                    //self._initCssClass();
                                    }
                self._setSubmenuIcon(value.length > 0);
                self._bindModeEvents(self, true);
                self._resetMarkupValue();
            };
            wijmenuitem.prototype._bindModeEvents = function (widget, createdUl) {
                var self = this, menu = widget._getMenu(), o = menu.options;
                if(createdUl) {
                    self._initUlCssClass();
                    self._setSubmenuIcon();
                    self._resetMarkupValue();
                }
                if(o.mode === "flyout") {
                    //if created an ul means the event of the li
                    //has been modified from an leaf to an node
                    //so there must be kill flyout at first
                    if(createdUl) {
                        self._killFlyout();
                        self._flyout();
                    } else {
                        widget._flyout();
                    }
                } else {
                    self._setDrilldownUlStyle();
                    //reset scroll only if is add to an visible ul
                    if(widget.element.parent().is(':visible')) {
                        menu._resetScroll(widget._getParentOrMenu());
                    }
                }
            };
            wijmenuitem.prototype._set_value = function (value, writeOnly) {
                this.options.value = value;
            };
            wijmenuitem.prototype._set_text = function (value, writeOnly) {
                var self = this, o = self.options;
                if(value || writeOnly) {
                    self._setText(value);
                } else {
                    o.text = self._getText();
                }
            };
            wijmenuitem.prototype._set_navigateUrl = function (value, writeOnly) {
                var self = this, o = self.options, link = self._getLink();
                if(link.is('a')) {
                    if(value || writeOnly) {
                        link.attr('href', value);
                    } else {
                        o.navigateUrl = link.attr('href');
                    }
                }
            };
            wijmenuitem.prototype._set_target = function (value, writeOnly) {
                var self = this, o = self.options, link = self._getLink();
                if(link.is('a')) {
                    if(o.target || writeOnly) {
                        link.attr('target', value);
                    } else {
                        o.target = link.attr('target') || '';
                    }
                }
            };
            wijmenuitem.prototype._set_iconClass = function (value, writeOnly) {
                var self = this, o = self.options, link, iconSpan, textSpan, text;
                //is header or separator, do nothing
                if(o.header === true || o.separator === true) {
                    return;
                }
                link = self._getLink();
                iconSpan = link.find('span.' + o.wijCSS.wijmenuitemIcon);
                if(value) {
                    //does not have the span, create it
                    if(iconSpan.length === 0) {
                        iconSpan = $("<span>");
                        textSpan = link.children("." + o.wijCSS.wijmenuText).wrap("<span>").parent();
                        textSpan.addClass(o.wijCSS.wijmenuText);
                        textSpan.prepend(iconSpan);
                    }
                    //have specified value, set cssClass as user specified value
                    iconSpan.addClass(value).addClass(o.wijCSS.wijmenuIconLeft).addClass(o.wijCSS.wijmenuitemIcon);
                    if(writeOnly) {
                        self._set_imagePosition(o.imagePosition);
                    }
                } else {
                    //else value is not specified
                    if(iconSpan.length !== 0) {
                        iconSpan.remove();
                        textSpan = link.children("." + o.wijCSS.wijmenuText);
                        text = textSpan.text();
                        textSpan.html('');
                        textSpan.text(text);
                    }
                }
                //add class to link to fix tfs issue 24238
                if(self._getMenuItemType() === MarkupType.other) {
                    //if (link && link.is("div")) {
                    link.addClass(o.wijCSS.wijmenuLink).addClass(o.wijCSS.cornerAll);
                }
            };
            wijmenuitem.prototype._set_imagePosition = function (value, writeOnly) {
                var self = this, o = self.options, link = self._getLink(), iconSpan = link.find('>span>span.' + o.wijCSS.wijmenuitemIcon), positionCss = value === 'right' ? o.wijCSS.wijmenuIconRight : o.wijCSS.wijmenuIconLeft;
                if(iconSpan.length === 0) {
                    return;
                }
                iconSpan.removeClass(o.wijCSS.wijmenuIconRight).removeClass(o.wijCSS.wijmenuIconLeft).addClass(positionCss);
            };
            wijmenuitem.prototype._set_separator = function (value, writeOnly) {
                var self = this, ele = self.element, o = self.options, link = self._getLink();
                if(writeOnly && value === false) {
                    ele.html("").removeClass(o.wijCSS.wijmenuSeparator).removeClass(o.wijCSS.widget).removeClass(o.wijCSS.wijmenuItem).removeClass(o.wijCSS.stateDefault).removeClass(o.wijCSS.cornerAll);
                    self._createMenuItemMarkup(MarkupType.link).appendTo(ele);
                } else if(value === true || link.length === 0) {
                    o.separator = true;
                    o.header = false;
                    //if is separator, modify html markup
                    self._createMenuItemMarkup(MarkupType.separator);
                } else {
                    o.separator = false;
                }
                self._resetMarkupValue();
            };
            wijmenuitem.prototype._set_header = function (value, writeOnly) {
                var self = this, ele = self.element, o = self.options, link = self._getLink();
                if(writeOnly && value === false) {
                    o.header = false;
                    ele.html("").removeClass(o.wijCSS.header).removeClass(o.wijCSS.cornerAll).removeClass(o.wijCSS.widget).removeClass(o.wijCSS.wijmenuItem).removeClass(o.wijCSS.stateDefault);
                    self._createMenuItemMarkup(MarkupType.link).appendTo(ele);
                } else if(value === true || link.is("h1,h2,h3,h4,h5")) {
                    o.header = true;
                    o.separator = false;
                    //if is header, modify the html markup
                    if(!link.is("h1,h2,h3,h4,h5")) {
                        //clear html element and add an h3 as header
                        link.remove();
                        link = self._createMenuItemMarkup(MarkupType.header);
                        ele.append(link);
                    }
                } else {
                    o.header = false;
                }
                self._resetMarkupValue();
            };
            wijmenuitem.prototype._set_displayVisible = function (value) {
                var self = this, ele = self.element;
                if(value) {
                    ele.show();
                } else {
                    ele.hide();
                }
            };
            wijmenuitem.prototype._createMenuItemMarkup = function (markupType) {
                var self = this, o = self.options, ele = self.element, result;
                if(markupType === MarkupType.separator) {
                    //just clear html markup
                    //ele.html('');
                    ele.html('<span class="' + o.wijCSS.wijmenuSeparatorContent + '">&nbsp;</span>');
                    return null;
                } else if(markupType === MarkupType.header) {
                    result = $("<h3></h3>").text(o.text);
                } else {
                    result = $('<a>').text(o.text);
                }
                return result;
            };
            wijmenuitem.prototype._getMenuItemType = function (newOptions) {
                var self = this, o = self.options, link = self._getLink();
                if(newOptions) {
                    o = $.extend({
                    }, o, newOptions);
                }
                if(o.separator === true) {
                    return MarkupType.separator;
                }
                if(o.header === true) {
                    return MarkupType.header;
                }
                //when neither specified options.separator nor options.header as true
                //if markup is  <li></li>
                if(link.length === 0) {
                    if(o.text) {
                        //if text have specified
                        return MarkupType.link;
                    }
                    //else is separator
                    return MarkupType.separator;
                }
                if(link.is('a')) {
                    return MarkupType.link;
                }
                if(link.is('h1,h2,h3,h4,h5')) {
                    return MarkupType.header;
                }
                return MarkupType.other;
            };
            wijmenuitem.prototype._getOrSetOptionsValues = function () {
                var self = this, ele = self.element, o = self.options, link = self._getLink(), type = self._getMenuItemType();
                if(type === MarkupType.header) {
                    self._set_header(o.header);
                    self._set_text(o.text);
                } else if(type === MarkupType.separator) {
                    self._set_separator(o.separator);
                } else {
                    //if the markup is just an <li></li> create markup at first
                    if(link.length === 0) {
                        link = self._createMenuItemMarkup(type);
                        ele.append(link);
                    } else {
                        self._set_text(o.text);
                    }
                    self._resetMarkupValue();
                    self._set_navigateUrl(o.navigateUrl);
                    self._set_target(o.target);
                }
                self._set_displayVisible(o.displayVisible);
                self._set_selected(o.selected);
            };
            wijmenuitem.prototype._getText = function () {
                //get the text of the item
                return this._getLink().text();
            };
            wijmenuitem.prototype._setText = function (text) {
                var ele = this.element, o = this.options, link;
                //have 4 kind of situations
                //1 first time li created as widget, the markup like <li><a>text</a></li>
                //2 the li has been created as widget, html markup like
                //	<li role="menuitem" class="ui-widget wijmo-wijmenu-item">
                //		<a class="wijmo-wijmenu-link ui-corner-all" aria-haspopup="">
                //			<span class="wijmo-wijmenu-text">menu item2</span></a></li>
                //3 is an header mark up like <li><h3>text</h3></li>
                //4 is an separator this situation don't need to set text
                //find first-child a to fix tfs issue 24238
                link = ele.find(":not(ul)a ." + o.wijCSS.wijmenuText + ":first");
                //link = ele.find(".wijmo-wijmenu-text");
                //end comments.
                if(link.length !== 0) {
                    link.text(text);
                    return;
                }
                link = ele.children('h1,h2,h3,h4,h5').filter(':first');
                if(link.length !== 0) {
                    link.text(text);
                    return;
                }
                link = ele.children('a:first');
                if(link.length !== 0) {
                    link.text(text);
                    return;
                }
            };
            wijmenuitem.prototype._createChildMenuItems = function () {
                var self = this, ele = self.element, items = self._items, o = self.options, optionItemsLength, ul, childMenuCount, i, w, frame;
                if(o.header === true || o.separator === true) {
                    return;
                }
                optionItemsLength = o.items.length;
                ul = self._getSublist();
                childMenuCount = ul.children('li').length;
                // if the count of items more than li contained in html markup
                if(optionItemsLength > childMenuCount) {
                    if(ul.length === 0) {
                        ul = $('<ul>').appendTo(ele);
                        self._resetMarkupValue();
                    }
                    for(i = 0; i < optionItemsLength - childMenuCount; i++) {
                        ul.append('<li>');
                    }
                }
                $.each(self._getChildren(), function (idx, child) {
                    var $li = $(child), options;
                    options = wijmenu._getMenuItemOptions(self.options, idx);
                    w = self._createItemWidget($li, options);
                    items.push(w);
                    self.options.items[idx] = w.options;
                });
            };
            wijmenuitem.prototype._createItemWidget = function ($li, options) {
                var self = this, itemWidgetName = self.widgetName;
                //itemWidgetName = $.wijmo.wijmenu._itemWidgetName;
                $li[itemWidgetName](options);
                //Fix for jQuery UI 1.10
                return $li.data($.camelCase(self.widgetFullName));
                //return $li.data(self.widgetName);
                            };
            wijmenuitem.prototype._initCssClass = function () {
                var self = this, li = this.element, o = self.options, link = self._getLink(), type = self._getMenuItemType();
                if(type !== MarkupType.separator) {
                    li.attr("role", "menuitem");
                }
                if(type === MarkupType.separator) {
                    li.addClass(o.wijCSS.wijmenuSeparator).addClass(o.wijCSS.stateDefault).addClass(o.wijCSS.cornerAll);
                } else if(type === MarkupType.header) {
                    li.addClass(o.wijCSS.header).addClass(o.wijCSS.cornerAll);
                } else {
                    if(type === MarkupType.link) {
                        if(!li.hasAllClasses(o.wijCSS.wijmenuItem)) {
                            li.addClass(o.wijCSS.widget).addClass(o.wijCSS.wijmenuItem).addClass(o.wijCSS.stateDefault).addClass(o.wijCSS.cornerAll);
                            link.addClass(o.wijCSS.wijmenuLink).addClass(o.wijCSS.cornerAll);
                            link.wrapInner("<span>").children("span").addClass(o.wijCSS.wijmenuText);
                        }
                    } else {
                        li.addClass(o.wijCSS.widget).addClass(o.wijCSS.wijmenuItem).addClass(o.wijCSS.stateDefault).addClass(o.wijCSS.cornerAll);
                    }
                    self._setSubmenuIcon();
                }
                self._set_iconClass(o.iconClass);
                self._set_imagePosition(o.imagePosition);
                self._initUlCssClass();
            };
            wijmenuitem.prototype._initUlCssClass = function () {
                var o = this.options;
                this._getSublist().addClass(o.wijCSS.wijmenuList).addClass(o.wijCSS.content).addClass(o.wijCSS.cornerAll).addClass(o.wijCSS.helperClearFix).addClass(o.wijCSS.wijmenuChild).addClass(o.wijCSS.helperReset).hide();
            };
            wijmenuitem.prototype._setSubmenuIcon = function (hasSubmenu) {
                var self = this, o = this.options, link = self._getLink(), menu = self._getMenu(), direction = menu.options.direction, submenuIcon = direction === "rtl" ? link.children("span." + o.wijCSS.icon + ":first") : link.children("span." + o.wijCSS.icon + ":last");
                //if the arugment 'hasSubmenu' was not specified
                if(hasSubmenu === undefined) {
                    hasSubmenu = wijmenu._hasVisibleSubMenus(self);
                }
                if(hasSubmenu && !link.is(":input")) {
                    if(submenuIcon.length === 0) {
                        if(direction === "rtl") {
                            submenuIcon = $("<span>").prependTo(link);
                        } else {
                            submenuIcon = $("<span>").appendTo(link);
                        }
                    }
                    if(self._isRoot() && menu.options.orientation === "horizontal" && menu.options.mode === 'flyout') {
                        submenuIcon.addClass(o.wijCSS.icon).addClass(o.wijCSS.iconArrowDown);
                    } else {
                        if(direction === "rtl") {
                            submenuIcon.addClass(o.wijCSS.icon).addClass(o.wijCSS.iconArrowLeft);
                        } else {
                            submenuIcon.addClass(o.wijCSS.icon).addClass(o.wijCSS.iconArrowRight);
                        }
                    }
                } else {
                    submenuIcon.remove();
                }
            };
            wijmenuitem.prototype._killFlyout = function () {
                var ele = this.element.attr("role", ""), o = this.options;
                ele.removeClass(o.wijCSS.wijmenuParent).unbind(".wijmenuEvent").unbind(".wijmenuitem").children(":first").unbind(".wijmenuEvent").unbind(".wijmenuitem").attr("aria-haspopup", "");
                //add by chandler for unbinding ul mouseleave event
                this._getSublist().unbind(".wijmenuEvent").unbind(".wijmenuitem");
                $.each(this.getItems(), function () {
                    this._killFlyout();
                });
            };
            wijmenuitem.prototype._getItemTriggerEvent = function () {
                var self = this, ele = self.element, menu = self._getMenu(), o = menu.options, triggerEvent = "default";
                if(o.trigger !== "") {
                    if(ele.is(o.trigger) || menu.element.is(o.trigger)) {
                        triggerEvent = o.triggerEvent;
                    } else {
                        ele.parents("." + o.wijCSS.wijmenuParent).each(function (i, n) {
                            if($(n).is(o.trigger)) {
                                triggerEvent = o.triggerEvent;
                                return false;
                            }
                        });
                        if(triggerEvent === "default" && self._isOuterTirggerEle()) {
                            triggerEvent = o.triggerEvent;
                        }
                    }
                }
                ele.data("triggerEvent", triggerEvent);
                return triggerEvent;
            };
            wijmenuitem.prototype._isOuterTirggerEle = function () {
                var menu = this._getMenu();
                return wijmenu._getOuterElement(menu.options.trigger, "." + menu.options.wijCSS.wijmenu).length > 0;
            };
            wijmenuitem.prototype._flyout = function () {
                var self = this, menu = self._getMenu(), o = menu.options, nameSpace = ".wijmenuitem", li = $(self.element).attr("aria-haspopup", true), showTimer, hideTimer, triggerEvent = self._getItemTriggerEvent(), link = li.children('a.' + o.wijCSS.wijmenuLink), subList = self._getSublist(), itemDisabled;
                if(self.getItems().length > 0) {
                    subList.bind("mouseleave" + nameSpace, function (e) {
                        if(o.disabled) {
                            return;
                        }
                        hideTimer = setTimeout(function () {
                            self._hideCurrentSubmenu(e);
                        }, o.hideDelay);
                    });
                    li.addClass(self.options.wijCSS.wijmenuParent);
                    if(triggerEvent !== "default" && o.triggerEvent !== "mouseenter") {
                        switch(o.triggerEvent) {
                            case "click":
                                link.bind("click" + nameSpace, function (e) {
                                    if(o.disabled || $(this).hasAllClasses(o.wijCSS.stateDisabled)) {
                                        return;
                                    }
                                    self._showFlyoutSubmenu(e);
                                });
                                break;
                            case "dblclick":
                                link.bind("dblclick" + nameSpace, function (e) {
                                    if(o.disabled || $(this).hasAllClasses(o.wijCSS.stateDisabled)) {
                                        return;
                                    }
                                    self._showFlyoutSubmenu(e);
                                });
                                break;
                            case "rtclick":
                                link.bind("contextmenu" + nameSpace, function (e) {
                                    if(o.disabled || $(this).hasAllClasses(o.wijCSS.stateDisabled)) {
                                        return;
                                    }
                                    self._showFlyoutSubmenu(e);
                                    e.preventDefault();
                                });
                                break;
                        }
                        subList.data("notClose", true);
                    } else {
                        link.bind("mouseenter.wijmenuEvent", function (e) {
                            if(o.disabled || $(this).hasAllClasses(o.wijCSS.stateDisabled)) {
                                return;
                            }
                            clearTimeout(hideTimer);
                            showTimer = setTimeout(function () {
                                self._displaySubmenu(e, null);
                            }, o.showDelay);
                        }).bind("mouseleave" + nameSpace, function (e) {
                            if(o.disabled || $(this).hasAllClasses(o.wijCSS.stateDisabled)) {
                                return;
                            }
                            clearTimeout(showTimer);
                            if(!subList.is("ul")) {
                                subList = subList.children("ul:first");
                            }
                            hideTimer = setTimeout(function () {
                                self._hideSubmenu(false, e);
                            }, o.hideDelay);
                        });
                        if(self.getItems().length > 0) {
                            self._getSublist().bind("mouseenter" + nameSpace, function (e) {
                                if(o.disabled) {
                                    return;
                                }
                                clearTimeout(hideTimer);
                            });
                        }
                        subList.data("notClose", false);
                    }
                }
                ///when click the menu item hide the submenus.
                link.bind("click.wijmenuEvent", function (e) {
                    itemDisabled = link.hasAllClasses(o.wijCSS.stateDisabled);
                    if(o.disabled || itemDisabled) {
                        return;
                    }
                    if(link.is("a")) {
                        if(self._getSublist().length === 0) {
                            menu._hideAllMenus(e);
                        } else if(!(o.trigger !== "" && li.data("triggerEvent") !== "default" && o.triggerEvent !== "mouseenter")) {
                            menu._hideAllMenus(e);
                        } else {
                            var curList = menu._currentMenuList, item, j;
                            if(curList !== undefined) {
                                item = li;
                                if(self._getSublist().length === 0) {
                                    for(j = curList.length; j > 0; j--) {
                                        if(curList[j - 1] === self) {
                                            break;
                                        } else {
                                            curList[j - 1]._hideSubmenu(false, e);
                                        }
                                    }
                                }
                            }
                        }
                        menu.activate(e, self);
                    }
                    menu.select(e);
                    if(link.attr("href") === "#") {
                        e.preventDefault();
                    }
                }).bind("focusin.wijmenuEvent", function (e) {
                    itemDisabled = link.hasAllClasses(o.wijCSS.stateDisabled);
                    if(o.disabled || itemDisabled) {
                        return;
                    }
                    if(link.is("a")) {
                        menu.activate(e, self);
                    }
                });
                $.each(self.getItems(), function () {
                    this._flyout();
                });
            };
            wijmenuitem.prototype._hideSubmenu = function (hideImmediately, e) {
                var self = this, menu = self._getMenu(), o = menu.options, animations = wijmenu.animations, animationOptions, hideAnimation, list, sublist = self._getSublist(), link = self._getLink(), frame = $.browser.msie ? self.element.children("iframe.bgiframe") : null, frameAnimationOptions;
                if(!link.data("subMenuOpened")) {
                    return;
                }
                if(!menu._trigger("hidding", e, self)) {
                    return;
                }
                if(link.is("." + o.wijCSS.wijmenuLink)) {
                    link.data("subMenuOpened", false);
                    link.removeClass(o.wijCSS.stateActive);
                }
                if($.fn.wijhide && hideImmediately !== true) {
                    animationOptions = {
                        context: sublist,
                        show: false
                    };
                    hideAnimation = $.extend({
                    }, o.animation, o.hideAnimation);
                    sublist.wijhide(hideAnimation, animations, animationOptions, null, function () {
                        menu._setZindex(sublist, null);
                        sublist.attr("aria-hidden", true);
                        if($.browser.msie) {
                            frame.remove();
                        }
                        menu._trigger("hidden", e, self);
                    });
                } else {
                    sublist.hide({
                        "complete": function () {
                            if($.browser.msie) {
                                frame.remove();
                            }
                        }
                    }).attr("aria-hidden", true);
                    menu._setZindex(sublist, null);
                    menu._trigger("hidden", e, self);
                }
                //menu.element.data("shown", false);
                list = menu._currentMenuList;
                if(list) {
                    list = $.makeArray($.map(list, function (n) {
                        return n && (n === self) ? null : n;
                    }));
                    menu._currentMenuList = $.makeArray(list);
                }
            };
            wijmenuitem.prototype._displaySubmenu = function (e, callback) {
                var self = this, menu = self._getMenu(), o = menu.options, animationOptions, direction, showAnimation, animations = wijmenu.animations, haveNoVisibleChild, link = self._getLink(), sublist = self._getSublist(), frame, frameAnimationOptions;
                // add iframe for preventing the submenu display behind the OCX control
                if($.browser.msie) {
                    frame = self.element.children('iframe.bgiframe');
                    if(frame.length === 0) {
                        frame = $('<iframe class="bgiframe" frameborder="0" tabindex="-1" src="javascript: false;" style="display:none;position:absolute;z-index:-1;top:0px;left:0px;opacity:0;" />');
                        self.element.append(frame);
                    }
                }
                //modified for supporting displayVisible in li
                haveNoVisibleChild = !wijmenu._hasVisibleSubMenus(self);
                if(sublist.is(":visible") || haveNoVisibleChild) {
                    return;
                }
                if(!menu._trigger("showing", e, self)) {
                    return;
                }
                //menu._trigger("showing", e, self);
                if(link.is("a." + o.wijCSS.wijmenuLink)) {
                    link.data("subMenuOpened", true);
                }
                sublist.show();
                self._setMenuItemPosition();
                if($.browser.msie) {
                    self._setIframeBounds(sublist, frame);
                }
                menu.nowIndex++;
                menu._setZindex(sublist, menu.nowIndex);
                sublist.hide();
                animationOptions = {
                    context: sublist,
                    show: true
                };
                direction = o.direction === "rtl" ? "right" : "left";
                if(o.orientation === "horizontal") {
                    if(self._isRoot()) {
                        direction = "up";
                    }
                }
                if($.browser.msie) {
                    frame.css("display", "");
                }
                showAnimation = $.extend({
                }, {
                    option: {
                        direction: direction
                    }
                }, o.animation, o.showAnimation);
                wijmenu._animateFlyoutMenu(showAnimation, animationOptions, function () {
                    //fix for tfs issue 20975
                    if(sublist.is(":hidden")) {
                        self._hideSubmenu(true, e);
                    }
                    //add the event 'shown'
                    menu._trigger("shown", e, self);
                    if(callback) {
                        callback();
                    }
                });
                menu._isClickToOpen = o.triggerEvent === "click";
                if(menu._currentMenuList === undefined) {
                    menu._currentMenuList = [];
                }
                menu._currentMenuList.push(self);
            };
            wijmenuitem.prototype._setMenuItemPosition = function () {
                var self = this, sublist = self._getSublist(), pOption = self._getMenuItemPosition(), obj = {
                    of: this._getLink()
                };
                sublist.css({
                    left: '0',
                    top: '0',
                    position: 'absolute'
                });
                sublist.position($.extend(obj, pOption));
            };
            wijmenuitem.prototype._getMenuItemPosition = function () {
                var self = this, menu = this._getMenu(), o = menu.options, direction = o.direction, pOption = direction === "rtl" ? {
                    my: 'right top',
                    at: 'left top'
                } : {
                    my: 'left top',
                    at: 'right top'
                };
                //If the menu's orientation is horizontal,
                //set the first level submenu's position to horizontal.
                if(o.orientation === "horizontal") {
                    if(self._isRoot()) {
                        pOption = direction === "rtl" ? {
                            my: 'right top',
                            at: 'right bottom'
                        } : {
                            my: 'left top',
                            at: 'left bottom'
                        };
                    }
                }
                pOption = $.extend(pOption, o.position);
                return pOption;
            };
            wijmenuitem.prototype._getChildren = function () {
                return this._getSublist().children('li');//.filter('li');
                
            };
            wijmenuitem.prototype._setDrilldownUlStyle = function () {
                var self = this, o = self.options, sublist = self._getSublist(), menu = self._getMenu(), width = menu.domObject.menucontainer.width();
                if(menu.options.direction === "rtl") {
                    sublist.css({
                        width: width,
                        left: -width
                    });
                } else {
                    sublist.css({
                        width: width,
                        left: width
                    });
                }
                sublist.addClass(o.wijCSS.content);
                $.each(self.getItems(), function (i, n) {
                    if(n.getItems().length) {
                        this._setDrilldownUlStyle();
                    }
                });
            };
            wijmenuitem.prototype._getMenu = function () {
                var self = this, result = self._menu, parent, tmp;
                //if result is empty, get menu object from parent until body
                if(!result) {
                    parent = self.element.parent();
                    while(!parent.is('body') && parent.length > 0) {
                        //tmp = parent.data($.wijmo.wijmenu._menuWidgetName);
                        tmp = parent.data("wijmomenu");
                        if(tmp) {
                            //result = tmp;
                            result = parent.data(tmp);
                            self._menu = result;
                            return result;
                        }
                        parent = parent.parent();
                    }
                    //if cannot find menu, throw an exception
                    throw 'An menuitem must be a child of menu';
                }
                return result;
            };
            wijmenuitem.prototype.getParent = function () {
                /// <summary>
                /// Gets the parent of the current item,
                /// the method will return null when current item is a top item
                /// </summary>
                                var self = this, ele = self.element, menu, result, parent;
                result = self._parent;
                if(result !== undefined) {
                    return result;
                }
                menu = self._getMenu();
                //find an parent li which contains cache 'wijmenuitem'
                parent = ele.parent().closest('li', menu.element[0]);
                if(parent.length > 0) {
                    result = wijmenu._getItemWidget(parent);
                    if(result !== undefined) {
                        self._parent = result;
                        return result;
                    }
                }
                // menu = self._getMenu();
                //the element at the top level
                if(menu._getSublist().get(0) === ele.parent().get(0)) {
                    self._parent = null;
                    return null;
                }
                throw 'An menuitem must be a child of menu or another menuitem';
            };
            wijmenuitem.prototype._getParentOrMenu = function () {
                return this.getParent() || this._getMenu();
            };
            wijmenuitem.prototype._getField = function (key) {
                return this.element.data(key);
            };
            wijmenuitem.prototype._setField = function (key, value) {
                return this.element.data(key, value);
            };
            wijmenuitem.prototype._innerDestroy = function (invokedByParent) {
                var self = this, o = self.options, item = self.element, link, items = self.getItems(), i = items.length - 1;
                //remove all classses of li
                item.removeClass(o.wijCSS.widget).removeClass(o.wijCSS.wijmenuItem).removeClass(o.wijCSS.stateDefault).removeClass(o.wijCSS.cornerAll).removeClass(o.wijCSS.wijmenuParent).removeClass(o.wijCSS.header).removeClass(o.wijCSS.wijmenuSeparator);
                link = item.children("." + o.wijCSS.wijmenuLink);
                link.removeClass(o.wijCSS.wijmenuLink).removeClass(o.wijCSS.cornerAll).removeClass(o.wijCSS.stateFocus).removeClass(o.wijCSS.stateHover).removeClass(o.wijCSS.stateActive).html(link.children("." + o.wijCSS.wijmenuText).html()).unbind(".wijmenuitem").unbind(".wijmenuEvent");
                item.children("ul").removeClass(o.wijCSS.wijmenuList).removeClass(o.wijCSS.content).removeClass(o.wijCSS.cornerAll).removeClass(o.wijCSS.helperClearFix).removeClass(o.wijCSS.wijmenuChild).removeClass(o.wijCSS.helperReset).attr("role", "").attr("aria-activedescendant", "").show().css({
                    left: "",
                    top: "",
                    position: ""
                }).attr("hidden", "");
                //add by chandler
                item.removeAttr("role");
                link.removeAttr("aria-haspopup");
                //if is not invoked recursively from parent,
                //which means there must remove self from parent._items
                if(!invokedByParent) {
                    self._removeFromParentCollection();
                }
                item.removeData('menu').removeData('parent');
                if(item.children('iframe.bgiframe').length !== 0) {
                    item.children('iframe.bgiframe').remove();
                }
                //destroy child menus recursively
                //$.each(self.getItems() || [], function (i, n) {
                //	n.destroy(true);
                //});
                for(; i >= 0; i--) {
                    items[i].destroy(true);
                }
                self._items.length = 0;
                self._resetMarkupValue();
            };
            wijmenuitem.prototype.destroy = function (invokedByParent) {
                /// <summary>
                /// The destroy() method removes the wijmenu functionality completely
                /// and returns the element back to its pre-init state.
                /// </summary>
                var self = this;
                self._innerDestroy(invokedByParent);
                //end for disabled option
                _super.prototype.destroy.call(this);
            };
            wijmenuitem.prototype._getFirstSelectableSubItem = function () {
                return wijmenu._getFirstSelectableSubItem(this);
            };
            wijmenuitem.prototype._getLastSelectableSubItem = function () {
                return wijmenu._getLastSelectableSubItem(this);
            };
            wijmenuitem.prototype.next = function () {
                ///<summary>
                /// Gets the next selectable item. The first item will be selected
                /// if none is active or the last one is active.
                /// return null if none is selectable in next.
                ///</summary>
                                var self = this, items = self._getParentOrMenu().getItems(), i, o, indexOfItem = $.inArray(self, items);
                if(indexOfItem === -1) {
                    throw 'cannot find item from the parent collection';
                }
                for(i = indexOfItem + 1; i < items.length; i++) {
                    o = items[i].options;
                    if(o.displayVisible !== false && !o.header && !o.separator) {
                        return items[i].element;
                    }
                }
                return null;
            };
            wijmenuitem.prototype.previous = function () {
                ///<summary>
                /// Get the previous selectable item.
                /// It selects the last item if none is active or the first one is active.
                /// It returns null if no previous item is selectable.
                ///</summary>
                /// Code Example:
                /// $(".selector").wijmenu("previous");
                                var self = this, items = self._getParentOrMenu().getItems(), i, o, indexOfItem = $.inArray(self, items);
                if(indexOfItem === -1) {
                    throw 'cannot find item from the parent collection';
                }
                for(i = indexOfItem - 1; i >= 0; i--) {
                    o = items[i].options;
                    if(o.displayVisible !== false && !o.header && !o.separator) {
                        return items[i].element;
                    }
                }
                return null;
            };
            wijmenuitem.prototype._removeFromParentCollection = function () {
                var self = this, parent, deleteFromMenu = false, indexOfSelf;
                parent = self.getParent();
                if(parent === null) {
                    parent = self._getMenu();
                    deleteFromMenu = true;
                }
                indexOfSelf = $.inArray(self, parent.getItems());
                if(indexOfSelf === -1) {
                    return;
                }
                //remove self from parent.getItems()
                wijmenu._changeCollection(indexOfSelf, parent.getItems(), parent.options.items, null);
                if(parent.getItems().length === 0) {
                    if(!deleteFromMenu) {
                        parent._setSubmenuIcon(false);
                        parent._resetMarkupValue();
                    }
                    parent.element.children('ul').remove();
                }
            };
            wijmenuitem.prototype._resetMarkupValue = function () {
                this._sublist = null;
                this._link = null;
            };
            wijmenuitem.prototype._hideCurrentSubmenu = function (e) {
                var self = this, subList = self._getSublist();
                if(subList.length === 0) {
                    return;
                }
                if(!subList.data("notClose")) {
                    self._hideSubmenu(false, e);
                }
                $.each(self.getItems(), function () {
                    this._hideCurrentSubmenu(e);
                });
            };
            wijmenuitem.prototype._showFlyoutSubmenu = function (e, callback) {
                var self = this, menu = this._getMenu(), curList = menu._currentMenuList, i;
                if(curList !== undefined) {
                    for(i = curList.length; i > 0; i--) {
                        if(curList[i - 1] === self.getParent()) {
                            break;
                        } else {
                            curList[i - 1]._hideSubmenu(false, e);
                        }
                    }
                }
                self._displaySubmenu(e, callback);
            };
            wijmenuitem.prototype.getItems = function () {
                ///<summary>
                /// Gets the collection of child items.
                ///</summary>
                return this._items;
            };
            wijmenuitem.prototype._getSublist = function () {
                var self = this;
                if(!self._sublist) {
                    self._sublist = this.element.children('ul:first');
                }
                return self._sublist;
            };
            wijmenuitem.prototype._getLink = function () {
                var self = this;
                if(!self._link) {
                    self._link = this.element.children(':first');
                }
                return self._link;
            };
            wijmenuitem.prototype._isRoot = function () {
                return this.getParent() === null;
            };
            wijmenuitem.prototype.add = /** Adds a child menuItem to the menuItem.*/
            function (menuItem, position) {
                wijmenu._add(this, menuItem, position);
            };
            wijmenuitem.prototype.remove = /** Remove an item from the menu.*/
            function (index) {
                wijmenu._remove(this, index);
            };
            wijmenuitem.prototype._setIframeBounds = /** set the bounds for the frame by the bounds and box-shadow setting of the sub menu */
            function (sublist, frame) {
                var self = this, sublistShadowBox, leftOffset = 0, rightOffset = 0, topOffset = 0, bottomeOffset = 0, shadowRadius, shadowBlurRadius, yOffset, xOffSet, arrayLength, browser = $.browser;
                if(!browser.msie) {
                    return;
                }
                if(!(browser.msie && parseFloat($.browser.version) < 9)) {
                    sublistShadowBox = sublist.css("box-shadow").split(' ');
                    arrayLength = sublistShadowBox.length;
                    if(arrayLength > 1) {
                        if(browser.msie && arrayLength < 4) {
                            shadowRadius = 0;
                        } else {
                            shadowRadius = self._parsePxToNumber(browser.msie ? sublistShadowBox[3] : sublistShadowBox[arrayLength - 1]);
                        }
                        if(browser.msie && arrayLength < 3) {
                            shadowBlurRadius = 0;
                        } else {
                            shadowBlurRadius = 0.3 * self._parsePxToNumber(browser.msie ? sublistShadowBox[2] : sublistShadowBox[arrayLength - 2]);
                        }
                        yOffset = self._parsePxToNumber(browser.msie ? sublistShadowBox[1] : sublistShadowBox[arrayLength - 3]);
                        xOffSet = self._parsePxToNumber(browser.msie ? sublistShadowBox[0] : sublistShadowBox[arrayLength - 4]);
                        leftOffset = shadowBlurRadius + shadowRadius - xOffSet;
                        leftOffset = leftOffset >= 0 ? leftOffset : 0;
                        rightOffset = shadowBlurRadius + shadowRadius + xOffSet;
                        rightOffset = rightOffset >= 0 ? rightOffset : 0;
                        topOffset = shadowBlurRadius + shadowRadius - yOffset;
                        topOffset = topOffset >= 0 ? topOffset : 0;
                        bottomeOffset = shadowBlurRadius + shadowRadius + yOffset;
                        bottomeOffset = bottomeOffset >= 0 ? bottomeOffset : 0;
                    }
                }
                frame.css({
                    'width': sublist.outerWidth(true) + leftOffset + rightOffset + 'px',
                    'height': sublist.outerHeight(true) + topOffset + bottomeOffset + 'px',
                    'left': self._parsePxToNumber(sublist.css("left")) - leftOffset + 'px',
                    'top': self._parsePxToNumber(sublist.css("top")) - topOffset + 'px'
                });
            };
            wijmenuitem.prototype._parsePxToNumber = /** Parse string setting to number */
            function (px) {
                var pxIndex = px.indexOf("px");
                if(!pxIndex || pxIndex === -1) {
                    return 0;
                } else {
                    return parseFloat(px.substr(0, pxIndex));
                }
            };
            return wijmenuitem;
        })(wijmo.wijmoWidget);
        menu.wijmenuitem = wijmenuitem;        
        //#region menuitem options
        wijmenuitem.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, {
            initSelector: /** Selector option for auto self initialization.*/
            ":jqmData(role='wijmenuitem')",
            wijCSS: /** wijmenu css, extend from $.wijmo.wijCSS.*/
            {
                wijmenuitemIcon: "wijmenuitem-icon",
                wijmenuParent: "wijmo-wijmenu-parent",
                wijmenuLink: "wijmo-wijmenu-link",
                wijmenuText: "wijmo-wijmenu-text",
                wijmenuList: "wijmo-wijmenu-list",
                wijmenuItem: "wijmo-wijmenu-item",
                wijmenuSeparator: "wijmo-wijmenu-separator",
                wijmenuIconLeft: "wijmo-wijmenu-icon-left",
                wijmenuIconRight: "wijmo-wijmenu-icon-right",
                wijmenuChild: "wijmo-wijmenu-child",
                wijmenuSeparatorContent: "wijmo-wijmenu-separator-content"
            },
            wijMobileCSS: {
                header: "ui-header ui-bar-c",
                content: "ui-body ui-body-c",
                stateDefault: "ui-btn-up-c",
                stateHover: "ui-btn-down-c",
                stateActive: "ui-btn-down-c"
            },
            header: /** A value that determines whether the menu item is a header item.*/
            false,
            separator: /** A value that determines whether the item is a separator.*/
            false,
            value: /** Sets the menuItem's value.*/
            '',
            text: /** Sets the node's text.*/
            "",
            navigateUrl: /** The menuItem's navigate url.*/
            '',
            target: /** Gets or sets the target of the link item.*/
            '',
            iconClass: /** Gets or sets the icon css class to the menuitem.*/
            '',
            imagePosition: /** Gets or sets which side, left or right, the image will
            * be rendered from the menu item.
            */
            '',
            displayVisible: /** A value that indicates whether to show the menu.*/
            true,
            selected: /** A value that determines whether  the item has beend selected.*/
            false,
            items: /** The options of child items.*/
            null
        });
        //#endregion
        $.wijmo.registerWidget(widgetName, wijmenu.prototype);
        $.widget("wijmo.wijmenuitem", $.wijmo.widget, wijmenuitem.prototype);
    })(wijmo.menu || (wijmo.menu = {}));
    var menu = wijmo.menu;
})(wijmo || (wijmo = {}));
