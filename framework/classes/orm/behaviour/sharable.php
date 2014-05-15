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

class Orm_Behaviour_Sharable extends Orm_Behaviour
{
    protected $_properties = array();

    public function __construct($class)
    {
        parent::__construct($class);

        $this->_properties = array_merge(
            array(
                'data' => array(),
                'data_catchers' => array(),
            ),
            $this->_properties
        );
    }

    public function get_default_nuggets($item)
    {
        $default_nuggets = $item->get_catcher_nuggets(Model_Content_Nuggets::DEFAULT_CATCHER);
        $nuggets = $default_nuggets->content_data;
        foreach ($this->_properties['data'] as $type => $params) {
            if (!isset($nuggets[$type])) {
                if (is_string($params['value'])) {
                    $nuggets[$type] = $item->{$params['value']};
                } elseif (is_callable($params['value'])) {
                    $nuggets[$type] = $params['value']($item);
                }
            }
        }

        return $nuggets;
    }

    public function get_catcher_nuggets($item, $catcher = Model_Content_Nuggets::DEFAULT_CATCHER)
    {
        $default_nuggets = Model_Content_Nuggets::find(
            'first',
            array(
                'where' => array(
                    'content_catcher' => $catcher,
                    'content_model_name' => get_class($item),
                    'content_model_id' => $item->get(\Arr::get($item->primary_key(), 0)),
                ),
            )
        );
        if (empty($default_nuggets)) {
            $default_nuggets = Model_Content_Nuggets::forge();
            $default_nuggets->content_catcher = $catcher;
            $default_nuggets->content_model_id = $item->get(\Arr::get($item->primary_key(), 0));
            $default_nuggets->content_model_name = get_class($item);
            $default_nuggets->content_data = array();
        }

        return $default_nuggets;
    }

    public function get_sharable_property($item, $property = null, $default = null)
    {
        if (empty($property)) {
            return $this->_properties['data'];
        } else {
            $value = \Arr::get($this->_properties['data'], $property, null);
            if ($value === null) {
                return $default;
            }

            return is_callable($value) ? $value($item) : $value;
        }
    }

    public function data_catchers($item)
    {
        $data_catchers = \Nos\Config_Data::get('data_catchers', array());
        $catchers = array();
        $default_nugget = $this->get_default_nuggets($item);
        foreach ($data_catchers as $id => $config) {
            if (isset($config['specified_models']) &&
                ((is_bool($config['specified_models']) && $config['specified_models'] === true))
            ) {
                continue;
            }
            if (!is_array($config['required_data'])) {
                $config['required_data'] = array();
            }
            // Don't add catchers if required data is missing
            foreach ($config['required_data'] as $type_data) {
                if (!isset($this->_properties['data'][$type_data]) && empty($default_nugget[$type_data])) {
                    break 2;
                }
            }
            $catchers[$id] = $config;
        }

        $set_data_catcher = function ($data_catcher, $id) use ($data_catchers, &$catchers) {
            if (is_array($data_catcher) && $data_catcher['data_catcher'] && !empty($data_catchers[$data_catcher['data_catcher']])) {
                $id = is_int($id) ? $data_catcher['data_catcher'] : $id;
                $catchers[$id] = array_merge($data_catchers[$data_catcher['data_catcher']], $data_catcher);
                unset($catchers[$id]['data_catcher']);
            }
            if (is_string($data_catcher) && !empty($data_catchers[$data_catcher])) {
                $id = is_int($id) ? $data_catcher : $id;
                $catchers[$id] = $data_catchers[$data_catcher];
            }
        };

        foreach ($this->_properties['data_catchers'] as $id => $data_catcher) {
            $set_data_catcher($data_catcher, $id);
        }

        \Nos\Config_Data::load('enhancers');
        foreach ($item->wysiwygs as $wysiwyg) {
            Tools_Wysiwyg::parseEnhancers(
                $wysiwyg,
                function ($enhancer) use (&$catchers, $data_catchers, $set_data_catcher) {
                    $params = \Nos\Config_Data::get('enhancers.'.$enhancer, false);
                    if ($params !== false) {
                        if (isset($params['data_catchers_added']) && is_array($params['data_catchers_added'])) {
                            foreach ($params['data_catchers_added'] as $id => $data_catcher) {
                                $set_data_catcher($data_catcher, $id);
                            }
                        }
                    }
                }
            );
        }

        return $catchers;
    }

    public function possible_medias($item)
    {
        $medias = array();
        foreach ($item->medias as $media) {
            $medias[$media->media_id] = $media;
        }
        foreach ($item->wysiwygs as $wysiwyg) {
            \Nos\Tools_Wysiwyg::parse_medias(
                $wysiwyg,
                function ($media) use (&$medias) {
                    if (!empty($media)) {
                        $medias[$media->media_id] = $media;
                    }
                }
            );
        }

        return $medias;
    }

    public function get_nugget_content($item, $catcher_name)
    {
        $extended_content = $item->get_catcher_nuggets($catcher_name)->content_data;
        $content = $item->get_default_nuggets();
        foreach ($extended_content as $key => $params) {
            $content[$key] = $params;
        }

        return $content;
    }
}
