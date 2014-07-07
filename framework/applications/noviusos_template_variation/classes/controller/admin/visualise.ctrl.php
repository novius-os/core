<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Template\Variation;

use Nos\Access_Exception;
use Nos\Controller_Front;
use Nos\Page\Model_Page;
use Nos\Tools_Url;
use Nos\User\Permission;

class Controller_Admin_Visualise extends Controller_Front
{
    protected $tpvar_id_visualise;

    public function before()
    {
        parent::before();

        list($application) = \Config::configFile(get_called_class());
        if (!Permission::isApplicationAuthorised($application)) {
            echo \View::forge('nos::errors/blank_slate_front', array(
                'base_url' => \Uri::base(),
                'error' => strtr(
                    __('You don’t have access to application {{application}}!'),
                    array('{{application}}' => $application)
                ),
            ), false);
            exit();
        }
    }

    public function router($action, $params, $status = 200)
    {
        $this->tpvar_id_visualise = \Input::get('tpvar_id');

        $_GET['_preview'] = true;
        return parent::router($action, $params, $status);
    }

    protected function _generateCache()
    {
        $this->_findTemplate();

        $wysiwyg = array();

        // Scan all wysiwyg
        foreach ($this->_template['layout'] as $wysiwyg_name => $layout) {
            $wysiwyg[$wysiwyg_name] = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
        }

        $this->_view->set('wysiwyg', $wysiwyg, false);
        $this->_view->set('title', $this->h1, false);
        $this->_view->set('page', $this->_page, false);
        $this->_view->set('main_controller', $this, false);
    }

    protected function _findPage()
    {
        $tpvar = Model_Template_Variation::find($this->tpvar_id_visualise);
        if (empty($tpvar)) {
            echo \View::forge('nos::errors/blank_slate_front', array(
                'base_url' => $this->_base_href,
                'error' => __('This template variation does’nt exist !'),
            ), false);
            exit();
        }

        $page = Model_Page::forge();
        $page->template_variation = $tpvar;
        $page->page_context = $tpvar->tpvar_context;
        $this->_contexts_possibles[$tpvar->tpvar_context] = Tools_Url::context($tpvar->tpvar_context);
        $page->page_id = 0;
        $page->page_title = __('Lorem Ipsum');
        $page->page_entrance = 1;

        $this->setPage($page);
    }
}
