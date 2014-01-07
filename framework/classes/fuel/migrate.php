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
    protected static $table = 'nos_migration';

    public static function _init()
    {
        static::$table_definition = array(
            'id'                => array('type' => 'int', 'auto_increment' => true, 'primary_key' => true),
            'type'              => array('type' => 'varchar', 'constraint' => 25),
            'name'              => array('type' => 'varchar', 'constraint' => 50),
            'migration'         => array('type' => 'varchar', 'constraint' => 100, 'null' => false, 'default' => ''),
            'execution_date'    => array('type' => 'timestamp', 'default' => \DB::expr('CURRENT_TIMESTAMP'), 'null' => true),
        );

        if (!\Config::get('novius-os.migration_config_file')) {
            \Config::load('migrations', true);
            \Config::set('migrations.version', array());
            \Config::set('migrations.table', 'nos_migration');
        }
        parent::_init();
    }

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
        if (static::generateNamespace($name, $type)) {
            return parent::find_migrations($name, $type, $start, $end, $direction);
        } else {
            return array();
        }
    }

    // Overloaded function in order to support \Nos\Migration
    protected static function run($migrations, $name, $type, $method = 'up')
    {
        if (!static::generateNamespace($name, $type)) {
            return array();
        }
        // storage for installed migrations
        $done = array();

        static::$connection === null or \DBUtil::set_connection(static::$connection);

        // Loop through the runnable migrations and run them
        foreach ($migrations as $ver => $migration) {
            logger(Fuel::L_INFO, 'Migrating to version: '.$ver);

            // <<<<<<<<<<<<<<<<<<< CHANGES ARE HERE
            $migration_inst = new $migration['class']($migration['path']);
            try {
                $result = $migration_inst->$method();
            } catch (\Exception $e) {
                $ignore = false;
                $result = true;
                \Event::trigger_function('migrate.exception', array($e, &$ignore, $migration));
                if (!$ignore) {
                    throw $e;
                }
            }
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

    protected static function generateNamespace($name, $type)
    {
        $prefix = \Autoloader::generateSuffixedNamespace($name, $type, 'Migrations');
        if (!$prefix) {
            return false;
        }
        static::$prefix = $prefix;
        return true;
    }

    public static function isLastVersion($name, $type)
    {
        if ($type == 'module') {
            $namespace = \Nos\Config_Data::get('app_installed.'.$name.'.namespace', null);
            if ($namespace === null) {
                return true; // Application doesn't have any namespace, so probably no migration files.
            }
        }

        $current = \Config::get('migrations.version.'.$type.'.'.$name);
        if (is_array($current)) {
            $current = count($current) == 0? null : $current[count($current) - 1];
        }

        $migrations = static::find_migrations($name, $type, $current, null);
        return count($migrations) == 0;
    }

    public static function executedMigrations()
    {
        return static::$migrations;
    }
}
