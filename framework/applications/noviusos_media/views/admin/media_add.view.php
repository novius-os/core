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
?>

<div class="media_form page line ui-widget" id="<?= $uniqid ?>">
    <?= $fieldset->build_hidden_fields(); ?>
    <div class="col c1" style="z-index:99;"></div>
    <div class="col c11" style="z-index:99;">
        <div class="line" style="margin-bottom:1em;">
            <table class="fieldset standalone">
                <tr class="title">
                    <th><?= $fieldset->field('media')->label ?></th>
                    <td><?= $fieldset->field('media')->build() ?></td>
                </tr>
                <tr>
                    <th></th>
                    <td>
                        <p><em><?= strtr(__('The file size must not exceed {{size}}.'), array('{{size}}' => ini_get('upload_max_filesize'))) ?> <?= strtr(__('What’s more these file types are not allowed: {{extensions}}.'), array('{{extensions}}' => implode(', ', array_unique(\Config::get('novius-os.upload.disabled_extensions', array('php')))))) ?></em></p>
                    </td>
                </tr>
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
    </div>
</div>

<script type="text/javascript">
require(
    [
        'jquery-nos-media-add-form',
        'link!static/apps/noviusos_media/css/admin.css'
    ],
    function($) {
        $(function() {
            $('#<?= $uniqid ?>').nosFormUI().nosMediaAddForm();
        });
    });
</script>
