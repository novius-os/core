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
                        launcherWidth = 150,
                        maxheight = 0,
                        positions = {},
                        unPositioned = [],
                        unPositionedSave = {},
                        $apps = $panel.find('.app')
                            .each(function() {
                                var height = $(this).outerHeight(true);
                                if ($(this).outerHeight(true) > maxheight) {
                                    maxheight = height;
                                }
                            }),
                        save = function() {
                            var launchers = {};
                            $apps.each(function() {
                                var $launcher = $(this),
                                    tab = $launcher.data('launcher');
                                launchers[tab.key] = {position: tab.position};
                            });
                            $apps.nosSaveUserConfig('misc.apps', launchers);
                        };

                    $apps.each(function() {
                        var $launcher = $(this),
                            tab = $launcher.data('launcher');
                        if (tab.position && (tab.position.left * launcherWidth + launcherWidth) < $panel.width()) {
                            $launcher.css({
                                left: (tab.position.left * launcherWidth) + 'px',
                                top: (tab.position.top * maxheight) + 'px',
                                visibility: 'visible'
                            });
                            positions[tab.position.left] = positions[tab.position.left] || {};
                            positions[tab.position.left][tab.position.top] = true;
                        } else {
                            unPositioned.push($launcher);
                        }
                    });

                    if (unPositioned.length) {
                        $.each(unPositioned, function() {
                            var $launcher = this,
                                tab = $launcher.data('launcher'),
                                left = 0,
                                top = 0;

                            while (1 == 1) {
                                if (positions[left] && positions[left][top]) {
                                    left++;
                                    if ((left * launcherWidth + launcherWidth) > $panel.width()) {
                                        left = 0;
                                        top++;
                                    }
                                    continue;
                                } else {
                                    tab.position = {
                                        left: left,
                                        top: top
                                    };
                                    $launcher.css({
                                        left: (left * launcherWidth) + 'px',
                                        top: (top * maxheight) + 'px',
                                        visibility: 'visible'
                                    });
                                    positions[left] = positions[left] || {};
                                    positions[left][top] = true;
                                    unPositionedSave[$launcher.data('launcher').key] = {
                                        position: {
                                            left: left,
                                            top: top
                                        }
                                    };
                                    break;
                                }
                            }
                        });
                        save();
                    }

                    $apps.draggable({
                        containement: $panel,
                        grid: [launcherWidth, maxheight],
                        scroll: false,
                        stop: function(e, ui) {
                            var $item = $(this),
                                pos = ui.position,
                                tab = $item.data('launcher'),
                                left = parseInt(pos.left / launcherWidth),
                                top = parseInt(pos.top / maxheight);

                            $item.unbind("click");
                            $item.one("click", function (event) {
                                event.preventDefault();
                                event.stopImmediatePropagation();
                                $(this).click(function(e) {
                                    click.call(this, e);
                                });
                            });

                            if ((pos.left + launcherWidth) > $panel.width() || (positions[left] && positions[left][top])) {
                                $item.animate({
                                    left: (tab.position.left * launcherWidth) + 'px',
                                    top: (tab.position.top * maxheight) + 'px'
                                }, 200);
                            } else {
                                positions[tab.position.left] = positions[tab.position.left] || {};
                                positions[tab.position.left][tab.position.top] = false;
                                tab.position = {
                                    left: left,
                                    top: top
                                };
                                positions[left] = positions[left] || {};
                                positions[left][top] = true;
                                save();
                            }
                        }
                    });

                    $panel.find('a.app').click(function(e) {
                        click.call(this, e);
                    });
                });
            }
        });

        return $;
    });
