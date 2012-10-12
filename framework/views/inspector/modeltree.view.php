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
require(
    ['jquery-nos-treegrid'],
    function($) {
        $(function() {
            var id = <?= \Format::forge($attributes['id'])->to_json() ?>,
                inspector = $('#' + id),
                connector = inspector.closest('.nos-dispatcher, body')
                    .on('contextChange', function() {
                            listenReloadEvent();
                            if (inspectorData.contextChange) {
                                inspector.nostreegrid('option', 'treeOptions', {
                                    context : connector.data('nosContext') || ''
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
                rendered = false,
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
                .nostreegrid($.extend({
                    treeOptions : {
                        context : connector.data('nosContext') || ''
                    },
                    columnsAutogenerationMode : 'none',
                    scrollMode : 'auto',
                    allowColSizing : true,
                    allowColMoving : true,
                    currentCellChanged : function(e) {
                        var row = $(e.target).nostreegrid("currentCell").row(),
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
