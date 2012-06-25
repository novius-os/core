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

class Widget_Date_Picker extends \Fieldset_Field
{
    protected static $DEFAULT_WIDGET_OPTIONS = array(
        'datepicker' => array(
            'showOn' => 'both',
            'buttonImage' => 'static/novius-os/admin/novius-os/img/icons/date-picker.png',
            'buttonImageOnly' => true,
            'autoSize' => true,
            'dateFormat' => 'yy-mm-dd',
            'showButtonPanel' => true,
            'changeMonth' => true,
            'changeYear' => true,
            'showOtherMonths' => true,
            'selectOtherMonths' => true,
            'gotoCurrent' => true,
            'firstDay' => 1,
            'showAnim' => 'slideDown',
        ),
        'wrapper' => '', //'<div class="datepicker-wrapper"></div>',
    );

    /**
     * Standalone build of the media widget.
     *
     * @param   array   $widget  Widget definition (attributes + widget_options)
     * @return  string  The <input> tag + JavaScript to initialise it
     */
    public static function widget($widget = array())
    {
        list($attributes, $widget_options) = static::parse_options($widget);
        $attributes['data-datepicker-options'] = htmlspecialchars(\Format::forge()->to_json($widget_options['datepicker']));
        return '<input '.array_to_attr($attributes).' />'.static::js_init($attributes['id'], $widget_options);
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
        $this->fieldset()->append(static::js_init($this->get_attribute('id'), $this->options));
        $datepicker_options = $this->options['datepicker'];
        $this->set_attribute('data-datepicker-options', htmlspecialchars(\Format::forge()->to_json($datepicker_options)));
        return (string) parent::build();
    }

    /**
     * Parse the widget array to get attributes and the widget options
     * @param   array  $widget
     * @return  array  0: attributes, 1: widget options
     */
    protected static function parse_options($widget = array())
    {
        $widget['type'] = 'text';
        $widget['class'] = (isset($widget['class']) ? $widget['class'] : '').' datepicker';

        if (empty($widget['id']))
        {
            $widget['id'] = uniqid('datepicker_');
        }

        if (empty($widget['size']))
        {
            $widget['size'] = 9;
        }

        // Default options of the widget
        $widget_options = static::$DEFAULT_WIDGET_OPTIONS;

        if (!empty($widget['widget_options']))
        {
            $widget_options = \Arr::merge($widget_options, $widget['widget_options']);
        }
        unset($widget['widget_options']);

        return array($widget, $widget_options);
    }


    /**
     * Generates the JavaScript to initialise the widget
     *
     * @param   string  HTML ID attribute of the <input> tag
     * @return  string  JavaScript to execute to initialise the widget
     */
    protected static function js_init($id, $widget_options = array())
    {
        return \View::forge('widget/date_picker', array(
            'id' => $id,
            'wrapper' => \Arr::get($widget_options, 'wrapper', ''),
        ), false);
    }
}


