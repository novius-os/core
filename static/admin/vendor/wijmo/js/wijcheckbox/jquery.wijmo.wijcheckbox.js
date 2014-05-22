/*
 *
 * Wijmo Library 3.20141.34
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 * ----
 * Credits: Wijmo includes some MIT-licensed software, see copyright notices below.
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
    *  jquery-1.4.2.js
    *	jquery.ui.core.js
    *	jquery.ui.widget.js
    *
    *
    */
    (function (checkbox) {
        "use strict";
        var $ = jQuery, widgetName = "wijcheckbox", _csspre = "wijcheckbox", checkboxId = 0;
        /** @widget */
        var wijcheckbox = (function (_super) {
            __extends(wijcheckbox, _super);
            function wijcheckbox() {
                _super.apply(this, arguments);

            }
            wijcheckbox.prototype._init = function () {
                var self = this, ele = self.element, o = self.options, checkboxElement, label, targetLabel, boxElement, iconElement;
                if(ele.is(":checkbox")) {
                    if(!ele.attr("id")) {
                        ele.attr("id", _csspre + checkboxId);
                        checkboxId += 1;
                    }
                    if(ele.parent().is("label")) {
                        checkboxElement = ele.parent().wrap($("<div></div>").addClass(o.wijCSS.wijcheckboxInputwrapper)).parent().wrap("<div></div>").parent().addClass(o.wijCSS.wijcheckbox).addClass(o.wijCSS.widget);
                        label = ele.parent();
                        label.attr("for", ele.attr("id"));
                        checkboxElement.find("." + o.wijCSS.wijcheckboxInputwrapper).append(ele);
                        checkboxElement.append(label);
                    } else {
                        checkboxElement = ele.wrap($("<div></div>").addClass(o.wijCSS.wijcheckboxInputwrapper)).parent().wrap("<div></div>").parent().addClass(o.wijCSS.wijcheckbox).addClass(o.wijCSS.widget);
                    }
                    targetLabel = $("label[for='" + ele.attr("id") + "']");
                    if(targetLabel.length > 0) {
                        checkboxElement.append(targetLabel);
                        targetLabel.attr("labelsign", "C1");
                    }
                    if(ele.is(":disabled")) {
                        self._setOption("disabled", true);
                    }
                    boxElement = $("<div></div>").addClass(o.wijCSS.wijcheckboxBox).addClass(o.wijCSS.widget).addClass(o.wijCSS.stateDefault).addClass(o.wijCSS.cornerAll).append($("<span></span>").addClass(o.wijCSS.wijcheckboxIcon));
                    if(o.disabled) {
                        boxElement.addClass(o.wijCSS.stateDisabled);
                    }
                    iconElement = boxElement.children("." + o.wijCSS.wijcheckboxIcon);
                    checkboxElement.append(boxElement);
                    ele.data("iconElement", iconElement);
                    ele.data("boxElement", boxElement);
                    ele.data("checkboxElement", checkboxElement);
                    boxElement.removeClass(o.wijCSS.wijcheckboxRelative).attr("role", "checkbox").bind("mouseover", function () {
                        ele.mouseover(null);
                    }).bind("mouseout", function () {
                        ele.mouseout(null);
                    });
                    if(targetLabel.length === 0 || targetLabel.html() === "") {
                        boxElement.addClass(o.wijCSS.wijcheckboxRelative);
                    }
                    ele.bind("click.checkbox", function (e) {
                        if(o.disabled) {
                            return;
                        }
                        self.refresh(e);
                        self._trigger("changed", null, {
                            checked: self.options.checked
                        });
                    }).bind("focus.checkbox", function () {
                        if(o.disabled) {
                            return;
                        }
                        boxElement.addClass(o.wijCSS.stateFocus);
                    }).bind("blur.checkbox", function () {
                        if(o.disabled) {
                            return;
                        }
                        boxElement.removeClass(o.wijCSS.stateFocus).not("." + o.wijCSS.stateHover);
                    }).bind("keydown.checkbox", function (e) {
                        if(e.keyCode === 32) {
                            if(o.disabled) {
                                return;
                            }
                            self.refresh(null);
                        }
                    });
                    boxElement.bind("click.checkbox", function (e) {
                        if(o.disabled) {
                            return;
                        }
                        ele.get(0).checked = !ele.get(0).checked;
                        ele.change();
                        ele.focus();
                        self.refresh(e);
                        self._trigger("changed", null, {
                            checked: self.options.checked
                        });
                    });
                    self._initCheckState();
                    self.refresh(null);
                    checkboxElement.bind("mouseover.checkbox", function (e) {
                        if(o.disabled) {
                            return;
                        }
                        boxElement.addClass(o.wijCSS.stateHover);
                    }).bind("mouseout.checkbox", function (e) {
                        if(o.disabled) {
                            return;
                        }
                        boxElement.removeClass(o.wijCSS.stateHover).not("." + o.wijCSS.stateFocus);
                    });
                    //update for fixed tooltip can't take effect
                    checkboxElement.attr("title", ele.attr("title"));
                }
            };
            wijcheckbox.prototype._create = function () {
                // enable touch support:
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
            };
            wijcheckbox.prototype._setOption = function (key, value) {
                var self = this, o = self.options, boxElement, originalCheckedState = o.checked;
                _super.prototype._setOption.call(this, key, value);
                if(key === 'checked') {
                    self.element.get(0).checked = value;
                    self.refresh(null);
                    if(originalCheckedState !== value) {
                        self._trigger("changed", null, {
                            checked: value
                        });
                    }
                } else if(key === 'disabled') {
                    boxElement = self.element.data("boxElement");
                    self.element.prop("disabled", value);
                    if(boxElement) {
                        boxElement.toggleClass(o.wijCSS.stateDisabled, value);
                    }
                }
            };
            wijcheckbox.prototype._initCheckState = function () {
                var self = this, o = self.options;
                if(o.checked !== undefined && o.checked !== null) {
                    self.element.get(0).checked = o.checked;
                }
            };
            wijcheckbox.prototype.refresh = /** Use the refresh method to set the checkbox element's style.
            * @param {object} e The event that fires the refresh the checkbox.
            */
            function (e) {
                var self = this, o = self.options;
                o.checked = self.element.get(0).checked;
                self.element.data("iconElement").toggleClass(o.wijCSS.icon + " " + o.wijCSS.iconCheck, self.element.get(0).checked);
                self.element.data("boxElement").toggleClass(o.wijCSS.stateActive, self.element.get(0).checked).attr("aria-checked", self.element.get(0).checked);
                self.element.data("checkboxElement").toggleClass(o.wijCSS.stateChecked, self.element.get(0).checked);
                if(e) {
                    e.stopPropagation();
                }
            };
            wijcheckbox.prototype.destroy = /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            function () {
                var self = this, boxelement = self.element.parent().parent();
                boxelement.children("div." + self.options.wijCSS.wijcheckboxBox).remove();
                self.element.unwrap();
                self.element.unwrap();
                _super.prototype.destroy.call(this);
            };
            return wijcheckbox;
        })(wijmo.wijmoWidget);
        checkbox.wijcheckbox = wijcheckbox;        
        var wijcheckbox_options = (function () {
            function wijcheckbox_options() {
                /** Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijcheckbox')";
                /** wijcheckbox css, extend from $.wijmo.wijCSS
                * @ignore
                */
                this.wijCSS = {
                    wijcheckbox: "wijmo-checkbox",
                    wijcheckboxBox: "wijmo-checkbox-box",
                    wijcheckboxIcon: "wijmo-checkbox-icon",
                    wijcheckboxInputwrapper: "wijmo-checkbox-inputwrapper",
                    wijcheckboxRelative: "wijmo-checkbox-relative"
                };
                /** wijcheckbox css, extend from $.wijmo.wijCSS
                * @ignore
                */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-b",
                    stateDefault: "ui-btn ui-btn-b",
                    stateHover: "ui-btn-down-c",
                    stateActive: "ui-btn-down-b"
                };
                /** Causes the checkbox to appear with a checkmark.
                * @type {boolean}
                */
                this.checked = null;
                /** A function that is called when the checked state changes.
                * @event
                * @dataKey {boolean} checked the state of checkbox.
                */
                this.changed = null;
            }
            return wijcheckbox_options;
        })();        
        ;
        wijcheckbox.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijcheckbox_options());
        $.wijmo.registerWidget(widgetName, wijcheckbox.prototype);
    })(wijmo.checkbox || (wijmo.checkbox = {}));
    var checkbox = wijmo.checkbox;
})(wijmo || (wijmo = {}));
