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
        $children_context = array();
        // Count the number of children in each context
        foreach ($item_contexts as $item_context) {
            $children_context[$item_context->get_context()] = 1;
            foreach ($item_context->find_children_recursive(false) as $child) {
                $children[$child->{$crud['behaviours']['twinnable']['common_id_property']}] = true;
                $children_context[$item_context->get_context()]++;
            }
        }
        $children_count = count($children);
    } else {
        $children_count = 0;
    }
} else {
    $context_count = 1;
    if ($crud['behaviours']['tree']) {
        $children_count = count($item->find_children_recursive(false));
    } else {
        $children_count = 0;
    }
}

$context_or_language = count(Nos\Tools_Context::sites()) == 1 ? 'language' : 'context';

if ($children_count > 0 || $context_count > 1) {
    $deletion_summary = array();
    if ($context_count > 1) {
        if (is_array($crud['config']['i18n']['deleting with N '.$context_or_language.'s'])) {
            $msg = $crud['config']['i18n']['deleting with N '.$context_or_language.'s'][\Nos\I18n::pluralKey($context_count)];
        } else {
            \Log::deprecated(
                'The "deleting with N '.$context_or_language.'s" key '.
                'of CRUD '.$crud['config']['model'].' config\'s i18n array must contain an array of different plurals'.
                ' translation, and not the translated text.',
                'Version D'
            );
            $msg = $crud['config']['i18n']['deleting with N '.$context_or_language.'s'];
        }
        $deletion_summary[] = strtr($msg, array('{{'.$context_or_language.'_count}}' =>  $context_count));
    }
    if ($children_count > 0) {
        if (is_array($crud['config']['i18n']['deleting with N children'])) {
            $msg = $crud['config']['i18n']['deleting with N children'][\Nos\I18n::pluralKey($children_count)];
        } else {
            \Log::deprecated(
                'The "deleting with N children" key '.
                'of CRUD '.$crud['config']['model'].' config\'s i18n array must contain an array of different plurals '.
                'translation, and not the translated text. In this case, the key "1 child" is unnecessary.',
                'Version D'
            );
            $msg = $crud['config']['i18n']['deleting with '.($children_count == 1 ? '1 child' : 'N children')];
        }
        $deletion_summary[] = strtr($msg, array('{{children_count}}' =>  $children_count));
    }
    $deletion_summary = implode('<br />', $deletion_summary);
    ?>
    <p><?= $deletion_summary ?></p>
    <?php
}

if ($context_count > 1) {
    $contexts = \Nos\User\Permission::contexts();
    $contexts_list = array();
    ?>
    <table class="grid">
    <?php
    foreach ($item_contexts as $item_context) {
        $is_disabled = \Nos\Config_Common::checkActionDisabled('delete', $item_context, array(
            'delete_popup' => true,
        ));
        $context = $item_context->get_context();
        $count = isset($children_context[$context]) ? $children_context[$context] : 1;

        if (is_array($crud['config']['i18n']['N items'])) {
            $msg = $crud['config']['i18n']['N items'][\Nos\I18n::pluralKey($count)];
        } else {
            \Log::deprecated(
                'The "N items" key '.
                'of CRUD '.$crud['config']['model'].' config\'s i18n array must contain an array of different plurals '.
                'translation, and not the translated text. In this case, the key "1 item" is unnecessary.',
                'Version D'
            );
            $msg = $crud['config']['i18n'][$count == 1 ? '1 item' : 'N items'];
        }
        ?>
        <tr>
            <td><?= Nos\Tools_Context::contextLabel($item_context->get_context()) ?></td>
            <td><?= strtr($msg, array('{{count}}' => $count)) ?></td>
            <td><input type="checkbox" name="contexts[]" class="count" data-count="<?= $count ?>" value="<?= $context ?>" <?= $is_disabled ? 'disabled' : 'checked' ?> /></td>
        </tr>
        <?php
    }
    ?>
    </table>
    <?php
} else {
    ?>
    <input type="checkbox" name="contexts[]" class="count" data-count="<?= $children_count + 1 ?>" value="<?= $crud['behaviours']['twinnable'] ? $item->get_context() : 'all' ?>" checked style="display:none;" />
    <?php
}
