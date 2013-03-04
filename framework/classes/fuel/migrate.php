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

    public static function set_table($table) {
        static::$table = $table;
    }

}
