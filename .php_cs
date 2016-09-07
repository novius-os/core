<?php

// Documentation: http://cs.sensiolabs.org/

use Symfony\CS\Config\Config;
use Symfony\CS\FixerInterface;
use Symfony\CS\Finder\DefaultFinder;

$excludes = [
    'fuel-core',
    'packages',
    'vendor',
];

$fixers = [
    '-psr0',
    '-braces',
    'concat_without_spaces',
    'spaces_cast',
    'new_with_braces',
];

$finder = Symfony\CS\Finder\DefaultFinder::create()
    ->exclude($excludes)
    ->in(__DIR__);

return Config::create()
    ->finder($finder)
    ->fixers($fixers)
    ->level(FixerInterface::PSR2_LEVEL)
    ->setUsingCache(true);
