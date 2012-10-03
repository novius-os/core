<a class="button" style="cursor: pointer;" title="<?= __('Help') ?>" onclick="$(this).nosTabs('open', {url: 'admin/nos/tray/help', app: true, iconSize: 32, labelDisplay: false, iconUrl: 'static/novius-os/admin/novius-os/img/32/help.png', label: <?= htmlentities(\Format::forge(__('Help'))->to_json()) ?>});">
    <img src="static/novius-os/admin/novius-os/img/32/help.png" />
</a>
<div class="menu">
    <?= \Session::user()->user_firstname ?>
</div>
<div class="menu_dropdown">
    <?= \View::forge('admin/tray/right/inside') ?>
</div>
<script type="text/javascript">
    $('body').click(function(e) {
        var visible = false;
        if ($(e.target).closest('.menu_dropdown').length == 0) {
            var $menu = $(e.target).closest('.menu');
            if ($menu.length > 0 && !$menu.hasClass('active')) {
                visible = true;
            }
        }
        if (visible) {
            $('.menu_dropdown').addClass('active');
            $('.menu').addClass('active');
        } else {
            $('.menu_dropdown').removeClass('active');
            $('.menu').removeClass('active');
        }

    });
</script>