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
/*globals window,document,jQuery*/
/*
* Depends:
*  jquery.ui.core.js
*  jquery.ui.mouse.js
*  jquery.ui.widget.js
*  jquery.ui.slider.js
*  jquery.ui.wijutil.js
*
*/
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery, widgetName = "wijslider";
    var JQueryUISlider = (function (_super) {
        __extends(JQueryUISlider, _super);
        function JQueryUISlider() {
            _super.apply(this, arguments);

        }
        JQueryUISlider.prototype._valueMin = function () {
            return $.ui.slider.prototype._valueMin.apply(this, arguments);
        };
        JQueryUISlider.prototype._refreshValue = function () {
            return $.ui.slider.prototype._refreshValue.apply(this, arguments);
        };
        JQueryUISlider.prototype._create = function () {
            return $.ui.slider.prototype._create.apply(this, arguments);
        };
        JQueryUISlider.prototype.values = function (index, val) {
            return $.ui.slider.prototype.values.apply(this, arguments);
        };
        JQueryUISlider.prototype.value = function (val) {
            return $.ui.slider.prototype.value.apply(this, arguments);
        };
        JQueryUISlider.prototype._slide = function (event, index, newValue) {
            return $.ui.slider.prototype._slide.apply(this, arguments);
        };
        JQueryUISlider.prototype._change = function (event, index) {
            return $.ui.slider.prototype._change.apply(this, arguments);
        };
        return JQueryUISlider;
    })(wijmo.JQueryUIWidget);
    wijmo.JQueryUISlider = JQueryUISlider;    
    var wijslider = (function (_super) {
        __extends(wijslider, _super);
        function wijslider() {
            _super.apply(this, arguments);

        }
        wijslider.prototype._setOption = function (key, value) {
            ///	<summary>
            ///		Sets Slider options.
            ///	</summary>
            var self = this;
            if(key === "values") {
                value = self._pre_set_values(value);
                self.options[key] = value;
                self._setValuesOption();
            } else {
                $.ui.slider.prototype._setOption.apply(self, arguments);
            }
            //Add for support disabled option at 2011/7/8
            if(key === "disabled") {
                self._handleDisabledOption(value, self.element.parent());
            } else if(key === "range") {
                self._setRangeOption(value);
            }
            //end for disabled option
            return this;
        };
        wijslider.prototype._setRangeOption = function (value) {
            var self = this, o = self.options, valueMin;
            if(value === true) {
                if(!o.values || (o.values && o.values.length === 0)) {
                    valueMin = self._valueMin();
                    o.values = [
                        valueMin, 
                        valueMin
                    ];
                } else if(o.values.length && o.values.length !== 2) {
                    valueMin = o.values[0];
                    o.values = [
                        valueMin, 
                        valueMin
                    ];
                }
                self._refresh_handle(2);
            }
            self._re_createRange();
            self._refreshValue();
        };
        wijslider.prototype._setValuesOption = function () {
            var self = this, valsLength = 0, i;
            self._animateOff = true;
            self._refreshValue();
            if($.isArray(self.options.values)) {
                valsLength = self.options.values.length;
            }
            for(i = 0; i < valsLength; i++) {
                self._change(null, i);
            }
            self._animateOff = false;
        };
        wijslider.prototype._re_createRange = function () {
            var self = this, o = self.options;
            if(self.range) {
                self.range.remove();
                //update for jquery ui 1.10 upgrade
                if($(".ui-slider-range", self.element).length > 0) {
                    $(".ui-slider-range", self.element).remove();
                }
            }
            if(o.range) {
                self.range = $("<div></div>").appendTo(self.element).addClass("ui-slider-range ui-widget-header" + ((o.range === "min" || o.range === "max") ? " ui-slider-range-" + o.range : ""));
            }
        };
        wijslider.prototype._pre_set_values = function (values) {
            var self = this, o = self.options, newHandleLen = 1, value;
            newHandleLen = values && values.length ? values.length : 1;
            if(o.range === true) {
                if(!values || (values && values.length === 0)) {
                    value = self._valueMin();
                    values = [
                        value, 
                        value
                    ];
                } else if(values.length && values.length !== 2) {
                    value = values[0];
                    values = [
                        value, 
                        value
                    ];
                }
                newHandleLen = 2;
            }
            self._refresh_handle(newHandleLen);
            self._re_createRange();
            return values;
        };
        wijslider.prototype._refresh_handle = function (newHandleLen) {
            var self = this, handleLen = self.handles.length, handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>", handles = [], i;
            if(handleLen !== newHandleLen) {
                if(newHandleLen > handleLen) {
                    for(i = handleLen; i < newHandleLen; i++) {
                        handles.push(handle);
                    }
                    self.element.append(handles.join(""));
                } else {
                    self.element.find(".ui-slider-handle").eq(newHandleLen - 1).nextAll().remove();
                }
                self.handles = self.element.find(".ui-slider-handle");
            }
        };
        wijslider.prototype._initState = function () {
            this._dragFillTarget = false;
            this._dragFillStart = 0;
            this._rangeValue = 0;
            this._oldValue1 = 0;
            this._oldValue2 = 0;
            this._oldX = 0;
            this._oldY = 0;
        };
        wijslider.prototype._create = function () {
            ///	<summary>
            ///		Creates Slider DOM elements and binds interactive events.
            ///	</summary>
                        var self = this, element = self.element, o = self.options, jqElement, val, vals, idx, len, ctrlWidth, ctrlHeight, container, decreBtn, increBtn, thumb;
            // enable touch support:
            if(window.wijmoApplyWijTouchUtilEvents) {
                $ = window.wijmoApplyWijTouchUtilEvents($);
            }
            this._initState();
            self._oriStyle = element.attr("style");
            if(element.is(":input")) {
                if(o.orientation === "horizontal") {
                    jqElement = $("<div></div>").width(element.width()).appendTo(document.body);
                } else {
                    jqElement = $("<div></div>").height(element.height()).appendTo(document.body);
                }
                val = element.val();
                if(val !== "") {
                    try  {
                        vals = val.split(";");
                        len = vals.length;
                        if(len > 0) {
                            for(idx = 0; idx < len; idx++) {
                                vals[idx] = parseInt(vals[idx], 10);
                            }
                            if(len === 1) {
                                o.value = vals[0];
                            } else {
                                o.values = vals;
                            }
                        }
                    } catch (e) {
                    }
                }
                element.data(self.widgetName, jqElement.wijslider(o)).after($(document.body).children("div:last")).hide();
                //Add for support disabled option at 2011/7/8
                if(o.disabledState) {
                    var dis = o.disabled;
                    self.disable();
                    o.disabled = dis;
                }
                //end for disabled option
                return;
            }
            _super.prototype._create.call(this);
            element.data("originalStyle", element.attr("style"));
            element.data("originalContent", element.html());
            ctrlWidth = element.width();
            ctrlHeight = element.height();
            container = $("<div></div>");
            if(o.orientation === "horizontal") {
                container.addClass("wijmo-wijslider-horizontal");
            } else {
                container.addClass("wijmo-wijslider-vertical");
            }
            container.width(ctrlWidth).height(ctrlHeight);
            decreBtn = $("<a class=\"wijmo-wijslider-decbutton\"><span></span></a>");
            increBtn = $("<a class=\"wijmo-wijslider-incbutton\"><span></span></a>");
            element.wrap(container).before(decreBtn).after(increBtn);
            self._container = element.parent();
            self._attachClass();
            thumb = element.find(".ui-slider-handle");
            self._adjustSliderLayout(decreBtn, increBtn, thumb);
            //Add for support disabled option at 2011/7/8
            if(o.disabledState) {
                var dis = o.disabled;
                self.disable();
                o.disabled = dis;
            }
            //end for disabled option
            //update for visibility change
            if(self.element.is(":hidden") && self.element.wijAddVisibilityObserver) {
                self.element.wijAddVisibilityObserver(function () {
                    self._refreshSlider();
                    if(self.element.wijRemoveVisibilityObserver) {
                        self.element.wijRemoveVisibilityObserver();
                    }
                }, "wijslider");
            }
            self._bindEvents();
        };
        wijslider.prototype._handleDisabledOption = function (disabled, ele) {
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
        wijslider.prototype._createDisabledDiv = function (outerEle) {
            var self = this, ele = //Change your outerelement here
            outerEle ? outerEle : self.element, eleOffset = ele.offset(), disabledWidth = ele.outerWidth(), disabledHeight = ele.outerHeight();
            return $("<div></div>").addClass("ui-disabled").css({
                "z-index": "99999",
                position: "absolute",
                width: disabledWidth,
                height: disabledHeight,
                left: eleOffset.left,
                top: eleOffset.top
            });
        };
        wijslider.prototype.refresh = function () {
            /// <summary>
            /// Refresh the wijslider widget.
            /// Code Example: $(".selector").wijslider("refresh");
            /// </summary>
            // note: when the original element's width is setted by percent
            // it's hard to adjust the position and size, so first destroy then
            // recreate
            //this._refresh();
                        var widgetObject = this.element.data("wijslider"), wijmoWidgetObject = this.element.data("wijmoWijslider");
            this.destroy();
            this.element.data("wijslider", widgetObject);
            this.element.data("wijmoWijslider", wijmoWidgetObject);
            this._create();
        };
        wijslider.prototype._refreshSlider = function () {
            var self = this, increBtn, decreBtn, thumb;
            //			self.destroy();
            //			self._create();
            decreBtn = self._container.find(".wijmo-wijslider-decbutton");
            increBtn = self._container.find(".wijmo-wijslider-incbutton");
            thumb = self._container.find(".ui-slider-handle");
            self._adjustSliderLayout(decreBtn, increBtn, thumb);
            self._refreshValue();
        };
        wijslider.prototype._adjustSliderLayout = function (decreBtn, increBtn, thumb) {
            var self = this, element = self.element, o = self.options, ctrlWidth, ctrlHeight, decreBtnWidth, decreBtnHeight, increBtnWidth, increBtnHeight, thumbWidth, thumbHeight, dbtop, ibtop, dbleft, ibleft;
            ctrlWidth = self._container.width();
            ctrlHeight = self._container.height();
            decreBtnWidth = decreBtn.outerWidth();
            decreBtnHeight = decreBtn.outerHeight();
            increBtnWidth = increBtn.outerWidth();
            increBtnHeight = increBtn.outerHeight();
            thumbWidth = thumb.outerWidth();
            thumbHeight = thumb.outerHeight();
            if(o.orientation === "horizontal") {
                dbtop = ctrlHeight / 2 - decreBtnHeight / 2;
                decreBtn.css("top", dbtop).css("left", 0);
                ibtop = ctrlHeight / 2 - increBtnHeight / 2;
                increBtn.css("top", ibtop).css("right", 0);
                element.css("left", decreBtnWidth + thumbWidth / 2 - 1).css("top", ctrlHeight / 2 - element.outerHeight() / 2).width(ctrlWidth - decreBtnWidth - increBtnWidth - thumbWidth - 2);
            } else {
                dbleft = ctrlWidth / 2 - decreBtnWidth / 2;
                decreBtn.css("left", dbleft).css("top", 0);
                ibleft = ctrlWidth / 2 - increBtnWidth / 2;
                increBtn.css("left", ibleft).css("bottom", 0);
                element.css("left", ctrlWidth / 2 - element.outerWidth() / 2).css("top", decreBtnHeight + thumbHeight / 2 + 1).height(ctrlHeight - decreBtnHeight - increBtnHeight - thumbHeight - 2);
            }
        };
        wijslider.prototype.destroy = function () {
            ///	<summary>
            ///	Remove the slider functionality completely.
            /// This will return the element back to its pre-init state.
            /// Code Example: $(".selector").wijslider("destroy");
            ///	</summary>
                        var self = this, decreBtn, increBtn;
            decreBtn = this._getDecreBtn();
            increBtn = this._getIncreBtn();
            decreBtn.unbind('.' + self.widgetName);
            increBtn.unbind('.' + self.widgetName);
            _super.prototype.destroy.call(this);
            //update for destroy by wh at 2011/11/11
            //this.element.parent().removeAttr("class");
            //this.element.parent().html("");
            $("a", self.element.parent()).remove();
            self.element.unbind('.' + self.widgetName);
            self.element.unwrap();
            if(self._oriStyle === undefined) {
                self.element.removeAttr("style");
            } else {
                self.element.attr("style", self._oriStyle);
            }
            self.element.removeData(self.widgetName).removeData("originalStyle").removeData("originalContent");
            //end
            //Add for support disabled option at 2011/7/8
            if(self.disabledDiv) {
                self.disabledDiv.remove();
                self.disabledDiv = null;
            }
            //end for disabled option
                    };
        wijslider.prototype._slide = function (event, index, newVal) {
            var self = this, o = self.options, minRange = o.minRange, newValue = newVal, values;
            if(o.range === true) {
                values = self.values();
                if(index === 0 && values[1] - minRange < newVal) {
                    newValue = values[1] - minRange;
                } else if(index === 1 && values[0] + minRange > newVal) {
                    newValue = values[0] + minRange;
                }
            }
            _super.prototype._slide.call(this, event, index, newValue);
        };
        wijslider.prototype._getDecreBtn = function () {
            var decreBtn = this.element.parent().find(".wijmo-wijslider-decbutton");
            return decreBtn;
        };
        wijslider.prototype._getIncreBtn = function () {
            var increBtn = this.element.parent().find(".wijmo-wijslider-incbutton");
            return increBtn;
        };
        wijslider.prototype._attachClass = function () {
            this._getDecreBtn().addClass("ui-corner-all ui-state-default").attr("role", "button");
            this._getIncreBtn().addClass("ui-corner-all ui-state-default").attr("role", "button");
            this.element.parent().attr("role", "slider").attr("aria-valuemin", this.options.min).attr("aria-valuenow", "0").attr("aria-valuemax", this.options.max);
            if(this.options.orientation === "horizontal") {
                this.element.parent().addClass("wijmo-wijslider-horizontal");
                this._getDecreBtn().find("> span").addClass("ui-icon ui-icon-triangle-1-w");
                this._getIncreBtn().find("> span").addClass("ui-icon ui-icon-triangle-1-e");
            } else {
                this.element.parent().addClass("wijmo-wijslider-vertical");
                this._getDecreBtn().find("> span").addClass("ui-icon ui-icon-triangle-1-n");
                this._getIncreBtn().find("> span").addClass("ui-icon ui-icon-triangle-1-s");
            }
        };
        wijslider.prototype._bindEvents = function () {
            var self = this, decreBtn, increBtn, ele;
            decreBtn = this._getDecreBtn();
            increBtn = this._getIncreBtn();
            ele = self.element;
            //
            decreBtn.bind('click.' + self.widgetName, self, self._decreBtnClick);
            increBtn.bind('click.' + self.widgetName, self, self._increBtnClick);
            //
            decreBtn.bind('mouseover.' + self.widgetName, self, self._decreBtnMouseOver);
            decreBtn.bind('mouseout.' + self.widgetName, self, self._decreBtnMouseOut);
            decreBtn.bind('mousedown.' + self.widgetName, self, self._decreBtnMouseDown);
            decreBtn.bind('mouseup.' + self.widgetName, self, self._decreBtnMouseUp);
            increBtn.bind('mouseover.' + self.widgetName, self, self._increBtnMouseOver);
            increBtn.bind('mouseout.' + self.widgetName, self, self._increBtnMouseOut);
            increBtn.bind('mousedown.' + self.widgetName, self, self._increBtnMouseDown);
            increBtn.bind('mouseup.' + self.widgetName, self, self._increBtnMouseUp);
            ele.bind('mouseup.' + self.widgetName, self, self._elementMouseupEvent);
        };
        wijslider.prototype._decreBtnMouseOver = function (e) {
            var self = e.data, data, decreBtn;
            if(self.options.disabledState || self.options.disabled) {
                return;
            }
            data = {
                buttonType: "decreButton"
            };
            self._trigger('buttonMouseOver', e, data);
            //
            decreBtn = self._getDecreBtn();
            decreBtn.addClass("ui-state-hover");
        };
        wijslider.prototype._increBtnMouseOver = function (e) {
            var self = e.data, data, increBtn;
            if(self.options.disabledState || self.options.disabled) {
                return;
            }
            data = {
                buttonType: "increButton"
            };
            self._trigger('buttonMouseOver', e, data);
            //
            increBtn = self._getIncreBtn();
            increBtn.addClass("ui-state-hover");
        };
        wijslider.prototype._decreBtnMouseOut = function (e) {
            var self = e.data, data, decreBtn;
            if(self.options.disabledState || self.options.disabled) {
                return;
            }
            data = {
                buttonType: "decreButton"
            };
            self._trigger('buttonMouseOut', e, data);
            //
            decreBtn = self._getDecreBtn();
            decreBtn.removeClass("ui-state-hover ui-state-active");
        };
        wijslider.prototype._increBtnMouseOut = function (e) {
            var self = e.data, data, increBtn;
            if(self.options.disabledState || self.options.disabled) {
                return;
            }
            data = {
                buttonType: "increButton"
            };
            self._trigger('buttonMouseOut', e, data);
            //
            increBtn = self._getIncreBtn();
            increBtn.removeClass("ui-state-hover ui-state-active");
        };
        wijslider.prototype._decreBtnMouseDown = function (e) {
            var self = e.data, data, decreBtn;
            if(self.options.disabledState || self.options.disabled) {
                return;
            }
            data = {
                buttonType: "decreButton"
            };
            self._trigger('buttonMouseDown', e, data);
            //
            decreBtn = self._getDecreBtn();
            decreBtn.addClass("ui-state-active");
            //if the mouse release util the mouse out, the track still take effect.
            //added by wuhao 2011/7/16
            $(document).bind("mouseup." + self.widgetName, {
                self: self,
                ele: decreBtn
            }, self._documentMouseUp);
            if(self._intervalID !== null) {
                window.clearInterval(self._intervalID);
                self._intervalID = null;
            }
            //end for mouse release
            self._intervalID = window.setInterval(function () {
                self._decreBtnHandle(self);
            }, 200);
        };
        wijslider.prototype._documentMouseUp = function (e) {
            var self = e.data.self, ele = e.data.ele;
            if(self.options.disabledState || self.options.disabled) {
                return;
            }
            ele.removeClass("ui-state-active");
            if(self._intervalID !== null) {
                window.clearInterval(self._intervalID);
                self._intervalID = null;
            }
            $(document).unbind("mouseup." + self.widgetName, self._documentMouseUp);
        };
        wijslider.prototype._increBtnMouseDown = function (e) {
            var self = e.data, data, increBtn;
            if(self.options.disabledState || self.options.disabled) {
                return;
            }
            data = {
                buttonType: "increButton"
            };
            self._trigger('buttonMouseDown', e, data);
            //
            increBtn = self._getIncreBtn();
            increBtn.addClass("ui-state-active");
            //if the mouse release util the mouse out, the track still take effect.
            //added by wuhao 2011/7/16
            $(document).bind("mouseup." + self.widgetName, {
                self: self,
                ele: increBtn
            }, self._documentMouseUp);
            if(self._intervalID !== null) {
                window.clearInterval(self._intervalID);
                self._intervalID = null;
            }
            //end for mouse release
            self._intervalID = window.setInterval(function () {
                self._increBtnHandle(self);
            }, 200);
        };
        wijslider.prototype._decreBtnMouseUp = function (e) {
            var self = e.data, data, decreBtn;
            if(self.options.disabledState || self.options.disabled) {
                return;
            }
            data = {
                buttonType: "decreButton"
            };
            self._trigger('buttonMouseUp', e, data);
            //
            decreBtn = self._getDecreBtn();
            decreBtn.removeClass("ui-state-active");
            window.clearInterval(self._intervalID);
        };
        wijslider.prototype._increBtnMouseUp = function (e) {
            var self = e.data, data, increBtn;
            if(self.options.disabledState || self.options.disabled) {
                return;
            }
            data = {
                buttonType: "increButton"
            };
            self._trigger('buttonMouseUp', e, data);
            //
            increBtn = self._getIncreBtn();
            increBtn.removeClass("ui-state-active");
            window.clearInterval(self._intervalID);
        };
        wijslider.prototype._decreBtnHandle = function (sender) {
            if(sender.options.orientation === "horizontal") {
                sender._decre();
            } else {
                sender._incre();
            }
        };
        wijslider.prototype._decreBtnClick = function (e) {
            var self = e.data, data;
            if(self.options.disabledState || self.options.disabled) {
                return;
            }
            //note: step1: slide the slider btn, the change event has fired;
            //step2: then click the decre button, the change event don't fired.
            self._mouseSliding = false;
            //end
            self._decreBtnHandle(self);
            data = {
                buttonType: "decreButton",
                value: self.value()
            };
            self._trigger('buttonClick', e, data);
        };
        wijslider.prototype._increBtnHandle = function (sender) {
            if(sender.options.orientation === "horizontal") {
                sender._incre();
            } else {
                sender._decre();
            }
        };
        wijslider.prototype._increBtnClick = function (e) {
            var self = e.data, data;
            if(self.options.disabledState || self.options.disabled) {
                return;
            }
            //note: step1: slide the slider btn, the change event has fired;
            //step2: then click the decre button, the change event don't fired.
            self._mouseSliding = false;
            //end
            self._increBtnHandle(self);
            data = {
                buttonType: "increButton",
                value: self.value()
            };
            self._trigger('buttonClick', e, data);
        };
        wijslider.prototype._decre = function () {
            var self = this, curVal = self.value(), o = self.options, min = o.min, step = o.step;
            //
            if(o.values && o.values.length) {
                curVal = self.values(0);
                if(curVal <= min) {
                    self.values(0, min);
                } else {
                    self.values(0, curVal - step);
                }
            } else {
                curVal = self.value();
                if(curVal <= min) {
                    self.value(min);
                } else {
                    self.value(curVal - step);
                }
            }
            //
            self.element.parent().attr("aria-valuenow", self.value());
        };
        wijslider.prototype._incre = function () {
            var self = this, curVal = self.value(), o = self.options, max = o.max, step = o.step, index;
            //
            if(o.values && o.values.length) {
                index = o.values.length === 1 ? 0 : 1;
                curVal = self.values(index);
                if(curVal >= max) {
                    self.values(index, max);
                } else {
                    self.values(index, curVal + step);
                }
            } else {
                curVal = self.value();
                if(curVal >= max) {
                    self.value(max);
                } else {
                    self.value(curVal + step);
                }
            }
            //
            self.element.parent().attr("aria-valuenow", self.value());
        };
        wijslider.prototype._elementMouseupEvent = function (e) {
            var self = e.data;
            if(self.options.dragFill && self.options.range) {
                if(self._dragFillStart > 0) {
                    self._dragFillStart = 0;
                } else {
                    $.ui.slider.prototype._mouseCapture.apply(self, arguments);
                }
            }
        };
        wijslider.prototype._mouseCapture = function (event) {
            this.element.parent().attr("aria-valuenow", this.value());
            //
            if(this.options.dragFill) {
                if(event.target.className === "ui-slider-range ui-widget-header") {
                    this.elementSize = {
                        width: this.element.outerWidth(),
                        height: this.element.outerHeight()
                    };
                    this.elementOffset = this.element.offset();
                    return true;
                } else {
                    try  {
                        return $.ui.slider.prototype._mouseCapture.apply(this, arguments);
                    } catch (e) {
                    }
                }
            } else {
                try  {
                    return $.ui.slider.prototype._mouseCapture.apply(this, arguments);
                } catch (e) {
                }
            }
        };
        wijslider.prototype._mouseStart = function (event) {
            if(this.options.dragFill) {
                if(event.target) {
                    if(event.target.className === "ui-slider-range ui-widget-header") {
                        this._dragFillTarget = true;
                        this._rangeValue = this.values(1) - this.values(0);
                        this._oldValue1 = this.values(0);
                        this._oldValue2 = this.values(1);
                        this._oldX = event.pageX;
                        this._oldY = event.pageY;
                        return true;
                    }
                }
                this._dragFillTarget = false;
            }
            return true;
        };
        wijslider.prototype._mouseDrag = function (event) {
            var distance, eleLength, movValue, v, v0, v1;
            if(this.options.dragFill) {
                distance = event.pageX - this._oldX;
                //var position = { x: event.pageX, y: event.pageY };
                //var movValue = this._normValueFromMouse(position);
                eleLength = this.element.outerWidth();
                if(this.options.orientation === "vertical") {
                    eleLength = this.element.outerHeight();
                    distance = -(event.pageY - this._oldY);
                }
                movValue = (this.options.max - this.options.min) / eleLength * distance;
                //document.title = distanceX + "|" + movValue;
                if(this._dragFillTarget) {
                    if(this.options.orientation === "vertical") {
                        $(document.documentElement).css("cursor", "s-resize");
                    } else {
                        $(document.documentElement).css("cursor", "w-resize");
                    }
                    if(this._dragFillStart > 0) {
                        v = this._rangeValue;
                        /* if (normValue + v >= this.options.max) {
                        this.values(0, this.options.max - v);
                        this.values(1, this.options.max);
                        }
                        else {
                        }*/
                        this.values(0, this._oldValue1 + movValue);
                        this.values(1, this._oldValue1 + movValue + v);
                        v0 = this.values(0);
                        v1 = this.values(1);
                        if(v0 + v > this.options.max) {
                            this.values(0, this.options.max - v);
                        }
                        if(v1 - v < this.options.min) {
                            this.values(1, this.options.min + v);
                        }
                    }
                    this._dragFillStart++;
                    return false;
                } else {
                    return $.ui.slider.prototype._mouseDrag.apply(this, arguments);
                }
            } else {
                return $.ui.slider.prototype._mouseDrag.apply(this, arguments);
            }
        };
        wijslider.prototype._mouseStop = function (event) {
            var returnVal = $.ui.slider.prototype._mouseStop.apply(this, arguments);
            if(this.options.dragFill) {
                $(document.documentElement).css("cursor", "default");
                window.setTimeout(function () {
                    this._dragFillTarget = false;
                    this._dragFillStart = 0;
                }, 500);
            }
            return returnVal;
        };
        return wijslider;
    })(JQueryUISlider);
    wijmo.wijslider = wijslider;    
    wijslider.prototype.widgetEventPrefix = "wijslider";
    wijslider.prototype.options = $.extend(true, {
    }, $.Widget.prototype.options, {
        buttonMouseOver: /// <summary>
        /// The buttonMouseOver event is raised when the mouse is over the decrement button or the increment button.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the buttonMouseOver event:
        /// $("#element").wijslider({ buttonMouseOver: function (e, args) {
        /// alert(args.buttonType); } });
        /// Bind to the event by type:
        /// $("#element").bind("wijsliderbuttonMouseOver", function(e, args) {
        /// alert(args.buttonType); });
        /// </summary>
        /// <param name="e" type="eventObj">
        /// The jquery event object.
        /// </param>
        /// <param name="data" type="Object">
        /// An object that contains all the button infos.
        /// data.buttonType: A string value that indicates the type name of button.
        /// </param>
        null,
        buttonMouseOut: /// <summary>
        /// The buttonMouseOut event is raised when the mouse leaves the decrement button or the increment button.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the buttonMouseOut event:
        /// $("#element").wijslider({ buttonMouseOut: function (e, args) {
        /// alert(args.buttonType); } });
        /// Bind to the event by type:
        /// $("#element").bind("wijsliderbuttonMouseOut", function(e, args) {
        /// alert(args.buttonType); });
        /// </summary>
        /// <param name="e" type="eventObj">
        /// The jquery event object.
        /// </param>
        /// <param name="data" type="Object">
        /// An object that contains all the button infos.
        /// data.buttonType: A string value that indicates the type name of button.
        /// </param>
        null,
        buttonMouseDown: /// <summary>
        /// The buttonMouseDown event is raised when the mouse is down on the decrement button or the increment button.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the buttonMouseDown event:
        /// $("#element").wijslider({ buttonMouseDown: function (e, args) {
        /// alert(args.buttonType); } });
        /// Bind to the event by type:
        /// $("#element").bind("wijsliderbuttonMouseDown", function(e, args) {
        /// alert(args.buttonType); });
        /// </summary>
        /// <param name="e" type="eventObj">
        /// The jquery event object.
        /// </param>
        /// <param name="data" type="Object">
        /// An object that contains all the button infos.
        /// data.buttonType: A string value that indicates the type name of button.
        /// </param>
        null,
        buttonMouseUp: /// <summary>
        /// The buttonMouseUp event is raised when the mouse is up on the decrement button or the increment button.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the buttonMouseUp event:
        /// $("#element").wijslider({ buttonMouseUp: function (e, args) {
        /// alert(args.buttonType); } });
        /// Bind to the event by type:
        /// $("#element").bind("wijsliderbuttonMouseUp", function(e, args) {
        /// alert(args.buttonType); });
        /// </summary>
        /// <param name="e" type="eventObj">
        /// The jquery event object.
        /// </param>
        /// <param name="data" type="Object">
        /// An object that contains all the button infos.
        /// data.buttonType: A string value that indicates the type name of button.
        /// </param>
        null,
        buttonClick: /// <summary>
        /// The buttonClick event is raised when the decrement button or the increment button is clicked.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a callback function to handle the buttonClick event:
        /// $("#element").wijslider({ buttonClick: function (e, args) {
        /// alert(args.buttonType); } });
        /// Bind to the event by type:
        /// $("#element").bind("wijsliderbuttonClick", function(e, args) {
        /// alert(args.buttonType); });
        /// </summary>
        /// <param name="e" type="eventObj">
        /// The jquery event object.
        /// </param>
        /// <param name="data" type="Object">
        /// An object that contains all the button infos.
        /// data.buttonType: A string value that indicates the type name of button.
        /// </param>
        null,
        dragFill: /// <summary>
        /// The dragFill option, when set to true, allows the user to drag
        /// the fill between the thumb buttons on the slider widget.
        /// Default: true.
        /// Type: Boolean.
        /// Code example:
        ///  $("#selector").wijslider({
        ///      dragFill: false
        ///  });
        /// </summary>
        true,
        minRange: /// <summary>
        /// The minRange option prevents the two range handles (thumb buttons)
        /// from being placed on top of one another.
        /// Default: 0.
        /// Type: Number.
        /// Code example:
        ///  $("#selector").wijslider({
        ///      minRange: 25
        ///  });
        /// </summary>
        0
    });
    if($.ui && $.ui.slider) {
        $.wijmo.registerWidget(widgetName, $.ui.slider, wijslider.prototype);
    }
})(wijmo || (wijmo = {}));
