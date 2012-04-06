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

class Controller extends Controller_Extendable {

    public $url;
	public $enhancerUrl;
	public $enhancerUrlPath;

	public $enhancerUrl_segments;

    public $cache;
    public $cache_cleanup;

    public $nesting_level;

    public $default_config = array();

    public function trigger($event, $data = '', $return_type = 'string') {
        Event::trigger(get_called_class().'.'.$event, $this, 'array');
    }

    public function save_cache() {
        return $this->cache;
    }

    public function rebuild_cache($cache) {
        $this->cache = $cache;
    }

    protected function merge_config($mixed) {
        if (is_array($mixed)) {
            $this->config = \Arr::merge($this->config, $mixed);
            return;
        }
        if (!empty($this->default_config[$mixed]) && is_array($this->default_config[$mixed])) {
            return $this->merge_config($this->default_config[$mixed]);
        }
    }

    protected static function _compute_views($views = array()) {
        $views = array();
        foreach ($views as $view => $fields) {
            foreach ($fields as $field) {
                $views[$field] = $view;
            }
        }
        return $views;
    }
}