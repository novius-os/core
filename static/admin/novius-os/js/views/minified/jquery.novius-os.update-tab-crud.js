/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-update-tab-crud",["jquery-nos-ostabs"],function(a){a.fn.extend({nosUpdateTabCrud:function(b){b=b||{tabParams:{},isNew:false,model:"",itemId:0,closeEle:"#",texts:{titleClose:"Bye bye"}};return this.each(function(){var c=a(this).nosTabs("update",b.tabParams);if(!b.isNew){c.nosListenEvent({name:b.model,action:"delete",id:b.itemId},function(){var d=a(b.closeEle);d.find("button.ui-priority-primary").click(function(){a(this).nosTabs("close")});d.show().nosFormUI();c.nosDialog({title:b.texts.titleClose,content:d,width:300,height:130,close:function(){c.nosTabs("close")}})})}})}});return a});