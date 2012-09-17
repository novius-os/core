<?= render('admin/tray/right/standard_description') ?>

<?php

?>

<a class="button" onclick="$(this).nosTabs('open', {url: 'admin/nos/tray/help'});">
    <button data-icon="help">
        <?= __('Help') ?>
    </button>
</a>

<a class="button" onclick="$(this).nosTabs('open', {url: 'admin/nos/tray/appmanager'});">
    <button data-icon="cart">
        <?= __('Application manager') ?>
    </button>
</a>

<a class="button" onclick="$(this).nosTabs('open', {url: 'admin/nos/tray/account'});">
    <button data-icon="person">
        <?= __('Account') ?>
    </button>
</a>

<a class="button" onclick="$(this).nosTabs('open', {url: 'admin/nos/tray/account/disconnect'});">
    <button data-icon="power">
        <?= __('Disconnect') ?>
    </button>
</a>
<?php

?>

<?php
/*
?>
<ul id="menu" style="display: inline-block;">
    <li><a><?= __('Applications') ?></a>
        <ul>
            <li><a onclick="$(this).nosTabs('open', {url: 'admin/nos/tray/appmanager'});"><?= __('Applications manager') ?></a></li>
            <li><a>Application 1</a></li>
            <li><a>Application 2</a></li>
        </ul>
    </li>
    <li><a onclick="$(this).nosTabs('open', {url: 'admin/nos/tray/account'});"><?= __('Account') ?></a></li>
    <li><a onclick="$(this).nosTabs('open', {url: 'admin/nos/tray/help'});"><?= __('Help') ?></a></li>
    <li><a onclick="$(this).nosTabs('open', {url: 'admin/nos/tray/account/disconnect'});"><?= __('Disconnect') ?></a></li>
</ul>
<script type="text/javascript">
    require(
        ['jquery-nos', 'wijmo.wijmenu'],
        function( $ ) {
            $(function() {
                $("#menu").wijmenu();
            });
        });
</script>
<?php
*/
?>