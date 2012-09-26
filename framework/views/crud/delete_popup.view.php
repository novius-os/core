<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
?>
<input type="hidden" name="id" value="<?= $item->{$crud['pk']} ?>" />
<p>
<?php
if ($crud['behaviours']['translatable']) {
    $item_sites = $item->find_site('all');
    $site_count = count($item_sites);

    if ($crud['behaviours']['tree']) {
        $children = array();
        // Count all children in the primary site
        foreach ($item_sites as $item_site) {
            foreach ($item_site->find_children_recursive(false) as $child) {
                $children[$child->{$crud['behaviours']['translatable']['common_id_property']}] = true;
            }
        }
        $children_count = count($children);
        if ($children_count == 0 && $site_count == 1) {
            echo Str::tr($crud['config']['messages']['you are about to delete, confim'], array('title' =>  $item->title_item()));
        } else {
            ?>
            <p><?= Str::tr($crud['config']['messages']['you are about to delete'], array('title' =>  $item->title_item())) ?></p>
            <?php
            if ($site_count > 1) {
                $sites = \Config::get('sites', array());
                $sites_list = array();
                foreach ($item_sites as $item_site) {
                    $sites_list[] = \Arr::get($sites, $item_site->get_site(), $item_site->get_site());
                }
                ?>
                <p><?= strtr($crud['config']['messages']['exists in multiple site'], array(
                    '<strong>' => '<strong title="'.implode(', ', $sites_list).'">',
                    '{count}' => $site_count,
                )) ?></p>
                    <?= $crud['config']['messages']['delete in the following sites'] ?>
                <select name="site">
                    <option value="all"><?= __('All sites') ?></option>
                <?php
                foreach ($item_sites as $item_site) {
                    ?>
                    <option value="<?= $item_site->get_site() ?>"><?= \Arr::get($sites, $item_site->get_site(), $item_site->get_site()); ?></option>
                    <?php
                }
                ?>
                </select>
                <?php
            }
            if ($children_count > 0) {
                ?>
                <p><?= $children_count == 1 ? $crud['config']['messages']['item has 1 sub-item'] : strtr($crud['config']['messages']['item has multiple sub-items'], array('{count}' => $children_count)) ?></p>
                <p><?= $crud['config']['messages']['confirm deletion, enter number'] ?></p>
                <p><?= strtr($crud['config']['messages']['yes delete sub-items'], array(
                    '{count}' => '<input class="verification" data-verification="'.$children_count.'" size="'.(mb_strlen($children_count) + 1).'" />',
                )); ?></p>
                <?php
            }
        }
    } else {
        if ($site_count == 1) {
            echo Str::tr($crud['config']['messages']['you are about to delete, confim'], array('title' =>  $item->title_item()));
        } else {
            $sites = \Config::get('sites', array());
            $sites_list = array();
            foreach ($item_sites as $item_site) {
                $sites_list[] = \Arr::get($sites, $item_site->get_site(), $item_site->get_site());
            }
            ?>
            <p><?= Str::tr($crud['config']['messages']['you are about to delete'], array('title' =>  $item->title_item())) ?></p>
            <p><?= strtr($crud['config']['messages']['exists in multiple site'], array(
                    '<strong>' => '<strong title="'.implode(', ', $sites_list).'">',
                    '{count}' => $site_count,
                )) ?></p>
                    <?= $crud['config']['messages']['delete in the following sites'] ?>
                <select name="site">
                    <option value="all"><?= __('All sites') ?></option>
            <?php
            foreach ($item_sites as $item_site) {
                ?>
                <option value="<?= $item_site->get_site() ?>"><?= \Arr::get($sites, $item_site->get_site(), $item_site->get_site()); ?></option>
                <?php
            }
            ?>
                </select>
            <?php
        }
    }
} else {
    if ($crud['behaviours']['tree']) {
        $children_count = count($item->find_children_recursive(false));
        if ($children_count == 0) {
            echo Str::tr($crud['config']['messages']['you are about to delete, confim'], array('title' =>  $item->title_item()));
        } else {
            ?>
            <p><?= Str::tr($crud['config']['messages']['you are about to delete'], array('title' =>  $item->title_item())) ?></p>
            <p><?= $children_count == 1 ? $crud['config']['messages']['item has 1 sub-item'] : strtr($crud['config']['messages']['item has multiple sub-items'], array('{count}' => $children_count)) ?></p>
            <p><?= $crud['config']['messages']['confirm deletion, enter number'] ?></p>
            <p><?= strtr($crud['config']['messages']['yes delete sub-items'], array(
                '{count}' => '<input class="verification" data-verification="'.$children_count.'" size="'.(mb_strlen($children_count) + 1).'" />',
            )); ?></p>
        <?php
        }
    } else {
        echo Str::tr($crud['config']['messages']['you are about to delete, confim'], array('title' =>  $item->title_item()));
    }
}
?>
</p>
