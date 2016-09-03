<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

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
