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

class Driver_Item_Wysiwyg extends Driver_Item {

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
		return parent::form(\View::forge('noviusos_menu::driver/wysiwyg/form', \Arr::merge($options, array(
			'item'				=> $this->item,
			'content'			=> $content,
			'expander_options'	=> array(
				'allowExpand'		=> true,
				'expanded'			=> true,
			),
			'renderer'			=> array(
				'style' 			=> 'width: 100%; height: 280px;',
				'name'				=> 'wysiwygs.content',
				'value'				=> \Nos\Tools_Wysiwyg::prepare_renderer($this->item->wysiwygs->content),
				'renderer_options' 	=> \Nos\Tools_Wysiwyg::jsOptions(array(
					'mode' 				=> 'exact',
				), $this->item, false),
			),
		)), false)->render());
	}

	/**
	 * Displays the item
	 *
	 * @return string|bool
	 */
	public function display() {
		if (empty($this->item)) {
			return false;
		}
		return '<div class="wysiwyg">'.\Nos\Nos::parse_wysiwyg($this->item->wysiwygs->content).'</div>';
	}
}
