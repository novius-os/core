<?php

namespace Nos;

/**
 * Class Exception_FrontNotFound
 *
 * Triggered when
 *
 * @package Nos
 */
class Exception_FrontNotFound extends NotFoundException
{
}

/**
 * Class NotFoundException
 *
 * @deprecated Please consider using Exception_FrontNotFound instead
 *
 * @package Nos
 */
class NotFoundException extends \Exception
{
}
