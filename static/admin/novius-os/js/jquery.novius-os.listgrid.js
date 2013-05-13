/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-listgrid',
    ['jquery', 'jquery-nos', 'jquery-ui.widget', 'wijmo.wijgrid'],
    function($) {
        "use strict";
        $.widget( "nos.noslistgrid", $.wijmo.wijgrid, {
            options: {
                culture: 'en-GB',
                loadingText : 'Loading...'
            },

            _init: function() {
                var self = this,
                    o = self.options;

                if ($.isFunction(o.columnResized)) {
                    var old_columnResized = o.columnResized;
                }
                o.columnResized = function(e, args) {
                    var columns = self.option('columns');
                    $.extend(columns[args.column.thX], {
                        ensurePxWidth : true,
                        width : args.column.width
                    });
                    self.setSize(self.outerDiv.parent().width());
                    if ($.isFunction(old_columnResized)) {
                        old_columnResized.apply(this, arguments);
                    }
                };

                if ($.isFunction(o.dataLoaded)) {
                    var old_ajaxError = o.ajaxError;
                }
                o.ajaxError = function(e, args) {
                    var jqXHR = args.XMLHttpRequest;
                    if (jqXHR.status == 403) {
                        $(this).nosAjaxError(jqXHR);
                    }
                    if ($.isFunction(old_ajaxError)) {
                        old_ajaxError.apply(this, arguments);
                    }
                };

                self._super();
            }
        });
        return $;
    });
