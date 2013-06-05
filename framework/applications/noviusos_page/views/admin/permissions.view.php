<?php
Nos\I18n::current_dictionary('noviusos_page::common');
?>
<p>
    <label>
        <input type="radio" name="perm[noviusos_page::access][]" value="all" <?= $role->checkPermissionOrEmpty('noviusos_page::access', 'all') ? 'checked' : '' ?> />
        <?= __('Can add, edit, delete and publish pages') ?>
    </label>
</p>

<p>
    <label>
        <input type="radio" name="perm[noviusos_page::access][]" value="draft" <?= $role->checkPermission('noviusos_page::access', 'draft') ? 'checked' : '' ?> />
        <?= __('Can add, edit and delete unpublished pages only') ?>
    </label>
</p>
