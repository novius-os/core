/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-thumbnailsgrid',
    ['jquery', 'jquery-nos', 'jquery-ui.widget', 'wijmo.wijsuperpanel', 'wijmo.wijpager'],
    function( $ ) {
        "use strict";
        var undefined = void(0);
        $.widget( "nos.thumbnailsgrid", {
            options: {
                thumbnailSize : 128,
                pageIndex: 0,
                pageSize: null,
                url : '',
                texts : {
                    loading : 'Loading...'
                },
                actions : [],
                loading : null,
                loaded : null,
                reader : null,
                dataParser : null,
                thumbFormatter : null
            },

            _data : null,

            _create: function() {
                var self = this;

                self.uiPager = $('<div></div>').addClass('wijmo-wijsuperpanel-footer  ui-state-default')
                    .appendTo(self.element);
            },


            destroy: function () {
                var self = this,
                    o = self.options;

                self.uiPager.wijpager('destroy');
                self.uiPager.remove();

                self.element.removeClass('nos-thumbnailsgrid nos-thumbnailsgrid-size-' + o.thumbnailSize)
                    .wijsuperpanel('destroy');

                $.Widget.prototype.destroy.apply(this, arguments);
            },

            _init: function() {
                var self = this,
                    o = self.options;

                if ($.inArray(o.thumbnailSize, [64, 128]) === -1) {
                    o.thumbnailSize = 128;
                }

                self.uiPager.wijpager({
                    pageIndexChanging : function(sender, args) {
                        self._trigger('pageIndexChanging', null, args);
                        o.pageIndex = args.newPageIndex;
                        self._load();
                    },
                    pageIndexChanged : function(sender, args) {
                        self._trigger('pageIndexChanged');
                        o.pageIndex = args.newPageIndex;
                        self._load();
                    }
                });
                self.element
                    .addClass('nos-thumbnailsgrid nos-thumbnailsgrid-size-' + o.thumbnailSize)
                    .wijsuperpanel({
                        showRounder : false,
                        autoRefresh : true
                    });

                self.uiContainer = $(self.element.wijsuperpanel('getContentElement'));

                self.uiOverlay = $('<div></div>')
                    .addClass('nos-thumbnailsgrid-overlay ui-widget-overlay')
                    .appendTo(self.element);
                self.uiOverlayText = $('<span><span></span>' + o.texts.loading + '</span>')
                    .addClass('nos-thumbnailsgrid-loadingtext ui-widget-content ui-corner-all')
                    .find('span')
                    .addClass('ui-icon ui-icon-clock')
                    .end()
                    .appendTo(self.element);

                self.uiOverlayText.css({
                    marginLeft : (self.uiOverlayText.width() * -1 / 2) + 'px',
                    marginTop : (self.uiOverlayText.height() * -1 / 2) + 'px'
                });

                if (o.pageSize === null) {
                    self._displayItem({
                        title : 'Test'
                    });

                    var el = self.uiContainer.find('.nos-thumbnailsgrid-thumb'),
                        container = self.uiContainer.parent();
                    self.itemDimension = {
                        width : el.outerWidth(true),
                        height : el.outerHeight(true)
                    };
                    self.uiContainer.empty();

                    o.pageSize = Math.floor(container.width() / self.itemDimension.width) * Math.max(1, Math.floor(container.height() / self.itemDimension.height));
                }

                self.dataSource = new wijdatasource({
                    dynamic: true,
                    proxy: new wijhttpproxy({
                        url: o.url,
                        dataType: "json",
                        error: function(jqXHR, textStatus, errorThrown) {
                            // Session lost, can't login
                            if (jqXHR.status == 403) {
                                $(this).nosAjaxError(jqXHR);
                            }
                            self.uiOverlay.hide();
                            log(jqXHR, textStatus, errorThrown);
                        },
                        data: {}
                    }),
                    loading: function(dataSource, userData) {
                        dataSource.proxy.options.data = $.extend(dataSource.proxy.options.data, userData.data);

                        self.uiOverlay.add(self.uiOverlayText)
                            .show();

                        if ($.isFunction(o.loading)) {
                            o.loading(dataSource, userData)
                        }
                    },
                    loaded: function(dataSource, data) {
                        if ($.isFunction(o.loaded)) {
                            o.loaded(dataSource, data)
                        }
                        self.uiPager.wijpager('option', {
                            pageCount : Math.ceil(dataSource.data.totalRows / data.data.paging.pageSize),
                            pageIndex : data.data.paging.pageIndex
                        });
                        self._data = dataSource.data;
                        self._display(dataSource.data);

                        self.uiOverlay.add(self.uiOverlayText)
                            .hide();
                    },
                    reader: o.reader
                });

                self._load();
            },

            _load : function() {
                var self = this,
                    o = self.options;

                self.dataSource.load({
                        data: {
                            paging: {
                                pageIndex: o.pageIndex,
                                pageSize: o.pageSize
                            }
                        },
                        afterRefresh: null,
                        beforeRefresh: null
                    });

                return self;
            },

            _display : function(items) {
                var self = this,
                    o = self.options,

                    parent = self.uiContainer.empty()
                        .parent();

                self.uiContainer.detach();
                $.each(items, function(i) {
                    var data = {
                        item : {
                            title : this._title,
                            thumbnail : (this.thumbnail ? this.thumbnail : this.thumbnailAlternate).replace(/64/g, o.thumbnailSize),
                            thumbnailAlternate : this.thumbnailAlternate.replace(/64/g, o.thumbnailSize),
                            actions : []
                        },
                        noParseData : this
                    };
                    self._displayItem(data, i);
                });
                self.uiContainer.appendTo(parent);

                self._trigger('rendered');

                return self;
            },

            _displayItem : function(data, index) {
                var self = this,
                    o = self.options,
                    item = data.item,
                    noParseData = data.noParseData;

                item = $.extend({
                    title : '',
                    thumbnail : null,
                    thumbnailAlternate : null
                }, item);

                var container = $('<div></div>')
                    .addClass('nos-thumbnailsgrid-thumb wijmo-wijgrid ui-widget-content')
                    .data('thumbnail', {
                        data : data,
                        index : index
                    })
                    .appendTo(self.uiContainer),

                    td = $('<table cellspacing="0" cellpadding="0" border="0"><tbody><tr><td></td></tr></tbody></table>')
                        .addClass('nos-thumbnailsgrid-thumb-grid wijmo-wijgrid-root wijmo-wijgrid-table')
                        .attr('title', item.title)
                        .css({
                            borderCollapse : 'separate',
                            '-moz-user-select' : '-moz-none'
                        })
                        .hover(
                            function() {
                                td.parent().addClass('ui-state-hover');
                            },
                            function() {
                                td.parent().removeClass('ui-state-hover');
                            }
                        )
                        .click(function() {
                            self.select(index);
                        })
                        .appendTo(container)
                        .find('tbody')
                        .addClass('ui-widget-content wijmo-wijgrid-data')
                        .find('tr')
                        .addClass('wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow')
                        .find('td')
                        .addClass('wijgridtd'),

                    imgContainer = $('<div></div>')
                        .addClass('nos-thumbnailsgrid-thumb-container-img wijmo-wijgrid-innercell')
                        .appendTo(td),

                    title = $('<div></div>')
                        .addClass('nos-thumbnailsgrid-thumb-title wijmo-wijgrid-innercell')
                        .text(item.title)
                        .appendTo(td);


                self._itemThumbnail(imgContainer, item, index);

                var buttons = $.nosItemActions(o.actions, noParseData);

                buttons.appendTo(container);

                if ($.isFunction(o.thumbFormatter)) {
                    o.thumbFormatter({
                        '$container' : container,
                        item : {
                            data : item,
                            index : index
                        }
                    });
                }

                return self;
            },

            _itemThumbnail : function(container, item, index) {
                var self = this,
                    o = self.options,
                    thumbnail = item.thumbnail || item.thumbnailAlternate,
                    colour = item.colour;

                if (colour) {
                    self._loadColour(container, colour);
                } else if (thumbnail) {
                    self._loadImg(container, item, thumbnail);
                } else {
                    self._loadImgDefault(container);
                }

                return self;
            },

            _loadImg : function(container, item, thumbnail) {
                var self = this,
                    o = self.options;

                $('<img />')
                    .error(function() {
                        if (thumbnail === item.thumbnail && item.thumbnailAlternate) {
                            self._loadImg(container, item, item.thumbnailAlternate);
                        } else {
                            self._loadImgDefault(container);
                        }
                    })
                    .load(function() {
                        var img = $(this);
                        img.prependTo(container)
                            .css({
                                marginTop : '-' + (img.height() / 2) + 'px',
                                marginLeft : '-' + (img.width() / 2) + 'px'
                            });
                    })
                    .addClass('nos-thumbnailsgrid-thumb-img')
                    .attr('src', thumbnail);

                return self;
            },

            _loadImgDefault : function(container) {
                var self = this,
                    o = self.options;

                $('<div></div>')
                    .addClass('nos-thumbnailsgrid-thumb-img-default')
                    .prependTo(container);

                return self;
            },

            _loadColour : function(container, colour) {
                var self = this;

                $(container)
                    .css('backgroundColor', colour);

                return self;
            },

            select : function(index) {
                var self = this,
                    o = self.options;

                if (index === undefined) {
                    var sel = self.uiContainer.find('.nos-thumbnailsgrid-thumb:has(wijmo-wijgrid-current-cell)');
                    if (sel.length) {
                        var data = sel.data('thumbnail');
                        return data.index;
                    }

                    return null;
                } else {
                    self.uiContainer.find('td').removeClass('wijmo-wijgrid-current-cell ui-state-highlight');

                    var sel = self.uiContainer.find('.nos-thumbnailsgrid-thumb').eq(index);
                    if (sel.length) {
                        var data = sel.data('thumbnail');

                        sel.find('.wijgridtd')
                            .eq(0)
                            .addClass('wijmo-wijgrid-current-cell ui-state-highlight');

                        self._trigger('selectionChanged', null, {item : data});
                    } else {
                        self._trigger('selectionChanged');
                        return false;
                    }
                }

                return self;
            },

            unselect : function() {
                this._trigger('selectionChanged');
            },

            setSize : function(width, height) {
                var self = this;

                if (width !== null) {
                    self.element.width(width);
                }
                if (height !== null) {
                    self.element.height(height);
                }

                return self;
            },

            data : function() {
                return this._data;
            }
        });
        return $;
    });
