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
            \Log::warning("Deprecated Orm_Behaviour_Publishable::publication_bool_property in class '$class'. Please use 'publication_state_property' instead.");
        }
    }

    public function dataset(&$dataset)
    {
        $dataset['publication_status'] = array($this, 'publication_status');
    }

    public function publication_status($item)
    {
        return (string) \View::forge('nos::admin/orm/publishable_label', array(
            'item' => $item,
        ), false);
    }

    public function planificationStatus($item)
    {
        $property = $this->_properties['publication_state_property'];
        return $item->get($property);
    }

    public function publicationStart($item)
    {
        if (empty($this->_properties['publication_start_property'])) {
            return null;
        }
        return $item->get($this->_properties['publication_start_property']);
    }

    public function publicationEnd($item)
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
    public function published($item)
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
    }

    public function before_query(&$options)
    {
        if (array_key_exists('where', $options)) {
            $where = $options['where'];
            if (isset($where['published'])) {
                $where[$this->_properties['publication_state_property']] = $where['published'];
                unset($where['published']);
            }

            $published_key = null;
            $published_value = null;

            foreach ($where as $k => $w) {
                if (is_int($k)) {
                    reset($w);
                    // This handles the case where the column is a key: array('published' => 1);
                    if (count($w) == 1 && key($w) == 'published') {
                        $published_key = $k;
                        $published_value = (bool) current($w);
                    }

                    // This handles the case the column is a value: array('published', $value);
                    if (count($w) > 1 && current($w) == 'published') {
                        $published_key = $k;
                        end($w);
                        $published_value = (bool) current($w);
                    }

                    if ($published_key !== null) {
                        $now = \Db::expr('NOW()');
                        $where[$published_key] = array(
                            array($this->_properties['publication_state_property'], $published_value),
                        );
                        if ($this->_properties['publication_start_property']) {
                            $where[$published_key]['or'] = array(
                                array($this->_properties['publication_state_property'], 2),
                                array(
                                    array($this->_properties['publication_start_property'], 'IS', null),
                                    'or' => array($this->_properties['publication_start_property'], $published_value ? '<=' : '>', $now),
                                ),
                                array(
                                    array($this->_properties['publication_end_property'], 'IS', null),
                                    'or' => array($this->_properties['publication_end_property'], $published_value ? '>=' : '<', $now),
                                ),
                            );
                        }
                        break;
                    }
                }
            }
            $options['where'] = $where;
        }
    }

    public function form_processing($item, $data, $response_json)
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

    /*
    // This is only needed if we want the $data variable from the above function to be filled with the publishable attribute

    public function form_fieldset_fields($item, &$fieldset)
    {
        $props = $item->behaviours(__CLASS__);
        $publishable = $props['publication_state_property'];
        // Empty array just so the data are retrieved from the input
        $fieldset[$publishable] = array();
    }
    */

}
