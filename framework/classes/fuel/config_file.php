<?php

abstract class Config_File extends \Fuel\Core\Config_File
{
    public function load($overwrite = false, $cache = true)
    {
        try {
            $config = parent::load($overwrite, $cache);
        } catch (\ConfigException $e) {
            $config = array();
        }
        \Config::trigger_function(\File::validOSPath($this->group(), '/'), array(&$config));

        return $config;
    }
}
