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

class Renderer_Time_Picker extends \Fieldset_Field
{
    static protected $DEFAULT_RENDERER_OPTIONS = array(
        'timeFormat' => 'hh:mm',
        'separator' => ' ',
    );

    public function __construct($name, $label = '', array $renderer = array(), array $rules = array(), \Fuel\Core\Fieldset $fieldset = null)
    {
        list($attributes, $this->options) = static::parse_options($renderer);
        parent::__construct($name, $label, $attributes, $rules, $fieldset);
    }

    public static function renderer($renderer = array())
    {
        list($attributes, $renderer_options) = static::parse_options($renderer);
        $attributes['data-timepicker-options'] = htmlspecialchars(\Format::forge()->to_json($renderer_options));

        return '<input '.array_to_attr($attributes).' />'.static::js_init($attributes['id']);
    }

    /**
     * Parse the renderer array to get attributes and the renderer options
     * @param  array $renderer
     * @return array 0: attributes, 1: renderer options
     */
    protected static function parse_options($attributes = array())
    {
        $attributes['type'] = 'text';
        $attributes['class'] = (isset($attributes['class']) ? $attributes['class'] : '').' timepicker';

        if (empty($attributes['id'])) {
            $attributes['id'] = uniqid('date_');
        }

        $renderer_options = static::$DEFAULT_RENDERER_OPTIONS;

        if (!empty($attributes['renderer_options'])) {
            $renderer_options = \Arr::merge($renderer_options, $attributes['renderer_options']);
        }
        unset($attributes['renderer_options']);

        if (empty($attributes['size'])) {
            $attributes['size'] = 5;
        }

        return array($attributes, $renderer_options);
    }
    /**
     * How to display the field
     * @return string
     */
    public function build()
    {
        parent::build();

        $this->fieldset()->append($this->js_init($this->get_attribute('id')));
        $timepicker_options = $this->options;
        $this->set_attribute('data-timepicker-options', htmlspecialchars(\Format::forge()->to_json($timepicker_options)));

        return (string) parent::build();
    }

    public function js_init($id)
    {
        return \View::forge(
            'renderer/time_picker',
            array(
                'id' => $id,
            ),
            false
        );
    }

}
