<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
?>
<div class="renderer-menu" id="<?= $id ?>">
    <div class="add-buttons">
<?php
// Add a button for each available driver
$config = \Config::load('noviusos_menu::config', true);
$available_drivers = \Arr::get($config, 'drivers', array());
foreach ($available_drivers as $driver_class) {
    if (!class_exists($driver_class)) {
        continue;
    }
    $driver_config = $driver_class::getConfig();
    $driver_name = \Arr::get($driver_config, 'name');
    // Dialog options
    $dialog_options = array(
        'width' => \Arr::get($driver_config, 'form.width', array()),
        'height' => \Arr::get($driver_config, 'form.height', array()),
    );
    ?>
            <button data-item-driver="<?= $driver_class ?>"
                    data-item-title="New <?= $driver_name ?>"
                    data-dialog-options="<?= htmlspecialchars(\Format::forge()->to_json($dialog_options)) ?>">
				<span class="icon">
					<?= \Fuel\Core\Html::img(\Arr::get($driver_config, 'icon')) ?>
				</span>
                Add a <?= $driver_name ?>
            </button>
    <?php
}
?>
    </div>
    <input type="hidden" name="tree" value=""/>

    <div class="renderer">
        <?= $tree ?>
    </div>
</div>
<script type="text/javascript">
require(
    ['jquery-nos', 'static/apps/noviusos_menu/js/nestedSortable/jquery.mjs.nestedSortable.js'],
    function ($) {
        $(function () {
            var context = '<?= $menu->menu_context ?>';
            var $container = $('#<?= $id ?>');
            var $renderer = $container.find('.renderer > ol');
            var $add_buttons = $container.find('.add-buttons');

            /**
             * Initialize an item
             *
             * @param $item
             */
            function init_item($item) {
                // Add the button wrapper
                if (!$item.find('> div span.buttons').length) {
                    $item.find('> div').append('<span class="buttons"></span>');
                }
                // Add the delete button
                if (!$item.find('> div a.delete').length) {
                    $('<a href="#" class="item-button delete"><span class="ui-icon ui-icon-trash"></span></a>')
                        .on('click', function (e) {
                            e.preventDefault();
                            var $item = $(this).closest('li');
                            var item_id = $item.data('item-id');
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
                            $add_buttons.find('button').each(function () {
                                var $this = $(this);
                                if ($this.data('item-driver') == item_driver) {
                                    dialog_options = $this.data('dialog-options') || {};
                                }
                            });

                            // Build ajax data
                            var ajaxData = {
                                form_id: $container.attr('id'),
                                mitem_driver: item_driver,
                                mitem_title: $item.find('> div .label').text().trim()
                            };
                            // Get updated data
                            $container.find('[name^="update_items[' + item_id + ']"]').each(function () {
                                var $this = $(this);
                                var name = $this.attr('name');
                                var key = name.substring(name.lastIndexOf('[') + 1, name.length - 1);
                                var parts = key.split('.');
                                if (parts.length) {
                                    // Convert dot notation to array (elsewhere fuel php will break it)
                                    var arr = dotToArray(parts, $this.val());
                                    $.extend(ajaxData, arr);
                                } else {
                                    ajaxData[key] = $this.val();
                                }
                            });

                            $(this).nosDialog($.extend({
                                contentUrl: 'admin/noviusos_menu/menu/item/ajax/edit/' + item_id + '/' + context,
                                ajax: true,
                                ajaxData: ajaxData,
                                title: <?= \Format::forge(__('Edit an item'))->to_json() ?>,
                                height: 400,
                                width: 700
                            }, dialog_options));
                        })
                        .appendTo($item.find('> div .buttons'));
                }
                // Set the original parent id
                $item.data('parent-id', get_item_parent_id($item));
            }

            /**
             * Set item values
             *
             * @param $item
             * @param values
             */
            function set_item_values($item, values) {
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
            }

            /**
             * Update items sort values
             *
             * @return {Number}
             */
            function update_items_sort() {
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
            }

            /**
             * Returns the parent id of the $item element
             *
             * @param $item
             * @return {*}
             */
            function get_item_parent_id($item) {
                var $parent = $item.parent('ol:not(.renderer)').parent('li');
                return $parent.length ? $parent.data('item-id') : '';
            }


            // UI fix
            var $td = $container.closest('td');
            $td.css('padding-left', $td.css('padding-right')).prev('th').remove();
            $container.closest('td').attr('colspan', 2).prev('th').remove();

            // Init nested sortable
            $renderer.nestedSortable({
                maxLevels: <?= \Arr::get($options, 'max_levels') ?>,
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
            var temp_id_offset = 0;
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
                    .addClass('modified');

                // Add icon
                $item.find('> div').prepend('<span class="icon"><img src="' + $this.find('.icon img').attr('src') + '" /></span>');

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
                delete data.mitem_id;

                // Find item by id
                var $item = $renderer.find('li[data-item-id="' + id + '"]');

                console.log('item-id', $item);

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
                    id: <?= \Format::forge($menu->menu_id)->to_json() ?>
                }
            ], function (nosEvent) {
                    // Reset work in progress state if nothing to save
                    if (!$container.find('[name^="delete_item"]').length
                        && !$container.find('[name^="update_item"]').length) {
                        $renderer.trigger('modified', false);
                    }
                })
            ;
        });

        function dotToArray(array, value) {
            var key = array.shift();
            var nested = {};
            nested[key] = array.length ? dotToArray(array, value) : value;
            return nested;
        }
    }
);
</script>
<style type="text/css">
    .renderer-menu {
        padding: 1em 0;
    }

    .renderer-menu .add-buttons {
        margin: 0 0 1.5em 0;
    }

    .renderer-menu .add-buttons button span.icon img {
        width: 12px;
        top: 1px;
        position: relative;
        left: -3px;
    }

    .renderer-menu ol {
        margin: 0;
        padding: 0;
        padding-left: 30px;
    }

    .renderer-menu .renderer > ol {
        margin: 0 0 0 25px;
        padding: 0;
        list-style-type: none;
    }

    .renderer-menu .renderer > ol {
        margin: 0;
    }

    .renderer-menu li {
        margin: 10px 0 0 0;
        padding: 0;
        width: 360px;
    }

    .renderer-menu li div {
        position: relative;
        border: 1px solid #d4d4d4;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        border-color: #D4D4D4 #D4D4D4 #BCBCBC;
        padding: 8px 40px;
        margin: 0;
        cursor: move;
        background: #f6f6f6;
        background: -moz-linear-gradient(top, #ffffff 0%, #f6f6f6 47%, #ededed 100%);
        background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #ffffff), color-stop(47%, #f6f6f6), color-stop(100%, #ededed));
        background: -webkit-linear-gradient(top, #ffffff 0%, #f6f6f6 47%, #ededed 100%);
        background: -o-linear-gradient(top, #ffffff 0%, #f6f6f6 47%, #ededed 100%);
        background: -ms-linear-gradient(top, #ffffff 0%, #f6f6f6 47%, #ededed 100%);
        background: linear-gradient(to bottom, #ffffff 0%, #f6f6f6 47%, #ededed 100%);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#ededed', GradientType=0);
    }

    .renderer-menu li .icon {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 30px;
        border-right: 1px solid #D4D4D4;
        box-shadow: 1px 0 0px rgba(255, 255, 255, 0.5);
        opacity: 0.8;
    }

    .renderer-menu li .icon img {
        width: 16px;
        height: 16px;
        margin-top: -8px;
        margin-left: -8px;
        top: 50%;
        left: 50%;
        display: block;
        position: absolute;
    }

    .renderer-menu li .item-button {
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 30px;
        background: rgba(0, 0, 0, 0.1);
        border-left: 1px solid #cecece;
        cursor: pointer;
    }

    .renderer-menu li .unsaved {
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 30px;
        right: 62px;
    }

    .renderer-menu li.modified .label {
        font-weight: bold;
        color: black;
    }

    .renderer-menu li .edit {
        right: 31px;
    }

    .renderer-menu li .delete {
        right: 0;
    }

    .renderer-menu li .item-button:hover {
        background: rgba(0, 0, 0, 0.2);
    }

    .renderer-menu li .delete:hover {
        background: rgba(160, 0, 0, 0.3);
    }

    .renderer-menu li .item-button span {
        margin: 7px auto;
        display: block;
    }

    .renderer-menu li .label em {
        font-style: italic;
        color: #999999;
    }

    .renderer-menu li.mjs-nestedSortable-branch div {
        background: -moz-linear-gradient(top, #ffffff 0%, #f6f6f6 47%, #f0ece9 100%);
        background: -webkit-linear-gradient(top, #ffffff 0%, #f6f6f6 47%, #f0ece9 100%);

    }

    .renderer-menu li.mjs-nestedSortable-leaf div {
        background: -moz-linear-gradient(top, #ffffff 0%, #f6f6f6 47%, #bcccbc 100%);
        background: -webkit-linear-gradient(top, #ffffff 0%, #f6f6f6 47%, #bcccbc 100%);

    }

    li.mjs-nestedSortable-collapsed.mjs-nestedSortable-hovering div {
        border-color: #999;
        background: #fafafa;
    }

    .renderer-menu .disclose {
        cursor: pointer;
        width: 10px;
        display: none;
    }

    .renderer-menu li.mjs-nestedSortable-collapsed > ol {
        display: none;
    }

    .renderer-menu li.mjs-nestedSortable-branch > div > .disclose {
        display: inline-block;
    }

    .renderer-menu li.mjs-nestedSortable-collapsed > div > .disclose > span:before {
        content: '+ ';
    }

    .renderer-menu li.mjs-nestedSortable-expanded > div > .disclose > span:before {
        content: '- ';
    }
</style>
