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

class Toolkit_Image_Attachment extends Toolkit_Image_Driver
{
    /**
     * Return the url of the current image
     *
     * @return string
     */
    public function url()
    {
        return $this->image->url();
    }

    /**
     * Return the title of the current image
     *
     * @return string
     */
    public function title()
    {
        return $this->image->filename();
    }

    /**
     * Return the file path of the current image
     *
     * @return string
     */
    public function file()
    {
        return $this->image->path();
    }

    /**
     * Return the sizes of the current image
     *
     * @return  object  An object containing width and height variables.
     */
    public function sizes()
    {
        return \Image::forge(array(), $this->image->path())->sizes();
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
        $sizes = $this->sizes();
        return $sizes->width == $width && $sizes->height == $height;
    }
}


