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

$labels     = array();
$items_lang = array();

if ($item !== null) {
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
        if ($item !== null) {
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
                <span class="ui-icon ui-icon-bullet" style="display:inline-block;"></span>
                <form action="<?= $url_form ?>" style="display:inline-block;">
                    <?= Form::hidden('lang',      $lang) ?>
                    <?= Form::hidden('common_id', $common_id) ?>
                    <?= $item !== null ? __('Start from scratch ') : strtr(__('Start in {lang}'), array('{lang}' => Arr::get(Config::get('locales'), $lang, $lang))) ?>
                    <button type="submit" class="primary" data-icon="plus"><?= __('Add') ?></button>
                </form>
            </li>
            <?php
            if ($item !== null) {
                ?>
                <li>
                    <span class="ui-icon ui-icon-bullet" style="display:inline-block;"></span>
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

                        echo strtr(__('Start with the content from the {lang} version'), array(
                            '{lang}' => $selected_lang,
                        ));
                        ?>
                        <button type="submit" class="primary" data-icon="plus"><?= __('Add') ?></button>
                    </form>
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
    });
});
</script>