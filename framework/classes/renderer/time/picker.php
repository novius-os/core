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

class Renderer_Time_Picker extends Renderer
{
    static protected $DEFAULT_RENDERER_OPTIONS = array(
        'timeFormat' => 'HH:mm',
    );

    /**
     * Standalone build of the renderer.
     *
     * @param  array  $renderer Renderer definition (attributes + renderer_options)
     * @return string The <input> tag + JavaScript to initialise it
     */
    public static function renderer($renderer = array())
    {
        list($attributes, $renderer_options) = static::parseOptions($renderer);
        $attributes['data-timepicker-options'] = htmlspecialchars(\Format::forge()->to_json($renderer_options));

        return '<input '.array_to_attr($attributes).' />'.static::js_init($attributes['id']);
    }

    /**
     * Parse the renderer array to get attributes and the renderer options
     * @param  array $renderer
     * @return array 0: attributes, 1: renderer options
     */
    protected static function parseOptions($renderer = array())
    {
        $renderer['type'] = 'text';
        $renderer['class'] = (isset($renderer['class']) ? $renderer['class'] : '').' timepicker';

        if (empty($renderer['id'])) {
            $renderer['id'] = uniqid('date_');
        }

        list($renderer, $renderer_options) = parent::parseOptions($renderer);

        if (empty($renderer['size'])) {
            $renderer['size'] = 5;
        }

        return array($renderer, $renderer_options);
    }

    /**
     * Build the field
     *
     * @return  string
     */
    public function build()
    {
        parent::build();

        $this->fieldset()->append($this->js_init($this->get_attribute('id')));
        $timepicker_options = $this->renderer_options;
        $this->set_attribute('data-timepicker-options', htmlspecialchars(\Format::forge()->to_json($timepicker_options)));

        return (string) parent::build();
    }

    /**
     * Generates the JavaScript to initialise the renderer
     *
     * @param string $id ID attribute of the <input> tag
     * @return string JavaScript to execute to initialise the renderer
     */
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
