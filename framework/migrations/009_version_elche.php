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

class Version_Elche extends \Nos\Migration
{
    public function up()
    {
        // Add new namespaces before everything else, or run into 'Fatal error: class Nos\Page\Model_Page not found!'
        $app_namespaces = \Config::load(APPPATH.'metadata/app_namespaces.php', 'data::app_namespaces', true, true) +
            array(
                'noviusos_template_variation' => 'Nos\Template\Variation',
                'noviusos_menu' => 'Nos\Menu',
            );
        \Config::save(APPPATH.'metadata/app_namespaces.php', $app_namespaces);
        \Config::set('data::app_namespaces', $app_namespaces);

        // Update native apps into 0.2
        \Nos\Application::installNativeApplications(true);
    }
}
