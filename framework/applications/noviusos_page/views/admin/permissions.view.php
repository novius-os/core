<?php
Nos\I18n::current_dictionary('noviusos_page::common');
?>
<p>
    <label>
        <input type="radio" name="perm[noviusos_page::page][]" value="2_full_access" <?= (int) $role->getPermissionValue('noviusos_page::page', 2) == 2 ? 'checked' : '' ?> />
        <?= __('Can add, edit, delete and publish pages') ?>
    </label>
</p>

<p>
    <label>
        <input type="radio" name="perm[noviusos_page::page][]" value="1_draft_only" <?= (int) $role->getPermissionValue('noviusos_page::page') == 1 ? 'checked' : '' ?> />
        <?= __('Can add, edit and delete unpublished pages only') ?>
    </label>
</p>
