<?php

namespace Nos;

/**
 * Class Exception_FrontIgnoreTemplate
 *
 * Triggered when the template must be ignored
 *
 * @package Nos
 */
class Exception_FrontIgnoreTemplate extends FrontIgnoreTemplateException
{
}

/**
 * Class FrontIgnoreTemplateException
 *
 * @deprecated Please consider using Exception_FrontNotFound instead
 *
 * @package Nos
 */
class FrontIgnoreTemplateException extends \Exception
{
}
