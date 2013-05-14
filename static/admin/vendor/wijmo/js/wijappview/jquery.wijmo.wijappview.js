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
/*globals jQuery*/
/*
* Depends:
*  jquery.mobile.js
*
*/
var wijmo;
(function (wijmo) {
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
    var wijappview = (function (_super) {
        __extends(wijappview, _super);
        function wijappview() {
            _super.apply(this, arguments);

            this._updatingUrl = false;
        }
        wijappview.prototype._appViewCSS = // #region Initialization
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
        wijappview.prototype._initLinkHijacking = function () {
            var _this = this;
            this._linkList.find("li a").each(function () {
                var li = $(this).parents("li").first();
                var url = $(this).attr("href");
                url = $.mobile.path.makeUrlAbsolute(url, $.mobile.path.getLocation());
                li.jqmData("url", url);
            });
            var preventAndLoadContent = function (e, url) {
                e.preventDefault();
                e.stopPropagation();
                _this.changePage(url);
            };
            this._linkList.on("click", "li", function (e) {
                var url = $(e.currentTarget).jqmData("url");
                if(!url) {
                    return;
                }
                preventAndLoadContent(e, url);
            });
            this._pageContainer.bind("click", ".ui-listview, .ui-btn", function (e) {
                var link = _this._findClosestLink(e.target);
                if(!link || $(link).jqmData("appviewpage") === false) {
                    return;
                }
                var url = $(link).attr("href");
                if(url && url !== "#") {
                    preventAndLoadContent(e, url);
                }
            });
        };
        wijappview.prototype._initNavigation = function () {
            var _this = this;
            this._onPopStateScoped = this._onPopStateScoped || $.proxy(this._onPopState, this);
            $(window).bind("popstate", this._onPopStateScoped);
            $(window).bind("appviewpagehashchange", function () {
                return _this._navigateToCurrentLocation();
            });
            this._onNavigateScoped = this._onNavigateScoped || $.proxy(this._onNavigate, this);
            $($.mobile.pageContainer).bind("navigate", this._onNavigateScoped);
        };
        wijappview.prototype._create = function () {
            this._pageStore = [];
            this._documentUrl = this._removePageUrlParam(location.href);
            this.element.addClass(this._appViewCSS().outerDiv);
            this._initMenu();
            this._initPageContainer();
            this._initLinkHijacking();
            this._initNavigation();
            this._navigateToCurrentLocation();
        };
        wijappview.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            $(window).unbind("popstate", this._onPopStateScoped);
            $($.mobile.pageContainer).unbind("navigate", this._onNavigateScoped);
        };
        wijappview.prototype._initCurrentPage = // #endregion
        function () {
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
        wijappview.prototype.loadPage = function (url, options) {
            var _this = this;
            url = url || "";
            // This function uses deferred notifications to let callers
            // know when the page is done loading, or if an error has occurred.
                        var deferred = $.Deferred(), path = $.mobile.path, settings = // The default loadPage options with overrides specified by
            // the caller.
            $.extend({
            }, this.options.settings, options), isLocal = !url || url.charAt(0) === "#", page = // The DOM element for the page after it has been loaded.
            null, dupCachedPage = // If the reloadPage option is true, and the page is already
            // in the DOM, dupCachedPage will be set to the page element
            // so that it can be removed after the new version of the
            // page is loaded off the network.
            null, absUrl = this._makeAbsoluteUrl(url);
            // ==== Disable caching for now ====
            // Check to see if the page already exists in the DOM.
            // NOTE do _not_ use the :jqmData psuedo selector because parenthesis
            //      are a valid url char and it breaks on the first occurence
            // page = $($.grep(this._pageStore, (p) => p.jqmData("url") === absUrl)[0]).clone();
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
                    var allPages = all.findRole(roles.page);
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
        wijappview.prototype.activePage = function () {
            return this._pageContainer.children("." + this._appViewCSS().pageActive).first();
        };
        wijappview.prototype.isMenuUrl = function (dataUrl) {
            return this._linkList.find("li").is(function () {
                return $(this).jqmData("url") === dataUrl;
            });
        };
        wijappview.prototype.showLoading = function () {
            $.mobile.loading("show");
        };
        wijappview.prototype.hideLoading = function () {
            $.mobile.loading("hide");
        };
        wijappview.prototype.changePage = function (toPage, options) {
            var _this = this;
            options = $.extend({
                updateUrl: true
            }, options);
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
            if(typeof toPage === "string") {
                var currentDataUrl = this.activePage().data("url");
                this._updateUI(this._makeAbsoluteUrl(toPage));
                this.showLoading();
                this._curRequest = this.loadPage(toPage, options).always(function () {
                    _this.hideLoading();
                    _this._curRequest = null;
                }).done(function (url, options, page, dupCachedPage) {
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
            if(options.updateUrl || forceUpdateUrl) {
                this._updateUrl(absUrl, relUrl, document.title);
                forceUpdateUrl = false;
            }
            toPage.jqmData("page", $.mobile.activePage.jqmData("page")).trigger("pagecreate").trigger(this.widgetEventPrefix + "pageinit", triggerData);
            // TODO: temporary workaround
            this._trigger("pagechange", null, triggerData);
        };
        wijappview.prototype._updateUI = function (dataUrl) {
            var isRoot = dataUrl === this._documentUrl, css = this._appViewCSS();
            this.element.toggleClass(css.inPage, !isRoot);
            var menuItems = this._linkList.find("li"), activeClass = this._appViewCSS().menuItemActive;
            if(isRoot) {
                menuItems.removeClass(activeClass);
            } else {
                var newMenuItem = menuItems.filter(function () {
                    return $(this).data("url") === dataUrl;
                });
                if(newMenuItem.length && !newMenuItem.hasClass(activeClass)) {
                    menuItems.removeClass(activeClass);
                    newMenuItem.addClass(activeClass);
                }
            }
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
    wijmo.wijappview = wijappview;    
    var mainClass = "wijmo-wijappview", classPrefix = mainClass + "-";
    wijappview.prototype.options = $.extend({
    }, wijmo.wijmoWidget.prototype.options, {
        urlParamName: "appviewpage",
        loadSettings: {
            type: "GET",
            data: undefined,
            reloadPage: false,
            showLoadMsg: false,
            loadMsgDelay: 50
        },
        wijCSS: // This delay allows loads that pull from browser cache to occur without showing the loading message.
        {
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
        }
    });
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
})(wijmo || (wijmo = {}));
