<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */


class Config extends \Fuel\Core\Config {

    public static function load($file, $group = null, $reload = false, $overwrite = false) {
        $originFileName = $file;
        $file = static::convertFileName($file, 'load');
        if ($originFileName == 'db')  {
            $group = 'db';
        }
        return parent::load($file, $group, $reload, $overwrite);
    }

    public static function get($item, $default = null) {
        $item = static::convertFileName($item, 'get');
        //print_r($item."\n");
        //print_r(parent::get($item, $default));
        return parent::get($item, $default);
	}

    public static function save($file, $config) {
		$file = static::convertFileName($file, 'save');
        return parent::save($file, $config);
	}



/*
	public static function set($item, $value)
	{
		return \Arr::set(static::$items, $item, \Fuel::value($value));
	}

	public static function delete($item)
	{
		return \Arr::delete(static::$items, $item);
	}
*/
    public static function convertFileName($file, $from = 'load') {
        if (is_string($file) && strpos($file, '::') !== false && substr($file, 0, 4) == 'nos_') {
            list($application, $configuration_path) = explode('::', $file);
            $file = 'nos::admin/'.$application.'/'.$configuration_path;
        }
        return $file;
    }

    public static function getFromUser($item, $default = null) {
        return static::mergeWithUser($item, static::get($item, $default));
    }

    public static function mergeWithUser($item, $config) {
        $user = Session::user();

        Arr::set($config, 'configuration_id', static::getBDDName($item));

        return \Arr::merge($config, \Arr::get($user->getConfiguration(), static::getBDDName($item), array()));
    }

    public static function getBDDName($item) {
        $item = str_replace('::', '/config/', $item);
        $item = str_replace('/', '.', $item);
        return $item;
    }

}

/* End of file config.php */
