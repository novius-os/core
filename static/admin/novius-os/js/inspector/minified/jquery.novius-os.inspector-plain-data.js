/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-inspector-plain-data",["jquery-nos-listgrid"],function(a){a.fn.extend({nosInspectorPlainData:function(b){b=b||{};return this.each(function(){var e=a(this).removeAttr("id"),d=e.parent().bind({widgetResize:function(){e.noslistgrid("setSize",d.width(),d.height())}}),c=d.data("inspector"),f=false;e.css({height:"100%",width:"100%"}).noslistgrid({showFilter:false,allowSorting:false,scrollMode:"auto",allowPaging:false,allowColSizing:false,allowColMoving:false,columns:c.grid.columns,data:b,noCellsSelected:true,currentCellChanged:function(h){var i=a(h.target).noslistgrid("currentCell").row(),g=i?i.data:false;if(g&&f){c.selectionChanged(g.id,g.title)}e.noslistgrid("currentCell",-1,-1)},rendering:function(){f=false},rendered:function(){f=true;e.css("height","auto").noslistgrid("currentCell",-1,-1)}})})}});return a});