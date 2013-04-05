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

    /**
     * Loads any default caching settings when available
     */
    public static function _init()
    {
        \Config::load('cache', true);
    }

    protected static function _phpBegin()
    {
        if (static::$_php_begin !== null) {
            return static::$_php_begin;
        }
        \Config::load('crypt', true);
        static::$_php_begin = md5(\Config::get('crypt.hmac').'begin');
        return static::$_php_begin;
    }

    /**
     * Write a HMVC call in cache for after cache execution.
     *
     * @param string    $uri    Route for the request.
     * @param array     $args   The method parameters.
     */
    public static function callHmvcUncached($uri, $args = array())
    {
        echo static::_phpBegin();
        // Serialize allow to persist objects in the cache file
        // API is Nos\Nos::hmvc('location', array('args' => $args))
        echo 'echo \Nos\Nos::hmvc('.var_export($uri, true).', unserialize('.var_export(serialize(array('args' => $args)), true).'));';
        echo '?>';
    }

    /**
     * Write a View forge in cache for after cache execution.
     *
     * @param string    $file           The view filename
     * @param array     $data           Array of values
     * @param boolean   $auto_filter    Set to true or false to set auto encoding
     */
    public static function viewForgeUncached($file = null, $data = null, $auto_filter = null)
    {
        echo static::_phpBegin();
        // Serialize allow to persist objects in the cache file
        echo 'echo View::forge('.var_export($file, true).', unserialize('.var_export(serialize($data), true).'), '.var_export($auto_filter, true).');';
        echo '?>';
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
            return $cache->executeOrStart($params['controller']);
        } catch (CacheNotFoundException $e) {
            call_user_func_array($params['callback_func'], $params['callback_args']);

            return $cache->saveAndExecute($params['duration'], $params['controller']);
        }
    }

    protected $_init_path = null;
    protected $_path = null;
    protected $_path_suffix = null;
    protected $_suffix_handlers = array();
    protected $_level = null;
    protected $_content = '';
    protected $_lock_fp = null;

    public function __construct($path = false)
    {
        if ($path == false) {
            $this->_path = false;
        } else {
            $path = \Config::get('cache_dir').$path;
            $this->_init_path = $path.'.php';
            $this->_path_suffix = $path.'.cache.suffixes/';
            $this->reset();
        }
    }

    public function reset()
    {
        $this->_path = $this->_init_path;
        $this->_suffix_handlers = array();
    }

    public function addSuffixHandler(array $handler)
    {
        if (isset($handler['type'])) {
            $this->_suffix_handlers[] = $handler;
        } else {
            $this->_suffix_handlers = $this->_suffix_handlers + $handler;
        }
        $this->_suffix_handlers = array_unique($this->_suffix_handlers);

        $this->_suffix_handlers();

        return $this->_path !== $this->_init_path ? $this : null;
    }

    protected function _suffix_handlers()
    {
        $suffixes = array();
        foreach ($this->_suffix_handlers as $handler) {
            $type = isset($handler['type']) ? $handler['type'] : null;

            switch ($type) {
                case 'GET':
                    if (!empty($handler['keys'])) {
                        $keys = (array) $handler['keys'];
                        foreach ($keys as $key) {
                            if (isset($_GET[$key])) {
                                $suffixes[] = 'GET['.urlencode($key).']='.(is_array($_GET[$key]) ? http_build_query($_GET[$key]) : urlencode($_GET[$key]));
                            }
                        }
                    }
                    break;

                case 'callable':
                    if (!empty($handler['callable']) && is_callable($handler['callable'], false, $callable_name)) {
                        if (empty($callable_name)) {
                            \Log::warning('Suffix handlers can\'t be a closure');
                            break;
                        }

                        $args = is_array($handler['args']) ? $handler['args'] : array();
                        $suffix = call_user_func_array($handler['callable'], $args);
                        if (!empty($suffix)) {
                            $suffixes[] = $suffix;
                        }
                    }
                    break;
            }
        }

        if (!empty($suffixes)) {
            $this->_path = $this->_path_suffix.implode('&', $suffixes).'.php';
            $basename = basename($this->_path);
            if (\Str::length($basename) > 100) {
                $this->_path = dirname($this->_path).DS.\Str::sub($basename, 0, 100).md5($basename).'.php';
            }
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

    public static function checkExpires($expires)
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

            '.__CLASS__.'::checkExpires('.$expires.');'."\n";

            if (!empty($controller)) {
                if ($this->_path === $this->_init_path && !empty($this->_suffix_handlers)) {
                    $prepend .= $this->cacheSuffixHandlers();
                }

                $prepend .= '
                if (!empty($controller)) {
                    $controller->rebuildCache(unserialize('.var_export(serialize($controller->getCache()), true).'));
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
        $this->_content = preg_replace('`<\?(?!xml)`i', '&lt;?', $this->_content);
        $this->_content = str_replace('<?xml', "<?= '<?' ?>xml", $this->_content);

        if (null !== static::$_php_begin) {
            $this->_content = strtr(
                $this->_content,
                array(
                    // Replace legitimate PHP tags
                    static::$_php_begin => "<?php\n",
                )
            );
        }
        $this->_content = $prepend.$this->_content;

        if (!static::store($this->_path, $this->_content)) {
            trigger_error('Cache could not be written! (path = '.$this->_path.')', E_USER_WARNING);
        }
        //flock($this->_lock_fp, LOCK_UN);

        if ($duration != -1 && $this->_path !== $this->_init_path && !empty($this->_suffix_handlers) && !is_file($this->_init_path)) {
            $content = "<?php\n";

            if (!empty($controller)) {
                $content .= $this->cacheSuffixHandlers();
            }
            $content .= '
                throw new \Nos\CacheNotFoundException();
                '."\n";
            $content .= '?>';

            if (!static::store($this->_init_path, $content)) {
                trigger_error('Cache could not be written! (path = '.$this->_init_path.')', E_USER_WARNING);
            }
        }
    }

    public function saveAndExecute($duration = -1, $controller = null)
    {
        $this->save($duration, $controller);

        return $this->execute($controller);
    }

    public function executeOrStart($controller = null)
    {
        try {
            return $this->execute($controller);
        } catch (CacheNotFoundException $e) {
            \Fuel::$profiling && \Profiler::console('Publicache:'.\Fuel::clean_path($this->_path).' has expired.');
            $this->start();
            throw $e;
        }
    }

    protected function cacheSuffixHandlers()
    {
        return '
                if (!empty($controller)) {
                    $cache = $controller->addCacheSuffixHandler(unserialize('.var_export(serialize($this->_suffix_handlers), true).'));
                    if (!empty($cache)) {
                        echo $cache->execute($controller);
                        return;
                    }
                }'."\n";
    }

    protected static function store($path, $content)
    {
        $dir = dirname($path);
        // check if specified subdir exists
        if (!@is_dir($dir)) {
            // create non existing dir
            if (!@mkdir($dir, 0755, true)) {
                return false;
            }
        }
        file_put_contents($path, $content);

        return true;
    }

    public function delete()
    {
        if (is_file($this->_path)) {
            @unlink($this->_path);
        }
        if (is_dir($this->_path_suffix)) {
            try {
                \File::delete_dir($this->_path_suffix, true, true);
            } catch (\Exception $e) {
            }
        }
    }

    public function get_path()
    {
        return $this->_path;
    }
}
