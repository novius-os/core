<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Event extends Fuel\Core\Event
{

	// --------------------------------------------------------------------

	/**
	 * Register
	 *
	 * Registers a Callback for a given event
	 *
	 * @access	public
	 * @param	string	The name of the event
	 * @param	int		Priority (default = 10, lowest value has more priority)
	 * @param	mixed	callback information
	 * @return	void
	 */
	public static function register()
	{
		// get any arguments passed
		$callback = func_get_args();
		$event    = array_shift($callback);
		$priority = isset($callback[0]) and is_int($callback[0]) ? array_shift($callback) : 10;

		// if the arguments are valid, register the event
		if (is_string($event) and isset($callback[0]) and is_callable($callback[0])) {
			// make sure we have an array for this event
			isset(static::$_events[$event]) or static::$_events[$event] = array();
			isset(static::$_events[$event][$priority]) or static::$_events[$event][$priority] = array();

			// store the callback on the call stack
			array_unshift(static::$_events[$event][$priority], $callback);

			// and report success
			return true;
		} else {
			// can't register the event
			return false;
		}
	}

	// --------------------------------------------------------------------

	/**
	 * Trigger
	 *
	 * Triggers an event and returns the results.  The results can be returned
	 * in the following formats:
	 *
	 * 'array'
	 * 'json'
	 * 'serialized'
	 * 'string'
	 *
	 * @access	public
	 * @param	string	The name of the event
	 * @param	mixed	Any data that is to be passed to the listener
	 * @param	string	The return type
	 * @return	mixed	The return of the listeners, in the return type
	 */
	public static function trigger($event, $data = '', $return_type = 'array')
	{
		$calls = array();

		// check if we have events registered
		if (static::has_events($event)) {
			// order them by priority (lowest key is higest priority)
			ksort(static::$_events[$event]);

			// process them
			foreach (static::$_events[$event] as $events) {
				foreach ($events as $arguments) {
					// get the callback method
					$callback = array_shift($arguments);

					// call the callback event
					if (is_callable($callback)) {
						$calls[] = call_user_func($callback, $data, $arguments);
					}
				}
			}
		}

		return static::_format_return($calls, $return_type);
	}

    public static function register_function()
    {
		// get any arguments passed
		$args     = func_get_args();
		$event    = array_shift($args);
		$priority = (isset($args[0]) and is_int($args[0])) ? array_shift($args) : 10;
        $callback = isset($args[0]) ? array_shift($args) : null;

		// if the arguments are valid, register the event
		if (is_string($event) and is_callable($callback)) {
            $callback_function = function() use ($callback) {
                return $callback;
            };
            array_unshift($args, $event, $priority, $callback_function);

            $ret = call_user_func_array('static::register', $args);
        } else {
            return false;
        }
    }

    public static function trigger_function($event, $args = array())
    {
		foreach(\Event::trigger($event, null, 'array') as $c) {
			is_callable($c) && call_user_func_array($c, $args);
		}
    }
}
