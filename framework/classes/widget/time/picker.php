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

class Widget_Time_Picker extends \Fieldset_Field {

	protected $options = array(
        'timeFormat' => 'hh:mm',
        'separator' => ' ',
    );

    public function __construct($name, $label = '', array $attributes = array(), array $rules = array(), \Fuel\Core\Fieldset $fieldset) {

        $attributes['type']  = 'text';
		$attributes['class'] = (isset($attributes['class']) ? $attributes['class'] : '').' timepicker';

		if (empty($attributes['id'])) {
			$attributes['id'] = uniqid('date_');
		}
		if (!empty($attributes['widget_options'])) {
			$this->options = \Arr::merge($this->options, $attributes['widget_options']);
		}
		unset($attributes['widget_options']);

        if (empty($attributes['size'])) {
            $attributes['size'] = 5;
        }

        parent::__construct($name, $label, $attributes, $rules, $fieldset);
    }

    /**
     * How to display the field
     * @return string
     */
    public function build() {
        parent::build();

	    $this->fieldset()->append($this->js_init());

		$this->set_attribute('data-timepicker-options', htmlspecialchars(\Format::forge()->to_json($this->options)));
        return (string) parent::build();
    }

	public function js_init() {
		$id = $this->get_attribute('id');
		return <<<JS
<script type="text/javascript">
	require([
		'jquery-nos',
        'static/novius-os/admin/vendor/jquery/ui-datetimepicker/jquery-ui-timepicker-addon',
        'link!static/novius-os/admin/vendor/jquery/ui-datetimepicker/jquery-ui-timepicker-addon.css',
	], function( \$nos, undefined ) {
		\$nos(function() {
			var \$input = \$nos('input#$id');
			\$input.timepicker(\$input.data('timepicker-options'));
		});
	});
</script>
JS;
	}

}

