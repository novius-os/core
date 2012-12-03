<div id="tray-username" class="menu">
    <?= \Session::user()->user_firstname ?>
</div>
<ul id="tray-username-menu">
    <?= \View::forge('noviusos_tray::admin/right/inside') ?>
</ul>
<script type="text/javascript">
    require(
            ['jquery-nos'],
            function($) {
                $(function() {
                    $("#tray-username-menu").appendTo('body').wijmenu({
                        trigger: "#tray-username",
                        triggerEvent: "click",
                        orientation: "vertical",
                        position: {
                            offset: '-5 -10',
                            my: "right top",
                            at: "right bottom"
                        }
                    });
                });
            });
</script>
