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

use Nos\Config_Data;
use Nos\Template\Variation\Model_Template_Variation;

class Controller_Admin_Page extends \Nos\Controller_Admin_Crud
{
    protected $page_parent = false;

    public function before()
    {
        parent::before();
        \Nos\I18n::current_dictionary('noviusos_page::common', 'nos::common');
    }

    /**
     * Saves the wysiwyg.
     * They're not part of the fields and handled automatically, because we don't know how much there are.
     *
     * @param $page
     * @param $data
     */
    public function before_save($page, $data)
    {
        if (!is_numeric($this->item->page_template_variation_id)) {
            $templates = Config_Data::get('templates', array());
            $template = \Arr::get($templates, $this->item->page_template_variation_id, array());
            $template_variation = Model_Template_Variation::forge();
            $template_variation->tpvar_template = $this->item->page_template_variation_id;
            $template_variation->tpvar_title = \Arr::get($template, 'title', $this->item->page_template_variation_id);
            $template_variation->tpvar_context = $this->item->page_context;
            $template_variation->save();

            $this->item->page_template_variation_id = $template_variation->tpvar_id;
        }

        if ($this->item->page_entrance && !$this->item->published()) {
            $this->send_error(new \Exception(__(
                'This page is the home page and must therefore be published. '.
                'To unpublish this page, set another page as home page first.'
            )));
        }

        parent::before_save($page, $data);

        //Set up the first page created in a context as the homepage.
        if ($this->is_new) {
            // The first page we create is a homepage
            $context_has_home = (int) (bool) Model_Page::count(array(
                'where' => array(
                    array('page_entrance', '=', 1),
                    array('page_context', $this->item->page_context),
                ),
            ));
            // $context_has_home is either 0 or 1 with the double cast
            $page->page_home     = 1 - $context_has_home;
            $page->page_entrance = 1 - $context_has_home;
        }

        foreach (\Input::post('wysiwyg', array()) as $key => $text) {
            $page->wysiwygs->$key = $text;
        }
    }

    protected function init_item()
    {
        parent::init_item();

        if (!empty($this->item->parent)) {
            $this->item->page_template_variation_id = $this->item->parent->template_variation->tpvar_id;
        }
        if (empty($this->item->template_variation)) {
            $template_variation = Model_Template_Variation::getTemplateVariationDefault($this->item->page_context);
            if (!empty($template_variation)) {
                $this->item->page_template_variation_id = $template_variation->tpvar_id;
            }
        }
    }

    protected function fieldset($fieldset)
    {
        $fieldset = parent::fieldset($fieldset);

        $fieldset->field('page_parent_id')->setRendererOptions(array(
            'context' => $this->item->page_context,
        ));

        $checkbox_menu = '<label><input type="checkbox" data-id="same_menu_title">'.__('Use title').'</label>';

        $cache_duration = $fieldset->field('page_cache_duration');
        $cache_duration->set_template(str_replace('{{duration}}', '{field} {required}', $cache_duration->label));
        $fieldset->field('page_lock')->set_template('{label} {field} {required}');

        $fieldset->field('page_menu_title')->set_template(
            "\t\t<span class=\"{error_class}\">{label}{required}</span>\n\t\t<br />".
            "\n\t\t<span class=\"{error_class}\">{field} <br />$checkbox_menu {error_msg}</span>\n"
        );

        $form_attributes = $fieldset->get_config('form_attributes');

        if (!isset($form_attributes['class'])) {
            $form_attributes['class'] = '';
        }
        $form_attributes['class'] .= ' fill-parent';
        $fieldset->set_config('form_attributes', $form_attributes);

        $templates_variations = Model_Template_Variation::find('all', array(
            'where' => array(
                array('tpvar_context' => $this->item->page_context),
            ),
            'order_by' => array(
                'tpvar_default' => 'DESC',
                'tpvar_title',
            ),
        ));
        $options = array();
        if (!empty($templates_variations)) {
            foreach ($templates_variations as $template_variation) {
                $options[$template_variation->tpvar_id] = $template_variation->tpvar_title;
            }
        } else {
            $templates = Config_Data::get('templates', array());
            foreach ($templates as $template_name => $template) {
                $options[$template_name] = $template['title'];
            }
        }
        $fieldset->field('page_template_variation_id')->set_options($options);


        return $fieldset;
    }

    public function action_set_homepage()
    {
        try {
            $id = \Input::post('id', 0);
            if (empty($id) && \Fuel::$env === \Fuel::DEVELOPMENT) {
                $id = \Input::get('id');
            }
            $this->item = $this->crud_item($id);
            $this->checkPermission('set_homepage');

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
                'notify' => strtr(__('No sooner said than done. The home page is now ‘{{title}}’.'), array(
                    '{{title}}' => $this->item->title_item(),
                )),
                'dispatchEvent' => $dispatchEvent,
            );

        } catch (\Exception $e) {
            $this->send_error($e);
        }

