<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Page;

class Controller_Admin_Page extends \Nos\Controller_Admin_Crud
{
    protected $page_parent = false;

    public function before()
    {
        parent::before();
        \Nos\I18n::current_dictionary('noviusos_page::common', 'nos::common');
    }

    protected function init_item()
    {
        parent::init_item();

        // The first page we create is a homepage
        $context_has_home = (int) (bool) Model_Page::count(array(
            'where' => array(
                array('page_entrance', '=', 1),
                array('page_context', $this->item->page_context),
            ),
        ));
        // $context_has_home is either 0 or 1 with the double cast
        $this->item->page_home     = 1 - $context_has_home;
        $this->item->page_entrance = 1 - $context_has_home;
    }

    public function before_save($page, $data)
    {
        parent::before_save($page, $data);

        foreach (\Input::post('wysiwyg', array()) as $key => $text) {
            $page->wysiwygs->$key = $text;
        }
    }

    protected function fieldset($fieldset)
    {
        $fieldset = parent::fieldset($fieldset);

        $fieldset->field('page_parent_id')->set_renderer_options(array(
            'context' => $this->item->page_context,
        ));

        $checkbox_menu = '<label><input type="checkbox" data-id="same_menu_title">'.__('Use title').'</label>';

        $cache_duration = $fieldset->field('page_cache_duration');
        $cache_duration->set_template(str_replace('{duration}', '{field} {required}', $cache_duration->label));
        $fieldset->field('page_lock')->set_template('{label} {field} {required}');

        $fieldset->field('page_menu_title')->set_template("\t\t<span class=\"{error_class}\">{label}{required}</span>\n\t\t<br />\n\t\t<span class=\"{error_class}\">{field} <br />$checkbox_menu {error_msg}</span>\n");

        $form_attributes = $fieldset->get_config('form_attributes');

        if (!isset($form_attributes['class'])) {
            $form_attributes['class'] = '';
        }
        $form_attributes['class'] .= ' fill-parent';
        $fieldset->set_config('form_attributes', $form_attributes);

        return $fieldset;
    }

    protected function check_permission($action)
    {
        parent::check_permission($action);
        if ($action === 'delete' && !static::check_permission_action('delete', 'controller/admin/page/appdesk/list', $this->item)) {
            throw new \Exception('Permission denied');
        }
    }

    public function action_set_homepage()
    {
        try {
            $id = \Input::post('id', 0);
            if (empty($id) && \Fuel::$env === \Fuel::DEVELOPMENT) {
                $id = \Input::get('id');
            }
            $this->item = $this->crud_item($id);
            $this->check_permission('homepage');

            $contexts = $this->item->get_all_context();
            $pages_context = $this->item->find_context('all');
            $pages_old = Model_Page::find('all', array(
                'where' => array(
                    array('page_entrance', '=', 1),
                    array('page_context', 'IN', $contexts),
                    array('page_id', 'NOT IN', array_keys($pages_context)),
                ),
            ));

            foreach ($pages_context as $page_context) {
                $page_context->page_home = 1;
                $page_context->page_entrance = 1;
                $page_context->save();
            }

            foreach ($pages_old as $page_old) {
                $page_old->page_home = 0;
                $page_old->page_entrance = 0;
                $page_old->save();
            }

            $dispatchEvent = array(
                'name' => get_class($this->item),
                'action' => 'update',
                'id' => array_merge(array_keys($pages_context), array_keys($pages_old)),
                'context_common_id' => array($this->item->page_context_common_id),
                'context' => array_values($contexts),
            );

            $body = array(
                'notify' => __('Homepage successfully changed.'),
                'dispatchEvent' => $dispatchEvent,
            );

        } catch (\Exception $e) {
            $this->send_error($e);
        }

        \Response::json($body);
    }

    public function action_clone($id = null)
    {
        $page = $this->crud_item($id);
        $contexts_list = $page->find_context('all');
        $context = \Input::post('context', null);
        if (count($contexts_list) > 1 && empty($context)) {
            \Response::json(array(
                'action' => array(
                    'action' => 'nosDialog',
                    'dialog' => array(
                        'ajax' => true,
                        'contentUrl' => 'admin/noviusos_page/page/'.($recursive ? 'popup_clone_tree' : 'popup_clone').'/'.$id,
                        'title' => strtr(__('Duplicate the page "{{title}}"'), array(
                            '{{title}}' => $page->title_item(),
                        )),
                        'width' => 500,
                        'height' => 200,
                    ),
                ),
            ));
        }

        try {
            static::clone_page($page, \Input::post('context', $page->get_context()), $recursive);
            \Response::json(array(
                'dispatchEvent' => array(
                    'name' => 'Nos\Page\Model_Page',
                    'action' => 'insert',
                    'context' => $page->get_context(),
                ),
                'notify' => $recursive ? __('The page and its children have been cloned successfully.') : __('The page has been cloned successfully.'),
            ));
        } catch (\Exception $e) {
            $this->send_error($e);
        }
    }

