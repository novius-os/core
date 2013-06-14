<?php

foreach ($list as $permission) {

    echo '<div class="permission '.$permission['permission_name'].'">';
    echo '<h2>'.$permission['title'].'</h2>';
    echo \View::forge($permission['view'], (!empty($permission['params']) ? $permission['params'] : array()) + array(
        'permission_name' => $permission['permission_name'],
        'checkbox_name' => 'perm['.$permission['permission_name'].'][]',
        'role' => $role,
    ), false);
    echo '</div>';
}
