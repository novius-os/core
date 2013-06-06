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
    public static function relativeSymlink($target, $link)
    {
        $dirname = dirname($link);
        $relative = \Nos\Tools_File::relativePath($dirname, $target);

        return static::symlink($relative, $link) ? true : static::symlink($target, $link);
    }

    public static function symlink($target, $link, $is_file = null, $area = null)
    {
        $methods = array(
            function($target, $link, $is_file) {
                return symlink($target, $link);
            },
            function($target, $link, $is_file) {
                if (defined('PHP_WINDOWS_VERSION_PLATFORM')) {
                    return false;
                }
                $dirname = dirname($link);
                $basename = basename($link);
                exec('cd '.$dirname.'; ln -s '.$target.' '.$basename);
                return \File::is_link($link);
            },
            function($target, $link, $is_file) {
                if (!defined('PHP_WINDOWS_VERSION_PLATFORM')) {
                    return false;
                }
                $command = 'mklink ';
                if (!$is_file) {
                    $command .= '/D ';
                }
                $command .= escapeshellarg($link).' '.escapeshellarg($target);
                \exec($command);
                return \File::is_link($link);
            }
        );

        if ($is_file === null) {
            $is_file = !pathinfo($target, PATHINFO_EXTENSION) === '';
        }

        $target      = rtrim(static::instance($area)->get_path($target), '\\/');
        $link = rtrim(static::instance($area)->get_path($link), '\\/');

        $link = static::validOSPath($link, DS);

        foreach ($methods as $method) {
            if ($method($target, $link, $is_file)) {
                return true;
            }
        }

        return false;
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
