<script type="text/javascript">
    require(
        ['jquery-nos', 'jquery-ui.autocomplete', 'static/novius-os/admin/vendor/tag-it/js/tag-it.js'],
        function($) {
            var $t = $("#<?= $id ?>");
            $t.tagit({
                animate: false,
                caseSensitive: false,
                availableTags: <?= \Format::forge($labels)->to_json() ?>
            });
        });
    function loadCss(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    loadCss('static/novius-os/admin/vendor/tag-it/css/jquery.tagit.css');
</script>
