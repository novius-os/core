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
