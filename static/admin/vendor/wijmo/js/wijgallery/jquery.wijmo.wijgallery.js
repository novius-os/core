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
    /// <reference path="../Base/jquery.wijmo.widget.ts" />
    /// <reference path="../wijslider/jquery.wijmo.wijslider.ts" />
    /// <reference path="../wijpager/jquery.wijmo.wijpager.ts" />
    /// <reference path="../wijcarousel/jquery.wijmo.wijcarousel.ts" />
    /// <reference path="../External/declarations/swfobject.d.ts" />
    /*globals jQuery, window, XMLHttpRequest*/
    /*
    * Depends:
    *     jquery.ui.core.js
    *     jquery.ui.widget.js
    */
    (function (gallery) {
        "use strict";
        var $ = jQuery, widgetName = "wijgallery", baseCss = "wijmo-wijgallery", cssPrefix = "wijmo-wijgallery-", selectedCss = cssPrefix + "selected", btnCssPrefix = cssPrefix + "button-", btnCss = cssPrefix + "button", pointerCss = "wijmo-wijgallery-thumbs-pointer-{0}", flashCss = "wijmo-wijgallery-flashwrapper", frameHtml = "<div class=\"wijmo-wijgallery-frame\">" + "<div class=\"wijmo-wijgallery-content\"></div></div>", thumbsHtml = "<div class=\"wijmo-wijgallery-thumbs\"></div>", btnHtml = "<a><span></span></a>", navHtml = "<div class=\"wijmo-wijgallery-frame-{0}\">" + "<a href=\"#\" class=\"wijmo-wijgallery-frame-link\"></a></div>", captionHtml = "<div></div>", carouselItem = "li.wijmo-wijcarousel-item";
        if(!window["S"] && window["swfobject"]) {
            window["S"] = {
                flash: window["swfobject"]
            };
        }
        /** @widget */
        var wijgallery = (function (_super) {
            __extends(wijgallery, _super);
            function wijgallery() {
                _super.apply(this, arguments);

            }
            wijgallery.prototype._setOption = function (key, value) {
                var self = this, o = self.options, el, create, old, text;
                if(key === "framePosition" || key === "thumbnailPosition" || key === "transitions" || key === "pagingPosition") {
                    $.extend(true, o[key], value);
                } else {
                    old = o[key];
                    $.Widget.prototype._setOption.apply(self, arguments);
                    switch(key) {
                        case "disabled":
                            self._handleDisabledOption(value, self.element);
                            break;
                        case "thumbnailOrientation":
                            self.thumbs[self.thumbWidgetName]({
                                orientation: value
                            });
                            break;
                        case "thumbsDisplay":
                            self.thumbs[self.thumbWidgetName]({
                                display: value
                            });
                            break;
                        case "autoPlay":
                            self[value ? "play" : "pause"]();
                            break;
                        case "showCounter":
                        case "showTimer":
                        case "showControls":
                            el = key.replace(/show/i, "").toLowerCase();
                            create = key.replace(/show/i, "_create");
                            if(value !== old) {
                                if(value === true) {
                                    if(!self[el]) {
                                        self[create]();
                                    } else if(self[el].jquery) {
                                        self[el].show();
                                    }
                                } else {
                                    self[el].hide();
                                }
                            }
                            break;
                        case "showCaption":
                            if(value) {
                                self._createCaption(self.size);
                                text = self._loadCaption(self.images[self.currentIdx]);
                                text.show();
                            } else {
                                self.element.find(".wijmo-wijgallery-caption,.wijmo-wijgallery-text").remove();
                            }
                            break;
                        case "showPager":
                        case "thumbsLength":
                        case "thumbnailDirection":
                        case "showControlsOnHover":
                        case "mode":
                        case "data":
                            self._wijdestroy();
                            self._create();
                            break;
                        default:
                            break;
                    }
                }
            };
            wijgallery.prototype._handleDisabledOption = function (disabled, ele) {
                var self = this;
                if(self.pager && !self.pager.is(":hidden")) {
                    self.pager.wijpager("option", "disabled", disabled);
                } else if(self.thumbs && !self.thumbs.is(":hidden")) {
                    self.thumbs[self.thumbWidgetName]({
                        disabled: disabled
                    });
                }
            };
            wijgallery.prototype._initLi = function (li) {
                var a = li.children("a:eq(0)"), img = li.find("img:eq(0)"), caption = li.find("span:eq(0)"), imgData = {
                    url: null,
                    thumbUrl: null,
                    title: img.attr("alt"),
                    caption: undefined
                };
                if(a.length && a.attr("href")) {
                    imgData.url = a.attr("href");
                    if(!imgData.title) {
                        imgData.title = a.attr("title");
                    }
                } else if(img.length) {
                    imgData.url = img.attr("src");
                }
                if(caption.length) {
                    imgData.caption = caption;
                } else if(img.attr("title")) {
                    imgData.caption = $("<span>").html(img.attr("title"));
                }
                imgData.thumbUrl = img.attr("src");
                return imgData;
            };
            wijgallery.prototype._initStatus = function () {
                var self = this, lis;
                self.images = [];
                self.ul = self.element.children("ul");
                lis = self.ul.children("li");
                self._count = lis.length;
                lis.each(function (i) {
                    var imgData = self._initLi($(this));
                    self.images.push(imgData);
                });
            };
            wijgallery.prototype._createMarkupFromData = function () {
                var self = this, o = self.options, items = o.data, el = self.element, ul = el.children("ul:eq(0)");
                self.images = items;
                if(ul.length) {
                    ul.empty();
                } else {
                    ul = $("<ul>").appendTo(el);
                }
                self.ul = ul;
                $.each(items, function (idx, item) {
                    var link = $("<a>"), li = $("<li>"), img = $("<img>");
                    if(item.url) {
                        link.attr("href", item.url);
                    }
                    if(item.thumbUrl) {
                        img.attr("src", item.thumbUrl);
                    }
                    if(item.title) {
                        img.attr("alt");
                    }
                    link.append(img).appendTo(li);
                    li.appendTo(ul);
                });
                self._count = items.length;
            };
            wijgallery.prototype._create = function () {
                var self = this, o = self.options;
                self.container = self.element;
                self.container.addClass([
                    baseCss, 
                    o.wijCSS.widget
                ].join(' '));
                self.currentThumbIdx = 0;
                self.currentIdx = -1;
                //number of setTimeOut(ensure only 1 timer at same time)
                self.timerCount = 0;
                // enable touch support:
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                if(o.showPager) {
                    //remove this.
                    o.pagingPosition = true;
                    o.thumbnails = false;
                } else {
                    o.thumbnails = true;
                }
                if(o.data && o.data.length) {
                    self._createMarkupFromData();
                } else {
                    self._initStatus();
                }
                if(o.loadCallback && $.isFunction(o.loadCallback)) {
                    self._trigger("loadCallback", null, self);
                }
                self._createDom();
                if(o.autoPlay) {
                    self._play(true);
                }
                if(o.showControlsOnHover) {
                    self.frame.find(".wijmo-wijpager," + ".wijmo-wijgallery-button-next,.wijmo-wijgallery-counter," + ".wijmo-wijgallery-button-previous").hide();
                    if(!self.isPlaying && self.timer) {
                        self.timer.hide();
                    }
                }
                if(o.disabled) {
                    self.disable();
                }
                //update for visibility change
                if(self.element.is(":hidden") && self.element.wijAddVisibilityObserver) {
                    self.element.wijAddVisibilityObserver(function () {
                        //self.refresh();
                        if(self.element.wijRemoveVisibilityObserver) {
                            self.element.wijRemoveVisibilityObserver();
                        }
                    }, "wijgallery");
                }
            };
            wijgallery.prototype._createDom = function () {
                var self = this, o = self.options;
                if(o.thumbnails) {
                    self._createThumbnails();
                } else {
                    self.ul.hide();
                }
                self._createFrame();
                if(o.control) {
                    self._createControls();
                }
                if(o.showCounter) {
                    self._createCounter();
                }
                if(o.showTimer) {
                    self._createTimer();
                }
                if(o.showPager) {
                    self._createPager();
                }
            };
            wijgallery.prototype._getFrameSize = function () {
                var self = this, or = self.options.thumbnailOrientation === "horizontal", height = self.element.height() - (or ? (self.thumbs ? self.thumbs.outerHeight(true) : 0) : 0), width = self.element.width() - (or ? 0 : (self.thumbs ? self.thumbs.outerWidth(true) : 0));
                return {
                    w: (width < 2 || !width) ? 750 : width,
                    h: (height < 2 || !height) ? 300 : height
                };
            };
            wijgallery.prototype._createFrame = function () {
                var self = this, o = self.options, w, h, size = //currentImg = self.images[self.currentIdx],
                self._getFrameSize(), d = o.thumbnailDirection === "after";
                self.frame = $(frameHtml).addClass(o.wijCSS.content + " " + o.wijCSS.helperClearFix)[d ? "prependTo" : "appendTo"](self.container).setOutWidth(size.w - 1).setOutHeight(//fixed 1px in all browser
                //.setOutWidth($.browser.msie ? size.w - 1 : size.w)//fixed 1px in ie
                size.h).wrap("<div class=\"wijmo-wijgallery-framewrapper\">");
                self.size = size;
                w = self.frame.width();
                h = self.frame.height();
                self.frameWrapper = self.frame.parent();
                if(o.thumbnailOrientation === "vertical") {
                    self.frameWrapper.addClass("wijmo-wijgallery-framewrapper-vertical");
                }
                if(o.showControlsOnHover) {
                    if($.browser.msie && parseInt($.browser.version) > 9) {
                        self.frame.data("previousBtnShown", false);
                        self.frame.data("nextBtnShown", false);
                    }
                    self.frame.bind("mouseenter." + self.widgetName, function () {
                        if(self.options.disabled) {
                            return;
                        }
                        self._showControls("controls");
                    }).bind("mouseleave." + self.widgetName, function () {
                        if(self.options.disabled) {
                            return;
                        }
                        self._hideControls("controls");
                        if($.browser.msie && parseInt($.browser.version) > 9) {
                            $.each([
                                "previous", 
                                "next"
                            ], function (i, n) {
                                if(self.frame.data(n + "BtnShown")) {
                                    self._hideControls(n);
                                    self.frame.data(n + "BtnShown", false);
                                }
                            });
                        }
                    });
                }
                self.content = self.frame.children("div.wijmo-wijgallery-content");
                if(o.mode === "img") {
                    self._createFrameMask();
                }
                self._createPrevNextBtn();
                self._createCaption(size);
                self._createLoading();
                self.last = $("<div class=\"" + o.wijCSS.overlay + " wijmo-wijgallery-last\"></div>").appendTo(self.content).width(w).height(h).css({
                    "line-height": size.h + "px"
                });
                self.current = $("<div class=\"" + o.wijCSS.overlay + " wijmo-wijgallery-current\"></div>").appendTo(self.content).width(w).height(h).css({
                    "line-height": size.h + "px"
                });
                self._show(0);
            };
            wijgallery.prototype._createControls = function () {
                var self = this, o = self.options, position = {
                    collision: "none",
                    of: self.container,
                    my: "center bottom",
                    at: "center bottom"
                };
                if(o.control) {
                    self.controls = $(o.control).css({
                        position: "absolute"
                    }).appendTo(self.container);
                    $.extend(position, o.controlPosition);
                    self.controls.position(position);
                }
            };
            wijgallery.prototype._createLoading = function () {
                var self = this;
                self.loading = $("<div></div>").addClass("wijmo-wijgallery-loading").appendTo(self.content);
                self.loading.css({
                    left: (self.content.width() - self.loading.width()) / 2,
                    top: (self.content.height() - self.loading.height()) / 2
                });
                self.loading.hide();
            };
            wijgallery.prototype._createFrameMask = function () {
                var self = this, o = self.options;
                $.each([
                    "previous", 
                    "next"
                ], function (i, n) {
                    var nav = $(navHtml.replace(/\{0\}/, n)).appendTo(self.frame), link = nav.children("a");
                    if($.browser.msie && parseInt($.browser.version) <= 9) {
                        nav.css({
                            "background-color": "#fff"
                        });
                    }
                    if(o.showControlsOnHover && !($.browser.msie && parseInt($.browser.version) > 9)) {
                        nav.bind("mouseenter." + self.widgetName, function () {
                            if(self.options.disabled) {
                                return;
                            }
                            self._showControls(n);
                        }).bind("mouseleave." + self.widgetName, function () {
                            if(self.options.disabled) {
                                return;
                            }
                            self._hideControls(n);
                        });
                    }
                    if(!($.browser.msie && parseInt($.browser.version) > 9)) {
                        link.bind("click." + self.widgetName, function (event) {
                            if(self.options.disabled) {
                                return;
                            }
                            self[n]();
                            event.preventDefault();
                        });
                    }
                });
                if($.browser.msie && parseInt($.browser.version) > 9) {
                    self.frame.bind("click." + self.widgetName, function (e) {
                        if(self.options.disabled) {
                            return;
                        }
                        var framePrefix = ".wijmo-wijgallery-frame-", posX = e.clientX, posY = e.clientY;
                        $.each([
                            "previous", 
                            "next"
                        ], function (i, n) {
                            var frameSelector = framePrefix + n, frame = self.frame.find(frameSelector);
                            if(frame.length > 0) {
                                if(self._checkPositionInElement({
                                    X: posX,
                                    Y: posY
                                }, $(frame[0]))) {
                                    self[n]();
                                    e.preventDefault();
                                }
                            }
                        });
                    });
                }
                if(o.showControlsOnHover && $.browser.msie && parseInt($.browser.version) > 9) {
                    self.frame.bind("mousemove." + self.widgetName, function (e) {
                        if(self.options.disabled) {
                            return;
                        }
                        var framePrefix = ".wijmo-wijgallery-frame-", posX = e.clientX, posY = e.clientY;
                        $.each([
                            "previous", 
                            "next"
                        ], function (i, n) {
                            var frameSelector = framePrefix + n, frame = self.frame.find(frameSelector);
                            if(frame.length > 0) {
                                if(self._checkPositionInElement({
                                    X: posX,
                                    Y: posY
                                }, $(frame[0]))) {
                                    if(!self.frame.data(n + "BtnShown")) {
                                        self._showControls(n);
                                        self.frame.data(n + "BtnShown", true);
                                    }
                                } else {
                                    if(self.frame.data(n + "BtnShown")) {
                                        self._hideControls(n);
                                        self.frame.data(n + "BtnShown", false);
                                    }
                                }
                            }
                        });
                    });
                }
            };
            wijgallery.prototype._createCounter = function () {
                var self = this, o = self.options;
                if(!o.showCounter) {
                    if(self.counter) {
                        self.counter.remove();
                        self.counter = undefined;
                    }
                    return;
                }
                if(!self.counter) {
                    self.counter = $("<div></div>").addClass("wijmo-wijgallery-counter " + o.wijCSS.stateDefault + " " + o.wijCSS.cornerTL).appendTo(self.frame);
                }
                self._refreshCounter();
            };
            wijgallery.prototype._refreshCounter = function () {
                var self = this, o = self.options, counter;
                if(!self.counter) {
                    return;
                }
                self.counter.empty();
                if(o.counter) {
                    counter = o.counter.replace(/\[i\]/, self.currentIdx + 1);
                    counter = counter.replace(/\[n\]/, self._count);
                    $("<span></span>").text(counter).appendTo(self.counter);
                }
            };
            wijgallery.prototype._createPrevNextBtn = function () {
                var self = this, wijCSS = self.options.wijCSS;
                $.each([
                    "next", 
                    "previous"
                ], function (i, n) {
                    var css = n === "next" ? wijCSS.iconArrowRight : wijCSS.iconArrowLeft, panel;
                    panel = self.frame.find(".wijmo-wijgallery-frame-" + n);
                    if(!panel.length || self.options.mode !== "img") {
                        panel = self.frame;
                    }
                    self[n + "Btn"] = $(self._createBtn(btnCssPrefix + n, css)).appendTo(panel);
                    if(!(($.browser.msie && parseInt($.browser.version) > 9) && self.options.mode === "img")) {
                        self[n + "Btn"].bind("click." + self.widgetName, $.proxy(self[n], self));
                    }
                    self._applyBtnStyle(n);
                });
            };
            wijgallery.prototype._applyBtnStyle = function (dir) {
                var self = this, o = self.options, isNext = dir === "next", btn = self[dir + "Btn"], at = isNext ? "right center" : "left center", my = at, wijCSS = o.wijCSS, css = isNext ? wijCSS.cornerLeft : wijCSS.cornerRight, condition = dir === "next" ? (self.currentIdx >= self._count) : (self.currentIdx <= 0), nextPosition = {
                    collision: "none",
                    of: self.frame,
                    my: my,
                    at: at
                };
                btn.addClass(css).position(nextPosition);
                if(condition) {
                    btn.removeClass(wijCSS.stateHover).addClass(wijCSS.stateDisabled);
                } else if(btn.hasAllClasses(wijCSS.stateDisabled)) {
                    btn.removeClass(wijCSS.stateDisabled);
                }
            };
            wijgallery.prototype._createCaption = function (size) {
                var self = this, o = self.options, css = o.wijCSS;
                if(o.showCaption) {
                    self.overlay = $(captionHtml).addClass([
                        css.content, 
                        css.helperClearFix, 
                        "wijmo-wijgallery-caption"
                    ].join(' ')).width(size.w).appendTo(self.content);
                    self.caption = $(captionHtml).addClass([
                        css.content, 
                        css.helperClearFix, 
                        "wijmo-wijgallery-text"
                    ].join(' ')).width(size.w).appendTo(self.content);
                }
            };
            wijgallery.prototype._loadCaption = function (image) {
                var self = this, content = image.caption, height, caption = $("<span></span>"), text = self.element.find(".wijmo-wijgallery-text," + ".wijmo-wijgallery-caption");
                if(content) {
                    text.show();
                    if(content.jquery) {
                        content.show();
                    }
                    caption.html(content);
                    self.caption.empty().append(caption);
                    height = caption.outerHeight(true);
                    text.height(height);
                    //ie get wrong height at first time. the 2nd is right.
                    if($.browser.msie) {
                        text.height(caption.css("display", "block").outerHeight(true));
                    }
                }
                text.hide();
                return text;
            };
            wijgallery.prototype._showCaption = function (img) {
                var self = this;
                if(img && img.caption) {
                    if(self.caption.length) {
                        self.caption.fadeIn(500);
                    }
                    if(self.overlay.length) {
                        self.overlay.show().animate({
                            opacity: 0.5
                        }, 500);
                    }
                }
            };
            wijgallery.prototype._createTooltip = function (dir) {
                var self = this, wijCSS = self.options.wijCSS, d = dir || "bottom";
                self.pointer = $("<div>").addClass([
                    wijCSS.content, 
                    wijCSS.stateDefault, 
                    pointerCss.replace(/\{0\}/, d)
                ].join(' '));
                self.pointer.appendTo(self.thumbsWrapper).hide();
            };
            wijgallery.prototype._createThumbnails = function () {
                var self = this, o = self.options, d = o.thumbnailDirection === "after", thumbClass = "wijmo-wijgallery-thumbs-{0}", or = o.thumbnailOrientation === "horizontal", postFix = d ? (or ? "bottom" : "right") : (or ? "top" : "left");
                self.thumbPosition = postFix;
                self.thumbs = $(thumbsHtml).appendTo(self.container).addClass(o.wijCSS.content).addClass(or ? "wijmo-wijcarousel-horizontal-multi" : "wijmo-wijcarousel-vertical-multi");
                if(or) {
                    self.thumbs.css({
                        height: o.thumbsLength + "px"
                    }).setOutWidth(self.element.width());
                } else {
                    self.thumbs.css({
                        width: o.thumbsLength + "px"
                    }).setOutHeight(self.element.height());
                }
                self.ul.appendTo(self.thumbs);
                self.ul.children("li").each(function (i, data) {
                    var link = $(data).children("a"), imgData = self.images[i], href = imgData.thumbUrl;
                    if(!link.length) {
                        link = $(data).wrapInner("<a>").children("a");
                        link.attr("href", href);
                    }
                });
                if($[self.namespace][self.thumbWidgetName]) {
                    self.thumbs.addClass(thumbClass.replace(/\{0\}/, postFix)).find("li").addClass(o.wijCSS.stateDefault).hover(function () {
                        $(this).addClass(o.wijCSS.stateHover);
                    }, function () {
                        $(this).removeClass(o.wijCSS.stateHover);
                    });
                    self.thumbsWrapper = self.thumbs[self.thumbWidgetName]({
                        display: o.thumbsDisplay,
                        step: o.thumbsDisplay - 1,
                        itemPadding: "0 10px",
                        showCaption: o.showThumbnailCaptions,
                        orientation: o.thumbnailOrientation,
                        loop: false,
                        itemClick: function (event, ui) {
                            var idx = ui.index;
                            self.show(idx);
                            event.preventDefault();
                        },
                        afterScroll: function (event, ui) {
                            self.currentThumbIdx = ui.firstIndex;
                            if(self.activeLi && self.activeLi.is("li") && self.activeLi.index() >= ui.firstIndex && self.activeLi.index() <= ui.lastIndex) {
                                self._highlightThumb(self.activeLi);
                            }
                            self.isScrolling = false;
                        },
                        beforeScroll: function (event, ui) {
                            self.isScrolling = true;
                            if(o.mode === "swf" || o.mode === "flv") {
                                self.pointer.hide();
                            } else {
                                self.pointer.fadeOut(100);
                            }
                        }
                    }).wrap("<div class=\"wijmo-wijgallery-thumbswrapper\">").parent();
                    if(!or) {
                        self.thumbsWrapper.addClass("wijmo-wijgallery-thumbswrapper-vertical");
                    }
                    self._createTooltip(postFix);
                }
            };
            wijgallery.prototype._calculatePosition = function (offset, w, h, lw, lh, b) {
                var self = this;
                if(self.thumbPosition === "bottom") {
                    offset.left = offset.left + (lw - w) / 2 + b;
                    offset.top = offset.top - h;
                } else if(self.thumbPosition === "top") {
                    offset.left = offset.left + (lw - w) / 2 + b;
                    offset.top = offset.top + lh + 2 * b;
                } else if(self.thumbPosition === "left") {
                    offset.left = offset.left + lw + 2 * b;
                    offset.top = offset.top + (lh - h) / 2 + b;
                } else if(self.thumbPosition === "right") {
                    offset.left = offset.left - w;
                    offset.top = offset.top + (lh - h) / 2 + b;
                }
            };
            wijgallery.prototype._highlightThumb = function (li) {
                var self = this, w, h, lw, lh, offset, b, css = [
                    selectedCss, 
                    self.options.wijCSS.stateActive
                ].join(' ');
                if(li && li.length) {
                    li.siblings("li." + selectedCss).removeClass(css);
                    li.addClass(css);
                    w = self.pointer.outerWidth(true);
                    h = self.pointer.outerHeight(true);
                    lw = li.width();
                    lh = li.height();
                    offset = li.offset();
                    //b = li.outerWidth(true)- li.outerWidth();
                    // get border of li.
                    b = 5;
                    self._calculatePosition(offset, w, h, lw, lh, b);
                    self.pointer.fadeIn(100);
                    self.pointer.offset(offset);
                }
            };
            wijgallery.prototype._getSelector = function (content, includeTimer) {
                var selector, btnPrefix = ".wijmo-wijgallery-button-", controls = ".wijmo-wijpager,.wijmo-wijgallery-counter";
                if(includeTimer) {
                    controls += ",.wijmo-wijgallery-timerbar";
                }
                if(content === "next" || content === "previous") {
                    selector = btnPrefix + content;
                } else if(content === "controls") {
                    selector = controls;
                } else {
                    selector = controls + "," + btnPrefix + "next," + btnPrefix + "previous";
                }
                return selector;
            };
            wijgallery.prototype._showControls = function (content) {
                var self = this, selector;
                selector = self._getSelector(content, !self.isPlaying && self.timer);
                self.frame.find(selector).stop(true, true).fadeIn(400, function () {
                    $(this).css('opacity', '');
                });
            };
            wijgallery.prototype._hideControls = function (content) {
                var self = this, selector;
                selector = self._getSelector(content, !self.isPlaying && self.timer);
                this.frame.find(selector).stop(true, true).fadeOut(600);
            };
            wijgallery.prototype._createPager = function () {
                var self = this, o = self.options, pager, display = o.thumbsDisplay, pageCount = 1, pageIndex = self.currentIdx, currentIdx = self.currentIdx, position = {
                    collision: "none",
                    of: self.container,
                    my: "right top",
                    at: "right bottom"
                };
                if(o.thumbnails) {
                    pager = $("<div></div>").appendTo(self.thumbs);
                    if(display !== 0) {
                        pageCount = Math.ceil(self._count / display);
                        pageIndex = Math.ceil(self.currentIdx / display);
                    }
                    self.pager = pager.wijpager({
                        pageCount: pageCount,
                        pageIndex: pageIndex,
                        pageButtonCount: pageCount,
                        mode: "numeric",
                        pageIndexChanged: function (event, ui) {
                            var idx = ui.newPageIndex;
                            if(currentIdx < idx * display || currentIdx >= (idx + 1) * display) {
                                self.thumbs[self.thumbWidgetName]("scrollTo", (idx * display));
                            }
                            event.preventDefault();
                        }
                    }).css({
                        position: "absolute"
                    });
                } else {
                    pager = $("<div></div>").appendTo(self.container);
                    self.pager = pager.wijpager({
                        pageCount: self._count,
                        pageIndex: self.currentIdx,
                        pageButtonCount: self._count,
                        mode: "numeric",
                        pageIndexChanged: function (event, ui) {
                            var idx = ui.newPageIndex;
                            self._show(idx);
                        }
                    }).css({
                        position: "absolute"
                    });
                    $.extend(position, o.pagingPosition);
                    self.pager.addClass("wijmo-wijgallery-pager").position(position);
                }
            };
            wijgallery.prototype._createBtn = function (btnClass, itemClass) {
                var btn = $(btnHtml), o = this.options;
                btn.addClass(o.wijCSS.stateDefault + ' ' + btnClass).attr("role", "button").bind("mouseover" + this.widgetName, function () {
                    if($(this).hasAllClasses(o.wijCSS.stateDisabled)) {
                        return;
                    }
                    $(this).addClass(o.wijCSS.stateHover);
                }).bind("mouseout" + this.widgetName, function () {
                    if($(this).hasAllClasses(o.wijCSS.stateDisabled)) {
                        return;
                    }
                    $(this).removeClass(o.wijCSS.stateHover);
                });
                btn.children("span:eq(0)").addClass(o.wijCSS.icon + ' ' + itemClass);
                return btn;
            };
            wijgallery.prototype._createTimer = function () {
                var self = this, o = self.options;
                self._createPausePlay();
                self.progressBar = $("<div></div>").addClass("wijmo-wijgallery-timerbar-inner " + o.wijCSS.cornerAll).css({
                    width: "0%"
                }).attr("role", "progressbar");
                self.timer = $("<div></div>").addClass("wijmo-wijgallery-timerbar " + o.wijCSS.cornerAll).appendTo(self.frame).append(self.progressBar).append(self.playPauseBtn);
            };
            wijgallery.prototype._createPausePlay = function () {
                var self = this, o = self.options;
                self.playPauseBtn = $(self._createBtn(btnCss, o.autoPlay ? o.wijCSS.iconPause : o.wijCSS.iconPlay)).bind("wijclick." + self.widgetName, function () {
                    if(!$(this).hasAllClasses(o.wijCSS.stateDisabled)) {
                        var icon = $(this).children("span:eq(0)");
                        self[icon.hasAllClasses(o.wijCSS.iconPlay) ? "play" : "pause"]();
                    }
                });
            };
            wijgallery.prototype._show = function (index) {
                var self = this, img = self.images[index], iframeContent, lastContent, newImg, size = self._getFrameSize(), o = self.options, m = o.mode;
                if(self.currentIdx === index) {
                    return;
                }
                if(img && $.isPlainObject(img)) {
                    self.loading.delay(500).fadeIn(100);
                    newImg = self.last.children("img,div." + flashCss);
                    if(newImg.length) {
                        newImg.remove();
                    }
                    if(m === "swf" || m === "flv") {
                        self.last.hide();
                        self.current.empty();
                        self._wrapFlash(self.current, m, img.url);
                        self.picture = self.current.children("div." + flashCss);
                        self._setCurrentStates(index);
                        //self.picture.fadeIn(100);
                        self.loading.stop().hide();
                        self._thumbsScroll(index);
                    } else if(m === "img") {
                        if(self.picture && self.picture.length) {
                            self.last.append(self.picture.unbind("load"));
                        }
                        self.current.hide();
                        self.last.show();
                        self.picture = $("<img>").attr({
                            src: img.url,
                            alt: img.title
                        }).appendTo(self.current).data("itemIndex", index);
                        if($.browser.msie && self.picture[0].hasAttribute("complete")) {
                            self._imageLoaded(self, size);
                        } else {
                            self.picture.bind("load", function () {
                                self._imageLoaded(self, size);
                            });
                        }
                    } else if(m === "iframe") {
                        if(self.current.is(":hidden")) {
                            iframeContent = self.current;
                            lastContent = self.last;
                        } else {
                            iframeContent = self.last;
                            lastContent = self.current;
                        }
                        self.picture = $('<iframe></iframe>').addClass('wijmo-wijgallery-iframe').attr({
                            frameborder: '0',
                            marginwidth: '0',
                            marginheight: '0',
                            scrolling: 'auto',
                            allowtransparency: 'true',
                            src: img.url
                        }).hide().appendTo(iframeContent).data("itemIndex", index).bind('load', function () {
                            var pic = $(this), index = pic.data("itemIndex");
                            self.loading.stop().hide();
                            if(self.pointer) {
                                self.pointer.fadeOut(100);
                            }
                            self._setCurrentStates(index);
                            if(index !== undefined) {
                                if(o.showCaption) {
                                    //self._loadCaption(self.images[index]);
                                    //self._showCaption(self.images[index]);
                                                                    }
                                pic.show();
                                lastContent.fadeOut(function () {
                                    lastContent.empty();
                                });
                                iframeContent.fadeIn();
                            }
                        });
                    }
                }
            };
            wijgallery.prototype._imageLoaded = function (self, size) {
                var pic = self.picture.attr("role", "img"), index = pic.data("itemIndex"), w = pic[0].naturalWidth || pic.width(), h = pic[0].naturalHeight || pic.height(), image = self.images[index];
                self.loading.stop().hide();
                if(self.pointer) {
                    self.pointer.fadeOut(100);
                }
                if(w > size.w || h > size.h) {
                    if(w / h > size.w / size.h) {
                        pic.css({
                            width: "100%"
                        });
                    } else {
                        pic.css({
                            height: "100%"
                        });
                    }
                } else if(w < size.w && h < size.h) {
                    pic.addClass(self.options.wijCSS.stateDefault).addClass("wijmo-wijgallery-small-image");
                }
                if(index !== undefined && image !== undefined) {
                    if(self.options.showCaption && self.caption) {
                        self._loadCaption(image);
                    }
                    self._animate(index);
                }
            };
            wijgallery.prototype._animate = function (index) {
                var self = this, o = self.options, animate = o.transitions, hori = o.thumbnailOrientation === "horizontal", width, height, wrapper, half, data, forward, effect = animate.animated, duration = animate.duration;
                //if (!self.last.find("img").attr("src") &&
                //!self.last.find("div."+flashCss)) {
                if(!self.last.children().length) {
                    self._setCurrentStates(index);
                    self.last.hide();
                    self.current.show();
                    return;
                }
                data = {
                    index: self.currentIdx,
                    to: index,
                    toImg: self.images[index]
                };
                if(!self._trigger("beforeTransition", null, data)) {
                    return;
                }
                if(effect) {
                    if(effect === "slide") {
                        width = self.size.w;
                        height = self.size.h;
                        self.current.show();
                        forward = self.currentIdx > index ? true : false;
                        wrapper = $.createWrapper(self.last).css({
                            overflow: 'hidden',
                            width: hori ? width * 2 : width,
                            height: hori ? height : height * 2,
                            left: hori ? (forward ? -width : 0) : 0,
                            top: hori ? 0 : (forward ? -height : 0)
                        });
                        wrapper[forward ? "prepend" : "append"](self.current);
                        wrapper.animate({
                            left: hori ? (forward ? 0 : -width) : 0,
                            top: hori ? 0 : (forward ? 0 : -height)
                        }, duration, function () {
                            if(self.last.parent().is(".ui-effects-wrapper")) {
                                self.last.unwrap();
                            }
                            self.last.hide();
                            self._setCurrentStates(index);
                        });
                    } else {
                        if($.mobile) {
                            half = duration / 2;
                            self.last.fadeOut(half, function () {
                                self.current.stop(true, true).fadeIn(half, function () {
                                    self._setCurrentStates(index);
                                });
                            });
                        } else {
                            if(effect === "explode" || effect === "scale" || effect === "blind" || effect === "fold") {
                                self.current.css({
                                    position: "absolute"
                                });
                                self.current.stop(true, true).show(effect, duration, function () {
                                    self.last.hide();
                                    self._setCurrentStates(index);
                                });
                            } else if(effect === "size") {
                                self.last.hide();
                                self.current.stop(true, true).show(effect, duration, function () {
                                    self.last.hide();
                                    self._setCurrentStates(index);
                                });
                            } else {
                                half = duration / 2;
                                self.last.hide(effect, half, function () {
                                    self.last.hide();
                                    self.current.stop(true, true).show(effect, half, function () {
                                        self._setCurrentStates(index);
                                    });
                                });
                            }
                        }
                    }
                } else {
                    self.last.hide();
                    self.current.show();
                    self._setCurrentStates(index);
                }
                self._thumbsScroll(index);
            };
            wijgallery.prototype._thumbsScroll = function (index) {
                var scrollIdx, self = this, o = self.options;
                if(self.thumbs && self.thumbs[self.thumbWidgetName]) {
                    if(o.scrollWithSelection) {
                        scrollIdx = index - Math.ceil(o.thumbsDisplay / 2) + 1;
                        if(index > 0 && index < self._count - 1) {
                            self.thumbs[self.thumbWidgetName]("scrollTo", scrollIdx);
                        }
                    } else {
                        if(index > (o.thumbsDisplay + self.currentThumbIdx - 1)) {
                            self.thumbs[self.thumbWidgetName]("scrollTo", index - o.thumbsDisplay + 1);
                        } else if(index < self.currentThumbIdx) {
                            self.thumbs[self.thumbWidgetName]("scrollTo", index);
                        }
                    }
                }
            };
            wijgallery.prototype._setCurrentStates = function (index) {
                var self = this, o = self.options, shouldPlay, data, last;
                last = self.currentIdx;
                self.currentIdx = index;
                shouldPlay = (index + 1) < self._count;
                if(self.isPlaying && shouldPlay) {
                    self.timeout = null;
                    self.isPlaying = false;
                    self._play();
                } else if(self.progressBar) {
                    self.pause();
                }
                // add disable to play btn.
                if((index + 1) >= self._count) {
                    self.nextBtn.add(self.playPauseBtn).removeClass(o.wijCSS.stateHover).addClass(o.wijCSS.stateDisabled);
                } else {
                    self.nextBtn.add(self.playPauseBtn).removeClass(o.wijCSS.stateDisabled);
                }
                if(index <= 0) {
                    self.previousBtn.removeClass(o.wijCSS.stateHover).addClass(o.wijCSS.stateDisabled);
                } else {
                    self.previousBtn.removeClass(o.wijCSS.stateDisabled);
                }
                if(o.showCaption) {
                    self._showCaption(self.images[index]);
                }
                if(self.thumbs && self.thumbs[self.thumbWidgetName]) {
                    self.activeLi = self.thumbs.find(carouselItem).eq(index);
                    if(!self.isScrolling) {
                        self._highlightThumb(self.activeLi);
                    }
                } else if(self.pager) {
                    if(self.pager.is(":wijmo-wijpager")) {
                        self.pager.wijpager("option", "pageIndex", index);
                    }
                }
                self._refreshCounter();
                self._clearCss();
                data = {
                    last: last,
                    index: self.currentIdx,
                    toImg: self.images[self.currentIdx]
                };
                self._trigger("afterTransition", null, data);
            };
            wijgallery.prototype._clearCss = function () {
                this.current.css({
                    position: "",
                    visibility: ""
                });
            };
            wijgallery.prototype._resetState = function () {
                var self = this;
                self._stopAnimation();
                if(self.isPlaying && self.progressBar) {
                    self.progressBar.stop();
                    self.progressBar.css({
                        width: "0%"
                    });
                }
            };
            wijgallery.prototype._stopAnimation = function () {
                var self = this, wrapper;
                wrapper = self.content.find(".ui-effects-wrapper");
                if(wrapper.length) {
                    wrapper.stop(true, true);
                }
                self.current.stop(true, true);
                self.last.stop(true, true);
            };
            wijgallery.prototype._checkPositionInElement = function (pos, ele) {
                return pos.X >= ele.offset().left && pos.X < ele.offset().left + ele.width() && pos.Y >= ele.offset().top && pos.Y < ele.offset().top + ele.height();
            };
            wijgallery.prototype.count = /**
            * Returns a count of the number of items in the gallery.
            * @returns {number} The number of items in the gallery
            */
            function () {
                return this._count;
            };
            wijgallery.prototype._wijdestroy = function () {
                var self = this, wijCSS = self.options.wijCSS;
                self.frame.unwrap().remove();
                if(self.options.thumbnails) {
                    if($[self.namespace][self.thumbWidgetName]) {
                        self.thumbs[self.thumbWidgetName]("destroy");
                        self.element.find("li").unbind().removeClass(wijCSS.stateActive).filter("." + selectedCss).removeClass(selectedCss);
                        self.thumbs.children("ul").unwrap().unwrap();
                    }
                } else {
                    if(self.pager && self.pager.length) {
                        self.pager.remove();
                    }
                    self.element.find("ul").css({
                        display: ""
                    });
                }
                if(self.pointer) {
                    self.pointer.remove();
                }
                self.element.removeClass([
                    baseCss, 
                    wijCSS.widget, 
                    wijCSS.content, 
                    wijCSS.cornerAll
                ].join(' '));
            };
            wijgallery.prototype.destroy = /**
            * Removes the wijgallery functionality completely. This returns the element to its pre-init state.
            */
            function () {
                this._wijdestroy();
                $.Widget.prototype.destroy.apply(this);
            };
            wijgallery.prototype.show = /**
            * Shows the picture at the specified index.
            * @example $("#element").wijgallery("show", 1);
            * @param {number} index The zero-based index of the picture to show.
            */
            function (index) {
                var self = this;
                self._resetState();
                self._show(index);
            };
            wijgallery.prototype.next = /**
            * Shows the next picture.
            */
            function () {
                var self = this, idx;
                if(self.options.disabled) {
                    return;
                }
                self._resetState();
                idx = self.currentIdx + 1;
                if(idx < self._count) {
                    self._show(idx);
                }
            };
            wijgallery.prototype.previous = /**
            * Shows the previous picture.
            */
            function () {
                var self = this, idx;
                if(self.options.disabled) {
                    return;
                }
                self._resetState();
                idx = self.currentIdx - 1;
                if(idx >= 0) {
                    self._show(idx);
                }
            };
            wijgallery.prototype.play = /**
            * Starts automatically displaying each of the images in order.
            */
            function () {
                this._play();
            };
            wijgallery.prototype._play = function (isFirst) {
                var self = this, o = self.options;
                if(self.isPlaying || o.disabled) {
                    return;
                }
                if(o.interval === 0) {
                    return self.pause();
                }
                if(isFirst) {
                    //if called by autoplay, images will be played after first image loaded.
                    self.isPlaying = true;
                    return;
                }
                if(o.showTimer && self.progressBar) {
                    self.progressBar.css({
                        width: "0%"
                    });
                    self.playPauseBtn.children("span:eq(0)").removeClass(o.wijCSS.iconPlay).addClass(o.wijCSS.iconPause);
                    self.progressBar.animate({
                        width: "100%"
                    }, o.interval, null, function () {
                        self._show(self.currentIdx + 1);
                    });
                } else {
                    if(self.timeout) {
                        return;
                    }
                    self.timeout = window.setTimeout(function () {
                        if(self.timerCount <= 1) {
                            //ensure only one timer call "next" at same time.
                            self.next();
                        }
                        self.timerCount--;
                    }, o.interval);
                    self.timerCount++;
                }
                self.isPlaying = true;
            };
            wijgallery.prototype.pause = /**
            * Stops automatically displaying the images in order.
            */
            function () {
                var self = this, o = self.options;
                if(o.showTimer && self.progressBar) {
                    self.progressBar.stop();
                    self.progressBar.css({
                        width: "0%"
                    });
                    self.playPauseBtn.children("span:eq(0)").removeClass(o.wijCSS.iconPause).addClass(o.wijCSS.iconPlay);
                } else {
                    if(self.timeout === null) {
                        return;
                    }
                    window.clearTimeout(self.timeout);
                    self.timeout = null;
                }
                self.isPlaying = false;
            };
            wijgallery.prototype.add = /**
            * Adds a custom item with specified index.
            * The first parameter is the new item to add,
            * it should be a jQuery Element or HTML string.
            * The second parameter is the index of item to add ,
            * If  no index specified the item will be added at the last of item collection.
            * @example
            * $("#element").wijgallery("add", "<li><img..></li>", index);
            * @param {string|jQuery} ui The node content or innerHTML.
            * @param {number} index Specified the postion to insert at.
            
            */
            function (ui, index) {
                var self = this, item, idx, data;
                if(typeof ui === "string") {
                    item = $(ui);
                    data = self._initLi(item);
                } else if(ui.jquery) {
                    item = ui;
                    data = self._initLi(item);
                } else if($.isPlainObject(ui)) {
                    data = ui;
                } else {
                    return;
                }
                //image
                if(!index || index > self._count) {
                    idx = self._count;
                } else if(index < 0) {
                    idx = 0;
                } else {
                    idx = index;
                }
                self.images.splice(idx, 0, data);
                self._count++;
                if(self.thumbs && self.thumbs[self.thumbWidgetName]) {
                    if(self.pointer && self.pointer.is(":hidden")) {
                        self.pointer.show();
                    }
                    self.thumbs[self.thumbWidgetName]("add", item, idx);
                }
                if(self._count === 1) {
                    self.show(0);
                }
                self._refreshStateWithItemsChanged(idx);
            };
            wijgallery.prototype.remove = /**
            * Removes the item at specified index.
            * The parameter is the index of item to add ,
            * If no index specified the last item will be removed.
            * @example
            * $("#element").wijgallery("remove", index);
            * @param {number} index Specified which item should be removed.
            */
            function (index) {
                var self = this, idx;
                if(isNaN(index) || index >= self._count) {
                    idx = self._count - 1;
                } else if(index < 0) {
                    idx = 0;
                } else {
                    idx = index;
                }
                if(idx >= 0) {
                    self.images.splice(idx, 1);
                    self._count--;
                    if(self.thumbs && self.thumbs[self.thumbWidgetName]) {
                        self.thumbs[self.thumbWidgetName]("remove", idx);
                    }
                    if(self.currentIdx == idx) {
                        self.current.children("img").remove();
                        self.last.children("img").remove();
                        self.picture = null;
                        self.currentIdx = -1;
                        if(self._count > 0) {
                            if(idx === self._count) {
                                self.show(idx - 1);
                            } else {
                                self.show(idx);
                            }
                        }
                    } else if(self.currentIdx > idx) {
                        var ci = self.currentIdx;
                        self.currentIdx = -1;
                        self.show(ci);
                    }
                    self._refreshStateWithItemsChanged(idx);
                }
            };
            wijgallery.prototype._refreshStateWithItemsChanged = function (index) {
                var self = this, o = self.options;
                if(self._count === 0) {
                    self.nextBtn.removeClass(o.wijCSS.stateHover).addClass(o.wijCSS.stateDisabled);
                    self.previousBtn.removeClass(o.wijCSS.stateHover).addClass(o.wijCSS.stateDisabled);
                    if(self.playPauseBtn) {
                        self.playPauseBtn.removeClass(o.wijCSS.stateHover).addClass(o.wijCSS.stateDisabled);
                    }
                    if(self.pointer) {
                        self.pointer.hide();
                    }
                } else {
                    if(self.currentIdx <= 0) {
                        self.previousBtn.removeClass(o.wijCSS.stateHover).addClass(o.wijCSS.stateDisabled);
                    } else if(self.currentIdx >= self._count - 1) {
                        self.nextBtn.removeClass(o.wijCSS.stateHover).addClass(o.wijCSS.stateDisabled);
                        if(self.playPauseBtn) {
                            self.playPauseBtn.removeClass(o.wijCSS.stateHover).addClass(o.wijCSS.stateDisabled);
                        }
                    } else {
                        self.nextBtn.removeClass(o.wijCSS.stateDisabled);
                        self.previousBtn.removeClass(o.wijCSS.stateDisabled);
                        if(self.playPauseBtn) {
                            self.playPauseBtn.removeClass(o.wijCSS.stateDisabled);
                        }
                        if(self.pointer && self.pointer.is(":hidden")) {
                            self.pointer.show();
                        }
                    }
                }
                self._refreshCounter();
            };
            wijgallery.prototype._getExt = function (url) {
                var ext, m, regExt = /[0-9a-z]+$/i, q = url.indexOf("?");
                if(q > -1) {
                    url = url.substring(0, q);
                }
                m = url.match(regExt);
                if(m) {
                    ext = m[0].toLowerCase();
                }
                return ext;
            };
            wijgallery.prototype._getPlayerName = function (url) {
                if(url.indexOf("#") === 0 || (url.indexOf("#") > 0 && url.indexOf(document.location.href) === 0)) {
                    return "inline";
                }
                var imgExt = [
                    "bmp", 
                    "gif", 
                    "jpg", 
                    "jpeg", 
                    "png"
                ], swfExt = [
                    "swf"
                ], flvExt = [
                    "flv", 
                    "m4v"
                ], qtExt = [
                    "dv", 
                    "mov", 
                    "moov", 
                    "movie", 
                    "mp4", 
                    "avi", 
                    "mpg", 
                    "mpeg"
                ], wmpExt = [
                    "asf", 
                    "avi", 
                    "mpg", 
                    "mpeg", 
                    "wm", 
                    "wmv"
                ], ext = this._getExt(url);
                if(ext) {
                    if($.inArray(ext, imgExt) >= 0) {
                        return "img";
                    }
                    if($.inArray(ext, swfExt) >= 0) {
                        return "swf";
                    }
                    if($.inArray(ext, flvExt) >= 0) {
                        return "flv";
                    }
                    if($.inArray(ext, wmpExt) >= 0) {
                        return "wmp";
                    }
                    if($.inArray(ext, qtExt) >= 0) {
                        return "qt";
                    }
                }
                return "unknown";
            };
            wijgallery.prototype._wrapFlash = function (container, type, url) {
                var self = this, lo = self.options, swf = url, wrapper, width = '100%', height = '100%', express = lo.flashInstall, version = lo.flashVersion, flashvars = lo.flashVars, params = lo.flashParams, id = self._newId();
                if(type === "flv") {
                    swf = lo.flvPlayer;
                    flashvars = $.extend({
                        file: url,
                        width: width,
                        height: height,
                        autostart: (lo.autoPlayMovies ? 'true' : 'false'),
                        controlbar: (lo.showMovieControls ? 'bottom' : "none"),
                        backcolor: "0x000000",
                        frontcolor: "0xCCCCCC",
                        lightcolor: "0x557722"
                    }, lo.flashVars);
                    params = $.extend({
                        autostart: (lo.autoPlayMovies ? 'true' : 'false'),
                        allowscriptaccess: 'always'
                    }, lo.flashParams);
                }
                wrapper = $('<div/>').addClass(flashCss).appendTo(container);
                $('<div/>').css({
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                }).attr('id', id).appendTo(wrapper);
                S.flash.embedSWF(swf, id, width, height, version, express, flashvars, params);
            };
            wijgallery.prototype._newId = function () {
                var chars = "a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z", charArray = [], id = "", i;
                charArray = chars.split("|");
                for(i = 0; i < 16; i++) {
                    id += charArray[Math.round(Math.random() * 25)];
                }
                return id;
            };
            return wijgallery;
        })(wijmo.wijmoWidget);
        gallery.wijgallery = wijgallery;        
        wijgallery.prototype.thumbWidgetName = "wijcarousel";
        var wijgallery_options = (function () {
            function wijgallery_options() {
                /**
                * wijMobileCSS
                * @ignore
                */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-a",
                    stateDefault: "ui-btn-up-a",
                    stateHover: "ui-btn-down-a",
                    stateActive: "ui-btn-down-b",
                    iconPlay: "ui-icon-arrow-r",
                    iconPause: "ui-icon-grid"
                };
                /** Selector option for auto self initialization.
                *	This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijgallery')";
                /** Allows pictures to be played automatically.
                * @example $("#element").wijgallery( { autoPlay: true } );
                */
                this.autoPlay = false;
                /** If set to true, the thumbnails will auto
                * scrolled after you select the image.
                * @example $("#element").wijgallery( { scrollWithSelection: true } );
                */
                this.scrollWithSelection = false;
                /** Determines if the timer bar should be shown.
                * @example $("#element").wijgallery( { showTimer: false } );
                */
                this.showTimer = true;
                /** Determines the time span between 2 pictures showing in autoplay mode.
                * @example $("#element").wijgallery( { interval: 3000 } );
                */
                this.interval = 5000;
                /** Determines whether the caption of items should be shown.
                * @example $("#element").wijgallery( { showCaption: true } );
                */
                this.showCaption = true;
                /** Determines whether to show captions for the thumbnails in the gallery.
                * @example $("#element").wijgallery( { showThumbnailCaptions: true } );
                */
                this.showThumbnailCaptions = false;
                /** An object collection that contains the data of the gallery.
                * @example
                * $("#element").wijgallery( { data: [{
                *		url: "../thumb/image1.jpg",
                *		thumbUrl: "../images/image1.jpg",
                *		title: "<span>Word Caption 1</span>"
                * },{
                *		imageUrl: "../thumb/image2.jpg",
                *		linkUrl: "../images/image2.jpg",
                *		title: "<span>Word Caption 2</span>"
                * }] } );
                */
                this.data = [];
                /** Determines whether the custom control should be shown.
                * @example $("#element").wijgallery( { showControls: true } );
                */
                this.showControls = false;
                /** Determines the innerHTML of the custom control.
                * @example $("#element").wijgallery( { control: "<div>Blah</div>" } );
                */
                this.control = "";
                /** A value that indicates the position settings for the custom control.
                * @type {object}
                * @example $("#element").wijgallery( {
                *		controlPosition: {
                *			my: 'left bottom',
                *			at: 'right top',
                *			offset: '0 0'}
                * });
                */
                this.controlPosition = {
                };
                /** Determines whether the controls should be shown after the dom element is created or hovered on.
                * @example $("#element").wijgallery( {
                *		showCounter: false
                *	});
                */
                this.showCounter = true;
                /**	Determines the text format of counter.
                * @remarks
                * '[i]' and '[n]' are built-in parameters represents
                * the current page index and the number of pages.
                * @example
                * $("#id").wijgallery({
                *     counter: '[i]/[n]'
                * });
                */
                this.counter = "[i] of [n]";
                /** Determines if the pager should be shown.
                * @example $("#element").wijgallery( {
                *		showPager: false
                *	} );
                */
                this.showPager = false;
                /** Determines the position of the pager.
                * @type {object}
                * @example $("#element").wijgallery( {
                *		pagingPosition: { my:{ },at:{ } } ;
                *	} );
                */
                this.pagingPosition = {
                };
                /** Determines the orientation of the thumbnails. Possible values are: "vertical" and "horizontal".
                * @example $("#element").wijgallery( {
                *		thumbnailOrientation: "vertical"
                *	} );
                */
                this.thumbnailOrientation = "horizontal";
                /** Determines the direction of the thumbnails. Possible values are: "before" and "after".
                * @example $("#element").wijgallery( {
                *		thumbnailOrientation: "before"
                *	} );
                */
                this.thumbnailDirection = "after";
                //
                /** A value that determines the settings of the animation effect to be used when the wijgallery is scrolling.
                * @type {object}
                * @example $("#element").wijgallery( {
                *		transitions: {
                *			animated: "slide",
                *			duration: 1000
                *		}
                *	} );
                */
                this.transitions = {
                    animated: "slide",
                    duration: 1000,
                    easing: null
                };
                /** Determines whether the controls should be shown after the dom element is created or hovered on.
                * @example $("#element").wijgallery( { showControlsOnHover: true } );
                */
                this.showControlsOnHover = true;
                /** Determines how many thumbnails should be displayed.
                * @example $("#element").wijgallery( { thumbsDisplay: 6 } );
                */
                this.thumbsDisplay = 5;
                /** Determines the length of the thumbnails.
                * @example $("#element").wijgallery( { thumbsLength: 6 } );
                */
                this.thumbsLength = 100;
                /** This is the beforeTransition event handler. It is a function called before transitioning to another image.
                * @event
                * @dataKey {number} index The index of the current image.
                * @dataKey {number} to The index of the image that will scrolled to.
                */
                this.beforeTransition = null;
                /** The afterTransition event handler. A function called after the transition is over.
                * @event
                * @dataKey {number} index The index of the current image.
                * @dataKey {number} to The index of the image that will scrolled to.
                */
                this.afterTransition = null;
                /** The loadCallback event handler. A function called after the dom element is created.
                * @event
                * @param {object} data The node widget that relates to this event.
                */
                this.loadCallback = null;
                /**	Determines whether to turn on the movie controls in movie player.
                * @example
                *  $("#id").wijgallery({
                *      showMovieControls: false
                *  });
                */
                this.showMovieControls = false;
                /**	Determines whether to turn on the autoplay option in movie player.
                * @example
                *  $("#id").wijgallery({
                *      autoPlayMovies: false
                *  });
                */
                this.autoPlayMovies = true;
                /**	A hash object that contains parameters for flash object.
                * @type{object}
                * @example
                *  $("#id").wijgallery({
                *      flashParams: { allowfullscreen: false }
                *  });
                */
                this.flashParams = {
                    bgcolor: "#000000",
                    allowfullscreen: true,
                    wmode: "transparent"
                };
                /**	A hash object that contains variants for flash object.
                * @type {object}
                * @example
                * $("#id").wijgallery({  flashVars: { width:300,  height:400 } });
                */
                this.flashVars = {
                };
                /**	Version of flash object.
                * @example
                * $("#id").wijgallery({  flashVersion: "8.0" })
                */
                this.flashVersion = "9.0.115";
                /**	The relative path and name of the flash vedio player.
                * @example
                * $("#id").wijgallery({  flvPlayer: "player\\player2.swf " });
                */
                this.flvPlayer = 'player\\player.swf';
                /**	The relative path and name of the flash installation guide.
                * @example
                * $("#id").wijgallery({  flashInstall: " player\expressInstall2.swf " });
                */
                this.flashInstall = 'player\\expressInstall.swf';
                /**	Determines the display mode of the gallery.
                * Possible values: "img", "iframe", "swf", "flv"
                * @example
                * $("#id").wijgallery({  mode: "swf" });
                */
                this.mode = "img";
            }
            return wijgallery_options;
        })();        
        wijgallery.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijgallery_options());
        $.wijmo.registerWidget("wijgallery", wijgallery.prototype);
    })(wijmo.gallery || (wijmo.gallery = {}));
    var gallery = wijmo.gallery;
})(wijmo || (wijmo = {}));
