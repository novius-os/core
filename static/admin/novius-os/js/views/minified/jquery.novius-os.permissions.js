/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-permissions",["jquery","jquery-nos"],function(a){var b=void (0);return function(e){var f=e.find('div[class~="nos::access"]');var g=false;e.find(".check_all").on("change",function d(j){j.stopPropagation();g=true;var i=a(this).is(":checked");f.find(":checkbox").prop("checked",i);g=false;if(!i){f.find("li.ui-state-active :checkbox").trigger("change")}});f.find(".checkbox_hit_area").on("click",function(k){k.stopPropagation();var i=a(this).find(":checkbox");var j=i.is(":checked");i.prop("checked",!j).trigger("change")});f.find("li").on("click",function h(j){if(!a(this).hasClass("ui-state-active")){j.preventDefault();var i=a(this).find(":checkbox");if(i.is(":checked")){i.trigger("change")}else{i.trigger("click")}}});f.find(":checkbox").on("change",function c(){if(g){return}var j=a(this);var k=j.closest("li");var i=e.find("div."+j.val());if(j.is(":checked")){k.addClass("ui-state-active").siblings().removeClass("ui-state-active");e.find(".preview_arrow").parent().hide();i.show().nosOnShow().css("marginTop",k.offset().top-j.closest(".line").offset().top)}else{k.removeClass("ui-state-active");i.hide()}}).on("click",function(i){i.stopPropagation()});e.find(":checkbox.valueUnchecked")}});