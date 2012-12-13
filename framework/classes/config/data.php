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
 * The Config_Data class allows you to work with metadata of your Novius OS instance.
 */
class Config_Data
{
    /**
     * @var array List of files in local/metadata directory
     */
    protected static $metadata_files = array(
        'app_dependencies',
        'app_installed',
        'app_namespaces',
        'data_catchers',
        'enhancers',
        'launchers',
        'templates',
    );

    /**
     * @var array List of files in local/data/config directory
     */
    protected static $data_files = array(
        'attachments',
        'page_enhanced',
        'url_enhanced',
    );

    /**
     * Sets a (dot notated) config data item
     *
     * @param    string    a (dot notated) config data key. If dot notated, first segment must be a name of data file
     * @param    mixed     the config value
     * @return   void
     */
    public static function set($name, $data)
    {
        list($file_name) = explode('.', $name, 2);
        static::load($file_name);
        \Config::set('data::'.$name, $data);
    }

    /**
     * Returns a (dot notated) config data setting
     *
     * @param   string   $name      name of the config data item, can be dot notated. If dot notated, first segment must be a name of data file
     * @param   mixed    $default   the return value if the item isn't found
     * @return  mixed               the config data setting or default if not found
     */
    public static function get($name, $default = null)
    {
        list($file_name) = explode('.', $name, 2);
        static::load($file_name);
        return \Config::get('data::'.$name, $default);
    }

    /**
     * Loads a config data file.
     *
     * @param    mixed    $name         string file name of config data
     * @return   array                  the (loaded) config data array
     */
    public static function load($name)
    {
        return \Config::load(static::getFile($name), 'data::'.$name);
    }

    /**
     * Save a config data array to disc.
     *
     * @param   string          $name      string file name of config data
     * @param   array           $data      config data array
     * @return  bool                       false when config is empty or invalid else \File::update result
     */
    public static function save($name, array $data)
    {
        static::load($name);
        \Config::set('data::'.$name, $data);
        return \Config::save(static::getFile($name), $data);
    }

    /**
     * Get the path on disc of a config data file
     *
     * @param   string          $name      string file name of config data
     * @return string                      the path on disc of a config data file
     * @throws \FuelException If name is not a valid config data file
     */
    protected static function getFile($name)
    {
        if (in_array($name, static::$data_files)) {
            return APPPATH.'data'.DS.'config'.DS.$name.'.php';
        } elseif (in_array($name, static::$metadata_files)) {
            return APPPATH.'metadata'.DS.$name.'.php';
        }
        throw new \FuelException('Invalid data file');
    }
}
