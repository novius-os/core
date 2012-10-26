/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-virtualname",["jquery-nos"],function(a){a.fn.extend({nosVirtualName:function(){return this.each(function(){var f=function(g){if(!g){return g}return g.replace(/ /g,"-").replace(/[\?|:|\\|\/|\#|\[|\]|@]/g,"-").replace(/-{2,}/g,"-").replace(/-$/g,"").replace(/^-/g,"").toLowerCase()},d=a(this),e=d.attr("id"),b=a("#"+e+"__use_title_checkbox"),c=d.closest("form").find("input.title");if(f(c.val())==d.val()||d.val()==""){b.attr("checked",true).wijcheckbox("refresh")}b.change(function(){if(a(this).is(":checked")){d.attr("readonly",true).addClass("ui-state-disabled").removeClass("ui-state-default");c.triggerHandler("change")}else{d.removeAttr("readonly").addClass("ui-state-default").removeClass("ui-state-disabled")}}).triggerHandler("change");c.bind("change keyup",function(){if(b.is(":checked")){d.val(f(c.val()))}})})}});return a});