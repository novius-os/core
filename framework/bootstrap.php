<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

// Load in the Autoloader
require COREPATH.'classes'.DIRECTORY_SEPARATOR.'autoloader.php';
class_alias('Fuel\\Core\\Autoloader', 'Autoloader');

// Bootstrap the framework DO NOT edit this
require_once COREPATH.'bootstrap.php';
if (!MBSTRING) {
	require_once NOSPATH.'mb_string.php';
}


\Autoloader::add_classes(array(
	// Add classes you want to override here
	// Example: 'View' => APPPATH.'classes/view.php',
	'Date'              => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'date.php',
    'Config'            => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'config.php',
    'Session'           => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'session.php',
	'Fuel'              => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'fuel.php',
	'Finder'            => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'finder.php',
	'Fieldset'          => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'fieldset.php',
	'Fieldset_Field'    => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'fieldset_field.php',
	'Response'          => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'response.php',
	'Module'            => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'module.php',
	'ModuleNotFoundException' => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'module.php',
	'Arr'               => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'arr.php',
    'Generate'          => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'oil'.DIRECTORY_SEPARATOR.'generate.php',
    'Command'           => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'oil'.DIRECTORY_SEPARATOR.'command.php',
    'Nos\Oil\Console'   => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'oil'.DIRECTORY_SEPARATOR.'console.php',
    'Refine'            => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'oil'.DIRECTORY_SEPARATOR.'refine.php',
    'Nos\Tasks\Migrate' => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'tasks'.DIRECTORY_SEPARATOR.'migrate.php',
    'Migrate'           => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'migrate.php',
    'Nos\Orm\Query'     => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'orm'.DIRECTORY_SEPARATOR.'query.php',
	'Nos\Orm\Model'     => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'orm'.DIRECTORY_SEPARATOR.'model.php',
    'Str'               => NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR.'str.php',
));

function __($_message, $default = null)
{
    return \Nos\I18n::get($_message, $default);
}

// Register the autoloader
Autoloader::register();

/**
 * Your environment.  Can be set to any of the following:
 *
 * Fuel::DEVELOPMENT
 * Fuel::TEST
 * Fuel::STAGE
 * Fuel::PRODUCTION
 */
if (\Input::server('SERVER_NAME') == 'os1.novius.fr') {
	$_SERVER['FUEL_ENV'] = Fuel::STAGE;
}
Fuel::$env = (isset($_SERVER['FUEL_ENV']) ? $_SERVER['FUEL_ENV'] : Fuel::DEVELOPMENT);

//* Register application autoloader
spl_autoload_register(function($class) {
	$class = ltrim($class, '\\');
	list($application, $whatever) = explode('\\', $class.'\\');
	// can not use Inflector::words_to_upper because is not loaded
	$application = explode('_', $application);
	foreach ($application as &$part) {
		$part = ucfirst($part);
	}
	$application = implode('_', $application);

	// An application can be put inside any namespace when properly configured
	if (!empty(Fuel::$namespace_aliases[$application])) {
		if (class_exists(Fuel::$namespace_aliases[$application].'\\'.$whatever)) {
			class_alias(Fuel::$namespace_aliases[$application].'\\'.$whatever, $class);
		}
		if (class_exists($class, false)) {
			return true;
		}
	}
	return false;
}, true, true);
//*/

// Initialize the framework with the config file.
$config_novius = include(NOSPATH.'config/config.php');
$routes_novius = include(NOSPATH.'config/routes.php');
$config_app    = include(APPPATH.'config/config.php');

Fuel::init(Arr::merge($config_novius, array('routes' => $routes_novius), $config_app));

Module::load('nos', NOSPATH);

define('URL_ADMIN', Uri::base(false).'admin/');
define('PHP_BEGIN', '<?php ');
define('PHP_END', ' ?>');
Module::load('local', APPPATH);

//Autoloader::add_namespace('Nos', NOSPATH.'classes'.DS);
//Autoloader::add_namespace('Local', APPPATH.'classes'.DS);

Config::load('namespaces', true);

foreach (Config::get('namespaces', array()) as $ns => $path) {
	Autoloader::add_namespace($ns, APPPATH.'..'.DS.$path.'classes'.DS);
}

chdir(DOCROOT);

define('CACHE_DURATION_PAGE',     5);
define('CACHE_DURATION_FUNCTION', 10);
