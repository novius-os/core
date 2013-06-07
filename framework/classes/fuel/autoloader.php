<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

require COREPATH.'classes'.DIRECTORY_SEPARATOR.'autoloader.php';

class Autoloader extends Fuel\Core\Autoloader
{
    public static $suffixed = array(
        'model' => 'model',
        'controller' => 'ctrl'
    );

    /**
     * Loads a class.
     *
     * @param   string  $class  Class to load
     * @return  bool    If it loaded the class
     */
    public static function load($class)
    {
        // deal with funny is_callable('static::classname') side-effect
        if (strpos($class, 'static::') === 0) {
            // is called from within the class, so it's already loaded
            return true;
        }

        $loaded = false;
        $class = ltrim($class, '\\');
        $namespaced = ($pos = strripos($class, '\\')) !== false;

        if (empty(static::$auto_initialize)) {
            static::$auto_initialize = $class;
        }

        if (array_key_exists($class, static::$classes)) {
            include str_replace('/', DS, static::$classes[$class]);
            static::init_class($class);
            $loaded = true;
        } elseif ($full_class = static::find_core_class($class)) {
            if (!class_exists($full_class, false) and !interface_exists($full_class, false)) {
                include static::prep_path(static::$classes[$full_class]);
            }
            class_alias($full_class, $class);
            static::init_class($class);
            $loaded = true;
        } else {
            $full_ns = substr($class, 0, $pos);

            if ($full_ns) {
                foreach (static::$namespaces as $ns => $path) {
                    $ns = ltrim($ns, '\\');
                    if (stripos($full_ns, $ns) === 0) {
                        $path .= static::class_to_path(
                            substr($class, strlen($ns) + 1),
                            array_key_exists($ns, static::$psr_namespaces)
                        );

                        $path = static::get_valid_class_path($path);
                        if ($path) {
                            require $path;
                            static::init_class($class);
                            $loaded = true;
                            break;
                        }
                    }
                }
            }

            if (!$loaded) {
                $path = static::get_valid_class_path(APPPATH.'classes/'.static::class_to_path($class));

                if ($path) {
                    include $path;
                    static::init_class($class);
                    $loaded = true;
                }
            }
        }

        // Prevent failed load from keeping other classes from initializing
        if (static::$auto_initialize == $class) {
            static::$auto_initialize = null;
        }

        return $loaded;
    }

    public static function get_valid_class_path($path)
    {
        $path_parts = explode(DS, $path);
        $suffix = false;
        for ($i = 0; $i < count($path_parts) - 1; $i++) {
            if (isset(static::$suffixed[$path_parts[$i]])) {
                $suffix = static::$suffixed[$path_parts[$i]];
                break;
            }
        }

        if ($suffix !== false) {
            $dots = explode('.', $path);
            array_splice($dots, count($dots) - 1, 0, array($suffix));
            $suffixed_path = implode('.', $dots);
            $possibles_path = array($suffixed_path, $path);
        } else {
            $possibles_path = array($path);
        }

        foreach ($possibles_path as $possible_path) {
            if (is_file($possible_path)) {
                return $possible_path;
            }
        }

        return false;
    }
}
