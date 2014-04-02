<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Menu;

class Driver_Item_Text extends Driver_Item {

	/**
	 * Builds and returns the item edition form
	 *
	 * @param string $content
	 * @param array $options
	 * @return string
	 */
	public function form($content = null, $options = array()) {
		if (is_array($content)) {
			$options = $content;
			$content = null;
		}
		return parent::form(\View::forge('noviusos_menu::driver/text/form', \Arr::merge($options, array(
			'item'				=> $this->item,
			'content'			=> $content,
			'expander_options'	=> array(
				'allowExpand'		=> false,
				'expanded'			=> true,
			),
		)), false)->render());
	}

	/**
	 * Displays the item
	 *
	 * @return string|bool
	 */
	public function display() {
		$text = null;
		if (!empty($this->item->text)) {
			$text = $this->item->text;
			if (empty($this->item->is_html)) {
				$text = e($text);
			}
		}
		return '<div class="text">'.$text.'</div>';
	}
}
