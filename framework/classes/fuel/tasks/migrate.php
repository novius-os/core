<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Tasks;

/**
 * migrate task
 *
 * use this command line task to deploy and rollback changes
 */
class Migrate extends \Fuel\Tasks\Migrate
{
    /**
     * sets the properties by grabbing Cli options
     */
    public function __construct()
    {
        parent::__construct();
        if (count(glob(NOSPATH.\Config::get('migrations.folder').'/*.php')))
        {
            static::$packages[] = 'nos';
        }

        // set the module and package count
        static::$package_count = count(static::$packages);
    }

    /**
     * migrates to the latest version unless -version is specified
     *
     * @param string	name of the type (in case of app, it's 'default')
     * @param string	type (app, module or package)
     * @param string	direction of migration (up or down)
     */
    protected static function _run($name, $type)
    {
        // -v or --version
        $version = \Cli::option('v', \Cli::option('version', ''));

        // version is used as a flag, so show it
        if ($version === true)
        {
            \Cli::write('Currently installed migrations for '.$type.':'.$name.':', 'green');

            foreach (\Config::get('migrations.version.'.$type.'.'.$name, array()) as $version)
            {
                \Cli::write('- '.$version);
            }
            return;
        }

        // version contains a timestamp of sorts
        elseif ($version !== '')
        {
            // if version has a value, make sure only 1 item was passed
            if (static::$default + static::$module_count + static::$package_count > 1)
            {
                \Cli::write('Migration: version only excepts 1 item.');
                return;
            }
            $migrations = \Migrate::version($version, $name, $type);
        }

        // migrate to the latest version
        else
        {
            $migrations = \Migrate::latest($name, $type);
        }

        // any migrations executed?
        if ($migrations)
        {
            \Cli::write('Performed migrations for '.$type.':'.$name.':', 'green');

            foreach ($migrations as $migration)
            {
                \Cli::write($migration);
            }
        }
        else
        {
            if ($version !== '')
            {
                \Cli::write('No migrations were found for '.$type.':'.$name.'.');
            }
            else
            {
                \Cli::write('Already on the latest migration for '.$type.':'.$name.'.');
            }
        }
    }

    /**
     * migrates item to current config version
     *
     * @param string	name of the type (in case of app, it's 'default')
     * @param string	type (app, module or package)
     */
    protected static function _current($name, $type)
    {
        // -v or --version
        if (\Cli::option('v', \Cli::option('version', '')) !== '')
        {
            \Cli::write('You can not define a version when using the "current" command.', 'red');
        }

        $migrations = \Migrate::current($name, $type);

        if ($migrations)
        {
            \Cli::write('Newly installed migrations for '.$type.':'.$name.':', 'green');
            foreach ($migrations as $migration)
            {
                \Cli::write('- '.$migration);
            }
        }
        else
        {
            // migration is already on current version
            \Cli::write('Already on the current migration version for '.$type.':'.$name.'.');
        }
    }

    /**
     * migrates item up to the given version
     *
     * @param string
     * @param string
     */
    protected static function _up($name, $type)
    {
        // -v or --version
        $version = \Cli::option('v', \Cli::option('version', null));

        // if version has a value, make sure only 1 item was passed
        if ($version and (static::$default + static::$module_count + static::$package_count > 1))
        {
            \Cli::write('Migration: version only excepts 1 item.');
            return;
        }

        $migrations = \Migrate::up($version, $name, $type);

        if ($migrations)
        {
            \Cli::write('Newly installed migrations for '.$type.':'.$name.':', 'green');
            foreach ($migrations as $migration)
            {
                \Cli::write('- '.$migration);
            }
        }
        else
        {
            // there is no 'up'...
            \Cli::write('You are already on the latest migration version for '.$type.':'.$name.'.');
        }
    }

    /**
     * migrates item down to the given version
     *
     * @param string
     * @param string
     */
    protected static function _down($name, $type)
    {
        // -v or --version
        $version = \Cli::option('v', \Cli::option('version', null));

        // if version has a value, make sure only 1 item was passed
        if ($version and (static::$default + static::$module_count + static::$package_count > 1))
        {
            \Cli::write('Migration: version only excepts 1 item.');
            return;
        }

        $migrations = \Migrate::down($version, $name, $type);

        if ($migrations)
        {
            \Cli::write('Reverted migrations for '.$type.':'.$name.':', 'green');
            foreach ($migrations as $migration)
            {
                \Cli::write('- '.$migration);
            }
        }
        else
        {
            // there is no 'down'...
            \Cli::write('You are already on the first migration for '.$type.':'.$name.'.');
        }
    }

}
