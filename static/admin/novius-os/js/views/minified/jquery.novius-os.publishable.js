/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-publishable",["jquery-nos","jquery-ui.button"],function(a){a.fn.extend({nosPublishable:function(b){b=b||{initialStatus:"undefined",texts:{"undefined":{0:"Will not be published",1:"Will be published"},no:{0:"Not published",1:"Will be published"},yes:{0:"Will be unpublished",1:"Published"}}};return this.each(function(){var e=a(this),c=e.find("td:last"),d=e.find("td:first");d.buttonset({text:false,icons:{primary:"ui-icon-locked"}});d.find(":radio").change(function(){c.text(b.texts[b.initialStatus][a(this).val()])});d.find(":checked").triggerHandler("change");d.closest("form").bind("ajax_success",function(g,f){if(f.publication_initial_status==null){log("Potential error: publication_initial_status in JSON response.");return}b.initialStatus=f.publication_initial_status==1?"yes":"no";d.find(":checked").triggerHandler("change")})})}});return a});