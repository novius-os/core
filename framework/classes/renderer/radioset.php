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

class Renderer_Radioset extends \Fieldset_Field
{
    protected static $DEFAULT_RENDERER_OPTIONS = array(
        'item' => null,
        'view' => 'nos::renderer/radioset',
    );

    protected $options = array();

    public function __construct($name, $label = '', array $renderer = array(), array $rules = array(), \Fuel\Core\Fieldset $fieldset = null)
    {
        list($attributes, $this->options) = static::parse_options($renderer);
        $this->options['name'] = $name;
        parent::__construct($name, $label, $attributes, $rules, $fieldset);

    }

    public function build()
    {
        if (empty($this->options['item'])) {
            $this->options['item'] = $this->fieldset()->getInstance();
            $this->options['value'] = $this->options['item']->{$this->options['name']};
        }
        return $this->template((string) \View::forge($this->options['view'], $this->options, false));
    }

    /**
     * Parse the renderer array to get attributes and the renderer options
     * @param  array $renderer
     * @return array 0: attributes, 1: renderer options
     */
    protected static function parse_options($renderer = array())
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
