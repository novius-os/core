<?php
class Debug extends \Fuel\Core\Debug
{
    static $core_paths = array(FUEL_EXTEND_PATH, COREPATH, PKGPATH);

    static public function local_backtrace($array = false) {
        $backtrace = debug_backtrace();
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
}