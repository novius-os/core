<?php
namespace Nos;

class Controller_Inspector extends Controller_Admin_Application {

    public function before() {
        parent::before();
        $this->load_config();
    }

    public function load_config() {
        $this->config = static::process_config($this->config);
        return $this->config;
    }

    public static function process_config($config) {
        if (isset($config['model'])) {
            list($application, $file_name) = \Config::configFile($config['model']);
            $inspector_path = static::get_path();

            $admin_config = $config['model']::admin_config();
            $behaviours = $config['model']::behaviours();

            // @todo: only to model inpector ? >>>
            if (!isset($config['query'])) {
                $config['query'] = $admin_config['query'];
            }

            if (!isset($config['dataset'])) {
                $config['dataset'] = array('id' => 'id');
                foreach ($admin_config['dataset'] as $key => $value) {
                    if (isset($value['column'])) {
                        $config['dataset'][$key] = $value['column'];
                    }
                    if (isset($value['value'])) {
                        $config['dataset'][$key] = array('value' => $value['value']);
                    }
                }
            }

            if (!isset($config['input']['query'])) {
                $input_key = $config['input']['key'];
                $config['input']['query'] = function($value, $query) use ($input_key) {
                    if ( is_array($value) && count($value) && $value[0]) {
                        $query->where(array($input_key, 'in', $value));
                    }

                    return $query;
                };
            }
            // @todo: <<<

            if (!isset($config['appdesk']['inputName'])) {
                $config['appdesk']['inputName'] = $config['input']['key'].'[]';
            }

            if (!isset($config['appdesk']['vertical'])) {
                $config['appdesk']['vertical'] = true;
            }

            if (!isset($config['appdesk']['langChange'])) {
                $config['appdesk']['langChange'] = isset($behaviours['Nos\Orm_Behaviour_Translatable']);
            }

            if (!isset($config['appdesk']['url'])) {
                $config['appdesk']['url'] = $inspector_path.'/list';
            }

            if (!isset($config['appdesk']['reloadEvent'])) {
                $config['appdesk']['reloadEvent'] = $config['model'];
            }

            if (!isset($config['appdesk']['grid'])) {
                $config['appdesk']['grid'] = array();
            }

            if (!isset($config['appdesk']['grid']['urlJson'])) {
                $config['appdesk']['grid']['urlJson'] = $inspector_path.'/json';
            }

            if (!isset($config['appdesk']['grid']['columns'])) {
                $config['appdesk']['grid']['columns'] = array();
                foreach ($admin_config['dataset'] as $key => $value) {
                    if ($key == 'lang') {
                        $config['appdesk']['grid']['columns'][$key] = array('lang' => true);
                    } else if ($key == 'published') {
                        $config['appdesk']['grid']['columns']['published'] = array(
                            'headerText' => __('Status'),
                            'dataKey' => 'publication_status'
                        );
                    } else {
                        $config['appdesk']['grid']['columns'][$key]['headerText'] = $value['headerText'];
                        $config['appdesk']['grid']['columns'][$key]['dataKey'] = $key;
                    }

                }
            }

            if (!isset($config['appdesk']['grid']['columns']['actions'])) {
                $config['appdesk']['grid']['columns']['actions'] = array();
            }

            if (!isset($config['appdesk']['grid']['columns']['actions']['showOnlyArrow'])) {
                $config['appdesk']['grid']['columns']['actions']['showOnlyArrow'] = true;
            }

            if (!isset($config['appdesk']['grid']['columns']['actions']['actions'])) {
                $config['appdesk']['grid']['columns']['actions']['actions'] = \Config::actions($application, array('model' => $config['model'], 'type' => 'item'));
            }
        }
        return $config;
    }
}