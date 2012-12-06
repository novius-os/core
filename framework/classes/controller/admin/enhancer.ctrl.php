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

class Controller_Admin_Enhancer extends \Nos\Controller_Admin_Application
{
    protected $config = array(
        'controller_url' => '',
        'popup' => array(
            'view' => 'nos::admin/enhancer/popup',
            'layout' => array(),
            'params' => array(),
        ),
        'preview' => array(
            'view' => 'nos::admin/enhancer/preview',
            'layout' => array(),
            'params' => array(
                'icon' => 'static/apps/noviusos_appmanager/img/64/app-manager.png',
                'title' => 'Application',
            ),
        ),
    );

    public function before()
    {
        parent::before();
        $this->config_build();
    }

    /**
     * Set properties from the config
     */
    protected function config_build()
    {
        if (is_array($this->config['popup']['layout']) && !empty($this->config['popup']['layout']['view'])) {
            $this->config['popup']['layout'] = array($this->config['popup']['layout']);
        }
        if (is_array($this->config['preview']['layout']) && !empty($this->config['preview']['layout']['view'])) {
            $this->config['preview']['layout'] = array($this->config['preview']['layout']);
        }
        if (empty($this->config['controller_url'])) {
            $this->config['controller_url'] = static::get_path();
        }
    }

    public function action_popup()
    {
        return \View::forge($this->config['popup']['view'], array(
                'url' => $this->config['controller_url'].'/save',
                'layout' => $this->config['popup']['layout'],
                'params' => $this->config['popup']['params'],
                'enhancer_args' => \Input::get(),
            ), false);
    }

    public function action_preview()
    {
        return $this->action_save();
    }

    public function action_save()
    {
        $body = array(
            'config'  => \Format::forge()->to_json($_POST),
            'preview' => \View::forge($this->config['preview']['view'], array(
                'layout' => $this->config['preview']['layout'],
                'params' => $this->config['preview']['params'],
                'enhancer_args' => $_POST,
            ))->render(),
        );
        \Response::json($body);
    }
}