        \Response::json($body);
    }

    public function action_duplicate($id = null)
    {
        return $this->_duplicate($id, \Input::post('include_children', false));
    }

    protected function _duplicate($id = null, $recursive = false)
    {
        $page = $this->crud_item($id);
        $contexts_list = $page->find_context('all');
        $has_children = $page->find_children();
        $has_children = !empty($has_children);
        $contexts = \Input::post(($recursive ? 'contexts_multi' : 'contexts_single'), null);
        if (empty($contexts) && (count($contexts_list) > 1 || $has_children)) {
            \Response::json(array(
                'action' => array(
                    'action' => 'nosDialog',
                    'dialog' => array(
                        'ajax' => true,
                        'contentUrl' => 'admin/noviusos_page/page/popup_duplicate/'.$id,
                        'title' => strtr(__('Duplicating the page ‘{{title}}’'), array(
                            '{{title}}' => $page->title_item(),
                        )),
                        'width' => 500,
                        'height' => 330,
                    ),
                ),
            ));
        }

        try {
            $contexts = empty($contexts) ? $page->get_context() : $contexts;
            static::duplicate_page($page, $contexts, $recursive);
            \Response::json(array(
                'dispatchEvent' => array(
                    'name' => 'Nos\Page\Model_Page',
                    'action' => 'insert',
                    'context' => $contexts,
                ),
                'notify' => $recursive ?
                        __('Here you are! The page and its subpages have just been duplicated.') :
                        __('Here you are! The page has just been duplicated.'),
            ));
        } catch (\Exception $e) {
            $this->send_error($e);
        }
    }

    public function action_popup_duplicate($id = null, $recursive = false)
    {
        $page = $this->crud_item($id);
        $contexts_list = $page->find_context('all');
        return \View::forge('noviusos_page::admin/popup_duplicate', array(
            'item' => $page,
            'action' => 'admin/noviusos_page/page/duplicate/'.$id,
            'crud' => $this->config,
            'contexts_list' => $contexts_list,
        ), false);
    }

    protected static function duplicate_page($page, $context, $recursive, $parent = null, $common_id = null)
    {
        static $child_common_ids = array();

        $all = $page->find_context($context);
        // When cloning 1 context only
        if (!is_array($context)) {
            $all = array($all);
        }

        // Find the main context (or the only context we want to duplicate)
        /**
         * @var $main Model_Page
         */
        $main = null;
        foreach ($all as $item) {
            if ((is_array($context) && $item->is_main_context()) || $context == $item->get_context()) {
                $main = $item;
                break;
            }
        }
        // The main context was not duplicated, find a replacement
        if (empty($main)) {
            foreach (array_keys(\Nos\Tools_Context::contexts()) as $code) {
                if (in_array($code, $context)) {
                    foreach ($all as $item) {
                        if ($code == $item->get_context()) {
                            $main = $item;
                            break 2;
                        }
                    }
                }
            }
        }

        $parents = array();

        // Duplicate the main context (or the only context we want to duplicate)
        $clone = clone $main;
        $clone->page_entrance = 0;
        $clone->page_home = 0;
        $clone->page_published = 0;
        $clone->page_context_common_id = $common_id;
        $clone->page_context_is_main = empty($common_id) ? 1 : 0;
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
                    throw new \Exception(__(
                        'Slow down, slow down. You have duplicated this page 5 times already. '.
                        'Edit them first before creating more duplicates.'
                    ));
                }
            }
        } while ($try <= 5);

        if ($failed) {
            throw new \Exception(
                __(
                    'Something went wrong. Please refresh your browser window. If the page has not been duplicated, '.
                    'please try again. Contact your developer or Novius OS if the problem persists. '.
                    'We apologise for the inconvenience caused.'
                ).' - '.$try.', '.$parent->id
            );
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
            $clone->page_context_is_main = empty($common_id) ? 1 : 0;
            if (empty($parent)) {
                $clone->page_title = $clone->page_title.$title_append;
            } else {
                $clone->set_parent($parent);
            }
            try {
                $clone->save();
            } catch (\Nos\BehaviourDuplicateException $e) {
                throw new \Exception(__(
                    'Something went wrong. Please refresh your browser window and try again. '.
                    'Contact your developer or Novius OS if the problem persists. '.
                    'We apologise for the inconvenience caused.'
                ));
            }
            $parents[$clone->get_context()] = $clone;
        }

        // Clone children if appropriate
        if ($recursive) {
            // $all already contains only the contexts we want to duplicate
            // Clone each context separately
            foreach ($all as $parent) {
                foreach ($parent->find_children() as $child) {
                    $child_common_id = $child->page_context_common_id;
                    $clone_common_id = \Arr::get($child_common_ids, $child_common_id, null);
                    $child_common_ids[$child_common_id] = static::duplicate_page(
                        $child,
                        $child->get_context(),
                        $recursive,
                        $parents[$child->get_context()],
                        $clone_common_id
                    );
                }
            }
        }

        return $common_id;
    }
}
