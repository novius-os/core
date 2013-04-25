/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-appstab',
    ['jquery-nos', 'jquery-ui.sortable'],
    function($) {
        "use strict";

        $.fn.extend({
            nosAppsTab : function(params) {
                params = params || {
                    backgroundUrl : null
                };
                return this.each(function() {
                    var $panel = $(this).nosListenEvent({name : 'Nos\\Application'} ,function(json) {
                            $.ajax({
                                url: 'admin/nos/noviusos/appstab',
                                success: function(data) {
                                    $panel.parent().empty().append(data);
                                }
                            });
                        }),
                        click = function(e) {
                            e.preventDefault();
                            var $launcher = $(this),
                                tab = $launcher.data('launcher');

                            if (tab.action.tab) {
                                tab.action.tab = $.extend({
                                    app: true,
                                    iconSize: 32,
                                    labelDisplay: false
                                }, tab.action.tab);
                            }

                            $launcher.nosAction(tab.action);
                        },
                        apps = $panel.find('#apps').sortable({
                            update: function(e, ui) {
                                ui.item.unbind("click");
                                ui.item.one("click", function (event) {
                                    event.preventDefault();
                                    event.stopImmediatePropagation();
                                    $(this).click(function(e) {
                                        click.call(this, e);
                                    });
                                });
                                var orders = {};
                                $('.app').each(function(i) {
                                    orders[$(this).data('launcher').key] = {order: i};
                                });
                                $(apps).nosSaveUserConfig('misc.apps', orders);
                            }
                        });

                    if (params.backgroundUrl) {
                        $('#noviusospanel').css('background-image', 'url("' + params.backgroundUrl + '")');
                    }
                    $panel.find('a.app').click(function(e) {
                        click.call(this, e);
                    });
                });
            }
        });

        return $;
    });
