/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-inspector-date',
    ['jquery-nos-listgrid', 'jquery-ui.datepicker'],
    function($) {
        "use strict";

        $.fn.extend({
            nosInspectorDate : function(params) {
                params = params || {
                    texts: {
                        labelCustom: 'Custom'
                    },
                    content: {}
                };
                return this.each(function() {
                    var label_custom = $(this).removeAttr('id')
                            .css({
                                display : 'inline-block'
                            }).hide(),
                        inspector = $('<table></table>').insertAfter(label_custom),
                        parent = inspector.parent().bind({
                                widgetResize: function() {
                                    label_custom.appendTo(parent);
                                    inspector.noslistgrid('setSize', parent.width(), parent.height());
                                }
                            }),
                        inspectorData = parent.data('inspector'),
                        dates = label_custom.find(':input').datepicker('option', 'onSelect', function( selectedDate ) {
                                var option = this === label_custom.find(':input:first')[0] ? "minDate" : "maxDate",
                                    instance = $( this ).data( "datepicker" ),
                                    begin = label_custom.find(':input:first').val(),
                                    end = label_custom.find(':input:last').val(),
                                    label = params.texts.labelCustom;

                                var date = $.datepicker.parseDate( instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings );
                                dates.not( this ).datepicker( "option", option, date );

                                if (begin || end) {
                                    if (begin) {
                                        label = label.replace('xxxbeginxxx', begin);
                                    } else {
                                        label = 'Until ' + end;
                                    }
                                    if (end) {
                                        label = label.replace('xxxendxxx', end);
                                    } else {
                                        label = 'Since ' + begin;
                                    }
                                    if ($.isFunction(inspectorData.selectionChanged)) {
                                        inspectorData.selectionChanged(begin + '|' + end, label);
                                    }
                                }
                            }),
                        rendered = false;

                    inspector.css({
                            height : '100%',
                            width : '100%'
                        })
                        .noslistgrid({
                            columnsAutogenerationMode : 'none',
                            scrollMode : 'auto',
                            showGroupArea : false,
                            columns : [
                                {
                                    dataKey : 'group',
                                    groupInfo: {
                                        groupSingleRow : false,
                                        position: "header",
                                        outlineMode: "startCollapsed",
                                        headerText: "<b>{0}</b>"
                                    },
                                    visible : false
                                },
                                {
                                    headerText : inspectorData.label,
                                    cellFormatter: function (args) {
                                        if ($.isPlainObject(args.row.data) && args.row.data.value === 'custom') {
                                            args.$container.css({
                                                'white-space' : 'normal',
                                                'padding-left' : '10px'
                                            });
                                            $('<span></span>').text(args.row.data.title)
                                                .css({
                                                    'white-space' : 'nowrap',
                                                    'margin-right' : '10px'
                                                })
                                                .appendTo(args.$container);
                                            label_custom.appendTo(args.$container);

                                            return true;
                                        } else {
                                            args.$container.css('padding-left', '30px');
                                        }
                                    },
                                    dataKey : 'title'
                                },
                                {
                                    visible : false
                                }
                            ],
                            data: params.content,
                            currentCellChanged: function (e) {
                                var row = $(e.target).noslistgrid("currentCell").row(),
                                    data = row ? row.data : false;

                                if (data && rendered) {
                                    if (data.value !== 'custom') {
                                        label_custom.hide();
                                    }
                                    if (data.value === 'custom') {
                                        label_custom.show();
                                    } else {
                                        inspectorData.selectionChanged(data.value, data.title);
                                    }
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
