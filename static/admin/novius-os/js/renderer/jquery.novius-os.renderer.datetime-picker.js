define('jquery-nos-renderer-datetimepicker',
    ['jquery-nos', 'jquery-ui.datepicker.i18n', 'jquery-ui.datetimepicker.i18n'],
    function($) {
    "use strict";
    var undefined = void(0);
    $.widget( "nos.nosDatetimePicker", {
        options: {
            wrapper: null
        },
        _create: function() {
            var self = this,
                o = self.options;

            var $input = this.element,
                options = $input.data('options'),
                datetimeOptions = options['datepicker'],
                $displayedField = $('#' + this.element.attr('id') + '_displayed').change(function() {
                    if (!$.trim($displayedField.val())) {
                        $displayedField[options['plugin']]('setDate', null);
                        if (options['plugin'] === 'datetimepicker') {
                            $input.val('');
                        }
                    }
                });

            if (typeof datetimeOptions.altField === 'undefined') {
                datetimeOptions.altField = '#' + $input.attr('id');
            }

            $.datepicker.setDefaults($.datepicker.regional[$.nosLang.substr(0, 2)]);
            $.timepicker.setDefaults($.timepicker.regional[$.nosLang.substr(0, 2)]);

            if (o.wrapper !== null) {
                $input.wrap(o.wrapper);
            }

            var inputDate = $input.val();

            var date = $.datepicker.parseDateTime(datetimeOptions.altFormat, datetimeOptions.altTimeFormat, inputDate);

            var displayFieldAttr = $displayedField.attr('size');
            $displayedField[options['plugin']](datetimeOptions);
            $displayedField.attr('size', displayFieldAttr);
            $displayedField[options['plugin']]('setDate', date);
        }
    });
    return $;
});



