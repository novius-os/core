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
/// <reference path="../wijutil/jquery.wijmo.wijutil.ts"/>
/// <reference path="../Base/jquery.wijmo.widget.ts"/>
/*
* Depends:
*  jquery.ui.core.js
*  jquery.ui.widget.js
*  jquery.ui.position.js
*
*/
$.fn.extend({
    getBounds: function () {
        return $.extend({
        }, $(this).offset(), {
            width: $(this).outerWidth(true),
            height: $(this).outerHeight(true)
        });
    },
    setBounds: function (bounds) {
        $(this).css({
            'left': bounds.left,
            'top': bounds.top
        }).width(bounds.width).height(bounds.height);
        return this;
    },
    getMaxZIndex: function () {
        var max = (($(this).css('z-index') == 'auto') ? 0 : $(this).css('z-index')) * 1;
        $(this).siblings().each(function (i, e) {
            max = Math.max(max, (($(e).css('z-index') == 'auto') ? 0 : $(e).css('z-index')) * 1);
        });
        return Math.max(max, $(this).zIndex());
    }
});
var wijmo;
(function (wijmo) {
    (function (popup) {
        /** @widget */
        var wijpopup = (function (_super) {
            __extends(wijpopup, _super);
            function wijpopup() {
                _super.apply(this, arguments);

            }
            wijpopup.prototype._init = function () {
                this.elementZIndex = this.element.zIndex();
                if(!!this.options.ensureOutermost) {
                    var root = $('form');
                    if(root.length === 0) {
                        root = $(document.body);
                    }
                    this.element.appendTo(root);
                }
                this.element.data('visible.wijpopup', false);
                this.element.css('position', "absolute");
                this.element.position({
                    of: $(document.body)
                });
                this.element.hide();
            };
            wijpopup.prototype._setOption = function (key, value) {
                _super.prototype._setOption.call(this, key, value);
                if(key === 'autoHide') {
                    var visible = this.isVisible();
                    this.hide();
                    if(visible) {
                        this.show();
                    }
                }
            };
            wijpopup.prototype.destroy = /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            function () {
                _super.prototype.destroy.call(this);
                if(this.isVisible()) {
                    this.hide();
                }
                if($.browser.msie && (parseInt($.browser.version) < 7)) {
                    var jFrame = this.element.data('backframe.wijpopup');
                    if(!jFrame) {
                        jFrame.remove();
                    }
                }
                var self = this;
                this.element.unbind('.wijpopup');
                $.each([
                    "visible", 
                    "backframe", 
                    "animating", 
                    "width"
                ], function (i, prefix) {
                    self.element.removeData(prefix + ".wijpopup");
                });
            };
            wijpopup.prototype.isVisible = /** Determines whether the element is visible. */
            function () {
                return (!!this.element.data('visible.wijpopup') && this.element.is(':visible'));
            };
            wijpopup.prototype.isAnimating = /** @ignore */
            function () {
                return !!this.element.data("animating.wijpopup");
            };
            wijpopup.prototype.show = /** Popups the element.
            *  Position is an optional argument, it is the options object used in jquery.ui.position.
            * @param {?object} position An optional argument, it is the options object used in jquery.ui.position.
            */
            function (position) {
                var self = this;
                this._setPosition(position);
                if(this.isVisible()) {
                    return;
                }
                if(this._trigger('showing') === false) {
                    return;
                }
                if(this.options.autoHide) {
                    window.setTimeout(function () {
                        self._bindDocMouseUpEvent();
                    }, 0);
                }
                var effect = this.options.showEffect || "show";
                var duration = this.options.showDuration || 300;
                var ops = this.options.showOptions || {
                };
                this.element.data("animating.wijpopup", true);
                if($.effects && $.effects.effect[effect]) {
                    this.element.show(effect, ops, duration, $.proxy(this._showCompleted, this));
                } else {
                    this.element[effect]((effect === 'show' ? null : duration), $.proxy(this._showCompleted, this));
                }
                if(!effect || !duration || effect === 'show' || duration <= 0) {
                    this._showCompleted();
                }
            };
            wijpopup.prototype._showCompleted = function () {
                this.element.removeData("animating.wijpopup");
                this.element.data('visible.wijpopup', true);
                this._trigger('shown');
            };
            wijpopup.prototype.showAt = /** Popups the element at specified absolute position related to document.
            * @param {number} x The x coordinate at which to show the popup.
            * @param {number} y The y coordinate at which to show the popup.
            * @example
            *  // set the popup position is "100, 100" that related to document.
            *  $(".selector").wijpopup('showAt', 100, 100);
            */
            function (x, y) {
                this.show({
                    my: //jquery 1.10: offset has removed
                    //my: 'left top',
                    'left+' + x + ' top+' + y,
                    at: 'left top',
                    of: document.body
                });
                //,
                //jquery 1.10: offset has removed
                //offset: '' + x + ' ' + y
                            };
            wijpopup.prototype.hide = /** Hides the element. */
            function () {
                if(!this.isVisible()) {
                    return;
                }
                if(this._trigger('hiding') === false) {
                    this._bindDocMouseUpEvent();
                    return;
                }
                //$(document).unbind('mouseup.wijpopup');
                var effect = this.options.hideEffect || "hide";
                var duration = this.options.hideDuration || 300;
                var ops = this.options.hideOptions || {
                };
                this.element.data("animating.wijpopup", true);
                if($.effects && $.effects.effect[effect]) {
                    this.element.hide(effect, ops, duration, $.proxy(this._hideCompleted, this));
                } else {
                    this.element[effect]((effect === 'hide' ? null : duration), $.proxy(this._hideCompleted, this));
                }
                if(!effect || !duration || effect === 'hide' || duration <= 0) {
                    this._hideCompleted();
                }
            };
            wijpopup.prototype._hideCompleted = function () {
                if(this.element.data('width.wijpopup') !== undefined) {
                    this.element.width(this.element.data('width.wijpopup'));
                    this.element.removeData('width.wijpopup');
                }
                this.element.unbind('move.wijpopup');
                this.element.removeData("animating.wijpopup");
                if($.browser.msie && (parseInt($.browser.version) < 7)) {
                    var jFrame = this.element.data('backframe.wijpopup');
                    if(jFrame) {
                        jFrame.hide();
                    }
                }
                this._trigger('hidden');
            };
            wijpopup.prototype._onDocMouseUp = // fix the issue 42892, the widget bind mouseup to document widget, and when call hide method, it will
            // unbind the mouseup event, it use namespace to bind/unbind the event. If there are more than one popup
            // widget in a page, when hide one, it will unbind the others's mouseup event will unbind.
            // here use one instead of bind, and if mouse click inside of the element, the event should bind one more time.
            // If use one popup inside another popup, this argument will wrong. so when bind the event, send this to event arguments.
            function (e, self) {
                var srcElement = e.target ? e.target : e.srcElement;
                if(self.isVisible() && !!self.options.autoHide) {
                    if(srcElement != self.element.get(0) && $(srcElement).parents().index(self.element) < 0) {
                        self.hide();
                    } else {
                        this._bindDocMouseUpEvent();
                    }
                }
            };
            wijpopup.prototype._bindDocMouseUpEvent = function () {
                var _this = this;
                $(document).one('mouseup.wijpopup', function (e) {
                    _this._onDocMouseUp(e, _this);
                });
            };
            wijpopup.prototype._onMove = function (e) {
                var jFrame = this.element.data('backframe.wijpopup');
                if(jFrame) {
                    this.element.before(jFrame);
                    jFrame.css({
                        'top': this.element.css('top'),
                        'left': this.element.css('left')
                    });
                }
            };
            wijpopup.prototype._addBackgroundIFrame = function () {
                if($.browser.msie && (parseInt($.browser.version) < 7)) {
                    var jFrame = this.element.data('backframe.wijpopup');
                    if(!jFrame) {
                        jFrame = jQuery('<iframe/>').css({
                            'position': 'absolute',
                            'display': 'none',
                            'filter': 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'
                        }).attr({
                            'src': 'javascript:\'<html></html>\';',
                            'scrolling': 'no',
                            'frameborder': '0',
                            'tabIndex ': -1
                        });
                        this.element.before(jFrame);
                        this.element.data('backframe.wijpopup', jFrame);
                        this.element.bind('move.wijpopup', $.proxy(this._onMove, this));
                    }
                    jFrame.setBounds(this.element.getBounds());
                    jFrame.css({
                        'display': 'block',
                        'left': this.element.css('left'),
                        'top': this.element.css('top'),
                        'z-index': this.element.css('z-index') - 1
                    });
                }
            };
            wijpopup.prototype._setZIndex = function (index) {
                this.element.css('z-index', index);
                var jFrame = this.element.data('backframe.wijpopup');
                if(jFrame) {
                    jFrame.css('z-index', (this.element.css('z-index')) - 1);
                }
            };
            wijpopup.prototype._setPosition = function (position) {
                var visible = this.element.is(':visible'), of;
                this.element.show();
                this.element.position($.extend({
                }, this.options.position, position ? position : {
                }));
                if(!visible) {
                    this.element.hide();
                }
                if(position) {
                    of = position.of;
                }
                if(!of) {
                    of = this.options.position.of;
                }
                this._addBackgroundIFrame();
                var zIndex = Math.max(1000, this.elementZIndex);
                if(of) {
                    zIndex = Math.max(zIndex, $(of).getMaxZIndex());
                }
                this._setZIndex(zIndex + 10);
                this._trigger('posChanged');
            };
            return wijpopup;
        })(wijmo.JQueryUIWidget);
        popup.wijpopup = wijpopup;        
        var wijpopup_options = (function () {
            function wijpopup_options() {
                /** Determines if the element's parent element is the outermost element.
                * @remarks
                *  If true, the element's parent element will be changed to
                *  the body or outermost form element.
                */
                this.ensureOutermost = false;
                /** Specifies the effect to be used when the popup is shown.
                * @remarks
                *  This allows you to use a different effect when you show the popup
                *  than when you hide the popup.(See also hideEffect.) Possible values
                *  include 'blind', 'clip', 'drop', 'fade', 'fold', 'slide', and 'pulsate'.
                *  See the jQuery UI / Effects page for more information.
                */
                this.showEffect = 'show';
                /** Specifies the object/hash including specific options for the show effect.
                * @type {object}
                * @remarks
                *  See the option parameters used by the jQuery UI show effect for more information.
                * @example
                *       // set the show effect's direction.
                *       $(".selector").wijpopup({ showOptions: {direction: 'up' });
                */
                this.showOptions = {
                };
                /** A value that indicates the number of milliseconds it takes for the
                *  indicated animation effect to completely show the popup.
                * @remarks
                *  This allows you to use a different number of milliseconds when you
                *  show the popup than when you hide the popup.(See also hideDuration.)
                */
                this.showDuration = 300;
                /** Specifies the effect to be used when the popup is hidden.
                * @remarks
                *  This allows you to use a different effect when you show the popup than
                *  when you hide the popup.(See also showEffect.)
                *  Possible values include 'blind', 'clip', 'drop', 'fade', 'fold', 'slide',
                *  and 'pulsate'.See the jQuery UI / Effects page for more information.
                */
                this.hideEffect = 'hide';
                /** Specifies the object/hash including specific options for the hide effect.
                * @remarks
                *  See the option parameters used by the jQuery UI hide effect for more information.
                * @example
                *       // set the hide effect's direction.
                *       $(".selector").wijpopup({ hideOptions: {direction: 'up' });
                */
                this.hideOptions = {
                };
                /** A value that indicates the number of milliseconds it takes for the
                *  indicated animation effect to completely hide the popup.
                * @remarks
                *  This allows you to use a different number of milliseconds when
                *  you show the popup than when you hide the popup.(See also showDuration.)
                */
                this.hideDuration = 100;
                /** Determines whether to automatically hide the popup when clicking outside the element.
                * @remarks
                *  If true, the popup will be automatically hidden when another element is selected.
                *  If false (default), the popup will remain visible until hidden with the hide method.
                */
                this.autoHide = false;
                /** Options for positioning the element, please see jquery.ui.position for possible options.
                * @type {object}
                * @example
                *  // positioning the element, located on "#TextBox1" and up offset is 4
                *  $(".selector").wijpopup({ position:{ of: $('#TextBox1'), offset: '0 4' }});
                */
                this.position = {
                    at: 'left bottom',
                    my: 'left top'
                };
                /** The showing event handler.
                * A function called before the element is shown. Cancellable.
                * @remarks
                *     This is a cancelable event.You can set data.cancel = true to cancel the element to be shown.
                * @event
                */
                this.showing = null;
                /** The shown event handler. A function called after the element is shown.
                * @event
                */
                this.shown = null;
                /** The hiding event handler.
                * A function called before the element is hidden. Cancellable.
                * @remarks
                *     This is a cancelable event. You can set data.cancel = true to cancel the element to be hidden.
                * @event
                * @dataKey {boolean} cancel Cancel the element to be hidden if true.
                */
                this.hiding = null;
                /** The hidden event handler. A function called after the element is hidden.
                * @event
                */
                this.hidden = null;
                /** The posChanged event handler.
                *   A function called when the position of the element is changed.
                * @event
                */
                this.posChanged = null;
            }
            return wijpopup_options;
        })();        
        ;
        wijpopup.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijpopup_options());
        $.wijmo.registerWidget("wijpopup", wijpopup.prototype);
    })(wijmo.popup || (wijmo.popup = {}));
    var popup = wijmo.popup;
})(wijmo || (wijmo = {}));
