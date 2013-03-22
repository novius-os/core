<?php

$status = $item->planificationStatus();
if ($status == 0) {
    echo '<img class="publication_status" src="static/novius-os/admin/novius-os/img/icons/status-red.png"> '.__('Not published');
} else if ($status == 1) {
    echo '<img class="publication_status" src="static/novius-os/admin/novius-os/img/icons/status-green.png"> '.__('Published');
}

$start = $item->publicationStart();
$end = $item->publicationEnd();
if (empty($start) && empty($end)) {
    return '';
}

$now = strtotime('now');

if (!empty($start) && strtotime($start) > $now) {
    echo '<span class="publication_status ui-icon ui-icon-clock" /> '.strtr(__('Scheduled from {{date}}'), array(
        '{{date}}' => \Date::forge(strtotime($start))->format(__('date_format.normal')),
    ));
}
if (!empty($end) && strtotime($end) < $now) {
    echo '<img class="publication_status" src="static/novius-os/admin/novius-os/img/icons/status-red.png"> '.__('Not published');
}
if (!empty($end)) {
    echo '<img class="publication_status" src="static/novius-os/admin/novius-os/img/icons/status-green.png"> '.strtr(__('Published until {{date}}'), array(
        '{{date}}' => \Date::forge(strtotime($end))->format(__('date_format.normal')),
    ));
}

echo '<img class="publication_status" src="static/novius-os/admin/novius-os/img/icons/status-green.png"> '.__('Published');
