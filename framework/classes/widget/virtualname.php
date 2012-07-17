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

    public function build() {
        parent::build();
        $this->fieldset()->append($this->js_init());

        if (empty($this->value)) {
            $this->set_attribute('data-usetitle', 1);
        }
        return (string) parent::build();
    }

    public function js_init() {
        return \View::forge('widget/virtualname', array(
            'id' => $this->get_attribute('id'),
        ), false);
    }

}
