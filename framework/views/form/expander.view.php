<div class="expander fieldset" style="margin-bottom:1.5em;" <?= !empty($options) ? 'data-wijexpander-options="'.htmlspecialchars(Format::forge()->to_json($options)).'"' : '' ?>>
	<h3><?= $title ?></h3>
	<div style="overflow:visible;<?= !empty($nomargin) ? 'margin:0;padding:0;' : '' ?>">
<?php
    if (is_array($content) && !empty($content['view'])) {
        echo View::forge($content['view'], array('fieldset' => $fieldset, 'object' => $object) + $content['params'], false);
    } else {
        echo is_callable($content) ? $content() : $content;
    }
?>
	</div>
</div>