var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="declarations/jquery.d.ts"/>
/// <reference path="declarations/jquery.ui.d.ts"/>
/// <reference path="declarations/wijmo.d.ts"/>
/// <reference path="jquery.wijmo.wijinputcore.ts"/>
/*globals wijinputcore wijNumberTextProvider wijInputResult
wijNumberFormat window jQuery*/
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
* * Wijmo Inputnumber widget.
*
* Depends:
*	jquery-1.4.2.js
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.position.js
*	jquery.effects.core.js
*	jquery.effects.blind.js
*	globalize.js
*	jquery.plugin.wijtextselection.js
*	jquery.mousewheel.js
*	jquery.wijmo.wijpopup.js
*	jquery.wijmo.wijinputcore.js
*
*/
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery;
    var wijinputnumber = (function (_super) {
        __extends(wijinputnumber, _super);
        function wijinputnumber() {
            _super.apply(this, arguments);

        }
        wijinputnumber.prototype._createTextProvider = function () {
            this._textProvider = new wijNumberTextProvider(this, this.options.type);
            this._textProvider._nullvalue = this.element.val() === "" && this.options.value === null;
        };
        wijinputnumber.prototype._beginUpdate = function () {
            var o = this.options;
            this.element.addClass('wijmo-wijinput-numeric');
            this.element.data({
                defaultValue: o.value,
                preValue: o.value
            }).attr({
                'aria-valuemin': o.minValue,
                'aria-valuemax': o.maxValue,
                'aria-valuenow': o.value || 0
            });
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
                    this._textProvider.updateStringFormat();
                    this._updateText();
                    break;
            }
        };
        wijinputnumber.prototype._setData = function (val) {
            this.setValue(val);
        };
        wijinputnumber.prototype._resetData = function () {
            var val = this.element.data('defaultValue');
            if(val === undefined || val === null) {
                val = this.element.data('elementValue');
                if(val === undefined || val === null && val === "") {
                    val = 0;
                }
            }
            this.setValue(val);
        };
        wijinputnumber.prototype._validateData = function () {
            if(!this._textProvider.checkAndRepairBounds(true, false)) {
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
        wijinputnumber.prototype.getValue = function () {
            /// <summary>
            /// Gets the value.
            /// Code example:
            /// $(".selector").wijinputnumber("getValue")
            /// </summary>
            var val = this._textProvider.getValue();
            if(val === undefined || val === null) {
                val = this.getText();
            }
            return val;
        };
        wijinputnumber.prototype.setValue = function (val, exact) {
            if (typeof exact === "undefined") { exact = false; }
            /// <summary>
            /// Sets the value.
            /// Code example:
            /// $(".selector").wijinputnumber("setValue", 10, true)
            /// </summary>
            try  {
                exact = !!exact;
                if(typeof val === 'boolean') {
                    val = val ? '1' : '0';
                } else if(typeof val === 'string') {
                    val = this._textProvider.tryParseValue(val);
                }
                if(this._textProvider.setValue(val)) {
                    this._updateText();
                } else {
                    if(exact) {
                        var prevVal = '', txt;
                        prevVal = this.getText();
                        this.setText(val);
                        val = val.trim();
                        txt = this.getText().trim();
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
        wijinputnumber.prototype.isValueNull = function () {
            /// <summary>
            /// Determines whether the value is in null state.
            /// Code example:
            /// $(".selector").wijinputnumber("isValueNull")
            /// </summary>
            try  {
                return (this._textProvider).isValueNull();
            } catch (e) {
                return true;
            }
        };
        wijinputnumber.prototype.getPostValue = function () {
            /// <summary>
            /// Gets the text value when the container form is posted back to server.
            /// Code example:
            /// $(".selector").wijinputnumber("getPostValue")
            /// </summary>
            if(!this._isInitialized()) {
                return this.element.val();
            }
            if(this.options.showNullText && this.isValueNull()) {
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
            this.options.value = this._textProvider.getValue();
            _super.prototype._updateText.call(this, keepSelection);
            if(!this._textProvider.checkAndRepairBounds(false, false)) {
                this._trigger('valueBoundsExceeded');
            }
        };
        wijinputnumber.prototype._doSpin = function (up, repeating) {
            if(!this._allowEdit()) {
                return false;
            }
            if(repeating && this.element.data('breakSpinner')) {
                return false;
            }
            var selRange = this.element.wijtextselection(), rh = new wijmo.wijInputResult();
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
            this._textProvider[up ? 'incEnumPart' : 'decEnumPart'](selRange.start, rh, this.options.increment);
            this._updateText();
            this.element.data('prevCursorPos', rh.testPosition);
            this.selectText(rh.testPosition, rh.testPosition);
            if(repeating && !this.element.data('breakSpinner')) {
                window.setTimeout($.proxy(function () {
                    this._doSpin(up, true);
                }, this), this._calcSpinInterval());
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
            _super.prototype._deleteSelText.call(this, backspace);
            if(everythingSelected) {
                // everything is selected
                this._textProvider._nullvalue = true;
                this._updateText(true);
            }
        };
        return wijinputnumber;
    })(wijmo.wijinputcore);    
    wijinputnumber.prototype.options = $.extend(true, {
    }, wijmo.wijinputcore.prototype.options, {
        type: ///	<summary>
        ///	Determines the type of the number input.
        ///	Possible values are: 'numeric', 'percent', 'currency'.
        ///	</summary>
        'numeric',
        value: ///	<summary>
        ///	Determines the default numeric value.
        ///	</summary>
        null,
        minValue: ///	<summary>
        ///	Determines the minimal value that can be entered for
        /// numeric/percent/currency inputs.
        ///	</summary>
        -1000000000,
        maxValue: ///	<summary>
        ///	Determines the maximum value that can be entered for
        /// numeric/percent/currency inputs.
        ///	</summary>
        1000000000,
        showGroup: ///	<summary>
        ///		Indicates whether the thousands group separator will be
        ///		inserted between between each digital group
        ///		(number of digits in thousands group depends on the
        ///		selected Culture).
        ///	</summary>
        false,
        decimalPlaces: ///	<summary>
        ///		Indicates the number of decimal places to display.
        ///		Possible values are integer from -2 to 8. They are:
        ///		useDefault: -2,
        ///		asIs: -1,
        ///		zero: 0,
        ///		one: 1,
        ///		two: 2,
        ///		three: 3,
        ///		four: 4,
        ///		five: 5,
        ///		six: 6,
        ///		seven: 7,
        ///		eight: 8
        ///	</summary>
        2,
        increment: ///	<summary>
        ///		Determines how much to increase/decrease the input field.
        ///	</summary>
        1,
        valueChanged: /// <summary>
        /// The valueChanged event handler.
        /// A function called when the value of the input is changed.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// $("#element").wijinputnumber({ valueChanged: function (e, arg) { } });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="args" type="Object">
        /// The data with this event.
        /// args.value: The new value.
        ///</param>
        null,
        valueBoundsExceeded: /// <summary>
        /// The valueBoundsExceeded event handler. A function called when
        /// the value of the input exceeds the valid range.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// $("#element").wijinputnumber({ valueBoundsExceeded: function (e) { } });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        null
    });
    $.widget("wijmo.wijinputnumber", wijinputnumber.prototype);
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
            this._stringFormat = new wijNumberFormat(this._type, this.inputWidget.options.decimalPlaces, this.inputWidget.options.showGroup, this._getCulture());
            this._stringFormat._setValueFromJSFloat(this.getValue());
        }
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
            if(this.inputWidget.options.showNullText && !this.inputWidget.isFocused() && this.isValueNull()) {
                return this.inputWidget.options.nullText;
            }
            return this._stringFormat.getFormattedValue();
        };
        wijNumberTextProvider.prototype.isValueNull = function () {
            var o = this.inputWidget.options, nullValue = o.minValue;
            //nullValue = Math.max(0, o.minValue);
            return null === o.value || undefined === o.value || nullValue === o.value || this._nullvalue;
        };
        wijNumberTextProvider.prototype.set = function (input, rh) {
            this.clear();
            this.insertAt(input, 0, rh);
            return true;
        };
        wijNumberTextProvider.prototype.clear = function () {
            this._stringFormat.clear();
        };
        wijNumberTextProvider.prototype.checkAndRepairBounds = function (chkAndRepair, chkIsLessOrEqMin) {
            var result = true, minValue, maxValue;
            if(typeof (chkAndRepair) === 'undefined') {
                chkAndRepair = false;
            }
            minValue = this.inputWidget.options.minValue;
            maxValue = this.inputWidget.options.maxValue;
            if(typeof (chkIsLessOrEqMin) !== 'undefined' && chkIsLessOrEqMin) {
                return this._stringFormat.checkMinValue(minValue, false, true);
            }
            if(!this._stringFormat.checkMinValue(minValue, chkAndRepair, false)) {
                result = false;
            }
            if(!this._stringFormat.checkMaxValue(maxValue, chkAndRepair)) {
                result = false;
            }
            if(this.inputWidget.options.decimalPlaces >= 0) {
                this._stringFormat.checkDigitsLimits(this.inputWidget.options.decimalPlaces);
            }
            return result;
        };
        wijNumberTextProvider.prototype.countSubstring = function (txt, subStr) {
            var c = 0, pos = txt.indexOf(subStr);
            while(pos !== -1) {
                c++;
                pos = txt.indexOf(subStr, pos + 1);
            }
            return c;
        };
        wijNumberTextProvider.prototype.getAdjustedPositionFromLeft = function (position) {
            var currentText = this._stringFormat._currentText, i, ch;
            for(i = 0; i < currentText.length; i++) {
                ch = currentText.charAt(i);
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
        wijNumberTextProvider.prototype.getDecimalSeparatorPos = function () {
            var currentText = this._stringFormat._currentText;
            return currentText.indexOf(this.getDecimalSeparator());
        };
        wijNumberTextProvider.prototype.removeLeadingZero = function (num) {
            var pos = 0;
            if(num.charAt(pos) === ' ' || num.charAt(pos) === this._getCulture().numberFormat.currency.symbol) {
                pos++;
            }
            while(num.charAt(pos) === '0') {
                num = num.substr(0, pos) + num.substr(pos + 1);
            }
            return num;
        };
        wijNumberTextProvider.prototype.insertAt = function (input, position, rh) {
            var nf = this._getCulture().numberFormat, pos, slicePos, currentText, beginText, endText, newText, oldGroupSeparatorCount, newGroupSeparatorCount, leftPrevCh, leftCh;
            if(!rh) {
                rh = new wijmo.wijInputResult();
            } else {
                this._nullvalue = false;
            }
            if(input.length === 1) {
                if(input === '+') {
                    this._stringFormat.setPositiveSign();
                    this.checkAndRepairBounds(true, false);
                    return true;
                }
                if(input === '-' || input === ')' || input === '(') {
                    this._stringFormat.invertSign();
                    this.checkAndRepairBounds(true, false);
                    rh.testPosition = position;
                    if(this._stringFormat.isNegative()) {
                        rh.testPosition = position;
                    } else {
                        rh.testPosition = position - 2;
                    }
                    return true;
                }
                if(!$.wij.charValidator.isDigit(input)) {
                    if(input === this.getDecimalSeparator()) {
                        pos = this.getDecimalSeparatorPos();
                        if(pos >= 0) {
                            rh.testPosition = pos;
                            return true;
                        }
                    }
                    if(input !== this.getGroupSeparator() && input !== this.getDecimalSeparator() && input !== ')' && input !== '+' && input !== '-' && input !== '(' && input !== this.getDecimalSeparator()) {
                        if(this._type === 'percent' && input === nf.percent.symbol) {
                            rh.testPosition = position;
                            return true;
                        } else if(this._type === 'currency' && input === nf.currency.symbol) {
                            rh.testPosition = position;
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            }
            position = this.getAdjustedPositionFromLeft(position);
            slicePos = position;
            currentText = this._stringFormat._currentText;
            if(slicePos > currentText.length) {
                slicePos = currentText.length - 1;
            }
            // if (input.length === 1) {
            // if (currentText.charAt(slicePos) === input) {
            // rh.testPosition = slicePos;
            // return true;
            // }
            // }
            beginText = this.removeLeadingZero(currentText.substring(0, slicePos));
            endText = currentText.substring(slicePos, currentText.length);
            if(this._stringFormat.isZero()) {
                endText = endText.replace(/0/, '');
            }
            rh.testPosition = beginText.length + input.length - 1;
            this._stringFormat.deFormatValue(beginText + input + endText);
            newText = this._stringFormat._currentText;
            //this.checkAndRepairBounds(true, false);
            try  {
                if(this.inputWidget.options.showGroup) {
                    oldGroupSeparatorCount = this.countSubstring(beginText, this._stringFormat._groupSeparator);
                    newGroupSeparatorCount = this.countSubstring(newText.substring(0, beginText.length + input.length), this._stringFormat._groupSeparator);
                    rh.testPosition += newGroupSeparatorCount - oldGroupSeparatorCount;
                } else if(input.length === 1) {
                    leftPrevCh = beginText.charAt(beginText.length - 1);
                    leftCh = newText.charAt(rh.testPosition - 1);
                    if(leftCh !== leftPrevCh) {
                        rh.testPosition--;
                    }
                }
            } catch (e) {
            }
            return true;
        };
        wijNumberTextProvider.prototype.removeAt = function (start, end, rh, skipCheck) {
            if (typeof rh === "undefined") { rh = new wijmo.wijInputResult(); }
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
                this._nullvalue = false;
                if(this.inputWidget.options.showGroup) {
                    if(decimalSepRemoved) {
                        rh.testPosition = newText.indexOf(this.getDecimalSeparator());
                    } else {
                        try  {
                            oldGroupSeparatorCount = this.countSubstring(beginText, this._stringFormat._groupSeparator);
                            newGroupSeparatorCount = this.countSubstring(newText.substring(0, Math.max(0, start - 1)), this._stringFormat._groupSeparator);
                            rh.testPosition -= oldGroupSeparatorCount - newGroupSeparatorCount;
                            if(curText.indexOf(nf.currency.symbol) === rh.testPosition || curText.indexOf(nf.percent.symbol) === rh.testPosition) {
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
        wijNumberTextProvider.prototype.incEnumPart = function (position, rh, val) {
            if(!rh) {
                rh = new wijmo.wijInputResult();
            }
            this._stringFormat.increment(val);
            this._nullvalue = false;
            return this.checkAndRepairBounds(true, false);
        };
        wijNumberTextProvider.prototype.decEnumPart = function (position, rh, val) {
            if(!rh) {
                rh = new wijmo.wijInputResult();
            }
            this._stringFormat.decrement(val);
            this._nullvalue = false;
            return this.checkAndRepairBounds(true, false);
        };
        wijNumberTextProvider.prototype.getValue = function () {
            return this._stringFormat.getJSFloatValue();
        };
        wijNumberTextProvider.prototype.setValue = function (val) {
            try  {
                this._stringFormat._setValueFromJSFloat(val);
                this.checkAndRepairBounds(true, false);
                return true;
            } catch (e) {
                return false;
            }
        };
        wijNumberTextProvider.prototype.updateStringFormat = function () {
            var t = '0';
            if(typeof (this._stringFormat) !== 'undefined') {
                t = this._stringFormat._currentValueInString;
            }
            this._stringFormat = new wijNumberFormat(this._type, this.inputWidget.options.decimalPlaces, this.inputWidget.options.showGroup, this._getCulture());
            this._stringFormat._currentValueInString = t;
        };
        return wijNumberTextProvider;
    })(wijmo.wijTextProvider);    
    //============================
    var wijNumberFormat = (function () {
        function wijNumberFormat(type, digitsPlaces, showGroup, culture) {
            this.type = type;
            this.digitsPlaces = digitsPlaces;
            this.showGroup = showGroup;
            this.culture = culture;
            // stripped value with en-US culture
            this._currentValueInString = '0';
            this._currentText = '0';
            this._groupSeparator = ' ';
        }
        wijNumberFormat.prototype.decimalSeparator = function () {
            return this.culture.numberFormat["."];
        };
        wijNumberFormat.prototype.isNegtive = function (value) {
            return value.indexOf('-') !== -1 || value.indexOf('(') !== -1;
        };
        wijNumberFormat.prototype.stripValue = function (value) {
            var nf = this.culture.numberFormat, isNegative = this.isNegtive(value), groupSep, decimalSep, r, reg, arr;
            value = value.replace('(', '');
            value = value.replace(')', '');
            value = value.replace('-', '');
            value = value.replace(nf.percent.symbol, '');
            value = value.replace(nf.currency.symbol, '');
            groupSep = nf[','];
            decimalSep = nf['.'];
            switch(this.type) {
                case 'percent':
                    groupSep = nf.percent[','];
                    decimalSep = nf.percent['.'];
                    break;
                case 'currency':
                    groupSep = nf.currency[','];
                    decimalSep = nf.currency['.'];
                    break;
            }
            this._groupSeparator = groupSep;
            r = new RegExp('[' + groupSep + ']', 'g');
            value = value.replace(r, '');
            r = new RegExp('[' + decimalSep + ']', 'g');
            value = value.replace(r, '.');
            r = new RegExp('[ ]', 'g');
            value = value.replace(r, '');
            try  {
                reg = new RegExp('([\\d\\.])+');
                arr = reg.exec(value);
                if(arr) {
                    value = arr[0];
                }
                if(isNegative) {
                    value = '-' + value;
                }
                return value;
            } catch (e) {
            }
            return null;
        };
        wijNumberFormat.prototype.tryParseValue = function (value) {
            value = this.stripValue(value);
            if(value === null) {
                return 0;
            }
            var result;
            try  {
                result = parseFloat(value);
                if(isNaN(result)) {
                    result = 0;
                }
            } catch (e) {
                result = 0;
            }
            return result;
        };
        wijNumberFormat.prototype.deFormatValue = function (value) {
            value = this.stripValue(value);
            if(value === null) {
                return;
            }
            this._currentValueInString = value;
            this._currentText = this.formatValue(value);
        };
        wijNumberFormat.prototype.formatValue = function (value) {
            value = '' + value + '';
            var nf = this.culture.numberFormat, dp = this.digitsPlaces, groupSep = ' ', decimalSep = '.', decimals = 2, isNegative = this.isNegtive(value), groupSizes = new Array(3), pattern, digitsString;
            groupSizes.push(3);
            pattern = 'n';
            switch(this.type) {
                case 'numeric':
                    pattern = isNegative ? nf.pattern[0] : 'n';
                    groupSep = nf[','];
                    decimalSep = nf['.'];
                    decimals = nf.decimals;
                    groupSizes = nf.groupSizes;
                    break;
                case 'percent':
                    pattern = nf.percent.pattern[isNegative ? 0 : 1];
                    groupSep = nf.percent[','];
                    decimalSep = nf.percent['.'];
                    decimals = nf.percent.decimals;
                    groupSizes = nf.percent.groupSizes;
                    break;
                case 'currency':
                    pattern = nf.currency.pattern[isNegative ? 0 : 1];
                    groupSep = nf.currency[','];
                    decimalSep = nf.currency['.'];
                    decimals = nf.currency.decimals;
                    groupSizes = nf.currency.groupSizes;
                    break;
            }
            if(dp !== -2) {
                decimals = dp;
            }
            if(!this.showGroup) {
                groupSizes = [
                    0
                ];
            }
            value = value.replace(new RegExp('^[0]+'), '');
            digitsString = this.formatDigit(value, groupSep, decimalSep, decimals, groupSizes);
            digitsString = digitsString.replace(new RegExp('^[0]+'), '');
            if(digitsString.indexOf(decimalSep) === 0) {
                digitsString = '0' + digitsString;
            }
            if(digitsString === '') {
                digitsString = '0';
            }
            this._currentValueInString = value;
            this._currentText = this.applyFormatPattern(pattern, digitsString, nf.percent.symbol, nf.currency.symbol);
            return this._currentText;
        };
        wijNumberFormat.prototype.getFormattedValue = function () {
            return this.formatValue(this._currentValueInString);
        };
        wijNumberFormat.prototype.getJSFloatValue = function () {
            try  {
                if(this._currentValueInString === '') {
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
        };
        wijNumberFormat.prototype._setValueFromJSFloat = function (v) {
            try  {
                this._currentValueInString = '' + v + '';
                this.formatValue(v);
                return true;
            } catch (e) {
                return false;
            }
        };
        wijNumberFormat.prototype.isZero = function (val) {
            if (typeof val === "undefined") { val = this._currentValueInString; }
            try  {
                var test = val.replace('-', ''), dbl;
                test = test.replace('(', '');
                test = test.replace(')', '');
                if(!test.length) {
                    test = '0';
                }
                dbl = parseFloat(test);
                if(!isNaN(dbl) && !dbl) {
                    return true;
                }
            } catch (e) {
            }
            return false;
        };
        wijNumberFormat.prototype.setPositiveSign = function () {
            this._currentValueInString = this._currentValueInString.replace('-', '');
            this._currentValueInString = this._currentValueInString.replace('(', '');
            this._currentValueInString = this._currentValueInString.replace(')', '');
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
            this.formatValue(this._currentValueInString);
        };
        wijNumberFormat.prototype.parseNumber = function (strippedValue) {
            if (typeof strippedValue === "undefined") { strippedValue = this._currentValueInString; }
            var arr = strippedValue.split(".", 2);
            return {
                decimal: parseInt(arr[0], 10) || 0,
                fraction: (arr.length > 1 ? parseInt(arr[1], 10) : 0) || 0
            };
        };
        wijNumberFormat.prototype._change = function (delta) {
            var num = this.parseNumber();
            this._currentValueInString = "" + (num.decimal + delta) + "." + num.fraction;
        };
        wijNumberFormat.prototype.increment = function (val) {
            if (typeof val === "undefined") { val = 1; }
            this._change(val);
        };
        wijNumberFormat.prototype.decrement = function (val) {
            if (typeof val === "undefined") { val = 1; }
            this._change(-val);
        };
        wijNumberFormat.prototype.checkDigitsLimits = function (aDigitsCount) {
            try  {
                var arr = this._currentValueInString.split("."), s, d, i, ch;
                if(!arr.length || (arr.length === 1 && arr[0] === '')) {
                    return;
                }
                s = '';
                if(arr.length > 1) {
                    s = arr[1];
                }
                d = '';
                for(i = 0; i < aDigitsCount; i++) {
                    ch = '0';
                    if(s.length > i) {
                        ch = s.charAt(i);
                    }
                    d = d + ch;
                }
                if(d.length > 0) {
                    this._currentValueInString = arr[0] + "." + d;
                } else {
                    this._currentValueInString = arr[0];
                }
            } catch (e) {
            }
        };
        wijNumberFormat.prototype.checkMinValue = function (val, chkAndRepair, chkIsLessOrEqMin) {
            if (typeof chkIsLessOrEqMin === "undefined") { chkIsLessOrEqMin = false; }
            var result = true, arr, s1, s2, sv1, sv2;
            try  {
                arr = this._currentValueInString.split(".");
                s1 = parseFloat((arr[0] === '' || arr[0] === '-') ? '0' : arr[0]);
                s2 = 0;
                if(arr.length > 1 && parseFloat(arr[1]) > 0) {
                    s2 = parseFloat('1.' + arr[1]);
                }
                if(s1 < 0 || arr[0] === '-') {
                    s2 = s2 * -1;
                }
                val = '' + val + '';
                arr = val.split(".");
                sv1 = parseFloat(arr[0]);
                sv2 = 0;
                if(arr.length > 1 && parseFloat(arr[1]) > 0) {
                    sv2 = parseFloat('1.' + arr[1]);
                }
                if(s1 > sv1) {
                    return true;
                }
                if(s1 < sv1 || (chkIsLessOrEqMin && s1 === sv1 && s2 <= sv2)) {
                    result = false;
                } else if(s1 === sv1 && s1 < 0 && s2 > sv2) {
                    result = false;
                } else if(s1 === sv1 && s1 >= 0 && s2 < sv2) {
                    result = false;
                }
                if(!result && chkAndRepair) {
                    this._currentValueInString = '' + val + '';
                }
            } catch (e) {
            }
            return result;
        };
        wijNumberFormat.prototype.checkMaxValue = function (val, chkAndRepair) {
            var result = true, arr, s1, s2, sv1, sv2;
            try  {
                arr = this._currentValueInString.split(".");
                s1 = parseFloat((arr[0] === '' || arr[0] === '-') ? '0' : arr[0]);
                s2 = 0;
                if(arr.length > 1 && parseFloat(arr[1]) > 0) {
                    s2 = parseFloat('1.' + arr[1]);
                }
                if(s1 < 0 || arr[0] === '-') {
                    s2 = s2 * -1;
                }
                val = '' + val + '';
                arr = val.split(".");
                sv1 = parseFloat(arr[0]);
                sv2 = 0;
                if(arr.length > 1 && parseFloat(arr[1]) > 0) {
                    sv2 = parseFloat('1.' + arr[1]);
                }
                if(s1 < sv1) {
                    return true;
                }
                if(s1 > sv1) {
                    result = false;
                }
                if(s1 === sv1 && s1 >= 0 && s2 > sv2) {
                    result = false;
                }
                if(s1 === sv1 && s1 < 0 && s2 < sv2) {
                    result = false;
                }
                if(!result && chkAndRepair) {
                    this._currentValueInString = '' + val + '';
                }
            } catch (e) {
            }
            return result;
        };
        wijNumberFormat.prototype.applyFormatPattern = function (pattern, digitString, percentSymbol, currencySymbol) {
            var result = pattern, r = new RegExp('[n]', 'g');
            result = result.replace(r, digitString);
            r = new RegExp('[%]', 'g');
            result = result.replace(r, percentSymbol);
            r = new RegExp('[$]', 'g');
            result = result.replace(r, currencySymbol);
            return result;
        };
        wijNumberFormat.prototype.formatDigit = function (value, groupSep, decimalSep, decimals, groupSizes) {
            var absValue = '' + value + '', decimalPos, result, groupSizeIndex, groupCount, ch, i;
            absValue = absValue.replace('-', '');
            absValue = absValue.replace('(', '');
            absValue = absValue.replace(')', '');
            decimalPos = absValue.indexOf(decimalSep);
            if(decimalPos === -1) {
                decimalPos = absValue.indexOf('.');
            }
            if(decimalPos === -1) {
                decimalPos = absValue.indexOf(',');
            }
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
})(wijmo || (wijmo = {}));
