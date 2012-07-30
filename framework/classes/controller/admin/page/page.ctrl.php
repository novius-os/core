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

    protected $page_parent = false;

    protected function form_item()
    {
        parent::form_item();
        if ($this->item->is_new())
        {
            // New page: no parent
            // Translation: we have a common_id and can determine the parent
            if (!empty($this->item->page_lang_common_id)) {
                $page_lang_common = Model_Page::find($this->item->page_lang_common_id);
                $page_parent = $page_lang_common->find_parent();

                // Fetch in the appropriate lang
                if (!empty($page_parent)) {
                    $page_parent = $page_parent->find_lang($this->item->page_lang);
                }

                // Set manually, because set_parent doesn't handle new items
                if (!empty($page_parent)) {
                    $this->item->page_parent_id = $page_parent->page_id;
                }
            }

            $this->page_parent = Model_Page::find($this->item->page_parent_id);

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

    protected function before_save($page, $data) {
        // This doesn't work for now, because Fuel prevent relation from being fetch on new objects
        // https://github.com/fuel/orm/issues/171
        //$parent = $page->find_parent();

        // Instead, retrieve the object manually
        // Model::find(null) returns an Orm\Query. We don't want that.
        $parent = empty($page->page_parent_id) ? null : Model_Page::find($page->page_parent_id);

        // Event 'after_change_parent' will set the appropriate lang
        $page->set_parent($parent);
        $page->page_level = $parent === null ? 1 : $parent->page_level + 1;

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

        $checkbox_url  = '<label><input type="checkbox" data-id="same_url_title">'.strtr(__('Use {field}'), array('{field}' => __('title'))).'</label>';
        $checkbox_menu = '<label><input type="checkbox" data-id="same_menu_title">'.strtr(__('Use {field}'), array('{field}' => __('title'))).'</label>';

        $fieldset->field('page_cache_duration')->set_template('{label} {field} {required} seconds');
        $fieldset->field('page_lock')->set_template('{label} {field} {required}');
        $fieldset->field('page_virtual_name')->set_template('{label}{required} <br /> <div class="table-field">{field} <span>&nbsp;.html</span></div>'.$checkbox_url);

        $fieldset->field('page_menu_title')->set_template("\t\t<span class=\"{error_class}\">{label}{required}</span>\n\t\t<br />\n\t\t<span class=\"{error_class}\">{field} <br />$checkbox_menu {error_msg}</span>\n");

        $form_attributes = $fieldset->get_config('form_attributes');

        if (!isset($form_attributes['class'])) {
            $form_attributes['class'] = '';
        }
        $form_attributes['class'] .= ' fill-parent';
        $fieldset->set_config('form_attributes', $form_attributes);

        return $fieldset;
    }

    protected function check_permission($action) {
        parent::check_permission($action);
        if ($action === 'delete' && !static::check_permission_action('delete', 'controller/admin/page/appdesk/list', $this->item)) {
            throw new \Exception('Permission denied');
        }
    }
}