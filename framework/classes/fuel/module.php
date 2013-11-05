<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class ModuleNotFoundException extends \FuelException
{
}

class Module extends Fuel\Core\Module
{
    protected static $modulesCanonical = array();

    public static function load($module, $path = null)
    {
        $loaded = parent::load($module, $path);
        if ($loaded) {
            $path = static::$modules[$module];
            // This allows to browse/scan the array starting from the most new loaded module in findFromCanonicalPath()
            \Arr::prepend(static::$modulesCanonical, $module, realpath($path));

            // Load the config (namespace + dependencies)

            $namespace = \Nos\Config_Data::get('app_namespaces.'.$module, null);
            if (!empty($namespace)) {
                Autoloader::add_namespaces(array(
                    $namespace => $path.'classes'.DS,
                ), true);
                // Allow autoloading from bootstrap to alias classes from this namespace
                Fuel::$namespace_aliases[Inflector::words_to_upper($module)] = $namespace;
            }

            // Load the bootstrap if it exists
            // If module isn't local, we need the application to be installed
            if ((!empty($namespace) || $module == 'local') && is_file($path.'bootstrap.php')) {
                Fuel::load($path.'bootstrap.php');
            }

            // Load dependent applications
            $dependencies = \Nos\Config_Data::get('app_dependencies', array());
            if (!empty($dependencies[$module])) {
                foreach ($dependencies[$module] as $application => $dependence) {
                    static::load($application);
                }
            }
        }
        return $loaded;
    }

    public static function exists($module)
    {
        if ($module == 'admin') {
            return false;
        }
        $exists = static::loaded($module) ? static::$modules[$module] : parent::exists($module);

        if (!$exists) {
            // Application folder does not exists
            $application = \Nos\Application::forge($module);
            // But metadata exists, so the folder was deleted
            if ($application->is_installed()) {
                // Try to cleanup the cached metadata
                try {
                    $application->uninstall();
                } catch (\FileAccessException $e) {
                    \Log::exception($e, 'Unable to automatically the '.$module.' application - ');
                }
            }
        }

        return $exists;
    }

    /**
     * Returns the module name which a file belongs to. This only works for already loaded modules.
     *
     * @param   $path         Canonical path to guess the module from
     * @return  string|false  The module name or false if not found
     */
    public static function findFromCanonicalPath($path)
    {
        foreach (static::$modulesCanonical as $module => $canonicalPath) {
            if (\Str::sub($path, 0, \Str::length($canonicalPath)) === $canonicalPath) {
                // Framework use "nos" as application name
                if ($module === 'framework') {
                    return 'nos';
                }
                return $module;
            }
        }
        return false;
    }
}
