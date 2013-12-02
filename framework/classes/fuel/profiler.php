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

            array_walk_recursive(\Config::$items, function (&$item, $key) {
                if (is_string($item)) {
                    $item = Fuel::clean_path($item);
                }
            });

            $output = static::$profiler->display(static::$profiler);

            $replace = function ($key, $value) use (&$output) {
                if (!is_bool($value) && !is_null($value) && !is_array($value) && !is_object($value)) {
                    $output = preg_replace(
                        '`<b>'.\Security::htmlentities($value).'</b>((&rsaquo;&nbsp;)*)'.$key.'`',
                        '<b><i><s>(hidden value)</s></i></b>$1'.$key,
                        $output
                    );
                }
            };

            array_walk_recursive(\Config::$items, function ($item, $key) use ($replace) {
                if (stripos($key, 'password') !== false || stripos($key, 'pwd') !== false ||
                    stripos($key, 'host') !== false || stripos($key, 'username') !== false ||
                    stripos($key, 'database') !== false) {
                    $replace($key, $item);
                }
            });

            foreach (\Arr::get($items, 'crypt', array()) as $key => $value) {
                $replace($key, $value);
            }

            \Config::$items = $items;
        }

        return $output;
    }
}
