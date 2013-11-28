/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-renderer-datetimepicker",["jquery-nos","jquery-ui.datepicker.i18n","jquery-ui.datetimepicker.i18n"],function(a){var b=void (0);a.widget("nos.nosDatetimePicker",{options:{wrapper:null},_create:function(){var j=this,c=j.options;var g=this.element,k=g.data("options"),i=k.datepicker,f=a("#"+this.element.attr("id")+"_displayed").change(function(){if(!a.trim(f.val())){f[k.plugin]("setDate",null);if(k.plugin==="datetimepicker"){g.val("")}}});if(typeof i.altField==="undefined"){i.altField="#"+g.attr("id")}a.datepicker.setDefaults(a.datepicker.regional[a.nosLang.substr(0,2)]);a.timepicker.setDefaults(a.timepicker.regional[a.nosLang.substr(0,2)]);if(c.wrapper!==null){g.wrap(c.wrapper)}var h=g.val();var d=a.datepicker.parseDateTime(i.altFormat,i.altTimeFormat,h);var e=f.attr("size");f[k.plugin](i);f.attr("size",e);f[k.plugin]("setDate",d)}});return a});