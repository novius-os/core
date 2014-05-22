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
        input.paddingZero = paddingZero;
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
            DescriptorType.EraYearBig = 75;
            DescriptorType.AD = 80;
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
        /** @ignore */
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
            _iDateDescriptor.prototype.setText = function (value, allowchangeotherpart, result, isSmartInputMode) {
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
                    var increment = this._txtProvider.inputWidget._getInnerIncrement();
                    this._txtProvider.setYear(this._txtProvider.getYear() + increment, null, true);
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
                    var increment = this._txtProvider.inputWidget._getInnerIncrement();
                    this._txtProvider.setYear(this._txtProvider.getYear() - increment, null, true);
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
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor75
        var _dateDescriptor75 = (function (_super) {
            __extends(_dateDescriptor75, _super);
            function _dateDescriptor75(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'Era Year Big';
                this.formatString = "E";
                this.type = DescriptorType.EraYearBig;
            }
            _dateDescriptor75.prototype.getText = function () {
                var result = _super.prototype.getText.call(this);
                return result == 1 ? "\u5143" : result;
            };
            return _dateDescriptor75;
        })(_dateDescriptor70);        
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
                        var era = eraDate.era + this._txtProvider.inputWidget._getInnerIncrement();
                        era = era > DateTimeInfo.GetEraCount() - 1 ? DateTimeInfo.GetEraCount() - 1 : era;
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
                        var era = eraDate.era - this._txtProvider.inputWidget._getInnerIncrement();
                        era = era < 0 ? 0 : era;
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
                    return false;
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
        ////////////////////////////////////////////////////////////////////////////////
        // _dateDescriptor80
        var _dateDescriptor80 = (function (_super) {
            __extends(_dateDescriptor80, _super);
            function _dateDescriptor80(owner, id) {
                        _super.call(this, owner, id);
                this.name = 'AD';
                this.formatString = "A";
                this.type = DescriptorType.AD;
            }
            _dateDescriptor80.prototype.getText = function () {
                return "A.D.";
            };
            return _dateDescriptor80;
        })(_iDateDescriptor);        
        var MonthDateDescriptor = (function (_super) {
            __extends(MonthDateDescriptor, _super);
            function MonthDateDescriptor(owner, id) {
                        _super.call(this, owner, id);
            }
            MonthDateDescriptor.prototype.inc = function () {
                _super.prototype.inc.call(this);
                var date = this._txtProvider.getDate();
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
                var newMonth = month + this._txtProvider.inputWidget._getInnerIncrement();
                var dayCount = DateTimeInfo.DaysInMonth(year, newMonth + 1);
                if(day > dayCount) {
                    day = dayCount;
                }
                var newDate = new Date(year, newMonth, day, hour, minute, second);
                if(this._txtProvider._isEraFormatExist()) {
                    var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                    var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                    if(newDate >= maxDate) {
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
            MonthDateDescriptor.prototype.dec = function () {
                _super.prototype.inc.call(this);
                var date = this._txtProvider.getDate();
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
                var newMonth = month - this._txtProvider.inputWidget._getInnerIncrement();
                var dayCount = DateTimeInfo.DaysInMonth(year, newMonth + 1);
                if(day > dayCount) {
                    day = dayCount;
                }
                var newDate = new Date(year, newMonth, day, hour, minute, second);
                if(year == 1) {
                    newDate.setFullYear(1);
                    if(newMonth < 0) {
                        newDate.setMonth(newMonth);
                    }
                }
                if(this._txtProvider._isEraFormatExist()) {
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
                var returnResult = this._txtProvider.setMonth(value, allowchangeotherpart, result);
                if(returnResult) {
                    if(this._txtProvider._isEraFormatExist()) {
                        var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                        var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                        var date = this._txtProvider.getDate();
                        if(date > maxDate) {
                            this._txtProvider.setDate(maxDate);
                        } else if(date < minDate) {
                            this._txtProvider.setDate(minDate);
                        }
                    }
                }
                return returnResult;
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
            _dateDescriptor20.prototype.setText = function (value, allowchangeotherpart, result) {
                if(value === "0") {
                    return true;
                }
                return _super.prototype.setText.call(this, value, allowchangeotherpart, result);
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
                var newDay = this._txtProvider.getDayOfMonth() + this._txtProvider.inputWidget._getInnerIncrement();
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setDate(newDay);
                if(this._txtProvider._isEraFormatExist()) {
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
                var newDay = this._txtProvider.getDayOfMonth() - this._txtProvider.inputWidget._getInnerIncrement();
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setDate(newDay);
                if(this._txtProvider._isEraFormatExist()) {
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
                var returnResult = this._txtProvider.setDayOfMonth(value, allowchangeotherpart, result);
                if(returnResult) {
                    if(this._txtProvider._isEraFormatExist()) {
                        var minDate = this._txtProvider.inputWidget._getRealEraMinDate();
                        var maxDate = this._txtProvider.inputWidget._getRealEraMaxDate();
                        var date = this._txtProvider.getDate();
                        if(date > maxDate) {
                            this._txtProvider.setDate(maxDate);
                        } else if(date < minDate) {
                            this._txtProvider.setDate(minDate);
                        }
                    }
                }
                return returnResult;
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
            _dateDescriptor30.prototype.setText = function (value, allowchangeotherpart, result) {
                if(value === "0") {
                    return true;
                }
                return _super.prototype.setText.call(this, value, allowchangeotherpart, result);
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
                return this.getRealText(culture.calendars.standard.days.namesAbbr[dw - 1]);
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
                var newYear = this._txtProvider.getYear() + this._txtProvider.inputWidget._getInnerIncrement();
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setFullYear(newYear);
                if(this._txtProvider._isEraFormatExist()) {
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
                var newYear = this._txtProvider.getYear() - +this._txtProvider.inputWidget._getInnerIncrement();
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setFullYear(newYear);
                if(this._txtProvider._isEraFormatExist()) {
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
            _dateDescriptor10.prototype.setText = function (value, allowchangeotherpart, result, isSmartInputMode) {
                if(isSmartInputMode && result) {
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
                var newHour = this._txtProvider.getHours() + this._txtProvider.inputWidget._getInnerIncrement();
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setHours(newHour);
                if(this._txtProvider._isEraFormatExist()) {
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
                var newHour = this._txtProvider.getHours() - this._txtProvider.inputWidget._getInnerIncrement();
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setHours(newHour);
                if(this._txtProvider._isEraFormatExist()) {
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
                var newMinute = this._txtProvider.getMinutes() + this._txtProvider.inputWidget._getInnerIncrement();
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setMinutes(newMinute);
                if(this._txtProvider._isEraFormatExist()) {
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
                var newMinite = this._txtProvider.getMinutes() - this._txtProvider.inputWidget._getInnerIncrement();
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setMinutes(newMinite);
                if(this._txtProvider._isEraFormatExist()) {
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
                var newSecond = this._txtProvider.getSeconds() + this._txtProvider.inputWidget._getInnerIncrement();
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setSeconds(newSecond);
                if(this._txtProvider._isEraFormatExist()) {
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
                var newSecond = this._txtProvider.getSeconds() - this._txtProvider.inputWidget._getInnerIncrement();
                var newDate = new Date(this._txtProvider.getDate().valueOf());
                newDate.setSeconds(newSecond);
                if(this._txtProvider._isEraFormatExist()) {
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
        /** @ignore */
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
            DateTimeInfo.ToString = function ToString(value, length, ch, position) {
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
            DateTimeInfo.Date2String = function Date2String(date, isJapan, IsjqDate, IsjqTime) {
                var strDate = "";
                try  {
                    if(isJapan == true) {
                        if(IsjqDate == true) {
                            strDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
                        } else if(IsjqTime == true) {
                            strDate = date.getHours() + ":" + DateTimeInfo.ToString(date.getMinutes(), 2, "0") + ":" + DateTimeInfo.ToString(date.getSeconds(), 2, "0");
                        } else {
                            strDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + DateTimeInfo.ToString(date.getMinutes(), 2, "0") + ":" + DateTimeInfo.ToString(date.getSeconds(), 2, "0");
                        }
                    } else {
                        if(IsjqDate == true) {
                            strDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
                        } else if(IsjqTime == true) {
                            strDate = date.getHours() + ":" + DateTimeInfo.ToString(date.getMinutes(), 2, "0") + ":" + DateTimeInfo.ToString(date.getSeconds(), 2, "0");
                        } else {
                            strDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + DateTimeInfo.ToString(date.getMinutes(), 2, "0") + ":" + DateTimeInfo.ToString(date.getSeconds(), 2, "0");
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
        /** @ignore */
        var wijDateTextFormatter = (function () {
            function wijDateTextFormatter(inputWidget, format, isDisplayFormat) {
                this.inputWidget = inputWidget;
                this.maskPartsCount = 0;
                this.isDisplayFormat = true;
                this.pattern = 'M/d/yyyy';
                this.descriptors = new Array(0);
                this.desPostions = new Array(0);
                this.fields = new Array(0);
                this.isDisplayFormat = isDisplayFormat;
                this._setFormat(format);
            }
            wijDateTextFormatter.prototype._parseFormat = function (pattern) {
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
            wijDateTextFormatter.prototype._parseFormatToPattern = function (format) {
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
                        case "r":
                            // RFC1123Pattern
                                                    case "R":
                            pattern = "ddd, dd MMM yyyy HH:mm:ss G\\M\\T";
                            break;
                    }
                } else {
                    pattern = format;
                }
                return pattern;
            };
            wijDateTextFormatter.prototype.createDescriptor = function (t, liternal) {
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
                    case 75:
                        desc = new _dateDescriptor75(this, id);
                        break;
                    case 80:
                        desc = new _dateDescriptor80(this, id);
                        break;
                    default:
                        break;
                }
                return desc;
            };
            wijDateTextFormatter.prototype.handlePattern = function (p, descriptors) {
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
                if(this.isDisplayFormat) {
                    reg = new RegExp('E{1,10}');
                    suc = reg.test(p);
                    if(suc) {
                        descriptors.push(this.createDescriptor(75));
                        return true;
                    }
                    reg = new RegExp('A{1,1}');
                    suc = reg.test(p);
                    if(suc) {
                        descriptors.push(this.createDescriptor(80));
                        return true;
                    }
                }
                return false;
            };
            wijDateTextFormatter.prototype.daysInMonth = function (m, y) {
                m = m - 1;
                var d = new Date(y, ++m, 1, -1).getDate();
                return d;
            };
            wijDateTextFormatter.prototype._isDigitString = function (s) {
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
            wijDateTextFormatter.prototype._internalSetDate = function (date) {
                if(this.inputWidget) {
                    this.inputWidget._internalSetDate(date);
                }
            };
            wijDateTextFormatter.prototype._isValidDate = function (dt) {
                return this.inputWidget._isValidDate(dt);
            };
            wijDateTextFormatter.prototype._setFormat = function (format) {
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
            wijDateTextFormatter.prototype._isEraFormatExist = function () {
                for(var i = 0; i < this.descriptors.length; i++) {
                    if(this.descriptors[i].type >= 70 && this.descriptors[i].type <= 75) {
                        return true;
                    }
                }
                return false;
            };
            wijDateTextFormatter.prototype.getDate = function () {
                return (!!this.inputWidget) ? new Date(this.inputWidget._safeGetDate(true).getTime()) : undefined;
            };
            wijDateTextFormatter.prototype.setDate = function (value) {
                if(this.inputWidget) {
                    this.inputWidget._setData(value);
                }
            };
            wijDateTextFormatter.prototype.getYear = function () {
                return this.getDate().getFullYear();
            };
            wijDateTextFormatter.prototype.setYear = function (val, resultObj, chkBounds) {
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
                            //mmm = this.daysInMonth((testDate.getMonth() + 1),
                            //   testDate.getFullYear());
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
            wijDateTextFormatter.prototype.getMonth = function () {
                return (this.getDate().getMonth() + 1);
            };
            wijDateTextFormatter.prototype.setMonth = function (val, allowChangeOtherParts, resultObj) {
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
            wijDateTextFormatter.prototype.getHours = function () {
                return this.getDate().getHours();
            };
            wijDateTextFormatter.prototype.setHours = function (val, allowChangeOtherParts) {
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
            wijDateTextFormatter.prototype.getMinutes = function () {
                return this.getDate().getMinutes();
            };
            wijDateTextFormatter.prototype.setMinutes = function (val, allowChangeOtherParts) {
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
            wijDateTextFormatter.prototype.getSeconds = function () {
                return this.getDate().getSeconds();
            };
            wijDateTextFormatter.prototype.setSeconds = function (val, allowChangeOtherParts) {
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
            wijDateTextFormatter.prototype.getDayOfMonth = function () {
                return this.getDate().getDate();
            };
            wijDateTextFormatter.prototype.setDayOfMonth = function (val, allowChangeOtherParts, resultObj) {
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
            wijDateTextFormatter.prototype.getDayOfWeek = function () {
                return (this.getDate().getDay() + 1);
            };
            wijDateTextFormatter.prototype.setDayOfWeek = function (val) {
                try  {
                    val = val * 1;
                    var aDif = val - this.getDayOfWeek();
                    return this.setDayOfMonth(this.getDayOfMonth() + aDif, true);
                } catch (e) {
                    return false;
                }
            };
            wijDateTextFormatter.prototype._getCulture = function () {
                return this.inputWidget._getCulture();
            };
            wijDateTextFormatter.prototype.findAlikeArrayItemIndex = function (arr, txt) {
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
            wijDateTextFormatter.prototype.toString = function () {
                if(this._isEraFormatExist()) {
                    if(this.inputWidget.options.date != null) {
                        var minDate = this.inputWidget._getRealEraMinDate();
                        var maxDate = this.inputWidget._getRealEraMaxDate();
                        if(this.inputWidget.options.date < minDate || this.inputWidget.options.date > maxDate) {
                            return "";
                        }
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
            return wijDateTextFormatter;
        })();
        input.wijDateTextFormatter = wijDateTextFormatter;        
        ;
        //#region format library
        var wijInputDateImpl = (function () {
            function wijInputDateImpl(options) {
                this.options = options;
                options.format = options.format || "M/d/yyyy";
                options.amDesignator = options.amDesignator || "";
                options.pmDesignator = options.pmDesignator || "";
                if(options.hour12As0 === undefined) {
                    options.hour12As0 = false;
                }
                if(options.midnightAs0 === undefined) {
                    options.midnightAs0 = true;
                }
            }
            wijInputDateImpl.prototype._getInnerIncrement = function () {
                return 1;
            };
            wijInputDateImpl.prototype._getCulture = function () {
                return Globalize.findClosestCulture(this.options.culture);
            };
            wijInputDateImpl.prototype._getRealEraMaxDate = function () {
                if(this.options.maxDate) {
                    return DateTimeInfo.GetEraMax() < this.options.maxDate ? DateTimeInfo.GetEraMax() : this.options.maxDate;
                }
                return DateTimeInfo.GetEraMax();
            };
            wijInputDateImpl.prototype._getRealEraMinDate = function () {
                if(this.options.minDate) {
                    return DateTimeInfo.GetEraMin() > this.options.minDate ? DateTimeInfo.GetEraMin() : this.options.minDate;
                }
                return DateTimeInfo.GetEraMin();
            };
            wijInputDateImpl.prototype._safeGetDate = function (ignoreCheckRange) {
                var date = this.options.date;
                if(date == null) {
                    date = new Date();
                }
                if(!ignoreCheckRange) {
                    date = this._checkRange(date);
                }
                return date;
            };
            wijInputDateImpl.prototype._safeSetDate = function (date, ignoreCheckRange) {
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
            wijInputDateImpl.prototype._getAllowSpinLoop = function () {
                return false;
            };
            wijInputDateImpl.prototype._getRealMinDate = function () {
                if(this.options.minDate) {
                    return this.options.minDate;
                }
                var minDate = new Date(1, 0, 1, 0, 0, 0);
                minDate.setFullYear(1);
                return minDate;
            };
            wijInputDateImpl.prototype._getRealMaxDate = function () {
                return this.options.maxDate ? this.options.maxDate : new Date(9999, 11, 31, 23, 59, 59);
            };
            wijInputDateImpl.prototype._setData = function (val) {
                this.options.date = val;
            };
            wijInputDateImpl.prototype._isValidDate = function (date, chkBounds) {
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
            wijInputDateImpl.prototype._getInnerAmDesignator = function () {
                return this.options.amDesignator == "" ? this._getStandardAMPM("AM") : this.options.amDesignator;
            };
            wijInputDateImpl.prototype._getInnerPmDesignator = function () {
                return this.options.pmDesignator == "" ? this._getStandardAMPM("PM") : this.options.pmDesignator;
            };
            wijInputDateImpl.prototype.isFocused = function () {
                return false;
            };
            wijInputDateImpl.prototype._internalSetDate = function (date) {
            };
            wijInputDateImpl.prototype._checkRange = function (date) {
                if(date) {
                    if(this.options.minDate && date < this.options.minDate) {
                        date = new Date(Math.max(this.options.minDate.valueOf(), date.valueOf()));
                    }
                    if(this.options.maxDate && date > this.options.maxDate) {
                        date = new Date(Math.min(this.options.maxDate.valueOf(), date.valueOf()));
                    }
                }
                return date;
            };
            wijInputDateImpl.prototype._getStandardAMPM = function (value) {
                var culture = this._getCulture();
                if(culture && culture.calendar) {
                    var tmp = culture.calendars.standard[value];
                    if(tmp) {
                        return tmp[0];
                    }
                }
                return value;
            };
            return wijInputDateImpl;
        })();
        input.wijInputDateImpl = wijInputDateImpl;        
        function dateFormatter(date, format, options) {
            if(!(date instanceof Date)) {
                return "";
            }
            if(!format) {
                format = 'd';
            }
            if(!options) {
                if(typeof format === "string") {
                    //$.wijinputcore.format(new Date(2013,8,12), "yyyy/MM/dd");
                    options = {
                    };
                } else {
                    //$.wijinputcore.format(new Date(2013, 8, 12), { format: "yyyy/MM/dd" });
                    options = format;
                }
            }
            if(typeof format === "string") {
                //$.wijinputcore.format(new Date(2013, 8, 12), "yyyy/MM/dd", { culture: "ja-JP" });
                options.format = format;
            }
            options.date = date;
            var wijInputDate = new wijInputDateImpl(options);
            var _formatter = new wijDateTextFormatter(wijInputDate, options.format, true);
            return _formatter.toString();
        }
        var $ = jQuery;
        $.wijinputcore = $.wijinputcore || {
        };
        $.wijinputcore.formatdate = $.wijinputcore.formatdate || dateFormatter;
        //#endregion
        //#region parse library
        function dateParser(value, format, culture) {
            if(Globalize.findClosestCulture(format)) {
                culture = format;
                format = undefined;
            }
            var cf = Globalize.findClosestCulture(culture).calendars.standard, pattern = cf.patterns.d;
            if(format) {
                if(format.length <= 1) {
                    pattern = parseShortPattern(format, cf.patterns);
                } else {
                    pattern = format;
                }
            } else {
                pattern = cf.patterns.d;
            }
            var wijInputDate = new wijInputDateImpl({
            });
            var _formatter = new wijDateTextFormatter(wijInputDate, pattern, true);
            if(hasEraYear(_formatter.descriptors)) {
                return parseEraDate(value, _formatter, cf);
            } else {
                return Globalize.parseDate(value, pattern, culture);
            }
        }
        function hasEraYear(descriptors) {
            for(var i = 0; i < descriptors.length; i++) {
                if(descriptors[i].type === DescriptorType.EraYear || descriptors[i].type === DescriptorType.TwoEraYear || descriptors[i].type === DescriptorType.EraName || descriptors[i].type === DescriptorType.TwoEraName || descriptors[i].type === DescriptorType.ThreeEraName || descriptors[i].type === DescriptorType.EraYearBig) {
                    return true;
                }
            }
            return false;
        }
        function parseEraDate(value, _formatter, cultureFormat) {
            var ch = "", chs = "", charIndex = 0;
            var era = 0, eraYear = 1, month = 1, date = 1, hour = 0, minute = 0, second = 0;
            var isNextReachSeparator = function () {
                return (charIndex < value.length && i + 1 < _formatter.descriptors.length && _formatter.descriptors[i + 1].type === DescriptorType.liternal && value.charAt(charIndex) !== (_formatter.descriptors[i + 1]).liternal || i === _formatter.descriptors.length - 1 && charIndex + 1 <= value.length);
            };
            for(var i = 0; i < _formatter.descriptors.length; i++) {
                var breakToNextDesc = false;
                for(; charIndex < value.length; ) {
                    ch = value.charAt(charIndex++);
                    chs += ch;
                    for(var j = 0; j < DateTimeInfo.GetEraCount(); j++) {
                        var isMatched_g = chs.toLocaleLowerCase() === DateTimeInfo.GetEraShortNames()[j].toLowerCase() && _formatter.descriptors[i].type === DescriptorType.EraName;
                        var isMatched_gg = chs.toLocaleLowerCase() === DateTimeInfo.GetEraAbbreviations()[j].toLowerCase() && _formatter.descriptors[i].type === DescriptorType.TwoEraName;
                        var isMatched_ggg = chs.toLocaleLowerCase() === DateTimeInfo.GetEraNames()[j].toLowerCase() && _formatter.descriptors[i].type === DescriptorType.ThreeEraName;
                        if(isMatched_g || isMatched_gg || isMatched_ggg) {
                            era = j;
                            chs = "";
                            breakToNextDesc = true;
                            break;
                        }
                    }
                    if(breakToNextDesc) {
                        break;
                    }
                    if(_formatter.descriptors[i].type === DescriptorType.liternal && (_formatter.descriptors[i]).liternal === chs) {
                        chs = "";
                        break;
                    }
                    switch(_formatter.descriptors[i].type) {
                        case DescriptorType.EraYear:
                        case DescriptorType.TwoEraYear:
                            if(isNextReachSeparator()) {
                                break;
                            }
                            eraYear = parseInt(chs, 10);
                            if(isNaN(eraYear)) {
                                eraYear = 1;
                            }
                            chs = "";
                            breakToNextDesc = true;
                            break;
                        case DescriptorType.EraYearBig:
                            if(isNextReachSeparator()) {
                                break;
                            }
                            if(chs === '\u5143') {
                                eraYear = 1;
                            } else {
                                eraYear = parseInt(chs, 10);
                                if(isNaN(eraYear)) {
                                    eraYear = 1;
                                }
                            }
                            chs = "";
                            breakToNextDesc = true;
                            break;
                        case DescriptorType.TwoDigitMonth:
                        case DescriptorType.Month:
                            if(isNextReachSeparator()) {
                                break;
                            }
                            month = parseInt(chs, 10);
                            if(isNaN(month)) {
                                month = 1;
                            }
                            chs = "";
                            breakToNextDesc = true;
                            break;
                        case DescriptorType.AbbreviatedMonthNames:
                            if(isNextReachSeparator()) {
                                break;
                            }
                            for(var m = 0; m < cultureFormat.months.namesAbbr.length; m++) {
                                if(chs.toLocaleLowerCase() === cultureFormat.months.namesAbbr[m]) {
                                    month = m + 1;
                                    chs = "";
                                    break;
                                }
                            }
                            breakToNextDesc = true;
                            break;
                        case DescriptorType.MonthNames:
                            if(isNextReachSeparator()) {
                                break;
                            }
                            for(var k = 0; k < cultureFormat.months.names.length; k++) {
                                if(chs.toLocaleLowerCase() === cultureFormat.months.names[k]) {
                                    month = k + 1;
                                    chs = "";
                                    break;
                                }
                            }
                            breakToNextDesc = true;
                            break;
                        case DescriptorType.TwoDigityDayOfMonth:
                        case DescriptorType.DayOfMonth:
                            if(isNextReachSeparator()) {
                                break;
                            }
                            date = parseInt(chs, 10);
                            if(isNaN(date)) {
                                date = 1;
                            }
                            chs = "";
                            breakToNextDesc = true;
                            break;
                        case DescriptorType.h:
                        case DescriptorType.hh:
                        case DescriptorType.H:
                        case DescriptorType.HH:
                            if(isNextReachSeparator()) {
                                break;
                            }
                            hour = parseInt(chs, 10);
                            if(isNaN(hour)) {
                                hour = 1;
                            }
                            chs = "";
                            breakToNextDesc = true;
                            break;
                        case DescriptorType.m:
                        case DescriptorType.mm:
                            if(isNextReachSeparator()) {
                                break;
                            }
                            minute = parseInt(chs, 10);
                            if(isNaN(minute)) {
                                minute = 1;
                            }
                            chs = "";
                            breakToNextDesc = true;
                            break;
                        case DescriptorType.s:
                        case DescriptorType.ss:
                            if(isNextReachSeparator()) {
                                break;
                            }
                            second = parseInt(chs, 10);
                            if(isNaN(second)) {
                                second = 1;
                            }
                            chs = "";
                            breakToNextDesc = true;
                            break;
                        case DescriptorType.ShortAmPm:
                        case DescriptorType.AmPm:
                            if(isNextReachSeparator()) {
                                break;
                            }
                            for(var l = 0; l < cultureFormat.PM.length; l++) {
                                if(chs.toLocaleLowerCase() === cultureFormat.PM[l]) {
                                    hour += 12;
                                    break;
                                }
                            }
                            chs = "";
                            breakToNextDesc = true;
                            break;
                        case DescriptorType.OneDigitYear:
                        case DescriptorType.TwoDigitYear:
                        case DescriptorType.FourDigitYear:
                        case DescriptorType.AbbreviatedDayNames:
                        case DescriptorType.DayNames:
                        case DescriptorType.AD:
                            if(isNextReachSeparator()) {
                                break;
                            }
                            chs = "";
                            breakToNextDesc = true;
                            break;
                        default:
                    }
                    if(breakToNextDesc) {
                        break;
                    }
                }
            }
            return DateTimeInfo.ConvertToGregorianDate(era, eraYear, month, date, hour, minute, second, false);
        }
        function parseShortPattern(shortPattern, culturePatterns) {
            var pattern = shortPattern;
            if(shortPattern && shortPattern.length <= 1) {
                switch(shortPattern) {
                    case "":
                    case "d":
                        // ShortDatePattern
                        pattern = culturePatterns.patterns.d;
                        break;
                    case "D":
                        // LongDatePattern
                        pattern = culturePatterns.patterns.D;
                        break;
                    case "f":
                        // Full date and time (long date and short time)
                        pattern = culturePatterns.patterns.D + " " + culturePatterns.patterns.t;
                        break;
                    case "F":
                        // Full date and time (long date and long time)
                        pattern = culturePatterns.patterns.D + " " + culturePatterns.patterns.T;
                        break;
                    case "g":
                        // General (short date and short time)
                        pattern = culturePatterns.patterns.d + " " + culturePatterns.patterns.t;
                        break;
                    case "G":
                        // General (short date and long time)
                        pattern = culturePatterns.patterns.d + " " + culturePatterns.patterns.T;
                        break;
                    case "m":
                        // MonthDayPattern
                        pattern = culturePatterns.patterns.M;
                        break;
                    case "M":
                        // monthDayPattern
                        pattern = culturePatterns.patterns.M;
                        break;
                    case "s":
                        // SortableDateTimePattern
                        pattern = culturePatterns.patterns.S;
                        break;
                    case "t":
                        // shortTimePattern
                        pattern = culturePatterns.patterns.t;
                        break;
                    case "T":
                        // LongTimePattern
                        pattern = culturePatterns.patterns.T;
                        break;
                    case "u":
                        // UniversalSortableDateTimePattern
                        pattern = culturePatterns.patterns.S;
                        break;
                    case "U":
                        // Full date and time (long date and long time) using universal time
                        pattern = culturePatterns.patterns.D + " " + culturePatterns.patterns.T;
                        break;
                    case "y":
                        // YearMonthPattern
                        pattern = culturePatterns.patterns.Y;
                        break;
                    case "Y":
                        // yearMonthPattern
                        pattern = culturePatterns.patterns.Y;
                        break;
                    case "r":
                        // RFC1123Pattern
                                            case "R":
                        pattern = "ddd, dd MMM yyyy HH:mm:ss G\\M\\T";
                        break;
                }
            }
            return pattern;
        }
        $.wijinputcore.parseDate = $.wijinputcore.parseDate || dateParser;
        //#endregion
        //#region validate library
        function dateValidator(value, minDate, maxDate, format, culture) {
            var dateValue = dateParser(value, format, culture);
            return dateValue >= minDate && dateValue <= maxDate;
        }
        $.wijinputcore.validateDate = $.wijinputcore.validateDate || dateValidator;
        //#endregion
            })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
