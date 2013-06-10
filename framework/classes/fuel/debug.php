<?php
class Debug extends \Fuel\Core\Debug
{
    public static $core_paths = array(FUEL_EXTEND_PATH, COREPATH, PKGPATH);

    public static function local_backtrace($array = false)
    {
        $backtrace = static::filter_backtrace(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS));

        $local_backtrace = array();
        for ($i = 0; $i < count($backtrace); $i++) {
            if (isset($backtrace[$i]['file'])) {
                $is_core_path = false;
                foreach (static::$core_paths as $core_path) {
                    if (substr($backtrace[$i]['file'], 0, strlen($core_path)) == $core_path) {
                        $is_core_path = true;
                        break;
                    }
                }
                if (!$is_core_path) {
                    $local_backtrace[] = $backtrace[$i];
                }
            }
        }

        return $array ? $local_backtrace : static::dump($local_backtrace);
    }

    public static function filter_backtrace(array $backtrace)
    {
        $filtered_backtrace = array();
        foreach ($backtrace as $key => $trace) {
            if (!isset($trace['file'])) {
                continue;
            }
            foreach (static::$core_paths as $core_path) {
                if (substr($trace['file'], 0, strlen($core_path)) == $core_path) {
                    continue 2;
                }
            }
            $filtered_backtrace[$key] = array(
                'file' => str_replace(NOSROOT, '', $trace['file']),
                'line' => $trace['line'],
            );
        }
        return $filtered_backtrace;
    }
}
