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
    $item_langs = $item->find_lang('all');
    $lang_count = count($item_langs);

    if ($crud['behaviours']['tree']) {
        $children = array();
        // Count all children in the primary lang
        foreach ($item_langs as $item_lang) {
            foreach ($item_lang->find_children_recursive(false) as $child) {
                $children[$child->{$crud['behaviours']['translatable']['common_id_property']}] = true;
            }
        }
        $children_count = count($children);
        if ($children_count == 0 && $lang_count == 1) {
            echo Str::tr($i18n('you are about to delete, confim'), array('title' =>  $item->title_item()));
        } else {
            ?>
            <p><?= Str::tr($i18n('you are about to delete'), array('title' =>  $item->title_item())) ?></p>
            <?php
            if ($lang_count > 1) {
                $locales = \Config::get('locales', array());
                $languages_list = array();
                foreach ($item_langs as $item_lang) {
                    $languages_list[] = \Arr::get($locales, $item_lang->get_lang(), $item_lang->get_lang());
                }
                ?>
                <p><?= strtr($i18n('exists in multiple lang'), array(
                    '<strong>' => '<strong title="'.implode(', ', $languages_list).'">',
                    '{count}' => $lang_count,
                )) ?></p>
                    <?= $i18n('delete in the following languages') ?>
                <select name="lang">
                    <option value="all"><?= __('All languages') ?></option>
                <?php
                foreach ($item_langs as $item_lang) {
                    ?>
                    <option value="<?= $item_lang->get_lang() ?>"><?= \Arr::get($locales, $item_lang->get_lang(), $item_lang->get_lang()); ?></option>
                    <?php
                    }
                ?>
                </select>
                <?php
            }
            if ($children_count > 0) {
                ?>
                <p><?= $children_count == 1 ? $i18n('item has 1 sub-item') : strtr($i18n('item has multiple sub-items'), array('{count}' => $children_count)) ?></p>
                <p><?= $i18n('confirm deletion, enter number') ?></p>
                <p><?= strtr($i18n('yes delete sub-items'), array(
                    '{count}' => '<input class="verification" data-verification="'.$children_count.'" size="'.(mb_strlen($children_count) + 1).'" />',
                )); ?></p>
                <?php
            }
        }
    } else {
        if ($lang_count == 1) {
            echo Str::tr($i18n('you are about to delete, confim'), array('title' =>  $item->title_item()));
        } else {
            $locales = \Config::get('locales', array());
            $languages_list = array();
            foreach ($item_langs as $item_lang) {
                $languages_list[] = \Arr::get($locales, $item_lang->get_lang(), $item_lang->get_lang());
            }
            ?>
            <p><?= Str::tr($i18n('you are about to delete'), array('title' =>  $item->title_item())) ?></p>
            <p><?= strtr($i18n('exists in multiple lang'), array(
                    '<strong>' => '<strong title="'.implode(', ', $languages_list).'">',
                    '{count}' => $lang_count,
                )) ?></p>
                    <?= $i18n('delete in the following languages') ?>
                <select name="lang">
                    <option value="all"><?= __('All languages') ?></option>
            <?php
            foreach ($item_langs as $item_lang) {
                ?>
                <option value="<?= $item_lang->get_lang() ?>"><?= \Arr::get($locales, $item_lang->get_lang(), $item_lang->get_lang()); ?></option>
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
            echo Str::tr($i18n('you are about to delete, confim'), array('title' =>  $item->title_item()));
        } else {
            ?>
            <p><?= Str::tr($i18n('you are about to delete'), array('title' =>  $item->title_item())) ?></p>
            <p><?= $children_count == 1 ? $i18n('item has 1 sub-item') : strtr($i18n('item has multiple sub-items'), array('{count}' => $children_count)) ?></p>
            <p><?= $i18n('confirm deletion, enter number') ?></p>
            <p><?= strtr($i18n('yes delete sub-items'), array(
                '{count}' => '<input class="verification" data-verification="'.$children_count.'" size="'.(mb_strlen($children_count) + 1).'" />',
            )); ?></p>
        <?php
        }
    } else {
        echo Str::tr($i18n('you are about to delete, confim'), array('title' =>  $item->title_item()));
    }
}
?>
</p>