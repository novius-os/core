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

class Widget_Media extends \Fieldset_Field
{
    /**
     * Standalone build of the media widget.
     *
     * @param  array  $widget Widget definition (attributes + widget_options)
     * @return string The <input> tag + JavaScript to initialise it
     */
    public static function widget($widget = array())
    {
        list($attributes, $widget_options) = static::parse_options($widget);
        static::hydrate_options($widget_options, isset($attributes['value']) ? $attributes['value'] : null);
        $attributes['data-media-options'] = htmlspecialchars(\Format::forge()->to_json($widget_options));

        return '<input '.array_to_attr($attributes).' />'.static::js_init($attributes['id']);
    }

    protected $options = array();

    public function __construct($name, $label = '', array $widget = array(), array $rules = array(), \Fuel\Core\Fieldset $fieldset = null)
    {
        list($attributes, $this->options) = static::parse_options($widget);
        parent::__construct($name, $label, $attributes, $rules, $fieldset);
    }

    /**
     * How to display the field
     * @return type
     */
    public function build()
    {
        parent::build();
        $this->fieldset()->append(static::js_init($this->get_attribute('id')));
        static::hydrate_options($this->options, $this->value);
        $this->set_attribute('data-media-options', htmlspecialchars(\Format::forge()->to_json($this->options)));

        return (string) parent::build();
    }

    /**
     * Parse the widget array to get attributes and the widget options
     * @param  array $widget
     * @return array 0: attributes, 1: widget options
     */
    protected static function parse_options($widget = array())
    {
        $widget['class'] = (isset($widget['class']) ? $widget['class'] : '').' media';

        if (empty($widget['id'])) {
            $widget['id'] = uniqid('media_');
        }

        // Default options of the widget
        $widget_options = array(
            'mode' => 'image',
            'inputFileThumb' => array(
                'title' => __('Image from the media library'),
            ),
        );

        if (!empty($widget['widget_options'])) {
            $widget_options = \Arr::merge($widget_options, $widget['widget_options']);
        }
        unset($widget['widget_options']);

        return array($widget, $widget_options);
    }

    /**
     * Hydrate the options array to fill in the media URL for the specified value
     * @param array $options
     * @param int   $media_id
     */
    protected static function hydrate_options(&$options, $media_id = null)
    {
        if (!empty($media_id)) {
            $media = \Nos\Media\Model_Media::find($media_id);
            if (!empty($media)) {
                $options['inputFileThumb']['file'] = $media->get_public_path_resized(64, 64);
            }
        }
    }

    /**
     * Generates the JavaScript to initialise the widget
     *
     * @param   string  HTML ID attribute of the <input> tag
     * @return string JavaScript to execute to initialise the widget
     */
    protected static function js_init($id)
    {
        return \View::forge('widget/media', array(
            'id' => $id,
        ), false);
    }
}
