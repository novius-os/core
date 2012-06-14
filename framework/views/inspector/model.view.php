<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

    $id = uniqid('temp_');
?>
<table id="<?= $id ?>"></table>
<script type="text/javascript">
require([
		'jquery-nos-listgrid'
	], function( $nos, undefined ) {
		$nos(function() {
			var inspector = $nos('#<?= $id ?>').removeAttr('id'),
				connector = inspector.closest('.nos-inspector, body')
					.on('langChange', function() {
						if (inspectorData.langChange) {
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
                table_heights = $nos.grid.getHeights(),
                showFilter = inspectorData.grid.showFilter || false,
				rendered = false,
                pageSize = Math.floor((parent.height() - table_heights.footer - table_heights.header - (showFilter ? table_heights.filter : 0)) / table_heights.row);

			if (inspectorData.reloadEvent) {
				inspector.listenEvent('reload.' + inspectorData.reloadEvent, function() {
					parent.trigger('widgetReload');
				});
			}

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
	                        dataSource.proxy.options.data.lang = connector.data('nosLang') || '';
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
                    currentCellChanged: function (e) {
                        var row = $nos(e.target).noslistgrid("currentCell").row(),
                            data = row ? row.data : false;

                        if (data && rendered) {
                            inspectorData.selectionChanged(data.id, data.title);
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
	});
</script>
