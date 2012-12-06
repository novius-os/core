<?php

Nos\I18n::current_dictionary('nos::common');

return array(
    // Crud
    'successfully added' => 'Item successfully added.',
    'successfully saved' => 'Item successfully saved.',
    'successfully deleted' => 'The item has successfully been deleted!',

    // General errors
    'item deleted' => 'This item has been deleted.',
    'not found' => 'Item not found',

    // Blank slate
    'error added in context not parent' => 'This item cannot be added {context} because its {parent} is not available in this language yet.',
    'error added in context' => 'This item cannot be added {context}.',
    'add an item in context' => 'Add a new item in {context}',

    // Deletion popup
    'delete an item' => 'Delete an item',
    'you are about to delete, confim' => 'You are about to delete the item <span style=\"font-weight: bold;\">":title"</span>. Are you sure you want to continue?',
    'you are about to delete' => 'You are about to delete the item <span style=\"font-weight: bold;\">":title"</span>.',
    'exists in multiple context' => 'This item exists in <strong>{count} contexts</strong>.',
    'delete in the following contexts' => 'Delete this item in the following contexts:',
    'item has 1 sub-item' => 'This item has <strong>1 sub-item</strong>.',
    'item has multiple sub-items' => 'This item has <strong>{count} sub-items</strong>.',
    'yes delete sub-items' => 'Yes, I want to delete this item and all of its {count} sub-items.',

    'confirm deletion, enter number' => __('To confirm the deletion, you need to enter this number in the field below'),
    'confirm deletion ok' => __('Confirm deletion'),
    'confirm deletion or' => __('or'),
    'confirm deletion cancel' => __('Cancel'),
    'confirm deletion wrong_confirmation' => __('Wrong confirmation'),

    // Appdesk: allLanguages
    'allLanguages' =>__('All'),
    'viewGrid' => __('Grid'),
    'viewTreeGrid' => __('Tree grid'),
    'viewThumbnails' => __('Thumbnails'),
    'preview' => __('Preview'),
    'loading' => _('Loading...'),
    'languages' => __('Languages'),
    'search' => __('Search'),
);