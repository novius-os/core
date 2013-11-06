<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Media;

class Renderer_Media extends \Nos\Renderer
{
    protected static $DEFAULT_RENDERER_OPTIONS = array(
        'mode' => 'image',
        'inputFileThumb' => array(
            'title' => 'Image from the Media Centre',
            'texts' => array(
                'add'            => 'Pick an image',
                'edit'           => 'Pick another image',
                'delete'         => 'No image',
                'wrongExtension' => 'This extension is not allowed.',
            ),
        ),
    );

    public static function _init()
    {
        \Nos\I18n::current_dictionary(array('noviusos_media::common', 'nos::common'));

        // Translate default options of the renderer
        static::$DEFAULT_RENDERER_OPTIONS['inputFileThumb'] = array(
            'title' => __('Image from the Media Centre'),
            'texts' => array(
                'add'            => __('Pick an image'),
                'edit'           => __('Pick another image'),
                'delete'         => __('No image'),
                'wrongExtension' => __('This extension is not allowed.'),
            ),
        );
    }
    /**
     * Standalone build of the media renderer.
     *
     * @param  array  $renderer Renderer definition (attributes + renderer_options)
     * @return string The <input> tag + JavaScript to initialise it
     */
    public static function renderer($renderer = array())
    {
        list($attributes, $renderer_options) = static::parseOptions($renderer);
        static::hydrate_options($renderer_options, $attributes);
        $attributes['data-media-options'] = htmlspecialchars(\Format::forge()->to_json($renderer_options));

        return '<input '.array_to_attr($attributes).' />'.static::js_init($attributes['id']);
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
        static::hydrate_options($this->renderer_options, array(
            'value' => $this->value,
            'required' => isset($this->rules['required']),
        ));
        $this->set_attribute('data-media-options', htmlspecialchars(\Format::forge()->to_json($this->renderer_options)));

        return (string) parent::build();
    }


    /**
     * Parse the renderer array to get attributes and the renderer options
     * @param  array $renderer
     * @return array 0: attributes, 1: renderer options
     */
    protected static function parse_options($renderer = array())
    {
        \Log::deprecated('Renderer_Media::parse_options($renderer) is deprecated, '.
            'use Renderer_Media::parseOptions($renderer) instead.', 'Chiba.2.1');
        return static::parseOptions($renderer);
    }

    /**
     * Parse the renderer array to get attributes and the renderer options
     * @param  array $renderer
     * @return array 0: attributes, 1: renderer options
     */
    protected static function parseOptions($renderer = array())
    {
        $renderer['class'] = (isset($renderer['class']) ? $renderer['class'] : '').' media';

        if (empty($renderer['id'])) {
            $renderer['id'] = uniqid('media_');
        }

        return parent::parseOptions($renderer);
    }

    /**
     * Hydrate the options array to fill in the media URL for the specified value
     * @param array $options
     * @param array $attributes
     */
    protected static function hydrate_options(&$options, $attributes = array())
    {
        if (!empty($attributes['value'])) {
            $media = Model_Media::find($attributes['value']);
            if (!empty($media)) {
                $options['inputFileThumb']['file'] = $media->isImage() ? $media->urlResized(64, 64) : $media->url();
            }
        }
        if (!empty($attributes['required'])) {
            $options['inputFileThumb']['allowDelete'] = false;
        }
    }

    /**
     * Generates the JavaScript to initialise the renderer
     *
     * @param   string  HTML ID attribute of the <input> tag
     * @return string JavaScript to execute to initialise the renderer
     */
    protected static function js_init($id)
    {
        return \View::forge('renderer/media', array(
            'id' => $id,
        ), false);
    }
}
