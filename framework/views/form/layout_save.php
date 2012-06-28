<?php
if ($save_field) {
    echo $save_field->set_template('{field}')->build();
} else {
    throw new \Exception('The save field is not present or incorrectly configured.');
}
?>
&nbsp; <?= __('or') ?> &nbsp; <a href="#" onclick="javascript:$(this).nos().tab('close');return false;"><?= __('Cancel') ?></a>