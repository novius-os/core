<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Menu;

use Nos\Controller_Front_Application;

class Controller_Front_Menu_Enhancer extends Controller_Front_Application
{
    /**
     * Display a menu
     *
     * @param array $args
     * @return bool|\Fuel\Core\View
     * @throws \OutOfBoundsException
     */
    public function action_main($args = array())
    {
        if (empty($args) || empty($args['menu_id'])) {
            return false;
        }

        // Get the menu
        $menu = Model_Menu::find(\Arr::get($args, 'menu_id'));
        if (empty($menu)) {
            return false;
        }

        // Get the template
        $menu_template = \Arr::get($args, 'menu_template');
        if (empty($menu_template) || empty($this->app_config['templates'][$menu_template])) {
            return false;
        }

        return $menu->html(array(
            'view' => \Arr::get($this->app_config['templates'][$menu_template], 'view')
        ));
    }
}
