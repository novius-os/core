<?php

abstract class Config_File extends \Fuel\Core\Config_File
{
	public function load($overwrite = false)
	{
		$config = parent::load($overwrite);
        Event::trigger_function('config|'.$this->group(), array(&$config));

        return $config;
    }
}
