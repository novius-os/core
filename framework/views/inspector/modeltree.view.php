<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
empty($attributes) and $attributes = array();
empty($attributes['id']) and $attributes['id'] = uniqid('temp_');
?>
<table <?= array_to_attr($attributes); ?>></table>
<script type="text/javascript">
require(
    ['jquery-nos-inspector-tree-model'],
    function($) {
        $(function() {
            $('#' + <?= \Format::forge($attributes['id'])->to_json() ?>).nosInspectorTreeModel();
        });
    });
</script>
