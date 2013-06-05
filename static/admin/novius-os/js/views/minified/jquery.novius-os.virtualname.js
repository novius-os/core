/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-virtualname",["jquery-nos"],function(a){a.fn.extend({nosVirtualName:function(){return this.each(function(){var g=function(h){if(!h){return h}return h.replace(/ /g,"-").replace(/[\?|:|\\|\/|\#|\[|\]|@|&]/g,"-").replace(/-{2,}/g,"-").replace(/-$/g,"").replace(/^-/g,"").toLowerCase()},d=a(this),f=d.attr("id"),b=a("#"+f+"__use_title_checkbox"),c=d.closest("form").find("input.ui-priority-primary");var e=d.data("usetitle");if(typeof e!=="undefined"&&e==1){b.prop("checked",true)}b.change(function(){if(a(this).is(":checked")){d.attr("readonly",true).addClass("ui-state-disabled");c.triggerHandler("change")}else{d.removeAttr("readonly").removeClass("ui-state-disabled")}}).triggerHandler("change");c.bind("change keyup",function(){if(b.is(":checked")){d.val(g(c.val()))}})})}});return a});