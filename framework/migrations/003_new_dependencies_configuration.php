<?php
namespace Nos\Migrations;

class New_Dependencies_Configuration extends \Nos\Migration
{
    public function up()
    {
        if ($this->canUpdateMetadata()) {
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
}