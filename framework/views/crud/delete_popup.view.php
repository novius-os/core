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
<input type="hidden" name="id" value="<?= $view_params['item']->{$view_params['pk']} ?>" />
<p>
<?php
    if ($view_params['behaviours']['translatable']) {
        $item_langs = $view_params['item']->find_lang('all');
        $lang_count = count($item_langs);

        if ($view_params['behaviours']['tree']) {
            $children = array();
            // Count all children in the primary lang
            foreach ($item_langs as $item) {
                foreach ($item->find_children_recursive(false) as $child) {
                    $children[$child->{$view_params['behaviours']['translatable']['common_id_property']}] = true;
                }
            }
            $children_count = count($children);
            if ($children_count == 0 && $lang_count == 1) {
                echo Str::tr($view_params['config']['messages']['you are about to delete, confim'], array('title' =>  $view_params['item']->title_item()));
            } else {
?>
            <p><?= Str::tr($view_params['config']['messages']['you are about to delete'], array('title' =>  $view_params['item']->title_item())) ?></p>
<?php
                if ($lang_count > 1) {
                    $locales = \Config::get('locales', array());
                    $languages_list = array();
                    foreach ($item_langs as $item) {
                        $languages_list[] = \Arr::get($locales, $item->get_lang(), $item->get_lang());
                    }
?>
    <p><?= strtr($view_params['config']['messages']['exists in multiple lang'], array(
        '<strong>' => '<strong title="'.implode(', ', $languages_list).'">',
        '{count}' => $lang_count,
    )) ?></p>
        <?= $view_params['config']['messages']['delete in the following languages'] ?>
    <select name="lang">
        <option value="all"><?= __('All languages') ?></option>
<?php
                    foreach ($item_langs as $item) {
?>
        <option value="<?= $item->get_lang() ?>"><?= \Arr::get($locales, $item->get_lang(), $item->get_lang()); ?></option>
<?php
                    }
?>
    </select>
<?php
                }
                if ($children_count > 0) {
?>
    <p><?= $children_count == 1 ? $view_params['config']['messages']['item has 1 sub-item'] : strtr($view_params['config']['messages']['item has multiple sub-items'], array('{count}' => $children_count)) ?></p>
    <p><?= $view_params['config']['messages']['confirm deletion, enter number'] ?></p>
    <p><?= strtr($view_params['config']['messages']['yes delete sub-items'], array(
        '{count}' => '<input class="verification" data-verification="'.$children_count.'" size="'.(mb_strlen($children_count) + 1).'" />',
    )); ?></p>
<?php
                }
            }
        } else {
            if ($lang_count == 1) {
                echo Str::tr($view_params['config']['messages']['you are about to delete, confim'], array('title' =>  $view_params['item']->title_item()));
            } else {
                $locales = \Config::get('locales', array());
                $languages_list = array();
                foreach ($item_langs as $item) {
                    $languages_list[] = \Arr::get($locales, $item->get_lang(), $item->get_lang());
                }
?>
    <p><?= Str::tr($view_params['config']['messages']['you are about to delete'], array('title' =>  $view_params['item']->title_item())) ?></p>
    <p><?= strtr($view_params['config']['messages']['exists in multiple lang'], array(
            '<strong>' => '<strong title="'.implode(', ', $languages_list).'">',
            '{count}' => $lang_count,
        )) ?></p>
            <?= $view_params['config']['messages']['delete in the following languages'] ?>
        <select name="lang">
            <option value="all"><?= __('All languages') ?></option>
            <?php
            foreach ($item_langs as $item) {
                ?>
                <option value="<?= $item->get_lang() ?>"><?= \Arr::get($locales, $item->get_lang(), $item->get_lang()); ?></option>
                <?php
            }
            ?>
        </select>
<?php
            }
        }
    } else {
        if ($view_params['behaviours']['tree']) {
            $children_count = count($view_params['item']->find_children_recursive(false));
            if ($children_count == 0) {
                echo Str::tr($view_params['config']['messages']['you are about to delete, confim'], array('title' =>  $view_params['item']->title_item()));
            } else {
?>
    <p><?= Str::tr($view_params['config']['messages']['you are about to delete'], array('title' =>  $view_params['item']->title_item())) ?></p>
    <p><?= $children_count == 1 ? $view_params['config']['messages']['item has 1 sub-item'] : strtr($view_params['config']['messages']['item has multiple sub-items'], array('{count}' => $children_count)) ?></p>
    <p><?= $view_params['config']['messages']['confirm deletion, enter number'] ?></p>
    <p><?= strtr($view_params['config']['messages']['yes delete sub-items'], array(
        '{count}' => '<input class="verification" data-verification="'.$children_count.'" size="'.(mb_strlen($children_count) + 1).'" />',
    )); ?></p>
<?php
            }
        } else {
            echo Str::tr($view_params['config']['messages']['you are about to delete, confim'], array('title' =>  $view_params['item']->title_item()));
        }
    }
?>
</p>
