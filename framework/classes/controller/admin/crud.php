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
        ),
        'tab' => array(
            'iconUrl' => '',
            'labels' => array(
                'update' => null,
                'insert' => 'New item',
                'blankSlate' => 'Translate an item',
            ),
            'actions' => array(),
        ),
        'layout' => array(),
        'fields' => array(),
        'views' => array(
            'form' => 'nos::form/insert_update',
            'delete' => 'nos::form/delete_popup',
        ),
    );

    protected $pk = '';
    protected $behaviour_translatable = false;
    protected $behaviour_tree = false;
    protected $item = null;
    protected $item_from = null;
    protected $item_parent = null;

    public function before() {
        parent::before();

        $model = $this->config['model'];
        $this->behaviour_translatable = $model::behaviours('Nos\Orm_Behaviour_Translatable');
        $this->behaviour_tree = $model::behaviours('Nos\Orm_Behaviour_Tree');
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
            'translatable' => $this->behaviour_translatable,
            'tree' => $this->behaviour_tree,
            'pk' => $this->pk,
            'item' => $this->item,
            'config' => $this->config,
        );
        if ($this->behaviour_translatable)
        {
            $params['lang'] = $this->item->{$this->behaviour_translatable['lang_property']};
        }
        return $params;
    }

    public function action_form($id = null)
    {
        try {
            $this->item = $this->crud_item($id);
            if ($this->item->is_new())
            {
                $create_from_id = \Input::get('create_from_id', 0);
                if (!empty($create_from_id))
                {
                    $this->item_from = $this->crud_item($create_from_id);
                }
            }
            $this->form_item();
            $this->check_permission($this->item->is_new() ? 'insert' : 'update');

            $fields = $this->fields($this->config['fields']);
            $fieldset = \Fieldset::build_from_config($fields, $this->item, $this->build_from_config());
            $fieldset = $this->fieldset($fieldset);


            $params = array_merge($this->view_params(), array(
                'url_insert_update' => $this->config['controller_url'].'/insert_update/'.($this->item->is_new() ? '' : '/'.$this->item->{$this->pk}),
                'fieldset' => $fieldset,
                'tab_params' => $this->get_tab_params(),
            ));

            return \View::forge($this->config['views']['form'], array('view_params' => $params), false);
        } catch (\Exception $e) {
            $this->send_error($e);
        }
    }

    protected function form_item()
    {
        if ($this->item->is_new())
        {
            if (!$this->item_from)
            {
                if ($this->behaviour_translatable)
                {
                    $this->item->{$this->behaviour_translatable['common_id_property']} = \Input::get('common_id');
                }
            }
            else
            {
                $this->item      = clone $this->item_from;
            }
            if ($this->behaviour_translatable)
            {
                $this->item->{$this->behaviour_translatable['lang_property']} = \Input::get('lang', key(\Config::get('locales')));
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
        if ($this->behaviour_translatable)
        {
            $fields = \Arr::merge($fields, array(
                $this->behaviour_translatable['lang_property'] => array(
                    'form' => array(
                        'type' => 'hidden',
                        'value' => $this->item->is_new() ? \Input::get('lang') : $this->item->{$this->behaviour_translatable['lang_property']},
                    ),
                ),
                $this->behaviour_translatable['common_id_property'] => array(
                    'form' => array(
                        'type' => 'hidden',
                        'value' => $this->item->{$this->behaviour_translatable['common_id_property']},
                    ),
                ),
            ));
        }
        if ($this->item->is_new())
        {
            if ($this->behaviour_translatable && $this->behaviour_tree)
            {
                $parent_id = $this->item->parent_relation()->key_from[0];
                $fields = \Arr::merge($fields, array(
                    $parent_id => array(
                        'widget_options' => array(
                            'lang' => $this->item->{$this->behaviour_translatable['lang_property']},
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
        $fieldset->form()->set_config('field_template', \View::forge('nos::form/insert_update_field_template'));

        foreach ($fieldset->field() as $field)
        {
            if ($field->type == 'checkbox')
            {
                $field->set_template(\View::forge('nos::form/insert_update_field_template', array('type' => 'checkbox')));
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
            'action' => $this->item->is_new() ? 'insert' : 'update',
            'id' => $object->{$this->pk},
        );
        if ($this->behaviour_translatable) {
            $dispatchEvent['lang_common_id'] = $object->{$this->behaviour_translatable['common_id_property']};
            $dispatchEvent['lang'] = $object->{$this->behaviour_translatable['lang_property']};
        }

        $return = array(
            'notify' =>  $this->item->is_new() ? $this->config['messages']['successfully added'] : $this->config['messages']['successfully saved'],
            'dispatchEvent' => $dispatchEvent,
        );
        if ($this->item->is_new())
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
        $selected_lang = \Input::get('lang', $this->item->is_new() ? null : $this->item->get_lang());

        if ($this->item->is_new())
        {
            return $this->action_form($id);
        }
        else
        {
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
    }

    public function blank_slate($id, $lang)
    {
        $this->item = $this->crud_item($id);
        if (empty($lang))
        {
            $lang = \Input::get('lang', key(\Config::get('locales')));
        }

        $tabInfos = $this->get_tab_params($this->item, true);
        $tabInfos['url'] .= '?lang='.$lang;
        $tabInfos = \Arr::merge($tabInfos, $this->config['tab']['labels']['blankSlate']);

        $viewData = array(
            'item'      => $this->item,
            'lang'      => $lang,
            'common_id' => \Input::get('common_id', ''),
            'item_text' => $this->config['message']['blank_state_item_text'],
            'url_form'  => $this->config['controller_url'].'/form',
            'url_insert_update'  => $this->config['controller_url'].'/insert_update',
            'tabInfos'  => $tabInfos,
        );
        return \View::forge('nos::form/layout_blank_slate', $viewData, false);
    }

    protected function get_tab_params($faded = false)
    {
        $labelUpdate = $this->config['tab']['labels']['update'];
        $tabInfos = array(
            'iconUrl' => $this->config['tab']['iconUrl'],
            'label' => $this->item->is_new() ? $this->config['tab']['labels']['insert'] : (is_callable($labelUpdate) ? $labelUpdate($this->item) : (empty($labelUpdate) ? $this->item->title_item() : $this->item->{$labelUpdate})),
            'url' => $this->config['controller_url'].'/insert_update'.($this->item->is_new() ? '?lang='.$this->item->get_lang() : '/'.$this->item->id),
            'actions' => array_values($this->get_actions_lang($this->item)),
        );
        if (!$this->item->is_new())
        {
            foreach ($this->config['tab']['actions'] as $actionClosure)
            {
                $action = $actionClosure($this->item);
                if ($faded)
                {
                    unset($action['action']);
                    $action['faded'] = true;
                }
                $tabInfos['actions'][] = $action;
            }
        }

        return $tabInfos;
    }


    protected function get_actions_lang()
    {
        if (!$this->behaviour_translatable) {
            return array();
        }

        $actions = array();
        $locales = array_keys(\Config::get('locales'));
        if ($this->item->is_new())
        {
            foreach ($locales as $locale)
            {
                $actions[$locale] = array(
                    'label' => strtr(__('Add in {lang}'), array('{lang}' => \Arr::get(\Config::get('locales'), $locale, $locale))),
                    'action' => array(
                        'openTab' => $this->config['controller_url'].'/insert_update?lang='.$locale,
                    ),
                    'iconUrl' => \Nos\Helper::flag_url($locale),
                );
            }
        }
        else
        {
            $main_lang = $this->item->find_main_lang();
            foreach ($locales as $locale)
            {
                $item_lang = $this->item->find_lang($locale);
                $actions[$locale] = array(
                    'label' => strtr(
                            empty($item_lang) ? __('Translate in {lang}') : __('Edit in {lang}'), array('{lang}' => \Arr::get(\Config::get('locales'), $locale, $locale))
                    ),
                    'action' => array(
                        'openTab' => $this->config['controller_url'].'/insert_update/'.(empty($item_lang) ? $main_lang->id.'?lang='.$locale : $item_lang->id), // .'?lang='.$locale, // .'&common_id='.$main_lang->id
                    ),
                    'iconUrl' => \Nos\Helper::flag_url($locale),
                );
            }
        }
        return $actions;
    }

    protected function check_permission($action) {
        if ($action === 'delete' && $this->item->is_new()) {
            throw new \Exception($this->config['messages']['not found']);
        }
    }

    public function action_delete($id)
    {
        try {
            $this->item = $this->crud_item($id);
            $this->check_permission('delete');
            return \View::forge($this->config['views']['delete'], array('view_params' => $this->view_params()), false);
        } catch (\Exception $e) {
            $this->send_error($e);
        }
    }

    public function action_delete_confirm()
    {
        try {
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
            if ($this->behaviour_translatable)
            {
                $dispatchEvent['lang_common_id'] = $this->item->{$this->behaviour_translatable['common_id_property']};
                $dispatchEvent['id'] = array();
                $dispatchEvent['lang'] = array();

                // Delete all languages by default
                $lang = \Input::post('lang', 'all');

                // Delete children for all languages
                if ($lang === 'all') {
                    foreach ($this->item->find_lang('all') as $item_lang)
                    {
                        $dispatchEvent['id'][] = $item_lang->{$this->pk};
                        $dispatchEvent['lang'][] = $item_lang->{$this->behaviour_translatable['lang_property']};

                        if ($this->behaviour_tree)
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
                    $dispatchEvent['lang'][] = $this->item->{$this->behaviour_translatable['lang_property']};
                    if ($this->behaviour_tree)
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
                if ($this->behaviour_tree)
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
        } catch (\Exception $e) {
            $this->send_error($e);
        }
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