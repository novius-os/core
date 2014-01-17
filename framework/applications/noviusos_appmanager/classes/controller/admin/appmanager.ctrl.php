<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Appmanager;

use Fuel\Core\File;
use View;

class Controller_Admin_Appmanager extends \Nos\Controller_Admin_Application
{
    public function prepare_i18n()
    {
        parent::prepare_i18n();
        \Nos\I18n::current_dictionary('noviusos_appmanager::common');
    }

    public function action_index()
    {
        \Nos\Application::cleanApplications();
        $applications = \Nos\Application::search_all();
        $app_installed = array();
        $app_others = array();

        foreach ($applications as $app) {
            if ($app->is_installed()) {
                $app_installed[$app->folder] = $app;
            } else {
                $app_others[$app->folder] = $app;
            }
        }

        $view = View::forge('noviusos_appmanager::admin/app_manager');
        $view->set(
            array(
                'local' => \Nos\Application::forge('local'),
                'installed' => $app_installed,
                'others' => $app_others,
            ),
            false,
            false
        );

        return $view;
    }

    public function action_add($app_name)
    {
        \Module::load($app_name);

        try {
            if ($app_name === 'nos') {
                \Nos\Application::installNativeApplications();
                $notify = __('OK, changes have been applied.');
            } else {
                $application = \Nos\Application::forge($app_name);
                $application->install();
                $notify = $application->is_installed() ? __('OK, changes have been applied.') : __('Great, a new app! Installed and ready to use.');
            }
        } catch (\Exception $e) {
            $this->response(
                array(
                    'error' => $e->getMessage(),
                )
            );

            return;
        }
        $this->response(
            array(
                // The tab will be refreshed by the javaScript within the view
                'notify' => $notify,
                'dispatchEvent' => array(
                    'name' => 'Nos\Application',
                ),
            )
        );
    }

    public function action_remove($app_name)
    {
        try {
            $application = \Nos\Application::forge($app_name);
            $application->uninstall();
        } catch (\Exception $e) {
            $this->response(
                array(
                    'error' => $e->getMessage(),
                )
            );

            return;
        }

        $this->response(
            array(
                // The tab will be refreshed by the javaScript within the view
                'notify' => __('The application has been uninstalled.'),
                'dispatchEvent' => array(
                    'name' => 'Nos\Application',
                ),
            )
        );
    }

    public function action_refresh_metadata()
    {
        $files = array(
            'app_dependencies',
            'data_catchers',
            'enhancers',
            'launchers',
            'templates',
        );
        foreach ($files as $metadata) {
            \Nos\Config_Data::save($metadata, array());
        }

        foreach (array_keys(\Nos\Config_Data::get('app_installed')) as $app) {
            \Nos\Application::forge($app)->install(false);
        }

        $this->response(
            array(
                // The tab will be refreshed by the javaScript within the view
                'notify' => __('Metadata was refreshed.'),
                'dispatchEvent' => array(
                    'name' => 'Nos\Application',
                ),
            )
        );
    }
}
