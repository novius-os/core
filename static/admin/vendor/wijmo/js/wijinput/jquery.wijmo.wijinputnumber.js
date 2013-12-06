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
    /*globals wijinputcore wijNumberTextProvider wijInputResult
    wijNumberFormat window jQuery*/
    /*
    * Depends:
    *	jquery-1.4.2.js
    *	jquery.ui.core.js
    *	jquery.ui.widget.js
    *	jquery.ui.position.js
    *	jquery.effects.core.js
    *	jquery.effects.blind.js
    *	globalize.js
    *	jquery.mousewheel.js
    *	jquery.wijmo.wijpopup.js
    *	jquery.wijmo.wijinputcore.js
    *
    */
    (function (input) {
        "use strict";
        var $ = jQuery, jqKeyCode = wijmo.getKeyCodeEnum();
        /** @widget */
        var wijinputnumber = (function (_super) {
            __extends(wijinputnumber, _super);
            function wijinputnumber() {
                _super.apply(this, arguments);

                this._initialValue = 0;
            }
            wijinputnumber.prototype._init = function () {
                _super.prototype._init.call(this);
                this._initUserCultureOptions();
                this._updateCultureRelatedOptions();
                this._updateText();
            };
            wijinputnumber.prototype._initUserCultureOptions = function () {
                if(this.options.negativePrefix !== null) {
                    this._userNegativePrefix = this.options.negativePrefix;
                }
                if(this.options.negativeSuffix !== null) {
                    this._userNegativeSuffix = this.options.negativeSuffix;
                }
                if(this.options.positivePrefix !== null) {
                    this._userPositivePrefix = this.options.positivePrefix;
                }
                if(this.options.positiveSuffix !== null) {
                    this._userPositiveSuffix = this.options.positiveSuffix;
                }
                if(this.options.currencySymbol !== null) {
                    this._userCurrencySymbol = this.options.currencySymbol;
                }
            };
            wijinputnumber.prototype._updateCultureRelatedOptions = // should be called when 'culture', 'type' and 'currencySymbol' changes.
            function () {
                var numberFormat = this._getCulture().numberFormat, specificFormat = numberFormat[this.options.type] || numberFormat, negPattern = specificFormat.pattern[0], posPattern = specificFormat.pattern[1] || 'n';
                var negSplitArray = negPattern.split('n'), posSplitArray = posPattern.split('n'), percentSymbol = this._getPercentSymbol(), currencySymbol = // if user has not set xxxxtiveXxxfix, it will replace all '$' to the currency symbol from culture (not from the symbol user set).
                this._getCulture().numberFormat.currency.symbol;
                //this._getCurrencySymbol();
                                if(this._userNegativePrefix === undefined) {
                    this.options.negativePrefix = negSplitArray[0].replace(/%/g, percentSymbol).replace(/\$/g, currencySymbol);
                }
                if(this._userNegativeSuffix === undefined) {
                    this.options.negativeSuffix = negSplitArray[1].replace(/%/g, percentSymbol).replace(/\$/g, currencySymbol);
                }
                if(this._userPositivePrefix === undefined) {
                    this.options.positivePrefix = posSplitArray[0].replace(/%/g, percentSymbol).replace(/\$/g, currencySymbol);
                }
                if(this._userPositiveSuffix === undefined) {
                    this.options.positiveSuffix = posSplitArray[1].replace(/%/g, percentSymbol).replace(/\$/g, currencySymbol);
                }
                if(this._userCurrencySymbol === undefined) {
                    this.options.currencySymbol = numberFormat.currency.symbol;
                }
            };
            wijinputnumber.prototype._createTextProvider = function () {
                if(this._textProvider) {
                    return this._textProvider;
                }
                this._textProvider = new wijNumberTextProvider(this, this.options.type);
                this._textProvider.setNullValue(this.element.val() === "" && this.options.value === null);
            };
            wijinputnumber.prototype._beginUpdate = function () {
                this._initialValue = 0;
                var o = this.options;
                this.element.addClass(o.wijCSS.wijinputnumber);
                this.element.data({
                    defaultValue: o.value,
                    preValue: o.value
                }).attr({
                    'aria-valuemin': o.minValue,
                    'aria-valuemax': o.maxValue,
                    'aria-valuenow': o.value || this._initialValue
                });
            };
            wijinputnumber.prototype.focus = /** Set the focus to the widget. */
            function () {
                _super.prototype.focus.call(this);
                // if focused by calling this method, recover the caret position.
                var prevPos = this.element.data('prevCursorPos');
                this.element.wijtextselection(prevPos, prevPos);
            };
            wijinputnumber.prototype._setOption = function (key, value) {
                _super.prototype._setOption.call(this, key, value);
                switch(key) {
                    case 'minValue':
                        this.element.attr('aria-valuemin', value);
                        this._updateText();
                        break;
                    case 'maxValue':
                        this.element.attr('aria-valuemax', value);
                        this._updateText();
                        break;
                    case 'value':
                        this.setValue(value);
                        this._updateText();
                        break;
                    case 'showGroup':
                    case 'decimalPlaces':
                    case 'culture':
                        //this._textProvider.updateStringFormat();
                        this._updateCultureRelatedOptions();
                        this._updateText();
                        break;
                    case 'positivePrefix':
                        this._userPositivePrefix = value;
                        this._updateText();
                        break;
                    case 'negativePrefix':
                        this._userNegativePrefix = value;
                        this._updateText();
                        break;
                    case 'positiveSuffix':
                        this._userPositiveSuffix = value;
                        this._updateText();
                        break;
                    case 'negativeSuffix':
                        this._userNegativeSuffix = value;
                        this._updateText();
                        break;
                    case 'currencySymbol':
                        this._userCurrencySymbol = value;
                        this._updateCultureRelatedOptions();
                        this._updateText();
                        break;
                    case 'type':
                        this._updateCultureRelatedOptions();
                        this._updateText();
                        break;
                }
            };
            wijinputnumber.prototype._setData = function (val) {
                this.setValue(val);
            };
            wijinputnumber.prototype._resetData = function () {
                var val = this.element.data('defaultValue');
                if(val === 0) {
                    var elementValue = this.element.data('elementValue');
                    if(elementValue !== undefined && elementValue !== null && elementValue !== "") {
                        val = elementValue;
                    }
                }
                if(val !== this._textProvider.getValue() || (this._textProvider._nullvalue && val === 0)) {
                    this.setValue(val);
                }
            };
            wijinputnumber.prototype._validateData = function () {
                if(!this._textProvider.checkAndRepairBounds(true, false) && this.options.value !== null) {
                    this._updateText();
                }
            };
            wijinputnumber.prototype._raiseDataChanged = function () {
                var v = this.options.value, prevValue = this.element.data('preValue');
                this.element.data('preValue', v);
                if(prevValue !== v) {
                    this.element.attr('aria-valuenow', v);
                    this._trigger('valueChanged', null, {
                        value: v
                    });
                }
            };
            wijinputnumber.prototype._onChange = function () {
            };
            wijinputnumber.prototype._getPrefix = function () {
                if(this._textProvider._stringFormat.isNegative()) {
                    if(this._userNegativePrefix !== undefined) {
                        return this._userNegativePrefix;
                    } else {
                        return this.options.negativePrefix;
                    }
                } else {
                    if(this._userPositivePrefix !== undefined) {
                        return this._userPositivePrefix;
                    } else {
                        return this.options.positivePrefix;
                    }
                }
            };
            wijinputnumber.prototype._getInvertPrefix = function () {
                if(this._textProvider._stringFormat.isNegative()) {
                    if(this._userPositivePrefix !== undefined) {
                        return this._userPositivePrefix;
                    } else {
                        return this.options.positivePrefix;
                    }
                } else {
                    if(this._userNegativePrefix !== undefined) {
                        return this._userNegativePrefix;
                    } else {
                        return this.options.negativePrefix;
                    }
                }
            };
            wijinputnumber.prototype._getSuffix = function () {
                if(this._textProvider._stringFormat.isNegative()) {
                    if(this._userNegativeSuffix !== undefined) {
                        return this._userNegativeSuffix;
                    } else {
                        return this.options.negativeSuffix;
                    }
                } else {
                    if(this._userPositiveSuffix !== undefined) {
                        return this._userPositiveSuffix;
                    } else {
                        return this.options.positiveSuffix;
                    }
                }
            };
            wijinputnumber.prototype._getCurrencySymbol = function () {
                if(this._userCurrencySymbol !== undefined) {
                    return this._userCurrencySymbol;
                } else {
                    return this._getCulture().numberFormat.currency.symbol;
                }
            };
            wijinputnumber.prototype._getPercentSymbol = function () {
                return this._getCulture().numberFormat.percent.symbol;
            };
            wijinputnumber.prototype.getValue = /** Gets the value. */
            function () {
                if(this._textProvider._nullvalue) {
                    return null;
                }
                var val = this._textProvider.getValue();
                if(val === undefined || val === null) {
                    val = this.getText();
                }
                return val;
            };
            wijinputnumber.prototype.setValue = /** Sets the value.
            * @example
            * // set value of a wijinputnumber to 10
            * $(".selector").wijinputnumber("setValue", 10, true);
            */
            function (val, exact) {
                if (typeof exact === "undefined") { exact = false; }
                try  {
                    exact = !!exact;
                    if(val === null || typeof val === 'undefined' || isNaN(val)) {
                        val = null;
                    } else if(typeof val === 'boolean') {
                        val = val ? 1 : 0;
                    } else if(typeof val === 'string') {
                        val = this._textProvider.tryParseValue(val);
                    }
                    if(this._textProvider.setValue(val)) {
                        this._updateText();
                    } else {
                        if(exact) {
                            var prevVal = this.getText();
                            this.setText(val);
                            var txt = this.getText().trim();
                            val = val.trim();
                            if(txt !== val) {
                                this.setText(prevVal);
                            }
                        } else {
                            this.setText(val);
                        }
                    }
                    return true;
                } catch (e) {
                    return false;
                }
            };
            wijinputnumber.prototype._isLastValueNull = function () {
                return _super.prototype._isLastValueNull.call(this) && !this._textProvider._nullvalue;
            };
            wijinputnumber.prototype.isValueNull = /** Determines whether the value is in null state. */
            function () {
                try  {
                    return (this._textProvider).isValueNull();
                } catch (e) {
                    return true;
                }
            };
            wijinputnumber.prototype.getPostValue = /** Gets the text value when the container form is posted back to server. */
            function () {
                if(!this._isInitialized()) {
                    return this.element.val();
                }
                if(_super.prototype._showNullText.call(this) && this.isValueNull()) {
                    return "0";
                }
                var val = this.options.value ? this.options.value : 0;
                if(this.options.type === "percent") {
                    val = (val / 100).toFixed(10);
                }
                return val.toString();
            };
            wijinputnumber.prototype._updateText = function (keepSelection) {
                if (typeof keepSelection === "undefined") { keepSelection = false; }
                if(!this._isInitialized()) {
                    return;
                }
                if(this._textProvider._stringFormat.isNegative()) {
                    this.element.addClass(this.options.negativeClass);
                } else {
                    this.element.removeClass(this.options.negativeClass);
                }
                if(!this._textProvider._nullvalue) {
                    this.options.value = this._textProvider.getValue();
                } else {
                    this.options.value = null;
                }
                _super.prototype._updateText.call(this, keepSelection);
                if(!this._textProvider.checkAndRepairBounds(true, false)) {
                    this._trigger('valueBoundsExceeded');
                    if(!this.isFocused()) {
                        this._textProvider.setNullValue(false);
                        _super.prototype._updateText.call(this, keepSelection);
                    }
                }
            };
            wijinputnumber.prototype._doSpin = function (up, repeating, noFocus) {
                if(!this._allowEdit()) {
                    return false;
                }
                if(repeating && this.element.data('breakSpinner')) {
                    return false;
                }
                var selRange = this.element.wijtextselection(), rh = new input.wijInputResult();
                if(this.element.data('focusNotCalledFirstTime') !== -9 && (new Date().getTime() - this.element.data('focusNotCalledFirstTime')) < 600) {
                    this.element.data('focusNotCalledFirstTime', -9);
                    this.element.data('prevCursorPos', 0);
                }
                if(this.element.data('prevCursorPos') === -1) {
                    this.element.data('prevCursorPos', selRange.start);
                } else {
                    selRange.start = (this.element.data('prevCursorPos'));
                }
                rh.testPosition = selRange.start;
                this._textProvider.spinEnumPart(selRange.start, rh, this.options.increment, up);
                up ? this._trigger('spinUp', null) : this._trigger('spinDown', null);
                this._updateText();
                this.element.data('prevCursorPos', rh.testPosition);
                if(!noFocus) {
                    this.selectText(rh.testPosition, rh.testPosition);
                }
                if(repeating && !this.element.data('breakSpinner')) {
                    var spintimer = window.setTimeout($.proxy(function () {
                        this._doSpin(up, true);
                    }, this), this._calcSpinInterval());
                    this.element.data("spintimer", spintimer);
                }
                return true;
            };
            wijinputnumber.prototype._deleteSelText = function (backspace) {
                if (typeof backspace === "undefined") { backspace = false; }
                var sel = this.element.wijtextselection(), everythingSelected = sel.start === 0 && sel.end === this.element.val().length, text;
                if(sel.start === sel.end) {
                    // move right if "delete" key is pressed and there cursor is to left from a group/decimal separator symbol
                    if(!backspace) {
                        text = this._textProvider._stringFormat._currentText;
                        if(text.charAt(sel.end) === this._textProvider.getGroupSeparator() || text.charAt(sel.end) === this._textProvider.getDecimalSeparator()) {
                            sel.start++;
                            sel.end++;
                            this.element.wijtextselection(sel);
                            return;
                        }
                    }
                }
                var previousValue = this._textProvider.getEditingValue();
                _super.prototype._deleteSelText.call(this, backspace);
                // this will set value to repaired max/min value.
                //this._textProvider.checkAndRepairBounds(true, false);
                //this.options.value = this._textProvider.getValue();
                //if ((everythingSelected || parseFloat(this.element.val()) === 0) &&  this.options.value === 0){
                if(previousValue === 0 && (everythingSelected || this._textProvider.getEditingValue() === 0)) {
                    // everything is selected
                    this._textProvider.setNullValue(true);
                    this._updateText(true);
                    this.options.value = null;
                }
            };
            wijinputnumber.prototype._processClearButton = function () {
                this._setOption("value", null);
            };
            wijinputnumber.prototype._processLeftRightKey = function (isLeftKey) {
                if(isLeftKey) {
                    if(this.element.wijtextselection().start === 0 && (this.options.blurOnLeftRightKey.toLowerCase() === "left" || this.options.blurOnLeftRightKey.toLowerCase() === "both")) {
                        input.Utility.MoveFocus(this.element.get(0), false);
                        return true;
                    }
                } else {
                    if(this.element.wijtextselection().start === this.element.val().length && (this.options.blurOnLeftRightKey.toLowerCase() === "right" || this.options.blurOnLeftRightKey.toLowerCase() === "both")) {
                        input.Utility.MoveFocus(this.element.get(0), true);
                        return true;
                    }
                }
                return false;
            };
            wijinputnumber.prototype._processTabKey = function (e) {
                var key = e.keyCode || e.which;
                switch(key) {
                    case jqKeyCode.TAB:
                        if(this.options.tabAction !== "field") {
                            break;
                        }
                        var dpPosition = this.element.val().indexOf('.');
                        if(dpPosition === -1) {
                            dpPosition = this.element.val().length;
                        }
                        var selRange = this.element.wijtextselection();
                        if(e.shiftKey) {
                            if(selRange.start > dpPosition) {
                                this._toPrevField();
                            }
                        } else {
                            if(selRange.start < dpPosition) {
                                this._toNextField();
                            }
                        }
                        return true;
                }
                return false;
            };
            wijinputnumber.prototype._toPrevField = function () {
                var prefix = this._getPrefix();
                //if (this.options.type === 'currency') {
                //    prefix = '$' + prefix;
                //}
                this.element.wijtextselection(prefix.length, prefix.length);
            };
            wijinputnumber.prototype._toNextField = function () {
                var dpPosition = this.element.val().indexOf('.');
                if(dpPosition === -1) {
                    this._toPrevField();
                } else {
                    this.element.wijtextselection(dpPosition + 1, dpPosition + 1);
                }
            };
            wijinputnumber.prototype.spinUp = /** Performs spin up by the specified field and increment value. */
            function () {
                this._doSpin(true, false, true);
            };
            wijinputnumber.prototype.spinDown = /** Performs spin down by the specified field and increment value. */
            function () {
                this._doSpin(false, false, true);
            };
            return wijinputnumber;
        })(input.wijinputcore);
        input.wijinputnumber = wijinputnumber;        
        var wijinputnumber_options = (function () {
            function wijinputnumber_options() {
                this.wijCSS = {
                    wijinputnumber: input.wijinputcore.prototype.options.wijCSS.wijinput + "-numeric",
                    wijinputnumberNegative: "ui-state-negative"
                };
                /** Determines the type of the number input.
                * Possible values are: 'numeric', 'percent', 'currency'.
                */
                this.type = 'numeric';
                /** Determines the default numeric value.
                */
                this.value = 0;
                /** Determines the minimal value that can be entered for
                * numeric/percent/currency inputs.
                */
                this.minValue = -1000000000;
                /** Determines the maximum value that can be entered for
                * numeric/percent/currency inputs.
                */
                this.maxValue = 1000000000;
                /** Indicates whether the thousands group separator will be
                * inserted between between each digital group
                * (number of digits in thousands group depends on the selected Culture).
                */
                this.showGroup = false;
                /** Indicates the number of decimal places to display.
                * @remarks
                * Possible values are integer from -2 to 8. They are:
                * useDefault: -2,
                * asIs: -1,
                * zero: 0,
                * one: 1,
                * two: 2,
                * three: 3,
                * four: 4,
                * five: 5,
                * six: 6,
                * seven: 7,
                * eight: 8
                */
                this.decimalPlaces = 2;
                /** Determines how much to increase/decrease the input field.
                */
                this.increment = 1;
                /** Determine the current symbol when number type is currency.
                */
                this.currencySymbol = null;
                /** Determine the prefix string used for negative value.
                */
                this.negativePrefix = null;
                /** Determine the suffix string used for negative value.
                */
                this.negativeSuffix = null;
                /** Determine the prefix string used for positive value.
                */
                this.positivePrefix = null;
                /** Determine the suffix stirng used for positive value.
                */
                this.positiveSuffix = null;
                /** The valueChanged event handler.
                * A function called when the value of the input is changed.
                * @event
                * @dataKey value The new value */
                this.valueChanged = null;
                /** The spinUp event handler.
                * A function called when spin up event fired.
                */
                this.spinUp = null;
                /** The spinDown event handler.
                * A function called when spin down event fired.
                */
                this.spinDown = null;
                /** The valueBoundsExceeded event handler. A function called when
                * the value of the input exceeds the valid range.
                * @event
                */
                this.valueBoundsExceeded = null;
                this.negativeClass = this.wijCSS.wijinputnumberNegative;
            }
            return wijinputnumber_options;
        })();        
        wijinputnumber.prototype.options = $.extend(true, {
        }, input.wijinputcore.prototype.options, new wijinputnumber_options());
        $.wijmo.registerWidget("wijinputnumber", wijinputnumber.prototype);
        //==============================
        var wijNumberTextProvider = (function (_super) {
            __extends(wijNumberTextProvider, _super);
            function wijNumberTextProvider(owner, type) {
                        _super.call(this);
                this._type = 'numeric';
                this._stringFormat = null;
                this._nullvalue = false;
                this.inputWidget = owner;
                this._type = type;
                this._stringFormat = new wijNumberFormat(this.inputWidget);
                this._stringFormat.setValueFromJSFloat(this.getValue());
            }
            wijNumberTextProvider.prototype.getEditingValue = function () {
                return this._stringFormat.tryParseValue(this._stringFormat._strippedText);
            };
            wijNumberTextProvider.prototype._getCulture = function () {
                return this.inputWidget._getCulture();
            };
            wijNumberTextProvider.prototype.getDecimalSeparator = function () {
                return this._getCulture().numberFormat['.'];
            };
            wijNumberTextProvider.prototype.getGroupSeparator = function () {
                return this._getCulture().numberFormat[","];
            };
            wijNumberTextProvider.prototype.tryParseValue = function (value) {
                return this._stringFormat.tryParseValue(value);
            };
            wijNumberTextProvider.prototype.toString = function () {
                if(this.inputWidget._showNullText() && !this.inputWidget.isFocused() && this.isValueNull()) {
                    return this.inputWidget.options.nullText;
                }
                //if (!this.inputWidget._showNullText() && this.inputWidget.isValueNull()) {
                //    if (this.inputWidget._initialValue === null || isNaN(this.inputWidget._initialValue)) {
                //        return '';
                //    }
                //}
                if(this.isValueNull()) {
                    return "";
                }
                return this._stringFormat.getFormattedValue();
            };
            wijNumberTextProvider.prototype.isValueNull = function () {
                var o = this.inputWidget.options;
                //    nullValue = o.minValue;
                //nullValue = Math.max(0, o.minValue);
                //return null === o.value || undefined === o.value || nullValue === o.value || this._nullvalue;
                //for fix the issue 40695
                return null === o.value || undefined === o.value || this._nullvalue;
            };
            wijNumberTextProvider.prototype.setText = function (input, rh) {
                this.clear();
                this.insertAt(input, 0, rh);
                return true;
            };
            wijNumberTextProvider.prototype.clear = function () {
                this._stringFormat.clear();
            };
            wijNumberTextProvider.prototype.checkAndRepairBounds = function (chkAndRepair, onlyChkIsLessOrEqMin, allowWrap) {
                if (typeof allowWrap === "undefined") { allowWrap = false; }
                if(this._nullvalue) {
                    return true;
                }
                var result = true, minValue, maxValue;
                if(typeof (chkAndRepair) === 'undefined') {
                    chkAndRepair = false;
                }
                minValue = this.inputWidget.options.minValue;
                maxValue = this.inputWidget.options.maxValue;
                if(typeof (onlyChkIsLessOrEqMin) !== 'undefined' && onlyChkIsLessOrEqMin) {
                    return this._stringFormat.checkMinValue(minValue, false, true);
                }
                var needCheckMax = true;
                if(!this._stringFormat.checkMinValue(minValue, chkAndRepair, false)) {
                    result = false;
                    if(allowWrap) {
                        needCheckMax = false;
                        this._stringFormat._currentValueInString = maxValue.toString();
                    }
                }
                if(needCheckMax && !this._stringFormat.checkMaxValue(maxValue, chkAndRepair)) {
                    result = false;
                    if(allowWrap) {
                        this._stringFormat._currentValueInString = minValue.toString();
                    }
                }
                if(this.inputWidget.options.decimalPlaces >= 0) {
                    this._stringFormat.checkDigitsLimits(this.inputWidget.options.decimalPlaces);
                }
                return result;
            };
            wijNumberTextProvider.prototype._countSubstring = function (txt, subStr) {
                var c = 0, pos = txt.indexOf(subStr);
                while(pos !== -1) {
                    c++;
                    pos = txt.indexOf(subStr, pos + 1);
                }
                return c;
            };
            wijNumberTextProvider.prototype._getAdjustedPositionFromLeft = function (position) {
                var currentStrippedText = this._stringFormat._strippedText, i, ch;
                for(i = 0; i < currentStrippedText.length; i++) {
                    ch = currentStrippedText.charAt(i);
                    if(!$.wij.charValidator.isDigit(ch) && (ch !== this.getGroupSeparator() && ch !== this.getDecimalSeparator()) || ch === '0') {
                        if(this._stringFormat.isZero()) {
                            if(position < i) {
                                position++;
                            }
                        } else {
                            if(position <= i) {
                                position++;
                            }
                        }
                    } else {
                        break;
                    }
                }
                return position;
            };
            wijNumberTextProvider.prototype._getDecimalSeparatorPos = function () {
                var currentStrippedText = this._stringFormat._strippedText;
                return currentStrippedText.indexOf(this.getDecimalSeparator());
            };
            wijNumberTextProvider.prototype._removeLeadingZero = function (num) {
                var pos = 0;
                if(num.charAt(pos) === ' ' || num.charAt(pos) === this.inputWidget.options.currencySymbol) {
                    pos++;
                }
                while(num.charAt(pos) === '0' && num.charAt(pos + 1) !== '.') {
                    num = num.substr(0, pos) + num.substr(pos + 1);
                }
                return num;
            };
            wijNumberTextProvider.prototype.insertAt = function (strInput, position, rh) {
                var nf = this._getCulture().numberFormat, pos, slicePos, beginText, endText, newText, oldGroupSeparatorCount, newGroupSeparatorCount, leftPrevCh, leftCh;
                var currentTextWithoutMinus = this._stringFormat._strippedText;
                var prefix = this.inputWidget._getPrefix(), invertPrefix = this.inputWidget._getInvertPrefix();
                if(position < prefix.length) {
                    position = prefix.length;
                } else if(position > prefix.length + currentTextWithoutMinus.length) {
                    position = prefix.length + currentTextWithoutMinus.length;
                }
                position -= prefix.length;
                if(!rh) {
                    rh = new input.wijInputResult();
                }//else {
                
                this.setNullValue(false);
                //}
                if(strInput.length === 1) {
                    if(strInput === '+') {
                        var signBefore = this._stringFormat.isNegative();
                        this._stringFormat.setPositiveSign();
                        this.checkAndRepairBounds(true, false);
                        var isInvert = signBefore !== this._stringFormat.isNegative();
                        if(isInvert) {
                            rh.testPosition = invertPrefix.length + position - 1;
                        } else {
                            rh.testPosition = prefix.length + position - 1;
                        }
                        return true;
                    }
                    if(strInput === '-' || strInput === ')' || strInput === '(') {
                        var isNegativeBefore = this._stringFormat.isNegative();
                        this._stringFormat.invertSign();
                        this.checkAndRepairBounds(true, false);
                        if(this._stringFormat.isNegative() === isNegativeBefore) {
                            rh.testPosition = prefix.length + position - 1;
                            return true;
                        } else {
                            rh.testPosition = invertPrefix.length + position - 1;
                            //if (this._stringFormat.isNegative()) {
                            //    rh.testPosition = position;
                            //}
                            //else {
                            //    rh.testPosition = position - 2;
                            //}
                            return true;
                        }
                    }
                    if(!$.wij.charValidator.isDigit(strInput)) {
                        if(strInput === this.getDecimalSeparator()) {
                            pos = this._getDecimalSeparatorPos() + prefix.length;
                            //if (this._stringFormat.isNegative()) {
                            //    pos = pos - 1;  // _stringFormat._currentText starts with '-'.
                            //}
                            if(pos >= 0) {
                                rh.testPosition = pos;
                                return true;
                            }
                        }
                        if(strInput !== this.getGroupSeparator() && strInput !== this.getDecimalSeparator() && strInput !== ')' && strInput !== '+' && strInput !== '-' && strInput !== '(' && strInput !== this.getDecimalSeparator()) {
                            if(this._type === 'percent' && strInput === nf.percent.symbol) {
                                rh.testPosition = position;
                                return true;
                            } else if(this._type === 'currency' && strInput === this.inputWidget.options.currencySymbol) {
                                rh.testPosition = position;
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                }
                position = this._getAdjustedPositionFromLeft(position);
                slicePos = position;
                if(slicePos > currentTextWithoutMinus.length) {
                    slicePos = currentTextWithoutMinus.length - 1;
                }
                // if (input.length === 1) {
                // if (currentText.charAt(slicePos) === input) {
                // rh.testPosition = slicePos;
                // return true;
                // }
                // }
                beginText = this._removeLeadingZero(currentTextWithoutMinus.substring(0, slicePos));
                endText = currentTextWithoutMinus.substring(slicePos, currentTextWithoutMinus.length);
                if(this._stringFormat.isZero()) {
                    endText = endText.replace(/0/, '');
                }
                var filtratedText = strInput, sign = '';
                while(filtratedText.charAt(0) === '+' || filtratedText.charAt(0) === '-' || filtratedText.charAt(0) === ')' || filtratedText.charAt(0) === '(') {
                    sign = filtratedText.charAt(0);
                    filtratedText = filtratedText.substring(1);
                }
                filtratedText = filtratedText.replace(/[^0-9\.]/gi, "");
                var decimalPosition = filtratedText.indexOf('.');
                if(decimalPosition !== -1) {
                    var clips = filtratedText.split('.');
                    var integerString, decimalString;
                    integerString = clips.shift();
                    var decimalClips = clips;
                    decimalString = decimalClips.join('');
                    filtratedText = integerString + '.' + decimalString;
                } else {
                    filtratedText = filtratedText;
                }
                if(sign === '+') {
                    this._stringFormat.setPositiveSign();
                    this.checkAndRepairBounds(true, false);
                }
                if(sign === '-' || sign === ')' || sign === '(') {
                    this._stringFormat.invertSign();
                    this.checkAndRepairBounds(true, false);
                }
                rh.testPosition = prefix.length + beginText.length + filtratedText.length - 1;
                this._stringFormat.deFormatValue((this._stringFormat.isNegative() ? "-" : "") + beginText + filtratedText + endText);
                newText = this._stringFormat._strippedText;
                //this.checkAndRepairBounds(true, false);
                try  {
                    if(this.inputWidget.options.showGroup) {
                        oldGroupSeparatorCount = this._countSubstring(beginText, this._stringFormat._groupSeparator);
                        newGroupSeparatorCount = this._countSubstring(newText.substring(0, beginText.length + filtratedText.length), this._stringFormat._groupSeparator);
                        rh.testPosition += newGroupSeparatorCount - oldGroupSeparatorCount;
                    } else if(filtratedText.length === 1) {
                        leftPrevCh = beginText.charAt(beginText.length - 1);
                        leftCh = newText.charAt(beginText.length - 1);
                        //leftCh = newText.charAt(rh.testPosition - 1);
                        if(leftCh !== leftPrevCh) {
                            rh.testPosition--;
                        }
                    }
                } catch (e) {
                }
                return true;
            };
            wijNumberTextProvider.prototype.removeAt = function (start, end, rh, skipCheck) {
                if (typeof rh === "undefined") { rh = new input.wijInputResult(); }
                if (typeof skipCheck === "undefined") { skipCheck = false; }
                var nf = this._getCulture().numberFormat, curText, beginText, newText, decimalSepRemoved, oldGroupSeparatorCount, newGroupSeparatorCount;
                rh.testPosition = start;
                try  {
                    curText = this._stringFormat._currentText;
                    if((start === end) && curText.substring(start, end + 1) === this.getDecimalSeparator()) {
                        return false;
                    }
                    beginText = curText.slice(0, start);
                    newText = beginText;
                    decimalSepRemoved = curText.slice(start, end + 1).indexOf(this.getDecimalSeparator()) >= 0;
                    if(decimalSepRemoved) {
                        newText += this.getDecimalSeparator();
                    }
                    newText += curText.slice(end + 1);
                    newText = newText || "0";
                    this._stringFormat.deFormatValue(newText);
                    newText = this._stringFormat._currentText;
                    this.setNullValue(false);
                    if(this.inputWidget.options.showGroup) {
                        if(decimalSepRemoved) {
                            rh.testPosition = newText.indexOf(this.getDecimalSeparator());
                        } else {
                            try  {
                                oldGroupSeparatorCount = this._countSubstring(beginText, this._stringFormat._groupSeparator);
                                newGroupSeparatorCount = this._countSubstring(newText.substring(0, Math.max(0, start - 1)), this._stringFormat._groupSeparator);
                                rh.testPosition -= oldGroupSeparatorCount - newGroupSeparatorCount;
                                if(curText.indexOf(this.inputWidget.options.currencySymbol) === rh.testPosition || curText.indexOf(nf.percent.symbol) === rh.testPosition) {
                                    rh.testPosition++;
                                }
                            } catch (e1) {
                            }
                        }
                    }
                    // if (!skipCheck){
                    // this.checkAndRepairBounds(true, false);
                    // }
                    return true;
                } catch (e2) {
                }// if (!skipCheck){
                // this.checkAndRepairBounds(true, false);
                // }
                
                return true;
            };
            wijNumberTextProvider.prototype.replaceWith = function (range, text) {
                var shouldInvertAgain = false;
                if(this._stringFormat.isNegative() && text === '-' && range.text.length === this._stringFormat._currentText.length) {
                    shouldInvertAgain = true;
                }
                var superResult = _super.prototype.replaceWith.call(this, range, text);
                if(shouldInvertAgain) {
                    this.insertAt('-', this.inputWidget.element.wijtextselection().start, superResult);
                }
                return superResult;
            };
            wijNumberTextProvider.prototype.spinEnumPart = function (position, rh, val, isIncrease) {
                if(!rh) {
                    rh = new input.wijInputResult();
                }
                val = parseInt(val.toString());
                var prefixBeforeSpin = this.inputWidget._getPrefix();
                var dpPosition = this._stringFormat._currentText.indexOf(this._getCulture().numberFormat['.']);
                var valueStringWithoutMinus = this._stringFormat._currentValueInString.replace('-', '');
                var dpPositionInValueString = valueStringWithoutMinus.indexOf('.');
                var hasDecimalPoint = true;
                if(dpPosition === -1) {
                    hasDecimalPoint = false;
                    dpPosition = this._stringFormat._currentText.length;
                }
                if(dpPositionInValueString === 0) {
                    //".000"
                    dpPositionInValueString = 1;
                } else if(dpPositionInValueString === -1) {
                    dpPositionInValueString = dpPosition;
                }
                var scope = Math.pow(10, this.inputWidget.options.decimalPlaces);
                if(rh.testPosition > dpPosition && hasDecimalPoint) {
                    var fullVal = val;
                    val = val / scope;
                    if(Math.abs(val) >= 1) {
                        isIncrease ? this._stringFormat.spinUp(parseInt(val), this._nullvalue) : this._stringFormat.spinDown(parseInt(val), this._nullvalue);
                        val = (fullVal - parseInt(val) * scope) / scope// prevent float precision problem.
                        ;
                    }
                }
                isIncrease ? this._stringFormat.spinUp(val, this._nullvalue) : this._stringFormat.spinDown(val, this._nullvalue);
                this.setNullValue(false);
                var allowWrap = this.inputWidget.options.allowSpinLoop;
                this.checkAndRepairBounds(true, false, allowWrap);
                var valueStringWithoutMinusAfterSpin = this._stringFormat._currentValueInString.replace('-', '');
                var dpPositionInValueStringAfterSpin = valueStringWithoutMinusAfterSpin.indexOf('.');
                if(dpPositionInValueStringAfterSpin === -1) {
                    hasDecimalPoint = false;
                    dpPositionInValueStringAfterSpin = valueStringWithoutMinusAfterSpin.length;
                }
                var prefixAfterSpin = this.inputWidget._getPrefix();
                if(dpPositionInValueStringAfterSpin !== dpPositionInValueString && hasDecimalPoint) {
                    rh.testPosition = rh.testPosition - prefixBeforeSpin.length + prefixAfterSpin.length + dpPositionInValueStringAfterSpin - dpPositionInValueString;
                } else {
                    rh.testPosition = rh.testPosition - prefixBeforeSpin.length + prefixAfterSpin.length;
                }
            };
            wijNumberTextProvider.prototype.getValue = function () {
                return this._stringFormat.getJSFloatValue();
            };
            wijNumberTextProvider.prototype.setValue = function (val) {
                try  {
                    //if val is null, show null value instead of 0
                    if(val === null) {
                        this.setNullValue(true);
                        val = this.inputWidget._initialValue;
                    } else {
                        this.setNullValue(false);
                    }
                    this._stringFormat.setValueFromJSFloat(val);
                    this.checkAndRepairBounds(true, false);
                    return true;
                } catch (e) {
                    return false;
                }
            };
            wijNumberTextProvider.prototype.setNullValue = function (value) {
                this._nullvalue = value;
            };
            return wijNumberTextProvider;
        })(input.wijTextProvider);
        input.wijNumberTextProvider = wijNumberTextProvider;        
        //updateStringFormat() {
        //    var t = '0';
        //    if (typeof (this._stringFormat) !== 'undefined') {
        //        t = this._stringFormat._currentValueInString;
        //    }
        //    this._stringFormat = new wijNumberFormat(this.inputWidget);
        //    this._stringFormat._currentValueInString = t;
        //}
        //============================
        var wijNumberFormat = (function () {
            function wijNumberFormat(inputWidget) {
                this.inputWidget = inputWidget;
                // stripped value with en-US culture
                this._currentValueInString = '0';
                this._currentText = '0';
                this._strippedText = '0';
                this._groupSeparator = ' ';
            }
            wijNumberFormat.prototype._isNegtive = function (value) {
                return value.indexOf('-') !== -1 || value.indexOf('(') !== -1;
            };
            wijNumberFormat.prototype._stripValue = function (value) {
                var nf = this.inputWidget._getCulture().numberFormat, specificFormat = nf[this.inputWidget.options.type] || nf, isNegative = this._isNegtive(value), groupSep = //this.isNegative(),
                specificFormat[','], decimalSep = specificFormat['.'], stripRgx = new RegExp('[' + groupSep + nf.percent.symbol + this.inputWidget.options.currencySymbol + ' ]', 'g'), match;
                this._groupSeparator = groupSep;
                value = this._removeNegativeSign(value);
                value = value.replace(stripRgx, '');
                value = value.replace(decimalSep, '.');
                match = /([\d\.])+/.exec(value);
                if(match) {
                    value = match[0];
                }
                if(isNegative) {
                    value = '-' + value;
                }
                return value;
            };
            wijNumberFormat.prototype.tryParseValue = function (value) {
                try  {
                    var result = parseFloat(this._stripValue(value));
                    if(isNaN(result)) {
                        result = null;
                    }
                    return result;
                } catch (e) {
                    return null;
                }
            };
            wijNumberFormat.prototype.deFormatValue = function (value) {
                value = this._stripValue(value);
                this._currentValueInString = value;
                this._currentText = this._formatValue(value);
            };
            wijNumberFormat.prototype._formatValue = function (strippedValue) {
                var ops = this.inputWidget.options;
                var nf = this.inputWidget._getCulture().numberFormat, specificFormat = nf[ops.type] || nf, dp = ops.decimalPlaces, groupSep = // isNegative = this.isNegative(), //this.isNegtive(strippedValue),
                // pattern = specificFormat.pattern[isNegative ? 0 : 1] || 'n',
                specificFormat[','], decimalSep = specificFormat['.'], decimals = dp !== -2 ? dp : specificFormat.decimals, groupSizes = ops.showGroup ? specificFormat.groupSizes : [
                    0
                ], digitsString;
                strippedValue = this._removeLeadingZero(strippedValue);
                digitsString = this._formatDigit(strippedValue, groupSep, decimalSep, decimals, groupSizes);
                digitsString = this._removeLeadingZero(digitsString, ops.showGroup ? groupSep : "");
                if(digitsString.indexOf(decimalSep) === 0) {
                    digitsString = '0' + digitsString;
                }
                if(digitsString === '') {
                    digitsString = '0';
                }
                this._currentValueInString = strippedValue;
                //this._currentText = this.applyFormatPattern(pattern, digitsString,
                //    nf.percent.symbol, this.inputWidget.options.currencySymbol);
                this._strippedText = digitsString;
                this._currentText = this._getPrefix() + digitsString + this._getSuffix();
                return this._currentText;
            };
            wijNumberFormat.prototype._getPrefix = function () {
                if(this.isNegative()) {
                    if(this.inputWidget._userNegativePrefix !== undefined) {
                        return this.inputWidget._userNegativePrefix.replace(/\$/g, this.inputWidget.options.currencySymbol);
                    } else {
                        if(this.inputWidget.options.negativePrefix === null) {
                            // in _create()
                            return "";
                        }
                        return this.inputWidget.options.negativePrefix.replace(/\$/g, this.inputWidget.options.currencySymbol);
                    }
                } else {
                    if(this.inputWidget._userPositivePrefix !== undefined) {
                        return this.inputWidget._userPositivePrefix.replace(/\$/g, this.inputWidget.options.currencySymbol);
                    } else {
                        if(this.inputWidget.options.positivePrefix === null) {
                            // in _create()
                            return "";
                        }
                        return this.inputWidget.options.positivePrefix.replace(/\$/g, this.inputWidget.options.currencySymbol);
                    }
                }
            };
            wijNumberFormat.prototype._getSuffix = function () {
                if(this.isNegative()) {
                    if(this.inputWidget._userNegativeSuffix !== undefined) {
                        return this.inputWidget._userNegativeSuffix.replace(/\$/g, this.inputWidget.options.currencySymbol);
                    } else {
                        if(this.inputWidget.options.negativeSuffix === null) {
                            // in _create()
                            return "";
                        }
                        return this.inputWidget.options.negativeSuffix.replace(/\$/g, this.inputWidget.options.currencySymbol);
                    }
                } else {
                    if(this.inputWidget._userPositiveSuffix !== undefined) {
                        return this.inputWidget._userPositiveSuffix.replace(/\$/g, this.inputWidget.options.currencySymbol);
                    } else {
                        if(this.inputWidget.options.positiveSuffix === null) {
                            // in _create()
                            return "";
                        }
                        return this.inputWidget.options.positiveSuffix.replace(/\$/g, this.inputWidget.options.currencySymbol);
                    }
                }
            };
            wijNumberFormat.prototype.getFormattedValue = function () {
                //var prefix = this.inputWidget._getPrefix(),
                //    suffix = this.inputWidget._getSuffix();
                //return prefix + this._removeNegativeSign(this.formatValue(this._currentValueInString)) + suffix;
                if(!this.inputWidget._showNullText() && this.inputWidget.isValueNull()) {
                    this._currentValueInString = this.inputWidget._initialValue + '';
                }
                return this._formatValue(this._currentValueInString);
            };
            wijNumberFormat.prototype.getJSFloatValue = function () {
                try  {
                    if(this._currentValueInString === '' || this._currentValueInString === '.') {
                        return 0;
                    }
                    return parseFloat(this._currentValueInString);
                } catch (e) {
                    return Number.NaN;
                }
            };
            wijNumberFormat.prototype.clear = function () {
                this._currentValueInString = '0';
                this._currentText = '0';
                this._strippedText = '0';
            };
            wijNumberFormat.prototype.setValueFromJSFloat = function (value) {
                var strValue = value.toFixed(this.inputWidget.options.decimalPlaces + 1);
                try  {
                    this._currentValueInString = strValue;
                    this._formatValue(strValue);
                    return true;
                } catch (e) {
                    return false;
                }
            };
            wijNumberFormat.prototype.isZero = function (val) {
                if (typeof val === "undefined") { val = this._currentValueInString; }
                var test = this._removeNegativeSign(val), dbl;
                if(!test) {
                    return true;
                }
                dbl = parseFloat(test);
                return !isNaN(dbl) && !dbl;
            };
            wijNumberFormat.prototype.setPositiveSign = function () {
                this._currentValueInString = this._removeNegativeSign(this._currentValueInString);
            };
            wijNumberFormat.prototype._removeNegativeSign = function (text) {
                return text.replace(/[()\-]/g, "");
            };
            wijNumberFormat.prototype._removeLeadingZero = function (text, groupSep) {
                if (typeof groupSep === "undefined") { groupSep = ""; }
                var text = text.replace(/^0+/, "");
                while(groupSep.length > 0 && text.indexOf(groupSep) === 0) {
                    text = text.substr(groupSep.length);
                    var text = text.replace(/^0+/, "");
                }
                return text;
            };
            wijNumberFormat.prototype.isNegative = function () {
                return this._currentValueInString.indexOf('-') !== -1 || this._currentValueInString.indexOf('(') !== -1;
            };
            wijNumberFormat.prototype.invertSign = function () {
                var isNegative = this.isNegative();
                if(isNegative) {
                    this.setPositiveSign();
                } else {
                    this._currentValueInString = (!this._currentValueInString.length) ? '0' : '-' + this._currentValueInString;
                }
                if(this.isZero()) {
                    this._currentValueInString = isNegative ? '0' : '-0';
                }
                this._formatValue(this._currentValueInString);
            };
            wijNumberFormat.prototype._parseNumber = function (strippedValue) {
                if (typeof strippedValue === "undefined") { strippedValue = this._currentValueInString; }
                var arr = strippedValue.split(".", 2);
                var retObj = {
                    integer: parseInt(arr[0], 10) || 0,
                    fraction: (arr.length > 1 ? parseInt(arr[1], 10) : 0) || 0,
                    isNegative: arr[0].indexOf('-') !== -1
                };
                if(retObj.integer === 0 && retObj.fraction === 0) {
                    retObj.isNegative = false;
                }
                return retObj;
            };
            wijNumberFormat.prototype._doSpin = function (delta, nullValue) {
                // 5, -1, 0.03, -0.08
                var num = this._parseNumber();
                var deltaDirection = delta >= 0 ? 1 : -1;
                var spinPosition = Math.abs(delta) >= 1 ? 'integer' : 'decimal';
                var deltaUnit = this.inputWidget.options.increment;
                if(deltaUnit >= Math.pow(10, this.inputWidget.options.decimalPlaces)) {
                    if(spinPosition === 'integer') {
                        deltaUnit = Math.abs(delta);
                    } else {
                        deltaUnit = Math.abs(delta) * Math.pow(10, this.inputWidget.options.decimalPlaces);
                    }
                }
                var deltaInPosition = deltaDirection * deltaUnit;
                var signPrefix = '', integerString, decimalString;
                var integerResult = num.integer, decimalResult = num.fraction;
                if(spinPosition === 'integer') {
                    integerResult = num.integer + deltaInPosition;
                    if(integerResult < 0) {
                        signPrefix = '-';
                        integerResult = -integerResult;
                    }
                } else if(spinPosition === 'decimal') {
                    var decimalValue = num.isNegative ? -num.fraction : num.fraction;
                    integerResult = num.integer;
                    if(decimalValue < 0) {
                        decimalResult = -Math.abs(decimalValue + deltaInPosition);
                        if(decimalValue * (decimalValue + deltaInPosition) < 0) {
                            integerResult = Math.abs(integerResult);
                            signPrefix = '-';
                        }
                    } else {
                        decimalResult = decimalValue + deltaInPosition;
                    }
                    if(decimalValue === 0 && num.isNegative) {
                        decimalResult = -Math.abs(decimalResult);
                        signPrefix = '-';
                        if(deltaDirection === 1) {
                            integerResult = Math.abs(integerResult);
                        }
                    }
                    if(decimalResult <= 0) {
                        if(integerResult > 0) {
                            integerResult = integerResult - 1;
                            decimalResult = Math.pow(10, this.inputWidget.options.decimalPlaces) + decimalResult;
                        } else {
                            integerResult = Math.abs(num.integer);
                            decimalResult = Math.abs(decimalResult);
                            signPrefix = '-';
                        }
                    }
                }
                integerString = integerResult.toString();
                decimalString = decimalResult.toString();
                if(parseInt(this.inputWidget.options.decimalPlaces) > 0 && decimalString.length > parseInt(this.inputWidget.options.decimalPlaces)) {
                    integerResult++;
                    decimalString = decimalString.substring(1);
                    integerString = integerResult.toString();
                }
                //fill leading zeros to decimal part.
                while(decimalString.length < this.inputWidget.options.decimalPlaces) {
                    decimalString = '0' + decimalString;
                }
                if(integerString.indexOf('-') !== -1) {
                    signPrefix = '';
                }
                if(parseInt(integerString) === 0 && parseInt(decimalString) === 0) {
                    signPrefix = '';
                }
                if(nullValue) {
                    if(delta >= 0) {
                        this._currentValueInString = this.inputWidget.options.minValue.toString();
                    } else {
                        this._currentValueInString = this.inputWidget.options.maxValue.toString();
                    }
                } else {
                    this._currentValueInString = signPrefix + integerString + '.' + decimalString;
                }
            };
            wijNumberFormat.prototype.spinUp = function (val, nullValue) {
                if(val === null || val === undefined) {
                    val = 1;
                }
                this._doSpin(val, nullValue);
            };
            wijNumberFormat.prototype.spinDown = function (val, nullValue) {
                if(val === null || val === undefined) {
                    val = 1;
                }
                this._doSpin(-val, nullValue);
            };
            wijNumberFormat.prototype.checkDigitsLimits = function (digitCount) {
                var arr = this._currentValueInString.split("."), fraction = '';
                if(!arr.length || (arr.length === 1 && arr[0] === '')) {
                    return;
                }
                if(arr.length > 1) {
                    fraction = arr[1];
                }
                fraction = fraction.substring(0, digitCount);
                while(fraction.length < digitCount) {
                    fraction += "0";
                }
                this._currentValueInString = arr[0];
                if(fraction) {
                    this._currentValueInString += "." + fraction;
                }
            };
            wijNumberFormat.prototype.checkMinValue = function (minValue, chkAndRepair, chkIsLessOrEqMin) {
                if (typeof chkIsLessOrEqMin === "undefined") { chkIsLessOrEqMin = false; }
                var result = true, integerFractionArr, currentIntegerPart, currentFractionPart, minIntegerPart, minFractionPart;
                try  {
                    integerFractionArr = this._currentValueInString.split(".");
                    currentIntegerPart = parseFloat((integerFractionArr[0] === '' || integerFractionArr[0] === '-') ? '0' : integerFractionArr[0]);
                    currentFractionPart = 0;
                    if(integerFractionArr.length > 1 && parseFloat(integerFractionArr[1]) >= 0) {
                        currentFractionPart = parseFloat('1.' + integerFractionArr[1]);
                    }
                    if(currentIntegerPart < 0 || integerFractionArr[0] === '-' || (integerFractionArr[0].length > 0 && integerFractionArr[0][0] === '-')) {
                        currentFractionPart = currentFractionPart * (-1);
                    }
                    minValue = '' + minValue.toFixed(12) + '';
                    integerFractionArr = minValue.split(".");
                    minIntegerPart = parseFloat((integerFractionArr[0] === '' || integerFractionArr[0] === '-') ? '0' : integerFractionArr[0]);
                    minFractionPart = 0;
                    if(integerFractionArr.length > 1 && parseFloat(integerFractionArr[1]) >= 0) {
                        minFractionPart = parseFloat('1.' + integerFractionArr[1]);
                    }
                    if(minIntegerPart < 0 || integerFractionArr[0] === '-' || (integerFractionArr[0].length > 0 && integerFractionArr[0][0] === '-')) {
                        minFractionPart = minFractionPart * (-1);
                    }
                    if(currentIntegerPart > minIntegerPart) {
                        return true;
                    }
                    if(currentIntegerPart < minIntegerPart || (chkIsLessOrEqMin && currentIntegerPart === minIntegerPart && currentFractionPart <= minFractionPart)) {
                        result = false;
                    } else if(currentIntegerPart === minIntegerPart && currentIntegerPart < 0 && currentFractionPart < minFractionPart) {
                        result = false;
                    } else if(currentIntegerPart === minIntegerPart && currentIntegerPart >= 0 && currentFractionPart < minFractionPart) {
                        result = false;
                    }
                    if(!result && chkAndRepair) {
                        this._currentValueInString = '' + minValue + '';
                    }
                } catch (e) {
                }
                return result;
            };
            wijNumberFormat.prototype.checkMaxValue = function (maxValue, chkAndRepair) {
                var result = true, integerFractionArr, currentIntegerPart, currentFractionPart, maxIntegerPart, maxFractionPart;
                try  {
                    integerFractionArr = this._currentValueInString.split(".");
                    currentIntegerPart = parseFloat((integerFractionArr[0] === '' || integerFractionArr[0] === '-') ? '0' : integerFractionArr[0]);
                    currentFractionPart = 0;
                    if(integerFractionArr.length > 1 && parseFloat(integerFractionArr[1]) >= 0) {
                        currentFractionPart = parseFloat('1.' + integerFractionArr[1]);
                    }
                    if(currentIntegerPart < 0 || integerFractionArr[0] === '-' || (integerFractionArr[0].length > 0 && integerFractionArr[0][0] === '-')) {
                        currentFractionPart = currentFractionPart * (-1);
                    }
                    maxValue = '' + maxValue.toFixed(12) + '';
                    integerFractionArr = maxValue.split(".");
                    maxIntegerPart = parseFloat((integerFractionArr[0] === '' || integerFractionArr[0] === '-') ? '0' : integerFractionArr[0]);
                    maxFractionPart = 0;
                    if(integerFractionArr.length > 1 && parseFloat(integerFractionArr[1]) >= 0) {
                        maxFractionPart = parseFloat('1.' + integerFractionArr[1]);
                    }
                    if(maxIntegerPart < 0 || integerFractionArr[0] === '-' || (integerFractionArr[0].length > 0 && integerFractionArr[0][0] === '-')) {
                        maxFractionPart = maxFractionPart * (-1);
                    }
                    if(currentIntegerPart < maxIntegerPart) {
                        return true;
                    }
                    if(currentIntegerPart > maxIntegerPart) {
                        result = false;
                    }
                    if(currentIntegerPart === maxIntegerPart && currentIntegerPart >= 0 && currentFractionPart > maxFractionPart) {
                        result = false;
                    }
                    if(currentIntegerPart === maxIntegerPart && currentIntegerPart < 0 && currentFractionPart > maxFractionPart) {
                        result = false;
                    }
                    if(!result && chkAndRepair) {
                        this._currentValueInString = '' + maxValue + '';
                    }
                } catch (e) {
                }
                return result;
            };
            wijNumberFormat.prototype._formatDigit = //applyFormatPattern(pattern: string, digitString: string, percentSymbol: string, currencySymbol: string) {
            //    return pattern
            //        .replace(/n/g, digitString)
            //        .replace(/%/g, percentSymbol)
            //        .replace(/\$/g, currencySymbol);
            //}
            function (strippedValue, groupSep, decimalSep, decimals, groupSizes) {
                var absValue = this._removeNegativeSign(strippedValue), decimalPos, result, groupSizeIndex, groupCount, ch, i;
                decimalPos = absValue.indexOf('.');
                if(decimalPos === -1) {
                    decimalPos = absValue.length;
                }
                result = '';
                groupSizeIndex = 0;
                groupCount = 0;
                for(i = absValue.length - 1; i >= 0; i--) {
                    ch = absValue.charAt(i);
                    if(i < decimalPos) {
                        result = ch + result;
                        groupCount++;
                        if(groupCount === groupSizes[groupSizeIndex] * 1 && groupSizes[groupSizeIndex] * 1 && i) {
                            result = groupSep + result;
                            groupCount = 0;
                            if(groupSizes.length - 1 > groupSizeIndex) {
                                groupSizeIndex++;
                            }
                        }
                    }
                }
                if(decimals > 0) {
                    result = result + decimalSep;
                    for(i = 0; i < decimals; i++) {
                        ch = '0';
                        if(i + decimalPos + 1 < absValue.length) {
                            ch = absValue.charAt(i + decimalPos + 1);
                        }
                        result = result + ch;
                    }
                }
                if(decimals === -1) {
                    if(decimalPos < absValue.length - 1) {
                        result = result + decimalSep;
                        result = result + absValue.substr(decimalPos + 1);
                    }
                }
                return result;
            };
            return wijNumberFormat;
        })();
        input.wijNumberFormat = wijNumberFormat;        
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
