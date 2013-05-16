/*
 *
 * Wijmo Library 3.20131.4
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
/// <reference path="../Base/jquery.wijmo.widget.ts" />
/// <reference path="../wijsuperpanel/jquery.wijmo.wijsuperpanel.ts" />
/*globals jQuery,document,window*/
/*
* Depends:
*	jquery.js
*	jquery.ui.js
*	jquery.mousewheel.js
*	jquery.bgiframe.js
*	jquery.wijmo.wijsuperpanel.js

*
*/
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery, widgetName = "wijdropdown";
    var wijdropdown = (function (_super) {
        __extends(wijdropdown, _super);
        function wijdropdown() {
            _super.apply(this, arguments);

        }
        wijdropdown.prototype._setOption = function (key, value) {
            var self = this, wijCSS = self.options.wijCSS;
            _super.prototype._setOption.call(this, key, value);
            if(key === "disabled") {
                self._labelWrap.toggleClass(wijCSS.stateDisabled, value);
                self._label.toggleClass(wijCSS.stateDisabled, value);
                self.element.attr("disabled", value ? "disabled" : "");
            }
        };
        wijdropdown.prototype._create = function () {
            var self = this, ele = self.element;
            // enable touch support:
            if(window.wijmoApplyWijTouchUtilEvents) {
                $ = window.wijmoApplyWijTouchUtilEvents($);
            }
            if(ele.get(0).tagName.toLowerCase() !== "select") {
                return;
            }
            if(ele.is(":visible")) {
                self._activeItem = null;
                self._createSelect();
                self._bindEvents();
                self.needInit = false;
            } else {
                self.needInit = true;
            }
            //update for visibility change
            if(self.element.is(":hidden") && self.element.wijAddVisibilityObserver) {
                self.element.wijAddVisibilityObserver(function () {
                    self.refresh();
                    if(self.element.wijRemoveVisibilityObserver) {
                        self.element.wijRemoveVisibilityObserver();
                    }
                }, "wijdropdown");
            }
        };
        wijdropdown.prototype._createSelect = function () {
            var self = this, o = self.options, wijCSS = self.options.wijCSS, ele = self.element,
                width = ele.outerWidth(), // @todo : Fixed Novius OS
                eleWidth = width, selectWrap = //height = ele.height(),
            ele.wrap("<div></div>").parent().addClass(wijCSS.helperHidden), container = selectWrap.wrap("<div></div>").parent().attr("role", "select").addClass(wijCSS.wijdropdown).addClass(wijCSS.widget).addClass(//ui-widwijmo-wijdropdownt-content
            wijCSS.stateDefault).addClass(wijCSS.cornerAll).addClass(wijCSS.helperClearFix), label = $("<label></label>").addClass(wijCSS.wijdropdownLabel).addClass(wijCSS.cornerAll).attr("id", ele.get(0).id + "_select").attr("name", ele.attr("name") || ""), rightTrigger = $("<div></div>").addClass(wijCSS.wijdropdownTrigger).addClass(wijCSS.stateDefault).addClass(wijCSS.cornerRight), labelWrap = $("<a href=\"#\"></a>"), listContainer = $("<div>").addClass(wijCSS.wijmodropdown), list = $("<ul></ul>").addClass(wijCSS.wijdropdownList).addClass(wijCSS.content).addClass(wijCSS.widget).addClass(wijCSS.cornerAll).addClass(wijCSS.helperReset).appendTo(listContainer);
            $("<span></span>").addClass(wijCSS.icon).addClass(wijCSS.iconArrowDown).appendTo(rightTrigger);
            width = Math.max(width, container.width());
            if(ele.get(0).tabIndex !== "") {
                labelWrap.attr("tabindex", ele.attr("tabindex"));
            }
            if(ele.get(0).disabled !== false) {
                self.options.disabled = true;
            }
            if(self.options.disabled) {
                labelWrap.addClass(wijCSS.stateDisabled);
                label.addClass(wijCSS.stateDisabled);
            }
            labelWrap.append(label);
            container.append(selectWrap).append(labelWrap).append(rightTrigger);
            if(o.ensureDropDownOnBody) {
                listContainer.wrap($("<div></div>").addClass(wijCSS.wijdropdown)).parent().appendTo("body").css("position", "absolute");
            } else {
                container.append(listContainer);
            }
            eleWidth += parseInt(label.css("padding-left").replace(/px/, ""), 10);
            eleWidth += parseInt(label.css("padding-right").replace(/px/, ""), 10);
            eleWidth -= 16;
            container.width(eleWidth);
            self._buildList(list, listContainer, eleWidth);
            self._rightTrigger = rightTrigger;
            self._label = label;
            self._listContainer = listContainer;
            self._list = list;
            self._value = ele.val();
            //self._selectedIndex = ele.find("option:selected").index();
            self._selectedIndex = $('option', ele).index(ele.find("option:selected"));
            self._selectWrap = selectWrap;
            self._labelWrap = labelWrap;
            self._container = container;
            //update for fixed tooltip can't take effect
            container.attr("title", ele.attr("title"));
            ele.removeAttr("title");
        };
        wijdropdown.prototype._buildList = function (list, listContainer, eleWidth) {
            var self = this, wijCSS = self.options.wijCSS, ele = self.element, height;
            listContainer.show();
            ele.children().each(function (i, n) {
                var item = $(n), group, groupText, goupItems;
                if(item.is("option")) {
                    list.append(self._buildItem(item));
                } else {
                    group = $("<li></li>").addClass(wijCSS.wijdropdownOptgroup);
                    groupText = $("<span>" + item.attr("label") + "</span>").addClass(wijCSS.wijdropdownOptgroupHeader).addClass(wijCSS.priorityPrimary);
                    goupItems = $("<ul></ul>").addClass(wijCSS.helperReset).addClass(wijCSS.wijdropdownItems);
                    item.children("option").each(function () {
                        goupItems.append(self._buildItem($(this)));
                        return this;
                    });
                    group.append(groupText).append(goupItems);
                    list.append(group);
                }
                return this;
            });
            //update for fixing height setting is incorrect when
            //execute refresh at 2011/11/30
            listContainer.height("");
            //end for height setting
            height = listContainer.height();
            height = list.outerHeight() < height ? list.outerHeight() : height;
            listContainer.css({
                height: height,
                width: eleWidth
            });
            //update for fixing can't show all dropdown items by wuhao at 2012/2/24
            //fixed the bug 30486
            //list.setOutWidth(list.parent().parent().innerWidth() - 18);
            if($.browser.msie && /^[8]\.[0-9]+/.test($.browser.version)) {
                //list.setOutWidth(list.parent().parent().innerWidth() - 19);
                list.setOutWidth(eleWidth - 19);
            } else {
                //list.setOutWidth(list.parent().parent().innerWidth() - 18);
                list.setOutWidth(eleWidth - 18);
            }
            //end for issue
            if(listContainer.data("wijmoWijsuperpanel")) {
                listContainer.wijsuperpanel("paintPanel");
                self.superpanel = listContainer.data("wijmoWijsuperpanel");
            } else {
                self.superpanel = listContainer.wijsuperpanel().data("wijmoWijsuperpanel");
            }
            if($.fn.bgiframe) {
                self.superpanel.element.bgiframe();
            }
            //update for fixing can't show all dropdown items by wuhao at 2012/2/24
            //list.setOutWidth(list.parent().parent().innerWidth());
            if(!self.superpanel.vNeedScrollBar) {
                //fixed the bug 30486
                if($.browser.msie && /^[8]\.[0-9]+/.test($.browser.version)) {
                    //list.setOutWidth(list.parent().parent().innerWidth() - 1);
                    list.setOutWidth(eleWidth - 1);
                } else {
                    //list.setOutWidth(list.parent().parent().innerWidth());
                    list.setOutWidth(eleWidth);
                }
                self.superpanel.refresh();
            }
            //end for issue
            listContainer.hide();
        };
        wijdropdown.prototype._handelEvents = function (ele) {
            var self = this, wijCSS = self.options.wijCSS, namespace = "." + self.widgetName, element = self.element;
            ele.bind("click" + namespace, function (e) {
                if(self.options.disabled) {
                    return;
                }
                if(self._listContainer.is(":hidden")) {
                    self._show();
                } else {
                    self._hide();
                }
                element.click();
                if(ele.get(0) === self._label.get(0)) {
                    e.preventDefault();
                } else {
                    self._labelWrap.focus();
                    // Novius OS : add preventDefault, when click on rightTrigger in a dropdown which is in a popup, list open and close
                    e.preventDefault();
                }
            }).bind("mouseover" + namespace, function () {
                if(self.options.disabled) {
                    return;
                }
                self._label.addClass(wijCSS.stateHover);
                self._rightTrigger.addClass(wijCSS.stateHover);
                element.trigger('mouseover');
            }).bind("mouseout" + namespace, function () {
                if(self.options.disabled) {
                    return;
                }
                self._label.removeClass(wijCSS.stateHover);
                self._rightTrigger.removeClass(wijCSS.stateHover);
                element.trigger('mouseout');
            }).bind("mousedown" + namespace, function () {
                if(self.options.disabled) {
                    return;
                }
                self._label.addClass(wijCSS.stateActive);
                self._rightTrigger.addClass(wijCSS.stateActive);
                element.trigger('mousedown');
            }).bind("mouseup" + namespace, function () {
                if(self.options.disabled) {
                    return;
                }
                self._label.removeClass(wijCSS.stateActive);
                self._rightTrigger.removeClass(wijCSS.stateActive);
                element.trigger('mouseup');
            });
        };
        wijdropdown.prototype._bindEvents = function () {
            var self = this, wijCSS = self.options.wijCSS, namespace = "." + self.widgetName, label = self._label, rightTrigger = self._rightTrigger, labelWrap = self._labelWrap, listContainer = self._listContainer, ele = self.element, ischrome = false, offset;
            self._handelEvents(self._label);
            self._handelEvents(self._rightTrigger);
            $(window).bind("resize", function (e) {
                self._setListContainerPosition();
            }) , $(document).bind("mouseup" + namespace, function (e) {
                if(listContainer.is(":hidden")) {
                    label.removeClass(wijCSS.stateFocus);
                    rightTrigger.removeClass(wijCSS.stateFocus);
                    return;
                }
                offset = listContainer.offset();
                if(e.target === label.get(0) || e.target === rightTrigger.get(0) || e.target === rightTrigger.children().get(0)) {
                    return;
                }
                if(e.pageX < offset.left || e.pageX > offset.left + listContainer.width() || e.pageY < offset.top || e.pageY > offset.top + listContainer.height()) {
                    label.removeClass(wijCSS.stateFocus);
                    rightTrigger.removeClass(wijCSS.stateFocus);
                    self._hide();
                }
            });
            listContainer.bind("click" + namespace, function (e) {
                var target = $(e.target);
                if(target.closest("li." + wijCSS.wijdropdownItem, $(this).get(0)).length > 0) {
                    self._setValue();
                    listContainer.css("z-index", "");
                    if($.browser.msie && /^[6,7].[0-9]+/.test($.browser.version)) {
                        listContainer.parent().css("z-index", "");
                    }
                    listContainer.hide();
                    self._setValueToEle();
                    //self.oldVal = ele.val();
                    //ele.val(self._value);
                    //if (self.oldVal !== self._value) {
                    //	ele.trigger("change");
                    //}
                                    }
                ele.click();
            });
            labelWrap.bind("keydown" + namespace, function (e) {
                if(self.options.disabled) {
                    return;
                }
                var keyCode = $.ui.keyCode;
                switch(e.which) {
                    case keyCode.UP:
                    case keyCode.LEFT:
                        self._previous();
                        self._setValue();
                        //update for issue that can't get value with keydown
                        //by wh at 2012/1/19
                        self._setValueToEle();
                        //end for issue about keydown
                        break;
                    case keyCode.DOWN:
                    case keyCode.RIGHT:
                        self._next();
                        self._setValue();
                        //update for issue that can't get value with keydown
                        //by wh at 2012/1/19
                        self._setValueToEle();
                        //end for issue about keydown
                        break;
                    case keyCode.PAGE_DOWN:
                        self._nextPage();
                        self._setValue();
                        //update for issue that can't get value with keydown
                        //by wh at 2012/1/19
                        self._setValueToEle();
                        //end for issue about keydown
                        break;
                    case keyCode.PAGE_UP:
                        self._previousPage();
                        self._setValue();
                        //update for issue that can't get value with keydown
                        //by wh at 2012/1/19
                        self._setValueToEle();
                        //end for issue about keydown
                        break;
                    case keyCode.ENTER:
                    case keyCode.NUMPAD_ENTER:
                        self._setValue();
                        self._listContainer.hide();
                        //update for issue that can't get value with keydown
                        //by wh at 2012/1/19
                        self._setValueToEle();
                        //end for issue about keydown
                        break;
                }
                if(e.which !== keyCode.TAB) {
                    e.preventDefault();
                }
                ele.trigger('keydown');
            }).bind("focus" + namespace, function () {
                if(self.options.disabled) {
                    return;
                }
                label.addClass(wijCSS.stateFocus);
                rightTrigger.addClass(wijCSS.stateFocus);
                ele.focus();
            }).bind("blur" + namespace, function () {
                if(self.options.disabled) {
                    return;
                }
                label.removeClass(wijCSS.stateFocus);
                rightTrigger.removeClass(wijCSS.stateFocus);
                ele.trigger('blur');
            }).bind("keypress" + namespace, function () {
                if(self.options.disabled) {
                    return;
                }
                ele.trigger('keypress');
            }).bind("keyup" + namespace, function () {
                if(self.options.disabled) {
                    return;
                }
                ele.trigger('keyup');
            });
            ischrome = /chrome/.test(navigator.userAgent.toLowerCase());
            if(ischrome || $.browser.safari) {
                labelWrap.bind("click" + namespace, function () {
                    labelWrap.focus();
                });
                rightTrigger.bind("mouseout" + namespace, function () {
                    if(self.options.disabled) {
                        return;
                    }
                    label.removeClass(wijCSS.stateFocus);
                    rightTrigger.removeClass(wijCSS.stateFocus);
                });
            }
        };
        wijdropdown.prototype._setListContainerPosition = function () {
            var self = this, o = self.options, _offset;
            if(!o.ensureDropDownOnBody) {
                return;
            }
            _offset = self._container.offset();
            self._listContainer.parent().offset({
                left: _offset.left,
                top: _offset.top + self._container.outerHeight()
            });
        };
        wijdropdown.prototype._init = function () {
            var self = this;
            self._initActiveItem();
            if(self._activeItem) {
                self._label.text(self._activeItem.text());
            }
        };
        wijdropdown.prototype._buildItem = function ($item) {
            var val = $item.val(), text = $item.text(), self = this, wijCSS = self.options.wijCSS, $li;
            if(text === "") {
                text = "&nbsp;";
            }
            $li = $("<li></li>").addClass(wijCSS.wijdropdownItem).addClass(wijCSS.cornerAll).append($("<span>" + text + "</span>")).mousemove(function (event) {
                var current = $(event.target).closest("." + wijCSS.wijdropdownItem);
                if(current !== this.last) {
                    self._activate($(this));
                }
                this.last = $(event.target).closest("." + wijCSS.wijdropdownItem);
            }).attr("role", "option");
            $li.data("value", val);
            return $li;
        };
        wijdropdown.prototype._show = function () {
            var self = this, listContainer = self._listContainer, showingAnimation = self.options.showingAnimation;
            self._setListContainerPosition();
            listContainer.css("z-index", "100000");
            if($.browser.msie && /^[6,7]\.[0-9]+/.test($.browser.version)) {
                listContainer.parent().css("z-index", "99999");
            }
            if(showingAnimation) {
                //update for fixing 20652 issue by wh at 2012/3/19
                //listContainer.stop().show(
                listContainer.show(//end for fixing issue 20652
                showingAnimation.effect, showingAnimation.options, showingAnimation.speed, function () {
                    self._initActiveItem();
                });
            } else {
                listContainer.show();
            }
        };
        wijdropdown.prototype._hide = function () {
            var self = this, listContainer = self._listContainer, hidingAnimation = self.options.hidingAnimation;
            if(listContainer.is(":hidden")) {
                return;
            }
            if(hidingAnimation) {
                //update for fixing 20652 issue by wh at 2012/3/19
                //listContainer.stop(false, true).hide(
                listContainer.hide(//end for fixing issue 20652
                hidingAnimation.effect, hidingAnimation.options, hidingAnimation.speed, function () {
                    if($.isFunction(hidingAnimation.callback)) {
                        hidingAnimation.callback.apply(self, arguments);
                    }
                    if($.browser.msie && /^[6,7]\.[0-9]+/.test($.browser.version)) {
                        listContainer.parent().css("z-index", "");
                    }
                    listContainer.css("z-index", "");
                });
            } else {
                if($.browser.msie && $.browser.version === "6.0") {
                    listContainer.parent().css("z-index", "");
                }
                listContainer.css("z-index", "");
                listContainer.hide();
            }
        };
        wijdropdown.prototype._setValue = function () {
            var self = this, wijCSS = self.options.wijCSS, listContainer = self._listContainer, top, height;
            if(self._activeItem) {
                self._label.text(self._activeItem.text());
                self._value = self._activeItem.data("value");
                //self._selectedIndex = self._activeItem.index();
                self._selectedIndex = $('li.' + wijCSS.wijdropdownItem, listContainer).index(self._activeItem);
                if(self.superpanel.vNeedScrollBar) {
                    top = self._activeItem.offset().top;
                    height = self._activeItem.outerHeight();
                    if(listContainer.offset().top > top) {
                        listContainer.wijsuperpanel("scrollTo", 0, top - self._list.offset().top);
                    } else if(listContainer.offset().top < top + height - listContainer.innerHeight()) {
                        listContainer.wijsuperpanel("scrollTo", 0, top + height - listContainer.height() - self._list.offset().top);
                    }
                }
            }
        };
        wijdropdown.prototype._setValueToEle = function () {
            var self = this, ele = self.element, oldSelectedItem = ele.find(":selected"), oldSelectedIndex = //oldSelectedIndex = oldSelectedItem.index(),
            $('option', ele).index(oldSelectedItem), selectedIndex = self._selectedIndex;
            //self.oldVal = ele.val();
            //ele.val(self._value);
            if(oldSelectedIndex !== selectedIndex) {
                if($.browser.mozilla) {
                    ele.val(self._value);
                }
                oldSelectedItem.removeAttr('selected');
                ele.find("option:eq(" + selectedIndex + ")").attr("selected", true);
                ele.trigger("change");
            }
            //if (self.oldVal !== self._value) {
            //	ele.trigger("change");
            //}
                    };
        wijdropdown.prototype._initActiveItem = function () {
            var self = this, wijCSS = self.options.wijCSS;
            if(self._value !== undefined) {
                if(self._selectedIndex === -1) {
                    self._activate(self._list.find("li." + wijCSS.wijdropdownItem).eq(0));
                    return;
                }
                self._list.find("li." + wijCSS.wijdropdownItem).each(function (idx) {
                    if(idx === self._selectedIndex) {
                        self._activate($(this));
                        return false;
                    }
                    //if ($(this).data("value") === self._value) {
                    //	self._activate($(this));
                    //}
                                    });
            }
        };
        wijdropdown.prototype._activate = function (item) {
            var self = this, wijCSS = self.options.wijCSS;
            self._deactivate();
            self._activeItem = item;
            self._activeItem.addClass(wijCSS.stateHover).attr("aria-selected", true);
        };
        wijdropdown.prototype._deactivate = function () {
            var self = this, wijCSS = self.options.wijCSS;
            if(self._activeItem) {
                self._activeItem.removeClass(wijCSS.stateHover).attr("aria-selected", false);
            }
        };
        wijdropdown.prototype._next = function () {
            this._move("next", "first");
        };
        wijdropdown.prototype._previous = function () {
            this._move("prev", "last");
        };
        wijdropdown.prototype._nextPage = function () {
            this._movePage("first");
        };
        wijdropdown.prototype._previousPage = function () {
            this._movePage("last");
        };
        wijdropdown.prototype.refresh = function () {
            ///	<summary>
            ///	Use the refresh method to set the drop-down element's style.
            /// Code Example: $(".selector").wijdropdown("refresh");
            ///	</summary>
                        var self = this, wijCSS = self.options.wijCSS, ele = self.element, containerWidth;
            if(self.needInit) {
                if(self.element.is(":visible")) {
                    self._activeItem = null;
                    self._createSelect();
                    self._bindEvents();
                    self._init();
                    self.needInit = false;
                }
            } else {
                if(!self._list) {
                    return;
                }
                self._listContainer.show();
                //update for fixing width settings is wrong when
                //execute refresh method at 2011/11/30
                //containerWidth = self._listContainer.width();
                self._selectWrap.removeClass(wijCSS.helperHidden);
                containerWidth = self.element.outerWidth(); // @todo : Fixed Novius OS
                containerWidth += parseInt(self._label.css("padding-left").replace(/px/, ""), 10);
                containerWidth += parseInt(self._label.css("padding-right").replace(/px/, ""), 10);
                containerWidth -= 16;
                self._container.width(containerWidth);
                self._selectWrap.addClass(wijCSS.helperHidden);
                //end for fixing width settings at 2011/11/30
                self._list.empty();
                self._buildList(self._list, self._listContainer, containerWidth);
                self._value = self.element.val();
                //self._selectedIndex = ele.find("option :selected").index();
                self._selectedIndex = $('option', ele).index(ele.find("option:selected"));
                self._initActiveItem();
                if(self._activeItem) {
                    self._label.text(self._activeItem.text());
                }
            }
        };
        wijdropdown.prototype._move = function (direction, edge) {
            var self = this, wijCSS = self.options.wijCSS, $nextLi, next;
            if(!self._activeItem) {
                self._activate(self._list.find("." + wijCSS.wijdropdownItem + ":" + edge));
                return;
            }
            $nextLi = self._activeItem[direction]().eq(0);
            if($nextLi.length) {
                next = self._getNextItem($nextLi, direction, edge);
            } else if(self._activeItem.closest("." + wijCSS.wijdropdownOptgroup).length) {
                next = self._getNextItem(self._activeItem.closest("." + wijCSS.wijdropdownOptgroup)[direction](), direction, edge);
            }
            if(next && next.length) {
                self._activate(next);
            } else {
                self._activate(self._list.find("." + wijCSS.wijdropdownItem + ":" + edge));
            }
        };
        wijdropdown.prototype._movePage = function (direction) {
            //argu: "first","last"
                        var self = this, wijCSS = self.options.wijCSS, base, height, result, antiDirection = direction === "first" ? "last" : "first";
            if(self.superpanel.vNeedScrollBar) {
                base = self._activeItem.offset().top;
                height = self.options.height;
                result = self._list.find("." + wijCSS.wijdropdownItem).filter(function () {
                    var close = $(this).offset().top - base + (direction === "first" ? -height : height) + $(this).height(), lineheight = $(this).height();
                    return close < lineheight && close > -lineheight;
                });
                if(!result.length) {
                    result = self._list.find("." + wijCSS.wijdropdownItem + ":" + antiDirection);
                }
                self._activate(result);
            } else {
                self._activate(self._list.find("." + wijCSS.wijdropdownItem + ":" + (!self._activeItem ? direction : antiDirection)));
            }
        };
        wijdropdown.prototype._getNextItem = function (next, direction, edge) {
            var wijCSS = this.options.wijCSS;
            if(next.length) {
                if(next.is("." + wijCSS.wijdropdownOptgroup)) {
                    if(!!next.find(">ul>li." + wijCSS.wijdropdownItem).length) {
                        return next.find(">ul>li." + wijCSS.wijdropdownItem + ":" + edge).eq(0);
                    } else {
                        this._getNextItem(next[direction]().eq(0));
                    }
                } else {
                    return next;
                }
            }
        };
        wijdropdown.prototype.destroy = function () {
            ///	<summary>
            ///	Remove the functionality completely. This returns the element to its pre-init state.
            /// Code Example:  $(".selector").wijdropdown("destroy");
            ///	</summary>
                        var self = this, wijCSS = self.options.wijCSS;
            //update for fixed tooltip can't take effect
            this.element.attr("title", this._container.attr("title"));
            /// Remove the functionality completely.
            /// This will return the element back to its pre-init state.
            this.element.closest("." + wijCSS.wijdropdown).find(">div." + wijCSS.wijdropdownTrigger + ",>div." + wijCSS.wijmodropdown + ",>a").remove();
            this._listContainer.remove();
            this.element.unwrap().unwrap().removeData("maxZIndex");
            _super.prototype.destroy.call(this);
        };
        return wijdropdown;
    })(wijmo.wijmoWidget);
    wijmo.wijdropdown = wijdropdown;
    ;
    wijdropdown.prototype.options = $.extend(true, {
    }, wijmo.wijmoWidget.prototype.options, {
        initSelector: /// <summary>
        /// Selector option for auto self initialization.
        ///	This option is internal.
        /// </summary>
        ":jqmData(role='wijdropdown')",
        wijCSS: /// <summary>
        /// wijdropdown css, extend from $.wijmo.wijCSS
        /// </summary>
        {
            wijmodropdown: "wijmo-dropdown",
            wijdropdown: "wijmo-wijdropdown",
            wijdropdownLabel: "wijmo-dropdown-label",
            wijdropdownTrigger: "wijmo-dropdown-trigger",
            wijdropdownList: "wijmo-dropdown-list",
            wijdropdownOptgroup: "wijmo-dropdown-optgroup",
            wijdropdownOptgroupHeader: "wijmo-optgroup-header",
            wijdropdownItems: "wijmo-dropdown-items",
            wijdropdownItem: "wijmo-dropdown-item"
        },
        zIndex: /// <summary>
        /// A value indicates the z-index of wijdropdown.
        /// Default: null.
        /// Type: String.
        /// Code example: $("#tags").wijdropdown("option", "zIndex", 999)
        /// </summary>
        1000,
        showingAnimation: /// <summary>
        /// A value that specifies the animation options for a drop-down list
        /// when it is visible.
        /// Default: null.
        /// Type: Object.
        /// Code example:
        /// var animationOptions = {
        /// animated: "Drop",
        /// duration: 1000
        /// };
        /// $("#tags").wijdropdown("option", "showingAnimation", animationOptions)
        /// </summary>
        {
            effect: "blind"
        },
        hidingAnimation: /// <summary>
        /// A value that specifies the animation options such as the animation effect and
        /// duration for the drop-down list when it is hidden.
        /// Default: null.
        /// Type: Object.
        /// Code example:
        /// var animationOptions = {
        /// animated: "Drop",
        /// duration: 1000
        /// };
        ///$("#tags").wijdropdown("option", "hidingAnimation", animationOptions)
        /// </summary>
        {
            effect: "blind"
        },
        ensureDropDownOnBody: /// <summary>
        /// A value indicating the dropdown element will be append to the body or dropdown container.
        /// If the value is true, the dropdown list will be appended to body element.
        /// else it will append to the dropdown container.
        /// Default: null.
        /// Type: Boolean.
        /// Code example: $("#tags").wijdropdown("option", "ensureDropDownOnBody", false)
        /// </summary>
        false
    });
    $.wijmo.registerWidget(widgetName, wijdropdown.prototype);
})(wijmo || (wijmo = {}));
