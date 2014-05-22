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
    /// <reference path="../wijcalendar/jquery.wijmo.wijcalendar.ts"/>
    /// <reference path="jquery.wijmo.wijinputdateformat.ts"/>
    /// <reference path="../wijtabs/jquery.wijmo.wijtabs.ts"/>
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
    *	jquery.wijmo.wijcharex.js
    *	jquery.wijmo.wijstringinfo.js
    *	jquery.wijmo.wijinputcore.js
    *  jquery.wijmo.wijinputdateformat.js
    *  jquery.wijmo.wijtabs.js
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
        /** @widget */ var wijinputdate = (function (_super) {
            __extends(wijinputdate, _super);
            function wijinputdate() {
                _super.apply(this, arguments);

            }
            wijinputdate.prototype._create = function () {
                if(input.Utility.chrome) {
                    this.element.attr("type", "text");
                }
                _super.prototype._create.call(this);
            };
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
                    if(date === null) {
                        date = new Date();
                    }
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
                    defaultDate: date === null ? date : new Date(date.getTime()),
                    preDate: date === null ? date : new Date(date.getTime())
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
                    if(_this.element.data('ignoreHighLight') != true) {
                        _this._highLightCursor();
                    }
                    if(input.Utility.chrome) {
                        if(_this.element.data('needResoteActiveField') == true) {
                            _this._setOption('activeField', oldActiveField);
                        }
                    }
                    _this.element.data('ignoreHighLight', false);
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
            wijinputdate.prototype._getInnerIncrement = function () {
                var increment = Number(this.options.increment);
                if(isNaN(increment)) {
                    increment = 1;
                }
                return increment;
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
                    return input.DateTimeInfo.GetEraMax() < this.options.maxDate ? input.DateTimeInfo.GetEraMax() : this.options.maxDate;
                }
                return input.DateTimeInfo.GetEraMax();
            };
            wijinputdate.prototype._getRealEraMinDate = function () {
                if(this.options.minDate) {
                    return input.DateTimeInfo.GetEraMin() > this.options.minDate ? input.DateTimeInfo.GetEraMin() : this.options.minDate;
                }
                return input.DateTimeInfo.GetEraMin();
            };
            wijinputdate.prototype._isEraFormatExist = function () {
                return this._textProvider._isEraFormatExist();
            };
            wijinputdate.prototype._checkDate = function () {
                var oldDate = this.options.date;
                var newDate = this._checkRange(this.options.date);
                if(!input.DateTimeInfo.Equal(oldDate, newDate)) {
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
                        if(this.element.data('ignoreHighLight') != true) {
                            this._highLightField();
                        }
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
            wijinputdate.prototype._highLightAllField = function () {
                if(this.isFocused()) {
                    var range = this._textProvider.getAllRange();
                    if(range) {
                        try  {
                            this.element.wijtextselection(range);
                        } catch (e) {
                        }
                    }
                }
            };
            wijinputdate.prototype._highLightField = function (index) {
                if (typeof index === "undefined") { index = this.options.activeField; }
                if(this.isFocused()) {
                    var range = this._textProvider.getFieldRange(index);
                    if(range) {
                        try  {
                            this.element.wijtextselection(range);
                        } catch (e) {
                        }
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
            wijinputdate.prototype.spinUp = /** Performs spin up by the active field and increment value.
            */
            function () {
                this._doSpin(true, false);
            };
            wijinputdate.prototype.spinDown = /** Performs spin down by the active field and increment value.
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
                if(this.options.highlightText == "all") {
                    this._highLightAllField();
                } else {
                    this._highLightField();
                }
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
                if(this.element.data('IsInSelectTextMethod') == true) {
                    return;
                }
                if(input.Utility.chrome) {
                    var self = this;
                    self.element.data('needResoteActiveField', true);
                    window.setTimeout(function () {
                        self.element.data('needResoteActiveField', false);
                        if(self.options.highlightText == "all") {
                            self._highLightAllField();
                        } else {
                            self._highLightField();
                        }
                    }, 200);
                } else {
                    if(this.options.highlightText == "all") {
                        this._highLightAllField();
                        this.element.data('ignoreHighLight', true);
                    } else {
                        this._highLightField();
                    }
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
                for(var era = 0; era < input.DateTimeInfo.GetEraCount(); era++) {
                    if((str.toLowerCase() === input.DateTimeInfo.GetEraShortNames()[era].toLowerCase()) || (str.toLowerCase() === input.DateTimeInfo.GetEraAbbreviations()[era].toLowerCase()) || (str.toLowerCase() === input.DateTimeInfo.GetEraSymbols()[era].toLowerCase()) || (str.toLowerCase() === input.DateTimeInfo.GetEraNames()[era].toLowerCase())) {
                        str = input.DateTimeInfo.GetEraShortNames()[era].toLowerCase();
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
                var spinResult = false;
                if(up) {
                    spinResult = this._textProvider.incEnumPart();
                } else {
                    spinResult = this._textProvider.decEnumPart();
                }
                if(spinResult) {
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
                this._removeState('focus', this.outerDiv);
                this._updateText();
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
                            this._trigger('keyExit');
                        } else {
                            this._toPrevField();
                        }
                        return true;
                    case jqKeyCode.RIGHT:
                        if(this.options.activeField == this._textProvider.getFieldCount() - 1 && (this.options.blurOnLeftRightKey.toLowerCase() == "right" || this.options.blurOnLeftRightKey.toLowerCase() == "both")) {
                            input.Utility.MoveFocus(this.element.get(0), true);
                            this._trigger('keyExit');
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
                        if(this.options.tabAction !== "field" || this.options.highlightText !== "field") {
                            this._trigger('keyExit');
                            break;
                        }
                        selRange = this.element.wijtextselection();
                        if(selRange && selRange.end - selRange.start !== this.element.val().length) {
                            if(e.shiftKey) {
                                if(this.options.activeField > 0) {
                                    this._toPrevField();
                                } else {
                                    this._trigger('keyExit');
                                    break;
                                }
                            } else {
                                if(this.options.activeField < this._textProvider.getFieldCount() - 1) {
                                    this._toNextField();
                                } else {
                                    this._trigger('keyExit');
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
                    this._trigger('keyExit');
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
                    var activeField = this.options.activeField;
                    if(ret) {
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
                    if(activeField != this.options.activeField) {
                        this.element.data("lastInputChar", "");
                    } else {
                        this.element.data("lastInputChar", ch);
                    }
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
                        "height": "",
                        "font-size": ""
                    });
                } else if(currentTab == "Date" || currentTab == "Time") {
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
                if(!this._allowEdit()) {
                    return;
                }
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
                if(!this._allowEdit()) {
                    return;
                }
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
                if(!this._allowEdit()) {
                    return;
                }
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
                if(!this._allowEdit()) {
                    return;
                }
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
                if(!this._allowEdit()) {
                    return;
                }
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
                if(!this._allowEdit()) {
                    return;
                }
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
                if(!this._allowEdit()) {
                    return;
                }
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
                var maxDayCount = input.DateTimeInfo.DaysInMonth(year, month);
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
                var maxDayCount = input.DateTimeInfo.DaysInMonth(year, month);
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
            wijinputdate.prototype._internalSetDate = function (date) {
                var self = this, o = this.options, inputElement = this.element, typing = !!inputElement.data('typing'), chkBounds;
                if(typing) {
                    o.date = date;
                    chkBounds = function () {
                        var now = new Date(), lastTime = inputElement.data('timeStamp');
                        if(lastTime) {
                            if((now.getTime() - lastTime.getTime()) > o.keyDelay) {
                                self._safeSetDate(o.date, true);
                                self._updateText();
                                self._highLightField();
                            } else {
                                window.setTimeout(chkBounds, o.keyDelay);
                            }
                        }
                    };
                    window.setTimeout(chkBounds, o.keyDelay);
                } else {
                    this._safeSetDate(date);
                }
            };
            wijinputdate.prototype.selectText = /** Selects a range of text in the widget.
            * @param {Number} start Start of the range.
            * @param {Number} end End of the range.
            * @example
            * // Select first two symbols in a wijinputdate
            * $(".selector").wijinputdate("selectText", 0, 2);
            */
            function (start, end) {
                if (typeof start === "undefined") { start = 0; }
                if (typeof end === "undefined") { end = this.getText().length; }
                if(this.isFocused()) {
                    _super.prototype.selectText.call(this, start, end);
                } else {
                    this.element.data('IsInSelectTextMethod', true);
                    this.focus();
                    var obj = this;
                    setTimeout(function () {
                        try  {
                            obj.selectText(start, end);
                        } catch (e) {
                        }
                    }, 0);
                    this.element.data('IsInSelectTextMethod', false);
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
                * wijinputdate supports two types of formats:  <br />
                * Standard Format and Custom Format. <br />
                * <br />
                * A standard date and time format string uses a single format specifier  <br />
                * to define the text representation of a date and time value. <br />
                * <br />
                * Possible values for Standard Format are: <br />
                * "d": ShortDatePattern <br />
                * "D": LongDatePattern <br />
                * "f": Full date and time (long date and short time)  <br />
                * "F": FullDateTimePattern  <br />
                * "g": General (short date and short time)  <br />
                * "G": General (short date and long time)  <br />
                * "m": MonthDayPattern  <br />
                * "M": monthDayPattern  <br />
                * "r": RFC1123Pattern   <br />
                * "R": RFC1123Pattern   <br />
                * "s": SortableDateTimePattern   <br />
                * "t": shortTimePattern   <br />
                * "T": LongTimePattern   <br />
                * "u": UniversalSortableDateTimePattern  <br />
                * "U": Full date and time (long date and long time) using universal time  <br />
                * "y": YearMonthPattern   <br />
                * "Y": yearMonthPattern   <br />
                *
                * Any date and time format string that contains more than one character,  <br/>
                * including white space, is interpreted as a custom date and time format
                * string. For example:    <br/>
                * "mmm-dd-yyyy", "mmmm d, yyyy", "mm/dd/yyyy", "d-mmm-yyyy",
                * "ddd, mmmm dd, yyyy" etc.   <br/>
                *
                * Below are the custom date and time format specifiers:  <br/>
                *   <br/>
                * "d": The day of the month, from 1 through 31.   <br />
                * "dd": The day of the month, from 01 through 31.  <br />
                * "ddd": The abbreviated name of the day of the week.  <br />
                * "dddd": The full name of the day of the week.   <br />
                * "m": The minute, from 0 through 59.   <br />
                * "mm": The minute, from 00 through 59.  <br />
                * "M": The month, from 1 through 12.  <br />
                * "MM": The month, from 01 through 12.  <br />
                * "MMM": The abbreviated name of the month.  <br />
                * "MMMM": The full name of the month.  <br />
                * "y": The year, from 0 to 99.   <br />
                * "yy": The year, from 00 to 99   <br />
                * "yyy": The year, with a minimum of three digits.  <br />
                * "yyyy": The year as a four-digit number   <br />
                * "h": The hour, using a 12-hour clock from 1 to 12.   <br />
                * "hh": The hour, using a 12-hour clock from 01 to 12.   <br />
                * "H": The hour, using a 24-hour clock from 0 to 23.   <br />
                * "HH": The hour, using a 24-hour clock from 00 to 23.  <br />
                * "s": The second, from 0 through 59.   <br />
                * "ss": The second, from 00 through 59.   <br />
                * "t": The first character of the AM/PM designator.   <br />
                * "tt": The AM/PM designator.    <br />
                */
                this.dateFormat = 'd';
                /** The format pattern to display the date value when control lost focus.
                *
                * @remarks
                * wijinputdate supports two types of formats:   <br />
                * Standard Format and Custom Format.   <br />
                * <br />
                * A standard date and time format string uses a single format specifier <br />
                * to define the text representation of a date and time value.   <br />
                *
                * Possible values for Standard Format are:  <br />
                * "d": ShortDatePattern  <br />
                * "D": LongDatePattern  <br />
                * "f": Full date and time (long date and short time) <br />
                * "F": FullDateTimePattern  <br />
                * "g": General (short date and short time)  <br />
                * "G": General (short date and long time)  <br />
                * "m": MonthDayPattern   <br />
                * "M": monthDayPattern  <br />
                * "r": RFC1123Pattern   <br />
                * "R": RFC1123Pattern   <br />
                * "s": SortableDateTimePattern  <br />
                * "t": shortTimePattern  <br />
                * "T": LongTimePattern   <br />
                * "u": UniversalSortableDateTimePattern  <br />
                * "U": Full date and time (long date and long time) using universal time   <br />
                * "y": YearMonthPattern  <br />
                * "Y": yearMonthPattern  <br />
                *
                * Any date and time format string that contains more than one character, <br />
                * including white space, is interpreted as a custom date and time format   <br />
                * string. For example: <br />
                * "mmm-dd-yyyy", "mmmm d, yyyy", "mm/dd/yyyy", "d-mmm-yyyy",
                * "ddd, mmmm dd, yyyy" etc.  <br />
                *
                * Below are the custom date and time format specifiers:  <br />
                *
                * "d": The day of the month, from 1 through 31.   <br />
                * "dd": The day of the month, from 01 through 31.   <br />
                * "ddd": The abbreviated name of the day of the week.  <br />
                * "dddd": The full name of the day of the week.  <br />
                * "m": The minute, from 0 through 59.   <br />
                * "mm": The minute, from 00 through 59.  <br />
                * "M": The month, from 1 through 12.  <br />
                * "MM": The month, from 01 through 12.   <br />
                * "MMM": The abbreviated name of the month.  <br />
                * "MMMM": The full name of the month. <br />
                * "y": The year, from 0 to 99.  <br />
                * "yy": The year, from 00 to 99  <br />
                * "yyy": The year, with a minimum of three digits.  <br />
                * "yyyy": The year as a four-digit number  <br />
                * "h": The hour, using a 12-hour clock from 1 to 12.  <br />
                * "hh": The hour, using a 12-hour clock from 01 to 12.  <br />
                * "H": The hour, using a 24-hour clock from 0 to 23.   <br />
                * "HH": The hour, using a 24-hour clock from 00 to 23.  <br />
                * "s": The second, from 0 through 59.   <br />
                * "ss": The second, from 00 through 59.  <br />
                * "t": The first character of the AM/PM designator.  <br />
                * "tt": The AM/PM designator.    <br />
                * "E": Display the nengo year as a single digit number when possible (first year use Japanese name).  <br />
                */
                this.displayFormat = '';
                /** Determines string designator for hours that are "ante meridiem" (before noon).
                * @remarks
                * The Text set in the amDesignator option is displayed in the position occupied by the keywords "tt" and "t"
                * in the dateFormat or dipslayFormat.  <br />
                * If the custom pattern includes the format pattern "tt" and the time is before noon,
                * the value of amDesignator is displayed in place of the "tt" in the dateFormat or displayFormat pattern.   <br />
                * If the custom pattern includes the format pattern "t", only the first character of amDesignator is displayed.   <br />
                * If setting "tt" in format and not setting amDesignator/pmDesignator options,
                * it will show the string getting from the specified culture.    <br />
                * If not set, it will show "午前"/"午後" in Japanese culture and "AM"/"PM" in English culture.   <br />
                * If setting "t" in format and not setting amDesignator/pmDesignator options, it will show the string getting from current culture.  <br />
                * If not set, it will display "午" in Japanese culture and "A"/"P" in English culture.  <br />
                */
                this.amDesignator = "";
                /** Determines the string designator for hours that are "post meridiem" (after noon).
                * @remarks
                * The Text set in the amDesignator option is displayed in the position occupied by the keywords "tt" and "t"
                * in the dateFormat or dipslayFormat.  <br />
                * If the custom pattern includes the format pattern "tt" and the time is after noon,
                * the value of pmDesignator is displayed in place of the "tt" in the dateFormat or displayFormat pattern.   <br />
                * If the custom pattern includes the format pattern "t", only the first character of pmDesignator is displayed.   <br />
                * If setting "tt" in format and not setting amDesignator/pmDesignator options,
                * it will show the string getting from the specified culture.    <br />
                * If not set, it will show "午前"/"午後" in Japanese culture and "AM"/"PM" in English culture.   <br />
                * If setting "t" in format and not setting amDesignator/pmDesignator options, it will show the string getting from current culture.  <br />
                * If not set, it will display "午" in Japanese culture and "A"/"P" in English culture.  <br />
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
                /** Determines how the control should interpret 2-digits year inputted in year field.
                * when the "smartInputMode" option is set to true.
                * @remarks
                * For example, if "startYear" is set to 1950 (the default value), and "smartInputMode" is true.   <br />
                * Enter 2-digit year value which is greater than 50 [e.g., 88]  <br />
                * ‘1988’ displays in year part.  <br />
                * Enter 2-digit year value which is less than 50 [e.g., 12]  <br />
                * ‘2012’ displays in year part.  <br />
                */
                this.startYear = 1950;
                /** Determines whether the control should interpret 2-digits year inputted in year field.
                * using the value provided in the "startYear" option.
                * @remarks
                * For example, when "smartInputMode" is false (the default value), and "startYear" is 1950. <br />
                * Enter 2-digit year value which is greater than 50 [e.g., 88]  <br />
                * ‘0088’ displays in year part.    <br />
                * Enter 2-digit year value which is less than 50 [e.g., 12]  <br />
                * ‘0012’ displays in year part.  <br />
                * Set "smartInputMode" to true.  <br />
                * Enter 2-digit year value which is greater than 50 [e.g., 88]  <br />
                * ‘1988’ displays in year part when smartInputMode is true.   <br />
                * Enter 2-digit year value which is less than 50 [e.g., 12]  <br />
                * ‘2012’ displays in year part. <br />
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
                * @ignore
                * @remarks
                * If the value is 'default', the widget will create a div and
                * append it to body element, and using this element to init calendar.
                * User can set this option value to an element,
                * and the widget will init the calendar using this element.
                */
                this.calendar = 'default';
                /** Detemines the popup position of a calendar.
                * See jQuery.ui.position for position options.
                * @example
                * // In the following example, the Y offset between the popup position and wijinputdate is 10 pixel.
                * $("#textbox1").wijinputdate({
                *     popupPosition: { offset: '0 10' },
                *     comboItems: [{ label: "first Day", value: new Date(2013, 1, 1) },
                *         { label: "second day", value: new Date(2013, 3, 3) },
                *         { label: "third day", value: new Date(2013, 4, 5) }]
                * });
                */
                this.popupPosition = {
                    offset: '0 4'
                };
                /** Gets or sets whether to highlight the control's Text on receiving input focus.
                * possible values is "field", "all" .
                * @example
                * $("#textbox1").wijinputdate({
                *     highlightText: "field"
                * });
                */
                this.highlightText = "field";
                /** Determines how much to increase/decrease the active field when performing spin on the the active field.
                * @example
                * $("#textbox1").wijinputdate({
                *     increment: 2
                * });
                */
                this.increment = 1;
                /** Determines the input method setting of widget.
                * Possible values are: 'auto', 'active', 'inactive', 'disabled'
                * @remarks
                * This property only take effect on IE and firefox browser.
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
                * @event
                */
                this.spinUp = null;
                /** The spinDown event handler.
                * A function called when spin down event fired.
                * @event
                */
                this.spinDown = null;
                /** The valueBoundsExceeded event hander.
                * A function called when the valueBoundExceeded event fired.
                * @event
                */
                this.valueBoundsExceeded = null;
            }
            return wijinputdate_options;
        })();        
        wijinputdate.prototype.options = $.extend(true, {
        }, input.wijinputcore.prototype.options, new wijinputdate_options());
        $.wijmo.registerWidget("wijinputdate", wijinputdate.prototype);
        /** @ignore */
        var wijDateTextProvider = (function () {
            function wijDateTextProvider(inputWidget, format, displayFormat) {
                this.inputWidget = inputWidget;
                this._disableSmartInputMode = false;
                this.paddingZero = input.paddingZero;
                this.formatter = new input.wijDateTextFormatter(inputWidget, format, false);
                displayFormat = displayFormat == "" ? format : displayFormat;
                this.displayFormatter = new input.wijDateTextFormatter(inputWidget, displayFormat, true);
            }
            wijDateTextProvider.prototype.initialize = function () {
            };
            wijDateTextProvider.prototype.getFiledText = function (index) {
                var desc = this.formatter.fields[index];
                return desc.getText();
            };
            wijDateTextProvider.prototype.getFieldCount = function () {
                return this.formatter.fields.length;
            };
            wijDateTextProvider.prototype.getFieldRange = function (index) {
                if(index >= this.formatter.fields.length) {
                    index = this.formatter.fields.length - 1;
                }
                var desc = this.formatter.fields[index];
                return {
                    start: desc.startIndex,
                    end: desc.startIndex + desc.getText().length
                };
            };
            wijDateTextProvider.prototype.getAllRange = function () {
                return {
                    start: 0,
                    end: this.formatter.toString().length
                };
            };
            wijDateTextProvider.prototype.getCursorField = function (pos) {
                if(this.formatter.desPostions.length == 0) {
                    return 0;
                }
                pos = Math.min(pos, this.formatter.desPostions.length - 1);
                pos = Math.max(pos, 0);
                var desc = this.formatter.desPostions[pos].desc, i;
                if(desc.type === -1) {
                    i = $.inArray(desc, this.formatter.descriptors);
                    if(i > 0 && this.formatter.descriptors[i - 1].type !== -1) {
                        desc = this.formatter.descriptors[i - 1];
                    } else {
                        return -1;// liternal
                        
                    }
                }
                return $.inArray(desc, this.formatter.fields);
            };
            wijDateTextProvider.prototype.needToMove = function (index, pos, ch) {
                if(!this.inputWidget._isValidDate(this.inputWidget._safeGetDate(), true)) {
                    return false;
                }
                var desc = this.formatter.fields[index];
                switch(desc.type) {
                    case 72:
                    case 73:
                    case 74:
                        for(var i = 0; i < input.DateTimeInfo.GetEraCount(); i++) {
                            if((ch.toLowerCase() === input.DateTimeInfo.GetEraShortcuts()[i].toLowerCase()) || (ch.toLowerCase() === input.DateTimeInfo.GetEraShortNames()[i].toLowerCase()) || (ch.toLowerCase() === input.DateTimeInfo.GetEraAbbreviations()[i].toLowerCase()) || (ch.toLowerCase() === input.DateTimeInfo.GetEraNames()[i].toLowerCase())) {
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
                return this.formatter._isEraFormatExist();
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
                return this.formatter._setFormat(format);
            };
            wijDateTextProvider.prototype._setDisplayFormat = function (displayFormat) {
                return this.displayFormatter._setFormat(displayFormat);
            };
            wijDateTextProvider.prototype._internalSetDate = function (date) {
                if(this.inputWidget) {
                    this.inputWidget._internalSetDate(date);
                }
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
                        return this.displayFormatter.toString();
                    }
                }
                return this.formatter.toString();
            };
            wijDateTextProvider.prototype.parseDate = function (str) {
                var date;
                //if (this.formatter.pattern === 'dddd' ||
                //    this.formatter.pattern === 'ddd' ||
                //    typeof str === 'object') {
                //    try {
                //        date = new Date(str);
                //        if (isNaN(date)) {
                //            date = new Date();
                //        }
                //    }
                //    catch (e) {
                //        date = new Date();
                //    }
                //} else {
                //    date = Globalize.parseDate(str, this.formatter.pattern, this._getCulture());
                //    if (!date) {
                //        date = this._tryParseDate(str, this.formatter.pattern);
                //    }
                //    if (!date) {
                //        date = null;
                //    }
                //}
                date = $.wijinputcore.parseDate(str, this.formatter.pattern, this._getCulture());
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
            wijDateTextProvider.prototype.isFieldSep = function (input, activeField) {
                var nextField = activeField++, desc;
                if(nextField < this.formatter.descriptors.length) {
                    desc = this.formatter.descriptors[nextField];
                    if(desc.type !== -1) {
                        return false;
                    }
                    return (input === desc.text);
                }
                return false;
            };
            wijDateTextProvider.prototype.getPositionType = function (pos) {
                var desPos = this.formatter.desPostions[pos];
                return desPos.desc.type;
            };
            wijDateTextProvider.prototype.addToField = function (input, activeField, pos) {
                var desc = this.formatter.fields[activeField], txt, resultObj, ret;
                txt = input;
                resultObj = {
                    val: input,
                    pos: 0,
                    offset: 0,
                    isreset: false
                };
                this.inputWidget.element.data('typing', true);
                ret = desc.setText(txt, ((input.length === 1) ? false : true), resultObj, this._isSmartInputMode());
                this.inputWidget.element.data('typing', false);
                return ret;
            };
            wijDateTextProvider.prototype.insertAt = function (strInput, position, rh) {
                if (typeof rh === "undefined") { rh = new input.wijInputResult(); }
                rh.testPosition = -1;
                var desPos, oldTxt, pos, txt, tryToExpandAtRight, result, tryToExpandAtLeft, curInsertTxt, resultObj, prevTextLength, posAdjustValue, altInsertText, newTextLength, diff, s, delimOrEndPos, delta;
                if(strInput.length === 1) {
                    desPos = this.formatter.desPostions[position];
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
                    desPos = this.formatter.desPostions[pos];
                    tryToExpandAtRight = true;
                    if(desPos && (desPos.desc.type === -1 || desPos.desc.getText().length !== 1)) {
                        position++;
                        pos++;
                        tryToExpandAtRight = false;
                    }
                }
                result = false;
                while(txt.length > 0 && pos < this.formatter.desPostions.length) {
                    desPos = this.formatter.desPostions[pos];
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
            wijDateTextProvider.prototype.removeAt = function (start, end, rh, skipCheck) {
                try  {
                    var desPos = this.formatter.desPostions[start], curInsertTxt, pos, resultObj, result, widget = this.inputWidget, element = widget.element, dateLength = element.val().length;
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
                        result = desPos.desc.setText(curInsertTxt, false, resultObj, this._isSmartInputMode());
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
                var desc = this.formatter.fields[this.inputWidget.options.activeField];
                if(desc) {
                    desc.inc();
                }
                return true;
            };
            wijDateTextProvider.prototype.decEnumPart = function () {
                var desc = this.formatter.fields[this.inputWidget.options.activeField];
                if(desc) {
                    desc.dec();
                }
                return true;
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
                            return input.paddingZero(date.getFullYear(), 4);
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
            wijDateTextProvider.prototype.replaceWith = function (range, text) {
                var index = range.start;
                var result = new input.wijInputResult();
                if(range.start < range.end) {
                    this.removeAt(range.start, range.end - 1, result, true);
                    index = result.testPosition;
                }
                return this.insertAt(text, index, result) ? result : null;
            };
            return wijDateTextProvider;
        })();
        input.wijDateTextProvider = wijDateTextProvider;        
        ;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
