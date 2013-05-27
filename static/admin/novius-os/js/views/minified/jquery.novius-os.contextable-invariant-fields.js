/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-contextable-invariant-fields",["jquery-nos"],function(a){a.fn.extend({nosContextableinvariantFields:function(b){b=b||{texts:{popin_title:"This field is common to all contexts/languages/sites",popin_content:"When you modify the value of this field, the change is also applied to the following contexts/languages/sites:",popin_ok:"OK, I understand",popin_cancel:"Cancel, I won't modify it"}};return this.each(function(){var d=a(this),c=function(g){var e=a("<div><p></p><ul></ul></div>").find("p").text(b.texts.popin_content).end(),f=e.find("ul"),h=this.data("other-contexts");a.each(h,function(k,j){a("<li></li>").html(j).appendTo(f)});d.nosDialog({title:b.texts.popin_title,content:e,width:500,height:130+h.length*20,buttons:[{text:b.texts.popin_ok,click:function(){g();a(this).wijdialog("close")}},{text:b.texts.popin_cancel,click:function(){a(this).wijdialog("close")}}]})};d.find("[context_invariant_field]").each(function(){var f=a(this);var e=a("<div></div>").css({position:"absolute",width:f.outerWidth()+"px",height:f.outerHeight()+"px"}).insertAfter(f).click(function(){if(f.is(":disabled")){c.call(f,function(){f.attr("disabled",false);e.detach()})}}).position({my:"top left",at:"top left",collision:"none",of:f})})})}});return a});