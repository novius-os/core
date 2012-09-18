<a class="button" style="cursor: pointer;" title="<?= __('Help') ?>" onclick="$(this).nosTabs('open', {url: 'admin/nos/tray/help', app: true, iconSize: 32, labelDisplay: false, iconUrl: 'static/novius-os/admin/novius-os/img/32/help.png'});">
    <img src="static/novius-os/admin/novius-os/img/32/help.png" />
</a>
<ul id="menu" style="display: inline-block;">
    <li><a><?= \Session::user()->user_firstname ?></a>
        <ul>
            <li><a onclick="$(this).nosTabs('open', {url: 'admin/nos/tray/account', app: true, iconSize: 32, labelDisplay: false, iconUrl: 'static/novius-os/admin/novius-os/img/32/myaccount.png'});"><?= __('My account') ?></a></li>
            <li><a onclick="document.location = 'admin/nos/tray/account/disconnect';"><?= __('Log out') ?></a></li>
        </ul>
    </li>
</ul>