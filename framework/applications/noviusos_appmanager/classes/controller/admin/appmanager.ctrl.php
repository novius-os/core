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
                'allow_upload' => \Config::get('novius-os.allow_plugin_upload'),
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
            } else {
                $application = \Nos\Application::forge($app_name);
                $application->install();
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
                'notify' => __('Installation successful'),
                // The tab will be refreshed by the javaScript within the view
            )
        );
    }

    public function action_remove($app_name)
    {
        try {
            $application = \Nos\Application::forge($app_name);
            if ($application->uninstall()) {
                $app_installed = \Config::get('data::app_installed', array());
                unset($app_installed[$app_name]);

                \Config::save(APPPATH.'metadata/app_installed.php', $app_installed);
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
                'notify' => __('Uninstallation successful'),
                // The tab will be refreshed by the javaScript within the view
            )
        );
    }

    public function action_upload()
    {
        if (\Config::get('allow_plugin_upload', false) == false) {
            Response::redirect('admin/noviusos_appmanager/appmanager');
        }

        if (empty($_FILES['zip'])) {
            \Response::redirect('admin/noviusos_appmanager/appmanager');
        }

        if (!is_uploaded_file($_FILES['zip']['tmp_name'])) {
            \Session::forge()->set_flash(
                'notification.plugins',
                array(
                    'title' => 'Upload error.',
                    'type' => 'error',
                )
            );
            \Response::redirect('admin/noviusos_appmanager/appmanager');
        }

        if ($_FILES['zip']['error'] != UPLOAD_ERR_OK) {
            \Session::forge()->set_flash(
                'notification.plugins',
                array(
                    'title' => 'Upload error n°'.$_FILES['zip']['error'].'.',
                    'type' => 'error',
                )
            );
            \Response::redirect('admin/noviusos_appmanager/appmanager');
        }

        $files = array();
        $za = new \ZipArchive();
        $zip_file = $_FILES['zip']['tmp_name'];
        $za->open($zip_file);
        for ($i = 0; $i < $za->numFiles; $i++) {
            $files[] = $za->getNameIndex($i);
        }

        $root_files = array();
        foreach ($files as $k => $f) {
            if (mb_substr($f, -1) == '/' && substr_count($f, '/') <= 1) {
                $root_files[] = $f;
            }
        }

        $count = count($root_files);
        if ($count == 0) {
            \Session::forge()->set_flash(
                'notification.plugins',
                array(
                    'title' => $name.' already exists in you module directory.',
                    'type' => 'error',
                )
            );
            \Response::redirect('admin/noviusos_appmanager/appmanager');
        }
        $root = ($count == 1 ? $root_files[0] : '');

        $metadata_file = $root.'config/metadata.php';
        $metadata = \Fuel::load('zip://'.$zip_file.'#'.$metadata_file);

        if (empty($metadata['install_folder'])) {
            \Session::forge()->set_flash(
                'notification.plugins',
                array(
                    'title' => 'This is not a valid application archive.',
                    'type' => 'error',
                )
            );
            \Response::redirect('admin/noviusos_appmanager/appmanager');
        }

        $path = APPPATH.'applications'.DS.$metadata['install_folder'];
        if (is_dir($path.$name)) {
            \Session::forge()->set_flash(
                'notification.plugins',
                array(
                    'title' => $metadata['install_folder'].' already exists in you module directory.',
                    'type' => 'error',
                )
            );
            \Response::redirect('admin/noviusos_appmanager/appmanager');
        }

        usort(
            $files,
            function ($a, $b) {
                return mb_strlen($a) > mb_strlen($b);
            }
        );

        // @todo better error handling ?
        // @todo skip stupid files ?
        // @todo appropriate chmod ?
        try {
            $old = umask(0);
            @mkdir($path, 0777);
            umask($old);

            $root_length = mb_strlen($root);

            foreach ($files as $file) {
                $dest = $path.DS.mb_substr($file, $root_length);
                if (mb_substr($file, -1) == '/') {
                    is_dir($dest) || @mkdir($dest, 0777);
                } else {
                    copy('zip://'.$zip_file.'#'.$file, $dest);
                }
            }
        } catch (\Exception $e) {
            \Fuel\Core\File::delete_dir($path, true, true);
        }
        \Response::redirect('admin/noviusos_appmanager/appmanager');
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

}
