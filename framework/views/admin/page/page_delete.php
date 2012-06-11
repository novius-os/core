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
    <input type="hidden" name="id" value="<?= $page->page_id ?>" />
    <p><?php

    $page_title = $page->page_title;

    $page_langs = $page->find_lang('all');
    $lang_count = count($page_langs);

    $children = array();
    // Count all children in the primary lang
    foreach ($page_langs as $page) {
        foreach ($page->find_children_recursive(false) as $child) {
            $children[$child->page_lang_common_id] = true;
        }
    }
    $children_count = count($children);

    $locales = \Config::get('locales', array());
    $languages_list = array();
    foreach ($page_langs as $page) {
        $languages_list[] = \Arr::get($locales, $page->get_lang(), $page->get_lang());
    }
?>
    <p><?= Str::tr(__('You are about to delete the page <strong>":page_title"</strong>.'), array('page_title' => $page_title)) ?></p>
<?php

    if ($children_count == 0 && $lang_count == 1) {
        ?>
        <p><?= __('This page has no sub-pages and can be safely deleted.') ?></p>
        <p><?= __('Please confirm the suppression below.') ?></p>
<?php
    } else {
        if ($lang_count > 1) {
?>
            <p><?= strtr(__('The page exists in <strong>{count} languages</strong>.'), array(
                '<strong>' => '<strong title="'.implode(', ', $languages_list).'">',
                '{count}' => $lang_count,
            )) ?></p>
            <?= __('Delete this page in the following languages: ') ?>
            <select name="lang">
                <option value="all"><?= __('All languages') ?></option>
                <?php
                foreach ($page_langs as $page) {
                    ?>
                        <option value="<?= $page->get_lang() ?>"><?= \Arr::get($locales, $page->get_lang(), $page->get_lang()); ?></option>
                    <?php
                }
                ?>
            </select>
<?php
        }
        if ($children_count > 0) {
?>
            <p><?= strtr(__(
                    $children_count == 1 ? 'This page has <strong>1 sub-page</strong>.'
                                         : 'This page has <strong>{count} sub-pages</strong>.'
            ), array(
                '{count}' => $children_count,
            )) ?></p>
            <p><?= __('To confirm the deletion, you need to enter this number in the field below') ?></p>
            <p><?= strtr(__('Yes, I want to delete the page and all of its {count} sub-pages.'), array(
                '{count}' => '<input class="verification" data-verification="'.$children_count.'" size="'.(mb_strlen($children_count) + 1).'" />',
            )); ?></p>
<?php
        }
    }
?></p>