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

class Renderer_Virtualname extends Renderer
{
    protected static $_friendly_slug_always_last = array();

    public static function _init()
    {
        \Config::load('friendly_slug', true);
        static::$_friendly_slug_always_last = \Config::get('friendly_slug.always_last');
    }

    public $template = '{label}{required} <div class="table-field">{field} <span>&nbsp;.html</span></div> {use_title_checkbox}';

    /**
     * Build the field
     *
     * @return  string
     */
    public function build()
    {
        parent::build();
        if ($this->fieldset) {
            $field_properties = $this->fieldset->getInstance()->property($this->name);
            if (isset($field_properties['character_maximum_length'])) {
                $this->attributes['maxlength'] = $field_properties['character_maximum_length'];
            }
        }

        $this->apply_use_title_checkbox();

        $this->fieldset()->append($this->js_init());

        if ($this->fieldset()->getInstance()->is_new()) {
            $this->set_attribute('data-usetitle', 1);
        }

        return (string) parent::build();
    }

    public function apply_use_title_checkbox()
    {
        $use_title_checkbox = \View::forge('renderer/virtualname/use_title_checkbox', array(
            'id' => $this->get_attribute('id'),
        ), false);
        $this->template = str_replace('{use_title_checkbox}', $use_title_checkbox, $this->template);

    }

    /**
     * Generates the JavaScript to initialise the renderer
     *
     * @return string JavaScript to execute to initialise the renderer
     */
    public function js_init()
    {
        $default = \Config::get('friendly_slug.active_setup', 'default');
        $options = array(
            \Config::get('friendly_slug.setups.'.$default, array())
        );
        $this->fieldset()->getInstance()->event('friendlySlug', array(&$options));
        $options[] = static::$_friendly_slug_always_last;

        $options_compiled = array();
        foreach ($options as $regexps) {
            $options_compiled[] = static::_regexpsCompiled($regexps);
        }

        // Gets the controller url
        $controller_url = $this->getControllerUrl();

        // Gets the field id
        $field_id = $this->get_attribute('id');

        return \View::forge('renderer/virtualname/js', array(
            'id' => $this->get_attribute('id'),
            'options' => $options_compiled,
            'config' => array(
                'id' => $field_id,
                'controller_url' => $controller_url,
                'item_id' => $this->fieldset()->getInstance()->id,
            ),
        ), false);
    }

    /**
     * Gets the controller url for the ajax request
     *
     * @return mixed
     */
    public function getControllerUrl()
    {
        // Gets from the renderer options
        $controller_url = \Arr::get($this->renderer_options, 'controller_url');
        if (empty($controller_url)) {
            // Otherwise try to get from the main controller config
            $main_controller = \Nos\Nos::main_controller();
            list($app, $file_name) = \Config::configFile(get_class($main_controller));
            $config = \Config::load($app.'::'.$file_name, true);
            $controller_url = \Arr::get($config, 'controller_url');
            $controller_url .= '/virtualname';
        }

        return $controller_url;
    }

    protected static function _regexpsCompiled($regexps)
    {
        $regexps_compiled = array();
        foreach ($regexps as $regexp => $replacement) {
            if (is_int($regexp) && is_string($replacement) && $replacement !== 'lowercase') {
                $setup_regexps = \Config::get('friendly_slug.setups.'.$replacement, array());
                $regexps_compiled = array_merge($regexps_compiled, static::_regexpsCompiled($setup_regexps));
            } else {
                $regexps_compiled[$regexp] = $replacement;
            }
        }
        return $regexps_compiled;
    }
}
