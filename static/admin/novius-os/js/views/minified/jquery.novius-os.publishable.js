/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define("jquery-nos-publishable",["jquery-nos","jquery-ui.button","jquery-ui.datetimepicker.i18n"],function(b){var a=function(i,d,h){var g=d.closest("tr"),c=g.find("a.date_pick"),f=g.find("a.date_clear"),e=i.val();require(["jquery.globalize","jquery.globalize.cultures"],function(){if(e==""){if(c.is(":visible")){}else{d.hide();f.hide();c.show();c.text(h.texts.pick).off("click").on("click",function l(o){o.preventDefault();i.datetimepicker("show")})}}else{Globalize.culture(b.nosLang.replace(/_/,"-"));var j=i.datetimepicker("getDate"),n=Globalize.format(j,"d")+" "+Globalize.format(j,"t");if(f.is(":visible")){d.text(n)}else{d.show();f.show();c.hide();f.text(h.texts.clear);d.text(n).off("click").on("click",function k(o){o.preventDefault();i.datetimepicker("show")});f.off("click").on("click",function m(o){o.preventDefault();i.val("").trigger("change")})}}})};b.fn.extend({nosPublishable:function(c){c=c||{initialStatus:"undefined",date_range:false,texts:{"undefined":{0:"Will not be published",1:"Will be published"},no:{0:"Not published",1:"Will be published"},yes:{0:"Will be unpublished",1:"Published"}}};return this.each(function(){var h=b(this),f=h.find(".publishable_radio"),d=h.find(".publishable_label"),i=h.find(".publishable_schedule"),g="initial",e=function(){f.find(":radio").each(function(){var j=b(this),k=f.find("label[for="+j.attr("id")+"] img");k.attr({title:c.texts[c.initialStatus][j.val()],alt:c.texts[c.initialStatus][j.val()]}).css({pointerEvents:"none",})})};if(c.date_range){i.nosOnShow("one",function(){var m=b("#"+c.date_range.container),l=m.find("#"+c.date_range.inputStart),j=m.find("#"+c.date_range.inputEnd),k=c.date_range.now;k=new Date(k[0],k[1]-1,k[2],k[3],k[4],k[5]);l.add(j).on("change",function(q){var s=l.datetimepicker("getDate"),p=j.datetimepicker("getDate"),r="",o,n;if(s==null&&p==null){r="scheduled"}else{if(p!=null&&p<k){r="backdated"}else{if(s==null||s<k){r="published"}else{r="scheduled"}}}o="planification_status_"+g+"_"+r;n=i.find("table."+o);if(n.length>0){}else{n=b('<table class="publication_status '+o+'"></table>').append(c.date_range.texts[g][r]);i.empty().append(n);g="modified"}a(l,i.find("a.date_start"),c.date_range);a(j,i.find("a.date_end"),c.date_range)});b.timepicker.setDefaults(b.timepicker.regional[b.nosLang.substr(0,2)]);l.datetimepicker({timeFormat:"HH:mm:ss",dateFormat:"yy-mm-dd",maxDate:j.val(),onClose:function(n){j.datepicker("option","minDate",n)}});j.datetimepicker({timeFormat:"HH:mm:ss",dateFormat:"yy-mm-dd",minDate:l.val(),onClose:function(n){l.datepicker("option","maxDate",n)}});l.on("change",function(){if(b(this).val()==""){j.datepicker("option","minDate","")}});j.on("change",function(){if(b(this).val()==""){l.datepicker("option","maxDate","")}});l.trigger("change")})}e();f.buttonset();f.find(":radio").change(function(){var j=b(this).val();d.text(c.texts[c.initialStatus][j]);e();if(j==2){d.hide();i.show().nosOnShow()}else{d.show();i.hide()}});f.find(":checked").triggerHandler("change");f.closest("form").bind("ajax_success",function(k,j){if(j.publication_initial_status==null){log("Potential error: publication_initial_status in JSON response.");return}c.initialStatus=j.publication_initial_status;if(c.date_range&&c.initialStatus==2){g="initial";b("#"+c.date_range.inputStart).trigger("change")}else{f.find(":radio[value="+c.initialStatus+"]")[0].checked=true;f.find(":checked").triggerHandler("change")}})})}});return b});