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

abstract class Renderer_Selector extends Renderer
{
    public function __construct($name, $label = '', array $attributes = array(), array $rules = array(), \Fuel\Core\Fieldset $fieldset = null)
    {
        $this->before_construct($attributes, $rules);
        parent::__construct($name, $label, $attributes, $rules, $fieldset);
    }


    /**
     * @deprecated Use setRendererOptions() method instead
     */
    public function set_renderer_options(array $options)
    {
        \Log::deprecated('The method Renderer_Selector->set_renderer_options() is deprecated, '.
            'use Renderer_Selector->setRendererOptions() instead.', 'Chiba.2');
        parent::setRendererOptions($options);
    }

    /**
     * Add a class and an id with a prefix to the renderer attributes
     * @abstract
     * @param $attributes
     * @param $rules
     */
    abstract public function before_construct(&$attributes, &$rules);

}
