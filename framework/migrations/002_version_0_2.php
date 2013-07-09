<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Migrations;

class Version_0_2 extends \Nos\Migration
{
    public function up()
    {
        // stop migration if install_legacy has been executed
        $existing_migration = \DB::query('SELECT * FROM nos_migration WHERE
        type = "package" AND name="nos" AND migration="002_version_0_2";')->execute();
        if (count($existing_migration) > 0) {
            return true;
        }

        if ($this->canUpdateMetadata()) {
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
            \Nos\Application::installNativeApplications(true);
        }

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