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
            'params' => array(),
        ),
    );

    public function before()
    {
        list($application) = \Config::configFile(get_called_class());
        if ($application === 'nos') {
            $this->bypass = true;
        }
        parent::before();
        $this->config_build();
    }

    public function prepare_i18n()
    {
        parent::prepare_i18n();
        \Nos\I18n::current_dictionary(array('nos::common'));
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

    public function action_preview(array $args = null)
    {
        return $this->action_save($args);
    }

    public function action_save(array $args = null)
    {
        if (empty($args)) {
            $args = $_POST;
        }
        if (!empty($args['enhancer'])) {
            $enhancers = \Nos\Config_Data::get('enhancers', array());
            if (!empty($enhancers[$args['enhancer']])) {
                $enhancer = $enhancers[$args['enhancer']];
                $icon = \Config::icon($enhancer['application'], 64);
                $this->config['preview']['params'] = array_merge(array(
                        'icon' => !empty($icon) ? $icon : 'static/apps/noviusos_appmanager/img/64/app-manager.png',
                        'title' => \Arr::get($enhancer, 'title', __('I’m an application. Give me a name!')),
                    ), $this->config['preview']['params']);
            }
        }

        $body = array(
            'debug'  => $this->config['preview'],
            'config'  => $args,
            'preview' => \View::forge($this->config['preview']['view'], array(
                'layout' => $this->config['preview']['layout'],
                'params' => $this->config['preview']['params'],
                'enhancer_args' => $args,
            ))->render(),
        );
        \Response::json($body);
    }
}
