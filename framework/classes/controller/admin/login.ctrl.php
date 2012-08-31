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

class Controller_Admin_Login extends Controller {

	public $template = 'nos::admin/html';

    public function before() {
        parent::before();

        // If user is already logged in, proceed
		if (\Nos\Auth::check()) {
			$this->redirect();
		}
    }

    protected function redirect() {

        \Response::redirect(urldecode(\Input::get('redirect', '/admin/')));
        exit();
    }

    public function action_index() {

        $error = (\Input::method() == 'POST') ? $this->post_login() : '';

		\Asset::add_path('static/novius-os/admin/novius-os/');
		\Asset::css('login.css', array(), 'css');

        $this->template->body = \View::forge('admin/login', array(
			'error' => $error,
		));

        return $this->template;
    }

    public function action_reset() {

        $this->template->body = \View::forge('admin/login_reset');

        return $this->template;
    }

	public function after($response) {

		foreach (array(
			         'title' => 'Administration',
			         'base' => \Uri::base(false),
			         'require'  => 'static/novius-os/admin/vendor/requirejs/require.js',
		         ) as $var => $default) {
			if (empty($this->template->$var)) {
				$this->template->$var = $default;
			}
		}
		$ret = parent::after($response);
		$this->template->set(array(
			'css' => \Asset::render('css'),
			'js'  => \Asset::render('js'),
		), false, false);
		return $ret;
	}

	protected function post_login() {

		if (\Nos\Auth::login($_POST['email'], $_POST['password'], \Input::post('remember_me', false) ? true : false)) {
			\Event::trigger('user_login');
			$this->redirect();
		}
		return 'Access denied';
	}
}