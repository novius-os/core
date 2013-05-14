/*
 *
 * Wijmo Library 3.20131.4
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
*	jquery.plugin.wijtextselection.js
*	jquery.mousewheel.js
*	jquery.wijmo.wijpopup.js
*	jquery.wijmo.wijcalendar.js
*	jquery.wijmo.wijinputcore.js
*
*/
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery, jqKeyCode = ($.ui || $.mobile).keyCode;
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
            this._textProvider = new wijDateTextProvider(this, this.options.dateFormat);
        };
        wijinputdate.prototype._strToDate = function (str) {
            return this._textProvider.parseDate(str);
        };
        wijinputdate.prototype._beginUpdate = function () {
            var o = this.options, strDate, date = null;
            _super.prototype._beginUpdate.call(this);
            if(o.minDate) {
                if(typeof o.minDate === 'string') {
                    o.minDate = this._strToDate(o.minDate);
                }
            }
            if(o.maxDate) {
                if(typeof o.maxDate === 'string') {
                    o.maxDate = this._strToDate(o.maxDate);
                }
            }
            if(!o.date) {
                if(!!this.element.data('elementValue')) {
                    strDate = this.element.data('elementValue');
                }
            } else {
                if(typeof o.date === 'string') {
                    strDate = o.date;
                } else {
                    date = o.date;
                }
            }
            if(strDate) {
                date = this._strToDate(strDate);
            }
            this._safeSetDate(date);
            this.element.data({
                defaultDate: date === null ? date : new Date(o.date.getTime()),
                preDate: date === null ? date : new Date(o.date.getTime())
            });
            this._resetTimeStamp();
            if(o.showTrigger && !this._hasComboItems()) {
                this._initCalendar();
            }
            this.element.addClass(o.wijCSS.wijinputdate).attr({
                'aria-valuemin': new Date(1900, 1, 1),
                'aria-valuemax': new Date(2099, 1, 1),
                'aria-valuenow': o.date
            });
        };
        wijinputdate.prototype._endUpdate = function () {
            var _this = this;
            _super.prototype._endUpdate.call(this);
            this.element.bind("click.wijinput", function () {
                _this._highLightCursor();
            });
        };
        wijinputdate.prototype._isValidDate = function (date, chkBounds) {
            var o = this.options;
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
                if(o.minDate) {
                    if(date < o.minDate) {
                        return false;
                    }
                }
                if(o.maxDate) {
                    if(date > o.maxDate) {
                        return false;
                    }
                }
            }
            return true;
        };
        wijinputdate.prototype._checkRange = function (date) {
            var o = this.options;
            if(date) {
                if(o.minDate && date < o.minDate) {
                    date = new Date(Math.max(o.minDate, date));
                }
                if(o.maxDate && date > o.maxDate) {
                    date = new Date(Math.min(o.maxDate, date));
                }
            }
            return date;
        };
        wijinputdate.prototype._safeSetDate = function (date) {
            var o = this.options, cache = date;
            date = this._checkRange(date);
            if(isNaN(date)) {
                date = cache;
            }
            o.date = date;
            return true;
        };
        wijinputdate.prototype._safeGetDate = function () {
            var date = this.options.date || this._creationDate;
            date = this._checkRange(date);
            return date;
        };
        wijinputdate.prototype._setOption = function (key, value) {
            _super.prototype._setOption.call(this, key, value);
            switch(key) {
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
                case 'dateFormat':
                case 'culture':
                    this._textProvider._setFormat(this.options.dateFormat);
                    this._updateText();
                    // update the calendar 's culture
                    var calendar = this.element.data('calendar');
                    if(calendar) {
                        calendar.wijcalendar("option", key, value);
                    }
                    break;
                case 'activeField':
                    value = Math.min(value, this._textProvider.getFieldCount() - 1);
                    value = Math.max(value, 0);
                    this.options.activeField = value;
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
        };
        wijinputdate.prototype.getPostValue = /**
        Gets the text value when the container form is posted back to the server. This method returns the widget date text.
        Code Example:
        $("#element").wijinputnumber("getPostValue");
        */
        function () {
            if(!this._isInitialized()) {
                return this.element.val();
            }
            if(this.options.showNullText && this.isDateNull()) {
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
                rh = new wijmo.wijInputResult();
                this._textProvider.removeAt(range.start, range.end, rh);
                this._updateText();
                window.setTimeout(function () {
                    self._highLightField();
                }, 1);
            }
        };
        wijinputdate.prototype._doSpin = function (up, repeating) {
            var _this = this;
            if(!this._allowEdit()) {
                return false;
            }
            if(repeating && this.element.data('breakSpinner')) {
                return false;
            }
            if(this._textProvider[up ? 'incEnumPart' : 'decEnumPart']()) {
                this._updateText();
                this._highLightField();
            }
            if(repeating && !this.element.data('breakSpinner')) {
                window.setTimeout(function () {
                    return _this._doSpin(up, true);
                }, this._calcSpinInterval());
            }
            return true;
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
        wijinputdate.prototype._keyDownPreview = function (e) {
            var key = e.keyCode || e.which, selRange;
            switch(key) {
                case jqKeyCode.LEFT:
                    this._toPrevField();
                    return true;
                case jqKeyCode.RIGHT:
                    this._toNextField();
                    return true;
                case jqKeyCode.TAB:
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
                        this._setOption('date', new Date('1970/1/1'));
                    } else {
                        this._toLastField();
                    }
                    return true;
                case jqKeyCode.DELETE:
                    if(this._allowEdit()) {
                        selRange = this.element.wijtextselection();
                        if(selRange.end - selRange.start === this.element.val().length) {
                            this.isDeleteAll = true;
                            this._setOption('date', new Date('1970/1/1'));
                        } else {
                            this._clearField();
                        }
                        return true;
                    }
                    break;
            }
            return false;
        };
        wijinputdate.prototype._autoMoveToNextField = function (pos, ch) {
            if(!this.options.autoNextField) {
                return;
            }
            if(this._textProvider.needToMove(this.options.activeField, pos, ch)) {
                this._toNextField();
            }
        };
        wijinputdate.prototype._keyPressPreview = function (e) {
            var key = e.keyCode || e.which, range, ch, fieldSep, cursor, now, newAction, lastTime, pos, ret, input, lastInput;
            if(key === jqKeyCode.ENTER) {
                if(this.isDateNull()) {
                    this.options.date = new Date();
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
                ret = this._textProvider.addToField(input, this.options.activeField, pos);
                if(ret) {
                    this._updateText();
                    this._autoMoveToNextField(cursor, ch);
                    this._highLightField();
                } else {
                    this._resetTimeStamp();
                    this._fireIvalidInputEvent();
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
                this._syncCalendar();
                this.element.attr('aria-valuenow', d);
                this._trigger('dateChanged', null, {
                    date: d
                });
            }
        };
        wijinputdate.prototype.isDateNull = /**
        Determines whether the date is a null value.
        Code Example:
        $("#element").wijinputnumber("isDateNull");
        */
        function () {
            return this.options.date === null || this.options.date === undefined;
        };
        wijinputdate.prototype._isMinDate = function (date) {
            return date.getFullYear() === 1 && date.getMonth() === 0 && date.getDate() === 1;
        };
        wijinputdate.prototype._initCalendar = function () {
            var _this = this;
            var o = this.options, c = o.calendar, calendar;
            if(c === undefined || c === null) {
                return;
            }
            if(typeof (c) === 'boolean' || c === 'default') {
                c = $("<div/>");
                c.appendTo(document.body);
            }
            calendar = $(c);
            if(calendar.length !== 1) {
                return;
            }
            this.element.data('calendar', calendar);
            // if the localization from the resource files.
            if(o.localization) {
                o.nextTooltip = o.localization.nextTooltip;
                o.prevTooltip = o.localization.prevTooltip;
                o.titleFormat = o.localization.titleFormat;
                o.toolTipFormat = o.localization.toolTipFormat;
            }
            calendar.wijcalendar({
                popupMode: true,
                culture: o.culture,
                nextTooltip: //add for localization(tooltip)
                o.nextTooltip || 'Next',
                prevTooltip: o.prevTooltip || 'Previous',
                titleFormat: o.titleFormat || 'MMMM yyyy',
                toolTipFormat: o.toolTipFormat || 'dddd, MMMM dd, yyyy',
                selectedDatesChanged: function () {
                    var selDate = calendar.wijcalendar("getSelectedDate"), curDate = _this.option('date');
                    calendar.wijcalendar("close");
                    if(selDate) {
                        if(curDate) {
                            selDate.setHours(curDate.getHours());
                            selDate.setMinutes(curDate.getMinutes());
                            selDate.setSeconds(curDate.getSeconds());
                            selDate.setMilliseconds(curDate.getMilliseconds());
                        }
                        _this.option('date', selDate);
                        _this.selectText();
                    }
                    _this._trySetFocus();
                }
            });
            this._syncCalendar();
            // the bind event can't trigger.!!!
            //            calendar.bind('wijcalendarselectedDatesChanged', function () {
            //                var selDate = $(this).wijcalendar("getSelectedDate");
            //                $(this).wijcalendar("close");
            //                if (!!selDate) { self.option('date', selDate); }
            //                self._trySetFocus();
            //               });
                    };
        wijinputdate.prototype._syncCalendar = function () {
            var calendar = this.element.data('calendar'), o, d;
            if(!calendar) {
                return;
            }
            o = this.options;
            d = this._safeGetDate();
            if(this._isMinDate(d)) {
                d = new Date();
            }
            calendar.wijcalendar('option', 'displayDate', d);
            if(o.minDate) {
                calendar.wijcalendar('option', 'minDate', o.minDate);
            }
            if(o.maxDate) {
                calendar.wijcalendar('option', 'maxDate', o.maxDate);
            }
            calendar.wijcalendar('unSelectAll');
            calendar.wijcalendar('selectDate', d);
            calendar.wijcalendar('refresh');
        };
        wijinputdate.prototype._isPopupShowing = function () {
            var calendar = this.element.data('calendar');
            if(!calendar) {
                return _super.prototype._isPopupShowing.call(this);
            }
            return calendar.wijcalendar('isPopupShowing');
        };
        wijinputdate.prototype._showPopup = function () {
            var calendar = this.element.data('calendar');
            if(!calendar) {
                return _super.prototype._showPopup.call(this);
            }
            if(!this._allowEdit()) {
                return;
            }
            this._syncCalendar();
            calendar.wijcalendar('popup', $.extend({
            }, this.options.popupPosition, {
                of: this.outerDiv
            }));
        };
        wijinputdate.prototype._hidePopup = function () {
            var calendar = this.element.data('calendar');
            if(!calendar) {
                return _super.prototype._hidePopup.call(this);
            }
            calendar.wijcalendar("close");
        };
        wijinputdate.prototype._isCalendarVisible = function () {
            if(!this._allowEdit()) {
                return false;
            }
            var calendar = this.element.data('calendar');
            if(!calendar) {
                return false;
            }
            return calendar.wijcalendar('isPopupShowing');
        };
        wijinputdate.prototype._popupVisible = function () {
            if(this._hasComboItems()) {
                return this._isComboListVisible();
            } else {
                return this._isCalendarVisible();
            }
            return false;
        };
        return wijinputdate;
    })(wijmo.wijinputcore);
    wijmo.wijinputdate = wijinputdate;    
    var wijinputdate_options = (function () {
        function wijinputdate_options() {
            this.wijCSS = {
                wijinputdate: wijmo.wijinputcore.prototype.options.wijCSS.wijinput + "-date"
            };
            /**
            Determines the default date value for a date input.
            Type: Date/String/Number
            Default: null
            Code Example:
            $(¡®.selector¡¯).wijinputdate({date: ¡®2010/8/12¡¯});
            */
            this.date = null;
            /**
            Determines the minimal date that can be entered.
            Type: Date/String/Number
            Default: null
            Code Example:
            $(¡®.selector¡¯).wijinputdate({minDate: ¡®2010/5/01¡¯});
            */
            this.minDate = null;
            /**
            Determines the maximum date that can be entered.
            Type: Date/String/Number
            Default: null
            Code Example:
            $(¡®.selector¡¯).wijinputdate({maxDate: ¡®2010/8/12¡¯});
            */
            this.maxDate = null;
            /** The format pattern to display the date value of wijinputdate supports two
            types of formats: Standard format and Custom format. A standard date
            and time format string uses a single format specifier to define the text
            representation of a date and time value.
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
            Type: String
            Default: 'd'
            Code Example:
            $(¡®.selector¡¯).wijinputdate({dateFormat: ¡®D¡¯});
            */
            this.dateFormat = 'd';
            /**
            Determines the value of the starting year to be used for the smart input year calculation.
            Type: Number
            Default: 1950
            Code Example:
            $(¡®.selector¡¯).wijinputdate({startYear: 2010});
            */
            this.startYear = 1950;
            /**
            Allows smart input behavior. For example, if this option is true and the
            date's startYear is '00', then the user can enter a character and the year
            will auto calculate according the startYear option.
            Type: Boolean
            Default: true
            Code Example:
            $(¡®.selector¡¯).wijinputdate({smartInputMode: false});
            */
            this.smartInputMode = true;
            /**
            Determines the active field index.
            Remarks: The active field is highlighted to accept a user¡¯s input.
            Type: Number
            Default: 0
            Code Example:
            $(¡®.selector¡¯).wijinputdate({activeField: 3});
            */
            this.activeField = 0;
            /** Determines the time span, in milliseconds,
            * between two input intentions.
            * @remarks
            * when press a keyboard, and the widget will delay a time and then handle
            * the next keyboard press. Use this option to control the speed of the key press.
            Type: Number
            Default: 800
            Code Example:
            $(¡®.selector¡¯).wijinputdate({keyDelay: 500});
            */
            this.keyDelay = 800;
            /** Determines whether to automatically move to the next field.
            * @remarks
            * For example, if user want input the '2012-9-20' in inputdate widget,
            * if this option's value is true, when user type '2012' in textbox,
            * it will auto focus in next field, user can type '9' in second field,
            * if this option's value is false, user want to type '9' in second field,
            * they should focus the second field by manual.
            Type: Boolean
            Default: true
            Code Example:
            $(¡®.selector¡¯).wijinputdate({autoNextField:false});
            */
            this.autoNextField = true;
            /** Determines the calendar element for a date input.
            * @remarks
            * If the value is 'default', the widget will create a div and
            * append it to body element, and using this element to init calendar.
            * User can set this option value to an element,
            * and the widget will init the calendar using this element.
            Type: String/DOMElement/jQuery
            Default: 'default'
            */
            this.calendar = 'default';
            /** Detemines the popup position of a calendar.
            * See jQuery.ui.position for position options.
            Type: Object
            Default: {offset: '0 4'}
            Code Example:
            $(¡®.selector¡¯).wijinputdate({popupPosition:{collision: ¡®flip¡¯}});
            */
            this.popupPosition = {
                offset: '0 4'
            };
            /** The dateChanged event handler. A function called when the date of the input is changed.
            * @event
            * @dataKey {Date} date The data with this event.
            Type: Function
            Default: null
            Code Example:
            $(¡®.selector¡¯).wijinputdate({dateChanged: function(e, arg){}});
            */
            this.dateChanged = null;
        }
        return wijinputdate_options;
    })();    
    wijinputdate.prototype.options = $.extend(true, {
    }, wijmo.wijinputcore.prototype.options, new wijinputdate_options());
    $.wijmo.registerWidget("wijinputdate", wijinputdate.prototype);
    var wijDateTextProvider = (function (_super) {
        __extends(wijDateTextProvider, _super);
        function wijDateTextProvider(inputWidget, format) {
                _super.call(this);
            this.inputWidget = inputWidget;
            this.maskPartsCount = 0;
            this.pattern = 'M/d/yyyy';
            this._disableSmartInputMode = false;
            this.paddingZero = paddingZero;
            this.descriptors = new Array(0);
            this.desPostions = new Array(0);
            this.fields = new Array(0);
            this._setFormat(format);
        }
        wijDateTextProvider.prototype.initialize = function () {
        };
        wijDateTextProvider.prototype.getFieldCount = function () {
            return this.fields.length;
        };
        wijDateTextProvider.prototype.getFieldRange = function (index) {
            var desc = this.fields[index];
            return {
                start: desc.startIndex,
                end: desc.startIndex + desc.getText().length
            };
        };
        wijDateTextProvider.prototype.getCursorField = function (pos) {
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
            var desc = this.fields[index], val = parseInt(ch, 10);
            if(pos === desc.maxLen) {
                return true;
            }
            if(isNaN(val)) {
                return false;
            }
            switch(desc.type) {
                case 20:
                case 25:
                case 45:
                case 46:
                    return val > 1;
                case 47:
                case 48:
                    return val > 2;
                case 30:
                case 31:
                    return val > 3;
                case 50:
                case 51:
                case 60:
                case 61:
                    return val > 6;
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
            this.descriptors = [];
            var curPattern = '', prevCh = '', isBegin = false, liternalNext = false, i, ch;
            this.pattern = this._parseFormatToPattern(format);
            for(i = 0; i < this.pattern.length; i++) {
                ch = this.pattern.charAt(i);
                if(liternalNext) {
                    this.descriptors.push(this.createDescriptor(-1, ch));
                    curPattern = '';
                    liternalNext = false;
                    continue;
                }
                if(ch === '\\') {
                    liternalNext = true;
                    if(curPattern.length > 0) {
                        if(!this.handlePattern(curPattern)) {
                            this.descriptors.push(this.createDescriptor(-1, prevCh));
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
                            if(!this.handlePattern(curPattern)) {
                                this.descriptors.push(this.createDescriptor(-1, prevCh));
                            }
                            curPattern = '';
                        }
                    }
                    continue;
                }
                if(isBegin) {
                    this.descriptors.push(this.createDescriptor(-1, ch));
                    curPattern = '';
                    continue;
                }
                if(!i) {
                    prevCh = ch;
                }
                if(prevCh !== ch && curPattern.length > 0) {
                    if(!this.handlePattern(curPattern)) {
                        this.descriptors.push(this.createDescriptor(-1, prevCh));
                    }
                    curPattern = '';
                }
                curPattern += ch;
                prevCh = ch;
            }
            if(curPattern.length > 0) {
                if(!this.handlePattern(curPattern)) {
                    this.descriptors.push(this.createDescriptor(-1, prevCh));
                }
            }
            this.fields = $.grep(this.descriptors, function (d) {
                return d.type !== -1;
            });
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
            return (!!this.inputWidget) ? new Date(this.inputWidget._safeGetDate().getTime()) : undefined;
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
                        if((now.getTime() - lastTime.getTime()) > o.keyDelay) {
                            self.inputWidget._safeSetDate(o.date);
                            self.inputWidget._updateText();
                            self.inputWidget._highLightField();
                        } else {
                            window.setTimeout(chkBounds, o.keyDelay);
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
        wijDateTextProvider.prototype.handlePattern = function (p) {
            var reg = new RegExp('y{3,4}'), suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(10));
                return true;
            }
            reg = new RegExp('y{2,2}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(2));
                return true;
            }
            reg = new RegExp('y{1,1}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(1));
                return true;
            }
            reg = new RegExp('d{4,4}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(101));
                return true;
            }
            reg = new RegExp('d{3,3}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(100));
                return true;
            }
            reg = new RegExp('d{2,2}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(30));
                return true;
            }
            reg = new RegExp('d{1,1}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(31));
                return true;
            }
            reg = new RegExp('M{4,4}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(27));
                return true;
            }
            reg = new RegExp('M{3,3}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(26));
                return true;
            }
            reg = new RegExp('M{2,2}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(20));
                return true;
            }
            reg = new RegExp('M{1,1}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(25));
                return true;
            }
            reg = new RegExp('h{2,2}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(46));
                return true;
            }
            reg = new RegExp('h{1,1}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(45));
                return true;
            }
            reg = new RegExp('H{2,2}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(48));
                return true;
            }
            reg = new RegExp('H{1,1}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(47));
                return true;
            }
            reg = new RegExp('m{2,2}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(50));
                return true;
            }
            reg = new RegExp('m{1,1}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(51));
                return true;
            }
            reg = new RegExp('s{2,2}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(60));
                return true;
            }
            reg = new RegExp('s{1,1}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(61));
                return true;
            }
            reg = new RegExp('t{2,2}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(251));
                return true;
            }
            reg = new RegExp('t{1,1}');
            suc = reg.test(p);
            if(suc) {
                this.descriptors.push(this.createDescriptor(250));
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
                default:
                    break;
            }
            return desc;
        };
        wijDateTextProvider.prototype.toString = function () {
            if(this.inputWidget.options.showNullText && !this.inputWidget.isFocused() && this.inputWidget.isDateNull()) {
                return this.inputWidget.options.nullText;
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
                    date = new Date();
                }
            }
            return date;
        };
        wijDateTextProvider.prototype.set = function (input) {
            this._internalSetDate(new Date(this.parseDate(input)));
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
        wijDateTextProvider.prototype.insertAt = function (input, position, rh) {
            if (typeof rh === "undefined") { rh = new wijmo.wijInputResult(); }
            rh.testPosition = -1;
            var desPos, oldTxt, pos, txt, tryToExpandAtRight, result, tryToExpandAtLeft, curInsertTxt, resultObj, prevTextLength, posAdjustValue, altInsertText, newTextLength, diff, s, delimOrEndPos, delta;
            if(input.length === 1) {
                desPos = this.desPostions[position];
                if(desPos && desPos.desc.type === -1) {
                    if(desPos.text === input) {
                        rh.testPosition = position;
                        rh.hint = rh.characterEscaped;
                        return true;
                    }
                }
            }
            oldTxt = input;
            pos = position;
            input = this.removeLiterals(input);
            txt = input;
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
                        if(input.length === 1) {
                            if(!desPos.pos) {
                                altInsertText = input;
                            } else if(desPos.pos > 0) {
                                altInsertText = curInsertTxt.substring(0, desPos.pos + 1);
                            }
                        }
                    } catch (e) {
                    }
                    if(prevTextLength === 1 && curInsertTxt.length > 1 && input.length === 1) {
                        if(desPos.desc.type === 31 || desPos.desc.type === 25) {
                            this._disableSmartInputMode = true;
                        }
                    }
                    resultObj = {
                        val: input,
                        pos: desPos.pos,
                        offset: 0,
                        isreset: false
                    };
                    result = desPos.desc.setText(curInsertTxt, ((input.length === 1) ? false : true), resultObj);
                    this._disableSmartInputMode = false;
                    if(!result && typeof (altInsertText) !== 'undefined' && altInsertText.length > 0 && (desPos.desc.type === 26 || desPos.desc.type === 27 || desPos.desc.type === 100 || desPos.desc.type === 101 || desPos.desc.type === 250 || desPos.desc.type === 251)) {
                        result = desPos.desc.setText(altInsertText, ((input.length === 1) ? false : true), resultObj);
                    }
                    if(result) {
                        rh.hint = rh.success;
                        rh.testPosition = pos + resultObj.offset;
                        if(input.length === 1) {
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
                        if(desPos.desc.type !== -1 && input.length === 1) {
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
                        val: input,
                        pos: desPos.pos,
                        offset: 0,
                        isreset: false
                    };
                    result = desPos.desc.setText(curInsertTxt, ((input.length === 1) ? false : true), resultObj);
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
    })(wijmo.wijTextProvider);
    wijmo.wijDateTextProvider = wijDateTextProvider;    
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
    })(wijmo.DescriptorType || (wijmo.DescriptorType = {}));
    var DescriptorType = wijmo.DescriptorType;
    ////////////////////////////////////////////////////////////////////////////////
    // _iDateDescriptor
    var _iDateDescriptor = (function () {
        function _iDateDescriptor(textProvider, id) {
            this.id = id;
            this.startIndex = 0;
            this.name = null;
            this.type = DescriptorType.liternal;
            this.maxLen = 2;
            this._txtProvider = textProvider;
            this.startIndex = 0;
        }
        _iDateDescriptor.prototype.getText = function () {
            return null;
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
    wijmo._iDateDescriptor = _iDateDescriptor;    
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
    ////////////////////////////////////////////////////////////////////////////////
    // _dateDescriptor20
    var MonthDateDescriptor = (function (_super) {
        __extends(MonthDateDescriptor, _super);
        function MonthDateDescriptor(owner, id) {
                _super.call(this, owner, id);
        }
        MonthDateDescriptor.prototype.inc = function () {
            this._txtProvider.setMonth(this._txtProvider.getMonth() + 1, true);
        };
        MonthDateDescriptor.prototype.dec = function () {
            this._txtProvider.setMonth(this._txtProvider.getMonth() - 1, true);
        };
        MonthDateDescriptor.prototype.setText = function (value, allowchangeotherpart, result) {
            return this._txtProvider.setMonth(value, allowchangeotherpart, result);
        };
        return MonthDateDescriptor;
    })(_iDateDescriptor);    
    var _dateDescriptor20 = (function (_super) {
        __extends(_dateDescriptor20, _super);
        function _dateDescriptor20(owner, id) {
                _super.call(this, owner, id);
            this.name = 'Two-digit month';
            this.type = DescriptorType.TwoDigitMonth;
        }
        _dateDescriptor20.prototype.getText = function () {
            var m = '' + this._txtProvider.getMonth() + '';
            return m.length === 1 ? ('0' + m) : m;
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
            this.type = DescriptorType.Month;
        }
        _dateDescriptor25.prototype.getText = function () {
            var m = '' + this._txtProvider.getMonth() + '';
            return m;
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
            this.type = DescriptorType.AbbreviatedMonthNames;
            this.maxLen = DescriptorType.AbbreviatedMonthNames;
        }
        _dateDescriptor26.prototype.getText = function () {
            var m = this._txtProvider.getMonth(), culture = this._txtProvider._getCulture();
            return culture.calendars.standard.months.namesAbbr[m - 1];
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
            this.type = DescriptorType.MonthNames;
            this.maxLen = 100;
        }
        _dateDescriptor27.prototype.getText = function () {
            var m = this._txtProvider.getMonth(), culture = this._txtProvider._getCulture();
            return culture.calendars.standard.months.names[m - 1];
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
    ////////////////////////////////////////////////////////////////////////////////
    // _dateDescriptor30
    var DayOfMonthDescriptor = (function (_super) {
        __extends(DayOfMonthDescriptor, _super);
        function DayOfMonthDescriptor(owner, id) {
                _super.call(this, owner, id);
        }
        DayOfMonthDescriptor.prototype.inc = function () {
            this._txtProvider.setDayOfMonth(this._txtProvider.getDayOfMonth() + 1, true);
        };
        DayOfMonthDescriptor.prototype.dec = function () {
            this._txtProvider.setDayOfMonth(this._txtProvider.getDayOfMonth() - 1, true);
        };
        DayOfMonthDescriptor.prototype.setText = function (value, allowchangeotherpart, result) {
            return this._txtProvider.setDayOfMonth(value, allowchangeotherpart, result);
        };
        return DayOfMonthDescriptor;
    })(_iDateDescriptor);    
    var _dateDescriptor30 = (function (_super) {
        __extends(_dateDescriptor30, _super);
        function _dateDescriptor30(owner, id) {
                _super.call(this, owner, id);
            this.name = 'Two-digit day of month';
            this.type = DescriptorType.TwoDigityDayOfMonth;
        }
        _dateDescriptor30.prototype.getText = function () {
            return paddingZero(this._txtProvider.getDayOfMonth());
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
            this.type = DescriptorType.DayOfMonth;
        }
        _dateDescriptor31.prototype.getText = function () {
            var dom = this._txtProvider.getDayOfMonth();
            return '' + dom + '';
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
            this.type = DescriptorType.AbbreviatedDayNames;
            this.maxLen = 100;
        }
        _dateDescriptor100.prototype.getText = function () {
            var dw = this._txtProvider.getDayOfWeek(), culture = this._txtProvider._getCulture();
            return culture.calendars.standard.days.namesShort[dw - 1];
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
            this.type = DescriptorType.DayNames;
            this.maxLen = 100;
        }
        _dateDescriptor101.prototype.getText = function () {
            var dw = this._txtProvider.getDayOfWeek(), culture = this._txtProvider._getCulture();
            return culture.calendars.standard.days.names[dw - 1];
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
    ////////////////////////////////////////////////////////////////////////////////
    // _dateDescriptor10
    var YearDateDescriptor = (function (_super) {
        __extends(YearDateDescriptor, _super);
        function YearDateDescriptor(owner, id) {
                _super.call(this, owner, id);
        }
        YearDateDescriptor.prototype.inc = function () {
            this._txtProvider.setYear(this._txtProvider.getYear() + 1, null, true);
        };
        YearDateDescriptor.prototype.dec = function () {
            this._txtProvider.setYear(this._txtProvider.getYear() - 1, null, true);
        };
        return YearDateDescriptor;
    })(_iDateDescriptor);    
    var _dateDescriptor10 = (function (_super) {
        __extends(_dateDescriptor10, _super);
        function _dateDescriptor10(owner, id) {
                _super.call(this, owner, id);
            this.name = 'Four-digit year';
            this.type = DescriptorType.FourDigitYear;
            this.maxLen = 4;
        }
        _dateDescriptor10.prototype.getText = function () {
            return paddingZero(this._txtProvider.getYear(), 4);
        };
        _dateDescriptor10.prototype.setText = function (value, allowchangeotherpart, result) {
            if(this._txtProvider._isSmartInputMode() && result) {
                var startYear = 1900 + 100, startYearStr, endYear, curDate, thisYear, inputNum, century, addYear, s;
                if(this._txtProvider.inputWidget.options.startYear) {
                    startYear = this._txtProvider.inputWidget.options.startYear;
                }
                endYear = startYear + 100 - 1;
                startYearStr = this._txtProvider.paddingZero(startYear, 4);
                endYear = this._txtProvider.paddingZero(endYear, 4);
                if(result.pos === 0 || result.pos === 1) {
                    curDate = new Date();
                    thisYear = this._txtProvider.paddingZero(this._txtProvider.getYear(), 4);
                    if(thisYear.charAt(0) === '0' && thisYear.charAt(1) === '0' && result.pos <= 1) {
                        inputNum = result.val;
                        century = '00';
                        if(inputNum >= 5) {
                            century = startYearStr.slice(0, 2);
                        } else {
                            century = endYear.slice(0, 2);
                        }
                        addYear = result.val + thisYear.slice(3, 4);
                        s = century + addYear;
                        result.offset = 2 - result.pos;
                        this._txtProvider.setYear(s, result);
                        return true;
                    }
                }
            }
            return this._txtProvider.setYear(value, result);
        };
        return _dateDescriptor10;
    })(YearDateDescriptor);    
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
            return this._txtProvider.setYear(y, result);
        };
        return TwoDigitYearDescriptor;
    })(YearDateDescriptor);    
    ////////////////////////////////////////////////////////////////////////////////
    // _dateDescriptor1
    var _dateDescriptor1 = (function (_super) {
        __extends(_dateDescriptor1, _super);
        function _dateDescriptor1(owner, id) {
                _super.call(this, owner, id);
            this.name = 'One-digit year';
            this.type = DescriptorType.OneDigitYear;
        }
        _dateDescriptor1.prototype.getText = function () {
            var y = paddingZero(this._txtProvider.getYear());
            if(y[0] === '0') {
                y = y[1];
            }
            return y;
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
            this.type = DescriptorType.TwoDigitYear;
        }
        _dateDescriptor2.prototype.getText = function () {
            return paddingZero(this._txtProvider.getYear(), 2);
        };
        return _dateDescriptor2;
    })(TwoDigitYearDescriptor);    
    ////////////////////////////////////////////////////////////////////////////////
    // _dateDescriptor45
    var HourDescriptor = (function (_super) {
        __extends(HourDescriptor, _super);
        function HourDescriptor(owner, id) {
                _super.call(this, owner, id);
        }
        HourDescriptor.prototype.inc = function () {
            this._txtProvider.setHours(this._txtProvider.getHours() + 1, true);
        };
        HourDescriptor.prototype.dec = function () {
            this._txtProvider.setHours(this._txtProvider.getHours() - 1, true);
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
    var _dateDescriptor45 = (function (_super) {
        __extends(_dateDescriptor45, _super);
        function _dateDescriptor45(owner, id) {
                _super.call(this, owner, id);
            this.name = 'h';
            this.type = DescriptorType.h;
        }
        _dateDescriptor45.prototype.getText = function () {
            var h = this._txtProvider.getHours();
            if(h > 12) {
                h = h - 12;
            } else if(h === 0) {
                h = 12;
            }
            return '' + h + '';
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
            this.type = DescriptorType.hh;
        }
        _dateDescriptor46.prototype.getText = function () {
            var h = this._txtProvider.getHours();
            if(h > 12) {
                h -= 12;
            } else if(h === 0) {
                return '12';
            }
            return paddingZero(h);
        };
        return _dateDescriptor46;
    })(TwelveHourDescriptor);    
    ////////////////////////////////////////////////////////////////////////////////
    // _dateDescriptor47
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
    var _dateDescriptor47 = (function (_super) {
        __extends(_dateDescriptor47, _super);
        function _dateDescriptor47(owner, id) {
                _super.call(this, owner, id);
            this.name = 'H';
            this.type = DescriptorType.H;
        }
        _dateDescriptor47.prototype.getText = function () {
            var h = this._txtProvider.getHours();
            return '' + h + '';
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
            this.type = DescriptorType.HH;
        }
        _dateDescriptor48.prototype.getText = function () {
            return paddingZero(this._txtProvider.getHours());
        };
        return _dateDescriptor48;
    })(TwentyFourHourDescriptor);    
    ////////////////////////////////////////////////////////////////////////////////
    // _dateDescriptor250
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
                // TODO: won't work with Japeneese symbols
                h = this._txtProvider.getHours() % 12 + 12;
                this._txtProvider.setHours(h, true);
            }
            return true;
        };
        return AmPmDescriptor;
    })(_iDateDescriptor);    
    var _dateDescriptor250 = (function (_super) {
        __extends(_dateDescriptor250, _super);
        function _dateDescriptor250(owner, id) {
                _super.call(this, owner, id);
            this.name = 't';
            this.type = DescriptorType.ShortAmPm;
        }
        _dateDescriptor250.prototype.getText = function () {
            var hours = this._txtProvider.getHours(), culture = this._txtProvider._getCulture(), designator = culture.calendars.standard[hours < 12 ? "AM" : "PM"][0];
            return designator.charAt(0) || " ";
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
            this.type = DescriptorType.AmPm;
        }
        _dateDescriptor251.prototype.getText = function () {
            var h = this._txtProvider.getHours(), ds = '', culture = this._txtProvider._getCulture();
            if(h < 12) {
                ds = culture.calendars.standard.AM[0];
            } else {
                ds = culture.calendars.standard.PM[0];
            }
            if(ds.length <= 0) {
                ds = ' ';
            }
            return ds;
        };
        return _dateDescriptor251;
    })(AmPmDescriptor);    
    ////////////////////////////////////////////////////////////////////////////////
    // _dateDescriptor50
    var MinuteDescriptor = (function (_super) {
        __extends(MinuteDescriptor, _super);
        function MinuteDescriptor(owner, id) {
                _super.call(this, owner, id);
            this.delta = 1;
        }
        MinuteDescriptor.prototype.inc = function () {
            this._txtProvider.setMinutes(this._txtProvider.getMinutes() + this.delta, true);
        };
        MinuteDescriptor.prototype.dec = function () {
            this._txtProvider.setMinutes(this._txtProvider.getMinutes() - this.delta, true);
        };
        MinuteDescriptor.prototype.setText = function (value, allowchangeotherpart, result) {
            if(result && result.isfullreset) {
                value = '0';
            }
            return this._txtProvider.setMinutes(value, allowchangeotherpart);
        };
        return MinuteDescriptor;
    })(_iDateDescriptor);    
    var _dateDescriptor50 = (function (_super) {
        __extends(_dateDescriptor50, _super);
        function _dateDescriptor50(owner, id) {
                _super.call(this, owner, id);
            this.name = 'mm';
            this.type = DescriptorType.mm;
        }
        _dateDescriptor50.prototype.getText = function () {
            return paddingZero(this._txtProvider.getMinutes());
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
            this.type = DescriptorType.m;
            this.delta = 12;
        }
        _dateDescriptor51.prototype.getText = function () {
            return this._txtProvider.getMinutes().toString();
        };
        return _dateDescriptor51;
    })(MinuteDescriptor);    
    ////////////////////////////////////////////////////////////////////////////////
    // _dateDescriptor60
    var SecondDescriptor = (function (_super) {
        __extends(SecondDescriptor, _super);
        function SecondDescriptor(owner, id) {
                _super.call(this, owner, id);
        }
        SecondDescriptor.prototype.inc = function () {
            this._txtProvider.setSeconds(this._txtProvider.getSeconds() + 12, true);
        };
        SecondDescriptor.prototype.dec = function () {
            this._txtProvider.setSeconds(this._txtProvider.getSeconds() - 12, true);
        };
        SecondDescriptor.prototype.setText = function (value, allowchangeotherpart, result) {
            if(result && result.isfullreset) {
                value = '0';
            }
            return this._txtProvider.setSeconds(value, allowchangeotherpart);
        };
        return SecondDescriptor;
    })(_iDateDescriptor);    
    var _dateDescriptor60 = (function (_super) {
        __extends(_dateDescriptor60, _super);
        function _dateDescriptor60(owner, id) {
                _super.call(this, owner, id);
            this.name = 'ss';
            this.type = DescriptorType.ss;
        }
        _dateDescriptor60.prototype.getText = function () {
            return paddingZero(this._txtProvider.getSeconds());
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
            this.type = DescriptorType.s;
        }
        _dateDescriptor61.prototype.getText = function () {
            return this._txtProvider.getSeconds().toString();
        };
        return _dateDescriptor61;
    })(SecondDescriptor);    
})(wijmo || (wijmo = {}));
