<?php
return array(
    'local' => array(
        'path' => APPPATH.'applications'.DS,
        'visible' => true,
        'native' => false,
    ),
    'natives' => array(
        'path' => NOSPATH.'applications'.DS,
        'visible' => false,
        'native' => true,
    ),
);
