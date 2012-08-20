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

class Widget_Virtualname extends \Fieldset_Field {
    var $template = '{label}{required} <div class="table-field">{field} <span>&nbsp;.html</span></div> {use_title_checkbox}';

    public function build() {
        parent::build();

        $this->apply_use_title_checkbox();

        $this->fieldset()->append($this->js_init());

        if (empty($this->value)) {
            $this->set_attribute('data-usetitle', 1);
        }
        return (string) parent::build();
    }

    public function apply_use_title_checkbox() {
        $use_title_checkbox = \View::forge('widget/virtualname/use_title_checkbox', array(
            'id' => $this->get_attribute('id'),
        ), false);
        $this->template = str_replace('{use_title_checkbox}', $use_title_checkbox, $this->template);

    }

    public function js_init() {
        return \View::forge('widget/virtualname/js', array(
            'id' => $this->get_attribute('id'),
        ), false);
    }

}
