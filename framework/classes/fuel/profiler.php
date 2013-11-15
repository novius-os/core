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
}
