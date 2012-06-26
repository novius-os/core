<?php
return array(
    'behaviours' => array (
        'Nos\Orm_Behaviour_Sharable' => array(
            \Nos\Orm_Behaviour_Sharable::TYPE_TITLE => 'page_title',
            \Nos\Orm_Behaviour_Sharable::TYPE_URL => function($page) {
                return $page->get_href(array('absolute' => true));
            },
        ),
    ),
);