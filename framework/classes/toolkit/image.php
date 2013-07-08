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

class Toolkit_Image
{
    protected static $_methods_mapping = array(
        'crop' => 'c',
        'resize' => 'r',
        'shrink' => 's',
        'crop_resize' => 'cr',
        'rotate' => 'rot',
        'flip' => 'f',
        'watermark' => 'w',
        'border' => 'b',
        'mask' => 'm',
        'rounded' => 'rou',
        'grayscale' => 'g',
    );

    /**
     * Create a new instance of the Toolkit_Image class.
     *
     * @param string $image The image object
     * @param array $transformations Any transformations to add to the URL
     * @return    Toolkit_Image    newly created instance
     */
    public static function forge($image, $transformations = array())
    {
        return new static($image, $transformations);
    }

    /**
     * @var  mixed  The object image
     */
    protected $_image;

    /**
     * @var  string The current image URL
     */
    protected $_url;

    /**
     * @var  boolean Indicates whether transformations have been added since the last url generation
     */
    protected $_dirty = false;

    /**
     * @var  array Queue of transformations to made on image
     */
    protected $_transformations = array();

    /**
     * Create a new instance of the Toolkit_Image class.
     *
     * @param string $image The image object
     * @param array $transformations Any transformations to add to the URL
     */
    protected function __construct($image, $transformations)
    {
        $config = \Config::get('toolkit_image', array(
            'Nos\Media\Model_Media' => 'Nos\Toolkit_Image_Media'
        ));

        $class = get_class($image);
        $driver = \Arr::get($config, $class, false);
        if ($driver === false) {
            throw new \FuelException('Not found a Toolkit_Image driver for class '.$class.'.');
        }

        $this->_image = new $driver($image);

        foreach ($transformations as $transformation => $transformation_args) {
            $transformation_args = (array) $transformation_args;
            if (method_exists($this, $transformation)) {
                call_user_func_array(array($this, $transformation), $transformation_args);
            }
        }
    }

    protected function _transformation($transformation)
    {
        $this->_dirty = true;
        $this->_transformations[] = $transformation;

        return $this;
    }

    /**
     * Add a crop transformation to the image URL.
     *
     * Absolute integer or percentages accepted for all 4.
     *
     * @param   integer  $x1  X-Coordinate based from the top-left corner.
     * @param   integer  $y1  Y-Coordinate based from the top-left corner.
     * @param   integer  $x2  X-Coordinate based from the bottom-right corner.
     * @param   integer  $y2  Y-Coordinate based from the bottom-right corner.
     * @return  Toolkit_Image
     * @see \Fuel\Core\Image::crop()
     */
    public function crop($x1, $y1, $x2, $y2)
    {
        $this->_transformation(array('crop', $x1, $y1, $x2, $y2));

        return $this;
    }

    /**
     * Resizes the image. If the width or height is null, it will resize retaining the original aspect ratio.
     *
     * @param   integer  $width   The new width of the image.
     * @param   integer  $height  The new height of the image.
     * @param   boolean  $keepar  Defaults to true. If false, allows resizing without keeping AR.
     * @param   boolean  $pad     If set to true and $keepar is true, it will pad the image with the configured bgcolor
     * @return  Toolkit_Image
     * @see \Fuel\Core\Image::resize()
     */
    public function resize($width, $height, $keepar = true, $pad = false)
    {
        $this->_transformation(array('resize', $width, $height, $keepar, $pad));

        return $this;
    }

    /**
     * Resizes the image only if too big
     *
     * @param   integer $max_width   The max width of the image.
     * @param   integer $max_height  The max height of the image.
     * @return  Toolkit_Image
     */
    public function shrink($max_width, $max_height)
    {
        $this->_transformation(array('shrink', $max_width, $max_height));

        return $this;
    }

    /**
     * Resizes the image. If the width or height is null, it will resize retaining the original aspect ratio.
     *
     * @param   integer  $width   The new width of the image.
     * @param   integer  $height  The new height of the image.
     * @return  Toolkit_Image
     * @see \Fuel\Core\Image::crop_resize()
     */
    public function crop_resize($width, $height)
    {
        $this->_transformation(array('crop_resize', $width, $height));

        return $this;
    }

    /**
     * Rotates the image
     *
     * @param   integer  $degrees  The degrees to rotate, negatives integers allowed.
     * @return  Toolkit_Image
     * @see \Fuel\Core\Image::rotate()
     */
    public function rotate($degrees)
    {
        $this->_transformation(array('rotate', $degrees));

        return $this;
    }

    /**
     * Creates a vertical / horizontal or both mirror image.
     *
     * @param string $direction 'vertical', 'horizontal', 'both'
     * @return  Toolkit_Image
     * @see \Fuel\Core\Image::flip()
     */
    public function flip($direction)
    {
        $this->_transformation(array('flip', $direction));

        return $this;
    }

    /**
     * Adds a watermark to the image.
     *
     * @param   string   $filename  The filename of the watermark file to use.
     * @param   string   $position  The position of the watermark, ex: "bottom right", "center center", "top left"
     * @param   integer  $padding   The spacing between the edge of the image.
     * @return  Toolkit_Image
     * @see \Fuel\Core\Image::flip()
     */
    public function watermark($filename, $position, $padding = 5)
    {
        $this->_transformation(array('watermark', $filename, $position, $padding));

        return $this;
    }

