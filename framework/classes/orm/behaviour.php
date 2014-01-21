<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos;

class BehaviourDuplicateException extends \Exception
{
}

abstract class Orm_Behaviour extends \Orm\Observer
{
    protected $_class = null;
    protected $_properties = array();
    protected $_config = null;

    public function __construct($class)
    {
        $this->_class = $class;
        $this->_properties = call_user_func($class . '::observers', get_class($this));
    }

    protected function _config()
    {
        list($application, $relative_path) = \Config::configFile(get_called_class());
        $this->_config = \Config::load($application.'::'.$relative_path, true);
    }

    public function commonConfig(&$config)
    {
        $this->_config();
        static::processConfigKey($config, 'data_mapping', 'data_mapping');
        static::processConfigKey($config, 'actions', 'actions.list');
    }

    protected function processConfigKey(&$config, $keyFrom, $keyTo)
    {
        $valuesFrom = \Arr::get($this->_config, $keyFrom, array());
        foreach ($valuesFrom as $key => $value) {
            $valueTo = \Arr::get($config, $keyTo.'.'.$key);
            if ($valueTo === null || $valueTo === true) {
                $valueTo = array();
            }

            if ($valueTo !== false) {
                \Arr::set($config, $keyTo.'.'.$key, \Arr::merge($value, $valueTo));
            }
        }
    }
}
