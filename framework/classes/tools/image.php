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
 * @deprecated This class is deprecated.  Please use \Image instead.
 */
class Tools_Image
{
    /**
     * @deprecated This method is deprecated.  Please use \Image::forge()->resize() instead.
     */
    public static function resize($source, $max_width = null, $max_height = null, $dest = null)
    {
        \Log::deprecated('\Nos\Tools_Image::resize($source, $max_width, $max_height, $dest) is deprecated. Please use \Image class with methods load(), shrink() and save().', 'Chiba.2');

        $image = \Image::forge();
        $image->load($source);
        $image->shrink($max_width, $max_height);
        $image->save($dest);

        return true;
    }
}
