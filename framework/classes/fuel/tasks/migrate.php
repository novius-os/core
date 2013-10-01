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
        if (count(glob(NOSPATH.\Config::get('migrations.folder').'/*.php'))) {
            static::$packages[] = 'nos';
        }

        // set the module and package count
        static::$package_count = count(static::$packages);
    }
}
