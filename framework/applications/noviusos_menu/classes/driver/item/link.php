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

class Driver_Item_Link extends Driver_Item {

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
		return parent::form(\View::forge('noviusos_menu::driver/link/form', \Arr::merge($options, array(
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
		if (empty($this->item->url)) {
			return false;
		}
        // Blank target
        $attributes = array();
        if (!empty($this->item->url_blank)) {
            $attributes['target'] = '_blank';
        }
        // Build anchor with link
        return \Html::anchor($this->item->url, $this->title(), $attributes);
	}
}
