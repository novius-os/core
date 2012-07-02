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
<div class="page" id="<?= $uniqid = uniqid('id_') ?>">
    <?php
    $fieldset->set_config('field_template', '{field}');

    foreach ($fieldset->field() as $field) {
        if ($field->type == 'submit') {
            $field->set_template('{field}');
        }
        if ($field->type == 'file') {
            $form_attributes = $fieldset->get_config('form_attributes', array());
            $form_attributes['enctype'] = 'multipart/form-data';
            $fieldset->set_config('form_attributes', $form_attributes);
        }
    }
    ?>
    <?= $fieldset->open('admin/nos/media/folder/do_edit'); ?>
    <?= $fieldset->field('medif_id')->build(); ?>
    <table class="fieldset">
        <tr>
            <th><?= $fieldset->field('medif_title')->label; ?></th>
            <td><?= $fieldset->field('medif_title')->build(); ?></td>
        </tr>
        <tr style="height:85px;">
            <th style="vertical-align: top;"><?= $fieldset->field('medif_path')->label; ?></th>
            <td style="width:350px;vertical-align: top;">
                <label><input type="checkbox" data-id="same_title" <?= $checked ? 'checked' : '' ?>> <?= __('Generate from title') ?></label> <br />
                <span style="vertical-align:middle;">
                    http://yoursite.com/media/<span data-id="path_prefix"><?= $folder->parent->medif_path ?></span>
                </span>
                <?= $fieldset->field('medif_path')->build(); ?>
            </td>
        </tr>
        <tr>
            <td></td>
            <td>
                <?= $fieldset->field('save')->build(); ?>
                &nbsp; <?= __('or') ?> &nbsp;
                <a href="#" data-id="cancel"><?= __('Cancel') ?></a>
            </td>
        </tr>
    </table>
    <?= $fieldset->close(); ?>
</div>

<script type="text/javascript">
require(
    ['jquery-nos', 'static/novius-os/admin/config/media/seo_compliant'],
    function($) {
        $(function() {
            var $container = $('#<?= $uniqid ?>').nosFormUI();

            var $title      = $container.find('input[name=medif_title]');
            var $seo_title  = $container.find('input[name=medif_path]');
            var $same_title = $container.find('input[data-id=same_title]');

            // Same title and description (alt)
            $title.bind('change keyup', function() {
                if ($same_title.is(':checked')) {
                    $seo_title.val($.seoCompliant($title.val()));
                }
            });
            $same_title.change(function() {
                if ($(this).is(':checked')) {
                    $seo_title.attr('readonly', true).addClass('ui-state-disabled').removeClass('ui-state-default');
                    $title.triggerHandler('change');
                } else {
                    $seo_title.removeAttr('readonly').addClass('ui-state-default').removeClass('ui-state-disabled');
                }
            }).triggerHandler('change');

            $container.find('form').bind('ajax_success', function() {
                $(this).nosDialog('close');
            })

            $container.find('a[data-id=cancel]').click(function(e) {
                e.preventDefault();
                $(this).nosTabs('close');
            });
        });
    });
</script>