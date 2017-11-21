<?php

\Nos\I18n::current_dictionary('noviusos_menu::common', 'nos::common');

$id = $uniqid = uniqid('form_');

?>
<form class="fieldset standalone" id="<?= $id ?>">
    <p>
        <strong>
            <?= __('Duplication target :') ?>
        </strong>
    </p>
    <?php foreach ($contexts_list as $context): ?>
        <label>
            <?php
            $site = \Nos\Tools_Context::site($context);
            ?>
            <input type="radio" name="duplicate_context"
                   value="<?= $context ?>" <?= $item->getContext() === $context ? 'checked' : '' ?> />
            <?= \Nos\Tools_Context::contextLabel($context, array('short' => false, )) ?>
        </label>
        <br/>
    <?php endforeach; ?>
    <p style="margin: 1em 0;">
        <button type="submit" class="ui-priority-primary ui-state-default">
            <?= __('Duplicate') ?>
        </button>
        <span>
            <?= __('or') ?>
        </span>
        <a href="#">
            <?= __('Cancel') ?>
        </a>
    </p>
</form>
<script type="text/javascript">
    require(['jquery-nos'],
        function ($) {
            $(function () {
                var $form = $('#<?= $id ?>'),
                    $confirmButton = $form.find(':submit'),
                    $cancelButton = $form.find('a:last');

                $form.nosFormUI();

                $confirmButton.click(function (e) {
                    e.preventDefault();
                    if ($(this).hasClass('ui-state-disabled')) {
                        return;
                    }
                    $form.nosAjax({
                        url: <?= \Format::forge($action)->to_json() ?>,
                        method: 'POST',
                        data: $form.serialize()
                    });
                    $form.nosDialog('close');
                });

                $cancelButton.click(function (e) {
                    e.preventDefault();
                    $form.nosDialog('close');
                });
            });
        });
</script>
