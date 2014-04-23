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
        $(function() {
            var $select = $('#<?= $id ?>');
            var $dispatcher = $select.closest('.nos-dispatcher, body')
                .on('contextChange', function() {
                    var context = $dispatcher.data('nosContext');
                    $.ajax({
                        url: 'admin/nos/renderer/select/model',
                        data: {
                            options: $.extend(<?= \Format::forge($renderer_options)->to_json() ?>, {
                                context: context
                            })
                        },
                        dataType: 'json',
                        success: function(data) {
                            $select.empty();
                            $.each(data, function() {
                                var option = this;
                                $('<option></option>').val(option.value)
                                    .text(option.text)
                                    .appendTo($select);
                            });
                        }
                    });
                });
        });
    });
</script>
