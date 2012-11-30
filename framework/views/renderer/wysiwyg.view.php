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
        ['jquery-nos-wysiwyg'],
        function($) {
            $(function() {
                var $t = $("textarea#<?= $id ?>.not_initialized");
                $t.removeClass('not_initialized')
                    .wysiwyg($t.data('wysiwyg-options'));
            });
        });
</script>
