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

class New_Dependencies_Configuration extends \Nos\Migration
{
    public function up()
    {
        $config = \Nos\Config_Data::load('app_dependencies');
        $has_changed = false;
        foreach ($config as &$dependencies) {
            $keys = array_keys($dependencies);
            foreach ($keys as $key) {
                if (!is_string($key)) {
                    $has_changed = true;
                    $extending_application = $dependencies[$key];
                    unset($dependencies[$key]);
                    $dependencies[$extending_application] = array(
                        'extend_configuration' => true,
                    );
                }
            }
        }
        unset($dependencies);
        if ($has_changed) {
            \Nos\Config_Data::save('app_dependencies', $config);
        }
    }
}
