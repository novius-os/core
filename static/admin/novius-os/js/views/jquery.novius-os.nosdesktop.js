/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-nosdesktop',
    ['jquery-nos', 'jquery-ui.sortable'],
    function($) {
        "use strict";
        var touchDevice = Modernizr.touch;

        $.widget( "nos.nosdesktop", {
            options: {
                launchers: [],
                reloadUrl: 'admin/nos/noviusos/desktop'
            },
            launcherWidth: 150,
            launcherHeight: 0,
            grid: {
                positions: {},
                set: function(left, top) {
                    if ($.isPlainObject(left)) {
                        top = left.top;
                        left = left.left;
                    }
                    this.positions[left] = this.positions[left] || {};
                    this.positions[left][top] = true;
                },
                isSet: function(left, top) {
                    return this.positions[left] && this.positions[left][top];
                },
                unSet: function(left, top) {
                    if ($.isPlainObject(left)) {
                        top = left.top;
                        left = left.left;
                    }
                    this.positions[left] = this.positions[left] || {};
                    this.positions[left][top] = false;
                }
            },

            _create: function() {
                var self = this,
                    o = self.options;

                this.unPositioned = [];

                self.element.nosListenEvent({name : 'Nos\\Application'} ,function() {
                    if (self.jqxhrReload) {
                        self.jqxhrReload.abort();
                    }
                    self.jqxhrReload = $.ajax({
                        url: o.reloadUrl,
                        success: function(data) {
                            $(window).off('resize', self._windowResize);

                            self.element.nosUnlistenEvent('nosdesktop')
                                .closest('.nos-dispatcher').off('showPanel');

                            // This will destroy current widget and recreate from scratch with new data
                            self.element.parent().empty().append(data);
                        }
                    });
                }, 'nosdesktop');

                self.maxWidth = self.element.width();

                $.each(o.launchers, function() {
                    var launcher = this;

                    $('<a href="#">' +
                        '<span class="icon">' +
                        '<img class="gloss" src="static/novius-os/admin/novius-os/img/64/gloss.png" />' +
                        '<img width="64" />' +
                        '</span>' +
                        '<span class="text"></span>' +
                        '</a>')
                        .addClass('app launcher-' + launcher.key)
                        .data('launcher', launcher)
                        .find('span.icon img:last').attr('src', launcher.icon)
                        .end()
                        .find('span.text').html(launcher.name)
                        .end()
                        .appendTo(self.element);
                });

                self.$launchers = self.element.find('.app');

                self._calculateLauncherHeight()
                    ._positionLaunchers(true)
                    ._positionUnpositioned();

                if (!touchDevice) {
                    self._initDrag();
                }

                self.$launchers.click(function(e) {
                    self._launcherClick($(this), e);
                });

                self._windowResize = $.proxy(function() {
                    var self = this;

                    if (self.element.closest('.nos-dispatcher').is(':visible')) {
                        if (self.timeoutResize) {
                            window.clearTimeout(self.timeoutResize);
                        }
                        self.timeoutResize = window.setTimeout(function() {
                            self.resize();
                        }, 200);
                    } else {
                        self.element.closest('.nos-dispatcher').one('showPanel', function() {
                            self.resize();
                        });
                    }
                }, self);
                $(window).on('resize', self._windowResize);
            },

            _calculateLauncherHeight: function() {
                var self = this;

                self.$launchers.each(function() {
                    var height = $(this).outerHeight(true);
                    if (height > self.launcherHeight) {
                        self.launcherHeight = height;
                    }
                });

                return self;
            },

            _positionLaunchers: function(init) {
                var self = this;

                self.$launchers.each(function() {
                    var $launcher = $(this),
                        launcher = $launcher.data('launcher');

                    if (launcher.position && ((launcher.position.left + 1) * self.launcherWidth) < self.maxWidth) {
                        self._positionLauncher($launcher, launcher.position.left, launcher.position.top);
                        if (init) {
                            launcher.savedPosition = $.extend({}, launcher.position);
                        }
                    } else {
                        if (launcher.position) {
                            self.grid.unSet(launcher.position);
                        }
                        self.unPositioned.push($launcher);
                    }
                });

                return self;
            },

            _positionUnpositioned: function() {
                var self = this;

                if (!self.unPositioned.length) {
                    return self;
                }

                $.each(self.unPositioned, function() {
                    var $launcher = this,
                        launcher = $launcher.data('launcher'),
                        left = 0,
                        top = 0;

                    while (1 == 1) {
                        if (self.grid.isSet(left, top)) {
                            left++;
                            if (((left + 1) * self.launcherWidth) > self.maxWidth) {
                                left = 0;
                                top++;
                            }
                            continue;
                        } else {
                            self._positionLauncher($launcher, left, top);
                            break;
                        }
                    }
                });

                self.unPositioned = [];

                return self;
            },

            _initDrag: function() {
                var self = this;

                self.$launchers.draggable({
                    containement: self.element,
                    grid: [self.launcherWidth, self.launcherHeight],
                    scroll: false,
                    stop: function(e, ui) {
                        var $laucher = $(this),
                            pos = ui.position,
                            launcher = $laucher.data('launcher'),
                            left = parseInt(pos.left / self.launcherWidth),
                            top = parseInt(pos.top / self.launcherHeight);

                        $laucher.unbind("click");
                        $laucher.one("click", function (event) {
                            event.preventDefault();
                            event.stopImmediatePropagation();
                            $(this).click(function(e) {
                                self._launcherClick($(this), e);
                            });
                        });

                        if ((pos.left + self.launcherWidth) > self.element.width() || self.grid.isSet(left, top)) {
                            $laucher.animate({
                                left: (launcher.position.left * self.launcherWidth) + 'px',
                                top: (launcher.position.top * self.launcherHeight) + 'px'
                            }, 200);
                        } else {
                            self.grid.unSet(launcher.position);
                            self._positionLauncher($laucher, left, top);
                            self.save();
                        }
                    }
                });

                return self;
            },

            _positionLauncher: function($launcher, left, top) {
                var self = this,
                    launcher = $launcher.data('launcher');

                launcher.position = {
                    left: left,
                    top: top
                };

                $launcher.css({
                    left: (left * self.launcherWidth) + 'px',
                    top: (top * self.launcherHeight) + 'px',
                    visibility: 'visible'
                });

                self.grid.set(left, top);

                return self;
            },

            _launcherClick: function($launcher, e) {
                var self = this,
                    launcher = $launcher.data('launcher');

                e.preventDefault();

                if (launcher.action.tab) {
                    launcher.action.tab = $.extend({
                        app: true,
                        iconSize: 32,
                        labelDisplay: false
                    }, launcher.action.tab);
                }

                $launcher.nosAction(launcher.action);

                return self;
            },

            resize: function() {
                var self = this;

                self.maxWidth = self.element.width();
                self.$launchers.each(function() {
                    var $launcher = $(this),
                        launcher = $launcher.data('launcher');
                    if (launcher.savedPosition) {
                        self.grid.unSet(launcher.position);
                        launcher.position = $.extend({}, launcher.savedPosition);
                    }
                });
                self._positionLaunchers()
                    ._positionUnpositioned();

                return self;
            },

            save: function() {
                var self = this,
                    data = {};

                self.$launchers.each(function() {
                    var $launcher = $(this),
                        launcher = $launcher.data('launcher');

                    launcher.savedPosition = $.extend({}, launcher.position);
                    data[launcher.key] = {position: launcher.position};
                });
                self.$launchers.nosSaveUserConfig('misc.apps', data);

                return self;
            }
        });

        return $;
    });
