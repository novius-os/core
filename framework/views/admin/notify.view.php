<?php
if (is_string($notify)) {
    $notify = array(
        'message' => $notify,
    );
}
?>
<script type="text/javascript">
    var notify = <?= json_encode($notify) ?>;
    $.nosNotify(notify.message, notify.type);
</script>