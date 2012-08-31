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

use \Input;
use \View;
use \Config;

class Controller_Inspector_Modeltree extends Controller_Admin_Application
{
    protected $config = array();

    public function action_list($view = null, $view_data = array())
    {
        if (empty($view)) {
            $view = 'inspector/modeltree';
        }
        $view = View::forge(str_replace('\\', '/', $view));
        foreach ($view_data as $k => $v) {
            $view->set($k, $v, false);
        }

        return $view;
    }

    public function action_json()
    {
        $json = $this->tree($this->config);

        if (\Fuel::$env === \Fuel::DEVELOPMENT) {
            $json['get'] = Input::get();
        }
        if (\Input::get('debug') !== null) {
            \Debug::dump($json);
            exit();
        }

        \Response::json($json);
    }
}
