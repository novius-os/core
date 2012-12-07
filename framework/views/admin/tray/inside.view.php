<li><a href="#" data-action='{"action":"nosTabs","method":"open","tab":{"url":"admin/noviusos_user/account","app":true,"iconSize":32,"labelDisplay":false,"iconUrl":"static/apps/noviusos_user/img/32/myaccount.png","label":<?= htmlentities(\Format::forge(__('My account'))->to_json()) ?>}}'><?= __('My account') ?></a></li>
<li><a href="#"><?= __('Switch language') ?></a>
    <ul>
<?php
foreach (array('en_GB' => 'English', 'fr_FR' => 'Français') as $code => $label) {
    ?>
    <li><a href="#" data-action='{"action":"nosAjax","params":{"url":"admin/noviusos_user/account/lang/<?= $code ?>"}}'><?= $label ?></a></li>
    <?php
}
?>
    </ul>
</li>
<li><a href="#" data-action='{"action":"document.location","url":"admin/noviusos_user/account/disconnect"}'><?= __('Log out') ?></a></li>
<li><a href="#" data-action='{"action":"nosDialog","dialog":{"contentUrl":"admin/nos/about","ajax":true,"width":620,"height":370,"title":<?= htmlentities(\Format::forge(__('About Novius OS'))->to_json()) ?>}}'><?= __('About Novius OS') ?></a></li>