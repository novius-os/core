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

class Renderer_Wysiwyg extends \Fieldset_Field
{
    protected static $DEFAULT_RENDERER_OPTIONS = array(
        'language' => '', // en, fr or ja
    );

    public function __construct($name, $label = '', array $renderer = array(), array $rules = array(), \Fuel\Core\Fieldset $fieldset = null)
    {
        list($attributes, $this->options) = static::parse_options($renderer);
        parent::__construct($name, $label, $attributes, $rules, $fieldset);
    }

    /**
     * Standalone build of the wysiwyg renderer.
     *
     * @param  array  $renderer Renderer definition (attributes + renderer_options)
     * @return string The <textarea> tag + JavaScript to initialise it
     */
    public static function renderer($renderer = array())
    {
        list($attributes, $renderer_options) = static::parse_options($renderer);

        $value = '';
        if ( !empty($attributes['value']) ) {
            $value = $attributes['value'];
            unset($attributes['value']);
        }

        if ( !empty($renderer_options) ) {
            $attributes['data-wysiwyg-options'] = htmlspecialchars(\Format::forge()->to_json($renderer_options));
        }
        $value = htmlentities($value);

        return '<textarea '.array_to_attr($attributes).'>'.$value.'</textarea>'.static::js_init($attributes['id'], $renderer_options);
    }

    /**
     * How to display the field
     * @return string
     */
    public function build()
    {
        parent::build();
        $this->fieldset()->append(static::js_init($this->get_attribute('id')));

        $this->value = Tools_Wysiwyg::prepare_renderer($this->value);
        $this->set_attribute('data-wysiwyg-options', htmlspecialchars(\Format::forge()->to_json($this->options)));
        $this->value = htmlentities($this->value);
        return (string) parent::build();
    }

    /**
     * Parse the renderer array to get attributes and the renderer options
     * @param  array $renderer
     * @return array 0: attributes, 1: renderer options
     */
    protected static function parse_options($renderer = array())
    {
        $renderer['type']  = 'textarea';
        $renderer['class'] = (isset($renderer['class']) ? $renderer['class'] : '').' tinymce not_initialized';

        if (empty($renderer['id'])) {
            $renderer['id'] = uniqid('wysiwyg_');
        }

        // Default options of the renderer
        $renderer_options = static::$DEFAULT_RENDERER_OPTIONS;

        if (!empty($renderer['renderer_options'])) {
            $renderer_options = \Arr::merge($renderer_options, $renderer['renderer_options']);
        }
        $renderer_options['language'] = substr(\Session::user()->user_lang, 0, 2);
        unset($renderer['renderer_options']);

        return array($renderer, $renderer_options);
    }

    /**
     * Generates the JavaScript to initialise the renderer
     *
     * @param       $id
     * @param array $renderer_options
     *
     * @return string JavaScript to execute to initialise the renderer
     */
    public static function js_init($id, $renderer_options = array())
    {
        // we have to find why it's called two times...
        return \View::forge('renderer/wysiwyg', array(
            'id' => $id,
        ), false);
    }

}
