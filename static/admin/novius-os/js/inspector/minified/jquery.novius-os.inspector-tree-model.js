/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-inspector-tree-model",["jquery-nos-treegrid"],function(a){a.fn.extend({nosInspectorTreeModel:function(){return this.each(function(){var f=a(this),h=f.attr("id"),b=f.closest(".nos-dispatcher, body").on("contextChange",function(){c();if(d.contextChange){f.nostreegrid("option","treeOptions",{context:b.data("nosContext")||""})}}),e=f.parent().on({widgetResize:function(){f.nostreegrid("setSize",e.width(),e.height())},widgetReload:function(){f.nostreegrid("reload")}}),d=e.data("inspector")||{},g=false,c=function(){if(d.reloadEvent){f.nosUnlistenEvent("inspector"+h);var i={name:d.reloadEvent};if(b.data("nosContext")){i.context=b.data("nosContext")}f.nosListenEvent(i,function(){e.trigger("widgetReload")},"inspector"+h)}};c();f.css({height:"100%",width:"100%"}).nostreegrid(a.extend({treeOptions:{context:b.data("nosContext")||""},columnsAutogenerationMode:"none",scrollMode:"auto",allowColSizing:true,allowColMoving:true,loadingText:d.loadingText||"Loading...",currentCellChanged:function(j){var k=a(j.target).nostreegrid("currentCell").row(),i=k?k.data:false;if(i&&g){d.selectionChanged(i.id,i._title)}f.nostreegrid("currentCell",-1,-1)},rendering:function(){g=false},rendered:function(){g=true;f.css("height","auto")}},d.treeGrid))})}});return a});