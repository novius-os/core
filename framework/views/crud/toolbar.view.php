<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary('nos::application');

if (empty($saveField) && !empty($fieldset)) {
    $saveField = $fieldset->field('save');
    if (!$saveField) {
        if ($crud['is_new']) {
            //Note to translator: This is a submit button
            $saveField = __('Add');
        } else {
            //Note to translator: This is a submit button
            $saveField = __('Save');
        }
    }
    $saveField = (string) \View::forge('form/layout_save', array('save_field' => $saveField), false);
}
?>
<script type="text/javascript">
    require(['jquery-nos-toolbar-crud'],
        function ($) {
            $(function () {
                $('#<?= isset($container_id) ? $container_id : $fieldset->form()->get_attribute('id') ?>').nosToolbarCrud({
                    actions: <?= \Format::forge($crud['actions'])->to_json() ?>,
                    isNew: <?= \Format::forge($crud['is_new'])->to_json() ?>,
                    saveField: <?= \Format::forge($saveField)->to_json() ?>,
                    model: <?= \Format::forge($crud['model'])->to_json() ?>,
                    dataset: <?= \Format::forge($crud['dataset'])->to_json() ?>,
                    itemId: <?= \Format::forge((int) $item->{$crud['pk']})->to_json() ?>,
                    urlActions: <?= \Format::forge($crud['url_actions'])->to_json() ?>,
                    ajaxData: <?= \Format::forge($crud['behaviours']['twinnable'] ? array(
                            'common_id' => $item->{$crud['behaviours']['twinnable']['common_id_property']},
                            'context' => $crud['context'],
                        ) : '')->to_json() ?>
                });
            });
        });
</script>
