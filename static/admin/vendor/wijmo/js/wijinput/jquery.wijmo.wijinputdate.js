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
    /// <reference path="../wijcalendar/jquery.wijmo.wijcalendar.ts"/>
    /*globals  wijDateTextProvider wijinputcore wijInputResult window document Globalize jQuery*/
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
    *	jquery.wijmo.wijcalendar.js
    *	jquery.wijmo.wijinputcore.js
    *
    */
    (function (input) {
        "use strict";
        var $ = jQuery, jqKeyCode = wijmo.getKeyCodeEnum();
        //	var wijdigits = {
        //		useDefault: -2,
        //		asIs: -1,
        //		zero: 0,
        //		one: 1,
        //		two: 2,
        //		three: 3,
        //		four: 4,
        //		five: 5,
        //		six: 6,
        //		seven: 7,
        //		eight: 8
        //	}
        function paddingZero(val, aCount) {
            if (typeof aCount === "undefined") { aCount = 2; }
            var text = '' + val + '';
            if(text.length > aCount) {
                text = text.substr(text.length - aCount);
            } else {
                while(text.length < aCount) {
                    text = '0' + text;
                }
            }
            return text;
        }
        /** @widget */ var wijinputdate = (function (_super) {
            __extends(wijinputdate, _super);
            function wijinputdate() {
                _super.apply(this, arguments);

            }
            wijinputdate.prototype._createTextProvider = function () {
                this._textProvider = new wijDateTextProvider(this, this.options.dateFormat, this.options.displayFormat);
            };
            wijinputdate.prototype._strToDate = function (str) {
                return this._textProvider.parseDate(str);
            };
            wijinputdate.prototype._beginUpdate = function () {
                var strDate, date = null;
                _super.prototype._beginUpdate.call(this);
                if(this.options.minDate) {
                    if(typeof this.options.minDate === 'string') {
                        this.options.minDate = this._strToDate(this.options.minDate);
                    }
                }
                if(this.options.maxDate) {
                    if(typeof this.options.maxDate === 'string') {
                        this.options.maxDate = this._strToDate(this.options.maxDate);
                    }
                }
                if(this.options.date === undefined) {
                    if(!!this.element.data('elementValue')) {
                        strDate = this.element.data('elementValue');
                    }
                } else {
                    if(typeof this.options.date === 'string') {
                        strDate = this.options.date;
                    } else {
                        date = this.options.date;
                    }
                }
                if(this.options.date === undefined) {
                    this.options.date = new Date();
                }
                if(strDate) {
                    date = this._strToDate(strDate);
                }
                if(date == null) {
                    date = this.options.date;
                }
                this._safeSetDate(date);
                var culture = this._getCulture();
                if(culture != null) {
                    if(this.options.amDesignator == "") {
                        this.options.amDesignator = this._getStandardAMPM("AM");
                    }
                    if(this.options.pmDesignator == "") {
                        this.options.pmDesignator = this._getStandardAMPM("PM");
                    }
                }
                this.element.data({
                    defaultDate: date === null ? date : new Date(this.options.date.getTime()),
                    preDate: date === null ? date : new Date(this.options.date.getTime())
                });
                this._resetTimeStamp();
                this._initPicker();
                this.element.addClass(this.options.wijCSS.wijinputdate).attr({
                    'aria-valuemin': new Date(1900, 1, 1),
                    'aria-valuemax': new Date(2099, 1, 1),
                    'aria-valuenow': this.options.date
                });
            };
            wijinputdate.prototype._endUpdate = function () {
                var _this = this;
                _super.prototype._endUpdate.call(this);
                this.element.bind("click.wijinput", function () {
                    if(!_this._allowEdit()) {
                        return;
                    }
                    var oldActiveField = _this.options.activeField;
                    var range = _this.element.wijtextselection();
                    _this._updateText();
                    _this.element.wijtextselection(range);
                    _this._highLightCursor();
                    if(input.Utility.chrome) {
                        if(_this.element.data('needResoteActiveField') == true) {
                            _this._setOption('activeField', oldActiveField);
                        }
                    }
                });
            };
            wijinputdate.prototype._getInnerNullText = function () {
                if(this.options.placeholder != null) {
                    return this.options.placeholder;
                }
                if(this.options.showNullText) {
                    return this.options.nullText;
                }
                return null;
            };
            wijinputdate.prototype._getInnerAmDesignator = function () {
                return this.options.amDesignator == "" ? this._getStandardAMPM("AM") : this.options.amDesignator;
            };
            wijinputdate.prototype._getInnerPmDesignator = function () {
                return this.options.pmDesignator == "" ? this._getStandardAMPM("PM") : this.options.pmDesignator;
            };
            wijinputdate.prototype._getAllowSpinLoop = function () {
                return !!this.options.allowSpinLoop;
            };
            wijinputdate.prototype._getRealMaxDate = function () {
                return this.options.maxDate ? this.options.maxDate : new Date(9999, 11, 31, 23, 59, 59);
            };
            wijinputdate.prototype._getRealMinDate = function () {
                if(this.options.minDate) {
                    return this.options.minDate;
                }
                var minDate = new Date(1, 0, 1, 0, 0, 0);
                minDate.setFullYear(1);
                return minDate;
            };
            wijinputdate.prototype._getRealEraMaxDate = function () {
                if(this.options.maxDate) {
                    return DateTimeInfo.GetEraMax() < this.options.maxDate ? DateTimeInfo.GetEraMax() : this.options.maxDate;
                }
                return DateTimeInfo.GetEraMax();
            };
            wijinputdate.prototype._getRealEraMinDate = function () {
                if(this.options.minDate) {
                    return DateTimeInfo.GetEraMin() > this.options.minDate ? DateTimeInfo.GetEraMin() : this.options.minDate;
                }
                return DateTimeInfo.GetEraMin();
            };
            wijinputdate.prototype._isEraFormatExist = function () {
                return this._textProvider._isEraFormatExist();
            };
            wijinputdate.prototype._checkDate = function () {
                var oldDate = this.options.date;
                var newDate = this._checkRange(this.options.date);
                if(!DateTimeInfo.Equal(oldDate, newDate)) {
                    this._setOption("date", newDate);
                    this._trigger('valueBoundsExceeded', null);
                }
            };
            wijinputdate.prototype._checkRange = function (date) {
                if(date) {
                    if(this.options.minDate && date < this.options.minDate) {
                        date = new Date(Math.max(this.options.minDate, date));
                    }
                    if(this.options.maxDate && date > this.options.maxDate) {
                        date = new Date(Math.min(this.options.maxDate, date));
                    }
                }
                return date;
            };
            wijinputdate.prototype._safeSetDate = function (date, ignoreCheckRange) {
                var cache = date;
                if(!ignoreCheckRange) {
                    date = this._checkRange(date);
                }
                if(isNaN(date)) {
                    date = cache;
                }
                this.options.date = date;
                return true;
            };
            wijinputdate.prototype._safeGetDate = function (ignoreCheckRange) {
                var date = this.options.date;
                if(date == null) {
                    date = new Date();
                }
                if(!ignoreCheckRange) {
                    date = this._checkRange(date);
                }
                return date;
            };
            wijinputdate.prototype._setOption = function (key, value) {
                if(key == 'showTrigger') {
                    this._setOption("showDropDownButton", value);
                    return;
                }
                _super.prototype._setOption.call(this, key, value);
                switch(key) {
                    case 'pickers':
                        this._reInitPicker();
                        break;
                    case 'minDate':
                    case 'maxDate':
                        if(typeof this.options[key] === 'string') {
                            this.options[key] = this._strToDate(value);
                        }
                        var date = this.options.date;
                        if(date === null) {
                            date = new Date();
                        }
                        var minDate = this._getRealMinDate();
                        var maxDate = this._getRealMaxDate();
                        if(date < minDate || date > maxDate) {
                            this._safeSetDate(date);
                        }
                        this._updateText();
                        this._highLightField();
                        break;
                    case 'date':
                        if(!!value) {
                            if(typeof value === "string") {
                                value = this._strToDate(value);
                            } else if(typeof value === "object") {
                                value = new Date(value.getTime());
                            } else {
                                value = new Date(value);
                            }
                            if(isNaN(value)) {
                                value = new Date();
                            }
                        }
                        this._safeSetDate(value);
                        this._updateText();
                        this._highLightField();
                        break;
                    case 'midnightAs0':
                    case 'hour12As0':
                    case 'amDesignator':
                    case 'pmDesignator':
                        this._updateText();
                        this._highLightField();
                        break;
                    case 'culture':
                        this._textProvider._setFormat(this.options.dateFormat);
                        var displayFormat = this.options.displayFormat == "" ? this.options.dateFormat : this.options.displayFormat;
                        this._textProvider._setDisplayFormat(displayFormat);
                        this.options.amDesignator = this._getStandardAMPM("AM");
                        this.options.pmDesignator = this._getStandardAMPM("PM");
                        this._updateText();
                        var calendar = this.element.data('calendar');
                        if(calendar) {
                            calendar.wijcalendar("option", key, value);
                        }
                        this._reInitPicker();
                        break;
                    case 'dateFormat':
                        this._textProvider._setFormat(this.options.dateFormat);
                        if(this.options.displayFormat == "") {
                            this._textProvider._setDisplayFormat(this.options.dateFormat);
                        }
                        if(this._isEraFormatExist() && this.options.date != null) {
                            var minYear = this._getRealEraMinDate();
                            var maxYear = this._getRealEraMaxDate();
                            if(this.options.date < minYear) {
                                this._setOption("date", minYear);
                            } else if(this.options.date > maxYear) {
                                this._setOption("date", maxYear);
                            }
                        }
                        this._updateText();
                        // update the calendar 's culture
                        var calendar = this.element.data('calendar');
                        if(calendar) {
                            calendar.wijcalendar("option", key, value);
                        }
                        this._reInitPicker();
                        break;
                    case 'displayFormat':
                        var displayFormat = this.options.displayFormat == "" ? this.options.dateFormat : this.options.displayFormat;
                        this._textProvider._setDisplayFormat(displayFormat);
                        this._updateText();
                        break;
                    case 'activeField':
                        value = Math.min(value, this._textProvider.getFieldCount() - 1);
                        value = Math.max(value, 0);
                        this.options.activeField = value;
                        this._checkDate();
                        this._highLightField();
                        this._resetTimeStamp();
                        break;
                        //add for localization(calendar's tooltip)
                                            case 'nextTooltip':
                    case 'prevTooltip':
                    case 'titleFormat':
                    case 'toolTipFormat':
                        // update the calendar 's tooltip
                        var calendar = this.element.data('calendar', calendar);
                        if(calendar) {
                            calendar.wijcalendar("option", key, value);
                        }
                        break;
                    case "comboItems":
                        this._reInitPicker();
                        break;
                }
            };
            wijinputdate.prototype._setData = function (val) {
                this.option('date', val);
            };
            wijinputdate.prototype._resetData = function () {
                var d = this.element.data('defaultDate');
                if(d === undefined || d === null) {
                    d = this.element.data('elementValue');
                    if(d !== undefined && d !== null && d !== "") {
                        this.setText(d);
                    } else {
                        this._setData(null);
                    }
                } else {
                    this._setData(d);
                }
            };
            wijinputdate.prototype._resetTimeStamp = function () {
                this.element.data('cursorPos', 0);
                this.element.data('timeStamp', new Date('1900/1/1'));
                this.element.data("lastInputChar", "");
            };
            wijinputdate.prototype.getPostValue = /** Gets the text value when the container form is posted back to server.
            */
            function () {
                if(!this._isInitialized()) {
                    return this.element.val();
                }
                if(_super.prototype._showNullText.call(this) && this.isDateNull()) {
                    return "";
                }
                var val = this._textProvider.toString();
                if(val === this.options.nullText) {
                    return "";
                }
                return val;
            };
            wijinputdate.prototype._highLightField = function (index) {
                if (typeof index === "undefined") { index = this.options.activeField; }
                if(this.isFocused()) {
                    var range = this._textProvider.getFieldRange(index);
                    if(range) {
                        this.element.wijtextselection(range);
                    }
                }
            };
            wijinputdate.prototype._highLightCursor = function (pos) {
                if(this._isNullText()) {
                    return;
                }
                if(pos === undefined) {
                    pos = Math.max(0, this.element.wijtextselection().start);
                }
                var index = this._textProvider.getCursorField(pos);
                if(index < 0) {
                    return;
                }
                this._setOption('activeField', index);
            };
            wijinputdate.prototype._toNextField = function () {
                this._setOption('activeField', this.options.activeField + 1);
            };
            wijinputdate.prototype._toPrevField = function () {
                this._setOption('activeField', this.options.activeField - 1);
            };
            wijinputdate.prototype._toFirstField = function () {
                this._setOption('activeField', 0);
            };
            wijinputdate.prototype._toLastField = function () {
                this._setOption('activeField', this._textProvider.getFieldCount());
            };
            wijinputdate.prototype._clearField = function (index) {
                if (typeof index === "undefined") { index = this.options.activeField; }
                var range = this._textProvider.getFieldRange(index), rh, self = this;
                if(range) {
                    rh = new input.wijInputResult();
                    this._textProvider.removeAt(range.start, range.end, rh);
                    this._updateText();
                    window.setTimeout(function () {
                        self._highLightField();
                    }, 1);
                }
            };
            wijinputdate.prototype.spinUp = /** Performs spin up by the specified field and increment value.
            */
            function () {
                this._doSpin(true, false);
            };
            wijinputdate.prototype.spinDown = /** Performs spin down by the specified field and increment value.
            */
            function () {
                this._doSpin(false, false);
            };
            wijinputdate.prototype.drop = /** Open the dropdown window.
            */
            function () {
                _super.prototype._onTriggerClicked.call(this);
            };
            wijinputdate.prototype.focus = /** Set the focus to the widget.
            */
            function () {
                _super.prototype.focus.call(this);
                this._addState('focus', this.outerDiv);
                this._updateText();
                this._highLightField();
            };
            wijinputdate.prototype.isDateNull = /** Determines whether the date is a null value.
            */
            function () {
                return this.options.date === null || this.options.date === undefined;
            };
            wijinputdate.prototype._min = function (value1, value2) {
                if(value2 == undefined) {
                    return value1;
                }
                return value1 < value2 ? value1 : value2;
            };
            wijinputdate.prototype._max = function (value1, value2) {
                if(value2 == undefined) {
                    return value1;
                }
                return value1 > value2 ? value1 : value2;
            };
            wijinputdate.prototype._allowEdit = function () {
                return !this.option('disableUserInput');
            };
            wijinputdate.prototype._onFocus = function (e) {
                _super.prototype._onFocus.call(this, e);
                if(!this._allowEdit()) {
                    return;
                }
                this._updateText();
                this._highLightField();
                if(input.Utility.chrome) {
                    var self = this;
                    self.element.data('needResoteActiveField', true);
                    window.setTimeout(function () {
                        self.element.data('needResoteActiveField', false);
                    }, 200);
                }
            };
            wijinputdate.prototype._simulate = function (text) {
                var str = null;
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
                for(var era = 0; era < DateTimeInfo.GetEraCount(); era++) {
                    if((str.toLowerCase() === DateTimeInfo.GetEraShortNames()[era].toLowerCase()) || (str.toLowerCase() === DateTimeInfo.GetEraAbbreviations()[era].toLowerCase()) || (str.toLowerCase() === DateTimeInfo.GetEraSymbols()[era].toLowerCase()) || (str.toLowerCase() === DateTimeInfo.GetEraNames()[era].toLowerCase())) {
                        str = DateTimeInfo.GetEraShortNames()[era].toLowerCase();
                        break;
                    }
                }
                _super.prototype._simulate.call(this, str);
            };
            wijinputdate.prototype._doSpin = function (up, repeating) {
                var _this = this;
                if(!this._allowEdit()) {
                    return false;
                }
                if(repeating && this.element.data('breakSpinner')) {
                    return false;
                }
                if(up) {
                    this._trigger('spinUp', null);
                } else {
                    this._trigger('spinDown', null);
                }
                if(this.options.date == null) {
                    this._setDefaultDate(up);
                    return;
                }
                if(this._textProvider[up ? 'incEnumPart' : 'decEnumPart']()) {
                    this._updateText();
                    this._highLightField();
                }
                if(repeating && !this.element.data('breakSpinner')) {
                    var spinTimer = window.setTimeout(function () {
                        return _this._doSpin(up, true);
                    }, this._calcSpinInterval());
                    this.element.data("spintimer", spinTimer);
                }
                return true;
            };
            wijinputdate.prototype._setDefaultDate = function (up) {
                if(up) {
                    this.options.date = this._isEraFormatExist() ? this._getRealEraMinDate() : this._getRealMinDate();
                } else {
                    this.options.date = this._isEraFormatExist() ? this._getRealEraMaxDate() : this._getRealMaxDate();
                }
                this._updateText();
                this._highLightField();
            };
            wijinputdate.prototype._onChange = function () {
            };
            wijinputdate.prototype._afterFocused = function () {
                if(this._isNullText()) {
                    this._doFocus();
                }
                //var hc = () => {
                //	this._highLightCursor();
                //	this._resetTimeStamp();
                //};
                // to fixed the issue 27522. remove this time out. by dail 2012-9-6
                //window.setTimeout(hc, 10);
                            };
            wijinputdate.prototype._onBlur = function (e) {
                _super.prototype._onBlur.call(this, e);
                this._checkDate();
            };
            wijinputdate.prototype._keyDownPreview = function (e) {
                if(_super.prototype._keyDownPreview.call(this, e)) {
                    return true;
                }
                var key = e.keyCode || e.which, selRange;
                switch(key) {
                    case jqKeyCode.UP:
                    case jqKeyCode.DOWN:
                        if(e.altKey) {
                            this._onTriggerClicked();
                            return true;
                        } else {
                            if(this.element.data("pickerCurrentTab") != "List") {
                                this._doSpin(key == jqKeyCode.UP, false);
                                this._stopEvent(e);
                                return true;
                            }
                        }
                        break;
                    case jqKeyCode.LEFT:
                        if(this.options.activeField == 0 && (this.options.blurOnLeftRightKey.toLowerCase() == "left" || this.options.blurOnLeftRightKey.toLowerCase() == "both")) {
                            input.Utility.MoveFocus(this.element.get(0), false);
                        } else {
                            this._toPrevField();
                        }
                        return true;
                    case jqKeyCode.RIGHT:
                        if(this.options.activeField == this._textProvider.getFieldCount() - 1 && (this.options.blurOnLeftRightKey.toLowerCase() == "right" || this.options.blurOnLeftRightKey.toLowerCase() == "both")) {
                            input.Utility.MoveFocus(this.element.get(0), true);
                        } else {
                            this._toNextField();
                        }
                        return true;
                    case jqKeyCode.ENTER:
                        if(this._wasPopupShowing) {
                            if(this.element.data("pickerCurrentTab") == "Calendar") {
                                if(this.options.date == null) {
                                    this._setOption('date', new Date());
                                }
                            } else if(this.element.data("pickerCurrentTab") == "List") {
                                this._processKeyForDropDownList(e);
                            } else {
                                this._okButtonMouseDown(null, null);
                            }
                            this._hidePopup();
                            return true;
                        } else {
                            if(this.options.hideEnter) {
                                _super.prototype._stopEvent.call(this, e);
                            }
                        }
                        break;
                    case jqKeyCode.TAB:
                        if(this.options.tabAction !== "field") {
                            break;
                        }
                        selRange = this.element.wijtextselection();
                        if(selRange && selRange.end - selRange.start !== this.element.val().length) {
                            if(e.shiftKey) {
                                if(this.options.activeField > 0) {
                                    this._toPrevField();
                                } else {
                                    break;
                                }
                            } else {
                                if(this.options.activeField < this._textProvider.getFieldCount() - 1) {
                                    this._toNextField();
                                } else {
                                    break;
                                }
                            }
                        }
                        return true;
                    case jqKeyCode.SPACE:
                    case 188:
                        // ,
                                            case 190:
                        // .
                                            case 110:
                        // . on pad
                                            case 191:
                        // /
                        if(e.shiftKey) {
                            if(this.options.activeField > 0) {
                                this._toPrevField();
                                return true;
                            }
                        } else {
                            if(this.options.activeField < this._textProvider.getFieldCount() - 1) {
                                this._toNextField();
                                return true;
                            }
                        }
                        break;
                    case jqKeyCode.HOME:
                        if(e.ctrlKey) {
                            this._setOption('date', new Date());
                        } else {
                            this._toFirstField();
                        }
                        return true;
                    case jqKeyCode.END:
                        if(e.ctrlKey) {
                            this._processClearButton();
                        } else {
                            this._toLastField();
                        }
                        return true;
                    case jqKeyCode.BACKSPACE:
                    case jqKeyCode.DELETE:
                        if(this._allowEdit()) {
                            this._processDeleteKey();
                            return true;
                        }
                        break;
                }
                return false;
            };
            wijinputdate.prototype._processDeleteKey = function () {
                if(this.options.date == null) {
                    return;
                }
                var selRange = this.element.wijtextselection();
                if(selRange.end - selRange.start === this.element.val().length) {
                    var minDate = this._isEraFormatExist() ? this._getRealEraMinDate() : this._getRealMinDate();
                    if(this.options.date > minDate) {
                        this._setOption('date', minDate);
                        return;
                    }
                } else {
                    var activeField = this.options.activeField;
                    var oldText = this._textProvider.getFiledText(activeField);
                    this._clearField();
                    var newText = this._textProvider.getFiledText(activeField);
                    if(oldText != newText) {
                        return;
                    }
                }
                this._processClearButton();
            };
            wijinputdate.prototype._autoMoveToNextField = function (pos, ch) {
                if(!this.options.autoNextField) {
                    return;
                }
                if(this._textProvider.needToMove(this.options.activeField, pos, ch)) {
                    this._toNextField();
                }
            };
            wijinputdate.prototype._processClearButton = function () {
                if(this._allowEdit()) {
                    this._setOption('date', null);
                } else {
                    this._updateText();
                }
            };
            wijinputdate.prototype._autoMoveToNextControl = function (pos, ch, activeField) {
                if(!this.options.blurOnLastChar || activeField !== this._textProvider.getFieldCount() - 1) {
                    return;
                }
                if(this._textProvider.needToMove(activeField, pos, ch)) {
                    input.Utility.MoveFocus(this.element.get(0), true);
                }
            };
            wijinputdate.prototype._keyPressPreview = function (e) {
                var key = e.keyCode || e.which, range, ch, fieldSep, cursor, now, newAction, lastTime, pos, ret, input, lastInput;
                if(key === jqKeyCode.ENTER) {
                    if(this.isDateNull()) {
                        this._setOption("date", new Date());
                    }
                    return false;
                }
                range = this._textProvider.getFieldRange(this.options.activeField);
                if(range) {
                    if(key === jqKeyCode.TAB) {
                        return true;
                    }
                    if(key === jqKeyCode.SPACE) {
                        this._stopEvent(e);
                        return true;
                    }
                    ch = String.fromCharCode(key);
                    fieldSep = this._textProvider.isFieldSep(ch, this.options.activeField);
                    if(fieldSep) {
                        this._toNextField();
                        this._stopEvent(e);
                        return true;
                    }
                    cursor = this.element.data('cursorPos');
                    now = new Date();
                    lastTime = this.element.data('timeStamp');
                    lastInput = this.element.data('lastInput');
                    newAction = (now.getTime() - lastTime.getTime()) > this.options.keyDelay;
                    var input = ch;
                    if(newAction) {
                        cursor = 0;
                    } else if(lastInput) {
                        input = lastInput + input;
                    }
                    this.element.data({
                        timeStamp: now,
                        lastInput: input
                    });
                    pos = range.start + cursor;
                    this.element.data('cursorPos', ++cursor);
                    var nullFlag = this.options.date == null;
                    ret = this._textProvider.addToField(input, this.options.activeField, pos);
                    if(ret) {
                        var activeField = this.options.activeField;
                        this._updateText();
                        this._autoMoveToNextField(cursor, ch);
                        this._highLightField();
                        this._autoMoveToNextControl(cursor, ch, activeField);
                    } else {
                        if(nullFlag) {
                            this._setOption("date", null);
                        }
                        this._resetTimeStamp();
                        this._fireIvalidInputEvent();
                    }
                    this.element.data("lastInputChar", ch);
                    this._stopEvent(e);
                    return true;
                }
                return false;
            };
            wijinputdate.prototype._raiseDataChanged = function () {
                var d = this.options.date, prevDt = this.element.data('preDate');
                this.element.data('preDate', !d ? null : new Date(d.getTime()));
                if((!prevDt && d) || (prevDt && !d) || (prevDt && d && (prevDt.getTime() !== d.getTime()))) {
                    if(this._popupVisible()) {
                        // DaryLuo 2013/09/04, improve performance on IE7.
                        // Sync calendar will cost a lot of time.
                        this._syncCalendar();
                    }
                    this.element.attr('aria-valuenow', d);
                    this._trigger('dateChanged', null, {
                        date: d
                    });
                }
            };
            wijinputdate.prototype._isMinDate = function (date) {
                return date.getFullYear() === 1 && date.getMonth() === 0 && date.getDate() === 1;
            };
            wijinputdate.prototype._reInitPicker = function () {
                this._destroyPicker();
                this._initPicker();
            };
            wijinputdate.prototype._destroy = function () {
                _super.prototype._destroy.call(this);
                this._destroyPicker();
            };
            wijinputdate.prototype._destroyPicker = function () {
                var tablePicker = this.element.data('pickers');
                if(tablePicker != undefined) {
                    tablePicker.remove();
                    this.element.data('pickers', null);
                    this.element.data('calendar', null);
                    this.element.data('datePicker', null);
                    this.element.data('timePicker', null);
                    this._comboDiv = undefined;
                }
            };
            wijinputdate.prototype._initPicker = function () {
                var _this = this;
                var tablePicker = this.element.data('pickers');
                if(tablePicker != undefined) {
                    return;
                }
                var self = this;
                this._initPickerData();
                var pickerCount = this._getPickerCount();
                var pickerWidth = this.element.data('pickerWidth');
                var pickerHeight = this.element.data('pickerHeight');
                var pickerAreaHeight = this.element.data('pickerAreaHeight');
                if(pickerCount > 1) {
                    pickerHeight += 8;
                    pickerAreaHeight += 8;
                }
                var pickerDivHeight = pickerCount > 1 ? pickerHeight : pickerAreaHeight;
                tablePicker = $("<table/>").appendTo(document.body).attr({
                    "class": "ui-widget-content ui-corner-all",
                    "borderWidth": "0px",
                    "cellspacing": "0px",
                    "cellpadding": "0px",
                    "cursor": "default"
                }).css({
                    "font-size": "12px"
                });
                var trPicker = $("<tr/>").appendTo(tablePicker);
                var trButton = $("<tr/>").appendTo(tablePicker);
                var tdPicker = $("<td/>").appendTo(trPicker).css({
                    "width": "100%",
                    "height": "100%"
                });
                var tdButton = $("<td/>").appendTo(trButton).attr("align", "center").css({
                    "width": "100%",
                    "height": "30px",
                    "display": "none"
                });
                var divOK = $("<input type='button'/>").appendTo(tdButton).attr({
                    "class": "ui-state-active ui-widget",
                    "value": "OK"
                }).css({
                    "width": "80px",
                    "height": "26px",
                    "margin": "1px",
                    "text-align": "center",
                    "cursor": "pointer",
                    "visibility": "hidden"
                }).mousedown(function (e, arg) {
                    self._okButtonMouseDown(e, arg);
                });
                var divPickers = $("<div/>").appendTo(tdPicker).css({
                    "width": "100%",
                    "height": "100%",
                    "padding": "0px",
                    "margin": "0px",
                    "borderWidth": "0px",
                    "overflow": "hidden"
                });
                var ulPicker = $("<ul/>").css({
                    "line-height": "1px",
                    "font-size": "12px"
                });
                if(pickerCount > 1) {
                    ulPicker.appendTo(divPickers);
                }
                var currentTab = "";
                if(this._isCalendarPickerShown()) {
                    if(pickerCount > 1) {
                        this._addPickerTab(ulPicker, "Calendar", "#calendarDiv");
                    } else {
                        if(input.Utility.IsIE9()) {
                            tdPicker.css({
                                "width": ""
                            });
                            divPickers.css({
                                "width": ""
                            });
                        }
                    }
                    this._initCalendarPicker();
                    var calendar = this.element.data('calendar');
                    this._addPickerEditor(divPickers, calendar, "calendarDiv");
                    currentTab = "Calendar";
                }
                if(this._isListPickerShown()) {
                    if(pickerCount > 1) {
                        this._addPickerTab(ulPicker, "List", "#listDiv");
                    }
                    this._initListPicker();
                    this._addPickerEditor(divPickers, this._comboDiv, "listDiv");
                    currentTab = currentTab == "" ? "List" : currentTab;
                }
                if(this._isDatePickerShown()) {
                    if(pickerCount > 1) {
                        this._addPickerTab(ulPicker, "Date", "#dateDiv");
                    }
                    this._initDatePicker();
                    var datePicker = this.element.data('datePicker');
                    this._addPickerEditor(divPickers, datePicker, "dateDiv");
                    currentTab = currentTab == "" ? "Date" : currentTab;
                }
                if(this._isTimePickerShown()) {
                    if(pickerCount > 1) {
                        this._addPickerTab(ulPicker, "Time", "#timeDiv");
                    }
                    this._initTimePicker();
                    var timePicker = this.element.data('timePicker');
                    this._addPickerEditor(divPickers, timePicker, "timeDiv");
                    currentTab = currentTab == "" ? "Time" : currentTab;
                }
                if(currentTab == "Calendar") {
                    tablePicker.css({
                        "width": pickerWidth + "px",
                        "height": ""
                    });
                } else if(currentTab == "Date" || currentTab == "Time") {
                    tdButton.css({
                        "display": ""
                    });
                    tablePicker.css({
                        "width": pickerWidth + "px",
                        "height": pickerHeight + "px"
                    });
                    divPickers.css({
                        "height": pickerDivHeight + "px"
                    });
                }
                this.element.data("pickerCurrentTab", currentTab);
                var self = this;
                divPickers.wijtabs({
                    select: function (e, arg) {
                        var tabText = arg.tab.outerText || arg.tab.text;
                        tdButton.css({
                            "display": "none"
                        });
                        self.element.data("pickerCurrentTab", tabText);
                        if(tabText == "Calendar") {
                            self.focus();
                            tablePicker.css({
                                "width": pickerWidth + "px",
                                "height": "",
                                "font-size": ""
                            });
                            divPickers.css({
                                "height": "100%"
                            });
                        } else if(tabText == "List") {
                            var listWidth = self._getListPickerWidth();
                            self._comboDiv.wijlist("option", "width", listWidth);
                            tablePicker.css({
                                "width": listWidth,
                                "height": "",
                                "font-size": ""
                            });
                            divPickers.css({
                                "height": "100%"
                            });
                            self._comboDiv.wijlist('renderList');
                            self._comboDiv.focus();
                        } else {
                            self.focus();
                            if(tabText == "Time" || tabText == "Date") {
                                tdButton.css({
                                    "display": ""
                                });
                                tablePicker.css({
                                    "width": pickerWidth + "px",
                                    "height": pickerHeight + "px",
                                    "font-size": "12px"
                                });
                                divPickers.css({
                                    "height": pickerDivHeight + "px"
                                });
                            }
                        }
                    }
                });
                tablePicker.wijpopup({
                    autoHide: true,
                    hidden: function () {
                        _this._trigger('dropDownClose');
                        _this._wasPopupShowing = false;
                    },
                    shown: function () {
                        _this._trigger('dropDownOpen');
                        _this._wasPopupShowing = true;
                    }
                });
                this.element.data('pickers', tablePicker);
                this.element.data('divPickers', divPickers);
                this.element.data('divOK', divOK);
            };
            wijinputdate.prototype._initPickerData = function () {
                var tabWidth = 70;
                var tabHeight = 32;
                var listItemHeight = 26;
                var buttonHeight = 30;
                var minPickerWidth = 150;
                var minPickerHeight = 100;
                var minCalendarPickerWidth = 235;
                var minCalendarPickerHeight = 242;
                var minDateTimePickerWidth = 220;
                var minDateTimePickerHeight = 220;
                var pickerCount = this._getPickerCount();
                var minWidth = pickerCount * tabWidth;
                var minHeight = minPickerHeight;
                minWidth = minWidth < minPickerWidth ? minPickerWidth : minWidth;
                if(this._isCalendarPickerShown()) {
                    minWidth = minWidth < minCalendarPickerWidth ? minCalendarPickerWidth : minWidth;
                    minHeight = minHeight < minCalendarPickerHeight ? minCalendarPickerHeight : minHeight;
                }
                if(this._isListPickerShown()) {
                    var listItem = this._getcomboItems();
                    if(listItem != undefined) {
                        var minListHeight = listItem.length * listItemHeight;
                        minHeight = minHeight < minListHeight ? minListHeight : minHeight;
                    }
                }
                if(this._isDatePickerShown()) {
                    minWidth = minWidth < minDateTimePickerWidth ? minDateTimePickerWidth : minWidth;
                    minHeight = minHeight < minDateTimePickerWidth ? minDateTimePickerWidth : minHeight;
                    var pickerMinYear = this._getDatePickerMinYear();
                    var pickerMaxYear = this._getDatePickerMaxYear();
                    var defaultDateFormat = this._getDefaultDatePickerFormat();
                    var pickerFormat = this.options.pickers.datePicker.format != undefined ? this.options.pickers.datePicker.format : defaultDateFormat;
                    var pickerDateFormat = pickerFormat.split(',');
                    if(pickerDateFormat.length != 3) {
                        pickerDateFormat = defaultDateFormat.split(',');
                        this.options.pickers.datePicker.format = defaultDateFormat;
                    }
                    var yearFormat = this._getRollFormat(pickerDateFormat, "y");
                    var monthFormat = this._getRollFormat(pickerDateFormat, "M");
                    var dayFormat = this._getRollFormat(pickerDateFormat, "d");
                    if(!this._isValidatePickerFormat(yearFormat) || !this._isValidatePickerFormat(monthFormat) || !this._isValidatePickerFormat(dayFormat)) {
                        pickerDateFormat = defaultDateFormat.split(',');
                        yearFormat = this._getRollFormat(pickerDateFormat, "y");
                        monthFormat = this._getRollFormat(pickerDateFormat, "M");
                        dayFormat = this._getRollFormat(pickerDateFormat, "d");
                        this.options.pickers.datePicker.format = defaultDateFormat;
                    }
                    this.element.data('pickerDateYearFormat', yearFormat);
                    this.element.data('pickerDateMonthFormat', monthFormat);
                    this.element.data('pickerDateDayFormat', dayFormat);
                    this.element.data('pickerMinYear', pickerMinYear);
                    this.element.data('pickerMaxYear', pickerMaxYear);
                    this.element.data('pickerDateFormat', pickerDateFormat);
                }
                if(this._isTimePickerShown()) {
                    minWidth = minWidth < minDateTimePickerWidth ? minDateTimePickerWidth : minWidth;
                    minHeight = minHeight < minDateTimePickerWidth ? minDateTimePickerWidth : minHeight;
                    var defaultTimeFormat = this._getDefaultTimePickerFormat();
                    var format = this.options.pickers.timePicker.format != undefined ? this.options.pickers.timePicker.format : defaultTimeFormat;
                    var pickerTimeFormat = format.split(',');
                    if(pickerTimeFormat.length != 3) {
                        pickerTimeFormat = defaultTimeFormat.split(',');
                        this.options.pickers.timePicker.format = defaultTimeFormat;
                    }
                    var hourFormat = this._getRollFormat(pickerTimeFormat, "h");
                    var minuteFormat = this._getRollFormat(pickerTimeFormat, "m");
                    var amFormat = this._getRollFormat(pickerTimeFormat, "t");
                    if(!this._isValidatePickerFormat(hourFormat) || !this._isValidatePickerFormat(minuteFormat) || !this._isValidatePickerFormat(amFormat)) {
                        pickerTimeFormat = defaultTimeFormat.split(',');
                        hourFormat = this._getRollFormat(pickerTimeFormat, "h");
                        minuteFormat = this._getRollFormat(pickerTimeFormat, "m");
                        amFormat = this._getRollFormat(pickerTimeFormat, "t");
                        this.options.pickers.timePicker.format = defaultTimeFormat;
                    }
                    this.element.data('pickerTimeHourFormat', hourFormat);
                    this.element.data('pickerTimeMinuteFormat', minuteFormat);
                    this.element.data('pickerTimeAMFormat', amFormat);
                    this.element.data('pickerTimeFormat', pickerTimeFormat);
                }
                var pickerWidth = this.options.pickers.width != undefined ? this.options.pickers.width : 0;
                var pickerHeight = this.options.pickers.height != undefined ? this.options.pickers.height : 0;
                pickerWidth = pickerWidth < minWidth ? minWidth : pickerWidth;
                pickerHeight = pickerHeight < minHeight ? minHeight : pickerHeight;
                pickerHeight -= pickerCount > 1 ? tabHeight : 0;
                var pickerAreaHeight = pickerHeight - buttonHeight;
                var itemHeight = Math.floor(pickerAreaHeight / 5) + 1;
                var indicatorHeight = itemHeight * 2;
                var indicatorTranslateTop = itemHeight * 5 + 6;
                var indicatorTranslateDown = itemHeight * 4 - 3;
                var indicatorTranslateSelector = itemHeight * 2 + 2;
                var indicatorTranslateContent = itemHeight;
                this.element.data('itemHeight', itemHeight);
                this.element.data('indicatorHeight', indicatorHeight);
                this.element.data('pickerWidth', pickerWidth);
                this.element.data('pickerHeight', pickerHeight);
                this.element.data('pickerAreaHeight', pickerAreaHeight);
                this.element.data('indicatorTranslateTop', indicatorTranslateTop);
                this.element.data('indicatorTranslateDown', indicatorTranslateDown);
                this.element.data('indicatorTranslateSelector', indicatorTranslateSelector);
                this.element.data('indicatorTranslateContent', indicatorTranslateContent);
            };
            wijinputdate.prototype._initListPicker = function () {
                var _this = this;
                if(this._comboDiv !== undefined) {
                    return;
                }
                this._comboDiv = $("<div/>").css({
                    "overflow": "hidden",
                    "display": "block",
                    "left": "",
                    "top": "",
                    "position": ""
                });
                var content = this._normalize(this._getcomboItems());
                this._comboDiv.wijlist({
                    maxItemsCount: 5,
                    autoSize: true,
                    selected: function (event, ui) {
                        if(!_this.options.disableUserInput) {
                            _this._setData(ui.item.value);
                        }
                        var pickers = _this.element.data('pickers');
                        if(pickers != undefined) {
                            pickers.wijpopup('hide');
                        }
                        _this._trySetFocus();
                    }
                });
                this._comboDiv.wijlist('setItems', content);
                this._comboDiv.wijlist('renderList');
                if(input.Utility.IsIE7()) {
                    this._comboDiv.attr("align", "left");
                }
            };
            wijinputdate.prototype._initCalendarPicker = function () {
                var _this = this;
                var calendar = this.element.data('calendar');
                if(calendar != undefined) {
                    return;
                }
                var c = this.options.calendar;
                if(c === undefined || c === null) {
                    return;
                }
                if(typeof (c) === 'boolean' || c === 'default') {
                    c = $("<div/>");
                }
                calendar = $(c);
                if(calendar.length !== 1) {
                    return;
                }
                this.element.data('calendar', calendar);
                // if the localization from the resource files.
                if(this.options.localization) {
                    this.options.nextTooltip = this.options.localization.nextTooltip;
                    this.options.prevTooltip = this.options.localization.prevTooltip;
                    this.options.titleFormat = this.options.localization.titleFormat;
                    this.options.toolTipFormat = this.options.localization.toolTipFormat;
                }
                calendar.wijcalendar({
                    popupMode: true,
                    culture: this.options.culture,
                    nextTooltip: //add for localization(tooltip)
                    this.options.nextTooltip || 'Next',
                    prevTooltip: this.options.prevTooltip || 'Previous',
                    titleFormat: this.options.titleFormat || 'MMMM yyyy',
                    toolTipFormat: this.options.toolTipFormat || 'dddd, MMMM dd, yyyy',
                    selectedDatesChanged: function () {
                        var selDate = calendar.wijcalendar("getSelectedDate"), curDate = _this.option('date');
                        _super.prototype._wasPopupShowing = false;
                        var pickers = _this.element.data('pickers');
                        if(pickers != undefined) {
                            pickers.wijpopup('hide');
                        }
                        _this._trigger('dropDownClose', null);
                        if(selDate) {
                            if(curDate) {
                                selDate.setHours(curDate.getHours());
                                selDate.setMinutes(curDate.getMinutes());
                                selDate.setSeconds(curDate.getSeconds());
                                selDate.setMilliseconds(curDate.getMilliseconds());
                            }
                            if(_this._allowEdit()) {
                                _this.option('date', selDate);
                                _this.selectText();
                            }
                        }
                        _this._trySetFocus();
                    }
                });
                calendar.css({
                    "display": "block",
                    "left": "",
                    "top": "",
                    "position": "",
                    "margin-bottom": "0px"
                });
                this._syncCalendar();
                this._updateCalendarPicker();
                // the bind event can't trigger.!!!
                //            calendar.bind('wijcalendarselectedDatesChanged', function () {
                //                var selDate = $(this).wijcalendar("getSelectedDate");
                //                $(this).wijcalendar("close");
                //                if (!!selDate) { self.option('date', selDate); }
                //                self._trySetFocus();
                //               });
                            };
            wijinputdate.prototype._initTimePicker = function () {
                var timePicker = this.element.data('timePicker');
                if(timePicker != undefined) {
                    return;
                }
                var self = this;
                var height = this.element.data('itemHeight') * 5;
                var pickerWidth = this.element.data('pickerWidth');
                var itemHeight = this.element.data('itemHeight') + "px";
                var indicatorHeight = this.element.data('indicatorHeight') + "px";
                var indicatorTranslateTop = this.element.data('indicatorTranslateTop');
                var indicatorTranslateDown = this.element.data('indicatorTranslateDown');
                var indicatorTranslateSelector = this.element.data('indicatorTranslateSelector');
                var indicatorTranslateContent = this.element.data('indicatorTranslateContent');
                var div = this._createDivElement(document.body, pickerWidth + "px");
                var divIndicator = this._createDivIndicatiorElement(div, itemHeight, "", indicatorTranslateSelector);
                var table = this._createTableElement(div, height + "px", "-", indicatorTranslateContent);
                var trTime = $("<tr/>").appendTo(table);
                // Hour
                var tdHour = $("<td/>").css({
                    "width": "33%"
                });
                var divHour = this._createPickerDivElement(tdHour, height);
                var divHourMask = this._createMaskElement(divHour, height);
                var pickerHourArray = {
                };
                for(var i = 1; i <= 12; i++) {
                    var text = this._getRollText(i, this.element.data('pickerTimeHourFormat'));
                    var itemDiv = this._createItemElement(i, divHourMask, itemHeight, text);
                    //itemDiv.mousedown(function (e, arg) {
                    //    self._hourMouseDown(e, arg);
                    //});
                    pickerHourArray[i - 1] = itemDiv;
                }
                //Minute
                var tdMinute = $("<td/>").css({
                    "width": "33%"
                });
                var divMinute = this._createPickerDivElement(tdMinute, height);
                var divMinuteMask = this._createMaskElement(divMinute, height);
                var pickerMinuteArray = {
                };
                for(var i = 0; i < 60; i++) {
                    var text = this._getRollText(i, this.element.data('pickerTimeMinuteFormat'));
                    var itemDiv = this._createItemElement(i, divMinuteMask, itemHeight, text);
                    //itemDiv.mousedown(function (e, arg) {
                    //    self._minuteMouseDown(e, arg);
                    //});
                    pickerMinuteArray[i] = itemDiv;
                }
                //AM
                var tdAM = $("<td/>").css({
                    "width": "34%"
                });
                var divAM = this._createPickerDivElement(tdAM, height);
                var divAMMask = this._createMaskElement(divAM, height);
                var pickerAMArray = {
                };
                for(var i = 0; i < 2; i++) {
                    var text = this._getRollText(i, this.element.data('pickerTimeAMFormat'));
                    var itemDiv = this._createItemElement(i, divAMMask, itemHeight, text);
                    //itemDiv.mousedown( function (e, arg) {
                    //    self._amMouseDown(e, arg);
                    //});
                    pickerAMArray[i] = itemDiv;
                }
                var pickerTimeFormat = this.element.data('pickerTimeFormat');
                var hourAdded = false, minuteAdded = false, amAdded = false;
                for(var i = 0; i < pickerTimeFormat.length; i++) {
                    if((pickerTimeFormat[i] == "h" || pickerTimeFormat[i] == "hh") && !hourAdded) {
                        tdHour.appendTo(trTime);
                        hourAdded = true;
                    }
                    if((pickerTimeFormat[i] == "m" || pickerTimeFormat[i] == "mm") && !minuteAdded) {
                        tdMinute.appendTo(trTime);
                        minuteAdded = true;
                    }
                    if((pickerTimeFormat[i] == "t" || pickerTimeFormat[i] == "tt") && !amAdded) {
                        tdAM.appendTo(trTime);
                        amAdded = true;
                    }
                }
                this.element.data('timePicker', div);
                this.element.data('divHour', divHour);
                this.element.data('divMinute', divMinute);
                this.element.data('divAM', divAM);
                this.element.data('divHourMask', divHourMask);
                this.element.data('divMinuteMask', divMinuteMask);
                this.element.data('divAMMask', divAMMask);
                this.element.data('pickerHourArray', pickerHourArray);
                this.element.data('pickerMinuteArray', pickerMinuteArray);
                this.element.data('pickerAMArray', pickerAMArray);
                if(!input.Utility.IsIE8OrBelow()) {
                    var divHourIndicatorTop = this._createIndicatiorElement(divHour, indicatorHeight, "-", indicatorTranslateTop);
                    var divHourIndicatorDown = this._createIndicatiorElement(divHour, indicatorHeight, "-", indicatorTranslateDown);
                    var divMinuteIndicatorTop = this._createIndicatiorElement(divMinute, indicatorHeight, "-", indicatorTranslateTop);
                    var divMinuteIndicatorDown = this._createIndicatiorElement(divMinute, indicatorHeight, "-", indicatorTranslateDown);
                    var divAMIndicatorTop = this._createIndicatiorElement(divAM, indicatorHeight, "-", indicatorTranslateTop);
                    var divAMIndicatorDown = this._createIndicatiorElement(divAM, indicatorHeight, "-", indicatorTranslateDown);
                    this.element.data('divHourIndicatorTop', divHourIndicatorTop);
                    this.element.data('divMinuteIndicatorTop', divMinuteIndicatorTop);
                    this.element.data('divAMIndicatorTop', divAMIndicatorTop);
                    this.element.data('divHourIndicatorDown', divHourIndicatorDown);
                    this.element.data('divMinuteIndicatorDown', divMinuteIndicatorDown);
                    this.element.data('divAMIndicatorDown', divAMIndicatorDown);
                }
                this._initTimePickerEvent();
                this._initTouchPickerEvent("Hour");
                this._initTouchPickerEvent("Minute");
                this._initTouchPickerEvent("AM");
            };
            wijinputdate.prototype._initTimePickerEvent = function () {
                var self = this;
                var divHour = this.element.data('divHour');
                var divMinute = this.element.data('divMinute');
                var divAM = this.element.data('divAM');
                divHour.mousewheel(function (e, arg) {
                    self._hourMouseWheel(e, arg);
                });
                divMinute.mousewheel(function (e, arg) {
                    self._minuteMouseWheel(e, arg);
                });
                divAM.mousewheel(function (e, arg) {
                    self._amMouseWheel(e, arg);
                });
            };
            wijinputdate.prototype._initDatePicker = function () {
                var datePicker = this.element.data('datePicker');
                if(datePicker != undefined) {
                    return;
                }
                var self = this;
                var minYear = this.element.data('pickerMinYear');
                var maxYear = this.element.data('pickerMaxYear');
                var height = this.element.data('itemHeight') * 5;
                var pickerWidth = this.element.data('pickerWidth');
                var itemHeight = this.element.data('itemHeight') + "px";
                var indicatorHeight = this.element.data('indicatorHeight') + "px";
                var indicatorTranslateTop = this.element.data('indicatorTranslateTop');
                var indicatorTranslateDown = this.element.data('indicatorTranslateDown');
                var indicatorTranslateSelector = this.element.data('indicatorTranslateSelector');
                var indicatorTranslateContent = this.element.data('indicatorTranslateContent');
                var div = this._createDivElement(document.body, pickerWidth + "px");
                var divIndicator = this._createDivIndicatiorElement(div, itemHeight, "", indicatorTranslateSelector);
                var table = this._createTableElement(div, height + "px", "-", indicatorTranslateContent);
                var trDate = $("<tr/>").appendTo(table);
                var tdYearWidth = "33%";
                var tdMonthWidth = "33%";
                var tdDayWidth = "33%";
                if(this.element.data('pickerDateMonthFormat') == "MMMM") {
                    tdYearWidth = "30%";
                    tdMonthWidth = "45%";
                    tdDayWidth = "25%";
                }
                // Year
                var tdYear = $("<td/>").css({
                    "width": tdYearWidth
                });
                var divYear = this._createPickerDivElement(tdYear, height);
                var divYearMask = this._createMaskElement(divYear, height);
                var pickerYearArray = new Array();
                for(var i = minYear; i <= maxYear; i++) {
                    var text = this._getRollText(i, this.element.data('pickerDateYearFormat'));
                    var itemDiv = this._createItemElement(i, divYearMask, itemHeight, text);
                    //itemDiv.mousedown(function (e, arg) {
                    //    self._yearMouseDown(e, arg);
                    //});
                    pickerYearArray[i - minYear] = itemDiv;
                }
                // Month
                var tdMonth = $("<td/>").css({
                    "width": tdMonthWidth
                });
                var divMonth = this._createPickerDivElement(tdMonth, height);
                var divMonthMask = this._createMaskElement(divMonth, height);
                var pickerMonthArray = {
                };
                for(var i = 1; i <= 12; i++) {
                    var text = this._getRollText(i, this.element.data('pickerDateMonthFormat'));
                    var itemDiv = this._createItemElement(i - 1, divMonthMask, itemHeight, text);
                    //itemDiv.mousedown(function (e, arg) {
                    //    self._monthMouseDown(e, arg);
                    //});
                    pickerMonthArray[i - 1] = itemDiv;
                }
                //Day
                var tdDay = $("<td/>").css({
                    "width": tdDayWidth
                });
                var divDay = this._createPickerDivElement(tdDay, height);
                var divDayMask = this._createMaskElement(divDay, height);
                var pickerDayArray = {
                };
                for(var i = 1; i <= 31; i++) {
                    var text = this._getRollText(i, this.element.data('pickerDateDayFormat'));
                    var itemDiv = this._createItemElement(i, divDayMask, itemHeight, text);
                    //itemDiv.mousedown(function (e, arg) {
                    //    self._dayMouseDown(e, arg);
                    //});
                    pickerDayArray[i - 1] = itemDiv;
                }
                var pickerDateFormat = this.element.data('pickerDateFormat');
                var yearAdded = false, monthAdded = false, dayAdded = false;
                for(var i = 0; i < pickerDateFormat.length; i++) {
                    if((pickerDateFormat[i] == "yyyy") && !yearAdded) {
                        tdYear.appendTo(trDate);
                        yearAdded = true;
                    }
                    if((pickerDateFormat[i] == "M" || pickerDateFormat[i] == "MM" || pickerDateFormat[i] == "MMM" || pickerDateFormat[i] == "MMMM") && !monthAdded) {
                        tdMonth.appendTo(trDate);
                        monthAdded = true;
                    }
                    if((pickerDateFormat[i] == "d" || pickerDateFormat[i] == "dd") && !dayAdded) {
                        tdDay.appendTo(trDate);
                        dayAdded = true;
                    }
                }
                this.element.data('datePicker', div);
                this.element.data('divYear', divYear);
                this.element.data('divMonth', divMonth);
                this.element.data('divDay', divDay);
                this.element.data('divYearMask', divYearMask);
                this.element.data('divMonthMask', divMonthMask);
                this.element.data('divDayMask', divDayMask);
                this.element.data('pickerYearArray', pickerYearArray);
                this.element.data('pickerMonthArray', pickerMonthArray);
                this.element.data('pickerDayArray', pickerDayArray);
                if(!input.Utility.IsIE8OrBelow()) {
                    var divYearIndicatorTop = this._createIndicatiorElement(divYear, indicatorHeight, "-", indicatorTranslateTop);
                    var divYearIndicatorDown = this._createIndicatiorElement(divYear, indicatorHeight, "-", indicatorTranslateDown);
                    var divMonthIndicatorTop = this._createIndicatiorElement(divMonth, indicatorHeight, "-", indicatorTranslateTop);
                    var divMonthIndicatorDown = this._createIndicatiorElement(divMonth, indicatorHeight, "-", indicatorTranslateDown);
                    var divDayIndicatorTop = this._createIndicatiorElement(divDay, indicatorHeight, "-", indicatorTranslateTop);
                    var divDayIndicatorDown = this._createIndicatiorElement(divDay, indicatorHeight, "-", indicatorTranslateDown);
                    this.element.data('divYearIndicatorTop', divYearIndicatorTop);
                    this.element.data('divMonthIndicatorTop', divMonthIndicatorTop);
                    this.element.data('divDayIndicatorTop', divDayIndicatorTop);
                    this.element.data('divYearIndicatorDown', divYearIndicatorDown);
                    this.element.data('divMonthIndicatorDown', divMonthIndicatorDown);
                    this.element.data('divDayIndicatorDown', divDayIndicatorDown);
                }
                this._initDatePickerEvent();
                this._initTouchPickerEvent("Year");
                this._initTouchPickerEvent("Month");
                this._initTouchPickerEvent("Day");
            };
            wijinputdate.prototype._initDatePickerEvent = function () {
                var self = this;
                var divYear = this.element.data('divYear');
                var divMonth = this.element.data('divMonth');
                var divDay = this.element.data('divDay');
                divYear.mousewheel(function (e, arg) {
                    self._yearMouseWheel(e, arg);
                });
                divMonth.mousewheel(function (e, arg) {
                    self._monthMouseWheel(e, arg);
                });
                divDay.mousewheel(function (e, arg) {
                    self._dayMouseWheel(e, arg);
                });
            };
            wijinputdate.prototype._initTouchPickerEvent = function (pickerType) {
                var div = this.element.data('div' + pickerType);
                var divMask = this.element.data('div' + pickerType + 'Mask');
                this._addPickerTouchEvent(divMask, pickerType);
                if(!input.Utility.IsIE8OrBelow()) {
                    var divIndicatorTop = this.element.data('div' + pickerType + 'IndicatorTop');
                    var divIndicatorDown = this.element.data('div' + pickerType + 'IndicatorDown');
                    this._addPickerTouchEvent(divIndicatorTop, pickerType);
                    this._addPickerTouchEvent(divIndicatorDown, pickerType);
                }
            };
            wijinputdate.prototype._addPickerTouchEvent = function (element, pickerType) {
                var self = this;
                element.bind("touchstart", function (evt) {
                    self._touchStart(evt, pickerType);
                    evt.preventDefault();
                }).bind("touchmove", function (evt) {
                    self._touchMove(evt, pickerType);
                    evt.preventDefault();
                }).bind("touchend", function (evt) {
                    self._touchEnd(evt, pickerType);
                    evt.preventDefault();
                });
            };
            wijinputdate.prototype._touchStart = function (evt, pickerType) {
                var touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
                var clientY = touch.clientY;
                this.element.data("touch" + pickerType + "StartY", clientY);
                this.element.data("touch" + pickerType + "BaseY", this.element.data('picker' + pickerType + 'ScrollCurrent'));
                this.element.data("touch" + pickerType + "Started", true);
                this.element.data("touchStartTime", new Date());
                var pickerScrollCurrent = this.element.data('picker' + pickerType + 'ScrollCurrent');
                this.element.data('picker' + pickerType + 'ScrollTo', pickerScrollCurrent);
            };
            wijinputdate.prototype._touchMove = function (evt, pickerType) {
                if(this.element.data("touch" + pickerType + "Started") != true) {
                    return;
                }
                var touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
                var clientY = touch.clientY;
                var touchStartY = this.element.data("touch" + pickerType + "StartY");
                var touchBaseY = this.element.data("touch" + pickerType + "BaseY");
                var newY = touchBaseY + clientY - touchStartY;
                this._scrollTheViewByTouch(pickerType, newY);
            };
            wijinputdate.prototype._touchEnd = function (evt, pickerType) {
                var touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
                var touchStartY = this.element.data("touch" + pickerType + "StartY");
                var touchBaseY = this.element.data("touch" + pickerType + "BaseY");
                var offset = touch.clientY - touchStartY;
                var newY = touchBaseY + offset;
                if(Math.abs(offset) < 10) {
                    var pickerScrollCurrent = this.element.data('picker' + pickerType + 'ScrollCurrent');
                    this.element.data('picker' + pickerType + 'ScrollTo', pickerScrollCurrent);
                    this._adjustTouchPosition(pickerType, pickerScrollCurrent);
                    return;
                }
                this.element.data("touch" + pickerType + "StartY", -1);
                this.element.data("touch" + pickerType + "BaseY", -1);
                this.element.data("touch" + pickerType + "Started", false);
                var now = new Date();
                var offsetTime = now - this.element.data("touchStartTime");
                if(offsetTime < 200) {
                    var itemHeight = this.element.data("itemHeight") * 5;
                    var negative = offset < 0 ? -1 : 1;
                    offset = offset * 4;
                    offset = Math.abs(offset) < itemHeight ? negative * itemHeight : offset;
                    newY += offset;
                    this.element.data("touchQuickScroll", true);
                    this.element.data('picker' + pickerType + 'ScrollRate', 3);
                }
                this._adjustTouchPosition(pickerType, newY);
            };
            wijinputdate.prototype._hourMouseWheel = function (e, arg) {
                if(isNaN(arg)) {
                    return;
                }
                var oldHour = this.element.data("pickerHour");
                var hour = this.element.data("pickerHour");
                var lastHour = hour;
                hour -= arg;
                hour = hour < 1 ? 1 : hour;
                hour = hour > 12 ? 12 : hour;
                var am = this.element.data("pickerAM");
                if(hour == 12) {
                    if(am == 0) {
                        am = 1;
                        this._updateItemTransform("AM", am);
                        this._scrollTheView("AM", am, 0, false);
                        this.element.data("pickerAM", am);
                    }
                } else if(lastHour == 12) {
                    if(am == 1) {
                        am = 0;
                        this._updateItemTransform("AM", am);
                        this._scrollTheView("AM", am, 1, false);
                        this.element.data("pickerAM", am);
                    }
                }
                this._updateItemTransform("Hour", hour - 1);
                this._scrollTheView("Hour", hour - 1, oldHour - 1, false);
                this.element.data("pickerHour", hour);
                if(e.preventDefault) {
                    e.preventDefault();
                }
            };
            wijinputdate.prototype._minuteMouseWheel = function (e, arg) {
                if(isNaN(arg)) {
                    return;
                }
                var oldMinute = this.element.data("pickerMinute");
                var minute = this.element.data("pickerMinute");
                minute -= arg;
                minute = minute < 0 ? 0 : minute;
                minute = minute > 59 ? 59 : minute;
                this._updateItemTransform("Minute", minute);
                this._scrollTheView("Minute", minute, oldMinute, false);
                this.element.data("pickerMinute", minute);
                if(e.preventDefault) {
                    e.preventDefault();
                }
            };
            wijinputdate.prototype._amMouseWheel = function (e, arg) {
                if(isNaN(arg)) {
                    return;
                }
                var oldAM = $(e.currentTarget).data('pickerAM');
                var am = this.element.data("pickerAM");
                am -= arg;
                am = am < 0 ? 0 : am;
                am = am > 1 ? 1 : am;
                this._updateItemTransform("AM", am);
                this._scrollTheView("AM", am, oldAM, false);
                this.element.data("pickerAM", am);
                if(e.preventDefault) {
                    e.preventDefault();
                }
            };
            wijinputdate.prototype._yearMouseWheel = function (e, arg) {
                if(isNaN(arg)) {
                    return;
                }
                var minYear = this.element.data("pickerMinYear");
                var maxYear = this.element.data("pickerMaxYear");
                var year = this.element.data("pickerYear");
                var oldYear = this.element.data("pickerYear");
                year -= arg;
                year = year < minYear ? minYear : year;
                year = year > maxYear ? maxYear : year;
                this._updateItemTransform("Year", year - minYear);
                this._scrollTheView("Year", year - minYear, oldYear - minYear, false);
                this.element.data("pickerYear", year);
                this._updateDayPickerMaxCount();
                if(e.preventDefault) {
                    e.preventDefault();
                }
            };
            wijinputdate.prototype._monthMouseWheel = function (e, arg) {
                if(isNaN(arg)) {
                    return;
                }
                var month = this.element.data("pickerMonth");
                var oldMonth = this.element.data("pickerMonth");
                month -= arg;
                month = month < 1 ? 1 : month;
                month = month > 12 ? 12 : month;
                this._updateItemTransform("Month", month - 1);
                this._scrollTheView("Month", month - 1, oldMonth, false);
                this.element.data("pickerMonth", month);
                this._updateDayPickerMaxCount();
                if(e.preventDefault) {
                    e.preventDefault();
                }
            };
            wijinputdate.prototype._dayMouseWheel = function (e, arg) {
                if(isNaN(arg)) {
                    return;
                }
                var maxDayCount = this.element.data('pickerDayMaxCount');
                var oldDay = this.element.data("pickerDay");
                var day = this.element.data("pickerDay");
                day -= arg;
                day = day < 1 ? 1 : day;
                day = day > maxDayCount ? maxDayCount : day;
                this._updateItemTransform("Day", day - 1);
                this._scrollTheView("Day", day - 1, oldDay - 1, false);
                this.element.data("pickerDay", day);
                if(e.preventDefault) {
                    e.preventDefault();
                }
            };
            wijinputdate.prototype._hourMouseDown = function (e, arg) {
                var oldHour = this.element.data("pickerHour");
                var hour = $(e.currentTarget).data('rollValue');
                this._scrollTheView("Hour", hour, oldHour, false);
                this.element.data("pickerHour", hour);
            };
            wijinputdate.prototype._minuteMouseDown = function (e, arg) {
                var oldMinute = this.element.data("pickerMinute");
                var minute = $(e.currentTarget).data('rollValue');
                this._scrollTheView("Minute", minute, oldMinute, false);
                this.element.data("pickerMinute", minute);
            };
            wijinputdate.prototype._amMouseDown = function (e, arg) {
                var oldAM = $(e.currentTarget).data('pickerAM');
                var am = $(e.currentTarget).data('rollValue');
                this._scrollTheView("AM", am, oldAM, false);
                this.element.data("pickerAM", am);
            };
            wijinputdate.prototype._yearMouseDown = function (e, arg) {
                var minYear = this.element.data("pickerMinYear");
                var year = $(e.currentTarget).data('rollValue');
                var oldYear = this.element.data("pickerYear");
                this._scrollTheView("Year", year - minYear, oldYear - minYear, false);
                this.element.data("pickerYear", year);
                this._updateDayPickerMaxCount();
            };
            wijinputdate.prototype._monthMouseDown = function (e, arg) {
                var oldMonth = this.element.data("pickerMonth");
                var month = $(e.currentTarget).data('rollValue');
                this._scrollTheView("Month", month, oldMonth, false);
                this.element.data("pickerMonth", month);
                this._updateDayPickerMaxCount();
            };
            wijinputdate.prototype._dayMouseDown = function (e, arg) {
                var oldDay = this.element.data("pickerDay");
                var day = $(e.currentTarget).data('rollValue');
                this._scrollTheView("Day", day - 1, oldDay - 1, false);
                this.element.data("pickerDay", day);
            };
            wijinputdate.prototype._updateCalendarPicker = function () {
                var calendar = this.element.data('calendar');
                var pickers = this.options.pickers;
                if(calendar == undefined || pickers == undefined) {
                    return;
                }
                if(pickers.calendar == undefined) {
                    return;
                }
                if(pickers.calendar.allowQuickPick != undefined) {
                    calendar.wijcalendar('option', 'allowQuickPick', pickers.calendar.allowQuickPick);
                }
                if(pickers.calendar.navButtons != undefined) {
                    calendar.wijcalendar('option', 'navButtons', pickers.calendar.navButtons);
                }
                if(pickers.calendar.nextTooltip != undefined) {
                    calendar.wijcalendar('option', 'nextTooltip', pickers.calendar.nextTooltip);
                }
                if(pickers.calendar.prevTooltip != undefined) {
                    calendar.wijcalendar('option', 'prevTooltip', pickers.calendar.prevTooltip);
                }
                if(pickers.calendar.showDayPadding != undefined) {
                    calendar.wijcalendar('option', 'showDayPadding', pickers.calendar.showDayPadding);
                }
                if(pickers.calendar.showOtherMonthDays != undefined) {
                    calendar.wijcalendar('option', 'showOtherMonthDays', pickers.calendar.showOtherMonthDays);
                }
                if(pickers.calendar.showTitle != undefined) {
                    calendar.wijcalendar('option', 'showTitle', pickers.calendar.showTitle);
                }
                if(pickers.calendar.showWeekDays != undefined) {
                    calendar.wijcalendar('option', 'showWeekDays', pickers.calendar.showWeekDays);
                }
                if(pickers.calendar.showWeekNumbers != undefined) {
                    calendar.wijcalendar('option', 'showWeekNumbers', pickers.calendar.showWeekNumbers);
                }
                if(pickers.calendar.titleFormat != undefined) {
                    calendar.wijcalendar('option', 'titleFormat', pickers.calendar.titleFormat);
                }
                if(pickers.calendar.toolTipFormat != undefined) {
                    calendar.wijcalendar('option', 'toolTipFormat', pickers.calendar.toolTipFormat);
                }
                if(pickers.calendar.weekDayFormat != undefined) {
                    calendar.wijcalendar('option', 'weekDayFormat', pickers.calendar.weekDayFormat);
                }
            };
            wijinputdate.prototype._updateTimePicker = function () {
                var hour = this.element.data("pickerHour") - 1;
                var minute = this.element.data("pickerMinute");
                var am = this.element.data("pickerAM");
                var divHourMask = this.element.data('divHourMask');
                var divMinuteMask = this.element.data('divMinuteMask');
                var divAMMask = this.element.data('divAMMask');
                this._updateItemTransform("Hour", hour);
                this._updateItemTransform("Minute", minute);
                this._updateItemTransform("AM", am);
                this._scrollTheView("Hour", hour, hour, true);
                this._scrollTheView("Minute", minute, minute, true);
                this._scrollTheView("AM", am, am, true);
                this.element.data('pickerHourScrollDelay', 5);
                this.element.data('pickerMinuteScrollDelay', 5);
                this.element.data('pickerAMScrollDelay', 5);
                this.element.data('pickerHourScrollRate', 1);
                this.element.data('pickerMinuteScrollRate', 1);
                this.element.data('pickerAMScrollRate', 1);
            };
            wijinputdate.prototype._updateDatePicker = function () {
                var minYear = this.element.data('pickerMinYear');
                var year = this.element.data("pickerYear");
                var month = this.element.data("pickerMonth");
                var day = this.element.data("pickerDay");
                var maxDayCount = DateTimeInfo.DaysInMonth(year, month);
                this._updateItemTransform("Year", year - minYear);
                this._updateItemTransform("Month", month - 1);
                this._updateItemTransform("Day", day - 1);
                this._scrollTheView("Year", year - minYear, year - minYear, true);
                this._scrollTheView("Month", month - 1, month - 1, true);
                this._scrollTheView("Day", day - 1, day - 1, true);
                this.element.data('pickerYearScrollDelay', 5);
                this.element.data('pickerMonthScrollDelay', 5);
                this.element.data('pickerDayScrollDelay', 5);
                this.element.data('pickerYearScrollRate', 1);
                this.element.data('pickerMonthScrollRate', 1);
                this.element.data('pickerDayScrollRate', 1);
                this._updateDayPickerMaxCount();
            };
            wijinputdate.prototype._updateDayPickerMaxCount = function () {
                var year = this.element.data("pickerYear");
                var month = this.element.data("pickerMonth");
                var day = this.element.data("pickerDay");
                var maxDayCount = DateTimeInfo.DaysInMonth(year, month);
                this.element.data('pickerDayMaxCount', maxDayCount);
                var pickerDayArray = this.element.data('pickerDayArray');
                for(var i = 29; i <= 31; i++) {
                    var display = i > maxDayCount ? "none" : "";
                    pickerDayArray[i - 1].css("display", display);
                }
                if(day > maxDayCount) {
                    var divDayMask = this.element.data('divDayMask');
                    day = maxDayCount;
                    this._updateItemTransform("Day", day - 1);
                    this._scrollTheView("Day", day - 1, null, false);
                    this.element.data("pickerDay", day);
                }
            };
            wijinputdate.prototype._updateItemTransform = function (pickerType, itemIndex) {
                if(input.Utility.IsIE8OrBelow()) {
                    return;
                }
                if(itemIndex < 0) {
                    return;
                }
                var itemArray = this.element.data("picker" + pickerType + "Array");
                var length = this._getItemLength(pickerType);
                var transform = "skew(0deg) scale(1.2, 1.2) translate(0px, 0px)";
                var transform1 = "skew(-5deg) scale(0.9, 0.9) translate(0px, 0px)";
                var transform2 = "skew(-10deg) scale(0.7, 0.7) translate(0px, 0px)";
                var transform3 = "skew(-15deg) scale(0.5, 0.5) translate(0px, 0px)";
                for(var i = 0; i < length; i++) {
                    if(i == itemIndex - 3) {
                        this._setCssTransform(itemArray[i], "", transform3, true);
                    } else if(i == itemIndex - 2) {
                        this._setCssTransform(itemArray[i], "", transform2, true);
                    } else if(i == itemIndex - 1) {
                        this._setCssTransform(itemArray[i], "", transform1, true);
                    } else if(i == itemIndex) {
                        this._setCssTransform(itemArray[i], "", transform, true);
                    } else if(i == itemIndex + 1) {
                        this._setCssTransform(itemArray[i], "", transform1, true);
                    } else if(i == itemIndex + 2) {
                        this._setCssTransform(itemArray[i], "", transform2, true);
                    } else if(i == itemIndex + 3) {
                        this._setCssTransform(itemArray[i], "", transform3, true);
                    } else {
                        this._setCssTransform(itemArray[i], "", "", true);
                    }
                }
            };
            wijinputdate.prototype._createDivElement = function (div, width) {
                var div = $("<div/>").appendTo(div).css({
                    "width": width + "px",
                    "display": "block",
                    "left": "",
                    "top": "",
                    "position": ""
                }).bind("touchstart", function (evt) {
                    evt.preventDefault();
                }).bind("touchmove", function (evt) {
                    evt.preventDefault();
                });
                return div;
            };
            wijinputdate.prototype._createTableElement = function (div, height, prefix, transform) {
                var table = $("<table/>").appendTo(div).css({
                    "width": "100%",
                    "height": height + "px"
                }).attr({
                    "cellspacing": "0px",
                    "cellpadding": "0px"
                });
                this._setCssTransform(table, prefix, transform, false);
                return table;
            };
            wijinputdate.prototype._createItemElement = function (index, div, height, text) {
                var item = $("<div/>").appendTo(div).css({
                    "height": height,
                    "lineHeight": height,
                    "cursor": "default"
                }).html(text).data("rollValue", index);
                return item;
            };
            wijinputdate.prototype._createPickerDivElement = function (div, height) {
                var pickerDiv = $("<div/>").appendTo(div).css({
                    "height": height,
                    "border": "0px",
                    "text-align": "center",
                    "overflow": "hidden",
                    "background": "transparent"
                });
                return pickerDiv;
            };
            wijinputdate.prototype._createMaskElement = function (div, height) {
                var mask = $("<div/>").appendTo(div).css({
                    "height": height
                });
                return mask;
            };
            wijinputdate.prototype._createDivIndicatiorElement = function (div, height, prefix, transform) {
                var indicator = $("<div/>").appendTo(div).css({
                    "height": height,
                    "opacity": "0.5",
                    "lineHeight": height,
                    "margin": "0px",
                    "cursor": "default"
                }).attr("class", "ui-state-active");
                this._setCssTransform(indicator, prefix, transform, false);
                return indicator;
            };
            wijinputdate.prototype._createIndicatiorElement = function (div, height, prefix, transform) {
                var indicator = $("<div/>").appendTo(div).css({
                    "height": height,
                    "opacity": "0.5",
                    "lineHeight": height,
                    "border-width": "0px",
                    "cursor": "default"
                }).attr("class", "ui-widget-content");
                this._setCssTransform(indicator, prefix, transform, false);
                return indicator;
            };
            wijinputdate.prototype._hideItemInIE7 = function (pickerType, pickerScrollCurrent) {
                if(!input.Utility.IsIE7()) {
                    return;
                }
                var lastItemIndex = this.element.data('picker' + pickerType + 'LastItemIndex');
                var itemIndex = this._getItemIndexByPosition(pickerType, pickerScrollCurrent);
                if(itemIndex == lastItemIndex) {
                    return;
                }
                var minItemIndex = itemIndex - 2;
                var maxItemIndex = itemIndex + 2;
                var itemArray = this.element.data("picker" + pickerType + "Array");
                var length = this._getItemLength(pickerType);
                for(var i = 0; i < length; i++) {
                    if(i >= minItemIndex && i <= maxItemIndex) {
                        itemArray[i].css("visibility", "");
                    } else {
                        itemArray[i].css("visibility", "hidden");
                    }
                }
                this.element.data('picker' + pickerType + 'LastItemIndex', itemIndex);
            };
            wijinputdate.prototype._okButtonMouseDown = function (e, arg) {
                var year = this.element.data("pickerYear");
                var month = this.element.data("pickerMonth") - 1;
                var day = this.element.data("pickerDay");
                var hour = this.element.data("pickerHour");
                var minute = this.element.data("pickerMinute");
                var am = this.element.data("pickerAM");
                if(hour == 12) {
                    hour = 0;
                }
                if(am == 1) {
                    hour += 12;
                }
                var date = this._getPickerValue();
                date.setFullYear(year);
                date.setMonth(month);
                date.setDate(day);
                date.setHours(hour);
                date.setMinutes(minute);
                _super.prototype._wasPopupShowing = false;
                var pickers = this.element.data('pickers');
                if(pickers != undefined) {
                    pickers.wijpopup('hide');
                }
                this._trigger('dropDownClose', null);
                if(this._allowEdit()) {
                    this.option('date', date);
                    this.selectText();
                }
                this._trySetFocus();
            };
            wijinputdate.prototype._getCorrentPickerFormat = function (formats) {
                for(var i = 0; i < formats.length - 1; i++) {
                    for(var j = i + 1; j < formats.length; j++) {
                        if(formats[j].index < formats[i].index) {
                            var tmp = formats[i];
                            formats[i] = formats[j];
                            formats[j] = tmp;
                        }
                    }
                }
                var result = "";
                for(var i = 0; i < formats.length; i++) {
                    result += formats[i].value;
                    if(i < formats.length - 1) {
                        result += ",";
                    }
                }
                return result;
            };
            wijinputdate.prototype._getDefaultDatePickerFormat = function () {
                var culture = this._getCulture();
                if(culture == null) {
                    return "yyyy,M,d";
                }
                var cf = culture.calendars.standard;
                var pattern = cf.patterns.d;
                var y = {
                    "index": pattern.indexOf('y'),
                    "value": "yyyy"
                };
                var M = {
                    "index": pattern.indexOf('M'),
                    "value": "MM"
                };
                var d = {
                    "index": pattern.indexOf('d'),
                    "value": "dd"
                };
                if(y.index == -1 || M.index == -1 || d.index == -1) {
                    return "yyyy,M,d";
                }
                var formats = new Array();
                formats[0] = y;
                formats[1] = M;
                formats[2] = d;
                return this._getCorrentPickerFormat(formats);
            };
            wijinputdate.prototype._getDefaultTimePickerFormat = function () {
                if(this.options.culture.length >= 2) {
                    var subString = this.options.culture.substr(0, 2);
                    if(subString == 'ja' || subString == 'zh') {
                        return "tt,hh,mm";
                    }
                }
                return "hh,mm,tt";
            };
            wijinputdate.prototype._getListPickerWidth = function () {
                var comboWidth = this._getcomboWidth();
                var pickerWidth = this.element.data("pickerWidth");
                var width = comboWidth != undefined ? comboWidth : this.outerDiv.width();
                return pickerWidth > width ? pickerWidth + "px" : width + "px";
            };
            wijinputdate.prototype._getDatePickerMinYear = function () {
                var realMinDate = this._isEraFormatExist() ? this._getRealEraMinDate() : this._getRealMinDate();
                var minYear = realMinDate.getFullYear();
                var pickerValue = this._getPickerValue();
                var year = this._max(pickerValue.getFullYear() - 50, minYear);
                return year;
            };
            wijinputdate.prototype._getDatePickerMaxYear = function () {
                var realMaxDate = this._isEraFormatExist() ? this._getRealEraMaxDate() : this._getRealMaxDate();
                var maxYear = realMaxDate.getFullYear();
                var pickerValue = this._getPickerValue();
                var year = this._min(pickerValue.getFullYear() + 50, maxYear);
                return year;
            };
            wijinputdate.prototype._getPickerValue = function () {
                var pickerValue = this.options.date;
                pickerValue = pickerValue == null ? new Date() : pickerValue;
                return pickerValue;
            };
            wijinputdate.prototype._getRollFormat = function (pickerDateFormat, format) {
                for(var i = 0; i < pickerDateFormat.length; i++) {
                    if(pickerDateFormat[i].indexOf(format) != -1) {
                        return pickerDateFormat[i];
                    }
                }
                return "";
            };
            wijinputdate.prototype._getRollText = function (index, format) {
                var culture = this._getCulture();
                var text = "";
                switch(format) {
                    case "M":
                    case "h":
                        text = (index).toString();
                        break;
                    case "MM":
                    case "hh":
                        text = index < 10 ? "0" + (index).toString() : (index).toString();
                        break;
                    case "m":
                    case "d":
                    case "yyyy":
                        text = index.toString();
                        break;
                    case "mm":
                    case "dd":
                        text = index < 10 ? "0" + index.toString() : index.toString();
                        break;
                    case "t":
                        text = index == 0 ? this._getStandardAMPM("AM") : this._getStandardAMPM("PM");
                        text = text.substr(0, 1);
                        break;
                    case "tt":
                        text = index == 0 ? this._getStandardAMPM("AM") : this._getStandardAMPM("PM");
                        break;
                    case "MMM":
                        text = culture.calendars.standard.months.namesAbbr[index - 1];
                        break;
                    case "MMMM":
                        text = culture.calendars.standard.months.names[index - 1];
                        break;
                    default:
                }
                return text;
            };
            wijinputdate.prototype._getStandardAMPM = function (value) {
                var culture = this._getCulture();
                if(culture && culture.calendar) {
                    var tmp = culture.calendars.standard[value];
                    if(tmp) {
                        return tmp[0];
                    }
                }
                return value;
            };
            wijinputdate.prototype._getItemIndexByPosition = function (pickerType, newY) {
                var touchPositionArray = this._getTouchPositionArray(pickerType);
                var length = this._getItemLength(pickerType);
                if(pickerType == "Day") {
                    if(length > this.element.data('pickerDayMaxCount')) {
                        length = this.element.data('pickerDayMaxCount');
                    }
                }
                var index = -1;
                for(var i = 0; i < length; i++) {
                    if(i == 0) {
                        if(newY > touchPositionArray[i]) {
                            index = 0;
                            break;
                        }
                    } else {
                        if(newY <= touchPositionArray[i - 1] && newY >= touchPositionArray[i]) {
                            var offsetTop = touchPositionArray[i - 1] - newY;
                            var offsetBottom = newY - touchPositionArray[i];
                            index = offsetTop > offsetBottom ? i : i - 1;
                            break;
                        }
                    }
                    if(i == length - 1) {
                        if(newY < touchPositionArray[i]) {
                            index = i;
                            break;
                        }
                    }
                }
                return index;
            };
            wijinputdate.prototype._getItemLength = function (pickerType) {
                switch(pickerType) {
                    case "Hour":
                    case "Month":
                        return 12;
                    case "Year":
                        var minYear = this.element.data('pickerMinYear');
                        var maxYear = this.element.data('pickerMaxYear');
                        return maxYear - minYear + 1;
                    case "Day":
                        return 31;
                    case "Minute":
                        return 60;
                    case "AM":
                        return 2;
                }
                return -1;
            };
            wijinputdate.prototype._getTouchPositionArray = function (pickerType) {
                var positionArray = {
                };
                var itemHeight = this.element.data('itemHeight');
                var length = this._getItemLength(pickerType);
                for(var i = 0; i < length; i++) {
                    positionArray[i] = (2 - i) * itemHeight;
                }
                return positionArray;
            };
            wijinputdate.prototype._adjustTouchPosition = function (pickerType, newY) {
                var touchPositionArray = this._getTouchPositionArray(pickerType);
                var index = this._getItemIndexByPosition(pickerType, newY);
                var value = this._itemIndexToValue(pickerType, index);
                this.element.data("picker" + pickerType, value);
                this._scrollTheViewByTouch(pickerType, touchPositionArray[index]);
            };
            wijinputdate.prototype._itemIndexToValue = function (pickerType, index) {
                switch(pickerType) {
                    case "Minute":
                    case "AM":
                        return index;
                    case "Hour":
                    case "Month":
                    case "Day":
                        return index + 1;
                    case "Year":
                        var minYear = this.element.data('pickerMinYear');
                        return minYear + index;
                }
                return -1;
            };
            wijinputdate.prototype._scrollTheView = function (pickerType, newValue, oldValue, ignoreScroll) {
                var itemHeight = this.element.data('itemHeight');
                var newOffset = (2 - newValue) * itemHeight;
                this.element.data('picker' + pickerType + 'ScrollTo', newOffset);
                if(ignoreScroll == true) {
                    var divMask = this.element.data('div' + pickerType + 'Mask');
                    var pickerScrollCurrent = newOffset;
                    this._setCssTransform(divMask, "", pickerScrollCurrent, false);
                    this._hideItemInIE7(pickerType, pickerScrollCurrent);
                    this.element.data('picker' + pickerType + 'ScrollCurrent', pickerScrollCurrent);
                } else {
                    this._scrollPicker(pickerType);
                }
            };
            wijinputdate.prototype._scrollPicker = function (pickerType) {
                var divMask = this.element.data('div' + pickerType + 'Mask');
                var pickerScrollTo = this.element.data('picker' + pickerType + 'ScrollTo');
                var pickerScrollCurrent = this.element.data('picker' + pickerType + 'ScrollCurrent');
                var pickerScrollDelay = this.element.data('picker' + pickerType + 'ScrollDelay');
                if(pickerScrollCurrent == undefined) {
                    pickerScrollCurrent = pickerScrollTo;
                    this._setCssTransform(divMask, "", pickerScrollCurrent, false);
                    this.element.data('picker' + pickerType + 'ScrollCurrent', pickerScrollCurrent);
                }
                if(pickerScrollTo == pickerScrollCurrent || pickerScrollCurrent == undefined) {
                    return false;
                }
                pickerScrollCurrent += pickerScrollTo > pickerScrollCurrent ? 1 : -1;
                var transform = "translate(0," + pickerScrollCurrent + "px) ";
                this._setCssTransform(divMask, "", pickerScrollCurrent, false);
                this._hideItemInIE7(pickerType, pickerScrollCurrent);
                this.element.data('picker' + pickerType + 'ScrollCurrent', pickerScrollCurrent);
                var self = this;
                setTimeout(function () {
                    self._scrollPicker(pickerType);
                }, pickerScrollDelay);
                return true;
            };
            wijinputdate.prototype._scrollTheViewByTouch = function (pickerType, clientY) {
                var itemHeight = this.element.data('itemHeight');
                var pickerScrollCurrent = this.element.data('picker' + pickerType + 'ScrollCurrent');
                var pickerScrollTo = this.element.data('picker' + pickerType + 'ScrollTo');
                this.element.data('picker' + pickerType + 'ScrollTo', clientY);
                this._scrollPickerByTouch(pickerType);
            };
            wijinputdate.prototype._setCssTransform = function (element, prefix, transform, setDirect) {
                var newTransform = transform;
                if(!setDirect) {
                    newTransform = "translate(0, " + prefix + transform + "px)";
                }
                element.css("position", "");
                element.css("top", "");
                if(input.Utility.IsIE8OrBelow()) {
                    element.css("position", "relative");
                    element.css("top", prefix + transform + "px");
                } else if(input.Utility.IsIE9()) {
                    element.css("-ms-transform", newTransform);
                } else {
                    element.css("transform", newTransform);
                }
            };
            wijinputdate.prototype._scrollPickerByTouch = function (pickerType) {
                var divMask = this.element.data('div' + pickerType + 'Mask');
                var pickerScrollTo = this.element.data('picker' + pickerType + 'ScrollTo');
                var pickerScrollCurrent = this.element.data('picker' + pickerType + 'ScrollCurrent');
                if(pickerScrollCurrent == undefined) {
                    pickerScrollCurrent = pickerScrollTo;
                    this._setCssTransform(divMask, "", pickerScrollCurrent, false);
                    this.element.data('picker' + pickerType + 'ScrollCurrent', pickerScrollCurrent);
                }
                if(pickerScrollTo == pickerScrollCurrent) {
                    this.element.data('picker' + pickerType + 'ScrollRate', 1);
                    this.element.data('picker' + pickerType + 'ScrollDelay', 5);
                    this.element.data('touchQuickScroll', false);
                    if(pickerType == "Month" || pickerType == "Year") {
                        this._updateDayPickerMaxCount();
                    } else if(pickerType == "Hour") {
                        var itemIndex = this._getItemIndexByPosition(pickerType, pickerScrollCurrent);
                        var am = this.element.data("pickerAM");
                        if(itemIndex == 11) {
                            if(am == 0) {
                                am = 1;
                                this._updateItemTransform("AM", am);
                                this._scrollTheView("AM", am, 0, false);
                                this.element.data("pickerAM", am);
                            }
                        } else {
                            if(am == 1) {
                                am = 0;
                                this._updateItemTransform("AM", am);
                                this._scrollTheView("AM", am, 1, false);
                                this.element.data("pickerAM", am);
                            }
                        }
                    }
                    return false;
                }
                var itemHeight = this.element.data('itemHeight');
                var scrollDelay = this.element.data('picker' + pickerType + 'ScrollDelay');
                var scrollRate = this.element.data('picker' + pickerType + 'ScrollRate');
                var offset = Math.abs(pickerScrollTo - pickerScrollCurrent);
                var rate = offset > scrollRate ? scrollRate : offset;
                if(this.element.data('touchQuickScroll') == true) {
                    if(offset < itemHeight) {
                        scrollDelay = 80;
                    } else if(offset < itemHeight * 2) {
                        scrollDelay = 50;
                    } else if(offset < itemHeight * 5) {
                        scrollDelay = 30;
                    } else if(offset < itemHeight * 8) {
                        scrollDelay = 20;
                    } else if(offset < itemHeight * 10) {
                        scrollDelay = 10;
                    }
                    this.element.data('picker' + pickerType + 'ScrollDelay', scrollDelay);
                }
                pickerScrollCurrent += pickerScrollTo > pickerScrollCurrent ? rate : -1 * rate;
                this._setCssTransform(divMask, "", pickerScrollCurrent, false);
                this.element.data('picker' + pickerType + 'ScrollCurrent', pickerScrollCurrent);
                var itemIndex = this._getItemIndexByPosition(pickerType, pickerScrollCurrent);
                var lastItemIndex = this.element.data('picker' + pickerType + 'LastItemIndex');
                if(itemIndex != lastItemIndex) {
                    this._updateItemTransform(pickerType, itemIndex);
                }
                this.element.data('picker' + pickerType + 'LastItemIndex', lastItemIndex);
                var self = this;
                setTimeout(function () {
                    self._scrollPickerByTouch(pickerType);
                }, scrollDelay);
                return true;
            };
            wijinputdate.prototype._syncCalendar = function () {
                var calendar = this.element.data('calendar');
                if(!calendar) {
                    return;
                }
                var date = this._safeGetDate();
                if(date == null || this._isMinDate(date)) {
                    date = new Date();
                }
                calendar.wijcalendar('option', 'displayDate', date);
                if(this.options.minDate) {
                    calendar.wijcalendar('option', 'minDate', this.options.minDate);
                }
                if(this.options.maxDate) {
                    calendar.wijcalendar('option', 'maxDate', this.options.maxDate);
                }
                calendar.wijcalendar('unSelectAll');
                calendar.wijcalendar('selectDate', date);
                calendar.wijcalendar('refresh');
            };
            wijinputdate.prototype._showPopup = function () {
                if(!this._allowEdit()) {
                    return false;
                }
                if(this._isDatePickerNeedReInit()) {
                    this._reInitPicker();
                }
                var pickers = this.element.data('pickers');
                if(pickers == undefined) {
                    return false;
                }
                pickers.wijpopup('show', $.extend({
                }, this.options.popupPosition, {
                    of: this.outerDiv
                }));
                var pickerValue = this._getPickerValue();
                var hour = pickerValue.getHours();
                if(hour > 12) {
                    hour -= 12;
                } else if(hour == 0) {
                    hour = 12;
                }
                this.element.data("pickerValue", pickerValue);
                this.element.data("pickerYear", pickerValue.getFullYear());
                this.element.data("pickerMonth", pickerValue.getMonth() + 1);
                this.element.data("pickerDay", pickerValue.getDate());
                this.element.data("pickerHour", hour);
                this.element.data("pickerMinute", pickerValue.getMinutes());
                this.element.data("pickerAM", pickerValue.getHours() < 12 ? 0 : 1);
                this.element.data('divOK').css("visibility", "");
                if(this._isTimePickerShown()) {
                    this._updateTimePicker();
                    pickers.attr({
                        "class": "ui-widget-content ui-corner-all"
                    });
                }
                if(this._isDatePickerShown()) {
                    this._updateDatePicker();
                    pickers.css({
                        "font-size": "12px"
                    }).attr({
                        "class": "ui-widget-content ui-corner-all"
                    });
                }
                if(this._isListPickerShown()) {
                    if(this._getPickerCount() == 1) {
                        pickers.attr({
                            "class": ""
                        });
                        this._comboDiv.focus();
                    }
                    if(this.element.data("pickerCurrentTab") == "List") {
                        var listWidth = this._getListPickerWidth();
                        pickers.css({
                            "width": listWidth,
                            "height": ""
                        });
                        pickers.css({
                            "font-size": ""
                        });
                        var parentElement = this._comboDiv[0].parentElement;
                        this._comboDiv.wijlist("destroy");
                        this._comboDiv.remove();
                        delete this._comboDiv;
                        this._initListPicker();
                        this._comboDiv.appendTo(parentElement);
                        this._comboDiv.focus();
                    }
                }
                if(this._isCalendarPickerShown()) {
                    this._syncCalendar();
                    if(this.element.data("pickerCurrentTab") == "Calendar") {
                        if(this._getPickerCount() <= 1) {
                            pickers.css({
                                "width": ""
                            }).attr({
                                "class": ""
                            });
                        }
                        pickers.css({
                            "font-size": ""
                        });
                    }
                }
                return true;
            };
            wijinputdate.prototype._hidePopup = function () {
                var pickers = this.element.data('pickers');
                if(pickers != undefined) {
                    pickers.wijpopup('hide');
                }
                this.element.data('divOK').css("visibility", "hidden");
            };
            wijinputdate.prototype._popupVisible = function () {
                var pickers = this.element.data('pickers');
                if(pickers != undefined) {
                    return pickers.wijpopup('isVisible');
                }
                return false;
            };
            wijinputdate.prototype._isComboListVisible = function () {
                return this._popupVisible();
            };
            wijinputdate.prototype._isValidDate = function (date, chkBounds) {
                if(date === undefined) {
                    return false;
                }
                if(isNaN(date)) {
                    return false;
                }
                if(date.getFullYear() < 1 || date.getFullYear() > 9999) {
                    return false;
                }
                if(chkBounds) {
                    if(this.options.minDate) {
                        if(date < this.options.minDate) {
                            return false;
                        }
                    }
                    if(this.options.maxDate) {
                        if(date > this.options.maxDate) {
                            return false;
                        }
                    }
                }
                return true;
            };
            wijinputdate.prototype._isValidatePickerFormat = function (format) {
                switch(format) {
                    case "yyyy":
                    case "M":
                    case "MM":
                    case "MMM":
                    case "MMMM":
                    case "d":
                    case "dd":
                    case "h":
                    case "hh":
                    case "m":
                    case "mm":
                    case "t":
                    case "tt":
                        return true;
                }
                return false;
            };
            wijinputdate.prototype._isDatePickerNeedReInit = function () {
                if(!this._isDatePickerShown()) {
                    return false;
                }
                var pickerMinYear = this.element.data("pickerMinYear");
                var pickerMaxYear = this.element.data("pickerMaxYear");
                var year = this._getPickerValue().getFullYear();
                if(year < pickerMinYear || year > pickerMaxYear) {
                    return true;
                }
                var minYear = this._isEraFormatExist() ? this._getRealEraMinDate().getFullYear() : this._getRealMinDate().getFullYear();
                var maxYear = this._isEraFormatExist() ? this._getRealEraMaxDate().getFullYear() : this._getRealMaxDate().getFullYear();
                if(pickerMinYear < minYear || pickerMaxYear > maxYear) {
                    return true;
                }
                return false;
            };
            wijinputdate.prototype._isDropDownButtonShown = function () {
                return this.options.showDropDownButton;
            };
            wijinputdate.prototype._isCalendarPickerShown = function () {
                return (this.options.pickers.calendar != undefined && this.options.pickers.calendar.visible !== false) || this._getPickerCount() == 0;
            };
            wijinputdate.prototype._isListPickerShown = function () {
                var comboItems = this._getcomboItems();
                if(comboItems != undefined && comboItems.length != undefined) {
                    return comboItems.length > 0;
                }
                return false;
            };
            wijinputdate.prototype._isTimePickerShown = function () {
                return this.options.pickers.timePicker != undefined && this.options.pickers.timePicker.visible !== false;
            };
            wijinputdate.prototype._isDatePickerShown = function () {
                return this.options.pickers.datePicker != undefined && this.options.pickers.datePicker.visible !== false;
            };
            wijinputdate.prototype._getPickerCount = function () {
                var count = 0;
                var calendarVisible = this.options.pickers.calendar != undefined && this.options.pickers.calendar.visible !== false;
                count += calendarVisible ? 1 : 0;
                count += this._isListPickerShown() ? 1 : 0;
                count += this._isTimePickerShown() ? 1 : 0;
                count += this._isDatePickerShown() ? 1 : 0;
                return count;
            };
            wijinputdate.prototype._addPickerEditor = function (pickerDiv, picker, pickerName) {
                var div = $("<div/>").attr({
                    "id": pickerName,
                    "align": "center"
                }).css({
                    "padding": "0px"
                }).append(picker).appendTo(pickerDiv);
            };
            wijinputdate.prototype._addPickerTab = function (ul, tab, href) {
                var li = $("<li/>").appendTo(ul).css("line-height", "1px");
                var a = $("<a/>").attr("href", href).html(tab).appendTo(li);
            };
            wijinputdate.prototype.selectText = /** Selects a range of text in the widget.
            * @param {Number} start Start of the range.
            * @param {Number} end End of the range.
            * @example
            * // Select first two symbols in a wijinputcore
            * $(".selector").wijinputcore("selectText", 0, 2);
            */
            function (start, end) {
                if (typeof start === "undefined") { start = 0; }
                if (typeof end === "undefined") { end = this.getText().length; }
                if(this.isFocused()) {
                    _super.prototype.selectText.call(this, start, end);
                } else {
                    this.focus();
                    var obj = this;
                    setTimeout(function () {
                        obj.selectText(start, end);
                    }, 0);
                }
            };
            return wijinputdate;
        })(input.wijinputcore);
        input.wijinputdate = wijinputdate;        
        var wijinputdate_options = (function () {
            function wijinputdate_options() {
                this.wijCSS = {
                    wijinputdate: input.wijinputcore.prototype.options.wijCSS.wijinput + "-date"
                };
                /** Determines the initial date value shown for the wijdateinput widget.
                */
                this.date = undefined;
                /** Determines the earliest, or minimum, date that can be entered.
                */
                this.minDate = null;
                /** Determines the latest, or maximum date, that can be entered.
                */
                this.maxDate = null;
                /** The format pattern to display the date value when control got focus.
                *
                * @remarks
                * wijinputdate supports two types of formats:
                * Standard Format and Custom Format.
                *
                * A standard date and time format string uses a single format specifier
                * to define the text representation of a date and time value.
                *
                * Possible values for Standard Format are:
                * "d": ShortDatePattern
                * "D": LongDatePattern
                * "f": Full date and time (long date and short time)
                * "F": FullDateTimePattern
                * "g": General (short date and short time)
                * "G": General (short date and long time)
                * "m": MonthDayPattern
                * "M": monthDayPattern
                * "r": RFC1123Pattern
                * "R": RFC1123Pattern
                * "s": SortableDateTimePattern
                * "t": shortTimePattern
                * "T": LongTimePattern
                * "u": UniversalSortableDateTimePattern
                * "U": Full date and time (long date and long time) using universal time
                * "y": YearMonthPattern
                * "Y": yearMonthPattern
                *
                * Any date and time format string that contains more than one character,
                * including white space, is interpreted as a custom date and time format
                * string. For example:
                * "mmm-dd-yyyy", "mmmm d, yyyy", "mm/dd/yyyy", "d-mmm-yyyy",
                * "ddd, mmmm dd, yyyy" etc.
                *
                * Below are the custom date and time format specifiers:
                *
                * "d": The day of the month, from 1 through 31.
                * "dd": The day of the month, from 01 through 31.
                * "ddd": The abbreviated name of the day of the week.
                * "dddd": The full name of the day of the week.
                * "m": The minute, from 0 through 59.
                * "mm": The minute, from 00 through 59.
                * "M": The month, from 1 through 12.
                * "MM": The month, from 01 through 12.
                * "MMM": The abbreviated name of the month.
                * "MMMM": The full name of the month.
                * "y": The year, from 0 to 99.
                * "yy": The year, from 00 to 99
                * "yyy": The year, with a minimum of three digits.
                * "yyyy": The year as a four-digit number
                * "h": The hour, using a 12-hour clock from 1 to 12.
                * "hh": The hour, using a 12-hour clock from 01 to 12.
                * "H": The hour, using a 24-hour clock from 0 to 23.
                * "HH": The hour, using a 24-hour clock from 00 to 23.
                * "s": The second, from 0 through 59.
                * "ss": The second, from 00 through 59.
                * "t": The first character of the AM/PM designator.
                * "tt": The AM/PM designator.
                */
                this.dateFormat = 'd';
                /** The format pattern to display the date value when control lost focus.
                *
                * @remarks
                * wijinputdate supports two types of formats:
                * Standard Format and Custom Format.
                *
                * A standard date and time format string uses a single format specifier
                * to define the text representation of a date and time value.
                *
                * Possible values for Standard Format are:
                * "d": ShortDatePattern
                * "D": LongDatePattern
                * "f": Full date and time (long date and short time)
                * "F": FullDateTimePattern
                * "g": General (short date and short time)
                * "G": General (short date and long time)
                * "m": MonthDayPattern
                * "M": monthDayPattern
                * "r": RFC1123Pattern
                * "R": RFC1123Pattern
                * "s": SortableDateTimePattern
                * "t": shortTimePattern
                * "T": LongTimePattern
                * "u": UniversalSortableDateTimePattern
                * "U": Full date and time (long date and long time) using universal time
                * "y": YearMonthPattern
                * "Y": yearMonthPattern
                *
                * Any date and time format string that contains more than one character,
                * including white space, is interpreted as a custom date and time format
                * string. For example:
                * "mmm-dd-yyyy", "mmmm d, yyyy", "mm/dd/yyyy", "d-mmm-yyyy",
                * "ddd, mmmm dd, yyyy" etc.
                *
                * Below are the custom date and time format specifiers:
                *
                * "d": The day of the month, from 1 through 31.
                * "dd": The day of the month, from 01 through 31.
                * "ddd": The abbreviated name of the day of the week.
                * "dddd": The full name of the day of the week.
                * "m": The minute, from 0 through 59.
                * "mm": The minute, from 00 through 59.
                * "M": The month, from 1 through 12.
                * "MM": The month, from 01 through 12.
                * "MMM": The abbreviated name of the month.
                * "MMMM": The full name of the month.
                * "y": The year, from 0 to 99.
                * "yy": The year, from 00 to 99
                * "yyy": The year, with a minimum of three digits.
                * "yyyy": The year as a four-digit number
                * "h": The hour, using a 12-hour clock from 1 to 12.
                * "hh": The hour, using a 12-hour clock from 01 to 12.
                * "H": The hour, using a 24-hour clock from 0 to 23.
                * "HH": The hour, using a 24-hour clock from 00 to 23.
                * "s": The second, from 0 through 59.
                * "ss": The second, from 00 through 59.
                * "t": The first character of the AM/PM designator.
                * "tt": The AM/PM designator.
                */
                this.displayFormat = '';
                /** Determines string designator for hours that are "ante meridiem" (before noon).
                */
                this.amDesignator = "";
                /** Determines the string designator for hours that are "post meridiem" (after noon).
                */
                this.pmDesignator = "";
                /** A bool value determines whether to express midnight as 24:00.
                */
                this.midnightAs0 = true;
                /** A bool value determines the range of hours that can be entered in the control.
                * @remarks
                * If set this property to false,
                * the control sets the range for the hour field from 1 - 12.  If set to true
                * the range is set to 0 - 11.
                */
                this.hour12As0 = false;
                /** Determins whether or not the next control in the tab order receives
                * the focus as soon as the control is filled at the last character.
                */
                this.blurOnLastChar = false;
                /** Gets or set whether the focus automatically moves to the next or previous
                * tab ordering control when pressing the left, right arrow keys.
                */
                this.blurOnLeftRightKey = "none";
                /** Gets or sets whether the tab key moves the focus between controls or between
                * fields within the control, possible values is "field", "control".
                * @remarks
                * The caret moves to the next field when this property is "field".
                * If the caret is in the last field, the input focus leaves this control when pressing the TAB key.
                * If the value is "control", the behavior is similar to the standard control.
                */
                this.tabAction = "field";
                /** Determines how the control should interpret incomplete year information
                * when the "smartInputMode" option is set to true.
                * @remarks
                * For example, if "startYear" is set to 1950 (the default),
                * then years "0000" to "0050" will be converted to "2000" to "2050",
                * and years "0051" to "0099" will be converted to "1951" to "1999".
                */
                this.startYear = 1950;
                /** Determines whether the control should interpret incomplete year information
                * using the value provided in the "startYear" option.
                * @remarks
                * If this option is set to true, the control will interpret years in the format "00**" as "20**" or "19**",
                * depending on the value of "startYear".
                */
                this.smartInputMode = false;
                /** Determines the active field index.
                */
                this.activeField = 0;
                /** Determines the time span, in milliseconds,
                * between two input intentions.
                * @remarks
                * when press a keyboard, and the widget will delay a time and then handle
                * the next keyboard press. Use this option to control the speed of the key press.
                */
                this.keyDelay = 800;
                /** Determines whether to automatically moves to the next field.
                * @remarks
                * For example, if user want input the '2012-9-20' in inputdate widget,
                * if this option's value is true, when user type '2012' in textbox,
                * it will auto focus in next field, user can type '9' in second field,
                * if this option's value is false, user want to type '9' in second field,
                * they should focus the second field by manual.
                */
                this.autoNextField = true;
                /** This option will supply an element to init the calendar widget
                * @remarks
                * If the value is 'default', the widget will create a div and
                * append it to body element, and using this element to init calendar.
                * User can set this option value to an element,
                * and the widget will init the calendar using this element.
                */
                this.calendar = 'default';
                /** Detemines the popup position of a calendar.
                * See jQuery.ui.position for position options.
                */
                this.popupPosition = {
                    offset: '0 4'
                };
                /** Determines the input method setting of widget.
                * Possible values are: 'auto', 'active', 'inactive', 'disabled'
                * @remarks
                * This property only take effect on IE browser.
                */
                this.imeMode = "auto";
                /** Determines whether dropdown button is displayed.
                */
                this.showDropDownButton = true;
                /** Determines whether dropdown button is displayed.
                */
                this.showTrigger = undefined;
                /** An object contains the settings for the dropdown list.
                * @example
                * //  The following code show the dropdown calendar, dropdown list,
                * //  and set the dorpdown window's width to 100px, height to 30px;
                * $(".selector").wijinputdate({
                *     pickers: {
                *         calendar: {},
                *         list: [{ label: 'item1', value: 1 }],
                *         width: 100,
                *         height: 30
                *     }
                * });
                *
                * // The following code show the dropdown date picker and dropdown time picker,
                * // also it sets the time picker's format ot "hh hh:mm".
                * $(".selector").wijinputdate({
                *     pickers: {
                *         datePicker: {},
                *         timePicker: { format: "tt hh:mm" }
                *     }
                * });
                *
                * // The following code shows the drpdown date picker and dropdown time picker.
                * // also it sets the date picker's format to "yyyy/MMMM/dd".
                * $(".selector").wijinputdate({
                *     pickers: {
                *         datePicker: { format: "yyyy/MMMM/dd" },
                *         timePicker: {}
                *     }
                * });
                */
                this.pickers = {
                    list: undefined,
                    width: undefined,
                    height: undefined,
                    calendar: undefined,
                    datePicker: undefined,
                    timePicker: undefined
                };
                /** The dateChanged event handler.
                * A function called when the date of the input is changed.
                * @event
                * @dataKey {Date} date The data with this event.
                */
                this.dateChanged = null;
                /** The spinUp event handler.
                * A function called when spin up event fired.
                */
                this.spinUp = null;
                /** The spinDown event handler.
                * A function called when spin down event fired.
                */
                this.spinDown = null;
                /** The valueBoundsExceeded event hander.
                * A function called when the valueBoundExceeded event fired.
                */
                this.valueBoundsExceeded = null;
            }
            return wijinputdate_options;
        })();        
        wijinputdate.prototype.options = $.extend(true, {
        }, input.wijinputcore.prototype.options, new wijinputdate_options());
        $.wijmo.registerWidget("wijinputdate", wijinputdate.prototype);
        var DateTimeInfo = (function () {
            function DateTimeInfo() { }
            DateTimeInfo.EraDates = new Array(new Date(1868, 9 - 1, 8), new Date(1912, 7 - 1, 30), new Date(1926, 12 - 1, 25), new Date(1989, 1 - 1, 8));
            DateTimeInfo.EraCount = 4;
            DateTimeInfo.EraYears = new Array(45, 15, 64, 99);
            DateTimeInfo.EraMax = new Date(2087, 12 - 1, 31, 23, 59, 59);
            DateTimeInfo.EraMin = new Date(1868, 9 - 1, 8);
            DateTimeInfo.EraKeys = new Array("1", "2", "3", "4", "m", "t", "s", "h");
            DateTimeInfo.EraIndices = new Array(0, 1, 2, 3, 0, 1, 2, 3);
            DateTimeInfo.DateLongFormat = "yyyyMMddHHmmss";
            DateTimeInfo.EraNames = new Array("M", "T", "S", "H", "\u660E", "\u5927", "\u662D", "\u5E73", "\u660E\u6CBB", "\u5927\u6B63", "\u662D\u548C", "\u5E73\u6210");
            DateTimeInfo.WeekDays = new Array("\u65e5\u66dc\u65e5", "\u6708\u66dc\u65e5", "\u706b\u66dc\u65e5", "\u6c34\u66dc\u65e5", "\u6728\u66dc\u65e5", "\u91d1\u66dc\u65e5", "\u571f\u66dc\u65e5");
            DateTimeInfo.MonthNames = new Array("\u0031\u6708", "\u0032\u6708", "\u0033\u6708", "\u0034\u6708", "\u0035\u6708", "\u0036\u6708", "\u0037\u6708", "\u0038\u6708", "\u0039\u6708", "\u0031\u0030\u6708", "\u0031\u0031\u6708", "\u0031\u0032\u6708");
            DateTimeInfo.ShortWeekDays = new Array("\u65e5", "\u6708", "\u706b", "\u6c34", "\u6728", "\u91d1", "\u571f");
            DateTimeInfo.ShortMonthNames = new Array("\u0031", "\u0032", "\u0033", "\u0034", "\u0035", "\u0036", "\u0037", "\u0038", "\u0039", "\u0031\u0030", "\u0031\u0031", "\u0031\u0032");
            DateTimeInfo.RokuyouTextArray = new Array("\u5148\u52dd", "\u53cb\u5f15", "\u5148\u8ca0", "\u4ecf\u6ec5", "\u5927\u5b89", "\u8d64\u53e3");
            DateTimeInfo.RokuyouTextArrayEn = new Array("Senshou", "Tomobiki", "Senbu", "Butsumetsu", "Taian", "Shakkou");
            DateTimeInfo.DefaultTwoDigitYear = 2029;
            DateTimeInfo.Digits = 2;
            DateTimeInfo.EraYearMax = 99;
            DateTimeInfo.RokuyouMin = new Date(1960, 0, 28);
            DateTimeInfo.RokuyouMax = new Date(2050, 0, 22);
            DateTimeInfo.LunarInfo = new Array(0x0aea6, 0x0ab50, 0x04d60, 0x0aae4, 0x0a570, 0x05270, 0x07263, 0x0d950, 0x06b57, 0x056a0, 0x09ad0, 0x04dd5, 0x04ae0, 0x0a4e0, 0x0d4d4, 0x0d250, 0x0d598, 0x0b540, 0x0d6a0, 0x0195a6, 0x095b0, 0x049b0, 0x0a9b4, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0b756, 0x02b60, 0x095b0, 0x04b75, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06d98, 0x055d0, 0x02b60, 0x096e5, 0x092e0, 0x0c960, 0x0e954, 0x0d4a0, 0x0da50, 0x07552, 0x056c0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x1b4a3, 0x0b550, 0x055d9, 0x04ba0, 0x0a5b0, 0x05575, 0x052b0, 0x0a950, 0x0b954, 0x06aa0, 0x0ad50, 0x06b52, 0x04b60, 0x0a6e6, 0x0a570, 0x05270, 0x06a65, 0x0d930, 0x05aa0, 0x0b6a3, 0x096d0, 0x04bd7, 0x04ae0, 0x0a4d0, 0x01d0d6, 0x0d250, 0x0d520, 0x0dd45, 0x0b6a0, 0x096d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0b250, 0x01b255, 0x06d40, 0x0ada0);
            DateTimeInfo.IsValidEraDate = function IsValidEraDate(date) {
                if(date < this.GetEraMin() || date > this.GetEraMax()) {
                    return false;
                }
                return true;
            };
            DateTimeInfo.ConvertToGregorianYear = function ConvertToGregorianYear(era, eraYear, strict) {
                if(era < 0 || era >= this.GetEraCount() || eraYear < 1 || strict && eraYear > this.GetEraYears()[era]) {
                    return -1;
                }
                return this.GetEraDates()[era].getFullYear() + eraYear - 1;
            };
            DateTimeInfo.GetEraDates = function GetEraDates() {
                if(window.eras != undefined) {
                    var eraDates = new Array();
                    for(var i = 0; i < window.eras.length; i++) {
                        var date = new Date(window.eras[i].startDate.replace(/-/g, "/"));
                        eraDates[i] = date;
                    }
                    return eraDates;
                }
                return this.EraDates;
            };
            DateTimeInfo.GetEraNames = function GetEraNames() {
                var eraNames = new Array();
                if(window.eras != undefined) {
                    for(var i = 0; i < window.eras.length; i++) {
                        eraNames[i] = window.eras[i].name;
                    }
                    return eraNames;
                }
                for(var i = 0; i < this.EraCount; i++) {
                    eraNames[i] = this.EraNames[i + 2 * this.EraCount];
                }
                return eraNames;
            };
            DateTimeInfo.GetEraSymbols = function GetEraSymbols() {
                var eraSymbol = new Array();
                if(window.eras != undefined) {
                    for(var i = 0; i < window.eras.length; i++) {
                        eraSymbol[i] = window.eras[i].symbol;
                    }
                    return eraSymbol;
                }
                for(var i = 0; i < this.EraCount; i++) {
                    eraSymbol[i] = this.EraNames[i];
                    ;
                }
                return eraSymbol;
            };
            DateTimeInfo.GetEraAbbreviations = function GetEraAbbreviations() {
                var eraAbbreviation = new Array();
                if(window.eras != undefined) {
                    for(var i = 0; i < window.eras.length; i++) {
                        eraAbbreviation[i] = window.eras[i].abbreviation;
                    }
                    return eraAbbreviation;
                }
                for(var i = 0; i < this.EraCount; i++) {
                    eraAbbreviation[i] = this.EraNames[i + this.EraCount];
                }
                return eraAbbreviation;
            };
            DateTimeInfo.GetEraShortNames = function GetEraShortNames() {
                var eraShortName = new Array();
                if(window.eras != undefined) {
                    for(var i = 0; i < window.eras.length; i++) {
                        eraShortName[i] = window.eras[i].shortcuts.split(',')[1];
                    }
                    return eraShortName;
                }
                for(var i = 0; i < this.EraCount; i++) {
                    eraShortName[i] = this.EraNames[i];
                }
                return eraShortName;
            };
            DateTimeInfo.GetEraShortcuts = function GetEraShortcuts() {
                var eraShortcuts = new Array();
                if(window.eras != undefined) {
                    for(var i = 0; i < window.eras.length; i++) {
                        eraShortcuts[i] = window.eras[i].shortcuts.split(',')[0];
                    }
                    return eraShortcuts;
                }
                for(var i = 0; i < this.EraCount; i++) {
                    eraShortcuts[i] = this.EraKeys[i];
                }
                return eraShortcuts;
            };
            DateTimeInfo.GetEraMax = function GetEraMax() {
                if(window.eras != undefined) {
                    if(window.eras.length > 0) {
                        var date = new Date(window.eras[window.eras.length - 1].startDate.replace(/-/g, "/"));
                        date.setFullYear(date.getFullYear() + 99);
                        return date;
                    }
                }
                return this.EraMax;
            };
            DateTimeInfo.GetEraMin = function GetEraMin() {
                if(window.eras != undefined) {
                    if(window.eras.length > 0) {
                        var date = new Date(window.eras[0].startDate.replace(/-/g, "/"));
                        return date;
                    }
                }
                return this.EraMin;
            };
            DateTimeInfo.GetEraCount = function GetEraCount() {
                if(window.eras != undefined) {
                    return window.eras.length;
                }
                return this.EraCount;
            };
            DateTimeInfo.GetEraYears = function GetEraYears() {
                if(window.eras != undefined) {
                    var eraYears = new Array();
                    for(var i = 1; i < window.eras.length; i++) {
                        var date1 = new Date(window.eras[i - 1].startDate.replace(/-/g, "/"));
                        var date2 = new Date(window.eras[i].startDate.replace(/-/g, "/"));
                        eraYears[i - 1] = date2.getFullYear() - date1.getFullYear() + 1;
                    }
                    eraYears[i - 1] = 99;
                    return eraYears;
                }
                return this.EraYears;
            };
            DateTimeInfo.ConvertToGregorianDate = function ConvertToGregorianDate(era, eraYear, month, day, hour, minute, second, strict) {
                var year = this.ConvertToGregorianYear(era, eraYear, strict);
                if(year < 1 || year > 9999) {
                    return null;
                }
                if(month < 1 || month > 12) {
                    return null;
                }
                var maxdays = this.DaysInMonth(year, month);
                if(day < 1 || day > maxdays) {
                    return null;
                }
                if(hour < 0 || hour > 23) {
                    return null;
                }
                if(minute < 0 || minute > 59) {
                    return null;
                }
                if(second < 0 || second > 59) {
                    return null;
                }
                var dateTime = new Date(year, month - 1, day, hour, minute, second);
                if(strict) {
                    var startDate = this.GetEraDates()[era];
                    var endDate = era + 1 != this.GetEraCount() ? this.AddMilliseconds(this.GetEraDates()[era + 1], -1) : this.GetEraMax();
                    if(dateTime < startDate || dateTime > endDate) {
                        return null;
                    }
                }
                return dateTime;
            };
            DateTimeInfo.String2Date = function String2Date(value) {
                if(value == null || value.Length == 0) {
                    return null;
                }
                var date = new Date(Date.parse(value));
                return date;
            };
            DateTimeInfo.Date2String = function Date2String(date, isJapan, IsjqDate, IsjqTime) {
                var strDate = "";
                try  {
                    if(isJapan == true) {
                        if(IsjqDate == true) {
                            strDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
                        } else if(IsjqTime == true) {
                            strDate = date.getHours() + ":" + input.Utility.ToString(date.getMinutes(), 2, "0") + ":" + input.Utility.ToString(date.getSeconds(), 2, "0");
                        } else {
                            strDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + input.Utility.ToString(date.getMinutes(), 2, "0") + ":" + input.Utility.ToString(date.getSeconds(), 2, "0");
                        }
                    } else {
                        if(IsjqDate == true) {
                            strDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
                        } else if(IsjqTime == true) {
                            strDate = date.getHours() + ":" + input.Utility.ToString(date.getMinutes(), 2, "0") + ":" + input.Utility.ToString(date.getSeconds(), 2, "0");
                        } else {
                            strDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + input.Utility.ToString(date.getMinutes(), 2, "0") + ":" + input.Utility.ToString(date.getSeconds(), 2, "0");
                        }
                    }
                } catch (ex) {
                    strDate = "";
                }
                return strDate;
            };
            DateTimeInfo.Date2Long = function Date2Long(date) {
                try  {
                    return (date.getFullYear() * 100 + date.getMonth() + 1) * 100 + date.getDate();
                } catch (ex) {
                    return 0;
                }
            };
            DateTimeInfo.Date2Number = function Date2Number(date) {
                if(date == null) {
                    return 0;
                }
                return ((((date.getFullYear() * 100 + date.getMonth() + 1) * 100 + date.getDate()) * 100 + date.getHours()) * 100 + date.getMinutes()) * 100 + date.getSeconds();
            };
            DateTimeInfo.Long2Date = function Long2Date(value) {
                return new Date(Math.floor(value / 10000), Math.floor((value % 10000) / 100) - 1, value % 100);
            };
            DateTimeInfo.GetEraDate = function GetEraDate(date) {
                var eraDate = new Object();
                eraDate.era = -1;
                eraDate.eraYear = -1;
                if(!this.IsValidEraDate(date)) {
                    return eraDate;
                }
                for(var i = 0; i < this.GetEraCount(); i++) {
                    var nextDate = i + 1 != this.GetEraCount() ? this.GetEraDates()[i + 1] : this.AddMilliseconds(this.GetEraMax(), 1);
                    if(date < nextDate) {
                        eraDate.era = i;
                        eraDate.eraYear = date.getFullYear() - this.GetEraDates()[i].getFullYear() + 1;
                        break;
                    }
                }
                return eraDate;
            };
            DateTimeInfo.MakeDate = function MakeDate(era, erayear, month, day) {
                var date = new Date();
                date = this.ConvertToGregorianDate(era, erayear, month, day, 0, 0, 0, true);
                if(date == null) {
                    return -1;
                }
                return date;
            };
            DateTimeInfo.GetValidMonthRange = function GetValidMonthRange(era, eraYear) {
                var monthRange = {
                };
                monthRange.min = 1;
                monthRange.max = 12;
                if(era == -1 || eraYear == -1) {
                    return monthRange;
                }
                if(eraYear == 1) {
                    monthRange.min = this.GetEraDates()[era].getMonth() + 1;
                } else if(eraYear == this.EraYears[era] && era < this.EraCount - 1) {
                    monthRange.max = this.AddMilliseconds(this.GetEraDates()[era + 1], -1).getMonth() + 1;
                }
                return monthRange;
            };
            DateTimeInfo.GetValidDayRange = function GetValidDayRange(era, eraYear, month) {
                var dayRange = new Object();
                dayRange.min = 1;
                dayRange.max = this.DaysInMonth(this.ConvertToGregorianYear(era, eraYear, true), month);
                var eraMin = this.GetEraDates()[era];
                var eraMax = era < this.GetEraCount() - 1 ? this.AddMilliseconds(this.GetEraDates()[era + 1], -1) : this.GetEraMax();
                if(era == -1 || eraYear == -1) {
                    return dayRange;
                }
                if(eraYear == 1 && month == eraMin.getMonth() + 1) {
                    dayRange.min = eraMin.getDate();
                } else if(eraYear == this.EraYears[era] && month == eraMax.getMonth() + 1) {
                    dayRange.max = eraMax.getDate();
                }
                return dayRange;
            };
            DateTimeInfo.IsLeapYear = function IsLeapYear(year) {
                if((year % 400 == 0) || ((year % 4 == 0) && (year % 100 != 0))) {
                    return true;
                } else {
                    return false;
                }
            };
            DateTimeInfo.DayOfYear = function DayOfYear(year, month, day) {
                var sum = 0;
                for(var i = 1; i < month; i++) {
                    sum = sum + this.DaysInMonth(year, i);
                }
                sum = sum + day;
                return sum;
            };
            DateTimeInfo.DaysInMonth = function DaysInMonth(year, month) {
                if(month > 12) {
                    year += Math.floor(month / 12);
                    month = month % 12;
                } else if(month < 0) {
                    var zMonth = month * (-1);
                    year -= Math.ceil(zMonth / 12);
                    month = 12 - zMonth % 12;
                }
                switch(month) {
                    case 2:
                        if(this.IsLeapYear(year)) {
                            return 29;
                        } else {
                            return 28;
                        }
                        break;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        return 30;
                        break;
                    default:
                        return 31;
                        break;
                }
            };
            DateTimeInfo.Equal = function Equal(date1, date2, strict) {
                if(date1 == null && date2 == null) {
                    return true;
                } else if(date1 == null) {
                    return false;
                } else if(date2 == null) {
                    return false;
                }
                try  {
                    if(!strict) {
                        if(date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate()) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if(date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate() && date1.getHours() == date2.getHours() && date1.getMinutes() == date2.getMinutes() && date1.getSeconds() == date2.getSeconds()) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            };
            DateTimeInfo.YearMonthEqual = function YearMonthEqual(date1, date2) {
                if(date1 == null && date2 == null) {
                    return true;
                } else if(date1 == null) {
                    return false;
                } else if(date2 == null) {
                    return false;
                }
                try  {
                    if(date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth()) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            };
            DateTimeInfo.SetDate = function SetDate(year, month, day) {
                var newDate = new Date();
                var maxMonth = 9999 * 12 + 12;
                if(year * 12 + month > maxMonth) {
                    newDate = new Date(9999, 11, 31);
                } else if(year * 12 + month < 100) {
                    newDate = new Date(100, 0, 1);
                } else {
                    var days = this.DaysInMonth(year, month);
                    if(day > days) {
                        day = days;
                    }
                    newDate = new Date(year, month - 1, day);
                }
                return newDate;
            };
            DateTimeInfo.SetFullDate = function SetFullDate(year, month, day) {
                var newDate = new Date();
                newDate.setDate(1);
                var maxMonth = 9999 * 12 + 12;
                var days = this.DaysInMonth(year, month);
                if((month > 0) && (month < 12) && (day > days)) {
                    day = days;
                }
                newDate.setFullYear(year);
                newDate.setMonth(month - 1);
                newDate.setDate(day);
                return newDate;
            };
            DateTimeInfo.SetFullDateByDate = function SetFullDateByDate(date) {
                var newDate = new Date();
                newDate.setDate(1);
                newDate.setFullYear(date.getFullYear());
                newDate.setMonth(date.getMonth());
                newDate.setDate(date.getDate());
                newDate.setHours(0, 0, 0, 0);
                return newDate;
            };
            DateTimeInfo.LYearDays = function LYearDays(y) {
                var i, sum = 348;
                for(i = 0x8000; i > 0x8; i >>= 1) {
                    sum += (this.LunarInfo[y - 1960] & i) ? 1 : 0;
                }
                return (sum + this.leapDays(y));
            };
            DateTimeInfo.leapDays = function leapDays(y) {
                if(this.LeapMonth(y)) {
                    return ((this.LunarInfo[y - 1960] & 0x10000) ? 30 : 29);
                } else {
                    return (0);
                }
            };
            DateTimeInfo.LeapDays = function LeapDays(y) {
                if(this.LeapMonth(y)) {
                    return ((this.LunarInfo[y - 1960] & 0x10000) ? 30 : 29);
                } else {
                    return (0);
                }
            };
            DateTimeInfo.LeapMonth = function LeapMonth(y) {
                return (this.LunarInfo[y - 1960] & 0xf);
            };
            DateTimeInfo.MonthDays = function MonthDays(y, m) {
                return ((this.LunarInfo[y - 1960] & (0x10000 >> m)) ? 30 : 29);
            };
            DateTimeInfo.GetRokuyou = function GetRokuyou(date) {
                if((date - this.RokuyouMin) < 0 || (date - this.RokuyouMax) > 0) {
                    return;
                }
                var i, leap = 0, temp = 0;
                var baseDate = new Date(1960, 0, 28);
                var offset = Math.round((date - baseDate) / 86400000);
                for(i = 1960; i < 2050 && offset > 0; i++) {
                    temp = this.LYearDays(i);
                    offset -= temp;
                }
                if(offset < 0) {
                    offset += temp;
                    i--;
                }
                this.year = i;
                leap = this.LeapMonth(i);
                this.isLeap = false;
                for(i = 1; i < 13 && offset > 0; i++) {
                    if(leap > 0 && i == (leap + 1) && this.isLeap == false) {
                        --i;
                        this.isLeap = true;
                        temp = this.LeapDays(this.year);
                    } else {
                        temp = this.MonthDays(this.year, i);
                    }
                    if(this.isLeap == true && i == (leap + 1)) {
                        this.isLeap = false;
                    }
                    offset -= temp;
                }
                if(offset == 0 && leap > 0 && i == leap + 1) {
                    if(this.isLeap) {
                        this.isLeap = false;
                    } else {
                        this.isLeap = true;
                        --i;
                    }
                }
                if(offset < 0) {
                    offset += temp;
                    --i;
                }
                this.month = i;
                this.day = offset + 1;
                var index = (this.month + this.day - 2) % 6;
                var errorRange1Min = new Date(1996, 6, 15);
                var errorRange1Max = new Date(1996, 7, 13);
                if(this.IsDateInRange(date, errorRange1Min, errorRange1Max)) {
                    index = (6 + index - 1) % 6;
                }
                var errorRange2Min = new Date(1996, 8, 12);
                var errorRange2Max = new Date(1996, 9, 11);
                if(this.IsDateInRange(date, errorRange2Min, errorRange2Max)) {
                    index = (6 + index - 1) % 6;
                }
                var errorRange3Min = new Date(2033, 7, 25);
                var errorRange3Max = new Date(2033, 11, 21);
                if(this.IsDateInRange(date, errorRange3Min, errorRange3Max)) {
                    index = (index + 1) % 6;
                }
                if(this.Equal(date, errorRange1Min)) {
                    index = (6 + index - 1) % 6;
                }
                if(this.Equal(date, errorRange2Min)) {
                    index = (6 + index - 1) % 6;
                }
                var rokuyou;
                //switch (index) {
                //    case 0:
                //        rokuyou = GrapeCity.IM.Rokuyou.Senshou;
                //        break;
                //    case 1:
                //        rokuyou = GrapeCity.IM.Rokuyou.Tomobiki;
                //        break;
                //    case 2:
                //        rokuyou = GrapeCity.IM.Rokuyou.Senbu;
                //        break;
                //    case 3:
                //        rokuyou = GrapeCity.IM.Rokuyou.Butsumetsu;
                //        break;
                //    case 4:
                //        rokuyou = GrapeCity.IM.Rokuyou.Taian;
                //        break;
                //    case 5:
                //        rokuyou = GrapeCity.IM.Rokuyou.Shakkou;
                //        break;
                //    default:
                //        break;
                //}
                return rokuyou;
            };
            DateTimeInfo.IsDateInRange = function IsDateInRange(dt, min, max) {
                var dtYear = dt.getYear();
                var minYear = min.getYear();
                var maxYear = max.getYear();
                var dtMonth = dt.getMonth();
                var minMonth = min.getMonth();
                var maxMonth = max.getMonth();
                var dtDay = dt.getDate();
                var minDay = min.getDate();
                var maxDay = max.getDate();
                var dtValue = dtYear * 10000 + dtMonth * 100 + dtDay;
                var minValue = minYear * 10000 + minMonth * 100 + minDay;
                var maxValue = maxYear * 10000 + maxMonth * 100 + maxDay;
                return dtValue >= minValue && dtValue <= maxValue;
            };
            DateTimeInfo.GetRokuyouText = function GetRokuyouText(rokuyou) {
                var rokuyouArray = new Array();
                //if (GrapeCity.IM.Localization.Region == "ja") {
                rokuyouArray = this.RokuyouTextArray.slice(0);
                //}
                //else {
                //    rokuyouArray = this.RokuyouTextArrayEn.slice(0);
                //}
                switch(rokuyou) {
                    default:
                        //case GrapeCity.IM.Rokuyou.None:
                        //    return "";
                        //    break;
                        //case GrapeCity.IM.Rokuyou.Senshou:
                        //    return rokuyouArray[0];
                        //    break;
                        //case GrapeCity.IM.Rokuyou.Tomobiki:
                        //    return rokuyouArray[1];
                        //    break;
                        //case GrapeCity.IM.Rokuyou.Senbu:
                        //    return rokuyouArray[2];
                        //    break;
                        //case GrapeCity.IM.Rokuyou.Butsumetsu:
                        //    return rokuyouArray[3];
                        //    break;
                        //case GrapeCity.IM.Rokuyou.Taian:
                        //    return rokuyouArray[4];
                        //    break;
                        //case GrapeCity.IM.Rokuyou.Shakkou:
                        //    return rokuyouArray[5];
                        //    break;
                        return "";
                        break;
                }
            };
            DateTimeInfo.DaysInSpecialWeek = function DaysInSpecialWeek(year, month, weekFlay) {
                var selections = new Array();
                var days = this.DaysInMonth(year, month + 1);
                var date = new Date(year, month, 1);
                var firstDateOfWeekTitle;
                //Get the firstDateOfWeekTitle, then break
                for(var i = 1; i <= days; i++) {
                    date.setDate(i);
                    if(date.getDay() == weekFlay) {
                        var selectedDate = new Date(year, month, i);
                        selections.push(selectedDate);
                        firstDateOfWeekTitle = i;
                        break;
                    }
                }
                firstDateOfWeekTitle += 7;
                while(firstDateOfWeekTitle <= days) {
                    date.setDate(firstDateOfWeekTitle);
                    var followSelectedDate = new Date(year, month, firstDateOfWeekTitle);
                    selections.push(followSelectedDate);
                    firstDateOfWeekTitle += 7;
                }
                return selections;
            };
            DateTimeInfo.GetDaysByFirstWeekday = function GetDaysByFirstWeekday(firstWeekday) {
                var days = new Array();
                days.push(firstWeekday);
                var date = new Date(firstWeekday);
                while(date.getDate() + 7 <= this.DaysInMonth(firstWeekday.getFullYear(), firstWeekday.getMonth() + 1)) {
                    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
                    days.push(date);
                }
                return days;
            };
            DateTimeInfo.AddMilliseconds = function AddMilliseconds(date, msec) {
                var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                newDate.setMilliseconds(newDate.getMilliseconds() + msec);
                return new Date(newDate.valueOf());
            };
            DateTimeInfo.GetWeekIndexByDate = function GetWeekIndexByDate(date) {
                return Math.floor(date.getDate() / 7);
            };
            return DateTimeInfo;
        })();
        input.DateTimeInfo = DateTimeInfo;        
        var wijDateTextProvider = (function (_super) {
            __extends(wijDateTextProvider, _super);
            function wijDateTextProvider(inputWidget, format, displayFormat) {
                        _super.call(this);
                this.inputWidget = inputWidget;
                this.maskPartsCount = 0;
                this.pattern = 'M/d/yyyy';
                this.displayPattern = 'M/d/yyyy';
                this._disableSmartInputMode = false;
                this.paddingZero = paddingZero;
                this.descriptors = new Array(0);
                this.desPostions = new Array(0);
                this.fields = new Array(0);
                this.displayDescriptors = new Array(0);
                this.displayDesPostions = new Array(0);
                this.displayFields = new Array(0);
                this._setFormat(format);
                displayFormat = displayFormat == "" ? format : displayFormat;
                this._setDisplayFormat(displayFormat);
            }
            wijDateTextProvider.prototype.initialize = function () {
            };
            wijDateTextProvider.prototype.getFiledText = function (index) {
                var desc = this.fields[index];
                return desc.getText();
            };
            wijDateTextProvider.prototype.getFieldCount = function () {
                return this.fields.length;
            };
            wijDateTextProvider.prototype.getFieldRange = function (index) {
                if(index >= this.fields.length) {
                    index = this.fields.length - 1;
                }
                var desc = this.fields[index];
                return {
                    start: desc.startIndex,
                    end: desc.startIndex + desc.getText().length
                };
            };
            wijDateTextProvider.prototype.getCursorField = function (pos) {
                if(this.desPostions.length == 0) {
                    return 0;
                }
                pos = Math.min(pos, this.desPostions.length - 1);
                pos = Math.max(pos, 0);
                var desc = this.desPostions[pos].desc, i;
                if(desc.type === -1) {
                    i = $.inArray(desc, this.descriptors);
                    if(i > 0 && this.descriptors[i - 1].type !== -1) {
                        desc = this.descriptors[i - 1];
                    } else {
                        return -1;// liternal
                        
                    }
                }
                return $.inArray(desc, this.fields);
            };
            wijDateTextProvider.prototype.needToMove = function (index, pos, ch) {
                if(!this.inputWidget._isValidDate(this.inputWidget._safeGetDate(), true)) {
                    return false;
                }
                var desc = this.fields[index];
                switch(desc.type) {
                    case 72:
                    case 73:
                    case 74:
                        for(var i = 0; i < DateTimeInfo.GetEraCount(); i++) {
                            if((ch.toLowerCase() === DateTimeInfo.GetEraShortcuts()[i].toLowerCase()) || (ch.toLowerCase() === DateTimeInfo.GetEraShortNames()[i].toLowerCase()) || (ch.toLowerCase() === DateTimeInfo.GetEraAbbreviations()[i].toLowerCase()) || (ch.toLowerCase() === DateTimeInfo.GetEraNames()[i].toLowerCase())) {
                                return true;
                            }
                        }
                        return false;
                }
                var val = parseInt(ch, 10);
                if(pos === desc.maxLen) {
                    return true;
                }
                if(isNaN(val)) {
                    return false;
                }
                var lastInputChar = this.inputWidget.element.data("lastInputChar");
                switch(desc.type) {
                    case 10:
                        return (this._isSmartInputMode() && pos === 2);
                    case 20:
                    case 25:
                    case 45:
                    case 46: {
                        if(lastInputChar == "0" && val == 1) {
                            return true;
                        }
                        return val > 1;
                    }
                    case 47:
                    case 48: {
                        if(lastInputChar == "0" && val <= 2) {
                            return true;
                        }
                        return val > 2;
                    }
                    case 30:
                    case 31: {
                        if(lastInputChar == "0" && val <= 3) {
                            return true;
                        }
                        return val > 3;
                    }
                    case 50:
                    case 51:
                    case 60:
                    case 61: {
                        if(lastInputChar == "0" && val <= 6) {
                            return true;
                        }
                        return val > 6;
                    }
                    case 70:
                    case 71:
                        return false;
                }
                return false;
            };
            wijDateTextProvider.prototype._isEraFormatExist = function () {
                for(var i = 0; i < this.descriptors.length; i++) {
                    if(this.descriptors[i].type >= 70 && this.descriptors[i].type <= 74) {
                        return true;
                    }
                }
                return false;
            };
            wijDateTextProvider.prototype._getCulture = function () {
                return this.inputWidget._getCulture();
            };
            wijDateTextProvider.prototype._isDigitString = function (s) {
                s = $.trim(s);
                if(s.length === 0) {
                    return true;
                }
                var c = s.charAt(0), f, t;
                if(c === '+' || c === '-') {
                    s = s.substr(1);
                    s = $.trim(s);
                }
                if(s.length === 0) {
                    return true;
                }
                try  {
                    f = parseFloat(s);
                    t = f.toString();
                    return t === s;
                } catch (e) {
                    return false;
                }
            };
            wijDateTextProvider.prototype._setFormat = function (format) {
                var culture = this.inputWidget._getCulture();
                if(culture == null) {
                    return;
                }
                this.pattern = this._parseFormatToPattern(format);
                this.descriptors = this._parseFormat(this.pattern);
                this.fields = $.grep(this.descriptors, function (d) {
                    return d.type !== -1;
                });
            };
            wijDateTextProvider.prototype._setDisplayFormat = function (displayFormat) {
                var culture = this.inputWidget._getCulture();
                if(culture == null) {
                    return;
                }
                this.displayPattern = this._parseFormatToPattern(displayFormat);
                this.displayDescriptors = this._parseFormat(this.displayPattern);
                this.displayFields = $.grep(this.descriptors, function (d) {
                    return d.type !== -1;
                });
            };
            wijDateTextProvider.prototype._parseFormat = function (pattern) {
                var descriptors = [];
                var curPattern = '', prevCh = '', isBegin = false, liternalNext = false, i, ch;
                for(i = 0; i < pattern.length; i++) {
                    ch = pattern.charAt(i);
                    if(liternalNext) {
                        descriptors.push(this.createDescriptor(-1, ch));
                        curPattern = '';
                        liternalNext = false;
                        continue;
                    }
                    if(ch === '\\') {
                        liternalNext = true;
                        if(curPattern.length > 0) {
                            if(!this.handlePattern(curPattern, descriptors)) {
                                descriptors.push(this.createDescriptor(-1, prevCh));
                            }
                            curPattern = '';
                        }
                        continue;
                    }
                    if(ch === '\'') {
                        if(isBegin) {
                            isBegin = false;
                            curPattern = '';
                        } else {
                            isBegin = true;
                            if(curPattern.length > 0) {
                                if(!this.handlePattern(curPattern, descriptors)) {
                                    descriptors.push(this.createDescriptor(-1, prevCh));
                                }
                                curPattern = '';
                            }
                        }
                        continue;
                    }
                    if(isBegin) {
                        descriptors.push(this.createDescriptor(-1, ch));
                        curPattern = '';
                        continue;
                    }
                    if(!i) {
                        prevCh = ch;
                    }
                    if(prevCh !== ch && curPattern.length > 0) {
                        if(!this.handlePattern(curPattern, descriptors)) {
                            descriptors.push(this.createDescriptor(-1, prevCh));
                        }
                        curPattern = '';
                    }
                    curPattern += ch;
                    prevCh = ch;
                }
                if(curPattern.length > 0) {
                    if(!this.handlePattern(curPattern, descriptors)) {
                        descriptors.push(this.createDescriptor(-1, prevCh));
                    }
                }
                return descriptors;
            };
            wijDateTextProvider.prototype._parseFormatToPattern = function (format) {
                var cf = this.inputWidget._getCulture().calendars.standard, pattern = cf.patterns.d;
                if(format.length <= 1) {
                    switch(format) {
                        case "":
                        case "d":
                            // ShortDatePattern
                            pattern = cf.patterns.d;
                            break;
                        case "D":
                            // LongDatePattern
                            pattern = cf.patterns.D;
                            break;
                        case "f":
                            // Full date and time (long date and short time)
                            pattern = cf.patterns.D + " " + cf.patterns.t;
                            break;
                        case "F":
                            // Full date and time (long date and long time)
                            pattern = cf.patterns.D + " " + cf.patterns.T;
                            break;
                        case "g":
                            // General (short date and short time)
                            pattern = cf.patterns.d + " " + cf.patterns.t;
                            break;
                        case "G":
                            // General (short date and long time)
                            pattern = cf.patterns.d + " " + cf.patterns.T;
                            break;
                        case "m":
                            // MonthDayPattern
                            pattern = cf.patterns.M;
                            break;
                        case "M":
                            // monthDayPattern
                            pattern = cf.patterns.M;
                            break;
                        case "s":
                            // SortableDateTimePattern
                            pattern = cf.patterns.S;
                            break;
                        case "t":
                            // shortTimePattern
                            pattern = cf.patterns.t;
                            break;
                        case "T":
                            // LongTimePattern
                            pattern = cf.patterns.T;
                            break;
                        case "u":
                            // UniversalSortableDateTimePattern
                            pattern = cf.patterns.S;
                            break;
                        case "U":
                            // Full date and time (long date and long time) using universal time
                            pattern = cf.patterns.D + " " + cf.patterns.T;
                            break;
                        case "y":
                            // YearMonthPattern
                            pattern = cf.patterns.Y;
                            break;
                        case "Y":
                            // yearMonthPattern
                            pattern = cf.patterns.Y;
                            break;
                    }
                } else {
                    pattern = format;
                }
                return pattern;
            };
            wijDateTextProvider.prototype.getDate = function () {
                return (!!this.inputWidget) ? new Date(this.inputWidget._safeGetDate(true).getTime()) : undefined;
            };
            wijDateTextProvider.prototype.setDate = function (value) {
                if(this.inputWidget) {
                    this.inputWidget._setData(value);
                }
            };
            wijDateTextProvider.prototype._internalSetDate = function (date) {
                if(this.inputWidget) {
                    var self = this, o = this.inputWidget.options, inputElement = this.inputWidget.element, typing = !!inputElement.data('typing'), chkBounds;
                    if(typing) {
                        o.date = date;
                        chkBounds = function () {
                            var now = new Date(), lastTime = inputElement.data('timeStamp');
                            if(lastTime) {
                                if((now.getTime() - lastTime.getTime()) > o.keyDelay) {
                                    self.inputWidget._safeSetDate(o.date, true);
                                    self.inputWidget._updateText();
                                    self.inputWidget._highLightField();
                                } else {
                                    window.setTimeout(chkBounds, o.keyDelay);
                                }
                            }
                        };
                        window.setTimeout(chkBounds, o.keyDelay);
                    } else {
                        this.inputWidget._safeSetDate(date);
                    }
                }
            };
            wijDateTextProvider.prototype.daysInMonth = function (m, y) {
                m = m - 1;
                var d = new Date(y, ++m, 1, -1).getDate();
                return d;
            };
            wijDateTextProvider.prototype.setYear = function (val, resultObj, chkBounds) {
                try  {
                    if(resultObj && resultObj.isfullreset) {
                        resultObj.offset = 1;
                        val = '1970';
                    }
                    if(typeof val === 'string') {
                        if(!this._isDigitString(val)) {
                            return false;
                        }
                    }
                    val = val * 1;
                    var o = this.inputWidget.options, minYear = 1, maxYear = 9999, currentDate, testDate, mmm;
                    if(chkBounds) {
                        if(o.minDate) {
                            minYear = Math.max(minYear, o.minDate.getFullYear());
                        }
                        if(o.maxDate) {
                            maxYear = Math.min(maxYear, o.maxDate.getFullYear());
                        }
                    }
                    if(resultObj && resultObj.isreset) {
                        val = minYear;
                    }
                    if(val < minYear) {
                        val = minYear;
                    }
                    if(val > maxYear) {
                        val = maxYear;
                    }
                    currentDate = this.getDate();
                    testDate = new Date(currentDate.getTime());
                    testDate.setFullYear(val);
                    if(this._isValidDate(testDate)) {
                        mmm = this.daysInMonth(this.getMonth(), this.getYear());
                        if(mmm === currentDate.getDate()) {
                            testDate = new Date(currentDate.getTime());
                            testDate.setDate(1);
                            testDate.setFullYear(val);
                            mmm = this.daysInMonth((testDate.getMonth() + 1), testDate.getFullYear());
                            testDate.setDate(mmm);
                            if(this._isValidDate(testDate)) {
                                this._internalSetDate(testDate);
                                return true;
                            } else {
                                return false;
                            }
                        }
                        currentDate.setFullYear(val);
                        this._internalSetDate(currentDate);
                        return true;
                    } else {
                        if(resultObj && resultObj.isreset) {
                            currentDate.setFullYear(1);
                            this._internalSetDate(currentDate);
                            return true;
                        }
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            };
            wijDateTextProvider.prototype.getYear = function () {
                return this.getDate().getFullYear();
            };
            wijDateTextProvider.prototype.setMonth = function (val, allowChangeOtherParts, resultObj) {
                try  {
                    if(resultObj && resultObj.isfullreset) {
                        val = '1';
                    }
                    val = val * 1;
                    var currentDate = this.getDate(), mmm, testDate;
                    if(typeof (allowChangeOtherParts) !== 'undefined' && !allowChangeOtherParts) {
                        if(val > 12 || val < 1) {
                            if(resultObj && resultObj.isreset) {
                                val = 1;
                            } else {
                                return false;
                            }
                        }
                    }
                    mmm = this.daysInMonth(this.getMonth(), this.getYear());
                    if(mmm === this.getDate().getDate()) {
                        testDate = new Date(currentDate.getTime());
                        testDate.setDate(1);
                        testDate.setMonth(val - 1);
                        mmm = this.daysInMonth((testDate.getMonth() + 1), testDate.getFullYear());
                        testDate.setDate(mmm);
                        if(this._isValidDate(testDate)) {
                            this._internalSetDate(testDate);
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        testDate = new Date(currentDate.getTime());
                        testDate.setMonth(val - 1);
                        if(this._isValidDate(testDate)) {
                            this._internalSetDate(testDate);
                            return true;
                        } else {
                            return false;
                        }
                    }
                } catch (e) {
                    return false;
                }
            };
            wijDateTextProvider.prototype.getMonth = function () {
                return (this.getDate().getMonth() + 1);
            };
            wijDateTextProvider.prototype.setDayOfMonth = function (val, allowChangeOtherParts, resultObj) {
                try  {
                    if(resultObj && resultObj.isfullreset) {
                        return this.setDayOfMonth(1, allowChangeOtherParts);
                    }
                    var currentDate = this.getDate(), mmm, testDate;
                    val = val * 1;
                    if(typeof (allowChangeOtherParts) !== 'undefined' && !allowChangeOtherParts) {
                        mmm = this.daysInMonth(this.getMonth(), this.getYear());
                        if(val > mmm || val < 1) {
                            if(resultObj && resultObj.isreset) {
                                return this.setDayOfMonth(1, allowChangeOtherParts, resultObj);
                            }
                            return false;
                        }
                    }
                    testDate = new Date(currentDate.getTime());
                    testDate.setDate(val);
                    if(this._isValidDate(testDate)) {
                        this._internalSetDate(testDate);
                        return true;
                    } else {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            };
            wijDateTextProvider.prototype.getDayOfMonth = function () {
                return this.getDate().getDate();
            };
            wijDateTextProvider.prototype.setHours = function (val, allowChangeOtherParts) {
                try  {
                    val = val * 1;
                    if(typeof (allowChangeOtherParts) !== 'undefined' && !allowChangeOtherParts) {
                        if(val > 24) {
                            return false;
                        }
                    }
                    var testDate = new Date(this.getDate().getTime());
                    testDate.setHours(val);
                    if(this._isValidDate(testDate)) {
                        this._internalSetDate(testDate);
                        return true;
                    } else {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            };
            wijDateTextProvider.prototype.getHours = function () {
                return this.getDate().getHours();
            };
            wijDateTextProvider.prototype.setMinutes = function (val, allowChangeOtherParts) {
                try  {
                    val = val * 1;
                    if(typeof (allowChangeOtherParts) !== 'undefined' && !allowChangeOtherParts) {
                        if(val > 60) {
                            return false;
                        }
                    }
                    var testDate = new Date(this.getDate().getTime());
                    testDate.setMinutes(val);
                    if(this._isValidDate(testDate)) {
                        this._internalSetDate(testDate);
                        return true;
                    } else {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            };
            wijDateTextProvider.prototype.getMinutes = function () {
                return this.getDate().getMinutes();
            };
            wijDateTextProvider.prototype.setSeconds = function (val, allowChangeOtherParts) {
                try  {
                    val = val * 1;
                    if(typeof (allowChangeOtherParts) !== 'undefined' && !allowChangeOtherParts) {
                        if(val > 60) {
                            return false;
                        }
                    }
                    var testDate = new Date(this.getDate().getTime());
                    testDate.setSeconds(val);
                    if(this._isValidDate(testDate)) {
                        this._internalSetDate(testDate);
                        return true;
                    } else {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            };
            wijDateTextProvider.prototype.getSeconds = function () {
                return this.getDate().getSeconds();
            };
            wijDateTextProvider.prototype.setDayOfWeek = function (val) {
                try  {
                    val = val * 1;
                    var aDif = val - this.getDayOfWeek();
                    return this.setDayOfMonth(this.getDayOfMonth() + aDif, true);
                } catch (e) {
                    return false;
                }
            };
            wijDateTextProvider.prototype.getDayOfWeek = function () {
                return (this.getDate().getDay() + 1);
            };
            wijDateTextProvider.prototype.handlePattern = function (p, descriptors) {
                var reg = new RegExp('y{3,4}'), suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(10));
                    return true;
                }
                reg = new RegExp('y{2,2}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(2));
                    return true;
                }
                reg = new RegExp('y{1,1}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(1));
                    return true;
                }
                reg = new RegExp('d{4,4}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(101));
                    return true;
                }
                reg = new RegExp('d{3,3}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(100));
                    return true;
                }
                reg = new RegExp('d{2,2}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(30));
                    return true;
                }
                reg = new RegExp('d{1,1}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(31));
                    return true;
                }
                reg = new RegExp('M{4,4}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(27));
                    return true;
                }
                reg = new RegExp('M{3,3}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(26));
                    return true;
                }
                reg = new RegExp('M{2,2}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(20));
                    return true;
                }
                reg = new RegExp('M{1,1}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(25));
                    return true;
                }
                reg = new RegExp('h{2,2}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(46));
                    return true;
                }
                reg = new RegExp('h{1,1}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(45));
                    return true;
                }
                reg = new RegExp('H{2,2}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(48));
                    return true;
                }
                reg = new RegExp('H{1,1}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(47));
                    return true;
                }
                reg = new RegExp('m{2,2}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(50));
                    return true;
                }
                reg = new RegExp('m{1,1}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(51));
                    return true;
                }
                reg = new RegExp('s{2,2}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(60));
                    return true;
                }
                reg = new RegExp('s{1,1}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(61));
                    return true;
                }
                reg = new RegExp('t{2,2}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(251));
                    return true;
                }
                reg = new RegExp('t{1,1}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(250));
                    return true;
                }
                reg = new RegExp('e{2,10}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(71));
                    return true;
                }
                reg = new RegExp('e{1,1}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(70));
                    return true;
                }
                reg = new RegExp('g{3,10}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(74));
                    return true;
                }
                reg = new RegExp('g{2,2}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(73));
                    return true;
                }
                reg = new RegExp('g{1,1}');
                suc = reg.test(p);
                if(suc) {
                    descriptors.push(this.createDescriptor(72));
                    return true;
                }
                return false;
            };
            wijDateTextProvider.prototype.createDescriptor = function (t, liternal) {
                var desc = null, id = this.maskPartsCount++;
                switch(t) {
                    case -1:
                        desc = new _dateDescriptor(this, id);
                        desc.liternal = liternal;
                        break;
                    case 20:
                        desc = new _dateDescriptor20(this, id);
                        break;
                    case 25:
                        desc = new _dateDescriptor25(this, id);
                        break;
                    case 26:
                        desc = new _dateDescriptor26(this, id);
                        break;
                    case 27:
                        desc = new _dateDescriptor27(this, id);
                        break;
                    case 30:
                        desc = new _dateDescriptor30(this, id);
                        break;
                    case 31:
                        desc = new _dateDescriptor31(this, id);
                        break;
                    case 100:
                        desc = new _dateDescriptor100(this, id);
                        break;
                    case 101:
                        desc = new _dateDescriptor101(this, id);
                        break;
                    case 10:
                        desc = new _dateDescriptor10(this, id);
                        break;
                    case 1:
                        desc = new _dateDescriptor1(this, id);
                        break;
                    case 2:
                        desc = new _dateDescriptor2(this, id);
                        break;
                    case 45:
                        desc = new _dateDescriptor45(this, id);
                        break;
                    case 46:
                        desc = new _dateDescriptor46(this, id);
                        break;
                    case 47:
                        desc = new _dateDescriptor47(this, id);
                        break;
                    case 48:
                        desc = new _dateDescriptor48(this, id);
                        break;
                    case 250:
                        desc = new _dateDescriptor250(this, id);
                        break;
                    case 251:
                        desc = new _dateDescriptor251(this, id);
                        break;
                    case 50:
                        desc = new _dateDescriptor50(this, id);
                        break;
                    case 51:
                        desc = new _dateDescriptor51(this, id);
                        break;
                    case 60:
                        desc = new _dateDescriptor60(this, id);
                        break;
                    case 61:
                        desc = new _dateDescriptor61(this, id);
                        break;
                    case 70:
                        desc = new _dateDescriptor70(this, id);
                        break;
                    case 71:
                        desc = new _dateDescriptor71(this, id);
                        break;
                    case 72:
                        desc = new _dateDescriptor72(this, id);
                        break;
                    case 73:
                        desc = new _dateDescriptor73(this, id);
                        break;
                    case 74:
                        desc = new _dateDescriptor74(this, id);
                        break;
                    default:
                        break;
                }
                return desc;
            };
            wijDateTextProvider.prototype.toString = function () {
                if(this.inputWidget._isEraFormatExist()) {
                    if(this.inputWidget.options.date != null) {
                        var minDate = this.inputWidget._getRealEraMinDate();
                        var maxDate = this.inputWidget._getRealEraMaxDate();
                        if(this.inputWidget.options.date < minDate || this.inputWidget.options.date > maxDate) {
                            return "";
                        }
                    }
                }
                if(!this.inputWidget.isFocused()) {
                    if(this.inputWidget.isDateNull() && this.inputWidget._getInnerNullText() != null) {
                        return this.inputWidget._getInnerNullText();
                    } else {
                        return this.getDisplayString();
                    }
                }
                var s = '', l = 0, i, txt, j;
                this.desPostions = new Array(0);
                for(i = 0; i < this.descriptors.length; i++) {
                    this.descriptors[i].startIndex = s.length;
                    txt = '' || this.descriptors[i].getText();
                    s += txt;
                    for(j = 0; j < txt.length; j++) {
                        this.desPostions.push({
                            desc: this.descriptors[i],
                            pos: j,
                            text: txt,
                            length: txt.length
                        });
                        l++;
                        if(this.desPostions.length !== l) {
                            throw 'Fatal Error !!!!!!!!!!!!!!!';
                        }
                    }
                }
                return s;
            };
            wijDateTextProvider.prototype.getDisplayString = function () {
                var s = '', l = 0, i, txt, j;
                var desPostions = new Array(0);
                for(i = 0; i < this.displayDescriptors.length; i++) {
                    this.displayDescriptors[i].startIndex = s.length;
                    txt = '' || this.displayDescriptors[i].getText();
                    s += txt;
                    for(j = 0; j < txt.length; j++) {
                        desPostions.push({
                            desc: this.displayDescriptors[i],
                            pos: j,
                            text: txt,
                            length: txt.length
                        });
                        l++;
                        if(desPostions.length !== l) {
                            throw 'Fatal Error !!!!!!!!!!!!!!!';
                        }
                    }
                }
                return s;
            };
            wijDateTextProvider.prototype.parseDate = function (str) {
                var date;
                if(this.pattern === 'dddd' || this.pattern === 'ddd' || typeof str === 'object') {
                    try  {
                        date = new Date(str);
                        if(isNaN(date)) {
                            date = new Date();
                        }
                    } catch (e) {
                        date = new Date();
                    }
                } else {
                    date = Globalize.parseDate(str, this.pattern, this._getCulture());
                    if(!date) {
                        date = this._tryParseDate(str, this.pattern);
                    }
                    if(!date) {
                        date = null;
                    }
                }
                return date;
            };
            wijDateTextProvider.prototype.setText = function (input) {
                var date = this.parseDate(input);
                if(date == null) {
                    this._internalSetDate(null);
                } else {
                    this._internalSetDate(new Date(date));
                }
                return true;
            };
            wijDateTextProvider.prototype.haveEnumParts = function () {
                return false;
            };
            wijDateTextProvider.prototype.removeLiterals = function (s) {
                s = '' + s + '';
                s = s.replace(new RegExp('[+]', 'g'), '');
                s = s.replace(new RegExp('[.]', 'g'), '');
                s = s.replace(new RegExp('[:]', 'g'), '');
                s = s.replace(new RegExp('[-]', 'g'), '');
                s = s.replace(new RegExp('[()=]', 'g'), '');
                return s;
            };
            wijDateTextProvider.prototype.getFirstDelimiterPos = function (aText, bText) {
                var i = 0, j = 0, ch1, ch2;
                while(i < bText.length && j < aText.length) {
                    ch1 = bText.charAt(i);
                    ch2 = aText.charAt(j);
                    if(ch1 === ch2) {
                        j++;
                    } else {
                        return j - 1;
                    }
                    i++;
                }
                return aText.length - 1;
            };
            wijDateTextProvider.prototype.findAlikeArrayItemIndex = function (arr, txt) {
                var index = -1, pos = 99999, i, k;
                for(i = 0; i < arr.length; i++) {
                    k = arr[i].toLowerCase().indexOf(txt.toLowerCase());
                    if(k !== -1 && k < pos) {
                        pos = k;
                        index = i;
                    }
                }
                return index;
            };
            wijDateTextProvider.prototype._isValidDate = function (dt) {
                return this.inputWidget._isValidDate(dt);
            };
            wijDateTextProvider.prototype.isFieldSep = function (input, activeField) {
                var nextField = activeField++, desc;
                if(nextField < this.descriptors.length) {
                    desc = this.descriptors[nextField];
                    if(desc.type !== -1) {
                        return false;
                    }
                    return (input === desc.text);
                }
                return false;
            };
            wijDateTextProvider.prototype.getPositionType = function (pos) {
                var desPos = this.desPostions[pos];
                return desPos.desc.type;
            };
            wijDateTextProvider.prototype.addToField = function (input, activeField, pos) {
                var desc = this.fields[activeField], txt, resultObj, ret;
                txt = input;
                resultObj = {
                    val: input,
                    pos: 0,
                    offset: 0,
                    isreset: false
                };
                this.inputWidget.element.data('typing', true);
                ret = desc.setText(txt, ((input.length === 1) ? false : true), resultObj);
                this.inputWidget.element.data('typing', false);
                return ret;
            };
            wijDateTextProvider.prototype.insertAt = function (strInput, position, rh) {
                if (typeof rh === "undefined") { rh = new input.wijInputResult(); }
                rh.testPosition = -1;
                var desPos, oldTxt, pos, txt, tryToExpandAtRight, result, tryToExpandAtLeft, curInsertTxt, resultObj, prevTextLength, posAdjustValue, altInsertText, newTextLength, diff, s, delimOrEndPos, delta;
                if(strInput.length === 1) {
                    desPos = this.desPostions[position];
                    if(desPos && desPos.desc.type === -1) {
                        if(desPos.text === strInput) {
                            rh.testPosition = position;
                            rh.hint = rh.characterEscaped;
                            return true;
                        }
                    }
                }
                oldTxt = strInput;
                pos = position;
                strInput = this.removeLiterals(strInput);
                txt = strInput;
                tryToExpandAtRight = false;
                tryToExpandAtLeft = false;
                if(pos > 0 && txt.length === 1) {
                    pos--;
                    position = pos;
                    desPos = this.desPostions[pos];
                    tryToExpandAtRight = true;
                    if(desPos && (desPos.desc.type === -1 || desPos.desc.getText().length !== 1)) {
                        position++;
                        pos++;
                        tryToExpandAtRight = false;
                    }
                }
                result = false;
                while(txt.length > 0 && pos < this.desPostions.length) {
                    desPos = this.desPostions[pos];
                    if(desPos.desc.type === -1) {
                        pos = pos + desPos.length;
                        continue;
                    }
                    if(desPos.desc.needAdjustInsertPos()) {
                        curInsertTxt = txt.substr(0, (desPos.length - desPos.pos));
                        curInsertTxt = desPos.text.slice(0, desPos.pos) + curInsertTxt + desPos.text.slice(desPos.pos + curInsertTxt.length, desPos.length);
                        if(tryToExpandAtRight) {
                            curInsertTxt = desPos.text + curInsertTxt;
                        }
                        if(tryToExpandAtLeft) {
                            curInsertTxt = curInsertTxt + desPos.text;
                        }
                        prevTextLength = desPos.desc.getText().length;
                        altInsertText = '';
                        try  {
                            if(strInput.length === 1) {
                                if(!desPos.pos) {
                                    altInsertText = strInput;
                                } else if(desPos.pos > 0) {
                                    altInsertText = curInsertTxt.substring(0, desPos.pos + 1);
                                }
                            }
                        } catch (e) {
                        }
                        if(prevTextLength === 1 && curInsertTxt.length > 1 && strInput.length === 1) {
                            if(desPos.desc.type === 31 || desPos.desc.type === 25) {
                                this._disableSmartInputMode = true;
                            }
                        }
                        resultObj = {
                            val: strInput,
                            pos: desPos.pos,
                            offset: 0,
                            isreset: false
                        };
                        result = desPos.desc.setText(curInsertTxt, ((strInput.length === 1) ? false : true), resultObj);
                        this._disableSmartInputMode = false;
                        if(!result && typeof (altInsertText) !== 'undefined' && altInsertText.length > 0 && (desPos.desc.type === 26 || desPos.desc.type === 27 || desPos.desc.type === 100 || desPos.desc.type === 101 || desPos.desc.type === 250 || desPos.desc.type === 251)) {
                            result = desPos.desc.setText(altInsertText, ((strInput.length === 1) ? false : true), resultObj);
                        }
                        if(result) {
                            rh.hint = rh.success;
                            rh.testPosition = pos + resultObj.offset;
                            if(strInput.length === 1) {
                                newTextLength = desPos.desc.getText().length;
                                posAdjustValue = desPos.pos;
                                if(desPos.pos > (newTextLength - 1)) {
                                    posAdjustValue = newTextLength;
                                }
                                diff = newTextLength - prevTextLength;
                                if(diff > 0 && desPos.pos === prevTextLength - 1) {
                                    posAdjustValue = newTextLength - 1;
                                }
                                s = this.toString();
                                rh.testPosition = desPos.desc.startIndex + posAdjustValue + resultObj.offset;
                            }
                            txt = txt.slice(desPos.length - desPos.pos, txt.length);
                        } else {
                            rh.hint = rh.invalidInput;
                            if(rh.testPosition !== -1) {
                                rh.testPosition = position;
                            }
                            if(desPos.desc.type !== -1 && strInput.length === 1) {
                                return false;
                            }
                        }
                        pos = pos + desPos.length;
                    } else {
                        delimOrEndPos = this.getFirstDelimiterPos(txt, oldTxt);
                        if(delimOrEndPos < 0) {
                            delimOrEndPos = 0;
                        }
                        curInsertTxt = txt.substring(0, delimOrEndPos + 1);
                        resultObj = {
                            val: strInput,
                            pos: desPos.pos,
                            offset: 0,
                            isreset: false
                        };
                        result = desPos.desc.setText(curInsertTxt, ((strInput.length === 1) ? false : true), resultObj);
                        if(result) {
                            rh.hint = rh.success;
                            rh.testPosition = pos + resultObj.offset;
                            txt = txt.slice(delimOrEndPos + 1, txt.length);
                        } else {
                            rh.hint = rh.invalidInput;
                            if(rh.testPosition !== -1) {
                                rh.testPosition = position;
                            }
                        }
                        if(delimOrEndPos < 0) {
                            delimOrEndPos = 0;
                        }
                        delta = delimOrEndPos + 1;
                        pos = pos + delta;
                    }
                }
                return result;
            };
            wijDateTextProvider.prototype.removeAt = function (start, end, rh) {
                try  {
                    var desPos = this.desPostions[start], curInsertTxt, pos, resultObj, result, widget = this.inputWidget, element = widget.element, dateLength = element.val().length;
                    if(dateLength === end + 1 && start === 0) {
                        widget.isDeleteAll = true;
                    }
                    if(desPos.desc.needAdjustInsertPos()) {
                        curInsertTxt = '0';
                        pos = start;
                        desPos.text = desPos.desc.getText();
                        curInsertTxt = desPos.text.slice(0, desPos.pos) + curInsertTxt + desPos.text.slice(desPos.pos + curInsertTxt.length, desPos.length);
                        if(desPos.desc.name === 'tt') {
                            curInsertTxt = "AM";
                        } else if(desPos.desc.name === 't') {
                            curInsertTxt = "A";
                        } else if(desPos.desc.formatString === 'ee') {
                            curInsertTxt = "01";
                        } else if(desPos.desc.formatString === 'e') {
                            curInsertTxt = "1";
                        }
                        resultObj = {
                            val: curInsertTxt,
                            pos: desPos.pos,
                            offset: 0,
                            isreset: true,
                            isfullreset: false
                        };
                        if((end - start + 1) >= desPos.length) {
                            resultObj.isfullreset = true;
                            start = start + desPos.length;
                            pos = start;
                        }
                        result = desPos.desc.setText(curInsertTxt, false, resultObj);
                        if(result) {
                            rh.hint = rh.success;
                            rh.testPosition = pos;
                        } else {
                            rh.hint = rh.invalidInput;
                            if(rh.testPosition === -1) {
                                rh.testPosition = start;
                            }
                        }
                    }
                    if(start < end) {
                        this.removeAt(start + 1, end, rh);
                    }
                    return true;
                } catch (e) {
                    return false;
                }
            };
            wijDateTextProvider.prototype.incEnumPart = function () {
                var desc = this.fields[this.inputWidget.options.activeField];
                if(desc) {
                    desc.inc();
                }
                return true;
            };
            wijDateTextProvider.prototype.decEnumPart = function (pos) {
                var desc = this.fields[this.inputWidget.options.activeField];
                if(desc) {
                    desc.dec();
                }
                return true;
            };
            wijDateTextProvider.prototype.setValue = function (val) {
                this.setDate(new Date(val instanceof Date ? val.getTime() : val));
                return true;
            };
            wijDateTextProvider.prototype.getValue = function () {
                return this.getDate();
            };
            wijDateTextProvider.prototype._isSmartInputMode = function () {
                if(this._disableSmartInputMode) {
                    return false;
                }
                if(this.inputWidget) {
                    return this.inputWidget.options.smartInputMode;
                }
                return true;
            };
            wijDateTextProvider.prototype._getInt = function (str, i, minlength, maxlength) {
                var x, token;
                for(x = maxlength; x >= minlength; x--) {
                    token = str.substring(i, i + x);
                    if(token.length < minlength) {
                        return null;
                    }
                    if($.wij.charValidator.isDigit(token)) {
                        return token;
                    }
                }
                return null;
            };
            wijDateTextProvider.prototype._tryParseDate = function (val, pattern) {
                var ci = this._getCulture().calendars, pattern2, sep, patterns, d;
                pattern = pattern || ci.standard.patterns.d;
                if(pattern) {
                    if(pattern.indexOf('MMM') === -1 && pattern.indexOf('MMMM') === -1) {
                        pattern = pattern.replace('MM', 'M');
                    }
                    pattern = pattern.replace('dd', 'd');
                    pattern = pattern.replace('tt', 'a');
                }
                pattern2 = pattern.replace('yyyy', 'yy');
                sep = ci.standard["/"];
                patterns = [
                    pattern, 
                    pattern2, 
                    pattern.replace(new RegExp(sep, 'g'), '-'), 
                    pattern2.replace(new RegExp(sep, 'g'), '-'), 
                    pattern.replace(new RegExp(sep, 'g'), '.'), 
                    pattern2.replace(new RegExp(sep, 'g'), '.')
                ];
                d = Globalize.parseDate(val, patterns, this._getCulture());
                if(d) {
                    return d;
                }
                // if the val is datetime string,
                // parse the string to datetime. added by dail 2012-6-25
                d = new Date(val);
                if(d.toString() !== "Invalid Date" && val && val !== "") {
                    return d;
                }
                return 0;
            };
            wijDateTextProvider.prototype._formatDate = function (date, format, culture) {
                var _this = this;
                if(!(date.valueOf())) {
                    return '&nbsp;';
                }
                var cf = this.inputWidget._getCulture().calendars.standard, sRes = format.replace(new RegExp('yyyy|MMMM|MMM|MM|M|mm|m|dddd|ddd|dd|d|hh|h|HH|H|ss|s|tt|t|a/p', 'gi'), function (match) {
                    var h;
                    switch(match) {
                        case 'yyyy':
                            return paddingZero(date.getFullYear(), 4);
                        case 'MMMM':
                            return culture.dateTimeFormat.monthNames[date.getMonth()];
                        case 'MMM':
                            return culture.dateTimeFormat.abbreviatedMonthNames[date.getMonth()];
                        case 'MM':
                            return _this.paddingZero((date.getMonth() + 1), 2);
                        case 'M':
                            return _this.paddingZero((date.getMonth() + 1), 1);
                        case 'mm':
                            return _this.paddingZero(date.getMinutes(), 2);
                        case 'm':
                            return _this.paddingZero(date.getMinutes(), 1);
                        case 'dddd':
                            return culture.dateTimeFormat.dayNames[date.getDay()];
                        case 'ddd':
                            return culture.dateTimeFormat.abbreviatedDayNames[date.getDay()];
                        case 'dd':
                            return _this.paddingZero(date.getDate(), 2);
                        case 'd':
                            return _this.paddingZero(date.getDate(), 1);
                        case 'hh':
                            h = date.getHours() % 12;
                            return _this.paddingZero(((h) ? h : 12), 2);
                        case 'h':
                            h = date.getHours() % 12;
                            return _this.paddingZero(((h) ? h : 12), 1);
                        case 'HH':
                            return _this.paddingZero(date.getHours(), 2);
                        case 'H':
                            return _this.paddingZero(date.getHours(), 1);
                        case 'ss':
                            return _this.paddingZero(date.getSeconds(), 2);
                        case 's':
                            return _this.paddingZero(date.getSeconds(), 1);
                        case 'tt':
                            return (date.getHours() < 12) ? cf.AM[0] : cf.PM[0];
                        case 't':
                            return (date.getHours() < 12) ? ((cf.AM[0].length > 0) ? cf.AM[0].charAt(0) : '') : ((cf.PM[0].length > 0) ? cf.PM[0].charAt(0) : '');
                        case 'a/p':
                            return (date.getHours() < 12) ? 'a' : 'p';
                    }
                    return 'N';
                });
                return sRes;
            };
            return wijDateTextProvider;
        })(input.wijTextProvider);
        input.wijDateTextProvider = wijDateTextProvider;        
        ;
        (function (DescriptorType) {
            DescriptorType._map = [];
            DescriptorType.liternal = -1;
            DescriptorType.OneDigitYear = 1;
            DescriptorType.TwoDigitYear = 2;
            DescriptorType.FourDigitYear = 10;
            DescriptorType.TwoDigitMonth = 20;
            DescriptorType.Month = 25;
            DescriptorType.AbbreviatedMonthNames = 26;
            DescriptorType.MonthNames = 27;
            DescriptorType.EraYear = 70;
            DescriptorType.TwoEraYear = 71;
            DescriptorType.EraName = 72;
            DescriptorType.TwoEraName = 73;
            DescriptorType.ThreeEraName = 74;
            DescriptorType.TwoDigityDayOfMonth = 30;
            DescriptorType.DayOfMonth = 31;
            DescriptorType.AbbreviatedDayNames = 100;
            DescriptorType.DayNames = 101;
            DescriptorType.h = 45;
            DescriptorType.hh = 46;
            DescriptorType.H = 47;
            DescriptorType.HH = 48;
            DescriptorType.ShortAmPm = 250;
            DescriptorType.AmPm = 251;
            DescriptorType.mm = 50;
            DescriptorType.m = 51;
            DescriptorType.ss = 60;
            DescriptorType.s = 61;
        })(input.DescriptorType || (input.DescriptorType = {}));
        var DescriptorType = input.DescriptorType;
        ////////////////////////////////////////////////////////////////////////////////
        // _iDateDescriptor
        var _iDateDescriptor = (function () {
            function _iDateDescriptor(textProvider, id) {
                this.id = id;
                this.startIndex = 0;
                this.name = null;
                this.type = DescriptorType.liternal;
                this.maxLen = 2;
                this.formatString = "";
                this._txtProvider = textProvider;
                this.startIndex = 0;
            }
            _iDateDescriptor.prototype.getText = function () {
                return null;
            };
            _iDateDescriptor.prototype.getRealText = function (text) {
                if(this._txtProvider.inputWidget.options.date == null) {
                    return this.formatString;
                }
                return text;
            };
            _iDateDescriptor.prototype.setText = function (value, allowchangeotherpart, result) {
                return false;
            };
            _iDateDescriptor.prototype.inc = function () {
            };
            _iDateDescriptor.prototype.dec = function () {
            };
            _iDateDescriptor.prototype.needAdjustInsertPos = function () {
                return true;
            };
            _iDateDescriptor.prototype.reachMaxLen = function () {
                var t = this.getText();
                do {
                    if(t.charAt(0) === '0') {
                        t = t.slice(1);
                    } else {
                        break;
                    }
                }while(t.length > 0);
                return t.length >= this.maxLen;
            };
            return _iDateDescriptor;
        })();
        input._iDateDescriptor = _iDateDescriptor;        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor
        var _dateDescriptor = (function (_super) {
            __extends(_dateDescriptor, _super);
            function _dateDescriptor(owner, id) {
                        _super.call(this, owner, id);
                this.liternal = '';
                this.maxLen = 100;
            }
            _dateDescriptor.prototype.getText = function () {
                return this.liternal;
            };
            return _dateDescriptor;
        })(_iDateDescriptor);        
        var EraYearDescriptor = (function (_super) {
            __extends(EraYearDescriptor, _super);
            function EraYearDescriptor(owner, id) {
                        _super.call(this, owner, id);
            }
            EraYearDescriptor.prototype.inc = function () {
                var date = this._txtProvider.getDate();
                var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                if(DateTimeInfo.Equal(date, maxDate)) {
                    if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                        this._txtProvider.setDate(new Date(minDate.valueOf()));
                    }
                } else {
                    this._txtProvider.setYear(this._txtProvider.getYear() + 1, null, true);
                    if(this._txtProvider.getDate() > maxDate) {
                        this._txtProvider.setDate(new Date(maxDate.valueOf()));
                    }
                }
            };
            EraYearDescriptor.prototype.dec = function () {
                var date = this._txtProvider.getDate();
                var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                if(DateTimeInfo.Equal(date, minDate)) {
                    if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                        this._txtProvider.setDate(new Date(maxDate.valueOf()));
                    }
                } else {
                    this._txtProvider.setYear(this._txtProvider.getYear() - 1, null, true);
                    if(this._txtProvider.getDate() < minDate) {
                        this._txtProvider.setDate(new Date(minDate.valueOf()));
                    }
                }
            };
            return EraYearDescriptor;
        })(_iDateDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor70
        var _dateDescriptor70 = (function (_super) {
            __extends(_dateDescriptor70, _super);
            function _dateDescriptor70(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'Era Year';
                this.formatString = "e";
                this.type = DescriptorType.EraYear;
            }
            _dateDescriptor70.prototype.getText = function () {
                var eraDate = DateTimeInfo.GetEraDate(this._txtProvider.getDate());
                if(eraDate.eraYear === -1) {
                    return "";
                }
                eraDate.eraYear = eraDate.eraYear > 99 ? 99 : eraDate.eraYear;
                return this.getRealText(String(eraDate.eraYear));
            };
            _dateDescriptor70.prototype.setText = function (value, allowchangeotherpart, result) {
                if(isNaN(parseInt(value))) {
                    return false;
                }
                var date = this._txtProvider.getDate();
                var eraDate = DateTimeInfo.GetEraDate(date);
                if(eraDate.eraYear !== -1) {
                    var eraYear = parseInt(value);
                    if(eraYear >= DateTimeInfo.GetEraYears()[eraDate.era]) {
                        eraYear = DateTimeInfo.GetEraYears()[eraDate.era];
                    }
                    var nullFlag = this._txtProvider.inputWidget.options.date == null;
                    if(nullFlag) {
                        eraYear = parseInt(value);
                    }
                    var newDate = DateTimeInfo.ConvertToGregorianDate(eraDate.era, eraYear, date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), false);
                    if(eraDate.era < DateTimeInfo.GetEraCount() - 1) {
                        var maxEraDate = DateTimeInfo.GetEraDates()[eraDate.era + 1];
                        if(newDate > maxEraDate) {
                            eraYear = DateTimeInfo.GetEraYears()[eraDate.era] - 1;
                            newDate = DateTimeInfo.ConvertToGregorianDate(eraDate.era, eraYear, date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), false);
                        }
                    }
                    this._txtProvider.setDate(newDate);
                    return true;
                }
                return false;
            };
            return _dateDescriptor70;
        })(EraYearDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor71
        var _dateDescriptor71 = (function (_super) {
            __extends(_dateDescriptor71, _super);
            function _dateDescriptor71(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'Two Era Year';
                this.formatString = "ee";
                this.type = DescriptorType.TwoEraYear;
            }
            _dateDescriptor71.prototype.getText = function () {
                var eraDate = DateTimeInfo.GetEraDate(this._txtProvider.getDate());
                if(eraDate.eraYear === -1) {
                    return "";
                }
                eraDate.eraYear = eraDate.eraYear > 99 ? 99 : eraDate.eraYear;
                return this.getRealText(paddingZero(eraDate.eraYear, 2));
            };
            _dateDescriptor71.prototype.setText = function (value, allowchangeotherpart, result) {
                if(isNaN(parseInt(value))) {
                    return false;
                }
                var date = this._txtProvider.getDate();
                var eraDate = DateTimeInfo.GetEraDate(date);
                if(eraDate.eraYear !== -1) {
                    var newValue = String(eraDate.eraYear) + value;
                    var eraYear = parseInt(newValue.substring(newValue.length - 2, newValue.length));
                    if(eraYear > DateTimeInfo.GetEraYears()[eraDate.era]) {
                        eraYear = DateTimeInfo.GetEraYears()[eraDate.era];
                    }
                    var nullFlag = this._txtProvider.inputWidget.options.date == null;
                    if(nullFlag) {
                        eraYear = parseInt(value);
                    }
                    var newDate = DateTimeInfo.ConvertToGregorianDate(eraDate.era, eraYear, date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), false);
                    if(eraDate.era < DateTimeInfo.GetEraCount() - 1) {
                        var maxEraDate = DateTimeInfo.GetEraDates()[eraDate.era + 1];
                        if(newDate > maxEraDate) {
                            eraYear = DateTimeInfo.GetEraYears()[eraDate.era] - 1;
                            newDate = DateTimeInfo.ConvertToGregorianDate(eraDate.era, eraYear, date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), false);
                        }
                    }
                    this._txtProvider.setDate(newDate);
                    return true;
                }
                return false;
            };
            return _dateDescriptor71;
        })(EraYearDescriptor);        
        var EraNameDescriptor = (function (_super) {
            __extends(EraNameDescriptor, _super);
            function EraNameDescriptor(owner, id) {
                        _super.call(this, owner, id);
            }
            EraNameDescriptor.prototype.inc = function () {
                var date = this._txtProvider.getDate();
                var eraDate = DateTimeInfo.GetEraDate(date);
                if(eraDate.era === -1) {
                    return;
                }
                var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                if(DateTimeInfo.Equal(date, maxDate)) {
                    if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                        this._txtProvider.setDate(new Date(minDate.valueOf()));
                    }
                } else {
                    if(eraDate.era >= DateTimeInfo.GetEraCount() - 1) {
                        this._txtProvider.setDate(new Date(maxDate.valueOf()));
                    } else {
                        var era = eraDate.era + 1;
                        var eraYear = eraDate.eraYear > DateTimeInfo.GetEraYears()[era] ? DateTimeInfo.GetEraYears()[era] : eraDate.eraYear;
                        var newDate = DateTimeInfo.ConvertToGregorianDate(era, eraYear, date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), true);
                        newDate = newDate == null ? DateTimeInfo.GetEraDates()[era] : newDate;
                        if(newDate > maxDate) {
                            this._txtProvider.setDate(new Date(maxDate.valueOf()));
                        } else {
                            this._txtProvider.setDate(newDate);
                        }
                    }
                }
            };
            EraNameDescriptor.prototype.dec = function () {
                var date = this._txtProvider.getDate();
                var eraDate = DateTimeInfo.GetEraDate(date);
                if(eraDate.era === -1) {
                    return;
                }
                var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                if(DateTimeInfo.Equal(date, minDate)) {
                    if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                        this._txtProvider.setDate(new Date(maxDate.valueOf()));
                    }
                } else {
                    if(eraDate.era == 0) {
                        this._txtProvider.setDate(new Date(minDate.valueOf()));
                    } else {
                        var era = eraDate.era - 1;
                        var eraYear = eraDate.eraYear > DateTimeInfo.GetEraYears()[era] ? DateTimeInfo.GetEraYears()[era] : eraDate.eraYear;
                        var newDate = DateTimeInfo.ConvertToGregorianDate(era, eraYear, date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), true);
                        if(newDate == null) {
                            newDate = new Date(DateTimeInfo.GetEraDates()[era + 1]);
                            ;
                            newDate.setDate(newDate.getDate() - 1);
                        }
                        if(newDate > maxDate) {
                            this._txtProvider.setDate(new Date(minDate.valueOf()));
                        } else {
                            this._txtProvider.setDate(newDate);
                        }
                    }
                }
            };
            return EraNameDescriptor;
        })(_iDateDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor72
        var _dateDescriptor72 = (function (_super) {
            __extends(_dateDescriptor72, _super);
            function _dateDescriptor72(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'Era Name';
                this.formatString = "g";
                this.type = DescriptorType.EraName;
            }
            _dateDescriptor72.prototype.getText = function () {
                var eraDate = DateTimeInfo.GetEraDate(this._txtProvider.getDate());
                if(eraDate.era === -1) {
                    return "";
                }
                return this.getRealText(DateTimeInfo.GetEraSymbols()[eraDate.era]);
            };
            _dateDescriptor72.prototype.setText = function (value, allowchangeotherpart, result) {
                var singleValue = value.substr(value.length - 1, 1);
                var era = 0;
                for(era = 0; era < DateTimeInfo.GetEraCount(); era++) {
                    if((singleValue.toLowerCase() === DateTimeInfo.GetEraShortcuts()[era].toLowerCase()) || (value.toLowerCase() === DateTimeInfo.GetEraShortNames()[era].toLowerCase())) {
                        break;
                    }
                }
                if(era == DateTimeInfo.GetEraCount()) {
                    return true;
                }
                var date = this._txtProvider.getDate();
                var eraDate = DateTimeInfo.GetEraDate(date);
                if(eraDate.era === -1) {
                    return true;
                }
                var eraYear = eraDate.eraYear > DateTimeInfo.GetEraYears()[era] ? DateTimeInfo.GetEraYears()[era] : eraDate.eraYear;
                var newDate = DateTimeInfo.ConvertToGregorianDate(era, eraYear, date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), true);
                newDate = newDate == null ? DateTimeInfo.GetEraDates()[era] : newDate;
                if(era < DateTimeInfo.GetEraCount() - 1) {
                    var maxEraDate = DateTimeInfo.GetEraDates()[era + 1];
                    newDate = newDate > maxEraDate ? maxEraDate : newDate;
                }
                this._txtProvider.setDate(newDate);
                return true;
            };
            return _dateDescriptor72;
        })(EraNameDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor73
        var _dateDescriptor73 = (function (_super) {
            __extends(_dateDescriptor73, _super);
            function _dateDescriptor73(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'Two Era Name';
                this.formatString = "gg";
                this.type = DescriptorType.TwoEraName;
            }
            _dateDescriptor73.prototype.getText = function () {
                var eraDate = DateTimeInfo.GetEraDate(this._txtProvider.getDate());
                if(eraDate.era === -1) {
                    return "";
                }
                return this.getRealText(DateTimeInfo.GetEraAbbreviations()[eraDate.era]);
            };
            _dateDescriptor73.prototype.setText = function (value, allowchangeotherpart, result) {
                var singleValue = value.substr(value.length - 1, 1);
                var era = 0;
                for(era = 0; era < DateTimeInfo.GetEraCount(); era++) {
                    if((singleValue.toLowerCase() === DateTimeInfo.GetEraShortcuts()[era].toLowerCase()) || (value.toLowerCase() === DateTimeInfo.GetEraShortNames()[era].toLowerCase()) || (value.toLowerCase() === DateTimeInfo.GetEraAbbreviations()[era].toLowerCase())) {
                        break;
                    }
                }
                if(era == DateTimeInfo.GetEraCount()) {
                    return true;
                }
                var date = this._txtProvider.getDate();
                var eraDate = DateTimeInfo.GetEraDate(date);
                if(eraDate.era === -1) {
                    return true;
                }
                var eraYear = eraDate.eraYear > DateTimeInfo.GetEraYears()[era] ? DateTimeInfo.GetEraYears()[era] : eraDate.eraYear;
                var newDate = DateTimeInfo.ConvertToGregorianDate(era, eraYear, date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), true);
                newDate = newDate == null ? DateTimeInfo.GetEraDates()[era] : newDate;
                if(era < DateTimeInfo.GetEraCount() - 1) {
                    var maxEraDate = DateTimeInfo.GetEraDates()[era + 1];
                    newDate = newDate > maxEraDate ? maxEraDate : newDate;
                }
                this._txtProvider.setDate(newDate);
                return true;
            };
            return _dateDescriptor73;
        })(EraNameDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor74
        var _dateDescriptor74 = (function (_super) {
            __extends(_dateDescriptor74, _super);
            function _dateDescriptor74(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'Three Era Name';
                this.formatString = "ggg";
                this.type = DescriptorType.ThreeEraName;
            }
            _dateDescriptor74.prototype.getText = function () {
                var eraDate = DateTimeInfo.GetEraDate(this._txtProvider.getDate());
                if(eraDate.era === -1) {
                    return "";
                }
                return this.getRealText(DateTimeInfo.GetEraNames()[eraDate.era]);
            };
            _dateDescriptor74.prototype.setText = function (value, allowchangeotherpart, result) {
                var singleValue = value.substr(value.length - 1, 1);
                var era = 0;
                for(era = 0; era < DateTimeInfo.GetEraCount(); era++) {
                    if((singleValue.toLowerCase() === DateTimeInfo.GetEraShortcuts()[era].toLowerCase()) || (value.toLowerCase() === DateTimeInfo.GetEraShortNames()[era].toLowerCase()) || (value.toLowerCase() === DateTimeInfo.GetEraAbbreviations()[era].toLowerCase()) || (value.toLowerCase() === DateTimeInfo.GetEraNames()[era].toLowerCase())) {
                        break;
                    }
                }
                if(era == DateTimeInfo.GetEraCount()) {
                    return true;
                }
                var date = this._txtProvider.getDate();
                var eraDate = DateTimeInfo.GetEraDate(date);
                if(eraDate.era === -1) {
                    return true;
                }
                var eraYear = eraDate.eraYear > DateTimeInfo.GetEraYears()[era] ? DateTimeInfo.GetEraYears()[era] : eraDate.eraYear;
                var newDate = DateTimeInfo.ConvertToGregorianDate(era, eraYear, date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), true);
                newDate = newDate == null ? DateTimeInfo.GetEraDates()[era] : newDate;
                if(era < DateTimeInfo.GetEraCount() - 1) {
                    var maxEraDate = DateTimeInfo.GetEraDates()[era + 1];
                    newDate = newDate > maxEraDate ? maxEraDate : newDate;
                }
                this._txtProvider.setDate(newDate);
                return true;
            };
            return _dateDescriptor74;
        })(EraNameDescriptor);        
        var MonthDateDescriptor = (function (_super) {
            __extends(MonthDateDescriptor, _super);
            function MonthDateDescriptor(owner, id) {
                        _super.call(this, owner, id);
            }
            MonthDateDescriptor.prototype.inc = function () {
                _super.prototype.inc.call(this);
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                var newMonth = newDate.getMonth() + 1;
                newDate.setMonth(newMonth);
                if(this._txtProvider.inputWidget._isEraFormatExist()) {
                    var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                    if(!DateTimeInfo.Equal(this._txtProvider.getDate(), maxDate)) {
                        this._txtProvider.setDate(maxDate);
                    } else if(newDate > maxDate) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(minDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                } else {
                    var minDate = this._txtProvider.inputWidget._getRealMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealMaxDate();
                    if(!this._txtProvider.inputWidget._isValidDate(newDate, true)) {
                        if(!DateTimeInfo.Equal(this._txtProvider.getDate(), maxDate)) {
                            this._txtProvider.setDate(maxDate);
                        } else if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(minDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                }
            };
            MonthDateDescriptor.prototype.dec = function () {
                _super.prototype.inc.call(this);
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                var newMonth = newDate.getMonth() - 1;
                newDate.setMonth(newMonth);
                if(this._txtProvider.inputWidget._isEraFormatExist()) {
                    var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                    if(newDate < minDate) {
                        if(!DateTimeInfo.Equal(this._txtProvider.getDate(), minDate)) {
                            this._txtProvider.setDate(minDate);
                        } else if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(maxDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                } else {
                    var minDate = this._txtProvider.inputWidget._getRealMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealMaxDate();
                    if(!this._txtProvider.inputWidget._isValidDate(newDate, true)) {
                        if(!DateTimeInfo.Equal(this._txtProvider.getDate(), minDate)) {
                            this._txtProvider.setDate(minDate);
                        } else if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(maxDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                }
            };
            MonthDateDescriptor.prototype.setText = function (value, allowchangeotherpart, result) {
                if(parseInt(value) > 12) {
                    value = value.substr(value.length - 1, 1);
                }
                return this._txtProvider.setMonth(value, allowchangeotherpart, result);
            };
            return MonthDateDescriptor;
        })(_iDateDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor20
        var _dateDescriptor20 = (function (_super) {
            __extends(_dateDescriptor20, _super);
            function _dateDescriptor20(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'Two-digit month';
                this.formatString = "MM";
                this.type = DescriptorType.TwoDigitMonth;
            }
            _dateDescriptor20.prototype.getText = function () {
                var m = '' + this._txtProvider.getMonth() + '';
                return this.getRealText(m.length === 1 ? ('0' + m) : m);
            };
            return _dateDescriptor20;
        })(MonthDateDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor25
        var _dateDescriptor25 = (function (_super) {
            __extends(_dateDescriptor25, _super);
            function _dateDescriptor25(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'month';
                this.formatString = "M";
                this.type = DescriptorType.Month;
            }
            _dateDescriptor25.prototype.getText = function () {
                var m = '' + this._txtProvider.getMonth() + '';
                return this.getRealText(m);
            };
            return _dateDescriptor25;
        })(MonthDateDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor26
        var _dateDescriptor26 = (function (_super) {
            __extends(_dateDescriptor26, _super);
            function _dateDescriptor26(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'AbbreviatedMonthNames';
                this.formatString = "MMM";
                this.type = DescriptorType.AbbreviatedMonthNames;
                this.maxLen = DescriptorType.AbbreviatedMonthNames;
            }
            _dateDescriptor26.prototype.getText = function () {
                var m = this._txtProvider.getMonth(), culture = this._txtProvider._getCulture();
                return this.getRealText(culture.calendars.standard.months.namesAbbr[m - 1]);
            };
            _dateDescriptor26.prototype.setText = function (value, allowchangeotherpart, result) {
                var m = -1, cf = this._txtProvider.inputWidget._getCulture().calendars.standard;
                m = this._txtProvider.findAlikeArrayItemIndex(cf.months.namesAbbr, value);
                if(m === -1) {
                    return false;
                }
                return this._txtProvider.setMonth(m + 1, allowchangeotherpart, result);
            };
            return _dateDescriptor26;
        })(MonthDateDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor27
        var _dateDescriptor27 = (function (_super) {
            __extends(_dateDescriptor27, _super);
            function _dateDescriptor27(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'MonthNames';
                this.formatString = "MMMM";
                this.type = DescriptorType.MonthNames;
                this.maxLen = 100;
            }
            _dateDescriptor27.prototype.getText = function () {
                var m = this._txtProvider.getMonth(), culture = this._txtProvider._getCulture();
                return this.getRealText(culture.calendars.standard.months.names[m - 1]);
            };
            _dateDescriptor27.prototype.setText = function (value, allowchangeotherpart, result) {
                var m = -1, culture;
                if(result && result.isfullreset) {
                    m = 1;
                } else {
                    culture = this._txtProvider._getCulture();
                    m = this._txtProvider.findAlikeArrayItemIndex(culture.calendars.standard.months.names, value);
                    if(m === -1) {
                        return false;
                    }
                }
                return this._txtProvider.setMonth(m + 1, allowchangeotherpart, result);
            };
            return _dateDescriptor27;
        })(MonthDateDescriptor);        
        var DayOfMonthDescriptor = (function (_super) {
            __extends(DayOfMonthDescriptor, _super);
            function DayOfMonthDescriptor(owner, id) {
                        _super.call(this, owner, id);
            }
            DayOfMonthDescriptor.prototype.inc = function () {
                var newDay = this._txtProvider.getDayOfMonth() + 1;
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setDate(newDay);
                if(this._txtProvider.inputWidget._isEraFormatExist()) {
                    var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                    if(newDate > maxDate) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(minDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                } else {
                    var minDate = this._txtProvider.inputWidget._getRealMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealMaxDate();
                    if(!this._txtProvider.inputWidget._isValidDate(newDate, true)) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(minDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                }
            };
            DayOfMonthDescriptor.prototype.dec = function () {
                var newDay = this._txtProvider.getDayOfMonth() - 1;
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setDate(newDay);
                if(this._txtProvider.inputWidget._isEraFormatExist()) {
                    var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                    if(newDate < minDate) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(maxDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                } else {
                    var minDate = this._txtProvider.inputWidget._getRealMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealMaxDate();
                    if(!this._txtProvider.inputWidget._isValidDate(newDate, true)) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(maxDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                }
            };
            DayOfMonthDescriptor.prototype.setText = function (value, allowchangeotherpart, result) {
                var date = this._txtProvider.getDate();
                var dayCount = DateTimeInfo.DaysInMonth(date.getFullYear(), date.getMonth() + 1);
                if(parseInt(value) > dayCount) {
                    value = dayCount + "";
                }
                return this._txtProvider.setDayOfMonth(value, allowchangeotherpart, result);
            };
            return DayOfMonthDescriptor;
        })(_iDateDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor30
        var _dateDescriptor30 = (function (_super) {
            __extends(_dateDescriptor30, _super);
            function _dateDescriptor30(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'Two-digit day of month';
                this.formatString = "dd";
                this.type = DescriptorType.TwoDigityDayOfMonth;
            }
            _dateDescriptor30.prototype.getText = function () {
                return this.getRealText(paddingZero(this._txtProvider.getDayOfMonth()));
            };
            return _dateDescriptor30;
        })(DayOfMonthDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor31
        var _dateDescriptor31 = (function (_super) {
            __extends(_dateDescriptor31, _super);
            function _dateDescriptor31(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'Day of month';
                this.formatString = "d";
                this.type = DescriptorType.DayOfMonth;
            }
            _dateDescriptor31.prototype.getText = function () {
                var dom = this._txtProvider.getDayOfMonth();
                return this.getRealText('' + dom + '');
            };
            return _dateDescriptor31;
        })(DayOfMonthDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor100
        var _dateDescriptor100 = (function (_super) {
            __extends(_dateDescriptor100, _super);
            function _dateDescriptor100(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'AbbreviatedDayNames';
                this.formatString = "ddd";
                this.type = DescriptorType.AbbreviatedDayNames;
                this.maxLen = 100;
            }
            _dateDescriptor100.prototype.getText = function () {
                var dw = this._txtProvider.getDayOfWeek(), culture = this._txtProvider._getCulture();
                return this.getRealText(culture.calendars.standard.days.namesShort[dw - 1]);
            };
            _dateDescriptor100.prototype.setText = function (value, allowchangeotherpart, result) {
                var dw = -1, culture = this._txtProvider._getCulture();
                dw = this._txtProvider.findAlikeArrayItemIndex(culture.calendars.standard.days.namesShort, value);
                if(dw === -1) {
                    return false;
                }
                return this._txtProvider.setDayOfWeek(dw + 1);
            };
            _dateDescriptor100.prototype.needAdjustInsertPos = function () {
                return false;
            };
            return _dateDescriptor100;
        })(DayOfMonthDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor101
        var _dateDescriptor101 = (function (_super) {
            __extends(_dateDescriptor101, _super);
            function _dateDescriptor101(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'DayNames';
                this.formatString = "dddd";
                this.type = DescriptorType.DayNames;
                this.maxLen = 100;
            }
            _dateDescriptor101.prototype.getText = function () {
                var dw = this._txtProvider.getDayOfWeek(), culture = this._txtProvider._getCulture();
                return this.getRealText(culture.calendars.standard.days.names[dw - 1]);
            };
            _dateDescriptor101.prototype.setText = function (value, allowchangeotherpart, result) {
                var dw = -1, culture = this._txtProvider._getCulture();
                dw = this._txtProvider.findAlikeArrayItemIndex(culture.calendars.standard.days.names, value);
                if(dw === -1) {
                    return false;
                }
                return this._txtProvider.setDayOfWeek(dw + 1);
            };
            _dateDescriptor101.prototype.needAdjustInsertPos = function () {
                return false;
            };
            return _dateDescriptor101;
        })(DayOfMonthDescriptor);        
        var YearDateDescriptor = (function (_super) {
            __extends(YearDateDescriptor, _super);
            function YearDateDescriptor(owner, id) {
                        _super.call(this, owner, id);
            }
            YearDateDescriptor.prototype.inc = function () {
                var newYear = this._txtProvider.getYear() + 1;
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setFullYear(newYear);
                if(this._txtProvider.inputWidget._isEraFormatExist()) {
                    var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                    if(newDate > maxDate) {
                        if(!DateTimeInfo.Equal(this._txtProvider.getDate(), maxDate)) {
                            this._txtProvider.setDate(maxDate);
                        } else if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(minDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                } else {
                    var minDate = this._txtProvider.inputWidget._getRealMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealMaxDate();
                    if(!this._txtProvider.inputWidget._isValidDate(newDate, true)) {
                        if(!DateTimeInfo.Equal(this._txtProvider.getDate(), maxDate)) {
                            this._txtProvider.setDate(maxDate);
                        } else if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(minDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                }
            };
            YearDateDescriptor.prototype.dec = function () {
                var newYear = this._txtProvider.getYear() - 1;
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setFullYear(newYear);
                if(this._txtProvider.inputWidget._isEraFormatExist()) {
                    var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                    if(newDate < minDate) {
                        if(!DateTimeInfo.Equal(this._txtProvider.getDate(), minDate)) {
                            this._txtProvider.setDate(minDate);
                        } else if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(maxDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                } else {
                    var minDate = this._txtProvider.inputWidget._getRealMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealMaxDate();
                    if(!this._txtProvider.inputWidget._isValidDate(newDate, true)) {
                        if(!DateTimeInfo.Equal(this._txtProvider.getDate(), minDate)) {
                            this._txtProvider.setDate(minDate);
                        } else if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(maxDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                }
            };
            return YearDateDescriptor;
        })(_iDateDescriptor);        
        var TwoDigitYearDescriptor = (function (_super) {
            __extends(TwoDigitYearDescriptor, _super);
            function TwoDigitYearDescriptor(owner, id) {
                        _super.call(this, owner, id);
            }
            TwoDigitYearDescriptor.prototype.setText = function (value, allowchangeotherpart, result) {
                value = paddingZero(value);
                var y = paddingZero(this._txtProvider.getYear(), 4), m, dom, h, min, s;
                if(value === '00') {
                    m = this._txtProvider.getMonth();
                    dom = this._txtProvider.getDayOfMonth();
                    h = this._txtProvider.getHours();
                    min = this._txtProvider.getMinutes();
                    s = this._txtProvider.getSeconds();
                    if(m === 1 && dom === 1 && !h && !min && !s) {
                        y = '0001';
                        value = '01';
                    }
                }
                if(y.length >= 2) {
                    y = y.substr(0, 2) + value.substr(0, 2);
                }
                return this._txtProvider.setYear(parseInt(y), result, false);
            };
            return TwoDigitYearDescriptor;
        })(YearDateDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor10
        var _dateDescriptor10 = (function (_super) {
            __extends(_dateDescriptor10, _super);
            function _dateDescriptor10(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'Four-digit year';
                this.formatString = "yyyy";
                this.type = DescriptorType.FourDigitYear;
                this.maxLen = 4;
            }
            _dateDescriptor10.prototype.getText = function () {
                return this.getRealText(paddingZero(this._txtProvider.getYear(), 4));
            };
            _dateDescriptor10.prototype.setText = function (value, allowchangeotherpart, result) {
                if(this._txtProvider._isSmartInputMode() && result) {
                    value = value * 1;
                    value = value % 100;
                    var startYear = 1900 + 100;
                    if(this._txtProvider.inputWidget.options.startYear) {
                        startYear = this._txtProvider.inputWidget.options.startYear;
                    }
                    var lastYear = startYear % 100;
                    var firstYear = startYear - lastYear;
                    if(value >= lastYear) {
                        value = firstYear + value;
                    } else {
                        value = firstYear + value + 100;
                    }
                    //    startYearStr: string,
                    //    endYear, curDate, thisYear, inputNum, century, addYear, s;
                    //endYear = startYear + 100 - 1;
                    //startYearStr = this._txtProvider.paddingZero(startYear, 4);
                    //endYear = this._txtProvider.paddingZero(endYear, 4);
                    //if (result.pos === 0 || result.pos === 1) {
                    //    curDate = new Date();
                    //    thisYear = this._txtProvider
                    //        .paddingZero(this._txtProvider.getYear(), 4);
                    //    if (thisYear.charAt(0) === '0' &&
                    //        thisYear.charAt(1) === '0' && result.pos <= 1) {
                    //        inputNum = result.val;
                    //        century = '00';
                    //        if (inputNum >= 5) {
                    //            century = startYearStr.slice(0, 2);
                    //        }
                    //        else {
                    //            century = endYear.slice(0, 2);
                    //        }
                    //        addYear = result.val + thisYear.slice(3, 4);
                    //        s = century + addYear;
                    //        result.offset = 2 - result.pos;
                    //        this._txtProvider.setYear(s, result);
                    //        return true;
                    //    }
                    //}
                                    }
                return this._txtProvider.setYear(value, result, false);
            };
            return _dateDescriptor10;
        })(YearDateDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor1
        var _dateDescriptor1 = (function (_super) {
            __extends(_dateDescriptor1, _super);
            function _dateDescriptor1(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'One-digit year';
                this.formatString = "y";
                this.type = DescriptorType.OneDigitYear;
            }
            _dateDescriptor1.prototype.getText = function () {
                var y = paddingZero(this._txtProvider.getYear());
                if(y[0] === '0') {
                    y = y[1];
                }
                return this.getRealText(y);
            };
            return _dateDescriptor1;
        })(TwoDigitYearDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor2
        var _dateDescriptor2 = (function (_super) {
            __extends(_dateDescriptor2, _super);
            function _dateDescriptor2(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'Two-digit year';
                this.formatString = "yy";
                this.type = DescriptorType.TwoDigitYear;
            }
            _dateDescriptor2.prototype.getText = function () {
                if(this._txtProvider.inputWidget.isFocused() && this._txtProvider.inputWidget.options.date == null) {
                    return "yy";
                }
                return this.getRealText(paddingZero(this._txtProvider.getYear(), 2));
            };
            return _dateDescriptor2;
        })(TwoDigitYearDescriptor);        
        var HourDescriptor = (function (_super) {
            __extends(HourDescriptor, _super);
            function HourDescriptor(owner, id) {
                        _super.call(this, owner, id);
            }
            HourDescriptor.prototype.inc = function () {
                var newHour = this._txtProvider.getHours() + 1;
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setHours(newHour);
                if(this._txtProvider.inputWidget._isEraFormatExist()) {
                    var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                    if(newDate > maxDate) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(minDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                } else {
                    var minDate = this._txtProvider.inputWidget._getRealMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealMaxDate();
                    if(!this._txtProvider.inputWidget._isValidDate(newDate, true)) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(minDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                }
            };
            HourDescriptor.prototype.dec = function () {
                var newHour = this._txtProvider.getHours() - 1;
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setHours(newHour);
                if(this._txtProvider.inputWidget._isEraFormatExist()) {
                    var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                    if(newDate < minDate) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(maxDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                } else {
                    var minDate = this._txtProvider.inputWidget._getRealMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealMaxDate();
                    if(!this._txtProvider.inputWidget._isValidDate(newDate, true)) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(maxDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                }
            };
            return HourDescriptor;
        })(_iDateDescriptor);        
        var TwelveHourDescriptor = (function (_super) {
            __extends(TwelveHourDescriptor, _super);
            function TwelveHourDescriptor(owner, id) {
                        _super.call(this, owner, id);
            }
            TwelveHourDescriptor.prototype.setText = function (value, allowchangeotherpart, result) {
                var h = this._txtProvider.getHours();
                if(h > 12) {
                    value = ((value * 1) + 12);
                }
                return this._txtProvider.setHours(value, allowchangeotherpart);
            };
            return TwelveHourDescriptor;
        })(HourDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor45
        var _dateDescriptor45 = (function (_super) {
            __extends(_dateDescriptor45, _super);
            function _dateDescriptor45(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'h';
                this.formatString = "h";
                this.type = DescriptorType.h;
            }
            _dateDescriptor45.prototype.getText = function () {
                if(this._txtProvider.inputWidget.isFocused() && this._txtProvider.inputWidget.options.date == null) {
                    return "h";
                }
                var h = this._txtProvider.getHours();
                if(h > 12) {
                    h = h - 12;
                } else if(h === 0) {
                    h = 12;
                }
                if(h == 12 && this._txtProvider.inputWidget.options.hour12As0) {
                    h = 0;
                }
                return this.getRealText('' + h + '');
            };
            return _dateDescriptor45;
        })(TwelveHourDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor46
        var _dateDescriptor46 = (function (_super) {
            __extends(_dateDescriptor46, _super);
            function _dateDescriptor46(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'hh';
                this.formatString = "hh";
                this.type = DescriptorType.hh;
            }
            _dateDescriptor46.prototype.getText = function () {
                var h = this._txtProvider.getHours();
                if(h > 12) {
                    h -= 12;
                } else if(h === 0) {
                    h = 12;
                }
                if(h == 12 && this._txtProvider.inputWidget.options.hour12As0) {
                    h = 0;
                }
                return this.getRealText(paddingZero(h, 2));
            };
            return _dateDescriptor46;
        })(TwelveHourDescriptor);        
        var TwentyFourHourDescriptor = (function (_super) {
            __extends(TwentyFourHourDescriptor, _super);
            function TwentyFourHourDescriptor(owner, id) {
                        _super.call(this, owner, id);
            }
            TwentyFourHourDescriptor.prototype.setText = function (value, allowchangeotherpart, result) {
                return this._txtProvider.setHours(value, allowchangeotherpart);
            };
            return TwentyFourHourDescriptor;
        })(HourDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor47
        var _dateDescriptor47 = (function (_super) {
            __extends(_dateDescriptor47, _super);
            function _dateDescriptor47(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'H';
                this.formatString = "H";
                this.type = DescriptorType.H;
            }
            _dateDescriptor47.prototype.getText = function () {
                var h = this._txtProvider.getHours();
                if(h == 0 && !this._txtProvider.inputWidget.options.midnightAs0) {
                    h = 24;
                }
                return this.getRealText('' + h + '');
            };
            return _dateDescriptor47;
        })(TwentyFourHourDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor48
        var _dateDescriptor48 = (function (_super) {
            __extends(_dateDescriptor48, _super);
            function _dateDescriptor48(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'HH';
                this.formatString = "HH";
                this.type = DescriptorType.HH;
            }
            _dateDescriptor48.prototype.getText = function () {
                var h = this._txtProvider.getHours();
                if(h == 0 && !this._txtProvider.inputWidget.options.midnightAs0) {
                    h = 24;
                }
                return this.getRealText(paddingZero(h, 2));
            };
            return _dateDescriptor48;
        })(TwentyFourHourDescriptor);        
        var AmPmDescriptor = (function (_super) {
            __extends(AmPmDescriptor, _super);
            function AmPmDescriptor(owner, id) {
                        _super.call(this, owner, id);
            }
            AmPmDescriptor.prototype.inc = function () {
                var h = (this._txtProvider.getHours() + 12) % 24;
                this._txtProvider.setHours(h, true);
            };
            AmPmDescriptor.prototype.dec = function () {
                var h = (this._txtProvider.getHours() + 12) % 24;
                this._txtProvider.setHours(h, true);
            };
            AmPmDescriptor.prototype.setText = function (value, allowchangeotherpart, result) {
                var h;
                if(value.toLowerCase().indexOf('a') >= 0) {
                    h = this._txtProvider.getHours() % 12;
                    this._txtProvider.setHours(h, true);
                } else if(value.toLowerCase().indexOf('p') >= 0) {
                    h = this._txtProvider.getHours() % 12 + 12;
                    this._txtProvider.setHours(h, true);
                }
                return true;
            };
            return AmPmDescriptor;
        })(_iDateDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor250
        var _dateDescriptor250 = (function (_super) {
            __extends(_dateDescriptor250, _super);
            function _dateDescriptor250(owner, id) {
                        _super.call(this, owner, id);
                this.name = 't';
                this.formatString = "t";
                this.type = DescriptorType.ShortAmPm;
            }
            _dateDescriptor250.prototype.getText = function () {
                var hours = this._txtProvider.getHours();
                var culture = this._txtProvider._getCulture();
                var am = this._txtProvider.inputWidget._getInnerAmDesignator();
                var pm = this._txtProvider.inputWidget._getInnerPmDesignator();
                var designator = hours < 12 ? am : pm;
                return this.getRealText(designator.charAt(0) || " ");
            };
            return _dateDescriptor250;
        })(AmPmDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor251
        var _dateDescriptor251 = (function (_super) {
            __extends(_dateDescriptor251, _super);
            function _dateDescriptor251(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'tt';
                this.formatString = "tt";
                this.type = DescriptorType.AmPm;
            }
            _dateDescriptor251.prototype.getText = function () {
                var hours = this._txtProvider.getHours();
                var culture = this._txtProvider._getCulture();
                var am = this._txtProvider.inputWidget._getInnerAmDesignator();
                var pm = this._txtProvider.inputWidget._getInnerPmDesignator();
                var designator = hours < 12 ? am : pm;
                if(designator.length <= 0) {
                    designator = ' ';
                }
                return this.getRealText(designator);
            };
            return _dateDescriptor251;
        })(AmPmDescriptor);        
        var MinuteDescriptor = (function (_super) {
            __extends(MinuteDescriptor, _super);
            function MinuteDescriptor(owner, id) {
                        _super.call(this, owner, id);
            }
            MinuteDescriptor.prototype.inc = function () {
                var newMinute = this._txtProvider.getMinutes() + 1;
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setMinutes(newMinute);
                if(this._txtProvider.inputWidget._isEraFormatExist()) {
                    var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                    if(newDate > maxDate) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(minDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                } else {
                    var minDate = this._txtProvider.inputWidget._getRealMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealMaxDate();
                    if(!this._txtProvider.inputWidget._isValidDate(newDate, true)) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(minDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                }
            };
            MinuteDescriptor.prototype.dec = function () {
                var newMinite = this._txtProvider.getMinutes() - 1;
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setMinutes(newMinite);
                if(this._txtProvider.inputWidget._isEraFormatExist()) {
                    var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                    if(newDate < minDate) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(maxDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                } else {
                    var minDate = this._txtProvider.inputWidget._getRealMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealMaxDate();
                    if(!this._txtProvider.inputWidget._isValidDate(newDate, true)) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(maxDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                }
            };
            MinuteDescriptor.prototype.setText = function (value, allowchangeotherpart, result) {
                if(result && result.isfullreset) {
                    value = '0';
                }
                return this._txtProvider.setMinutes(value, allowchangeotherpart);
            };
            return MinuteDescriptor;
        })(_iDateDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor50
        var _dateDescriptor50 = (function (_super) {
            __extends(_dateDescriptor50, _super);
            function _dateDescriptor50(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'mm';
                this.formatString = "mm";
                this.type = DescriptorType.mm;
            }
            _dateDescriptor50.prototype.getText = function () {
                return this.getRealText(paddingZero(this._txtProvider.getMinutes()));
            };
            return _dateDescriptor50;
        })(MinuteDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor51
        var _dateDescriptor51 = (function (_super) {
            __extends(_dateDescriptor51, _super);
            function _dateDescriptor51(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'm';
                this.formatString = "m";
                this.type = DescriptorType.m;
                this.delta = 12;
            }
            _dateDescriptor51.prototype.getText = function () {
                return this.getRealText(this._txtProvider.getMinutes().toString());
            };
            return _dateDescriptor51;
        })(MinuteDescriptor);        
        var SecondDescriptor = (function (_super) {
            __extends(SecondDescriptor, _super);
            function SecondDescriptor(owner, id) {
                        _super.call(this, owner, id);
            }
            SecondDescriptor.prototype.inc = function () {
                var newSecond = this._txtProvider.getSeconds() + 1;
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setSeconds(newSecond);
                if(this._txtProvider.inputWidget._isEraFormatExist()) {
                    var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                    if(newDate > maxDate) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(minDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                } else {
                    var minDate = this._txtProvider.inputWidget._getRealMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealMaxDate();
                    if(!this._txtProvider.inputWidget._isValidDate(newDate, true)) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(minDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                }
            };
            SecondDescriptor.prototype.dec = function () {
                var newSecond = this._txtProvider.getSeconds() - 1;
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setSeconds(newSecond);
                if(this._txtProvider.inputWidget._isEraFormatExist()) {
                    var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                    if(newDate < minDate) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(maxDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                } else {
                    var minDate = this._txtProvider.inputWidget._getRealMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealMaxDate();
                    if(!this._txtProvider.inputWidget._isValidDate(newDate, true)) {
                        if(this._txtProvider.inputWidget._getAllowSpinLoop()) {
                            this._txtProvider.setDate(maxDate);
                        }
                    } else {
                        this._txtProvider.setDate(newDate);
                    }
                }
            };
            SecondDescriptor.prototype.setText = function (value, allowchangeotherpart, result) {
                if(result && result.isfullreset) {
                    value = '0';
                }
                return this._txtProvider.setSeconds(value, allowchangeotherpart);
            };
            return SecondDescriptor;
        })(_iDateDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor60
        var _dateDescriptor60 = (function (_super) {
            __extends(_dateDescriptor60, _super);
            function _dateDescriptor60(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'ss';
                this.formatString = "ss";
                this.type = DescriptorType.ss;
            }
            _dateDescriptor60.prototype.getText = function () {
                return this.getRealText(paddingZero(this._txtProvider.getSeconds()));
            };
            return _dateDescriptor60;
        })(SecondDescriptor);        
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor61
        var _dateDescriptor61 = (function (_super) {
            __extends(_dateDescriptor61, _super);
            function _dateDescriptor61(owner, id) {
                        _super.call(this, owner, id);
                this.name = 's';
                this.formatString = "s";
                this.type = DescriptorType.s;
            }
            _dateDescriptor61.prototype.getText = function () {
                return this.getRealText(this._txtProvider.getSeconds().toString());
            };
            return _dateDescriptor61;
        })(SecondDescriptor);        
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
