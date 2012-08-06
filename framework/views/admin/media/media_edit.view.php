<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

$uniqid = uniqid('id_');
$fieldset->set_config('field_template', '{field}');
?>

<div class="page line ui-widget" id="<?= $uniqid ?>">
	<?= $fieldset->build_hidden_fields(); ?>
	<div class="unit col c1" ></div>
	<div class="unit col c2" style="z-index:99;border:1px solid gray;height:300px;line-height:300px;text-align:center;">
        <?php
        if ($media->is_image()) {
            list($src, $width, $height, $ratio) = $media->get_img_infos(128, null);
            printf('<img src="%s" width="%s", height="%s" style="vertical-align:middle;" />', $src, $width, $height);
        }
        ?>
    </div>
	<div class="unit col c6" style="z-index:99;">
        <div class="line" style="margin-bottom:1em;">
            <table class="fieldset standalone">
                <tr class="title">
                    <th></th>
                    <td><?= $fieldset->field('media_title')->build() ?></td>
                </tr>
                <tr>
                    <th><?= $fieldset->field('media')->label ?></th>
                    <td><?= $fieldset->field('media')->build() ?></td>
                </tr>
                <tr>
                    <th><?= $fieldset->field('media_file')->label ?></th>
                    <td class="table-field"><?= $fieldset->field('media_file')->build() ?><span>.<?= $media->media_ext ?> &nbsp; <label><input type="checkbox" data-id="same_title" checked /> <?= __('Generate from title') ?></label></span></td>
                </tr>
                <tr>
                    <th><?= $fieldset->field('media_folder_id')->label; ?></th>
                    <td><?= $fieldset->field('media_folder_id')->build(); ?></td>
                </tr>
            </table>
        </div>
    </div>
</div>

<script type="text/javascript">
require(
    [
        'jquery-nos',
        'static/novius-os/admin/config/media/seo_compliant'
    ],
    function($) {
        $(function() {
            var $container = $('#<?= $uniqid ?>');

            var $file       = $container.find(':file[name=media]');
            var $title      = $container.find('input[name=media_title]');
            var $slug       = $container.find('input[name=media_file]');
            var $same_title = $container.find('input[data-id=same_title]');

            $file.change(function() {
                var path = $file.val();

                // Get the filename only
                // Remove the dirname
                path = path.replace(/^.*[\/\\]/g, '');
                // Remove the extension
                path = path.split('.');
                if (path.length > 1) {
                    path.pop();
                }
                path = path.join('.');

                // Format a bit the title
                // Cleanup
                path = path.replace(/[^a-z0-9A-Z]/g, ' ').replace(/\s+/g, ' ');
                // Ucwords
                path = path.replace(/^([a-z])|\s+([a-z])/g, function ($1) {
                    return $1.toUpperCase();
                });
                $title.val(path).triggerHandler('change');
            });

            // Same title and description (alt)
            $title.bind('change keyup', function() {
                if ($same_title.is(':checked')) {
                    $slug.val($.seoCompliant($title.val()));
                }
            });
            $same_title.change(function() {
                if ($(this).is(':checked')) {
                    $slug.attr('readonly', true).addClass('ui-state-disabled').removeClass('ui-state-default');
                    $title.triggerHandler('change');
                } else {
                    $slug.removeAttr('readonly').addClass('ui-state-default').removeClass('ui-state-disabled');
                }
            }).triggerHandler('change');

            $container.find('form').bind('ajax_success', function() {
                $(this).nosDialog('close');
            });
        });
    });
</script>