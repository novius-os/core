<ul class="nobullet" style="list-style-type: none;">
<?php
foreach (\Nos\Config_Data::get('app_installed') as $app_name => $app) {
    $icon = Config::icon($app_name, 16);
    ?>
    <li class="ui-corner-all" style="border:1px solid transparent;">
        <label style="display:block;">
            <input type="checkbox" name="<?= $checkbox_name ?>" value="<?= $app_name ?>" <?= $check_permission($permission_name, $app_name) ? 'checked' : '' ?> />
            &nbsp; <?= empty($icon) ? '' : '<img src="'.$icon.'" />' ?> <?= $app['name'] ?>
        </label>
    </li>
    <?php
}
?>
<ul>
