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

class Controller_Admin_Page_Page extends Controller_Admin_Crud {

    protected function crud_item($id)
    {
        return $id === null ? Model_Page::forge() : Model_Page::find($id);
    }

    public function action_form($id = null) {

        $fields = \Config::load('nos::controller/admin/page/form_page', true);

        // $id is set: edit the page
        if ($id !== null) {
            $page = Model_Page::find($id);
        } else {
            // Create a new page from another one
            $create_from_id = \Input::get('create_from_id', 0);
            if (!empty($create_from_id)) {
                 $page_from = Model_Page::find($create_from_id);
            }

            if (empty($page_from)) {
                $page = Model_Page::forge();
                $page->page_lang_common_id = \Input::get('common_id', null);
            } else {
                $page = clone $page_from;
            }
            $page->page_lang = \Input::get('lang', key(\Config::get('locales')));

            // New page: no parent
            // Translation: we have a common_id and can determine the parent
            if (!empty($page->page_lang_common_id)) {
                $page_lang_common = Model_Page::find($page->page_lang_common_id);
                $page_parent = $page_lang_common->find_parent();

                // Fetch in the appropriate lang
                if (!empty($page_parent)) {
                    $page_parent = $page_parent->find_lang($page->page_lang);
                }

                // Set manually, because set_parent doesn't handle new items
                if (!empty($page_parent)) {
                    $page->page_parent_id = $page_parent->page_id;
                }
            }

            $page_parent = Model_Page::find($page->page_parent_id);

            // The first page we create is a homepage
            $lang_has_home = (int) (bool) Model_Page::count(array(
                'where' => array(
                    array('page_home', '=', 1),
                    array('page_lang', $page->page_lang),
                ),
            ));
            // $lang_has_home is either 0 or 1 with the double cast
            $page->page_home     = 1 - $lang_has_home;
            $page->page_entrance = 1 - $lang_has_home;

            // Tweak the form for creation
            $fields = \Arr::merge($fields, array(
                'page_lang' => array(
                    'form' => array(
                        'type' => 'hidden',
                        // We need to set manually the value here, because the lang field won't be populated (restricted by the Translatable behaviour)
                        'value' => $page->page_lang,
                    ),
                ),
                'page_lang_common_id' => array(
                    'form' => array(
                        'type' => 'hidden',
                    ),
                ),
                'page_parent_id' => array(
                    'widget_options' => array(
                        'lang' => $page->page_lang,
                    ),
                ),
                'save' => array(
                    'form' => array(
                        'value' => __('Add'),
                    ),
                ),
            ));
        }

        if (!empty($create_from_id)) {
            $fields['create_from_id'] = array(
                'form' => array(
                    'type' => 'hidden',
                    'value' => $create_from_id,
                ),
            );
        }

        $is_new = $page->is_new();

        $fieldset = \Fieldset::build_from_config($fields, $page, array(
            'before_save' => function($page, $data) {

                // This doesn't work for now, because Fuel prevent relation from being fetch on new objects
                // https://github.com/fuel/orm/issues/171
                //$parent = $page->find_parent();

                // Instead, retrieve the object manually
                if (is_null($page->page_parent_id)) {
                    $page->page_level = 1;
                } else {
                    $parent = Model_Page::find($page->page_parent_id);
                    $page->set_parent($parent);
                    $page->page_level = $parent->page_level + 1;
                }

                foreach (\Input::post('wysiwyg', array()) as $key => $text) {
                    $page->wysiwygs->$key = $text;
                }
            },
            'success' => function() use ($page, $is_new) {

                $json = array(
                    'notify' => $is_new ? __('Page sucessfully added.') : __('Page successfully saved.'),
                    'dispatchEvent' => array(
                        'name' => get_class($page),
                        'action' => $is_new ? 'insert' : 'update',
                        'id' => $page->page_id,
                        'lang_common_id' => $page->page_lang_common_id,
                        'lang' => $page->page_lang,
                    ),
                );
                if ($is_new) {
                    $json['replaceTab'] = 'admin/nos/page/page/crud/'.$page->page_id;
                }
                return $json;
            }
        ));
        $fieldset->js_validation();

        return \View::forge('nos::admin/page/page_form', array(
            'page'     => $page,
            'fieldset' => $fieldset,
            'lang'     => $page->page_lang,
            'tabInfos' => $this->get_tabInfos($page)
        ), false);
    }

