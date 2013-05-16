/*
 *
 * Wijmo Library 3.20131.4
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
/// <reference path="../Base/jquery.wijmo.widget.ts" />
/// <reference path="../wijpager/jquery.wijmo.wijpager.ts" />
/// <reference path="../wijslider/jquery.wijmo.wijslider.ts" />
/*globals jQuery, window, XMLHttpRequest*/
/*
* Depends:
*     jquery.ui.core.js
*     jquery.ui.widget.js
*/
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery, widgetName = "wijcarousel", cssPrefix = "wijmo-wijcarousel-", baseCss = "wijmo-wijcarousel ", listCss = cssPrefix + "list", itemCss = cssPrefix + "item ", clipCss = cssPrefix + "clip", currentCss = cssPrefix + "current", horizontalMultiCss = cssPrefix + "horizontal-multi", horizontalCss = cssPrefix + "horizontal", btnCss = cssPrefix + "button", verticalMultiCss = cssPrefix + "vertical-multi", verticalCss = cssPrefix + "vertical", nextBtnCss = cssPrefix + "button-next", prevBtnCss = cssPrefix + "button-previous", previewCss = cssPrefix + "preview", btnHtml = "<a><span></span></a>", ctrlSelector = ".wijmo-wijcarousel-pager,." + btnCss + ",." + nextBtnCss + ",." + prevBtnCss, captionHtml = "<div></div>", pagerHtml = "<li class=\"wijmo-wijcarousel-page\"><a></a></li>", liSel = "li.wijmo-wijcarousel-page", captionSel = ".wijmo-wijcarousel-text,.wijmo-wijcarousel-caption", previewNum = 1;
    var WijCarousel = (function (_super) {
        __extends(WijCarousel, _super);
        function WijCarousel() {
            _super.apply(this, arguments);

        }
        WijCarousel.prototype._handleDisabledOption = function (disabled, ele) {
            var self = this, o = self.options;
            if(self.pager && !self.pager.is(":hidden")) {
                self.disabledEles = self.disabledEles.add(self.pager);
            }
            if(disabled) {
                self.element.addClass(o.wijCSS.stateDisabled);
                if(!self.disabledDiv.length) {
                    self._createDisabledDiv();
                }
                self.disabledDiv.appendTo("body");
            } else if(self.disabledDiv) {
                self.element.removeClass(o.wijCSS.stateDisabled);
                self.disabledDiv.remove();
                self.disabledDiv = $();
            }
        };
        WijCarousel.prototype._createDisabledDiv = function () {
            var self = this, o = self.options;
            self.disabledEles.each(function (idx, data) {
                var ele = $(data), eleOffset = ele.offset(), disabledWidth = ele.outerWidth(), disabledHeight = ele.outerHeight(), div = $("<div></div>").addClass(o.wijCSS.stateDisabled).css({
                    "z-index": "99999",
                    position: "absolute",
                    width: disabledWidth,
                    height: disabledHeight,
                    left: eleOffset.left,
                    top: eleOffset.top
                });
                if($.browser.msie) {
                    div.css("background-color", "white");
                    if($.browser.version === "9.0") {
                        div.css("opacity", "0.1");
                    }
                }
                self.disabledDiv = self.disabledDiv.add(div);
            });
        };
        WijCarousel.prototype._initStates = function (o, el) {
            var self = this;
            self.count = 0;
            self.currentIdx = o.start;
            self.timeout = null;
            self.isHorizontal = o.orientation === "horizontal";
            self.width = el.width() || 640;
            self.height = el.height() || 480;
            self.offset = 0;
            self.disabledEles = el;
            self.disabledDiv = $();
        };
        WijCarousel.prototype._create = function () {
            var self = this, o = self.options, el = self.element;
            // enable touch support:
            if(window.wijmoApplyWijTouchUtilEvents) {
                $ = window.wijmoApplyWijTouchUtilEvents($);
            }
            self._initStates(o, el);
            self._createDom(self.isHorizontal);
            self.list.bind("click." + self.widgetName, $.proxy(self._itemClick, self));
            if(o.showControlsOnHover) {
                self.container.bind("mouseenter." + self.widgetName, function () {
                    self._showControls();
                }).bind("mouseleave." + self.widgetName, function () {
                    self._hideControls();
                });
                self.container.find(ctrlSelector).hide();
            }
            if(o.loadCallback && $.isFunction(o.loadCallback)) {
                self._trigger("loadCallback", null, self);
            }
            if(o.disabledState) {
                var dis = o.disabled;
                self.disable();
                o.disabled = dis;
            } else if(o.auto) {
                self.play();
            }
            //update for visibility change
            if(self.element.is(":hidden") && self.element.wijAddVisibilityObserver) {
                self.element.wijAddVisibilityObserver(function () {
                    self.refresh();
                    if(self.element.wijRemoveVisibilityObserver) {
                        self.element.wijRemoveVisibilityObserver();
                    }
                }, "wijcarousel");
            }
        };
        WijCarousel.prototype._showControls = function () {
            this.container.find(ctrlSelector).stop(true, true).fadeIn(600, function () {
                $(this).css("opacity", "");
            });
        };
        WijCarousel.prototype._hideControls = function () {
            this.container.find(ctrlSelector).stop(true, true).fadeOut(600);
        };
        WijCarousel.prototype._applyContainerStyle = function (isHorizontal, isPreviewCreated) {
            /// <summary>
            /// Apply special styles. after create dom element.
            /// </summary>
                        var self = this, o = self.options, style = {
            }, list = self.list, listSize = 0, size, left = 0, dir = isHorizontal ? "left" : "top", i = 0, citem, sizeKey = isHorizontal ? "width" : "height";
            size = self.itemBound[isHorizontal ? "w" : "h"];
            self.count = self.list.children("li").length;
            listSize = self.count * size;
            self.list[sizeKey](listSize);
            self.clip[sizeKey](o.display * size);
            //self.container[sizeKey](o.display * size);
            self.clip[isHorizontal ? "height" : "width"](self.itemBound[isHorizontal ? "h" : "w"]);
            if(!o.loop) {
                style[dir] = -size * self.currentIdx;
                list.css(style);
            } else {
                citem = list.find(">li:first");
                // if preview mode the cuurent item is the second item of ul
                if(o.preview && !!isPreviewCreated) {
                    citem = citem.next()//previewNum
                    ;
                }
                i = citem.data("itemIndex");
                for(i; i < self.currentIdx; i++) {
                    list.children("li:first").appendTo(list);
                }
                if(o.preview) {
                    if(!isPreviewCreated) {
                        for(i = 0; i < previewNum; i++) {
                            list.children("li:last").prependTo(list);
                        }
                    }
                    left = -size * previewNum;
                }
                style[dir] = left;
                list.css(style);
            }
        };
        WijCarousel.prototype._applyListStyle = function () {
            var self = this, o = self.options, isHorizontal = o.orientation === "horizontal", listSize = 0, size, sizeKey = isHorizontal ? "width" : "height";
            self.itemBound = self._getItemBound();
            size = self.itemBound[isHorizontal ? "w" : "h"];
            listSize = self.count * size;
            self.list[sizeKey](listSize);
        };
        WijCarousel.prototype._createButtons = function (prevIconCss, nextIconCss) {
            var self = this, o = self.options, hover, disableClass = o.wijCSS.stateDisabled;
            $.each([
                "prevBtn", 
                "nextBtn"
            ], function (i, n) {
                var css = o[n + "Class"], is = n === "nextBtn", func = is ? "next" : "previous", btnCss = is ? nextBtnCss : prevBtnCss, iconCss = is ? nextIconCss : prevIconCss;
                if(css && css.defaultClass) {
                    disableClass = css.disableClass || disableClass;
                    hover = css.hoverClass//|| hover;
                    ;
                    self[n] = $("<a class=\"" + o.wijCSS.stateDefault + "\"></a>").addClass(css.defaultClass).mouseover(function () {
                        if(!$(this).hasClass(disableClass)) {
                            $(this).addClass(hover);
                        }
                    }).mouseout(function () {
                        if(!$(this).hasClass(disableClass)) {
                            $(this).removeClass(hover);
                        }
                    });
                } else {
                    self[n] = $(self._createBtn(btnCss, iconCss));
                }
                //self[n].bind("click." + self.widgetName, $.proxy(self[func], self))
                self[n].bind("click." + self.widgetName, function (event) {
                    var btn = $(this);
                    if(btn.hasClass(o.wijCSS.stateDisabled)) {
                        return;
                    }
                    self[func].call(self);
                }).appendTo(self.container);
            });
        };
        WijCarousel.prototype._applyBtnClass = function () {
            var self = this, o = self.options, disable = o.wijCSS.stateDisabled, hover = o.wijCSS.stateHover;
            $.each([
                "prevBtn", 
                "nextBtn"
            ], function (i, n) {
                var css = o[n + "Class"], con, btn = self[n];
                if(css) {
                    disable = css.disableClass || disable;
                    hover = css.hoverClass || hover;
                }
                con = n === "prevBtn" ? (self.currentIdx <= 0) : ((self.currentIdx + o.display) >= self.count);
                if(con && !o.loop) {
                    btn.removeClass(hover).addClass(disable);
                } else if(btn.hasClass(disable)) {
                    btn.removeClass(disable);
                }
            });
        };
        WijCarousel.prototype._applyBtnStyle = function (isHorizontal) {
            var self = this, buttonSize = 0, buttonOffset, css = self.options.wijCSS, nextPosition = {
                collision: "none",
                of: self.container,
                my: isHorizontal ? "right{offset} center" : "center bottom{offset}",
                at: isHorizontal ? "right center" : "center bottom"
            }, prevPosition = {
                collision: "none",
                of: self.container,
                my: isHorizontal ? "left{offset} center" : "center top{offset}",
                at: isHorizontal ? "left center" : "center top"
            }, inside = self.options.buttonPosition === "inside", nextCorner, prevCorner, dirs = [
                "cornerBottom", 
                "cornerTop", 
                "cornerRight", 
                "cornerLeft"
            ], ndir = (isHorizontal ? 1 : 0) * 2 + (inside ? 1 : 0), pdir = (isHorizontal ? 1 : 0) * 2 + (!inside ? 1 : 0), appltStyle = function (btn, c1, c2, offset, position) {
                var off = "";
                btn.removeClass(c1).addClass(c2);
                if(!isNaN(offset) && offset !== 0) {
                    if(offset > 0) {
                        off = "+" + offset;
                    } else {
                        off = "-" + (-offset);
                    }
                }
                position.my = position.my.replace(/\{offset\}/, off);
                btn.position(position);
            };
            buttonSize = isHorizontal ? self.prevBtn.width() : self.prevBtn.height();
            buttonOffset = inside ? 0 : buttonSize;
            nextCorner = css[dirs[ndir]];
            prevCorner = css[dirs[pdir]];
            appltStyle(self.nextBtn, prevCorner, nextCorner, buttonOffset, nextPosition);
            appltStyle(self.prevBtn, nextCorner, prevCorner, -buttonOffset, prevPosition);
            self._applyBtnClass();
        };
        WijCarousel.prototype._createDom = function (isHorizontal) {
            /// <summary>
            /// Create base dom , apply styles , bind event
            /// </summary>
                        var self = this, o = self.options, el = self.element, containerCss, nextIconCss, prevIconCss, allCss;
            if(el.is("div")) {
                self.list = el.children("ul:eq(0)");
                self.container = self.element;
                if(!self.list.length) {
                    self.list = $("<ul></ul>").appendTo(self.container);
                }
            } else if(el.is("ul")) {
                self.list = el;
                self.container = el.parent();
            } else {
                return;
            }
            self.itemBound = self._getItemBound();
            if(isHorizontal) {
                containerCss = (o.display > 1 && !o.preview) ? horizontalMultiCss : horizontalCss;
                nextIconCss = o.wijCSS.iconArrowRight;
                prevIconCss = o.wijCSS.iconArrowLeft;
            } else {
                containerCss = (o.display > 1 && !o.preview) ? verticalMultiCss : verticalCss;
                nextIconCss = o.wijCSS.iconArrowDown;
                prevIconCss = o.wijCSS.iconArrowUp;
            }
            self.list.addClass(listCss).addClass(o.wijCSS.helperClearFix);
            allCss = baseCss + o.wijCSS.widget + " " + containerCss + " " + (o.preview ? (previewCss + " ") : "") + (o.display > 1 ? o.wijCSS.content + " " + o.wijCSS.cornerAll : "");
            self.container.addClass(allCss);
            self._createItems(isHorizontal);
            self._createClip(isHorizontal);
            self._applyContainerStyle(isHorizontal);
            self._createButtons(prevIconCss, nextIconCss);
            self._applyBtnStyle(isHorizontal);
            if(o.preview) {
                self._createPreview();
            }
            if(o.showTimer) {
                self._createTimer();
            }
            if(o.showPager) {
                self._createPager();
            }
            if(o.showControls) {
                self._createControls();
            }
        };
        WijCarousel.prototype._createPreview = // add new feature
        function () {
            var self = this, o = self.options, offset, size, isH = o.orientation === "horizontal", dir = isH ? "left" : "top", antiDir = isH ? "right" : "bottom", bound, idx;
            size = self.itemBound[isH ? "w" : "h"];
            offset = self.offset = Math.round(size / 4);
            bound = o.display * size + offset * 2;
            self.clip[isH ? "width" : "height"](bound);
            self.list.css(dir, function (i, v) {
                return parseFloat(v) + offset;
            });
            self.clip.css(dir, function (i, v) {
                return -offset;
            });
            self.container.css("margin-" + dir, offset + "px").css("margin-" + antiDir, offset + "px");
            self.list.find(captionSel).hide();
            for(idx = 0; idx < o.display; idx++) {
                self._getItemByIndex(self.currentIdx + idx).find(captionSel).show();
            }
        };
        WijCarousel.prototype._createItemsFromData = function (data) {
            var self = this;
            if(!$.isArray(data) || !data.length || !$.isPlainObject(data[0]) || $.isEmptyObject(data[0])) {
                return;
            }
            self.list.empty();
            $.each(data, function (idx, item) {
                var li;
                if(!$.isPlainObject(item)) {
                    return true;
                }
                li = self._generateMarkup(item);
                self.list.append(li);
            });
        };
        WijCarousel.prototype._generateMarkup = function (item) {
            //item is js object
                        var li, a;
            if(!$.isPlainObject(item)) {
                return;
            }
            li = $("<li></li>");
            if(typeof item.linkUrl === "string" && item.linkUrl) {
                a = $("<a>").attr("href", item.linkUrl);
                a.appendTo(li);
            }
            if(typeof item.imageUrl === "string" && item.imageUrl) {
                $("<img>").attr("src", item.imageUrl).appendTo(a || li);
            }
            if(typeof item.caption === "string" && item.caption) {
                $("<span>").html(item.caption).appendTo(li);
            }
            return li;
        };
        WijCarousel.prototype._createItems = function (isHorizontal) {
            var self = this, displays, i, o = self.options, currentItem, item;
            if(self.list) {
                self._createItemsFromData(o.data);
                self.list.children("li").each(function (idx, data) {
                    var item = $(data);
                    self._createItem(item, idx);
                });
                currentItem = self.list.children("li").eq(self.currentIdx).addClass(currentCss);
                if(o.preview && o.display > 1) {
                    displays = item = currentItem;
                    for(i = 0; i < o.display - 1; i++) {
                        item = item.next();
                        displays = displays.add(item);
                    }
                    displays.find("div.wijmo-wijcarousel-mask").css({
                        opacity: 0
                    });
                }
            }
        };
        WijCarousel.prototype._createItem = function (item, idx) {
            var self = this, o = self.options, img, span;
            img = item.addClass(itemCss).addClass(o.wijCSS.helperClearFix).find("img:eq(0)").attr("role", "img").addClass("wijmo-wijcarousel-image");
            self._applyItemBound(item);
            span = item.children("span:eq(0)").hide();
            self._createCaption(item, img, span);
            if(o.preview) {
                $("<div class=\"wijmo-wijcarousel-mask\">").appendTo(item);
            }
            item.data("itemIndex", idx);
            return item;
        };
        WijCarousel.prototype._applyItemBound = function (item) {
            var self = this, w = self.itemBound.w, h = self.itemBound.h;
            if(!self.itemWidth || !self.itemHeight) {
                item.width(w).height(h);
                self.itemWidth = w - (item.outerWidth(true) - w);
                self.itemHeight = h - (item.outerHeight(true) - h);
            }
            item.width(self.itemWidth).height(self.itemHeight);
        };
        WijCarousel.prototype._createCaption = function (item, img, span) {
            var self = this, o = self.options, caption, text, content, overlay, height;
            if(o.showCaption) {
                caption = span.html() || img.attr("title");
                if(caption && caption.length) {
                    content = $("<span></span>").html(caption);
                    overlay = $(captionHtml).addClass([
                        o.wijCSS.helperClearFix, 
                        "wijmo-wijcarousel-caption"
                    ].join(' ')).appendTo(item);
                    text = $(captionHtml).addClass([
                        o.wijCSS.helperClearFix, 
                        o.wijCSS.content, 
                        "wijmo-wijcarousel-text"
                    ].join(' ')).append(content).appendTo(item);
                    self._applyCaptionStyle(overlay, text);
                }
            }
        };
        WijCarousel.prototype._applyCaptionStyle = function (overlay, text) {
            var caption = overlay.add(text), height;
            caption.width(this.itemWidth);
            if($.browser.webkit) {
                height = text.children("span").css("display", "inline-block").height();
                text.children("span").css("display", "");
            } else {
                height = text.children("span").height();
            }
            caption.height(height);
        };
        WijCarousel.prototype._showCaption = function (idx, lastIndex) {
            var self = this, item = self._getItemByIndex(idx), text = item.find(".wijmo-wijcarousel-text"), caption = item.find(".wijmo-wijcarousel-caption");
            if(text.length) {
                text.fadeIn(300, function () {
                    if(idx < lastIndex) {
                        self._showCaption(idx + 1, lastIndex);
                    }
                });
            }
            if(caption.length) {
                caption.show();
                caption.animate({
                    opacity: 0.5
                }, 300);
            }
        };
        WijCarousel.prototype._hideCaption = function () {
            this.element.find(captionSel).hide();
        };
        WijCarousel.prototype._createClip = function (isHorizontal) {
            this.clip = this.list.wrap("<div></div>").parent().addClass(clipCss);
        };
        WijCarousel.prototype._createBtn = function (btnClass, itemClass) {
            var btn = $(btnHtml), o = this.options;
            btn.addClass(o.wijCSS.stateDefault + ' ' + btnClass).attr("role", "button").mouseover(function () {
                if(!$(this).hasClass(o.wijCSS.stateDisabled)) {
                    $(this).addClass(o.wijCSS.stateHover);
                }
            }).mouseout(function () {
                if(!$(this).hasClass(o.wijCSS.stateDisabled)) {
                    $(this).removeClass(o.wijCSS.stateHover);
                }
            }).children("span:eq(0)").addClass(o.wijCSS.icon + ' ' + itemClass);
            return btn;
        };
        WijCarousel.prototype._createControls = function () {
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
        WijCarousel.prototype._createTimer = function () {
            var self = this, o = self.options;
            self._createPausePlay();
            self.progressBar = $("<div></div>").addClass("wijmo-wijcarousel-timerbar-inner " + o.wijCSS.cornerAll).css({
                width: "0%"
            }).attr("role", "progressbar");
            self.timer = $("<div></div>").addClass("wijmo-wijcarousel-timerbar " + o.wijCSS.cornerAll).appendTo(self.container).append(self.progressBar).append(self.playPauseBtn);
        };
        WijCarousel.prototype._createPausePlay = function () {
            var self = this, o = self.options;
            self.playPauseBtn = $(self._createBtn(btnCss, o.auto ? o.wijCSS.iconPause : o.wijCSS.iconPlay)).bind("click." + self.widgetName, function () {
                var icon = $(this).children("span:eq(0)");
                self[icon.hasClass(o.wijCSS.iconPlay) ? "play" : "pause"]();
            });
        };
        WijCarousel.prototype._createPagingItem = function (isDot, thumbOpt, ul, idx) {
            var item = $(pagerHtml).attr({
                "role": "tab",
                "aria-label": idx + 1,
                "title": idx + 1
            }).addClass(this.options.wijCSS.stateDefault), width, height;
            if(isDot) {
                item.addClass("wijmo-wijcarousel-dot");
            } else {
                if(thumbOpt && thumbOpt.images && thumbOpt.images[idx]) {
                    width = thumbOpt.imageWidth;
                    height = thumbOpt.imageHeight;
                    if(width && height) {
                        item.width(width).height(height);
                    }
                    item.children("a").append($("<img>").attr("src", thumbOpt.images[idx]));
                } else {
                    return;
                }
            }
            ul.append(item);
        };
        WijCarousel.prototype._createPaging = function (type) {
            var self = this, o = self.options, i, ul, li, thumbOpt = o.thumbnails, isDot = type === "dots";
            self.container.append(self.pager = $("<div><ul class=\"wijmo-list " + o.wijCSS.cornerAll + " " + o.wijCSS.helperClearFix + " role=\"tablist\"></ul></div>"));
            if(!isDot) {
                self.pager.addClass("wijmo-wijcarousel-thumbnails");
            }
            ul = self.pager.children("ul.wijmo-list");
            for(i = 0; i < self.count; i++) {
                self._createPagingItem(isDot, thumbOpt, ul, i);
            }
            li = self.pager.find("li").eq(self.currentIdx);
            if(li.length) {
                self._activePagerItem(li);
            }
            //Add support for jUICE!
            if(thumbOpt) {
                $.each([
                    "mousedown", 
                    "mouseup", 
                    "mouseover", 
                    "mouseout", 
                    "click"
                ], function (i, n) {
                    var c = thumbOpt[n];
                    if(c && (typeof c === "string") && window[c]) {
                        thumbOpt[n] = window[c];
                    }
                });
            }
            //end
            self.pager.bind("mouseover." + self.widgetName, function (event) {
                self._pageingEvents(event, "mouseover", thumbOpt, isDot, function (li) {
                    li.addClass(o.wijCSS.stateHover);
                });
            }).bind("mouseout." + self.widgetName, function (event) {
                self._pageingEvents(event, "mouseout", thumbOpt, isDot, function (li) {
                    li.removeClass(o.wijCSS.stateHover);
                });
            }).bind("click." + self.widgetName, function (event) {
                self._pageingEvents(event, "click", thumbOpt, isDot, function (li) {
                    self.scrollTo(li.index());
                    self._activePagerItem(li);
                });
            });
            if(!isDot) {
                $.each([
                    "mousedown", 
                    "mouseup"
                ], function (i, n) {
                    if($.isFunction(thumbOpt[n])) {
                        self.pager.bind(n, function (event) {
                            var li = $(event.target).closest(liSel);
                            if(li.length) {
                                thumbOpt[n].call(li, event);
                            }
                        });
                    }
                });
            }
        };
        WijCarousel.prototype._pageingEvents = function (event, type, thumbOpt, isDot, func) {
            var li = $(event.target).closest(liSel);
            if(li.length) {
                if($.isFunction(func)) {
                    func.call(event, li);
                }
                if(!isDot && $.isFunction(thumbOpt[type])) {
                    thumbOpt[type].call(li, event);
                }
            }
        };
        WijCarousel.prototype._activePagerItem = function (li) {
            var activeCSS = this.options.wijCSS.stateActive;
            li.addClass(activeCSS).attr("aria-selected", "true").siblings("li").removeClass(activeCSS).removeAttr("aria-selected");
        };
        WijCarousel.prototype._createWijSlider = function () {
            var self = this, sOri = self.options.sliderOrientation, options = {
                orientation: sOri,
                range: false,
                min: 0,
                max: self.count - 1,
                step: //pageSize
                1,
                value: self.currentIdx,
                buttonClick: function (event, ui) {
                    var idx = ui.value;
                    self.scrollTo(idx);
                },
                slide: function (event, ui) {
                    var idx = ui.value;
                    self.scrollTo(idx);
                }
            }, slider = $("<div></div>").css("margin-bottom", "10px").css(sOri === "horizontal" ? "width" : "height", "200px").appendTo(self.container);
            self.pager = slider.wijslider(options).parent().wrap("<div>").parent().addClass("wijmo-wijcarousel-slider-wrapper");
        };
        WijCarousel.prototype._createWijPager = function () {
            var self = this, options = {
                pageCount: self.count,
                pageIndex: self.currentIdx,
                pageButtonCount: self.count,
                mode: "numeric",
                pageIndexChanged: function (event, ui) {
                    var idx = ui.newPageIndex;
                    self.scrollTo(idx);
                }
            }, pager = $("<div></div>").appendTo(self.container);
            self.pager = pager.wijpager(options).css({
                position: "absolute"
            });
        };
        WijCarousel.prototype._createPager = function () {
            var self = this, o = self.options, position = {
                collision: "none",
                of: self.container,
                my: "right top",
                at: "right bottom"
            };
            if(o.pagerType === "numbers") {
                self._createWijPager();
            } else if(o.pagerType === "dots" || o.pagerType === "thumbnails") {
                self._createPaging(o.pagerType);
                self.pager.css({
                    position: "absolute"
                });
            } else if($.wijmo.wijslider && o.pagerType === "slider") {
                self._createWijSlider();
                if(o.sliderOrientation !== "horizontal") {
                    position.my = "left center";
                    position.at = "right center";
                }
            } else {
                return;
            }
            self.pager.width(self.pager.width() + 1);
            $.extend(position, o.pagerPosition);
            o.pagerPosition = position;
            self.pager.addClass("wijmo-wijcarousel-pager").position(position);
        };
        WijCarousel.prototype._setOption = function (key, value) {
            var self = this, o = self.options, el, create, old, isHorizontal = o.orientation === "horizontal";
            if(key === "pagerPosition" || key === "animation" || key === "controlPosition") {
                $.extend(true, o[key], value);
            } else {
                old = o[key];
                $.Widget.prototype._setOption.apply(self, arguments);
                switch(key) {
                    case "showControls":
                    case "showPager":
                    case "showTimer":
                        if(value === old) {
                            break;
                        }
                        el = key.replace(/show/i, "").toLowerCase();
                        create = key.replace(/show/i, "_create");
                        if(value === true) {
                            if(!self[el]) {
                                self[create]();
                            } else if(self[el].jquery) {
                                self[el].show();
                            }
                        } else {
                            self[el].hide();
                        }
                        break;
                    case "loop":
                    case "orientation":
                    case "display":
                    case "preview":
                        if(value !== old) {
                            self._wijdestroy();
                            self._create();
                        }
                        break;
                    case "data":
                        self._createItems(isHorizontal);
                        self._applyContainerStyle(isHorizontal);
                        self._applyBtnClass();
                        if(o.showPager) {
                            self._createPager();
                        }
                        break;
                    case "showCaption":
                        if(value) {
                            self._createItems(isHorizontal)//re-create item with captions.
                            ;
                        } else {
                            self.element.find(captionSel).remove();
                        }
                        break;
                    case "buttonPosition":
                        self._applyBtnStyle(isHorizontal);
                        break;
                    case "pagerType":
                        if(value !== old) {
                            if(self.pager && self.pager.jquery) {
                                self.pager.remove();
                                self.pager = null;
                            }
                            self._createPager();
                        }
                        break;
                    case "disabled":
                        self._handleDisabledOption(value, self.element);
                        break;
                    default:
                        break;
                }
            }
        };
        WijCarousel.prototype._getItemBound = function () {
            var bound = {
            }, self = this, o = self.options;
            if(o.orientation === "horizontal") {
                bound = {
                    w: Math.round(self.width / o.display),
                    h: self.height
                };
            } else {
                bound = {
                    w: self.width,
                    h: Math.round(self.height / o.display)
                };
            }
            return bound;
        };
        WijCarousel.prototype._stopAnimation = function () {
            var self = this;
            if(self.isPlaying && self.progressBar) {
                self.progressBar.stop().css({
                    width: "0%"
                });
            }
            self.list.stop(true, true);
        };
        WijCarousel.prototype._itemClick = function (event) {
            var el = $(event.target), self = this, o = self.options, cIdx = self.currentIdx, item = el.closest("li." + itemCss), itemIdx = item.data("itemIndex"), idx, forward;
            if(item.length > 0) {
                if(o.preview && itemIdx < cIdx || itemIdx > cIdx + o.display - 1) {
                    idx = self._getItemByIndex(cIdx).index();
                    forward = (item.index() > idx) ? "next" : "previous";
                    self[forward]();
                }
                self._trigger("itemClick", event, {
                    index: itemIdx,
                    el: item
                });
            }
        };
        WijCarousel.prototype._wijdestroy = function () {
            var self = this, wijCSS = self.options.wijCSS;
            self.container.removeClass("wijmo-wijcarousel " + wijCSS.widget).removeClass("wijmo-wijcarousel-horizontal").removeClass("wijmo-wijcarousel-vertical");
            if(self.timeout) {
                self.list.stop(true);
                window.clearTimeout(self.timeout);
                self.timeout = null;
            }
            self.list.unwrap().removeClass("wijmo-wijcarousel-list").removeClass(wijCSS.helperClearFix).unbind("." + self.widgetName).removeAttr("style").children("li").each(function (idx, data) {
                var item = $(data);
                item.removeClass("wijmo-wijcarousel-item").removeClass(wijCSS.helperClearFix).removeClass(currentCss);
                item.children("img").removeClass("wijmo-wijcarousel-image");
                item.children(captionSel).remove();
                item.css({
                    width: "",
                    height: ""
                });
                item.removeData("itemIndex");
            });
            self.itemWidth = self.itemHeight = undefined;
            self.element.find(ctrlSelector + ",.wijmo-wijcarousel-timerbar").remove();
            if(self.pager) {
                self.pager.remove();
            }
            self.element.find("li>span").css("display", "");
            if(self.disabledDiv.length) {
                self.disabledDiv.remove();
                self.disabledDiv = $();
            }
        };
        WijCarousel.prototype.destroy = function () {
            /// <summary>
            /// Removes the wijcarousel functionality completely. This returns the element to its pre-init state.
            /// </summary>
            this._wijdestroy();
            $.Widget.prototype.destroy.apply(this);
        };
        WijCarousel.prototype._resetDom = function () {
            var self = this;
            //reset list item container
            self._applyListStyle();
            self.list.children("li").each(function (idx, data) {
                var li = $(data), caption = li.children("div.wijmo-wijcarousel-caption"), text = li.children("div.wijmo-wijcarousel-text");
                self._applyItemBound(li);
                self._setStyle(caption.add(text), function () {
                    self._applyCaptionStyle(caption, text);
                });
            });
            self._applyContainerStyle(self.isHorizontal, true);
            //reset preview
            if(self.options.preview) {
                self._createPreview();
            }
            //reset controls(button, pager, controls)
            self._setStyle(self.prevBtn.add(self.nextBtn), function () {
                self._applyBtnStyle(self.isHorizontal);
            });
            self._setStyle(self.pager, function () {
                self.pager.position(self.options.pagerPosition);
            });
            self._setStyle(self.controls, function () {
                self.controls.position(self.options.controlPosition);
            });
        };
        WijCarousel.prototype._setStyle = function (control, func) {
            var isShow = true;
            if(!control || control.length === 0) {
                return;
            }
            if(control.css("display") == "none") {
                isShow = false;
                control.css("display", "");
            }
            func.call(this);
            if(!isShow) {
                control.css("display", "none");
            }
        };
        WijCarousel.prototype.refresh = function () {
            /// <summary>
            /// Refresh the carousel layout.
            /// Reset the layout, scrolled
            /// </summary>
                        var self = this, o = self.options, el = self.element;
            //reset variable
            self.width = el.width() || 640;
            self.height = el.height() || 480;
            self.itemWidth = self.itemHeight = 0;
            self._resetDom();
            self.pause();
        };
        WijCarousel.prototype.play = function () {
            /// <summary>
            /// Starts automatically displaying each of the images in order.
            /// </summary>
                        var self = this, o = self.options;
            if(self.isPlaying || o.disabled) {
                return;
            }
            if(o.interval === 0) {
                return self.pause();
            }
            if(o.showTimer && self.progressBar) {
                self.progressBar.css({
                    width: "0%"
                });
                self.playPauseBtn.children("span:eq(0)").removeClass(o.wijCSS.iconPlay).addClass(o.wijCSS.iconPause);
                self.progressBar.animate({
                    width: "100%"
                }, o.interval, null, function () {
                    self._scroll("next", o.step);
                });
            } else {
                if(self.timeout) {
                    return;
                }
                self.timeout = window.setTimeout(function () {
                    self.next();
                }, o.interval);
            }
            self.isPlaying = true;
        };
        WijCarousel.prototype.pause = function () {
            /// <summary>
            /// Stops automatically displaying the images in order.
            /// </summary>
                        var self = this, o = self.options;
            if(o.showTimer && self.progressBar) {
                self.progressBar.stop().css({
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
        WijCarousel.prototype.next = function () {
            /// <summary>
            /// Shows the next picture.
            /// </summary>
                        var self = this, step = self.options.step;
            if(typeof step !== "number" || step < 1) {
                return;
            }
            self._stopAnimation();
            self._scroll("next", step);
        };
        WijCarousel.prototype.previous = function () {
            /// <summary>
            /// Shows the previous picture.
            /// </summary>
                        var self = this, step = self.options.step;
            if(typeof step !== "number" || step < 1) {
                return;
            }
            self._stopAnimation();
            self._scroll("previous", step);
        };
        WijCarousel.prototype.scrollTo = function (idx) {
            /// <summary>
            /// Scrolls to the picture at the specified index.
            /// Parameter:
            /// index(number) - The zero - based index of the picture to which to scroll.
            /// Code Example:
            /// $("#element").wijcarousel("scrollTo", index);
            /// </summary>
                        var self = this, forward, step;
            self._stopAnimation();
            forward = idx > self.currentIdx ? "next" : "previous";
            step = Math.abs(idx - self.currentIdx);
            if(idx !== self.currentIdx) {
                self._scroll(forward, step);
            }
        };
        WijCarousel.prototype._scroll = function (forward, step) {
            var self = this, o = self.options, list = self.list, offset = 0, mask, i, isHorizontal = o.orientation === "horizontal", option = {
            }, size = self.itemBound[isHorizontal ? "w" : "h"], dir = isHorizontal ? "left" : "top", scrolled = step, css = {
            }, previewOffset = 0, currentLeft = self.currentIdx * size;
            if(!o.loop) {
                if(forward === "next") {
                    if(self.currentIdx + o.display + step <= self.count) {
                        offset = -currentLeft - size * scrolled;
                    } else if(self.currentIdx + o.display < self.count) {
                        scrolled = self.count - self.currentIdx - o.display;
                        offset = -currentLeft - size * scrolled;
                    } else {
                        return;
                    }
                } else {
                    if(self.currentIdx - step >= 0) {
                        offset = -currentLeft + size * scrolled;
                    } else if(self.currentIdx > 0) {
                        scrolled = self.currentIdx;
                        offset = 0;
                    }
                }
                if(offset !== undefined) {
                    //self.offset for preview mode.
                    option[dir] = offset + self.offset;
                    //if ($.browser.webkit) {
                    //	self.list.css(dir, -currentLeft);
                    //}
                    self._doAnimation(forward, option, scrolled);
                }
            } else {
                if(o.preview) {
                    offset = previewOffset = -size * previewNum + self.offset;
                }
                if(forward === "next") {
                    offset += -size * scrolled;
                    option[dir] = offset;
                } else {
                    for(i = 0; i < step; i++) {
                        offset -= size;
                        list.children("li:last").prependTo(list);
                    }
                    css[dir] = offset;
                    option[dir] = previewOffset;
                    list.css(css);
                }
                self._doAnimation(forward, option, step, dir, size);
            }
            if(o.preview) {
                mask = $();
                for(i = 0; i < o.display; i++) {
                    mask = mask.add(self._getItemByIndex(self.currentIdx + i).find("div.wijmo-wijcarousel-mask:eq(0)"));
                }
                mask.stop(true).animate({
                    opacity: 0.6
                }, o.animation.duration / 2, function () {
                    //mask.css({ opacity: "" });
                    self._getItemByIndex(self.currentIdx).removeClass(currentCss);
                });
            }
        };
        WijCarousel.prototype._doAnimation = function (action, option, scrolled, dir, size) {
            var self = this, list = self.list, o = self.options, data, i, animation = {
                complete: null
            }, completeCallback, css = {
            }, to;
            if(!self.list.children().length) {
                return;
            }
            if(action === "next") {
                to = self.currentIdx + scrolled;
            } else {
                to = self.currentIdx - scrolled;
            }
            if(!o.loop) {
                completeCallback = function () {
                    self.currentIdx = to;
                    self._setCurrentState(self.currentIdx);
                };
            } else {
                to = to % self.count + (to < 0 ? self.count : 0);
                completeCallback = function () {
                    //self.isAnimating = false;
                    var left = 0;
                    if(o.preview) {
                        left = self.offset - previewNum * size;
                    }
                    if(action === "next") {
                        for(i = 0; i < scrolled; i++) {
                            list.children("li:first").appendTo(list);
                        }
                        if(dir) {
                            css[dir] = left;
                            list.css(css);
                        }
                    }
                    self.currentIdx = to;
                    self._setCurrentState(self.currentIdx);
                };
            }
            animation.complete = completeCallback;
            data = {
                index: self.currentIdx,
                to: to,
                el: self._getItemByIndex(self.currentIdx)
            };
            if(!self._trigger("beforeScroll", null, data)) {
                return;
            }
            if(o.animation && o.animation.complete) {
                o.animation.complete = undefined;
            }
            $.extend(animation, o.animation);
            self._hideCaption();
            list.animate(option, animation);
        };
        WijCarousel.prototype._setCurrentState = function (idx) {
            var self = this, o = self.options, li, data, shouldPlay, lastIdx = idx + o.display - 1, currentItem, mask, i;
            if(!o.loop) {
                shouldPlay = (idx + o.display) < self.count;
                if(self.isPlaying && shouldPlay) {
                    window.clearTimeout(self.timeout);
                    self.timeout = null;
                    self.isPlaying = false;
                    self.play();
                } else if(self.progressBar) {
                    self.pause();
                }
                self._applyBtnClass();
            } else if(self.isPlaying) {
                window.clearTimeout(self.timeout);
                self.timeout = null;
                self.isPlaying = false;
                self.play();
            }
            if(o.preview) {
                mask = $();
                currentItem = self._getItemByIndex(idx);
                for(i = 0; i < o.display; i++) {
                    mask = mask.add(self._getItemByIndex(idx + i).find("div.wijmo-wijcarousel-mask:eq(0)"));
                }
                mask.animate({
                    opacity: 0
                }, o.animation.duration / 2, function () {
                    currentItem.addClass(currentCss);
                    self._showCaption(idx, lastIdx);
                });
            } else {
                self._showCaption(idx, lastIdx);
            }
            if(self.pager) {
                if($.wijmo.wijslider && self.pager.find(":wijmo-wijslider").length) {
                    self.pager.find(":wijmo-wijslider:eq(0)").wijslider("value", idx);
                } else if($.wijmo.wijpager && self.pager.is(":wijmo-wijpager")) {
                    self.pager.wijpager("option", "pageIndex", idx);
                } else if(self.pager.jquery) {
                    li = self.pager.find(">ul:eq(0)>li").eq(idx);
                    if(li.length) {
                        self._activePagerItem(li);
                    }
                }
            }
            data = {
                firstIndex: idx,
                lastIndex: lastIdx
            };
            self._trigger("afterScroll", null, data);
        };
        WijCarousel.prototype._getItemByIndex = function (idx) {
            var self = this, list = self.list, item, index = idx % self.count;
            if(!self.options.loop) {
                return list.children("li").eq(index);
            }
            list.children("li").each(function (i) {
                var li = $(this);
                if(li.data("itemIndex") === index) {
                    item = li;
                    return false;
                }
            });
            return item;
        };
        WijCarousel.prototype._collectionChanged = function (action) {
            var self = this;
            self.count = self.count + (action === "add" ? 1 : -1);
            self._applyListStyle();
            if(self.pager && self.pager.jquery) {
                self.pager.remove();
                self.pager = null;
                self._createPager();
            }
            self._applyBtnClass();
        };
        WijCarousel.prototype.add = function (ui, index) {
            /// <summary>
            /// Add a custom item with specified index.
            /// </summary>
                        var self = this, item, li;
            if(typeof ui === "string") {
                item = $(ui);
            } else if(ui.jquery) {
                item = ui;
            } else if($.isPlainObject(ui)) {
                item = self._generateMarkup(ui);
            } else {
                return;
            }
            if(!item.is("li")) {
                item = item.wrap("<li></li>").parent();
            }
            li = item;
            if(typeof index === "number" && index >= 0 && index < self.count) {
                li.insertBefore(self._getItemByIndex(index));
                self.list.children("li").each(function (i, data) {
                    var item = $(data);
                    if(item.data("itemIndex") >= index) {
                        item.data("itemIndex", item.data("itemIndex") + 1);
                    }
                });
            } else {
                if(index == 0) {
                    li.appendTo(self.list);
                }
                li.insertAfter(self._getItemByIndex(self.count - 1));
            }
            self._createItem(item, index !== undefined ? index : self.count);
            self._collectionChanged("add");
        };
        WijCarousel.prototype.remove = function (index) {
            /// <summary>
            /// Remove the item at specified index.
            /// </summary>
                        var self = this, item;
            if(typeof index === "number" && index >= 0 && index < self.count) {
                item = self._getItemByIndex(index);
                self.list.children("li").each(function (i, data) {
                    var li = $(data);
                    if(li.data("itemIndex") > index) {
                        li.data("itemIndex", li.data("itemIndex") - 1);
                    }
                });
            } else {
                item = self._getItemByIndex(self.count - 1);
            }
            if(item) {
                item.remove();
            }
            self._collectionChanged("remove");
        };
        return WijCarousel;
    })(wijmo.wijmoWidget);
    wijmo.WijCarousel = WijCarousel;    
    WijCarousel.prototype.options = $.extend(true, {
    }, wijmo.wijmoWidget.prototype.options, {
        wijMobileCSS: /// <summary>
        /// Mobile CSS.
        /// </summary>
        {
            header: "ui-header ui-bar-a",
            content: "ui-body-a",
            stateDefault: "ui-btn-up-a",
            stateHover: "ui-btn-down-a",
            stateActive: "ui-btn-down-b",
            iconPlay: "ui-icon-arrow-r",
            iconPause: "ui-icon-grid"
        },
        initSelector: /// <summary>
        /// Selector option for auto self initialization.
        ///	This option is internal.
        /// </summary>
        ":jqmData(role='wijcarousel')",
        data: /// <summary>
        /// An object collection that contains the data of the carousel.
        /// Default: [].
        /// Type: Array.
        /// Code example:
        /// $("#element").wijcarousel( { data: [{
        ///		imageUrl: "../thumb/image1.jpg",
        ///		linkUrl: "../images/image1.jpg",
        ///		content: "",
        ///		caption: "<span>Word Caption 1</span>"
        /// },{
        ///		imageUrl: "../thumb/image2.jpg",
        ///		linkUrl: "../images/image2.jpg",
        ///		content: "",
        ///		caption: "<span>Word Caption 2</span>"
        /// }] } );
        /// </summary>
        [],
        auto: /// <summary>
        /// Allows pictures to be played automatically.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijcarousel( { auto: true } );
        /// </summary>
        false,
        interval: /// <summary>
        /// Determines the time span between two pictures showing in autoplay mode.
        /// Default: 5000.
        /// Type: Number.
        /// Code example: $("#element").wijcarousel( { interval: 3000 } );
        /// </summary>
        5000,
        showTimer: /// <summary>
        /// Determines if the timer of the carousel should be shown.
        /// If true, the timer appears by default at the top of the carousel with a play/pause button allowing carousel items to be automatically cycled through at run time.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijcarousel( { showTimer: true } );
        /// </summary>
        false,
        buttonPosition: /// <summary>
        /// Determines the position value for next button and previous button.
        /// Possible values are: "inside" and "outside".
        /// Default: "inside".
        /// Type: String.
        /// Code example: $("#element").wijcarousel( { buttonPosition: "outside" } );
        /// </summary>
        "inside",
        showPager: /// <summary>
        /// Determines whether to show the pager element.
        /// By default, if showPager is set to true, the pager will appear at the bottom right of the widget and allows run time carousel item navigation.
        /// You can customize the location and appearance of the pager by using the pagerPosition and pagerType options.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijcarousel( { showPager: true } );
        /// </summary>
        false,
        prevBtnClass: /// <summary>
        /// Determines the class of custom previous button.
        /// Includes the following sub-options "defaultClass", "hoverClass", "disableClass".
        /// Default: null.
        /// Type: object.
        /// Code example: $("#element").wijcarousel( { prevBtnClass: {
        ///   defaultClass:"prev-button"
        /// }});
        /// </summary>
        {
            defaultClass: "",
            hoverClass: "",
            disableClass: ""
        },
        nextBtnClass: /// <summary>
        /// Determines the class of custom previous button.
        /// Includes the following sub-options "defaultClass", "hoverClass", "disableClass".
        /// Default: null.
        /// Type: object.
        /// Code example: $("#element").wijcarousel( { nextBtnClass: {
        ///   defaultClass:"next-button"
        /// }});
        /// </summary>
        {
            defaultClass: "",
            hoverClass: "",
            disableClass: ""
        },
        pagerType: /// <summary>
        /// Determines the type of the pager in the carousel.
        /// Possible values are: "slider", "numbers", "dots", "thumbnails".
        /// For a live example, see the Carousel Paging page in the Explore sample.
        /// Default:"numbers".
        /// Type: String.
        /// Code example: $("#element").wijcarousel( { pagerType: "numbers" } );
        /// </summary>
        "numbers",
        thumbnails: /// <summary>
        /// Determines the thumbnails list for a pager when pagerType is "thumbnails".
        /// Default: {
        ///		mouseover: null,
        ///		mouseout: null,
        ///		mousedown: null,
        ///		mouseup: null,
        ///		click: null,
        ///		imageWidth: 58,
        ///		imageHeight: 74,
        ///		images: []
        /// }.
        /// Type: Object.
        /// Code example: $("#element").wijcarousel( { thumbnails: [] } );
        /// </summary>
        {
            mouseover: null,
            mouseout: null,
            mousedown: null,
            mouseup: null,
            click: null,
            imageWidth: 58,
            imageHeight: 74,
            images: []
        },
        pagerPosition: /// <summary>
        /// A value that indicates the position settings for the pager.
        /// Default: {}.
        /// Type: Object.
        /// Code example: $("#element").wijcarousel( {
        ///		pagerType: {
        ///			my: 'left bottom',
        ///			at: 'right top',
        ///			offset: '0 0'}
        /// });
        /// </summary>
        {
        },
        orientation: /// <summary>
        /// Determines the orientation of the pager.
        /// Possible values are: "vertical" & "horizontal"
        /// Default: "horizontal".
        /// Type: String.
        /// Code example: $("#element").wijcarousel( { orientation: "vertical" } );
        /// </summary>
        "horizontal",
        sliderOrientation: /// <summary>
        /// Determines the orientation of the slider.
        /// Possible values are: "vertical" & "horizontal"
        /// Default: "horizontal".
        /// Type: String.
        /// Code example: $("#element").wijcarousel( { orientation: "vertical" } );
        /// </summary>
        "horizontal",
        loop: /// <summary>
        /// Allows the carousel to loop back to the beginning.
        /// Default: true.
        /// Type: Boolean.
        /// Code example: $("#element").wijcarousel( { loop: true } );
        /// </summary>
        true,
        animation: /// <summary>
        /// The animation option determines whether and how images are scroll in the carousel.
        /// It defines the animation effect and controls other aspects of the widget's animation, such as duration and easing.
        /// Set the disable attribute to true in order to disable the animation effect.
        /// For a live example, see the Carousel Animation page in the Explore sample.
        /// Type: Object.
        /// Default:
        /// Code example: $("#element").wijcarousel( {
        ///		animation {
        ///			queue: true,
        ///			disable: false,
        ///			duration: true,
        ///			easing: "easeOutCubic"
        ///		}
        /// } );
        /// </summary>
        {
            queue: /// <summary>
            /// This value determines whether to queue animation operations.
            /// Default: true.
            /// Type: Boolean.
            /// </summary>
            true,
            disable: /// <summary>
            /// A value that determines whether to show animation. Set this option to true in order to disable easing.
            /// Default: false.
            /// Type: Boolean.
            /// </summary>
            false,
            duration: /// <summary>
            /// The duration option defines the length of the scrolling animation effect in milliseconds.
            /// Default: 1000.
            /// Type: Number.
            /// </summary>
            1000,
            easing: /// <summary>
            /// Sets the type of animation easing effect that users experience when the wijcarousel is scrolled to another image. For example, the wijcarousel can bounce several times as it loads.
            /// Valid Values:
            /// easeInCubic ¨C Cubic easing in.Begins at zero velocity and then accelerates.
            /// easeOutCubic ¨C Cubic easing in and out.Begins at full velocity and then decelerates to zero.
            /// easeInOutCubic ¨C Begins at zero velocity, accelerates until halfway, and then decelerates to zero velocity again.
            /// easeInBack ¨C Begins slowly and then accelerates.
            /// easeOutBack ¨C Begins quickly and then decelerates.
            /// easeOutElastic ¨C Begins at full velocity and then decelerates to zero.
            /// easeOutBounce ¨C Begins quickly and then decelerates.The number of bounces is related to the duration, longer durations produce more bounces.
            /// Default: "linear".
            /// Type: string.
            /// </summary>
            "linear"
        },
        start: /// <summary>
        /// Determines the custom start position of the image list in wijcarousel.
        /// Default: 0.
        /// Type: Number.
        /// Code example: $("#element").wijcarousel( { start: 2 } );
        /// </summary>
        0,
        display: /// <summary>
        /// Determines how many images should be shown in the view area.
        /// Default: 1.
        /// Type: Number.
        /// Code example: $("#element").wijcarousel( { display: 2 } );
        /// </summary>
        1,
        preview: /// <summary>
        /// Determines if we should preview the last and next images.
        /// loop == false , orintation == "horizontal",display == 1.
        /// Default: 1.
        /// Type: Boolean.
        /// Code example: $("#element").wijcarousel( { preview: false } );
        /// </summary>
        false,
        step: /// <summary>
        /// Determines how many images will be scrolled
        /// when you click the Next/Previous button.
        /// Default: 1.
        /// Type: Number.
        /// Code example: $("#element").wijcarousel( { step: 2 } );
        /// </summary>
        1,
        showControls: /// <summary>
        /// Determines whether the custom control should be shown.
        /// Default: false.
        /// Type: Boolean.
        /// Code example: $("#element").wijcarousel( { showControls: true } );
        /// </summary>
        false,
        control: /// <summary>
        /// Determines the innerHtml of the custom control.
        /// Default: "".
        /// Type: String.
        /// Code example: $("#element").wijcarousel( { control: "<div>Blah</div>" } );
        /// </summary>
        "",
        controlPosition: /// <summary>
        /// A value that indicates the position settings for the custom control.
        /// Default: {}.
        /// Type: Object.
        /// Code example: $("#element").wijcarousel( {
        ///		pagerType: {
        ///			my: 'left bottom',
        ///			at: 'right top  ',
        ///			offset: '0 0'}
        /// });
        /// </summary>
        {
        },
        showCaption: /// <summary>
        /// Determines whether the caption of items should be shown.
        /// Default: true.
        /// Type: Boolean.
        /// Code example: $("#element").wijcarousel( { showCaption: true } );
        /// </summary>
        true,
        showControlsOnHover: /// <summary>
        /// Determines whether the controls should be shown after created
        /// or when hovering on the dom element.
        /// Default: true.
        /// Type: Boolean.
        /// Code example: $("#element").wijcarousel( { showControlsOnHover: true } );
        /// </summary>
        false,
        itemClick: /// <summary>
        /// This is the itemClick event handler.
        /// It is a function called when the image is clicked.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        /// $("#element").wijcarousel( { itemClick: function () {} } );
        /// Bind to the event by type: wijcarouselitemclick
        /// $("#element").bind("wijcarouselitemclick", function(e, data) { } );
        /// </summary>
        /// <param name="e" type="Object">
        /// This is the jQuery.Event object.
        /// </param>
        /// <param name="data" type="Object">
        /// Include informations that relates to this event.
        /// data.index : This is the index of the clicked image.
        ///	data.el : This is the dom element of this item.
        /// </param>
        null,
        beforeScroll: /// <summary>
        /// This is the beforeScroll event handler.
        /// It is a function called before scrolling to another image.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        /// $("#element").wijcarousel( { beforeScroll: function () {} } );
        /// Bind to the event by type: wijcarouselbeforescroll
        /// $("#element").bind("wijcarouselbeforescroll", function(e, data) { } );
        /// </summary>
        /// <param name="e" type="Object">
        /// This is the jQuery.Event object.
        /// </param>
        /// <param name="data" type="Object">
        /// Include informations that relates to this event.
        /// data.index : The index of the clicked image.
        ///	data.to : The index of the image that will scrolled to.
        /// </param>
        null,
        afterScroll: /// <summary>
        /// This is the afterScroll event handler.
        /// It is a function called after scrolling to another image.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        /// $("#element").wijcarousel( { afterScroll: function () {} } );
        /// Bind to the event by type: wijcarouselafterScroll
        /// $("#element").bind("wijcarouselafterScroll", function(e, data) { } );
        /// </summary>
        /// <param name="e" type="Object">
        /// This is the jQuery.Event object.
        /// </param>
        /// <param name="data" type="Object">
        /// Include informations that relates to this event.
        /// data.index : The index of the last image.
        ///	data.to : The index of the current image.
        /// </param>
        null,
        loadCallback: /// <summary>
        /// This is the loadCallback event handler.
        /// It is a function called after creating the dom element.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// Supply a function as an option.
        /// $("#element").wijcarousel( { loadCallback: function () {} } );
        /// Bind to the event by type: wijcarouselloadcallback
        /// $("#element").bind("wijcarouselloadcallback", function(e, data) { } );
        /// </summary>
        /// <param name="e" type="Object">
        /// This is the jQuery.Event object.
        /// </param>
        /// <param name="data" type="Object">
        /// The node widget that relates to this event.
        /// </param>
        null
    });
    $.wijmo.registerWidget("wijcarousel", WijCarousel.prototype);
})(wijmo || (wijmo = {}));
