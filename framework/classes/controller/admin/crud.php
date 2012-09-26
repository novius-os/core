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
        'messages' => array(
            'successfully added' => 'Item successfully added.',
            'successfully saved' => 'Item successfully saved.',
            'successfully deleted' => 'The item has successfully been deleted!',
            'you are about to delete, confim' => 'You are about to delete the item <span style="font-weight: bold;">":title"</span>. Are you sure you want to continue?',
            'you are about to delete' => 'You are about to delete the item <span style="font-weight: bold;">":title"</span>.',
            'exists in multiple site' => 'This item exists in <strong>{count} sites</strong>.',
            'delete in the following sites' => 'Delete this item in the following sites:',
            'item has 1 sub-item' => 'This item has <strong>1 sub-item</strong>.',
            'item has multiple sub-items' => 'This item has <strong>{count} sub-items</strong>.',
            'confirm deletion, enter number' => 'To confirm the deletion, you need to enter this number in the field below',
            'yes delete sub-items' => 'Yes, I want to delete this item and all of its {count} sub-items.',
            'item deleted' => 'This item has been deleted.',
            'not found' => 'Item not found',
            'error added in site not parent' => 'This item cannot be added {site} because its {parent} is not available in this site yet.',
            'error added in site' => 'This item cannot be added {site}.',
            'item inexistent in site yet' => 'This item has not been added in {site} yet.',
            'visualise' => 'Visualise',
            'delete' => 'Delete',
            'delete an item' => 'Delete an item',
            'confirm deletion ok' => 'Confirm the deletion',
            'confirm deletion or' => 'or',
            'confirm deletion cancel' => 'Cancel',
            'confirm deletion wrong_confirmation' => 'Wrong confirmation',
            'add an item in site' => 'Add a new item in {site}',
        ),
        'context_relation' => null,
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
    protected $item_context = null;

    public function & __get($property)
    {
        return $this->{$property};
    }

    public function before()
    {
        parent::before();
        $this->config_build();
    }

    protected function config_build()
    {
        $model = $this->config['model'];

        if (!empty($this->config['context_relation'])) {
            $this->config['context_relation'] = $model::relations($this->config['context_relation']);
            if (!is_a($this->config['context_relation'], 'Orm\\BelongsTo')) {
                $this->config['context_relation'] = null;
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
            'translatable' => $model::behaviours('Nos\Orm_Behaviour_Translatable', false),
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
        $view_params = array(
            'crud' => array(
                'model' => $this->config['model'],
                'behaviours' => $this->behaviours,
                'pk' => $this->pk,
                'context' => $this->item_context,
                'config' => $this->config,
                'url_form' => $this->config['controller_url'].'/form',
                'url_insert_update' => $this->config['controller_url'].'/insert_update'.($this->is_new ? '' : '/'.$this->item->{$this->pk}),
                'is_new' => $this->is_new,
                'actions' => $this->get_actions(),
                'tab_params' => $this->get_tab_params(),
            ),
            'item' => $this->item,
        );
        if ($this->behaviours['translatable']) {
            $view_params['crud']['site'] = $this->item->{$this->behaviours['translatable']['site_property']};
        }

        $view_params['view_params'] = &$view_params;

        return $view_params;
    }

    public function action_form($id = null)
    {
        try {
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
        } catch (\Exception $e) {
            $this->send_error($e);
        }
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
            } elseif (!empty($common_id) && $this->behaviours['translatable']) {
                $this->item->{$this->behaviours['translatable']['common_id_property']} = $common_id;
            } elseif (!empty($context_id) && !empty($this->config['context_relation'])) {
                $model_context = $this->config['context_relation']->model_to;
                $this->item_context = $model_context::find($context_id);
                $this->item->{$this->config['context_relation']->key_from[0]} = $this->item_context->{$this->config['context_relation']->key_to[0]};
            }
            if ($this->behaviours['translatable']) {
                $this->item->{$this->behaviours['translatable']['site_property']} = \Input::get('site', false) ? : key(\Config::get('sites'));
            }
            if ($this->behaviours['translatable'] && $this->behaviours['tree']) {
                // New page: no parent
                // Translation: we have a common_id and can determine the parent
                if (!empty($this->item->{$this->behaviours['translatable']['common_id_property']})) {
                    $model = $this->config['model'];
                    $item_site_common = $model::find($this->item->{$this->behaviours['translatable']['common_id_property']});
                    $item_parent = $item_site_common->get_parent();

                    // Fetch in the appropriate site
                    if (!empty($item_parent)) {
                        $item_parent = $item_parent->find_site($this->item->{$this->behaviours['translatable']['site_property']});
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
        if ($this->behaviours['translatable']) {
            $fields = \Arr::merge(
                $fields,
                array(
                    $this->behaviours['translatable']['site_property'] => array(
                        'form' => array(
                            'type' => 'hidden',
                            'value' => $this->item->{$this->behaviours['translatable']['site_property']},
                        ),
                    ),
                    $this->behaviours['translatable']['common_id_property'] => array(
                        'form' => array(
                            'type' => 'hidden',
                            'value' => $this->item->{$this->behaviours['translatable']['common_id_property']},
                        ),
                    ),
                )
            );
        }
        if ($this->is_new) {
            if ($this->behaviours['translatable'] && $this->behaviours['tree']) {
                $parent_id = $this->item->parent_relation()->key_from[0];
                $fields = \Arr::merge(
                    $fields,
                    array(
                        $parent_id => array(
                            'widget_options' => array(
                                'site' => $this->item->{$this->behaviours['translatable']['site_property']},
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
                            'value' => __('Add'),
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
        $fieldset->form()->set_config('field_template', \View::forge('nos::crud/field_template'));

        foreach ($fieldset->field() as $field) {
            if ($field->type == 'checkbox') {
                $field->set_template(\View::forge('nos::crud/field_template', array('type' => 'checkbox')));
            }
        }

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
        if ($this->behaviours['translatable']) {
            $dispatchEvent['site_common_id'] = (int) $item->{$this->behaviours['translatable']['common_id_property']};
            $dispatchEvent['site'] = $item->{$this->behaviours['translatable']['site_property']};
        }

        $return = array(
            'notify' => $this->is_new ? $this->config['messages']['successfully added'] : $this->config['messages']['successfully saved'],
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
        if ($this->behaviours['translatable'] && $this->is_new) {

            $item_site = $this->item->get_site();
            $existing = $this->item->find_site($item_site);
            if (!empty($existing)) {
                $message = strtr(
                    __('This item already exists in {site}. Therefore your item cannot be added.'),
                    array(
                        '{site}' => \Arr::get(\Config::get('sites'), $item_site, $item_site),
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

            // Event 'change_parent' will set the appropriate site
            $item->set_parent($parent);
        }
    }

    public function action_insert_update($id = null)
    {
        // insert_update               : add a new item
        // insert_update/ID            : edit an existing item
        // insert_update/ID?site=fr_FR : translate an existing item (can be forbidden if the parent doesn't exists in that site)

        $this->item = $this->crud_item($id);
        $this->is_new = $this->item->is_new();

        if (empty($this->item)) {
            return $this->send_error(new \Exception($this->config['messages']['item deleted']));
        }

        if ($this->is_new || !$this->behaviours['translatable']) {
            return $this->action_form($id);
        }

        if ($this->behaviours['translatable']) {
            $selected_site = \Input::get('site', $this->is_new ? null : $this->item->get_site());

            foreach ($this->item->get_all_site() as $site_id => $site) {
                if ($selected_site == $site) {
                    return $this->action_form($site_id);
                }
            }

            $_GET['common_id'] = $id;
            return $this->blank_slate($id, $selected_site);
        }
    }

    public function blank_slate($id, $site)
    {
        $this->item = $this->crud_item($id);
        $this->is_new = true;
        if (empty($site)) {
            $site = \Input::get('site', key(\Config::get('sites')));
        }

        $view_params = array_merge(
            $this->view_params(),
            array(
                'site' => $site,
                'common_id' => \Input::get('common_id', ''),
            )
        );
        $view_params['crud']['tab_params']['url'] .= '?site='.$site;
        $view_params['crud']['tab_params']['label'] = $this->config['tab']['labels']['blankSlate'];

        // We can't do this form inside the view_params() method, because additional vars (added
        // after the reference was created) won't be available from the reference
        $view_params['view_params'] = &$view_params;

        return \View::forge('nos::crud/blank_slate', $view_params, false);
    }

    protected function get_tab_params()
    {
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
            if ($this->behaviours['translatable']) {
                $params['site'] = $this->item->get_site();
            }
            if (count($params)) {
                $url .= '?'.http_build_query($params);
            }
        }

        $tabInfos = array(
            'iconUrl' => $this->config['tab']['iconUrl'],
            'label' => $this->is_new ? $this->config['tab']['labels']['insert'] : (is_callable($labelUpdate) ? $labelUpdate($this->item) : (empty($labelUpdate) ? $this->item->title_item() : $this->item->{$labelUpdate})),
            'url' => $url,
        );

        return $tabInfos;
    }

    protected function get_actions()
    {
        $actions = array_values($this->get_actions_site());
        if (!$this->is_new) {
            if ($this->behaviours['url'] !== false) {
                $url = $this->item->url_canonical(array('preview' => true));
                if ($url !== null) {
                    $actions[] = array(
                        'label' => $this->config['messages']['visualise'],
                        'iconClasses' => 'nos-icon16 nos-icon16-eye',
                        'action' => array(
                            'action' => 'window.open',
                            'url' => $url.'?_preview=1',
                        ),
                    );
                }
            }
            $actions[] = array(
                'label' => $this->config['messages']['delete'],
                'action' => array(
                    'action' => 'confirmationDialog',
                    'dialog' => array(
                        'contentUrl' => $this->config['controller_url'].'/delete/'.$this->item->{$this->pk},
                        'title' => $this->config['messages']['delete an item'],
                    ),
                ),
                'icon' => 'trash',
            );
        }
        foreach ($this->config['actions'] as $actionClosure) {
            if ($action = $actionClosure($this->item)) {
                $actions[] = $action;
            }
        }
        if (!$this->is_new) {
            if ($this->behaviours['sharable']) {
                $actions[] = array(
                    'label' => __('Share'),
                    'iconClasses' => 'nos-icon16 nos-icon16-share',
                    'action' => array(
                        'action' => 'share',
                        'data' => array(
                            'model_id' => $this->item->{$this->pk},
                            'model_name' => $this->config['model'],
                        ),
                    ),
                );
            }
        }

        return $actions;
    }

    protected function get_actions_site()
    {
        if (!$this->behaviours['translatable']) {
            return array();
        }

        $actions = array();
        $sites = array_keys(\Config::get('sites'));
        $main_site = $this->item->find_main_site();
        foreach ($sites as $locale) {
            if ($this->item->{$this->behaviours['translatable']['site_property']} === $locale) {
                continue;
            }
            $item_site = $this->item->find_site($locale);
            $url = $this->config['controller_url'].'/insert_update'.(empty($item_site) ? (empty($main_site) ? '' : '/'.$main_site->id).'?site='.$locale : '/'.$item_site->id);
            $label = empty($main_site) ? $this->config['messages']['add an item in site'] : (empty($item_site) ? __('Translate in {site}') : __('Edit in {site}'));
            $actions[$locale] = array(
                'label' => strtr($label, array('{site}' => \Arr::get(\Config::get('sites'), $locale, $locale))),
                'iconUrl' => \Nos\Helper::flag_url($locale),
                'action' => array(
                    'action' => 'nosTabs',
                    'method' => empty($main_site) ? 'add' : 'open',
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
            throw new \Exception($this->config['messages']['not found']);
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
        $dispatchEvent = null;
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

        if ($this->behaviours['translatable']) {
            $dispatchEvent['site_common_id'] = $this->item->{$this->behaviours['translatable']['common_id_property']};
            $dispatchEvent['id'] = array();
            $dispatchEvent['site'] = array();

            // Delete all sites by default
            $site = \Input::post('site', 'all');

            // Delete children for all sites
            if ($site === 'all') {
                foreach ($this->item->find_site('all') as $item_site) {
                    $dispatchEvent['id'][] = (int) $item_site->{$this->pk};
                    $dispatchEvent['site'][] = $item_site->{$this->behaviours['translatable']['site_property']};

                    if ($this->behaviours['tree']) {
                        foreach ($item_site->get_ids_children(false) as $item_id) {
                            $dispatchEvent['id'][] = (int) $item_id;
                        }
                    }
                }

                // Children will be deleted recursively (with the 'after_delete' event from the Tree behaviour)
                // Optimised operation for deleting all sites
                $this->item->delete_all_site();

            } else {
                // Search for the appropriate page
                if ($this->item->get_site() != $site) {
                    $this->item = $this->item->find_site($site);
                }
                $this->check_permission('delete');

                $dispatchEvent['id'][] = $this->item->{$this->pk};
                $dispatchEvent['site'][] = $this->item->{$this->behaviours['translatable']['site_property']};
                if ($this->behaviours['tree']) {
                    foreach ($this->item->get_ids_children(false) as $item_id) {
                        $dispatchEvent['id'][] = (int) $item_id;
                    }
                }

                // Reassigns common_id if this item is the main site (with the 'after_delete' event from the Translatable behaviour)
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
                'notify' => $this->config['messages']['successfully deleted'],
                'dispatchEvent' => $dispatchEvent,
            )
        );
    }

    public function delete()
    {
    }
}
