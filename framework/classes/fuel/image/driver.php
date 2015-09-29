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
     * Resizes the image only if too big
     *
     * @param   integer  $max_width   The new width of the image.
     * @param   integer  $max_height  The new height of the image.
     * @param   boolean  $keepar  If false, allows stretching of the image.
     * @param   boolean  $pad     Adds padding to the image when resizing.
     * @see parent::resize
     * @return  Image_Driver
     */
    public function quality($quality)
    {
        $this->queue('quality', $quality);
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

    /**
     * Returns sizes for the currently loaded image modified by the queue transformations.
     *
     * @return  object  An object containing width and height variables.
     */
    public function queueSizes()
    {
        $sizes = $this->sizes();
        foreach ($this->queued_actions as $action) {
            $transformation = array_shift($action);
            switch($transformation) {
                case 'crop':
                    list($x1, $y1, $x2, $y2) = $action;
                    $return = parent::_crop($x1, $y1, $x2, $y2);
                    $sizes->width = $return['x2'] - $return['x1'];
                    $sizes->height = $return['y2'] - $return['y1'];
                    break;

                case 'resize':
                    list($width, $height, $keepar, $pad) = $action;
                    $return = parent::_resize($width, $height, $keepar, $pad);
                    $sizes->width = $return['cwidth'];
                    $sizes->height = $return['cheight'];
                    break;

                case 'shrink':
                    $max_width = $action[0];
                    $max_height = $action[1];
                    $dont_resize =
                        ($sizes->width <= $max_width && $sizes->height <= $max_height) ||
                        (empty($max_width) && $sizes->height <= $max_height) ||
                        (empty($max_height) && $sizes->width <= $max_width) ||
                        (empty($max_width) && empty($max_height));

                    if (!$dont_resize) {
                        $ratio_width  = $max_width / $sizes->width;
                        $ratio_height =  $max_height / $sizes->height;
                        if (empty($max_width) || (!empty($max_height) && $ratio_width > $ratio_height)) {
                            $sizes->width = (int) round($sizes->width * $ratio_height);
                            $sizes->height = $max_height;
                        } else {
                            $sizes->width = $max_width;
                            $sizes->height = (int) round($sizes->height * $ratio_width);
                        }
                    }
                    break;

                case 'crop_resize':
                    list($width, $height) = $action;

                    $y = floor(max(0, $sizes->height - $height) / 2);
                    $x = floor(max(0, $sizes->width - $width) / 2);
                    $return = parent::_crop($x, $y, $x + $width, $y + $height);
                    $sizes->width = $return['x2'] - $return['x1'];
                    $sizes->height = $return['y2'] - $return['y1'];
                    break;

                case 'rotate':
                    $radian = deg2rad($action[0]);
                    $width = $sizes->width;
                    $height = $sizes->height;
                    $sizes->width = ceil($width * cos($radian) + $height * sin($radian));
                    $sizes->height = ceil($width * sin($radian) + $height * cos($radian));

                    break;

                case 'border':
                    $size = $action[0];
                    $sizes->width += $size * 2;
                    $sizes->height += $size * 2;
            }
        }

        return $sizes;
    }
}
