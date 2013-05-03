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

    public function __construct($class)
    {
        $this->_class = $class;
        $this->_properties = call_user_func($class . '::observers', get_class($this));
    }
}
