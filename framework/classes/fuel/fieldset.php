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
    protected $prepend = array();
    protected $config_used = array();
    protected $js_validation = false;
    protected $require_js = array();
    protected $instance = null;

    public function prepend($content)
    {
        $this->prepend[] = $content;
    }

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

        return $build.$this->build_append().$this->build_js_validation();
    }

    public function close()
    {
        $close = ($this->fieldset_tag == 'form' or empty($this->fieldset_tag))
            ? $this->form()->close().PHP_EOL
            : $this->form()->{$this->fieldset_tag.'_close'}();

        return $this->build_prepend().$close.$this->build_append().$this->build_js_validation();
    }

    public function build_hidden_fields()
    {
        $output = '';
        foreach ($this->field() as $field) {
            if (false != mb_strpos(get_class($field), 'Renderer_')) {
                continue;
            }
            if ($field->type == 'hidden') {
                $output .= $field->build();
            }
        }

        return $output;
    }

    public function build_prepend()
    {
        return $this->build_list($this->prepend);
    }

    public function build_append()
    {
        return $this->build_list($this->append);
    }

    public function build_list($list)
    {
        $append = array();

        foreach ($list as $a) {
            if (is_callable($a)) {
                $append[] = call_user_func($a, $this);
            } else {
                $append[] = $a;
            }
        }

        return implode('', $append);
    }

    public function build_js_validation()
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

        $form_attributes = $this->get_config('form_attributes', array());
        return (string) \View::forge('form/fieldset_js', array(
            'id' => $form_attributes['id'],
            'rules' => \Format::forge()->to_json($json),
            'require_js' => $this->require_js,
        ), false);
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
     * Override default populate() to allow renderers populate themselves
     * @param   array|object  The whole input array
     * @param   bool          Also repopulate?
     * @return  Fieldset this, to allow chaining
     */
    public function populate($input, $repopulate = false)
    {
        foreach ($this->fields as $f) {
            $class = mb_strtolower(\Inflector::denamespace(get_class($f)));
            if (mb_substr($class, 0, 8) == 'renderer' && isset($input->{$f->name})) {
                $f->populate($input);
            }
        }
        return parent::populate($input, $repopulate);
    }

    /**
     * Override default repopulate() to allow renderers populate themselves
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
            if (mb_substr(mb_strtolower(\Inflector::denamespace(get_class($f))), 0, 8) == 'renderer') {
                // Renderers populates themselves
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
    public function add_model_renderers($class, $instance = null, $options = array())
    {
        if (is_object($class)) {
            $instance = $class;
            $class = get_class($class);
            $options = $instance;
        }

        $properties = is_object($instance) ? $instance->properties() : $class::properties();
        $this->add_renderers($properties);

        $instance and $this->populate($instance);

        return $this;
    }

    public function add_renderers($properties, $options = array())
    {
        // Compatibility with 0.1 configuration (widgets have been renamed to renderers)
        foreach ($properties as &$property) {
            if (isset($property['widget'])) {
                \Log::deprecated('The widget key is deprecated ('.$property['widget'].'). Please use the renderer key and update class name.');

                $property['renderer'] = preg_replace('`^Nos(.+)Widget_(.+)$`', 'Nos$1Renderer_$2', $property['widget']);
                unset($property['widget']);
            }
            if (isset($property['widget_options'])) {
                \Log::deprecated('The widget_options key is deprecated. Please use the renderer_options key.');

                $property['renderer_options'] =& $property['widget_options'];
                unset($property['widget_options']);
            }
        }
        $this->config_used = $properties;

        foreach ($properties as $p => $settings) {
            if (!empty($options['action']) && isset($settings[$options['action']]) && false === $settings[$options['action']]) {
                continue;
            }

            $label      = isset($settings['label']) ? $settings['label'] : $p;
            $attributes = isset($settings['form']) ? $settings['form'] : array();
            if (!empty($settings['renderer'])) {
                $class = $settings['renderer'];
                $attributes['renderer_options'] = \Arr::get($settings, 'renderer_options', array());
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

    public function js_validation($require_js = array())
    {
        $this->js_validation = true;
        $this->require_js = array_merge($this->require_js, $require_js);
    }

    public static function build_from_config($config, $item = null, $options = array())
    {
        $instance = null;
        if (is_object($item)) {
            $instance = $item;
            empty($options['action']) && $options['action'] = 'edit';
        } elseif (is_string($item)) {
            $instance = null;
            empty($options['action']) && $options['action'] = 'add';
        } elseif (is_array($item)) {
            $options = $item;
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
            $instance->event('form_fieldset_fields', array(&$config));
        }

        $fieldset->add_renderers($config, $options);

        if (!empty($options['extend']) && is_callable($options['extend'])) {
            call_user_func($options['extend'], $fieldset);
        }

        if (isset($instance)) {
            $fieldset->populate_with_instance($instance);
        }

        if ($options['save'] && (empty($options['form_name']) || \Input::post('form_name') == $options['form_name'])) {
            $fieldset->repopulate();
            if ($fieldset->validation()->run($fieldset->value())) {
                $json = $fieldset->triggerComplete($item, $fieldset->validated(), $options);
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

    public function triggerComplete($item, $data, $options = array())
    {
        $options['fieldset'] = $this;
        if (!empty($options['complete']) && is_callable($options['complete'])) {
            return call_user_func($options['complete'], $data, $item, $this->config_used, $options);
        } else {
            return static::defaultComplete($data, $item, $this->config_used, $options);
        }
    }

    public function readonly_context($instance)
    {
        if (empty($instance)) {
            return;
        }
        $behaviour_twinnable = $instance->behaviours('Nos\Orm_Behaviour_Twinnable');
        if (empty($behaviour_twinnable) || $instance->is_main_context()) {
            return;
        }
        foreach ($behaviour_twinnable['common_fields'] as $f) {
            $field = $this->field($f);
            if (!empty($field)) {
                $field->set_attribute('readonly', true);
                $field->set_attribute('disabled', true);
            }
        }
    }

    public function populate_with_instance($instance = null, $generate_id = true)
    {
        $this->instance = $instance;

        if ($generate_id) {
            $uniqid = uniqid();
            // Generate a new ID for the form
            $form_attributes = $this->get_config('form_attributes', array());
            $form_attributes['id'] = 'form_id_'.$uniqid;
            list($application) = \Config::configFile($instance);
            $form_attributes['class'] = str_replace(array('\\', '_'), '-', strtolower(get_class($instance))).' '.$application;
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

            // Don't populate password fields and submit
            if (in_array(\Arr::get($this->config_used, "$k.form.type"), array('password', 'submit'))) {
                continue;
            }
            // Don't populate some fields (for example, the context)
            if (\Arr::get($this->config_used, "$k.dont_populate", false) == true) {
                continue;
            }

            if (isset($instance->{$k})) {
                $populate[$k] = $instance->{$k};
            }
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
                    'error' => \Fuel::$env == \Fuel::DEVELOPMENT ? $e->getMessage() : __('Something went wrong. Please refresh your browser window and try again. Contact your developer or Novius OS if the problem persists. We apologise for the inconvenience caused.'),
                );
            };
        }

        $json_response = array();

        $pk = $item->primary_key();

        // Will trigger cascade_save for media and wysiwyg
        try {

            foreach ($fields as $name => $config) {
                if (!empty($config['renderer']) && in_array($config['renderer'], array('Nos\Renderer_Text', 'Nos\Renderer_Empty'))) {
                    continue;
                }
                $type = \Arr::get($config, 'form.type', null);

                if ($type == 'submit') {
                    continue;
                }

                if (isset($config['dont_save']) && $config['dont_save']) {
                    continue;
                }

                if (!empty($config['renderer']) && !$options['fieldset']->fields[$name]->before_save($item, $data)) {
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
            $item->event('form_processing', array($data, &$json_response));

            if (!empty($options['before_save']) && is_callable($options['before_save'])) {
                call_user_func($options['before_save'], $item, $data);
            }

            if (!empty($options['success']) && is_callable($options['success'])) {
                $item->save();
                $json_user = call_user_func($options['success'], $item, $data);
                $json_response = \Arr::merge($json_response, $json_user);
            } else {
                $item->save();
                $json_response['notify'] = __('OK, it’s done.');
            }

            foreach ($fields as $name => $config) {
                if (!empty($config['renderer']) && in_array($config['renderer'], array('Nos\Renderer_Text', 'Nos\Renderer_Empty'))) {
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
            if (is_callable($options['error'])) {
                $json_response = call_user_func($options['error'], $e, $item, $data);
            } else {
                $json_response['error'] = $e->getMessage();
            }
        }

        return $json_response;
    }

    protected function isExpert($field_name)
    {
        return !\Session::user()->user_expert && \Arr::get($this->config_used[$field_name], 'expert', false);
    }

    public function isRestricted($field_name)
    {
        if ($this->isExpert($field_name)) {
            return true;
        }
        $show_when = \Arr::get($this->config_used[$field_name], 'show_when', false);
        if ($show_when === false || !is_callable($show_when)) {
            return false;
        }
        return !call_user_func($show_when, $this->instance);
    }

    public function getInstance()
    {
        return $this->instance;
    }
}
