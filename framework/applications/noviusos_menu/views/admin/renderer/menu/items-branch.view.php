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
<ol>
<?php
foreach ($items as $item) {
    $title = $item->driver()->title();
    if (empty($title)) {
        $title = \Arr::get($item->driver()->config(), 'texts.new', '');
    }
    $data = array(
        'id' => $item->mitem_id,
        'driver' => $item->mitem_driver,
        'title' => $title,
    );
    ?>
        <li data-item="<?= e(\Format::forge($data)->to_json()) ?>">
    <?php
    echo \Request::forge('noviusos_menu/admin/menu/crud/menu_item')->execute(array($item));

    $children = array();
    if (!empty($menu)) {
        $children = $menu->branch($item);
    }
    if (count($children)) {
        echo \View::forge('noviusos_menu::admin/renderer/menu/items-branch', array(
            'menu' => $menu,
            'items' => $children,
        ), false);
    }
    ?>
        </li>
    <?php
}
?>
</ol>
