<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Fieldset_Field extends \Fuel\Core\Fieldset_Field {

    public function populate($input, $repopulate = false) {
        if (is_array($input)) { // or $input instanceof \ArrayAccess
            if (isset($input[$this->name]))
            {
                $this->set_value($input[$this->name], true);
            }
        }
        elseif (is_object($input)) // and property_exists($input, $f->name)
        {
            $this->set_value($input->{$this->name}, true);
        }
    }

    public function repopulate(array $input) {

        // Don't repopulate the CSRF field
        if ($this->name === \Config::get('security.csrf_token_key', 'fuel_csrf_token'))
        {
            return;
        }
        if (($value = \Arr::get($input, $this->name, null)) !== null)
        {
           $this->set_value($value, true);
        }
    }

    public function generate_auto_id() {
        $form = $this->fieldset()->form();
        if ($form->get_config('auto_id', false) === true and $this->get_attribute('id') == '')
        {
            $auto_id = $form->get_config('auto_id_prefix', '').str_replace(array('[', ']', '->'), array('-', '', '_'), $this->name);
            $this->set_attribute('id', $auto_id);
        }
    }

    public function build()
    {
        $this->generate_auto_id();
        $required = $this->get_attribute('required', null);
        if ($required) {
            $label = $this->label;
            if (!is_array($label)) {
                $label = array('label' => $label);
            }
            if (empty($label['title'])) {
                $label['title'] = __('Mandatory');
            }
            $this->label = $label;
        }
        if (isset($this->attributes['widget_options'])) {
            $widget_options = $this->attributes['widget_options'];
            unset($this->attributes['widget_options']);
        }
        $return = parent::build();
        if (isset($widget_options)) {
            $this->attributes['widget_options'] = $widget_options;
        }

        return $return;
    }

    public function before_save($item, $data) {
        return true;
    }
}
