<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class ModuleNotFoundException extends \FuelException { }

class Module extends Fuel\Core\Module
{
	public static function load($module, $path = null)
	{
		$loaded = parent::load($module, $path);
		if ($loaded) {
			$path = static::$modules[$module];

			// Load the config (namespace + dependencies)
			$metadata = Config::get("app_installed.$module.metadata", array());

			if (!empty($metadata['namespace'])) {
				Autoloader::add_namespaces(array(
					$metadata['namespace'] => $path.'classes'.DS,
				), true);
				// Allow autoloading from bootstrap to alias classes from this namespace
				Fuel::$namespace_aliases[Inflector::words_to_upper($module)] = $metadata['namespace'];
			}

			// Load the bootstrap if it exists
			if ($module !== 'nos' && is_file($path.'bootstrap.php')) {
				Fuel::load($path.'bootstrap.php');
			}

			// Load dependent applications
			Config::load(APPPATH.'data'.DS.'config'.DS.'app_dependencies.php', true);
			$dependencies = Config::get('app_dependencies', array());
			if (!empty($dependencies[$module])) {
				foreach ($dependencies[$module] as $module) {
					static::load($module);
				}
			}
		}
		return $loaded;
	}

	public static function exists($module)
	{
		if (static::loaded($module)) {
			return static::$modules[$module];
		}

		return parent::exists($module);
	}
}
