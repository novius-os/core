<?php

namespace Nos;

class Controller_Admin_Wysiwyg extends \Controller {

	public function action_image($edit = false) {
		$view = \View::forge('nos::admin/media/wysiwyg_image');
		$view->set('edit', $edit, false);
		return $view;
	}

    public function action_link($edit = false) {
        $view = \View::forge('nos::admin/page/wysiwyg_link');
        $view->set('edit', $edit, false);
        return $view;
    }

    public function action_enhancers() {

		$urlEnhancers = \Input::get('urlEnhancers', false);

        \Config::load(APPPATH.'data'.DS.'config'.DS.'enhancers.php', 'enhancers');
        $functions = \Config::get('enhancers', array());

		if (!$urlEnhancers) {
			$functions = array_filter($functions, function($params) {
				return !empty($params['urlEnhancer']);
			});
		}

		\Response::json($functions);
	}
}