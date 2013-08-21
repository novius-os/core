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

class Controller_Admin_Crud extends Controller_Admin_Application
{
    protected $config = array(
        'model' => '',
        'environment_relation' => null,
        'tab' => array(
            'iconUrl' => '',
            'labels' => array(
                'update' => null,
                'insert' => 'New item',
                'blankSlate' => 'Translate an item',
            ),
        ),
        'actions' => array(),
        'layout' => array(),
        'fields' => array(),
        'require_js' => array(),
        'views' => array(
            'form' => 'nos::crud/form',
            'delete' => 'nos::crud/delete_popup',
        ),
    );

    protected $pk = '';
    protected $behaviours = array();
    protected $item = null;
    protected $clone = null;
    protected $is_new = false;
    protected $item_from = null;
    protected $item_environment = null;

    public function & __get($property)
    {
        return $this->{$property};
    }

    public function before()
    {
        parent::before();
        $this->config_build();
    }

    public function prepare_i18n()
    {
        parent::prepare_i18n();
        \Nos\I18n::current_dictionary(array('nos::application', 'nos::common'));
    }

    /**
     * Set properties from the config
     */
    protected function config_build()
    {
        $model = $this->config['model'];

        if (!empty($this->config['environment_relation'])) {
            $this->config['environment_relation'] = $model::relations($this->config['environment_relation']);
            if (!is_a($this->config['environment_relation'], 'Orm\\BelongsTo')) {
                $this->config['environment_relation'] = null;
            }
        }

        // Convert simplified layout syntax into the full syntax
        foreach (array('layout', 'layout_insert', 'layout_update') as $layout_name) {
            if (!empty($this->config[$layout_name])) {
                $layout = $this->config[$layout_name];
                $view = current($layout);
                if (!is_array($view) || empty($view['view'])) {
                    $this->config[$layout_name] = array(
                        array(
                            'view' => 'nos::form/layout_standard',
                            'params' =>  $layout,
                        ),
                    );
                }
            }
        }

        $this->behaviours = array(
            'contextable' => $model::behaviours('Nos\Orm_Behaviour_Contextable', false),
            'twinnable' => $model::behaviours('Nos\Orm_Behaviour_Twinnable', false),
            'sharable' => $model::behaviours('Nos\Orm_Behaviour_Sharable', false),
            'tree' => $model::behaviours('Nos\Orm_Behaviour_Tree', false),
            'url' => $model::behaviours('Nos\Orm_Behaviour_Urlenhancer', false),
        );
        if (!$this->behaviours['contextable'] && $this->behaviours['twinnable']) {
            $this->behaviours['contextable'] = $this->behaviours['twinnable'];
        }
        $this->pk = \Arr::get($model::primary_key(), 0);

        if (empty($this->config['require_js'])) {
            $this->config['require_js'] = array();
        }

        $common_config = \Nos\Config_Common::load($model, array());
        $i18n_default = \Config::load('nos::i18n_common', true);
        $this->config['i18n'] = array_merge($i18n_default, \Arr::get($common_config, 'i18n', array()));

        $model::eventStatic('crudConfig', array(&$this->config, $this));

        foreach (array('insert', 'update') as $layout_suffix) {
            if (empty($this->config['views'][$layout_suffix])) {
                $this->config['views'][$layout_suffix] = $this->config['views']['form'];
            }
            if (empty($this->config['layout_'.$layout_suffix]) && !empty($this->config['layout'])) {
                $this->config['layout_'.$layout_suffix] = $this->config['layout'];
            }
        }
    }

    /**
     * Generic method to get an instance wether it's been already created or not
     * @param type $id : the id of the instance you want to edit (or create from)
     * @return type : instance of the model
     */
    protected function crud_item($id)
    {
        $model = $this->config['model'];

        return $id === null ? $model::forge() : $model::find($id);
    }

