<?php
namespace Nos;

class Controller_Inspector extends Controller_Admin_Application
{
    protected static $default_view = null;

    public function before()
    {
        parent::before();
        $this->load_config();
    }

    public function load_config()
    {
        list($application) = \Config::configFile(get_called_class());
        $this->config = static::process_config($application, $this->config);
        return $this->config;
    }

    public function action_list()
    {
        return static::getView($this->config);
    }

    public static function getView($config)
    {
        return \View::forge(static::$default_view);
    }

    public static function process_config($application, $config, $item_actions = array(), $gridKey = null)
    {
        if (!isset($config['appdesk'])) {
            $config['appdesk'] = array();
        }

        if (!isset($config['appdesk']['view']) && !isset($config['appdesk']['url'])) {
            $config['appdesk']['view'] = static::getView($config)->render();
        }

        if (!empty($config['model'])) {
            $inspector_path = static::get_path();
            $model = $config['model'];

            if (!isset($config['appdesk']['inputName'])) {
                $config['appdesk']['inputName'] = $config['input']['key'].'[]';
            }

            if (!isset($config['appdesk']['vertical'])) {
                $config['appdesk']['vertical'] = true;
            }

            if (!isset($config['appdesk']['contextChange'])) {
                $config['appdesk']['contextChange'] = !!$model::behaviours('Nos\Orm_Behaviour_Twinnable', false);
            }

            if (!isset($config['appdesk']['reloadEvent'])) {
                $config['appdesk']['reloadEvent'] = $config['model'];
            }

            if (!isset($config['appdesk'][$gridKey])) {
                $config['appdesk'][$gridKey] = array();
            }

            if (!isset($config['appdesk'][$gridKey]['urlJson'])) {
                $config['appdesk'][$gridKey]['urlJson'] = $inspector_path.'/json';
            }

            if (!isset($config['appdesk'][$gridKey]['columns'])) {
                $config['appdesk'][$gridKey]['columns'] = array();
                foreach ($config['dataset'] as $key => $value) {
                    if ($key !== 'actions' && (!isset($value['visible']) || $value['visible'])) {
                        if ($key == 'context') {
                            $config['appdesk'][$gridKey]['columns'][$key] = array('context' => true);
                        } else if ($key == 'published') {
                            $config['appdesk'][$gridKey]['columns']['published'] = array(
                                'headerText' => __('Status'),
                                'dataKey' => 'publication_status'
                            );
                        } else if (!empty($value['headerText'])) {
                            $config['appdesk'][$gridKey]['columns'][$key]['headerText'] = $value['headerText'];
                            $config['appdesk'][$gridKey]['columns'][$key]['dataKey'] = $key;
                        }
                    }
                }
            }

            if (count($item_actions) > 0) {
                if (!isset($config['appdesk'][$gridKey]['columns']['actions'])) {
                    $config['appdesk'][$gridKey]['columns']['actions'] = array();
                }

                if (!isset($config['appdesk'][$gridKey]['columns']['actions']['showOnlyArrow'])) {
                    $config['appdesk'][$gridKey]['columns']['actions']['showOnlyArrow'] = count($item_actions) > 0;
                }

                if (!isset($config['appdesk'][$gridKey]['columns']['actions']['actions'])) {
                    $config['appdesk'][$gridKey]['columns']['actions']['actions'] = $item_actions;
                }


            }
        }
        return $config;
    }
}