/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-tray",["jquery-nos"],function(a){a.fn.extend({nosTray:function(e){var d,b=window.document,c=b.fullscreenEnabled||b.mozFullScreenEnabled||b.webkitFullscreenEnabled;e=e||{buttons:{}};d=e.buttons;if(d.fullscreen){if(c){d.fullscreen.bind={click:function(){var f=b.documentElement;if(b.fullscreen||b.mozFullScreen||b.webkitFullscreen){if(b.exitFullscreen){b.exitFullscreen()}else{if(b.mozCancelFullScreen){b.mozCancelFullScreen()}else{if(b.webkitExitFullscreen){b.webkitExitFullscreen()}}}}else{if(f.requestFullscreen){f.requestFullscreen()}else{if(f.mozRequestFullScreen){f.mozRequestFullScreen()}else{if(f.webkitRequestFullscreen){f.webkitRequestFullscreen()}else{if(f.msRequestFullscreen){f.msRequestFullscreen()}}}}}}}}else{delete d.fullscreen}}return this.each(function(){var f=a("<div></div>").appendTo(this);a.each(d,function(){a.nosUIElement(this).appendTo(f)});f.nosFormUI().buttonset().nosOnShow();f.find(".wijmo-wijmenu").appendTo("body")})}});return a});