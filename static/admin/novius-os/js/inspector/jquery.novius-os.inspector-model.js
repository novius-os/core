/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-inspector-model',
    ['jquery-nos-listgrid', 'jquery-ui.datepicker'],
    function($) {
        "use strict";

        $.fn.extend({
            nosInspectorModel : function() {
                return this.each(function() {
                    var inspector = $(this),
                        id = inspector.attr('id'),
                        connector = inspector.closest('.nos-dispatcher, body')
                            .on('contextChange', function() {
                                listenReloadEvent();
                                if (inspectorData.contextChange) {
                                    inspector.noslistgrid('ensureControl', true);
                                }
                            }),
                        parent = inspector.parent()
                            .on({
                                widgetResize : function() {
                                    inspector.noslistgrid('setSize', parent.width(), parent.height());
                                },
                                widgetReload : function() {
                                    var size = Math.floor((parent.height() - table_heights.footer - table_heights.header - (showFilter ? table_heights.filter : 0)) / table_heights.row);
                                    if (size != pageSize) {
                                        pageSize = size
                                        inspector.noslistgrid('option', 'pageSize', pageSize);
                                    } else {
                                        inspector.noslistgrid('ensureControl', true);
                                    }
                                }
                            }),
                        inspectorData = parent.data('inspector'),
                        table_heights = $.grid.getHeights(),
                        showFilter = inspectorData.grid.showFilter || false,
                        rendered = false,
                        pageSize = Math.floor((parent.height() - table_heights.footer - table_heights.header - (showFilter ? table_heights.filter : 0)) / table_heights.row),
                        listenReloadEvent = function() {
                            if (inspectorData.reloadEvent) {
                                inspector.nosUnlistenEvent('inspector' + id);
                                var match = {
                                    name : inspectorData.reloadEvent
                                };
                                if (connector.data('nosContext')) {
                                    match['context'] = connector.data('nosContext');
                                }
                                inspector.nosListenEvent(match, function() {
                                    parent.trigger('widgetReload');
                                }, 'inspector' + id);
                            }
                        };
                    listenReloadEvent();

                    inspector.css({
                            height : '100%',
                            width : '100%'
                        })
                        .noslistgrid({
                            columnsAutogenerationMode : 'none',
                            showFilter: showFilter,
                            allowSorting: true,
                            scrollMode : 'auto',
                            allowPaging : true,
                            pageIndex : 0,
                            pageSize: pageSize,
                            allowColSizing : true,
                            allowColMoving : true,
                            loadingText: inspectorData.loadingText || 'Loading...',
                            columns : inspectorData.grid.columns,
                            data: new wijdatasource({
                                dynamic: true,
                                proxy: new wijhttpproxy({
                                    url: inspectorData.grid.urlJson,
                                    dataType: "json",
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        log(jqXHR, textStatus, errorThrown);
                                    },
                                    data: {}
                                }),
                                loading: function (dataSource, userData) {
                                    var r = userData.data.paging;
                                    dataSource.proxy.options.data.context = connector.data('nosContext') || '';
                                    dataSource.proxy.options.data.offset = r.pageIndex * r.pageSize;
                                    dataSource.proxy.options.data.limit = r.pageSize;
                                },
                                reader: {
                                    read: function (dataSource) {
                                        var count = parseInt(dataSource.data.total, 10);
                                        dataSource.data = dataSource.data.items;
                                        dataSource.data.totalRows = count;
                                    }
                                }
                            }),
                            noCellsSelected: true,
                            currentCellChanged: function (e) {
                                var row = $(e.target).noslistgrid("currentCell").row(),
                                    data = row ? row.data : false;

                                if (data && rendered) {
                                    inspectorData.selectionChanged(data.id, data._title);
                                }
                                inspector.noslistgrid("currentCell", -1, -1);
                            },
                            rendering : function() {
                                rendered = false;
                            },
                            rendered : function() {
                                rendered = true;
                                inspector.css('height', 'auto');
                            }
                        });
                });
            }
        });

        return $;
    });
