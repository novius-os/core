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

<div class="line fieldset" id="<?= $uniqid = uniqid('id_') ?>">
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
    ['jquery-nos', 'jquery-nos-permissions'],
    function($, uiPermissions) {
        $(function() {
            uiPermissions($('#<?= $uniqid ?>'));
        });
    });
</script>
