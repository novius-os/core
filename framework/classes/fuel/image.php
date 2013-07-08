<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Image extends \Fuel\Core\Image
{
    /**
     * Creates a new instance of the image driver
     *
     * @param array $config
     * @param string $filename
     * @throws FuelException
     * @return  Image_Driver
     */
    public static function forge($config = array(), $filename = null)
    {
        !is_array($config) and $config = array();

        $config = array_merge(\Config::get('image', array()), $config);

        $cmd_convert = \Config::get('cmd_convert');
        if (!empty($config['driver'])) {
            $protocol = ucfirst($config['driver']);
        } else {
            if (!is_null($cmd_convert)) {
                $protocol = 'imagemagick';
                $config['imagemagick_dir'] = dirname($cmd_convert);
            } else {
                $protocol = 'gd';
            }
        }
        $class = 'Image_'.$protocol;
        if ($protocol == 'Driver' || ! class_exists($class)) {
            throw new \FuelException('Driver '.$protocol.' is not a valid driver for image manipulation.');
        }
        $return = new $class($config);
        if ($filename !== null) {
            $return->load($filename);
        }
        return $return;
    }

    static public function gravatarUrl($email, $options = array())
    {
        $params = \Arr::merge(
            array(
                'gravatar_id'   => md5(strtolower(trim($email))),
                'rating'        => 'G',
                'size'          => 80,
                'default'		=> 'http://www.gravatar.com/avatar/00000000000000000000000000000000', //default image
            ),
            $options
        );

        return 'http://gravatar.com/avatar.php?'.http_build_query($params, '', '&');
    }

    /**
     * Resizes the image only if too big
     *
     * @param   integer  $max_width   The new width of the image.
     * @param   integer  $max_height  The new height of the image.
     * @param   boolean  $keepar  Defaults to true. If false, allows resizing without keeping AR.
     * @param   boolean  $pad     If set to true and $keepar is true, it will pad the image with the configured bgcolor
     * @see parent::resize
     * @return  Image_Driver
     */
    public static function shrink($max_width, $max_height, $keepar = true, $pad = false)
    {
        return static::instance()->shrink($max_width, $max_height, $keepar, $pad);
    }
}
