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
    /// <reference path="../External/declarations/globalize.d.ts"/>
    /// <reference path="../Base/jquery.wijmo.widget.ts" />
    /// <reference path="../wijtooltip/jquery.wijmo.wijtooltip.ts"/>
    /*globals jQuery,window,document*/
    /*
    * Depends:
    *     jquery.ui.core.js
    *     jquery.ui.widget.js
    *     jquery.wijmo.wijtooltip.js
    */
    (function (video) {
        "use strict";
        var $ = jQuery, widgetName = "wijvideo", wijvideoClass = //Classes
        "wijmo-wijvideo", wijvideoWrapperClass = "wijmo-wijvideo-wrapper", wijvideoControlsClass = "wijmo-wijvideo-controls", wijvideoPlayClass = "wijmo-wijvideo-play", wijvideoIndexClass = "wijmo-wijvideo-index", wijvideoIndexSliderClass = "wijmo-wijvideo-index-slider", wijvideoTimerClass = "wijmo-wijvideo-timer", wijvideoVolumeClass = "wijmo-wijvideo-volume", wijvideoVolumeContainerClass = "wijmo-wijvideo-volume-container", wijvideoVolumeSliderClass = "wijmo-wijvideo-volumeslider", wijvideoFullScreen = "wijmo-wijvideo-fullscreen", wijvideoContainerFullScreenClass = "wijmo-wijvideo-container-fullscreen";
        /** @widget */
        var wijvideo = (function (_super) {
            __extends(wijvideo, _super);
            function wijvideo() {
                _super.apply(this, arguments);

            }
            wijvideo.prototype._create = function () {
                var self = this, pos, $playbtn, videoIsSupport, interval, wijvideoControl, o = self.options, wijCSS = self.options.wijCSS;
                if($(this.element).is("video")) {
                    this.$video = $(this.element);
                } else {
                    this.$video = $(this.element).find("video");
                }
                //update for fixing bug 18129 by wh at 2011/11/2
                if(!this.$video || this.$video.length === 0 || ($.browser.msie && parseInt($.browser.version, 10) < 9)) {
                    return;
                }
                //end for fixing
                //Add for fixing bug 18204 by wh at 2011/11/7
                videoIsSupport = this.$video[0].canPlayType;
                if(!videoIsSupport) {
                    return;
                }
                //end for fixing bug 18204
                this.$video.wrap($("<div></div>").addClass(wijvideoClass).addClass(wijCSS.wijvideo).addClass(wijCSS.content).addClass(wijCSS.widget)).after($("<div></div>").addClass(wijvideoWrapperClass).addClass(wijCSS.wijvideoWrapper).append($("<ul></ul>").addClass(wijvideoControlsClass).addClass(wijCSS.wijvideoControls).addClass(wijCSS.header).addClass(wijCSS.helperClearFix).addClass(wijCSS.helperReset).append($("<li></li>").addClass(wijvideoPlayClass).addClass(wijCSS.wijvideoPlay).addClass(wijCSS.stateDefault).addClass(wijCSS.cornerAll).append($("<span></span>").addClass(wijCSS.icon).addClass(wijCSS.iconPlay))).append($("<li></li>").addClass(wijvideoIndexClass).addClass(wijCSS.wijvideoIndex).append($("<div></div>").addClass(wijvideoIndexSliderClass).addClass(wijCSS.wijvideoIndexSlider))).append($("<li>00:00</li>").addClass(wijvideoTimerClass).addClass(wijCSS.wijvideoTimer).addClass(wijCSS.stateDefault)).append($("<li></li>").addClass(wijvideoVolumeClass).addClass(wijCSS.wijvideoVolume).addClass(wijCSS.stateDefault).addClass(wijCSS.cornerAll).append($("<div></div>").addClass(wijvideoVolumeContainerClass).addClass(wijCSS.wijvideoVolumeContainer).append($("<div></div>").addClass(wijvideoVolumeSliderClass).addClass(wijCSS.wijvideoVolumeSlider).addClass(wijCSS.stateDefault).addClass(wijCSS.cornerTop))).append($("<span></span>").addClass(wijCSS.icon).addClass(wijCSS.iconVolumeOn))).append($("<li></li>").addClass(wijvideoFullScreen).addClass(wijCSS.wijvideoFullScreen).addClass(wijCSS.stateDefault).addClass(wijCSS.cornerAll).append($("<span></span>").addClass(wijCSS.icon).addClass(wijCSS.iconArrow4Diag)))));
                this.$vidParent = this.$video.parent('.' + wijvideoClass);
                // size the div wrapper to the height and width of the controls
                this.$vidParent.width(this.$video.outerWidth()).height(this.$video.outerHeight());
                this.$seekSlider = this.$vidParent.find('.' + wijvideoIndexSliderClass);
                //Volumn
                self._volumnOn = true;
                self.$volumeBtn = this.$vidParent.find('.' + wijvideoVolumeClass);
                wijvideoControl = self.$video.parent().find('.' + wijvideoControlsClass);
                // create the video this.seek slider
                interval = window.setInterval(function () {
                    //replace the attr to prop
                    //if (this.$video.attr('readyState')) {
                    if(self._getVideoAttribute("readyState")) {
                        window.clearInterval(interval);
                        //note: we need to adjust the size of the video in
                        //this time
                        self.$vidParent.width(self.$video.outerWidth()).height(self.$video.outerHeight());
                        //note: if the controls is invisible, it will not
                        //get the position
                        wijvideoControl.show();
                        pos = self.$vidParent.find('.' + wijvideoTimerClass).position().left;
                        self.$seekSlider.width(pos - self.$seekSlider.position().left - 15);
                        self.$seekSlider.slider({
                            value: 0,
                            step: 0.01,
                            max: self._getVideoAttribute("duration"),
                            range: 'min',
                            stop: function (e, ui) {
                                self.seek = false;
                                self._setVideoAttribute("currentTime", ui.value);
                            },
                            slide: function () {
                                self.seek = true;
                            }
                        }).slider("widget").addClass(o.wijCSS.stateDefault);
                        self._updateTime();
                        // wire up the volume
                        self.$volumeSlider = self.$vidParent.find('.' + wijvideoVolumeSliderClass);
                        self.$volumeSlider.slider({
                            min: 0,
                            max: 1,
                            value: self._getVideoAttribute("volume"),
                            step: 0.1,
                            orientation: 'vertical',
                            range: 'min',
                            slide: function (e, ui) {
                                self._setVideoAttribute("volume", ui.value);
                                if(ui.value === 0) {
                                    self._volumnOn = false;
                                    self.$volumeBtn.find("span").removeClass(wijCSS.iconVolumeOn).addClass(wijCSS.iconVolumeOff);
                                } else {
                                    self._volumnOn = true;
                                    self.$volumeBtn.find("span").removeClass(wijCSS.iconVolumeOff).addClass(wijCSS.iconVolumeOn);
                                }
                            }
                        }).slider("widget").addClass(o.wijCSS.stateDefault);
                        wijvideoControl.css('display', 'none');
                        self._initialToolTip();
                        if(!o.showControlsOnHover) {
                            wijvideoControl.show();
                            self.$vidParent.height(self.$video.outerHeight() + wijvideoControl.height());
                        }
                    }
                }, 200);
                this.$video.bind("click." + self.widgetName, function () {
                    self._togglePlay();
                });
                // display the bar on hover
                if(o.showControlsOnHover) {
                    self.$vidParent.hover(function () {
                        wijvideoControl.stop(true, true).fadeIn();
                    }, function () {
                        wijvideoControl.delay(300).fadeOut();
                    });
                }
                $playbtn = this.$vidParent.find('.' + wijvideoPlayClass + ' > span');
                $playbtn.click(function () {
                    self._togglePlay();
                }).parent().hover(function () {
                    $(this).addClass(wijCSS.stateHover);
                }, function () {
                    $(this).removeClass(wijCSS.stateHover);
                });
                this.$vidParent.find('.' + wijvideoVolumeClass).hover(function () {
                    $('.' + wijvideoVolumeContainerClass).stop(true, true).slideToggle();
                });
                this.$fullScreenBtn = this.$vidParent.find('.' + wijvideoFullScreen + ' > span');
                this.$fullScreenBtn.click(function () {
                    self._toggleFullScreen();
                }).parent().hover(function () {
                    $(this).addClass(wijCSS.stateHover);
                }, function () {
                    $(this).removeClass(wijCSS.stateHover);
                });
                if(!self.options.fullScreenButtonVisible) {
                    this.$vidParent.find('.' + wijvideoFullScreen).hide();
                }
                this.$volumeBtn.hover(function () {
                    $(this).addClass(wijCSS.stateHover);
                }, function () {
                    $(this).removeClass(wijCSS.stateHover);
                }).click(function () {
                    if(self._getVideoAttribute("readyState")) {
                        self._volumnOn = !self._volumnOn;
                        if(!self._volumnOn) {
                            self.currentVolumn = self.$volumeSlider.slider('value');
                            self.$volumeSlider.slider('value', 0);
                            self._setVideoAttribute('volume', 0);
                            self.$volumeBtn.find("span").removeClass(wijCSS.iconVolumeOn).addClass(wijCSS.iconVolumeOff);
                        } else {
                            //self.currentVolumn = self.currentVolumn === 0 ? 100 : self.currentVolumn;
                            self.$volumeSlider.slider('value', self.currentVolumn ? self.currentVolumn : 1);
                            self._setVideoAttribute('volume', self.currentVolumn ? self.currentVolumn : 1);
                            self.$volumeBtn.find("span").removeClass(wijCSS.iconVolumeOff).addClass(wijCSS.iconVolumeOn);
                        }
                    }
                });
                //move the init tooltip to interval, when the video's state
                //is ready, then init the tooltip
                //self._initialToolTip();
                this.$video.bind('play.' + self.widgetName, function () {
                    $playbtn.removeClass(wijCSS.icon + " " + wijCSS.iconPlay).addClass(wijCSS.icon + " " + wijCSS.iconPause);
                });
                this.$video.bind('pause.' + self.widgetName, function () {
                    $playbtn.removeClass(wijCSS.icon + " " + wijCSS.iconPause).addClass(wijCSS.icon + " " + wijCSS.iconPlay);
                });
                this.$video.bind('ended.' + self.widgetName, function () {
                    self.pause();
                });
                this.$video.bind('timeupdate.' + self.widgetName, function () {
                    self._updateTime();
                });
                self._videoIsControls = false;
                if(self._getVideoAttribute("controls")) {
                    self._videoIsControls = true;
                }
                this.$video.removeAttr('controls');
                //update for visibility change
                if(self.element.is(":hidden") && self.element.wijAddVisibilityObserver) {
                    self.element.wijAddVisibilityObserver(function () {
                        self._refresh();
                        if(self.element.wijRemoveVisibilityObserver) {
                            self.element.wijRemoveVisibilityObserver();
                        }
                    }, "wijvideo");
                }
                //update for juice 22288
                if(self.options.disabled) {
                    self._handleDisabledOption(true, self.element);
                }
            };
            wijvideo.prototype._setOption = function (key, value) {
                var self = this, o = self.options, wijvideoControl = self.$video.parent().find('.' + wijvideoControlsClass), wijvideoFullScreen = self.$video.parent().find('.' + wijvideoFullScreen);
                //$.wijmo.widget.prototype._setOption.apply(self, arguments);
                _super.prototype._setOption.call(this, key, value);
                if(key === "fullScreenButtonVisible") {
                    o.fullScreenButtonVisible = value;
                    if(value) {
                        wijvideoFullScreen.show();
                    } else {
                        wijvideoFullScreen.hide();
                    }
                } else if(key === "disabled") {
                    self._handleDisabledOption(value, self.element);
                } else if(key === "showControlsOnHover") {
                    if(!value) {
                        self.$vidParent.unbind('mouseenter mouseleave');
                        window.setTimeout(function () {
                            wijvideoControl.show();
                            self.$vidParent.height(self.$video.outerHeight() + wijvideoControl.height());
                        }, 200);
                    } else {
                        this.$vidParent.height(this.$video.outerHeight());
                        wijvideoControl.hide();
                        self.$vidParent.hover(function () {
                            wijvideoControl.stop(true, true).fadeIn();
                        }, function () {
                            wijvideoControl.delay(300).fadeOut();
                        });
                    }
                }
                //end for disabled option
                            };
            wijvideo.prototype._handleDisabledOption = function (disabled, ele) {
                var self = this, wijvideoControl = self.$video.parent().find('.' + wijvideoControlsClass);
                if(disabled) {
                    if(!self.disabledDiv) {
                        self.disabledDiv = self._createDisabledDiv(ele);
                    }
                    self.disabledDiv.appendTo("body");
                    if($.browser.msie) {
                        self.$vidParent.unbind('mouseenter mouseleave');
                        this.$video.unbind("click." + self.widgetName);
                    }
                } else {
                    if(self.disabledDiv) {
                        self.disabledDiv.remove();
                        self.disabledDiv = null;
                        if($.browser.msie) {
                            self.$vidParent.hover(function () {
                                wijvideoControl.stop(true, true).fadeIn();
                            }, function () {
                                wijvideoControl.delay(300).fadeOut();
                            });
                            this.$video.bind("click." + self.widgetName, function () {
                                self._togglePlay();
                            });
                        }
                    }
                }
            };
            wijvideo.prototype._createDisabledDiv = function (outerEle) {
                var ele = this.$vidParent, eleOffset = ele.offset(), disabledWidth = ele.outerWidth(), disabledHeight = ele.outerHeight();
                return $("<div></div>").addClass("ui-disabled").css({
                    "z-index": "99999",
                    position: "absolute",
                    width: disabledWidth,
                    height: disabledHeight,
                    left: eleOffset.left,
                    top: eleOffset.top
                });
            };
            wijvideo.prototype._getVideoAttribute = function (name) {
                if(name === "") {
                    return;
                }
                return this.$video.prop(name);
            };
            wijvideo.prototype._setVideoAttribute = function (name, value) {
                if(name === "") {
                    return;
                }
                return this.$video.prop(name, value);
            };
            wijvideo.prototype._initialToolTip = function () {
                var self = this, wijCSS = self.options.wijCSS;
                //ToolTip-slider
                this.$seekSlider.wijtooltip({
                    mouseTrailing: true,
                    showCallout: false,
                    position: {
                        offset: '-60 -60'
                    }
                });
                this.$seekSlider.bind("mousemove", function (e, ui) {
                    self._changeToolTipContent(e);
                });
                //ToolTip-button
                this.$volumeBtn.wijtooltip({
                    content: self._localizeString("volumeToolTip", "Volume"),
                    showCallout: false
                });
                this.$fullScreenBtn.wijtooltip({
                    content: self._localizeString("fullScreenToolTip", "Full Screen"),
                    showCallout: false
                });
                //add class to prevent from overriding the origin css of tooltip.
                this.$seekSlider.wijtooltip("widget").addClass(wijvideoClass).addClass(wijCSS.wijvideo);
                this.$volumeBtn.wijtooltip("widget").addClass(wijvideoClass).addClass(wijCSS.wijvideo);
                this.$volumeBtn.wijtooltip("widget").addClass(wijvideoClass).addClass(wijCSS.wijvideo);
            };
            wijvideo.prototype._updateTime = function () {
                var self = this, dur = self._getVideoAttribute("duration"), cur = self._getVideoAttribute("currentTime"), mm, ss, mfmt = '', sfmt = '';
                mm = this._truncate((dur - cur) / 60);
                ss = this._truncate((dur - cur) - (mm * 60));
                if(mm < 10) {
                    mfmt = '0';
                }
                if(ss < 10) {
                    sfmt = '0';
                }
                this.$vidParent.find('.' + wijvideoTimerClass).html(mfmt + mm + ':' + sfmt + ss);
                if(!this.seek && this.$seekSlider.data("ui-slider")) {
                    this.$seekSlider.slider('value', cur);
                }
            };
            wijvideo.prototype._truncate = function (n) {
                return Math[n > 0 ? "floor" : "ceil"](n);
            };
            wijvideo.prototype._togglePlay = function () {
                var self = this;
                if(!self._getVideoAttribute("readyState")) {
                    return;
                }
                if(self._getVideoAttribute("paused")) {
                    this.play();
                } else {
                    this.pause();
                }
            };
            wijvideo.prototype._toggleFullScreen = function () {
                var self = this, wijCSS = self.options.wijCSS, isPaused = self._getVideoAttribute("paused"), offsetWidth = 0, fWidth = $(window).width(), fHeight = $(window).height();
                this.fullScreen = !this.fullScreen;
                if(this.fullScreen) {
                    self._oriVidParentStyle = this.$vidParent.attr("style");
                    self._oriWidth = this.$video.outerWidth();
                    self._oriHeight = this.$video.outerHeight();
                    self._oriDocOverFlow = $(document.documentElement).css("overflow");
                    $(document.documentElement).css({
                        overflow: "hidden"
                    });
                    if(!self._replacedDiv) {
                        self._replacedDiv = $("<div />");
                    }
                    this.$vidParent.after(self._replacedDiv);
                    this.$vidParent.addClass(wijvideoContainerFullScreenClass).addClass(wijCSS.wijvideoContainerFullScreen).css({
                        width: fWidth,
                        height: fHeight
                    }).appendTo($("body"));
                    this.$video.attr("width", fWidth).attr("height", fHeight);
                    $(window).bind("resize.wijvideo", function () {
                        self._fullscreenOnWindowResize();
                    });
                    //for reposition the video control
                    offsetWidth = fWidth - self._oriWidth;
                } else {
                    $(document.documentElement).css({
                        overflow: self._oriDocOverFlow
                    });
                    //for reposition the video control
                    offsetWidth = self._oriWidth - this.$video.width();
                    self._replacedDiv.after(this.$vidParent).remove();
                    this.$vidParent.removeClass(wijvideoContainerFullScreenClass).removeClass(wijCSS.wijvideoContainerFullScreen).attr("style", "").attr("style", self._oriVidParentStyle);
                    this.$video.attr("width", self._oriWidth).attr("height", self._oriHeight);
                    $(window).unbind("resize.wijvideo");
                }
                self._positionControls(offsetWidth);
                self._hideToolTips();
                if(!isPaused) {
                    self.play();
                } else {
                    self.pause();
                }
            };
            wijvideo.prototype._fullscreenOnWindowResize = function () {
                var self = this, fWidth = $(window).width(), fHeight = $(window).height(), offsetWidth = fWidth - this.$vidParent.width();
                this.$vidParent.css({
                    width: fWidth,
                    height: fHeight
                });
                this.$video.attr("width", fWidth).attr("height", fHeight);
                self._positionControls(offsetWidth);
            };
            wijvideo.prototype._positionControls = function (offsetWidth) {
                var seekSlider = this.$vidParent.find('.' + wijvideoIndexSliderClass);
                seekSlider.width(seekSlider.width() + offsetWidth);
            };
            wijvideo.prototype._showToolTip = function (e) {
                var self = this, mousePositionX = e.pageX, mousePositionY = e.pageY, sliderOffset = this.$seekSlider.offset().left, sliderWidth = this.$seekSlider.width(), curWidth = mousePositionX - sliderOffset, dur = self._getVideoAttribute("duration"), currentTime;
                currentTime = dur * (curWidth / sliderWidth);
                this.$seekSlider.wijtooltip("option", "content", self._getToolTipContent(currentTime));
                this.$seekSlider.wijtooltip("showAt", {
                    x: mousePositionX,
                    y: mousePositionY - 10
                });
            };
            wijvideo.prototype._changeToolTipContent = function (e) {
                var self = this, mousePositionX = e.pageX, sliderOffset = this.$seekSlider.offset().left, sliderWidth = this.$seekSlider.width(), curWidth = mousePositionX - sliderOffset, dur = self._getVideoAttribute("duration"), currentTime;
                currentTime = dur * (curWidth / sliderWidth);
                this.$seekSlider.wijtooltip("option", "content", self._getToolTipContent(currentTime));
            };
            wijvideo.prototype._hideToolTips = function () {
                if(this.$seekSlider.data("wijmoWijtooltip")) {
                    this.$seekSlider.wijtooltip("hide");
                }
                if(this.$volumeBtn.data("wijmoWijtooltip")) {
                    this.$volumeBtn.wijtooltip("hide");
                }
                if(this.$fullScreenBtn.data("wijmoWijtooltip")) {
                    this.$fullScreenBtn.wijtooltip("hide");
                }
            };
            wijvideo.prototype._localizeString = function (key, defaultValue) {
                var o = this.options;
                if(o.localization && o.localization[key]) {
                    return o.localization[key];
                }
                return defaultValue;
            };
            wijvideo.prototype._getToolTipContent = function (currentTime) {
                var mm, ss, mfmt = '', sfmt = '';
                mm = parseInt((currentTime / 60).toString(), 10);
                ss = parseInt((currentTime - (mm * 60)).toString(), 10);
                if(mm < 10) {
                    mfmt = '0';
                }
                if(ss < 10) {
                    sfmt = '0';
                }
                return mfmt + mm + ':' + sfmt + ss;
            };
            wijvideo.prototype._refresh = function () {
                var pos, wijvideoControl = this.$video.parent().find('.' + wijvideoControlsClass);
                wijvideoControl.show();
                pos = this.$vidParent.find('.' + wijvideoTimerClass).position().left;
                this.$seekSlider.width(pos - this.$seekSlider.position().left - 15);
                wijvideoControl.css('display', 'none');
                if(!this.options.showControlsOnHover) {
                    wijvideoControl.show();
                    this.$vidParent.height(this.$video.outerHeight() + wijvideoControl.height());
                }
            };
            wijvideo.prototype.destroy = /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            function () {
                var self = this;
                //$.wijmo.widget.prototype.destroy.apply(this, arguments);
                _super.prototype.destroy.call(this);
                //remove the controls
                this.$vidParent.after(this.$video).remove();
                this.$video.unbind('.' + self.widgetName);
                if(self._videoIsControls) {
                    self._setVideoAttribute("controls", true);
                }
            };
            wijvideo.prototype.play = /** Play the video.
            */
            function () {
                this.$video[0].play();
            };
            wijvideo.prototype.pause = /** Pause the video.
            */
            function () {
                this.$video[0].pause();
            };
            wijvideo.prototype.getWidth = /** Gets the video width in pixel.
            */
            function () {
                return this.$video.outerWidth();
            };
            wijvideo.prototype.setWidth = /** Sets the video width in pixel.
            * @param {number} width Width value in pixel.
            * @example
            * // Sets the video width to 600 pixel.
            * $("#element").wijvideo("setWidth", 600);
            */
            function (width) {
                width = width || 600;
                var origWidth = this.getWidth();
                this.$video.attr('width', width);
                this.$vidParent.width(this.$video.outerWidth());
                this._positionControls(this.getWidth() - origWidth);
            };
            wijvideo.prototype.getHeight = /** Gets the video height in pixel.
            */
            function () {
                return this.$video.outerHeight();
            };
            wijvideo.prototype.setHeight = /** Sets the video height in pixel.
            * @param {number} height Height value in pixel.
            * @example
            * // Sets the video height to 400 pixel.
            * $("#element").wijvideo("setHeight", 400);
            */
            function (height) {
                height = height || 400;
                this.$video.attr('height', height);
                if(this.options.showControlsOnHover) {
                    this.$vidParent.height(this.$video.outerHeight());
                } else {
                    this.$vidParent.height(this.$video.outerHeight() + this.$video.parent().find('.' + wijvideoControlsClass).height());
                }
            };
            return wijvideo;
        })(wijmo.wijmoWidget);
        video.wijvideo = wijvideo;        
        var wijvideo_options = (function () {
            function wijvideo_options() {
                /** Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijvideo')";
                /** All CSS classes used in widgets that use jQuery UI CSS Framework.
                * @ignore
                */
                this.wijCSS = {
                    iconVolumeOn: "ui-icon-volume-on",
                    iconVolumeOff: "ui-icon-volume-off",
                    wijvideo: "",
                    wijvideoWrapper: "",
                    wijvideoControls: "",
                    wijvideoPlay: "",
                    wijvideoIndex: "",
                    wijvideoIndexSlider: "",
                    wijvideoTimer: "",
                    wijvideoVolume: "",
                    wijvideoVolumeContainer: "",
                    wijvideoVolumeSlider: "",
                    wijvideoFullScreen: "",
                    wijvideoContainerFullScreen: ""
                };
                /** A value that indicates whether to show the full screen button. */
                this.fullScreenButtonVisible = true;
                /** Determines whether to display the controls only when hovering the mouse to the video. */
                this.showControlsOnHover = true;
                /** Use the localization option in order to localize text which not depends on culture.
                * @remarks
                * The default localization: {
                *	    volumeToolTip: "Volume",
                *	    fullScreenToolTip: "Full Screen"
                *      }
                * @example
                * $("#video").wijvideo(
                *			{
                *				localization: {
                *				volumeToolTip: "newVolume",
                *				fullScreenToolTip: "newFullScreen"
                *			}
                *		});
                */
                this.localization = null;
            }
            return wijvideo_options;
        })();        
        wijvideo.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijvideo_options());
        $.wijmo.registerWidget("wijvideo", wijvideo.prototype);
    })(wijmo.video || (wijmo.video = {}));
    var video = wijmo.video;
})(wijmo || (wijmo = {}));
