<?php

class View extends \Fuel\Core\View
{
    protected static $application = null;

    protected static $redirects = array();

    public function __construct($file = null, $data = null, $filter = null)
    {
        if (strpos($file, '::') === false && static::$application !== null) {
            $file = static::$application.'::'.$file;
        }
        if (isset(static::$redirects[$file])) {

            $file = static::$redirects[$file];
        }
        parent::__construct($file, $data, $filter);
    }

    public static function set_application($application) {
        static::$application = $application;
    }

    public static function redirect($from, $to) {
        static::$redirects[$from] = $to;
    }

}
