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

<div class="permissions fill-parent" id="<?= $uniqid = uniqid('id_') ?>" style="overflow:auto;">

<form action="admin/noviusos_user/user/save_permissions" method="POST">

    <input type="hidden" name="role_id" value="<?= $role->role_id ?>" />

    <div class="applications">
        <div class="application all">
            <div class="maincheck">
                <input type="checkbox" name="access_to_everything" value="1" class="access_to_everything" />
            </div>
            <div class="infos">
                <?= __('Full access for everything') ?>
            </div>
        </div>

<?php
foreach ($apps as $app => $perms) {

    \Config::load("$app::permissions", true);
    ?>

    <input type="hidden" name="applications[]" value="<?= $app ?>" />
    <div class="application item">
        <div class="maincheck">
            <input type="checkbox" name="access[<?= $app ?>]" value="1" <?= $role->check_permission($app, 'access') ? 'checked' : '' ?> />
        </div>
        <div class="icon">
    <?php
    if (!empty($apps[$app]['icons'][64])) {
        echo '<img src="'.$apps[$app]['icons'][64].'" />';
    }
    ?>
        </div>
        <div class="infos" title="<?= strtr(__('Application provided by {provider_name}'), array(
                '{provider_name}' => $apps[$app]['provider']['name'],
            )) ?>">
            <?= !empty($apps[$app]['name']) ? $apps[$app]['name'] : $app ?>
        </div>
    </div>

    <div style="margin-left: 30px;">

    </div>
    <?php
}
?>
    </div>

</form>
</div>

<script type="text/javascript">
require(
    ["jquery-nos"],
    function($) {
        $(function() {
            var $form = $('#<?= $uniqid ?>').nosFormUI(),
                $applications = $form.find('.applications'),
                $items = $applications.find("div.item"),
                $checkboxes = $items.find(":checkbox"),
                $access_to_everything = $applications.find(":checkbox.access_to_everything");

            $form.prev().nosFormUI();

            $items.click(function() {
                var $checkbox = $(this).find('div.maincheck :checkbox');
                $checkbox.attr('checked', !$checkbox.is(':checked'));
                $checkbox.change();
                $checkbox.wijcheckbox('refresh');
            });

            $checkboxes.change(function() {
                var all_checked = true;
                $checkboxes.each(function() {
                    if (!$(this).is(':checked')) {
                        all_checked = false;
                    }
                });
                $access_to_everything.attr('checked', all_checked);
                $access_to_everything.wijcheckbox('refresh');
            });
            $checkboxes.eq(0).change();

            $access_to_everything.change(function() {
                var all_checked = true;
                $checkboxes.each(function() {
                    if (!$(this).is(':checked')) {
                        all_checked = false;
                    }
                });

                if (all_checked) {
                    $checkboxes.attr('checked', false);
                } else {
                    $checkboxes.attr('checked', true);
                }
                $checkboxes.wijcheckbox('refresh');
            });

            $form.find('form').nosFormAjax();
        });
    });
</script>
