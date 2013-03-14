<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

/**
 * Migrate Class
 *
 * @package		Fuel
 * @category	Migrations
 * @link		http://docs.fuelphp.com/classes/migrate.html
 */
class Migrate extends \Fuel\Core\Migrate
{
    /**
     * finds migrations for the given package (or all if name is not given)
     *
     * @param   string	name of the package
     *
     * @return array
     */
    protected static function _find_package($name = null)
    {
        $files = parent::_find_package();
        if ($name) {
            if ($name == 'nos') {
                // find a package
                $files = glob(NOSPATH.\Config::get('migrations.folder').'*_*.php');
            }
        } else {
            // find all modules
            $files = array_merge($files, glob(NOSPATH.\Config::get('migrations.folder').'*_*.php'));
        }

        return $files;
    }

    public static function set_table($table)
    {
        static::$table = $table;
    }

    // change migration prefix and changed include to include_once in order to prevent duplicate classes errors
    protected static function find_migrations($name, $type, $start = null, $end = null, $direction = 'up')
    {
        // <<<<<<<<<<<<<<<<<<< CHANGES ARE HERE
        static::generate_prefix($name, $type);
        // >>>>>>>>>>>>>>>>>>>

        // Load all *_*.php files in the migrations path
        $method = '_find_'.$type;
        if ( ! $files = static::$method($name)) {
            return array();
        }

        // get the currently installed migrations from the DB
        $current = \Arr::get(static::$migrations, $type.'.'.$name, array());

        // storage for the result
        $migrations = array();

        // normalize start and end values
        if ( ! is_null($start)) {
            // if we have a prefix, use that
            ($pos = strpos($start, '_')) === false or $start = ltrim(substr($start, 0, $pos), '0');
            is_numeric($start) and $start = (int) $start;
        }
        if ( ! is_null($end)) {
            // if we have a prefix, use that
            ($pos = strpos($end, '_')) === false or $end = ltrim(substr($end, 0, $pos), '0');
            is_numeric($end) and $end = (int) $end;
        }

        // filter the migrations out of bounds
        foreach ($files as $file) {
            // get the version for this migration and normalize it
            $migration = basename($file);
            ($pos = strpos($migration, '_')) === false or $migration = ltrim(substr($migration, 0, $pos), '0');
            is_numeric($migration) and $migration = (int) $migration;

            // add the file to the migrations list if it's in between version bounds
            if ((is_null($start) or $migration > $start) and (is_null($end) or $migration <= $end)) {
                // see if it is already installed
                if ( in_array(basename($file, '.php'), $current)) {
                    // already installed. store it only if we're going down
                    $direction == 'down' and $migrations[$migration] = array('path' => $file);
                } else {
                    // not installed yet. store it only if we're going up
                    $direction == 'up' and $migrations[$migration] = array('path' => $file);
                }
            }
        }

        // We now prepare to actually DO the migrations
        // But first let's make sure that everything is the way it should be
        foreach ($migrations as $ver => $migration) {
            // get the migration filename from the path
            $migration['file'] = basename($migration['path']);

            // make sure the migration filename has a valid format
            if (preg_match('/^.*?_(.*).php$/', $migration['file'], $match)) {
                // determine the classname for this migration
                $class_name = ucfirst(strtolower($match[1]));

                // load the file and determiine the classname

                // <<<<<<<<<<<<<<<<<<< CHANGES ARE HERE
                include_once $migration['path'];
                // >>>>>>>>>>>>>>>>>>>

                $class = static::$prefix.$class_name;

                // make sure it exists in the migration file loaded
                if ( ! class_exists($class, false)) {
                    throw new FuelException(sprintf('Migration "%s" does not contain expected class "%s"', $migration['path'], $class));
                }

                // and that it contains an "up" and "down" method
                if ( ! is_callable(array($class, 'up')) or ! is_callable(array($class, 'down'))) {
                    throw new FuelException(sprintf('Migration class "%s" must include public methods "up" and "down"', $name));
                }

                $migrations[$ver]['class'] = $class;
            } else {
                throw new FuelException(sprintf('Invalid Migration filename "%s"', $migration['path']));
            }
        }

        // make sure the result is sorted properly with all version types
        uksort($migrations, 'strnatcasecmp');

        return $migrations;
    }

    // Overloaded function in order to support \Nos\Migration
    protected static function run($migrations, $name, $type, $method = 'up')
    {
        static::generate_prefix($name, $type);
        // storage for installed migrations
        $done = array();

        static::$connection === null or \DBUtil::set_connection(static::$connection);

        // Loop through the runnable migrations and run them
        foreach ($migrations as $ver => $migration) {
            logger(Fuel::L_INFO, 'Migrating to version: '.$ver);

            // <<<<<<<<<<<<<<<<<<< CHANGES ARE HERE
            $migration_inst = new $migration['class']($migration['path']);
            $result = $migration_inst->$method();
            // >>>>>>>>>>>>>>>>>>>
            if ($result === false) {
                logger(Fuel::L_INFO, 'Skipped migration to '.$ver.'.');
                return $done;
            }

            $file = basename($migration['path'], '.php');
            $method == 'up' ? static::write_install($name, $type, $file) : static::write_revert($name, $type, $file);
            $done[] = $file;
        }

        static::$connection === null or \DBUtil::set_connection(null);

        empty($done) or logger(Fuel::L_INFO, 'Migrated to '.$ver.' successfully.');

        return $done;
    }

    protected static function generate_prefix($name, $type)
    {
        if ($name == 'nos' && $type == 'package') {
            static::$prefix = 'Nos\\Migrations\\';
        } else if ($type == 'module') {
            $namespaces = \Nos\Config_Data::get('app_namespaces', null);
            static::$prefix = $namespaces[$name].'\\Migrations\\';
        } else {
            static::$prefix = 'Fuel\\Migrations\\';
        }
    }

    public static function is_last_version($name, $type)
    {
        if ($type == 'module') {
            $namespace = \Nos\Config_Data::get('app_namespaces.'.$name, null);
            if ($namespace === null) {
                return false; // Namespace isn't registered, so probably not on last version.
            }
        }
        $current = \Config::get('migrations.version.'.$type.'.'.$name);
        if (is_array($current)) {
            $current = count($current) == 0? null : $current[count($current) - 1];
        }

        $migrations = static::find_migrations($name, $type, $current, null);
        return count($migrations) == 0;
    }

}
