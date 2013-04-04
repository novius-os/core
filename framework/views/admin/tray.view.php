<div id="tray-username" class="menu">
    <?= \Session::user()->user_firstname ?> &nbsp;▾
</div>
<ul id="tray-username-menu" style="display: none;">
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
                                if (action) {
                                    e.preventDefault();
                                    $a.nosAction(action);
                                }
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
                            },
                            animation: {
                                animated:"slide",
                                option: {
                                    direction: "up"
                                },
                                duration: 200,
                                easing: null
                            },
                            hideAnimation: {
                                animated:"slide",
                                option: {
                                    direction: "up"
                                },
                                duration: 200,
                                easing: null
                            }
                        });
                });
            });
</script>
