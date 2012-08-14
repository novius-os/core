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
            'blank_state_item_text' => 'item',
            'visualise' => 'Visualise',
            'delete' => 'Delete',
            'delete a item' => 'Delete a item',
            'confirm deletion ok' => 'Confirm the deletion',
            'confirm deletion or' => 'or',
            'confirm deletion cancel' => 'Cancel',
            'confirm deletion wrong_confirmation' => 'Wrong confirmation',
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

    public function before() {
        parent::before();
        $this->config_build();
    }

    protected function config_build() {
        $model = $this->config['model'];

        if (!empty($this->config['context_relation']))
        {
            $this->config['context_relation'] = $model::relations($this->config['context_relation']);
            if (!is_a($this->config['context_relation'], 'Orm\\BelongsTo')) {
                $this->config['context_relation'] = null;
            }
        }

        $this->config['views']['insert'] = !empty($this->config['views']['insert']) ? $this->config['views']['insert'] : $this->config['views']['form'];
        $this->config['views']['update'] = !empty($this->config['views']['update']) ? $this->config['views']['update'] : $this->config['views']['form'];

        if (empty($this->config['layout_insert']) && !empty($this->config['layout']))
        {
            $this->config['layout_insert'] = $this->config['layout'];
        }
        if (empty($this->config['layout_update']) && !empty($this->config['layout']))
        {
            $this->config['layout_update'] = $this->config['layout'];
        }

        $this->behaviours = array(
            'translatable' => $model::behaviours('Nos\Orm_Behaviour_Translatable', false),
            'tree' => $model::behaviours('Nos\Orm_Behaviour_Tree', false),
            'url' => $model::behaviours('Nos\Orm_Behaviour_Url', false),
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
        $params = array(
            'model' => $this->config['model'],
            'behaviours' => $this->behaviours,
            'pk' => $this->pk,
            'item' => $this->item,
            'context' => $this->item_context,
            'config' => $this->config,
        );
        if ($this->behaviours['translatable'])
        {
            $params['lang'] = $this->item->{$this->behaviours['translatable']['lang_property']};
        }
        return $params;
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

            $params = array_merge($this->view_params(), array(
                'url_insert_update' => $this->config['controller_url'].'/insert_update'.($this->is_new ? '' : '/'.$this->item->{$this->pk}),
                'is_new' => $this->is_new,
                'fieldset' => $fieldset,
                'actions' => $this->get_actions(),
                'tab_params' => $this->get_tab_params(),
            ));

            return \View::forge($this->is_new ? $this->config['views']['insert'] : $this->config['views']['update'], array('view_params' => $params), false);
        } catch (\Exception $e) {
            $this->send_error($e);
        }
    }

    protected function form_item()
    {
        if ($this->is_new)
        {
            $create_from_id = \Input::get('create_from_id', 0);
            $common_id = \Input::get('common_id', null);
            $context_id = \Input::get('context_id', null);
            if (!empty($create_from_id))
            {
                $this->item_from = $this->crud_item($create_from_id);
                $this->item = clone $this->item_from;
            }
            else if (!empty($common_id) && $this->behaviours['translatable'])
            {
                $this->item->{$this->behaviours['translatable']['common_id_property']} = $common_id;
            }
            else if (!empty($context_id) && !empty($this->config['context_relation']))
            {
                $model_context = $this->config['context_relation']->model_to;
                $this->item_context = $model_context::find($context_id);
                $this->item->{$this->config['context_relation']->key_from[0]} = $this->item_context->{$this->config['context_relation']->key_to[0]};
            }
            if ($this->behaviours['translatable'])
            {
                $lang = \Input::get('lang', key(\Config::get('locales')));
                $this->item->{$this->behaviours['translatable']['lang_property']} = empty($lang) ? key(\Config::get('locales')) : $lang;
            }
        }
    }

    protected function fields($fields)
    {
        if (!empty($this->item_from))
        {
            $fields['create_from_id'] = array(
                'form' => array(
                    'type' => 'hidden',
                    'value' => \Input::get('create_from_id', 0),
                ),
            );
        }
        if ($this->behaviours['translatable'])
        {
            $fields = \Arr::merge($fields, array(
                $this->behaviours['translatable']['lang_property'] => array(
                    'form' => array(
                        'type' => 'hidden',
                        'value' => $this->is_new ? \Input::get('lang') : $this->item->{$this->behaviours['translatable']['lang_property']},
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
        if ($this->is_new)
        {
            if ($this->behaviours['translatable'] && $this->behaviours['tree'])
            {
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

    protected function fieldset($fieldset)
    {
        $fieldset->js_validation();
        $fieldset->populate_with_instance($this->item);
        $fieldset->form()->set_config('field_template', \View::forge('nos::crud/field_template'));

        foreach ($fieldset->field() as $field)
        {
            if ($field->type == 'checkbox')
            {
                $field->set_template(\View::forge('nos::crud/field_template', array('type' => 'checkbox')));
            }
        }
        return $fieldset;
    }

    protected function build_from_config() {
        return array(
            'before_save' => array($this, 'before_save'),
            'success' => array($this, 'save'),
        );
    }

    public function save($object, $data) {
        $dispatchEvent = array(
            'name' => $this->config['model'],
            'action' => $this->is_new ? 'insert' : 'update',
            'id' => $object->{$this->pk},
        );
        if ($this->behaviours['translatable']) {
            $dispatchEvent['lang_common_id'] = $object->{$this->behaviours['translatable']['common_id_property']};
            $dispatchEvent['lang'] = $object->{$this->behaviours['translatable']['lang_property']};
        }

        $return = array(
            'notify' =>  $this->is_new ? $this->config['messages']['successfully added'] : $this->config['messages']['successfully saved'],
            'closeDialog' => true,
            'dispatchEvent' => $dispatchEvent,
        );
        if ($this->is_new)
        {
            $return['replaceTab'] = $this->config['controller_url'].'/insert_update/'.$object->{$this->pk};
        }
        return $return;
    }

    public function before_save($object, $data) {
    }

    public function action_insert_update($id = null)
    {
        // insert_update               : add a new item
        // insert_update/ID            : edit an existing item
        // insert_update/ID?lang=fr_FR : translate an  existing item (can be forbidden if the parent doesn't exists in that language)

        $this->item = $this->crud_item($id);

        if ($this->item->is_new())
        {
            return $this->action_form($id);
        }
        else
        {
            if ($this->behaviours['translatable']) {
                $selected_lang = \Input::get('lang', $this->item->is_new() ? null : $this->item->get_lang());
                $all_langs = $this->item->get_all_lang();

                if (in_array($selected_lang, $all_langs))
                {
                    return $this->action_form($id);
                }
                else
                {
                    $_GET['common_id'] = $id;
                    return $this->blank_slate($id, $selected_lang);
                }
            }
            else
            {
                return $this->action_form($id);
            }
        }
    }

    public function blank_slate($id, $lang)
    {
        $this->item = $this->crud_item($id);
        if (empty($lang))
        {
            $lang = \Input::get('lang', key(\Config::get('locales')));
        }

        $tabInfos = $this->get_tab_params();
        $tabInfos['url'] .= '?lang='.$lang;
        $tabInfos = \Arr::merge($tabInfos, array('label' => $this->config['tab']['labels']['blankSlate']));

        $viewData = array_merge($this->view_params(), array(
            'lang'      => $lang,
            'common_id' => \Input::get('common_id', ''),
            'item_text' => $this->config['messages']['blank_state_item_text'],
            'url_form'  => $this->config['controller_url'].'/form',
            'url_insert_update'  => $this->config['controller_url'].'/insert_update',
            'tab_params'  => $tabInfos,
        ));
        return \View::forge('nos::crud/blank_slate', $viewData, false);
    }

    protected function get_tab_params()
    {
        $labelUpdate = $this->config['tab']['labels']['update'];
        $url = $this->config['controller_url'].'/insert_update'.($this->is_new ? '' : '/'.$this->item->id);
        if ($this->is_new)
        {
            $params = array();
            foreach (array('create_from_id', 'common_id', 'context_id') as $key)
            {
                $value = \Input::get($key, false);
                if ($value !== false)
                {
                    $params[$key] = $value;
                }
            }
            if ($this->behaviours['translatable'])
            {
                $params['lang'] = $this->item->get_lang();
            }
            if (count($params))
            {
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
        $actions = array_values($this->get_actions_lang());
        if (!$this->is_new && $this->behaviours['url'] !== false) {
            $url = $this->item->first_url();
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
        if (!$this->is_new) {
            $actions[] = array(
                'label' => $this->config['messages']['delete'],
                'action' => array(
                    'action' => 'confirmationDialog',
                    'dialog' => array(
                        'contentUrl' => $this->config['controller_url'].'/delete/'.$this->item->{$this->pk},
                        'title' => $this->config['messages']['delete a item'],
                    ),
                ),
                'icon' => 'trash',
            );
        }
        foreach ($this->config['actions'] as $actionClosure)
        {
            if ($action = $actionClosure($this->item)) {
                $actions[] = $action;
            }
        }

        return $actions;
    }

    protected function get_actions_lang()
    {
        if (!$this->behaviours['translatable']) {
            return array();
        }

        $actions = array();
        $locales = array_keys(\Config::get('locales'));
        $main_lang = $this->item->find_main_lang();
        foreach ($locales as $locale)
        {
            if ($this->item->{$this->behaviours['translatable']['lang_property']} === $locale)
            {
                continue;
            }
            $item_lang = $this->item->find_lang($locale);
            $url = $this->config['controller_url'].'/insert_update'.(empty($item_lang) ? (empty($main_lang) ? '' : '/'.$main_lang->id).'?lang='.$locale : '/'.$item_lang->id);
            $label = empty($main_lang) ? __('Add in {lang}') : (empty($item_lang) ? __('Translate in {lang}') : __('Edit in {lang}'));
            $actions[$locale] = array(
                'label' => strtr($label, array('{lang}' => \Arr::get(\Config::get('locales'), $locale, $locale))),
                'iconUrl' => \Nos\Helper::flag_url($locale),
                'action' => array(
                    'action' => 'nosTabs',
                    'tab' => array(
                        'url' => $url
                    ),
                ),
            );
        }
        return $actions;
    }

    protected function check_permission($action) {
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
                $this->check_permission('delete');
                return \View::forge('nos::crud/delete_popup_layout', array('view_params' => $this->view_params()), false);
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
        $this->check_permission('delete');

        $dispatchEvent = array(
            'name' => $this->config['model'],
            'action' => 'delete',
            'id' => $id,
        );

        $this->delete();

        if ($this->behaviours['translatable'])
        {
            $dispatchEvent['lang_common_id'] = $this->item->{$this->behaviours['translatable']['common_id_property']};
            $dispatchEvent['id'] = array();
            $dispatchEvent['lang'] = array();

            // Delete all languages by default
            $lang = \Input::post('lang', 'all');

            // Delete children for all languages
            if ($lang === 'all') {
                foreach ($this->item->find_lang('all') as $item_lang)
                {
                    $dispatchEvent['id'][] = $item_lang->{$this->pk};
                    $dispatchEvent['lang'][] = $item_lang->{$this->behaviours['translatable']['lang_property']};

                    if ($this->behaviours['tree'])
                    {
                        foreach ($item_lang->get_ids_children(false) as $item_id)
                        {
                            $dispatchEvent['id'][] = $item_id;
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
                if ($this->behaviours['tree'])
                {
                    foreach ($this->item->get_ids_children(false) as $item_id)
                    {
                        $dispatchEvent['id'][] = $item_id;
                    }
                }

                // Reassigns common_id if this item is the main language (with the 'after_delete' event from the Translatable behaviour)
                // Children will be deleted recursively (with the 'after_delete' event from the Tree behaviour)
                $this->item->delete();
            }
        } else {
            if ($this->behaviours['tree'])
            {
                $dispatchEvent['id'] = array($this->item->{$this->pk});
                foreach ($this->item->get_ids_children(false) as $item_id)
                {
                    $dispatchEvent['id'][] = $item_id;
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

    protected function send_error($exception) {
        // Easy debug
        if (\Fuel::$env === \Fuel::DEVELOPMENT && !\Input::is_ajax()) {
            throw $exception;
        }
        $body = array(
            'error' => $exception->getMessage(),
        );
        \Response::json($body);
    }
}