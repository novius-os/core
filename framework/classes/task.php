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

abstract class Task
{
    protected $_config = array();

    public function __construct()
    {
        $this->_config();
    }

    protected function _config()
    {
        list($application, $relative_path) = \Config::configFile(str_replace('Tasks\\', 'Tasks_', get_called_class()));
        $this->_config = \Config::load($application.'::'.$relative_path, true);
    }

    public function success($msg)
    {
        \Log::info($msg);
    }

    public function error($msg)
    {
        $msg = 'Task '.get_called_class().': '.$msg;
        \Log::error($msg);
        throw new \Exception($msg);
    }

    abstract public function run();
}
