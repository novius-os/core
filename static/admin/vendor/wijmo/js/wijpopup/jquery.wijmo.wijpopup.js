/*
 *
 * Wijmo Library 3.20131.4
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
        return max;
    }
});
var wijmo;
(function (wijmo) {
    var WijPopUp = (function (_super) {
        __extends(WijPopUp, _super);
        function WijPopUp() {
            _super.apply(this, arguments);

        }
        WijPopUp.prototype._init = function () {
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
        WijPopUp.prototype._setOption = function (key, value) {
            _super.prototype._setOption.call(this, key, value);
            if(key === 'autoHide') {
                var visible = this.isVisible();
                this.hide();
                if(visible) {
                    this.show();
                }
            }
        };
        WijPopUp.prototype.destroy = function () {
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
        WijPopUp.prototype.isVisible = function () {
            /// <summary>Determines whether the element is visible.</summary>
            /// Determines whether the element is visible.
            /// Code Example: var display = $(".selector").wijpopup('isVisible');
            ///</summary>
            return (!!this.element.data('visible.wijpopup') && this.element.is(':visible'));
        };
        WijPopUp.prototype.isAnimating = function () {
            return !!this.element.data("animating.wijpopup");
        };
        WijPopUp.prototype.show = function (position) {
            var self = this;
            /// <summary>
            /// Popups the element. Position is an optional argument, it is the options object used in jquery.ui.position.
            /// Code Example: $(".selector").wijpopup('show', {offset: ’50 50’});
            /// </summary>
            /// <param name="Position " type="Object">
            /// An optional argument, it is the options object used in jquery.ui.position.
            /// </param>
            this._setPosition(position);
            if(this.isVisible()) {
                return;
            }
            if(this._trigger('showing') === false) {
                return;
            }
            if(this.options.autoHide) {
                window.setTimeout(function () {
                    $(document.body).bind('mouseup.wijpopup', $.proxy(self._onDocMouseUp, self));
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
        WijPopUp.prototype._showCompleted = function () {
            this.element.removeData("animating.wijpopup");
            this.element.data('visible.wijpopup', true);
            this._trigger('shown');
        };
        WijPopUp.prototype.showAt = function (x, y) {
            /// <summary>
            /// Popups the element at specified absolute position related to document.
            /// Code Example: $(".selector").wijpopup('showAt', 100, 100);
            /// </summary>
            /// <param name="x" type="Number">
            /// The x coordinate at which to show the popup.
            /// </param>
            /// <param name="y" type="Number">
            /// The y coordinate at which to show the popup.
            /// </param>
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
        WijPopUp.prototype.hide = function () {
            /// <summary>
            /// Hides the element.
            /// Code Example: $(".selector").wijpopup("hide");
            /// </summary >
            if(!this.isVisible()) {
                return;
            }
            if(this._trigger('hiding') === false) {
                return;
            }
            $(document.body).unbind('mouseup.wijpopup');
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
        WijPopUp.prototype._hideCompleted = function () {
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
        WijPopUp.prototype._onDocMouseUp = function (e) {
            var srcElement = e.target ? e.target : e.srcElement;
            if(this.isVisible() && !!this.options.autoHide) {
                if(srcElement != this.element.get(0) && $(srcElement).parents().index(this.element) < 0) {
                    this.hide();
                }
            }
        };
        WijPopUp.prototype._onMove = function (e) {
            var jFrame = this.element.data('backframe.wijpopup');
            if(jFrame) {
                this.element.before(jFrame);
                jFrame.css({
                    'top': this.element.css('top'),
                    'left': this.element.css('left')
                });
            }
        };
        WijPopUp.prototype._addBackgroundIFrame = function () {
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
        WijPopUp.prototype._setZIndex = function (index) {
            this.element.css('z-index', index);
            var jFrame = this.element.data('backframe.wijpopup');
            if(jFrame) {
                jFrame.css('z-index', (this.element.css('z-index')) - 1);
            }
        };
        WijPopUp.prototype._setPosition = function (position) {
            var visible = this.element.is(':visible');
            this.element.show();
            this.element.position($.extend({
            }, this.options.position, position ? position : {
            }));
            if(!visible) {
                this.element.hide();
            }
            this._addBackgroundIFrame();
            var zIndex = 1000;
            if(this.options.position.of) {
                zIndex = Math.max(zIndex, $(this.options.position.of).getMaxZIndex());
            }
            this._setZIndex(zIndex + 10);
            this._trigger('posChanged');
        };
        return WijPopUp;
    })(wijmo.JQueryUIWidget);
    wijmo.WijPopUp = WijPopUp;    
    WijPopUp.prototype.options = $.extend(true, {
    }, wijmo.JQueryUIWidget.prototype.options, {
        ensureOutermost: ///	<summary>
        /// Determines if the element's parent element is the outermost element.
        /// If true, the element's parent element will be changed to the body or outermost form element.
        /// Type: Boolean
        /// Default: false
        /// Code sample:
        /// $(".selector").wijpopup({ ensureOutermost: true });
        ///	</summary>
        false,
        showEffect: ///	<summary>
        /// Specifies the effect to be used when the popup is shown.
        /// This allows you to use a different effect when you show the popup
        /// than when you hide the popup.(See also hideEffect.) Possible values
        /// include 'blind', 'clip', 'drop', 'fade', 'fold', 'slide', and 'pulsate'.
        /// See the jQuery UI / Effects page for more information.
        /// Type: String
        /// Default: 'show'
        /// Code sample:
        /// The showing effect is "blind".
        /// $(".selector").wijpopup({ showEffect: 'blind' });
        ///	</summary>
        'show',
        showOptions: ///	<summary>
        /// Specifies the object/hash including specific options for the show effect.
        /// Type: Hash
        /// Default: {}
        /// Code Example:
        /// $(".selector").wijpopup({ showOptions: {direction: 'up' });
        ///	</summary>
        /// <remarks>
        /// See the option parameters used by the jQuery UI show effect for more information.
        /// </remarks>
        {
        },
        showDuration: ///	<summary>
        /// A value that indicates the number of milliseconds it takes for the
        /// indicated animation effect to completely show the popup.
        /// This allows you to use a different number of milliseconds when you
        /// show the popup than when you hide the popup.(See also hideDuration.)
        /// Type: Int
        /// Default: 300
        /// Code Example:
        /// $(".selector").wijpopup({ showDuration: 100 });
        ///	</summary>
        300,
        hideEffect: ///	<summary>
        ///	Specifies the effect to be used when the popup is hidden.
        ///	This allows you to use a different effect when you show the popup than
        ///	when you hide the popup.(See also showEffect.)
        ///	Possible values include 'blind', 'clip', 'drop', 'fade', 'fold', 'slide',
        ///	and 'pulsate'.See the jQuery UI / Effects page for more information.
        ///	Type: String
        ///	Default: ‘hide’
        ///	Code Example:
        /// The hide effect is "blind".
        ///	$(".selector").wijpopup({ hideEffect: 'blind' });
        ///	</summary>
        'hide',
        hideOptions: ///	<summary>
        /// Specifies the object/hash including specific options for the hide effect.
        /// See the option parameters used by the jQuery UI hide effect for more information.
        /// Type: Hash
        /// Default: {}
        /// Code Example:
        /// $(".selector").wijpopup({ hideOptions: {direction: 'up' });
        ///	</summary>
        {
        },
        hideDuration: ///	<summary>
        /// A value that indicates the number of milliseconds it takes for the
        /// indicated animation effect to completely hide the popup.
        /// This allows you to use a different number of milliseconds when
        /// you show the popup than when you hide the popup.(See also showDuration.)
        /// Type: Int
        /// Default: 100
        /// Code Example:
        /// $(".selector").wijpopup({ hideDuration: 200 });
        ///	</summary>
        100,
        autoHide: ///	<summary>
        /// Determines whether to automatically hide the popup when clicking outside the element.
        /// If true, the popup will be automatically hidden when another element is selected.
        /// If false (default), the popup will remain visible until hidden with the hide method.
        /// Type: Boolean
        /// Default: false
        /// Code Example:
        /// $(".selector").wijpopup({ autoHide: true });
        ///	</summary>
        false,
        position: ///	<summary>
        /// Options for positioning the element, please see jquery.ui.position for possible options.
        /// Type: Hash
        /// Default: {at: 'left bottom', my: 'left top'}
        /// Code Example:
        /// $(".selector").wijpopup({ position: { of: $('#TextBox1'), offset: '0 4' }});
        ///	</summary>
        {
            at: 'left bottom',
            my: 'left top'
        },
        showing: /// <summary>
        /// The showing event handler. A function called before the element is shown. Cancellable.
        /// Default: null.
        /// Type: Function.
        /// Code example: $("#element").wijpopup({ showing: function (e, args) { } });
        /// </summary>
        /// <remarks>
        /// This is a cancelable event.You can set data.cancel = true to cancel the element to be shown.
        /// </remarks>
        null,
        shown: /// <summary>
        /// The shown event handler. A function called after the element is shown.
        /// Default: null.
        /// Type: Function.
        /// Code example: $("#element").wijpopup({ shown: function (e) { } });
        /// </summary>
        /// <param name="e" type="Object">jQuery.Event object.</param>
        null,
        hiding: /// <summary>
        /// The hiding event handler. A function called before the element is hidden. Cancellable.
        /// Default: null.
        /// Type: Function.
        /// Code example: $("#element").wijpopup({ hiding: function (e) { } });
        /// </summary>
        /// <param name="e" type="Object">jQuery.Event object.</param>
        /// <remarks>
        /// This is a cancelable event. You can set data.cancel = true to cancel the element to be hidden.
        /// </remarks>
        null,
        hidden: /// <summary>
        /// The hidden event handler. A function called after the element is hidden.
        /// Default: null.
        /// Type: Function.
        /// Code example: $("#element").wijpopup({ hidden: function (e) { } });
        /// </summary>
        /// <param name="e" type="Object">jQuery.Event object.</param>
        null,
        posChanged: /// <summary>
        /// The posChanged event handler. A function called when the position of the element is changed.
        /// Default: null.
        /// Type: Function.
        /// Code example: $("#element").wijpopup({ posChanged: function (e) { } });
        /// </summary>
        ///
        /// <param name="e" type="Object">jQuery.Event object.</param>
        null
    });
    $.wijmo.registerWidget("wijpopup", WijPopUp.prototype);
})(wijmo || (wijmo = {}));
