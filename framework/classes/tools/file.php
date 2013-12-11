<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos;

class Tools_File
{
    public static $use_xsendfile = null;
    public static $xsendfile_header = 'X-Sendfile';

    public static function _init()
    {
        static::$use_xsendfile = \Config::get('novius-os.use_xsendfile', null);
        if (null === static::$use_xsendfile) {
            // No config defined: auto detection
            static::$use_xsendfile = self::xsendfile_available();
        } elseif (is_string(static::$use_xsendfile)) {
            static::$xsendfile_header = static::$use_xsendfile;
            static::$use_xsendfile = true;
        }

        // Check availability
        if (static::$use_xsendfile && !static::xsendfile_available()) {
            \Fuel::$profiling && \Profiler::console('X-Sendfile enabled but not available on your installation.');
        } elseif (!static::$use_xsendfile && static::xsendfile_available()) {
            \Fuel::$profiling && \Profiler::console('X-Sendfile available on your installation but not enabled.');
        }
    }

    public static function xsendfile_available()
    {
        // On Apache
        if (function_exists('apache_get_modules') && in_array('mod_xsendfile', apache_get_modules())) {
            // Doesn't mean it's configured properly but it's available
            // We consider that if it has benn installed, then it's also been configured
            return true;
        }

        // @todo Check xsendfile availability on others web servers (nginx, lighthttpd, etc.)
        return false;
    }

    /**
     *
     * @param  string $from Absolute path of first folder
     * @param  string $to   Absolute path of second folder
     * @param  string $ds   Directory separator
     * @return string Resulting relative path. Possible value: '../../my/folder'
     */
    public static function relativePath($from, $to, $ds = DIRECTORY_SEPARATOR)
    {
        $from = \File::validOSPath($from);
        $to = \File::validOSPath($to);

        $arFrom = explode($ds, rtrim($from, $ds));
        $arTo = explode($ds, rtrim($to, $ds));
        $similar = 0;

        while (isset($arFrom[$similar]) && isset($arTo[$similar]) && ($arFrom[$similar] == $arTo[$similar])) {
            $similar++;
        }
        $arFrom = array_slice($arFrom, $similar);
        $arTo = array_slice($arTo, $similar);

        return str_repeat('..'.$ds, count($arFrom)).implode($ds, $arTo);
    }

    /**
     * Strip out "../" in a path
     * simplifyPath('number1/number2/../') == 'number1/'
     *
     * @param  string $path
     * @return string The simplified path
     */
    public static function simplifyPath($path)
    {
        $parts = explode(DS, $path);
        $path = array();
        foreach ($parts as $part) {
            if ('.' == $part) {
                continue;
            }
            if ('..' == $part) {
                array_pop($path);
            } else {
                $path[] = $part;
            }
        }

        return implode(DS, $path);
    }

    /**
     * Workaround for native realpath(), which has difficulties with '../' in
     * the middle of a path, such as "my/folder/../example"
     *
     * @param  string $path
     * @return string @see realpath()
     */
    public static function realpath($path)
    {
        return realpath(static::simplifyPath($path));
    }

    /**
     *
     * @param string $file Absolute path to local file
     * @param string $mime Mime type. Default = null (automatic)
     * @param bool   $exit Should we exit? Default = true
     */
    public static function send($file, $mime = null, $exit = true)
    {
        $function = function () use ($file, $mime) {
            $file = realpath($file);

            if (is_file($file)) {
                // Send Content-Type
                if ($mime === null) {
                    $mime = Tools_File::content_type($file);
                }

                while (ob_get_level() > 0) {
                    ob_end_clean();
                }

                ini_get('zlib.output_compression') and ini_set('zlib.output_compression', 0);
                !ini_get('safe_mode') and set_time_limit(0);

                header('Content-Type: '.$mime);

                // Check whether the file is in the data directory
                $data_path = APPPATH.'data';
                $xsendfile_allowed = mb_substr($file, 0, mb_strlen($data_path)) == $data_path;

                // X-Sendfile is better when available
                if (Tools_File::$use_xsendfile and $xsendfile_allowed) {
                    header(Tools_File::$xsendfile_header.': '.$file);
                } else {
                    \File::download($file);
                }
            }
        };

        if ($exit) {
            \Event::register('fuel-shutdown', function () use ($function) {
                $function();
            });
            exit;
        } else {
            $function();
        }
    }

    /**
     * Determines the content type of a file
     *
     * @param  string $file Path on the file system
     * @return string The appropriate Content-type (eg. image/png)
     */
    public static function content_type($file)
    {
        // New way (default PHP 5.3)
        if (function_exists('finfo_file')) {
            $autocorrect = array(
                'image/x-ico' => 'image/x-icon',
            );
            $mime = finfo_file(finfo_open(FILEINFO_MIME_TYPE), $file);

            return \Arr::get($autocorrect, $mime, $mime);
        }
        // Old way
        return static::_content_type_fallback($file);
    }

    protected static function _content_type_fallback($file)
    {
        static $content_types = array(
            'pdf' => 'application/pdf',
            'exe' => 'application/octet-stream',
            'zip' => 'application/zip',
            'doc' => 'application/msword',
            'xls' => 'application/vnd.ms-excel',
            'ppt' => 'application/vnd.ms-powerpoint',
            'gif' => 'image/gif',
            'png' => 'image/png',
            'jpeg' => 'image/jpg',
            'jpg' => 'image/jpg',
            'mp3' => 'audio/mpeg',
            'wav' => 'audio/x-wav',
            'mpeg' => 'video/mpeg',
            'mpg' => 'video/mpeg',
            'mpe' => 'video/mpeg',
            'mov' => 'video/quicktime',
            'avi' => 'video/x-msvideo',
            'xml' => 'text/xml',
            'htm' => 'text/html',
            'html' => 'text/html',
            'txt' => 'text/plain',
            'ico' => 'image/x-icon',
        );
        $extension = pathinfo($file, PATHINFO_EXTENSION);

        return $content_types[$extension] ? : 'application/force-download';
    }
}
