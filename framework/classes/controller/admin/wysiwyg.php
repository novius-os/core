<?php

namespace Nos;

class Controller_Admin_Wysiwyg extends \Controller {

	public function action_image($edit = false) {
		$view = \View::forge('nos::tinymce/image');
		$view->set('edit', $edit, false);
		return $view;
	}

	public function action_enhancers() {

        \Config::load(APPPATH.'data'.DS.'config'.DS.'wysiwyg_enhancers.php', 'wysiwyg_enhancers');
        $functions = \Config::get('wysiwyg_enhancers', array());

		\Response::json($functions);
	}
}