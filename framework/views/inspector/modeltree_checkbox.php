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
<div id="<?= $id ?>"><table class="nos-treegrid"></table></div>
<script type="text/javascript">
	require([
		'jquery-nos-treegrid'
	], function( $, table, undefined ) {
		$(function() {
			var params = <?= \Format::forge()->to_json($params) ?>,
				container = $('#<?= $id ?>').removeAttr('id')
					.css({
                        height: params.height || '150px',
                        width: params.width || ''
                    }),
				table = container.find('table'),
				connector = container.closest('.nos-inspector, body')
					.on('langChange', function() {
						if (params.langChange) {
							table.nostreegrid('option', 'treeOptions', {
								lang : connector.data('nosLang') || ''
							});
						}
					}),
				rendered = false,
				init = function() {
					container.find('input[name="' + params.input_name + '[]"]').remove();
					table.nostreegrid({
							sortable : false,
							movable : false,
							treeUrl : params.treeUrl,
							treeColumnIndex : 1,
							treeOptions : $.extend(true, {
								lang : connector.data('nosLang') || ''
							}, params.treeOptions || {}),
							preOpen : params.selected || {},
							columnsAutogenerationMode : 'none',
							scrollMode : 'auto',
							cellStyleFormatter: function(args) {
								if (args.$cell.is('td')) {
									args.$cell.removeClass("ui-state-highlight");
								}
							},
							rowStyleFormatter : function(args) {
								if (args.type == $.wijmo.wijgrid.rowType.header) {
									args.$rows.hide();
								}
							},
							currentCellChanged : function(e) {
								var row = $(e.target).nostreegrid("currentCell").row(),
									data = row ? row.data : false;

								if (data && rendered) {
									var checkbox = row.$rows.find(':checkbox[value=' + row.data._id + ']'),
										checked = checkbox.is(':checked');
									if (checked) {
										delete params.selected[row.data._model + '|' + row.data._id];
									} else {
										params.selected[row.data._model + '|' + row.data._id] = {
											id : row.data._id,
											model : row.data._model
										};
									}
									checkbox.prop('checked', !checked).trigger('selectionChanged', data);
								}
							},
							rendering : function() {
								rendered = false;
							},
							rendered : function() {
								rendered = true;
								table.css("height", "auto");
								if ($.isPlainObject(params.selected)) {
									$.each(params.selected, function(i, selected) {
										if ($.isPlainObject(selected) && selected.id) {
											container.find(':checkbox[value=' + selected.id + ']').prop('checked', true);
											table.data('nostreegrid');
										}
									});
								}
							},
							columns: params.columns
						})
						.closest('.nos-connector')
						.on('reload.' + params.widget_id, function() {
							parent.trigger('widgetReload');
						});
				};

			params.columns.unshift({
				allowMoving : false,
				allowSizing : false,
				width : 35,
				ensurePxWidth : true,
				cellFormatter : function(args) {
					if ($.isPlainObject(args.row.data)) {

						$('<input type="checkbox" />').attr({
								name : params.input_name + '[]',
								value : args.row.data._id
							})
							.appendTo(args.$container);

						return true;
					}
				}
			});

			if ($.isPlainObject(params.selected)) {
				$.each(params.selected, function(i, selected) {
					if ($.isPlainObject(selected) && selected.id) {
						$('<input type="hidden" />').attr({
								name : params.input_name + '[]',
								value : selected.id
							})
							.appendTo(container);
					}
				});
			}

			table.css({
				height : '100%',
				width : '100%'
			});
			table.nos().initOnShow('init', init);
		});
	});
</script>