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

use Fuel\Core\Config;

class Controller_Admin_Page_Ajax extends \Controller
{
	public function before()
	{
        Config::load(APPPATH.'data'.DS.'config'.DS.'templates.php', 'templates');
		parent::before();
	}

	public function action_wysiwyg($page_id = null)
	{
        $id = $_GET['template_id'];
        $data = \Config::get('templates', array());
        $data = $data[$id];

        $data['layout'] = (array) $data['layout'];

		$page = empty($page_id) ? null : Model_Page::find($page_id);
		foreach ($data['layout'] as $wysiwyg => $coords) {
			$data['content'][$wysiwyg] = empty($page) ? '' : Tools_Wysiwyg::prepare_widget($page->wysiwygs->{$wysiwyg});
		}

		// @todo replace images
		// src="nos://media/ID" => src="http://real/url/here" data-media-id="ID"

		\Response::json($data);
	}
}
