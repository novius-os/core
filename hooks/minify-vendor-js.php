<?php

$requirejs_config = include __DIR__.'/../framework/config/requirejs.config.php';
$config = array(
    'baseUrl' => "../",
    'out' => "../static/admin/bundle/vendor.min.js",
    'name' => 'hooks/vendor',
    'shim' => $requirejs_config['shim'],
    'paths' => $requirejs_config['paths'],
    'uglify' => array(
        "ascii_only" => true,
    ),
);
foreach ($config['paths'] as $alias => $path) {
    $config['paths'][$alias] = str_replace('static/novius-os/admin', 'static/admin', $path);
}

file_put_contents('build.js', '('.json_encode($config).')');
