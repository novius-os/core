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
    /*
    * Depends:
    *	jquery-1.4.2.js
    *
    */
    (function (input) {
        "use strict";
        var $ = jQuery;
        /** @ignore */
        var CharacterFilter = (function () {
            function CharacterFilter(label, owner, include) {
                this.filterLabel = label;
                this._include = include;
                this._owner = owner;
            }
            CharacterFilter.prototype.Check = function (text, index) {
                var retObj = {
                };
                retObj.success = false;
                retObj.strValue = "";
                retObj.index = index;
                // Check the character type.
                var checkingText = text.Substring(index, index + 1);
                var isValid = this.IsValid(checkingText);
                //	if ((isValid && this._include) || (!isValid && !this._include))
                //	{
                //		text = text.Substring(index, index + 1);
                //		index++;
                //
                //		retObj.strValue = text;
                //    	retObj.index = index;
                //		return retObj;
                //	}
                if(isValid) {
                    text = text.Substring(index, index + 1);
                    index++;
                    retObj.strValue = text;
                    retObj.index = index;
                    return retObj;
                }
                if(this._owner.GetAutoConvert() && (checkingText.length === 1 || checkingText.length === 3)) {
                    retObj = this.Convert(text, index);
                    if(retObj.success) {
                        return retObj;
                    }
                }
                return retObj;
            };
            CharacterFilter.prototype.IsValid = function (c) {
                if(c.length === 2 && (c.charCodeAt(1) === 0xff9e || c.charCodeAt(1) === 0xff9f)) {
                    // DaryLuo 2013/04/24 fix bug 1050 in IM Web 7.1
                    if(!input.CharProcess.CharEx.IsFullWidth(c) && input.CharProcess.CharEx.IsKatakana(c)) {
                        return this.IsValidTwoByte(c);
                    }
                }
                if(c.length > 1) {
                    return this.IsValidMoreByte(c);
                } else {
                    return this.IsValidTwoByte(c);
                }
            };
            CharacterFilter.prototype.IsValidTwoByte = function (c) {
                return false;
            };
            CharacterFilter.prototype.IsValidMoreByte = function (c) {
                return false;
            };
            CharacterFilter.prototype.Convert = function (text, index) {
                var retObj = {
                };
                retObj.success = true;
                retObj.strValue = "";
                retObj.index = index;
                var c = text.Substring(index, index + 1);
                var isValid;
                var charEx = input.CharProcess.CharEx;
                //if (true) {
                //    var charLength = {};
                //    var result = IVSCharHelper.ConvertedWithIVS(c, 0, charLength);
                //    if (result.length > 0) {
                //        isValid = this.IsValid(result);
                //        if (isValid) {
                //            index++;
                //            retObj.index = index;
                //            retObj.strValue = result;
                //            return retObj;
                //        }
                //    }
                //}
                // Convert between upper and lower alphabet automatically.
                if(charEx.IsAlphabet(c)) {
                    var r = charEx.IsLower(c) ? c.toUpperCase() : c.toLowerCase();
                    isValid = this.IsValid(r);
                    if((isValid && this._include) || (!isValid && !this._include)) {
                        index++;
                        retObj.index = index;
                        retObj.strValue = r;
                        return retObj;
                        //return new string(r, 1);
                                            }
                    c = charEx.IsFullWidth(c) ? charEx.ToHalfWidth(c) : charEx.ToFullWidth(c).text;
                    isValid = this.IsValid(c);
                    if((isValid && this._include) || (!isValid && !this._include)) {
                        index++;
                        retObj.index = index;
                        retObj.strValue = c;
                        return retObj;
                        //return new string(c, 1);;
                                            }
                    r = charEx.IsFullWidth(r) ? charEx.ToHalfWidth(r) : charEx.ToFullWidth(r).text;
                    isValid = this.IsValid(r);
                    if((isValid && this._include) || (!isValid && !this._include)) {
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
                        isValid = this.IsValid(u);
                        if((isValid && this._include) || (!isValid && !this._include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = u;
                            return retObj;
                        }
                    } else if(charEx.HasLowerKana(c)) {
                        var l = charEx.ToLowerKana(c);
                        isValid = this.IsValid(l);
                        if((isValid && this._include) || (!isValid && !this._include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = l;
                            return retObj;
                        }
                    }
                    c = charEx.ToKatakana(c);
                    // DaryLuo 2012/05/31 fix bug 116 in IM7. Add this.
                    isValid = this.IsValid(c);
                    if((isValid && this._include) || (!isValid && !this._include)) {
                        index++;
                        retObj.index = index;
                        retObj.strValue = c;
                        return retObj;
                        //return new string(c, 1);
                                            }
                    if(charEx.IsLowerKana(c)) {
                        var u = charEx.ToUpperKana(c);
                        // DaryLuo 2012/05/31 fix bug 116 in IM7. Add this.
                        isValid = this.IsValid(u);
                        if((isValid && this._include) || (!isValid && !this._include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = u;
                            return retObj;
                        }
                    } else if(charEx.HasLowerKana(c)) {
                        var l = charEx.ToLowerKana(c);
                        isValid = this.IsValid(l);
                        if((isValid && this._include) || (!isValid && !this._include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = l;
                            return retObj;
                        }
                    }
                    var chars = charEx.ToHalfWidthEx(c);
                    isValid = this.IsValid(chars);
                    if((isValid && this._include) || (!isValid && !this._include)) {
                        index++;
                        retObj.index = index;
                        retObj.strValue = chars;
                        return retObj;
                        //return new string(chars);
                                            }
                    if(charEx.IsLowerKana(chars)) {
                        chars = charEx.ToUpperKana(chars);
                        isValid = this.IsValid(chars);
                        if((isValid && this._include) || (!isValid && !this._include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = chars;
                            return retObj;
                        }
                    } else if(charEx.HasLowerKana(chars)) {
                        chars = charEx.ToLowerKana(chars);
                        isValid = this.IsValid(chars);
                        if((isValid && this._include) || (!isValid && !this._include)) {
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
                        isValid = this.IsValid(u);
                        if((isValid && this._include) || (!isValid && !this._include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = u;
                            return retObj;
                        }
                    } else if(charEx.HasLowerKana(c)) {
                        var l = charEx.ToLowerKana(c);
                        isValid = this.IsValid(l);
                        if((isValid && this._include) || (!isValid && !this._include)) {
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
                            isValid = this.IsValid(newChars);
                            if((isValid && this._include) || (!isValid && !this._include)) {
                                index++;
                                retObj.index = index;
                                retObj.strValue = newChars;
                                return retObj;
                                //return new string(newChars);
                                                            }
                        }
                        if(charEx.IsLowerKana(newChars)) {
                            newChars = charEx.ToUpperKana(newChars);
                            isValid = this.IsValid(newChars);
                            if((isValid && this._include) || (!isValid && !this._include)) {
                                index++;
                                retObj.index = index;
                                retObj.strValue = newChars;
                                return retObj;
                            }
                        } else if(charEx.HasLowerKana(newChars)) {
                            newChars = charEx.ToLowerKana(newChars);
                            isValid = this.IsValid(newChars);
                            if((isValid && this._include) || (!isValid && !this._include)) {
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
                            isValid = this.IsValid(r);
                            if((isValid && this._include) || (!isValid && !this._include)) {
                                index++;
                                retObj.index = index;
                                retObj.strValue = r;
                                return retObj;
                            }
                        } else {
                            // To process what??? kyle.wang
                            if((index + 1) < text.GetLength()) {
                                //r = charEx.ToFullWidthEx(out processedAll, new char[] {c, text[index + 1]});
                                var convertObj = charEx.ToFullWidth(text.Substring(index, index + 2));
                                r = convertObj.text;
                                processedAll = convertObj.processedAll;
                            } else {
                                r = charEx.ToFullWidth(c).text;
                            }
                            if(!charEx.IsKatakana(r))// ***********
                             {
                                return retObj;
                            }
                            isValid = this.IsValid(r);
                            if((isValid && this._include) || (!isValid && !this._include)) {
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
                            isValid = this.IsValid(u);
                            if((isValid && this._include) || (!isValid && !this._include)) {
                                index++;
                                retObj.index = index;
                                retObj.strValue = u;
                                return retObj;
                            }
                        } else if(charEx.HasLowerKana(r)) {
                            var l = charEx.ToLowerKana(r);
                            isValid = this.IsValid(l);
                            if((isValid && this._include) || (!isValid && !this._include)) {
                                index++;
                                retObj.index = index;
                                retObj.strValue = l;
                                return retObj;
                            }
                        }
                    }
                    r = charEx.ToHiragana(r);
                    isValid = this.IsValid(r);
                    if((isValid && this._include) || (!isValid && !this._include)) {
                        index++;
                        if(processedAll) {
                            index++;
                        }
                        retObj.index = index;
                        retObj.strValue = r;
                        //add by sj for bug 2955
                        if(r === '\u3094') {
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
                        isValid = this.IsValid(u);
                        if((isValid && this._include) || (!isValid && !this._include)) {
                            index++;
                            retObj.index = index;
                            retObj.strValue = u;
                            return retObj;
                        }
                    } else if(charEx.HasLowerKana(r)) {
                        var l = charEx.ToLowerKana(r);
                        isValid = this.IsValid(l);
                        if((isValid && this._include) || (!isValid && !this._include)) {
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
                isValid = this.IsValid(c);
                if((isValid && this._include) || (!isValid && !this._include)) {
                    index++;
                    retObj.index = index;
                    retObj.strValue = c;
                    return retObj;
                    //return new string(c, 1);
                                    }
                retObj.success = false;
                return retObj;
            };
            return CharacterFilter;
        })();
        input.CharacterFilter = CharacterFilter;        
        /** @ignore */
        var HalfWidthFilter = (function (_super) {
            __extends(HalfWidthFilter, _super);
            function HalfWidthFilter(owner, include) {
                        _super.call(this, "HalfWidthFilter", owner, include);
            }
            HalfWidthFilter.prototype.IsValidTwoByte = function (c) {
                if(!input.CharProcess.CharEx.IsFullWidth(c)) {
                    return true;
                }
                if(c === '\x0D' || c === '\x0A') {
                    return true;
                }
                return false;
            };
            return HalfWidthFilter;
        })(CharacterFilter);        
        /** @ignore */
        var FullWidthFilter = (function (_super) {
            __extends(FullWidthFilter, _super);
            function FullWidthFilter(owner, include) {
                        _super.call(this, "FullWidthFilter", owner, include);
            }
            FullWidthFilter.prototype.IsValidTwoByte = function (c) {
                if(input.CharProcess.CharEx.IsFullWidth(c)) {
                    return true;
                }
                if(c === '\x0D' || c === '\x0A') {
                    return true;
                }
                return false;
            };
            return FullWidthFilter;
        })(CharacterFilter);        
        /** @ignore */
        var HiraganaFilter = (function (_super) {
            __extends(HiraganaFilter, _super);
            function HiraganaFilter(owner, include) {
                        _super.call(this, "HiraganaFilter", owner, include);
            }
            HiraganaFilter.prototype.IsValidTwoByte = function (c) {
                if(input.CharProcess.CharEx.IsHiragana(c)) {
                    return true;
                }
                if(c === '\x0D' || c === '\x0A') {
                    return true;
                }
                return false;
            };
            return HiraganaFilter;
        })(CharacterFilter);        
        /** @ignore */
        var ShiftJISFilter = (function (_super) {
            __extends(ShiftJISFilter, _super);
            function ShiftJISFilter(owner, include) {
                        _super.call(this, "ShiftJISFilter", owner, include);
            }
            ShiftJISFilter.prototype.IsValidTwoByte = function (c) {
                return input.CharProcess.CharEx.IsShiftJIS(c);
            };
            return ShiftJISFilter;
        })(CharacterFilter);        
        /** @ignore */
        var JISX0208Filter = (function (_super) {
            __extends(JISX0208Filter, _super);
            function JISX0208Filter(owner, include) {
                        _super.call(this, "JISX0208Filter", owner, include);
            }
            JISX0208Filter.prototype.IsValidTwoByte = function (c) {
                return input.CharProcess.CharEx.IsJISX0208(c);
            };
            return JISX0208Filter;
        })(CharacterFilter);        
        /** @ignore */
        var DBCSHiraganaFilter = (function (_super) {
            __extends(DBCSHiraganaFilter, _super);
            function DBCSHiraganaFilter(owner, include) {
                        _super.call(this, "DBCSHiraganaFilter", owner, include);
            }
            DBCSHiraganaFilter.prototype.IsValidTwoByte = function (c) {
                return input.CharProcess.CharEx.IsUpperKana(c) && input.CharProcess.CharEx.IsHiragana(c);
            };
            return DBCSHiraganaFilter;
        })(CharacterFilter);        
        /** @ignore */
        var DBCSKatakanaFilter = (function (_super) {
            __extends(DBCSKatakanaFilter, _super);
            function DBCSKatakanaFilter(owner, include) {
                        _super.call(this, "DBCSKatakanaFilter", owner, include);
            }
            DBCSKatakanaFilter.prototype.IsValidTwoByte = function (c) {
                return input.CharProcess.CharEx.IsFullWidth(c) && input.CharProcess.CharEx.IsKatakana(c) && !input.CharProcess.CharEx.IsLowerKana(c);
            };
            return DBCSKatakanaFilter;
        })(CharacterFilter);        
        /** @ignore */
        var SBCSKatakanaFilter = (function (_super) {
            __extends(SBCSKatakanaFilter, _super);
            function SBCSKatakanaFilter(owner, include) {
                        _super.call(this, "SBCSKatakanaFilter", owner, include);
            }
            SBCSKatakanaFilter.prototype.IsValidTwoByte = function (c) {
                return !input.CharProcess.CharEx.IsFullWidth(c) && input.CharProcess.CharEx.IsKatakana(c) && !input.CharProcess.CharEx.IsLowerKana(c);
            };
            return SBCSKatakanaFilter;
        })(CharacterFilter);        
        /** @ignore */
        var SurrogateFilter = (function (_super) {
            __extends(SurrogateFilter, _super);
            function SurrogateFilter(owner, include) {
                        _super.call(this, "SurrogateFilter", owner, include);
            }
            SurrogateFilter.prototype.IsValidTwoByte = function (c) {
                if(input.CharProcess.CharEx.IsSurrogatePair(c)) {
                    return true;
                }
                if(c === '\x0D' || c === '\x0A') {
                    return true;
                }
                return false;
            };
            SurrogateFilter.prototype.IsValidMoreByte = function (c) {
                for(var i = 0; i < c.length; i++) {
                    if(input.CharProcess.CharEx.IsSurrogate(c[i])) {
                        return true;
                    }
                }
                return false;
            };
            return SurrogateFilter;
        })(CharacterFilter);        
        /** @ignore */
        var HalfWidthKatakanaFilter = (function (_super) {
            __extends(HalfWidthKatakanaFilter, _super);
            function HalfWidthKatakanaFilter(owner, include) {
                        _super.call(this, "HalfWidthKatakanaFilter", owner, include);
            }
            HalfWidthKatakanaFilter.prototype.IsValidTwoByte = function (c) {
                if(!input.CharProcess.CharEx.IsFullWidth(c) && input.CharProcess.CharEx.IsKatakana(c)) {
                    return true;
                }
                if(c === '\x0D' || c === '\x0A') {
                    return true;
                }
                return false;
            };
            return HalfWidthKatakanaFilter;
        })(CharacterFilter);        
        /** @ignore */
        var FullWidthKatakanaFilter = (function (_super) {
            __extends(FullWidthKatakanaFilter, _super);
            function FullWidthKatakanaFilter(owner, include) {
                        _super.call(this, "FullWidthKatakanaFilter", owner, include);
            }
            FullWidthKatakanaFilter.prototype.IsValidTwoByte = function (c) {
                if(input.CharProcess.CharEx.IsFullWidth(c) && input.CharProcess.CharEx.IsKatakana(c)) {
                    return true;
                }
                if(c === '\x0D' || c === '\x0A') {
                    return true;
                }
                return false;
            };
            return FullWidthKatakanaFilter;
        })(CharacterFilter);        
        /** @ignore */
        var HalfWidthSymbolsFilter = (function (_super) {
            __extends(HalfWidthSymbolsFilter, _super);
            function HalfWidthSymbolsFilter(owner, include) {
                        _super.call(this, "HalfWidthSymbolsFilter", owner, include);
            }
            HalfWidthSymbolsFilter.prototype.IsValidTwoByte = function (c) {
                if(!input.CharProcess.CharEx.IsFullWidth(c) && input.CharProcess.CharEx.IsSymbol(c)) {
                    return true;
                }
                if(c === '\x0D' || c === '\x0A') {
                    return true;
                }
                return false;
            };
            return HalfWidthSymbolsFilter;
        })(CharacterFilter);        
        /** @ignore */
        var FullWidthSymbolsFilter = (function (_super) {
            __extends(FullWidthSymbolsFilter, _super);
            function FullWidthSymbolsFilter(owner, include) {
                        _super.call(this, "FullWidthSymbolsFilter", owner, include);
            }
            FullWidthSymbolsFilter.prototype.IsValidTwoByte = function (c) {
                if(input.CharProcess.CharEx.IsFullWidth(c) && input.CharProcess.CharEx.IsSymbol(c)) {
                    return true;
                }
                if(c === '\x0D' || c === '\x0A') {
                    return true;
                }
                return false;
            };
            return FullWidthSymbolsFilter;
        })(CharacterFilter);        
        /** @ignore */
        var LimitedFilter = (function (_super) {
            __extends(LimitedFilter, _super);
            function LimitedFilter(includeChars, excludeChars, owner, include) {
                        _super.call(this, "LimitedFilter", owner, include);
                this._includeChars = includeChars;
                this._excludeChars = excludeChars;
            }
            LimitedFilter.prototype.IsValidTwoByte = function (c) {
                if((this._includeChars !== "" && this._includeChars.IndexOf(c) > -1) || (this._excludeChars !== "" && this._excludeChars.IndexOf(c) === -1)) {
                    return true;
                }
                if(c === '\x0D' || c === '\x0A') {
                    return true;
                }
                return false;
            };
            LimitedFilter.prototype.IsValidMoreByte = function (c) {
                if((this._includeChars !== "" && this._includeChars.IndexOf(c) > -1) || (this._excludeChars !== "" && this._excludeChars.IndexOf(c) === -1)) {
                    return true;
                }
                if(c === '\x0D' || c === '\x0A') {
                    return true;
                }
                return false;
            };
            return LimitedFilter;
        })(CharacterFilter);        
        /** @ignore */
        var RangeFilter = (function (_super) {
            __extends(RangeFilter, _super);
            function RangeFilter(startChar, endChar, owner, include) {
                        _super.call(this, "RangeFilter", owner, include);
                this._startChar = startChar;
                this._endChar = endChar;
            }
            RangeFilter.prototype.IsValidTwoByte = function (c) {
                if(c >= this._startChar && c <= this._endChar) {
                    return true;
                }
                if(c === '\x0D' || c === '\x0A') {
                    return true;
                }
                return false;
            };
            return RangeFilter;
        })(CharacterFilter);        
        /** @ignore */
        var UnionFilter = (function (_super) {
            __extends(UnionFilter, _super);
            function UnionFilter(owner, include) {
                        _super.call(this, "UnionFilter", owner, include);
                this.filterArray = [];
            }
            UnionFilter.prototype.Add = function (filter) {
                if(filter == null) {
                    return;
                }
                //2012/08/17, Robin Hotfix Bug#37.
                if(filter.filterLabel === "HiraganaFilter") {
                    this.hiranagaFilter = filter;
                } else if(filter.filterLabel === "FullWidthKatakanaFilter") {
                    this.katakanaFilter = filter;
                }
                //End Hotfix Bug#37
                this.filterArray.push(filter);
            };
            UnionFilter.prototype.AddRange = function (filters) {
                for(var i = 0; i < filters.length; i++) {
                    this.Add(filters[i]);
                }
            };
            UnionFilter.prototype.IsValidTwoByte = function (c) {
                if(this.filterArray.length === 0) {
                    if(c === '\x0D' || c === '\x0A') {
                        return true;
                    }
                    return false;
                }
                var includeResult = false;
                var hasInclude = false;
                for(var i = 0; i < this.filterArray.length; i++) {
                    if(this.filterArray[i]._include) {
                        hasInclude = true;
                    }
                }
                //2012/08/17, Robin Hotfix Bug#37.
                // The char '\u30FC' is hiranaga while it is katakana type. See TextFilter for details.
                var isMixedJPChar = (c === '\u30FC');
                if(isMixedJPChar) {
                    if(this.hiranagaFilter && this.katakanaFilter) {
                        if(hasInclude) {
                            return true;
                        }
                    } else if(this.hiranagaFilter) {
                        return true;
                    } else if(this.katakanaFilter) {
                        return true;
                    }
                }
                //End Hotfix Bug#37
                for(var i = 0; i < this.filterArray.length; i++) {
                    if(this.filterArray[i].IsValid(c)) {
                        if(!this.filterArray[i]._include) {
                            return false;
                        } else {
                            includeResult = true;
                        }
                    } else {
                        if(!hasInclude) {
                            includeResult = true;
                        }
                    }
                }
                if(includeResult) {
                    return true;
                }
                if(c === '\x0D' || c === '\x0A') {
                    return true;
                }
                return false;
            };
            UnionFilter.prototype.IsValidMoreByte = function (c) {
                return this.IsValidTwoByte(c);
            };
            return UnionFilter;
        })(CharacterFilter);        
        /** @ignore */
        var Field = (function () {
            function Field(label) {
                this.minLength = -1;
                this.maxLength = -1;
                this.text = "";
                this.oldText = "";
                this.fieldLabel = label;
            }
            Field.prototype.Snap = function () {
                var retObj = {
                };
                retObj.text = this.text;
                retObj.oldText = this.oldText;
                return retObj;
            };
            Field.prototype.Revert = function (snapPackage) {
                this.text = snapPackage.text;
                this.oldText = snapPackage.oldText;
            };
            Field.prototype.GetFieldText = function () {
                if(this.oldText == null) {
                    return null;
                } else {
                    return this.oldText;
                }
            };
            Field.prototype.GetText = function () {
                return this.text;
            };
            Field.prototype.SetText = function (text) {
                this.text = text;
            };
            Field.prototype.GetFillingString = function (promptChar) {
                if(!promptChar) {
                    return null;
                }
                var b = "";
                for(var a = 0; a < this.minLength; a++) {
                    b = b + promptChar;
                }
                return b;
            };
            Field.prototype.GetFieldStatus = function () {
                return 0;
            };
            Field.prototype.GetTextExcludeLiterals = function (start, sellength) {
                var textLength = this.text.GetLength();
                if(textLength < sellength) {
                    sellength = textLength;
                }
                var ret = this.text.Substring(start, sellength);
                ret = ret.replace(/[^\d]/g, '');
                return ret;
            };
            Field.prototype.SaveOldState = function () {
            };
            Field.prototype.RollBack = function () {
            };
            Field.prototype.PerformSpin = function (position, increment, wrap) {
                return 0;
            };
            Field.prototype.Insert = function (start, text, isLast, isSetText) {
            };
            Field.prototype.Replace = function (start, length, text) {
            };
            Field.prototype.Delete = function (start, length) {
            };
            Field.prototype.SaveUndoState = function () {
            };
            Field.prototype.Clear = function () {
                this.text = null;
            };
            Field.prototype.Undo = function () {
            };
            Field.prototype.SetTextInternal = function (text, start, isLast, validateText) {
            };
            Field.prototype.GetLength = function () {
                return this.text.GetLength() > this.minLength ? this.text.GetLength() : this.minLength;
            };
            return Field;
        })();
        input.Field = Field;        
        /** @ignore */
        var PromptField = (function (_super) {
            __extends(PromptField, _super);
            function PromptField(text) {
                        _super.call(this, "PromptField");
                this.text = text;
                this.minLength = this.text.GetLength();
                this.maxLength = this.text.GetLength();
            }
            PromptField.prototype.GetFillingString = function () {
                return this.text;
            };
            PromptField.prototype.SetText = function (text) {
                var retInfo = {
                };
                if(text === this.promptText) {
                    retInfo.existInvalid = false;
                    text = text.Substring(this.text.GetLength());
                } else {
                    retInfo.existInvalid = true;
                }
                retInfo.text = text;
                return retInfo;
            };
            PromptField.prototype.GetLength = function () {
                return this.text.GetLength();
            };
            return PromptField;
        })(Field);        
        /** @ignore */
        var FilterField = (function (_super) {
            __extends(FilterField, _super);
            function FilterField(owner) {
                        _super.call(this, "FilterField");
                this._minLength = 0;
                this._maxLength = 0;
                this._filter = new CharacterFilter();
                this._bitStates = null;
                this._oldBitState = null;
                this.undoText = "";
                this.undoTempText = "";
                this._undoBitState = null;
                this._trueLength = 0;
                this._bitState = null;
                this._owner = owner;
            }
            FilterField.prototype.GetPromptChar = function () {
                return this._owner.GetPromptChar();
            };
            FilterField.prototype.GetAutoConvert = function () {
                return this._owner.GetAutoConvert();
            };
            FilterField.prototype.FilterField = function (minlength, maxlength, filter, bitState) {
                if(minlength > maxlength) {
                    return false;
                }
                if(!filter) {
                    return false;
                }
                this._minLength = minlength;
                this._maxLength = maxlength;
                this._filter = filter;
                this._bitState = bitState;
                this._oldBitState = bitState;
                this._undoBitState = bitState;
                this._trueLength = 0;
                if(this._bitState != null) {
                    var length = 0;
                    while(this._bitState[length] != null) {
                        length++;
                    }
                    for(var i = length; i >= 0; i--) {
                        if(this._bitState[i] != null) {
                            if(this._bitState[i] === false) {
                                this._trueLength--;
                            }
                        } else if(this._bitState[i] == null) {
                            this._trueLength--;
                        } else {
                            break;
                        }
                    }
                }
                // Clear will init the text value with the prompt char.
                this.Clear();
                return true;
            };
            FilterField.prototype.InitialText = function (text) {
                while(text.IndexOf("@#GCD#@") != -1) {
                    text = text.replace("@#GCD#@", "\'");
                }
                while(text.IndexOf("@#GCM#@") != -1) {
                    text = text.replace("@#GCM#@", "\"");
                }
                this.text = text;
                this.oldText = text;
                this.undoText = text;
                this.undoTempText = text;
            };
            FilterField.prototype.GetFieldStatus = function () {
                if(this._trueLength >= this._minLength && this._trueLength > 0) {
                    return 2;
                }
                if(this._trueLength > 0 && this._trueLength < this._minLength) {
                    return 1;
                }
                return 0;
            };
            FilterField.prototype.GetFieldIsFull = function () {
                if(this._trueLength >= this._minLength && this._trueLength > 0) {
                    for(var i = 0; i < this._trueLength; i++) {
                        if(this._bitState[i] === false) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            };
            FilterField.prototype.SetTextInternal = function (text, start, isLast, validateText) {
                var retObj = {
                };
                retObj.offset = start;
                retObj.text = text;
                retObj.existInvalid = false;
                retObj.exception = false;
                var existInvalid = false;
                if(start > this._maxLength || text === "" || text.GetLength() === 0) {
                    return retObj;
                }
                var newText = "";
                var position = 0;
                var tempBitState = [];
                var bitStartPos = start;
                for(var temp = 0; temp < start; temp++) {
                    tempBitState[temp] = this._bitState[temp];
                }
                while(position < text.GetLength()) {
                    var checkObj = this._filter.Check(text, position);
                    var result = checkObj.strValue;
                    position = checkObj.index;
                    if(result === "" && text.Substring(position, position + 1) !== this.GetPromptChar()) {
                        if(!isLast && start + newText.GetLength() >= this._minLength && start + newText.GetLength() === this._trueLength + newText.GetLength()) {
                            break;
                        }
                        existInvalid = true;
                        position++;
                        break;
                    } else {
                        if(result !== "") {
                            if(validateText && validateText !== "" && validateText.Substring(bitStartPos, bitStartPos + 1) === input.Utility.MaskValChar) {
                                newText += this.GetPromptChar();
                                tempBitState[bitStartPos] = false;
                            } else if(result === "\r" || result === "\n") {
                                newText += this.GetPromptChar();
                                tempBitState[bitStartPos] = false;
                            } else {
                                newText += result;
                                tempBitState[bitStartPos] = true;
                            }
                            bitStartPos++;
                            if(result.GetLength() === 2) {
                                tempBitState[bitStartPos] = true;
                                bitStartPos++;
                            }
                        } else {
                            newText += this.GetPromptChar();
                            position++;
                            tempBitState[bitStartPos] = false;
                            bitStartPos++;
                        }
                        if(start + newText.GetLength() === this._maxLength) {
                            break;
                        } else if(start + newText.GetLength() > this._maxLength) {
                            newText = newText.Substring(0, newText.GetLength() - 1);
                            break;
                        }
                    }
                }
                if(start + newText.GetLength() < this._minLength) {
                    text = text.Substring(position, text.GetLength() - position);
                    retObj.existInvalid = existInvalid;
                    retObj.exception = true;
                }
                var fieldText = this.text.Substring(0, start) + newText + this.text.Substring(start, this.text.GetLength());
                if(fieldText.GetLength() > this._maxLength) {
                    fieldText = fieldText.Substring(0, this._maxLength);
                }
                if(fieldText.GetLength() > start + newText.GetLength()) {
                    for(var i = 1; i <= fieldText.GetLength() - start - newText.GetLength(); i++) {
                        if(this._bitState[start + i] != null) {
                            tempBitState[bitStartPos] = this._bitState[start + i];
                            bitStartPos++;
                        }
                    }
                }
                this._bitState = new Array(bitStartPos);
                this._bitState = tempBitState;
                this._trueLength = bitStartPos;
                for(var i = bitStartPos - 1; i >= 0; i--) {
                    if(this._bitState[i] === false) {
                        this._trueLength--;
                    } else {
                        break;
                    }
                }
                if(fieldText.GetLength() < this._minLength) {
                    for(var i = 0; i < this._minLength - fieldText.GetLength(); i--) {
                        fieldText += this.GetPromptChar();
                    }
                }
                for(var i = fieldText.GetLength(); i > this._minLength; i--) {
                    if(fieldText.Substring(i - 1, i) === this.GetPromptChar() && i > this._trueLength) {
                        fieldText = fieldText.Substring(0, i - 1);
                    } else {
                        break;
                    }
                }
                this.text = fieldText;
                if(position === text.GetLength()) {
                    text = "";
                } else {
                    text = text.Substring(position, text.GetLength());
                }
                start += newText.GetLength();
                retObj.offset = start;
                retObj.text = text;
                return retObj;
            };
            FilterField.prototype.SaveOldState = function () {
                this.oldText = this.text;
                this._oldBitState = this._bitState;
            };
            FilterField.prototype.SaveUndoState = function () {
                this.undoText = this.text;
                this.undoTempText = this.text;
                this._undoBitState = this._bitState;
            };
            FilterField.prototype.GetValue = function () {
            };
            FilterField.prototype.GetText = function () {
                return this._text;
            };
            FilterField.prototype.UpdateState = function (submit) {
            };
            FilterField.prototype.RollBack = function () {
                if(this.oldText === this.text) {
                    return;
                } else {
                    var temp = this.oldText;
                    this.text = temp;
                    this._bitState = this._oldBitState;
                    this._trueLength = temp.GetLength();
                    for(var i = temp.GetLength() - 1; i >= 0; i--) {
                        if(this._bitState[i] == false) {
                            this._trueLength--;
                        } else {
                            break;
                        }
                    }
                }
            };
            FilterField.prototype.Undo = function () {
                if(this.undoTempText === this.text) {
                    return false;
                } else {
                    var temp = this.undoTempText;
                    this.undoTempText = this.text;
                    var tempBitState = this._bitState;
                    this.text = temp;
                    this._bitState = this._undoBitState;
                    this._trueLength = temp.GetLength();
                    if(this._bitState.length === 0) {
                        this._trueLength = 0;
                    } else {
                        for(var i = temp.GetLength() - 1; i >= 0; i--) {
                            if(this._bitState[i] === false) {
                                this._trueLength--;
                            } else {
                                break;
                            }
                        }
                    }
                    this._undoBitState = tempBitState;
                    return true;
                }
            };
            FilterField.prototype.Clear = function () {
                this._trueLength = 0;
                var retText = "";
                var tempBitStates = [];
                if(this._minLength > 0) {
                    for(var i = 0; i < this._minLength; i++) {
                        tempBitStates[i] = false;
                    }
                    this._bitState = new Array(this._minLength);
                    this._bitState = tempBitStates;
                    if(this.GetPromptChar() !== "") {
                        for(var i = 0; i < this._minLength; i++) {
                            retText += this.GetPromptChar();
                        }
                    } else {
                        for(var i = 0; i < this._minLength; i++) {
                            retText += " ";
                        }
                    }
                    this.text = retText;
                } else {
                    this.text = "";
                    this._bitStates = null;
                }
            };
            FilterField.prototype.Insert = function (start, text, isLast, isSetText) {
                if(!isSetText) {
                    isSetText = true;
                }
                var retObj = {
                };
                retObj.offset = start;
                retObj.text = text;
                retObj.existInvalid = false;
                retObj.exception = false;
                var existInvalid = false;
                if(start > this._maxLength || text === "" || text.GetLength() === 0) {
                    return retObj;
                }
                var tempBitState = [];
                var bitStartPos = start;
                for(var temp = 0; temp < start; temp++) {
                    tempBitState[temp] = this._bitState[temp];
                }
                var newText = "";
                var position = 0;
                while(position < text.GetLength()) {
                    var checkObj = this._filter.Check(text, position);
                    var result = checkObj.strValue;
                    position = checkObj.index;
                    if(result === "" && (isSetText || text.CharAt(position) !== " ")) {
                        if(!isLast && start + newText.GetLength() >= this._minLength && start + newText.GetLength() >= this._trueLength + newText.GetLength()) {
                            break;
                        }
                        existInvalid = true;
                        position++;
                        continue;
                    } else {
                        if(result === "" && !isSetText && text.CharAt(position) === " ") {
                            newText += this.GetPromptChar();
                            tempBitState[bitStartPos] = false;
                            bitStartPos++;
                            position++;
                        } else if(result === "\r" || result === "\n") {
                            newText += this.GetPromptChar();
                            tempBitState[bitStartPos] = false;
                            bitStartPos++;
                        } else {
                            newText += result;
                            tempBitState[bitStartPos] = true;
                            bitStartPos++;
                            if(result.GetLength() === 2) {
                                tempBitState[bitStartPos] = true;
                                bitStartPos++;
                            }
                        }
                        if(start + newText.GetLength() === this._maxLength) {
                            break;
                        } else if(start + newText.GetLength() > this._maxLength) {
                            newText = newText.Substring(0, newText.GetLength() - 1);
                            break;
                        }
                    }
                }
                if(newText.GetLength() === 0) {
                    text = text.Substring(position, text.GetLength() - position);
                    retObj.existInvalid = existInvalid;
                    retObj.exception = true;
                    return retObj;
                }
                var fieldText = this.text.Substring(0, start) + newText + this.text.Substring(start, this.text.GetLength());
                if(fieldText.GetLength() > this._maxLength) {
                    fieldText = fieldText.Substring(0, this._maxLength);
                }
                if(fieldText.GetLength() > start + newText.GetLength()) {
                    for(var i = 0; i < fieldText.GetLength() - start - newText.GetLength(); i++) {
                        if(this._bitState[start + i] != null) {
                            tempBitState[bitStartPos] = this._bitState[start + i];
                        } else {
                            tempBitState[bitStartPos] = false;
                        }
                        bitStartPos++;
                    }
                }
                this._bitState = new Array(bitStartPos);
                this._bitState = tempBitState;
                this._trueLength = bitStartPos;
                for(var i = bitStartPos - 1; i >= 0; i--) {
                    if(this._bitState[i] === false) {
                        this._trueLength--;
                    } else {
                        break;
                    }
                }
                if(fieldText.GetLength() < this._minLength) {
                    for(var i = 0; i < this._minLength - fieldText.GetLength(); i--) {
                        fieldText += this.GetPromptChar();
                    }
                }
                for(var i = fieldText.GetLength(); i > this._minLength; i--) {
                    if(fieldText.Substring(i - 1, i) === this.GetPromptChar() && i > this._trueLength) {
                        fieldText = fieldText.Substring(0, i - 1);
                    } else {
                        break;
                    }
                }
                this.text = fieldText;
                if(position === text.GetLength()) {
                    text = "";
                } else {
                    text = text.Substring(position, text.GetLength());
                }
                start += newText.GetLength();
                retObj.offset = start;
                retObj.text = text;
                return retObj;
            };
            FilterField.prototype.Replace = function (start, length, text, isLast) {
                var retObj = {
                };
                retObj.offset = start;
                retObj.text = text;
                if(length === 0) {
                    return retObj;
                }
                // DaryLuo 2013/07/09 fix bug 1014 in IM HTML 5.0.
                var charCode = text.charCodeAt(0);
                var excludeCharList = [
                    12364, 
                    12460, 
                    12366, 
                    12462, 
                    12376, 
                    12472
                ];
                if(input.Utility.ArrayIndexOf(excludeCharList, charCode) !== -1 && length === 1) {
                    var checkResult = this._filter.Check(text, 0);
                    if(checkResult.strValue && checkResult.strValue.length === 2) {
                        length = 2;
                    }
                }
                start = this.Delete(start, length);
                retObj = this.Insert(start, text, isLast);
                return retObj;
            };
            FilterField.prototype.Delete = function (start, length) {
                if(length === 0 || start >= this.text.GetLength()) {
                    return start;
                }
                if(start + length > this.text.GetLength()) {
                    length = this.text.GetLength() - start;
                }
                var tempBitState = [];
                var bitStartPos = start;
                for(var temp = 0; temp < start; temp++) {
                    tempBitState[temp] = this._bitState[temp];
                }
                var fieldText = this.text.Substring(0, start) + this.text.Substring(start + length, this.text.GetLength());
                if(start + length < this.text.GetLength()) {
                    for(var i = 0; i < this.text.Substring(start + length, this.text.GetLength()).GetLength(); i++) {
                        if(this._bitState[start + length + i] != null) {
                            tempBitState[bitStartPos] = this._bitState[start + length + i];
                        } else {
                            tempBitState[bitStartPos] = false;
                        }
                        bitStartPos++;
                    }
                }
                if(bitStartPos < this._minLength) {
                    for(var i = bitStartPos; i < this._minLength; i++) {
                        tempBitState[i] = false;
                    }
                }
                this._bitState = new Array(bitStartPos);
                this._bitState = tempBitState;
                this._trueLength = bitStartPos;
                for(var i = bitStartPos - 1; i >= 0; i--) {
                    if(this._bitState[i] === false) {
                        this._trueLength--;
                    } else {
                        break;
                    }
                }
                if(fieldText.GetLength() < this._minLength) {
                    var addTime = this._minLength - fieldText.GetLength();
                    for(var i = 0; i < addTime; i++) {
                        fieldText += this.GetPromptChar();
                    }
                }
                this.text = fieldText;
                return start;
            };
            return FilterField;
        })(Field);        
        /** @ignore */
        var EnumField = (function (_super) {
            __extends(EnumField, _super);
            function EnumField(owner) {
                        _super.call(this, "EnumField");
                this._activeItem = -1;
                this._trueLength = 0;
                this._lastActiveItem = -1;
                this.undoText = "";
                this.undoTempText = "";
                this._undoItem = -1;
                this._minLength = 0;
                this._maxLength = 0;
                this._itemCount = 0;
                this._owner = owner;
            }
            EnumField.prototype.GetPromptChar = function () {
                return this._owner.GetPromptChar();
            };
            EnumField.prototype.GetText = function () {
                var retText = "";
                if(this._activeItem < 0) {
                    retText = input.Utility.ToString(this.GetPromptChar(), this._minLength);
                } else {
                    retText += this._items[this._activeItem];
                }
                return retText;
            };
            EnumField.prototype.GetFieldStatus = function () {
                return this._activeItem === -1 ? 0 : 2;
            };
            EnumField.prototype.GetFieldIsFull = function () {
                return this._activeItem === -1 ? false : true;
            };
            EnumField.prototype.IsOver = function () {
                return (this._activeItem !== -1);
            };
            EnumField.prototype.Init = function (items) {
                var minLength = Number.MAX_VALUE;
                var maxLength = Number.MIN_VALUE;
                for(var i = 0; i < items.length; i++) {
                    minLength = Math.min(minLength, items[i].length);
                    maxLength = Math.max(maxLength, items[i].length);
                }
                this.EnumField(minLength, maxLength, items, items.length, -1);
            };
            EnumField.prototype.EnumField = function (minlength, maxlength, items, itemCount, activeItem) {
                this._minLength = minlength;
                this._maxLength = maxlength;
                if(!items) {
                    return false;
                }
                this._itemCount = itemCount;
                this._activeItem = activeItem;
                this._lastActiveItem = activeItem;
                this._undoItem = activeItem;
                this.InitialItems(items);
                if(activeItem !== -1) {
                    this._trueLength = items[activeItem].toString().GetLength();
                } else {
                    this._trueLength = 0;
                }
                this.text = this.GetText();
            };
            EnumField.prototype.InitialItems = function (items) {
                this._items = new Array(items.length);
                for(var i = 0; i < items.length; i++) {
                    var tempText = items[i];
                    while(tempText.IndexOf("@#GCD#@") !== -1) {
                        tempText = tempText.replace("@#GCD#@", "\'");
                    }
                    while(tempText.IndexOf("@#GCM#@") !== -1) {
                        tempText = tempText.replace("@#GCM#@", "\"");
                    }
                    if(tempText) {
                        tempText = tempText.replace(/@#GCX0D#@/g, "\r").replace(/@#GCX0A#@/g, "\n");
                    }
                    this._items[i] = tempText;
                }
            };
            EnumField.prototype.InitialText = function (text) {
                while(text.IndexOf("@#GCD#@") !== -1) {
                    text = text.replace("@#GCD#@", "\'");
                }
                while(text.IndexOf("@#GCM#@") !== -1) {
                    text = text.replace("@#GCM#@", "\"");
                }
                if(text) {
                    text = text.replace(/@#GCX0D#@/g, "\r").replace(/@#GCX0A#@/g, "\n");
                }
                this.text = text;
                this.oldText = text;
                this.undoText = text;
                this.undoTempText = text;
            };
            EnumField.prototype.Insert = function (start, text, isLast) {
                var retObj = {
                };
                retObj.offset = start;
                retObj.text = text;
                retObj.existInvalid = false;
                retObj.exception = false;
                var old = start;
                var prefix = "";
                if(this._activeItem === -1) {
                    old = 0;
                }
                if(old !== 0) {
                    prefix = this._items[this._activeItem].toString().Substring(0, old);
                }
                var sameCharsIndex = new Array(this._itemCount);
                var textIndex = new Array(this._itemCount);
                var firstSamePos = new Array(this._itemCount);
                var invalidInfos = new Array(this._itemCount);
                for(var i = 0; i < this._itemCount; i++) {
                    sameCharsIndex[i] = old;
                    textIndex[i] = 0;
                    firstSamePos[i] = 99999;
                    invalidInfos[i] = new Array();
                }
                for(var i = 0; i < this._itemCount; i++) {
                    var item = this._items[i].toString();
                    if(prefix.GetLength() > 0 && item.Substring(0, prefix.GetLength()) !== prefix) {
                        continue;
                    }
                    while(textIndex[i] < text.GetLength()) {
                        if(sameCharsIndex[i] >= item.length) {
                            break;
                        }
                        var judgeInfo = this.JudgeIfValid(item, sameCharsIndex[i], text, textIndex[i]);
                        sameCharsIndex[i] = judgeInfo.index1;
                        textIndex[i] = judgeInfo.index2;
                        if(!judgeInfo.isValid) {
                            textIndex[i]++;
                        } else {
                            if(firstSamePos[i] === 99999) {
                                firstSamePos[i] = textIndex[i];
                            }
                        }
                    }
                }
                var itemIndex = 0;
                var sameCount = 0;
                var findOut = false;
                var maxPos = sameCharsIndex[itemIndex];
                for(var j = 0; j < this._itemCount; j++) {
                    var item = this._items[j].toString();
                    if(sameCharsIndex[j] === text.GetLength() + old && text.GetLength() === item.length) {
                        itemIndex = j;
                        maxPos = sameCharsIndex[itemIndex];
                        findOut = true;
                        break;
                    }
                    if(firstSamePos[j] === 99999) {
                        continue;
                    }
                    if(firstSamePos[itemIndex] >= firstSamePos[j]) {
                        if(firstSamePos[itemIndex] === firstSamePos[j]) {
                            var pos = sameCharsIndex[j];
                            if(maxPos < pos) {
                                itemIndex = j;
                                maxPos = pos;
                                sameCount = 1;
                            } else if(maxPos === pos) {
                                sameCount++;
                            }
                        } else {
                            itemIndex = j;
                            maxPos = sameCharsIndex[itemIndex];
                            sameCount = 1;
                        }
                    }
                }
                var existInvalid;
                if(findOut) {
                    if(textIndex[itemIndex] === 0) {
                        existInvalid = true;
                        retObj.existInvalid = true;
                        return retObj;
                    }
                    text = text.Substring(textIndex[itemIndex] + 1, text.GetLength());
                    start = this._items[itemIndex].toString().GetLength();
                    existInvalid = invalidInfos[itemIndex].Count === 0 ? false : true;
                    this._activeItem = itemIndex;
                    this.text = this._items[itemIndex].toString();
                    this._trueLength = this._items[itemIndex].toString().GetLength();
                    retObj.offset = start;
                    retObj.text = text;
                    retObj.existInvalid = existInvalid;
                    return retObj;
                } else {
                    if(maxPos === old)//start)
                     {
                        if(isLast === false && this._activeItem !== -1 && start === this._items[this._activeItem].toString().GetLength()) {
                            text = text.Substring(textIndex[itemIndex], text.GetLength());
                            existInvalid = false;
                            retObj.offset = start;
                            retObj.text = text;
                            return retObj;
                        } else {
                            existInvalid = true;
                            retObj.exception = true;
                            retObj.existInvalid = true;
                            return retObj;
                        }
                    }
                    var source = -1;
                    for(var i = 0; i < invalidInfos[itemIndex].Count; i++) {
                        source = 0;
                    }
                    if(sameCount === 1) {
                        start = this._items[itemIndex].toString().GetLength();
                    } else {
                        start = maxPos;
                    }
                    if(source === -1) {
                        text = text.Substring(textIndex[itemIndex], text.GetLength());
                        existInvalid = false;
                    } else {
                        text = text.Substring(textIndex[itemIndex], text.GetLength());
                        existInvalid = true;
                    }
                    this._activeItem = itemIndex;
                    this.text = this._items[itemIndex].toString();
                    this._trueLength = this._items[itemIndex].toString().GetLength();
                    retObj.offset = start;
                    retObj.text = text;
                    return retObj;
                }
            };
            EnumField.prototype.Replace = function (start, length, text, isLast) {
                return this.Insert(start, text, isLast);
            };
            EnumField.prototype.Delete = function (start, length) {
                if(length === 0 || start >= this.text.GetLength()) {
                    return start;
                }
                start = 0;
                this._activeItem = -1;
                this.text = "";
                if(this._minLength > 0) {
                    for(var i = 0; i < this._minLength; i++) {
                        this.text += this.GetPromptChar();
                    }
                }
                this._trueLength = 0;
                return start;
            };
            EnumField.prototype.SaveOldState = function () {
                this._lastActiveItem = this._activeItem;
                this.oldText = this.text;
            };
            EnumField.prototype.RollBack = function () {
                if(this.oldText === this.text) {
                    return;
                } else {
                    var tempItem = this._lastActiveItem;
                    this._activeItem = tempItem;
                    if(tempItem >= 0 && tempItem < this._itemCount) {
                        this.text = this._items[tempItem].toString();
                    } else {
                        this.text = "";
                        for(var i = 0; i < this._minLength; i++) {
                            this.text += this.GetPromptChar();
                        }
                    }
                    var plength = 0;
                    for(var i = this.text.GetLength(); i > 0; i--) {
                        if(this.text.Substring(i - 1, i) === this.GetPromptChar()) {
                            plength++;
                        } else {
                            break;
                        }
                    }
                    this._trueLength = this.text.GetLength() - plength;
                }
            };
            EnumField.prototype.SaveUndoState = function () {
                this.undoText = this.text;
                this.undoTempText = this.text;
                this._undoItem = this._activeItem;
            };
            EnumField.prototype.Undo = function () {
                if(this.undoTempText === this.text) {
                    return;
                } else {
                    this.undoTempText = this.text;
                    var tempItem = this._activeItem;
                    this._activeItem = this._undoItem;
                    this._undoItem = tempItem;
                    if(this._activeItem >= 0 && this._activeItem < this._itemCount) {
                        this.text = this._items[this._activeItem].toString();
                    } else {
                        this.text = "";
                        for(var i = 0; i < this._minLength; i++) {
                            this.text += this.GetPromptChar();
                        }
                    }
                    var plength = 0;
                    for(var i = this.text.GetLength(); i > 0; i--) {
                        if(this.text.Substring(i - 1, i) === this.GetPromptChar()) {
                            plength++;
                        } else {
                            break;
                        }
                    }
                    this._trueLength = this.text.GetLength() - plength;
                }
            };
            EnumField.prototype.SetTextInternal = function (text, start, isLast, validateText) {
                var i;
                var textIndex = new Array(this._itemCount);
                var itemPoss = new Array(this._itemCount);
                var existInvalids = new Array(this._itemCount);
                for(i = 0; i < this._itemCount; i++) {
                    textIndex[i] = 0;
                    itemPoss[i] = 0;
                    existInvalids[i] = false;
                }
                for(i = 0; i < this._itemCount; i++) {
                    var item = this._items[i].toString();
                    while(textIndex[i] < text.GetLength()) {
                        var judgeInfo = this.JudgeIfValid(item, itemPoss[i], text, textIndex[i]);
                        itemPoss[i] = judgeInfo.index1;
                        textIndex[i] = judgeInfo.index2;
                        if(!judgeInfo.isValid && isLast === true) {
                            existInvalids[i] = true;
                            break;
                        }
                        if(!judgeInfo.isValid && item.GetLength() === textIndex[i]) {
                            break;
                        }
                        if(!judgeInfo.isValid && item.GetLength() > textIndex[i]) {
                            existInvalids[i] = true;
                            break;
                        }
                        if(itemPoss[i].toString().GetLength() === item.GetLength() && textIndex[i].toString().GetLength() < text.GetLength() && isLast === true) {
                            existInvalids[i] = true;
                            break;
                        }
                        if(textIndex[i].toString().GetLength() === text.GetLength() && itemPoss[i].toString().GetLength() < item.GetLength()) {
                            existInvalids[i] = true;
                            break;
                        }
                    }
                }
                var itemIndex = this._itemCount;
                for(i = 0; i < this._itemCount; i++) {
                    if(existInvalids[i] === false) {
                        if(itemIndex === this._itemCount) {
                            itemIndex = i;
                        }
                        var item = this._items[i].toString();
                        if(item.GetLength() === this._maxLength && text.GetLength() >= this._maxLength) {
                            itemIndex = i;
                            break;
                        }
                    }
                }
                var k = itemIndex;
                var retObj = {
                };
                retObj.existInvalid = false;
                retObj.exception = false;
                if(k >= this._itemCount) {
                    var tempPrompt = "";
                    retObj.exception = true;
                    for(i = 0; i < this._minLength; i++) {
                        tempPrompt += this.GetPromptChar();
                    }
                    if(text.Substring(0, this._minLength) === tempPrompt) {
                        text = text.Substring(this._minLength, text.GetLength());
                        retObj.offset = this._minLength;
                        retObj.text = text;
                        retObj.existInvalid = false;
                        retObj.exception = true;
                        this.Clear();
                        return retObj;
                    } else {
                        retObj.text = text;
                        this.text = tempPrompt;
                        this._activeItem = -1;
                        retObj.existInvalid = true;
                        retObj.exception = true;
                        return retObj;
                    }
                } else {
                    this._activeItem = k;
                    this.text = this._items[k].toString();
                    this._trueLength = this._items[k].toString().GetLength();
                    retObj.offset = this._trueLength;
                    retObj.text = text.Substring(this._trueLength, text.GetLength());
                    return retObj;
                }
            };
            EnumField.prototype.PerformSpin = function (position, increment, wrap) {
                var count = this._itemCount;
                if(count < increment) {
                    if(count > 1) {
                        while(count < increment) {
                            increment -= count;
                        }
                    } else {
                        increment = 1;
                    }
                } else if(count < -increment) {
                    if(count > 1) {
                        while(count < -increment) {
                            increment += count;
                        }
                    } else {
                        increment = -1;
                    }
                }
                if(increment === 0) {
                    return position;
                }
                var currentIndex;
                if(this._activeItem === -1) {
                    currentIndex = increment > 0 ? 0 : count - 1;
                } else {
                    currentIndex = this._activeItem + increment;
                    if(currentIndex < 0 || currentIndex >= count) {
                        if(!wrap) {
                            currentIndex = increment > 0 ? count - 1 : 0;
                        } else {
                            currentIndex = increment > 0 ? currentIndex - count : currentIndex + count;
                            if(increment > 0 && currentIndex < this._activeItem) {
                                if(this._activeItem < count - 1) {
                                    currentIndex = count - 1;
                                } else {
                                    currentIndex = 0;
                                }
                            } else if(increment < 0 && currentIndex > this._activeItem) {
                                if(this._activeItem > 0) {
                                    currentIndex = 0;
                                } else {
                                    currentIndex = count - 1;
                                }
                            }
                        }
                    }
                }
                var newItemLen = this._items[currentIndex].toString().GetLength();
                position = Math.min(position, newItemLen);
                this._activeItem = currentIndex;
                this.text = this._items[currentIndex].toString();
                this._trueLength = this._activeItem === -1 ? 0 : this.text.GetLength();
                return position;
            };
            EnumField.prototype.Clear = function () {
                this._activeItem = -1;
            };
            EnumField.prototype.JudgeIfValid = function (str1, index1, str2, index2) {
                var charEx = input.CharProcess.CharEx;
                var retObj = {
                };
                retObj.index1 = index1;
                retObj.index2 = index2;
                retObj.isValid = false;
                if(index1 >= str1.GetLength()) {
                    return retObj;
                }
                if(str1.Substring(index1, index1 + 1) === str2.Substring(index2, index2 + 1)) {
                    index1++;
                    index2++;
                    retObj.index1 = index1;
                    retObj.index2 = index2;
                    retObj.isValid = true;
                    return retObj;
                } else {
                    if(this._owner.GetAutoConvert() === false) {
                        return retObj;
                    }
                    if(str2.Substring(index2, index2 + 1).charCodeAt(0) >= 0xFF41 && str2.Substring(index2, index2 + 1).charCodeAt(0) <= 0xFF5A) {
                        var dbcsUpper = String.fromCharCode(str2.Substring(index2, index2 + 1).charCodeAt(0) - 32);
                        if(dbcsUpper === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        var sbcsLower = charEx.ToHalfWidth(str2.Substring(index2, index2 + 1));
                        if(sbcsLower === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        var sbcsUpper = charEx.ToHalfWidth(dbcsUpper);
                        if(sbcsUpper === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        return retObj;
                    } else if(str2.Substring(index2, index2 + 1).charCodeAt(0) >= 0xFF21 && str2.Substring(index2, index2 + 1).charCodeAt(0) <= 0xFF3A) {
                        var dbcsLower = String.fromCharCode(str2.Substring(index2, index2 + 1).charCodeAt(0) - 32);
                        if(dbcsLower === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        var sbcsUpper = charEx.ToHalfWidth(str2.Substring(index2, index2 + 1));
                        if(sbcsUpper === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        var sbcsLower = charEx.ToHalfWidth(dbcsLower);
                        if(sbcsLower === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        return retObj;
                    } else if(charEx.IsUpper(str2.Substring(index2, index2 + 1))) {
                        var sbcsLower = str2.Substring(index2, index2 + 1).toLowerCase();
                        if(sbcsLower === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        var dbcsUpper = charEx.ToFullWidth(str2.Substring(index2, index2 + 1)).text;
                        if(dbcsUpper === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        var dbcsLower = charEx.ToFullWidth(sbcsLower).text;
                        if(dbcsLower === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        return retObj;
                    } else if(charEx.IsLower(str2.Substring(index2, index2 + 1))) {
                        var sbcsUpper = str2.Substring(index2, index2 + 1).toUpperCase();
                        if(sbcsUpper === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        var dbcsLower = charEx.ToFullWidth(str2.Substring(index2, index2 + 1)).text;
                        if(dbcsLower === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        var dbcsUpper = charEx.ToFullWidth(dbcsLower).text;
                        if(dbcsUpper === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        return retObj;
                    } else if(charEx.IsHiragana(str2.Substring(index2, index2 + 1))) {
                        var dbcsKatakana = charEx.ToKatakana(str2.Substring(index2, index2 + 1));
                        if(dbcsKatakana === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        var c1 = charEx.ToKatakana(dbcsKatakana);
                        var sbcsKatakanas = charEx.ToHalfWidthEx(c1);
                        if(sbcsKatakanas.length === 1 && sbcsKatakanas === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        } else if(sbcsKatakanas.length === 2 && sbcsKatakanas.Substring(0, 1) === str1.Substring(index1, index1 + 1) && index1 + 1 < str1.GetLength() && sbcsKatakanas.Substring(1, 2) === str1.Substring(index1 + 1, index1 + 2)) {
                            index1 += 2;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        return retObj;
                    } else if(charEx.IsKatakana(str2.Substring(index2, index2 + 1)) && charEx.IsFullWidth(str2.Substring(index2, index2 + 1))) {
                        var c1 = charEx.ToKatakana(str2.Substring(index2, index2 + 1));
                        var sbcsKatakanas = charEx.ToHalfWidthEx(c1);
                        if(sbcsKatakanas.length === 1 && sbcsKatakanas === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        } else if(sbcsKatakanas.length === 2 && sbcsKatakanas.Substring(0, 1) === str1.Substring(index1, index1 + 1) && index1 + 1 < str1.GetLength() && sbcsKatakanas.Substring(1, 2) === str1.Substring(index1 + 1, index1 + 2)) {
                            index1 += 2;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        var hiragana = charEx.ToHiragana(str2.Substring(index2, index2 + 1));
                        if(hiragana === '\u3094') {
                            return retObj;
                        }
                        if(hiragana === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        return retObj;
                    } else if(charEx.IsKatakana(str2.Substring(index2, index2 + 1)) && !charEx.IsFullWidth(str2.Substring(index2, index2 + 1))) {
                        var nextChar;
                        if(index2 + 1 < str2.GetLength() && charEx.IsKatakana(str2.Substring(index2 + 1, index2 + 2)) && !charEx.IsFullWidth(str2.Substring(index2 + 1, index2 + 2))) {
                            nextChar = str2.Substring(index2 + 1, index2 + 2);
                        } else {
                            nextChar = " ";
                        }
                        if(nextChar === " ") {
                            var dbcsKatakana = charEx.ToFullWidth(str2.Substring(index2, index2 + 1)).text;
                            if(dbcsKatakana === str1.Substring(index1, index1 + 1)) {
                                index1++;
                                index2++;
                                retObj.index1 = index1;
                                retObj.index2 = index2;
                                retObj.isValid = true;
                                return retObj;
                            }
                            var hiragana = charEx.ToHiragana(dbcsKatakana);
                            if(hiragana === '\u3094') {
                                return retObj;
                            }
                            if(hiragana === str1.Substring(index1, index1 + 1)) {
                                index1++;
                                index2++;
                                retObj.index1 = index1;
                                retObj.index2 = index2;
                                retObj.isValid = true;
                                return retObj;
                            }
                            return retObj;
                        } else {
                            var fullWidthRetObj = charEx.ToFullWidth(str2.Substring(index2, index2 + 2));
                            var dbcsKatakana = fullWidthRetObj.text;
                            var processedAll = fullWidthRetObj.processedAll;
                            if(dbcsKatakana === str1.Substring(index1, index1 + 1)) {
                                index1++;
                                if(processedAll) {
                                    index2 += 2;
                                } else {
                                    index2++;
                                }
                                retObj.index1 = index1;
                                retObj.index2 = index2;
                                retObj.isValid = true;
                                return retObj;
                            }
                            var hiragana = charEx.ToHiragana(dbcsKatakana);
                            if(hiragana === '\u3094') {
                                if(processedAll) {
                                    if(('\u3046' + '\u309B') === str1.Substring(index1, index1 + 2)) {
                                        index1 += 2;
                                        index2 += 2;
                                        retObj.index1 = index1;
                                        retObj.index2 = index2;
                                        retObj.isValid = true;
                                        return retObj;
                                    } else {
                                        return retObj;
                                    }
                                } else {
                                    return retObj;
                                }
                            }
                            if(hiragana === str1.Substring(index1, index1 + 1)) {
                                index1++;
                                if(processedAll) {
                                    index2 += 2;
                                } else {
                                    index2++;
                                }
                                retObj.index1 = index1;
                                retObj.index2 = index2;
                                retObj.isValid = true;
                                return retObj;
                            }
                            return retObj;
                        }
                    } else if(charEx.IsFullWidth(str2.Substring(index2, index2 + 1))) {
                        var half = charEx.ToHalfWidth(str2.Substring(index2, index2 + 1));
                        if(half === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        return retObj;
                    } else {
                        var full = charEx.ToFullWidth(str2.Substring(index2, index2 + 1)).text;
                        if(full === str1.Substring(index1, index1 + 1)) {
                            index1++;
                            index2++;
                            retObj.index1 = index1;
                            retObj.index2 = index2;
                            retObj.isValid = true;
                            return retObj;
                        }
                        return retObj;
                    }
                }
            };
            return EnumField;
        })(Field);        
        /** @ignore */
        var FieldCollection = (function () {
            function FieldCollection(count) {
                this.fieldArray = [];
                this.fieldCount = 0;
                this.fieldCount = count;
            }
            FieldCollection.prototype.GetLength = function () {
                var length = 0;
                for(var i = 0; i < this.fieldCount; i++) {
                    var field = this.GetFieldByIndex(i);
                    length += field.GetLength();
                }
                return length;
            };
            FieldCollection.prototype.Add = function (field) {
                if(field) {
                    this.fieldArray.push(field);
                }
            };
            FieldCollection.prototype.AddRange = function (fields) {
                if(!fields || fields.length === 0 || this.fieldCount !== fields.length) {
                    return;
                }
                var tempFields = new Array();
                for(var i = 0; i < fields.length; i++) {
                    tempFields[i] = fields[i];
                }
                this.fieldArray = tempFields;
            };
            FieldCollection.prototype.GetFieldByIndex = function (index) {
                return this.fieldArray[index];
            };
            FieldCollection.prototype.GetText = function () {
                var text = "";
                for(var i = 0; i < this.fieldCount; i++) {
                    text += this.GetFieldByIndex(i).GetText();
                }
                return text;
            };
            FieldCollection.prototype.GetFillingString = function (fillChar) {
                var fillString = "";
                for(var i = 0; i < this.fieldCount; i++) {
                    var field = this.fieldArray[i];
                    if(field.fieldLabel === "PromptField") {
                        fillString += field.GetText();
                    } else {
                        for(var j = 0; j < field._minLength; j++) {
                            fillString += fillChar;
                        }
                    }
                }
                return fillString;
            };
            FieldCollection.prototype.SetText = function (text, includePrompt) {
            };
            FieldCollection.prototype.Insert = function (start, text, includePrompt) {
            };
            FieldCollection.prototype.Replace = function (start, length, text, includePrompt) {
            };
            FieldCollection.prototype.Delete = function (start, length) {
            };
            FieldCollection.prototype.PerformSpin = function (position, increment, wrap) {
            };
            FieldCollection.prototype.GetFieldIndex = function (position, offset) {
                var fieldPos = {
                };
                var length = 0;
                for(var i = 0; i < this.fieldCount; i++) {
                    var field = this.fieldArray[i];
                    var fieldLength = field.GetLength();
                    if((position === length && fieldLength === 0) || (position >= length && position < length + fieldLength)) {
                        fieldPos.index = i;
                        fieldPos.offset = position - length;
                        return fieldPos;
                    }
                    length += fieldLength;
                }
                if(position >= length) {
                    var field = this.fieldArray[this.fieldCount - 1];
                    fieldPos.index = this.fieldCount - 1;
                    fieldPos.offset = field.GetLength();
                    return fieldPos;
                }
            };
            FieldCollection.prototype.GetFieldRange = function (fieldIndex) {
                var fieldRange = {
                };
                fieldRange.start = 0;
                fieldRange.length = 0;
                var length = 0;
                for(var i = 0; i < fieldIndex; i++) {
                    var field = this.GetFieldByIndex(i);
                    length += field.GetLength();
                }
                var currentField = this.GetFieldByIndex(fieldIndex);
                if(!currentField) {
                    return fieldRange;
                }
                fieldRange.start = length;
                fieldRange.length = currentField.GetLength();
                return fieldRange;
            };
            return FieldCollection;
        })();
        input.FieldCollection = FieldCollection;        
        /** @ignore */
        var BaseInputControl = (function () {
            function BaseInputControl() {
                this.KeyActionList = null;
                this.Text = "";
                this.Value = null;
                this.DroppedDown = false;
                this.SelectionLength = 0;
                this.SelectionStart = 0;
                this.SelectionEnd = 0;
                this.IsMouseDown = false;
                this.OldSelectionStart = 0;
                this.OldSelectionEnd = 0;
                this._acceptCrlf = input.CrLfMode.NoControl;
                this._clipContent = input.ClipContent.IncludeLiterals;
                this._editMode = input.EditMode.Insert;
                this.__editModeInternal = input.EditMode.Insert;
                // Frank Liu added for internal use.
                this._useClipboard = true;
                this._readOnly = false;
                this._autoPostBack = false;
                this._highlightText = input.HighlightText.None;
                this._exitOnLeftRightKey = input.ExitOnLeftRightKey.None;
                this.FocusType = input.FocusType.None;
                this.IsInUpdatePanelAndAsyncPostBack = false;
                this.NeedResetFocus = false;
                this.NeedReCalCursorPos = true;
                this.SpinBtnPressed = false;
                this.DropDownBtnPressed = false;
                this.OldValue = "";
                this.ValueBeforeUndo = "";
                this.FocusExit = false;
                this.Delay = 0;
                this.SpinOnKeys = true;
                this.Wrap = true;
                this.SpinEnabled = true;
                this.Increment = 1;
                this.Visible = false;
                this.MouseButton = input.MouseButton.Default;
                this.TouchDropDownScale = 1;
                this.UIUpdate = new input.InputUIUpdate(this);
                this.Format = {
                    Fields: null
                };
            }
            BaseInputControl.prototype.Snap = function () {
                var retObj = {
                    Text: this.Text,
                    Value: this.Value,
                    SelectionStart: this.SelectionStart,
                    SelectionEnd: this.SelectionEnd
                };
                return retObj;
            };
            BaseInputControl.prototype.Revert = function (snapPackage) {
                this.Text = snapPackage.Text;
                this.Value = snapPackage.Value;
                this.SelectionStart = snapPackage.SelectionStart;
                this.SelectionEnd = snapPackage.SelectionEnd;
            };
            BaseInputControl.prototype.ReLoadData = /**
            * ReLoad Data.
            */
            function () {
            };
            BaseInputControl.prototype.GetOverwrite = //end by Kevin.
            /**
            * Gets the Overwrite property which indicates whether edit mode of the input control is overwritable.
            * @returns {boolean}
            */
            function () {
                if(this.GetEditMode() === input.EditMode.FixedInsert || this.GetEditMode() === input.EditMode.FixedOverwrite) {
                    return this.GetEditMode() === input.EditMode.FixedOverwrite;
                } else {
                    return this._getEditModeInternal() !== input.EditMode.Insert && this._getEditModeInternal() !== input.EditMode.FixedInsert;
                }
            };
            BaseInputControl.prototype.GetImeMode = function () {
                return this.InputElement.style.imeMode || "auto";
            };
            BaseInputControl.prototype.SetImeMode = function (imeMode) {
                this.GetInputElement().style.imeMode = imeMode;
            };
            BaseInputControl.prototype.GetEnabled = function () {
                return this.GetInputElement().disabled;
            };
            BaseInputControl.prototype.SetEnabled = function (value) {
                if(value) {
                    $(this.GetInputElement()).removeAttr("diabled");
                } else {
                    $(this.GetInputElement()).attr("diabled", "true");
                }
            };
            BaseInputControl.prototype.SetFocus = function () {
                $(this.GetInputElement()).focus();
            };
            BaseInputControl.prototype.GetDroppedDown = /**
            * Gets whether the drop-down control is dropped down.
            * @returns {boolean}
            */
            function () {
                return this.DroppedDown;
            };
            BaseInputControl.prototype.GetSelectionStart = /**
            * Gets the start position of the selection.
            * @returns {number}
            */
            function () {
                return Math.min(this.SelectionStart, this.SelectionEnd);
            };
            BaseInputControl.prototype.SetSelectionStart = /**
            * Sets the start position of the selection.
            * @param {number} start
            */
            function (start) {
                start = input.Utility.CheckInt(start, 0, Math.pow(2, 31));
                start = Math.min(start, this.Text.GetLength());
                this.SetInnerSelectionStart(start);
                this.SetInnerSelectionEnd(start + this.SelectionLength);
                this.NeedReCalCursorPos = true;
            };
            BaseInputControl.prototype.GetSelectionLength = /**
            * Gets the length of the selection.
            * @returns {number}
            */
            function () {
                return Math.abs(this.SelectionEnd - this.SelectionStart);
            };
            BaseInputControl.prototype.SetSelectionLength = /**
            * Sets the length of the selection.
            * @param {number} length
            */
            function (length) {
                length = input.Utility.CheckInt(length, 0, Math.pow(2, 31));
                if(this.SelectionStart + length > this.Text.GetLength()) {
                    length = this.Text.GetLength() - this.SelectionStart;
                }
                this.SelectionLength = length;
                this.SetInnerSelectionEnd(this.SelectionStart + length);
                this.NeedReCalCursorPos = true;
            };
            BaseInputControl.prototype.SetInnerSelectionStart = /**
            * Sets the start position of the selection.
            */
            function (start) {
                this.SelectionStart = start;
            };
            BaseInputControl.prototype.SetInnerSelectionEnd = /**
            * Sets the length of the selection.
            */
            function (end) {
                this.SelectionEnd = end;
            };
            BaseInputControl.prototype.SetDroppedDown = /**
            * Sets whether the drop-down control is dropped down.
            * @param droppedDown
            */
            function (droppedDown) {
                if(!this.Enabled) {
                    return;
                }
                this.DroppedDown = droppedDown;
            };
            BaseInputControl.prototype.DoSpinUp = /**
            * Do SpinUp action.
            */
            function (field, increment) {
                if(increment == null) {
                    increment = this.Increment;
                }
                this.DoSpin("up", this.SelectionEnd, increment);
            };
            BaseInputControl.prototype.DoSpinDown = /**
            * Do SpinDown action.
            */
            function (field, increment) {
                if(increment == null) {
                    increment = this.Increment;
                }
                this.DoSpin("down", this.SelectionEnd, increment);
            };
            BaseInputControl.prototype.DoSpin = /**
            * Do SpinUp action.
            */
            function (type, cursorPos, increment) {
                if(type === "down") {
                    increment *= -1;
                }
                if((typeof cursorPos === "number" && isNaN(cursorPos)) || (typeof increment === "number" && isNaN(increment))) {
                    return;
                }
                var retInfo = this.UIProcess.PerformSpin(cursorPos, increment, this.Wrap);
                if(!retInfo) {
                    return;
                }
                if(typeof retInfo.SelectionStart === "number" && !isNaN(retInfo.SelectionStart)) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(typeof retInfo.SelectionEnd === "number" && !isNaN(retInfo.SelectionEnd)) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                }
                if(retInfo.Text != null) {
                    if(!this.UpdateText(retInfo)) {
                        return;
                    }
                }
                this.UpdateDisplayText(this.Text);
                if(type === "up") {
                    this.UIProcess.FireEvent(this, this.SpinUpEvent, null, "SpinUp");
                } else if(type === "down") {
                    this.UIProcess.FireEvent(this, this.SpinDownEvent, null, "SpinDown");
                }
            };
            BaseInputControl.prototype.GetExitOnLeftRightKey = /**
            * Gets whether the focus automatically moves to the next or previous
            * tab ordering control when pressing the left, right arrow keys.
            * @returns {ExitOnLeftRightKey} A {ExitOnLeftRightKey} enumeration
            * indicates whether the focus automatically moves to the next or previous tab ordering control when pressing the left, right arrow keys.
            */
            function () {
                return this._exitOnLeftRightKey;
            };
            BaseInputControl.prototype.SetExitOnLeftRightKey = /**
            * Sets whether the focus automatically moves to the next or previous
            * tab ordering control when pressing the left, right arrow keys.
            * @param {ExitOnLeftRightKey} value A {ExitOnLeftRightKey} enumeration
            * indicates whether the focus automatically moves to the next or previous tab ordering control when pressing the left, right arrow keys.
            */
            function (value) {
                this._exitOnLeftRightKey = value;
            };
            BaseInputControl.prototype.GetAcceptsCrlf = /**
            * Gets a value indicating how to process the CrLf chars when copy, cut or paste string.
            * @returns An enumeration indicates which mode that the CrLf chars will be used when copy, cut and paste string.<br/>
            * The default is <b>CrLfMode.NoControl</b>.
            */
            function () {
                return this._acceptCrlf;
            };
            BaseInputControl.prototype.SetAcceptsCrlf = /**
            * Sets a value indicating how to process the CrLf chars when copy, cut or paste string.
            * @param {CrLfMode} value An enumeration indicates which mode that the CrLf chars will be used when copy, cut and paste string.
            */
            function (value) {
                this._acceptCrlf = value;
            };
            BaseInputControl.prototype.SetInnerFocus = /**
            * Set Control to get focus.
            */
            function () {
                this.FocusType = input.FocusType.ClientEvent;
                this.UIUpdate.SetFocus();
                this.SetSelection(this.SelectionStart, this.SelectionEnd);
            };
            BaseInputControl.prototype.UpdateDisplayText = /**
            * Sets the display content of the control.(has no effect on FieldCollection)
            */
            function (text) {
                this.UIUpdate.SetText(text);
                //Add by Ryan Wu at 13:35 Nov. 23 2006.
                //For fix bug#6759.
                this.SetHideValue();
                //end by Ryan.
                            };
            BaseInputControl.prototype.SetHideText = /**
            * Sets the text to the hide textbox.
            */
            function (text) {
            };
            BaseInputControl.prototype.SetSelection = /**
            * Sets the selection according to the special start and end position.
            */
            function (start, end, setOnFocus) {
                if(start == null || end == null || isNaN(start) || isNaN(end)) {
                    return;
                }
                //var realStart = Utility.GetSelectionStartPosition(this.InputElement);
                //var realEnd = Utility.GetSelectionEndPosition(this.InputElement);
                //if (setOnFocus && this.SelectionStart === realStart && this.SelectionEnd === realEnd) {
                //    // DaryLuo 2012/10/16 fix bug 731, 723 in IM Web 7.0.
                //}
                //else
                 {
                    if(setOnFocus && input.Utility.IsIE10OrLater()) {
                        // DaryLuo 2012/11/12 fix bug 869 in IM Web 7.0.
                        var self = this;
                        setTimeout(function () {
                            input.Utility.SetSelection(self.InputElement, start, end);
                        }, 0);
                    } else {
                        input.Utility.SetSelection(this.InputElement, start, end);
                    }
                }
                this.SelectionStart = start;
                this.SelectionEnd = end;
                if(start === end) {
                    this.UIProcess.isMulSelected = false;
                }
            };
            BaseInputControl.prototype._getAutoPostBack = function () {
                return this._autoPostBack;
            };
            BaseInputControl.prototype._setAutoPostBack = function (value) {
                value = input.Utility.CheckBool(value);
                this._autoPostBack = value;
            };
            BaseInputControl.prototype.GetUseClipboard = /**
            * Gets whether copy, cut or paste the data to or from the clipboard when control are selected.
            * @returns {boolean}
            */
            function () {
                return this._useClipboard;
            };
            BaseInputControl.prototype.SetUseClipboard = /**
            * Sets whether copy, cut or paste the data to or from the clipboard when control are selected.
            * @param {boolean} value
            */
            function (value) {
                this._useClipboard = value;
            };
            BaseInputControl.prototype.GetClipContent = /**
            * Gets whether the ClipMode include the literals.
            * @returns An enumeration indicates whether the ClipMode include the literals.
            */
            function () {
                return this._clipContent;
            };
            BaseInputControl.prototype.SetClipContent = /**
            * Sets whether the ClipMode include the literals.
            * @param {ClipContent} value An enumeration indicates whether the ClipMode include the literals.
            */
            function (value) {
                this._clipContent = value;
            };
            BaseInputControl.prototype.GetTextHAlign = function () {
                return this.UIUpdate.GetTextHAlign();
            };
            BaseInputControl.prototype.SetTextHAlign = function (value) {
                this.UIUpdate.SetTextHAlign(value);
            };
            BaseInputControl.prototype.GetEditMode = /**
            * Gets the edit mode of the input control.
            * @returns {EditMode} A {EditMode} enumeration indicates the edit mode.
            */
            function () {
                return this._editMode;
            };
            BaseInputControl.prototype.SetEditMode = /**
            * Sets the edit mode of the input control.
            * @param {EditMode} value A {EditMode} enumeration indicates the edit mode.
            */
            function (value) {
                if(value !== this._editMode) {
                    var shouldFireEvent = false;// DaryLuo 2013/05/15 fix bug 378 in IM HTML5.
                    
                    if(this._isinsertGroup(value) && this._isOverwriteGroup(this._editMode)) {
                        shouldFireEvent = true;
                    } else if(this._isinsertGroup(this._editMode) && this._isOverwriteGroup(value)) {
                        shouldFireEvent = true;
                    }
                    this._editMode = value;
                    this.__editModeInternal = value;
                    if(shouldFireEvent) {
                        this.UIProcess.FireEvent(this, this.EditStatusChangedEvent, null, "EditStatusChanged");
                    }
                }
            };
            BaseInputControl.prototype._getEditModeInternal = function () {
                return this.__editModeInternal;
            };
            BaseInputControl.prototype._setEditModeInternal = function (value) {
                if(value !== this.__editModeInternal) {
                    var shouldFireEvent = false;// DaryLuo 2013/05/15 fix bug 378 in IM HTML5.
                    
                    if(this._isinsertGroup(value) && this._isOverwriteGroup(this.__editModeInternal)) {
                        shouldFireEvent = true;
                    } else if(this._isinsertGroup(this.__editModeInternal) && this._isOverwriteGroup(value)) {
                        shouldFireEvent = true;
                    }
                    this.__editModeInternal = value;
                    if(shouldFireEvent) {
                        this.UIProcess.FireEvent(this, this.EditStatusChangedEvent, null, "EditStatusChanged");
                    }
                }
            };
            BaseInputControl.prototype._isinsertGroup = function (editMode) {
                return editMode === input.EditMode.Insert || editMode === input.EditMode.FixedInsert;
            };
            BaseInputControl.prototype._isOverwriteGroup = function (editMode) {
                return editMode === input.EditMode.Overwrite || editMode === input.EditMode.FixedOverwrite;
            };
            BaseInputControl.prototype.GetHighlightText = /**
            * Gets how to select the text when the control receives the focus.
            * @returns {HighlightText}
            */
            function () {
                return this._highlightText;
            };
            BaseInputControl.prototype.SetHighlightText = /**
            * Sets how to select the text when the control receives the focus.
            * @param {HighlightText} value
            */
            function (value) {
                this._highlightText = value;
            };
            BaseInputControl.prototype.GetReadOnly = /**
            * Gets whether the text is read-only.
            * @returns {boolean}
            */
            function () {
                return this._readOnly;
            };
            BaseInputControl.prototype.SetReadOnly = /**
            * Sets whether the text is read-only.
            * @param {boolean} value
            */
            function (value) {
                this._readOnly = value;
            };
            BaseInputControl.prototype.GetTextboxValue = /**
            * Gets the display content of the control.
            */
            function () {
                return this.UIUpdate.GetText();
            };
            BaseInputControl.prototype.GetOldValue = /**
            * Gets the old value.
            */
            function () {
                return this.OldValue;
            };
            BaseInputControl.prototype.CanUndo = /**
            * Judge if the undo action can operate.
            */
            function () {
                if(this.GetValue() === this.GetOldValue()) {
                    return false;
                }
                return true;
            };
            BaseInputControl.prototype.GetValue = function () {
                return "";
            };
            BaseInputControl.prototype.DragStart = /**
            * Handle the ondragstart event.
            */
            function () {
                this.DragStartElementID = this.ID;
            };
            BaseInputControl.prototype.DragEnd = /**
            * Handle the ondragend event.
            */
            function (evt) {
                this.DragStartElementID = "";
                input.Utility.PreventDefault(evt);
                return false;
            };
            BaseInputControl.prototype.MouseOut = /**
            * Handle the mouseout event.
            */
            function () {
                if(this.IsMouseDown !== true) {
                    return;
                }
                if(this.MouseUpPointerType !== undefined && this.MouseUpPointerType !== 4 && this.MouseUpPointerType !== "mouse") {
                    // DaryLuo 2012/10/31 fix bug 817 in IM Web 7.0.
                    return;
                }
                var start = Math.min(this.OldSelectionStart, this.OldSelectionEnd);
                var end = Math.max(this.OldSelectionStart, this.OldSelectionEnd);
                var data = this.GetText().Substring(start, end);
                if(data !== "") {
                    this.SetSelection(this.OldSelectionStart, this.OldSelectionEnd);
                    input.Utility.DragDrop(this.InputElement);
                }
                this.IsMouseDown = false;
            };
            BaseInputControl.prototype.GetText = function () {
                return "";
            };
            BaseInputControl.prototype.Focus = ////////////////////////////////////////////////////////////////////////////
            //For Test
            /////////////////////////////////////////////////////////////////
            //UI Operation Methods
            /**
            * Handle the onfocus event.
            */
            function (data) {
                //Add comments by Ryan Wu at 14:38 Oct. 11 2007.
                //For fix the bug#8998.
                data.SelectionStart = this.SelectionStart;
                var retInfo = this.UIProcess.Focus(data);
                //end by Ryan Wu.
                //Add comments by Ryan Wu at 15:18 Jan. 16 2007.
                //For fix bug#6447.
                input.Utility.CurrentActiveControlId = this.ID;
                //end by Ryan Wu.
                if(!retInfo) {
                    return;
                }
                if(retInfo.Text != null) {
                    this.Text = retInfo.Text;
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                }
                // add by Sean Huang at 2008.11.06, for bug 10007 -->
                if(this.GetReadOnly() && this.FocusType === input.FocusType.None) {
                    this.SelectionStart = 0;
                    this.SelectionEnd = this.Text.length;
                }
                // end of Sean Huang <--
                this.UpdateDisplayText(this.Text);
                // DaryLuo 2012/11/08 fix bug 869 in IM Web 7.0.
                this.SetSelection(this.SelectionStart, this.SelectionEnd, true);
                return retInfo;
            };
            BaseInputControl.prototype.LoseFocus = /**
            * Handle the onblur event.
            */
            function (data) {
                // add by Sean Huang at 2008.10.30, for bug 9908 -->
                this.FireKeyExit();
                // end of Sean Huang <--
                if((this.SpinBtnPressed || this.DropDownBtnPressed || (this.DropDownObj && this.DropDownObj.IsMouseOver)) && this.FocusType !== input.FocusType.KeyExit) {
                    return;
                }
                if(this.DroppedDown) {
                    // add by Sean Huang at 2008.12.11 -->
                    this.DropDownBtnPressed = false;
                    // end of Sean Huang <--
                    //Add comments by Ryan Wu at 12:49 Apr. 21 2007.
                    //For fix the bug that When we click the dropdown date to close the dropdown,
                    //we should reset focus to the control.
                    //this.CloseDropDown();
                    this.CloseDropDown();
                    //end by Ryan Wu.
                                    }
                this.SetLastClientValues();
                return this.UIProcess.LoseFocus(data);
            };
            BaseInputControl.prototype.FireKeyExit = function () {
                // TODO:
                            };
            BaseInputControl.prototype.SetLastClientValues = function () {
                // TODO:
                            };
            BaseInputControl.prototype.MouseDown = /**
            * Handle the onmousedown event.
            */
            function (evt) {
                var mouseButton = input.Utility.GetMouseButton(evt);
                this.MouseButton = mouseButton;
                this.FocusType = input.FocusType.Click;
                this.OldSelectionStart = this.SelectionStart;
                this.OldSelectionEnd = this.SelectionEnd;
                this.IsMouseDown = true;
                // add by Sean Huang at 2008.12.05, for right-to-left selection -->
                this.MouseDownX = evt.x;
                // end of Sean Huang <--
                // End by Yang
                if(this.MouseButton === input.MouseButton.Left) {
                    // DaryLuo 2013/05/29 fix bug 523 in IM HTML5.0.
                    // Frank Liu fixed bug 598 at 2013/06/20.
                    if(input.Utility.IsIE() || input.Utility.firefox) {
                        input.Utility.ClearSelection(this.GetInputElement());
                    }
                }
                if(this.DroppedDown) {
                    this.CloseDropDown();
                }
                //When format is null or pattern is "", we use the date as a textbox.
                if(this.IsNullFormat()) {
                    return;
                }
                var retInfo = this.UIProcess.MouseDown(mouseButton);
                if(!retInfo) {
                    return;
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                }
            };
            BaseInputControl.prototype.GetInputElement = function () {
                return this.InputElement;
            };
            BaseInputControl.prototype.MouseUp = /**
            * Handle the onmouseup event.
            */
            function (evt) {
                // Frank Liu fixed bug 598 at 2013/06/08.
                //evt.preventDefault();
                this.IsMouseDown = false;
                // add by Sean Huang at 2008.12.05, for right-to-left selection -->
                this.MouseUpX = evt.x;
                // end of Sean Huang <--
                //When format is null or pattern is "", we use the date as a textbox.
                if(this.IsNullFormat()) {
                    //    return true;
                                    }
                var retInfo = this.UIProcess.MouseUp(this.InputElement, this.SelectionStart, this.SelectionEnd, this.MouseButton);
                if(!retInfo) {
                    return;
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                }
                // add by Sean Huang at 2008.12.05, for right-to-left selection -->
                if(input.Utility.GetMouseButton(evt) === input.MouseButton.Left && this.MouseDownX != null && this.MouseDownX > this.MouseUpX) {
                    var temp = this.SelectionStart;
                    this.SelectionStart = this.SelectionEnd;
                    this.SelectionEnd = temp;
                }
                this.MouseDownX = null;
                // end of Sean Huang <--
                this.MouseButton = input.MouseButton.Default;
            };
            BaseInputControl.prototype.MouseWheel = /**
            * Handle the onmousewheel event.
            */
            function (evt) {
                if(this.ImeMode === true) {
                    return false;
                }
                if(this.GetSpinEnabled()) {
                    var increment = input.Utility.GetMouseWheelValue(0, evt);
                    if(increment > 0) {
                        this.PerformSpin("up");
                    } else if(increment < 0) {
                        this.PerformSpin("down");
                    }
                    input.Utility.PreventDefault(evt);
                    return false;
                }
            };
            BaseInputControl.prototype.PreProcessContextMenu = /**
            * Pre process the contextmenu key before process control's keydown.
            */
            function (k) {
                //Add for contextmenu shortcut
                //if (this.ContextMenu.IsShow()) {
                //    //Up, Down, Entern, U(Undo), T(Cut), C(Copy), P(Paste), D(Delete), A(SelectAll)
                //    if (k === 38 || k === 40 || k === 13 || k === 85 || k === 84 || k === 67 || k === 80 || k === 68 || k === 65) {
                //        this.ContextMenu.KeyDown(k);
                //    }
                //    if (k === 27 || k === 18) {
                //        this.ContextMenu.Close();
                //    }
                //    return true;
                //}
                return false;
            };
            BaseInputControl.prototype.ProcessReservedKey = /**
            * Process the reserved key before process control's keydown.
            */
            function (k) {
                //IE reserved key
                switch(k) {
                    case //===============Ie Resoloved key, return==============================
                    //Reserve Keys
                    131138:
                        //CtrlB
                                            case 131140:
                        //CtrlD
                                            case 131141:
                        //CtrlE
                                            case 131144:
                        //CtrlH
                                            case 131145:
                        //CtrlI
                                            case 131148:
                        //CtrlL
                                            case 131150:
                        //CtrlN
                                            case 131154:
                        //CtrlR
                                            case 131159:
                        //CtrlW
                                            case 131188:
                        //CtrlF5
                                            case 262181:
                        //AltLeft
                                            case 262183:
                        //AltRight
                        //F1
                                            case 112:
                        //F3
                                            case 114:
                        //F4
                                            case 115:
                        //F5
                                            case 116:
                        //F6
                                            case 117:
                        //Add comments by Ryan Wu at 17:14 Jan. 15 2007.
                        //For fix bug#5788.
                        //		//F9
                        //		case 120:
                        //F10
                                            case 121:
                        //F11
                                            case 122:
                        //		//F12     DaryLuo 2012/09/12 fix bug 633 in IM Web 7.0.
                                            case 123:
                        //end by Ryan Wu.
                                            case 65657:
                        //ShiftF10
                                            case 131081:
                        //CtrlTab
                                            case 196617:
                        //ShiftCtrlTab
                        //Add comments by Ryan Wu at 16:40 Jan. 15 2007.
                        //For fix bug#7446.
                                            case 131179:
                        //CtrlPlus
                                            case 131181:
                        //CtrlMinus
                                            case 131120:
                        //CtrlD0
                                            case 131259:
                        //CtrlOemplus
                                            case 131261:
                        //CtrlOemMinus
                                            case 131146:
                        //CtrlJ
                                            case 196680:
                        //CtrlShiftH
                                            case 196681:
                        //CtrlShiftI
                                            case 196682:
                        //CtrlShiftJ
                                            case 131153:
                        //CtrlQ
                                            case 131156:
                        //CtrlT
                                            case 196689:
                        //CtrlShiftQ
                                            case 262157:
                        //AltEnter
                        //end by Ryan Wu.
                        return true;
                }
                return false;
            };
            BaseInputControl.prototype.IsNullFormat = /**
            * Judge whether the current format is null or not.
            */
            function () {
                return false;
            };
            BaseInputControl.prototype.SetHideValue = /**
            * Convert the current Value to the string.
            */
            function () {
                var hiddenText = "";
                if(this.GetValue() != null) {
                    hiddenText = this.GetValue().toString();
                }
                //Add comments by Ryan Wu at 10:25 Aug. 20 2007.
                //For now we will use other way to get the info whether javascript is disabled or not.
                //So we will not post the ";true" to the server side to tell the server that javascript is enabled.
                //this.SetHideText(hiddenText + ";" + true);
                this.SetHideText(hiddenText);
                //end by Ryan Wu.
                            };
            BaseInputControl.prototype.KeyDown = /**
            * Handle the onkeydown event.
            */
            function (data) {
                var retInfo = {
                };
                var funcKeysPressed = data.FuncKeysPressed;
                var k = data.KeyCode;
                //Pre process ContextMenu
                if(this.PreProcessContextMenu(k)) {
                    retInfo.System = false;
                    return retInfo;
                }
                if(k === 229) {
                    // DaryLuo Set IMeMode to true in the Composition start event.
                    //this.ImeMode = true;
                    retInfo.System = true;
                    return retInfo;
                }
                if(funcKeysPressed.Shift) {
                    k |= 65536;
                }
                if(funcKeysPressed.Ctrl) {
                    k |= 131072;
                }
                if(funcKeysPressed.Alt) {
                    //Press the Alt+AccessKey again.
                    if(this.AccessKey != null && this.AccessKey.toLowerCase() === String.fromCharCode(k).toLowerCase()) {
                        this.SelectionStart = 0;
                        this.SelectionEnd = this.Text.GetLength();
                        retInfo.System = true;
                        return retInfo;
                    }
                    k |= 262144;
                }
                //Process reserved key.
                if(this.ProcessReservedKey(k)) {
                    retInfo.System = true;
                    return retInfo;
                }
                // add by Sean Huang at 2008.12.03, for bug 762,786 -->
                // if the key is a shortcut, this functoin will be invoked again by the
                // shortcut extender. So just return it for the first invoking.
                var k1 = k | 524288;
                if(k !== k1) {
                    var keyAction1 = this.UIProcess.GetKeyActionName(k1, this.Shortcuts);
                    if(keyAction1 != null) {
                        // Add by Jiang at Dec. 24 2008
                        //for fix bug1371 TTP
                        var isblock = true;
                        var hasFound = false;
                        if(isblock) {
                            retInfo.System = false;
                            return retInfo;
                        }
                        //retInfo.System = false;
                        //return retInfo;
                        //End by Jiang
                                            }
                }
                // end of Sean Huang <--
                var keyAction = this.UIProcess.GetKeyActionName(k, this.Shortcuts);
                switch(keyAction) {
                    case "DropDown":
                        if(this.GetDropDownEnabled()) {
                            this.PerformDropDown();
                            retInfo.System = false;
                        }
                        return retInfo;
                    case "SpinUp":
                        if(this.GetSpinEnabled() && this.SpinOnKeys) {
                            this.PerformSpin("up");
                            retInfo.System = false;
                        }
                        return retInfo;
                    case "SpinDown":
                        if(this.GetSpinEnabled() && this.SpinOnKeys) {
                            this.PerformSpin("down");
                            retInfo.System = false;
                        }
                        return retInfo;
                }
                // Add by Jiang at Oct. 28 2008
                // for fixed bug10160
                var isBlockByShortcut = false;
                if(this.KeyActionList) {
                    for(var i = 0; i < this.KeyActionList.length; i++) {
                        if(this.KeyActionList[i] === k.toString()) {
                            isBlockByShortcut = true;
                            break;
                        }
                    }
                }
                // end by Jiang
                //act as calendar's keydown event
                //The current key is not a shortcut key and the key isn't Alt+Up, Alt+Down, F9, Escape, Tab, Shift+Tab.
                if(this.DroppedDown && this.DropDownObj && k != 262182 && k != 262184 && k != 27 && k != 118 && k != 9 && k != 65545) {
                    if(keyAction != null && this.DropDownObj.IsShortcut(k)) {
                        keyAction = null;
                    }
                    if(!keyAction) {
                        //Add by Ryan Wu at 11:02 Jan. 25 2006.
                        //For fix bug#4703.
                        //Right click key.(App)
                        if(k === 93) {
                            this.CloseDropDown();
                            return true;
                        }
                        //Add for Number
                        retInfo.System = false;
                        //
                        // Add by Jiang at Nov. 11 2008
                        // Fix bug10246
                        if(!isBlockByShortcut) {
                            // Frank Liu modified at 2013/06/19.
                            var _fakeEvtParam = {
                                keyCode: 0,
                                shiftKey: false,
                                ctrlKey: false,
                                altKey: false
                            };
                            _fakeEvtParam.keyCode = data.KeyCode;
                            _fakeEvtParam.shiftKey = funcKeysPressed.Shift;
                            _fakeEvtParam.ctrlKey = funcKeysPressed.Ctrl;
                            _fakeEvtParam.altKey = funcKeysPressed.Alt;
                            this.DropDownObj.KeyDown(_fakeEvtParam);
                            return retInfo;
                        }
                        //End by Jiang
                                            }
                }
                data.KeyAction = keyAction;
                data.KeyCode = k;
                var processInfo = this.UIProcess.KeyDown(data);
                if(!processInfo) {
                    //Because some shortcuts can be cleared, but up and down can't, so if the shortcuts string passed
                    //from server side is empty, if we press up or down key we must process the spin when SpinOnKeys is true.
                    switch(k) {
                        case //Escape
                        27:
                            if(this.DroppedDown) {
                                this.CloseDropDown();
                                this.SetInnerFocus();
                            }
                            retInfo.System = false;
                            return retInfo;
                            //Alt + Up
                                                    case 262182:
                            //Alt + Down
                                                    case 262184:
                            //	//F7 key
                            //   case 120:
                            if(!isBlockByShortcut) {
                                this.PerformDropDown();
                                retInfo.System = true;
                            }
                            return retInfo;
                            //Alt + BackSpace
                                                    case 262152:
                            retInfo.KeyCode = 10;
                            return retInfo;
                            //Up key
                                                    case 38:
                            if(!isBlockByShortcut) {
                                if(this.GetSpinEnabled() && this.SpinOnKeys) {
                                    this.PerformSpin("up");
                                }
                                // DaryLuo 2013/05/15 fix bug 379, Eat the up and down key.
                                retInfo.System = false;
                            }
                            return retInfo;
                            //Down key
                                                    case 40:
                            if(!isBlockByShortcut) {
                                if(this.GetSpinEnabled() && this.SpinOnKeys) {
                                    this.PerformSpin("down");
                                }
                                retInfo.System = false;
                            }
                            return retInfo;
                            //We must handle the Enter key first.
                                                    case 13:
                            retInfo.System = true;
                            return retInfo;
                    }
                    //There isn't format or press Caps, ctrl, alt key, window key, NumLock key, ScrollLock key, Right click key, Right window key.
                    if(this.IsNullFormat() || k === 20 || funcKeysPressed && (funcKeysPressed.Ctrl || funcKeysPressed.Alt) || k === 91 || k === 144 || k === 145 || k === 93 || k === 92) {
                        retInfo.System = true;
                        return retInfo;
                    }
                    //There is format and the shiftKey is pressed. Fix the bug#3789.
                    if(funcKeysPressed && funcKeysPressed.Shift) {
                        //The current key is shift.
                        if(k === 65552) {
                            retInfo.System = true;
                            return retInfo;
                        }
                    }
                    //Judge whether the current object is a NumberControl instance, if true then return directly,
                    //otherwise fire InvalidInput event.
                    if(this.Type === "Number") {
                        //Add by Michelle Fang 2005.12.28 for Number
                        retInfo.System = true;
                        return retInfo;
                    }
                    // Add by Jiang at Dec. 29 2008
                    //for fix bug1371 TTP, F2 F7 F8
                    //Add comments by Ryan Wu at 21:54 Jan. 23 2007.
                    //For fix bug#7647.
                    //F9 F12
                    //if (k === 120 || k === 123)
                    if(k === 120 || k === 123 || k === 113 || k === 118 || k === 119) {
                        return retInfo;
                    }
                    //end by Ryan Wu.
                    //End by Jiang
                    //Add comments by Ryan Wu at 9:45 Apr. 5 2007.
                    //For support Aspnet Ajax 1.0.
                    //var focusType = this.UIProcess.FireEvent(this, this.ClientEvents.SpecialClientEvents.InvalidInput, null);
                    var focusType = this.UIProcess.FireEvent(this, this.InvalidInputEvent, null, "InvalidInput");
                    //end by Ryan Wu.
                    if(focusType != null) {
                        this.FocusType = focusType;
                    }
                    return retInfo;
                }
                if(processInfo.Overwrite != null) {
                    if(this.GetOverwrite() !== processInfo.Overwrite) {
                        if(this._getEditModeInternal() === input.EditMode.Insert) {
                            this._setEditModeInternal(input.EditMode.Overwrite);
                        } else if(this._getEditModeInternal() === input.EditMode.Overwrite) {
                            this._setEditModeInternal(input.EditMode.Insert);
                        }
                    }
                }
                if(processInfo.Text != null) {
                    //this.SetText(processInfo.Text);
                    //updatetext before set position, Kevin, 2006-11-30
                    //commented by Kevin, Jun 7, 2007
                    //bug#8388
                    //if (!this.UpdateText(processInfo.Text))
                    if(!this.UpdateText(processInfo))//end by Kevin
                     {
                        retInfo.System = false;
                        return retInfo;
                    }
                }
                // add by Sean Huang at 2009.01.06, for bug 1454 -->
                var oldLength = this.GetSelectionLength();
                // end of Sean Huang <--
                if(processInfo.SelectionStart != null) {
                    this.SelectionStart = processInfo.SelectionStart;
                }
                if(processInfo.SelectionEnd != null) {
                    this.SelectionEnd = processInfo.SelectionEnd;
                }
                // add by Sean Huang at 2009.01.06, for bug 1454 -->
                var newLength = this.GetSelectionLength();
                // end of Sean Huang <--
                //Add comments by Ryan Wu at 11:17 Aug. 28 2007.
                //For the sequence of the onfocus, onblur, onkeydown event in firefox is not same as IE
                //when we use the focus method in keydown.
                //in IE: onkeydown --> onblur --> onfocus.
                //in Firefox: onblur --> onfocus --> onkeydown.
                //	//Add comments by Ryan Wu at 16:26 May. 18 2007.
                //	//For fix the bug#8162.
                ////	if (!processInfo.System && !processInfo.FocusExit)
                ////	{
                ////		this.UpdateDisplayText(this.Text);
                ////		this.SetSelection(this.SelectionStart, this.SelectionEnd);
                ////	}
                //    if (!processInfo.System)
                //	{
                //		this.UpdateDisplayText(this.Text);
                //
                //		if (!processInfo.FocusExit)
                //		{
                //		    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                //		}
                //	}
                //	//end by Ryan Wu at 16:26 May. 18 2007.
                if(!processInfo.System) {
                    if(processInfo.FocusExit) {
                        this.SetHideValue();
                        //Add comments by Ryan Wu at 16:32 Aug. 28 2007.
                        //For in number if we don't set the processInfo.System, the return value of the KeyDown of the Number control will
                        //return true(because DecimalPoint maybe be not a '.', it can be any input char). So if the key invoke the focus exit,
                        //we should return false to prevent the onkeypress event.
                        processInfo.System = false;
                        //end by Ryan Wu.
                                            } else {
                        this.UpdateDisplayText(this.Text);
                        // add by Sean Huang at 2009.01.06, for bug 1454 -->
                        if(oldLength === 0 && newLength !== 0) {
                            input.Utility.ShouldFireOnSelectStart = true;
                        } else {
                            input.Utility.ShouldFireOnSelectStart = false;
                        }
                        // end of Sean Huang <--
                        this.SetSelection(this.SelectionStart, this.SelectionEnd);
                        // add by Sean Huang at 2009.01.06, for bug 1454 -->
                        input.Utility.ShouldFireOnSelectStart = false;
                        // end of Sean Huang <--
                        //Add comments by Ryan Wu at 17:10 Sep. 24 2007.
                        //For fix the bug#8923.
                        //Only For number bug.
                        processInfo.HasSetSelection = true;
                        //end by Ryan Wu.
                                            }
                }
                //end by Ryan Wu at 11:17 Aug. 28 2007.
                //del the code by wuhao 2008-8-11 for fix bug 419
                //	if (processInfo.FocusType != null)
                //	{
                //		this.FocusType = processInfo.FocusType;
                //	}
                //end by wuhao for fix bug 419
                if(processInfo.EventInfo) {
                    // change by Sean Huang at 2008.10.30, for bug 9908 -->
                    // ->
                    ////Add comments by Ryan Wu at 11:57 Apr. 5 2007.
                    ////For support Aspnet Ajax 1.0.
                    ////var focusType = this.UIProcess.FireEvent(this, processInfo.EventInfo.Name, processInfo.EventInfo.Args);
                    //var focusType = this.UIProcess.FireEvent(this, processInfo.EventInfo.Name, processInfo.EventInfo.Args, processInfo.EventInfo.Type);
                    ////end by Ryan Wu.
                    //
                    //if (focusType != null)
                    //{
                    //	this.FocusType = focusType;
                    //}
                    //<-
                    if(processInfo.EventInfo.Type === "KeyExit") {
                        this.EventInfo = processInfo.EventInfo;
                    } else {
                        //Add comments by Ryan Wu at 11:57 Apr. 5 2007.
                        //For support Aspnet Ajax 1.0.
                        //var focusType = this.UIProcess.FireEvent(this, processInfo.EventInfo.Name, processInfo.EventInfo.Args);
                        var focusType = this.UIProcess.FireEvent(this, processInfo.EventInfo.Name, processInfo.EventInfo.Args, processInfo.EventInfo.Type);
                        //end by Ryan Wu.
                        if(focusType != null) {
                            this.FocusType = focusType;
                        }
                    }
                    // end of Sean Huang <--
                                    }
                //del the code by wuhao 2008-8-11 for fix bug 419
                if(processInfo.FocusType != null) {
                    this.FocusType = processInfo.FocusType;
                }
                //end by wuhao for fix bug 419
                //For Number
                retInfo = processInfo;
                retInfo.KeyAction = keyAction;
                return retInfo;
            };
            BaseInputControl.prototype.GetImeInputText = function (actionType) {
                var newValue = this.GetTextboxValue();
                if(newValue === this.Text) {
                    return "";
                }
                var imeInputText;
                //Now get the input ime text;
                if(this.Text !== "") {
                    var start = Math.min(this.SelectionStart, this.SelectionEnd);
                    var end = Math.max(this.SelectionStart, this.SelectionEnd);
                    if(end < this.Text.GetLength()) {
                        var lastText = this.Text.Substring(end, this.GetText().GetLength());
                        var textIndex = newValue.IndexOf(lastText);
                        if(textIndex !== -1) {
                            //imeInputText = newValue.Substring(start, textIndex);
                            imeInputText = newValue.Substring(start, newValue.GetLength() - lastText.GetLength());
                        } else {
                            imeInputText = "";
                        }
                    } else {
                        imeInputText = newValue.Substring(start, newValue.GetLength());
                    }
                } else {
                    imeInputText = newValue;
                }
                //Discard the new input character.
                if(actionType === "ReInput") {
                    imeInputText = imeInputText.Substring(0, imeInputText.GetLength());
                }
                if(actionType === "Record") {
                    return imeInputText;
                }
                if(actionType === "LoseFocusInput") {
                    if(imeInputText === "") {
                        return "";
                    }
                }
                this.ImeMode = false;
                this.ImeSelect = false;
                //We can not control ime start and end,so if there are two times ime operation
                //in the same input case. We should check all the characters and close ime.
                if(actionType === "ReInput" || actionType === "ClickInput") {
                    this.FocusType = input.FocusType.ImeInput;
                    this.InputElement.blur();
                    this.InputElement.focus();
                }
                return imeInputText;
            };
            BaseInputControl.prototype.KeyUp = /**
            * Handle the onkeyup event.
            */
            function (k) {
            };
            BaseInputControl.prototype.GetVisible = function () {
                return true;
            };
            BaseInputControl.prototype.PerformDropDown = /**
            * Handle the Dropdown action.
            */
            function () {
                // Frank Liu fixed bug 738 at 2013/06/17.
                if(!this.Enabled || !this.GetDropDownEnabled()) {
                    return;
                }
                //Add comments by Ryan Wu at 19:39 May. 28 2007.
                //For fix the bug#8147.
                if(!this.GetVisible()) {
                    return;
                }
                //end by Ryan Wu.
                // TODO:
                //// Frank Liu fixed bug 1127 at 2013/07/22.
                //if (this.GetContainer().offsetWidth === 0 && this.GetContainer().offsetHeight === 0) {
                //    return;
                //}
                if(!this.DroppedDown) {
                    if(this.DropDownObj) {
                        if(this.DropDownObj.GetDropDownContainer !== undefined) {
                            var dropDownContainer = this.DropDownObj.GetDropDownContainer();
                            if(input.Utility.IsTouchMouseDown) {
                                input.Utility.SetZoomStyle(dropDownContainer, this.TouchDropDownScale, this.DropDownObj.GetAlign());
                            } else {
                                input.Utility.SetZoomStyle(dropDownContainer, "");
                            }
                        }
                    }
                    this.ShowDropDown();
                } else {
                    this.CloseDropDown();
                }
            };
            BaseInputControl.prototype.DropDownBtnMouseDown = /**
            * Handle the Dropdown button onmousedown event.
            */
            function (mouseButton) {
                this.DropDownBtnPressed = true;
                if(mouseButton !== input.MouseButton.Left && mouseButton != null) {
                    return;
                }
                this.PerformDropDown();
                //Add comments by Ryan Wu at 11:42 Jul. 28 2006.
                //For fix bug#5782.
                this.SetInnerFocus();
                //end by Ryan Wu.
                //Add comments by Ryan Wu at 10:05 Oct. 11 2007.
                //For fix the bug#8899.
                if(this.DroppedDown) {
                    //this.ResetLocationHandler = new Function("FindIMControl(\"" + this.ID + "\").ResetLocation()");
                    this.ResetLocation();
                }
                //end by Ryan Wu.
                            };
            BaseInputControl.prototype.DropDownBtnMouseUp = /**
            * Handle the Dropdown button onmouseup event.
            */
            function () {
                this.DropDownBtnPressed = false;
                //Add comments by Ryan Wu at 11:42 Jul. 28 2006.
                //For fix bug#5782.
                this.SetInnerFocus();
                //end by Ryan Wu.
                //Add comments by Ryan Wu at 10:05 Oct. 11 2007.
                //For fix the bug#8899.
                //For move the following action to the document.onmouseup event.
                //	//Add by Ryan Wu at Dec 15, 2005. To fix bug#4684
                //	//Only date and number have such bug.
                //	this.ResetLocation();
                //	//end by Ryan Wu at Dec 15, 2005.
                //end by Ryan Wu at 10:05 Oct. 11 2007.
                            };
            BaseInputControl.prototype.ResetLocation = /**
            * Handle the Dropdown button onmouseup event.
            */
            function () {
            };
            BaseInputControl.prototype.DropDownBtnMouseOut = /**
            * Handle the Dropdown button onmouseup event.
            */
            function () {
                if(this.DropDownBtnPressed) {
                    this.SetInnerFocus();
                    this.DropDownBtnPressed = false;
                }
            };
            BaseInputControl.prototype.ShowDropDown = /**
            * Show the dropdown calendar.
            */
            function (styles) {
                if(styles != null) {
                    this.UIUpdate.WriteCssStyle(styles);
                }
            };
            BaseInputControl.prototype.CloseDropDown = /**
            * Close the dropdown calendar.
            */
            function () {
                this.DroppedDown = false;
                this.DropDownObj.Close();
                this.UIUpdate.ClearCssStyle();
                //Fire DropDownClose event
                //Add comments by Ryan Wu at 9:46 Apr. 5 2007.
                //For support Aspnet Ajax 1.0.
                //var focusType = this.UIProcess.FireEvent(this, this.ClientEvents.SpecialClientEvents.DropDownClose, null);
                var focusType = this.UIProcess.FireEvent(this, this.DropDownCloseEvent, null, "DropDownClose");
                //end by Ryan Wu.
                if(focusType != null) {
                    this.FocusType = focusType;
                }
            };
            BaseInputControl.prototype.PerformSpin = /**
            * Perform the spin action.
            */
            function (type) {
                //    //Add by Jiang Changcheng at Feb. 10 2009
                //    //For fixed bug1705 TTP
                //    if (!Utility.LoadComplete)
                //    {
                //        return;
                //    }
                //    //End by Jiang
                var increment = this.Increment;
                //When format is null or pattern is "", we use the date as a textbox.
                if(this.IsNullFormat()) {
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                } else if(this.GetReadOnly()) {
                    //Add by Ryan Wu at 13:07 Jan. 20 2006.
                    //For fix bug#4688.
                    //return;
                                    } else {
                    if(type === "down") {
                        increment *= -1;
                    }
                    var retInfo = this.UIProcess.PerformSpin(this.SelectionEnd, increment, this.Wrap);
                    if(!retInfo) {
                        return;
                    }
                    if(retInfo.Text != null) {
                        if(!this.UpdateText(retInfo)) {
                            return;
                        }
                    }
                    if(retInfo.SelectionStart != null) {
                        this.SelectionStart = retInfo.SelectionStart;
                        this.SelectionEnd = retInfo.SelectionStart;
                    }
                    this.UpdateDisplayText(this.Text);
                    this.SetInnerFocus();
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                }
                var focusType = input.FocusType.ClientEvent;
                if(type === "up") {
                    focusType = this.UIProcess.FireEvent(this, this.SpinUpEvent, null, "SpinUp");
                } else if(type === "down") {
                    focusType = this.UIProcess.FireEvent(this, this.SpinDownEvent, null, "SpinDown");
                }
                if(focusType != null) {
                    this.FocusType = focusType;
                }
            };
            BaseInputControl.prototype.SpinBtnMouseDown = /**
            * Handle the Spin button onmousedown event.
            */
            function (mouseButton, type) {
                this.SpinBtnPressed = true;
                if(this.DroppedDown) {
                    this.CloseDropDown();
                    //Add comments by Ryan Wu at 17:18 Dec. 22 2006.
                    //For fix bug#7142.
                    this.SetInnerFocus();
                    //end by Ryan Wu.
                    return;
                }
                if(mouseButton != input.MouseButton.Left && mouseButton != null) {
                    return;
                }
                var stringType = type === true ? "up" : "down";
                this.PerformSpin(stringType);
                //Add comments by Ryan Wu at 10:59 Nov. 6 2006.
                //For fix bug#6190.
                this.SetInnerFocus();
                //end by Ryan Wu.
                //Add comments by Ryan Wu at 16:12 Apr. 21 2007.
                //For support Aspnet Ajax 1.0.
                //For fix the bug that Spin can not stop when release mouse after keep to click SpinDown and SpinUp a moment.
                //set timer. if we press button continuously, we must invoke the SpinBtnMouseDown.
                //	if (this.Timer == null)
                //	{
                //		this.Timer = setInterval("o" + this.ID + "IMControl.PerformSpin('" + type + "')", this.Spin.Delay);
                //	}
                if(input.Utility.SpinTimer == null) {
                    var self = this;
                    input.Utility.SpinTimer = setInterval(function () {
                        self.PerformSpin(stringType);
                    }, this._getRealSpinDelay());
                }
                //end by Ryan Wu.
                            };
            BaseInputControl.prototype._getRealSpinDelay = function () {
                return this.Delay === 0 ? 150 : this.Delay;
            };
            BaseInputControl.prototype.SpinBtnMouseUp = /**
            * Handle the Spin button onmouseup event.
            */
            function () {
                if(this.SpinBtnPressed) {
                    this.SetInnerFocus();
                    this.SpinBtnPressed = false;
                }
                if(input.Utility.SpinTimer != null) {
                    clearInterval(input.Utility.SpinTimer);
                    input.Utility.SpinTimer = null;
                }
                //end by Ryan Wu.
                            };
            BaseInputControl.prototype.SelectStart = /**
            * Handle the onselectstart event.
            */
            function (selText) {
                //When format is null or pattern is "", we use the date as a textbox.
                if(this.IsNullFormat()) {
                    return true;
                }
                var retInfo = this.UIProcess.SelectStart(this.InputElement, selText, this.MouseButton);
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(retInfo.SetFalse != null) {
                    return retInfo.SetFalse;
                }
            };
            BaseInputControl.prototype.DoubleClick = /**
            * Handle the ondblclick event.
            */
            function () {
                //When format is null or pattern is "", we use the date as a textbox.
                if(this.IsNullFormat()) {
                    return true;
                }
                var retInfo = this.UIProcess.DoubleClick(this.SelectionStart);
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                }
            };
            BaseInputControl.prototype.Undo = /**
            * Handle the undo event.
            */
            function () {
                if(this.GetReadOnly()) {
                    return;
                }
                var retInfo = this.UIProcess.Undo();
                if(!retInfo) {
                    return;
                }
                if(retInfo.Text != null) {
                    //this.SetText(retInfo.Text);
                    //this.Text = retInfo.Text;
                    //commented by Kevin, Jun 7, 2007
                    //bug#8388
                    //if (!this.UpdateText(retInfo.Text))
                    if(!this.UpdateText(retInfo))//end by Kevin
                     {
                        return;
                    }
                    this.UpdateDisplayText(this.Text);
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                }
            };
            BaseInputControl.prototype.Cut = /**
            * Handle the cut actions.
            */
            function () {
                if(this.GetReadOnly()) {
                    return;
                }
                var retInfo = this.UIProcess.Cut(this.GetClipContent(), this.SelectionStart, this.SelectionEnd);
                if(!retInfo) {
                    return;
                }
                if(retInfo.Text != null) {
                    //this.SetText(retInfo.Text);
                    //this.Text = retInfo.Text;
                    //commented by Kevin, Jun 7, 2007
                    //bug#8388
                    //if (!this.UpdateText(retInfo.Text))
                    if(!this.UpdateText(retInfo))//end by Kevin
                     {
                        return;
                    }
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                }
                if(retInfo.Text != null) {
                    this.UpdateDisplayText(this.Text);
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                }
                // Frank Liu fixed bug 646 at 2013/06/14.
                if(retInfo.Color !== null) {
                    this.UIUpdate.SetForeColor(retInfo.Color);
                }
            };
            BaseInputControl.prototype.Copy = /**
            * Handle the oncopy event.
            */
            function () {
                this.UIProcess.Copy(this.GetClipContent(), this.SelectionStart, this.SelectionEnd);
            };
            BaseInputControl.prototype.Paste = /**
            * Handle the onpaste event.
            */
            function (text) {
                if(this.GetReadOnly()) {
                    return false;
                }
                if(this.IsNullFormat()) {
                    return false;
                }
                var pasteData = input.Utility.GetPasteData(this.GetUseClipboard());
                if(text) {
                    pasteData = text;
                }
                var retInfo = this.UIProcess.Paste(this.SelectionStart, this.SelectionEnd, pasteData);
                if(!retInfo) {
                    return false;
                }
                if(retInfo.Text != null) {
                    //this.SetText(retInfo.Text);
                    //this.Text = retInfo.Text;
                    //commented by Kevin, Jun 7, 2007
                    //bug#8388
                    //if (!this.UpdateText(retInfo.Text))
                    if(!this.UpdateText(retInfo))//end by Kevin
                     {
                        return false;
                    }
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                }
                this.UpdateDisplayText(this.Text);
                this.SetSelection(this.SelectionStart, this.SelectionEnd);
                if(retInfo.EventInfo != null) {
                    //Add comments by Ryan Wu at 13:03 Apr. 5 2007.
                    //For support Aspnet Ajax 1.0.
                    //this.UIProcess.FireEvent(this, retInfo.EventInfo.Name, retInfo.EventInfo.Args);
                    this.UIProcess.FireEvent(this, retInfo.EventInfo.Name, retInfo.EventInfo.Args, retInfo.EventInfo.Type);
                    //end by Ryan Wu.
                                    }
                if(retInfo.FocusExit != null) {
                    this.FocusExit = retInfo.FocusExit;
                }
                return true;
            };
            BaseInputControl.prototype.Delete = /**
            * Delete the selected content.
            */
            function () {
                if(this.GetReadOnly()) {
                    return;
                }
                var retInfo = this.UIProcess.ProcessDelete(this.SelectionStart, this.SelectionEnd);
                if(!retInfo) {
                    return;
                }
                if(retInfo.Text != null) {
                    //this.SetText(retInfo.Text);
                    //this.Text = retInfo.Text;
                    //commented by Kevin, Jun 7, 2007
                    //bug#8388
                    //if (!this.UpdateText(retInfo.Text))
                    if(!this.UpdateText(retInfo))//end by Kevin
                     {
                        return;
                    }
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                }
                if(retInfo.Text != null) {
                    this.UpdateDisplayText(this.Text);
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                    this.DoDeleteExtraWork();
                }
            };
            BaseInputControl.prototype.DoDeleteExtraWork = function () {
            };
            BaseInputControl.prototype.SelectAll = /**
            * Select all the content.
            */
            function () {
                var retInfo = this.UIProcess.SelectAll();
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                }
                this.SetSelection(this.SelectionStart, this.SelectionEnd);
                //Add comments by Ryan Wu at 9:23 Oct. 18 2007.
                //For fix the bug#9065.
                this.FocusType = input.FocusType.ContextMenu;
                //end by Ryan Wu.
                            };
            BaseInputControl.prototype.DragDrop = /**
            * Handle the ondrop event.
            */
            function (text) {
                // add by Sean Huang at 2008.11.06, for bug 10298 -->
                if(!input.Utility.IsIE() && this.GetReadOnly()) {
                    return false;
                }
                // end of Sean Huang <--
                if(this.DragStartElementID === this.ID) {
                    this.DragStartElementID = "";
                    // TODO:
                    //Utility.PreventDefault(evt);
                    return false;
                }
                var retInfo = this.UIProcess.Paste(0, 0, text);
                if(!retInfo) {
                    return;
                }
                if(retInfo.Text != null) {
                    //this.SetText(retInfo.Text);
                    //this.Text = retInfo.Text;
                    //commented by Kevin, Jun 7, 2007
                    //bug#8388
                    //if (!this.UpdateText(retInfo.Text))
                    if(!this.UpdateText(retInfo))//end by Kevin
                     {
                        return;
                    }
                    //Add comments by Ryan Wu at 11:34 Aug. 15 2007.
                    //For firefox doesn't support drag drop action event, we must
                    //imitate it.
                    if(!input.Utility.IsIE()) {
                        //this.UpdateDisplayText(this.Text);
                        this.SetInnerFocus();
                    }
                    //end by Ryan Wu.
                                    }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                }
                this.SetSelection(this.SelectionStart, this.SelectionEnd);
                if(retInfo.EventInfo != null) {
                    //Add comments by Ryan Wu at 13:03 Apr. 5 2007.
                    //For support Aspnet Ajax 1.0.
                    //this.UIProcess.FireEvent(this, retInfo.EventInfo.Name, retInfo.EventInfo.Args);
                    this.UIProcess.FireEvent(this, retInfo.EventInfo.Name, retInfo.EventInfo.Args, retInfo.EventInfo.Type);
                    //end by Ryan Wu.
                                    }
            };
            BaseInputControl.prototype.SetInnerText = //For AutoTest
            //Add by Ryan Wu at 16:40 Nov.24 2005.
            function (text) {
                this.SetText(text);
            };
            BaseInputControl.prototype.SetText = function (text) {
            };
            BaseInputControl.prototype.GetInnerText = function () {
                return this.Text;
            };
            BaseInputControl.prototype.UpdateText = function (retInfo) {
                if(retInfo != null && retInfo.Text != null) {
                    this.Text = retInfo.Text;
                }
                return true;
            };
            BaseInputControl.prototype.RollBack = //end by Kevin
            /**
            * rollback inner text.
            */
            function () {
            };
            BaseInputControl.prototype.AddAllEventsHandler = function () {
                var self = this;
                var inputElement = this.GetInputElement();
                if(inputElement != null) {
                    $(inputElement).bind("mousedown.wijinput", function (evt) {
                        input.GlobalEventHandler.OnMouseDown(self, evt);
                    });
                    $(inputElement).bind("mouseup.wijinput", function (evt) {
                        input.GlobalEventHandler.OnMouseUp(self, evt);
                    });
                    $(inputElement).bind("selectstart.wijinput", function (evt) {
                        input.GlobalEventHandler.OnSelectStart(self, evt);
                    });
                    $(inputElement).bind("keydown.wijinput", function (evt) {
                        input.GlobalEventHandler.OnKeyDown(self, evt);
                    });
                    $(inputElement).bind("keypress.wijinput", function (evt) {
                        input.GlobalEventHandler.OnKeyPress(self, evt);
                    });
                    $(inputElement).bind("keyup.wijinput", function (evt) {
                        input.GlobalEventHandler.OnKeyUp(self, evt);
                    });
                    $(inputElement).bind("dblclick.wijinput", function (evt) {
                        input.GlobalEventHandler.OnDblClick(self, evt);
                    });
                    $(inputElement).bind("beforecopy.wijinput", function (evt) {
                        input.GlobalEventHandler.OnHTML5BeforeCopy(self, evt);
                    });
                    $(inputElement).bind("cut.wijinput", function (evt) {
                        input.GlobalEventHandler.OnHTML5Cut(self, evt);
                    });
                    $(inputElement).bind("paste.wijinput", function (evt) {
                        input.GlobalEventHandler.OnHTML5Paste(self, evt);
                    });
                    $(inputElement).bind("focus.wijinput", function (evt) {
                        input.GlobalEventHandler.OnFocus(self, evt);
                    });
                    $(inputElement).bind("blur.wijinput", function (evt) {
                        input.GlobalEventHandler.OnLostFocus(self, evt);
                    });
                    // IE+chrome
                    $(inputElement).bind("mousewheel.wijinput", function (evt) {
                        input.GlobalEventHandler.OnMouseWheel(self, evt);
                    });
                    // FireFox.
                    $(inputElement).bind("DOMMouseScroll.wijinput", function (evt) {
                        input.GlobalEventHandler.OnMouseWheel(self, evt);
                    });
                    $(inputElement).bind("dragstart.wijinput", function (evt) {
                        input.GlobalEventHandler.OnDragStart(self, evt);
                    });
                    $(inputElement).bind("dragend.wijinput", function (evt) {
                        input.GlobalEventHandler.OnDragEnd(self, evt);
                    });
                    $(inputElement).bind("mouseout.wijinput", function (evt) {
                        input.GlobalEventHandler.OnMouseOut(self, evt);
                    });
                    $(inputElement).bind("drop.wijinput", function (evt) {
                        input.GlobalEventHandler.OnDrop(self, evt);
                    });
                    $(inputElement).bind("touchstart.wijinput", function (evt) {
                        input.GlobalEventHandler.OnTouchStart(self, evt);
                    });
                    $(inputElement).bind("touchend.wijinput", function (evt) {
                        input.GlobalEventHandler.OnTouchEnd(self, evt);
                    });
                    $(inputElement).bind("select.wijinput", function (evt) {
                        input.GlobalEventHandler.OnSelect(self, evt);
                    });
                    // Frank Liu fixed bug 662 at 2013/07/10.
                    //safari
                    if(input.Utility.safari) {
                        $(inputElement).bind("dragenter.wijinput", function (evt) {
                            self._safariDropText = getSelection().toString();
                        });
                        $(inputElement).bind("dragleave.wijinput", function (evt) {
                            self._safariDropText = null;
                        });
                    }
                    $(inputElement).bind("compositionstart.wijinput", function (evt) {
                        input.GlobalEventHandler.OnCompositionStart(self, evt);
                    });
                    $(inputElement).bind("compositionupdate.wijinput", function (evt) {
                        input.GlobalEventHandler.OnCompositionUpdate(self, evt);
                    });
                    $(inputElement).bind("compositionend.wijinput", function (evt) {
                        input.GlobalEventHandler.OnCompositionEnd(self, evt);
                    });
                    if(input.Utility.GetClientOS() === "Android") {
                        $(inputElement).bind("webkitEditableContentChanged.wijinput", function (evt) {
                            input.GlobalEventHandler.OnWebkitEditableContentChanged(self, evt);
                        });
                    }
                }
            };
            BaseInputControl.prototype.ResetData = // add by Sean Huang at 2008.12.10, for bug 779 -->
            function (data) {
                this.SetText(data.ResetData);
            };
            BaseInputControl.prototype._createElementForNoSpinAndNoDropDown = function (inputElement) {
                return inputElement;
            };
            BaseInputControl.prototype._addControlEventHandler = function () {
            };
            BaseInputControl.prototype._reCreate = function () {
            };
            BaseInputControl.prototype._onSpinPropertyChanged = function (propertyName) {
                propertyName = propertyName.toLowerCase();
                if(propertyName === "alignment" || propertyName === "position") {
                    if(this._getRealSpinVisible()) {
                        this._reCreate();
                    }
                } else if(propertyName === "visible") {
                    this._reCreate();
                } else if(propertyName === "enabled") {
                } else if(propertyName === "spinupimage" || propertyName === "spindownimage" || propertyName === "pressedspinupimage" || propertyName === "pressedspindownimage") {
                }
            };
            BaseInputControl.prototype._onDropDownPropertyChanged = function (propertyName) {
                propertyName = propertyName.toLowerCase();
                if(propertyName === "position") {
                    if(this._getRealDropDownVisible()) {
                        this._reCreate();
                    }
                } else if(propertyName === "visible") {
                    this._reCreate();
                } else if(propertyName === "enabled") {
                } else if(propertyName === "buttonimage" || propertyName === "pressedbuttonimage") {
                }
            };
            BaseInputControl.prototype._isSupportClipBoard = function () {
                if(!this.GetUseClipboard()) {
                    return true;
                }
                if(input.Utility.IsIE()) {
                    return true;
                }
                //if (Utility.IsFireFox4OrLater()) {
                //    try {
                //        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
                //        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
                //        if (!clip) {
                //            return;
                //        }
                //        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
                //        if (!trans) {
                //            return;
                //        }
                //        trans.addDataFlavor('text/unicode');
                //        clip.getData(trans, clip.kGlobalClipboard);
                //        var str = {};
                //        var len = {};
                //        try {
                //            trans.getTransferData('text/unicode', str, len);
                //        } catch (error) {
                //            return null;
                //        }
                //        if (str) {
                //            if (Components.interfaces.nsISupportsWString) {
                //                str = str.value.QueryInterface(Components.interfaces.nsISupportsWString);
                //            } else if (Components.interfaces.nsISupportsString) {
                //                str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
                //            } else {
                //                str = null;
                //            }
                //        }
                //        if (str) {
                //            return (str.data.substring(0, len.value / 2));
                //        }
                //    } catch (e) {
                //        return false;
                //    }
                //}
                return false;
            };
            BaseInputControl.prototype._onpropertyChanged = function () {
            };
            BaseInputControl.prototype.GetSpinDelay = /**
            * Gets the delay of spin.
            * @returns {number}
            */
            function () {
                return this.Delay;
            };
            BaseInputControl.prototype.SetSpinDelay = /**
            * Sets the delay of spin.
            * @param {number} value
            * @throws Delay value should not be less than zero or greater than the max value.
            */
            function (value) {
                this.Delay = value;
            };
            BaseInputControl.prototype.GetSpinEnabled = /**
            * Gets whether the spin is enabled.
            * @returns {boolean}
            */
            function () {
                return this.SpinEnabled && this.Enabled;
            };
            BaseInputControl.prototype.SetSpinEnabled = /**
            * Sets whether the spin is enabled.
            * @param {boolean} value
            */
            function (value) {
                this.SpinEnabled = value;
            };
            BaseInputControl.prototype.GetSpinIncrement = /**
            * Gets the spin increment value.
            * @returns {number}
            */
            function () {
                return this.Increment;
            };
            BaseInputControl.prototype.SetSpinIncrement = /**
            * Sets the spin increment value.
            * @param {number} value
            */
            function (value) {
                this.Increment = value;
            };
            BaseInputControl.prototype.GetSpinOnKeys = /**
            * Gets a value indicated whether user can spin by key.
            * @returns {boolean}
            */
            function () {
                return this.SpinOnKeys;
            };
            BaseInputControl.prototype.SetSpinOnKeys = /**
            * Sets a value indicated whether user can spin by key.
            * @param {boolean} value
            */
            function (value) {
                this.SpinOnKeys = value;
            };
            BaseInputControl.prototype.GetSpinVisible = /**
            * Gets the visibility of the spin button.
            * @returns {boolean}
            */
            function () {
                return this.Visible;
            };
            BaseInputControl.prototype._getRealSpinVisible = function () {
                return this.GetSpinVisible();
            };
            BaseInputControl.prototype.SetSpinVisible = /**
            * Sets the visibility of the spin button.
            * @returns {boolean}
            */
            function (value) {
                this.Visible = value;
            };
            BaseInputControl.prototype.GetSpinWrap = /**
            * Gets whether the value iterated when spin out the max/min value of the control.
            * @returns {boolean}
            */
            function () {
                return this.Wrap;
            };
            BaseInputControl.prototype.SetSpinWrap = /**
            * Sets whether the value iterated when spin out the max/min value of the control.
            * @param {boolean} value
            */
            function (value) {
                this.Wrap = value;
            };
            BaseInputControl.prototype.GetAutoDropDown = /**
            * Gets whether the drop-down object is displayed when the control receives focus.
            * @returns {boolean}
            */
            function () {
                return this._dropDown.AutoDropDown;
            };
            BaseInputControl.prototype.SetAutoDropDown = /**
            * Sets whether the drop-down object is displayed when the control receives focus.
            * @param {boolean} value
            */
            function (value) {
                this._dropDown.SetAutoDropDown(value);
            };
            BaseInputControl.prototype.GetDropDownButtonImageUrl = /**
            * Gets the background image URL of drop-down button.
            * @returns {string}
            */
            function () {
                return this._dropDown.GetButtonImage();
            };
            BaseInputControl.prototype.SetDropDownButtonImageUrl = /**
            * Sets the background image URL of drop-down button.
            * @param {string} value
            */
            function (value) {
                this._dropDown.SetButtonImage(value);
            };
            BaseInputControl.prototype.GetDropDownClosingAnimation = /**
            * Gets the animation effect when drop-down control closing.
            * @returns {DropDownAnimation}
            */
            function () {
                return this._dropDown.ClosingAnimation;
            };
            BaseInputControl.prototype.SetDropDownClosingAnimation = /**
            * Sets the animation effect when drop-down control closing.
            * @param {DropDownAnimation} value
            */
            function (value) {
                this._dropDown.SetClosingAnimation(value);
            };
            BaseInputControl.prototype.GetDropDownShadow = /**
            * Gets whether the drop-down control has a shadow.
            * @returns {boolean}
            */
            function () {
                return this._dropDown.DropDownShadow;
            };
            BaseInputControl.prototype.SetDropDownShadow = /**
            * Sets whether the drop-down field has a shadow.
            * @param {boolean} value
            */
            function (value) {
                this._dropDown.SetDropDownShadow(value);
            };
            BaseInputControl.prototype.GetDropDownEnabled = /**
            * Gets whether the drop-down control is enabled.
            * @returns {boolean}
            */
            function () {
                return this._dropDown.GetEnabled() && this.Enabled;
            };
            BaseInputControl.prototype.SetDropDownEnabled = /**
            * Sets whether the drop-down control is enabled.
            * @param {boolean} value
            */
            function (value) {
                this._dropDown.SetEnabled(value);
            };
            BaseInputControl.prototype.GetDropDownOpeningAnimation = /**
            * Gets the animation effect when drop-down control openning.
            * @returns {DropDownAnimation}
            */
            function () {
                return this._dropDown.OpeningAnimation;
            };
            BaseInputControl.prototype.SetDropDownOpeningAnimation = /**
            * Sets the animation effect when drop-down control openning.
            * @param {DropDownAnimation} value
            */
            function (value) {
                this._dropDown.SetOpeningAnimation(value);
            };
            BaseInputControl.prototype.GetDropDownPosition = /**
            * Gets the position of the drop-down button.
            * @returns {ButtonPosition}
            */
            function () {
                return this._dropDown.Position;
            };
            BaseInputControl.prototype.SetDropDownPosition = /**
            * Sets the position of the drop-down button.
            * @param {ButtonPosition} value
            */
            function (value) {
                this._dropDown.SetPosition(value);
            };
            BaseInputControl.prototype.GetPressedDropDownButtonImageUrl = /**
            * Gets the background image URL of pressed drop-down button.
            * @returns {string}
            */
            function () {
                return this._dropDown.GetPressedButtonImage();
            };
            BaseInputControl.prototype.SetPressedDropDownButtonImageUrl = /**
            * Sets the background image URL of pressed drop-down button.
            * @param {string} value
            */
            function (value) {
                this._dropDown.SetPressedButtonImage(value);
            };
            BaseInputControl.prototype.GetDropDownVisible = /**
            * Gets the visibility of the drop-down button.
            * @returns {boolean}
            */
            function () {
                return this._dropDown.Visible;
            };
            BaseInputControl.prototype._getRealDropDownVisible = function () {
                return this.GetDropDownVisible();
            };
            BaseInputControl.prototype.SetDropDownVisible = /**
            * Sets the visibility of the drop-down button.
            * @returns {boolean}
            */
            function (value) {
                this._dropDown.SetVisible(value);
            };
            return BaseInputControl;
        })();
        input.BaseInputControl = BaseInputControl;        
        /** @ignore */
        var KeywordType;
        (function (KeywordType) {
            KeywordType._map = [];
            KeywordType.OctalAscII = 0x00;
            KeywordType.HexAscII = 0x01;
            KeywordType.HexUnicode = 0x02;
            KeywordType.DefinedCharBase = 0x03;
            KeywordType.DefinedCharAddition = 0x04;
            KeywordType.CharSubset = 0x05;
            KeywordType.EnumGroup = 0x06;
            KeywordType.Quantifier = 0x07;
            KeywordType.PromptChar = 0x08;
            KeywordType.Unknow = 0x09;
        })(KeywordType || (KeywordType = {}));
        /** @ignore */
        var MaskFormat = (function () {
            function MaskFormat() { }
            MaskFormat.DBCS_A = input.CharProcess.CharEx.ToFullWidth('A').text;
            MaskFormat.DBCS_a = input.CharProcess.CharEx.ToFullWidth('a').text;
            MaskFormat.DBCS_B = input.CharProcess.CharEx.ToFullWidth('B').text;
            MaskFormat.DBCS_D = input.CharProcess.CharEx.ToFullWidth('D').text;
            MaskFormat.DBCS_J = input.CharProcess.CharEx.ToFullWidth('J').text;
            MaskFormat.DBCS_K = input.CharProcess.CharEx.ToFullWidth('K').text;
            MaskFormat.DBCS_W = input.CharProcess.CharEx.ToFullWidth('W').text;
            MaskFormat.DBCS_X = input.CharProcess.CharEx.ToFullWidth('X').text;
            MaskFormat.DBCS_Z = input.CharProcess.CharEx.ToFullWidth('Z').text;
            MaskFormat.DBCS_T = input.CharProcess.CharEx.ToFullWidth('T').text;
            MaskFormat.DBCS_M = input.CharProcess.CharEx.ToFullWidth('M').text;
            MaskFormat.DBCS_I = input.CharProcess.CharEx.ToFullWidth('I').text;
            MaskFormat.DBCS_N = input.CharProcess.CharEx.ToFullWidth('N').text;
            MaskFormat.DBCS_G = input.CharProcess.CharEx.ToFullWidth('G').text;
            MaskFormat.DBCS_E = input.CharProcess.CharEx.ToFullWidth("E").text;
            MaskFormat.DBCS_V = input.CharProcess.CharEx.ToFullWidth("V").text;
            MaskFormat.DBCS_z = input.CharProcess.CharEx.ToFullWidth('z').text;
            MaskFormat.DBCS_0 = input.CharProcess.CharEx.ToFullWidth('0').text;
            MaskFormat.DBCS_1 = input.CharProcess.CharEx.ToFullWidth('1').text;
            MaskFormat.DBCS_9 = input.CharProcess.CharEx.ToFullWidth('9').text;
            MaskFormat.DBCS_F = input.CharProcess.CharEx.ToFullWidth('F').text;
            MaskFormat.DBCS_f = input.CharProcess.CharEx.ToFullWidth('f').text;
            MaskFormat.DBCS__ = input.CharProcess.CharEx.ToFullWidth('_').text;
            MaskFormat.ParseFormat = function ParseFormat(pattern, owner) {
                MaskFormat.Owner = owner;
                var fields = new MaskFieldCollection(MaskFormat.Owner, 0, false);
                if(pattern === null || pattern.length === 0) {
                    var ffield = new FilterField(MaskFormat.Owner);
                    var bitsState = new Array();
                    ffield._bitState = bitsState;
                    var uf = new UnionFilter(MaskFormat.Owner, true);
                    var ff = new FullWidthFilter(MaskFormat.Owner, true);
                    uf.Add(ff);
                    var hf = new HalfWidthFilter(MaskFormat.Owner, true);
                    uf.Add(hf);
                    // DaryLuo 2013/07/01 fix bug 544 in IM HTML 5.0.
                    var tf = new SurrogateFilter(MaskFormat.Owner, true);
                    uf.Add(tf);
                    ffield.FilterField(0, 2147483647, uf, bitsState);
                    ffield.InitialText('');
                    ffield._trueLength = 0;
                    fields.PushBack(ffield);
                    fields.formatIsNull = true;
                    return fields;
                }
                var caret = 0;
                var promptS = "";
                var lastKeyType = KeywordType.PromptChar;
                var nextKeyType = KeywordType.CharSubset;
                var keyWordResult = MaskFormat.GetKeyWord(pattern, caret);
                var keyWord = keyWordResult.KeyWord;
                var keyType = keyWordResult.KeyType;
                var keyLen = keyWordResult.KeyLen;
                var filter;
                while(pattern.length > caret) {
                    switch(keyType) {
                        case KeywordType.Unknow:
                            throw "InvalidParameter";
                        case KeywordType.CharSubset:
                            var analyseResult = MaskFormat.AnalyseCharSubset(keyWord);
                            var uf = analyseResult.uf;
                            if(!analyseResult.Result) {
                                throw "Invalid parameter";
                            }
                            filter = uf;
                            lastKeyType = KeywordType.CharSubset;
                            break;
                        case KeywordType.DefinedCharAddition:
                            if(keyWord === '\\K') {
                                filter = new HalfWidthKatakanaFilter(MaskFormat.Owner, true);
                            } else if(keyWord === "\\H") {
                                filter = new HalfWidthFilter(MaskFormat.Owner, true);
                            } else if(keyWord === '\\N') {
                                filter = new SBCSKatakanaFilter(MaskFormat.Owner, true);
                            } else if(keyWord === "\\" + MaskFormat.DBCS_K) {
                                filter = new FullWidthKatakanaFilter(MaskFormat.Owner, true);
                            } else if(keyWord === "\\" + MaskFormat.DBCS_J) {
                                filter = new HiraganaFilter(MaskFormat.Owner, true);
                            } else if(keyWord === "\\" + MaskFormat.DBCS_M) {
                                filter = new ShiftJISFilter(MaskFormat.Owner, true);
                            } else if(keyWord === "\\" + MaskFormat.DBCS_I) {
                                filter = new JISX0208Filter(MaskFormat.Owner, true);
                            } else if(keyWord === "\\" + MaskFormat.DBCS_G) {
                                filter = new DBCSHiraganaFilter(MaskFormat.Owner, true);
                            } else if(keyWord === "\\" + MaskFormat.DBCS_N) {
                                filter = new DBCSKatakanaFilter(MaskFormat.Owner, true);
                            } else if(keyWord === "\\" + MaskFormat.DBCS_Z) {
                                filter = new FullWidthFilter(MaskFormat.Owner, true);
                            } else if(keyWord === "\\" + MaskFormat.DBCS_T) {
                                filter = new SurrogateFilter(MaskFormat.Owner, true);
                            } else//else if (keyWord === "\\" + DBCS_E) {
                            //    filter = new EmojiFilter(MaskFormat.Owner, true);
                            //}
                            //else if (keyWord === "\\" + DBCS_V) {
                            //    filter = new IVSFilter(MaskFormat.Owner, true);
                            //}
                             {
                                throw "argument null";
                            }
                            lastKeyType = KeywordType.CharSubset;
                            break;
                        case KeywordType.EnumGroup:
                            var members = [];
                            if(MaskFormat.AnalyseEnumGroup(keyWord, members)) {
                                var filed = new EnumField(MaskFormat.Owner);
                                filed.Init(members);
                                fields.PushBack(filed);
                                lastKeyType = KeywordType.EnumGroup;
                                caret += keyLen;
                                var r = MaskFormat.GetKeyWord(pattern, caret);
                                keyWord = r.KeyWord;
                                keyType = r.KeyType;
                                keyLen = r.KeyLen;
                                continue;
                            } else {
                                throw "invalid parameter";
                            }
                        case KeywordType.OctalAscII:
                            try  {
                                var tempInt = keyWord.Substring(1);
                                tempInt = parseInt(tempInt, 8);
                                if(tempInt === 0) {
                                    throw "argument exception";
                                }
                                var c = String.fromCharCode(tempInt);
                                if(lastKeyType === KeywordType.PromptChar) {
                                    promptS += c;
                                } else {
                                    promptS = c;
                                    lastKeyType = KeywordType.PromptChar;
                                }
                            } catch (e) {
                                throw "invalid parameter";
                            }
                            break;
                        case KeywordType.HexAscII:
                        case KeywordType.HexUnicode:
                            try  {
                                var tempInt = keyWord.Substring(2);
                                tempInt = parseInt(tempInt, 16);
                                if(tempInt === 0) {
                                    throw "argument exception";
                                }
                                var c = String.fromCharCode(tempInt);
                                if(lastKeyType === KeywordType.PromptChar) {
                                    promptS += c;
                                } else {
                                    promptS = c;
                                    lastKeyType = KeywordType.PromptChar;
                                }
                            } catch (e) {
                                throw "invalid parameter";
                            }
                            break;
                        case KeywordType.PromptChar:
                            if(lastKeyType === KeywordType.PromptChar) {
                                promptS += keyWord;
                            } else {
                                promptS = keyWord;
                                lastKeyType = KeywordType.PromptChar;
                            }
                            break;
                        case KeywordType.Quantifier:
                            throw "invalid parameter";
                        default:
                            throw "invalid parameter";
                    }
                    caret += keyLen;
                    var max = 1, min = 1;
                    if(caret < pattern.length) {
                        keyWordResult = MaskFormat.GetKeyWord(pattern, caret);
                        keyWord = keyWordResult.KeyWord;
                        keyType = keyWordResult.KeyType;
                        keyLen = keyWordResult.KeyLen;
                        switch(keyType) {
                            case KeywordType.Unknow:
                                throw "invalid parameter";
                            case KeywordType.CharSubset:
                            case KeywordType.DefinedCharAddition:
                            case KeywordType.EnumGroup:
                                nextKeyType = KeywordType.CharSubset;
                                break;
                            case KeywordType.Quantifier:
                                var quantifierResult = MaskFormat.AnalyseQuantifier(keyWord);
                                min = quantifierResult.Min;
                                max = quantifierResult.Max;
                                if(!quantifierResult.Result) {
                                    throw "invalid parameter";
                                }
                                caret += keyLen;
                                keyWordResult = MaskFormat.GetKeyWord(pattern, caret);
                                keyWord = keyWordResult.KeyWord;
                                keyType = keyWordResult.KeyType;
                                keyLen = keyWordResult.KeyLen;
                                nextKeyType = KeywordType.Quantifier;
                                break;
                            case KeywordType.OctalAscII:
                            case KeywordType.HexUnicode:
                            case KeywordType.HexAscII:
                            case KeywordType.PromptChar:
                                nextKeyType = KeywordType.PromptChar;
                                break;
                        }
                        if(lastKeyType === KeywordType.PromptChar) {
                            if(nextKeyType !== KeywordType.PromptChar) {
                                // (Henry Jia) Quantifier is not allowed occur after PromptField
                                if(nextKeyType === KeywordType.Quantifier) {
                                    throw "invalid parameter";
                                }
                                fields.PushBack(new PromptField(promptS));
                            }
                        } else {
                            var filterField = new FilterField(MaskFormat.Owner);
                            filterField.FilterField(min, max, filter, [
                                false, 
                                false, 
                                false
                            ]);
                            filterField.InitialText(input.Utility.ToString(filterField.GetPromptChar(), min));
                            filterField._trueLength = 0;
                            fields.PushBack(filterField);
                        }
                    } else {
                        if(lastKeyType === KeywordType.PromptChar) {
                            fields.PushBack(new PromptField(promptS));
                        } else {
                            var filterField = new FilterField(MaskFormat.Owner);
                            filterField.FilterField(1, 1, filter, []);
                            fields.PushBack(filterField);
                        }
                    }
                }
                for(var l = 0; l < fields.fieldCount; l++) {
                    if(!(fields.GetFieldByIndex(l) instanceof PromptField)) {
                        break;
                    }
                }
                if(l === fields.fieldCount) {
                    throw "invalid parameter";
                }
                return fields;
            };
            MaskFormat.ParseFillExpression = function ParseFillExpression(expression, fileds) {
                var result = {
                };
                result.Expression = "";
                result.Result = true;
                if(expression === "{}") {
                    result.Expression = "{}";
                    result.Result = true;
                    return result;
                }
                if(expression !== undefined && expression !== null && expression.length > 0) {
                    try  {
                        var format = expression;
                        var fillingChar = '\0';
                        var parseResult = MaskFormat.ParseFillingString(format);
                        format = parseResult.Format;
                        fillingChar = parseResult.FillingChar;
                        if(fillingChar !== '\0') {
                            if(!MaskFormat.NullParse(format)) {
                                throw "argument exception";
                            }
                            if(fileds !== undefined && fileds !== null && fileds.fieldCount > 0) {
                                result.Expression = fileds.GetFillingString(fillingChar);
                            } else {
                                result.Expression = expression;
                            }
                        } else {
                            result.Expression = format;
                        }
                    } catch (e) {
                        throw "argument exception";
                    }
                } else {
                    result.Expression = null;
                }
                return result;
            };
            MaskFormat.ParseFillingString = function ParseFillingString(format) {
                var result = {
                };
                result.Format = format;
                result.FillingChar = "\0";
                result.Result = false;
                if(format === undefined || format === null || format.length === 0) {
                    result.Result = false;
                    return result;
                }
                var nLpos = format.indexOf("{");
                var nRpos = format.indexOf("}");
                if(nLpos === -1 && nRpos === -1) {
                    format = MaskFormat.RemoveEscapeChar(format);
                    result.Format = format;
                    result.Result = false;
                    return result;
                } else {
                    while(nLpos > 0 && format.charAt(nLpos - 1) === '\\') {
                        nLpos = format.indexOf("{", nLpos + 1);
                    }
                    while(nRpos > 0 && format.charAt(nRpos - 1) === '\\') {
                        nRpos = format.indexOf("}", nRpos + 1);
                    }
                    if(nLpos < nRpos) {
                        if(nLpos === -1) {
                            format = MaskFormat.RemoveEscapeChar(format);
                            result.Format = format;
                            result.Result = false;
                            return result;
                        } else {
                            if(nRpos - nLpos === 1) {
                                result.Format = "";
                            } else {
                                if(format.charAt(nLpos + 1) === "{") {
                                    throw "argument exception";
                                } else if(format.charAt(nLpos + 1) === "\\") {
                                    if(nLpos + 2 < nRpos) {
                                        nLpos++;
                                    } else {
                                        throw "arugment exception";
                                    }
                                }
                                result.FillingChar = format.charAt(nLpos + 1);
                            }
                            result.Result = true;
                            return result;
                        }
                    } else {
                        format = MaskFormat.RemoveEscapeChar(format);
                        result.Format = format;
                        result.Result = false;
                        return result;
                    }
                }
            };
            MaskFormat.RemoveEscapeChar = function RemoveEscapeChar(format) {
                if(format.indexOf('\\') !== -1) {
                    var sb = "";
                    var len = format.length;
                    for(var i = 0; i < len; i++) {
                        if(format.charAt(i) === '\\') {
                            if(i + 1 < len) {
                                sb += format.charAt(++i);
                            }
                            continue;
                        }
                        sb += format.charAt(i);
                    }
                    return sb;
                }
                return format;
            };
            MaskFormat.NullParse = function NullParse(text) {
                var startIndex = MaskFormat.FindSpecialCh(text, "{", 0);
                var endIndex = MaskFormat.FindSpecialCh(text, "}", 0);
                if(startIndex > -1 && endIndex > -1) {
                    if(endIndex > startIndex) {
                        //not more '{'
                        if(MaskFormat.FindSpecialCh(text, "{", startIndex + 1) > -1) {
                            return false;
                        }
                        if(MaskFormat.FindSpecialCh(text, "}", endIndex + 1) > -1) {
                            return false;
                        }
                    }
                }
                return true;
            };
            MaskFormat.FindSpecialCh = function FindSpecialCh(text, specialCh, idx) {
                var sNum = 0;
                var startIndex = idx - 1;
                do {
                    startIndex = text.indexOf(specialCh, startIndex + 1);
                    if(startIndex === 0 || startIndex === -1) {
                        return startIndex;
                    }
                    for(var sCount = startIndex - 1; sCount > 0; sCount--) {
                        if(text.charAt(sCount) !== '\\') {
                            break;
                        }
                        sNum++;
                    }
                }while(text.charAt(startIndex - 1) === '\\' && (sNum % 2) !== 0);
                return startIndex;
            };
            MaskFormat.GetKeyWord = function GetKeyWord(format, index) {
                var result = {
                };
                result.KeyLen = 0;
                result.KeyType = KeywordType.Unknow;
                result.KeyWord = null;
                if(index >= format.length) {
                    return result;
                }
                var cFirst = format.charAt(index);
                switch(cFirst) {
                    case '\\':
                        // Is Escape Char ?
                        var escapChar = MaskFormat.GetEscapeCharLength(format.Substring(index), result.KeyType, result.KeyLen);
                        if(escapChar.Result) {
                            result.KeyLen = escapChar.KeyLen;
                            result.KeyType = escapChar.KeyType;
                            result.KeyWord = format.substr(index, result.KeyLen);
                            return result;
                        }
                        //Is Defined char ?
                        var cSecond = format.charAt(index + 1);
                        if(cSecond === 'A') {
                            result.KeyLen = 2;
                            result.KeyType = KeywordType.CharSubset;
                            result.KeyWord = "[A-Z]";
                            return result;
                        } else if(cSecond === MaskFormat.DBCS_A) {
                            result.KeyLen = 2;
                            result.KeyType = KeywordType.CharSubset;
                            result.KeyWord = "[" + MaskFormat.DBCS_A + "-" + MaskFormat.DBCS_Z + "]";
                            return result;
                        } else if(cSecond === 'a') {
                            result.KeyLen = 2;
                            result.KeyType = KeywordType.CharSubset;
                            result.KeyWord = "[a-z]";
                            return result;
                        } else if(cSecond === MaskFormat.DBCS_a) {
                            result.KeyLen = 2;
                            result.KeyType = KeywordType.CharSubset;
                            result.KeyWord = "[" + MaskFormat.DBCS_a + "-" + MaskFormat.DBCS_z + "]";
                            return result;
                        } else if(cSecond === 'D') {
                            result.KeyLen = 2;
                            result.KeyType = KeywordType.CharSubset;
                            result.KeyWord = "[0-9]";
                            return result;
                        } else if(cSecond === MaskFormat.DBCS_D) {
                            result.KeyLen = 2;
                            result.KeyType = KeywordType.CharSubset;
                            result.KeyWord = "[" + MaskFormat.DBCS_0 + "-" + MaskFormat.DBCS_9 + "]";
                            return result;
                        } else if(cSecond === 'B') {
                            result.KeyLen = 2;
                            result.KeyType = KeywordType.CharSubset;
                            result.KeyWord = "[0-1]";
                            return result;
                        } else if(cSecond === MaskFormat.DBCS_B) {
                            result.KeyLen = 2;
                            result.KeyType = KeywordType.CharSubset;
                            result.KeyWord = "[" + MaskFormat.DBCS_0 + "-" + MaskFormat.DBCS_1 + "]";
                            return result;
                        } else if(cSecond === 'X') {
                            result.KeyLen = 2;
                            result.KeyType = KeywordType.CharSubset;
                            result.KeyWord = "[0-9A-Fa-f]";
                            return result;
                        } else if(cSecond === MaskFormat.DBCS_X) {
                            result.KeyLen = 2;
                            result.KeyType = KeywordType.CharSubset;
                            result.KeyWord = "[" + MaskFormat.DBCS_0 + "-" + MaskFormat.DBCS_9 + MaskFormat.DBCS_A + "-" + MaskFormat.DBCS_F + MaskFormat.DBCS_a + "-" + MaskFormat.DBCS_f + "]";
                            return result;
                        } else if(cSecond === 'W') {
                            result.KeyLen = 2;
                            result.KeyType = KeywordType.CharSubset;
                            result.KeyWord = "[a-zA-Z_0-9]";
                            return result;
                        } else if(cSecond === MaskFormat.DBCS_W) {
                            result.KeyLen = 2;
                            result.KeyType = KeywordType.CharSubset;
                            result.KeyWord = "[" + MaskFormat.DBCS_a + "-" + MaskFormat.DBCS_z + MaskFormat.DBCS_A + "-" + MaskFormat.DBCS_Z + MaskFormat.DBCS__ + MaskFormat.DBCS_0 + "-" + MaskFormat.DBCS_9 + "]";
                            return result;
                        } else if(cSecond === 'K' || cSecond === MaskFormat.DBCS_K || cSecond === MaskFormat.DBCS_J || cSecond === MaskFormat.DBCS_Z || cSecond === 'H' || cSecond === MaskFormat.DBCS_T || cSecond === MaskFormat.DBCS_M || cSecond === MaskFormat.DBCS_I || cSecond === MaskFormat.DBCS_G || cSecond === MaskFormat.DBCS_N || cSecond === 'N' || cSecond === MaskFormat.DBCS_E || cSecond === MaskFormat.DBCS_V) {
                            result.KeyLen = 2;
                            result.KeyType = KeywordType.DefinedCharAddition;
                            result.KeyWord = format.substr(index, 2);
                            return result;
                        } else if(MaskFormat.IsSpecialChar(cSecond)) {
                            result.KeyLen = 2;
                            result.KeyType = KeywordType.PromptChar;
                            result.KeyWord = format.substr(index + 1, 1)//exclude the '\' character.
                            ;
                            return result;
                        } else {
                            result.KeyWord = ""// "\\";
                            ;
                            return result;
                        }
                    case '{':// Quantifier string
                     {
                        var idx = format.indexOf('}', index + 1);
                        if(idx === -1) {
                            result.KeyWord = ""// "\\";
                            ;
                            return result;
                        }
                        result.KeyType = KeywordType.Quantifier;
                        result.KeyLen = idx + 1 - index;
                        result.KeyWord = format.substr(index, result.KeyLen);
                        return result;
                    }
                    case '[':// Char Subset string
                     {
                        var idx = index;
                        //calculate '\\' number
                        var sNum = 0;
                        do {
                            idx = format.indexOf(']', idx + 1);
                            if(idx === -1) {
                                return "";
                            }
                            for(var sCount = idx - 1; sCount > 0; sCount--) {
                                if(format.charAt(sCount) !== '\\') {
                                    break;
                                }
                                sNum++;
                            }
                        }while(format.charAt(idx - 1) === '\\' && (sNum % 2) !== 0);
                        result.KeyType = KeywordType.CharSubset;
                        result.KeyLen = idx + 1 - index;
                        result.KeyWord = format.substr(index, result.KeyLen);
                        return result;
                    }
                    case '(':// Enum group string
                     {
                        var idx = index;
                        do {
                            idx = format.indexOf(')', idx + 1);
                            if(idx === -1) {
                                return "";
                            }
                        }while(format.charAt(idx - 1) === '\\');
                        result.KeyType = KeywordType.EnumGroup;
                        result.KeyLen = idx + 1 - index;
                        result.KeyWord = format.substr(index, result.KeyLen);
                        return result;
                    }
                    case '*':
                        result.KeyLen = 1;
                        result.KeyType = KeywordType.Quantifier;
                        result.KeyWord = "{0,}";
                        return result;
                    case '+':
                        result.KeyLen = 1;
                        result.KeyType = KeywordType.Quantifier;
                        result.KeyWord = "{1,}";
                        return result;
                    case '?':
                        result.KeyLen = 1;
                        result.KeyType = KeywordType.Quantifier;
                        result.KeyWord = "{0,1}";
                        return result;
                    default:// Prompt string
                     {
                        var i = index + 1;
                        for(; i < format.length; i++) {
                            if(MaskFormat.IsSpecialChar(format.charAt(i))) {
                                break;
                            }
                        }
                        result.KeyType = KeywordType.PromptChar;
                        result.KeyLen = i - index;
                        result.KeyWord = format.substr(index, result.KeyLen);
                        return result;
                    }
                }
            };
            MaskFormat.IsSpecialChar = function IsSpecialChar(c) {
                return (c === '\\' || c === '{' || c === '}' || c === '[' || c === ']' || c === '(' || c === ')' || c === '.' || c === '*' || c === '+' || c === '?');
            };
            MaskFormat.GetEscapeCharLength = function GetEscapeCharLength(format, keyType, length) {
                var result = {
                };
                result.Result = false;
                result.KeyType = keyType;
                result.Length = length;
                if(format.charAt(0) !== '\\') {
                    return result;
                }
                var caret = 1;
                //int oldCaret = caret;
                var c = format.charAt(1);
                if(c === 'x') {
                    if(format.length < caret + 3) {
                        return result;
                    }
                    result.Length = 4;
                    result.KeyType = KeywordType.HexAscII;
                    result.Result = true;
                    return result;
                } else if(c === 'u') {
                    if(format.length < caret + 5) {
                        return result;
                    }
                    result.Length = 6;
                    result.KeyType = KeywordType.HexUnicode;
                    result.Result = true;
                    return result;
                } else if(MaskFormat.IsOctalChar(c)) {
                    if(format.length < caret + 3) {
                        return result;
                    }
                    result.Length = 4;
                    result.KeyType = KeywordType.OctalAscII;
                    result.Result = true;
                    return result;
                }
                return result;
            };
            MaskFormat.IsOctalChar = function IsOctalChar(c) {
                return (c >= '0' && c <= '7');
            };
            MaskFormat.AnalyseQuantifier = function AnalyseQuantifier(quantifierStr) {
                var result = {
                };
                result.Min = -1;
                result.Max = -1;
                result.Result = false;
                var index = quantifierStr.indexOf(',', 1);
                if(index === -1) {
                    try  {
                        result.Min = parseInt(quantifierStr.substr(1, quantifierStr.length - 2));
                        result.Max = result.Min;
                        result.Result = result.Max > 0;
                        return result;
                    } catch (e) {
                        result.Result = false;
                        return result;
                    }
                }
                try  {
                    result.Min = parseInt(quantifierStr.substr(1, index - 1));
                    if(index === quantifierStr.length - 2) {
                        result.Max = Math.pow(2, 31);
                    } else {
                        result.Max = parseInt(quantifierStr.substr(index + 1, quantifierStr.length - index - 2));
                    }
                    if(result.Min < 0 || result.Min > result.Max || result.Max === 0) {
                        result.Result = false;
                        return result;
                    } else {
                        result.Result = true;
                        return result;
                    }
                } catch (e) {
                    result.Result = false;
                    return result;
                }
            };
            MaskFormat.AnalyseCharSubset = function AnalyseCharSubset(subset, uf) {
                var result = {
                };
                result.uf = uf;
                result.Result = false;
                var filters = [];
                var caret = 1;
                //char lastChar = subset[1];
                var isInclude = true;
                //			string exclude = string.Empty;
                var include = "";
                if(subset === "[]") {
                    //uf = new UnionFilter(new FilterField.CharacterFilter[]{new FullWidthFilter(),new HalfWidthFilter()});
                    //return true;
                    filters.push(new FullWidthFilter(MaskFormat.Owner, true));
                    filters.push(new HalfWidthFilter(MaskFormat.Owner, true));
                    filters.push(new SurrogateFilter(MaskFormat.Owner, true));
                    if(result.uf && result.uf.filterArray.length > 0) {
                        for(var i = 0; i < uf.filterArray.length; i++) {
                            filters.push(uf.filterArray[i]);
                        }
                    }
                    result.uf = new UnionFilter(MaskFormat.Owner, true);
                    result.uf.AddRange(filters);
                    result.Result = true;
                    return result;
                }
                if(subset === "[^]") {
                    //uf = new UnionFilter(new FilterField.CharacterFilter[]{new FullWidthFilter(),new HalfWidthFilter()});
                    //uf.Include = false;
                    //return true;
                    filters.push(new FullWidthFilter(MaskFormat.Owner, false));
                    filters.push(new HalfWidthFilter(MaskFormat.Owner, false));
                    filters.push(new SurrogateFilter(MaskFormat.Owner, false));
                    if(result.uf && result.uf.filterArray.length > 0) {
                        for(var i = 0; i < uf.filterArray.length; i++) {
                            filters.push(uf.filterArray[i]);
                        }
                    }
                    result.uf = new UnionFilter(MaskFormat.Owner, true);
                    result.uf.AddRange(filters);
                    result.uf.filterArray[0]._include = false;
                    result.uf.filterArray[1]._include = false;
                    result.uf.filterArray[2]._include = false;
                    result.Result = true;
                    return result;
                }
                if(subset.charAt(caret) === '^') {
                    isInclude = false;
                    caret++;
                }
                while(caret < subset.length - 1) {
                    var cc = subset.charAt(caret);
                    var keyType = KeywordType.HexAscII;
                    var length = 0;
                    switch(cc) {
                        case '-':
                            result.Result = false;
                            return result;
                        case '^':
                            if(isInclude === false) {
                                // DaryLuo 2013/07/01 fix bug 593 in IM HTML 5.0.
                                throw "invalid fromat";
                            }
                            //return false;
                            //characters
                            if(include.length > 0) {
                                var lf = new LimitedFilter(include, "");
                                lf._include = isInclude;
                                filters.push(lf);
                            }
                            //add filter before "^"
                            if(filters.length > 0) {
                                result.uf = new UnionFilter(MaskFormat.Owner, true);
                                result.uf.AddRange(filters);
                                //can not be excluded twice
                                for(var i = 0; i < result.uf.filterArray.length; i++) {
                                    if(!result.uf.filterArray[i]._include) {
                                        result.Result = false;
                                        return result;
                                    }
                                }
                                var charSubSetResult = MaskFormat.AnalyseCharSubset("[" + subset.substr(caret, subset.length - caret), result.uf);
                                result.uf = charSubSetResult.uf;
                                result.Result = charSubSetResult.Result;
                                return result;
                            } else {
                                result.Result = false;
                                return result;
                            }
                        case '\\':
                            // "\\";"\]";"\[";"\-";"\^";"\K";"\u0098"......
                             {
                                // Change the "\u****" to a char.
                                var escapeCharResult = MaskFormat.GetEscapeCharLength(subset.substr(caret), keyType, length);
                                keyType = escapeCharResult.KeyType;
                                length = escapeCharResult.Length;
                                if(escapeCharResult.Result) {
                                    var baseValue = 16;
                                    var s = null;
                                    if(keyType === KeywordType.OctalAscII) {
                                        baseValue = 8;
                                        s = subset.substr(caret + 1, length - 1);
                                    } else {
                                        s = subset.substr(caret + 2, length - 2);
                                    }
                                    subset = subset.substring(0, caret) + subset.substr(caret + length);
                                    var newStr = String.fromCharCode(parseInt(s, baseValue));
                                    subset = subset.substring(0, caret) + newStr + subset.substr(caret);
                                    continue;
                                }
                                var c = subset.charAt(caret + 1);
                                if(c === 'A') {
                                    filters.push(new RangeFilter('A', 'Z', MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === MaskFormat.DBCS_A) {
                                    filters.push(new RangeFilter(MaskFormat.DBCS_A, MaskFormat.DBCS_Z, MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === 'a') {
                                    filters.push(new RangeFilter('a', 'z', MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === MaskFormat.DBCS_a) {
                                    filters.push(new RangeFilter(MaskFormat.DBCS_a, MaskFormat.DBCS_z, MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === 'D') {
                                    filters.push(new RangeFilter('0', '9', MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === MaskFormat.DBCS_D) {
                                    filters.push(new RangeFilter(MaskFormat.DBCS_0, MaskFormat.DBCS_9, MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === 'B') {
                                    filters.push(new RangeFilter('0', '1', MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === MaskFormat.DBCS_B) {
                                    filters.push(new RangeFilter(MaskFormat.DBCS_0, MaskFormat.DBCS_1, MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === 'X') {
                                    filters.push(new RangeFilter('0', '9', MaskFormat.Owner, true));
                                    filters.push(new RangeFilter('A', 'F', MaskFormat.Owner, true));
                                    filters.push(new RangeFilter('a', 'f', MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === MaskFormat.DBCS_X) {
                                    filters.push(new RangeFilter(MaskFormat.DBCS_0, MaskFormat.DBCS_9, MaskFormat.Owner, true));
                                    filters.push(new RangeFilter(MaskFormat.DBCS_A, MaskFormat.DBCS_F, MaskFormat.Owner, true));
                                    filters.push(new RangeFilter(MaskFormat.DBCS_a, MaskFormat.DBCS_f, MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === 'W') {
                                    filters.push(new RangeFilter('0', '9', MaskFormat.Owner, true));
                                    filters.push(new RangeFilter('A', 'Z', MaskFormat.Owner, true));
                                    filters.push(new RangeFilter('a', 'z'));
                                    //							if (include.IndexOf('_') != -1)
                                    //								return false;
                                    include += '_';
                                    caret++;
                                } else if(c === MaskFormat.DBCS_W) {
                                    filters.push(new RangeFilter(MaskFormat.DBCS_0, MaskFormat.DBCS_9, MaskFormat.Owner, true));
                                    filters.push(new RangeFilter(MaskFormat.DBCS_A, MaskFormat.DBCS_Z, MaskFormat.Owner, true));
                                    filters.push(new RangeFilter(MaskFormat.DBCS_a, MaskFormat.DBCS_z, MaskFormat.Owner, true));
                                    //							if (include.IndexOf(DBCS__) != -1)
                                    //								return false;
                                    include += MaskFormat.DBCS__;
                                    caret++;
                                } else if(c === 'K') {
                                    filters.push(new HalfWidthKatakanaFilter(MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === 'H') {
                                    filters.push(new HalfWidthFilter(MaskFormat.Owner, isInclude));
                                    caret++;
                                } else if(c === MaskFormat.DBCS_K) {
                                    filters.push(new FullWidthKatakanaFilter(MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === MaskFormat.DBCS_J) {
                                    filters.push(new HiraganaFilter(MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === MaskFormat.DBCS_M) {
                                    filters.push(new ShiftJISFilter(MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === MaskFormat.DBCS_I) {
                                    filters.push(new JISX0208Filter(MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === 'N') {
                                    filters.push(new SBCSKatakanaFilter(MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === MaskFormat.DBCS_N) {
                                    filters.push(new DBCSKatakanaFilter(MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === MaskFormat.DBCS_G) {
                                    filters.push(new DBCSHiraganaFilter(MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === MaskFormat.DBCS_Z) {
                                    filters.push(new FullWidthFilter(MaskFormat.Owner, true));
                                    caret++;
                                } else if(c === MaskFormat.DBCS_T) {
                                    filters.push(new SurrogateFilter(MaskFormat.Owner, true));
                                    caret++;
                                } else //else if (c === DBCS_E) {
                                //    filters.push(new EmojiFilter(MaskFormat.Owner, true));
                                //}
                                //else if (c === DBCS_V) {
                                //    filters.push(new IVSFilter(MaskFormat.Owner, true));
                                //}
                                if(c === '\\' || c === ']' || c === '[' || c === '-' || c === '^') {
                                    //							if (isInclude)
                                    //								include += c;
                                    //							else
                                    //								exclude += c;
                                    //bug#5280
                                    if(include.indexOf(c) !== -1) {
                                        //return false;
                                        caret++;
                                        continue;
                                    }
                                    include += c;
                                    caret++;
                                } else {
                                    return false;
                                }
                            }
                            break;
                        default: {
                            if(subset.length > caret + 2) {
                                if(subset.charAt(caret + 1) === '-') {
                                    // Change the "\u****" or "\***" or "\x**" to a char.
                                    var escapteCharResult = MaskFormat.GetEscapeCharLength(subset.substr(caret + 2), keyType, length);
                                    keyType = escapteCharResult.KeyType;
                                    length = escapteCharResult.Length;
                                    if(escapteCharResult.Result) {
                                        var s = null;
                                        var baseValue = 16;
                                        if(keyType === KeywordType.OctalAscII) {
                                            baseValue = 8;
                                            s = subset.substr(caret + 2 + 1, length - 1);
                                        } else {
                                            s = subset.substr(caret + 2 + 2, length - 2);
                                        }
                                        var newCaret = caret + 2;
                                        subset = subset.substring(0, newCaret) + subset.substr(newCaret + length);
                                        var newStr = String.fromCharCode(parseInt(s, baseValue));
                                        subset = subset.substring(0, newCaret) + newStr + subset.substr(newCaret);
                                    }
                                    // Get range start and range end.
                                    var rangeStart;
                                    var rangeEnd;
                                    if(subset.charAt(caret) > subset.charAt(caret + 2)) {
                                        rangeStart = subset.charAt(caret + 2);
                                        rangeEnd = subset.charAt(caret);
                                    } else {
                                        rangeStart = subset.charAt(caret);
                                        rangeEnd = subset.charAt(caret + 2);
                                    }
                                    // Create the range filter.
                                    var rf = new RangeFilter(rangeStart, rangeEnd, MaskFormat.Owner, true);
                                    filters.push(rf);
                                    caret += 2;
                                    break;
                                }
                            }
                            // Record the excluding or including string.
                            //						if (isInclude)
                            //							include += cc;
                            //						else
                            //							exclude += cc;
                            if(include.indexOf(cc) !== -1) {
                                //return false;
                                //bug#5280, Kevin Huang, Feb-19-2006
                                caret++;
                                continue;
                            }
                            include += cc;
                            break;
                        }
                    }
                    caret++;
                }
                if(include.length > 0) {
                    filters.push(new LimitedFilter(include, "", MaskFormat.Owner, true));
                }
                var icount = filters.length;
                if(result.uf && result.uf.filterArray.length > 0) {
                    for(var i = 0; i < result.uf.filterArray.length; i++) {
                        filters.push(uf.filterArray[i]);
                    }
                }
                result.uf = new UnionFilter(MaskFormat.Owner, true);
                result.uf.AddRange(filters);
                for(var i = 0; i < icount; i++) {
                    result.uf.filterArray[i]._include = isInclude;
                }
                result.Result = true;
                return result;
            };
            MaskFormat.AnalyseEnumGroup = function AnalyseEnumGroup(groupStr, members) {
                groupStr = groupStr.Substring(1, 1 + groupStr.length - 2);
                var caret = 0, last = 0;
                while(caret < groupStr.length) {
                    var index = input.Utility.IndexOfAny(groupStr, [
                        '|', 
                        ')', 
                        '\\', 
                        '('
                    ], caret);
                    if(index === -1) {
                        var member = groupStr.Substring(last);
                        if(member.length === 0) {
                            return false;
                        }
                        members.push(member);
                        caret = groupStr.length;
                        continue;
                    }
                    if(groupStr.charAt(index) === '\\') {
                        var c = groupStr.charAt(index + 1);
                        if(c === '\\' || c === ')' || c === '|' || c === '(') {
                            groupStr = groupStr.Substring(0, index) + groupStr.Substring(index + 1, groupStr.length);
                            caret = index + 1;
                            //add judgement, KevinHuang,2006-4
                            if(caret === groupStr.length) {
                                var member = groupStr.Substring(last);
                                if(member.length === 0) {
                                    return false;
                                }
                                members.push(member);
                            }
                            continue;
                        } else {
                            return false;
                        }
                    }
                    if(groupStr.charAt(index) === '|') {
                        var member = groupStr.Substring(last, index);
                        if(member.length === 0) {
                            return false;
                        }
                        members.push(member);
                        caret = index + 1;
                        last = caret;
                        continue;
                    } else {
                        return false;
                    }
                }
                return true;
            };
            return MaskFormat;
        })();        
        /** @ignore */
        var MaskFieldCollection = (function (_super) {
            __extends(MaskFieldCollection, _super);
            function MaskFieldCollection(owner, count, formatNull) {
                        _super.call(this, count);
                this._focusNull = "";
                this.oldStart = -1;
                this.oldLength = 0;
                this.newStart = -1;
                this.newLength = 0;
                this._owner = owner;
                this.formatIsNull = formatNull;
            }
            MaskFieldCollection.prototype.GetShowLiterals = function () {
                return this._owner.GetShowLiterals();
            };
            MaskFieldCollection.prototype.GetFieldByIndex = function (index) {
                return this.fieldArray[index];
            };
            MaskFieldCollection.prototype.GetLength = function () {
                var isNull = this.ValueIsNull();
                if(isNull && this._focusNull !== "" && !this.formatIsNull) {
                    return this._focusNull.GetLength();
                } else if(isNull === true && this._focusNull !== "") {
                    return 0;
                }
                var lastField = this.GetLastVisibleFieldIndex(this.GetShowLiterals());
                var length = 0;
                for(var i = 0; i <= lastField; i++) {
                    var field = this.GetFieldByIndex(i);
                    length += field.GetLength();
                }
                return length;
            };
            MaskFieldCollection.prototype.GetInputFieldIndexByPos = function (pos) {
                var currentField = null;
                var startOffset = 0;
                var startFieldIndex;
                var posObj = this.GetFieldIndex(pos, startOffset);
                startFieldIndex = posObj.index;
                startOffset = posObj.offset;
                if(startFieldIndex !== 0 && startOffset === 0 && this.fieldArray[startFieldIndex - 1].fieldLabel !== "PromptField") {
                    startFieldIndex--;
                    startOffset = this.fieldArray[startFieldIndex].text.GetLength();
                }
                var field = this.fieldArray[startFieldIndex];
                if(startOffset === field.text.GetLength()) {
                    var k;
                    if(startOffset < field._maxLength) {
                        currentField = startFieldIndex;
                        if(currentField !== this.fieldCount - 1) {
                            for(k = startFieldIndex + 1; k < this.fieldCount; k++) {
                                if(this.fieldArray[k].fieldLabel !== "PromptField") {
                                    break;
                                }
                            }
                        }
                    } else {
                        for(k = startFieldIndex + 1; k < this.fieldCount; k++) {
                            if(this.fieldArray[k].fieldLabel !== "PromptField") {
                                currentField = k;
                                break;
                            }
                        }
                    }
                } else {
                    currentField = startFieldIndex;
                }
                var retObj = {
                };
                var cField = {
                };
                if(currentField) {
                    var findOut = false;
                    while(findOut === false) {
                        field = this.fieldArray[currentField];
                        if(field.fieldLabel === "FilterField") {
                            cField.fieldMark = field._filter.filterLabel;
                            findOut = true;
                        } else if(field.fieldLabel === "EnumField") {
                            cField.fieldMark = "Enum";
                            findOut = true;
                        } else {
                            if(currentField !== this.fieldCount - 1) {
                                currentField++;
                            } else {
                                cField = null;
                                break;
                            }
                        }
                        cField.fieldIndex = currentField;
                    }
                } else {
                    cField = null;
                }
                if(cField != null) {
                    retObj.currentField = cField;
                    return retObj;
                }
                return null;
            };
            MaskFieldCollection.prototype.GetCurrentField = function (position) {
                var fieldPos = {
                };
                var length = 0;
                var fCount = 0;
                for(var i = 0; i < this.fieldCount; i++) {
                    var field = this.fieldArray[i];
                    if(field.fieldLabel === "PromptField") {
                        fCount++;
                    }
                    var fieldLength = field.GetLength();
                    length += fieldLength;
                    if(position <= length) {
                        if(field.fieldLabel === "PromptField") {
                            if(position === length - fieldLength) {
                                fieldPos.index = i - fCount;
                            } else if(position === length) {
                                fieldPos.index = i - fCount + 1;
                            } else {
                                fieldPos.index = -1;
                            }
                        } else {
                            fieldPos.index = i - fCount;
                        }
                        return fieldPos;
                    }
                }
            };
            MaskFieldCollection.prototype.GetText = function () {
                var text = "";
                for(var i = 0; i < this.fieldCount; i++) {
                    var field = this.fieldArray[i];
                    text += field.text;
                }
                return text;
            };
            MaskFieldCollection.prototype.GetTextSimpleMode = function (includeLiterals) {
                var text = "";
                for(var i = 0; i < this.fieldCount; i++) {
                    var field = this.fieldArray[i];
                    if(field.fieldLabel === "PromptField" && !includeLiterals) {
                        continue;
                    }
                    text += field.text;
                }
                return text;
            };
            MaskFieldCollection.prototype.GetExistLength = function () {
                var lastInputField = this.fieldCount;
                var i;
                var field;
                for(i = this.fieldCount - 1; i >= 0; i--) {
                    field = this.fieldArray[i];
                    if(field.fieldLabel === "PromptField") {
                        continue;
                    } else {
                        lastInputField = i;
                        break;
                    }
                }
                var length = 0;
                for(i = 0; i <= lastInputField; i++) {
                    field = this.fieldArray[i];
                    if(i === lastInputField) {
                        if(length >= 21474000) {
                            length = field._maxLength;
                        } else {
                            length += field._maxLength;
                        }
                    } else {
                        length += field.text.GetLength();
                    }
                }
                return length;
            };
            MaskFieldCollection.prototype.GetNonLiteralsText = function (start, length) {
                var retText = "";
                var startOffset = 0;
                var startFieldIndex;
                var posObj = this.GetFieldIndex(start, startOffset);
                startFieldIndex = posObj.index;
                startOffset = posObj.offset;
                var endOffset = 0;
                var endFieldIndex;
                posObj = this.GetFieldIndex(start + length, endOffset);
                endFieldIndex = posObj.index;
                endOffset = posObj.offset;
                if(endFieldIndex !== 0 && endOffset === 0) {
                    endFieldIndex--;
                    endOffset = this.fieldArray[endFieldIndex].text.GetLength();
                }
                for(var i = startFieldIndex; i <= endFieldIndex; i++) {
                    var field = this.fieldArray[i];
                    if(field.fieldLabel !== "PromptField") {
                        if(startFieldIndex === endFieldIndex) {
                            retText = field.text.Substring(startOffset, endOffset);
                            if(retText.GetLength() > field._trueLength) {
                                retText = retText.Substring(0, field._trueLength);
                            }
                        } else if(i === startFieldIndex) {
                            retText += field.text.Substring(startOffset, field.text.GetLength());
                        } else if(i === endFieldIndex) {
                            retText += field.text.Substring(0, endOffset);
                        } else {
                            retText += field.text.Substring(0, field.text.GetLength());
                        }
                    }
                }
                return retText;
            };
            MaskFieldCollection.prototype.GetNonPromptText = function (start, length) {
                var retText = "";
                var startOffset = 0;
                var startFieldIndex;
                var posObj = this.GetFieldIndex(start, startOffset);
                startFieldIndex = posObj.index;
                startOffset = posObj.offset;
                var endOffset = 0;
                var endFieldIndex;
                posObj = this.GetFieldIndex(start + length, endOffset);
                endFieldIndex = posObj.index;
                endOffset = posObj.offset;
                if(endFieldIndex !== 0 && endOffset === 0) {
                    endFieldIndex--;
                    endOffset = this.fieldArray[endFieldIndex].text.GetLength();
                }
                for(var i = startFieldIndex; i <= endFieldIndex; i++) {
                    var field = this.fieldArray[i];
                    if(field.fieldLabel !== "PromptField") {
                        if(startFieldIndex === endFieldIndex) {
                            retText = field.text.Substring(startOffset, endOffset);
                        } else if(i === startFieldIndex) {
                            retText += field.text.Substring(startOffset, field.text.GetLength());
                        } else if(i === endFieldIndex) {
                            retText += field.text.Substring(0, endOffset);
                        } else {
                            retText += field.text;
                        }
                    }
                }
                return retText;
            };
            MaskFieldCollection.prototype.ValueIsNull = function () {
                for(var i = 0; i < this.fieldCount; i++) {
                    var field = this.fieldArray[i];
                    if(field.fieldLabel === "PromptField") {
                        continue;
                    } else {
                        if(field.GetFieldStatus() !== 0) {
                            return false;
                        }
                    }
                }
                return true;
            };
            MaskFieldCollection.prototype.ValueIsFull = function (mode) {
                mode = (!mode) ? 0 : mode;
                var i;
                var field;
                if(mode != null && mode === 1) {
                    for(i = 0; i < this.fieldCount; i++) {
                        field = this.fieldArray[i]//modified by sj 2008.8.13 for bug 115.
                        ;
                        if(this.fieldCount === 1 && field._minLength === 0) {
                            return true;
                        }
                        if(field.fieldLabel === "PromptField") {
                            continue;
                        } else {
                            if(!field.GetFieldIsFull()) {
                                return false;
                            }
                        }
                    }
                } else {
                    for(i = 0; i < this.fieldCount; i++) {
                        field = this.fieldArray[i];
                        if(field.fieldLabel === "PromptField") {
                            continue;
                        } else {
                            if(field.GetFieldStatus() !== 2) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            };
            MaskFieldCollection.prototype.GetShowText = function (showliterals, type, notNull) {
                if(!notNull) {
                    var isNull = this.ValueIsNull();
                    if(isNull === true && this._focusNull !== "" && type == "") {
                        return this._focusNull;
                    } else if(isNull === true && this._focusNull !== "" && type == null) {
                        return "";
                    }
                    if(isNull === true && type === "LoseFocus") {
                        if(this._owner._getDisplayNullExpression() !== null) {
                            return this._owner._getDisplayNullExpression();
                        } else {
                            return this.GetText();
                        }
                    }
                }
                var lastField = this.GetLastVisibleFieldIndex(showliterals);
                if(lastField < 0) {
                    return "";
                }
                var text = "";
                for(var i = 0; i < lastField; i++) {
                    text += this.fieldArray[i].text;
                }
                if(lastField < this.fieldCount) {
                    var field = this.fieldArray[lastField];
                    if(field.fieldLabel === "PromptField" || showliterals === input.ShowLiterals.Always) {
                        text += this.fieldArray[lastField].text;
                    } else {
                        text += field.text.Substring(0, field._trueLength);
                    }
                }
                return text;
            };
            MaskFieldCollection.prototype.GetLastVisibleFieldIndex = function (showliterals) {
                var lastField = this.fieldCount - 1;
                if(showliterals !== input.ShowLiterals.Always) {
                    var end = this.fieldCount - 1;
                    var full = true;
                    for(lastField = end; lastField >= 0; lastField--) {
                        var field = this.fieldArray[lastField];
                        if(field.fieldLabel === "PromptField") {
                            continue;
                        } else if(field._trueLength === 0) {
                            full = false;
                            continue;
                        } else if(field._trueLength > 0 && field._trueLength < field._minLength) {
                            break;
                        } else if(showliterals === input.ShowLiterals.PostDisplay) {
                            if(full) {
                                lastField = end;
                            }
                            break;
                        } else {
                            while(lastField < end && this.fieldArray[lastField + 1].fieldLabel === "PromptField") {
                                lastField++;
                            }
                            break;
                        }
                    }
                }
                return lastField;
            };
            MaskFieldCollection.prototype.GetValue = function () {
                var endFieldIndex = this.fieldCount - 1;
                var field;
                for(; endFieldIndex >= 0; endFieldIndex--) {
                    field = this.fieldArray[endFieldIndex]//modified by sj 2008.8.14 for bug 404
                    ;
                    if(!(field.fieldLabel === "PromptField") && (field._trueLength !== 0)) {
                        break;
                    }
                }
                if(endFieldIndex < 0) {
                    return "";
                }
                var text = "";
                for(var j = 0; j <= endFieldIndex; j++) {
                    field = this.fieldArray[j];
                    if(field.fieldLabel === "PromptField") {
                        continue;
                    }
                    var length = field._trueLength;
                    var fieldText = field.text;
                    var retValue = fieldText;
                    if(field.fieldLabel === 'FilterField') {
                        retValue = retValue.Substring(0, length);
                        for(var k = 0; k < length; k++) {
                            if(field._bitState[k] === false) {
                                retValue = retValue.Substring(0, k) + " " + retValue.Substring(k + 1, retValue.GetLength());
                            }
                        }
                        var fieldTextLength = fieldText.GetLength();
                        var retValueLength = retValue.GetLength();
                        if(length === 0 && fieldTextLength !== 0) {
                            if(j !== endFieldIndex) {
                                var temp = "";
                                for(var len = 0; len < fieldTextLength; len++) {
                                    temp += " ";
                                }
                                retValue = temp;
                            }
                        } else if(fieldTextLength > retValueLength) {
                            if(j !== endFieldIndex) {
                                var temp = "";
                                for(var len = 0; len < fieldTextLength - retValueLength; len++) {
                                    temp += " ";
                                }
                                retValue += temp;
                            }
                        }
                    } else {
                        if(field._activeItem === -1) {
                            retValue = " ";
                        }
                    }
                    text += retValue;
                }
                return text;
            };
            MaskFieldCollection.prototype.GetOldValue = function () {
                var text = "";
                var field;
                for(var j = 0; j < this.fieldCount; j++) {
                    field = this.fieldArray[j];
                    if(field.fieldLabel === "PromptField") {
                        continue;
                    }
                    var tempText;
                    if(field.fieldLabel === 'FilterField') {
                        tempText = field.undoText;
                        if(field._undoBitState && field._undoBitState.length > 0) {
                            var isCut = true;
                            for(var i = field._undoBitState.length - 1; i >= 0; i--) {
                                if(field._undoBitState[i] === false) {
                                    if(isCut) {
                                        tempText = tempText.Substring(0, tempText.GetLength() - 1);
                                    } else {
                                        tempText = tempText.Substring(0, i) + " " + tempText.Substring(i + 1, tempText.GetLength());
                                    }
                                } else {
                                    isCut = false;
                                }
                            }
                        } else {
                            tempText = "";
                        }
                    } else {
                        if(field._undoItem !== -1) {
                            tempText = field.undoText;
                        } else {
                            tempText = "";
                        }
                    }
                    text += tempText;
                }
                return text;
            };
            MaskFieldCollection.prototype.SetValue = function (text, includeprompt) {
                if(!text) {
                    this.ClearContent();
                    return true;
                }
                var include = false;
                if(includeprompt != null) {
                    include = includeprompt;
                }
                if(this.SetFieldCollectionValue(text, include)) {
                    return true;
                } else {
                    this.RollBack();
                    return false;
                }
            };
            MaskFieldCollection.prototype.SetFieldCollectionValue = function (text, includeprompt) {
                this.ClearContent();
                var include = false;
                if(includeprompt != null) {
                    include = includeprompt;
                }
                if(text.GetLength() !== 0) {
                    this.Insert(0, text, include, false);
                }
                return true;
            };
            MaskFieldCollection.prototype.ClearContent = function () {
                this.oldStart = -1;
                this.oldLength = 0;
                this.newStart = -1;
                this.newLength = 0;
                if(this.formatIsNull) {
                    this.SaveUndoState();
                }
                if(this.fieldCount > 0) {
                    for(var i = 0; i < this.fieldCount; i++) {
                        var field = this.fieldArray[i];
                        field.oldText = field.text;
                        field.Delete(0, field.text.GetLength());
                    }
                }
            };
            MaskFieldCollection.prototype.RollBack = function () {
                if(this.fieldCount > 0) {
                    for(var i = 0; i < this.fieldCount; i++) {
                        var field = this.fieldArray[i];
                        field.RollBack();
                    }
                }
            };
            MaskFieldCollection.prototype.SaveOldState = function () {
                if(this.fieldCount > 0) {
                    for(var i = 0; i < this.fieldCount; i++) {
                        var field = this.fieldArray[i];
                        if(field.fieldLabel !== "PromptField") {
                            field.SaveOldState();
                        }
                    }
                }
            };
            MaskFieldCollection.prototype.SaveUndoState = function () {
                if(this.formatIsNull) {
                    var field = this.fieldArray[0];
                    var index = -1;
                    if(this.oldStart === -1) {
                        field.SaveUndoState();
                        index = this.newStart;
                    } else {
                        var newtext = field.text.substr(this.newStart, this.newLength);
                        index = field.undoText.IndexOf(newtext, this.oldStart);
                        if(index !== this.oldStart + this.oldLength) {
                            index = this.newStart;
                            if(index + this.newLength !== this.oldStart) {
                                field.SaveUndoState();
                            }
                        }
                    }
                    if(this.oldStart > 0) {
                        this.oldStart = Math.min(this.oldStart, index);
                    } else {
                        this.oldStart = index;
                    }
                    this.oldLength += this.newLength;
                } else {
                    if(this.fieldCount > 0) {
                        for(var i = 0; i < this.fieldCount; i++) {
                            var field = this.fieldArray[i];
                            if(field.fieldLabel !== "PromptField") {
                                field.SaveUndoState();
                            }
                        }
                    }
                }
            };
            MaskFieldCollection.prototype.Undo = function () {
                this.oldStart = -1;
                this.oldLength = 0;
                this.newStart = -1;
                this.newLength = 0;
                if(this.fieldCount > 0) {
                    for(var i = 0; i < this.fieldCount; i++) {
                        var field = this.fieldArray[i];
                        if(field.fieldLabel !== "PromptField") {
                            field.Undo();
                        }
                    }
                }
            };
            MaskFieldCollection.prototype.PerformSpin = function (position, increment, wrap) {
                var offset;
                var posObj = this.GetFieldIndex(position, offset);
                var fieldIndex = posObj.index;
                offset = posObj.offset;
                this.SaveOldState();
                if(offset > 0 || this.fieldArray[fieldIndex].fieldLabel === "EnumField") {
                    offset = this.fieldArray[fieldIndex].PerformSpin(offset, increment, wrap);
                    var prelength = 0;
                    for(var j = 0; j < fieldIndex; j++) {
                        prelength += this.fieldArray[j].text.GetLength();
                    }
                    position = prelength + offset;
                } else {
                    var i = fieldIndex;
                    var field;
                    for(; i < this.fieldCount; i++) {
                        field = this.fieldArray[i];
                        if(field._minLength === 0) {
                            if(field.text.GetLength() === 0) {
                                continue;
                            } else {
                                break;
                            }
                        } else if(field.fieldLabel === "EnumField") {
                            offset = field.PerformSpin(offset, increment, wrap);
                            var prelength = 0;
                            for(var j = 0; j < fieldIndex; j++) {
                                prelength += this.fieldArray[j].text.GetLength();
                            }
                            position = prelength + offset;
                            return position;
                        } else {
                            break;
                        }
                    }
                    if(fieldIndex > 0) {
                        field = this.fieldArray[fieldIndex - 1];
                        offset = field.text.GetLength();
                        if(offset < field._minLength) {
                            offset = field._minLength;
                        }
                        offset = field.PerformSpin(offset, increment, wrap);
                        if(field.fieldLabel === "EnumField") {
                            var prelength = 0;
                            for(var j = 0; j < fieldIndex - 1; j++) {
                                prelength += this.fieldArray[j].text.GetLength();
                            }
                            position = prelength + offset;
                        }
                    }
                }
                return position;
            };
            MaskFieldCollection.prototype.Delete = function (start, length) {
                if(this.fieldCount === 0) {
                    return start;
                }
                var offset = 0;
                this.SaveOldState();
                var retObj = this.GetFieldIndex(start, offset);
                var startIndex = retObj.index;
                offset = retObj.offset;
                if(this.fieldArray[startIndex].fieldLabel === "PromptField" && length > this.fieldArray[startIndex].text.GetLength() - offset) {
                    start += this.fieldArray[startIndex].text.GetLength() - offset;
                    length -= this.fieldArray[startIndex].text.GetLength() - offset;
                    startIndex++;
                    offset = 0;
                }
                this.newStart = start;
                this.newLength = length;
                if(this.formatIsNull) {
                    this.SaveUndoState();
                }
                var endOffset = 0;
                retObj = this.GetFieldIndex(start + length, endOffset);
                var endIndex = retObj.index;
                endOffset = retObj.offset;
                while(endIndex !== 0 && endOffset === 0) {
                    var field = this.fieldArray[endIndex - 1];
                    if(!(field.fieldLabel === "PromptField")) {
                        endIndex--;
                        endOffset = (this.fieldArray[endIndex].text.GetLength() > this.fieldArray[endIndex]._minLength ? this.fieldArray[endIndex].text.GetLength() : this.fieldArray[endIndex]._minLength);
                    } else {
                        break;
                    }
                }
                for(var i = startIndex; i <= endIndex; i++) {
                    var field = this.fieldArray[i];
                    var startOffset = offset;
                    if(startIndex === endIndex) {
                        if(endOffset > offset) {
                            offset = field.Delete(offset, endOffset - offset);
                        } else {
                            offset -= (offset - endOffset);
                        }
                    } else if(i === startIndex) {
                        var len = field.text.GetLength() - offset;
                        if(len > 0) {
                            offset = field.Delete(offset, field.text.GetLength() - offset);
                        }
                    } else if(i === endIndex) {
                        offset = field.Delete(offset, endOffset);
                    } else {
                        offset = field.Delete(offset, field.text.GetLength());
                    }
                    if(offset != null) {
                        start += offset - startOffset;
                    }
                    offset = 0;
                }
                return start;
            };
            MaskFieldCollection.prototype.Replace = function (start, length, text, includePrompt) {
                var retObj = {
                };
                retObj.cursorPos = start;
                retObj.text = text;
                var startIndex = this.GetFieldIndex(start, offset);
                var offset = 0;
                var startIndex = 0;
                var posObj = {
                };
                posObj = this.GetFieldIndex(start, offset);
                startIndex = posObj.index;
                offset = posObj.offset;
                this.SaveOldState();
                var field;
                for(; startIndex < this.fieldCount; startIndex++) {
                    field = this.fieldArray[startIndex];
                    if(field._minLength > 0 || field.text.GetLength() > 0) {
                        break;
                    }
                }
                while(startIndex !== 0 && offset === 0) {
                    if(this.fieldArray[startIndex].fieldLabel === 'PromptField')// && !this[startIndex - 1].IsOver)
                     {
                        startIndex--;
                        field = this.fieldArray[startIndex];
                        offset = field.text.GetLength();
                        if(offset < field._minLength) {
                            offset = field._minLength;
                        }
                    } else {
                        break;
                    }
                }
                this.newStart = start;
                this.newLength = length;
                var endOffset = 0;
                var endIndex;
                posObj = this.GetFieldIndex(start + length, endOffset);
                endIndex = posObj.index;
                endOffset = posObj.offset;
                var orientLength = 0;
                for(var j = startIndex; j < endIndex; j++) {
                    field = this.fieldArray[endIndex - 1];
                    orientLength += field.text.GetLength();
                }
                orientLength = orientLength + endOffset;
                -startOffset;
                while(endIndex !== 0 && endOffset === 0) {
                    field = this.fieldArray[endIndex - 1];
                    if(!(field.fieldLabel === 'PromptField') && field.text.GetLength() < field._maxLength) {
                        endIndex--;
                        endOffset = this.fieldArray[endIndex].text.GetLength();
                    } else {
                        break;
                    }
                }
                var oldText = text;
                var existInvalid = false;
                var fieldStart = start - offset;
                for(var i = startIndex; i <= this.fieldCount - 1; i++) {
                    existInvalid = false;
                    field = this.fieldArray[i];
                    var fieldLength = field.text.GetLength() > field._minLength ? field.text.GetLength() : field._minLength;
                    if(field.fieldLabel === 'PromptField') {
                        fieldLength = field.GetLength();
                        if(includePrompt)// Compare the string with prompt field.
                         {
                            var fieldText = field.text.Substring(offset, field.text.GetLength());
                            var oldlength = text.GetLength();
                            if(text.GetLength() >= fieldText.GetLength()) {
                                if(text.Substring(0, fieldText.GetLength()) !== fieldText) {
                                    existInvalid = true;
                                }
                                text = text.Substring(fieldText.GetLength(), text.GetLength());
                                start += fieldText.GetLength();
                            } else {
                                if(text.Substring(0, fieldText.GetLength()) !== fieldText) {
                                    existInvalid = true;
                                }
                                text = "";
                                start += text.GetLength();
                            }
                            if(existInvalid) {
                                if(exception) {
                                }
                                if(oldlength === text.GetLength()) {
                                    break;
                                }
                            }
                        } else if((fieldStart + offset) === start) {
                            start += (fieldLength - offset);
                        }
                        fieldStart += (field.text.GetLength() - offset);
                    } else {
                        var startOffset = offset;
                        var isLast = (i === this.fieldCount - 1);
                        if(i > endIndex) {
                            var insObj = {
                            };
                            var isLast = (i === this.fieldCount - 1);
                            insObj = field.Insert(offset, text, isLast);
                            offset = insObj.offset;
                            text = insObj.text;
                            existInvalid = insObj.existInvalid;
                        } else if(startIndex === endIndex) {
                            var repRet = {
                            };
                            repRet = field.Replace(offset, endOffset - offset, text, isLast);
                            offset = repRet.offset;
                            text = repRet.text;
                            existInvalid = repRet.existInvalid;
                        } else if(i === startIndex) {
                            var repRet = {
                            };
                            repRet = field.Replace(offset, fieldLength - offset, text, isLast);
                            offset = repRet.offset;
                            text = repRet.text;
                            existInvalid = repRet.existInvalid;
                        } else if(i === endIndex) {
                            var repRet = {
                            };
                            if(endOffset - offset > 0) {
                                repRet = field.Replace(offset, endOffset - offset, text, isLast);
                            } else if(length > 0) {
                                repRet = field.Replace(offset, length, text, isLast);
                            }
                            offset = repRet.offset;
                            text = repRet.text;
                            existInvalid = repRet.existInvalid;
                        } else {
                            var repRet = {
                            };
                            repRet = field.Replace(offset, fieldLength, text);
                            offset = repRet.offset;
                            text = repRet.text;
                            existInvalid = repRet.existInvalid;
                        }
                        var exception = (field.GetFieldStatus() !== 2);
                        if(exception && existInvalid) {
                            break;
                        }
                        start += offset - startOffset;
                        fieldStart += (field._minLength > field.text.GetLength() ? field._minLength : field.text.GetLength());
                    }
                    offset = 0;
                    if(text === "") {
                        if(i < endIndex) {
                            i++;
                            var j = i;
                            var endlength = 0;
                            ;
                            for(; i < endIndex; i++) {
                                if(this.fieldArray[i].fieldLabel !== "PromptField") {
                                    this.fieldArray[i].Delete(offset, this.fieldArray[i].text.GetLength());
                                }
                            }
                            for(var k = 0; k < j; k++) {
                                var field = this.fieldArray[k];
                                var fieldLength = field.GetLength();
                                endlength += fieldLength;
                            }
                            if(start === endlength && field._trueLength === field._maxLength) {
                                for(; j <= endIndex; j++) {
                                    if((this.fieldArray[j].fieldLabel === "PromptField") && (j !== this.fieldCount - 1)) {
                                        start += this.fieldArray[j].text.GetLength();
                                    } else {
                                        break;
                                    }
                                }
                            }
                            if(endOffset === 0) {
                                break;
                            }
                            if(this.fieldArray[endIndex].fieldLabel !== "PromptField") {
                                this.fieldArray[endIndex].Delete(offset, endOffset);
                            }
                        }
                        break;
                    }
                }
                if(oldText === text) {
                    this.RollBack();
                    retObj.success = false;
                } else {
                    retObj.success = true;
                }
                retObj.cursorPos = start;
                retObj.text = text;
                return retObj;
            };
            MaskFieldCollection.prototype.SetText = function (text, includePrompt) {
                var start = 0;
                var returnInfo = {
                };//the current function returns an Object();
                
                returnInfo.cursorPos = start;
                returnInfo.text = text;
                if(this.fieldCount === 0 || !text || start < 0)//|| start >= this.GetLength())
                 {
                    return returnInfo;
                }
                var offset = 0;
                var startIndex = 0;
                var retObj = {
                };
                retObj = this.GetFieldIndex(start, offset);
                startIndex = retObj.index;
                offset = retObj.offset;
                if(offset === this.fieldArray[startIndex]._maxLength) {
                    return returnInfo;
                }
                while(startIndex !== 0 && offset === 0) {
                    var field = this.fieldArray[startIndex - 1];
                    if(!(field.fieldLabel === 'PromptField') && field.text.GetLength() < field._maxLength) {
                        startIndex--;
                        offset = this.fieldArray[startIndex]._trueLength;
                        if(offset < this.fieldArray[startIndex]._minLength) {
                            // *****
                            offset = this.fieldArray[startIndex]._minLength;
                        }
                    } else {
                        break;
                    }
                }
                var existInvalid = false;
                var i = startIndex;
                var fieldStart = start - offset;
                for(; i < this.fieldCount; i++) {
                    existInvalid = false;
                    var field = this.fieldArray[i];
                    if(field.fieldLabel === 'PromptField') {
                        if(includePrompt)// Compare the string with prompt field.
                         {
                            var fieldText = field.text.Substring(offset, field.text.GetLength());
                            var oldlength = text.GetLength();
                            if(text.GetLength() >= fieldText.GetLength()) {
                                if(text.Substring(0, fieldText.GetLength()) !== fieldText) {
                                    existInvalid = true;
                                } else {
                                    text = text.Substring(fieldText.GetLength(), text.GetLength())//text.Remove(0, fieldText.GetLength());
                                    ;
                                    start += fieldText.GetLength();
                                }
                            } else {
                                if(fieldText.Substring(0, text.GetLength()) !== text) {
                                    existInvalid = true;
                                }
                                text = "";
                                start += text.GetLength();
                            }
                            if(existInvalid) {
                                if(exception) {
                                }
                                if(text.GetLength() === oldlength) {
                                    returnInfo.isValid = false;
                                    return returnInfo;
                                }
                            }
                        } else if((fieldStart + offset) === start) {
                            start += (field.maxLength - offset);
                        }
                        fieldStart += (field.maxLength - offset);
                    } else {
                        var startOffset = offset;
                        var insObj = {
                        };
                        var isLast = (i === this.fieldCount - 1);
                        insObj = field.SetTextInternal(text, offset, isLast);
                        this.oldStart = -1;
                        this.oldLength = 0;
                        this.newStart = -1;
                        this.newLength = 0;
                        if(this.formatIsNull) {
                            this.SaveUndoState();
                        }
                        offset = insObj.offset;
                        text = insObj.text;
                        existInvalid = insObj.existInvalid;
                        var exception = insObj.exception;
                        if(existInvalid && exception) {
                            returnInfo.isValid = false;
                            return returnInfo;
                        }
                        start += offset - startOffset;
                        fieldStart += field._minLength < field._trueLength ? field._trueLength : field._minLength;
                    }
                    offset = 0;
                    if((text.GetLength() === 0) && (existInvalid || exception)) {
                        if(!includePrompt) {
                            break;
                        } else if(existInvalid) {
                            returnInfo.isValid = false;
                            return returnInfo;
                        }
                    }
                }
                if(i >= this.fieldCount && text !== "" && text.GetLength() > 0) {
                    returnInfo.isValid = false;
                    return returnInfo;
                } else {
                    var truePosObj = this.GetFieldIndex(start, offset);
                    var newIndex = truePosObj.index;
                    var newoffset = truePosObj.offset;
                    if(i < this.fieldCount) {
                        if(newIndex === i + 1 && newoffset === 0 && this.fieldArray[i].text.GetLength() === this.fieldArray[i]._maxLength) {
                            if(this.fieldArray[i + 1].fieldLabel === 'PromptField') {
                                start += this.fieldArray[i + 1].GetLength();
                            }
                        }
                    }
                    returnInfo.isValid = true;
                    returnInfo.cursorPos = start;
                    returnInfo.text = text;
                    return returnInfo;
                }
            };
            MaskFieldCollection.prototype.Insert = function (start, text, includePrompt, isSetText) {
                var returnInfo = {
                };//the current function returns an Object();
                
                returnInfo.cursorPos = start;
                returnInfo.text = text;
                if(this.fieldCount === 0 || !text || start < 0)//|| start >= this.GetLength())
                 {
                    return returnInfo;
                }
                var offset = 0;
                var retObj = this.GetFieldIndex(start, offset);
                var startIndex = retObj.index;
                offset = retObj.offset;
                if(offset === this.fieldArray[startIndex]._maxLength) {
                    return returnInfo;
                }
                while(startIndex !== 0 && offset === 0) {
                    var field = this.fieldArray[startIndex - 1];
                    if(!(field.fieldLabel === 'PromptField') && field.text.GetLength() < field._maxLength) {
                        startIndex--;
                        offset = this.fieldArray[startIndex]._trueLength;
                        if(offset < this.fieldArray[startIndex]._minLength)// *****
                         {
                            offset = this.fieldArray[startIndex]._minLength;
                            returnInfo = this.InsertProcess(startIndex, offset, start, text, includePrompt);
                            if(returnInfo.text !== "") {
                                if(start === offset) {
                                    startIndex++;
                                    offset = 0;
                                    break;
                                }
                            } else {
                                return returnInfo;
                            }
                        }
                    } else {
                        break;
                    }
                }
                return this.InsertProcess(startIndex, offset, start, text, includePrompt, isSetText);
            };
            MaskFieldCollection.prototype.InsertProcess = function (startIndex, offset, start, text, includePrompt, isSetText) {
                var returnInfo = {
                };
                var existInvalid = false;
                var i = startIndex;
                var fieldStart = start - offset;
                this.SaveOldState();
                for(; i < this.fieldCount; i++) {
                    existInvalid = false;
                    var field = this.fieldArray[i];
                    if(field.fieldLabel === 'PromptField') {
                        if(includePrompt)// Compare the string with prompt field.
                         {
                            var fieldText = field.text.Substring(offset, field.text.GetLength());
                            var oldlength = text.GetLength();
                            if(text.GetLength() >= fieldText.GetLength()) {
                                if(text.Substring(0, fieldText.GetLength()) !== fieldText) {
                                    existInvalid = true;
                                }
                                text = text.Substring(fieldText.GetLength(), text.GetLength())//text.Remove(0, fieldText.GetLength());
                                ;
                                start += fieldText.GetLength();
                            } else {
                                if(fieldText.Substring(0, text.GetLength()) !== text) {
                                    existInvalid = true;
                                }
                                text = "";
                                start += text.GetLength();
                            }
                            if(existInvalid) {
                                if(exception) {
                                }
                                if(text.GetLength() === oldlength) {
                                    break;
                                }
                            }
                        } else {
                            //if ((fieldStart + offset) === start)
                            start += (field.maxLength - offset);
                        }
                        fieldStart += (field.maxLength - offset);
                    } else {
                        var startOffset = offset;
                        var isLast = (i === this.fieldCount - 1);
                        var insObj = field.Insert(offset, text, isLast, isSetText);
                        offset = insObj.offset;
                        text = insObj.text;
                        existInvalid = insObj.existInvalid;
                        var exception = insObj.exception;
                        if(existInvalid && exception) {
                            if(text === returnInfo.text) {
                                return returnInfo;
                            } else {
                                break;
                            }
                        }
                        start += offset - startOffset;
                        fieldStart += field._minLength < field._trueLength ? field._trueLength : field._minLength;
                    }
                    offset = 0;
                    if(text.GetLength() === 0) {
                        break;
                    }
                }
                if(i >= this.fieldCount && text !== "" && text.GetLength() > 0 && text === returnInfo.text) {
                    return returnInfo;
                } else {
                    var truePosObj = this.GetFieldIndex(start, offset);
                    var newIndex = truePosObj.index;
                    var newoffset = truePosObj.offset;
                    if(i < this.fieldCount) {
                        if(newIndex === i + 1 && newoffset === 0 && this.fieldArray[i].text.GetLength() === this.fieldArray[i]._maxLength && this.GetShowLiterals() !== input.ShowLiterals.PostDisplay) {
                            if(this.fieldArray[i + 1].fieldLabel === 'PromptField' && i + 1 !== this.fieldCount - 1) {
                                start += this.fieldArray[i + 1].GetLength();
                            }
                        }
                    }
                    returnInfo.cursorPos = start;
                    returnInfo.text = text;
                    return returnInfo;
                }
            };
            MaskFieldCollection.prototype.MoveField = function (pos, isForward) {
                var posInfo = this.GetFieldIndex(pos);
                var fieldIndex = posInfo.index;
                var fieldOffset = posInfo.offset;
                if(fieldIndex === -1) {
                    return -1;
                }
                if(isForward) {
                    if(fieldIndex === this.fieldCount - 1) {
                        return -1;
                    }
                    while(this.GetFieldByIndex(fieldIndex).text.GetLength() === 0 && fieldIndex < this.fieldCount) {
                        fieldIndex++;
                    }
                    if(fieldIndex === this.fieldCount - 1) {
                        return -1;
                    }
                    fieldIndex++;
                    if(this.GetFieldByIndex(fieldIndex).fieldLabel === "PromptField") {
                        if(fieldIndex === this.fieldCount - 1) {
                            return -1;
                        } else {
                            fieldIndex++;
                        }
                    }
                    var length = 0;
                    for(var i = 0; i < fieldIndex; i++) {
                        length += this.GetFieldByIndex(i).GetLength();
                    }
                    return length;
                } else {
                    if(fieldIndex === 0 || (fieldIndex === 1 && fieldOffset === 0)) {
                        return -1;
                    }
                    while(this.GetFieldByIndex(fieldIndex).text.GetLength() === 0 && fieldIndex > 0) {
                        fieldIndex--;
                    }
                    if(fieldIndex === 0) {
                        return -1;
                    }
                    fieldIndex--;
                    if(this.GetFieldByIndex(fieldIndex).fieldLabel === "PromptField") {
                        if(fieldIndex === 0) {
                            return -1;
                        } else {
                            fieldIndex--;
                        }
                    }
                    var length = 0;
                    for(var i = 0; i < fieldIndex; i++) {
                        length += this.GetFieldByIndex(i).GetLength();
                    }
                    return length;
                }
            };
            MaskFieldCollection.prototype.GetPosByCurrentField = function (curField) {
                if(curField == null) {
                    return null;
                }
                var startIndex = 0;
                var insertIndex = -1;
                var findable = false;
                for(; startIndex < this.fieldCount; startIndex++) {
                    var field = this.fieldArray[startIndex];
                    if(field.fieldLabel !== "PromptField") {
                        insertIndex++;
                    }
                    if(insertIndex === curField) {
                        findable = true;
                        break;
                    }
                }
                if(findable) {
                    return this.GetFieldRange(startIndex);
                } else {
                    if(insertIndex === -1) {
                        return null;
                    } else {
                        if(startIndex >= this.fieldCount) {
                            startIndex = this.fieldCount - 1;
                        }
                        while(this.fieldArray[startIndex].fieldLabel === "PromptField") {
                            startIndex--;
                        }
                        return this.GetFieldRange(startIndex);
                    }
                }
            };
            MaskFieldCollection.prototype.GetFirstInputPosition = function () {
                var isNull = this.ValueIsNull();
                if(isNull && this._focusNull !== "" && !this.formatIsNull) {
                    return 0;
                }
                if(this.fieldArray[0].fieldLabel === "PromptField") {
                    return this.GetFieldRange(1).start;
                }
                return 0;
            };
            MaskFieldCollection.prototype.GetTotalInputFieldCount = function () {
                var result = 0;
                if(this.fieldCount > 0) {
                    for(var i = 0; i < this.fieldCount; i++) {
                        var field = this.fieldArray[i];
                        if(field.fieldLabel !== "PromptField") {
                            result++;
                        }
                    }
                }
                return result;
            };
            MaskFieldCollection.prototype.GetFieldIndexByPos = function (position) {
                return this.GetFieldIndex(position);
            };
            MaskFieldCollection.prototype.CanUndo = function () {
                if(this.fieldCount > 0) {
                    for(var i = 0; i < this.fieldCount; i++) {
                        var field = this.fieldArray[i];
                        if(field.fieldLabel !== "PromptField") {
                            if(field.undoTempText !== field.text) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            };
            MaskFieldCollection.prototype.GetRealFieldRange = function (fieldIndex) {
                var fieldRange = {
                };
                fieldRange.start = 0;
                fieldRange.length = 0;
                var length = 0;
                var realfield = -1;
                var fieldpos = -1;
                for(var i = 0; i < this.fieldCount; i++) {
                    if(this.fieldArray[i].fieldLabel !== "PromptField") {
                        realfield++;
                    }
                    if(realfield === fieldIndex) {
                        fieldpos = i;
                        break;
                    }
                }
                for(var i = 0; i < fieldpos; i++) {
                    var field = this.GetFieldByIndex(i);
                    length += field.GetLength();
                }
                var currentField = this.GetFieldByIndex(fieldpos);
                if(!currentField) {
                    return fieldRange;
                }
                fieldRange.start = length;
                fieldRange.length = currentField.GetLength();
                return fieldRange;
            };
            MaskFieldCollection.prototype.PushBack = function (field) {
                this.Add(field);
                this.fieldCount++;
            };
            return MaskFieldCollection;
        })(FieldCollection);
        input.MaskFieldCollection = MaskFieldCollection;        
        /** @ignore */
        var MaskUIProcess = (function (_super) {
            __extends(MaskUIProcess, _super);
            function MaskUIProcess(data) {
                        _super.call(this);
                this.OldPosition = 0;
                this.IsFocus = false;
                this.isSelectionDeterminedByHighlightText = false;
                this.Format = null;
                if(data.HelpID != null) {
                    this.HelpID = data.HelpID;
                }
                if(data.Owner) {
                    this.Owner = data.Owner;
                }
            }
            MaskUIProcess.prototype.GetCurrentField = function (pos) {
                var text = this.GetShowText(this.GetShowLiterals());
                //fix bug#5476
                if(this.Format.Fields.ValueIsNull() && text != null && ((this.Format.Fields._focusNull !== "" && text === this.Format.Fields._focusNull) || (text != null && text == ""))) {
                    var fieldPos = {
                    };
                    fieldPos.index = -1;
                    return fieldPos;
                }
                return this.Format.Fields.GetCurrentField(pos);
            };
            MaskUIProcess.prototype.FocusInternal = function (focusType, oText, highlightText, cursorField, selectionStart) {
                //MaskUIProcess.prototype.Focus = function(focusType, oText, highlightText, cursorField)
                // End by Yang
                var retInfo = {
                };
                var text = this.GetShowText(this.GetShowLiterals());
                this.OldValue = this.Format.Fields.GetText();
                this.isMulSelected = false;
                this.isDblClick = false;
                this.isTriClick = false;
                // Add comments by Yang at 15:04 October 11th 2007
                // For fix bug 8998
                retInfo.SelectionStart = selectionStart;
                // End by Yang
                //commented by Kevin, Jun 8, 2007
                //bug#7769
                //		//the focusType is used to distribute the get focus type by Left key
                //		// or Right key or something else.
                //		//if ( focusType === FocusType.Click )
                //		//For bug 3917
                //		if ((focusType === FocusType.Click || this.IsFocus === false) && focusType != FocusType.ClientEvent)
                //		{
                //			retInfo.SelectionStart = Utility.GetCursorPosition(oText);
                //			retInfo.SelectionEnd   = retInfo.SelectionStart;
                //		}
                if(focusType === input.FocusType.Click) {
                    retInfo.SelectionStart = input.Utility.GetCursorPosition(oText);
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                }
                //end by Kevin
                //when get the focus, display the format.
                retInfo.Text = text;
                if(this.Format.Fields.ValueIsNull() && (retInfo.Text != null && this.Format.Fields._focusNull !== "" && retInfo.Text === this.Format.Fields._focusNull)) {
                    retInfo.SelectionStart = 0;
                    retInfo.SelectionEnd = 0;
                }
                //modified by sj 2008.8.14 for bug 514
                if(this.Format.Fields.ValueIsNull() && this.Format.Fields._owner._getDisplayNullExpression() !== null) {
                    retInfo.SelectionStart = 0;
                    retInfo.SelectionEnd = 0;
                }
                //end by sj
                //Press tab key will set cursor start position to less than zero
                if(retInfo.SelectionStart === -1 || retInfo.SelectionStart > retInfo.Text.GetLength()) {
                    retInfo.SelectionStart = 0;
                    retInfo.SelectionEnd = 0;
                }
                //Add comments by Ryan Wu at 15:04 Apr. 27 2007.
                //For fix the bug#7769.
                //		if (focusType === FocusType.Left)
                //		{
                //			retInfo.SelectionStart = retInfo.Text.GetLength();
                //			retInfo.SelectionEnd   = retInfo.Text.GetLength();
                //		}
                //		else if (focusType === FocusType.Right)
                //		{
                //			retInfo.SelectionStart = 0;
                //			retInfo.SelectionEnd   = 0;
                //		}
                if(focusType === input.FocusType.Left) {
                    retInfo.SelectionStart = 0;
                    retInfo.SelectionEnd = 0;
                } else if(focusType === input.FocusType.Right) {
                    retInfo.SelectionStart = retInfo.Text.GetLength();
                    retInfo.SelectionEnd = retInfo.Text.GetLength();
                }
                //end by Ryan Wu.
                //According to the HighlightText property and CursorPosition property to set the
                //selection.
                var curPos = retInfo.SelectionStart;
                if(focusType !== input.FocusType.SpinButton && focusType !== input.FocusType.ContextMenu && focusType !== input.FocusType.ClientEvent && focusType !== input.FocusType.ImeInput && !(highlightText === input.HighlightText.None && cursorField === -1)) {
                    //bug#6930
                    if(this.Format.Fields.ValueIsNull() && (retInfo.Text != null && this.Format.Fields._focusNull != "" && retInfo.Text === this.Format.Fields._focusNull)) {
                        retInfo.SelectionEnd = retInfo.Text.GetLength();
                    } else {
                        var ret = this.SetCursorPositionAndSelection(highlightText, "", cursorField, curPos);
                        if(ret != null) {
                            retInfo.SelectionStart = ret.SelectionStart;
                            retInfo.SelectionEnd = ret.SelectionEnd;
                            //this.isSelectionDeterminedByHighlightText = true;
                                                    }
                    }
                }
                //Record the position now for undo.
                if(retInfo.SelectionStart != null) {
                    this.OldPosition = retInfo.SelectionStart;
                }
                this.IsFocus = true;
                return retInfo;
            };
            MaskUIProcess.prototype.SetCursorPositionAndSelection = function (highlightText, text, cursorField, startPos) {
                var retInfo;
                if(highlightText === input.HighlightText.All) {
                    this.isSelectionDeterminedByHighlightText = true;
                    retInfo = this.SelectAll();
                } else if(highlightText === input.HighlightText.Field) {
                    this.isSelectionDeterminedByHighlightText = true;
                    if(cursorField <= -1) {
                        if(startPos > 0) {
                            var fieldIndex = this.Format.Fields.GetFieldIndex(startPos).index;
                            var field = this.Format.Fields.fieldArray[fieldIndex];
                            if(field.fieldLabel === "PromptField") {
                                if(fieldIndex === this.Format.Fields.fieldCount - 1) {
                                    fieldIndex--;
                                } else {
                                    fieldIndex++;
                                }
                            }
                            var fieldPos = this.Format.Fields.GetFieldRange(fieldIndex);
                            retInfo = {
                            };
                            retInfo.SelectionStart = fieldPos.start;
                            retInfo.SelectionEnd = fieldPos.length + fieldPos.start;
                        } else {
                            retInfo = this.GetPosByCurrentField(startPos);
                        }
                        //return retInfo;
                                            } else {
                        retInfo = this.GetPosByCurrentField(cursorField);
                    }
                } else {
                    retInfo = this.GetPosByCurrentField(cursorField);
                    if(retInfo != null) {
                        retInfo.SelectionStart = retInfo.SelectionStart;
                        retInfo.SelectionEnd = retInfo.SelectionStart;
                    }
                }
                return retInfo;
            };
            MaskUIProcess.prototype.GetPosByCurrentField = function (curField) {
                var retInfo = {
                };
                var rangeInfo = this.Format.Fields.GetPosByCurrentField(curField);
                // rangeInfo = this.Format.Fields.GetFieldRange(curField);
                if(rangeInfo != null && rangeInfo != -1) {
                    retInfo.SelectionStart = rangeInfo.start;
                    retInfo.SelectionEnd = rangeInfo.start + rangeInfo.length;
                    return retInfo;
                }
                return null;
            };
            MaskUIProcess.prototype.LoseFocus = function () {
                var retInfo = {
                };
                if(this.Owner._getFormatIsNull() != true) {
                    this.Format.Fields.SaveUndoState();
                }
                retInfo.Text = this.GetShowText(this.GetShowLiterals(), "LoseFocus");
                retInfo.Value = this.Format.Fields.GetValue();
                this.IsFocus = false;
                return retInfo;
            };
            MaskUIProcess.prototype.GetSepText = function () {
                //Commented by Kevin, Feb 17, 2009
                //bug#1891
                if(this.Owner._getFormatIsNull()) {
                    return this.Format.Fields.GetText();
                }
                //end by Kevin
                var sepText = "";
                var i = this.Format.Fields.fieldCount - 1;
                //Commented by Kevin, Dec 29, 2008
                //bug#1411
                //the text should same as text of server
                //		for (; i >= 0; i--)
                //		{
                //			var field = this.Format.Fields.fieldArray[i];
                //			if (field.fieldLabel === "PromptField")
                //			{
                //				continue;
                //		    }
                //			else
                //			{
                //				break;
                //			}
                //		}
                //end by Kevin
                for(var j = 0; j <= i; j++) {
                    var field = this.Format.Fields.fieldArray[j];
                    if(field.fieldLabel === "PromptField") {
                        continue;
                    }
                    var length = field._trueLength;
                    var retValue = field.text;
                    //Filter field.
                    if(field.fieldLabel === 'FilterField') {
                        for(var k = 0; k < length; k++) {
                            if(field._bitState[k] === false) {
                                retValue = retValue.Substring(0, k) + " " + retValue.Substring(k + 1, retValue.GetLength());
                            }
                        }
                    } else//Enum Field.
                     {
                        if(field._activeItem === -1) {
                            retValue = "";
                        }
                    }
                    if(j != i) {
                        var tempValue = retValue.Substring(0, length);
                        tempValue = tempValue.replace(/'/g, "@#GCD#@").replace(/"/g, "@#GCM#@").replace(/,/g, "@#GCC#@").replace(/@#GCF#@/g, "\\");
                        //Commented by Kevin, Jan 4, 2009
                        //bug#1418 tcp
                        if(field.fieldLabel === 'FilterField') {
                            if(!this.Owner._getFormatIsNull()) {
                                var validateText = retValue.Substring(0, length);
                                for(var k = 0; k < length; k++) {
                                    if(field._bitState[k] === false) {
                                        validateText = validateText.Substring(0, k) + input.Utility.MaskValChar + validateText.Substring(k + 1, validateText.GetLength());
                                    }
                                }
                                tempValue += input.Utility.Hold + "," + validateText.replace(/'/g, "@#GCD#@").replace(/"/g, "@#GCM#@").replace(/,/g, "@#GCC#@").replace(/@#GCF#@/g, "\\");
                            }
                        }
                        sepText += tempValue + input.Utility.Hold + ";";
                    } else {
                        var tempValue = retValue.Substring(0, length);
                        tempValue = tempValue.replace(/'/g, "@#GCD#@").replace(/"/g, "@#GCM#@").replace(/,/g, "@#GCC#@").replace(/@#GCF#@/g, "\\");
                        //Commented by Kevin, Jan 4, 2009
                        //bug#1418 tcp
                        if(field.fieldLabel === 'FilterField') {
                            if(!this.Owner._getFormatIsNull()) {
                                var validateText = retValue.Substring(0, length);
                                for(var k = 0; k < length; k++) {
                                    if(field._bitState[k] === false) {
                                        validateText = validateText.Substring(0, k) + input.Utility.MaskValChar + validateText.Substring(k + 1, validateText.GetLength());
                                    }
                                }
                                tempValue += input.Utility.Hold + "," + validateText.replace(/'/g, "@#GCD#@").replace(/"/g, "@#GCM#@").replace(/,/g, "@#GCC#@").replace(/@#GCF#@/g, "\\");
                            }
                        }
                        sepText += tempValue;
                    }
                }
                return sepText;
            };
            MaskUIProcess.prototype.SetSepText = function (text) {
                if(!text) {
                    for(var fieldIndex = 0; fieldIndex < this.Format.Fields.fieldCount; fieldIndex++) {
                        var field = this.Format.Fields.fieldArray[fieldIndex];
                        if(field.fieldLabel === "PromptField") {
                            continue;
                        }
                        field.Clear();
                    }
                    return true;
                }
                //Commented by Kevin, Jan 4, 2009
                //bug#1418 tcp
                //var sp = ',';
                var sp = input.Utility.Hold + ";";
                var sepText = text.split(sp);
                //end by kevin
                for(var i = 0; i < sepText.length; i++) {
                    sepText[i] = sepText[i].replace(/@#GCC#@/g, ",").replace(/@#GCD#@/g, "'").replace(/@#GCM#@/g, "\"");
                }
                var isLast = false;
                var j = 0;
                for(var fieldIndex = 0; fieldIndex < this.Format.Fields.fieldCount; fieldIndex++) {
                    var field = this.Format.Fields.fieldArray[fieldIndex];
                    if(field.fieldLabel === "PromptField") {
                        continue;
                    }
                    if(j < sepText.length) {
                        //Commented by Kevin, Jan 4, 2009
                        //bug#1418 tcp
                        //text = sepText[j];
                        var inputText = sepText[j].split(input.Utility.Hold + ",");
                        //var newText = inputText[0].replace(/ /g, this.PromptChar);
                        var newText = inputText[0];
                        var validateText = "";
                        if(inputText.length > 1) {
                            validateText = inputText[1];
                            if(validateText && validateText != "" && newText != validateText) {
                                var startIndex = 0;
                                var findIndex = newText.IndexOf(" ", startIndex);
                                while(findIndex != -1) {
                                    if(validateText.Substring(findIndex, findIndex + 1) === input.Utility.MaskValChar) {
                                        newText = newText.Substring(0, findIndex) + this.Owner.GetPromptChar() + newText.Substring(findIndex + 1, newText.GetLength());
                                    }
                                    startIndex = findIndex;
                                    findIndex = newText.IndexOf(" ", startIndex);
                                }
                            }
                        }
                        //end by Kevin
                        //not same as server side
                        isLast = (j === this.Format.Fields.fieldCount - 1);
                        var textLength = newText.GetLength();
                        if(textLength < field._minLength) {
                            for(var i = 0; i < field._minLength - textLength; i++) {
                                newText += this.Owner.GetPromptChar();
                                validateText += input.Utility.MaskValChar;
                            }
                        }
                        //Commented by Kevin, Jan 4, 2009
                        //bug#1418 tcp
                        //var insObj = field.SetText(0, newText, isLast);
                        var insObj;
                        if(field.fieldLabel === 'FilterField') {
                            insObj = field.SetTextInternal(newText, 0, isLast, validateText);
                        } else {
                            insObj = field.SetTextInternal(newText, 0, isLast);
                        }
                        //end by Kevin
                        if(insObj.existInvalid && insObj.exception) {
                            return false;
                        }
                        //
                        j++;
                    } else {
                        field.Clear();
                    }
                }
                return true;
            };
            MaskUIProcess.prototype.ProcessShortcutKey = function (keyAction, readOnly, end) {
                var retInfo = {
                };
                switch(keyAction) {
                    case "Clear":
                        //Clear
                        if(!readOnly) {
                            this.Format.Fields.ClearContent();
                        }
                        retInfo.SelectionStart = this.Format.Fields.GetFirstInputPosition();
                        retInfo.SelectionEnd = retInfo.SelectionStart;
                        retInfo.Text = this.GetShowText(this.GetShowLiterals());
                        return retInfo;
                    case "NextField":
                        //NextField
                        if(this.IsLastInputField(end, true)) {
                            return true;
                        }
                        break;
                    case "PreviousField":
                        //PreviousField
                        if(this.IsLastInputField(end, false)) {
                            return true;
                        }
                }
                retInfo = _super.prototype.ProcessShortcutKey.call(this, keyAction, readOnly, end);
                return retInfo;
            };
            MaskUIProcess.prototype.KeyDown = function (Data) {
                var k = Data.KeyCode;
                //var start = Data.SelectionStart;
                //var end = Data.SelectionStart;
                //var isExitOnLastChar = Data.ExitOnLastChar;
                var retInfo = _super.prototype.KeyDown.call(this, Data);
                //Escape key.
                if(k === 27) {
                    this.Owner.Clear();
                }
                if(Data.KeyAction != null) {
                    return retInfo;
                }
                if(Data.ReadOnly === true) {
                    return retInfo;
                }
                //if (k === 131158)
                //{
                //    //if null now,set position 0,0;
                //    if (this.Format.Fields.ValueIsNull() && this.Format.Fields._focusNull != "")
                //    {
                //        start = 0;
                //        end = 0;
                //    }
                //}
                if(k != undefined && k != null) {
                    if((k >= 48 && k <= 57) || (k >= 65 && k <= 90) || (k >= 96 && k <= 105) || k === 0 || k === 229 || k === 231) {
                        //input status.Response by keyup event.
                        if(!retInfo) {
                            retInfo = {
                            };
                        }
                        MaskControl.Mask_ImeResponse = true;
                        retInfo.inputChar = true;
                        return retInfo;
                    }
                    // for symbol charactors
                    //Add comments by Ryan Wu at 15:03 Mar. 2 2006.
                    //For fix bug that 226 keycode can't be input into the edit reported by Japan.
                    /*if(  k===32 || k === 106 || k === 107 || k === 109 || k === 110 || k === 111 || k === 219
                    || k === 220 || k === 221 || k === 222 || (k >= 186 && k <= 192) )*/
                    if(k === 32 || k === 106 || k === 107 || k === 109 || k === 110 || k === 111 || k === 219 || k === 220 || k === 221 || k === 222 || (k >= 186 && k <= 192) || k === 226)//end by Ryan.
                     {
                        //input status.Response by keyup event.
                        if(!retInfo) {
                            retInfo = {
                            };
                        }
                        MaskControl.Mask_ImeResponse = true;
                        retInfo.inputChar = true;
                        return retInfo;
                    }
                    // Add comments by Yang at 14:13 Sep. 12th 2007
                    // For fix the bug 8754
                    if(!input.Utility.IsIE() && (k === 61 || k === 59)) {
                        if(!retInfo) {
                            retInfo = {
                            };
                        }
                        MaskControl.Mask_ImeResponse = true;
                        retInfo.inputChar = true;
                        return retInfo;
                    }
                    // End by Yang
                    var tempk = k;
                    //Shift + key
                    if(Data.FuncKeysPressed.Shift && k != 65552) {
                        tempk = k - 65536;
                    }
                    if(k > 65600 && k < 65627) {
                        tempk = k - 65536;
                    }
                    if((tempk >= 48 && tempk <= 57) || (tempk >= 65 && tempk <= 90) || (tempk >= 96 && tempk <= 105) || tempk === 229 || tempk === 0 || tempk === 231) {
                        //input status.Response by keyup event.
                        if(!retInfo) {
                            retInfo = {
                            };
                        }
                        MaskControl.Mask_ImeResponse = true;
                        retInfo.inputChar = true;
                        return retInfo;
                    }
                    // for symbol charactors
                    //Add comments by Ryan Wu at 15:03 Mar. 2 2006.
                    //For fix bug that 226 keycode can't be input into the edit reported by Japan.
                    /*if (tempk === 32 || tempk === 106 || tempk === 107 || tempk === 109 || tempk === 110
                    || tempk === 111 || tempk === 219 || tempk === 220 || tempk === 221
                    || tempk === 222 || (tempk >= 186 && tempk <= 192))*/
                    if(tempk === 32 || tempk === 106 || tempk === 107 || tempk === 109 || tempk === 110 || tempk === 111 || tempk === 219 || tempk === 220 || tempk === 221 || tempk === 222 || (tempk >= 186 && tempk <= 192) || tempk === 226)//end by Ryan.
                     {
                        //input status.Response by keyup event.
                        if(!retInfo) {
                            retInfo = {
                            };
                        }
                        MaskControl.Mask_ImeResponse = true;
                        retInfo.inputChar = true;
                        return retInfo;
                    }
                    // Add comments by Yang at 14:00 Sep. 12th 2007
                    // For fix the bug 8754
                    if(!input.Utility.IsIE() && (tempk === 61 || tempk === 59)) {
                        if(!retInfo) {
                            retInfo = {
                            };
                        }
                        MaskControl.Mask_ImeResponse = true;
                        retInfo.inputChar = true;
                        return retInfo;
                    }
                    // End by Yang
                                    }
                return retInfo;
            };
            MaskUIProcess.prototype.KeyPressInternal = function (inputElement, start, end, isExitOnLastChar, inputChar) {
                if(MaskControl.Mask_ImeResponse === true) {
                    MaskControl.Mask_ImeResponse = false;
                    var retInfo = {
                    };
                    //if null now,set position 0,0;
                    if(this.Format.Fields.ValueIsNull() && this.Format.Fields._focusNull != "") {
                        start = 0;
                        end = 0;
                    }
                    var processInfo = this.ProcessCharKey(start, end, inputChar, isExitOnLastChar);
                    if(processInfo.success) {
                        retInfo.SelectionStart = processInfo.start;
                        retInfo.SelectionEnd = retInfo.SelectionStart;
                        retInfo.Text = this.GetShowText(this.GetShowLiterals());
                        this.isMulSelected = false;
                        //if ExitOnLastChar is true and the caret is move to the right-most of the edit field
                        //then the focus will move to the next control.
                        if(this.moveFocusExitOnLastChar) {
                            var ret = this.MoveControl(this.GetElementId(), true, false, "CharInput");
                            if(ret != null) {
                                retInfo.EventInfo = ret.EventInfo;
                                retInfo.FocusType = ret.FocusType;
                                retInfo.FocusExit = true;
                            }
                            this.moveFocusExitOnLastChar = false;
                        }
                    } else {
                        retInfo.SelectionStart = processInfo.start;
                        retInfo.SelectionEnd = Math.max(start, end);
                        retInfo.Text = this.GetShowText(this.GetShowLiterals());
                        retInfo.EventInfo = processInfo.EventInfo;
                        retInfo.exception = true;
                        //modified by sj 2008.8.13 for bug 370
                        if(this.moveFocusExitOnLastChar) {
                            retInfo.FocusExit = true;
                            this.moveFocusExitOnLastChar = false;
                        }
                        //end by sj
                                            }
                    return retInfo;
                } else {
                    return false;
                }
            };
            MaskUIProcess.prototype.ProcessCharKey = function (start, end, charInput, isExitOnLastChar) {
                var processInfo = _super.prototype.ProcessCharKey.call(this, start, end, charInput, isExitOnLastChar);
                var selectionStart = Math.min(start, end);
                //judge if the focus should exit on last char.
                if(processInfo.success) {
                    selectionStart = processInfo.start;
                }
                if(isExitOnLastChar) {
                    this.moveFocusExitOnLastChar = false;
                    if(selectionStart === this.Format.Fields.GetExistLength()) {
                        this.moveFocusExitOnLastChar = true;
                    }
                }
                return processInfo;
            };
            MaskUIProcess.prototype.ContextMenu = function () {
            };
            MaskUIProcess.prototype.Click = function () {
            };
            MaskUIProcess.prototype.Undo = function (pos) {
                var retInfo = {
                };
                this.Format.Fields.Undo();
                //Return true position last operation.
                retInfo.SelectionStart = this.OldPosition;
                retInfo.SelectionEnd = this.OldPosition;
                //Record
                this.OldPosition = pos;
                retInfo.Value = this.Format.Fields.GetText();
                //commented by Kevin, May 31, 2007
                //modify GetShowText method
                //retInfo.Text  = this.GetShowText(retInfo.Value);
                retInfo.Text = this.GetShowText(this.GetShowLiterals());
                //end by Kevin
                return retInfo;
            };
            MaskUIProcess.prototype.Paste = function (start, end, text, isExitOnLastChar, isSetSelectedText) {
                var retInfo = {
                };
                retInfo.SelectionStart = start;
                retInfo.SelectionEnd = end;
                //modified by sj for bug 1994
                //if isSetSelectedText is true, there is no need calling Utility.GetPasteData()
                var pasteData;
                if(isSetSelectedText != null && isSetSelectedText === true) {
                    pasteData = text;
                } else if(this.Owner) {
                    pasteData = input.Utility.GetPasteData(this.Owner.GetUseClipboard());
                    // Frank Liu fixed bug 569 at 2013/06/05.
                    pasteData = this.UpdateCrLfString(pasteData, this.Owner.GetAcceptsCrlf());
                } else {
                    pasteData = input.Utility.GetPasteData(true);
                }
                var processInfo = null;
                if(pasteData != null) {
                    if(pasteData.IndexOf("\r") != -1) {
                        pasteData = pasteData.Substring(0, pasteData.IndexOf("\r"));
                    }
                    if(pasteData.IndexOf("\n") != -1) {
                        pasteData = pasteData.Substring(0, pasteData.IndexOf("\n"));
                    }
                }
                if(!pasteData) {
                    return retInfo;
                }
                //End for SetSelectedText function.
                this.FireClientEvent("OnBeforePaste");
                var selectionStart = Math.min(start, end);
                var selectionEnd = Math.max(start, end);
                var selectionLength = selectionEnd - selectionStart;
                if(selectionStart === selectionEnd) {
                    retInfo.SelectionStart = this.Format.Fields.Insert(selectionStart, pasteData, false).cursorPos;
                    retInfo.Text = this.GetShowText(this.GetShowLiterals());
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                } else {
                    var orientText = this.GetShowText(this.GetShowLiterals());
                    //5409
                    if(orientText != null && this.Format.Fields._focusNull != "" && orientText === this.Format.Fields._focusNull && this.Format.Fields.fieldArray[0].text != orientText) {
                        processInfo = this.Format.Fields.Insert(0, pasteData, false);
                    } else {
                        processInfo = this.Format.Fields.Replace(selectionStart, selectionLength, pasteData, false);
                    }
                    retInfo.SelectionStart = processInfo.cursorPos;
                    retInfo.Text = this.GetShowText(this.GetShowLiterals());
                    if(orientText === retInfo.Text && processInfo.success === false) {
                        retInfo.SelectionStart = selectionStart;
                        retInfo.SelectionEnd = selectionEnd;
                    } else {
                        retInfo.SelectionEnd = retInfo.SelectionStart;
                    }
                }
                //if exist invalid charactor, fire event.
                if(retInfo.Text.Substring(selectionStart, selectionStart + pasteData.GetLength()) != pasteData) {
                    //add judgement on selectionStart for bug#4335,6841, KevinHuang, 2006-04-25
                    if(retInfo.SelectionStart - selectionStart < pasteData.GetLength() && this.InvalidInput != "") {
                        var eventInfo = {
                        };
                        eventInfo.Name = this.InvalidInput;
                        eventInfo.Args = null;
                        //Add comments by Ryan Wu at 10:56 Apr. 5 2007.
                        //For support Aspnet Ajax 1.0.
                        eventInfo.Type = "InvalidInput";
                        //end by Ryan Wu.
                        retInfo.EventInfo = eventInfo;
                    }
                }
                //judge if the focus should exit on last char.
                if(isExitOnLastChar) {
                    if(retInfo.SelectionStart === this.Format.Fields.GetExistLength()) {
                        this.moveFocusExitOnLastChar = true;
                    } else {
                        var posInfo = this.Format.Fields.GetFieldIndex(retInfo.SelectionStart);
                        var fieldIndex = posInfo.index;
                        var fieldOffset = posInfo.offset;
                        if(fieldIndex === this.Format.Fields.fieldCount - 1 && fieldOffset === 0 && this.Format.Fields.GetFieldByIndex(fieldIndex).fieldLabel === "PromptField") {
                            this.moveFocusExitOnLastChar = true;
                        }
                    }
                }
                //if ExitOnLastChar is true and the caret is move to the right-most of the edit field
                //then the focus will move to the next control.
                if(this.moveFocusExitOnLastChar) {
                    //Commetned by Kevin, Dec 22, 2008
                    //bug#1316
                    //var ret = this.MoveControl(this.ElementID, true, false, "NextControl");
                    var ret = this.MoveControl(this.GetElementId(), true, false, "CharInput");
                    //end by Kevin
                    if(ret != null) {
                        retInfo.EventInfo = ret.EventInfo;
                        retInfo.FocusType = ret.FocusType;
                        retInfo.FocusExit = true;
                    }
                    this.moveFocusExitOnLastChar = false;
                }
                if(retInfo.SelectionStart != selectionStart) {
                    this.FireClientEvent("OnPaste");
                }
                return retInfo;
            };
            MaskUIProcess.prototype.UpdateCrLfString = function (text, crlfMode) {
                if(crlfMode !== input.CrLfMode.NoControl) {
                    return input.BaseUIProcess.UpdateCrLfString(text, crlfMode);
                } else {
                    return input.BaseUIProcess.UpdateCrLfString(text, input.CrLfMode.Cut);
                }
            };
            MaskUIProcess.prototype.DragStart = function () {
            };
            MaskUIProcess.prototype.DragEnd = function () {
            };
            MaskUIProcess.prototype.DragOver = function () {
            };
            MaskUIProcess.prototype.DragInit = function () {
            };
            MaskUIProcess.prototype.SetValue = function (value) {
                this.Format.Fields.SetValue(value);
            };
            MaskUIProcess.prototype.GetShowText = function (showliterals, type, notNull) {
                var text = "";
                if(!type) {
                    text = this.Format.Fields.GetShowText(showliterals, "", notNull);
                } else if(type === "LoseFocus") {
                    text = this.Format.Fields.GetShowText(showliterals, "LoseFocus", notNull);
                }
                return text;
            };
            MaskUIProcess.prototype.ProcessBackSpaceKey = function (start, end) {
                //get the selection information.
                var selectionStart = Math.min(start, end);
                var selectionLength = Math.abs(start - end);
                var retInfo = {
                };
                retInfo.SelectionStart = selectionStart;
                retInfo.SelectionEnd = selectionStart + selectionLength;
                //none action.
                if(selectionStart === 0 && selectionLength === 0) {
                    return retInfo;
                }
                //get the start field, end field's index and offset of the selection range.
                var startFieldIndex;
                var startFieldOffset;
                var fieldPosInfo = this.Format.Fields.GetFieldIndex(selectionStart);
                startFieldIndex = fieldPosInfo.index;
                startFieldOffset = fieldPosInfo.offset;
                //none action.
                if(startFieldIndex === -1) {
                    return retInfo;
                }
                //if the selectionlength = 0, do the delete action for previous char.
                if(selectionLength === 0) {
                    var pfield = this.Format.Fields.GetFieldByIndex(startFieldIndex);
                    if(startFieldIndex === 0 && startFieldOffset === 0) {
                        return retInfo;
                    }
                    while((startFieldOffset === 0 || pfield.fieldLabel === "PromptField") && startFieldIndex > 0) {
                        startFieldIndex--;
                        selectionLength += startFieldOffset;
                        pfield = this.Format.Fields.GetFieldByIndex(startFieldIndex);
                        startFieldOffset = pfield.GetLength();
                        if(pfield.fieldLabel === "PromptField") {
                            selectionLength += startFieldOffset;
                            startFieldOffset = 0;
                        }
                    }
                    if(startFieldIndex === 0) {
                        if(this.Format.Fields.GetFieldByIndex(startFieldIndex).fieldLabel === "PromptField") {
                            return retInfo;
                        }
                        if(this.Format.Fields.GetFieldByIndex(startFieldIndex).GetLength() === 0) {
                            return retInfo;
                        }
                    }
                    //FilterFiled
                    if(this.Format.Fields.GetFieldByIndex(startFieldIndex).fieldLabel === "FilterField") {
                        selectionLength = selectionLength + 1;
                        //startFieldOffset = this.Format.Fields.GetFieldByIndex(startFieldIndex).GetLength();
                        selectionStart = selectionStart - selectionLength;
                        selectionLength = 1;
                    } else //EnumField.
                    if(this.Format.Fields.GetFieldByIndex(startFieldIndex).fieldLabel === "EnumField") {
                        //startFieldOffset = 0;
                        selectionLength = selectionLength + this.Format.Fields.GetFieldByIndex(startFieldIndex).GetLength();
                        selectionStart = selectionStart - selectionLength;
                        selectionStart = selectionStart > 0 ? selectionStart : 0;
                    } else {
                        return retInfo;
                    }
                    //invoke this.Format.Fields.Delete action to process backspace action.
                    selectionStart = this.Format.Fields.Delete(selectionStart, selectionLength);
                    retInfo.SelectionStart = selectionStart;
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                } else {
                    var endFieldIndex;
                    // var endFieldOffset;
                    fieldPosInfo = this.Format.Fields.GetFieldIndex(selectionStart + selectionLength);
                    endFieldIndex = fieldPosInfo.index;
                    //endFieldOffset = fieldPosInfo.offset;
                    //none action.
                    if(endFieldIndex === -1) {
                        return retInfo;
                    }
                    if(startFieldOffset === 0 && startFieldIndex != 0) {
                        startFieldIndex--;
                        //startFieldOffset = this.Format.Fields.GetFieldByIndex(startFieldIndex).GetLength();
                                            }
                    if((startFieldIndex === endFieldIndex && this.Format.Fields.GetFieldByIndex(endFieldIndex).fieldLabel === "PromptField")) {
                        return retInfo;
                    }
                    //invoke DateFieldCollection.Delete action to process backspace action.
                    retInfo.SelectionStart = this.Format.Fields.Delete(selectionStart, selectionLength);
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                }
                return retInfo;
            };
            MaskUIProcess.prototype.PerformSpinInternal = function (start, end, increment, wrap, isUp) {
                //if no field return position;
                if(this.Format.Fields.fieldCount <= 0) {
                    return null;
                }
                var retInfo = {
                };
                retInfo.SelectionStart = start;
                retInfo.SelectionEnd = end;
                retInfo.Text = this.GetShowText(this.GetShowLiterals());
                //judge the startfield
                //var posInfo = this.Format.Fields.GetFieldIndex(start);
                var posInfo = this.Format.Fields.GetFieldIndex(end);
                var fieldIndex = posInfo.index;
                var offset = posInfo.offset;
                if(fieldIndex != 0 && offset === 0) {
                    if(start === end) {
                        if(this.Format.Fields.fieldArray[fieldIndex].fieldLabel != "EnumField") {
                            fieldIndex--;
                        }
                    } else {
                        if(start < end) {
                            fieldIndex--;
                        }
                    }
                }
                if(this.Format.Fields.fieldArray[fieldIndex].fieldLabel != "EnumField" && this.Format.Fields.fieldArray[fieldIndex].text.GetLength() != 0) {
                    //if( this.Format.Fields.fieldArray[fieldIndex].text.GetLength() != 0)
                    //	return retInfo;
                                    } else {
                    if(isUp) {
                        retInfo.SelectionStart = this.Format.Fields.PerformSpin(end, increment, wrap);
                    } else {
                        //bug#8097
                        retInfo.SelectionStart = this.Format.Fields.PerformSpin(end, -increment, wrap);
                    }
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                    retInfo.Text = this.GetShowText(this.GetShowLiterals());
                }
                if(isUp) {
                    if(this.SpinUp != "") {
                        var eventInfo = {
                        };
                        eventInfo.Name = this.SpinUp;
                        eventInfo.Args = null;
                        //Add comments by Ryan Wu at 10:56 Apr. 5 2007.
                        //For support Aspnet Ajax 1.0.
                        eventInfo.Type = "SpinUp";
                        //end by Ryan Wu.
                        retInfo.EventInfo = eventInfo;
                    }
                } else {
                    if(this.SpinDown != "") {
                        var eventInfo = {
                        };
                        eventInfo.Name = this.SpinDown;
                        eventInfo.Args = null;
                        //Add comments by Ryan Wu at 10:57 Apr. 5 2007.
                        //For support Aspnet Ajax 1.0.
                        eventInfo.Type = "SpinDown";
                        //end by Ryan Wu.
                        retInfo.EventInfo = eventInfo;
                    }
                }
                return retInfo;
            };
            MaskUIProcess.prototype.ProcessBackSpace = function (start, end) {
                var retInfo = this.ProcessBackSpaceKey(start, end);
                retInfo.Text = this.GetShowText(this.GetShowLiterals());
                this.isMulSelected = false;
                return retInfo;
            };
            MaskUIProcess.prototype.ProcessDeleteKey = function (start, end) {
                //get the selection information.
                var selectionStart = Math.min(start, end);
                var selectionLength = Math.abs(start - end);
                var retInfo = {
                };
                retInfo.SelectionStart = selectionStart;
                retInfo.SelectionEnd = selectionStart + selectionLength;
                if(selectionStart === this.Format.Fields.GetLength() && selectionLength === 0) {
                    return retInfo;
                }
                var startFieldIndex;
                var fieldPosInfo = this.Format.Fields.GetFieldIndex(selectionStart);
                startFieldIndex = fieldPosInfo.index;
                //none action.
                if(startFieldIndex === -1) {
                    return retInfo;
                }
                //if the selectionlength = 0, do the delete action for one post char.
                if(selectionLength === 0) {
                    //none action.
                    if(this.Format.Fields.GetFieldByIndex(startFieldIndex).fieldLabel === "PromptField") {
                        return retInfo;
                    }
                    selectionStart = this.Format.Fields.Delete(selectionStart, 1);
                    retInfo.SelectionStart = selectionStart;
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                } else//if the selectionlength != 0, do the delete action for the selection range..
                 {
                    var endFieldOffset;
                    var endFieldIndex;
                    fieldPosInfo = this.Format.Fields.GetFieldIndex(selectionStart + selectionLength);
                    endFieldOffset = fieldPosInfo.offset;
                    endFieldIndex = fieldPosInfo.index;
                    //none action.
                    if(endFieldIndex === -1) {
                        return retInfo;
                    }
                    if(endFieldOffset === 0) {
                        endFieldIndex--;
                    }
                    //none action
                    if(startFieldIndex === endFieldIndex && this.Format.Fields.GetFieldByIndex(startFieldIndex).fieldLabel === "PromptField") {
                        return retInfo;
                    }
                    retInfo.SelectionStart = this.Format.Fields.Delete(selectionStart, selectionLength);
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                }
                return retInfo;
            };
            MaskUIProcess.prototype.ProcessDelete = function (start, end) {
                var retInfo = this.ProcessDeleteKey(start, end);
                retInfo.Text = this.GetShowText(this.GetShowLiterals());
                this.isMulSelected = false;
                return retInfo;
            };
            MaskUIProcess.prototype.GetNullCasePosition = function (cursorPos, keyCode) {
                var fields = this.Format.Fields;
                switch(keyCode) {
                    case //Home key pressed
                    36:
                        //Shift + Home
                                            case 65572:
                        //Ctrl + Left arrow key
                                            case 131109:
                        //Ctrl + Shift + Left key
                                            case 196645:
                        //Ctrl + Shift + Home key
                                            case 196644:
                        //Ctrl + Home key
                                            case 131108:
                        cursorPos = 0;
                        break;
                        //End key pressed
                                            case 35:
                        //Shift + End
                                            case 65571:
                        cursorPos = fields.GetLength();
                        break;
                        //Shift + Left key
                                            case 65573:
                        //Left key
                                            case 37:
                        if(cursorPos != 0) {
                            cursorPos--;
                        }
                        break;
                        //Right key
                                            case 39:
                        //Shift + Right key
                                            case 65575:
                        if(cursorPos != fields.GetLength()) {
                            cursorPos++;
                        }
                        break;
                        //Ctrl + Right arrow key
                                            case 131111:
                        //Ctrl + Shift + Right key
                                            case 196647:
                        //Ctrl + Shift + End key
                                            case 196643:
                        //Ctrl + End key
                                            case 131107:
                        cursorPos = fields.GetLength();
                        break;
                        //Ctrl + Delete key
                                            case 131118:
                        //Ctrl + BackSpace key   Ctrl + Shift + BackSpace Key
                                            case 131080:
                    case 196616:
                        return cursorPos;
                }
                return cursorPos;
            };
            MaskUIProcess.prototype.GetCaretPosition = function (cursorPos, keyCode) {
                // For null case, get normal position.for bug 3852.
                if(this.Format.Fields.ValueIsNull() && this.Format.Fields._focusNull != "") {
                    return this.GetNullCasePosition(cursorPos, keyCode);
                }
                var fields = this.Format.Fields;
                var fieldPosInfo = fields.GetFieldIndex(cursorPos);
                var fieldIndex = fieldPosInfo.index;
                // var fieldOffset = fieldPosInfo.offset;
                var fieldRange;
                var startPos;
                var endPos = 0;
                ;
                var i = 0;
                for(i = 0; i < fields.fieldCount; i++) {
                    if(fields.GetFieldByIndex(i).fieldLabel != "PromptField") {
                        startPos = fields.GetFieldRange(i).start;
                        break;
                    }
                }
                //Find the end position by this.ShowLiterals.
                var lastFieldIndex = fields.GetLastVisibleFieldIndex(this.GetShowLiterals());
                //bug#4976
                if(this.ShowLiterals === input.ShowLiterals.PreDisplay) {
                    for(i = lastFieldIndex; i >= 0; i--) {
                        if(fields.GetFieldByIndex(i).fieldLabel != "PromptField") {
                            endPos += fields.GetFieldByIndex(i)._trueLength;
                            //break;
                                                    }
                    }
                } else {
                    for(i = lastFieldIndex; i >= 0; i--) {
                        if(fields.GetFieldByIndex(i).fieldLabel != "PromptField") {
                            fieldRange = fields.GetFieldRange(i);
                            endPos = fieldRange.start + fieldRange.length;
                            break;
                        }
                    }
                }
                var oldcursorPos = cursorPos;
                cursorPos = _super.prototype.GetCaretPosition.call(this, cursorPos, keyCode, startPos, endPos, "PromptField");
                //bug#4642
                var fieldPosInfo = fields.GetFieldIndexByPos(oldcursorPos);
                var fieldIndex = fieldPosInfo.index;
                var fieldRange;
                if(keyCode === 196647 && cursorPos === oldcursorPos) {
                    //if the current caret is in the last field then return the fields' length
                    for(; fieldIndex < lastFieldIndex; fieldIndex++) {
                        fieldRange = fields.GetFieldRange(fieldIndex + 1);
                        cursorPos = fieldRange.start;
                        if(cursorPos > startPos) {
                            break;
                        }
                    }
                    if(fieldIndex === lastFieldIndex) {
                        cursorPos = cursorPos + fieldRange.length;
                    }
                }
                if(keyCode === 131111) {
                    if(fields.GetFieldByIndex(fieldIndex).fieldLabel != "PromptField" && fields.GetFieldRange(fieldIndex).length === 0) {
                        while(fields.GetFieldRange(fieldIndex).length === 0 && fieldIndex < fields.fieldCount - 1) {
                            fieldIndex++;
                        }
                        for(i = fieldIndex + 1; i < fields.fieldCount; i++) {
                            //find the edit field after the current field
                            if(fields.GetFieldByIndex(i).fieldLabel != "PromptField") {
                                fieldRange = fields.GetFieldRange(i);
                                return fieldRange.start;
                            }
                        }
                    }
                }
                return cursorPos;
            };
            MaskUIProcess.prototype.ProcessTabKey = function (pos, isForward, tabAction) {
                var retInfo;
                if(tabAction === input.TabAction.Field && !(this.Format.Fields.ValueIsNull() && this.Format.Fields._focusNull != "" && this.GetShowText(this.GetShowLiterals()) === this.Format.Fields._focusNull)) {
                    retInfo = this.MoveFieldAndControl(pos, isForward);
                } else {
                    //invoke the KeyExit Event if it exit
                    retInfo = _super.prototype.ProcessTabKey.call(this, pos, isForward, tabAction);
                }
                return retInfo;
            };
            MaskUIProcess.prototype.ProcessLeftDirection = function (start, end, k) {
                var retInfo = {
                };
                //Here exists bugs, when delete all, then input , it will start at the first position, but it is wrong.
                //we should judge if it is express or full of prompt char.
                if(!this.isMulSelected || k === 36 || k === 131108) {
                    retInfo.SelectionStart = this.GetCaretPosition(end, k);
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                } else {
                    retInfo.SelectionStart = Math.min(start, end);
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                }
                if(k === 37 || k === 131109) {
                    // For null.for bug 3852.
                    if(this.Format.Fields.ValueIsNull() && this.Format.Fields._focusNull != "") {
                    } else {
                        if(retInfo.SelectionStart > 0) {
                            //retInfo.SelectionStart = start - 1;
                            var fieldPosInfo = this.Format.Fields.GetFieldIndex(retInfo.SelectionStart);
                            var startFieldIndex = fieldPosInfo.index;
                            var startFieldOffset = fieldPosInfo.offset;
                            //Calculate the correct start and length information for DateFieldCollection.Delete method.
                            if(this.Format.Fields.GetFieldByIndex(startFieldIndex).fieldLabel === "PromptField" && this.isMulSelected === false) {
                                retInfo.SelectionStart -= startFieldOffset;
                            }
                            retInfo.SelectionEnd = retInfo.SelectionStart;
                        }
                    }
                    this.isMulSelected = false;
                    return retInfo;
                }
                this.isMulSelected = false;
                if(!this.isMulSelected || k === 36 || k === 131108) {
                    retInfo.SelectionStart = this.GetCaretPosition(end, k);
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                } else {
                    retInfo.SelectionStart = Math.min(start, end);
                    var fieldPosInfo = this.Format.Fields.GetFieldIndex(retInfo.SelectionStart);
                    var startFieldIndex = fieldPosInfo.index;
                    var startFieldOffset = fieldPosInfo.offset;
                    //Calculate the correct start and length information for DateFieldCollection.Delete method.
                    if(this.Format.Fields.GetFieldByIndex(startFieldIndex).fieldLabel === "PromptField") {
                        retInfo.SelectionStart -= startFieldOffset;
                    }
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                }
                return retInfo;
            };
            MaskUIProcess.prototype.ProcessRightDirection = function (start, end, k) {
                var retInfo = {
                };
                //Ritht arrow
                if(!this.isMulSelected || k === 35 || k === 131107) {
                    retInfo.SelectionStart = this.GetCaretPosition(end, k);
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                    //Added for bug 3852.
                    this.isMulSelected = false;
                    return retInfo;
                } else {
                    retInfo.SelectionStart = Math.max(start, end);
                    //if value is null, return;
                    if(this.Format.Fields.ValueIsNull() === true && this.Format.Fields._focusNull != "") {
                        retInfo.SelectionEnd = retInfo.SelectionStart;
                        this.isMulSelected = false;
                        return retInfo;
                    }
                    //get the start field, end field's index and offset of the selection range.
                    var startFieldIndex;
                    var startFieldOffset;
                    var fieldPosInfo = this.Format.Fields.GetFieldIndex(retInfo.SelectionStart);
                    startFieldIndex = fieldPosInfo.index;
                    startFieldOffset = fieldPosInfo.offset;
                    //Calculate the correct start and length information for DateFieldCollection.Delete method.
                    if(this.Format.Fields.GetFieldByIndex(startFieldIndex).fieldLabel === "PromptField" && this.isMulSelected === false) {
                        var field = this.Format.Fields.fieldArray[startFieldIndex];
                        retInfo.SelectionStart += field.text.GetLength() - startFieldOffset;
                    }
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                    this.isMulSelected = false;
                    return retInfo;
                }
            };
            MaskUIProcess.prototype.IsLastInputField = function (pos, isForward) {
                var posObj = this.Format.Fields.GetFieldIndex(pos, 0);
                var fieldIndex = posObj.index;
                if(isForward) {
                    while(fieldIndex < this.Format.Fields.fieldCount - 1 && this.Format.Fields.fieldArray[fieldIndex + 1].fieldLabel != "PromptField" && this.Format.Fields.fieldArray[fieldIndex + 1].text.GetLength() === 0) {
                        fieldIndex++;
                    }
                    var i = this.Format.Fields.fieldCount - 1;
                    for(; i > fieldIndex; i--) {
                        if(this.Format.Fields.fieldArray[i].fieldLabel != "PromptField") {
                            break;
                        }
                    }
                    if(i === fieldIndex) {
                        return true;
                    }
                    return false;
                } else {
                    while(fieldIndex > 0 && this.Format.Fields.fieldArray[fieldIndex - 1].fieldLabel != "PromptField" && this.Format.Fields.fieldArray[fieldIndex - 1].text.GetLength() === 0) {
                        fieldIndex--;
                    }
                    var i = 0;
                    for(; i < fieldIndex; i++) {
                        if(this.Format.Fields.fieldArray[i].fieldLabel != "PromptField") {
                            break;
                        }
                    }
                    if(i === fieldIndex) {
                        return true;
                    }
                    return false;
                }
            };
            MaskUIProcess.prototype.DoubleClick = function (pos) {
                var retInfo = {
                };
                //Commented by Kevin, Feb 25, 2008
                //fix bug#4724comment#4
                //		if (this.Format.Fields.ValueIsNull())
                var text = this.GetShowText(this.GetShowLiterals());
                if(this.Format.Fields.ValueIsNull() && text != null && ((this.Format.Fields._focusNull != "" && text === this.Format.Fields._focusNull) || (text != null && text == "")))//end by Kevin
                 {
                    var text = this.GetShowText(this.GetShowLiterals());
                    retInfo.SelectionStart = 0;
                    retInfo.SelectionEnd = text.GetLength();
                } else {
                    retInfo = _super.prototype.DoubleClick.call(this, pos);
                }
                return retInfo;
            };
            return MaskUIProcess;
        })(input.BaseUIProcess);
        input.MaskUIProcess = MaskUIProcess;        
        /** @ignore */
        var MaskControl = (function (_super) {
            __extends(MaskControl, _super);
            function MaskControl() {
                        _super.call(this);
                this.IMControlType = "Mask";
                this._promptChar = "_";
                this._autoConvert = true;
                this._displayNull = null;
                this._null = "";
                this._formatPattern = "";
                this._exitOnLastChar = false;
                this._displayNullExpresson = null;
                this._showLiterals = input.ShowLiterals.Always;
                this._tabAction = input.TabAction.Control;
                this._hideEnter = false;
                this._hidePromptOnLeave = false;
                this._textWithPromptChar = null;
                this.PerformSpin = function (type) {
                    var increment = this.Spin.Increment;
                    var isUp = true;
                    if(type === "down") {
                        isUp = false;
                    }
                    this.PerformSpinProcess(this.SelectionStart, this.SelectionEnd, increment, this.Spin.Wrap, isUp, true);
                    this.UIUpdate.SetFocus();
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                };
                this.Init();
            }
            MaskControl.Mask_ImeResponse = false;
            MaskControl.prototype.AttachInput = function (inputElement) {
                this.InputElement = inputElement;
                this.AddAllEventsHandler();
            };
            MaskControl.prototype.DetachInput = function () {
                $(this.InputElement).unbind(".wijinput");
                this.InputElement = null;
            };
            MaskControl.prototype.GetAutoConvert = function () {
                return this._autoConvert;
            };
            MaskControl.prototype.SetAutoConvert = function (value) {
                this._autoConvert = value;
            };
            MaskControl.prototype.GetExitOnLastChar = function () {
                return this._exitOnLastChar;
            };
            MaskControl.prototype.SetExitOnLastChar = function (value) {
                value = input.Utility.CheckBool(value);
                this._exitOnLastChar = value;
            };
            MaskControl.prototype.GetNull = function () {
                return this._null;
            };
            MaskControl.prototype.SetNull = function (value) {
                if(value !== this._null) {
                    var result = MaskFormat.ParseFillExpression(value, this.Format.Fields);
                    if(result.Expression === null) {
                        this.Format.Fields._focusNull = value;
                    } else {
                        this.Format.Fields._focusNull = result.Expression;
                    }
                    this._null = value;
                }
            };
            MaskControl.prototype._getDisplayNullExpression = function () {
                if(this._displayNullExpresson !== null) {
                    return this._displayNullExpresson;
                }
                return this._displayNull;
            };
            MaskControl.prototype.GetDisplayNull = function () {
                return this._displayNull;
            };
            MaskControl.prototype.SetDisplayNull = function (value) {
                if(value === undefined) {
                    value = null;
                }
                if(value !== null) {
                    value = input.Utility.CheckString(value);
                }
                if(value !== this._displayNull) {
                    var result = MaskFormat.ParseFillExpression(value, this.Format.Fields);
                    this._displayNullExpresson = result.Expression;
                    this._displayNull = value;
                    var maskValue = this.GetValue();
                    this.SetValue(maskValue);
                }
            };
            MaskControl.prototype.GetFormatPattern = function () {
                return this._formatPattern;
            };
            MaskControl.prototype.SetFormatPattern = function (pattern) {
                pattern = input.BaseUIProcess.UpdateCrLfString(pattern, input.CrLfMode.Filter);
                if(pattern !== this._formatPattern) {
                    try  {
                        var filedCollection = MaskFormat.ParseFormat(pattern, this);
                        this.Clear();
                        this.Format.Fields = filedCollection;
                        this.ResetNullAndDispalyNull();
                        this.FormatIsNull = this.Format.Fields.formatIsNull;
                        this.Clear();
                        this.SetSelectionStart(0);
                        this._formatPattern = pattern;
                        var text = this.GetDisplayText();
                        // DaryLuo 2013/05/23 fix bug 459 in IM HTML5.0.
                        this.UpdateDisplayText(text);
                    } catch (e) {
                        throw "Format pattern is invalid";
                    }
                }
            };
            MaskControl.prototype.ResetNullAndDispalyNull = function () {
                var result = MaskFormat.ParseFillExpression(this.GetNull(), this.Format.Fields);
                if(result.Expression === null) {
                    this.Format.Fields._focusNull = this.GetNull();
                } else {
                    this.Format.Fields._focusNull = result.Expression;
                }
                result = MaskFormat.ParseFillExpression(this.GetDisplayNull(), this.Format.Fields);
                this._displayNullExpresson = result.Expression;
            };
            MaskControl.prototype.GetPromptChar = function () {
                return this._promptChar;
            };
            MaskControl.prototype.SetPromptChar = function (value) {
                if(!value) {
                    value = "_";
                }
                if(value.length > 1) {
                    value = value.charAt(0);
                }
                //value = Utility.CheckChar(value);
                if(value !== this._promptChar) {
                    this._promptChar = value;
                    var maskValue = this.GetValue();
                    this.SetValue(maskValue);
                }
            };
            MaskControl.prototype.GetShowLiterals = function () {
                return this._showLiterals;
            };
            MaskControl.prototype.SetShowLiterals = function (value) {
                if(value != this._showLiterals) {
                    this._showLiterals = value;
                    var maskValue = this.GetValue();
                    this.SetValue(maskValue);
                }
            };
            MaskControl.prototype.GetTabAction = function () {
                return this._tabAction;
            };
            MaskControl.prototype.SetTabAction = function (value) {
                this._tabAction = value;
            };
            MaskControl.prototype.GetCursorPosition = function () {
                return this.CursorPosition;
            };
            MaskControl.prototype.SetCursorPosition = function (value) {
                value = input.Utility.CheckInt(value, -1, Math.pow(2, 31));
                value = Math.min(value, this.Format.Fields.GetTotalInputFieldCount() - 1);
                if(value !== this.CursorPosition) {
                    this.CursorPosition = value;
                }
            };
            MaskControl.prototype.Init = function () {
                this._autoConvert = true;
                this.FormatIsNull = true;
                this.CursorPosition = -1;
                this.truePosition = -1;
                this.japInput = false;
                this.ImeMode = false;
                this.IsImplementImeInput = false;
                this.IsJapanConvertKeyPress = false;
                this.HelpID = '__' + this.ID + '_State';
                this.IsDragDrop = false;
                var data1 = {
                };
                data1.ID = this.ID;
                data1.HelpID = this.HelpID;
                data1.Owner = this;
                this.UIProcess = this._createUIProcess(data1);
                this.Format.Fields = MaskFormat.ParseFormat("", this);
                this.FormatIsNull = this.Format.Fields.formatIsNull;
                this.UIProcess.Format = this.Format;
                this.NewSelectionStart = 0;
                this.NewSelectionEnd = 0;
                if(this.IsInUpdatePanelAndAsyncPostBack) {
                } else {
                    if(this.UIUpdate) {
                        this.UIProcess.Format.Fields.ClearContent();
                        this.UIProcess.Format.Fields.SetText(this.UIUpdate.GetText(), true);
                    }
                }
                this.Text = this.UIProcess.Format.Fields.GetText();
                this.Value = this.UIProcess.Format.Fields.GetValue();
                this.OldText = this.UIProcess.Format.Fields.GetText();
                this.OldFocusText = this.UIProcess.Format.Fields.GetText();
                this.MouseButton = input.MouseButton.Default;
                this.FocusType = input.FocusType.None;
                if(this.IsInUpdatePanelAndAsyncPostBack) {
                    var text = this.UIUpdate.GetText();
                    if(text != this.UIProcess.GetShowText(this.GetShowLiterals(), null, true) && text != this.UIProcess.GetShowText(this.GetShowLiterals(), "LoseFocus", false)) {
                        if(this.ShowLiterals === input.ShowLiterals.Always) {
                            this.UIProcess.Format.Fields.ClearContent();
                            this.UIProcess.Format.Fields.SetText(text, true);
                            this.SetHideValue();
                        } else {
                            this.UIProcess.Format.Fields.ClearContent();
                            var literalText = this.UIProcess.GetShowText("Always", null, true);
                            if(text.GetLength() < literalText.GetLength()) {
                                text = text + literalText.Substring(text.GetLength(), literalText.GetLength());
                            }
                            this.UIProcess.Format.Fields.SetText(text, true);
                            this.SetHideValue();
                        }
                    }
                    this.Text = this.UIProcess.Format.Fields.GetText();
                    this.Value = this.UIProcess.Format.Fields.GetValue();
                    this.OldText = this.UIProcess.Format.Fields.GetText();
                    this.OldFocusText = this.UIProcess.Format.Fields.GetText();
                }
                if(this.UIUpdate) {
                    this.DisplayText = this.GetTextboxValue();
                }
                this.LastStart = 0;
                this.LastEnd = 0;
                this.OrientText = "";
                this.ImeSelect = false;
                this.ImeSelectTimes = 0;
                this.Type = "Mask";
                if(this.UIUpdate) {
                    this.ReLoadData();
                }
            };
            MaskControl.prototype._createUIProcess = function (data) {
                return new MaskUIProcess(data);
            };
            MaskControl.prototype.Clear = function () {
                this.SetValue("");
                // DaryLuo 2013/05/23 fix bug 434 in IM HTMl5.0.
                this.SelectionStart = this.SelectionEnd = this.Format.Fields.GetFirstInputPosition();
            };
            MaskControl.prototype.SetValue = function (value) {
                if(value) {
                    if(typeof (value) != "string") {
                        value = value.toString();
                    }
                    if(this.FormatIsNull) {
                        value = value.replace(/[\r\n]/g, "");
                    }
                    value = input.BaseUIProcess.UpdateCrLfString(value, input.CrLfMode.Filter);
                }
                if(this.UIProcess.Format.Fields.SetValue(value, false)) {
                    this.AfterSetTextValue();
                }
            };
            MaskControl.prototype.GetValue = function () {
                //return this.UIProcess.Format.Fields.GetValue();
                return this.Value;
            };
            MaskControl.prototype.GetSelectedText = function () {
                var start = Math.min(this.SelectionStart, this.SelectionEnd);
                var end = Math.max(this.SelectionStart, this.SelectionEnd);
                var text = this.Text.Substring(start, end);
                if(this.GetClipContent() === input.ClipContent.ExcludeLiterals) {
                    var startPos = Math.min(this.SelectionStart, this.SelectionEnd);
                    var length = this.GetSelectionLength();
                    text = this.UIProcess.Format.Fields.GetNonPromptText(startPos, length);
                }
                return text;
            };
            MaskControl.prototype.SetSelectedText = function (text) {
                if(!text) {
                    return;
                }
                var tempoldValue = this.Value;
                var tempoldText = this.Text;
                this.UIProcess.Paste(this.SelectionStart, this.SelectionEnd, text, false, true);
                var retInfo = {
                };
                retInfo.Text = this.GetDisplayText("Focus");
                if(!this.UpdateText(retInfo)) {
                    return;
                }
                this.UpdateDisplayText(this.Text);
                this.Value = this.UIProcess.Format.Fields.GetValue();
                if(this.Text != tempoldText) {
                    this.FireClientEvent("TextChanged", null);
                }
                if(this.Value != tempoldValue) {
                    this.FireClientEvent("ValueChanged", null);
                }
            };
            MaskControl.prototype.SetText = function (text) {
                try  {
                    this.ShowPromptChar();
                    this.Value = this.UIProcess.Format.Fields.GetValue();
                    if(!text) {
                        this.SetValue("");
                        return;
                    }
                    if(text === this.UIProcess.Format.Fields._focusNull && !this.UIProcess.Format.Fields.formatIsNull) {
                        this.SetValue("");
                        return;
                    }
                    this.UIProcess.Format.Fields.ClearContent();
                    if(this.FormatIsNull) {
                        text = text.replace(/[\r\n]/g, "");
                    }
                    text = input.BaseUIProcess.UpdateCrLfString(text, input.CrLfMode.Filter);
                    if(this.UIProcess.Format.Fields.SetText(text, true).isValid === false) {
                        this.UIProcess.Format.Fields.RollBack();
                    } else {
                        this.AfterSetTextValue();
                    }
                }finally {
                    this.HidePromptChar();
                }
            };
            MaskControl.prototype.AfterSetTextValue = function () {
                var tempoldValue = this.Value;
                var tempoldText = this.Text;
                var retInfo = {
                };
                retInfo.Text = this.GetDisplayText("Focus");
                if(!this.UpdateText(retInfo)) {
                    return;
                }
                this.Value = this.UIProcess.Format.Fields.GetValue();
                this.UpdateDisplayText(this.GetDisplayText());
                if(this.Text != tempoldText) {
                    this.OldText = this.UIProcess.Format.Fields.GetText();
                    this.OldFocusText = this.UIProcess.Format.Fields.GetText();
                    this.FireClientEvent("TextChanged", null);
                }
                if(this.Value != tempoldValue) {
                    this.FireClientEvent("ValueChanged", null);
                }
            };
            MaskControl.prototype.GetText = function () {
                return this.GetDisplayText("Focus");
            };
            MaskControl.prototype.GetDisplayText = function (type) {
                if(!type) {
                    return this.UIProcess.GetShowText(this.GetShowLiterals(), "LoseFocus");
                } else if(type === "Focus") {
                    return this.UIProcess.GetShowText(this.GetShowLiterals());
                }
                return "";
            };
            MaskControl.prototype.GetCurrentField = function () {
                if(this.UIProcess.GetCurrentField(this.SelectionEnd) != null) {
                    return this.UIProcess.GetCurrentField(this.SelectionEnd).index;
                } else {
                    return 0;
                }
            };
            MaskControl.prototype.GetValueIsFull = function () {
                return this.UIProcess.Format.Fields.ValueIsFull(1);
            };
            MaskControl.prototype._getFormatIsNull = function () {
                return this.FormatIsNull;
            };
            MaskControl.prototype.FireClientEvent = function (eventType, args) {
                var name = "";
                switch(eventType) {
                    case "TextChanged":
                        if(this.TextChanged != "") {
                            name = this.TextChanged;
                        }
                        break;
                    case "ValueChanged":
                        if(this.ValueChanged != "") {
                            name = this.ValueChanged;
                        }
                        break;
                    default:
                        return;
                }
                return this.UIProcess.FireEvent(this, name, args, eventType);
            };
            MaskControl.prototype.Focus = function () {
                this.ShowPromptChar();
                if(!this.IsDragDrop && this.FocusType != input.FocusType.ClientEvent && this.FocusType != input.FocusType.SpinButton) {
                    this.OldText = this.UIProcess.Format.Fields.GetText();
                    this.OldFocusText = this.UIProcess.Format.Fields.GetText();
                }
                if(this.UIProcess.Format.Fields.fieldCount > 0) {
                    var retInfo = this.UIProcess.FocusInternal(this.FocusType, this.InputElement, this.GetHighlightText(), this.CursorPosition, this.SelectionStart);
                    if(!retInfo) {
                        return;
                    }
                    if(retInfo.Text != null) {
                        this.Text = retInfo.Text;
                    }
                    if(retInfo.SelectionStart != null && this.NeedReCalCursorPos) {
                        this.SelectionStart = retInfo.SelectionStart;
                    }
                    if(retInfo.SelectionEnd != null && this.NeedReCalCursorPos) {
                        this.SelectionEnd = retInfo.SelectionEnd;
                        this.SelectionLength = this.GetSelectionLength();
                    }
                    if(!this.NeedReCalCursorPos) {
                        this.NeedReCalCursorPos = true;
                    }
                    if(this.japInput === true) {
                        if(this.truePosition != -1) {
                            this.SelectionStart = this.truePosition;
                            this.SelectionEnd = this.truePosition;
                        }
                        this.japInput = false;
                    }
                    if(this.GetReadOnly() === true && this.FocusType === input.FocusType.None) {
                        this.SelectionStart = 0;
                        this.SelectionEnd = this.Text.length;
                    }
                    this.UpdateDisplayText(this.Text);
                    this.SetSelection(this.SelectionStart, this.SelectionEnd, true);
                    if(!this.IsDragDrop && this.FocusType != input.FocusType.ClientEvent && this.FocusType != input.FocusType.SpinButton && this.FocusType != input.FocusType.DropDown) {
                        this.OldValue = this.Value;
                    }
                } else {
                    this.UpdateDisplayText(this.Text);
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                    this.OldValue = this.Value;
                }
                this.IsDragDrop = false;
            };
            MaskControl.prototype._shouldFireValueChangedEvent = function () {
                return this.OldText != this.Text;
            };
            MaskControl.prototype.LoseFocus = function () {
                this.FireKeyExit();
                var imeMode = this.ImeMode;
                if(!input.Utility.IsIE()) {
                    this.ImeInput("ReInput", true);
                } else {
                    this.ImeInput("LoseFocusInput");
                }
                if(this.SpinBtnPressed) {
                    return;
                }
                this.SetLastClientValues();
                var retInfo = this.UIProcess.LoseFocus();
                this.DisplayText = retInfo.Text;
                this.Value = retInfo.Value;
                this.Text = this.UIProcess.Format.Fields.GetText();
                if(input.Utility.IsIE() || !imeMode) {
                    this.UpdateDisplayText(this.DisplayText);
                }
                if(!input.Utility.IsIE() && imeMode) {
                    this.UpdateDisplayText(this.DisplayText);
                }
                this.FocusType = input.FocusType.None;
                var focusType;
                if(retInfo.EventInfo != null) {
                    focusType = this.UIProcess.FireEvent(this, retInfo.EventInfo.Name, retInfo.EventInfo.Args, retInfo.EventInfo.Type)//end by Ryan Wu.
                    ;
                    if(focusType != null) {
                        this.FocusType = focusType;
                    }
                }
                var self = this;
                if(!input.Utility.IsIE() && this.DisplayText != this.UIUpdate.GetText() && imeMode) {
                    window.setTimeout(function () {
                        self.UpdateDisplayText(self.DisplayText);
                    }, 0);
                }
                if(this.GetHighlightText() === input.HighlightText.All) {
                    this.SelectionStart = 0;
                }
                if(this._shouldFireValueChangedEvent()) {
                    focusType = this.FireClientEvent("TextChanged", null);
                    if(focusType != null) {
                        this.FocusType = focusType;
                    }
                    focusType = this.FireClientEvent("ValueChanged", null);
                    if(focusType != null) {
                        this.FocusType = focusType;
                    }
                    this.OldText = this.UIProcess.Format.Fields.GetText();
                    this.OldFocusText = this.UIProcess.Format.Fields.GetText();
                    input.Utility.FireSystemEvent(this.InputElement, "onchange");
                    if(this._getAutoPostBack()) {
                    }
                }
                window.setTimeout(function () {
                    self.HidePromptChar();
                }, 50);
            };
            MaskControl.prototype.shouldFireValueChangedEvent = function () {
                return this.OldText != this.Text;
            };
            MaskControl.prototype.MouseDown = function (evt) {
                var mouseButton = input.Utility.GetMouseButton(evt);
                this.FocusedWhenMouseDown = document.activeElement === (evt.srcElement || evt.target);
                this.MouseDownOnClearButton = input.Utility.IsMouseDownOnClearButton(evt);
                _super.prototype.MouseDown.call(this, evt);
                if(this.MouseButton === input.MouseButton.Right) {
                    this.FocusType = input.FocusType.ContextMenu;
                } else {
                    this.MouseButton = input.MouseButton.Left;
                }
                this.UIProcess.isDblClick = false;
                this.SelectionLength = this.GetSelectionLength();
                if(!input.Utility.IsIE() && this.ImeMode && mouseButton === input.MouseButton.Left) {
                    this.IsImplementImeInput = true;
                }
            };
            MaskControl.prototype.MouseUp = function (evt) {
                if(!input.Utility.IsIE() && this.ImeMode) {
                    if(!this.IsImplementImeInput) {
                        return;
                    }
                    this.IsImplementImeInput = false;
                }
                this.LastStart = this.SelectionStart;
                this.LastEnd = this.SelectionEnd;
                _super.prototype.MouseUp.call(this, evt);
                if(!this.ImeMode) {
                    this.SelectionLength = this.GetSelectionLength();
                } else {
                    this.SelectionStart = this.LastStart;
                    this.SelectionEnd = this.LastEnd;
                    this.SelectionLength = this.GetSelectionLength();
                    if(input.Utility.IsIE()) {
                        this.ImeInput("ClickInput");
                    } else {
                        this.ImeInput("ReInput", true);
                    }
                    if(!input.Utility.IsIE() && this.Text != this.UIUpdate.GetText()) {
                        var self = this;
                        window.setTimeout(function () {
                            self.UpdateDisplayText(self.Text);
                        }, 0);
                    }
                }
                if(this.MouseUpPointerType == undefined) {
                    this.MouseUpHasValue = this.GetInputElement().value.length > 0;
                }
                this.HandleClearButton(evt);
            };
            MaskControl.prototype.KeyDown = function (evt) {
                var k = evt.keyCode;
                var funcKeysPressed = {
                };
                funcKeysPressed.Shift = false;
                funcKeysPressed.Ctrl = false;
                funcKeysPressed.Alt = false;
                if(evt.shiftKey) {
                    funcKeysPressed.Shift = true;
                }
                if(evt.ctrlKey) {
                    funcKeysPressed.Ctrl = true;
                }
                if(evt.altKey) {
                    funcKeysPressed.Alt = true;
                }
                var Data1 = {
                };
                var oldImeMode = this.ImeMode;
                this.ImeMode = false;
                if(k === 229) {
                    // DaryLuo 2013/08/29 fix bug 517 in IM HTML 5.0.
                    // Set IMeMode to true in the Composition start event.
                    if(input.Utility.IsIE8OrBelow()) {
                        this.ImeMode = true;
                    }
                    return true;
                }
                if(!this.ImeMode && oldImeMode && !funcKeysPressed.Shift && !funcKeysPressed.Ctrl) {
                    if(k != 9 && k != 65545) {
                        this.ImeInput("ReInput", true);
                        this.ImeSelectTimes = 0;
                    }
                }
                Data1.KeyCode = k;
                Data1.Text = this.Text;
                Data1.FuncKeysPressed = funcKeysPressed;
                Data1.SelectionStart = this.SelectionStart;
                Data1.SelectionEnd = this.SelectionEnd;
                Data1.EditMode = this._getEditModeInternal();
                Data1.ReadOnly = this.GetReadOnly();
                Data1.ClipContent = this.GetClipContent();
                Data1.ExitOnLastChar = this.GetExitOnLastChar();
                Data1.ExitOnLeftRightKey = this.GetExitOnLeftRightKey();
                Data1.TabAction = this.GetTabAction();
                var retInfo = _super.prototype.KeyDown.call(this, Data1);
                if(retInfo.inputChar != null) {
                    return true;
                }
                if((funcKeysPressed.Shift || funcKeysPressed.Ctrl || funcKeysPressed.Alt) && !retInfo) {
                    return true;
                }
                // enter key.
                if(this.GetHideEnter() && k === 13) {
                    return false;
                }
                return retInfo.System;
            };
            MaskControl.prototype.KeyPress = function (text, evt) {
                var k = evt.keyCode || evt.charCode;
                var _conditions = (k === 192) && evt.altKey;
                if(!input.Utility.IsIE() && this.ImeMode) {
                    if(_conditions) {
                        this.ImeInput("ReInput", true);
                        return false;
                    }
                }
                if(!input.Utility.IsIE() && (k === 229 || _conditions)) {
                    return false;
                }
                var inputChar = text;
                var retInfo = this.UIProcess.KeyPressInternal(this.InputElement, this.SelectionStart, this.SelectionEnd, this.GetExitOnLastChar(), inputChar);
                if(this.japInput != true) {
                    if(retInfo.SelectionStart != null) {
                        this.NewSelectionStart = retInfo.SelectionStart;
                    }
                    if(retInfo.SelectionEnd != null) {
                        this.NewSelectionEnd = retInfo.SelectionEnd;
                    }
                    if(retInfo.Text != null) {
                        if(!this.UpdateText(retInfo)) {
                            return false;
                        }
                        this.UpdateDisplayText(this.Text);
                    }
                    var shouldReturn = this._doExtraWorkForKeyPress(text);
                    if(shouldReturn === true) {
                        return;
                    }
                    if(retInfo.SelectionStart != null) {
                        this.SelectionStart = retInfo.SelectionStart;
                    }
                    if(retInfo.SelectionEnd != null) {
                        this.SelectionEnd = retInfo.SelectionEnd;
                        this.SelectionLength = this.GetSelectionLength();
                        if(retInfo.FocusExit != true) {
                            this.SetSelection(this.SelectionStart, this.SelectionEnd);
                        }
                    }
                    if(retInfo.exception != null) {
                        this.UpdateDisplayText(this.Text);
                        this.SetSelection(this.SelectionStart, this.SelectionEnd);
                    }
                    if(retInfo.EventInfo != null) {
                        this.UIProcess.FireEvent(this, retInfo.EventInfo.Name, retInfo.EventInfo.Args, retInfo.EventInfo.Type);
                        if(retInfo.EventInfo.Type === "KeyExit") {
                            this.EventInfo = retInfo.EventInfo;
                            this.FireKeyExit();
                        }
                        this.FocusType = input.FocusType.ClientEvent;
                    }
                    if(evt.keyCode === 13) {
                        return true;
                    }
                } else {
                    if(evt.keyCode === 13) {
                        return true;
                    }
                    if(retInfo.SelectionStart != null) {
                        this.truePosition = retInfo.SelectionStart;
                    }
                    if(retInfo.EventInfo != null) {
                        this.UIProcess.FireEvent(this, retInfo.EventInfo.Name, retInfo.EventInfo.Args, retInfo.EventInfo.Type);
                    }
                }
            };
            MaskControl.prototype._doExtraWorkForKeyPress = function (text) {
                return false;
            };
            MaskControl.prototype.innerKeyPress = function (text, isLoseFocusInput, unUpdate) {
                var inputChar = text;
                isLoseFocusInput = !!isLoseFocusInput;
                var retInfo = this.UIProcess.KeyPressInternal(this.InputElement, this.SelectionStart, this.SelectionEnd, this.GetExitOnLastChar(), inputChar);
                if(this.japInput != true) {
                    if(retInfo.Text != null) {
                        if(!this.UpdateText(retInfo)) {
                            return false;
                        }
                        if(!unUpdate) {
                            this.UpdateDisplayText(this.Text);
                        }
                    }
                    if(retInfo.SelectionStart != null) {
                        this.SelectionStart = retInfo.SelectionStart;
                    }
                    if(retInfo.SelectionEnd != null) {
                        this.SelectionEnd = retInfo.SelectionEnd;
                        this.SelectionLength = this.GetSelectionLength();
                        if(retInfo.FocusExit != true && !isLoseFocusInput && !unUpdate) {
                            if(retInfo.FocusExit != true) {
                                this.SetSelection(this.SelectionStart, this.SelectionEnd);
                            }
                        }
                    }
                    if(retInfo.exception != null) {
                        if(!unUpdate) {
                            this.UpdateDisplayText(this.Text);
                        }
                        if(retInfo.FocusExit != true) {
                            this.SetSelection(this.SelectionStart, this.SelectionEnd);
                        }
                    }
                    if(retInfo.EventInfo != null) {
                        this.UIProcess.FireEvent(this, retInfo.EventInfo.Name, retInfo.EventInfo.Args, retInfo.EventInfo.Type);
                        this.FocusType = input.FocusType.ClientEvent;
                    }
                    if(window.event != null && event.keyCode === 13) {
                        return true;
                    }
                } else {
                    if(window.event != null && event.keyCode === 13) {
                        return true;
                    }
                    if(retInfo.SelectionStart != null) {
                        this.truePosition = retInfo.SelectionStart;
                    }
                    if(retInfo.EventInfo != null) {
                        this.UIProcess.FireEvent(this, retInfo.EventInfo.Name, retInfo.EventInfo.Args, retInfo.EventInfo.Type);
                    }
                }
            };
            MaskControl.prototype.KeyUp = function (e) {
                if(this.ImeMode === true && input.Utility.IsIE8OrBelow()) {
                    var k = e.keyCode;
                    var CharEx = input.CharProcess.CharEx;
                    var nowText = this.GetTextboxValue();
                    var inputText = nowText;
                    if(this.SelectionEnd < this.Text.GetLength()) {
                        var lastLength = this.Text.GetLength() - this.SelectionEnd;
                        inputText = nowText.Substring(0, nowText.GetLength() - lastLength);
                    }
                    inputText = inputText.Substring(inputText.GetLength() - 1, inputText.GetLength());
                    if(k === 13) {
                        this.ImeInput("DirectInput");
                    } else if((k >= 48 && k <= 57) || (k >= 96 && k <= 105)) {
                        if(k >= 96) {
                            k = k - 48;
                        }
                        inputText = CharEx.ToHalfWidth(inputText);
                        if(inputText != String.fromCharCode(k)) {
                        } else if(inputText === String.fromCharCode(k) && this.ImeSelectTimes < 1) {
                        } else if(this.ImeSelect) {
                        } else {
                            this.ImeInput("ReInput");
                        }
                        this.ImeSelectTimes = 0;
                    } else if(k === 32) {
                        if(this.ImeSelect === false) {
                            if(this.ImeSelectTimes === 1) {
                                this.ImeSelect = true;
                            } else {
                                if(CharEx.ToHalfWidth(inputText) != String.fromCharCode(k)) {
                                    this.ImeSelectTimes++;
                                } else {
                                    var unconfirmedString = nowText.Substring(this.SelectionStart, nowText.GetLength() - lastLength);
                                    if(CharEx.ToHalfWidth(unconfirmedString) === String.fromCharCode(k)) {
                                        this.ImeInput("DirectInput");
                                    }
                                }
                            }
                        }
                    } else if(k >= 65 && k <= 90) {
                        this.ImeSelectTimes = 0;
                    } else if(k === 32 || k === 106 || k === 107 || k === 109 || k === 110 || k === 111 || k === 219 || k === 220 || k === 221 || k === 222 || (k >= 186 && k <= 192)) {
                        if(this.ImeSelectTimes >= 1) {
                            this.ImeInput("ReInput");
                        }
                        this.ImeSelectTimes = 0;
                    } else if(k === 40 || k === 38) {
                        if(this.ImeSelect === false) {
                            if(this.ImeSelectTimes === 1) {
                                this.ImeSelect = true;
                            }
                        }
                    } else if(k === 8 || k === 46 || k === 27) {
                        this.ImeSelectTimes = 0;
                    } else if(k === 244) {
                        this.IsJapanConvertKeyPress = true;
                    } else {
                    }
                }
                //else if (!isIE && this.Text != this.UIUpdate.GetText())
                //{
                //    if (e.keyCode === 13)
                //    {
                //        this.ImeInput("DirectInput");
                //        this.ImeSelectTimes = 0;
                //    }
                //}
                //if (e.keyCode === 242)
                //{
                //    this.ImeInput("ReInput", true);
                //}
                if(e.keyCode !== 13) {
                    return false;
                }
            };
            MaskControl.prototype.PerformSpinProcess = function (selectionStart, selectionEnd, increment, isWrap, isUp, isButton) {
                if(this.GetReadOnly() && isButton) {
                    return;
                }
                var retInfo = this.UIProcess.PerformSpinInternal(selectionStart, selectionEnd, increment, isWrap, isUp);
                this.FocusType = input.FocusType.SpinButton;
                if(!retInfo) {
                    this.UIUpdate.SetFocus();
                    return;
                }
                if(retInfo.Text != null) {
                    if(!this.UpdateText(retInfo)) {
                        return;
                    }
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                    this.SelectionLength = this.GetSelectionLength();
                }
                if(retInfo.EventInfo) {
                    var focusType = this.UIProcess.FireEvent(this, retInfo.EventInfo.Name, retInfo.EventInfo.Args, retInfo.EventInfo.Type);
                    if(focusType != null) {
                        this.FocusType = focusType;
                    }
                }
                if(this.Text !== this.GetTextboxValue()) {
                    var fieldArray = this.Format.Fields.fieldArray;
                    for(var i = 0; i < fieldArray.length; i++) {
                        if(fieldArray[i].fieldLabel === "EnumField") {
                            break;
                        }
                    }
                    if(i === fieldArray.length) {
                        return;
                    }
                    this.UpdateDisplayText(this.Text);
                }
            };
            MaskControl.prototype.SelectStart = function (selText) {
                if(!this.ImeMode) {
                    _super.prototype.SelectStart.call(this, selText);
                } else {
                    return false;
                }
            };
            MaskControl.prototype.Click = function () {
            };
            MaskControl.prototype.DragDrop = function (text) {
                if(!input.Utility.IsIE() && this.GetReadOnly()) {
                    return false;
                }
                this.IsDragDrop = true;
                this.Paste(text, true, 0, 0);
                return false;
            };
            MaskControl.prototype.DragOver = function () {
            };
            MaskControl.prototype.DragInit = function () {
            };
            MaskControl.prototype.ImeInput = function (operate, reInputType) {
                var newValue = this.UIUpdate.GetText();
                if(newValue === this.Text) {
                    if(window.event) {
                        input.Utility.PreventDefault(window.event);
                    }
                    this.ImeMode = false;
                    return false;
                }
                var imeInputText;
                if(this.Text !== "") {
                    var start = Math.min(this.SelectionStart, this.SelectionEnd);
                    var end = Math.max(this.SelectionStart, this.SelectionEnd);
                    if(end < this.Text.GetLength()) {
                        var lastText = this.Text.Substring(end, this.Text.GetLength());
                        var textIndex = newValue.IndexOf(lastText);
                        if(textIndex !== -1) {
                            imeInputText = newValue.Substring(start, newValue.GetLength() - lastText.GetLength());
                        } else {
                            imeInputText = "";
                        }
                    } else {
                        imeInputText = newValue.Substring(start, newValue.GetLength());
                    }
                } else {
                    imeInputText = newValue;
                }
                if(operate === "ReInput") {
                    if(!reInputType) {
                        imeInputText = imeInputText.Substring(0, imeInputText.GetLength() - 1);
                    } else {
                        imeInputText = imeInputText.Substring(0, imeInputText.GetLength());
                    }
                }
                if(operate === "Record") {
                    return imeInputText;
                }
                var LoseFocusInput = false;
                if(operate === "LoseFocusInput") {
                    if(imeInputText === "") {
                        return;
                    }
                    MaskControl.Mask_ImeResponse = true;
                    LoseFocusInput = true;
                }
                for(var i = 0; i < imeInputText.GetLength(); i++) {
                    if(i === imeInputText.GetLength() - 1 && operate === "LoseFocusInput") {
                        this.japInput = true;
                    }
                    MaskControl.Mask_ImeResponse = true;
                    if(imeInputText.GetLength() > i + 1) {
                        var c = imeInputText.Substring(i + 1, i + 2);
                        var _charCategory = new input.CharCategory();
                        var daku = c.charCodeAt(0) - (_charCategory.KATAKANA_VOICED.charCodeAt(0) - 1);// should be KATAKANA_VOICED or KATAKANA_SEMIVOICED.
                        
                        if(daku === 1 || daku === 2) {
                            this.innerKeyPress(imeInputText.Substring(i, i + 2), LoseFocusInput);
                            i++;
                        } else {
                            if(operate === "ReInput") {
                                this.innerKeyPress(imeInputText.Substring(i, i + 1), LoseFocusInput, true);
                            } else {
                                this.innerKeyPress(imeInputText.Substring(i, i + 1), LoseFocusInput);
                            }
                        }
                    } else {
                        if(operate === "ReInput") {
                            this.innerKeyPress(imeInputText.Substring(i, i + 1), LoseFocusInput, true);
                        } else {
                            this.innerKeyPress(imeInputText.Substring(i, i + 1), LoseFocusInput);
                        }
                    }
                }
                this.japInput = false;
                this.ImeMode = false;
                this.ImeSelect = false;
                if(operate === "ReInput" || operate === "ClickInput") {
                    this.truePosition = this.SelectionStart;
                    this.FocusType = input.FocusType.ImeInput;
                }
            };
            MaskControl.prototype.SetInnerText = function (text) {
                this.Clear();
                if(this.UIProcess.Format.Fields.SetText(text, true).isValid === false) {
                    this.UIProcess.Format.Fields.RollBack();
                } else {
                    this.UIProcess.Format.Fields.SaveOldState();
                }
                var retInfo = {
                };
                retInfo.Text = this.GetDisplayText("Focus");
                if(!this.UpdateText(retInfo)) {
                    return;
                }
                this.UpdateDisplayText(this.Text);
            };
            MaskControl.prototype.Copy = function () {
                this.SetSelection(this.SelectionStart, this.SelectionEnd);
                _super.prototype.Copy.call(this);
            };
            MaskControl.prototype.Cut = function () {
                this.SetSelection(this.SelectionStart, this.SelectionEnd)//add for bug: 4319
                ;
                _super.prototype.Cut.call(this);
            };
            MaskControl.prototype.Paste = function (text, isSetSelectedText, start, end) {
                var pasteText = "";
                if(text != null) {
                    pasteText = text;
                }
                if(!start) {
                    start = this.SelectionStart;
                }
                if(!end) {
                    end = this.SelectionEnd;
                }
                var retInfo = this.UIProcess.Paste(start, end, pasteText, this.GetExitOnLastChar(), isSetSelectedText);
                if(!retInfo) {
                    return false;
                }
                if(retInfo.Value != null) {
                    this.Value = retInfo.Value;
                }
                if(retInfo.Text != null) {
                    if(!this.UpdateText(retInfo)) {
                        return false;
                    }
                    this.UpdateDisplayText(this.Text);
                    if(!input.Utility.IsIE()) {
                        this.SetInnerFocus();
                    }
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                    this.SelectionLength = Math.abs(this.SelectionEnd - this.SelectionStart);
                }
                if(retInfo && retInfo.FocusExit != null && retInfo.FocusExit) {
                } else {
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                }
                if(retInfo.EventInfo) {
                    this.UIProcess.FireEvent(this, retInfo.EventInfo.Name, retInfo.EventInfo.Args, retInfo.EventInfo.Type);
                }
                return true;
            };
            MaskControl.prototype.SetHideValue = function () {
            };
            MaskControl.prototype.GetHideValue = function () {
            };
            MaskControl.prototype.CanUndo = function () {
                if(this.Format.Fields.CanUndo()) {
                    return true;
                } else {
                    return false;
                }
            };
            MaskControl.prototype.DoSpinUp = function (field, increment) {
                if(arguments.length === 1) {
                    increment = field;
                    field = undefined;
                }
                this.DoSpin("up", field, increment);
            };
            MaskControl.prototype.DoSpinDown = function (field, increment) {
                if(arguments.length === 1) {
                    increment = field;
                    field = undefined;
                }
                this.DoSpin("down", field, increment);
            };
            MaskControl.prototype.DoSpin = function (type, field, increment) {
                if((typeof field === "number" && isNaN(field)) || (typeof increment === "number" && isNaN(increment))) {
                    return;
                }
                var startPos = this.SelectionStart;
                var endPos = this.SelectionEnd;
                var newIncrement = this.Increment;
                if(field != undefined) {
                    field = input.Utility.CheckInt(field, 0, Math.pow(2, 31));
                    var fieldRange = {
                    };
                    fieldRange.start = 0;
                    fieldRange.length = 0;
                    fieldRange = this.Format.Fields.GetRealFieldRange(field);
                    startPos = fieldRange.start;
                    endPos = fieldRange.start + fieldRange.length;
                }
                if(increment != undefined) {
                    newIncrement = increment;
                }
                newIncrement = input.Utility.CheckInt(newIncrement, -Math.pow(2, 31), Math.pow(2, 31));
                if(type === "up") {
                    this.PerformSpinProcess(startPos, endPos, newIncrement, this.Wrap, true, false);
                } else {
                    this.PerformSpinProcess(startPos, endPos, newIncrement, this.Wrap, false, false);
                }
            };
            MaskControl.prototype.UpdateText = function (retInfo) {
                if(!retInfo) {
                    return false;
                }
                var text = "";
                if(retInfo.Text != null) {
                    text = retInfo.Text;
                }
                if(text !== this.Text && this.TextChanging != null && this.TextChanging != "") {
                    var eventInfo = {
                    };
                    var eventArgs = {
                    };
                    eventArgs.Result = text;
                    eventArgs.Cancel = false;
                    eventInfo.Name = this.TextChanging;
                    eventInfo.Args = eventArgs;
                    if(retInfo.SelectionStart != null) {
                        this.NewSelectionStart = retInfo.SelectionStart;
                    }
                    if(retInfo.SelectionEnd != null) {
                        this.NewSelectionEnd = retInfo.SelectionEnd;
                    }
                    var newFieldText = this.UIProcess.GetSepText();
                    this.RollBack();
                    if(typeof (this.NeedSetHideValue) === "undefined") {
                        this.NeedSetHideValue = true;
                    }
                    if(this.NeedSetHideValue) {
                        this.SetHideValue();
                    }
                    if(eventInfo.Name.IndexOf && eventInfo.Name.IndexOf("gcsh_InputManWeb_AjaxServerEventHandler") > -1) {
                        this.UIProcess.Format.Fields.ClearContent();
                        if(this.FormatIsNull) {
                            this.UIProcess.Format.Fields.SetText(newFieldText, true);
                        } else {
                            this.UIProcess.SetSepText(newFieldText);
                        }
                    }
                    var focusType = this.UIProcess.FireEvent(this, eventInfo.Name, eventInfo.Args, "TextChanging");
                    if(eventInfo.Name.IndexOf && eventInfo.Name.IndexOf("gcsh_InputManWeb_AjaxServerEventHandler") > -1) {
                    }
                    if(focusType != null) {
                        this.FocusType = focusType;
                    }
                    if(typeof (this.TextChanging) !== "undefined") {
                        this.NeedSetHideValue = false;
                    }
                    if(eventArgs.Cancel) {
                        this.UpdateDisplayText(this.Text);
                        this.SetSelection(this.SelectionStart, this.SelectionEnd);
                        return false;
                    }
                    this.UIProcess.Format.Fields.ClearContent();
                    if(this.FormatIsNull) {
                        this.UIProcess.Format.Fields.SetText(newFieldText, true);
                    } else {
                        this.UIProcess.SetSepText(newFieldText);
                    }
                }
                this.Text = text;
                this.Value = this.UIProcess.Format.Fields.GetValue();
                return true;
            };
            MaskControl.prototype.UpdateDisplayText = function (text) {
                if(typeof (this.NeedSetHideValue) === "undefined") {
                    this.NeedSetHideValue = true;
                }
                if(this.NeedSetHideValue) {
                    _super.prototype.UpdateDisplayText.call(this, text);
                    if(this.EditingTextChanged) {
                        this.EditingTextChanged.call(this);
                    }
                }
            };
            MaskControl.prototype.RollBack = function () {
                this.UIProcess.Format.Fields.RollBack();
            };
            MaskControl.prototype.ProcessReservedKey = function (k) {
                var retValue = _super.prototype.ProcessReservedKey.call(this, k);
                if(!retValue) {
                    switch(k) {
                        case 118:
                        case 119:
                            return true;
                    }
                } else {
                    return true;
                }
                return false;
            };
            MaskControl.prototype.AddAllEventsHandler = function () {
                _super.prototype.AddAllEventsHandler.call(this);
                var self = this;
                if(input.Utility.IsIE10OrLater()) {
                    $(this.GetInputElement()).bind("MSPointerUp.wijinput", function (evt) {
                        input.GlobalEventHandler.OnMSPointerUp(self, evt);
                    }, false);
                }
            };
            MaskControl.prototype.CompositionStart = function (evt) {
                this.ImeMode = true;
            };
            MaskControl.prototype.CompositionUpdate = function (evt) {
            };
            MaskControl.prototype.CompositionEnd = function (evt) {
                var self = this;
                var iMeHandler = function () {
                    try  {
                        self.ImeInput("DirectInput");
                    }finally {
                        self.ImeMode = false;
                    }
                };
                if(input.Utility.IsIE9OrLater()) {
                    iMeHandler();
                } else {
                    // DaryLuo 2013/05/15 fix bug 382 in IM HTML5.
                    window.setTimeout(iMeHandler, 0);
                }
            };
            MaskControl.prototype.Select = function () {
                if(this.ImeMode) {
                    // When IMe input, doesn't syn selection.
                    return;
                }
                this.SelectionStart = input.Utility.GetSelectionStartPosition(this.GetInputElement());
                this.SelectionEnd = this.SelectionStart + input.Utility.GetSelectionText(this.GetInputElement()).GetLength();
            };
            MaskControl.prototype.MSPointerUp = function (evt) {
                if(evt) {
                    this.MouseUpPointerType = evt.pointerType;
                    this.MouseUpHasValue = (evt.srcElement || evt.target).value.length > 0;
                }
            };
            MaskControl.prototype.HandleClearButton = function (evt) {
                if(input.Utility.IsIE10OrLater() && this.FocusedWhenMouseDown && this.MouseDownOnClearButton) {
                    if((evt.srcElement || evt.target) === this.InputElement) {
                        var isFocused = document.activeElement === (evt.srcElement || evt.target);
                        var hitTestResult = input.Utility.IsMouseDownOnClearButton(evt);
                        if(this.MouseUpHasValue && isFocused && hitTestResult) {
                            this.Clear();
                            var text = this.GetText();
                            var thisObj = this;
                            window.setTimeout(function () {
                                thisObj.UpdateDisplayText(text);
                                thisObj.SelectionStart = thisObj.SelectionEnd = thisObj.Format.Fields.GetFirstInputPosition();
                                thisObj.SetSelection(thisObj.SelectionStart, thisObj.SelectionEnd);
                            }, 0);
                        }
                    }
                }
            };
            MaskControl.prototype.HidePromptChar = function () {
                if(this.GetHidePromptOnLeave()) {
                    var value = this.GetInputElement().value;
                    this._textWithPromptChar = value;
                    value = value.replace(new RegExp(this.GetPromptChar(), "g"), " ");
                    this.GetInputElement().value = value;
                }
            };
            MaskControl.prototype.ShowPromptChar = function () {
                if(this._textWithPromptChar !== null) {
                    this.GetInputElement().value = this._textWithPromptChar;
                    this._textWithPromptChar = null;
                }
            };
            MaskControl.prototype.GetHideEnter = function () {
                return this._hideEnter;
            };
            MaskControl.prototype.SetHideEnter = function (hideEnter) {
                this._hideEnter = hideEnter;
            };
            MaskControl.prototype.GetHidePromptOnLeave = function () {
                return this._hidePromptOnLeave;
            };
            MaskControl.prototype.SetHidePromptOnLeave = function (value) {
                if(value !== this._hidePromptOnLeave) {
                    this._hidePromptOnLeave = value;
                    if(value && document.activeElement !== this.GetInputElement()) {
                        this.HidePromptChar();
                    }
                    if(!value && document.activeElement !== this.GetInputElement()) {
                        this.ShowPromptChar();
                    }
                }
            };
            MaskControl.prototype.FireKeyExit = function () {
                if(this.EventInfo != null && this.EventInfo.Type == "KeyExit") {
                    if(this.KeyExit) {
                        this.KeyExit.call(this);
                    }
                    this.FocusType = input.FocusType.KeyExit;
                    //end by wuhao for fix bug 419
                    this.EventInfo = null;
                }
            };
            MaskControl.prototype.OnEditStatusChanged = function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.EditStatusChangedEvent = callBack;
            };
            MaskControl.prototype.OnInvalidInput = function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.InvalidInputEvent = callBack;
            };
            MaskControl.prototype.OnKeyExit = function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.KeyExit = callBack;
            };
            MaskControl.prototype.OnSpinDown = function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.SpinDown = callBack;
            };
            MaskControl.prototype.OnSpinUp = function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.SpinUp = callBack;
            };
            MaskControl.prototype.OnTextChanged = function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.TextChanged = callBack;
            };
            MaskControl.prototype.OnTextChanging = function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.TextChanging = callBack;
            };
            MaskControl.prototype.OnValueChanged = function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.ValueChanged = callBack;
            };
            MaskControl.prototype.OnMouseDownCallBack = function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.MouseDownEvent = callBack;
            };
            MaskControl.prototype.OnMouseUpCallBack = function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.MouseUpEvent = callBack;
            };
            MaskControl.prototype.OnEditingTextChanged = function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.EditingTextChanged = callBack;
            };
            MaskControl.prototype.IsFocused = function () {
                try  {
                    return document.activeElement === this.GetInputElement();
                } catch (e) {
                    return false;
                }
            };
            MaskControl.prototype.GetTextOnSimpleMode = function () {
                if(!this.IsFocused() && this.Format.Fields.ValueIsNull() && this._getDisplayNullExpression() !== null) {
                    return this.GetTextboxValue();
                }
                var text = this.Format.Fields.GetTextSimpleMode(false);
                var reg = new RegExp("\\" + this.GetPromptChar(), "g");
                text = text.replace(reg, " ");
                return text;
            };
            MaskControl.prototype.GetPostValueOnSimpleMode = function () {
                if(!this.IsFocused() && this.Format.Fields.ValueIsNull() && this._getDisplayNullExpression() !== null) {
                    return this.GetTextboxValue();
                }
                var text = this.Format.Fields.GetTextSimpleMode(true);
                var reg = new RegExp("\\" + this.GetPromptChar(), "g");
                text = text.replace(reg, " ");
                return text;
            };
            return MaskControl;
        })(BaseInputControl);
        input.MaskControl = MaskControl;        
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
