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

class Toolkit_Image_Media extends Toolkit_Image_Driver
{
    /**
     * Return the url of the current image
     *
     * @return string
     */
    public function url()
    {
        return $this->image->get_public_path();
    }

    /**
     * Return the title of the current image
     *
     * @return string
     */
    public function title()
    {
        return $this->image->media_title;
    }

    /**
     * Return the file path of the current image
     *
     * @return string
     */
    public function file()
    {
        return $this->image->get_private_path();
    }

    /**
     * Check if dimension is identical to initial dimension
     *
     * @param integer $width The current width
     * @param integer $height The current height
     * @return boolean
     */
    public function isIdentical($width, $height)
    {
        return $this->image->media_width == $width && $this->image->media_height == $height;
    }
}


