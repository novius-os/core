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
 * @deprecated This class is deprecated.  Please use \Nos\Media\Renderer_Media instead.
 */
class Renderer_Media extends \Nos\Media\Renderer_Media
{
    public static function _init()
    {
        parent::_init();
        \Log::deprecated('Class \\Nos\\Renderer_Media is deprecated. Please use \\Nos\\Media\\Renderer_Media instead.');
    }
}
