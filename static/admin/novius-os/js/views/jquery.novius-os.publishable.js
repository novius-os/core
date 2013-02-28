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

        var init_range_input = function($input, $p) {

            var $p_empty  = $p.find('.date_empty');
            var $p_filled = $p.find('.date_filled');


            var $clear = $p_filled.find('.date_clear');
            $clear.on('click', function(e) {
                e.preventDefault();
                $input.val('').trigger('change');
            });

            $.timepicker.setDefaults($.timepicker.regional[$.nosLang.substr(0, 2)]);
            $input.datetimepicker({
                timeFormat: 'hh:mm:ss',
                dateFormat: 'yy-mm-dd'
            });

            var $pick = $p.find('.date_pick').on('click', function(e) {
                e.preventDefault();
                $input.datetimepicker('show');
            });

            $input.on('change', function() {
                var value = $input.val();
                require(['jquery.globalize', 'jquery.globalize.cultures'], function() {
                    Globalize.culture( $.nosLang.substr(0, 2) );
                    var date = $input.datetimepicker('getDate');
                    var formatted = Globalize.format(date, 'd') + ' ' + Globalize.format(date, 't');

                    $p_filled.find('.date_pick').text(formatted);
                });

                $p_empty[value == '' ? 'show' : 'hide']();
                $p_filled[value == '' ? 'hide' : 'show']();
            }).trigger('change');
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
                        $buttonset = $container.find('td:first'),
                        $label = $buttonset.next(),
                        $planned = $label.next(),
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
                        var $publishable = $('#' + params.date_range.container);
                        var $input_start = $publishable.find('#' + params.date_range.inputStart);
                        var $input_end = $publishable.find('#' + params.date_range.inputEnd);

                        init_range_input($input_start, $publishable.find('p.date_start'));
                        init_range_input($input_end, $publishable.find('p.date_end'));
                    }

                    changeAlt();
                    $buttonset.buttonset();
                    $buttonset.find(':radio')
                        .change(function() {
                            var value = $(this).val();
                            $label.text(params.texts[params.initialStatus][value]);
                            changeAlt();
                            $label[value == 2 ? 'hide' : 'show']();
                            $planned[value == 2 ? 'show' : 'hide']();
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
                            $buttonset.find(':checked').triggerHandler('change');
                        });
                });
            }
        });

        return $;
    });
