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
$pathinfo = pathinfo($item->media_file);
$filename = $pathinfo['filename'];

$media_title = $fieldset->field('media_title');

$media_title->set_attribute('placeholder', $media_title->label);
?>

<div class="media_form page line ui-widget" id="<?= $uniqid ?>">
    <?= $fieldset->build_hidden_fields(); ?>
    <div class="col c1" ></div>
<?php
$main_col_size = 11;
if ($item->isImage()) {
    $main_col_size -= 3;
    echo '<div class="col c3 preview_zone">';
    $src = $item->urlResized(512, 512).'?t='.urlencode($item->media_updated_at);
    echo '<img src="'.$src.'" />';
    echo '</div>';
}
?>
    <div class="col c<?= $main_col_size ?>" style="z-index:99;">
        <div class="line" style="margin-bottom:1em;">
            <table class="fieldset standalone">
                <tr class="title">
                    <th></th>
                    <td><?= $media_title->build() ?></td>
                </tr>
                <tr>
                    <th><?= $fieldset->field('media')->label ?></th>
                    <td><?= $fieldset->field('media')->build() ?></td>
                </tr>
                <tr>
                    <th></th>
                    <td>
                        <p><em><?= strtr(__('The file size must not exceed {{size}}.'), array('{{size}}' => ini_get('upload_max_filesize'), '.')) ?> <?= strtr(__('What’s more these file types are not allowed: {{extensions}}.'), array('{{extensions}}' => implode(', ', array_unique(\Config::get('novius-os.upload.disabled_extensions', array('php')))))) ?></em></p>
                    </td>
                </tr>
                <tr>
                    <th><?= $fieldset->field('media_file')->label ?></th>
                    <td class="table-field"><?= $fieldset->field('media_file')->build() ?><span>.<span class="media_extension"><?= $item->media_ext ?></span> &nbsp; <label><input type="checkbox" data-id="same_title" /> <?= __('Use title') ?></label></span></td>
                </tr>
                <tr>
                    <th style="vertical-align: top;"><?= $fieldset->field('media_folder_id')->label; ?></th>
                    <td><?= $fieldset->field('media_folder_id')->build(); ?></td>
                </tr>
                <tr>
                    <th style="vertical-align: top;"><?= __('File size:') ?></th>
                    <td class="media_filesize"><?= \Num::format_bytes($item->media_filesize, 1) ?></td>
                </tr>
<?php
if ($item->isImage()) {
    ?>
                <tr>
                    <th style="vertical-align: top;"><?= __('Dimensions:') ?></th>
                    <td class="media_dimensions"><?= $item->media_width.' × '.$item->media_height ?></td>
                </tr>
    <?php
}
?>
            </table>
        </div>
    </div>
</div>

<script type="text/javascript">
require(
    [
        'jquery-nos-media-edit-form',
        'link!static/apps/noviusos_media/css/admin.css'
    ],
    function($) {
        $(function() {
            $('#<?= $uniqid ?>').nosFormUI().nosMediaEditForm();
        });
    });
</script>
