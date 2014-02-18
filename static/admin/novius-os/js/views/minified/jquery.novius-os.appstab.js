/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-appstab",["jquery-nos","jquery-ui.sortable"],function(a){a.fn.extend({nosAppsTab:function(b){b=b||{backgroundUrl:null};return this.each(function(){var e=a(this).nosListenEvent({name:"Nos\\Application"},function(f){a.ajax({url:"admin/nos/noviusos/appstab",success:function(g){e.parent().empty().append(g)}})}),c=function(h){h.preventDefault();var g=a(this),f=g.data("launcher");if(f.action.tab){f.action.tab=a.extend({app:true,iconSize:32,labelDisplay:false},f.action.tab)}g.nosAction(f.action)},d=e.find("#apps").sortable({update:function(h,g){g.item.unbind("click");g.item.one("click",function(i){i.preventDefault();i.stopImmediatePropagation();a(this).click(function(j){c.call(this,j)})});var f={};a(".app").each(function(j){f[a(this).data("launcher").key]={order:j}});a(d).nosSaveUserConfig("misc.apps",f)}});e.find("a.app").click(function(f){c.call(this,f)})})}});return a});