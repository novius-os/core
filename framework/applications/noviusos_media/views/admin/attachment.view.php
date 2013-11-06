<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */


Nos\I18n::current_dictionary(array('noviusos_media::common', 'nos::common'));

$uniqid = uniqid('id_');
$fieldset->set_config('field_template', '{field}');

echo $fieldset->open('admin/noviusos_media/attachment/popup');

//Note to translator: This is a submit button
$saveField = __('Add');
?>
<script type="text/javascript">
    require(['jquery-nos-toolbar-crud'],
            function ($) {
                $(function () {
                    var $container = $('#<?= $fieldset->form()->get_attribute('id') ?>');
                    $container.nosToolbar('add', <?= \Format::forge((string) \View::forge('form/layout_save', array('save_field' => $saveField), false))->to_json() ?>)
                            .click(function() {
                                if ($container.is('form')) {
                                    $container.submit();
                                } else {
                                    $container.find('form:visible').submit();
                                }
                            });
                });
            });
</script>


<div class="page line ui-widget" id="<?= $uniqid ?>">
    <?= $fieldset->build_hidden_fields(); ?>
    <div class="col c1"></div>
    <div class="col c10">
            <table class="fieldset standalone">
                <tr>
                    <th><?= $fieldset->field('media_title')->label ?></th>
                    <td><?= $fieldset->field('media_title')->build() ?></td>
                </tr>
                <tr>
                    <th><?= $fieldset->field('media_file')->label ?></th>
                    <td class="table-field"><?= $fieldset->field('media_file')->build() ?><span> &nbsp; <label><input type="checkbox" data-id="same_title" checked /> <?= __('Use title') ?></label></span></td>
                </tr>
                <tr>
                    <th><?= $fieldset->field('media_folder_id')->label ?></th>
                    <td><?= $fieldset->field('media_folder_id')->build() ?></td>
                </tr>
            </table>
    </div>
    <div class="col c1"></div>
</div>

<script type="text/javascript">
require(
    ['jquery-nos-media-add-form'],
    function($) {
        $(function() {
            $('#<?= $uniqid ?>').nosFormUI().nosMediaAddForm();
        });
    });
</script>

<?php
echo $fieldset->close();
