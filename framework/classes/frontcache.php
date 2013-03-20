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

class CacheNotFoundException extends \Exception
{
}

class CacheExpiredException extends \Exception
{
}

class FrontCache
{
    protected static $_php_begin = null;
    protected static $_php_end = null;

    /**
     * Loads any default caching settings when available
     */
    public static function _init()
    {
        \Config::load('cache', true);
    }

    protected static function _php_begin()
    {
        if (static::$_php_begin !== null) {
            return static::$_php_begin;
        }
        \Config::load('crypt', true);
        static::$_php_begin = md5(\Config::get('crypt.hmac').'begin');
        return static::$_php_begin;
    }

    protected static function _php_end()
    {
        if (static::$_php_end !== null) {
            return static::$_php_end;
        }
        \Config::load('crypt', true);
        static::$_php_end = md5(\Config::get('crypt.hmac').'end');
        return static::$_php_end;
    }

    public static function call_hmvc_uncached($uri, $args = array())
    {
        echo static::_php_begin();
        // Serialize allow to persist objects in the cache file
        // API is Nos\Nos::hmvc('location', array('args' => $args))
        echo '\Nos\Nos::hmvc('.var_export($uri, true).', unserialize('.var_export(serialize(array('args' => $args)), true).'));';
        echo static::_php_end();
    }

    public static function view_forge_uncached($file = null, $data = null, $auto_filter = null)
    {
        echo static::_php_begin();
        // Serialize allow to persist objects in the cache file
        echo 'echo View::forge('.var_export($file, true).', unserialize('.var_export(serialize($data), true).'), '.var_export($auto_filter, true).');';
        echo static::_php_end();
    }

    public static function forge($path)
    {
        return new static($path);
    }

    public static function get($path, $params = array())
    {
        if (empty($params['callback_func']) || !is_callable($params['callback_func'])) {
            \Fuel::$profiling && \Profiler::console($params);
            \Fuel::$profiling && \Console::logError(new \Exception(), "Invalid callback_func.");

            return;
        }

        $params = \Arr::merge(
            array(
                'callback_args' => array(),
                'duration' => \Config::get('novius-os.cache_duration_function', 10),
                'controller' => null,
            ),
            $params
        );

        $cache = new static($path);
        try {
            return $cache->execute_or_start($params['controller']);
        } catch (CacheNotFoundException $e) {
            call_user_func_array($params['callback_func'], $params['callback_args']);

            return $cache->save_and_execute($params['duration'], $params['controller']);
        }
    }

    protected $_path = null;
    protected $_level = null;
    protected $_content = '';
    protected $_lock_fp = null;

    public function __construct($path = false)
    {
        if ($path == false) {
            $this->_path = false;
        } else {
            $this->_path = \Config::get('cache_dir').$path.'.php';
        }
    }

    public function execute($controller = null)
    {
        // Get an exclusive lock
        //$this->_lock_fp = fopen($this->_path, 'c');
        //flock($this->_lock_fp, LOCK_EX);
        if (!empty($this->_path) && is_file($this->_path)) {
            try {
                ob_start();
                include $this->_path;
                $this->content = ob_get_clean();
                //flock($this->_lock_fp, LOCK_UN);
                return $this->content;
            } catch (CacheExpiredException $e) {
                ob_end_clean();
                @unlink($this->_path);
            }
        }
        throw new CacheNotFoundException();
    }

    public function start()
    {
        ob_start();
        ob_implicit_flush(false);
        $this->_level = ob_get_level();
    }

    public static function check_expires($expires)
    {
        if ($expires > 0 && $expires <= time()) {
            throw new CacheExpiredException();
        }
    }

    public function save($duration = -1, $controller = null)
    {
        $prepend = '';
        $this->_content = '';
        if ($duration == -1) {
            //flock($this->_lock_fp, LOCK_UN);
            $expires = 0;
            $this->_path = \Config::get('tmp_dir', '/tmp/'.uniqid('page/').'.php');
        } else {
            $expires = time() + $duration;
            $prepend .= '<?php
            '.__CLASS__.'::check_expires('.$expires.');'."\n";

            if (!empty($controller)) {
                $prepend .= '
                if (!empty($controller)) {
                    $controller->rebuild_cache(unserialize('.var_export(serialize($controller->save_cache()), true).'));
                }'."\n";
            }
            $prepend .= '?>';
            \Fuel::$profiling && \Profiler::console('FrontCache:'.\Fuel::clean_path($this->_path).' saved for '.$duration.' s.');
        }

        while (ob_get_level() >= $this->_level) {
            $this->_content .= ob_get_clean();
        }

        // Prevent PHP injection using a <script language=php> tag
        $this->_content = preg_replace('`<script\s+language=(.?)php\1\s*>(.*?)</script>`i', '&lt;script language=$1php$1>$2&lt;/script>', $this->_content);
        $this->_content = strtr(
            $this->_content,
            array(
                // Prevent PHP injection using tags
                '<?' => '&lt;?',
                '?>' => '?&gt;',
            )
        );

        if (null !== static::$_php_begin && null !== static::$_php_end) {
            $this->_content = strtr(
                $this->_content,
                array(
                    // Replace legitimate PHP tags
                    static::$_php_begin => "<?php\n",
                    static::$_php_end => "\n?".">",
                )
            );
        }
        $this->_content = $prepend.$this->_content;

        if (!$this->store()) {
            trigger_error('Cache could not be written! (path = '.$this->_path.')', E_USER_WARNING);
        }
        //flock($this->_lock_fp, LOCK_UN);
    }

    public function save_and_execute($duration = -1, $controller = null)
    {
        $this->save($duration, $controller);

        return $this->execute($controller);
    }

    public function execute_or_start($controller = null)
    {
        try {
            return $this->execute($controller);
        } catch (CacheNotFoundException $e) {
            \Fuel::$profiling && \Profiler::console('Publicache:'.\Fuel::clean_path($this->_path).' has expired.');
            $this->start();
            throw $e;
        }
    }

    protected function store()
    {
        $dir = dirname($this->_path);
        // check if specified subdir exists
        if (!@is_dir($dir)) {
            // create non existing dir
            if (!@mkdir($dir, 0755, true)) {
                return false;
            }
        }
        file_put_contents($this->_path, $this->_content);

        return true;
    }

    public function delete()
    {
        if (is_file($this->_path)) {
            @unlink($this->_path);
        }
    }

    public function get_path()
    {
        return $this->_path;
    }

    public function __toString()
    {
        return $this->content;
    }
}
