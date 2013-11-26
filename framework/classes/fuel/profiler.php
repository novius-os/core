<?php
class Profiler extends \Fuel\Core\Profiler
{
    public static function start($dbname, $sql, $stacktrace = array())
    {
        \Event::trigger_function('profiler.sql', array(array('dbname' => $dbname, 'sql' => $sql)));

        // Patch, phpquickprofiler attemptToExplainQuery() function use html_entity_decode without encoding parameter
        // UTF-8 is the default encoding only since PHP 5.4
        // Without the Profiler generate warning when display EXPLAIN request containing accent
        if (\Fuel::$encoding === 'UTF-8' && version_compare(PHP_VERSION, '5.4.0') < 0) {
            $sql = utf8_encode($sql);
        }

        return parent::start($dbname, $sql, $stacktrace);
    }

    public static function output()
    {
        $output = '';
        if (static::$profiler) {
            $items = \Config::$items;

            \Arr::delete(\Config::$items, 'db');
            \Arr::delete(\Config::$items, 'crypt');
            \Arr::delete(\Config::$items, 'email');
            \Arr::delete(\Config::$items, 'ftp');

            array_walk_recursive(\Config::$items, function (&$item, $key) {
                if (stripos($key, 'password') !== false || stripos($key, 'pwd') !== false) {
                    $item = '(hidden value)';
                }
                if (is_string($item)) {
                    $item = Fuel::clean_path($item);
                }
            });

            $output = static::$profiler->display(static::$profiler);

            \Config::$items = $items;
        }

        return $output;
    }

    /**
     * Start a delta time study
     *
     * \Profiler::markDeltaStart();
     * // some code your want to study
     * \Profiler::markDeltaStop();
     *
     * 'markDeltaStart' calls are stackable, that is, you may call markDeltaStart() while another markDeltaStart()
     * is active (no call to markDeltaStop() yet)
     *
     * @param   string  $label  Optional label to display
     */
    public static function markDeltaStart($label = '')
    {
        static::__markDelta($label, false);
    }
    /**
     * Stop a delta time study
     *
     * @param   string  $label  Optional label to display
     */
    public static function markDeltaStop($label = '')
    {
        self::__markDelta($label, true);
    }
    private function __markDelta($label = '', $end = false)
    {
        static $stack = array();
        static $realnosroot = '';

        if ($realnosroot == '') {
            $realnosroot = realpath(NOSROOT) . '/';
        }

        $debug_backtrace = debug_backtrace();
        $bt = array(
            'time' => microtime(true),
            'file' => str_replace(array($realnosroot.'local/applications/', $realnosroot), array('apps/', ''), $debug_backtrace[1]['file']),
            'line' => $debug_backtrace[1]['line']
        );

        if ($end) {
            $bt_start = array_pop($stack);
            $dt = intval(1000 * ($bt['time'] - $bt_start['time']));

            if ($label) {
                \Profiler::mark(
                    $label
                    . ' - Δt: ' . $dt . 'ms'
                );
            } else {
                \Profiler::mark(
                    ($bt_start['file'] == $bt['file'] ? ($bt['file'] . ':' . $bt_start['line'] . '-' . $bt['line']) : ($bt['file'] . ':' . $bt['line']))
                    . ' - Δt: ' . $dt . 'ms'
                );
            }

        } else {
            $stack[] = $bt;
            if ($label) {
                \Profiler::mark($label);
            }
        }
    }
}
