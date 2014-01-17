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
    protected static $opcache_invalidate = null;
    protected static $apc_compile_file = null;

    /**
     * Formats the output and saved it to disc.
     *
     * @param   $contents  $contents    config array to save
     * @return  bool File::update result
     */
    public function save($contents)
    {
        $file = $this->file;
        $return = parent::save($contents);

        // $file != $this->file only if file doesn't exist before save
        // so not in opcode cache
        if ($return && $file == $this->file) {
            if (static::$opcache_invalidate === null) {
                static::$opcache_invalidate = PHP_VERSION_ID >= 50500 && function_exists('opcache_invalidate');
            }
            if (static::$apc_compile_file === null) {
                static::$apc_compile_file = function_exists('apc_compile_file');
            }

            if (static::$apc_compile_file || static::$opcache_invalidate) {
                $path = \Finder::search('config', $this->file, $this->ext);
                if ($this->file[0] === '/' || (isset($this->file[1]) && $this->file[1] === ':')) {
                    $path = $this->file;
                }

                // make sure we have a fallback
                $path || $path = APPPATH.'config'.DS.$this->file.$this->ext;

                static::$opcache_invalidate && opcache_invalidate($path, true);
                static::$apc_compile_file && apc_compile_file($path);
            }
        }
        return $return;
    }

    /**
     * Returns the formatted config file contents.
     *
     * @param array $contents config array
     * @return  string  formatted config file contents
     */
    protected function export_format($contents)
    {
        $output = <<<CONF
<?php

CONF;
        $output .= 'return '.str_replace(array('\''.APPPATH, '\''.DOCROOT, '\''.COREPATH, '\''.PKGPATH), array('APPPATH.\'', 'DOCROOT.\'', 'COREPATH.\'', 'PKGPATH.\''), var_export($contents, true)).";\n";
        return $output;
    }
}
