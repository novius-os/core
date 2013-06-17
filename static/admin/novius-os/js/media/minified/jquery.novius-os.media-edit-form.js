/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-media-edit-form",["jquery-nos","static/apps/noviusos_media/config/seo_compliant"],function(a){a.fn.extend({nosMediaEditForm:function(){return this.each(function(){var f=a(this),c=f.find(":file[name=media]"),d=f.find("input[name=media_title]"),e=f.find("input[name=media_file]"),b=f.find("input[data-id=same_title]");d.bind("change keyup",function(){if(b.is(":checked")){e.val(a.seoCompliant(d.val()))}});b.change(function(){if(a(this).is(":checked")){e.attr("readonly",true).addClass("ui-state-disabled");d.triggerHandler("change")}else{e.removeAttr("readonly").removeClass("ui-state-disabled")}}).triggerHandler("change");f.closest("form").bind("ajax_success",function(h,g){if(g.thumbnailUrl){f.find(".preview_zone img").attr({src:g.thumbnailUrl+"?"+(new Date().getTime())})}if(g.dataset.file){e.val(g.dataset.file)}if(g.dataset.ext){f.find(".media_extension").text(g.dataset.ext)}if(g.dataset.filesize){f.find(".media_filesize").text(g.dataset.filesize)}if(g.dataset.dimensions){f.find(".media_dimensions").text(g.dataset.dimensions)}})})}});return a});