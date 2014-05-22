/*
 *
 * Wijmo Library 3.20141.34
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
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
    /// <reference path="jquery.wijmo.wijstringinfo.ts"/>
    /// <reference path="jquery.wijmo.wijinputcore.ts"/>
    /// <reference path="jquery.wijmo.wijinputmaskcore.ts"/>
    /// <reference path="jquery.wijmo.wijinputmaskformat.ts"/>
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
    *	jquery.wijmo.wijcharex.js
    *	jquery.wijmo.wijstringinfo.js
    *	jquery.wijmo.wijinputcore.js
    *  jquery.wijmo.wijinputmaskcore.js
    *  jquery.wijmo.wijinputmaskformat.js
    *
    */
    (function (input) {
        "use strict";
        var $ = jQuery;
        //#region wijinputMask
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
                "hidePromptOnLeave", 
                "highlightText"
            ];
            wijinputmask.prototype._createTextProvider = function () {
                this._textProvider = new input.wijMaskedTextProvider(this, this.options.mask, false);
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
                        if(this._advanceMode && this.options.textWithPromptAndLiterals) {
                            value = this.options.textWithPromptAndLiterals;
                        }
                        this.setText(value);
                        break;
                    case 'mask':
                    case 'culture':
                        if(typeof (value) === 'undefined' || value.length <= 0) {
                            value = "";
                        }
                        this._checkMaskAndPassword();
                        var text = this.getText();
                        if(text === this._getNullText()) {
                            text = "";
                        }
                        if(key === "mask") {
                            this._textProvider.mask = value;
                        }
                        this._checkFormatPattern(value);
                        if(this._advanceMode) {
                            this._imMask.SetText(text);
                            this._updateText();
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
                this._imMask.SetHighlightText(this._convertHighlightText(this.options.highlightText));
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
            wijinputmask.prototype._convertHighlightText = function (str) {
                if(!str) {
                    return input.HighlightText.None;
                }
                str = str.toLowerCase();
                if(str === "field") {
                    return input.HighlightText.Field;
                } else if(str === "all") {
                    return input.HighlightText.All;
                } else {
                    return input.HighlightText.None;
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
                this._imMask.OnKeyExit(function (e) {
                    _this._trigger("keyExit");
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
                if(this.options.highlightText === "field") {
                    var fieldState = this._getCurrentField();
                    var currentField = fieldState.currentField;
                    var fieldList = fieldState.fieldList;
                    if(currentField >= fieldList.length) {
                        currentField = fieldList.length - 1;
                    }
                    var curField = fieldList[currentField];
                    if(curField) {
                        this.selectText(curField.start, curField.end + 1);
                    }
                } else if(this.options.highlightText === "all") {
                    this.selectText(0, this.element.get(0).value.length);
                }
            };
            wijinputmask.prototype._processTabKey = function (e) {
                var _this = this;
                var tabAction = this.options.tabAction;
                tabAction = tabAction ? tabAction.toLowerCase() : "control";
                if(tabAction === "control") {
                    setTimeout(function () {
                        _this._trigger("keyExit");
                    }, 0);
                    return false;
                } else {
                    return this._moveField(!e.shiftKey);
                }
            };
            wijinputmask.prototype._getCurrentField = function () {
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
                var ret = {
                };
                ret.currentField = currentField;
                ret.fieldList = fieldList;
                return ret;
            };
            wijinputmask.prototype._moveField = function (direction) {
                var fieldState = this._getCurrentField();
                var currentField = fieldState.currentField;
                var fieldList = fieldState.fieldList;
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
                    if(text == this.options.textWithPromptAndLiterals) {
                        this.options.textWithPromptAndLiterals = undefined;
                        this._imMask.SetText(text);
                    } else {
                        this._imMask.SetValue(text);
                    }
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
            * // Select first two symbols in a wijinputmask
            * $(".selector").wijinputmask("selectText", 0, 2);
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
            wijinputmask.prototype.getSelectedText = /**  Gets the selected text.
            */
            function () {
                if(this._advanceMode) {
                    return this._imMask.GetSelectedText();
                } else {
                    return _super.prototype.getSelectedText.call(this);
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
                if(val && val !== this._getNullText()) {
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
                    this.options.advancedText = this._imMask.GetText();
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
            wijinputmask.prototype._getAllowPromptAsInput = function () {
                return this.options.allowPromptAsInput;
            };
            wijinputmask.prototype._getPasswordChar = function () {
                return this.options.passwordChar;
            };
            wijinputmask.prototype._getResetOnPrompt = function () {
                return this.options.resetOnPrompt;
            };
            wijinputmask.prototype._getResetOnSpace = function () {
                return this.options.resetOnSpace;
            };
            wijinputmask.prototype._getSkipLiterals = function () {
                return this.options.skipLiterals;
            };
            wijinputmask.prototype._getHidePromptOnLeave = function () {
                return this.options.hidePromptOnLeave;
            };
            wijinputmask.prototype._getPromptChar = function () {
                return this.options.promptChar;
            };
            wijinputmask.prototype._getAutoConvert = function () {
                return this.options.autoConvert;
            };
            wijinputmask.prototype._getNullText = function () {
                return this.options.nullText;
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
                * @example
                * // In this example, when input the lower case alphabet, it will be convert to upper case alphabet.
                * $(".selector").wijinputmask({
                *   maskFormat: /\A{3}-\A{4}/,
                *   autoConvert:true
                * });
                */
                this.autoConvert = true;
                /** Determines the default text.
                */
                this.text = null;
                /** Determines whether to highlight the control's text on receiving input focus.
                * Possible values are : "none", "field", "all";
                * The default value is "none";
                */
                this.highlightText = "none";
                /** Determines the input mask to use at run time.
                * Mask must be a string composed of one or more of the masking elements.
                * Obsoleted, use maskFormat instead.
                * @ignore
                */
                this.mask = "";
                /** Determines the input mask to use at run time.
                * @remarks
                * <pre>
                * The property can be a string composed of one or more of the masking elements as shown in the following table,
                * 0  --------- Digit, required. This element will accept any single digit between 0 and 9.<br />
                * 9  --------- Digit or space, optional.
                * #  --------- Digit or space, optional. Plus (+) and minus (-) signs are allowed.
                * L  --------- Letter, required. Restricts input to the ASCII letters a-z and A-Z.
                *              This mask element is equivalent to [a-zA-Z] in regular expressions.
                * ?  --------- Letter, optional. Restricts input to the ASCII letters a-z and A-Z.
                *              This mask element is equivalent to [a-zA-Z]? in regular expressions.
                * &amp;  --------- Character, required.<br />
                * C  --------- Character, optional. Any non-control character.<br />
                * A  --------- Alphanumeric, optional.
                * a  --------- Alphanumeric, optional.
                * .  --------- Decimal placeholder. The actual display character used will be the decimal placeholder appropriate to the culture option.<br />
                * ,  --------- Thousands placeholder. The actual display character used will be the thousands placeholder appropriate to the culture option.
                * :  --------- Time separator. The actual display character used will be the time placeholder appropriate to the culture option.
                * /  --------- Date separator. The actual display character used will be the date placeholder appropriate to the culture option.
                * $  --------- Currency symbol. The actual character displayed will be the currency symbol appropriate to the culture option.
                * &lt;  --------- Shift down. Converts all characters that follow to lowercase.
                * &gt;  --------- Shift up. Converts all characters that follow to uppercase.
                * |  --------- Disable a previous shift up or shift down.
                * H  --------- All SBCS characters.
                * K  --------- SBCS Katakana.
                * ９ --------- DBCS Digit.
                * Ｋ --------- DBCS Katakana.
                * Ｊ --------- Hiragana.
                * Ｚ --------- All DBCS characters.
                * N  --------- All SBCS big Katakana.
                * Ｎ --------- Matches DBCS big Katakana.
                * Ｇ --------- Matches DBCS big Hiragana.
                * \\ --------- Escape. Escapes a mask character, turning it into a literal. The escape sequence for a backslash is: \\\\
                * All other characters, Literals. All non-mask elements appear as themselves within wijinputmask.
                * Literals always occupy a static position in the mask at run time, and cannot be moved or deleted by the user.
                *
                *
                * The following table shows example masks.
                *     00/00/0000            A date (day, numeric month, year) in international date format. The "/" character is a logical date separator, and will appear to the user as the date separator appropriate to the application's current culture.
                *     00-&gt;L&lt;LL-0000         A date (day, month abbreviation, and year) in United States format in which the three-letter month abbreviation is displayed with an initial uppercase letter followed by two lowercase letters.
                *     (999)-000-0000        United States phone number, area code optional. If users do not want to enter the optional characters, they can either enter spaces or place the mouse pointer directly at the position in the mask represented by the first 0.
                *     $999,999.00           A currency value in the range of 0 to 999999. The currency, thousandth, and decimal characters will be replaced at run time with their culture-specific equivalents.
                *  For example:
                *  $(".selector").wijinputmask({
                *      maskFormat: "(999)-000-0000 "
                *  });
                *
                *  Value of maskFormat can also be a regex value, attentation, only the following key word supported by the regex value.<br />
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
                *  \N   ----------- Matches all SBCS big Katakana.
                *  \Ｎ  ----------- Matches DBCS big Katakana.
                *  \Ｇ  ----------- Matches DBCS big Hiragana.
                *  \Ｔ  ----------- Matchese surrogate char.
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
                * </pre>
                *  @example
                *  <pre>
                *  $(".selector").wijinputmask({
                *      maskFormat: /\D{3}-\D{4}/
                *  }); <br />
                *  $(".selector").wijinputmask({
                *          maskFormat: new RegExp("\\D{3}-\\D{4}")
                *  });
                *  </pre>
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
                * This property only take effect on IE and firefox browser.
                */
                this.imeMode = "auto";
                /** @ignore */
                this.allowSpinLoop = false;
                /** @ignore */
                this.spinnerAlign = "verticalRight";
                /** @ignore */
                this.showSpinner = false;
            }
            return wijinputmask_options;
        })();        
        wijinputmask.prototype.options = $.extend(true, {
        }, input.wijinputcore.prototype.options, new wijinputmask_options());
        $.wijmo.registerWidget("wijinputmask", wijinputmask.prototype);
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
