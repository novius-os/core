<?php
Nos\I18n::current_dictionary('noviusos_page::common');
?>
<p>
    <label>
        <input type="radio" name="perm[noviusos_page::page][]" value="2_full_access" <?= $role->checkPermissionAtLeast('noviusos_page::page', '2_full_access', 2) ? 'checked' : '' ?> />
        <?= __('Can add, edit, delete and publish pages') ?>
    </label>
</p>

<p>
    <label>
        <input type="radio" name="perm[noviusos_page::page][]" value="1_draft_only" <?= $role->checkPermissionAtLeast('noviusos_page::page', '1_draft_only') ? 'checked' : '' ?> />
        <?= __('Can add, edit and delete unpublished pages only') ?>
    </label>
</p>
