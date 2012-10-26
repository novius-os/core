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
<div id="<?= $id ?>" style="display:none;"><?= str_replace(array('xxxbeginxxx', 'xxxendxxx'), array($date_begin, $date_end), $label_custom) ?></div>
<script type="text/javascript">
require(
    ['jquery-nos-inspector-date'],
    function( $, undefined ) {
        $(function() {
            $('#<?= $id ?>').nosInspectorDate({
                texts: {
                    labelCustom: "<?= $label_custom ?>"
                },
                content: <?= $content ?>
            });
        });
    });
</script>
