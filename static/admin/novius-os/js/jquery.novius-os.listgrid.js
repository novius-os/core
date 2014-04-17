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
                noCellsSelected: false,
                pageSizeAuto: false,
                culture: $.nosLang.substr(0, 2),
                loadingText : 'Loading...',
                columnsOptions: {},
                pagerSettings: {
                    mode: 'numericFirstLast',
                    position: 'bottom'
                }
            },

            _create: function() {
                var self = this,
                    o = self.options,
                    heights;

                if (o.pageSizeAuto) {
                    o.pageSize = self._calculatePageSize(self.element.height());
                }

                self._compileColumns()
                    ._super();
            },

            _init: function() {
                var self = this,
                    o = self.options,
                    old_columnResized, old_ajaxError, old_cellStyleFormatter;

                if ($.isFunction(o.columnResized)) {
                    old_columnResized = o.columnResized;
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
                    old_ajaxError = o.ajaxError;
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

                if (o.noCellsSelected) {
                    if ($.isFunction(o.cellStyleFormatter)) {
                        old_cellStyleFormatter = o.cellStyleFormatter;
                    }
                    o.cellStyleFormatter = function(args) {
                        if ($.isFunction(old_cellStyleFormatter)) {
                            old_cellStyleFormatter.apply(this, arguments);
                        }
                        if (args.$cell.is('td')) {
                            args.$cell.removeClass("ui-state-highlight ui-state-default");
                        }
                    };
                }

                self._super();
            },

            _fakeForSize: function(options, return_cb) {
                var self = this,
                    $div = $('<div></div>')
                        .insertAfter(self.outerDiv || self.element),
                    $table = $('<table class="grid-fake"></table>')
                        .appendTo($div)
                        .noslistgrid(options),
                    val = return_cb($table, $div);

                $table.noslistgrid('destroy');
                $div.remove();

                return val;
            },

            _actionsWidth: function(actions) {
                var self = this;

                return self._fakeForSize({
                    scrollMode : 'none',
                    showFilter: true,
                    allowPaging : true,
                    columns : [
                        {
                            headerText : '',
                            cellFormatter : function(args) {
                                if ($.isPlainObject(args.row.data)) {

                                    var buttons = $.nosItemActions(actions, []);

                                    buttons.appendTo(args.$container);
                                    args.$container.parent().addClass('buttontd');

                                    return true;
                                }
                            },
                            allowSizing : true,
                            showFilter : false,
                            ensurePxWidth : true
                        }
                    ],
                    data: [
                        {
                            'key' : 'value'
                        }
                    ]
                }, function($table, $outerDiv) {
                    $table.find('.buttontd.wijgridtd')
                        .css('width', 'auto');

                    return $outerDiv.find('.buttontd .buttontd:first').outerWidth();
                });
            },

            _sectionsHeights: false,
            _getSectionsHeights: function() {
                var self = this;

                if (!self._sectionsHeights) {
                    self._sectionsHeights = self._fakeForSize({
                        pageSize: 1,
                        showFilter: true,
                        allowPaging : true,
                        data: [ ['test'], ['test2'] ]
                    }, function($table, $outerDiv) {
                        return {
                            row : $table.find('> tbody').find('tr:first').height(),
                            footer : $outerDiv.find('.wijmo-wijgrid-footer').outerHeight(),
                            header : $outerDiv.find('.wijmo-wijgrid-headerrow').outerHeight(),
                            filter : $outerDiv.find('.wijmo-wijgrid-filterrow').outerHeight()
                        };
                    });
                }

                return self._sectionsHeights;
            },

            _calculatePageSize: function(height) {
                var self = this,
                    o = self.options,
                    heights = self._getSectionsHeights();

                return Math.floor(
                    (height - heights.footer - heights.header - (o.showFilter ? heights.filter : 0)) / heights.row
                );
            },

            setSize: function(width, height) {
                var self = this,
                    o = self.options,
                    pageSize;

                this._super(width, height);

                if (o.pageSizeAuto && (height || height === 0)) {
                    pageSize = self._calculatePageSize(height);
                    if (pageSize != o.pageSize) {
                        self._setOption('pageSize', pageSize);
                    }
                }
            },

            _compileColumns: function() {
                var self = this,
                    o = self.options,
                    columns = o.columns,
                    columnsOptions = o.columnsOptions,
                    columnsBuild = [],
                    myHtmlspecialcharsParser = {
                        parseDOM: function (value, culture, format, nullString) {
                            return this.parse(value.innerHTML, culture, format, nullString);
                        },
                        parse: function (value, culture, format, nullString) {
                            if (value === null) return nullString;
                            return (value + '').replace(/&lt;/g, '<');
                        },
                        toStr: function (value, culture, format, nullString) {
                            if (value === null) return nullString;
                            return (value + '').replace(/</g, '&lt;');
                        }
                    };

                $.each(columns, function() {
                    var column = this,
                        nosContext, actions, width, showOnlyArrow;

                    if (column.context) {
                        if (columnsOptions.hideContexts) {
                            return true;
                        }
                        nosContext = $.nosContext({
                            locales: columnsOptions.locales,
                            sites: columnsOptions.sites,
                            contexts: columnsOptions.contexts
                        });
                        columnsBuild.push({
                            headerText : nosContext.label({
                                oneLocale: columnsOptions.texts.sites,
                                oneSite: columnsOptions.texts.languages,
                                defaultLabel: columnsOptions.texts.contexts
                            }),
                            visible: column.visible,
                            dataKey    : 'context',
                            allowSort : false,
                            showFilter : false,
                            cellFormatter : function(args) {
                                if (args.row.type & $.wijmo.wijgrid.rowType.data) {
                                    args.$container.css("text-align", "center").html(args.row.data.context);
                                    return true;
                                }
                            },
                            width : 1
                        });
                        return true;
                    }

                    if (column.actions) {
                        actions = column.actions === true ? columnsOptions.actions : column.actions;
                        showOnlyArrow = column.showOnlyArrow ? true : false;

                        if (showOnlyArrow) {
                            width = 20;
                        } else {
                            width = self._actionsWidth(actions);
                        }

                        // Make the drop-down actions columns
                        columnsBuild.push({
                            headerText : '',
                            cellFormatter : function(args) {
                                var buttons;
                                if ($.isPlainObject(args.row.data)) {

                                    buttons = $.nosItemActions(actions, args.row.data, {
                                        showOnlyArrow : showOnlyArrow
                                    });

                                    buttons.appendTo(args.$container);
                                    args.$container.parent().addClass('buttontd').css({width: width + 1});

                                    return true;
                                }
                            },
                            allowSizing : false,
                            allowSort : false,
                            width : width,
                            ensurePxWidth : true,
                            showFilter : false
                        });
                        return true;
                    }

                    if (column.cellFormatters) {
                        (function() {
                            var cellFormatters = $.isPlainObject(column.cellFormatters) ? column.cellFormatters : [column.cellFormatter];
                            var oldCellFormatter = column.cellFormatter;
                            column = $.extend(column, {
                                cellFormatter : function(args) {
                                    if (args.row.type & $.wijmo.wijgrid.rowType.data) {
                                        args.$container.html(args.formattedValue);
                                        if ($.isFunction(oldCellFormatter)) {
                                            oldCellFormatter.call(this, args);
                                        }
                                        $.each(cellFormatters, function(i, formatter) {
                                            formatter = $.nosDataReplace($.extend(true, {}, formatter), args.row.data);
                                            formatter = $.type(formatter) === 'object' ? formatter : {type: formatter};
                                            if (formatter.ignore && parseInt(formatter.ignore) > 0) {
                                                return;
                                            }
                                            if (formatter.replace) {
                                                args.$container.empty();
                                            }
                                            switch (formatter.type) {
                                                case 'bold':
                                                    args.$container.css('font-weight', 'bold');
                                                    break;

                                                case 'css':
                                                    if ($.type(formatter.css) === 'object') {
                                                        args.$container.css(formatter.css);
                                                    }
                                                    break;

                                                case 'icon':
                                                    if ($.isPlainObject(args.row.data)) {
                                                        var src = '';
                                                        formatter.column && args.row.data[formatter.column] && (src = args.row.data[formatter.column]);
                                                        formatter.src && (src = formatter.src);
                                                        $.type(formatter.mapping) === 'object' && formatter.mapping[args.formattedValue] && (src = formatter.mapping[args.formattedValue]);
                                                        if (!src) {
                                                            break;
                                                        }
                                                        var size = (formatter.size ? ' width="' + formatter.size + '" height="' + formatter.size + '"' : '');
                                                        args.$container.prepend(' <img src="' + src + '" ' + size + ' style="vertical-align: middle;" /> ');
                                                    }
                                                    break;

                                                case 'iconClasses':
                                                    if ($.isPlainObject(args.row.data)) {
                                                        if (formatter.column && !args.row.data[formatter.column]) {
                                                            break;
                                                        }
                                                        args.$container.prepend(' <span class="' + (formatter.column ? args.row.data[formatter.column] : formatter.classes) + '" style="float:left;"></span> ');
                                                    }
                                                    break;

                                                case 'link':
                                                    if (formatter.action === 'default') {
                                                        if ($.isArray(actions) && actions.length && actions[0].action) {
                                                            formatter.action = actions[0].name;
                                                        } else if (columnsOptions.actions) {
                                                            formatter.action = Object.keys(columnsOptions.actions)[0];
                                                        }
                                                    }
                                                    if (formatter.action && $.type(formatter.action) !== 'object' && columnsOptions.actions && columnsOptions.actions[formatter.action]) {
                                                        formatter._action_name = formatter.action;
                                                        formatter.action = columnsOptions.actions[formatter.action].action;
                                                    }
                                                    if (formatter._action_name && args.row.data.actions && $.type(args.row.data.actions[formatter._action_name]) === 'string') {
                                                        break;
                                                    }
                                                    if ($.type(formatter.action) === 'object') {
                                                        args.$container.wrapInner(
                                                            $('<a href="#"></a>')
                                                                .click(function(e) {
                                                                    e.preventDefault();
                                                                    $(this).nosAction(formatter.action, args.row.data);
                                                                })
                                                        );
                                                    }
                                                    break;

                                                default:
                                                    if (typeof formatter.type !== 'undefined') {
                                                        require([formatter.type], function(ret) {
                                                            ret.format(formatter, args);
                                                        }, function () {
                                                            log('Could not load formatter: ' + formatter.type);
                                                        });
                                                    }
                                            }
                                        });

                                        return true;
                                    }
                                }
                            });
                        })();
                        delete column.cellFormatters;
                    }

                    // Add a default htmlspecialchars dataParser
                    if (!column.dataParser && !column.isSafeHtml && !column.dataType) {
                        column.dataParser = myHtmlspecialcharsParser;
                    }

                    columnsBuild.push(column);
                });

                o.columns = columnsBuild;

                return self;
            }
        });
        return $;
    });
