/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-inspector-tree-model-radio',
    ['jquery', 'jquery-nos-treegrid'],
    function($) {
        "use strict";

        $.fn.extend({
            nosInspectorTreeModelRadio : function(params) {
                params = params || {};
                return this.each(function() {
                    var container = $(this)
                            .css({
                                height: params.height || '150px',
                                width: params.width || ''
                            }),
                        id = container.attr('id'),
                        table = container.find('table'),
                        connector = container.closest('.nos-dispatcher, body')
                            .on('contextChange', function() {
                                listenReloadEvent();
                                if (params.contextChange) {
                                    table.nostreegrid('option', 'treeOptions', {
                                        context : connector.data('nosContext') || ''
                                    });
                                }
                            }),
                        rendered = false,
                        $hidden = $('<input type="hidden" />').attr({
                                name : params.input_name,
                                value : $.isPlainObject(params.selected) && params.selected.id ? params.selected.id : ''
                            })
                            .appendTo(container),
                        listenReloadEvent = function() {
                            if (params.reloadEvent) {
                                container.nosUnlistenEvent('inspector' + id);
                                var match = {
                                    name : params.reloadEvent
                                };
                                if (params.contextChange && connector.data('nosContext')) {
                                    match['context'] = connector.data('nosContext');
                                }
                                container.nosListenEvent(match, function() {
                                    table.nostreegrid('reload');
                                }, 'inspector' + id);
                            }
                        },
                        init = function() {
                            listenReloadEvent();

                            var treeOptions = $.extend(true, {}, params.treeOptions || {});
                            if (!treeOptions.context) {
                                treeOptions.context = connector.data('nosContext') || '';
                            }

                            table.nostreegrid({
                                sortable : false,
                                movable : false,
                                urlJson : params.urlJson,
                                treeColumnIndex : 1,
                                treeOptions : treeOptions,
                                preOpen : params.selected || {},
                                initialDepth : params.initialDepth || 2,
                                columnsAutogenerationMode : 'none',
                                scrollMode : 'auto',
                                loadingText: params.loadingText || 'Loading...',
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
                                        params.selected.id = data._id;
                                        row.$rows.find(':radio[value=' + params.selected.id + ']').prop('checked', true).triggerHandler('click');
                                    }
                                },
                                rendering : function() {
                                    rendered = false;
                                },
                                rendered : function() {
                                    rendered = true;
                                    table.css("height", "auto");
                                    if ($.isPlainObject(params.selected) && params.selected.id) {
                                        var radio = container.find(':radio[value=' + params.selected.id + ']')
                                                .prop('checked', true),
                                            nostreegrid = table.data('nos-nostreegrid');

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
                            if ($.isPlainObject(args.row.data)) {

                                $('<input type="radio" />').attr({
                                    name : params.input_name + 'fake',
                                    value : args.row.data._id
                                })
                                    .click(function() {
                                        // Save the selected in params in cas of a refresh tree event
                                        params.selected = {
                                            id : args.row.data._id,
                                            model : args.row.data._model
                                        };
                                        $hidden.val(args.row.data._id);
                                        $(this).trigger('selectionChanged', args.row.data);
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
                    table.nosOnShow('one', init);
                });
            }
        });

        return $;
    });
