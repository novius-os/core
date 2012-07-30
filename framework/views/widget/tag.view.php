<script type="text/javascript">
    require(
        [
            'link!static/novius-os/admin/vendor/tag-it/css/jquery.tagit.css',
            'jquery-nos',
            'jquery-ui.autocomplete',
            'static/novius-os/admin/vendor/tag-it/js/tag-it.js'
        ],
        function($) {
            var $t = $("#<?= $id ?>");
            $t.tagit({
                animate: false,
                caseSensitive: false,
                availableTags: <?= \Format::forge($labels)->to_json() ?>
            });
        });
</script>
