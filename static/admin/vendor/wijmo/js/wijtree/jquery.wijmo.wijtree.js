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
    /// <reference path="../Base/jquery.wijmo.widget.ts" />
    /// <reference path="../wijtextbox/jquery.wijmo.wijtextbox.ts" />
    /// <reference path="../wijutil/jquery.wijmo.wijutil.ts" />
    /*globals jQuery, window, XMLHttpRequest*/
    /*
    * Depends:
    *   jquery.ui.core.js
    *   jquery.ui.widget.js
    */
    (function (tree) {
        "use strict";
        var $ = jQuery, widgetName = "wijtree", generateMarkup = function (item) {
            if(!$.isPlainObject(item)) {
                return;
            }
            var u = item.navigateUrl || "#", li = "<li><a href='" + u + "'>";
            if(typeof item.text === "string" && item.text) {
                li += "<span>" + item.text + "</span>";
            }
            li += "</a></li>";
            return li;
        }, generateItemsMarkup = function (items) {
            var lis = "";
            $.each(items, function (i, item) {
                if(!$.isPlainObject(item)) {
                    return true;
                }
                var u = item.navigateUrl || "#", hasChildren = item.nodes && item.nodes.length > 0, li = "<li><div class='wijmo-wijtree-node'><span class='wijmo-wijtree-inner'>";
                if(hasChildren) {
                    li += "<span class='wijmo-wijtree-hitarea'></span>";
                }
                li += "<span class='wijmo-wijtree-nodeimage'></span><a href='" + u + "'>";
                if(typeof item.text === "string" && item.text) {
                    li += "<span>" + item.text + "</span>";
                }
                li += "</a></span></div>";
                if(hasChildren) {
                    li += "<ul>";
                    li += generateItemsMarkup(item.nodes);
                    li += "</ul>";
                }
                li += "</li> ";
                lis += li;
            });
            return lis;
        };
        /** @widget */
        var wijtree = (function (_super) {
            __extends(wijtree, _super);
            function wijtree() {
                _super.apply(this, arguments);

            }
            wijtree.prototype._create = function () {
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                this._useDOMInit = true;
                this._initState();
                this._createTree();
                this._attachEvent();
                this._attachNodeEvent();
            };
            wijtree.prototype._setOption = function (key, value) {
                var self = this, isResetHitArea = false, o = self.options, check, node;
                switch(key) {
                    case "allowDrag":
                        self._setAllowDrag(value);
                        break;
                    case "allowDrop":
                        self._setAllowDrop(value);
                        break;
                    case "showCheckBoxes":
                        self._setCheckBoxes(value);
                        break;
                    case "showExpandCollapse":
                        if(self.options.showExpandCollapse !== value) {
                            isResetHitArea = true;
                        }
                        break;
                    case "disabled":
                        check = self.element.find(":wijmo-wijtreecheck");
                        if(check.length) {
                            check.wijtreecheck("option", "disabled", value);
                        }
                        self._setAllowDrag(!value);
                        break;
                    default:
                        break;
                }
                $.Widget.prototype._setOption.apply(self, arguments)//use Widget disable
                ;
                if(key === "nodes") {
                    if(value && value.length) {
                        self._useDOMInit = false;
                    }
                    self._createChildNodes();
                }
                if(isResetHitArea === true) {
                    self._setHitArea(value);
                }
            };
            wijtree.prototype._initState = function () {
                //declare the properties of tree
                                var self = this, o = self.options;
                self._selectedNodes = [];
                self._checkedNodes = [];
                if(!o.nodes) {
                    o.nodes = [];
                }
                if(o.nodes && o.nodes.length) {
                    self._useDOMInit = false;
                }
                self._insertPosition = "unKnown"//end,after,before
                ;
                self.nodeWidgetName = "wijtreenode";
            };
            wijtree.prototype._createTree = function () {
                //create by dom
                                var self = this, o = self.options, nodes = [], treeClass = [
                    "wijmo-wijtree", 
                    o.wijCSS.widget, 
                    o.wijCSS.content, 
                    o.wijCSS.helperClearFix, 
                    o.wijCSS.cornerAll
                ].join(' ');
                if(self.element.is("ul")) {
                    self.$nodes = self.element;
                    self.element.wrap("<div></div>");
                    self.widgetDom = self.element.parent();
                } else if(self.element.is("div")) {
                    self.widgetDom = self.element;
                    self.$nodes = self.widgetDom.children("ul:eq(0)");
                }
                if(self.$nodes.length) {
                    self.widgetDom.addClass(treeClass).attr({
                        role: "tree",
                        "aria-multiselectable": true
                    });
                    self.$nodes.addClass("wijmo-wijtree-list " + o.wijCSS.helperReset + (o.showExpandCollapse ? "" : " wijmo-wijtree-allexpanded"));
                    self._createChildNodes();
                    self.widgetDom.append($("<div>").css("clear", "both"));
                }
                if(o.disabled) {
                    self.disable();
                }
            };
            wijtree.prototype._createChildNodes = function () {
                var self = this, options = {
                    nIndex: undefined
                }, nodes = [], ns = self.$nodes, data = self.options.nodes, lis;
                if(!self._useDOMInit || data.length) {
                    ns.empty();
                    lis = generateItemsMarkup(data);
                    ns.html(lis);
                    self.htmlGenerated = true;
                    lis = ns.children("li");
                    lis.each(function (idx, ele) {
                        var $li = $(ele);
                        options.nIndex = idx;
                        self._createNodeWidget($li, options);
                        nodes.push(self._getNodeWidget($li));
                    });
                    self.htmlGenerated = false;
                } else {
                    lis = ns.children("li");
                    lis.each(function (idx, ele) {
                        var $li = $(ele), w;
                        self._createNodeWidget($li, options);
                        w = self._getNodeWidget($li);
                        nodes.push(w);
                        data.push(w.options);
                    });
                }
                self._hasChildren = nodes.length > 0;
                self._setField("nodes", nodes);
                self.nodes = nodes;
            };
            wijtree.prototype._createNodeWidget = function ($li, options) {
                var self = this, nodeWidgetName = self.nodeWidgetName;
                if($.fn[nodeWidgetName]) {
                    $li.data("owner", this);
                    if(!!options && $.isPlainObject(options)) {
                        $.extend(options, {
                            treeClass: this.widgetFullName
                        });
                        $li[nodeWidgetName](options);
                    } else {
                        $li[nodeWidgetName]({
                            treeClass: this.widgetFullName
                        });
                    }
                }
                return $li;
            };
            wijtree.prototype._attachEvent = /*tree event*/
            function () {
                var self = this;
                self.element.bind($.browser.msie ? "focusin." : "focus." + self.widgetName, $.proxy(self._onFocus, self)).bind("mouseover." + this.widgetName, $.proxy(self._onMouseOver, self));
                if(self.options.allowDrop) {
                    self._attachDroppable();
                }
            };
            wijtree.prototype._attachDroppable = function () {
                var self = this, o = self.options, options = {
                    accept: "li",
                    scope: "tree",
                    drop: undefined
                }, setTriState = function (node) {
                    if(o.showCheckBoxes && o.allowTriState && !node.element.is(":" + self.widgetFullName) && node._getField("nodes").length > 0) {
                        node._getField("nodes")[0]._setParentCheckState();
                    }
                }, droppable = o.droppable;
                $.extend(options, droppable);
                options.drop = function (event, ui) {
                    var d = ui.draggable, dragNode = self._getNodeWidget(d), dropNode, position, oldOwner, parent, brothers, idx, oldPosition, newPosition = -1;
                    if(self._trigger("nodeBeforeDropped", event, ui) === false || !dragNode || o.disabled) {
                        self._isDragging = false;
                        return;
                    }
                    dropNode = dragNode._dropTarget;
                    position = dragNode._insertPosition;
                    if(dropNode && position !== "unKnown") {
                        oldOwner = d.data("owner");
                        if(oldOwner) {
                            oldPosition = d.index();
                        }
                        if(position === "end") {
                            newPosition = dropNode._getField("nodes").length;
                            parent = dropNode;
                        } else if(position === "before" || position === "after") {
                            parent = dropNode._getField("owner");
                            brothers = parent._getField("nodes");
                            idx = $.inArray(dropNode, brothers);
                            if(idx !== -1) {
                                newPosition = position === "before" ? idx : idx + 1;
                            }
                        }
                        if(droppable && $.isFunction(droppable.drop)) {
                            ui.oldParent = oldOwner.element;
                            ui.newParent = parent.element;
                            ui.oldIndex = oldPosition;
                            ui.newIndex = newPosition;
                            droppable.drop.call(self.element, event, ui);
                        } else {
                            if(oldOwner) {
                                oldOwner.remove(d);
                            }
                            if(newPosition !== -1) {
                                // re-calculate position (when old parent== new parent)
                                if(position === "before" || position === "after") {
                                    if(idx != $.inArray(dropNode, brothers)) {
                                        newPosition--;
                                    }
                                }
                                // Handling when the drop tree has no child-nodes
                                if(self.$nodes.children("li").length) {
                                    parent.add(d, newPosition);
                                } else {
                                    self.add(d, newPosition);
                                }
                            }
                        }
                        /*reset old tree*/
                        $("a:eq(0)", d).blur();
                        dragNode._tree._isDragging = false;
                        if(dragNode.options.selected) {
                            dragNode._setSelected(false);
                        }
                        /*set tree*/
                        setTriState(oldOwner);
                        setTriState(parent);
                        $.extend(ui, {
                            sourceParent: oldOwner ? oldOwner.element : null,
                            sIndex: oldPosition,
                            targetParent: parent.element,
                            tIndex: newPosition,
                            widget: dragNode
                        });
                        self._trigger("nodeDropped", event, ui);
                    }
                };
                if($.fn.droppable) {
                    self.widgetDom.droppable(options);
                }
            };
            wijtree.prototype._attachNodeEvent = function () {
                this.element.bind("click." + this.widgetName, $.proxy(this._onClick, this)).bind("mouseout." + this.widgetName, $.proxy(this._onMouseOut, this)).bind("keydown." + this.widgetName, $.proxy(this._onKeyDown, this));
            };
            wijtree.prototype._onClick = function (event) {
                this._callEvent(event, '_onClick');
                if($.browser.webkit) {
                    this.widgetDom.focus();
                }
            };
            wijtree.prototype._onFocus = function (event) {
                this._callEvent(event, '_onFocus');
            };
            wijtree.prototype._onKeyDown = function (event) {
                this._callEvent(event, '_onKeyDown');
            };
            wijtree.prototype._onMouseOut = function (event) {
                this._callEvent(event, '_onMouseOut');
            };
            wijtree.prototype._onMouseOver = function (event) {
                this._callEvent(event, '_onMouseOver');
            };
            wijtree.prototype._callEvent = function (event, type) {
                var el = event.target, node;
                if(el) {
                    node = this._getNodeWidgetByDom(el);
                    if(node === null) {
                        return;
                    }
                    node[type](event);
                }
            };
            wijtree.prototype._nodeSelector = function () {
                return ":wijmo-wijtreenode";
            };
            wijtree.prototype.getSelectedNodes = /*public methods*/
            /**
            * The getSelectedNodes method gets the selected nodes.
            * @example $("selector").wijtree("getSelectedNodes");
            * @returns {array}
            */
            function () {
                return this._selectedNodes;
            };
            wijtree.prototype.getCheckedNodes = /**
            * The getCheckedNodes method gets the nodes which are checked.
            * @example $("selector").wijtree("getCheckedNodes");
            * @returns {array}
            */
            function () {
                var self = this, checkedNodes = [], nodeWidgetName = self.nodeWidgetName;
                $(self._nodeSelector(), self.element).each(function (idx, ele) {
                    if($(ele)[nodeWidgetName]("option", "checked") && $(ele)[nodeWidgetName]("option", "checkState") !== "indeterminate") {
                        checkedNodes.push($(ele));
                    }
                });
                return checkedNodes;
            };
            wijtree.prototype.destroy = /**
            * The destroy method will remove the rating functionality completely and will return the element to its pre-init state.
            * @example $("selector").wijtree("destroy");
            */
            function () {
                var self = this, $nodes = self.$nodes, o = self.options, c = [
                    "wijmo-wijtree", 
                    o.wijCSS.widget, 
                    o.wijCSS.content, 
                    o.wijCSS.helperClearFix, 
                    o.wijCSS.cornerAll
                ].join(' ');
                self.widgetDom.removeClass(c).removeAttr("role").removeAttr("aria-multiselectable");
                if(self.widgetDom.data("uiDroppable")) {
                    self.widgetDom.droppable("destroy");
                }
                self.widgetDom.children("div[style]:last").remove();
                $nodes.removeData("nodes").removeClass("wijmo-wijtree-list").removeClass(o.wijCSS.helperReset);
                $nodes.children("li").each(function (idx, ele) {
                    var nodeWidget = self._getNodeWidget($(ele));
                    if(nodeWidget) {
                        nodeWidget.destroy();
                    }
                });
                $.wijmo.wijtree.prototype.options.nodes = null;
                _super.prototype.destroy.call(this);
            };
            wijtree.prototype.add = /**
            * The add method adds a node to the tree widget.
            * @example $("#tree").wijtree("add", "node 1", 1);
            * @param {string|object} node
            * 1.markup html.such as "<li><a>node</a></li>" as a node.
            * 2.wijtreenode widget.
            * 3.object options according to the options of wijtreenode.
            * 4.node's text.
            * @param {number} position The position to insert at.
            */
            function (node, position) {
                var nodeWidget = null, o = {
                }, $node, nodes, self = this, i, originalLength, itemDom = "<li><a href='{0}'>{1}</a></li>", cnodes;
                if(typeof node === "string") {
                    $node = $(itemDom.replace(/\{0\}/, "#").replace(/\{1\}/, node));
                    self._createNodeWidget($node, o);
                    nodeWidget = $node.data($node.data("widgetName"));
                } else if(node.jquery) {
                    if(!node.data("widgetName")) {
                        self._createNodeWidget(node, o);
                    }
                    nodeWidget = node.data(node.data("widgetName"));
                } else if(node.nodeType) {
                    $node = $(node);
                    self._createNodeWidget($node, o);
                    nodeWidget = $node.data($node.data("widgetName"));
                } else if($.isPlainObject(node)) {
                    $node = $(itemDom.replace(/\{0\}/, node.url ? node.url : "#").replace(/\{1\}/, node.text))//node
                    ;
                    self._createNodeWidget($node, node);
                    nodeWidget = $node.data($node.data("widgetName"));
                }
                if(nodeWidget === null) {
                    return;
                }
                nodes = self._getField("nodes");
                if(!position || position > nodes.length) {
                    if(position !== 0) {
                        position = nodes.length;
                    }
                }
                cnodes = nodeWidget._getField("nodes");
                nodeWidget._tree = self;
                for(i = 0; i < cnodes.length; i++) {
                    cnodes[i]._tree = self;
                }
                nodeWidget._setField("owner", this);
                originalLength = nodes.length;
                if(originalLength > 0 && originalLength !== position) {
                    if(nodeWidget.element.get(0) !== nodes[position].element.get(0)) {
                        nodeWidget.element.insertBefore(nodes[position].element);
                    }
                } else {
                    self.$nodes.append(nodeWidget.element);
                }
                self._changeCollection(position, nodeWidget);
                nodeWidget._initNodeClass();
            };
            wijtree.prototype.remove = /**
            * The remove method removes the indicated node from the wijtree element.
            * @example $("#tree").wijtree("remove", 1);
            * @param {number|object} node
            * which node to be removed
            * 1.wijtreenode element.
            * 2.the zero-based index of which node you determined to remove.
            */
            function (node) {
                var idx = -1, nodeWidget, nodes;
                if(node && node.jquery) {
                    idx = node.index();
                } else if(typeof node === "number") {
                    idx = node;
                }
                nodes = this._getField("nodes");
                if(idx < 0 || idx >= nodes.length) {
                    return;
                }
                nodeWidget = nodes[idx];
                nodeWidget.element.detach();
                this._changeCollection(idx);
            };
            wijtree.prototype._changeCollection = function (idx, nodeWidget) {
                var nodes = this._getField("nodes"), ons = this.options.nodes;
                if(nodeWidget) {
                    nodes.splice(idx, 0, nodeWidget);
                    ons.splice(idx, 0, nodeWidget.options);
                } else {
                    nodes.splice(idx, 1);
                    ons.splice(idx, 1);
                }
            };
            wijtree.prototype.getNodes = /**
            * The getNodes method gets an array that contains the root nodes of the current tree.
            * @example $("#tree").wijtree("getNodes");
            * @return {Array}
            */
            function () {
                return this.nodes;
            };
            wijtree.prototype.findNodeByText = /**
            * The findNodeByText method finds a node by the specified node text.
            * @example $("#tree").wijtree("findNodeByText", "node 1");
            * @param {string} txt The text of which node you want to find.
            * @return {wijtreenode}
            */
            function (txt) {
                var nodes = $(".wijmo-wijtree-node a>span", this.$nodes).filter(function () {
                    return $(this).text() === txt;
                });
                if(nodes.length) {
                    return this._getNodeWidgetByDom(nodes.get(0));
                }
                return null;
            };
            wijtree.prototype._setAllowDrag = function (value) {
                var self = this, $allNodes, nodeSelector = self._nodeSelector(), nodeWidgetName = "wijmoWijtreenode";
                if(!$.fn.draggable) {
                    return;
                }
                if(value) {
                    $allNodes = self.element.find(nodeSelector);
                    $allNodes.each(function () {
                        var w = $(this).data(nodeWidgetName);
                        if(!$(this).data("uiDraggable") && !w.$navigateUrl.data("events") || !w.$navigateUrl.data("events").mousedown) {
                            w.$navigateUrl.one("mousedown", w, w._onMouseDown);
                        }
                    });
                } else {
                    $allNodes = self.element.find(nodeSelector + ":ui-draggable");
                    $allNodes.draggable("destroy");
                }
            };
            wijtree.prototype._setAllowDrop = function (value) {
                if(!$.fn.droppable) {
                    return;
                }
                if(value) {
                    if(!this.widgetDom.data("uiDroppable")) {
                        this._attachDroppable();
                    }
                } else if(this.widgetDom.droppable) {
                    this.widgetDom.droppable("destroy");
                }
            };
            wijtree.prototype._setCheckBoxes = function (value) {
                var self = this;
                self.$nodes.children("li").each(function (idx, ele) {
                    var nodeWidget = self._getNodeWidget($(ele));
                    if(nodeWidget !== null) {
                        nodeWidget._setCheckBoxes(value);
                    }
                });
            };
            wijtree.prototype._setHitArea = function (value) {
                var self = this;
                self.$nodes[value ? "addClass" : "removeClass"]("wijmo-wijtree-allexpanded");
                self.$nodes.children("li").each(function (idx, ele) {
                    var nodeWidget = self._getNodeWidget($(ele));
                    if(nodeWidget !== null) {
                        nodeWidget._setHitArea(value);
                    }
                });
            };
            wijtree.prototype._getNodeWidget = /*region methods(private)*/
            function ($node) {
                if($node.is(this._nodeSelector())) {
                    var widget = $node.data($node.data("widgetName"));
                    return widget;
                }
                return null;
            };
            wijtree.prototype._getNodeWidgetByDom = function (el) {
                var node = this._getNodeByDom(el);
                return this._getNodeWidget(node);
            };
            wijtree.prototype._getNodeByDom = function (el) {
                //Arg :Dom Element
                return $(el).closest(this._nodeSelector());
            };
            wijtree.prototype._refreshNodesClass = function () {
                var nodes = this._getField("nodes"), i;
                for(i = 0; i < nodes.length; i++) {
                    nodes[i]._initNodeClass();
                }
            };
            wijtree.prototype._getField = function (key) {
                return this.element.data(key);
            };
            wijtree.prototype._setField = function (key, value) {
                return this.element.data(key, value);
            };
            return wijtree;
        })(wijmo.wijmoWidget);
        tree.wijtree = wijtree;        
        var wijtreenode = (function (_super) {
            __extends(wijtreenode, _super);
            function wijtreenode() {
                _super.apply(this, arguments);

            }
            wijtreenode.prototype._setOption = function (key, value) {
                var self = this, check, i;
                switch(key) {
                    case "accessKey":
                        if(self.$navigateUrl !== null) {
                            self.$navigateUrl.attr("accesskey", value);
                        }
                        break;
                    case "checked":
                        self._checkState = value ? "checked" : "unChecked";
                        self._setChecked(value);
                        break;
                    case "collapsedIconClass":
                    case "expandedIconClass":
                    case "itemIconClass":
                        self.options[key] = value;
                        self._initNodeImg();
                        break;
                    case "expanded":
                        self._setExpanded(value);
                        break;
                    case "selected":
                        self._setSelected(value);
                        break;
                    case "text":
                        self._setText(value);
                        break;
                    case "toolTip":
                        self._setToolTip(value);
                        break;
                    case "navigateUrl":
                        self._setNavigateUrlHref(value);
                        break;
                    case "disabled":
                        if(self._isClosestDisabled() && value === true) {
                            return;
                        }
                        check = self.element.find(":wijmo-wijtreecheck");
                        if(check.length) {
                            check.wijtreecheck("option", "disabled", value);
                        }
                        break;
                    default:
                        break;
                }
                if(key === "nodes") {
                    self.options.nodes.length = 0;
                    $.each(value, function (i, n) {
                        self.options.nodes.push(n);
                    });
                    self.options.nodes.concat();
                    self._hasChildren = self._getChildren();
                    self._createChildNodes(self.element);
                    self._initNodeClass();
                } else {
                    $.Widget.prototype._setOption.apply(self, arguments);
                }
            };
            wijtreenode.prototype._initState = function () {
                // declare the properity of node
                this._tree = null;
                this._dropTarget = null;
                this._checkState = "unChecked"//Checked, UnChecked, Indeterminate
                ;
                this._value = this._text = this._navigateUrl = "";
                this._insertPosition = "unKnown"//end,after,before
                ;
                this._hasNodes = false//for ajax load
                ;
            };
            wijtreenode.prototype._create = function () {
                var self = this, o = self.options;
                self._initState();
                self._createTreeNode();
                self._initNode();
                self.element.data("widgetName", "wijmoWijtreenode");
                if(o.selected) {
                    self._tree._selectedNodes.push(self);
                }
                if(o.checked) {
                    self._checkState = "checked";
                    if(self.$checkBox) {
                        if(o.checkState === "indeterminate") {
                            self.$checkBox.wijtreecheck("option", "checkState", "triState");
                        } else {
                            self.$checkBox.wijtreecheck("option", "checkState", "check");
                        }
                    }
                }
            };
            wijtreenode.prototype._createTreeNode = function () {
                var $li = this.element, ownerNodes, childOpts, self = this, ownerOpts, o = self.options, nodes = [];
                this.$navigateUrl = $li.children("a");
                if(self._tree === null) {
                    self._tree = self._getTree();
                }
                if(!isNaN(o.nIndex)) {
                    ownerOpts = self._getOwner().options , childOpts = ownerOpts.nodes[o.nIndex];
                    if(childOpts && !childOpts.nodes) {
                        childOpts.nodes = [];
                    }
                    $.extend(o, childOpts);
                    ownerOpts.nodes[o.nIndex] = o;
                } else if(!o.nodes) {
                    o.nodes = [];
                }
                self.$nodeBody = null;
                self.$checkBox = null;
                self.$hitArea = null;
                self.$nodes = null;
                if(self._tree && self._tree.htmlGenerated) {
                    self.$nodeBody = $li.children(".wijmo-wijtree-node").attr({
                        role: "treeitem",
                        "aria-expanded": false,
                        "aria-checked": false,
                        "aria-selected": false
                    });
                    self.$inner = self.$nodeBody.children(".wijmo-wijtree-inner");
                    self.$inner.addClass(o.wijCSS.helperClearFix + " wijmo-wijtree-inner " + o.wijCSS.cornerAll);
                    self.$nodeImage = self.$inner.children(".wijmo-wijtree-nodeimage");
                    if(self._tree.options.showCheckBoxes === true) {
                        self.$checkBox = $("<div>");
                        self.$checkBox.insertAfter(self.$nodeImage);
                        self.$checkBox.wijtreecheck();
                    }
                    self.$navigateUrl = self.$inner.children("a");
                    self.$text = self.$navigateUrl.children("span:eq(0)");
                    self._hasChildren = self._getChildren();
                    self._createChildNodes($li);
                } else {
                    self.$nodeImage = $("<span>");
                    self.$nodeBody = $("<div>").attr({
                        role: "treeitem",
                        "aria-expanded": false,
                        "aria-checked": false,
                        "aria-selected": false
                    });
                    if(self._tree.options.showCheckBoxes === true) {
                        self.$checkBox = $("<div>");
                    }
                    if(self.$navigateUrl.length === 0) {
                        self.$navigateUrl = $li.children("div");
                        self.$navigateUrl.addClass("wijmo-wijtree-template");
                        self._isTemplate = true;
                    }
                    if(self.$navigateUrl.length === 0) {
                        self.$navigateUrl = $("<a href='#'></a>");
                    }
                    if(!self._isTemplate) {
                        self.$text = self.$navigateUrl.children("span:eq(0)");
                        if(self.$text.length === 0) {
                            self.$navigateUrl.wrapInner("<span></span>");
                            self.$text = self.$navigateUrl.children("span:eq(0)");
                        }
                    }
                    self._hasChildren = self._getChildren();
                    self.$inner = $("<span></span>").addClass(o.wijCSS.helperClearFix + " wijmo-wijtree-inner " + o.wijCSS.cornerAll);
                    self._createChildNodes($li);
                    self.$inner.append(self.$nodeImage);
                    if(self.$checkBox !== null) {
                        self.$inner.append(self.$checkBox);
                        self.$checkBox.wijtreecheck();
                    }
                    self.$inner.append(self.$navigateUrl);
                    self.$nodeBody.append(self.$inner);
                    $li.prepend(self.$nodeBody);
                }
            };
            wijtreenode.prototype._createChildNodes = function ($li) {
                var self = this, nodes = [], o = self.options;
                if(self._hasChildren) {
                    $li.addClass("wijmo-wijtree-parent");
                    self.$nodeBody.addClass("wijmo-wijtree-node wijmo-wijtree-header " + o.wijCSS.stateDefault);
                    if(self._tree && self._tree.htmlGenerated) {
                        self.$hitArea = self.$inner.children(".wijmo-wijtree-hitarea");
                    } else {
                        self.$hitArea = $("<span>");
                        self.$inner.prepend(self.$hitArea);
                    }
                    self.$nodes = $li.children("ul:eq(0)");
                    nodes = self._createChildNode();
                    self.$nodes.addClass("wijmo-wijtree-list wijmo-wijtree-child " + o.wijCSS.helperReset);
                } else {
                    $li.addClass("wijmo-wijtree-item");
                    self.$nodeBody.addClass("wijmo-wijtree-node " + o.wijCSS.stateDefault);
                }
                //fix #39816, ie10 renders bullets for ul even when list-style-type is set none.
                //it's known issue for ie10. Please refer to http://bugs.jqueryui.com/ticket/8844.
                $li.css("list-style-type", "none");
                self._setField("nodes", nodes);
            };
            wijtreenode.prototype._createChildNode = function () {
                var self = this, o = self.options, nodes = [], lis, opts = {
                    nIndex: undefined,
                    treeClass: o.treeClass,
                    cfli: undefined,
                    nodes: undefined
                };
                if(o.nodes && o.nodes.length) {
                    if(self._tree && self._tree.htmlGenerated) {
                        var lis = self.$nodes.children("li");
                        $.each(lis, function (i, li) {
                            var $li = $(li), nodeWidget;
                            $li.data("owner", self);
                            opts.nIndex = i;
                            $li.wijtreenode(opts);
                            nodeWidget = self._getNodeWidget($li);
                            nodeWidget._index = i;
                            nodes.push(nodeWidget);
                        });
                    } else {
                        if(self.$nodes && self.$nodes.length) {
                            self.$nodes.empty();
                        } else {
                            self.$nodes = $("<ul>").appendTo(self.element);
                        }
                        $.each(o.nodes, function (i, n) {
                            var $li = $(generateMarkup(n)), nodeWidget;
                            self.$nodes.append($li);
                            $li.data("owner", self);
                            opts.nIndex = i;
                            $li.wijtreenode(opts);
                            nodeWidget = self._getNodeWidget($li);
                            nodeWidget._index = i;
                            nodes.push(nodeWidget);
                        });
                    }
                } else {
                    if(!o.nodes) {
                        o.nodes = [];
                    }
                    self.$nodes.children("li").each(function (i, n) {
                        var $li = $(n), nodeWidget;
                        $li.data("owner", self);
                        opts.cfli = true;
                        opts.nIndex = i;
                        opts.nodes = [];
                        $li.wijtreenode(opts)//the arg must be jquerify
                        ;
                        nodeWidget = self._getNodeWidget($li);
                        nodeWidget._index = i;
                        nodes.push(nodeWidget);
                    });
                }
                return nodes;
            };
            wijtreenode.prototype._initNode = function () {
                //init node(children,class, tree)
                                var self = this, o = self.options;
                if(!self._initialized) {
                    self._initialized = true;
                    self._initNavigateUrl();
                    if(!self._isTemplate && self.$text) {
                        self._text = self.$text.html();
                        o.text = self.$text.html();
                    }
                    self._hasChildren = self._getChildren();
                    self._initNodesUL();
                    self._initNodeClass();
                    self._initNodeImg();
                    self._initCheckBox();
                    self.$navigateUrl.one("mousedown", self, self._onMouseDown);
                }
            };
            wijtreenode.prototype._initNodeClass = function () {
                var self = this, o = self.options, style, nodeClass = "wijmo-wijtree-item", hitClass = o.wijCSS.icon + " " + (o.expanded ? o.wijCSS.iconArrowRightDown : o.wijCSS.iconArrowRight);
                if(self._tree.options.showExpandCollapse) {
                    if(self._hasChildren || !!o.hasChildren) {
                        self.$nodeBody.removeClass("wijmo-state-expanded").removeClass("wijmo-state-collapsed");
                        if(o.expanded) {
                            self.$nodeBody.addClass("wijmo-state-expanded");
                        } else {
                            self.$nodeBody.addClass("wijmo-state-collapsed");
                        }
                        if(self.$hitArea !== null) {
                            self.$hitArea.removeClass([
                                o.wijCSS.icon, 
                                o.wijCSS.iconArrowRightDown, 
                                o.wijCSS.iconArrowRight
                            ].join(' ')).addClass(hitClass);
                        } else {
                            self.$hitArea = $("<span>").addClass(hitClass).prependTo(self.$inner);
                            self.element.removeClass(nodeClass).addClass("wijmo-wijtree-parent");
                        }
                        if(self._hasChildren) {
                            //self.$nodes[o.expanded ? "show" : "hide"]();
                            // the performance "display:none" is must better then show,
                            // hide, fixed bug on adding lots of child nodes.
                            style = o.expanded ? "" : "none";
                            self.$nodes.css({
                                display: style
                            });
                        }
                    } else if(self.$hitArea) {
                        self.$hitArea.remove();
                        self.$hitArea = null;
                        self.element.removeClass("wijmo-wijtree-parent").addClass(nodeClass);
                    }
                }
                if(!self._hasChildren && self.$nodes) {
                    self.$nodes.css({
                        display: "none"
                    });
                }
                if(o.selected && self.$inner) {
                    self.$inner.addClass(o.wijCSS.stateActive);
                }
            };
            wijtreenode.prototype._initCheckBox = function () {
                var self = this, o = self.options;
                if(self.$checkBox && o.checkState) {
                    switch(o.checkState) {
                        case "checked":
                            self.$checkBox.wijtreecheck("option", "checkState", "check");
                            break;
                        case "indeterminate":
                            self.$checkBox.wijtreecheck("option", "checkState", "triState");
                            break;
                        case "unChecked":
                            self.$checkBox.wijtreecheck("option", "checkState", "unCheck");
                            break;
                        default:
                            self.$checkBox.wijtreecheck("option", "checkState", "unCheck");
                            break;
                    }
                }
            };
            wijtreenode.prototype._initNodesUL = function () {
                var self = this;
                if(self._tree.options.showExpandCollapse) {
                    if(self._hasChildren) {
                        self.$nodes[self._expanded ? 'show' : 'hide']();
                    }
                }
            };
            wijtreenode.prototype._initNavigateUrl = function () {
                var self = this, href = self.$navigateUrl.attr("href");
                self.$navigateUrl.bind("blur." + self.widgetName, self, self._onBlur);
                if(!this._isTemplate) {
                    self._navigateUrl = !!href ? href : "";
                    self._setNavigateUrlHref(href);
                }
            };
            wijtreenode.prototype._applyIconClass = function (el, o) {
                if(el.attr("expandediconclass")) {
                    o.expandedIconClass = el.attr("expandediconclass");
                    el.removeAttr("expandediconclass");
                }
                if(el.attr("collapsediconclass")) {
                    o.collapsedIconClass = el.attr("collapsediconclass");
                    el.removeAttr("collapsediconclass");
                }
                if(el.attr("itemiconclass")) {
                    o.itemIconClass = el.attr("itemiconclass");
                    el.removeAttr("itemiconclass");
                }
            };
            wijtreenode.prototype._initNodeImg = function () {
                //ui-icon instead of image
                                var self = this, o = self.options, el = self.element;
                if(self.$nodeImage === null || !self.$nodeImage.length) {
                    self.$nodeImage = $("<span>");
                }
                /* initial html has icon attribute for asp.net mvc*/
                self._applyIconClass(el, o);
                /* end */
                if(o.collapsedIconClass !== "" && o.expandedIconClass !== "") {
                    self.$nodeImage.removeClass().addClass(o.wijCSS.icon).addClass(o.expanded ? o.expandedIconClass : o.collapsedIconClass);
                    if(!self._tree.options.showExpandCollapse) {
                        self.$nodeImage.addClass(o.expandedIconClass);
                    }
                    self.$nodeImage.insertBefore(self.$checkBox);
                } else if(o.itemIconClass !== "") {
                    self.$nodeImage.removeClass().addClass(o.wijCSS.icon);
                    self.$nodeImage.addClass(o.itemIconClass);
                    self.$nodeImage.insertBefore(self.$checkBox);
                }
            };
            wijtreenode.prototype._setNavigateUrlHref = function (href) {
                if(this.$navigateUrl) {
                    if(href === "" || typeof href === "undefined") {
                        href = "#";
                    }
                    this.$navigateUrl.attr("href", href);
                }
            };
            wijtreenode.prototype._editNode = function () {
                //edit node
                this._tree._editMode = true;
                this.$navigateUrl.hide();
                if(!this.$editArea) {
                    this.$editArea = $("<input type=\"text\">").wijtextbox();
                }
                this.$editArea.val(this.$text.html());
                this.$editArea.insertBefore(this.$navigateUrl);
                this.$editArea.bind("blur", this, this._editionComplete);
                this.$editArea.focus();
            };
            wijtreenode.prototype._editionComplete = function (event) {
                var self = event.data, text;
                self._tree._editMode = false;
                if(self.$editArea) {
                    text = self.$editArea.val();
                    self.$editArea.remove();
                }
                self.$navigateUrl.show();
                self.$editArea = null;
                self._changeText(text);
            };
            wijtreenode.prototype._changeText = function (text) {
                var self = this, o = self.options;
                if(self.$text !== null && text !== "") {
                    self.$text.text(text);
                    o.text = text;
                    self._tree._trigger("nodeTextChanged", null, self);
                }
            };
            wijtreenode.prototype._expandCollapseItem = /*behavior Methods*/
            function () {
                //access
                                var self = this, o = self.options;
                if(!self._tree.options.disabled && !self._isClosestDisabled()) {
                    if(self._hasChildren || o.hasChildren) {
                        self._setExpanded(!o.expanded);
                    }
                }
            };
            wijtreenode.prototype._expandNode = function (expand) {
                var self = this, treeOption = self._tree.options, trigger = expand ? "nodeExpanding" : "nodeCollapsing";
                if(self._tree._trigger(trigger, null, {
                    node: this,
                    params: this.options.params
                }) === false) {
                    return;
                }
                self.$nodeBody.attr("aria-expanded", expand);
                self._expanded = expand;
                self.options.expanded = expand;
                if(!treeOption.disabled && !self._isClosestDisabled()) {
                    if(expand) {
                        if(treeOption.expandDelay > 0) {
                            if(typeof self._expandTimer !== "undefined") {
                                self._expandTimer = window.clearTimeout(self._expandTimer);
                            }
                            self._expandTimer = window.setTimeout(function () {
                                self._expandNodeVisually();
                            }, treeOption.expandDelay);
                        } else {
                            self._expandNodeVisually();
                        }
                    } else {
                        if(treeOption.collapseDelay > 0) {
                            self._collapseTimer = window.clearTimeout(self._collapseTimer);
                            self._collapseTimer = window.setTimeout(function () {
                                self._collapseNodeVisually();
                            }, treeOption.collapseDelay);
                        } else {
                            self._collapseNodeVisually();
                        }
                    }
                }
            };
            wijtreenode.prototype._expandNodeVisually = function () {
                var self = this, nodes, o = self.options;
                if(self._tree.options.autoCollapse) {
                    //autoCollapse
                    nodes = self.element.siblings(":" + this.widgetFullName);
                    $.each(nodes, function (i) {
                        var widget = self._getNodeWidget(nodes[i]);
                        if(widget.options.expanded) {
                            widget._setExpanded(false);
                        }
                    });
                }
                if(o.collapsedIconClass !== "" && o.expandedIconClass !== "") {
                    self.$nodeImage.removeClass(o.collapsedIconClass).addClass(o.expandedIconClass);
                }
                self._internalSetNodeClass(true);
                self._show();
            };
            wijtreenode.prototype._collapseNodeVisually = function () {
                var self = this;
                if(self.options.collapsedIconClass !== "" && self.options.expandedIconClass !== "") {
                    self.$nodeImage.removeClass(self.options.expandedIconClass).addClass(self.options.collapsedIconClass);
                }
                self._internalSetNodeClass(false);
                self._hide();
            };
            wijtreenode.prototype._internalSetNodeClass = function (expanded) {
                var css = this.options.wijCSS, iconCss = [
                    css.icon, 
                    css.iconArrowRightDown, 
                    css.iconArrowRight
                ].join(' ');
                if(!this.$hitArea) {
                    return;
                }
                this.$hitArea.removeClass(iconCss).addClass(css.icon).addClass(expanded ? css.iconArrowRightDown : css.iconArrowRight);
                this.$nodeBody.removeClass("wijmo-state-expanded").removeClass("wijmo-state-collapsed");
                if(expanded) {
                    this.$nodeBody.addClass("wijmo-state-expanded");
                } else {
                    this.$nodeBody.addClass("wijmo-state-collapsed");
                }
            };
            wijtreenode.prototype._show = function () {
                this._animation(true);
            };
            wijtreenode.prototype._hide = function () {
                this._animation(false);
            };
            wijtreenode.prototype._animation = function (show) {
                var self = this, el = self.$nodes, animate = show ? "expandAnimation" : "collapseAnimation", event = show ? "nodeExpanded" : "nodeCollapsed", effect, animation = self._tree.options[animate], opacity, strOpacity;
                function restoreOpacity(element) {
                    if(element.css(strOpacity) !== opacity) {
                        element.css(strOpacity, opacity);
                    }
                }
                if(el) {
                    if(animation) {
                        if($.browser.msie && parseInt($.browser.version) < 9) {
                            strOpacity = "filter";
                        } else {
                            strOpacity = "opacity";
                        }
                        opacity = el.css(strOpacity);
                        effect = animation.animated || animation.effect;
                        if($.effects && !!effect) {
                            el[show ? "show" : "hide"](effect, {
                                easing: animation.easing
                            }, animation.duration, function () {
                                restoreOpacity(el);
                                self._tree._trigger(event, null, self);
                            });
                        } else {
                            el[show ? "show" : "hide"](animation.duration, function () {
                                restoreOpacity(el);
                                self._tree._trigger(event, null, self);
                            });
                        }
                    } else {
                        el[show ? "show" : "hide"]();
                        self._tree._trigger(event, null, self);
                    }
                }
            };
            wijtreenode.prototype._getBounds = function ($el) {
                //get top,left,height,width of element
                                var h = $el.height(), w = $el.width(), t = $el.offset().top, l = $el.offset().left;
                return {
                    h: h,
                    w: w,
                    t: t,
                    l: l
                };
            };
            wijtreenode.prototype._isMouseInsideRect = function (p, b) {
                //whether mouse is over a element
                if(p.x < b.l || p.x >= b.l + b.w) {
                    return false;
                }
                if(p.y <= b.t + 1 || p.y >= b.t + b.h) {
                    /*fix 1px on the mouse out the element
                    (e.g. 31<30.98 now 31<30.98+1 maybe
                    pageY/PageX are int but left/top are float)*/
                    return false;
                }
                return true;
            };
            wijtreenode.prototype._getNodeByMouseOn = function (p) {
                $("li").each(function () {
                    var b = this._getBounds($(this));
                    if($.ui.isOver(p.y, p.x, b.t, b.l, b.h, b.w)) {
                        return $(this);
                    }
                });
                return null;
            };
            wijtreenode.prototype._drowTemplate = function (p, temp, targetEl) {
                var position = "unKnown", body = targetEl.is(".wijmo-wijtree-node") ? targetEl : targetEl.children(".wijmo-wijtree-node"), n = this._getBounds(body);
                temp.width(body.width());
                if(p.y > n.t && p.y < n.t + n.h / 2) {
                    temp.offset({
                        left: n.l,
                        top: n.t
                    });
                    position = "before";
                } else if(p.y > n.t + n.h / 2 && p.y < n.t + n.h) {
                    temp.offset({
                        left: n.l,
                        top: n.t + n.h
                    });
                    position = "after";
                }
                return position;
            };
            wijtreenode.prototype._beginDrag = function (e) {
                //set draggable
                                var self = this, $item = self.element, dragVisual, to = self._tree.options, draggable = to.draggable, options = {
                    cursor: "point",
                    cursorAt: {
                        top: 15,
                        left: -25
                    },
                    helper: function () {
                        return $("<div>" + self.$navigateUrl.html() + "</div>").addClass(to.wijCSS.header).addClass(to.wijCSS.cornerAll);
                    },
                    distance: $.browser.msie ? 1 : 10,
                    handle: self.$navigateUrl,
                    scope: "tree",
                    stop: undefined,
                    start: undefined,
                    drag: undefined
                }, temp = $("<div>").addClass("wijmo-wijtree-insertion").addClass(to.wijCSS.stateDefault);
                if(typeof to.dropVisual === "string") {
                    dragVisual = $(to.dropVisual);
                    temp = dragVisual.length ? dragVisual : temp;
                } else if($.isFunction(to.dropVisual)) {
                    dragVisual = $(to.dropVisual.call());
                    temp = dragVisual.length ? dragVisual : temp;
                }
                temp.hide();
                $.extend(options, draggable);
                options.start = function (event, ui) {
                    self._tree._isDragging = true;
                    self._tree.widgetDom.prepend(temp);
                    self._tree._trigger("nodeDragStarted", event, self);
                    if(draggable && $.isFunction(draggable.start)) {
                        draggable.start.call(self.element, event, ui);
                    } else {
                        $item.hide();
                    }
                };
                options.drag = function (event, ui) {
                    var t = event.srcElement || event.originalEvent.target, targetEl = $(t), dropNode, p = {
                        x: event.pageX,
                        y: event.pageY
                    };
                    if(temp) {
                        temp.hide();
                    }
                    if(targetEl) {
                        dropNode = self._getNodeWidget(targetEl);
                        if(dropNode && !dropNode._tree.options.disabled) {
                            if(targetEl.closest(".wijmo-wijtree-inner", self.element).length) {
                                self._insertPosition = "end"//end,after,before
                                ;
                            } else {
                                temp.show();
                                self._insertPosition = self._drowTemplate(p, temp, dropNode.element);
                            }
                            if(dropNode != self) {
                                self._dropTarget = dropNode;
                            }
                        } else if(targetEl.is(":" + self.options.treeClass)) {
                            self._dropTarget = targetEl.data(self.options.treeClass);
                            self._insertPosition = "end";
                        }
                    }
                    self._tree._trigger("nodeDragging", event, self);
                    if(draggable && $.isFunction(draggable.drag)) {
                        draggable.drag.call(self.element, event, ui);
                    }
                };
                options.stop = function (event, ui) {
                    temp.remove();
                    self._dropTarget = null;
                    self._insertPosition = "unKnown";
                    self._tree._isDragging = false;
                    if(draggable && $.isFunction(draggable.stop)) {
                        draggable.stop.call(self.element, event, ui);
                    } else {
                        $item.show();
                        self._resetDrag();
                    }
                };
                if($.fn.draggable) {
                    $item.draggable(options).trigger(e);
                    if($.browser.mozilla) {
                        self._setFocused(true);
                    }
                }
            };
            wijtreenode.prototype._resetDrag = function () {
                var self = this, nodes, i;
                if(!self._tree.options.allowDrag && self.element.data("uiDraggable")) {
                    self.element.draggable("destroy");
                }
                nodes = self._getField("nodes");
                for(i = 0; i < nodes.length; i++) {
                    nodes[i]._resetDrag();
                }
            };
            wijtreenode.prototype._checkClick = function () {
                //check , uncheck, indeterminate
                                var self = this, o = self.options;
                if(!self._tree.options.disabled && !self._isClosestDisabled()) {
                    if(o.checked && self._checkState === "indeterminate") {
                        self._checkState = "checked";
                        self._checkItem();
                    } else {
                        self._checkState = o.checked ? "unChecked" : "checked";
                        self._setChecked(!o.checked);
                    }
                    self._tree._trigger("nodeCheckChanged", null, self);
                }
            };
            wijtreenode.prototype._checkItem = function () {
                //access
                                var self = this, autoCheck = false, tree = self._tree;
                if(tree === null || !tree.options.showCheckBoxes) {
                    return;
                }
                if(tree.options.autoCheckNodes && self._checkState !== "indeterminate") {
                    autoCheck = true;
                    self._changeCheckState(self.options.checked);
                }
                if(tree.options.allowTriState) {
                    self._setParentCheckState();
                }
                self[self.options.checked ? "_checkNode" : "_unCheckNode"](autoCheck);
            };
            wijtreenode.prototype._checkNode = function (autoCheck) {
                //todo: add to tree._checkedNodes
                                var self = this, o = self.options, nodes = this._getField("nodes"), i;
                if(self._checkState === "checked") {
                    self.$checkBox.wijtreecheck("option", "checkState", "check");
                    o.checkState = "checked";
                } else if(self._checkState === "indeterminate") {
                    //todo: tristate Style
                    self.$checkBox.wijtreecheck("option", "checkState", "triState");
                    o.checkState = "indeterminate";
                }
                if(autoCheck) {
                    for(i = 0; i < nodes.length; i++) {
                        nodes[i]._checkNode(true);
                    }
                }
            };
            wijtreenode.prototype._unCheckNode = function (autoCheck) {
                //todo: remove to tree._checkedNodes
                                var nodes = this._getField("nodes"), o = this.options, i;
                this.$checkBox.wijtreecheck("option", "checkState", "unCheck");
                o.checkState = "unChecked";
                if(autoCheck) {
                    for(i = 0; i < nodes.length; i++) {
                        nodes[i]._unCheckNode(true);
                    }
                }
            };
            wijtreenode.prototype._changeCheckState = function (checked) {
                var nodes = this._getField("nodes");
                $.each(nodes, function (i, node) {
                    node.options.checked = checked;
                    node.$nodeBody.attr("aria-checked", checked);
                    node._checkState = checked ? "checked" : "unChecked";
                    node._changeCheckState(checked);
                });
            };
            wijtreenode.prototype._setParentCheckState = function () {
                //set parent check state
                                var owner = this._getOwner(), nodes, allChecked = true, hasChildrenChecked = false, triState = false, i, self = this;
                if(owner.element.is(":" + self.options.treeClass)) {
                    return;
                }
                nodes = owner._getField("nodes");
                for(i = 0; i < nodes.length; i++) {
                    if(nodes[i]._checkState === "indeterminate") {
                        triState = true;
                    }
                    if(nodes[i].options.checked) {
                        hasChildrenChecked = true;
                    } else {
                        allChecked = false;
                    }
                    if(!allChecked && hasChildrenChecked) {
                        break;
                    }
                }
                if(triState) {
                    owner._checkState = "indeterminate";
                    owner._setChecked(true);
                } else {
                    if(hasChildrenChecked) {
                        if(allChecked) {
                            owner._checkState = "checked";
                            owner._checkNode(false);
                        } else {
                            owner._checkState = "indeterminate";
                        }
                        owner._setChecked(true);
                    } else {
                        owner._checkState = "unChecked";
                        owner._setChecked(false);
                        owner._unCheckNode(false);
                    }
                }
                owner._setParentCheckState();
            };
            wijtreenode.prototype._onKeyDown = /*Events*/
            function (event) {
                var el = $(event.target), self = this;
                if(el.closest(".wijmo-wijtree-inner", self.element).length > 0) {
                    self._keyAction(event);
                }
            };
            wijtreenode.prototype._onClick = function (event) {
                var el = $(event.target), self = this;
                if(el.closest(".wijmo-checkbox", self.element).length > 0) {
                    self._checkClick();
                    event.preventDefault();
                    event.stopPropagation();
                } else if(self.$hitArea && self.$hitArea[0] === el[0]) {
                    self._expandCollapseItem();
                    event.preventDefault();
                    event.stopPropagation();
                } else if(el.closest(".wijmo-wijtree-inner", self.element).length > 0) {
                    self._click(event);
                }
            };
            wijtreenode.prototype._onMouseDown = function (event) {
                var el = $(event.target), node = event.data;
                if(!node._tree.options.disabled && node._tree.options.allowDrag) {
                    //prepare for drag
                    if(el.closest(".wijmo-wijtree-node", node.element).length > 0) {
                        node._beginDrag(event);
                    }
                }
            };
            wijtreenode.prototype._onMouseOver = function (event) {
                var el = $(event.target), self = this, rel = $(event.relatedTarget);
                if(el.closest(".wijmo-wijtree-inner", self.element).length > 0 && (this._tree._overNode !== self || rel.is(':' + this.widgetFullName))) {
                    self._mouseOver(event);
                    this._tree._overNode = self;
                }
                self._mouseOverHitArea(event);
            };
            wijtreenode.prototype._onMouseOut = function (event) {
                var el = $(event.target), self = this, rel = $(event.relatedTarget), node = this._getNodeWidget(rel);
                if(el.closest(".wijmo-wijtree-inner", self.element).length > 0 && (this._tree._overNode !== node || rel.is(':' + this.widgetFullName) || rel.is('.wijmo-wijtree-list') || rel.is('.ui-effects-wrapper'))) {
                    self._mouseOut(event);
                    if(!node) {
                        this._tree._overNode = null;
                    }
                }
                self._mouseOutHitArea(event);
            };
            wijtreenode.prototype._onFocus = function (event) {
                var el = $(event.target), self = this, css = self.options.wijCSS;
                if(el.closest(".wijmo-wijtree-inner", self.element).length > 0 && !self._tree.options.disabled && !self._isClosestDisabled() && !(el.hasAllClasses(css.iconArrowRightDown) || el.hasAllClasses(css.iconArrowRight)) && !el.closest(".wijmo-checkbox", self.element).length) {
                    if(self._tree._focusNode) {
                        self._tree._focusNode.$navigateUrl.blur();
                    }
                    self._focused = true;
                    self._tree._focusNode = this;
                    self.$inner.addClass(css.stateFocus);
                    self._tree._trigger("nodeFocus", event, self)// < = NEW LINE
                    ;
                }
            };
            wijtreenode.prototype._onBlur = function (event) {
                var el = $(event.target), self = event.data, css = self.options.wijCSS;
                if(!self._tree.options.disabled && !self._isClosestDisabled()) {
                    self._focused = false;
                    if(el.closest(".wijmo-wijtree-inner", self.element).length > 0) {
                        self.$inner.removeClass(css.stateFocus);
                    }
                    self._tree._trigger("nodeBlur", event, self);
                }
            };
            wijtreenode.prototype._click = function (event) {
                var self = this, o = self.options, tree = self._tree, url = self.$navigateUrl.attr("href");
                if(!tree.options.disabled && !self._isClosestDisabled()) {
                    if(!/^[#,\s]*$/.test(url)) {
                        if($.browser.msie && /^7\.[\d]*/.test($.browser.version)) {
                            if(url.indexOf(window.location.href) < 0) {
                                return;
                            }
                        } else {
                            return;
                        }
                    }
                    self._isClick = true;
                    tree._ctrlKey = event.ctrlKey;
                    if(o.selected && tree._ctrlKey) {
                        self._setSelected(false);
                    } else if(o.selected && !self._tree._editMode && tree.options.allowEdit && !self._isTemplate) {
                        self._editNode();
                    } else {
                        self._setSelected(!o.selected);
                    }
                    if(!self._isTemplate) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                } else {
                    self._setNavigateUrlHref("");
                }
            };
            wijtreenode.prototype._selectNode = function (select, event) {
                var self = this, o = self.options, ctrlKey, idx;
                if(!self._tree.options.disabled && !self._isClosestDisabled() && !self._tree._isDragging) {
                    ctrlKey = self._tree._ctrlKey;
                    if(ctrlKey) {
                        idx = $.inArray(self, self._tree._selectedNodes);
                        if(idx !== -1 && !select) {
                            self._tree._selectedNodes.splice(idx, 1);
                            self.$inner.removeClass(o.wijCSS.stateActive);
                        }
                    } else {
                        $.each(self._tree._selectedNodes, function (i, n) {
                            n.$inner.removeClass(o.wijCSS.stateActive);
                            n.options.selected = false;
                            n.$nodeBody.attr("aria-selected", false);
                        });
                        self._tree._selectedNodes = [];
                    }
                    if(select) {
                        idx = $.inArray(self, self._tree._selectedNodes);
                        if(idx === -1) {
                            this._tree._selectedNodes.push(self);
                        }
                        self.$inner.addClass(o.wijCSS.stateActive);
                    } else {
                        self.$inner.removeClass(o.wijCSS.stateActive);
                    }
                    if(self._isClick) {
                        self._tree._trigger("nodeClick", event, self);
                    }
                    self._isClick = false;
                    self._tree._ctrlKey = false;
                    self._tree._trigger("selectedNodeChanged", event, self);
                }
            };
            wijtreenode.prototype._keyAction = function (e) {
                var el = e.target, self = this, isEdit = false, keyCode = wijmo.getKeyCodeEnum();
                if(self._tree.options.disabled || self._isClosestDisabled()) {
                    return;
                }
                if(el) {
                    if(self._tree._editMode && e.keyCode !== keyCode.ENTER) {
                        return;
                    }
                    switch(e.keyCode) {
                        case keyCode.UP:
                            self._moveUp();
                            break;
                        case keyCode.DOWN:
                            self._moveDown();
                            break;
                        case keyCode.RIGHT:
                            if(self._tree.options.showExpandCollapse) {
                                self._moveRight();
                            }
                            break;
                        case keyCode.LEFT:
                            if(self._tree.options.showExpandCollapse) {
                                self._moveLeft();
                            }
                            break;
                        case 83:
                            //key s
                            if(!self._tree._editMode && self._tree.options.allowSorting) {
                                self.sortNodes();
                            }
                            break;
                        case 113:
                            //key f2
                            if(self._tree.options.allowEdit) {
                                self._editNode();
                            }
                            break;
                        case 109:
                            //key -
                            if(self._tree.options.showExpandCollapse && this._expanded) {
                                self._setExpanded(false);
                            }
                            break;
                        case 107:
                            //key +
                            if(self._tree.options.showExpandCollapse && !this._expanded) {
                                self._setExpanded(true);
                            }
                            break;
                        case keyCode.ENTER:
                            if(self._tree._editMode) {
                                e.data = self;
                                self._editionComplete(e);
                                self._setFocused(true);
                                isEdit = true;
                                e.preventDefault();
                            }
                            break;
                        case keyCode.SPACE:
                            //check
                            if(self._tree.options.showCheckBoxes) {
                                self._checkState = self.options.checked ? "unChecked" : "checked";
                                self._setChecked(!self.options.checked);
                            }
                            break;
                    }
                    self._customKeyDown(e.keyCode, isEdit);
                    if(!self._isTemplate && e.keyCode !== keyCode.ENTER) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            };
            wijtreenode.prototype._customKeyDown = function (keyCode, isEdit) {
            };
            wijtreenode.prototype._prevNode = function (node) {
                var el = node.element;
                if(el.prev().length > 0) {
                    return el.prev().data(el.data("widgetName"));
                }
            };
            wijtreenode.prototype._nextNode = function (node) {
                var el = node.element;
                if(el.next().length > 0) {
                    return el.next().data(el.data("widgetName"));
                }
            };
            wijtreenode.prototype._getNextExpandedNode = function (node) {
                var nextNode = node, nextNodes = node._getField("nodes"), newNode;
                if(node._expanded && nextNodes.length > 0) {
                    newNode = nextNodes[nextNodes.length - 1];
                    if(newNode !== null) {
                        nextNode = this._getNextExpandedNode(newNode);
                    }
                }
                return nextNode;
            };
            wijtreenode.prototype._getNextNode = function (owner) {
                var nextNode = null, self = this;
                if(owner.element.is(":" + self.options.treeClass)) {
                    return null;
                }
                nextNode = self._nextNode(owner);
                if(nextNode) {
                    return nextNode;
                }
                return self._getNextNode(owner._getOwner());
            };
            wijtreenode.prototype._moveUp = function () {
                var level = this._getCurrentLevel(), prevNode = this._prevNode(this);
                if(!prevNode) {
                    if(level > 0) {
                        this._getOwner()._setFocused(true);
                    }
                } else {
                    this._getNextExpandedNode(prevNode)._setFocused(true);
                }
            };
            wijtreenode.prototype._moveDown = function () {
                //sometimes blur
                                var nodes = this._getField("nodes"), nextNode, owner, pNextNode;
                if(this._expanded && nodes.length > 0) {
                    nodes[0]._setFocused(true);
                } else {
                    nextNode = this._nextNode(this);
                    if(nextNode) {
                        nextNode._setFocused(true);
                    } else {
                        owner = this._getOwner();
                        pNextNode = this._getNextNode(owner);
                        if(pNextNode) {
                            pNextNode._setFocused(true);
                        }
                    }
                }
            };
            wijtreenode.prototype._moveLeft = function () {
                var nextNode = this._getOwner();
                if(this._expanded) {
                    this._setExpanded(false);
                } else if(nextNode !== null && !nextNode.element.is(":" + this.options.treeClass)) {
                    nextNode._setFocused(true);
                }
            };
            wijtreenode.prototype._moveRight = function () {
                if(this._hasChildren) {
                    if(!this._expanded) {
                        this._setExpanded(true);
                    } else {
                        var nextNode = this._getField("nodes")[0];
                        if(nextNode !== null) {
                            nextNode._setFocused(true);
                        }
                    }
                }
            };
            wijtreenode.prototype._mouseOver = function (event) {
                var self = this, tree = self._tree;
                if(!tree.options.disabled && !self._isClosestDisabled() && !tree._editMode) {
                    self._mouseOverNode();
                    if(!tree._isDragging) {
                        tree._trigger("nodeMouseOver", event, self);
                    }
                }
            };
            wijtreenode.prototype._mouseOut = function (event) {
                var self = this, tree = self._tree;
                if(!tree.options.disabled && !self._isClosestDisabled() && !tree._editMode) {
                    self._mouseOutNode();
                    if(!tree._isDragging) {
                        tree._trigger("nodeMouseOut", event, self);
                    }
                }
            };
            wijtreenode.prototype._mouseOverNode = function () {
                if(this.$inner !== null && !this._isOverNode) {
                    this.$inner.addClass(this.options.wijCSS.stateHover);
                    this._isOverNode = true;
                }
            };
            wijtreenode.prototype._mouseOutNode = function () {
                if(this.$inner !== null && this._isOverNode) {
                    this.$inner.removeClass(this.options.wijCSS.stateHover);
                    this._isOverNode = false;
                }
            };
            wijtreenode.prototype._mouseOverHitArea = function (event) {
                var bound, p, self = this, tree = self._tree;
                if(!tree.options.disabled && !self._isClosestDisabled()) {
                    if(tree.options.expandCollapseHoverUsed) {
                        if(self._hasChildren && !self._isOverHitArea) {
                            bound = self._getBounds(self.element);
                            p = {
                                x: event.pageX,
                                y: event.pageY
                            };
                            if(self._isMouseInsideRect(p, bound)) {
                                self._isOverHitArea = true;
                                self._setExpanded(true);
                            }
                        }
                    }
                }
            };
            wijtreenode.prototype._mouseOutHitArea = function (event) {
                var p = {
                    x: event.pageX,
                    y: event.pageY
                }, bound, self = this, tree = self._tree;
                if(!tree.options.disabled && !self._isClosestDisabled()) {
                    if(tree.options.expandCollapseHoverUsed) {
                        if(self._hasChildren && !!self._isOverHitArea) {
                            bound = self._getBounds(self.element);
                            if(!self._isMouseInsideRect(p, bound)) {
                                self._isOverHitArea = false;
                                self._setExpanded(false);
                            }
                        } else if(self._getOwner().element.is(":" + self.widgetFullName)) {
                            bound = self._getBounds(self._getOwner().element);
                            if(!self._isMouseInsideRect(p, bound)) {
                                self._getOwner()._isOverHitArea = false;
                                self._getOwner()._setExpanded(false);
                            }
                        }
                    }
                }
            };
            wijtreenode.prototype.destroy = /*public methods*/
            /**
            * Destroy the node widget.
            */
            function () {
                var self = this, $nodes, o = self.options;
                if(self.element.data("uiDraggable")) {
                    self.element.draggable("destroy");
                }
                if(self.$hitArea) {
                    self.$hitArea.remove();
                }
                if(self.$checkBox) {
                    self.$checkBox.remove();
                }
                if(self.$nodeImage) {
                    self.$nodeImage.remove();
                }
                self.$navigateUrl.unwrap().unwrap().removeClass(o.wijCSS.stateDefault).removeClass(o.wijCSS.stateActive).unbind("mousedown").unbind("blur");
                $nodes = this.element.find("ul:first").show();
                $nodes.removeClass();
                $nodes.children("li").each(function () {
                    var nodeWidget = self._getNodeWidget($(this));
                    nodeWidget.destroy();
                });
                self.element.removeData("nodes").removeData("owner").removeData("widgetName").removeClass();
                $.Widget.prototype.destroy.apply(this);
            };
            wijtreenode.prototype.add = /**
            * The add method adds a node to the node.
            * @example $("#treenode1").wijtreenode("add", "node 1", 1);
            * @param {string|object} node
            * 1.markup html.such as "<li><a>node</a></li>" as a node.
            * 2.wijtreenode element.
            * 3.object options according to the options of wijtreenode.
            * 4. node's text.
            * @param {number} position The position to insert at.
            */
            function (node, position) {
                var nodeWidget = null, $node, nodes, self = this, cnodes, i, itemDom = "<li><a href='{0}'>{1}</a></li>", originalLength;
                if(typeof node === "string") {
                    $node = $(itemDom.replace(/\{0\}/, "#").replace(/\{1\}/, node));
                    self._createNodeWidget($node);
                    nodeWidget = $node.data($node.data("widgetName"));
                } else if(node.jquery) {
                    if(!node.data("widgetName")) {
                        self._createNodeWidget(node);
                    }
                    nodeWidget = node.data(node.data("widgetName"));
                } else if(node.nodeType) {
                    $node = $(node);
                    self._createNodeWidget($node);
                    nodeWidget = $node.data($node.data("widgetName"));
                } else if($.isPlainObject(node)) {
                    $node = $(itemDom.replace(/\{0\}/, node.url ? node.url : "#").replace(/\{1\}/, node.text))//node
                    ;
                    self._createNodeWidget($node, node);
                    nodeWidget = $node.data($node.data("widgetName"));
                }
                if(nodeWidget === null) {
                    return;
                }
                nodes = self._getField("nodes");
                if(!position || position > nodes.length) {
                    if(position !== 0) {
                        position = nodes.length;
                    }
                }
                if($.mobile) {
                    nodeWidget.element.find("a").addClass("ui-link");
                }
                cnodes = nodeWidget._getField("nodes");
                nodeWidget._tree = self._tree;
                for(i = 0; i < cnodes.length; i++) {
                    cnodes[i]._tree = self._tree;
                }
                nodeWidget._setField("owner", self);
                originalLength = nodes.length;
                if(!self.$nodes) {
                    self.$nodes = $("<ul></ul>").addClass("wijmo-wijtree-list").addClass(self.options.wijCSS.helperReset).addClass("wijmo-wijtree-child");
                    self.element.append(self.$nodes);
                }
                if(originalLength > 0 && originalLength !== position) {
                    if(nodeWidget.element.get(0) !== nodes[position].element.get(0)) {
                        nodeWidget.element.insertBefore(nodes[position].element);
                    }
                } else {
                    self.$nodes.append(nodeWidget.element);
                }
                self._changeCollection(position, nodeWidget);
                self._collectionChanged();
                nodeWidget._initNodeClass();
            };
            wijtreenode.prototype.remove = /**
            * The remove method removes the indicated node from this node.
            * @example $("#tree").wijtree("remove", 1);
            * @param {string|object} node
            * which node to be removed
            * 1.wijtreenode element.
            * 2.the zero-based index of which node you determined to remove.
            */
            function (node) {
                var idx = -1, nodeWidget, self = this, nodes = this._getField("nodes");
                if(node.jquery) {
                    idx = node.index();
                } else if(typeof node === "number") {
                    idx = node;
                }
                if(idx < 0 || idx >= nodes.length) {
                    return;
                }
                nodeWidget = nodes[idx];
                nodeWidget.element.detach();
                self._changeCollection(idx);
                self._collectionChanged();
            };
            wijtreenode.prototype.getNodes = /**
            * The getNodes method gets an array that contains the root nodes of the current tree node.
            * @example $("#tree").wijtree("getNodes");
            * @return {Array}
            */
            function () {
                return this._getField("nodes");
            };
            wijtreenode.prototype._changeCollection = function (idx, nodeWidget) {
                var nodes = this._getField("nodes"), ons = this.options.nodes;
                if(nodeWidget) {
                    nodes.splice(idx, 0, nodeWidget);
                    ons.splice(idx, 0, nodeWidget.options);
                } else {
                    nodes.splice(idx, 1);
                    ons.splice(idx, 1);
                }
            };
            wijtreenode.prototype.sortNodes = /**
            * Sorts the child nodes of the node.
            */
            function () {
                var nodes = this._getField("nodes");
                this._sort();
                $.each(nodes, function (i, childNode) {
                    childNode._index = i;
                    childNode._insertBefore(i);
                });
                this._refreshNodesClass();
            };
            wijtreenode.prototype.check = /**
            * Checks or unchecks the node.
            * @param {boolean} value Check or uncheck the node.
            */
            function (value) {
                this._setOption("checked", value);
            };
            wijtreenode.prototype.select = /**
            * Selects or unselects the node.
            * @param {boolean} value select or unselect the node.
            */
            function (value) {
                this._setOption("selected", value);
            };
            wijtreenode.prototype.getOwner = /**
            * Get owner which contains the node.
            */
            function () {
                var owner = this._getOwner();
                if(owner && owner.element.is("li")) {
                    return owner;
                }
                return null;
            };
            wijtreenode.prototype.expand = /**
            * Expands the node.
            */
            function () {
                this._setOption("expanded", true);
            };
            wijtreenode.prototype.collapse = /**
            * Collapses the node.
            */
            function () {
                this._setOption("expanded", false);
            };
            wijtreenode.prototype._insertBefore = /*region prvite Methods*/
            function (i) {
                var $lis = this.element.parent().children("li");
                if(this.element.index() !== i) {
                    this.element.insertBefore($lis.eq(i));
                }
            };
            wijtreenode.prototype._sort = function () {
                var nodes = this._getField("nodes");
                if(this._isSorted) {
                    if(!this._isDecsSort) {
                        nodes.sort(this._compare2NodeTextAcs);
                        this._isDecsSort = true;
                    } else {
                        nodes.sort(this._compare2NodeTextDesc);
                        this._isDecsSort = false;
                    }
                } else {
                    nodes.sort(this._compare2NodeTextAcs);
                    this._isSorted = true;
                    this._isDecsSort = true;
                }
            };
            wijtreenode.prototype._compare2NodeTextAcs = function (a, b) {
                if(a !== null && b !== null) {
                    return a._text.localeCompare(b._text);
                }
            };
            wijtreenode.prototype._compare2NodeTextDesc = function (a, b) {
                if(a !== null && b !== null) {
                    return -1 * a._text.localeCompare(b._text);
                }
            };
            wijtreenode.prototype._collectionChanged = function () {
                this._hasChildren = this._getChildren();
                this._initNodeClass();
                //this._refreshNodesClass();
                            };
            wijtreenode.prototype._refreshNodesClass = function () {
                var nodes = this._getField("nodes"), i;
                for(i = 0; i < nodes.length; i++) {
                    nodes[i]._initNodeClass();
                }
            };
            wijtreenode.prototype._setChecked = function (value) {
                var self = this;
                if(self.options.checked === value && self._checkState !== "indeterminate") {
                    return;
                }
                self.options.checked = value;
                self.$nodeBody.attr("aria-checked", value);
                this._checkItem();
            };
            wijtreenode.prototype._isClosestDisabled = function () {
                var self = this;
                if(self.element.closest(".wijmo-wijtree-disabled," + ".wijmo-wijtreenode-disabled", self._tree.element).length) {
                    return true;
                }
                return false;
            };
            wijtreenode.prototype._setExpanded = function (value) {
                var self = this, o = self.options;
                if(self._expanded === value) {
                    return;
                }
                if(self._hasChildren || o.hasChildren) {
                    self._expandNode(value);
                }
            };
            wijtreenode.prototype._setFocused = function (value) {
                if(value) {
                    this.$navigateUrl.focus();
                    this._setFocusNode();
                } else {
                    this.$navigateUrl.blur();
                }
            };
            wijtreenode.prototype._setFocusNode = function () {
                if(this._tree._focusNode && $.browser.webkit) {
                    this._tree._focusNode.$navigateUrl.blur();
                }
                this._focused = true;
                this._tree._focusNode = this;
                this.$inner.addClass(this.options.wijCSS.stateFocus);
                this._tree._trigger("nodeFocus", null, this);
            };
            wijtreenode.prototype._setToolTip = function (value) {
                if(value.length) {
                    this.element.attr("title", value);
                } else {
                    this.element.removeAttr("title");
                }
            };
            wijtreenode.prototype._setText = function (value) {
                if(this._text !== value && value.length) {
                    this._text = value;
                    this._changeText(value);
                }
            };
            wijtreenode.prototype._setSelected = function (value) {
                var self = this, o = self.options;
                if(o.selected !== value) {
                    o.selected = value;
                    self.$nodeBody.attr("aria-selected", value);
                    self._selectNode(value);
                    self._setFocused(value);
                }
            };
            wijtreenode.prototype._setCheckBoxes = function (value) {
                var self = this;
                if(self.$checkBox) {
                    self.$checkBox[value ? 'show' : 'hide']();
                } else if(value) {
                    self.$checkBox = $("<div>");
                    self.$checkBox.insertBefore(self.$navigateUrl);
                    self.$checkBox.wijtreecheck();
                }
                if(self.$nodes) {
                    self.$nodes.children("li").each(function (idx, data) {
                        var nodeWidget = self._getNodeWidget($(data));
                        if(nodeWidget !== null) {
                            nodeWidget._setCheckBoxes(value);
                        }
                    });
                }
            };
            wijtreenode.prototype._setHitArea = function (value) {
                var self = this;
                if(self._hasChildren)//todo: initnode class
                 {
                    if(value) {
                        self._initNodeClass();
                        if(self.$hitArea) {
                            self.$hitArea.show();
                        }
                    } else {
                        self._expanded = true;
                        self.options.expanded = true;
                        self.$nodeBody.attr("aria-expanded", true);
                        if(self.$nodes) {
                            self.$nodes.show();
                        }
                        self._initNodeClass();
                        if(self.$hitArea) {
                            self.$hitArea.hide();
                        }
                    }
                }
                if(self.$nodes) {
                    self.$nodes.children("li").each(function (idx, data) {
                        var nodeWidget = self._getNodeWidget($(data));
                        if(nodeWidget !== null) {
                            nodeWidget._setHitArea(value);
                        }
                    });
                }
            };
            wijtreenode.prototype._getOwner = function () {
                return this._getField("owner");
            };
            wijtreenode.prototype._getTree = function () {
                var owner = this._getOwner();
                if(owner) {
                    if(owner.element.is(":" + this.options.treeClass)) {
                        return owner;
                    } else {
                        return owner._tree;
                    }
                }
                return null;
            };
            wijtreenode.prototype._getInitElement = function () {
                var li = $("<li>"), self = this, ul = $("<ul>"), nodes = self._getField("nodes");
                li.append(self.$navigateUrl.clone());
                if(nodes.length) {
                    li.append(ul);
                    $.each(nodes, function (i, n) {
                        var c = n._getInitElement();
                        ul.append(c);
                    });
                }
                return li;
            };
            wijtreenode.prototype._getChildren = function () {
                return !!(this.options.nodes && this.options.nodes.length) || (this.element.children("ul:first").children("li").length > 0);
            };
            wijtreenode.prototype._getNodeWidget = function (el) {
                var node = this._getNodeByDom(el), widget;
                if(node.length > 0) {
                    widget = node.data(node.data("widgetName"));
                    return widget;
                }
                return null;
            };
            wijtreenode.prototype._createNodeWidget = function ($li, options) {
                if($.fn.wijtreenode) {
                    $li.data("owner", this);
                    if(!!options && $.isPlainObject(options)) {
                        $.extend(options, {
                            treeClass: this.options.treeClass
                        });
                        $li.wijtreenode(options);
                    } else {
                        $li.wijtreenode({
                            treeClass: this.options.treeClass
                        });
                    }
                }
                return $li;
            };
            wijtreenode.prototype._getNodeByDom = function (el) {
                //Arg :Dom Element
                return $(el).closest(":" + this.widgetFullName);
            };
            wijtreenode.prototype._getCurrentLevel = function () {
                return this.element.parentsUntil(":" + this.options.treeClass).length - 1;
            };
            wijtreenode.prototype._getField = function (key) {
                return this.element.data(key);
            };
            wijtreenode.prototype._setField = function (key, value) {
                return this.element.data(key, value);
            };
            return wijtreenode;
        })(wijmo.wijmoWidget);
        tree.wijtreenode = wijtreenode;        
        var checkClass = "", triStateClass = "";
        /** @ignore */
        var wijtreecheck = (function (_super) {
            __extends(wijtreecheck, _super);
            function wijtreecheck() {
                _super.apply(this, arguments);

            }
            wijtreecheck.prototype._initCSS = function (o) {
                var css = o.wijCSS;
                checkClass = css.icon + ' ' + css.iconCheck;
                triStateClass = css.icon + ' ' + css.iconStop;
            };
            wijtreecheck.prototype._create = function () {
                var self = this, o = this.options, css = o.wijCSS;
                self._initCSS(o);
                if(self.element.is("div")) {
                    self.element.addClass("wijmo-checkbox").addClass(css.widget).attr("role", "checkbox");
                    self.$icon = $("<span>");
                    self.$icon.addClass("wijmo-checkbox-icon");
                    if(o.checkState === "check") {
                        self.$icon.addClass(checkClass);
                    } else if(o.checkState === "triState") {
                        self.$icon.addClass(triStateClass);
                    }
                    self.$body = $('<div></div>').addClass([
                        "wijmo-checkbox-box", 
                        css.widget, 
                        css.cornerAll, 
                        css.stateDefault
                    ].join(' ')).css({
                        position: "relative"
                    }).append(self.$icon);
                    self.element.append(self.$body);
                    self.element.bind("mouseover.wijtreecheck", function () {
                        if(!self.options.disabled) {
                            self.$body.addClass(css.stateHover);
                        }
                    }).bind("mouseout.wijtreecheck", function () {
                        if(!self.options.disabled) {
                            self.$body.removeClass(css.stateHover).not(css.stateFocus).addClass(css.stateDefault);
                        }
                    });
                }
            };
            wijtreecheck.prototype._setOption = function (key, value) {
                var self = this, css = self.options.wijCSS;
                if(key === "checkState") {
                    if(value === "unCheck") {
                        self.$body.removeClass(css.stateActive);
                        self.$icon.removeClass(checkClass).removeClass(triStateClass).removeClass(css.stateActive);
                    } else if(value === "check") {
                        self.$body.addClass(css.stateActive);
                        self.$icon.removeClass(triStateClass).addClass(checkClass);
                    } else if(value === "triState") {
                        self.$body.addClass(css.stateActive);
                        self.$icon.removeClass(checkClass).addClass(triStateClass);
                    }
                }
                $.Widget.prototype._setOption.apply(self, arguments);
            };
            wijtreecheck.prototype.destory = /** The destroy method will remove the rating functionality completely and will return the element to its pre-init state. */
            function () {
                this.element.children().remove();
                this.element.removeClass("wijmo-checkbox").removeClass(this.options.wijCSS.widget);
                $.Widget.prototype.destroy.apply(this);
            };
            return wijtreecheck;
        })(wijmo.wijmoWidget);
        tree.wijtreecheck = wijtreecheck;        
        wijtreecheck.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, {
            wijMobileCSS: {
                header: "ui-header ui-bar-a",
                content: "ui-body-b",
                stateHover: "ui-btn-down-b",
                stateActive: "ui-btn-down-b"
            },
            checkState: "unCheck"
        });
        var wijtreenode_options = (function () {
            function wijtreenode_options() {
                /** wijMobileCSS
                * @ignore
                */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-b",
                    stateDefault: "ui-btn ui-btn-b",
                    stateHover: "ui-btn-down-c",
                    stateActive: "ui-btn-down-b"
                };
                /** @ignore */
                this.treeClass = "wijmo-wijtree";
                /** Selector option for auto self initialization.
                *	This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijtreenode')";
                /** @ignore */
                this.accessKey = "";
                /**	The checked option checks the tree node checkbox when it is set to true. It will uncheck the tree node checkbox when set to false.
                */
                this.checked = false;
                /**	The collapsedIconClass option sets the collapsed node icon (based on ui-icon) for the specified nodes.
                */
                this.collapsedIconClass = "";
                /**	The expanded option will expand the tree node if set to "true." It will collapse the tree node if set to "false.".
                */
                this.expanded = false;
                /**	The expandedIconClass option sets the expanded node icon (based on ui-icon) for the specified nodes.
                */
                this.expandedIconClass = "";
                /**	The itemIconClass option sets the node icon (based on ui-icon). It will be displayed on both expanded and collapsed nodes when the expandedIconClass and collapsedIconClass options are not specified.
                */
                this.itemIconClass = "";
                /**	The navigateUrl option sets the node's navigate url link.
                */
                this.navigateUrl = "";
                /**	The selected option selects the specified node when set to true, otherwise it unselects the node.
                */
                this.selected = false;
                /**	This option sets the node's text.
                */
                this.text = "";
                /**	The toolTip option sets the node's tooltip.
                */
                this.toolTip = "";
                /**	The hasChildren option determines whether the specified node has child nodes. It's always used when you're custom adding child nodes, such as in an async load.
                */
                this.hasChildren = false;
                /**	The params option sets the parameter needed to pass when the user is custom loading child nodes.
                */
                this.params = {
                };
                /**	Determines the child nodes of this nodes.
                */
                this.nodes = null;
            }
            return wijtreenode_options;
        })();        
        var wijtree_options = (function () {
            function wijtree_options() {
                /**
                * wijMobileCSS
                * @ignore
                */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-b",
                    stateDefault: "ui-btn ui-btn-b",
                    stateHover: "ui-btn-down-b",
                    stateActive: "ui-btn-down-c"
                };
                /** When the allowDrag option is set to true, the tree nodes can be dragged.
                */
                this.allowDrag = false;
                /**	When allowDrop is set to true, one tree node can be dropped within another tree node.
                */
                this.allowDrop = false;
                /**	The allowEdit option allows a user to edit the tree nodes at run time.
                */
                this.allowEdit = false;
                /**	The allowSorting option allows the tree nodes to be sorted at run time when the user presses the "s" key.
                */
                this.allowSorting = true;
                /**	The allowTriState option allows the tree nodes to exhibit triState behavior. This lets the node checkboxes be checked, unchecked, or indeterminate. This option must be used with the showCheckBoxes option.
                */
                this.allowTriState = true;
                /**	The autoCheckNodes option allows the sub-nodes to be checked when the parent nodes are checked. To use this option, showCheckboxes must be set to "true."
                */
                this.autoCheckNodes = true;
                /**	If this option is set to true,
                * the expanded node will be collapsed if another node is expanded.
                */
                this.autoCollapse = false;
                /**	If set to true, the select, click,
                * and check operations are disabled too.
                */
                this.disabled = false;
                /**	The expandCollapseHoverUsed option allows the tree to expand or collapse when the mouse hovers over the expand/collapse button.
                */
                this.expandCollapseHoverUsed = false;
                /**	The showCheckBoxes option allows the node Check Box to be shown on the tree nodes.
                */
                this.showCheckBoxes = false;
                /**	The showExpandCollapse option determines if the tree is displayed in an expanded or collapsed state. If set to "false," then the wijtree widget will be displayed in the expanded state.
                */
                this.showExpandCollapse = true;
                /**	The expandAnimation option determines the animation effect, easing, and duration for showing child nodes when the parent node is expanded.
                */
                this.expandAnimation = {
                    effect: "blind",
                    easing: "linear",
                    duration: 200
                };
                /**	The expandDelay option controls the length of time in milliseconds to delay before the node is expanded.
                */
                this.expandDelay = 0;
                /** The collapseAnimation option determines the animation effect, easing, and duration for hiding child nodes when the parent node is collapsed.
                */
                this.collapseAnimation = {
                    effect: "blind",
                    easing: "linear",
                    duration: 200
                };
                /**	This option controls the length of time in milliseconds to delay before the node collapses.
                */
                this.collapseDelay = 0;
                /**	Customize the jquery-ui-draggable plugin of wijtree.
                */
                this.draggable = null;
                /**	Customize the jquery-ui-droppable plugin of wijtree.
                */
                this.droppable = null;
                /*
                * Customizes the helper element to be used to display the position that
                * the node will be inserted to.
                * If a function is specified, it must return a DOMElement.
                * @type {String|Function}
                */
                this.dropVisual = null;
                /** Set the child nodes object array as the datasource of wijtree.
                * @type {Array}
                * @example
                * // Supply a function as an option.
                * $(".selector").wijtree("option","nodes",
                * [{ text:"node1", navigateUrl:"#" }]);
                */
                this.nodes = null;
                /** The nodeBlur event fired when the node loses focus.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                
                */
                this.nodeBlur = null;
                /** The nodeFocus event fired when the node is focused.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeFocus = null;
                /** The nodeClick event fires when a tree node is clicked.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeClick = null;
                /** The nodeCheckChanged event fires when a node is checked.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeCheckChanged = null;
                /** The nodeCollapsed event fires when a tree node is collapsed.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeCollapsed = null;
                /** The nodeExpanded event handler.
                * A function called when a node is expanded.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                
                */
                this.nodeExpanded = null;
                /** The nodeDragging event handler.A function called
                * when the node is moved during a drag-and-drop operation.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                
                */
                this.nodeDragging = null;
                /** The nodeDragStarted event fires when a user starts to drag a node.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                
                */
                this.nodeDragStarted = null;
                /** The nodeBeforeDropped event handler is called before a draggable node is dropped in another position. If the event handler returns false, the drop action will be prevented.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                
                */
                this.nodeBeforeDropped = null;
                /** The nodeDropped event is called when an acceptable draggable node is dropped over to another position.
                * @event
                * @dataKey {jQuery} sourceParent The source parent of current draggable node before it be dragged, a jQuery object.
                * @dataKey {number} sIndex The Index of dragged node in source parent.
                * @dataKey {jQuery} targetParent The target parent of current draggable node after it be dropped, a jQuery object.
                * @dataKey {number} tIndex The Index of dragged node in target parent.
                * @dataKey {jQuery} draggable The current draggable node.
                * @dataKey {object} offset The current absolute position of the draggable helper.
                * @dataKey {object} position The current position of the draggable helper.
                */
                this.nodeDropped = null;
                /** The nodeMouseOver event fires when a user places the mouse pointer over a node.
                * @event
                * @param {object} event jQuery.Event object.
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeMouseOver = null;
                /** The nodeMouseOut event fires when the user moves the mouse pointer off of a node.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                
                */
                this.nodeMouseOut = null;
                /** The nodeTextChanged event fires when the text of a node changes.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeTextChanged = null;
                /** The selectedNodeChanged event fires when the selected node changes.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.selectedNodeChanged = null;
                /** The nodeExpanding event fires before a tree node is expanded.
                * This event can be canceled, if return false
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                
                */
                this.nodeExpanding = null;
                /** The nodeCollapsing event fires before a node collapses.
                * This event can be canceled, if return false
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeCollapsing = null;
            }
            return wijtree_options;
        })();        
        wijtreenode.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijtreenode_options());
        wijtree.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijtree_options());
        $.wijmo.registerWidget("wijtree", wijtree.prototype);
        $.wijmo.registerWidget("wijtreenode", wijtreenode.prototype);
        $.wijmo.registerWidget("wijtreecheck", wijtreecheck.prototype);
    })(wijmo.tree || (wijmo.tree = {}));
    var tree = wijmo.tree;
})(wijmo || (wijmo = {}));
