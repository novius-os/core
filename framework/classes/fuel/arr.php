<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Arr extends Fuel\Core\Arr
{
    public static function recursive_filter($array, $callback = null)
    {
        foreach ($array as $key => & $value) {
            if (is_array($value)) {
                $value = static::recursive_filter($value, $callback);
            } else {
                if (!is_null($callback)) {
                    if (!$callback($value)) {
                        unset($array[$key]);
                    }
                } else {
                    if (!(bool) $value) {
                        unset($array[$key]);
                    }
                }
            }
        }
        unset($value);

        return $array;
    }
}
