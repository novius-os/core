<?php

abstract class Config_File extends \Fuel\Core\Config_File
{
    public function load($overwrite = false)
    {
        try
        {
            $config = parent::load($overwrite);
        }
        catch (\ConfigException $e)
        {
            $config = array();
        }
        Event::trigger_function('config|'.$this->group(), array(&$config));

        return $config;
    }
}
