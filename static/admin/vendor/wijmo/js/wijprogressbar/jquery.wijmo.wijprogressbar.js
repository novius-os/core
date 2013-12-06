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
    /// <reference path="../Base/jquery.wijmo.widget.ts"/>
    /*globals setTimeout jQuery*/
    /*
    * Wijmo ProgressBar Widget
    *
    * Depends:
    *	Jquery-1.4.2.js
    *	jquery.ui.core.js
    *	jquery.ui.widget.js
    *
    *Optional dependence for effect settings:
    *	jquery.effects.core.js
    *	jquery.effects.blind.js
    *	jquery.effects.bounce.js
    *	jquery.effects.clip.js
    *	jquery.effects.drop.js
    *	jquery.effects.explode.js
    *	jquery.effects.fold.js
    *	jquery.effects.hightlight.js
    *	jquery.effects.pulsate.js
    *	jquery.effects.scale.js
    *	jquery.effects.shake.js
    *	jquery.effects.slide.js
    *	jquery.effects.transfer.js
    * HTML:
    *  <div id="progressbar" style="width:***;height:***"></div>
    */
    (function (progressbar) {
        "use strict";
        var $ = jQuery;
        var wijpbCss = "wijmo-wijprogressbar", pbCss = "ui-progressbar", pbLabelCss = pbCss + "-label", lblAlignPrefixCss = wijpbCss + "-lb-";
        /** @ignore */
        var JQueryUIProgress = (function (_super) {
            __extends(JQueryUIProgress, _super);
            function JQueryUIProgress() {
                _super.apply(this, arguments);

            }
            JQueryUIProgress.prototype._create = function () {
                return $.ui.progressbar.prototype._create.apply(this, arguments);
            };
            JQueryUIProgress.prototype._destroy = function () {
                return $.ui.progressbar.prototype._destroy.apply(this, arguments);
            };
            JQueryUIProgress.prototype._setOptions = function () {
                return $.ui.progressbar.prototype._setOptions.apply(this, arguments);
            };
            JQueryUIProgress.prototype._setOption = function (key, value) {
                return $.ui.progressbar.prototype._setOption.apply(this, arguments);
            };
            JQueryUIProgress.prototype._constrainedValue = function (value) {
                return $.ui.progressbar.prototype._constrainedValue.apply(this, arguments);
            };
            JQueryUIProgress.prototype.value = function (newValue) {
                return $.ui.progressbar.prototype.value.apply(this, arguments);
            };
            JQueryUIProgress.prototype._percentage = function () {
                return $.ui.progressbar.prototype._percentage.apply(this, arguments);
            };
            JQueryUIProgress.prototype._refreshValue = function (value) {
                return $.ui.progressbar.prototype._refreshValue.apply(this, arguments);
            };
            return JQueryUIProgress;
        })(wijmo.JQueryUIWidget);
        progressbar.JQueryUIProgress = JQueryUIProgress;        
        var wijprogressbar_options = (function () {
            function wijprogressbar_options() {
                /**
                * All CSS classes used in widgets.
                * @ignore
                */
                this.wijCSS = {
                    uiProgressbar: "ui-progressbar",
                    uiProgressbarValue: "ui-progressbar-value"
                };
                /** The label's alignment on the progress bar. The value should be "east",
                * "west", "center", "north", "south" or "running".
                */
                this.labelAlign = "center";
                /**The value of the progress bar,the type should be numeric.
                */
                this.maxValue = 100;
                /**The minimum value of the progress bar,the type should be numeric.
                */
                this.minValue = 0;
                /**The fill direction of the progress bar.the value should be "east",
                *"west", "north" or "south".
                */
                this.fillDirection = "east";
                /**Sets the format of the label text.
                * @remarks
                * The available formats are as follows:
                *{0} or {ProgressValue} express the current progress Value.
                *{1} or {PercentProgress} express the current percent of the progress bar.
                *{2} or {RemainingProgress} express the remaining progress of the
                *progress bar.
                *{3} or {PercentageRemaining} express the remaining percent of
                *the progress bar.
                *{4} or {Min} express the min Vlaue of the progress bar.
                *{5} or {Max} express the max Value of the progress bar.
                */
                this.labelFormatString = "{1}%";
                /**Set the format of the ToolTip of the progress bar,the expression of the
                * format like the labelFormatString.
                *,'{1}%').
                */
                this.toolTipFormatString = "{1}%";
                /**The increment of the progress bar's indicator.
                */
                this.indicatorIncrement = 1;
                /**The Url of the image's indicator.
                */
                this.indicatorImage = "";
                /**Gets or sets the delay time of the progress bar's animation in milliseconds. The default value of this option is "0".
                */
                this.animationDelay = 0;
                /**The options parameter of the jQuery's animation.
                * @type {object}
                */
                this.animationOptions = {
                    disabled: false,
                    easing: null,
                    duration: 500
                };
                /** Fire upon running the progress. The parameter is an object: {oldValue:xxx,newValue:xxx}. Returning "false" will stop the progress.
                * Return false to cancel the event.
                * @event
                * @dataKey {number} oldValue The old value of the progressbar.
                * @dataKey {number} newValue The new value of the progressbar.
                */
                this.progressChanging = null;
                /** Fires before running the progress. The parameters are an object: {oldValue:xxx,newValue:xxx}. Returning "false" prevents the running progress.
                * @event
                * @dataKey {number} oldValue The old value of the progressbar.
                * @dataKey {number} newValue The new value of the progressbar.
                * @return {boolean} return false to cancel the event.
                */
                this.beforeProgressChanging = null;
                /** Fires when the progress changes. The parameter is an object: {oldValue:xxx,newValue:xxx}.
                * @event
                * @dataKey {number} oldValue The old value of the progressbar.
                * @dataKey {number} newValue The new value of the progressbar.
                */
                this.progressChanged = null;
                /** The value of the progressbar.*/
                this.value = 0;
            }
            return wijprogressbar_options;
        })();        
        /** @widget
        * @extends jQuery.ui.progressbar
        */
        var wijprogressbar = (function (_super) {
            __extends(wijprogressbar, _super);
            function wijprogressbar() {
                _super.apply(this, arguments);

            }
            wijprogressbar.prototype._setOption = function (key, value) {
                var self = this, o = self.options, val;
                switch(key) {
                    case "value":
                        o[key] = parseInt(value, 10);
                        self._refreshValue();
                        return;
                    case "maxValue":
                        o.max = value;
                    case "minValue":
                        val = parseInt(value, 10);
                        o[key] = val;
                        self[key === "maxValue" ? "max" : "min"] = val;
                        self._refreshValue(true);
                        return;
                    case "labelFormatString":
                    case "toolTipFormatString":
                        o[key] = value;
                        self._refreshValue(true);
                        return;
                    case "fillDirection":
                    case "labelAlign":
                    case "indicatorImage":
                        o[key] = value;
                        self._updateElementsCss();
                        return;
                    default:
                        break;
                }
                $.Widget.prototype._setOption.apply(self, arguments);
                //Add for support disabled option at 2011/7/8
                if(key === "disabled") {
                    self._handleDisabledOption(value, self.element);
                }
                //end for disabled option
                            };
            wijprogressbar.prototype._create = function () {
                var self = this, o = self.options, wijCSS = o.wijCSS, element = self.element;
                // enable touch support:
                //if (window.wijmoApplyWijTouchUtilEvents) {
                //    $ = window.wijmoApplyWijTouchUtilEvents($);
                //}
                self.directions = {
                    east: "left",
                    west: "right",
                    north: "bottom",
                    south: "top"
                };
                self.min = o.minValue;
                //self.max = o.maxValue;
                self.max = o.max = o.maxValue//fixed bug when jui update to 1.8.18
                ;
                element.addClass(wijpbCss);
                //$.ui.progressbar.prototype._create.apply(self, arguments);
                _super.prototype._create.call(this);
                element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").addClass(wijCSS.uiProgressbar).addClass(wijCSS.widget).addClass(wijCSS.content).addClass(wijCSS.cornerAll);
                this.valueDiv.removeClass("ui-progressbar-value ui-widget-header ui-corner-left").addClass(wijCSS.uiProgressbarValue).addClass(wijCSS.header);
                self.label = $("<span>").addClass(pbLabelCss).appendTo(element);
                self._updateElementsCss();
                self._isInit = true;
                //Add for support disabled option
                if(o.disabled) {
                    self.disable();
                }
                //end for disabled option
                self._refreshValue();
            };
            wijprogressbar.prototype._handleDisabledOption = function (disabled, ele) {
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
            wijprogressbar.prototype._createDisabledDiv = function (outerEle) {
                var self = this, ele = //Change your outerelement here
                outerEle ? outerEle : self.element, eleOffset = ele.offset(), disabledWidth = ele.outerWidth(), disabledHeight = ele.outerHeight(), css = {
                    "z-index": "99999",
                    position: "absolute",
                    width: disabledWidth,
                    height: disabledHeight,
                    left: eleOffset.left,
                    top: eleOffset.top
                };
                if($.browser.msie) {
                    $.extend(css, {
                        "background-color": "#fff",
                        opacity: 0.1
                    });
                }
                return $("<div></div>").addClass("ui-disabled").css(css);
            };
            wijprogressbar.prototype._triggerEvent = function (eventName, oldValue, newValue, isFireEvent) {
                if(!isFireEvent) {
                    return;
                }
                return this._trigger(eventName, null, {
                    oldValue: oldValue,
                    newValue: newValue
                }) === false;
            };
            wijprogressbar.prototype._refreshValue = function (forced) {
                var self = this, o = self.options, isFireEvent, animationOptions = o.animationOptions, indicatorIncrement = o.indicatorIncrement, element = self.element, value, percent, oldValue;
                if(!self._isInit) {
                    return;
                }
                oldValue = element.attr("aria-valuenow");
                value = self.value();
                percent = (value - self.min) / (self.max - self.min) * 100;
                isFireEvent = parseInt(oldValue) != value;
                if(self._triggerEvent("beforeProgressChanging", oldValue, value, isFireEvent)) {
                    return;
                }
                if(!animationOptions.disabled && animationOptions.duration > 0) {
                    setTimeout(function () {
                        $.wijmo.wijprogressbar.animations.progress({
                            content: self.valueDiv,
                            complete: function () {
                                if(indicatorIncrement !== 1) {
                                    self._refreshProgress(percent, value, isFireEvent);
                                    if(o.labelAlign === "running") {
                                        self._updateRunningLabelCss(percent);
                                    }
                                }
                                self._triggerEvent("progressChanged", oldValue, value, isFireEvent);
                                self._lastStep = percent;
                            },
                            step: function (ovalue) {
                                self._performAnimating(ovalue, forced, isFireEvent);
                            },
                            progressValue: value * 100
                        }, animationOptions);
                    }, o.animationDelay);
                } else {
                    self._refreshProgress(Math.round(percent));
                    if(o.labelAlign === "running") {
                        self._updateRunningLabelCss(percent);
                    }
                    self._lastStep = percent;
                    self._triggerEvent("progressChanged", oldValue, value, isFireEvent);
                }
            };
            wijprogressbar.prototype._refreshProgress = function (percent, curValue, isFireEvent) {
                var self = this, o = self.options, wijCSS = o.wijCSS, fillDirection = o.fillDirection, element = self.element;
                if(curValue === undefined) {
                    curValue = $.wijmo.wijprogressbar.mul(percent, (self.max - self.min)) / 100 + self.min;
                }
                if(self._triggerEvent("progressChanging", element.attr("aria-valuenow"), curValue, isFireEvent)) {
                    return;
                }
                if(self._isHorizontal()) {
                    self.valueDiv.toggleClass(fillDirection === "east" ? wijCSS.cornerRight : wijCSS.cornerLeft, curValue === self.max).width(percent + "%");
                } else {
                    self.valueDiv.toggleClass(fillDirection === "south" ? wijCSS.cornerBottom : wijCSS.cornerTop, curValue === self.max).height(percent + "%");
                }
                self.label.html(self._getFormatString(o.labelFormatString, percent, curValue));
                if(!self._isHorizontal()) {
                    self._ajustLabelPosition();
                }
                element.attr("aria-valuenow", curValue).attr("title", self._getFormatString(o.toolTipFormatString, percent, curValue));
            };
            wijprogressbar.prototype._isHorizontal = function () {
                var fillDirection = this.options.fillDirection;
                return fillDirection === "west" || fillDirection === "east";
            };
            wijprogressbar.prototype._getRotateTextOffset = function (label) {
                var width, height;
                label.css("width", "auto");
                width = label.outerWidth();
                height = label.outerHeight();
                label.css("width", "");
                return Math.max(width - height - 4, 0);
            };
            wijprogressbar.prototype._updateElementsCss = function () {
                var self = this, o = self.options, element = self.element, fillDirection = o.fillDirection;
                element.removeClass(wijpbCss + "-west " + wijpbCss + "-east " + wijpbCss + "-north " + wijpbCss + "-south").addClass(wijpbCss + "-" + fillDirection);
                //pb progress
                self._updateProgressCss();
                //pb label
                self._updateLabelCss();
            };
            wijprogressbar.prototype._updateLabelCss = function () {
                var self = this, o = self.options, element = self.element, labelAlign = o.labelAlign, label = self.label, lastStep = self._lastStep, height = element.height();
                label.removeClass(lblAlignPrefixCss + "west " + lblAlignPrefixCss + "east " + lblAlignPrefixCss + "south " + lblAlignPrefixCss + "north " + lblAlignPrefixCss + "center " + lblAlignPrefixCss + "running").addClass(lblAlignPrefixCss + labelAlign).css({
                    left: "",
                    right: "",
                    top: "",
                    bottom: "",
                    width: "",
                    "text-align": "",
                    "line-height": ""
                });
                if(labelAlign !== "north" && labelAlign !== "south" && !(labelAlign === "running" && !self._isHorizontal())) {
                    label.css("line-height", height + "px");
                }
                if(labelAlign === "running") {
                    self._updateRunningLabelCss(lastStep);
                } else if(!self._isHorizontal()) {
                    //Add comments by RyanWu@20110325.
                    //Because nonIE brownser will rotate the text,
                    //I use a hack to set the text-align:right and
                    //width:100%, then rotate it to the north.
                    if(!$.browser.msie) {
                        if(labelAlign === "north") {
                            label.css("width", "100%").css("text-align", "right");
                        } else if(labelAlign === "south") {
                            label.css("width", "100%").css("text-align", "left");
                        }
                    }
                    //end by RyanWu@20110325.
                    self._ajustLabelPosition();
                }
            };
            wijprogressbar.prototype._updateRunningLabelCss = function (step) {
                var self = this, o = self.options, fillDirection = o.fillDirection, element = self.element, label = self.label, valueDiv = self.valueDiv, isHorizontal = self._isHorizontal(), pbLen, lblLen, pgLen, pos;
                pbLen = element[isHorizontal ? "width" : "height"]();
                lblLen = label[isHorizontal ? "outerWidth" : "outerHeight"]();
                pgLen = valueDiv[isHorizontal ? "outerWidth" : "outerHeight"]();
                //TODO:
                //Because the text will be rotated, we need calculate
                //the correct lengh of the rotated text.
                if(!isHorizontal && !$.browser.msie) {
                    lblLen += self._getRotateTextOffset(label);
                }
                pos = pbLen === pgLen ? pbLen - lblLen : step * pbLen / 100 - lblLen + lblLen * (pbLen - pgLen) / pbLen;
                label.css(self.directions[fillDirection], pos);
            };
            wijprogressbar.prototype._updateProgressCss = function () {
                var self = this, o = self.options, wijCSS = o.wijCSS, fillDirection = o.fillDirection, indicatorImage = o.indicatorImage, valueDiv = self.valueDiv, lastStep = self._lastStep, direction = self.directions[fillDirection];
                if(indicatorImage !== "") {
                    valueDiv.css("background", "transparent url(" + indicatorImage + ") repeat fixed");
                }
                valueDiv.removeClass(wijCSS.cornerLeft + " " + wijCSS.cornerRight + " " + wijCSS.cornerTop + " " + wijCSS.cornerBottom).addClass(wijCSS["corner" + direction.charAt(0).toUpperCase() + direction.substring(1)]);
                if(typeof lastStep === "number") {
                    if(self._isHorizontal()) {
                        valueDiv.css("width", lastStep + "%").css("height", "");
                    } else {
                        valueDiv.css("height", lastStep + "%").css("width", "");
                    }
                } else {
                    valueDiv.css({
                        width: "",
                        height: ""
                    });
                }
            };
            wijprogressbar.prototype._performAnimating = function (step, forced, isFireEvent) {
                var self = this, o = self.options, indicatorIncrement = o.indicatorIncrement, curValue = step / 100, percent = $.wijmo.wijprogressbar.div((curValue - self.min), (self.max - self.min)) * 100, ln = 0, arrP, base, resultPrecision = 2;
                if(indicatorIncrement) {
                    //arrP = percent.toString().split(".");
                    //if (arrP.length === 2) {
                    //	ln = arrP[1].length;
                    //	resultPrecision = ln;
                    //}
                    //base = Math.pow(10, ln);
                    if(indicatorIncrement !== 1) {
                        percent = Math.floor(percent / indicatorIncrement) * indicatorIncrement;
                    } else {
                        percent = Math.round(percent);
                        resultPrecision = 0;
                    }
                    self.pointNumber = ln;
                    if(self._lastStep === percent && !forced) {
                        return;
                    }
                }
                //self._lastStep = percent;
                self._refreshProgress(Number(percent.toFixed(resultPrecision)), Number(curValue.toFixed(resultPrecision)), isFireEvent);
                if(o.labelAlign === "running") {
                    self._updateRunningLabelCss(percent);
                }
            };
            wijprogressbar.prototype._getFormatString = function (format, percent, value) {
                var self = this, remainingProgress = self.max - value, percentageRemaining = 100 - percent, r = /\{0\}/g;
                format = format.replace(r, value.toString());
                r = /\{ProgressValue\}/g;
                format = format.replace(r, value.toString());
                r = /\{1\}/g;
                format = format.replace(r, percent.toString());
                r = /\{PercentProgress\}/g;
                format = format.replace(r, percent.toString());
                r = /\{2\}/g;
                format = format.replace(r, remainingProgress.toString());
                r = /\{RemainingProgress\}/g;
                format = format.replace(r, remainingProgress.toString());
                r = /\{3\}/g;
                format = format.replace(r, percentageRemaining.toString());
                r = /\{PercentageRemaining\}/g;
                format = format.replace(r, percentageRemaining.toString());
                r = /\{4\}/g;
                format = format.replace(r, self.min);
                r = /\{Min\}/g;
                format = format.replace(r, self.min);
                r = /\{5\}/g;
                format = format.replace(r, self.max);
                r = /\{Max\}/g;
                format = format.replace(r, self.max);
                return format;
            };
            wijprogressbar.prototype._ajustLabelPosition = function () {
                var self = this, o = self.options, tmpLabel;
                if(o.labelAlign === "north") {
                    tmpLabel = $("<span>").addClass("ui-widget").html(self.label.html()).appendTo('body').hide();
                    self.label.css("top", tmpLabel.width() - self.label.height());
                    tmpLabel.remove();
                }
            };
            wijprogressbar.prototype.value = /** Sets the current value of the progressbar.
            * @param {?number} newValue The value to set.
            */
            function (newValue) {
                return $.ui.progressbar.prototype.value.apply(this, arguments);
            };
            wijprogressbar.prototype.destroy = /**
            *Removes the wijprogressbar functionality completely. This returns the element to its pre-init state.
            */
            function () {
                var self = this, element = self.element;
                element.attr("title", "").removeClass(wijpbCss + " " + wijpbCss + "-east " + wijpbCss + "-west " + wijpbCss + "-north " + wijpbCss + "-south");
                if(self.label) {
                    self.label.remove();
                }
                //Add for support disabled option at 2011/7/8
                if(self.disabledDiv) {
                    self.disabledDiv.remove();
                    self.disabledDiv = null;
                }
                //end for disabled option
                $.ui.progressbar.prototype.destroy.apply(this, arguments);
            };
            return wijprogressbar;
        })(JQueryUIProgress);
        progressbar.wijprogressbar = wijprogressbar;        
        if($.ui && $.ui.progressbar) {
            wijprogressbar.prototype.options = $.extend(true, {
            }, wijmo.wijmoWidget.prototype.options, $.ui.progressbar.prototype.options, new wijprogressbar_options());
            $.wijmo.registerWidget("wijprogressbar", $.ui.progressbar, wijprogressbar.prototype);
            $.extend($.wijmo.wijprogressbar, {
                animations: {
                    progress: function (options, additions) {
                        options = $.extend({
                            easing: "swing",
                            duration: 1000
                        }, options, additions);
                        options.content.stop(true, true).animate({
                            pgvalue: //Because jquery's animation needs an
                            //attribute or css style to do the animation,
                            //here we use a temporary attribute to
                            //do the animation on the value div element.
                            options.progressValue
                        }, options);
                    }
                },
                add: function (arg1, arg2) {
                    var r1 = 0, r2 = 0, m;
                    try  {
                        r1 = arg1.toString().split(".")[1].length;
                    } catch (e) {
                    }
                    try  {
                        r2 = arg2.toString().split(".")[1].length;
                    } catch (e1) {
                    }
                    m = Math.pow(10, Math.max(r1, r2));
                    return (arg1 * m + arg2 * m) / m;
                },
                mul: function (arg1, arg2) {
                    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
                    try  {
                        m += s1.split(".")[1].length;
                    } catch (e) {
                    }
                    try  {
                        m += s2.split(".")[1].length;
                    } catch (e1) {
                    }
                    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
                },
                div: function (arg1, arg2) {
                    var t1 = 0, t2 = 0, r1, r2;
                    try  {
                        t1 = arg1.toString().split(".")[1].length;
                    } catch (e) {
                    }
                    try  {
                        t2 = arg2.toString().split(".")[1].length;
                    } catch (e1) {
                    }
                    r1 = Number(arg1.toString().replace(".", ""));
                    r2 = Number(arg2.toString().replace(".", ""));
                    return (r1 / r2) * Math.pow(10, t2 - t1);
                }
            });
        }
    })(wijmo.progressbar || (wijmo.progressbar = {}));
    var progressbar = wijmo.progressbar;
})(wijmo || (wijmo = {}));
