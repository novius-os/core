<?php
namespace Nos\Migrations;

class Version_0_2 extends \Nos\Migration
{
    public function up()
    {
        // Add new namespaces before everything else, or run into 'Fatal error: class Nos\Page\Model_Page not found!'
        $app_namespaces = \Config::load(APPPATH.'metadata/app_namespaces.php', 'data::app_namespaces', true, true) +
            array(
                'noviusos_appmanager' => 'Nos\Appmanager',
                'noviusos_media' => 'Nos\Media',
                'noviusos_page' => 'Nos\Page',
                'noviusos_user' => 'Nos\User',
            );
        \Config::save(APPPATH.'metadata/app_namespaces.php', $app_namespaces);
        \Config::set('data::app_namespaces', $app_namespaces);

        // Remove 'native apps' from 0.1
        $app_installed = \Config::load(APPPATH.'metadata/app_installed.php', 'data::app_installed', true, true);
        unset($app_installed['nos']);
        \Config::save(APPPATH.'metadata/app_installed.php', $app_installed);
        \Config::set('data::app_installed', $app_installed);

        // Remove 'native launchers' from 0.1
        $launchers = \Config::load(APPPATH.'metadata/launchers.php', 'data::launchers', true, true);
        unset($launchers['nos_page']);
        unset($launchers['nos_media']);
        unset($launchers['nos_user']);
        \Config::save(APPPATH.'metadata/launchers.php', $launchers);
        \Config::set('data::launchers', $launchers);

        // Update native apps into 0.2
        \Nos\Application::installNativeApplications();

        parent::up();

        // Clear pages cache, now cache use domain
        if (file_exists(\Config::get('cache_dir').'pages')) {
            \File::delete_dir(\Config::get('cache_dir').'pages', true, false);
        }

        // Update url_enhanced config file, integrate contexts
        $url_enhanced_old = \Nos\Config_Data::get('url_enhanced', array());
        $url_enhanced_new = array();
        foreach ($url_enhanced_old as $page_id) {
            $page = \Nos\Page\Model_Page::find($page_id);
            if (!empty($page)) {
                $url_enhanced_new[$page_id] = array(
                    'url' => $page->page_entrance ? '' : $page->virtual_path(true),
                    'context' => $page->page_context,
                );
            }
        }
        \Nos\Config_Data::save('url_enhanced', $url_enhanced_new);
    }
}