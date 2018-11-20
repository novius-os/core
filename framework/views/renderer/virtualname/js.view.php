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
        ['jquery-nos-virtualname'],
        function($) {
            $("#<?= $id ?>").nosVirtualName(<?= \Format::forge($options)->to_json() ?>, <?= \Format::forge($config)->to_json() ?>);
        });
</script>
