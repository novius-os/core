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
        $enhancers = \Config::get('enhancers', array());

		if (!$urlEnhancers) {
			$enhancers = array_filter($enhancers, function($enhancer) {
				return empty($enhancer['urlEnhancer']);
			});
		}

		\Response::json($enhancers);
	}
}