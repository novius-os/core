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
            <label>
            <div class="maincheck">
                <input type="checkbox" name="perm[nos::access][_full]" value="1" class="access_to_everything" <?= ($role->check_permission('nos::access', '_full') ? 'checked' : '') ?> />
            </div>
            <div class="infos">
                <?= __('Access to all applications') ?>
            </div>
            </label>
        </div>

        <div class="line">
            <div class="col c7">
            <?php
            $permissions = \Config::load('nos::permissions', true);

            $category_sections = array();
            foreach ($permissions['categories'] as $section => $callback) {
                $category_sections[$section] = is_callable($callback) ? call_user_func($callback) : array();
            }

            foreach ($permissions['permissions']['categories'] as $section => $list) {
                $category_section = $category_sections[$section];
                foreach ($list as $permission_name => $perm) {
                    echo '<div class="permission '.$permission_name.'" style="margin-top: 1em;">';
                    echo '<h2>'.htmlspecialchars($perm['title']).'</h2>';
                    echo \View::forge($perm['view'], array(
                        'permission_name' => $permission_name,
                        'checkbox_name' => 'perm['.$permission_name.'][]',
                        'categories' => $category_section,
                        'check_permission' => function($perm_name, $cat_key) use ($role) {
                            return $role->check_permission($perm_name, $cat_key);
                        }
                    ));
                    echo '</div>';
                }
            }
            ?>

            </div>
            <div class="col c5">
                <?php
                foreach (\Nos\Config_Data::get('app_installed') as $app_name => $app) {
                    $permissions = \Config::load($app_name.'::permissions', true);
                    echo '<div class="accordion '.$app_name.'" style="display:none;">';

                    if (!empty($permissions['permissions']['standalone'])) {
                        ?>
                        <h3><img src="<?= Config::icon($app_name, 16) ?>" /> <?= $app['name'] ?></h3>
                        <div>
                            <?php
                            foreach ($permissions['permissions']['standalone'] as $permission_name => $permission) {
                                ?>
                                <label>
                                    <input type="checkbox" name="perm[<?= $permission_name ?>][]" value="1" <?= $role->check_permission($permission_name) ? 'checked' : '' ?> />
                                    &nbsp; <?= $permission['title'] ?>
                                </label>
                                <?php
                            }
                            ?>
                        </div>
                        <?php
                    }

                    if (!empty($permissions['permissions']['categories'])) {
                        $category_sections = array();
                        foreach ($permissions['categories'] as $section => $callback) {
                            $category_sections[$section] = is_callable($callback) ? call_user_func($callback) : array();
                        }
                        foreach ($permissions['permissions']['categories'] as $section => $list) {
                            $category_section = $category_sections[$section];
                            foreach ($list as $permission_name => $perm) {
                                echo '<h3>'.htmlspecialchars($perm['title']).'</h3>';
                                echo '<div>';
                                echo \View::forge($perm['view'], array(
                                    'permission_name' => $permission_name,
                                    'checkbox_name' => 'perm['.$permission_name.'][]',
                                    'categories' => $category_section,
                                    'check_permission' => function($perm_name, $cat_key) use ($role) {
                                        return $role->check_permission($perm_name, $cat_key);
                                    }
                                ));
                                echo '</div>';
                            }
                        }
                    }
                    ?>
                    </div>
                    <?php
                }
                ?>
            </div>
        </div>
    </div>

</form>
</div>

<script type="text/javascript">
require(
    ['jquery-nos'],
    function($) {
        $(function() {
            var $form = $('#<?= $uniqid ?>').nosFormUI(),
                $applications = $form.find('.applications'),
                $items = $applications.find("div.item"),
                $checkboxes = $items.find(":checkbox"),
                $access_to_everything = $applications.find(":checkbox.access_to_everything");

            var $ul = $form.find('div[class~="nos::access"]')
            $ul.find('.wijmo-checkbox').css('display', 'block');
            $ul.find('li').on('click', function(e) {
                if (!$(this).hasClass('ui-state-active') && $(this).find(':checkbox').is(':checked')) {
                    log(e.target);

                    e.stopPropagation();
                    e.preventDefault();
                    $(this).find(':checkbox').trigger('change');
                }
            });
            $ul.find(':checkbox').on('change', function() {
                var $this = $(this);
                var $li = $this.closest('li');
                var $accordion = $form.find('div.' + $this.val());

                if ($this.is(':checked')) {
                    $li.addClass('ui-state-active').siblings().removeClass('ui-state-active');
                    $accordion.show().nosOnShow()
                        .siblings().hide()
                        .end().css('marginTop', $li.offset().top - $this.closest('.line').offset().top);
                } else {
                    $li.removeClass('ui-state-active');
                    $accordion.hide();
                }
            });

            $form.nosFormAjax();


        });
    });

</script>
