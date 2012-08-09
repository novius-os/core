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
        }

        return \View::forge('nos::admin/data_catcher/panel', array(
            'item' => $item,
        ), false);
    }

    public function action_save() {

        try {
            $item = static::save_catcher_nugget(\Nos\Model_Content_Nuggets::DEFAULT_CATCHER);
            $default_nuggets = $item->get_default_nuggets();

            \Response::json(array(
                'notify' => __('Operation completed successfully.'),
                'default_nuggets' => (string) \View::forge('nos::admin/data_catcher/default_nuggets', array(
                    'nugget' => $default_nuggets,
                ), false),
            ));
        } catch (\Exception $e) {
            \Response::json(array(
                'error' => $e->getMessage(),
            ));
        }
    }

    public static function save_catcher_nugget($which, $filter = array()) {
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
        $nugget = $item->get_catcher_nuggets($which);

        $data = array();
        $sharable_properties = $item->get_sharable_property();
        if (!empty($filter))
        {
            $sharable_properties = array_intersect_key($sharable_properties, array_flip($filter));
        }
        foreach ($sharable_properties as $type => $idc)
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
        if (isset($sharable_properties[\Nos\DataCatcher::TYPE_IMAGE]) && !\Input::post('default.'.$type, false) && \Input::post(\Nos\DataCatcher::TYPE_IMAGE, 0) == 0)
        {
            $data[\Nos\DataCatcher::TYPE_IMAGE] = \Input::post('custom_image', 0);
            if (empty($data[\Nos\DataCatcher::TYPE_IMAGE]))
            {
                unset($data[\Nos\DataCatcher::TYPE_IMAGE]);
            }
        }
        $nugget->content_data = $data;
        $nugget->save();
        return $item;
    }
}