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

    protected static function find_migrations($name, $type, $start = null, $end = null, $direction = 'up')
    {
        static::generate_prefix($name, $type);
        return parent::find_migrations($name, $type, $start, $end, $direction);
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

            // <<<<<<<<<<<<<<<<<<< CHANGE ARE HERE
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

}
