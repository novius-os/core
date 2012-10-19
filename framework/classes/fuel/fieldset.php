<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Fieldset extends \Fuel\Core\Fieldset
{
    protected $append = array();
    protected $config_used = array();
    protected $js_validation = false;

    public function append($content)
    {
        $this->append[] = $content;
    }

    public function open($action = null)
    {
        $attributes = $this->get_config('form_attributes');
        if (empty($attributes['id'])) {
            $attributes['id'] = uniqid('form_');
            $this->set_config('form_attributes', $attributes);
        }
        if ($action and ($this->fieldset_tag == 'form' or empty($this->fieldset_tag))) {
            $attributes['action'] = $action;
        }

        $open = ($this->fieldset_tag == 'form' or empty($this->fieldset_tag))
            ? $this->form()->open($attributes).PHP_EOL
            : $this->form()->{$this->fieldset_tag.'_open'}($attributes);

        return $open;
    }

    public function build($action = null)
    {
        $build = parent::build($action);

        return $build.$this->build_append();
    }

    public function close()
    {
        $close = ($this->fieldset_tag == 'form' or empty($this->fieldset_tag))
            ? $this->form()->close().PHP_EOL
            : $this->form()->{$this->fieldset_tag.'_close'}();

        return $close.$this->build_append();
    }

    public function build_hidden_fields()
    {
        $output = '';
        foreach ($this->field() as $field) {
            if (false != mb_strpos(get_class($field), 'Widget_')) {
                continue;
            }
            if ($field->type == 'hidden') {
                $output .= $field->build();
            }
        }

        return $output;
    }

    protected function build_append()
    {
        $json = array();
        if ($this->js_validation) {
            foreach ($this->fields as $f) {

                $rules = $f->rules;

                if (empty($rules)) {
                    continue;
                }

                foreach ($rules as $rule) {
                    if (empty($rule)) {
                        continue;
                    }

                    list($name, $args) = $rule;
                    is_array($name) and $name = reset($name);

                    list($js_name, $js_args) = $this->format_js_validation($name, $args);
                    if (empty($js_name)) {
                        continue;
                    }
                    $json['rules'][$f->name][$js_name] = $js_args;

                    // Computes the error message, replacing :args placeholders with {n}
                    $error = new \Validation_Error($f, '', array($name => ''), array());
                    $error = $error->get_message();
                    preg_match_all('`:param:(\d+)`u', $error, $m);
                    foreach ($m[1] as $int) {
                        $error = str_replace(':param:'.$int, '{' . ($int - 1).'}', $error);
                    }
                    $json['messages'][$f->name][$js_name] = $error;
                }
            }
        }

        $append = array();
        foreach ($this->append as $a) {
            if (is_callable($a)) {
                $append[] = call_user_func($a, $this);
            } else {
                $append[] = $a;
            }
        }
        $form_attributes = $this->get_config('form_attributes', array());
        $append[] = (string) \View::forge('form/fieldset_js', array(
            'id' => $form_attributes['id'],
            'rules' => \Format::forge()->to_json($json),
        ), false);

        return implode('', $append);
    }

    public function form_name($value)
    {
        if ($field = $this->field('form_name')) {
            return $field->value == $value;
        }
        $this->add('form_name', '', array('type' => 'hidden', 'value' => $value));
    }

    /**
     *
     * @param   \Fuel\Core\Fieldset_Field  $field  A field instance
     * @return  \Fuel\Core\Fieldset_Field
     */
    public function add_field(\Fuel\Core\Fieldset_Field $field)
    {
        $name = $field->name;
        if (empty($name)) {
            throw new \InvalidArgumentException('Cannot create field without name.');
        }

        // Check if it exists already, if so: return and give notice
        if ($existing = static::field($name)) {
            \Error::notice('Field with this name "'.$name.'" exists already, cannot be overwritten through add().');
            return $existing;
        }

        // Make sure fieldset is current
        if ($field->fieldset() != $this) {
            \Error::notice('A field added through add() must have the correct parent fieldset.');
            return false;
        }
        $this->fields[$name] = $field;

        return $field;
    }

    /**
     * Override default populate() to allow widgets populate themselves
     * @param   array|object  The whole input array
     * @param   bool          Also repopulate?
     * @return  Fieldset this, to allow chaining
     */
    public function populate($input, $repopulate = false)
    {
        foreach ($this->fields as $f) {
            $class = mb_strtolower(\Inflector::denamespace(get_class($f)));
            if (mb_substr($class, 0, 6) == 'widget' && isset($input->{$f->name})) {
                $f->populate($input);
            }
        }
        return parent::populate($input, $repopulate);
    }

    /**
     * Override default repopulate() to allow widgets populate themselves
     *
     * @param   array|object  input for initial population of fields, this is deprecated - you should use populate() instea
     * @return  Fieldset  this, to allow chaining
     */
    public function repopulate()
    {
        $input = mb_strtolower($this->form()->get_attribute('method', 'post')) == 'get' ? \Input::get() : \Input::post();

        foreach ($this->fields as $f) {
            if ($f->type == 'checkbox' && !isset($input[$f->name])) {
                $f->set_attribute('checked', null);
            }

            // Don't repopulate the CSRF field
            if ($f->name === \Config::get('security.csrf_token_key', 'fuel_csrf_token')) {
                continue;
            }
            if (mb_substr(mb_strtolower(\Inflector::denamespace(get_class($f))), 0, 6) == 'widget') {
                // Widgets populates themselves
                $f->repopulate($input);
            }
        }

        parent::repopulate(); //return parent::populate($input);
    }

    /**
     * Get populated values
     *
     * @param    string         null to fetch an array of all
     * @return    array|false     returns false when field wasn't found
     */
    public function value($name = null)
    {
        if ($name === null) {
            $values = array();
            foreach ($this->fields as $f) {

                if ($f->type == 'checkbox' && $f->get_attribute('checked') == null) {
                    $values[$f->name] = null;
                } else {
                    $values[$f->name] = $f->value;
                }
            }

            return $values;
        }
        return $this->field($name)->value;
    }

    /**
     * Set a Model's properties as fields on a Fieldset, which will be created with the Model's
     * classname if none is provided.
     *
     * @param   string
     * @param   Fieldset|null
     * @return  Fieldset
     */
    public function add_model_widgets($class, $instance = null, $options = array())
    {
        if (is_object($class)) {
            $instance = $class;
            $class = get_class($class);
            $options = $instance;
        }

        $properties = is_object($instance) ? $instance->properties() : $class::properties();
        $this->add_widgets($properties);

        $instance and $this->populate($instance);

        return $this;
    }

    public function add_widgets($properties, $options = array())
    {
        $this->config_used = $properties;

        foreach ($properties as $p => $settings) {
            if (!empty($options['action']) && isset($settings[$options['action']]) && false === $settings[$options['action']]) {
                continue;
            }

            $label      = isset($settings['label']) ? $settings['label'] : $p;
            $attributes = isset($settings['form']) ? $settings['form'] : array();
            if (!empty($settings['widget'])) {
                 $class = $settings['widget'];
                 $attributes['widget_options'] = \Arr::get($settings, 'widget_options', array());
                 $field = new $class($p, $label, $attributes, array(), $this);
                 $this->add_field($field);
            } else {
                if (\Arr::get($attributes, 'type', '') == 'checkbox') {
                    unset($attributes['empty']);
                }
                $field = $this->add($p, $label, $attributes);
            }
            if (isset($settings['template'])) {
                $field->set_template($settings['template']);
            }
            if ( ! empty($settings['validation'])) {
                foreach ($settings['validation'] as $rule => $args) {
                    if (is_int($rule) and is_string($args)) {
                        $args = array($args);
                    } else {
                        array_unshift($args, $rule);
                    }

                    call_user_func_array(array($field, 'add_rule'), $args);
                }
            }
        }
    }

    public function format_js_validation($name, $args)
    {
        static $i = 1;

        if ($name == 'required') {
            return array('required', true);
        }

        if ($name == 'min_length') {
            return array('minlength', $args[0]);
        }

        if ($name == 'max_length') {
            return array('maxlength', $args[0]);
        }

        if ($name == 'exact_length') {
            return array('length', $args[0]);
        }

        if ($name == 'match_field') {
            $field_id = $this->field($args[0])->get_attribute('id');
            if (empty($field_id)) {
                $field_id = 'field_id_'.$i++;
                $this->field($args[0])->set_attribute('id', $field_id);
            }
            return array('equalTo', '#'.$field_id);
        }

        if ($name == 'valid_email') {
            return array('email', true);
        }

        return false;
        return array($name, $args);
    }

    public function js_validation($validation = true)
    {
        $this->js_validation = $validation;
    }

    public static function build_from_config($config, $model = null, $options = array())
    {
        $instance = null;
        if (is_object($model)) {
            $instance = $model;
            empty($options['action']) && $options['action'] = 'edit';
        } elseif (is_string($model)) {
            $instance = null;
            empty($options['action']) && $options['action'] = 'add';
        } elseif (is_array($model)) {
            $options = $model;
            $instance = null;
        }
        $options['instance'] = $instance;

        $options = \Arr::merge(array(
            'save' => \Input::method() == 'POST',
        ), $options);

        $fieldset = \Fieldset::forge(uniqid(), array(
            'inline_errors'  => true,
            'auto_id'		 => true,
            'required_mark'  => '&nbsp;<span style="font-size: 1.5em; line-height: 1em; font-weight: bold">*</span>',
            'error_template' => '{error_msg}',
            'error_class'    => 'error',
            'form_template' => "\n\t\t{open}\n\t\t<table class=\"fieldset\">\n{fields}\n\t\t</table>\n\t\t{close}\n",
        ));

        if (!empty($options['form_name'])) {
            $fieldset->form_name($options['form_name']);
        }

        if (isset($instance)) {
            // Let behaviours do their job (publication for example)
            $instance->form_fieldset_fields($config);
        }

        $fieldset->add_widgets($config, $options);

        if (!empty($options['extend']) && is_callable($options['extend'])) {
            call_user_func($options['extend'], $fieldset);
        }

        if (isset($instance)) {
            $fieldset->populate_with_instance($instance);
        }

        $options['fieldset'] = $fieldset;

        if ($options['save'] && (empty($options['form_name']) || \Input::post('form_name') == $options['form_name'])) {
            $fieldset->repopulate();
            if ($fieldset->validation()->run($fieldset->value())) {
                $data = $fieldset->validated();
                if (!empty($options['complete']) && is_callable($options['complete'])) {
                    $json = call_user_func($options['complete'], $data, $model, $config, $options);
                } else {
                    $json = static::defaultComplete($data, $model, $config, $options);
                }
                \Response::json($json);
            } else {
                 \Response::json(array(
                    'error' => (string) current($fieldset->error()),
                    'config' => $config,
                ));
            }
        }
        return $fieldset;
    }

    public function readonly_context($instance)
    {
        if (empty($instance)) {
            return;
        }
        $behaviour_contextableAndTwinnable = $instance->behaviours('Nos\Orm_Behaviour_ContextableAndTwinnable');
        if (empty($behaviour_contextableAndTwinnable) || $instance->is_main_context()) {
            return;
        }
        foreach ($behaviour_contextableAndTwinnable['invariant_fields'] as $f) {
            $field = $this->field($f);
            if (!empty($field)) {
                $field->set_attribute('readonly', true);
                $field->set_attribute('disabled', true);
            }
        }
    }

    public function populate_with_instance($instance = null, $generate_id = true)
    {
        if ($generate_id) {
            $uniqid = uniqid();
            // Generate a new ID for the form
            $form_attributes = $this->get_config('form_attributes', array());
            $form_attributes['id'] = 'form_id_'.$uniqid;
            $this->set_config('auto_id_prefix', 'form'.$uniqid.'_');
            $this->set_config('form_attributes', $form_attributes);
            foreach ($this->fields as $field) {
                $id = $field->get_attribute('id');
                if (!empty($id)) {
                    $field->set_attribute('id', '');
                }
            }
        }

        if (empty($instance)) {
            return;
        }

        $populate = array();

        foreach ($this->fields as $k => $f) {
            $populateCallback = \Arr::get($this->config_used, "$k.populate");
            if ($populateCallback && is_callable($populateCallback)) {
                $populate[$k] = call_user_func($populateCallback, $instance);
                continue;
            }

            // Don't populate password fields
            if (\Arr::get($this->config_used, "$k.form.type") == 'password') {
                continue;
            }
            // Don't populate some fields (for example, the context)
            if (\Arr::get($this->config_used, "$k.dont_populate", false) == true) {
                continue;
            }
            if (!isset($instance->{$k})) {
                continue;
            }

            //if (isset($instance->{$k})) {
            $populate[$k] = $instance->{$k};
            //}
        }

        $this->populate($populate);
    }

    public static function defaultComplete($data, $item, $fields, $options)
    {
        if (isset($options['fieldset'])) {
            $fieldset = $options['fieldset'];
        } else {
            $fieldset = false;
        }
        if (!is_object($item)) {
            return;
        }

        if (empty($options['error'])) {
            $options['error'] = function(\Exception $e, $item, $data) {
                return array(
                    'error' => \Fuel::$env == \Fuel::DEVELOPMENT ? $e->getMessage() : 'An error occured.',
                );
            };
        }

        $json_response = array();

        $pk = $item->primary_key();

        // Will trigger cascade_save for media and wysiwyg
        try {

            foreach ($fields as $name => $config) {
                if (!empty($config['widget']) && in_array($config['widget'], array('Nos\Widget_Text', 'Nos\Widget_Empty'))) {
                    continue;
                }
                $type = \Arr::get($config, 'form.type', null);

                if ($type == 'submit') {
                    continue;
                }

                if (isset($config['dont_save']) && $config['dont_save']) {
                    continue;
                }

                if (!empty($config['widget']) && !$options['fieldset']->fields[$name]->before_save($item, $data)) {
                    continue;
                }

                if (!empty($config['before_save']) && is_callable($config['before_save'])) {
                    call_user_func($config['before_save'], $item, $data);
                } else {
                    if ($type == 'checkbox' && empty($data[$name])) {
                        $item->$name = \Arr::get($config, 'form.empty', null);

                    } elseif (isset($data[$name]) && !in_array($name, $pk)) {
                        $item->$name = $data[$name];
                    }
                }
            }

            // Let behaviours do their job (publication for example)
            $item->form_processing_behaviours($data, $json_response);

            if (!empty($options['before_save']) && is_callable($options['before_save'])) {
                call_user_func($options['before_save'], $item, $data);
            }

            if (!empty($options['success']) && is_callable($options['success'])) {
                if ($item->is_new()) {
                    // The callback is called after save() to access the ID
                    $item->save();
                    $json_user = call_user_func($options['success'], $item, $data);
                } else {
                    // The callback is called before save() to allow a check for is_changed() properties
                    $json_user = call_user_func($options['success'], $item, $data);
                    $item->save();
                }
                $json_response = \Arr::merge($json_response, $json_user);
            } else {
                $item->save();
                $json_response['notify'] = __('Operation completed successfully.');
            }

            foreach ($fields as $name => $config) {
                if (!empty($config['widget']) && in_array($config['widget'], array('Nos\Widget_Text', 'Nos\Widget_Empty'))) {
                    continue;
                }
                $type = \Arr::get($config, 'form.type', null);

                if ($type == 'submit') {
                    continue;
                }

                if (!empty($config['success']) && is_callable($config['success'])) {
                    $json_field = call_user_func($config['success'], $item, $data);
                    $json_response = \Arr::merge($json_response, $json_field);
                }
            }

        } catch (Exception $e) {
            if (empty($options['error']) && is_callable($options['error'])) {
                $json_response = call_user_func($options['error'], $e, $item, $data);
            } else {
                $json_response['error'] = $e->getMessage();
            }
        }

        return $json_response;
    }
}
