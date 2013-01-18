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
    /**
     * publication_bool_property
     * publication_start_property
     * publication_end_property
     */
    protected $_properties = array();

    public static function _init()
    {
        I18n::current_dictionary(array('nos::common'));
    }

    public static function dataset(&$dataset)
    {
        $dataset['publication_status'] = array(__CLASS__, 'publication_status');
    }

    public static function publication_status($item)
    {
        $published = $item->published();
        if ($published === true) {
            return '<img class="publication_status" src="static/novius-os/admin/novius-os/img/icons/status-green.png"> '.__('Published');
        }
        if ($published === false) {
            return '<img class="publication_status" src="static/novius-os/admin/novius-os/img/icons/status-red.png"> '.__('Not published');
        }
    }

    /**
     * Returns the locale of the current object
     *
     * @return string
     */
    public function published($item)
    {
        $bool = $this->_properties['publication_bool_property'];
        if (!empty($bool)) {
            return (bool) $item->get($bool);
        }

        return false;
        // @todo publication start / end
    }

    public function before_query(&$options)
    {
        if (array_key_exists('where', $options)) {
            $where = $options['where'];
            if (isset($where['published'])) {
                $where[$this->_properties['publication_bool_property']] = $where['published'];
                unset($where['published']);
            }

            foreach ($where as $k => $w) {
                if (is_int($k)) {
                    $keys = array_keys($w);
                    if (count($w) == 1 && $keys[0] == 'published') {
                        $where[$k] = array($this->_properties['publication_bool_property'] => $w[$keys[0]]);
                    }

                    if (count($w) > 1 && $w[0] == 'published') {
                        $w[0] = $this->_properties['publication_bool_property'];
                        $where[$k] = $w;
                    }
                }
            }
            $options['where'] = $where;
        }
    }

    public function form_processing($item, $data, $response_json)
    {
        $props = $item->behaviours(__CLASS__);
        $publishable = $props['publication_bool_property'];
        // $data[$publishable] can possibly be filled with the data (see multi-line comment below)
        $item->set($publishable, (string) (int) (bool) \Input::post($publishable));
        $response_json['publication_initial_status'] = $item->get($publishable);
    }

    /*
    // This is only needed if we want the $data variable from the above function to be filled with the publishable attribute

    public function form_fieldset_fields($item, &$fieldset)
    {
        $props = $item->behaviours(__CLASS__);
        $publishable = $props['publication_bool_property'];
        // Empty array just so the data are retrieved from the input
        $fieldset[$publishable] = array();
    }
    */

}
