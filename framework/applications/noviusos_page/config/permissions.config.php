<?php

Nos\I18n::current_dictionary('nos::common');

return array(
    'all' => array(
        'view' => 'nos::form/accordion',
        'params' => array(
            'accordions' => array(
                'noviusos_form' => array(
                    'title' => __('Permissions for this application'),
                    'view' => 'noviusos_page::admin/permissions',
                ),
            ),
        ),
    ),
);
