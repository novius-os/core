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

use Event;

class Controller_Front_Application extends Controller
{
    public $main_controller;

    public $cache;

    public $default_config = array();

    public function before()
    {
        $this->main_controller = Nos::main_controller();

        // Permanently redirects URLs ending with a slash or with a slash followed by .html
        if (\Config::get('novius-os.redirect_urlenhancer_trailing_slash', false)) {
            if (preg_match('`/(\.html)?$`', $this->main_controller->getRelativeUrl(), $match)) {
                $urlWithHtmlExtension = \Str::sub($this->main_controller->getRelativeUrl(), 0, -\Str::length($match[0])).'.html';
                \Response::redirect($urlWithHtmlExtension, 'location', 301);
            }
        }

        return parent::before();
    }

    public function trigger($event, $data = '', $return_type = 'string')
    {
        Event::trigger(get_called_class().'.'.$event, $this, 'array');
    }

    public function save_cache()
    {
        return $this->cache;
    }

    public function rebuild_cache($cache)
    {
        $this->cache = $cache;
    }

    protected function merge_config($mixed)
    {
        if (is_array($mixed)) {
            $this->config = \Arr::merge($this->config, $mixed);

            return;
        }
        if (!empty($this->default_config[$mixed]) && is_array($this->default_config[$mixed])) {
            return $this->merge_config($this->default_config[$mixed]);
        }
    }

    protected static function _compute_views($views = array())
    {
        $views = array();
        foreach ($views as $view => $fields) {
            foreach ($fields as $field) {
                $views[$field] = $view;
            }
        }

        return $views;
    }

    public static function getUrlEnhanced($params = array())
    {
        $class = get_called_class();
        if (method_exists($class, 'get_url_model')) {
            static $classes = array();
            if (!in_array($class, $classes)) {
                \Log::deprecated('::get_url_model($item, $params) is deprecated. Please use ::getURLEnhanced($params) and $item in a key "item" of $params.');

                $classes[] = $class;
            }

            $item = \Arr::get($params, 'item', null);
            return static::get_url_model($item, $params);
        }

        throw new \RuntimeException('This application front controller "'.$class.'" not implements a getUrlEnhanced() method.');
    }
}
