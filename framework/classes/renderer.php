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

class Renderer extends \Fieldset_Field
{
    protected static $DEFAULT_RENDERER_OPTIONS = array();

    protected $renderer_options = array();

    public function __construct($name, $label = '', array $renderer = array(), array $rules = array(), \Fuel\Core\Fieldset $fieldset = null)
    {
        list($attributes, $renderer_options) = static::parseOptions($renderer);
        $this->renderer_options = \Arr::merge($this->renderer_options, $renderer_options);
        parent::__construct($name, $label, $attributes, $rules, $fieldset);
    }

    /**
     * Standalone build of the renderer.
     *
     * @param  array  $renderer Renderer definition (attributes + renderer_options)
     * @return string The <input> tag + JavaScript to initialise it
     */
    public static function renderer($renderer = array())
    {
        $fieldset = \Fieldset::forge(uniqid());
        $field = new static($renderer['name'], '', $renderer, array(), $fieldset);
        $fieldset->add_field($field);
        return $fieldset->field($renderer['name'])->set_template('{field}')->build().$fieldset->build_append();
    }

    /**
     * Set the renderer options
     * @param  array $options
     */
    public function setRendererOptions(array $options)
    {
        $this->renderer_options = \Arr::merge($this->renderer_options, $options);
    }

    /**
     * Parse the renderer array to get attributes and the renderer options
     * @param  array $renderer
     * @return array 0: attributes, 1: renderer options
     */
    protected static function parseOptions($renderer = array())
    {
        // Default options of the renderer
        $renderer_options = static::$DEFAULT_RENDERER_OPTIONS;

        if (!empty($renderer['renderer_options'])) {
            $renderer_options = \Arr::merge($renderer_options, $renderer['renderer_options']);
        }
        unset($renderer['renderer_options']);

        return array($renderer, $renderer_options);
    }
}
