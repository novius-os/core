<?php

return array(
    'dictionaries' => array(
        'orm' => array(
            '^classes/orm/',
            '^classes/model',
            //'(publishable|sharable|sortable|translatable|tree|virtualname|virtualpath)', // tree
        ),
        'application' => array(
            //'^views/(crud|form)',
            '^views/crud',
            '\Wappdesk[./]|\Wcrud[./]',
        ),
        // false == default dict
        'common' => false,
    ),
);
