<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary('noviusos_user::common');

$role = reset($user->roles);

?>

<div class="permissions fill-parent" id="<?= $uniqid = uniqid('id_') ?>" style="overflow:auto;">

<form action="admin/noviusos_user/user/save_permissions" method="POST">

    <input type="hidden" name="role_id" value="<?= $role->role_id ?>" />

    <div class="applications">
        <div class="application all">
            <div class="maincheck">
                <input type="checkbox" name="perm[nos::access][_full]" value="1" class="access_to_everything" <?= ($role->check_permission('nos::access', '_full') ? 'checked' : '') ?> />
            </div>
            <div class="infos">
                <?= __('Full access to everything') ?>
            </div>
        </div>

        <?php
        $permissions = \Config::load('noviusos_user::permissions', true);

        $category_sections = array();
        foreach ($permissions['categories'] as $section => $callback) {
            $category_sections[$section] = $callback();
        }

        foreach ($permissions['permissions']['categories'] as $section => $list) {
            $category_section = $category_sections[$section];
            foreach ($list as $permission_name => $perm) {
                echo '<h2>'.htmlspecialchars($perm['title']).'</h2>';
                echo '<ul>';
                foreach ($category_section as $category_key => $categories) {
                    echo '<li>
                        <label><input type="checkbox" name="perm['.$permission_name.']['.$category_key.']" value="1" '.($role->check_permission($permission_name, $category_key) ? 'checked' : '').' /> <img src="'.$categories['icon'].'" /> '.$categories['title'].'</label>
                    </li>';
                }
                echo '<ul>';
            }
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
