<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
    empty($attributes) and $attributes = array();
    empty($attributes['id']) and $attributes['id'] = uniqid('temp_');
?>
<div <?= array_to_attr($attributes); ?>><table class="nos-treegrid"></table></div>
<script type="text/javascript">
	require([
		'jquery', 'jquery-nos-treegrid'
	], function( $, $nos ) {
		$nos(function() {
			var params = <?= \Format::forge()->to_json($params) ?>,
				container = $nos('#<?= $attributes['id'] ?>')
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
					if (params.reloadEvent) {
                        console.log(container);
                        console.log($nos.fn);
						container.listenEvent('reload.' + params.reloadEvent, function() {
							table.nostreegrid('reload');
						});
					}

					table.nostreegrid({
							sortable : false,
							movable : false,
							treeUrl : params.treeUrl,
							treeColumnIndex : 1,
							treeOptions : $nos.extend(true, {
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
                                console.log($nos.wijmo);
								if (args.type == $.wijmo.wijgrid.rowType.header) {
									args.$rows.hide();
								}
							},
							currentCellChanged : function(e) {
								var row = $nos(e.target).nostreegrid("currentCell").row(),
									data = row ? row.data : false;

								if (data && rendered) {
									params.selected.id = data._id;
									row.$rows.find(':radio[value=' + params.selected.id + ']').prop('checked', true).trigger('selectionChanged', data);
								}
							},
							rendering : function() {
								rendered = false;
							},
							rendered : function() {
								rendered = true;
								table.css("height", "auto");
								if ($nos.isPlainObject(params.selected) && params.selected.id) {
									var radio = container.find(':radio[value=' + params.selected.id + ']')
										.prop('checked', true),
										nostreegrid = table.data('nostreegrid');

									nostreegrid._view()._getSuperPanel().scrollChildIntoView(radio);
								}
							},
							columns: params.columns
						});
				};

			params.columns.unshift({
				allowMoving : false,
				allowSizing : false,
				width : 35,
				ensurePxWidth : true,
				cellFormatter : function(args) {
					if ($nos.isPlainObject(args.row.data)) {

						$nos('<input type="radio" />').attr({
								name : params.input_name,
								value : args.row.data._id
							})
							.appendTo(args.$container);

						return true;
					}
				}
			});

            table.css({
                    height : '100%',
                    width : '100%'
                });
			table.nos().onShow('one', init);
		});
	});
</script>