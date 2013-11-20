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
                        temp,
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
                        $hidden,
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
                                rendering : function() {
                                    rendered = false;
                                },
                                rendered : function() {
                                    rendered = true;
                                    table.css("height", "auto");
                                    if ($.isPlainObject(params.selected)) {
                                        $.each(params.selected, function(i, selected) {
                                            if ($.isPlainObject(selected) && selected.id) {
                                                var $checkbox = container.find(':checkbox[value=' + selected.id + ']').prop('checked', true);
                                                if (selected.disable_check) {
                                                    $checkbox.attr('disabled', selected.disable_check);
                                                }
                                            }
                                        });
                                    }
                                    if ($.isPlainObject(params.disabled)) {
                                        $.each(params.disabled, function(i, disabled) {
                                            if ($.isPlainObject(disabled) && disabled.id) {
                                                container.find(':checkbox[value=' + disabled.id + ']').attr('disabled', true);
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
                                            if (!$hidden.filter('[value="' + args.row.data._id + '"]').size()) {
                                                $('<input type="hidden" />').attr({
                                                        name : params.input_name + '[]',
                                                        value : args.row.data._id
                                                    })
                                                    .appendTo(container);
                                            }
                                        } else {
                                            params.selected[args.row.data._model + '|' + args.row.data._id] && delete params.selected[args.row.data._model + '|' + args.row.data._id];
                                            $hidden.filter('[value="' + args.row.data._id + '"]').remove();
                                        }
                                        $hidden = container.find('input[name="' + params.input_name + '[]"]');
                                        checkbox.trigger('selectionChanged', args.row.data);
                                    })
                                    .appendTo(args.$container);

                                return true;
                            }
                        }
                    });

                    if ($.isArray(params.selected)) {
                        temp = {};
                        $.each(params.selected, function(i, selected) {
                            if ($.isPlainObject(selected) && selected.id && selected.model) {
                                temp[selected.model + '|' + selected.id] = selected;
                            }
                        });
                        params.selected = temp;
                    }
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
                    $hidden = container.find('input[name="' + params.input_name + '[]"]');

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
