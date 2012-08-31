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

class Controller_Admin_Datacatcher extends Controller_Admin_Application
{
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

    public function action_save()
    {
        try {
            list($item, $catcher_name) = static::save_catcher_nugget();
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

    public function action_rss_item()
    {
        return self::catcher_form(array(
            'view'  => 'nos::admin/data_catcher/rss_item',
        ));
    }

    public function action_rss_item_save()
    {
        try {
            list($item, $catcher_name) = self::save_catcher_nugget();

            $this->response(array(
                'notify' => strtr(__('Catcher "{catcher_name}" saved successfully.'), array(
                    '{catcher_name}' => \Arr::get($item->data_catchers(), $catcher_name.'.title'),
                )),
            ));
        } catch (\Exception $e) {
            \Response::json(array(
                'error' => $e->getMessage(),
            ));
        }
    }

    public function action_rss_channel()
    {
        return self::catcher_form(array(
            'view'  => 'nos::admin/data_catcher/rss_channel',
        ));
    }

    public function action_rss_channel_save()
    {
        try {
            list($item, $catcher_name) = self::save_catcher_nugget();

            $this->response(array(
                'notify' => strtr(__('Catcher "{catcher_name}" saved successfully.'), array(
                    '{catcher_name}' => \Arr::get($item->data_catchers(), $catcher_name.'.title'),
                )),
            ));
        } catch (\Exception $e) {
            \Response::json(array(
                'error' => $e->getMessage(),
            ));
        }
    }

    public static function catcher_form($params = array())
    {
        $params['model']        = \Arr::get($params, 'model', \Input::get('model', null));
        $params['id']           = \Arr::get($params, 'id', \Input::get('id', null));
        $params['catcher_name'] = \Arr::get($params, 'catcher_name', \Input::get('catcher', null));

        if (empty($params['model']) or empty($params['id']) or empty($params['view']) or empty($params['catcher_name'])) {
            \Response::json(array(
                'error' => 'Insufficient parameters.',
            ));
        }

        try {
            $item = $params['model']::find($params['id']);
            if (empty($item)) {
                throw new \Exception(Str::tr(__("Can't find item {item}"), array(
                    '{item}' => $params['model'].'('.$params['id'].')',
                )));
            }
            $data_catchers = $item->data_catchers();
            $data_nugget   = $data_catchers[$params['catcher_name']];
            if (empty($item)) {
                throw new \Exception(Str::tr(__("Can't find catcher {catcher} on {item}"), array(
                    '{catcher}' => $params['catcher_name'],
                    '{item}'    => $params['model'],
                )));
            }
        } catch (\Exception $e) {
            \Response::json(array(
                'error' => 'Wrong parameters.',
            ));
        }

        return \View::forge($params['view'], array(
            'item' => $item,
            'catcher_name' => $params['catcher_name'],
        ), false);
    }

    public static function save_catcher_nugget($params = array())
    {
        $id = \Input::post('model_id');
        $model = \Input::post('model_name');
        $catcher_name = \Input::post('catcher_name');

        $item = $model::find($id);
        $nugget = $item->get_catcher_nuggets($catcher_name);

        $data = array();
        $sharable_properties = $item->get_sharable_property();
        if (!empty($params['filter'])) {
            $sharable_properties = array_intersect_key($sharable_properties, array_flip($params['filter']));
        }
        foreach ($sharable_properties as $type => $idc) {
            $use_default = \Input::post('default.'.$type, false);
            if (!empty($use_default)) {
                unset($data[$type]);
            } else {
                $data[$type] = \Input::post($type);
                if (empty($data[$type])) {
                    unset($data[$type]);
                }
            }
        }
        if (isset($sharable_properties[\Nos\DataCatcher::TYPE_IMAGE]) && !\Input::post('default.'.$type, false) && \Input::post(\Nos\DataCatcher::TYPE_IMAGE, 0) == 0) {
            $data[\Nos\DataCatcher::TYPE_IMAGE] = \Input::post('custom_image', 0);
            if (empty($data[\Nos\DataCatcher::TYPE_IMAGE])) {
                unset($data[\Nos\DataCatcher::TYPE_IMAGE]);
            }
        }
        $nugget->content_data = $data;
        $nugget->save();

        return array($item, $catcher_name);
    }
}