    /**
     * Set params used in view
     * WARNING : As views can forge other views, it is necessary to add view_params in view_params...
     * --> every time view_params is changed, $view_params['view_params'] = &$view_params; must be written.
     * @return Array : params for views and the array itself
     */
    protected function view_params()
    {
        $self = $this;
        $view_params = array(
            'crud' => array(
                'model' => $this->config['model'],
                'behaviours' => $this->behaviours,
                'pk' => $this->pk,
                'environment' => $this->item_environment,
                'config' => $this->config,
                'url_form' => $this->config['controller_url'].'/form',
                'url_insert_update' => $this->config['controller_url'].'/insert_update'.($this->is_new ? '' : '/'.$this->item->{$this->pk}),
                'url_actions'  => $this->config['controller_url'].'/json_actions'.($this->is_new ? '' : '/'.$this->item->{$this->pk}),
                'is_new' => $this->is_new,
                'actions' => array_values($this->get_actions()),
                'dataset' => \Nos\Controller::dataset_item($this->item),
                'tab_params' => $this->get_tab_params()
            ),
            'item' => $this->item,
        );
        if ($this->behaviours['contextable']) {
            $view_params['crud']['context'] = $this->item->{$this->behaviours['contextable']['context_property']};
        }

        $view_params['view_params'] = &$view_params;

        return $view_params;
    }

    /**
     * Called before displaying the form to
     * - call init_item
     * - check permission
     * - build fields
     * @param type $id
     * @return View
     */
    public function action_form($id = null)
    {
        $this->item = $this->crud_item($id);
        $this->clone = clone $this->item;
        $this->is_new = $this->item->is_new();
        if ($this->is_new) {
            $this->init_item();
        }
        $this->checkPermission($this->is_new ? 'add' : 'edit');

        $fields = $this->fields($this->config['fields']);
        $fieldset = \Fieldset::build_from_config($fields, $this->item, $this->build_from_config());
        $fieldset = $this->fieldset($fieldset);

        if (isset($this->config['css'])) {
            $fieldset->prepend(render('nos::admin/load_css', array('css_files' => $this->config['css'])));
        }

        $view_params = $this->view_params();
        $view_params['fieldset'] = $fieldset;

        // We can't do this form inside the view_params() method, because additional vars (added
        // after the reference was created) won't be available from the reference
        $view_params['view_params'] = &$view_params;

        return \View::forge($this->config['views'][$this->is_new ? 'insert' : 'update'], $view_params, false);
    }

    /**
     * init_item() is used to pre-configure an new object.
     */
    protected function init_item()
    {
        $create_from_id = \Input::get('create_from_id', \Input::post('create_from_id', 0));
        $common_id = \Input::get('common_id', null);
        $environment_id = \Input::get('environment_id', null);
        if (!empty($create_from_id)) {
            $this->item_from = $this->crud_item($create_from_id);
            $this->item = clone $this->item_from;
        } elseif (!empty($common_id) && $this->behaviours['twinnable']) {
            $this->item->{$this->behaviours['twinnable']['common_id_property']} = $common_id;
        } elseif (!empty($environment_id) && !empty($this->config['environment_relation'])) {
            $model_environment = $this->config['environment_relation']->model_to;
            $this->item_environment = $model_environment::find($environment_id);
            $this->item->{$this->config['environment_relation']->key_from[0]} = $this->item_environment->{$this->config['environment_relation']->key_to[0]};
        }
        if ($this->behaviours['contextable']) {
            $context = \Input::get('context', false);
            $allowed_contexts = \Nos\User\Permission::contexts();
            $this->item->{$this->behaviours['contextable']['context_property']} = $context && isset($allowed_contexts[$context]) ? $context : key($allowed_contexts);
        }
        if ($this->behaviours['twinnable'] && $this->behaviours['tree']) {
            // New page: no parent
            // Translation: we have a common_id and can determine the parent
            if (!empty($this->item->{$this->behaviours['twinnable']['common_id_property']})) {
                $model = $this->config['model'];
                $common_id_property = $this->behaviours['twinnable']['common_id_property'];
                $item_context_common = $model::find('first', array(
                    'where' => array(
                        array($common_id_property, $this->item->{$common_id_property}),
                    ),
                ));
                $item_parent = $item_context_common->get_parent();

                // Fetch in the appropriate context
                if (!empty($item_parent)) {
                    $item_parent = $item_parent->find_context($this->item->{$this->behaviours['twinnable']['context_property']});
                }

                // Set manually, because set_parent doesn't handle new items
                if (!empty($item_parent)) {
                    $this->item->{$this->item->parent_relation()->key_from[0]} = $item_parent->{$this->pk};
                }
            }
        }
    }

