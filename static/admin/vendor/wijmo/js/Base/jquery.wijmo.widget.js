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
/// <reference path="../wijutil/jquery.wijmo.wijutil.ts"/>
/// <reference path="../wijutil/jquery.wijmo.wijtouchutil.ts"/>
/// <reference path="../External/declarations/jquery.d.ts"/>
/// <reference path="../External/declarations/jquery.ui.d.ts"/>
/// <reference path="../External/declarations/jquerymobile.d.ts"/>
/// <reference path="wijmo.d.ts"/>
/*
* Depends:
*  jquery.ui.widget.js
*
*/
var wijmo;
(function (wijmo) {
    var $ = jQuery;
    var jQueryWijmo = (function () {
        function jQueryWijmo() { }
        jQueryWijmo.autoMobilize = true;
        jQueryWijmo.wijCSS = {
            widget: "ui-widget",
            overlay: "ui-widget-overlay",
            content: "ui-widget-content",
            header: "ui-widget-header",
            stateDisabled: "ui-state-disabled",
            stateFocus: "ui-state-focus",
            stateActive: "ui-state-active",
            stateDefault: "ui-state-default",
            stateHighlight: "ui-state-highlight",
            stateHover: "ui-state-hover",
            stateChecked: "ui-state-checked",
            stateError: "ui-state-error",
            getState: function (name) {
                name = name.charAt(0).toUpperCase() + name.substr(1);
                return $.wijmo.wijCSS["state" + name];
            },
            icon: "ui-icon",
            iconCheck: "ui-icon-check",
            iconRadioOn: "ui-icon-radio-on",
            iconRadioOff: "ui-icon-radio-off",
            iconClose: "ui-icon-close",
            iconArrow4Diag: "ui-icon-arrow-4-diag",
            iconNewWin: "ui-icon-newwin",
            iconVGripSolid: "ui-icon-grip-solid-vertical",
            iconHGripSolid: "ui-icon-grip-solid-horizontal",
            iconPlay: "ui-icon-play",
            iconPause: "ui-icon-pause",
            iconStop: "ui-icon-stop",
            iconArrowUp: "ui-icon-triangle-1-n",
            iconArrowRight: "ui-icon-triangle-1-e",
            iconArrowDown: "ui-icon-triangle-1-s",
            iconArrowLeft: "ui-icon-triangle-1-w",
            iconArrowRightDown: "ui-icon-triangle-1-se",
            iconArrowThickDown: "ui-icon-arrowthick-1-s glyphicon glyphicon-arrow-down",
            iconArrowThickUp: "ui-icon-arrowthick-1-n glyphicon glyphicon-arrow-up",
            iconCaratUp: "ui-icon-carat-1-n",
            iconCaratRight: "ui-icon-carat-1-e",
            iconCaratDown: "ui-icon-carat-1-s",
            iconCaratLeft: "ui-icon-carat-1-w",
            iconClock: "ui-icon-clock glyphicon glyphicon-time",
            iconPencil: "ui-icon-pencil glyphicon glyphicon-pencil",
            iconSeekFirst: "ui-icon-seek-first",
            iconSeekEnd: "ui-icon-seek-end",
            iconSeekNext: "ui-icon-seek-next",
            iconSeekPrev: "ui-icon-seek-prev",
            iconPrint: "ui-icon-print",
            iconDisk: "ui-icon-disk",
            iconSeekStart: "ui-icon-seek-start",
            iconFullScreen: "ui-icon-newwin",
            iconContinousView: "ui-icon-carat-2-n-s",
            iconZoomIn: "ui-icon-zoomin",
            iconZoomOut: "ui-icon-zoomout",
            iconBookmark: "ui-icon-bookmark",
            iconSearch: "ui-icon-search",
            iconImage: "ui-icon-image",
            inputSpinnerLeft: "ui-input-spinner-left",
            inputSpinnerRight: "ui-input-spinner-right",
            inputTriggerLeft: "ui-input-trigger-left",
            inputTriggerRight: "ui-input-trigger-right",
            inputSpinnerTriggerLeft: "ui-input-spinner-trigger-left",
            inputSpinnerTriggerRight: "ui-input-spinner-trigger-right",
            cornerAll: "ui-corner-all",
            cornerLeft: "ui-corner-left",
            cornerRight: "ui-corner-right",
            cornerBottom: "ui-corner-bottom",
            cornerBL: "ui-corner-bl",
            cornerBR: "ui-corner-br",
            cornerTop: "ui-corner-top",
            cornerTL: "ui-corner-tl",
            cornerTR: "ui-corner-tr",
            helperClearFix: "ui-helper-clearfix",
            helperReset: "ui-helper-reset",
            helperHidden: "ui-helper-hidden",
            priorityPrimary: "ui-priority-primary",
            prioritySecondary: "ui-priority-secondary",
            button: "ui-button",
            buttonText: "ui-button-text",
            buttonTextOnly: "ui-button-text-only",
            tabs: "ui-tabs",
            tabsTop: "ui-tabs-top",
            tabsBottom: "ui-tabs-bottom",
            tabsLeft: "ui-tabs-left",
            tabsRight: "ui-tabs-right",
            tabsLoading: "ui-tabs-loading",
            tabsActive: "ui-tabs-active",
            tabsPanel: "ui-tabs-panel",
            tabsNav: "ui-tabs-nav",
            tabsHide: "ui-tabs-hide",
            tabsCollapsible: "ui-tabs-collapsible",
            activeMenuitem: "ui-active-menuitem"
        };
        jQueryWijmo.wijMobileCSS = {
            content: "ui-content",
            header: "ui-header",
            overlay: "ui-overlay",
            stateDisabled: "ui-disabled",
            stateFocus: "ui-focus",
            stateActive: "ui-btn-active",
            stateDefault: "ui-btn-up-a",
            iconArrowUp: "ui-icon-arrow-u",
            iconArrowRight: "ui-icon-arrow-r",
            iconArrowDown: "ui-icon-arrow-d",
            iconArrowLeft: "ui-icon-arrow-l",
            iconArrowRightDown: "ui-icon-arrow-d",
            iconSeekFirst: "ui-icon-arrow-l",
            iconSeekEnd: "ui-icon-arrow-r",
            iconSeekNext: "ui-icon-arrow-r",
            iconSeekPrev: "ui-icon-arrow-l",
            iconClose: "ui-icon-delete",
            iconStop: "ui-icon-grid",
            iconCheck: "ui-icon-checkbox-on"
        };
        jQueryWijmo.wijMobileThemePrefix = [
            "ui-bar", 
            "ui-body", 
            "ui-overlay", 
            "ui-btn-up", 
            "ui-btn-hover", 
            "ui-btn-down"
        ];
        jQueryWijmo.autoInit = // auto self-init widgets
        function autoInit(widgetName, pageKeepNative) {
            if($.mobile && $.mobile.page && pageKeepNative) {
                //add keepNative to page to prevent default auto-initialization of form elements
                var keepNative = $.mobile.page.prototype.options.keepNative;
                if(keepNative && keepNative.length && keepNative.indexOf(pageKeepNative) === -1) {
                    keepNative = [
                        keepNative, 
                        pageKeepNative
                    ].join(", ");
                } else {
                    keepNative = pageKeepNative;
                }
                $.mobile.page.prototype.options.keepNative = keepNative;
            }
            if($.mobile && $.wijmo[widgetName] && $.wijmo[widgetName].prototype && $.wijmo[widgetName].prototype.enhanceWithin) {
                $(document).bind("pagecreate create", function (e) {
                    $.wijmo[widgetName].prototype.enhanceWithin(e.target);
                });
            }
        };
        jQueryWijmo.registerWidget = function registerWidget(name, baseType, def, customizeInit) {
            var fullName = "wijmo." + name, init;
            if(typeof def === 'function') {
                init = def;
                def = null;
            }
            if(def === null || def === undefined) {
                def = $.extend(true, {
                }, baseType);
                baseType = $.wijmo.widget;
            }
            def.options = def.options || {
            };
            def.options.initSelector = def.options.initSelector || ":jqmData(role='" + name + "')";
            if($.mobile && def.options && def.options.wijMobileCSS) {
                def.options.wijCSS = def.options.wijCSS || {
                };
                $.extend(def.options.wijCSS, def.options.wijMobileCSS);
            }
            $.widget(fullName, baseType, def);
            if(init) {
                init.call();
            } else if(this.autoInit) {
                this.autoInit(name, def.options.initSelector);
            }
        };
        jQueryWijmo.addThemeToMobileCSS = function addThemeToMobileCSS(theme, classes) {
            $.each(classes, function (key, cl) {
                if(typeof cl === "string") {
                    $.each(jQueryWijmo.wijMobileThemePrefix, function (idx, css) {
                        var regExp = new RegExp("\\b" + css);
                        if(regExp.test(cl)) {
                            classes[key] = cl + " " + css + "-" + theme;
                        }
                    });
                } else {
                    jQueryWijmo.addThemeToMobileCSS(theme, cl);
                }
            });
        };
        return jQueryWijmo;
    })();    
    $.wijmo = jQueryWijmo;
    // Declarations to support TypeScript type system
    var JQueryUIWidget = (function () {
        function JQueryUIWidget() { }
        JQueryUIWidget.prototype.destroy = /** Removes the dialog functionality completely. This will return the element back to its pre-init state. */
        function () {
        };
        JQueryUIWidget.prototype._setOption = function (name, value) {
        };
        JQueryUIWidget.prototype._create = function () {
        };
        JQueryUIWidget.prototype._init = function () {
        };
        JQueryUIWidget.prototype.widget = /** Returns a jQuery object containing the original element or other relevant generated element. */
        function () {
            return this.element;
        };
        return JQueryUIWidget;
    })();
    wijmo.JQueryUIWidget = JQueryUIWidget;    
    JQueryUIWidget.prototype.options = {
        wijCSS: $.wijmo.wijCSS
    };
    JQueryUIWidget.prototype.destroy = function () {
        $.Widget.prototype.destroy.apply(this, arguments);
    };
    JQueryUIWidget.prototype._setOption = function (name, value) {
        $.Widget.prototype._setOption.apply(this, arguments);
    };
    JQueryUIWidget.prototype._create = function () {
        $.Widget.prototype._create.apply(this, arguments);
    };
    JQueryUIWidget.prototype._init = function () {
        $.Widget.prototype._init.apply(this, arguments);
    };
    var JQueryMobileWidget = (function (_super) {
        __extends(JQueryMobileWidget, _super);
        function JQueryMobileWidget() {
            _super.apply(this, arguments);

        }
        return JQueryMobileWidget;
    })(JQueryUIWidget);
    wijmo.JQueryMobileWidget = JQueryMobileWidget;    
    //Fires a wijmoinit event on the document object for users to override default settings.
    //Use $(document).bind("wijmoinit", function() {//apply overrides here});
    //The event handler must be binded before jquery.wijmo.widget is loaded.
    $(window.document).trigger("wijmoinit");
    var wijmoWidget = (function (_super) {
        __extends(wijmoWidget, _super);
        function wijmoWidget() {
            _super.apply(this, arguments);

            this._widgetCreated = false;
        }
        wijmoWidget.prototype._baseWidget = function () {
            return this._isMobile ? $.mobile.widget : $.Widget;
        };
        wijmoWidget.prototype._createWidget = function (options, element) {
            this._widgetCreated = true;
            //Set widgetName to widgetEventPrefix for binding events like following,
            //$(element).bind(widgetName + eventName, function() {});
            if(this._syncEventPrefix) {
                this.widgetEventPrefix = this.widgetName;
            }
            // enable touch support:
            if(window.wijmoApplyWijTouchUtilEvents) {
                $ = window.wijmoApplyWijTouchUtilEvents($);
            }
            this._baseWidget().prototype._createWidget.apply(this, arguments);
        };
        wijmoWidget.prototype._create = function () {
            this._baseWidget().prototype._create.apply(this, arguments);
        };
        wijmoWidget.prototype._init = function () {
            this._baseWidget().prototype._init.apply(this, arguments);
        };
        wijmoWidget.prototype.destroy = function () {
            this._baseWidget().prototype.destroy.apply(this, arguments);
        };
        wijmoWidget.prototype._setOption = function (name, value) {
            this._baseWidget().prototype._setOption.apply(this, arguments);
            //Fixed an issue for jQuery mobile. when set the disabled option, the jQuery mobile set
            // 'ui-state-disabled' css on the element.
            if(name === "disabled" && value && this._isMobile) {
                this.element.removeClass("ui-state-disabled").addClass(this.options.wijCSS.stateDisabled);
            }
        };
        return wijmoWidget;
    })(JQueryMobileWidget);
    wijmo.wijmoWidget = wijmoWidget;    
    wijmoWidget.prototype._syncEventPrefix = true;
    wijmoWidget.prototype._isMobile = false;
    //Check if jQuery Mobile is on the page and make sure autoMobilize is set to true (so that this default behavior can be turned off)
    if($.mobile != null && $.wijmo.autoMobilize === true) {
        //Set mobile CSS classes to work with jQuery Mobile CSS Framework
        //wijmoWidget.options.wijCSS = $.wijmo.wijMobileCSS;
        $.extend(true, wijmoWidget.prototype.options.wijCSS, $.wijmo.wijMobileCSS);
        wijmoWidget.prototype._isMobile = true;
        wijmoWidget.prototype.options = $.extend(true, {
        }, wijmoWidget.prototype.options, wijmoWidget.prototype._baseWidget().prototype.options);
        wijmoWidget.prototype.enhanceWithin = function (target, useKeepNative) {
            if(!this._widgetCreated) {
                $.mobile.widget.prototype.enhanceWithin.apply(this, arguments);
            }
        };
        wijmoWidget.prototype._getCreateOptions = function () {
            var ele = this.element, baseOptions, optionsParser = optionsParser = function (value) {
                // Add quotes to key pair.
                if(typeof value === 'undefined') {
                    return {
                    };
                } else if(value === null) {
                    return {
                    };
                }
                var reg = /(?:(?:\{[\n\r\t\s]*(.+?)\s*\:[\n\r\t\s]*)|(?:,[\n\r\t\s]*(.+?)\s*\:[\n\r\t\s]*))('(.*?[^\\])')?/gi, arrReg = /\[.*?(?=[\]\[])|[\]\[].*?(?=[\]])/gi, str = value.replace(reg, function (i, str1, str2, str3) {
                    var result, reg1 = /[\n\r\t\s]*['"]?([^\{,\s]+?)['"]?\s*:[\n\r\t\s]*/i, reg2 = /\:[\n\r\t\s]*(?:'(.*)')?/i;
                    result = i.replace(reg1, "\"$1\":");
                    if(str3) {
                        return result.replace(reg2, ":\"$1\"");
                    }
                    return result;
                }).replace(arrReg, function (i) {
                    var reg1 = /'(.*?[^\\])'/g;
                    return i.replace(reg1, "\"$1\"");
                });
                return $.parseJSON(str);
            }, options = optionsParser(ele.attr("data-" + $.mobile.nsNormalize("options"))), wijCSS;
            baseOptions = $.mobile.widget.prototype._getCreateOptions.apply(this, arguments);
            //add theme support in mobile mode
            wijCSS = $.extend(true, {
            }, this.options.wijCSS);
            this.theme = this.options.theme !== undefined ? this.options.theme : this.element.jqmData("theme");
            if(this.theme) {
                $.wijmo.addThemeToMobileCSS(this.theme, wijCSS);
            }
            return $.extend(baseOptions, {
                wijCSS: wijCSS
            }, options);
        };
        $.widget("wijmo.widget", $.mobile.widget, wijmoWidget.prototype);
        $(document).on("pageshow", function (event, ui) {
            if(event.target == null) {
                return;
            }
            var page = $(event.target);
            if(page.wijTriggerVisibility) {
                page.wijTriggerVisibility();
            }
        });
    } else {
        wijmoWidget.prototype.options = $.extend(true, {
        }, wijmoWidget.prototype.options, wijmoWidget.prototype._baseWidget().prototype.options);
        //jQuery Mobile either does not exist or the autoMobilize flag has been turned off.
        $.widget("wijmo.widget", wijmoWidget.prototype);
    }
})(wijmo || (wijmo = {}));
