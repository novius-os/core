<?php

namespace Nos;

class Controller_Admin_Wysiwyg extends \Controller {

	public function action_image($edit = false) {
		$view = \View::forge('nos::tinymce/image');
		$view->set('edit', $edit, false);
		return $view;
	}

	public function action_enhancers() {

        \Config::load(APPPATH.'data'.DS.'config'.DS.'enhancers.php', 'enhancers');
        $functions = \Config::get('enhancers', array());

		\Response::json($functions);
	}
}