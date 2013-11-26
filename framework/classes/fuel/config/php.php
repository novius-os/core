<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Config_Php extends \Fuel\Core\Config_Php
{
    protected static $loaded = array();
    protected static $opcache_invalidate = null;
    protected static $apc_delete_file = null;

    /**
     * Loads in the given file and parses it.
     *
     * @param   string  $file  File to load
     * @return  array
     */
    protected function load_file($file)
    {
        if (static::$opcache_invalidate === null) {
            static::$opcache_invalidate = PHP_VERSION_ID >= 50500 && function_exists('opcache_invalidate');
        }
        if (static::$apc_delete_file === null) {
            static::$apc_delete_file = function_exists('apc_delete_file');
        }

        if (static::$apc_delete_file || static::$opcache_invalidate) {
            if (in_array($file, static::$loaded)) {
                static::$opcache_invalidate && opcache_invalidate($file, true);
                static::$apc_delete_file && apc_delete_file($file);
            }
            static::$loaded[] = $file;
        }

        return \Fuel::load($file);
    }
}
