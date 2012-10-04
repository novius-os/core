<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

$uniqid_radio = uniqid('radio_');
?>
<div class="page" id="<?= $uniqid = uniqid('id_') ?>">
<?php
$basename = pathinfo($item->medif_path, PATHINFO_BASENAME);
$checked = $basename === \Nos\Orm_Behaviour_Virtualname::friendly_slug($item->medif_title);

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
if (!$item->is_new()) {
    echo $fieldset->field('medif_id')->build();
}
?>
    <table class="fieldset">
        <tr>
            <th><?= $fieldset->field('medif_title')->label; ?></th>
            <td><?= $fieldset->field('medif_title')->build(); ?></td>
        </tr>
        <tr style="height:85px;">
            <th style="vertical-align: top;"><?= $fieldset->field('medif_dir_name')->label; ?></th>
            <td style="width:350px;vertical-align: top;">
                <label><input type="checkbox" data-id="same_title" <?= $checked ? 'checked' : '' ?>> <?= __('Generate from title') ?></label> <br />
                <span style="vertical-align:middle;">
                    http://yoursite.com/media/<span data-id="path_prefix"><?= $item->is_new() ? (!empty($crud['situation']) ? $crud['situation']->medif_path : '') : $item->parent->medif_path ?></span>
                </span>
                <?= $fieldset->field('medif_dir_name')->build(); ?>
            </td>
        </tr>
<?php
if ($item->is_new()) {
    ?>
        <tr>
            <th><?= !empty($crud['situation']) ? '' :  $fieldset->field('medif_parent_id')->label; ?></th>
            <td id="<?= $uniqid_radio ?>"><?= $fieldset->field('medif_parent_id')->build(); ?></td>
        </tr>
    <?php
}
?>
    </table>
</div>

<script type="text/javascript">
    require(
        ['jquery-nos', 'static/apps/noviusos_media/config/seo_compliant'],
        function($) {
            $(function() {
                var $container = $('#<?= $uniqid ?>').nosFormUI();

                var $title      = $container.find('input[name=medif_title]');
                var $seo_title  = $container.find('input[name=medif_dir_name]');
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

                var $path_prefix = $container.find('span[data-id=path_prefix]');
                $container.find('#<?= $uniqid_radio ?>').delegate('input[name=medif_parent_id]', 'selectionChanged', function(e, row_data) {
                    $path_prefix.text(row_data && row_data.path && row_data.path != '/' ? row_data.path : '');
                });

                $container.find('form').bind('ajax_success', function() {
                    $(this).nosDialog('close');
                });

                $container.find('a[data-id=cancel]').click(function(e) {
                    e.preventDefault();
                    $(this).nosTabs('close');
                });
            });
        });
</script>
