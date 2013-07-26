/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-virtualname",["jquery-nos"],function(a){a.fn.extend({nosVirtualName:function(b){var c=function(f){if(!f){return f}var e=0,d;for(e;e<b.length;e++){d=b[e];a.each(d,function(j,i){if(!isNaN(j)&&i==="lowercase"){f=f.toLowerCase()}else{if(a.isPlainObject(i)){var g=(i.flags||"").replace("g","")+"g";var i=i.replacement||"";var h=new RegExp(j,g);f=f.replace(h,i)}else{var h=new RegExp(j,"g");f=f.replace(h,i)}}})}return f};return this.each(function(){var f=a(this),h=f.attr("id"),d=a("#"+h+"__use_title_checkbox"),e=f.closest("form").find("input.ui-priority-primary");var g=f.data("usetitle");if(typeof g!=="undefined"&&g==1){d.prop("checked",true)}d.change(function(){if(a(this).is(":checked")){f.attr("readonly",true).addClass("ui-state-disabled");e.triggerHandler("change")}else{f.removeAttr("readonly").removeClass("ui-state-disabled")}}).triggerHandler("change");e.bind("change keyup",function(){if(d.is(":checked")){f.val(c(e.val()))}})})}});return a});