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
<table <?= array_to_attr($attributes); ?>></table>
<script type="text/javascript">
require([
		'jquery-nos-treegrid'
	], function( $nos, table, undefined ) {
		$nos(function() {
			var inspector = $nos('#<?= $attributes['id'] ?>'),
				connector = inspector.closest('.nos-inspector, body')
					.on('langChange', function() {
						if (inspectorData.langChange) {
							inspector.nostreegrid('option', 'treeOptions', {
								lang : connector.data('nosLang') || ''
							});
						}
					}),
				parent = inspector.parent()
					.on({
						widgetResize : function() {
                            inspector.nostreegrid('setSize', parent.width(), parent.height());
						},
						widgetReload : function() {
							inspector.nostreegrid('reload');
						}
					}),
                inspectorData = parent.data('inspector'),
				rendered = false;

			if (inspectorData.reloadEvent) {
				inspector.listenEvent('reload.' + inspectorData.reloadEvent, function() {
					parent.trigger('widgetReload');
				});
			}

            inspector.css({
                    height : '100%',
                    width : '100%'
                })
                .nostreegrid($nos.extend({
		            treeOptions : {
			            lang : connector.data('nosLang') || ''
		            },
                    columnsAutogenerationMode : 'none',
                    scrollMode : 'auto',
                    allowColSizing : true,
                    allowColMoving : true,
                    currentCellChanged : function(e) {
                        var row = $nos(e.target).nostreegrid("currentCell").row(),
                            data = row ? row.data : false;

                        if (data && rendered) {
                            inspectorData.selectionChanged(data.id, data.title);
                        }
                        inspector.nostreegrid("currentCell", -1, -1);
                    },
                    rendering : function() {
                        rendered = false;
                    },
                    rendered : function() {
                        rendered = true;
                        inspector.css("height", "auto");
                    }
                }, inspectorData.treeGrid));
		});
	});
</script>