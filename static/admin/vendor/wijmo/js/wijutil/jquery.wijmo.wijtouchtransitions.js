/*
 *
 * Wijmo Library 3.20141.34
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 * ----
 * Credits: Wijmo includes some MIT-licensed software, see copyright notices below.
 */
/*globals window*/
/*
 * Depends:
 *	jquery.effects.core.js
 *
 */

$(document).ready(function () {
	var userAgent = window.navigator.userAgent,
		isAndroidVerBellow2_2 = userAgent.match(new RegExp("android ((1\\.)|(2\\.([^345]+)))", "i")),
		areTransformsSupported = ((window.WebKitCSSMatrix) ? !isAndroidVerBellow2_2 : false), 
		isWebKitEnabled = !!(typeof userAgent == "string" && userAgent.match(/applewebkit/)),
		isTouchDevice = "ontouchend" in document,
		div = document.createElement('div'),
		cssTransitionsSupported;
	div.setAttribute('style', 'transition:top 1s ease;-webkit-transition:top 1s ease;-moz-transition:top 1s ease;-o-transition:top 1s ease;');
	document.body.appendChild(div);
	cssTransitionsSupported = !!(div.style.transition || div.style.webkitTransition || div.style.MozTransition || div.style.OTransitionDuration);
	div.parentNode.removeChild(div);
	div = null;

	// prevent transition flickering for iTouch devices:
	function with3DAcceleration(element, action, args) {
	    var property = "-webkit-transform",
            enabler = "translate3d(0,0,0)",
	        origValue = element.css(property);

	    var isNone = !(origValue && origValue.match(/^\s*none\s*$/i));
	    element.css(property, isNone ? enabler : origValue + " " + enabler);
	    try {
	        return action.apply(this, args);
	    } finally {
	        element.css(property, origValue);
	    }
	}


	var $animate = jQuery.fn.animate;
	jQuery.fn.animate = function (prop, speed, easing, callback) {
	    if (!isWebKitEnabled || !webKitTransition.apply(this, arguments)) {
	        return with3DAcceleration.call(this, this, function () {
	            return $animate.apply(this, arguments);
	        }, arguments);
		}
	};


	function webKitTransition(prop, speed, easing, callback) {
		var result = false, propVal, newVal,
			speedOpt = $.speed(speed, easing, callback),
			self = this;
		if (!prop) {
			return false;
		}

		for (var k in prop) {
			propVal = prop[k];
			if (k === "height") {
				if (propVal === "hide") {
					this.css("display", "none");
					result = true;
					speedOpt.complete();
					//result = true;
					//fadeOut(this[0], speedOpt.duration, "linear", speedOpt.complete);
				} else if (propVal === "show") {
					this.css("display", "");
					result = true;
					speedOpt.complete();
					//result = true;
					//fadeIn(this[0], speedOpt.duration, "linear", speedOpt.complete);
				}
			} else if (k === "width") {
				if (propVal === "hide") {
					this.css("display", "none");
					result = true;
					speedOpt.complete();
					//result = true;
					//fadeOut(this[0], speedOpt.duration, "linear", speedOpt.complete);
				} else if (propVal === "show") {
					this.css("display", "");
					result = true;
					speedOpt.complete();
					//result = true;
					//fadeIn(this[0], speedOpt.duration, "linear", speedOpt.complete);
				}
			} else if (k === "left") {
				newVal = this.css("left").replace("px", "") * 1;

				if (typeof propVal === "string") {
					if (propVal.indexOf("-=") === 0) {
						newVal = newVal -
                                propVal.replace("-=", "") * 1;
					}
					else if (propVal.indexOf("+=") === 0) {
						newVal = newVal +
                                propVal.replace("+=", "") * 1;
					}
				}

				result = true;
				/*
				var completeTranslateTransition = $.proxy(function () {
				speedOpt.complete();
				}, this);
				*/
				// prevent flickering for iTouch devices:
				this.css("-webkit-perspective", 1000);
				this.css("-webkit-backface-visibility", "hidden");
				//
				//-webkit-perspective: 1000;
				//: ;  
				scrollToX(this[0], newVal, speedOpt.duration, "linear", speedOpt.complete);
				//speedOpt.complete();
			}
		}

		return result;
	}

	/// <summary>
	/// Hide the element by fading it to transparent.
	/// </summary>
	/// <param name="element" type="Object">
	///	DOM Element
	///	</param>
	/// <param name="duration" type="Number">
	///	Transition duration in milliseconds.
	///	</param>
	/// <param name="timing" type="String">
	///	String, easing type. 
	///	Available values are: ease, linear, ease-in, ease-out, ease-in-out.
	///	</param>
	/// <param name="endHandler" type="Function">
	///	Transition end handler.
	///	</param>
	function fadeOut(element, duration, timing, endHandler) {
	    if (cssTransitionsSupported) {
	        if (!timing) {
	            timing = "ease";
	        }
	        setupTransition(element, "opacity", duration, timing);
	        setOpacity(element, 0);

	        element.addEventListener("webkitTransitionEnd", $.proxy(function () {
	            clearTransition(element);
	            element.style.display = "none";
	            setOpacity(element, 1);
	            if (endHandler) {
	                endHandler();
	            }
	        }, this), false);
	    }
	    else {
	        //jQuery(element).animate({left: + x + "px"}), duration, 'linear', endHandler);
	    }
	}

	/// <summary>
	/// Display the element by fading it to opaque.
	/// </summary>
	/// <param name="element" type="Object">
	///	DOM Element
	///	</param>
	/// <param name="duration" type="Number">
	///	Transition duration in milliseconds.
	///	</param>
	/// <param name="timing" type="String">
	///	String, easing type. 
	///	Available values are: ease, linear, ease-in, ease-out, ease-in-out.
	///	</param>
	/// <param name="endHandler" type="Function">
	///	Transition end handler.
	///	</param>
	function fadeIn(element, duration, timing, endHandler) {
	    if (cssTransitionsSupported) {
	        if (!timing) {
	            timing = "ease";
	        }
	        setupTransition(element, "opacity", duration, timing);
	        setOpacity(element, 1);

	        element.addEventListener("webkitTransitionEnd", $.proxy(function () {
	            clearTransition(element);
	            if (element.style.display === "none") {
	                element.style.display = "";
	            }
	            if (endHandler) {
	                endHandler();
	            }
	        }, this), false);
	    }
	    else {
	        //jQuery(element).animate({left: + x + "px"}), duration, 'linear', endHandler);
	    }
	}

	/// <summary>
	/// Scroll element horizontally using webkit transitions.
	/// </summary>
	/// <param name="element" type="Object">
	///	DOM Element
	///	</param>
	/// <param name="x" type="Number">
	///	The new translate value.
	///	</param>
	/// <param name="duration" type="Number">
	///	Transition duration in milliseconds.
	///	</param>
	/// <param name="timing" type="String">
	///	String, easing type. 
	///	Available values are: ease, linear, ease-in, ease-out, ease-in-out.
	///	</param>
	/// <param name="endHandler" type="Function">
	///	Transition end handler.
	///	</param>
	function scrollToX(element, x, duration, timing, endHandler) {
	    if (cssTransitionsSupported) {
	        setupTransitionTransform(element, duration, timing);
	        setTranslateX(element, x);
	        element.___animationEndHandler = endHandler;
	        element.___internalEndHandler = $.proxy(_onScrollTransitionEnd, {});
	        element.addEventListener("webkitTransitionEnd", element.___internalEndHandler, false);
	    }
	    else {
	        //jQuery(element).animate({left: + x + "px"}), duration, 'linear', endHandler);
	    }
	}

	/// <summary>
	/// Set opacity value.
	/// </summary>
	/// <param name="element" type="Object">
	///	DOM Element or style object.
	///	</param>
	/// <param name="value" type="Number">
	///	The new opacity value.
	///	</param>
    function setOpacity(element, value) {
	    var st;
	    if (cssTransitionsSupported) {
	        st = element.style || element;
	        st.opacity = value;
	    }
	    else {

	    }
	}


	/// <summary>
	/// Set translate X value. This method will use left style for non-webkit browsers.
	/// </summary>
	/// <param name="element" type="Object">
	///	DOM Element or style object.
	///	</param>
	/// <param name="value" type="Number">
	///	The new translate value.
	///	</param>
    function setTranslateX(element, value) {
	    var st;
	    if (cssTransitionsSupported) {
	        element.___translateX = value;
	        st = element.style || element;
	        //st.webkitTransform = "translate3d(" + value + "px," + getTranslateY(element) + "px, 0)";
	        st.webkitTransform = "translateX(" + value + "px)";
	    }
	    else {
	        element.style.left = value + "px";
	    }
	}

	/// <summary>
	/// Set translate Y value. This method will use top style for non-webkit browsers.
	/// </summary>
	/// <param name="element" type="Object">
	///	DOM Element or style object.
	///	</param>
	/// <param name="value" type="Number">
	///	The new translate value.
	///	</param>
    function setTranslateY(element, value) {
	    var st;
	    if (cssTransitionsSupported) {
	        element.___translateY = value;
	        st = element.style || element;
	        //st.webkitTransform = "translate3d(" + getTranslateX(element) + "px," + value + "px, 0)";
	        st.webkitTransform = "translateY(" + value + "px)";
	    }
	    else {
	        element.style.top = value + "px";
	    }
	}

	/// <summary>
	/// Gets translate X value. This method will return left style for non-webkit browsers.
	/// </summary>
    function getTranslateX(element) {
	    var style, transform, r, match, k;
	    if (!element) {
	        return 0;
	    }
	    if (cssTransitionsSupported) {
	        style = element.style || element;
	        transform = style.webkitTransform;
	        if (typeof transform === "string") {
	            r = new RegExp("translate(3d|X|)\\(-*(\\d+)");
	            match = r.exec(transform);
	            if (match) {
	                k = parseFloat(match[1]);
	                if (isFinite(k)) {
	                    return k;
	                }
	            }
	        }
	    }
	    else {
	        var k = parseInt($(element).css("left"));
	        if (isFinite(k)) {
	            return k;
	        }
	    }
	    return 0;
	}

	/// <summary>
	/// Gets translate Y value. This method will return top style for non-webkit browsers.
	/// </summary>
    function getTranslateY(element) {
	    var style, transform, r, match, k;
	    if (!element) {
	        return 0;
	    }
	    if (cssTransitionsSupported) {
	        style = element.style || element;
	        transform = style.webkitTransform;
	        if (typeof transform === "string") {
	            r = new RegExp("translate(3d|X|)\\(.*,\\s*-*(\\d+)");
	            match = r.exec(transform);
	            if (match) {
	                k = parseFloat(match[1]);
	                if (isFinite(k)) {
	                    return k;
	                }
	            }
	        }
	    }
	    else {
	        var k = parseInt(jQuery(element).css("top"));
	        if (isFinite(k)) {
	            return k;
	        }
	    }
	    return 0;
	}

	/// <summary>
	/// Call this method in order to setup transition for transform animation.
	/// </summary>
	/// <param name="duration" type="Number">
	///	Transition duration in milliseconds.
	///	</param>
	/// <param name="timing" type="String">
	///	String, easing type. 
	///	Available values are: ease, linear, ease-in, ease-out, ease-in-out.
	///	</param>
    function setupTransitionTransform(element, duration, timing) {
	    if (!timing) {
	        timing = "ease";
	    }
	    setupTransition(element, "-webkit-transform", duration, timing);
	}

	/// <summary>
	/// Setup transition animation for element given by parameter element.
	/// </summary>
	/// <param name="element" type="Object">
	///	DOM element for transition.
	///	</param>
	/// <param name="properties" type="String">
	///	String, specifies the name of the CSS property to which the transition is applied. 
	///	You can list multiple properties. Property names should be bare, unquoted names.
	///	</param>
	/// <param name="duration" type="Number">
	///	Transition duration in milliseconds.
	///	Available values are: ease, linear, ease-in, ease-out, ease-in-out.
	///	</param>
	/// <param name="timing" type="String">
	///	String, easing type. 
	///	Available values are: ease, linear, ease-in, ease-out, ease-in-out.
	///	</param>
    function setupTransition(element, properties, duration, timing) {
	    if (cssTransitionsSupported) {
	        var style = (element).style;
	        style.webkitTransitionProperty = properties;
	        style.webkitTransitionDuration = duration + 'ms';
	        style.webkitTransitionTimingFunction = timing;
	    }
	}

	/// <summary>
	/// Clear transition animation for element given by parameter element.
	/// </summary>
    function clearTransition(element) {
	    if (cssTransitionsSupported) {
	        var st = element.style;
	        st.webkitTransitionProperty = 'none';
	        var internalEndHandler = element.___internalEndHandler;
	        if (internalEndHandler) {
	            delete element.___internalEndHandler;
	            element.removeEventListener('webkitTransitionEnd', internalEndHandler, false);
	        }
	    }
	}

    function _onScrollTransitionEnd(e) {
	    try {
	        var targetElement, endHandler;
	        switch (e.type) {
	            case "webkitTransitionEnd":
	                targetElement = e.target;
	                if (targetElement) {
	                    clearTransition(targetElement);
	                    if (targetElement.___animationEndHandler) {
	                        endHandler = targetElement.___animationEndHandler;
	                        targetElement.___animationEndHandler = null;
	                        endHandler(e);
	                    }
	                }
	                break;
	        }
	    }
	    catch (ex) {
	        if (window.console && window.console.log) {
	            window.console.log("[ew219290] error: " +
					(ex.message ? ex.message : ex) +
						", event: " + e);
	        }
	    }
	    return true;
	}

});

/*
prop:left=-=1224; jquery.wijmo.wijtouchtransitions.js:11
speed:queue=false;duration=250;easing=easeInQuad;complete=function (){...}
*/
/*
prop:height=hide;paddingTop=hide;paddingBottom=hide; jquery.wijmo.wijtouchtransitions.js:11
speed:step=function (now, settings) {
					        var val;
					        if (settings.prop === options.horizontal ?
													"width" : "height") {
					            percentDone = (settings.end - settings.start === 0) ? 0 :
							(settings.now - settings.start) /
							(settings.end - settings.start);
					        }

					        val = (percentDone * showProps[settings.prop].value);
					        if (val < 0) {
					            //fix for 16943:
					            val = 0;
					        }
					        options.toShow[0].style[settings.prop] =
											val + showProps[settings.prop].unit;

					    };
       duration=300;easing=swing;complete=function () {...}; 
*/

/*
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
*/