<table class="fieldset">
    <?php
    foreach ($fields as $field_name) {
        $field = $fieldset->field($field_name);
        if (!empty($field)) {
            if (isset($callback)) {
                $callback($field);
            } else {
                echo $field->build();
            }
        }
    }
    ?>
</table>