    /**
     * If necessary, add specific fields to those already specified through config.
     * @return Array : merged fields;
     */
    protected function fields($fields)
    {
        if (!empty($this->item_from)) {
            $fields['create_from_id'] = array(
                'form' => array(
                    'type' => 'hidden',
                    'value' => \Input::get('create_from_id', \Input::post('create_from_id', 0)),
                ),
            );
        }
        $model = $this->config['model'];
        $model::eventStatic('crudFields', array(&$fields, $this));

        if ($this->is_new) {
            $fields = \Arr::merge(
                $fields,
                array(
                    'save' => array(
                        'form' => array(
                            'type' => 'submit',
                            // Note to translator: This is a submit button
                            'value' => __('Add'),
                        ),
                    ),
                )
            );
        }

        return $fields;
    }

    /**
     * Set and apply validation, populate fieldset  and modify template to show errors from validation
     * @param type Fieldset
     * @return type Fieldset
     */
    protected function fieldset($fieldset)
    {
        $fieldset->js_validation($this->config['require_js']);
        $fieldset->populate_with_instance($this->item);
        $fieldset->form()->set_config('field_template', '<tr><th class="{error_class}">{label}{required}</th><td class="{error_class}">{field} {error_msg}</td></tr>');

        return $fieldset;
    }

    /**
     * Default config for building the fieldset with \Fieldset::build_from_config.
     * @return Array : config
     */
    protected function build_from_config()
    {
        return array(
            'before_save' => array($this, 'before_save'),
            'success' => array($this, 'save'),
        );
    }

    /**
     * Default method 'save' called when building fieldset :
     * Create the dispatched event.
     * @return Array : config needed in the dispatched event.
     */
    public function save($item, $data)
    {
        $dispatchEvent = array(
            'name' => $this->config['model'],
            'action' => $this->is_new ? 'insert' : 'update',
            'id' => (int) $item->{$this->pk},
        );
        if ($this->behaviours['contextable']) {
            $dispatchEvent['context'] = $item->{$this->behaviours['contextable']['context_property']};
        }
        if ($this->behaviours['twinnable']) {
            $dispatchEvent['context_common_id'] = (int) $item->{$this->behaviours['twinnable']['common_id_property']};
        }

        $return = array(
            'notify' => $this->is_new ? $this->config['i18n']['notification item added'] : $this->config['i18n']['notification item saved'],
            'closeDialog' => true,
            'dispatchEvent' => array($dispatchEvent),
        );
        if ($this->is_new) {
            $return['replaceTab'] = $this->config['controller_url'].'/insert_update/'.$item->{$this->pk};
        } else {
            $return['action'] = array(
                'action' => 'nosTabs',
                'method' => 'update',
                'tab' => $this->get_tab_params(),
            );
            $return['dataset'] = \Nos\Controller::dataset_item($this->item);
        }

        return $return;
    }

    /**
     * Default method 'before_save' called when building fieldset.
     */
    public function before_save($item, $data)
    {
        $this->checkPermission($this->is_new ? 'add' : 'edit');
        if ($this->behaviours['twinnable'] && $this->is_new) {

            $item_context = $this->item->get_context();
            $existing = $this->item->find_context($item_context);
            if (!empty($existing)) {
                $message = strtr(
                    __('This item already exists in {{context}}. Therefore your item cannot be added.'),
                    array(
                        '{{context}}' => Tools_Context::contextLabel($item_context),
                    )
                );
                $this->send_error(new \Exception($message));
            }
        }

        if ($this->behaviours['tree']) {
            // This doesn't work for now, because Fuel prevent relation from being fetch on new objects
            // https://github.com/fuel/orm/issues/171
            //$item = $item->get_parent();

            // Instead, retrieve the object manually
            // Model::find(null) returns an Orm\Query. We don't want that.
            $parent = empty($item->{$item->parent_relation()->key_from[0]}) ? null : $item::find($item->{$item->parent_relation()->key_from[0]});

            // Event 'change_parent' will set the appropriate context
            $item->set_parent($parent);
        }
    }

