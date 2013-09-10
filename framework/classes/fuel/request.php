<?php
 /**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Request extends Fuel\Core\Request
{
    public function __construct($uri, $route = true, $method = null)
    {
        $this->uri = new \Uri($uri);
        $this->method = $method ?: \Input::method();

        logger(\Fuel::L_INFO, 'Creating a new Request with URI = "'.$this->uri->get().'"', __METHOD__);
        $module_name = $this->uri->get_segment(1); // <-- CHANGED HERE

        // check if a module was requested
        if (count($this->uri->get_segments()) and $module_path = \Module::exists($module_name)) {
            // ^-- CHANGED HERE
            // check if the module has routes
            if (is_file($module_path .= 'config/routes.php')) {
                $module = $this->uri->get_segment(1);
                // load and add the module routes
                $module_routes = \Config::load($module_name.'::routes'); // <-- CHANGED HERE

                $prepped_routes = array();
                foreach ($module_routes as $name => $_route) {
                    if ($name === '_root_') {
                        $name = $module;
                    }
                    elseif (strpos($name, $module.'/') !== 0 and $name != $module and $name !== '_404_')
                    {
                        $name = $module.'/'.$name;
                    }

                    $prepped_routes[$name] = $_route;
                };

                // update the loaded list of routes
                \Router::add($prepped_routes, null, true);
            }
        }

        $this->route = \Router::process($this, $route);

        if ( ! $this->route) {
            return;
        }

        $this->module = $this->route->module;
        $this->controller = $this->route->controller;
        $this->action = $this->route->action;
        $this->method_params = $this->route->method_params;
        $this->named_params = $this->route->named_params;

        if ($this->route->module !== null) {
            $this->add_path(\Module::exists($this->module));
        }
    }
}