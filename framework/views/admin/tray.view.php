<div id="tray-username" class="menu">
    <?= \Session::user()->user_firstname ?>
</div>
<ul id="tray-username-menu">
    <?= \View::forge('nos::admin/tray/inside') ?>
</ul>
<script type="text/javascript">
    require(
            ['jquery-nos'],
            function($) {
                $(function() {
                    $("#tray-username-menu")
                        .find('a')
                        .each(function() {
                            var $a = $(this),
                                action = $a.data('action');
                            $a.click(function(e) {
                                e.preventDefault();
                                $a.nosAction(action);
                            });
                        })
                        .end()
                        .appendTo('body')
                        .wijmenu({
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
