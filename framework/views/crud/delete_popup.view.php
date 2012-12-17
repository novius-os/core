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

if ($crud['behaviours']['twinnable']) {
    $item_contexts = $item->find_context('all');
    $context_count = count($item_contexts);

    if ($crud['behaviours']['tree']) {
        $children = array();
        // Count all children in the primary context
        foreach ($item_contexts as $item_context) {
            foreach ($item_context->find_children_recursive(false) as $child) {
                $children[$child->{$crud['behaviours']['twinnable']['common_id_property']}] = true;
            }
        }
        $children_count = count($children);
        if ($children_count == 0 && $context_count == 1) {
            echo Str::tr($crud['config']['i18n']['you are about to delete, confim'], array('title' =>  $item->title_item()));
        } else {
            ?>
            <p><?= Str::tr($crud['config']['i18n']['you are about to delete'], array('title' =>  $item->title_item())) ?></p>
            <?php
            if ($context_count > 1) {
                $contexts = \Nos\Tools_Context::contexts();
                $contexts_list = array();
                foreach ($item_contexts as $item_context) {
                    $contexts_list[] = \Nos\Tools_Context::contextLabel($item_context->get_context(), array('template' => '{site} - {locale}', 'flag' => false));
                }
                ?>
                <p><?= strtr($crud['config']['i18n']['exists in multiple context'], array(
                    '<strong>' => '<strong title="'.implode(', ', $contexts_list).'">',
                    '{{count}}' => $context_count,
                )) ?></p>
                    <?= $crud['config']['i18n']['delete in the following contexts'] ?>
                <select name="context">
                    <option value="all"><?= __('All contexts') ?></option>
                <?php
                foreach ($item_contexts as $item_context) {
                    ?>
                    <option value="<?= $item_context->get_context() ?>"><?= \Nos\Tools_Context::contextLabel($item_context->get_context(), array('template' => '{site} - {locale}', 'flag' => false)) ?></option>
                    <?php
                }
                ?>
                </select>
                <?php
            }
            if ($children_count > 0) {
                ?>
                <p><?= $children_count == 1 ? $crud['config']['i18n']['item has 1 sub-item'] : strtr($crud['config']['i18n']['item has multiple sub-items'], array('{{count}}' => $children_count)) ?></p>
                <p><?= $crud['config']['i18n']['confirm deletion, enter number'] ?></p>
                <p><?= strtr($crud['config']['i18n']['yes delete sub-items'], array(
                    '{{count}}' => '<input class="verification" data-verification="'.$children_count.'" size="'.(mb_strlen($children_count) + 1).'" />',
                )); ?></p>
                <?php
            }
        }
    } else {
        if ($context_count == 1) {
            echo Str::tr($crud['config']['i18n']['you are about to delete, confim'], array('title' =>  $item->title_item()));
        } else {
            $contexts = \Nos\Tools_Context::contexts();
            $contexts_list = array();
            foreach ($item_contexts as $item_context) {
                $contexts_list[] = \Arr::get($contexts, $item_context->get_context(), $item_context->get_context());
            }
            ?>
            <p><?= Str::tr($crud['config']['i18n']['you are about to delete'], array('title' =>  $item->title_item())) ?></p>
            <p><?= strtr($crud['config']['i18n']['exists in multiple context'], array(
                    '<strong>' => '<strong title="'.implode(', ', $contexts_list).'">',
                    '{{count}}' => $context_count,
                )) ?></p>
                    <?= $crud['config']['i18n']['delete in the following contexts'] ?>
                <select name="context">
                    <option value="all"><?= __('All contexts') ?></option>
            <?php
            foreach ($item_contexts as $item_context) {
                ?>
                <option value="<?= $item_context->get_context() ?>"><?= \Arr::get($contexts, $item_context->get_context(), $item_context->get_context()); ?></option>
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
            echo Str::tr($crud['config']['i18n']['you are about to delete, confim'], array('title' =>  $item->title_item()));
        } else {
            ?>
            <p><?= Str::tr($crud['config']['i18n']['you are about to delete'], array('title' =>  $item->title_item())) ?></p>
            <p><?= $children_count == 1 ? $crud['config']['i18n']['item has 1 sub-item'] : strtr($crud['config']['i18n']['item has multiple sub-items'], array('{{count}}' => $children_count)) ?></p>
            <p><?= $crud['config']['i18n']['confirm deletion, enter number'] ?></p>
            <p><?= strtr($crud['config']['i18n']['yes delete sub-items'], array(
                '{{count}}' => '<input class="verification" data-verification="'.$children_count.'" size="'.(mb_strlen($children_count) + 1).'" />',
            )); ?></p>
        <?php
        }
    } else {
        echo Str::tr($crud['config']['i18n']['you are about to delete, confim'], array('title' =>  $item->title_item()));
    }
}
?>
</p>
