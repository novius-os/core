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

class Application {

    public $name;

    public function get_config() {
        \Config::load($this->name.'::config', true);
        $config = \Config::get($this->name.'::config', array());
        return $config;
    }

	public static function forge($app_name) {
		return new static($app_name);
	}

	public function __construct($app_name) {
		$this->name = $app_name;
	}

	public function install() {

		$this->addPermission();
		return $this->_refresh_properties() && ($this->check_install() ||
			($this->symlink('static')
				&& $this->symlink('htdocs')
				&& $this->symlink('data')
				//&& $this->symlink('cache')
			));
	}

	public function uninstall() {
		return $this->_refresh_properties(false)
        && $this->unsymlink('static')
		&& $this->unsymlink('htdocs');
		//&& $this->unsymlink('data')
		//&& $this->unsymlink('cache');
	}

	public function check_install() {
		return is_dir(APPPATH.'applications'.DS.$this->name)
		&& $this->is_link('static')
		&& $this->is_link('htdocs');
		//&& $this->is_link('data')
		//&& $this->is_link('cache');
	}

	protected function symlink($folder) {
		if (!$this->is_link($folder)) {
			$private = APPPATH.'applications'.DS.$this->name.DS.$folder;
			if (is_dir($private)) {
				$public = DOCROOT.$folder.DS.'apps'.DS.$this->name;
                if (is_link($public)) {
                    unlink($public);
                }
				\Debug::dump(array($private, $public));
				return symlink($private, $public);
			}
		}
		return true;
	}

	protected function unsymlink($folder) {
		$public = DOCROOT.$folder.DS.'apps'.DS.$this->name;
		if (file_exists($public)) {
			return unlink($public);
		}
		return true;
	}

	protected function is_link($folder) {
		$private = APPPATH.'applications'.DS.$this->name.DS.$folder;
		if (file_exists($private)) {
			$public = DOCROOT.$folder.DS.'apps'.DS.$this->name;
			return is_link($public) && readlink($public) == $private;
		}
		return true;
	}

    static protected $properties = array('templates', 'launchers', 'enhancers');

    protected function _refresh_properties($add = true) {
        foreach (static::$properties as $property) {
            if (!static::_refresh_property($property, array(($add ? 'add' : 'remove') => $this->name))) {
                return false;
            }
        }
        static::_refresh_dependencies(array(($add ? 'add' : 'remove') => $this->name));
        return true;
    }

    /**
     * @static
     * @param array $params
     * params['add'] : application to add
     * params['remove'] : application to remove
     * @return bool
     */
    protected static function _refresh_property($property, array $params = array()) {
        $add = isset($params['add']) ? $params['add'] : false;
        $remove = isset($params['remove']) ? $params['remove'] : false;
        $app_refresh = $add ? $add : $remove;

        // We get the existing templates installed in the application
        \Config::load(APPPATH.'data'.DS.'config'.DS.$property.'.php', $property);
        $existing_properties = \Config::get($property, array());

        // We add the application templates we want to add
        $new_properties = array();
		if ($property == 'templates') {
			\Config::load('templates', 'local_templates');
			$new_properties = \Config::get('local_templates', array());
		}

        if ($add) {
            \Config::load($add.'::metadata', true);
            $config = \Config::get($add.'::metadata', array());
            if (isset($config[$property])) {
                foreach ($config[$property] as $key => $val) {
                    $config[$property][$key]['application'] = $add;
                }
                $new_properties = array_merge($new_properties, $config[$property]);
            }

        }

        // then we get the list of installed applications
        \Config::load(APPPATH.'data'.DS.'config'.DS.'app_installed.php', 'app_installed');
        $app_installed = \Config::get('app_installed', array());
        // and add their templates to the new templates
        foreach ($app_installed as $app_name => $app) {
            if ($app_refresh !== $app_name) {
                \Config::load($app_name.'::metadata', true);
                $config = \Config::get($app_name.'::metadata', array());
                if (isset($config[$property])) {
                    foreach ($config[$property] as $key => $val) {
                        $config[$property][$key]['application'] = $app_name;
                    }
                    $new_properties = array_merge($new_properties, $config[$property]);
                }
            }
        }

        // we don't replace existing templates and get templates which are deleted
        if ($property === 'templates') {
            $deleted_properties = array();
            foreach ($existing_properties as $key => $val) {
                if (!empty($new_properties[$key])) {
                    if (!($remove && isset($val['application']) && $remove === $val['application'])) {
                        $new_properties[$key] = $existing_properties[$key];
                    }
                } else {
                    $deleted_properties[] = $key;
                }
            }

            // we check that deleted templates are not used on the page
            if ($deleted_properties) {
                $pages = Model_Page_Page::find('all', array('where' => array(array('page_template', 'IN', $deleted_properties))));
                if (count($pages) > 0) {
                	print_r($pages);
                    throw new \Exception('Some page include those partials and can therefore not be deleted !');
                }
            }
        }

		// Local templates get replaced, everytime and have priority over applications
		if ($property == 'templates') {
			$new_properties = array_merge($new_properties, \Config::get('local_templates'));
		}

	    if ($property == 'enhancers') {
		    $models = array();
		    foreach ($new_properties as $enhancer => $config) {
			    if (isset($config['models_url_enhanced']) && is_array($config['models_url_enhanced'])) {
				    foreach ($config['models_url_enhanced'] as $model) {
						$models[$model][] = $enhancer;
				    }
			    }
		    }
		    \Config::set('models_url_enhanced', $models);
		    \Config::save(APPPATH.'data'.DS.'config'.DS.'models_url_enhanced.php', 'models_url_enhanced');
	    }

	    // if none of the page use the template, we save the new configuration
        \Config::set($property, $new_properties);
        \Config::save(APPPATH.'data'.DS.'config'.DS.$property.'.php', $property);

        return true;

    }

    protected static function _refresh_dependencies(array $params = array()) {
        $add = isset($params['add']) ? $params['add'] : false;
        $remove = isset($params['remove']) ? $params['remove'] : false;
        $app_refresh = $add ? $add : $remove;

        $dependencies = array();
        if ($add) {
            \Config::load($add.'::metadata', true);
            $config = \Config::get($add.'::metadata', array());

            if (isset($config['extends'])) {
                if (!isset($dependencies[$config['extends']])) {
                    $dependencies[$config['extends']] = array();
                }
                $dependencies[$config['extends']][] = $app_refresh;
            }
        }

        \Config::load(APPPATH.'data'.DS.'config'.DS.'app_installed.php', 'app_installed');
        $app_installed = \Config::get('app_installed', array());

        foreach ($app_installed as $app_name => $app) {
            if ($app_refresh !== $app_name) {
                \Config::load($app_name.'::metadata', true);
                $config = \Config::get($app_name.'::metadata', array());
                if (isset($config['extends'])) {
                    if (!isset($dependencies[$config['extends']])) {
                        $dependencies[$config['extends']] = array();
                    }
                    $dependencies[$config['extends']][] = $app_name;
                }
            }
        }

        \Config::set('app_dependencies', $dependencies);
        \Config::save(APPPATH.'data'.DS.'config'.DS.'app_dependencies.php', $dependencies);
    }

    public function addPermission() {
    	Permission::add($this->name, 'access');
    }
}