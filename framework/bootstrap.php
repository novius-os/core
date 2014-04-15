<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

// For previous versions of PHP 5.3.6
if (!defined('DEBUG_BACKTRACE_IGNORE_ARGS')) {
    define('DEBUG_BACKTRACE_IGNORE_ARGS', false);
}

// Get the start time and memory for use later
defined('FUEL_START_TIME') or define('FUEL_START_TIME', microtime(true));
defined('FUEL_START_MEM') or define('FUEL_START_MEM', memory_get_usage());

// Setup dir constants
if (isset($_SERVER['NOS_ROOT'])) {
    define('NOSROOT', $_SERVER['NOS_ROOT'].DIRECTORY_SEPARATOR);
} else {
    define('NOSROOT', realpath(__DIR__.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR);
}
// Setup public diretory name
defined('PUBLIC_DIR') or define('PUBLIC_DIR', 'public');
define('DOCROOT', NOSROOT.PUBLIC_DIR.DIRECTORY_SEPARATOR);

define('APPPATH', NOSROOT.'local'.DIRECTORY_SEPARATOR);
define('PKGPATH', NOSROOT.'novius-os'.DIRECTORY_SEPARATOR.'packages'.DIRECTORY_SEPARATOR);
define('COREPATH', NOSROOT.'novius-os'.DIRECTORY_SEPARATOR.'fuel-core'.DIRECTORY_SEPARATOR);
define('NOSPATH', NOSROOT.'novius-os'.DIRECTORY_SEPARATOR.'framework'.DIRECTORY_SEPARATOR);
define('VENDORPATH', NOSROOT.'novius-os'.DIRECTORY_SEPARATOR.'vendor'.DIRECTORY_SEPARATOR);



define('FUEL_EXTEND_PATH', NOSPATH.'classes'.DIRECTORY_SEPARATOR.'fuel'.DIRECTORY_SEPARATOR);

define('OS_WIN', defined('PHP_WINDOWS_VERSION_PLATFORM'));

// Load in the Autoloader
require FUEL_EXTEND_PATH.'autoloader.php';
//class_alias('Fuel\\Core\\Autoloader', 'Autoloader');

// Bootstrap the framework DO NOT edit this
require_once COREPATH.'bootstrap.php';
if (!MBSTRING) {
    require_once NOSPATH.'mb_string.php';
}

\Autoloader::add_classes(
    array(
        // Add classes you want to override here
        // Example: 'View' => APPPATH.'classes/view.php',
        'Arr' => FUEL_EXTEND_PATH.'arr.php',
        'Command' => FUEL_EXTEND_PATH.'oil'.DIRECTORY_SEPARATOR.'command.php',
        'Config' => FUEL_EXTEND_PATH.'config.php',
        'Config_File' => FUEL_EXTEND_PATH.'config_file.php',
        'Config_Php' => FUEL_EXTEND_PATH.'config'.DIRECTORY_SEPARATOR.'php.php',
        'Cache_Storage_File' => FUEL_EXTEND_PATH.'cache'.DIRECTORY_SEPARATOR.'storage'.DIRECTORY_SEPARATOR.'file.php',
        'Date' => FUEL_EXTEND_PATH.'date.php',
        'Debug' => FUEL_EXTEND_PATH.'debug.php',
        'Event_Instance' => FUEL_EXTEND_PATH.'event/instance.php',
        'Email' => FUEL_EXTEND_PATH.'email.php',
        'Email_Driver' => FUEL_EXTEND_PATH.'email'.DIRECTORY_SEPARATOR.'driver.php',
        'Fuel' => FUEL_EXTEND_PATH.'fuel.php',
        'File' => FUEL_EXTEND_PATH.'file.php',
        'Finder' => FUEL_EXTEND_PATH.'finder.php',
        'Fieldset' => FUEL_EXTEND_PATH.'fieldset.php',
        'Fieldset_Field' => FUEL_EXTEND_PATH.'fieldset_field.php',
        'Generate' => FUEL_EXTEND_PATH.'oil'.DIRECTORY_SEPARATOR.'generate.php',
        'Image' => FUEL_EXTEND_PATH.'image.php',
        'Image_Driver' => FUEL_EXTEND_PATH.'image'.DIRECTORY_SEPARATOR.'driver.php',
        'Image_Noop' => FUEL_EXTEND_PATH.'image'.DIRECTORY_SEPARATOR.'noop.php',
        'Log' => FUEL_EXTEND_PATH.'log.php',
        'Migrate' => FUEL_EXTEND_PATH.'migrate.php',
        'Module' => FUEL_EXTEND_PATH.'module.php',
        'ModuleNotFoundException' => FUEL_EXTEND_PATH.'module.php',
        'Profiler' => FUEL_EXTEND_PATH.'profiler.php',
        'Refine' => FUEL_EXTEND_PATH.'oil'.DIRECTORY_SEPARATOR.'refine.php',
        'Response' => FUEL_EXTEND_PATH.'response.php',
        'Security' => FUEL_EXTEND_PATH.'security.php',
        'Session' => FUEL_EXTEND_PATH.'session.php',
        'Session_File' => FUEL_EXTEND_PATH.'session'.DIRECTORY_SEPARATOR.'file.php',
        'Str' => FUEL_EXTEND_PATH.'str.php',
        'Validation_Error'  => FUEL_EXTEND_PATH.'validation_error.php',
        'View' => FUEL_EXTEND_PATH.'view.php',
        'Nos\Oil\Console' => FUEL_EXTEND_PATH.'oil'.DIRECTORY_SEPARATOR.'console.php',
        'Nos\Orm\Model' => FUEL_EXTEND_PATH.'orm'.DIRECTORY_SEPARATOR.'model.php',
        'Nos\Orm\Query' => FUEL_EXTEND_PATH.'orm'.DIRECTORY_SEPARATOR.'query.php',
        'Nos\Tasks\Migrate' => FUEL_EXTEND_PATH.'tasks'.DIRECTORY_SEPARATOR.'migrate.php',
    )
);

/**
 * Retrieves a translation from the last loaded dictionary.
 *
 * @param string $message The message to translate.
 * @param string $default The default text to return when the message is not found. Default value is the message itself.
 * @return mixed|string The translation or ``null`` if not founded
 */
function __($message, $default = null)
{
    $dbg = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
    $i = -1;
    do {
        $function = $dbg[++$i]['function'];
    } while ($function == '{closure}');

    return \Nos\I18n::translate_from_file($dbg[$i]['file'], $message, $default);
}

/**
 * The plural version of __(). Some languages have more than one form for plural messages dependent on the count.
 *
 * @param string $singular The singular form of the string to be converted. Used as the key for the search in the dictionary
 * @param string $plural The plural form
 * @param bool|int $n Used to determine which plural form to used depending locale.
 * @return array|string The translation or, if not founded, $singular is returned if n == 1, otherwise $plural
 *                      If third parameter is ommited and translation founded, return an ``array`` of singular and plural forms
 */
function n__($singular, $plural, $n = false)
{
    $dbg = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
    $i = -1;
    do {
        $function = $dbg[++$i]['function'];
    } while ($function == '{closure}');

    if ($n === false) {
        $return = \Nos\I18n::translate_from_file($dbg[$i]['file'], $singular, $singular);
        if (!is_array($return)) {
            return array(
                $singular,
                $plural,
            );
        }
        return $return;
    } else {
        return \Nos\I18n::nTranslateFromFile($dbg[$i]['file'], $singular, $plural, $n);
    }
}

/**
 * Retrieves a translation from a specific dictionary.
 *
 * @param string $group Which dictionary to look into.
 * @param string $message The message to translate.
 * @param string $default The default text to return when the message is not found. Default value is the message itself.
 * @return mixed|string The translation or ``null`` if not founded
 */
function ___($group, $message, $default = null)
{
    return \Nos\I18n::gget($group, $message, $default);
}

// Register the autoloader
Autoloader::register();

if (!defined('NOS_ENTRY_POINT')) {
    define('NOS_ENTRY_POINT', 'front');
}

/**
 * Your environment.  Can be set to any of the following:
 *
 * Fuel::DEVELOPMENT
 * Fuel::TEST
 * Fuel::STAGE
 * Fuel::PRODUCTION
 */
Fuel::$env = (isset($_SERVER['NOS_ENV']) ? $_SERVER['NOS_ENV'] : (isset($_SERVER['FUEL_ENV']) ? $_SERVER['FUEL_ENV'] : Fuel::DEVELOPMENT));

//* Register application autoloader
spl_autoload_register(
    function ($class) {
        $class_alias = \Autoloader::getClassAliases($class);
        if ($class_alias !== false) {
            class_alias($class_alias, $class);
            return true;
        }

        $class = ltrim($class, '\\');
        $parts = explode('\\', $class);
        $class = array_pop($parts);
        $namespace = implode('\\', $parts);

        // We can't load classes inside those namespaces
        if ($namespace == '' || $namespace == 'Fuel\\Core') {
            return false;
        }

        // Computes this after the above lines, as the Inflector class will be autoloaded
        $namespace_upper_words = Inflector::words_to_upper($namespace);

        // An application can be put inside any namespace when properly configured
        if (!empty(Fuel::$namespace_aliases[$namespace_upper_words])) {
            if (class_exists(Fuel::$namespace_aliases[$namespace_upper_words].'\\'.$class)) {
                class_alias(Fuel::$namespace_aliases[$namespace_upper_words].'\\'.$class, $namespace.'\\'.$class);
            }
            if (class_exists($namespace.'\\'.$class, false)) {
                return true;
            }
        }

        // Try to load the application
        // Not use \Nos\Config_Data, not yet defined
        \Config::load(APPPATH.'metadata/app_namespaces.php', 'data::app_namespaces');
        $namespaces = \Config::get('data::app_namespaces');
        $application = array_search($namespace, $namespaces);
        if (false !== $application) {
            \Module::load($application);
        }

        return false;
    },
    true,
    true
);
//*/

\Autoloader::addClassAlias('Nos\\Task');
// Initialize the framework with the config file.
$config_nos = include(NOSPATH.'config/config.php');

$config_app = @include(APPPATH.'config/config.php');
if ($config_app === false) {
    $config_app = array();
}
if (!empty($config_app['base_url'])) {
    define('NOS_RELATIVE_DIR', ltrim(parse_url($config_app['base_url'], PHP_URL_PATH), '/'));
}

Fuel::init(Arr::merge($config_nos, $config_app));

Module::load('nos', NOSPATH);
Module::load('local', APPPATH);

Config::load('namespaces', true);

foreach (Config::get('namespaces', array()) as $ns => $path) {
    Autoloader::add_namespace($ns, APPPATH.'..'.DS.$path.'classes'.DS);
}

chdir(DOCROOT);

// Remove leading /
$_SERVER['NOS_URL'] = mb_substr(urldecode($_SERVER['REQUEST_URI']), 1);
if (defined('NOS_RELATIVE_DIR')) {
    $_SERVER['NOS_URL'] = mb_substr($_SERVER['NOS_URL'], mb_strlen(NOS_RELATIVE_DIR));
}
list($_SERVER['NOS_URL']) = explode('?', $_SERVER['NOS_URL']);
