<?php
Nos\I18n::current_dictionary('nos::common');
?><p class="check_all">
    <label><input type="checkbox" class="check_all" /> <?= __('Check all') ?></label>
</p>
<ul class="applications">
<?php

\Nos\Application::cleanApplications();
$applications = \Nos\Application::search_all(false);


$app_installed = array();
$app_others = array();

foreach ($applications as $app) {
    if ($app->is_installed()) {
        $app_installed[$app->folder] = $app;
    }
}

foreach ($app_installed as $app) {
    if (!isset($app->metadata['permission'])) {
        continue;
    }
    ?>
    <li class="application ui-corner-all ui-widget-content">
        <div class="checkbox_hit_area ui-corner-tl ui-corner-bl">
            <input type="checkbox" name="<?= $checkbox_name ?>" value="<?= $app->folder ?>" <?= $role->checkPermission($permission_name, $app->folder) ? 'checked' : '' ?> />
        </div>
        <img class="app_icon" src="<?= Config::icon($app->folder, 32) ?: 'static/novius-os/admin/novius-os/img/32/application.png' ?>"  />
        &nbsp; <?= e($app->get_name_translated()); ?>
    </li>
    <?php
}
?>
</ul>
