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
        // Exceptionally, we run the parent::before() after our own routine.
        // Because our routine doesn't need anything from the parent, and we define the language, which may affect the parent too (config file).
        if (!\Nos\Auth::check()) {
            if (\Input::is_ajax()) {
                $this->response(
                    array(
                        'login_page' => \Uri::base(false).'admin/nos/login',
                    ),
                    403
                );
            } else {
                \Response::redirect(
                    '/admin/nos/login?'.http_build_query(
                        array(
                            'redirect' => mb_substr(\Input::server('REDIRECT_SCRIPT_URL', \Input::server('REDIRECT_URL', 'admin/')), defined('NOS_RELATIVE_DIR') ?  mb_strlen(NOS_RELATIVE_DIR) : 0).'?tab='.\Input::get('tab', ''),
                        ),
                        '',
                        '&'
                    )
                );
                exit();
            }
        }
        $this->prepare_i18n();
        parent::before();
    }

    public function prepare_i18n()
    {
        $locale = \Session::get('lang', 'en_GB');
        I18n::setLocale($locale);
        // Also configure Fuel to use appropriate locale settings
        \Config::set('language', substr($locale, 0, 2));
    }
}
