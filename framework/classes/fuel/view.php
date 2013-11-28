<?php

class View extends \Fuel\Core\View
{
    protected static $application = null;

    protected static $redirects = array();

    public function __construct($file = null, $data = null, $filter = null)
    {
        $is_redirection_allowed = substr($file, 0, 1) !== '!';
        if (!$is_redirection_allowed) {
            $file = substr($file, 1);
        }

        if (strpos($file, '::') === false && static::$application !== null) {
            $file = static::$application.'::'.$file;
        }

        if ($is_redirection_allowed && isset(static::$redirects[$file])) {
            foreach (static::$redirects[$file] as $redirect) {
                $callback = $redirect['callback'];
                if (is_callable($callback)) {
                    $callback = $callback($data, static::$global_data, $filter);
                }
                if ($callback === true || is_string($callback)) {
                    $file = is_string($callback) ? $callback : $redirect['view'];
                    break;
                }
            }
        }

        parent::__construct($file, $data, $filter);
    }

    // Works, but some problems with package and error pages...
    public static function set_application($application)
    {
        static::$application = $application;
    }

    public static function redirect($from, $to, $callback = true)
    {
        if (is_callable($to)) {
            $callback = $to;
            $to = false;
        }
        if (!isset(static::$redirects[$from])) {
            static::$redirects[$from] = array();
        }
        array_unshift(static::$redirects[$from], array('view' => $to, 'callback' => $callback));
    }
}
