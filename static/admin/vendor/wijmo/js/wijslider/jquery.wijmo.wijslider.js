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
    /// <reference path="../Base/jquery.wijmo.widget.ts" />
    /*globals window,document,jQuery*/
    /*
    * Depends:
    *  jquery.js
    *  jquery.ui.js
    *  jquery.wijmo.wijutil.js
    */
    (function (slider) {
        "use strict";
        var $ = jQuery, widgetName = "wijslider", uiSliderHandleClass = "ui-slider-handle";
        /** @ignore */
        var JQueryUISlider = (function (_super) {
            __extends(JQueryUISlider, _super);
            function JQueryUISlider() {
                _super.apply(this, arguments);

            }
            JQueryUISlider.prototype._valueMin = function () {
                return $.ui.slider.prototype._valueMin.apply(this, arguments);
            };
            JQueryUISlider.prototype._valueMax = function () {
                return $.ui.slider.prototype._valueMax.apply(this, arguments);
            };
            JQueryUISlider.prototype._refreshValue = function () {
                return $.ui.slider.prototype._refreshValue.apply(this, arguments);
            };
            JQueryUISlider.prototype._create = function () {
                return $.ui.slider.prototype._create.apply(this, arguments);
            };
            JQueryUISlider.prototype._createHandles = function () {
                return $.ui.slider.prototype._createHandles.apply(this, arguments);
            };
            JQueryUISlider.prototype.values = /** This option can be used to specify multiple handles.
            * @remarks
            *    If the range option is set to true, the length of values should be 2.
            * @param {?number} index the first value.
            * @param {?number} val the second value.
            */
            function (index, val) {
                return $.ui.slider.prototype.values.apply(this, arguments);
            };
            JQueryUISlider.prototype.value = /** Determines the value of the slider, if there's only one handle.
            * @remarks
            *   If there is more than one handle, determines the value of the first handle.
            * @param {?number} val the specified value.
            */
            function (val) {
                return $.ui.slider.prototype.value.apply(this, arguments);
            };
            JQueryUISlider.prototype._slide = function (event, index, newValue) {
                return $.ui.slider.prototype._slide.apply(this, arguments);
            };
            JQueryUISlider.prototype._change = function (event, index) {
                return $.ui.slider.prototype._change.apply(this, arguments);
            };
            JQueryUISlider.prototype._normValueFromMouse = function (position) {
                return $.ui.slider.prototype._normValueFromMouse.apply(this, arguments);
            };
            return JQueryUISlider;
        })(wijmo.JQueryUIWidget);
        slider.JQueryUISlider = JQueryUISlider;        
        /** @widget
        * @extends jQuery.ui.slider
        */
        var wijslider = (function (_super) {
            __extends(wijslider, _super);
            function wijslider() {
                _super.apply(this, arguments);

            }
            wijslider.prototype._setOption = function (key, value) {
                if(key === "values") {
                    value = this._pre_set_values(value);
                    this.options[key] = value;
                    this._setValuesOption();
                } else if(key === "disabled") {
                    this.element.toggleClass(this.options.wijCSS.stateDisabled, !!value);
                    this.options[key] = value;
                } else {
                    $.ui.slider.prototype._setOption.apply(this, arguments);
                }
                //Add for support disabled option at 2011/7/8
                if(key === "range") {
                    this._setRangeOption(value);
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
                var self = this, o = self.options, wijCSS = o.wijCSS;
                if(self.range) {
                    self.range.remove();
                    //update for jquery ui 1.10 upgrade
                    if($(".ui-slider-range", self.element).length > 0) {
                        $(".ui-slider-range", self.element).remove();
                    }
                }
                if(o.range) {
                    self.range = $("<div></div>").appendTo(self.element).addClass(wijCSS.uiSliderRange).addClass(wijCSS.header);
                    if(o.range === "min") {
                        self.range.addClass(wijCSS.uiSliderRangeMin);
                    } else if(o.range === "max") {
                        self.range.addClass(wijCSS.uiSliderRangeMax);
                    }
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
            wijslider.prototype._createHandles = function () {
                var wijCSS = this.options.wijCSS;
                _super.prototype._createHandles.call(this);
                this.handles.each(function (i) {
                    $(this).removeClass("ui-slider-handle").removeClass("ui-state-default").removeClass("ui-corner-all").addClass(uiSliderHandleClass).addClass(wijCSS.uiSliderHandle).addClass(wijCSS.stateDefault).addClass(wijCSS.cornerAll);
                });
            };
            wijslider.prototype._refresh_handle = function (newHandleLen) {
                var self = this, wijCSS = this.options.wijCSS, handleLen = self.handles.length, handle = "<a class='" + uiSliderHandleClass + " " + wijCSS.uiSliderHandle + " " + wijCSS.stateDefault + " " + wijCSS.cornerAll + "' href='#'></a>", handles = [], i;
                if(handleLen !== newHandleLen) {
                    if(newHandleLen > handleLen) {
                        for(i = handleLen; i < newHandleLen; i++) {
                            handles.push(handle);
                        }
                        self.element.append(handles.join(""));
                    } else {
                        self.element.find("." + uiSliderHandleClass).eq(newHandleLen - 1).nextAll().remove();
                    }
                    self.handles = self.element.find("." + uiSliderHandleClass);
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
                                var self = this, element = self.element, o = self.options, wijCSS = o.wijCSS, jqElement, val, vals, idx, len, ctrlWidth, ctrlHeight, container, decreBtn, increBtn, thumb;
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
                if(self.range) {
                    self.range.removeClass("ui-slider-range").addClass(wijCSS.uiSliderRange);
                }
                element.removeClass("ui-slider").removeClass("ui-slider-" + this.options.orientation).removeClass("ui-widget").removeClass("ui-widget-content").removeClass("ui-corner-all").addClass(wijCSS.uiSlider).addClass(o.orientation === "horizontal" ? wijCSS.uiSliderHorizontal : wijCSS.uiSliderVertical).addClass(wijCSS.widget).addClass(wijCSS.content).addClass(wijCSS.cornerAll);
                element.data("originalStyle", element.attr("style"));
                element.data("originalContent", element.html());
                ctrlWidth = element.width();
                ctrlHeight = element.height();
                container = $("<div></div>");
                if(o.orientation === "horizontal") {
                    container.addClass(wijCSS.wijmoSliderHorizontal);
                } else {
                    container.addClass(wijCSS.wijmoSliderVertical);
                }
                container.width(ctrlWidth).height(ctrlHeight);
                decreBtn = $("<a><span></span></a>").addClass(wijCSS.wijmoSliderDecButton);
                increBtn = $("<a><span></span></a>").addClass(wijCSS.wijmoSliderIncButton);
                element.wrap(container).before(decreBtn).after(increBtn);
                self._container = element.parent();
                self._attachClass();
                thumb = element.find("." + uiSliderHandleClass);
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
            wijslider.prototype.values = /** This option can be used to specify multiple handles.
            * @remarks
            *    If the range option is set to true, the length of values should be 2.
            * @param {?number} index the first value.
            * @param {?number} val the second value.
            */
            function (index, val) {
                return $.ui.slider.prototype.values.apply(this, arguments);
            };
            wijslider.prototype.value = /** Determines the value of the slider, if there's only one handle.
            * @remarks
            *   If there is more than one handle, determines the value of the first handle.
            * @param {?number} val the specified value.
            */
            function (val) {
                return $.ui.slider.prototype.value.apply(this, arguments);
            };
            wijslider.prototype.refresh = /** Refresh the wijslider widget. */
            function () {
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
                var self = this, wijCSS = self.options.wijCSS, increBtn, decreBtn, thumb;
                decreBtn = self._container.find("." + wijCSS.wijmoSliderDecButton);
                increBtn = self._container.find("." + wijCSS.wijmoSliderIncButton);
                thumb = self._container.find("." + uiSliderHandleClass);
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
            wijslider.prototype.destroy = /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            function () {
                var self = this, decreBtn, increBtn, wijCSS = self.options.wijCSS;
                decreBtn = this._getDecreBtn();
                increBtn = this._getIncreBtn();
                decreBtn.unbind('.' + self.widgetName);
                increBtn.unbind('.' + self.widgetName);
                self.element.removeClass(wijCSS.uiSlider).removeClass(wijCSS.uiSliderHorizontal).removeClass(wijCSS.uiSliderVertical).removeClass(wijCSS.widget).removeClass(wijCSS.content).removeClass(wijCSS.cornerAll).removeClass(uiSliderHandleClass);
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
                var decreBtn = this.element.parent().find("." + this.options.wijCSS.wijmoSliderDecButton);
                return decreBtn;
            };
            wijslider.prototype._getIncreBtn = function () {
                var increBtn = this.element.parent().find("." + this.options.wijCSS.wijmoSliderIncButton);
                return increBtn;
            };
            wijslider.prototype._attachClass = function () {
                var wijCSS = this.options.wijCSS;
                this._getDecreBtn().addClass(wijCSS.cornerAll).addClass(wijCSS.stateDefault).attr("role", "button");
                this._getIncreBtn().addClass(wijCSS.cornerAll).addClass(wijCSS.stateDefault).attr("role", "button");
                this.element.parent().attr("role", "slider").attr("aria-valuemin", this.options.min).attr("aria-valuenow", "0").attr("aria-valuemax", this.options.max);
                if(this.options.orientation === "horizontal") {
                    this.element.parent().addClass(wijCSS.wijmoSliderHorizontal);
                    this._getDecreBtn().find("> span").addClass(wijCSS.icon).addClass(wijCSS.iconArrowLeft);
                    this._getIncreBtn().find("> span").addClass(wijCSS.icon).addClass(wijCSS.iconArrowRight);
                } else {
                    this.element.parent().addClass(wijCSS.wijmoSliderVertical);
                    this._getDecreBtn().find("> span").addClass(wijCSS.icon).addClass(wijCSS.iconArrowUp);
                    this._getIncreBtn().find("> span").addClass(wijCSS.icon).addClass(wijCSS.iconArrowDown);
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
                if($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    ele.bind('wijmousedown.' + self.widgetName, $.proxy(self._touchStart, self)).bind('wijmousemove.' + self.widgetName, $.proxy(self._touchMove, self)).bind('wijmouseup.' + self.widgetName, $.proxy(self._touchEnd, self));
                }
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
                decreBtn = self._getDecreBtn();
                decreBtn.addClass(self.options.wijCSS.stateHover);
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
                increBtn = self._getIncreBtn();
                increBtn.addClass(self.options.wijCSS.stateHover);
            };
            wijslider.prototype._decreBtnMouseOut = function (e) {
                var self = e.data, data, decreBtn, wijCSS = self.options.wijCSS;
                if(self.options.disabledState || self.options.disabled) {
                    return;
                }
                data = {
                    buttonType: "decreButton"
                };
                self._trigger('buttonMouseOut', e, data);
                decreBtn = self._getDecreBtn();
                decreBtn.removeClass(wijCSS.stateHover).removeClass(wijCSS.stateActive);
            };
            wijslider.prototype._increBtnMouseOut = function (e) {
                var self = e.data, data, increBtn, wijCSS = self.options.wijCSS;
                if(self.options.disabledState || self.options.disabled) {
                    return;
                }
                data = {
                    buttonType: "increButton"
                };
                self._trigger('buttonMouseOut', e, data);
                increBtn = self._getIncreBtn();
                increBtn.removeClass(wijCSS.stateHover).removeClass(wijCSS.stateActive);
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
                decreBtn = self._getDecreBtn();
                decreBtn.addClass(self.options.wijCSS.stateActive);
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
                ele.removeClass(self.options.wijCSS.stateActive);
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
                increBtn = self._getIncreBtn();
                increBtn.addClass(self.options.wijCSS.stateActive);
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
                decreBtn = self._getDecreBtn();
                decreBtn.removeClass(self.options.wijCSS.stateActive);
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
                increBtn = self._getIncreBtn();
                increBtn.removeClass(self.options.wijCSS.stateActive);
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
                self.element.parent().attr("aria-valuenow", self.value());
            };
            wijslider.prototype._incre = function () {
                var self = this, curVal = self.value(), o = self.options, max = o.max, step = o.step, index;
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
            wijslider.prototype._isUISlider = function (ele) {
                var wijCSS = this.options.wijCSS, $ele = $(ele);
                return ($ele.hasAllClasses(wijCSS.uiSliderRange) && $ele.hasAllClasses(wijCSS.header) && $ele.hasAllClasses(wijCSS.cornerAll)) || //for older version of jQuery UI
                ($ele.hasAllClasses(wijCSS.uiSliderRange) && $ele.hasAllClasses(wijCSS.header));
            };
            wijslider.prototype._mouseCapture = function (event) {
                this.element.parent().attr("aria-valuenow", this.value());
                if(this.options.dragFill) {
                    if(this._isUISlider(event.target)) {
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
                        if(this._isUISlider(event.target)) {
                            this._setStateForDragFill(event);
                            return true;
                        }
                    }
                    this._dragFillTarget = false;
                }
                return true;
            };
            wijslider.prototype._mouseDrag = function (event) {
                if(this.options.dragFill) {
                    if(this._processDragFill(event)) {
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
                    this._resetStateForDragFill();
                }
                return returnVal;
            };
            wijslider.prototype._touchStart = function (event) {
                var index, distance, normValue, position, closestHandle, that = this, o = this.options;
                if(!this.elementSize) {
                    this.elementSize = {
                        width: this.element.outerWidth(),
                        height: this.element.outerHeight()
                    };
                }
                if(!this.elementOffset) {
                    this.elementOffset = this.element.offset();
                }
                if(this.options.dragFill) {
                    if(event.originalEvent.target) {
                        if(this._isUISlider(event.target)) {
                            this._setStateForDragFill(event);
                            return true;
                        }
                    }
                }
                this._dragFillTarget = false;
                position = {
                    x: event.pageX,
                    y: event.pageY
                };
                normValue = _super.prototype._normValueFromMouse.call(this, position);
                distance = _super.prototype._valueMax.call(this) - this._valueMin() + 1;
                this.handles.each(function (i) {
                    var thisDistance = Math.abs(normValue - that.values(i));
                    if((distance > thisDistance) || (distance === thisDistance && (i === that._lastChangedValue || that.values(i) === o.min))) {
                        distance = thisDistance;
                        closestHandle = $(this);
                        index = i;
                    }
                });
                this._handleIndex = index;
                closestHandle.addClass(o.wijCSS.stateActive);
            };
            wijslider.prototype._touchMove = function (event) {
                var position, normValue;
                if($.browser.msie && event.pointerType === event.MSPOINTER_TYPE_TOUCH) {
                    return false;
                }
                event.preventDefault();
                event.stopPropagation();
                if(this.options.dragFill) {
                    if(this._processDragFill(event)) {
                        return false;
                    }
                }
                position = {
                    x: event.pageX,
                    y: event.pageY
                };
                normValue = _super.prototype._normValueFromMouse.call(this, position);
                this._slide(event, this._handleIndex, normValue);
                return false;
            };
            wijslider.prototype._touchEnd = function (event) {
                this.handles.removeClass(this.options.wijCSS.stateActive);
                this._lastChangedValue = this._handleIndex;
                if(this.options.dragFill) {
                    this._resetStateForDragFill();
                }
            };
            wijslider.prototype._setStateForDragFill = function (event) {
                this._dragFillTarget = true;
                this._rangeValue = this.values(1) - this.values(0);
                this._oldValue1 = this.values(0);
                this._oldValue2 = this.values(1);
                this._oldX = event.pageX;
                this._oldY = event.pageY;
            };
            wijslider.prototype._resetStateForDragFill = function () {
                $(document.documentElement).css("cursor", "default");
                window.setTimeout(function () {
                    this._dragFillTarget = false;
                    this._dragFillStart = 0;
                }, 500);
            };
            wijslider.prototype._processDragFill = function (event) {
                var distance, eleLength, movValue, v, v0, v1, pageX, pageY;
                distance = event.pageX - this._oldX;
                eleLength = this.element.outerWidth();
                if(this.options.orientation === "vertical") {
                    eleLength = this.element.outerHeight();
                    distance = -(event.pageY - this._oldY);
                }
                movValue = (this.options.max - this.options.min) / eleLength * distance;
                if(this._dragFillTarget) {
                    if(this.options.orientation === "vertical") {
                        $(document.documentElement).css("cursor", "s-resize");
                    } else {
                        $(document.documentElement).css("cursor", "w-resize");
                    }
                    if(this._dragFillStart > 0) {
                        v = this._rangeValue;
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
                    return true;
                } else {
                    return false;
                }
            };
            return wijslider;
        })(JQueryUISlider);
        slider.wijslider = wijslider;        
        wijslider.prototype.widgetEventPrefix = "wijslider";
        var wijslider_options = (function () {
            function wijslider_options() {
                /**
                * All CSS classes used in widgets.
                * @ignore
                */
                this.wijCSS = {
                    uiSliderRange: "ui-slider-range",
                    uiSliderHandle: "ui-slider-handle",
                    wijmoSliderDecButton: "wijmo-wijslider-decbutton",
                    wijmoSliderIncButton: "wijmo-wijslider-incbutton",
                    wijmoSliderHorizontal: "wijmo-wijslider-horizontal",
                    wijmoSliderVertical: "wijmo-wijslider-vertical",
                    uiSliderRangeMax: "ui-slider-range-max",
                    uiSliderRangeMin: "ui-slider-range-min",
                    uiSlider: "ui-slider",
                    uiSliderHorizontal: "ui-slider-horizontal",
                    uiSliderVertical: "ui-slider-vertical"
                };
                /** The buttonMouseOver event is raised when the mouse is over
                *  the decrement button or the increment button.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IButtonEventArgs} args The data with this event.
                */
                this.buttonMouseOver = null;
                /** The buttonMouseOut event is raised when the mouse leaves
                *  the decrement button or the increment button.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IButtonEventArgs} args The data with this event.
                */
                this.buttonMouseOut = null;
                /** The buttonMouseDown event is raised when the mouse is down
                *  on the decrement button or the increment button.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IButtonEventArgs} args The data with this event.
                */
                this.buttonMouseDown = null;
                /** The buttonMouseUp event is raised when the mouse is up
                *  on the decrement button or the increment button.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IButtonEventArgs} args The data with this event.
                */
                this.buttonMouseUp = null;
                /** The buttonClick event is raised when the decrement button
                *  or the increment button is clicked.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IButtonEventArgs} args The data with this event.
                */
                this.buttonClick = null;
                /** The dragFill option, when set to true, allows the user to drag
                *  the fill between the thumb buttons on the slider widget.
                */
                this.dragFill = true;
                /** The minRange option prevents the two range handles (thumb buttons)
                *  from being placed on top of one another.
                */
                this.minRange = 0;
                /** The animate option defines the sliding animation that is
                *  applied to the slider handle when a user clicks outside the handle on the bar.
                * @remarks This option will accept a string representing one of the three predefined
                * speeds or a number representing the length of time in
                * milliseconds that the animation will run. The three predefined speeds are slow, normal, or fast.
                */
                this.animate = false;
                /** The max option defines the maximum value of the slider widget.
                */
                this.max = 100;
                /** The min option defines the minimum value of the slider widget.
                */
                this.min = 0;
                /** The orientation option determines whether the wijslider is positioned horizontally or vertically.
                * @remarks  If the slider is positioned horizontally, then the min value will be at the left and the max
                * value will be at the right. If the slider is positioned vertically, then the min value is at the bottom and
                * the max value is at the top of the widget. By default, the widget's orientation is horizontal.
                */
                this.orientation = "horizontal";
                /** The range option, if set to true, allows the slider to detect if you have two handles.
                * @type {boolean|string}
                * @remarks It will then create a stylable range element between the two handles.
                * You can also create a stylable range with one handle by using the 'min' and 'max' values.
                * A min range goes from the slider min value to the range handle. A max range goes from the range
                * handle to the slider max value.
                */
                this.range = false;
                /** The step option determines the size of each interval between the slider minimum value and the slider maximum value.
                * @remarks The full specified value range of the slider (from the minimum value to the maximum value)
                * must be evenly divisible by the step interval.
                */
                this.step = 1;
                /** The value option determines the total value of the slider widget when there is only one range handle.
                * @remarks If there are two range handles, then the value option determines the value of the first handle.
                */
                this.value = 0;
                /** The values option can be used to specify multiple handles.
                * @remarks If the range option is set to true, then the 'values' option must be set in order to have two handles.
                */
                this.values = null;
                /** The change event is triggered when the user stops moving the range handle or
                * when a value is changed programatically.
                * @remarks This event takes the event and ui arguments. please refer: http://api.jqueryui.com/slider/
                * Use event.originalEvent to detect if the value was changed programatically or through mouse or keyboard interaction.
                * @event
                */
                this.change = null;
                /** Triggered on every mouse move during slide.
                * @remarks please refer: http://api.jqueryui.com/slider/
                * @event
                */
                this.slide = null;
                /** The start event is triggered when the user begins to move the slider thumb.
                * @remarks please refer: http://api.jqueryui.com/slider/
                * @event
                */
                this.start = null;
                /** The stop event is triggered when the user stops sliding the slider thumb.
                * @remarks please refer: http://api.jqueryui.com/slider/
                * @event
                */
                this.stop = null;
            }
            return wijslider_options;
        })();        
        ;
        if($.ui && $.ui.slider) {
            wijslider.prototype.options = $.extend(true, {
            }, $.ui.slider.prototype.options, wijmo.wijmoWidget.prototype.options, new wijslider_options());
            $.wijmo.registerWidget(widgetName, $.ui.slider, wijslider.prototype);
        }
    })(wijmo.slider || (wijmo.slider = {}));
    var slider = wijmo.slider;
})(wijmo || (wijmo = {}));
