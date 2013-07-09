<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\User;

use View;

class Controller_Admin_Account extends \Nos\Controller_Admin_Application
{
    public function prepare_i18n()
    {
        parent::prepare_i18n();
        \Nos\I18n::current_dictionary('noviusos_user::common');
    }

    public function before()
    {
        try {
            parent::before();
        } catch (\Nos\Access_Exception $e) {
        }
    }

    public function action_index()
    {
        $user = \Session::user();
        $config_user = \Config::load('noviusos_user::controller/admin/user', true);
        $fields = $config_user['fields'];
        unset($fields['user_password']);
        // Form target is Controller_Admin_User_User, we only display the fieldset here
        $fieldset_infos = \Fieldset::build_from_config(
            $fields,
            $user,
            array(
                'save' => false,
            )
        );
        $fieldset_infos->js_validation();
        $fieldset_infos->set_config(
            'field_template',
            '<tr><th>{label}{required}</th><td class="{error_class}">{field} {error_msg}</td></tr>'
        );
        $fieldset_display = static::fieldset_display($user)->set_config('field_template', '<tr><th>{label}{required}</th><td class="{error_class}">{field} {error_msg}</td></tr>');

        return View::forge(
            'noviusos_user::admin/account',
            array(
                'logged_user' => $user,
                'fieldset_infos' => $fieldset_infos,
                'fieldset_display' => $fieldset_display,
            ),
            false
        );
    }

    public function action_disconnect()
    {
        \Nos\Auth::disconnect();
        \Response::redirect('admin/nos/login/reset');
        exit();
    }

    /**
     * Changes the lang of the user
     *
     * @param $lang The new locale code (like en_GB, fr_FR or ja_JP)
     */
    public function action_lang($lang)
    {
        $languages =\Config::get('novius-os.locales', array());
        if (array_key_exists($lang, $languages)) {
            $user = \Session::user();
            $user->user_lang = $lang;
            $user->save();
            $label = $languages[$lang]['title'];
            \Response::json(array(
                'notify' => strtr(__('Your Novius OS has switched to {{language}}. Okay, not quite. Actually it needs a <a>quick refresh</a>.'), array('{{language}}' => $label, '<a>' => '<a href="javascript:document.location.reload();">')),
            ));
        }
        $this->send_error(strtr(__('Sorry but your Novius OS doesn’t speak {{code}}.'), array(
            '{{code}}' => $lang,
        )));
    }

    public static function fieldset_display($user)
    {
        $configuration = $user->getConfiguration();
        $fields = array(
            'background' => array(
                'label' => __('Wallpaper'),
                'renderer' => 'Nos\Media\Renderer_Media',
                'form' => array(
                    'value' => \Arr::get($configuration, 'misc.display.background', ''),
                ),
            ),
        );

        $fieldset_display = \Fieldset::build_from_config(
            $fields,
            $user,
            array(
                'form_name' => 'edit_user_display',
                'complete' =>
                    function ($data) use ($user) {
                        $body = array();

                        try {
                            $configuration = $user->getConfiguration();
                            if (!empty($data['background'])) {
                                $media = \Nos\Media\Model_Media::find($data['background']);
                                if (!empty($media)) {
                                    \Arr::set($configuration, 'misc.display.background', $data['background']);
                                    $notify = strtr(
                                        __('‘{{title}}’ is your new gorgeous wallpaper. Go quick to the home tab to see it.'),
                                        array(
                                            '{{title}}' => $media->media_title,
                                        )
                                    );
                                    $body['wallpaper_url'] = \Uri::create($media->url());
                                } else {
                                    $data['background'] = null;
                                    $error = __('This is unexpected: The selected image doesn’t exist any more. It must have been deleted while you were selecting it.');
                                }
                            }
                            if (empty($data['background'])) {
                                \Arr::delete($configuration, 'misc.display.background');
                                $notify = __('Your wallpaper is now the default one.');
                            }

                            $user->user_configuration = serialize($configuration);
                            $user->save();
                        } catch (\Exception $e) {
                            $error = \Fuel::$env == \Fuel::DEVELOPMENT ? $e->getMessage() : __('Something went wrong. Please refresh your browser window and try again. Contact your developer or Novius OS if the problem persists. We apologise for the inconvenience caused.');
                        }

                        if (!empty($notify)) {
                            $body['notify'] = $notify;
                        }
                        if (!empty($error)) {
                            $body['error'] = $error;
                        }

                        \Response::json($body);
                    }
            )
        );
        $fieldset_display->js_validation();

        return $fieldset_display;
    }
}
