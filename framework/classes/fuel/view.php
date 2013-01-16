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
            $file = static::$redirects[$file];
        }

        parent::__construct($file, $data, $filter);
    }

    // Works, but some problems with package and error pages...
    public static function set_application($application)
    {
        static::$application = $application;
    }

    public static function redirect($from, $to)
    {
        static::$redirects[$from] = $to;
    }

}
