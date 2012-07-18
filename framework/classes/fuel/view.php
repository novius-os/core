<?php

class View extends \Fuel\Core\View
{
    protected static $application = null;

    public function __construct($file = null, $data = null, $filter = null)
    {
        if (strpos($file, '::') === false && static::$application !== null) {
            $file = static::$application.'::'.$file;
        }
        parent::__construct($file, $data, $filter);
    }

    public static function set_application($application) {
        static::$application = $application;
    }

}
