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

class Access_Exception extends \Exception
{
}
class Controller_Admin_Application extends Controller_Admin_Auth
{
    public $template = 'nos::admin/html';
    public $bypass = false;

    public function before()
    {
        parent::before();

        if (!$this->bypass) {
            list($application) = \Config::configFile(get_called_class());
            if (!User\Permission::isApplicationAuthorised($application)) {
                throw new Access_Exception('You don\'t have access to application '.$application.'!');
            }
        }
    }

    public function after($response)
    {
        foreach (array(
                     'title' => 'Administration',
                     'base' => \Uri::base(false),
                     'require' => 'static/novius-os/admin/vendor/requirejs/require.js',
                 ) as $var => $default) {
            if (empty($this->template->$var)) {
                $this->template->$var = $default;
            }
        }
        $ret = parent::after($response);
        $this->template->set(
            array(
                'css' => \Asset::render('css'),
                'js' => \Asset::render('js'),
            ),
            false,
            false
        );

        return $ret;
    }

    protected function send_error($exception)
    {
        // Easy debug
        if (\Fuel::$env === \Fuel::DEVELOPMENT && !\Input::is_ajax()) {
            throw $exception;
        }
        $body = array(
            'error' => $exception->getMessage(),
        );
        \Response::json($body);
    }

    public static function get_path()
    {
        list($application, $file_name) = \Config::configFile(get_called_class());
        return 'admin/'.$application.'/'.substr(\File::validOSPath($file_name, '/'), strlen('controller/admin/'));
    }
}
