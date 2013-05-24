/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-inspector-date',
    ['jquery-nos-listgrid', 'jquery-ui.datepicker.i18n'],
    function($) {
        "use strict";

        $.fn.extend({
            nosInspectorDate : function(params) {
                params = params || {
                    texts: {
                        'from begin to end': 'from {{begin}} to {{end}}',
                        'until end': 'until {{end}}',
                        'since begin': 'since {{begin}}'
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
                        dates = label_custom.find(':input[type=hidden]').each(function() {
                            var onSelect = $(this).datepicker('option', 'onSelect');
                            $(this).datepicker('option', 'onSelect', function(selectedDate, instance) {
                                if ($.isFunction(onSelect)) {
                                    onSelect.call(this, selectedDate, instance);
                                }

                                var option = this === label_custom.find(':input:first')[0] ? "minDate" : "maxDate",
                                    begin = label_custom.find(':text:first').val(),
                                    end = label_custom.find(':text:last').val(),
                                    begin_mysql = label_custom.find(':input[type=hidden]:first').val(),
                                    end_mysql = label_custom.find(':input[type=hidden]:last').val(),
                                    label;

                                var date = $.datepicker.parseDate( instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings );
                                dates.not( this ).datepicker( "option", option, date );

                                if (begin || end) {
                                    if (begin && end) {
                                        label = $.nosDataReplace(params.texts['from begin to end'], {begin: begin, end: end});
                                    } else if (!begin) {
                                        label = $.nosDataReplace(params.texts['until end'], {end: end});
                                    }
                                    if (!end) {
                                        label = $.nosDataReplace(params.texts['since begin'], {begin: begin});
                                    }
                                    if ($.isFunction(inspectorData.selectionChanged)) {
                                        inspectorData.selectionChanged(begin_mysql + '|' + end_mysql, label);
                                    }
                                }
                            });
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
