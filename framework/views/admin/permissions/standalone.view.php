<?php
foreach ($list as $permission_name => $permission) {
    list($app_name, ) = explode('::', $permission_name);
    ?>
    <p><label>
        <input type="checkbox" name="perm[<?= $permission_name ?>][]" value="1" <?= $check_permission($permission_name) || (!empty($permission['checked']) && !$check_permission('nos::access', $app_name)) ? 'checked' : '' ?> />
        &nbsp; <?= $permission['label'] ?>
    </label></p>
<?php
}
