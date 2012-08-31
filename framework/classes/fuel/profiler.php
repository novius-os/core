<?php
class Profiler extends \Fuel\Core\Profiler
{
    public static function start($dbname, $sql)
    {
        $backtrace = \Debug::local_backtrace(true);
        $profiled = array();
        for ($i = 0; $i < count($backtrace); $i++) {
            $profiled[] = $backtrace[$i]['file'].'@'.$backtrace[$i]['line'];
        }
        /*\Log::info(print_r(array_keys($backtrace[0][0]), true));
        exit();*/
        \Log::info('SQL Request executed: "'.$sql."\"\nLocal backtrace:\n".implode("\n", $profiled)."\n\n");

    }
}