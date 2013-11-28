<?php

Nos\I18n::current_dictionary(array('noviusos_page::common'));

return array(
    'behaviours' => array (
        'Nos\Orm_Behaviour_Sharable' => array(
            'data' => array(
                \Nos\DataCatcher::TYPE_TITLE => array(
                    'value' => 'page_title',
                    'useTitle' => __('Use page title'),
                ),
                \Nos\DataCatcher::TYPE_URL => array(
                    'value' => function ($page) {
                        return $page->url();
                    },
                    'options' => function ($page) {
                        return array($page->url());
                    },
                ),
                \Nos\DataCatcher::TYPE_IMAGE => array(
                    'value' => function ($page) {
                        $possible = $page->possible_medias();

                        return Arr::get(array_keys($possible), 0, null);
                    },
                    'options' => function ($page) {
                        return $page->possible_medias();
                    },
                ),
            ),
        ),
        'Nos\Orm_Behaviour_Publishable' => array(
            'options' => array(
                'allow_publish' => array(
                    'check_draft' => function () {
                        return Nos\User\Permission::atLeast('noviusos_page::page', '2_fullaccess', 2);
                    },
                ),
            ),
        ),
    ),
);
