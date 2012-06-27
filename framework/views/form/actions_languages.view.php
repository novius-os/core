<?php

$actions = array();

$locales = array_keys(\Config::get('locales'));

if ($item->is_new())
{
    foreach ($locales as $locale)
    {
        $actions[$locale] = array(
            'label' => strtr(__('Add in {lang}'), array('{lang}' => \Arr::get(Config::get('locales'), $locale, $locale))),
            'url' => $url_crud.'?lang='.$locale,
            'iconUrl' => \Nos\Helper::flag_url($locale),
        );
    }
}
else
{
    $main_lang = $item->find_main_lang();
    $existing = $item->get_all_lang();
    foreach ($locales as $locale)
    {
        $item_lang = $item->find_lang($locale);
        $actions[$locale] = array(
            'label' => strtr(
                empty($item_lang) ? __('Translate in {lang}') : __('Edit in {lang}'),
                array('{lang}' => \Arr::get(Config::get('locales'), $locale, $locale))
            ),
            'url' => $url_crud.'/'.(empty($item_lang) ? $main_lang->id : $item_lang->id).'?lang='.$locale, // .'&common_id='.$main_lang->id
            'iconUrl' => \Nos\Helper::flag_url($locale),
        );
    }
}

echo 'var tmp;';

foreach ($actions as $action) {
    $url = $action['url'];
    unset($action['url']);
    ?>
    tmp = <?= \Format::forge()->to_json($action) ?>;
    tmp.click = function(e, ui) {
        e.preventDefault();
        //alert(<?= \Format::forge()->to_json($url) ?>);
        $nos(ui.ui).tab('open', <?= \Format::forge()->to_json(array('url' => $url)) ?>);
    };
    <?= $var ?>.push(tmp);
    <?php
}

echo 'delete tmp;';