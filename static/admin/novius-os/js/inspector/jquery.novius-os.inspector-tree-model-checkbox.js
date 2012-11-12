/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-inspector-tree-model-checkbox',
    ['jquery', 'jquery-nos-treegrid'],
    function($) {
        "use strict";

        $.fn.extend({
            nosInspectorTreeModelCheckbox : function(params) {
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
                        listenReloadEvent = function() {
                            if (params.reloadEvent) {
                                container.nosUnlistenEvent('inspector' + id);
                                var match = {
                                    name : params.reloadEvent
                                };
                                if (connector.data('nosContext')) {
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

                            container.find('input[name="' + params.input_name + '[]"]').remove();
                            table.nostreegrid({
                                sortable : false,
                                movable : false,
                                urlJson : params.urlJson,
                                treeColumnIndex : 1,
                                treeOptions : treeOptions,
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
                                                if (selected.disable_check) {
                                                    container.find(':checkbox[value=' + selected.id + ']').attr('disabled', selected.disable_check);
                                                }
                                            }
                                        });
                                    }
                                    if ($.isPlainObject(params.disabled)) {
                                        $.each(params.disabled, function(i, disabled) {
                                            if ($.isPlainObject(disabled) && disabled.id) {
                                                container.find(':checkbox[value=' + disabled.id + ']').attr('disabled', true);
                                                table.data('nostreegrid');
                                            }
                                        });
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

                                $('<input type="checkbox" />').attr({
                                    name : params.input_name + '[]',
                                    value : args.row.data._id
                                })
                                    .click(function() {
                                        // Save the selected in params in cas of a refresh tree event
                                        var checkbox = $(this),
                                            checked = checkbox.is(':checked');
                                        if (checked) {
                                            params.selected[args.row.data._model + '|' + args.row.data._id] = {
                                                id : args.row.data._id,
                                                model : args.row.data._model
                                            };
                                        } else {
                                            params.selected[args.row.data._model + '|' + args.row.data._id] && delete params.selected[args.row.data._model + '|' + args.row.data._id];
                                        }
                                        checkbox.trigger('selectionChanged', args.row.data);
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
                    table.nosOnShow('one', init);
                });
            }
        });

        return $;
    });
