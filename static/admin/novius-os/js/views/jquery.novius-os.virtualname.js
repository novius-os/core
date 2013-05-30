/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-virtualname',
    ['jquery-nos'],
    function($) {
        "use strict";

        $.fn.extend({
            nosVirtualName : function() {
                return this.each(function() {
                    var replace_url = function(str) {
                                if (!str) {
                                    return str;
                                }

                                return str.replace(/ /g, '-')
                                    .replace(/[\?|:|\\|\/|\#|\[|\]|@|&]/g, '-')
                                    .replace(/-{2,}/g, '-')
                                    .replace(/-$/g, '')
                                    .replace(/^-/g, '')
                                    .toLowerCase();
                            },
                        $virtual_name = $(this),
                        id = $virtual_name.attr('id'),
                        $use_title_checkbox = $('#' + id + '__use_title_checkbox'),
                        $title = $virtual_name.closest('form').find('input.ui-priority-primary');

                    var useTitle = $virtual_name.data('usetitle');

                    if (typeof useTitle !== 'undefined' && useTitle == 1) {
                        $use_title_checkbox.prop('checked', true);
                    }

                    $use_title_checkbox.change(function() {
                        if ($(this).is(':checked')) {
                            $virtual_name.attr('readonly', true).addClass('ui-state-disabled');
                            $title.triggerHandler('change');
                        } else {
                            $virtual_name.removeAttr('readonly').removeClass('ui-state-disabled');
                        }
                    }).triggerHandler('change');

                    $title.bind('change keyup', function() {
                        if ($use_title_checkbox.is(':checked')) {
                            $virtual_name.val(replace_url($title.val()));
                        }
                    });
                });
            }
        });

        return $;
    });
