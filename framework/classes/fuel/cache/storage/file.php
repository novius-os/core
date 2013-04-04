<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Cache_Storage_File extends \Fuel\Core\Cache_Storage_File
{
    public function __construct($identifier, $config)
    {
        try {
            parent::__construct($identifier, $config);
        } catch (\FuelException $e) {
            if (!is_dir(static::$path)) {
                if (!@mkdir(static::$path, 0755, true)) {
                    throw $e;
                }
            }
        }
    }
}