    /**
     * Determine wether the item is udpated or added and if it's creating from a different language
     * @param type $id of the item
     * @return View resulting from the call of a method (either action_form or blank_slate)
     */
    public function action_insert_update($id = null)
    {
        // insert_update               : add a new item
        // insert_update?context=fr_FR : add a new item in the specific context
        // insert_update/ID            : edit an existing item
        // insert_update/ID?context=fr_FR : translate an existing item (can be forbidden if the parent doesn't exists in that context)

        $this->item = $this->crud_item($id);

        if (empty($this->item)) {
            return $this->send_error(new \Exception($this->config['i18n']['notification item not found']));
        }

        $this->is_new = $this->item->is_new();

        if ($this->is_new || !$this->behaviours['twinnable']) {
            return $this->action_form($id);
        }

        if ($this->behaviours['twinnable']) {
            $selected_context = \Input::get('context', $this->is_new ? null : $this->item->get_context());

            foreach ($this->item->get_all_context() as $context_id => $context) {
                if ($selected_context == $context) {
                    return $this->action_form($context_id);
                }
            }

            return $this->blank_slate($id, $selected_context);
        }
    }

    /**
     * Display a blank slate to create a new item from an another one in a different language
     * @param type $id : orignal item's id
     * @param type $context : chosen context
     * @return type View : blank_slate
     */
    public function blank_slate($id, $context)
    {
        $this->item = $this->crud_item($id);
        $this->is_new = true;
        if (empty($context)) {
            $context = \Input::get('context', key(Tools_Context::contexts()));
        }

        $view_params = array_merge(
            $this->view_params(),
            array(
                'context' => $context,
                'common_id' => $id,
            )
        );
        $view_params['crud']['tab_params']['url'] .= '?context='.$context;
        $view_params['crud']['tab_params']['label'] = $this->config['tab']['labels']['blankSlate'];

        // We can't do this form inside the view_params() method, because additional vars (added
        // after the reference was created) won't be available from the reference
        $view_params['view_params'] = &$view_params;

        return \View::forge('nos::crud/blank_slate', $view_params, false);
    }

    /**
     * Return possible actions from the config and transform them into json to display them
     * @param type $id : id of the item on which the actions call be applied
     * @return type : json
     */
    public function action_json_actions($id = null)
    {
        $this->item = $this->crud_item($id);

        if (empty($this->item)) {
            return $this->send_error(new \Exception($this->config['i18n']['notification item deleted']));
        }

        $this->is_new = $this->item->is_new();

        \Response::json(array_values($this->get_actions()));
    }

    /**
     * Return the config for setting the url of the novius-os tab
     * @return Array
     */
    protected function get_tab_params()
    {
        list($application_name) = \Config::configFile(get_called_class());
        $labelUpdate = $this->config['tab']['labels']['update'];
        $url = $this->config['controller_url'].'/insert_update'.(empty($this->item->id) ? '' : '/'.$this->item->id);
        if ($this->is_new) {
            $params = array();
            foreach (array('create_from_id', 'common_id', 'environment_id') as $key) {
                $value = \Input::get($key, false);
                if ($value !== false) {
                    $params[$key] = $value;
                }
            }
            // Don't add context in blank slate case
            if ($this->behaviours['contextable'] && empty($this->item->id)) {
                $params['context'] = $this->item->get_context();
            }
            if (count($params)) {
                $url .= '?'.http_build_query($params);
            }
        }

        $tabInfos = array(
            'iconUrl' => empty($this->config['tab']['iconUrl']) ? \Config::icon($application_name, 16) : $this->config['tab']['iconUrl'],
            'label' => $this->is_new ? $this->config['tab']['labels']['insert'] : (is_callable($labelUpdate) ? $labelUpdate($this->item) : (empty($labelUpdate) ? $this->item->title_item() : $this->item->{$labelUpdate})),
            'url' => $url,
        );

        return $tabInfos;
    }

    /**
     * Get possible actions in the appdesk from the config
     * @return array
     */
    protected function get_actions($all_targets = false)
    {
        $actions = array_merge(
            \Config::actions(array(
                'models' => array(get_class($this->item)),
                'target' => 'toolbar-edit',
                'class' => get_called_class(),
                'item' => $this->item,
                'all_targets' => $all_targets,
            )),
            \Nos\Config_Common::prefixActions($this->config['actions'], $this->config['model'])
        );

        return $actions;
    }

    /**
     * @deprecated
     */
    protected function check_permission($action_name)
    {
        \Log::deprecated('->check_permission($action_name) is deprecated, use ->checkPermission($action_name) instead.', 'Chiba.1');

        return $this->checkPermission($action_name);
    }

