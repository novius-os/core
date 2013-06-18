<?php
Nos\I18n::current_dictionary('nos::common');
?><p class="check_all">
    <label><input type="checkbox" class="check_all" /> <?= __('Check all') ?></label>
</p>
<ul class="applications">
<?php
foreach (\Nos\Config_Data::get('app_installed') as $app_name => $app) {
    if (!isset($app['permission'])) {
        continue;
    }
    $icon = Config::icon($app_name, 32);
    ?>
    <li class="application ui-corner-all ui-widget-content">
        <div class="checkbox_hit_area ui-corner-tl ui-corner-bl">
            <input type="checkbox" name="<?= $checkbox_name ?>" value="<?= $app_name ?>" <?= $role->checkPermission($permission_name, $app_name) ? 'checked' : '' ?> />
        </div>
        <?= empty($icon) ? '' : '<img class="app_icon" src="'.$icon.'"  />' ?> &nbsp; <?= $app['name'] ?>
    </li>
    <?php
}
?>
<ul>
