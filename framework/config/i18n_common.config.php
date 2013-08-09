<?php

Nos\I18n::current_dictionary('nos::common');

return array(
    // Crud
    // Note to translator: Default copy meant to be overwritten by applications (e.g. The item has been deleted > The page has been deleted). The word 'item' is not to feature in Novius OS.
    'notification item added' => __('Done! The item has been added.'),
    'notification item saved' => __('OK, all changes are saved.'),
    'notification item deleted' => __('The item has been deleted.'),

    // General errors
    'notification item does not exist anymore' => __('This item doesn’t exist any more. It has been deleted.'),
    'notification item not found' => __('We cannot find this item.'),
    'deleted popup title' => __('Bye bye'),
    'deleted popup close' => __('Close tab'),
    'action not allowed' => __('You’re not allowed to carry out this action. Ask your colleagues to find out why.'),

    // Deletion popup
    'deleting item title' => __('Deleting the item ‘{{title}}’'),
    'deleting confirmation' => __('Last chance, there’s no undo. Are you sure you want to do this?'),

    # Delete action's labels
    'deleting confirmation button' => __('{{Button}} or <a>No, cancel</a>'),
    'deleting confirmation item' => __('Yes, delete'),
    'deleting button 0 items' => __('Nothing to delete'),
    'deleting button 1 item' => __('Yes, delete this item'),
    'deleting button N items' => __('Yes, delete these {{count}} items'),

    'deleting confirmation number' => __('To confirm the deletion, you need to enter this number in the field below:'),
    'deleting wrong confirmation' => __('We cannot delete this item as the number of sub-items you’ve entered is wrong. Please amend it.'),

    '1 item' => __('1 item'),
    'N items' => __('{{count}} items'),

    # Keep only if the model has the behaviour Contextable
    'deleting with N contexts' => __('This item exists in <strong>{{context_count}} contexts</strong>.'),
    'deleting with N languages' => __('This item exists in <strong>{{language_count}} languages</strong>.'),

    # Keep only if the model has the behaviours Contextable + Tree
    'deleting with N contexts and N children' => __('This item exists in <strong>{{context_count}} contexts</strong> and has <strong>{{children_count}} sub-items</strong>.'),
    'deleting with N contexts and 1 child' => __('This item exists in <strong>{{context_count}} contexts</strong> and has <strong>one sub-item</strong>.'),
    'deleting with N languages and N children' => __('This item exists in <strong>{{language_count}} languages</strong> and has <strong>{{children_count}} sub-items</strong>.'),
    'deleting with N languages and 1 child' => __('This item exists in <strong>{{language_count}} languages</strong> and has <strong>one sub-item</strong>.'),

    # Keep only if the model has the behaviour Twinnable
    'translate error parent not available in context' => __('We’re afraid this item cannot be added to {{context}} because its <a>parent</a> is not available in this context yet.'),
    'translate error parent not available in language' => __('We’re afraid this item cannot be translated into {{language}} because its <a>parent</a> is not available in this language yet.'),
    'translate error impossible context' => __('This item cannot be added in {{context}}. (How come you get this error message? You’ve hacked your way into here, haven’t you?)'),

    # Keep only if the model has the behaviour Tree
    'deleting with 1 child' => __('This item has <strong>1 sub-item</strong>.'),
    'deleting with N children' => __('This item has <strong>{{children_count}} sub-items</strong>.'),

    // Visualise action's labels
    'visualising no url' => __('This application hasn’t yet been added to a page. Visualising is therefore impossible.'),

    // Appdesk: allLanguages
    'allLanguages' =>__('All languages'),
    'allSites' =>__('All sites'),
    'allContexts' =>__('All contexts'),
    'viewGrid' => __('List'),
    'viewTreeGrid' => __('Tree'),
    'viewThumbnails' => __('Thumbnails'),
    'preview' => __('Preview'),
    'loading' => __('Loading...'),
    'languages' => __('Languages'),
    'search' => __('Search'),
    'selectSites' => __('Select the site(s) to show'),
    'selectLanguages' => __('Select the language(s) to show'),
    'selectContexts' => __('Select the context(s) to show'),
    'workInContext' => __('Show {{context}}'),
    'otherSites' => __('Other sites'),
    'otherLanguages' => __('Other languages'),
    'otherContexts' => __('Other contexts'),
    'contexts' => __('Contexts'),
    'sites' => __('Sites'),
    'languages' => __('Languages'),

);
