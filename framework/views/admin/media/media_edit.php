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
require(['jquery-nos-ostabs'], function ($) {
	$(function () {
		$.nos.tabs.update({
			label : <?= json_encode($media->media_title) ?>,
			iconUrl : 'static/novius-os/admin/novius-os/img/16/media.png'
		});
	});
});
</script>

<div class="page fieldset standalone" id="<?= $uniqid = uniqid('id_') ?>">
    <?php
    $fieldset->set_config('field_template', '{field}');

    // Enctype multipart/form-data
    $form_attributes = $fieldset->get_config('form_attributes', array());
    $form_attributes['enctype'] = 'multipart/form-data';
    $fieldset->set_config('form_attributes', $form_attributes);
    ?>
    <?= $fieldset->open('admin/nos/media/media/update'); ?>
    <?= $fieldset->field('media_id')->build(); ?>
    <?php
    ob_start();
    ?>
    <table>
        <tr>
            <?= $media->is_image() ? '<td rowspan="3" style="width:128px;">'.$media->get_img_tag_resized(128, null).'</td>' : '' ?>
            <th><?= $fieldset->field('media_title')->label ?></th>
            <td><?= $fieldset->field('media_title')->build() ?></td>
        </tr>
        </tr>
        <tr>
            <th><?= $fieldset->field('slug')->label ?></th>
            <td><?= $fieldset->field('slug')->build() ?> <label><input type="checkbox" data-id="same_title" <?= $checked ? 'checked' : '' ?> /> <?= __('Generate from title') ?></label></td>
        </tr>
        <tr>
            <th><?= $fieldset->field('media_folder_id')->label; ?></th>
            <td><?= $fieldset->field('media_folder_id')->build(); ?></td>
        </tr>
    </table>
    <?php
    $content = ob_get_clean();
    ?>
    <?= View::forge('form/layout_standard', array(
        'fieldset' => $fieldset,
        'title' => 'media',
        'save' => 'save',
        'content' => $content,
    ), false) ?>
    <?= $fieldset->close(); ?>
</div>


<script type="text/javascript">
require([
    'jquery-nos',
    'order!jquery-form'
],
function($) {
    // Form UI enhancements are already taken care of by the form/layout_standard view

    $(function() {
        var $container = $('#<?= $uniqid ?>');

        var $file       = $container.find(':file[name=media]');
		var $title      = $container.find('input[name=media_title]');
		var $slug       = $container.find('input[name=slug]');
		var $same_title = $container.find('input[data-id=same_title]');

        var $dialog = $container.closest(':wijmo-wijdialog');
        var closeDialog = function() {
            $dialog && $dialog
                .wijdialog('close')
                .wijdialog('destroy')
                .remove();
        }

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
				$slug.val(seo_compliant($title.val()));
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

        $container.find('form').submit(function(e) {
            $(this).ajaxSubmit({
                dataType: 'json',
                success: function(json) {
                    //Success before close, success use the window reference
                    $.nos.ajax.success(json);
                    if (json.closeDialog) {
                        window.parent.jQuery(':wijmo-wijdialog:last')
                            .wijdialog('close')
                            .wijdialog('destroy')
                            .remove();
                    }
                },
                error: function() {
                    $.nos.notify('An error occured', 'error');
                }
            });
            e.preventDefault();
        });

        $container.find('a[data-id=cancel]').click(function(e) {
            e.preventDefault();
            closeDialog();
        });
    });
});


<?php
include __DIR__.'/seo_compliant.js';
?>
</script>