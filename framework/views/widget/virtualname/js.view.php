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
        ['jquery-nos'],
        function($) {
            var replace_url = function(str) {
                if (!str) {
                    return str;
                }

                return str.replace(/ /g, '-')
                    .replace(/[\?|:|\\|\/|\#|\[|\]|@]/g, '-')
                    .replace(/-{2,}/g, '-')
                    .replace(/-$/g, '')
                    .replace(/^-/g, '')
                    .toLowerCase();
            };

            var $virtual_name = $("#<?= $id ?>");
            var $use_title_checkbox = $('#<?= $id ?>__use_title_checkbox');
            var $title = $virtual_name.closest('form').find('input.title');

            if (replace_url($title.val()) == $virtual_name.val() || $virtual_name.val() == '') {
                $use_title_checkbox.attr('checked', true).wijcheckbox("refresh");
            }

            $use_title_checkbox.change(function() {
                if ($(this).is(':checked')) {
                    $virtual_name.attr('readonly', true).addClass('ui-state-disabled').removeClass('ui-state-default');
                    $title.triggerHandler('change');
                } else {
                    $virtual_name.removeAttr('readonly').addClass('ui-state-default').removeClass('ui-state-disabled');
                }
            }).triggerHandler('change');

            $title.bind('change keyup', function() {
                if ($use_title_checkbox.is(':checked')) {
                    $virtual_name.val(replace_url($title.val()));
                }
            });

        });
</script>
