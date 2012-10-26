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
    require(['jquery-nos-toolbar-crud'],
        function ($) {
            $(function () {
                $('#<?= isset($container_id) ? $container_id : $fieldset->form()->get_attribute('id') ?>').nosToolbarCrud({
                    actions: <?= \Format::forge($crud['actions'])->to_json() ?>,
                    isNew: <?= \Format::forge($crud['is_new'])->to_json() ?>,
                    saveField: <?= \Format::forge((string) \View::forge('form/layout_save', array('save_field' => $fieldset->field('save')), false))->to_json() ?>,
                    model: <?= \Format::forge($crud['model'])->to_json() ?>,
                    itemId: <?= \Format::forge((int) $item->{$crud['pk']})->to_json() ?>,
                    urlActions: <?= \Format::forge($crud['url_actions'])->to_json() ?>,
                    ajaxData: <?= \Format::forge($crud['behaviours']['contextableAndTwinnable'] ? array(
                            'common_id' => $item->{$crud['behaviours']['contextableAndTwinnable']['common_id_property']},
                            'context' => $crud['context'],
                        ) : '')->to_json() ?>
                });
            });
        });
</script>