    /**
     * Check if it's possible to delete an item, i.e. if it's not a new one.
     * @param string $action
     * @throws \Exception
     */
    protected function checkPermission($action_name)
    {
        $action_name = \Nos\Config_Common::prefixActionName($action_name, $this->config['model']);

        $actions = $this->get_actions(true);
        if (!isset($actions[$action_name])) {
            logger(\Fuel::L_WARNING, '\Nos\Controller_Admin_Crud->check_permission($action_name = '.$action_name.'). The action name was not found in the common configuration file, please double check for typo.');
            return true;
        }

        $action = $actions[$action_name];

        $disabled = isset($action['disabled']) ? \Config::getActionDisabledState($action['disabled'], $this->item) : false;

        if ($disabled !== false) {
            if (!is_string($disabled)) {
                $disabled = $this->config['i18n']['action not allowed'];
            }
            $this->send_error(new \Exception($disabled));
        }
    }

    /**
     * Display a popup to confirm deletion
     * @param type $id : the id of item which will be display
     * @return type View : the popup
     */
    public function action_delete($id = null)
    {
        try {
            if (\Input::method() === 'POST') {
                $this->delete_confirm();
            } else {
                $this->item = $this->crud_item($id);
                $this->is_new = $this->item->is_new();
                $this->checkPermission('delete');

                return \View::forge('nos::crud/delete_popup_layout', $this->view_params(), false);
            }
        } catch (\Exception $e) {
            $this->send_error($e);
        }
    }

    /**
     * Perform deletion (and pay attention to children and items existing in other languages)
     */
    public function delete_confirm()
    {
        $id = \Input::post('id', 0);
        if (empty($id) && \Fuel::$env === \Fuel::DEVELOPMENT) {
            $id = \Input::get('id');
        }

        $this->item = $this->crud_item($id);
        $this->is_new = $this->item->is_new();
        $this->checkPermission('delete');

        $dispatchEvent = array(
            'name' => $this->config['model'],
            'action' => 'delete',
            'id' => (int) $id,
        );

        $json_delete = $this->delete();

        if ($this->behaviours['twinnable']) {
            $dispatchEvent['context_common_id'] = $this->item->{$this->behaviours['twinnable']['common_id_property']};
            $dispatchEvent['id'] = array();
            $dispatchEvent['context'] = array();

            // Filter allowed contexts
            $contexts = array_intersect(array_keys(\Nos\User\Permission::contexts()), \Input::post('contexts', array()));
            $contexts_item = $this->item->get_all_context();

            $count_1 = count($contexts);
            $count_2 = count($contexts_item);
            $count_3 = count(array_intersect($contexts, $contexts_item));

            $delete_all_contexts = ($count_1 == $count_3 && $count_2 == $count_3);

            // Children will be deleted recursively (with the 'after_delete' event from the Tree behaviour)
            foreach ($this->item->find_context($contexts) as $item_context) {
                $dispatchEvent['id'][] = (int) $item_context->{$this->pk};
                $dispatchEvent['context'][] = $item_context->{$this->behaviours['twinnable']['context_property']};

                if ($this->behaviours['tree']) {
                    foreach ($item_context->get_ids_children(false) as $item_id) {
                        $dispatchEvent['id'][] = (int) $item_id;
                    }
                }

                // Delete only selected contexts
                if (!$delete_all_contexts) {
                    // Reassigns common_id if this item is the main context (with the 'after_delete' event from the Twinnable behaviour)
                     $item_context->delete();
                }
            }

            // Optimised operation for deleting all contexts
            if ($delete_all_contexts) {
                $this->item->delete_all_context();
            }
        } else {
            if ($this->behaviours['contextable']) {
                $dispatchEvent['context'] = $this->item{$this->behaviours['contextable']['context_property']};
            }
            if ($this->behaviours['tree']) {
                $dispatchEvent['id'] = array($this->item->{$this->pk});
                foreach ($this->item->get_ids_children(false) as $item_id) {
                    $dispatchEvent['id'][] = (int) $item_id;
                }
            }

            $this->item->delete();
        }
        $json = array(
            'notify' => $this->config['i18n']['notification item deleted'],
            'dispatchEvent' => array($dispatchEvent),
        );
        if (is_array($json_delete)) {
            $json = \Arr::merge($json, $json_delete);
        }

        $this->response($json);
    }

    public function delete()
    {
    }
}
