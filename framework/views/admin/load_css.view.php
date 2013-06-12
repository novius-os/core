<?php
if (!is_array($css_files)) {
    $css_files = array($css_files);
}
foreach ($css_files as &$css_file) {
    $css_file = 'link!'.$css_file;
}
?>
<script type="text/javascript">
    require(<?= json_encode($css_files) ?>);
</script>