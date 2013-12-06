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
    /*globals jQuery*/
    /*
    * Depends:
    *  jquery.mobile.js
    *
    */
    (function (appview) {
        "use strict";
        var $ = jQuery, widgetName = "wijappview", roles = {
            menu: "menu",
            content: "content",
            header: "header",
            footer: "footer",
            page: "appviewpage"
        }, dataAttributes = {
            adjusted: widgetName + "-adjusted"
        }, initialHash = "", forceUpdateUrl = false;
        $.fn.findRole = function (role) {
            return this.find(":jqmData(role='" + role + "')");
        };
        /** @widget */
        var wijappview = (function (_super) {
            __extends(wijappview, _super);
            function wijappview() {
                _super.apply(this, arguments);

                this._updatingUrl = false;
            }
            wijappview.prototype._appViewCSS = //#region Initialization
            function () {
                return this.options.wijCSS.wijappview;
            };
            wijappview.prototype._initMenu = function () {
                this._menuDiv = this.element.findRole(roles.menu);
                if(!this._menuDiv.length) {
                    throw "A DIV with data-role='" + roles.menu + "' not found!";
                }
                this._linkList = this._menuDiv.find("ul");
                if(!this._linkList.length) {
                    throw "Invalid markup. Link list not found";
                }
                this._menuDiv.addClass(this._appViewCSS().menu);
            };
            wijappview.prototype._initPages = function ($pages, fileUrl) {
                var pageStore = this._pageStore, css = this._appViewCSS();
                $pages.each(function () {
                    var page = $(this).addClass(css.page), id = page.attr("id"), dataUrl = fileUrl;
                    if(page.jqmData("url")) {
                        return;
                    }
                    if(id) {
                        dataUrl += "#" + id;
                    }
                    page.attr("data-url", dataUrl);
                });
            };
            wijappview.prototype._initPageContainer = function () {
                var css = this._appViewCSS(), pageStore = this._pageStore;
                this._pageContainer = $("<div/>").addClass(css.pageContainer).prependTo(this.element);
                var pages = this.element.findRole(roles.page);
                this._initPages(pages, this._documentUrl);
                pages.each(function (index) {
                    pageStore.push($(this).clone());
                    if(index > 0) {
                        $(this).remove();
                    }
                });
                this._firstPage = pages.first().addClass(css.pageActive).appendTo(this._pageContainer);
                this._initCurrentPage();
            };
            wijappview.prototype._getUrl = function (elem) {
                var urlAttrName = elem.is("form") ? "action" : "href", url = elem.attr(urlAttrName);
                if(!url || url === "#") {
                    return null;
                }
                if($.mobile.path.isRelativeUrl(url)) {
                    elem.parents(":jqmData(url)").each(function (_, parent) {
                        var parentUrl = $(parent).jqmData("url");
                        if(parentUrl && $.mobile.path.isAbsoluteUrl(parentUrl)) {
                            url = $.mobile.path.makeUrlAbsolute(url, parentUrl);
                            return false;
                        }
                    });
                }
                return url;
            };
            wijappview.prototype._hijackLinks = function (root) {
                var _this = this;
                root.on("click." + widgetName, "a, .ui-btn", function (e) {
                    if(e.isDefaultPrevented()) {
                        return;
                    }
                    var link = _this._findClosestLink(e.target);
                    if(!link || $(link).jqmData("appviewpage") === false) {
                        return;
                    }
                    var url = _this._getUrl($(link));
                    if(url) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.changePage(url);
                    }
                });
            };
            wijappview.prototype._hijackForms = function (root) {
                var _this = this;
                root.on("submit." + widgetName, "form", function (e) {
                    if(e.isDefaultPrevented()) {
                        return;
                    }
                    var $form = $(e.currentTarget), $page = $form.closest("." + _this._appViewCSS().page);
                    if(!$.mobile.ajaxEnabled || // test that the form is, itself, ajax false
                    $form.is(":jqmData(ajax='false')") || // test that $.mobile.ignoreContentEnabled is set and
                    // the form or one of it's parents is ajax=false
                    !$form.jqmHijackable().length) {
                        return;
                    }
                    var type = $form.attr("method"), target = $form.attr("target"), url = _this._getUrl($form);
                    e.preventDefault();
                    e.stopPropagation();
                    _this.changePage(url, {
                        type: type && type.length && type.toLowerCase() || "get",
                        data: $form.serialize(),
                        reloadPage: true
                    });
                });
            };
            wijappview.prototype._initNavigation = function () {
                var _this = this;
                this._onPopStateScoped = this._onPopStateScoped || $.proxy(this._onPopState, this);
                $(window).bind("popstate." + widgetName, this._onPopStateScoped);
                $(window).bind("appviewpagehashchange." + widgetName, function () {
                    return _this._navigateToCurrentLocation();
                });
                this._onNavigateScoped = this._onNavigateScoped || $.proxy(this._onNavigate, this);
                $($.mobile.pageContainer).bind("navigate." + widgetName, this._onNavigateScoped);
            };
            wijappview.prototype._create = function () {
                this._pageStore = [];
                this._documentUrl = this._removePageUrlParam(location.href);
                this.element.attr("data-url", this._documentUrl);
                this._jqmPageEnclosingWidget = this._findJqmPage();
                this.element.addClass(this._appViewCSS().outerDiv);
                this._initMenu();
                this._initPageContainer();
                this._hijackLinks(this.element);
                this._hijackForms(this.element);
                this._initNavigation();
                this._navigateToCurrentLocation();
            };
            wijappview.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
                var dotNs = "." + widgetName;
                this.element.unbind(dotNs);
                $(window).unbind(dotNs);
                $($.mobile.pageContainer).unbind(dotNs);
            };
            wijappview.prototype._findJqmPage = //#endregion
            function () {
                for(var elem = this.element; elem.length; elem = elem.parent()) {
                    var page = elem.jqmData("mobile-page");
                    if(page) {
                        return page;
                    }
                }
                return null;
            };
            wijappview.prototype._initCurrentPage = function () {
                var css = this._appViewCSS();
                var page = this.activePage();
                page.findRole(roles.content).addClass(css.content);
                var header = page.findRole(roles.header).addClass(css.header);
                var position = header.jqmData("position");
                var headerFixed = !position || position === "fixed";
                if(headerFixed) {
                    header.addClass("ui-header-fixed");
                }
                this.element.toggleClass(css.withFixedHeader, headerFixed);
            };
            wijappview.prototype._findClosestLink = function (ele) {
                while(ele && !(typeof ele.nodeName === "string" && ele.nodeName.toLowerCase() === "a")) {
                    ele = ele.parentNode;
                }
                return ele;
            };
            wijappview.prototype._clickHandler = function (e) {
                var target = $(e.currentTarget), url = target.is("li") ? target.jqmData("url") : target.is("a") ? target.attr("href") : null;
                if(!url) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                this.changePage(url);
            };
            wijappview.prototype._inheritAttribute = function (src, dest, attrName) {
                if(src.attr(attrName) && !dest.attr(attrName)) {
                    dest.attr(attrName, src.attr(attrName));
                }
            };
            wijappview.prototype._findInCache = function (url) {
                return $($.grep(this._pageStore, function (p) {
                    return p.jqmData("url") === url;
                })[0]).clone();
            };
            wijappview.prototype.loadPage = /** Load an appview page
            * @param {String} url URL of the page to load
            * @param options Load settings to override options.loadSettings
            */
            function (url, options) {
                var _this = this;
                url = url || "";
                // This function uses deferred notifications to let callers
                // know when the page is done loading, or if an error has occurred.
                                var deferred = $.Deferred(), path = $.mobile.path, settings = $.extend({
                }, this.options.loadSettings, options), isLocal = !url || url.charAt(0) === "#", page = // The DOM element for the page after it has been loaded.
                null, dupCachedPage = // If the reloadPage option is true, and the page is already
                // in the DOM, dupCachedPage will be set to the page element
                // so that it can be removed after the new version of the
                // page is loaded off the network.
                null, absUrl = this._makeAbsoluteUrl(url);
                // ==== Disable caching for now ====
                // Check to see if the page already exists in the DOM.
                // NOTE do _not_ use the :jqmData psuedo selector because parenthesis
                //      are a valid url char and it breaks on the first occurence
                // page = this._findInCache(absUrl);
                // If the page we are interested in is already in the DOM,
                // and the caller did not indicate that we should force a
                // reload of the file, we are done. Otherwise, track the
                // existing page as a duplicated.
                //if (page.length) {
                //    if (isLocal || !settings.reloadPage) {
                //	    // enhancePage(page, settings.role);
                //	    deferred.resolve(absUrl, options, page);
                //	    return deferred.promise();
                //    }
                //    dupCachedPage = page;
                //}
                if(settings.data) {
                    switch(settings.type) {
                        case "get":
                            absUrl = path.addSearchParams(absUrl, settings.data);
                            settings.data = undefined;
                            break;
                        case "post":
                            settings.reloadPage = true;
                            break;
                    }
                }
                var pblEvent = $.Event("pagebeforeload"), triggerData = {
                    url: url,
                    absUrl: absUrl,
                    dataUrl: absUrl,
                    deferred: deferred,
                    options: settings
                };
                // Let listeners know we're about to load a page.
                this._trigger(pblEvent.type, pblEvent, triggerData);
                // If the default behavior is prevented, stop here!
                if(pblEvent.isDefaultPrevented()) {
                    return deferred.promise();
                }
                if(!$.mobile.allowCrossDomainPages && !path.isSameDomain(path.parseLocation(), absUrl)) {
                    deferred.reject(absUrl, options);
                    return deferred.promise();
                }
                // The absolute version of the URL minus any dialog/subpage params.
                // In otherwords the real URL of the page to be loaded.
                var fileUrl = absUrl && path.getFilePath(absUrl).replace(/#.+/, "");
                // Load the new page.
                var xhr = $.ajax({
                    url: fileUrl,
                    type: settings.type,
                    data: settings.data,
                    dataType: "html",
                    success: function (html, textStatus, xhr) {
                        //pre-parse html to check for a data-url,
                        //use it as the new fileUrl, base path, etc
                                                var all = $("<div></div>"), pageElemRegex = // TODO handle dialogs again
                        new RegExp("(<[^>]+\\bdata-" + $.mobile.ns + "role=[\"']?" + roles.page + "[\"']?[^>]*>)"), dataUrlRegex = new RegExp("\\bdata-" + $.mobile.ns + "url=[\"']?([^\"'>]*)[\"']?");
                        function tryMakeAbsolute(url) {
                            if(path.isAbsoluteUrl(url) || /^(\w+:|#|\/)/.test(url)) {
                                return null;
                            }
                            return path.makeUrlAbsolute(url, fileUrl);
                        }
                        if($.browser.msie && parseFloat($.browser.version) <= 7) {
                            // for some reason IE7 automatically makes all links absolute before I do it.
                            // I have to use regex in this case
                            html = html.replace(/<a[^>]+href=['"][^'"]+['"]/g, function (link) {
                                return link.replace(/href=['"]([^'"]+)['"]/, function (m, url) {
                                    url = tryMakeAbsolute(url) || url;
                                    return "href='" + url + "'";
                                });
                            });
                        }
                        //workaround to allow scripts to execute when included in page divs
                        all.get(0).innerHTML = html;
                        var allPages = _this._getAllPages(all, url);
                        //if page elem couldn't be found, create one and insert the body element's contents
                        if(!allPages.length) {
                            allPages = $("<div/>").attr("data-role", roles.page).html(html.split(/<\/?body[^>]*>/gmi)[1]);
                        }
                        var pageTitleFromHead = html.match(/<title[^>]*>([^<]*)/) && RegExp["$1"];
                        if(pageTitleFromHead && ~pageTitleFromHead.indexOf("&")) {
                            pageTitleFromHead = $("<div>" + pageTitleFromHead + "</div>").text();
                        }
                        // fix data-title
                        allPages.each(function (i, page) {
                            page = $(page);
                            page.attr("data-external-page", true);
                            // fix data-title
                            if(!page.jqmData("title") && pageTitleFromHead) {
                                page.attr("data-title", pageTitleFromHead);
                            }
                            //rewrite src and href attrs to use a base url
                            var newPath = path.get(fileUrl);
                            page.find("[src], [href]").each(function () {
                                var thisAttr = $(this).is('[href]') ? 'href' : $(this).is('[src]') ? 'src' : 'action', url = tryMakeAbsolute($(this).attr(thisAttr));
                                if(url) {
                                    $(this).attr(thisAttr, url);
                                }
                            });
                        });
                        _this._initPages(allPages, fileUrl);
                        // Let listeners know the page loaded successfully.
                        // Add the page reference and xhr to our triggerData.
                        page = allPages.filter(function () {
                            return $(this).jqmData("url") === absUrl;
                        });
                        if(!page.length) {
                            page = allPages.first();
                        }
                        triggerData.xhr = xhr;
                        triggerData.textStatus = textStatus;
                        triggerData.page = page;
                        triggerData.allPages = allPages;
                        _this._trigger("pageload", null, triggerData);
                        allPages.each(function (i, p) {
                            _this._pageStore.push($(p).clone());
                        });
                        deferred.resolve(absUrl, options, page, dupCachedPage);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        // Add error info to our triggerData.
                        triggerData.xhr = xhr;
                        triggerData.textStatus = textStatus;
                        triggerData.errorThrown = errorThrown;
                        var plfEvent = $.Event("pageloadfailed");
                        // Let listeners know the page load failed.
                        _this._trigger(plfEvent.type, plfEvent, triggerData);
                        // If the default behavior is prevented, stop here!
                        // Note that it is the responsibility of the listener/handler
                        // that called preventDefault(), to resolve/reject the
                        // deferred object within the triggerData.
                        if(plfEvent.isDefaultPrevented()) {
                            return;
                        }
                        // Remove loading message.
                        //if (settings.showLoadMsg) {
                        // Remove loading message.
                        // hideMsg();
                        // show error message
                        // $.mobile.showPageLoadingMsg($.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true);
                        // hide after delay
                        // setTimeout($.mobile.hidePageLoadingMsg, 1500);
                        //}
                        deferred.reject(absUrl, options);
                    }
                });
                deferred.fail(function () {
                    xhr.abort();
                });
                return deferred;
            };
            wijappview.prototype._getAllPages = function (html, url) {
                return html.findRole(roles.page);
            };
            wijappview.prototype.activePage = /** Current active appview page DOM element */
            function () {
                return this._pageContainer.children("." + this._appViewCSS().pageActive).first();
            };
            wijappview.prototype.isMenuUrl = /** @ignore */
            function (url) {
                var that = this;
                url = url.toLowerCase();
                return this._menuDiv.find("a").is(function () {
                    var getUrl = that._getUrl($(this));
                    if(!getUrl) {
                        return false;
                    }
                    return getUrl.toLowerCase() === url;
                });
            };
            wijappview.prototype._showLoading = function () {
                $.mobile.loading("show");
            };
            wijappview.prototype._hideLoading = function () {
                $.mobile.loading("hide");
            };
            wijappview.prototype.changePage = /** Change current appview page
            * @param toPage A URL or an appview page DOM element to switch to
            * @param options Load settings to be used if 'toPage' is a URL
            * @remarks
            * If 'toPage' is a URL, then changePage() loads the page first and calls itself recursively
            */
            function (toPage, options) {
                var _this = this;
                options = $.extend({
                    updateUrl: true
                }, this.options.loadSettings, options);
                var triggerData = {
                    toPage: toPage,
                    options: options
                };
                if(this._curRequest && this._curRequest.state() === "pending" && this._curRequest.rejectWith) {
                    this._curRequest.rejectWith(this, [
                        toPage, 
                        options, 
                        true
                    ]);
                }
                var currentDataUrl;
                var toPageAbs;
                if(typeof toPage === "string") {
                    currentDataUrl = this.activePage().data("url");
                    toPageAbs = this._makeAbsoluteUrl(toPage);
                    var hashPos = toPageAbs.indexOf("#");
                    if(hashPos >= 0 && toPageAbs.substr(0, hashPos) === currentDataUrl.split("#")[0]) {
                        var fromCache = this._findInCache(toPageAbs);
                        if(fromCache.length) {
                            toPage = fromCache;
                        }
                    }
                }
                if(typeof toPage === "string") {
                    this._updateUIBeforeChange(toPageAbs);
                    if(options.showLoadMsg) {
                        this._showLoading();
                    }
                    this._curRequest = this.loadPage(toPage, options).always(function () {
                        if(options.showLoadMsg) {
                            _this._hideLoading();
                        }
                        _this._curRequest = null;
                    }).done(function (url, options, page, dupCachedPage) {
                        _this._updateUIAfterChange(page.jqmData("url"));
                        _this.changePage(page, options);
                    }).fail(function (url, options, anotherPage) {
                        if(!anotherPage) {
                            _this._updateUI(currentDataUrl);
                        }
                        _this._trigger("pagechangefailed", null, triggerData);
                    });
                    return;
                }
                var pbcEvent = $.Event("pagebeforechange");
                this._trigger(pbcEvent.type, pbcEvent, triggerData);
                if(pbcEvent.isDefaultPrevented()) {
                    return;
                }
                var absUrl = toPage.jqmData("url"), relUrl = null;
                this._updateUI(absUrl);
                if(absUrl) {
                    relUrl = this._makeRelative(absUrl);
                    if(relUrl != null) {
                        relUrl = this._makeRelative(relUrl);
                    }
                }
                var pageTitle = toPage.jqmData("title"), header = toPage.findRole("header"), css = this._appViewCSS();
                if(!header.length && pageTitle) {
                    header = $("<div data-role='header'/>").append($("<h2/>").text(pageTitle)).prependTo(toPage);
                }
                if(header.length && !header.jqmData(dataAttributes.adjusted)) {
                    header.jqmData(dataAttributes.adjusted, true);
                    var oldHeader = this._firstPage.findRole(roles.header);
                    if(oldHeader) {
                        this._inheritAttribute(oldHeader, header, "data-position");
                    }
                    if(this.isMenuUrl(absUrl) && !header.find("a[data-icon=back]").length) {
                        $("<a/>").attr({
                            href: this._documentUrl,
                            "data-icon": "back"
                        }).text("Back").prependTo(header);
                    }
                }
                if(pageTitle) {
                    document.title = pageTitle;
                }
                this._pageContainer.children().removeClass(css.pageActive);
                toPage.addClass(css.pageActive).appendTo(this._pageContainer.empty());
                this._initCurrentPage();
                if((options).updateUrl || forceUpdateUrl) {
                    this._updateUrl(absUrl, relUrl, document.title);
                    forceUpdateUrl = false;
                }
                toPage.jqmData("page", this._jqmPageEnclosingWidget).trigger("pagecreate").trigger(this.widgetEventPrefix + "pageinit", triggerData);
                // TODO: temporary workaround
                this._trigger("pagechange", null, triggerData);
            };
            wijappview.prototype._updateUIBeforeChange = function (pageUrl) {
                var that = this, isRoot = pageUrl === this._documentUrl;
                var menuItems = this._linkList.find("li"), activeClass = this._appViewCSS().menuItemActive;
                if(isRoot) {
                    menuItems.removeClass(activeClass);
                } else {
                    var newMenuItem = menuItems.filter(function () {
                        var url = that._getUrl($(this).find("a"));
                        return url && url.toLowerCase() === pageUrl.toLowerCase();
                    });
                    if(newMenuItem.length && !newMenuItem.hasClass(activeClass)) {
                        menuItems.removeClass(activeClass);
                        newMenuItem.addClass(activeClass);
                    }
                }
            };
            wijappview.prototype._updateUIAfterChange = function (pageUrl) {
                var css = this._appViewCSS(), isRoot = pageUrl === this._documentUrl;
                this.element.toggleClass(css.inPage, !isRoot);
            };
            wijappview.prototype._updateUI = function (pageUrl) {
                this._updateUIBeforeChange(pageUrl);
                this._updateUIAfterChange(pageUrl);
            };
            wijappview.prototype._changePageIfDifferent = function (toPage, options) {
                var targetUrl = typeof toPage === "string" ? toPage : toPage.jqmData("url");
                if(this.activePage().jqmData("url") !== targetUrl) {
                    this.changePage(toPage, options);
                }
            };
            wijappview.prototype._onNavigate = function (e) {
                var hashRgx = new RegExp("^#?" + this.options.urlParamName + "=");
                if(history.state && history.state.wijappview || document.location.hash.match(hashRgx)) {
                    e.preventDefault();
                }
            };
            wijappview.prototype._removePageUrlParam = function (url) {
                return url.replace(/\#.*$/, "");
            };
            wijappview.prototype._addUrl = function (pageUrl) {
                var param = this.options.urlParamName;
                var url = this._removePageUrlParam(location.href);
                if(pageUrl) {
                    url += "#" + param + "=" + pageUrl;
                }
                return url;
            };
            wijappview.prototype._makeRelative = function (absUrl) {
                var loc = $.mobile.path.parseLocation();
                var url = absUrl;
                if(absUrl) {
                    var baseDir = loc.domain + loc.directory;
                    if(absUrl.substr(0, loc.hrefNoHash.length) === loc.hrefNoHash) {
                        url = absUrl.substr(loc.hrefNoHash.length);
                    } else if(absUrl.substr(0, baseDir.length) === baseDir) {
                        url = absUrl.substr(baseDir.length);
                    }
                }
                return url;
            };
            wijappview.prototype._makeAbsoluteUrl = function (url) {
                var path = $.mobile.path, activePage = this.activePage(), curAbsUrl = path.makeUrlAbsolute(activePage.jqmData("url") || this._documentUrl, this._documentUrl);
                if(!curAbsUrl.match(/\/$/) && !curAbsUrl.match(/\./)) {
                    curAbsUrl += "/";
                }
                return url && path.makeUrlAbsolute(url, curAbsUrl);
            };
            wijappview.prototype._onPopState = function (e) {
                if(this._updatingUrl) {
                    return;
                }
                if(history.state && history.state.wijappview) {
                    this._changePageIfDifferent(history.state.absUrl || this._firstPage, {
                        updateUrl: false
                    });
                } else {
                    this._navigateToCurrentLocation();
                }
            };
            wijappview.prototype._navigateToCurrentLocation = function () {
                var rgx = new RegExp("#" + this.options.urlParamName + "=(.+)"), match = rgx.exec(location.href) || initialHash && rgx.exec(initialHash), toPage = match ? $.mobile.path.makeUrlAbsolute(match[1], this._documentUrl) : this._firstPage;
                initialHash = "";
                this._changePageIfDifferent(toPage, {
                    updateUrl: false
                });
            };
            wijappview.prototype._updateUrl = function (absUrl, relUrl, title) {
                this._updatingUrl = true;
                try  {
                    $.mobile.urlHistory.ignoreNextHashChange = true;
                    document.location.hash = absUrl === this._documentUrl ? "" : this.options.urlParamName + "=" + relUrl;
                }finally {
                    this._updatingUrl = false;
                }
            };
            return wijappview;
        })(wijmo.wijmoWidget);
        appview.wijappview = wijappview;        
        var mainClass = "wijmo-wijappview", classPrefix = mainClass + "-";
        var wijappview_options = (function () {
            function wijappview_options() {
                /** Name of a parameter in a URL that specifies current appview page address */
                this.urlParamName = "appviewpage";
                /** Settings used to load appview pages */
                this.loadSettings = {
                    type: "GET",
                    data: undefined,
                    reloadPage: false,
                    showLoadMsg: false
                };
                this.wijCSS = {
                    wijappview: {
                        outerDiv: mainClass,
                        inPage: classPrefix + "in-page",
                        menu: classPrefix + "menu",
                        menuItemActive: "ui-btn-down-b",
                        page: classPrefix + "page",
                        pageActive: classPrefix + "page-active",
                        pageContainer: classPrefix + "page-container",
                        content: classPrefix + "content",
                        header: classPrefix + "header",
                        withFixedHeader: classPrefix + "with-fixed-header"
                    }
                };
            }
            return wijappview_options;
        })();
        appview.wijappview_options = wijappview_options;        
        wijappview.prototype.options = $.extend({
        }, wijmo.wijmoWidget.prototype.options, new wijappview_options());
        function isAppViewPageUrl() {
            return document.location.hash.match(/^#\w+=/);
        }
        if($.mobile) {
            $.wijmo.registerWidget(widgetName, wijappview.prototype);
            $(window).bind("hashchange", function (e) {
                if(isAppViewPageUrl()) {
                    e.stopImmediatePropagation();
                    $(window).trigger("appviewpagehashchange");
                }
            });
            // prevent initial jQM page transition
            if(isAppViewPageUrl()) {
                initialHash = document.location.hash;
                $(window).bind("pagecontainercreate", function () {
                    document.location.hash = "";
                    forceUpdateUrl = true;
                });
            }
        }
    })(wijmo.appview || (wijmo.appview = {}));
    var appview = wijmo.appview;
})(wijmo || (wijmo = {}));
