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

            var $input = this.element, datetimeOptions = $input.data('datepicker-options');

            datetimeOptions.altFormat = datetimeOptions.dateFormat;
            datetimeOptions.altTimeFormat = datetimeOptions.timeFormat;
            datetimeOptions.dateFormat = datetimeOptions.hiddenDateFormat;
            datetimeOptions.timeFormat = datetimeOptions.hiddenTimeFormat;

            $.datepicker.setDefaults($.datepicker.regional[$.nosLang.substr(0, 2)]);
            var inputDate = $input.val();

            if (o.wrapper !== null) {
                $input.wrap(o.wrapper);
            }
            $input.datetimepicker(datetimeOptions);

            // Update altField on init
            $input.datetimepicker('setDate', inputDate);

            // Remove altField, populate it manually. This is to allow editing the field with the keyboard without
            // hassle (the cursor would always return at the end of the input, like doing .focus())
            $input.datetimepicker('option', 'altField', '');

            // Update altField manually when selecting a date
            $input.datetimepicker('option', 'onSelect', function() {
                $input.datetimepicker('option', 'altField', datetimeOptions.altField);
                $input.datetimepicker('setDate', $input.datetimepicker('getDate'));
                $input.datetimepicker('option', 'altField', '');
            });

            // Open the date popup when focusing the altField
            var $altField = $(datetimeOptions.altField).on('focus', function() {
                $input.datetimepicker('show');
            });

            // Track keyboard change on altField to update the selected date
            $altField.on('keyup', function(e) {
                try {
                    var $this = $(this);
                    var date = $.datepicker.parseDateTime(datetimeOptions.altFormat, datetimeOptions.altTimeFormat, $this.val());
                    var originalDate = $input.datetimepicker('getDate');

                    if (date && (originalDate - date) != 0) {
                        var pos = self.doGetCaretPosition($this[0]);
                        $input.datetimepicker('setDate', date);
                        self.setCursor($this[0], pos);
                    }
                } catch (err) {
                    e.stopPropagation();
                    return;
                }
            });

        },

        // http://stackoverflow.com/a/1867393/888390
        setCursor: function(node,pos){

            var node = (typeof node == "string" || node instanceof String) ? document.getElementById(node) : node;

            if(!node){
                return false;
            }else if(node.createTextRange){
                var textRange = node.createTextRange();
                textRange.collapse(true);
                textRange.moveEnd(pos);
                textRange.moveStart(pos);
                textRange.select();
                return true;
            }else if(node.setSelectionRange){
                node.setSelectionRange(pos,pos);
                return true;
            }

            return false;
        },

        // http://stackoverflow.com/a/2897229/888390
        /*
         ** Returns the caret (cursor) position of the specified text field.
         ** Return value range is 0-oField.value.length.
         */
        doGetCaretPosition: function(oField) {

            // Initialize
            var iCaretPos = 0;

            // IE Support
            if (document.selection) {

                // Set focus on the element
                oField.focus ();

                // To get cursor position, get empty selection range
                var oSel = document.selection.createRange ();

                // Move selection start to 0 position
                oSel.moveStart ('character', -oField.value.length);

                // The caret position is selection length
                iCaretPos = oSel.text.length;
            }

            // Firefox support
            else if (oField.selectionStart || oField.selectionStart == '0')
                iCaretPos = oField.selectionStart;

            // Return results
            return (iCaretPos);
        }
    });
    return $;
});



