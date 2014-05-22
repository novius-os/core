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
    /// <reference path="jquery.wijmo.wijinputtextformat.ts"/>
    /// <reference path="../wijtooltip/jquery.wijmo.wijtooltip.ts"/>
    /*globals jQuery */
    /*
    * Depends:
    *	jquery-1.4.2.js
    *	jquery.ui.core.js
    *	jquery.ui.widget.js
    *	jquery.wijmo.wijcharex.js
    *	jquery.wijmo.wijstringinfo.js
    *	jquery.wijmo.wijinputcore.js
    *
    */
    (function (input) {
        "use strict";
        var $ = jQuery, widgetName = "wijinputtext";
        var EllipsisMode = (function () {
            function EllipsisMode() { }
            EllipsisMode.None = "none";
            EllipsisMode.EllipsisEnd = "ellipsisEnd";
            EllipsisMode.EllipsisPath = "ellipsisPath";
            return EllipsisMode;
        })();        
        var OutputMode;
        (function (OutputMode) {
            OutputMode._map = [];
            OutputMode._map[0] = "Append";
            OutputMode.Append = 0;
            OutputMode._map[1] = "Replace";
            OutputMode.Replace = 1;
        })(OutputMode || (OutputMode = {}));
        var ImeMode = (function () {
            function ImeMode() { }
            ImeMode.Auto = "auto";
            ImeMode.Active = "active";
            ImeMode.Disabled = "disabled";
            ImeMode.Inactive = "inactive";
            return ImeMode;
        })();        
        /** @widget */
        var wijinputtext = (function (_super) {
            __extends(wijinputtext, _super);
            function wijinputtext() {
                _super.apply(this, arguments);

            }
            wijinputtext.prototype._getIMTextBox = function () {
                if(this.imtextbox === undefined) {
                    this.imtextbox = new IMTextBox(this.element[0], this.outerDiv);
                }
                return this.imtextbox;
            };
            wijinputtext.prototype._create = function () {
                _super.prototype._create.call(this);
                var self = this;
                self.imtextbox = self._getIMTextBox();
            };
            wijinputtext.prototype._init = function () {
                _super.prototype._init.call(this);
                if(this.options.disableUserInput) {
                    this.imtextbox.SetReadOnly(true);
                }
                this.imtextbox.placeHolder = this.options.nullText ? this.options.nullText : "";
                var self = this;
                this.imtextbox.readingImeStringOutputEvent = function (e, data) {
                    self._trigger('readingImeStringOutput', null, data);
                };
                this.imtextbox.InvalidInputEvent = function (e, data) {
                    self._fireIvalidInputEvent(data);
                }//this._trigger('invalidInput', { char: data, widget: this }); };
                ;
                this.imtextbox.SetAutoConvert(this.options.autoConvert);
                this.imtextbox.SetExitOnLastChar(this.options.blurOnLastChar);
                this.imtextbox.SetExitOnLeftRightKey(this.options.blurOnLeftRightKey);
                this.imtextbox.SetFormat(this.options.format);
                this.imtextbox.SetMaxLength(this.options.maxLength);
                this.imtextbox.SetHighlightText(this.options.highlightText);
                this.imtextbox.SetOverflowTip(this.options.showOverflowTip);
                this.imtextbox.SetMaxLineCount(this.options.maxLineCount);
                this.imtextbox.SetCountWrappedLine(this.options.countWrappedLine);
                //if (this.options.passwordChar === null) {
                //    this.options.passwordChar = this.imtextbox.SystemPasswordChar();
                //}
                //this.imtextbox.SetPasswordChar(this.options.passwordChar);
                if(this.options.invalidInput !== null) {
                    this.imtextbox.OnInvalidInput(this.options.invalidInput);
                }
                if(this.options.keyExit !== null) {
                    this.imtextbox.OnKeyExit(this.options.keyExit);
                }
                //if (this.options.textChanged !== null) {
                //    this.imtextbox.OnTextChanged(this.options.textChanged);
                //}
                this.imtextbox.TextChangedEvent = function (e, data) {
                    self.options.text = data;
                    self._trigger('textChanged', null, {
                        text: data
                    });
                };
                var e = this.element, wijCSS = this.options.wijCSS, allowedNodes = {
                    'input': true,
                    'textarea': true
                }, allowedInputTypes = {
                    'text': true,
                    'password': true,
                    'email': true,
                    'url': true
                }, nodeName = e.get(0).nodeName.toLowerCase();
                //// enable touch support:
                //if (window.wijmoApplyWijTouchUtilEvents) {
                //    $ = window.wijmoApplyWijTouchUtilEvents($);
                //}
                if(!allowedNodes.hasOwnProperty(nodeName)) {
                    return;
                }
                if((nodeName === 'input') && this.element.attr("type") && !allowedInputTypes.hasOwnProperty(this.element.attr("type").toLowerCase())) {
                    return;
                }
                if(nodeName === 'input') {
                    this.imtextbox.SetMultiLine(false);
                    if(this.element.attr('type') === 'password') {
                        var passwordChar;
                        if(this.options.passwordChar) {
                            passwordChar = this.options.passwordChar;
                        } else {
                            passwordChar = this.imtextbox.SystemPasswordChar();
                        }
                        this.imtextbox.SetPasswordChar(passwordChar);
                        //TODO. fisheye button.
                                            }
                } else if(nodeName === 'textarea') {
                    this.imtextbox.SetMultiLine(true);
                }
                this.imtextbox.SetLengthAsByte(this.options.lengthAsByte);
                if(this.options.text === null) {
                    this.options.text = this.getText();
                }
                if(!(this.options.text === this.imtextbox.placeHolder && this.imtextbox.isNullText)) {
                    this.setText(this.options.text);
                }
                this.imtextbox.SetEllipsisString(this.options.ellipsisString);
                this.imtextbox.SetEllipsis(this.options.ellipsis);
                //for case 20899
                if(e.is(":disabled")) {
                    this._setOption("disabled", true);
                    e.addClass(wijCSS.stateDisabled);
                } else {
                    this._setOption("disabled", false);
                    e.removeClass(wijCSS.stateDisabled);
                }
                if(this.options.passwordChar) {
                    this.imtextbox.SetPasswordChar(this.options.passwordChar);
                }
            };
            wijinputtext.prototype.destroy = /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            function () {
                var self = this, wijCSS = self.options.wijCSS;
                self.element.removeClass(wijCSS.widget).removeClass(wijCSS.stateDefault).removeClass(wijCSS.cornerAll).removeClass(wijCSS.stateHover).removeClass(wijCSS.stateActive).off(//.removeClass(wijCSS.wijinput)
                "." + self.widgetName);
                self.element.off('.imtextbox');
                _super.prototype.destroy.call(this);
            };
            wijinputtext.prototype.getSelectedText = /** Gets the selected text.
            */
            function () {
                return this.imtextbox.GetSelectedText();
            };
            wijinputtext.prototype._setOption = function (key, value) {
                switch(key) {
                    case 'nullText':
                    case 'placeholder':
                        this.imtextbox.placeHolder = value;
                        break;
                }
                _super.prototype._setOption.call(this, key, value);
                switch(key) {
                    case 'autoConvert':
                        this.imtextbox.SetAutoConvert(value);
                        break;
                    case 'blurOnLastChar':
                        this.imtextbox.SetExitOnLastChar(value);
                        break;
                    case 'blurOnLeftRightKey':
                        this.imtextbox.SetExitOnLeftRightKey(value);
                        break;
                    case 'showDropDownButton':
                        var ellipsis = this.imtextbox.GetEllipsis();
                        this.imtextbox.SetEllipsis(ellipsis);
                        break;
                    case 'ellipsis':
                        this.imtextbox.SetEllipsis(value);
                        break;
                    case 'ellipsisString':
                        this.imtextbox.SetEllipsisString(value);
                        break;
                    case 'highlightText':
                        this.imtextbox.SetHighlightText(value);
                        break;
                    case 'showOverflowTip':
                        this.imtextbox.SetOverflowTip(value);
                        break;
                    case 'format':
                        this.imtextbox.SetFormat(value);
                        break;
                    case 'maxLineCount':
                        this.imtextbox.SetMaxLineCount(value);
                        break;
                    case 'countWrappedLine':
                        this.imtextbox.SetCountWrappedLine(value);
                        break;
                        // In wijinputcore.
                        //case 'imeMode':
                        //    this.imtextbox.SetImeMode(value);
                        //    break;
                                            case 'lengthAsByte':
                        this.imtextbox.SetLengthAsByte(value);
                        break;
                    case 'maxLength':
                        this.imtextbox.SetMaxLength(value);
                        break;
                        //case 'showNullText':
                        //    break;
                                            case 'readonly':
                    case 'disableUserInput':
                        this.imtextbox.SetReadOnly(value);
                        break;
                    case 'passwordChar':
                        this.imtextbox.SetPasswordChar(value);
                        break;
                    case 'text':
                        this.setText(value);
                        break;
                    case 'invalidInput':
                        this.imtextbox.OnInvalidInput(value);
                        break;
                    case 'keyExit':
                        this.imtextbox.OnKeyExit(value);
                        break;
                    case '':
                        break;
                }
            };
            wijinputtext.prototype._updateTextOnLostFocus = // Stop binding event handler in wijinputcore
            //_onFocus(e) {
            //}
            //_onBlur(e) {
            //}
            function () {
                if(this.imtextbox.PasswordMode) {
                    return;
                }
                _super.prototype._updateTextOnLostFocus.call(this);
            };
            wijinputtext.prototype._onMouseUp = function (e) {
            };
            wijinputtext.prototype._onCompositionStart = function () {
            };
            wijinputtext.prototype._onCompositionEnd = function () {
            };
            wijinputtext.prototype._onChange = function () {
            };
            wijinputtext.prototype._onPaste = function (e) {
            };
            wijinputtext.prototype._onDrop = function (e) {
            };
            wijinputtext.prototype._onKeyDown = function (e) {
                var k = this._getKeyCode(e);
                var jqKeyCode = wijmo.getKeyCodeEnum();
                if(this.options.disableUserInput) {
                    if(k === jqKeyCode.TAB) {
                        if(this._processTabKey(e)) {
                            this._stopEvent(e);
                        }
                    } else {
                        this._stopEvent(e);
                    }
                    return;
                }
                if(this._processKeyForDropDownList(e)) {
                    return;
                }
                if(k === jqKeyCode.ENTER) {
                    this._onEnterDown(e);
                }
            };
            wijinputtext.prototype._onKeyPress = function (e) {
                if(this.options.disableUserInput) {
                    return;
                }
                var k = this._getKeyCode(e);
                var jqKeyCode = wijmo.getKeyCodeEnum();
                if(k === jqKeyCode.ENTER) {
                    this._onEnterDown(e);
                }
            };
            wijinputtext.prototype._onKeyUp = function (e) {
                if(this.options.disableUserInput) {
                    this._raiseTextChanged();
                    this._raiseDataChanged();
                    return;
                }
            };
            wijinputtext.prototype._createTextProvider = function () {
                this._textProvider = new wijInputTextProvider(this);
            };
            wijinputtext.prototype.selectText = /** Selects a range of text in the widget.
            * @param {Number} start Start of the range.
            * @param {Number} end End of the range.
            * @example
            * // Select first two symbols in a wijinputtext
            * $(".selector").wijinputtext("selectText", 0, 2);
            */
            function (start, end) {
                if (typeof start === "undefined") { start = 0; }
                if (typeof end === "undefined") { end = this.getText().length; }
                if(isNaN(start)) {
                    start = 0;
                }
                if(isNaN(end)) {
                    end = 0;
                }
                if(this.element.is(':disabled')) {
                    return;
                }
                if(input.Utility.IsFireFox4OrLater()) {
                    this.focus();
                }
                this.imtextbox.SetSelection(start, end);
            };
            wijinputtext.prototype._updateText = function () {
                if(this.element.data("initialized")) {
                    _super.prototype._updateText.call(this);
                }
            };
            return wijinputtext;
        })(input.wijinputcore);
        input.wijinputtext = wijinputtext;        
        var wijinputtext_options = (function () {
            function wijinputtext_options() {
                /** Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijinput')";
                /** wijtextbox css, extend from $.wijmo.wijCSS
                * @ignore
                */
                this.wijCSS = {
                };//wijtextbox: "wijmo-wijtextbox"
                
                /** Gets whether the control automatically converts to the proper format according to the format setting.
                */
                this.autoConvert = true;
                /** Determines whether or not the next control in the tab order receives
                * the focus as soon as the control is filled at the last character.
                */
                this.blurOnLastChar = false;
                /** Gets or set whether the focus automatically moves to the next or previous
                * tab ordering control when pressing the left, right arrow keys.
                */
                this.blurOnLeftRightKey = 'none';
                /** Gets or sets how to display the Ellipsis string when the control's content is
                * longer than its Width.
                * @exluce
                */
                this.ellipsis = EllipsisMode.None;
                /** Gets or sets the Ellipsis string shows in the control.
                */
                this.ellipsisString = String.fromCharCode(8230);
                /** Gets or sets whether display the OverflowTip.
                */
                this.showOverflowTip = false;
                /**Gets or sets whether to highlight the control's Text on receiving input focus.
                */
                this.highlightText = false;
                /** Determines the format string that defines the type of text
                * allowed for input in the control.
                *
                * @remarks
                * The following key words are supported.
                * DBCS Keywords:
                *   Ａ Upper case DBCS alphabet (A-Z).
                *   ａ Lower case DBCS alphabet (a-z).
                *   Ｋ DBCS Katakana.
                *   ９ DBCS Numbers (0-9).
                *   ＃ DBCS numbers and number related symbols (0-9, +-$%\,.).
                *   ＠ DBCS symbols.
                *   Ｊ Hiragana.
                *   Ｚ All DBCS characters without Space.
                *   Ｎ Only DBCS large Katakanas.
                *   Ｇ Only DBCS large Hiragana.
                *   Ｔ Only allow surrogate char.
                *   Ｄ All DBCS characters, except for surrogates.
                *   Ｓ DBCS space.
                * SBCS Keywords:
                *   A Upper case alphabet (A-Z).
                *   a Lower case alphabet (a-z).
                *   K Katakana.
                *   9 Numbers (0-9).
                *   # Numbers and number related symbols (0-9, +-$%\,.).
                *   @ Symbols.
                *   H All SBCS characters without Space.
                *   N Only SBCS large Katakanas.
                *   S SBCS Space.
                *   ^ Any character not included in the specified format.
                *   \ Escape character.
                * For example, format = 'Ａ', then the wijinputtext can only input the upper case DBCS alphabet.
                * If you input the SBCS 'k', then it will be automatic conver to DBCS 'Ｋ' if the autoConvert is true,
                * But if the autoConvert is false, you can't input 'k'.
                */
                this.format = '';
                /** Sets the Ime Mode setting of widget.
                * Possible values are: 'auto', 'active', 'inactive', 'disabled'
                */
                this.imeMode = 'auto';
                /** Determines whether the maximum length constraint for
                * input is byte-based or character-based.
                */
                this.lengthAsByte = false;
                /**  Determines the maximum length of text that can be input
                *  in the control.
                */
                this.maxLength = 0;
                /**  Determines the max count of lines can be input into the Edit control.
                */
                this.maxLineCount = 0;
                /** Determines whether to treat the wrapped lines as one line or multiple lines
                * when counting the lines count.
                */
                this.countWrappedLine = false;
                /**  Determines the password char.
                */
                this.passwordChar = '';
                /** Determines the text of the wijinputtext.
                */
                this.text = null;
                /** @ignore */
                this.allowSpinLoop = false;
                /** @ignore */
                this.spinnerAlign = "verticalRight";
                /** @ignore */
                this.showSpinner = false;
                /** @ignore */
                this.culture = '';
                /** The readingImeStringOutput event handler.
                * A function called when the japanese reading ime string is generated.
                * @event
                * @dataKey {readingString} the generaged reading ime string.
                */
                this.readingImeStringOutput = null;
            }
            return wijinputtext_options;
        })();        
        wijinputtext.prototype.options = $.extend(true, {
        }, input.wijinputcore.prototype.options, new wijinputtext_options());
        $.wijmo.registerWidget(widgetName, wijinputtext.prototype);
        /** @ignore */
        var wijInputTextProvider = (function () {
            function wijInputTextProvider(owner) {
                this.inputWidget = owner;
            }
            wijInputTextProvider.prototype.toString = //insertAt(strInput: string, position: number, rh?: wijInputResult) {
            //    return true;
            //}
            function (ignorePasswordChar) {
                if(this.inputWidget._showNullText() && !this.inputWidget.isFocused() && this.isValueNull()) {
                    this.inputWidget.element.data('isShowNullText', true);
                    return this.inputWidget.options.nullText;
                } else if((!this.inputWidget._showNullText() || this.inputWidget.isFocused()) && this.inputWidget.element.data('isShowNullText')) {
                    this.inputWidget.element.data('isShowNullText', false);
                    return '';
                } else if(this.inputWidget.imtextbox && this.inputWidget.imtextbox.GetPasswordChar()) {
                    if(ignorePasswordChar) {
                        return this.inputWidget.options.text;
                    } else {
                        return this.inputWidget.imtextbox._getInputValueWithPlaceHolder();
                    }
                } else if(this.inputWidget.imtextbox) {
                    return this.inputWidget.imtextbox._getInputValueWithPlaceHolder();
                } else if(this.inputWidget.options.text !== undefined) {
                    return this.inputWidget.options.text;
                } else {
                    return this.inputWidget.element.val();
                }
            };
            wijInputTextProvider.prototype.isValueNull = function () {
                if(this.inputWidget.imtextbox) {
                    return this.inputWidget.imtextbox.isNullText;
                } else {
                    return true;
                }
            };
            wijInputTextProvider.prototype.setText = function (text) {
                this.inputWidget.imtextbox.SetText(text);
            };
            wijInputTextProvider.prototype.replaceWith = function (range, text) {
                var index = range.start;
                var result = new input.wijInputResult();
                if(range.start < range.end) {
                    this.removeAt(range.start, range.end - 1, result, true);
                    index = result.testPosition;
                }
                return this.insertAt(text, index, result) ? result : null;
            };
            wijInputTextProvider.prototype.insertAt = function (char, index, rh) {
            };
            wijInputTextProvider.prototype.removeAt = function (start, end, rh, skipCheck) {
            };
            return wijInputTextProvider;
        })();
        input.wijInputTextProvider = wijInputTextProvider;        
        /** @ignore */
        var IMTextBox = (function () {
            function IMTextBox(element, container) {
                this.ToolTip = null;
                this.placeHolder = "";
                //#endregion
                this.Focused = false;
                this.InputElement = element;
                this._container = container;
                // if the input element doesn't has an id, we'll set a temporary id to support history list cookie.
                if(this.InputElement.id === '') {
                    this.InputElement.id = 'wijmo_input_' + input.Utility.IdCounter++;
                }
                //this.ID = this.GetId();
                //if (container === undefined || container === null) {
                //    throw "Container can't be null";
                //} else {
                //    this._container = container;
                //}
                this.ScrollBarMode = input.ScrollBarMode.Fixed;
                this.IsControlInPreview = null;
                this.AddressObj = null;
                this.KeyActionList = null;
                this.UseSystemPasswordChar = false;
                this.Overwrite = false;
                this.Format = "";
                //this.AutoCompleteType = AutoCompleteType.None;
                this.ShowHistory = false;
                this.ReadOnly = false;
                this.AutoConvert = true;
                this.CausesValidation = false;
                this.ValidationGroup = "";
                this.LengthAsByte = false;
                this.MaxLength = 0;
                this.MaxHistoryCount = 10;
                this.MultiLine = false;
                this.AcceptsCrLf = input.CrLfMode.NoControl;
                this.AcceptReturn = true;
                this.AcceptTab = false;
                this.HighlightText = false;
                this.Ellipsis = EllipsisMode.None;
                this.EllipsisString = String.fromCharCode(8230)//"...";
                ;
                this.ExitOnLastChar = false;
                if(input.Utility.IPad) {
                    // DaryLuo 2013/07/17 fix bug 1052 in IM HTML 5.
                    this.TouchDropDownScale = 1;
                } else {
                    this.TouchDropDownScale = 1.5;
                }
                this.ExitOnLeftRightKey = input.ExitOnLeftRightKey.None;
                this.EditMode = input.EditMode.Insert;
                this.__editModeInternal = input.EditMode.Insert// Frank Liu fixed bug 1029 at 2013/07/10.
                ;
                //this.Shortcuts = "DropDown,262162";
                this.AutoPostBack = false;
                this.PasswordMode = false;
                this.PasswordChar = "";
                this.OverflowTip = false;
                this.MaxLineCount = 0;
                this.CountWrappedLine = false;
                this.IsInUpdatePanelAndAsyncPostBack = false;
                this.UseClipboard = true;
                this.ReadingImeStringOutput = new Object();
                this.ReadingImeStringOutput.OutputMode = OutputMode.Append;
                this.ReadingImeStringOutput.TargetControl = null;
                this.ScrollBars = input.ScrollBars.None;
                //this._xpTheme = XPTheme.Default;
                this.prevval = "";
                this.RubyText = "";
                this.FocusType = input.FocusType.None;
                this.SelectionStart = 0;
                this.SelectionEnd = 0;
                this.SelectionLength = 0;
                this.OldSelectionStart = this.SelectionStart;
                this.OldSelectionEnd = this.SelectionEnd;
                var oldEditControl = this;
                var isHasIMControlObject = oldEditControl != null;
                if(!this.IsInUpdatePanelAndAsyncPostBack) {
                    this.OldText = this.Text;
                } else {
                    if(isHasIMControlObject) {
                        this.OldText = oldEditControl.GetOldValue();
                    }
                }
                this.LastStart = this.SelectionStart;
                this.LastEnd = this.SelectionEnd;
                this.Text = "";
                this.LastText = this.Text;
                // Modified by shenyuan at 2006-01-13 for new undo rules
                this.BuffText = "";
                // Added by shenyuan at 2006-01-17 for bug #4989
                this.IsUndoAfterDel = false;
                this.MouseButton = input.MouseButton.Left;
                this.EnableOnSelectStartEvent = true;
                this.isLeftMouseButtonPressed = false;
                //For ime mode:
                this.OrientText = "";
                this.ImeSelect = false;
                this.ImeSelectTimes = 0;
                //Edit type
                this.DragEdit = false;
                this.DropEdit = false;
                this.isFuncKeyPressed = false;
                //Change
                this.SystemChange = true;
                this.ImeMode = false;
                this.KeyDownAction = false;
                this.FocusExit = false;
                this.lastValue = "";
                this.truePosition = -1;
                this.mouseupTimes = 0;
                this.LastInputText = "";
                //Drag
                this.BeforeDragSelectionStart = 0;
                this.BeforeDragSelectionEnd = 0;
                this.IsMouseDown = false;
                //var name = "o" + this.GetId() + "IMControl.ContextMenu";
                //this.ContextMenu = new ContextMenu(name, this, this.PasswordMode);
                this.Type = "Edit";
                this.ToolTip = null;
                if((!this.MultiLine) && this.OverflowTip) {
                    var self = this;
                    input.Utility.AttachEvent(document, "mousemove", function (evt) {
                        input.GlobalEventHandler.OnMouseMove(self, evt);
                    }, false);
                }
                this.HasFocus = false;
                // end of Add for OverflowTip
                var multidata = {
                    SelectionStart: this.SelectionStart,
                    SelectionEnd: this.SelectionEnd,
                    Text: this.Text,
                    OldSelectionStart: this.OldSelectionStart,
                    OldSelectionEnd: this.OldSelectionEnd,
                    OldText: this.OldText,
                    LastStart: this.LastStart,
                    LastEnd: this.LastEnd,
                    LastText: this.LastText,
                    BuffText: this.BuffText
                };
                this.DropDownEditData = multidata;
                this.IsChangedByDropDownEdit = false;
                // end
                // add for Drop
                this.DropText = "";
                // end
                this.isTextEllipsis = false;
                this.TextHeadLength = 0;
                this.IsJapanConvertKeyPress = false;
                this.NeedReCalCursorPos = true;
                if(!input.Utility.IsIE()) {
                    this.IsActive = false;
                }
                ;
                this.HasValidatedImeInput = true;
                this.IsFocusToDropDownEdit = false;
                this.IsCausedByClickingDropDownBt = false;
                this.IsCausedByImplementingDrop = false;
                // For in Firefox the properties MaxLineCount, Ellipsis and OverflowTip aren't supported.
                if(!input.Utility.IsIE()) {
                    this.MaxLineCount = 0;
                    this.Ellipsis = EllipsisMode.None;
                    this.OverflowTip = false;
                    this.IsImplementImeInput = false;
                }
                this.Create();
                this.AddAllEventsHandler();
                this.EditStatusChangedEvent = null;
                this.InvalidInputEvent = null;
                this.KeyExitEvent = null;
                this.TextChangedEvent = null;
                this.DropDownCloseEvent = null;
                this.DropDownOpenEvent = null;
                this.readingImeStringOutputEvent = null;
                this.IsjQueryControl = true;
                this.UIProcess = new GcTextBoxUIProcess(this.AutoConvert, this.Format, /*this.GetId(),*/ this.PasswordMode, this.PasswordChar, this.IsjQueryControl, this);
                this.Text = "";
                this.isPasting = false;
                this.WordWrap = true;
                this.Enabled = true;
                this.AutoCompleteType = "None";
                //this.DropDownObj = new DropDownEditControl(this.GetId(), this);
                //this._dropDown = this._render._dropDown;
                if(this.InputElement.style.imeMode === '') {
                    this.SetImeMode(ImeMode.Auto);
                }
                this._autoComplete = new AutoComplete(this);
                this.IsFromServer = false;
                this._historyList = [];
                if(this.IsFromServer) {
                    this.EnableAutoComplete = this.ShowHistory && (this.AutoCompleteType != "Disabled") && !this.ReadOnly && this.Enabled;
                } else {
                    this.EnableAutoComplete = this.ShowHistory && !this.ReadOnly && this.Enabled;
                }
                this._lines = [];
                // HelenLiu 2013/06/14 fix bug 692 in IM HTML5.
                //this.SetControlEffect(ControlEffect.NotSet);
                //this._controlEffect = ControlEffect.JQueryUI;
                // HelenLiu 2013/07/04 fix bug 943 in IM HTML5.
                this.tempIMEMode = 'auto';
                this.HeightChangedBySet = false;
                this.Width = "";
                this.Height = "";
                this.LastPassWordChar = "";
                input.Utility.AttachFocusEventOfDocument();
                this.ShouldShowClearButton = true;
                this.switchPasswordChar = false;
                if(this.InputElement.value === "") {
                    this.isNullText = true;
                } else {
                    this.isNullText = false;
                }
            }
            IMTextBox.prototype.GetId = function () {
                return this.InputElement.id;
            };
            IMTextBox.prototype.GetContainer = function () {
                return this._container;
            };
            IMTextBox.prototype.GetJQueryInputElement = function () {
                return $(this.InputElement);
            };
            IMTextBox.prototype.GetInputElement = function () {
                return this.InputElement;
            };
            IMTextBox.prototype.Create = function () {
                if(input.Utility.IsIE10OrLater()) {
                    this.CreateHideMSClearButtonForIE10Class();
                }
            };
            IMTextBox.prototype.CreateHideMSClearButtonForIE10Class = function () {
                if(IMTextBox.HideMSClearButtonForIE10ClassName === undefined) {
                    IMTextBox.HideMSClearButtonForIE10ClassName = "gcsh_HideMSClearButtonForIE10";
                    var styleRule = input.Utility.CreateClassStyle(IMTextBox.HideMSClearButtonForIE10ClassName + "::-ms-clear");
                    styleRule.style.display = "none";
                }
            };
            IMTextBox.prototype.IsNullFormat = function () {
                return false;
            };
            IMTextBox.prototype.IsNeedFishEyeButton = //#region FishEye and ClearButton
            function () {
                return input.Utility.IsIE10OrLater() && !this.MultiLine && this.PasswordMode;
            };
            IMTextBox.prototype.SetAddressObj = function (addressObj) {
                this.AddressObj = addressObj;
            };
            IMTextBox.prototype.ShowClearButton = //OnFishEyeButtonDown(evt) {
            //    Utility.PreventDefault(evt);
            //    this.FishEyeButtonPressed = true;
            //    this.UpdateFishEyeButtonAppearanceState();
            //    this.FishEyeButton.setCapture(true);
            //    this.UIUpdate.SetText(this.Text);
            //}
            //OnFishEyeButtonUp(evt) {
            //    Utility.PreventDefault(evt);
            //    this.FishEyeButtonPressed = false;
            //    if (evt.offsetX < 0 || evt.offsetX > this.FishEyeButton.offsetWidth || evt.offsetY < 0 || evt.offsetY > this.FishEyeButton.offsetHeight) {
            //        this.FishEyeButtonHover = false;
            //    }
            //    this.UpdateFishEyeButtonAppearanceState();
            //    this.FishEyeButton.releaseCapture(true);
            //    this.UIUpdate.SetText(this.UIProcess.GetPasswordText(this.Text, this.PasswordChar, this.MultiLine));
            //};
            //OnFishEyeButtonMouseOver(evt) {
            //    this.FishEyeButtonHover = true;
            //    this.UpdateFishEyeButtonAppearanceState();
            //};
            //OnFishEyeButtonMouseOut(evt) {
            //    Utility.PreventDefault(evt);
            //    this.FishEyeButtonHover = false;
            //    this.UpdateFishEyeButtonAppearanceState();
            //};
            //ShowFishEyeButton() {
            //    if (this.IsNeedFishEyeButton()) {
            //        if (this.FishEyeButton == null) {
            //            var thisObj = this;
            //            this.FishEyeButton = Utility.CreateFishEyeButton(this.InputElement, this.IsjQueryControl);
            //            if (this.FishEyeButton == null) {
            //                return;
            //            }
            //            Utility.AttachEvent(this.FishEyeButton, "mousedown", function (evt) {
            //                thisObj.OnFishEyeButtonDown(evt);
            //            });
            //            Utility.AttachEvent(this.FishEyeButton, "mouseup", function (evt) {
            //                thisObj.OnFishEyeButtonUp(evt);
            //            });
            //            Utility.AttachEvent(this.FishEyeButton, "mouseover", function (evt) {
            //                thisObj.OnFishEyeButtonMouseOver(evt);
            //            });
            //            Utility.AttachEvent(this.FishEyeButton, "mouseout", function (evt) {
            //                thisObj.OnFishEyeButtonMouseOut(evt);
            //            });
            //            this._oldSetText = this.UIUpdate.SetText;
            //            this.UIUpdate.SetText(text) {
            //                thisObj.OnFishEyeSetText(text);
            //            };
            //        }
            //        if (!this.InputElement.parentElement.contains(this.FishEyeButton)) {
            //            this.InputElement.parentElement.appendChild(this.FishEyeButton);
            //        }
            //        this.UpdateFishEyeButtonPosition();
            //        this.UpdateFishEyeButtonAppearanceState("normal");
            //    }
            //};
            //UpdateFishEyeButtonPosition() {
            //    var textbox = this.GetInputElement();
            //    var fishEyeButtonDiv = this.FishEyeButton;
            //    var width = parseInt(textbox.currentStyle.width) + parseInt(textbox.currentStyle.paddingLeft) + parseInt(textbox.currentStyle.paddingRight);
            //    var height = parseInt(textbox.currentStyle.height);
            //    var paddingLeft = parseInt(textbox.currentStyle.paddingLeft);
            //    var paddingRight = parseInt(textbox.currentStyle.paddingRight);
            //    if (width - height + paddingLeft + paddingRight < Utility.GetClearButtonShowThreshold(textbox)) {
            //        return false;
            //    }
            //    var pos = { Left: 0, Top: 0 };
            //    width = textbox.offsetWidth;
            //    height = textbox.offsetHeight;
            //    var borderRect = Utility.GetBorderRectangle(textbox);
            //    var paddingRect = Utility.GetPaddingRectangle(textbox);
            //    var left = pos.Left + borderRect.Left + paddingRect.Left;
            //    var top = pos.Top + borderRect.Top + paddingRect.Top;
            //    width = width - borderRect.Horizontal - paddingRect.Horizontal;
            //    height = height - borderRect.Vertical - paddingRect.Vertical;
            //    fishEyeButtonDiv.style.height = height + "px";
            //    fishEyeButtonDiv.style.width = height + "px";
            //    fishEyeButtonDiv.style.left = left + width - height + "px";
            //    fishEyeButtonDiv.style.top = top + "px";
            //    fishEyeButtonDiv.style.display = "block";
            //    return true;
            //};
            //OnFishEyeSetText(text) {
            //    if (this.FishEyeButtonPressed && this.FishEyeButton.style.display != "none") {
            //        this._oldSetText.call(this.UIUpdate, this.Text);
            //    }
            //    else {
            //        this._oldSetText.call(this.UIUpdate, text);
            //    }
            //};
            //HideFishEyeButton(IsNeedRemove) {
            //    if (this.IsNeedFishEyeButton() && this.FishEyeButton != null) {
            //        if (IsNeedRemove) {
            //            if (this.FishEyeButton.parentElement !== null) {
            //                this.FishEyeButton.parentElement.removeChild(this.FishEyeButton);
            //            }
            //        } else {
            //            this.FishEyeButton.style.display = "none";
            //        }
            //        this.HideClearButton();
            //    }
            //};
            function () {
                this.InputElement.className = this.InputElement.className.replace(IMTextBox.HideMSClearButtonForIE10ClassName, "");
            };
            IMTextBox.prototype.HideClearButton = function () {
                if(this.InputElement.className != null && this.InputElement.className.indexOf(IMTextBox.HideMSClearButtonForIE10ClassName) == -1) {
                    this.InputElement.className += " " + IMTextBox.HideMSClearButtonForIE10ClassName;
                }
            };
            IMTextBox.prototype.HandleClearButton = function (evt) {
                if(input.Utility.IsIE10OrLater() && this.FocusedWhenMouseDown && this.MouseDownOnClearButton) {
                    if(evt.target == this.InputElement && !this.MultiLine) {
                        var isFocused = document.activeElement == evt.target;
                        var hitTestResult = input.Utility.IsMouseDownOnClearButton(evt);
                        //if (this.MouseUpHasValue && isFocused && hitTestResult && !this.PasswordMode) {
                        if(this.MouseUpHasValue && isFocused && hitTestResult) {
                            var thisObj = this;
                            setTimeout(function (parameters) {
                                thisObj.Clear();
                            }, 0);
                        }
                    }
                }
            };
            IMTextBox.prototype.GetAcceptsTab = //#endregion
            //#region Public Properties
            /**
            * Gets whether pressing the TAB key in a multiple line edit control types a TAB character in the control instead of moving the focus to the next control in the tab order.
            * @returns {boolean} A value indicates accept TAB or not.
            */
            function () {
                return this.AcceptTab;
            };
            IMTextBox.prototype.SetAcceptsTab = /**
            * Sets whether pressing the TAB key in a multiple line edit control types a TAB character in the control instead of moving the focus to the next control in the tab order.
            * @param {boolean} isAcceptsTab A value indicates accept TAB or not.
            */
            function (isAcceptsTab) {
                isAcceptsTab = input.Utility.CheckBool(isAcceptsTab);
                this.AcceptTab = isAcceptsTab;
            };
            IMTextBox.prototype.GetAcceptsCrlf = /**
            * Gets a value that indicates how to process the CrLf characters when copying, cutting, or pasting the string.
            * @returns {CrLfMode} A value indicates the mode of accept Crlf.
            */
            function () {
                return this.AcceptsCrLf;
            };
            IMTextBox.prototype.SetAcceptsCrlf = /**
            * Sets a value that indicates how to process the CrLf characters when copying, cutting, or pasting the string.
            * @param {CrLfMode} acceptsCrlfMode  A value indicates the mode of accept Crlf.
            */
            function (acceptsCrlfMode) {
                acceptsCrlfMode = input.Utility.CheckEnum(input.CrLfMode, acceptsCrlfMode);
                this.AcceptsCrLf = acceptsCrlfMode;
            };
            IMTextBox.prototype.GetAutoConvert = /**
            * Gets whether the control automatically converts to the proper format according to the format setting.
            * @returns {boolean} A value indicates support auto convert or not.
            */
            function () {
                return this.AutoConvert;
            };
            IMTextBox.prototype.SetAutoConvert = /**
            * Sets whether the control automatically converts to the proper format according to the format setting.
            * @param {boolean} isAutoConvert A value indicates support auto convert or not.
            */
            function (isAutoConvert) {
                isAutoConvert = input.Utility.CheckBool(isAutoConvert);
                this.AutoConvert = isAutoConvert;
                this.UIProcess.Reset();
                //this.DropDownObj.UIProcess.Reset();
                            };
            IMTextBox.prototype.GetCountWrappedLine = /**
            * Gets whether to treat the wrapped lines as one line or multiple lines when counting the lines count.
            * @returns {boolean} A value indicates count wrapper lines or not.
            */
            function () {
                return this.CountWrappedLine;
            };
            IMTextBox.prototype.SetCountWrappedLine = /**
            * Sets whether to treat the wrapped lines as one line or multiple lines when counting the lines count.
            * @param {boolean} isCountWrappedLine A value indicates count wrapper lines or not.
            */
            function (isCountWrappedLine) {
                isCountWrappedLine = input.Utility.CheckBool(isCountWrappedLine);
                this.CountWrappedLine = isCountWrappedLine;
                this.InternalSetText(this.GetText());
                if(this.Ellipsis !== EllipsisMode.None) {
                    this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
                }
            };
            IMTextBox.prototype.GetEditMode = /**
            * Gets the edit mode of the control.
            * @returns {EditMode} A value indicates edit mode setting.
            */
            function () {
                return this.EditMode;
            };
            IMTextBox.prototype.SetEditMode = /**
            * Sets the edit mode of the control.
            * @param {EditMode} editMode A value indicates edit mode setting.
            */
            function (editMode) {
                var value = editMode;
                value = input.Utility.CheckEnum(input.EditMode, value);
                if(value === input.EditMode.Insert || value === input.EditMode.FixedInsert) {
                    this.Overwrite = false;
                } else {
                    this.Overwrite = true;
                }
                // HelenLiu 2013/06/09 fix bug 643 in IM HTML5.0.
                if(value !== this.EditMode) {
                    var shouldFireEvent = false;
                    if(this._isinsertGroup(value) && this._isOverwriteGroup(this.EditMode)) {
                        shouldFireEvent = true;
                    } else if(this._isinsertGroup(this.EditMode) && this._isOverwriteGroup(value)) {
                        shouldFireEvent = true;
                    }
                    this.EditMode = value;
                    this.__editModeInternal = value// Frank Liu fixed bug 1029 at 2013/07/10.
                    ;
                    if(shouldFireEvent) {
                        this.UIProcess.FireEvent(this, this.EditStatusChangedEvent, null, "EditStatusChanged");
                    }
                }
            };
            IMTextBox.prototype._getEditModeInternal = function () {
                return this.__editModeInternal;
            };
            IMTextBox.prototype._setEditModeInternal = function (value) {
                value = input.Utility.CheckEnum(input.EditMode, value);
                if(value === input.EditMode.Insert || value === input.EditMode.FixedInsert) {
                    this.Overwrite = false;
                } else {
                    this.Overwrite = true;
                }
                // HelenLiu 2013/06/09 fix bug 643 in IM HTML5.0.
                if(value !== this.__editModeInternal) {
                    // HelenLiu 2013/07/17 fix bug 1080 in IM HTML5.
                    //var shouldFireEvent = false;
                    //if (this._isinsertGroup(value) && this._isOverwriteGroup(this.__editModeInternal)) {
                    //    shouldFireEvent = true;
                    //} else if (this._isinsertGroup(this.__editModeInternal) && this._isOverwriteGroup(value)) {
                    //    shouldFireEvent = true;
                    //}
                    this.__editModeInternal = value;
                    //if (shouldFireEvent) {
                    //    this.UIProcess.FireEvent(this, this.EditStatusChangedEvent, null, "EditStatusChanged");
                    //}
                                    }
            };
            IMTextBox.prototype.GetEllipsis = /**
            * Gets how to display the ellipsis string when the the control's content is longer than its width.
            * @returns {EllipsisMode} A value indicates ellipsis mode setting.
            */
            function () {
                return this.Ellipsis;
            };
            IMTextBox.prototype.SetEllipsis = /**
            * Sets how to display the ellipsis string when the the control's content is longer than its width.
            * @param {EllipsisMode} ellipsisMode A value indicates ellipsis mode setting.
            */
            function (ellipsisMode) {
                var value = ellipsisMode;
                value = input.Utility.CheckEnum(EllipsisMode, value);
                this.Ellipsis = value;
                this.InternalDirectSetText(this.Text);
                this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
            };
            IMTextBox.prototype.GetEllipsisString = /**
            * Gets the ellipsis string shows in the control.
            * @returns {string} A value indicates ellipsis string setting.
            */
            function () {
                return this.EllipsisString;
            };
            IMTextBox.prototype.SetEllipsisString = /**
            * Sets the ellipsis string shows in the control.
            * @param {string} ellipsisString A value indicates ellipsis string setting.
            */
            function (ellipsisString) {
                ellipsisString = input.Utility.CheckString(ellipsisString);
                this.EllipsisString = ellipsisString;
                this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
            };
            IMTextBox.prototype.GetExitOnLastChar = /**
            * Sets whether the control is enabled.
            * @param {boolean} isEnabled A value indicates control is enabled or not.
            */
            //SetEnabled(isEnabled) {
            //    BaseControl.prototype.SetEnabled.call(this, isEnabled);
            //    isEnabled = this.GetEnabled();
            //    this.Enabled = isEnabled;
            //    if (isEnabled) {
            //        this._removeBorderStatus(ControlStatus.Disabled);
            //    } else {
            //        this._addBorderStatus(ControlStatus.Disabled);
            //    }
            //    this._updateDropDownButtonStatus();
            //    this.UIUpdate.SetEnabled(isEnabled, this._render._dropDown.GetEnabled());
            //    if (this.IsFromServer) {
            //        this.EnableAutoComplete = this.ShowHistory && (this.AutoCompleteType != "Disabled") && !this.ReadOnly && isEnabled;
            //    } else {
            //        this.EnableAutoComplete = this.ShowHistory && !this.ReadOnly && isEnabled;
            //    }
            //};
            /**
            * Gets whether or not the next control in the tab order receives the focus as soon as the control is filled at the last character.
            * @returns {boolean} A value indicates whether move focus to next control when last char of control is filled.
            */
            function () {
                return this.ExitOnLastChar;
            };
            IMTextBox.prototype.SetExitOnLastChar = /**
            * Sets whether or not the next control in the tab order receives the focus as soon as the control is filled at the last character.
            * @param {boolean} isExitOnLastChar A value indicates whether move focus to next control when last char of control is filled.
            */
            function (isExitOnLastChar) {
                isExitOnLastChar = input.Utility.CheckBool(isExitOnLastChar);
                this.ExitOnLastChar = isExitOnLastChar;
            };
            IMTextBox.prototype.GetExitOnLeftRightKey = /**
            * Gets whether the focus automatically moves to the next or previous tab ordering control when pressing the left, right arrow keys.
            * @returns {ExitOnLeftRightKey} A value indicates ExitOnLeftRightKey setting.
            */
            function () {
                switch(this.ExitOnLeftRightKey) {
                    case input.ExitOnLeftRightKey.None:
                        return 'none';
                    case input.ExitOnLeftRightKey.Both:
                        return 'both';
                    case input.ExitOnLeftRightKey.Left:
                        return 'left';
                    case input.ExitOnLeftRightKey.Right:
                        return 'right';
                    default:
                }
            };
            IMTextBox.prototype.SetExitOnLeftRightKey = /**
            * Set whether the focus automatically moves to the next or previous tab ordering control when pressing the left, right arrow keys.
            * @param {ExitOnLeftRightKey} isExitOnLeftRightKey A value indicates ExitOnLeftRightKey setting.
            */
            function (isExitOnLeftRightKey) {
                //isExitOnLeftRightKey = Utility.CheckEnum(ExitOnLeftRightKey, isExitOnLeftRightKey);
                input.Utility.CheckString(isExitOnLeftRightKey);
                switch(isExitOnLeftRightKey.toLowerCase()) {
                    case 'none':
                        this.ExitOnLeftRightKey = input.ExitOnLeftRightKey.None;
                        break;
                    case 'both':
                        this.ExitOnLeftRightKey = input.ExitOnLeftRightKey.Both;
                        break;
                    case 'left':
                        this.ExitOnLeftRightKey = input.ExitOnLeftRightKey.Left;
                        break;
                    case 'right':
                        this.ExitOnLeftRightKey = input.ExitOnLeftRightKey.Right;
                        break;
                    default:
                }
            };
            IMTextBox.prototype.GetFormat = /**
            * Sets font size of control.
            * @param {string|number} fontSize
            */
            //SetFontSize(fontSize) {
            //    BaseControl.prototype.SetFontSize.call(this, fontSize);
            //    if (this.MaxLineCount !== 0) {
            //        this.InternalSetText(this.GetText());
            //    }
            //    if (this.Ellipsis !== EllipsisMode.None) {
            //        this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
            //    }
            //};
            /**
            * Gets the format string that defines the type of text allowed for input in the control.
            * @returns {string}
            */
            function () {
                return this.Format;
            };
            IMTextBox.prototype.SetFormat = /**
            * Sets the format string that defines the type of text allowed for input in the control.
            * @param {string} format
            */
            function (format) {
                format = input.Utility.CheckString(format);
                this.Format = format;
                this.UIProcess.Reset();
                //this.DropDownObj.UIProcess.Reset();
                //this.UIProcess.Filter = new TextFilter(this.AutoConvert, this.Format);
                // this.SetText(this.UIProcess.Filter.CheckText(this.GetText()).CheckedText);
                var txt = this.InternalSetText(this.GetText());
                // HelenLiu 2013/06/20 fix bug 812 in IM HTML5.
                this.Text = txt;
                this.DropDownEditData.Text = txt;
                // HelenLiu 2013/07/12 fix bug 1042 in IM HTML5.
                if(this.Ellipsis !== EllipsisMode.None) {
                    this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
                }
            };
            IMTextBox.prototype.GetHighlightText = /**
            * Gets whether to highlight the control's text on receiving input focus.
            * @returns {boolean}
            */
            function () {
                return this.HighlightText;
            };
            IMTextBox.prototype.SetHighlightText = /**
            * Sets whether to highlight the control's text on receiving input focus.
            * @param {boolean} isHighlightText
            */
            function (isHighlightText) {
                isHighlightText = input.Utility.CheckBool(isHighlightText);
                this.HighlightText = isHighlightText;
            };
            IMTextBox.prototype.GetHistoryList = /**
            * Gets history list setting of control.
            * @returns {Array}
            */
            function () {
                return this._historyList;
            };
            IMTextBox.prototype.SetHistoryList = /**
            * Sets history list setting of control.
            * @param {Array} historyList
            * @example
            * <i>gcTextBox</i>.SetHistoryList(str1,str2);
            * <i>gcTextBox</i>.SetHistoryList([str1,str2]);
            */
            function (historyList) {
                if(historyList === null) {
                    return;
                }
                var args;
                if(arguments[0] instanceof Array) {
                    args = arguments[0];
                } else {
                    args = Array.prototype.slice.call(arguments);
                }
                if(args.length === 0 || (args.length === 1 && args[0] === "")) {
                    return;
                }
                this.IsFromServer = false;
                this._historyList = [];
                for(var i = 0; i < args.length; i++) {
                    this._historyList.push(args[i]);
                }
            };
            IMTextBox.prototype.GetImeMode = /**
            * Gets the Ime Mode setting of control.
            * @returns {ImeMode}
            */
            function () {
                if(this.InputElement !== null) {
                    return this.InputElement.style.imeMode || "auto";
                }
                return "";
            };
            IMTextBox.prototype.SetImeMode = /**
            * Sets the Ime Mode setting of control.
            * @param {ImeMode} imeMode
            */
            function (imeMode) {
                //imeMode = Utility.CheckEnum(ImeMode, imeMode);
                input.Utility.CheckString(imeMode);
                if(this.InputElement !== null) {
                    this.InputElement.style.imeMode = imeMode;
                }
            };
            IMTextBox.prototype.GetLengthAsByte = /**
            * Gets whether the maximum length constraint for input is byte-based or character-based.
            * @returns {boolean}
            */
            function () {
                return this.LengthAsByte;
            };
            IMTextBox.prototype.SetLengthAsByte = /**
            * Sets whether the maximum length constraint for input is byte-based or character-based.
            * @param {boolean} isLengthAsByte
            */
            function (isLengthAsByte) {
                isLengthAsByte = input.Utility.CheckBool(isLengthAsByte);
                this.LengthAsByte = isLengthAsByte;
                this.SetText(this.UIProcess.Filter.CheckText(this.GetText()).CheckedText);
            };
            IMTextBox.prototype.GetLines = /**
            * Gets the lines of text in the control.
            * @returns {Array}
            */
            function () {
                // HelenLiu 2013/06/14 fix bug 691 in IM HTML5.
                var lines = new Array();
                var text = this.GetText();
                var sEnter = "\r\n";
                if(!input.Utility.IsIE() || input.Utility.IsIE9OrLater()) {
                    sEnter = "\n";
                }
                var index = text.IndexOf(sEnter);
                var i = 0;
                while(index != -1) {
                    lines[i++] = text.Substring(0, index);
                    text = text.Substring(index + sEnter.GetLength(), text.GetLength());
                    index = text.IndexOf(sEnter);
                }
                lines[i] = text;
                return lines;
            };
            IMTextBox.prototype.SetLines = /**
            * Sets the lines of text in the control.
            * @param {Array} lines
            * @example
            * <i>gcTextBox</i>.SetLines(str1,str2);
            * <i>gcTextBox</i>.SetLines([str1,str2]);
            */
            function (lines) {
                //if (this.GetReadOnly()) {
                //    return;
                //}
                if(lines === null) {
                    return;
                }
                var args;
                if(arguments[0] instanceof Array) {
                    args = arguments[0];
                } else {
                    args = Array.prototype.slice.call(arguments);
                }
                if(args.length === 0 || (args.length === 1 && args[0] === "")) {
                    return;
                }
                this._lines = [];
                for(var k = 0; k < args.length; k++) {
                    this._lines.push(args[k]);
                }
                var text = "";
                if(this.MultiLine) {
                    for(var i = 0; i < this._lines.length; i++) {
                        if(i > 0) {
                            if(!input.Utility.IsIE()) {
                                text += "\n";
                            } else {
                                text += "\r\n";
                            }
                        }
                        text += this._lines[i];
                    }
                } else {
                    for(var i = 0; i < this._lines.length; i++) {
                        text += this._lines[i];
                    }
                }
                this.SetText(text);
            };
            IMTextBox.prototype.GetMaxHistoryCount = /**
            * Gets max history count of the history item.
            * @returns {number}
            */
            function () {
                return this.MaxHistoryCount;
            };
            IMTextBox.prototype.SetMaxHistoryCount = /**
            * Gets or sets max history count of the history item.
            * @param {number} maxHistoryCount
            */
            function (maxHistoryCount) {
                maxHistoryCount = input.Utility.CheckInt(maxHistoryCount);
                // HelenLiu 2013/07/10 fix bug 1036 in IM HTML5.0.
                if(maxHistoryCount < 0) {
                    throw "ArgumentOutOfRangeException";
                }
                this.MaxHistoryCount = maxHistoryCount;
            };
            IMTextBox.prototype.GetMaxLength = /**
            * Gets the maximum length of text that can be input in the control.
            * @returns {number}
            */
            function () {
                return this.MaxLength;
            };
            IMTextBox.prototype.SetMaxLength = /**
            * Sets the maximum length of text that can be input in the control.
            * @param {number} maxLength
            */
            function (maxLength) {
                maxLength = input.Utility.CheckInt(maxLength);
                // HelenLiu 2013/06/09 fix bug 644 in IM HTML5.0.
                if(maxLength < 0) {
                    throw "ArgumentOutOfRangeException";
                }
                this.MaxLength = maxLength;
                this.InternalSetText(this.GetText());
                // HelenLiu 2013/07/12 fix bug 1042 in IM HTML5.
                if(this.Ellipsis !== EllipsisMode.None) {
                    this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
                }
                // HelenLiu 2013/07/22 fix bug 1121 in IM HTML5.
                this.DropDownEditData.Text = this.GetText();
            };
            IMTextBox.prototype.GetMaxLineCount = /**
            * Gets the max count of lines can be input into the control.
            * @returns {number}
            */
            function () {
                return this.MaxLineCount;
            };
            IMTextBox.prototype.SetMaxLineCount = /**
            * Sets the max count of lines can be input into the control.
            * @param {number} maxLineCount
            */
            function (maxLineCount) {
                maxLineCount = input.Utility.CheckInt(maxLineCount);
                if(maxLineCount < 0) {
                    throw "ArgumentOutOfRangeException";
                }
                this.MaxLineCount = maxLineCount;
                this.InternalSetText(this.GetText());
                if(this.Ellipsis !== EllipsisMode.None) {
                    this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
                }
            };
            IMTextBox.prototype.GetMultiLine = /**
            * Gets whether this is a multiline control.
            * @returns {boolean}
            */
            function () {
                return this.MultiLine;
            };
            IMTextBox.prototype.SetMultiLine = /**
            * Sets whether this is a multiline control.
            * @param {boolean} isMultiLine
            */
            function (isMultiLine) {
                isMultiLine = input.Utility.CheckBool(isMultiLine);
                if(isMultiLine === this.MultiLine) {
                    return;
                }
                this.MultiLine = isMultiLine;
                //this._render._reCreate();
                // HelenLiu 2013/06/19 fix bug 717 in IM HTML5.
                //this.AddAllEventsHandler();
                // HelenLiu 2013/06/19 fix bug 728 in IM HTML5.
                this.InternalDirectSetText(this.Text);
                this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
                // Frank Liu comments at 2013/08/28.
                //if (this.MultiLine === true) {
                //    this._CheckScrollBar(this.GetScrollBars(), this.GetScrollBarMode());
                //}
                //this.ProcessFishEyeButtonOnLostFocus(true);
                this.DropDownEditData.Text = this.GetText();
            };
            IMTextBox.prototype.GetOverflowTip = //GcTextBox.DefaultMultiLineWidth = 178;
            //GcTextBox.DefaultMultiLineHeight = 36;
            /**
            * Gets whether display the overflow tip.
            * @returns {boolean}
            */
            function () {
                return this.OverflowTip;
            };
            IMTextBox.prototype.SetOverflowTip = /**
            * Sets whether display the overflow tip.
            * @param {boolean} isShowOverflowTip
            */
            function (isShowOverflowTip) {
                isShowOverflowTip = input.Utility.CheckBool(isShowOverflowTip);
                this.OverflowTip = isShowOverflowTip;
            };
            IMTextBox.prototype.GetOverwrite = /**
            * Gets whether the contents of the control are overwritten.
            * @returns {boolean}
            */
            function () {
                return this.Overwrite;
            };
            IMTextBox.prototype.GetPasswordChar = /**
            * Gets the password char.
            * @returns {string}
            */
            function () {
                return this.PasswordChar;
            };
            IMTextBox.prototype.SetPasswordChar = /**
            * Sets the password char.
            * @param {string} passwordChar
            */
            function (passwordChar) {
                if(passwordChar !== "") {
                    passwordChar = input.Utility.CheckChar(passwordChar);
                    if(this.PasswordChar === this.SystemPasswordChar() && this.GetUseSystemPasswordChar()) {
                        this.LastPassWordChar = passwordChar;
                        return;
                    }
                    this.LastPassWordChar = this.PasswordChar;
                    this.PasswordChar = passwordChar;
                    this.PasswordMode = true;
                    //this.SetText(this.UIProcess.Filter.CheckText(this.GetText()).CheckedText);
                    if(!this.isNullText) {
                        this.InternalSetText(this.GetText());
                    }
                    this.tempIMEMode = this.GetImeMode();
                    this.SetImeMode(ImeMode.Disabled);
                } else {
                    if(this.UseSystemPasswordChar === false) {
                        this.PasswordMode = false;
                        //this.switchPasswordChar = true;
                        this.SetText(this.hideText);
                        //this.InternalSetText(this.GetText());
                        if(this.tempIMEMode !== "") {
                            this.SetImeMode(this.tempIMEMode);
                        }
                    }
                    if(this.PasswordChar === this.SystemPasswordChar() && !this.GetUseSystemPasswordChar() && this.LastPassWordChar !== "") {
                        this.PasswordChar = input.Utility.CheckChar(this.LastPassWordChar);
                        this.PasswordMode = true;
                        this.InternalSetText(this.GetText());
                        this.tempIMEMode = this.GetImeMode();
                        this.SetImeMode(ImeMode.Disabled);
                        if(this.Ellipsis !== EllipsisMode.None) {
                            this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
                        }
                        return;
                    }
                    this.PasswordChar = passwordChar;
                }
                // HelenLiu 2013/07/26 fix bug 1105 in IM HTML5.
                this.switchPasswordChar = true;
                this.UIProcess.Reset();
                //this.DropDownObj.UIProcess.Reset();
                if(this.Ellipsis !== EllipsisMode.None) {
                    this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
                }
            };
            IMTextBox.prototype.GetReadingImeStringOutputMode = /**
            * Gets whether the new result string is to append or replace the former text.
            * @returns {string}
            */
            function () {
                return this.ReadingImeStringOutput.OutputMode;
            };
            IMTextBox.prototype.SetReadingImeStringOutputMode = /**
            * Sets whether the new result string is to append or replace the former text.
            * @param {string} outputMode
            */
            function (outputMode) {
                outputMode = input.Utility.CheckString(outputMode);
                this.ReadingImeStringOutput.OutputMode = outputMode;
            };
            IMTextBox.prototype.GetReadingImeStringOutputTargetControl = /**
            * Gets in which control the result string will be shown.
            * @returns {string}
            */
            function () {
                return this.ReadingImeStringOutput.TargetControl;
            };
            IMTextBox.prototype.SetReadingImeStringOutputTargetControl = /**
            * Sets in which control the result string will be shown.
            * @param {string} targetControl
            */
            function (targetControl) {
                targetControl = input.Utility.CheckString(targetControl);
                this.ReadingImeStringOutput.TargetControl = targetControl;
            };
            IMTextBox.prototype.GetReadOnly = /**
            * Gets whether the contents of the control can be changed.
            * @returns {boolean}
            */
            function () {
                return this.ReadOnly;
            };
            IMTextBox.prototype.SetReadOnly = /**
            * Sets whether the contents of the control can be changed.
            * @param {boolean} isReadOnly
            */
            function (isReadOnly) {
                isReadOnly = input.Utility.CheckBool(isReadOnly);
                if(this.InputElement != null) {
                    this.InputElement.readOnly = isReadOnly;
                }
                this.ReadOnly = isReadOnly;
                if(this.IsFromServer) {
                    this.EnableAutoComplete = this.ShowHistory && (this.AutoCompleteType != "Disabled") && !this.ReadOnly && isReadOnly;
                } else {
                    this.EnableAutoComplete = this.ShowHistory && !this.ReadOnly && isReadOnly;
                }
            };
            IMTextBox.prototype.GetScrollBarMode = /**
            * Gets or sets whether scroll bars are always displayed or only when needed.
            * @returns {ScrollBarMode}
            */
            function () {
                return this.ScrollBarMode;
            };
            IMTextBox.prototype.SetScrollBarMode = /**
            * Gets or sets whether scroll bars are always displayed or only when needed.
            * @param {ScrollBarMode} scrollBarMode
            */
            function (scrollBarMode) {
                scrollBarMode = input.Utility.CheckEnum(input.ScrollBarMode, scrollBarMode);
                this.ScrollBarMode = scrollBarMode;
                this._CheckScrollBar(this.GetScrollBars(), scrollBarMode);
            };
            IMTextBox.prototype.GetScrollBars = /**
            * Gets which scroll bars should appear in a multiple line edit control.
            * @returns {ScrollBars}
            */
            function () {
                return this.ScrollBars;
            };
            IMTextBox.prototype.SetScrollBars = /**
            * Sets which scroll bars should appear in a multiple line edit control.
            * @param {ScrollBars} scrollBarType
            */
            function (scrollBarType) {
                scrollBarType = input.Utility.CheckEnum(input.ScrollBars, scrollBarType);
                this.ScrollBars = scrollBarType;
                this._CheckScrollBar(scrollBarType, this.GetScrollBarMode());
                //Following code just for Re-Layout. Because WordWrap can't refersh correctly.
                var w = this.InputElement.style.width;
                this.InputElement.style.width = (parseInt(this.InputElement.style.width) - 5) + "px";
                var self = this;
                setTimeout(function () {
                    self.InputElement.style.width = w;
                }, 10);
            };
            IMTextBox.prototype.GetSelectionStart = /**
            * Gets the position in the text where the selection starts.
            * @returns {number}
            */
            function () {
                return Math.min(this.SelectionStart, this.SelectionEnd);
            };
            IMTextBox.prototype.SetSelectionStart = /**
            * Sets the position in the text where the selection starts.
            * @param {number} selectionStart
            */
            function (selectionStart) {
                selectionStart = input.Utility.CheckInt(selectionStart);
                if(selectionStart < 0) {
                    throw "ArgumentOutOfRangeException";
                }
                if(selectionStart == null) {
                    return;
                }
                var sCursorPosition = selectionStart.toString();
                var cursorPosition = parseInt(sCursorPosition);
                if(input.Utility.FilterText("0123456789", sCursorPosition) != sCursorPosition) {
                    //throw "Invalid Position";
                                    } else {
                    if(cursorPosition > this.GetText().GetLength()) {
                        this.SelectionStart = this.GetText().GetLength();
                        this.SelectionEnd = this.GetText().GetLength();
                        if(!this.MultiLine) {
                            this.DropDownEditData.SelectionStart = this.DropDownEditData.Text.GetLength();
                            this.DropDownEditData.SelectionEnd = this.DropDownEditData.Text.GetLength();
                        }
                    } else {
                        var selectionLength = this.GetSelectionLength();
                        this.SelectionStart = cursorPosition;
                        if(!this.MultiLine) {
                            this.DropDownEditData.SelectionStart = this.GetMultiPosition(this.DropDownEditData.Text, cursorPosition);
                        }
                        if((cursorPosition - 0) + selectionLength <= this.GetText().GetLength()) {
                            this.SelectionEnd = (cursorPosition - 0) + selectionLength;
                            if(!this.MultiLine) {
                                this.DropDownEditData.SelectionEnd = this.GetMultiPosition(this.DropDownEditData.Text, cursorPosition + selectionLength);
                            }
                        } else {
                            this.SelectionEnd = this.GetText().GetLength();
                            if(!this.MultiLine) {
                                this.DropDownEditData.SelectionEnd = this.DropDownEditData.Text.GetLength();
                            }
                        }
                    }
                }
            };
            IMTextBox.prototype.GetSelectedText = /**
            * Gets the selected text.
            * @returns {string}
            */
            function () {
                return this.GetText().Substring(Math.min(this.SelectionStart, this.SelectionEnd), Math.max(this.SelectionStart, this.SelectionEnd));
            };
            IMTextBox.prototype.SetSelectedText = /**
            * Sets the selected text.
            * @param {string} text
            */
            function (text) {
                text = input.Utility.CheckString(text);
                this.OldText = this.GetText();
                var start = this.SelectionStart;
                var end = this.SelectionEnd;
                var oldtext = this.GetText();
                if(!this.MultiLine) {
                    this.DropDownEditData.OldText = this.DropDownEditData.Text;
                    start = this.DropDownEditData.SelectionStart;
                    end = this.DropDownEditData.SelectionEnd;
                    oldtext = this.DropDownEditData.Text;
                }
                var retInfo = this.UIProcess.TextBoxPaste(start, end, oldtext, this.ExitOnLastChar, this.AcceptTab, this.AcceptReturn, this.MaxLength, this.LengthAsByte, this.MaxLineCount, this.CountWrappedLine, this.MultiLine, text, true);
                if(retInfo == null) {
                }
                if(retInfo.Text != null) {
                    // Add comments by Yang at 13:30 January 31th 2008
                    // For fix the bug 9623
                    //this.InternalSetText(retInfo.Text, true);
                    this.DirectSetText(retInfo.Text);
                    if(!this.MultiLine) {
                        this.DropDownEditData.Text = retInfo.Text;
                    }
                    // End by Yang
                                    }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionStart = retInfo.SelectionStart;
                        this.SelectionStart = this.GetSingleCurPosition(this.DropDownEditData.Text, retInfo.SelectionStart);
                    }
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionEnd = retInfo.SelectionEnd;
                        this.SelectionEnd = this.GetSingleCurPosition(this.DropDownEditData.Text, retInfo.SelectionEnd);
                    }
                }
                var oldText = this.OldText;
                this.OldText = this.GetText();
                this.LastText = this.OldText;
                this.DropDownEditData.OldText = this.DropDownEditData.Text;
                this.DropDownEditData.LastText = this.DropDownEditData.OldText;
                //// Add comments by Yang at 10:24 October 12th 2007
                //// For fix the bug 9019
                //this.SetLastClientValues();
                //// End by Yang
                // Frank Liu removed, to fire 'textChanged' event in SetHideText(). 2013/09/1, for wijinputtext.
                //if (this.GetText() != oldText && this.TextChangedEvent != "" && this.TextChangedEvent != null) {
                //    //Add comments by Ryan Wu at 10:42 Apr. 5 2007.
                //    //For support Aspnet Ajax 1.0.
                //    //this.UIProcess.FireEvent(this, this.TextChanged, null);
                //    this.UIProcess.FireEvent(this, this.TextChangedEvent, null, "TextChanged");
                //    //end by Ryan Wu.
                //}
                // HelenLiu 2013/07/08 fix bug 998 in IM HTML5.
                if(this.Ellipsis !== EllipsisMode.None) {
                    this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
                }
            };
            IMTextBox.prototype.GetSelectionLength = /**
            * Gets the length, the number of characters, of the selection.
            * @returns {number}
            */
            function () {
                return Math.abs(this.SelectionEnd - this.SelectionStart);
            };
            IMTextBox.prototype.SetSelectionLength = /**
            * Sets the length, the number of characters, of the selection.
            * @param {number} length
            */
            function (length) {
                length = input.Utility.CheckInt(length);
                if(length < 0) {
                    throw "ArgumentOutOfRangeException";
                }
                if(length == null) {
                }
                length = length.toString();
                if(input.Utility.FilterText("0123456789", length) != length) {
                    //throw "Invalid Length";
                                    } else {
                    var startCursorPosition = this.GetSelectionStart();
                    this.SelectionStart = startCursorPosition;
                    if(startCursorPosition + (length - 0) <= this.GetText().GetLength()) {
                        this.SelectionEnd = startCursorPosition + (length - 0);
                        if(!this.MultiLine) {
                            //modified by sj 2008.8.11 for bug 140
                            //this.DropDownEditData.SelectionEnd = this.GetMultiPosition(this.DropDownEditData.Text, startCursorPosition + length);
                            this.DropDownEditData.SelectionEnd = this.GetMultiPosition(this.DropDownEditData.Text, startCursorPosition + parseInt(length));
                            //end by sj
                                                    }
                    } else {
                        this.SelectionEnd = this.GetText().GetLength();
                        if(!this.MultiLine) {
                            this.DropDownEditData.SelectionEnd = this.DropDownEditData.Text.GetLength();
                        }
                    }
                }
            };
            IMTextBox.prototype.GetShowHistory = /**
            * Gets whether show history of control.
            * @returns {boolean}
            */
            function () {
                return this.ShowHistory;
            };
            IMTextBox.prototype.SetShowHistory = /**
            * Sets whether show history of control.
            * @param {boolean} isShowHistory
            */
            function (isShowHistory) {
                isShowHistory = input.Utility.CheckBool(isShowHistory);
                this.ShowHistory = isShowHistory;
                if(this.IsFromServer) {
                    this.EnableAutoComplete = this.ShowHistory && (this.AutoCompleteType != "Disabled") && !this.ReadOnly && this.Enabled;
                } else {
                    this.EnableAutoComplete = this.ShowHistory && !this.ReadOnly && this.Enabled;
                }
            };
            IMTextBox.prototype.GetText = /**
            * Gets the text.
            * @returns {string}
            */
            function () {
                var strContent = this._getInputValueWithPlaceHolder();
                //modified by sj 2008.8.8 for bug 99
                if(this.isTextEllipsis && !this.DragEdit)//end by sj
                 {
                    strContent = this.Text;
                }
                //		if ((!this.UseSystemPasswordChar && this.PasswordMode) || (this.MultiLine && this.UseSystemPasswordChar))
                if(this.PasswordMode) {
                    var temp = this.hideText;
                    var index = temp.LastIndexOf(":true");
                    var strText;
                    if(index == -1) {
                        strText = temp;
                    } else {
                        strText = temp.Substring(0, index);
                    }
                    //modified by sj 2008.8.11 for bug 234
                    //if (strText.GetLength() == strContent.GetLength())
                    //{
                    return strText;
                    //}
                    //end by sj
                                    }
                //add by sj
                if(!input.Utility.IsIE() && this.FFDragFlag) {
                    strContent = this.Text;
                }
                //end by sj
                return strContent;
            };
            IMTextBox.prototype.SetText = /**
            * Sets the text.
            * @param {string} text
            */
            function (text) {
                text = input.Utility.CheckString(text);
                this.OldText = this.GetText();
                // HelenLiu 2013/07/26 fix bug 1105 in IM HTML5.
                this.switchPasswordChar = false;
                this.InternalSetText(text, false);
                //modified by sj 2008.8.12 for bug 294
                //if enable is false and the text is invalid.
                //		if (!this.Enabled&&!this.UIProcess.isInputValid)
                //		{
                //			this.InternalSetText(this.OldText, false);
                //			return;
                //		}
                //end by sj.
                if(this.GetText() != this.OldText) {
                    // Add comments by Yang at 10:12 May 31st 2007
                    // For fix bug 8313
                    this.OldText = this.GetText();
                    // Add comments by Yang at 14:35 August 7th 2007
                    // For improve the performance for v2h1
                    this.SetHideText(this.GetText());
                    //this.UIUpdate.SetHideText(this.GetText() + ":true");
                    // End by Yang
                    // End by Yang
                    //Add comments by Ryan Wu at 10:42 Apr. 5 2007.
                    //For support Aspnet Ajax 1.0.
                    //this.UIProcess.FireEvent(this, this.TextChanged, null);
                    // HelenLiu 2013/07/26 fix bug 1105 in IM HTML5.
                    //if (!this.switchPasswordChar) {
                    //if ( this.TextChanged != "") {
                    //    this.UIProcess.FireEvent(this, this.TextChanged, null, "TextChanged");
                    // }
                    //    this.switchPasswordChar = false;
                    //}
                    //end by Ryan Wu.
                                    }
                //this.OldText = this.GetText();
                this.LastText = this.GetText();
                //modified by sj for bug NKOI-355DB4B2D from Japan(bug 2951)
                //this.SelectionStart = 0;
                //this.SelectionEnd = 0;
                var length = this.GetText().GetLength();
                this.SelectionStart = length;
                this.SelectionEnd = length;
                //end by sj
                //Modified by shenyuan at 2006-02-21 for bug #5303.
                this.BuffText = this.LastText;
                // Add for DropDown Edit
                this.DropDownEditData.Text = this.GetText();
                //this.DropDownEditData.OldText = this.DropDownEditData.Text;
                this.DropDownEditData.LastText = this.DropDownEditData.Text;
                //modified by sj for bug NKOI-355DB4B2D from Japan(bug 2951)
                //this.DropDownEditData.SelectionStart = 0;
                //this.DropDownEditData.SelectionEnd = 0;
                this.DropDownEditData.SelectionStart = length;
                this.DropDownEditData.SelectionEnd = length;
                //end by sj
                this.DropDownEditData.BuffText = this.DropDownEditData.Text;
                //// Add comments by Yang at 16:34 October 11th 2007
                //// For fix bug 9006
                //this.SetLastClientValues();
                // HelenLiu 2013/07/08 fix bug 998 in IM HTML5.
                if(this.Ellipsis !== EllipsisMode.None) {
                    this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
                }
            };
            IMTextBox.prototype.GetTouchDropDownScale = /**
            * Gets a value indicates the zoom factor of the drop-down control and history list when open them by touch device.
            * @returns {number} An integer between 1-4 indicates the four zoom levels.
            */
            function () {
                return this.TouchDropDownScale;
            };
            IMTextBox.prototype.SetTouchDropDownScale = /**
            * Sets a value indicates the zoom factor of the drop-down control and history list when open them by touch device.
            * @param {number} ScaleRate An integer between 1-4 indicates the four zoom levels.
            */
            function (ScaleRate) {
                ScaleRate = input.Utility.CheckFloat(ScaleRate, 0.25, 4);
                this.TouchDropDownScale = ScaleRate;
            };
            IMTextBox.prototype.GetUseClipboard = /**
            * Gets whether copy, cut or paste the data to or from the clipboard when control are selected.
            * @returns {boolean}
            */
            function () {
                //if (this.ContextMenu.IsShow()) {
                //    // When context menu is show on firefox and chrome, we don't use the clipboard do the cut/copy/paste.
                //    if (!Utility.IsIE()) {
                //        return false;
                //    }
                //}
                // HelenLiu 2013/06/19 fix bug 739 in IM HTML5.
                return this.UseClipboard;
            };
            IMTextBox.prototype.SetUseClipboard = /**
            * Sets whether copy, cut or paste the data to or from the clipboard when control are selected.
            * @param {boolean} isUseClipboard
            */
            function (isUseClipboard) {
                isUseClipboard = input.Utility.CheckBool(isUseClipboard);
                // HelenLiu 2013/06/19 fix bug 739 in IM HTML5.
                this.UseClipboard = isUseClipboard;
            };
            IMTextBox.prototype.GetUseSystemPasswordChar = /**
            * Gets whether to use system password character.
            * @returns {boolean}
            */
            function () {
                return this.UseSystemPasswordChar;
            };
            IMTextBox.prototype.SetUseSystemPasswordChar = /**
            * Sets whether to use system password character.
            * @param {boolean} isUseSystemPasswordChar
            */
            function (isUseSystemPasswordChar) {
                isUseSystemPasswordChar = input.Utility.CheckBool(isUseSystemPasswordChar);
                this.UseSystemPasswordChar = isUseSystemPasswordChar;
                if(isUseSystemPasswordChar === true) {
                    this.PasswordMode = true;
                    this.SetPasswordChar(this.SystemPasswordChar());
                } else {
                    this.SetPasswordChar("");
                }
                this.UIProcess.Reset();
                //this.DropDownObj.UIProcess.Reset();
                            };
            IMTextBox.prototype.GetWordWrap = /**
            * Gets whether the control automatically wraps words to the beginning of the next line when necessary.
            * @returns {boolean}
            */
            function () {
                return this.WordWrap;
            };
            IMTextBox.prototype.SetWordWrap = /**
            * Sets whether the control automatically wraps words to the beginning of the next line when necessary.
            * @param {boolean} isWordWrap
            */
            function (isWordWrap) {
                isWordWrap = input.Utility.CheckBool(isWordWrap);
                this.WordWrap = isWordWrap;
                if(isWordWrap === false) {
                    this.InputElement.style.wordWrap = "normal";
                } else {
                    this.InputElement.style.wordWrap = "break-word";
                }
                // HelenLiu 2013/06/09 fix bug 658 in IM HTML5.0.
                //Following code just for Re-Layout. Because WordWrap can't refersh correctly.
                var w = this.InputElement.style.width;
                this.InputElement.style.width = (parseInt(this.InputElement.style.width) - 5) + "px";
                var self = this;
                setTimeout(function () {
                    self.InputElement.style.width = w;
                }, 10);
                this._CheckScrollBar(this.GetScrollBars(), this.GetScrollBarMode());
            };
            IMTextBox.prototype.Drop = //#endregion
            //#region Public Methods
            /**
            *  Displays the drop-down edit box.
            */
            function () {
                //// HelenLiu 2013/07/26 fix bug 997 in IM HTML5.
                //if (this.GetDroppedDown()) {
                //    this.DropDownObj.Close(true, true);
                //} else {
                //    // Terry fix IM Web 7.0 bug 844 in 2012/10/31
                //    if (Utility.IsIE9OrLater()) {
                //        if (this.GetDropDownEnabled()) {
                //            this.SetInnerFocus();
                //        }
                //        var thisObj = this;
                //        // HelenLiu 2013/07/12 fix bug 1045 in IM HTML5.
                //        // setTimeout(function () {
                //        thisObj.DropReal();
                //        // }, 0);
                //    }
                //    else {
                //        this.DropReal();
                //    }
                //}
                ////return this;
                            };
            IMTextBox.prototype.Clear = /**
            *  Clears the content of the control.
            */
            function () {
                this.SetText("");
            };
            IMTextBox.prototype.SetFocus = /**
            * Set focus on the control.
            */
            function () {
                //this.UIUpdate.SetFocus();
                            };
            IMTextBox.prototype.OnDropDownClose = //#endregion
            //#region ClientEvents
            /**
            * Raises the DropDownClose event.
            * @param {function|string} callBack
            */
            function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.DropDownCloseEvent = callBack;
            };
            IMTextBox.prototype.OnDropDownOpen = /**
            * Raises the DropDownOpen event.
            * @param {function|string} callBack
            */
            function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.DropDownOpenEvent = callBack;
            };
            IMTextBox.prototype.OnEditStatusChanged = /**
            * Occurs when the edit status has changed.
            * @param {function|string} callBack
            */
            function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.EditStatusChangedEvent = callBack;
            };
            IMTextBox.prototype.OnInvalidInput = /**
            * Occurs when the input is invalid.
            * @param {function|string} callBack
            */
            function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.InvalidInputEvent = callBack;
                this.UIProcess.InvalidInputEvent = callBack;
            };
            IMTextBox.prototype.OnKeyExit = /**
            * Occurs when the key exit.
            * @param {function|string} callBack
            */
            function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.KeyExitEvent = callBack;
            };
            IMTextBox.prototype.OnTextChanged = /**
            * Occurs when the text has changed.
            * @param {function|string} callBack
            */
            function (callBack) {
                callBack = input.Utility.CheckFunction(callBack);
                this.TextChangedEvent = callBack;
            };
            IMTextBox.prototype.Undo = function () {
                var text = this.GetText();
                var bufftext = this.BuffText;
                var lasttext = this.LastText;
                var lastselectionstart = this.LastSelectionStart;
                var lastselectionend = this.LastSelectionEnd;
                if(!this.MultiLine) {
                    //  selectionstart = this.DropDownEditData.SelectionStart;
                    //  selectionend = this.DropDownEditData.SelectionEnd;
                    text = this.DropDownEditData.Text;
                    bufftext = this.DropDownEditData.BuffText;
                    lasttext = this.DropDownEditData.LastText;
                    lastselectionstart = this.DropDownEditData.LastSelectionStart;
                    lastselectionend = this.DropDownEditData.LastSelectionEnd;
                }
                // Modified by shenyuan at 2006-01-16.
                // Add an argument this.BuffText for it.
                var retInfo = this.UIProcess.TextBoxUndo(text, bufftext, lasttext, lastselectionstart, lastselectionend);
                if(retInfo == null) {
                    return false;
                }
                if(retInfo.Text != null) {
                    // Modified by shenyuan at 2006-01-16.
                    if(retInfo.DelInclude) {
                        this.BuffText = this.Text;
                        // Added by shenyuan at 2006-01-17 for bug #4989
                        this.IsUndoAfterDel = true;
                        if(!this.MultiLine) {
                            this.DropDownEditData.BuffText = this.DropDownEditData.Text;
                        }
                    } else {
                        this.LastText = this.Text;
                        if(!this.MultiLine) {
                            this.DropDownEditData.LastText = this.DropDownEditData.Text;
                        }
                    }
                    this.InternalSetText(retInfo.Text, true);
                }
                if(retInfo.SelectionStart != null) {
                    this.LastSelectionStart = this.SelectionStart;
                    this.SelectionStart = retInfo.SelectionStart;
                    if(!this.MultiLine) {
                        this.DropDownEditData.LastSelectionStart = this.DropDownEditData.SelectionStart;
                        this.DropDownEditData.SelectionStart = this.SelectionStart;
                        this.SelectionStart = this.GetSingleCurPosition(retInfo.Text, retInfo.SelectionStart);
                    }
                }
                if(retInfo.SelectionEnd != null) {
                    this.LastSelectionEnd = this.SelectionEnd;
                    this.SelectionEnd = retInfo.SelectionEnd;
                    if(!this.MultiLine) {
                        this.DropDownEditData.LastSelectionEnd = this.DropDownEditData.SelectionEnd;
                        this.DropDownEditData.SelectionEnd = this.SelectionEnd;
                        this.SelectionEnd = this.GetSingleCurPosition(retInfo.Text, retInfo.SelectionEnd);
                    }
                }
                if(retInfo.SetSelection == true) {
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                }
            };
            IMTextBox.prototype.Cut = function () {
                var selectionstart = this.SelectionStart;
                var selectionend = this.SelectionEnd;
                var text = this.GetText();
                if(!this.MultiLine) {
                    selectionstart = this.DropDownEditData.SelectionStart;
                    selectionend = this.DropDownEditData.SelectionEnd;
                    text = this.DropDownEditData.Text;
                }
                var retInfo = this.UIProcess.Cut(text, selectionstart, selectionend);
                if(retInfo == null) {
                    return false;
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionStart = this.SelectionStart;
                        this.SelectionStart = this.GetSingleCurPosition(retInfo.Text, retInfo.SelectionStart);
                    }
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionEnd = this.SelectionEnd;
                        this.SelectionEnd = this.GetSingleCurPosition(retInfo.Text, retInfo.SelectionEnd);
                    }
                }
                // Added by shenyuan at 2006-02-27 for bug #5385.
                if(retInfo.DelInclude) {
                    this.IsUndoAfterDel = true;
                    this.BuffText = this.GetText();
                    if(!this.MultiLine) {
                        this.DropDownEditData.BuffText = this.DropDownEditData.Text;
                    }
                }
                // Ended.
                if(retInfo.Text != null) {
                    // Add comments by Yang at 13:31 January 31th 2008
                    // For fix the bug 9623
                    //this.InternalSetText(retInfo.Text, true);
                    this.DirectSetText(retInfo.Text);
                    if(!this.MultiLine) {
                        this.DropDownEditData.Text = retInfo.Text;
                    }
                    // End by Yang
                                    }
                if(retInfo.SetSelection == true) {
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                }
                if(retInfo.EventInfo != null) {
                    //Add comments by Ryan Wu at 11:30 Apr. 5 2007.
                    //For support Aspnet Ajax 1.0.
                    //this.UIProcess.FireEvent(this, retInfo.EventInfo.Name, retInfo.EventInfo.Args);
                    this.UIProcess.FireEvent(this, retInfo.EventInfo.Name, retInfo.EventInfo.Args, retInfo.EventInfo.Type);
                    //end by Ryan Wu.
                                    }
            };
            IMTextBox.prototype.Copy = function () {
                //this.UIProcess.Copy(this.GetClipContent(), this.SelectionStart, this.SelectionEnd);
                if(!this.PasswordMode) {
                    this.UIProcess.Copy(this.GetText(), this.SelectionStart, this.SelectionEnd);
                }
            };
            IMTextBox.prototype.Delete = function () {
                var selectionstart = this.SelectionStart;
                var selectionend = this.SelectionEnd;
                var text = this.GetText();
                if(!this.MultiLine) {
                    selectionstart = this.DropDownEditData.SelectionStart;
                    selectionend = this.DropDownEditData.SelectionEnd;
                    text = this.DropDownEditData.Text;
                }
                var retInfo = this.UIProcess.Delete(this.MultiLine, text, selectionstart, selectionend);
                if(retInfo == null) {
                    return false;
                }
                // Added by shenyuan at 2006-02-27 for bug #5385.
                if(retInfo.DelInclude) {
                    this.BuffText = this.Text;
                    this.IsUndoAfterDel = true;
                    if(!this.MultiLine) {
                        this.DropDownEditData.BuffText = this.DropDownEditData.Text;
                    }
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionStart = this.SelectionStart;
                        this.SelectionStart = this.GetSingleCurPosition(retInfo.Text, retInfo.SelectionStart);
                    }
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionEnd = this.SelectionEnd;
                        this.SelectionEnd = this.GetSingleCurPosition(retInfo.Text, retInfo.SelectionEnd);
                    }
                }
                if(retInfo.Text != null) {
                    // Add comments by Yang at 13:31 January 31th 2008
                    // For fix the bug 9623
                    //this.InternalSetText(retInfo.Text, true);
                    this.DirectSetText(retInfo.Text);
                    if(!this.MultiLine) {
                        this.DropDownEditData.Text = retInfo.Text;
                    }
                    // End by Yang
                                    }
                if(retInfo.SetSelection == true) {
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                }
            };
            IMTextBox.prototype.Paste = function (clipboardtext) {
                var selectionstart = this.SelectionStart;
                var selectionend = this.SelectionEnd;
                var text = this.GetText();
                if(!this.MultiLine) {
                    selectionstart = this.DropDownEditData.SelectionStart;
                    selectionend = this.DropDownEditData.SelectionEnd;
                    text = this.DropDownEditData.Text;
                }
                var retInfo = this.UIProcess.TextBoxPaste(selectionstart, selectionend, text, this.ExitOnLastChar, this.AcceptTab, this.AcceptReturn, this.MaxLength, this.LengthAsByte, this.MaxLineCount, this.CountWrappedLine, this.MultiLine, clipboardtext, false);
                if(retInfo == null) {
                    return false;
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionStart = this.SelectionStart;
                        this.SelectionStart = this.GetSingleCurPosition(retInfo.Text, retInfo.SelectionStart);
                    }
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionEnd = this.SelectionEnd;
                        this.SelectionEnd = this.GetSingleCurPosition(retInfo.Text, retInfo.SelectionEnd);
                    }
                }
                if(retInfo.Text != null) {
                    // Add comments by Yang at 13:29 January 31th 2008
                    // For fix the bug 9623
                    //this.InternalSetText(retInfo.Text, true);
                    this.DirectSetText(retInfo.Text);
                    if(!this.MultiLine) {
                        this.DropDownEditData.Text = retInfo.Text;
                    }
                    // End by Yang
                                    }
                if(retInfo.SetSelection == true) {
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                }
                if(retInfo.EventInfo != null) {
                    for(var i = 0; i < retInfo.EventInfo.length; i++) {
                        if(retInfo.EventInfo[i] != null) {
                            //Add comments by Ryan Wu at 10:42 Apr. 5 2007.
                            //For support Aspnet Ajax 1.0.
                            //this.UIProcess.FireEvent(this, retInfo.EventInfo[i].Name, retInfo.EventInfo[i].Args);
                            this.UIProcess.FireEvent(this, retInfo.EventInfo[i].Name, retInfo.EventInfo[i].Args, retInfo.EventInfo[i].Type);
                            //end by Ryan Wu.
                                                    }
                    }
                }
            };
            IMTextBox.prototype.SelectAll = function () {
                var text = this.GetText();
                if(!this.MultiLine) {
                    text = this.DropDownEditData.Text;
                }
                var retInfo = this.UIProcess.TextBoxSelectAll(text);
                if(retInfo == null) {
                    return false;
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionStart = this.SelectionStart;
                        this.SelectionStart = this.GetSingleCurPosition(text, retInfo.SelectionStart);
                    }
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionEnd = this.SelectionEnd;
                        this.SelectionEnd = this.GetSingleCurPosition(text, retInfo.SelectionEnd);
                    }
                }
                if(retInfo.SetSelection == true) {
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                }
            };
            IMTextBox.prototype._CheckScrollBar = //#endregion
            //#region Private Methods
            function (scrollbars, scrollbarmode) {
                switch(scrollbars) {
                    case input.ScrollBars.Both:
                        if(scrollbarmode == input.ScrollBarMode.Automatic) {
                            //str_Style += "overflow-x: auto;overflow-y: auto;";
                            this.InputElement.style.overflowX = "auto";
                            this.InputElement.style.overflowY = "auto";
                        } else {
                            //str_Style += wordWrap ? "overflow-x: auto;" : "overflow-x: scroll;";
                            //str_Style += "overflow-y: scroll;";
                            this.InputElement.style.overflowX = this.GetWordWrap() ? "auto" : "scroll";
                            this.InputElement.style.overflowY = "scroll";
                        }
                        break;
                    case input.ScrollBars.None:
                        //str_Style += "overflow-x: hidden;overflow-y: hidden;";
                        this.InputElement.style.overflowX = "hidden";
                        this.InputElement.style.overflowY = "hidden";
                        break;
                    case input.ScrollBars.Vertical:
                        if(scrollbarmode == input.ScrollBarMode.Automatic) {
                            this.InputElement.style.overflowX = "hidden";
                            this.InputElement.style.overflowY = "auto";
                        } else {
                            this.InputElement.style.overflowX = "hidden";
                            this.InputElement.style.overflowY = "scroll";
                        }
                        break;
                    case input.ScrollBars.Horizontal:
                        //str_Style += "overflow-y: hidden;";
                        this.InputElement.style.overflowY = "hidden";
                        if(scrollbarmode == input.ScrollBarMode.Automatic) {
                            //str_Style += "overflow-x: auto;";
                            this.InputElement.style.overflowX = "auto";
                        } else {
                            //str_Style += wordWrap ? "overflow-x: auto;" : "overflow-x: scroll;";
                            this.InputElement.style.overflowX = this.GetWordWrap() ? "auto" : "scroll";
                        }
                        break;
                }
                if(input.Utility.safari || input.Utility.chrome) {
                    //Following code just for Re-Layout. Because WordWrap can't refersh correctly.
                    var w = this.InputElement.style.width;
                    this.InputElement.style.width = (parseInt(this.InputElement.style.width) - 1) + "px";
                    var self = this;
                    setTimeout(function () {
                        self.InputElement.style.width = w;
                    }, 0);
                }
                // HelenLiu 2013/06/27 fix bug 789 in IM HTML5.
                if(input.Utility.IPad) {
                    this.InputElement.style.webkitOverflowScrolling = "touch";
                }
                this.InternalSetText(this.GetText());
            };
            IMTextBox.prototype.Select = function () {
                //Terry jQuery Control
                //var RealID = this.GetId() + Utility.EditFieldSuffix;
                //if (this.IsjQueryControl == true) {
                //    RealID = this.GetId();
                //}
                if(this._isInnerKeyPressCall) {
                    delete this._isInnerKeyPressCall;
                    return;
                }
                this.SelectionStart = input.Utility.GetSelectionStartPosition(this.InputElement);
                // Add comments by Yang at 13:47 Aug. 28th 2007
                // For Firefox doesn't support the method document.selection.createRange()
                //this.SelectionEnd = this.SelectionStart + document.selection.createRange().text.GetLength();
                this.SelectionEnd = this.SelectionStart + input.Utility.GetSelectionText(this.InputElement).GetLength();
                // End by Yang
                if(!this.MultiLine) {
                    this.DropDownEditData.SelectionStart = this.GetMultiPosition(this.DropDownEditData.Text, this.SelectionStart);
                    this.DropDownEditData.SelectionEnd = this.GetMultiPosition(this.DropDownEditData.Text, this.SelectionEnd);
                }
            };
            IMTextBox.prototype._IMSetSelection = // Migrate from InputMan_HTML5 Utility.SetSelection().
            function (obj, start, end, multiLine) {
                //because in IE the following select() function will invoke the onselectstart
                //event and onselectstart will result in getting cursor position again, I must
                //add the posInfo object to return the original cursor position after we use
                //this function.
                var posInfo = {
                    start: start,
                    end: end
                };
                if(start > end) {
                    var temp = start;
                    start = end;
                    end = temp;
                }
                if(input.Utility.IsIE()) {
                    try  {
                        var range = obj.createTextRange();
                        if(!multiLine) {
                            //if (start != end)
                            //{
                            //commented by Kevin, May 21, 2007
                            //bug#7960, JIS2004
                            //change to standard position
                            //var newStart = start;
                            //end = end;
                            var newStart = obj.value.GetStandardPosition(start);
                            end = obj.value.GetStandardPosition(end, newStart - start);
                            start = newStart;
                            //end by Kevin
                            end = obj.value.length - end;
                            range.moveEnd('character', -1 * parseInt(end));
                            range.moveStart('character', parseInt(start));
                            // add by Sean Huang at 2009.01.06, for bug 1454 -->
                            input.Utility.InnerSelect = true;
                            // end of Sean Huang <--
                            range.select();
                            // add by Sean Huang at 2009.01.06, for bug 1454 -->
                            input.Utility.InnerSelect = false;
                            // end of Sean Huang <--
                            //}
                            //else
                            //{
                            //moveStart is used to collapse the highlight
                            //when we multiple select and then input a char.
                            //	range.moveStart("character", obj.value.length);
                            //	range.moveEnd("character", parseInt(start - obj.value.length));
                            //	range.select();
                            //}
                                                    } else {
                            var text = obj.value;
                            var lines = 0;
                            var startLines = 0;
                            var endLines = 0;
                            var index = text.lastIndexOf("\r\n");
                            //if (index === -1) { // IE 9 or later.
                            //    index = text.lastIndexOf('\n');
                            //}
                            while(index != -1) {
                                lines++;
                                if(index >= start) {
                                    startLines++;
                                }
                                if(index >= end) {
                                    endLines++;
                                }
                                text = text.substring(0, index);
                                index = text.lastIndexOf("\r\n");
                                //if (index === -1) { // IE 9 or later.
                                //    index = text.lastIndexOf('\n');
                                //}
                                                            }
                            startLines = lines - startLines;
                            // Add comments by Yang at 10:11 May 30 2007
                            // For fix bug #7960, JIS2004
                            //			start = start - startLines;
                            //
                            //
                            //			//commented by Kevin, May 21, 2007
                            //		    //bug#7960, JIS2004
                            //            //change to standard position
                            //	        var newStart = obj.value.GetStandardPosition(start);
                            //            end = obj.value.GetStandardPosition(end, newStart - start);
                            //            start = newStart;
                            //            //end by Kevin
                            var newStart = start;
                            end = end;
                            start = newStart - startLines;
                            // End by Yang
                            end = obj.value.length - end - endLines;
                            range.moveEnd('character', -1 * parseInt(end));
                            range.moveStart('character', parseInt(start));
                            // add by Sean Huang at 2009.01.06, for bug 1454 -->
                            input.Utility.InnerSelect = true;
                            // end of Sean Huang <--
                            range.select();
                            // add by Sean Huang at 2009.01.06, for bug 1454 -->
                            input.Utility.InnerSelect = false;
                            // end of Sean Huang <--
                                                    }
                    } catch (e) {
                    }
                } else {
                    //commented by Kevin, May 21, 2007
                    //bug#7960, JIS2004
                    //change to standard position
                    var newStart = start;
                    end = end;
                    start = newStart;
                    //end by Kevin
                    // change by Sean Huang at 2008.11.11, for bug 10396 -->
                    //obj.setSelectionRange(parseInt(start), parseInt(end));
                    try  {
                        //modified by sj for 12239
                        //obj.setSelectionRange(parseInt(start), parseInt(end));
                        var intStart = parseInt(start);
                        var intEnd = parseInt(end);
                        if(obj.selectionStart != intStart || obj.selectionEnd != intEnd) {
                            obj.setSelectionRange(intStart, intEnd);
                        }
                        //if (Utility.chrome || Utility.firefox || Utility.safari) {
                        //    // DaryLuo 2013/05/23 fix bug 383 in IM HTMl5.0.
                        //    var selStartValue = obj.value.substring(0, intStart);
                        //    var width = Utility.MeasureText(selStartValue, obj).Width;
                        //    var height = obj.scrollHeight;
                        //    // Scroll the caret into view.
                        //    var clientWidth = obj.clientWidth;
                        //    var currentStyle = obj.currentStyle || window.getComputedStyle(obj, null);
                        //    clientWidth -= (parseInt(currentStyle.paddingLeft) + parseInt(currentStyle.paddingRight));
                        //    var clientHeight = obj.clientHeight;
                        //    clientHeight -= (parseInt(currentStyle.paddingTop) + parseInt(currentStyle.paddingBottom));
                        //    if (obj.scrollLeft > width) {
                        //        obj.scrollLeft = width;
                        //    }
                        //    else if (width > obj.scrollLeft + clientWidth) {
                        //        obj.scrollLeft = width - clientWidth + parseInt(currentStyle.paddingLeft);
                        //    }
                        //    if (obj.scrollTop > height) {
                        //        obj.scrollTop = height;
                        //    }
                        //    else if (height > obj.scrollTop + clientHeight) {
                        //        obj.scrollTop = height - clientHeight + parseInt(currentStyle.paddingTop);
                        //    }
                        //}
                        //end by sj
                                            } catch (e) {
                    }// end of Sean Huang <--
                    
                }
                // DaryLuo 2013/05/23 fix bug 383 in IM HTMl5.0.
                var selStartValue = obj.value.substring(0, intStart);
                var width = input.Utility.MeasureText(selStartValue, obj).Width;
                var height = obj.scrollHeight;
                // Scroll the caret into view.
                var clientWidth = obj.clientWidth;
                var currentStyle = obj.currentStyle || window.getComputedStyle(obj, null);
                clientWidth -= (parseInt(currentStyle.paddingLeft) + parseInt(currentStyle.paddingRight));
                var clientHeight = obj.clientHeight;
                clientHeight -= (parseInt(currentStyle.paddingTop) + parseInt(currentStyle.paddingBottom));
                if(input.Utility.IsIE10OrLater()) {
                    clientWidth -= clientHeight// width of clear button.
                    ;
                }
                if(obj.scrollLeft > width) {
                    obj.scrollLeft = width;
                } else if(width > obj.scrollLeft + clientWidth) {
                    obj.scrollLeft = width - clientWidth + parseInt(currentStyle.paddingLeft);
                }
                if(obj.scrollTop > height) {
                    obj.scrollTop = height;
                } else if(height > obj.scrollTop + clientHeight) {
                    obj.scrollTop = height - clientHeight + parseInt(currentStyle.paddingTop);
                }
                return posInfo;
            };
            IMTextBox.prototype.SetSelection = function (start, end) {
                if(this.MultiLine) {
                    this._IMSetSelection(this.InputElement, start, end, true);
                } else {
                    this._IMSetSelection(this.InputElement, start, end);
                }
                this.SelectionStart = start;
                this.SelectionEnd = end;
                this.DropDownEditData.SelectionStart = start;
                this.DropDownEditData.SelectionEnd = end;
            };
            IMTextBox.prototype.InternalSetSelection = function (start, end) {
                if(this.MultiLine) {
                    this._IMSetSelection(this.InputElement, start, end, true);
                } else {
                    this._IMSetSelection(this.InputElement, start, end);
                    this.DropDownEditData.SelectionStart = this.GetMultiPosition(this.DropDownEditData.Text, start);
                    this.DropDownEditData.SelectionEnd = this.GetMultiPosition(this.DropDownEditData.Text, end);
                }
                this.SelectionStart = start;
                this.SelectionEnd = end;
            };
            IMTextBox.prototype.SetInnerSelectionStart = function (start) {
                this.SelectionStart = start;
                this.DropDownEditData.SelectionStart = start;
                //this.SetLastClientValues();
                            };
            IMTextBox.prototype.SetInnerSelectionEnd = function (end) {
                this.SelectionEnd = end;
                this.DropDownEditData.SelectionEnd = end;
                //this.SetLastClientValues();
                            };
            IMTextBox.prototype.GetTrueSelection = // Get the real selection position after restoring from the ellipsis string.
            function (selectionstart, selectionend, newText, oldText) {
                var ret = new Object();
                ret.SelectionStart = selectionstart;
                ret.SelectionEnd = selectionend;
                if(this.isTextEllipsis) {
                    ret.SelectionStart = this.GetTruePosition(selectionstart, newText, oldText, this.TextHeadLength);
                    if(selectionstart == selectionend) {
                        ret.SelectionEnd = ret.SelectionStart;
                    } else {
                        ret.SelectionEnd = this.GetTruePosition(selectionend, newText, oldText, this.TextHeadLength);
                    }
                    return ret;
                }
                return ret;
            };
            IMTextBox.prototype.DropDownListValidate = function (values) {
                var temp = values;
                var vList = new Array();
                for(var i = 0, j = 0; i < temp.length; i++) {
                    var tempi = temp[i];
                    if(this.UIProcess.ListValidateCheck(temp[i])) {
                        if(this.MaxLength != 0) {
                            tempi = this.UIProcess.MaxLengthCheck(tempi, this.MaxLength, this.LengthAsByte);
                        }
                        if(this.MaxLineCount != 0 && this.MultiLine) {
                            //			        tempi = this.UIProcess.MaxLineCheck("", "", tempi, this.MaxLineCount, this.CountWrappedLine);
                            if(this.PasswordMode) {
                                var passwordText = this.UIProcess.GetPasswordText(tempi, this.PasswordChar, this.MultiLine);
                                passwordText = this.UIProcess.MaxLineCheck("", "", passwordText, this.MaxLineCount, this.CountWrappedLine);
                                tempi = tempi.Substring(0, passwordText.GetLength());
                            } else {
                                tempi = this.UIProcess.MaxLineCheck("", "", tempi, this.MaxLineCount, this.CountWrappedLine);
                            }
                        }
                        if(tempi == temp[i]) {
                            vList[j] = temp[i];
                            j++;
                        }
                    }
                }
                return vList;
            };
            IMTextBox.prototype.SystemPasswordChar = function () {
                // change by Sean Huang at 2010.03.04 -->
                // does not have permission on Medium trusted level.-->
                // string strMachineOs = Utility.GetMachineOS(true, null).ToLower();
                //modified by sj for bug 3006
                //string strMachineOs = Utility.GetMachineOS(this.DesignMode, null).ToLower();
                var strMachineOs = input.Utility.GetClientOS();
                //end by sj
                // end of Sean Huang <--
                // HelenLiu 2013/06/09 fix bug 656 in IM HTML5.0.
                switch(strMachineOs.toLowerCase()) {
                    case "win2000":
                        return '*';
                    case "win2003":
                    case "winxp":
                    case "vista":
                    case "win7":
                    case "win8":
                        return '\u25cf';
                        //end by sj
                                            default:
                        return '*';
                }
            };
            IMTextBox.prototype.InternalSetText = function (text, setDropDownEditData, fromDragDrop) {
                var formatedText = this.UIProcess.FormatCheck(text, this.AcceptTab, this.AcceptReturn);
                var maxLengthCheckedText = formatedText;
                if(this.MaxLength != 0) {
                    maxLengthCheckedText = this.UIProcess.MaxLengthCheck(formatedText, this.MaxLength, this.LengthAsByte);
                }
                if(this.MaxLineCount != 0 && this.MultiLine) {
                    if(this.PasswordMode) {
                        var passwordText = this.UIProcess.GetPasswordText(maxLengthCheckedText, this.PasswordChar, this.MultiLine);
                        passwordText = this.UIProcess.MaxLineCheck("", "", passwordText, this.MaxLineCount, this.CountWrappedLine);
                        maxLengthCheckedText = maxLengthCheckedText.Substring(0, passwordText.GetLength());
                    } else {
                        maxLengthCheckedText = this.UIProcess.MaxLineCheck("", "", maxLengthCheckedText, this.MaxLineCount, this.CountWrappedLine);
                    }
                }
                // HelenLiu 2013/07/09 fix bug 1005 in IM HTML5.
                if(fromDragDrop && (input.Utility.firefox || input.Utility.chrome)) {
                    this.DirectSetText(maxLengthCheckedText, true);
                } else {
                    this.DirectSetText(maxLengthCheckedText);
                }
                if(!this.MultiLine && setDropDownEditData) {
                    this.DropDownEditData.Text = maxLengthCheckedText;
                }
                return maxLengthCheckedText;
            };
            IMTextBox.prototype.DirectSetText = function (text, NoUpdateDisplay) {
                this.SystemChange = false;
                var passwordText = text;
                //		if ((!this.UseSystemPasswordChar && this.PasswordMode) || (this.MultiLine && this.UseSystemPasswordChar))
                if(this.PasswordMode) {
                    passwordText = this.UIProcess.GetPasswordText(text, this.PasswordChar, this.MultiLine);
                }
                // Add comments by Yang at 9:08 Sep. 10th 2007
                // For fix the bug that Only the first line will be shown when paste a multiline string to singleline Edit.
                if(!this.MultiLine && !input.Utility.IsIE()) {
                    passwordText = passwordText.replace(/\r\n/g, "");
                    passwordText = passwordText.replace(/\n/g, "");
                    passwordText = passwordText.replace(/\r/g, "");
                }
                if(this.Text != text) {
                    this.Text = text;
                    // HelenLiu 2013/07/26 fix bug 1105 in IM HTML5.
                    if(!this.switchPasswordChar) {
                        // Frank Liu removed, to fire 'textChanged' event in SetHideText(). 2013/09/1, for wijinputtext.
                        //// HelenLiu 2013/07/17 fix bug 1075 in IM HTML5.
                        //if (this.TextChangedEvent != "" /*&& document.activeElement !== this.InputElement*/ && this.TextChangedEvent != null) {
                        //    this.UIProcess.FireEvent(this, this.TextChangedEvent, null, "TextChanged");
                        //}
                        this.switchPasswordChar = false;
                    }
                    // DaryLuo 2014/02/11 fix bug 50765.
                    //this.GetJQueryInputElement().data('preText', text);
                                    }
                // End by Yang
                // HelenLiu 2013/07/09 fix bug 1005 in IM HTML5.
                if(!NoUpdateDisplay) {
                    this._setInputValueWithPlaceHolder(passwordText);
                }
                //// Add comments by Yang at 14:35 August 7th 2007
                //// For improve the performance for v2h1
                this.SetHideText(text);
            };
            IMTextBox.prototype.InternalDirectSetText = function (text) {
                var passwordText = text;
                //		if ((!this.UseSystemPasswordChar && this.PasswordMode) || (this.MultiLine && this.UseSystemPasswordChar))
                if(this.PasswordMode) {
                    passwordText = this.UIProcess.GetPasswordText(text, this.PasswordChar, this.MultiLine);
                }
                this._setInputValueWithPlaceHolder(passwordText);
            };
            IMTextBox.prototype._setInputValueWithPlaceHolder = function (text) {
                if(text === "") {
                    this.isNullText = true;
                    if(this.Focused === false) {
                        text = this.placeHolder;
                    }
                } else if(!(text === this.placeHolder && this.isNullText)) {
                    this.isNullText = false;
                }
                this.InputElement.value = text;
            };
            IMTextBox.prototype._getInputValueWithPlaceHolder = function () {
                return this.isNullText ? "" : this.InputElement.value;
            };
            IMTextBox.prototype.SetHideText = function (text) {
                // Frank Liu migrates from UIUpdate.SetHideText(), and adds codes to fire event.
                if(this.hideText !== text) {
                    if(this.TextChangedEvent != "" && this.TextChangedEvent != null) {
                        this.UIProcess.FireEvent(this, this.TextChangedEvent, text, "textChanged");
                    }
                }
                this.hideText = text;
            };
            IMTextBox.prototype.GetSingleCurPosition = // Transfer the position from multiline type to single line type
            function (text, curposition) {
                if(curposition < 0) {
                    return -1;
                }
                var tempPositon = curposition;
                if(curposition >= text.GetLength()) {
                    tempPositon = text.GetLength();
                }
                var temp = text.Substring(0, tempPositon);
                while(true) {
                    var tempLength = temp.GetLength();
                    temp = temp.replace(/\r/g, "");
                    temp = temp.replace(/\n/g, "");
                    if(tempLength == temp.GetLength()) {
                        break;
                    }
                }
                return temp.GetLength();
            };
            IMTextBox.prototype.GetSingleText = function (multiText) {
                var temp = multiText;
                while(true) {
                    var oldLength = temp.GetLength();
                    temp = temp.replace(/\r/g, "");
                    temp = temp.replace(/\n/g, "");
                    if(temp.GetLength() == oldLength) {
                        break;
                    }
                }
                return temp;
            };
            IMTextBox.prototype.GetMultiPosition = // Transfer the position from single line type to multiline type
            function (multiText, signlePosition) {
                if(signlePosition <= 0) {
                    return 0;
                }
                if(signlePosition >= multiText.GetLength()) {
                    return multiText.GetLength();
                }
                var end = signlePosition;
                while(end < multiText.GetLength()) {
                    var text = multiText.Substring(0, end);
                    text = this.GetSingleText(text);
                    if(text.GetLength() == signlePosition) {
                        break;
                    } else {
                        end = end + 1;
                    }
                }
                return end;
            };
            IMTextBox.prototype.GetOldValue = function () {
                return this.OldText;
            };
            IMTextBox.prototype.GetValue = function () {
                return this.GetText();
            };
            IMTextBox.prototype.SetInnerText = function (text) {
                this.SetText(text);
            };
            IMTextBox.prototype.GetDisPlayText = function (text) {
                var passwordText = text;
                if(this.PasswordMode) {
                    passwordText = this.UIProcess.GetPasswordText(text, this.PasswordChar, this.MultiLine);
                }
                return passwordText;
            };
            IMTextBox.prototype.Focus = function () {
                this._destoryOverflowTip();
                //Set the dropdown list value.
                //document.all.ttt1.value += isFocusOnList;
                //added by shen yuan for bug 4620.
                this.oldTextValue = this._getInputValueWithPlaceHolder();
                //this.ProcessFishEyeButtonOnFocus();
                var oldText = this.oldTextValue;
                //end.
                // Add comments by Yang at 13:41 Aug. 28th 2007
                // Because FF doesn't support document.activeElement
                if(!input.Utility.IsIE()) {
                    this.IsActive = true;
                    //// Add comments by Yang at 12:32 Sep. 15th 2007
                    //// For fix bug 8843
                    ////modified by sj for bug 2408, 2409 ,2977 Japan(NKOI-566BC9866)
                    ////this.DropDownObj.IsDropDownRaisePostBack = false;
                    //if (this.DropDownObj) {
                    //    this.DropDownObj.IsDropDownRaisePostBack = false;
                    //}
                    ////end by sj
                    //// End by Yang
                                    }
                // End by Yang
                // Add for OverflowTip
                this.HasFocus = true;
                //if (this.ToolTip != null) {
                //    this.ToolTip.Close();
                //    this.ToolTip = null;
                //}
                if(!this._autoComplete.GetIsFocusOnList()) {
                    this._autoComplete.HideDropdown();
                    // Modified by shenyuan at 2005-12-16
                    var items;
                    if(this.AutoCompleteType != "None") {
                        items = this.GetItem(this.AutoCompleteType);
                    } else {
                        items = this.GetItem(this.GetId(), "focus");
                    }
                    // Ended.
                    //modified by sj
                    //if (items != null)
                    //{
                    //data1 = items.sort();
                    var data1 = items != null ? items.sort() : null;
                    //end by sj
                    //// Modified by shenyuan at 2006-01-17 for bug #4987.
                    //// When the borderwidth is not default value, 2px,
                    //// should add it to the historylist's position.
                    //var borderwidth = 0;
                    //if (this.BorderWidth != null) {
                    //    borderwidth = parseInt(this.BorderWidth);
                    //}
                    // Added an argument IsVS2005 for bug #5174.
                    //if (document.readyState == "complete" || document.readyState == "interactive")
                    if(input.Utility.LoadComplete == true) {
                        this._autoComplete.SetDataList(data1);
                        // End by Yang
                                            }
                } else {
                    this._autoComplete.SetIsFocusOnList(false);
                }
                var retInfo = this.UIProcess.TextBoxFocus(this.FocusType, this.InputElement, this.GetText(), this.MultiLine, //this.GetLines(),
                this.HighlightText, //01-24 for bug #4961
                //this.ContextMenu.IsShow()
                false);
                //Add comments by Ryan Wu at 15:18 Jan. 16 2007.
                //For fix bug#6447.
                input.Utility.CurrentActiveControlId = this.GetId();
                //end by Ryan Wu.
                if(retInfo == null) {
                    return;
                }
                if(this.isTextEllipsis) {
                    this.InternalDirectSetText(this.Text);
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                    this.SelectionLength = Math.abs(this.SelectionEnd - this.SelectionStart);
                }
                if(retInfo.SelectionStart != null && retInfo.SelectionEnd != null) {
                    var retSelection = this.GetTrueSelection(this.SelectionStart, this.SelectionEnd, this.Text, oldText);
                    if(this.isTextEllipsis) {
                        this.SelectionStart = retSelection.SelectionStart;
                        this.SelectionEnd = retSelection.SelectionEnd;
                    }
                    //this.DropDownObj.SetInnerSelection(retSelection.SelectionStart, retSelection.SelectionEnd);
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionStart = this.GetMultiPosition(this.DropDownEditData.Text, retSelection.SelectionStart);
                        this.DropDownEditData.SelectionEnd = this.GetMultiPosition(this.DropDownEditData.Text, retSelection.SelectionEnd);
                    }
                }
                if(this.UIProcess.japInput == true) {
                    if(this.truePosition != -1) {
                        this.SelectionStart = this.truePosition;
                        this.SelectionEnd = this.truePosition;
                        if(!this.MultiLine) {
                            this.DropDownEditData.SelectionStart = this.GetMultiPosition(this.DropDownEditData.Text, this.SelectionStart);
                            this.DropDownEditData.SelectionEnd = this.GetMultiPosition(this.DropDownEditData.Text, this.SelectionEnd);
                        }
                    }
                    this.UIProcess.japInput = false;
                } else {
                    //Update oldText, oldSelectionStart,oldSelectionEnd
                    if(this.FocusType != input.FocusType.ContextMenu && // Add comments by Yang at 14:55 Feb. 1th 2008
                    // For fix the bug 9642
                    //&& this.FocusType != FocusType.None
                    // End by Yang
                    // Add comments by Yang at 11:46 May 10 2007
                    // For fix bug 8052
                    this.FocusType != input.FocusType.ClientEvent && // End by Yang
                    // Add comments by Yang at 10:20 October 11th 2007
                    // For fix bug that Textchanged wouldn't be fired
                    // when lose focus after clicking the dropdown button.
                    this.FocusType != input.FocusType.DropDown && // End by Yang
                    this.FocusType != input.FocusType.DragDrop) {
                        this.OldText = this.GetText();
                        this.OldSelectionStart = this.SelectionStart;
                        this.OldSelectionEnd = this.SelectionEnd;
                        //Commented by shenyuan at 2006-01-16.
                        //when gets focus, the buff will not change.
                        //this.LastText = this.OldText;
                        this.LastSelectionStart = this.OldSelectionStart;
                        this.LastSelectionEnd = this.OldSelectionEnd;
                        if(!this.MultiLine) {
                            this.DropDownEditData.OldText = this.DropDownEditData.Text;
                            this.DropDownEditData.OldSelectionStart = this.DropDownEditData.SelectionStart;
                            this.DropDownEditData.OldSelectionEnd = this.DropDownEditData.SelectionEnd;
                            this.DropDownEditData.LastSelectionStart = this.DropDownEditData.OldSelectionStart;
                            this.DropDownEditData.LastSelectionEnd = this.DropDownEditData.OldSelectionEnd;
                            var thisObj = this;
                            setTimeout(function () {
                                // DaryLuo 2012/07/27 fix bug 277 in IM web 7.0.
                                thisObj.DropDownEditData.SelectionStart = thisObj.SelectionStart;
                                thisObj.DropDownEditData.SelectionEnd = thisObj.SelectionEnd;
                            }, 0);
                        }
                    }
                }
                // add by Sean Huang at 2008.11.06, for bug 10007 -->
                if(this.ReadOnly == true && this.FocusType == input.FocusType.None) {
                    this.SelectionStart = 0;
                    this.SelectionEnd = this.Text.length;
                }
                // end of Sean Huang <--
                if(retInfo.SetSelection == true || this.isTextEllipsis) {
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                }
                if(this.IsCausedByImplementingDrop) {
                    this.IsCausedByImplementingDrop = false;
                }
                //Added for KeyExit event when drag text to Edit
                if(this.FocusExit) {
                    this.UIProcess.MoveControl(this.InputElement, true);
                    this.FocusExit = false;
                }
                // Add comments by Yang at 14:12 Feb. 25th 2008
                // For fix the bug 9695
                if(this.isTextEllipsis) {
                    this.isTextEllipsis = false;
                }
                // End by Yang
                //if (Utility.safari && this._safariDropText) {
                //    this.Text = this.InputElement.value; //this.UIUpdate.GetText();
                //    this._safariDropText = null;
                //    this.InternalSetText(this.GetText());
                //}
                            };
            IMTextBox.prototype.SetInnerFocus = function (focusType) {
                if(focusType !== null && focusType !== undefined) {
                    this.FocusType = focusType;
                } else {
                    this.FocusType = input.FocusType.ClientEvent;
                }
                //this.UIUpdate.SetFocus();
                this.InputElement.focus();
                this.SetSelection(this.SelectionStart, this.SelectionEnd);
                if(!this.MultiLine) {
                    this.DropDownEditData.SelectionStart = this.GetMultiPosition(this.DropDownEditData.Text, this.SelectionStart);
                    this.DropDownEditData.SelectionEnd = this.GetMultiPosition(this.DropDownEditData.Text, this.SelectionEnd);
                }
            };
            IMTextBox.prototype.LoseFocus = function (evt) {
                //this.ProcessFishEyeButtonOnLostFocus(false);
                // Add comments by Yang at 13:49 Aug. 28th 2007
                // For Firefox doesn't support document.activeElement
                if(!input.Utility.IsIE()) {
                    this.IsActive = false;
                }
                //// add by Sean Huang at 2008.10.30, for bug 9908 -->
                this.FireKeyExit();
                //// end of Sean Huang <--
                //add by sj for readingImeStringOutput
                if(input.Utility.IsIE() && this.ImeMode) {
                    this.ReadingImeOperation();
                }
                //end by sj
                // Add comments by Yang at 18:12 May 28 2007
                // For fix bug 8230
                // Add Comments by Yang at 14:08 May 8 2007
                // For Japanese
                // For fix bug 7968
                //		if (this.ImeMode == true)
                //		{
                //			this.ImeInput("LoseFocusInput");
                //		}
                // End by Yang
                // Add comments by Yang at 9:42 Aug. 29th 2007
                // For Firefox doesn't support set a value in onblur event when IME opens.
                //this.ImeInput("LoseFocusInput");
                if(input.Utility.IsIE()) {
                    // Add comments by Yang at 13:55 Sep. 20th 2007
                    // For fix bug 8715 & 8716
                    //this.ImeInput("LoseFocusInput");
                    if(this.ImeMode) {
                        this.ImeInput("LoseFocusInput", undefined, evt);
                        this.ImeSelectTimes = 0;
                    } else if(this.Text != this.GetText()) {
                        this.InternalSetText(this.Text, true);
                    }
                    // End by Yang
                                    } else {
                    // Add comments by Yang at 13:55 Sep. 20th 2007
                    // For fix bug 8715 & 8716
                    //this.ImeInput("ReInput", true);
                    if(this.ImeMode) {
                        this.ImeInput("ReInput", true, evt);
                    }
                    // End by Yang
                    // Add comments by Yang at 9:42 Aug. 29th 2007
                    // For Firefox doesn't support set a value in onblur event when IME opens.
                    // Add comments by Yang at 11:07 October 12th 2007
                    // For fix the bug 9017
                    //if (this.Text != this.GetText())
                    if(this.GetDisPlayText(this.Text) != this._getInputValueWithPlaceHolder())//this.UIUpdate.GetText())
                    // End by Yang
                     {
                        var tempText = this.Text;
                        // add by Sean Huang at 2009.02.17, for bug 1883 -->
                        tempText = tempText.replace(/\\/g, '\\\\');
                        // end of Sean Huang <--
                        if(!this.MultiLine) {
                            tempText = tempText.replace(/\r\n/g, "");
                            tempText = tempText.replace(/\r/g, "");
                            tempText = tempText.replace(/\n/g, "");
                        } else {
                            tempText = tempText.replace(/\r/g, "\\r");
                            tempText = tempText.replace(/\n/g, "\\n");
                        }
                        // change by Sean Huang at 2010.09.19, for bug 3020 -->
                        //window.setTimeout("FindIMControl('" + this.ID + "').InternalSetText('" + tempText + "', true)", 0);
                        //var id = this.GetId();
                        //var self = this;
                        //window.setTimeout(function () { self.InternalSetText(tempText, true); }, 0);
                        this.InternalSetText(tempText, true);
                        // end of Sean Huang <--
                                            }
                    // End by Yang
                                    }
                // End by Yang
                // End by Yang
                this.HasFocus = false;
                if(this._autoComplete.IsVisible()) {
                    if(this._autoComplete.GetIsMouseOnList()) {
                        return;
                    } else// Modified by shenyuan at 2006-01-10 for bug 4436.
                    // When losefocus and Mouse Not OnList, historylisty shoul be closed.
                     {
                        this._autoComplete.HideDropdown();
                    }
                    // Ended.
                                    }
                //if (this.ContextMenu.IsShow()) {
                //    this.ContextMenu.Close();
                //}
                // Add comments by Yang at 13:34 June 1st 2007
                // For fix bug 8092
                //Add by YangYang at 21:39 Apr. 20 2007.
                //For support Aspnet Ajax 1.0.
                //this.SetLastClientValues();
                //end by YangYang.
                // End by Yang
                // Add Comments by Yang at 14:08 May 8 2007
                // For fix bug 7968
                //For Japanese
                //		if (this.ImeMode == true)
                //		{
                //			this.ImeInput("LoseFocusInput");
                //		}
                // End by Yang
                //The default FocusType is FocusType.None
                if(this.FocusType != input.FocusType.DropDown) {
                    this.FocusType = input.FocusType.None;
                }
                //		if (this.PasswordMode && !this.UseSystemPasswordChar)
                //		{
                //		    return;
                //		}
                // Add comments by Yang at 11:35 Aug. 28th 2007
                // In ie and firefox, we always implement the method ImeInput().
                // In the ime input handle method, the parameter <this.Text> is updated.
                // But sometimes the input's value isn't updated.
                // So we should use the parameter <this.Text>.
                var nowText;
                if(input.Utility.IsIE()) {
                    nowText = this.GetText();
                } else// Add comments by Yang at 16:35 October 15th 2007
                // For fix the bug 9042
                 {
                    nowText = this.hideText;
                }
                // End by Yang
                //if (this.OldText != this.GetText() && !this.UIProcess.japInput && this.FocusType != FocusType.DropDown)
                // Add comments by Yang at 9:58 Sep. 13th 2007
                // For fix the bug that when press the droop-down button to close the drop-down window.
                // the textchanged event couldn't be fired.
                //if (this.OldText != nowText && !this.UIProcess.japInput && this.FocusType != FocusType.DropDown)
                if(this.OldText != nowText && !this.UIProcess.japInput)// End by Yang
                 {
                    this.OldText = this.Text;
                    // Maybe the following codes should be deleted,
                    // because it is redundant.
                    if(input.Utility.IsIE()) {
                        this.Text = this.GetText();
                        this.SetHideText(this.GetText());
                    }
                    this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
                    // Frank Liu removed as _onBlur() in wijinputcore fired this event.
                    //if (this.TextChangedEvent != null) {
                    //    var eventInfo: any = new Object();
                    //    eventInfo.Name = this.TextChangedEvent;
                    //    eventInfo.Args = null;
                    //    //Add comments by Ryan Wu at 10:42 Apr. 5 2007.
                    //    //For support Aspnet Ajax 1.0.
                    //    //this.UIProcess.FireEvent(this, eventInfo.Name, eventInfo.Args);
                    //    this.UIProcess.FireEvent(this, eventInfo.Name, eventInfo.Args, "TextChanged");
                    //    //end by Ryan Wu.
                    //}
                    if(!this.SystemChange || (this.oldTextValue != this.GetText())) {
                        this.SystemChange = true;
                        // Frank Liu removed at 2013/08/14.
                        //Utility.FireSystemEvent(this.InputElement, "onchange");
                        //if (this.ClientEvents.StandardClientEvents != null) {
                        //    var SystemEvent: any = new Object();
                        //    SystemEvent.Name = this.ClientEvents.StandardClientEvents.onchange;
                        //    SystemEvent.Args = null;
                        //    // change by Sean Huang at 2009.04.24, for bug 2241 -->
                        //    //this.UIProcess.FireEvent(null, SystemEvent.Name, SystemEvent.Args);
                        //    this.UIProcess.FireEvent(this.InputElement, SystemEvent.Name, SystemEvent.Args);
                        //    // end of Sean Huang <--
                        //}
                                            }
                } else// Add comments by Yang at 11:51 June 1st 2007
                // For fix bug 8092
                 {
                    this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
                    //this.SetLastClientValues();
                    // Terry fix IM Web SP3.5 bug 7 in 2011/12/22
                    if(this.hideText != this.GetText() && input.Utility.IsIE()) {
                        this.SetHideText(this.GetText());
                    }
                }
            };
            IMTextBox.prototype.FireKeyExit = function () {
                if(this.EventInfo != null && this.EventInfo.Type == "KeyExit") {
                    this.UIProcess.FireEvent(this, this.EventInfo.Name, this.EventInfo.Args, this.EventInfo.Type);
                    this.FocusType = input.FocusType.KeyExit;
                    this.EventInfo = null;
                }
            };
            IMTextBox.prototype.GetTruePosition = // Get the real position from the ellipsis string.
            function (oldSelection, newText, oldText, textHeadLength) {
                var ellipsisStringLength = this.EllipsisString.GetLength();
                if(oldSelection <= textHeadLength) {
                    return oldSelection;
                } else if(oldSelection >= (textHeadLength + ellipsisStringLength)) {
                    return (newText.GetLength() - oldText.GetLength() + oldSelection);
                }
                var ellipsisTextLength = newText.GetLength() - oldText.GetLength() + ellipsisStringLength;
                var trueSelection = Math.floor((oldSelection - textHeadLength) * ellipsisTextLength / ellipsisStringLength) + textHeadLength;
                return trueSelection;
            };
            IMTextBox.prototype.DealEllipsis = function (Multiline, Ellipsis, EllipsisString, obj) {
                this.isTextEllipsis = false;
                if(Multiline || Ellipsis == EllipsisMode.None) {
                    return;
                }
                //modified by sj 2008.8.12 for bug 509
                this.InternalDirectSetText(this.Text);
                //end by sj
                var _ellipsisMode = Ellipsis;
                var i_length = 0;
                var i_onecharwidth = 0;
                var subwidth = 0;
                var ellipsisnum = 0;
                var tempstring = obj.value;
                var savestring = obj.value;
                var tempheadstring = "";
                var temptailstring = "";
                var headstringcount = 0;
                var isAddTail = true;
                obj.value = tempstring;
                if(input.Utility.GetTextBoxScrollWidth(obj, this.IsControlInPreview) > obj.clientWidth) {
                    this.isTextEllipsis = true;
                    obj.value = EllipsisString;
                    var _EllipsisString = EllipsisString;
                    if(input.Utility.GetTextBoxScrollWidth(obj, this.IsControlInPreview) > obj.clientWidth) {
                        _EllipsisString = "";
                        tempstring = EllipsisString;
                        savestring = EllipsisString;
                    } else if(_ellipsisMode == EllipsisMode.EllipsisPath) {
                        var iLastIndex = savestring.LastIndexOf("\\");
                        if(iLastIndex != -1) {
                            obj.value = _EllipsisString + savestring.substr(iLastIndex);
                            if(input.Utility.GetTextBoxScrollWidth(obj, this.IsControlInPreview) <= obj.clientWidth) {
                                _EllipsisString = obj.value;
                                tempstring = savestring.Substring(0, iLastIndex);
                                _ellipsisMode = EllipsisMode.EllipsisEnd;
                            }
                        }
                    }
                    obj.value = tempstring + _EllipsisString;
                    do {
                        i_length = obj.value.GetLength();
                        i_onecharwidth = Math.ceil(input.Utility.GetTextBoxScrollWidth(obj, this.IsControlInPreview) / i_length);
                        subwidth = input.Utility.GetTextBoxScrollWidth(obj, this.IsControlInPreview) - obj.clientWidth;
                        ellipsisnum = Math.ceil(subwidth / i_onecharwidth);
                        if(_ellipsisMode == EllipsisMode.EllipsisEnd) {
                            obj.value = tempstring.Substring(0, tempstring.GetLength() - ellipsisnum) + _EllipsisString;
                            tempstring = tempstring.Substring(0, tempstring.GetLength() - ellipsisnum);
                        } else if(_ellipsisMode == EllipsisMode.EllipsisPath) {
                            headstringcount = Math.ceil((tempstring.GetLength() - ellipsisnum) / 2);
                            tempheadstring = tempstring.substr(0, headstringcount);
                            temptailstring = tempstring.substr(headstringcount + ellipsisnum);
                            obj.value = tempheadstring + _EllipsisString + temptailstring;
                            tempstring = tempheadstring + temptailstring;
                        }
                    }while(input.Utility.GetTextBoxScrollWidth(obj, this.IsControlInPreview) > obj.clientWidth);
                    var i_tempstringlen = tempstring.GetLength();// + 1;
                    
                    do {
                        if(_ellipsisMode == EllipsisMode.EllipsisEnd) {
                            obj.value = savestring.Substring(0, i_tempstringlen + 1) + _EllipsisString;
                            i_tempstringlen = i_tempstringlen + 1;
                        } else if(_ellipsisMode == EllipsisMode.EllipsisPath) {
                            if(isAddTail) {
                                temptailstring = savestring.substr(savestring.GetLength() - temptailstring.GetLength() - 1);
                                isAddTail = false;
                            } else {
                                tempheadstring = savestring.substr(0, tempheadstring.GetLength() + 1);
                                isAddTail = true;
                            }
                            obj.value = tempheadstring + _EllipsisString + temptailstring;
                        }
                    }while(input.Utility.GetTextBoxScrollWidth(obj, this.IsControlInPreview) == obj.clientWidth);
                    if(_ellipsisMode == EllipsisMode.EllipsisEnd) {
                        obj.value = savestring.Substring(0, i_tempstringlen - 1) + _EllipsisString;
                        this.TextHeadLength = i_tempstringlen - 1;
                    } else if(_ellipsisMode == EllipsisMode.EllipsisPath) {
                        if(isAddTail) {
                            tempheadstring = savestring.substr(0, tempheadstring.GetLength() - 1);
                        } else {
                            temptailstring = savestring.substr(savestring.GetLength() - temptailstring.GetLength() + 1);
                        }
                        obj.value = tempheadstring + _EllipsisString + temptailstring;
                        this.TextHeadLength = tempheadstring.GetLength();
                    }
                }
            };
            IMTextBox.prototype.ImeInput = //ImeInput = function(operate, reInputType)
            function (operate, reInputType, evt, fromContextMenuPaste) {
                // End by Yang
                if(fromContextMenuPaste) {
                    var oldText = this.Text;
                    var selEnd = this.SelectionEnd;
                    var selStart = this.SelectionStart;
                }
                //var newValue = this.InputElement.value;
                // Add comments by Yang at 10:02 June 1st 2007
                // For fix bug 8338
                //var newValue = this.UIUpdate.GetText();
                //var newValue = this.GetText();
                // End by Yang
                var newValue;
                //modified by sj 2008.8.8 for bug 33
                if(operate == "DirectInput" && !reInputType) {
                    newValue = this.InputElement.value;
                } else {
                    //modified by sj 2008.8.8 for bug 591
                    if(operate == "LoseFocusInput" && this._getInputValueWithPlaceHolder() != this.GetText()) {
                        newValue = this._getInputValueWithPlaceHolder();
                    } else//end by sj
                     {
                        newValue = this.GetText();
                    }
                }
                //end by sj
                //Add for Bug 3724
                if(newValue == this.Text) {
                    this.lastValue = this.Text;
                    if(evt != null) {
                        input.Utility.PreventDefault(evt);
                    }
                    //update by Sean Huang 2008.08.13 for bug 97 (ttp) -->
                    this.ImeMode = false;
                    //end by Sean Huang <--
                    return false;
                }
                // Add comments by Yang at 17:09 Sep. 25th 2007
                // For fix bug 8715
                //
                // HelenLiu 2013/06/28 fix bug 781 in IM HTML5.
                if(input.Utility.IsIE() && this.HasValidatedImeInput) {
                    this.InternalSetText(newValue, true);
                    //this.InternalSetText(this.Text, true);
                    if(fromContextMenuPaste) {
                        var newText = this.Text;
                        if(oldText !== newText) {
                            var s = selStart + newText.length - (oldText.length - (selEnd - selStart));
                            this.SetSelection(s, s);
                        }
                    }
                    return false;
                }
                // End by Yang
                //Now get the input ime text;
                var imeInputText;
                if(this.Text != "") {
                    var start = Math.min(this.SelectionStart, this.SelectionEnd);
                    var end = Math.max(this.SelectionStart, this.SelectionEnd);
                    // Add comments by Yang at 14:02 October 12th 2007
                    // For fix the bug 9017
                    var thisText = this.Text;
                    if(!input.Utility.IsIE()) {
                        thisText = this.GetDisPlayText(this.Text);
                    }
                    if(end < thisText.GetLength())//if (end < this.Text.GetLength())
                    // End by Yang
                     {
                        // Add comments by Yang at 14:02 October 12th 2007
                        // For fix the bug 9017
                        //var lastText = this.Text.Substring(end, this.Text.GetLength());
                        var lastText = thisText.Substring(end, thisText.GetLength());
                        // End by Yang
                        var textIndex = newValue.IndexOf(lastText);
                        if(textIndex != -1) {
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
                //For autocomplete dropdown.
                if(imeInputText != "" && !this.MultiLine && !this._autoComplete.IsDataListEmpty() && this.EnableAutoComplete) {
                    this._autoComplete.KeyUp(null, true);
                }
                //Discard the new input character.
                if(operate == "ReInput") {
                    // Add comments by Yang at 14:45 May 29 2007
                    // For fix bug 8230
                    //imeInputText = imeInputText.Substring(0, imeInputText.GetLength() - 1);
                    if(!reInputType) {
                        imeInputText = imeInputText.Substring(0, imeInputText.GetLength() - 1);
                    } else {
                        imeInputText = imeInputText.Substring(0, imeInputText.GetLength());
                    }
                    // End by Yang
                                    }
                if(operate == "Record") {
                    return imeInputText;
                }
                // Add comments by Yang at 14:12 May 8 2007
                // For fix bug 7968
                var isLoseFocusInput = false;
                // End by Yang
                if(operate == "LoseFocusInput") {
                    if(imeInputText == "") {
                        // Add comments by Yang at 14:45 May 29 2007
                        // For fix bug 8230
                        if(this.GetText() != this.Text) {
                            this._setInputValueWithPlaceHolder(this.Text);
                        }
                        // End by Yang
                        return;
                    }
                    //Mask_ImeResponse = true;
                    // Add comments by Yang at 14:12 May 8 2007
                    // For fix bug 7968
                    isLoseFocusInput = true;
                    // End by Yang
                    this.UIProcess.japInput = true;
                }
                //Call keypress function to process insert text with ime mode.
                this.UIProcess.keypressResponse = true;
                //Ensure this.Text is tha same as this.GetText(),before this.KeyPress called;
                //this.UIUpdate.SetText(this.Text);
                this.UIProcess.inputJap = true;
                // Add comments by Yang at 15:14 Sep. 24th 2007
                // For fix bug that Firefox doesn't support set a value in onblur event when IME opens.
                if(operate == "ReInput" || (!input.Utility.IsIE() && operate == "ClickInput"))//if (operate == "ReInput")
                // End by Yang
                 {
                    // Add comments by Yang at 14:14 May 8 2007
                    // For separate the event handler and method of keypress.
                    //this.InnerKeyPress(imeInputText, true, isLoseFocusInput);
                    this.InnerKeyPress(imeInputText, true, isLoseFocusInput);
                    // End by Yang
                                    } else {
                    // Add comments by Yang at 14:14 May 8 2007
                    // For separate the event handler and method of keypress.
                    //this.InnerKeyPress(imeInputText, false, isLoseFocusInput);
                    this.InnerKeyPress(imeInputText, false, isLoseFocusInput);
                    // End by Yang
                                    }
                // Add comments by Yang at 17:10 Sep. 25th 2007
                // For fix bug 8715
                //if (Utility.IsIE()) {
                this.HasValidatedImeInput = true;
                //}
                // End by Yang
                this.UIProcess.inputJap = false;
                this.UIProcess.japInput = false;
                this.ImeMode = false;
                this.ImeSelect = false;
                //We can not control ime start and end,so if there are two times ime operation
                //in the same input case. We should check all the characters and close ime.
                if(operate == "ReInput" || operate == "ClickInput") {
                    //this.UIProcess.japInput = true;
                    this.truePosition = this.SelectionStart;
                    this.FocusType = input.FocusType.ImeInput;
                    //this.InputElement.blur();
                    //this.UIUpdate.SetText(this.Text);
                    //this.InputElement.focus();
                                    }
                /*
                if (!this.MultiLine)
                {
                this.SetSelection(this.SelectionStart, this.SelectionEnd)
                }*/
                            };
            IMTextBox.prototype.CanUndo = function () {
                if(this.IsChangedByDropDownEdit) {
                    if(this.IsUndoAfterDel) {
                        this.BuffText = this.GetText();
                    } else {
                        this.LastText = this.GetText();
                    }
                    this.IsChangedByDropDownEdit = false;
                    return true;
                }
                // Added by shenyuan at 2006-01-17 for bug #4989
                if(this.IsUndoAfterDel) {
                    return this.GetText() != this.BuffText;
                } else {
                    return this.GetText() != this.LastText;
                }
            };
            IMTextBox.prototype.GetCookie = // Retrieve the value of the cookie with the specified name.
            function (sName) {
                // cookies are separated by semicolons
                var aCookie = document.cookie.split("; ");
                for(var i = 0; i < aCookie.length; i++) {
                    // a name/value pair (a crumb) is separated by an equal sign
                    var aCrumb = aCookie[i].split("=");
                    if(sName == aCrumb[0]) {
                        if(aCrumb[1] != null) {
                            return window.unescape(aCrumb[1]);
                        }
                    }
                }
                // a cookie with the requested name does not exist
                return null;
            };
            IMTextBox.prototype.SetCookie = function (sName, sValue) {
                var date = new Date(2020, 8, 20);
                if(document.cookie.IndexOf(sName) == -1) {
                    // Modified by shenyuan at 2006-01-10 for bug 4544.
                    // the all commas of sValue should be replaced by "@#GCD#@".
                    if(sValue != "") {
                        while(sValue.IndexOf(",") != -1) {
                            sValue = sValue.replace(",", "@#GCD#@");
                        }
                    }
                    document.cookie = sName + "=" + window.escape(sValue) + "; expires=" + date.toGMTString();
                    //document.cookie = sName + "=" + escape(sValue.replace(",","@#GCD#@")) + "; expires=" + date.toGMTString();
                    // Ended.
                                    } else {
                    var aCookie = document.cookie.split("; ");
                    var tValue = "";
                    for(var i = 0; i < aCookie.length; i++) {
                        var aCrumb = aCookie[i].split("=");
                        if(sName == aCrumb[0]) {
                            if(aCrumb[1] != null) {
                                tValue = window.unescape(aCrumb[1]);
                                break;
                            } else {
                                document.cookie = sName + "=" + window.escape(sValue.replace(",", "@#GCD#@")) + "; expires=" + date.toGMTString();
                                return;
                            }
                        }
                    }
                    if(sValue != "") {
                        while(sValue.IndexOf(",") != -1) {
                            sValue = sValue.replace(",", "@#GCD#@");
                        }
                        var existItem = tValue.split(",");
                        var hasExist = false;
                        for(var p = 0; p < existItem.length; p++) {
                            if(existItem[p] == sValue) {
                                hasExist = true;
                            }
                        }
                        if(!hasExist) {
                            tValue = sValue + "," + tValue;
                            var jValue = tValue.split(",");
                            if(jValue.length > this.MaxHistoryCount) {
                                var newValue = "";
                                for(var j = 0; j < this.MaxHistoryCount; j++) {
                                    if(j != this.MaxHistoryCount - 1) {
                                        newValue += jValue[j] + ",";
                                    } else {
                                        newValue += jValue[j];
                                    }
                                }
                                tValue = newValue;
                            }
                            document.cookie = sName + "=" + window.escape(tValue) + "; expires=" + date.toGMTString();
                        }
                    }
                }
            };
            IMTextBox.prototype.DelCookie = function (sName) {
                document.cookie = sName + "=" + window.escape("") + "; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
            };
            IMTextBox.prototype.DeleteItem = function (sValue) {
                while(sValue.IndexOf("&nbsp;") != -1) {
                    sValue = sValue.replace("&nbsp;", " ");
                }
                var date = new Date(2020, 8, 20);
                // Modified by shenyuan at 2005-12-16
                var cookie;
                if(this.AutoCompleteType != "None") {
                    cookie = this.GetCookie(this.AutoCompleteType);
                } else {
                    cookie = this.GetCookie(this.GetId());
                }
                // Ended.
                if(cookie != null) {
                    try  {
                        var items = cookie.split(",");
                        var saveitems = cookie.split(",");
                        if(items.length > 0) {
                            var k;
                            for(k = 0; k < items.length; k++) {
                                // Modified by shenyuan at 2006-01-10 for bug #4544.
                                // The "@#GCD#@" of the item should be replaced by ",".
                                while(items[k].IndexOf("@#GCD#@") != -1) {
                                    items[k] = items[k].replace("@#GCD#@", ",");
                                }
                                // Ended.
                                //Modified by shenyuan at 2006-02-10 for bug #5206.
                                if(items[k].IndexOf("&") != -1) {
                                    var tempText = items[k];
                                    var tempResult = "";
                                    while(tempText.IndexOf("&") != -1) {
                                        tempText = tempText.replace("&", "&amp;");
                                        var findPosition = tempText.IndexOf("&");
                                        tempResult += tempText.Substring(0, findPosition + 5);
                                        tempText = tempText.Substring(findPosition + 5, tempText.GetLength());
                                    }
                                    if(tempText.IndexOf("&") == -1 && tempText != "") {
                                        tempResult += tempText;
                                    }
                                    items[k] = tempResult;
                                }
                                // Modified by shenyuan at 2006-02-09 for bug #5180.
                                while(items[k].IndexOf("<") != -1) {
                                    items[k] = items[k].replace("<", "&lt;");
                                }
                                while(items[k].IndexOf(">") != -1) {
                                    items[k] = items[k].replace(">", "&gt;");
                                }
                                // Ended.
                                if(items[k] == sValue) {
                                    break;
                                }
                            }
                            if(k < saveitems.length && saveitems.length > 1) {
                                var j;
                                for(j = k; j < saveitems.length - 1; j++) {
                                    saveitems[j] = saveitems[j + 1];
                                }
                                saveitems[items.length - 1] = null;
                                var newValue = "";
                                for(j = 0; j < saveitems.length - 1; j++) {
                                    if(j != saveitems.length - 2) {
                                        newValue += saveitems[j] + ",";
                                    } else {
                                        newValue += saveitems[j];
                                    }
                                }
                                // Modified by shenyuan at 2005-12-16
                                if(this.AutoCompleteType != "None") {
                                    document.cookie = this.AutoCompleteType + "=" + window.escape(newValue) + "; expires=" + date.toGMTString();
                                    var dataList = this.GetItem(this.AutoCompleteType).sort();//newValue.split(",").sort();
                                    
                                    for(var k = 0; k < dataList.length; k++) {
                                        while(dataList[k].IndexOf("@#GCD#@") != -1) {
                                            dataList[k] = dataList[k].replace("@#GCD#@", ",");
                                        }
                                    }
                                    this._autoComplete.SetDataList(dataList);
                                } else {
                                    document.cookie = this.GetId() + "=" + window.escape(newValue) + "; expires=" + date.toGMTString();
                                    var dataList = this.GetItem(this.GetId()).sort();//newValue.split(",").sort();
                                    
                                    for(k = 0; k < dataList.length; k++) {
                                        while(dataList[k].IndexOf("@#GCD#@") != -1) {
                                            dataList[k] = dataList[k].replace("@#GCD#@", ",");
                                        }
                                    }
                                    this._autoComplete.SetDataList(dataList);
                                }
                                // Ended.
                                                            } else {
                                this._autoComplete.SetDataList([]);
                                // Modified by shenyuan at 2005-12-16
                                if(this.AutoCompleteType != "None") {
                                    document.cookie = this.AutoCompleteType + "=" + window.escape("") + "; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
                                } else {
                                    document.cookie = this.GetId() + "=" + window.escape("") + "; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
                                }
                                // Ended.
                                                            }
                        }
                    } catch (e) {
                    }
                }
            };
            IMTextBox.prototype.GetItem = function (id, focusFlag) {
                if(this.IsFromServer) {
                    var cookie;
                    if(this.AutoCompleteType != "None") {
                        cookie = this.GetCookie(this.AutoCompleteType);
                    } else {
                        //cookie = this.GetCookie(id);
                                            }
                    if(cookie != null) {
                        try  {
                            var values = cookie.split(",");
                            var length = (values.length > this.MaxHistoryCount ? this.MaxHistoryCount : values.length);
                            for(var i = 0; i < length; i++) {
                                //var temp = value[i];
                                while(values[i].IndexOf("@#GCD#@") != -1) {
                                    values[i] = values[i].replace("@#GCD#@", ",");
                                }
                            }
                            if(length != values.length) {
                                var items = new Array();
                                for(var j = 0; j < length; j++) {
                                    items[j] = values[j];
                                }
                                while(j < values.length) {
                                    this.DeleteItem(values[j]);
                                    j++;
                                }
                                values = items;
                            }
                            if(values.length > 0) {
                                values = this.DropDownListValidate(values);
                            }
                            return values;
                        } catch (e) {
                        }
                    }
                    return null;
                } else {
                    var values = this._historyList;
                    values = values.sort();
                    if(values != null) {
                        try  {
                            var length = (values.length > this.MaxHistoryCount ? this.MaxHistoryCount : values.length);
                            if(focusFlag !== undefined) {
                                if(focusFlag === "focus") {
                                    length = values.length;
                                }
                            }
                            if(length != values.length) {
                                var items = new Array();
                                for(var j = 0; j < length; j++) {
                                    items[j] = values[j];
                                }
                                while(j < values.length) {
                                    this.DeleteItem(values[j]);
                                    j++;
                                }
                                values = items;
                            }
                            if(values.length > 0) {
                                values = this.DropDownListValidate(values);
                            }
                            return values;
                        } catch (e) {
                        }
                    }
                    return null;
                }
            };
            IMTextBox.prototype.ResetData = function (data) {
                this.SetText(data.ResetData);
            };
            IMTextBox.prototype.ReadingImeOperation = //#region IME
            //add by sj for readingImeStringOutput
            function () {
                //add by sj for bug 2985(NKOI-97C7D114D)
                if(this.RubyText == "") {
                    return;
                }
                //end by sj
                //this.owner._trigger('readingImeStringOutput', null, { readingString: this.RubyText });
                input.Utility.FireEvent(this, this.readingImeStringOutputEvent, {
                    readingString: this.RubyText
                }, 'readingImeStringOutput');
                //add by sj for bug 2650
                this.prevval = "";
                //end by sj
                this.RubyText = "";
            };
            IMTextBox.prototype.ReadingImeKeyUpProcess = function (k, CharEx, evt) {
                //modified by sj for bug 2650
                //var newval = this.GetValue();
                var nowText = this.ImeMode ? this.InputElement.value : this._getInputValueWithPlaceHolder();
                var inputText = nowText;
                if(this.SelectionEnd < this.Text.GetLength()) {
                    var lastLength = this.Text.GetLength() - this.SelectionEnd;
                    inputText = nowText.Substring(0, nowText.GetLength() - lastLength);
                }
                var newval = inputText.Substring(this.SelectionStart, inputText.GetLength());
                //end by sj
                //var addval = newval.substring(this.prevval.length, newval.length);
                var addval = newval;
                var i;
                for(i = this.prevval.length; i >= 0; i--) {
                    if(newval.substring(0, i) == this.prevval.substring(0, i)) {
                        addval = newval.substring(i);
                        break;
                    }
                }
                this.prevval = newval;
                //modified by sj for bug 1963 and 2020
                //modified by sj for bug 2650
                //if (newval == this.Text && k != 13 && !(event.altKey))
                if(nowText == this.Text && k != 13 && !(evt.altKey))//end by sj
                 {
                    //add by sj for bug 2650
                    this.prevval = "";
                    //end by sj
                    this.RubyText = "";
                } else //modified by sj for bug 2639
                //else if (k != 32 && k != 229 && !(k >= 112 && k <= 123) && (k != 37 && k != 39) && k != 27)
                //modified by sj for bug 2711 and 2712
                //else if (k != 32 && k != 229 && !(k >= 112 && k <= 123)
                //         && (k != 37 && k != 39) && k != 27 && k != 28 && k != 29)
                if(k != 32 && k != 229 && !(k >= 112 && k <= 123) && (k != 37 && k != 39 && k != 38 && k != 40) && k != 27 && k != 28 && k != 29 && k != 8)//end by sj
                //end by sj
                //if(k != 32 && k != 229 && !(k >= 112 && k <= 123))
                //end by sj
                 {
                    var addruby = this.ConvertReadingIMEString(addval, CharEx);
                    if(input.Utility.IsIE()) {
                        if(this.ImeMode) {
                            //add by sj for bug 2639
                            if((k == 192 || k == 219 || k == 221) && addval.length == 1 && addruby.length == 2) {
                                if(this.RubyText.charAt(this.RubyText.length - 1) == addruby.charAt(0)) {
                                    addruby = addruby.charAt(1);
                                }
                            }
                            //end by sj
                            this.RubyText += addruby;
                        } else {
                            this.ReadingImeOperation();
                        }
                    } else {
                        //firefox
                                            }
                }
            };
            IMTextBox.prototype.IsValidReadingString = function (s) {
                if(s === undefined || s === null || s.length === 0) {
                    return false;
                }
                for(var i = 0; i < s.length; i++) {
                    if(!this.IsValidCharacter(s[i])) {
                        return false;
                    }
                }
                return true;
            };
            IMTextBox.prototype.IsValidCharacter = function (c) {
                var charEx = input.CharProcess.CharEx;
                if(charEx.IsSpace(c)) {
                    return true;
                }
                var charType = charEx.GetCharType(c);
                var sbcsCharType = charType & ~charEx.Ctype.FullWidth;
                if(sbcsCharType == charEx.Ctype.Hiragana || sbcsCharType == charEx.Ctype.Katakana || sbcsCharType == charEx.Ctype.UpperCase || sbcsCharType == charEx.Ctype.LowerCase || sbcsCharType == charEx.Ctype.Numeric || sbcsCharType == charEx.Ctype.Symbol || sbcsCharType == charEx.Ctype.MathSymbol || sbcsCharType == charEx.Ctype.Punctuation || charEx.CharCategory._jpnMixed.indexOf(c) !== -1) {
                    return true;
                }
                return false;
            };
            IMTextBox.prototype.UpdateReadingIME = function (str) {
                this.RubyText = this.ConvertReadingIMEString(str);
                this.ReadingImeOperation();
            };
            IMTextBox.prototype.ConvertReadingIMEString = function (str, charEx) {
                if(charEx === undefined) {
                    charEx = input.CharProcess.CharEx;
                }
                var addruby = "";
                for(var i = 0; i < str.length; i++) {
                    //modified by sj for bug 2639
                    //addruby += CharEx.ToHalfKatakana(addval.charAt(i));
                    var addvalChar = str.charAt(i);
                    var toAdd = charEx.ToHalfKatakana(addvalChar);
                    if(addvalChar == "\u309b") {
                        toAdd = "\uff9e";
                    }
                    if(addvalChar == "\u309c") {
                        toAdd = "\uff9f";
                    }
                    //add by sj for bug 2717
                    if(toAdd == "\uff65") {
                        toAdd = "";
                    }
                    //end by sj
                    addruby += toAdd;
                    //end by sj
                                    }
                return addruby;
            };
            IMTextBox.prototype.AddAllEventsHandler = function () {
                var self = this;
                if(this.GetInputElement() != null) {
                    var mousedownHandler = function (evt) {
                        input.GlobalEventHandler.OnMouseDown(self, evt);
                    };
                    var mouseupHandler = function (evt) {
                        input.GlobalEventHandler.OnMouseUp(self, evt);
                    };
                    var mouseoverHandler = function (evt) {
                        input.GlobalEventHandler.OnMouseOver(self, evt);
                    };
                    var selectstartHandler = function (evt) {
                        input.GlobalEventHandler.OnSelectStart(self, evt);
                    };
                    var keydownHandler = function (evt) {
                        input.GlobalEventHandler.OnKeyDown(self, evt);
                    };
                    var keypressHandler = function (evt) {
                        input.GlobalEventHandler.OnKeyPress(self, evt);
                    };
                    var keyupHandler = function (evt) {
                        input.GlobalEventHandler.OnKeyUp(self, evt);
                    };
                    var dblclickHandler = function (evt) {
                        input.GlobalEventHandler.OnDblClick(self, evt);
                    };
                    var beforecopyHandler = function (evt) {
                        input.GlobalEventHandler.OnHTML5BeforeCopy(self, evt);
                    };
                    var cutHandler = function (evt) {
                        input.GlobalEventHandler.OnHTML5Cut(self, evt);
                    };
                    var pasteHandler = function (evt) {
                        input.GlobalEventHandler.OnHTML5Paste(self, evt);
                    };
                    var dragstartHandler = function (evt) {
                        input.GlobalEventHandler.OnDragStart(self, evt);
                    };
                    var dragendHandler = function (evt) {
                        input.GlobalEventHandler.OnDragEnd(self, evt);
                    };
                    var mouseoutHandler = function (evt) {
                        input.GlobalEventHandler.OnMouseOut(self, evt);
                    };
                    var dropHandler = function (evt) {
                        input.GlobalEventHandler.OnDrop(self, evt);
                    };
                    var touchstartHandler = function (evt) {
                        input.GlobalEventHandler.OnTouchStart(self, evt);
                    };
                    var touchendHandler = function (evt) {
                        input.GlobalEventHandler.OnTouchEnd(self, evt);
                    };
                    var selectHandler = function (evt) {
                        input.GlobalEventHandler.OnSelect(self, evt);
                    };
                    // Frank Liu fixed bug 662 at 2013/07/10.
                    //safari
                    if(input.Utility.safari) {
                        var safari_dragenterHandler = function (evt) {
                            self._safariDropText = getSelection().toString();
                        };
                        var safari_dragleaveHandler = function (evt) {
                            self._safariDropText = null;
                        };
                        this.GetJQueryInputElement().on({
                            'dragenter.imtextbox': safari_dragenterHandler,
                            'dragleave.imtextbox': safari_dragleaveHandler
                        });
                    }
                    var dragenterHandler = function (evt) {
                        input.GlobalEventHandler.OnDragEnter(self, evt);
                    };
                    var dragleaveHandler = function (evt) {
                        input.GlobalEventHandler.OnDragLeave(self, evt);
                    };
                    //// HelenLiu 2013/06/13 fix bug 657 in IM HTML5.
                    ////IE9的问题在于：
                    ////1. 按键BackSpace / 按键Delete / 拖拽 / 剪切 / 删除，不会触发propertychange和input事件
                    //// 2. addEventListener绑定的propertychange事件任何情况都不会触发，但attachEvent绑定的propertychange事件则在除问题1之外的情况下能够触发。
                    ////3. 基于问题2的原因，使用jQuery绑定的propertychange事件在IE9下永远不会触发，因为它是调用addEventListener来绑定的
                    if(input.Utility.IsIE7OrLater() && (!input.Utility.IsIE11OrLater())) {
                        var onpropertychangeHandler = function (evt) {
                            input.GlobalEventHandler.OnPropertyChanged(self, evt);
                        };
                        this.GetJQueryInputElement().on({
                            'onpropertychange.imtextbox': onpropertychangeHandler
                        });
                    } else {
                        var propertychangeHandler = function (evt) {
                            input.GlobalEventHandler.OnPropertyChanged(self, evt);
                        };
                        this.GetJQueryInputElement().on({
                            'propertychange.imtextbox': propertychangeHandler
                        });
                    }
                    var compositionstartHandler = function (evt) {
                        input.GlobalEventHandler.OnCompositionStart(self, evt);
                    };
                    var compositionupdateHandler = function (evt) {
                        input.GlobalEventHandler.OnCompositionUpdate(self, evt);
                    };
                    var compositionendHandler = function (evt) {
                        input.GlobalEventHandler.OnCompositionEnd(self, evt);
                    };
                    if(input.Utility.IsIE10OrLater()) {
                        var MSPointerUpHandler = function (evt) {
                            input.GlobalEventHandler.OnMSPointerUp(self, evt);
                        };
                        var MSPointerDownHandler = function (evt) {
                            input.GlobalEventHandler.OnMSPointerDown(self, evt);
                        };
                        var MSGestureTapHandler = function (evt) {
                            input.GlobalEventHandler.OnMSGestureTap(self, evt);
                        };
                        this.GetJQueryInputElement().on({
                            'MSPointerUp.imtextbox': MSPointerUpHandler,
                            'MSPointerDown.imtextbox': MSPointerDownHandler,
                            'MSGestureTap.imtextbox': MSGestureTapHandler
                        });
                    }
                    var blurHandler = function (evt) {
                        input.GlobalEventHandler.OnEditFieldLoseFocus(self, evt);
                    };
                    var focusoutHandler = function (evt) {
                        input.GlobalEventHandler.OnFocusOut(self, evt);
                    };
                    var focusHandler = function (evt) {
                        input.GlobalEventHandler.OnEditFieldFocus(self, evt);
                    };
                    var activateHandler = function (evt) {
                        input.GlobalEventHandler.OnActivate(self, evt);
                    };
                    var deactivateHandler = function (evt) {
                        input.GlobalEventHandler.OnDeActivate(self, evt);
                    };
                    if(input.Utility.GetClientOS() === "Android") {
                        var webkitEditableContentChangedHandler = function (evt) {
                            input.GlobalEventHandler.OnWebkitEditableContentChanged(self, evt);
                        };
                        this.GetJQueryInputElement().on({
                            'webkitEditableContentChanged.imtextbox': webkitEditableContentChangedHandler
                        });
                    }
                    this.GetJQueryInputElement().on({
                        'mousedown.imtextbox': mousedownHandler,
                        'mouseup.imtextbox': mouseupHandler,
                        'selectstart.imtextbox': selectstartHandler,
                        'keydown.imtextbox': keydownHandler,
                        'keypress.imtextbox': keypressHandler,
                        'keyup.imtextbox': keyupHandler,
                        'dblclick.imtextbox': dblclickHandler,
                        'beforecopy.imtextbox': beforecopyHandler,
                        'cut.imtextbox': cutHandler,
                        'paste.imtextbox': pasteHandler,
                        'dragstart.imtextbox': dragstartHandler,
                        'dragend.imtextbox': dragendHandler,
                        'mouseout.imtextbox': mouseoutHandler,
                        'drop.imtextbox': dropHandler,
                        'touchstart.imtextbox': touchstartHandler,
                        'touchend.imtextbox': touchendHandler,
                        'select.imtextbox': selectHandler,
                        'dragenter.imtextbox': dragenterHandler,
                        'dragleave.imtextbox': dragleaveHandler,
                        'compositionstart.imtextbox': compositionstartHandler,
                        'compositionupdate.imtextbox': compositionupdateHandler,
                        'compositionend.imtextbox': compositionendHandler,
                        'blur.imtextbox': blurHandler,
                        'focusout.imtextbox': focusoutHandler,
                        'focus.imtextbox': focusHandler,
                        'activate.imtextbox': activateHandler,
                        'deactivate.imtextbox': deactivateHandler
                    });
                    $(this.GetJQueryInputElement()[0].parentElement).on("mouseover", mouseoverHandler);
                }
            };
            IMTextBox.prototype.WebkitEditableContentChanged = function (evt) {
                var self = this;
                var iMeHandler = function () {
                    try  {
                        self.ImeInput();
                    }finally {
                        self.ImeMode = false;
                    }
                };
                setTimeout(iMeHandler, 0);
            };
            IMTextBox.prototype.KeyDown = function (evt) {
                var _this = this;
                var k = evt.keyCode;
                var funcKeysPressed = new Object();
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
                this.LastInputText = this.GetText();
                this.isFuncKeyPressed = false;
                if(/*(!this.ContextMenu.IsShow()) &&*/ (!this.PasswordMode) && (!this.MultiLine) && (this.EnableAutoComplete)) {
                    var retAC = this._autoComplete.KeyDown(evt);
                    if(retAC != null && retAC == false) {
                        return;
                    }
                }
                ;
                this.KeyDownAction = true;
                //Add for contextmenu shortcut
                //var ret;
                //if (this.ContextMenu.IsShow()) {
                //    // Added HotKeys by shenyuan at 2005-12-27
                //    // Up, Down, Enter, U(Undo), T(Cut), C(Copy), P(Paste), D(Delete), A(SelectAll)
                //    if (k == 38 || k == 40 || k == 13 || k == 85 || k == 84 || k == 67 || k == 80 || k == 68 || k == 65) {
                //        this.ContextMenu.KeyDown(evt);
                //    }
                //    if (k == 27 || k == 18) {
                //        this.ContextMenu.Close();
                //    }
                //    // Add comments by Yang at 9:37 Sep. 3th 2007
                //    // For event.keyCode is readonly in firefox.
                //    // BTW, i think the following codes is wrong in ie. It should be deleted.
                //    //if (k == 38 || k == 40 || k == 33 || k == 34)//For bug 3914
                //    if (Utility.IsIE() && (k == 38 || k == 40 || k == 33 || k == 34)) {
                //        ret = new Object();
                //        ret.KeyCode = 37;
                //        return ret;
                //    }
                //    // End by Yang
                //    return false;
                //}
                //bug#5599
                //this.ImeMode = false;
                if((k == 229 && !this.IsJapanConvertKeyPress) || (k == 13 && this.GetText() != this.Text)) {
                    this.ImeMode = true;
                    return true;
                } else {
                    if(this.ImeMode) {
                        // Add comments by Yang at 10:40 May 14 2007
                        // For fix bug 7963
                        //var _conditions = funcKeysPressed.Shift || funcKeysPressed.Alt || funcKeysPressed.Ctrl || (k == 20) || ((k >= 112) && (k <= 123));
                        var _conditions = funcKeysPressed.Shift || funcKeysPressed.Ctrl || (k == 20) || ((k >= 112) && (k <= 123));
                        // End by Yang
                        //add by sj for bug 1430
                        _conditions = _conditions || (k == 8 && !input.Utility.IsIE());
                        //end by sj
                        if(!_conditions) {
                            // Add comments by Yang at 14:41 May 29 2007
                            // For fix bug 8230
                            this.ImeInput("ReInput", true, evt);
                            //this.ImeInput("DirectInput");
                            // End by Yang
                            this.ImeSelectTimes = 0;
                            this.ImeMode = false;
                        }
                    }
                    if(k == 229 && this.IsJapanConvertKeyPress) {
                        this.IsJapanConvertKeyPress = false;
                    }
                }
                var retInfo = new Object();
                if(funcKeysPressed.Shift) {
                    k |= 65536;
                }
                if(funcKeysPressed.Ctrl) {
                    k |= 131072;
                }
                if(funcKeysPressed.Alt && k === 40) {
                    var keyAction = "DropDown";
                }
                if(funcKeysPressed.Alt) {
                    k |= 262144;
                }
                // Modified by shenyuan at 2006-01-04 for bug 4756.
                // The priority sequence in multiline mode will be AcceptReturn &gt shortcut &gt post back.
                //if (!(k == 13) || (!this.MultiLine) || (!this.AcceptReturn)) {
                //    var keyAction = this.UIProcess.GetKeyActionName(k, this.Shortcuts);
                //}
                // Add by Jiang at Oct. 28 2008
                // for fixed bug10160
                var isBlockByShortcut = false;
                var i;
                if(this.KeyActionList != null) {
                    for(i = 0; i < this.KeyActionList.length; i++) {
                        if(this.KeyActionList[i] == k.toString()) {
                            isBlockByShortcut = true;
                            break;
                        }
                    }
                }
                // end by Jiang
                // Add for DropDown Edit
                if((keyAction == "DropDown") || (k == 262182 || k == 262184) && !isBlockByShortcut) {
                    return false;
                }
                // end by yangyang
                if((95 < k) && (k < 106)) {
                    k = k - 48;
                }
                var selectionstart = this.SelectionStart;
                var selectionend = this.SelectionEnd;
                var text = this.GetText();
                var bufftext = this.BuffText;
                var lasttext = this.LastText;
                var lastselectionstart = this.LastSelectionStart;
                var lastselectionend = this.LastSelectionEnd;
                if(!this.MultiLine) {
                    selectionstart = this.DropDownEditData.SelectionStart;
                    selectionend = this.DropDownEditData.SelectionEnd;
                    text = this.DropDownEditData.Text;
                    bufftext = this.DropDownEditData.BuffText;
                    lasttext = this.DropDownEditData.LastText;
                    lastselectionstart = this.DropDownEditData.LastSelectionStart;
                    lastselectionend = this.DropDownEditData.LastSelectionEnd;
                }
                retInfo = this.UIProcess.TextBoxKeyDown(k, funcKeysPressed, this._getEditModeInternal(), this.Overwrite, selectionstart, selectionend, this.ReadOnly, this.MaxLength, this.LengthAsByte, this.MaxLineCount, this.CountWrappedLine, this.ExitOnLastChar, this.ExitOnLeftRightKey, this.MultiLine, this.PasswordMode, text, this.AcceptTab, this.AcceptReturn, bufftext, //01-13
                lasttext, lastselectionstart, lastselectionend, keyAction, evt);
                if(retInfo == null) {
                    return false;
                }
                if(retInfo.inputChar != null) {
                    return true;
                }
                if(retInfo.InputTab == true) {
                    //bug#5528
                    this.Text = this.GetText();
                    // Add comments by Yang at 8:32 Sep. 10th 2007
                    // For now the keypress function is the event handler.
                    // We should use the internal method innerkeypress.
                    //this.KeyPress("\t");
                    this.InnerKeyPress("\t");
                    // End by Yang
                                    }
                // Modified by shenyuan at 2006-01-13 for new undo rules
                if(retInfo.DelInclude) {
                    // Added by shenyuan at 2006-02-27 for reopened bug #5385.
                    this.IsUndoAfterDel = true;
                    if(!retInfo.SerialDel) {
                        this.BuffText = this.GetText();
                        this.LastSelectionStart = this.BuffText.GetLength();
                        this.LastSelectionEnd = this.BuffText.GetLength();
                        if(!this.MultiLine) {
                            this.DropDownEditData.BuffText = this.DropDownEditData.Text;
                            this.DropDownEditData.LastSelectionStart = this.DropDownEditData.BuffText.GetLength();
                            this.DropDownEditData.LastSelectionEnd = this.DropDownEditData.BuffText.GetLength();
                        }
                    }
                }
                if(retInfo.Text != null) {
                    if(retInfo.Undo == true) {
                        this.LastText = this.Text;
                        // Modified by shenyuan at 2006-01-13 for new undo rules
                        this.BuffText = this.LastText;
                        if(!this.MultiLine) {
                            this.DropDownEditData.LastText = this.DropDownEditData.Text;
                            this.DropDownEditData.BuffText = this.DropDownEditData.LastText;
                        }
                    }
                    // Add comments by Yang at 14:56 January 30th 2008
                    // For fix the bug 9623
                    //this.InternalSetText(retInfo.Text, true);
                    this.DirectSetText(retInfo.Text);
                    if(!this.MultiLine) {
                        this.DropDownEditData.Text = retInfo.Text;
                    }
                    // End by Yang
                                    }
                // add by Sean Huang at 2009.01.06, for bug 1454 -->
                var oldLength = this.GetSelectionLength();
                // end of Sean Huang <--
                if(retInfo.SelectionStart != null) {
                    if(retInfo.Undo == true) {
                        this.isFuncKeyPressed = true;
                        this.LastSelectionStart = this.SelectionStart;
                        if(!this.MultiLine) {
                            this.DropDownEditData.LastSelectionStart = this.DropDownEditData.SelectionStart;
                        }
                    }
                    this.SelectionStart = retInfo.SelectionStart;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionStart = this.SelectionStart;
                        this.SelectionStart = this.GetSingleCurPosition(this.DropDownEditData.Text, retInfo.SelectionStart);
                    }
                }
                if(retInfo.SelectionEnd != null) {
                    if(retInfo.Undo == true) {
                        this.LastSelectionEnd = this.SelectionEnd;
                        if(!this.MultiLine) {
                            this.DropDownEditData.LastSelectionEnd = this.DropDownEditData.SelectionEnd;
                        }
                    }
                    this.SelectionEnd = retInfo.SelectionEnd;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionEnd = this.SelectionEnd;
                        this.SelectionEnd = this.GetSingleCurPosition(this.DropDownEditData.Text, retInfo.SelectionEnd);
                    }
                }
                // add by Sean Huang at 2009.01.06, for bug 1454 -->
                var newLength = this.GetSelectionLength();
                // end of Sean Huang <--
                if(retInfo.KeyCode != null) {
                    var ret = new Object();
                    ret.KeyCode = retInfo.KeyCode;
                    return ret;
                }
                if(retInfo.FocusType != null) {
                    this.FocusType = retInfo.FocusType;
                }
                if(retInfo.Overwrite != null) {
                    if(this.GetOverwrite() != retInfo.Overwrite) {
                        if(this._getEditModeInternal() == input.EditMode.Insert) {
                            this._setEditModeInternal(input.EditMode.Overwrite);
                        } else if(this._getEditModeInternal() == input.EditMode.Overwrite) {
                            this._setEditModeInternal(input.EditMode.Insert);
                        }
                    }
                    // Frank Liu fixed bug 1029 at 2013/07/10.
                    //this.Overwrite = retInfo.Overwrite;
                                    }
                if(retInfo.EventInfo != null) {
                    for(i = 0; i < retInfo.EventInfo.length; i++) {
                        if(retInfo.EventInfo[i] != null) {
                            // change by Sean Huang at 2008.10.30, for bug 9908 -->
                            ////Add comments by Ryan Wu at 11:30 Apr. 5 2007.
                            ////For support Aspnet Ajax 1.0.
                            ////this.UIProcess.FireEvent(this, retInfo.EventInfo[i].Name, retInfo.EventInfo[i].Args);
                            //this.UIProcess.FireEvent(this, retInfo.EventInfo[i].Name, retInfo.EventInfo[i].Args, retInfo.EventInfo[i].Type);
                            ////end by Ryan Wu.
                            if(retInfo.EventInfo[i].Type == "KeyExit") {
                                this.EventInfo = retInfo.EventInfo[i];
                            } else {
                                //Add comments by Ryan Wu at 11:30 Apr. 5 2007.
                                //For support Aspnet Ajax 1.0.
                                //this.UIProcess.FireEvent(this, retInfo.EventInfo[i].Name, retInfo.EventInfo[i].Args);
                                this.UIProcess.FireEvent(this, retInfo.EventInfo[i].Name, retInfo.EventInfo[i].Args, retInfo.EventInfo[i].Type);
                                //end by Ryan Wu.
                                                            }
                            // end of Sean Huang <--
                                                    }
                    }
                }
                if(retInfo.System != null) {
                    setTimeout(function () {
                        if(retInfo.System && _this.InputElement.value === "") {
                            _this.Clear();
                        }
                    }, 0);
                    return retInfo.System;
                } else {
                    if(retInfo.SetSelection == true) {
                        if(oldLength == 0 && newLength != 0) {
                            input.Utility.ShouldFireOnSelectStart = true;
                        } else {
                            input.Utility.ShouldFireOnSelectStart = false;
                        }
                        this.SetSelection(this.SelectionStart, this.SelectionEnd);
                        input.Utility.ShouldFireOnSelectStart = false;
                    }
                    return false;
                }
            };
            IMTextBox.prototype.KeyPress = function (text, evt, NoUpdateDisplay) {
                var inputText = text;
                if(!input.Utility.IsIE() && this.ImeMode) {
                    var _conditions = (evt.keyCode == 192) && evt.altKey;
                    if(_conditions) {
                        this.ImeInput("ReInput", true, evt);
                        this.ImeSelectTimes = 0;
                        this.ImeMode = false;
                        return;
                    }
                }
                if(!input.Utility.IsIE() && evt.charCode == 0) {
                    // Add comments by Yang at 16:08 Sep. 12th 2007
                    // For fix the bug 8805
                    //if (!event.ctrlKey || event.which != 13)
                    var keycode = evt.keyCode || evt.charCode;
                    if(keycode = 13 && (!this.MultiLine || (!this.AcceptReturn && this.MultiLine && !evt.ctrlKey)))// End by Yang
                     {
                        return true;
                    }
                }
                return this.InnerKeyPress(inputText, NoUpdateDisplay);
            };
            IMTextBox.prototype.KeyUp = function (evt) {
                if(/*!this.ContextMenu.IsShow() && */ !this.PasswordMode && !this.MultiLine && this.EnableAutoComplete) {
                    // Add comments by Owen Xu at 11:49 June 20 2007
                    // For fix the bug 8519
                    // 8519 Bug Reason:
                    // If Edit1 have not added a history in history list, __AutoComplete["Edit1"] will not exist.
                    // So code "__AutoComplete[this.ID]['isVisible']" will cause an exception and the following key process will never be executed.
                    // Solution:
                    // Add judgement code:
                    // if (__AutoComplete[this.ID] != null)
                    // {
                    // }
                    //to check if __AutoComplete["Edit1"] exists.  If it doesn't exist, it is not necessary to execute the code of historylist(AutoComplete).
                    // Thus the following key process will be executed anyway, no matter __AutoComplete["Edit1"] exists or not.
                    if((evt.keyCode == 8 || evt.keyCode == 46 || evt.keyCode == 9) && this.GetText() == "") {
                        if(!this._autoComplete.GetIsDeleteItem()) {
                            this._autoComplete.HideDropdown();
                        }
                        //moved by sj
                        //isDeleteItem = false;
                        //end by sj
                                            } else if(this.isFuncKeyPressed) {
                        this._autoComplete.HideDropdown();
                    } else {
                        if(this.LastInputText != this.GetText() && this.GetText() != "") {
                            this._autoComplete.KeyUp(evt);
                        }
                    }
                    //moved by sj
                    this._autoComplete.SetIsDeleteItem(false);
                    //end by sj
                                    }
                // End by Owen Xu
                this.KeyDownAction = false;
                var k = evt.keyCode;
                var CharEx = input.CharProcess.CharEx;
                //modified by sj for bug 869
                //only occur when using hand writing
                if(k == 13 && this._getInputValueWithPlaceHolder() != this.Text) {
                    if(input.Utility.IsIE() && this.ImeMode) {
                        this.HasValidatedImeInput = false;
                    } else if(!input.Utility.IsIE()) {
                        this.ImeMode = true;
                    }
                }
                //end by sj
                if(this.ImeMode == true) {
                    //// if input from ime mode, close the context menu.
                    //if (this.ContextMenu.IsShow()) {
                    //    this.ContextMenu.Close();
                    //}
                    //var k = event.keyCode;
                    //var CharEx = new CharProcess();
                    var nowText = this._getInputValueWithPlaceHolder();
                    var inputText = nowText;
                    if(this.SelectionEnd < this.Text.GetLength()) {
                        var lastLength = this.Text.GetLength() - this.SelectionEnd;
                        inputText = nowText.Substring(0, nowText.GetLength() - lastLength);
                    }
                    inputText = inputText.Substring(inputText.GetLength() - 1, inputText.GetLength());
                    if(k == 13) {
                        this.ImeInput("DirectInput", undefined, evt);
                        this.ImeSelectTimes = 0;
                        //this.OrientText = "";
                                            } else //For number :1,select;2,input.
                    if((k >= 48 && k <= 57) || (k >= 96 && k <= 105)) {
                        if(k >= 96) {
                            k = k - 48;
                        }
                        inputText = CharEx.ToHalfWidth(inputText);
                        if(inputText != String.fromCharCode(k) && !this.ImeSelect) {
                            this.HasValidatedImeInput = false;
                        } else if(inputText == String.fromCharCode(k) && this.ImeSelectTimes < 1) {
                            // Add comments by Yang at 16:59 Sep. 25th 2007
                            // For fix bug 8715
                            this.HasValidatedImeInput = false;
                            // End by Yang
                                                    } else if(this.ImeSelect) {
                        } else {
                            this.ImeInput("ReInput", undefined, evt);
                            // Add comments by Yang at 16:59 Sep. 25th 2007
                            // For fix bug 8715
                            this.HasValidatedImeInput = false;
                            // End by Yang
                            this.ImeMode = true;
                        }
                        this.ImeSelectTimes = 0;
                    } else //For space key
                    if(k == 32) {
                        if(this.ImeSelect == false) {
                            if(this.ImeSelectTimes == 1) {
                                this.ImeSelect = true;
                            } else {
                                //For bug 3442
                                if(CharEx.ToHalfWidth(inputText) != String.fromCharCode(k)) {
                                    this.ImeSelectTimes++;
                                } else//For bug 4439
                                 {
                                    //add by sj for bug NKOI-2CFFC8879
                                    if(this.HasValidatedImeInput) {
                                        //end by sj
                                        this.UIProcess.inputJap = true;
                                        // Add comments by Yang at 14:10 October 24th 2007
                                        // For fix the bug from Japan.
                                        // We can not input space in Edit when IME mode is on.
                                        if(input.Utility.IsIE()) {
                                            this.HasValidatedImeInput = false;
                                        }
                                        // End by Yang
                                        // Add for bug 6677
                                        this.ImeInput("DirectInput", undefined, evt);
                                        this.ImeSelectTimes = 0;
                                        // end
                                        //add by sj for bug NKOI-2CFFC8879
                                                                            }
                                    //end by sj
                                                                    }
                            }
                        }
                        //this.OrientText = this.ImeInput("Record");
                                            } else if(k >= 65 && k <= 90) {
                        this.ImeSelectTimes = 0;
                        // Add comments by Yang at 16:59 Sep. 25th 2007
                        // For fix bug 8715
                        this.HasValidatedImeInput = false;
                        // End by Yang
                                            } else // for symbol charactors
                    if(k == 32 || k == 106 || k == 107 || k == 109 || (k == 173 && input.Utility.IsFireFox4OrLater()) || k == 110 || k == 111 || k == 219 || // Add comments by Yang at 11:07 January 21th 2008
                    // For fix bug 5440
                    //|| k == 220 || k == 221 || k == 222 || (k >= 186 && k <= 192) )
                    k == 220 || k == 221 || k == 222 || (k >= 186 && k <= 192) || k == 226)// End by Yang
                     {
                        if(this.ImeSelectTimes >= 1) {
                            this.ImeInput("ReInput", undefined, evt);
                        }
                        this.ImeSelectTimes = 0;
                        // Add comments by Yang at 17:07 Sep. 25th 2007
                        // For fix bug 8715
                        if(input.Utility.IsIE()) {
                            this.HasValidatedImeInput = false;
                        }
                        // End by Yang
                                            } else // for Up and Down to expand select dialog
                    if(k == 40 || k == 38) {
                        if(this.ImeSelect == false) {
                            if(this.ImeSelectTimes == 1) {
                                this.ImeSelect = true;
                            }
                        }
                    } else if(k == 8 || k == 46) {
                        this.ImeSelectTimes = 0;
                    } else // for Bug 6724
                    if(k == 27) {
                        this.ImeSelectTimes = 0;
                    } else if(k == 244) {
                        this.IsJapanConvertKeyPress = true;
                    } else // Add comments by Yang at 13:45 Aug. 28th 2007
                    // For the ime switch key "~" is different for Firefox and IE.
                    if(!input.Utility.IsIE() && k == 243) {
                        this.ImeInput("ReInput", true, evt);
                        this.ImeSelectTimes = 0;
                        this.ImeMode = false;
                    } else // End by Yang
                    // Add comments by Yang at 16:35 Dec. 2th 2008
                    // For fix the bug TTP 1070
                    if(input.Utility.IsIE() && k == 229) {
                        this.HasValidatedImeInput = false;
                    } else// End by Yang
                     {
                    }
                }
                //return false;
                //2012/08/17, Robin, Hotfix Bug#33.(IME mode is changed by Caps lock key, the text is cleared.)
                // shift+CapsLock on US Keyboard or CapsLocak on JP Keyboard, a key up 242 will fired
                if(k == 242) {
                    this.ImeInput("ReInput", true, evt);
                }
                //End Hotfix Bug#33
                //add by sj for readingimestringoutput
                this.ReadingImeKeyUpProcess(k, CharEx, evt);
                //end by sj
                if(this.UIProcess.keyupResponse == true) {
                    this.UIProcess.keyupResponse = false;
                    var retInfo = this.UIProcess.TextBoxKeyUp(this.InputElement, this.MultiLine, //this.GetLines(),
                    this.SelectionStart, this.SelectionEnd, this.GetText());
                    var oldstart = this.SelectionStart;
                    var oldend = this.SelectionEnd;
                    var isStartChanged = false;
                    var isEndChanged = false;
                    if(!this.MultiLine) {
                        oldstart = this.DropDownEditData.SelectionStart;
                        oldend = this.DropDownEditData.SelectionEnd;
                    }
                    if(retInfo.SelectionStart != null) {
                        if(this.SelectionStart != retInfo.SelectionStart) {
                            isStartChanged = true;
                            this.SelectionStart = retInfo.SelectionStart;
                            if(!this.MultiLine) {
                                this.DropDownEditData.SelectionStart = this.GetMultiPosition(this.DropDownEditData.Text, this.SelectionStart);
                            }
                        }
                    }
                    if(retInfo.SelectionEnd != null) {
                        if(this.SelectionEnd != retInfo.SelectionEnd) {
                            this.SelectionEnd = retInfo.SelectionEnd;
                            this.SelectionLength = Math.abs(this.SelectionEnd - this.SelectionStart);
                            isEndChanged = true;
                            if(!this.MultiLine) {
                                this.DropDownEditData.SelectionEnd = this.GetMultiPosition(this.DropDownEditData.Text, this.SelectionEnd);
                            }
                        }
                    }
                    var onText = this._getInputValueWithPlaceHolder();
                    var temp = this.MultiLine ? this.Text : this.GetSingleText(this.Text);
                    var count = temp.GetLength() - onText.GetLength();
                    var temptext;
                    if(!this.MultiLine) {
                        if(count != 0) {
                            temptext = this.DropDownEditData.Text;
                            if(isStartChanged && isEndChanged) {
                                this.DropDownEditData.Text = temptext.Substring(0, this.DropDownEditData.SelectionStart) + temptext.Substring(oldend, temptext.GetLength());
                            } else if(!isStartChanged) {
                                oldend = this.GetMultiPosition(temptext, this.SelectionStart + count);
                                this.DropDownEditData.Text = temptext.Substring(0, oldstart) + temptext.Substring(oldend, temptext.GetLength());
                            }
                        }
                        temp = this.GetSingleText(this.DropDownEditData.Text);
                    } else if(this.PasswordMode) {
                        if(count != 0) {
                            temptext = this.Text;
                            if(isStartChanged && isEndChanged) {
                                temp = temptext.Substring(0, this.SelectionStart) + temptext.Substring(oldend, temptext.GetLength());
                            } else if(!isStartChanged) {
                                oldend = this.SelectionStart + count;
                                temp = temptext.Substring(0, oldstart) + temptext.Substring(oldend, temptext.GetLength());
                            }
                        }
                    } else {
                        temp = this.GetText();
                    }
                    if(retInfo.SystemEdit == true) {
                        //		        this.Text = this.GetText();
                        //				this.UIUpdate.SetHideText(this.GetText() + ":true");
                        this.Text = temp;
                        // Add comments by Yang at 14:35 August 7th 2007
                        // For improve the performance for v2h1
                        this.SetHideText(temp);
                        //this.UIUpdate.SetHideText(temp + ":true");
                        // End by Yang
                                            }
                    if(retInfo.Text != null) {
                        this.InternalSetText(retInfo.Text, true);
                    }
                    if(retInfo.SetSelection == true) {
                        this.SetSelection(this.SelectionStart, this.SelectionEnd);
                    }
                }
                //this.KeyboardAction = false;
                            };
            IMTextBox.prototype.PropertyChange = function (evt) {
                if(evt != null && input.Utility.IsIE10OrLater()) {
                    if(evt.propertyName == "value") {
                        //this.UpdateFishEyeButtonStatus();
                        //if (this.AddressObj != null) {
                        //    this.AddressObj.SearchByAutocomplete(this.ID, this.GetText());
                        //}
                                            }
                }
                if(this.DragEdit)//For DragStart
                 {
                    this.DragEdit = false;
                    if(!this.MultiLine) {
                        if(this.Text != this.GetText()) {
                            this.DropDownEditData.OldText = this.DropDownEditData.Text;
                            this.DropDownEditData.Text = this.DropDownEditData.Text.Substring(0, this.DropDownEditData.SelectionStart) + this.DropDownEditData.Text.Substring(this.DropDownEditData.SelectionEnd, this.DropDownEditData.Text.GetLength());
                            this.DropDownEditData.LastText = this.DropDownEditData.OldText;
                            this.DropDownEditData.SelectionEnd = this.DropDownEditData.SelectionStart;
                        }
                    }
                    this.OldText = this.Text;
                    this.Text = this.GetText();
                    // Add comments by Yang at 14:35 August 7th 2007
                    // For improve the performance for v2h1
                    this.SetHideText(this.GetText());
                    //this.UIUpdate.SetHideText(this.GetText() + ":true");
                    // End by Yang
                    this.SystemChange = true;
                    this.LastText = this.OldText;
                    this.SetSelectionLength(0);
                } else if(this.DropEdit) {
                    this.DropEdit = false;
                    this.FocusType = input.FocusType.DragDrop//For bug 4245
                    ;
                    this.SelectionStart = input.Utility.GetSelectionStartPosition(this.InputElement);
                    this.SelectionEnd = this.SelectionStart + input.Utility.GetSelectionText(this.InputElement).GetLength();
                    var nowText = this._getInputValueWithPlaceHolder();
                    if(!this.MultiLine) {
                        var insertText;
                        var oldText = this.GetSingleText(this.DropDownEditData.Text);
                        var insertTextLength = nowText.GetLength() - oldText.GetLength();
                        //			    if (this.PasswordMode && !this.UseSystemPasswordChar)
                        if(this.PasswordMode) {
                            insertText = this.DropText;
                        } else {
                            insertText = nowText.Substring(this.SelectionEnd - insertTextLength, this.SelectionEnd);
                        }
                        if(insertTextLength != 0) {
                            this.DropDownEditData.OldText = this.DropDownEditData.Text;
                            this.DropDownEditData.SelectionStart = this.GetMultiPosition(this.DropDownEditData.Text, this.SelectionEnd - insertTextLength);
                            this.DropDownEditData.Text = this.DropDownEditData.Text.Substring(0, this.DropDownEditData.SelectionStart) + insertText + this.DropDownEditData.Text.Substring(this.DropDownEditData.SelectionStart, this.DropDownEditData.Text.GetLength());
                            this.DropDownEditData.LastText = this.DropDownEditData.OldText;
                            this.DropDownEditData.SelectionEnd = this.DropDownEditData.SelectionStart + insertTextLength;
                        }
                        //			    if (this.PasswordMode && !this.UseSystemPasswordChar)
                        if(this.PasswordMode) {
                            nowText = this.GetSingleText(this.DropDownEditData.Text);
                        }
                    } else if(this.PasswordMode) {
                        var start = this.SelectionEnd - this.DropText.GetLength();
                        nowText = this.Text.Substring(0, start) + this.DropText + this.Text.Substring(start, this.Text.GetLength());
                    }
                    this.OldText = this.Text//Added for Bug 3636
                    ;
                    this.Text = nowText;
                    // Add comments by Yang at 14:35 August 7th 2007
                    // For improve the performance for v2h1
                    this.SetHideText(nowText);
                    //this.UIUpdate.SetHideText(nowText + ":true");
                    // End by Yang
                    this.SystemChange = true;
                    this.LastText = this.OldText;
                } else {
                    //			if(!this.MultiLine && !this.isTextEllipsis && (!this.PasswordMode || this.UseSystemPasswordChar))
                    if(!this.MultiLine && !this.isTextEllipsis && !this.PasswordMode) {
                        // Add comments by Yang at 14:35 August 7th 2007
                        // For improve the performance for v2h1
                        this.SetHideText(this.GetText());
                        //this.UIUpdate.SetHideText(this.GetText() + ":true");
                        // End by Yang
                                            }
                }
                return false;
            };
            IMTextBox.prototype.MouseDown = function (evt) {
                this._isInnerKeyPressCall = false;
                var mouseButton = input.Utility.GetMouseButton(evt);
                this.FocusedWhenMouseDown = document.activeElement == evt.target;
                this.MouseDownOnClearButton = input.Utility.IsMouseDownOnClearButton(evt);
                // Add comments by Yang at 13:47 Aug. 28th 2007
                // For Firefox doesn't support document.activeElement
                if(!input.Utility.IsIE()) {
                    this.IsActive = true;
                    // Add comments by Yang at 12:28 Sep. 15th 2007
                    // For fix the bug 8843
                    //modified by sj for bug 2408, 2409, 2977 Japan(NKOI-566BC9866)
                    //this.DropDownObj.IsDropDownRaisePostBack = false;
                    //if (this.DropDownObj) {
                    //    this.DropDownObj.IsDropDownRaisePostBack = false;
                    //}
                    //end by sj
                    // End by Yang
                    // Add comments by Yang at 15:58 Sep. 24th 2007
                    // For fix bug 8794 comment #2
                    if(this.ImeMode && mouseButton == input.MouseButton.Left) {
                        this.IsImplementImeInput = true;
                    }
                    // End by Yang
                                    }
                // End by Yang
                this.MouseButton = mouseButton;
                this.BeforeDragSelectionStart = this.SelectionStart;
                this.BeforeDragSelectionEnd = this.SelectionEnd;
                if(this.MouseButton == input.MouseButton.Right) {
                    // change by Sean Huang at 2009.02.09, for bug 1791 -->
                    //this.FocusType = FocusType.Click;
                    if(this.FocusType != input.FocusType.ClientEvent) {
                        this.FocusType = input.FocusType.Click;
                    }
                    // end of Sean Huang <--
                    // Add comments by Yang at 16:03 Sep.14th 2007
                    // For fix bug 8675
                    //if (this.ContextMenu.IsShow()) {
                    //    this.ContextMenu.Close();
                    //}
                    // End by Yang
                                    } else//MouseButton.Left
                 {
                    this.isLeftMouseButtonPressed = true;
                    // change by Sean Huang at 2009.02.09, for bug 1791 -->
                    //this.FocusType = FocusType.Click;
                    if(this.FocusType != input.FocusType.ClientEvent) {
                        this.FocusType = input.FocusType.Click;
                    }
                    // end of Sean Huang <--
                    //if (this.ContextMenu.IsShow()) {
                    //    this.ContextMenu.Close();
                    //}
                    try  {
                        // Add comments by Yang at 10:46 Aug.15th 2007
                        // For firefox doesn't support document.selection and its' methods.
                        //Terry jQuery Control
                        //var RealID = this.ID + Utility.EditFieldSuffix;
                        //if (this.IsjQueryControl == true) {
                        //    RealID = this.ID;
                        //}
                        var stext = input.Utility.GetSelectionText(this.InputElement);
                        if(stext != "") {
                            this.IsMouseDown = true;
                            // Add comments by Yang at 9:51 Aug. 15th 2007
                            // For support the selection emtpy in Firefox.
                            input.Utility.ClearSelection(this.InputElement);
                            //document.selection.empty();
                            // End by Yang
                                                    }
                    } catch (e) {
                    }
                }
                var retInfo = this.UIProcess.TextBoxMouseDown(this.InputElement, mouseButton);
                //this.UIProcess.isDblClick = false;
                if(retInfo == null) {
                    return;
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                }
            };
            IMTextBox.prototype.MouseUp = function (evt) {
                var funcKeysPressed = null;
                // Add comments by Yang at 13:48 Aug. 28th 2007
                // For Firefox doesn't support document.activeElement
                //if (!Utility.IsIE()) {
                //delete by sj for bug 870 & 1159 on ttp
                //this.IsActive = true;
                //end by sj
                // Add comments by Yang at 12:28 Sep. 15th 2007
                // For fix the bug 8843
                //this.DropDownObj.IsDropDownRaisePostBack = false;
                // End by Yang
                // }
                // End by Yang
                //add by sj for readingImeStringOutput
                if(input.Utility.IsIE() && this.ImeMode) {
                    this.ReadingImeOperation();
                }
                //end by sj
                this.IsMouseDown = false;
                if(input.Utility.IsIE() && (this.ImeMode || this.Text != this.GetText())) {
                    if(this.ImeMode) {
                        this.ImeInput("ClickInput", undefined, evt);
                        this.ImeSelectTimes = 0;
                    } else {
                        this.InternalSetText(this.Text, true);
                    }
                } else // Add comments by Yang at 11:07 October 12th 2007
                // For fix the bug 9017
                //else if (!isIE && (this.ImeMode || this.Text != this.GetText()))
                if(!input.Utility.IsIE() && (this.ImeMode || this.GetDisPlayText(this.Text) != this._getInputValueWithPlaceHolder()))// End by Yang
                 {
                    // Add comments by Yang at 15:58 Sep. 24th 2007
                    // For fix bug 8794 comment #2
                    if(!this.IsImplementImeInput) {
                        return;
                    }
                    // End by Yang
                    this.ImeInput("ClickInput", undefined, evt);
                    this.ImeSelectTimes = 0;
                    // Add comments by Yang at 9:42 Aug. 29th 2007
                    // For Firefox doesn't support set a value in onblur event when IME opens.
                    // Add comments by Yang at 11:07 October 12th 2007
                    // For fix the bug 9017
                    //if (this.Text != this.GetText())
                    if(this.GetDisPlayText(this.Text) != this._getInputValueWithPlaceHolder())// End by Yang
                     {
                        // Add comments by Yang at 15:58 Sep. 24th 2007
                        // For fix bug 8794 comment #2
                        this.IsImplementImeInput = false;
                        // End by Yang
                        var tempText = this.Text;
                        if(!this.MultiLine) {
                            tempText = tempText.replace(/\r\n/g, "");
                            tempText = tempText.replace(/\r/g, "");
                            tempText = tempText.replace(/\n/g, "");
                        } else {
                            tempText = tempText.replace(/\r/g, "\\r");
                            tempText = tempText.replace(/\n/g, "\\n");
                        }
                        //window.setTimeout("FindIMControl('" + this.ID + "').InternalSetText('" + tempText + "', true)", 0);
                        var self = this;
                        window.setTimeout(function () {
                            self.InternalSetText(tempText, true);
                        }, 0);
                        // Add comments by Yang at 19:03 October 11th 2007
                        // For fix the bug 9008
                        this.Select();
                        // End by Yang
                                            }
                    // End by Yang
                                    } else {
                    this.isLeftMouseButtonPressed = false;
                    //this.EnableOnSelectStartEvent = false;
                    this.LastStart = this.SelectionStart;
                    this.LastEnd = this.SelectionEnd;
                    var start = this.SelectionStart;
                    var end = this.SelectionEnd;
                    var text = this.GetText();
                    //			if (!this.MultiLine)
                    //			{
                    //			    this.DropDownEditData.LastStart = this.DropDownEditData.SelectionStart;
                    //			    this.DropDownEditData.LastEnd   = this.DropDownEditData.SelectionEnd;
                    //			    start = this.DropDownEditData.SelectionStart;
                    //			    end = this.DropDownEditData.SelectionEnd;
                    //			    text = this.DropDownEditData.Text;
                    //			}
                    // Add comments by Yang at 16:18 Sep. 13th 2007
                    // For sometimes the parameter funcKeysPressed is null,
                    // then an exception would be thrown.
                    // fix bug 8847
                    var isCtrlPress = null;
                    if(funcKeysPressed != null && funcKeysPressed.Ctrl != null) {
                        isCtrlPress = funcKeysPressed.Ctrl;
                    }
                    // End by Yang
                    var retInfo = this.UIProcess.TextBoxMouseUp(this.InputElement, start, end, this.MouseButton, this.MultiLine, //this.GetLines(),
                    text, // Add comments by Yang at 16:18 Sep. 13th 2007
                    // For sometimes the parameter funcKeysPressed is null,
                    // then an exception would be thrown.
                    // fix bug 8847
                    //funcKeysPressed.Ctrl,
                    isCtrlPress, // End by Yang
                    //this.isInSelecting,
                    this.HighlightText, evt);
                    if(retInfo == null) {
                        return;
                    }
                    if(retInfo.SelectionStart != null) {
                        this.SelectionStart = retInfo.SelectionStart;
                        if(!this.MultiLine) {
                            this.DropDownEditData.SelectionStart = this.GetMultiPosition(this.DropDownEditData.Text, this.SelectionStart);
                        }
                    }
                    if(retInfo.SelectionEnd != null) {
                        this.SelectionEnd = retInfo.SelectionEnd;
                        this.SelectionLength = Math.abs(this.SelectionEnd - this.SelectionStart);
                        if(!this.MultiLine) {
                            this.DropDownEditData.SelectionEnd = this.GetMultiPosition(this.DropDownEditData.Text, this.SelectionEnd);
                        }
                    }
                    if(retInfo.SetSelection == true) {
                        this.SetSelection(this.SelectionStart, this.SelectionEnd);
                    }
                }
                this.MouseButton = input.MouseButton.Left;
                if(this.MouseUpPointerType == undefined) {
                    // DaryLuo 2012/11/19 fix bug 899 in IM Web 7.0.
                    this.MouseUpHasValue = evt.target.value.length > 0;
                }
                this.HandleClearButton(evt);
            };
            IMTextBox.prototype.MouseWheel = function (evt) {
            };
            IMTextBox.prototype.ShouldCancelMouseWheelDefaultBehavior = function () {
                return false;
            };
            IMTextBox.prototype.MouseOut = function () {
                if(this.IsMouseDown != true) {
                    return;
                }
                // DaryLuo 2012/12/04 fix bug 927 in IM Web 7.0.
                if(this.MouseUpPointerType !== 4 && this.MouseUpPointerType != undefined && this.MouseUpPointerType !== "mouse") {
                    // DaryLuo 2012/10/31 fix bug 785 in IM Web 7.0.
                    return;
                }
                var start = Math.min(this.BeforeDragSelectionStart, this.BeforeDragSelectionEnd);
                var end = Math.max(this.BeforeDragSelectionStart, this.BeforeDragSelectionEnd);
                var data = this.GetText().Substring(start, end);
                if(data != "") {
                    this.SetSelection(this.BeforeDragSelectionStart, this.BeforeDragSelectionEnd);
                    input.Utility.DragDrop(this.InputElement);
                }
                this.IsMouseDown = false;
            };
            IMTextBox.prototype.DoubleClick = function () {
                if(!this.PasswordMode && !this.MultiLine && this.EnableAutoComplete && !this.ReadOnly) {
                    this._autoComplete.ShowDropdown();
                }
                var retInfo = this.UIProcess.TextBoxDoubleClick(this.InputElement, this.SelectionStart, this.GetText());
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionStart = this.GetMultiPosition(this.DropDownEditData.Text, this.SelectionStart);
                    }
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionEnd = this.GetMultiPosition(this.DropDownEditData.Text, this.SelectionEnd);
                    }
                    this.SelectionLength = Math.abs(this.SelectionEnd - this.SelectionStart);
                }
                if(retInfo.SetSelection == true) {
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                }
                return true;
            };
            IMTextBox.prototype.DragStart = function (evt) {
                if(this.PasswordMode) {
                    evt.dataTransfer.effectAllowed = "none";
                } else {
                    this.DragEdit = true;
                }
            };
            IMTextBox.prototype.DragEnd = function () {
                this.DragEdit = true;
            };
            IMTextBox.prototype.DragEnter = // Add comments by Yang at 10:23 May 18 2007
            // For fix bug 7870
            function () {
                if(this.isTextEllipsis) {
                    this.InternalDirectSetText(this.GetText());
                }
            };
            IMTextBox.prototype.DragLeave = function () {
                this.DealEllipsis(this.MultiLine, this.Ellipsis, this.EllipsisString, this.InputElement);
            };
            IMTextBox.prototype.MouseMove = // Add for OverFlowTip
            function (evt) {
            };
            IMTextBox.prototype.MouseOver = function () {
                var shouldShowOverFlowTip = !(this.HasFocus || this.MultiLine || !this.OverflowTip);
                if(shouldShowOverFlowTip) {
                    var obj = this.InputElement;
                    var text = this.GetText();
                    if(this.isTextEllipsis) {
                        text = this.Text;
                    }
                    if(this.PasswordMode) {
                        var temptext = "";
                        for(var i = 0; i < text.GetLength(); i++) {
                            temptext += this.PasswordChar;
                        }
                        text = temptext;
                    }
                    var scrollwidth = input.Utility.MeasureText(text, obj).Width;
                    if(scrollwidth > obj.clientWidth) {
                        this.ToolTip = $(this.InputElement.parentElement).wijtooltip({
                            content: text,
                            position: {
                                my: "left bottom",
                                at: "left+1 top"
                            }
                        });
                        $(this.InputElement.parentElement).wijtooltip("show");
                    } else {
                        shouldShowOverFlowTip = false;
                    }
                }
                if(!shouldShowOverFlowTip) {
                    this._destoryOverflowTip();
                }
            };
            IMTextBox.prototype._destoryOverflowTip = function () {
                if(this.ToolTip != null) {
                    this.ToolTip = null;
                    $(this.InputElement.parentElement).wijtooltip("destroy");
                }
            };
            IMTextBox.prototype._isinsertGroup = function (editMode) {
                return editMode == input.EditMode.Insert || editMode == input.EditMode.FixedInsert;
            };
            IMTextBox.prototype._isOverwriteGroup = function (editMode) {
                return editMode == input.EditMode.Overwrite || editMode == input.EditMode.FixedOverwrite;
            };
            IMTextBox.prototype.InnerKeyPress = function (text, NoUpdateDisplay, isLoseFocusInput) {
                var inputChar = text;
                var oldtext;
                if(this.ImeMode || this.isPasting) {
                    oldtext = this.Text;
                } else {
                    oldtext = this._getInputValueWithPlaceHolder();
                    if(oldtext != "") {
                        oldtext = this.GetText();
                    }
                }
                this.isPasting = false;
                var selectionstart = this.SelectionStart;
                var selectionend = this.SelectionEnd;
                if(!this.MultiLine) {
                    selectionstart = this.DropDownEditData.SelectionStart;
                    selectionend = this.DropDownEditData.SelectionEnd;
                    //Helen
                    //oldtext = this.DropDownEditData.Text;
                                    }
                var retInfo = this.UIProcess.TextBoxKeyPress(selectionstart, selectionend, inputChar, oldtext, this.MaxLength, this.LengthAsByte, this.ExitOnLastChar, this.Overwrite, this.MultiLine, this.MaxLineCount, this.CountWrappedLine);
                if(retInfo.Text != null) {
                    if(retInfo.DelInclude) {
                        this.BuffText = this.GetText();
                        if(!this.MultiLine) {
                            this.DropDownEditData.BuffText = this.DropDownEditData.Text;
                        }
                    }
                    this.DirectSetText(retInfo.Text, NoUpdateDisplay);
                    if(!this.MultiLine) {
                        this.DropDownEditData.Text = retInfo.Text;
                    }
                }
                if(retInfo.SelectionStart != null) {
                    this.SelectionStart = retInfo.SelectionStart;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionStart = this.SelectionStart;
                        this.SelectionStart = this.GetSingleCurPosition(retInfo.Text, retInfo.SelectionStart);
                    }
                }
                if(retInfo.SelectionEnd != null) {
                    this.SelectionEnd = retInfo.SelectionEnd;
                    if(!this.MultiLine) {
                        this.DropDownEditData.SelectionEnd = this.SelectionEnd;
                        this.SelectionEnd = this.GetSingleCurPosition(retInfo.Text, retInfo.SelectionEnd);
                    }
                }
                if(retInfo.SetSelection == true && !NoUpdateDisplay && !isLoseFocusInput) {
                    this._isInnerKeyPressCall = true;
                    this.SetSelection(this.SelectionStart, this.SelectionEnd);
                }
                if(retInfo.EventInfo != null) {
                    for(var i = 0; i < retInfo.EventInfo.length; i++) {
                        if(retInfo.EventInfo[i] != null) {
                            //Add comments by Ryan Wu at 11:30 Apr. 5 2007.
                            //For support Aspnet Ajax 1.0.
                            //this.UIProcess.FireEvent(this, retInfo.EventInfo[i].Name, retInfo.EventInfo[i].Args);
                            this.UIProcess.FireEvent(this, retInfo.EventInfo[i].Name, retInfo.EventInfo[i].Args, retInfo.EventInfo[i].Type);
                            //end by Ryan Wu.
                                                    }
                    }
                }
                if(retInfo.SystemEdit == true) {
                    return true;
                } else {
                    return false;
                }
            };
            IMTextBox.prototype._isSupportClipBoard = function () {
                if(!this.GetUseClipboard()) {
                    return true;
                }
                if(input.Utility.IsIE()) {
                    return true;
                }
                if(input.Utility.IsFireFox4OrLater()) {
                    try  {
                        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
                        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
                        if(!clip) {
                            return;
                        }
                        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
                        if(!trans) {
                            return;
                        }
                        trans.addDataFlavor('text/unicode');
                        clip.getData(trans, clip.kGlobalClipboard);
                        var str = new Object();
                        var len = new Object();
                        try  {
                            trans.getTransferData('text/unicode', str, len);
                        } catch (error) {
                            return null;
                        }
                        if(str) {
                            if(Components.interfaces.nsISupportsWString) {
                                str = str.value.QueryInterface(Components.interfaces.nsISupportsWString);
                            } else if(Components.interfaces.nsISupportsString) {
                                str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
                            } else {
                                str = null;
                            }
                        }
                        if(str) {
                            return (str.data.substring(0, len.value / 2));
                        }
                    } catch (e) {
                        return false;
                    }
                }
                return false;
            };
            IMTextBox.prototype.MSPointerUp = function (evt) {
                if(evt != null) {
                    this.MouseUpPointerType = evt.pointerType;
                    this.MouseUpHasValue = (evt.srcElement || evt.target).value.length > 0;
                }
            };
            IMTextBox.prototype.CompositionStart = function (evt) {
                this.ImeMode = true;
                this._lastCompositionText = "";
                this._lastCompositionOffset = 0;
                this._convertedOnLastUpdate = false;
                this._cachedReadingString = "";
                this._readingString = "";
                this._compositionUpdateFired = false;
            };
            IMTextBox.prototype.CompositionUpdate = function (evt) {
                this._compositionUpdateFired = true;
                if(evt.originalEvent.data === undefined || evt.originalEvent.data.length === 0) {
                    return;
                }
                var compositionOffset = this.InputElement.selectionStart - evt.originalEvent.data.length;
                if(compositionOffset > this._lastCompositionOffset) {
                    if(!this._convertedOnLastUpdate) {
                        var newText = this._lastCompositionText.substring(0, compositionOffset - this._lastCompositionOffset);
                        if(!this.IsValidReadingString(newText)) {
                            this._cachedReadingString += this._readingString;
                        } else {
                            this._cachedReadingString += newText;
                        }
                        this._readingString = "";
                        this._convertedOnLastUpdate = true;
                    }
                } else {
                    if(this._convertedOnLastUpdate) {
                        this._convertedOnLastUpdate = false;
                    }
                }
                if(!this.IsValidReadingString(evt.originalEvent.data)) {
                    return;
                }
                this._readingString = evt.originalEvent.data;
            };
            IMTextBox.prototype.CompositionEnd = function (evt) {
                //// This means that User is input by IME, but the input source is not keyboard, may be touch keyboard.
                //if (Utility.GetClientOS() === "Android"||Utility.IPad) {
                //    return;
                //}
                var imeInput = this.HasValidatedImeInput;
                this.ImeMode = true;
                this.HasValidatedImeInput = false;
                var self = this;
                var iMeHandler = function () {
                    try  {
                        self.ImeInput("DirectInput", undefined, evt);
                    }finally {
                        self.ImeMode = false;
                    }
                };
                if(input.Utility.IsIE9OrLater()) {
                    iMeHandler();
                } else {
                    // DaryLuo 2013/05/15 fix bug 382 in IM HTML5.
                    setTimeout(iMeHandler, 0);
                }
                if(!this._compositionUpdateFired) {
                    this.CompositionUpdate(evt);
                }
                this._convertedOnLastUpdate = false;
                var resultString = this._cachedReadingString + this._readingString;
                this._cachedReadingString = "";
                this._readingString = "";
                if(evt.originalEvent.data.length === 0 || resultString.length === 0) {
                    return;
                }
                this.UpdateReadingIME(resultString);
                // HelenLiu 2013/06/28 fix bug 792 in IM HTML5.
                // HelenLiu 2013/07/01 fix bug 818 in IM HTML5.
                if((input.Utility.IPad && input.Utility.safari) || (input.Utility.chrome && input.Utility.GetClientOS() === "Android")) {
                    this.HasValidatedImeInput = imeInput;
                    this.ImeMode = false;
                }
            };
            IMTextBox.prototype.SelectStart = //#endregion
            //#region Handle events and actions
            function (selText) {
                if(this.ImeMode) {
                    return false;
                }
                if(this.isLeftMouseButtonPressed) {
                    var retInfo = this.UIProcess.SelectStart(this.InputElement, selText, this.MultiLine);
                    if(retInfo.SelectionStart != null) {
                        this.SelectionStart = retInfo.SelectionStart;
                        if(!this.MultiLine) {
                            this.DropDownEditData.SelectionStart = this.GetMultiPosition(this.DropDownEditData.Text, retInfo.SelectionStart);
                        }
                    }
                    if(retInfo.SelectionEnd != null) {
                        this.SelectionEnd = retInfo.SelectionEnd;
                        if(!this.MultiLine) {
                            this.DropDownEditData.SelectionEnd = this.GetMultiPosition(this.DropDownEditData.Text, retInfo.SelectionEnd);
                        }
                    }
                }
            };
            IMTextBox.prototype.DragDrop = function (dragText) {
                // add by Sean Huang at 2008.11.06, for bug 10298 -->
                if(!input.Utility.IsIE() && this.ReadOnly) {
                    return false;
                }
                // end of Sean Huang <--
                // Add comments by Yang at 15:26 August 28th 2007
                // For the parameter "dragText" should be tranfered from the function
                // which called this function
                //dragText = event.dataTransfer.getData('Text');
                // End by a
                //add by sj for support firefox drop
                this.FFDragFlag = false;
                if(!input.Utility.IsIE()) {
                    this.FFDragFlag = true;
                }
                //end by sj
                // HelenLiu 2013/07/19 fix bug 1058 in IM HTML5.
                if(!input.Utility.IsIE() && !input.Utility.safari) {
                    this.SetInnerFocus();
                }
                var dragSelectionStart = input.Utility.GetSelectionStartPosition(this.InputElement);
                var dragSelectionEnd = dragSelectionStart;
                var retInfo = this.UIProcess.DragDrop(dragText, this.ExitOnLastChar, dragSelectionStart, dragSelectionEnd, this.MaxLength, this.LengthAsByte, this.MaxLineCount, this.CountWrappedLine, this.MultiLine, this.GetText());
                //end by sj
                if(retInfo == null) {
                    return;
                }
                if(retInfo.DropText != null) {
                    //			if ((!this.UseSystemPasswordChar && this.PasswordMode) || (this.MultiLine && this.UseSystemPasswordChar))
                    var previousText;
                    var realText;
                    if(this.PasswordMode) {
                        var passwordText = this.UIProcess.GetPasswordText(retInfo.DropText, this.PasswordChar, this.MultiLine);
                        if(input.Utility.IsIE()) {
                            window.event.dataTransfer.setData('Text', passwordText);
                            if(passwordText != window.event.dataTransfer.getData('Text')) {
                                previousText = this.GetText();
                                realText = previousText + retInfo.DropText;
                                this.InternalSetText(realText, true);
                                input.Utility.PreventDefault(window.event);
                            }
                        } else {
                            previousText = this.GetText();
                            realText = previousText + retInfo.DropText;
                            this.InternalSetText(realText, true, true);
                        }
                        this.DropText = retInfo.DropText;
                    } else {
                        if(input.Utility.IsIE()) {
                            event.dataTransfer.setData('Text', retInfo.DropText);
                            if(retInfo.DropText != event.dataTransfer.getData('Text')) {
                                previousText = this.GetText();
                                realText = previousText + retInfo.DropText;
                                this.InternalSetText(realText, true);
                                input.Utility.PreventDefault(event);
                            } else {
                                // DaryLuo 2012/10/30 fix bug 845 in IM Web 7.0.
                                var thisObj = this;
                                setTimeout(function () {
                                    var realText = thisObj.GetText();
                                    thisObj.InternalSetText(realText, true);
                                }, 0);
                            }
                        } else {
                            previousText = this.GetText();
                            realText = previousText + retInfo.DropText;
                            this.InternalSetText(realText, true, true);
                        }
                    }
                    this.DropEdit = true;
                }
                if(retInfo.EventInfo != null) {
                    for(var i = 0; i < retInfo.EventInfo.length; i++) {
                        //modified by sj for bug 1683
                        //if (retInfo.EventInfo[i] != null)
                        if(retInfo.EventInfo[i] != null && retInfo.EventInfo[i].Name != null)//end by sj
                         {
                            //Add comments by Ryan Wu at 10:42 Apr. 5 2007.
                            //For support Aspnet Ajax 1.0.
                            //this.UIProcess.FireEvent(this, retInfo.EventInfo[i].Name, retInfo.EventInfo[i].Args);
                            this.UIProcess.FireEvent(this, retInfo.EventInfo[i].Name, retInfo.EventInfo[i].Args, retInfo.EventInfo[i].Type);
                            //end by Ryan Wu.
                            if(retInfo.EventInfo[i].Name == this.KeyExitEvent) {
                                this.FocusExit = true;
                            }
                        }
                    }
                }
                //add by sj
                this.FFDragFlag = false;
                //end by sj
                var self = this;
                var m = this.MultiLine;
                var e = this.Ellipsis;
                var es = this.EllipsisString;
                var input = this.InputElement;
                setTimeout(function () {
                    // HelenLiu 2013/07/19 fix bug 1059 in IM HTML5.
                    self.InternalSetText(self.GetText());
                    self.DealEllipsis(m, e, es, input);
                }, 0);
                return true;
            };
            IMTextBox.prototype.MSGestureTap = function (evt) {
                if(this.Focused) {
                    if(!this.PasswordMode && !this.MultiLine && this.EnableAutoComplete && !this.ReadOnly) {
                        var self = this;
                        setTimeout(function () {
                            if(self.Focused) {
                                self._autoComplete.ShowDropdown();
                            }
                        }, 400);
                    }
                }
            };
            IMTextBox.prototype.MSPointerDown = function (evt) {
                if(this.Focused && (evt.pointerType === evt.MSPOINTER_TYPE_TOUCH || evt.pointerType === "touch")) {
                    if(!this.PasswordMode && !this.MultiLine && this.EnableAutoComplete && !this.ReadOnly) {
                        var myGesture = new MSGesture();
                        myGesture.target = evt.target;
                        myGesture.addPointer(evt.pointerId);
                    }
                }
            };
            IMTextBox.prototype.GetShowLiterals = function () {
                return input.ShowLiterals.Always;
            };
            return IMTextBox;
        })();
        input.IMTextBox = IMTextBox;        
        /** @ignore */
        var GcTextBoxUIProcess = (function (_super) {
            __extends(GcTextBoxUIProcess, _super);
            function GcTextBoxUIProcess(autoConvert, format, /*elementID,*/ passwordMode, passwordChar, isjQueryControl, owner) {
                //Initial the base class Field
                        _super.call(this);
                this.isMulSelected = false;
                this.isOverWrite = false;
                this.ForwardSelection = "None";
                this.isCtrlPress = false;
                this.isCtrlClick = false;
                this.isDblClick = false;
                this.isTriClick = false;
                this.isInputValid = true;
                this.ctrlDelete = false;
                this.ctrlBackspace = false;
                this.IsDelInclude = false;
                this.IsSerialDel = false;
                this.StartPos = null;
                this.LastKey = null;
                this.keypressResponse = false;
                this.systemEdit = false;
                this.keyupResponse = false;
                this.japInput = false;
                this.inputJap = false;
                this.IsKeyDown = false;
                this.CurStart = 0;
                this.CurEnd = 0;
                this.control = owner;
                this.Owner = owner// to compatibilize with BaseUIProcess.
                ;
                //Properties
                //this.ClientEvents = clientEvents;
                //this.InvalidInputEvent = owner.InvalidInputEvent;
                //this.EditStatusChangedEvent = owner.EditStatusChangedEvent;
                //this.KeyExitEvent = owner.KeyExitEvent;
                //this.TextChangedEvent = owner.TextChangedEvent;
                //this.DropDownCloseEvent = owner.DropDownCloseEvent;
                //this.DropDownOpenEvent = owner.DropDownOpenEvent;
                this.Filter = new input.TextFilter(autoConvert, format);
                this.IsjQueryControl = isjQueryControl;
                this.PasswordMode = passwordMode;
                this.PasswordChar = passwordChar;
                //if (elementID != null) {
                //    this.ElementID = elementID;
                //    if (isjQueryControl) {
                //        this.RealEditID = elementID;
                //    }
                //    else {
                //        this.RealEditID = elementID + "_EditField";
                //    }
                //}
                            }
            GcTextBoxUIProcess.prototype.Reset = function () {
                this.Filter = new input.TextFilter(this.control.AutoConvert, this.control.Format);
                this.PasswordMode = this.control.PasswordMode;
                this.PasswordChar = this.control.GetPasswordChar();
            };
            GcTextBoxUIProcess.prototype.TextBoxKeyDown = function (k, funcKeysPressed, editMode, overwrite, start, end, readOnly, maxLength, lengthAsByte, maxLine, isCountWrappedLine, exitOnLastChar, exitOnLeftRightKey, multiLine, passwordMode, text, acceptTab, acceptReturn, buffText, //01-13
            undoText, oldStart, oldEnd, keyAction, evt) {
                if(funcKeysPressed.Ctrl) {
                    this.isCtrlPress = true;
                } else {
                    this.isCtrlPress = false;
                }
                var retInfo = new Object();
                switch(editMode) {
                    case input.EditMode.Insert:
                        this.isOverWrite = false;
                        break;
                    case input.EditMode.Overwrite:
                        this.isOverWrite = true;
                        break;
                    case input.EditMode.FixedInsert:
                        this.isOverWrite = false;
                        break;
                    case input.EditMode.FixedOverwrite:
                        this.isOverWrite = true;
                        break;
                }
                if(start != end) {
                    this.isMulSelected = true;
                } else {
                    this.isMulSelected = false;
                }
                //ShortCuts
                var ret;
                switch(keyAction) {
                    case //Clear
                    "Clear":
                        if(!readOnly) {
                            retInfo.SelectionStart = 0;
                            retInfo.SelectionEnd = 0;
                            retInfo.Text = "";
                            //fix bug#4940, KevinHuang, 2006-04-30
                            retInfo.DelInclude = true;
                            this.IsDelInclude = true;
                        }
                        return retInfo;
                        //NextControl
                                            case "NextControl":
                        ret = this.MoveControl(this.control.InputElement, true, false, "NextControl")//01-20
                        ;
                        // Modified by shenyuan at 2006-01-20.
                        if(ret != null) {
                            retInfo.EventInfo = new Array();
                            retInfo.EventInfo[0] = ret.EventInfo;
                            retInfo.FocusType = ret.FocusType;
                            retInfo.FocusExit = true;
                        }
                        return retInfo;
                        //PreviousControl
                                            case "PreviousControl":
                        ret = this.MoveControl(this.control.InputElement, false, false, "PreviousControl")//01-20
                        ;
                        // Modified by shenyuan at 2006-01-20.
                        if(ret != null) {
                            retInfo.EventInfo = new Array();
                            retInfo.EventInfo[0] = ret.EventInfo;
                            retInfo.FocusType = ret.FocusType;
                            retInfo.FocusExit = true;
                        }
                        return retInfo;
                }
                //The ReadOnly property is set to true
                if(readOnly) {
                    //we only let the Ctrl+C and Ctrl+Insert and ShortCut and Tab and Shift+ Tab
                    //work when we set readOnly property to true.
                    if(k != 131117 && k != 131139 && k != 9 && k != 65545 && k != 131081 && k != 196617 && //Added by shenyuan at 2006-01-17 for bug #4986.
                    //k = 131137 is Ctrl+A
                    k != 131137 && //Added by shenyuan at 2006-02-08 for bug #4939.
                    //left, right, up, down
                    k != 37 && k != 39 && k != 38 && k != 40) {
                        return retInfo;
                    }
                }
                var isPressContinuousely;
                switch(k) {
                    case //=====================================================================
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
                                            case 117:
                        //	F6
                                            case 65657:
                        //ShiftF10
                                            case 116:
                        //F5
                                            case 121:
                        // F10   DaryLuo 2012/09/12 fix bug 633 in IM Web 7.0.
                                            case 123:
                        // F12
                        retInfo.System = true;
                        break;
                        //=====================================================================
                        //Editing
                        //Insert
                                            case 45:
                        var isOverWrite;
                        if(editMode === input.EditMode.FixedInsert) {
                            isOverWrite = false;
                        } else if(editMode === input.EditMode.FixedOverwrite) {
                            isOverWrite = true;
                        } else {
                            isOverWrite = !overwrite;
                            if(this.EditStatusChangedEvent != "" && this.EditStatusChangedEvent != null) {
                                var eventInfo = new Object();
                                eventInfo.Name = this.EditStatusChangedEvent;
                                eventInfo.Args = null;
                                //Add comments by Ryan Wu at 10:47 Apr. 5 2007.
                                //For support Aspnet Ajax 1.0.
                                eventInfo.Type = "EditStatusChanged";
                                //end by Ryan Wu.
                                retInfo.EventInfo = new Array();
                                retInfo.EventInfo[0] = eventInfo;
                            }
                        }
                        retInfo.Overwrite = isOverWrite;
                        break;
                        //Enter key
                        //In multiline mode, if Enter key pressed and edit accept return,
                        //creates a new line of text in the control
                                            case 13:
                        if(multiLine && acceptReturn) {
                            this.keypressResponse = true;
                            this.keyupResponse = true;
                            retInfo.System = true;
                        } else if(multiLine && !acceptReturn) {
                            //cause postback
                            //retInfo.isSetCookies = true;
                            //					__doPostBack("","");
                            //Add comments by Yang at 8:40 June 1st 2007
                            //For fix bug 8331
                            //FindIMControl(this.ElementID).SetLastClientValues();
                            // End by Yang
                            // TODO:DOPostBack when do the wrapper.
                            retInfo.System = false;
                            retInfo.IsDoPostBack = true;
                        } else {
                            //retInfo.isSetCookies = true;
                            this.keypressResponse = true;
                            this.keyupResponse = false;
                            retInfo.System = true;
                            //Add comments by Yang at 8:40 June 1st 2007
                            //For fix bug 8331
                            //FindIMControl(this.ElementID).SetLastClientValues();
                            // End by Yang
                                                    }
                        break;
                        //ctrl + Enter
                                            case 131085:
                        if(multiLine) {
                            this.systemEdit = true;
                            this.keypressResponse = true;
                            this.keyupResponse = true;
                            retInfo.System = true;
                        }
                        break;
                        //Tab
                        //In multiline mode, if Tab key pressed and edit accept tab,
                        //type a TAB character in the control
                                            case 9:
                        //Shift + Tab
                                            case 65545:
                        if(multiLine && acceptTab && !readOnly) {
                            this.keypressResponse = true;
                            retInfo.InputTab = true;
                        } else {
                            retInfo.System = true;
                            ret = new Object();
                            if(this.Owner.KeyExitEvent != "" && this.Owner.KeyExitEvent != null) {
                                ret.Name = this.Owner.KeyExitEvent;
                                ret.Args = {
                                    Key: (k == 9 ? input.ExitKeys.Tab : input.ExitKeys.ShiftTab)
                                };
                                //Add comments by Ryan Wu at 10:47 Apr. 5 2007.
                                //For support Aspnet Ajax 1.0.
                                ret.Type = "KeyExit";
                                //end by Ryan Wu.
                                                            }
                            retInfo.EventInfo = new Array();
                            retInfo.EventInfo[0] = ret;
                            // Modified by shenyuan at 2006-01-16 for bug 4969.
                            // Caret should move to the end of the text when move
                            // the focus to edit by tab key.
                            if(multiLine) {
                                retInfo.SelectionStart = text.GetLength();
                                retInfo.SelectionEnd = text.GetLength();
                            }
                        }
                        break;
                        //Ctrl+Tab
                                            case 131081:
                        // Add comments by Yang at 9:24 March 6th 2008
                        // For fix the bug 9711
                        //var ret = this.MoveControl(this.RealEditID, true, false, "Right");//01-20
                        ret = this.MoveControl(this.control.InputElement, true, false, "NextControl")// End by Yang
                        ;
                        // Modified by shenyuan at 2006-01-20.
                        if(ret != null) {
                            retInfo.EventInfo = new Array();
                            retInfo.EventInfo[0] = ret.EventInfo;
                            retInfo.FocusType = ret.FocusType;
                            retInfo.FocusExit = true;
                        }
                        break;
                        //Ctrl + Shift + Tab
                                            case 196617:
                        // Modofied by shenyuan at 2006-02-28 for bug #5410.
                        ret = this.MoveControl(this.control.InputElement, false, false, "PreviousControl")// Modified by shenyuan at 2006-01-20.
                        ;
                        if(ret != null) {
                            retInfo.EventInfo = new Array();
                            retInfo.EventInfo[0] = ret.EventInfo;
                            retInfo.FocusType = ret.FocusType;
                            retInfo.FocusExit = true;
                        }
                        break;
                        //BackSpace
                                            case 8:
                        //Shift + BackSpace
                                            case 65544:
                        this.systemEdit = true;
                        this.keyupResponse = true;
                        // Modified by shenyuan at 2006-01-20 for new undo rules.
                        this.DelOperation(k, start, end);
                        //				retInfo.DelStart = start - 1;
                        //				retInfo.DelEnd   = end - 1;
                        // Ended.
                        retInfo.DelInclude = true;
                        retInfo.SerialDel = this.IsSerialDel;
                        retInfo.System = true;
                        break;
                        //Delete
                                            case 46:
                        this.systemEdit = true;
                        this.keyupResponse = true;
                        // Modified by shenyuan at 2006-01-13 for new undo rules.
                        this.DelOperation(k, start, end);
                        retInfo.DelInclude = true;
                        retInfo.SerialDel = this.IsSerialDel;
                        retInfo.System = true;
                        break;
                        //Ctrl + BackSpace   Ctrl + Shift + BackSpace Key
                                            case 131080:
                    case 196616:
                        // Modified by shenyuan at 2005-12-28 for bug 4629
                        // when there is no selected text, do it by system defualt.
                        if(!this.isMulSelected) {
                            this.systemEdit = true;
                            this.keyupResponse = true;
                            retInfo.System = true;
                        } else// when there is selected text, do it as ctrl + delete does.
                         {
                            this.keyupResponse = true;
                            //modified by sj for bug 3133
                            /*
                            retInfo.System = true;
                            retInfo.KeyCode = 39;
                            this.ctrlDelete = true;
                            */
                            this.ctrlBackspace = true;
                            //end by sj
                                                    }
                        // Modified by shenyuan at 2006-01-13 for new undo rules
                        this.DelOperation(k, start, end)//01-23
                        ;
                        retInfo.SerialDel = this.IsSerialDel;
                        retInfo.DelInclude = true;
                        break;
                        //Ctrl + Delete
                                            case 131118:
                        this.keyupResponse = true;
                        retInfo.System = true;
                        // Modified by shenyuan at 2006-01-13 for new undo rules
                        this.DelOperation(k, start, end)//01-23
                        ;
                        retInfo.SerialDel = this.IsSerialDel;
                        retInfo.DelInclude = true;
                        retInfo.KeyCode = 39;
                        this.ctrlDelete = true;
                        break;
                        //Copy
                        //Ctrl + C
                                            case 131139:
                        //Ctrl + Insert
                                            case 131117:
                        //In password input status,copy shoud disable
                        //				if(multiLine || !passwordMode)
                        if(!passwordMode) {
                            var owner;
                            if(this.Owner === undefined) {
                                owner = this.control;
                            } else {
                                owner = this.Owner;
                            }
                            if(owner._isSupportClipBoard()) {
                                this.Copy(text, start, end);
                                //retInfo.System = false;
                                                            } else {
                                retInfo.System = true;
                            }
                        } else {
                            retInfo.System = false;
                        }
                        break;
                        //Paste
                        //Shift + Insert
                                            case 65581:
                        //Ctrl + V
                                            case 131158:
                        if(this.Owner === undefined) {
                            owner = this.control;
                        } else {
                            owner = this.Owner;
                        }
                        if(owner._isSupportClipBoard()) {
                            // retInfo = this.Paste(start, end, pasteData, isExitOnLastChar);
                            retInfo = this.TextBoxPaste(start, end, text, exitOnLastChar, acceptTab, acceptReturn, maxLength, lengthAsByte, maxLine, isCountWrappedLine, multiLine);
                            //retInfo.System = false;
                                                    } else {
                            retInfo.System = true;
                        }
                        break;
                        //Cut
                        //Ctrl + X
                                            case 131160:
                        //In password input status,cut shoud disable
                        //if(multiLine || !passwordMode)
                        if(!passwordMode) {
                            if(this.Owner === undefined) {
                                owner = this.control;
                            } else {
                                owner = this.Owner;
                            }
                            if(owner._isSupportClipBoard()) {
                                retInfo = this.Cut(text, start, end);
                                //retInfo.System = false;
                                                            } else {
                                retInfo.System = true;
                            }
                        } else {
                            retInfo.System = false;
                        }
                        break;
                        //Cut or BackSpace
                        //Shift + Delete
                                            case 65582:
                        if(start != end)//cut
                         {
                            retInfo = this.Cut(text, start, end);
                        } else//backspace
                         {
                            //use system backspace
                            this.systemEdit = true;
                            this.keyupResponse = true;
                            retInfo.KeyCode = 8;
                        }
                        // Modified by shenyuan at 2006-01-13 for new undo rules
                        this.DelOperation(k, start, end)//01-23
                        ;
                        retInfo.SerialDel = this.IsSerialDel;
                        retInfo.DelInclude = true;
                        break;
                        //Ctrl + A
                                            case 131137:
                        retInfo = this.TextBoxSelectAll(text);
                        break;
                        //Ctrl + Z
                                            case 131162:
                        // Need add undo methods by Ryan wu.
                        // Modified by shenyuan at 2006-01-13 for new undo rules.
                        retInfo = this.TextBoxUndo(text, buffText, undoText, oldStart, oldEnd, start, end)//02-07 for bug #5101
                        ;
                        break;
                        //=================================================================
                        //Selection
                        //Shift + Left
                                            case 65573:
                        this.ForwardSelection = "Left";
                        retInfo.System = true;
                        this.keyupResponse = true;
                        break;
                        //Shift + Right
                                            case 65575:
                        this.ForwardSelection = "Right";
                        retInfo.System = true;
                        this.keyupResponse = true;
                        break;
                        //Shift + Up
                                            case 65574:
                        if(multiLine) {
                            this.ForwardSelection = "Left";
                            retInfo.System = true;
                            this.keyupResponse = true;
                        } else {
                            if(end > 0) {
                                retInfo.SelectionEnd = end - 1;
                            }
                            retInfo.SetSelection = true;
                        }
                        break;
                        //Shift + Down
                                            case 65576:
                        if(multiLine) {
                            this.ForwardSelection = "Right";
                            retInfo.System = true;
                            this.keyupResponse = true;
                        } else {
                            if(end < text.GetLength()) {
                                retInfo.SelectionEnd = end + 1;
                            }
                            retInfo.SetSelection = true;
                        }
                        break;
                        //Shift + Page Up
                                            case 65569:
                        this.ForwardSelection = "Left";
                        retInfo.System = true;
                        this.keyupResponse = true;
                        break;
                        //Shift + Page Down
                                            case 65570:
                        this.ForwardSelection = "Right";
                        retInfo.System = true;
                        this.keyupResponse = true;
                        break;
                        //Shift + Ctrl + Left
                                            case 196645:
                        this.ForwardSelection = "Left";
                        retInfo.System = true;
                        this.keyupResponse = true;
                        break;
                        //Shift + Ctrl + Right
                                            case 196647:
                        this.ForwardSelection = "Right";
                        retInfo.System = true;
                        this.keyupResponse = true;
                        break;
                        //Shift + Home
                                            case 65572:
                        //Shift + Ctrl + Home
                                            case 196644:
                        this.ForwardSelection = "Left";
                        retInfo.System = true;
                        this.keyupResponse = true;
                        break;
                        //Shift + End
                                            case 65571:
                        //Shift + Ctrl + End
                                            case 196643:
                        this.ForwardSelection = "Right";
                        retInfo.System = true;
                        this.keyupResponse = true;
                        break;
                        //==================================================================
                        //Navigation
                        //Left
                                            case 37:
                        //Ctrl + left
                                            case 131109:
                        //Add by Ryan Wu at 16:14 Feb. 19, 2006.
                        //For fix bug#4993.
                        isPressContinuousely = false//If this.IsKeyDown is true, then indicate that the current action is pressing the key continousely.
                        ;
                        if(this.IsKeyDown) {
                            isPressContinuousely = true;
                        } else {
                            this.IsKeyDown = true;
                            this.CurStart = start;
                            this.CurEnd = end;
                        }
                        if(isPressContinuousely) {
                            if(this.CurStart === 0 && this.CurEnd == 0 && (exitOnLeftRightKey === input.ExitOnLeftRightKey.Both || exitOnLeftRightKey === input.ExitOnLeftRightKey.Left)) {
                                var exitType = k === 37 ? "Left" : "CtrlLeft";
                                ret = this.MoveControl(this.control.InputElement, false, true, exitType);
                                if(ret != null) {
                                    retInfo.EventInfo = new Array();
                                    retInfo.EventInfo[0] = ret.EventInfo;
                                    retInfo.FocusType = ret.FocusType;
                                    retInfo.FocusExit = true;
                                }
                                this.IsKeyDown = false;
                                break;
                            }
                        }
                        this.CurStart -= 1;
                        this.CurEnd = this.CurStart;
                        //end by Ryan.
                        //Move to previous control
                        if(start === 0 && end === 0 && (exitOnLeftRightKey === input.ExitOnLeftRightKey.Both || exitOnLeftRightKey === input.ExitOnLeftRightKey.Left)) {
                            var exitType = k === 37 ? "Left" : "CtrlLeft";
                            ret = this.MoveControl(this.control.InputElement, false, true, exitType)//01-20
                            ;
                            // Modified by shenyuan at 2006-01-20.
                            if(ret != null) {
                                retInfo.EventInfo = new Array();
                                retInfo.EventInfo[0] = ret.EventInfo;
                                retInfo.FocusType = ret.FocusType;
                                retInfo.FocusExit = true;
                            }
                        } else {
                            //Modified by shenyuan at 2006-02-08 for bug #4939.
                            if(!readOnly) {
                                this.keyupResponse = true;
                            }
                            retInfo.System = true;
                        }
                        break;
                        //Right
                                            case 39:
                        //Ctrl + Right
                                            case 131111:
                        //Add by Ryan Wu at 16:14 Feb. 19, 2006.
                        //For fix bug#4993.
                        isPressContinuousely = false//If this.IsKeyDown is true, then indicate that the current action is pressing the key continousely.
                        ;
                        if(this.IsKeyDown) {
                            isPressContinuousely = true;
                        } else {
                            this.IsKeyDown = true;
                            this.CurStart = start;
                            this.CurEnd = end;
                        }
                        if(isPressContinuousely) {
                            if(this.CurStart === text.GetLength() && this.CurEnd === text.GetLength() && (exitOnLeftRightKey === input.ExitOnLeftRightKey.Both || exitOnLeftRightKey === input.ExitOnLeftRightKey.Right)) {
                                var exitType = k == 39 ? "Right" : "CtrlRight";
                                ret = this.MoveControl(this.control.InputElement, true, true, exitType);
                                if(ret != null) {
                                    retInfo.EventInfo = new Array();
                                    retInfo.EventInfo[0] = ret.EventInfo;
                                    retInfo.FocusType = ret.FocusType;
                                    retInfo.FocusExit = true;
                                }
                                this.IsKeyDown = false;
                                break;
                            }
                        }
                        this.CurStart += 1;
                        this.CurEnd = this.CurStart;
                        //end by Ryan.
                        //Move to next control
                        if(start === text.GetLength() && end === text.GetLength() && (exitOnLeftRightKey === input.ExitOnLeftRightKey.Both || exitOnLeftRightKey === input.ExitOnLeftRightKey.Right)) {
                            var exitType = k == 39 ? "Right" : "CtrlRight";
                            ret = this.MoveControl(this.control.InputElement, true, true, exitType)//01-20
                            ;
                            // Modified by shenyuan at 2006-01-20.
                            if(ret != null) {
                                retInfo.EventInfo = new Array();
                                retInfo.EventInfo[0] = ret.EventInfo;
                                retInfo.FocusType = ret.FocusType;
                                retInfo.FocusExit = true;
                            }
                        } else {
                            //Modified by shenyuan at 2006-02-08 for bug #4939.
                            if(!readOnly) {
                                this.keyupResponse = true;
                            }
                            retInfo.System = true;
                        }
                        break;
                        //PageUp
                        //Ctrl + Page UP
                                            case 33:
                    case 131105:
                        this.keyupResponse = true;
                        //modified by sj for bug 887 on ttp
                        //				//modified by sj 2008.8.12 for bug 339
                        //				if (FindIMControl(this.ElementID).MultiLine)
                        //				{
                        //				    var startPosition=0;
                        //				    Utility.SetSelection(FindIMControl(this.ElementID).InputElement,startPosition,startPosition,true);
                        //				}
                        //
                        //				retInfo.System = false;
                        //				//end by sj
                        //				//retInfo.System = true;
                        if(multiLine) {
                            // DaryLuo 2012/11/07 fix bug 872 in IM Web 7.0.
                            //var selectionPosition = 0;
                            //retInfo.SetSelection = true;
                            //retInfo.SelectionStart = selectionPosition;
                            //retInfo.SelectionEnd = selectionPosition;
                            retInfo.System = true;
                        } else {
                            retInfo.System = false;
                        }
                        //end by sj
                        break;
                        //PageDown
                        //Ctrl + PageDown
                                            case 34:
                    case 131106:
                        this.keyupResponse = true;
                        //modified by sj for bug 887 on ttp
                        //				//modified by sj 2008.8.12 for bug 339
                        //				if (FindIMControl(this.ElementID).MultiLine)
                        //				{
                        //					var endPosition=FindIMControl(this.ElementID).GetText().GetLength();
                        //				    Utility.SetSelection(FindIMControl(this.ElementID).InputElement,endPosition,endPosition,true);
                        //				}
                        //
                        //				retInfo.System = false;
                        //				//end by sj
                        //
                        //				//retInfo.System = true;
                        if(multiLine) {
                            // DaryLuo 2012/11/07 fix bug 872 in IM Web 7.0.
                            //var selectionPosition = text.GetLength();
                            //retInfo.SetSelection = true;
                            //retInfo.SelectionStart = selectionPosition;
                            //retInfo.SelectionEnd = selectionPosition;
                            retInfo.System = true;
                        } else {
                            retInfo.System = false;
                        }
                        //end by sj
                        break;
                        //Up
                                            case 38:
                        //Modified by shenyuan at 2006-02-08 for bug #4939.
                        if(!readOnly) {
                            this.keyupResponse = true;
                        }
                        // HelenLiu 2013/06/24 fix bug 773 in IM HTML5.
                        if(this.Owner.GetMultiLine()) {
                            retInfo.System = true;
                        } else {
                            retInfo.System = false;
                        }
                        break;
                        //Down
                                            case 40:
                        //Modified by shenyuan at 2006-02-08 for bug #4939.
                        if(!readOnly) {
                            this.keyupResponse = true;
                        }
                        // HelenLiu 2013/06/24 fix bug 773 in IM HTML5.
                        if(this.Owner.GetMultiLine()) {
                            retInfo.System = true;
                        } else {
                            retInfo.System = false;
                        }
                        break;
                        //Ctrl + Home & Home
                                            case 131108:
                    case 36:
                        this.keyupResponse = true;
                        retInfo.System = true;
                        break;
                        //Ctrl + End & End
                                            case 131107:
                    case 35:
                        this.keyupResponse = true;
                        retInfo.System = true;
                        break;
                        //Ctrl + Up & Down
                                            case 131112:
                    case 131110:
                        this.keyupResponse = true;
                        retInfo.System = true;
                        break;
                        //Escape key.
                                            case 27:
                        this.control.Clear();
                        break;
                        // DaryLuo 2014/03/05 fix bug 49440.
                        // Support swedish key board. AlrGr key.
                        // Same as Cltrl+Alt +XX. [50, 51, 52, 53, 55, 56, 57, 48, 187, 69, 226, 77, 186]
                                            case 393266:
                    case 393267:
                    case 393268:
                    case 393269:
                    case 393271:
                    case 393272:
                    case 393273:
                    case 393264:
                    case 393403:
                    case 393285:
                    case 393442:
                    case 393293:
                    case 393402:
                        this.keypressResponse = true;
                        retInfo.System = true;
                        break;
                    default:
                        break;
                }
                if(k !== undefined && k !== null) {
                    if((k >= 48 && k <= 57) || (k >= 65 && k <= 90) || (k >= 96 && k <= 105) || k == 229 || k == 0 || k == 231) {
                        //input status.Response by keypress event.
                        this.keypressResponse = true;
                        if(retInfo == null) {
                            retInfo = {
                            };
                        }
                        retInfo.System = true;
                        retInfo.inputChar = true;
                        return retInfo;
                    }
                    // for symbol charactors
                    //Add comments by Ryan Wu at 15:03 Mar. 2 2006.
                    //For fix bug that 226 keycode can't be input into the edit reported by Japan.
                    /*if(  k==32 || k == 106 || k == 107 || k == 109 || k == 110 || k == 111 || k == 219
                    || k == 220 || k == 221 || k == 222 || (k >= 186 && k <= 192) )*/
                    //end by Ryan.
                    if(k == 32 || k == 106 || k == 107 || k == 109 || (k == 173 && input.Utility.IsFireFox4OrLater()) || k == 110 || k == 111 || k == 219 || k == 220 || k == 221 || k == 222 || (k >= 186 && k <= 192) || k == 226 || k == 231) {
                        //input status.Response by keypress event.
                        this.keypressResponse = true;
                        retInfo.System = true;
                        return retInfo;
                    }
                    // Add comments by Yang at 14:00 Sep. 12th 2007
                    // For fix the bug 8754
                    if(!input.Utility.IsIE() && (k === 61 || k === 59)) {
                        this.keypressResponse = true;
                        retInfo.System = true;
                        return retInfo;
                    }
                    // End by Yang
                    //Shift + key
                    if(evt.shiftKey) {
                        var tempk = k - 65536;
                    }
                    if((tempk >= 48 && tempk <= 57) || (tempk >= 65 && tempk <= 90) || (tempk >= 96 && tempk <= 105) || tempk == 229) {
                        //input status.Response by keyup event.
                        this.keypressResponse = true;
                        retInfo.System = true;
                        return retInfo;
                    }
                    // for symbol charactors
                    //Add comments by Ryan Wu at 15:03 Mar. 2 2006.
                    //For fix bug that 226 keycode can't be input into the edit reported by Japan.
                    /*if (tempk == 32 || tempk == 106 || tempk == 107 || tempk == 109 || tempk == 110
                    || tempk == 111 || tempk == 219 || tempk == 220 || tempk == 221
                    || tempk == 222 || (tempk >= 186 && tempk <= 192))*/
                    if(tempk == 32 || tempk == 106 || tempk == 107 || tempk == 109 || (k == 173 && input.Utility.IsFireFox4OrLater()) || tempk == 110 || tempk == 111 || tempk == 219 || tempk == 220 || tempk == 221 || tempk == 222 || (tempk >= 186 && tempk <= 192) || tempk == 226 || tempk == 231)//end by Ryan.
                     {
                        //input status.Response by keyup event.
                        this.keypressResponse = true;
                        retInfo.System = true;
                        return retInfo;
                    }
                    // Add comments by Yang at 14:00 Sep. 12th 2007
                    // For fix the bug 8754
                    if(!input.Utility.IsIE() && (tempk == 61 || tempk == 59)) {
                        this.keypressResponse = true;
                        retInfo.System = true;
                        return retInfo;
                    }
                    // End by Yang
                                    }
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.TextBoxKeyPress = function (start, end, inputChar, oldText, maxLength, lengthAsByte, exitOnLastChar, overwrite, multiLine, maxLine, isCountWrappedLine) {
                // maxLine isCountWrappedLine
                if(this.keypressResponse == true) {
                    this.keypressResponse = false;
                    this.isInputValid = true;
                    var retInfo = new Object();
                    var processInfo = new Object();
                    // Add comments by Yang at 15:22 Sep. 5th 2007
                    // For in Firefox when press enter, the value is "\n".
                    var sEnter = "\r\n";
                    if(!input.Utility.IsIE() || parseInt($.browser.version) >= 9) {
                        sEnter = "\n";
                    }
                    // End by Yang
                    //if (this.japInput != true) {
                    //    this.japInput = (evt != null && evt.keyCode == 229) ? true : false;
                    //}
                    //Format check
                    var insertChar = "";
                    //If input tab character,ignore the format check
                    if(inputChar == "\t") {
                        insertChar = inputChar;
                    } else {
                        if(inputChar == "\r" || inputChar == "\n") {
                            if(multiLine) {
                                // Add comments by Yang at 15:22 Sep. 5th 2007
                                // For in Firefox when press enter, the value is "\n".
                                //insertChar = "\r\n";
                                insertChar = sEnter;
                                // End by Yang
                                                            } else {
                                retInfo.SystemEdit = true;
                                return retInfo;
                            }
                        } else {
                            if(inputChar.GetLength() == 1) {
                                insertChar = this.Filter.Check(inputChar);
                            } else {
                                var ret = this.Filter.CheckText(inputChar);
                                insertChar = ret.CheckedText;
                                this.isInputValid = ret.IsInputValid;
                            }
                        }
                    }
                    //maxLength check
                    if(start == end) {
                        if(maxLength != 0) {
                            var maxLengthOfNewInput = maxLength - this.GetLength(oldText, lengthAsByte);
                            // Add comments by Yang at 15:22 Sep. 5th 2007
                            // For in Firefox when press enter, the value is "\n".
                            //if (insertChar == "\r\n")
                            if(insertChar == sEnter)// End by Yang
                             {
                                // Add comments by Yang at 15:22 Sep. 5th 2007
                                // For in Firefox when press enter, the value is "\n".
                                //if (maxLengthOfNewInput < 2 && maxLength != 0)
                                if(maxLengthOfNewInput < sEnter.GetLength() && maxLength != 0)// End  by Yang
                                 {
                                    insertChar = "";
                                }
                            } else {
                                if(!overwrite || (overwrite && start == oldText.GetLength())) {
                                    if(maxLength > this.GetLength(oldText, lengthAsByte)) {
                                        insertChar = this.MaxLengthCheck(insertChar, maxLengthOfNewInput, lengthAsByte);
                                    } else {
                                        insertChar = "";
                                    }
                                } else if(overwrite) {
                                    var remainedText = oldText.Substring(0, start);
                                    var leftText = oldText.Substring(start, oldText.GetLength());
                                    // Add comments by Yang at 15:22 Sep. 5th 2007
                                    // For in Firefox when press enter, the value is "\n".
                                    //var index = leftText.IndexOf("\r\n");
                                    var index = leftText.IndexOf(sEnter);
                                    // End by Yang
                                    if(index != -1) {
                                        remainedText += leftText.Substring(index, leftText.GetLength());
                                    }
                                    maxLengthOfNewInput = maxLength - this.GetLength(remainedText, lengthAsByte);
                                    insertChar = this.MaxLengthCheck(insertChar, maxLengthOfNewInput, lengthAsByte);
                                }
                            }
                        }
                    } else//start != end
                     {
                        var selectedText = oldText.Substring(Math.min(start, end), Math.max(start, end));
                        if(maxLength != 0) {
                            var maxLengthOfNewInput = maxLength - this.GetLength(oldText, lengthAsByte) + this.GetLength(selectedText, lengthAsByte);
                            // Add comments by Yang at 15:22 Sep. 5th 2007
                            // For in Firefox when press enter, the value is "\n".
                            //if (insertChar == "\r\n")
                            if(insertChar == sEnter)// End by Yang
                             {
                                // Add comments by Yang at 15:22 Sep. 5th 2007
                                // For in Firefox when press enter, the value is "\n".
                                //if (maxLengthOfNewInput < 2)
                                if(maxLengthOfNewInput < sEnter.GetLength())// End  by Yang
                                 {
                                    insertChar = "";
                                }
                            } else {
                                insertChar = this.MaxLengthCheck(insertChar, maxLengthOfNewInput, lengthAsByte);
                            }
                        }
                    }
                    if(maxLine != 0 && multiLine) {
                        if(maxLine >= this.GetLinesCount(oldText, isCountWrappedLine)) {
                            var foreText = oldText.Substring(0, start);
                            var backText = oldText.Substring(end, oldText.GetLength());
                            //				    insertChar = this.MaxLineCheck(foreText, backText, insertChar, maxLine, isCountWrappedLine);
                            if(this.PasswordMode) {
                                foreText = this.GetPasswordText(foreText, this.PasswordChar, multiLine);
                                backText = this.GetPasswordText(backText, this.PasswordChar, multiLine);
                                var passwordText = this.GetPasswordText(insertChar, this.PasswordChar, multiLine);
                                passwordText = this.MaxLineCheck(foreText, backText, passwordText, maxLine, isCountWrappedLine);
                                insertChar = insertChar.Substring(0, passwordText.GetLength());
                            } else {
                                insertChar = this.MaxLineCheck(foreText, backText, insertChar, maxLine, isCountWrappedLine);
                            }
                        } else {
                            insertChar = "";
                        }
                    }
                    //Sign for Format InvalidInput
                    //modified by sj 2008.8.13 for bug 594
                    //if (insertChar == "")
                    if(inputChar != "" && insertChar == "")//end by sj
                     {
                        this.isInputValid = false;
                    }
                    //Change OldText
                    var newText = oldText;
                    //Insert
                    // Add comments by Yang at 15:22 Sep. 5th 2007
                    // For in Firefox when press enter, the value is "\n".
                    //if (!overwrite || insertChar == "\r\n" || start != end)
                    if(!overwrite || insertChar == sEnter || start != end)// End by Yang
                     {
                        if(start > end) {
                            var temp = start;
                            start = end;
                            end = temp;
                        }
                        // Modified by shenyuan at 2006-01-13 for new undo rules.
                        if(start != end) {
                            retInfo.DelInclude = true;
                            this.IsDelInclude = true;
                        }
                        // Modified by shenyuan at 2006-01-23 for bug #5058.
                        //modified by sj to remove allowspace
                        //if (inputChar != " " || (allowspace != "None"))
                        if(insertChar != "")//end by sj
                         {
                            newText = oldText.Substring(0, start) + insertChar + oldText.Substring(end, oldText.GetLength());
                        }
                    } else//Overwrite
                     {
                        if(insertChar != "") {
                            if(start == oldText.GetLength()) {
                                newText = oldText + insertChar;
                            } else {
                                // Add comments by Yang at 15:22 Sep. 5th 2007
                                // For in Firefox when press enter, the value is "\n".
                                //if (start + 2 <= oldText.GetLength() && oldText.Substring(start,start + 2) == "\r\n")
                                if(start + sEnter.GetLength() <= oldText.GetLength() && oldText.Substring(start, start + sEnter.GetLength()) == sEnter)// End by Yang
                                 {
                                    newText = oldText.Substring(0, start) + insertChar + oldText.Substring(start, oldText.GetLength());
                                } else {
                                    // Modified by shenyuan at 2006-01-11 for bug 4731.
                                    var replacedText;
                                    if(maxLength == 0 || !lengthAsByte) {
                                        replacedText = oldText.Substring(start, start + insertChar.GetLength());
                                    } else {
                                        var i_Start = insertChar.GetLength();
                                        var nextChar = oldText.Substring(start, start + i_Start);
                                        var oldLength = this.GetLength(nextChar, lengthAsByte);
                                        var insertLength = this.GetLength(insertChar, lengthAsByte);
                                        while(insertLength > oldLength && i_Start <= oldText.GetLength()) {
                                            i_Start = i_Start + 1;
                                            nextChar = oldText.Substring(start, start + i_Start);
                                            oldLength = this.GetLength(nextChar, lengthAsByte);
                                        }
                                        replacedText = oldText.Substring(start, start + i_Start);
                                    }
                                    // Add comments by Yang at 15:22 Sep. 5th 2007
                                    // For in Firefox when press enter, the value is "\n".
                                    //var index = replacedText.IndexOf("\r");
                                    var index = replacedText.IndexOf(sEnter);
                                    // End by Yang
                                    if(index != -1) {
                                        newText = oldText.Substring(0, start) + insertChar + oldText.Substring(start + index, oldText.GetLength());
                                    } else {
                                        newText = oldText.Substring(0, start) + insertChar + oldText.Substring(start + replacedText.GetLength(), oldText.GetLength());
                                    }
                                    // Ended.
                                                                    }
                            }
                        }
                    }
                    retInfo.Text = newText;
                    retInfo.SetSelection = true;
                    //Reset Cursor position
                    if(this.isInputValid != false || insertChar.GetLength() > 0) {
                        retInfo.SelectionStart = start + insertChar.GetLength();
                        retInfo.SelectionEnd = retInfo.SelectionStart;
                    }
                    retInfo.EventInfo = new Array();
                    //InvalidInput
                    if(!this.isInputValid) {
                        this.isInputValid = true;
                        var ret = new Object();
                        //if (this.InvalidInputEvent != "" && this.InvalidInputEvent != null) {
                        ret.Name = this.control.InvalidInputEvent;
                        //ret.Args = "";
                        ret.Args = inputChar;
                        //Add comments by Ryan Wu at 10:47 Apr. 5 2007.
                        //For support Aspnet Ajax 1.0.
                        ret.Type = "invalidInput";
                        //end by Ryan Wu.
                        //}
                        retInfo.EventInfo[0] = ret;
                    }
                    //ExitOnLastChar
                    if(retInfo.Text != null && exitOnLastChar && maxLength != 0) {
                        var nowLength = this.GetLength(retInfo.Text.Substring(0, retInfo.SelectionStart), lengthAsByte);
                        if(nowLength == maxLength && insertChar != "") {
                            var ret = this.MoveControl(this.control.InputElement, true, false, "CharInput");//01-20
                            
                            // Modified by shenyuan at 2006-01-20.
                            if(ret != null) {
                                retInfo.EventInfo[1] = ret.EventInfo;
                                retInfo.FocusType = ret.FocusType;
                                retInfo.FocusExit = true;
                                retInfo.SetSelection = false;
                            }
                        }
                    }
                    return retInfo;
                } else {
                    return false;
                }
            };
            GcTextBoxUIProcess.prototype.TextBoxKeyUp = function (oText, multiLine, start, end, text) {
                var retInfo = new Object();
                //Add by Ryan Wu at 16:29 Feb. 19 2006.
                //For fix bug#4993.
                this.IsKeyDown = false;
                //end by Ryan Wu.
                retInfo.SelectionStart = input.Utility.GetSelectionStartPosition(oText);
                // Add comments by Yang at 14:00 Aug. 28th 2007
                // For Firefox doesn't support the method document.selection.createRange()
                //retInfo.SelectionEnd   = retInfo.SelectionStart + document.selection.createRange().text.GetLength();
                retInfo.SelectionEnd = retInfo.SelectionStart + input.Utility.GetSelectionText(this.control.InputElement).GetLength();
                // End by Yang
                if(this.systemEdit == true) {
                    this.systemEdit = false;
                    retInfo.SystemEdit = true;
                }
                if(this.ctrlDelete || this.ctrlBackspace) {
                    var finalStart;
                    if(this.ctrlDelete) {
                        finalStart = retInfo.SelectionStart;
                        this.ctrlDelete = false;
                    } else if(this.ctrlBackspace) {
                        finalStart = end;
                        this.ctrlBackspace = false;
                    }
                    retInfo.Text = text.Substring(0, start) + text.Substring(finalStart, text.GetLength());
                    retInfo.SelectionStart = retInfo.SelectionEnd = start;
                    retInfo.SetSelection = true;
                }
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.TextBoxMouseDown = function (oText, mouseButton) {
                this.isFocusing = false;
                return new Object();
            };
            GcTextBoxUIProcess.prototype.TextBoxMouseUp = function (oText, start, end, mouseButton, multiLine, text, isCtrlPress, highlightText, evt) {
                var retInfo = new Object();
                if(this.isFocusing) {
                    this.isFocusing = false;
                    if(highlightText) {
                        return retInfo;
                    }
                }
                //MoueButton.Left
                if(mouseButton == input.MouseButton.Left) {
                    //var elementID = this.ElementID + Utility.EditFieldSuffix;
                    //if (this.IsjQueryControl == true) {
                    //    elementID = this.ElementID;
                    //}
                    //Trick Click
                    if(this.isDblClick && !input.Utility.GrapeCityTimeout) {
                        this.isDblClick = false;
                        this.isTriClick = true;
                        if(multiLine) {
                            var position = input.Utility.GetSelectionStartPosition(oText);
                            var ret = this.GetLineEnds(position, text);
                            if(ret.start != null) {
                                retInfo.SelectionStart = ret.start;
                            }
                            if(ret.end != null) {
                                retInfo.SelectionEnd = ret.end;
                            }
                        } else {
                            retInfo.SelectionStart = 0;
                            retInfo.SelectionEnd = text.GetLength();
                        }
                    } else // Add comments by Yang at 14:00 Aug. 28th 2007
                    // For firefox doesn't support "document.selection.createRange().text"
                    //else if (document.selection.createRange().text != "" || !multiLine)
                    if(input.Utility.GetSelectionText(this.control.InputElement) != "" || !multiLine)// End by Yang
                     {
                        retInfo.SelectionStart = input.Utility.GetSelectionStartPosition(oText);
                        retInfo.SelectionEnd = retInfo.SelectionStart + input.Utility.GetSelectionText(this.control.InputElement).GetLength();
                    } else // Added by shenyuan at 2006-01-17 for bug 4975.
                    // When the multiline edit is empty, selection start should be 0.
                    if(input.Utility.GetSelectionText(this.control.InputElement) == "") {
                        retInfo.SelectionStart = input.Utility.GetSelectionStartPosition(oText);
                        retInfo.SelectionEnd = retInfo.SelectionStart + input.Utility.GetSelectionText(this.control.InputElement).GetLength();
                    } else// Ended.
                     {
                        retInfo.SelectionStart = input.Utility.GetSelectionStartPosition(oText);
                        if(document.selection) {
                            if(evt.y < document.selection.createRange().offsetTop)//For Bug 3681
                             {
                                retInfo.SelectionStart -= 2;
                            }
                        }
                        retInfo.SelectionEnd = retInfo.SelectionStart;
                    }
                    //Add comments by Yang at 14:00 Sep. 23 2007.
                    //For fix the bug 8848.
                    if(!input.Utility.IsIE() && input.Utility.FuncKeysPressed.Ctrl) {
                        //modified by sj for bug 874
                        //	            retInfo = this.SelectAll(oText.value);
                        //		        return retInfo;
                        if(multiLine) {
                            var position = input.Utility.GetSelectionStartPosition(oText);
                            var ret = this.GetLineEnds(position, text);
                            if(ret.start != null) {
                                retInfo.SelectionStart = ret.start;
                            }
                            if(ret.end != null) {
                                retInfo.SelectionEnd = ret.end;
                            }
                        } else {
                            retInfo.SelectionStart = 0;
                            retInfo.SelectionEnd = text.GetLength();
                        }
                        //end by sj
                                            }
                    //End by Yang.
                    if(retInfo.SelectionStart != retInfo.SelectionEnd) {
                        retInfo.SetSelection = true//For Bug 3782
                        ;
                    }
                }
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.GetLineEnds = function (realCursorPosition, text) {
                var temp = text;
                var position1 = 0;
                // Add comments by Yang at 15:22 Sep. 5th 2007
                // For in Firefox when press enter, the value is "\n".
                var sEnter = "\r\n";
                if(!input.Utility.IsIE() || parseInt($.browser.version) >= 9) {
                    sEnter = "\n";
                }
                // End by Yang
                // Add comments by Yang at 15:22 Sep. 5th 2007
                // For in Firefox when press enter, the value is "\n".
                //var position2 = temp.IndexOf("\r\n");
                var position2 = temp.IndexOf(sEnter);
                // End by Yang
                var retInfo = new Object();
                while(position2 != -1) {
                    // Add comments by Yang at 15:22 Sep. 5th 2007
                    // For in Firefox when press enter, the value is "\n".
                    //if(realCursorPosition >=  position1 && realCursorPosition < position1 + position2 + 2)
                    if(realCursorPosition >= position1 && realCursorPosition < position1 + position2 + sEnter.GetLength())// End by Yang
                     {
                        retInfo.start = position1;
                        retInfo.end = position1 + position2;
                        return retInfo;
                    } else {
                        // Add comments by Yang at 15:22 Sep. 5th 2007
                        // For in Firefox when press enter, the value is "\n".
                        //position1 = position1 + position2 + 2;
                        //temp = temp.Substring(position2 + 2, temp.GetLength());
                        //position2  = temp.IndexOf("\r\n");
                        position1 = position1 + position2 + sEnter.GetLength();
                        temp = temp.Substring(position2 + sEnter.GetLength(), temp.GetLength());
                        position2 = temp.IndexOf(sEnter);
                        // End by Yang
                                            }
                }
                retInfo.start = position1;
                retInfo.end = text.GetLength();
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.ShowContextMenu = function (oText, multiLine) {
                var retInfo = new Object();
                //var elementID = this.ElementID + Utility.EditFieldSuffix;
                //if (this.IsjQueryControl == true) {
                //    elementID = this.ElementID;
                //}
                retInfo.SelectionStart = input.Utility.GetSelectionStartPosition(oText);
                retInfo.SelectionEnd = retInfo.SelectionStart + input.Utility.GetSelectionText(this.control.InputElement).GetLength();
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.TextBoxDoubleClick = function (oText, start, text) {
                //var elementID = this.ElementID + Utility.EditFieldSuffix;
                //if (this.IsjQueryControl == true) {
                //    elementID = this.ElementID;
                //}
                this.isDblClick = true;
                //set timer for tripple click
                input.Utility.GrapeCityTimeout = false;
                window.setTimeout(function () {
                    input.Utility.GrapeCityTimeout = true;
                }, 500);
                var retInfo = new Object();
                retInfo.SelectionStart = input.Utility.GetSelectionStartPosition(oText);
                retInfo.SelectionEnd = retInfo.SelectionStart + input.Utility.GetSelectionText(this.control.InputElement).GetLength();
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.SelectStart = function (obj, selText, multiLine) {
                if(this.isTriClick) {
                    this.isTriClick = false;
                }
                var retInfo = new Object();
                retInfo.SelectionStart = input.Utility.GetSelectionStartPosition(obj);
                retInfo.SelectionEnd = retInfo.SelectionStart;
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.Copy = function (text, start, end) {
                if(start != end) {
                    if(start > end) {
                        var temp = start;
                        start = end;
                        end = temp;
                    }
                    var cText = text.Substring(start, end);
                    var useClipboard = true;
                    if(this.Owner) {
                        if(this.Owner.MultiLine === false) {
                            cText = input.BaseUIProcess.UpdateCrLfString(cText, this.Owner.AcceptsCrLf);
                        }
                        useClipboard = this.Owner.UseClipboard;
                    }
                    if(!input.Utility.IsIE()) {
                        input.Utility.SetCopy(cText, false);
                    } else {
                        input.Utility.SetCopy(cText, useClipboard);
                    }
                }
            };
            GcTextBoxUIProcess.prototype.TextBoxPaste = function (start, end, text, exitOnLastChar, acceptTab, acceptReturn, maxLength, lengthAsByte, maxLine, isCountWrappedLine, multiLine, clipboardtext, isSetSelectedText) {
                // maxLine multiLine isCountWrappedLine
                this.isInputValid = true;
                var retInfo = new Object();
                var useClipboard = (this.Owner ? this.Owner.UseClipboard : true);
                if(!input.Utility.IsIE()) {
                    useClipboard = false;
                }
                //var pasteData = Utility.GetPasteData(this.Owner ? this.Owner.GetUseClipboard() : true);
                var pasteData = (clipboardtext == null ? input.Utility.GetPasteData(useClipboard) : clipboardtext);
                if(input.Utility.chrome) {
                    pasteData = pasteData.replace(/\r\n/g, "\n");
                }
                if(!isSetSelectedText && this.Owner && this.Owner.MultiLine === false) {
                    pasteData = input.BaseUIProcess.UpdateCrLfString(pasteData, this.Owner.AcceptsCrLf);
                }
                if(input.Utility.IsIE9OrLater()) {
                    if(this.Owner && this.Owner.MultiLine === true) {
                        // DaryLuo 2013/05/07 fix bug 1067 in IM Web 7.0, html textarea doesn't support '\r' char.
                        pasteData = input.BaseUIProcess.FilterReturnChar(pasteData);
                    }
                }
                ;
                if(pasteData == null) {
                    return retInfo;
                }
                this.FireClientEvent("OnBeforePaste");
                var formatedPasteData = this.FormatCheck(pasteData, acceptTab, acceptReturn);
                var maxLengthCheckedPasteDate = formatedPasteData;
                var maxLengthOfNewInput;
                if(maxLength != 0) {
                    //Modified for lengthAsByte == true
                    //The selectedText's length may not be start - end
                    var selectedTextLength = this.GetLength(text.Substring(Math.min(start, end), Math.max(start, end)), lengthAsByte);
                    maxLengthOfNewInput = maxLength - this.GetLength(text, lengthAsByte) + selectedTextLength;
                    maxLengthCheckedPasteDate = this.MaxLengthCheck(formatedPasteData, maxLengthOfNewInput, lengthAsByte);
                }
                if(maxLine != 0 && multiLine) {
                    if(maxLine >= this.GetLinesCount(text, isCountWrappedLine)) {
                        var foreText = text.Substring(0, start);
                        var backText = text.Substring(end, text.GetLength());
                        //			    maxLengthCheckedPasteDate = this.MaxLineCheck(foreText, backText, maxLengthCheckedPasteDate, maxLine, isCountWrappedLine);
                        if(this.PasswordMode) {
                            foreText = this.GetPasswordText(foreText, this.PasswordChar, multiLine);
                            backText = this.GetPasswordText(backText, this.PasswordChar, multiLine);
                            var passwordText = this.GetPasswordText(maxLengthCheckedPasteDate, this.PasswordChar, multiLine);
                            passwordText = this.MaxLineCheck(foreText, backText, passwordText, maxLine, isCountWrappedLine);
                            maxLengthCheckedPasteDate = maxLengthCheckedPasteDate.Substring(0, passwordText.GetLength());
                        } else {
                            maxLengthCheckedPasteDate = this.MaxLineCheck(foreText, backText, maxLengthCheckedPasteDate, maxLine, isCountWrappedLine);
                        }
                    } else {
                        maxLengthCheckedPasteDate = "";
                    }
                }
                var selectionStart = Math.min(start, end);
                var selectionEnd = Math.max(start, end);
                // HelenLiu 2013/06/14 fix bug 688 in IM HTML5.
                if(maxLengthCheckedPasteDate != "" || isSetSelectedText === true) {
                    retInfo.Text = text.Substring(0, selectionStart) + maxLengthCheckedPasteDate + text.Substring(selectionEnd, text.GetLength());
                    //// HelenLiu 2013/06/09 fix bug 645 in IM HTML5.0.
                    //if (isSetSelectedText === true) {
                    //    retInfo.SelectionStart = selectionStart;
                    //    retInfo.SelectionEnd = retInfo.SelectionStart + maxLengthCheckedPasteDate.GetLength();
                    //} else {
                    retInfo.SelectionStart = selectionStart + maxLengthCheckedPasteDate.GetLength();
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                    //}
                                    }
                retInfo.SetSelection = true;
                // Modified by shenyuan at 2006-01-13 for new undo rules
                if(start != end) {
                    retInfo.DelInclude = true;
                    this.IsDelInclude = true;
                }
                retInfo.EventInfo = new Array();
                //InvalidInput
                if(!this.isInputValid) {
                    this.isInputValid = true;
                    var ret = new Object();
                    //if (this.InvalidInputEvent != "" && this.InvalidInputEvent != null) {
                    ret.Name = this.control.InvalidInputEvent;
                    //ret.Args = "";
                    ret.Args = pasteData;
                    //Add comments by Ryan Wu at 10:47 Apr. 5 2007.
                    //For support Aspnet Ajax 1.0.
                    ret.Type = "invalidInput";
                    //end by Ryan Wu.
                    //}
                    retInfo.EventInfo[0] = ret;
                }
                //ExitOnLastChar
                if(retInfo.Text != null) {
                    var nowLength = this.GetLength(retInfo.Text.Substring(0, retInfo.SelectionStart), lengthAsByte);
                } else {
                    // DaryLuo 2012/11/02 fix bug 857 in IM Web 7.0.
                    var nowLength = 0;
                }
                if(maxLength != 0 && nowLength == maxLength && exitOnLastChar && maxLengthCheckedPasteDate != "") {
                    // Add comments by Yang at 11:10 October 11th 2007
                    // For fix the bug 9000
                    // HelenLiu 2013/07/04 fix bug 744 in IM HTML5.
                    //if (!Utility.IsIE()) {
                    //    FindIMControl(this.ElementID).SetServerSideText(retInfo.Text);
                    //}
                    // End by Yang
                    var ret = this.MoveControl(this.control.InputElement, true, false, "CharInput");//01-20
                    
                    // Modified by shenyuan at 2006-01-20.
                    if(ret != null) {
                        retInfo.EventInfo[1] = ret.EventInfo;
                        retInfo.FocusType = ret.FocusType;
                        retInfo.FocusExit = true;
                        retInfo.SetSelection = false;
                    }
                }
                this.FireClientEvent("OnPaste");
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.Cut = function (text, start, end) {
                var retInfo = new Object();
                //this.FireClientEvent("OnBeforeCut");
                //modified by sj 2008.8.8 for bug 82
                if(start != end) {
                    this.FireClientEvent("OnBeforeCut");
                }
                //end by sj
                this.Copy(text, start, end);
                //Delete the Selection part
                if(start < end) {
                    retInfo.SelectionStart = start;
                    retInfo.Text = text.Substring(0, start) + text.Substring(end, text.GetLength());
                } else {
                    retInfo.SelectionStart = end;
                    retInfo.Text = text.Substring(0, end) + text.Substring(start, text.GetLength());
                }
                retInfo.SelectionEnd = retInfo.SelectionStart;
                retInfo.SetSelection = true;
                //Modified by shenyuan at 2006-02-20 for bug #5303.
                //Modified by shenyuan at 2006-02-27 for bug #5377.
                if(retInfo.Text != text) {
                    retInfo.DelInclude = true;
                    this.IsDelInclude = true;
                }
                //this.FireClientEvent("OnCut");
                //modified by sj 2008.8.8 for bug 82
                if(start != end) {
                    this.FireClientEvent("OnCut");
                }
                //end by sj
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.TextBoxUndo = function (text, buffText, undoText, oldStart, oldEnd, oStart, oEnd) {
                var retInfo = new Object();
                // Modified by shenyuan at 2006-01-13 for new undo rules.
                //if (text != undoText)
                if(this.IsDelInclude) {
                    if(text != buffText) {
                        retInfo.Text = buffText;
                        //retInfo.SelectionStart = buffText.GetLength();
                        //retInfo.SelectionEnd = buffText.GetLength();
                        // Modified by shenyuan at 2006-02-07 for bug #5101.
                        retInfo.SelectionStart = oStart;
                        retInfo.SelectionEnd = oEnd;
                        retInfo.SetSelection = true;
                        retInfo.DelInclude = true;
                        retInfo.Undo = true;
                    }
                } else {
                    if(text != undoText) {
                        retInfo.Text = undoText;
                        retInfo.SelectionStart = oldStart;
                        retInfo.SelectionEnd = oldEnd;
                        retInfo.SetSelection = true;
                        retInfo.Undo = true;
                    }
                }
                //Modified by shenyuan at 2006-01-24 for bug #5100.
                //When undo is done, the StartPos should be initialized.
                this.StartPos = null;
                //Modified by shenyuan at 2006-02-21 for reopened bug #5098.
                this.LastKey = null;
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.Delete = function (multiLine, text, start, end) {
                var retInfo = new Object();
                if(start < end) {
                    retInfo.SelectionStart = start;
                    retInfo.Text = text.Substring(0, start) + text.Substring(end, text.GetLength());
                } else {
                    retInfo.SelectionStart = end;
                    retInfo.Text = text.Substring(0, end) + text.Substring(start, text.GetLength());
                }
                retInfo.SelectionEnd = retInfo.SelectionStart;
                retInfo.SetSelection = true;
                //Modified by shenyuan at 2006-02-27 for bug #5385.
                if(retInfo.Text != text) {
                    retInfo.DelInclude = true;
                    this.IsDelInclude = true;
                }
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.TextBoxSelectAll = function (text) {
                var retInfo = new Object();
                retInfo.SelectionStart = 0;
                retInfo.SelectionEnd = text.GetLength();
                retInfo.SetSelection = true;
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.DragDrop = function (dragText, exitOnLastChar, start, end, maxLength, lengthAsByte, maxLine, isCountWrappedLine, multiLine, text) {
                this.isInputValid = true;
                var retInfo = new Object();
                var formatedDragText = this.FormatCheck(dragText);
                var maxLengthCheckedDragText = formatedDragText;
                var maxLengthOfNewInput = 0;
                if(maxLength != 0) {
                    maxLengthOfNewInput = maxLength - this.GetLength(text, lengthAsByte);
                    maxLengthCheckedDragText = this.MaxLengthCheck(formatedDragText, maxLengthOfNewInput, lengthAsByte);
                }
                if(maxLine != 0 && multiLine) {
                    if(maxLine >= this.GetLinesCount(text, isCountWrappedLine)) {
                        var foreText = text.Substring(0, start);
                        var backText = text.Substring(end, text.GetLength());
                        //			    maxLengthCheckedDragText = this.MaxLineCheck(foreText, backText, maxLengthCheckedDragText, maxLine, isCountWrappedLine);
                        if(this.PasswordMode) {
                            foreText = this.GetPasswordText(foreText, this.PasswordChar, multiLine);
                            backText = this.GetPasswordText(backText, this.PasswordChar, multiLine);
                            var passwordText = this.GetPasswordText(maxLengthCheckedDragText, this.PasswordChar, multiLine);
                            passwordText = this.MaxLineCheck(foreText, backText, passwordText, maxLine, isCountWrappedLine);
                            //maxLengthCheckedDragText = insertChar.Substring(0, maxLengthCheckedDragText.GetLength());
                            maxLengthCheckedDragText = passwordText.Substring(0, maxLengthCheckedDragText.GetLength());
                        } else {
                            maxLengthCheckedDragText = this.MaxLineCheck(foreText, backText, maxLengthCheckedDragText, maxLine, isCountWrappedLine);
                        }
                    } else {
                        maxLengthCheckedDragText = "";
                    }
                }
                retInfo.DropText = maxLengthCheckedDragText;
                retInfo.EventInfo = new Array();
                //InvalidInput
                if(!this.isInputValid) {
                    this.isInputValid = true;
                    var ret = new Object();
                    //if (this.InvalidInputEvent != "" && this.InvalidInputEvent != null) {
                    ret.Name = this.control.InvalidInputEvent;
                    //ret.Args = "";
                    ret.Args = formatedDragText;
                    //Add comments by Ryan Wu at 10:47 Apr. 5 2007.
                    //For support Aspnet Ajax 1.0.
                    ret.Type = "invalidInput";
                    //end by Ryan Wu.
                    //}
                    retInfo.EventInfo[0] = ret;
                }
                //ExitOnLastChar
                if(this.GetLength(formatedDragText, lengthAsByte) >= maxLengthOfNewInput && maxLength != 0 && exitOnLastChar && maxLengthCheckedDragText != "") {
                    //var ret = this.MoveControl(this.ElementID, true);
                    var ret = new Object();
                    if(this.Owner.KeyExitEvent != "" && this.Owner.KeyExitEvent != null) {
                        ret.Name = this.Owner.KeyExitEvent;
                        //modified by sj 2008.8.13 for bug 582
                        //ret.Args="";
                        ret.Args = new Object();
                        ret.Args.Key = 9;
                        //end by sj
                        //Add comments by Ryan Wu at 10:48 Apr. 5 2007.
                        //For support Aspnet Ajax 1.0.
                        ret.Type = "KeyExit";
                        //end by Ryan Wu.
                                            }
                    retInfo.EventInfo[1] = ret;
                    //retInfo.FocusType = ret.FocusType;
                    //retInfo.FocusExit = true;
                                    }
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.TextBoxFocus = function (focusType, oText, text, multiline, highlightText, showContextmenu) {
                var retInfo = new Object();
                this.isFocusing = true;
                //var elementID = this.ElementID + Utility.EditFieldSuffix;
                //if (this.IsjQueryControl == true) {
                //    elementID = this.ElementID;
                //}
                //Add comments by Ryan Wu at 15:38 Apr. 27 2007.
                //For fix the bug#7769.
                if(focusType === input.FocusType.Left) {
                    retInfo.SelectionStart = 0;
                    retInfo.SelectionEnd = 0;
                } else if(focusType === input.FocusType.Right) {
                    retInfo.SelectionStart = text.GetLength();
                    retInfo.SelectionEnd = text.GetLength();
                }
                //end by Ryan Wu.
                if(!highlightText) {
                    if(focusType === input.FocusType.Click || focusType == input.FocusType.DragDrop)//For bug 4309
                     {
                        retInfo.SelectionStart = input.Utility.GetSelectionStartPosition(oText);
                        retInfo.SelectionEnd = retInfo.SelectionStart + input.Utility.GetSelectionText(this.control.InputElement).GetLength();
                    }
                } else // Modified by shenyuan at 2006-01-24 for bug 4961.
                // when context menu is open, click the item
                // of context menu should't change the selectionstart and end.
                if(!showContextmenu) {
                    retInfo.SelectionStart = 0;
                    retInfo.SelectionEnd = text.GetLength();
                }
                if((focusType !== input.FocusType.Click) || highlightText) {
                    retInfo.SetSelection = true;
                }
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.MaxLengthCheck = function (text, maxLength, lengthAsByte) {
                var checkedText = "";
                var textLength = 0;
                //if text "\r\n",text cannot be clipped
                if(text == "\r\n") {
                    if(maxLength >= 2) {
                        checkedText = text;
                    }
                } else {
                    if(lengthAsByte) {
                        for(var i = 0; i < text.GetLength(); i++) {
                            var substr = text.Substring(i, i + 1);
                            if(substr.length >= 2) {
                                textLength += 2 * substr.length;
                            } else if(this.Filter.IsFullWidth(substr)) {
                                textLength += 2;
                            } else {
                                textLength++;
                            }
                            if(textLength <= maxLength) {
                                checkedText += text.Substring(i, i + 1);
                            } else {
                                break;
                            }
                        }
                    } else {
                        if(text.GetLength() <= maxLength) {
                            checkedText = text;
                        } else {
                            checkedText = text.Substring(0, maxLength);
                        }
                    }
                }
                var temp = checkedText.GetLength();
                if(temp != 0 && checkedText.Substring(temp - 1, temp) == "\r") {
                    checkedText = checkedText.Substring(0, temp - 1);
                }
                if(checkedText != text) {
                    this.isInputValid = false;
                }
                return checkedText;
            };
            GcTextBoxUIProcess.prototype.MaxLineCheck = function (foreText, backText, insertText, maxLine, isCountWrappedLine) {
                var checkedText = "";
                var maxLineText = foreText + insertText + backText;
                var lineCount = this.GetLinesCount(maxLineText, isCountWrappedLine);
                if(lineCount <= maxLine) {
                    checkedText = insertText;
                } else {
                    var start = 0;
                    var end = insertText.GetLength();
                    do {
                        var mid = Math.floor((start + end) / 2);
                        var tempInsert = insertText.Substring(0, mid);
                        maxLineText = foreText + tempInsert + backText;
                        lineCount = this.GetLinesCount(maxLineText, isCountWrappedLine);
                        if(lineCount > maxLine) {
                            end = mid;
                        } else if(lineCount < maxLine) {
                            start = mid;
                        } else if((lineCount == maxLine) && (end > start + 1)) {
                            start = mid;
                        } else if((lineCount == maxLine) && (end == start + 1)) {
                            break;
                        }
                    }while(start < end);
                    checkedText = insertText.Substring(0, start);
                }
                if(checkedText != insertText) {
                    this.isInputValid = false;
                }
                return checkedText;
            };
            GcTextBoxUIProcess.prototype.GetLinesCount = function (text, countWrappedLine) {
                var count = 1;
                var isWrappedLine = countWrappedLine;
                if(text == "") {
                    return count;
                }
                var obj = this._testTextArea;
                if(this._testTextArea === undefined || this._testTextArea === null) {
                    this._testTextArea = $("<textarea/>");
                    this._testTextArea.css('visibility', "hidden");
                    this._testTextArea.css('position', "absolute");
                    this._testTextArea.css('left', "-100000000px");
                    this._testTextArea.css('top', "-100000000px");
                    this._testTextArea.attr('rows', 1);
                    this._testTextArea.appendTo($(document.body));
                    obj = this._testTextArea;
                    isWrappedLine = false;
                }
                if(!isWrappedLine) {
                    var temptext = text;
                    var savetext = temptext;
                    var index = temptext.IndexOf("\r\n");
                    count = 1;
                    while(index != -1) {
                        savetext = savetext.replace("\r\n", "");
                        count = count + 1;
                        temptext = temptext.Substring(index + 2, temptext.GetLength());
                        index = temptext.IndexOf("\r\n");
                    }
                    temptext = savetext;
                    index = temptext.IndexOf("\r");
                    while(index != -1) {
                        savetext = savetext.replace("\r", "");
                        count = count + 1;
                        temptext = temptext.Substring(index + 1, temptext.GetLength());
                        index = temptext.IndexOf("\r");
                    }
                    temptext = savetext;
                    index = temptext.IndexOf("\n");
                    while(index != -1) {
                        savetext = savetext.replace("\n", "");
                        count = count + 1;
                        temptext = temptext.Substring(index + 1, temptext.GetLength());
                        index = temptext.IndexOf("\n");
                    }
                    return count;
                }
                // Add comments by Yang at 16:54 Dec.2th 2008
                // For fix the bug TTP 751
                var temptext1 = text;
                temptext1 = temptext1.replace(/\r\n/g, "\r");
                temptext1 = temptext1.replace(/\n/g, "\r");
                var index = temptext1.IndexOf("\r");
                if(index != -1) {
                    count = 0;
                    var preText = temptext1.Substring(0, index);
                    count += this.GetLinesCount(preText, countWrappedLine);
                    temptext1 = temptext1.Substring(index + 1, temptext1.GetLength());
                    count += this.GetLinesCount(temptext1, countWrappedLine);
                    return count;
                } else// End by Yang
                 {
                    //modified by sj 2008.8.12 for bug 365
                    var obj_edit = $(this.control.InputElement);
                    // HelenLiu 2013/06/19 fix bug 754 in IM HTML5.
                    obj.css('fontSize', obj_edit.css('fontSize'));
                    obj.css('fontFamily', obj_edit.css('fontFamily'));
                    obj.css('width', obj_edit.css('width'));
                    obj.css('borderWidth', obj_edit.css('borderWidth'));
                    obj.css('padding', obj_edit.css('padding'));
                    // HelenLiu 2013/07/17 fix bug 1098 in IM HTML5.
                    obj.css('wordWrap', obj_edit.css('wordWrap'));
                    //obj.style.overflowX = obj_edit.style.overflowX;
                    obj.css('overflowY', obj_edit.css('overflowY'));
                    //end by sj
                    if(obj != null) {
                        obj.val(text);
                        obj = obj.get(0);
                        while(obj.scrollHeight - obj.clientHeight > 1) {
                            // allow 1px error. because IE can't measure accurately. defect #21 in "Wijmo Input".
                            obj.rows++;
                        }
                        obj.scrollTop = 0;
                        count = obj.rows;
                        if(obj.rows > 1) {
                            obj.rows = 1;
                        }
                        return count;
                    }
                }
            };
            GcTextBoxUIProcess.prototype.FormatCheck = function (text, acceptTab, acceptReturn) {
                if(this.Owner && !this.Owner.MultiLine && text) {
                    if(typeof (text) != "string") {
                        text = text.toString();
                    }
                    text = text.replace(/[\r\n]/g, "");
                }
                var ret = this.Filter.CheckText(text);
                var formatedText = ret.CheckedText;
                this.isInputValid = ret.IsInputValid;
                return formatedText;
            };
            GcTextBoxUIProcess.prototype.ListValidateCheck = function (text) {
                var temp = this.Filter.autoConvert;
                this.Filter.autoConvert = false;
                var ret = this.Filter.CheckText(text);
                this.Filter.autoConvert = temp;
                return ret.IsInputValid;
            };
            GcTextBoxUIProcess.prototype.GetLength = function (text, lengthAsByte) {
                var textLength = 0;
                if(lengthAsByte) {
                    for(var i = 0; i < text.GetLength(); i++) {
                        var substr = text.Substring(i, i + 1);
                        if(substr.length >= 2) {
                            textLength += 2 * substr.length;
                        } else if(this.Filter.IsFullWidth(substr)) {
                            textLength += 2;
                        } else {
                            textLength++;
                        }
                    }
                } else {
                    textLength = text.GetLength();
                }
                return textLength;
            };
            GcTextBoxUIProcess.prototype.TextBoxProcessBackSpace = function (multiLine, text, start, end) {
                var retInfo = new Object();
                this.systemEdit = true;
                this.keyupResponse = true;
                retInfo.System = true;
                return retInfo;
            };
            GcTextBoxUIProcess.prototype.GetRightWordPosition = function (start, text) {
                if(start < text.GetLength()) {
                    var cursorPosition = start;
                    var character = text.Substring(start, start + 1);
                    var previousChar = character;
                    while(!((this.Filter.IsFormatSpace(previousChar) && !(this.Filter.IsFormatSpace(character))) || ((character == "\r" || previousChar == "\n") && start != cursorPosition) || ((character == "\t" || previousChar == "\t") && start != cursorPosition))) {
                        cursorPosition = cursorPosition + 1;
                        if(cursorPosition < text.GetLength()) {
                            previousChar = character;
                            character = text.Substring(cursorPosition, cursorPosition + 1);
                        } else {
                            break;
                        }
                    }
                    return cursorPosition;
                } else {
                    return start;
                }
            };
            GcTextBoxUIProcess.prototype.DelOperation = function (dKey, sPosition, ePosition) {
                this.IsDelInclude = true;
                var selectlength = Math.abs(ePosition - sPosition);
                switch(dKey) {
                    case //BackSpace
                    8:
                        //Add by shenyuan at 2006-02-28 for bug #5411.
                        var isPressContinuousely = false;
                        //If this.IsKeyDown is true, then indicate that the current action is pressing the key continousely.
                        if(this.IsKeyDown) {
                            isPressContinuousely = true;
                        } else {
                            this.IsKeyDown = true;
                            this.CurStart = sPosition - 1;
                        }
                        if(isPressContinuousely) {
                            this.IsSerialDel = true;
                            break;
                        } else {
                            if(this.CurStart == this.StartPos) {
                                this.IsSerialDel = true;
                                this.CurStart -= 1;
                            }
                        }
                        //Ended.
                        if(sPosition != ePosition) {
                            if(sPosition < this.StartPos) {
                                this.StartPos -= selectlength;
                            } else if(sPosition == this.StartPos) {
                                this.IsSerialDel = true;
                                this.StartPos = sPosition;
                                break;
                            }
                        } else if(sPosition == this.StartPos) {
                            this.IsSerialDel = true;
                            this.StartPos = sPosition - 1;
                            break;
                        }
                        sPosition -= 1;
                        if(this.StartPos == sPosition) {
                            this.IsSerialDel = true;
                        } else {
                            this.IsSerialDel = false;
                        }
                        this.StartPos = sPosition - 1;
                        break;
                        //Ctrl + BackSpace   Ctrl + Shift + BackSpace Key
                                            case 131080:
                    case 196616:
                        if(sPosition == ePosition) {
                            sPosition -= 1;
                        } else if(sPosition < this.StartPos) {
                            this.StartPos -= selectlength;
                        } else if(sPosition == this.StartPos) {
                            this.IsSerialDel = true;
                            this.StartPos = sPosition - 1;
                            break;
                        }
                        if(this.StartPos == sPosition) {
                            this.IsSerialDel = true;
                        } else {
                            this.IsSerialDel = false;
                        }
                        this.StartPos = sPosition - 1;
                        break;
                        //Shift + BackSpace
                                            case 65544:
                        if(sPosition != ePosition) {
                            if(sPosition < this.StartPos) {
                                this.StartPos -= selectlength;
                            }
                        }
                        if(this.StartPos == sPosition) {
                            this.IsSerialDel = true;
                        } else {
                            this.IsSerialDel = false;
                        }
                        this.StartPos = sPosition - 1;
                        break;
                        //Shift + Delete
                                            case 65582:
                        if(sPosition == ePosition) {
                            sPosition -= 1;
                        } else if(sPosition < this.StartPos) {
                            this.StartPos -= selectlength;
                        } else if(sPosition == this.StartPos) {
                            this.IsSerialDel = true;
                            this.StartPos = sPosition;
                            break;
                        }
                        if(this.StartPos == sPosition || this.StartPos == ePosition) {
                            this.IsSerialDel = true;
                        } else {
                            this.IsSerialDel = false;
                        }
                        this.StartPos = sPosition - 1;
                        break;
                        //Delete
                                            case 46:
                        var tmpPos = null;
                        if(this.LastKey == 8) {
                            tmpPos = sPosition;
                            sPosition -= 1;
                        }
                        if(this.StartPos == sPosition || (this.StartPos != null && Math.abs(this.StartPos - sPosition) == 1) || this.StartPos == ePosition) {
                            this.IsSerialDel = true;
                        } else {
                            this.IsSerialDel = false;
                            //Added by shenyuan for bug #5404.
                            if(tmpPos != null) {
                                this.StartPos = tmpPos;
                                break;
                            }
                        }
                        this.StartPos = sPosition;
                        break;
                        //Ctrl + Delete
                                            case 131118:
                        if(sPosition != ePosition) {
                            if(sPosition < this.StartPos) {
                                this.StartPos -= selectlength;
                            } else if(sPosition == this.StartPos) {
                                this.IsSerialDel = true;
                                this.StartPos = sPosition;
                                break;
                            }
                        }
                        sPosition -= 1;
                        if(this.StartPos == sPosition || (sPosition - this.StartPos) == 1) {
                            this.IsSerialDel = true;
                        } else {
                            this.IsSerialDel = false;
                        }
                        this.StartPos = sPosition;
                        break;
                }
                this.LastKey = dKey;
            };
            GcTextBoxUIProcess.prototype.GetPasswordText = function (text, passowrdchar, multiline) {
                var passwordText = "";
                for(var i = 0; i < text.GetLength(); i++) {
                    var singletext = text.Substring(i, i + 1);
                    if(singletext != "\r" && singletext != "\n") {
                        passwordText += passowrdchar;
                    } else {
                        if(multiline) {
                            passwordText += singletext;
                        }
                    }
                }
                return passwordText;
            };
            return GcTextBoxUIProcess;
        })(input.BaseUIProcess);
        input.GcTextBoxUIProcess = GcTextBoxUIProcess;        
        ;
        /** @ignore */
        var AutoComplete = (function () {
            function AutoComplete(owner) {
                this._hightlightIndex = -1;
                this._dataList = [];
                this._isDeleteItem = false;
                this._isFocusOnList = false;
                this._isMouseOnList = false;
                this._owner = owner;
                var defaultMaxItems = 5;
                this._maxItems = defaultMaxItems;
                this._firstItemShowing = 0;
                this._lastItemShowing = defaultMaxItems - 1;
                this._refreshElement();
                this._createDropdown();
            }
            AutoComplete.prototype._refreshElement = function () {
                this._controlContainer = this._owner.GetContainer();
                this._inputElement = this._owner.GetJQueryInputElement();
                this._maxItems = this._owner.GetMaxHistoryCount();
                if(this._inputElement) {
                    this._inputElement.attr("autocomplete", "off");
                }
            };
            AutoComplete.prototype._createDropdown = function () {
                var div = $("<div>");
                div.css({
                    "position": "absolute",
                    "zIndex": "999999",
                    "display": "none",
                    "backgroundColor": "white",
                    "border": "solid 1px black",
                    "overflowX": "hidden",
                    "overflowY": "auto"
                });
                var self = this;
                div.bind("focus", function () {
                    self._isFocusOnList = true;
                    div.blur();
                    self._owner.SetInnerFocus(input.FocusType.ContextMenu);
                });
                div.bind("mouseover", function () {
                    self._isMouseOnList = true;
                });
                div.bind("mouseout", function () {
                    self._isMouseOnList = false;
                });
                div.bind("contextmenu", function (evt) {
                    evt.preventDefault();
                });
                this._dropDownElement = div;
            };
            AutoComplete.prototype.GetIsDeleteItem = function () {
                return this._isDeleteItem;
            };
            AutoComplete.prototype.SetIsDeleteItem = function (value) {
                this._isDeleteItem = value;
            };
            AutoComplete.prototype.GetIsFocusOnList = function () {
                return this._isFocusOnList;
            };
            AutoComplete.prototype.SetIsFocusOnList = function (value) {
                this._isFocusOnList = value;
            };
            AutoComplete.prototype.GetIsMouseOnList = function () {
                return this._isMouseOnList;
            };
            AutoComplete.prototype.ShowDropdown = function () {
                this._refreshElement();
                if(this.IsVisible()) {
                    this.HideDropdown();
                }
                this._dropDownElement.empty();
                var displayCount;
                displayCount = this._addDisplayItems();
                if(displayCount === 0) {
                    return;
                }
                var left = input.Utility.GetElementPosition(this._controlContainer.get(0)).Left;
                var top = input.Utility.GetElementPosition(this._controlContainer.get(0)).Top + this._controlContainer.outerHeight();
                var width = this._controlContainer.outerWidth();
                var height = "";
                if(displayCount > this._maxItems) {
                    var itemHeight = input.Utility.MeasureText("WHQ", this._dropDownElement.get(0).firstChild).Height;
                    height = this._maxItems * (itemHeight + 2) + 'px';
                }
                var zoom = "";
                if(input.Utility.IsTouchMouseDown == true) {
                    zoom = this._owner.GetTouchDropDownScale() + '';
                }
                width -= 2//2 is the borders.
                ;
                this._dropDownElement.css("left", left + "px");
                this._dropDownElement.css("top", top + "px");
                this._dropDownElement.css("width", width + "px");
                this._dropDownElement.css("display", "");
                input.Utility.SetZoomStyle(this._dropDownElement, zoom);
                this._dropDownElement.css("height", height);
                $("body").append(this._dropDownElement);
                var self = this;
                this._docClickListerner = function () {
                    self.HideDropdown();
                };
                $(document).bind("click", this._docClickListerner);
            };
            AutoComplete.prototype._addDisplayItems = function () {
                var value = this._inputElement.val();
                var toDisplay = [];
                for(var i = 0; i < this._dataList.length; ++i) {
                    if(this._dataList[i].substr(0, value.GetLength()) == value && this._dataList[i].GetLength() > value.GetLength()) {
                        toDisplay.push(this._dataList[i]);
                    }
                }
                var self = this;
                // HelenLiu 2013/07/02 fix bug 888 in IM HTML5.
                var length = (toDisplay.length > this._maxItems ? this._maxItems : toDisplay.length);
                for(i = 0; i < length; ++i) {
                    var newDiv = $('<div>');
                    newDiv.attr("index", i);
                    newDiv.css({
                        "fontFamily": input.Utility.GetOSDefaultFontFamily(),
                        "fontSize": "10pt",
                        "whiteSpace": 'nowrap',
                        "padding": "1px"
                    });
                    newDiv.bind("mouseover", function (evt) {
                        var srcElement = evt.target || evt.srcElement;
                        self.HighlightItem(parseInt(srcElement.getAttribute('index').toString()));
                    });
                    newDiv.bind("click", function () {
                        self._isFocusOnList = false;
                        self.SetValue();
                        self.HideDropdown();
                    });
                    newDiv.html(input.Utility.EncodingToHTML(toDisplay[i]));
                    this._dropDownElement.append(newDiv);
                }
                return length;
            };
            AutoComplete.prototype.HideDropdown = function () {
                if(this.IsVisible()) {
                    this._dropDownElement.remove();
                    this._dropDownElement.css("display", "none");
                    $("document").unbind("click", this._docClickListerner);
                    this._dropDownElement.empty();
                    this._isMouseOnList = false;
                    // HelenLiu 2013/06/20 fix bug 786 in IM HTML5.
                    this._hightlightIndex = -1;
                }
            };
            AutoComplete.prototype.SetDataList = function (list) {
                if(list === null || list === undefined) {
                    list = [];
                }
                this._dataList = list;
            };
            AutoComplete.prototype.IsDataListEmpty = function () {
                return this._dataList.length === 0;
            };
            AutoComplete.prototype.HighlightItem = function (index) {
                this.SetHighlighItem(index);
            };
            AutoComplete.prototype.SetHighlighItem = function (index) {
                if(this._hightlightIndex !== -1) {
                    this._dropDownElement.get(0).childNodes[this._hightlightIndex].style.backgroundColor = "";
                    this._dropDownElement.get(0).childNodes[this._hightlightIndex].style.color = "";
                }
                this._hightlightIndex = index;
                if(this._hightlightIndex !== -1) {
                    //if (this._owner.GetRealControlEffect() === ControlEffect.VistaTheme) {
                    //    this._dropDownElement.childNodes[this._hightlightIndex].style.backgroundColor = "#3399ff";
                    //} else {
                    //    if (this._dropDownElement.childNodes[this._hightlightIndex] !== undefined) {
                    //        this._dropDownElement.childNodes[this._hightlightIndex].style.backgroundColor = "#0a246a";
                    //    }
                    //}
                    this._dropDownElement.get(0).childNodes[this._hightlightIndex].style.color = "white";
                }
            };
            AutoComplete.prototype.Highlight = function (index) {
                var isBound = false;
                if(index > 0 && this._hightlightIndex == this._dropDownElement.get(0).childNodes.length - 1) {
                    this.SetHighlighItem(-1);
                    isBound = true;
                } else if(index < 0 && this._hightlightIndex == 0) {
                    this.SetHighlighItem(-1);
                    isBound = true;
                }
                if(this._hightlightIndex === -1) {
                    if(isBound == false) {
                        if(index > 0) {
                            this.SetHighlighItem(0);
                        }
                        if(index < 0) {
                            this.SetHighlighItem(this._dropDownElement.get(0).childNodes.length - 1);
                        }
                    }
                } else {
                    var newIndex;
                    if(index > 1) {
                        if((this._firstItemShowing + this._maxItems - 1) !== this._hightlightIndex) {
                            index = this._firstItemShowing + this._maxItems - this._hightlightIndex;
                        }
                    }
                    if(index < -1) {
                        if(this._firstItemShowing != this._hightlightIndex) {
                            index = this._firstItemShowing - this._hightlightIndex;
                        }
                    }
                    if(index > 0) {
                        newIndex = ((this._hightlightIndex + index) >= this._dropDownElement.get(0).childNodes.length) ? this._dropDownElement.get(0).childNodes.length - 1 : (this._hightlightIndex + index);
                    } else {
                        newIndex = ((this._hightlightIndex + index) < 0) ? 0 : (this._hightlightIndex + index);
                    }
                    if(index > 1) {
                        newIndex = newIndex - 1;
                    }
                    this.SetHighlighItem(newIndex);
                }
            };
            AutoComplete.prototype.SetValue = function () {
                var newText = this._dropDownElement.get(0).childNodes[this._hightlightIndex].innerHTML;
                newText = input.Utility.DecodingFromHTML(newText);
                this._owner.InternalSetText(newText, true);
                this._owner.SetInnerFocus(input.FocusType.ContextMenu);
                var ePos = this._inputElement.val().GetLength();
                var selectedLength = Math.abs(this._owner.SelectionEnd - this._owner.SelectionStart);
                if(selectedLength != 0) {
                    this._owner.InternalSetSelection(0, ePos);
                } else {
                    this._owner.InternalSetSelection(ePos, ePos);
                }
            };
            AutoComplete.prototype.ScrollCheck = function () {
                if(this._hightlightIndex !== -1) {
                    if(this._hightlightIndex > this._lastItemShowing) {
                        this._firstItemShowing = this._hightlightIndex - (this._maxItems - 1);
                        this._lastItemShowing = this._hightlightIndex;
                    }
                    if(this._hightlightIndex < this._firstItemShowing) {
                        this._firstItemShowing = this._hightlightIndex;
                        this._lastItemShowing = this._hightlightIndex + (this._maxItems - 1);
                    }
                    var itemHeight = input.Utility.MeasureText("WQH", this._dropDownElement.get(0).firstChild).Height + 2;
                    this._dropDownElement.get(0).scrollTop = this._firstItemShowing * itemHeight;
                }
            };
            AutoComplete.prototype.KeyDown = function (evt) {
                var keyCode = evt.keyCode;
                var functionKeyPressed = {
                    Shift: false,
                    Ctrl: false,
                    Alt: false
                };
                if(evt.shiftKey) {
                    functionKeyPressed.Shift = true;
                }
                if(evt.ctrlKey) {
                    functionKeyPressed.Ctrl = true;
                }
                if(evt.altKey) {
                    functionKeyPressed.Alt = true;
                }
                var Keys = input.Key;
                switch(keyCode) {
                    case Keys.Enter:
                        if(this._hightlightIndex !== -1) {
                            this.SetValue();
                            this.HideDropdown();
                            evt.stopPropagation();
                            evt.preventDefault();
                            return false;
                        }
                        break;
                    case Keys.Delete:
                        if(this._hightlightIndex !== -1) {
                            var str = this._dropDownElement.get(0).childNodes[this._hightlightIndex].innerHTML;
                            this.HideDropdown();
                            this._owner.DeleteItem(str);
                            this._isDeleteItem = true;
                            this._inputElement.focus();
                            if(!this.IsVisible()) {
                                this.ShowDropdown();
                            }
                            evt.stopPropagation();
                            evt.preventDefault();
                            return false;
                        }
                        break;
                    case Keys.Escape:
                        this.HideDropdown();
                        evt.stopPropagation();
                        evt.preventDefault();
                        break;
                    case Keys.Up:
                        if(functionKeyPressed.Alt) {
                            break;
                        }
                        if(!this.IsVisible()) {
                            this.ShowDropdown();
                        } else {
                            if(this._hightlightIndex === -1) {
                                this.ShowDropdown();
                            }
                            this.Highlight(-1);
                            this.ScrollCheck();
                        }
                        return false;
                    case Keys.PageUp:
                        if(!this.IsVisible()) {
                            this.ShowDropdown();
                        } else {
                            if(this._hightlightIndex === -1) {
                                this.ShowDropdown();
                            }
                            this.Highlight(-1 * (this._maxItems));
                            this.ScrollCheck();
                        }
                        return false;
                    case Keys.Tab:
                        this.HideDropdown();
                        break;
                    case Keys.Down:
                        if(functionKeyPressed.Alt) {
                            break;
                        }
                        if(!this.IsVisible()) {
                            this.ShowDropdown();
                        } else {
                            this.Highlight(1);
                            this.ScrollCheck();
                        }
                        return false;
                    case Keys.PageDown:
                        if(!this.IsVisible()) {
                            this.ShowDropdown();
                        } else {
                            this.Highlight(this._maxItems);
                            this.ScrollCheck();
                        }
                        return false;
                }
            };
            AutoComplete.prototype.KeyUp = function (evt, showdropdown) {
                if(showdropdown === true) {
                    this.ShowDropdown();
                    return;
                }
                var keyCode = evt.keyCode;
                var keys = input.Key;
                switch(keyCode) {
                    case keys.Enter:
                        break;
                    case keys.Escape:
                        this.HideDropdown();
                        break;
                    case keys.Up:
                    case keys.Down:
                        break;
                    default:
                        this.ShowDropdown();
                        break;
                }
            };
            AutoComplete.prototype.IsVisible = function () {
                return this._dropDownElement.css("display") === '';
            };
            return AutoComplete;
        })();
        input.AutoComplete = AutoComplete;        
        ;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
