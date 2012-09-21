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

class Controller_Admin_Page_Page extends Controller_Admin_Crud
{
    protected $page_parent = false;

    protected function form_item()
    {
        parent::form_item();
        if ($this->item->is_new()) {
            // The first page we create is a homepage
            $lang_has_home = (int) (bool) Model_Page::count(array(
                'where' => array(
                    array('page_home', '=', 1),
                    array('page_lang', $this->item->page_lang),
                ),
            ));
            // $lang_has_home is either 0 or 1 with the double cast
            $this->item->page_home     = 1 - $lang_has_home;
            $this->item->page_entrance = 1 - $lang_has_home;
        }
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

        $fieldset->field('page_parent_id')->set_widget_options(array(
            'lang' => $this->item->page_lang,
        ));

        $checkbox_menu = '<label><input type="checkbox" data-id="same_menu_title">'.$this->i18n('Use title').'</label>';

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

            $langs = $this->item->get_all_lang();
            $pages_lang = $this->item->find_lang('all');
            $pages_old = Model_Page::find('all', array(
                'where' => array(
                    array('page_home', '=', 1),
                    array('page_lang', 'IN', $langs),
                    array('page_id', 'NOT IN', array_keys($pages_lang)),
                ),
            ));

            foreach ($pages_lang as $page_lang) {
                $page_lang->page_home = 1;
                $page_lang->page_entrance = 1;
                $page_lang->save();
            }

            foreach ($pages_old as $page_old) {
                $page_old->page_home = 0;
                $page_old->page_entrance = 0;
                $page_old->save();
            }

            $dispatchEvent = array(
                'name' => get_class($this->item),
                'action' => 'update',
                'id' => array_merge(array_keys($pages_lang), array_keys($pages_old)),
                'lang_common_id' => array($this->item->page_lang_common_id),
                'lang' => array_values($langs),
            );

            $body = array(
                'notify' => $this->i18n('Homepage successfully changed.'),
                'dispatchEvent' => $dispatchEvent,
            );

        } catch (\Exception $e) {
            $this->send_error($e);
        }

        \Response::json($body);
    }
}
