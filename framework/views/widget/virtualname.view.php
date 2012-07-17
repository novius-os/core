<script type="text/javascript">
    require(
        ['jquery-nos'],
        function($) {
            var $t = $("#<?= $id ?>");
            var $title_input = $t.closest('form').find('input.title');
            if ($title_input.length > 0) {
                var refreshTitle = function() {
                    if ($t.data('usetitle')) {
                        $t.val(urlify($title_input.val()));
                    }
                };
                $title_input.keyup(refreshTitle);
                $t.change(refreshTitle);

                var refreshUseTitle = function() {
                    $t.data('usetitle', $t.val().length == 0);
                };
                $t.click(refreshUseTitle).keyup(refreshUseTitle);
            }
            function urlify(str) {
                return str.replace(/_/g, '-')
                    .replace(/ /g, '-')
                    .replace(/:/g, '-')
                    .replace(/\\/g, '-')
                    .replace(/\//g, '-')
                    .replace(/[^a-zA-Z0-9\-]+/g, '')
                    .replace(/-{2,}/g, '-')
                    .toLowerCase();
            };
        });
</script>
