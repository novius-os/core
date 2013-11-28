/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-media-folder-form",["jquery-nos","static/apps/noviusos_media/config/seo_compliant"],function(a){a.fn.extend({nosMediaFolderForm:function(b){b=b||{containerParentId:null};return this.each(function(){var f=a(this).nosFormUI(),e=f.find("input[name=medif_title]"),d=f.find("input[name=medif_dir_name]"),c=f.find("input[data-id=same_title]");e.bind("change keyup",function(){if(c.is(":checked")){d.val(a.seoCompliant(e.val()))}});c.change(function(){if(a(this).is(":checked")){d.attr("readonly",true).addClass("ui-state-disabled");e.triggerHandler("change")}else{d.removeAttr("readonly").removeClass("ui-state-disabled")}}).triggerHandler("change");var g=f.find("span[data-id=path_prefix]");if(b.containerParentId){f.find(b.containerParentId).delegate("input[name=medif_parent_id]","selectionChanged",function(i,h){g.text(h&&h.path?h.path:"")})}f.closest("form").bind("ajax_success",function(i,h){if(h.medif_dir_name){d.val(h.medif_dir_name)}})})}});return a});