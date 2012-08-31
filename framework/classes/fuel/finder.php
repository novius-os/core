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
    protected static $_suffixed_directories = array('config' => 'config', 'views' => 'view');

	public static function instance()
	{
		if (! static::$instance) {
			static::$instance = static::forge(array(APPPATH, NOSPATH, COREPATH));
		}

		return static::$instance;
	}

	public static function normalize_namespace($name)
	{
		return implode('\\', array_map(function($a) {
			return Inflector::words_to_upper($a);
		}, explode('\\', $name)));
	}

	/**
	 *
	 * @param   string  $directory  Directory to search into
	 * @param   string  $file       Base name of the file
	 * @param   string  $ext        .php
	 * @param   bool    $multiple   false
	 * @param   bool    $cache      true
	 * @return  string | array
	 */
	public function locate($directory, $file, $ext = '.php', $multiple = false, $cache = true, $alternative = false)
    {
        if ($alternative == false) {
            foreach (static::$_suffixed_directories as $suffixed_directory => $suffix) {
                if ($directory == $suffixed_directory) {
                    $dots = explode('.', $file);
                    array_splice($dots, count($dots) - ($dots[count($dots) - 1] == 'php' ? 1 : 0), 0, array($suffix));
                    if ($dots[count($dots) - 1] != 'php') {
                        $dots[] = 'php';
                    }
                    $finalName = implode('.', $dots);

                    $ret = $this->locate($directory, $finalName, $ext, $multiple, $cache, true);
                    if (count($ret) > 0 && $ret !== false) {
                        return $ret;
                    }
                }
            }
        }

		list($section,) = explode('/', $directory,  2);

		// Do we need to override the default behaviour?
		if ($file[0] === '/' or (isset($file[1]) and $file[1] === ':') or !in_array($section, array('views', 'config', 'lang'))) {
			return parent::locate($directory, $file, $ext, $multiple, $cache);
		}

		$context = false;
		if ($directory == 'config') {
			// DEBUG_BACKTRACE_IGNORE_ARGS, 5
			$dbt = debug_backtrace();
			foreach ($dbt as $context) {
				if (!empty($context['class']) && $context['class'] == 'Fuel\Core\Config' && !empty($context['function'])) {
					if (in_array($context['function'], array('load', 'save'))) {
						$context = 'config.'.$context['function'];
					}
					break;
				}
			}
		}

		$search = array();
		$found  = array();

		// Init namespace and active module
		$is_namespaced = mb_strripos($file, '::');

		if (false === $is_namespaced) {
			$request        = class_exists('Request', false) ? $request = Request::active() : false;
			$namespace      = false;
			$file_no_ns     = $file;
			$active_module  = $request ? $request->module : false;
			if ($active_module) {
				$namespace_path = Module::exists($active_module);
			}
		} else {
			$namespace         = self::normalize_namespace(mb_substr($file, 0, $is_namespaced));
			$file_no_ns        = mb_substr($file, $is_namespaced + 2);
			$active_module     = false;
			Module::load(mb_strtolower($namespace));
			$namespace_path    = Module::exists(mb_strtolower($namespace));
		}

		$local_config_path = APPPATH.$directory.DS;
		if ($is_namespaced) {
			$local_config_path .= ($active_module != 'nos' ? 'applications'.DS.$active_module : 'novius-os').DS;
		}
		if ($context == 'config.save') {
			$search = array($local_config_path);
		} else {

			if ($active_module == 'nos' && $directory == 'views') {
				$search[] = $local_config_path.'novius-os'.DS;
			}

			// -8 = strip the classes directory
			if (!empty($namespace_path)) {
				$search[] = $namespace_path.$directory.DS;
			}

			if ($active_module && $active_module != 'nos') {
				$search[] = NOSPATH.$directory.DS;
			}
			if ($context == 'config.load') {
				$search[] = $local_config_path;
			}
		}

		$file_ext = pathinfo($file_no_ns, PATHINFO_EXTENSION);
		if (!$file_ext) {
			$file_no_ns .= $ext;
		}

        $files_to_search = array();
        foreach (static::$_suffixed_directories as $suffixed_directory => $suffix) {
            if ($directory == $suffixed_directory) {
                $dots = explode('.', $file_no_ns);
                array_splice($dots, count($dots) - 1, 0, array($suffix));
                $files_to_search[] = implode('.', $dots);
            }
        }
        $files_to_search[] = $file_no_ns;

		foreach ($search as $path) {
			// We now only have absolute paths, search through them
            foreach ($files_to_search as $file_search) {
                if (is_file($path.$file_search)) {
                    $found[] = $path.$file_search;
                }
            }
		}

		// Fallback for standard search
		if (!$found) {
			// If a config has to be written it HAS to  be within the APPPATH
			if ($context == 'config.save') {
				if (!is_dir($search[0])) {
					File::create_dir(dirname($search[0]), basename($search[0]));
				}
				return $search[0].$file_no_ns;
			} elseif (!$is_namespaced) {
				$found = parent::locate($directory, $file, $ext, $multiple, $cache);
			}
		}

		if (is_array($found) && !$multiple) {
			$found = isset($found[0]) ? $found[0] : false;
		}

		return $found;
	}
}
