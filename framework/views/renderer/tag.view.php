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
            'jquery-ui.tag-it'
        ],
        function($) {
            var $t = $("#<?= $id ?>");
            $t.nosOnShow('one', function tagit() {
                $t.tagit({
                    animate: false,
                    caseSensitive: false,
                    availableTags: <?= \Format::forge($labels)->to_json() ?>
                });
            });
        });
</script>
