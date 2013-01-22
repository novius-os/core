/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-publishable",["jquery-nos","jquery-ui.button"],function(a){a.fn.extend({nosPublishable:function(b){b=b||{initialStatus:"undefined",texts:{"undefined":{0:"Will not be published",1:"Will be published"},no:{0:"Not published",1:"Will be published"},yes:{0:"Will be unpublished",1:"Published"}}};return this.each(function(){var f=a(this),c=f.find("td:last"),e=f.find("td:first"),d=function(){e.find(":radio").each(function(){var g=a(this),h=e.find("label[for="+g.attr("id")+"] img");h.attr({title:b.texts[b.initialStatus][g.val()],alt:b.texts[b.initialStatus][g.val()]})})};d();e.buttonset();e.find(":radio").change(function(){c.text(b.texts[b.initialStatus][a(this).val()]);d()});e.find(":checked").triggerHandler("change");e.closest("form").bind("ajax_success",function(h,g){if(g.publication_initial_status==null){log("Potential error: publication_initial_status in JSON response.");return}b.initialStatus=g.publication_initial_status==1?"yes":"no";e.find(":checked").triggerHandler("change")})})}});return a});