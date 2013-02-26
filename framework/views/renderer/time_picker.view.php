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
            'jquery',
            'jquery-ui.datetimepicker.i18n'
        ],
        function($) {
            $(function() {
                var $input = $('input#<?= $id ?>');
                $.timepicker.setDefaults($.timepicker.regional[$.nosLang.substr(0, 2)]);
                $input.timepicker($input.data('timepicker-options'));
            });
        });
</script>
