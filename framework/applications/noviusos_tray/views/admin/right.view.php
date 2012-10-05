<div class="menu">
    <?= \Session::user()->user_firstname ?>
</div>
<div class="menu_dropdown">
    <?= \View::forge('noviusos_tray::admin/right/inside') ?>
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