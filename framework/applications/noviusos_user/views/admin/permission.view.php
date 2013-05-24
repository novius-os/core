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

// Role is filled when accessing from the user. The generic 'item
empty($role) && $role = $item;
?>

<!--<input type="hidden" name="role_id" value="<?= $role->role_id ?>" />-->

<div class="line" id="<?= $uniqid = uniqid('id_') ?>">
    <div class="col c6 native_permissions">
<?php

$my_view_params = array(
    'role' => $role,
);
$my_view_params['view_params'] =& $my_view_params;
$permissions = \Config::load('nos::permissions', true);

foreach ($permissions as $view) {
    echo \View::forge(
        $view['view'],
        (!empty($view['params']) ? $view['params'] : array()) + $my_view_params,
        false
    );
}
?>

    </div>
    <div class="col c6 app_permissions">
<?php
foreach (\Nos\Config_Data::get('app_installed') as $app_name => $app) {
    $permissions = \Config::load($app_name.'::permissions', true);
    if (empty($permissions)) {
        continue;
    }
    echo '<div class="'.$app_name.'" style="display:none;">';
    echo '<img class="preview_arrow" src="static/apps/noviusos_user/img/arrow-edition.png">';

    foreach ($permissions as $view) {
        echo \View::forge(
            $view['view'],
            (!empty($view['params']) ? $view['params'] : array()) + $my_view_params,
            false
        );
    }
    echo '</div>';
}
?>
    </div>
</div>

<script type="text/javascript">
require(
    ['jquery-nos'],
    function($) {
        $(function() {
            var $form = $('#<?= $uniqid ?>');
            var $ul = $form.find('div[class~="nos::access"]');
            var preventCheckAction = false;

            $form.find('.check_all').on('change', function onChangeCheckAll(e) {
                e.stopPropagation();
                preventCheckAction = true;
                var checked = $(this).is(':checked');
                $ul.find(':checkbox').prop('checked', checked);
                preventCheckAction = false;

                if (!checked) {
                    $ul.find('li.ui-state-active :checkbox').trigger('change');
                }
            });

            // Augment hit area
            $ul.find('.checkbox_hit_area').on('click', function(e) {
                var $checkbox = $(this).find(':checkbox');
                var checked = $checkbox.is(':checked');

                if (checked) {
                    e.stopPropagation();
                    $checkbox.prop('checked', false).trigger('change');
                }
            });

            // Allow selecting applications by clicking on the list item rather than the checkbox
            $ul.find('li').on('click', function onClickCheckboxAccess(e) {
                if (!$(this).hasClass('ui-state-active')) {
                    e.preventDefault();
                    var $checkbox = $(this).find(':checkbox');
                    if ($checkbox.is(':checked')) {
                        // Already checked
                        $checkbox.trigger('change');
                    } else {
                        // Not checked yet
                        $checkbox.trigger('click');
                    }
                }
            });

            // When a checkbox is checked or unchecked, select the application
            $ul.find(':checkbox').on('change', function onChangeCheckboxAccess() {
                if (preventCheckAction) {
                    return;
                }
                var $this = $(this);
                var $li = $this.closest('li');
                var $accordion = $form.find('div.' + $this.val());

                if ($this.is(':checked')) {
                    $li.addClass('ui-state-active').siblings().removeClass('ui-state-active');
                    $form.find('.preview_arrow').parent().hide();
                    $accordion.show().nosOnShow()
                        .css('marginTop', $li.offset().top - $this.closest('.line').offset().top);
                } else {
                    $li.removeClass('ui-state-active');
                    $accordion.hide();
                }
            });
        });
    });

</script>
