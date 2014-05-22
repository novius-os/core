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
    /// <reference path="jquery.wijmo.wijcharex.ts" />
    /// <reference path="jquery.wijmo.wijstringinfo.ts" />
    /// <reference path="../wijutil/jquery.wijmo.wijutil.ts"/>
    (function (input) {
        /** @ignore */
        (function (wijchartype) {
            wijchartype._map = [];
            wijchartype.editOptional = 1;
            wijchartype.editRequired = 2;
            wijchartype.separator = 4;
            wijchartype.literal = 8;
        })(input.wijchartype || (input.wijchartype = {}));
        var wijchartype = input.wijchartype;
        /** @ignore */
        var wijMaskedTextProvider = (function () {
            function wijMaskedTextProvider(inputWidget, mask, asciiOnly) {
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
            wijMaskedTextProvider.FK_DB_9 = "\uff19";
            wijMaskedTextProvider.FK_N = "N";
            wijMaskedTextProvider.FK_DB_N = "\uff2e";
            wijMaskedTextProvider.FK_DB_G = "\uff27";
            wijMaskedTextProvider.FK_DB_K = "\uff2b";
            wijMaskedTextProvider.FK_DB_J = "\uff2a";
            wijMaskedTextProvider.FK_DB_Z = "\uff3a";
            wijMaskedTextProvider.FK_DB_T = "\uff34";
            wijMaskedTextProvider.DBCS_0 = "\uff10";
            wijMaskedTextProvider.DBCS_9 = "\uff19";
            wijMaskedTextProvider.DBCS_A = "\uff21";
            wijMaskedTextProvider.DBCS_a = "\uff41";
            wijMaskedTextProvider.DBCS_Z = "\uff3a";
            wijMaskedTextProvider.DBCS_z = "\uff5a";
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
                                    case wijMaskedTextProvider.FK_N:
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
                                    case wijMaskedTextProvider.FK_DB_N:
                                    case wijMaskedTextProvider.FK_DB_G:
                                    case wijMaskedTextProvider.FK_DB_T:
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
                return !!this.inputWidget ? this.inputWidget._getAllowPromptAsInput() : false;
            };
            wijMaskedTextProvider.prototype.getPasswordChar = function () {
                var password = !!this.inputWidget ? this.inputWidget._getPasswordChar() : '*';
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
                return !!this.inputWidget ? this.inputWidget._getResetOnPrompt() : true;
            };
            wijMaskedTextProvider.prototype.getResetOnSpace = function () {
                return !!this.inputWidget ? this.inputWidget._getResetOnSpace() : true;
            };
            wijMaskedTextProvider.prototype.getSkipLiterals = function () {
                return !!this.inputWidget ? this.inputWidget._getSkipLiterals() : true;
            };
            wijMaskedTextProvider.prototype.getHidePromptOnLeave = function () {
                return !!this.inputWidget ? this.inputWidget._getHidePromptOnLeave() : false;
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
                var promptChar = !!this.inputWidget ? this.inputWidget._getPromptChar() : '_';
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
                return !!this.inputWidget ? this.inputWidget._getAutoConvert() : true;
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
                            this.inputWidget._appendChar = result.strValue.charAt(1);
                        }
                        if(result.index === 2) {
                            this.inputWidget._skipNextChar = true;
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
                        this.inputWidget._appendChar = result.strValue.charAt(1);
                    }
                    if(result.index === 2) {
                        this.inputWidget._skipNextChar = true;
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
                    case wijMaskedTextProvider.FK_N:
                        if(!input.CharProcess.CharEx.IsFullWidth(strInput) && input.CharProcess.CharEx.IsKatakana(strInput) && !input.CharProcess.CharEx.IsLowerKana(strInput)) {
                        } else {
                            return false;
                        }
                        break;
                    case wijMaskedTextProvider.FK_DB_N:
                        if(input.CharProcess.CharEx.IsFullWidth(strInput) && input.CharProcess.CharEx.IsKatakana(strInput) && !input.CharProcess.CharEx.IsLowerKana(strInput)) {
                        } else {
                            return false;
                        }
                        break;
                    case wijMaskedTextProvider.FK_DB_G:
                        if(input.CharProcess.CharEx.IsUpperKana(strInput) && input.CharProcess.CharEx.IsHiragana(strInput)) {
                        } else {
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
                    case wijMaskedTextProvider.FK_DB_T:
                        if(input.CharProcess.CharEx.IsSurrogate(strInput)) {
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
                            var nextChar = this.inputWidget._nextChar;
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
                        if(!this.inputWidget._batchKeyPress) {
                            this.inputWidget._nextChar = i === strInput.length - 1 ? "" : strInput.charAt(i + 1);
                        }
                        if(!this.testChar(ch, result.testPosition, tempResult)) {
                            result.hint = tempResult.hint;
                            this._needCheckNextChar = false;
                            if(!this.inputWidget._batchKeyPress) {
                                this.inputWidget._nextChar = "";
                            }
                            return false;
                        }
                        this._needCheckNextChar = false;
                        if(!this.inputWidget._batchKeyPress) {
                            this.inputWidget._nextChar = "";
                            var appendChar = this.inputWidget._appendChar;
                            if(appendChar && appendChar.length > 0) {
                                this.inputWidget._appendChar = "";
                                result.testPosition++;
                                if(!this.testChar(appendChar, result.testPosition, tempResult)) {
                                    result.hint = tempResult.hint;
                                    this._needCheckNextChar = false;
                                    return false;
                                }
                            }
                            if(this.inputWidget._skipNextChar) {
                                i++;
                                this.inputWidget._skipNextChar = false;
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
                    if(!this.inputWidget._batchKeyPress) {
                        this.inputWidget._nextChar = i === strInput.length - 1 ? "" : strInput.charAt(i + 1);
                    }
                    this._needCheckNextChar = true;
                    this.setChar(ch, pos);
                    pos++;
                    this._needCheckNextChar = false;
                    if(!this.inputWidget._batchKeyPress) {
                        this.inputWidget._nextChar = "";
                        var appendChar = this.inputWidget._appendChar;
                        if(appendChar && appendChar.length > 0) {
                            this.inputWidget._appendChar = "";
                            this.inputWidget._nextChar = "";
                            if(!this.testEscapeChar(appendChar, pos)) {
                                pos = this.findEditPositionFrom(pos, true);
                            }
                            this.setChar(appendChar, pos);
                            pos++;
                        }
                        if(this.inputWidget._skipNextChar) {
                            i++;
                            this.inputWidget._skipNextChar = false;
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
                    return this.inputWidget._getNullText();
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
            wijMaskedTextProvider.prototype.removeAt = function (start, end, inputResult, skipCheck) {
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
            wijMaskedTextProvider.prototype.replaceWith = function (range, text) {
                var index = range.start;
                var result = new input.wijInputResult();
                if(range.start < range.end) {
                    this.removeAt(range.start, range.end - 1, result, true);
                    index = result.testPosition;
                }
                return this.insertAt(text, index, result) ? result : null;
            };
            return wijMaskedTextProvider;
        })();
        input.wijMaskedTextProvider = wijMaskedTextProvider;        
        ////////////////////////////////////////////////////////////////////////////////
        // wijCharDescriptor
        /** @ignore */
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
        /** @ignore */
        var MaskStub = (function () {
            function MaskStub(maskOptions) {
                this._imaskOptions = maskOptions;
            }
            MaskStub.prototype._getCulture = function () {
                return Globalize.findClosestCulture(this._imaskOptions.culture);
            };
            MaskStub.prototype._getAllowPromptAsInput = function () {
                return false;
            };
            MaskStub.prototype._getPasswordChar = function () {
                return "";
            };
            MaskStub.prototype._getResetOnPrompt = function () {
                return true;
            };
            MaskStub.prototype._getResetOnSpace = function () {
                return true;
            };
            MaskStub.prototype._getSkipLiterals = function () {
                return true;
            };
            MaskStub.prototype._getHidePromptOnLeave = function () {
                return false;
            };
            MaskStub.prototype._getPromptChar = function () {
                return "_";
            };
            MaskStub.prototype._getAutoConvert = function () {
                return this._imaskOptions.autoConvert;
            };
            MaskStub.prototype._getNullText = function () {
                return "";
            };
            MaskStub.prototype._isPassword = //element: JQuery;
            function () {
                return false;
            };
            MaskStub.prototype._showNullText = function () {
                return false;
            };
            MaskStub.prototype.isFocused = function () {
                return false;
            };
            return MaskStub;
        })();
        input.MaskStub = MaskStub;        
        //#endregion
            })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
$.wijinputcore = $.wijinputcore || {
};
$.wijinputcore.formatmask = $.wijinputcore.formatmask || function (val, formatOrType, opt) {
    var option = (opt || {
    });
    if(option.autoConvert !== false) {
        option.autoConvert = true;
    }
    option.culture = "";
    var maskStub = new wijmo.input.MaskStub(option);
    var provider = new wijmo.input.wijMaskedTextProvider(maskStub, formatOrType, false);
    var result = provider.setText(val);
    if(result) {
        return provider.toString(true, true, true);
    } else {
        return provider.toString(true, false, false);
    }
};
$.wijinputcore.validateMask = function (value, format) {
    var option = {
        autoConvert: false
    };
    option.culture = "";
    var maskStub = new wijmo.input.MaskStub(option);
    var provider = new wijmo.input.wijMaskedTextProvider(maskStub, format, false);
    provider.setText(value);
    var formatString = provider.toString(true, true, true);
    return formatString === value;
};
