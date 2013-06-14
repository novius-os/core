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

if ($css !== null) {
    echo render('nos::admin/load_css', array('css_files' => $css));
}

if ($notify !== null) {
    echo render('nos::admin/notify', array('notify' => $notify));
}
?>
<div id="<?= $id ?>" class="<?= ($model === null ? '' : str_replace(array('\\', '_'), '-', strtolower($model))).' '.$application ?>"></div>
<script type="text/javascript">
require(
    ['jquery-nos-appdesk'],
    function($) {
        $(function() {
            $.appdeskAdd("<?= $id ?>", <?= $appdesk ?>);
        });
    });
</script>
