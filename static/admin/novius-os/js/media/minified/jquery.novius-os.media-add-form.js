/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-media-add-form",["jquery-nos","static/apps/noviusos_media/config/seo_compliant"],function(a){a.fn.extend({nosMediaAddForm:function(){return this.each(function(){var f=a(this),c=f.find(":file[name=media]").change(function(){var g=c.val();g=g.replace(/^.*[\/\\]/g,"");g=g.split(".");if(g.length>1){g.pop()}g=g.join(".");g=g.replace(/[^a-z0-9A-Z]/g," ").replace(/\s+/g," ");g=g.replace(/^([a-z])|\s+([a-z])/g,function(h){return h.toUpperCase()});if(!d.val()){d.val(g).triggerHandler("change")}}),d=f.find("input[name=media_title]").bind("change keyup",function(){if(b.is(":checked")){e.val(a.seoCompliant(d.val()))}}),e=f.find("input[name=media_file]"),b=f.find("input[data-id=same_title]").change(function(){if(a(this).is(":checked")){e.attr("readonly",true).addClass("ui-state-disabled");d.triggerHandler("change")}else{e.removeAttr("readonly").removeClass("ui-state-disabled")}});b.triggerHandler("change")})}});return a});