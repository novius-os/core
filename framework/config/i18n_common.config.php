<?php

Nos\I18n::current_dictionary('nos::common');

return array(
    // Crud
    'successfully added' => __('Done! The item has been added.'),
    'successfully saved' => __('OK, all changes are saved.'),
    'successfully deleted' => __('The item has been deleted.'),

    // General errors
    'item deleted' => __('This item doesn’t exist any more. It has been deleted.'),
    'not found' => __('We cannot find this item.'),

    // Blank slate
    'error added in context not parent' => __('We’re afraid this item cannot be added in {{context}} because its <a>parent</a> is not available in this context yet.'), #wtf two strings needed here (this context / this language)
    'error added in context' => __('This item cannot be added in {{context}}. (How come you get this error message? You’ve hacked your way into here, haven’t you?)'),

    // Deletion popup
    'delete an item' => __('Deleting the item {{title}}'),
    'you are about to delete, confim' => __('Last chance, there’s no undo. Do you really want to delete this item?'),
    'you are about to delete' => __('You are about to delete the item <span style=\"font-weight: bold;\">":title"</span>.'), #to be deleted
    'exists in multiple context' => __('This item exists in <strong>{{count}} contexts</strong>.'),
    'delete in the following contexts' => __('Delete this item in the following contexts:'), #to be deleted
    'item has 1 sub-item' => __('This item has <strong>1 sub-item</strong>.'),
    'item has multiple sub-items' => __('This item has <strong>{{count}} sub-items</strong>.'),
    'yes delete sub-items' => __('Yes, I want to delete this item and all of its {{count}} sub-items.'),

    'confirm deletion, enter number' => __('To confirm the deletion, you need to enter this number in the field below:'),
    'confirm deletion ok' => __('Confirm deletion'),
    'confirm deletion or' => __('or'),
    'confirm deletion cancel' => __('Cancel'),
    'confirm deletion wrong_confirmation' => __('We cannot delete this item as the number of sub-items you’ve entered is wrong. Please amend it.'),

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