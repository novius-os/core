<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class File extends Fuel\Core\File
{
    public static function symlink($target, $link, $is_directory = null)
    {
        $link = static::validOSPath($link, DS);
        if ($is_directory === null) {
            // directory doesn't necessary exists so is_dir is irrelevant
            $is_directory = pathinfo($target, PATHINFO_EXTENSION) === '';
        }
        if (!defined('PHP_WINDOWS_VERSION_PLATFORM')) {
            return symlink($target, $link);
        } else {
            $command = 'mklink ';
            if ($is_directory) {
                $command .= '/D ';
            }
            $command .= escapeshellarg($link).' '.escapeshellarg($target);
            \exec($command);
            return true;
        }
    }

    public static function is_link($filename)
    {
        $filename = static::validOSPath($filename);
        if (!defined('PHP_WINDOWS_VERSION_PLATFORM')) {
            return is_link($filename);
        } else {
            return is_file($filename) || is_dir($filename); // @todo: search for is_link equivalent ?
        }
    }

    public static function validOSPath($path, $default = DS)
    {
        return str_replace(array('/', '\\'), array($default, $default), $path);
    }
}
