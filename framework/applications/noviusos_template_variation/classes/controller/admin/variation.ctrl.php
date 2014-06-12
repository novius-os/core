<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Template\Variation;

use Nos\Config_Data;
use Nos\Controller_Admin_Crud;
use Nos\I18n;

class Controller_Admin_Variation extends Controller_Admin_Crud
{
    protected $reload_with_template = false;
    protected $template_metadata = array();

    public function before()
    {
        parent::before();
        I18n::current_dictionary('noviusos_template_variation::common', 'nos::common');
    }

    public function action_form_template($id = null)
    {
        $_GET['context'] = \Input::post('tpvar_context');

        $this->reload_with_template = true;
        return parent::action_insert_update($id);
    }

    public function action_set_default()
    {
        try {
            $id = \Input::post('id', 0);
            if (empty($id) && \Fuel::$env === \Fuel::DEVELOPMENT) {
                $id = \Input::get('id');
            }
            $this->item = $this->crud_item($id);

            \Db::update(Model_Template_Variation::table())
                ->set(array('tpvar_default' => 0))
                ->where(array(
                    array('tpvar_default', '=', 1),
                    array('tpvar_context', '=', $this->item->tpvar_context),
                ))
                ->execute();

            $this->item->tpvar_default = 1;
            $this->item->save();

            $dispatchEvent = array(
                'name' => get_class($this->item),
                'action' => 'update',
                'id' => $this->item->tpvar_id,
                'context' => $this->item->tpvar_context,
            );

            $body = array(
                'notify' => strtr(
                    __('No sooner said than done. The default template variation is now ‘{{title}}’.'),
                    array('{{title}}' => $this->item->title_item())
                ),
                'dispatchEvent' => $dispatchEvent,
            );

        } catch (\Exception $e) {
            $this->send_error($e);
        }

        \Response::json($body);
    }

    protected function crud_item($id)
    {
        $item = parent::crud_item($id);

        foreach ((array) $item->tpvar_data as $field => $value) {
            $item->set($field, $value);
        }

        return $item;
    }

    protected function build_from_config()
    {
        $config = parent::build_from_config();
        if ($this->reload_with_template) {
            $config['save'] = false;
        }

        return $config;
    }

    protected function fields($fields)
    {
        $templates = Config_Data::get('templates', array());
        $template_name = \Input::post('tpvar_template', $this->item->tpvar_template);
        if (!empty($template_name)) {
            $this->template_metadata = \Arr::get($templates, $template_name, array());
            $template_config = \Config::load(
                $this->template_metadata['application'].'::variation/'.$template_name,
                true
            );

            $fields = \Arr::get($template_config, 'admin.fields', array());
            foreach ($fields as $field_id => $field) {
                if (!strpos($field_id, '->')) {
                    $fields[$field_id] = array_merge($field, array('dont_save' => true));
                }
            }
            $this->config['fields'] = array_merge(
                $fields,
                $this->config['fields']
            );

            $this->config['layout_insert']['form']['params'] = array_merge(
                \Arr::get($template_config, 'admin.layout', array()),
                $this->config['layout_insert']['form']['params']
            );

            if ($this->reload_with_template) {
                $init = \Arr::get($template_config, 'init');
                if (is_callable($init)) {
                    $_POST = array_merge($_POST, $init());
                }
            }
        }

        if (!$this->is_new) {
            $this->config['layout_update'] = $this->config['layout_insert'];
            $this->config['layout_update']['form']['params']['title'] =  'tpvar_title';
            $this->config['layout_update']['form']['params']['subtitle'] =  array('tpvar_template');
        } else {
            $this->config['fields']['tpvar_title']['form']['placeholder'] = '';
        }

        return parent::fields($this->config['fields']);
    }

    protected function fieldset($fieldset)
    {
        $fieldset = parent::fieldset($fieldset);
        if ($this->reload_with_template) {
            $fieldset->repopulate();
        }

        return $fieldset;
    }

    public function before_save($item, $data)
    {
        parent::before_save($item, $data);

        if (empty($item->tpvar_title)) {
            $item->tpvar_title = $this->template_metadata['title'];
        }

        //Set up the first page created in a context as the homepage.
        if ($this->is_new) {
            // The first template variation we create is default
            $context_has_default = (int) (bool) Model_Template_Variation::count(array(
                'where' => array(
                    array('tpvar_default', '=', 1),
                    array('tpvar_context', $this->item->tpvar_context),
                ),
            ));
            // $context_has_default is either 0 or 1 with the double cast
            $item->tpvar_default = 1 - $context_has_default;
        }

        $item->tpvar_data = array();
        $properties = array_keys($item::properties());
        foreach ($this->config['fields'] as $field_name => $field) {
            if (!in_array($field_name, $properties) && !strpos($field_name, '->')) {
                $item->tpvar_data[$field_name] = $data[$field_name];
            }
        }
    }
}
