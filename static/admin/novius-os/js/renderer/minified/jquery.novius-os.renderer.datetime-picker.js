/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-renderer-datetimepicker",["jquery-nos","jquery-ui.datepicker.i18n","jquery-ui.datetimepicker.i18n"],function(a){var b=void (0);a.widget("nos.nosDatetimePicker",{options:{wrapper:null},_create:function(){var c=this,i=c.options;var j=this.element,h=j.data("datepicker-options"),g=a("#"+this.element.attr("id")+"_displayed");if(typeof h.altField==="undefined"){h.altField="#"+j.attr("id")}a.datepicker.setDefaults(a.datepicker.regional[a.nosLang.substr(0,2)]);a.timepicker.setDefaults(a.timepicker.regional[a.nosLang.substr(0,2)]);if(i.wrapper!==null){j.wrap(i.wrapper)}var f=j.val();var e=a.datepicker.parseDateTime(h.altFormat,h.altTimeFormat,f);var d=g.attr("size");g.datetimepicker(h);g.attr("size",d);g.datetimepicker("setDate",e)}});return a});