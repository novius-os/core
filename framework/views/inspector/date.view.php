<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

    $id = uniqid('temp_');
?>
<div id="<?= $id ?>" style="display:none;"><?= strtr($label_custom, array(
    '{{begin}}' => $date_begin,
    '{{end}}' => $date_end,
)) ?></div>
<script type="text/javascript">
require(
    ['jquery-nos-inspector-date'],
    function( $, undefined ) {
        $(function() {
            $('#<?= $id ?>').nosInspectorDate({
                texts: {
                    labelCustom: <?= \Format::forge()->to_json(''.$label_custom) ?>
                },
                content: <?= \Format::forge()->to_json($content) ?>
            });
        });
    });
</script>
