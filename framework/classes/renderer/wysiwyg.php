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

class Renderer_Wysiwyg extends Renderer
{
    /**
     * Standalone build of the wysiwyg renderer.
     *
     * @param  array  $renderer Renderer definition (attributes + renderer_options)
     * @return string The <textarea> tag + JavaScript to initialise it
     */
    public static function renderer($renderer = array())
    {
        list($attributes, $renderer_options) = static::parseOptions($renderer);

        $value = '';
        if (!empty($attributes['value'])) {
            $value = $attributes['value'];
            unset($attributes['value']);
        }

        if (!empty($renderer_options)) {
            $attributes['data-wysiwyg-options'] = htmlspecialchars(\Format::forge()->to_json($renderer_options));
        }

        // Need to encode twice since timymce decodes its content one time (bug fix added for the enhancer bug)
        $value = htmlspecialchars($value);

        return '<textarea '.array_to_attr($attributes).'>'.$value.'</textarea>'.
            static::js_init($attributes['id'], $renderer_options);
    }

    /**
     * Build the field
     *
     * @return  string
     */
    public function build()
    {
        parent::build();
        $this->fieldset()->append(static::js_init($this->get_attribute('id')));

        $this->renderer_options = Tools_Wysiwyg::jsOptions($this->renderer_options, $this->fieldset()->getInstance());

        $this->value = Tools_Wysiwyg::prepare_renderer($this->value);
        $this->set_attribute('data-wysiwyg-options', htmlspecialchars(\Format::forge()->to_json($this->renderer_options)));

        // Need to encode twice since timymce decodes its content one time (bug fix added for the enhancer bug)
        $this->value = htmlspecialchars($this->value);
        return (string) parent::build();
    }

    /**
     * Parse the renderer array to get attributes and the renderer options
     * @param  array $renderer
     * @return array 0: attributes, 1: renderer options
     */
    protected static function parseOptions($renderer = array())
    {
        $renderer['type']  = 'textarea';
        $renderer['class'] = (isset($renderer['class']) ? $renderer['class'] : '').' tinymce not_initialized';

        if (empty($renderer['id'])) {
            $renderer['id'] = uniqid('wysiwyg_');
        }

        // Default options of the renderer
        $renderer_options = static::_nosToAdvanced(Tools_Wysiwyg::jsOptions());

        if (!empty($renderer['renderer_options'])) {
            $renderer['renderer_options'] = static::_nosToAdvanced($renderer['renderer_options']);
            $renderer_options = \Arr::merge($renderer_options, $renderer['renderer_options']);
        }
        $renderer_options['language'] = substr(\Session::user()->user_lang, 0, 2);
        unset($renderer['renderer_options']);

        return array($renderer, $renderer_options);
    }

    private static function _nosToAdvanced($options)
    {
        if (\Arr::get($options, 'theme') === 'advanced') {
            \Log::deprecated(
                'WYSIWYG theme option "advanced" are deprecated, please use theme "nos".',
                'Dubrovka'
            );
            $options['theme'] = 'nos';
        }
        $deprecated = \Arr::filter_prefixed($options, 'theme_nos_', false);
        if (!empty($deprecated)) {
            \Log::deprecated(
                'WYSIWYG options prefixed by "theme_nos_" are deprecated '.
                '('.implode(', ', array_keys($deprecated)).'), '.
                'please replace by prefixe "theme_advanced_".',
                'Dubrovka'
            );
            foreach ($deprecated as $key => $value) {
                $options[str_replace('theme_nos_', 'theme_advanced_', $key)] = $value;
                unset($options[$key]);
            }
        }
        return $options;
    }

    /**
     * Generates the JavaScript to initialise the renderer
     *
     * @param string $id ID attribute of the <input> tag
     * @param array $renderer_options The renderer options
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
