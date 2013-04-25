/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-publishable',
    ['jquery-nos', 'jquery-ui.button', 'jquery-ui.datetimepicker.i18n'],
    function($) {
        "use strict";

        var update_date_label = function($input, $p, params) {

            var $container = $p.closest('tr'),
                $pick = $container.find('a.date_pick'),
                $clear = $container.find('a.date_clear'),
                value = $input.val();

            require(['jquery.globalize', 'jquery.globalize.cultures'], function() {
                if (value == '') {
                    if ($pick.is(':visible')) {
                        // Date pick layout is here, nothing to do!
                    } else {
                        $p.hide();
                        $clear.hide();
                        $pick.show();
                        $pick.text(params.texts.pick).off('click').on('click', function showDatePickerEmpty(e) {
                            e.preventDefault();
                            $input.datetimepicker('show');
                        });
                    }
                } else {
                    // Globalize.culture('en-GB') (both lang + country, separated with a dash).
                    Globalize.culture( $.nosLang.replace(/_/, '-'));
                    var date = $input.datetimepicker('getDate'),
                        formatted = Globalize.format(date, 'd') + ' ' + Globalize.format(date, 't');

                    if ($clear.is(':visible')) {
                        // Date layout is here, just update the text!
                        $p.text(formatted);

                    } else {
                        $p.show();
                        $clear.show();
                        $pick.hide();
                        $clear.text(params.texts['clear']);
                        $p.text(formatted).off('click').on('click', function showDatePickerValue(e) {
                            e.preventDefault();
                            $input.datetimepicker('show');
                        });
                        $clear.off('click').on('click', function clearDatePicker(e) {
                            e.preventDefault();
                            $input.val('').trigger('change');
                        });
                    }
                }
            });
        }

        $.fn.extend({
            nosPublishable : function(params) {
                params = params || {
                    initialStatus: 'undefined',
                    date_range: false,
                    texts: {
                        'undefined' : {
                            0 : 'Will not be published',
                            1 : 'Will be published'
                        },
                        'no' : {
                            0 : 'Not published',
                            1 : 'Will be published'
                        },
                        'yes' : {
                            0 : 'Will be unpublished',
                            1 : 'Published'
                        }
                    }
                };

                return this.each(function() {
                    var $container = $(this),
                        $buttonset = $container.find('.publishable_radio'),
                        $label = $container.find('.publishable_label'),
                        $planned = $container.find('.publishable_schedule'),
                        dateRangeStatus = 'initial', // 'initial' or 'modified'
                        changeAlt = function() {
                            $buttonset.find(':radio').each(function() {
                                var $radio = $(this),
                                    $img = $buttonset.find('label[for=' + $radio.attr('id') + '] img');

                                $img.attr({
                                    title: params.texts[params.initialStatus][$radio.val()],
                                    alt: params.texts[params.initialStatus][$radio.val()]
                                });
                            });
                        };

                    if (params.date_range) {
                        $planned.nosOnShow('one', function() {
                            var $publishable = $('#' + params.date_range.container),
                                $input_start = $publishable.find('#' + params.date_range.inputStart),
                                $input_end = $publishable.find('#' + params.date_range.inputEnd),
                                now = params.date_range.now;

                            // new Date(year, month, day, hour, min, sec)
                            // month range is 0-11
                            now = new Date(now[0], now[1] - 1, now[2], now[3], now[4], now[5]);

                            // This event is triggered first
                            $input_start.add($input_end).on('change', function(e) {
                                var date_start = $input_start.datetimepicker('getDate'),
                                    date_end = $input_end.datetimepicker('getDate'),
                                    planification = '',
                                    css, $table;

                                if (date_start == null && date_end == null) {
                                    planification = 'scheduled';
                                } else if (date_end != null && date_end < now) {
                                    planification = 'backdated';
                                } else if (date_start == null || date_start < now) {
                                    planification = 'published';
                                } else {
                                    planification = 'scheduled';
                                }

                                // We need to refresh the layout when this changes = when the 'dateRangeStatus' changes or the 'planification' changes
                                css = 'planification_status_' + dateRangeStatus + '_' + planification;
                                $table = $planned.find('table.' + css);

                                if ($table.length > 0) {
                                    // Layout has not changed, just update the values
                                } else {
                                    $table = $('<table class="publication_status ' + css + '"></table>').append(params.date_range.texts[dateRangeStatus][planification]);
                                    $planned.empty().append($table);
                                    dateRangeStatus = 'modified';
                                }

                                // Update texts
                                update_date_label($input_start, $planned.find('a.date_start'), params.date_range);
                                update_date_label($input_end, $planned.find('a.date_end'), params.date_range);
                            });

                            $.timepicker.setDefaults($.timepicker.regional[$.nosLang.substr(0, 2)]);
                            $input_start.datetimepicker({
                                timeFormat: 'HH:mm:ss',
                                dateFormat: 'yy-mm-dd',
                                maxDate: $input_end.val(),
                                onClose: function(selectedDate ) {
                                    $input_end.datepicker('option', 'minDate', selectedDate);
                                }
                            });
                            $input_end.datetimepicker({
                                timeFormat: 'HH:mm:ss',
                                dateFormat: 'yy-mm-dd',
                                minDate: $input_start.val(),
                                onClose: function(selectedDate) {
                                    $input_start.datepicker('option', 'maxDate', selectedDate);
                                }
                            });

                            // When clearing the start date, remove the minDate restriction on the end date
                            $input_start.on('change', function() {
                                if ($(this).val() == '') {
                                    $input_end.datepicker('option', 'minDate', '');
                                }
                            });

                            // When clearing the end date, remove the maxDate restriction on the start date
                            $input_end.on('change', function() {
                                if ($(this).val() == '') {
                                    $input_start.datepicker('option', 'maxDate', '');
                                }
                            });

                            $input_start.trigger('change');
                        });
                    }

                    changeAlt();
                    $buttonset.buttonset();
                    $buttonset.find(':radio')
                        .change(function() {
                            var value = $(this).val();
                            $label.text(params.texts[params.initialStatus][value]);
                            changeAlt();
                            if (value == 2) {
                                $label.hide();
                                $planned.show().nosOnShow();
                            } else {
                                $label.show();
                                $planned.hide();
                            }
                        });
                    $buttonset.find(':checked')
                        .triggerHandler('change');
                    $buttonset.closest('form')
                        .bind('ajax_success', function(e, json) {
                            if (json.publication_initial_status == null) {
                                log('Potential error: publication_initial_status in JSON response.');

                                return;
                            }
                            params.initialStatus = json.publication_initial_status;
                            if (params.date_range && params.initialStatus == 2) {
                                dateRangeStatus = 'initial';
                                $('#' + params.date_range.inputStart).trigger('change');

                            } else {
                                $buttonset.find(':radio[value=' + params.initialStatus + ']')[0].checked = true;
                                $buttonset.find(':checked').triggerHandler('change');
                            }
                        });
                });
            }
        });

        return $;
    });
