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

class Renderer_Date_Picker extends Renderer
{
    protected static $DEFAULT_RENDERER_OPTIONS = array(
        'datepicker' => array(
            'showOn' => 'both',
            'buttonImage' => 'static/novius-os/admin/novius-os/img/icons/date-picker.png',
            'buttonImageOnly' => true,
            'autoSize' => true,
            'dateFormat' => 'yy-mm-dd', // MySQL formatting
            'altFormat' => 'dd/mm/yy', // Custom user formatting
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
     * Standalone build of the renderer.
     *
     * @param  array  $renderer Renderer definition (attributes + renderer_options)
     * @return string The <input> tag + JavaScript to initialise it
     */
    public static function renderer($renderer = array())
    {
        $renderer['renderer'] = __CLASS__;
        $fieldset = \Fieldset::build_from_config(array(
            $renderer['name'] => $renderer,
        ));
        return $fieldset->field($renderer['name'])->set_template('{field}')->build().$fieldset->build_append();
    }

    /**
     * Build the field
     *
     * @return  string
     */
    public function build()
    {
        parent::build();
        $attributes = $this->attributes;
        $datepicker_options = $this->renderer_options['datepicker'];
        $this->attributes = array();
        $this->set_attribute(array(
            'type' => 'hidden',
            'id' => $attributes['id'],
            'data-datepicker-options' => htmlspecialchars(\Format::forge()->to_json($datepicker_options)),
        ));
        $this->fieldset()->append(static::js_init($attributes['id'], $this->renderer_options));
        $attributes['type'] = 'text';
        $attributes['id'] = ltrim($datepicker_options['altField'], '#');
        unset($attributes['value']);

        $build = $this->template((string) parent::build());
        // A bit hacky, but can't see another way to keep the template
        $build = str_replace('<input ', '<input '.array_to_attr($attributes).' /><input ', $build);
        // Can't do something else here, since the label's ID is generated (late) within the parent::template() method.
        $build = str_replace('for="'.$this->attributes['id'].'"', 'for="'.$attributes['id'].'"', $build);

        return $build;
    }

    /**
     * Parse the renderer array to get attributes and the renderer options
     * @param  array $renderer
     * @return array 0: attributes, 1: renderer options
     */
    protected static function parseOptions($renderer = array())
    {
        $renderer['type'] = 'hidden';
        $renderer['class'] = (isset($renderer['class']) ? $renderer['class'] : '').' datepicker';

        if (empty($renderer['id'])) {
            $renderer['id'] = uniqid('datepicker_');
        }

        if (empty($renderer['size'])) {
            $renderer['size'] = 9;
        }

        list($renderer, $renderer_options) = parent::parseOptions($renderer);

        if (empty($renderer_options['datepicker']['altField'])) {
            $renderer_options['datepicker']['altField'] = '#alt_'.$renderer['id'];
        }

        return array($renderer, $renderer_options);
    }

    /**
     * Generates the JavaScript to initialise the renderer
     *
     * @param string $id ID attribute of the <input> tag
     * @param array $renderer_options The renderer options
     * @return string JavaScript to execute to initialise the renderer
     */
    protected static function js_init($id, $renderer_options = array())
    {
        return \View::forge('renderer/date_picker', array(
            'id' => $id,
            'wrapper' => \Arr::get($renderer_options, 'wrapper', ''),
        ), false);
    }
}
