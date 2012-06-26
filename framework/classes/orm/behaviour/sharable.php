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

    const TYPE_TITLE = 1;
    const TYPE_URL = 2;
    const TYPE_DESCRIPTION = 3;
    const TYPE_HTML = 4;
    const TYPE_IMAGE = 5;
    const TYPE_VIDEO = 6;
    const TYPE_DOCUMENT = 7;
    const TYPE_DATE = 8;
    const TYPE_KEYWORDS = 9;

    public function get_default_nuggets($object) {
        $default_nuggets = $object->get_default_nuggets_model();
        $nuggets = $default_nuggets->content_data;
        foreach ($this->_properties as $type => $params) {
            if (!isset($nuggets[$type])) {
                if ($type === static::TYPE_URL) {
                    if (is_array($params) && isset($params['url'])) {
                        $params = $params['url'];
                    }
                }
                if (is_string($params)) {
                    $nuggets[$type] = $object->{$params};
                } else if (is_callable($params)) {
                    $nuggets[$type] = $params($object);
                }
            }
        }

        return $nuggets;
    }

    public function get_urls($object) {
        if (isset($this->_properties[static::TYPE_URL])) {
            $params = $this->_properties[static::TYPE_URL];
            if (is_array($params) && isset($params['urls']) && is_callable($params['urls'])) {
                return $params['urls']($object);
            }
            if (is_array($params) && isset($params['url'])) {
                $params = $params['url'];
            }
            if (is_string($params)) {
                return array($object->{$params});
            } else if (is_callable($params)) {
                return array($params($object));
            }
        }
        return array();
    }

    public function get_default_nuggets_model($object) {
        $default_nuggets = Model_Content_Nuggets::find('first', array(
            'where' => array(
                'content_catcher' => Model_Content_Nuggets::DEFAULT_CATCHER,
                'content_model_name' => get_class($object),
                'content_model_id' => $object->get(\Arr::get($object->primary_key(), 0)),
            ),
        ));
        if (empty($default_nuggets)) {
            $default_nuggets = Model_Content_Nuggets::forge();
            $default_nuggets->content_catcher = Model_Content_Nuggets::DEFAULT_CATCHER;
            $default_nuggets->content_model_id = $object->get(\Arr::get($object->primary_key(), 0));
            $default_nuggets->content_model_name = get_class($object);
        }

        return $default_nuggets;
    }

    public function get_sharable_types() {
        return array_keys($this->_properties);
    }

    public function data_catchers() {
        \Config::load(APPPATH.'data'.DS.'config'.DS.'data_catchers.php', 'data_catchers');
        $data_catchers = \Config::get("data_catchers", array());
        $catchers = array();
        foreach ($data_catchers as $id => $config) {
            if (isset($config['specified_models']) && $config['specified_models']) {
                continue;
            }
            if (!is_array($config['required_data'])) {
                $config['required_data'] = array();
            }
            foreach ($config['required_data'] as $type_data) {
                if (!isset($this->_properties[$type_data])) {
                    break 2;
                }
            }
            $catchers[$id] = $config;
        }
        return $catchers;
    }
}