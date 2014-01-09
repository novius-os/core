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

class Update_Dependencies_Configuration extends \Nos\Migration
{
    public function up()
    {
        $config = \Nos\Config_Data::load('app_dependencies');
        foreach ($config as $app => $dependencies) {
            foreach ($dependencies as $app_extending => $extend_conf) {
                $config[$app][$app_extending] = $app_extending;
            }
        }
        \Nos\Config_Data::save('app_dependencies', $config);
    }
}
