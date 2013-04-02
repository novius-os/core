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

use View;
use Fuel\Core\Config;

class Controller_Inspector_Data extends Controller_Inspector
{
    protected $config = array(
        'data' => '',
    );

    public function action_list()
    {
        return static::getView($this->config);
    }

    public static function getView($config)
    {
        $view = View::forge('inspector/plain_data');

        $view->set('data', \Format::forge()->to_json($config['data']), false);

        return $view;
    }

    public static function process_config($application, $config, $item_actions = array(), $gridKey = null)
    {
        if (!isset($config['appdesk'])) {
            $config['appdesk'] = array();
        }

        if (!isset($config['appdesk']['view']) && !isset($config['appdesk']['url'])) {
            $config['appdesk']['view'] = static::getView($config)->render();
        }

        return parent::process_config($application, $config, $item_actions, $gridKey);
    }
}
