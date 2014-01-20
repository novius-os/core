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

class Version_Chiba_2_4 extends \Nos\Migration
{
    public function up()
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
    }
}
