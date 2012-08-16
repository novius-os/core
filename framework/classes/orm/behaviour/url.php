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

class Orm_Behaviour_Url extends Orm_Behaviour
{
	/**
	 * publication_bool_property
	 * publication_start_property
	 * publication_end_property
	 */
	protected $_properties = array();

	public function first_url($item) {
		return static::_possible_url($item, true);
	}

	static protected function _possible_url($item, $first = false) {
		\Config::load(APPPATH.'data'.DS.'config'.DS.'models_url_enhanced.php', 'models_url_enhanced');
		\Config::load(APPPATH.'data'.DS.'config'.DS.'enhancers.php', 'enhancers');
		\Config::load(APPPATH.'data'.DS.'config'.DS.'page_enhanced.php', 'page_enhanced');
		$models_url_enhanced = \Config::get('models_url_enhanced', array());
		$enhancers = \Config::get('enhancers', array());
		$page_enhanced = \Config::get('page_enhanced', array());
		$class = get_class($item);
		$urls = array();
		if (isset($models_url_enhanced[$class])) {
			foreach ($models_url_enhanced[$class] as $enhancer) {
				if (isset($enhancers[$enhancer]) && isset($enhancers[$enhancer]['get_url_model']) && isset($page_enhanced[$enhancer])) {
					$function = $enhancers[$enhancer]['get_url_model'];
					foreach ($page_enhanced[$enhancer] as $page_id => $params) {
						if ($page = Model_Page::find($page_id)) {
							if ($url = call_user_func($function, $item, array('urlPath' => mb_substr($page->get_href(), 0, -5).'/', 'enhancer_config' => $params))) {
								if ($url && $first) {
									return $url;
								}
								$urls[] = array(
									'url' => $url,
									'page_id' => $page_id,
								);
							}
						}
					}
				}
			}
		}
		return $first ? null : $urls;
	}
}