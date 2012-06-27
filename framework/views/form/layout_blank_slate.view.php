<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */


$locales = Config::get('locales', array());
empty($tabInfos) and $tabInfos = array();
empty($tabInfos['actions']) and $tabInfos['actions'] = array();
empty($url_crud) or $tabInfos['url'] = $url_crud.($item === null ? '': '/'.$item->id).'?lang='.$lang;

$labels     = array();
$items_lang = array();
$common = $item::find($common_id);

if (empty($common)) {
    $common_id = null;
}


if (!empty($common)) {
    $possible = $item->get_possible_lang();
    $main_lang = $item->find_main_lang();
    $common_id = $main_lang ? $main_lang->id : false;

    foreach ($possible as $locale) {
        $items_lang[$locale] = $item->find_lang($locale);
        if (!empty($items_lang[$locale])) {
            $labels[$items_lang[$locale]->id] = Arr::get($locales, $locale, $locale);
        }
    }
}
?>
<div id="<?= $uniqid = uniqid($lang.'_') ?>" class="" style="padding:0;">
    <div class="blank_slate">
        <?php
        if (!empty($common_id)) {
            ?>
            <p><?= strtr(__('This {item} has not been added in {lang} yet.'), array(
                '{item}' => null === $item_text ? '' : $item_text,
                '{lang}' => Arr::get(Config::get('locales'), $lang, $lang),
            )) ?></p>
            <p>&nbsp;</p>

            <p><?= __('To add this version, you have two options: ') ?></p>
            <?php
        }
        ?>
        <p>&nbsp;</p>
        <ul style="margin-left:1em;">
            <li>
                <span style="display:inline-block; width:2em;"></span>
                <form action="<?= $url_form ?>" style="display:inline-block;">
                    <?= Form::hidden('lang',      $lang) ?>
                    <?= Form::hidden('common_id', $common_id) ?>
                    <button type="submit" class="primary" data-icon="plus"><?=__('Start from scratch ') ?></button>
                </form>
                <p style="font-style: italic; padding: 5px 0 2em 4em;"><?= __('(Blank form)') ?></p>
            </li>
            <?php
            if (!empty($common_id)) {
                ?>
                <li>
                    <span class="faded" style="display:inline-block; width:2em;"><?= __('OR') ?></span>
                    <form action="<?= $url_form ?>" style="display:inline-block;">
                        <?= Form::hidden('lang',      $lang) ?>
                        <?= Form::hidden('common_id', $common_id) ?>
                        <?php
                        if (count($labels) == 1) {
                            echo Form::hidden('create_from_id', key($labels));
                            $selected_lang = current($labels);
                        } else {
                            $selected_lang = Form::select('create_from_id', null, $labels);
                        }

                        echo strtr(__('{translate} the {lang} version'), array(
                            '{translate}' => '<button type="submit" class="primary" data-icon="plus">'.__('Translate').'</button>',
                            '{lang}' => $selected_lang,
                        ));
                        ?>
                    </form>
                    <p style="font-style: italic; padding: 5px 0 2em 4em;"><?= __('(Form filled with the content from the original version)') ?></p>
                </li>
                <?php
            }
            ?>
        </ul>
    </div>
</div>

<script type="text/javascript">
require(['jquery-nos'], function ($nos) {
    $nos(function () {
        var $container = $nos('#<?= $uniqid ?>').form();
        $container.find('form').submit(function(e) {
            e.preventDefault();
            var $form = $(this);
            $container.load($form.get(0).action, $form.serialize());
        });

        var tabInfos = <?= json_encode($tabInfos) ?>;
        <?php
        echo \View::forge('nos::form/actions_languages', array(
            'item' => $item,
            'url_crud' => $url_crud,
            'var' => 'tabInfos.actions',
        ), false);
        ?>

        // Object.keys() is not available in IE 8 or IE quirks
        if (Object.keys(tabInfos).length > 0) {
            $container.onShow('bind', function() {
                $container.tab('update', tabInfos);
            });
            $container.onShow();
        }
    });
});
</script>