<?php

Nos\I18n::current_dictionary(array('nos::orm', 'nos::common'));

$status = $item->planificationStatus();
if ($status == 0) {
    echo '<img class="publication_status" src="static/novius-os/admin/novius-os/img/icons/status-red.png"> '.__('Not published');
} elseif ($status == 1) {
    echo '<img class="publication_status" src="static/novius-os/admin/novius-os/img/icons/status-green.png"> '.__('Published');
} else {

    $start = $item->publicationStart();
    $end = $item->publicationEnd();
    if (empty($start) && empty($end)) {
        return '';
    }

    $now = strtotime('now');

    if (!empty($start) && strtotime($start) > $now) {
        echo '<span class="publication_status ui-icon ui-icon-clock" /> '.strtr(__('Scheduled for {{date}}'), array(
            '{{date}}' => \Date::formatPattern($start, 'DEFAULT'),
        ));
    } elseif (!empty($end) && strtotime($end) < $now) {
        echo '<img class="publication_status" src="static/novius-os/admin/novius-os/img/icons/status-red.png"> '.__('Not published');
    } elseif (!empty($end)) {
        echo '<img class="publication_status" src="static/novius-os/admin/novius-os/img/icons/status-green.png"> '.strtr(__('Published until {{date}}'), array(
            '{{date}}' => \Date::formatPattern($end, 'DEFAULT'),
        ));
    } else {
        echo '<img class="publication_status" src="static/novius-os/admin/novius-os/img/icons/status-green.png"> '.__('Published');
    }
}
