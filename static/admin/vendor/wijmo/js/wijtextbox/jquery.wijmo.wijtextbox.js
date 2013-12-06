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
    /*globals jQuery */
    /*
    * Depends:
    *  jquery-1.4.2.js
    *	jquery.ui.core.js
    *	jquery.ui.widget.js
    *
    */
    (function (textbox) {
        "use strict";
        var $ = jQuery, widgetName = "wijtextbox";
        /** @widget */
        var wijtextbox = (function (_super) {
            __extends(wijtextbox, _super);
            function wijtextbox() {
                _super.apply(this, arguments);

            }
            wijtextbox.prototype._create = function () {
                var self = this, e = self.element, wijCSS = self.options.wijCSS, allowedNodes = {
                    'input': true,
                    'textarea': true
                }, allowedInputTypes = {
                    'text': true,
                    'password': true,
                    'email': true,
                    'url': true
                }, nodeName = e.get(0).nodeName.toLowerCase();
                // enable touch support:
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                if(!allowedNodes.hasOwnProperty(nodeName)) {
                    return;
                }
                if((nodeName === 'input') && self.element.attr("type") && !allowedInputTypes.hasOwnProperty(self.element.attr("type").toLowerCase())) {
                    return;
                }
                e.addClass(wijCSS.wijtextbox).addClass(wijCSS.widget).addClass(wijCSS.stateDefault).addClass(wijCSS.cornerAll);
                self.element.bind("mouseover." + self.widgetName, function () {
                    e.addClass(wijCSS.stateHover);
                }).bind("mouseout." + self.widgetName, function () {
                    e.removeClass(wijCSS.stateHover);
                }).bind("mousedown." + self.widgetName, function () {
                    e.addClass(wijCSS.stateActive);
                }).bind("mouseup." + self.widgetName, function () {
                    e.removeClass(wijCSS.stateActive);
                }).bind("focus." + self.widgetName, function () {
                    e.addClass(wijCSS.stateFocus);
                }).bind("blur." + self.widgetName, function () {
                    e.removeClass(wijCSS.stateFocus);
                });
                //for case 20899
                if(e.is(":disabled")) {
                    self._setOption("disabled", true);
                    e.addClass(wijCSS.stateDisabled);
                } else {
                    self._setOption("disabled", false);
                    e.removeClass(wijCSS.stateDisabled);
                }
            };
            wijtextbox.prototype.destroy = /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            function () {
                var self = this, wijCSS = self.options.wijCSS;
                self.element.removeClass(wijCSS.widget).removeClass(wijCSS.stateDefault).removeClass(wijCSS.cornerAll).removeClass(wijCSS.stateHover).removeClass(wijCSS.stateActive).removeClass(wijCSS.wijtextbox).unbind("." + self.widgetName);
                _super.prototype.destroy.call(this);
            };
            return wijtextbox;
        })(wijmo.wijmoWidget);
        textbox.wijtextbox = wijtextbox;        
        var wijtextbox_options = (function () {
            function wijtextbox_options() {
                /** Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijtextbox')";
                /** wijtextbox css, extend from $.wijmo.wijCSS
                * @ignore
                */
                this.wijCSS = {
                    wijtextbox: "wijmo-wijtextbox"
                };
            }
            return wijtextbox_options;
        })();        
        ;
        wijtextbox.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijtextbox_options());
        $.wijmo.registerWidget(widgetName, wijtextbox.prototype);
    })(wijmo.textbox || (wijmo.textbox = {}));
    var textbox = wijmo.textbox;
})(wijmo || (wijmo = {}));
