/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-layout-standard",["jquery-nos"],function(a){a.fn.extend({nosLayoutStandard:function(b){b=b||{tabParams:{}};return this.each(function(){var e=a(this),d=e.closest(".nos-dispatcher").on("showPanel",function(){e.nosOnShow();d.wijTriggerVisibility()}),f=e.attr("id"),c=e.find(".change-context").attr("id",f+"context").data({icons:{secondary:"triangle-1-s"}});if(b.tabParams){c.next().wijmenu({orientation:"vertical",animation:{animated:"slide",option:{direction:"up"},duration:50,easing:null},hideAnimation:{animated:"slide",option:{direction:"up"},duration:0,easing:null},direction:"rtl",triggerEvent:"click",trigger:"#"+f+"context",shown:function(i,h){var g=a(h.element);g.parent().css({maxHeight:"200px",width:g.outerWidth(true)+20,overflowY:"auto",overflowX:"hidden"})},select:function(j,i){var k=a(i.item.element),h=k.data("context"),g=b.tabParams;if(h){g.url=g.url.replace(/context=([^&]+)/g,"context="+encodeURIComponent(h.code));e.closest("form").find(".input-context").val(h.code);c.button("option","label",h.label);k.nosTabs("update",g);e.closest(".nos-dispatcher, body").data("nosContext",h.code).trigger("contextChange")}}})}log("init");e.nosOnShow("one",function(){log("$container.nosFormUI()");e.nosFormUI()}).nosOnShow()})}});return a});