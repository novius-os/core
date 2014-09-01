/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-renderer-menu-items',
    ['jquery-nos', 'jquery-ui.nestedSortable'],
    function($) {
        "use strict";

        $.widget( "nos.renderermenuitems", {
            options: {
                itemUrl: '',
                nestedSortable: {
                    maxLevels: 0
                },
                texts: {
                    addItem: 'Add an item',
                    deleteItem: 'Delete this item'
                },
                drivers: {},
                input_name: 'hierarchy'
            },

            incrementalId: 1,
            currentDriver: null,

            _create: function() {
                var self = this,
                    o = self.options,
                    $line = $('<div class="line"></div>')
                        .appendTo(self.element);

                self.element.addClass('renderer-menu-items');

                self.$hierarchy = $('<input type="hidden" />').attr('name', o.input_name)
                    .appendTo(self.element);

                self.$panelRight = $('<div></div>').addClass('renderer-menu-items-right col c8')
                    .appendTo($line);
                self.$panelLeft = $('<div></div>').addClass('renderer-menu-items-left col c4')
                    .appendTo($line);

                self.$addsContainer = $('<div></div>').addClass('renderer-menu-items-adds')
                    .appendTo(self.$panelRight);

                self.$rootOl = self.element.find('> ol')
                    .addClass('renderer-menu-items-root');
                if (!self.$rootOl.size()) {
                    self.$rootOl = $('<ol></ol>');
                }
                self.$rootOl.appendTo(self.$panelRight);

                self.$rootOl.find('> li').each(function() {
                    self._parseItem($(this));
                });

                self._driversButtons();

                self.$arrow = $('<span></span>').addClass('renderer-menu-items-arrow')
                    .appendTo(self.$panelLeft);
            },

            _parseItem: function($li) {
                var self = this,
                    o = self.options,
                    item = $li.data('item') || {},
                    $liDiv = $('<div></div>'),
                    $liChildren = $li.find('> ol').detach(),
                    $liForm = $('<div></div>').append($li.contents()),
                    $liLabel;

                $li.attr('data-id', 'item-' + item.id);

                $('<a href="#"><span class="ui-icon ui-icon-trash"></span></a>')
                    .addClass('renderer-menu-items-li-delete ui-state-default')
                    .click(function(e) {
                        e.preventDefault();

                        $li.find('.renderer-menu-items-item').each(function() {
                            var $form = $(this).data('form');
                            if ($form.is(':visible')) {
                                self.$arrow.hide();
                            }
                            $form.remove();
                        });

                        $li.remove();

                        self._hierarchy();
                    })
                    .appendTo($liDiv)
                    .find('span')
                    .attr('title', o.texts.deleteItem)
                    .text(o.texts.deleteItem);

                $('<span><span class="nos-icon16"></span></span>')
                    .addClass('renderer-menu-items-li-icon ui-state-default')
                    .appendTo($liDiv)
                    .find('span')
                    .css('backgroundImage', 'url(' + self._getDriverAttr('icon', item.driver) + ')')
                    .attr('title', self._getDriverAttr('name', item.driver))
                    .text(self._getDriverAttr('name', item.driver));

                $liLabel = $('<span></span>').addClass('renderer-menu-items-li-label')
                    .text(item.title)
                    .appendTo($liDiv);

                $liDiv.addClass('renderer-menu-items-item ui-widget ui-widget-content ui-corner-all')
                    .hover(function() {
                        $liDiv.addClass('ui-state-hover');
                    }, function() {
                        $liDiv.removeClass('ui-state-hover');
                    })
                    .click(function() {
                        var position = $liDiv.position();

                        self.$panelRight.find('.renderer-menu-items-item').removeClass('ui-state-active');
                        self.$panelLeft.find('.renderer-menu-items-li-form').hide();

                        self.$arrow.css('top', position.top + 'px').show();

                        $liDiv.addClass('ui-state-active');
                        $liForm.css('top', position.top + 'px').show().nosOnShow();
                    })
                    .appendTo($li);

                $liForm.addClass('renderer-menu-items-li-form')
                    .appendTo(self.$panelLeft)
                    .data('li', $liDiv)
                    .nosFormUI();
                $liDiv.data('form', $liForm);

                $liForm.find('.menu_item_title').keyup(function() {
                    var $input = $(this),
                        label = $input.val(),
                        placeholder = $input.attr('placeholder');

                    if ($.trim(label)) {
                        $liLabel.text(label);
                    } else if ($.trim(placeholder)) {
                        $liLabel.text(placeholder);
                    } else {
                        $liLabel.text(item.title);
                    }
                });

                $liForm.find('.menu_item_driver').change(function() {
                    var $select = $(this),
                        item = $li.data('item');

                    item.driver = $select.val();
                    item.title = $liForm.find('.menu_item_title').val();
                    item.dom_id = $liForm.find('.menu_item_dom_id').val();
                    item.css_class = $liForm.find('.menu_item_css_class').val();
                    $liForm.remove();

                    self._ajaxItem(item, $li.empty());
                });

                $li.append($liChildren);

                $liChildren.find('> li').each(function() {
                    self._parseItem($(this));
                });

                return self;
            },

            _getDriverAttr: function(attr, driver) {
                var self = this,
                    o = self.options;

                attr = attr || 'icon';

                if (driver && o.drivers[driver] && o.drivers[driver][attr]) {
                    return o.drivers[driver][attr];
                }

                return '';
            },

            _driversButtons: function() {
                var self = this,
                    o = self.options;

                var currentDriver = self.currentDriver ? o.drivers[self.currentDriver] : false;
                var $splitButton = $('<div><button></button><button></button></div>').appendTo(self.$addsContainer.empty());
                var date = new Date();
                var id = date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds() + "_" + date.getMilliseconds();
                var $ul = $('<ul></ul>');
                var $menubutton;

                $splitButton.find('button:first')
                    .click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        if (self.currentDriver) {
                            self._addItem(self.currentDriver);
                        } else {
                            $menubutton.click();
                        }
                    })
                    .data({
                        icons: {
                            primary: currentDriver ? {iconUrl: currentDriver.icon} : 'plus'
                        }
                    })
                    .text(currentDriver ? currentDriver.texts.add : o.texts.addItem);

                $menubutton = $splitButton.find('button:last')
                    .attr('type', 'button')
                    .attr('id', id)
                    .text(o.texts.addItem)
                    .data({
                        text: false,
                        icons: {
                            primary: 'triangle-1-s'
                        }
                    });

                $splitButton.nosFormUI()
                    .buttonset();

                $.each(o.drivers, function(driver_class) {
                    var driver = this;

                    $('<li><a><span></span><span></span></a></li>')
                        .data('driver', driver_class)
                        .appendTo($ul)
                        .find('span:first')
                        .addClass('ui-icon nos-icon16 wijmo-wijmenu-icon-left')
                        .css('background-image', 'url(' + driver.icon + ')')
                        .end()
                        .find('span:last')
                        .text(driver.texts.add);
                });

                $ul.insertAfter($splitButton)
                    .wijmenu({
                        orientation: 'vertical',
                        animation: {
                            animated:"slide",
                            option: {
                                direction: "up"
                            },
                            duration: 50,
                            easing: null
                        },
                        hideAnimation: {
                            animated:"slide",
                            option: {
                                direction: "up"
                            },
                            duration: 0,
                            easing: null
                        },
                        trigger: '#' + id,
                        select: function(e, data) {
                            var $li = $(data.item.element),
                                driver_class = $li.data('driver');

                            self._addItem(driver_class);
                        }
                    });

                return self;
            },

            _addItem: function(driver_class) {
                var self = this,
                    o = self.options;

                var driver = o.drivers[driver_class];
                var id = 't' + self.incrementalId++;
                var item = {
                        id: id,
                        driver: driver_class,
                        title: driver.texts.new
                    };
                var $li = $('<li></li>').data('item', item)
                        .attr('data-id', 'item-' + id);
                var $currentLi = self.$rootOl.find('.renderer-menu-items-item.ui-state-active');

                if ($currentLi.size() === 1) {
                    $li.insertAfter($currentLi.parent());
                } else {
                    $li.appendTo(self.$rootOl);
                }

                self.currentDriver = driver_class;
                self._driversButtons();

                self._hierarchy()
                    ._ajaxItem(item, $li);
            },

            _ajaxItem: function(item, $li) {
                var self = this,
                    o = self.options;

                $.get(o.itemUrl, item, function(data) {
                    $li.html(data);
                    self._parseItem($li);
                    $li.find('> .renderer-menu-items-item').click();
                });

                return self;
            },

            _init: function() {
                var self = this,
                    o = self.options;

                self.$rootOl.nestedSortable($.extend({
                    forcePlaceholderSize: true,
                    handle: 'div',
                    helper: 'clone',
                    items: 'li',
                    opacity: .6,
                    placeholder: 'renderer-menu-items-placeholder',
                    tolerance: 'pointer',
                    toleranceElement: '> div',

                    stop: function () {
                        self._hierarchy();

                        self.$rootOl.find('.renderer-menu-items-item.ui-state-active').click();
                    }
                }, o.nestedSortable));

                self._hierarchy();
            },

            _hierarchy: function() {
                var self = this,
                    o = self.options;

                self.$hierarchy.val(JSON.stringify(self.$rootOl.nestedSortable('toHierarchy', {attribute: 'data-id'})));

                return self;
            }

        });
        return $;
    });
