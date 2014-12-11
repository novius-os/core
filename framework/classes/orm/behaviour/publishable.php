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

class Orm_Behaviour_Publishable extends Orm_Behaviour
{
    public static function _init()
    {
        I18n::current_dictionary(array('nos::orm', 'nos::common'));
    }

    /**
     * publication_state_property
     * publication_start_property
     * publication_end_property
     */
    protected $_properties = array();

    public function __construct($class)
    {
        parent::__construct($class);
        if (!isset($this->_properties['publication_state_property']) && isset($this->_properties['publication_bool_property'])) {
            $this->_properties['publication_state_property'] = $this->_properties['publication_bool_property'];
            unset($this->_properties['publication_bool_property']);
            \Log::deprecated('Deprecated Orm_Behaviour_Publishable::publication_bool_property in class "'.$class.'". Please use "publication_state_property" instead.');
        }
    }

    public function dataset(Orm\Model $item, &$dataset)
    {
        $dataset['publication_status'] = array($item, 'publication_status');
    }

    public function publication_status(Orm\Model $item)
    {
        return (string) \View::forge('nos::admin/orm/publishable_label', array(
            'item' => $item,
        ), false);
    }

    public function planificationStatus(Orm\Model $item)
    {
        $property = $this->_properties['publication_state_property'];
        return $item->get($property);
    }

    public function publicationStart(Orm\Model $item)
    {
        if (empty($this->_properties['publication_start_property'])) {
            return null;
        }
        return $item->get($this->_properties['publication_start_property']);
    }

    public function publicationEnd(Orm\Model $item)
    {
        if (empty($this->_properties['publication_end_property'])) {
            return null;
        }
        return $item->get($this->_properties['publication_end_property']);
    }

    /**
     * Returns whether the item is currently published or not
     *
     * @return string
     */
    public function published(Orm\Model $item)
    {
        $property = $this->_properties['publication_state_property'];
        $status = $item->get($property);
        if ($status == 0 || $status == 1) {
            return (bool) $status;
        }

        $start = $this->publicationStart($item);
        $end = $this->publicationEnd($item);
        if (empty($start) && empty($end)) {
            return false;
        }
        if (empty($end)) {
            return strtotime($start) < strtotime('now');
        }
        if (empty($start)) {
            return strtotime($end) > strtotime('now');
        }
        return strtotime($start) < strtotime('now') && strtotime($end) > strtotime('now');
    }

    public function before_query(&$options)
    {
        $_properties = $this->_properties;
        $options['before_where']['published'] = function ($condition) use ($_properties) {
            $published_value = $condition[1];
            $now = date('Y-m-d H:i:00', strtotime('now'));
            $where = array(
                array($_properties['publication_state_property'], $published_value),
            );
            if (isset($_properties['publication_start_property'])) {
                $where['or'] = array(
                    array($_properties['publication_state_property'], 2),
                    array(
                        array($_properties['publication_start_property'], 'IS', null),
                        'or' => array($_properties['publication_start_property'], $published_value ? '<=' : '>', $now),
                    ),
                    array(
                        array($_properties['publication_end_property'], 'IS', null),
                        'or' => array($_properties['publication_end_property'], $published_value ? '>=' : '<', $now),
                    ),
                );
            }

            return array($where);
        };
        $options['before_order_by']['published'] = $_properties['publication_state_property'];
    }

    public function form_processing(Orm\Model $item, $data, $response_json)
    {
        $publishable = $this->_properties['publication_state_property'];
        // $data[$publishable] can possibly be filled with the data (see multi-line comment below)
        $status = (string) (int) \Input::post($publishable);

        if (!empty($this->_properties['publication_start_property']) && !empty($this->_properties['publication_end_property'])) {
            $publication_start_property = $this->_properties['publication_start_property'];
            $publication_end_property   = $this->_properties['publication_end_property'];
            $publication_start = \Input::post($publication_start_property, null);
            $publication_end   = \Input::post($publication_end_property, null);
            $item->set($publication_start_property, empty($publication_start) ? null : $publication_start);
            $item->set($publication_end_property, empty($publication_end) ? null : $publication_end);

            // Scheduled but no dates were provided
            if ($status == 2 && empty($publication_start) && empty($publication_end)) {
                // Unpublish
                $status = 0;
            }
        }
        $item->set($publishable, $status);
        $response_json['publication_initial_status'] = $status;
    }

    public function crudConfig(&$config, $crud)
    {
        // 1. adding the Renderer in the fields list
        if (!isset($config['fields']['publishable'])) {
            $config['fields']['_publishable'] = array();
        }
        $config['fields']['_publishable'] = \Arr::merge(array(
            'renderer' => 'Nos\Renderer_Publishable',
            'label' => '',
        ), $config['fields']['_publishable']);

        foreach (array('layout', 'layout_insert', 'layout_update') as $layout_name) {
            if (!empty($config[$layout_name])) {
                foreach ($config[$layout_name] as $name => $layout) {
                    if (isset($layout['view']) && in_array($layout['view'], array('nos::form/layout_standard', 'form/layout_standard'))) {
                        if (!isset($config[$layout_name][$name]['params'])) {
                            $config[$layout_name][$name]['params'] = array();
                        }
                        if (!isset($config[$layout_name][$name]['params']['subtitle'])) {
                            $config[$layout_name][$name]['params']['subtitle'] = array('_publishable');
                        } else {
                            array_unshift($config[$layout_name][$name]['params']['subtitle'], '_publishable');
                        }
                        break;
                    }
                }
            }
        }
    }
}
