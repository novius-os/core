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
    /// <reference path="../external/declarations/globalize.d.ts"/>
    /// <reference path="../Base/jquery.wijmo.widget.ts"/>
    /// <reference path="../wijpopup/jquery.wijmo.wijpopup.ts"/>
    /// <reference path="../wijlist/jquery.wijmo.wijlist.ts"/>
    /// <reference path="../wijsuperpanel/jquery.wijmo.wijsuperpanel.ts"/>
    /*globals Globalize window jQuery wijInputResult document*/
    (function (input) {
        "use strict";
        var $ = jQuery, jqKeyCode = wijmo.getKeyCodeEnum();
        /** @widget */
        var wijinputcore = (function (_super) {
            __extends(wijinputcore, _super);
            function wijinputcore() {
                _super.apply(this, arguments);

                this._boundMouseWheel = false;
                this._wasPopupShowing = false;
                this._blockNextTriggerClickedEvent = false;
            }
            wijinputcore.prototype._elemWithClasses = function (elem, classes) {
                if (typeof classes === "undefined") { classes = []; }
                return $(elem).addClass(classes.join(" "));
            };
            wijinputcore.prototype._divWithClasses = function () {
                var classes = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    classes[_i] = arguments[_i + 0];
                }
                return this._elemWithClasses("<div/>", classes);
            };
            wijinputcore.prototype._spanWithClasses = function () {
                var classes = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    classes[_i] = arguments[_i + 0];
                }
                return this._elemWithClasses("<span/>", classes);
            };
            wijinputcore.prototype._horizontalBorderWidth = function (elem) {
                return elem.leftBorderWidth() + elem.rightBorderWidth();
            };
            wijinputcore.prototype._verticalBorderWidth = function (elem) {
                return elem.topBorderWidth() + elem.bottomBorderWidth();
            };
            wijinputcore.prototype._create = function () {
                var _this = this;
                try  {
                    var focused = document.activeElement == this.element[0];
                } catch (e) {
                }
                var hBorder = this._horizontalBorderWidth(this.element);
                var vBorder = this._verticalBorderWidth(this.element);
                if(this.element[0].tagName.toLowerCase() !== 'input' && this.element[0].tagName.toLowerCase() !== 'textarea') {
                    throw "Target element is not a INPUT";
                }
                this._creationDate = new Date();
                // enable touch support:
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                if(this.element.is(":hidden") && this.element.wijAddVisibilityObserver) {
                    this.element.wijAddVisibilityObserver(function () {
                        _this._destroy();
                        _this._create();
                        if(_this.element.wijRemoveVisibilityObserver) {
                            _this.element.wijRemoveVisibilityObserver();
                        }
                    }, "wijinput");
                }
                this.element.data("widgetName", this.widgetName);
                //$.effects.save(this.element, ['width', 'height']);
                if($.effects && $.effects.save) {
                    $.effects.save(this.element, [
                        'width',
                        'height'
                    ]);
                } else if($.save) {
                    $.save(this.element, [
                        'width',
                        'height'
                    ]);
                }
                var wijCSS = this.options.wijCSS;
                // Novius OS : add forgotten ending >
                this.element.wrap("<div><span/></div>");
                this.wrapper = this.element.parent();
                this.outerDiv = this.wrapper.parent();
                this.outerDiv.addClass([
                    wijCSS.wijinput,
                    wijCSS.widget,
                    wijCSS.helperClearFix,
                    wijCSS.stateDefault,
                    wijCSS.cornerAll
                ].join(" "));
                this.wrapper.addClass(wijCSS.wijinputWrapper);
                this.element.addClass(wijCSS.wijinputInput).addClass(wijCSS.cornerAll).attr('role', 'textbox');
                if(!(Utility.IsIE() && parseFloat($.browser.version) <= 7)) {
                    //Can't set 'aria-multiline' attribute by jQuery's attr() api in IE10 Compatibility View
                    try  {
                        this.element.attr('aria-multiline', false);
                    } catch (e) {
                        this.element[0].setAttribute('aria-multiline', "false");
                    }//self.element.attr('aria-multiline', false);

                }
                this._createDropDownAndSpin();
                this._initialize();
                if(focused) {
                    $(function () {
                        return _this.element.focus().wijtextselection(0, _this.element.val().length);
                    });
                }
                // We need to move width and height from the <input/> to the outer <div/> because the input must span the parent wrapper.
                // It must be done if A dimension is set in the style attribute, hence the "if" statements
                // The a dimension is in pixels, it must be adjusted according to the input's and div's border/margin/padding.
                // The input's total border size must be calcualted before changing the classes, hence variables hBorder and vBorder.
                var style = this.element[0].style;
                if(style.width) {
                    if(this._isInPercents(style.width)) {
                        this.outerDiv.width(style.width);
                    } else {
                        this.outerDiv.width(this.element.width() + hBorder - this._horizontalBorderWidth(this.outerDiv));
                    }
                    this.element.width("");
                }
                if(style.height) {
                    if(this._isInPercents(style.height)) {
                        this.outerDiv.height(style.height);
                    } else {
                        this.outerDiv.height(this.element.height() + vBorder - this._verticalBorderWidth(this.outerDiv));
                    }
                    this.element.height(this.outerDiv.height() - (parseInt(this.wrapper.css('padding-top')) + parseInt(this.wrapper.css('padding-bottom'))));
                }
            };
            wijinputcore.prototype._createDropDownAndSpin = function () {
                this._createDropDownAndSpinElement();
                this._createDropDownAndSpinStyle();
                this._createDropDownAndSpinLayout();
            };
            wijinputcore.prototype._createDropDownAndSpinElement = function () {
                var wijCSS = this.options.wijCSS;
                var spinnerAlign = this.options.spinnerAlign;
                var leftSpinnerBtn = spinnerAlign === 'verticalLeft';
                var leftDropDownBtn = this.options.dropDownButtonAlign === 'left';
                var showSpinner = this.options.showSpinner;
                var showDropDownButton = this._isDropDownButtonShown();
                if(this.options.buttonAlign != null) {
                    leftSpinnerBtn = this.options.buttonAlign == 'left';
                    leftDropDownBtn = this.options.buttonAlign == 'left';
                    spinnerAlign = this.options.buttonAlign == 'left' ? "verticalLeft" : "verticalRight";
                }
                this.triggerBtn = null;
                this.spinUpElement = null;
                this.spinDownElement = null;
                this.outerDiv.css("overflow", "hidden");
                if(showDropDownButton) {
                    var cornerCSS = leftDropDownBtn ? wijCSS.cornerLeft : wijCSS.cornerRight;
                    this.triggerBtn = this._divWithClasses(wijCSS.wijinputTrigger, wijCSS.stateDefault, cornerCSS).append(this._spanWithClasses(wijCSS.icon, wijCSS.iconArrowDown)).attr('role', 'button');
                    this.element.attr({
                        'role': 'combobox',
                        'aria-expanded': false
                    });
                }
                if(showSpinner) {
                    this.spinnerLeft = this._divWithClasses(wijCSS.wijinputSpinnerLeft, wijCSS.wijinputButton);
                    this.spinnerRight = this._divWithClasses(wijCSS.wijinputSpinnerRight, wijCSS.wijinputButton);
                    if(spinnerAlign === "verticalLeft" || spinnerAlign === "verticalRight") {
                        this.spinUpElement = this._divWithClasses(wijCSS.stateDefault, wijCSS.wijinputSpinUp).append(this._spanWithClasses(wijCSS.icon, wijCSS.iconArrowUp)).attr('role', 'upbutton');
                        this.spinDownElement = this._divWithClasses(wijCSS.stateDefault, wijCSS.wijinputSpinDown).append(this._spanWithClasses(wijCSS.icon, wijCSS.iconArrowDown)).attr('role', 'downbutton');
                    } else {
                        this.spinUpElement = this._divWithClasses(wijCSS.stateDefault, wijCSS.wijinputSpin).append(this._spanWithClasses(wijCSS.icon, wijCSS.iconPlus)).attr('role', 'upbutton');
                        this.spinDownElement = this._divWithClasses(wijCSS.stateDefault, wijCSS.wijinputSpin).append(this._spanWithClasses(wijCSS.icon, wijCSS.iconMinus)).attr('role', 'downbutton');
                    }
                    this.element.attr('role', 'spinner');
                }
            };
            wijinputcore.prototype._createDropDownAndSpinStyle = function () {
                var wijCSS = this.options.wijCSS;
                var spinnerAlign = this.options.spinnerAlign;
                var leftSpinnerBtn = this.options.spinnerAlign === 'verticalLeft';
                var leftDropDownBtn = this.options.dropDownButtonAlign === 'left';
                var showSpinner = this.options.showSpinner;
                var showDropDownButton = this._isDropDownButtonShown();
                if(this.options.buttonAlign != null) {
                    leftSpinnerBtn = this.options.buttonAlign == 'left';
                    leftDropDownBtn = this.options.buttonAlign == 'left';
                    spinnerAlign = this.options.buttonAlign == 'left' ? "verticalLeft" : "verticalRight";
                }
                //Flag CSS
                if(showDropDownButton && showSpinner) {
                    if(leftDropDownBtn) {
                        switch(spinnerAlign) {
                            case "verticalLeft":
                                this.outerDiv.addClass(wijCSS.inputSpinnerTriggerLeft);
                                break;
                            case "verticalRight":
                                this.outerDiv.addClass(wijCSS.inputTriggerLeft);
                                this.outerDiv.addClass(wijCSS.inputSpinnerRight);
                                break;
                            case "horizontalDownLeft":
                            case "horizontalUpLeft":
                                this.outerDiv.addClass(wijCSS.inputSpinnerTriggerLeft);
                                this.outerDiv.addClass(wijCSS.inputSpinnerRight);
                                break;
                        }
                    } else {
                        switch(spinnerAlign) {
                            case "verticalLeft":
                                this.outerDiv.addClass(wijCSS.inputTriggerRight);
                                this.outerDiv.addClass(wijCSS.inputSpinnerLeft);
                                break;
                            case "verticalRight":
                                this.outerDiv.addClass(wijCSS.inputSpinnerTriggerRight);
                                break;
                            case "horizontalDownLeft":
                            case "horizontalUpLeft":
                                this.outerDiv.addClass(wijCSS.inputSpinnerTriggerRight);
                                this.outerDiv.addClass(wijCSS.inputSpinnerLeft);
                                break;
                        }
                    }
                } else if(showDropDownButton) {
                    if(leftDropDownBtn) {
                        this.outerDiv.addClass(wijCSS.inputTriggerLeft);
                    } else {
                        this.outerDiv.addClass(wijCSS.inputTriggerRight);
                    }
                } else if(showSpinner) {
                    switch(spinnerAlign) {
                        case "verticalLeft":
                            this.outerDiv.addClass(wijCSS.inputSpinnerLeft);
                            break;
                        case "verticalRight":
                            this.outerDiv.addClass(wijCSS.inputSpinnerRight);
                            break;
                        case "horizontalDownLeft":
                        case "horizontalUpLeft":
                            this.outerDiv.addClass(wijCSS.inputSpinnerLeft);
                            this.outerDiv.addClass(wijCSS.inputSpinnerRight);
                            break;
                    }
                }
                //Corner CSS
                if(showDropDownButton && showSpinner) {
                    if(leftDropDownBtn) {
                        switch(spinnerAlign) {
                            case "verticalRight":
                                this.spinUpElement.addClass(wijCSS.cornerTR);
                                this.spinDownElement.addClass(wijCSS.cornerBR);
                                break;
                            case "horizontalDownLeft":
                                this.spinUpElement.addClass(wijCSS.cornerRight);
                                break;
                            case "horizontalUpLeft":
                                this.spinDownElement.addClass(wijCSS.cornerRight);
                                break;
                        }
                    } else {
                        switch(spinnerAlign) {
                            case "verticalLeft":
                                this.spinUpElement.addClass(wijCSS.cornerTL);
                                this.spinDownElement.addClass(wijCSS.cornerBL);
                                break;
                            case "horizontalDownLeft":
                                this.spinDownElement.addClass(wijCSS.cornerLeft);
                                break;
                            case "horizontalUpLeft":
                                this.spinUpElement.addClass(wijCSS.cornerLeft);
                                break;
                        }
                    }
                } else if(showSpinner) {
                    switch(spinnerAlign) {
                        case "verticalLeft":
                            this.spinUpElement.addClass(wijCSS.cornerTL);
                            this.spinDownElement.addClass(wijCSS.cornerBL);
                            break;
                        case "verticalRight":
                            this.spinUpElement.addClass(wijCSS.cornerTR);
                            this.spinDownElement.addClass(wijCSS.cornerBR);
                            break;
                        case "horizontalDownLeft":
                            this.spinDownElement.addClass(wijCSS.cornerLeft);
                            this.spinUpElement.addClass(wijCSS.cornerRight);
                            break;
                        case "horizontalUpLeft":
                            this.spinUpElement.addClass(wijCSS.cornerLeft);
                            this.spinDownElement.addClass(wijCSS.cornerRight);
                            break;
                    }
                }
            };
            wijinputcore.prototype._createDropDownAndSpinLayout = function () {
                var spinnerAlign = this.options.spinnerAlign;
                var showSpinner = this.options.showSpinner;
                var showDropDownButton = this._isDropDownButtonShown();
                if(this.options.buttonAlign != null) {
                    spinnerAlign = this.options.buttonAlign == 'left' ? "verticalLeft" : "verticalRight";
                }
                if(showDropDownButton) {
                    this.triggerBtn.appendTo(this.outerDiv);
                }
                if(showSpinner) {
                    switch(spinnerAlign) {
                        case "verticalLeft":
                            this.spinnerLeft.append(this.spinUpElement).append(this.spinDownElement).appendTo(this.outerDiv);
                            break;
                        case "verticalRight":
                            this.spinnerRight.append(this.spinUpElement).append(this.spinDownElement).appendTo(this.outerDiv);
                            break;
                        case "horizontalDownLeft":
                            this.spinnerLeft.append(this.spinDownElement).appendTo(this.outerDiv);
                            this.spinnerRight.append(this.spinUpElement).appendTo(this.outerDiv);
                            break;
                        case "horizontalUpLeft":
                            this.spinnerLeft.append(this.spinUpElement).appendTo(this.outerDiv);
                            this.spinnerRight.append(this.spinDownElement).appendTo(this.outerDiv);
                            break;
                    }
                }
            };
            wijinputcore.prototype._isDropDownButtonShown = function () {
                var showTrigger = this.options.showTrigger;
                if(showTrigger === undefined) {
                    showTrigger = false;
                }
                return showTrigger || this.options.showDropDownButton;
            };
            wijinputcore.prototype._isInPercents = function (size) {
                return size.match(/%$/);
            };
            wijinputcore.prototype._createTextProvider = function () {
                return undefined;
            };
            wijinputcore.prototype._beginUpdate = function () {
            };
            wijinputcore.prototype._endUpdate = function () {
                var _this = this;
                if(this.element.mousewheel && !this._boundMouseWheel) {
                    this.element.mousewheel(function (e, delta) {
                        if(_this.isFocused() && _this._doSpin(delta > 0, false)) {
                            e.preventDefault();
                        }
                    });
                    this._boundMouseWheel = true;
                }
            };
            wijinputcore.prototype._isPopupShowing = function () {
                return !!this._comboDiv && this._comboDiv.wijpopup("isVisible");
            };
            wijinputcore.prototype._onTriggerMouseDown = function (evt) {
                if(this._wasPopupShowing) {
                    this._blockNextTriggerClickedEvent = true;
                }
            };
            wijinputcore.prototype._onTriggerMouseUp = function (evt) {
            };
            wijinputcore.prototype._onTriggerClicked = function () {
                if(this._blockNextTriggerClickedEvent) {
                    this._blockNextTriggerClickedEvent = false;
                    return;
                }
                if(this._popupVisible()) {
                    this._hidePopup();
                } else {
                    this._showPopup();
                }
            };
            wijinputcore.prototype._showPopup = function () {
                return this._popupComboList();
            };
            wijinputcore.prototype._hidePopup = function () {
                this._comboDiv.wijpopup('hide');
            };
            wijinputcore.prototype._initialize = function () {
                var _this = this;
                this.element.data('initializing', true);
                this._trigger('initializing');
                this.element.data('preText', this.element.val());
                this.element.data('elementValue', this.element.val());
                this.element.data('errorstate', false);
                this.element.data('breakSpinner', true);
                this.element.data('prevCursorPos', -1);
                this.element.data('simulating', false);
                this._createTextProvider();
                this._beginUpdate();
                var options = this.options, isLeftButton = function (e) {
                    return (!e.which ? e.button : e.which) === 1;
                }, spinButtonDown = function (e) {
                    if(_this.options.disabled) {
                        return;
                    }
                    if(!isLeftButton(e)) {
                        return;
                    }
                    if(_this.options.disableUserInput) {
                        return;
                    }
                    _this._trySetFocus();
                    if(Utility.IsFireFox4OrLater()) {
                        _this._stopEvent(e);
                    }
                    _this.element.data('breakSpinner', false);
                    _this._addState('active', $(_this));
                    _this._doSpin($(e.currentTarget).attr("role") == "upbutton", true);
                }, spinButtonUp = function (e) {
                    if(_this.options.disabled) {
                        return;
                    }
                    if(!isLeftButton(e)) {
                        return;
                    }
                    if(_this.options.disableUserInput) {
                        return;
                    }
                    _this._stopSpin();
                    _this._removeState('active', $(_this));
                };
                if(this.triggerBtn && !options.disabledState) {
                    this.triggerBtn.bind({
                        'mouseover': function () {
                            if(_this.options.disabled) {
                                return;
                            }
                            _this._addState('hover', $(_this));
                        },
                        'mouseout': function () {
                            if(_this.options.disabled) {
                                return;
                            }
                            _this._removeState('hover', $(_this));
                        },
                        'mousedown': function (e) {
                            if(_this.options.disabled) {
                                return;
                            }
                            if(!isLeftButton(e)) {
                                return;
                            }
                            _this._stopEvent(e);
                            _this._addState('active', $(_this));
                            _this._trigger('triggerMouseDown');
                            _this._trigger('dropDownButtonMouseDown');
                            _this._onTriggerMouseDown(e);
                        },
                        'mouseup': function (e) {
                            _this._onTriggerMouseUp(e);
                        },
                        'click': function (e) {
                            if(_this.options.disabled) {
                                return;
                            }
                            _this._stopEvent(e);
                            _this._stopSpin();
                            _this._removeState('active', $(_this));
                            _this._trigger('triggerMouseUp');
                            _this._trigger('dropDownButtonMouseUp');
                            _this._onTriggerClicked();
                            _this._trySetFocus();
                        }
                    });
                }
                if(this.spinUpElement && !options.disabledState) {
                    this.spinUpElement.bind({
                        'mouseover': function () {
                            if(_this.options.disabled) {
                                return;
                            }
                            _this._addState('hover', $(_this));
                        },
                        'mouseout': function () {
                            if(_this.options.disabled) {
                                return;
                            }
                            _this._removeState('hover', $(_this));
                            _this._removeState('active', $(_this));
                            _this._stopSpin();
                        },
                        'mousedown': spinButtonDown,
                        'mouseup': spinButtonUp
                    });
                }
                if(this.spinDownElement && !options.disabledState) {
                    this.spinDownElement.bind({
                        'mouseover': function () {
                            if(_this.options.disabled) {
                                return;
                            }
                            _this._addState('hover', $(_this));
                        },
                        'mouseout': function () {
                            if(_this.options.disabled) {
                                return;
                            }
                            _this._removeState('hover', $(_this));
                            _this._removeState('active', $(_this));
                            _this._stopSpin();
                        },
                        'mousedown': spinButtonDown,
                        'mouseup': spinButtonUp
                    });
                }
                this._attachInputEvent();
                this.element.data('initializing', false);
                this._resetData();
                this._endUpdate();
                this._updateText();
                if(this.options.disabledState) {
                    var dis = options.disabled;
                    this.disable();
                    options.disabled = dis;
                }
                if(this.options.disabled) {
                    this.disable();
                }
                if(this.options.imeMode) {
                    this.element.css("ime-mode", this.options.imeMode);
                }
                this.element.data('initialized', true);
                this._trigger('initialized');
            };
            wijinputcore.prototype._attachInputEvent = function () {
                this.element.bind({
                    'focus.wijinput': $.proxy(this._onFocus, this),
                    'beforedeactivate.wijinput': $.proxy(this._onBeforeDeactivate, this),
                    'blur.wijinput': $.proxy(this._onBlur, this),
                    'mousedown.wijinput': $.proxy(this._onMouseDown, this),
                    'mouseup.wijinput': $.proxy(this._onMouseUp, this),
                    'keypress.wijinput': $.proxy(this._onKeyPress, this),
                    'keydown.wijinput': $.proxy(this._onKeyDown, this),
                    'keyup.wijinput': $.proxy(this._onKeyUp, this),
                    'compositionstart.wijinput': $.proxy(this._onCompositionStart, this),
                    'compositionend.wijinput': $.proxy(this._onCompositionEnd, this),
                    'change.wijinput': $.proxy(this._onChange, this),
                    'paste.wijinput': $.proxy(this._onPaste, this),
                    'drop.wijinput': $.proxy(this._onDrop, this)
                });
                this.element.bind('propertychange.wijinput input.wijinput', $.proxy(this._onInput, this));
            };
            wijinputcore.prototype._detachInputEvent = function () {
                this.element.unbind('.wijinput');
            };
            wijinputcore.prototype._init = function () {
                if(this.element.attr("readOnly")) {
                    this.options.readonly = true;
                }
                if(this.options.readonly === true) {
                    this.options.disableUserInput = true;
                }
                if(this.options.readonly === true || this.options.disableUserInput === true) {
                    this.element.attr('readOnly', true);
                }
                if(this.options.placeholder != null) {
                    this.options.nullText = this.options.placeholder;
                }
                if(this.options.showTrigger != undefined) {
                    this._setOption("showDropDownButton", this.options.showTrigger);
                }
            };
            wijinputcore.prototype._showNullText = function () {
                return !!this.options.nullText || this.options.nullText === "";
            };
            wijinputcore.prototype._setOption = function (key, value) {
                switch(key) {
                    case 'readonly':
                        this._super(key, value);
                        key = "disableUserInput";
                        break;
                    case 'placeholder':
                        this._super(key, value);
                        key = 'nullText';
                        break;
                    case 'showTrigger':
                        this.options.showDropDownButton = value;
                        break;
                }
                this._super(key, value);
                switch(key) {
                    case 'spinnerAlign':
                    case 'dropDownButtonAlign':
                    case 'showDropDownButton':
                    case 'buttonAlign':
                    case 'showTrigger':
                    case 'showSpinner':
                        this._destroy();
                        this._create();
                        break;
                    case 'showNullText':
                    case 'nullText':
                        this._updateText();
                        break;
                    case 'imeMode':
                        this.element.css("ime-mode", this.options.imeMode);
                        break;
                    case 'disabled':
                        this.element.attr('disabled', value);
                        var addRemove = value ? 'addClass' : 'removeClass';
                        var stateDisabled = this.options.wijCSS.stateDisabled;
                        this.element[addRemove](stateDisabled);
                        if(this.triggerBtn) {
                            this.triggerBtn[addRemove](stateDisabled);
                        }
                        if(this.spinUpElement) {
                            this.spinUpElement[addRemove](stateDisabled);
                        }
                        if(this.spinDownElement) {
                            this.spinDownElement[addRemove](stateDisabled);
                        }
                        break;
                    case 'disableUserInput':
                        this.element.attr('readOnly', value);
                        break;
                }
            };
            wijinputcore.prototype.destroy = /** Destroy the widget.
            */
            function () {
                this._super();
                if(this._comboDiv) {
                    this._comboDiv.remove();
                }
                this._destroy();
            };
            wijinputcore.prototype.drop = /** Open the dropdown list.
            */
            function () {
                this._onTriggerClicked();
            };
            wijinputcore.prototype.isDestroyed = /** Get a bool value indicates that whether the widget has been destroyed.
            */
            function () {
                return !this.outerDiv;
            };
            wijinputcore.prototype._destroy = function () {
                if(this.isDestroyed()) {
                    return;
                }
                this.wrapper = undefined;
                this.outerDiv = undefined;
                this._detachInputEvent();
                this.element.removeData('errorstate').removeData('breakSpinner').removeData('prevCursorPos').removeData('simulating').removeData('isPassword').removeClass(this.options.wijCSS.wijinputInput).removeAttr('role').removeAttr('aria-valuemin').removeAttr('aria-valuemax').removeAttr('aria-valuenow').removeAttr('aria-expanded');
                this.element.parent().replaceWith(this.element);
                this.element.parent().replaceWith(this.element);
                //$.effects.restore(this.element, ['width', 'height']);
                if($.effects && $.effects.restore) {
                    $.effects.restore(this.element, [
                        'width',
                        'height'
                    ]);
                } else if($.restore) {
                    $.restore(this.element, [
                        'width',
                        'height'
                    ]);
                }
            };
            wijinputcore.prototype.widget = /** Gets element this widget is associated.
            */
            function () {
                return this.outerDiv || this._super();
            };
            wijinputcore.prototype._getCulture = function (name) {
                if (typeof name === "undefined") { name = this.options.culture; }
                return Globalize.findClosestCulture(name || this.options.culture);
            };
            wijinputcore.prototype._addState = function (state, el) {
                if(el.is(':not(.ui-state-disabled)')) {
                    el.addClass(this.options.wijCSS.getState(state));
                }
            };
            wijinputcore.prototype._removeState = function (state, el) {
                el.removeClass(this.options.wijCSS.getState(state));
            };
            wijinputcore.prototype._isInitialized = function () {
                return !this.element.data('initializing');
            };
            wijinputcore.prototype._setData = function (val) {
                this.setText(val);
            };
            wijinputcore.prototype._resetData = function () {
            };
            wijinputcore.prototype._validateData = function () {
            };
            wijinputcore.prototype.getText = /** Gets the text displayed in the input box.
            */
            function () {
                if(!this._isInitialized()) {
                    return this.element.val();
                }
                return this._textProvider.toString(true, false, false);
            };
            wijinputcore.prototype.setText = /** Sets the text displayed in the input box.
            * @example
            * // This example sets text of a wijinputcore to "Hello"
            * $(".selector").wijinputcore("setText", "Hello");
            */
            function (value) {
                if(!this._isInitialized()) {
                    this.element.val(value);
                } else {
                    this._textProvider.setText(value);
                    this._updateText();
                }
            };
            wijinputcore.prototype.getPostValue = /** Gets the text value when the container form is posted back to server.
            */
            function () {
                if(!this._isInitialized()) {
                    return this.element.val();
                }
                return this._textProvider.toString(true, false, true);
            };
            wijinputcore.prototype.selectText = /** Selects a range of text in the widget.
            * @param {Number} start Start of the range.
            * @param {Number} end End of the range.
            * @example
            * // Select first two symbols in a wijinputcore
            * $(".selector").wijinputcore("selectText", 0, 2);
            */
            function (start, end) {
                if (typeof start === "undefined") { start = 0; }
                if (typeof end === "undefined") { end = this.getText().length; }
                if(isNaN(start)) {
                    start = 0;
                }
                if(isNaN(end)) {
                    end = 0;
                }
                if(Utility.IsFireFox4OrLater()) {
                    this.focus();
                }
                if(this.element.is(':disabled')) {
                    return;
                }
                this.element.wijtextselection(start, end);
            };
            wijinputcore.prototype.focus = /** Set the focus to the widget.
            */
            function () {
                if(this.element.is(':disabled')) {
                    return;
                }
                this.element.get(0).focus();
            };
            wijinputcore.prototype.isFocused = /** Determines whether the widget has the focus.
            */
            function () {
                if(!this.outerDiv) {
                    return false;
                }
                return this.outerDiv.hasClass(this.options.wijCSS.stateFocus);
            };
            wijinputcore.prototype._raiseTextChanged = function () {
                var txt = this.element.val(), preText = this.element.data('preText');
                if(!!this.element.data('initialized') && preText !== txt) {
                    this._trigger('textChanged', null, {
                        text: txt
                    });
                    this.element.data('changed', true);
                }
                this.element.data('preText', txt);
            };
            wijinputcore.prototype._raiseDataChanged = function () {
            };
            wijinputcore.prototype._allowEdit = function () {
                return !this.element.is(':disabled');
            };
            wijinputcore.prototype._updateText = function (keepSelection) {
                if (typeof keepSelection === "undefined") { keepSelection = false; }
                if(!this._isInitialized()) {
                    return;
                }
                // default is false
                keepSelection = !!keepSelection;
                var range;
                if(this.element.data('selectionbeforeblur') !== undefined) {
                    range = this.element.data('selectionbeforeblur');
                    this.element.removeData('selectionbeforeblur');
                } else {
                    range = this.element.wijtextselection();
                }
                var opt = this.options;
                if(this.isDeleteAll && this._showNullText()) {
                    this.isDeleteAll = false;
                    opt.date = null;
                    this.element.val(opt.nullText);
                } else {
                    this.element.val(this._textProvider.toString());
                    this.options.text = this._textProvider.toString(true, false, false);
                }
                if(this.element.is(':disabled')) {
                    return;
                }
                if(keepSelection) {
                    this.selectText(range.start, range.end);
                }
                this.element.data('prevCursorPos', range.start);
                this._raiseTextChanged();
                this._raiseDataChanged();
            };
            wijinputcore.prototype._trySetFocus = function () {
                if(document.activeElement !== this.element[0]) {
                    try  {
                        if(!this.options.disableUserInput) {
                            this.element.focus();
                        }
                    } catch (e) {
                    }
                }
            };
            wijinputcore.prototype._deleteSelText = function (backSpace) {
                if (typeof backSpace === "undefined") { backSpace = false; }
                if(!this._allowEdit()) {
                    return;
                }
                var selRange = this.element.wijtextselection();
                if(backSpace) {
                    if(selRange.end < 1) {
                        return;
                    }
                    if(selRange.end === selRange.start) {
                        selRange.start--;
                    }
                }
                selRange.end--;
                if(selRange.end < selRange.start) {
                    selRange.end = selRange.start;
                }
                var rh = new wijInputResult();
                this._textProvider.removeAt(selRange.start, selRange.end, rh);
                this._updateText();
                this.selectText(rh.testPosition, rh.testPosition);
            };
            wijinputcore.prototype._fireIvalidInputEvent = function (chr) {
                var _this = this;
                var invalidInputResult = this._trigger('invalidInput', null, {
                    widget: this,
                    // Novius OS : char without quote can't be minified by yui-compressor
                    'char': chr
                });
                if($.isFunction(this.options.invalidInput) && invalidInputResult === true) {
                    return;
                }
                if(!this.element.data('errorstate')) {
                    var cls = this.options.invalidClass || this.options.wijCSS.stateError;
                    this.element.data('errorstate', true);
                    window.setTimeout(function () {
                        if(_this.outerDiv) {
                            _this.outerDiv.removeClass(cls);
                        }
                        _this.element.data('errorstate', false);
                    }, 200);
                    this.outerDiv.addClass(cls);
                }
            };
            wijinputcore.prototype._onInput = function (e) {
                if(!this._isSimulating() || !this.element.data('ime') || this.element.data("isComposingIME")) {
                    if(this.element.data("isComposingIME")) {
                        this.element.data("simulationPending", true);
                    }
                    return;
                }
                this._simulate();
            };
            wijinputcore.prototype._keyDownPreview = function (e) {
                var key = e.keyCode || e.which;
                if(e.ctrlKey === true && key === 88) {
                    // Ctrl + X
                    return true;
                }
                if(e.ctrlKey === true && key === 90) {
                    // Ctrl + Z
                    return true;
                }
                return false;// true means handled.

            };
            wijinputcore.prototype._onDoubleByteCharacter = function () {
                var prev = this.element.data("lastDbsState");
                var curSel = this.element.wijtextselection();
                var curText = this.element.val();
                if(this.element.data("isComposingIME") && prev && prev.selection.start === curSel.start && prev.Text === curText) {
                    // nothing changed. The input must be accepted
                    this.element.removeData("lastDbsState");
                    this._onCompositionEnd();
                } else {
                    this.element.data("lastDbsState", {
                        selection: curSel,
                        text: curText
                    });
                    this._onCompositionStart();
                }
            };
            wijinputcore.prototype._onCompositionStart = function () {
                if(this.element.data("isComposingIME")) {
                    return;
                }
                this.element.data("isComposingIME", true);
                this._beforeSimulate(true);
            };
            wijinputcore.prototype._onCompositionEnd = function () {
                if(!this.element.data("isComposingIME")) {
                    return;
                }
                this.element.data("isComposingIME", false);
                if(this._isInitialized() && (!this._textProvider || !this._textProvider.noMask)) {
                    this._simulateIfPending();
                }
            };
            wijinputcore.prototype._simulateIfPending = function () {
                if(this.element.data("simulationPending") && this.element.data("lastSelection")) {
                    this._simulate();
                }
            };
            wijinputcore.prototype._beforeSimulate = function (ime) {
                if (typeof ime === "undefined") { ime = false; }
                if(!this.element.data('lastSelection')) {
                    this.element.data('lastSelection', this.element.wijtextselection());
                    this.element.data('lastValue', this.element.val());
                }
                this.element.data('ime', ime);
                this.element.data('simulating', true);
            };
            wijinputcore.prototype._isSimulating = function () {
                return this.element.data('simulating');
            };
            wijinputcore.prototype._simulate = function (text) {
                var self = this;
                var str = null;
                this.element.data("simulationPending", false);
                if(typeof text === "string") {
                    str = text;
                } else {
                    var range = this.element.wijtextselection();
                    var start = this.element.data('lastSelection').start;
                    var end = range.end;
                    if(end >= start) {
                        str = this.element.val().substring(start, end);
                    }
                }
                if(str) {
                    window.setTimeout(function () {
                        if(self._isLastValueNull()) {
                            return;
                        }
                        self.element.val(self.element.data('lastValue'));
                        var lastSel = self.element.data('lastSelection');
                        self.element.wijtextselection(lastSel);
                        self.element.data('batchKeyPress', true);
                        self.element.data('simulating', false);
                        var e = jQuery.Event('keypress');
                        e.ctrlKey = e.altKey = false;
                        for(var i = 0; i < str.length; i++) {
                            e.which = e.charCode = e.keyCode = str.charCodeAt(i);
                            self.element.data('nextChar', i === str.length - 1 ? "" : str.charAt(i + 1));
                            self._onKeyPress(e);
                            self.element.data("nextChar", "");
                            var appendChar = self.element.data("appendChar");
                            if(appendChar && appendChar.length > 0) {
                                self.element.data("appendChar", "");
                                e.which = e.charCode = e.keyCode = appendChar.charCodeAt(i);
                                self._onKeyPress(e);
                            }
                            if(self.element.data("skipNextChar")) {
                                i++;
                                self.element.data("skipNextChar", false);
                            }
                        }
                        self.element.data('batchKeyPress', false);
                        self._endSimulate();
                    }, 1);
                }
            };
            wijinputcore.prototype._isLastValueNull = function () {
                return !this.element.data('lastValue');
            };
            wijinputcore.prototype._endSimulate = function () {
                this._simulateIfPending();
                this.element.removeData('ime');
                this.element.removeData('lastSelection');
                this.element.removeData('lastValue');
            };
            wijinputcore.prototype._processKeyForDropDownList = function (e) {
                var k = this._getKeyCode(e);
                if(e.altKey && (k === jqKeyCode.UP || k === jqKeyCode.DOWN)) {
                    this._onTriggerClicked();
                    this._stopEvent(e);
                    return true;
                }
                if(k === jqKeyCode.ESCAPE) {
                    if(this._wasPopupShowing) {
                        this._hidePopup();
                        this._stopEvent(e);
                        return true;
                    }
                }
                if(this._wasPopupShowing && this._comboDiv !== undefined) {
                    if(k === jqKeyCode.DOWN) {
                        try  {
                            this._comboDiv.wijlist('next');
                        } catch (ee) {
                        }
                        this._stopEvent(e);
                        return true;
                    } else if(k === jqKeyCode.UP) {
                        try  {
                            this._comboDiv.wijlist('previous');
                        } catch (ee) {
                        }
                        this._stopEvent(e);
                        return true;
                    } else if(k === jqKeyCode.ENTER) {
                        this._comboDiv.wijlist('select');
                        this._stopEvent(e);
                        return true;
                    } else //else if (k === jqKeyCode.HOME) {
                    //     var listItems = this._comboDiv.wijlist("getList");
                    //     if (listItems.length > 0) {
                    //         this._comboDiv.wijlist('activate', null, listItems[0], true);
                    //     }
                    //     this._stopEvent(e);
                    //     return;
                    // }
                    // else if (k === jqKeyCode.END) {
                    //     var listItems = this._comboDiv.wijlist("getList");
                    //     if (listItems.length > 0) {
                    //         this._comboDiv.wijlist('activate', null, listItems[listItems.length - 1], true);
                    //     }
                    //     this._stopEvent(e);
                    //     return;
                    // }
                    if(k === jqKeyCode.PAGE_DOWN) {
                        try  {
                            this._comboDiv.wijlist('nextPage');
                        } catch (ee) {
                        }
                        this._stopEvent(e);
                        return true;
                    } else if(k === jqKeyCode.PAGE_UP) {
                        try  {
                            this._comboDiv.wijlist('previousPage');
                        } catch (ee) {
                        }
                        this._stopEvent(e);
                        return true;
                    }
                }
            };
            wijinputcore.prototype._processKeyOnNoMask = function (e) {
                var k = this._getKeyCode(e);
                if(k === jqKeyCode.Enter) {
                    this._onEnterDown(e);
                }
                if(k === jqKeyCode.LEFT || k === jqKeyCode.RIGHT) {
                    if(this._processLeftRightKey(k === jqKeyCode.LEFT)) {
                        this._stopEvent(e);
                        return;
                    }
                }
                this._processKeyForDropDownList(e);
            };
            wijinputcore.prototype._onKeyDown = function (e) {
                this.element.data('prevCursorPos', -1);
                this._deleteKeyDown = false;
                if(!this._isInitialized()) {
                    return;
                }
                if(this._textProvider && !!this._textProvider.noMask) {
                    this._processKeyOnNoMask(e);
                    return;
                }
                var k = this._getKeyCode(e);
                if(k === 229) {
                    // Double Bytes
                    this._onDoubleByteCharacter();
                    return;
                }
                this._onCompositionEnd();
                if(this.options.disableUserInput) {
                    if(k === jqKeyCode.TAB) {
                        if(this._processTabKey(e)) {
                            this._stopEvent(e);
                        }
                    } else {
                        this._stopEvent(e);
                    }
                    return;
                }
                if(this._keyDownPreview(e)) {
                    this._stopEvent(e);
                    return;
                }
                if(this._processKeyForDropDownList(e)) {
                    return;
                }
                switch(k) {
                    case jqKeyCode.UP:
                        this._doSpin(true, false);
                        this._stopEvent(e);
                        return;
                    case jqKeyCode.DOWN:
                        this._doSpin(false, false);
                        this._stopEvent(e);
                        return;
                    case jqKeyCode.LEFT:
                    case jqKeyCode.RIGHT:
                        if(this._processLeftRightKey(k === jqKeyCode.LEFT)) {
                            this._stopEvent(e);
                        }
                        return;
                    case jqKeyCode.TAB:
                        if(this._processTabKey(e)) {
                            this._stopEvent(e);
                        }
                        return;
                }
                if(e.ctrlKey) {
                    switch(k) {
                        case jqKeyCode.INSERT:
                        case 67:
                            // 'c'
                            return;
                        default:
                            break;
                    }
                }
                if(e.ctrlKey || e.altKey) {
                    return;
                }
                switch(k) {
                    case 112:
                        // F1-F6
                                            case 113:
                    case 114:
                    case 115:
                    case 116:
                    case 117:
                    case jqKeyCode.TAB:
                    case jqKeyCode.CAPSLOCK:
                    case jqKeyCode.END:
                    case jqKeyCode.HOME:
                    case jqKeyCode.CTRL:
                    case jqKeyCode.SHIFT:
                        return;
                    case jqKeyCode.BACKSPACE:
                        this._deleteSelText(true);
                        this._stopEvent(e);
                        return;
                    case jqKeyCode.DELETE:
                        this._deleteSelText(false);
                        this._stopEvent(e);
                        this._deleteKeyDown = true;
                        return;
                    case jqKeyCode.ENTER:
                        this._onEnterDown(e);
                        break;
                    case jqKeyCode.ESCAPE:
                        this._stopEvent(e);
                        window.setTimeout($.proxy(this._resetData, this), 1);
                        return;
                    case jqKeyCode.PAGE_UP:
                    case jqKeyCode.PAGE_DOWN:
                    case jqKeyCode.ALT:
                        this._stopEvent(e);
                        return;
                }
            };
            wijinputcore.prototype._onEnterDown = function (e) {
                if(this.options.hideEnter) {
                    this._stopEvent(e);
                }
            };
            wijinputcore.prototype._onKeyUp = function (e) {
                if(this._textProvider && !!this._textProvider.noMask) {
                    return;
                }
                var key = this._getKeyCode(e);
                if(this._isSimulating()) {
                    if(key === jqKeyCode.ENTER) {
                        this._onCompositionEnd();
                    }
                    return;
                }
                if(!this._isInitialized()) {
                    return;
                }
                if(key === jqKeyCode.ENTER || key === jqKeyCode.ESCAPE) {
                    return;
                }
                if(this.options.disableUserInput) {
                    this._raiseTextChanged();
                    this._raiseDataChanged();
                    return;
                }
                this._stopEvent(e);
            };
            wijinputcore.prototype._getKeyCode = function (e) {
                var userAgent = window.navigator.userAgent;
                if((userAgent.indexOf('iPod') !== -1 || userAgent.indexOf('iPhone') !== -1) && e.which === 127) {
                    return 8;
                }
                return e.keyCode || e.which;
            };
            wijinputcore.prototype._keyPressPreview = function (e) {
                return false;
            };
            wijinputcore.prototype._onKeyPress = function (e) {
                if(this._isSimulating() || (this._textProvider && !!this._textProvider.noMask)) {
                    return;
                }
                this.element.data('prevCursorPos', -1);
                if(this.options.disableUserInput) {
                    return;
                }
                if(!this._allowEdit()) {
                    return;
                }
                if(e.ctrlKey && e.keyCode === 119) {
                    //Ctrl + F8
                    this._onPaste(e);
                    return;
                }
                var key = e.keyCode || e.which;
                if(Utility.IsFireFox4OrLater()) {
                    switch(e.keyCode) {
                        case jqKeyCode.UP:
                        case jqKeyCode.DOWN:
                        case jqKeyCode.LEFT:
                        case jqKeyCode.RIGHT:
                        case jqKeyCode.HOME:
                        case jqKeyCode.END:
                            return;
                    }
                }
                switch(key) {
                    case 0:
                    case jqKeyCode.TAB:
                        //case jqKeyCode.UP:
                        //case jqKeyCode.DOWN:
                        //case jqKeyCode.LEFT:
                        //case jqKeyCode.RIGHT:
                        return;
                    case jqKeyCode.BACKSPACE:
                        this._stopEvent(e);
                        return;
                    case jqKeyCode.DELETE:
                        if(this._deleteKeyDown) {
                            this._stopEvent(e);
                            return;
                        }
                        break;
                    case jqKeyCode.ENTER:
                        if(this.options.hideEnter) {
                            this._stopEvent(e);
                        }
                        return;
                }
                if(e.ctrlKey || e.altKey) {
                    if(key !== jqKeyCode.SPACE) {
                        return;
                    }
                }
                if(this._keyPressPreview(e)) {
                    return;
                }
                var ch = String.fromCharCode(key);
                var rh = this._textProvider.replaceWith(this.element.wijtextselection(), ch);
                if(rh) {
                    this._updateText();
                    this.selectText(rh.testPosition + 1, rh.testPosition + 1);
                    this.element.data('prevCursorPos', rh.testPosition + 1);
                } else {
                    this._fireIvalidInputEvent(ch);
                }
                if(!this.element.data('batchKeyPress')) {
                    this._stopEvent(e);
                }
            };
            wijinputcore.prototype._isNullText = function (val) {
                val = val || this.element.val();
                return this._showNullText() && val === this.options.nullText;
            };
            wijinputcore.prototype._doFocus = function () {
                var selRange = this.element.wijtextselection();
                var sta = selRange.start;
                this._updateText();
                var s = this.element.val();
                if(s.length === sta) {
                    sta = 0;
                }
                if(!$.browser.safari) {
                    this.selectText(sta, sta);
                }
            };
            wijinputcore.prototype._afterFocused = function () {
                if(this._isNullText()) {
                    this._doFocus();
                }
            };
            wijinputcore.prototype._onFocus = function (e) {
                if(this.options.disableUserInput) {
                    return;
                }
                this._addState('focus', this.outerDiv);
                if(!this.element.data('breakSpinner')) {
                    return;
                }
                if(!this._isInitialized()) {
                    return;
                }
                if(!this._allowEdit()) {
                    return;
                }
                if(!this.element.data('focusNotCalledFirstTime')) {
                    this.element.data('focusNotCalledFirstTime', new Date().getTime());
                }
                this._afterFocused();
            };
            wijinputcore.prototype._onBeforeDeactivate = function (e) {
                if(this.options.disableUserInput) {
                    return;
                }
                if(!this.element.data('breakSpinner')) {
                    return;
                }
                if(!this._isInitialized()) {
                    return;
                }
                if(!this._allowEdit()) {
                    return;
                }
                this.element.data('selectionbeforeblur', this.element.wijtextselection());
            };
            wijinputcore.prototype._onBlur = function (e) {
                if(this.options.disableUserInput) {
                    return;
                }
                this._onCompositionEnd();
                if(this._isComboListVisible()) {
                    return;
                }
                var isFocused = this.isFocused();
                this._removeState('focus', this.outerDiv);
                if(!this.element.data('breakSpinner')) {
                    this.element.get(0).focus();
                    var curPos = this.element.data('prevCursorPos');
                    if(curPos !== undefined && curPos !== -1) {
                        this.selectText(curPos, curPos);
                    }
                    return;
                }
                if(!this._isInitialized() || !isFocused) {
                    return;
                }
                this.element.data('value', this.element.val());
                this._updateTextOnLostFocus();
            };
            wijinputcore.prototype._updateTextOnLostFocus = function () {
                var _this = this;
                window.setTimeout(function () {
                    _this._onChange();
                    _this._updateText();
                    _this._validateData();
                    if(_this.element.data('changed')) {
                        _this.element.data('changed', false);
                        if(!_this._popupVisible()) {
                            _this._trigger('change');
                            _this.element.change();
                        }
                    }
                }, 100);
            };
            wijinputcore.prototype._popupVisible = function () {
                return this._wasPopupShowing;
            };
            wijinputcore.prototype._onMouseDown = function (e) {
                if(!this._isInitialized()) {
                    return;
                }
                if(this.element.is(':disabled')) {
                    return;
                }
                if(Utility.IsMouseDownOnClearButton(e)) {
                    var isFocused = false;
                    try  {
                        isFocused = document.activeElement === e.target;
                    } catch (ee) {
                    }
                    this.element.data("focusedWhenMouseDown", isFocused);
                    this.element.data('mouseDownOnClearButton', true);
                    return;
                }
            };
            wijinputcore.prototype._onMouseUp = function (e) {
                if(!this._isInitialized()) {
                    return;
                }
                if(this.element.is(':disabled')) {
                    return;
                }
                if(Utility.IsMouseDownOnClearButton(e) && this.element.data('mouseDownOnClearButton') && this.element.data('focusedWhenMouseDown') === true) {
                    if(!this.options.disableUserInput) {
                        var self = this;
                        setTimeout(function () {
                            self._processClearButton();
                        }, 0);
                    }
                    this.element.data('mouseDownOnClearButton', false);
                    return;
                }
                this.element.data('mouseDownOnClearButton', false);
                this.element.data('focusedWhenMouseDown', false);
                var selRange = this.element.wijtextselection();
                this.element.data('prevCursorPos', selRange.start);
                // fixed an issue of IE10(browser mode IE9), when runs in this mode,
                // the input element will show clear button at the right side of the input element.
                // click the button, the widget's text value will not cleared.
                if(this.element.val() == '') {
                    return;
                }
                var self = this;
                // Wait for it....
                setTimeout(function () {
                    if(self.element.val() == '') {
                        self.setText("");
                    }
                }, 5);
            };
            wijinputcore.prototype._onChange = function () {
                if(!this.element) {
                    return;
                }
                var val = this.element.val();
                var txt = this.getText();
                if(txt !== val) {
                    this.setText(val);
                }
            };
            wijinputcore.prototype._onPaste = function (e) {
                if(this._textProvider && !!this._textProvider.noMask) {
                    return;
                }
                this._beforeSimulate();
                var self = this;
                window.setTimeout(function () {
                    self._simulate();
                }, 1);
            };
            wijinputcore.prototype._onDrop = function (e) {
                this._beforeSimulate();
                if(e.originalEvent && e.originalEvent.dataTransfer) {
                    var text = e.originalEvent.dataTransfer.getData('Text');
                    if(text) {
                        this._simulate(text);
                    }
                }
            };
            wijinputcore.prototype._stopEvent = function (e) {
                e.stopPropagation();
                e.preventDefault();
            };
            wijinputcore.prototype._calcSpinInterval = function () {
                this._repeatingCount++;
                if(this._repeatingCount > 10) {
                    return 50;
                } else if(this._repeatingCount > 4) {
                    return 100;
                } else if(this._repeatingCount > 2) {
                    return 200;
                }
                return 400;
            };
            wijinputcore.prototype._doSpin = function (up, repeating) {
                return false;
            };
            wijinputcore.prototype._stopSpin = function () {
                this.element.data('breakSpinner', true);
                this._repeatingCount = 0;
                var spintimer = this.element.data("spintimer");
                if(spintimer) {
                    clearTimeout(spintimer);
                    this.element.data("spintimer", undefined);
                }
            };
            wijinputcore.prototype._hasComboItems = function () {
                return !!this._getcomboItems() && this._getcomboItems().length;
            };
            wijinputcore.prototype._getcomboItems = function () {
                if(!!this.options.comboItems && this.options.comboItems.length > 0) {
                    return this.options.comboItems;
                }
                return this.options.pickers.list;
            };
            wijinputcore.prototype._getcomboWidth = function () {
                return this.options.comboWidth || this.options.pickers.width;
            };
            wijinputcore.prototype._getcomboHeight = function () {
                return this.options.comboHeight || this.options.pickers.height;
            };
            wijinputcore.prototype._isComboListVisible = function () {
                if(!this._comboDiv) {
                    return false;
                }
                return this._comboDiv.wijpopup('isVisible');
            };
            wijinputcore.prototype._createComboDiv = function () {
                var _this = this;
                if(this._comboDiv === undefined) {
                    this._comboDiv = $("<div></div>").appendTo(document.body).css('position', 'absolute');
                    var content = this._normalize(this._getcomboItems());
                    this._comboDiv.wijlist({
                        maxItemsCount: 5,
                        selected: function (event, ui) {
                            if(!_this.options.disableUserInput) {
                                _this._setData(ui.item.value);
                            }
                            _this._comboDiv.wijpopup('hide');
                            _this._trySetFocus();
                        }
                    });
                    this._comboDiv.wijlist('setItems', content);
                    this._comboDiv.wijlist('renderList');
                }
            };
            wijinputcore.prototype._popupComboList = function () {
                var _this = this;
                if(!this._hasComboItems()) {
                    return false;
                }
                if(!this._allowEdit()) {
                    return false;
                }
                this._createComboDiv();
                // dimensions
                this._comboDiv.width(this.outerDiv.width());
                this._comboDiv.wijlist("option", "autoSize", !this._getcomboHeight());
                if(this._getcomboHeight()) {
                    this._comboDiv.height(this._getcomboHeight());
                }
                if(this._getcomboWidth() && parseInt(this._getcomboWidth()) !== this._comboDiv.width()) {
                    this._comboDiv.wijlist("destroy");
                    this._comboDiv.remove();
                    delete this._comboDiv;
                    this._createComboDiv();
                    this._comboDiv.width(this._getcomboWidth());
                    this._comboDiv.wijlist("option", "autoSize", !this._getcomboHeight());
                    if(this._getcomboHeight()) {
                        this._comboDiv.height(this._getcomboHeight());
                    }
                }
                this._comboDiv.wijlist("refreshSuperPanel");
                this._comboDiv.wijpopup({
                    autoHide: true,
                    hidden: function () {
                        _this._trigger('dropDownClose');
                        _this._wasPopupShowing = false;
                        _this._comboDiv.wijlist("unselectItems");
                        _this._comboDiv.wijlist("deactivate");
                    },
                    shown: function () {
                        _this._trigger('dropDownOpen');
                        _this._wasPopupShowing = true;
                    }
                });
                this.outerDiv.attr('aria-expanded', true);
                this._comboDiv.wijpopup('show', {
                    of: this.outerDiv,
                    offset: '0 4',
                    hidden: function () {
                        _this.outerDiv.attr('aria-expanded', false);
                    }
                });
                return true;
            };
            wijinputcore.prototype._normalize = function (items) {
                // assume all items have the right format when the first item is complete
                if(items.length && items[0].label && items[0].value) {
                    return items;
                }
                return $.map(items, function (item) {
                    if(typeof item === "string") {
                        return {
                            label: item,
                            value: item
                        };
                    }
                    return $.extend({
                        label: item.label || item.value,
                        value: item.value || item.label
                    }, item);
                });
            };
            wijinputcore.prototype._processLeftRightKey = function (isLeft) {
                return false;
            };
            wijinputcore.prototype._processTabKey = function (e) {
                return false;
            };
            wijinputcore.prototype._moveControl = function (currentElement, isForward, isUseLeftRightKey) {
                var elements = Utility.GetElements();
                var ret = null;
                var retInfo = {
                };
                if(elements.length < 2) {
                    return null;
                }
                var nextElement = Utility.GetNextFocusableControl(currentElement, elements, isForward);
                setTimeout(function () {
                    Utility.SetElementFocus(nextElement);
                }, 0);
            };
            wijinputcore.prototype._processClearButton = function () {
            };
            return wijinputcore;
        })(wijmo.wijmoWidget);
        input.wijinputcore = wijinputcore;
        ;
        var wijinputClass = "wijmo-wijinput", classPrefix = wijinputClass + "-";
        var wijinputcore_options = (function () {
            function wijinputcore_options() {
                this.wijCSS = {
                    wijinput: wijinputClass,
                    wijinputInput: classPrefix + "input",
                    wijinputWrapper: classPrefix + "wrapper",
                    wijinputWrapperSpinnerLeft: classPrefix + "wrapper-spinner-left",
                    wijinputWrapperSpinnerRight: classPrefix + "wrapper-spinner-right",
                    wijinputTrigger: classPrefix + "trigger",
                    wijinputSpinnerLeft: classPrefix + "spinner-left",
                    wijinputSpinnerRight: classPrefix + "spinner-right",
                    wijinputButton: classPrefix + "button",
                    wijinputSpin: classPrefix + "spin",
                    wijinputSpinUp: classPrefix + "spinup",
                    wijinputSpinDown: classPrefix + "spindown",
                    iconPlus: "ui-icon-plus",
                    iconMinus: "ui-icon-minus"
                };
                /** Determines the input method setting of widget.
                * Possible values are: 'auto', 'active', 'inactive', 'disabled'
                * @remarks
                * This property only take effect on IE browser.
                */
                this.imeMode = "";
                /** Determines the culture used to show values in the wijinputdate widget.
                */
                this.culture = '';
                /** The CSS class applied to the widget when an invalid value is entered.
                * @remarks
                * For some property of the css, such as the color, because wijmo has set default style,
                * and it may be has a higher priority, so custom need to user a higher priority than the defualt.
                * @example
                * // This example sets the invalidClass option to "invalid".
                * .wijmo-wijinput.invalid {
                * color: red !important;
                * background-color: green !important;
                * font-size: xx-large;
                * }
                * $(".selector").wijinputcore("option", "invalidClass" "invalid");
                */
                this.invalidClass = $.wijmo.wijCSS.stateError;
                /** Determines the text displayed when the widget is blank and contains no initial text.
                * Obsoleted, use placeholder instead.
                * @ignore
                */
                this.nullText = undefined;
                /** Determines the text displayed when the widget is blank and contains no initial text.
                */
                this.placeholder = undefined;
                /** Shows the nullText value if the widget is blank and loses focus.
                * Obsoleted, when placeholder proerty has value, it will show the placeholder value, else not.
                * @ignore
                */
                this.showNullText = false;
                /** If true, then the browser response is disabled when the ENTER key is pressed.
                */
                this.hideEnter = false;
                /** Determines whether a user can enter a value in the wijinputdate widget.
                * Obsoleted, use readonly instead.
                * @ignore
                */
                this.disableUserInput = false;
                /** Determines whether a user can enter a value in the wijinput widget.
                * If readonly is true, user can't input value to the wijinput widget.
                */
                this.readonly = false;
                /** Determines the side, left or right, where the trigger or spinner buttons appear.
                * Possible values are: 'left', 'right'
                * Obsoleted, Use dropdownButtonAlign instead.
                * @ignore
                */
                this.buttonAlign = null;
                /** Determines the side, left or right, where the dropdown button appear.
                * Possible values are: 'left', 'right'
                */
                this.dropDownButtonAlign = 'right';
                /** Determines whether dropdown button is displayed.
                */
                this.showDropDownButton = false;
                /** Determines whether trigger button is displayed.
                * Obsoleted, use showDropDownButton instead.
                * @ignore
                */
                this.showTrigger = undefined;
                /** Determines whether spinner button is displayed.
                */
                this.showSpinner = false;
                /** Array of data items used to populate the drop-down list.
                * Obsoleted, use picker.list instead.
                * @ignore
                */
                this.comboItems = undefined;
                /** Determines the width of the drop-down list.
                * Obsoleted, use picker.width instead.
                * @ignore
                */
                this.comboWidth = undefined;
                /** Determines the height of the drop-down list.
                * Obsoleted, use picker.height instead.
                * @ignore
                */
                this.comboHeight = undefined;
                /** Determines whether the focus automatically moves to the next or previous
                * tab ordering control when pressing the left, right arrow keys.
                * Possible values are "none", "left", "right", "both".
                * The default value is "none".
                */
                this.blurOnLeftRightKey = "none";
                /** Determines the side, left or right, where the spinner button appear.
                * Possible values are: 'vertialLeft', 'verticalRight', 'horizontalDownLeft', 'horizontalUpLeft'.
                * The default value is 'verticalRight'.
                */
                this.spinnerAlign = "verticalRight";
                /** Determines whether the spin behavior can wrap when reaching a maximum or minimum limit.
                */
                this.allowSpinLoop = false;
                /** An object contains the settings for the dropdown list.
                * @example
                *  $(".selector").wijinputmask({
                *      pickers: {
                *          list: [
                *              { label: 'item1', value: 1 },
                *              { label: 'item2', value: 2 }
                *          ],
                *          width: 100,
                *          height: 130
                *      }
                *  });
                */
                this.pickers = {
                    list: undefined,
                    width: undefined,
                    height: undefined
                };
                /** The dropdownOpen event handler.
                * A function called before the widget's dropdown opened.
                * @event
                */
                this.dropDownOpen = null;
                /** The dropdownClose event handler.
                * A function called before the widget's dropdown closed.
                * @event
                */
                this.dropDownClose = null;
                /** The initializing event handler.
                * A function called before the widget is initialized.
                * @event
                */
                this.initializing = null;
                /** The initialized event handler.
                * A function called after the widget is initialized.
                * @event
                */
                this.initialized = null;
                /** The triggerMouseDown event handler. A function called
                * when the mouse is pressed down on the trigger button.
                * Obsoleted, use dropDownButtonMouseDown instead.
                * @ignore
                * @event
                */
                this.triggerMouseDown = null;
                /** The triggerMouseUp event handler. A function called
                * when the mouse is released on the trigger button.
                * Obsoleted, use dropDownButtonMouseUp instead.
                * @ignore
                * @event
                */
                this.triggerMouseUp = null;
                /** The dropdownButtonMouseDown event handler. A function called
                * when the mouse is pressed down on the dropdown button.
                * @event
                */
                this.dropDownButtonMouseDown = null;
                /** The dropdownButtonMouseUp event handler. A function called
                * when the mouse is released on the dropdown button.
                * @event
                */
                this.dropDownButtonMouseUp = null;
                /** Fired when the widget text is changed.
                * @event
                * @dataKey {String} text The new text.
                */
                this.textChanged = null;
                /** The invalidInput event handler. A function called
                * when invalid charactor is typed.
                * @event
                * @dataKey {String} char The newly input character.
                * @dataKey widget The widget object itself.
                */
                this.invalidInput = null;
            }
            return wijinputcore_options;
        })();
        wijinputcore.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijinputcore_options());
        var wijInputResult = (function () {
            function wijInputResult() {
                this.characterEscaped = 1;
                this.noEffect = 2;
                this.sideEffect = 3;
                this.success = 4;
                this.unknown = 0;
                this.hint = 0;
                this.alphanumericCharacterExpected = -2;
                this.asciiCharacterExpected = -1;
                this.digitExpected = -3;
                this.invalidInput = -51;
                this.letterExpected = -4;
                this.nonEditPosition = -54;
                this.positionOutOfRange = -55;
                this.promptCharNotAllowed = -52;
                this.signedDigitExpected = -5;
                this.unavailableEditPosition = -53;
                this.testPosition = -1;
                this.binaryExpected = -6;
            }
            wijInputResult.prototype.clone = function () {
                var rh = new wijInputResult();
                rh.hint = this.hint;
                rh.testPosition = this.testPosition;
                return rh;
            };
            return wijInputResult;
        })();
        input.wijInputResult = wijInputResult;
        var wijTextProvider = (function () {
            function wijTextProvider() { }
            wijTextProvider.prototype.setText = function (value, rh) {
            };
            wijTextProvider.prototype.toString = function (ignorePasswordChar, includePrompt, includeLiterals, start, length) {
                return "";
            };
            // Novius OS cahr is a reserved word
            wijTextProvider.prototype.insertAt = function (character, index, rh) {
                return false;
            };
            wijTextProvider.prototype.removeAt = function (start, end, rh, skipCheck) {
            };
            wijTextProvider.prototype.replaceWith = function (range, text) {
                var index = range.start;
                var result = new wijInputResult();
                if(range.start < range.end) {
                    this.removeAt(range.start, range.end - 1, result, true);
                    index = result.testPosition;
                }
                return this.insertAt(text, index, result) ? result : null;
            };
            return wijTextProvider;
        })();
        input.wijTextProvider = wijTextProvider;
        var Utility = (function () {
            function Utility() { }
            Utility.IdCounter = 0;
            Utility.EditFieldSuffix = "_EidtField";
            Utility.MaskValChar = "\ufeff";
            Utility.Hold = "g-C2";
            Utility.FireEvent = //static FireEvent(oControl, eventHandler, eArgs: any, eventName: string) {
            //    oControl.owner._trigger(eventName, null, eArgs);
            //}
            function FireEvent(oControl, eventHandler, eArgs, eventName) {
                if(!eventHandler) {
                    return false;
                }
                try  {
                    // DaryLuo 2012/10/29 fix bug 837 in IM Web 7.0.
                    eventHandler.call(window, oControl, eArgs);
                } catch (ex) {
                    return false;
                }
                return true;
            };
            Utility.FindIMControl = function FindIMControl(id) {
            };
            Utility.ArrayIndexOf = function ArrayIndexOf(array, obj) {
                if(array.indeOf) {
                    return array.indexOf(obj);
                } else {
                    for(var i = 0; i < array.length; i++) {
                        if(array[i] === obj) {
                            return i;
                        }
                    }
                }
                return -1;
            };
            Utility.AttachEvent = function AttachEvent(element, type, handler, useCapture) {
                if(element !== null && element !== undefined) {
                    if(element.addEventListener) {
                        element.addEventListener(type, handler, useCapture);
                    } else if(element.attachEvent) {
                        element.attachEvent("on" + type, handler);
                    }
                }
            };
            Utility.AttachFocusEventOfDocument = function AttachFocusEventOfDocument() {
                if(Utility.IsIE8OrBelow()) {
                    Utility.AttachEvent(document, "beforeactivate", function (evt) {
                        Utility.FocusControlUpdate(evt);
                    }, true);
                } else {
                    Utility.AttachEvent(document, "focus", function (evt) {
                        Utility.FocusControlUpdate(evt);
                    }, true);
                }
            };
            Utility.FocusControlUpdate = function FocusControlUpdate(evt) {
                Utility.PreviousFocusControl = Utility.FocusControl;
                Utility.FocusControl = evt.target || evt.srcElement;
            };
            Utility.ToString = function ToString(value, length, ch, position) {
                var val = value + "";
                //It is same as String.PadLeft(int, char) in C#.
                if(ch != null) {
                    while(val.length < length) {
                        if(position) {
                            val = val + ch;
                        } else {
                            val = ch + val;
                        }
                    }
                    return val;
                }
                //add the value length times.
                while(val.length < length) {
                    val += value + "";
                }
                return val;
            };
            Utility.GetSelectionEndPosition = //Added by Jeff Wu. For CursorPosition Test
            function GetSelectionEndPosition(obj) {
                // Add comments by Yang
                // For test firefox
                if(!Utility.IsIE() || Utility.IsIE11OrLater()) {
                    //Commented by Kevin, Feb 17, 2009
                    //bug#1890
                    //return obj.selectionEnd;
                    var endS = 0;
                    endS = obj.selectionEnd;
                    if(obj.value) {
                        var text = obj.value.substring(0, endS);
                        endS = text.GetLength();
                    }
                    //Commented by Kevin, Feb 18, 2009
                    //bug#1894
                    var startS = 0;
                    startS = obj.selectionStart;
                    if(obj.value) {
                        var text = obj.value.substring(0, startS);
                        startS = text.GetLength();
                    }
                    if(startS > endS) {
                        endS = startS;
                    }
                    //end by Kevin
                    return endS;
                    //end by Kevin
                                    }
                // End by Yang
                return Utility.GetSelectionStartPosition(obj) + document.selection.createRange().text.GetLength();
            };
            Utility.GetSelectionStartPosition = function GetSelectionStartPosition(obj) {
                if(obj.selectionStart != null) {
                    var startS = 0;
                    startS = obj.selectionStart;
                    if(obj.value) {
                        var text = obj.value.substring(0, startS);
                        startS = text.GetLength();
                    }
                    var endS = 0;
                    endS = obj.selectionEnd;
                    if(obj.value) {
                        var text = obj.value.substring(0, endS);
                        endS = text.GetLength();
                    }
                    if(endS < startS) {
                        startS = endS;
                    }
                    return startS;
                }
                try  {
                    var rng = obj.createTextRange();
                    var sng = document.selection.createRange();
                    var length = obj.value.GetLength();
                    var start = 0;
                    var end = length;
                    var i = 0;
                    while(start < end) {
                        i = Math.floor((start + end) / 2);
                        rng = obj.createTextRange();
                        var s = i;
                        var text = obj.value.Substring(0, i);
                        while(1) {
                            var index = text.IndexOf("\r\n");
                            if(index != -1) {
                                s--;
                                text = text.Substring(index + 2, text.GetLength());
                            } else {
                                break;
                            }
                        }
                        var gap = i - s;
                        s = i - gap;
                        rng.moveStart("character", s);
                        if(rng.offsetTop > sng.offsetTop) {
                            end = i;
                        } else if(rng.offsetTop < sng.offsetTop) {
                            if(start == i) {
                                return end;
                            }
                            start = i;
                        } else if(rng.offsetLeft > sng.offsetLeft) {
                            end = i;
                        } else if(rng.offsetLeft < sng.offsetLeft) {
                            if(start == i) {
                                return end;
                            }
                            start = i;
                        } else {
                            if(obj.value.Substring(i - 1, i) == "\r") {
                                i++;
                            }
                            return i;
                        }
                    }
                    return length;
                } catch (e) {
                    return 0;
                }
            };
            Utility.GetCursorPosition = function GetCursorPosition(obj, isPropertyChange) {
                if(obj == null) {
                    return -1;
                }
                // Add comments by Yang
                // For test firefox
                if(!Utility.IsIE() || Utility.IsIE11OrLater()) {
                    //Commented by Kevin, Feb 17, 2009
                    //bug#1890
                    //return obj.selectionStart;
                    var startS = 0;
                    startS = obj.selectionStart;
                    if(obj.value) {
                        var text = obj.value.substring(0, startS);
                        startS = text.GetLength();
                    }
                    return startS;
                    //end by Kevin
                                    }
                // End by Yang
                // Frank Liu fixed bug 629 at 2013/06/20.
                var caretPos = 0;// IE Support

                if(document.selection) {
                    obj.focus();
                    var sel = document.selection.createRange();
                    sel.moveStart('character', -obj.value.length);
                    caretPos = sel.text.length;
                }
                return (caretPos);
            };
            Utility.GetPasteData = function GetPasteData(useClipboard) {
                // Add comments by Yang
                // For test firefox
                return Utility.GetDataFromClipboard(useClipboard);
            };
            Utility.GetDataFromClipboard = function GetDataFromClipboard(useClipboard) {
                if(useClipboard == false) {
                    return Utility.SavedText;
                }
                if(window.clipboardData) {
                    return (window.clipboardData.getData('Text'));
                } else if(Utility.CutCopyPasteEventObject !== null) {
                    if(Utility.CutCopyPasteEventObject.clipboardData !== undefined) {
                        return Utility.CutCopyPasteEventObject.clipboardData.getData("text");
                    }
                }
                //else if (window.netscape) {
                //    try {
                //        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
                //        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
                //        if (!clip) {
                //            return;
                //        }
                //        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
                //        if (!trans) {
                //            return;
                //        }
                //        trans.addDataFlavor('text/unicode');
                //        clip.getData(trans, clip.kGlobalClipboard);
                //        var str = new Object();
                //        var len = new Object();
                //        try {
                //            trans.getTransferData('text/unicode', str, len);
                //        }
                //        catch (error) {
                //            return null;
                //        }
                //        if (str) {
                //            if (Components.interfaces.nsISupportsWString) {
                //                str = str.value.QueryInterface(Components.interfaces.nsISupportsWString);
                //            }
                //            else if (Components.interfaces.nsISupportsString) {
                //                str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
                //            }
                //            else {
                //                str = null;
                //            }
                //        }
                //        if (str) {
                //            return (str.data.substring(0, len.value / 2));
                //        }
                //    }
                //    catch (e) {
                //        window.status = "about:config signed.applets.codebase_principal_support true";
                //    }
                //}
                return null;
            };
            Utility.ClearSelection = function ClearSelection(inputElement) {
                if(Utility.IsIE() && !Utility.IsIE11OrLater()) {
                    if(document.selection.createRange().text != "") {
                        document.selection.empty();
                    }
                } else {
                    if(Utility.GetSelectionText(inputElement) != "") {
                        inputElement.selectionStart = inputElement.value.length;
                        inputElement.selectionEnd = inputElement.selectionStart;
                    }
                }
            };
            Utility.GetSelectionText = function GetSelectionText(obj) {
                if(obj.selectionStart != null) {
                    return obj.value.substring(obj.selectionStart, obj.selectionEnd);
                } else if(document.selection != null) {
                    return document.selection.createRange().text;
                } else if(document.activeElement !== null) {
                    var obj = document.activeElement;
                    //var start = Math.Min(document.activeElement.selectionStart,document.activeElement.selectionEnd);
                    //var end = Math.Max(document.activeElement.selectionStart,document.activeElement.selectionEnd);
                    var start = obj.selectionStart;
                    var end = obj.selectionEnd;
                    return obj.value.substring(start, end);
                }
                return "";
            };
            Utility.GetNextFocusableControl = function GetNextFocusableControl(currentElement, elements, isForward) {
                var index = 0;
                for(var i = 0; i < elements.length; i++) {
                    if(currentElement === elements[i]) {
                        if(isForward) {
                            index = (i + 1) % (elements.length);
                        } else {
                            index = (i - 1 + elements.length) % (elements.length);
                        }
                        break;
                    }
                }
                return elements[index];
            };
            Utility.FireSystemEvent = function FireSystemEvent(obj, eventName) {
                if(Utility.IsIE()) {
                    obj.fireEvent(eventName);
                } else {
                    var evt = document.createEvent('HTMLEvents');
                    //We must remove the eventName's first two characters "on". For example,
                    //we should remove the "onchange" to "change".
                    evt.initEvent(eventName.substring(2, eventName.length), true, true);
                    obj.dispatchEvent(evt);
                }
            };
            Utility.GetTextBoxScrollWidth = function GetTextBoxScrollWidth(input, unuse) {
                return Utility.MeasureText(input.value, input).Width;
            };
            Utility.MoveFocus = function MoveFocus(curID, isForward) {
                var elements = Utility.GetElements();
                var nextID = Utility.GetNextFocusableControl(curID, elements, isForward);
                Utility.SetElementFocus(nextID);
                return nextID;
            };
            Utility.SetElementFocus = function SetElementFocus(element) {
                element.focus();
            };
            Utility.GetAllElements = function GetAllElements() {
                if(document.body.querySelectorAll) {
                    return document.body.querySelectorAll("button, input, object, select, textarea");
                }
                if(document.body.all) {
                    return document.body.all;
                }
                return document.body.getElementsByTagName("*");
            };
            Utility.GetElements = function GetElements() {
                var elements = [];
                var obj = Utility.GetAllElements();
                var index = 0;
                var rfocusable = /^(?:button|input|object|select|textarea)$/i;
                for(var i = 0; i < obj.length; i++) {
                    if((!document.body.querySelectorAll || Utility.IsIE()) && !rfocusable.test(obj[i].tagName.toLowerCase())) {
                        continue;
                    }
                    var c3 = !obj[i].disabled;
                    var c4 = obj[i].style.visibility !== "hidden";
                    var c5 = obj[i].type != "hidden" && obj[i].tabIndex != -1;
                    var c6 = obj[i].tagName.toLowerCase() == "textarea" && obj[i].tabIndex != -1;
                    var c7 = c5 || c6;
                    if(c3 && c4 && c7) {
                        //var element = { ID: "", TabIndex: 0 };
                        //if (obj[i].id == null || obj[i].id == "") {
                        //    obj[i].id = "GCTempID" + i.toString();
                        //}
                        //element.ID = obj[i].id;
                        //element.TabIndex = obj[i].tabIndex;
                        elements[index++] = obj[i];
                    }
                }
                for(var i = 0; i < elements.length - 1; i++) {
                    for(var j = i + 1; j < elements.length; j++) {
                        if(elements[j].tabIndex < elements[i].tabIndex) {
                            var temp = elements[i];
                            elements[i] = elements[j];
                            elements[j] = temp;
                        }
                    }
                }
                return elements;
            };
            Utility.CheckInt = function CheckInt(value, min, max) {
                var intValue = parseInt(value);
                if(isNaN(intValue)) {
                    throw "value is invalid";
                }
                if(intValue < min || intValue > max) {
                    throw value + " is out of range, should between " + min + " and " + max;
                }
                return intValue;
            };
            Utility.CheckFloat = function CheckFloat(value, min, max) {
                var intValue = parseFloat(value);
                if(isNaN(intValue)) {
                    throw "value is invalid";
                }
                if(value < min || value > max) {
                    throw value + " is out of range, should between " + min + " and " + max;
                }
                return intValue;
            };
            Utility.CheckDate = function CheckDate(value, min, max) {
                if(!(value instanceof Date)) {
                    throw "Type is invalid";
                }
                if(isNaN(value)) {
                    throw "Date is a invalid date";
                }
                if(max != undefined) {
                    if(value < min || value > max) {
                        throw value + " is out of range, should between " + min + " and " + max;
                    }
                }
            };
            Utility.CheckBool = function CheckBool(boolValue) {
                if(typeof (boolValue) === "string") {
                    if(boolValue.toLowerCase() === "true") {
                        return true;
                    }
                }
                return boolValue == true;
            };
            Utility.CheckFunction = function CheckFunction(fun) {
                if(fun === undefined || fun === null) {
                    return null;
                }
                if(typeof fun == "string") {
                    fun = Utility.Trim(fun);
                    if(fun.length == 0) {
                        return null;
                    }
                    try  {
                        eval("fun =" + fun);
                    } catch (e) {
                    }
                }
                if(typeof fun == "function") {
                    return fun;
                } else {
                    throw "The value is not a valid function";
                }
            };
            Utility.GetCheckElement = function GetCheckElement() {
                if(Utility.CheckElement == null) {
                    var div = document.createElement("div");
                    Utility.CheckElement = div;
                    div.style.display = "none";
                }
                return Utility.CheckElement;
            };
            Utility.CheckString = function CheckString(str) {
                if(str === undefined || (typeof (str) != "string" && !(str instanceof String))) {
                    throw str + " type is not a string.";
                }
                if(str == null) {
                    str = "";
                }
                return str.toString();
            };
            Utility.GetCSSLength = function GetCSSLength(length) {
                var intValue = parseInt(length);
                if(isNaN(intValue)) {
                    return 0;
                }
                return intValue;
            };
            Utility.CheckCSSLength = function CheckCSSLength(length) {
                length = Utility.CheckInt(length, 0, Math.pow(2, 31));
                if(parseInt(length) == length) {
                    length += "px";
                }
                Utility.GetCheckElement().style.width = "";
                Utility.GetCheckElement().style.width = length;
                return Utility.GetCheckElement().style.width;
            };
            Utility.CheckFontSizeValue = function CheckFontSizeValue(length) {
                if(parseInt(length) == length) {
                    length += "px";
                }
                Utility.GetCheckElement().style.fontSize = "";
                Utility.GetCheckElement().style.fontSize = length;
                return Utility.GetCheckElement().style.fontSize;
            };
            Utility.CheckColor = function CheckColor(color) {
                Utility.GetCheckElement().style.backgroundColor = "";
                Utility.GetCheckElement().style.backgroundColor = color;
                return Utility.GetCheckElement().style.backgroundColor;
            };
            Utility.CheckImageUrl = function CheckImageUrl(url) {
                return Utility.CheckString(url);
            };
            Utility.GetCssImageUrl = function GetCssImageUrl(url) {
                if(url.startWith("url(\"")) {
                    //IE
                    url = url.substring(5, url.length - 2);
                } else if(url.startWith("url(")) {
                    //Chrome, FF
                    url = url.substring(4, url.length - 1);
                }
                return url;
            };
            Utility.CheckCssImageUrl = function CheckCssImageUrl(url) {
                if(url.length > 0 && !url.startWith("url(")) {
                    url = "url(" + url + ")";
                }
                Utility.GetCheckElement().style.backgroundImage = "";
                Utility.GetCheckElement().style.backgroundImage = url;
                return Utility.GetCheckElement().style.backgroundImage;
            };
            Utility.CheckEnum = function CheckEnum(type, value) {
                for(var item in type) {
                    if(type[item] == value || type[item] == value.toLowerCase()) {
                        return type[item];
                    }
                }
                throw "Enum value is invalid";
            };
            Utility.CheckChar = function CheckChar(value) {
                value = Utility.CheckString(value);
                // Frank Liu fixed bug 678 at 2013/06/14.
                if(value.length !== 1) {
                    // Frank Liu fixed bug 865 at 2013/06/26.
                    throw "Invalid value";
                    //value = value.Substring(0, 1);
                                    }
                return value;
            };
            Utility.GetMultipleStringEnum = function GetMultipleStringEnum(value) {
                var valueList = value.split(" ");
                valueList.sort();
                return valueList.join(",");
            };
            Utility.CheckMultipleStringEnum = function CheckMultipleStringEnum(type, value) {
                var valueList = value.split(",");
                var result = [];
                for(var i = 0; i < valueList.length; i++) {
                    result.push(Utility.CheckEnum(type, Utility.Trim(valueList[i])));
                }
                return result.join(" ");
            };
            Utility.EncodingToHTML = function EncodingToHTML(text) {
                if(text.IndexOf("&") != -1) {
                    var tempDispText = text;
                    var tempText = "";
                    while(tempDispText.IndexOf("&") != -1) {
                        var findPosition = tempDispText.IndexOf("&");
                        tempDispText = tempDispText.replace("&", "&amp;");
                        tempText += tempDispText.Substring(0, findPosition + 5);
                        tempDispText = tempDispText.Substring(findPosition + 5, tempDispText.GetLength());
                    }
                    if(tempDispText.IndexOf("&") == -1 && tempDispText != "") {
                        tempText += tempDispText;
                    }
                    text = tempText;
                }
                //Modified by shenyuan at 2006-02-20 for bug #5308.
                while(text.IndexOf(' ') != -1) {
                    text = text.replace(" ", "&nbsp;");
                }
                while(text.IndexOf("<") != -1) {
                    text = text.replace("<", "&lt;");
                }
                while(text.IndexOf(">") != -1) {
                    text = text.replace(">", "&gt;");
                }
                return text;
            };
            Utility.DecodingFromHTML = function DecodingFromHTML(text) {
                //Modified by shenyuan at 2006-02-23 for bug #5348.
                while(text.IndexOf("&nbsp;") != -1) {
                    text = text.replace("&nbsp;", " ");
                }
                //Modified by shenyuan at 2006-02-08 for bug #5180.
                while(text.IndexOf("&lt;") != -1) {
                    text = text.replace("&lt;", "<");
                }
                while(text.IndexOf("&gt;") != -1) {
                    text = text.replace("&gt;", ">");
                }
                //Modified by shenyuan at 2006-02-10 for bug #5206.
                if(text.IndexOf("&amp;") != -1) {
                    var tmpText = text;
                    var tmpResult = "";
                    while(tmpText.IndexOf("&amp;") != -1) {
                        var temPos = tmpText.IndexOf("&amp;");
                        tmpText = tmpText.replace("&amp;", "&");
                        tmpResult += tmpText.Substring(0, temPos + 1);
                        tmpText = tmpText.Substring(temPos + 1, tmpText.GetLength());
                    }
                    if(tmpText.IndexOf("&amp;") == -1 && tmpText != "") {
                        tmpResult += tmpText;
                    }
                    text = tmpResult;
                }
                return text;
            };
            Utility.IsStandCompliantModeOn = function IsStandCompliantModeOn() {
                //Commented by Kevin, Nov 11, 2008
                //fix bug#10414
                //return document.compatMode == "CSS1Compat";
                if(!Utility.IsIE()) {
                    return document.compatMode == "CSS1Compat" || document.compatMode == "BackCompat";
                }
                return document.compatMode == "CSS1Compat";
                //end by Kevin
                            };
            Utility.GetPageZoomRate = function GetPageZoomRate() {
                // add by Sean Huang at 2008.11.13, for bug 10129, 10368 -->
                if(Utility.IsIE() && Utility.engine === 8) {
                    return screen.deviceXDPI / screen.logicalXDPI;
                }
                // add by Sean Huang at 2008.11.13, for bug 10129, 10368 -->
                var normalPosition = document.getElementById("gcsh_standard_control_for_get_normal_position");
                if(typeof (normalPosition) != "undefined" && normalPosition != null) {
                    return document.getElementById("gcsh_standard_control_for_get_normal_position").offsetLeft / 100;
                } else {
                    var div = document.createElement("div");
                    document.body.appendChild(div);
                    div.id = "gcsh_standard_control_for_get_normal_position";
                    div.style.visibility = "hidden";
                    div.style.left = "100px";
                    div.style.top = "1px";
                    div.style.width = "1px";
                    div.style.height = "1px";
                    div.style.position = "absolute";
                    return document.getElementById("gcsh_standard_control_for_get_normal_position").offsetLeft / 100;
                    // return 1;
                                    }
            };
            Utility.GetElementPosition = function GetElementPosition(id) {
                // Frank Liu fixed bug 612 at 2013/06/09.
                // HelenLiu 2013/07/02 fix bug 742 in IM HTML5.
                if(Utility.IsIE() || Utility.chrome || Utility.safari) {
                    // change by Sean Huang at 2009.04.10, for bug 2125 -->
                    //return Utility.GetElementPositionForIE(id);
                    //modified by sj for bug 12220
                    //if (Utility.engine == 8)
                    if(Utility.engine >= 8)//end by sj
                     {
                        var pos1 = Utility.GetElementPositionForIE8(id);
                        // DaryLuo 2012.09/10 fix bug 561 in IMWeb 7.0.
                        if(pos1.Left == 0 && pos1.Top == 0) {
                            var pos2 = Utility.GetElementPositionForFireFox(id);
                            return pos2;
                        } else {
                            return pos1;
                        }
                    } else {
                        var posIE7 = Utility.GetElementPositionForIE(id);
                        //  var posIE8 = Utility.GetElementPositionForIE8(id);
                        //  var posFF = Utility.GetElementPositionForFireFox(id);
                        // DaryLuo 2012.09/10 fix bug 561 in IMWeb 7.0.
                        //  var left = Utility.ChooseMiddle(posIE7.Left, posIE8.Left, posFF.Left);
                        //  var top = Utility.ChooseMiddle(posIE7.Top, posIE8.Top, posFF.Top);
                        return {
                            Left: posIE7.Left,
                            Top: posIE7.Top
                        };
                    }
                    // end of Sean Huang <--
                                    }
                return Utility.GetElementPositionForFireFox(id);
            };
            Utility.GetElementPositionForIE8 = function GetElementPositionForIE8(id) {
                var element = id;
                if(typeof id == "string") {
                    element = document.getElementById(id);
                }
                var top = 0;
                var left = 0;
                if(element == null || element.self || element.nodeType === 9) {
                    return {
                        Left: left,
                        Top: top
                    };
                }
                var clientRect = element.getBoundingClientRect();
                if(!clientRect) {
                    return {
                        Left: left,
                        Top: top
                    };
                }
                var documentElement = element.ownerDocument.documentElement;
                var left = clientRect.left + documentElement.scrollLeft;
                var top = clientRect.top + documentElement.scrollTop;
                try  {
                    var f = element.ownerDocument.parentWindow.frameElement || null;
                    if(f) {
                        var offset = (f.frameBorder === "0" || f.frameBorder === "no") ? 2 : 0;
                        left += offset;
                        top += offset;
                    }
                } catch (ex) {
                }
                return {
                    Left: left,
                    Top: top
                };
            };
            Utility.GetElementPositionForIE = function GetElementPositionForIE(id) {
                var oElement = id;
                if(typeof id == "string") {
                    oElement = document.getElementById(id);
                }
                // For bug 3696.
                var top = 0;//document.body.scrollTop;

                var left = 0;//document.body.scrollLeft;

                if(oElement == null) {
                    return {
                        Left: left,
                        Top: top
                    };
                }
                if(oElement.offsetParent) {
                    while(oElement.offsetParent != null) {
                        var parent = oElement.offsetParent;
                        var parentTagName = parent.tagName.toLowerCase();
                        if(parentTagName != "table" && parentTagName != "body" && parentTagName != "html" && // Add comments by Yang at 14:40 Dec. 12th 2008
                        // For fix the bug 1187(TP)
                        //			    parentTagName != "div" &&
                        // End by Yang
                        parent.clientTop && parent.clientLeft) {
                            left += parent.clientLeft;
                            top += parent.clientTop;
                        }
                        // add by Sean Huang at 2008.11.12, for bug 10064
                        // change by Sean Huang at 2008.11.13, for bug 10445 -->
                        //if (Utility.IsIE7() && parent.style.position.toLowerCase() == "relative")
                        if(Utility.engine == 7 && parent.style.position.toLowerCase() == "relative")// end of Sean Huang <--
                         {
                            left += oElement.offsetLeft - oElement.scrollLeft;
                            top += oElement.offsetTop;
                            // add by Sean Huang at 2009.01.07, for bug 856 -->
                            var zoom = Utility.GetPageZoomRate();
                            if(zoom == 1)// end of Sean Huang <--
                             {
                                var offset = oElement.offsetTop;
                                for(var i = 0; i < parent.children.length; i++) {
                                    var o = parent.children[i];
                                    if(o == oElement) {
                                        break;
                                    } else if(o.offsetTop) {
                                        offset = o.offsetTop;
                                        break;
                                    }
                                }
                                top -= offset;
                            }
                        } else // end of Sean Huang <--
                        // change by Sean Huang at 2008.11.13, for bug 10445 -->
                        //else if (Utility.IsStandCompliantModeOn() && Utility.IsIE7()
                        if(Utility.IsStandCompliantModeOn() && Utility.engine == 7 && // end of Sean Huang <--
                        (oElement.style.position.toLowerCase() == "absolute" || oElement.style.position.toLowerCase() == "relative")) {
                            // change by Sean Huang at 2009.01.07, for bug 856 -->
                            // [original] -->
                            //  // change by Sean Huang at 2008.12.18, for bug 896 -->
                            //  //top  += (oElement.offsetTop - oElement.scrollTop) / Utility.GetPageZoomRate();
                            //  //left += (oElement.offsetLeft - oElement.scrollLeft) / Utility.GetPageZoomRate();
                            //  top  += (oElement.offsetTop - oElement.scrollTop);
                            //  left += (oElement.offsetLeft - oElement.scrollLeft);
                            //  // end of Sean Huang <--
                            // <-- [original]
                            var zoom = Utility.GetPageZoomRate();
                            top += (oElement.offsetTop - oElement.scrollTop) / zoom;
                            left += (oElement.offsetLeft - oElement.scrollLeft) / zoom;
                            // end of Sean Huang, for bug 856 <--
                                                    } else {
                            //Add by Jiang at Dec. 10 2008
                            //For fixed bug773
                            if((oElement.tagName.toLowerCase() == "input" && oElement.type.toLowerCase() == "text") || oElement.tagName.toLowerCase() == "textarea") {
                                top += oElement.offsetTop;
                                left += oElement.offsetLeft;
                            } else {
                                top += oElement.offsetTop - oElement.scrollTop;
                                left += oElement.offsetLeft - oElement.scrollLeft;
                            }
                            //End by Jiang Changcheng
                                                    }
                        oElement = parent;
                        //end by Ryan Wu.
                                            }
                } else if(oElement.left && oElement.top) {
                    left += oElement.left;
                    top += oElement.top;
                } else {
                    if(oElement.x) {
                        left += oElement.x;
                    }
                    if(oElement.y) {
                        top += oElement.y;
                    }
                }
                //Add by Ryan Wu at 11:13, Nov 2 2005. For in VS2005, body has also an offset value.
                if(oElement.style.position.toLowerCase() != "relative" && oElement.style.position.toLowerCase() != "absolute" && oElement.tagName.toLowerCase() == "body" && Utility.IsStandCompliantModeOn()) {
                    //Add comments by Ryan Wu at 9:54 Nov. 15 2006.
                    //Fix bug#6695.
                    //	    top  += oElement.offsetTop;
                    //		left += oElement.offsetLeft;
                    // change by Sean Huang at 2008.11.13, for bug 10445 -->
                    //if (!Utility.IsIE7())
                    if(Utility.engine != 7)// end of Sean Huang <--
                     {
                        top += oElement.offsetTop;
                        left += oElement.offsetLeft;
                    } else {
                        // Add comments by Yang at 13:23 July 16th 2008
                        // For fix the bug 9755
                        //            top  += parseInt(oElement.currentStyle.marginTop);
                        //		    left += parseInt(oElement.currentStyle.marginLeft);
                        var tempTop = parseInt(oElement.currentStyle.marginTop);
                        var tempLeft = parseInt(oElement.currentStyle.marginLeft);
                        if(isNaN(tempTop)) {
                            tempTop = 0;
                        }
                        if(isNaN(tempLeft)) {
                            tempLeft = 0;
                        }
                        top += tempTop;
                        left += tempLeft;
                        // End by Yang
                                            }
                    //end by Ryan Wu.
                                    }
                return {
                    Left: left,
                    Top: top
                };
            };
            Utility.GetElementPositionForFireFox = function GetElementPositionForFireFox(id) {
                var oElement = id;
                if(typeof id == "string") {
                    oElement = document.getElementById(id);
                }
                // For bug 3696.
                var top = 0;//document.body.scrollTop;

                var left = 0;//document.body.scrollLeft;

                var scrollLeft = 0;
                var scrollTop = 0;
                if(oElement == null) {
                    return {
                        Left: left,
                        Top: top
                    };
                }
                //Gets the offsetTop and offsetLeft.
                if(oElement.offsetParent) {
                    while(oElement.offsetParent != null) {
                        var parentTagName = oElement.offsetParent.tagName.toLowerCase();
                        if(parentTagName != "table" && parentTagName != "body" && parentTagName != "html" && parentTagName != "div" && oElement.offsetParent.clientTop && oElement.offsetParent.clientLeft) {
                            left += oElement.offsetParent.clientLeft;
                            top += oElement.offsetParent.clientTop;
                        }
                        top += oElement.offsetTop;
                        left += oElement.offsetLeft;
                        oElement = oElement.offsetParent;
                    }
                } else if(oElement.left && oElement.top) {
                    left += oElement.left;
                    top += oElement.top;
                } else {
                    if(oElement.x) {
                        left += oElement.x;
                    }
                    if(oElement.y) {
                        top += oElement.y;
                    }
                }
                //Gets the scrollTop and scrollLeft.
                oElement = id;
                if(typeof id === "string") {
                    oElement = document.getElementById(id);
                }
                if(oElement.parentElement) {
                    while(oElement.parentElement != null && oElement.tagName.toLowerCase() != "html") {
                        scrollTop += oElement.scrollTop;
                        scrollLeft += oElement.scrollLeft;
                        oElement = oElement.parentElement;
                    }
                }
                top -= scrollTop;
                left -= scrollLeft;
                //Add by Ryan Wu at 11:13, Nov 2 2005. For in VS2005, body has also an offset value.
                if(oElement.style.position.toLowerCase() != "relative" && oElement.style.position.toLowerCase() != "absolute" && oElement.tagName.toLowerCase() == "body" && Utility.IsStandCompliantModeOn()) {
                    top += oElement.offsetTop;
                    left += oElement.offsetLeft;
                }
                return {
                    Left: left,
                    Top: top
                };
            };
            Utility.MeasureText = function MeasureText(text, domElement) {
                if(Utility.MeasureElement === undefined) {
                    var div = document.createElement("div");
                    div.style.position = "absolute";
                    div.style.border = "solid 0px";
                    div.style.left = "-100000px";
                    div.style.top = "-100000px";
                    var textNode = window.document.createTextNode("");
                    div.appendChild(textNode);
                    document.body.appendChild(div);
                    Utility.MeasureElement = div;
                    Utility.MeasureTextElement = textNode;
                }
                var div = Utility.MeasureElement;
                var textNode = Utility.MeasureTextElement;
                if(document != null) {
                    var containsElement = document.body.contains(domElement);
                    if(!containsElement) {
                        document.body.appendChild(domElement);
                    }
                    var currentStyle = domElement.currentStyle || window.getComputedStyle(domElement, null);
                    div.style.fontFamily = currentStyle.fontFamily;
                    div.style.fontSize = currentStyle.fontSize;
                    div.style.fontStyle = currentStyle.fontStyle;
                    div.style.fontWeight = currentStyle.fontWeight;
                    if(!containsElement) {
                        document.body.removeChild(domElement);
                    }
                }
                var result = null;
                if(typeof (text) == "string") {
                    textNode.nodeValue = text;
                    result = {
                        Width: div.clientWidth,
                        Height: div.clientHeight
                    };
                } else {
                    result = [];
                    for(var i = 0; i < text.length; i++) {
                        textNode.nodeValue = text[i];
                        result.push({
                            Width: div.clientWidth,
                            Height: div.clientHeight
                        });
                    }
                }
                return result;
            };
            Utility.GetOSDefaultFontFamily = function GetOSDefaultFontFamily() {
                switch(Utility.GetClientOS().toLowerCase()) {
                    case "winxp":
                        return "MS UI Gothic";
                    case "vista":
                        return "¥á¥¤¥ê¥ª";
                    case "win7":
                        return "¥á¥¤¥ê¥ª";
                    case "win8":
                        return "Meiryo UI";
                    case "win2003":
                        return "MS UI Gothic";
                    case "win2000":
                        return "MS UI Gothic";
                }
                return "MS UI Gothic";
            };
            Utility.IsTouchSupport = function IsTouchSupport() {
                return window.navigator.userAgent.toLowerCase().indexOf("touch") != -1;
            };
            Utility.DisabledHoldVisual = function DisabledHoldVisual(element) {
                if(element !== null && element !== undefined && Utility.IsTouchSupport() && Utility.IsIE10OrLater()) {
                    element.addEventListener("MSHoldVisual", function (e) {
                        e.preventDefault();
                    }, false);
                    element.addEventListener("MSGestureHold", function (e) {
                        e.preventDefault();
                    }, false);
                    // Disables visual
                    element.addEventListener("contextmenu", function (e) {
                        e.preventDefault();
                    }, false);
                }
            };
            Utility.IsMouseDownOnClearButton = function IsMouseDownOnClearButton(evt) {
                if(!Utility.IsIE10OrLater()) {
                    return false;
                }
                for(var i = 0; i < document.styleSheets.length; i++) {
                    var styleSheets = document.styleSheets[i];
                    for(var j = 0; j < styleSheets.cssRules.length; j++) {
                        if(styleSheets.cssRules[j].selectorText == "::-ms-clear") {
                            if(styleSheets.cssRules[j].style.display == "none") {
                                return false;
                            }
                        }
                    }
                }
                var x = evt.offsetX;
                var y = evt.offsetY;
                var textbox = evt.srcElement || evt.target;
                var width = textbox.clientWidth;
                var height = textbox.clientHeight;
                var paddingLeft = parseInt(textbox.currentStyle.paddingLeft);
                var paddingRight = parseInt(textbox.currentStyle.paddingRight);
                if(textbox.readOnly || evt.button != MouseButton.Left) {
                    return false;
                }
                // DaryLuo 2012/09/06 fix bug 576, include padding.
                if(width - height + paddingLeft + paddingRight < Utility.GetClearButtonShowThreshold(textbox)) {
                    return false;
                }
                var xx = width - height;
                if(x > xx && x <= width && y >= 0 && y < height) {
                    return true;
                } else {
                    return false;
                }
            };
            Utility.GetClearButtonShowThreshold = function GetClearButtonShowThreshold(textinput) {
                // DaryLuo 2012/11/05 fix bug 861 in IM Web 7.0.
                // Previous I return this function to the harded value 66, in fact, it is incorrect.
                // After researched it, this value should be changed with the font.
                // The changed rule is linear.
                // When the font's unit is pixel, I got the following value.
                // The x indicated font's height, use meature method to get it.
                // The y indicated the clear button's show/hidden threshold value.
                // The I use matlab to get the changed rule. input the following script into matlabe, you will get the result.
                //x=[12 17 23  29 35  40 46 52 58 63 69 75 80],
                //y= [50 75 100 125 150 175 200 225 250 275 300 325 350],
                //p=polyfit(x,y,1),
                //xx=0:.1:100,
                //plot(x,y,'o',xx,polyval(p,xx)) ,poly2sym(p,'x')
                //r = poly2sym(p,'x')
                //vpa(r,8)
                // When the font's unit is Point, I got the following value.
                //x=[8 15 23 31 38 46 54 61 69 77 84],
                //y= [33 67 100 133 167 200 233 267 300 333 367],
                //p=polyfit(x,y,1),
                //xx=0:.1:100,
                //plot(x,y,'o',xx,polyval(p,xx)) ,poly2sym(p,'x')
                //r = poly2sym(p,'x')
                //vpa(r,8)
                var height = Utility.MeasureText("ABCDQ", textinput).Height;
                var result = 4.3604432 * height - 0.76207324;
                result = Math.round(result);
                return result;
            };
            Utility.IsFocusFromIMControl = function IsFocusFromIMControl(id, evt) {
                try  {
                    //return event.fromElement.className.IndexOf(Utility.DefaultControlStyle) != -1;
                    var src = evt.fromElement;
                    while(src != null) {
                        // change by Sean Huang at 2008.08.14, for bug 614 and 644 (ttp)-->
                        //if (src.id.Substring(0, id.length) == id)
                        //modified by sj for bug 2149
                        //if (src.id == id ||  src.id == id + this.Hold + "_DropDownObj" || src.id == id + "DropDown_Container" || src.id == id+ "_ContextMenu")
                        if(src.id == id || src.id == id + this.Hold + "_DropDownObj" || src.id == id + "_DropDown_Container" || src.id == id + "_ContextMenu" || src.id == id + "_HistoryList" || src.id == id + "_EditField" || src.id == id + "_BorderContainer" || src.id == id + "_DropDown_EditField")//end by sj
                        // end of Sean huang <--
                         {
                            return true;
                        }
                        //Add comments by Ryan Wu at 11:28 Mar. 15 2007.
                        //For test FireFox.
                        //src = src.parentElement;
                        src = src.parentNode;
                        //end by Ryan Wu.
                                            }
                    return false;
                } catch (e) {
                    return false;
                }
            };
            Utility.IsFocusToIMControl = function IsFocusToIMControl(id, evt) {
                try  {
                    //	return event.toElement.className.IndexOf(Utility.DefaultControlStyle) != -1;
                    var src = evt.toElement;
                    //var src = event.toElement;
                    //evt.target;
                    while(src != null) {
                        //Add comments by Ryan Wu at 17:13 Aug. 22 2007.
                        //For fix the bug8990.
                        //if (src.id && src.id.substring(0, id.length) == id)
                        //add by chris for 12215 (bugzilla) 2010/12/17 16:30
                        //			// change by Sean Huang at 2008.08.14, for bug 614 and 644 (ttp)-->
                        //			//if (src.id && src.id == id)
                        //			//modified by sj for bug 2149
                        //			//if (src.id == id || src.id == id + this.Hold + "_DropDownObj" || src.id == id + "DropDown_Container" || src.id == id+ "_ContextMenu")
                        //			if (src.id == id || src.id == id + this.Hold + "_DropDownObj" || src.id == id + "DropDown_Container" || src.id == id + "_ContextMenu" || src.id == id + "_HistoryList")
                        //			//end by sj
                        //			// end of Sean Huang <--
                        if(src.id == id || src.id == id + this.Hold + "_DropDownObj" || src.id == id + "_DropDown_Container" || src.id == id + "_ContextMenu" || src.id == id + "_HistoryList" || src.id == id + this.Hold + "_DropDownObj_PopupMonth" || src.id == id + "_EditField" || src.id == id + "_BorderContainer" || src.id == id + "_DropDown_EditField")//end by chris for 12215 (bugzilla) 2010/12/17 16:30
                         {
                            return true;
                        }
                        //end by Ryan Wu.
                        //Add comments by Ryan Wu at 11:28 Mar. 15 2007.
                        //For test FireFox.
                        //src = src.parentElement;
                        src = src.parentNode;
                        //end by Ryan Wu.
                                            }
                    return false;
                } catch (e) {
                    return false;
                }
            };
            Utility.Trim = function Trim(value) {
                if(value == "") {
                    return "";
                }
                var beginIndex = 0;
                var endIndex = 0;
                for(var i = 0; i < value.length; i++) {
                    if(value.CharAt(i) != " " && value.CharAt(i) != "¡¡") {
                        beginIndex = i;
                        break;
                    }
                }
                for(var i = value.length - 1; i >= 0; i--) {
                    if(value.CharAt(i) != " " && value.CharAt(i) != "¡¡") {
                        endIndex = i + 1;
                        break;
                    }
                }
                try  {
                    var s = value.Substring(beginIndex, endIndex);
                    return s;
                } catch (e) {
                    return value;
                }
            };
            Utility.GetBrowserType = // add by Sean Huang at 2008.10.27, for support IE8 -->
            function GetBrowserType() {
                var ua = navigator.userAgent.toLowerCase();
                if(ua.indexOf("msie") != -1) {
                    Utility.ie = ua.match(/msie ([\d.]+)/)[1];
                } else //change by sj for supporting firefox 3.6 (bug 2956)
                //else if (document.getBoxObjectFor)
                if(ua.indexOf("chrome") != -1) {
                    Utility.chrome = ua.match(/chrome\/([\d.]+)/)[1];
                } else if(ua.indexOf("safari") != -1) {
                    var version = ua.match(/version\/([\d.]+)/);
                    if(version) {
                        Utility.safari = version[1];
                    }
                } else if(ua.indexOf("firefox") != -1) {
                    Utility.firefox = ua.match(/firefox\/([\d.]+)/)[1];
                } else if(ua.indexOf("opera") != -1) {
                    Utility.opera = ua.match(/opera.([\d.]+)/)[1];
                }
                if(ua.indexOf("ipad") != -1) {
                    Utility.IPad = true;
                }
                // add by Sean Huang at 2008.11.13, for bug 10445 -->
                Utility.engine = null;
                if(window.navigator.appName == "Microsoft Internet Explorer") {
                    // This is an IE browser. What mode is the engine in?
                    if(document.documentMode) {
                        // IE8
                        Utility.engine = document.documentMode;
                    } else// IE 5-7
                     {
                        Utility.engine = 5// Assume quirks mode unless proven otherwise
                        ;
                        if(document.compatMode) {
                            if(document.compatMode == "CSS1Compat") {
                                Utility.engine = 7;
                            }// standards mode

                        }
                        if(Utility.ie && Utility.ie.indexOf("6") == 0) {
                            Utility.engine = 6;
                        }
                    }
                    // the engine variable now contains the document compatibility mode.
                                    }
                if(ua.indexOf("rv:") !== -1 && ua.indexOf("firefox") === -1) {
                    // Support IE 11.
                    Utility.ie = Utility.engine = ua.match(/rv:([\d.]+)/)[1];
                }
            };
            Utility.GetTouchPath = function GetTouchPath(beginY, endY) {
                if(beginY === -1 || endY === -1) {
                    return "Error";
                }
                if(beginY > endY) {
                    return beginY - endY > 20 ? "ToTop" : "NotMove";
                } else if(beginY < endY) {
                    return endY - beginY > 20 ? "ToBottom" : "NotMove";
                }
                return "NotMove";
            };
            Utility.IsPad = function IsPad() {
                var result = Utility.IPad || Utility.GetClientOS().toLowerCase() == "android";
                return result;
            };
            Utility.IsJapan = function IsJapan() {
                if(navigator.userLanguage) {
                    return navigator.userLanguage.indexOf('ja') != -1;
                } else if(navigator["language"]) {
                    return navigator["language"].indexOf('ja') != -1;
                }
                return false;
            };
            Utility.IsFireFox4OrLater = // end of Sean Huang <--
            //Add comments by Yang at 15:27 April 29th 2011 for supporting Firefox 4 or later.
            function IsFireFox4OrLater() {
                return Utility.firefox != null && parseFloat(Utility.firefox) >= 4.0;
            };
            Utility.IsIE11OrLater = function IsIE11OrLater() {
                return Utility.IsIE() && Utility.engine >= 11;
            };
            Utility.IsIE10OrLater = function IsIE10OrLater() {
                return Utility.IsIE() && Utility.engine >= 10;
            };
            Utility.IsIE9OrLater = function IsIE9OrLater() {
                return Utility.IsIE() && Utility.engine >= 9;
            };
            Utility.IsIE8OrLater = function IsIE8OrLater() {
                return Utility.IsIE() && Utility.engine >= 8;
            };
            Utility.IsIE8OrBelow = function IsIE8OrBelow() {
                return Utility.IsIE() && Utility.engine <= 8;
            };
            Utility.IsIE8 = function IsIE8() {
                return Utility.IsIE() && Utility.engine == 8;
            };
            Utility.IsIE7 = function IsIE7() {
                return Utility.IsIE() && Utility.engine == 7;
            };
            Utility.IsIE7OrLater = function IsIE7OrLater() {
                return Utility.IsIE() && Utility.engine >= 7;
            };
            Utility.IsIE = function IsIE() {
                return Utility.ie !== undefined;
            };
            Utility.IsIE9 = function IsIE9() {
                return Utility.IsIE() && Utility.engine == 9;
            };
            Utility.GetClientOS = function GetClientOS() {
                // Add comments by Yang at 11:04 Sep. 6th 2007
                // For Get os information in firefox is different from IE.
                //var appVersion = navigator.appVersion;
                var appVersion;
                if(!Utility.IsIE()) {
                    var osVersion = navigator.userAgent;
                    var start = osVersion.indexOf("(");
                    var end = osVersion.indexOf(")");
                    appVersion = osVersion.substring(start + 1, end);
                } else {
                    appVersion = navigator.appVersion;
                }
                // End by Yang
                if(appVersion.indexOf("NT 6.0") != -1) {
                    return "vista";
                } else if(appVersion.indexOf("NT 5.2") != -1) {
                    return "win2003";
                } else if(appVersion.indexOf("NT 5.1") != -1) {
                    return "winxp";
                } else if(appVersion.indexOf("NT 5.0") != -1) {
                    return "win2000";
                } else if(appVersion.indexOf("NT 6.1") != -1) {
                    return "Win7";
                } else if(appVersion.indexOf("NT 6.2") != -1) {
                    return "Win8";
                } else if(appVersion.indexOf("NT 6.3") != -1) {
                    // Windows 8.1
                    return "Win8";
                } else if(appVersion.indexOf("Android") != -1) {
                    return "Android";
                }
                return "unknow";
            };
            Utility.CreateStyleElement = function CreateStyleElement(id) {
                var style = document.createElement("style");
                style.id = id;
                //add commnets by Jason.Zhou at 14:23 November 26 2007
                //for style.type="text/css" is used in css file used by linking file type, this sytle is only in dom tree.
                style.type = "text/css";
                //end by Jason.Zhou
                return style;
            };
            Utility.CreateClassStyle = function CreateClassStyle(className) {
                return Utility.CreateSelectorStyle("." + className);
            };
            Utility.CreateSelectorStyle = function CreateSelectorStyle(selectorName) {
                var tableStyle = document.getElementById("tableStyle");
                if(tableStyle == null) {
                    //tableStyle = GrapeCity.IM.Utility.CreateStyleElement("tableStyle");
                    tableStyle = this.CreateStyleElement("tableStyle");
                    document.body.appendChild(tableStyle);
                }
                var sheet = tableStyle.sheet || tableStyle.styleSheet;
                var rules = sheet.cssRules || sheet.rules;
                if(sheet.insertRule) {
                    sheet.insertRule(selectorName + "{ }", rules.length);
                } else {
                    sheet.addRule(selectorName, "{ }", rules.length);
                }
                return rules.item(rules.length - 1);
            };
            Utility.SetSelection = function SetSelection(element, start, end, multiLine) {
                $(element).wijtextselection(Math.min(start, end), Math.max(start, end));
            };
            Utility.PreventDefault = function PreventDefault(evt) {
                if(evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }
            };
            Utility.CancelBubble = function CancelBubble(evt) {
                if(evt.cancelBubble !== undefined) {
                    evt.cancelBubble = true;
                } else {
                    evt.stopPropagation();
                }
            };
            Utility.DragDrop = function DragDrop(obj) {
                try  {
                    obj.dragDrop(true);
                } catch (e) {
                }
            };
            Utility.GetMouseButton = function GetMouseButton(evt) {
                var mouseButton = MouseButton.Default;
                var leftKey = Utility.IsIE8OrBelow() ? 1 : 0;
                if(evt.button == leftKey) {
                    mouseButton = MouseButton.Left;
                } else if(evt.button == 1) {
                    mouseButton = MouseButton.Middle;
                } else if(evt.button == 2) {
                    mouseButton = MouseButton.Right;
                }
                return mouseButton;
            };
            Utility.GetMouseWheelValue = /**
            * Gets the value after mouse wheel.
            * @param value - the initial value before mousewheel.
            * @returns Returns the value after mouse wheel.
            */
            function GetMouseWheelValue(value, evt) {
                //Add comments by Ryan Wu at 9:50 Aug. 13 2007.
                //For Firefox doesn't support the event.wheelDelta to get the mouse wheel value.
                //I don't know why the event.detail is also 3 or -3, so we must divide 3.
                if(Utility.IsFireFox4OrLater()) {
                    return -evt.detail / 3;
                }
                //end by Ryan Wu.
                if(evt.wheelDelta >= 120) {
                    value++;
                } else if(evt.wheelDelta <= -120) {
                    value--;
                }
                return value;
            };
            Utility.SetCopy = function SetCopy(text, useClipboard) {
                // Add comments by Yang
                // For test firefox
                var selText;
                try  {
                    // add by Sean Huang at 2009.04.29, for bug 2209 -->
                    if(text == null || text == "")// end of Sean Huang <--
                     {
                        if(document.selection) {
                            selText = document.selection.createRange().text;
                        }
                        if(selText == "") {
                            return;
                        }
                    }
                } catch (e) {
                }
                ;
                if(text != null) {
                    selText = text;
                }
                Utility.CopyDataToClipBoard(selText, useClipboard);
            };
            Utility.CopyDataToClipBoard = function CopyDataToClipBoard(copytext, useClipboard) {
                if(useClipboard == false) {
                    Utility.SavedText = copytext;
                    return;
                }
                if(window.clipboardData) {
                    // change by Sean Huang at 2009.01.13, for bug 1582 -->
                    //window.clipboardData.setData("Text", copytext);
                    // change by Sean Huang at 2009.02.19, for bug 1903 -->
                    //setTimeout('window.clipboardData.setData("Text", "' + copytext + '");', 0);
                    // change by Sean Huang at 2009.05.26, for sometimes throw exception in auto test ==-->
                    //setTimeout(function () {window.clipboardData.setData("Text", copytext);}, 0);
                    setTimeout(function () {
                        try  {
                            window.clipboardData.setData("Text", copytext);
                        } catch (ex) {
                        }
                    }, 0);
                    // end of Sean Huang, for auto test <--==
                    // end of Sean Huang <--
                    // end of Sean Huang <--
                                    } else if(Utility.CutCopyPasteEventObject !== null) {
                    if(Utility.CutCopyPasteEventObject.clipboardData !== undefined) {
                        Utility.CutCopyPasteEventObject.clipboardData.setData("text", copytext);
                    }
                }
                //else if (window.netscape) {
                //    try {
                //        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
                //        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
                //        if (!clip) {
                //            return;
                //        }
                //        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
                //        if (!trans) {
                //            return;
                //        }
                //        trans.addDataFlavor('text/unicode');
                //        var str = new Object();
                //        var len = new Object();
                //        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
                //        str.data = copytext;
                //        trans.setTransferData("text/unicode", str, copytext.length * 2);
                //        var clipid = Components.interfaces.nsIClipboard;
                //        if (!clip) {
                //            return false;
                //        }
                //        clip.setData(trans, null, clipid.kGlobalClipboard);
                //    } catch (e) {
                //    }
                //}
                            };
            Utility.SetZoomStyle = function SetZoomStyle(element, value, align) {
                if(element === undefined || element === null) {
                    return;
                }
                var zoomOrigin = "top left";
                if(align === DropDownAlign.Right) {
                    zoomOrigin = "top right";
                }
                if(Utility.firefox) {
                    element.style.MozTransformOrigin = value === "" ? "" : zoomOrigin;
                    element.style.MozTransform = value === "" ? "" : "scale(" + value + ")";
                    element.setAttribute("ZoomValue", value);
                } else {
                    if(Utility.chrome || Utility.safari) {
                        if(value !== "") {
                            element.style.MozTransform = "scale(" + value + ")";
                            element.style.WebkitTransform = "scale(" + value + ")";
                            element.style.webkitTransformOrigin = zoomOrigin;
                        } else {
                            element.style.MozTransform = "";
                            element.style.WebkitTransform = "";
                            element.style.WebkitTransformOrigin = "";
                        }
                    } else if(Utility.IsIE9OrLater()) {
                        if(value !== "") {
                            element.style.msTransform = "scale(" + value + ")";
                            element.style.msTransformOrigin = zoomOrigin;
                        } else {
                            element.style.msTransform = "";
                            element.style.msTransformOrigin = "";
                        }
                    } else {
                        element.style.zoom = value;
                    }
                }
            };
            Utility.FilterText = function FilterText(includeText, intext) {
                if(intext.GetLength() == 0) {
                    return "";
                }
                var filterText = "";
                var j = 0;
                var i = 0;
                for(j = 0; j < intext.GetLength(); j++) {
                    var valid = false;
                    for(i = 0; i < includeText.GetLength(); i++) {
                        if(intext.Substring(j, j + 1) == includeText.Substring(i, i + 1)) {
                            valid = true;
                        }
                    }
                    if(valid == true) {
                        filterText += intext.Substring(j, j + 1);
                    }
                }
                return filterText;
            };
            Utility.IndexOfAny = function IndexOfAny(str, anyOf, startIndex) {
                if(startIndex >= str.length) {
                    return -1;
                }
                for(var i = startIndex; i < str.length; i++) {
                    for(var j = 0; j < anyOf.length; j++) {
                        if(str.charAt(i) == anyOf[j]) {
                            return i;
                        }
                    }
                }
                return -1;
            };
            return Utility;
        })();
        input.Utility = Utility;
        Utility.GetBrowserType();
        var CharType = (function () {
            function CharType() {
                /// <summary>
                ///   Indicates that the character is not of a particular category.
                /// </summary>
                this.OtherChar = 0x0000;
                /// <summary>
                ///   Indicates that the character is a control code.
                /// </summary>
                this.Control = 0x0001;
                /// <summary>
                ///   Indicates that the character is a numeric digit.
                /// </summary>
                this.Numeric = 0x0002;
                /// <summary>
                ///   Indicates that the character is a mathematical symbol.
                /// </summary>
                this.MathSymbol = 0x0003;
                /// <summary>
                ///   Indicates that the character is a symbol.
                /// </summary>
                this.Symbol = 0x0004;
                /// <summary>
                ///   Indicates that the character is a punctuation. ( Open &amp; Close )
                /// </summary>
                this.Punctuation = 0x0005;
                /// <summary>
                ///   Indicates that the character is a space character.
                /// </summary>
                this.Space = 0x0006;
                /// <summary>
                ///   Indicates that the character is an upper case letter.
                /// </summary>
                this.UpperCase = 0x0007;
                /// <summary>
                ///   Indicates that the character is a lower case letter.
                /// </summary>
                this.LowerCase = 0x0008;
                /// <summary>
                ///   Indicates that the character is a Japanese Katakana character.
                /// </summary>
                this.Katakana = 0x0009;
                /// <summary>
                ///   Indicates that the character is a Japanese Hiragana character.
                /// </summary>
                this.Hiragana = 0x000a;
                /// <summary>
                ///   Indicates that the character is a CJK punctuation.
                /// </summary>
                this.FarEastPunctation = 0x000b;
                /// <summary>
                ///   Indicates that the character is a Hangal character.
                /// </summary>
                this.Hangul = 0x000c;
                /// <summary>
                ///   Indicates that the character is of full width.
                /// </summary>
                this.FullWidth = 0x8000;
            }
            return CharType;
        })();
        input.CharType = CharType;
        var CharCategory = (function () {
            function CharCategory() {
                // Min & Max values ----------------------------------
                ///   Represents the smallest possible value of a Char.
                ///   This field is constant.
                this.MinValue = '\u0000';
                ///   Represents the largest possible value of a Char.
                ///   This field is constant.
                this.MaxValue = '\uffff';
                //Full/HalfWidth characters (different cultures)------
                this.ANSISTART = 0x0000;
                this.ANSIEND = 0x00ff;
                this.BOTHWIDTHSTART = 0xff00;
                this.BOTHWIDTHEND = 0xffef;
                this.FULLALPHASTART = 0xff01;
                this.FULLUPPERSTART = 0xff21;
                this.FULLUPPEREND = 0xff3a;
                this.FULLALPHAEND = 0xff5e;
                this.CJKHALFSYMBOLSTART = 0xff61;
                this.CJKHALFSYMBOLEND = 0xff64;
                this.KANAHALFSTART = 0xff65;
                this.KANAHALFEND = 0xff9f;
                this.HANGULHALFSTART = 0xffa0;
                this.HANGULHALFEND = 0xffdc;
                this.FULLSYMBOLSTART = 0xffe0;
                this.FULLSYMBOLEND = 0xffe6;
                this.HALFPUNCTSTART = 0xffe8;
                this.HALFPUNCTEND = 0xffee;
                // Voiced characters (Japanese)------------------------
                this.KATAKANA_VOICED = '\uff9e';
                this.KATAKANA_SEMIVOICED = '\uff9f';
                //Others-----------------------------------------------
                this.Tab = '\u0009';
                this.Space = '\u0020';
                //>>> Static Data (tables) ----------------------------
                // Character Groups...
                ///   Character groups (character codes) based on Unicode 3.1.
                this._charstarts = [
                    '\u0000',
                    // Basic Latin
                    '\u0080',
                    // Latin 1 Supplement
                    '\u0100',
                    // Latin Extended - A
                    '\u0180',
                    // Latin Extended - B
                    '\u0250',
                    // IPA extensions
                    '\u02b0',
                    // Spacing Modifier Letters
                    '\u0300',
                    // Combining Diacritical Marks
                    '\u0370',
                    // Greek
                    '\u0400',
                    // Cyrillic
                    '\u0530',
                    // Armenian
                    '\u0590',
                    // Hebrew
                    '\u0600',
                    // Arabic
                    '\u0700',
                    // Syriac
                    '\u0780',
                    // Thaana
                    '\u0900',
                    // Devanagari
                    '\u0980',
                    // Bengali
                    '\u0a00',
                    // Gurmukhi
                    '\u0a80',
                    // Gujarati
                    '\u0b00',
                    // Oriya
                    '\u0b80',
                    // Tamil
                    '\u0c00',
                    // Telugu
                    '\u0c80',
                    // Kannada
                    '\u0d00',
                    // Malayalam
                    '\u0d80',
                    // Sinhala
                    '\u0e00',
                    // Thai
                    '\u0e80',
                    // Lao
                    '\u0f00',
                    // Tibetan
                    '\u1000',
                    // Myanmar
                    '\u10a0',
                    // Georgian
                    '\u1100',
                    // Hangal Jamo
                    '\u1200',
                    // Ethiopic
                    '\u13a0',
                    // Cherokee
                    '\u1400',
                    // Unified Canadian Aboriginal Syllabic
                    '\u1680',
                    // Ogham
                    '\u16a0',
                    // Runic
                    '\u1780',
                    // Khmer
                    '\u1800',
                    // Mongolian
                    '\u1e00',
                    // Latin Extended Additional
                    '\u1f00',
                    // Greek Extended
                    '\u2000',
                    // General Punctuation
                    '\u2070',
                    // Superscripts and Subscripts
                    '\u20a0',
                    // Currency Symbols
                    '\u20d0',
                    // Combining Marks for Symbols
                    '\u2100',
                    // Letter like Symbols
                    '\u2150',
                    // Number Forms
                    '\u2190',
                    // Arrows
                    '\u2200',
                    // Mathematical operators
                    '\u2300',
                    // Miscellaneous Technical
                    '\u2400',
                    // Control Pictures
                    '\u2440',
                    // Optical Character Recognition
                    '\u2460',
                    // Enclosed AlphaNumerics
                    '\u2500',
                    // Box drawing
                    '\u2580',
                    // Block Elements
                    '\u25a0',
                    // Geometric Shapes
                    '\u2600',
                    // Miscellaneous Symbols
                    '\u2700',
                    // Dingbats
                    '\u2800',
                    // Braille Patterns
                    '\u2e80',
                    // CJK Radicals Supplement
                    '\u2f00',
                    // Kangxi Radicals
                    '\u2ff0',
                    // Ideographic Description Characters
                    '\u3000',
                    // CJK Symbols and Punctuations
                    '\u3040',
                    // Hiragana
                    '\u30a0',
                    // Katakana
                    '\u3100',
                    // Bopomofo
                    '\u3130',
                    // Hangal Compatibility Jamo
                    '\u3190',
                    // Kanbun
                    '\u31a0',
                    // Bopomofo Extended
                    '\u3200',
                    // Enclosed CJK Letters and Months
                    '\u3300',
                    // CJK Compatiblity
                    '\u3400',
                    // CJK Unified Ideographs Extension
                    '\u4e00',
                    // CJK Undified Ideographs
                    '\ua000',
                    // Yi Syllables
                    '\ua490',
                    // Yi Radicals
                    '\uac00',
                    // Hangul Syllables
                    '\uf900',
                    // CJK Compatible Ideographs
                    '\ufb00',
                    // Alphabetic Presentation Forms
                    '\ufb50',
                    // Arabic Presentation Forms A
                    '\ufe20',
                    // Combining Half Marks
                    '\ufe30',
                    // CJK Compatiblity Form
                    '\ufe50',
                    // Small Form Variants
                    '\ufe70',
                    // Arabi Presentation Forms B
                    '\uff00',
                    // Halfwidth and Fullwidth Forms
                    '\ufff0'
                ];// Specials

                //Character Block Categories...
                ///   Character blocks categorized base on the Unicode standard.
                this.Blocks = [
                    'BASIC_LATIN',
                    'LATIN_1_SUPPLEMENT',
                    'LATIN_EXTENDED_A',
                    'LATIN_EXTENDED_B',
                    'IPA_EXTENSIONS',
                    'SPACING_MODIFIER_LETTERS',
                    'COMBINING_DIACRITICAL_MARKS',
                    'GREEK',
                    'CYRILLIC',
                    'ARMENIAN',
                    'HEBREW',
                    'ARABIC',
                    'SYRIAC',
                    'THAANA',
                    'DEVANAGARI',
                    'BENGALI',
                    'GURMUKHI',
                    'GUJARATI',
                    'ORIYA',
                    'TAMIL',
                    'TELUGU',
                    'KANNADA',
                    'MALAYALAM',
                    'SINHALA',
                    'THAI',
                    'LAO',
                    'TIBETAN',
                    'MYANMAR',
                    'GEORGIAN',
                    'HANGUL_JAMO',
                    'ETHIOPIC',
                    'CHEROKEE',
                    'UNIFIED_CANADIAN_ABORIGINAL_SYLLABIC',
                    'OGHAM',
                    'RUNIC',
                    'KUMER',
                    'MONGOLIAN',
                    'LATIN_EXTENDED_ADDITIONAL',
                    'GREEK_EXTENDED',
                    'GENERAL_PUNCTUATION',
                    'SUPERSCRIPTS_AND_SUBSCRIPTS',
                    'CURRENCY_SYMBOLS',
                    'COMBINING_MARKS_FOR_SYMBOLS',
                    'LETTERLIKE_SYMBOLS',
                    'NUMBER_FORMS',
                    'ARROWS',
                    'MATHEMATICAL_OPERATORS',
                    'MISCELLANEOUS_TECHNICAL',
                    'CONTROL_PICTURES',
                    'OPTICAL_CHARACTER_RECOGNITION',
                    'ENCLOSED_ALPHANUMERICS',
                    'BOX_DRAWING',
                    'BLOCK_ELEMENTS',
                    'GEOMETRIC_SHAPES',
                    'MISCELLANEOUS_SYMBOLS',
                    'DINGBATS',
                    'BRAILLE_PATTERNS',
                    'CJK_RADICALS_SUPPLEMENT',
                    'KANGXI_RADICALS',
                    'IDEOGRAPHIC_DESCRIPTION_CHARACTERS',
                    'CJK_SYMBOLS_AND_PUNCTUATION',
                    'HIRAGANA',
                    'KATAKANA',
                    'BOPOMOFO',
                    'HANGUL_COMPATIBILITY_JAMO',
                    'KANBUN',
                    'BOPOMOFO_EXTENDED',
                    'ENCLOSED_CJK_LETTERS_AND_MONTHS',
                    'CJK_COMPATIBILITY',
                    'CJK_UNIFIED_IDEOGRAPHS_EXTENSION',
                    'CJK_UNIFIED_IDEOGRAPHS',
                    'YI_SYLLABLES',
                    'YI_RADICALS',
                    'HANGUL_SYLLABLES',
                    'CJK_COMPATIBILITY_IDEOGRAPHS',
                    'ALPHABETIC_PRESENTATION_FORMS',
                    'ARABIC_PRESENTATION_FORMS_A',
                    'COMBINING_HALF_MARKS',
                    'CJK_COMPATIBILITY_FORMS',
                    'SMALL_FORM_VARIANTS',
                    'ARABIC_PRESENTATION_FORMS_B',
                    'HALFWIDTH_AND_FULLWIDTH_FORMS',
                    'SPECIALS'
                ];
                // Multi width character block mapping table...
                ///   Table of multi-width character blocks.
                this._fullhalfblocks = [
                    '\uff01',
                    // Symbols
                    '\uff10',
                    // Numbers
                    '\uff1a',
                    // Symbols
                    '\uff21',
                    // Uppercase
                    '\uff3b',
                    // Symbols
                    '\uff41',
                    // Lowercase
                    '\uff5b',
                    // Symbols
                    '\uff61',
                    // CJK Halfwidth Punctuation
                    '\uff65',
                    // Halfwidth Katakana
                    '\uffa0',
                    // Halfwidth Hangal
                    '\uffe0',
                    // Fullwidth symbol variants
                    '\uffe8'
                ];// Halfwidth symbol variants

                // Half width Katakana map table...
                ///   Mapping table of full width Katakana.
                this._halfkana = [
                    '\u30fb',
                    '\u30f2',
                    // ., small o
                    '\u30a1',
                    '\u30a3',
                    '\u30a5',
                    '\u30a7',
                    '\u30a9',
                    // small a
                    '\u30e3',
                    '\u30e5',
                    '\u30e7',
                    // small ya
                    '\u30c3',
                    '\u30fc',
                    // small tu, -
                    '\u30a2',
                    '\u30a4',
                    '\u30a6',
                    '\u30a8',
                    '\u30aa',
                    // a
                    '\u30ab',
                    '\u30ad',
                    '\u30af',
                    '\u30b1',
                    '\u30b3',
                    // ka
                    '\u30b5',
                    '\u30b7',
                    '\u30b9',
                    '\u30bb',
                    '\u30bd',
                    // sa
                    '\u30bf',
                    '\u30c1',
                    '\u30c4',
                    '\u30c6',
                    '\u30c8',
                    // ta
                    '\u30ca',
                    '\u30cb',
                    '\u30cc',
                    '\u30cd',
                    '\u30ce',
                    // na
                    '\u30cf',
                    '\u30d2',
                    '\u30d5',
                    '\u30d8',
                    '\u30db',
                    // ha
                    '\u30de',
                    '\u30df',
                    '\u30e0',
                    '\u30e1',
                    '\u30e2',
                    // ma
                    '\u30e4',
                    '\u30e6',
                    '\u30e8',
                    // ya
                    '\u30e9',
                    '\u30ea',
                    '\u30eb',
                    '\u30ec',
                    '\u30ed',
                    // ra
                    '\u30ef',
                    '\u30f3',
                    // wa
                    '\u3099',
                    '\u309a'
                ];// daku-on

                // Full width Katakana map table...
                ///   Mapping table of half-width Katakana.
                this._fullkana = [
                    '\uff67',
                    '\uff71',
                    '\uff68',
                    '\uff72',
                    '\uff69',
                    '\uff73',
                    //a
                    '\uff6a',
                    '\uff74',
                    '\uff6b',
                    '\uff75',
                    '\uff76',
                    '\uff76',
                    '\uff77',
                    '\uff77',
                    '\uff78',
                    '\uff78',
                    // ka
                    '\uff79',
                    '\uff79',
                    '\uff7a',
                    '\uff7a',
                    '\uff7b',
                    '\uff7b',
                    '\uff7c',
                    '\uff7c',
                    '\uff7d',
                    '\uff7d',
                    // sa
                    '\uff7e',
                    '\uff7e',
                    '\uff7f',
                    '\uff7f',
                    '\uff80',
                    '\uff80',
                    '\uff81',
                    '\uff81',
                    '\uff6f',
                    '\uff82',
                    // ta
                    '\uff82',
                    '\uff83',
                    '\uff83',
                    '\uff84',
                    '\uff84',
                    '\uff85',
                    '\uff86',
                    '\uff87',
                    '\uff88',
                    '\uff89',
                    // na
                    '\uff8a',
                    '\uff8a',
                    '\uff8a',
                    '\uff8b',
                    '\uff8b',
                    '\uff8b',
                    // ha
                    '\uff8c',
                    '\uff8c',
                    '\uff8c',
                    '\uff8d',
                    '\uff8d',
                    '\uff8d',
                    '\uff8e',
                    '\uff8e',
                    '\uff8e',
                    '\uff8f',
                    '\uff90',
                    '\uff91',
                    '\uff92',
                    '\uff93',
                    // ma
                    '\uff6c',
                    '\uff94',
                    '\uff6d',
                    '\uff95',
                    '\uff6e',
                    '\uff96',
                    // ya
                    '\uff97',
                    '\uff98',
                    '\uff99',
                    '\uff9a',
                    '\uff9b',
                    // ra
                    '\uff9c',
                    '\uff9c',
                    '\uff68',
                    '\uff6a',
                    '\uff66',
                    '\uff9d',
                    // wa,... un
                    //modified by sj for NKOI-8C7E84AA2
                    //'\uff73', '\uff68', '\uff6c', '\uff9c', '\uff68', '\uff6a',
                    '\uff73',
                    '\uff76',
                    '\uff79',
                    '\uff9c',
                    '\uff68',
                    '\uff6a',
                    //end by sj
                    '\uff66',
                    '\uff65',
                    '\uff70'
                ];
                this._fullkanaSmall = [
                    '\uff67',
                    '\uff68',
                    '\uff69',
                    '\uff6a',
                    '\uff6b',
                    '\uff6c',
                    '\uff6d',
                    '\uff6e',
                    '\uff6f'
                ];
                // Voiced (accent) map table (Japanese)...
                ///   Mapping table for accents for the Japanese language.
                this._accentkana = [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    // a
                    -1,
                    1,
                    -1,
                    1,
                    -1,
                    1,
                    -1,
                    1,
                    -1,
                    1,
                    // ka
                    -1,
                    1,
                    -1,
                    1,
                    -1,
                    1,
                    -1,
                    1,
                    -1,
                    1,
                    // sa
                    -1,
                    1,
                    -1,
                    1,
                    0,
                    -1,
                    1,
                    -1,
                    1,
                    -1,
                    1,
                    // ta
                    0,
                    0,
                    0,
                    0,
                    0,
                    // na
                    -3,
                    1,
                    2,
                    -3,
                    1,
                    2,
                    -3,
                    1,
                    2,
                    -3,
                    1,
                    2,
                    -3,
                    1,
                    2,
                    // ha
                    0,
                    0,
                    0,
                    0,
                    0,
                    // ma
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    // ya
                    0,
                    0,
                    0,
                    0,
                    0,
                    // ra
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    // wa,...un
                    1,
                    0,
                    0,
                    1,
                    1,
                    1,
                    1,
                    0,
                    0
                ];
                // Special quotations for FarEast...
                this._feQuotes = [
                    '\u2018',
                    '\u2019',
                    '\u201c',
                    '\u201d'
                ];
                // Katakana & Hiragana mixed characters (Japanese)...
                this._jpnMixed = [
                    '\u30fc'
                ];
                // Full / Half width special character map table...
                this._jpnSpecialFull = [
                    '\u3000',
                    // Space
                    '\u3001',
                    // Comma
                    '\u3002',
                    // Stop (Period)
                    '\u300c',
                    // Left bracket
                    '\u300d',
                    // Right bracket
                    '\u201c',
                    // Double Quotes
                    '\u201d',
                    //     "
                    '\u2018',
                    // Single Quotes
                    '\u2019',
                    //	   "
                    '\u309b',
                    // JPN Voiced (heavy)
                    '\u309c',
                    // JPN Voiced (light)
                    '\uffe5'
                ];// yen mark !

                this._jpnSpecialHalf = [
                    '\u0020',
                    // Space
                    '\uff64',
                    // Comma
                    '\uff61',
                    // Stop (Period)
                    '\uff62',
                    // Left bracket
                    '\uff63',
                    // Right bracket
                    '\u0022',
                    // Double Quotes
                    '\u0022',
                    //     "
                    '\u0027',
                    // Single Quotes
                    '\u0027',
                    //	   "
                    '\uff9e',
                    // JPN Voiced (heavy)
                    '\uff9f',
                    // JPN Voiced (light)
                    '\u00a5'
                ];// yen mark !

                var _charType = new CharType();
                this._mwtable = [
                    _charType.Symbol | _charType.FullWidth,
                    _charType.Numeric | _charType.FullWidth,
                    _charType.Symbol | _charType.FullWidth,
                    _charType.UpperCase | _charType.FullWidth,
                    _charType.Symbol | _charType.FullWidth,
                    _charType.LowerCase | _charType.FullWidth,
                    _charType.Symbol | _charType.FullWidth,
                    _charType.FarEastPunctation,
                    _charType.Katakana,
                    _charType.Hangul,
                    _charType.Symbol | _charType.FullWidth,
                    _charType.Symbol
                ];
            }
            return CharCategory;
        })();
        input.CharCategory = CharCategory;
        var CharProcess = (function () {
            function CharProcess() {
                this.CharCategory = new CharCategory();
                this.Ctype = new CharType();
            }
            CharProcess.LowerKana = "\u3041\u3043\u3045\u3047\u3049\u3063\u3083\u3085\u3087\u308e\u30a1\u30a3\u30a5\u30a7\u30a9\u30c3\u30e3\u30e5\u30e7\u30ee\uff67\uff68\uff69\uff6a\uff6b\uff6c\uff6d\uff6e\uff6f\u30F5\u30F6\u3095\u3096";
            CharProcess.UpperKana = "\u3042\u3044\u3046\u3048\u304a\u3064\u3084\u3086\u3088\u308f\u30a2\u30a4\u30a6\u30a8\u30aa\u30c4\u30e4\u30e6\u30e8\u30ef\uff71\uff72\uff73\uff74\uff75\uff94\uff95\uff96\uff82\u30AB\u30B1\u304B\u3051";
            CharProcess.FullWidthSymbolArray = [
                //'\u3000',	//IDEOGRAPHIC SPACE
                '\u3001',
                //IDEOGRAPHIC COMMA
                '\u3002',
                //IDEOGRAPHIC FULL STOP
                '\uFF0C',
                //FULLWIDTH COMMA
                '\uFF0E',
                //FULLWIDTH FULL STOP
                '\u30FB',
                //KATAKANA MIDDLE DOT
                '\uFF1A',
                //FULLWIDTH COLON
                '\uFF1B',
                //FULLWIDTH SEMICOLON
                '\uFF1F',
                //FULLWIDTH QUESTION MARK
                '\uFF01',
                //FULLWIDTH EXCLAMATION MARK
                '\u309B',
                //KATAKANA-HIRAGANA VOICED SOUND MARK
                '\u309C',
                //KATAKANA-HIRAGANA SEMI-VOICED SOUND MARK
                '\u00B4',
                //ACUTE ACCENT
                '\uFF40',
                //FULLWIDTH GRAVE ACCENT
                '\u00A8',
                //DIAERESIS
                '\uFF3E',
                //FULLWIDTH CIRCUMFLEX ACCENT
                '\uFFE3',
                //FULLWIDTH MACRON
                '\uFF3F',
                //FULLWIDTH LOW LINE
                '\u30FD',
                //KATAKANA ITERATION MARK
                '\u30FE',
                //KATAKANA VOICED ITERATION MARK
                '\u309D',
                //HIRAGANA ITERATION MARK
                '\u309E',
                //HIRAGANA VOICED ITERATION MARK
                '\u3003',
                //DITTO MARK
                '\u4EDD',
                //<cjk>
                '\u3005',
                //IDEOGRAPHIC ITERATION MARK
                '\u3006',
                //IDEOGRAPHIC CLOSING MARK
                '\u3007',
                //IDEOGRAPHIC NUMBER ZERO
                '\u30FC',
                //KATAKANA-HIRAGANA PROLONGED SOUND MARK
                '\u2014',
                //EM DASH	Windows: U+2015
                '\u2010',
                //HYPHEN
                '\uFF0F',
                //FULLWIDTH SOLIDUS
                //'\u005C',	//REVERSE SOLIDUS	Fullwidth: U+FF3C
                '\u301C',
                //WAVE DASH	Windows: U+FF5E
                '\u2016',
                //DOUBLE VERTICAL LINE	Windows: U+2225
                '\uFF5C',
                //FULLWIDTH VERTICAL LINE
                '\u2026',
                //HORIZONTAL ELLIPSIS
                '\u2025',
                //TWO DOT LEADER
                '\u2018',
                //LEFT SINGLE QUOTATION MARK
                '\u2019',
                //RIGHT SINGLE QUOTATION MARK
                '\u201C',
                //LEFT DOUBLE QUOTATION MARK
                '\u201D',
                //RIGHT DOUBLE QUOTATION MARK
                '\uFF08',
                //FULLWIDTH LEFT PARENTHESIS
                '\uFF09',
                //FULLWIDTH RIGHT PARENTHESIS
                '\u3014',
                //LEFT TORTOISE SHELL BRACKET
                '\u3015',
                //RIGHT TORTOISE SHELL BRACKET
                '\uFF3B',
                //FULLWIDTH LEFT SQUARE BRACKET
                '\uFF3D',
                //FULLWIDTH RIGHT SQUARE BRACKET
                '\uFF5B',
                //FULLWIDTH LEFT CURLY BRACKET
                '\uFF5D',
                //FULLWIDTH RIGHT CURLY BRACKET
                '\u3008',
                //LEFT ANGLE BRACKET
                '\u3009',
                //RIGHT ANGLE BRACKET
                '\u300A',
                //LEFT DOUBLE ANGLE BRACKET
                '\u300B',
                //RIGHT DOUBLE ANGLE BRACKET
                '\u300C',
                //LEFT CORNER BRACKET
                '\u300D',
                //RIGHT CORNER BRACKET
                '\u300E',
                //LEFT WHITE CORNER BRACKET
                '\u300F',
                //RIGHT WHITE CORNER BRACKET
                '\u3010',
                //LEFT BLACK LENTICULAR BRACKET
                '\u3011',
                //RIGHT BLACK LENTICULAR BRACKET
                '\uFF0B',
                //FULLWIDTH PLUS SIGN
                '\u2212',
                //MINUS SIGN	Windows: U+FF0D
                '\u00B1',
                //PLUS-MINUS SIGN
                '\u00D7',
                //MULTIPLICATION SIGN
                '\u00F7',
                //DIVISION SIGN
                '\uFF1D',
                //FULLWIDTH EQUALS SIGN
                '\u2260',
                //NOT EQUAL TO
                '\uFF1C',
                //FULLWIDTH LESS-THAN SIGN
                '\uFF1E',
                //FULLWIDTH GREATER-THAN SIGN
                '\u2266',
                //LESS-THAN OVER EQUAL TO
                '\u2267',
                //GREATER-THAN OVER EQUAL TO
                '\u221E',
                //INFINITY
                '\u2234',
                //THEREFORE
                '\u2642',
                //MALE SIGN
                '\u2640',
                //FEMALE SIGN
                '\u00B0',
                //DEGREE SIGN
                '\u2032',
                //PRIME
                '\u2033',
                //DOUBLE PRIME
                '\u2103',
                //DEGREE CELSIUS
                '\uFFE5',
                //FULLWIDTH YEN SIGN
                '\uFF04',
                //FULLWIDTH DOLLAR SIGN
                '\u00A2',
                //CENT SIGN	Windows: U+FFE0
                '\u00A3',
                //POUND SIGN	Windows: U+FFE1
                '\uFF05',
                //FULLWIDTH PERCENT SIGN
                '\uFF03',
                //FULLWIDTH NUMBER SIGN
                '\uFF06',
                //FULLWIDTH AMPERSAND
                '\uFF0A',
                //FULLWIDTH ASTERISK
                '\uFF20',
                //FULLWIDTH COMMERCIAL AT
                '\u00A7',
                //SECTION SIGN
                '\u2606',
                //WHITE STAR
                '\u2605',
                //BLACK STAR
                '\u25CB',
                //WHITE CIRCLE
                '\u25CF',
                //BLACK CIRCLE
                '\u25CE',
                //BULLSEYE
                '\u25C7',
                //WHITE DIAMOND
                '\u25C6',
                //BLACK DIAMOND
                '\u25A1',
                //WHITE SQUARE
                '\u25A0',
                //BLACK SQUARE
                '\u25B3',
                //WHITE UP-POINTING TRIANGLE
                '\u25B2',
                //BLACK UP-POINTING TRIANGLE
                '\u25BD',
                //WHITE DOWN-POINTING TRIANGLE
                '\u25BC',
                //BLACK DOWN-POINTING TRIANGLE
                '\u203B',
                //REFERENCE MARK
                '\u3012',
                //POSTAL MARK
                '\u2192',
                //RIGHTWARDS ARROW
                '\u2190',
                //LEFTWARDS ARROW
                '\u2191',
                //UPWARDS ARROW
                '\u2193',
                //DOWNWARDS ARROW
                '\u3013',
                //GETA MARK
                '\uFF07',
                //FULLWIDTH APOSTROPHE
                '\uFF02',
                //FULLWIDTH QUOTATION MARK	[2000]
                '\uFF0D',
                //FULLWIDTH HYPHEN-MINUS	[2000]
                //'\u007E',	//TILDE	[2000]	Fullwidth: U+FF5E
                '\u3033',
                //VERTICAL KANA REPEAT MARK UPPER HALF	[2000]
                '\u3034',
                //VERTICAL KANA REPEAT WITH VOICED SOUND MARK UPPER HALF	[2000]
                '\u3035',
                //VERTICAL KANA REPEAT MARK LOWER HALF	[2000]
                '\u303B',
                //VERTICAL IDEOGRAPHIC ITERATION MARK	[2000]	[Unicode3.2]
                '\u303C',
                //MASU MARK	[2000]	[Unicode3.2]
                '\u30FF',
                //KATAKANA DIGRAPH KOTO	[2000]	[Unicode3.2]
                '\u309F',
                //HIRAGANA DIGRAPH YORI	[2000]	[Unicode3.2]
                '\u2208',
                //ELEMENT OF	[1983]
                '\u220B',
                //CONTAINS AS MEMBER	[1983]
                '\u2286',
                //SUBSET OF OR EQUAL TO	[1983]
                '\u2287',
                //SUPERSET OF OR EQUAL TO	[1983]
                '\u2282',
                //SUBSET OF	[1983]
                '\u2283',
                //SUPERSET OF	[1983]
                '\u222A',
                //UNION	[1983]
                '\u2229',
                //INTERSECTION	[1983]
                '\u2284',
                //NOT A SUBSET OF	[2000]
                '\u2285',
                //NOT A SUPERSET OF	[2000]
                '\u228A',
                //SUBSET OF WITH NOT EQUAL TO	[2000]
                '\u228B',
                //SUPERSET OF WITH NOT EQUAL TO	[2000]
                '\u2209',
                //NOT AN ELEMENT OF	[2000]
                '\u2205',
                //EMPTY SET	[2000]
                '\u2305',
                //PROJECTIVE	[2000]
                '\u2306',
                //PERSPECTIVE	[2000]
                '\u2227',
                //LOGICAL AND	[1983]
                '\u2228',
                //LOGICAL OR	[1983]
                '\u00AC',
                //NOT SIGN	[1983]	Windows: U+FFE2
                '\u21D2',
                //RIGHTWARDS DOUBLE ARROW	[1983]
                '\u21D4',
                //LEFT RIGHT DOUBLE ARROW	[1983]
                '\u2200',
                //FOR ALL	[1983]
                '\u2203',
                //THERE EXISTS	[1983]
                '\u2295',
                //CIRCLED PLUS	[2000]
                '\u2296',
                //CIRCLED MINUS	[2000]
                '\u2297',
                //CIRCLED TIMES	[2000]
                '\u2225',
                //PARALLEL TO	[2000]
                '\u2226',
                //NOT PARALLEL TO	[2000]
                '\u2985',
                //LEFT WHITE PARENTHESIS	[2000]	[Unicode3.2]
                '\u2986',
                //RIGHT WHITE PARENTHESIS	[2000]	[Unicode3.2]
                '\u3018',
                //LEFT WHITE TORTOISE SHELL BRACKET	[2000]
                '\u3019',
                //RIGHT WHITE TORTOISE SHELL BRACKET	[2000]
                '\u3016',
                //LEFT WHITE LENTICULAR BRACKET	[2000]
                '\u3017',
                //RIGHT WHITE LENTICULAR BRACKET	[2000]
                '\u2220',
                //ANGLE	[1983]
                '\u22A5',
                //UP TACK	[1983]
                '\u2312',
                //ARC	[1983]
                '\u2202',
                //PARTIAL DIFFERENTIAL	[1983]
                '\u2207',
                //NABLA	[1983]
                '\u2261',
                //IDENTICAL TO	[1983]
                '\u2252',
                //APPROXIMATELY EQUAL TO OR THE IMAGE OF	[1983]
                '\u226A',
                //MUCH LESS-THAN	[1983]
                '\u226B',
                //MUCH GREATER-THAN	[1983]
                '\u221A',
                //SQUARE ROOT	[1983]
                '\u223D',
                //REVERSED TILDE 	[1983]
                '\u221D',
                //PROPORTIONAL TO	[1983]
                '\u2235',
                //BECAUSE	[1983]
                '\u222B',
                //INTEGRAL	[1983]
                '\u222C',
                //DOUBLE INTEGRAL	[1983]
                '\u2262',
                //NOT IDENTICAL TO	[2000]
                '\u2243',
                //ASYMPTOTICALLY EQUAL TO	[2000]
                '\u2245',
                //APPROXIMATELY EQUAL TO	[2000]
                '\u2248',
                //ALMOST EQUAL TO	[2000]
                '\u2276',
                //LESS-THAN OR GREATER-THAN	[2000]
                '\u2277',
                //GREATER-THAN OR LESS-THAN	[2000]
                '\u2194',
                //LEFT RIGHT ARROW	[2000]
                '\u212B',
                //ANGSTROM SIGN	[1983]
                '\u2030',
                //PER MILLE SIGN	[1983]
                '\u266F',
                //MUSIC SHARP SIGN	[1983]
                '\u266D',
                //MUSIC FLAT SIGN	[1983]
                '\u266A',
                //EIGHTH NOTE	[1983]
                '\u2020',
                //DAGGER	[1983]
                '\u2021',
                //DOUBLE DAGGER	[1983]
                '\u00B6',
                //PILCROW SIGN	[1983]
                '\u266E',
                //MUSIC NATURAL SIGN	[2000]
                '\u266B',
                //BEAMED EIGHTH NOTES	[2000]
                '\u266C',
                //BEAMED SIXTEENTH NOTES	[2000]
                '\u2669',
                //QUARTER NOTE	[2000]
                '\u25EF',
                //LARGE CIRCLE	[1983]
                // Added by shen yuan at 2005-10-26
                '\uFF3C',
                // '£Ü'
                '\uFF5E',
                // '¡«'
                '\uFFE0',
                // '¡E
                '\uFFE1',
                // '¡E
                '\uFFE2',
                // '©V'
                '\u2015'
            ];
            CharProcess.HalfWidthSymbolArray = [
                '\u005C',
                //REVERSE SOLIDUS	Fullwidth: U+FF3C
                '\u007E',
                //TILDE	[2000]	Fullwidth: U+FF5E
                //'\u00AC',	//NOT SIGN	[1983]	Windows: U+FFE2
                //'\u00B6'	//PILCROW SIGN	[1983]
                // Added by shen yuan at 2005-10-26
                '\u0021',
                // '! '
                '\u0022',
                // '" '
                '\u0023',
                // '# '
                '\u0024',
                // '$ '
                '\u0025',
                // '% '
                '\u0026',
                // '& '
                '\u0027',
                // '' '
                '\u0028',
                // '( '
                '\u0029',
                // ') '
                '\u002A',
                // '* '
                '\u002B',
                // '+ '
                '\u002C',
                // ', '
                '\u002D',
                // '- '
                '\u002E',
                // '. '
                '\u002F',
                // '/ '
                '\u003A',
                // ': '
                '\u003B',
                // '; '
                '\u003C',
                // '<'
                '\u003D',
                // '= '
                '\u003E',
                // '>'
                '\u003F',
                // '? '
                '\u0040',
                // '@ '
                '\u005B',
                // '[ '
                '\u005D',
                // '] '
                '\u005E',
                // '^ '
                '\u005F',
                // '_ '
                '\u0060',
                // '` '
                '\u007B',
                // '{ '
                '\u007C',
                // '| '
                '\u007D',
                // '} '
                '\uFF61',
                // '? '
                '\uFF62',
                // Halfwidth Left Corner Bracket
                '\uFF63',
                // Halfwidth Right Corner Bracket
                '\uFF64',
                // '¡E
                '\uFF65',
                // '£¤ '
                '\u00A1',
                '\u00A4',
                '\u00A5'
            ];
            CharProcess.CharEx = new CharProcess();
            CharProcess.prototype.ToHalfKatakana = function (c) {
                var result = "";
                if(this.IsFullWidth(c)) {
                    if(this.IsKatakana(c)) {
                        var katakana = c;
                        var n = katakana.charCodeAt(0) - (this.CharCategory._charstarts[62].charCodeAt(0) + 1);
                        if(n < 0 || n > 91) {
                            return katakana;
                        }
                        katakana = this.CharCategory._fullkana[n];
                        var accent = this.CharCategory._accentkana[n];
                        if(accent > 0) {
                            //accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0) ;
                            katakana = katakana + String.fromCharCode(accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0));
                        }
                        result = katakana;
                    } else if(this.IsHiragana(c)) {
                        var katakana = String.fromCharCode(c.charCodeAt(0) - this.CharCategory._charstarts[61].charCodeAt(0) + this.CharCategory._charstarts[62].charCodeAt(0));
                        var n = katakana.charCodeAt(0) - (this.CharCategory._charstarts[62].charCodeAt(0) + 1);
                        if(n < 0 || n > 91) {
                            return katakana;
                        }
                        katakana = this.CharCategory._fullkana[n];
                        var accent = this.CharCategory._accentkana[n];
                        if(accent > 0) {
                            //accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0) ;
                            katakana = katakana + String.fromCharCode(accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0));
                        }
                        result = katakana;
                    }
                } else {
                    if(this.IsKatakana(c)) {
                        result = c;
                    }
                }
                return result;
            };
            CharProcess.prototype.GetCharType = function (c) {
                var ctype = this.Ctype.OtherChar;
                var block = this.BelongTo(c);
                if(c == '\u007f' || ('\u0000' <= c && c <= '\u001f') || ('\u0080' <= c && c <= '\u009f')) {
                    return this.Ctype.Control;
                }
                if('A' <= c && c <= 'Z') {
                    return this.Ctype.UpperCase;
                }
                if('a' <= c && c <= 'z') {
                    return this.Ctype.LowerCase;
                }
                if('0' <= c && c <= '9') {
                    return this.Ctype.Numeric;
                }
                //modified by sj
                //the logic that charex call textfilter is wrong
                //	var tFilter = new TextFilter(true,true,"");
                //	if (tFilter.IsSymbol(c))
                //	{
                //		ctype = this.Ctype.Symbol;
                //	}
                if(this.IsFullWidthSymbol(c) || this.IsHalfWidthSymbol(c)) {
                    ctype = this.Ctype.Symbol;
                }
                //end by sj
                if(c.charCodeAt(0) == 8216 || c.charCodeAt(0) == 8217 || c.charCodeAt(0) == 8220 || c.charCodeAt(0) == 8221) {
                    ctype = this.Ctype.Punctuation;
                }
                if(c.charCodeAt(0) == 12288) {
                    ctype = this.Ctype.Space;
                }
                switch(this.CharCategory.Blocks[block]) {
                    case 'HALFWIDTH_AND_FULLWIDTH_FORMS':
                        return this.MultiWidthDetails(c);
                    case 'KATAKANA':
                        return this.Ctype.Katakana | this.Ctype.FullWidth;
                    case 'HIRAGANA':
                        return this.Ctype.Hiragana | this.Ctype.FullWidth;
                }
                if(this.IsFarEastBlock(block, c)) {
                    ctype |= this.Ctype.FullWidth;
                }
                return ctype;
            };
            CharProcess.prototype.IsCharOfType = function (c, type) {
                return this.GetCharType(c) == type;
            };
            CharProcess.prototype.IsMultiWidth = function (c) {
                var block = this.BelongTo(c);
                var category = this.CharCategory.Blocks[block];
                return (category == 'KATAKANA' || category == 'CJK_SYMBOLS_AND_PUNCTUATION' || category == 'HALFWIDTH_AND_FULLWIDTH_FORMS' || (category == 'BASIC_LATIN' && c >= '\u0020'));
            };
            CharProcess.prototype.IsFullWidthSymbol = function (c) {
                for(var i = 0; i < CharProcess.FullWidthSymbolArray.length; i++) {
                    if(c === CharProcess.FullWidthSymbolArray[i]) {
                        return true;
                    }
                }
                return false;
            };
            CharProcess.prototype.IsHalfWidthSymbol = function (c) {
                for(var i = 0; i < CharProcess.HalfWidthSymbolArray.length; i++) {
                    if(c === CharProcess.HalfWidthSymbolArray[i]) {
                        return true;
                    }
                }
                return false;
            };
            CharProcess.prototype.IsFullWidth = function (c) {
                if(this.IsFullWidthSymbol(c)) {
                    return true;
                }
                if(this.IsHalfWidthSymbol(c)) {
                    return false;
                }
                var block = this.BelongTo(c);
                var bFullWidth = this.IsFarEastBlock(block, c);
                if(this.CharCategory.Blocks[block] == 'HALFWIDTH_AND_FULLWIDTH_FORMS') {
                    bFullWidth = ((this.MultiWidthDetails(c) & this.Ctype.FullWidth) == this.Ctype.FullWidth);
                }
                return bFullWidth;
            };
            CharProcess.prototype.IsSurrogatePair = function (c) {
                if(c.charCodeAt(0) >= '\uD800'.charCodeAt(0) && c.charCodeAt(0) <= '\uDBFF'.charCodeAt(0) && c.charCodeAt(1) >= '\uDC00'.charCodeAt(0) && c.charCodeAt(1) <= '\uDFFF'.charCodeAt(0)) {
                    return true;
                }
                return false;
            };
            CharProcess.prototype.IsSurrogate = function (c) {
                return c != null && ((c.charCodeAt(0) >= '\uD800'.charCodeAt(0)) && c.charCodeAt(0) <= '\uDFFF'.charCodeAt(0));
            };
            CharProcess.prototype.IsOther = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.OtherChar);
            };
            CharProcess.prototype.IsControl = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Control);
            };
            CharProcess.prototype.IsKatakana = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Katakana);
            };
            CharProcess.prototype.IsSmallHalfKatakana = function (c) {
                var _halfkanaSmall = new Array('\u30a1', '\u30a3', '\u30a5', '\u30a7', '\u30a9', // small a
                '\u30e3', '\u30e5', '\u30e7', // small ya
                '\u30c3', '\u30ee');
                // small tu, ƒŽ
                var c1 = c;
                if(c.charCodeAt(0) > this.CharCategory.KANAHALFSTART) {
                    c1 = this.CharCategory._halfkana[c.charCodeAt(0) - this.CharCategory.KANAHALFSTART];
                }
                for(var i = 0; i < _halfkanaSmall.length; i++) {
                    if(c1 == _halfkanaSmall[i]) {
                        return true;
                    }
                }
                return false;
            };
            CharProcess.prototype.IsHiragana = function (c) {
                return (((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Hiragana) || //- Masa (2002/12/24) Japan wanted this special support --------------------------------------------
                (this.CharCategory._jpnMixed[0] == c));
                //--------------------------------------------------------------------------------------------------
                            };
            CharProcess.prototype.IsShiftJIS = function (c) {
                //var unicode = c.charCodeAt(0);
                //var offset = Math.floor(unicode / 8);
                //var mod = unicode % 8;
                //var flagString = CharProcess.ShiftJISCode.substr(offset * 2, 2);
                //var binaryString = parseInt(flagString, 16).toString(2);
                //while (binaryString.length < 8)
                //{
                //    binaryString = "0" + binaryString;
                //}
                //if (binaryString.substr(mod, 1) == "1")
                //{
                //    return true;
                //}
                return false;
            };
            CharProcess.prototype.IsJISX0208 = function (c) {
                //var unicode = c.charCodeAt(0);
                //var offset = Math.floor(unicode / 8);
                //var mod = unicode % 8;
                //var flagString = CharProcess.JISX0208Code.substr(offset * 2, 2);
                //var binaryString = parseInt(flagString, 16).toString(2);
                //while (binaryString.length < 8)
                //{
                //    binaryString = "0" + binaryString;
                //}
                //if (binaryString.substr(mod, 1) == "1")
                //{
                //    return true;
                //}
                return false;
            };
            CharProcess.prototype.IsDigit = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Numeric);
            };
            CharProcess.prototype.IsPunctuation = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Punctuation);
            };
            CharProcess.prototype.IsMathSymbol = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.MathSymbol);
            };
            CharProcess.prototype.IsSymbol = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Symbol);
            };
            CharProcess.prototype.IsLower = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.LowerCase);
            };
            CharProcess.prototype.IsUpper = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.UpperCase);
            };
            CharProcess.prototype.IsDigitOrSymbol = function (c) {
                return (this.IsDigit(c) || this.IsMathSymbol(c));
            };
            CharProcess.prototype.IsAlphabet = function (c) {
                return (this.IsUpper(c) || this.IsLower(c));
            };
            CharProcess.prototype.IsAlphaOrDigit = function (c) {
                return (this.IsUpper(c) || this.IsLower(c) || this.IsDigit(c));
            };
            CharProcess.prototype.IsUpperKana = function (c) {
                return !this.IsLowerKana(c);
            };
            CharProcess.prototype.IsLowerKana = function (c) {
                return (CharProcess.LowerKana.search(c) != -1);
            };
            CharProcess.prototype.HasLowerKana = function (c) {
                return (CharProcess.UpperKana.search(c) != -1 || this.IsLowerKana(c));
            };
            CharProcess.prototype.ToUpperKana = function (c) {
                var index = CharProcess.LowerKana.search(c);
                return (index == -1) ? c : CharProcess.UpperKana.substr(index, 1);
            };
            CharProcess.prototype.ToLowerKana = function (c) {
                var index = CharProcess.UpperKana.search(c);
                if(index >= CharProcess.UpperKana.length - 4 && index < CharProcess.UpperKana.length) {
                    return c;
                }
                return (index == -1) ? c : CharProcess.LowerKana.substr(index, 1);
            };
            CharProcess.prototype.ToLower = function (c) {
                if(this.IsUpper(c)) {
                    return String.fromCharCode(c.charCodeAt(0) + 32);
                }
                return c;
            };
            CharProcess.prototype.ToUpper = function (c) {
                if(this.IsLower(c)) {
                    return String.fromCharCode(c.charCodeAt(0) - 32);
                }
                return c;
            };
            CharProcess.prototype.IsSpace = function (c) {
                return c == '\u0020' || c === '\u3000';
            };
            CharProcess.prototype.ToFullWidth = function (c) {
                var retObj = {
                    text: "",
                    processedAll: false
                };
                retObj.text = c;
                retObj.processedAll = false;
                if(c.length == 0) {
                    return retObj;
                }
                var c1 = c.Substring(0, 1);
                if(this.IsMultiWidth(c1)) {
                    //
                    // Latin basic characters can be directly converted
                    // by making a few shifts...
                    //
                    if(c1 < this.CharCategory._charstarts[1])//LATIN_1_SUPPLEMENT
                     {
                        //
                        // Funny why 'space' was left out of this category.
                        //
                        if(c1 == '\u0020') {
                            retObj.text = '\u3000';
                            return retObj;
                        }
                        var temp = '\u0021';//!

                        retObj.text = String.fromCharCode(c1.charCodeAt(0) - temp.charCodeAt(0) + (this.CharCategory._charstarts[81].charCodeAt(0) + 1))//Blocks.HALFWIDTH_AND_FULLWIDTH_FORMS
                        ;
                        return retObj;
                    }
                    //
                    //- pickup a direct map from the table...
                    //
                    if((this.MultiWidthDetails(c1) & this.Ctype.Katakana) == this.Ctype.Katakana) {
                        if(c1.charCodeAt(0) < this.CharCategory.KANAHALFSTART) {
                            var c2 = this.GetFullHalfWidthSpecialChar(c1, true);
                            retObj.text = (c2 !== "") ? c2 : c1;
                            return retObj;
                        }
                        c1 = this.CharCategory._halfkana[c1.charCodeAt(0) - this.CharCategory.KANAHALFSTART];
                        //
                        // Handle the soundex here....
                        //
                        if(c.length < 2) {
                            retObj.text = c1;
                            return retObj;
                        }
                        var daku = c.charCodeAt(1) - (this.CharCategory.KATAKANA_VOICED.charCodeAt(0) - 1);// should be KATAKANA_VOICED or KATAKANA_SEMIVOICED.

                        if(daku == 1 || daku == 2) {
                            retObj.processedAll = true;
                            var accent = this.CharCategory._accentkana[(c1.charCodeAt(0) - (this.CharCategory._charstarts[62].charCodeAt(0) + 1))];//Blocks.KATAKANA

                            if(accent != 0) {
                                if((Math.abs(accent) & 2) == daku) {
                                    c1 = String.fromCharCode(c1.charCodeAt(0) + 1);
                                }
                                c1 = String.fromCharCode(c1.charCodeAt(0) + 1);
                            }
                        }
                        //add by sj for bug 2955
                        if(daku == 1 && c1 == '\u30A6') {
                            c1 = '\u30F4';
                        }
                        //end by sj
                                            }
                }
                retObj.text = c1;
                return retObj;
                //return c1;
                            };
            CharProcess.prototype.ToHalfWidth = function (c) {
                //
                // Need to return only the first character.
                //
                return this.ToHalfWidthEx(c);
            };
            CharProcess.prototype.ToHalfWidthEx = function (c) {
                var ctype = this.GetCharType(c);
                var multiWidth = this.IsMultiWidth(c);
                //
                // First filter out half width characters and characters that
                // are not of CJK groups.
                if((ctype & this.Ctype.FullWidth) == this.Ctype.FullWidth) {
                    switch(ctype & ~this.Ctype.FullWidth) {
                        case this.Ctype.Punctuation:
                        case this.Ctype.UpperCase:
                        case this.Ctype.LowerCase:
                        case this.Ctype.Symbol:
                        case this.Ctype.Numeric:
                        case this.Ctype.MathSymbol:
 {
                                var c1 = this.GetFullHalfWidthSpecialChar(c, false);
                                if(c1 !== "") {
                                    c = c1;
                                } else {
                                    if(multiWidth) {
                                        var temp = '\u0021';//!

                                        //c = (char)(( c - (_charstarts[(int)Blocks.HALFWIDTH_AND_FULLWIDTH_FORMS] + 1) ) + '\u0021');
                                        c = String.fromCharCode(c.charCodeAt(0) - (this.CharCategory._charstarts[81].charCodeAt(0) + 1) + temp.charCodeAt(0))//Blocks.HALFWIDTH_AND_FULLWIDTH_FORMS
                                        ;
                                    }
                                }
                            }
                            break;
                        case this.Ctype.Katakana:
 {
                                var n = c.charCodeAt(0) - (this.CharCategory._charstarts[62].charCodeAt(0) + 1);
                                if(n < 0 || n > 91) {
                                    return c;
                                }
                                c = this.CharCategory._fullkana[n];
                                var accent = this.CharCategory._accentkana[n];
                                if(accent > 0) {
                                    //accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0) ;
                                    c = c + String.fromCharCode(accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0));
                                    return c;
                                }
                                //return new char[] { c, accent == 1 ? KATAKANA_VOICED : KATAKANA_SEMIVOICED };
                                                            }
                            break;
                        case this.Ctype.Space:
                            c = '\u0020';
                            break;
                            // (Masa, add Hangul support later... )
                                                    case this.Ctype.Hangul:
                            break;
                    }
                }
                return c;
            };
            CharProcess.prototype.ToKatakana = function (c) {
                //
                // Simply return the character if it isn't a hiragana.
                //
                if(!this.IsCharOfType(c, this.Ctype.Hiragana | this.Ctype.FullWidth)) {
                    return c;
                }
                //
                // Need to handle special characters here...
                //
                var c1 = this.GetFullHalfWidthSpecialChar(c, false);
                //			if( c == '\u309b' || c == '\u309c' )
                //				return (char)('\uff9e' + (c - '\u309b'));
                if(c1 !== "") {
                    return c1;
                }
                //return (char)( c - _charstarts[(int)Blocks.HIRAGANA] + _charstarts[(int)Blocks.KATAKANA] );
                return String.fromCharCode(c.charCodeAt(0) - this.CharCategory._charstarts[61].charCodeAt(0) + this.CharCategory._charstarts[62].charCodeAt(0));//Blocks.KATAKANA

            };
            CharProcess.prototype.ToHiragana = function (c) {
                //
                // Simply return the character if it isn't a hiragana.
                if(!this.IsKatakana(c)) {
                    return c;
                }
                // Convert to fullwidth Katakana.
                if(!this.IsFullWidth(c)) {
                    c = this.ToFullWidth(c).text;
                }
                //validate
                if(!this.IsCharOfType(c, this.Ctype.Katakana | this.Ctype.FullWidth)) {
                    return c;
                }
                //
                // Some fullwidth Katakana characters can't be expressed in Hiragaga
                // so mask it out.
                //
                //modified by sj for NKOI-8C7E84AA2
                //if (c >= '\u30f6' && c <= '\u30ff')
                //	return c;
                if(c >= '\u30f7' && c <= '\u30ff') {
                    return c;
                }
                if(c == '\u30f5') {
                    return '\u304b';
                }
                if(c == '\u30f6') {
                    return '\u3051';
                }
                //end by sj
                //return (char)( c - _charstarts[(int)Blocks.KATAKANA] + _charstarts[(int)Blocks.HIRAGANA] );
                return String.fromCharCode(c.charCodeAt(0) + this.CharCategory._charstarts[61].charCodeAt(0) - this.CharCategory._charstarts[62].charCodeAt(0));//Blocks.KATAKANA

            };
            CharProcess.prototype.ToBigHalfKatakana = function (c) {
                if(!this.IsSmallHalfKatakana(c)) {
                    return c;
                }
                var c1 = this.CharCategory._halfkana[c.charCodeAt(0) - this.CharCategory.KANAHALFSTART];
                c1 = String.fromCharCode(c1.charCodeAt(0) + 1);
                return c1;
            };
            CharProcess.prototype.BelongTo = function (c) {
                var bottom = 0;
                var top = 83;//this.CharCategory._charstarts.length;

                var current = top >> 1;
                //
                // Binary search used to find proper type.
                //
                while(top - bottom > 1) {
                    if(c >= this.CharCategory._charstarts[current]) {
                        bottom = current;
                    } else {
                        top = current;
                    }
                    current = (top + bottom) >> 1;
                }
                return current;
            };
            CharProcess.prototype.MultiWidthDetails = function (c) {
                var bottom = 0;
                var top = this.CharCategory._fullhalfblocks.length;
                var current = top >> 1;
                //
                // Binary search used to find proper type.
                //
                while(top - bottom > 1) {
                    if(c >= this.CharCategory._fullhalfblocks[current]) {
                        bottom = current;
                    } else {
                        top = current;
                    }
                    current = (top + bottom) >> 1;
                }
                return this.CharCategory._mwtable[current];
            };
            CharProcess.prototype.IsFarEastBlock = function (block, c) {
                switch(this.CharCategory.Blocks[block]) {
                    case 'CJK_COMPATIBILITY':
                    case 'CJK_COMPATIBILITY_FORMS':
                    case 'CJK_COMPATIBILITY_IDEOGRAPHS':
                    case 'CJK_RADICALS_SUPPLEMENT':
                    case 'CJK_SYMBOLS_AND_PUNCTUATION':
                    case 'CJK_UNIFIED_IDEOGRAPHS':
                    case 'CJK_UNIFIED_IDEOGRAPHS_EXTENSION':
                    case 'HALFWIDTH_AND_FULLWIDTH_FORMS':
                    case 'BOPOMOFO':
                    case 'BOPOMOFO_EXTENDED':
                    case 'HIRAGANA':
                    case 'KATAKANA':
                    case 'KANBUN':
                    case 'HANGUL_COMPATIBILITY_JAMO':
                    case 'HANGUL_JAMO':
                    case 'HANGUL_SYLLABLES':
                        return true;
                    default:
                        // Add comments by Yang at 14:28 March 6th 2008
                        // For fix the bug 9709
                        // There are some different requirements from InputMan Winform.
                        // No matter the current cultureinfo.
                        for(var i = 0; i < this.CharCategory._feQuotes.length; i++) {
                            if(c == this.CharCategory._feQuotes[i]) {
                                return true;
                            }
                        }
                        if(c.charCodeAt(0) > 255) {
                            return true;
                        }
                        if(c.charCodeAt(0) == 8216 || c.charCodeAt(0) == 8217 || c.charCodeAt(0) == 8220 || c.charCodeAt(0) == 8221) {
                            return true;
                        }
                        //			if (c.charCodeAt(0) == 8216 || c.charCodeAt(0) == 8217 ||
                        //			    c.charCodeAt(0) == 8220 || c.charCodeAt(0) == 8221)
                        //				return true;
                        //			if( c.charCodeAt(0) > 255 )
                        // End by Yang
                        break;
                }
                return false;
            };
            CharProcess.prototype.GetFullHalfWidthSpecialChar = function (c, toFull) {
                if(toFull == true) {
                    var srctable = this.CharCategory._jpnSpecialHalf;
                    var desttable = this.CharCategory._jpnSpecialFull;
                } else {
                    var srctable = this.CharCategory._jpnSpecialFull;
                    var desttable = this.CharCategory._jpnSpecialHalf;
                }
                var found = -1;
                var tempIndex = 0;
                while(tempIndex < srctable.length) {
                    if(srctable[tempIndex] == c) {
                        found = tempIndex;
                        break;
                    }
                    tempIndex++;
                }
                if(found != -1) {
                    if(tempIndex < desttable.length) {
                        return desttable[tempIndex];
                    }
                }
                return "";
            };
            return CharProcess;
        })();
        input.CharProcess = CharProcess;
        (function (FocusType) {
            FocusType._map = [];
            FocusType.None = 0;
            FocusType.Click = 1;
            FocusType.ContextMenu = 2;
            FocusType.ClientEvent = 3;
            FocusType.KeyExit = 4;
            FocusType.Default = 5;
            FocusType.SpinButton = 6;
            FocusType.DropDown = 7;
            FocusType.ImeInput = 8;
            FocusType.Left = 9;
            FocusType.Right = 10;
            FocusType.DragDrop = 11;
        })(input.FocusType || (input.FocusType = {}));
        var FocusType = input.FocusType;
        ;
        (function (DateCursorPosition) {
            DateCursorPosition._map = [];
            DateCursorPosition.Default = 0;
            DateCursorPosition.Era = 1;
            DateCursorPosition.Year = 2;
            DateCursorPosition.Month = 3;
            DateCursorPosition.Day = 4;
            DateCursorPosition.AMPM = 5;
            DateCursorPosition.Hour = 6;
            DateCursorPosition.Minute = 7;
            DateCursorPosition.Second = 8;
        })(input.DateCursorPosition || (input.DateCursorPosition = {}));
        var DateCursorPosition = input.DateCursorPosition;
        ;
        /**
        * Defines the CrLf mode which describes how to process the CrLf char.
        * @type {{NoControl: string, Filter: string, Cut: string}}
        */
        (function (CrLfMode) {
            CrLfMode._map = [];
            /**
            * Accepts all CrLf characters in copied, cut, or pasted strings.
            */
            CrLfMode.NoControl = 0;
            /**
            * Removes all CrLf characters in copied, cut, or pasted strings.
            */
            CrLfMode.Filter = 1;
            /**
            * Cuts the following strings from the first CrLf character in copied, cut, and pasted strings.
            */
            CrLfMode.Cut = 2;
        })(input.CrLfMode || (input.CrLfMode = {}));
        var CrLfMode = input.CrLfMode;
        ;
        /**
        * Specifies how the literal in content is held in the clipboard.
        * @type {{IncludeLiterals: string, ExcludeLiterals: string}}
        */
        (function (ClipContent) {
            ClipContent._map = [];
            /**
            * Literals are included.
            */
            ClipContent.IncludeLiterals = 0;
            /**
            * Literals are excluded.
            */
            ClipContent.ExcludeLiterals = 1;
        })(input.ClipContent || (input.ClipContent = {}));
        var ClipContent = input.ClipContent;
        ;
        (function (EditMode) {
            EditMode._map = [];
            EditMode.Insert = 0;
            EditMode.Overwrite = 1;
            EditMode.FixedInsert = 2;
            EditMode.FixedOverwrite = 3;
        })(input.EditMode || (input.EditMode = {}));
        var EditMode = input.EditMode;
        ;
        (function (ShowLiterals) {
            ShowLiterals._map = [];
            ShowLiterals.Always = 1;
            ShowLiterals.PostDisplay = 2;
            ShowLiterals.PreDisplay = 3;
        })(input.ShowLiterals || (input.ShowLiterals = {}));
        var ShowLiterals = input.ShowLiterals;
        ;
        (function (ExitOnLeftRightKey) {
            ExitOnLeftRightKey._map = [];
            ExitOnLeftRightKey.None = 0;
            ExitOnLeftRightKey.Left = 1;
            ExitOnLeftRightKey.Right = 2;
            ExitOnLeftRightKey.Both = 3;
        })(input.ExitOnLeftRightKey || (input.ExitOnLeftRightKey = {}));
        var ExitOnLeftRightKey = input.ExitOnLeftRightKey;
        ;
        /**
        * Specifies the type of selection text in control.
        * @type {{None: string, Field: string, All: string}}
        */
        (function (HighlightText) {
            HighlightText._map = [];
            /**
            * No selection specified.
            */
            HighlightText.None = 0;
            /**
            * Select the specified field.
            */
            HighlightText.Field = 1;
            /**
            * Select all the text.
            */
            HighlightText.All = 2;
        })(input.HighlightText || (input.HighlightText = {}));
        var HighlightText = input.HighlightText;
        ;
        (function (MouseButton) {
            MouseButton._map = [];
            MouseButton.Default = -1;
            MouseButton.Left = 0;
            MouseButton.Middle = 1;
            MouseButton.Right = 2;
        })(input.MouseButton || (input.MouseButton = {}));
        var MouseButton = input.MouseButton;
        ;
        (function (DropDownAlign) {
            DropDownAlign._map = [];
            DropDownAlign.Left = 1;
            DropDownAlign.Right = 2;
        })(input.DropDownAlign || (input.DropDownAlign = {}));
        var DropDownAlign = input.DropDownAlign;
        (function (ScrollBarMode) {
            ScrollBarMode._map = [];
            ScrollBarMode._map[0] = "Automatic";
            ScrollBarMode.Automatic = 0;
            ScrollBarMode._map[1] = "Fixed";
            ScrollBarMode.Fixed = 1;
        })(input.ScrollBarMode || (input.ScrollBarMode = {}));
        var ScrollBarMode = input.ScrollBarMode;
        (function (ScrollBars) {
            ScrollBars._map = [];
            ScrollBars._map[0] = "None";
            ScrollBars.None = 0;
            ScrollBars._map[1] = "Horizontal";
            ScrollBars.Horizontal = 1;
            ScrollBars._map[2] = "Vertical";
            ScrollBars.Vertical = 2;
            ScrollBars._map[3] = "Both";
            ScrollBars.Both = 3;
        })(input.ScrollBars || (input.ScrollBars = {}));
        var ScrollBars = input.ScrollBars;
        (function (ControlStatus) {
            ControlStatus._map = [];
            ControlStatus.Normal = 0;
            ControlStatus.Hover = 1;
            ControlStatus.Pressed = 2;
            ControlStatus.Focused = 4;
            ControlStatus.Disabled = 8;
        })(input.ControlStatus || (input.ControlStatus = {}));
        var ControlStatus = input.ControlStatus;
        (function (ExitKeys) {
            ExitKeys._map = [];
            ExitKeys.Tab = 1;
            ExitKeys.ShiftTab = 2;
            ExitKeys.NextControl = 3;
            ExitKeys.PreviousControl = 4;
            ExitKeys.Right = 5;
            ExitKeys.Left = 6;
            ExitKeys.CtrlRight = 7;
            ExitKeys.CtrlLeft = 8;
            ExitKeys.CharInput = 9;
        })(input.ExitKeys || (input.ExitKeys = {}));
        var ExitKeys = input.ExitKeys;
        ;
        (function (TabAction) {
            TabAction._map = [];
            TabAction.Control = 0;
            TabAction.Field = 1;
        })(input.TabAction || (input.TabAction = {}));
        var TabAction = input.TabAction;
        ;
        (function (Key) {
            Key._map = [];
            Key.BackSpace = 8;
            Key.Tab = 9;
            Key.Clear = 12;
            Key.Enter = 13;
            Key.Shift = 16;
            Key.Control = 17;
            Key.Alt = 18;
            Key.Pause = 19;
            Key.Caps_Lock = 20;
            Key.Escape = 27;
            Key.Space = 32;
            Key.PageUp = 33;
            Key.PageDown = 34;
            Key.End = 35;
            Key.Home = 36;
            Key.Left = 37;
            Key.Up = 38;
            Key.Right = 39;
            Key.Down = 40;
            Key.Select = 41;
            Key.Print = 42;
            Key.Execute = 43;
            Key.Insert = 45;
            Key.Delete = 46;
            Key.Help = 47;
            Key.equalbraceright = 48;
            Key.exclamonesuperior = 49;
            Key.quotedbltwosuperior = 50;
            Key.sectionthreesuperior = 51;
            Key.dollar = 52;
            Key.percent = 53;
            Key.ampersand = 54;
            Key.slashbraceleft = 55;
            Key.parenleftbracketleft = 56;
            Key.parenrightbracketright = 57;
            Key.A = 65;
            Key.B = 66;
            Key.C = 67;
            Key.D = 68;
            Key.E = 69;
            Key.F = 70;
            Key.G = 71;
            Key.H = 72;
            Key.I = 73;
            Key.J = 74;
            Key.K = 75;
            Key.L = 76;
            Key.M = 77;
            Key.N = 78;
            Key.O = 79;
            Key.P = 80;
            Key.Q = 81;
            Key.R = 82;
            Key.S = 83;
            Key.T = 84;
            Key.U = 85;
            Key.V = 86;
            Key.W = 87;
            Key.X = 88;
            Key.Y = 89;
            Key.Z = 90;
            Key.KP_0 = 96;
            Key.KP_1 = 97;
            Key.KP_2 = 98;
            Key.KP_3 = 99;
            Key.KP_4 = 100;
            Key.KP_5 = 101;
            Key.KP_6 = 102;
            Key.KP_7 = 103;
            Key.KP_8 = 104;
            Key.KP_9 = 105;
            Key.KP_Multiply = 106;
            Key.KP_Add = 107;
            Key.KP_Separator = 108;
            Key.KP_Subtract = 109;
            Key.KP_Decimal = 110;
            Key.KP_Divide = 111;
            Key.F1 = 112;
            Key.F2 = 113;
            Key.F3 = 114;
            Key.F4 = 115;
            Key.F5 = 116;
            Key.F6 = 117;
            Key.F7 = 118;
            Key.F8 = 119;
            Key.F9 = 120;
            Key.F10 = 121;
            Key.F11 = 122;
            Key.F12 = 123;
            Key.F13 = 124;
            Key.F14 = 125;
            Key.F15 = 126;
            Key.F16 = 127;
            Key.F17 = 128;
            Key.F18 = 129;
            Key.F19 = 130;
            Key.F20 = 131;
            Key.F21 = 132;
            Key.F22 = 133;
            Key.F23 = 134;
            Key.F24 = 135;
            Key.Num_Lock = 136;
            Key.Scroll_Lock = 137;
        })(input.Key || (input.Key = {}));
        var Key = input.Key;
        ;
        var BaseUIProcess = (function () {
            function BaseUIProcess() {
                this.isMulSelected = false;
                this.isDblClick = false;
                this.isTriClick = false;
                this.isOverWrite = false;
                this.moveFocusExitOnLastChar = false;
            }
            BaseUIProcess.prototype.GetInputElement = function () {
                return this.Owner.GetInputElement();
            };
            BaseUIProcess.prototype.GetElementId = function () {
                return this.Owner.GetInputElement().id;
            };
            BaseUIProcess.prototype.GetShowLiterals = function () {
                if(this.Owner.GetShowLiterals !== undefined) {
                    return this.Owner.GetShowLiterals();
                }
                return ShowLiterals.Always;
            };
            BaseUIProcess.prototype.SetCursorPositionAndSelection = /**
            * Get cursor start and end position according to the specified highlighttext and current text.
            */
            function (highlightText, text, cursorPos, startPos) {
                var retInfo = {
                };
                if(highlightText == true || highlightText == HighlightText.All) {
                    retInfo.SelectionStart = 0;
                    retInfo.SelectionEnd = text.GetLength();
                }
                return retInfo;
            };
            BaseUIProcess.prototype.Clear = /**
            * Clear the current value of the control.
            */
            function () {
                return null;
            };
            BaseUIProcess.prototype.Focus = /**
            * Handle the onfocus event.
            */
            function (data) {
                var text = data.Text;
                var displayText = data.DisplayText;
                var focusType = data.FocusType;
                var oText = data.Element;
                var highlightText = data.HighlightText;
                var cursorPos = data.CursorPosition;
                var retInfo = {
                };
                //Add comments by Ryan Wu at 19:22 Dec 7, 2005.
                //Maybe this is a bug? for we press tab key to get focus. If the original state is
                //selection then the current state is also state, thus this.isMulSelected is true.????
                this.isMulSelected = false;
                //the focusType is used to distribute the get focus type by Left key
                // or Right key or something else.
                if(focusType == FocusType.Click) {
                    retInfo.SelectionStart = Utility.GetCursorPosition(oText);
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                }
                //when get the focus, display the format.
                retInfo.Text = text;
                //Press tab key will set cursor start position to less than zero
                if(retInfo.SelectionStart == -1) {
                    retInfo.SelectionStart = 0;
                    retInfo.SelectionEnd = 0;
                } else //for example: Format is "yy/MM/dd", displayformat is "yyyy/MM/dd"
                if(retInfo.SelectionStart > retInfo.Text.GetLength()) {
                    retInfo.SelectionStart = retInfo.Text.GetLength();
                    retInfo.SelectionEnd = retInfo.Text.GetLength();
                } else if(retInfo.SelectionStart == displayText.GetLength()) {
                    retInfo.SelectionStart = retInfo.Text.GetLength();
                    retInfo.SelectionEnd = retInfo.Text.GetLength();
                }
                //the focusType is FocusType.Left it means that the focus is set by press the left key.
                // change by Sean Huang at 2008.12.05, for bug 992 -->
                //if (focusType == FocusType.Left)
                if(focusType == FocusType.Left && cursorPos == DateCursorPosition.Default)// end of Sean Huang <--
                 {
                    retInfo.SelectionStart = 0;
                    retInfo.SelectionEnd = 0;
                    //update by wuhao 2008-1-8 for fix bug 1362
                    //return retInfo;
                    //end by wuhao 2008-1-8 for fix bug 1362
                                    } else // change by Sean Huang at 2008.12.05, for bug 992 -->
                //else if (focusType == FocusType.Right)
                if(focusType == FocusType.Right && cursorPos == DateCursorPosition.Default)// end of Sean Huang <--
                 {
                    retInfo.SelectionStart = retInfo.Text.GetLength();
                    retInfo.SelectionEnd = retInfo.Text.GetLength();
                    //update by wuhao 2008-1-8 for fix bug 1362
                    //return retInfo;
                    //end by wuhao 2008-1-8 for fix bug 1362
                                    }
                //The selection is not determined by the HighlightText and CursorPosition property.
                if(highlightText == HighlightText.None && cursorPos == DateCursorPosition.Default) {
                    return retInfo;
                }
                //Add comments by Ryan Wu at 9:23 Oct. 18 2007.
                //For fix the bug#9065.
                if(focusType == FocusType.ContextMenu) {
                    return retInfo;
                }
                //end by Ryan Wu.
                //Add comments by Ryan Wu at 14:38 Oct. 11 2007.
                //For fix the bug#8998.
                //    //According to the HighlightText property and CursorPosition property to set the
                //	//selection.
                //	var ret = this.SetCursorPositionAndSelection(highlightText, retInfo.Text, cursorPos, retInfo.SelectionStart);
                var startPos = retInfo.SelectionStart == null ? data.SelectionStart : retInfo.SelectionStart;
                var ret = this.SetCursorPositionAndSelection(highlightText, retInfo.Text, cursorPos, startPos);
                //end by Ryan Wu.
                if(ret != null) {
                    retInfo.SelectionStart = ret.SelectionStart;
                    retInfo.SelectionEnd = ret.SelectionEnd;
                    retInfo.IsSelectionDeterminedByHighlightText = true;
                }
                //Add comments by Ryan Wu at 9:13 Oct. 18 2007.
                //For removing the useless code.
                //	//the focusType is FocusType.ClientEvent it means that the focus is set by ourself.
                //	if (focusType == FocusType.ClientEvent)
                //	{
                //		return retInfo;
                //	}
                //end by Ryan Wu.
                return retInfo;
            };
            BaseUIProcess.prototype.LoseFocus = /**
            * Handle the onblur event.
            */
            function (data) {
            };
            BaseUIProcess.prototype.MouseDown = /**
            * Handle the onmousedown event.
            */
            function (mouseButton) {
                var retInfo = {
                };
                this.isTriClick = false;
                //for triple click
                if(this.isDblClick && !Utility.GrapeCityTimeout && mouseButton == MouseButton.Left) {
                    this.isTriClick = true;
                    retInfo = this.SelectAll();
                }
                this.isDblClick = false;
                return retInfo;
            };
            BaseUIProcess.prototype.MouseUp = /**
            * Handle the onmouseup event.
            */
            // Frank Liu added the parameter "ctrlPressed" at 2013/06/27 for bug 881.
            function (obj, start, end, mouseButton, ctrlPressed) {
                var retInfo = {
                };
                if(this.isTriClick) {
                    Utility.SetSelection(obj, start, end);
                    return null;
                }
                //Add comments by Ryan Wu at 10:13 Sep. 13 2007.
                //For fix the bug "17. Ctrl+Click(select all text) will take no effects.".
                // Frank Liu fixed bug 881 at 2013/06/27.
                //if (!Utility.IsIE() && Utility.FuncKeysPressed.Ctrl) {
                if(ctrlPressed) {
                    retInfo = this.SelectAll();
                    Utility.SetSelection(obj, retInfo.SelectionStart, retInfo.SelectionEnd);
                    return retInfo;
                }
                //end by Ryan Wu.
                retInfo.SelectionStart = start;
                retInfo.SelectionEnd = end;
                if(mouseButton == MouseButton.Left) {
                    //bug#5675
                    //retInfo = GrapeCity_InputMan_GetCursorEndPos(obj, start);
                    retInfo.SelectionStart = Utility.GetSelectionStartPosition(obj);
                    retInfo.SelectionEnd = Utility.GetSelectionEndPosition(obj);
                }
                if(retInfo.SelectionStart != retInfo.SelectionEnd) {
                    this.isMulSelected = true;
                } else {
                    this.isMulSelected = false;
                }
                return retInfo;
            };
            BaseUIProcess.prototype.ProcessShortcutKey = /**
            * Handle the shortcut key event.
            */
            function (keyAction, readOnly, end, start) {
                var retInfo = {
                };
                //ShortCuts
                switch(keyAction) {
                    case "Clear":
                        //Clear
                        if(readOnly) {
                            retInfo.System = false;
                            return retInfo;
                        }
                        return this.Clear();
                    case "NextControl":
                        //NextControl
                        var ret = this.MoveControl(this.GetInputElement(), true, false, "NextControl");
                        if(ret != null) {
                            retInfo.EventInfo = ret.EventInfo;
                            retInfo.FocusType = ret.FocusType;
                            retInfo.FocusExit = true;
                        }
                        retInfo.System = false;
                        return retInfo;
                    case "PreviousControl":
                        //PreviousControl
                        var ret = this.MoveControl(this.GetInputElement(), false, false, "PreviousControl");
                        if(ret != null) {
                            retInfo.EventInfo = ret.EventInfo;
                            retInfo.FocusType = ret.FocusType;
                            retInfo.FocusExit = true;
                        }
                        retInfo.System = false;
                        return retInfo;
                    case "NextField":
                        //NextField
                        retInfo = this.MoveField(end, true);
                        return retInfo;
                    case "PreviousField":
                        //PreviousField
                        retInfo = this.MoveField(end, false);
                        return retInfo;
                    case "NextField/NextControl":
                        //NextField/NextControl
                        var retInfo = this.MoveFieldAndControl(end, true);
                        return retInfo;
                    case "PreviousField/PreviousControl":
                        //PreviousField/PreviousControl
                        var retInfo = this.MoveFieldAndControl(end, false);
                        return retInfo;
                }
            };
            BaseUIProcess.prototype.ProcessCharKeyInput = /**
            * Process char key input.
            */
            function (k, start, end, isExitOnLastChar, text) {
                return null;
            };
            BaseUIProcess.prototype.ProcessNavigatorKeyInput = /**
            * Prcess navigator key input.
            */
            function (k, editMode, clipContent, text, start, end, exitOnLeftRightKey, isExitOnLastChar) {
                var retInfo = {
                };
                switch(k) {
                    case //Insert
                    45:
                        if(editMode == EditMode.FixedInsert) {
                            this.isOverWrite = false;
                        } else if(editMode == EditMode.FixedOverwrite) {
                            this.isOverWrite = true;
                        } else {
                            this.isOverWrite = !this.isOverWrite;
                        }
                        retInfo.Overwrite = this.isOverWrite;
                        retInfo.System = false;
                        if(this.Format.Fields.fieldCount == 0) {
                            retInfo.System = true;
                        }
                        return retInfo;
                        //BackSpace
                                            case 8:
                        //Add comments by Ryan Wu at 14:23 Jul. 19 2006.
                        //Add text param only for number to judge whether the current text is zero.
                        //retInfo = this.ProcessBackSpace(start, end);
                        retInfo = this.ProcessBackSpace(start, end, text);
                        //end by Ryan Wu.
                        retInfo.System = false;
                        break;
                        //Delete
                        //note: when we use the viewinbrowser mode, we can't get the del keycode,but if
                        //we use the runtime mode ,we can get the del keycode. why????
                                            case 46:
                        //Add comments by Ryan Wu at 14:23 Jul. 19 2006.
                        //Add text param only for number to judge whether the current text is zero.
                        //retInfo = this.ProcessDelete(start, end);
                        retInfo = this.ProcessDelete(start, end, text);
                        //end by Ryan Wu.
                        retInfo.System = false;
                        break;
                        //Shift + Ctrl + End
                                            case 196643:
                        //Shift + Ctrl + Home
                                            case 196644:
                        //Shift + Ctrl + Left
                                            case 196645:
                        //Shift + Ctrl + Right
                                            case 196647:
                        //Shift + Pageup
                                            case 65569:
                        //Shift + Ctrl + Pageup
                                            case 196641:
                        //Shift + Pagedown
                                            case 65570:
                        //Shift + Ctrl + Pagedown
                                            case 196642:
                        if(k == 65569 || k == 196641) {
                            k = 196644;
                        } else if(k == 65570 || k == 196642) {
                            k = 196643;
                        }
                        //perform the Shift+Ctrl+Left,Shift+Ctrl+Right,Shift+Ctrl+Home,Shift+Ctrl+End action
                        retInfo.SelectionEnd = this.GetCaretPosition(end, k);
                        this.isMulSelected = true;
                        retInfo.System = false;
                        break;
                        //Shift + Delete
                        // Shift + Backspace  DaryLuo 2012/10/16 fix bug 797 in IM Web 7.0.
                                            case 65582:
                    case 65544:
                        if(this.isMulSelected)//same as cut Action
                         {
                            if(this.Owner._isSupportClipBoard()) {
                                retInfo = this.Cut(clipContent, start, end);
                            } else {
                                retInfo.System = true;
                                break;
                            }
                        } else//the action of backspace
                         {
                            retInfo = this.ProcessBackSpace(start, end);
                        }
                        retInfo.System = false;
                        break;
                        //Shift + Insert  : Paste
                                            case 65581:
                        //Ctrl + V
                                            case 131158:
                        if(this.Owner._isSupportClipBoard()) {
                            var pasteData = Utility.GetPasteData(this.Owner ? this.Owner.GetUseClipboard() : true);
                            retInfo = this.Paste(start, end, pasteData, isExitOnLastChar);
                            retInfo.System = false;
                        } else {
                            retInfo.System = true;
                        }
                        break;
                        //Shift + End
                                            case 65571:
                        //Shift + Home
                                            case 65572:
                        //Shift + Left
                                            case 65573:
                        //Shift + Right
                                            case 65575:
                        // add by Jiang Changcheng at Aug 11 16:13, for bug#388 -->
                        // Shift + Up
                                            case 65574:
                        // Shift + Down
                                            case 65576:
                        // end by Jiang Changcheng <--
                        this.isMulSelected = true;
                        //perform the Shift+Left,Shift+Right,Shift+Home,Shift+End action
                        retInfo.SelectionEnd = this.GetCaretPosition(end, k);
                        retInfo.System = false;
                        break;
                        //Ctrl + C
                                            case 131139:
                        //Ctrl + Insert
                                            case 131117:
                        if(this.Owner._isSupportClipBoard()) {
                            this.Copy(clipContent, start, end);
                            retInfo.System = false;
                        } else {
                            retInfo.System = true;
                        }
                        break;
                        //Ctrl + Delete
                                            case 131118:
                        if(!this.isMulSelected) {
                            end = this.GetCaretPosition(end, k);
                        }
                        retInfo = this.ProcessDelete(start, end);
                        retInfo.System = false;
                        break;
                        //Ctrl + BackSpace  Ctrl + Shift + BackSpace Key
                                            case 131080:
                    case 196616:
                        if(!this.isMulSelected) {
                            end = this.GetCaretPosition(end, k);
                        }
                        retInfo = this.ProcessBackSpace(start, end);
                        retInfo.System = false;
                        break;
                        //Ctrl + A
                                            case 131137:
                        retInfo = this.SelectAll();
                        retInfo.System = false;
                        break;
                        //Ctrl + X
                                            case 131160:
                        if(this.Owner._isSupportClipBoard()) {
                            retInfo = this.Cut(clipContent, start, end);
                            retInfo.System = false;
                        } else {
                            retInfo.System = true;
                        }
                        break;
                        //Ctrl + Z
                                            case 131162:
                        //Need add undo methods by Ryan wu.
                        retInfo = this.Undo();
                        retInfo.System = false;
                        break;
                        //Ctrl + Left
                                            case 131109:
                        //Left
                                            case 37:
                        //Move to previous control
                        if(start == 0 && (exitOnLeftRightKey == ExitOnLeftRightKey.Both || exitOnLeftRightKey == ExitOnLeftRightKey.Left)) {
                            var exitType = k == 37 ? "Left" : "CtrlLeft";
                            var ret = this.MoveControl(this.GetInputElement(), false, true, exitType);
                            if(ret != null) {
                                retInfo.EventInfo = ret.EventInfo;
                                retInfo.FocusType = ret.FocusType;
                                retInfo.FocusExit = true;
                            }
                            return retInfo;
                        }
                        //Ctrl + Home
                                            case 131108:
                        // add by Sean Huang at 2009.04.16, for bug 2046 -->
                        //Ctrl + Up
                                            case 131110:
                        // end of Sean Huang <--
                        //Home
                                            case 36:
                        //PageUp
                                            case 33:
                        //Ctrl + PageUp
                                            case 131105:
                        if(k == 33 || k == 131105) {
                            k = 131108;
                        }
                        retInfo = this.ProcessLeftDirection(start, end, k);
                        retInfo.System = false;
                        break;
                        //Ctrl + Right
                                            case 131111:
                        //Right
                                            case 39:
                        //Move to next control
                        if(start == text.GetLength() && (exitOnLeftRightKey == ExitOnLeftRightKey.Both || exitOnLeftRightKey == ExitOnLeftRightKey.Right)) {
                            var exitType = k == 39 ? "Right" : "CtrlRight";
                            var ret = this.MoveControl(this.GetInputElement(), true, true, exitType);
                            if(ret != null) {
                                retInfo.EventInfo = ret.EventInfo;
                                retInfo.FocusType = ret.FocusType;
                                retInfo.FocusExit = true;
                            }
                            return retInfo;
                        }
                        //Ctrl + End
                                            case 131107:
                        // add by Sean Huang at 2009.03.30, for bug 2046 -->
                        //Ctrl + Down
                                            case 131112:
                        // end of Sean Huang <--
                        //End
                                            case 35:
                        //PageDown
                                            case 34:
                        //Ctrl + PageDown
                                            case 131106:
                        if(k == 34 || k == 131106) {
                            k = 131107;
                        }
                        retInfo = this.ProcessRightDirection(start, end, k);
                        retInfo.System = false;
                        break;
                    default:
                        retInfo = null;
                        break;
                }
                return retInfo;
            };
            BaseUIProcess.prototype.ProcessLeftDirection = function (start, end, k) {
            };
            BaseUIProcess.prototype.ProcessRightDirection = function (start, end, k) {
            };
            BaseUIProcess.prototype.KeyDown = /**
            * Handle the onkeydown event.
            */
            function (data) {
                var k = data.KeyCode;
                var start = data.SelectionStart;
                var end = data.SelectionEnd;
                var text = data.Text;
                var editMode = data.EditMode;
                var keyAction = data.KeyAction;
                var readOnly = data.ReadOnly;
                var clipContent = data.ClipContent;
                //var funcKeysPressed	   = data.FuncKeysPressed;
                var isExitOnLastChar = data.ExitOnLastChar;
                var exitOnLeftRightKey = data.ExitOnLeftRightKey;
                var tabAction = data.TabAction;
                var retInfo = {
                };
                switch(editMode) {
                    case EditMode.Insert:
                        this.isOverWrite = false;
                        break;
                    case EditMode.Overwrite:
                        this.isOverWrite = true;
                        break;
                    case EditMode.FixedInsert:
                        this.isOverWrite = false;
                        break;
                    case EditMode.FixedOverwrite:
                        this.isOverWrite = true;
                        break;
                }
                if(start != end) {
                    this.isMulSelected = true;
                } else {
                    this.isMulSelected = false;
                }
                //Why we must process tab key first. Because in IE we use the system's tab action and the default shortcuts has tab action.
                //So we must process tab key before processing the shortcuts
                switch(k) {
                    case 9:
                        retInfo = this.ProcessTabKey(end, true, tabAction);
                        return retInfo;
                    case 65545:
                        retInfo = this.ProcessTabKey(end, false, tabAction);
                        return retInfo;
                }
                //ShortCuts
                if(keyAction != null) {
                    return this.ProcessShortcutKey(keyAction, readOnly, end, start);
                }
                //The ReadOnly property is set to true
                if(readOnly) {
                    //When readonly is true, Escape, Alt + Up, Alt + Down, Up, Down can also take effect.
                    //If return null, then in BaseInputControl will handle the Escape, Alt + Up and Alt + Down action.
                    if(k == 27 || k == 262182 || k == 262184 || k == 38 || k == 40) {
                        return null;
                    }
                    //we only let the Ctrl+C and Ctrl+Insert and ShortCut to work when we set
                    //ReadOnly property to true.
                    // change by Sean Huang at 2008.08.13, for bug 28 (ttp)-->
                    //if (k != 131117 && k != 131139)
                    if(k != 131117 && k != 131139 && k != 9 && k != 65545 && k != 131081 && k != 196617 && //Ctrl+A
                    k != 131137 && //left, right, up, down
                    k != 37 && k != 39 && k != 38 && k != 40)// end of Sean Huang <--
                     {
                        return retInfo;
                    }
                }
                //the DateFormat has no Pattern property, we use the system's keydown action
                if(this.Format.Fields.fieldCount == 0) {
                    //Why I move the following code here from the end part of the method? It is because
                    //when there is no format we must invoke the editstatuschanged event and the ExitOnLeftRightKey
                    //property also takes effect.
                    switch(k) {
                        case //Insert
                        45:
                            if(editMode == EditMode.FixedInsert) {
                                this.isOverWrite = false;
                            } else if(editMode == EditMode.FixedOverwrite) {
                                this.isOverWrite = true;
                            } else {
                                this.isOverWrite = !this.isOverWrite;
                            }
                            retInfo.Overwrite = this.isOverWrite;
                            if(this.Format.Fields.fieldCount == 0) {
                                retInfo.System = true;
                            }
                            return retInfo;
                            //Left
                                                    case 37:
                            //Ctrl + Left
                                                    case 131109:
                            //Move to previous control
                            if(start == 0 && (exitOnLeftRightKey == ExitOnLeftRightKey.Both || exitOnLeftRightKey == ExitOnLeftRightKey.Left)) {
                                var exitType = k == 37 ? "Left" : "CtrlLeft";
                                var ret = this.MoveControl(this.GetInputElement(), false, true, exitType);
                                if(ret != null) {
                                    retInfo.EventInfo = ret.EventInfo;
                                    retInfo.FocusType = ret.FocusType;
                                    retInfo.FocusExit = true;
                                }
                                return retInfo;
                            }
                            break;
                            //Right
                                                    case 39:
                            //Ctrl + Right
                                                    case 131111:
                            //Move to next control
                            if(start == text.GetLength() && (exitOnLeftRightKey == ExitOnLeftRightKey.Both || exitOnLeftRightKey == ExitOnLeftRightKey.Right)) {
                                var exitType = k == 39 ? "Right" : "CtrlRight";
                                var ret = this.MoveControl(this.GetInputElement(), true, true, exitType);
                                if(ret != null) {
                                    retInfo.EventInfo = ret.EventInfo;
                                    retInfo.FocusType = ret.FocusType;
                                    retInfo.FocusExit = true;
                                }
                                return retInfo;
                            }
                            break;
                    }
                    return null;
                }
                //Process char key input.
                var processInfo = this.ProcessCharKeyInput(k, start, end, isExitOnLastChar, text);
                if(processInfo != null) {
                    return processInfo;
                }
                retInfo = this.ProcessNavigatorKeyInput(k, editMode, clipContent, text, start, end, exitOnLeftRightKey, isExitOnLastChar);
                return retInfo;
            };
            BaseUIProcess.prototype.KeyPress = /**
            * Handle the onkeypress event.
            */
            function (e) {
            };
            BaseUIProcess.prototype.KeyUp = /**
            * Handle the onkeyup event.
            */
            function (e) {
            };
            BaseUIProcess.prototype.ShowContextMenu = /**
            * Handle the oncontextmenu event.
            */
            function (oText, selText) {
                var retInfo = {
                };
                //If there's no text selected
                if(selText == "") {
                    retInfo.SelectionStart = Utility.GetCursorPosition(oText);
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                }
                return retInfo;
            };
            BaseUIProcess.prototype.SelectStart = /**
            * Handle the onselectstart event.
            */
            function (obj, selText, mouseButton) {
                var retInfo = {
                };
                if(selText == "" && !this.isTriClick && !this.isDblClick && mouseButton != MouseButton.Default) {
                    retInfo.SelectionStart = Utility.GetCursorPosition(obj);
                    retInfo.SetFalse = true;
                }
                return retInfo;
            };
            BaseUIProcess.prototype.DoubleClick = /**
            * Handle the ondblclick event.
            */
            function (pos) {
                var retInfo = {
                };
                //Get current field range
                var fieldIndex = this.Format.Fields.GetFieldIndexByPos(pos);
                var fieldPos = this.Format.Fields.GetFieldRange(fieldIndex.index);
                retInfo.SelectionStart = fieldPos.start;
                retInfo.SelectionEnd = fieldPos.length + fieldPos.start;
                //set timer for tripple click
                Utility.GrapeCityTimeout = false;
                this.isDblClick = true;
                this.isMulSelect = true;
                setTimeout(function () {
                    Utility.GrapeCityTimeout = true;
                }, 300);
                return retInfo;
            };
            BaseUIProcess.prototype.Undo = /**
            * Handle the undo actions.
            */
            function () {
            };
            BaseUIProcess.prototype.Cut = /**
            * Handle the cut actions.
            * @param clipContent - The copy mode.
            * @param start - The start cursor position.
            * @param end   - The end cursor position.
            * @returns Returns the cursor position.
            */
            function (clipContent, start, end) {
                var retInfo = {
                };
                if(start == end) {
                    return retInfo;
                }
                this.FireClientEvent("OnBeforeCut");
                this.Copy(clipContent, start, end);
                retInfo = this.ProcessDelete(start, end);
                this.FireClientEvent("OnCut");
                return retInfo;
            };
            BaseUIProcess.prototype.Copy = /**
            * Handle the oncopy event.
            * @param clipContent - The copy mode.
            * @param start - The start cursor position.
            * @param end   - The end cursor position.
            */
            function (clipContent, start, end) {
                var text = null;
                var useClipboard = true;
                if(clipContent == ClipContent.ExcludeLiterals) {
                    var length = Math.abs(start - end);
                    var start = Math.min(start, end);
                    if(length == 0) {
                        return;
                    }
                    text = this.Format.Fields.GetNonLiteralsText(start, length);
                } else //Add comments by Ryan Wu at 16:44 Aug. 13 2007.
                //For Firefox can't get the hightlight text using document.selection.
                if(!Utility.IsIE() || Utility.IsIE11OrLater()) {
                    text = Utility.GetSelectionText(this.Owner.GetInputElement());
                } else// add by Sean Huang at 2009.04.29, for bug 2209 -->
                 {
                    text = document.selection.createRange().text;
                }
                // end of Sean Huang <--
                //end by Ryan Wu.
                if(this.Owner) {
                    text = BaseUIProcess.UpdateCrLfString(text, this.Owner.GetAcceptsCrlf());
                    useClipboard = this.Owner.GetUseClipboard();
                }
                // change by Sean Huang at 2009.04.29, for bug 2209 -->
                //Utility.SetCopy(text);
                if(Utility.IsIE()) {
                    setTimeout(function () {
                        Utility.SetCopy(text, useClipboard);
                    });
                } else {
                    Utility.SetCopy(text, useClipboard);
                }
                // end of Sean Huang <--
                            };
            BaseUIProcess.prototype.Paste = /**
            * Handle the onpaste event.
            */
            function (start, end, text, exitonlastChar) {
            };
            BaseUIProcess.prototype.SelectAll = /**
            * Select all the content.
            * @returns Returns the cursor position.
            */
            function () {
                var retInfo = {
                    SelectionStart: 0,
                    SelectionEnd: 0
                };
                retInfo.SelectionStart = 0;
                //modified by sj 2008.8.13 for bug 243
                var ShowLiterals;
                if(this.ID) {
                    ShowLiterals = this.GetShowLiterals();
                }
                if(ShowLiterals == 'PostDisplay' || ShowLiterals == 'PreDisplay') {
                    retInfo.SelectionEnd = Utility.FindIMControl(this.ID).GetText().GetLength();
                } else {
                    retInfo.SelectionEnd = this.Format.Fields.GetLength();
                }
                //retInfo.SelectionEnd   = this.Format.Fields.GetLength();
                //end by sj
                this.isMulSelected = true;
                return retInfo;
            };
            BaseUIProcess.prototype.FireEvent = //Add comments by Ryan Wu at 9:31 Apr. 5 2007.
            //For support Aspnet Ajax 1.0.
            ///*
            //* This Function should be called when an event needs to be fired.
            //* @param oControl - the javascript object representation of our control.
            //* @param eName    - the name of the function that should handle this event.
            //* @param eArgs    - the argument of the function that should handle this event.
            //*/
            //FireEvent (oControl, eName, eArgs)
            //{
            //	//Because when we fire client event we may be invoke the lose focus event,
            //	//so we must return the current focus type of getting focus.
            //	//No event will be fired
            //	if (eName == null || eName == "")
            //	{
            //		return null;
            //	}
            //
            //	if (Utility.FireEvent(oControl, eName, eArgs))
            //	{
            //		return FocusType.ClientEvent;
            //	}
            //};
            /*
            * This Function should be called when an event needs to be fired.
            * @param oControl - the javascript object representation of our control.
            * @param eName    - the name of the function that should handle this event.
            * @param eArgs    - the argument of the function that should handle this event.
            */
            function (oControl, eName, eArgs, eType) {
                //Because when we fire client event we may be invoke the lose focus event,
                //so we must return the current focus type of getting focus.
                //No event will be fired
                //if (eName == null || eName == "") {
                //    return null;
                //}
                if(Utility.FireEvent(oControl, eName, eArgs, eType)) {
                    return FocusType.ClientEvent;
                }
            };
            BaseUIProcess.prototype.ProcessCharKey = //end by Ryan Wu.
            /**
            * Process the input char key action.
            * @param start - The specified start cursor position.
            * @param end - The specified end cursor position.
            * @param charInput - The specified char will be input.
            * @returns Returns action result includes cursor position and if succeed after the process and whether we fire a client event.
            */
            function (start, end, charInput, isExitOnLastChar) {
                var processInfo = {
                };
                //get the selection information.
                var selectionStart = Math.min(start, end);
                var selectionLength = Math.abs(end - start);
                var retInfo = {
                };
                processInfo.start = selectionStart;
                processInfo.success = false;
                //none action.
                if(this.Format.Fields.GetFieldIndex(selectionStart).index == -1) {
                    //we input an invalid char, so invoke the InvalidInput Event
                    var eventInfo = {
                    };
                    eventInfo.Name = this.Owner.InvalidInputEvent;
                    eventInfo.Args = null;
                    //Add comments by Ryan Wu at 10:27 Apr. 5 2007.
                    //For support Aspnet Ajax 1.0.
                    eventInfo.Type = "invalidInput";
                    //end by Ryan Wu.
                    processInfo.EventInfo = eventInfo;
                    return processInfo;
                }
                var text = charInput.toString();
                if(selectionLength == 0 && !this.isOverWrite) {
                    retInfo = this.Format.Fields.Insert(selectionStart, text, false);
                } else if(selectionLength == 0) {
                    if(selectionStart == this.Format.Fields.GetLength()) {
                        retInfo = this.Format.Fields.Insert(selectionStart, text, false);
                    } else {
                        var isReplace = false;
                        var posInfo = this.Format.Fields.GetFieldIndexByPos(selectionStart);
                        var fieldIndex = posInfo.index;
                        var fieldOffset = posInfo.offset;
                        //var fieldsLength = selectionStart - fieldOffset;
                        var fieldRange = this.Format.Fields.GetFieldRange(fieldIndex);
                        if(this.Format.Fields.GetFieldByIndex(fieldIndex).fieldLabel == "PromptField") {
                            if(selectionStart - fieldOffset + fieldRange.length == this.Format.Fields.GetLength()) {
                                isReplace = false;
                            } else {
                                isReplace = true;
                                selectionLength = fieldRange.length - fieldOffset + 1;
                            }
                        } else {
                            isReplace = true;
                            // DaryLuo 2013/07/15 fix bug 1014 in IM HTML 5.
                            selectionLength = charInput.GetLength();
                        }
                        //none action.
                        if(this.Format.Fields.GetFieldIndexByPos(selectionStart + selectionLength).index == -1) {
                            //we input an invalid char, so invoke the InvalidInput Event
                            var eventInfo = {
                            };
                            eventInfo.Name = this.Owner.InvalidInputEvent;
                            eventInfo.Args = null;
                            //Add comments by Ryan Wu at 10:27 Apr. 5 2007.
                            //For support Aspnet Ajax 1.0.
                            eventInfo.Type = "invalidInput";
                            //end by Ryan Wu.
                            processInfo.EventInfo = eventInfo;
                            return processInfo;
                        }
                        if(isReplace) {
                            retInfo = this.Format.Fields.Replace(selectionStart, selectionLength, text, false);
                        } else {
                            retInfo = this.Format.Fields.Insert(selectionStart, text, false);
                        }
                    }
                } else {
                    retInfo = this.Format.Fields.Replace(selectionStart, selectionLength, text, false);
                }
                selectionStart = retInfo.cursorPos;
                //we input an invalid char, so invoke the InvalidInput Event
                if(retInfo.text != "") {
                    var eventInfo = {
                    };
                    eventInfo.Name = this.Owner.InvalidInputEvent;
                    eventInfo.Args = null;
                    //Add comments by Ryan Wu at 10:27 Apr. 5 2007.
                    //For support Aspnet Ajax 1.0.
                    eventInfo.Type = "invalidInput";
                    //end by Ryan Wu.
                    processInfo.EventInfo = eventInfo;
                    processInfo.start = selectionStart;
                    processInfo.success = false;
                    return processInfo;
                }
                //judge if the focus should exit on last char.
                if(isExitOnLastChar == true) {
                    if(selectionStart == this.Format.Fields.GetLength()) {
                        this.moveFocusExitOnLastChar = true;
                    } else {
                        var posInfo = this.Format.Fields.GetFieldIndexByPos(selectionStart);
                        var fieldIndex = posInfo.index;
                        var fieldOffset = posInfo.offset;
                        if(fieldIndex == this.Format.Fields.fieldCount - 1 && fieldOffset == 0 && this.Format.Fields.GetFieldByIndex(fieldIndex).fieldLabel == "PromptField") {
                            this.moveFocusExitOnLastChar = true;
                        }
                    }
                }
                processInfo.start = selectionStart;
                processInfo.success = true;
                return processInfo;
            };
            BaseUIProcess.prototype.ProcessDeleteKey = /**
            * Process the Delete key down action.
            * @param start - The specified start cursor position.
            * @param end - The specified end cursor position.
            * @returns Returns the cursor position after the process.
            */
            function (start, end) {
                //get the selection information.
                var selectionStart = Math.min(start, end);
                var selectionLength = Math.abs(start - end);
                var retInfo = {
                };
                if(selectionStart == this.Format.Fields.GetLength() && selectionLength == 0) {
                    return retInfo;
                }
                //var startFieldOffset;
                var startFieldIndex;
                var fieldPosInfo = this.Format.Fields.GetFieldIndexByPos(selectionStart);
                startFieldIndex = fieldPosInfo.index;
                //startFieldOffset = fieldPosInfo.offset;
                //none action.
                if(startFieldIndex == -1) {
                    return retInfo;
                }
                //if the selectionlength = 0, do the delete action for one post char.
                if(selectionLength == 0) {
                    //none action.
                    if(this.Format.Fields.GetFieldByIndex(startFieldIndex).fieldLabel == "PromptField") {
                        return retInfo;
                    }
                    selectionStart = this.Format.Fields.Delete(selectionStart, 1).cursorPos;
                    retInfo.SelectionStart = selectionStart;
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                } else//if the selectionlength != 0, do the delete action for the selection range..
                 {
                    var endFieldOffset;
                    var endFieldIndex;
                    fieldPosInfo = this.Format.Fields.GetFieldIndexByPos(selectionStart + selectionLength);
                    endFieldOffset = fieldPosInfo.offset;
                    endFieldIndex = fieldPosInfo.index;
                    //none action.
                    if(endFieldIndex == -1) {
                        return retInfo;
                    }
                    if(endFieldOffset == 0) {
                        endFieldIndex--;
                    }
                    //none action
                    if(startFieldIndex == endFieldIndex && this.Format.Fields.GetFieldByIndex(startFieldIndex).fieldLabel == "PromptField") {
                        return retInfo;
                    }
                    var info = this.Format.Fields.Delete(selectionStart, selectionLength);
                    //The same as BackSpace. ("20005[/)02/24" press delete)
                    if(!info.isSucceed) {
                        return retInfo;
                    }
                    retInfo.SelectionStart = info.cursorPos;
                    if(retInfo.SelectionStart == 0 && this.Format.Fields.GetFieldByIndex(0).fieldLabel == "PromptField") {
                        retInfo.SelectionStart = this.Format.Fields.GetFieldByIndex(0).GetLength();
                    }
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                    //Accordingto the changed information, generate BehaviorInfo and invoke UpdateBehavior to finsihed the correlative action.
                    var currentFieldOffset;
                    var currentFieldIndex;
                    var currentFieldInfo = this.Format.Fields.GetFieldIndexByPos(retInfo.SelectionStart);
                    currentFieldIndex = currentFieldInfo.index;
                    currentFieldOffset = currentFieldInfo.offset;
                    if(currentFieldOffset != 0 && this.Format.Fields.GetFieldByIndex(currentFieldIndex).fieldLabel == "PromptField") {
                        retInfo.SelectionStart = retInfo.SelectionStart - currentFieldOffset + this.Format.Fields.GetFieldByIndex(currentFieldIndex).GetLength();
                        retInfo.SelectionEnd = retInfo.SelectionStart;
                    }
                }
                return retInfo;
            };
            BaseUIProcess.prototype.ProcessBackSpace = /**
            * Perform the delete keydown event.
            * @param start - The start cursor position.
            * @param end   - The start end position.
            */
            function (start, end, text) {
            };
            BaseUIProcess.prototype.ProcessDelete = /**
            * Perform the delete keydown event.
            * @param start - The start cursor position.
            * @param end   - The start end position.
            */
            function (start, end, text) {
            };
            BaseUIProcess.prototype.GetCaretPosition = /**
            * Get the next caret position according to the special cursor position and keycode(processType).
            * @param cursorPos - The current cursor position.
            * @param keyCode   - The keyCode indicate the key action.
            * @returns Return the cursor position after the key action.
            */
            function (cursorPos, keyCode, startPos, endPos, literalFieldLabel) {
                var fields = this.Format.Fields;
                var fieldPosInfo = fields.GetFieldIndexByPos(cursorPos);
                var fieldIndex = fieldPosInfo.index;
                var fieldOffset = fieldPosInfo.offset;
                var fieldRange;
                var startPos;
                var endPos;
                var i = 0;
                switch(keyCode) {
                    case //Home key pressed
                    36:
                        //Shift + Home
                                            case 65572:
                        // add by Jiang Changcheng at Aug 11 16:13, for bug#388 -->
                        // Shift + Up
                                            case 65574:
                        // end by Jiang Changcheng <--
                        if(cursorPos <= startPos) {
                            return 0;
                        } else {
                            return startPos;
                        }
                        //End key pressed
                                            case 35:
                        //Shift + End
                                            case 65571:
                        // add by Jiang Changcheng at Aug 11 16:13, for bug#388 -->
                        // Shift + Down
                                            case 65576:
                        // end by Jiang Changcheng <--
                        if(cursorPos >= endPos) {
                            return fields.GetLength();
                        } else {
                            return endPos;
                        }
                        //Left key
                                            case 37:
                        if(cursorPos == 0) {
                            return 0;
                        }
                        if(fields.GetFieldByIndex(fieldIndex).fieldLabel == literalFieldLabel) {
                            if(fieldOffset > 0) {
                                cursorPos -= fieldOffset;
                            } else {
                                cursorPos--;
                            }
                        } else {
                            //aaaggg|eebbbMMccddee
                            if(fieldOffset == 0 && fields.GetFieldByIndex(fieldIndex - 1).fieldLabel == literalFieldLabel) {
                                cursorPos -= fields.GetFieldRange(fieldIndex - 1).length;
                            } else {
                                cursorPos--;
                            }
                        }
                        break;
                        //Right key
                                            case 39:
                        if(cursorPos == fields.GetLength()) {
                            return cursorPos;
                        }
                        if(fields.GetFieldByIndex(fieldIndex).fieldLabel == literalFieldLabel) {
                            fieldRange = fields.GetFieldRange(fieldIndex);
                            startPos = fieldRange.start;
                            endPos = startPos + fieldRange.length;
                            if(cursorPos < endPos) {
                                return endPos;
                            }
                        } else {
                            cursorPos++;
                        }
                        break;
                        //Ctrl + Left arrow key
                                            case 131109:
                        if(cursorPos == 0 || fieldIndex == 0) {
                            return 0;
                        }
                        if(fields.GetFieldByIndex(fieldIndex).fieldLabel == literalFieldLabel) {
                            fieldRange = fields.GetFieldRange(fieldIndex - 1);
                            cursorPos = fieldRange.start;
                        } else {
                            if(fieldOffset == 0) {
                                for(i = fieldIndex - 1; i >= 0; i--) {
                                    //find the edit field before the current field
                                    if(fields.GetFieldByIndex(i).fieldLabel != literalFieldLabel) {
                                        fieldRange = fields.GetFieldRange(i);
                                        return fieldRange.start;
                                    }
                                }
                                //if the former field is PromptField, then return 0
                                return 0;
                            } else {
                                cursorPos -= fieldOffset;
                            }
                        }
                        break;
                        //Ctrl + Shift + Left key
                                            case 196645:
                        if(cursorPos == 0 || fieldIndex == 0) {
                            return 0;
                        }
                        if(fieldOffset == 0) {
                            fieldRange = fields.GetFieldRange(fieldIndex - 1);
                            cursorPos = fieldRange.start;
                        } else {
                            cursorPos -= fieldOffset;
                        }
                        break;
                        //Ctrl + Right arrow key
                                            case 131111:
                        if(cursorPos == fields.GetLength() || fieldIndex == fields.fieldCount - 1) {
                            return fields.GetLength();
                        }
                        if(fields.GetFieldByIndex(fieldIndex).fieldLabel == literalFieldLabel) {
                            fieldRange = fields.GetFieldRange(fieldIndex + 1);
                            cursorPos = fieldRange.start;
                        } else {
                            for(i = fieldIndex + 1; i < fields.fieldCount; i++) {
                                //find the edit field after the current field
                                if(fields.GetFieldByIndex(i).fieldLabel != literalFieldLabel) {
                                    fieldRange = fields.GetFieldRange(i);
                                    return fieldRange.start;
                                }
                            }
                            //if the latter field is PromptField, then return fieldcollection length
                            return fields.GetLength();
                        }
                        break;
                        //Ctrl + Shift + Right key
                                            case 196647:
                        if(cursorPos == fields.GetLength() || fieldIndex == fields.fieldCount - 1) {
                            return fields.GetLength();
                        }
                        //if the current caret is in the last field then return the fields' length
                        fieldRange = fields.GetFieldRange(fieldIndex + 1);
                        cursorPos = fieldRange.start;
                        break;
                        //Ctrl + Delete key
                                            case 131118:
                        if(cursorPos == fields.GetLength() || fields.GetFieldByIndex(fieldIndex).fieldLabel == literalFieldLabel) {
                            return cursorPos;
                        } else {
                            fieldRange = fields.GetFieldRange(fieldIndex);
                            return fieldRange.start + fieldRange.length;
                        }
                        //Ctrl + BackSpace key  Ctrl + Shift + BackSpace Key
                                            case 131080:
                    case 196616:
                        if(cursorPos == 0 || (fields.GetFieldByIndex(fieldIndex).fieldLabel == literalFieldLabel && fieldIndex == 0)) {
                            return cursorPos;
                        } else if(fields.GetFieldByIndex(fieldIndex).fieldLabel == literalFieldLabel) {
                            return fields.GetFieldRange(fieldIndex - 1).start;
                        } else {
                            if(fieldOffset == 0) {
                                for(i = fieldIndex - 1; i >= 0; i--) {
                                    //find the edit field before the current field
                                    if(fields.GetFieldByIndex(i).fieldLabel != literalFieldLabel) {
                                        fieldRange = fields.GetFieldRange(i);
                                        return fieldRange.start;
                                    }
                                }
                                //if there is no edit field before the current field
                                return cursorPos;
                            } else {
                                cursorPos -= fieldOffset;
                            }
                        }
                        break;
                        //Ctrl + Shift + End key
                                            case 196643:
                        //Ctrl + End key
                                            case 131107:
                        // add by Sean Huang at 2009.03.30, for bug 2046 -->
                        //Ctrl + Down arrow key
                                            case 131112:
                        // end of Sean Huang <--
                        return fields.GetLength();
                        //Ctrl + Shift + Home key
                                            case 196644:
                        //Ctrl + Home key
                                            case 131108:
                        // add by Sean Huang at 2009.03.30, for bug 2046 -->
                        //Ctrl + Up arrow key
                                            case 131110:
                        // end of Sean Huang <--
                        return 0;
                        //Shift + Left key
                                            case 65573:
                        if(cursorPos == 0) {
                            return 0;
                        } else {
                            return --cursorPos;
                        }
                        //Shift + Right key
                                            case 65575:
                        if(cursorPos == fields.GetLength()) {
                            return cursorPos;
                        } else {
                            return ++cursorPos;
                        }
                }
                return cursorPos;
            };
            BaseUIProcess.prototype.CompareShortcut = /**
            * Compare the specified keycode with the shortcut array passed from server side.
            * @param keyCode - The keyCode indicate the key action.
            * @param shortcut - The shortcut text passed from server side.
            * @returns Return true if keycode in the shortcuts array otherwise return false.
            */
            function (keyCode, shortcut) {
                if(shortcut.toString().IndexOf("|") == -1) {
                    if(shortcut == keyCode) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    var index = null;
                    while(index != -1) {
                        index = shortcut.toString().IndexOf("|");
                        var length = shortcut.toString().GetLength();
                        if(shortcut.Substring(0, index == -1 ? length : index) == keyCode) {
                            return true;
                        } else {
                            shortcut = shortcut.Substring(index + 1, length);
                        }
                    }
                    return false;
                }
            };
            BaseUIProcess.prototype.MoveControl = /**
            * Move the focus from one control to another.
            * @param elementID - The current element id.
            * @param isForward - The bool value indicate if we move focus to the next control according to the tabindex value.
            * @param isUseLeftRightKey - The bool value indicate if we move focus to the next control by left or right key.
            * @param exitType - The exit type.
            */
            function (currentElement, isForward, isUseLeftRightKey, exitType) {
                var elements = Utility.GetElements();
                var ret = null;
                var retInfo = {
                };
                //Add by Ryan Wu at 10:24 Jan. 20 2006.
                //For fix bug#4965.
                if(elements.length < 2) {
                    return null;
                }
                //Add comments by Ryan Wu at 14:08 Aug. 28 2007.
                //For the sequence of the onfocus, onblur, onkeydown event in firefox is not same as IE
                //when we use the focus method in keydown.
                //in IE: onkeydown --> onblur --> onfocus.
                //in Firefox: onblur --> onfocus --> onkeydown.
                //So we must split the MoveFocus into two methods. Firstly, We must get the next control's id.
                //Then if we use the ExitOnLeftRightKey to move focus, we should set the next control's FocusType to FocusType.Left/FocusType.Right.
                //Lastly we can invoke the obj.focus method to set focus to the next control.
                //	var nextID = Utility.MoveFocus(elementID, elements, isForward);
                //
                //	if (isUseLeftRightKey == true)
                //	{
                //		try
                //		{
                //		    var index = nextID.LastIndexOf("_EditField");
                //
                //		    if (index != -1)
                //		    {
                //		        var conID = nextID.Substring(0, index);
                //		        var nextObj = FindIMControl(conID);
                //		        nextObj.FocusType = isForward ? FocusType.Left : FocusType.Right;
                //		    }
                //		}
                //		catch(e)
                //		{}
                //    }
                var nextElement = Utility.GetNextFocusableControl(currentElement, elements, isForward);
                // TODO:
                //if (isUseLeftRightKey == true) {
                //    try {
                //        var index = nextID.LastIndexOf("_EditField");
                //        if (index != -1) {
                //            var conID = nextID.Substring(0, index);
                //            var nextObj = FindIMControl(conID);
                //            nextObj.FocusType = isForward ? FocusType.Left : FocusType.Right;
                //        }
                //        else {
                //            var nextObj = FindIMControl(nextID);
                //            if (nextObj) {
                //                if (nextObj.IsjQueryControl == true) {
                //                    nextObj.FocusType = isForward ? FocusType.Left : FocusType.Right;
                //                }
                //            }
                //        }
                //    }
                //    catch (e)
                //    { }
                //}
                // change by Sean Huang at 2008.12.16, for bug 1054 -->
                //Utility.SetElementFocus(nextID);
                // change by Sean Huang at 2009.01.04, for bug 1402 -->
                //if (exitType == "CharInput")
                // change by Sean Huang at 2009.02.16, for bug 1863, 1865 -->
                //if (exitType == "CharInput" || (!isIE && isUseLeftRightKey))
                if(exitType == "CharInput" || (!Utility.IsIE()))// end of Sean Huang <--
                // end of Sean Huang <--
                 {
                    Utility.NextID = nextElement;
                    setTimeout(function () {
                        Utility.SetElementFocus(nextElement);
                    }, 0);
                } else {
                    Utility.SetElementFocus(nextElement);
                }
                // end of Sean Huang <--
                // add by Sean Huang at 2008.12.09, for bug 1057, 1058 -->
                // set the cursor position of the standard text box while it is get focus
                // by using the left right key.
                if(isUseLeftRightKey) {
                    var obj = document.getElementById(nextElement);
                    if(obj != null && (obj.tagName.toLowerCase() == "textarea" || obj.type == "text")) {
                        if(Utility.IsIE()) {
                            var range = obj.createTextRange();
                            if(exitType == "Left" || exitType == "CtrlLeft") {
                                // move the cursor position to the end
                                range.moveStart('character', obj.value.length);
                                range.select();
                            }
                            //else if (exitType == "Right" || exitType == "CtrlRight")
                            //{
                            //    // ie will move the cusor position to the begin by default
                            //}
                                                    }
                        // HelenLiu 2013/06/24 fix bug 743 in IM HTML5.
                        //else {
                        //    if (exitType == "Left" || exitType == "CtrlLeft") {
                        //        // move the cursor to the end
                        //        var len = obj.value.length;
                        //        obj.setSelectionRange(len, len);
                        //    }
                        //else if (exitType == "Right" || exitType == "CtrlRight") {
                        //     //move the cursor to the begin
                        //    obj.setSelectionRange(0, 0);
                        //}
                        //}
                                            }
                }
                // end of Sean Huang, for bug 1057, 1058<--
                //end by Ryan Wu.
                //invoke the KeyExit Event if it exit
                var eArgs = {
                    Key: ExitKeys.CharInput
                };
                //Add items to the ExitKeys.
                /*if (isForward)
                {
                eArgs.Key = ExitKeys.Right;
                }
                else
                {
                eArgs.Key = ExitKeys.Left;
                }*/
                switch(exitType) {
                    case "NextControl":
                        eArgs.Key = ExitKeys.NextControl;
                        break;
                    case "PreviousControl":
                        eArgs.Key = ExitKeys.PreviousControl;
                        break;
                    case "Right":
                        eArgs.Key = ExitKeys.Right;
                        break;
                    case "Left":
                        eArgs.Key = ExitKeys.Left;
                        break;
                    case "CtrlRight":
                        eArgs.Key = ExitKeys.CtrlRight;
                        break;
                    case "CtrlLeft":
                        eArgs.Key = ExitKeys.CtrlLeft;
                        break;
                    case "CharInput":
                        eArgs.Key = ExitKeys.CharInput;
                        break;
                }
                ret = {
                };
                ret.Name = this.Owner.KeyExitEvent;
                ret.Args = eArgs;
                //Add comments by Ryan Wu at 10:27 Apr. 5 2007.
                //For support Aspnet Ajax 1.0.
                ret.Type = "KeyExit";
                //end by Ryan Wu.
                if(ret != null) {
                    retInfo.EventInfo = ret;
                }
                return retInfo;
            };
            BaseUIProcess.prototype.MoveField = /**
            * Move the caret from one field to another in the control.
            * @param pos - The current caret position.
            * @param isForward - The bool value indicate if we move caret to the next field or previous field.
            */
            function (pos, isForward) {
                var nextPos = this.Format.Fields.MoveField(pos, isForward);
                var retInfo = {
                };
                if(nextPos == -1) {
                    retInfo.NextPos = nextPos;
                    return retInfo;
                }
                retInfo.SelectionStart = nextPos;
                retInfo.SelectionEnd = nextPos;
                return retInfo;
            };
            BaseUIProcess.prototype.ProcessTabKey = /**
            * Process Tab key press event.
            * @param isForward - The bool value indicate if we move caret to the forward or backward.
            */
            function (pos, isForward, tabAction) {
                //invoke the KeyExit Event if it exit
                var eArgs = {
                    Key: ExitKeys.Tab
                };
                var retInfo = {
                };
                if(isForward) {
                    eArgs.Key = ExitKeys.Tab;
                } else {
                    eArgs.Key = ExitKeys.ShiftTab;
                }
                var eventInfo = {
                };
                eventInfo.Name = this.Owner.KeyExitEvent;
                eventInfo.Args = eArgs;
                //Add comments by Ryan Wu at 10:27 Apr. 5 2007.
                //For support Aspnet Ajax 1.0.
                eventInfo.Type = "KeyExit";
                //end by Ryan Wu.
                retInfo.EventInfo = eventInfo;
                retInfo.FocusType = FocusType.KeyExit;
                retInfo.System = true;
                return retInfo;
            };
            BaseUIProcess.prototype.MoveFieldAndControl = /**
            * Move caret between fields then move focus to the next control if caret is in the edge
            * of the control.
            * @param isForward - The bool value indicate if we move caret to the forward or backward.
            */
            function (pos, isForward) {
                var retInfo = this.MoveField(pos, isForward);
                //retInfo.NextPos == -1 indicate that we have move the caret to the edge of the control.
                if(retInfo.NextPos != -1) {
                    return retInfo;
                }
                var exitType = isForward ? "NextControl" : "PreviousControl";
                var ret = this.MoveControl(this.GetInputElement(), isForward, false, exitType);
                if(ret != null) {
                    retInfo.EventInfo = ret.EventInfo;
                    retInfo.FocusType = ret.FocusType;
                    retInfo.FocusExit = true;
                }
                return retInfo;
            };
            BaseUIProcess.prototype.DragStart = /**
            * Handle the ondragstart event.
            */
            function () {
            };
            BaseUIProcess.prototype.DragEnd = /**
            * Handle the ondragend event.
            */
            function () {
            };
            BaseUIProcess.prototype.Drop = /**
            * Handle the ondrop event.
            */
            function () {
            };
            BaseUIProcess.prototype.DragOver = /**
            * Handle the ondragover event.
            */
            function () {
            };
            BaseUIProcess.prototype.GetKeyActionName = /**
            * Parse the shortcutsString and judge whether the key user pressed
            * is a shortcutkey defined by deveploper.
            * not replace indexOf, substring method, because autotest is slow
            * @param keyCode - The specified keyCode will be checked.
            * @param strShortcut - The shortcuts string passed from the server side.
            * @returns Returns the shortcut's keyAction Name if contains the specified
            *          keyCode action; else return null.
            */
            function (keyCode, strShortcut) {
                if(strShortcut == null) {
                    return null;
                }
                var s = strShortcut;
                var shortcuts = new Array();
                var index = s.IndexOf(",");
                var i = 0;
                if(strShortcut != "") {
                    while(index != -1) {
                        shortcuts[i++] = s.Substring(0, index);
                        s = s.Substring(index + 1, s.GetLength());
                        index = s.IndexOf(",");
                    }
                    shortcuts[i++] = s;
                    for(var j = 0; j < i; j = j + 2) {
                        if(this.IsKeyCodeContained(keyCode, shortcuts[j + 1])) {
                            return shortcuts[j];
                        }
                    }
                }
                return null;
            };
            BaseUIProcess.prototype.IsKeyCodeContained = /**
            * Judge whether the keyCode is contained in the shortcuts's item.
            * @param keyCode - The specified keyCode will be checked.
            * @param shortcut - The shortcuts's item.
            * @returns Returns true if contains the specified keyCode action; else return false.
            */
            function (keyCode, shortcut) {
                var s = shortcut;
                var index = s.IndexOf("|");
                while(index != -1) {
                    if(s.Substring(0, index) == keyCode) {
                        return true;
                    }
                    s = s.Substring(index + 1, s.GetLength());
                    index = s.IndexOf("|");
                }
                if(s == keyCode) {
                    return true;
                }
                return false;
            };
            BaseUIProcess.prototype.FireClientEvent = /**
            *fire event
            */
            function (evenType) {
                // TODO:
                            };
            BaseUIProcess.prototype.PerformSpin = function (curpos, increment, wrap) {
            };
            BaseUIProcess.UpdateCrLfString = /**
            * update crlf string for AcceptsCrLf property
            */
            function UpdateCrLfString(text, crlfMode) {
                var ret = text;
                if(text) {
                    if(crlfMode == CrLfMode.Filter) {
                        ret = text.replace(new RegExp("[\r\n]", "g"), "");
                    } else if(crlfMode == CrLfMode.Cut) {
                        // Frank Liu fixed bug 569 at 2013/06/05.
                        var splits = text.split(new RegExp("[\r\n]", "g"));
                        if(splits.length > 0) {
                            ret = splits[0];
                        } else {
                            ret = "";
                        }
                    }
                }
                return ret;
            };
            BaseUIProcess.FilterReturnChar = function FilterReturnChar(text) {
                if(text != null) {
                    text = text.replace(new RegExp("[\r]", "g"), "");
                }
                return text;
            };
            return BaseUIProcess;
        })();
        input.BaseUIProcess = BaseUIProcess;
        var InputUIUpdate = (function () {
            function InputUIUpdate(owner) {
                this.Owner = owner;
            }
            InputUIUpdate.prototype.SetLastClientValues = function (text) {
                //var obj = document.getElementById(this.ID + Utility.LastClientValuesID);
                //if (obj != null) {
                //    obj.value = text;
                //}
                //this.lastclientvalues = text;
                            };
            InputUIUpdate.prototype.GetText = function () {
                if(this.Owner.GetInputElement() != null) {
                    return this.Owner.GetInputElement().value;
                }
            };
            InputUIUpdate.prototype.SetText = function (text) {
                if(this.GetText() == null) {
                    return;
                }
                if(this.GetText().replace(/\r\n/g, "\n") == text.replace(/\r\n/g, "\n")) {
                    return;
                }
                if(this.Owner.GetInputElement() != null) {
                    this.Owner.GetInputElement().value = text;
                }
            };
            InputUIUpdate.prototype.SetFocus = function () {
                try  {
                    if(this.Owner.GetInputElement() != null) {
                        this.Owner.GetInputElement().focus();
                    }
                } catch (e) {
                }
            };
            InputUIUpdate.prototype.GetTextHAlign = function () {
                if(this.Owner.GetInputElement() !== null) {
                    return this.Owner.GetInputElement().style.textAlign;
                }
                return "";
            };
            InputUIUpdate.prototype.SetTextHAlign = function (value) {
                if(this.Owner.GetInputElement() !== null) {
                    this.Owner.GetInputElement().style.textAlign = value;
                    if(Utility.IsIE()) {
                        // Change the width to trigger the layout, to make this property take affect immediately.
                        var old = this.Owner.GetInputElement().style.width;
                        var length = parseInt(old);
                        if(isNaN(length)) {
                            length = 120;
                        }
                        this.Owner.GetInputElement().style.width = length + 1 + "px";
                        var self = this;
                        setTimeout(function () {
                            self.InputElement.style.width = old;
                        }, 0);
                    }
                }
            };
            InputUIUpdate.prototype.SetForeColor = function (foreColor) {
                if(this.Owner.GetInputElement() != null) {
                    this.Owner.GetInputElement().style.color = foreColor;
                }
            };
            InputUIUpdate.prototype.WriteCssStyle = function (style) {
                try  {
                    var styleContainer = document.getElementById('gcsh_InputManWeb_Style_Container');
                    if(Utility.IsIE()) {
                        styleContainer.styleSheet.cssText = style;
                    } else {
                        var sheet = styleContainer.sheet;
                        for(var i = sheet.cssRules.length - 1; i >= 0; i--) {
                            sheet.deleteRule(i);
                        }
                        var ruleLines = style.split('}');
                        for(var j = 0; j < ruleLines.length; j++) {
                            var rule = ruleLines[j];
                            var index = rule.indexOf('{');
                            if(index == -1) {
                                continue;
                            }
                            var style = rule.substring(index + 1);
                            if(style.length != 0) {
                                var selector = rule.substring(0, index);
                                sheet.insertRule(selector + '{' + style + '}', sheet.cssRules.length);
                            }
                        }
                    }
                } catch (e) {
                }
            };
            InputUIUpdate.prototype.ClearCssStyle = function () {
            };
            return InputUIUpdate;
        })();
        input.InputUIUpdate = InputUIUpdate;
        var GlobalEventHandler = (function () {
            function GlobalEventHandler() { }
            GlobalEventHandler.OnKeyDown = function OnKeyDown(control, evt, forShortcutExtender) {
                if(control.ImeMode === true && !Utility.IsIE8OrBelow()) {
                    return;
                }
                // debugger;
                var k = evt.keyCode;
                //Add comments by Jiang Changcheng at Sep. 9 2008
                //Add the fake key for Shortcut Extender
                if(forShortcutExtender) {
                    k |= 524288;
                }
                //End by Jiang Changcheng
                var funcKeysPressed = {
                };
                funcKeysPressed.Shift = false;
                funcKeysPressed.Ctrl = false;
                funcKeysPressed.Alt = false;
                if(evt.shiftKey) {
                    funcKeysPressed.Shift = true;
                }
                if(evt.ctrlKey) {
                    funcKeysPressed.Ctrl = true;
                }
                if(evt.altKey) {
                    funcKeysPressed.Alt = true;
                }
                var useSystem = null;
                //Add comments by Ryan Wu at 16:55 Sep. 11 2007.
                //For fix the bug "17. Ctrl+Click(select all text) will take no effects(firefox).".
                Utility.FuncKeysPressed = funcKeysPressed;
                //end by Ryan Wu.
                try  {
                    useSystem = control.KeyDown(evt);
                } catch (e) {
                }//Added by Jeff for Edit

                if(useSystem != null && useSystem.KeyCode != null) {
                    // Add comments by Yang at 11:44 Sep. 5th 2007
                    // For event.keyCode is readonly in firefox.
                    // Firefox doesn't support some shortcuts.
                    //event.keyCode = useSystem.KeyCode;
                    if(Utility.IsIE()) {
                        evt.keyCode = useSystem.KeyCode;
                    }
                    // End by Yang
                    //Add comments by Ryan Wu at 15:35 Aug. 13 2007.
                    //For in firefox, even if we set the event.returnValue = false in keydown event,
                    //the keypress event will also be invoked while in IE will not.
                    if(!Utility.IsIE()) {
                        Utility.ShouldInvokeKeyPress = false;
                    }
                    //end by Ryan Wu.
                    return;
                }
                //Add comments by Ryan Wu at 15:35 Aug. 13 2007.
                //For in firefox, even if we set the event.returnValue = false in keydown event,
                //the keypress event will also be invoked while in IE will not.
                //	if (!useSystem)
                //	{
                //		event.returnValue = false;
                //	    //event.cancelBubble = true;
                //	}
                if(!useSystem) {
                    Utility.PreventDefault(evt);
                    //event.cancelBubble = true;
                    if(!Utility.IsIE()) {
                        Utility.ShouldInvokeKeyPress = false;
                    }
                } else {
                    if(!Utility.IsIE()) {
                        Utility.ShouldInvokeKeyPress = true;
                    } else if(evt != null) {
                        evt.returnValue = true;
                    }
                }
            };
            GlobalEventHandler.OnKeyPress = function OnKeyPress(control, evt) {
                // Ctrl + X, Ctrl + V, Ctrl + C.
                if((evt.charCode === 118 || evt.charCode === 120 || evt.charCode === 99) && evt.ctrlKey) {
                    // Fire fox 's paste behavior will run at here.
                    return;
                }
                if(Utility.IPad && evt.charCode > 256) {
                    // DaryLuo 2013/05/22 fix bug 414, on the ipad, when the charCode is greater than 256, the compoistion event will fired, so here we don't process.
                    return;
                }
                if(evt.keyCode == 46 && evt.shiftKey) {
                    // FireFox Shift + Delete will run at here.  Cut operation.
                    return;
                }
                if(control.ImeMode === true) {
                    return;
                }
                var obj = control;
                if(!Utility.IsIE() && (evt.charCode == 0 || !Utility.ShouldInvokeKeyPress)) {
                    if(!Utility.ShouldInvokeKeyPress || ((evt.keyCode == 38 || evt.keyCode == 40) && obj.Type != "Edit")) {
                        Utility.ShouldInvokeKeyPress = true;
                        Utility.PreventDefault(evt);
                        // Add comments by Yang at 20:15 October 15th 2007
                        // For fix the bug 9047
                        if(obj != null && obj.Type == "Edit" && obj.DropDownObj != null && obj.DropDownObj.IsKeyFromDropDown) {
                            obj.DropDownObj.IsKeyFromDropDown = false;
                        }
                        // End by Yang
                        return;
                    } else // Add comments by Yang at 16:08 Sep. 12th 2007
                    // For fix the bug 8805
                    if(!(evt.keyCode == 13 && obj.Type == "Edit"))//else if (!(event.keyCode == 13 && event.ctrlKey && obj.Type == "Edit"))
                    // End by Yang
                     {
                        return;
                    }
                }
                var keyCode = evt.keyCode || evt.charCode;
                if(keyCode != 13 || obj.Type == "Edit")// End by Yang
                 {
                    var str = String.fromCharCode(keyCode);
                    try  {
                        if(CharProcess.CharEx.IsSurrogate(str.charAt(0))) {
                            // DaryLuo 2012/09/17 fix bug 630 in IM Web 7.0, do it in keyup.
                            obj.IsSurrogateKeyPressing = true;
                            return;
                        }
                    } catch (e) {
                    }
                    if(str != null) {
                        var useSystem = null;
                        try  {
                            useSystem = control.KeyPress(str, evt);
                        } catch (e) {
                        }
                    }
                    if(!useSystem) {
                        Utility.PreventDefault(evt);
                        //event.cancelBubble = true;
                        return;
                    }
                }
            };
            GlobalEventHandler.OnKeyUp = function OnKeyUp(control, evt) {
                if(control.ImeMode === true && !Utility.IsIE8OrBelow()) {
                    return;
                }
                try  {
                    var imControl = control;
                    if(imControl.IsSurrogateKeyPressing) {
                        try  {
                            if(imControl.InputElement != null) {
                                var value = imControl.InputElement.value;
                                var selectionStart = imControl.InputElement.selectionStart;
                                var str = value.substr(selectionStart - 2, selectionStart);
                                imControl.KeyPress(str, evt);
                            }
                        }finally {
                            imControl.IsSurrogateKeyPressing = false;
                        }
                    }
                    //Add comments by Ryan Wu at 16:55 Sep. 11 2007.
                    //For fix the bug "17. Ctrl+Click(select all text) will take no effects(firefox).".
                    Utility.FuncKeysPressed = {
                        Shift: evt.shiftKey,
                        Ctrl: evt.ctrlKey,
                        Alt: evt.altKey
                    };
                    //end by Ryan Wu.
                    imControl.KeyUp(evt);
                    //event.cancelBubble = true;
                                    } catch (e) {
                }
            };
            GlobalEventHandler.OnCompositionStart = function OnCompositionStart(control, evt) {
                try  {
                    control.CompositionStart(evt);
                } catch (e) {
                }
            };
            GlobalEventHandler.OnCompositionUpdate = function OnCompositionUpdate(control, evt) {
                try  {
                    control.CompositionUpdate(evt);
                } catch (e) {
                }
            };
            GlobalEventHandler.OnCompositionEnd = function OnCompositionEnd(control, evt) {
                try  {
                    control.CompositionEnd(evt);
                } catch (e) {
                }
            };
            GlobalEventHandler.OnWebkitEditableContentChanged = function OnWebkitEditableContentChanged(control, evt) {
                try  {
                    control.WebkitEditableContentChanged(evt);
                } catch (e) {
                }
            };
            GlobalEventHandler.OnMouseOver = function OnMouseOver(control, evt) {
                try  {
                    if(control.MouseOver) {
                        control.MouseOver();
                    }
                } catch (e) {
                }
            };
            GlobalEventHandler.OnMouseOut = function OnMouseOut(control, evt) {
                try  {
                    control.MouseOut();
                } catch (e) {
                }
            };
            GlobalEventHandler.OnMouseMove = function OnMouseMove(control, evt) {
                try  {
                    if(control.MouseMove) {
                        control.MouseMove(evt);
                    }
                } catch (e) {
                }
            };
            GlobalEventHandler.OnMouseDown = function OnMouseDown(control, evt) {
                if(control.ImeMode && control.ImeMode === true && !Utility.IsIE8OrBelow()) {
                    return;
                }
                try  {
                    control.MouseDown(evt);
                    if(!Utility.IsIE()) {
                        Utility.DragStartElementID = control;
                    }
                } catch (e) {
                }
            };
            GlobalEventHandler.OnMouseUp = function OnMouseUp(imControl, evt) {
                if(imControl.ImeMode && imControl.ImeMode === true && !Utility.IsIE8OrBelow()) {
                    return;
                }
                try  {
                    // DaryLuo 2013/07/12 fix bug 933, 934 in IM HTML 5.
                    if(imControl.MouseUpPointerType != null && imControl.MouseUpPointerType !== 4 && imControl.MouseUpPointerType !== "mouse") {
                        var evtClone = {
                        };
                        for(var item in evt) {
                            evtClone[item] = evt[item];
                        }
                        setTimeout(function (parameters) {
                            imControl.MouseUp(evtClone);
                        }, 300);
                    } else {
                        imControl.MouseUp(evt);
                    }
                    if(!Utility.IsIE()) {
                        Utility.DragStartElementID = "";
                    }
                } catch (e) {
                }
            };
            GlobalEventHandler.OnSelectStart = function OnSelectStart(control, evt) {
                if(Utility.InnerSelect === true && Utility.ShouldFireOnSelectStart == false) {
                    Utility.CancelBubble(evt);
                }
                var selText = Utility.GetSelectionText(control.GetInputElement());
                if(typeof (selText) == "undefined" || selText == null) {
                    selText = "";
                }
                var useSystem = null;
                try  {
                    useSystem = control.SelectStart(selText);
                } catch (e) {
                }
                if(useSystem == false) {
                    Utility.PreventDefault(evt);
                }
            };
            GlobalEventHandler.OnDblClick = function OnDblClick(control, evt) {
                var useSystem = null;
                try  {
                    useSystem = control.DoubleClick();
                } catch (e) {
                }
                if(!useSystem) {
                    Utility.PreventDefault(evt);
                }
            };
            GlobalEventHandler.OnHTML5BeforeCopy = function OnHTML5BeforeCopy(control, evt) {
                try  {
                    Utility.CutCopyPasteEventObject = evt ? evt.originalEvent : evt;
                    control.Copy(evt);
                } catch (e) {
                }finally {
                    Utility.CutCopyPasteEventObject = null;
                }
            };
            GlobalEventHandler.OnHTML5Cut = function OnHTML5Cut(control, evt) {
                try  {
                    var input = control.GetInputElement();
                    var text = input.value;
                    var selStart = input.selectionStart;
                    var selEnd = input.selectionEnd;
                    setTimeout(function () {
                        input.value = text;
                        input.selectionStart = selStart;
                        input.selectionEnd = selEnd;
                        control.Cut(evt);
                    }, 0);
                    // Let browser do it.
                                    } catch (e) {
                }
            };
            GlobalEventHandler.OnHTML5Paste = function OnHTML5Paste(control, evt) {
                try  {
                    // DaryLuo 2013/05/21, the paste operation doesn't take effect on the android chrome.
                    if(Utility.chrome && Utility.GetClientOS().toLowerCase() !== "android") {
                        Utility.CutCopyPasteEventObject = evt ? evt.originalEvent : evt;
                        control.Paste(Utility.GetDataFromClipboard(true));
                        Utility.PreventDefault(evt);
                    } else {
                        var selStart = control.SelectionStart;
                        var selEnd = control.SelectionEnd;
                        setTimeout(function () {
                            if(Utility.GetClientOS().toLowerCase() === "android") {
                                // DaryLuo 2013/05/27 fix bug 371 in IM HTML5.0.
                                control.SelectionStart = selStart;
                                control.SelectionEnd = selEnd;
                            }
                            control.isPasting = true;
                            // Firefox & android chrome will run at here.
                            control.ImeInput("DirectInput");
                        }, 0);
                    }
                } catch (e) {
                }finally {
                    Utility.CutCopyPasteEventObject = null;
                }
            };
            GlobalEventHandler.OnMouseWheel = function OnMouseWheel(control, evt) {
                try  {
                    control.MouseWheel(evt);
                    if(control.ShouldCancelMouseWheelDefaultBehavior()) {
                        Utility.PreventDefault(evt);
                    }
                } catch (e) {
                }
            };
            GlobalEventHandler.OnDragStart = function OnDragStart(control, evt) {
                try  {
                    control.DragStart();
                } catch (e) {
                }
            };
            GlobalEventHandler.OnDragEnd = function OnDragEnd(control, evt) {
                try  {
                    control.DragEnd(evt);
                } catch (e) {
                }
            };
            GlobalEventHandler.OnDrop = function OnDrop(control, evt) {
                try  {
                    var text = evt.originalEvent.dataTransfer.getData("Text");
                    control.DragDrop(text, evt);
                } catch (e) {
                }
            };
            GlobalEventHandler.OnTouchStart = function OnTouchStart(control, evt) {
                Utility.TouchStartTime = new Date();
                Utility.TouchStartEvt = evt;
            };
            GlobalEventHandler.OnTouchEnd = function OnTouchEnd(control, evt) {
                if(Utility.TouchStartTime !== undefined) {
                    Utility.TouchEndTime = new Date();
                    var offset = Utility.TouchEndTime.valueOf() - Utility.TouchStartTime.valueOf();
                    if(offset > 1000) {
                        var text = "";
                        try  {
                            text = Utility.GetSelectionText(control.GetInputElement());
                        } catch (e) {
                        }
                        control.ShowContextMenu(text, Utility.TouchStartEvt);
                        if(control.GetEnabled()) {
                            Utility.PreventDefault(evt);
                        }
                    }
                    Utility.TouchStartTime = undefined;
                    Utility.TouchEndTime = undefined;
                }
            };
            GlobalEventHandler.OnDragEnter = function OnDragEnter(control, evt) {
                try  {
                    control.DragEnter();
                } catch (e) {
                }
            };
            GlobalEventHandler.OnDragLeave = function OnDragLeave(control, evt) {
                try  {
                    control.DragLeave();
                } catch (e) {
                }
            };
            GlobalEventHandler.OnSelect = function OnSelect(control, evt) {
                try  {
                    if(control && control.Focused) {
                        control.Select();
                    }
                } catch (e) {
                }
            };
            GlobalEventHandler.OnPropertyChanged = function OnPropertyChanged(control, evt) {
                try  {
                    control.PropertyChange(evt);
                } catch (e) {
                }
            };
            GlobalEventHandler.OnMSPointerUp = function OnMSPointerUp(control, evt) {
                control.MSPointerUp(evt);
            };
            GlobalEventHandler.OnMSPointerDown = function OnMSPointerDown(control, evt) {
                try  {
                    control.MSPointerDown(evt);
                } catch (e) {
                }
            };
            GlobalEventHandler.OnMSGestureTap = function OnMSGestureTap(control, evt) {
                try  {
                    control.MSGestureTap(evt);
                } catch (e) {
                }
            };
            GlobalEventHandler.OnEditFieldFocus = function OnEditFieldFocus(control, evt) {
                if(Utility.IsFocusFromIMControl(control._id, evt)) {
                    if(Utility.IsIE() || Utility.HasGetFocus) {
                        return;
                    }
                }
                //if (!Utility.firefox) {
                //    if (Utility.IsOnFocus) {
                //        if (GrapeCity.IM.Utility.IsIE() && Utility.IsOnActivate || Utility.HasGetFocus) {
                //            return;
                //        }
                //    }
                //}
                Utility.IsOnFocus = true;
                if(!Utility.IsIE()) {
                    Utility.HasGetFocus = true;
                }
                this.OnFocus(control, evt);
                //onFocus(id);
                //Utility.FireEvent(document.getElementById(id), eventName, null);
                // end of Sean Huang <--
                            };
            GlobalEventHandler.OnEditFieldLoseFocus = function OnEditFieldLoseFocus(control, evt) {
                try  {
                    //function gcsh_InputManWeb_onLoseFocus(eventName, id) {
                    var obj = control;
                    if(obj != null && obj.Type == "Edit" && obj.IsFocusToDropDownEdit) {
                        obj.IsFocusToDropDownEdit = false;
                        return;
                    }
                    // Temporarily comment at 2013/08/13.
                    //if (!Utility.IsIE() && obj != null && obj.IMControlType == "Date" && obj.DropDownObj != null) {
                    //    if (Utility.IsFireFox4OrLater()) {
                    //        if (obj.DropDownObj.IsNavigateMouseDown) {
                    //            obj.DropDownObj.IsNavigateMouseDown = null;
                    //            return;
                    //        }
                    //        if (obj.DropDownObj.IsZoomButtonMouseDown) {
                    //            obj.DropDownObj.IsZoomButtonMouseDown = null;
                    //            return;
                    //        }
                    //    }
                    //    if (obj.DropDownObj.IsHeaderMouseDown) {
                    //        obj.DropDownObj.IsHeaderMouseDown = null;
                    //        return;
                    //    }
                    //}
                    if(Utility.IsFocusToIMControl(control._id, evt)) {
                        return;
                    }
                    if(Utility.firefox) {
                        if(Utility.IsOnFocus && Utility.IsIE() && Utility.IsOnActivate && Utility.IsOnActivateControlID == control._id) {
                            if(Utility.FocusToBorder != null && Utility.FocusToBorder == true) {
                                Utility.FocusToBorder = false;
                                obj.SetInnerFocus();
                            }
                            return;
                        }
                        Utility.FocusToBorder = false;
                        if(!Utility.IsIE()) {
                            Utility.HasGetFocus = false;
                        } else {
                            Utility.IsOnFocus = false;
                        }
                    }
                    GlobalEventHandler.OnLostFocus(control, evt);
                    Utility.FuncKeysPressed = {
                        Shift: false,
                        Ctrl: false,
                        Alt: false
                    };
                    //Utility.FireEvent(control, "LoseFocus", null);
                                    } catch (e) {
                }
            };
            GlobalEventHandler.OnFocusOut = function OnFocusOut(control, evt) {
                Utility.FocusToBorder = false;
                if(Utility.IsIE()) {
                    if(evt.toElement) {
                        var toID = evt.toElement.id;
                        if(toID == control._id + "_Inside_Div_Container") {
                            Utility.FocusToBorder = true;
                        }
                    }
                }
                if(Utility.IsFocusToIMControl(control._id, evt)) {
                    if(Utility.IsIE() && Utility.engine >= 9) {
                        Utility.IsOnActivate = true;
                        Utility.IsOnActivateControlID = control._id;
                        Utility.IsOnFocus = true;
                    }
                    return;
                }
                if(Utility.IsIE() && Utility.IsOnActivate) {
                    Utility.IsOnActivate = false;
                    Utility.IsOnActivateControlID = "";
                }
                if(Utility.IsOnFocus) {
                    Utility.IsOnFocus = false;
                }
            };
            GlobalEventHandler.OnActivate = function OnActivate(control, evt) {
                Utility.IsOnActivate = true;
                Utility.IsOnActivateControlID = control._id;
                if(Utility.IsFocusFromIMControl(control._id, evt)) {
                    return;
                }
                Utility.IsOnActivate = true;
                Utility.IsOnActivateControlID = control._id;
            };
            GlobalEventHandler.OnDeActivate = function OnDeActivate(control, evt) {
                if(Utility.IsFocusToIMControl(control._id, evt)) {
                    return;
                }
                Utility.IsOnActivate = false;
                Utility.IsOnActivateControlID = "";
                Utility.IsOnFocus = false;
            };
            GlobalEventHandler.OnFocus = function OnFocus(control, evt) {
                try  {
                    var handler = function () {
                        control.Focus();
                        control.Focused = true;
                        if(Utility.IsPad()) {
                            // DaryLuo 2013/05/27 fix bug 412 in IM HTML 5.0.
                            control.IPadSelectionRefreshTimer = setInterval(function () {
                                control.Select();
                            }, 400);
                        }
                    };
                    if(Utility.IsIE()) {
                        handler.call(this);
                    } else {
                        setTimeout(handler, 0);
                    }
                } catch (e) {
                }
            };
            GlobalEventHandler.OnLostFocus = function OnLostFocus(control, evt) {
                try  {
                    control.LoseFocus(evt);
                    control.Focused = false;
                    if(Utility.IsPad()) {
                        clearInterval(control.IPadSelectionRefreshTimer);
                    }
                } catch (e) {
                }
            };
            return GlobalEventHandler;
        })();
        input.GlobalEventHandler = GlobalEventHandler;
        String.prototype.GetLength = function () {
            return this.length;
        };
        String.prototype.Substring = function (start, end) {
            return this.substring(start, end);
        };
        String.prototype.IndexOf = function (text, startIndex) {
            return this.indexOf(text, startIndex);
        };
        String.prototype.LastIndexOf = function (text) {
            return this.lastIndexOf(text);
        };
        String.prototype.CharAt = function (position) {
            return this.charAt(position);
        };
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
