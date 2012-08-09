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

        $this->_properties = array_merge(array(
            'data' => array(),
            'data_catchers' => array(),
        ), $this->_properties);
    }

    public function get_default_nuggets($object) {
        $default_nuggets = $object->get_catcher_nuggets(Model_Content_Nuggets::DEFAULT_CATCHER);
        $nuggets = $default_nuggets->content_data;
        foreach ($this->_properties['data'] as $type => $params) {
            if (!isset($nuggets[$type])) {
                if (is_string($params['value'])) {
                    $nuggets[$type] = $object->{$params['value']};
                } else if (is_callable($params['value'])) {
                    $nuggets[$type] = $params['value']($object);
                }
            }
        }

        return $nuggets;
    }

    public function get_catcher_nuggets($object, $catcher = Model_Content_Nuggets::DEFAULT_CATCHER) {
        $default_nuggets = Model_Content_Nuggets::find('first', array(
            'where' => array(
                'content_catcher' => $catcher,
                'content_model_name' => get_class($object),
                'content_model_id' => $object->get(\Arr::get($object->primary_key(), 0)),
            ),
        ));
        if (empty($default_nuggets)) {
            $default_nuggets = Model_Content_Nuggets::forge();
            $default_nuggets->content_catcher = $catcher;
            $default_nuggets->content_model_id = $object->get(\Arr::get($object->primary_key(), 0));
            $default_nuggets->content_model_name = get_class($object);
            $default_nuggets->content_data = array();
        }

        return $default_nuggets;
    }

    public function get_sharable_property($object, $property = null, $default = null) {
        if (empty($property)) {
            return $this->_properties['data'];
        } else {
            $value = \Arr::get($this->_properties['data'], $property, null);
            if ($value === null) {
                return $default;
            }
            return is_callable($value) ? $value($object) : $value;
        }
    }

    public function data_catchers($object) {
        \Config::load(APPPATH.'data'.DS.'config'.DS.'data_catchers.php', 'data_catchers');
        $data_catchers = \Config::get("data_catchers", array());
        $catchers = array();
        foreach ($data_catchers as $id => $config) {
            if (isset($config['specified_models']) &&
                ((is_bool($config['specified_models']) && $config['specified_models'] === true))
            ) {
                continue;
            }
            if (!is_array($config['required_data'])) {
                $config['required_data'] = array();
            }
            foreach ($config['required_data'] as $type_data) {
                if (!isset($this->_properties['data'][$type_data])) {
                    break 2;
                }
            }
            $catchers[$id] = $config;
        }

        foreach ($this->_properties['data_catchers'] as $id => $data_catcher) {
            if (is_array($data_catcher) && $data_catcher['data_catcher'] && !empty($data_catchers[$data_catcher['data_catcher']])) {
                $catchers[$id] = array_merge($data_catchers[$data_catcher['data_catcher']], $data_catcher);
                unset($catchers[$id]['data_catcher']);
            }
            if (is_string($data_catcher) && !empty($data_catchers[$data_catcher])) {
                $catchers[$data_catcher] = $data_catchers[$data_catcher];
            }
        }

        \Config::load(APPPATH.'data'.DS.'config'.DS.'enhancers.php', 'enhancers');
        foreach ($object->wysiwygs as $wysiwyg) {
            \Nos\Nos::parse_enhancers($wysiwyg, function ($enhancer) use (&$catchers, $data_catchers) {
                $params = \Config::get('enhancers.'.$enhancer, false);
                if ($params !== false) {
                    if (isset($params['data_catchers_added']) && is_array($params['data_catchers_added'])) {
                        foreach ($params['data_catchers_added'] as $catcher) {
                            if (isset($data_catchers[$catcher])) {
                                $catchers[$catcher] = $data_catchers[$catcher];
                            }
                        }
                    }
                }
            });
        }

        return $catchers;
    }

    public function possible_medias($object)
    {
        $medias = array();
        foreach ($object->medias as $media)
        {
            $medias[$media->media_id] = $media;
        }
        foreach ($object->wysiwygs as $wysiwyg)
        {
            \Nos\Nos::parse_medias($wysiwyg, function($media) use (&$medias) {
                $medias[$media->media_id] = $media;
            });
        }

        return $medias;
    }
}