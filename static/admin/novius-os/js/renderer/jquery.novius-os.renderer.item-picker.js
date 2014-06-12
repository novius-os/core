/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-renderer-item-picker',
    [
        'jquery',
        'jquery-nos',
        'jquery-ui.widget',
        'link!static/novius-os/admin/novius-os/css/jquery.novius-os.itempicker.css'
    ],
    function( $ ) {
        "use strict";
        $.widget( "nos.nositempicker", {
            options: {
                size: 64,
                appdesk: '',
                crud: '',
                dataset: {},
                actions: [],
                texts : {
                    'empty': 'No item selected',
                    'add': 'Pick an item',
                    'edit': 'Pick another item',
                    'delete': 'Un-select this item'
                },
                defaultThumbnail: ''
            },

            _create: function() {
                var self = this,
                    o = self.options;

                self.$block = $('<div></div>').addClass('nos-itempicker wijmo-wijgrid ui-widget-content')
                    .addClass('nos-itempicker-size-' + (o.size == '64' ? 64 : 128))
                    .insertAfter(self.element);

                self.$td = $('<table cellspacing="0" cellpadding="0" border="0"><tbody><tr><td>' +
                    '</td></tr></tbody></table>')
                    .addClass('nos-itempicker-grid wijmo-wijgrid-root wijmo-wijgrid-table')
                    .css({
                        borderCollapse : 'separate',
                        '-moz-user-select' : '-moz-none'
                    })
                    .hover(
                        function() {
                            self.$td.parent().addClass('ui-state-hover');
                        },
                        function() {
                            self.$td.parent().removeClass('ui-state-hover');
                        }
                    )
                    .click(function() {
                    })
                    .appendTo(self.$block)
                    .find('tbody')
                    .addClass('ui-widget-content wijmo-wijgrid-data')
                    .find('tr')
                    .addClass('wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow')
                    .find('td')
                    .addClass('wijgridtd');

                self.$thumb = $('<div></div>')
                        .addClass('nos-itempicker-thumb wijmo-wijgrid-innercell')
                        .appendTo(self.$td);

                self.$title = $('<div></div>')
                        .addClass('nos-itempicker-title wijmo-wijgrid-innercell')
                        .appendTo(self.$td);
            },

            _init: function() {
                var self = this,
                    o = self.options,
                    id = self.element.val();

                self.element.hide();

                $.each(o.actions, function(key) {
                    this.primary = false;
                });
                self._actions();
                if (id) {
                    self.$title.text(o.dataset._title);
                    self._itemThumbnail();
                } else {
                    self.$title.text(o.texts.empty);
                    self._loadImgDefault();
                }
            },

            _actions: function() {
                var self = this,
                    o = self.options,
                    id = self.element.val(),
                    actions;

                if (self.$buttons) {
                    self.$buttons.remove();
                }
                if (id) {
                    actions = $.extend({
                        'edit': {
                            action: {},
                            label: o.texts.edit,
                            primary: true,
                            icon: 'search'
                        },
                        'delete': {
                            action: {},
                            label: o.texts['delete'],
                            primary: true,
                            icon: 'closethick'
                        }
                    }, o.actions);
                } else {
                    actions = {
                        'add': {
                            action: {},
                            label: o.texts.add,
                            primary: true,
                            icon: 'plus'
                        }
                    };
                }

                self.$buttons = $.nosItemActions(actions, o.dataset)
                    .appendTo(self.$block);

                self.$buttons.find('th:first').off('click').click(function() {
                    var $dialog;
                    var pick_item = function(item, e) {
                        o.dataset = item;
                        self.element.val(item._id);
                        // Trigger keypup for validation
                        self.element.trigger('change').trigger('keyup');
                        self._trigger('pick', e, item);
                        $dialog.nosDialog('close');
                        self._init();
                    };
                    var ajaxData = {};
                    var $connector = self.element.closest('.nos-dispatcher, body')
                    if ($connector.data('nosContext')) {
                        ajaxData['selectedContexts'] = [$connector.data('nosContext')];
                    }
                    $dialog = self.element.nosDialog({
                        destroyOnClose : true,
                        contentUrl: o.appdesk + '/index/appdesk_pick',
                        ajaxData: ajaxData,
                        ajax: true,
                        title: o.texts.add
                    })
                    .bind('appdesk_pick_' + o.model, function(e, item) {
                        pick_item(item, e);
                    })
                    .nosListenEvent({
                        name: o.model,
                        action: 'insert'
                    }, function(e) {
                        $.ajax({
                            method: 'GET',
                            url: o.appdesk + '/info/' + e.id,
                            dataType: 'json',
                            success: function(item) {
                                pick_item(item, e);
                            }
                        });
                    });
                });
                if (id) {
                    self.$buttons.find('th:eq(1)').off('click').click(function() {
                        o.dataset = {};
                        self.element.val('');
                        self._init();
                    });
                }

                return self;
            },

            _itemThumbnail : function() {
                var self = this,
                    o = self.options;

                if (o.dataset.thumbnail) {
                    self._loadImg(o.dataset.thumbnail);
                } else {
                    self._loadImgDefault();
                }

                return self;
            },

            _loadImg : function() {
                var self = this,
                    o = self.options;

                $('<img />')
                    .error(function() {
                        self._loadImgDefault();
                    })
                    .load(function() {
                        var $img = $(this);
                        $img.prependTo(self.$thumb.empty())
                            .nosOnShow('one', function() {
                                $img.css({
                                    marginTop: '-' + ($img.height() / 2) + 'px',
                                    marginLeft: '-' + ($img.width() / 2) + 'px'
                                });
                            });
                    })
                    .addClass('nos-itempicker-img')
                    .attr('src', o.dataset.thumbnail);

                return self;
            },

            _loadImgDefault : function() {
                var self = this,
                    o = self.options;

                var $background = $('<div></div>')
                    .addClass('nos-itempicker-img-default')
                    .prependTo(self.$thumb.empty());

                if (o.defaultThumbnail) {
                    $background.css('background-image', 'url(' + o.defaultThumbnail + ')');
                }

                return self;
            }
        });
        return $;
    });
