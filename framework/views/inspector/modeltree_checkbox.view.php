<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary('nos::common');
empty($attributes) and $attributes = array();
empty($attributes['id']) and $attributes['id'] = uniqid('temp_');
$params = array_merge(array(
    'loadingText' => __('Loading...'),
), $params);
?>
<div <?= array_to_attr($attributes); ?>><table class="nos-treegrid"></table></div>
<script type="text/javascript">
    require(
        ['jquery-nos-inspector-tree-model-checkbox'],
        function( $ ) {
            $(function() {
                $('#' + <?= \Format::forge($attributes['id'])->to_json() ?>).nosInspectorTreeModelCheckbox(<?= \Format::forge()->to_json($params) ?>);
            });
        });
</script>
