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
<form action="" method="post" class="menu-item-dialog">
    <div class="expander fieldset"
         data-wijexpander-options="<?= htmlspecialchars(\Format::forge()->to_json($expander_options)); ?>">
        <h3><?= __('Properties') ?></h3>

        <div style="overflow:visible;">
            <div class="field">
                <label for="mitem_title">Title</label>
                <input type="text" name="mitem_title" id="mitem_title" value="<?= e($item->mitem_title) ?>"/>
            </div>
            <div class="field">
                <label for="mitem_css_class">Css class</label>
                <input type="text" name="mitem_css_class" id="mitem_css_class"
                       value="<?= e($item->mitem_css_class) ?>"/>
            </div>
        </div>
    </div>
    <?= $content ?>
    <div class="submit">
        <?=
        strtr(__('{{Save}} or <a>Cancel</a>'), array(
            '{{Save}}' => '<button type="submit" data-icon="check" class="primary">' . __('Ok') . '</button>',
            '<a>' => '<a data-id="close" href="#">',
        )) ?>
    </div>
</form>
<style type="text/css">
    .menu-item-dialog .field {
        margin-bottom: 10px;
    }

    .menu-item-dialog .field label {
        margin-bottom: 3px;
        display: inline-block;
    }

    .menu-item-dialog div.submit {
        margin: 1em 0 0 0;
    }
</style>
