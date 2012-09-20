<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

$uniqid = uniqid($lang.'_');

$labels = array();
$possible = $item->get_possible_lang();
$main_lang = $item->find_main_lang();
$common_id = $main_lang ? $main_lang->id : false;

$view_params['container_id'] = $uniqid;

echo View::forge('nos::crud/tab', $view_params, false);
?>
<div id="<?= $uniqid ?>" class="" style="padding:0;">
    <div class="blank_slate">
<?php
if (!in_array($lang, $possible)) {
    echo '<p>&nbsp;</p>';
    $parent = $item->get_parent();
    if (!empty($parent)) {
        $uniqid_parent = uniqid('parent_');
        echo strtr($crud['config']['messages']['error added in lang not parent'], array(
            '{lang}' => Arr::get(Config::get('locales'), $lang, $lang),
            '{parent}' => '<a href="javascript:void;" id="'.$uniqid_parent.'">'.__('parent').'</a>',
        ));
        ?>
        <script type="text/javascript">
            require(['jquery-nos'], function($nos) {
               $nos('#<?= $uniqid_parent ?>').click(function() {
                   $nos(this).tab('open', <?= \Format::forge()->to_json(array('url' => $url_insert_update.'/'.$parent->id.'?lang='.$lang)) ?>);
               });
            });
        </script>
        <?php
    } else {
        echo strtr($crud['config']['messages']['error added in lang'], array('{lang}' => Arr::get(Config::get('locales'), $lang, $lang)));
    }
} else {
    foreach ($possible as $locale) {
        $item_lang = $item->find_lang($locale);
        if (!empty($item_lang)) {
            $labels[$item_lang->id] = \Config::get("locales.$locale", $locale);
        }
    }
    ?>
            <p><?=
            strtr($crud['config']['messages']['item inexistent in lang yet'], array('{lang}' => Arr::get(Config::get('locales'), $lang, $lang)))
            ?></p>

            <p>&nbsp;</p>

            <p><?= __('To add this version, you have two options: ') ?></p>

            <p>&nbsp;</p>

            <ul style="margin-left:1em;">
                <li>
                    <span style="display:inline-block; width:2em;"></span>
                    <form action="<?= $crud['url_form'] ?>" style="display:inline-block;">
                        <?= Form::hidden('lang', $lang) ?>
                        <?= Form::hidden('common_id', $common_id) ?>
                        <button type="submit" class="primary" data-icon="plus"><?= __('Start from scratch ') ?></button>
                    </form>
                    <p style="font-style: italic; padding: 5px 0 2em 4em;"><?= __('(Blank form)') ?></p>
                </li>
                <li>
                    <span class="faded" style="display:inline-block; width:2em;"><?= __('OR') ?></span>
                    <form action="<?= $crud['url_form'] ?>" style="display:inline-block;">
                        <?= Form::hidden('lang', $lang) ?>
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
            </ul>
    <?php
}
?>
    </div>
</div>
<script type="text/javascript">
require(['jquery-nos'], function ($) {
    $(function () {
        var $container = $('#<?= $uniqid ?>').nosFormUI();
        $container.find('form').submit(function(e) {
            e.preventDefault();
            var $form = $(this);
            $container.load($form.get(0).action, $form.serialize());
        });
    });
});
</script>
