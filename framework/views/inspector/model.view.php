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
<table id="<?= $id ?>"></table>
<script type="text/javascript">
require(
    ['jquery-nos-inspector-model'],
    function( $, undefined ) {
        $(function() {
            $('#' + <?= \Format::forge($id)->to_json() ?>).nosInspectorModel();
        });
    });
</script>
