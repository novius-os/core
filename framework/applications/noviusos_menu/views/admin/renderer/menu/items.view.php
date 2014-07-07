<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('noviusos_menu::common', 'nos::common'));

$json = array(
    'itemUrl' => \Uri::base(true).'admin/noviusos_menu/menu/crud/menu_item',
    'nestedSortable' => \Arr::get($options, 'nestedSortable', array()),
    'texts' => array(
        'addItem' => __('Add an item'),
        'deleteItem' => __('Delete this item'),
    ),
    'drivers' => \Nos\Menu\Menu_Item::drivers(),
);
?>
<div id="<?= $id = uniqid('renderer-menu-') ?>">
<?php
$menu = \Arr::get($options, 'menu');
echo \View::forge('noviusos_menu::admin/renderer/menu/items-branch', array(
    'menu' => $menu,
    'items' => $menu ? $menu->branch() : array(),
), false);
?>
</div>
<script type="text/javascript">
    require(
        [
            'jquery-nos-renderer-menu-items',
            'link!static/apps/noviusos_menu/css/jquery.ui.renderer-menu-items.css'
        ],
        function ($) {
            $(function() {
                $('#<?= $id ?>')
                    .renderermenuitems(<?= \Format::forge()->to_json($json, \Fuel::$env === \Fuel::DEVELOPMENT) ?>);
            });
        }
    );
</script>
