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

class Controller_Admin_Login extends Controller
{
    public $template = 'nos::admin/html';

    public function before()
    {
        parent::before();

        \Event::trigger_function('admin.beforeLoginAuthCheck', array(array(
            'controllerInstance' => &$this,
        )));

        // If user is already logged in, proceed
        if (\Nos\Auth::check()) {

            \Event::trigger_function('admin.beforeLoginAuthCheckRedirect', array(array(
                'controllerInstance' => &$this,
            )));

            $this->redirect();
        }

        \Event::trigger_function('admin.beforeLogin', array(array(
            'controllerInstance' => &$this,
        )));

        I18n::setLocale(\Input::get('lang', \Config::get('novius-os.default_locale', 'en_GB')));
        I18n::current_dictionary('nos::common');
    }

    protected function redirect()
    {
        $url = urldecode(\Input::get('redirect', 'admin/'));

        // Ensure that the url is on the same domain
        if (!\Str::starts_with($url, \Uri::base())) {
            $url = \Uri::base().ltrim($url, '/');
        }

        \Response::redirect($url);
        exit();
    }

    public function action_popup()
    {
        if (\Input::method() == 'POST') {

            $error_msg = $this->post_login();

            if ($error_msg === true) {
                $notify = strtr(__('Welcome back, {{user}}.'), array(
                    '{{user}}' => \Session::user()->user_firstname,
                ));

                \Event::trigger_function('admin.loginPopupSuccess', array(array(
                    'controllerInstance' => &$this,
                    'message' => &$notify,
                )));

                \Response::json(
                    array(
                        'closeDialog' => true,
                        'notify' => $notify,
                    )
                );
            } else {
                \Event::trigger_function('admin.loginPopupFail', array(array(
                    'controllerInstance' => $this,
                    'message' => &$error_msg,
                )));

                \Response::json(
                    array(
                        'error' => $error_msg,
                    )
                );
            }
        }

        // Bypass the template
        return \View::forge('admin/login_popup', array(
            'lang' => \Input::get('lang', false),
        ), false);
    }

    public function action_index()
    {
        $error_msg = '';
        if (\Input::method() == 'POST') {
            $error_msg = $this->post_login();
            if ($error_msg === true) {
                $this->redirect();
            }
        }

        \Asset::add_path('static/novius-os/admin/novius-os/');
        \Asset::css('login.css', array(), 'css');

        $this->template->body = \View::forge('admin/login', array(
            'error' => $error_msg,
        ));

        return $this->template;
    }

    public function action_reset()
    {
        // Bypass the template
        return \Response::forge(\View::forge('admin/login_reset'));
    }

    public function after($response)
    {
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

    protected function post_login()
    {
        if (\Nos\Auth::login($_POST['email'], $_POST['password'], (bool) \Input::post('remember_me', false))) {
            if (\Event::has_events('user_login')) {
                \Log::deprecated('Event "user_login" is deprecated, use "admin.loginSuccess" instead.', 'Chiba.2');
                \Event::trigger('user_login');
            }
            \Event::trigger('admin.loginSuccess');
            return true;
        }
        \Event::trigger('admin.loginFail');
        return __('These details won’t get you in. Are you sure you’ve typed the correct email address and password? Please try again.');
    }

    public function sendResponse($data, $http_status = null)
    {
        $this->response = \Response::forge();
        $this->response($data, $http_status);
        $this->response->send(true);
        exit();
    }
}
