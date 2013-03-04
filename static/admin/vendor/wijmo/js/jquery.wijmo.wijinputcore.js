var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="declarations/jquery.d.ts"/>
/// <reference path="declarations/jquery.ui.d.ts"/>
/// <reference path="declarations/wijmo.d.ts"/>
/*globals Globalize window jQuery wijInputResult document*/
/*
*
* Wijmo Library 2.3.7
* http://wijmo.com/
*
* Copyright(c) GrapeCity, Inc.  All rights reserved.
*
* Dual licensed under the Wijmo Commercial or GNU GPL Version 3 licenses.
* licensing@wijmo.com
* http://wijmo.com/license
*
*
* * Wijmo Inputcore widget.
*
*/
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery;
    // Declarations to support TypeScript type system
    var WijmoWidget = (function () {
        function WijmoWidget() { }
        WijmoWidget.prototype.destroy = function () {
        };
        WijmoWidget.prototype.disable = function () {
        };
        WijmoWidget.prototype._trigger = function (name, eventObj, data) {
        };
        WijmoWidget.prototype._setOption = function (name, value) {
        };
        WijmoWidget.prototype.option = function (name, value) {
        };
        WijmoWidget.prototype.widget = function () {
            return null;
        };
        return WijmoWidget;
    })();
    wijmo.WijmoWidget = WijmoWidget;    
    // This code exists only to support the TypeScript
    WijmoWidget.prototype = {
    };
    var wijinputcore = (function (_super) {
        __extends(wijinputcore, _super);
        function wijinputcore() {
            _super.apply(this, arguments);

            this._boundMouseWheel = false;
            this._wasPopupShowing = false;
        }
        wijinputcore.prototype._horizontalBorderWidth = function (elem) {
            return elem.leftBorderWidth() + elem.rightBorderWidth();
        };
        wijinputcore.prototype._verticalBorderWidth = function (elem) {
            return elem.topBorderWidth() + elem.bottomBorderWidth();
        };
        wijinputcore.prototype._create = function () {
            var _this = this;
            var focused = document.activeElement == this.element[0], hBorder = this._horizontalBorderWidth(this.element), vBorder = this._verticalBorderWidth(this.element);
            if(this.element[0].tagName.toLowerCase() !== 'input') {
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
            $.effects.save(this.element, [
                'width', 
                'height'
            ]);
            this.element.wrap("<div class='wijmo-wijinput ui-widget ui-helper-clearfix" + " ui-state-default ui-corner-all'><span class='wijmo-wijinput-wrapper'>" + "</span></div>");
            this.element.addClass('wijmo-wijinput-input ui-corner-all').attr('role', 'textbox');
            if(!($.browser.msie && parseFloat($.browser.version) <= 7)) {
                //Can't set 'aria-multiline' attribute by jQuery's attr() api in IE10 Compatibility View
                try  {
                    this.element.attr('aria-multiline', false);
                } catch (e) {
                    this.element[0].setAttribute('aria-multiline', "false");
                }//self.element.attr('aria-multiline', false);
                
            }
            this.wrapper = this.element.parent();
            this.outerDiv = this.wrapper.parent();
            if(this.options.showTrigger) {
                this.triggerBtn = $("<div class='wijmo-wijinput-trigger ui-state-default'>" + "<span class='ui-icon ui-icon-triangle-1-s'></span></div>").addClass(this.options.buttonAlign === 'left' ? 'ui-corner-left' : 'ui-corner-right').attr('role', 'button').appendTo(this.outerDiv);
                this.element.attr({
                    'role': 'combobox',
                    'aria-expanded': false
                });
            }
            if(this.options.showSpinner) {
                this.spinner = $("<div class='wijmo-wijinput-spinner wijmo-wijinput-button'></div>");
                this.spinUp = $("<div class='ui-state-default wijmo-wijinput-spinup'>" + "<span class='ui-icon ui-icon-triangle-1-n'></span></div>").attr('role', 'button');
                this.spinDown = $("<div class='ui-state-default wijmo-wijinput-spindown'>" + "<span class='ui-icon ui-icon-triangle-1-s'></span></div>").attr('role', 'button');
                if(!this.options.showTrigger) {
                    this.spinUp.addClass(this.options.buttonAlign === 'left' ? 'ui-corner-tl' : 'ui-corner-tr');
                    this.spinDown.addClass(this.options.buttonAlign === 'left' ? 'ui-corner-bl' : 'ui-corner-br');
                }
                this.spinner.append(this.spinUp).append(this.spinDown).appendTo(this.outerDiv);
                this.element.attr('role', 'spinner');
            }
            if(this.options.showTrigger && this.options.showSpinner) {
                this.outerDiv.addClass(this.options.buttonAlign === 'left' ? 'ui-input-spinner-trigger-left' : 'ui-input-spinner-trigger-right');
            } else {
                if(this.options.showTrigger) {
                    this.outerDiv.addClass(this.options.buttonAlign === 'left' ? 'ui-input-trigger-left' : 'ui-input-trigger-right');
                }
                if(this.options.showSpinner) {
                    this.outerDiv.addClass(this.options.buttonAlign === 'left' ? 'ui-input-spinner-left' : 'ui-input-spinner-right');
                }
            }
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
                this.element.height("");
            }
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
        wijinputcore.prototype._onTriggerMouseUp = function () {
            this._wasPopupShowing = this._isPopupShowing();
        };
        wijinputcore.prototype._onTriggerClicked = function () {
            if(this._wasPopupShowing) {
                this._hidePopup();
            } else {
                this._showPopup();
                this._wasPopupShowing = true;
            }
        };
        wijinputcore.prototype._showPopup = function () {
            this._popupComboList();
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
                _this._trySetFocus();
                _this.element.data('breakSpinner', false);
                _this._addState('active', $(_this));
                _this._doSpin($(e.currentTarget).hasClass('wijmo-wijinput-spinup'), true);
            }, spinButtonUp = function (e) {
                if(_this.options.disabled) {
                    return;
                }
                if(!isLeftButton(e)) {
                    return;
                }
                _this._stopSpin();
                _this._removeState('active', $(_this));
            }, dis;
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
                    },
                    'mouseup': function (e) {
                        _this._onTriggerMouseUp();
                    },
                    'click': function (e) {
                        if(_this.options.disabled) {
                            return;
                        }
                        _this._stopEvent(e);
                        _this._stopSpin();
                        _this._removeState('active', $(_this));
                        _this._trigger('triggerMouseUp');
                        _this._onTriggerClicked();
                        _this._trySetFocus();
                    }
                });
            }
            if(this.spinUp && !options.disabledState) {
                this.spinUp.bind({
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
            if(this.spinDown && !options.disabledState) {
                this.spinDown.bind({
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
            this.element.bind({
                'focus.wijinput': $.proxy(this._onFocus, this),
                'blur.wijinput': $.proxy(this._onBlur, this),
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
            this.element.data('initializing', false);
            this._resetData();
            this._endUpdate();
            this._updateText();
            if(this.options.disabledState) {
                dis = options.disabled;
                this.disable();
                options.disabled = dis;
            }
            if(this.options.disabled) {
                this.disable();
            }
            this.element.data('initialized', true);
            this._trigger('initialized');
        };
        wijinputcore.prototype._init = function () {
        };
        wijinputcore.prototype._setOption = function (key, value) {
            this._super(key, value);
            switch(key) {
                case 'buttonAlign':
                case 'showTrigger':
                case 'showSpinner':
                    this._destroy();
                    this._create();
                    break;
                case 'showNullText':
                    this._updateText();
                    break;
                case 'disabled':
                    this.element.attr('disabled', value);
                    var addRemove = value ? 'addClass' : 'removeClass', stateDisabled = this.namespace + "-state-disabled";
                    this.element[addRemove](stateDisabled);
                    if(this.triggerBtn) {
                        this.triggerBtn[addRemove](stateDisabled);
                    }
                    if(this.spinUp) {
                        this.spinUp[addRemove](stateDisabled);
                    }
                    if(this.spinDown) {
                        this.spinDown[addRemove](stateDisabled);
                    }
                    break;
            }
        };
        wijinputcore.prototype.destroy = function () {
            this._super();
            this._destroy();
        };
        wijinputcore.prototype.isDestroyed = function () {
            return !this.outerDiv;
        };
        wijinputcore.prototype._destroy = function () {
            if(this.isDestroyed()) {
                return;
            }
            this.wrapper = undefined;
            this.outerDiv = undefined;
            this.element.unbind('.wijinput');
            this.element.removeData('errorstate').removeData('breakSpinner').removeData('prevCursorPos').removeData('simulating').removeData('isPassword').removeClass('wijmo-wijinput-input').removeAttr('role').removeAttr('aria-valuemin').removeAttr('aria-valuemax').removeAttr('aria-valuenow').removeAttr('aria-expanded');
            this.element.parent().replaceWith(this.element);
            this.element.parent().replaceWith(this.element);
            $.effects.restore(this.element, [
                'width', 
                'height'
            ]);
        };
        wijinputcore.prototype.widget = function () {
            /// <summary>Gets element this widget is associated.</summary>
            return this.outerDiv || this._super();
        };
        wijinputcore.prototype._getCulture = function (name) {
            if (typeof name === "undefined") { name = this.options.culture; }
            return Globalize.findClosestCulture(name || this.options.culture);
        };
        wijinputcore.prototype._addState = function (state, el) {
            if(el.is(':not(.ui-state-disabled)')) {
                el.addClass('ui-state-' + state);
            }
        };
        wijinputcore.prototype._removeState = function (state, el) {
            el.removeClass('ui-state-' + state);
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
        wijinputcore.prototype.getText = function () {
            /// <summary>
            /// Gets the text displayed in the input box.
            /// Code example:
            /// $("#selector").wijinputcore("getText");
            /// </summary>
            if(!this._isInitialized()) {
                return this.element.val();
            }
            return this._textProvider.toString(true, false, false);
        };
        wijinputcore.prototype.setText = function (value) {
            /// <summary>
            /// Sets the text displayed in the input box.
            /// Code example:
            /// $("#selector").wijinputcore("setText", 11);
            /// </summary>
            if(!this._isInitialized()) {
                this.element.val(value);
            } else {
                this._textProvider.set(value);
                this._updateText();
            }
        };
        wijinputcore.prototype.getPostValue = function () {
            /// <summary>
            /// Gets the text value when the container
            /// form is posted back to server.
            /// Code example:
            /// $("#selector").wijinputcore("getPostValue");
            /// </summary>
            if(!this._isInitialized()) {
                return this.element.val();
            }
            return this._textProvider.toString(true, false, true);
        };
        wijinputcore.prototype.selectText = function (start, end) {
            /// <summary>
            /// Selects a range of text in the widget.
            /// Code example:
            /// $("#selector").wijinputcore("selectText", 0, 2);
            /// </summary>
            /// <param name="start" type="Number">Start of the range.</param>
            /// <param name="end" type="Number">End of the range.</param>
            if(this.element.is(':disabled')) {
                return;
            }
            this.element.wijtextselection(start, end);
        };
        wijinputcore.prototype.focus = function () {
            /// <summary>
            /// Set the focus to the widget.
            /// Code example:
            /// $("#selector").wijinputcore("focus");
            /// </summary>
            if(this.element.is(':disabled')) {
                return;
            }
            this.element.get(0).focus();
        };
        wijinputcore.prototype.isFocused = function () {
            /// <summary>
            /// Determines whether the widget has the focus.
            /// Code exapmle:
            /// $("#selector").wijinputcore("isFocused");
            /// </summary>
            return this.outerDiv.hasClass("ui-state-focus");
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
            return !this.element.attr('readOnly') && !this.element.is(':disabled');
        };
        wijinputcore.prototype._updateText = function (keepSelection) {
            if (typeof keepSelection === "undefined") { keepSelection = false; }
            if(!this._isInitialized()) {
                return;
            }
            // default is false
            keepSelection = !!keepSelection;
            var range = this.element.wijtextselection(), o = this.options;
            if(this.isDeleteAll && o.showNullText) {
                this.isDeleteAll = false;
                o.date = null;
                this.element.val(o.nullText);
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
            var selRange = this.element.wijtextselection(), rh;
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
            rh = new wijInputResult();
            this._textProvider.removeAt(selRange.start, selRange.end, rh);
            this._updateText();
            this.selectText(rh.testPosition, rh.testPosition);
        };
        wijinputcore.prototype._fireIvalidInputEvent = function (chr) {
            var _this = this;
            var cls;
            if($.isFunction(this.options.invalidInput) && this._trigger('invalidInput', null, {
                widget: this,
                char: chr
            }) === true) {
                return;
            }
            if(!this.element.data('errorstate')) {
                cls = this.options.invalidClass || 'ui-state-error';
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
            var self = this, str = null, range, start, end;
            this.element.data("simulationPending", false);
            if(typeof text === "string") {
                str = text;
            } else {
                range = this.element.wijtextselection();
                start = this.element.data('lastSelection').start;
                end = range.end;
                if(end >= start) {
                    str = this.element.val().substring(start, end);
                }
            }
            if(str) {
                window.setTimeout(function () {
                    if(!self.element.data('lastValue')) {
                        return;
                    }
                    self.element.val(self.element.data('lastValue'));
                    var lastSel = self.element.data('lastSelection'), e, i;
                    self.element.wijtextselection(lastSel);
                    self.element.data('batchKeyPress', true);
                    self.element.data('simulating', false);
                    e = jQuery.Event('keypress');
                    e.ctrlKey = e.altKey = false;
                    for(i = 0; i < str.length; i++) {
                        e.which = e.charCode = e.keyCode = str.charCodeAt(i);
                        self._onKeyPress(e);
                    }
                    self.element.data('batchKeyPress', false);
                    self._endSimulate();
                }, 1);
            }
        };
        wijinputcore.prototype._endSimulate = function () {
            this._simulateIfPending();
            this.element.removeData('ime');
            this.element.removeData('lastSelection');
            this.element.removeData('lastValue');
        };
        wijinputcore.prototype._onKeyDown = function (e) {
            this.element.data('prevCursorPos', -1);
            if(!this._isInitialized() || (this._textProvider && !!this._textProvider.noMask)) {
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
                this._stopEvent(e);
                return;
            }
            if(this._keyDownPreview(e)) {
                this._stopEvent(e);
                return;
            }
            switch(k) {
                case $.ui.keyCode.UP:
                    this._doSpin(true, false);
                    this._stopEvent(e);
                    return;
                case $.ui.keyCode.DOWN:
                    this._doSpin(false, false);
                    this._stopEvent(e);
                    return;
            }
            if(e.ctrlKey) {
                switch(k) {
                    case $.ui.keyCode.INSERT:
                    case 67:
                        // 'c'
                        return;
                    default:
                        break;
                }
            }
            if((e.ctrlKey || e.altKey)) {
                return;
            }
            switch(k) {
                case 112:
                case 113:
                case 114:
                case 115:
                case 116:
                case 117:
                case $.ui.keyCode.TAB:
                case $.ui.keyCode.CAPSLOCK:
                case $.ui.keyCode.END:
                case $.ui.keyCode.HOME:
                case $.ui.keyCode.CTRL:
                case $.ui.keyCode.SHIFT:
                    return;
                case $.ui.keyCode.BACKSPACE:
                    this._deleteSelText(true);
                    this._stopEvent(e);
                    return;
                case $.ui.keyCode.DELETE:
                    this._deleteSelText(false);
                    this._stopEvent(e);
                    return;
                case $.ui.keyCode.ENTER:
                    this._onEnterDown(e);
                    break;
                case $.ui.keyCode.ESCAPE:
                    this._stopEvent(e);
                    window.setTimeout($.proxy(this._resetData, this), 1);
                    return;
                case $.ui.keyCode.PAGE_UP:
                case $.ui.keyCode.PAGE_DOWN:
                case $.ui.keyCode.ALT:
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
                if(key === $.ui.keyCode.ENTER) {
                    this._onCompositionEnd();
                }
                return;
            }
            if(!this._isInitialized()) {
                return;
            }
            if(key === $.ui.keyCode.ENTER || key === $.ui.keyCode.ESCAPE) {
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
            var key = e.keyCode || e.which, rh, ch;
            switch(key) {
                case 0:
                case $.ui.keyCode.UP:
                case $.ui.keyCode.DOWN:
                case $.ui.keyCode.LEFT:
                case $.ui.keyCode.RIGHT:
                    return;
                case $.ui.keyCode.BACKSPACE:
                    this._stopEvent(e);
                    return;
                case $.ui.keyCode.ENTER:
                    if(this.options.hideEnter) {
                        this._stopEvent(e);
                    }
                    return;
            }
            if(e.ctrlKey || e.altKey) {
                if(key !== $.ui.keyCode.SPACE) {
                    return;
                }
            }
            if(this._keyPressPreview(e)) {
                return;
            }
            ch = String.fromCharCode(key);
            rh = this._textProvider.replaceWith(this.element.wijtextselection(), ch);
            if(rh) {
                this._updateText();
                this.selectText(rh.testPosition + 1, rh.testPosition + 1);
            } else {
                this._fireIvalidInputEvent(ch);
            }
            if(!this.element.data('batchKeyPress')) {
                this._stopEvent(e);
            }
        };
        wijinputcore.prototype._isNullText = function (val) {
            val = val || this.element.val();
            return this.options.showNullText && val === this.options.nullText;
        };
        wijinputcore.prototype._doFocus = function () {
            var selRange = this.element.wijtextselection(), sta = selRange.start, s;
            this._updateText();
            s = this.element.val();
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
        wijinputcore.prototype._onBlur = function (e) {
            var _this = this;
            if(this.options.disableUserInput) {
                return;
            }
            this._onCompositionEnd();
            if(this._isComboListVisible()) {
                return;
            }
            var focused = this.isFocused(), curPos;
            this._removeState('focus', this.outerDiv);
            if(!this.element.data('breakSpinner')) {
                this.element.get(0).focus();
                curPos = this.element.data('prevCursorPos');
                if(curPos !== undefined && curPos !== -1) {
                    this.selectText(curPos, curPos);
                }
                return;
            }
            if(!this._isInitialized() || !focused) {
                return;
            }
            this.element.data('value', this.element.val());
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
            return this._isComboListVisible();
        };
        wijinputcore.prototype._onMouseUp = function (e) {
            if(!this._isInitialized()) {
                return;
            }
            if(this.element.is(':disabled')) {
                return;
            }
            var selRange = this.element.wijtextselection();
            this.element.data('prevCursorPos', selRange.start);
        };
        wijinputcore.prototype._onChange = function () {
            if(!this.element) {
                return;
            }
            var val = this.element.val(), txt = this.getText();
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
        };
        wijinputcore.prototype._hasComboItems = function () {
            return (!!this.options.comboItems && this.options.comboItems.length);
        };
        wijinputcore.prototype._isComboListVisible = function () {
            if(!this._comboDiv) {
                return false;
            }
            return this._comboDiv.wijpopup('isVisible');
        };
        wijinputcore.prototype._popupComboList = function () {
            var _this = this;
            if(!this._hasComboItems()) {
                return;
            }
            if(!this._allowEdit()) {
                return;
            }
            var content;
            if(this._comboDiv === undefined) {
                this._comboDiv = $("<div></div>").appendTo(document.body).css('position', 'absolute');
                content = this._normalize(this.options.comboItems);
                this._comboDiv.wijlist({
                    maxItemsCount: 5,
                    selected: function (event, ui) {
                        _this._setData(ui.item.value);
                        _this._comboDiv.wijpopup('hide');
                        _this._trySetFocus();
                    }
                });
                this._comboDiv.wijlist('setItems', content);
                this._comboDiv.wijlist('renderList');
            }
            // dimensions
            this._comboDiv.width(this.outerDiv.width());
            this._comboDiv.wijlist("option", "autoSize", !this.options.comboHeight);
            if(this.options.comboHeight) {
                this._comboDiv.height(this.options.comboHeight);
            }
            this._comboDiv.wijlist("refreshSuperPanel");
            this._comboDiv.wijpopup({
                autoHide: true
            });
            this.outerDiv.attr('aria-expanded', true);
            this._comboDiv.wijpopup('show', {
                of: this.outerDiv,
                offset: '0 4',
                hidden: function () {
                    _this.outerDiv.attr('aria-expanded', false);
                }
            });
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
        return wijinputcore;
    })(WijmoWidget);
    wijmo.wijinputcore = wijinputcore;    
    ;
    wijinputcore.prototype.options = $.extend({
    }, WijmoWidget.prototype.options, {
        culture: ///	<summary>
        ///	Determines the culture used to show values in the wijinputdate widget.
        ///	</summary>
        '',
        invalidClass: ///	<summary>
        ///	The CSS class applied to the widget when an invalid value is entered.
        ///	</summary>
        'ui-state-error',
        nullText: ///	<summary>
        ///	Determines the text displayed when the widget is blank and contains no initial text.
        ///	</summary>
        '',
        showNullText: ///	<summary>
        ///	Shows the nullText value if the widget is blank and loses focus.
        ///	</summary>
        false,
        hideEnter: ///	<summary>
        ///	If true, then the browser response is disabled
        /// when the ENTER key is pressed.
        ///	</summary>
        false,
        disableUserInput: ///	<summary>
        ///	Determines whether a user can enter a value in the wijinputdate widget.
        ///	</summary>
        false,
        buttonAlign: ///	<summary>
        ///	Determines the side, left or right, where the trigger or spinner buttons appear.
        ///	Possible values are: 'left', 'right'
        ///	</summary>
        'right',
        showTrigger: ///	<summary>
        ///	Determines whether trigger button is displayed.
        ///	</summary>
        false,
        showSpinner: ///	<summary>
        ///	Determines whether spinner button is displayed.
        ///	</summary>
        false,
        comboItems: ///	<summary>
        ///	Array of data items used to populate the drop-down list.
        ///	</summary>
        undefined,
        comboWidth: ///	<summary>
        ///	Determines the width of the drop-down list.
        ///	</summary>
        undefined,
        comboHeight: ///	<summary>
        ///	Determines the height of the drop-down list.
        ///	</summary>
        undefined,
        initializing: /// <summary>
        /// The initializing event handler.
        /// A function called before the widget is initialized.
        /// Default: null.
        /// Type: Function.
        /// Code example: $("#element")
        /// .wijinputmask({ initializing: function () { } });
        /// </summary>
        null,
        initialized: /// <summary>
        /// The initialized event handler.
        /// A function called after the widget is initialized.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// $("#element").wijinputmask({ initialized: function (e) { } });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        null,
        triggerMouseDown: /// <summary>
        /// The triggerMouseDown event handler. A function called
        /// when the mouse is pressed down on the trigger button.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// $("#element").wijinputmask({ triggerMouseDown: function (e) { } });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        null,
        triggerMouseUp: /// <summary>
        /// The triggerMouseUp event handler. A function called
        /// when the mouse is released on the trigger button.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// $("#element").wijinputmask({ triggerMouseUp: function (e) { } });
        /// </summary>
        ////// <param name="e" type="Object">jQuery.Event object.</param>
        null,
        textChanged: /// <summary>
        /// Fired when the widget text is changed.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// $("#element").wijinputmask({ textChanged: function (e, arg) { } });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.text: The new text.
        ///</param>
        null,
        invalidInput: /// <summary>
        /// The invalidInput event handler. A function called
        /// when invalid charactor is typed.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// $("#element").wijinputmask({ invalidInput: function (e, data) { } });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="data" type="Object">
        /// The data that contains the related information.
        /// data.char: The newly input character.
        /// data.widget: The widget object itself.
        /// </param>
        null
    });
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
        }
        wijInputResult.prototype.clone = function () {
            var rh = new wijInputResult();
            rh.hint = this.hint;
            rh.testPosition = this.testPosition;
            return rh;
        };
        return wijInputResult;
    })();
    wijmo.wijInputResult = wijInputResult;    
    var wijTextProvider = (function () {
        function wijTextProvider() { }
        wijTextProvider.prototype.set = function (value, rh) {
        };
        wijTextProvider.prototype.toString = function (ignorePasswordChar, includePrompt, includeLiterals, start, length) {
            return "";
        };
        wijTextProvider.prototype.insertAt = function (char, index, rh) {
            return false;
        };
        wijTextProvider.prototype.removeAt = function (start, end, rh, skipCheck) {
        };
        wijTextProvider.prototype.replaceWith = function (range, text) {
            var index = range.start, result = new wijInputResult();
            if(range.start < range.end) {
                this.removeAt(range.start, range.end - 1, result, true);
                index = result.testPosition;
            }
            return this.insertAt(text, index, result) ? result : null;
        };
        return wijTextProvider;
    })();
    wijmo.wijTextProvider = wijTextProvider;    
})(wijmo || (wijmo = {}));
var wijinputcore = wijmo.wijinputcore.prototype;
var wijInputResult = wijmo.wijInputResult;
