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
        'situation_relation' => null,
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
    protected $item_situation = null;

    public function & __get($property)
    {
        return $this->{$property};
    }

    public function before()
    {
        parent::before();
        $this->config_build();
        if (!empty($this->config['i18n_file'])) {
            $this->dictionnary = I18n::dictionnary($this->config['i18n_file'], 'nos::application', 'nos::generic');
        } else {
            $this->dictionnary = I18n::dictionnary('nos::application', 'nos::generic');
        }
    }

    public function i18n($message, $default = null)
    {
        return call_user_func($this->dictionnary, $message, $default);
    }

    protected function config_build()
    {
        $model = $this->config['model'];

        if (!empty($this->config['situation_relation'])) {
            $this->config['situation_relation'] = $model::relations($this->config['situation_relation']);
            if (!is_a($this->config['situation_relation'], 'Orm\\BelongsTo')) {
                $this->config['situation_relation'] = null;
            }
        }

        $this->config['views']['insert'] = !empty($this->config['views']['insert']) ? $this->config['views']['insert'] : $this->config['views']['form'];
        $this->config['views']['update'] = !empty($this->config['views']['update']) ? $this->config['views']['update'] : $this->config['views']['form'];

        if (empty($this->config['layout_insert']) && !empty($this->config['layout'])) {
            $this->config['layout_insert'] = $this->config['layout'];
        }
        if (empty($this->config['layout_update']) && !empty($this->config['layout'])) {
            $this->config['layout_update'] = $this->config['layout'];
        }

        $this->behaviours = array(
            'contextable' => $model::behaviours('Nos\Orm_Behaviour_Contextable', false),
            'sharable' => $model::behaviours('Nos\Orm_Behaviour_Sharable', false),
            'tree' => $model::behaviours('Nos\Orm_Behaviour_Tree', false),
            'url' => $model::behaviours('Nos\Orm_Behaviour_Urlenhancer', false),
        );
        $this->pk = \Arr::get($model::primary_key(), 0);
    }

    protected function crud_item($id)
    {
        $model = $this->config['model'];

        return $id === null ? $model::forge() : $model::find($id);
    }

    protected function view_params()
    {
        $self = $this;
        $view_params = array(
            'crud' => array(
                'model' => $this->config['model'],
                'behaviours' => $this->behaviours,
                'pk' => $this->pk,
                'context' => $this->item_situation,
                'config' => $this->config,
                'url_form' => $this->config['controller_url'].'/form',
                'url_insert_update' => $this->config['controller_url'].'/insert_update'.($this->is_new ? '' : '/'.$this->item->{$this->pk}),
                'url_actions'  => $this->config['controller_url'].'/json_actions'.($this->is_new ? '' : '/'.$this->item->{$this->pk}),
                'is_new' => $this->is_new,
                'actions' => $this->get_actions(),
                'tab_params' => $this->get_tab_params(),
            ),
            'item' => $this->item,
            'i18n' => function($message) use ($self) {
                return $self->i18n($message);
            },
        );
        if ($this->behaviours['contextable']) {
            $view_params['crud']['context'] = $this->item->{$this->behaviours['contextable']['context_property']};
        }

        $view_params['view_params'] = &$view_params;

        return $view_params;
    }

    public function action_form($id = null)
    {
        //try {
            $this->item = $this->crud_item($id);
            $this->clone = clone $this->item;
            $this->is_new = $this->item->is_new();
            $this->form_item();
            $this->check_permission($this->is_new ? 'insert' : 'update');

            $fields = $this->fields($this->config['fields']);
            $fieldset = \Fieldset::build_from_config($fields, $this->item, $this->build_from_config());
            $fieldset = $this->fieldset($fieldset);

            $view_params = $this->view_params();
            $view_params['fieldset'] = $fieldset;

            // We can't do this form inside the view_params() method, because additional vars (added
            // after the reference was created) won't be available from the reference
            $view_params['view_params'] = &$view_params;

            return \View::forge($this->config['views'][$this->is_new ? 'insert' : 'update'], $view_params, false);
        /*} catch (\Exception $e) {
            $this->send_error($e);
        }*/
    }

    protected function form_item()
    {
        if ($this->is_new) {
            $create_from_id = \Input::get('create_from_id', 0);
            $common_id = \Input::get('common_id', null);
            $context_id = \Input::get('context_id', null);
            if (!empty($create_from_id)) {
                $this->item_from = $this->crud_item($create_from_id);
                $this->item = clone $this->item_from;
            } elseif (!empty($common_id) && $this->behaviours['contextable']) {
                $this->item->{$this->behaviours['contextable']['common_id_property']} = $common_id;
            } elseif (!empty($context_id) && !empty($this->config['situation_relation'])) {
                $model_context = $this->config['situation_relation']->model_to;
                $this->item_situation = $model_context::find($context_id);
                $this->item->{$this->config['situation_relation']->key_from[0]} = $this->item_situation->{$this->config['situation_relation']->key_to[0]};
            }
            if ($this->behaviours['contextable']) {
                $this->item->{$this->behaviours['contextable']['context_property']} = \Input::get('context', false) ? : key(\Config::get('contexts', array()));
            }
            if ($this->behaviours['contextable'] && $this->behaviours['tree']) {
                // New page: no parent
                // Translation: we have a common_id and can determine the parent
                if (!empty($this->item->{$this->behaviours['contextable']['common_id_property']})) {
                    $model = $this->config['model'];
                    $item_context_common = $model::find($this->item->{$this->behaviours['contextable']['common_id_property']});
                    $item_parent = $item_context_common->get_parent();

                    // Fetch in the appropriate context
                    if (!empty($item_parent)) {
                        $item_parent = $item_parent->find_context($this->item->{$this->behaviours['contextable']['context_property']});
                    }

                    // Set manually, because set_parent doesn't handle new items
                    if (!empty($item_parent)) {
                        $this->item->{$this->item->parent_relation()->key_from[0]} = $item_parent->{$this->pk};
                    }
                }
            }
        }
    }

    protected function fields($fields)
    {
        if (!empty($this->item_from)) {
            $fields['create_from_id'] = array(
                'form' => array(
                    'type' => 'hidden',
                    'value' => \Input::get('create_from_id', 0),
                ),
            );
        }
        if ($this->behaviours['contextable']) {
            $fields = \Arr::merge(
                $fields,
                array(
                    $this->behaviours['contextable']['context_property'] => array(
                        'form' => array(
                            'type' => 'hidden',
                            'value' => $this->item->{$this->behaviours['contextable']['context_property']},
                        ),
                    ),
                    $this->behaviours['contextable']['common_id_property'] => array(
                        'form' => array(
                            'type' => 'hidden',
                            'value' => $this->item->{$this->behaviours['contextable']['common_id_property']},
                        ),
                    ),
                )
            );
        }
        if ($this->is_new) {
            if ($this->behaviours['contextable'] && $this->behaviours['tree']) {
                $parent_id = $this->item->parent_relation()->key_from[0];
                $fields = \Arr::merge(
                    $fields,
                    array(
                        $parent_id => array(
                            'widget_options' => array(
                                'context' => $this->item->{$this->behaviours['contextable']['context_property']},
                            ),
                        ),
                    )
                );
            }

            $fields = \Arr::merge(
                $fields,
                array(
                    'save' => array(
                        'form' => array(
                            'value' => $this->i18n('Add'),
                        ),
                    ),
                )
            );
        }

        return $fields;
    }

    protected function fieldset($fieldset)
    {
        $fieldset->js_validation();
        $fieldset->populate_with_instance($this->item);
        $fieldset->form()->set_config('field_template', '<tr><th class="{error_class}">{label}{required}</th><td class="{error_class}">{field} {error_msg}</td></tr>');

        return $fieldset;
    }

    protected function build_from_config()
    {
        return array(
            'before_save' => array($this, 'before_save'),
            'success' => array($this, 'save'),
        );
    }

    public function save($item, $data)
    {
        $dispatchEvent = array(
            'name' => $this->config['model'],
            'action' => $this->is_new ? 'insert' : 'update',
            'id' => (int) $item->{$this->pk},
        );
        if ($this->behaviours['contextable']) {
            $dispatchEvent['context_common_id'] = (int) $item->{$this->behaviours['contextable']['common_id_property']};
            $dispatchEvent['context'] = $item->{$this->behaviours['contextable']['context_property']};
        }

        $return = array(
            'notify' => $this->is_new ? $this->i18n('successfully added') : $this->i18n('successfully saved'),
            'closeDialog' => true,
            'dispatchEvent' => $dispatchEvent,
        );
        if ($this->is_new) {
            $return['replaceTab'] = $this->config['controller_url'].'/insert_update/'.$item->{$this->pk};
        }

        return $return;
    }

    public function before_save($item, $data)
    {
        if ($this->behaviours['contextable'] && $this->is_new) {

            $item_context = $this->item->get_context();
            $existing = $this->item->find_context($item_context);
            if (!empty($existing)) {
                $message = strtr(
                    $this->i18n('This item already exists in {context}. Therefore your item cannot be added.'),
                    array(
                        '{context}' => \Arr::get(\Config::get('contexts'), $item_context, $item_context),
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

    public function action_insert_update($id = null)
    {
        // insert_update               : add a new item
        // insert_update/ID            : edit an existing item
        // insert_update/ID?context=fr_FR : translate an existing item (can be forbidden if the parent doesn't exists in that context)

        $this->item = $this->crud_item($id);
        $this->is_new = $this->item->is_new();

        if (empty($this->item)) {
            return $this->send_error(new \Exception($this->i18n('item deleted')));
        }

        if ($this->is_new || !$this->behaviours['contextable']) {
            return $this->action_form($id);
        }

        if ($this->behaviours['contextable']) {
            $selected_context = \Input::get('context', $this->is_new ? null : $this->item->get_context());

            foreach ($this->item->get_all_context() as $context_id => $context) {
                if ($selected_context == $context) {
                    return $this->action_form($context_id);
                }
            }

            $_GET['common_id'] = $id;
            return $this->blank_slate($id, $selected_context);
        }
    }

    public function blank_slate($id, $context)
    {
        $this->item = $this->crud_item($id);
        $this->is_new = true;
        if (empty($context)) {
            $context = \Input::get('context', key(\Config::get('contexts')));
        }

        $view_params = array_merge(
            $this->view_params(),
            array(
                'context' => $context,
                'common_id' => \Input::get('common_id', ''),
            )
        );
        $view_params['crud']['tab_params']['url'] .= '?context='.$context;
        $view_params['crud']['tab_params']['label'] = $this->config['tab']['labels']['blankSlate'];

        // We can't do this form inside the view_params() method, because additional vars (added
        // after the reference was created) won't be available from the reference
        $view_params['view_params'] = &$view_params;

        return \View::forge('nos::crud/blank_slate', $view_params, false);
    }

    public function action_json_actions($id = null)
    {
        $this->item = $this->crud_item($id);
        $this->is_new = $this->item->is_new();

        if (empty($this->item)) {
            return $this->send_error(new \Exception($this->config['messages']['item deleted']));
        }

        \Response::json($this->get_actions());
    }

    protected function get_tab_params()
    {
        list($application_name) = \Config::configFile(get_called_class());
        $labelUpdate = $this->config['tab']['labels']['update'];
        $url = $this->config['controller_url'].'/insert_update'.($this->is_new ? '' : '/'.$this->item->id);
        if ($this->is_new) {
            $params = array();
            foreach (array('create_from_id', 'common_id', 'context_id') as $key) {
                $value = \Input::get($key, false);
                if ($value !== false) {
                    $params[$key] = $value;
                }
            }
            if ($this->behaviours['contextable']) {
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

    protected function get_actions()
    {
        $applicationActions = \Config::actions(array(
            'models' => array(get_class($this->item)),
            'type' => 'item',
            'item' => $this->item,
        ));

        $actions = array_values($this->get_actions_context());

        foreach ($applicationActions as $action) {
            if (!isset($action['enabled']) || $action['enabled']($this->item)) {
                $actions[] = $action;
            }
        }
        foreach ($this->config['actions'] as $actionClosure) {
            if ($action = $actionClosure($this->item)) {
                $actions[] = $action;
            }
        }

        return $actions;
    }

    protected function get_actions_context()
    {
        if (!$this->behaviours['contextable']) {
            return array();
        }

        $actions = array();
        $contexts = array_keys(\Config::get('contexts', array()));
        $main_context = $this->item->find_main_context();
        foreach ($contexts as $context) {
            if ($this->item->{$this->behaviours['contextable']['context_property']} === $context) {
                continue;
            }
            $item_context = $this->item->find_context($context);
            $url = $this->config['controller_url'].'/insert_update'.(empty($item_context) ? (empty($main_context) ? '' : '/'.$main_context->id).'?context='.$context : '/'.$item_context->id);
            $label = empty($main_context) ? $this->i18n('add an item in lang') : (empty($item_context) ? $this->i18n('Translate in {lang}') : $this->i18n('Edit in {lang}'));
            $actions[$context] = array(
                'label' => strtr($label, array('{context}' => \Arr::get(\Config::get('contexts', array()), $context, $context))),
                'iconUrl' => \Nos\Helper::flag_url($context),
                'action' => array(
                    'action' => 'nosTabs',
                    'method' => empty($main_context) ? 'add' : 'open',
                    'tab' => array(
                        'url' => $url
                    ),
                ),
            );
        }

        return $actions;
    }

    protected function check_permission($action)
    {
        if ($action === 'delete' && $this->item->is_new()) {
            throw new \Exception($this->i18n('not found'));
        }
    }

    public function action_delete($id = null)
    {
        try {
            if (\Input::method() === 'POST') {
                $this->delete_confirm();
            } else {
                $this->item = $this->crud_item($id);
                $this->is_new = $this->item->is_new();
                $this->check_permission('delete');

                return \View::forge('nos::crud/delete_popup_layout', $this->view_params(), false);
            }
        } catch (\Exception $e) {
            $this->send_error($e);
        }
    }

    public function delete_confirm()
    {
        $id = \Input::post('id', 0);
        if (empty($id) && \Fuel::$env === \Fuel::DEVELOPMENT) {
            $id = \Input::get('id');
        }

        $this->item = $this->crud_item($id);
        $this->is_new = $this->item->is_new();
        $this->check_permission('delete');

        $dispatchEvent = array(
            'name' => $this->config['model'],
            'action' => 'delete',
            'id' => (int) $id,
        );

        $this->delete();

        if ($this->behaviours['contextable']) {
            $dispatchEvent['context_common_id'] = $this->item->{$this->behaviours['contextable']['common_id_property']};
            $dispatchEvent['id'] = array();
            $dispatchEvent['context'] = array();

            // Delete all contexts by default
            $context = \Input::post('context', 'all');

            // Delete children for all contexts
            if ($context === 'all') {
                foreach ($this->item->find_context('all') as $item_context) {
                    $dispatchEvent['id'][] = (int) $item_context->{$this->pk};
                    $dispatchEvent['context'][] = $item_context->{$this->behaviours['contextable']['context_property']};

                    if ($this->behaviours['tree']) {
                        foreach ($item_context->get_ids_children(false) as $item_id) {
                            $dispatchEvent['id'][] = (int) $item_id;
                        }
                    }
                }

                // Children will be deleted recursively (with the 'after_delete' event from the Tree behaviour)
                // Optimised operation for deleting all contexts
                $this->item->delete_all_context();

            } else {
                // Search for the appropriate page
                if ($this->item->get_context() != $context) {
                    $this->item = $this->item->find_context($context);
                }
                $this->check_permission('delete');

                $dispatchEvent['id'][] = $this->item->{$this->pk};
                $dispatchEvent['context'][] = $this->item->{$this->behaviours['contextable']['context_property']};
                if ($this->behaviours['tree']) {
                    foreach ($this->item->get_ids_children(false) as $item_id) {
                        $dispatchEvent['id'][] = (int) $item_id;
                    }
                }

                // Reassigns common_id if this item is the main context (with the 'after_delete' event from the Contextable behaviour)
                // Children will be deleted recursively (with the 'after_delete' event from the Tree behaviour)
                $this->item->delete();
            }
        } else {
            if ($this->behaviours['tree']) {
                $dispatchEvent['id'] = array($this->item->{$this->pk});
                foreach ($this->item->get_ids_children(false) as $item_id) {
                    $dispatchEvent['id'][] = (int) $item_id;
                }
            }

            $this->item->delete();
        }

        $this->response(
            array(
                'notify' => $this->i18n('successfully deleted'),
                'dispatchEvent' => $dispatchEvent,
            )
        );
    }

    public function delete()
    {
    }
}
