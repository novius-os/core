<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos;

class Controller_Admin_DataCatcher extends Controller_Admin_Application {

    public $bypass   = true;

    public function action_form($item = null)
    {
        if (empty($item)) {
            $id = \Input::get('model_id');
            $model = \Input::get('model_name');
            $item = $model::find($id);
        } else {
            $model = get_class($item);
            $id = $item->{\Arr::get($item->primary_key(), 0)};
        }
        $data_catchers = $item->data_catchers();
        $default_nuggets = $item->get_default_nuggets();

        return \View::forge('nos::admin/data_catcher/panel', array(
            'item' => $item,
            'model_name' => $model,
            'model_id' => $id,
            'default_nuggets' => $default_nuggets,
            'default_nuggets_view' => \View::forge('nos::admin/data_catcher/default_nuggets', array(
                'default_nuggets' => $default_nuggets,
            ), false),
            'data_catchers' => $data_catchers,
        ), false);
    }

    public function action_save() {
        try {
            $id = \Input::post('model_id');
            $model = \Input::post('model_name');

            // Load the application if we need it
            $namespace = \Inflector::get_namespace($model);
            \Config::load(APPPATH.'data/config/app_namespaces.php', 'data::app_namespaces');
            $namespaces = \Config::get('data::app_namespaces');
            $application = array_search(substr($namespace, 0, -1), $namespaces);
            if (false !== $application)
            {
                \Module::load($application);
            }

            $item = $model::find($id);
            $nugget = $item->get_default_nuggets_model();

            $data = array();
            foreach ($item->get_sharable_property() as $type => $params)
            {
                $use_default = \Input::post('default.'.$type, false);
                if (!empty($use_default))
                {
                    unset($data[$type]);
                }
                else
                {
                    $data[$type] = \Input::post($type);
                    if (empty($data[$type]))
                    {
                        unset($data[$type]);
                    }
                }
            }
            $nugget->content_data = $data;
            $nugget->save();

            $default_nuggets = $item->get_default_nuggets();

            \Response::json(array(
                'notify' => __('Operation completed successfully.'),
                'default_nuggets' => (string) \View::forge('nos::admin/data_catcher/default_nuggets', array(
                    'default_nuggets' => $default_nuggets,
                ), false),
            ));
        } catch (\Exception $e) {
            \Response::json(array(
                'error' => $e->getMessage(),
            ));
        }
    }
}