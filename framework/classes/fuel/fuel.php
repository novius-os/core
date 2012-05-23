<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Fuel extends Fuel\Core\Fuel {

	protected static $dependencies = array();

	public static $namespace_aliases = array();

	// We have a different base url because we changed the index.php
	protected static function generate_base_url()
	{

		if(\Input::server('server_alias'))
		{
			$base_url = \Input::protocol().'://'.\Input::server('server_alias').'/';
		}
		if(\Input::server('server_name'))
		{
			$base_url = \Input::protocol().'://'.\Input::server('server_name').'/';
		}
		return $base_url;
	}
}
