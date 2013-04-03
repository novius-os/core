<?php

foreach ($list as $permission) {

    echo '<div class="permission '.$permission['permission_name'].'">';
    echo '<h2>'.htmlspecialchars($permission['title']).'</h2>';
    echo \View::forge($permission['view'], (!empty($permission['params']) ? $permission['params'] : array()) + array(
        'permission_name' => $permission['permission_name'],
        'checkbox_name' => 'perm['.$permission['permission_name'].'][]',
        'check_permission' => $check_permission,
    ), false);
    echo '</div>';
}
