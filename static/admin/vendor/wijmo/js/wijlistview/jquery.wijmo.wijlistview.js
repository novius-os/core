/*
 *
 * Wijmo Library 3.20133.20
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Dual licensed under the MIT or GPL Version 2 licenses.
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
    /// <reference path="../Base/jquery.wijmo.widget.ts" />
    /*globals jQuery*/
    /*
    * Depends:
    *  jquery.mobile.js
    *
    */
    (function (listview) {
        "use strict";
        var $ = jQuery, widgetName = "wijlistview";
        /** wijlistview is inherited from jQuery Mobile listview, so all its options and methods apply:
        * http://api.jquerymobile.com/listview/
        * @widget
        * @extends jQuery.mobile.listview
        */
        var wijlistview = (function (_super) {
            __extends(wijlistview, _super);
            function wijlistview() {
                _super.apply(this, arguments);

            }
            wijlistview.prototype._baseWidget = function () {
                return $.mobile.listview;
            };
            wijlistview.prototype._getListViewFromData = function () {
                return this.element.data("wijmoWijlistview");
            };
            wijlistview.prototype._create = function () {
                var listview = this._getListViewFromData();
                if($.mobile.version.slice(0, 4) == "1.2.") {
                    this.element.data("listview", listview);
                } else {
                    this.element.data("mobile-listview", listview);
                }
                // add an css class for binding the event to document.
                this.element.addClass("wijmo-wijlistview");
                _super.prototype._create.call(this);
                var dataContent = this.element.closest("div[data-role='content']");
                if(!(dataContent && dataContent.length > 0)) {
                    this.element.wrap("<div data-role='content' class='ui-content' />");
                }
            };
            return wijlistview;
        })(wijmo.wijmoWidget);
        listview.wijlistview = wijlistview;        
        // empty so far
        if($.mobile) {
            wijlistview.prototype.widgetName = "wijlistview";
            wijlistview.prototype.widgetEventPrefix = "listview";
            wijlistview.prototype.options = $.extend({
            }, $.mobile.listview.prototype.options, wijmo.wijmoWidget.prototype.options, {
                initSelector: ":jqmData(role='wijlistview')"
            });
            $.wijmo.registerWidget(widgetName, $.mobile.listview, wijlistview.prototype);
            // Modify code for listview filter feature when using jqm1.2.0 .
            // Also added code for filter-reveal feature.
            if($.mobile.version.slice(0, 4) == "1.2.") {
                wijlistview.prototype.options.filter = false;
                wijlistview.prototype.options.filterPlaceholder = "Filter items...";
                wijlistview.prototype.options.filterTheme = "c";
                wijlistview.prototype.options.filterReveal = false;
                // TODO rename callback/deprecate and default to the item itself as the first argument
                var defaultFilterCallback = function (text, searchValue, item) {
                    return text.toString().toLowerCase().indexOf(searchValue) === -1;
                };
                wijlistview.prototype.options.filterCallback = defaultFilterCallback;
                $(document).delegate("ul.wijmo-wijlistview,ol.wijmo-wijlistview", "listviewcreate", function () {
                    var list = $(this), listview = list.data("listview");
                    if(!listview.options.filter) {
                        return;
                    }
                    if(listview.options.filterReveal) {
                        list.children().addClass("ui-screen-hidden");
                    }
                    var wrapper = $("<form>", {
                        "class": "ui-listview-filter ui-bar-" + listview.options.filterTheme,
                        "role": "search"
                    }), search = $("<input>", {
                        placeholder: listview.options.filterPlaceholder
                    }).attr("data-" + $.mobile.ns + "type", "search").jqmData("lastval", "").bind("keyup change", function () {
                        var $this = $(this), val = this.value.toLowerCase(), listItems = null, lastval = $this.jqmData("lastval") + "", childItems = false, itemtext = "", item, isCustomFilterCallback = // Check if a custom filter callback applies
                        listview.options.filterCallback !== defaultFilterCallback;
                        listview._trigger("beforefilter", "beforefilter", {
                            input: this
                        });
                        // Change val as lastval for next execution
                        $this.jqmData("lastval", val);
                        if(isCustomFilterCallback || val.length < lastval.length || val.indexOf(lastval) !== 0) {
                            // Custom filter callback applies or removed chars or pasted something totally different, check all items
                            listItems = list.children();
                        } else {
                            // Only chars added, not removed, only use visible subset
                            listItems = list.children(":not(.ui-screen-hidden)");
                            if(!listItems.length && listview.options.filterReveal) {
                                listItems = list.children(".ui-screen-hidden");
                            }
                        }
                        if(val) {
                            // This handles hiding regular rows without the text we search for
                            // and any list dividers without regular rows shown under it
                            for(var i = listItems.length - 1; i >= 0; i--) {
                                item = $(listItems[i]);
                                itemtext = item.jqmData("filtertext") || item.text();
                                if(item.is("li:jqmData(role=list-divider)")) {
                                    item.toggleClass("ui-filter-hidequeue", !childItems);
                                    // New bucket!
                                    childItems = false;
                                } else if(listview.options.filterCallback(itemtext, val, item)) {
                                    //mark to be hidden
                                    item.toggleClass("ui-filter-hidequeue", true);
                                } else {
                                    // There's a shown item in the bucket
                                    childItems = true;
                                }
                            }
                            // Show items, not marked to be hidden
                            listItems.filter(":not(.ui-filter-hidequeue)").toggleClass("ui-screen-hidden", false);
                            // Hide items, marked to be hidden
                            listItems.filter(".ui-filter-hidequeue").toggleClass("ui-screen-hidden", true).toggleClass("ui-filter-hidequeue", false);
                        } else {
                            //filtervalue is empty => show all
                            listItems.toggleClass("ui-screen-hidden", !!listview.options.filterReveal);
                        }
                        listview._refreshCorners();
                    }).appendTo(wrapper).textinput();
                    if(listview.options.inset) {
                        wrapper.addClass("ui-listview-filter-inset");
                    }
                    wrapper.bind("submit", function () {
                        return false;
                    }).insertBefore(list);
                });
            }
        }
    })(wijmo.listview || (wijmo.listview = {}));
    var listview = wijmo.listview;
})(wijmo || (wijmo = {}));
