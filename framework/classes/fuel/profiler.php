<?php
class Profiler extends \Fuel\Core\Profiler
{
    public static function start($dbname, $sql, $stacktrace = array())
    {
        \Event::trigger_function('profiler.sql', array(array('dbname' => $dbname, 'sql' => $sql)));

        return parent::start($dbname, $sql, $stacktrace);
    }
}
