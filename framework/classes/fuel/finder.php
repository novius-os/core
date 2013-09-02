<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Finder extends Fuel\Core\Finder
{
    protected static $_suffixed_directories = array('config' => 'config', 'views' => 'view', 'lang' => 'lang');

    public static function instance()
    {
        $paths = \Config::get('novius-os.finder_paths');
        if (!static::$instance) {
            static::$instance = static::forge($paths);
        }

        return static::$instance;
    }

    public function add_path($paths, $pos = null)
    {
        if ($pos !== null && $pos !== -1) {
            $pos++;
        }

        return parent::add_path($paths, $pos);
    }

    /**
     * Locates a given file in the search paths.
     *
     * @param   string  $dir       Directory to look in
     * @param   string  $file      File to find
     * @param   string  $ext       File extension
     * @param   bool    $multiple  Whether to find multiple files
     * @param   bool    $cache     Whether to cache this path or not
     * @return  mixed  Path, or paths, or false
     */
    public function locate($dir, $file, $ext = '.php', $multiple = false, $cache = true)
    {
        $found = $multiple ? array() : false;

        // absolute path requested?
        if ($file[0] === '/' or (isset($file[1]) and $file[1] === ':')) {
            if ( ! is_file($file)) {
                // at this point, found would be either empty array or false
                return $found;
            }

            return $multiple ? array($file) : $file;
        }


        // Novius OS : force load module if not already load
        $context = false;
        if ($dir === 'config') {
            $dbt = debug_backtrace(defined('DEBUG_BACKTRACE_IGNORE_ARGS') ? DEBUG_BACKTRACE_IGNORE_ARGS : false);
            foreach ($dbt as $context) {
                if (!empty($context['class']) && $context['class'] == 'Fuel\Core\Config' && !empty($context['function'])) {
                    if (in_array($context['function'], array('load', 'save'))) {
                        $context = 'config.'.$context['function'];
                    }
                    break;
                }
            }
        }

        $cache_id = $multiple ? 'M.' : 'S.';
        $paths = array();

        // If a filename contains a :: then it is trying to be found in a namespace.
        // This is sometimes used to load a view from a non-loaded module.
        if ($pos = strripos($file, '::')) {
            // Novius OS : force load module if not already load
            $dir_app = substr($file, 0, $pos);
            Module::load(strtolower($dir_app));

            if ($dir === 'views' && $dir_app !== 'local') {
                // Novius OS : load view in local if exist
                $local_file = substr($file, $pos + 2);
                $found = \Finder::search('views', $dir_app === 'nos' ? 'local::novius-os'.DS.$local_file : 'local::apps'.DS.$dir_app.DS.$local_file, $ext, $multiple, $cache);
                if ($found !== false) {
                    return $found;
                }
            } else if ($dir === 'config') {
                // Novius OS : load config in local if exist
                $paths_add = array(APPPATH.'config'.DS.($dir_app === 'nos' ? 'novius-os'.DS : 'apps'.DS.$dir_app.DS));
            } else if ($dir === 'lang' && $dir_app !== 'local') {
                $paths_add = array(APPPATH.'lang'.DS.($dir_app === 'nos' ? 'novius-os'.DS : 'apps'.DS.$dir_app.DS));
            }

            // get the namespace path
            if ($path = \Autoloader::namespace_path('\\'.ucfirst(substr($file, 0, $pos)))) {
                $cache_id .= substr($file, 0, $pos);

                // and strip the classes directory as we need the module root
                $paths = array(substr($path, 0, -8));

                // strip the namespace from the filename
                $file = substr($file, $pos + 2);
            }
        } else {
            $paths = $this->paths;

            // get extra information of the active request
            if (class_exists('Request', false) and ($uri = \Uri::string()) !== null) {
                $cache_id .= $uri;
                $paths = array_merge(\Request::active()->get_paths(), $paths);
            }
        }

        // Merge in the flash paths then reset the flash paths
        $paths = array_merge($this->flash_paths, $paths);
        // Novius OS : load config in local if exist
        if (!empty($paths_add)) {
            $paths = array_merge($paths_add, $paths);
        }
        $this->clear_flash();

        $file_original = $file;
        $file = $this->prep_path($dir).$file.$ext;
        $cache_id .= $file;

        if ($cache and $cached_path = $this->from_cache($cache_id)) {
            return $cached_path;
        }

        list($section) = explode(DS, $dir);
        $directory = $dir;
        foreach ($paths as $dir) {
            // Novius OS : load config in local if exist
            if (!empty($paths_add) && in_array($dir, $paths_add)) {
                $file_path = $dir.$file_original.$ext;
            } else {
                $file_path = $dir.$file;
            }

            // Novius OS : somme file can have a sub-suffixe
            if (!empty(static::$_suffixed_directories[$section])) {
                if (!empty($paths_add) && in_array($dir, $paths_add)) {
                    $file_path_alt = $dir.$file_original.'.'.static::$_suffixed_directories[$section].$ext;
                } else {
                    $file_path_alt = $dir.$this->prep_path($directory).$file_original.'.'.static::$_suffixed_directories[$section].$ext;
                }

                if (is_file($file_path_alt)) {
                    if ( ! $multiple) {
                        $found = $file_path_alt;
                        break;
                    }

                    $found[] = $file_path_alt;
                }
            }
            if (is_file($file_path)) {
                if ( ! $multiple) {
                    $found = $file_path;
                    break;
                }

                $found[] = $file_path;
            }
        }

        if ( ! empty($found) and $cache) {
            $this->add_to_cache($cache_id, $found);
            $this->cache_valid = false;
        }

        // Novius OS : If a config has to be written it HAS to be within the APPPATH
        if (empty($found) && $context == 'config.save') {
            return Module::exists(!$pos ? 'local' : $dir_app).$this->prep_path($directory).$file_original.'.config'.$ext;
        }

        return $found;
    }
}