    public function action_clone_tree($id = null)
    {
        return $this->action_clone($id, true);
    }

    public function action_popup_clone($id = null, $recursive = false)
    {
        $page = $this->crud_item($id);
        $contexts_list = $page->find_context('all');
        return \View::forge('noviusos_page::admin/popup_clone', array(
            'item' => $page,
            'action' => 'admin/noviusos_page/page/'.($recursive ? 'clone_tree' : 'tree').'/'.$id,
            'crud' => $this->config,
            'contexts_list' => $contexts_list,
        ), false);
    }

    public function action_popup_clone_tree($id = null)
    {
        return $this->action_popup_clone($id, true);
    }

    protected static function clone_page($page, $context, $recursive, $parent = null, $common_id = null)
    {
        $all = $page->find_context($context);
        if ($context != 'all') {
            $all = array($all);
        }
        // Find the main context (or the only context we want to duplicate)
        foreach ($all as $item) {
            if (($context == 'all' && $item->is_main_context()) || $context == $item->get_context()) {
                $main = $item;
                break;
            }
        }

        $parents = array();

        // Clone the main context (or the only context we want to duplicate)
        $clone = clone $main;
        $clone->page_entrance = 0;
        $clone->page_home = 0;
        $clone->page_published = 0;
        $clone->page_context_common_id = $common_id;
        // Change the title for the root item only (children path will inherit from their parent)
        if (!empty($parent)) {
            $clone->set_parent($parent);
        }

        // Duplicate up to 5 times
        $try = 1;
        do {
            try {
                $failed = false;
                if (empty($parent)) {
                    $title_append = strtr(__(' (copy {{count}})'), array(
                        '{{count}}' => $try,
                    ));
                    $clone->page_title = $main->page_title.$title_append;
                    $clone->page_virtual_name = null;
                    $clone->page_virtual_url = null;
                }
                $clone->save();
                break;
            } catch (\Nos\BehaviourDuplicateException $e) {
                $failed = true;
                if (!empty($parent)) {
                    break;
                }
                $try++;
                if ($try > 5) {
                    throw new \Exception(__('You already duplicated this page 5 times. Please edit them before duplicating more.'));
                }
            }
        } while ($try <= 5);

        if ($failed) {
            throw new \Exception(__('An unidentified error occurred during duplication.').' - '.$try.', '.$parent->id);
        }

        $parents[$clone->get_context()] = $clone;

        // We need this from the main context to clone the other ones
        $common_id = $clone->page_context_common_id;

        // Clone other contexts
        foreach ($all as $item) {
            // Main context is already cloned
            if ($item->id == $main->id) {
                continue;
            }
            $clone = clone $item;
            $clone->page_entrance = 0;
            $clone->page_home = 0;
            $clone->page_published = 0;
            $clone->page_context_common_id = $common_id;
            $clone->page_virtual_name = null;
            $clone->page_virtual_url = null;
            if (empty($parent)) {
                $clone->page_title = $clone->page_title.$title_append;
            } else {
                $clone->set_parent($parent);
            }
            try {
                $clone->save();
            } catch (\Nos\BehaviourDuplicateException $e) {
                throw new \Exception('Unexpected error');
            }
            $parents[$clone->get_context()] = $clone;
        }

        // Clone children if appropriate
        if ($recursive) {
            static $child_common_ids = array();
            // $all already contains only the contexts we want to duplicate
            // Clone each context separately
            foreach ($all as $parent) {
                foreach ($parent->find_children() as $child) {
                    $child_common_id = $child->page_context_common_id;
                    $clone_common_id = \Arr::get($child_common_ids, $child_common_id, null);
                    $child_common_ids[$child_common_id] = static::clone_page($child, $child->get_context(), $recursive, $parents[$child->get_context()], $clone_common_id);
                }
            }
        }

        return $common_id;
    }
}