    /**
     * Adds a border to the image.
     *
     * @param   integer  $size   The side of the border, in pixels.
     * @param   string   $color  A hexidecimal color.
     * @return  Toolkit_Image
     * @see \Fuel\Core\Image::flip()
     */
    public function border($size, $color = null)
    {
        $this->_transformation(array('border', $size, $color));

        return $this;
    }

    /**
     * Masks the image using the alpha channel of the image input.
     *
     * @param   string  $maskimage  The location of the image to use as the mask
     * @return  Toolkit_Image
     * @see \Fuel\Core\Image::flip()
     */
    public function mask($maskimage)
    {
        $this->_transformation(array('mask', $maskimage));

        return $this;
    }

    /**
     * Adds rounded corners to the image.
     *
     * @param   integer  $radius
     * @param   integer  $sides      Accepts any combination of "tl tr bl br" seperated by spaces, or null for all sides
     * @param   integer  $antialias  Sets the antialias range.
     * @return  Toolkit_Image
     * @see \Fuel\Core\Image::flip()
     */
    public function rounded($radius, $sides = null, $antialias = null)
    {
        $this->_transformation(array('rounded', $radius, $sides, $antialias));

        return $this;
    }

    /**
     * Turns the image into a grayscale version
     *
     * @return  Toolkit_Image
     * @see \Fuel\Core\Image::flip()
     */
    public function grayscale()
    {
        $this->_transformation(array('grayscale'));

        return $this;
    }

    protected function _isIdentical()
    {
        if (count($this->_transformations) === 1 &&
            in_array($this->_transformations[0][0], array('shrink', 'resize'))) {
            return $this->_image->isIdentical($this->_transformations[0][1], $this->_transformations[0][2]);
        }
        return false;
    }

    /**
     * Build and return the URL of the modify image
     *
     * @return  string
     */
    public function url()
    {
        if (count($this->_transformations) === 0) {
            return $this->_image->url();
        }

        if ($this->_dirty) {
            if ($this->_isIdentical()) {
                $this->_url =  $this->_image->url();
                return $this->_url;
            }

            \Config::load('crypt', true);
            $hash = \Config::get('crypt.crypto_hmac').'$'. $this->_image->url();
            $ext = pathinfo($this->_image->url(), PATHINFO_EXTENSION);
            $url = array();

            foreach ($this->_transformations as $transformation_args) {
                $transformation = array_shift($transformation_args);
                $hash = '$'.$transformation.(count($transformation_args) ? '$'.rtrim(join('$', $transformation_args), '$') : '');
                $url[] = static::$_methods_mapping[$transformation].(count($transformation_args) ? ','.rtrim(join(',', $transformation_args), ',') : '');
            }

            $url[] = substr(md5($hash), 0, 6);
            $url = '/'.join('-', $url);
            $url = preg_replace('`'.preg_quote('.'.$ext).'$`iUu', '', $this->_image->url()).$url;
            $this->_url = 'cache/'.ltrim($url, '/').'.'.$ext;
        }

        return $this->_url;
    }

    public function html($params = array())
    {
        $image = $this->_image();
        $sizes = $image->sizes();

        $params = array_merge(array(
            'width' => $sizes->width,
            'height' => $sizes->height,
            'alt' => $this->_image->title(),
        ), $params);

        return \Html::img($this->url(), $params);
    }

    protected function _image()
    {
        $image = \Image::forge();
        $image->load($this->_image->file());

        foreach ($this->_transformations as $transformation_args) {
            $transformation = array_shift($transformation_args);
            if (method_exists($image, $transformation)) {
                call_user_func_array(array($image, $transformation), $transformation_args);
            }
        }

        return $image;
    }

    /**
     * Apply transformations of the Image_URL instance on a file and save it
     *
     * @return  string The save file path
     */
    public function apply()
    {
        $image = $this->_image();

        $destination = APPPATH.$this->url();
        $dir = dirname($destination);
        if (!is_dir($dir)) {
            if (!@mkdir($dir, 0755, true)) {
                error_log("Can't create dir ".$dir);
                exit("Can't create dir ".$dir);
            }
        }
        $image->save($destination);
        return $destination;
    }

    /**
     * Parse an existing modify URL and set transformations in queue. Check if the hash part of the URL match.
     *
     * @param string $image_url Modify URL of the image
     * @throws \Exception If the hash part of the URL not match
     */
    public function parse($image_url)
    {
        $pathinfo = pathinfo($image_url);

        // Remove 6 first characters for cache/
        $url = \Str::sub($pathinfo['dirname'].'.'.$pathinfo['extension'], 6);
        $transformations = explode('-', $pathinfo['filename']);

        //remove hash
        array_pop($transformations);

        $this->_transformations = array();
        foreach ($transformations as $transformation_slug) {
            $transformation_args = explode(',', $transformation_slug);
            $transformation_args[0] = array_search($transformation_args[0], static::$_methods_mapping);
            $this->_transformation($transformation_args);
        }

        if ($this->url() !== $image_url) {
            throw new \Exception('Forbidden');
        }
    }

    public function __toString()
    {
        return $this->url();
    }
}
