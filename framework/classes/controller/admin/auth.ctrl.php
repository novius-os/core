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

class Controller_Admin_Auth extends Controller
{
    public function before()
    {
        \Event::trigger_function('admin.beforeAuthCheck', array(array(
            'controllerInstance' => &$this,
        )));

        // Exceptionally, we run the parent::before() after our own routine.
        // Because our routine doesn't need anything from the parent, and we define the language, which may affect the parent too (config file).
        if (!\Nos\Auth::check()) {

            \Event::trigger_function('admin.authCheckFail', array(array(
                'controllerInstance' => &$this,
            )));

            if (\Input::is_ajax()) {
                $lang = \Input::get('lang', \Config::get('novius-os.default_locale', 'en_GB'));
                I18n::setLocale($lang);
                I18n::current_dictionary('nos::common');
                $this->sendResponse(array(
                    'login_popup' => array(
                        'ajax' => true,
                        'contentUrl' => \Config::get('base_url').'admin/nos/login/popup',
                        // The title here is useless, as we can't know the lang of the user here, it will be updated in the login_popup view
                        'title' => '',
                        'width' => 350,
                        'height' => 540,
                        'captionButtons' => array(
                            'close' => array(
                                'visible' => false,
                            ),
                        ),
                    ),
                ), 403);
            } else {
                \Response::redirect(
                    '/admin/nos/login?'.http_build_query(
                        array(
                            'redirect' => \Input::server('NOS_URL', 'admin/').'?tab='.\Input::get('tab', ''),
                        ),
                        '',
                        '&'
                    )
                );
            }
            exit();
        }

        \Event::trigger_function('admin.authCheckSuccess', array(array(
            'controllerInstance' => &$this,
        )));

        $this->prepare_i18n();
        parent::before();
    }

    public function prepare_i18n()
    {
        $locale = \Session::user()->user_lang;
        I18n::setLocale($locale);
        // Also configure Fuel to use appropriate locale settings
        \Config::set('language', substr($locale, 0, 2));
    }

    public function sendResponse($data, $http_status = null)
    {
        $this->response = \Response::forge();
        $this->response($data, $http_status);
        $this->response->send(true);
    }
}
