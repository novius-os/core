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
        'app_dependencies' => false,
        'app_installed' => 'onLoadAppInstalled',
        'app_namespaces' => false,
        'data_catchers' => false,
        'enhancers' => 'onLoadEnhancer',
        'launchers' => 'onLoadLauncher',
        'templates' => 'onLoadTemplate',
    );

    /**
     * @var array List of files in local/data/config directory
     */
    protected static $data_files = array(
        'attachments' => false,
        'page_enhanced' => false,
        'url_enhanced' => false,
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
     * @param    bool     $reload       true to force a reload even if the file is already loaded
     * @return   array                  the (loaded) config data array
     */
    public static function load($name, $event = null, $reload = false)
    {
        if ($event === null) {
            $event = Nos::$entry_point === Nos::ENTRY_POINT_ADMIN;
        }

        list($file, $callback) = static::getFile($name);
        if ($event && !empty($callback)) {
            \Event::register_function('config|'.$file, function (&$config) use ($callback, $name, $file) {
                Config_Data::$callback($config, $name);
                // @todo Event::unregister but now make a Notice with register_function
            });
        }
        return \Config::load($file, 'data::'.$name, $reload, $reload);
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
        \Config::set('data::'.$name, $data);
        list($file, $callback) = static::getFile($name);
        return \Config::save($file, $data);
    }

    /**
     * Get the path on disc of a config data file
     *
     * @param   string          $name      string file name of config data
     * @return array(string, string) the path on disc of a config data file, the callback function to run
     * @throws \FuelException If name is not a valid config data file
     */
    public static function getFile($name)
    {
        if (isset(static::$data_files[$name])) {
            return array(APPPATH.'data'.DS.'config'.DS.$name.'.php', static::$data_files[$name]);
        } elseif (isset(static::$metadata_files[$name])) {
            return array(APPPATH.'metadata'.DS.$name.'.php', static::$metadata_files[$name]);
        }
        throw new \FuelException('Invalid data file');
    }

    /**
     * Translate the appropriate keys for app_installed
     *
     * @param  array  $config  The loaded app_installed configuration
     */
    public static function onLoadAppInstalled(&$config)
    {
        foreach ($config as &$app) {
            $i18n_file = \Arr::get($app, 'i18n_file', false);
            if (!empty($i18n_file)) {
                try {
                    $i18n = \Nos\I18n::dictionary($i18n_file);
                    $app['name'] = $i18n($app['name']);
                } catch (\Fuel\Core\ModuleNotFoundException $e) {
                    // Application does not exist, don't translate
                }
            }
        }
    }

    /**
     * Translate the appropriate keys for enhancers
     *
     * @param  array  $config  The loaded enhancer configuration
     */
    public static function onLoadEnhancer(&$config)
    {
        static::_translate($config, array('title'));
    }

    /**
     * Translate the appropriate keys for templates
     *
     * @param  array  $config  The loaded template configuration
     */
    public static function onLoadTemplate(&$config)
    {
        static::_translate($config, array('title'));
    }

    /**
     * Translate the appropriate keys for launchers
     *
     * @param  array  $config  The loaded launcher configuration
     */
    public static function onLoadLauncher(&$config)
    {
        static::_translate($config, array('name', 'action.tab.label'));
    }

    /**
     * Translate the appropriate keys for a configuration array
     *
     * @param  array  $config  The loaded launcher configuration
     * @param  array  $keys    Which keys are to be translated
     */
    protected static function _translate(&$config, $keys)
    {
        foreach ($config as &$item) {
            $application = \Arr::get($item, 'i18n_application', false);
            $i18n_file = static::get('app_installed.'.$application.'.i18n_file', false);
            if (!empty($i18n_file)) {
                try {
                    $i18n = \Nos\I18n::dictionary($i18n_file);
                    foreach ($keys as $key) {
                        $val = \Arr::get($item, $key, false);
                        if ($val !== false) {
                            \Arr::set($item, $key, $i18n($val));
                        }
                    }
                } catch (\Fuel\Core\ModuleNotFoundException $e) {
                    // Application not found: don't translate
                }
            }
        }
    }
}
