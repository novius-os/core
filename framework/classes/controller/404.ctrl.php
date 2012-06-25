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

class Controller_404 extends \Controller {

    public function action_front() {
        return \View::forge('errors/404_front');
    }

    public function action_admin() {
	    $view = \View::forge('nos::admin/html');
	    $view->set('title', 'Novius OS');
	    $view->set('base', Uri::base(false) ?: 'http'.(Input::server('HTTPS') ? 's' : '').'://'.Input::server('HTTP_HOST'), false);
	    $view->set('require', 'static/novius-os/admin/vendor/requirejs/require.js', false);
	    $view->set('css', \View::forge('errors/404_admin', array('css' => true), false), false);
	    $view->set('js', \View::forge('errors/404_admin', array('js' => true), false), false);
	    $view->set('body', \View::forge('errors/404_admin', array('body' => true), false), false);
	    return $view;
    }
}