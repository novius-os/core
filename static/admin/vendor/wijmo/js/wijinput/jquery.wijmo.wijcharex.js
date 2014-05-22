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
        /** @ignore */
        var CharType = (function () {
            function CharType() {
                /// <summary>
                ///   Indicates that the character is not of a particular category.
                /// </summary>
                this.OtherChar = 0x0000;
                /// <summary>
                ///   Indicates that the character is a control code.
                /// </summary>
                this.Control = 0x0001;
                /// <summary>
                ///   Indicates that the character is a numeric digit.
                /// </summary>
                this.Numeric = 0x0002;
                /// <summary>
                ///   Indicates that the character is a mathematical symbol.
                /// </summary>
                this.MathSymbol = 0x0003;
                /// <summary>
                ///   Indicates that the character is a symbol.
                /// </summary>
                this.Symbol = 0x0004;
                /// <summary>
                ///   Indicates that the character is a punctuation. ( Open &amp; Close )
                /// </summary>
                this.Punctuation = 0x0005;
                /// <summary>
                ///   Indicates that the character is a space character.
                /// </summary>
                this.Space = 0x0006;
                /// <summary>
                ///   Indicates that the character is an upper case letter.
                /// </summary>
                this.UpperCase = 0x0007;
                /// <summary>
                ///   Indicates that the character is a lower case letter.
                /// </summary>
                this.LowerCase = 0x0008;
                /// <summary>
                ///   Indicates that the character is a Japanese Katakana character.
                /// </summary>
                this.Katakana = 0x0009;
                /// <summary>
                ///   Indicates that the character is a Japanese Hiragana character.
                /// </summary>
                this.Hiragana = 0x000a;
                /// <summary>
                ///   Indicates that the character is a CJK punctuation.
                /// </summary>
                this.FarEastPunctation = 0x000b;
                /// <summary>
                ///   Indicates that the character is a Hangal character.
                /// </summary>
                this.Hangul = 0x000c;
                /// <summary>
                ///   Indicates that the character is of full width.
                /// </summary>
                this.FullWidth = 0x8000;
            }
            return CharType;
        })();
        input.CharType = CharType;        
        /** @ignore */
        var CharCategory = (function () {
            function CharCategory() {
                // Min & Max values ----------------------------------
                ///   Represents the smallest possible value of a Char.
                ///   This field is constant.
                this.MinValue = '\u0000';
                ///   Represents the largest possible value of a Char.
                ///   This field is constant.
                this.MaxValue = '\uffff';
                //Full/HalfWidth characters (different cultures)------
                this.ANSISTART = 0x0000;
                this.ANSIEND = 0x00ff;
                this.BOTHWIDTHSTART = 0xff00;
                this.BOTHWIDTHEND = 0xffef;
                this.FULLALPHASTART = 0xff01;
                this.FULLUPPERSTART = 0xff21;
                this.FULLUPPEREND = 0xff3a;
                this.FULLALPHAEND = 0xff5e;
                this.CJKHALFSYMBOLSTART = 0xff61;
                this.CJKHALFSYMBOLEND = 0xff64;
                this.KANAHALFSTART = 0xff65;
                this.KANAHALFEND = 0xff9f;
                this.HANGULHALFSTART = 0xffa0;
                this.HANGULHALFEND = 0xffdc;
                this.FULLSYMBOLSTART = 0xffe0;
                this.FULLSYMBOLEND = 0xffe6;
                this.HALFPUNCTSTART = 0xffe8;
                this.HALFPUNCTEND = 0xffee;
                // Voiced characters (Japanese)------------------------
                this.KATAKANA_VOICED = '\uff9e';
                this.KATAKANA_SEMIVOICED = '\uff9f';
                //Others-----------------------------------------------
                this.Tab = '\u0009';
                this.Space = '\u0020';
                //>>> Static Data (tables) ----------------------------
                // Character Groups...
                ///   Character groups (character codes) based on Unicode 3.1.
                this._charstarts = [
                    '\u0000', 
                    // Basic Latin
                    '\u0080', 
                    // Latin 1 Supplement
                    '\u0100', 
                    // Latin Extended - A
                    '\u0180', 
                    // Latin Extended - B
                    '\u0250', 
                    // IPA extensions
                    '\u02b0', 
                    // Spacing Modifier Letters
                    '\u0300', 
                    // Combining Diacritical Marks
                    '\u0370', 
                    // Greek
                    '\u0400', 
                    // Cyrillic
                    '\u0530', 
                    // Armenian
                    '\u0590', 
                    // Hebrew
                    '\u0600', 
                    // Arabic
                    '\u0700', 
                    // Syriac
                    '\u0780', 
                    // Thaana
                    '\u0900', 
                    // Devanagari
                    '\u0980', 
                    // Bengali
                    '\u0a00', 
                    // Gurmukhi
                    '\u0a80', 
                    // Gujarati
                    '\u0b00', 
                    // Oriya
                    '\u0b80', 
                    // Tamil
                    '\u0c00', 
                    // Telugu
                    '\u0c80', 
                    // Kannada
                    '\u0d00', 
                    // Malayalam
                    '\u0d80', 
                    // Sinhala
                    '\u0e00', 
                    // Thai
                    '\u0e80', 
                    // Lao
                    '\u0f00', 
                    // Tibetan
                    '\u1000', 
                    // Myanmar
                    '\u10a0', 
                    // Georgian
                    '\u1100', 
                    // Hangal Jamo
                    '\u1200', 
                    // Ethiopic
                    '\u13a0', 
                    // Cherokee
                    '\u1400', 
                    // Unified Canadian Aboriginal Syllabic
                    '\u1680', 
                    // Ogham
                    '\u16a0', 
                    // Runic
                    '\u1780', 
                    // Khmer
                    '\u1800', 
                    // Mongolian
                    '\u1e00', 
                    // Latin Extended Additional
                    '\u1f00', 
                    // Greek Extended
                    '\u2000', 
                    // General Punctuation
                    '\u2070', 
                    // Superscripts and Subscripts
                    '\u20a0', 
                    // Currency Symbols
                    '\u20d0', 
                    // Combining Marks for Symbols
                    '\u2100', 
                    // Letter like Symbols
                    '\u2150', 
                    // Number Forms
                    '\u2190', 
                    // Arrows
                    '\u2200', 
                    // Mathematical operators
                    '\u2300', 
                    // Miscellaneous Technical
                    '\u2400', 
                    // Control Pictures
                    '\u2440', 
                    // Optical Character Recognition
                    '\u2460', 
                    // Enclosed AlphaNumerics
                    '\u2500', 
                    // Box drawing
                    '\u2580', 
                    // Block Elements
                    '\u25a0', 
                    // Geometric Shapes
                    '\u2600', 
                    // Miscellaneous Symbols
                    '\u2700', 
                    // Dingbats
                    '\u2800', 
                    // Braille Patterns
                    '\u2e80', 
                    // CJK Radicals Supplement
                    '\u2f00', 
                    // Kangxi Radicals
                    '\u2ff0', 
                    // Ideographic Description Characters
                    '\u3000', 
                    // CJK Symbols and Punctuations
                    '\u3040', 
                    // Hiragana
                    '\u30a0', 
                    // Katakana
                    '\u3100', 
                    // Bopomofo
                    '\u3130', 
                    // Hangal Compatibility Jamo
                    '\u3190', 
                    // Kanbun
                    '\u31a0', 
                    // Bopomofo Extended
                    '\u3200', 
                    // Enclosed CJK Letters and Months
                    '\u3300', 
                    // CJK Compatiblity
                    '\u3400', 
                    // CJK Unified Ideographs Extension
                    '\u4e00', 
                    // CJK Undified Ideographs
                    '\ua000', 
                    // Yi Syllables
                    '\ua490', 
                    // Yi Radicals
                    '\uac00', 
                    // Hangul Syllables
                    '\uf900', 
                    // CJK Compatible Ideographs
                    '\ufb00', 
                    // Alphabetic Presentation Forms
                    '\ufb50', 
                    // Arabic Presentation Forms A
                    '\ufe20', 
                    // Combining Half Marks
                    '\ufe30', 
                    // CJK Compatiblity Form
                    '\ufe50', 
                    // Small Form Variants
                    '\ufe70', 
                    // Arabi Presentation Forms B
                    '\uff00', 
                    // Halfwidth and Fullwidth Forms
                    '\ufff0'
                ];// Specials
                
                //Character Block Categories...
                ///   Character blocks categorized base on the Unicode standard.
                this.Blocks = [
                    'BASIC_LATIN', 
                    'LATIN_1_SUPPLEMENT', 
                    'LATIN_EXTENDED_A', 
                    'LATIN_EXTENDED_B', 
                    'IPA_EXTENSIONS', 
                    'SPACING_MODIFIER_LETTERS', 
                    'COMBINING_DIACRITICAL_MARKS', 
                    'GREEK', 
                    'CYRILLIC', 
                    'ARMENIAN', 
                    'HEBREW', 
                    'ARABIC', 
                    'SYRIAC', 
                    'THAANA', 
                    'DEVANAGARI', 
                    'BENGALI', 
                    'GURMUKHI', 
                    'GUJARATI', 
                    'ORIYA', 
                    'TAMIL', 
                    'TELUGU', 
                    'KANNADA', 
                    'MALAYALAM', 
                    'SINHALA', 
                    'THAI', 
                    'LAO', 
                    'TIBETAN', 
                    'MYANMAR', 
                    'GEORGIAN', 
                    'HANGUL_JAMO', 
                    'ETHIOPIC', 
                    'CHEROKEE', 
                    'UNIFIED_CANADIAN_ABORIGINAL_SYLLABIC', 
                    'OGHAM', 
                    'RUNIC', 
                    'KUMER', 
                    'MONGOLIAN', 
                    'LATIN_EXTENDED_ADDITIONAL', 
                    'GREEK_EXTENDED', 
                    'GENERAL_PUNCTUATION', 
                    'SUPERSCRIPTS_AND_SUBSCRIPTS', 
                    'CURRENCY_SYMBOLS', 
                    'COMBINING_MARKS_FOR_SYMBOLS', 
                    'LETTERLIKE_SYMBOLS', 
                    'NUMBER_FORMS', 
                    'ARROWS', 
                    'MATHEMATICAL_OPERATORS', 
                    'MISCELLANEOUS_TECHNICAL', 
                    'CONTROL_PICTURES', 
                    'OPTICAL_CHARACTER_RECOGNITION', 
                    'ENCLOSED_ALPHANUMERICS', 
                    'BOX_DRAWING', 
                    'BLOCK_ELEMENTS', 
                    'GEOMETRIC_SHAPES', 
                    'MISCELLANEOUS_SYMBOLS', 
                    'DINGBATS', 
                    'BRAILLE_PATTERNS', 
                    'CJK_RADICALS_SUPPLEMENT', 
                    'KANGXI_RADICALS', 
                    'IDEOGRAPHIC_DESCRIPTION_CHARACTERS', 
                    'CJK_SYMBOLS_AND_PUNCTUATION', 
                    'HIRAGANA', 
                    'KATAKANA', 
                    'BOPOMOFO', 
                    'HANGUL_COMPATIBILITY_JAMO', 
                    'KANBUN', 
                    'BOPOMOFO_EXTENDED', 
                    'ENCLOSED_CJK_LETTERS_AND_MONTHS', 
                    'CJK_COMPATIBILITY', 
                    'CJK_UNIFIED_IDEOGRAPHS_EXTENSION', 
                    'CJK_UNIFIED_IDEOGRAPHS', 
                    'YI_SYLLABLES', 
                    'YI_RADICALS', 
                    'HANGUL_SYLLABLES', 
                    'CJK_COMPATIBILITY_IDEOGRAPHS', 
                    'ALPHABETIC_PRESENTATION_FORMS', 
                    'ARABIC_PRESENTATION_FORMS_A', 
                    'COMBINING_HALF_MARKS', 
                    'CJK_COMPATIBILITY_FORMS', 
                    'SMALL_FORM_VARIANTS', 
                    'ARABIC_PRESENTATION_FORMS_B', 
                    'HALFWIDTH_AND_FULLWIDTH_FORMS', 
                    'SPECIALS'
                ];
                // Multi width character block mapping table...
                ///   Table of multi-width character blocks.
                this._fullhalfblocks = [
                    '\uff01', 
                    // Symbols
                    '\uff10', 
                    // Numbers
                    '\uff1a', 
                    // Symbols
                    '\uff21', 
                    // Uppercase
                    '\uff3b', 
                    // Symbols
                    '\uff41', 
                    // Lowercase
                    '\uff5b', 
                    // Symbols
                    '\uff61', 
                    // CJK Halfwidth Punctuation
                    '\uff65', 
                    // Halfwidth Katakana
                    '\uffa0', 
                    // Halfwidth Hangal
                    '\uffe0', 
                    // Fullwidth symbol variants
                    '\uffe8'
                ];// Halfwidth symbol variants
                
                // Half width Katakana map table...
                ///   Mapping table of full width Katakana.
                this._halfkana = [
                    '\u30fb', 
                    '\u30f2', 
                    // ., small o
                    '\u30a1', 
                    '\u30a3', 
                    '\u30a5', 
                    '\u30a7', 
                    '\u30a9', 
                    // small a
                    '\u30e3', 
                    '\u30e5', 
                    '\u30e7', 
                    // small ya
                    '\u30c3', 
                    '\u30fc', 
                    // small tu, -
                    '\u30a2', 
                    '\u30a4', 
                    '\u30a6', 
                    '\u30a8', 
                    '\u30aa', 
                    // a
                    '\u30ab', 
                    '\u30ad', 
                    '\u30af', 
                    '\u30b1', 
                    '\u30b3', 
                    // ka
                    '\u30b5', 
                    '\u30b7', 
                    '\u30b9', 
                    '\u30bb', 
                    '\u30bd', 
                    // sa
                    '\u30bf', 
                    '\u30c1', 
                    '\u30c4', 
                    '\u30c6', 
                    '\u30c8', 
                    // ta
                    '\u30ca', 
                    '\u30cb', 
                    '\u30cc', 
                    '\u30cd', 
                    '\u30ce', 
                    // na
                    '\u30cf', 
                    '\u30d2', 
                    '\u30d5', 
                    '\u30d8', 
                    '\u30db', 
                    // ha
                    '\u30de', 
                    '\u30df', 
                    '\u30e0', 
                    '\u30e1', 
                    '\u30e2', 
                    // ma
                    '\u30e4', 
                    '\u30e6', 
                    '\u30e8', 
                    // ya
                    '\u30e9', 
                    '\u30ea', 
                    '\u30eb', 
                    '\u30ec', 
                    '\u30ed', 
                    // ra
                    '\u30ef', 
                    '\u30f3', 
                    // wa
                    '\u3099', 
                    '\u309a'
                ];// daku-on
                
                // Full width Katakana map table...
                ///   Mapping table of half-width Katakana.
                this._fullkana = [
                    '\uff67', 
                    '\uff71', 
                    '\uff68', 
                    '\uff72', 
                    '\uff69', 
                    '\uff73', 
                    //a
                    '\uff6a', 
                    '\uff74', 
                    '\uff6b', 
                    '\uff75', 
                    '\uff76', 
                    '\uff76', 
                    '\uff77', 
                    '\uff77', 
                    '\uff78', 
                    '\uff78', 
                    // ka
                    '\uff79', 
                    '\uff79', 
                    '\uff7a', 
                    '\uff7a', 
                    '\uff7b', 
                    '\uff7b', 
                    '\uff7c', 
                    '\uff7c', 
                    '\uff7d', 
                    '\uff7d', 
                    // sa
                    '\uff7e', 
                    '\uff7e', 
                    '\uff7f', 
                    '\uff7f', 
                    '\uff80', 
                    '\uff80', 
                    '\uff81', 
                    '\uff81', 
                    '\uff6f', 
                    '\uff82', 
                    // ta
                    '\uff82', 
                    '\uff83', 
                    '\uff83', 
                    '\uff84', 
                    '\uff84', 
                    '\uff85', 
                    '\uff86', 
                    '\uff87', 
                    '\uff88', 
                    '\uff89', 
                    // na
                    '\uff8a', 
                    '\uff8a', 
                    '\uff8a', 
                    '\uff8b', 
                    '\uff8b', 
                    '\uff8b', 
                    // ha
                    '\uff8c', 
                    '\uff8c', 
                    '\uff8c', 
                    '\uff8d', 
                    '\uff8d', 
                    '\uff8d', 
                    '\uff8e', 
                    '\uff8e', 
                    '\uff8e', 
                    '\uff8f', 
                    '\uff90', 
                    '\uff91', 
                    '\uff92', 
                    '\uff93', 
                    // ma
                    '\uff6c', 
                    '\uff94', 
                    '\uff6d', 
                    '\uff95', 
                    '\uff6e', 
                    '\uff96', 
                    // ya
                    '\uff97', 
                    '\uff98', 
                    '\uff99', 
                    '\uff9a', 
                    '\uff9b', 
                    // ra
                    '\uff9c', 
                    '\uff9c', 
                    '\uff68', 
                    '\uff6a', 
                    '\uff66', 
                    '\uff9d', 
                    // wa,... un
                    //modified by sj for NKOI-8C7E84AA2
                    //'\uff73', '\uff68', '\uff6c', '\uff9c', '\uff68', '\uff6a',
                    '\uff73', 
                    '\uff76', 
                    '\uff79', 
                    '\uff9c', 
                    '\uff68', 
                    '\uff6a', 
                    //end by sj
                    '\uff66', 
                    '\uff65', 
                    '\uff70'
                ];
                this._fullkanaSmall = [
                    '\uff67', 
                    '\uff68', 
                    '\uff69', 
                    '\uff6a', 
                    '\uff6b', 
                    '\uff6c', 
                    '\uff6d', 
                    '\uff6e', 
                    '\uff6f'
                ];
                // Voiced (accent) map table (Japanese)...
                ///   Mapping table for accents for the Japanese language.
                this._accentkana = [
                    0, 
                    0, 
                    0, 
                    0, 
                    0, 
                    0, 
                    0, 
                    0, 
                    0, 
                    0, 
                    // a
                    -1, 
                    1, 
                    -1, 
                    1, 
                    -1, 
                    1, 
                    -1, 
                    1, 
                    -1, 
                    1, 
                    // ka
                    -1, 
                    1, 
                    -1, 
                    1, 
                    -1, 
                    1, 
                    -1, 
                    1, 
                    -1, 
                    1, 
                    // sa
                    -1, 
                    1, 
                    -1, 
                    1, 
                    0, 
                    -1, 
                    1, 
                    -1, 
                    1, 
                    -1, 
                    1, 
                    // ta
                    0, 
                    0, 
                    0, 
                    0, 
                    0, 
                    // na
                    -3, 
                    1, 
                    2, 
                    -3, 
                    1, 
                    2, 
                    -3, 
                    1, 
                    2, 
                    -3, 
                    1, 
                    2, 
                    -3, 
                    1, 
                    2, 
                    // ha
                    0, 
                    0, 
                    0, 
                    0, 
                    0, 
                    // ma
                    0, 
                    0, 
                    0, 
                    0, 
                    0, 
                    0, 
                    // ya
                    0, 
                    0, 
                    0, 
                    0, 
                    0, 
                    // ra
                    0, 
                    0, 
                    0, 
                    0, 
                    0, 
                    0, 
                    // wa,...un
                    1, 
                    0, 
                    0, 
                    1, 
                    1, 
                    1, 
                    1, 
                    0, 
                    0
                ];
                // Special quotations for FarEast...
                this._feQuotes = [
                    '\u2018', 
                    '\u2019', 
                    '\u201c', 
                    '\u201d'
                ];
                // Katakana & Hiragana mixed characters (Japanese)...
                this._jpnMixed = [
                    '\u30fc'
                ];
                // Full / Half width special character map table...
                this._jpnSpecialFull = [
                    '\u3000', 
                    // Space
                    '\u3001', 
                    // Comma
                    '\u3002', 
                    // Stop (Period)
                    '\u300c', 
                    // Left bracket
                    '\u300d', 
                    // Right bracket
                    '\u201c', 
                    // Double Quotes
                    '\u201d', 
                    //     "
                    '\u2018', 
                    // Single Quotes
                    '\u2019', 
                    //	   "
                    '\u309b', 
                    // JPN Voiced (heavy)
                    '\u309c', 
                    // JPN Voiced (light)
                    '\uffe5'
                ];// yen mark !
                
                this._jpnSpecialHalf = [
                    '\u0020', 
                    // Space
                    '\uff64', 
                    // Comma
                    '\uff61', 
                    // Stop (Period)
                    '\uff62', 
                    // Left bracket
                    '\uff63', 
                    // Right bracket
                    '\u0022', 
                    // Double Quotes
                    '\u0022', 
                    //     "
                    '\u0027', 
                    // Single Quotes
                    '\u0027', 
                    //	   "
                    '\uff9e', 
                    // JPN Voiced (heavy)
                    '\uff9f', 
                    // JPN Voiced (light)
                    '\u00a5'
                ];// yen mark !
                
                var _charType = new CharType();
                this._mwtable = [
                    _charType.Symbol | _charType.FullWidth, 
                    _charType.Numeric | _charType.FullWidth, 
                    _charType.Symbol | _charType.FullWidth, 
                    _charType.UpperCase | _charType.FullWidth, 
                    _charType.Symbol | _charType.FullWidth, 
                    _charType.LowerCase | _charType.FullWidth, 
                    _charType.Symbol | _charType.FullWidth, 
                    _charType.FarEastPunctation, 
                    _charType.Katakana, 
                    _charType.Hangul, 
                    _charType.Symbol | _charType.FullWidth, 
                    _charType.Symbol
                ];
            }
            return CharCategory;
        })();
        input.CharCategory = CharCategory;        
        /** @ignore */
        var CharProcess = (function () {
            function CharProcess() {
                this.CharCategory = new CharCategory();
                this.Ctype = new CharType();
            }
            CharProcess.LowerKana = "\u3041\u3043\u3045\u3047\u3049\u3063\u3083\u3085\u3087\u308e\u30a1\u30a3\u30a5\u30a7\u30a9\u30c3\u30e3\u30e5\u30e7\u30ee\uff67\uff68\uff69\uff6a\uff6b\uff6c\uff6d\uff6e\uff6f\u30F5\u30F6\u3095\u3096";
            CharProcess.UpperKana = "\u3042\u3044\u3046\u3048\u304a\u3064\u3084\u3086\u3088\u308f\u30a2\u30a4\u30a6\u30a8\u30aa\u30c4\u30e4\u30e6\u30e8\u30ef\uff71\uff72\uff73\uff74\uff75\uff94\uff95\uff96\uff82\u30AB\u30B1\u304B\u3051";
            CharProcess.FullWidthSymbolArray = [
                //'\u3000',	//IDEOGRAPHIC SPACE
                '\u3001', 
                //IDEOGRAPHIC COMMA
                '\u3002', 
                //IDEOGRAPHIC FULL STOP
                '\uFF0C', 
                //FULLWIDTH COMMA
                '\uFF0E', 
                //FULLWIDTH FULL STOP
                '\u30FB', 
                //KATAKANA MIDDLE DOT
                '\uFF1A', 
                //FULLWIDTH COLON
                '\uFF1B', 
                //FULLWIDTH SEMICOLON
                '\uFF1F', 
                //FULLWIDTH QUESTION MARK
                '\uFF01', 
                //FULLWIDTH EXCLAMATION MARK
                '\u309B', 
                //KATAKANA-HIRAGANA VOICED SOUND MARK
                '\u309C', 
                //KATAKANA-HIRAGANA SEMI-VOICED SOUND MARK
                '\u00B4', 
                //ACUTE ACCENT
                '\uFF40', 
                //FULLWIDTH GRAVE ACCENT
                '\u00A8', 
                //DIAERESIS
                '\uFF3E', 
                //FULLWIDTH CIRCUMFLEX ACCENT
                '\uFFE3', 
                //FULLWIDTH MACRON
                '\uFF3F', 
                //FULLWIDTH LOW LINE
                '\u30FD', 
                //KATAKANA ITERATION MARK
                '\u30FE', 
                //KATAKANA VOICED ITERATION MARK
                '\u309D', 
                //HIRAGANA ITERATION MARK
                '\u309E', 
                //HIRAGANA VOICED ITERATION MARK
                '\u3003', 
                //DITTO MARK
                '\u4EDD', 
                //<cjk>
                '\u3005', 
                //IDEOGRAPHIC ITERATION MARK
                '\u3006', 
                //IDEOGRAPHIC CLOSING MARK
                '\u3007', 
                //IDEOGRAPHIC NUMBER ZERO
                '\u30FC', 
                //KATAKANA-HIRAGANA PROLONGED SOUND MARK
                '\u2014', 
                //EM DASH	Windows: U+2015
                '\u2010', 
                //HYPHEN
                '\uFF0F', 
                //FULLWIDTH SOLIDUS
                //'\u005C',	//REVERSE SOLIDUS	Fullwidth: U+FF3C
                '\u301C', 
                //WAVE DASH	Windows: U+FF5E
                '\u2016', 
                //DOUBLE VERTICAL LINE	Windows: U+2225
                '\uFF5C', 
                //FULLWIDTH VERTICAL LINE
                '\u2026', 
                //HORIZONTAL ELLIPSIS
                '\u2025', 
                //TWO DOT LEADER
                '\u2018', 
                //LEFT SINGLE QUOTATION MARK
                '\u2019', 
                //RIGHT SINGLE QUOTATION MARK
                '\u201C', 
                //LEFT DOUBLE QUOTATION MARK
                '\u201D', 
                //RIGHT DOUBLE QUOTATION MARK
                '\uFF08', 
                //FULLWIDTH LEFT PARENTHESIS
                '\uFF09', 
                //FULLWIDTH RIGHT PARENTHESIS
                '\u3014', 
                //LEFT TORTOISE SHELL BRACKET
                '\u3015', 
                //RIGHT TORTOISE SHELL BRACKET
                '\uFF3B', 
                //FULLWIDTH LEFT SQUARE BRACKET
                '\uFF3D', 
                //FULLWIDTH RIGHT SQUARE BRACKET
                '\uFF5B', 
                //FULLWIDTH LEFT CURLY BRACKET
                '\uFF5D', 
                //FULLWIDTH RIGHT CURLY BRACKET
                '\u3008', 
                //LEFT ANGLE BRACKET
                '\u3009', 
                //RIGHT ANGLE BRACKET
                '\u300A', 
                //LEFT DOUBLE ANGLE BRACKET
                '\u300B', 
                //RIGHT DOUBLE ANGLE BRACKET
                '\u300C', 
                //LEFT CORNER BRACKET
                '\u300D', 
                //RIGHT CORNER BRACKET
                '\u300E', 
                //LEFT WHITE CORNER BRACKET
                '\u300F', 
                //RIGHT WHITE CORNER BRACKET
                '\u3010', 
                //LEFT BLACK LENTICULAR BRACKET
                '\u3011', 
                //RIGHT BLACK LENTICULAR BRACKET
                '\uFF0B', 
                //FULLWIDTH PLUS SIGN
                '\u2212', 
                //MINUS SIGN	Windows: U+FF0D
                '\u00B1', 
                //PLUS-MINUS SIGN
                '\u00D7', 
                //MULTIPLICATION SIGN
                '\u00F7', 
                //DIVISION SIGN
                '\uFF1D', 
                //FULLWIDTH EQUALS SIGN
                '\u2260', 
                //NOT EQUAL TO
                '\uFF1C', 
                //FULLWIDTH LESS-THAN SIGN
                '\uFF1E', 
                //FULLWIDTH GREATER-THAN SIGN
                '\u2266', 
                //LESS-THAN OVER EQUAL TO
                '\u2267', 
                //GREATER-THAN OVER EQUAL TO
                '\u221E', 
                //INFINITY
                '\u2234', 
                //THEREFORE
                '\u2642', 
                //MALE SIGN
                '\u2640', 
                //FEMALE SIGN
                '\u00B0', 
                //DEGREE SIGN
                '\u2032', 
                //PRIME
                '\u2033', 
                //DOUBLE PRIME
                '\u2103', 
                //DEGREE CELSIUS
                '\uFFE5', 
                //FULLWIDTH YEN SIGN
                '\uFF04', 
                //FULLWIDTH DOLLAR SIGN
                '\u00A2', 
                //CENT SIGN	Windows: U+FFE0
                '\u00A3', 
                //POUND SIGN	Windows: U+FFE1
                '\uFF05', 
                //FULLWIDTH PERCENT SIGN
                '\uFF03', 
                //FULLWIDTH NUMBER SIGN
                '\uFF06', 
                //FULLWIDTH AMPERSAND
                '\uFF0A', 
                //FULLWIDTH ASTERISK
                '\uFF20', 
                //FULLWIDTH COMMERCIAL AT
                '\u00A7', 
                //SECTION SIGN
                '\u2606', 
                //WHITE STAR
                '\u2605', 
                //BLACK STAR
                '\u25CB', 
                //WHITE CIRCLE
                '\u25CF', 
                //BLACK CIRCLE
                '\u25CE', 
                //BULLSEYE
                '\u25C7', 
                //WHITE DIAMOND
                '\u25C6', 
                //BLACK DIAMOND
                '\u25A1', 
                //WHITE SQUARE
                '\u25A0', 
                //BLACK SQUARE
                '\u25B3', 
                //WHITE UP-POINTING TRIANGLE
                '\u25B2', 
                //BLACK UP-POINTING TRIANGLE
                '\u25BD', 
                //WHITE DOWN-POINTING TRIANGLE
                '\u25BC', 
                //BLACK DOWN-POINTING TRIANGLE
                '\u203B', 
                //REFERENCE MARK
                '\u3012', 
                //POSTAL MARK
                '\u2192', 
                //RIGHTWARDS ARROW
                '\u2190', 
                //LEFTWARDS ARROW
                '\u2191', 
                //UPWARDS ARROW
                '\u2193', 
                //DOWNWARDS ARROW
                '\u3013', 
                //GETA MARK
                '\uFF07', 
                //FULLWIDTH APOSTROPHE
                '\uFF02', 
                //FULLWIDTH QUOTATION MARK	[2000]
                '\uFF0D', 
                //FULLWIDTH HYPHEN-MINUS	[2000]
                //'\u007E',	//TILDE	[2000]	Fullwidth: U+FF5E
                '\u3033', 
                //VERTICAL KANA REPEAT MARK UPPER HALF	[2000]
                '\u3034', 
                //VERTICAL KANA REPEAT WITH VOICED SOUND MARK UPPER HALF	[2000]
                '\u3035', 
                //VERTICAL KANA REPEAT MARK LOWER HALF	[2000]
                '\u303B', 
                //VERTICAL IDEOGRAPHIC ITERATION MARK	[2000]	[Unicode3.2]
                '\u303C', 
                //MASU MARK	[2000]	[Unicode3.2]
                '\u30FF', 
                //KATAKANA DIGRAPH KOTO	[2000]	[Unicode3.2]
                '\u309F', 
                //HIRAGANA DIGRAPH YORI	[2000]	[Unicode3.2]
                '\u2208', 
                //ELEMENT OF	[1983]
                '\u220B', 
                //CONTAINS AS MEMBER	[1983]
                '\u2286', 
                //SUBSET OF OR EQUAL TO	[1983]
                '\u2287', 
                //SUPERSET OF OR EQUAL TO	[1983]
                '\u2282', 
                //SUBSET OF	[1983]
                '\u2283', 
                //SUPERSET OF	[1983]
                '\u222A', 
                //UNION	[1983]
                '\u2229', 
                //INTERSECTION	[1983]
                '\u2284', 
                //NOT A SUBSET OF	[2000]
                '\u2285', 
                //NOT A SUPERSET OF	[2000]
                '\u228A', 
                //SUBSET OF WITH NOT EQUAL TO	[2000]
                '\u228B', 
                //SUPERSET OF WITH NOT EQUAL TO	[2000]
                '\u2209', 
                //NOT AN ELEMENT OF	[2000]
                '\u2205', 
                //EMPTY SET	[2000]
                '\u2305', 
                //PROJECTIVE	[2000]
                '\u2306', 
                //PERSPECTIVE	[2000]
                '\u2227', 
                //LOGICAL AND	[1983]
                '\u2228', 
                //LOGICAL OR	[1983]
                '\u00AC', 
                //NOT SIGN	[1983]	Windows: U+FFE2
                '\u21D2', 
                //RIGHTWARDS DOUBLE ARROW	[1983]
                '\u21D4', 
                //LEFT RIGHT DOUBLE ARROW	[1983]
                '\u2200', 
                //FOR ALL	[1983]
                '\u2203', 
                //THERE EXISTS	[1983]
                '\u2295', 
                //CIRCLED PLUS	[2000]
                '\u2296', 
                //CIRCLED MINUS	[2000]
                '\u2297', 
                //CIRCLED TIMES	[2000]
                '\u2225', 
                //PARALLEL TO	[2000]
                '\u2226', 
                //NOT PARALLEL TO	[2000]
                '\u2985', 
                //LEFT WHITE PARENTHESIS	[2000]	[Unicode3.2]
                '\u2986', 
                //RIGHT WHITE PARENTHESIS	[2000]	[Unicode3.2]
                '\u3018', 
                //LEFT WHITE TORTOISE SHELL BRACKET	[2000]
                '\u3019', 
                //RIGHT WHITE TORTOISE SHELL BRACKET	[2000]
                '\u3016', 
                //LEFT WHITE LENTICULAR BRACKET	[2000]
                '\u3017', 
                //RIGHT WHITE LENTICULAR BRACKET	[2000]
                '\u2220', 
                //ANGLE	[1983]
                '\u22A5', 
                //UP TACK	[1983]
                '\u2312', 
                //ARC	[1983]
                '\u2202', 
                //PARTIAL DIFFERENTIAL	[1983]
                '\u2207', 
                //NABLA	[1983]
                '\u2261', 
                //IDENTICAL TO	[1983]
                '\u2252', 
                //APPROXIMATELY EQUAL TO OR THE IMAGE OF	[1983]
                '\u226A', 
                //MUCH LESS-THAN	[1983]
                '\u226B', 
                //MUCH GREATER-THAN	[1983]
                '\u221A', 
                //SQUARE ROOT	[1983]
                '\u223D', 
                //REVERSED TILDE 	[1983]
                '\u221D', 
                //PROPORTIONAL TO	[1983]
                '\u2235', 
                //BECAUSE	[1983]
                '\u222B', 
                //INTEGRAL	[1983]
                '\u222C', 
                //DOUBLE INTEGRAL	[1983]
                '\u2262', 
                //NOT IDENTICAL TO	[2000]
                '\u2243', 
                //ASYMPTOTICALLY EQUAL TO	[2000]
                '\u2245', 
                //APPROXIMATELY EQUAL TO	[2000]
                '\u2248', 
                //ALMOST EQUAL TO	[2000]
                '\u2276', 
                //LESS-THAN OR GREATER-THAN	[2000]
                '\u2277', 
                //GREATER-THAN OR LESS-THAN	[2000]
                '\u2194', 
                //LEFT RIGHT ARROW	[2000]
                '\u212B', 
                //ANGSTROM SIGN	[1983]
                '\u2030', 
                //PER MILLE SIGN	[1983]
                '\u266F', 
                //MUSIC SHARP SIGN	[1983]
                '\u266D', 
                //MUSIC FLAT SIGN	[1983]
                '\u266A', 
                //EIGHTH NOTE	[1983]
                '\u2020', 
                //DAGGER	[1983]
                '\u2021', 
                //DOUBLE DAGGER	[1983]
                '\u00B6', 
                //PILCROW SIGN	[1983]
                '\u266E', 
                //MUSIC NATURAL SIGN	[2000]
                '\u266B', 
                //BEAMED EIGHTH NOTES	[2000]
                '\u266C', 
                //BEAMED SIXTEENTH NOTES	[2000]
                '\u2669', 
                //QUARTER NOTE	[2000]
                '\u25EF', 
                //LARGE CIRCLE	[1983]
                // Added by shen yuan at 2005-10-26
                '\uFF3C', 
                // '£Ü'
                '\uFF5E', 
                // '¡«'
                '\uFFE0', 
                // '¡E
                '\uFFE1', 
                // '¡E
                '\uFFE2', 
                // '©V'
                '\u2015'
            ];
            CharProcess.HalfWidthSymbolArray = [
                '\u005C', 
                //REVERSE SOLIDUS	Fullwidth: U+FF3C
                '\u007E', 
                //TILDE	[2000]	Fullwidth: U+FF5E
                //'\u00AC',	//NOT SIGN	[1983]	Windows: U+FFE2
                //'\u00B6'	//PILCROW SIGN	[1983]
                // Added by shen yuan at 2005-10-26
                '\u0021', 
                // '! '
                '\u0022', 
                // '" '
                '\u0023', 
                // '# '
                '\u0024', 
                // '$ '
                '\u0025', 
                // '% '
                '\u0026', 
                // '& '
                '\u0027', 
                // '' '
                '\u0028', 
                // '( '
                '\u0029', 
                // ') '
                '\u002A', 
                // '* '
                '\u002B', 
                // '+ '
                '\u002C', 
                // ', '
                '\u002D', 
                // '- '
                '\u002E', 
                // '. '
                '\u002F', 
                // '/ '
                '\u003A', 
                // ': '
                '\u003B', 
                // '; '
                '\u003C', 
                // '<'
                '\u003D', 
                // '= '
                '\u003E', 
                // '>'
                '\u003F', 
                // '? '
                '\u0040', 
                // '@ '
                '\u005B', 
                // '[ '
                '\u005D', 
                // '] '
                '\u005E', 
                // '^ '
                '\u005F', 
                // '_ '
                '\u0060', 
                // '` '
                '\u007B', 
                // '{ '
                '\u007C', 
                // '| '
                '\u007D', 
                // '} '
                '\uFF61', 
                // '? '
                '\uFF62', 
                // Halfwidth Left Corner Bracket
                '\uFF63', 
                // Halfwidth Right Corner Bracket
                '\uFF64', 
                // '¡E
                '\uFF65', 
                // '£¤ '
                '\u00A1', 
                '\u00A4', 
                '\u00A5'
            ];
            CharProcess.CharEx = new CharProcess();
            CharProcess.prototype.ToHalfKatakana = function (c) {
                var result = "";
                if(this.IsFullWidth(c)) {
                    if(this.IsKatakana(c)) {
                        var katakana = c;
                        var n = katakana.charCodeAt(0) - (this.CharCategory._charstarts[62].charCodeAt(0) + 1);
                        if(n < 0 || n > 91) {
                            return katakana;
                        }
                        katakana = this.CharCategory._fullkana[n];
                        var accent = this.CharCategory._accentkana[n];
                        if(accent > 0) {
                            //accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0) ;
                            katakana = katakana + String.fromCharCode(accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0));
                        }
                        result = katakana;
                    } else if(this.IsHiragana(c)) {
                        var katakana = String.fromCharCode(c.charCodeAt(0) - this.CharCategory._charstarts[61].charCodeAt(0) + this.CharCategory._charstarts[62].charCodeAt(0));
                        var n = katakana.charCodeAt(0) - (this.CharCategory._charstarts[62].charCodeAt(0) + 1);
                        if(n < 0 || n > 91) {
                            return katakana;
                        }
                        katakana = this.CharCategory._fullkana[n];
                        var accent = this.CharCategory._accentkana[n];
                        if(accent > 0) {
                            //accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0) ;
                            katakana = katakana + String.fromCharCode(accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0));
                        }
                        result = katakana;
                    }
                } else {
                    if(this.IsKatakana(c)) {
                        result = c;
                    }
                }
                return result;
            };
            CharProcess.prototype.GetCharType = function (c) {
                var ctype = this.Ctype.OtherChar;
                var block = this.BelongTo(c);
                if(c == '\u007f' || ('\u0000' <= c && c <= '\u001f') || ('\u0080' <= c && c <= '\u009f')) {
                    return this.Ctype.Control;
                }
                if('A' <= c && c <= 'Z') {
                    return this.Ctype.UpperCase;
                }
                if('a' <= c && c <= 'z') {
                    return this.Ctype.LowerCase;
                }
                if('0' <= c && c <= '9') {
                    return this.Ctype.Numeric;
                }
                //modified by sj
                //the logic that charex call textfilter is wrong
                //	var tFilter = new TextFilter(true,true,"");
                //	if (tFilter.IsSymbol(c))
                //	{
                //		ctype = this.Ctype.Symbol;
                //	}
                if(this.IsFullWidthSymbol(c) || this.IsHalfWidthSymbol(c)) {
                    ctype = this.Ctype.Symbol;
                }
                //end by sj
                if(c.charCodeAt(0) == 8216 || c.charCodeAt(0) == 8217 || c.charCodeAt(0) == 8220 || c.charCodeAt(0) == 8221) {
                    ctype = this.Ctype.Punctuation;
                }
                if(c.charCodeAt(0) == 12288) {
                    ctype = this.Ctype.Space;
                }
                switch(this.CharCategory.Blocks[block]) {
                    case 'HALFWIDTH_AND_FULLWIDTH_FORMS':
                        return this.MultiWidthDetails(c);
                    case 'KATAKANA':
                        return this.Ctype.Katakana | this.Ctype.FullWidth;
                    case 'HIRAGANA':
                        return this.Ctype.Hiragana | this.Ctype.FullWidth;
                }
                if(this.IsFarEastBlock(block, c)) {
                    ctype |= this.Ctype.FullWidth;
                }
                return ctype;
            };
            CharProcess.prototype.IsCharOfType = function (c, type) {
                return this.GetCharType(c) == type;
            };
            CharProcess.prototype.IsMultiWidth = function (c) {
                var block = this.BelongTo(c);
                var category = this.CharCategory.Blocks[block];
                return (category == 'KATAKANA' || category == 'CJK_SYMBOLS_AND_PUNCTUATION' || category == 'HALFWIDTH_AND_FULLWIDTH_FORMS' || (category == 'BASIC_LATIN' && c >= '\u0020'));
            };
            CharProcess.prototype.IsFullWidthSymbol = function (c) {
                for(var i = 0; i < CharProcess.FullWidthSymbolArray.length; i++) {
                    if(c === CharProcess.FullWidthSymbolArray[i]) {
                        return true;
                    }
                }
                return false;
            };
            CharProcess.prototype.IsHalfWidthSymbol = function (c) {
                for(var i = 0; i < CharProcess.HalfWidthSymbolArray.length; i++) {
                    if(c === CharProcess.HalfWidthSymbolArray[i]) {
                        return true;
                    }
                }
                return false;
            };
            CharProcess.prototype.IsFullWidth = function (c) {
                if(this.IsFullWidthSymbol(c)) {
                    return true;
                }
                if(this.IsHalfWidthSymbol(c)) {
                    return false;
                }
                var block = this.BelongTo(c);
                var bFullWidth = this.IsFarEastBlock(block, c);
                if(this.CharCategory.Blocks[block] == 'HALFWIDTH_AND_FULLWIDTH_FORMS') {
                    bFullWidth = ((this.MultiWidthDetails(c) & this.Ctype.FullWidth) == this.Ctype.FullWidth);
                }
                return bFullWidth;
            };
            CharProcess.prototype.IsSurrogatePair = function (c) {
                if(c.charCodeAt(0) >= '\uD800'.charCodeAt(0) && c.charCodeAt(0) <= '\uDBFF'.charCodeAt(0) && c.charCodeAt(1) >= '\uDC00'.charCodeAt(0) && c.charCodeAt(1) <= '\uDFFF'.charCodeAt(0)) {
                    return true;
                }
                return false;
            };
            CharProcess.prototype.IsSurrogate = function (c) {
                return c != null && ((c.charCodeAt(0) >= '\uD800'.charCodeAt(0)) && c.charCodeAt(0) <= '\uDFFF'.charCodeAt(0));
            };
            CharProcess.prototype.IsOther = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.OtherChar);
            };
            CharProcess.prototype.IsControl = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Control);
            };
            CharProcess.prototype.IsKatakana = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Katakana);
            };
            CharProcess.prototype.IsSmallHalfKatakana = function (c) {
                var _halfkanaSmall = new Array('\u30a1', '\u30a3', '\u30a5', '\u30a7', '\u30a9', // small a
                '\u30e3', '\u30e5', '\u30e7', // small ya
                '\u30c3', '\u30ee');
                // small tu, ƒŽ
                var c1 = c;
                if(c.charCodeAt(0) > this.CharCategory.KANAHALFSTART) {
                    c1 = this.CharCategory._halfkana[c.charCodeAt(0) - this.CharCategory.KANAHALFSTART];
                }
                for(var i = 0; i < _halfkanaSmall.length; i++) {
                    if(c1 == _halfkanaSmall[i]) {
                        return true;
                    }
                }
                return false;
            };
            CharProcess.prototype.IsHiragana = function (c) {
                return (((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Hiragana) || //- Masa (2002/12/24) Japan wanted this special support --------------------------------------------
                (this.CharCategory._jpnMixed[0] == c));
                //--------------------------------------------------------------------------------------------------
                            };
            CharProcess.prototype.IsShiftJIS = function (c) {
                //var unicode = c.charCodeAt(0);
                //var offset = Math.floor(unicode / 8);
                //var mod = unicode % 8;
                //var flagString = CharProcess.ShiftJISCode.substr(offset * 2, 2);
                //var binaryString = parseInt(flagString, 16).toString(2);
                //while (binaryString.length < 8)
                //{
                //    binaryString = "0" + binaryString;
                //}
                //if (binaryString.substr(mod, 1) == "1")
                //{
                //    return true;
                //}
                return false;
            };
            CharProcess.prototype.IsJISX0208 = function (c) {
                //var unicode = c.charCodeAt(0);
                //var offset = Math.floor(unicode / 8);
                //var mod = unicode % 8;
                //var flagString = CharProcess.JISX0208Code.substr(offset * 2, 2);
                //var binaryString = parseInt(flagString, 16).toString(2);
                //while (binaryString.length < 8)
                //{
                //    binaryString = "0" + binaryString;
                //}
                //if (binaryString.substr(mod, 1) == "1")
                //{
                //    return true;
                //}
                return false;
            };
            CharProcess.prototype.IsDigit = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Numeric);
            };
            CharProcess.prototype.IsPunctuation = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Punctuation);
            };
            CharProcess.prototype.IsMathSymbol = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.MathSymbol);
            };
            CharProcess.prototype.IsSymbol = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Symbol);
            };
            CharProcess.prototype.IsLower = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.LowerCase);
            };
            CharProcess.prototype.IsUpper = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.UpperCase);
            };
            CharProcess.prototype.IsDigitOrSymbol = function (c) {
                return (this.IsDigit(c) || this.IsMathSymbol(c));
            };
            CharProcess.prototype.IsAlphabet = function (c) {
                return (this.IsUpper(c) || this.IsLower(c));
            };
            CharProcess.prototype.IsAlphaOrDigit = function (c) {
                return (this.IsUpper(c) || this.IsLower(c) || this.IsDigit(c));
            };
            CharProcess.prototype.IsUpperKana = function (c) {
                return !this.IsLowerKana(c);
            };
            CharProcess.prototype.IsLowerKana = function (c) {
                return (CharProcess.LowerKana.search(c) != -1);
            };
            CharProcess.prototype.HasLowerKana = function (c) {
                return (CharProcess.UpperKana.search(c) != -1 || this.IsLowerKana(c));
            };
            CharProcess.prototype.ToUpperKana = function (c) {
                var index = CharProcess.LowerKana.search(c);
                return (index == -1) ? c : CharProcess.UpperKana.substr(index, 1);
            };
            CharProcess.prototype.ToLowerKana = function (c) {
                var index = CharProcess.UpperKana.search(c);
                if(index >= CharProcess.UpperKana.length - 4 && index < CharProcess.UpperKana.length) {
                    return c;
                }
                return (index == -1) ? c : CharProcess.LowerKana.substr(index, 1);
            };
            CharProcess.prototype.ToLower = function (c) {
                if(this.IsUpper(c)) {
                    return String.fromCharCode(c.charCodeAt(0) + 32);
                }
                return c;
            };
            CharProcess.prototype.ToUpper = function (c) {
                if(this.IsLower(c)) {
                    return String.fromCharCode(c.charCodeAt(0) - 32);
                }
                return c;
            };
            CharProcess.prototype.IsSpace = function (c) {
                return c == '\u0020' || c === '\u3000';
            };
            CharProcess.prototype.ToFullWidth = function (c) {
                var retObj = {
                    text: "",
                    processedAll: false
                };
                retObj.text = c;
                retObj.processedAll = false;
                if(c.length == 0) {
                    return retObj;
                }
                var c1 = c.substring(0, 1);
                if(this.IsMultiWidth(c1)) {
                    //
                    // Latin basic characters can be directly converted
                    // by making a few shifts...
                    //
                    if(c1 < this.CharCategory._charstarts[1])//LATIN_1_SUPPLEMENT
                     {
                        //
                        // Funny why 'space' was left out of this category.
                        //
                        if(c1 == '\u0020') {
                            retObj.text = '\u3000';
                            return retObj;
                        }
                        var temp = '\u0021';//!
                        
                        retObj.text = String.fromCharCode(c1.charCodeAt(0) - temp.charCodeAt(0) + (this.CharCategory._charstarts[81].charCodeAt(0) + 1))//Blocks.HALFWIDTH_AND_FULLWIDTH_FORMS
                        ;
                        return retObj;
                    }
                    //
                    //- pickup a direct map from the table...
                    //
                    if((this.MultiWidthDetails(c1) & this.Ctype.Katakana) == this.Ctype.Katakana) {
                        if(c1.charCodeAt(0) < this.CharCategory.KANAHALFSTART) {
                            var c2 = this.GetFullHalfWidthSpecialChar(c1, true);
                            retObj.text = (c2 !== "") ? c2 : c1;
                            return retObj;
                        }
                        c1 = this.CharCategory._halfkana[c1.charCodeAt(0) - this.CharCategory.KANAHALFSTART];
                        //
                        // Handle the soundex here....
                        //
                        if(c.length < 2) {
                            retObj.text = c1;
                            return retObj;
                        }
                        var daku = c.charCodeAt(1) - (this.CharCategory.KATAKANA_VOICED.charCodeAt(0) - 1);// should be KATAKANA_VOICED or KATAKANA_SEMIVOICED.
                        
                        if(daku == 1 || daku == 2) {
                            retObj.processedAll = true;
                            var accent = this.CharCategory._accentkana[(c1.charCodeAt(0) - (this.CharCategory._charstarts[62].charCodeAt(0) + 1))];//Blocks.KATAKANA
                            
                            if(accent != 0) {
                                if((Math.abs(accent) & 2) == daku) {
                                    c1 = String.fromCharCode(c1.charCodeAt(0) + 1);
                                }
                                c1 = String.fromCharCode(c1.charCodeAt(0) + 1);
                            }
                        }
                        //add by sj for bug 2955
                        if(daku == 1 && c1 == '\u30A6') {
                            c1 = '\u30F4';
                        }
                        //end by sj
                                            }
                }
                retObj.text = c1;
                return retObj;
                //return c1;
                            };
            CharProcess.prototype.ToHalfWidth = function (c) {
                //
                // Need to return only the first character.
                //
                return this.ToHalfWidthEx(c);
            };
            CharProcess.prototype.ToHalfWidthEx = function (c) {
                var ctype = this.GetCharType(c);
                var multiWidth = this.IsMultiWidth(c);
                //
                // First filter out half width characters and characters that
                // are not of CJK groups.
                if((ctype & this.Ctype.FullWidth) == this.Ctype.FullWidth) {
                    switch(ctype & ~this.Ctype.FullWidth) {
                        case this.Ctype.Punctuation:
                        case this.Ctype.UpperCase:
                        case this.Ctype.LowerCase:
                        case this.Ctype.Symbol:
                        case this.Ctype.Numeric:
                        case this.Ctype.MathSymbol:
 {
                                var c1 = this.GetFullHalfWidthSpecialChar(c, false);
                                if(c1 !== "") {
                                    c = c1;
                                } else {
                                    if(multiWidth) {
                                        var temp = '\u0021';//!
                                        
                                        //c = (char)(( c - (_charstarts[(int)Blocks.HALFWIDTH_AND_FULLWIDTH_FORMS] + 1) ) + '\u0021');
                                        c = String.fromCharCode(c.charCodeAt(0) - (this.CharCategory._charstarts[81].charCodeAt(0) + 1) + temp.charCodeAt(0))//Blocks.HALFWIDTH_AND_FULLWIDTH_FORMS
                                        ;
                                    }
                                }
                            }
                            break;
                        case this.Ctype.Katakana:
 {
                                var n = c.charCodeAt(0) - (this.CharCategory._charstarts[62].charCodeAt(0) + 1);
                                if(n < 0 || n > 91) {
                                    return c;
                                }
                                c = this.CharCategory._fullkana[n];
                                var accent = this.CharCategory._accentkana[n];
                                if(accent > 0) {
                                    //accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0) ;
                                    c = c + String.fromCharCode(accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0));
                                    return c;
                                }
                                //return new char[] { c, accent == 1 ? KATAKANA_VOICED : KATAKANA_SEMIVOICED };
                                                            }
                            break;
                        case this.Ctype.Space:
                            c = '\u0020';
                            break;
                            // (Masa, add Hangul support later... )
                                                    case this.Ctype.Hangul:
                            break;
                    }
                }
                return c;
            };
            CharProcess.prototype.ToKatakana = function (c) {
                //
                // Simply return the character if it isn't a hiragana.
                //
                if(!this.IsCharOfType(c, this.Ctype.Hiragana | this.Ctype.FullWidth)) {
                    return c;
                }
                //
                // Need to handle special characters here...
                //
                var c1 = this.GetFullHalfWidthSpecialChar(c, false);
                //			if( c == '\u309b' || c == '\u309c' )
                //				return (char)('\uff9e' + (c - '\u309b'));
                if(c1 !== "") {
                    return c1;
                }
                //return (char)( c - _charstarts[(int)Blocks.HIRAGANA] + _charstarts[(int)Blocks.KATAKANA] );
                return String.fromCharCode(c.charCodeAt(0) - this.CharCategory._charstarts[61].charCodeAt(0) + this.CharCategory._charstarts[62].charCodeAt(0));//Blocks.KATAKANA
                
            };
            CharProcess.prototype.ToHiragana = function (c) {
                //
                // Simply return the character if it isn't a hiragana.
                if(!this.IsKatakana(c)) {
                    return c;
                }
                // Convert to fullwidth Katakana.
                if(!this.IsFullWidth(c)) {
                    c = this.ToFullWidth(c).text;
                }
                //validate
                if(!this.IsCharOfType(c, this.Ctype.Katakana | this.Ctype.FullWidth)) {
                    return c;
                }
                //
                // Some fullwidth Katakana characters can't be expressed in Hiragaga
                // so mask it out.
                //
                //modified by sj for NKOI-8C7E84AA2
                //if (c >= '\u30f6' && c <= '\u30ff')
                //	return c;
                if(c >= '\u30f7' && c <= '\u30ff') {
                    return c;
                }
                if(c == '\u30f5') {
                    return '\u304b';
                }
                if(c == '\u30f6') {
                    return '\u3051';
                }
                //end by sj
                //return (char)( c - _charstarts[(int)Blocks.KATAKANA] + _charstarts[(int)Blocks.HIRAGANA] );
                return String.fromCharCode(c.charCodeAt(0) + this.CharCategory._charstarts[61].charCodeAt(0) - this.CharCategory._charstarts[62].charCodeAt(0));//Blocks.KATAKANA
                
            };
            CharProcess.prototype.ToBigHalfKatakana = function (c) {
                if(!this.IsSmallHalfKatakana(c)) {
                    return c;
                }
                var c1 = this.CharCategory._halfkana[c.charCodeAt(0) - this.CharCategory.KANAHALFSTART];
                c1 = String.fromCharCode(c1.charCodeAt(0) + 1);
                return c1;
            };
            CharProcess.prototype.BelongTo = function (c) {
                var bottom = 0;
                var top = 83;//this.CharCategory._charstarts.length;
                
                var current = top >> 1;
                //
                // Binary search used to find proper type.
                //
                while(top - bottom > 1) {
                    if(c >= this.CharCategory._charstarts[current]) {
                        bottom = current;
                    } else {
                        top = current;
                    }
                    current = (top + bottom) >> 1;
                }
                return current;
            };
            CharProcess.prototype.MultiWidthDetails = function (c) {
                var bottom = 0;
                var top = this.CharCategory._fullhalfblocks.length;
                var current = top >> 1;
                //
                // Binary search used to find proper type.
                //
                while(top - bottom > 1) {
                    if(c >= this.CharCategory._fullhalfblocks[current]) {
                        bottom = current;
                    } else {
                        top = current;
                    }
                    current = (top + bottom) >> 1;
                }
                return this.CharCategory._mwtable[current];
            };
            CharProcess.prototype.IsFarEastBlock = function (block, c) {
                switch(this.CharCategory.Blocks[block]) {
                    case 'CJK_COMPATIBILITY':
                    case 'CJK_COMPATIBILITY_FORMS':
                    case 'CJK_COMPATIBILITY_IDEOGRAPHS':
                    case 'CJK_RADICALS_SUPPLEMENT':
                    case 'CJK_SYMBOLS_AND_PUNCTUATION':
                    case 'CJK_UNIFIED_IDEOGRAPHS':
                    case 'CJK_UNIFIED_IDEOGRAPHS_EXTENSION':
                    case 'HALFWIDTH_AND_FULLWIDTH_FORMS':
                    case 'BOPOMOFO':
                    case 'BOPOMOFO_EXTENDED':
                    case 'HIRAGANA':
                    case 'KATAKANA':
                    case 'KANBUN':
                    case 'HANGUL_COMPATIBILITY_JAMO':
                    case 'HANGUL_JAMO':
                    case 'HANGUL_SYLLABLES':
                        return true;
                    default:
                        // Add comments by Yang at 14:28 March 6th 2008
                        // For fix the bug 9709
                        // There are some different requirements from InputMan Winform.
                        // No matter the current cultureinfo.
                        for(var i = 0; i < this.CharCategory._feQuotes.length; i++) {
                            if(c == this.CharCategory._feQuotes[i]) {
                                return true;
                            }
                        }
                        if(c.charCodeAt(0) > 255) {
                            return true;
                        }
                        if(c.charCodeAt(0) == 8216 || c.charCodeAt(0) == 8217 || c.charCodeAt(0) == 8220 || c.charCodeAt(0) == 8221) {
                            return true;
                        }
                        //			if (c.charCodeAt(0) == 8216 || c.charCodeAt(0) == 8217 ||
                        //			    c.charCodeAt(0) == 8220 || c.charCodeAt(0) == 8221)
                        //				return true;
                        //			if( c.charCodeAt(0) > 255 )
                        // End by Yang
                        break;
                }
                return false;
            };
            CharProcess.prototype.GetFullHalfWidthSpecialChar = function (c, toFull) {
                if(toFull == true) {
                    var srctable = this.CharCategory._jpnSpecialHalf;
                    var desttable = this.CharCategory._jpnSpecialFull;
                } else {
                    var srctable = this.CharCategory._jpnSpecialFull;
                    var desttable = this.CharCategory._jpnSpecialHalf;
                }
                var found = -1;
                var tempIndex = 0;
                while(tempIndex < srctable.length) {
                    if(srctable[tempIndex] == c) {
                        found = tempIndex;
                        break;
                    }
                    tempIndex++;
                }
                if(found != -1) {
                    if(tempIndex < desttable.length) {
                        return desttable[tempIndex];
                    }
                }
                return "";
            };
            return CharProcess;
        })();
        input.CharProcess = CharProcess;        
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
