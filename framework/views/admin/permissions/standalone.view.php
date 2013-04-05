<?php
foreach ($list as $permission_name => $permission) {
    if (isset($permission['permission_name'])) {
        $permission_name = $permission['permission_name'];
    }
    list($app_name, ) = explode('::', $permission_name);
    $value = isset($permission['category_key']) ? $permission['category_key'] : '1';
    $checked = $role->checkPermission($permission_name) || (!empty($permission['checked']) && !$role->checkPermission('nos::access', $app_name));
    ?>
    <p><label>
        <input type="checkbox" name="perm[<?= $permission_name ?>][]" value="<?= $value ?>" <?= $checked ? 'checked' : '' ?> />
        &nbsp; <?= $permission['label'] ?>
    </label></p>
    <?php
}
