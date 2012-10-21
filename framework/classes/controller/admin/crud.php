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
            'exists in multiple lang' => 'This item exists in <strong>{count} languages</strong>.',
            'delete in the following languages' => 'Delete this item in the following languages:',
            'item has 1 sub-item' => 'This item has <strong>1 sub-item</strong>.',
            'item has multiple sub-items' => 'This item has <strong>{count} sub-items</strong>.',
            'confirm deletion, enter number' => 'To confirm the deletion, you need to enter this number in the field below',
            'yes delete sub-items' => 'Yes, I want to delete this item and all of its {count} sub-items.',
            'item deleted' => 'This item has been deleted.',
            'not found' => 'Item not found',
            'error added in lang not parent' => 'This item cannot be added {lang} because its {parent} is not available in this language yet.',
            'error added in lang' => 'This item cannot be added {lang}.',
            'item inexistent in lang yet' => 'This item has not been added in {lang} yet.',
            'visualise' => 'Visualise',
            'delete' => 'Delete',
            'delete an item' => 'Delete an item',
            'confirm deletion ok' => 'Confirm the deletion',
            'confirm deletion or' => 'or',
            'confirm deletion cancel' => 'Cancel',
            'confirm deletion wrong_confirmation' => 'Wrong confirmation',
            'add an item in lang' => 'Add a new item in {lang}',
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

    /**
     * Set properties from the config
     */
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
        $view_params = array(
            'crud' => array(
                'model' => $this->config['model'],
                'behaviours' => $this->behaviours,
                'pk' => $this->pk,
                'context' => $this->item_context,
                'config' => $this->config,
                'url_form'  => $this->config['controller_url'].'/form',
                'url_insert_update'  => $this->config['controller_url'].'/insert_update'.($this->is_new ? '' : '/'.$this->item->{$this->pk}),
                'url_actions'  => $this->config['controller_url'].'/json_actions'.($this->is_new ? '' : '/'.$this->item->{$this->pk}),
                'is_new' => $this->is_new,
                'actions' => $this->get_actions(),
                'tab_params' => $this->get_tab_params(),
            ),
            'item' => $this->item,
        );
        if ($this->behaviours['translatable']) {
            $view_params['crud']['lang'] = $this->item->{$this->behaviours['translatable']['lang_property']};
        }

        $view_params['view_params'] = &$view_params;

        return $view_params;
    }
    
    /**
     * Called before displaying the form to 
     * - call from_item
     * - check permission
     * - build fields
     * @param type $id
     * @return View
     */
    public function action_form($id = null)
    {
        try {
            $this->item = $this->crud_item($id);
            $this->clone = clone $this->item;
            $this->is_new = $this->item->is_new();
            $this->from_item();
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

    /**
     * from_item() is used to pre-configure an object based on a related other object.
     */
    protected function from_item()
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
                $this->item->{$this->behaviours['translatable']['lang_property']} = \Input::get('lang', false) ?: key(\Config::get('locales'));
            }
            if ($this->behaviours['translatable'] && $this->behaviours['tree']) {
                // New page: no parent
                // Translation: we have a common_id and can determine the parent
                if (!empty($this->item->{$this->behaviours['translatable']['common_id_property']})) {
                    $model = $this->config['model'];
                    $item_lang_common = $model::find($this->item->{$this->behaviours['translatable']['common_id_property']});
                    $item_parent = $item_lang_common->get_parent();

                    // Fetch in the appropriate lang
                    if (!empty($item_parent)) {
                        $item_parent = $item_parent->find_lang($this->item->{$this->behaviours['translatable']['lang_property']});
                    }

                    // Set manually, because set_parent doesn't handle new items
                    if (!empty($item_parent)) {
                        $this->item->{$this->item->parent_relation()->key_from[0]} = $item_parent->{$this->pk};
                    }
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
                    'value' => \Input::get('create_from_id', 0),
                ),
            );
        }
        if ($this->behaviours['translatable']) {
            $fields = \Arr::merge($fields, array(
                $this->behaviours['translatable']['lang_property'] => array(
                    'form' => array(
                        'type' => 'hidden',
                        'value' => $this->item->{$this->behaviours['translatable']['lang_property']},
                    ),
                ),
                $this->behaviours['translatable']['common_id_property'] => array(
                    'form' => array(
                        'type' => 'hidden',
                        'value' => $this->item->{$this->behaviours['translatable']['common_id_property']},
                    ),
                ),
            ));
        }
        if ($this->is_new) {
            if ($this->behaviours['translatable'] && $this->behaviours['tree']) {
                $parent_id = $this->item->parent_relation()->key_from[0];
                $fields = \Arr::merge($fields, array(
                    $parent_id => array(
                        'widget_options' => array(
                            'lang' => $this->item->{$this->behaviours['translatable']['lang_property']},
                        ),
                    ),
                ));
            }

            $fields = \Arr::merge($fields, array(
                'save' => array(
                    'form' => array(
                        'value' => __('Add'),
                    ),
                ),
            ));
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
        $fieldset->js_validation();
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
        if ($this->behaviours['translatable']) {
            $dispatchEvent['lang_common_id'] = (int) $item->{$this->behaviours['translatable']['common_id_property']};
            $dispatchEvent['lang'] = $item->{$this->behaviours['translatable']['lang_property']};
        }

        $return = array(
            'notify' =>  $this->is_new ? $this->config['messages']['successfully added'] : $this->config['messages']['successfully saved'],
            'closeDialog' => true,
            'dispatchEvent' => $dispatchEvent,
        );
        if ($this->is_new) {
            $return['replaceTab'] = $this->config['controller_url'].'/insert_update/'.$item->{$this->pk};
        }

        return $return;
    }

    /**
     * Default method 'before_save' called when building fieldset.
     */
    public function before_save($item, $data)
    {
        if ($this->behaviours['translatable'] && $this->is_new) {

            $item_lang = $this->item->get_lang();
            $existing = $this->item->find_lang($item_lang);
            if (!empty($existing)) {
                $message = strtr(__('This item already exists in {lang}. Therefore your item cannot be added.'), array(
                    '{lang}' => \Arr::get(\Config::get('locales'), $item_lang, $item_lang),
                ));
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

            // Event 'change_parent' will set the appropriate lang
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
        // insert_update/ID            : edit an existing item
        // insert_update/ID?lang=fr_FR : translate an existing item (can be forbidden if the parent doesn't exists in that language)

        $this->item = $this->crud_item($id);

        if (empty($this->item)) {
            return $this->send_error(new \Exception($this->config['messages']['item deleted']));
        }

        $this->is_new = $this->item->is_new();

        if ($this->is_new || !$this->behaviours['translatable']) {
            return $this->action_form($id);
        }

        if ($this->behaviours['translatable']) {
            $selected_lang = \Input::get('lang', $this->is_new ? null : $this->item->get_lang());

            foreach ($this->item->get_all_lang() as $lang_id => $lang) {
                if ($selected_lang == $lang) {
                    return $this->action_form($lang_id);
                }
            }

            $_GET['common_id'] = $id;
            return $this->blank_slate($id, $selected_lang);
        }
    }

    /**
     * Display a blank slate to create a new item from an another one in a different language
     * @param type $id : orignal item's id
     * @param type $lang : chosen language
     * @return type View : blank_slate
     */
    public function blank_slate($id, $lang)
    {
        $this->item = $this->crud_item($id);
        $this->is_new = true;
        if (empty($lang)) {
            $lang = \Input::get('lang', key(\Config::get('locales')));
        }

        $view_params = array_merge($this->view_params(), array(
            'lang'      => $lang,
            'common_id' => \Input::get('common_id', ''),
        ));
        $view_params['crud']['tab_params']['url'] .= '?lang='.$lang;
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
            return $this->send_error(new \Exception($this->config['messages']['item deleted']));
        }

        $this->is_new = $this->item->is_new();

        \Response::json($this->get_actions());
    }

    /**
     * Return the config for setting the url of the novius-os tab
     * @return Array
     */
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
                $params['lang'] = $this->item->get_lang();
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

    /**
     * Get possible actions in the appdesk from the config
     * @return array
     */
    protected function get_actions()
    {
        $actions = array_values($this->get_actions_lang());
        if (!$this->is_new) {
            if ($this->behaviours['url'] !== false) {
                $url = $this->item->url_canonical(array('preview' => true));
                if ($url !== null) {
                    $actions[] = array(
                        'label' => $this->config['messages']['visualise'],
                        'iconClasses' => 'nos-icon16 nos-icon16-eye',
                        'action' => array(
                            'action' => 'window.open',
                            'url' => $url . '?_preview=1',
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
        foreach ($this->config['actions'] as $action) {
            $actions[] = is_callable($action) ? $action($this->item) : $action;
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

    /**
     * get standard actions to translate an item
     * @return type
     */
    protected function get_actions_lang()
    {
        if (!$this->behaviours['translatable']) {
            return array();
        }

        $actions = array();
        $locales = array_keys(\Config::get('locales'));
        $main_lang = $this->item->find_main_lang();
        foreach ($locales as $locale) {
            if ($this->item->{$this->behaviours['translatable']['lang_property']} === $locale) {
                continue;
            }
            $item_lang = $this->item->find_lang($locale);
            $url = $this->config['controller_url'].'/insert_update'.(empty($item_lang) ? (empty($main_lang) ? '' : '/'.$main_lang->id).'?lang='.$locale : '/'.$item_lang->id);
            $label = empty($main_lang) ? $this->config['messages']['add an item in lang'] : (empty($item_lang) ? __('Translate in {lang}') : __('Edit in {lang}'));
            $actions[$locale] = array(
                'label' => strtr($label, array('{lang}' => \Arr::get(\Config::get('locales'), $locale, $locale))),
                'iconUrl' => \Nos\Helper::flag_url($locale),
                'action' => array(
                    'action' => 'nosTabs',
                    'method' => empty($main_lang) ? 'add' : 'open',
                    'tab' => array(
                        'url' => $url
                    ),
                ),
            );
        }

        return $actions;
    }

    /**
     * Check if it's possible to delete an item, i.e. if it's not a new one.
     * @param type $action
     * @throws \Exception
     */
    protected function check_permission($action)
    {
        if ($action === 'delete' && $this->item->is_new()) {
            throw new \Exception($this->config['messages']['not found']);
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
                $this->check_permission('delete');

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
            $dispatchEvent['lang_common_id'] = $this->item->{$this->behaviours['translatable']['common_id_property']};
            $dispatchEvent['id'] = array();
            $dispatchEvent['lang'] = array();

            // Delete all languages by default
            $lang = \Input::post('lang', 'all');

            // Delete children for all languages
            if ($lang === 'all') {
                foreach ($this->item->find_lang('all') as $item_lang) {
                    $dispatchEvent['id'][] = (int) $item_lang->{$this->pk};
                    $dispatchEvent['lang'][] = $item_lang->{$this->behaviours['translatable']['lang_property']};

                    if ($this->behaviours['tree']) {
                        foreach ($item_lang->get_ids_children(false) as $item_id) {
                            $dispatchEvent['id'][] = (int) $item_id;
                        }
                    }
                }

                // Children will be deleted recursively (with the 'after_delete' event from the Tree behaviour)
                // Optimised operation for deleting all languages
                $this->item->delete_all_lang();

            } else {
                // Search for the appropriate page
                if ($this->item->get_lang() != $lang) {
                    $this->item = $this->item->find_lang($lang);
                }
                $this->check_permission('delete');

                $dispatchEvent['id'][] = $this->item->{$this->pk};
                $dispatchEvent['lang'][] = $this->item->{$this->behaviours['translatable']['lang_property']};
                if ($this->behaviours['tree']) {
                    foreach ($this->item->get_ids_children(false) as $item_id) {
                        $dispatchEvent['id'][] = (int) $item_id;
                    }
                }

                // Reassigns common_id if this item is the main language (with the 'after_delete' event from the Translatable behaviour)
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

        $this->response(array(
            'notify' => $this->config['messages']['successfully deleted'],
            'dispatchEvent' => $dispatchEvent,
        ));
    }

    public function delete()
    {
    }
}
