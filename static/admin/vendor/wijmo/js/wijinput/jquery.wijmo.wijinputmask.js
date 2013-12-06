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
    /// <reference path="jquery.wijmo.wijinputcore.ts"/>
    /// <reference path="jquery.wijmo.wijinputmaskcore.ts"/>
    /*globals wijinputcore wijMaskedTextProvider wijCharDescriptor wijInputResult jQuery*/
    /*
    * Depends:
    *	jquery-1.4.2.js
    *	jquery.ui.core.js
    *	jquery.ui.widget.js
    *	jquery.ui.position.js
    *	jquery.effects.core.js
    *	jquery.effects.blind.js
    *	globalize.js
    *	jquery.wijmo.wijpopup.js
    *	jquery.wijmo.wijinputcore.js
    *  jquery.wijmo.wijinputmaskcore.js
    *
    */
    (function (input) {
        "use strict";
        var $ = jQuery;
        //#region wijinputMask
        (function (wijchartype) {
            wijchartype._map = [];
            wijchartype.editOptional = 1;
            wijchartype.editRequired = 2;
            wijchartype.separator = 4;
            wijchartype.literal = 8;
        })(input.wijchartype || (input.wijchartype = {}));
        var wijchartype = input.wijchartype;
        /** @widget */
        var wijinputmask = (function (_super) {
            __extends(wijinputmask, _super);
            function wijinputmask() {
                _super.apply(this, arguments);

                this._imMask = null;
                this._advanceMode = false;
            }
            wijinputmask._imMaskAssociatedoptions = [
                "disabled", 
                "disableUserInput", 
                "blurOnLastChar", 
                "imeMode", 
                "blurOnLeftRightKey", 
                "tabAction", 
                "nullText", 
                "placeholder", 
                "readonly", 
                "promptChar", 
                "autoConvert", 
                "showNullText", 
                "hideEnter", 
                "hidePromptOnLeave"
            ];
            wijinputmask.prototype._createTextProvider = function () {
                this._textProvider = new wijMaskedTextProvider(this, this.options.mask, false);
            };
            wijinputmask.prototype._checkMaskAndPassword = function () {
                var noMask = !this.options.mask || this.options.mask.length < 0;
                if(noMask && this._isPassword()) {
                    throw 'Option "passwordChar" requires a mask';
                }
            };
            wijinputmask.prototype._updateIsPassword = function () {
                var isPassword = this.options.passwordChar.length > 0 && this.element.attr('type') !== 'password';
                this.element.data('isPassword', isPassword);
                this._checkMaskAndPassword();
            };
            wijinputmask.prototype._beginUpdate = function () {
                this.element.addClass(this.options.wijCSS.wijinputmask);
                this._updateIsPassword();
                this.element.data('defaultText', this.options.text);
            };
            wijinputmask.prototype._setOption = function (key, value) {
                switch(key) {
                    case "maskFormat":
                        this._super(key, value);
                        key = "mask";
                        break;
                }
                _super.prototype._setOption.call(this, key, value);
                if(this._advanceMode) {
                    if(wijinputmask._imMaskAssociatedoptions.indexOf) {
                        if(wijinputmask._imMaskAssociatedoptions.indexOf(key) !== -1) {
                            this._syncProperties();
                        }
                    } else {
                        for(var i = 0; i < wijinputmask._imMaskAssociatedoptions.length; i++) {
                            if(wijinputmask._imMaskAssociatedoptions[i] === key) {
                                this._syncProperties();
                                break;
                            }
                        }
                    }
                }
                switch(key) {
                    case 'text':
                        this.setText(value);
                        break;
                    case 'mask':
                    case 'culture':
                        if(typeof (value) === 'undefined' || value.length <= 0) {
                            value = "";
                        }
                        this._checkMaskAndPassword();
                        var text = this.getText();
                        if(key === "mask") {
                            this._textProvider.mask = value;
                        }
                        this._checkFormatPattern(value);
                        if(this._advanceMode) {
                            this._imMask.SetText(text);
                        } else {
                            this._textProvider.initialize();
                            this._textProvider.setText(text);
                            this._updateText();
                        }
                        break;
                    case 'promptChar':
                    case 'nullText':
                        if(this._textProvider) {
                            this._textProvider.updatePromptChar();
                            this._updateText();
                        }
                        break;
                    case 'hidePromptOnLeave':
                    case 'resetOnPrompt':
                        this._updateText();
                        break;
                    case 'passwordChar':
                        this._updateIsPassword();
                        this._updateText();
                        break;
                }
            };
            wijinputmask.prototype._checkFormatPattern = function (value) {
                if(value instanceof RegExp || this.options.formatMode === "advanced") {
                    if(!this._advanceMode) {
                        this._detachInputEvent();
                        if(!this._imMask) {
                            this._imMask = new input.MaskControl();
                            this._addimMaskCustomEvent();
                        }
                        this._imMask.AttachInput(this.element.get(0));
                        this._attachKeyEventForDropDownList();
                        this._advanceMode = true;
                    }
                    if(value instanceof RegExp) {
                        var reg = value;
                        this._imMask.SetFormatPattern(reg.source);
                    } else {
                        this._imMask.SetFormatPattern(value);
                    }
                    this._syncProperties();
                } else {
                    if(this._advanceMode) {
                        this._imMask.DetachInput();
                        this._detachEventForDropDownList();
                        _super.prototype._attachInputEvent.call(this);
                    }
                    this._advanceMode = false;
                }
            };
            wijinputmask.prototype._attachKeyEventForDropDownList = function () {
                this.element.bind({
                    'keydown.wijinput': $.proxy(this._onKeyDownForDropDownList, this)
                });
            };
            wijinputmask.prototype._detachEventForDropDownList = function () {
                this.element.unbind(".wijinput");
            };
            wijinputmask.prototype._onKeyDownForDropDownList = function (e) {
                _super.prototype._processKeyForDropDownList.call(this, e);
            };
            wijinputmask.prototype._syncProperties = function () {
                this._imMask.SetEnabled(!this.options.disabled);
                this._imMask.SetReadOnly(!!this.options.disableUserInput);
                this._imMask.SetExitOnLastChar(!!this.options.blurOnLastChar);
                this._imMask.SetImeMode(this.options.imeMode);
                this._imMask.SetExitOnLeftRightKey(this._convertExistOnLeftRightKey(this.options.blurOnLeftRightKey));
                this._imMask.SetTabAction(this._convertTabAction(this.options.tabAction));
                this._imMask.SetDisplayNull(this.options.nullText);
                this._imMask.SetHideEnter(!!this.options.hideEnter);
                this._imMask.SetPromptChar(this.options.promptChar);
                this._imMask.SetAutoConvert(!!this.options.autoConvert);
                this._imMask.SetHidePromptOnLeave(!!this.options.hidePromptOnLeave);
            };
            wijinputmask.prototype._convertExistOnLeftRightKey = function (str) {
                if(!str) {
                    str = "none";
                }
                str = str.toLowerCase();
                if(str === "none") {
                    return input.ExitOnLeftRightKey.None;
                } else if(str === "left") {
                    return input.ExitOnLeftRightKey.Left;
                } else if(str === "right") {
                    return input.ExitOnLeftRightKey.Right;
                } else if(str === "both") {
                    return input.ExitOnLeftRightKey.Both;
                }
            };
            wijinputmask.prototype._convertTabAction = function (str) {
                if(!str) {
                    str = "control";
                }
                str = str.toLowerCase();
                if(str === "control") {
                    return input.TabAction.Control;
                } else {
                    return input.TabAction.Field;
                }
            };
            wijinputmask.prototype._addimMaskCustomEvent = function () {
                var _this = this;
                this._imMask.OnInvalidInput(function (e) {
                    _this._fireIvalidInputEvent("");
                });
                this._imMask.OnTextChanged(function (e) {
                    _this._raiseTextChanged();
                });
                this._imMask.OnEditingTextChanged(function (e) {
                    _this._updateText(true);
                });
            };
            wijinputmask.prototype._processClearButton = function () {
                this._textProvider.clear(new input.wijInputResult());
                this._updateText();
                var firstEditPosition = this._textProvider.findEditPositionFrom(0, true);
                this.selectText(firstEditPosition, firstEditPosition);
            };
            wijinputmask.prototype._resetData = function () {
                var txt = this.element.data('defaultText');
                if(txt === undefined || txt === null) {
                    txt = this.element.data('elementValue');
                }
                if(txt === undefined || txt === null) {
                    txt = "";
                }
                this.setText(txt);
            };
            wijinputmask.prototype._isPassword = function () {
                return !!this.element.data('isPassword');
            };
            wijinputmask.prototype._getTextWithPrompts = function () {
                return !this._isInitialized() ? this.element.val() : this._textProvider.toString(true, true, false);
            };
            wijinputmask.prototype._getTextWithLiterals = function () {
                return !this._isInitialized() ? this.element.val() : this._textProvider.toString(true, false, true);
            };
            wijinputmask.prototype._getTextWithPromptAndLiterals = function () {
                return !this._isInitialized() ? this.element.val() : this._textProvider.toString(true, true, true);
            };
            wijinputmask.prototype._getTextWithPromptAndLiteralsAndPassword = function () {
                return !this._isInitialized() ? this.element.val() : this._textProvider.toString(false, true, true);
            };
            wijinputmask.prototype._onChange = function () {
                if(!this.element) {
                    return;
                }
                var val = this.element.val();
                if(this.getText() !== val && this._getTextWithPrompts() !== val && this._getTextWithPromptAndLiterals() !== val) {
                    if(this._textProvider.getPasswordChar() !== "") {
                        if(this._getTextWithPromptAndLiteralsAndPassword() !== val) {
                            this.setText(val);
                        }
                    } else {
                        this.setText(val);
                    }
                }
            };
            wijinputmask.prototype._afterFocused = function () {
                if(this._isNullText() || !!this.options.hidePromptOnLeave) {
                    this._doFocus();
                }
            };
            wijinputmask.prototype._processTabKey = function (e) {
                var tabAction = this.options.tabAction;
                tabAction = tabAction ? tabAction.toLowerCase() : "control";
                if(tabAction === "control") {
                    return false;
                } else {
                    return this._moveField(!e.shiftKey);
                }
            };
            wijinputmask.prototype._moveField = function (direction) {
                var fieldList = this._textProvider._getFieldList();
                var range = this.element.wijtextselection();
                var start = range.start;
                var currentField = -1;
                if(fieldList.length > 0) {
                    if(start > fieldList[fieldList.length - 1].end) {
                        currentField = fieldList.length;
                    }
                }
                if(currentField === -1) {
                    for(var i = 0; i < fieldList.length; i++) {
                        if(start >= fieldList[i].start && start <= fieldList[i].end) {
                            currentField = i;
                            break;
                        }
                        if(start < fieldList[i].start) {
                            if(i != 0) {
                                currentField = i;
                            } else {
                                currentField = -1;
                            }
                            break;
                        }
                    }
                }
                if(direction) {
                    if(currentField === fieldList.length - 1) {
                        return false;
                    }
                    this.element.wijtextselection(fieldList[currentField + 1].start, fieldList[currentField + 1].start);
                } else {
                    if(currentField <= 0) {
                        return false;
                    }
                    this.element.wijtextselection(fieldList[currentField - 1].start, fieldList[currentField - 1].start);
                }
                return true;
            };
            wijinputmask.prototype._processLeftRightKey = function (isLeft) {
                var range = this.element.wijtextselection();
                var exitLeftRightKey = this.options.blurOnLeftRightKey ? this.options.blurOnLeftRightKey.toLowerCase() : "none";
                if(isLeft && range.start === 0) {
                    if(exitLeftRightKey === "both" || exitLeftRightKey === "left") {
                        this._moveControl(this.element.get(0), false, true);
                        return true;
                    }
                } else {
                    var exitSettingToRight = exitLeftRightKey === "both" || exitLeftRightKey === "right";
                    var caretInLast = false;
                    if(this._textProvider.noMask && range.start === this.options.text.length) {
                        caretInLast = true;
                    } else if(!this._textProvider.noMask && range.start === this._textProvider.testString.length) {
                        caretInLast = true;
                    }
                    if(!isLeft && exitSettingToRight && caretInLast) {
                        this._moveControl(this.element.get(0), true, true);
                        return true;
                    }
                }
                return false;
            };
            wijinputmask.prototype._onKeyPress = function (e) {
                if(!this._textProvider.noMask && this.options.blurOnLastChar) {
                    var before = this._textProvider._isLastCharAssigned();
                }
                _super.prototype._onKeyPress.call(this, e);
                if(!this._textProvider.noMask && this.options.blurOnLastChar) {
                    var end = this._textProvider._isLastCharAssigned();
                    if(!before && end) {
                        this._moveControl(this.element.get(0), true, true);
                    }
                }
            };
            wijinputmask.prototype.setText = /** Sets the text displayed in the input box.
            * @example
            * // This example sets text of a wijinputcore to "Hello"
            * $(".selector").wijinputcore("setText", "Hello");
            */
            function (text) {
                if(text === undefined) {
                    return;
                }
                if(this._advanceMode) {
                    this._imMask.SetValue(text);
                } else {
                    _super.prototype.setText.call(this, text);
                }
            };
            wijinputmask.prototype.getText = /** Gets the text displayed in the input box.
            */
            function () {
                if(this._advanceMode) {
                    return this._imMask.GetTextOnSimpleMode();
                } else {
                    return _super.prototype.getText.call(this);
                }
            };
            wijinputmask.prototype.selectText = /** Selects a range of text in the widget.
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
                if(this._advanceMode) {
                    this._imMask.SetSelectionStart(start);
                    this._imMask.SetSelectionLength(Math.abs(end - start));
                    this._imMask.SetFocus();
                } else {
                    _super.prototype.selectText.call(this, start, end);
                }
            };
            wijinputmask.prototype._attachInputEvent = function () {
                if(this._advanceMode) {
                    this._imMask.AttachInput(this.element.get(0));
                } else {
                    _super.prototype._attachInputEvent.call(this);
                }
            };
            wijinputmask.prototype._detachInputEvent = function () {
                if(this._advanceMode) {
                    this._imMask.DetachInput();
                } else {
                    _super.prototype._detachInputEvent.call(this);
                }
            };
            wijinputmask.prototype.getPostValue = /** Gets the text value when the container
            * form is posted back to server.
            */
            function () {
                if(this._advanceMode) {
                    return this._imMask.GetPostValueOnSimpleMode();
                } else {
                    return _super.prototype.getPostValue.call(this);
                }
            };
            wijinputmask.prototype._initialize = function () {
                if(this.options.maskFormat) {
                    this.options.mask = this.options.maskFormat;
                }
                _super.prototype._initialize.call(this);
            };
            wijinputmask.prototype._init = function () {
                _super.prototype._init.call(this);
                var val = this.options.text || this.element.val();
                if(this.options.mask) {
                    this._setOption("mask", this.options.mask);
                }
                if(val) {
                    this._setOption("text", val);
                }
            };
            wijinputmask.prototype._updateText = function (keepSelection) {
                if (typeof keepSelection === "undefined") { keepSelection = false; }
                if(!this.element.data("initialized")) {
                    if(this.options.mask instanceof RegExp || this.options.formatMode === "advanced") {
                        return;
                    }
                }
                if(this._advanceMode) {
                    if(!this._isInitialized()) {
                        return;
                    }
                    if(this.element.is(':disabled')) {
                        return;
                    }
                    var text = this._imMask.GetTextOnSimpleMode();
                    if(text !== this.options.text) {
                        this.options.text = text;
                        this._raiseTextChanged();
                    }
                } else {
                    _super.prototype._updateText.call(this, keepSelection);
                }
            };
            wijinputmask.prototype.isFocused = /** Determines whether the widget has the focus.
            */
            function () {
                if(this._advanceMode) {
                    return this._imMask.IsFocused();
                } else {
                    return _super.prototype.isFocused.call(this);
                }
            };
            return wijinputmask;
        })(input.wijinputcore);
        input.wijinputmask = wijinputmask;        
        var wijinputmask_options = (function () {
            function wijinputmask_options() {
                this.wijCSS = {
                    wijinputmask: input.wijinputcore.prototype.options.wijCSS.wijinput + "-mask"
                };
                /** Gets whether the control automatically converts to the proper format according to the format setting.
                */
                this.autoConvert = true;
                /** Determines the default text.
                */
                this.text = null;
                /** Determines the input mask to use at run time.
                * Mask must be a string composed of one or more of the masking elements.
                * Obsoleted, use maskFormat instead.
                * @ignore
                */
                this.mask = "";
                /** Determines the input mask to use at run time.
                * @remarks
                * The property can be a string composed of one or more of the masking elements as shown in the following table,
                * 0  --------- Digit, required. This element will accept any single digit between 0 and 9.
                * 9  --------- Digit or space, optional.
                * #  --------- Digit or space, optional. Plus (+) and minus (-) signs are allowed.
                * L  --------- Letter, required. Restricts input to the ASCII letters a-z and A-Z.
                *              This mask element is equivalent to [a-zA-Z] in regular expressions.
                * ?  --------- Letter, optional. Restricts input to the ASCII letters a-z and A-Z.
                *              This mask element is equivalent to [a-zA-Z]? in regular expressions.
                * &  --------- Character, required.
                * C  --------- Character, optional. Any non-control character.
                * A  --------- Alphanumeric, optional.
                * a  --------- Alphanumeric, optional.
                * .  --------- Decimal placeholder. The actual display character used will be the decimal placeholder appropriate to the culture option.
                * ,  --------- Thousands placeholder. The actual display character used will be the thousands placeholder appropriate to the culture option.
                * :  --------- Time separator. The actual display character used will be the time placeholder appropriate to the culture option.
                * /  --------- Date separator. The actual display character used will be the date placeholder appropriate to the culture option.
                * $  --------- Currency symbol. The actual character displayed will be the currency symbol appropriate to the culture option.
                * <  --------- Shift down. Converts all characters that follow to lowercase.
                * >  --------- Shift up. Converts all characters that follow to uppercase.
                * |  --------- Disable a previous shift up or shift down.
                * H  --------- All SBCS characters.
                * K  --------- SBCS Katakana.
                * ９ --------- DBCS Digit
                * Ｋ --------- DBCS Katakana
                * Ｊ --------- Hiragana
                * Ｚ --------- All DBCS characters.
                * \\ --------- Escape. Escapes a mask character, turning it into a literal. The escape sequence for a backslash is: \\\\
                * All other characters, Literals. All non-mask elements appear as themselves within wijinputmask.
                * Literals always occupy a static position in the mask at run time, and cannot be moved or deleted by the user.
                *
                *
                * The following table shows example masks.
                *     00/00/0000            A date (day, numeric month, year) in international date format. The "/" character is a logical date separator, and will appear to the user as the date separator appropriate to the application's current culture.
                *     00->L<LL-0000         A date (day, month abbreviation, and year) in United States format in which the three-letter month abbreviation is displayed with an initial uppercase letter followed by two lowercase letters.
                *     (999)-000-0000        United States phone number, area code optional. If users do not want to enter the optional characters, they can either enter spaces or place the mouse pointer directly at the position in the mask represented by the first 0.
                *     $999,999.00           A currency value in the range of 0 to 999999. The currency, thousandth, and decimal characters will be replaced at run time with their culture-specific equivalents.
                *  @example
                *  $(".selector").wijinputmask({
                *      maskFormat: "(999)-000-0000 "
                *  });
                *
                *  Value of maskFormat can also be a regex value, attentation, only the following key word supported by the regex value.
                *  \A   ----------- Matches any upper case alphabet [A-Z].
                *  \a   ----------- Matches any lower case alphabet [a-z].
                *  \D   ----------- Matches any decimal digit. Same as [0-9].
                *  \W   ----------- Matches any word character. It is same as [a-zA-Z_0-9].
                *  \K   ----------- Matches SBCS Katakana.
                *  \H   ----------- Matches all SBCS characters.
                *  \Ａ  ----------- Matches any upper case DBCS alphabet [Ａ-Ｚ].
                *  \ａ  ----------- Matches any lower case DBCS alphabet [ａ-ｚ].
                *  \Ｄ  ----------- Matches any DBCS decimal digit. Same as [０-９].
                *  \Ｗ  ----------- Matches any DBCS word character. It is same as [ａ-ｚＡ-Ｚ＿０-９].
                *  \Ｋ  ----------- DBCS Katakana
                *  \Ｊ  ----------- Hiragana
                *  \Ｚ  ----------- All DBCS characters.
                *  [^] Used to express an exclude subset.
                *  - Used to define a contiguous character range.
                *  {} Specifies that the pattern.
                *  * The short expression of {0,}.
                *  + The short expression of {1,}.
                *  ? The short expression of {0,1}.
                *
                *
                *  The following shows some example use Regex value.
                *  \D{3}-\D{4}                      Zip Code (012-3456)
                *  ℡ \D{2,4}-\D{2,4}-\D{4}/        Phone number (℡ 012-345-6789)
                *  \D{2,4}-\D{2,4}-\D{4}            Phone number (012-345-6789)
                *  Attentation, because maskFormat requrie that it uses a regex value, so assign the value as follows example.
                *  @example
                *  $(".selector").wijinputmask({
                *      maskFormat: /\D{3}-\D{4}/
                *  });
                *  $(".selector").wijinputmask({
                *          maskFormat: new RegExp("\\D{3}-\\D{4}")
                *  });
                */
                this.maskFormat = "";
                /** Determines the character that appears when the widget has focus but no input has been entered.
                */
                this.promptChar = '_';
                /** Indicates whether the prompt characters in the input mask are hidden when the input loses focus.
                * @remarks
                * This property doesn't take effect when maskFormat property is set to a Regex value.
                */
                this.hidePromptOnLeave = false;
                /** Determines how an input character that matches
                * the prompt character should be handled.
                * @remarks
                * This property doesn't take effect when maskFormat property is set to a Regex value.
                */
                this.resetOnPrompt = true;
                /** Indicates whether promptChar can be entered as valid data by the user.
                * @remarks
                * This property doesn't take effect when maskFormat property is set to a Regex value.
                */
                this.allowPromptAsInput = false;
                /** Determines the character to be substituted for the actual input characters.
                * @remarks
                * This property doesn't take effect when maskFormat property is set to a Regex value.
                */
                this.passwordChar = '';
                /** Determines how a space input character should be handled.
                * @remarks
                * This property doesn't take effect when maskFormat property is set to a Regex value.
                */
                this.resetOnSpace = true;
                /** Indicates whether the user is allowed to re-enter literal values.
                * @remarks
                * This property doesn't take effect when maskFormat property is set to a Regex value.
                */
                this.skipLiterals = true;
                /** Determines whether or not the next control in the tab order receives
                the focus as soon as the control is filled at the last character.
                */
                this.blurOnLastChar = false;
                /** Determines whether the focus will move to the next filed or the next control when press the tab key.
                * Possible values are "control", "field".
                * @remarks
                * The caret moves to the next field when this property is "field".
                * If the caret is in the last field, the input focus leaves this control when pressing the TAB key.
                * If the value is "control", the behavior is similar to the standard control.
                */
                this.tabAction = "control";
                /** Determines the input method setting of widget.
                * Possible values are: 'auto', 'active', 'inactive', 'disabled'
                * @remarks
                * This property only take effect on IE browser.
                */
                this.imeMode = "auto";
            }
            return wijinputmask_options;
        })();        
        wijinputmask.prototype.options = $.extend(true, {
        }, input.wijinputcore.prototype.options, new wijinputmask_options());
        $.wijmo.registerWidget("wijinputmask", wijinputmask.prototype);
        var wijMaskedTextProvider = (function (_super) {
            __extends(wijMaskedTextProvider, _super);
            function wijMaskedTextProvider(inputWidget, mask, asciiOnly) {
                        _super.call(this);
                this.inputWidget = inputWidget;
                this.mask = mask;
                this.asciiOnly = asciiOnly;
                this.testString = '';
                this.assignedCharCount = 0;
                this.requiredCharCount = 0;
                this.noMask = false;
                this._autoConvertPosition = 0;
                this._needCheckNextChar = false;
                this.descriptors = [];
                this.initialize();
            }
            wijMaskedTextProvider.FK_K = "K";
            wijMaskedTextProvider.FK_H = "H";
            wijMaskedTextProvider.FK_DB_9 = input.CharProcess.CharEx.ToFullWidth('9').text;
            wijMaskedTextProvider.FK_DB_K = input.CharProcess.CharEx.ToFullWidth('K').text;
            wijMaskedTextProvider.FK_DB_J = input.CharProcess.CharEx.ToFullWidth('J').text;
            wijMaskedTextProvider.FK_DB_Z = input.CharProcess.CharEx.ToFullWidth('Z').text;
            wijMaskedTextProvider.DBCS_0 = input.CharProcess.CharEx.ToFullWidth('0').text;
            wijMaskedTextProvider.DBCS_9 = input.CharProcess.CharEx.ToFullWidth('9').text;
            wijMaskedTextProvider.DBCS_A = input.CharProcess.CharEx.ToFullWidth('A').text;
            wijMaskedTextProvider.DBCS_a = input.CharProcess.CharEx.ToFullWidth('a').text;
            wijMaskedTextProvider.DBCS_Z = input.CharProcess.CharEx.ToFullWidth('Z').text;
            wijMaskedTextProvider.DBCS_z = input.CharProcess.CharEx.ToFullWidth('z').text;
            wijMaskedTextProvider.prototype.initialize = function () {
                this.noMask = (!this.mask || this.mask.length <= 0);
                if(this.noMask) {
                    return;
                }
                this.testString = '';
                this.assignedCharCount = 0;
                this.requiredCharCount = 0;
                this.descriptors = [];
                var caseType = 'none';
                var escape = false;
                var charType = wijchartype.literal;
                var text = '';
                var culture = this.inputWidget._getCulture();
                for(var i = 0; i < this.mask.length; i++) {
                    var needDesc = false;
                    var ch = this.mask.charAt(i);
                    if(escape) {
                        escape = false;
                        needDesc = true;
                    }
                    if(!needDesc) {
                        var ch3 = ch;
                        if(ch3 <= 'C') {
                            switch(ch3) {
                                case '#':
                                case '9':
                                case '?':
                                case 'C':
                                    ch = this.getPromtChar();
                                    charType = wijchartype.editOptional;
                                    needDesc = true;
                                    break;
                                case '$':
                                    text = culture.numberFormat.currency.symbol;
                                    charType = wijchartype.separator;
                                    needDesc = true;
                                    break;
                                case '%':
                                case '-':
                                case ';':
                                case '=':
                                case '@':
                                    charType = wijchartype.literal;
                                    needDesc = true;
                                    break;
                                case '&':
                                case '0':
                                case 'A':
                                    ch = this.getPromtChar();
                                    charType = wijchartype.editRequired;
                                    needDesc = true;
                                    break;
                                case ',':
                                    text = culture.numberFormat[','];
                                    charType = wijchartype.separator;
                                    needDesc = true;
                                    break;
                                case '.':
                                    text = culture.numberFormat['.'];
                                    charType = wijchartype.separator;
                                    needDesc = true;
                                    break;
                                case '/':
                                    text = culture.calendars.standard['/'];
                                    charType = wijchartype.separator;
                                    needDesc = true;
                                    break;
                                case ':':
                                    text = culture.calendars.standard[':'];
                                    charType = wijchartype.separator;
                                    needDesc = true;
                                    break;
                                case '<':
                                    caseType = 'lower';
                                    continue;
                                case '>':
                                    caseType = 'upper';
                                    continue;
                            }
                            if(!needDesc) {
                                charType = wijchartype.literal;
                                needDesc = true;
                            }
                        }
                        if(!needDesc) {
                            if(ch3 <= '\\') {
                                switch(ch3) {
                                    case wijMaskedTextProvider.FK_K:
                                    case wijMaskedTextProvider.FK_H:
                                    case 'L':
                                        ch = this.getPromtChar();
                                        charType = wijchartype.editRequired;
                                        needDesc = true;
                                        break;
                                    case '\\':
                                        escape = true;
                                        charType = wijchartype.literal;
                                        continue;
                                }
                                if(!needDesc) {
                                    charType = wijchartype.literal;
                                    needDesc = true;
                                }
                            }
                            if(!needDesc) {
                                if(ch3 === 'a') {
                                    ch = this.getPromtChar();
                                    charType = wijchartype.editOptional;
                                    needDesc = true;
                                }
                                switch(ch3) {
                                    case wijMaskedTextProvider.FK_DB_K:
                                    case wijMaskedTextProvider.FK_DB_J:
                                    case wijMaskedTextProvider.FK_DB_9:
                                    case wijMaskedTextProvider.FK_DB_Z:
                                        ch = this.getPromtChar();
                                        charType = wijchartype.editRequired;
                                        needDesc = true;
                                        break;
                                }
                                if(!needDesc) {
                                    if(ch3 !== '|') {
                                        charType = wijchartype.literal;
                                        needDesc = true;
                                    }
                                    if(!needDesc) {
                                        caseType = 'none';
                                        continue;
                                    }
                                }
                            }
                        }
                    }
                    if(needDesc) {
                        var cd = new wijCharDescriptor(i, charType);
                        if(this.isEditDesc(cd)) {
                            cd.caseConversion = caseType;
                        }
                        if(charType !== wijchartype.separator) {
                            text = ch;
                        }
                        for(var j = 0; j < text.length; j++) {
                            this.testString = this.testString + text.charAt(j);
                            this.descriptors[this.descriptors.length] = cd;
                        }
                    }
                }
            };
            wijMaskedTextProvider.prototype.getAllowPromptAsInput = function () {
                return !!this.inputWidget ? this.inputWidget.options.allowPromptAsInput : false;
            };
            wijMaskedTextProvider.prototype.getPasswordChar = function () {
                var password = !!this.inputWidget ? this.inputWidget.options.passwordChar : '*';
                if(password === "") {
                    password = "*";
                }
                if(password.length > 1) {
                    return password.charAt(0);
                } else {
                    return password;
                }
            };
            wijMaskedTextProvider.prototype.isPassword = function () {
                return !!this.inputWidget ? this.inputWidget._isPassword() : false;
            };
            wijMaskedTextProvider.prototype.getResetOnPrompt = function () {
                return !!this.inputWidget ? this.inputWidget.options.resetOnPrompt : true;
            };
            wijMaskedTextProvider.prototype.getResetOnSpace = function () {
                return !!this.inputWidget ? this.inputWidget.options.resetOnSpace : true;
            };
            wijMaskedTextProvider.prototype.getSkipLiterals = function () {
                return !!this.inputWidget ? this.inputWidget.options.skipLiterals : true;
            };
            wijMaskedTextProvider.prototype.getHidePromptOnLeave = function () {
                return !!this.inputWidget ? this.inputWidget.options.hidePromptOnLeave : false;
            };
            wijMaskedTextProvider.prototype._trueOR = function (n1, n2) {
                return (n1 >>> 1 | n2 >>> 1) * 2 + (n1 & 1 | n2 & 1);
            };
            wijMaskedTextProvider.prototype.setValue = function (val) {
                return false;
            };
            wijMaskedTextProvider.prototype.getValue = function () {
                return null;
            };
            wijMaskedTextProvider.prototype.getPromtChar = function () {
                var promptChar = !!this.inputWidget ? this.inputWidget.options.promptChar : '_';
                if(promptChar === "") {
                    promptChar = "_";
                }
                if(promptChar.length > 1) {
                    return promptChar.charAt(0);
                } else {
                    return promptChar;
                }
            };
            wijMaskedTextProvider.prototype.getAutoConvert = function () {
                return !!this.inputWidget ? this.inputWidget.options.autoConvert : true;
            };
            wijMaskedTextProvider.prototype.updatePromptChar = function () {
                if(this.noMask) {
                    return;
                }
                for(var i = 0; i < this.descriptors.length; i++) {
                    var cd = this.descriptors[i];
                    if(cd.charType === wijchartype.editOptional || cd.charType === wijchartype.editRequired) {
                        if(!cd.isAssigned) {
                            this.testString = $.wij.charValidator.setChar(this.testString, this.getPromtChar(), i);
                        }
                    }
                }
            };
            wijMaskedTextProvider.prototype.resetChar = function (pos) {
                var cd = this.descriptors[pos];
                if(this.isEditPos(pos) && cd.isAssigned) {
                    cd.isAssigned = false;
                    this.testString = $.wij.charValidator.setChar(this.testString, this.getPromtChar(), pos);
                    this.assignedCharCount--;
                    if(cd.charType === wijchartype.editRequired) {
                        this.requiredCharCount--;
                    }
                }
            };
            wijMaskedTextProvider.prototype.getAdjustedPos = function (pos) {
                if(this.noMask) {
                    pos = Math.min(pos, this.testString.length - 1);
                } else {
                    if(pos >= this.descriptors.length) {
                        pos--;
                    }
                }
                return Math.max(0, pos);
            };
            wijMaskedTextProvider.prototype.findNonEditPositionInRange = function (start, end, direction) {
                var trueOr = this._trueOR(wijchartype.literal, wijchartype.separator);
                return this.findPositionInRange(start, end, direction, trueOr);
            };
            wijMaskedTextProvider.prototype.findPositionInRange = function (start, end, direction, charType) {
                start = Math.max(0, start);
                end = Math.min(end, this.testString.length - 1);
                if(start <= end) {
                    while(start <= end) {
                        var pos = (direction) ? start++ : end--;
                        var cd = this.descriptors[pos];
                        if(((cd.charType & 4294967295) & (charType & 4294967295)) === cd.charType) {
                            return pos;
                        }
                    }
                }
                return -1;
            };
            wijMaskedTextProvider.prototype.findAssignedEditPositionInRange = function (start, end, direction) {
                if(this.assignedCharCount === 0) {
                    return -1;
                }
                return this.findEditPositionInRange(start, end, direction, wijchartype.editRequired);
            };
            wijMaskedTextProvider.prototype.findEditPositionInRange = function (start, end, direction, assignedStatus) {
                do {
                    var trueOr = this._trueOR(wijchartype.editRequired, wijchartype.editOptional);
                    var pos = this.findPositionInRange(start, end, direction, trueOr);
                    if(pos === -1) {
                        break;
                    }
                    var cd = this.descriptors[pos];
                    switch(assignedStatus) {
                        case // DaryLuo, this case never run.
                        wijchartype.editOptional:
                            if(!cd.isAssigned) {
                                return pos;
                            }
                            break;
                        case wijchartype.editRequired:
                            if(cd.isAssigned) {
                                return pos;
                            }
                            break;
                        default:
                            return pos;
                    }
                    if(direction) {
                        start++;
                    } else {
                        end--;
                    }
                }while(start <= end);
                return -1;
            };
            wijMaskedTextProvider.prototype.findAssignedEditPositionFrom = function (pos, direction) {
                if(!this.assignedCharCount) {
                    return -1;
                }
                var start, end;
                if(direction) {
                    start = pos;
                    end = this.testString.length - 1;
                } else {
                    start = 0;
                    end = pos;
                }
                return this.findAssignedEditPositionInRange(start, end, direction);
            };
            wijMaskedTextProvider.prototype.findEditPositionFrom = function (pos, direction) {
                var start, end;
                if(direction) {
                    start = pos;
                    end = this.testString.length - 1;
                } else {
                    start = 0;
                    end = pos;
                }
                return this.findEditPositionInRange(start, end, direction, 0);
            };
            wijMaskedTextProvider.prototype.setChar = function (strInput, pos, desc) {
                if(this.getAutoConvert()) {
                    var tempResult = new wijmo.input.wijInputResult();
                    var success = this.testInternal(strInput, pos, tempResult);
                    if(!success) {
                        var result = this._convert(strInput, 0);
                        if(strInput.length === 0) {
                            debugger;

                        }
                        strInput = result.strValue.charAt(0);
                        if(result.strValue.length > 1) {
                            this.inputWidget.element.data("appendChar", result.strValue.charAt(1));
                        }
                        if(result.index === 2) {
                            this.inputWidget.element.data("skipNextChar", true);
                        }
                    }
                }
                pos = Math.max(0, pos);
                if(!desc) {
                    desc = this.descriptors[pos];
                }
                if(this.testEscapeChar(strInput, pos, desc)) {
                    this.resetChar(pos);
                } else {
                    if($.wij.charValidator.isLetter(strInput)) {
                        if($.wij.charValidator.isUpper(strInput)) {
                            if(desc.caseConversion === 'lower') {
                                strInput = strInput.toLowerCase();
                            }
                        } else if(desc.caseConversion === 'upper') {
                            strInput = strInput.toUpperCase();
                        }
                    }
                    this.testString = $.wij.charValidator.setChar(this.testString, strInput, pos);
                    if(!desc.isAssigned) {
                        desc.isAssigned = true;
                        this.assignedCharCount++;
                        if(desc.charType === wijchartype.editRequired) {
                            this.requiredCharCount++;
                        }
                    }
                }
            };
            wijMaskedTextProvider.prototype.internalInsertAt = function (strInput, pos, inputResult, testOnly) {
                if(strInput.length === 0) {
                    inputResult.testPosition = pos;
                    inputResult.hint = inputResult.noEffect;
                    return true;
                }
                if(!this._testString(strInput, pos, inputResult)) {
                    return false;
                }
                var editPosition = this.findEditPositionFrom(pos, true);
                var hasAssignedRequiredField = this.findAssignedEditPositionInRange(editPosition, inputResult.testPosition, true) !== -1;
                if(hasAssignedRequiredField && (inputResult.testPosition === (this.testString.length - 1))) {
                    inputResult.hint = inputResult.unavailableEditPosition;
                    inputResult.testPosition = this.testString.length;
                    return false;
                }
                var rightEditablePosition = this.findEditPositionFrom(inputResult.testPosition + 1, true);
                if(hasAssignedRequiredField) {
                    var tempResult = new input.wijInputResult();
                    tempResult.hint = tempResult.unknown;
                    var repeat = true;
                    var lastAssignedReqField = this.findAssignedEditPositionFrom(this.testString.length - 1, false);
                    while(repeat) {
                        repeat = false;
                        if(rightEditablePosition === -1) {
                            inputResult.hint = inputResult.unavailableEditPosition;
                            inputResult.testPosition = this.testString.length;
                            return false;
                        }
                        var testCharResult = this.testChar(this.testString.charAt(editPosition), rightEditablePosition, tempResult);
                        if(this.descriptors[editPosition].isAssigned && !testCharResult) {
                            inputResult.hint = tempResult.hint;
                            inputResult.testPosition = rightEditablePosition;
                            return false;
                        }
                        if(editPosition !== lastAssignedReqField) {
                            editPosition = this.findEditPositionFrom(editPosition + 1, true);
                            rightEditablePosition = this.findEditPositionFrom(rightEditablePosition + 1, true);
                            repeat = true;
                            continue;
                        }
                    }
                    inputResult.hint = Math.max(inputResult.hint, tempResult.hint);
                }
                if(!testOnly) {
                    if(hasAssignedRequiredField) {
                        while(editPosition >= pos) {
                            if(this.descriptors[editPosition].isAssigned) {
                                this.setChar(this.testString.charAt(editPosition), rightEditablePosition);
                            } else {
                                this.resetChar(rightEditablePosition);
                            }
                            rightEditablePosition = this.findEditPositionFrom(rightEditablePosition - 1, false);
                            editPosition = this.findEditPositionFrom(editPosition - 1, false);
                        }
                    }
                    this.setString(strInput, pos);
                }
                return true;
            };
            wijMaskedTextProvider.prototype.insertAt = function (strInput, pos, inputResult) {
                if (typeof inputResult === "undefined") { inputResult = new input.wijInputResult(); }
                if(strInput === undefined) {
                    throw 'InsertAt: input';
                }
                if(this.noMask) {
                    this.testString = this.testString.substring(0, pos) + strInput + this.testString.substring(pos, this.testString.length);
                    inputResult.testPosition = pos + strInput.length - 1;
                    return true;
                }
                if((pos >= 0) && (pos < this.testString.length)) {
                    return this.internalInsertAt(strInput, pos, inputResult, false);
                }
                inputResult.testPosition = pos;
                inputResult.hint = inputResult.positionOutOfRange;
                return false;
            };
            wijMaskedTextProvider.prototype.clear = function (inputResult) {
                if(this.noMask) {
                    this.testString = '';
                    inputResult.hint = inputResult.success;
                    return;
                }
                if(!this.assignedCharCount) {
                    inputResult.hint = inputResult.noEffect;
                } else {
                    inputResult.hint = inputResult.success;
                    for(var i = 0; i < this.testString.length; i++) {
                        this.resetChar(i);
                    }
                }
            };
            wijMaskedTextProvider.prototype.isLiteral = function (desc) {
                if(!desc) {
                    return false;
                }
                return desc.charType === wijchartype.literal || desc.charType === wijchartype.separator;
            };
            wijMaskedTextProvider.prototype.testEscapeChar = function (strInput, pos, desc) {
                pos = Math.max(0, pos);
                if(!desc) {
                    desc = this.descriptors[pos];
                }
                if(this.isLiteral(desc)) {
                    if(this.getSkipLiterals()) {
                        return (strInput === this.testString.charAt(pos));
                    }
                    return false;
                }
                var c1 = this.getResetOnPrompt() && strInput === this.getPromtChar();
                var c2 = this.getResetOnSpace() && strInput === ' ';
                return c1 || c2;
            };
            wijMaskedTextProvider.prototype.testChar = function (strInput, pos, rh) {
                var success = this.testInternal(strInput, pos, rh);
                if(!success && this.getAutoConvert()) {
                    this._autoConvertPosition = pos;
                    var result = this._convert(strInput, 0);
                    success = result.strValue.length > 0;
                    if(result.strValue.length > 1) {
                        this.inputWidget.element.data("appendChar", result.strValue.charAt(1));
                    }
                    if(result.index === 2) {
                        this.inputWidget.element.data("skipNextChar", true);
                    }
                }
                return success;
            };
            wijMaskedTextProvider.prototype.testInternal = function (strInput, pos, rh) {
                if(!$.wij.charValidator.isPrintableChar(strInput)) {
                    rh.hint = rh.invalidInput;
                    return false;
                }
                var cd = this.descriptors[pos];
                if(!cd) {
                    return false;
                }
                if(this.isLiteral(cd)) {
                    if(this.getSkipLiterals() && strInput === this.testString.charAt(pos)) {
                        rh.hint = rh.characterEscaped;
                        return true;
                    }
                    rh.hint = rh.nonEditPosition;
                    return false;
                }
                if(strInput === this.getPromtChar()) {
                    if(this.getResetOnPrompt()) {
                        if(this.isEditDesc(cd) && cd.isAssigned) {
                            rh.hint = rh.sideEffect;
                        } else {
                            rh.hint = rh.characterEscaped;
                        }
                        return true;
                    }
                    if(!this.getAllowPromptAsInput()) {
                        rh.hint = rh.promptCharNotAllowed;
                        return false;
                    }
                }
                if((strInput === ' ') && this.getResetOnSpace()) {
                    if(this.isEditDesc(cd) && cd.isAssigned) {
                        rh.hint = rh.sideEffect;
                    } else {
                        rh.hint = rh.characterEscaped;
                    }
                    return true;
                }
                switch(this.mask.charAt(cd.maskPosition)) {
                    case 'L':
                        if(!$.wij.charValidator.isLetter(strInput)) {
                            rh.hint = rh.letterExpected;
                            return false;
                        }
                        if(!$.wij.charValidator.isAsciiLetter(strInput) && this.asciiOnly) {
                            rh.hint = rh.asciiCharacterExpected;
                            return false;
                        }
                        break;
                    case '?':
                        if(!$.wij.charValidator.isLetter(strInput) && (strInput !== ' ')) {
                            rh.hint = rh.letterExpected;
                            return false;
                        }
                        if(!$.wij.charValidator.isAsciiLetter(strInput) && this.asciiOnly) {
                            rh.hint = rh.asciiCharacterExpected;
                            return false;
                        }
                        break;
                    case 'A':
                        if(!$.wij.charValidator.isAlphanumeric(strInput)) {
                            rh.hint = rh.alphanumericCharacterExpected;
                            return false;
                        }
                        if(!$.wij.charValidator.isAciiAlphanumeric(strInput) && this.asciiOnly) {
                            rh.hint = rh.asciiCharacterExpected;
                            return false;
                        }
                        break;
                    case 'a':
                        if(!$.wij.charValidator.isAlphanumeric(strInput) && (strInput !== ' ')) {
                            rh.hint = rh.alphanumericCharacterExpected;
                            return false;
                        }
                        if(!$.wij.charValidator.isAciiAlphanumeric(strInput) && this.asciiOnly) {
                            rh.hint = rh.asciiCharacterExpected;
                            return false;
                        }
                        break;
                    case '&':
                        if(!$.wij.charValidator.isAscii(strInput) && this.asciiOnly) {
                            rh.hint = rh.asciiCharacterExpected;
                            return false;
                        }
                        break;
                    case 'C':
                        if((!$.wij.charValidator.isAscii(strInput) && this.asciiOnly) && (strInput !== ' ')) {
                            rh.hint = rh.asciiCharacterExpected;
                            return false;
                        }
                        break;
                    case '0':
                        if(!$.wij.charValidator.isDigit(strInput)) {
                            rh.hint = rh.digitExpected;
                            return false;
                        }
                        break;
                    case '9':
                        if(!$.wij.charValidator.isDigit(strInput) && (strInput !== ' ')) {
                            rh.hint = rh.digitExpected;
                            return false;
                        }
                        break;
                    case wijMaskedTextProvider.FK_DB_9:
                        if(strInput >= wijMaskedTextProvider.DBCS_0 && strInput <= wijMaskedTextProvider.DBCS_9) {
                        } else if(strInput === " ") {
                        } else {
                            return false;
                        }
                        break;
                    case '#':
                        if((!$.wij.charValidator.isDigit(strInput) && (strInput !== '-')) && ((strInput !== '+') && (strInput !== ' '))) {
                            rh.hint = rh.digitExpected;
                            return false;
                        }
                        break;
                    case wijMaskedTextProvider.FK_K:
                        // HarfWidthKatakana
                        if(!input.CharProcess.CharEx.IsFullWidth(strInput) && input.CharProcess.CharEx.IsKatakana(strInput)) {
                        } else {
                            return false;
                        }
                        break;
                    case wijMaskedTextProvider.FK_H:
                        if(input.CharProcess.CharEx.IsFullWidth(strInput)) {
                            return false;
                        }
                        break;
                    case wijMaskedTextProvider.FK_DB_K:
                        if(input.CharProcess.CharEx.IsFullWidth(strInput) && input.CharProcess.CharEx.IsKatakana(strInput)) {
                        } else {
                            return false;
                        }
                        break;
                    case wijMaskedTextProvider.FK_DB_J:
                        if(!input.CharProcess.CharEx.IsHiragana(strInput)) {
                            return false;
                        }
                        break;
                    case wijMaskedTextProvider.FK_DB_Z:
                        if(!input.CharProcess.CharEx.IsFullWidth(strInput)) {
                            return false;
                        }
                        break;
                }
                if(strInput === this.testString.charAt(pos) && cd.isAssigned) {
                    rh.hint = rh.noEffect;
                } else {
                    rh.hint = rh.success;
                }
                return true;
            };
            wijMaskedTextProvider.prototype._convert = function (text, index) {
                var retObj = {
                };
                retObj.success = true;
                retObj.strValue = "";
                retObj.index = index;
                var c = text.Substring(index, index + 1);
                var _isValid;
                var charEx = input.CharProcess.CharEx;
                //if (true) {
                //    var charLength = {};
                //    var result = IVSCharHelper.ConvertedWithIVS(c, 0, charLength);
                //    if (result.length > 0) {
                //        _isValid = this._isValid(result);
                //        if (_isValid) {
                //            index++;
                //            retObj.index = index;
                //            retObj.strValue = result;
                //            return retObj;
                //        }
                //    }
                //}
                // Convert between upper and lower alphabet automatically.
                var include = true;
                if(charEx.IsAlphabet(c)) {
                    var r = charEx.IsLower(c) ? c.toUpperCase() : c.toLowerCase();
                    _isValid = this._isValid(r);
                    if((_isValid && include) || (!_isValid && !include)) {
                        index++;
                        retObj.index = index;
                        retObj.strValue = r;
                        return retObj;
                        //return new string(r, 1);
                                            }
                    c = charEx.IsFullWidth(c) ? charEx.ToHalfWidth(c) : charEx.ToFullWidth(c).text;
                    _isValid = this._isValid(c);
                    if((_isValid && include) || (!_isValid && !include)) {
                        index++;
                        retObj.index = index;
                        retObj.strValue = c;
                        return retObj;
                        //return new string(c, 1);;
                                            }
                    r = charEx.IsFullWidth(r) ? charEx.ToHalfWidth(r) : charEx.ToFullWidth(r).text;
                    _isValid = this._isValid(r);
                    if((_isValid && include) || (!_isValid && !include)) {
                        index++;
                        retObj.index = index;
                        retObj.strValue = r;
                        return retObj;
                        //return new string(r, 1);;
                                            }
                    retObj.success = false;
                    return retObj;
                }
                // Convert from Hiragana to DBCS/SBCS Katakana automatically.
                if(charEx.IsHiragana(c)) {
                    // Large < - > Small
                    if(charEx.IsLowerKana(c)) {
                        var u = charEx.ToUpperKana(c);
                        _isValid = this._isValid(u);
                        if((_isValid && include) || (!_isValid && !include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = u;
                            return retObj;
                        }
                    } else if(charEx.HasLowerKana(c)) {
                        var l = charEx.ToLowerKana(c);
                        _isValid = this._isValid(l);
                        if((_isValid && include) || (!_isValid && !include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = l;
                            return retObj;
                        }
                    }
                    c = charEx.ToKatakana(c);
                    // DaryLuo 2012/05/31 fix bug 116 in IM7. Add this.
                    _isValid = this._isValid(c);
                    if((_isValid && include) || (!_isValid && !include)) {
                        index++;
                        retObj.index = index;
                        retObj.strValue = c;
                        return retObj;
                        //return new string(c, 1);
                                            }
                    if(charEx.IsLowerKana(c)) {
                        var u = charEx.ToUpperKana(c);
                        // DaryLuo 2012/05/31 fix bug 116 in IM7. Add this.
                        _isValid = this._isValid(u);
                        if((_isValid && include) || (!_isValid && !include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = u;
                            return retObj;
                        }
                    } else if(charEx.HasLowerKana(c)) {
                        var l = charEx.ToLowerKana(c);
                        _isValid = this._isValid(l);
                        if((_isValid && include) || (!_isValid && !include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = l;
                            return retObj;
                        }
                    }
                    var chars = charEx.ToHalfWidthEx(c);
                    _isValid = this._isValid(chars);
                    if((_isValid && include) || (!_isValid && !include)) {
                        index++;
                        retObj.index = index;
                        retObj.strValue = chars;
                        return retObj;
                        //return new string(chars);
                                            }
                    if(charEx.IsLowerKana(chars)) {
                        chars = charEx.ToUpperKana(chars);
                        _isValid = this._isValid(chars);
                        if((_isValid && include) || (!_isValid && !include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = chars;
                            return retObj;
                        }
                    } else if(charEx.HasLowerKana(chars)) {
                        chars = charEx.ToLowerKana(chars);
                        _isValid = this._isValid(chars);
                        if((_isValid && include) || (!_isValid && !include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = chars;
                            return retObj;
                        }
                    }
                    retObj.success = false;
                    return retObj;
                }
                // Convert from Katakana to Hiragana (or DBCS <-> SBCS)automatically.
                if(charEx.IsKatakana(c)) {
                    // Large < - > Small
                    if(charEx.IsLowerKana(c)) {
                        var u = charEx.ToUpperKana(c);
                        _isValid = this._isValid(u);
                        if((_isValid && include) || (!_isValid && !include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = u;
                            return retObj;
                        }
                    } else if(charEx.HasLowerKana(c)) {
                        var l = charEx.ToLowerKana(c);
                        _isValid = this._isValid(l);
                        if((_isValid && include) || (!_isValid && !include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = l;
                            return retObj;
                        }
                    }
                    var r = c;
                    var processedAll = false;
                    // Check the soundex character.
                    if(charEx.IsFullWidth(c)) {
                        var newChars = charEx.ToHalfWidthEx(c);
                        if(newChars.GetLength() > 0) {
                            _isValid = this._isValid(newChars);
                            if((_isValid && include) || (!_isValid && !include)) {
                                index++;
                                retObj.index = index;
                                retObj.strValue = newChars;
                                return retObj;
                                //return new string(newChars);
                                                            }
                        }
                        if(charEx.IsLowerKana(newChars)) {
                            newChars = charEx.ToUpperKana(newChars);
                            _isValid = this._isValid(newChars);
                            if((_isValid && include) || (!_isValid && !include)) {
                                index++;
                                retObj.index = index;
                                retObj.strValue = newChars;
                                return retObj;
                            }
                        } else if(charEx.HasLowerKana(newChars)) {
                            newChars = charEx.ToLowerKana(newChars);
                            _isValid = this._isValid(newChars);
                            if((_isValid && include) || (!_isValid && !include)) {
                                index++;
                                retObj.index = index;
                                retObj.strValue = newChars;
                                return retObj;
                            }
                        }
                    } else {
                        if(index == null) {
                            r = charEx.ToFullWidth(c).text;
                            if(!charEx.IsKatakana(r)) {
                                return retObj;
                            }
                            _isValid = this._isValid(r);
                            if((_isValid && include) || (!_isValid && !include)) {
                                index++;
                                retObj.index = index;
                                retObj.strValue = r;
                                return retObj;
                            }
                        } else {
                            // To process what??? kyle.wang
                            var nextChar = this.inputWidget.element.data("nextChar");
                            if(this._needCheckNextChar && nextChar && nextChar.length > 0) {
                                //r = charEx.ToFullWidthEx(out processedAll, new char[] {c, text[index + 1]});
                                var convertObj = charEx.ToFullWidth(text + nextChar);
                                r = convertObj.text;
                                processedAll = convertObj.processedAll;
                            } else {
                                r = charEx.ToFullWidth(c).text;
                            }
                            if(!charEx.IsKatakana(r))// ***********
                             {
                                return retObj;
                            }
                            _isValid = this._isValid(r);
                            if((_isValid && include) || (!_isValid && !include)) {
                                index++;
                                if(processedAll) {
                                    index++;
                                }
                                retObj.index = index;
                                retObj.strValue = r;
                                return retObj;
                                //return new string(r, 1);
                                                            }
                        }
                        if(charEx.IsLowerKana(r)) {
                            var u = charEx.ToUpperKana(r);
                            _isValid = this._isValid(u);
                            if((_isValid && include) || (!_isValid && !include)) {
                                index++;
                                retObj.index = index;
                                retObj.strValue = u;
                                return retObj;
                            }
                        } else if(charEx.HasLowerKana(r)) {
                            var l = charEx.ToLowerKana(r);
                            _isValid = this._isValid(l);
                            if((_isValid && include) || (!_isValid && !include)) {
                                index++;
                                retObj.index = index;
                                retObj.strValue = l;
                                return retObj;
                            }
                        }
                    }
                    r = charEx.ToHiragana(r);
                    _isValid = this._isValid(r);
                    if((_isValid && include) || (!_isValid && !include)) {
                        index++;
                        if(processedAll) {
                            index++;
                        }
                        retObj.index = index;
                        retObj.strValue = r;
                        //add by sj for bug 2955
                        if(r == '\u3094') {
                            if(processedAll) {
                                retObj.strValue = '\u3046' + '\u309B';
                            } else {
                                index--;
                                retObj.index = index;
                                retObj.strValue = "";
                                retObj.success = false;
                            }
                        }
                        //end by sj
                        return retObj;
                    }
                    if(charEx.IsLowerKana(r)) {
                        var u = charEx.ToUpperKana(r);
                        _isValid = this._isValid(u);
                        if((_isValid && include) || (!_isValid && !include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = u;
                            return retObj;
                        }
                    } else if(charEx.HasLowerKana(r)) {
                        var l = charEx.ToLowerKana(r);
                        _isValid = this._isValid(l);
                        if((_isValid && include) || (!_isValid && !include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = l;
                            return retObj;
                        }
                    }
                    //return new string(r, 1);;
                                    }
                // Convert between DBCS and SBCS automatically.
                c = charEx.IsFullWidth(c) ? charEx.ToHalfWidth(c) : charEx.ToFullWidth(c).text;
                _isValid = this._isValid(c);
                if((_isValid && include) || (!_isValid && !include)) {
                    index++;
                    retObj.index = index;
                    retObj.strValue = c;
                    return retObj;
                    //return new string(c, 1);
                                    }
                retObj.success = false;
                return retObj;
            };
            wijMaskedTextProvider.prototype._isValid = function (text) {
                var input = new wijmo.input.wijInputResult();
                return this.testInternal(text, this._autoConvertPosition, input);
            };
            wijMaskedTextProvider.prototype._testString = function (strInput, pos, result) {
                result.hint = result.unknown;
                result.testPosition = pos;
                if(strInput.length) {
                    var tempResult = new input.wijInputResult();
                    tempResult.testPosition = result.testPosition;
                    tempResult.hint = result.hint;
                    for(var i = 0; i < strInput.length; i++) {
                        if(result.testPosition > this.testString.length) {
                            result.hint = result.unavailableEditPosition;
                            return false;
                        }
                        var ch = strInput.charAt(i);
                        if(!this.testEscapeChar(ch, result.testPosition)) {
                            result.testPosition = this.findEditPositionFrom(result.testPosition, true);
                            if(result.testPosition === -1) {
                                result.testPosition = this.testString.length;
                                result.hint = result.unavailableEditPosition;
                                return false;
                            }
                        }
                        this._needCheckNextChar = true;
                        if(!this.inputWidget.element.data('batchKeyPress')) {
                            this.inputWidget.element.data('nextChar', i === strInput.length - 1 ? "" : strInput.charAt(i + 1));
                        }
                        if(!this.testChar(ch, result.testPosition, tempResult)) {
                            result.hint = tempResult.hint;
                            this._needCheckNextChar = false;
                            if(!this.inputWidget.element.data('batchKeyPress')) {
                                this.inputWidget.element.data('nextChar', "");
                            }
                            return false;
                        }
                        this._needCheckNextChar = false;
                        if(!this.inputWidget.element.data('batchKeyPress')) {
                            this.inputWidget.element.data('nextChar', "");
                            var appendChar = this.inputWidget.element.data("appendChar");
                            if(appendChar && appendChar.length > 0) {
                                this.inputWidget.element.data("appendChar", "");
                                result.testPosition++;
                                if(!this.testChar(appendChar, result.testPosition, tempResult)) {
                                    result.hint = tempResult.hint;
                                    this._needCheckNextChar = false;
                                    return false;
                                }
                            }
                            if(this.inputWidget.element.data("skipNextChar")) {
                                i++;
                                this.inputWidget.element.data("skipNextChar", false);
                            }
                        }
                        result.hint = Math.max(tempResult.hint, result.hint);
                        result.testPosition++;
                        if(result.testPosition === this.testString.length) {
                            break;
                        }
                    }
                    result.testPosition--;
                }
                return true;
            };
            wijMaskedTextProvider.prototype.setText = function (strInput, inputResult) {
                if (typeof inputResult === "undefined") { inputResult = new input.wijInputResult(); }
                if(strInput === undefined) {
                    throw 'SetFromPos: input parameter is null or undefined.';
                }
                inputResult.hint = inputResult.unknown;
                inputResult.testPosition = 0;
                if(!strInput.length) {
                    this.clear(inputResult);
                    return true;
                }
                if(this.noMask) {
                    this.testString = strInput;
                    return true;
                }
                if(!this.testSetString(strInput, inputResult.testPosition, inputResult)) {
                    return false;
                }
                var rightEditPosition = this.findAssignedEditPositionFrom(inputResult.testPosition + 1, true);
                if(rightEditPosition !== -1) {
                    this.resetString(rightEditPosition, this.testString.length - 1);
                }
                return true;
            };
            wijMaskedTextProvider.prototype.resetString = function (start, end) {
                if(this.noMask) {
                    this.testString = '';
                    return;
                }
                start = this.findAssignedEditPositionFrom(start, true);
                if(start !== -1) {
                    end = this.findAssignedEditPositionFrom(end, false);
                    while(start <= end) {
                        start = this.findAssignedEditPositionFrom(start, true);
                        this.resetChar(start);
                        start++;
                    }
                }
            };
            wijMaskedTextProvider.prototype.setString = function (strInput, pos) {
                for(var i = 0; i < strInput.length; i++) {
                    var ch = strInput.charAt(i);
                    if(!this.testEscapeChar(ch, pos)) {
                        pos = this.findEditPositionFrom(pos, true);
                    }
                    if(pos < 0 || pos >= this.testString.length) {
                        return;
                    }
                    if(!this.inputWidget.element.data('batchKeyPress')) {
                        this.inputWidget.element.data('nextChar', i === strInput.length - 1 ? "" : strInput.charAt(i + 1));
                    }
                    this._needCheckNextChar = true;
                    this.setChar(ch, pos);
                    pos++;
                    this._needCheckNextChar = false;
                    if(!this.inputWidget.element.data('batchKeyPress')) {
                        this.inputWidget.element.data('nextChar', "");
                        var appendChar = this.inputWidget.element.data("appendChar");
                        if(appendChar && appendChar.length > 0) {
                            this.inputWidget.element.data("appendChar", "");
                            this.inputWidget.element.data('nextChar', "");
                            if(!this.testEscapeChar(appendChar, pos)) {
                                pos = this.findEditPositionFrom(pos, true);
                            }
                            this.setChar(appendChar, pos);
                            pos++;
                        }
                        if(this.inputWidget.element.data("skipNextChar")) {
                            i++;
                            this.inputWidget.element.data("skipNextChar", false);
                        }
                    }
                }
            };
            wijMaskedTextProvider.prototype.testSetString = function (input, pos, inputResult) {
                if(input.length > this.testString.length) {
                    input = input.substring(0, this.testString.length);
                }
                if(this._testString(input, pos, inputResult)) {
                    this.setString(input, pos);
                    return true;
                }
                return false;
            };
            wijMaskedTextProvider.prototype.isAllDecriptorUnAssigned = function () {
                for(var i = 0; i < this.testString.length; i++) {
                    var cd = this.descriptors[i];
                    if(cd && (cd.charType === wijchartype.editOptional || cd.charType === wijchartype.editRequired)) {
                        if(cd.isAssigned) {
                            return false;
                        }
                    }
                }
                return true;
            };
            wijMaskedTextProvider.prototype.toString = function (ignorePasswordChar, includePrompt, includeLiterals, start, len) {
                var c1 = this.inputWidget._showNullText();
                var c2 = !this.inputWidget.isFocused();
                var c3 = this.isAllDecriptorUnAssigned();
                if(c1 && c2 && c3) {
                    return this.inputWidget.options.nullText;
                }
                ignorePasswordChar = (ignorePasswordChar === undefined) ? !this.isPassword() : ignorePasswordChar;
                var temp1 = this.getHidePromptOnLeave() ? this.inputWidget.isFocused() : true;
                includePrompt = (includePrompt === undefined) ? temp1 : includePrompt;
                includeLiterals = (includeLiterals === undefined) ? true : includeLiterals;
                if(this.noMask) {
                    if(!ignorePasswordChar) {
                        var s = '';
                        for(var i = 0; i < this.testString.length; i++) {
                            s += this.getPasswordChar();
                        }
                        return s;
                    }
                    return this.testString;
                }
                start = (start === undefined) ? 0 : start;
                len = (len === undefined) ? this.testString.length : len;
                if(len <= 0) {
                    return '';
                }
                start = Math.max(0, start);
                if(start >= this.testString.length) {
                    return '';
                }
                var num1 = this.testString.length - start;
                len = Math.min(len, num1);
                c1 = !this.isPassword() || ignorePasswordChar;
                c2 = includePrompt && includeLiterals;
                if(c1 && c2) {
                    return this.testString.substring(start, len - start);
                }
                var builder1 = '';
                var num2 = (start + len) - 1;
                for(var num5 = start; num5 <= num2; num5++) {
                    var ch = this.testString.charAt(num5);
                    var cd = this.descriptors[num5];
                    switch(cd.charType) {
                        case wijchartype.editOptional:
                        case wijchartype.editRequired:
                            if(!cd.isAssigned) {
                                break;
                            }
                            if(!this.isPassword() || ignorePasswordChar) {
                                builder1 = builder1 + ch;
                                continue;
                            }
                            builder1 = builder1 + this.getPasswordChar();
                            continue;
                        case (wijchartype.editRequired | wijchartype.editOptional):
                            builder1 = builder1 + ch;
                            continue;
                        case wijchartype.separator:
                        case wijchartype.literal:
                            if(!includeLiterals) {
                                continue;
                            }
                            builder1 = builder1 + ch;
                            continue;
                        default:
                            builder1 = builder1 + ch;
                            continue;
                    }
                    if(includePrompt) {
                        builder1 = builder1 + ch;
                        continue;
                    }
                    builder1 = builder1 + ' ';
                    continue;
                }
                return builder1;
            };
            wijMaskedTextProvider.prototype.isEditDesc = function (desc) {
                if(this.noMask) {
                    return true;
                }
                return desc.charType === wijchartype.editRequired || desc.charType === wijchartype.editOptional;
            };
            wijMaskedTextProvider.prototype.isEditPos = function (pos) {
                if(this.noMask) {
                    return true;
                }
                if(pos < 0 || pos >= this.testString.length) {
                    return false;
                }
                var cd = this.descriptors[pos];
                return this.isEditDesc(cd);
            };
            wijMaskedTextProvider.prototype.internalRemoveAt = function (start, end, inputResult, testOnly) {
                if (typeof testOnly === "undefined") { testOnly = false; }
                if(this.noMask) {
                    try  {
                        this.testString = this.testString.substring(0, start) + this.testString.substring(end + 1, this.testString.length);
                        inputResult.testPosition = start;
                    } catch (e) {
                    }
                    return true;
                }
                var num1 = this.findAssignedEditPositionFrom(this.testString.length - 1, false);
                var i = this.findEditPositionInRange(start, end, true, 0);
                inputResult.hint = inputResult.noEffect;
                if((i === -1) || (i > num1)) {
                    inputResult.testPosition = start;
                    return true;
                }
                inputResult.testPosition = start;
                if(this.findAssignedEditPositionInRange(start, end, true) !== -1) {
                    inputResult.hint = inputResult.success;
                }
                if(end < num1) {
                    var num3 = this.findEditPositionFrom(end + 1, true);
                    var num4 = num3;
                    start = i;
                    var repeat = true;
                    var tempInputResult = new input.wijInputResult();
                    while(repeat) {
                        repeat = false;
                        var ch = this.testString.charAt(num3);
                        var cd = this.descriptors[num3];
                        var c1 = (ch !== this.getPromtChar()) || cd.isAssigned;
                        var c2 = !this.testChar(ch, i, tempInputResult);
                        if(c1 && c2) {
                            inputResult.hint = tempInputResult.hint;
                            inputResult.testPosition = i;
                            return false;
                        }
                        if(num3 !== num1) {
                            num3 = this.findEditPositionFrom(num3 + 1, true);
                            i = this.findEditPositionFrom(i + 1, true);
                            repeat = true;
                            continue;
                        }
                    }
                    if(inputResult.sideEffect > inputResult.hint) {
                        inputResult.hint = inputResult.sideEffect;
                    }
                    if(testOnly) {
                        return true;
                    }
                    num3 = num4;
                    i = start;
                    repeat = true;
                    while(repeat) {
                        repeat = false;
                        var ch2 = this.testString.charAt(num3);
                        var descriptor2 = this.descriptors[num3];
                        if((ch2 === this.getPromtChar()) && !descriptor2.isAssigned) {
                            this.resetChar(i);
                        } else {
                            this.setChar(ch2, i);
                            this.resetChar(num3);
                        }
                        if(num3 !== num1) {
                            num3 = this.findEditPositionFrom(num3 + 1, true);
                            i = this.findEditPositionFrom(i + 1, true);
                            repeat = true;
                            continue;
                        }
                    }
                    start = i + 1;
                }
                if(start <= end) {
                    this.resetString(start, end);
                }
                return true;
            };
            wijMaskedTextProvider.prototype.removeAt = function (start, end, inputResult) {
                if (typeof end === "undefined") { end = start; }
                if (typeof inputResult === "undefined") { inputResult = new input.wijInputResult(); }
                if(end >= this.testString.length) {
                    inputResult.testPosition = end;
                    inputResult.hint = inputResult.positionOutOfRange;
                    return false;
                }
                if((start >= 0) && (start <= end)) {
                    return this.internalRemoveAt(start, end, inputResult, false);
                }
                inputResult.testPosition = start;
                inputResult.hint = inputResult.positionOutOfRange;
                return false;
            };
            wijMaskedTextProvider.prototype._isLastCharAssigned = function () {
                var lastPosistion = this.findEditPositionFrom(this.testString.length, false);
                if(lastPosistion >= 0 && lastPosistion < this.testString.length) {
                    return this.descriptors[lastPosistion].isAssigned;
                }
                return false;
            };
            wijMaskedTextProvider.prototype._getFieldList = function () {
                var editPositionList = [];
                var position = this.findEditPositionFrom(0, true);
                while(position >= 0 && position < this.testString.length) {
                    editPositionList.push(position);
                    position = this.findEditPositionFrom(position + 1, true);
                }
                var rangeList = [];
                if(editPositionList.length > 0) {
                    var previousEditPos = editPositionList[0];
                    var currentIndex = 1;
                    var startPos = previousEditPos;
                    while(currentIndex < editPositionList.length) {
                        if(editPositionList[currentIndex] - previousEditPos == 1) {
                        } else {
                            rangeList.push({
                                start: startPos,
                                end: previousEditPos
                            });
                            startPos = editPositionList[currentIndex];
                        }
                        previousEditPos = editPositionList[currentIndex];
                        currentIndex++;
                    }
                    rangeList.push({
                        start: startPos,
                        end: previousEditPos
                    });
                }
                return rangeList;
            };
            return wijMaskedTextProvider;
        })(input.wijTextProvider);
        input.wijMaskedTextProvider = wijMaskedTextProvider;        
        ////////////////////////////////////////////////////////////////////////////////
        // wijCharDescriptor
        var wijCharDescriptor = (function () {
            function wijCharDescriptor(maskPos, charType) {
                this.maskPos = maskPos;
                this.charType = charType;
                this.caseConversion = 'none';
                this.isAssigned = false;
                this.maskPosition = 0;
                this.maskPosition = maskPos;
                this.charType = charType;
            }
            return wijCharDescriptor;
        })();
        input.wijCharDescriptor = wijCharDescriptor;        
        //#endregion
            })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
