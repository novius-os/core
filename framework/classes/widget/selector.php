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

abstract class Widget_Selector extends \Fieldset_Field
{
    protected $widget_options = array();

    public function __construct($name, $label = '', array $attributes = array(), array $rules = array(), \Fuel\Core\Fieldset $fieldset = null)
    {
        $this->before_construct($attributes, $rules);

        if (!empty($attributes['widget_options'])) {
            $this->set_widget_options($attributes['widget_options']);
        }
        unset($attributes['widget_options']);

        parent::__construct($name, $label, $attributes, $rules, $fieldset);
    }

    public function set_widget_options(array $options)
    {
        $this->widget_options = \Arr::merge($this->widget_options, $options);
    }

    /**
     * Add a class and an id with a prefix to the widget attributes
     * @abstract
     * @param $attributes
     * @param $rules
     */
    abstract public function before_construct(&$attributes, &$rules);

}
