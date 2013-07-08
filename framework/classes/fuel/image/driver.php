<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

abstract class Image_Driver extends \Fuel\Core\Image_Driver
{

    /**
     * Resizes the image only if too big
     *
     * @param   integer  $max_width   The new width of the image.
     * @param   integer  $max_height  The new height of the image.
     * @param   boolean  $keepar  If false, allows stretching of the image.
     * @param   boolean  $pad     Adds padding to the image when resizing.
     * @see parent::resize
     * @return  Image_Driver
     */
    public function shrink($max_width, $max_height = null, $keepar = true, $pad = false)
    {
        $this->queue('shrink', $max_width, $max_height, $keepar, $pad);
        return $this;
    }

    /**
     * Executes the shrink event when the queue is ran.
     *
     * @param   integer  $max_width   The new width of the image.
     * @param   integer  $max_height  The new height of the image.
     * @param   boolean  $keepar  If false, allows stretching of the image.
     * @param   boolean  $pad     Adds padding to the image when resizing.
     * @see parent::shrink
     * @return  array    An array of variables for the specific driver.
     */
    protected function _shrink($max_width, $max_height = null, $keepar = true, $pad = true)
    {
        $return = parent::_resize($max_width, $max_height, $keepar, $pad);
        $sizes = $this->sizes();
        if ($return['width'] > $sizes->width || $return['height'] > $sizes->height) {
            return;
        }
        $this->_resize($max_width, $max_height, $keepar, $pad);
    }
}
