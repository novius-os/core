/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-layout-standard",["jquery-nos"],function(a){a.fn.extend({nosLayoutStandard:function(b){b=b||{tabParams:{}};return this.each(function(){var d=a(this),e=d.attr("id"),c=d.find(".change-context").attr("id",e+"context").data({icons:{secondary:"triangle-1-s"}});if(b.tabParams){c.next().wijmenu({orientation:"vertical",animation:{animated:"slide",option:{direction:"up"},duration:50,easing:null},hideAnimation:{animated:"slide",option:{direction:"up"},duration:0,easing:null},direction:"rtl",triggerEvent:"click",trigger:"#"+e+"context",shown:function(h,g){var f=a(g.element);f.parent().css({maxHeight:"200px",width:f.outerWidth(true)+20,overflowY:"auto",overflowX:"hidden"})},select:function(i,h){var j=a(h.item.element),g=j.data("context"),f=b.tabParams;if(g){f.url=f.url.replace(/context=([^&]+)/g,"context="+encodeURIComponent(g.code));d.closest("form").find(".input-context").val(g.code);c.button("option","label",g.label);j.nosTabs("update",f);d.closest(".nos-dispatcher, body").data("nosContext",g.code).trigger("contextChange")}}})}d.nosOnShow("one",function(){d.nosFormUI()}).nosOnShow()})}});return a});