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
    /// <reference path="../external/declarations/globalize.d.ts"/>
    /// <reference path="../Base/jquery.wijmo.widget.ts" />
    /// <reference path="../wijtabs/jquery.wijmo.wijtabs.ts" />
    /// <reference path="../wijmenu/jquery.wijmo.wijmenu.ts" />
    /*globals jQuery,window,document*/
    /*
    * Depends:
    *     jquery.ui.core.js
    *     jquery.ui.widget.js
    *     jquery.wijmo.wijtooltip.js
    */
    (function (ribbon) {
        "use strict";
        var $ = jQuery, widgetName = "wijribbon";
        var css_ribbon = "wijmo-wijribbon", css_ribbon_disabled = css_ribbon + "-disabled", css_ribbon_bigbutton = css_ribbon + "-bigbutton", css_ribbon_panel = css_ribbon + "-panel", css_ribbon_groups = css_ribbon + "-groups", css_ribbon_group = css_ribbon + "-group", css_ribbon_groupcontent = css_ribbon_group + "-content", css_ribbon_grouplabel = css_ribbon_group + "-label", css_ribbon_dropdown = css_ribbon + "-dropdown", css_ribbon_dropdowngroup = css_ribbon + "-dropdowngroup", css_ribbon_abbrev = css_ribbon + "-abbrev", css_ribbon_abbrevgroup = css_ribbon_abbrev + "group", css_ribbon_text = css_ribbon + "-text", css_ribbon_icon = css_ribbon + "-icon", css_ribbon_abbrevicon = css_ribbon + "-abbrevicon", css_button = "ui-button", css_active_state = "ui-state-active";
        /** @widget */
        var wijribbon = (function (_super) {
            __extends(wijribbon, _super);
            function wijribbon() {
                _super.apply(this, arguments);

            }
            wijribbon.prototype._create = function () {
                var self = this;
                // enable touch support:
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                self._ribbonify();
                //update for resizing the ribbon when resizing window (2013/7/23)
                $(window).bind("resize.wijribbon", function () {
                    //maybe need to remove the updateribbon size from editor resize
                    self.updateRibbonSize();
                });
                //update for visibility change
                if(self.element.is(":hidden") && self.element.wijAddVisibilityObserver) {
                    self.element.wijAddVisibilityObserver(function () {
                        self.updateRibbonSize();
                        if(self.options.disabled) {
                            self._setDisabled(true);
                        }
                        if(self.element.wijRemoveVisibilityObserver) {
                            self.element.wijRemoveVisibilityObserver();
                        }
                    }, "wijribbon");
                }
                if(self.options.disabled) {
                    self._setDisabled(true);
                }
            };
            wijribbon.prototype._setOption = function (key, value) {
                $.wijmo.widget.prototype._setOption.apply(this, arguments);
                if(key === "disabled") {
                    this._setDisabled(value);
                }
                // for there is an error throw on editor
                $(".wijmo-wijribbon-startmenulink", this.element).unbind("click.tabs");
            };
            wijribbon.prototype._setDisabled = function (value) {
                var self = this, element = self.element, eleOffset = element.offset(), offsetTop = eleOffset.top, offsetLeft = eleOffset.left, offsetParent = $("body"), wijCSS = this.options.wijCSS, disabledModal = self.disabledModal;
                if(element.data("wijmoWijtabs")) {
                    element.wijtabs("option", "disabled", value);
                }
                if(element.closest(".wijmo-wijeditor").length !== 0) {
                    offsetTop = 0;
                    offsetLeft = 0;
                    offsetParent = element.parent();
                }
                if(value) {
                    if(!disabledModal) {
                        disabledModal = $("<div></div>").addClass(wijCSS.stateDisabled + " " + css_ribbon_disabled).css({
                            top: offsetTop,
                            left: offsetLeft,
                            "background-color": //"z-index": "10000",
                            //for ie can't disabled, so add background-color attribute
                            "lightgray",
                            "position": "absolute"
                        }).appendTo(offsetParent).bind("click mousedown mouseup mouseover mouseout " + "focus keydown keypress", function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                            return false;
                        });
                        self.disabledModal = disabledModal;
                    }
                    self.disabledModal.width(element.width()).height(element.outerHeight()).show();
                } else {
                    if(self.disabledModal) {
                        self.disabledModal.hide();
                    }
                }
            };
            wijribbon.prototype._initCustomButtons = function () {
                var self = this, customtype;
                $.each($("[customtype]", self.element), function (index, ele) {
                    customtype = $(ele).attr("customtype");
                    if(customtype && self.options.custombuttons[customtype]) {
                        self.options.custombuttons[customtype].create($(ele));
                    }
                });
            };
            wijribbon.prototype._ribbonify = function () {
                var self = this, wijCSS = this.options.wijCSS;
                self.buttons = {
                };
                self.listUis = {
                };
                self.accessbarBtns = {
                };
                self._initCustomButtons();
                self._createAccessToolBar();
                self._getButtonSets();
                self._createButtons();
                self._createGroup();
                self._createSplit();
                self._createDropdwon();
                self._createInputDropdown();
                self._createGallery();
                self._hideShowedList();
                self._createTab();
                $("." + wijCSS.helperReset + ":not(." + css_ribbon_groups + ", ." + wijCSS.tabsNav + ", .wijmo-wijmenu-list)", self.element).hover(function () {
                    $(this).addClass(wijCSS.stateHover);
                }, function () {
                    $(this).removeClass(wijCSS.stateHover);
                });
                //for bootstrap, the jquery-ui button will not append wijcss class
                //update for adding active class at 2011-11-17
                $("." + css_button, self.element).bind("mouseenter", function () {
                    $("." + wijCSS.buttonText, this).addClass(wijCSS.stateHover);
                }).bind("mouseleave", function () {
                    $("." + wijCSS.buttonText, this).removeClass(wijCSS.stateHover);
                });
                //for bootstrap, the jquery-ui button will not append wijcss class
                $("button." + css_button, self.element).bind("mousedown", function () {
                    self._addActiveClassToButtonText(this);
                }).bind("mouseup", function () {
                    self._addActiveClassToButtonText(this);
                });
                //for bootstrap, the jquery-ui button will not append wijcss class
                //update for 36511 issue for jquery ui 1.10: button interface changed
                $("label." + css_button, self.element).bind("click", function () {
                    if($("span", this) && $("span", this).length === 1) {
                        //for dropdown button, only text button need to handler
                        //for bold,italic, underline button, icon button, need to do nothing
                        self._addActiveClassToLabelButtonText(this);
                    }
                });
            };
            wijribbon.prototype._addActiveClassToButtonText = function (button) {
                var wijCSS = this.options.wijCSS;
                if(button) {
                    //for bootstrap, the jquery-ui button will not append
                    // wijcss.stateactive
                    //if ($(button).hasAllClasses(wijCSS.stateActive)) {
                    if($(button).hasAllClasses(css_active_state)) {
                        $("." + wijCSS.buttonText, button).addClass(wijCSS.stateActive).addClass(wijCSS.stateDefault);
                    } else {
                        $("." + wijCSS.buttonText, button).removeClass(wijCSS.stateActive).removeClass(wijCSS.stateDefault);
                    }
                }
            };
            wijribbon.prototype._addActiveClassToLabelButtonText = function (button) {
                var self = this, oriEle, oriEleID, eleGroup;
                if(button) {
                    oriEleID = $(button).attr("for");
                    oriEle = $("#" + oriEleID, self.element);
                    if(oriEle.is(":checkbox")) {
                        self._addActiveClassToButtonText(button);
                    } else if((oriEle.is(":radio"))) {
                        eleGroup = self.element.find("[name='" + oriEle.attr("name") + "']");
                        $.each(eleGroup, function () {
                            self._updateGroupElementTextState(this);
                        });
                    }
                }
            };
            wijribbon.prototype._updateGroupElementTextState = function (button) {
                var radioLabelEle, wijCSS = this.options.wijCSS;
                if(!button) {
                    return;
                }
                radioLabelEle = $("[for='" + $(button).attr("id") + "']", $(button).parent());
                if(radioLabelEle) {
                    if(radioLabelEle.hasAllClasses(css_active_state)) {
                        radioLabelEle.children("." + wijCSS.buttonText).addClass(wijCSS.stateActive).addClass(wijCSS.stateDefault);
                    } else {
                        radioLabelEle.children("." + wijCSS.buttonText).removeClass(wijCSS.stateActive).removeClass(wijCSS.stateDefault);
                    }
                }
            };
            wijribbon.prototype._getButtonSets = function () {
                var self = this, span;
                self.groups = [];
                self.splits = [];
                self.dropdowns = [];
                self.inputDropdowns = [];
                $("span>button, span>:checkbox, span>:radio, div>button, div>:checkbox," + " div>:radio, div>:text", self.element).each(function (i, btn) {
                    if($(btn).parents("[customtype]") && $(btn).parents("[customtype]").length !== 0) {
                        return;
                    }
                    span = $(btn).parent();
                    if($(">ul", span).length === 0 && !span.hasClass("wijmo-wijribbon-accesstoolbar")) {
                        //for access bar: it need not to be groups
                        self.groups.push(span);
                    } else {
                        if($(">button", span).length === 2) {
                            self.splits.push(span);
                        } else if($(">button", span).length === 1) {
                            self.dropdowns.push(span);
                        } else if($(">input[type='text']", span).length === 1) {
                            self.inputDropdowns.push(span);
                        }
                    }
                    return this;
                });
                self.groups = self._unique(self.groups);
                self.splits = self._unique(self.splits);
            };
            wijribbon.prototype._unique = function (group) {
                var array = $.makeArray($.map(group, function (n) {
                    return n.get(0);
                }));
                return $.map($.unique(array), function (n) {
                    return $(n);
                });
            };
            wijribbon.prototype._createButtons = function () {
                var self = this, element = self.element;
                $(":checkbox", element).each(function () {
                    if($(this).parents("[customtype]") && $(this).parents("[customtype]").length !== 0) {
                        return;
                    }
                    self._createButton($(this), "checkbox");
                    //update for 36511 issue for jquery ui 1.10: button interface changed
                    $(this).bind("change", function () {
                        self._addActiveClassToLabelButtonText($(this).button("widget")[0]);
                    });
                    return this;
                });
                $(":radio", element).each(function () {
                    if($(this).parents("[customtype]") && $(this).parents("[customtype]").length !== 0) {
                        return;
                    }
                    self._createButton($(this), "radio");
                    $(this).bind("change", function () {
                        self._addActiveClassToLabelButtonText($(this).button("widget")[0]);
                    });
                    return this;
                });
                $("button", element).each(function () {
                    if($(this).parents("[customtype]") && $(this).parents("[customtype]").length !== 0) {
                        return;
                    }
                    self._createButton($(this), "button");
                    return this;
                });
            };
            wijribbon.prototype._createButton = function (button, type) {
                var self = this, wijCSS = this.options.wijCSS, options = self._buildButtonOption(button, type), name = button.data("commandName"), labelEle;
                button.button(options);
                if(!options.text) {
                    if(type === "button") {
                        button.children("." + wijCSS.buttonText).text(name);
                    } else {
                        labelEle = $("[for='" + button.attr("id") + "']", button.parent());
                        if(labelEle) {
                            labelEle.children("." + wijCSS.buttonText).text(name);
                        }
                    }
                }
                //for access toolbar buttons
                if(button.parent().is(".wijmo-wijribbon-accesstoolbar") && button.attr("canlocateonaccesstoolbar") === "true") {
                    button.button("widget").hide();
                }
                self._triggerEvent(button);
            };
            wijribbon.prototype._createGroup = function () {
                $.each(this.groups, function (i, group) {
                    group.buttonset();
                });
            };
            wijribbon.prototype._createSplit = function () {
                var self = this, wijCSS = this.options.wijCSS;
                $.each(self.splits, function (i, split) {
                    var list = split.children("ul"), content = split.children("button:eq(0)"), splitName = content.data("commandName"), triggerEle = split.children("button:eq(1)"), splitObj;
                    list.children("li").addClass(wijCSS.cornerAll);
                    split.addClass(css_ribbon + "-" + splitName);
                    triggerEle.button({
                        icons: {
                            primary: wijCSS.iconArrowDown
                        },
                        text: false
                    }).data("list", list).unbind("click").bind(//update for preventing submit by wuhao at 2011/8/2
                    "click", function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                    }).bind(//end at 2011/8/2
                    "mouseup", function (e) {
                        list = $(this).data("list");
                        if(list.is(":visible")) {
                            self.showList.hide().css("z-index", "");
                            self.showList = null;
                        } else {
                            list.show().position({
                                my: 'left top',
                                at: 'left bottom',
                                of: split
                            }).css("z-index", 9999);
                            self.showList = list;
                        }
                        e.stopPropagation();
                        e.preventDefault();
                    });
                    triggerEle.children("." + wijCSS.buttonText).text("foo");
                    split.after(list);
                    list.css("position", "absolute").addClass(wijCSS.helperReset + " " + wijCSS.helperClearFix + " " + wijCSS.cornerAll + " " + css_ribbon_dropdown).hide();
                    split.buttonset();
                    splitObj = {
                        ui: content,
                        defaultValue: content.button("option", "label"),
                        buttons: [],
                        type: "split",
                        trigger: triggerEle,
                        list: list
                    };
                    $("button, :checkbox, :radio", list).bind("click", function (e) {
                        //var uiButton = $(this);
                        //content.button("option", "label",
                        ///uiButton.button("option", "label"));
                        //content.data("commandName", uiButton.data("commandName"));
                        list.hide().css("z-index", "");
                        self.showList = null;
                        e.preventDefault();
                    });
                    list.find(">li>button,>li>:radio,>li>:checkbox").each(function (i, button) {
                        var commandName = $(button).data("commandName");
                        if(commandName !== "" && self.buttons[commandName]) {
                            self.buttons[commandName].parent = content;
                            self.buttons[commandName].type = "split";
                        }
                        splitObj.buttons.push($(button));
                    });
                    if(splitName !== "") {
                        self.listUis[splitName] = splitObj;
                    }
                });
            };
            wijribbon.prototype._createDropdwon = function () {
                var self = this, wijCSS = this.options.wijCSS, code, keyCode;
                self.dropdownLabels = {
                };
                $.each(self.dropdowns, function (i, dropdown) {
                    var list = dropdown.children("ul"), button = dropdown.children("button:eq(0)"), dropdownName = button.data("commandName"), dropdownObj;
                    list.children("li").addClass(wijCSS.cornerAll + " " + wijCSS.stateDefault);
                    dropdown.addClass(css_ribbon + "-" + dropdownName);
                    button.button({
                        icons: {
                            secondary: wijCSS.iconArrowDown
                        }
                    }).unbind("click").bind(//update by wuhao 2011/8/1 for preventing submit
                    "click", function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                    }).bind(//end for preventing submit
                    "mouseup", function (e) {
                        self._showDropDownList(list, button);
                        e.stopPropagation();
                        e.preventDefault();
                    }).bind("keydown", function (e) {
                        if(!list.is(":visible")) {
                            return;
                        }
                        self._dropdownListKeyHandler(e, list, button);
                    });
                    dropdownObj = {
                        ui: button,
                        defaultValue: button.button("option", "label"),
                        buttons: [],
                        type: "dropdown",
                        list: list
                    };
                    $("button, :checkbox, :radio", list).bind("click", function (e) {
                        var name = $(this).data("commandName"), label, width = button.children("." + wijCSS.buttonText).width();
                        if(!self.dropdownLabels[name]) {
                            self.dropdownLabels[name] = self._getDropdownLabelSubstr($(this).button("option", "label"), button.children("." + wijCSS.buttonText), width);
                        }
                        label = self.dropdownLabels[name];
                        button.button("option", "label", label);
                        button.attr("title", $(this).button("option", "label"));
                        list.hide().css("z-index", "");
                        self.showList = null;
                        e.preventDefault();
                    });
                    //dropdown.after(list);
                    list.css("position", "absolute").addClass(wijCSS.helperReset + " " + wijCSS.helperClearFix + " " + wijCSS.cornerAll + " " + css_ribbon_dropdown).hide();
                    dropdown.buttonset();
                    self._collectDropDownButtons(list, button, dropdownObj, dropdownName);
                });
            };
            wijribbon.prototype._createInputDropdown = function () {
                var self = this, wijCSS = this.options.wijCSS;
                self.dropdownLabels = {
                };
                //create input dropdown
                $.each(self.inputDropdowns, function (i, dropdown) {
                    var list = dropdown.children("ul"), inputEle = dropdown.children("input[type='text']:eq(0)"), inputDropDownWrapper = //create whole input dropdown appearance
                    self._createInputDropDownWrapper(inputEle), dropdownName = inputEle.prop("name"), dropdownObj;
                    dropdown.prepend(inputDropDownWrapper);
                    list.children("li").addClass(wijCSS.cornerAll + " " + wijCSS.stateDefault);
                    dropdown.addClass(css_ribbon + "-" + dropdownName);
                    inputEle.removeProp("name").data("commandName", dropdownName).addClass(wijCSS.stateDefault + " " + wijCSS.content + " " + wijCSS.cornerLeft);
                    inputDropDownWrapper.find("a").bind("mouseup", function (e) {
                        self._showDropDownList(list, inputEle);
                        inputEle.focus();
                        e.stopPropagation();
                        e.preventDefault();
                    }).bind("keydown", function (e) {
                        self._dropdownListKeyHandler(e, list, inputDropDownWrapper);
                    });
                    self._bindInputEvent(inputEle, list);
                    dropdownObj = {
                        ui: inputEle,
                        defaultValue: inputEle.val(),
                        buttons: [],
                        type: "dropdown",
                        list: list
                    };
                    $("button, :checkbox, :radio", list).bind("click", function (e) {
                        var name = $(this).data("commandName"), label;
                        /*TODO: remove the code*/
                        if(!self.dropdownLabels[name]) {
                            self.dropdownLabels[name] = $(this).button("option", "label");
                        }
                        label = self.dropdownLabels[name];
                        inputEle.val($(this).button("option", "label")).attr("title", $(this).button("option", "label"));
                        list.hide().css("z-index", "");
                        self.showList = null;
                        e.preventDefault();
                        e.stopPropagation();
                    });
                    //dropdown.after(list);
                    list.css("position", "absolute").addClass(wijCSS.helperReset + " " + wijCSS.helperClearFix + " " + wijCSS.cornerAll + " " + css_ribbon_dropdown).hide();
                    //dropdown.buttonset();
                    self._collectDropDownButtons(list, inputEle, dropdownObj, dropdownName);
                });
            };
            wijribbon.prototype._collectDropDownButtons = function (list, parentEle, dropdownObj, dropdownName) {
                var self = this;
                list.find(">li>button,>li>:radio,>li>:checkbox").each(function (i, btn) {
                    var commandName = $(btn).data("commandName");
                    if(commandName !== "" && self.buttons[commandName]) {
                        self.buttons[commandName].parent = parentEle;
                        self.buttons[commandName].type = "dropdown";
                    }
                    dropdownObj.buttons.push($(btn));
                });
                // cache a hash to save the dropdown.
                if(dropdownName !== "") {
                    self.listUis[dropdownName] = dropdownObj;
                }
            };
            wijribbon.prototype._showDropDownList = function (list, buttonEle) {
                var self = this;
                if(list.is(":visible") && !list.find("li." + self.options.wijCSS.stateActive)) {
                    self.showList.hide().css("z-index", "");
                    self.showList = null;
                } else {
                    if(self.showList) {
                        self.showList.hide();
                        self.showList = null;
                    }
                    list.show().position({
                        my: 'left top',
                        at: 'left bottom',
                        of: buttonEle
                    }).css("z-index", 9999);
                    self.showList = list;
                    self.isShow = true;
                }
            };
            wijribbon.prototype._bindInputEvent = function (inputEle, list) {
                var self = this, code, keyCode;
                //bind input change event
                inputEle.bind("change", function (e) {
                    var obj = {
                        name: undefined,
                        commandName: undefined
                    };
                    obj.name = inputEle.prop("name");
                    obj.commandName = inputEle.val();
                    self._trigger("click", e, obj);
                }).bind("keydown", function (event) {
                    self._dropdownListKeyHandler(event, list, inputEle);
                });
            };
            wijribbon.prototype._dropdownListKeyHandler = function (event, list, container) {
                var self = this, code = event.keyCode, keyCode = self._getKeyCodeEnum();
                //handle the dropdown list keydown event
                switch(code) {
                    case keyCode.UP:
                        self._activeDropDownListElement(false, list, container);
                        event.preventDefault();
                        break;
                    case keyCode.DOWN:
                        self._activeDropDownListElement(true, list, container);
                        event.preventDefault();
                        break;
                    case keyCode.ENTER:
                        list.find("label." + self.options.wijCSS.stateActive).parent("li").find("input").trigger("click");
                        event.preventDefault();
                        break;
                }
            };
            wijribbon.prototype._activeDropDownListElement = function (down, list, inputEle) {
                var self = this, len = list.find("li").length, activeIndex, activeItem;
                if(!list.is(":visible")) {
                    self._showDropDownList(list, inputEle);
                    return;
                }
                activeItem = list.find("label." + self.options.wijCSS.stateActive).parent("li");
                if(activeItem && activeItem.length > 0) {
                    activeIndex = list.find("li").index(activeItem);
                }
                //list.find("li").removeClass("ui-state-active");
                self._changeListItemActiveState(activeItem, false);
                if(activeIndex === undefined) {
                    activeIndex = 0;
                } else {
                    if(down) {
                        activeIndex++;
                        if(activeIndex == len) {
                            activeIndex = undefined;
                        }
                    } else {
                        activeIndex--;
                        if(activeIndex == -1) {
                            activeIndex = len - 1;
                        }
                    }
                }
                //$(list.find("li")[activeIndex]).addClass("ui-state-active");
                self._changeListItemActiveState($(list.find("li")[activeIndex]), true);
            };
            wijribbon.prototype._changeListItemActiveState = function (listitem, activate) {
                var wijCSS = this.options.wijCSS;
                if(!listitem) {
                    return;
                }
                if(activate) {
                    $("label", listitem).addClass(wijCSS.stateActive);
                    $("span", listitem).addClass(wijCSS.stateActive);
                } else {
                    $("label", listitem).removeClass(wijCSS.stateActive);
                    $("span", listitem).removeClass(wijCSS.stateActive);
                }
            };
            wijribbon.prototype._createGallery = function () {
                var self = this, wijCSS = self.options.wijCSS;
                // create the style gallery
                $(".wijmo-wijribbon-gallery", self.element).each(function (i, gallery) {
                    $(gallery).children("div").each(function (i, unitDiv) {
                        $(unitDiv).bind("mouseenter", function (e) {
                            if($(unitDiv).hasAllClasses(wijCSS.stateDisabled)) {
                                return;
                            }
                            $(unitDiv).addClass(wijCSS.stateHover);
                        }).bind("mouseleave", function (e) {
                            if($(unitDiv).hasAllClasses(wijCSS.stateDisabled)) {
                                return;
                            }
                            $(unitDiv).removeClass(wijCSS.stateHover);
                        }).bind("click", function (e) {
                            if($(unitDiv).hasAllClasses(wijCSS.stateDisabled)) {
                                return;
                            }
                            $(unitDiv).parent("div.wijmo-wijribbon-gallery").children("div").removeClass(wijCSS.stateActive);
                            $(unitDiv).addClass(wijCSS.stateActive);
                            var obj = {
                                name: undefined,
                                commandName: undefined
                            };
                            obj.name = $(unitDiv).parent("div.wijmo-wijribbon-gallery").attr("name");
                            obj.commandName = $(unitDiv).attr("name");
                            self._trigger("click", e, obj);
                        });
                        //add button to self.buttons for update state
                        self.buttons[$(unitDiv).attr("name")] = {
                            button: $(unitDiv),
                            type: "galleryBtn"
                        };
                    });
                });
            };
            wijribbon.prototype._getKeyCodeEnum = function () {
                if($.ui && $.ui.keyCode) {
                    return $.ui.keyCode;
                }
                if($.mobile && $.mobile.keyCode) {
                    return $.mobile.keyCode;
                }
                throw "keyCode object is not found";
            };
            wijribbon.prototype._createInputDropDownWrapper = function (inputEle) {
                var wijCSS = this.options.wijCSS;
                var inputDropDownWrapper = $("<span class='wijmo-wijribbon-inputdropdownwrapper'></span>").append(inputEle);
                $("<a></a>").appendTo(inputDropDownWrapper).button({
                    icons: {
                        primary: wijCSS.iconArrowDown
                    },
                    text: false
                }).removeClass(wijCSS.cornerAll).addClass("wijmo-wijribbon-inputdropdownbtn " + wijCSS.cornerRight);
                return inputDropDownWrapper;
            };
            wijribbon.prototype._createTab = function () {
                var self = this, wijCSS = this.options.wijCSS, element = self.element;
                element.addClass(css_ribbon);
                self.tabEle = element;
                if($(">ul", element).length > 0) {
                    element.wijtabs({
                        select: function (e, args) {
                            //$(".wijmo-wijmenu", self.tabEle).hide();
                            self._hideAllMenus();
                        }
                    });
                    self._createRibbonGroups();
                    if($(".wijmo-wijribbon-startmenu") && $(".wijmo-wijribbon-startmenu").length > 0) {
                        element.wijtabs("option", "selected", 1);
                        self._createStartMenu();
                    }
                    return true;
                } else {
                    element.addClass(css_ribbon + "-simple").addClass(wijCSS.stateDefault).addClass(wijCSS.helperClearFix);
                }
                return false;
            };
            wijribbon.prototype._createAccessToolBar = function () {
                var self = this, newId, accessBarDiv = $("<div class='wijmo-wijribbon-accesstoolbar'></div>"), menuBtn;
                if($("*[canlocateonaccesstoolbar='true']", self.element).length === 0 && $("*[locateonaccesstoolbar='true']", self.element).length === 0) {
                    return;
                }
                //collect accessbar button
                $("input[canlocateonaccesstoolbar='true'],input[locateonaccesstoolbar='true']", self.element).each(function () {
                    newId = $(this).attr("id") + "_accessbar";
                    var labelEle = $("label[for=" + $(this).attr("id") + "]");
                    self.accessbarBtns[labelEle.attr("title")] = {
                        button: $(this).clone().attr("id", newId),
                        type: $(this).attr("type"),
                        labelEle: labelEle.clone().attr("for", newId),
                        selected: $(this).attr("locateonaccesstoolbar") === "true" ? true : false
                    };
                });
                $("button[canlocateonaccesstoolbar='true'],button[locateonaccesstoolbar='true']", self.element).each(function () {
                    newId = $(this).attr("id") + "_accessbar";
                    self.accessbarBtns[$(this).attr("title")] = {
                        button: $(this).clone(),
                        type: 'button',
                        selected: $(this).attr("locateonaccesstoolbar") === "true" ? true : false
                    };
                });
                $.each(self.accessbarBtns, function (key, btnObj) {
                    accessBarDiv.append(btnObj.button);
                    if(btnObj.labelEle) {
                        accessBarDiv.append(btnObj.labelEle);
                    }
                });
                //show menu button
                menuBtn = $('<button title="Customize Access Toolbar" class ="wijmo-wijribbon-accesstoolbarbtn ' + self.options.wijCSS.iconArrowDown + '"' + ' name="quicktoolbar"></button>');
                accessBarDiv.append(menuBtn);
                //TODO: check null: there is no button on accessbar
                if(self.accessbarBtns) {
                    self.element.prepend(accessBarDiv);
                }
                //create menu
                self._createCustomQuickToolbarMenu(menuBtn, accessBarDiv);
            };
            wijribbon.prototype._createCustomQuickToolbarMenu = function (triggerEle, appendToEle) {
                var self = this, liEle, checkedCss, wijCSS = self.options.wijCSS, customQuickToolbarMenu = $('<ul class="wijmo-wijribbon-accesstoolbarmenu"></ul>');
                $.each(self.accessbarBtns, function (key, item) {
                    checkedCss = item.selected ? ' wijmo-wijribbon-accesstoolbarmenuitemchecked' : ' wijmo-wijribbon-accesstoolbarmenuitemunchecked';
                    liEle = $('<li><a class="' + wijCSS.cornerAll + '" tabindex="-1">' + '<span class="' + wijCSS.icon + checkedCss + '"></span><span' + ' class="wijmo-wijmenu-text">' + key + '</span></a></li>');
                    liEle.data("accessbarcommand", key);
                    customQuickToolbarMenu.append(liEle);
                });
                //set title
                customQuickToolbarMenu.prepend("<li class='wijmo-wijribbon-accesstoolbarmenutitleitem'><a>Customize Access Toolbar</a></li>");
                appendToEle.append(customQuickToolbarMenu);
                // select the start menu function
                customQuickToolbarMenu.wijmenu({
                    trigger: triggerEle,
                    triggerEvent: "click",
                    orientation: "vertical",
                    select: function (e, item) {
                        var liEle = item.item, btnName = liEle.element.data("accessbarcommand"), iconSpan = $("span." + wijCSS.icon, liEle.element), accessBarBtn = self.accessbarBtns[btnName].button, btnWidget = accessBarBtn.button("widget");
                        if(iconSpan.hasClass("wijmo-wijribbon-accesstoolbarmenuitemchecked")) {
                            iconSpan.removeClass("wijmo-wijribbon-accesstoolbarmenuitemchecked").addClass("wijmo-wijribbon-accesstoolbarmenuitemunchecked");
                            btnWidget.hide().removeAttr("canlocateonaccesstoolbar").attr("locateonaccesstoolbar", "true");
                        } else {
                            iconSpan.addClass("wijmo-wijribbon-accesstoolbarmenuitemchecked").removeClass("wijmo-wijribbon-accesstoolbarmenuitemunchecked");
                            btnWidget.show().removeAttr("locateonaccesstoolbar").attr("canlocateonaccesstoolbar", "true");
                        }
                        //deactivate
                        customQuickToolbarMenu.wijmenu("deactivate", null);
                    }
                });
                customQuickToolbarMenu.wijmenu("setItemDisabled", $(".wijmo-wijribbon-accesstoolbarmenutitleitem"), true);
            };
            wijribbon.prototype.updateRibbonSize = /** @ignore */
            function () {
                var self = this, groupDropDown, wijCSS = this.options.wijCSS, abbrevgroupContainer;
                self.tabEle.children("div").not(".wijmo-wijmenu").each(function (i, tabPage) {
                    var $tabPage = $(tabPage), isTabVisible = $tabPage.is(":visible"), groups = $tabPage.find(">ul>li:not(.wijmo-wijmenu-item)"), groupInfos = [], pageWidth = $tabPage.width();
                    //				if($tabPage.css("display") === "none"){
                    //					pageWidth = self.tabEle.width();
                    //				}
                    //Note: add by wh at 2011/10/30
                    if(!isTabVisible) {
                        $tabPage.removeClass(wijCSS.wijtabsHide);
                        pageWidth = $tabPage.width();
                    }
                    groups.each(function (j, li) {
                        var group = $(li), lblDiv = group.find(">div:last"), text = self._getGroupLabelText(lblDiv);
                        //update by wh for refresh 2012/1/9
                        //recover the ribbon to orign
                        groupDropDown = group.children("." + css_ribbon_dropdowngroup);
                        abbrevgroupContainer = group.children("." + css_ribbon_abbrevgroup);
                        if(groupDropDown) {
                            group.addClass(css_ribbon + "-" + text.toLowerCase()).prepend(groupDropDown.children());
                            groupDropDown.remove();
                            if(abbrevgroupContainer) {
                                abbrevgroupContainer.remove();
                            }
                        }
                        //end
                        groupInfos.push({
                            width: group.outerWidth(true),
                            text: text
                        });
                        return this;
                    });
                    self._adjustRibbonGroupIfNeeded(groups, groupInfos, pageWidth);
                    //Note: add by wh at 2011/10/30
                    if(!isTabVisible) {
                        $tabPage.addClass(wijCSS.wijtabsHide);
                    }
                    return this;
                });
                if(self.options.disabled) {
                    self._setDisabled(true);
                }
            };
            wijribbon.prototype._createRibbonGroups = function () {
                var self = this, wijCSS = this.options.wijCSS;
                self.tabEle.children("div").each(function (i, tabPage) {
                    var $tabPage = $(tabPage), isTabVisible = $tabPage.is(":visible"), groups = $tabPage.find(">ul:not(.wijmo-wijribbon-accesstoolbarmenu)>li"), groupInfos = [], pageWidth;
                    //update for fixed issue 21292 by wh at 2012/5/8
                    if($tabPage.data("destroy.tabs")) {
                        $tabPage.remove();
                        return;
                    }
                    //end
                    if(!isTabVisible) {
                        $tabPage.removeClass(wijCSS.wijtabsHide);
                    }
                    pageWidth = $tabPage.width();
                    $tabPage.addClass(css_ribbon_panel);
                    // remove for use another method to create
                    //add for access toolbar mark
                    if(!$tabPage.hasAllClasses(wijCSS.tabsPanel)) {
                        $tabPage.addClass("wijmo-wijribbon-accesstoolbar");
                        self.tabEle.prepend($tabPage);
                    }
                    $tabPage.find(">ul").addClass(wijCSS.helperReset + " " + wijCSS.helperClearFix + " " + wijCSS.content + " " + wijCSS.cornerAll + " " + css_ribbon_groups);
                    groups.each(function (j, li) {
                        var group = $(li), lblDiv = group.find(">div:last"), groupSpanText = lblDiv.find("span"), css = wijCSS.stateDefault + " " + css_ribbon_group, text = self._getGroupLabelText(lblDiv);
                        /* add group dialog indicator (2013/7/23)
                        text = lblDiv.attr("displayname") ?
                        lblDiv.attr("displayname") : $.trim(lblDiv.text());*/
                        if(lblDiv) {
                            css += " " + css_ribbon + "-" + text.toLowerCase();
                        }
                        group.addClass(css);
                        lblDiv.addClass(css_ribbon_grouplabel).bind("click", function () {
                            return false;
                        });
                        group.wrapInner("<div class = '" + css_ribbon_groupcontent + "'></div>");
                        group.children().bind("mouseover", function () {
                            $(this).addClass(wijCSS.stateHover);
                        }).bind("mouseout", function () {
                            $(this).removeClass(wijCSS.stateHover);
                        });
                        lblDiv.appendTo(group);
                        groupInfos.push({
                            width: group.outerWidth(true),
                            text: text
                        });
                        return this;
                    });
                    self._originalGroupInfo = groupInfos;
                    self._adjustRibbonGroupIfNeeded(groups, groupInfos, pageWidth);
                    if(!isTabVisible) {
                        $tabPage.addClass(wijCSS.wijtabsHide);
                    }
                    return this;
                });
            };
            wijribbon.prototype._createStartMenu = function () {
                var self = this, startMenuLink = $(".wijmo-wijribbon-startmenulink", self.element), wijCSS = self.options.wijCSS;
                startMenuLink.unbind("click");
                // mark the tab as a start menu link
                startMenuLink.parent("li").addClass("wijmo-wijribbon-startmenulinkcontainer").hover(function () {
                    $(this).removeClass("wijmo-wijribbon-startmenulinkcontainer");
                }, function () {
                    $(this).addClass("wijmo-wijribbon-startmenulinkcontainer");
                });
                //add start menu indicator
                $(".wijmo-wijribbon-startmenuindicator", self.element).addClass(wijCSS.icon + " " + wijCSS.iconArrowDown);
                // select the start menu function
                $(".wijmo-wijribbon-startmenu", self.element).wijmenu({
                    trigger: $(".wijmo-wijribbon-startmenulink", self.element).parent(),
                    triggerEvent: "click",
                    orientation: "vertical",
                    select: function (e, item) {
                        var obj = {
                            name: undefined,
                            commandName: undefined
                        };
                        obj.commandName = item.item._link.attr("name");
                        self._trigger("click", e, obj);
                    },
                    hidden: function (e, item) {
                        if(item.activeItem) {
                            item.activeItem._link.removeClass(wijCSS.stateFocus);
                        }
                    }
                });
            };
            wijribbon.prototype._getGroupLabelText = function (lblDiv) {
                var groupSpanText, text;
                if(lblDiv) {
                    groupSpanText = lblDiv.find("span");
                    if(lblDiv.attr("displayname")) {
                        text = lblDiv.attr("displayname");
                    } else {
                        if(groupSpanText && groupSpanText.length > 0 && !lblDiv.hasAllClasses(css_ribbon_abbrevgroup)) {
                            text = $(groupSpanText[0]).text();
                        } else {
                            text = $.trim(lblDiv.text());
                        }
                    }
                }
                return text;
            };
            wijribbon.prototype._adjustRibbonGroupIfNeeded = function (groups, groupInfos, pageWidth) {
                var self = this, i = groups.length - 1, j = 0, iWidth = 0, jWidth = 0, groupDropDown, abbrevgroupContainer, gi;
                for(; i >= 0; i--) {
                    jWidth = 0;
                    for(j = 0; j < i; j++) {
                        jWidth += groupInfos[j].width;
                    }
                    if(jWidth + iWidth + groupInfos[i].width <= pageWidth) {
                        //remove the dropdowngroup and add dropdowngroup's children to group
                        groupDropDown = $(groups[i]).children("." + css_ribbon_dropdowngroup);
                        abbrevgroupContainer = $(groups[i]).children("." + css_ribbon_abbrevgroup);
                        if(groupDropDown) {
                            $(groups[i]).addClass(css_ribbon + "-" + groupInfos[i].text.toLowerCase()).prepend(groupDropDown.children());
                            groupDropDown.remove();
                            if(abbrevgroupContainer) {
                                abbrevgroupContainer.remove();
                            }
                            //continue;
                                                    }
                    } else {
                        gi = groupInfos[i];
                        iWidth += self._createDropDownRibbonGroup(gi.text, groups[i]);
                    }
                }
            };
            wijribbon.prototype._createDropDownRibbonGroup = function (text, group) {
                var self = this, grpClass = css_ribbon + "-" + text.toLowerCase(), wijCSS = this.options.wijCSS, $group = $(group).removeClass(grpClass), displayText = //displayText = $group.find(">div:last").text() || text,
                self._getGroupLabelText($group.find(">div:last")) || text, $abbrevgrp;
                $group.wrapInner("<div class='" + css_ribbon_dropdowngroup + " " + css_ribbon_group + "'></div>").children().hide().addClass(grpClass).bind("mouseup." + self.widget, function (e) {
                    if(self.showDrpDwnGroup !== null) {
                        self.showDrpDwnGroup.hide().css("z-index", "");
                        self.showDrpDwnGroup = null;
                    }
                });
                $abbrevgrp = $("<div class='" + css_ribbon_abbrevgroup + "'>" + "<span class='" + css_ribbon_abbrev + displayText.toLowerCase() + " " + css_ribbon_icon + " " + css_ribbon_abbrevicon + "'></span>" + "<span class='" + css_ribbon_text + "'>" + displayText + "</span>" + "<span class='" + wijCSS.icon + " " + wijCSS.iconArrowDown + " " + css_ribbon_icon + "'></span></div>").appendTo($group).unbind(self.widget).bind("mouseover." + self.widget, function (e) {
                    $(this).addClass(wijCSS.stateHover);
                }).bind("mouseout." + self.widget, function (e) {
                    $(this).removeClass(wijCSS.stateHover);
                }).bind("click." + self.widget, function (e) {
                    var $drpGroup = $(this).siblings("." + css_ribbon_dropdowngroup);
                    if($drpGroup.is(":visible")) {
                        $drpGroup.hide().css("z-index", "");
                        self.showDrpDwnGroup = null;
                    } else {
                        if(self.showDrpDwnGroup) {
                            self.showDrpDwnGroup.hide().css("z-index", "");
                        }
                        $drpGroup.show().position({
                            my: "left top",
                            at: "left bottom",
                            of: this
                        }).css("z-index", "10000");
                        self.showDrpDwnGroup = $drpGroup;
                        e.stopPropagation();
                    }
                });
                return $group.outerWidth(true);
            };
            wijribbon.prototype._hideShowedList = function () {
                var self = this;
                $(document).bind("mouseup", function (e) {
                    var target = e.target;
                    if(self.showList) {
                        //Note: click the font, dropdown is open
                        //then click the design view(document), there is a error
                        //update by wh at 2011/9/14
                        //if (!$.contains(self.showList.get(0), target)) {
                        if($(target).is(document) || !$.contains(self.showList.get(0), target)) {
                            //end by wh
                            self.showList.hide().css("z-index", "");
                            self.showList = null;
                        }
                    }
                    if(self.showDrpDwnGroup) {
                        //Note: click the font, dropdown is open
                        //then click the design view(document), there is a error
                        //update by wh at 2011/9/14
                        //if (!$.contains(self.showDrpDwnGroup.get(0), target)) {
                        if($(target).is(document) || !$.contains(self.showDrpDwnGroup.get(0), target)) {
                            //end by wh
                            self.showDrpDwnGroup.hide().css("z-index", "");
                            self.showDrpDwnGroup = null;
                        }
                    }
                });
            };
            wijribbon.prototype._buildButtonOption = function (node, type) {
                var text = true, self = this, nodeClass = node.attr("class"), spans, iconClass, iconEle, imagePosition, label, labelEle, name;
                // only icon
                if(nodeClass && nodeClass !== "" && nodeClass !== css_ribbon_bigbutton) {
                    iconClass = nodeClass.split(" ")[0];
                    node.removeClass(iconClass);
                    label = $.trim(node.text());
                    if(label === "") {
                        text = false;
                    }
                } else {
                    if(type === "checkbox" || type === "radio") {
                        if($.trim(node.attr("id")) === "") {
                            return;
                        }
                        labelEle = $("[for='" + node.attr("id") + "']", node.parent());
                        if(!labelEle.is("label")) {
                            return;
                        }
                        nodeClass = labelEle.attr("class");
                        if(nodeClass && nodeClass !== "" && nodeClass !== css_ribbon_bigbutton) {
                            iconClass = nodeClass.split(" ")[0];
                            labelEle.removeClass(iconClass);
                            label = $.trim(labelEle.text());
                            if(label === "") {
                                text = false;
                            }
                        } else {
                            //TODO only text
                            spans = labelEle.children("span,div");
                        }
                    } else if(type === "button") {
                        spans = node.children("span,div");
                    }
                    if(spans) {
                        if(spans.length === 1) {
                            //only image
                            if(spans.eq(0).attr("class") !== "") {
                                iconEle = spans.eq(0);
                                iconClass = iconEle.attr("class");
                                text = false;
                            }
                            // to do only text
                                                    } else if(spans.length === 2) {
                            if(spans.eq(0).attr("class")) {
                                iconEle = spans.eq(0);
                                iconClass = iconEle.attr("class");
                                if(iconEle.is("span")) {
                                    imagePosition = "left";
                                } else if(iconEle.is("div")) {
                                    imagePosition = "top";
                                }
                                label = spans.eq(1).text();
                            }
                            // TODO: Text before image.
                            // TODO: Text above image.
                                                    } else {
                            if(type === "button" && $.trim(node.text()) !== "") {
                                label = $.trim(node.text());
                            }
                        }
                    }
                }
                if(type === "button") {
                    node.empty();
                    name = $.trim(node.attr("name"));
                    if(name !== "") {
                        node.removeAttr("name");
                    }
                } else {
                    name = $.trim(labelEle.attr("name"));
                    if(name !== "") {
                        labelEle.removeAttr("name");
                    }
                }
                if(name !== "") {
                    node.data("commandName", name);
                    if(!self.buttons[name]) {
                        self.buttons[name] = {
                            button: undefined,
                            accessToolbarButton: undefined
                        };
                    }
                    if(node.parent().is(".wijmo-wijribbon-accesstoolbar")) {
                        self.buttons[name].accessToolbarButton = node;
                    } else {
                        self.buttons[name].button = node;
                    }
                }
                return {
                    label: label,
                    icons: {
                        primary: iconClass
                    },
                    position: imagePosition,
                    text: text
                };
            };
            wijribbon.prototype._triggerEvent = function (button) {
                var self = this, sameBtn, btnWidget, wijCSS = self.options.wijCSS;
                button.bind("click", function (e) {
                    if(self.options.disabled) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }
                    self._hideAllMenus();
                    var checked = true, commandName = button.data("commandName"), buttonObj = self.buttons[commandName], obj = {
                        name: undefined,
                        commandName: undefined
                    };
                    if(buttonObj && buttonObj.parent) {
                        obj.name = buttonObj.parent.data("commandName");
                    }
                    obj.commandName = commandName;
                    self._trigger("click", e, obj);
                    if(button.parent().is(".wijmo-wijribbon-accesstoolbar")) {
                        sameBtn = self.buttons[commandName].button;
                    } else {
                        sameBtn = self.buttons[commandName].accessToolbarButton;
                    }
                    if(sameBtn) {
                        btnWidget = sameBtn.button("widget");
                        if(!sameBtn.is("button")) {
                            //for bootstrap, the jquery-ui button will not append
                            //if (btnWidget && btnWidget.hasAllClasses(wijCSS.stateActive))
                            if(btnWidget && btnWidget.hasAllClasses(css_active_state)) {
                                checked = false;
                            }
                            self._setBtnWidgetCheckedStyle(sameBtn, checked);
                        }
                    }
                    // if is button to prevent submit form
                    if(button.is("button")) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            };
            wijribbon.prototype._getDropdownLabelSubstr = function (text, label, width) {
                var self = this, length = text.length, start = 0, end = length, mid = Math.floor((start + end) / 2), newLabel = $("<span></span>"), str = text.substr(0, mid), midWidth;
                newLabel.appendTo(label.parent());
                midWidth = self._calculateWidth(str, newLabel);
                while(midWidth !== width && end > start) {
                    str = text.substr(0, mid + 1);
                    midWidth = self._calculateWidth(str, newLabel);
                    if(midWidth > width) {
                        end = mid - 1;
                    } else if(midWidth < width) {
                        start = mid + 1;
                    }
                    mid = Math.floor((start + end) / 2);
                }
                newLabel.remove();
                return str;
            };
            wijribbon.prototype._calculateWidth = function (str, span) {
                span.text(str);
                return span.width();
            };
            wijribbon.prototype.hideDropdown = /** @ignore */
            function (name) {
                var self = this, dropdown = self.listUis[name];
                if(dropdown && dropdown.list) {
                    dropdown.list.hide();
                }
            };
            wijribbon.prototype._hideAllMenus = /** @ignore */
            function () {
                var self = this;
                $(".wijmo-wijmenu", self.tabEle).hide();
            };
            wijribbon.prototype.setTabPageVisible = /** Sets a ribbon tab page as visible or not.
            * @param {string} id The id of the tab page.
            * @param {boolean} visible The visible state of the tab page.
            */
            function (id, visible) {
                var self = this, tabpage = $("a[href=#" + id + "]", self.element).parent("li"), tab = tabpage.parent("ul"), selectedIndex;
                if(tabpage && tabpage.length > 0) {
                    if(visible) {
                        tabpage.show();
                        //set the current show tab to selected
                        selectedIndex = $('li', tab).index(tabpage);
                    } else {
                        tabpage.hide();
                        //then change to select first visible tab
                        selectedIndex = $('li', tab).index($('li:visible:not(".wijmo-wijribbon-startmenulinkcontainer")', tab));
                    }
                }
                self.element.wijtabs("option", "selected", selectedIndex);
            };
            wijribbon.prototype.destroy = /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            function () {
                if(this.disabledModal) {
                    this.disabledModal.remove();
                }
                $(window).unbind("resize.wijribbon");
                $.Widget.prototype.destroy.call(this);
            };
            wijribbon.prototype.getDropdownList = /** @ignore */
            function (name) {
                var self = this, dropdown = self.listUis[name], retrunObj = {
                };
                if(dropdown) {
                    $.each(dropdown.buttons, function (i, button) {
                        retrunObj[button.data("commandName")] = button.button("option", "label");
                    });
                }
                return retrunObj;
            };
            wijribbon.prototype.setButtonDisabled = /** The method sets the chosen button as enabled or disabled according to the command name.
            * @param {string} commandName The name of the command.
            * @param {boolean} disabled The disabled state of the button, true or false.
            */
            function (commandName, disabled) {
                var buttonObj = this.buttons[commandName], wijCSS = this.options.wijCSS, btnText, accessBarBtnText, isButtonEle = false, button, accessBarBtn, splitUi;
                //for custom button
                if(buttonObj && buttonObj.disabled) {
                    buttonObj.disabled(disabled);
                    return;
                }
                if(buttonObj && buttonObj.button && buttonObj.type === "galleryBtn") {
                    buttonObj.button.addClass(wijCSS.stateDisabled);
                }
                if(buttonObj && buttonObj.button) {
                    button = buttonObj.button;
                    accessBarBtn = buttonObj.accessToolbarButton;
                    isButtonEle = button.is("button");
                    //for gallery btn
                    if(buttonObj.type === "galleryBtn") {
                        if(disabled) {
                            button.addClass(wijCSS.stateDisabled);
                        } else {
                            button.removeClass(wijCSS.stateDisabled);
                        }
                        return;
                    }
                    button.button("option", "disabled", disabled);
                    btnText = $("." + wijCSS.buttonText, button);
                    if(btnText) {
                        btnText.removeClass(wijCSS.stateHover);
                    }
                    if(accessBarBtn) {
                        accessBarBtn.button("option", "disabled", disabled);
                        accessBarBtnText = $("." + wijCSS.buttonText, accessBarBtn);
                        if(accessBarBtnText) {
                            accessBarBtnText.removeClass(wijCSS.stateHover);
                        }
                    }
                    if(isButtonEle) {
                        // when the keypress, the button text will be happen change
                        // For "Save" to "save"
                        if(commandName !== "save") {
                            button.children("." + wijCSS.buttonText).text(commandName);
                            if(accessBarBtn) {
                                button.children("." + wijCSS.buttonText).text(commandName);
                            }
                        }
                    } else {
                        $("[for='" + button.attr("id") + "']", button.parent()).children("." + wijCSS.buttonText).text(commandName);
                    }
                    splitUi = this.listUis[commandName];
                    if(splitUi && splitUi.type === "split") {
                        splitUi.trigger.button("option", "disabled", disabled);
                        splitUi.trigger.children("." + wijCSS.buttonText).text(commandName);
                    }
                }
            };
            wijribbon.prototype.setButtonsDisabled = /** The method sets the ribbon buttons as enabled or disabled according to the command name.
            * @param {object} commands An object that contains commands infos that need to change state,
            *               key is command name, value is button disabled state, true or false.
            */
            function (commands) {
                var self = this;
                $.each(commands, function (key, value) {
                    self.setButtonDisabled(key, value);
                });
            };
            wijribbon.prototype.setButtonsChecked = /** The method sets sets the buttons as checked or not checked.
            * @param {object} commands An object that contains commands infos that need to change state,
            *               key is command name, value is button checked state, true or false.
            */
            function (commands) {
                var self = this;
                $.each(commands, function (key, value) {
                    if($.isPlainObject(value)) {
                        self.setButtonChecked(key, value.checked, value.name);
                    } else {
                        self.setButtonChecked(key, value, null);
                    }
                });
            };
            wijribbon.prototype.registerButtonInformation = /** The method used to push the custom button to button collection.
            * @param {string} cmdName The command of the button.
            * @param {Object} eleObj The object of the button information.
            */
            function (cmdName, eleObj) {
                if(cmdName && eleObj) {
                    return this.buttons[cmdName] = eleObj;
                }
            };
            wijribbon.prototype.ribbonClick = /** The custom button trigger ribbon click
            * @param {e} e the event information.
            * @param {obj} eleObj The data information.
            */
            function (e, obj) {
                this._trigger("click", e, obj);
            };
            wijribbon.prototype._setBtnWidgetCheckedStyle = function (buttonEle, checked) {
                var self = this, buttonEle, wijCSS = self.options.wijCSS;
                if(buttonEle.is("button")) {
                    if(checked) {
                        buttonEle.addClass(wijCSS.stateActive);
                    } else {
                        buttonEle.removeClass(wijCSS.stateActive);
                    }
                } else if(!buttonEle.is("input[type='text']")) {
                    buttonEle.prop("checked", checked);
                    buttonEle.button("refresh");
                }
                self._addActiveClassToButtonText(buttonEle.button("widget"));
            };
            wijribbon.prototype.removeButtonHoverState = /**
            @ignore
            */
            function (commandName) {
                var self = this, buttonEle, wijCSS = this.options.wijCSS, buttonObj = self.buttons[commandName];
                if(buttonObj && buttonObj.button) {
                    buttonEle = buttonObj.button;
                    if(buttonEle.is("button")) {
                        buttonEle.removeClass(wijCSS.stateHover).removeClass(wijCSS.stateFocus);
                        $("span", buttonEle).removeClass(wijCSS.stateHover);
                    }
                }
            };
            wijribbon.prototype.setButtonChecked = /** Sets a ribbon button as checked or not checked.
            * @param {string} commandName The command name of the button.
            * @param {boolean} checked The checked state of the button.
            * @param {string} name The parent name of the button.
            */
            function (commandName, checked, name) {
                var self = this, radios, buttonObj = self.buttons[commandName], wijCSS = this.options.wijCSS, buttonEle, accessBarBtnEle, listUi, label;
                //for custom button
                if(buttonObj && buttonObj.checked) {
                    buttonObj.checked(checked);
                    return;
                }
                if(buttonObj && buttonObj.button) {
                    buttonEle = buttonObj.button;
                    accessBarBtnEle = buttonObj.accessToolbarButton;
                    if(buttonEle.is("button")) {
                        if(checked) {
                            buttonEle.addClass(wijCSS.stateActive);
                            if(accessBarBtnEle) {
                                accessBarBtnEle.addClass(wijCSS.stateActive);
                            }
                        } else {
                            buttonEle.removeClass(wijCSS.stateActive);
                            if(accessBarBtnEle) {
                                accessBarBtnEle.removeClass(wijCSS.stateActive);
                            }
                        }
                    } else if(buttonObj.type === "galleryBtn") {
                        //gallery state update
                        var galleryEle = buttonEle.parent("div");
                        $("div", galleryEle).removeClass(wijCSS.stateActive);
                        if(checked) {
                            buttonEle.addClass(wijCSS.stateActive);
                        } else {
                            buttonEle.removeClass(wijCSS.stateActive);
                        }
                        return;
                    } else if(!buttonEle.is("input[type='text']")) {
                        buttonEle.prop("checked", checked);
                        buttonEle.button("refresh");
                        if(accessBarBtnEle) {
                            accessBarBtnEle.prop("checked", checked);
                            accessBarBtnEle.button("refresh");
                        }
                    }
                    if(buttonObj.parent) {
                        if(buttonObj.type === "dropdown") {
                            // checked
                            if(checked) {
                                if(!self.dropdownLabels[commandName]) {
                                    self.dropdownLabels[commandName] = self._getDropdownLabelSubstr(buttonEle.button("option", "label"), buttonObj.parent.children("." + wijCSS.buttonText), buttonObj.parent.children("." + wijCSS.buttonText).width());
                                }
                                label = self.dropdownLabels[commandName];
                                if(buttonObj.parent.is("input[type='text']")) {
                                    buttonObj.parent.val(label);
                                    buttonObj.parent.attr("title", label);
                                } else {
                                    buttonObj.parent.button("option", "label", label);
                                    buttonObj.parent.attr("title", buttonEle.button("option", "label"));
                                }
                                radios = $(":radio", buttonObj.button.closest("ul"));
                                if(radios) {
                                    $.each(radios, function () {
                                        self._updateGroupElementTextState(this);
                                    });
                                }
                                //end for active class
                                                            }
                        }
                        //TODO split
                                            } else {
                        self._addActiveClassToButtonText(buttonEle.button("widget"));
                        if(accessBarBtnEle) {
                            self._addActiveClassToButtonText(accessBarBtnEle.button("widget"));
                        }
                    }
                } else if(name) {
                    // handle dropdown
                    listUi = self.listUis[name];
                    if(listUi) {
                        // update for input dropdown
                        if(listUi.ui.is("input[type='text']")) {
                            listUi.ui.val(listUi.defaultValue);
                        } else {
                            listUi.ui.button("option", "label", listUi.defaultValue);
                        }
                        if(listUi.buttons) {
                            $.each(listUi.buttons, function (i, btn) {
                                btn.prop("checked", false);
                                btn.button("refresh");
                                //add for adding active class at 2011/11/16
                                self._addActiveClassToButtonText(btn.button("widget"));
                                //end for adding active class
                                                            });
                        }
                    }
                }
            };
            return wijribbon;
        })(wijmo.wijmoWidget);
        ribbon.wijribbon = wijribbon;        
        var wijribbon_options = (function () {
            function wijribbon_options() {
                /** Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijribbon')";
                /** All CSS classes used in widgets.
                * @ignore
                */
                this.wijCSS = {
                    wijtabsHide: "wijmo-wijtabs-hide"
                };
                /** The wijRibbonClick event is a function that is called
                * when the ribbon command button is clicked.
                * @event
                * @dataKey {string} commandName the command name of the button.
                * @dataKey {string} name the parent name of the button which means if the drop down item is clicked,
                *                     then the name specifies the command name of the drop down button.
                */
                this.click = null;
                /** Define custom buttons(TODO).
                * @ignore
                */
                this.custombuttons = null;
            }
            return wijribbon_options;
        })();        
        ;
        wijribbon.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijribbon_options());
        $.wijmo.registerWidget("wijribbon", wijribbon.prototype);
    })(wijmo.ribbon || (wijmo.ribbon = {}));
    var ribbon = wijmo.ribbon;
})(wijmo || (wijmo = {}));
