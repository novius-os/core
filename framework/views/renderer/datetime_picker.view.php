<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
?>
<script type="text/javascript">
    require(
        [
            'jquery-nos',
            'jquery-ui.datepicker.i18n',
            'jquery-ui.datetimepicker.i18n'
        ],
        function($) {
            $(function() {
                var $input = $('input#<?= $id ?>'), options = $input.data('datepicker-options');

                $.datepicker.setDefaults($.datepicker.regional[$.nosLang.substr(0, 2)]);
                var inputDate = $input.val();
                $input<?= !empty($wrapper) ? '.wrap('.\Format::forge()->to_json($wrapper).')' : '' ?>.datetimepicker(options);

                // Update altField on init
                $input.datetimepicker('setDate', inputDate);

                // Remove altField, populate it manually. This is to allow editing the field with the keyboard without
                // hassle (the cursor would always return at the end of the input, like doing .focus())
                $input.datetimepicker('option', 'altField', '');

                // Update altField manually when selecting a date
                $input.datetimepicker('option', 'onSelect', function() {
                    $input.datetimepicker('option', 'altField', options.altField);
                    $input.datetimepicker('setDate', $input.datetimepicker('getDate'));
                    $input.datetimepicker('option', 'altField', '');
                });

                // Open the date popup when focusing the altField
                var $altField = $(options.altField).on('focus', function() {
                    $input.datetimepicker('show');
                });

                // Track keyboard change on altField to update the selected date
                $altField.on('keyup', function(e) {
                    try {
                        var date = $.datetimepicker.parseDate( options.altFormat, $(this).val());
                        if (date) {
                            $input.datetimepicker('setDate', date);
                        }
                    } catch (err) {
                        e.stopPropagation();
                        return;
                    }
                });
            });
        });
</script>
