<?php

Nos\I18n::current_dictionary('nos::common');

return array(
    // Crud
    'successfully added' => 'Done! The item has been added.',
    'successfully saved' => 'OK, all changes are saved.',
    'successfully deleted' => 'The item has been deleted.',

    // General errors
    'item deleted' => 'This item doesn’t exist any more. It has been deleted.',
    'not found' => 'We cannot find this item.',

    // Blank slate
    'error added in context not parent' => 'We’re afraid this item cannot be added in {{context}} because its <a>parent</a> is not available in this context yet.', #wtf two strings needed here (this context / this language) #new var
    'error added in context' => 'This item cannot be added {{context}}.', #wtf what's this string for? #new var
    'add an item in context' => 'Add a new item in {{context}}', #new var

    // Deletion popup
    'delete an item' => 'Deleting the item {{title}}', #new var
    'you are about to delete, confim' => 'Last chance, there’s no undo. Do you really want to delete this item?',
    'you are about to delete' => 'You are about to delete the item <span style=\"font-weight: bold;\">":title"</span>.', #to be deleted
    'exists in multiple context' => 'This item exists in <strong>{{count}} contexts</strong>.', #new var
    'delete in the following contexts' => 'Delete this item in the following contexts:', #to be deleted
    'item has 1 sub-item' => 'This item has <strong>1 sub-item</strong>.',
    'item has multiple sub-items' => 'This item has <strong>{{count}} sub-items</strong>.', #new var
    'yes delete sub-items' => 'Yes, I want to delete this item and all of its {count} sub-items.',

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