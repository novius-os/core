<?php

abstract class Config_File extends \Fuel\Core\Config_File
{
    public function load($overwrite = false)
    {
        try {
            $config = parent::load($overwrite);
        } catch (\ConfigException $e) {
            $config = array();
        }
        \Config::trigger_function(\File::validOSPath($this->group(), '/'), array(&$config));

        return $config;
    }
}
