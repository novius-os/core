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
    protected static $default_view = 'inspector/plain_data';

    protected $config = array(
        'data' => '',
    );

    public static function getView($config)
    {
        $view = View::forge(static::$default_view);

        $view->set('data', \Format::forge()->to_json($config['data']), false);

        return $view;
    }
}
