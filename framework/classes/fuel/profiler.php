<?php
class Profiler extends \Fuel\Core\Profiler
{
    public static function start($dbname, $sql)
    {
        \Event::trigger_function('profiler.sql', array(array('dbname' => $dbname, 'sql' => $sql)));

        return parent::start($dbname, $sql);
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
