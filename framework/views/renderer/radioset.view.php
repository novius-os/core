<?php
if (!isset($class)) {
    $class = '';
}
$class = 'buttonset '.$class;
?>
<div id="<?= $buttonset_id = uniqid($name.'_') ?>" class="<?= $class ?>">
<?php
foreach ($choices as $key => $choice) {
    if (is_string($choice)) {
        $choice = array(
            'label' => $choice
        );
    }

    $choice = \Arr::merge(
        array(
            'checked' => $value === $key,
            'side_label' => '',
        ),
        $choice
    );
    echo '<input type="radio" id="'.($uniqid = uniqid($name.'_choice_')).'" name="'.htmlspecialchars($name).'" class="notransform" value="'.htmlspecialchars($key).'" '.($choice['checked'] ? 'checked' : '').' data-side_label="'.htmlspecialchars($choice['side_label']).'"><label for="'.$uniqid.'">'.$choice['label'].'</label>';
}
?>
    <span class="buttonset_side_label" id="<?= $buttonset_side_label_id = uniqid($name.'_side_label_') ?>"></span>
</div>
<script type="text/javascript">
    require(
        [
            'jquery',
            'jquery-ui.core',
            'jquery-ui.button'
        ],
        function($) {
            $(function() {
                var $buttonset = $('#<?= $buttonset_id ?>');
                var $buttonsetSideLabel = $('#<?= $buttonset_side_label_id ?>');
                var $choices = $buttonset.find('input');
                var $checked = $choices.filter(':checked');

                function updateSideLabel($el) {
                    $buttonsetSideLabel.text($el.data('side_label'));
                }

                $choices.change(function() {
                    updateSideLabel($(this));
                });

                if ($checked.length > 0) {
                    updateSideLabel($checked);
                }

                $buttonset.buttonset();
            });
        });
</script>
