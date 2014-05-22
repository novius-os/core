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
    /// <reference path="jquery.wijmo.wijcharex.ts" />
    /// <reference path="../wijutil/jquery.wijmo.wijutil.ts"/>
    (function (input) {
        /** @ignore */
        var CharacterType = (function () {
            function CharacterType() {
                this.DBCS_UpperAlphabet = 0x80000002;
                // 1000 0000 0000 0000,0000 0000 0000 0010
                this.SBCS_UpperAlphabet = 0x40000001;
                // 0100 0000 0000 0000,0000 0000 0000 0001
                this.DBCS_LowerAlphabet = 0x80000008;
                // 1000 0000 0000 0000,0000 0000 0000 1000
                this.SBCS_LowerAlphabet = 0x40000004;
                // 0100 0000 0000 0000,0000 0000 0000 0100
                this.DBCS_Number = 0x80000020;
                // 1000 0000 0000 0000,0000 0000 0010 0000
                this.SBCS_Number = 0x40000010;
                // 0100 0000 0000 0000,0000 0000 0001 0000
                this.DBCS_Binary = 0x80000080;
                // 1000 0000 0000 0000,0000 0000 1000 0000
                this.SBCS_Binary = 0x40000040;
                // 0100 0000 0000 0000,0000 0000 0100 0000
                this.DBCS_Hexadecimal = 0x80000200;
                // 1000 0000 0000 0000,0000 0010 0000 0000
                this.SBCS_Hexadecimal = 0x40000100;
                // 0100 0000 0000 0000,0000 0001 0000 0000
                this.DBCS_Symbol = 0x80000800;
                // 1000 0000 0000 0000,0000 1000 0000 0000
                this.SBCS_Symbol = 0x40000400;
                // 0100 0000 0000 0000,0000 0100 0000 0000
                this.DBCS_NumberSymbol = 0x80002000;
                // 1000 0000 0000 0000,0010 0000 0000 0000
                this.SBCS_NumberSymbol = 0x40001000;
                // 0100 0000 0000 0000,0001 0000 0000 0000
                this.DBCS_Katakana = 0x80008000;
                // 1000 0000 0000 0000,1000 0000 0000 0000
                this.SBCS_Katakana = 0x40004000;
                // 0100 0000 0000 0000,0100 0000 0000 0000
                this.DBCS_Space = 0x80020000;
                // 1000 0000 0000 0010,0000 0000 0000 0000
                this.SBCS_Space = 0x40010000;
                // 0100 0000 0000 0001,0000 0000 0000 0000
                this.TwoBytes = 0x80080000;
                // 1000 0000 0000 1000,0000 0000 0000 0000
                this.FourBytes = 0x80040000;
                // 1000 0000 0000 0100,0000 0000 0000 0000
                this.DBCS_ShiftJIS = 0x80100000;
                // 1000 0000 0001 0000,0000 0000 0000 0001
                this.DBCS_JISX0208 = 0x80200000;
                // 1000 0000 0010 0000,0000 0000 0000 0010
                this.Emoji = 0x00400000;
                // 0000,0000 0100 0000 0000,0000 0000 0000 0000
                this.IVS = 0x00800000;
                // 0000,0000 1000 0000 0000,0000 0000 0000 0000
                //add new format here
                this.DBCS_Hiragana = 0x81000000;
                // 1000 0001 0000 0000,0000 0000 0000 0000
                this.Upper_SBCS_Katakana = 0x48000000;
                // 0100 1000 0000 0000,0000 0000 0000 0000
                this.Upper_DBCS_Katakana = 0x90000000;
                // 1001 0000 0000 0000,0000 0000 0000 0000
                this.Upper_DBCS_Hiragana = 0xA0000000;
                // 1010 0000 0000 0000,0000 0000 0000 0000
                this.All = 0xC6000000;
                // 1100 0110 0000 0000,0000 0000 0000 0000
                this.DBCS_All = 0x84000000;
                // 1000 0100 0000 0000,0000 0000 0000 0000
                this.SBCS_All = 0x42000000;
                // 0100 0010 0000 0000,0000 0000 0000 0000
                this.DBCS = 0x80000000;
                // 1000 0000 0000 0000,0000 0000 0000 0000
                this.SBCS = 0x40000000;
            }
            return CharacterType;
        })();        
        // 0100 0000 0000 0000,0000 0000 0000 0000
        ;
        /** @ignore */
        var TextFilter = (function () {
            function TextFilter(autoConvert, format) {
                //Character type enum object
                this.charType = new CharacterType();
                //Indicates the format string.
                this.format = format;
                this.includeFormat = "";
                this.excludeFormat = "";
                this.includeNormalChar = "";
                this.excludeNormalChar = "";
                this.allowTypes = this.charType.All;
                this.excludeTypes = this.charType.All;
                //Wheher the format is "^"
                this.include = true;
                this.autoConvert = autoConvert;
                //this.allowSpace = allowSpace;
                //this.allowSpace = "None";
                //The CharProcess object
                this.charExInstance = input.CharProcess.CharEx;
                this.isInputValid = true;
                //Indicates which type is allowed.
                this.ParseFormat(this.format);
            }
            TextFilter.prototype.allowDBCS = /// <summary>
            /// Gets whether the filter allow DBCS.
            /// </summary>
            function () {
                return !(((this.allowTypes & this.charType.DBCS_All) != 0) ^ this.include);
            };
            TextFilter.prototype.allowSBCS = /// <summary>
            /// Gets whether the filter allow SBCS.
            /// </summary>
            function () {
                return !(((this.allowTypes & this.charType.SBCS_All) != 0) ^ this.include);
            };
            TextFilter.prototype.GetIncludeFormat = function (format) {
                if(format == null || format.GetLength() == 0) {
                    return "";
                }
                var includeFormat = "";
                for(var i = 0; i < format.GetLength(); i++) {
                    var currentChar = format.Substring(i, i + 1);
                    if(currentChar == '\\')//   '\\'
                     {
                        if(i != format.GetLength() - 1) {
                            includeFormat = includeFormat + currentChar;
                            includeFormat = includeFormat + format.Substring(i + 1, i + 2);
                            i++;
                        } else {
                            // such as @"^\".
                            throw "Exception.TextFilter.Format.Invalid";
                        }
                    } else if(currentChar == '^')// '^'
                     {
                        return includeFormat;
                    } else {
                        includeFormat = includeFormat + currentChar;
                    }
                }
                return includeFormat;
            };
            TextFilter.prototype.GetExcludeFormat = function (format) {
                if(format == null || format.GetLength() == 0) {
                    return "";
                }
                var caretCount = 0;
                var excludeFormat = "";
                for(var i = 0; i < format.GetLength(); i++) {
                    var currentChar = format.Substring(i, i + 1);
                    if(currentChar == '\\')//   '\\'
                     {
                        if(i != format.GetLength() - 1) {
                            if(caretCount != 0) {
                                excludeFormat = excludeFormat + currentChar;
                                excludeFormat = excludeFormat + format.Substring(i + 1, i + 2);
                            }
                            i++;
                        } else {
                            // such as @"^\".
                            throw "Exception.TextFilter.Format.Invalid";
                        }
                    } else if(currentChar == '^')// '^'
                     {
                        caretCount++;
                        if(caretCount > 1) {
                            throw "Exception.TextFilter.Format.DuplicatedChar";
                        }
                    } else {
                        if(caretCount != 0) {
                            excludeFormat = excludeFormat + currentChar;
                        }
                    }
                }
                if(caretCount == 1) {
                    excludeFormat = '^' + excludeFormat;
                }
                return excludeFormat;
            };
            TextFilter.prototype.ParseIncludeFormat = function (format) {
                if(format == null || format.GetLength() == 0) {
                    this.allowTypes = this.charType.All;
                    this.includeNormalChar = "";
                    this.includeFormat = "";
                    return;
                }
                this.allowTypes = 0;
                this.includeNormalChar = "";
                for(var i = 0; i < format.GetLength(); i++) {
                    switch(format.charCodeAt(i)) {
                        case 94:
                            // "^"
                            break;
                        case 92:
                            // "/"
                            if(i == format.GetLength() - 1) {
                                throw "Exception.TextFilter.Format.Invalid";
                            }
                            this.includeNormalChar = this.includeNormalChar + format.Substring(i + 1, i + 2);
                            i++;
                            break;
                        case 65313:
                            //DBCS A
                            if((this.allowTypes & this.charType.DBCS_UpperAlphabet) == (this.charType.DBCS_UpperAlphabet | 0)) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.DBCS_UpperAlphabet;
                            }
                            break;
                        case 65:
                            //SBCS A
                            if((this.allowTypes & this.charType.SBCS_UpperAlphabet) == this.charType.SBCS_UpperAlphabet) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.SBCS_UpperAlphabet;
                            }
                            break;
                        case 65345:
                            //DBCS a
                            if((this.allowTypes & this.charType.DBCS_LowerAlphabet) == (this.charType.DBCS_LowerAlphabet | 0)) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.DBCS_LowerAlphabet;
                            }
                            break;
                        case 97:
                            //SBCS a
                            if((this.allowTypes & this.charType.SBCS_LowerAlphabet) == this.charType.SBCS_LowerAlphabet) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.SBCS_LowerAlphabet;
                            }
                            break;
                        case 65323:
                            //DBCS K
                            if((this.allowTypes & this.charType.DBCS_Katakana) == (this.charType.DBCS_Katakana | 0)) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.DBCS_Katakana;
                            }
                            break;
                        case 75:
                            //SBCS K
                            if((this.allowTypes & this.charType.SBCS_Katakana) == this.charType.SBCS_Katakana) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.SBCS_Katakana;
                            }
                            break;
                        case 65305:
                            //DBCS 9
                            if((this.allowTypes & this.charType.DBCS_Number) == (this.charType.DBCS_Number | 0)) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.DBCS_Number;
                            }
                            break;
                        case 57:
                            //SBCS 9
                            if((this.allowTypes & this.charType.SBCS_Number) == this.charType.SBCS_Number) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.SBCS_Number;
                            }
                            break;
                        case 65283:
                            //DBCS #
                            if((this.allowTypes & this.charType.DBCS_NumberSymbol) == (this.charType.DBCS_NumberSymbol | 0)) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.DBCS_NumberSymbol;
                            }
                            break;
                        case 35:
                            //SBCS #
                            if((this.allowTypes & this.charType.SBCS_NumberSymbol) == this.charType.SBCS_NumberSymbol) {
                                ;
                            } else {
                                // return;
                                this.allowTypes |= this.charType.SBCS_NumberSymbol;
                            }
                            break;
                        case 65312:
                            //DBCS @
                            if((this.allowTypes & this.charType.DBCS_Symbol) == (this.charType.DBCS_Symbol | 0)) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.DBCS_Symbol;
                            }
                            break;
                        case 64:
                            //SBCS @
                            if((this.allowTypes & this.charType.SBCS_Symbol) == this.charType.SBCS_Symbol) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.SBCS_Symbol;
                            }
                            break;
                        case 65314:
                            //DBCS B
                            if((this.allowTypes & this.charType.DBCS_Binary) == (this.charType.DBCS_Binary | 0)) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.DBCS_Binary;
                            }
                            break;
                        case 66:
                            //SBCS B
                            if((this.allowTypes & this.charType.SBCS_Binary) == this.charType.SBCS_Binary) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.SBCS_Binary;
                            }
                            break;
                        case 65336:
                            //DBCS X
                            if((this.allowTypes & this.charType.DBCS_Hexadecimal) == (this.charType.DBCS_Hexadecimal | 0)) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.DBCS_Hexadecimal;
                            }
                            break;
                        case 88:
                            //SBCS X
                            if((this.allowTypes & this.charType.SBCS_Hexadecimal) == this.charType.SBCS_Hexadecimal) {
                                ;
                            } else {
                                // return;
                                this.allowTypes |= this.charType.SBCS_Hexadecimal;
                            }
                            break;
                        case 65322:
                            //DBCS J
                            if((this.allowTypes & this.charType.DBCS_Hiragana) == (this.charType.DBCS_Hiragana | 0)) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.DBCS_Hiragana;
                            }
                            break;
                        case 65338:
                            //DBCS Z
                            if((this.allowTypes & this.charType.DBCS_All) == (this.charType.DBCS_All | 0)) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.DBCS_All;
                            }
                            break;
                        case 65325:
                            //DBCS M
                            if((this.allowTypes & this.charType.DBCS_ShiftJIS) == (this.charType.DBCS_ShiftJIS | 0)) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.DBCS_ShiftJIS;
                            }
                            break;
                        case 65321:
                            //DBCS I
                            if((this.allowTypes & this.charType.DBCS_JISX0208) == (this.charType.DBCS_JISX0208 | 0)) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.DBCS_JISX0208;
                            }
                            break;
                        case 72:
                            //SBCS H
                            if((this.allowTypes & this.charType.SBCS_All) == this.charType.SBCS_All) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.SBCS_All;
                            }
                            break;
                        case 78:
                            if((this.allowTypes & this.charType.Upper_SBCS_Katakana) == this.charType.Upper_SBCS_Katakana) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.Upper_SBCS_Katakana;
                            }
                            break;
                        case 65326:
                            // DBCS N
                            if((this.allowTypes & this.charType.Upper_DBCS_Katakana) == this.charType.Upper_DBCS_Katakana) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.Upper_DBCS_Katakana;
                            }
                            break;
                        case 65319:
                            // DBCS G
                            if((this.allowTypes & this.charType.Upper_DBCS_Hiragana) == this.charType.Upper_DBCS_Hiragana) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.Upper_DBCS_Hiragana;
                            }
                            break;
                        case 65331:
                            // DBCS S
                            if((this.allowTypes & this.charType.DBCS_Space) == this.charType.DBCS_Space) {
                                ;
                            } else {
                                // return;
                                this.allowTypes |= this.charType.DBCS_Space;
                            }
                            break;
                        case 83:
                            // SBCS S
                            if((this.allowTypes & this.charType.SBCS_Space) == this.charType.SBCS_Space) {
                                ;
                            } else {
                                // return;
                                this.allowTypes |= this.charType.SBCS_Space;
                            }
                            break;
                        case 65332:
                            // DBCS T
                            if((this.allowTypes & this.charType.FourBytes) == this.charType.FourBytes) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.FourBytes;
                            }
                            break;
                        case 65316:
                            // DBCS D
                            if((this.allowTypes & this.charType.TwoBytes) == this.charType.TwoBytes) {
                                ;
                            } else {
                                //return;
                                this.allowTypes |= this.charType.TwoBytes;
                            }
                            break;
                        case 65317:
                            // Emoji key word.
                            this.allowTypes |= this.charType.Emoji;
                            break;
                        case 65334:
                            this.allowTypes |= this.charType.IVS;
                            break;
                        default:
                            this.includeNormalChar = this.includeNormalChar + format.Substring(i, i + 1);
                            break;
                    }
                }
            };
            TextFilter.prototype.ParseExcludeFormat = function (format) {
                if(format == null || format.GetLength() == 0) {
                    this.excludeTypes = this.excludeTypes.All;
                    this.excludeNormalChar = "";
                    this.excludeFormat = "";
                    return;
                }
                if(format == "^") {
                    this.excludeTypes = this.charType.All;
                    this.excludeNormalChar = "";
                    this.excludeFormat = "^";
                    return;
                }
                this.excludeTypes = 0;
                this.excludeNormalChar = "";
                for(var i = 0; i < format.GetLength(); i++) {
                    switch(format.charCodeAt(i)) {
                        case 94:
                            // "^"
                            break;
                        case 92:
                            // "/"
                            if(i == format.GetLength() - 1) {
                                throw "Exception.TextFilter.Format.Invalid";
                            }
                            this.excludeNormalChar = this.excludeNormalChar + format.Substring(i + 1, i + 2);
                            i++;
                            break;
                        case 65313:
                            //DBCS A
                            if((this.excludeTypes & this.charType.DBCS_UpperAlphabet) == (this.charType.DBCS_UpperAlphabet | 0)) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.DBCS_UpperAlphabet;
                            }
                            break;
                        case 65:
                            //SBCS A
                            if((this.excludeTypes & this.charType.SBCS_UpperAlphabet) == this.charType.SBCS_UpperAlphabet) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.SBCS_UpperAlphabet;
                            }
                            break;
                        case 65345:
                            //DBCS a
                            if((this.excludeTypes & this.charType.DBCS_LowerAlphabet) == (this.charType.DBCS_LowerAlphabet | 0)) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.DBCS_LowerAlphabet;
                            }
                            break;
                        case 97:
                            //SBCS a
                            if((this.excludeTypes & this.charType.SBCS_LowerAlphabet) == this.charType.SBCS_LowerAlphabet) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.SBCS_LowerAlphabet;
                            }
                            break;
                        case 65323:
                            //DBCS K
                            if((this.excludeTypes & this.charType.DBCS_Katakana) == (this.charType.DBCS_Katakana | 0)) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.DBCS_Katakana;
                            }
                            break;
                        case 75:
                            //SBCS K
                            if((this.excludeTypes & this.charType.SBCS_Katakana) == this.charType.SBCS_Katakana) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.SBCS_Katakana;
                            }
                            break;
                        case 65305:
                            //DBCS 9
                            if((this.excludeTypes & this.charType.DBCS_Number) == (this.charType.DBCS_Number | 0)) {
                                return;
                            } else {
                                this.excludeTypes |= this.charType.DBCS_Number;
                            }
                            break;
                        case 57:
                            //SBCS 9
                            if((this.excludeTypes & this.charType.SBCS_Number) == this.charType.SBCS_Number) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.SBCS_Number;
                            }
                            break;
                        case 65283:
                            //DBCS #
                            if((this.excludeTypes & this.charType.DBCS_NumberSymbol) == (this.charType.DBCS_NumberSymbol | 0)) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.DBCS_NumberSymbol;
                            }
                            break;
                        case 35:
                            //SBCS #
                            if((this.excludeTypes & this.charType.SBCS_NumberSymbol) == this.charType.SBCS_NumberSymbol) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.SBCS_NumberSymbol;
                            }
                            break;
                        case 65312:
                            //DBCS @
                            if((this.excludeTypes & this.charType.DBCS_Symbol) == (this.charType.DBCS_Symbol | 0)) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.DBCS_Symbol;
                            }
                            break;
                        case 64:
                            //SBCS @
                            if((this.excludeTypes & this.charType.SBCS_Symbol) == this.charType.SBCS_Symbol) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.SBCS_Symbol;
                            }
                            break;
                        case 65314:
                            //DBCS B
                            if((this.excludeTypes & this.charType.DBCS_Binary) == (this.charType.DBCS_Binary | 0)) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.DBCS_Binary;
                            }
                            break;
                        case 66:
                            //SBCS B
                            if((this.excludeTypes & this.charType.SBCS_Binary) == this.charType.SBCS_Binary) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.SBCS_Binary;
                            }
                            break;
                        case 65336:
                            //DBCS X
                            if((this.excludeTypes & this.charType.DBCS_Hexadecimal) == (this.charType.DBCS_Hexadecimal | 0)) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.DBCS_Hexadecimal;
                            }
                            break;
                        case 88:
                            //SBCS X
                            if((this.excludeTypes & this.charType.SBCS_Hexadecimal) == this.charType.SBCS_Hexadecimal) {
                                ;
                            } else {
                                // return;
                                this.excludeTypes |= this.charType.SBCS_Hexadecimal;
                            }
                            break;
                        case 65322:
                            //DBCS J
                            if((this.excludeTypes & this.charType.DBCS_Hiragana) == (this.charType.DBCS_Hiragana | 0)) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.DBCS_Hiragana;
                            }
                            break;
                        case 65338:
                            //DBCS Z
                            if((this.excludeTypes & this.charType.DBCS_All) == (this.charType.DBCS_All | 0)) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.DBCS_All;
                            }
                            break;
                        case 65325:
                            //DBCS M
                            if((this.excludeTypes & this.charType.DBCS_ShiftJIS) == (this.charType.DBCS_ShiftJIS | 0)) {
                                ;
                            } else {
                                // return;
                                this.excludeTypes |= this.charType.DBCS_ShiftJIS;
                            }
                            break;
                        case 65321:
                            //DBCS I
                            if((this.excludeTypes & this.charType.DBCS_JISX0208) == (this.charType.DBCS_JISX0208 | 0)) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.DBCS_JISX0208;
                            }
                            break;
                        case 72:
                            //SBCS H
                            if((this.excludeTypes & this.charType.SBCS_All) == this.charType.SBCS_All) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.SBCS_All;
                            }
                            break;
                        case 78:
                            if((this.excludeTypes & this.charType.Upper_SBCS_Katakana) == this.charType.Upper_SBCS_Katakana) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.Upper_SBCS_Katakana;
                            }
                            break;
                        case 65326:
                            // DBCS N
                            if((this.excludeTypes & this.charType.Upper_DBCS_Katakana) == this.charType.Upper_DBCS_Katakana) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.Upper_DBCS_Katakana;
                            }
                            break;
                        case 65319:
                            // DBCS G
                            if((this.excludeTypes & this.charType.Upper_DBCS_Hiragana) == this.charType.Upper_DBCS_Hiragana) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.Upper_DBCS_Hiragana;
                            }
                            break;
                        case 65331:
                            // DBCS S
                            if((this.excludeTypes & this.charType.DBCS_Space) == this.charType.DBCS_Space) {
                                ;
                            } else {
                                // return;
                                this.excludeTypes |= this.charType.DBCS_Space;
                            }
                            break;
                        case 83:
                            // SBCS S
                            if((this.excludeTypes & this.charType.SBCS_Space) == this.charType.SBCS_Space) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.SBCS_Space;
                            }
                            break;
                        case 65332:
                            // DBCS T
                            if((this.excludeTypes & this.charType.FourBytes) == this.charType.FourBytes) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.FourBytes;
                            }
                            break;
                        case 65316:
                            // DBCS D
                            if((this.excludeTypes & this.charType.TwoBytes) == this.charType.TwoBytes) {
                                ;
                            } else {
                                //return;
                                this.excludeTypes |= this.charType.TwoBytes;
                            }
                            break;
                        case 65317:
                            // Emoji key word.
                            this.excludeTypes |= this.charType.Emoji;
                            break;
                        case 65334:
                            this.excludeTypes |= this.charType.IVS;
                            break;
                        default:
                            this.excludeNormalChar = this.excludeNormalChar + format.Substring(i, i + 1);
                            break;
                    }
                }
            };
            TextFilter.prototype.ParseFormat = /**
            *Parses the format string and get a filter to check character.
            *@param format - The format string
            *@return  Return the text filter object
            */
            function (format) {
                this.includeFormat = this.GetIncludeFormat(format);
                this.excludeFormat = this.GetExcludeFormat(format);
                this.ParseIncludeFormat(this.includeFormat);
                this.ParseExcludeFormat(this.excludeFormat);
            };
            TextFilter.prototype.IsValidProcess = function (c, charType, normalChar) {
                if(normalChar.IndexOf(c) != -1) {
                    return true;
                }
                if(c == '\x09' || c == '\x0D' || c == '\x0A') {
                    return true;
                }
                if(charType == 0) {
                    return false;
                }
                // Check the character type.
                var isValid = false;
                if(charType == this.charType.All) {
                    return true;
                }
                if((charType & this.charType.Emoji) == (this.charType.Emoji | 0) && this.IsEmoji(c)) {
                    return true;
                }
                if((charType & this.charType.IVS) == (this.charType.IVS | 0) && this.IsIVS(c)) {
                    return true;
                }
                if((charType & this.charType.FourBytes) == (this.charType.FourBytes | 0) && this.IsFourBytes(c)) {
                    return true;
                }
                if(c.GetLength() == 1 && c.length > 1) {
                    // DaryLuo 2013/04/28 fix bug 1061, 1062 in IM Web 7.1
                    return false;
                }
                if((charType & this.charType.DBCS_ShiftJIS) == (this.charType.DBCS_ShiftJIS | 0) && this.IsShiftJIS(c)) {
                    return true;
                }
                if(this.charExInstance.IsFullWidth(c)) {
                    if((charType & this.charType.DBCS) != (this.charType.DBCS | 0)) {
                        return false;
                    }
                    if((charType & this.charType.DBCS_All) == (this.charType.DBCS_All | 0) && c != '\u3000') {
                        isValid = true;
                    } else if((charType & this.charType.DBCS_LowerAlphabet) == (this.charType.DBCS_LowerAlphabet | 0) && this.IsLower(c)) {
                        isValid = true;
                    } else if((charType & this.charType.DBCS_UpperAlphabet) == (this.charType.DBCS_UpperAlphabet | 0) && this.IsUpper(c)) {
                        isValid = true;
                    } else if((charType & this.charType.DBCS_Number) == (this.charType.DBCS_Number | 0) && this.IsNumber(c)) {
                        isValid = true;
                    } else if((charType & this.charType.DBCS_Binary) == (this.charType.DBCS_Binary | 0) && this.IsBinary(c)) {
                        isValid = true;
                    } else if((charType & this.charType.DBCS_Hexadecimal) == (this.charType.DBCS_Hexadecimal | 0) && this.IsHex(c)) {
                        isValid = true;
                    } else if((charType & this.charType.DBCS_Symbol) == (this.charType.DBCS_Symbol | 0) && this.IsSymbol(c)) {
                        isValid = true;
                    } else if((charType & this.charType.DBCS_NumberSymbol) == (this.charType.DBCS_NumberSymbol | 0) && this.IsNumberSymbol(c)) {
                        isValid = true;
                    } else if((charType & this.charType.DBCS_Katakana) == (this.charType.DBCS_Katakana | 0) && this.IsKatakana(c)) {
                        //2012/08/17, Robin Hotfix Bug#37.
                        // The char '\u30FC' is hiranaga while it is katakana type.
                        // So !Include will have some special logic for checking chars in the intersection.
                        //isValid = true;
                        var isMixedJPChar = this.IsHiragana(c);
                        if(isMixedJPChar) {
                            if(this.include) {
                                isValid = true;
                            } else {
                                isValid = ((charType & this.charType.DBCS_Hiragana) == (this.charType.DBCS_Hiragana | 0));
                            }
                        } else {
                            isValid = true;
                        }
                    } else if((charType & this.charType.DBCS_Hiragana) == (this.charType.DBCS_Hiragana | 0) && this.IsHiragana(c)) {
                        //isValid = true;
                        var isMixedJPChar = this.IsKatakana(c);
                        if(isMixedJPChar) {
                            if(this.include) {
                                isValid = true;
                            } else {
                                isValid = ((charType & this.charType.DBCS_Katakana) == (this.charType.DBCS_Katakana | 0));
                            }
                        } else {
                            isValid = true;
                        }
                    } else if((charType & this.charType.DBCS_JISX0208) == (this.charType.DBCS_JISX0208 | 0) && this.IsJISX0208(c)) {
                        isValid = true;
                    } else if((charType & this.charType.Upper_DBCS_Katakana) == (this.charType.Upper_DBCS_Katakana | 0) && this.IsKatakana(c) && this.IsUpperKana(c)) {
                        isValid = true;
                    } else if((charType & this.charType.Upper_DBCS_Hiragana) == (this.charType.Upper_DBCS_Hiragana | 0) && this.IsHiragana(c) && this.IsUpperKana(c)) {
                        isValid = true;
                    } else if((charType & this.charType.DBCS_Space) == (this.charType.DBCS_Space | 0) && this.IsFormatSpace(c)) {
                        isValid = true;
                    } else if((charType & this.charType.FourBytes) == (this.charType.FourBytes | 0) && this.IsFourBytes(c)) {
                        isValid = true;
                    } else if((charType & this.charType.TwoBytes) == (this.charType.TwoBytes | 0) && !this.IsFourBytes(c) && c != '\u3000') {
                        isValid = true;
                    }
                } else {
                    if((charType & this.charType.SBCS) != this.charType.SBCS) {
                        return false;
                    }
                    if((charType & this.charType.SBCS_All) == this.charType.SBCS_All && c != '\x20') {
                        isValid = true;
                    } else if((charType & this.charType.SBCS_LowerAlphabet) == this.charType.SBCS_LowerAlphabet && this.IsLower(c)) {
                        isValid = true;
                    } else if((charType & this.charType.SBCS_UpperAlphabet) == this.charType.SBCS_UpperAlphabet && this.IsUpper(c)) {
                        isValid = true;
                    } else if((charType & this.charType.SBCS_Number) == this.charType.SBCS_Number && this.IsNumber(c)) {
                        isValid = true;
                    } else if((charType & this.charType.SBCS_Binary) == this.charType.SBCS_Binary && this.IsBinary(c)) {
                        isValid = true;
                    } else if((charType & this.charType.SBCS_Hexadecimal) == this.charType.SBCS_Hexadecimal && this.IsHex(c)) {
                        isValid = true;
                    } else if((charType & this.charType.SBCS_Symbol) == this.charType.SBCS_Symbol && this.IsSymbol(c)) {
                        isValid = true;
                    } else if((charType & this.charType.SBCS_NumberSymbol) == this.charType.SBCS_NumberSymbol && this.IsNumberSymbol(c)) {
                        isValid = true;
                    } else if((charType & this.charType.SBCS_Katakana) == this.charType.SBCS_Katakana && this.IsKatakana(c)) {
                        isValid = true;
                    } else if((charType & this.charType.Upper_SBCS_Katakana) == this.charType.Upper_SBCS_Katakana && this.IsKatakana(c) && this.IsUpperKana(c)) {
                        isValid = true;
                    } else if((charType & this.charType.SBCS_Space) == this.charType.SBCS_Space && this.IsFormatSpace(c)) {
                        isValid = true;
                    }
                }
                return isValid;
            };
            TextFilter.prototype.IsIncludeValid = function (c) {
                return this.IsValidProcess(c, this.allowTypes, this.includeNormalChar);
            };
            TextFilter.prototype.IsExcludeValid = function (c) {
                return this.IsValidProcess(c, this.excludeTypes, this.excludeNormalChar);
            };
            TextFilter.prototype.IsValid = /**
            *Check whether the character is valid.
            *@param c - The character to be checked
            *@return Return the value indicating whether the character is valid
            */
            function (c) {
                if(this.excludeFormat != "") {
                    if(!this.IsExcludeValid(c)) {
                        if(this.includeFormat != "") {
                            return this.IsIncludeValid(c);
                        }
                    } else {
                        return false;
                    }
                } else {
                    if(this.includeFormat != "") {
                        return this.IsIncludeValid(c);
                    }
                }
                return true;
            };
            TextFilter.prototype.IsFormatSpace = function (c) {
                if(c == '\x20' || c == '\u3000') {
                    return true;
                } else {
                    return false;
                }
            };
            TextFilter.prototype.IsFourBytes = function (c) {
                var charEx = input.CharProcess.CharEx;
                var textElement = c.Substring(0, 1);
                if(textElement.length > 1) {
                    for(var i = 0; i < textElement.length; i++) {
                        if(charEx.IsSurrogate(textElement[i])) {
                            return true;
                        }
                    }
                }
                return false;
            };
            TextFilter.prototype.IsUpper = function (c) {
                return this.charExInstance.IsUpper(c);
            };
            TextFilter.prototype.IsLower = function (c) {
                return this.charExInstance.IsLower(c);
            };
            TextFilter.prototype.IsNumber = function (c) {
                return this.charExInstance.IsDigit(c);
            };
            TextFilter.prototype.IsBinary = function (c) {
                c = this.IsFullWidth(c) ? this.ToHalfWidth(c) : c;
                return (c == '0' || c == '1');
            };
            TextFilter.prototype.IsHex = function (c) {
                c = this.IsFullWidth(c) ? this.ToHalfWidth(c) : c;
                return (c == 'A' || c == 'B' || c == 'C' || c == 'D' || c == 'E' || c == 'F' || c == 'a' || c == 'b' || c == 'c' || c == 'd' || c == 'e' || c == 'f' || this.IsDigit(c));
            };
            TextFilter.prototype.IsSymbol = function (c) {
                return this.charExInstance.IsHalfWidthSymbol(c) || this.charExInstance.IsFullWidthSymbol(c);
            };
            TextFilter.prototype.IsNumberSymbol = function (c) {
                c = this.IsFullWidth(c) ? this.ToHalfWidth(c) : c;
                return (this.IsDigit(c) || c == '+' || c == '-' || c == '$' || c == '%' || c == '\\' || c == ',' || c == '.');
            };
            TextFilter.prototype.IsKatakana = function (c) {
                return this.charExInstance.IsKatakana(c);
            };
            TextFilter.prototype.IsHiragana = function (c) {
                return this.charExInstance.IsHiragana(c);
            };
            TextFilter.prototype.IsShiftJIS = function (c) {
                return this.charExInstance.IsShiftJIS(c);
            };
            TextFilter.prototype.IsJISX0208 = function (c) {
                return this.charExInstance.IsJISX0208(c);
            };
            TextFilter.prototype.IsEmoji = function (c) {
                var ref = {
                };
                //return EmojiHelper.IsEmoji(c, 0, ref);
                return false;
            };
            TextFilter.prototype.IsIVS = function (c) {
                var ref = {
                };
                //return IVSCharHelper.IsIVSElement(c, 0, ref);
                return false;
            };
            TextFilter.prototype.IsDBCS = function (c) {
                return this.IsFullWidth(c);
            };
            TextFilter.prototype.IsSBCS = function (c) {
                return !this.IsFullWidth(c);
            };
            TextFilter.prototype.IsFullWidth = function (c) {
                return this.charExInstance.IsFullWidth(c);
            };
            TextFilter.prototype.IsSurrogatePair = //commented by Kevin, May 21, 2007
            //Bug#7960, JIS2004
            function (c) {
                return this.charExInstance.IsSurrogatePair(c);
            };
            TextFilter.prototype.ToHalfWidth = //end by Kevin
            function (c) {
                return this.charExInstance.ToHalfWidth(c);
            };
            TextFilter.prototype.IsDigit = function (c) {
                return this.charExInstance.IsDigit(c);
            };
            TextFilter.prototype.IsUpperKana = /// <summary>
            ///   Checks whether the speical character is a upper case katakana character.
            /// </summary>
            /// <param name="c">
            ///   A <b>char</b> indicates the character to be checked.
            /// </param>
            /// <returns>
            ///   If the character is a upper case katakana character, return <b>true</b>, otherwise, return <b>false</b>.
            /// </returns>
            function (c) {
                return this.charExInstance.IsUpperKana(c);
            };
            TextFilter.prototype.CheckValidSpace = function (character) {
                if((character == '\x20') && ((this.allowTypes & this.charType.SBCS_Space) == (this.charType.SBCS_Space | 0))) {
                    return true;
                } else if((character == '\u3000') && ((this.allowTypes & this.charType.DBCS_Space) == (this.charType.DBCS_Space | 0))) {
                    return true;
                }
                return false;
            };
            TextFilter.prototype.Check = //	/// <summary>
            //	/// Check whether the character is valid.
            //	/// </summary>
            //	/// <param name="text">The string to be checked.</param>
            //	/// <param name="index">The character index in the string.</param>
            //	/// <returns>The convert string.</returns
            function (text, index) {
                var character;
                if(index != null)//Added For Bug 2438
                 {
                    character = text.Substring(index, index + 1);
                } else {
                    character = text;
                }
                var isValid = this.IsValid(character);
                if(isValid) {
                    return character;
                }
                //		}
                if(this.autoConvert) {
                    if(index != null)//Added for Bug 2438
                     {
                        return this.Convert(text, index);
                    } else {
                        return this.Convert(character);
                    }
                }
                return "";
            };
            TextFilter.prototype.CheckText = function (text) {
                var length = text.GetLength();
                var ret = {
                    IsInputValid: true,
                    CheckedText: ""
                };
                for(var i = 0; i < length; ) {
                    var c = text.Substring(i, i + 1);
                    if(c != "\t" && c != "\r" && c != "\n") {
                        var temp = this.Check(text, i);
                        if(temp.index != null) {
                            i = temp.index;
                            c = temp.strValue;
                        } else {
                            c = temp;
                            i++;
                        }
                        if(c == "") {
                            ret.IsInputValid = false;
                        }
                    } else {
                        i++;
                    }
                    ret.CheckedText += c;
                }
                return ret;
            };
            TextFilter.prototype.Convert = /// <summary>
            /// Convert the character in the special index.
            /// </summary>
            /// <param name="text">The string to be checked.</param>
            /// <param name="index">The character index in the string.</param>
            /// <returns>The convert string.</returns>
            function (text, index) {
                var c;
                if(index == null) {
                    c = text;
                } else {
                    c = text.Substring(index, index + 1);
                }
                var isValid = false;
                // Convert between upper and lower alphabet automatically.
                if(this.charExInstance.IsAlphabet(c)) {
                    var r = this.charExInstance.IsLower(c) ? c.toUpperCase() : c.toLowerCase();
                    isValid = this.IsValid(r);
                    if(isValid) {
                        return r;
                    }
                    c = this.charExInstance.IsFullWidth(c) ? this.charExInstance.ToHalfWidth(c) : this.charExInstance.ToFullWidth(c).text;
                    isValid = this.IsValid(c);
                    if(isValid) {
                        return c;
                    }
                    r = this.charExInstance.IsFullWidth(r) ? this.charExInstance.ToHalfWidth(r) : this.charExInstance.ToFullWidth(r).text;
                    isValid = this.IsValid(r);
                    if(isValid) {
                        return r;
                    }
                    return "";
                }
                // Convert from Hiragana to other styles automatically.
                if(this.charExInstance.IsHiragana(c)) {
                    // Large < - > Small
                    if(this.charExInstance.IsLowerKana(c)) {
                        var u = this.charExInstance.ToUpperKana(c);
                        isValid = this.IsValid(u);
                        if(isValid) {
                            return u;
                        }
                    } else if(this.charExInstance.HasLowerKana(c)) {
                        var l = this.charExInstance.ToLowerKana(c);
                        isValid = this.IsValid(l);
                        if(isValid) {
                            return l;
                        }
                    }
                    // Hiragana to DBCS Katakana
                    var r = this.charExInstance.ToKatakana(c);
                    isValid = this.IsValid(r);
                    if(isValid) {
                        return r;
                    }
                    if(this.charExInstance.IsLowerKana(r)) {
                        var u = this.charExInstance.ToUpperKana(r);
                        isValid = this.IsValid(u);
                        if(isValid) {
                            return u;
                        }
                    } else if(this.charExInstance.HasLowerKana(r)) {
                        var l = this.charExInstance.ToLowerKana(r);
                        isValid = this.IsValid(l);
                        if(isValid) {
                            return l;
                        }
                    }
                    // Hiragana to SBCS Katakana
                    var chars = this.charExInstance.ToHalfWidthEx(r);
                    isValid = this.IsValid(chars);
                    if(isValid) {
                        return chars;
                    }
                    if(this.charExInstance.IsLowerKana(chars)) {
                        chars = this.charExInstance.ToUpperKana(chars);
                        isValid = this.IsValid(chars);
                        if(isValid) {
                            return chars;
                        }
                    } else if(this.charExInstance.HasLowerKana(chars)) {
                        chars = this.charExInstance.ToLowerKana(chars);
                        isValid = this.IsValid(chars);
                        if(isValid) {
                            return chars;
                        }
                    }
                    return "";
                }
                // Convert from Katakana to Hiragana (or DBCS <-> SBCS)automatically.
                if(this.charExInstance.IsKatakana(c)) {
                    // Large < - > Small
                    if(this.charExInstance.IsLowerKana(c)) {
                        var u = this.charExInstance.ToUpperKana(c);
                        isValid = this.IsValid(u);
                        if(isValid) {
                            return u;
                        }
                    } else if(this.charExInstance.HasLowerKana(c)) {
                        var l = this.charExInstance.ToLowerKana(c);
                        isValid = this.IsValid(l);
                        if(isValid) {
                            return l;
                        }
                    }
                    // DBCS < - > SBCS
                    var processedAll = false;
                    var r = c;
                    if(this.charExInstance.IsFullWidth(c)) {
                        var newChars = this.charExInstance.ToHalfWidthEx(c);
                        if(newChars.GetLength() > 0) {
                            isValid = this.IsValid(newChars);
                            if(isValid) {
                                return newChars;
                            }
                        }
                        if(this.charExInstance.IsLowerKana(newChars)) {
                            newChars = this.charExInstance.ToUpperKana(newChars);
                            isValid = this.IsValid(newChars);
                            if(isValid) {
                                return newChars;
                            }
                        } else if(this.charExInstance.HasLowerKana(newChars)) {
                            newChars = this.charExInstance.ToLowerKana(newChars);
                            isValid = this.IsValid(newChars);
                            if(isValid) {
                                return newChars;
                            }
                        }
                    } else {
                        if(index == null) {
                            r = this.charExInstance.ToFullWidth(c).text;
                            if(!this.charExInstance.IsKatakana(r)) {
                                // ***********
                                return "";
                            }
                            isValid = this.IsValid(r);
                            if(isValid) {
                                return r;
                            }
                        } else {
                            if((index + 1) < text.GetLength()) {
                                var convertObj = this.charExInstance.ToFullWidth(text.Substring(index, index + 2));
                                r = convertObj.text;
                                processedAll = convertObj.processedAll;
                            } else {
                                r = this.charExInstance.ToFullWidth(c).text;
                            }
                            if(!this.charExInstance.IsKatakana(r)) {
                                return "";
                            }
                            isValid = this.IsValid(r);
                            if(isValid) {
                                index++;
                                if(processedAll) {
                                    index++;
                                }
                                return {
                                    index: index,
                                    strValue: r
                                };
                            }
                        }
                        if(this.charExInstance.IsLowerKana(r)) {
                            var u = this.charExInstance.ToUpperKana(r);
                            isValid = this.IsValid(u);
                            if(isValid) {
                                return u;
                            }
                        } else if(this.charExInstance.HasLowerKana(r)) {
                            var l = this.charExInstance.ToLowerKana(r);
                            isValid = this.IsValid(l);
                            if(isValid) {
                                return l;
                            }
                        }
                    }
                    r = this.charExInstance.ToHiragana(r);
                    isValid = this.IsValid(r);
                    if(isValid) {
                        if(index != null) {
                            index++;
                            if(processedAll) {
                                index++;
                            }
                            var retObj = {
                                index: index,
                                strValue: r
                            };
                            //add by sj for bug 2955
                            if(r == '\u3094') {
                                if(processedAll) {
                                    retObj.strValue = '\u3046' + '\u309B';
                                } else {
                                    retObj.strValue = "";
                                }
                            }
                            //end by sj
                            return retObj;
                        } else {
                            //add by sj for bug 2955
                            if(r == '\u3094') {
                                return "";
                            }
                            //end by sj
                            return r;
                        }
                    }
                    if(this.charExInstance.IsLowerKana(r)) {
                        var u = this.charExInstance.ToUpperKana(r);
                        isValid = this.IsValid(u);
                        if(isValid) {
                            return u;
                        }
                    } else if(this.charExInstance.HasLowerKana(r)) {
                        var l = this.charExInstance.ToLowerKana(r);
                        isValid = this.IsValid(l);
                        if(isValid) {
                            return l;
                        }
                    }
                }
                // Convert between DBCS and SBCS automatically.
                c = this.charExInstance.IsFullWidth(c) ? this.charExInstance.ToHalfWidth(c) : this.charExInstance.ToFullWidth(c).text;
                //		var ret = this.IsSpace(c);
                //		if (ret.IsSpace && this.CheckCharByAllowSpace(ret.Character, this.allowSpace))
                //		{
                //			return ret.Character;
                //		}
                isValid = this.IsValid(c);
                if(isValid) {
                    return c;
                }
                return "";
            };
            return TextFilter;
        })();
        input.TextFilter = TextFilter;        
        ;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
$.wijinputcore = $.wijinputcore || {
};
$.wijinputcore.validateText = $.wijinputcore.validateText || function (value, arg1, arg2) {
    if(arg2 === undefined) {
        //Check format.
        var filter = new wijmo.input.TextFilter(false, arg1);
        var ret = filter.CheckText(value);
        var formatedText = ret.CheckedText;
        if(formatedText === value) {
            return true;
        } else {
            return false;
        }
    } else {
        //Check length
        var length = value.length;
        if(length < arg1 || length > arg2) {
            return false;
        } else {
            return true;
        }
    }
};
