/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define(
    [
        'jquery-nos',
        'jquery-ui.nestedSortable'
    ],
    function ($) {
        "use strict";

        var dotToArray = function(array, value) {
            var key = array.shift();
            var nested = {};
            nested[key] = array.length ? dotToArray(array, value) : value;
            return nested;
        };

        $.fn.extend({
            nosAppMenuLayout: function (params) {
                params = params || {
                    maxLevels: null,
                    texts: {
                        editItem: 'Edit an item'
                    }
                };
                return this.each(function () {
                    var $container = $(this);
                    var $dispatcher = $container.closest('.nos-dispatcher, body');
                    var $menu_id = $container.find('input[name=menu_id]');
                    var $renderer = $container.find('.renderer > ol');
                    var $add_buttons = $container.find('.add-buttons');

                    var init_item = function($item) {
                            // Add the button wrapper
                            if (!$item.find('> div span.buttons').length) {
                                $item.find('> div').append('<span class="buttons"></span>');
                            }
                            // Add the delete button
                            if (!$item.find('> div a.delete').length) {
                                $('<a href="#" class="item-button delete"><span class="ui-icon ui-icon-trash"></span></a>')
                                    .on('click', function (e) {
                                        e.preventDefault();
                                        var $item = $(this).closest('li'),
                                            item_id = $item.data('item-id');
                                        $item.hide();
                                        // Set hidden input
                                        $('<input type="hidden" />').attr({
                                            name: 'delete_items[' + item_id + ']'
                                        }).val(1).appendTo($container);
                                    })
                                    .appendTo($item.find('> div .buttons'));
                            }
                            // Add the edit button
                            if (!$item.find('> div a.edit').length) {
                                $('<a href="#" class="item-button edit"><span class="ui-icon ui-icon-pencil"></span></a>')
                                    .on('click', function (e) {
                                        e.preventDefault();
                                        var $item = $(this).closest('li');
                                        var item_driver = $item.data('item-driver');
                                        var item_id = $item.data('item-id');
                                        // Search the driver to get the dialog options
                                        var dialog_options = {};
                                        // Build ajax data
                                        var ajaxData = {
                                            form_id: $container.attr('id'),
                                            context: $dispatcher.data('nosContext'),
                                            mitem_driver: item_driver,
                                            mitem_title: $item.find('> div .label').text().trim()
                                        };

                                        $add_buttons.find('button').each(function () {
                                            var $this = $(this);
                                            if ($this.data('item-driver') == item_driver) {
                                                dialog_options = $this.data('dialog-options') || {};
                                            }
                                        });

                                        // Get updated data
                                        $container.find('[name^="update_items[' + item_id + ']"]').each(function () {
                                            var $this = $(this);
                                            var name = $this.attr('name');
                                            var key = name.substring(name.lastIndexOf('[') + 1, name.length - 1);
                                            var parts = key.split('.');
                                            if (parts.length) {
                                                // Convert dot notation to array (elsewhere fuel php will break it)
                                                $.extend(ajaxData, dotToArray(parts, $this.val()));
                                            } else {
                                                ajaxData[key] = $this.val();
                                            }
                                        });

                                        $(this).nosDialog($.extend({
                                            contentUrl: 'admin/noviusos_menu/menu/item/ajax/edit/' + item_id,
                                            ajax: true,
                                            ajaxData: ajaxData,
                                            title: params.texts.editItem,
                                            height: 400,
                                            width: 700
                                        }, dialog_options));
                                    })
                                    .appendTo($item.find('> div .buttons'));
                            }
                            // Set the original parent id
                            $item.data('parent-id', get_item_parent_id($item));
                        };

                    var set_item_values = function($item, values) {
                            var item_id = $item.data('item-id');
                            var is_new = $item.data('is-new');

                            var modified = 0;
                            $.each(values, function (property, value) {

                                // Get the hidden field
                                var input_name = 'update_items[' + item_id + '][' + property + ']';
                                var $input = $container.find('input[name="' + input_name + '"]');

                                // Don't create a hidden field if the value is the same as the original
                                if ($item.data(property) == value && !is_new) {
                                    $input.remove();
                                    return;
                                }

                                if ($input.length) {
                                    // Update
                                    if ($input.val() != value) {
                                        $input.val(value);
                                        modified++;
                                    }
                                } else {
                                    // Create
                                    $container.append($('<input type="hidden">').attr('name', input_name).val(value));
                                    modified++;
                                }
                            });

                            if (modified) {
                                // Set the unsaved work flag
                                $renderer.trigger('modified', true);
                            }

                            return modified;
                        };

                    var update_items_sort = function() {
                            // Updates items parent id and sort
                            var modified = 0;
                            $renderer.find('li').each(function () {
                                var $item = $(this);
                                modified += set_item_values($item, {
                                    mitem_parent_id: get_item_parent_id($item),
                                    mitem_sort: $item.index()
                                }, true);
                            });
                            return modified;
                        };

                    var get_item_parent_id = function($item) {
                            var $parent = $item.parent('ol:not(.renderer)').parent('li');
                            return $parent.length ? $parent.data('item-id') : '';
                        };

                    var temp_id_offset = 0;

                    // UI fix
                    var $td = $container.closest('td');

                    $td.css('padding-left', $td.css('padding-right')).prev('th').remove();
                    $container.closest('td').attr('colspan', 2).prev('th').remove();

                    // Init nested sortable
                    $renderer.nestedSortable({
                        maxLevels: params.maxLevels,
                        handle: 'div',
                        items: 'li',
                        toleranceElement: '> div',
                        stop: function () {
                            update_items_sort();
                        }
                    });

                    // Work in progress
                    $renderer.on('modified', function (e, modified) {
                        if (modified) {
                            $container.addClass('work-in-progress');
                        } else {
                            $container.removeClass('work-in-progress');
                        }
                    });

                    // Init items
                    $renderer.find('li').each(function () {
                        init_item($(this));
                    });

                    // Add an item
                    $container.find('.add-buttons button').on('click', function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        var $this = $(this);

                        var item_driver = $this.data('item-driver') || $this.attr('data-item-driver');

                        // Creates the item
                        var $item = $('<li><div><span class="label">' + $this.data('item-title') + '</span></div></li>')
                            .data('item-driver', item_driver)
                            .data('is-new', true)
                            // Set the modified flag
                            .addClass('modified')
                            // Add icon
                            .find('> div')
                            .prepend('<span class="icon">' +
                                '<img src="' + $this.find('.icon img').attr('src') + '" /></span>')
                            .end();

                        // Generates a temporary id
                        var id = 'new_' + (++temp_id_offset);

                        $item.attr('id', 'list_' + id)
                            .attr('data-item-id', id)
                            .data('item-id', id);

                        // Add to the DOM
                        $renderer.append($item);

                        // Set initial values
                        set_item_values($item, {
                            mitem_title: $item.find('> div .label').text().trim(),
                            mitem_driver: item_driver
                        });

                        // Init item
                        init_item($item);

                        // Set unsa
                        $item.addClass('modified');

                        // Listen on insert event to update the item's id
                        $container.closest('.nos-ostabs-panel').nosListenEvent([
                            {
                                name: 'Nos\\Menu\\Model_Menu_Item',
                                action: ['insert'],
                                id: id
                            }
                        ], function (nosEvent) {
                            if (nosEvent.newid) {
                                $renderer.find('li[data-item-id="' + nosEvent.id + '"]')
                                    .attr('data-item-id', nosEvent.newid)
                                    .data('item-id', nosEvent.newid);
                            }
                        });

                        // Update sort
                        update_items_sort();

                        return false;
                    });

                    $container.nosListenEvent([
                        {
                            name: 'Nos\\Menu\\Model_Menu_Item',
                            action: ['delete']
                        }
                    ], function (nosEvent) {
                        console.log('nosEvent delete', nosEvent);
                        // @todo Delete items on delete event listen
                    });


                    // Event triggered with the item's modified data when the popup is closed
                    $container.on('update_item', function (event, data) {
                        var id = data.mitem_id;

                        // Find item by id
                        var $item = $renderer.find('li[data-item-id="' + id + '"]');

                        delete data.mitem_id;

                        // Set values
                        var modified = set_item_values($item, data);

                        // Set unsaved if modified
                        if (modified) {
                            $item.addClass('modified');
                        }

                        // Updates the title
                        if (typeof data.mitem_title != 'undefined') {
                            $item.find('> div .label').html(data.mitem_title);
                        }

                        return true;
                    });

                    // Listen on insert/update events to remove hidden inputs
                    $container.closest('.nos-ostabs-panel')
                        .nosListenEvent([
                            {
                                name: 'Nos\\Menu\\Model_Menu_Item',
                                action: ['insert', 'update']
                            }
                        ], function (nosEvent) {
                            if (nosEvent.id) {
                                // Remove hidden inputs
                                $container.find('[name^="update_items[' + nosEvent.id + ']"]').remove();
                                // Remove modified flag
                                $renderer.find('li[data-item-id="' + nosEvent.id + '"]').removeClass('modified');
                            }
                        })
                        // Listen on delete events to remove hidden inputs
                        .nosListenEvent([
                            {
                                name: 'Nos\\Menu\\Model_Menu_Item',
                                action: ['delete']
                            }
                        ], function (nosEvent) {
                            if (nosEvent.id) {
                                // Remove hidden inputs
                                $container.find('[name^="delete_items[' + nosEvent.id + ']"]').remove();
                            }
                        })
                        // Listen on all events to set the work in progress state
                        .nosListenEvent([
                            {
                                name: 'Nos\\Menu\\Model_Menu',
                                action: ['insert', 'update'],
                                id: $menu_id.val()
                            }
                        ], function (nosEvent) {
                            // Reset work in progress state if nothing to save
                            if (!$container.find('[name^="delete_item"]').length
                                && !$container.find('[name^="update_item"]').length) {
                                $renderer.trigger('modified', false);
                            }
                        });
                });
            }
        });

        return $;
    });
