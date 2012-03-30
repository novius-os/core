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

class Widget_Page_Selector extends \Fieldset_Field {

	protected $options = array();

    public function __construct($name, $label = '', array $attributes = array(), array $rules = array(), \Fuel\Core\Fieldset $fieldset = null) {

		//$attributes['type']   = 'hidden';
		$attributes['class'] = (isset($attributes['class']) ? $attributes['class'] : '').' nos-page';

		if (empty($attributes['id'])) {
			$attributes['id'] = uniqid('page_');
		}
		if (!empty($attributes['widget_options'])) {
			$this->set_options($attributes['widget_options']);
		}
		unset($attributes['widget_options']);

        parent::__construct($name, $label, $attributes, $rules, $fieldset);
    }

    public function set_options(array $options) {
        $this->options = \Arr::merge($this->options, $options);
    }

    /**
     * How to display the field
     * @return type
     */
    public function build() {
		$page_id = $this->get_value();
        return $this->template((string) \Request::forge('nos/admin/page/inspector/page/list')->execute(array('inspector/modeltree_radio', array(
	        'params' => array(
		        'treeUrl' => 'admin/nos/page/inspector/page/json',
		        'widget_id' => 'nos_page',
	            'input_name' => $this->get_name(),
	            'selected' => array(
		            'id' => $page_id,
		            'model' => 'Nos\\Model_Page_Page',
	            ),
		        'columns' => array(
			        array(
				        'dataKey' => 'title',
			        )
		        ),
                'treeOptions' => array(
                    'lang' => \Arr::get($this->options, 'lang', null)
                ),
		        'height' => \Arr::get($this->options, 'height', '150px'),
		        'width' => \Arr::get($this->options, 'width', null),
		    ),
        )))->response());
    }
}
