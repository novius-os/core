/*globals jQuery,window,document*/
/*
 *
 * Wijmo Library 2.3.7
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Dual licensed under the Wijmo Commercial or GNU GPL Version 3 licenses.
 * licensing@wijmo.com
 * http://wijmo.com/license
 *
 *
 * * Wijmo Combobox widget.
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 *	jquery.wijmo.wijlist.js
 *
 */
(function ($) {
	"use strict";
	var inputCSS = "wijmo-wijcombobox-input",
		stateHover = "ui-state-hover",
		stateActive = "ui-state-active",
		stateFocus = "ui-state-focus",
		conerLeft = "ui-corner-left",
		conerRight = "ui-corner-right",
		triggerHTML = "<div class='wijmo-wijcombobox-trigger ui-state-default " +
							"ui-corner-right'>" +
							"<span class='ui-icon ui-icon-triangle-1-s'></span>" +
						"</div>",
		labelHTML = "<label class='wijmo-wijcombobox-label ui-widget-content'></label>";

	$.widget("wijmo.wijcombobox", {
		options: {
		    /// <summary>
		    /// wijdataview to which this wijcombobox is bound.
		    /// Default: null.
		    /// Type: wijdataview
		    /// </summary>
		    /// <remarks>
		    /// This option is used if this wijcombobox is bound to a wijdataview.
		    /// In that case, you can also specify a mapping option to select the properties to bind to,
		    /// and the data option returns an array of objects containing 
            /// value and label property values determined by that mapping.
		    /// </remarks>
		    dataSource: null,
			/// <summary>
			/// A value that specifies the underlying data source provider of wijcombobox.
			/// Default: null.
			/// Type: wijdatasource/Array
			/// Code example: 
			/// var testArray = [ 
			/// {label: 'c++',value: 'c++'},  
			/// {label: 'java',value: 'java'},  
			/// {label: 'php',value: 'php'}]; 
			/// $("#tags").wijcombobox("option", "data", testArray);
			/// </summary>
			/// <remarks>
			/// This option could either be a wijdatasource object 
			/// or an Object Array containing an item such as 
			/// {label: "label text", value: "value"}.
			/// </remarks>
			data: null,
			/// <summary>
			/// A value that specifies the text in the wijcombobox label.
			/// Default: null.
			/// Type: String.
			/// Code example: $("#tags").wijcombobox("option", "labelText", "Text")
			/// </summary>
			labelText: null,
			/// <summary>
			/// A value that determines the minimum length of text 
			/// that can be entered in the wijcombobox text box to issue an AJAX request.
			/// Default: 4.
			/// Type: Number.
			/// Code example: $("#tags").wijcombobox("option", "minLength", 5)
			/// </summary>
			minLength: 4,
			/// <summary>
			/// A value that determines the duration (in milliseconds) of the time 
			/// to delay before autocomplete begins after typing stops.
			/// Default: 300.
			/// Type: Number.
			/// Code example: $("#tags").wijcombobox("option", "delay", 500)
			/// </summary>
			delay: 300,
			/// <summary>
			/// A value that specifies the animation options for a drop-down list
			/// when it is visible.
			/// Default: null.
			/// Type: Object.
			/// Code example: 
			/// var animationOptions = {
			/// animated: "Drop",
			/// duration: 1000
			/// };
			/// $("#tags").wijcombobox("option", "showingAnimation", animationOptions)
			/// </summary>
			showingAnimation: null,
			/// <summary>
			/// A value specifies the animation options for the drop-down list
			/// when it is hidden.
			/// Default: null.
			/// Type: Object.
			/// Code example: 
			/// var animationOptions = {
			/// animated: "Drop",
			/// duration: 1000
			/// };
			///$("#tags").wijcombobox("option", "hidingAnimation", animationOptions)
			/// </summary>
			hidingAnimation: null,
			/// <summary>
			/// A value that determines whether to show the trigger of wijcombobox.
			/// Default: true.
			/// Type: Boolean.
			/// Code example: $("#tags").wijcombobox("option", "showTrigger", false)
			/// </summary>
			showTrigger: true,
			/// <summary>
			/// A value that specifies the position of the drop-down list trigger.
			/// Default: "right".
			/// Type: String.
			/// Code example: $("#tags").wijcombobox("option", "triggerPosition", "left")
			/// </summary>
			triggerPosition: "right",
			/// <summary>
			/// A value that specifies the height of the drop-down list.
			/// Default: 300.
			/// Type: Number.
			/// Code example: $("#tags").wijcombobox("option", "dropdownHeight", 300)
			/// </summary>
			/// <remarks>
			/// If the total height of all items is less than the value of this option,
			/// it will use the total height of items as the height of the drop-down list.
			/// </remarks>
			dropdownHeight: 300,
			/// <summary>
			/// A value that specifies the width of the drop-down list.
			/// Default: "auto".
			/// Type: Number/String("auto").
			/// Code example: $("#tags").wijcombobox("option", "dropdownWidth", 500)
			/// </summary>
			/// <remarks>
			/// When this option is set to "auto", the width of the drop-down
			/// list is equal to the width of wijcombobox.
			/// </remarks>
			dropdownWidth: "auto",
			/// <summary>
			/// A value that determines whether to select the item 
			/// when the item gains focus or is activated.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#tags").wijcombobox("option", "selectOnItemFocus", true)
			/// </summary>
			selectOnItemFocus: false,
			/// <summary>
			/// A value determines whether to shorten the drop-down list items 
			/// by matching the text in the textbox after typing.
			/// Default: true.
			/// Type: Boolean.
			/// Code example: $("#tags").wijcombobox("option", "autoFilter", false)
			/// </summary>
			autoFilter: true,
			/// <summary>
			/// A value that determines whether to start the auto-complete 
			/// function after typing in the text if a match exists.
			/// Default: true.
			/// Type: Boolean.
			/// Code example: $("#tags").wijcombobox("option", "autoComplete", false)
			/// </summary>
			autoComplete: true,
			/// <summary>
			/// A value that determines whether to highlight the keywords in an item. 
			/// If "abc" is typed in the textbox, 
			/// all "abc" matches are highlighted in the drop-down list.
			/// Default: true.
			/// Type: Boolean.
			/// Code example: $("#tags").wijcombobox("option", "highlightMatching", false)
			/// </summary>
			highlightMatching: true,
			/// <summary>
			/// A value that specifies the position options of the drop-down list.
			/// The default value of the "of" options is the input of wijcombobox.
			/// Default: {}.
			/// Type: Object.
			/// Code example: 
			/// var positionOptions = {my:"right", at:"top"};
			/// $("#tags").wijcombobox("option", "dropDownListPosition", positionOptions)
			/// </summary>
			dropDownListPosition: {},
			/// <summary>
			/// An array that specifies the column collections of wijcombobox.
			/// Example: columns: [{name: "header1", width: 150},
			///                    {name: "header2", width: 150},
			///                    {name: "header3", width: 150}]
			/// Default: [].
			/// Type: Array.
			/// Code example: $("#tags").wijcombobox("option", "columns", [
			/// {name: 'header1', width: 150}, 
			/// {name: 'header2', width: 150}, 
			/// {name: 'header3', width: 150}
			/// ]);
			/// </summary>
			columns: [],
			/// <summary>
			/// A value that specifies the selection mode of wijcombobox.
			/// Default: "Single".
			/// Type: String.
			/// Code example: $("#tags").wijcombobox("option", 
			/// "selectionMode", "multiple")
			/// </summary>
			/// <remarks>
			/// Possible options are: "single" and "multiple".
			/// </remars>
			selectionMode: "single",
			/// <summary>
			/// A value that specifies the separator for 
			/// the multiple selected items text in the textbox.
			/// Default: ",".
			/// Type: String.
			/// Code example: $("#tags").wijcombobox("option", 
			/// "multipleSelectionSeparator", ";")
			/// </summary>
			multipleSelectionSeparator: ",",
			/// <summary>
			/// A value that determines whether to check the input text against 
			/// the text of the selected item when the focus blurs. 
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#tags").wijcombobox("option", "forceSelectionText", true)
			/// </summary>
			/// <remarks>
			/// If the text does not match any item, input text will restore 
			/// to text the selected item or empty if no item is selected.  
			/// </remarks>
			forceSelectionText: false,
			/// <summary>
			/// A function called when any item in list is selected.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a function as an option.
			///  $("#tags").wijcombobox({select: function(e, data) { } });
			/// Bind to the event by type: wijcomboboxselect
			/// $("#tags").bind("wijcomboboxselect", function(e, data) {} );
			/// </summary>
			/// <param name="e" type="EventObj">
			/// EventObj that relates to this event.
			/// </param>
			/// <param name="item" type="Object">
			/// item to be rendered.
			/// item.element: LI element with this item.
			/// item.list: wijlist instance.
			/// item.label: label of item.
			/// item.value: value of item.
			/// item.text: could be set in handler to override rendered label of item.
			/// </param>
			select: null,
			/// <summary>
			/// A value that determines whether input is editable.
			/// Default: true.
			/// Type: Boolean.
			/// Code example: $("#tags").wijcombobox("option", "isEditable", false)
			/// </summary>
			isEditable: true,
			/// <summary>
			/// A value that specifies the index of the item to select 
			/// when using single mode.
			/// If the selectionMode is "multiple", then this option could be set 
			/// to an array of Number which contains the indices of the items to select.
			/// Default: -1.
			/// Type: Number/Array.
			/// Code example: $("#tags").wijcombobox("option", "selectedIndex", 0);
			/// The following example gets the selected item:
			/// var selectedIndex = $("#tags").wijcombobox("option","selectedIndex"); 
			/// var selectedItem = $("#tags").wijcombobox("option","data")[selectedIndex];
			/// </summary>
			/// <remarks>
			/// If no item is selected, it will return -1.
			/// </remarks>
			selectedIndex: -1,
			/// <summary>
			/// A value that specifies the value of the item to select 
			/// when using single mode.
			/// Default: null.
			/// Type: Number/String/Object.
			/// Code example: $("#tags").wijcombobox("option", "selectedValue", "c++")
			/// </summary>
			/// <remarks>
			/// If no item is selected, it will return null.
			/// </remarks>
			selectedValue: null,
			/// <summary>
			/// A value that specifies the input text of the combobox is in dropdown list or not.
			/// It's readonly option, if user typed text is not in dropdown list, it returns false; 
			/// if user selects a item form the dropdown list or typed text in dropdown list, it returns true.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#tags").wijcombobox("option", "inputTextInDropDownList")
			/// </summary>
			inputTextInDropDownList: false,
			/// <summary>
			/// A value that specifies the input text of the combobox.
			/// When set the text by code, it will not affect the selectedIndex and selectedValue.
			/// Default: null.
			/// Type: String.
			/// Code example: $("#tags").wijcombobox("option", "text", "comboboText")
			/// </summary>
			text: null,
			/// <summary>
			/// A value indicating the dropdown element will be append to the body or combobox container.
			/// If the value is true, the dropdown list will be appended to body element.
			/// else it will append to the combobox container.
			/// Default: null.
			/// Type: Boolean.
			/// Code example: $("#tags").wijcombobox("option", "EnsureDropDownOnBody", false)
			/// </summary>
			ensureDropDownOnBody: true, 
			/// <summary>
			/// A function called when drop-donw list is opened.
			/// Default: null.
			/// Type: Function.
			/// Supply a function as an option.
			/// Code example: $("#tags").wijcombobox("open", function(e, data) {});
			/// Bind to the event by type: wijcomboboxopen
			/// $("#tags").bind("wijcomboboxopen", function(e, data) {} );
			/// </summary>
			/// <param name="e" type="EventObj">
			/// The jquery event object.
			/// </param>
			open: null,
			/// <summary>
			/// A function called when drop-donw list is closed.
			/// Default: null.
			/// Type: Function.
			/// Supply a function as an option.
			/// Code example: $("#tags").wijcombobox("close", function(e, data) {});
			/// Bind to the event by type: wijcomboboxclose
			/// $("#tags").bind("wijcomboboxclose", function(e, data) {} );
			/// </summary>
			/// <param name="e" type="EventObj">
			/// The jquery event object.
			/// </param>
			close: null,
			/// <summary>
			/// A value added to the width of the target select element 
			/// to account for the scroll bar width of superpanel.
			/// Default: 6.
			/// Type: Number.
			/// <remarks>
			/// Unit for this value is pixel.
			/// Because the width of the scroll bar may be different between browsers 
			/// if wijcombobox is initialized with the width of the HTML select element, 
			/// the text may be hidden by the scroll bar of wijcombobox. 
			/// </remarks>
			/// Code example: $("#tags").wijcombobox("option", "selectElementWidthFix", 5)
			/// </summary>
			selectElementWidthFix: 6,
			/// <summary>
			/// A function called before searching the list.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a function as an option.
			///  $("#tags").wijcombobox({search: function(e, data) { } });
			/// Bind to the event by type: wijcomboboxsearch
			/// $("#tags").bind("wijcomboboxsearch", function(e, data) {} );
			/// </summary>
			/// <param name="e" type="EventObj">
			/// The jquery event object.
			/// </param>
			/// <param name="data" type="Object">
			/// data.datasrc: The datasource of wijcombobox.
			/// data.term: The text to search.
			/// </param>
			search: null,
			/// <summary>
			/// The event is obsolete event.
			/// A function called when select item is changed.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a function as an option.
			///  $("#tags").wijcombobox({changed: function(e, data) { } });
			/// Bind to the event by type: wijcomboboxchanged
			/// $("#tags").bind("wijcomboboxchanged", function(e, data) {} );
			/// </summary>
			/// <param name="e" type="EventObj">
			/// The jquery event object.
			/// </param>
			/// <param name="data" type="Object">
			/// data.oldItem: The old item.
			/// data.newItem: The new item.
			/// data.oldIndex: The old index of selected item.
			/// data.newIndex: The new index of selected item.
			/// </param>
			changed: null,
			/// <summary>
			/// A function called when text of combobox is changed.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a function as an option.
			///  $("#tags").wijcombobox({textChanged: function(e, data) { } });
			/// Bind to the event by type: wijcomboboxtextchanged
			/// $("#tags").bind("wijcomboboxtextchanged", function(e, data) {} );
			/// </summary>
			/// <param name="e" type="EventObj">
			/// The jquery event object.
			/// </param>
			/// <param name="data" type="Object">
			/// data.oldText: The old text of combobox.
			/// data.newText: The new text of combobox.
			/// </param>
			textChanged: null,
			/// <summary>
			/// A function called when selected index of combobox is changed.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a function as an option.
			///  $("#tags").wijcombobox({selectedIndexChanged: function(e, data) { } });
			/// Bind to the event by type: wijcomboboxselectedindexchanged
			/// $("#tags").bind("wijcomboboxselectedindexchanged", function(e, data) {} );
			/// </summary>
			/// <param name="e" type="EventObj">
			/// The jquery event object.
			/// </param>
			/// <param name="data" type="Object">
			/// data.oldItem: The old item.
			/// data.newItem: The new item.
			/// data.oldIndex: The old index of selected item.
			/// data.newIndex: The new index of selected item.
			/// </param>
			selectedIndexChanged: null,
			/// <summary>
			/// A function called when the selected index of the comboBox is about to change. Cancellable.
			/// If return false, the select operation will be canceled.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a function as an option.
			///  $("#tags").wijcombobox({selectedIndexChanging: function(e, data) { } });
			/// Bind to the event by type: wijcomboboxselectedindexchanging.
			/// $("#tags").bind("wijcomboboxselectedindexchanging", function(e, data) {} );
			/// </summary>
			/// <param name="e" type="EventObj">
			/// The jquery event object.
			/// </param>
			/// <param name="data" type="Object">
			/// data.oldItem: The old item.
			/// data.newItem: The new item.
			/// data.oldIndex: The old index of selected item.
			/// data.newIndex: The new index of selected item.
			/// </param>
			selectedIndexChanging: null,
			/// <summary>
			/// The object contains the options of wijlist.
			/// Default: null.
			/// Type: Object.
			/// Code example: 
			/// var listoptions = {addHoverItemClass: false};
			/// $("#tags").wijcombobox("option", "listOptions", listoptions)
			/// </summary>
			listOptions: null
		},

		_create: function () {
			var t = this, focusElement;
			// inits selected items
			t.selectedItem = null;
			t.selectedItems = [];
			focusElement = document.activeElement;
			
			// enable touch support:
			if (window.wijmoApplyWijTouchUtilEvents) {
				$ = window.wijmoApplyWijTouchUtilEvents($);
			}

			// inits wijcombobox
			t._initInnerData();
			t._createDOMElements();
			t._bindInputEvents();
			t._initDropDownList();
			t.repaint();
			t._checkSelectIndex();
			
			if (t._usingRemoteData() && t.options.data) {
				t.originalDataSourceLoaded = t.options.data.loaded;
			}

			if (focusElement === t._input[0] &&
					t.options.isEditable) {
				$(function () {
					t._input.focus();
				});
			}
			
			//update for visibility change
			if (t.element.is(":hidden") &&
						t.element.wijAddVisibilityObserver) {
				t.element.wijAddVisibilityObserver(function () {
					t.repaint();
					if (t.element.wijRemoveVisibilityObserver) {
						t.element.wijRemoveVisibilityObserver();
					}
				}, "wijcombobox");
			}
		},
		
		_initInnerData: function () {
			var self = this, 
			o = self.options,
			isBind;
			if (o.datasource !== null) {

				isBind = self._isBind();
				if (isBind) {
					self.innerData = self._getMappingItems();
				} else {
					self.innerData = o.data;
				}
			}
			self.listHasCreated = false;
		},

		_checkSelectIndex: function () {
			var self = this, index,
			o = self.options,
			data = self.innerData;
			
			if (o.selectedIndex === -1 && o.selectedValue) {
				$.each(data, function (i, item) {
					if (data[i].value === o.selectedValue) {
						self.options.selectedIndex = i;
						return false;
					}
				});
			}
			index = o.selectedIndex;
			if (!self._usingRemoteData() && (index >= 0 || $.isArray(index))) {
				self.search(null, "checkindex");
			}
			
			// if the selecteIndex is -1 and selectedValue is null, the text
			// option will give to combobox
			if (o.selectedIndex === -1 && o.text) {
				if (!o.forceSelectionText || 
						(o.forceSelectionText && 
								self._checkTextInItems(o.text) !== -1)) {
					self._input.val(o.text);
				}
			}
		},

		repaint: function () {
			/// <summary>
			/// Repaints wijcombobox. Returns true if it succeeds; 
			/// otherwise, returns false.
			/// Code example: $("#tags").wijcombobox("repaint");
			/// </summary>
			/// <returns type="Boolean">
			/// Returns true if it succeeds; otherwise, returns false.
			/// </returns>

			var o = this.options, self = this;
			if (self.element.is(":visible") || self._comboDiv ||
			(self._select !== undefined && self._input.is(":visible"))) {
				self._showTrigger();
				if (o.disabledState) {
					var dis = o.disabled;
					self.disable();
					o.disabled = dis;
				}
				if (o.disabled) {
					self.disable();
				}
				return true;
			}
			return false;
		},

		_bindInputEvents: function () {
			var self = this, input, inputText,
			o, code, keyCode;

			input = self._input;
			o = self.options;
			// self.element is an html input element.
			input.bind("keydown.wijcombobox", function (event) {
				if (o.disabledState === true || o.disabled) {
					return;
				}
				code = event.keyCode;
				keyCode = $.ui.keyCode;
				switch (code) {
				case keyCode.UP:
					self._move("previous", event);
					// prevent moving cursor to beginning of 
					// text field in some browsers
					event.preventDefault();
					break;
				case keyCode.DOWN:
					self._move("next", event);
					// prevent moving cursor to end of text field in some browsers
					event.preventDefault();
					break;
				case keyCode.ENTER:
					// when menu is open or has focus
					if (self.menu.active) {
						event.preventDefault();
						//update for issue 24045
						if (o.selectionMode === "multiple" && 
								self.menu &&
								self.menu.items &&
								self.menu.items.length === 1) {
							$.each(self.selectedItems, function (index, i) {
								if (i !== self.menu.items[0]) {
									i.selected = false;
								}
							});
						}
						//end 
						self.menu.select(event);
					}
					event.preventDefault();//update for issue 24134 at 2012/7/19
					break;
				//passthrough - ENTER and TAB both select the current element
				case keyCode.TAB:
					input.trigger("wijcomboblur");
					if (!self.menu.active ||
				(o.selectionMode === "multiple" && keyCode.TAB === code)) {
						return;
					}
					self.menu.select(event);
					// remove selection from input.
					var end = input.val().length;
					self._selectText(end, end, input);

					break;
				case keyCode.ESCAPE:
					self.close(event);
					break;
				case keyCode.LEFT:
				case keyCode.RIGHT:
				case keyCode.SHIFT:
				case 16:
				case 17://ctrl for jquery 1.9
				case keyCode.CONTROL:
				case keyCode.HOME:
				case keyCode.END:
				case keyCode.DELETE:
				case keyCode.PAGE_UP:
				case keyCode.PAGE_DOWN:
					// ignore metakeys (shift, ctrl, alt)
					break;
				case 18: //alt key
					input.trigger("wijcomboblur");
					break;
				default:
					// keypress is triggered before the input value is changed
					window.clearTimeout(self.searching);
					if (o.isEditable === false) {
						if (self._cacheKey === undefined) {
							self._cacheKey = "";
						}
						self._cacheKey += String.fromCharCode(code);
					}
					self.searching = window.setTimeout(function () {
						var term;
						if (o.isEditable === false) {
							term = self._cacheKey;
							self._cacheKey = undefined;
						}
						else {
							term = input.val();
						}
						self.search(term, event);
					}, o.delay);
					break;
				}
			}).bind("wijcomboblur.wijcombobox", function (event) {
				window.clearTimeout(self.searching);
				self._addInputFocus(false, stateFocus);
				// TODO try to implement this without a timeout, 
				// see clearTimeout in search()
				self.closing = window.setTimeout(function () {
					self.close(event, true);
				}, 150);

			}).bind("focus.wijcombobox", function () {
				self._addInputFocus(true, stateFocus);
			}).bind("blur.wijcombobox", function () {
				if (!self.menu.element.is(":visible")) {
					input.trigger("wijcomboblur");
				}
				inputText = input.val();
				if (o.text !== inputText) {
					self._trigger("textChanged", null, {
						oldText: o.text,
						newText: inputText
					});
				}
				self._change();
			});
		},

		_addInputFocus: function (add, css) {
			var self = this, wrap, key, arrow;

			wrap = self._input.parent();
			key = add ? "addClass" : "removeClass";
			arrow = self._triggerArrow;
			wrap[key](css);
			if (arrow !== undefined) {
				arrow[key](css);
			}
		},

		_renderColumnsHeader: function (header) {
			var ul = $("<ul class='wijmo-wijcombobox-rowheader'></ul>");
			$.each(this.options.columns, function (index, column) {
				var li = $("<li class='wijmo-wijcombobox-cell ui-widget-header'></li>");
				li.html(column.name);
				if (column.width !== undefined) {
					li.width(column.width);
				}
				li.appendTo(ul);
			});
			header.append(ul);
		},

		_hasSameValueText: function (item1, item2) {
			return item1.label === item2.label && item1.value === item2.value;
		},

		_initDropDownList: function () {
			var self = this, doc, menuElement, o, header, listOptions,
			dropDownContainer;

			doc = self.element[0].ownerDocument;
			if (!self._comboDiv) {
				menuElement = $("<div class='wijmo-wijcombobox-list'></div>");
			} else {
				menuElement = self._oriList;
			}
			o = self.options;
			if (o.columns.length > 0) {
				menuElement.addClass("wijmo-wijcombobox-multicolumn");
				header = $("<div class='wijmo-wijsuperpanel-header " +
				"ui-state-default'></div>");
				self._renderColumnsHeader(header);
				menuElement.append(header);
			}

			listOptions = {
				keepHightlightOnMouseLeave: true,
				selectionMode: o.selectionMode,
				addHoverItemClass: o.columns.length === 0,
				focus: function (e, item) {
					var i = item;
					if (o.selectOnItemFocus) {
						self.menu.select(null, {
							notCloseAfterSelected: true
						});
					}
					if (o.columns.length > 0) {
						if (i.element) {
							i.element.prev().addClass("wijmo-wijcombobox-active-prev");
							i.element.find(".wijmo-wijcombobox-row>.wijmo-wijcombobox-cell")
							.addClass("ui-state-hover");	
						}
					}
				},
				selected: function (event, ui) {
					window.clearTimeout(self.closing);
					var mode = o.selectionMode, item, newIndex,
					cancelSelect = false,
					oldText,
					oldIndex, oldItem;

					item = ui.item;
					if (self._trigger("select", event, item)) {
						if (mode === "single") { // single mode selection
							// local data select
							if (!self._usingRemoteData()) {
								newIndex = $.inArray(item, self.items);	
								if (newIndex === undefined) {
									newIndex = ui.selectedIndex;
								}
	
								//fired the SelectedIndexChanging event
								if (newIndex !== o.selectedIndex) {
									oldIndex = o.selectedIndex;
									oldItem = self.selectedItem;
									cancelSelect = self._triggerSelectedIndexChanging(oldItem,
											item, oldIndex, newIndex);
									if (cancelSelect) {
										return;
									}
									
									self._setInputText(item.label);
									
									if (oldItem !== null) {
										oldItem.selected = false;
									}
									self.selectedItem = item;
									
									o.selectedIndex = newIndex;
									o.selectedValue = self.selectedItem.value;
									// fire select change event 
									if (self._select !== undefined) {
										self._select[0].selectedIndex = o.selectedIndex;
										self._select.trigger("change");
									}
									o.inputTextInDropDownList = true;
									o.text = self._input.val();
									if (oldItem && oldItem.element) {
										oldItem.element.removeClass("wijmo-wijcombobox-selecteditem");
									}
									self._trigger("changed", null, {
										oldItem: oldItem,
										selectedItem: self.selectedItem,
										newIndex: o.selectedIndex,
										oldIndex: oldIndex
									});
									self._triggerSelectedIndexChanged(oldItem,
											self.selectedItem, oldIndex, o.selectedIndex);
								} else {
									// for fixing bug 24133 at 2012/8/6
									if (self.selectedItem && 
									    self._input.val() !== self.selectedItem.label && 
									    (ui.data === undefined || !ui.data.notCloseAfterSelected)) {
										self._input.val(item.label);
									}
								}
							}
							else {
								// If items have the same text and value, 
								// they are considered to be same in remote mode.
								if (self.selectedItem === null ||
								!self._hasSameValueText(item, self.selectedItem)) {
									oldItem = self.selectedItem;
									oldIndex = o.selectedIndex;
									cancelSelect = self._triggerSelectedIndexChanging(oldItem,
											item, oldIndex, ui.selectedIndex);
									if (cancelSelect) {
										return;
									}
									//self._input.val(item.label);
									self._setInputText(item.label);
									o.text = self._input.val();
									self.selectedItem = item;
									//update for 29162 issue.
									newIndex = $.inArray(item, self.items);
									if (newIndex === undefined) {
										newIndex = ui.selectedIndex;
									}
									
									if (newIndex !== o.selectedIndex) {
										o.selectedIndex = newIndex;
										o.selectedValue = self.selectedItem.value;
									}
									//end
									o.inputTextInDropDownList = true;
									self._trigger("changed", null, {
										selectedItem: item
									});
									self._triggerSelectedIndexChanged(oldItem,
											 item, oldIndex, o.selectedIndex);
								}
							}
							
						}
						else { // multiple selection mode
							if (!self._usingRemoteData()) {
								cancelSelect = self._triggerSelectedIndexChanging(null,
										item, oldIndex, ui.selectedIndex);
								if (cancelSelect) {
									return;
								}
								
								self.selectedItems = ui.selectedItems;
								self._selectedItemsToInputVal(self.selectedItems);
								o.inputTextInDropDownList = true;
								o.selectedIndex = ui.selectedIndex;
								self._trigger("changed", null, {
									selectedItem: item,
									selectedItems: self.selectedItems
								});
								self._triggerSelectedIndexChanged(null,
										item, null, o.selectedIndex);
								///TODO: show helper list
							}
						}
					}
					if ((ui.data === undefined || !ui.data.notCloseAfterSelected) &&
					mode === "single") {
						self.close(event);
						self._input.focus();
					}
				},
				blur: function (e, item) {
					var d = item.element;
					if (o.columns.length > 0 && d) {
						d.find(".wijmo-wijcombobox-row>.wijmo-wijcombobox-cell")
						.removeClass("ui-state-hover");
						d.prev().removeClass("wijmo-wijcombobox-active-prev");
					}
				},
				itemRendering: function (event, data) {
					var item = data, css;
					css = "";
					if (item.isSeparator) {
						css += " wijmo-wijcombobox-separator";
					}
					if (item.selected) {
						css += " wijmo-wijcombobox-selecteditem";
					}
					if (css.length > 0) {
						item.element.addClass(css);
					}
					// for issue 33868(2013-2-8), when open the dropdown the 
					/// highlight style will be append to item
				},
				itemRendered: function (event, data) {
					var item = data, li, u;
					if (item.cells === undefined) {
						return;
					}
					li = item.element;
					li.empty();
					u = $("<ul class='wijmo-wijcombobox-row'></ul>");
					$.each(item.cells, function (index, cell) {
						var l = $("<li class='wijmo-wijcombobox-cell " +
						"ui-state-default'></li>");
						//Fix a bug that columns.width doesn't work.
						if (o.columns && o.columns.length > index) {
							if (typeof o.columns[index].width !== "undefined") {
								l.width(o.columns[index].width);
							}
						}
						//end comments.
						l.append(cell);
						l.attr("title", cell);
						u.append(l);
					});
					li.append(u);
				},
				superPanelOptions: {
					resized: function (e) {
						var m = self.menu, ele = m.element;
						o.dropdownWidth = ele.outerWidth();
						o.dropdownHeight = ele.outerHeight();
						self._positionList();
						self.menu.refreshSuperPanel();
					}
				}
			};
			listOptions = $.extend(true, listOptions, o.listOptions);
			
			dropDownContainer = o.ensureDropDownOnBody ? "body" : self._comboElement;
			
			self.menu = menuElement.appendTo(dropDownContainer, doc)
			.wijlist(listOptions)
			.zIndex(self._input.zIndex() + 1)
			.css({
				top: 0,
				left: 0
			}).hide().data("wijlist");

			self._createDropDownList();
			self._menuUL = self.menu.ul;
		},
		
		_setInputText: function (text, firedTextChanged) {
			var self = this, oldText = self._input.val();
			
			self._input.val(text);
			if (oldText !== text) {
				self._trigger("textChanged", null, {
					oldText: oldText,
					newText: text
				});
			}
		},
		
		_triggerSelectedIndexChanged: function (oldItem, 
				newItem, oldIndex, newIndex) {
			var o = this.options, curSelectedIdx;
			
			if (o.selectionMode ===  "single") {
				this._trigger("selectedIndexChanged", null, {
					oldItem: oldItem,
					selectedItem: newItem,
					newIndex: newIndex,
					oldIndex: oldIndex
				});
			} else {
				curSelectedIdx = $.inArray(newItem, this.items);
				this._trigger("selectedIndexChanged", null, {
					selectedItem: newItem,
					selectedIndex: curSelectedIdx,
					selectedItems: this.selectedItems
				});
			}

		},
		
		_triggerSelectedIndexChanging: function (oldItem, 
				newItem, oldIndex, newIndex) {
			var o = this.options, curSelectedIdx, args, isSelect = true;

			if (o.selectionMode ===  "single") {
				args = {
						oldItem: oldItem,
						selectedItem: newItem,
						newIndex: newIndex,
						oldIndex: oldIndex
					};
				isSelect = this._trigger("selectedIndexChanging", null, args);
			} else {
				curSelectedIdx = $.inArray(newItem, this.items);
				args = {
						selectedItem: newItem,
						selectedIndex: curSelectedIdx,
						selectedItems: this.selectedItems
					};
				isSelect = this._trigger("selectedIndexChanging", null, args);
			}
			if (!isSelect) {
				newItem.selected = false;
				if (newItem.element) {
					newItem.element.removeClass("wijmo-wijcombobox-selecteditem");
				}
			}
			return !isSelect;
		},
		
		_createDropDownList: function (datasrc) {
			var self = this, items, o = self.options,
			datasource = datasrc;
			
			if (!datasource) {
				datasource = self.innerData;
			}

			if (datasource === null) {
				items = null;
			} else {
				items = $.isArray(datasource) ? datasource : datasource.items;
			}
			if (self._comboDiv) {
				//update for case 20689 at 2012/4/11
				if (!self.listHasCreated && items && items.length > 0) {
					self.menu.setTemplateItems(o.data);
					self.menu.renderList();
					self.listHasCreated = true;
				}
			} else {
				if (!self.listHasCreated && items && items.length > 0) {
					self.menu.setItems(items);
					self.menu.renderList();
					self.listHasCreated = true;
				} 
			}
		},

		_getSelectedItemsText: function (items) {
			var s = "", self, sep;

			self = this;
			sep = self.options.multipleSelectionSeparator;
			self.selectedItems = items;

			$.each(items, function (index, item) {
				//update for bug 24045
				if (item) {
					s += item.label + sep;
				}
			});
			if (s.length > 0) {
				s = s.substr(0, s.lastIndexOf(sep));
			}
			
			return s;
		},
		
		_selectedItemsToInputVal: function (items) {
			var self = this;
			
			//self._input.val(self._getSelectedItemsText(items));
			self._setInputText(self._getSelectedItemsText(items));
			self.options.text = self._input.val();
		},

		_createDOMElements: function () {
			var self = this, comboElement, ele, input, wrapperElement;

			wrapperElement = $("<div class='wijmo-wijcombobox-wrapper " +
			"ui-state-default ui-corner-all'>" +
			"</div>");

			// check if element is a select element
			ele = self.element;

			// create from a select element
			if (ele.is("select")) {
				comboElement =
					$("<div role='combobox' class='wijmo-wijcombobox " +
						"ui-widget ui-helper-clearfix'>" +
					"</div>");
				comboElement.append(wrapperElement);
				self._comboElement = comboElement;
				self._select = ele;
				// add class to set font size to get the correct width of select.
				ele.addClass("ui-widget");
				input = self._input = $("<input role='textbox' " +
				"aria-autocomplete='list' aria-haspopup='true' />")
				.insertAfter(ele);
				if (!self.options.data) {
					self.options.data = self._convertSelectOptions();
					self._initInnerData();
				}
			} else if (ele.is("div") && $(ele.children()[0]).is("input[type='text']") && 
					$(ele.children()[1]).is("div")) {
				//div tag
				self._comboElement = self._comboDiv = comboElement = ele;
				self._oriList = $(ele.children()[1]);
				input = self._input = $(ele.children()[0]);

				wrapperElement.prependTo(comboElement).append(input);
				ele.addClass("wijmo-wijcombobox ui-widget ui-helper-clearfix");
				ele.attr("role", "combobox");
			}
			else {
				comboElement =
					$("<div role='combobox' class='wijmo-wijcombobox " +
						"ui-widget ui-helper-clearfix'>" +
					"</div>");
				comboElement.append(wrapperElement);
				self._comboElement = comboElement;
				input = self._input = ele;
			}
			if (!self._comboDiv) {
				comboElement.insertBefore(input);
				//update for fixing bug 17328 at 2011/10/18 by wuhao
				//add visible judge for visibility change at 2012/7/24
				if (self.element.is(":visible")) {
					input.width(input.width());
				}
				//end for fixing bug 17328
				comboElement.children(".wijmo-wijcombobox-wrapper").append(input);
			}
			input.attr({
				autocomplete: "off",
				role: "textbox",
				"aria-wijcombobox": "list",
				"aria-haspopup": "true"
			}).addClass(inputCSS);
			self._oldWidth = ele.css("width");
			if (self.options.isEditable === false) {
				input.attr("readonly", "readonly");
				//update for add issue: when iseditable is false
				//click the all the combobox, the dropdown list will open
				wrapperElement.bind("click", function () {
					if (self.options.disabledState === true ||
							self.options.disabled) {
						return;
					}
					self._triggerClick();
				});
			}
			if (self.options.disabledState === true || 
					self.options.disabled === true) {
				input.attr("disabled", "disabled");
			}
			comboElement.bind("mouseenter", function () {
				if (self.options.disabledState === true || 
						self.options.disabled) {
					return;
				}
				self._addInputFocus(true, stateHover);
			}).bind("mouseleave", function () {
				self._addInputFocus(false, stateHover);
			});
			
		},

		_convertSelectOptions: function () {
			var items = [], self, selectOptions;

			self = this;
			selectOptions = self._select.get(0).options;
			$.each(selectOptions, function (idx, opt) {
				items.push({ label: opt.text, value: opt.value });
			});
			//update for case 28976
			if (self.options.selectedIndex === -1 &&
					self.options.selectedValue === null &&
					self.options.text === null) {
				self.options.selectedIndex = self._select[0].selectedIndex;
			}			
			return items;
		},

		getComboElement: function () {
			return this._comboElement;
		},

		_showTrigger: function () {
			var self = this, o, input, inputWrapper, comboElement,
			selectClone, selectWidth = 0,
			trigger, label, sp, padding, labelPadding, triggerPadding;

			o = self.options;
			input = self._input;
			inputWrapper = input.parent();
			comboElement = self._comboElement;
			trigger = self._triggerArrow;
			label = self._label;

			// set size
			if (self._select !== undefined) {
				if (!$.browser.msie) {
					selectWidth = self._select.width();
				} else {
					selectClone = self._select.clone();
					self._select.after(selectClone);
					selectWidth = selectClone.width();
					selectClone.remove();
				}
				//update for bind array
				input.width(selectWidth +
						(self.innerData.length > 20 ? o.selectElementWidthFix : 0));
				self._select.hide();
			}

			//update for fixing bug 15920 by wuhao
			input.css("margin-left", "");
			input.css("margin-right", "");
			//end for bug 15920.

			comboElement.width(inputWrapper[0].offsetWidth);
			//comboElement.height(inputWrapper[0].offsetHeight);

			// show label
			if (o.labelText !== null) {
				label = self._label = $(labelHTML);
				inputWrapper.append(label.html(o.labelText));
			}
			else {
				if (label !== undefined) {
					label.remove();
					self._label = undefined;
				}
			}

			if (o.showTrigger) {
				input.removeClass("ui-corner-all");
				if (trigger === undefined) {
					trigger = self._triggerArrow = $(triggerHTML);
					comboElement.append(trigger);
					trigger.bind("mouseover.triggerevent", self, function (e) {
						if (o.disabledState === true || o.disabled) {
							return;
						}
						var ct = $(e.currentTarget);
						ct.addClass(stateHover);
					}).bind("mousedown.triggerevent", self, function (e) {
						if (o.disabledState === true || o.disabled) {
							return;
						}
						var ct = $(e.currentTarget);
						ct.addClass(stateActive);
					}).bind("mouseup.triggerevent", self, function (e) {
						var ct = $(e.currentTarget);
						ct.removeClass(stateActive);
					}).bind("click.triggerevent", self, function () {
						if (o.disabledState === true || o.disabled) {
							return;
						}
						self._triggerClick();
						
					});
				}
				if (o.triggerPosition === "right") {
					trigger.css({ left: "", right: "0px" });
					trigger.removeClass(conerLeft);
					trigger.addClass(conerRight);
				}
				else {
					trigger.css({ "right": "", "left": "0px" });
					trigger.removeClass(conerRight);
					trigger.addClass(conerLeft);
				}
				trigger.setOutHeight(comboElement.innerHeight());
				sp = trigger.find("span");
				sp.css("margin-left", (trigger.innerWidth() - sp[0].offsetWidth) / 2);
				sp.css("margin-top", (trigger.innerHeight() - sp[0].offsetHeight) / 2);
			}
			else {
				if (trigger !== undefined) {
					trigger.unbind(".triggerevent");
					trigger.remove();
					self._triggerArrow = undefined;
				}
				input.removeClass("ui-corner-left");
				input.removeClass("ui-corner-right");
				input.addClass("ui-corner-all");
			}

			// padding
			padding = labelPadding = triggerPadding = 0;
			if (label !== undefined) {
				labelPadding += label[0].offsetWidth;
			}
			if (trigger !== undefined) {
				triggerPadding = trigger[0].offsetWidth;
			}
			padding = labelPadding + triggerPadding;
			input.setOutWidth(inputWrapper.innerWidth() - padding);
			padding = padding === 0 ? "" : padding;
			if (o.triggerPosition === "right") {
				input.css("margin-left", "");
				input.css("margin-right", padding);
				if (label !== undefined) {
					label.css("left", "");
					label.css("right", triggerPadding);
				}
			}
			else {
				input.css("margin-right", "");
				input.css("margin-left", padding);

				if (label !== undefined) {
					label.css("right", "");
					label.css("left", triggerPadding);
				}
			}
		},

		_triggerClick: function (e) {
			var self = this, term = "";
			window.clearTimeout(self.closing);
			if (self.menu.element.is(":visible")) {
				self.close();
			}
			else {
				// TODO: click open should not render again.
				if (self._usingRemoteData()) {
					term = self._input.val();
				}
				self.search(term, e);
			}
		},

		destroy: function () {
			/// <summary>
			/// Removes the wijcombobox functionality completely. 
			/// This returns the element back to its pre-init state. 
			/// Code example: $("#tags").wijcombobox("destroy");
			/// </summary>

			var self = this,
			ele = self.element;
			if (self.options.isEditable === false) {
				ele.removeAttr("readonly");
			}
			if (self._select !== undefined) {
				self._select.removeClass("ui-widget");
				self._select.show();
				self._input.remove();
			}
			else if (self._comboDiv) {
				self._comboDiv
					.removeClass("wijmo-wijcombobox ui-widget ui-helper-clearfix");
				self._comboDiv.removeAttr("role");
				self._input.insertBefore(self._comboDiv);
				self._comboDiv.children(".wijmo-wijcombobox-wrapper").remove();
			}
			else {
				ele.css("width", self._oldWidth);
				ele.removeClass(inputCSS);
				ele.removeAttr("autocomplete").removeAttr("role")
				.removeAttr("aria-wijcombobox").removeAttr("aria-haspopup");
				ele.insertBefore(self._comboElement);
				ele.css("padding", "");
			}
			self._comboElement.remove();
			self.menu.destroy();
			self.menu.element.remove();
			$.Widget.prototype.destroy.call(self);
		},

		_setOption: function (key, value) {
			var self = this, ele, input, items, inputWrapper, cancelSelect,
			label = self._label, triggerPadding, oldSelectedIndex, newSelectedItem,
			oldSelectedItem = null,
			triggerWidth = 0,
			o = self.options;
			ele = self._comboElement;
			input = self.element;
			inputWrapper = input.parent();
			oldSelectedIndex = o.selectedIndex;
			
			if (self._triggerArrow) {
				triggerWidth = self._triggerArrow.outerWidth();
			}
			
			$.Widget.prototype._setOption.apply(self, arguments);
			if (key === "disabled") {
				if (value) {
					ele.addClass("wijmo-wijcombobox-disabled ui-state-disabled");
					//update for 27917
					self._input.attr("disabled", "disabled");
					if (self._comboDiv) {
						self._input
						.addClass("wijmo-wijcombobox-disabled ui-state-disabled")
						.attr("disabled", "disabled");
					}
	
					if (self._triggerArrow) {
						self._triggerArrow.unbind("click.triggerevent");
					}
					self.close();
				}
				else {
					ele.removeClass("wijmo-wijcombobox-disabled ui-state-disabled");
					self._input.removeAttr("disabled");
					if (self._comboDiv) {
						self._input
						.removeClass("wijmo-wijcombobox-disabled ui-state-disabled")
						.removeAttr("disabled");
					}
					
					if (self._triggerArrow) {
						self._triggerArrow.bind("click.triggerevent", self, function () {
							if (o.disabledState === true) {
								return;
							}
							self._triggerClick();
						});
					} 
				}
			} else if (key === "labelText") {
				if (o.labelText !== null) {
					label = self._label = $(labelHTML);
					self._input.parent()
					.append(label.html(o.labelText));
					
					if (self._triggerArrow !== undefined) {
						triggerPadding = self._triggerArrow[0].offsetWidth;
					}
					if (o.triggerPosition === "right") {
						if (label !== undefined) {
							label.css("left", "");
							label.css("right", triggerPadding);
						}
					}
					else {
						if (label !== undefined) {
							label.css("right", "");
							label.css("left", triggerPadding);
						}
					}
					self.repaint();
				}
				else {
					if (label !== undefined) {
						label.remove();
						self._label = undefined;
					}
				}
			} else if (key === "showTrigger") {
				self._showTrigger();
				if (!o.showTrigger && self.element.is("select"))  {
					input.width(input.width() +  triggerWidth);
				}
			} else if (key === "triggerPosition") {
				input.width(input.width() +  triggerWidth);
				self._showTrigger();
			} else if (key === "selectionMode") {
				self.menu._setOption("selectionMode", value);
			} else if (key === "isEditable") {
				if (value) {
					//update for 27917
					self._input.removeAttr("readonly");
					//update for add issue: when iseditable is false
					//click the all the combobox, the dropdown list will open
					$(".wijmo-wijcombobox-wrapper", 
							self._comboElement[0]).bind("click", function () {
								self._triggerClick();
							});
				}
				else {
					//update for 27917
					self._input.attr("readonly", "readonly");
					$(".wijmo-wijcombobox-wrapper", 
							self._comboElement[0]).unbind("click");
				}
			}
			//Add comments by RyanWu@20110119.
			//For fixing the issue that first open the dropdown list and choose one item,
			//then set the new data to the combo and click the dropdown list, 
			//an exception will be thrown.
			else if (key === "data" || key === "dataSource") {
				self._initInnerData();
				self._setSelectedIndex(o.selectedIndex);
				if ($.isArray(self.innerData)) {
					self.listHasCreated = false;
					self._createDropDownList();
				} else {
					try {
						self.innerData.loaded = function (e, data) {
							if (e === null) {
								self.items = null;
							} else {
								self.items = $.isArray(e) ? e : e.items;
							}
							self.listHasCreated = false;
							self._createDropDownList();
						};
						self.innerData.load(null);
					} catch (e) {
						
					}
				}
				
				if (o.selectedIndex !== -1) {
					oldSelectedItem = items ? items[oldSelectedIndex]:null;
					items = self.innerData;
					self._trigger("changed", null, {
						oldItem: oldSelectedItem,
						selectedItem: self.selectedItem,
						newIndex: o.selectedIndex,
						oldIndex: oldSelectedIndex
					});
					self._triggerSelectedIndexChanged(oldSelectedItem,
							self.selectedItem, oldSelectedIndex, o.selectedIndex);
				}
				self._keypress = false;
			}
			//end by RyanWu@20110119.
			else if (key === "selectedIndex") {
				if (value === oldSelectedIndex) {
					return;
				}
				if (value > -1) {
					self.selectedItem = null;
					if (self.innerData === null) {
						items = null;
					} else {
						items = $.isArray(self.innerData) ? 
								self.innerData : self.innerData.items;
					}
					oldSelectedItem = items ? items[oldSelectedIndex] : null;
					if (items && items[value] !== null) {
						newSelectedItem = items[value];
					}
					cancelSelect = self._triggerSelectedIndexChanging(oldSelectedItem,
							newSelectedItem, oldSelectedIndex, value);
					if (cancelSelect) {
						o.selectedIndex = oldSelectedIndex;
						return;
					}
					
					// if the data option is reset and the self.selectedItem is underfined, 
					// need use oldSelectedIndex to clear selection
					if (oldSelectedIndex !== null && oldSelectedIndex !== -1 && 
							oldSelectedIndex !== undefined && oldSelectedItem) {
						oldSelectedItem.selected = false;
						if (oldSelectedItem.element) {
							oldSelectedItem.element.removeClass("wijmo-wijcombobox-selecteditem");
						}
					}

					if (items && items[value] !== null) {
						self.selectedItem = items[value];
						if (self.selectedItem) {
							self.selectedItem.selected = true;
							//self._input.val(self.selectedItem.label);
							self._setInputText(self.selectedItem.label);
							o.selectedValue = self.selectedItem.value;
							o.inputTextInDropDownList = true;
							o.text = self._input.val();
						}
					}
				} else if (value <= -1 || !value) {
					cancelSelect = self._triggerSelectedIndexChanging(items[oldSelectedIndex],
							null, oldSelectedIndex, value);
					if (cancelSelect) {
						o.selectedIndex = oldSelectedIndex;
						return;
					}
					o.inputTextInDropDownList = false;
					self._clearSelection();
				}	
				
				self._trigger("changed", null, {
					oldItem: oldSelectedItem,
					selectedItem: self.selectedItem,
					newIndex: o.selectedIndex,
					oldIndex: oldSelectedIndex
				});
				self._triggerSelectedIndexChanged(oldSelectedItem,
						self.selectedItem, oldSelectedIndex, o.selectedIndex);
			}
			else if (key === "selectedValue") {
				if (value) {
					if (self.selectedItem &&
							self.selectedItem.selected !== undefined) {
						self.selectedItem.selected = false;
					}
					items = self.items;
					if (!items) {
						items = self.innerData;
					}
					$.each(items, function (index, item) {
						if (items[index].value === value) {
							self.selectedItem = items[index];
							self.selectedItem.selected = true;
							//self._input.val(self.selectedItem.label);
							self._setInputText(self.selectedItem.label);
							self.options.selectedIndex = index;
							o.inputTextInDropDownList = true;
							o.text = self._input.val();
							return false;
						}
					});
				} else {
					o.inputTextInDropDownList = false;
					self._clearSelection();
				}
			} else if (key === "text") {
				if (o.forceSelectionText && 
						self._checkTextInItems(value) === -1) {
					return;
				}
				//self._input.val(value);
				self._setInputText(value);
			}
		},
		
		_setSelectedIndex: function (value) {
			var self = this, o = self.options;
			if (value === null ||
					value === undefined) {
				return;
			}
			
			if (value === -1) {
				self.selectedItem = null;
				o.selectedIndex = -1;
				o.selectedValue = null;
				if (o.text) {
					self._input.val(o.text);
				} else {
					self._input.val("");
				}
			} else {
				if (self.innerData && 
						self.innerData[value] !== null &&
						self.innerData[value] !== undefined) {
					self.innerData[value].selected = true;
					self._input.val(self.innerData[value].label);
					self.selectedItem = self.innerData[value];
				} else if (self.innerData &&
						$.isArray(self.innerData) && 
						value > self.innerData.length - 1) {
					o.selectedIndex = -1;
					self._input.val("");
				}
			}
			o.text = self._input.val();
		},

		search: function (value, eventObj) {
			/// <summary>
			/// Searches the wijcombobox drop-down list for the given value.
			/// Code example: $("#tags").wijcombobox("search", "C++");
			/// </summary>
			/// <param name="value" type="String">
			/// Text to search in the drop-down list
			/// </param>
			/// <param name="eventObj" type="Object">
			/// The jquery event object.
			/// </param>

			var self = this, o, datasource, d,
			isBind;

			o = self.options;
			//datasource = o.data;
			datasource = self.innerData;
			window.clearTimeout(self.closing);
			d = {
				value: value,
				e: eventObj,
				self: self
			};

			// load data when data is not loaded yet 
			// or datasource is using a proxy to obtain data.
			if (datasource !== null || self._comboDiv) {
				//update 2012/9/14
				isBind = self._isBind();
				
				// check index will skip search event
				if (eventObj !== "checkindex") {
					if (self._trigger("search", eventObj,
					{ datasrc: datasource, term: d }) === false) {
						return;
					}
				}
				
				if ($.isArray(datasource) ||
						 isBind ||
						 self._comboDiv) {
					self._hideShowArrow(false);
					self._onListLoaded(datasource, d);
				} else if (!isBind && $.isArray(o.dataSource)) {
					return;
				} else {
					if (self._usingRemoteData() &&
					eventObj !== undefined && value.length < o.minLength) {
						return;
					}
					self._hideShowArrow(false);
					// update for: datasource loaded event don't fired
					// in combobox
					datasource.loaded = function (e, data) {
						//need to re initialize the dropdown list
						//datasource condition the data is get by proxy
						self.listHasCreated = false;
						self._createDropDownList(e);
						self._onListLoaded(e, data);
						if (self.originalDataSourceLoaded) {
							self.originalDataSourceLoaded(e, data);
						}
					};
					datasource.load(d);
				}
			}
		},
		
		getSelectedItems: function () {
			///	<summary>
			///	Get the select item(s) in combobox; when using
			/// multiple mode, it will return array object.
			/// If no item is selected, it will return null or empty array.
			/// Code example: $("#element").wijcombobox("getSelectedItems");
			///	</summary>
			
			var o = this.options;
			if (o.selectionMode === "single") {
				return this.selectedItem;
			} else {
				return this.selectedItems;
			}
		},
		
		//for bind data
		_isBind: function () {
			var o = this.options,
			data = o.data;
			
			if (data !== null && 
					data.label &&
					data.label.bind) {
				return true;
			}
			return false;
		},
		
		_getMappingItems: function () {
			var o = this.options, dataSource = o.dataSource, data = o.data,
			mappingItems, labelKey, valueKey;
			if (!dataSource || !data) {
				return null;
			}
			
			if (!data.label || !data.label.bind ||
					!data.value || !data.value.bind) {
				return null;
			}
			
			labelKey = data.label.bind;
			valueKey = data.value.bind;
			
			//1.Array
			if (dataSource && dataSource.length !== 0) {
				mappingItems = [];

				$.each(dataSource, function (i, item) {
					mappingItems.push({label: item[labelKey], value: item[valueKey]});
				});
				
				return mappingItems;
			}
			return null;
		},
		//end for bind data

		_clearSelection: function () {
			var self = this, o = self.options;
			
			if (o.selectionMode === "single") {
				if (self.selectedItem !== null) {
					self.selectedItem.selected = false;
				}
				self.selectedItem = null;
			} else {
				if (self.selectedItems) {
					$.each(self.selectedItems, function (index, item) {
						if (item.selected) {
							item.selected = false;
						}
					});
					self.selectedItem = null;
					self.selectedItems = null;
				}
			}
			o.selectedValue = null;
			//self._input.val("");
			self._setInputText("");
			o.text = self._input.val();
		},
		
		_usingRemoteData: function () {
			var o = this.options.data, r = false;
			if (!$.isArray(o) && o !== null && o.proxy) {
				r = true;
			}
			return r;
		},

		_hideShowArrow: function (show) {
			// hide arrow to show
			var self = this, input, arrow;

			input = self.element;
			arrow = self._triggerArrow;
			if (arrow !== undefined) {
				arrow[show ? "show" : "hide"]();
			}
			input[show ? "removeClass" : "addClass"]("wijmo-wijcombobox-loading");
		},

		_onListLoaded: function (datasource, data) {
			var self = data.self, ele, o, searchTerm, items, idx, itemsToRender;

			ele = self._input;
			o = self.options;
			searchTerm = data.value;
			if (datasource === null) {
				items = null;
			} else {
				items = $.isArray(datasource) ? datasource : datasource.items;
			}
			
			self.items = items;
			if (data.e === "checkindex") {
				idx = o.selectedIndex;

				if (o.selectionMode === "multiple" && $.isArray(idx)) {
					$.each(idx, function (i, n) {
						var itm = items[n];
						itm.selected = true;
						self.selectedItems.push(itm);
					});
					self._selectedItemsToInputVal(self.selectedItems);
				}
				else {
					items[idx].selected = true;
					self.selectedItem = items[idx];
					ele.val(self.selectedItem.label);
				}
				self._hideShowArrow(true);
				return;
			}
			// only fileter result when using local data.
			if (!self._usingRemoteData() && items) {
				/*update for improving performance
				self._filter(items, searchTerm);
				itemsToRender = $.grep(items, function (item1) {
					return !o.autoFilter || item1.match;
				});*/
				itemsToRender = items;
			}
			else {
				self._topHit = null;
				itemsToRender = items;
			}
			if ((itemsToRender && itemsToRender.length > 0) || self._comboDiv) {
				// open dropdown list
				self._openlist(itemsToRender, data, searchTerm);
				// move the trigger dropdown open event to openlist.
				//self._trigger("open");
				self._addInputFocus(true, stateFocus);
			}
			else {
				self.close(null, true);
			}
			self._hideShowArrow(true);
		},

		close: function (event, skipAnimation) {
			/// <summary>
			/// Closes drop-down list.
			/// Code example: $("#tags").wijcombobox("close", null, false);
			/// </summary>
			/// <param name="event" type="EventObj">
			/// The jquery event object.
			/// </param>
			/// <param name="skipAnimation" type="Boolean">
			/// A value indicating whehter to skip animation.
			/// </param>
			var self = this, menu, hidingAnimation, hidingStyle;
			menu = self.menu;

			self._dropDownHeight = menu.element.outerHeight();
			self._dropDownWidth = menu.element.outerWidth();

			window.clearTimeout(self.closing);
			// test parent element is need, hidingAnimation
			// because some effect will wrap the target element.
			if (menu.element.is(":visible") && !menu.element.is(":animated") &&
				!menu.element.parent().is(":animated")) {
				self._trigger("close", event);
				menu.deactivate();
				hidingAnimation = self.options.hidingAnimation;
				//add for size animation by wuhao 2011/7/16
				if (hidingAnimation && (hidingAnimation.effect === "size" ||
						hidingAnimation.animated === "size")) {
					hidingAnimation.options = $.extend({
						to: {
							width: 0,
							height: 0
						}
					}, hidingAnimation.options);
				}
				hidingStyle = menu.element.attr("style");
				//end for size animation
				if (skipAnimation !== true && hidingAnimation) {
					menu.element.hide(
					hidingAnimation.effect || hidingAnimation.animated,
					hidingAnimation.options,
					hidingAnimation.speed || hidingAnimation.duration,
						function () {
						menu.element.removeAttr("style")
										.attr("style", hidingStyle)
										.hide();
						if (hidingAnimation.callback) {
							hidingAnimation.callback.apply(this, arguments);
						}
					});
				}
				else {
					menu.element.hide();
				}

				self._addInputFocus(false, stateFocus);
				
				//$(document).unbind("click", self.closeOnClick);
				$(document).unbind("mouseup", self.closeOnClick);
			}
		},

		_change: function () {
			// TODO: finish _change event.
			var self = this, o, f, m, ele, t, itm, items, 
			oldIndex, innerData,
			inputIndex = -1;

			o = self.options;
			f = o.forceSelectionText;
			m = o.selectionMode;
			ele = self._input;
			t = ele.val();
			itm = self.selectedItem;
			items = self.selectedItems;
			oldIndex = o.selectedIndex ? o.selectedIndex : -1;
			innerData = self.innerData;

			if (f) {
				if (m === "single") {
					if (itm !== null) {
						if (itm.label !== t) {
							ele.val(itm.label);
						}
					}
					else {
						ele.val("");
					}
				}
			} else {
				//update for inputed non-listed value, 
				//update selected index and selected value 
				if (m === "single") {
					if ((!itm && t !== "") || (itm !== null && itm.label !== t)) {
						if (self.selectedItem !== null) {
							self.selectedItem.selected = false;
						}
						inputIndex = self._checkTextInItems(t);
						if (inputIndex === -1) {
							self.selectedItem = null;
							o.selectedIndex = -1;
							o.selectedValue = null;
							o.inputTextInDropDownList = false;
						} else {
							if (innerData) {
								self.selectedItem = innerData[inputIndex];
								o.selectedIndex = inputIndex;
								o.selectedValue = self.selectedItem.value;
								o.inputTextInDropDownList = true;
							}
						}
						o.text = self._input.val();
						self._trigger("changed", null, {
							oldItem: itm,
							selectedItem: self.selectedItem,
							newIndex: o.selectedIndex,
							oldIndex: oldIndex
						});
						if (oldIndex !== inputIndex) {
							self._triggerSelectedIndexChanged(itm,
									self.selectedItem, oldIndex, o.selectedIndex);
						}
					}	
				}
			}
			//Todo: when input something to combobox, 
			//the text will restore in multiple mode
			//Maybe it need to be adjusted.
			if (m === "multiple") {
				//update for add issue: when iseditable is false
				//click the all the combobox, the dropdown list will open
				//self._selectedItemsToInputVal(self.selectedItems);
				if (!self.selectedItems || self.selectedItems.length === 0) {
					items = [itm];
				}
				self._selectedItemsToInputVal(items);
			}
		},
		
		_checkTextInItems: function (text) {
			var self = this, index = -1,
			data = self.innerData;
			
			if (text) {
				$.each(data, function (i, item) {
					if (data[i] && data[i].label && 
							data[i].label === text) {
						index = i;
						return false;
					}
				});
			}
			
			return index;
		},

		_openlist: function (items, data, searchTerm) {
			var self = data.self, eventObj = data.e, keypress, textWidth, menuElement,
			o, oldPadding, verticalBorder = 2, headerHeight = 0, dropDownHeight, 
			origCloseOnClick, h, showingAnimation, showingStyle, showingSize, 
			inputValueLength = $.trim(self._input.val()).length,
			zIndex = parseInt(self.element.css("z-index"), 10),
			needHighlightMatching = false;
			
			keypress = self._keypress = !!eventObj;
			o = self.options;
			menuElement = self.menu.element;
			//menuElement.zIndex(self.element.zIndex() + 100);
			if (isNaN(zIndex)) {
				zIndex = 0;
			}
			menuElement.zIndex(zIndex + 100);
			
			//update for 32309 issue
			if (!self.listHasCreated) {
				self._createDropDownList();
			}
			/* for improving performance
			if (self._comboDiv) {
				//update for case 20689 at 2012/4/11
				if (!self.listHasCreated) {
					//update for issue 24130 at 2012/7/20
					//self.menu.setTemplateItems(items);	
					self.menu.setTemplateItems(o.data);
					self.menu.renderList();
					self.listHasCreated = true;
				}
			} else {
				if (!self.listHasCreated) {
					self.menu.setItems(items);
					self.menu.renderList();
					self.listHasCreated = true;
				} 
			}*/
			
			//update for issue 24130 at 2012/7/20
			if (!self._usingRemoteData() && searchTerm !== null && searchTerm !== undefined) {
				needHighlightMatching = self._keypress && o.isEditable &&
				o.columns.length === 0 && o.highlightMatching &&
				inputValueLength > 0;

                //if down key press condition for 33017 issue at 2013/1/8
				if (eventObj && eventObj.keyCode === $.ui.keyCode.DOWN && 
						searchTerm.length === 0 && 
						inputValueLength > 0) {
					self._topHit = self.menu.filterItems(self._input.val(), false, 
							needHighlightMatching);
				} else {
					self._topHit = self.menu.filterItems(searchTerm, o.autoFilter, 
							needHighlightMatching);
				}

				//can't find the matched items 
				if (self._topHit === null &&
						self.innerData &&
						$("li[wijhidden]", self.menu.element).length === 
					self.innerData.length) {
					self.close(null, true);
					return false;
				}
			}				
			
			// show dropdown
			self.menu.element.show();
			if (o.dropdownWidth === "auto") {
				textWidth = self._comboElement.outerWidth();
			}
			else {
				textWidth = o.dropdownWidth;
			}
			oldPadding = menuElement.css("padding");
			menuElement.css("padding", "0px");
			menuElement.setOutWidth(textWidth);
			menuElement.css("padding", oldPadding);

			dropDownHeight = o.dropdownHeight;
			
			if (menuElement.children(".wijmo-wijsuperpanel-header")) {
				headerHeight = menuElement
					.children(".wijmo-wijsuperpanel-header").outerHeight() || 0;
			}
			//end for fixing bug 15778
			h = Math.min(self._menuUL.outerHeight() + verticalBorder + headerHeight, 
				dropDownHeight);
			menuElement.setOutHeight(h);
			self.menu.refreshSuperPanel();
			self._positionList();
			if (!keypress && self.selectedItem !== undefined) {
				self.menu.activate(null, self.selectedItem, true);
			}
			if (keypress && eventObj.keyCode !== $.ui.keyCode.BACKSPACE) {
				if (o.isEditable) {
					self._runAutoComplete();
				}
				else {
					self.menu.activate(null, self._topHit, true);
				}
			}
			else {
				showingAnimation = self.options.showingAnimation;
				if (o.showingAnimation !== null &&
				!(eventObj !== undefined &&
				eventObj.keyCode === $.ui.keyCode.BACKSPACE)) {
					self.menu.element.hide();
					showingSize = {
						from: { width: 0, height: 0 },
						to: { width: self._dropDownWidth || menuElement.outerWidth(),
							height: self._dropDownHeight || menuElement.outerHeight()
						}
					};
					if (showingAnimation && (showingAnimation.effect === "size" || 
							showingAnimation.animated === "size")) {
						showingAnimation.options = 
							$.extend(showingSize, showingAnimation.options);
					}
					showingStyle = menuElement.attr("style");
					//end for size animation
					menuElement.show(
					//update for modify animation name by wh at 2011/9/26		
					//showingAnimation.effect,
					showingAnimation.effect || showingAnimation.animated,
					showingAnimation.options,
					showingAnimation.speed || showingAnimation.duration,
					function () {
						//add for size animation by wuhao 2011/7/16
						menuElement.removeAttr("style")
										.attr("style", showingStyle)
										.show();
						//end for size animation
						if (showingAnimation.callback) {
							showingAnimation.callback.apply(this, arguments);
						}

						if ($.browser.msie) {
							menuElement.css("filter", "");
						}
					});
				}
			}
			if (!self.hasOwnProperty("closeOnClick")) {
				origCloseOnClick = self.closeOnClick;
				self.closeOnClick = function (e) {
					return origCloseOnClick(e);
				};
			}
			
			self._trigger("open");
			//update for issue 2012/6/14: place combobox in expander
			//open the dropdown, then collapse the expander
			//the dropdown is still open
			//$(document).bind("click", self, self.closeOnClick);
			$(document).bind("mouseup", self, self.closeOnClick);
			return true;
		},

		closeOnClick: function (e) {
			var self = e.data, t = e.target;

			if (!$.contains(self._comboElement[0], t) &&
			!$.contains(self.menu.element[0], t)) {
				self.close();
				$(".wijmo-wijcombobox-wrapper", self._comboElement[0])
				.removeClass("ui-state-hover")
				.removeClass("ui-state-focus");
				$(".wijmo-wijcombobox-trigger", self._comboElement[0])
				.removeClass("ui-state-hover")
				.removeClass("ui-state-focus");
			}
		},

		_positionList: function () {
			var self = this, positionOptions, defaultPosition;
			positionOptions = self.options.dropDownListPosition;
			defaultPosition = {
				my: "left top",
				at: "left bottom",
				of: self._comboElement,
				collision: "none"
			};
			defaultPosition = $.extend(defaultPosition, positionOptions);
			self.menu.element.position(defaultPosition);
		},

		_runAutoComplete: function () {
			var self = this, ele, topHit, oldText, fullText, start, end;
			ele = self._input;
			topHit = self._topHit;
			if (!self.options.autoComplete || 
					topHit === null ||
					topHit === undefined) {
				return;
			}
			self.menu.activate(null, topHit, true);
			oldText = ele.val();
			fullText = topHit.label;
			ele.val(fullText);
			start = oldText.length;
			end = fullText.length;
			self._selectText(start, end, ele);
		},

		_selectText: function (start, end, input) {
			var v = input.val(), inputElement = input.get(0), range;
			if (v.length > 0) {
				if (inputElement.setSelectionRange !== undefined) {
					inputElement.setSelectionRange(start, end);
				}
				else if (inputElement.createTextRange !== undefined) {
					range = inputElement.createTextRange();
					range.moveStart("character", start);
					range.moveEnd("character", end - v.length);
					range.select();
				}
			}
		},

		_move: function (direction, event) {
			if (!this.menu.element.is(":visible")) {
				this.search("", event);
				return;
			}
			if (this.menu.first() && /^previous/.test(direction) ||
			this.menu.last() && /^next/.test(direction)) {
				//update for fixing bug 15964 by wuhao
				//this.menu.deactivate();
				//end for bug 15964.
				return;
			}
			this.menu[direction](event);
		},

		_escapeRegex: function (value) {
			if (value === undefined) {
				return value;
			}
			return value.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1");
		},

		_filter: function (array, searchTerm) {
			var term1 = this._escapeRegex(searchTerm), matcher, topHit = null;
			/// TODO : start with or contains and case sensitive.
			if (!array) {
				return null;
			}
			matcher = new RegExp(term1, "i");
			$.each(array, function (index, item) {
				if (term1 === undefined || term1.length === 0) {
					item.match = true;
					return;
				}
				var matchResult = matcher.exec(item.label);
				if (matchResult === null) {
					item.match = false;
				}
				else {
					if (topHit === null && matchResult.index === 0) {
						topHit = item;
					}
					item.match = matchResult.index >= 0;
				}
			});
			this._topHit = topHit;
			return array;
		}
	});
} (jQuery));
