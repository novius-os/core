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
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery, widgetName = "wijvideo";
    var wijvideo = (function (_super) {
        __extends(wijvideo, _super);
        function wijvideo() {
            _super.apply(this, arguments);

        }
        wijvideo.prototype._create = function () {
            var self = this, pos, $playbtn, videoIsSupport, wijCSS = self.options.wijCSS, o = self.options, interval;
            // enable touch support:
            if(window.wijmoApplyWijTouchUtilEvents) {
                $ = window.wijmoApplyWijTouchUtilEvents($);
            }
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
            this.$video.wrap('<div class="wijmo-wijvideo ' + wijCSS.content + ' ' + wijCSS.widget + '" />').after('<div class="wijmo-wijvideo-wrapper">' + '<ul class="wijmo-wijvideo-controls ' + wijCSS.header + ' ' + wijCSS.helperClearFix + ' ' + wijCSS.helperReset + '">' + '<li class="wijmo-wijvideo-play ' + wijCSS.stateDefault + ' ' + wijCSS.cornerAll + '">' + '<span class="' + wijCSS.icon + " " + wijCSS.iconPlay + '"></span>' + '</li>' + '<li class="wijmo-wijvideo-index"><div class="wijmo-wijvideo-index-slider"></div></li>' + '<li class="wijmo-wijvideo-timer">00:00</li>' + '<li class="wijmo-wijvideo-volume ' + wijCSS.stateDefault + ' ' + wijCSS.cornerAll + '">' + '<div class="wijmo-wijvideo-volume-container">' + '<div class="wijmo-wijvideo-volumeslider ' + wijCSS.stateDefault + ' ' + wijCSS.cornerTop + '"></div>' + '</div>' + '<span class="' + wijCSS.icon + " " + wijCSS.iconVolumeOn + '"></span>' + '</li>' + '<li class="wijmo-wijvideo-fullscreen ' + wijCSS.stateDefault + " " + wijCSS.cornerAll + '">' + '<span class="' + wijCSS.icon + " " + wijCSS.iconArrow4Diag + '"></span>' + '</li>' + '</ul>' + '</div>');
            this.$vidParent = this.$video.parent('.wijmo-wijvideo');
            // size the div wrapper to the height and width of the controls
            this.$vidParent.width(this.$video.outerWidth()).height(this.$video.outerHeight());
            this.$seekSlider = this.$vidParent.find('.wijmo-wijvideo-index-slider');
            //Volumn
            self._volumnOn = true;
            this.$volumeBtn = this.$vidParent.find('.wijmo-wijvideo-volume');
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
                    self.$video.parent().find('.wijmo-wijvideo-controls').show();
                    //this.$seekSlider = this.$vidParent.find('.wijmo-wijvideo-index-slider');
                    pos = self.$vidParent.find('.wijmo-wijvideo-timer').position().left;
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
                    });
                    self._updateTime();
                    // wire up the volume
                    self.$volumeSlider = self.$vidParent.find('.wijmo-wijvideo-volumeslider');
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
                    });
                    self.$video.parent().find('.wijmo-wijvideo-controls').css('display', 'none');
                    self._initialToolTip();
                    if(!o.showControlsOnHover) {
                        $('.wijmo-wijvideo-controls').show();
                        self.$vidParent.height(self.$video.outerHeight() + $('.wijmo-wijvideo-controls').height());
                    }
                }
            }, 200);
            this.$video.bind("click." + self.widgetName, function () {
                self._togglePlay();
            });
            // display the bar on hover
            if(o.showControlsOnHover) {
                $('.wijmo-wijvideo').hover(function () {
                    $('.wijmo-wijvideo-controls').stop(true, true).fadeIn();
                }, function () {
                    $('.wijmo-wijvideo-controls').delay(300).fadeOut();
                });
            }
            $playbtn = this.$vidParent.find('.wijmo-wijvideo-play > span');
            $playbtn.click(function () {
                self._togglePlay();
            }).parent().hover(function () {
                $(this).addClass(wijCSS.stateHover);
            }, function () {
                $(this).removeClass(wijCSS.stateHover);
            });
            this.$vidParent.find('.wijmo-wijvideo-volume').hover(function () {
                $('.wijmo-wijvideo-volume-container').stop(true, true).slideToggle();
            });
            this.$fullScreenBtn = this.$vidParent.find('.wijmo-wijvideo-fullscreen > span');
            this.$fullScreenBtn.click(function () {
                self._toggleFullScreen();
            }).parent().hover(function () {
                $(this).addClass(wijCSS.stateHover);
            }, function () {
                $(this).removeClass(wijCSS.stateHover);
            });
            if(!self.options.fullScreenButtonVisible) {
                this.$vidParent.find('.wijmo-wijvideo-fullscreen').hide();
            }
            this.$volumeBtn.hover(function () {
                $(this).addClass(wijCSS.stateHover);
            }, function () {
                $(this).removeClass(wijCSS.stateHover);
            }).click(function () {
                if(self._getVideoAttribute("readyState")) {
                    self._volumnOn = !self._volumnOn;
                    if(!self._volumnOn) {
                        var currentVolumn = this.$volumeSlider.slider('value');
                        this.$volumeSlider.slider('value', 0);
                        self._setVideoAttribute('volume', 0);
                        this.$volumeBtn.find("span").removeClass(wijCSS.iconVolumeOn).addClass(wijCSS.iconVolumeOff);
                    } else {
                        this.$volumeSlider.slider('value', currentVolumn);
                        self._setVideoAttribute('volume', currentVolumn);
                        this.$volumeBtn.find("span").removeClass(wijCSS.iconVolumeOff).addClass(wijCSS.iconVolumeOn);
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
            var self = this, o = self.options;
            //$.wijmo.widget.prototype._setOption.apply(self, arguments);
            _super.prototype._setOption.call(this, key, value);
            if(key === "fullScreenButtonVisible") {
                o.fullScreenButtonVisible = value;
                if(value) {
                    this.$vidParent.find('.wijmo-wijvideo-fullscreen').show();
                } else {
                    this.$vidParent.find('.wijmo-wijvideo-fullscreen').hide();
                }
            } else if(key === "disabled") {
                self._handleDisabledOption(value, self.element);
            } else if(key === "showControlsOnHover") {
                if(!value) {
                    $('.wijmo-wijvideo').unbind('mouseenter mouseleave');
                    window.setTimeout(function () {
                        $('.wijmo-wijvideo-controls').show();
                        self.$vidParent.height(self.$video.outerHeight() + $('.wijmo-wijvideo-controls').height());
                    }, 200);
                } else {
                    this.$vidParent.height(this.$video.outerHeight());
                    $('.wijmo-wijvideo-controls').hide();
                    $('.wijmo-wijvideo').hover(function () {
                        $('.wijmo-wijvideo-controls').stop(true, true).fadeIn();
                    }, function () {
                        $('.wijmo-wijvideo-controls').delay(300).fadeOut();
                    });
                }
            }
            //end for disabled option
                    };
        wijvideo.prototype._handleDisabledOption = function (disabled, ele) {
            var self = this;
            if(disabled) {
                if(!self.disabledDiv) {
                    self.disabledDiv = self._createDisabledDiv(ele);
                }
                self.disabledDiv.appendTo("body");
                if($.browser.msie) {
                    $('.wijmo-wijvideo').unbind('mouseenter mouseleave');
                    this.$video.unbind("click." + self.widgetName);
                }
            } else {
                if(self.disabledDiv) {
                    self.disabledDiv.remove();
                    self.disabledDiv = null;
                    if($.browser.msie) {
                        $('.wijmo-wijvideo').hover(function () {
                            $('.wijmo-wijvideo-controls').stop(true, true).fadeIn();
                        }, function () {
                            $('.wijmo-wijvideo-controls').delay(300).fadeOut();
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
            if(this.$video.attr(name) !== undefined) {
                return this.$video.attr(name);
            } else {
                return this.$video.prop(name);
            }
        };
        wijvideo.prototype._setVideoAttribute = function (name, value) {
            if(name === "") {
                return;
            }
            if(this.$video.attr(name) !== undefined) {
                return this.$video.attr(name, value);
            } else {
                return this.$video.prop(name, value);
            }
        };
        wijvideo.prototype._initialToolTip = function () {
            var self = this;
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
            this.$seekSlider.wijtooltip("widget").addClass("wijmo-wijvideo");
            this.$volumeBtn.wijtooltip("widget").addClass("wijmo-wijvideo");
            this.$volumeBtn.wijtooltip("widget").addClass("wijmo-wijvideo");
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
            this.$vidParent.find('.wijmo-wijvideo-timer').html(mfmt + mm + ':' + sfmt + ss);
            if(!this.seek) {
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
            var self = this, isPaused = self._getVideoAttribute("paused"), offsetWidth = 0, fWidth = $(window).width(), fHeight = $(window).height();
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
                this.$vidParent.addClass("wijmo-wijvideo-container-fullscreen").css({
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
                this.$vidParent.removeClass("wijmo-wijvideo-container-fullscreen").attr("style", "").attr("style", self._oriVidParentStyle);
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
            var seekSlider = this.$vidParent.find('.wijmo-wijvideo-index-slider');
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
            var pos;
            this.$video.parent().find('.wijmo-wijvideo-controls').show();
            pos = this.$vidParent.find('.wijmo-wijvideo-timer').position().left;
            this.$seekSlider.width(pos - this.$seekSlider.position().left - 15);
            this.$video.parent().find('.wijmo-wijvideo-controls').css('display', 'none');
            if(!this.options.showControlsOnHover) {
                $('.wijmo-wijvideo-controls', this.$vidParent).show();
                this.$vidParent.height(this.$video.outerHeight() + $('.wijmo-wijvideo-controls').height());
            }
        };
        wijvideo.prototype.destroy = function () {
            ///	<summary>
            ///	Removes the wijvideo functionality completely.
            /// This returns the element back to its pre-init state.
            /// Code example: $("#element").wijvideo("destroy");
            ///	</summary>
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
        wijvideo.prototype.play = function () {
            ///	<summary>
            ///	Play the video.
            /// Code example: $("#element").wijvideo("play");
            ///	</summary>
            this.$video[0].play();
        };
        wijvideo.prototype.pause = function () {
            ///	<summary>
            ///	Pause the video.
            /// Code example: $("#element").wijvideo("pause");
            ///	</summary>
            this.$video[0].pause();
        };
        wijvideo.prototype.getWidth = function () {
            ///	<summary>
            ///	Gets the video width in pixel.
            /// Code example: $("#element").wijvideo("getWidth");
            ///	</summary>
            return this.$video.outerWidth();
        };
        wijvideo.prototype.setWidth = function (width) {
            ///	<summary>
            ///	Sets the video width in pixel.
            /// Code example: $("#element").wijvideo("setWidth", 600);
            ///	</summary>
            /// <param name="width" type="Number">Width value in pixel.</param>
            width = width || 600;
            var origWidth = this.getWidth();
            this.$video.attr('width', width);
            this.$vidParent.width(this.$video.outerWidth());
            this._positionControls(this.getWidth() - origWidth);
        };
        wijvideo.prototype.getHeight = function () {
            ///	<summary>
            ///	Gets the video height in pixel.
            /// Code example: $("#element").wijvideo("getHeight");
            ///	</summary>
            return this.$video.outerHeight();
        };
        wijvideo.prototype.setHeight = function (height) {
            ///	<summary>
            ///	Sets the video height in pixel.
            /// Code example: $("#element").wijvideo("setHeight", 400);
            ///	</summary>
            /// <param name="height" type="Number">Height value in pixel.</param>
            height = height || 400;
            this.$video.attr('height', height);
            if(this.options.showControlsOnHover) {
                this.$vidParent.height(this.$video.outerHeight());
            } else {
                this.$vidParent.height(this.$video.outerHeight() + $('.wijmo-wijvideo-controls').height());
            }
        };
        return wijvideo;
    })(wijmo.wijmoWidget);
    wijmo.wijvideo = wijvideo;    
    wijvideo.prototype.options = $.extend(true, {
    }, wijmo.wijmoWidget.prototype.options, {
        initSelector: /// <summary>
        /// Selector option for auto self initialization.
        ///	This option is internal.
        /// </summary>
        ":jqmData(role='wijvideo')",
        wijCSS: //All CSS classes used in widgets that use jQuery UI CSS Framework
        {
            iconVolumeOn: "ui-icon-volume-on",
            iconVolumeOff: "ui-icon-volume-off"
        },
        fullScreenButtonVisible: /// <summary>
        /// A value that indicates whether to show the full screen button.
        /// Type: Boolean.
        /// Default: true.
        /// Don't show the full screen button.
        /// Code example: $(".video").wijvideo("option",
        /// "fullScreenButtonVisible", false).
        /// </summary>
        true,
        showControlsOnHover: ///	<summary>
        ///	Determines whether to display the controls only
        /// when hovering the mouse to the video.
        /// Default: true
        /// Type: Boolean
        /// Code example:
        /// Always display the controls.
        ///  $(".video").wijvideo({
        ///      showControlsOnHover: false
        ///  });
        ///	</summary>
        true,
        localization: ///	<summary>
        ///	Use the localization option in order to localize
        ///	text which not depends on culture.
        /// Default: {
        ///	volumeToolTip: "Volume",
        ///	fullScreenToolTip: "Full Screen"
        /// }
        /// Type: Object.
        /// Code example: $("#video").wijvideo(
        ///					{
        ///						localization: {
        ///							volumeToolTip: "volume",
        ///							fullScreenToolTip: "FullScreen"
        ///						}
        ///					});
        ///	</summary>
        null
    });
    $.wijmo.registerWidget("wijvideo", wijvideo.prototype);
})(wijmo || (wijmo = {}));
