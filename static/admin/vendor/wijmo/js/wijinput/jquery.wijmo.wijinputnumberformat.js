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
var wijmo;
(function (wijmo) {
    /// <reference path="../External/declarations/jquery.d.ts"/>
    /// <reference path="../External/declarations/globalize.d.ts"/>
    /// <reference path="../wijutil/jquery.wijmo.wijutil.ts"/>
    /*
    * Depends:
    *	jquery-1.9.1.js
    *	globalize.js
    *  jquery.wijmo.wijutil.js
    *
    */
    (function (input) {
        "use strict";
        //============================
        var wijNumberFormat = (function () {
            //_cultureObj;
            //_positivePrefix: string;
            //_positiveSuffix: string;
            //_negativePrefix: string;
            //_negativeSuffix: string;
            function wijNumberFormat() {
                // stripped value with en-US culture
                this._currentValueInString = '0';
                this._currentText = '0';
                this._strippedText = '0';
                this._groupSeparator = ' ';
                /*public inputWidget: IWijinputNumber*/             }
            wijNumberFormat.prototype._isNegtive = function (value) {
                return value.indexOf('-') !== -1 || value.indexOf('(') !== -1;
            };
            wijNumberFormat.prototype._stripValue = function (value, cultureObj, options) {
                var nf = cultureObj.numberFormat, specificFormat = nf[options.type] || nf, isNegative = this._isNegtive(value), groupSep = //this.isNegative(),
                specificFormat[','], decimalSep = specificFormat['.'], stripRgx = new RegExp('[' + groupSep + nf.percent.symbol + options.currencySymbol + ' ]', 'g'), match;
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
            wijNumberFormat.prototype.tryParseValue = function (value, cultureObj, options) {
                try  {
                    var result = parseFloat(this._stripValue(value, cultureObj, options));
                    if(isNaN(result)) {
                        result = null;
                    }
                    return result;
                } catch (e) {
                    return null;
                }
            };
            wijNumberFormat.prototype.deFormatValue = function (value, cultureObj, positivePrefix, positiveSuffix, negativePrefix, negativeSuffix, options) {
                value = this._stripValue(value, cultureObj, options);
                this._currentValueInString = value;
                this._currentText = this._formatValue(value, cultureObj, positivePrefix, positiveSuffix, negativePrefix, negativeSuffix, options);
            };
            wijNumberFormat.prototype._formatValue = function (strippedValue, cultureObj, positivePrefix, positiveSuffix, negativePrefix, negativeSuffix, options) {
                var ops = options;
                var nf = cultureObj.numberFormat, specificFormat = nf[ops.type] || nf, dp = ops.decimalPlaces, groupSep = // isNegative = this.isNegative(), //this.isNegtive(strippedValue),
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
                var prefix = this.isNegative() ? negativePrefix : positivePrefix;
                var suffix = this.isNegative() ? negativeSuffix : positiveSuffix;
                this._currentText = prefix + digitsString + suffix;
                return this._currentText;
            };
            wijNumberFormat.prototype._showNullText = function (options) {
                return !!options.nullText || options.nullText === "";
            };
            wijNumberFormat.prototype.getFormattedValue = function (initialValue, isValueNull, cultureObj, positivePrefix, positiveSuffix, negativePrefix, negativeSuffix, options) {
                //var prefix = this.inputWidget._getPrefix(),
                //    suffix = this.inputWidget._getSuffix();
                //return prefix + this._removeNegativeSign(this.formatValue(this._currentValueInString)) + suffix;
                if(!this._showNullText(options) && isValueNull) {
                    this._currentValueInString = initialValue + '';
                }
                return this._formatValue(this._currentValueInString, cultureObj, positivePrefix, positiveSuffix, negativePrefix, negativeSuffix, options);
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
            wijNumberFormat.prototype.setValueFromJSFloat = function (value, cultureObj, positivePrefix, positiveSuffix, negativePrefix, negativeSuffix, options) {
                var strValue = value.toFixed(options.decimalPlaces + 1);
                try  {
                    this._currentValueInString = strValue;
                    this._formatValue(strValue, cultureObj, positivePrefix, positiveSuffix, negativePrefix, negativeSuffix, options);
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
            wijNumberFormat.prototype.invertSign = function (cultureObj, positivePrefix, positiveSuffix, negativePrefix, negativeSuffix, options) {
                var isNegative = this.isNegative();
                if(isNegative) {
                    this.setPositiveSign();
                } else {
                    this._currentValueInString = (!this._currentValueInString.length) ? '0' : '-' + this._currentValueInString;
                }
                if(this.isZero()) {
                    this._currentValueInString = isNegative ? '0' : '-0';
                }
                this._formatValue(this._currentValueInString, cultureObj, positivePrefix, positiveSuffix, negativePrefix, negativeSuffix, options);
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
        //#region format library
        var _format;
        function numberFormatter(num, type, options) {
            if(!_format) {
                _format = new wijmo.input.wijNumberFormat();
            }
            if(!type) {
                type = 'numeric';
            }
            if(!options) {
                if(typeof type === "string") {
                    //$.wijinput.format(12345, 'percent');
                    options = {
                    };
                } else {
                    //$.wijinput.format(12345, {positivePrefix: 'pp'});
                    options = type;
                }
            }
            if(_format._showNullText(options) && num === null) {
                return options.nullText;
            }
            if(num === null || num === undefined) {
                return "";
            }
            _format._currentValueInString = num.toString();
            var cultureObj = Globalize.findClosestCulture(options.culture);
            options.type = options.type || type;
            options.showGroup = options.showGroup || false;
            if(typeof options.decimalPlaces !== 'number') {
                options.decimalPlaces = 2;
            }
            _updateCultureRelatedOptions(cultureObj, options);
            return _format.getFormattedValue(0, false, cultureObj, options.positivePrefix, options.positiveSuffix, options.negativePrefix, options.negativeSuffix, options);
        }
        function _updateCultureRelatedOptions(cultureObj, options) {
            var numberFormat = cultureObj.numberFormat, specificFormat = numberFormat[options.type] || numberFormat, negPattern = specificFormat.pattern[0], posPattern = specificFormat.pattern[1] || 'n';
            var negSplitArray = negPattern.split('n'), posSplitArray = posPattern.split('n'), percentSymbol = numberFormat.percent.symbol;
            if(options.currencySymbol === undefined) {
                options.currencySymbol = numberFormat.currency.symbol;
            }
            options.negativePrefix = (options.negativePrefix ? options.negativePrefix : negSplitArray[0]).replace(/%/g, percentSymbol).replace(/\$/g, options.currencySymbol);
            options.negativeSuffix = (options.negativeSuffix ? options.negativeSuffix : negSplitArray[1]).replace(/%/g, percentSymbol).replace(/\$/g, options.currencySymbol);
            options.positivePrefix = (options.positivePrefix ? options.positivePrefix : posSplitArray[0]).replace(/%/g, percentSymbol).replace(/\$/g, options.currencySymbol);
            options.positiveSuffix = (options.positiveSuffix ? options.positiveSuffix : posSplitArray[1]).replace(/%/g, percentSymbol).replace(/\$/g, options.currencySymbol);
        }
        var $ = jQuery;
        $.wijinputcore = $.wijinputcore || {
        };
        $.wijinputcore.formatnumber = $.wijinputcore.formatnumber || numberFormatter;
        //#endregion
        //#region parse library
        function numberParser(value, culture) {
            var cultureObj = Globalize.findClosestCulture(culture);
            var nf = cultureObj.numberFormat, cf = nf.currency, pf = nf.percent;
            var np = nf.pattern, cp = cf.pattern, pp = pf.pattern;
            var strippedValue;
            var cRegs = [];
            for(var i in cp) {
                var reg = new RegExp(cp[i].replace(/n/g, '\\d*\\.?\\d+'));
                cRegs.push(reg);
            }
            for(var i in cRegs) {
                var currencyValue = value.replace(new RegExp(cf[','], 'g'), '');
                strippedValue = currencyValue.match(cRegs[i]);
                if(strippedValue) {
                    return Globalize.parseFloat(strippedValue[0], culture);
                }
            }
            var pRegs = [];
            for(var i in pp) {
                var reg = new RegExp(pp[i].replace(/n/g, '\\d*\\.?\\d+'));
                pRegs.push(reg);
            }
            for(var i in pRegs) {
                var percentValue = value.replace(new RegExp(pf[','], 'g'), '');
                strippedValue = percentValue.match(pRegs[i]);
                if(strippedValue) {
                    return Globalize.parseFloat(strippedValue[0], culture) / 100;
                }
            }
            var nRegs = [];
            for(var i in np) {
                var reg = new RegExp(np[i].replace(/n/g, '\\d*\\.?\\d+'));
                nRegs.push(reg);
            }
            var numberValue = value.replace(new RegExp(nf[','], 'g'), '');
            for(var i in nRegs) {
                strippedValue = numberValue.match(nRegs[i]);
                if(strippedValue) {
                    return Globalize.parseFloat(strippedValue[0], culture);
                }
            }
            strippedValue = numberValue.match(/\d*\.?\d+/);
            if(strippedValue) {
                return Globalize.parseFloat(strippedValue[0], culture);
            }
            return Globalize.parseFloat(value, culture);
        }
        $.wijinputcore.parseNumber = $.wijinputcore.parseNumber || numberParser;
        //#endregion
        //#region validate library
        function numberValidator(value, minValue, maxValue, culture) {
            var numberValue = numberParser(value, culture);
            return numberValue >= minValue && numberValue <= maxValue;
        }
        $.wijinputcore.validateNumber = $.wijinputcore.validateNumber || numberValidator;
        //#endregion
            })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