    protected static function  _get_page_with_permission($page_id, $permission) {
        if (empty($page_id)) {
            throw new \Exception('No page specified.');
        }
        $page = Model_Page::find($page_id);
        if (empty($page)) {
            throw new \Exception('Page not found.');
        }
        if (!static::check_permission_action('delete', 'controller/admin/page/appdesk/list', $page)) {
            throw new \Exception('Permission denied');
        }
        return $page;
    }

    public function action_delete_page($page_id = null) {
        try {
            $page = static::_get_page_with_permission($page_id, 'delete');
            return \View::forge('nos::admin/page/page_delete', array(
                'page' => $page,
            ));
        } catch (\Exception $e) {
            // Easy debug
            if (\Fuel::$env == \Fuel::DEVELOPMENT && !\Input::is_ajax()) {
                throw $e;
            }
            $body = array(
                'error' => $e->getMessage(),
            );
            \Response::json($body);
        }
    }

    public function action_delete_page_confirm() {
        try {
            $page_id = \Input::post('id');
            // Allow GET for easier dev
            if (empty($page_id) && \Fuel::$env == \Fuel::DEVELOPMENT) {
                $page_id = \Input::get('id');
            }

            $page = static::_get_page_with_permission($page_id, 'delete');

            // Recover infos before delete, if not id is null
            $dispatchEvent = array(
                'name' => get_class($page),
                'action' => 'delete',
                'id' => array(),
                'lang_common_id' => array($page->page_lang_common_id),
                'lang' => array(),
            );

            // Delete all languages by default
            $lang = \Input::post('lang', 'all');

            // Delete children for all languages
            if ($lang == 'all') {
                foreach ($page->find_lang('all') as $page_lang)
                {
                    $dispatchEvent['id'][] = $page_lang->page_id;
                    $dispatchEvent['lang'][] = $page_lang->page_lang;
                    foreach ($page_lang->get_ids_children(false) as $page_id)
                    {
                        $dispatchEvent['id'][] = $page_id;
                    }
                }

                // Children will be deleted recursively (with the 'after_delete' event from the Tree behaviour)
                // Optimised operation for deleting all languages
                $page->delete_all_lang();

            } else {
                // Search for the appropriate page
                if ($lang != 'all' && $page->get_lang() != $lang) {
                    $page = $page->find_lang($lang);
                }

                if (empty($page)) {
                    throw new \Exception(strtr(__('The page has not been found in the requested language {language}'), array(
                        '{language}' => $lang,
                    )));
                }

                $dispatchEvent['id'][] = $page->page_id;
                $dispatchEvent['lang'][] = $page->page_lang;
                foreach ($page->get_ids_children(false) as $page_id) {
                    $dispatchEvent['id'][] = $page_id;
                }

                // Reassigns common_id if this item is the main language (with the 'after_delete' event from the Translatable behaviour)
                // Children will be deleted recursively (with the 'after_delete' event from the Tree behaviour)
                $page->delete();
            }

            $body = array(
                'notify' => 'Page successfully deleted.',
                'dispatchEvent' => $dispatchEvent,
            );

        } catch (\Exception $e) {
            // Easy debug
            if (\Fuel::$env == \Fuel::DEVELOPMENT && !\Input::is_ajax()) {
                throw $e;
            }
            $body = array(
                'error' => $e->getMessage(),
            );
        }

        \Response::json($body);
    }
}