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
    (function (input) {
        var CharInfo = (function () {
            function CharInfo() { }
            CharInfo.PADCHAR = "=";
            CharInfo.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            CharInfo.Getbyte64 = function Getbyte64(s, i) {
                var idx = CharInfo.ALPHA.indexOf(s.charAt(i));
                if(idx == -1) {
                    throw "Cannot decode base64";
                }
                return idx;
            };
            CharInfo.Decode = function Decode(s) {
                if(window.atob !== undefined) {
                    return window.atob(s);
                }
                // convert to string
                s = "" + s;
                var getbyte64 = CharInfo.Getbyte64;
                var pads, i, b10;
                var imax = s.length;
                if(imax == 0) {
                    return s;
                }
                if(imax % 4 != 0) {
                    throw "Cannot decode base64";
                }
                pads = 0;
                if(s.charAt(imax - 1) == CharInfo.PADCHAR) {
                    pads = 1;
                    if(s.charAt(imax - 2) == CharInfo.PADCHAR) {
                        pads = 2;
                    }
                    // either way, we want to ignore this last block
                    imax -= 4;
                }
                var x = [];
                for(i = 0; i < imax; i += 4) {
                    b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12) | (getbyte64(s, i + 2) << 6) | getbyte64(s, i + 3);
                    x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
                }
                switch(pads) {
                    case 1:
                        b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12) | (getbyte64(s, i + 2) << 6);
                        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
                        break;
                    case 2:
                        b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12);
                        x.push(String.fromCharCode(b10 >> 16));
                        break;
                }
                return x.join('');
            };
            CharInfo.prototype.getbyte = function (s, i) {
                var x = s.charCodeAt(i);
                if(x > 255) {
                    throw "INVALID_CHARACTER_ERR: DOM Exception 5";
                }
                return x;
            };
            CharInfo._charInfo = [];
            CharInfo._base64CharInfo = "YwBoAGEAcgBpAG4AZgBvAC4AbgBsAHAAAAD+/wgAPAAAAGBLAAD0SwAAgHcAAIB4AAAAERARIBEwEUARUBFgEXARgBGQEaARsBHAEdAR4BHwEQASEBIgEjASQBJQEmAScBKAEpASoBKwEsAS0BLgEvASABMQEyATMBNAE1ATYBNwE4ATkBOgE7ATwBPQE+AT8BMAFBAUIBQwFFAS/v8ZAEAUUBL+/1EAUBRgFFAS/v8DAHAUUBKAFJAUoBSwFMAUgBFQEv7/KwDQFOAU/v8IAPAU/v8ZAFASABUQFSAVMBVAFVAVYBVwFYAVkBWgFYAR/v8DALAVwBXQFYAR/v8VAFAS/v8DAOAV8BWAEf7/qwAAFhAWIBYwFkAWUBZgFnAWgBH+/xgAgBaAEf7/DwBQEv7/pgCQFoAR/v9RAFAS/v8CAKAWgBH+/wULsBbAFoAR/v/+APAU/v//ANAW8BT+//8A0BbgFugW8Bb4FgAXCBcQFxgXIBcoFzAXOBdAF0gXUBdYF2AX/v8DAGgXcBdgF/7/AgB4F4AXiBeQF5gXoBeoF2AXsBdgF/7/AwC4F8AXUBf+/wQAyBdQF9AX2BfgF+gX8Bf4F/7/BwAAGAgYEBgYGFAXIBgoGGAXMBhAF/7/AwBQF/7/AwBgF/7/AgA4GGAX/v8DAEAYYBf+/wUASBhQGEAXWBhgGFAXaBhwGPgXeBiAGIgYkBiYGKAYqBiwGLgYwBjIGNAY2Bi4GP7/BQDgGOgY8Bj4GAAZuBj4FwgZuBj+/wUAEBkYGSAZiBgoGTAZOBn+/xAAQBlIGf7/AgBQGVgZYBloGXAZeBmAGYgZkBmYGaAZqBmwGbgZgBmIGcAZyBnQGdgZ4BnoGfAZiBn4GQAaCBqoGRAaeBmAGYgZGBogGigaqBkwGjgaQBpIGlAaWBpgGtgZaBpwGngaiBmAGogakBqoGZgaoBp4GogZqBqwGrgaqBnAGqAaeBqIGcga0BrYGqgZ4BroGvAaSBn4GgAbCBs4GRAbGBtIGf7/AgAgGygbMBs4Gf7/AgA4G0AbSBtQG1gbYBs4Gf7/AgBoG3AbeBuAG4gbSBmQG5gboBuoG/gXsBu4G8AbOBn+/wIASBn+/wIAyBvQG9gb4BvoG/Ab+BsAHEAX/v8CAAgcSBn+/wIAEBxIGf7/BQAYHEgZ/v8EACAcSBn+/wQAKBxIGf7/BAAwHDgcSBn+/wIAMBxIGf7/AgBAHEgcUBxIGf7/AwBIHEgZ/v8DAFgcYBxoHEgZcBxIGf7/BQB4HBgbSBn+/yUAgByIHJAcmBxIGf7/BACgHKgcsBy4HEgZwBxIGcgcsBzQHEgZ/v8DANgc4BzoHPAc+BwAHfAcSBn+/wIACB1IGf7/AgAQHUgZ/v8CABgdOBn+/wUASBmQGyAdKB0wHUgZOB14HEgZ/v8CACgcQB1IHVAdWB3+/wIASBlgHTgZ/v8OAGgdSBn+/wIAcB14HdgbgB2IHZAdSBmYHfAcOBn+/wQASBn+/wIAoB2oHbAduB1IGcAdOBn+/wgAUBf+/wIAyB3QHf7/AwDYHeAdUBfoHdAd/v8CAPgX/v8CAPAd+B1gF/7/CQAAHmAX/v8GAAgeEB4IHv7/AgAQHhgeCB4gHige/v8DADAeOB5AHkgeUB5YHmAeaB5wHngegB6IHpAemB6gHqgesB44GbgewB7IHtAe2B7gHuge8B74HgAf/v8CAAgfEB8YH1gdIB8oH1gdMB84H0AfOB/+/w4ASB9YHVAfWB9gH/7/AwBoH1gdcB84H3gfWB2AH4gfOBlYHf7/AgCQHzgZmB84GaAf/v8CAKgfsB9gH/7/BAC4H6AfWB3+/wsAwB/IH1gd/v8CANAfWB3+/wYA2B9YHf7/AgDgH+gf8B/4HzgZ/v8DAAAgWB0IIFgdECAYICAgKCCgHzAgWB04IEAgOB9IIDgfYB/+/xAAOB/+/wgAUCBYIDgf/v8DAGAgOB9oIDgf/v8QAFgd/v8DADgfcCB4IDgZ/v8KAEAX/v8CAIAgUBf+/wIAiCCQIJggYBf+/wYAoCCoIFAX/v8CALAgSBn+/wMAuCA4GUgZiBzAIP7/BAD4F/7/AgDIINAg2CDgIDgZ/v8EAFgd6CBYHf7/BQD4H1gd/v8NAPAgOBn4IAAhCCEQIRghGBtIGf7/BAAgISghSBn+/wQAMCE4IUgZOB0YG0gZ/v8EAEAhSCFIGRAdWB3+/wIA+B9IGWAfUCFYIWAfYCFoIWAfcCFYIWAf/v8CAHghgCFgH/7/AgCIIWAf/v8HAJAhYB/+/wUAmCFgH6AhSBn+/wsAqCFYHf7/BABIGf7/DACwITgZ/v8DAEgZuCFIGf7/FgCQG1gd/v8DAJAfOBn+/wMAwCFIGcghOBlgF/7/AgDQIdghYBfgITgZ/v8GAPAX6CHwIfghYBf+/wMAACIIIjgZ/v8GABAiGCJIGSAiOBlIGf7/AwAoIjAiSBn+/wIAOCJAIvAcOBn+/wIAuB1IGUgiSBlQIlgiOBn+/woASBn+/wIAYCJoInAieCI4Gf7/CgBIGf7/CgCwITgZ/v8FAIAi/v8QAIgi/v8QAEgZ/v8CADgdSBn+/wMAkCJIGf7/BgAoHDgZ/v8CAJgioCKoIrAiuCK4GP7/BgDAIjgZyCK4GP7/FQDQIjgZuBj+/wQA2CK4GP7/AgDgIjgZ/v8CAOgi+BfwIvAd+CIAIwgjECMYI7gY/v8HACAjKCP4FgAXCBcQFzAjOCNAI0gZSCNIGUAhUCNYI2AjaCNwI0gZUBx4Izgd/v8CADgZ/v8CAEgZ/v8HAJAigCOII/7/AgCQI5gj/v8DAKAjqCP4IDgZ/v8DAGAf/v8CALAjOBn+/wgASBmQG0gZ/v8DAAgaOBn+/wIASBlAIbgjSBnAIzgZ/v8DAEgZyCNIGf7/AgDQI9gjOBn+/wIAQBf+/wIA4CNQF/7/AgBIGf7/BAA4HfAcOBn+/wUA6COIGP7/AgDwIzgZ/v8MAIgY+COIGAAkOBn+/wwACCQQJIgYGCQgJCgkOBn+/woASBn+/wYAQCE4Gf7/CQAAH/7/BgAwJDgkOBn+/wgAYB/+/w8AQCRgH/7/AgBIJGAf/v8DAFAkWCRgJGAfaCRgH/7/AgBwJDgZ/v8CAFgd/v8EAHgkOBn+/wsAWB3+/wUAkB+II4AkOBn+/wgAQBeIJFAXkCSYJKAkCB5AF6gksCS4JMAkyCRAF4gkUBfQJNgkUBfgJOgk8CT4JEAXACVQF0AXiCRQF5AkmCRQFwgeQBeoJPgkQBcAJVAXQBeIJFAXCCVAFxAlGCUgJSglUBcwJUAXOCVAJUglUCVQF1glQBdgJVAXaCVwJf7/AwBYHf7/AgD4IFgd/v8GAPgfOBn+/wYASBn+/w0AiBw4Gf7/AgBIGTgdOBn+/w4AeCU4GYAl/v8GADgZ/v8IAPgX/v8PADgZiCL+/w8AiCUBAf7/BAABAgMCBAMBAf7/BwADAwMCBQYGBwgHBgYJCgYLDA0MDA4O/v8FAAwGDw8PBgYQEBD+/wwAEAkGChESERMTE/7/DAATCQ8KDwEBAf7/AgABAwEB/v8NABQGCAj+/wIAFRURFRMW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";
            CharInfo.DecodeCharInfo = function DecodeCharInfo() {
                var str = CharInfo.Decode(CharInfo._base64CharInfo);
                var numArr = [];
                var i = 0;
                for(i = 0; i < str.length; i += 2) {
                    var num = (str.charCodeAt(i + 1) * 256) + str.charCodeAt(i);
                    numArr.push(num);
                }
                var tempResult = [];
                for(i = 0; i < numArr.length; i++) {
                    if(numArr[i] != 0xfffe) {
                        tempResult.push(numArr[i]);
                    } else {
                        var number = numArr[i + 1];
                        for(var j = 1; j < number; j++) {
                            tempResult.push(numArr[i - 1]);
                        }
                        i++;
                    }
                }
                for(i = 0; i < tempResult.length; i += 2) {
                    var val = (tempResult[i + 1] * 65536) + tempResult[i];
                    CharInfo._charInfo.push(val);
                }
            };
            CharInfo.GetByte = function GetByte(index) {
                if(CharInfo._charInfo.length === 0) {
                    CharInfo.DecodeCharInfo();
                }
                var i = Math.floor(index / 4);
                var j = index % 4;
                var value = CharInfo._charInfo[i];
                switch(j) {
                    case 0:
                        return value & 0xff;
                    case 1:
                        return (value >> 8) & 0xff;
                    case 2:
                        return (value >> 16) & 0xff;
                    case 3:
                        return (value >> 24) & 0xff;
                }
            };
            CharInfo.GetShortValue = function GetShortValue(index) {
                var i = CharInfo.GetByte(index);
                var j = CharInfo.GetByte(index + 1);
                return j * 256 + i;
            };
            CharInfo.GetIntValue = function GetIntValue(index) {
                var a = CharInfo.GetByte(index);
                var b = CharInfo.GetByte(index + 1);
                var c = CharInfo.GetByte(index + 2);
                var d = CharInfo.GetByte(index + 3);
                return d * 65535 * 256 + c * 65535 + b * 256 + a;
            };
            return CharInfo;
        })();
        input.CharInfo = CharInfo;        
        var CharUnicodeInfo = (function () {
            function CharUnicodeInfo() { }
            CharUnicodeInfo.InitTable = function InitTable() {
                CharUnicodeInfo.globalizationResourceBytePtr = 0;
                CharUnicodeInfo.headerPtr = CharUnicodeInfo.globalizationResourceBytePtr;
                CharUnicodeInfo.s_pCategoryLevel1Index = CharInfo.GetIntValue(CharUnicodeInfo.globalizationResourceBytePtr + 40);
                CharUnicodeInfo.s_pCategoriesValue = CharInfo.GetIntValue(CharUnicodeInfo.globalizationResourceBytePtr + 0x2c);
                CharUnicodeInfo.s_pNumericLevel1Index = CharInfo.GetIntValue(CharUnicodeInfo.globalizationResourceBytePtr + 0x30);
                CharUnicodeInfo.s_pNumericValues = CharInfo.GetIntValue(CharUnicodeInfo.globalizationResourceBytePtr + 0x38);
                CharUnicodeInfo.s_pDigitValues = CharInfo.GetIntValue(CharUnicodeInfo.globalizationResourceBytePtr + 0x34);
            };
            CharUnicodeInfo.InternalConvertToUtf32 = function InternalConvertToUtf32(s, index, charLength) {
                charLength.length = 1;
                if(index < (s.length - 1)) {
                    var num = s.charCodeAt(index) - 0xd800;
                    if((num >= 0) && (num <= 0x3ff)) {
                        var num2 = s.charCodeAt(index + 1) - 0xdc00;
                        if((num2 >= 0) && (num2 <= 0x3ff)) {
                            charLength.length++;
                            return (((num * 0x400) + num2) + 0x10000);
                        }
                    }
                }
                return s.charCodeAt(index);
            };
            CharUnicodeInfo.InternalGeteCategoryValue = function InternalGeteCategoryValue(ch, offset) {
                if(offset === undefined || offset === null) {
                    offset = 0;
                }
                var num = CharInfo.GetShortValue(CharUnicodeInfo.s_pCategoryLevel1Index + 2 * (ch >> 8));
                num = CharInfo.GetShortValue(CharUnicodeInfo.s_pCategoryLevel1Index + 2 * (num + ((ch >> 4) & 15)));
                var numPtr = CharUnicodeInfo.s_pCategoryLevel1Index + 2 * num;
                var num2 = CharInfo.GetByte(numPtr + (ch & 15));
                return CharInfo.GetByte(CharUnicodeInfo.s_pCategoriesValue + (num2 * 2) + offset);
            };
            CharUnicodeInfo.InternalGetUnicodeCategory = function InternalGetUnicodeCategory(str, index, charLength) {
                var utf32 = CharUnicodeInfo.InternalConvertToUtf32(str, index, charLength);
                return CharUnicodeInfo.InternalGeteCategoryValue(utf32, 0);
            };
            CharUnicodeInfo.IsCombiningCategory = function IsCombiningCategory(uc) {
                if((uc !== UnicodeCategory.NonSpacingMark) && (uc !== UnicodeCategory.SpacingCombiningMark)) {
                    return (uc === UnicodeCategory.EnclosingMark);
                }
                return true;
            };
            return CharUnicodeInfo;
        })();
        input.CharUnicodeInfo = CharUnicodeInfo;        
        CharUnicodeInfo.InitTable();
        (function (UnicodeCategory) {
            UnicodeCategory._map = [];
            UnicodeCategory.ClosePunctuation = 0x15;
            UnicodeCategory.ConnectorPunctuation = 0x12;
            UnicodeCategory.Control = 14;
            UnicodeCategory.CurrencySymbol = 0x1a;
            UnicodeCategory.DashPunctuation = 0x13;
            UnicodeCategory.DecimalDigitNumber = 8;
            UnicodeCategory.EnclosingMark = 7;
            UnicodeCategory.FinalQuotePunctuation = 0x17;
            UnicodeCategory.Format = 15;
            UnicodeCategory.InitialQuotePunctuation = 0x16;
            UnicodeCategory.LetterNumber = 9;
            UnicodeCategory.LineSeparator = 12;
            UnicodeCategory.LowercaseLetter = 1;
            UnicodeCategory.MathSymbol = 0x19;
            UnicodeCategory.ModifierLetter = 3;
            UnicodeCategory.ModifierSymbol = 0x1b;
            UnicodeCategory.NonSpacingMark = 5;
            UnicodeCategory.OpenPunctuation = 20;
            UnicodeCategory.OtherLetter = 4;
            UnicodeCategory.OtherNotAssigned = 0x1d;
            UnicodeCategory.OtherNumber = 10;
            UnicodeCategory.OtherPunctuation = 0x18;
            UnicodeCategory.OtherSymbol = 0x1c;
            UnicodeCategory.ParagraphSeparator = 13;
            UnicodeCategory.PrivateUse = 0x11;
            UnicodeCategory.SpaceSeparator = 11;
            UnicodeCategory.SpacingCombiningMark = 6;
            UnicodeCategory.Surrogate = 0x10;
            UnicodeCategory.TitlecaseLetter = 2;
            UnicodeCategory.UppercaseLetter = 0;
        })(input.UnicodeCategory || (input.UnicodeCategory = {}));
        var UnicodeCategory = input.UnicodeCategory;
        var StringInfo = (function () {
            function StringInfo() { }
            StringInfo.GetNextTextElement = function GetNextTextElement(str, index, ref) {
                var num2;
                if(str == null) {
                    throw "ArgumentNullException";
                }
                var length = str.length;
                if((index < 0) || (index >= length)) {
                    if(index != length) {
                        throw "ArgumentOutOfRangeException";
                    }
                    return "";
                }
                var charLengh = {
                };
                var ucCurrent = CharUnicodeInfo.InternalGetUnicodeCategory(str, index, charLengh);
                num2 = charLengh.length;
                var elementLen = StringInfo.GetCurrentTextElementLen(str, index, length, ucCurrent, num2, ref);
                ref.length = elementLen;
                return str.substr(index, elementLen);
            };
            StringInfo.GetCurrentTextElementLen = function GetCurrentTextElementLen(str, index, len, ucCurrent, currentCharCount, ref) {
                var num;
                if((index + currentCharCount) === len) {
                    return currentCharCount;
                }
                var charLength = {
                };
                var uc = CharUnicodeInfo.InternalGetUnicodeCategory(str, index + currentCharCount, charLength);
                num = charLength.length;
                if(((!CharUnicodeInfo.IsCombiningCategory(uc) || CharUnicodeInfo.IsCombiningCategory(ucCurrent)) || ((ucCurrent === UnicodeCategory.Format) || (ucCurrent === UnicodeCategory.Control))) || ((ucCurrent === UnicodeCategory.OtherNotAssigned) || (ucCurrent === UnicodeCategory.Surrogate))) {
                    var num3 = currentCharCount;
                    ref.ucCurrent = uc;
                    ref.currentCharCount = num;
                    return num3;
                }
                var num2 = index;
                index += currentCharCount + num;
                while(index < len) {
                    var charLength = {
                    };
                    uc = CharUnicodeInfo.InternalGetUnicodeCategory(str, index, charLength);
                    num = charLength.length;
                    if(!CharUnicodeInfo.IsCombiningCategory(uc)) {
                        ref.ucCurrent = uc;
                        ref.currentCharCount = num;
                        break;
                    }
                    index += num;
                }
                return (index - num2);
            };
            StringInfo.GetTextElement = function GetTextElement(str) {
                var result = [];
                var index = 0;
                while(index < str.length) {
                    var ref = {
                    };
                    var element = StringInfo.GetNextTextElement(str, index, ref);
                    result.push(element);
                    index += ref.length;
                }
                return result;
            };
            return StringInfo;
        })();
        input.StringInfo = StringInfo;        
        var StringCache = (function () {
            function StringCache() { }
            StringCache.TextElementCache = {
            };
            StringCache.TextElementCacheCount = 0;
            StringCache.AddElementCache = function AddElementCache(str, element) {
                if(StringCache.TextElementCacheCount > 500) {
                    StringCache.TextElementCache = {
                    };
                    StringCache.TextElementCacheCount = 0;
                }
                StringCache.TextElementCache[str] = element;
                StringCache.TextElementCacheCount++;
            };
            return StringCache;
        })();
        input.StringCache = StringCache;        
        String.prototype.GetStandardPosition = function (position, start) {
            this.CreateSurrogateArray();
            var newValue = position;
            if(StringCache.TextElementArray !== null && position > 0) {
                var maxIndex = Math.min(position, StringCache.TextElementArray.length);
                var totalElementSize = 0;
                for(var i = 0; i < maxIndex; i++) {
                    totalElementSize += StringCache.TextElementArray[i].length;
                }
                newValue = totalElementSize;
            }
            return newValue;
        };
        String.prototype.CreateSurrogateArray = function () {
            if(StringCache.TextElementArray === undefined || StringCache._InnerValue.toString() != this.toString()) {
                StringCache._InnerValue = this;
                //save position of surrogate pair
                var elementCol = StringCache.TextElementCache[this];
                if(elementCol === undefined) {
                    elementCol = StringInfo.GetTextElement(this);
                    // Improve performance.
                    StringCache.AddElementCache(this, elementCol);
                }
                if(elementCol.length === this.length) {
                    StringCache.TextElementArray = null;
                } else {
                    StringCache.TextElementArray = elementCol;
                    StringCache.MultiCharExit = false;
                    for(var i = 0; i < elementCol.length; i++) {
                        if(elementCol[i].length > 2) {
                            StringCache.MultiCharExit = true;
                            break;
                        }
                    }
                }
            }
        };
        String.prototype.GetLength = function () {
            this.CreateSurrogateArray();
            var newLength = this.length;
            if(StringCache.TextElementArray !== null) {
                newLength = StringCache.TextElementArray.length;
            }
            return newLength;
        };
        String.prototype.Substring = function (start, end) {
            this.CreateSurrogateArray();
            if(start >= end) {
                return "";
            }
            var newValue = this.substring(start, end);
            if(StringCache.TextElementArray !== null) {
                start = Math.max(0, start);
                end = Math.min(StringCache.TextElementArray.length, end);
                var result = [];
                for(var i = start; i < end; i++) {
                    result.push(StringCache.TextElementArray[i]);
                }
                newValue = result.join("");
            }
            return newValue;
        };
        String.prototype.IndexOf = function (findtext, startindex) {
            this.CreateSurrogateArray();
            var newValue = this.indexOf(findtext, startindex);
            if(StringCache.TextElementArray !== null && newValue > 0) {
                var totalLength = 0;
                for(var i = 0; i < StringCache.TextElementArray.length; i++) {
                    totalLength += StringCache.TextElementArray[i].length;
                    if(totalLength == newValue) {
                        newValue = i + 1;
                        break;
                    }
                }
            }
            if(StringCache.TextElementArray !== null && newValue >= 0) {
                if(this.Substring(newValue, newValue + findtext.GetLength()).length != findtext.length) {
                    newValue = -1;
                }
            }
            return newValue;
        };
        String.prototype.LastIndexOf = function (text) {
            this.CreateSurrogateArray();
            var newValue = this.lastIndexOf(text);
            if(StringCache.TextElementArray !== null && newValue > 0) {
                var totalLength = 0;
                for(var i = 0; i < StringCache.TextElementArray.length; i++) {
                    totalLength += StringCache.TextElementArray[i];
                    if(totalLength == newValue) {
                        newValue = i + 1;
                        break;
                    }
                }
            }
            if(StringCache.TextElementArray !== null && newValue >= 0) {
                if(this.Substring(newValue, newValue + text.GetLength()).length != text.length) {
                    newValue = -1;
                }
            }
            return newValue;
        };
        String.prototype.CharAt = function (position) {
            this.CreateSurrogateArray();
            var newValue = this.charAt(position);
            if(StringCache.TextElementArray !== null) {
                if(position >= 0 && position < StringCache.TextElementArray.length) {
                    newValue = StringCache.TextElementArray[position];
                } else {
                    newValue = "";
                }
            }
            return newValue;
        };
        String.prototype.startWith = function (str) {
            if(str == null || str == "" || this.length == 0 || str.length > this.length) {
                return false;
            }
            if(this.substr(0, str.length) == str) {
                return true;
            } else {
                return false;
            }
        };
        String.prototype.IsNulOrEmpty = function (str) {
            return str == null || str == "";
        };
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
;
