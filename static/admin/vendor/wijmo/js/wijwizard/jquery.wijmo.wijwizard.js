/*
 *
 * Wijmo Library 3.20131.4
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
/// <reference path="../Base/jquery.wijmo.widget.ts" />
/// <reference path="../wijsuperpanel/jquery.wijmo.wijsuperpanel.ts" />
/*
* Depends:
*	jquery-1.4.2.js
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.position.js
*	jquery.effects.core.js
*	jquery.cookie.js
*	jquery.wijmo.wijsuperpanel.js
*	jquery.wijmo.wijutil.js
*
*/
var wijmo;
(function (wijmo) {
    "use strict";
    var $ = jQuery;
    var wijwizard = (function (_super) {
        __extends(wijwizard, _super);
        function wijwizard() {
            _super.apply(this, arguments);

        }
        wijwizard.prototype._create = function () {
            var _this = this;
            if(this.element.is(":hidden") && this.element.wijAddVisibilityObserver) {
                this.element.wijAddVisibilityObserver(function () {
                    if(_this.element.wijRemoveVisibilityObserver) {
                        _this.element.wijRemoveVisibilityObserver();
                    }
                    _this._pageLize(true);
                }, "wijwizard");
                return;
            }
            this._pageLize(true);
        };
        wijwizard.prototype._init = function () {
            var o = this.options, dis = o.disabled;
            if(o.disabledState) {
                this.disable();
                o.disabled = dis;
            } else {
                if(o.autoPlay) {
                    this.play();
                }
            }
        };
        wijwizard.prototype._setOption = function (key, value) {
            _super.prototype._setOption.call(this, key, value);
            switch(key) {
                case 'activeIndex':
                    this.show(value);
                    break;
                case 'navButtons':
                    this._createButtons();
                    break;
                default:
                    this._pageLize(false);
                    break;
            }
        };
        wijwizard.prototype.destroy = function () {
            var o = this.options;
            this.abort();
            this.stop();
            this._removeScroller();
            this._removeButtons();
            this.element.unbind('.wijwizard').removeClass(o.wijCSS.wijwizard).removeClass(o.wijCSS.widget).removeClass(o.wijCSS.helperClearFix).removeData('wijwizard');
            if(this.list) {
                this.list.removeClass(o.wijCSS.widget).removeClass(o.wijCSS.helperReset).removeClass(o.wijCSS.wijwizardSteps).removeClass(o.wijCSS.helperClearFix).removeAttr('role');
            }
            if(this.lis) {
                this.lis.removeClass(o.wijCSS.header).removeClass(o.wijCSS.cornerAll).removeClass(o.wijCSS.priorityPrimary).removeClass(o.wijCSS.prioritySecondary).removeAttr('role');
                $.each(this.lis, function () {
                    if($.data(this, 'destroy.wijwizard')) {
                        $(this).remove();
                    } else {
                        $(this).removeAttr('aria-selected');
                    }
                });
            }
            $.each(this.panels, function () {
                var $this = $(this).unbind('.wijwizard');
                $.each([
                    'load', 
                    'cache'
                ], function (i, prefix) {
                    $this.removeData(prefix + '.wijwizard');
                });
                if($.data(this, 'destroy.wijwizard')) {
                    $this.remove();
                } else {
                    $this.removeClass(o.wijCSS.stateDefault).removeClass(o.wijCSS.wijwizardActived).removeClass(o.wijCSS.stateActive).removeClass(o.wijCSS.stateHover).removeClass(o.wijCSS.stateFocus).removeClass(o.wijCSS.stateDisabled).removeClass(o.wijCSS.wijwizardPanel).removeClass(o.wijCSS.content).removeClass(o.wijCSS.wijwizardHide).css({
                        position: '',
                        left: '',
                        top: ''
                    }).removeAttr('aria-hidden');
                }
            });
            this.container.replaceWith(this.container.contents());
            if(o.cookie) {
                this._cookie(null, o.cookie);
            }
            return this;
        };
        wijwizard.prototype._pageLize = function (init) {
            var o = this.options, fragmentId = /^#.+/;
            // Safari 2 reports '#' for an empty hash;
                        //Fix a bug that when no title and has ul li element in its content
            this.list = this.element.children('ol,ul').eq(0);
            if(this.list && this.list.length === 0) {
                this.list = this.element.find("." + o.wijCSS.wijwizardSteps).eq(0);
                if(this.list && this.list.length === 0) {
                    this.list = null;
                }
            }
            if(this.list) {
                this.lis = $('li', this.list);
            }
            if(init) {
                this.panels = $('> div', this.element);
                $.each(this.panels, function (i, p) {
                    var url = $(p).attr('src');
                    // inline
                    if(url && !fragmentId.test(url)) {
                        // mutable data
                        $.data(p, 'load.wijwizard', url.replace(/#.*$/, ''));
                    }
                });
                this.element.addClass(o.wijCSS.wijwizard).addClass(o.wijCSS.widget).addClass(o.wijCSS.helperClearFix);
                if(this.list) {
                    this.list.addClass(o.wijCSS.widget).addClass(o.wijCSS.helperReset).addClass(o.wijCSS.wijwizardSteps).addClass(o.wijCSS.helperClearFix).attr("role", "tablist");
                    this.lis.addClass(o.wijCSS.header).addClass(o.wijCSS.cornerAll).attr("role", "tab");
                }
                this.container = $('<div/>');
                this.container.addClass(o.wijCSS.wijwizardContent).addClass(o.wijCSS.widget).addClass(o.wijCSS.content).addClass(o.wijCSS.cornerAll);
                this.container.append(this.panels);
                this.container.appendTo(this.element);
                this.panels.addClass(o.wijCSS.wijwizardPanel).addClass(o.wijCSS.content).attr("role", "tabpanel");
                // Active a panel
                // use "activeIndex" option or try to retrieve:
                // 1. from cookie
                // 2. from actived class attribute on panel
                if(o.activeIndex === undefined) {
                    if(typeof o.activeIndex !== 'number' && o.cookie) {
                        o.activeIndex = parseInt(this._cookie(undefined, undefined), 10);
                    }
                    if(typeof o.activeIndex !== 'number' && this.panels.filter('.' + o.wijCSS.wijwizardActived).length) {
                        o.activeIndex = this.panels.index(this.panels.filter('.' + o.wijCSS.wijwizardActived));
                    }
                    o.activeIndex = o.activeIndex || (this.panels.length ? 0 : -1);
                } else if(o.activeIndex === null) {
                    // usage of null is deprecated, TODO remove in next release
                    o.activeIndex = -1;
                }
                // sanity check - default to first page...
                o.activeIndex = ((o.activeIndex >= 0 && this.panels[o.activeIndex]) || o.activeIndex < 0) ? o.activeIndex : 0;
                this.panels.addClass(o.wijCSS.wijwizardHide).attr('aria-hidden', true);
                if(o.activeIndex >= 0 && this.panels.length) {
                    // check for length avoids error when initializing empty pages
                    this.panels.eq(o.activeIndex).removeClass(o.wijCSS.wijwizardHide).addClass(o.wijCSS.wijwizardActived).attr('aria-hidden', false);
                    this.load(o.activeIndex);
                }
                this._createButtons();
            } else {
                this.panels = $('> div', this.container);
                o.activeIndex = this.panels.index(this.panels.filter('.' + o.wijCSS.wijwizardActived));
            }
            this._refreshStep();
            this._initScroller();
            // set or update cookie after init and add/remove respectively
            if(o.cookie) {
                this._cookie(o.activeIndex, o.cookie);
            }
            // reset cache if switching from cached to not cached
            if(o.cache === false) {
                this.panels.removeData('cache.wijwizard');
            }
            if(o.showOption === undefined || o.showOption === null) {
                o.showOption = {
                };
            }
            this._normalizeBlindOption(o.showOption);
            if(o.hideOption === undefined || o.hideOption === null) {
                o.hideOption = {
                };
            }
            this._normalizeBlindOption(o.hideOption);
            // remove all handlers
            this.panels.unbind('.wijwizard');
        };
        wijwizard.prototype._removeButtons = function () {
            if(this.buttons) {
                this.buttons.remove();
                this.buttons = undefined;
            }
        };
        wijwizard.prototype._createButtons = function () {
            var _this = this;
            var self = this, o = this.options, bt, addState, removeState, backBtnText = o.backBtnText, nextBtnText = o.nextBtnText;
            this._removeButtons();
            if(o.navButtons === 'none') {
                return;
            }
            if(!this.buttons) {
                bt = o.navButtons;
                if(bt === 'auto') {
                    bt = this.list ? 'common' : 'edge';
                }
                this.buttons = $('<div/>');
                this.buttons.addClass(o.wijCSS.wijwizardButtons);
                addState = function (state, el) {
                    if(o.disabled) {
                        return;
                    }
                    if(el.is(':not(.' + o.wijCSS.stateDisabled + ')')) {
                        el.addClass(state);
                    }
                };
                removeState = function (state, el) {
                    if(o.disabled) {
                        return;
                    }
                    el.removeClass(state);
                };
                if(bt === 'common') {
                    this.backBtn = $("<a href='#'><span class='" + o.wijCSS.buttonText + "'>" + backBtnText + "</span></a>").addClass(o.wijCSS.widget).addClass(o.wijCSS.stateDefault).addClass(o.wijCSS.cornerAll).addClass(o.wijCSS.button).addClass(o.wijCSS.buttonTextOnly).appendTo(this.buttons).bind({
                        'click': function () {
                            _this.back();
                            return false;
                        },
                        'mouseover': function () {
                            addState(o.wijCSS.stateHover, $(this));
                        },
                        'mouseout': function () {
                            removeState(o.wijCSS.stateHover, $(this));
                        },
                        'mousedown': function () {
                            addState(o.wijCSS.stateActive, $(this));
                        },
                        'mouseup': function () {
                            removeState(o.wijCSS.stateActive, $(this));
                        }
                    }).attr("role", "button");
                    this.nextBtn = $("<a href='#'><span class='" + o.wijCSS.buttonText + "'>" + nextBtnText + "</span></a>").addClass(o.wijCSS.widget).addClass(o.wijCSS.stateDefault).addClass(o.wijCSS.cornerAll).addClass(o.wijCSS.button).addClass(o.wijCSS.buttonTextOnly).appendTo(this.buttons).bind({
                        'click': function () {
                            self.next();
                            return false;
                        },
                        'mouseover': function () {
                            addState(o.wijCSS.stateHover, $(this));
                        },
                        'mouseout': function () {
                            removeState(o.wijCSS.stateHover, $(this));
                        },
                        'mousedown': function () {
                            addState(o.wijCSS.stateActive, $(this));
                        },
                        'mouseup': function () {
                            removeState(o.wijCSS.stateActive, $(this));
                        }
                    }).attr("role", "button");
                } else {
                    this.backBtn = $("<a href='#'/>").addClass(o.wijCSS.wijwizardPrev).addClass(o.wijCSS.stateDefault).addClass(o.wijCSS.cornerRight).append("<span class='" + o.wijCSS.icon + " " + o.wijCSS.iconArrowLeft + "'></span>").appendTo(this.buttons).bind({
                        'click': function () {
                            self.back();
                            return false;
                        },
                        'mouseover': function () {
                            addState(o.wijCSS.stateHover, $(this));
                        },
                        'mouseout': function () {
                            removeState(o.wijCSS.stateHover, $(this));
                        },
                        'mousedown': function () {
                            addState(o.wijCSS.stateActive, $(this));
                        },
                        'mouseup': function () {
                            removeState(o.wijCSS.stateActive, $(this));
                        }
                    }).attr("role", "button");
                    this.nextBtn = $("<a href='#'/>").addClass(o.wijCSS.wijwizardNext).addClass(o.wijCSS.stateDefault).addClass(o.wijCSS.cornerLeft).append("<span class='" + o.wijCSS.icon + " " + o.wijCSS.iconArrowRight + "'></span>").appendTo(this.buttons).bind({
                        'click': function () {
                            self.next();
                            return false;
                        },
                        'mouseover': function () {
                            addState(o.wijCSS.stateHover, $(this));
                        },
                        'mouseout': function () {
                            removeState(o.wijCSS.stateHover, $(this));
                        },
                        'mousedown': function () {
                            addState(o.wijCSS.stateActive, $(this));
                        },
                        'mouseup': function () {
                            removeState(o.wijCSS.stateActive, $(this));
                        }
                    }).attr("role", "button");
                }
                this.buttons.appendTo(this.element);
            }
        };
        wijwizard.prototype._refreshStep = function () {
            var o = this.options;
            if(this.lis) {
                this.lis.removeClass(o.wijCSS.priorityPrimary).addClass(o.wijCSS.prioritySecondary).attr('aria-selected', false);
                if(o.activeIndex >= 0 && o.activeIndex <= this.lis.length - 1) {
                    if(this.lis) {
                        this.lis.eq(o.activeIndex).removeClass(o.wijCSS.prioritySecondary).addClass(o.wijCSS.priorityPrimary).attr('aria-selected', true);
                    }
                    if(this.scrollWrap) {
                        this.scrollWrap.wijsuperpanel('scrollChildIntoView', this.lis.eq(o.activeIndex));
                    }
                }
            }
            if(this.buttons && !o.loop) {
                this.backBtn[o.activeIndex <= 0 ? 'addClass' : 'removeClass'](o.wijCSS.stateDisabled).attr('aria-disabled', o.activeIndex === 0);
                this.nextBtn[o.activeIndex >= this.panels.length - 1 ? 'addClass' : 'removeClass'](o.wijCSS.stateDisabled).attr('aria-disabled', (o.activeIndex >= this.panels.length - 1));
            }
        };
        wijwizard.prototype._initScroller = function () {
            if(!this.lis) {
                return;
            }
            var width = 0;
            $.each(this.lis, function () {
                width += $(this).outerWidth(true);
            });
            if(this.element.innerWidth() < width) {
                if(this.scrollWrap === undefined) {
                    this.list.wrap("<div class='scrollWrap'></div>");
                    this.scrollWrap = this.list.parent();
                    if($.effects && $.effects.save) {
                        $.effects.save(this.list, [
                            'width', 
                            'height', 
                            'overflow'
                        ]);
                    } else if($.save) {
                        $.save(this.list, [
                            'width', 
                            'height', 
                            'overflow'
                        ]);
                    }
                }
                this.list.width(width + 8);
                this.scrollWrap.height(this.list.outerHeight(true));
                this.scrollWrap.wijsuperpanel({
                    allowResize: false,
                    hScroller: {
                        scrollBarVisibility: 'hidden'
                    },
                    vScroller: {
                        scrollBarVisibility: 'hidden'
                    }
                });
            } else {
                this._removeScroller();
            }
        };
        wijwizard.prototype._removeScroller = function () {
            if(this.scrollWrap) {
                this.scrollWrap.wijsuperpanel('destroy').replaceWith(this.scrollWrap.contents());
                this.scrollWrap = undefined;
                if($.effects && $.effects.restore) {
                    $.effects.restore(this.list, [
                        'width', 
                        'height', 
                        'overflow'
                    ]);
                } else if($.restore) {
                    $.restore(this.list, [
                        'width', 
                        'height', 
                        'overflow'
                    ]);
                }
            }
        };
        wijwizard.prototype._cookie = function (index, c) {
            var cookie = this.cookie || (this.cookie = this.options.cookie.name);
            return $.cookie.apply(null, [
                cookie
            ].concat($.makeArray(arguments)));
        };
        wijwizard.prototype._normalizeBlindOption = function (o) {
            if(o.blind === undefined) {
                o.blind = false;
            }
            if(o.fade === undefined) {
                o.fade = false;
            }
            if(o.duration === undefined) {
                o.duration = 200;
            }
            if(typeof o.duration === 'string') {
                try  {
                    o.duration = parseInt(o.duration, 10);
                } catch (e) {
                    o.duration = 200;
                }
            }
        };
        wijwizard.prototype._ui = function (panel) {
            return {
                panel: panel,
                index: this.panels.index(panel)
            };
        };
        wijwizard.prototype._removeSpinner = function () {
            // restore all former loading wijwizard labels
            this.element.removeClass(this.options.wijCSS.tabsLoading);
            var spinner = this.element.data('spinner.wijwizard');
            if(spinner) {
                this.element.removeData('spinner.wijwizard');
                spinner.remove();
            }
        };
        wijwizard.prototype._showPanel = function (p) {
            var _this = this;
            var o = this.options, $show = $(p), props;
            $show.addClass(o.wijCSS.wijwizardActived);
            if((o.showOption.blind || o.showOption.fade) && o.showOption.duration > 0) {
                props = {
                    duration: o.showOption.duration
                };
                if(o.showOption.blind) {
                    props.height = 'toggle';
                }
                if(o.showOption.fade) {
                    props.opacity = 'toggle';
                }
                $show.hide().removeClass(o.wijCSS.wijwizardHide).animate(// avoid flicker that way
                props, o.showOption.duration || 'normal', "linear", function () {
                    _this._resetStyle($show);
                    if($show.wijTriggerVisibility) {
                        $show.wijTriggerVisibility();
                    }
                    _this._trigger('show', null, _this._ui($show[0]));
                    _this._removeSpinner();
                    $show.attr('aria-hidden', false);
                    _this._trigger('activeIndexChanged', null, _this._ui($show[0]));
                });
            } else {
                $show.removeClass(o.wijCSS.wijwizardHide).attr('aria-hidden', false);
                if($show.wijTriggerVisibility) {
                    $show.wijTriggerVisibility();
                }
                this._trigger('show', null, this._ui($show[0]));
                this._removeSpinner();
                this._trigger('activeIndexChanged', null, this._ui($show[0]));
            }
        };
        wijwizard.prototype._hidePanel = function (p) {
            var _this = this;
            var self = this, o = this.options, $hide = $(p), props;
            $hide.removeClass(o.wijCSS.wijwizardActived);
            if((o.hideOption.blind || o.hideOption.fade) && o.hideOption.duration > 0) {
                props = {
                    duration: o.hideOption.duration
                };
                if(o.hideOption.blind) {
                    props.height = 'toggle';
                }
                if(o.hideOption.fade) {
                    props.opacity = 'toggle';
                }
                $hide.animate(props, o.hideOption.duration || 'normal', "linear", function () {
                    $hide.addClass(o.wijCSS.wijwizardHide).attr('aria-hidden', true);
                    _this._resetStyle($hide);
                    _this.element.dequeue("wijwizard");
                });
            } else {
                $hide.addClass(o.wijCSS.wijwizardHide).attr('aria-hidden', true);
                this.element.dequeue("wijwizard");
            }
        };
        wijwizard.prototype._resetStyle = // Reset certain styles left over from animation
        // and prevent IE's ClearType bug...
        function ($el) {
            $el.css({
                display: ''
            });
            if(!$.support.opacity) {
                $el[0].style.removeAttribute('filter');
            }
        };
        wijwizard.prototype.add = function (index, title, desc) {
            /// <summary>The add method adds a new panel.</summary>
            /// <param name="index" type="Number">
            /// Zero-based position where to insert the new panel.
            /// </param>
            /// <param name="title" type="String">The step title.</param>
            /// <param name="desc" type="String">The step description.</param>
            /// Code example:
            ///		$("#wizard").wijwizard("add", index, title, desc);
            if(index === undefined) {
                index = this.panels.length// append by default
                ;
            }
            if(title === undefined) {
                title = "Step " + index;
            }
            var self = this, o = this.options, $panel = $(o.panelTemplate || self._defaults.panelTemplate).data('destroy.wijwizard', true), $li;
            $panel.addClass(o.wijCSS.wijwizardPanel).addClass(o.wijCSS.content).addClass(o.wijCSS.cornerAll).addClass(o.wijCSS.wijwizardHide).attr('aria-hidden', true);
            if(index >= this.panels.length) {
                if(this.panels.length > 0) {
                    $panel.insertAfter(this.panels[this.panels.length - 1]);
                } else {
                    $panel.appendTo(this.container);
                }
            } else {
                $panel.insertBefore(this.panels[index]);
            }
            if(this.list && this.lis) {
                $li = $((o.stepHeaderTemplate || self._defaults.stepHeaderTemplate).replace(/#\{title\}/g, title).replace(/#\{desc\}/g, desc));
                $li.addClass(o.wijCSS.header).addClass(o.wijCSS.cornerAll).addClass(o.wijCSS.prioritySecondary).data('destroy.wijwizard', true);
                if(index >= this.lis.length) {
                    $li.appendTo(this.list);
                } else {
                    $li.insertBefore(this.lis[index]);
                }
            }
            this._pageLize(false);
            if(this.panels.length === 1) {
                // after pagelize
                o.activeIndex = 0;
                $li.addClass(o.wijCSS.priorityPrimary);
                $panel.removeClass(o.wijCSS.wijwizardHide).addClass(o.wijCSS.wijwizardActived).attr('aria-hidden', false);
                this.element.queue("wijwizard", function () {
                    self._trigger('show', null, self._ui(self.panels[0]));
                });
                this._refreshStep();
                this.load(0);
            }
            // callback
            this._trigger('add', null, this._ui(this.panels[index]));
            return this;
        };
        wijwizard.prototype.remove = function (index) {
            /// <summary>The remove method removes a panel.</summary>
            /// <param name="index" type="Number">
            /// The zero-based index of the panel to be removed.
            /// </param>
            /// Code example:
            ///		$("#wizard").wijwizard("remove", index);
                        var o = this.options, $panel = //$li = this.lis.eq(index).remove(),
            this.panels.eq(index).remove();
            this.lis.eq(index).remove();
            if(index < o.activeIndex) {
                o.activeIndex--;
            }
            this._pageLize(false);
            //Ajust the active panel index in some case
            if($panel.hasClass(o.wijCSS.wijwizardActived) && this.panels.length >= 1) {
                this.show(index + (index < this.panels.length ? 0 : -1));
            }
            // callback
            this._trigger('remove', null, this._ui($panel[0]));
            return this;
        };
        wijwizard.prototype.show = function (index) {
            var _this = this;
            /// <summary>
            /// The show method selects an active panel and displays the panel at a specified position.
            /// </summary>
            /// <param name="index" type="Number">
            /// The zero-based index of the panel to be actived.
            /// </param>
            /// Code example:
            ///		$("#wizard").wijwizard("show", index);
            if(index < 0 || index >= this.panels.length) {
                return this;
            }
            // previous animation is still processing
            if(this.element.queue("wijwizard").length > 0) {
                return this;
            }
            var o = this.options, args = {
                nextIndex: 0,
                nextPanel: null
            }, $hide, $show;
            $.extend(args, this._ui(this.panels[o.activeIndex]));
            args.nextIndex = index;
            args.nextPanel = this.panels[index];
            if(this._trigger('validating', null, args) === false) {
                return this;
            }
            $hide = this.panels.filter(':not(.' + o.wijCSS.wijwizardHide + ')');
            $show = this.panels.eq(index);
            o.activeIndex = index;
            this.abort();
            if(o.cookie) {
                this._cookie(o.activeIndex, o.cookie);
            }
            this._refreshStep();
            // show new panel
            if($show.length) {
                if($hide.length) {
                    this.element.queue("wijwizard", function () {
                        _this._hidePanel($hide);
                    });
                }
                this.element.queue("wijwizard", function () {
                    _this._showPanel($show);
                });
                this.load(index);
            } else {
                throw 'jQuery UI wijwizard: Mismatching fragment identifier.';
            }
            return this;
        };
        wijwizard.prototype.next = function () {
            /// <summary>The next method moves to the next panel.</summary>
            /// Code example:
            ///		$("#wizard").wijwizard("next");
                        var o = this.options, index = o.activeIndex + 1;
            if(o.disabled) {
                return false;
            }
            if(o.loop) {
                index = index % this.panels.length;
            }
            if(index < this.panels.length) {
                this.show(index);
                return true;
            }
            return false;
        };
        wijwizard.prototype.back = function () {
            /// <summary>The back method moves to the previous panel.</summary>
            /// Code example:
            ///		$("#wizard").wijwizard("back");
                        var o = this.options, index = o.activeIndex - 1;
            if(o.disabled) {
                return false;
            }
            if(o.loop) {
                index = index < 0 ? this.panels.length - 1 : index;
            }
            if(index >= 0) {
                this.show(index);
                return true;
            }
            return false;
        };
        wijwizard.prototype.load = function (index) {
            /// <summary>The load method reload the content of an Ajax panel programmatically.</summary>
            /// <param name="index" type="Number">
            /// The zero-based index of the panel to be loaded
            /// </param>
            /// Code example:
            ///		$("#wizard").wijwizard("load", index);
                        var self = this, o = self.options, p = self.panels.eq(index)[0], url = $.data(p, 'load.wijwizard'), spinner;
            self.abort();
            // not remote or from cache
            if(!url || self.element.queue("wijwizard").length !== 0 && $.data(p, 'cache.wijwizard')) {
                self.element.dequeue("wijwizard");
                return;
            }
            // load remote from here on
            this.element.addClass(o.wijCSS.tabsLoading);
            if(o.spinner) {
                spinner = this.element.data('spinner.wijwizard');
                if(!spinner) {
                    spinner = $('<div/>');
                    spinner.addClass(o.wijCSS.wijwizardSpinner);
                    spinner.html(o.spinner || self._defaults.spinner);
                    spinner.appendTo(document.body);
                    this.element.data('spinner.wijwizard', spinner);
                    spinner.wijpopup({
                        showEffect: 'blind',
                        hideEffect: 'blind'
                    });
                }
                spinner.wijpopup('show', {
                    of: this.element,
                    my: 'center center',
                    at: 'center center'
                });
            }
            this.xhr = $.ajax($.extend({
            }, o.ajaxOptions, {
                url: url,
                dataType: 'html',
                success: function (r, s) {
                    $(p).html(r);
                    if(o.cache) {
                        // if loaded once do not load them again
                        $.data(p, 'cache.wijwizard', true);
                    }
                    // callbacks
                    self._trigger('load', null, self._ui(self.panels[index]));
                    try  {
                        if(o.ajaxOptions && o.ajaxOptions.success) {
                            o.ajaxOptions.success(r, s);
                        }
                    } catch (e1) {
                    }
                },
                error: function (xhr, s, e) {
                    // callbacks
                    self._trigger('load', null, self._ui(self.panels[index]));
                    try  {
                        // Passing index avoid a race condition when this method is
                        // called after the user has selected another panel.
                        if(o.ajaxOptions && o.ajaxOptions.error) {
                            o.ajaxOptions.error(xhr, s, index, p);
                        }
                    } catch (e2) {
                    }
                }
            }));
            // last, so that load event is fired before show...
            self.element.dequeue("wijwizard");
            return self;
        };
        wijwizard.prototype.abort = function () {
            /// <summary>
            /// The abort method terminates all running panel ajax requests and animations.
            /// Code example:
            ///		$("#wizard").wijwizard("abort");
            /// </summary>
            this.element.queue([]);
            this.panels.stop(false, true);
            // "wijwizard" queue must not contain more than two elements,
            // which are the callbacks for hide and show
            this.element.queue("wijwizard", this.element.queue("wijwizard").splice(-2, 2));
            // terminate pending requests from other wijwizard
            if(this.xhr) {
                this.xhr.abort();
                delete this.xhr;
            }
            // take care of spinners
            this._removeSpinner();
            return this;
        };
        wijwizard.prototype.url = function (index, url) {
            /// <summary>
            /// The url method changes the url from which an Ajax (remote) panel will be loaded.
            /// </summary>
            /// <param name="index" type="Number">
            /// The zero-based index of the panel of which its URL is to be updated.
            /// </param>
            /// <param name="url" type="String">
            /// A URL the content of the panel is loaded from.
            /// </param>
            /// Code example:
            ///		$("#wizard").wijwizard("url", index, url);
            this.panels.eq(index).removeData('cache.wijwizard').data('load.wijwizard', url);
            return this;
        };
        wijwizard.prototype.count = function () {
            /// <summary>The count method retrieves the number panels.</summary>
            /// Code example:
            ///		$("#wizard").wijwizard("count");
            return this.panels.length;
        };
        wijwizard.prototype.stop = function () {
            /// <summary>
            /// The stop method stops displaying the panels in order automatically.
            /// </summary>
            /// Code example:
            ///		$("#wizard").wijwizard("stop");
            var id = this.element.data('intId.wijwizard');
            if(id) {
                window.clearInterval(id);
                this.element.removeData('intId.wijwizard');
            }
        };
        wijwizard.prototype.play = function () {
            var _this = this;
            /// <summary>
            /// The play method begins displaying the panels in order automatically.
            /// Code example:
            ///		$("#wizard").wijwizard("play");
            /// </summary>
                        var o = this.options, id, len = this.panels.length;
            if(!this.element.data('intId.wijwizard')) {
                id = window.setInterval(function () {
                    var index = o.activeIndex + 1;
                    if(index >= len) {
                        if(o.loop) {
                            index = 0;
                        } else {
                            _this.stop();
                            return;
                        }
                    }
                    _this.show(index);
                }, o.delay);
                this.element.data('intId.wijwizard', id);
            }
        };
        return wijwizard;
    })(wijmo.wijmoWidget);
    wijmo.wijwizard = wijwizard;    
    wijwizard.prototype._defaults = {
        stepHeaderTemplate: '<li><h1>#{title}</h1>#{desc}</li>',
        panelTemplate: '<div></div>',
        spinner: '<em>Loading&#8230;</em>'
    };
    wijwizard.prototype.options = $.extend(true, {
    }, wijmo.wijmoWidget.prototype.options, {
        wijCSS: /// <summary>
        /// All CSS classes used in widgets.
        /// </summary>
        {
            wijwizard: "wijmo-wijwizard",
            wijwizardButtons: "wijmo-wijwizard-buttons",
            wijwizardPrev: "wijmo-wijwizard-prev",
            wijwizardNext: "wijmo-wijwizard-next",
            wijwizardSteps: "wijmo-wijwizard-steps",
            wijwizardContent: "wijmo-wijwizard-content",
            wijwizardPanel: "wijmo-wijwizard-panel",
            wijwizardActived: "wijmo-wijwizard-actived",
            wijwizardHide: "wijmo-wijwizard-hide",
            wijwizardSpinner: "wijmo-wijwizard-spinner"
        },
        wijMobileCSS: {
            header: "ui-header ui-bar-a",
            content: "ui-body-c",
            stateDefault: "ui-btn-up-a",
            stateHover: "ui-btn-down-a",
            stateActive: "ui-btn-down-a"
        },
        navButtons: /// <summary>
        /// The navButtons option defines the type of navigation buttons
        /// used with the wijwizard.
        /// The possible values are 'auto', 'common', 'edge' and 'none'.
        /// Type: String.
        /// Default: 'auto'.
        /// Code example:
        ///		$(".selector").wijwizard({navButtons: ¡®auto¡¯});
        /// </summary>
        'auto',
        autoPlay: /// <summary>
        /// The autoPlay option allows the panels to automatically display in order.
        /// Type: Boolean.
        /// Default: false.
        /// Code example:
        ///		$(".selector").wijwizard({autoPlay: false});
        /// </summary>
        false,
        delay: /// <summary>
        /// The delay option determines the time span between displaying panels in autoplay mode.
        /// Type: number.
        /// Default: 3000.
        /// Code example:
        ///		$(".selector").wijwizard({delay: 1000});
        /// </summary>
        3000,
        loop: /// <summary>
        /// The loop option allows the wijwizard to begin again from the first panel
        /// when reaching the last panel in autoPlay mode.
        /// Type: Boolean.
        /// Default: false.
        /// Code example:
        ///		$(".selector").wijwizard({loop: true});
        /// </summary>
        false,
        hideOption: /// <summary>
        /// The hideOption option defines the animation effects
        /// when hiding the panel content.
        /// Type: Object.
        /// Default: {fade: true}.
        /// Code example:
        ///		$(".selector").wijwizard({
        ///			hideOption: {fade: false, blind: true, duration: 500}
        ///		});
        /// </summary>
        {
            fade: true
        },
        showOption: /// <summary>
        /// The showOption option defines the animation effects
        /// when showing the panel content.
        /// Type: Object.
        /// Default: { fade: true, duration: 400 }.
        /// Code example:
        ///		$(".selector").wijwizard({
        ///			showOption: {fade: false, blind: true, duration: 500}
        ///		});
        /// </summary>
        {
            fade: true,
            duration: 400
        },
        ajaxOptions: /// <summary>
        /// A value that indicates additional Ajax options to consider when
        /// loading panel content (see $.ajax).
        /// Please see following link for more details,
        /// http://api.jquery.com/jQuery.ajax/
        /// Type: Object.
        /// Default: null.
        /// </summary>
        null,
        cache: /// <summary>
        /// An option that determines whether to cache emote wijwizard content.
        /// Cached content is being lazy loaded,
        /// for example only and only once for the panel is displayed.
        /// Note that to prevent the actual Ajax requests from being cached by the browser,
        /// you need to provide an extra cache: false flag to ajaxOptions.
        /// Type: Boolean.
        /// Default: false.
        /// Code example:
        ///		$(".selector").wijwizard({cache:true});
        /// </summary>
        false,
        cookie: /// <summary>
        /// The cookie option is a value that stores the latest active index in a cookie.
        /// The cookie is then used to determine the initially active index
        /// if the activeIndex option is not defined.
        /// This option requires a cookie plugin.
        /// The object needs to have key/value pairs
        /// of the form the cookie plugin expects as options.
        /// Type: Object.
        /// Default: null.
        /// Code example:
        ///		$(".selector").wijwizard({cookie:{expires: 7, path: '/', domain:  'jquery.com';, secure: true }})
        /// </summary>
        null,
        stepHeaderTemplate: /// <summary>
        /// The stepHeaderTemplate option creates an HTML template
        /// for the step header when a new panel is added with the
        /// add method or when creating a panel for a remote panel on the fly.
        /// Type: String.
        /// Default: ''.
        /// Code example:
        ///		$(".selector").wijwizard({stepHeaderTemplate:¡¯<li><h1>"#{title}"</h1>"#{desc}"</li>¡¯});
        /// </summary>
        '',
        panelTemplate: /// <summary>
        /// The panelTemplate option is an HTML template
        /// from which a new panel is created.
        /// The new panel is created by adding a panel
        /// with the add method or when creating
        /// a panel from a remote panel on the fly.
        /// Type: String.
        /// Default: ''.
        /// Code example:
        ///		$(".selector").wijwizard({panelTemplate:¡¯<div></div>¡¯});
        /// </summary>
        '',
        spinner: /// <summary>
        /// The HTML content of this string is shown in a panel
        /// while remote content is loading.
        /// Pass the option in empty string to deactivate that behavior.
        /// Type: String.
        /// Default: ''.
        /// Code example:
        ///		$(".selector").wijwizard({spinner: '<em>Loading¡­</em>'});
        /// </summary>
        '',
        backBtnText: /// <summary>
        /// The backBtnText option defines the text for the wizard back button.
        /// Type: String.
        /// Default: 'back'.
        /// Code example:
        ///		$("#selector").wijwizard("option", "backBtnText", "Back Button");
        /// </summary>
        'back',
        nextBtnText: /// <summary>
        /// The nextBtnText option defines the text for the wijwizard next button.
        /// Type: String.
        /// Default: 'next'.
        /// Code example:
        ///		$("#selector").wijwizard("option", "nextBtnText", "next Button");
        /// </summary>
        'next',
        add: /// <summary>
        /// The add event handler is a function called when a panel is added.
        /// Default: null.
        /// Type: Function.
        /// Code example: $("#element").wijwizard({ add: function (e, ui) { } });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="ui" type="Object">
        /// The data that contains the related ui elements.
        /// ui.panel: The panel element.
        /// ui.index: The index of the panel.
        ///</param>
        null,
        remove: /// <summary>
        /// The remove event handler is a function called when a panel is removed.
        /// Default: null.
        /// Type: Function.
        /// Code example: $("#element").wijwizard({ remove: function (e, ui) { } });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="ui" type="Object">
        /// The data that contains the related ui elements.
        /// ui.panel: The panel element.
        /// ui.index: The index of the panel.
        ///</param>
        null,
        activeIndexChanged: /// <summary>
        /// The activeIndexChanged event handler is
        /// a function called when the activeIndex is changed.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// $("#element").wijwizard({ activeIndexChanged: function (e, ui) { } });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="ui" type="Object">
        /// The data that contains the related ui elements.
        /// ui.panel: The panel element.
        /// ui.index: The index of the panel.
        ///</param>
        null,
        show: /// <summary>
        /// The show event handler is a function called when a panel is shown.
        /// Default: null.
        /// Type: Function.
        /// Code example: $("#element").wijwizard({ show: function (e, ui) { } });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="ui" type="Object">
        /// The data that contains the related ui elements.
        /// ui.panel: The panel element.
        /// ui.index: The index of the panel.
        ///</param>
        null,
        load: /// <summary>
        /// The load event handler is
        /// a function called after the content of a remote panel has been loaded.
        /// Default: null.
        /// Type: Function.
        /// Code example: $("#element").wijwizard({ load: function (e, ui) { } });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="ui" type="Object">
        /// The data that contains the related ui elements.
        /// ui.panel: The panel element.
        /// ui.index: The index of the panel.
        ///</param>
        null,
        validating: /// <summary>
        /// The validating event handler is
        /// a function called before moving to next panel.
        /// This event is Cancellable.
        /// Default: null.
        /// Type: Function.
        /// Code example:
        /// $("#element").wijwizard({ validating: function (e, ui) { } });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <param name="ui" type="Object">
        /// The data that contains the related ui elements.
        /// ui.panel: The panel element.
        /// ui.index: The index of the panel.
        /// ui.nextPanel: The next panel element.
        /// ui.nextIndex: The index of the next panel.
        ///</param>
        null
    });
    $.wijmo.registerWidget("wijwizard", wijwizard.prototype);
})(wijmo || (wijmo = {}));
