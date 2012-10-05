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

class Controller_Admin_Noviusos extends Controller_Admin_Auth
{
    public $template = 'nos::admin/html';

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

    public function action_index()
    {
        $view = \View::forge('admin/noviusos');

        $user = \Session::user();
        $user_configuration = unserialize($user->user_configuration);
        $deep_linking_url = \Input::get('tab', null);

        $osTabs = array(
            'panelId' => 'noviusospanel',
            'url' => 'admin/nos/noviusos/appstab',
            'iconClasses' => 'nos-icon32',
            'iconSize' => 32,
            'label' => 'Novius OS',
        );

        if (!empty($deep_linking_url)) {
            if (!isset($user_configuration['tabs'])) {
                $user_configuration['tabs'] = array();
            }
            if (!isset($user_configuration['tabs']['tabs'])) {
                $user_configuration['tabs']['tabs'] = array();
            }
            $openRank = null;
            $found = false;

            // Native = OS + tray
            $nativeTabs = array($osTabs);

            // Search native tabs
            foreach ($nativeTabs as $i => $tab) {
                if ($tab['url'] == $deep_linking_url) {
                    $user_configuration['tabs']['selected'] = $i;
                    $found = true;
                }
            }

            // Search user tabs
            if (!$found) {
                foreach ($user_configuration['tabs']['tabs'] as $i => &$tab) {
                    if ($tab['url'] == $deep_linking_url) {
                        $openRank = $tab['openRank'];
                        $tab['openRank'] = 0;
                        $user_configuration['tabs']['selected'] = $i + 1;
                        $found = true;
                    }
                }
                unset($tab);
            }

            // Tab was not found found, add it
            if (!$found) {
                $user_configuration['tabs']['selected'] = count($user_configuration['tabs']['tabs']) + 1;
                $openRank = 1;
                $user_configuration['tabs']['tabs'][] = array(
                    'url' => $deep_linking_url,
                    'openRank' => 1,
                );

                // Rank from every tab goes up
                foreach ($user_configuration['tabs']['tabs'] as $i => &$tab) {
                    if ($tab['openRank'] < $openRank) {
                        $tab['openRank']++;
                    }
                }
                unset($tab);
            }
        }

        $ostabs = array(
            'initTabs' => array(),
            'trayView' => (string) \View::forge('noviusos_tray::admin/right'),
            'appsTab' => $osTabs,
            'newTab' => array(
                'panelId' => 'noviusospanel',
                'url' => 'admin/nos/noviusos/appstab',
                'iconClasses' => 'nos-icon16 nos-icon16-add',
                'iconSize' => 16,
            ),
            'user_configuration' => $user_configuration,
        );

        $view->set('ostabs', \Format::forge($ostabs)->to_json(), false);
        $this->template->body = $view;

        return $this->template;
    }

    public function action_appstab()
    {
        \Config::load(APPPATH.'metadata'.DS.'launchers.php', 'data::launchers');
        $launchers = \Config::get('data::launchers', array());
        $launchers = \Config::mergeWithUser('misc.apps', $launchers);

        $apps = array();
        foreach ($launchers as $key => $app) {
            if (empty($app['icon64']) && isset($app['application'])) {
                $app['icon64'] = \Config::icon($app['application'], 64);
            }
            if (!empty($app['action']) && !empty($app['icon64'])) {
                if (isset($app['application']) && isset($app['action']['tab']) && !isset($app['action']['tab']['iconUrl'])) {
                    $app['action']['tab']['iconUrl'] = \Config::icon($app['application'], 32);
                }
                // do we have to display the application?
                if (!isset($app['application']) || Permission::check($app['application'], 'access')) {
                    // do we have the rights to access the application?
                    $app['key'] = $key;
                    $apps[] = $app;
                }
            }
        }
        if (count($apps) > 0) {
            $apps = \Arr::sort($apps, 'order', 'asc');
        }

        $user = \Session::user();
        $background_id = \Arr::get($user->getConfiguration(), 'misc.display.background', \Config::get('background_id', false));
        $background = $background_id ? \Nos\Media\Model_Media::find($background_id) : false;

        $view = \View::forge(
            'admin/appstab',
            array(
                'apps' => $apps,
            )
        );
        $view->set('background', $background, false);

        return $view;
    }

    public function action_save_user_configuration()
    {
        $key = \Input::post('key');
        $new_config = \Input::post('configuration', array());
        $new_config = $this->convertFromPost($new_config);

        $json = array(
            'success' => true,
        );

        $user = \Session::user();
        if ($user) {
            if (!$user->user_configuration) {
                $user_configuration = array();
            } else {
                $user_configuration = unserialize($user->user_configuration);
            }
            $configuration = &$user_configuration;
            \Arr::set($configuration, $key, $new_config);

            $user->user_configuration = serialize($user_configuration);
            $user->save();
            \Session::setUser($user);
        }

        \Response::json($json);
    }

    protected function convertFromPost($arr)
    {
        if (is_array($arr)) {
            foreach ($arr as $key => $value) {
                if (is_array($value)) {
                    $arr[$key] = $this->convertFromPost($arr[$key]);
                } else {
                    $arr[$key] = $arr[$key] == 'true' ? true : ($arr[$key] == 'false' ? false : $arr[$key]);
                    $arr[$key] = is_numeric($arr[$key]) ? floatval($arr[$key]) : $arr[$key];
                }
            }
        }

        return $arr;
    }

}
