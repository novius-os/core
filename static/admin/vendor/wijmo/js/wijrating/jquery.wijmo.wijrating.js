/*
 *
 * Wijmo Library 3.20133.20
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
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="../Base/jquery.wijmo.widget.ts"/>
    /*globals jQuery, window*/
    /*
    * Depends:
    * 	jquery.js
    *	jquery.ui.core.js
    *	jquery.ui.widget.js
    *	jquery.wijmo.widget.js
    *	jquery.wijmo.util.js
    */
    (function (rating) {
        var _this = this;
        "use strict";
        var $ = jQuery;
        /** @widget */
        var wijrating = (function (_super) {
            __extends(wijrating, _super);
            function wijrating() {
                _super.apply(this, arguments);

            }
            wijrating.prototype._setOption = function (key, value) {
                var o = this.options, resetButton = $("." + o.wijCSS.wijratingResetButton, this.ratingElement[0]), starContainer = $("." + o.wijCSS.wijratingStarContainer, this.ratingElement[0]), stars = $("." + o.wijCSS.wijratingNormalStar, this.ratingElement[0]);
                if($.isPlainObject(o[key])) {
                    switch(key) {
                        case "resetButton":
                            if(typeof (value.disabled) !== 'undefined') {
                                if(value.disabled !== o[key].disabled) {
                                    if(value.disabled) {
                                        resetButton.hide();
                                        //add aria support.
                                        resetButton.attr("aria-hidden", true);
                                    } else {
                                        if(!o.disabled) {
                                            resetButton.show();
                                            //add aria support.
                                            resetButton.attr("aria-hidden", false);
                                        }
                                    }
                                }
                            }
                            if(typeof (value.hint) !== 'undefined') {
                                if(value.hint !== o[key].hint) {
                                    if(value.hint === null) {
                                        resetButton.attr("title", "");
                                    } else {
                                        resetButton.attr("title", value.hint);
                                    }
                                }
                            }
                            if(value.position && value.position.length) {
                                if(value.position !== o[key].position) {
                                    if(value.position === "rightOrBottom") {
                                        resetButton.parent().append(resetButton);
                                    } else {
                                        resetButton.parent().prepend(resetButton);
                                    }
                                }
                            }
                            if(typeof (value.customizedClass) !== 'undefined') {
                                if(value.customizedClass !== o[key].customizedClass) {
                                    if(o[key].customizedClass.length) {
                                        resetButton.removeClass(o[key].customizedClass);
                                    }
                                    if(value.customizedClass.length) {
                                        resetButton.addClass(value.customizedClass);
                                    }
                                }
                            }
                            break;
                        case "hint":
                            if(typeof (value.disabled) !== 'undefined') {
                                if(value.disabled !== o[key].disabled) {
                                    if(value.disabled) {
                                        stars.removeAttr("title");
                                    } else {
                                        this._resetHint(o.hint.content);
                                    }
                                }
                            }
                            if(typeof (value.content) !== 'undefined') {
                                if(value.content !== o[key].content) {
                                    if(!o[key].disabled) {
                                        this._resetHint(value.content);
                                    }
                                }
                            }
                            break;
                        case "icons":
                            if(typeof (value.iconsClass) !== 'undefined') {
                                if(o[key].iconsClass && o[key].iconsClass.length) {
                                    this._removeCustomizedIconsClass(o[key].iconsClass);
                                }
                                this._addCustomizedIconsClass(value.iconsClass, o.split);
                            }
                            if(typeof (value.hoverIconsClass) !== 'undefined') {
                                if(o[key].hoverIconsClass && o[key].hoverIconsClass.length) {
                                    this._removeCustomizedIconsClass(o[key].hoverIconsClass);
                                }
                            }
                            if(typeof (value.ratedIconsClass) !== 'undefined') {
                                if(o[key].ratedIconsClass && o[key].ratedIconsClass.length) {
                                    this._removeCustomizedIconsClass(o[key].ratedIconsClass);
                                }
                                this._resetValue(o.value, o.ratingMode, value.ratedIconsClass);
                            }
                            break;
                        default:
                            break;
                    }
                    $.extend(true, o[key], value);
                } else {
                    if(value === o[key]) {
                        return;
                    }
                    switch(key) {
                        case "disabled":
                            if(value) {
                                this._unbindLiveEvents();
                                resetButton.hide();
                                //add aria support.
                                resetButton.attr("aria-hidden", true);
                            } else {
                                this._bindLiveEvents();
                                if(!o.resetButton.disabled) {
                                    resetButton.show();
                                    //add aria support.
                                    resetButton.attr("aria-hidden", false);
                                }
                            }
                            break;
                        case "count":
                            this._createStars(o.split, value, starContainer);
                            break;
                        case "split":
                            this._createStars(value, o.count, starContainer);
                            break;
                        case "totalValue":
                            this._resetTotalValue(value);
                            break;
                        case "orientation":
                            if(value === "vertical") {
                                this.ratingElement.addClass(o.wijCSS.wijvRating);
                            } else {
                                this.ratingElement.removeClass(o.wijCSS.wijvRating);
                            }
                            if(o.split > 1) {
                                o[key] = value;
                                this._createStars(o.split, o.count, starContainer);
                            }
                            break;
                        case "direction":
                            o[key] = value;
                            this._createStars(o.split, o.count, starContainer);
                            break;
                        case "ratingMode":
                            this._resetValue(o.value, value, o.icons.ratedIconsClass);
                            break;
                        case "value":
                            if(o.min && value < o.min) {
                                return;
                            }
                            if(o.max && value > o.max) {
                                return;
                            }
                            this._resetValue(value, o.ratingMode, o.icons.ratedIconsClass);
                            break;
                        case "iconWidth":
                            o[key] = value;
                            this._createStars(o.split, o.count, starContainer);
                            break;
                        case "iconHeight":
                            o[key] = value;
                            this._createStars(o.split, o.count, starContainer);
                            break;
                        default:
                            break;
                    }
                    _super.prototype._setOption.call(this, key, value);
                }
            };
            wijrating.prototype._create = function () {
                var o = this.options, ratingElement;
                if(this.element.is("select")) {
                    this._parseSelect();
                    this.element.hide();
                    ratingElement = $("<div></div>");
                    this.element.after(ratingElement);
                } else if(this.element.is("div")) {
                    if(this.element.children("input[type='radio']").length > 0) {
                        this._parseRadio();
                        this.element.hide();
                        ratingElement = $("<div></div>");
                        this.element.after(ratingElement);
                    } else {
                        ratingElement = this.element;
                    }
                } else {
                    return;
                }
                this.ratingElement = ratingElement;
                this._createRating();
                if(!o.disabled) {
                    this._bindLiveEvents();
                }
                _super.prototype._create.call(this);
            };
            wijrating.prototype.destroy = /** The destroy() method will remove the rating functionality completely
            * and will return the element to its pre-init state.
            */
            function () {
                var o = this.options;
                this._unbindLiveEvents();
                if(this.element !== this.ratingElement) {
                    this.ratingElement.remove();
                    this.element.show();
                } else {
                    this.element.removeClass(o.wijCSS.widget).removeClass(o.wijCSS.wijrating).removeClass(o.wijCSS.wijvRating).empty();
                }
                _super.prototype.destroy.call(this);
            };
            wijrating.prototype._unbindLiveEvents = function () {
                var o = this.options;
                this.ratingElement.off(".wijrating", "." + o.wijCSS.wijratingNormalStar).off(".wijrating", "." + o.wijCSS.wijratingResetButton);
            };
            wijrating.prototype._bindLiveEvents = function () {
                var self = this, o = self.options, isStar = "." + o.wijCSS.wijratingNormalStar, isRestButton = "." + o.wijCSS.wijratingResetButton, args, starProxyObj = {
                    element: self.ratingElement,
                    mouseover: function (e) {
                        var tar = $(e.target), allStars = $(isStar, self.ratingElement[0]);
                        if(tar.is(isStar)) {
                            allStars.removeClass(o.wijCSS.wijratingHoverStar);
                            tar.addClass(o.wijCSS.wijratingHoverStar);
                            if(o.ratingMode === "continuous") {
                                if(o.direction === "reversed") {
                                    tar.parent().nextAll().children().addClass(o.wijCSS.wijratingHoverStar);
                                } else {
                                    tar.parent().prevAll().children().addClass(o.wijCSS.wijratingHoverStar);
                                }
                            }
                            self._addCustomizedHoverIconsClass(o.icons.hoverIconsClass, o.split, tar);
                            args = {
                                value: parseFloat(tar.html()),
                                target: tar
                            };
                            self._trigger("hover", e, args);
                        }
                    },
                    mouseout: function (e) {
                        var tar = $(e.target), allStars = $(isStar, self.ratingElement[0]);
                        if(tar.is(isStar)) {
                            allStars.removeClass(o.wijCSS.wijratingHoverStar);
                            self._removeCustomizedIconsClass(o.icons.hoverIconsClass);
                        }
                    },
                    click: function (e) {
                        var tar = $(e.target), val = parseFloat(tar.html()), allStars = $(isStar, self.ratingElement[0]), animation = {
                            duration: 500,
                            easing: null,
                            delay: 250,
                            animated: null
                        }, animations = $.wijmo.wijrating.animations, animated;
                        $.extend(true, animation, o.animation);
                        animated = animation.animated;
                        if(!tar.is(isStar)) {
                            return;
                        }
                        if(o.max && val > o.max) {
                            return;
                        }
                        if(o.min && val < o.min) {
                            return;
                        }
                        args = {
                            oldValue: o.value,
                            newValue: val,
                            target: tar
                        };
                        if(self._trigger("rating", e, args) === false) {
                            return false;
                        }
                        o.value = val;
                        self._resetValue(val, o.ratingMode, o.icons.ratedIconsClass);
                        allStars.removeClass(o.wijCSS.wijratingHoverStar);
                        self._removeCustomizedIconsClass(o.icons.hoverIconsClass);
                        args = {
                            value: val,
                            target: tar
                        };
                        if(animated) {
                            if(animations && animations[animated]) {
                                animations[animated](o, allStars, function () {
                                    self._trigger("rated", e, args);
                                });
                            } else if($.effects && ($.effects[animated] || ($.effects.effect && $.effects.effect[animated]))) {
                                //individual effects in jqueryui 1.9 are now defined on
                                // $.effects.effect rather than directly on $.effects.
                                self._playJqueryAnimation(animation, allStars, function () {
                                    //remove filter style to fix jquery animation
                                    //bug in ie8.
                                    if($.browser.msie && parseInt($.browser.version) < 9) {
                                        allStars.css("filter", "");
                                    }
                                    self._trigger("rated", e, args);
                                });
                            } else {
                                self._trigger("rated", e, args);
                            }
                        } else {
                            self._trigger("rated", e, args);
                        }
                    }
                }, resetButtonProxy = {
                    element: self.ratingElement,
                    mouseover: function (e) {
                        var tar = $(e.target);
                        tar = tar.closest("." + o.wijCSS.wijratingResetButton);
                        tar.addClass(o.wijCSS.wijratingHoverResetButton).addClass(o.wijCSS.stateHover);
                        if(o.resetButton.customizedHoverClass && o.resetButton.customizedHoverClass.length) {
                            tar.addClass(o.resetButton.customizedHoverClass);
                        }
                    },
                    mouseout: function (e) {
                        var tar = $(e.target);
                        tar = tar.closest("." + o.wijCSS.wijratingResetButton);
                        tar.removeClass(o.wijCSS.wijratingHoverResetButton).removeClass(o.wijCSS.stateHover);
                        if(o.resetButton.customizedHoverClass && o.resetButton.customizedHoverClass.length) {
                            tar.removeClass(o.resetButton.customizedHoverClass);
                        }
                    },
                    click: function (e) {
                        var tar = $(e.target);
                        self._setOption("value", 0);
                        args = {
                            target: tar
                        };
                        self._trigger("reset", e, args);
                    }
                };
                this.ratingElement.on("mouseover.wijrating", isStar, $.proxy(starProxyObj.mouseover, starProxyObj)).on("mouseout.wijrating", isStar, $.proxy(starProxyObj.mouseout, starProxyObj)).on("click.wijrating", isStar, $.proxy(starProxyObj.click, starProxyObj)).on("mouseover.wijrating", isRestButton, $.proxy(resetButtonProxy.mouseover, resetButtonProxy)).on("mouseout.wijrating", isRestButton, $.proxy(resetButtonProxy.mouseout, resetButtonProxy)).on("click.wijrating", isRestButton, $.proxy(resetButtonProxy.click, resetButtonProxy));
            };
            wijrating.prototype._createRating = function () {
                var element = this.ratingElement, o = this.options, resetButton, resetIcon, starContainer;
                element.addClass(o.wijCSS.wijrating).addClass(o.wijCSS.widget);
                if(o.orientation === "vertical") {
                    element.addClass(o.wijCSS.wijvRating);
                }
                //add reset button.
                resetButton = $("<div></div>").addClass(o.wijCSS.wijratingResetButton).addClass(o.wijCSS.cornerAll).addClass(o.wijCSS.stateDefault);
                if(o.resetButton.customizedClass && o.resetButton.customizedClass.length) {
                    resetButton.addClass(o.resetButton.customizedClass);
                }
                resetButton.appendTo(element);
                //add aria support.
                resetButton.attr("role", "button").attr("aria-label", "reset").attr("aria-hidden", false);
                if(o.resetButton.hint && o.resetButton.hint.length) {
                    resetButton.attr("title", o.resetButton.hint);
                }
                if(o.resetButton.disabled || o.disabled) {
                    resetButton.hide();
                    //add aria support
                    resetButton.attr("aria-hidden", true);
                }
                resetIcon = $("<span></span>");
                resetIcon.addClass(o.wijCSS.icon).addClass(o.wijCSS.iconClose);
                resetButton.append(resetIcon);
                //add star container.
                starContainer = $("<div></div>");
                //add aria support.
                starContainer.attr("role", "radiogroup").addClass(o.wijCSS.wijratingStarContainer);
                if(o.resetButton.position === "leftOrTop") {
                    starContainer.appendTo(element);
                } else {
                    starContainer.prependTo(element);
                }
                // create stars.
                this._createStars(o.split, o.count, starContainer);
            };
            wijrating.prototype._createStars = function (split, starCount, starContainer) {
                var o = this.options, hint = o.hint, content, star, val, nextVal = 0, idx = 0, splitIdx = 0, starWidth = Math.ceil(o.iconWidth / split), starHeight = Math.ceil(o.iconHeight / split), ratedIconsClass = o.icons.ratedIconsClass, customizedIconIdx, customizedIconClass, isCustomizedClass = ratedIconsClass && ratedIconsClass.length;
                starContainer.empty();
                for(idx; idx < starCount * split; idx++ , splitIdx++) {
                    val = Math.round((idx + 1) * o.totalValue * 100 / starCount / split) / 100;
                    nextVal = Math.round((idx + 2) * o.totalValue * 100 / starCount / split) / 100;
                    if(splitIdx === split) {
                        splitIdx = 0;
                    }
                    star = $("<div></div>");
                    //add aria support.
                    star.attr("role", "radio").attr("aria-checked", false);
                    if(o.orientation === "vertical") {
                        star.width(o.iconWidth).height(starHeight);
                    } else {
                        star.width(starWidth).height(o.iconHeight);
                    }
                    star.addClass(o.wijCSS.wijratingStar);
                    content = $("<div>" + val + "</div>");
                    content.addClass(o.wijCSS.wijratingNormalStar).width(o.iconWidth).height(o.iconHeight);
                    //add aria support.
                    star.attr("aria-label", val);
                    if(splitIdx > 0 && o.direction === "normal") {
                        if(o.orientation === "vertical") {
                            content.css({
                                "margin-top": "-" + splitIdx * starHeight + "px"
                            });
                        } else {
                            content.css({
                                "margin-left": "-" + splitIdx * starWidth + "px"
                            });
                        }
                    } else if(splitIdx < split - 1 && o.direction === "reversed") {
                        if(o.orientation === "vertical") {
                            content.css({
                                "margin-top": "-" + (split - 1 - splitIdx) * starHeight + "px"
                            });
                        } else {
                            content.css({
                                "margin-left": "-" + (split - 1 - splitIdx) * starWidth + "px"
                            });
                        }
                    }
                    if(!hint.disabled) {
                        if(hint.content && hint.content.length) {
                            if(idx <= hint.content.length) {
                                content.attr("title", hint.content[idx]);
                                //add aria support.
                                star.attr("aria-label", hint.content[idx]);
                            }
                        } else {
                            content.attr("title", val);
                        }
                    }
                    if(isCustomizedClass) {
                        if(typeof (ratedIconsClass) === "string") {
                            customizedIconClass = ratedIconsClass;
                        } else if($.isArray(ratedIconsClass)) {
                            customizedIconIdx = Math.floor(idx / split);
                            if(ratedIconsClass.length > customizedIconIdx) {
                                customizedIconClass = ratedIconsClass[customizedIconIdx];
                            }
                        }
                    }
                    if(val === o.value || (nextVal > o.value && val < o.value && o.ratingMode === "single")) {
                        content.addClass(o.wijCSS.wijratingRatedStar);
                        if(isCustomizedClass) {
                            content.addClass(customizedIconClass);
                        }
                        //add aria support.
                        star.attr("aria-checked", true);
                    } else if(val < o.value && o.ratingMode === "continuous") {
                        content.addClass(o.wijCSS.wijratingRatedStar);
                        if(isCustomizedClass) {
                            content.addClass(customizedIconClass);
                        }
                    }
                    content.appendTo(star);
                    if(o.direction === "reversed") {
                        star.prependTo(starContainer);
                    } else {
                        star.appendTo(starContainer);
                    }
                }
                //add customized class
                this._addCustomizedIconsClass(o.icons.iconsClass, split);
            };
            wijrating.prototype._resetValue = function (value, ratingMode, ratedIconsClass) {
                var o = this.options, stars = $("." + o.wijCSS.wijratingNormalStar, this.ratingElement[0]), rMode = ratingMode || o.ratingMode, isCustomizedClass = ratedIconsClass && ratedIconsClass.length, customizedIconIdx = 0, customizedIconClass;
                $.each(stars, function (idx, ele) {
                    var content = $(ele), val = parseFloat(content.html()), nextVal;
                    if(idx < stars.length - 1) {
                        nextVal = parseFloat($(stars[idx + 1]).html());
                    } else {
                        nextVal = o.direction === "normal" ? o.totalValue + 1 : -1;
                    }
                    content.removeClass(o.wijCSS.wijratingRatedStar);
                    //add aria support.
                    content.parent().attr("aria-checked", false);
                    if(isCustomizedClass) {
                        if(typeof (ratedIconsClass) === "string") {
                            content.removeClass(ratedIconsClass);
                            customizedIconClass = ratedIconsClass;
                        } else if($.isArray(ratedIconsClass)) {
                            $.each(ratedIconsClass, function (i, cl) {
                                content.removeClass(cl);
                            });
                            if(o.direction === "reversed") {
                                customizedIconIdx = Math.floor((stars.length - 1 - idx) / o.split);
                            } else {
                                customizedIconIdx = Math.floor(idx / o.split);
                            }
                            if(ratedIconsClass.length > customizedIconIdx) {
                                customizedIconClass = ratedIconsClass[customizedIconIdx];
                            }
                        }
                    }
                    if(val === value || (nextVal > value && val < value && rMode === "single")) {
                        content.addClass(o.wijCSS.wijratingRatedStar);
                        if(isCustomizedClass) {
                            content.addClass(customizedIconClass);
                        }
                        //add aria support.
                        content.parent().attr("aria-checked", true);
                    } else if(rMode === "continuous") {
                        if(val < value) {
                            content.addClass(o.wijCSS.wijratingRatedStar);
                            if(isCustomizedClass) {
                                content.addClass(customizedIconClass);
                            }
                        }
                    }
                });
            };
            wijrating.prototype._resetTotalValue = function (value) {
                var o = this.options, content = o.hint, stars = $("." + o.wijCSS.wijratingNormalStar, this.ratingElement[0]), starsLen = stars.length;
                $.each(stars, function (idx, star) {
                    var jStar = $(star), newVal = Math.round((idx + 1) * value * 100 / starsLen) / 100, val = parseFloat(jStar.html());
                    //set new value.
                    if(val === o.value) {
                        o.value = newVal;
                    }
                    jStar.html(newVal.toString());
                    if(content && content.length && content.length >= idx && content[idx] && content[idx].length) {
                        jStar.attr("title", content[idx]);
                    } else {
                        jStar.attr("title", newVal);
                    }
                });
            };
            wijrating.prototype._resetHint = function (content) {
                var o = this.options, stars = $("." + o.wijCSS.wijratingNormalStar, this.ratingElement[0]);
                $.each(stars, function (idx, star) {
                    var jStar = $(star), val = parseFloat(jStar.html());
                    if(content && content.length && content.length >= idx && content[idx] && content[idx].length) {
                        jStar.attr("title", content[idx]);
                    } else {
                        jStar.attr("title", val);
                    }
                });
            };
            wijrating.prototype._clearIntentTimer = function () {
                if(this.intentTimers && this.intentTimers.length) {
                    $.each(this.intentTimers, function (i, timer) {
                        if(timer) {
                            window.clearTimeout(timer);
                            timer = null;
                        }
                    });
                }
                this.intentTimers = [];
            };
            wijrating.prototype._playJqueryAnimation = function (animation, allStars, animationComplete) {
                var _this = this;
                var self = this, o = self.options, animationOption = {
                    easing: animation.easing
                }, animated = animation.animated;
                self._clearIntentTimer();
                $.each(allStars, function (i, star) {
                    var hideDelay = Math.floor(i / o.split) * animation.delay, intentHideTimer;
                    intentHideTimer = window.setTimeout(function () {
                        $(star).hide(animated, animationOption, animation.duration, function () {
                            if(i !== allStars.length - 1) {
                                return;
                            }
                            $.each(allStars, function (idx, showStar) {
                                var showDelay = Math.floor(idx / o.split) * animation.delay, intentShowTimer;
                                intentShowTimer = window.setTimeout(function () {
                                    $(showStar).show(animated, animationOption, animation.duration, function () {
                                        if(idx === allStars.length - 1) {
                                            if(animationComplete && $.isFunction(animationComplete)) {
                                                animationComplete.call(_this);
                                            }
                                        }
                                    });
                                }, showDelay);
                                self.intentTimers.push(intentShowTimer);
                            });
                        });
                    }, hideDelay);
                    self.intentTimers.push(intentHideTimer);
                });
            };
            wijrating.prototype._addCustomizedIconsClass = function (iconsClass, split) {
                var self = this, o = self.options, stars, idx = 0, iconsIdx = 0;
                if(iconsClass && iconsClass.length) {
                    stars = $("." + o.wijCSS.wijratingNormalStar, self.ratingElement[0]);
                    $.each(stars, function (i, star) {
                        if(idx === split) {
                            idx = 0;
                            iconsIdx++;
                        }
                        if(typeof (iconsClass) === "string") {
                            $(star).addClass(iconsClass);
                        } else if($.isArray(iconsClass)) {
                            var len = iconsClass.length;
                            if(iconsIdx < len) {
                                if(self.options.direction === "reversed") {
                                    $(star).addClass(iconsClass[len - iconsIdx - 1]);
                                } else {
                                    $(star).addClass(iconsClass[iconsIdx]);
                                }
                            }
                        }
                        idx++;
                    });
                }
            };
            wijrating.prototype._addCustomizedHoverIconsClass = function (hoverIconsClass, split, target) {
                var o = this.options, direction = o.direction, ratingMode = o.ratingMode, allStars = $("." + o.wijCSS.wijratingNormalStar, this.ratingElement[0]), tarIdx = allStars.index(target), iconIdx = 0, idx;
                if(hoverIconsClass && hoverIconsClass.length) {
                    if(typeof (hoverIconsClass) === "string") {
                        target.addClass(hoverIconsClass);
                        if(ratingMode !== "single") {
                            if(direction === "reversed") {
                                target.parent().nextAll().children().addClass(hoverIconsClass);
                            } else {
                                target.parent().prevAll().children().addClass(hoverIconsClass);
                            }
                        }
                    } else if($.isArray(hoverIconsClass)) {
                        if(ratingMode === "single") {
                            if(direction === "reversed") {
                                idx = allStars.length - 1 - tarIdx;
                            } else {
                                idx = tarIdx;
                            }
                            iconIdx = Math.floor(idx / split);
                            if(hoverIconsClass.length > iconIdx) {
                                target.addClass(hoverIconsClass[iconIdx]);
                            }
                        } else {
                            if(direction === "reversed") {
                                for(idx = allStars.length - 1; idx >= tarIdx; idx--) {
                                    iconIdx = Math.floor((allStars.length - 1 - idx) / split);
                                    if(hoverIconsClass.length > iconIdx) {
                                        $(allStars[idx]).addClass(hoverIconsClass[iconIdx]);
                                    }
                                }
                            } else {
                                for(idx = 0; idx <= tarIdx; idx++) {
                                    iconIdx = Math.floor(idx / split);
                                    if(hoverIconsClass.length > iconIdx) {
                                        $(allStars[idx]).addClass(hoverIconsClass[iconIdx]);
                                    }
                                }
                            }
                        }
                    }
                }
            };
            wijrating.prototype._removeCustomizedIconsClass = function (iconsClass) {
                var o = this.options, allStars = $("." + o.wijCSS.wijratingNormalStar, this.ratingElement[0]);
                if(iconsClass && iconsClass.length) {
                    if(typeof (iconsClass) === "string") {
                        allStars.removeClass(iconsClass);
                    } else if($.isArray(iconsClass)) {
                        $.each(iconsClass, function (idx, iconClass) {
                            allStars.removeClass(iconClass);
                        });
                    }
                }
            };
            wijrating.prototype._parseSelect = function () {
                var o = this.options, hintValues = [], opts = $("option", this.element);
                if(opts.length) {
                    o.count = opts.length;
                    o.totalValue = opts.length;
                    $.each(opts, function (idx, opt) {
                        var jOpt = $(opt);
                        hintValues.push(jOpt.html());
                        if(jOpt.is(":selected")) {
                            o.value = idx + 1;
                        }
                    });
                    o.hint.content = hintValues;
                }
            };
            wijrating.prototype._parseRadio = function () {
                var self = this, o = self.options, hintValues = [], radios = $("input[type='radio']", self.element);
                if(radios.length) {
                    o.count = radios.length;
                    o.totalValue = radios.length;
                    $.each(radios, function (idx, radio) {
                        var jRadio = $(radio), radioId = jRadio.attr("id"), jLabel;
                        if(radioId && radioId.length > 0) {
                            jLabel = $("label[for='" + radioId + "']", self.element);
                            if(jLabel.length) {
                                hintValues.push(jLabel.html());
                            } else {
                                hintValues.push("");
                            }
                        } else {
                            hintValues.push("");
                        }
                        if(jRadio.is(":checked")) {
                            o.value = idx + 1;
                        }
                    });
                    o.hint.content = hintValues;
                }
            };
            return wijrating;
        })(wijmo.wijmoWidget);
        rating.wijrating = wijrating;        
        var wijrating_options = (function () {
            function wijrating_options() {
                /** @ignore*/
                this.wijCSS = {
                    wijrating: "wijmo-wijrating",
                    wijratingStarContainer: "wijmo-wijrating-starcontainer",
                    wijratingResetButton: "wijmo-wijrating-reset",
                    wijratingHoverResetButton: "wijmo-wijrating-resethover",
                    wijratingStar: "wijmo-wijrating-star",
                    wijratingNormalStar: "wijmo-wijrating-normal",
                    wijratingHoverStar: "wijmo-wijrating-hover",
                    wijratingRatedStar: "wijmo-wijrating-rated",
                    wijvRating: "wijmo-wijrating-vertical"
                };
                /** @ignore*/
                this.wijMobileCSS = {
                    iconClose: "ui-icon-delete"
                };
                /** A value that determines whether or not to disable the rating widget. */
                this.disabled = false;
                /** A value that determines the number of stars to display. */
                this.count = 5;
                /** An option that determines the number of sections into which each star will be split. */
                this.split = 1;
                /** An option that determines the total value of the rating widget.
                * @remarks For example, in a rating widget with 5 stars the count is 5. A split of 2 means that each star is split into two parts.
                * If the totalValue of the stars is 100, then each part of the split star has a value of 10 and each whole star has a value of 20.
                * The step can be represented by this equation: 100/(5 * 2) = 10 and the value of one star can be represented by this equation: 10*(1 * 2) = 20.
                */
                this.totalValue = 5;
                /** An option that determines the rated value of the rating widget. */
                this.value = 0;
                /** An option that defines the minimum value that can be rated using the rating widget.
                * @type {number}
                */
                this.min = null;
                /** An option that defines the maximum value that can be rated using the rating widget.
                * @type {number}
                */
                this.max = null;
                /** The resetButton option determines the properties of the widget's reset button.
                * @remarks The reset button is used to reset the rated value to 0.
                * If the rating widget is disabled, the reset button will be hidden.
                */
                this.resetButton = {
                    disabled: /** An option that determines whether to show the reset button. */
                    false,
                    hint: /** An option that controls the text shown when hovering over the button. */
                    "cancel this rating!",
                    position: /** The position sub-property defines the resetButton's position in relation to the rating widget.
                    * @remarks Options are "leftOrTop", "rightOrBottom".
                    */
                    "leftOrTop",
                    customizedClass: /** The value that controls the customized class added to the reset button. */
                    "",
                    customizedHoverClass: /** An option that controls the customized class added to the reset button when a user hovers over it. */
                    ""
                };
                /** A value that controls the hint information shown when hovering over the rating star. */
                this.hint = {
                    disabled: /** An option that determines whether or not to show the hint. */
                    false,
                    content: /** An option that determines the values that will be shown when a star is hovered over.
                    * @type {array}
                    * @remarks If the content is null and disabled is false, then the hint will
                    * show the value of each star.
                    */
                    null
                };
                /** The orientation option determines the orientation of the rating widget.
                * @remarks Options are "horizontal" and "vertical".
                */
                this.orientation = "horizontal";
                /** The direction option determines the direction in which items are rated.
                * @remarks Options are "normal" and "reversed". The "normal" represents rating
                * from left to right or top to bottom.
                */
                this.direction = "normal";
                /** The ratingMode option determines how the widget performs the rating function.
                * The widget can rate things continuously or singly.
                * @remarks Options are "continuous" and "single". The "single" option represents
                * that only one star can be rated, while "continuous" represents that
                * all the stars from first to the rated one will be rated.
                */
                this.ratingMode = "continuous";
                /** A value that indicates the settings for customized rating icons. */
                this.icons = {
                    iconsClass: /** A string or an array value that indicates the urls of icons.
                    * @type {string|array}
                    * @remarks If the value is a string, then all the star will apply the iconsClass.
                    * If the value is an array, then each star will apply the related
                    * iconsClass value by index.
                    */
                    null,
                    hoverIconsClass: /** A string or an array value indicates the urls of hover icons.
                    * @type {string|array}
                    * @remarks If the value is a string, then all the star will apply the iconsClass when hovered over.
                    * If the value is an array, then each star will apply the
                    * related iconsClass value by index when hovered over.
                    */
                    null,
                    ratedIconsClass: /** A string or an array value indicates the urls of rated icons.
                    * @type {string|array}
                    * @remarks If the value is a string, then all the rated star will apply the iconsClass.
                    * If the value is an array, then each rated star will apply the related
                    * iconsClass value by index.
                    */
                    null
                };
                /** An option that determines the width of the icon. All icons should have the same width. */
                this.iconWidth = 16;
                /** An option that determines the height of the icon. All icons should have the same height. */
                this.iconHeight = 16;
                /** An option that controls aspects of the widget's animation,
                * such as the animation effect  and easing.
                * @type {object}
                * @remarks animation.animated defines the animation effect for the rating widget.
                * animation.duration defines the length of the animation effect in milliseconds.
                * animation.easing defines the easing effect of an animation.
                * animation.delay defines the length of the delay in milliseconds.
                */
                this.animation = null;
                /** The rating event fires before widget rating.
                * You can use this event if you'd like to track the rated values.
                * You can cancel this event by returning false.
                * @event
                * @dataKey {number} oldValue The previously rated value.
                * @dataKey {number} newValue The new value that is to be rated.
                * @dataKey target The rated object.
                */
                this.rating = null;
                /** The rated event fires after the widget is rated.
                * @event
                * @dataKey {number} value The rated value.
                * @dataKey target The rated object.
                */
                this.rated = null;
                /** The reset event fires when the reset button is clicked.
                * @event
                */
                this.reset = null;
                /** The hover event fires when a user hovers over a rating icon.
                * You can use this event to trigger something, such as an alert,
                * when a user hovers over one of the rating icons.
                * @event
                * @dataKey {number} value The value of hovered object.
                * @dataKey target The hovered object.
                */
                this.hover = null;
            }
            return wijrating_options;
        })();        
        wijrating.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijrating_options());
        $.wijmo.registerWidget("wijrating", wijrating.prototype);
        //prevent jqm's default behavior for <select> markup.
        if($.mobile) {
            $.mobile.selectmenu.prototype.options.initSelector = $.mobile.selectmenu.prototype.options.initSelector + ":not( :jqmData(role='wijrating') )";
        }
        $.extend($.wijmo.wijrating, {
            animations: {
                scroll: function (options, stars, animationComplete) {
                    var o = options, aniCmp = animationComplete, duration = 250, delay = 500, easing = "linear", starDelay = 250, starsArr = jQuery.makeArray(stars);
                    starsArr.reverse();
                    $.each(starsArr, function (i, star) {
                        var hideDelay = Math.floor(i / o.split) * starDelay, showAnimate = {
                            width: 0
                        }, intentHideTimer, delayTimer;
                        intentHideTimer = window.setTimeout(function () {
                            $(star).animate(showAnimate, duration, easing, function () {
                                window.clearTimeout(intentHideTimer);
                                if(i !== stars.length - 1) {
                                    return;
                                }
                                delayTimer = window.setTimeout(function () {
                                    $.each(stars, function (idx, showStar) {
                                        var showDelay = Math.floor(idx / o.split) * starDelay, hideAnimate = {
                                            width: o.iconWidth
                                        }, intentShowTimer;
                                        intentShowTimer = window.setTimeout(function () {
                                            var _this = this;
                                            $(showStar).animate(hideAnimate, duration, easing, function () {
                                                window.clearTimeout(intentShowTimer);
                                                if(idx === stars.length - 1) {
                                                    if(aniCmp && $.isFunction(aniCmp)) {
                                                        aniCmp.call(_this);
                                                    }
                                                }
                                            });
                                        }, showDelay);
                                    });
                                    window.clearTimeout(delayTimer);
                                }, delay);
                            });
                        }, hideDelay);
                    });
                    if(animationComplete && $.isFunction(animationComplete)) {
                        animationComplete.call(_this);
                    }
                }
            }
        });
        ;
        ;
    })(wijmo.rating || (wijmo.rating = {}));
    var rating = wijmo.rating;
})(wijmo || (wijmo = {}));
